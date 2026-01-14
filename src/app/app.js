import express from 'express';
import privateRoutes from '../web/private-route.js';
import publicRoutes from '../web/public-route.js';

const app = express();
app.use(express.json());

app.use('/api/public', publicRoutes);
app.use('/api/private', privateRoutes);

export default app;