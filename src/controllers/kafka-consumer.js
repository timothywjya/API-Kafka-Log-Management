import { Kafka } from 'kafkajs';
import db from '../config/database.js';

const kafka = new Kafka({ clientId: 'log-worker', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'logging-group' });

const runWorker = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'system-logs' });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { platform, data } = JSON.parse(message.value.toString());

            const tableName = `log_${platform}s`;

            try {
                await db(tableName).insert(data);
                console.log(`[${new Date().toISOString()}] Saved ${platform} log.`);
            } catch (err) {
                console.error(`Failed to save log for ${platform}:`, err.message);
            }
        }
    });
};

runWorker();