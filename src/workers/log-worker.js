import { Kafka } from 'kafkajs';
import db from '../config/database.js';

const kafka = new Kafka({ clientId: 'log-processor', brokers: [process.env.KAFKA_BROKER] });
const consumer = kafka.consumer({ groupId: 'log-group-storage' });

const startWorker = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'logging-system', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { platform, data } = JSON.parse(message.value.toString());

            try {
                const targetTable = `log_${platform}s`; 

                await db(targetTable).insert(data);
                console.log(`[Worker] Successfully logged ${platform} data`);
            } catch (error) {
                console.error(`[Worker] Error inserting ${platform} log:`, error.message);
            }
        },
    });
};

startWorker();