import OpenAI from 'openai';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: config.openai.apiKey });

export class LLMService {
  async optimizeHeating(unitId: string, userId: string) {
    try {
      // Gather context
      const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: { sensors: true, schedules: true },
      });

      if (!unit) throw new Error('Unit not found');

      // Get latest sensor readings
      const latestReadings = await prisma.sensorReading.findFirst({
        where: { unitId },
        orderBy: { recordedAt: 'desc' },
      });

      // Get weather forecast
      const weather = await prisma.weatherData.findFirst({
        orderBy: { fetchedAt: 'desc' },
      });

      // Get electricity prices for today
      const today = new Date();
      const prices = await prisma.electricityPrice.findMany({
        where: {
          timestamp: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lte: new Date(today.setHours(23, 59, 59, 999)),
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      const inputContext = {
        unit: {
          name: unit.nameFi,
          type: unit.unitType,
          currentMode: unit.currentMode,
          minTemp: unit.minTemp,
          maxTemp: unit.maxTemp,
          defaultTemp: unit.defaultTemp,
        },
        currentTemp: latestReadings?.temperature,
        currentHumidity: latestReadings?.humidity,
        relayState: latestReadings?.relayState,
        weather: weather ? {
          outsideTemp: weather.temperature,
          feelsLike: weather.feelsLike,
          description: weather.description,
        } : null,
        electricityPrices: prices.map(p => ({
          hour: new Date(p.timestamp).getHours(),
          price: p.pricePerKwh,
        })),
        schedules: unit.schedules.filter(s => s.isEnabled),
      };

      // Build prompt
      const prompt = this.buildOptimizationPrompt(inputContext);

      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'Olet älykkään lämmityksen optimointiavustaja. Analysoi lämpötila, sää, ja sähkön hinnat. Anna konkreettisia suosituksia energian säästämiseksi suomeksi. Vastaa JSON-muodossa.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const recommendation = JSON.parse(completion.choices[0].message.content || '{}');

      // Store optimization result
      const optimization = await prisma.optimization.create({
        data: {
          unitId,
          userId,
          inputContext: inputContext as any,
          recommendation: recommendation as any,
          suggestedTemp: recommendation.suggestedTemp,
          estimatedSaving: recommendation.estimatedSaving,
          status: 'PENDING',
        },
      });

      logger.info('Optimization generated', { unitId, suggestedTemp: recommendation.suggestedTemp });
      return optimization;
    } catch (error) {
      logger.error('LLM optimization failed', { unitId, error });
      throw error;
    }
  }

  private buildOptimizationPrompt(context: any): string {
    return `
Analysoi seuraavat tiedot ja anna lämmitysoptimointisuositus:

HUONE: ${context.unit.name}
Tyyppi: ${context.unit.type}
Nykyinen tila: ${context.unit.currentMode}

NYKYINEN TILANNE:
- Sisälämpötila: ${context.currentTemp || 'Ei tietoa'}°C
- Kosteus: ${context.currentHumidity || 'Ei tietoa'}%
- Lämmitys päällä: ${context.relayState ? 'Kyllä' : 'Ei'}

ULKOLOLUT:
- Ulkolämpötila: ${context.weather?.outsideTemp || 'Ei tietoa'}°C
- Tuntuu kuin: ${context.weather?.feelsLike || 'Ei tietoa'}°C
- Sää: ${context.weather?.description || 'Ei tietoa'}

SÄHKÖNHINNAT (EUR/kWh):
${context.electricityPrices.map((p: any) => `  Klo ${p.hour}: ${p.price.toFixed(4)}`).join('\n')}

TURVARAJAT:
- Minimi lämpötila: ${context.unit.minTemp}°C
- Maksimi lämpötila: ${context.unit.maxTemp}°C
- Oletuslämpötila: ${context.unit.defaultTemp}°C

Anna suositus JSON-muodossa:
{
  "suggestedTemp": <suositeltu lämpötila>,
  "reasoning": "<perustelu suomeksi>",
  "estimatedSaving": <arvioitu säästö EUR/päivä>,
  "optimalHeatingHours": [<edullisimmat tunnit>],
  "warnings": [<mahdolliset varoitukset>],
  "recommendation": "<lyhyt suositus käyttäjälle>"
}
    `.trim();
  }
}

export const llmService = new LLMService();
