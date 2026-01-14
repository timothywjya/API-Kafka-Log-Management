import 'dotenv/config';
import app from './app/app.js';
import { connectKafka } from './config/kafka.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectKafka();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();