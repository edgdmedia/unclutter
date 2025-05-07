import React from 'react';
import { X } from 'lucide-react';

function getDeviceType() {
  const ua = window.navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document)) return 'ios';
  if (/windows/i.test(ua)) return 'windows';
  if (/macintosh/i.test(ua)) return 'mac';
  return 'desktop';
}

interface InstallPromptModalProps {
  open: boolean;
  onClose: () => void;
  canInstall: boolean;
  onInstallClick?: () => void;
}

const InstallPromptModal: React.FC<InstallPromptModalProps> = ({ open, onClose, canInstall, onInstallClick }) => {
  const [deviceType, setDeviceType] = React.useState('desktop');

  React.useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  if (!open) return null;

  let instructions = null;
  if (!canInstall) {
    if (deviceType === 'ios') {
      instructions = (
        <div className="text-sm text-gray-700 mt-2">
          <p>To install this app on iOS:</p>
          <ol className="list-decimal list-inside mt-1">
            <li>Tap <span className="inline-block px-1">Share</span> <span role="img" aria-label="Share">⬆️</span> in Safari</li>
            <li>Select <b>Add to Home Screen</b></li>
          </ol>
        </div>
      );
    } else {
      instructions = (
        <div className="text-sm text-gray-700 mt-2">
          <p>To install, use your browser menu and select <b>Add to Home Screen</b> or <b>Install App</b>.</p>
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div className="w-full max-w-md mx-auto mb-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 pointer-events-auto animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900 text-base">Install Unclutter Finance</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {canInstall ? (
          <button
            className="w-full mt-2 bg-finance-yellow text-finance-blue font-semibold py-2 rounded hover:bg-finance-yellow/90 transition"
            onClick={onInstallClick}
          >
            Install App
          </button>
        ) : (
          instructions
        )}
      </div>
      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default InstallPromptModal;
