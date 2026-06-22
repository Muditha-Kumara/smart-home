import React, { useState } from 'react';

interface GuestRoomCardProps {
  nameFi: string;
  icon: string;
  currentTemp: number;
  targetTemp: number;
  isActive: boolean;
  minTemp?: number;
  maxTemp?: number;
  onChangeTemp: (delta: number) => void;
}

const GuestRoomCard: React.FC<GuestRoomCardProps> = ({
  nameFi,
  icon,
  currentTemp,
  targetTemp,
  isActive,
  minTemp = 10,
  maxTemp = 30,
  onChangeTemp,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
      {/* Room Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{icon}</span>
          <h3 className="text-4xl font-bold text-gray-800">{nameFi}</h3>
        </div>
        <div
          className={`px-5 py-2 rounded-xl text-2xl font-bold text-white ${
            isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          {isActive ? 'PÄÄLLÄ' : 'POIS'}
        </div>
      </div>

      {/* Temperature Display */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-center mb-5">
        <div className="text-9xl font-bold text-white leading-none drop-shadow-lg">
          {currentTemp}°
        </div>
        <div className="text-2xl text-white mt-3 opacity-95">Nykyinen lämpötila</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onChangeTemp(-1)}
          disabled={targetTemp <= minTemp}
          className="w-20 h-20 rounded-full border-none text-5xl font-bold shadow-lg transition-transform active:scale-90 disabled:opacity-40 bg-gradient-to-br from-red-400 to-pink-500 text-white"
          aria-label="Laske lämpötilaa"
        >
          −
        </button>
        <div className="text-4xl font-bold text-gray-800 min-w-28 text-center">
          Tavoite:
          <br />
          <span>{targetTemp}°</span>
        </div>
        <button
          onClick={() => onChangeTemp(1)}
          disabled={targetTemp >= maxTemp}
          className="w-20 h-20 rounded-full border-none text-5xl font-bold shadow-lg transition-transform active:scale-90 disabled:opacity-40 bg-gradient-to-br from-green-400 to-emerald-500 text-white"
          aria-label="Nosta lämpötilaa"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GuestRoomCard;