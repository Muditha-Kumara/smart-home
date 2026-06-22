import React from 'react';

interface GuestVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuestVoiceModal: React.FC<GuestVoiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-8xl mb-5 animate-bounce">🎤</div>
        <h2 className="text-3xl font-bold mb-5 text-gray-800">Ääniohjaus</h2>
        <div className="text-2xl text-gray-600 leading-relaxed mb-6 space-y-4 text-left">
          <p>Puhu nyt!</p>
          <p>
            Esimerkiksi:<br />
            "Lämmitä olohuone 23 asteeseen"<br />
            "Laske makuuhuoneen lämpötilaa"
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-5 bg-indigo-500 text-white rounded-xl text-2xl font-bold hover:bg-indigo-600 transition-colors mb-3"
        >
          Lopeta
        </button>
        <button
          onClick={onClose}
          className="w-full py-5 bg-gray-200 text-gray-800 rounded-xl text-2xl font-bold hover:bg-gray-300 transition-colors"
        >
          Sulje
        </button>
      </div>
    </div>
  );
};

export default GuestVoiceModal;