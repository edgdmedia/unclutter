import React from 'react';
import { usePWAInstallPrompt } from '@/hooks/usePWAInstallPrompt';
import { Button } from '@/components/ui/button';

const SettingsInstallButton: React.FC = () => {
  const { deferredPrompt, isAppInstalled, handleInstallClick } = usePWAInstallPrompt();

  if (isAppInstalled) {
    return (
      <div className="text-xs text-green-600 font-semibold">App is installed</div>
    );
  }

  if (deferredPrompt) {
    return (
      <Button variant="outline" className="mt-2" onClick={handleInstallClick}>
        Install App
      </Button>
    );
  }

  // Fallback for iOS or unsupported browsers
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document);
  return (
    <div className="mt-2 text-xs text-yellow-700">
      {isIOS ? (
        <>
          To install: <br />
          <b>Share</b> <span role="img" aria-label="Share">⬆️</span> &rarr; <b>Add to Home Screen</b>
        </>
      ) : (
        <>Install via your browser menu</>
      )}
    </div>
  );
};

export default SettingsInstallButton;
