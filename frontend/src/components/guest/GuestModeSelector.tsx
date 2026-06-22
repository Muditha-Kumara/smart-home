import React from 'react';

export type ModeType = 'home' | 'away' | 'eco' | 'comfort';

interface GuestModeSelectorProps {
  activeMode: ModeType;
  onModeChange: (mode: ModeType) => void;
}

const modes: { key: ModeType; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'Kotona' },
  { key: 'away', icon: '🚗', label: 'Poissa' },
  { key: 'eco', icon: '🌿', label: 'Säästävä' },
  { key: 'comfort', icon: '😌', label: 'Mukava' },
];

const GuestModeSelector: React.FC<GuestModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mt-4">
      <div className="text-3xl font-bold text-gray-800 mb-4 text-center">⚡ Pika-asetukset</div>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => onModeChange(m.key)}
            className={`py-6 px-4 rounded-xl text-2xl font-bold border-4 transition-all active:scale-95 ${
              activeMode === m.key
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-indigo-500 border-indigo-500'
            }`}
          >
            <span className="text-4xl block mb-2">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuestModeSelector;