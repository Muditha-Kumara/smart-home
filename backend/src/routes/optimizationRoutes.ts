import { Router } from 'express';
import { optimizationController } from '../controllers/optimizationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:unitId/history', optimizationController.getHistory);
router.post('/:unitId/generate', optimizationController.getOptimization);
router.put('/:id/apply', optimizationController.applyOptimization);

export default router;
