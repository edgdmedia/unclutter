import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface UsePWAInstallPrompt {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isAppInstalled: boolean;
  showInstallModal: boolean;
  setShowInstallModal: (show: boolean) => void;
  handleInstallClick: () => Promise<void>;
}

export function usePWAInstallPrompt(): UsePWAInstallPrompt {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if the app is already installed (running in standalone mode)
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullScreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isIOSInstalled = (window.navigator as any).standalone === true;
      const installed = isStandalone || isFullScreen || isMinimalUi || isIOSInstalled;
      setIsAppInstalled(installed);
    };
    checkIfInstalled();
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkIfInstalled();
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleDisplayModeChange);
    } else if ((mediaQueryList as any).addListener) {
      (mediaQueryList as any).addListener(handleDisplayModeChange);
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallModal(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    const installedHandler = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
    };
    window.addEventListener('appinstalled', installedHandler);
    if (isAppInstalled) setShowInstallModal(false);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleDisplayModeChange);
      } else if ((mediaQueryList as any).removeListener) {
        (mediaQueryList as any).removeListener(handleDisplayModeChange);
      }
    };
    // eslint-disable-next-line
  }, [isAppInstalled]);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallModal(false);
  }, [deferredPrompt]);

  return {
    deferredPrompt,
    isAppInstalled,
    showInstallModal,
    setShowInstallModal,
    handleInstallClick,
  };
}
