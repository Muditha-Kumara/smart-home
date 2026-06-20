import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, TrendingDown } from 'lucide-react';
import api from '../../services/api';
import { Unit } from '../../types';

const AdminEnergy: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      fetchEnergyData();
    }
  }, [selectedUnit, period]);

  const fetchUnits = async () => {
    try {
      const res = await api.get<{ success: boolean; data: Unit[] }>('/units');
      setUnits(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedUnit(res.data.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch units', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnergyData = async () => {
    // Energy data fetching logic would go here
    console.log('Fetching energy data for', selectedUnit, 'period:', period);
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energiankulutus</h1>
              <p className="text-sm text-gray-600">Seuraa sähkönkulutusta ja kustannuksia</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Huone / Laite
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.nameFi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ajanjakso
              </label>
              <div className="flex gap-2">
                {(['day', 'week', 'month', 'year'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'day' && 'Päivä'}
                    {p === 'week' && 'Viikko'}
                    {p === 'month' && 'Kuukausi'}
                    {p === 'year' && 'Vuosi'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kulutus</p>
                <p className="text-2xl font-bold text-gray-900">12.5 kWh</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kustannus</p>
                <p className="text-2xl font-bold text-gray-900">0.85 €</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Keskiarvo</p>
                <p className="text-2xl font-bold text-gray-900">1.8 kWh/päivä</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Energiankulutuksen kuvaaja</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Kuvaaja ladataan tähän (Recharts)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEnergy;
