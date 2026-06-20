import { Router } from 'express';
import { sensorController } from '../controllers/sensorController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', sensorController.getAll);
router.get('/:id', sensorController.getById);
router.post('/', authorizeAdmin, sensorController.create);
router.put('/:id', authorizeAdmin, sensorController.update);
router.delete('/:id', authorizeAdmin, sensorController.delete);
router.get('/:id/readings', sensorController.getReadings);

export default router;
