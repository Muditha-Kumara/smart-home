import axios from 'axios';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class ShellyService {
  private apiUrl = config.shelly.apiUrl;
  private authKey = config.shelly.authKey;

  async getDeviceStatus(deviceId: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/device/status`, {
        params: { id: deviceId, auth_key: this.authKey },
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to get Shelly device status', { deviceId, error });
      throw error;
    }
  }

  async setRelayState(deviceId: string, channel: number, turn: 'on' | 'off') {
    try {
      const response = await axios.get(`${this.apiUrl}/device/relay/control`, {
        params: {
          id: deviceId,
          auth_key: this.authKey,
          channel,
          turn,
        },
      });
      logger.info('Relay state changed', { deviceId, channel, turn });
      return response.data;
    } catch (error) {
      logger.error('Failed to set relay state', { deviceId, error });
      throw error;
    }
  }

  async getDeviceList() {
    try {
      const response = await axios.get(`${this.apiUrl}/device/list`, {
        params: { auth_key: this.authKey },
      });
      return response.data.devices || [];
    } catch (error) {
      logger.error('Failed to get device list', { error });
      throw error;
    }
  }

  async pollAllSensors() {
    const sensors = await prisma.sensor.findMany({
      where: { isActive: true, shellyDeviceId: { not: null } },
      include: { unit: true },
    });

    const readings = [];
    for (const sensor of sensors) {
      try {
        const status = await this.getDeviceStatus(sensor.shellyDeviceId!);
        
        const reading = await prisma.sensorReading.create({
          data: {
            sensorId: sensor.id,
            unitId: sensor.unitId,
            temperature: status.temperature?.tC || null,
            humidity: status.humidity?.value || null,
            power: status.meters?.[0]?.power || null,
            energy: status.meters?.[0]?.total || null,
            relayState: status.relays?.[sensor.channel]?.ison || null,
            voltage: status.meters?.[0]?.voltage || null,
          },
        });
        readings.push(reading);
      } catch (error) {
        logger.error('Failed to poll sensor', { sensorId: sensor.id, error });
      }
    }
    return readings;
  }
}

export const shellyService = new ShellyService();
