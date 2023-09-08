import * as amqp from 'amqplib';
import * as axios from "axios"
import postgresService from './postgres.service';


const concurent_limit = process.env.CONCURENT_MESSAGE_HANDLING?parseInt(process.env.CONCURENT_MESSAGE_HANDLING):10

/**
 * Start the message consumption and prepare to get and store necessary data
 * @param msg amqp.ConsumeMessage message to consume
 * @param channel amqp.Channel channel to ack the message
 */
const consumeMessaage = async (msg:amqp.ConsumeMessage, channel:amqp.Channel):Promise<void> => {
    try{
        console.log('Received Message')
        const messageString = msg.content.toString();
        const messageObject = JSON.parse(messageString);
        console.log('Consuming message', messageObject)
        await analyseDomain(messageObject['domain'], messageObject['id']);
        await updateAnalysisDateAndStatus(messageObject['id']);
        await channel.ack(msg);
    }
    catch(err){
        console.log('Error while consuming message');
        console.log(err);
        await channel.ack(msg);
    }
}

/**
 * Get the Whois and Virus total data from their API and store it in the database
 * @param domain string domain to analyse
 * @param domainId number id of the domain to analyse
 */
const analyseDomain = async (domain:string, domainId:number):Promise<void> => {
    let whoIsData = await getWhoIsData(domain);
    let virusTotalData = await getVirusTotalData(domain);
    let query = `
        INSERT INTO domains_analysis_history (domain_id, run_at, whois_data, virus_total_data)
        VALUES ($1, $2, $3, $4)
    `
    let params = [domainId, new Date(), JSON.stringify(whoIsData), JSON.stringify(virusTotalData)];
    await postgresService.query(query, params);
}

/**
 * This function updates the last_analyzed and in_progress fields of the domain
 * @param domainId id of the domain to update
 */
const updateAnalysisDateAndStatus = async (domainId:number):Promise<void> => {
    let query = `
        UPDATE domains
        SET last_analyzed = $1, in_progress = $2
        WHERE id = $3
    `
    let params = [new Date(), false, domainId];
    await postgresService.query(query, params);
}

/**
 * 
 * @param domain string domain to check on whois api
 * @returns whois data for the domain provided
 */
const getWhoIsData = async (domain:string):Promise<{[key:string]:any}> => {
    try{
        let axiosRequest:axios.AxiosRequestConfig={
            method: 'get',
            url:`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOIS_API_KEY}&domainName=${domain}&outputFormat=JSON`
        }
        let response = await axios.default(axiosRequest);
        return response.data?.['WhoisRecord'] || {};
    }
    catch(err){
        console.log('Error while getting whois data');
        console.log(err);
        return {};
    }
}

/**
 * 
 * @param domain string domain to check on virus total api
 * @returns virus total data for the domain provided
 */
const getVirusTotalData = async (domain:string):Promise<{[key:string]:any}> => {
    try{
        let axiosRequest:axios.AxiosRequestConfig={
            method: 'get',
            url:`https://www.virustotal.com/api/v3/domains/${domain}`,
            headers:{
                "x-apikey": process.env.VIRUS_TOTAL_API_KEY
            }
        }
        let response = await axios.default(axiosRequest);
        return response.data?.['data'] || {};
    }
    catch(err){
        console.log('Error while getting virus total data');
        console.log(err);
        return {};
    }
}

//main function launched on startup
const main = async ():Promise<void> => {
    console.log('Starting consumer');
    let connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq3:${process.env.RABBITMQ_PORT}`);
    console.log('Connected to rabbitmq');
    let channel = await connection.createChannel();
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    await channel.prefetch(concurent_limit);
    await channel.consume(process.env.RABBITMQ_QUEUE, (msg)=>consumeMessaage(msg, channel), { noAck: false });
}

main();