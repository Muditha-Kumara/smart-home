# Älykäs Lämmitys - Smart Heating & Spot-Price Optimization Dashboard

A complete smart heating web dashboard for a remote summer cottage (kesämökki) in Finland. Built with React, Node.js, PostgreSQL, and Docker.

## 🎯 Project Overview

This system controls Shelly smart relays and sensors to manage floor heating, hot water, and a heat pump at a Finnish summer cottage. It provides two interfaces:

- **Admin Interface** - Full system management, energy analytics, spot-price optimization
- **User Interface** - Simple temperature control for renters/guests

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│              Port 3000 - Nginx + Vite                    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Backend API (Node.js)                    │
│              Port 5000 - Express + TypeScript            │
├─────────────────────────────────────────────────────────┤
│  • Authentication (JWT)                                  │
│  • Unit/Sensor Management                                │
│  • Weather API Integration (OpenWeatherMap)              │
│  • Electricity Price API (Nord Pool)                     │
│  • Shelly Cloud API Integration                          │
│  • LLM Optimization (OpenAI)                             │
│  • Cron Jobs (Weather, Prices, Sensor Polling)           │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│              PostgreSQL Database                          │
│              Port 5432                                   │
├─────────────────────────────────────────────────────────┤
│  • Users & Authentication                                │
│  • Units (Rooms/Zones)                                   │
│  • Sensors (Shelly devices)                              │
│  • Sensor Readings (Time-series)                         │
│  • Energy Records                                        │
│  • Weather Data                                          │
│  • Electricity Prices                                    │
│  • LLM Optimizations                                     │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
summerProject/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helpers (logger, cron)
│   │   └── server.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Sample data
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── admin/         # Admin-specific
│   │   │   ├── user/          # User-specific
│   │   │   └── common/        # Shared components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   └── user/          # User pages
│   │   ├── services/          # API client
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── context/           # React context (Auth)
│   │   ├── utils/             # Helpers
│   │   ├── App.tsx            # Main app
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Tailwind CSS
│   ├── Dockerfile
│   ├── nginx.conf             # Nginx config
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── docker-compose.yml          # Docker orchestration
├── .env.example                # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- API Keys:
  - OpenWeatherMap (weather data)
  - Shelly Cloud (device control)
  - OpenAI (LLM optimization)

### 1. Clone and Setup

```bash
cd summerProject
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start with Docker

```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### 3. Access the Application

**Demo Accounts:**
- Admin: `admin@smartheating.fi` / `admin123`
- User: `vuokralainen@example.fi` / `user123`

## 🔧 Development Setup

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📊 Features

### User Interface (Vuokralaisen näkymä)

- ✅ Simple temperature slider for each room
- ✅ Current room temperature and humidity display
- ✅ Heating status indicators (on/off)
- ✅ Weather forecast card
- ✅ Electricity price display
- ✅ Mobile-first responsive design
- ✅ Finnish language interface

### Admin Interface

- ✅ Full system overview dashboard
- ✅ Unit control mode selector (Weekly Schedule, Spot-Price, Thermostat, Scene)
- ✅ Sensor management (add/edit/delete Shelly devices)
- ✅ Energy analytics (day/week/month/year views)
- ✅ Safety alerts (pipe freezing warnings)
- ✅ LLM-powered heating optimization
- ✅ Electricity price visualization
- ✅ Weather integration

### Backend Features

- ✅ JWT authentication with role-based access
- ✅ Shelly Cloud API integration
- ✅ OpenWeatherMap API integration
- ✅ Nord Pool electricity price fetching
- ✅ OpenAI LLM optimization
- ✅ Cron jobs for automated data fetching
- ✅ PostgreSQL time-series data storage
- ✅ Comprehensive error handling and logging

## 🗄️ Database Schema

- **Users** - Admin and User accounts
- **Units** - Rooms/Zones (Utility, Hallway, Bedroom, Water Heater, Heat Pump)
- **Sensors** - Shelly devices (temperature, humidity, power, relay)
- **SensorReadings** - Time-series sensor data
- **EnergyRecords** - Daily energy consumption aggregation
- **WeatherData** - Weather forecasts
- **ElectricityPrices** - Nord Pool spot prices
- **Optimizations** - LLM recommendations

## 🔌 Hardware Integration

The system integrates with Shelly devices:

- **Kodinhoitohuone**: Shelly Plus 1PM + Add-on + DS18B20 + H&T sensor
- **Eteinen**: Shelly Plus 1PM + Add-on + DS18B20
- **Makuuhuone**: Shelly Plus 1PM + Add-on + DS18B20
- **Lämminvesivaraaja**: Shelly Pro 4PM
- **Ilmalämpöpumppu**: Shelly Pro 1PM

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user

### Units
- `GET /api/units` - List all units
- `GET /api/units/:id` - Get unit details
- `POST /api/units` - Create unit (admin)
- `PUT /api/units/:id` - Update unit (admin)
- `DELETE /api/units/:id` - Delete unit (admin)

### Sensors
- `GET /api/sensors` - List all sensors
- `POST /api/sensors` - Create sensor (admin)
- `PUT /api/sensors/:id` - Update sensor (admin)
- `DELETE /api/sensors/:id` - Delete sensor (admin)

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - 5-day forecast

### Electricity
- `GET /api/electricity/today` - Today's prices
- `GET /api/electricity/cheapest` - Cheapest hours

### Optimization
- `POST /api/optimization/:unitId/generate` - Get LLM recommendation
- `GET /api/optimization/:unitId/history` - Optimization history

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (HTTP client)
- Recharts (charts)
- Lucide React (icons)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Winston (logging)
- Node-cron (scheduled tasks)
- OpenAI API

### Infrastructure
- Docker & Docker Compose
- Nginx (frontend server)
- PostgreSQL 16

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/smart_heating

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# APIs
OPENWEATHER_API_KEY=your_key
SHELLY_API_URL=https://shelly-13.shelly.cloud
SHELLY_AUTH_KEY=your_key
OPENAI_API_KEY=your_key

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## 🎨 UI Design

The user interface follows the design shown in the attached image:
- Clean, modern card-based layout
- Large, touch-friendly controls
- High contrast for readability
- Finnish language throughout
- Mobile-first responsive design

## 📄 License

This project was created as part of a Centria University of Applied Sciences internship project for Jalo Energia Oy.

## 👨‍💻 Author

**Muditha Kumara**  
IT Student - Centria University of Applied Sciences  
Email: muditha.chinthana@gmail.com

## 🙏 Acknowledgments

- **Client**: Jani Moilanen (Jalo Energia Oy)
- **Supervisor**: Aleksi Ukkola (Centria University)

---

**Project Timeline**: May 7, 2026 – September 9, 2026  
**Scope**: 20 ECTS (540 Hours)