import axios from 'axios';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class WeatherService {
  async fetchCurrentWeather(location: string = config.openWeather.defaultLocation) {
    try {
      const response = await axios.get(`${config.openWeather.baseUrl}/weather`, {
        params: {
          q: location,
          appid: config.openWeather.apiKey,
          units: 'metric',
          lang: 'fi',
        },
      });

      const data = response.data;
      const weather = await prisma.weatherData.create({
        data: {
          location,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
          forecastDate: new Date(),
        },
      });

      logger.info('Weather fetched', { location, temp: data.main.temp });
      return weather;
    } catch (error) {
      logger.error('Failed to fetch weather', { error });
      throw error;
    }
  }

  async fetchForecast(location: string = config.openWeather.defaultLocation, days: number = 5) {
    try {
      const response = await axios.get(`${config.openWeather.baseUrl}/forecast`, {
        params: {
          q: location,
          appid: config.openWeather.apiKey,
          units: 'metric',
          lang: 'fi',
          cnt: days * 8, // 3-hour intervals
        },
      });

      return response.data.list.map((item: any) => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        description: item.weather[0].description,
      }));
    } catch (error) {
      logger.error('Failed to fetch forecast', { error });
      throw error;
    }
  }

  async getLatestWeather(location: string = config.openWeather.defaultLocation) {
    return prisma.weatherData.findFirst({
      where: { location },
      orderBy: { fetchedAt: 'desc' },
    });
  }
}

export const weatherService = new WeatherService();
