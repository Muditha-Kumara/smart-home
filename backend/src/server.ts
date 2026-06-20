import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import { setupCronJobs } from './utils/cronJobs';

// Routes
import authRoutes from './routes/authRoutes';
import unitRoutes from './routes/unitRoutes';
import sensorRoutes from './routes/sensorRoutes';
import optimizationRoutes from './routes/optimizationRoutes';
import weatherRoutes from './routes/weatherRoutes';
import electricityRoutes from './routes/electricityRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.frontendUrl, credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/electricity', electricityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Smart Heating API running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.nodeEnv}`);
  setupCronJobs();
});

export default app;
