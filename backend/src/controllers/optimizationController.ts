import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { llmService } from '../services/llmService';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class OptimizationController {
  async getOptimization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const unitId = req.params.unitId as string;
      const optimization = await llmService.optimizeHeating(unitId, req.userId!);
      res.json({ success: true, data: optimization });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const unitId = req.params.unitId as string;
      const { limit = 10 } = req.query;
      const optimizations = await prisma.optimization.findMany({
        where: { unitId },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
      });
      res.json({ success: true, data: optimizations });
    } catch (error) {
      next(error);
    }
  }

  async applyOptimization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const optimization = await prisma.optimization.update({
        where: { id },
        data: { status: 'APPLIED', appliedAt: new Date() },
      });
      logger.info('Optimization applied', { optimizationId: id });
      res.json({ success: true, data: optimization });
    } catch (error) {
      next(error);
    }
  }
}

export const optimizationController = new OptimizationController();