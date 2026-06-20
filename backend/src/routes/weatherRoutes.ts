import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { weatherService } from '../services/weatherService';

const router = Router();

router.use(authenticate);

router.get('/current', async (_req, res, next) => {
  try {
    const weather = await weatherService.fetchCurrentWeather();
    res.json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
});

router.get('/forecast', async (_req, res, next) => {
  try {
    const forecast = await weatherService.fetchForecast();
    res.json({ success: true, data: forecast });
  } catch (error) {
    next(error);
  }
});

router.get('/latest', async (_req, res, next) => {
  try {
    const weather = await weatherService.getLatestWeather();
    res.json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
});

export default router;
