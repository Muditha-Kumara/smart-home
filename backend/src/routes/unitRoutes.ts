import { Router } from 'express';
import { unitController } from '../controllers/unitController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', unitController.getAll);
router.get('/:id', unitController.getById);
router.post('/', authorizeAdmin, unitController.create);
router.put('/:id', authorizeAdmin, unitController.update);
router.delete('/:id', authorizeAdmin, unitController.delete);
router.get('/:id/readings', unitController.getLatestReadings);
router.get('/:id/energy', unitController.getEnergyRecords);

export default router;
