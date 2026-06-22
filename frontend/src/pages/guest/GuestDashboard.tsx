import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GuestRoomCard from '../../components/guest/GuestRoomCard';
import GuestModeSelector, { ModeType } from '../../components/guest/GuestModeSelector';
import GuestHelpModal from '../../components/guest/GuestHelpModal';
import GuestVoiceModal from '../../components/guest/GuestVoiceModal';

interface RoomState {
  id: string;
  nameFi: string;
  icon: string;
  currentTemp: number;
  targetTemp: number;
  isActive: boolean;
}

const initialRooms: RoomState[] = [
  { id: 'living', nameFi: 'Olohuone', icon: '🛋️', currentTemp: 21, targetTemp: 21, isActive: true },
  { id: 'bedroom', nameFi: 'Makuuhuone', icon: '🛏️', currentTemp: 20, targetTemp: 20, isActive: true },
  { id: 'utility', nameFi: 'Kodinhoitohuone', icon: '🧺', currentTemp: 22, targetTemp: 22, isActive: true },
  { id: 'storage', nameFi: 'Varasto', icon: '📦', currentTemp: 15, targetTemp: 15, isActive: false },
];

const modes: Record<ModeType, Record<string, number>> = {
  home: { living: 21, bedroom: 20, utility: 22, storage: 15 },
  away: { living: 17, bedroom: 16, utility: 18, storage: 12 },
  eco: { living: 19, bedroom: 18, utility: 20, storage: 14 },
  comfort: { living: 23, bedroom: 22, utility: 24, storage: 16 },
};

const GuestDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<RoomState[]>(initialRooms);
  const [activeMode, setActiveMode] = useState<ModeType>('home');
  const [helpOpen, setHelpOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleTempChange = (roomId: string, delta: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newTemp = r.targetTemp + delta;
        if (newTemp < 10 || newTemp > 30) return r;
        return { ...r, targetTemp: newTemp };
      })
    );
  };

  const handleModeChange = (mode: ModeType) => {
    setActiveMode(mode);
    const newTemps = modes[mode];
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        targetTemp: newTemps[r.id] ?? r.targetTemp,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-purple-600 p-4 pb-32">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 mb-4 text-center shadow-lg">
        <h1 className="text-5xl font-bold text-gray-800">🏠 Lämmitys</h1>
      </div>

      {/* Winter Warning */}
      <div className="bg-yellow-50 border-l-[6px] border-yellow-400 p-4 mb-4 rounded-xl text-xl text-yellow-800 font-semibold">
        ⚠️ Talvella kodinhoitohuoneen lämpötila ei saa laskea alle 15°C!
      </div>

      {/* Room Cards */}
      {rooms.map((room) => (
        <GuestRoomCard
          key={room.id}
          nameFi={room.nameFi}
          icon={room.icon}
          currentTemp={room.currentTemp}
          targetTemp={room.targetTemp}
          isActive={room.isActive}
          onChangeTemp={(delta) => handleTempChange(room.id, delta)}
        />
      ))}

      {/* Quick Actions */}
      <GuestModeSelector activeMode={activeMode} onModeChange={handleModeChange} />

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-3 shadow-lg">
        <button
          onClick={() => setHelpOpen(true)}
          className="flex-1 py-5 bg-yellow-400 text-gray-800 rounded-xl text-2xl font-bold flex items-center justify-center gap-2"
        >
          <span>❓</span>
          <span>Ohje</span>
        </button>
        <button
          onClick={() => setVoiceOpen(true)}
          className="flex-1 py-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl text-2xl font-bold flex items-center justify-center gap-2"
        >
          <span>🎤</span>
          <span>Ääniohjaus</span>
        </button>
        <Link
          to="/login"
          className="flex-1 py-5 bg-gray-200 text-gray-800 rounded-xl text-2xl font-bold flex items-center justify-center gap-2"
        >
          <span>🔐</span>
          <span>Kirjaudu</span>
        </Link>
      </div>

      {/* Modals */}
      <GuestHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <GuestVoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};

export default GuestDashboard;