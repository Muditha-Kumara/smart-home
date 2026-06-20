import cron from 'node-cron';
import { weatherService } from '../services/weatherService';
import { electricityPriceService } from '../services/electricityPriceService';
import { shellyService } from '../services/shellyService';
import logger from './logger';

export function setupCronJobs() {
  // Fetch weather every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      logger.info('Cron: Fetching weather data');
      await weatherService.fetchCurrentWeather();
    } catch (error) {
      logger.error('Cron: Weather fetch failed', { error });
    }
  });

  // Fetch electricity prices every hour
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('Cron: Fetching electricity prices');
      await electricityPriceService.fetchCurrentPrices();
    } catch (error) {
      logger.error('Cron: Electricity price fetch failed', { error });
    }
  });

  // Poll Shelly sensors every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      logger.info('Cron: Polling Shelly sensors');
      await shellyService.pollAllSensors();
    } catch (error) {
      logger.error('Cron: Sensor polling failed', { error });
    }
  });

  logger.info('✅ Cron jobs scheduled');
}
