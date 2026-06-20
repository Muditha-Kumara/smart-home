import React, { useState } from 'react';
import { ThermometerSun } from 'lucide-react';
import { Unit } from '../../types';

interface TemperatureSliderProps {
  unit: Unit;
}

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ unit }) => {
  const [targetTemp, setTargetTemp] = useState(unit.defaultTemp);
  const [saving, setSaving] = useState(false);

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetTemp(parseFloat(e.target.value));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to update temperature would go here
      console.log('Setting temperature for', unit.name, 'to', targetTemp);
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setSaving(false);
    }
  };

  const getTempColor = (temp: number) => {
    if (temp < 18) return 'text-blue-500';
    if (temp < 22) return 'text-green-500';
    if (temp < 26) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <ThermometerSun className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">{unit.nameFi}</h3>
      </div>

      <div className="text-center mb-6">
        <p className={`text-5xl font-bold ${getTempColor(targetTemp)}`}>
          {targetTemp.toFixed(1)}°C
        </p>
        <p className="text-sm text-gray-600 mt-2">Tavoitelämpötila</p>
      </div>

      <div className="space-y-4">
        <input
          type="range"
          min={unit.minTemp}
          max={unit.maxTemp}
          step={0.5}
          value={targetTemp}
          onChange={handleTempChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{unit.minTemp}°C</span>
          <span>{unit.maxTemp}°C</span>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        {saving ? 'Tallennetaan...' : 'Aseta lämpötila'}
      </button>
    </div>
  );
};

export default TemperatureSlider;
