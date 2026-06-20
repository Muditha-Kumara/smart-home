import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Settings, BarChart3, Cpu, RefreshCw, Cloud, Zap, Thermometer, Shield } from 'lucide-react';
import api from '../../services/api';
import { DashboardOverview, Unit } from '../../types';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    const interval = setInterval(() => fetchOverview(), 30000);
    return () => clearInterval(interval);
  }, []);

  const getControlModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      WEEKLY_SCHEDULE: 'Viikkokello',
      SPOT_PRICE: 'Pörssisähkö',
      THERMOSTAT: 'Termostaatti',
      SCENE: 'Kohtaus',
      MANUAL: 'Manuaalinen',
    };
    return labels[mode] || mode;
  };

  const getControlModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      WEEKLY_SCHEDULE: 'bg-blue-100 text-blue-700',
      SPOT_PRICE: 'bg-green-100 text-green-700',
      THERMOSTAT: 'bg-orange-100 text-orange-700',
      SCENE: 'bg-purple-100 text-purple-700',
      MANUAL: 'bg-gray-100 text-gray-700',
    };
    return colors[mode] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Hallintapaneeli</h1>
            <p className="text-sm text-gray-600">Tervetuloa, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOverview(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Päivitä"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/admin/sensors')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Anturit"
            >
              <Cpu className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/admin/energy')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Energia"
            >
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Kirjaudu ulos"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ulkolämpötila</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.weather?.temperature.toFixed(1) || '--'}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sähkön hinta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.electricityPrice.current
                    ? (overview.electricityPrice.current.pricePerKwh * 100).toFixed(1)
                    : '--'} snt/kWh
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Thermometer className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktiiviset huoneet</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.units.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Järjestelmä</p>
                <p className="text-lg font-bold text-green-600">Toiminnassa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Control Cards */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lämmitysohjaukset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview?.units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{unit.nameFi}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getControlModeColor(unit.currentMode)}`}>
                    {getControlModeLabel(unit.currentMode)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lämpötila</span>
                    <span className="font-semibold">
                      {unit.latestReading?.temperature
                        ? `${unit.latestReading.temperature.toFixed(1)}°C`
                        : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tavoite</span>
                    <span className="font-semibold">{unit.defaultTemp}°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lämmitys</span>
                    <span className={`font-semibold ${unit.latestReading?.relayState ? 'text-red-600' : 'text-gray-500'}`}>
                      {unit.latestReading?.relayState ? 'PÄÄLLÄ' : 'POIS'}
                    </span>
                  </div>
                  {unit.latestReading?.humidity && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kosteus</span>
                      <span className="font-semibold">{unit.latestReading.humidity.toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Turvaraja</span>
                    <span className="font-semibold">{unit.minTemp}°C - {unit.maxTemp}°C</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 text-xs bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    Muokkaa
                  </button>
                  <button className="flex-1 text-xs bg-orange-50 text-orange-700 py-2 rounded-lg hover:bg-orange-100 transition-colors font-medium">
                    Optimoi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Järjestelmän valvonta</h2>
          <div className="space-y-3">
            {overview?.units
              .filter(u => u.latestReading?.temperature && u.latestReading.temperature < u.minTemp + 2)
              .map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Shield className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">
                    <strong>{u.nameFi}</strong>: Lämpötila lähellä minimirajaa ({u.latestReading?.temperature.toFixed(1)}°C / min {u.minTemp}°C)
                  </p>
                </div>
              ))}
            {overview?.units.filter(u => u.latestReading?.temperature && u.latestReading.temperature < u.minTemp + 2).length === 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700">Kaikki järjestelmät toimivat normaalisti. Ei hälytyksiä.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
