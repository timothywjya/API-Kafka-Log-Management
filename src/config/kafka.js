import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'log-management-app',
    brokers: [process.env.KAFKA_BROKER]
});

export const producer = kafka.producer();

export const connectKafka = async () => {
    await producer.connect();
    console.log('Kafka Producer Connected');
};