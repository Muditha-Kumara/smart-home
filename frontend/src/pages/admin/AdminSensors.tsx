import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Cpu, Thermometer, Droplets, Zap } from 'lucide-react';
import api from '../../services/api';
import { Sensor, Unit } from '../../types';

const AdminSensors: React.FC = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sensorsRes, unitsRes] = await Promise.all([
        api.get<{ success: boolean; data: Sensor[] }>('/sensors'),
        api.get<{ success: boolean; data: Unit[] }>('/units'),
      ]);
      setSensors(sensorsRes.data.data);
      setUnits(unitsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'TEMPERATURE':
      case 'FLOOR_TEMP':
        return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'HUMIDITY':
      case 'AMBIENT':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'POWER_METER':
      case 'RELAY':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      default:
        return <Cpu className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSensorTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TEMPERATURE: 'Lämpötila',
      HUMIDITY: 'Kosteus',
      POWER_METER: 'Tehomittari',
      RELAY: 'Rele',
      FLOOR_TEMP: 'Lattialämpötila',
      AMBIENT: 'Ympäristö',
    };
    return labels[type] || type;
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
              <h1 className="text-2xl font-bold text-gray-900">Antureiden hallinta</h1>
              <p className="text-sm text-gray-600">Hallinnoi Shelly-laitteita ja antureita</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Lisää anturi</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => {
            const unit = units.find(u => u.id === sensor.unitId);
            return (
              <div key={sensor.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getSensorIcon(sensor.sensorType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                      <p className="text-sm text-gray-600">{unit?.nameFi}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${sensor.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tyyppi</span>
                    <span className="font-medium">{getSensorTypeLabel(sensor.sensorType)}</span>
                  </div>
                  {sensor.shellyModel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Malli</span>
                      <span className="font-medium">{sensor.shellyModel}</span>
                    </div>
                  )}
                  {sensor.shellyDeviceId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Laite ID</span>
                      <span className="font-mono text-xs">{sensor.shellyDeviceId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kanava</span>
                    <span className="font-medium">{sensor.channel}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Edit className="w-3 h-3" />
                    Muokkaa
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    <Trash2 className="w-3 h-3" />
                    Poista
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminSensors;
