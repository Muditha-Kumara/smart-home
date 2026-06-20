export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  phone?: string;
  language: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Unit {
  id: string;
  name: string;
  nameFi: string;
  description?: string;
  unitType: 'ROOM' | 'WATER_HEATER' | 'HEAT_PUMP' | 'HALLWAY' | 'UTILITY';
  ownerId: string;
  isActive: boolean;
  minTemp: number;
  maxTemp: number;
  defaultTemp: number;
  currentMode: 'WEEKLY_SCHEDULE' | 'SPOT_PRICE' | 'THERMOSTAT' | 'SCENE' | 'MANUAL';
  sensors?: Sensor[];
  latestReading?: SensorReading;
}

export interface Sensor {
  id: string;
  name: string;
  sensorType: 'TEMPERATURE' | 'HUMIDITY' | 'POWER_METER' | 'RELAY' | 'FLOOR_TEMP' | 'AMBIENT';
  shellyDeviceId?: string;
  shellyModel?: string;
  unitId: string;
  isActive: boolean;
  channel: number;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  unitId: string;
  temperature?: number;
  humidity?: number;
  power?: number;
  energy?: number;
  relayState?: boolean;
  voltage?: number;
  recordedAt: string;
}

export interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  forecastDate: string;
}

export interface ElectricityPrice {
  id: string;
  region: string;
  pricePerKwh: number;
  timestamp: string;
}

export interface Optimization {
  id: string;
  unitId?: string;
  userId?: string;
  inputContext: any;
  recommendation: any;
  suggestedTemp?: number;
  estimatedSaving?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'APPLIED';
  createdAt: string;
}

export interface DashboardOverview {
  units: Unit[];
  weather?: WeatherData;
  electricityPrice: {
    average?: number;
    current?: ElectricityPrice;
    hours: number;
  };
}
