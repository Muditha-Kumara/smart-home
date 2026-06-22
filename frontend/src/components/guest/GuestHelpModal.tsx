import React from 'react';

interface GuestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuestHelpModal: React.FC<GuestHelpModalProps> = ({ isOpen, onClose }) => {
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
        <div className="text-8xl mb-5">❓</div>
        <h2 className="text-3xl font-bold mb-5 text-gray-800">Ohjeet</h2>
        <div className="text-2xl text-gray-600 leading-relaxed mb-6 space-y-4 text-left">
          <p>
            <strong>Paina + tai −</strong> muuttaaksesi lämpötilaa
          </p>
          <p>
            <strong>Valitse pika-asetus:</strong>
            <br />
            Kotona, Poissa, Säästävä tai Mukava
          </p>
          <p>
            <strong>Ääniohjaus:</strong>
            <br />
            Paina 🎤-painiketta
          </p>
          <p>
            <strong>Hätänumero:</strong>
            <br />
            📞 044-2144645
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-5 bg-indigo-500 text-white rounded-xl text-2xl font-bold hover:bg-indigo-600 transition-colors"
        >
          Sulje
        </button>
      </div>
    </div>
  );
};

export default GuestHelpModal;