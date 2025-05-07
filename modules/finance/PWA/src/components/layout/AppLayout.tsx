import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import OfflineNotice from '@/components/ui/OfflineNotice';
import InstallPromptModal from '@/components/ui/InstallPromptModal';
import { usePWAInstallPrompt } from '@/hooks/usePWAInstallPrompt';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string; }>;
  prompt(): Promise<void>;
}

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    deferredPrompt,
    isAppInstalled,
    showInstallModal,
    setShowInstallModal,
    handleInstallClick
  } = usePWAInstallPrompt();


  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineNotice />
      <Header canInstall={!!deferredPrompt && !isAppInstalled} onInstallClick={handleInstallClick} />
      <div className="flex min-h-[calc(100vh-64px)]">
        {!isMobile && <Sidebar />}
        <main className="flex-grow pt-2 pb-20 px-4 md:pb-8 md:px-8">
          <Outlet />
          

          {/* Version display - always visible */}
          <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            Version {import.meta.env.VITE_APP_VERSION || '1.0.0'} | {new Date().getFullYear()}
          </div>
        </main>
      </div>
      {/* Install Prompt Modal */}
      <InstallPromptModal
        open={showInstallModal && !isAppInstalled}
        onClose={() => setShowInstallModal(false)}
        canInstall={!!deferredPrompt}
        onInstallClick={handleInstallClick}
      />
      {isMobile && <BottomNav />}
    </div>
  );
};

export default AppLayout;
