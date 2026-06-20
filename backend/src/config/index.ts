import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/smart_heating',
  },
  openWeather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    defaultLocation: 'Kokkola,FI', // Near the cottage area
  },
  nordPool: {
    apiUrl: process.env.NORDPOOL_API_URL || 'https://dashboard.elering.ee/api',
    region: 'FI',
  },
  shelly: {
    apiUrl: process.env.SHELLY_API_URL || 'https://shelly-13.shelly.cloud',
    authKey: process.env.SHELLY_AUTH_KEY || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};
