import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Thermometer, Droplets, Power, Cloud, Zap, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { DashboardOverview, Unit } from '../../types';
import TemperatureSlider from '../../components/user/TemperatureSlider';
import RoomCard from '../../components/user/RoomCard';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await api.get<{ success: boolean; data: DashboardOverview }>('/dashboard/overview');
      setOverview(res.data.data);
    } catch (err) {
      console.error('Failed to fetch overview', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(() => fetchOverview(), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Älykäs Lämmitys</h1>
            <p className="text-sm text-gray-600">Tervetuloa, {user?.firstName}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOverview(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Weather Card */}
        {overview?.weather && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Ulkolämpötila</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {overview.weather.temperature.toFixed(1)}°C
                </p>
                <p className="text-gray-600 mt-1">{overview.weather.description}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">
                  Tuntuu: {overview.weather.feelsLike?.toFixed(1)}°C
                </p>
                <p className="text-sm text-gray-600">
                  Kosteus: {overview.weather.humidity}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Electricity Price */}
        {overview?.electricityPrice && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Sähkön hinta</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {overview.electricityPrice.current
                    ? (overview.electricityPrice.current.pricePerKwh * 100).toFixed(2)
                    : '--'}
                  <span className="text-lg text-gray-600 ml-1">snt/kWh</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">Tämänhetkinen hinta</p>
              </div>
              {overview.electricityPrice.average && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Päivän keskiarvo</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {(overview.electricityPrice.average * 100).toFixed(2)} snt/kWh
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room Cards */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Huoneet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview?.units.map((unit) => (
              <RoomCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>

        {/* Temperature Control */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lämpötilan säätö</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview?.units
              .filter((u) => u.unitType !== 'WATER_HEATER' && u.unitType !== 'HEAT_PUMP')
              .map((unit) => (
                <TemperatureSlider key={unit.id} unit={unit} />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
