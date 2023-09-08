import * as cron from "cron"
import postgresService from "./postgres.service";
import rabbitmqService from "./rabbitmq.service";

let secondsAnalysisInterval = 60

const getAndLaunchDomainAnalysis = async () => {
    let domainsToAnalyse = await getDomainToAnalyze();
    let promises = [];
    domainsToAnalyse.forEach(domain => {
        promises.push(updateDomainProgressStatus(domain.domain, true));
        promises.push(rabbitmqService.addMessageToAnalysisDomainQueue(domain.domain, domain.id));
    });

}

const updateDomainProgressStatus = async (domain, status) => {
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
                last_analyzed < NOW() - INTERVAL '${secondsAnalysisInterval} seconds'
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

var job = new cron.CronJob(
    '*/10 * * * * *',
    getAndLaunchDomainAnalysis,
    null,
    true,
    'UTC'
);