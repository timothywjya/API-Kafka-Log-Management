import express from 'express';
import { getProgramDetail } from '../controllers/programs-detail-controller.js';

const router = express.Router();

router.get('/programs-detail-by-ids', getProgramDetail);

router.get('/programs-detail-by-name', getProgramDetail);

router.get('/programs-detail-by-group', getProgramDetail);

router.get('/programs-detail-by-types', getProgramDetail);

router.get('/programs-detail-all', getProgramDetail);

export default router;