import * as amqp from 'amqplib';

/**
 * The function will add the domain and domain id as a message to a queue
 * @param domain The domain to send for analysis
 * @param id The domain id send for analysis
 * @param channel the amqplib (RabbitMq) channel used to publish the message
 */
const addMessageToAnalysisDomainQueue = async (domain:string, id:number, channel:amqp.Channel) => {
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    const message = JSON.stringify({domain, id});
    await channel.sendToQueue(process.env.RABBITMQ_QUEUE, Buffer.from(message), { persistent: true });
}

export default {
    addMessageToAnalysisDomainQueue
}