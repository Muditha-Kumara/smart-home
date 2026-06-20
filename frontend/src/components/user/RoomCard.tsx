import React from 'react';
import { Thermometer, Droplets, Power } from 'lucide-react';
import { Unit } from '../../types';

interface RoomCardProps {
  unit: Unit;
}

const RoomCard: React.FC<RoomCardProps> = ({ unit }) => {
  const temp = unit.latestReading?.temperature;
  const humidity = unit.latestReading?.humidity;
  const isHeating = unit.latestReading?.relayState;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{unit.nameFi}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isHeating ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {isHeating ? 'Lämmitys päällä' : 'Lämmitys pois'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Lämpötila</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {temp ? `${temp.toFixed(1)}°C` : '--'}
          </span>
        </div>

        {humidity !== null && humidity !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Kosteus</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {humidity.toFixed(0)}%
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Tila</span>
          <span className="text-sm font-medium text-gray-900">
            {unit.currentMode === 'THERMOSTAT' && 'Termostaatti'}
            {unit.currentMode === 'WEEKLY_SCHEDULE' && 'Viikkoajastus'}
            {unit.currentMode === 'SPOT_PRICE' && 'Pörssisähkö'}
            {unit.currentMode === 'SCENE' && 'Kohtaus'}
            {unit.currentMode === 'MANUAL' && 'Manuaalinen'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
