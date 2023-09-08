import * as cron from "cron"
import postgresService from "./postgres.service";
import rabbitmqService from "./rabbitmq.service";
import * as amqp from 'amqplib';

// Number of seconds between two analysis of the same domain
let secondsAnalysisInterval = process.env.SECOND_ANLYSIS_INTERVAL?parseInt(process.env.SECOND_ANLYSIS_INTERVAL):31*24*60*60

/**
 * Function started by a scheduler every 10 seconds to check if new domains need to be analyzed, if so launch the analysis of the domains
 */
const getAndLaunchDomainAnalysis = async ():Promise<void> => {
    let domainsToAnalyse = await getDomainToAnalyze();
    let promises = [];
    if(domainsToAnalyse.length == 0) return;
    let connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq3:${process.env.RABBITMQ_PORT}`);
    let channel = await connection.createChannel();
    domainsToAnalyse.forEach(domain => {
        promises.push(updateDomainProgressStatus(domain.domain, true));
        promises.push(rabbitmqService.addMessageToAnalysisDomainQueue(domain.domain, domain.id, channel));
    });
    await Promise.all(promises);
    await channel.close();
    await connection.close();
}

/**
 * Update the in_progres status of a domain in the domains table
 * @param domain Domain to update
 * @param status Status to set
 */
const updateDomainProgressStatus = async (domain:string, status:boolean):Promise<void> => {
    let query = `
        UPDATE
            domains
        SET
            in_progress = $1
        WHERE
            domain = $2
    `;
    await postgresService.query(query, [status, domain]);
}

/**
 * 
 * @returns All the domain not currently in anlysis and that were analyzed more than secondsAnalysisInterval seconds ago
 */
const getDomainToAnalyze = async ():Promise<{domain:string, id:number}[]> => {
    let query = `
        SELECT 
            domain,
            id
        FROM
            domains
        WHERE
            in_progress = false
            AND 
            (
                last_analyzed <= NOW() - INTERVAL '${secondsAnalysisInterval} seconds'
                OR
                last_analyzed IS NULL
            )
    `;
    let domains = await postgresService.query(query, []);
    let result = [];
    domains.forEach(domain => {
        result.push({
            domain: domain['domain'],
            id: domain['id']
        });
    });
    return result;
}

//CRON job definition
var job = new cron.CronJob(
    '*/10 * * * * *',
    getAndLaunchDomainAnalysis,
    null,
    true,
    'UTC'
);