import {Router} from 'express';
import {imageDetection} from '../controllers/ImageDetection.js';

const router = Router();
router.post('/imageCalis', imageDetection);

export default router;