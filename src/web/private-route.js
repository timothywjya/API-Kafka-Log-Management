import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const router = express.Router();

import { logApi } from '../controllers/api-management-controller.js';
import { logApps } from '../controllers/apps-management-controller.js';
import { logDesktop } from '../controllers/desktop-management-controller.js';
import { logWeb } from '../controllers/web-management-controller.js';

const verifyKey = (platform) => (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    const secrets = {
        web: process.env.SECRET_WEB,
        apps: process.env.SECRET_APPS,
        desktop: process.env.SECRET_DESKTOP,
        api: process.env.SECRET_API
    };

    const platformSecret = secrets[platform];

    if (!platformSecret || apiKey !== platformSecret) {
        return res.status(401).json({
            status: 'Failed',
            message: `Unauthorized: Invalid or missing key for ${platform}`
        });
    }

    next();
};

router.post('/web-management', verifyKey('web'), logWeb);
router.post('/apps-management', verifyKey('apps'), logApps);
router.post('/desktop-management', verifyKey('desktop'), logDesktop);
router.post('/api-management', verifyKey('api'), logApi);

export default router;