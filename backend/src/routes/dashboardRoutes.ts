import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { weatherService } from '../services/weatherService';
import { electricityPriceService } from '../services/electricityPriceService';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/overview', async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const units = await prisma.unit.findMany({
      where: userRole === 'ADMIN' ? {} : { ownerId: userId },
      include: {
        sensors: { where: { isActive: true } },
      },
    });

    const unitStatuses = await Promise.all(
      units.map(async (unit) => {
        const latestReading = await prisma.sensorReading.findFirst({
          where: { unitId: unit.id },
          orderBy: { recordedAt: 'desc' },
        });
        return {
          ...unit,
          latestReading,
        };
      })
    );

    const weather = await weatherService.getLatestWeather();
    const todayPrices = await electricityPriceService.getPricesForDate(new Date());
    const avgPrice = todayPrices.length > 0
      ? todayPrices.reduce((sum, p) => sum + p.pricePerKwh, 0) / todayPrices.length
      : null;

    res.json({
      success: true,
      data: {
        units: unitStatuses,
        weather,
        electricityPrice: {
          average: avgPrice,
          current: todayPrices.find(p => {
            const hour = new Date(p.timestamp).getHours();
            return hour === new Date().getHours();
          }),
          hours: todayPrices.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
