import * as amqp from 'amqplib';

const addMessageToAnalysisDomainQueue = async (domain, id) => {
    console.log(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq3`)
    let connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq3:${process.env.RABBITMQ_PORT}`);
    let channel = await connection.createChannel();
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    const message = JSON.stringify({domain, id});
    await channel.sendToQueue('analysis_domain_queue', Buffer.from(message), { persistent: true });
    await channel.close();
    await connection.close();
}

export default {
    addMessageToAnalysisDomainQueue
}