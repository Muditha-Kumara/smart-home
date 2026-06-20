import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import logger from '../utils/logger';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

const prisma = new PrismaClient();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new BadRequestError('Email already registered');

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: role || 'USER',
          phone,
        },
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info('User registered', { userId: user.id, role: user.role });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new UnauthorizedError('Invalid credentials');

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Store session
      await prisma.loginSession.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        },
      });

      logger.info('User logged in', { userId: user.id });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: (req as any).userId },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, language: true },
      });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
