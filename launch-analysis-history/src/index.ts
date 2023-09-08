import * as amqp from 'amqplib';
import postgresService from './postgres.service';

const concurent_limit = 10

const consumeMessaage = async (msg) => {
    try{
        const messageString = msg.content.toString();
        const messageObject = JSON.parse(messageString);
        await analyseDomain(messageObject['domain'], messageObject['id']);
        await msg.ack();
    }
    catch(err){
        console.log('Error while consuming message');
        console.log(err);
        await msg.ack();
    }
}

const analyseDomain = async (domain:string, domainId:number) => {
    let whoIsData = await getWhoIsData(domain);
    let virusTotalData = await getVirusTotalData(domain);
    let query = `
        INSERT INTO domains_analysis_history (domain_id, run_at, whois_data, virus_total_data)
        VALUES ($1, $2, $3, $4)
    `
    let params = [domainId, new Date(), JSON.stringify(whoIsData), JSON.stringify(virusTotalData)];
    await postgresService.query(query, params);
}

const getWhoIsData = async (domain:string) => {

}

const getVirusTotalData = async (domain:string) => {

}

const main = async () => {
    let connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq3:${process.env.RABBITMQ_PORT}`);
    let channel = await connection.createChannel();
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    await channel.prefetch(concurent_limit);
    await channel.consume(process.env.RABBITMQ_QUEUE, consumeMessaage, { noAck: false });
}

main();