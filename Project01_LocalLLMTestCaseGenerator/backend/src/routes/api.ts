import { Router } from 'express';
import { handleGenerate } from '../controllers/generationController';
import { handleTestConnection } from '../controllers/connectionController';

const router = Router();

router.post('/generate', handleGenerate);
router.post('/test-connection', handleTestConnection);

export default router;
