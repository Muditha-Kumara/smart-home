import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { NotFoundError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class SensorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.query;
      const where = unitId ? { unitId: unitId as string } : {};
      const sensors = await prisma.sensor.findMany({
        where,
        include: { unit: { select: { id: true, name: true, nameFi: true } } },
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: sensors });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const sensor = await prisma.sensor.findUnique({
        where: { id: req.params.id },
        include: {
          unit: true,
          readings: { orderBy: { recordedAt: 'desc' }, take: 20 },
        },
      });
      if (!sensor) throw new NotFoundError('Sensor');
      res.json({ success: true, data: sensor });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, sensorType, shellyDeviceId, shellyApiKey, shellyModel, unitId, channel, ipAddress } = req.body;
      const sensor = await prisma.sensor.create({
        data: {
          name,
          sensorType,
          shellyDeviceId,
          shellyApiKey,
          shellyModel,
          unitId,
          channel: channel || 0,
          ipAddress,
        },
      });
      logger.info('Sensor created', { sensorId: sensor.id, unitId });
      res.status(201).json({ success: true, data: sensor });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, sensorType, shellyDeviceId, shellyApiKey, shellyModel, isActive, channel, ipAddress } = req.body;
      const sensor = await prisma.sensor.update({
        where: { id: req.params.id },
        data: { name, sensorType, shellyDeviceId, shellyApiKey, shellyModel, isActive, channel, ipAddress },
      });
      logger.info('Sensor updated', { sensorId: sensor.id });
      res.json({ success: true, data: sensor });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.sensor.delete({ where: { id: req.params.id } });
      logger.info('Sensor deleted', { sensorId: req.params.id });
      res.json({ success: true, message: 'Sensor deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const { hours = 24 } = req.query;
      const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);
      const readings = await prisma.sensorReading.findMany({
        where: {
          sensorId: req.params.id,
          recordedAt: { gte: since },
        },
        orderBy: { recordedAt: 'asc' },
      });
      res.json({ success: true, data: readings });
    } catch (error) {
      next(error);
    }
  }
}

export const sensorController = new SensorController();
