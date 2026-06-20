import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { electricityPriceService } from '../services/electricityPriceService';

const router = Router();

router.use(authenticate);

router.get('/current', async (_req, res, next) => {
  try {
    const prices = await electricityPriceService.fetchCurrentPrices();
    res.json({ success: true, data: prices });
  } catch (error) {
    next(error);
  }
});

router.get('/today', async (_req, res, next) => {
  try {
    const prices = await electricityPriceService.getPricesForDate(new Date());
    res.json({ success: true, data: prices });
  } catch (error) {
    next(error);
  }
});

router.get('/cheapest', async (req, res, next) => {
  try {
    const hours = parseInt(req.query.hours as string) || 6;
    const prices = await electricityPriceService.getCheapestHours(new Date(), hours);
    res.json({ success: true, data: prices });
  } catch (error) {
    next(error);
  }
});

router.get('/average', async (_req, res, next) => {
  try {
    const avg = await electricityPriceService.getAveragePrice(new Date());
    res.json({ success: true, data: { average: avg } });
  } catch (error) {
    next(error);
  }
});

export default router;
