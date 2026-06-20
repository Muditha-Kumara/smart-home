import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class UnitController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const units = await prisma.unit.findMany({
        where: req.userRole === 'ADMIN' ? {} : { ownerId: req.userId },
        include: {
          sensors: { where: { isActive: true } },
          _count: { select: { sensorReadings: true } },
        },
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: units });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await prisma.unit.findUnique({
        where: { id: req.params.id },
        include: {
          sensors: { where: { isActive: true } },
          schedules: { orderBy: { dayOfWeek: 'asc' } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      });
      if (!unit) throw new NotFoundError('Unit');
      res.json({ success: true, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, nameFi, description, unitType, minTemp, maxTemp, defaultTemp } = req.body;
      const unit = await prisma.unit.create({
        data: {
          name,
          nameFi,
          description,
          unitType: unitType || 'ROOM',
          ownerId: req.userId!,
          minTemp: minTemp || 5.0,
          maxTemp: maxTemp || 30.0,
          defaultTemp: defaultTemp || 21.0,
        },
      });
      logger.info('Unit created', { unitId: unit.id, name: unit.name });
      res.status(201).json({ success: true, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, nameFi, description, unitType, minTemp, maxTemp, defaultTemp, currentMode } = req.body;
      const unit = await prisma.unit.update({
        where: { id: req.params.id },
        data: {
          name, nameFi, description, unitType,
          minTemp, maxTemp, defaultTemp, currentMode,
        },
      });
      logger.info('Unit updated', { unitId: unit.id });
      res.json({ success: true, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.unit.delete({ where: { id: req.params.id } });
      logger.info('Unit deleted', { unitId: req.params.id });
      res.json({ success: true, message: 'Unit deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getLatestReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const readings = await prisma.sensorReading.findMany({
        where: { unitId: req.params.id },
        orderBy: { recordedAt: 'desc' },
        take: 50,
      });
      res.json({ success: true, data: readings });
    } catch (error) {
      next(error);
    }
  }

  async getEnergyRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { period = 'week' } = req.query;
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day': startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
        case 'week': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case 'month': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        case 'year': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
        default: startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const records = await prisma.energyRecord.findMany({
        where: {
          unitId: req.params.id,
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
      });
      res.json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  }
}

export const unitController = new UnitController();
