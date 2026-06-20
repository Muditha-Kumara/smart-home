import axios from 'axios';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class ElectricityPriceService {
  async fetchCurrentPrices(region: string = config.nordPool.region) {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const response = await axios.get(
        `${config.nordPool.apiUrl}/nordpool/el-historical-price.fi/${region}/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`
      );

      const prices = response.data.map((item: any) => ({
        region,
        pricePerKwh: item.price / 100, // Convert from EUR/MWh to EUR/kWh
        timestamp: new Date(item.date),
      }));

      // Store in database
      await prisma.electricityPrice.createMany({
        data: prices,
        skipDuplicates: true,
      });

      logger.info('Electricity prices fetched', { region, count: prices.length });
      return prices;
    } catch (error) {
      logger.error('Failed to fetch electricity prices', { error });
      throw error;
    }
  }

  async getPricesForDate(date: Date, region: string = config.nordPool.region) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.electricityPrice.findMany({
      where: {
        region,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async getCheapestHours(date: Date, hours: number, region: string = config.nordPool.region) {
    const prices = await this.getPricesForDate(date, region);
    return prices
      .sort((a, b) => a.pricePerKwh - b.pricePerKwh)
      .slice(0, hours)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getAveragePrice(date: Date, region: string = config.nordPool.region) {
    const prices = await this.getPricesForDate(date, region);
    if (prices.length === 0) return null;
    const sum = prices.reduce((acc, p) => acc + p.pricePerKwh, 0);
    return sum / prices.length;
  }
}

export const electricityPriceService = new ElectricityPriceService();
