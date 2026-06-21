import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartheating.fi' },
    update: {},
    create: {
      email: 'admin@smartheating.fi',
      passwordHash: adminPassword,
      firstName: 'Jani',
      lastName: 'Moilanen',
      role: 'ADMIN',
      phone: '+358442144645',
      language: 'fi',
    },
  });

  // Create User (renter) account
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'vuokralainen@example.fi' },
    update: {},
    create: {
      email: 'vuokralainen@example.fi',
      passwordHash: userPassword,
      firstName: 'Matti',
      lastName: 'Meikäläinen',
      role: 'USER',
      phone: '+358401234567',
      language: 'fi',
    },
  });

  // Create Units (Rooms)
  const utilityRoom = await prisma.unit.upsert({
    where: { id: 'utility-room-001' },
    update: {},
    create: {
      id: 'utility-room-001',
      name: 'Utility Room',
      nameFi: 'Kodinhoitohuone',
      description: 'Main utility room with water pipe on exterior wall',
      unitType: 'UTILITY',
      ownerId: admin.id,
      minTemp: 5.0,
      maxTemp: 30.0,
      defaultTemp: 21.0,
      currentMode: 'THERMOSTAT',
    },
  });

  const hallway = await prisma.unit.upsert({
    where: { id: 'hallway-001' },
    update: {},
    create: {
      id: 'hallway-001',
      name: 'Hallway',
      nameFi: 'Eteinen',
      description: 'Entrance hallway floor heating',
      unitType: 'HALLWAY',
      ownerId: admin.id,
      minTemp: 5.0,
      maxTemp: 28.0,
      defaultTemp: 20.0,
      currentMode: 'WEEKLY_SCHEDULE',
    },
  });

  const bedroom = await prisma.unit.upsert({
    where: { id: 'bedroom-001' },
    update: {},
    create: {
      id: 'bedroom-001',
      name: 'Bedroom',
      nameFi: 'Makuuhuone',
      description: 'Bedroom floor heating',
      unitType: 'ROOM',
      ownerId: admin.id,
      minTemp: 5.0,
      maxTemp: 26.0,
      defaultTemp: 19.0,
      currentMode: 'THERMOSTAT',
    },
  });

  const waterHeater = await prisma.unit.upsert({
    where: { id: 'water-heater-001' },
    update: {},
    create: {
      id: 'water-heater-001',
      name: 'Water Heater',
      nameFi: 'Lämminvesivaraaja',
      description: 'Hot water boiler with spot price optimization',
      unitType: 'WATER_HEATER',
      ownerId: admin.id,
      minTemp: 40.0,
      maxTemp: 70.0,
      defaultTemp: 55.0,
      currentMode: 'SPOT_PRICE',
    },
  });

  const heatPump = await prisma.unit.upsert({
    where: { id: 'heat-pump-001' },
    update: {},
    create: {
      id: 'heat-pump-001',
      name: 'Heat Pump Drain',
      nameFi: 'Ilmalämpöpumppu',
      description: 'Heat pump condensate drain heating cable',
      unitType: 'HEAT_PUMP',
      ownerId: admin.id,
      minTemp: 0.0,
      maxTemp: 30.0,
      defaultTemp: 10.0,
      currentMode: 'THERMOSTAT',
    },
  });

  // Create Sensors
  const sensors = [
    {
      id: 'sensor-utility-temp',
      name: 'Floor Temperature Sensor',
      sensorType: 'FLOOR_TEMP' as const,
      shellyDeviceId: 'shelly_plus_1pm_utility',
      shellyModel: 'Plus 1PM + Add-on + DS18B20',
      unitId: utilityRoom.id,
      channel: 0,
    },
    {
      id: 'sensor-utility-ht',
      name: 'Humidity & Temperature',
      sensorType: 'AMBIENT' as const,
      shellyDeviceId: 'shelly_ht_utility',
      shellyModel: 'Shelly H&T',
      unitId: utilityRoom.id,
      channel: 0,
    },
    {
      id: 'sensor-hallway-temp',
      name: 'Hallway Floor Sensor',
      sensorType: 'FLOOR_TEMP' as const,
      shellyDeviceId: 'shelly_plus_1pm_hallway',
      shellyModel: 'Plus 1PM + Add-on + DS18B20',
      unitId: hallway.id,
      channel: 0,
    },
    {
      id: 'sensor-bedroom-temp',
      name: 'Bedroom Floor Sensor',
      sensorType: 'FLOOR_TEMP' as const,
      shellyDeviceId: 'shelly_plus_1pm_bedroom',
      shellyModel: 'Plus 1PM + Add-on + DS18B20',
      unitId: bedroom.id,
      channel: 0,
    },
    {
      id: 'sensor-water-heater',
      name: 'Water Heater Power Meter',
      sensorType: 'POWER_METER' as const,
      shellyDeviceId: 'shelly_pro_4pm_water',
      shellyModel: 'Pro 4PM',
      unitId: waterHeater.id,
      channel: 0,
    },
    {
      id: 'sensor-heat-pump',
      name: 'Drain Cable Relay',
      sensorType: 'RELAY' as const,
      shellyDeviceId: 'shelly_pro_1pm_pump',
      shellyModel: 'Pro 1PM',
      unitId: heatPump.id,
      channel: 0,
    },
  ];

  for (const sensor of sensors) {
    await prisma.sensor.upsert({
      where: { id: sensor.id },
      update: {},
      create: sensor,
    });
  }

  // Create sample schedules for hallway
  const scheduleData = [
    { unitId: hallway.id, dayOfWeek: 0, startTime: '06:00', endTime: '22:00', targetTemp: 20.0 },
    { unitId: hallway.id, dayOfWeek: 1, startTime: '06:00', endTime: '22:00', targetTemp: 20.0 },
    { unitId: hallway.id, dayOfWeek: 2, startTime: '06:00', endTime: '22:00', targetTemp: 20.0 },
    { unitId: hallway.id, dayOfWeek: 3, startTime: '06:00', endTime: '22:00', targetTemp: 20.0 },
    { unitId: hallway.id, dayOfWeek: 4, startTime: '06:00', endTime: '23:00', targetTemp: 21.0 },
    { unitId: hallway.id, dayOfWeek: 5, startTime: '08:00', endTime: '23:00', targetTemp: 21.0 },
    { unitId: hallway.id, dayOfWeek: 6, startTime: '08:00', endTime: '22:00', targetTemp: 20.0 },
  ];

  for (const schedule of scheduleData) {
    await prisma.schedule.create({ data: schedule });
  }

  // Create sample sensor readings
  const now = new Date();
  for (let i = 0; i < 48; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    const baseTemp = 21 + Math.sin(i / 10) * 2;

    await prisma.sensorReading.createMany({
      data: [
        {
          sensorId: 'sensor-utility-temp',
          unitId: utilityRoom.id,
          temperature: baseTemp + (Math.random() - 0.5),
          humidity: 45 + Math.random() * 10,
          relayState: Math.random() > 0.5,
          power: Math.random() > 0.5 ? 200 + Math.random() * 100 : 0,
          recordedAt: timestamp,
        },
        {
          sensorId: 'sensor-hallway-temp',
          unitId: hallway.id,
          temperature: baseTemp - 1 + (Math.random() - 0.5),
          relayState: Math.random() > 0.6,
          power: Math.random() > 0.6 ? 150 + Math.random() * 80 : 0,
          recordedAt: timestamp,
        },
        {
          sensorId: 'sensor-bedroom-temp',
          unitId: bedroom.id,
          temperature: baseTemp - 2 + (Math.random() - 0.5),
          relayState: Math.random() > 0.7,
          power: Math.random() > 0.7 ? 120 + Math.random() * 60 : 0,
          recordedAt: timestamp,
        },
      ],
    });
  }

  // Create sample electricity prices (24 hours)
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date();
    timestamp.setHours(i, 0, 0, 0);
    const basePrice = 0.05 + Math.sin(i / 4) * 0.03 + Math.random() * 0.02;
    await prisma.electricityPrice.create({
      data: {
        region: 'FI',
        pricePerKwh: Math.max(0.02, basePrice),
        timestamp,
      },
    });
  }

  console.log('✅ Seed completed successfully');
  console.log('📧 Admin login: admin@smartheating.fi / admin123');
  console.log('📧 User login: vuokralainen@example.fi / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
