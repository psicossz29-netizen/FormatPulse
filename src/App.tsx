import React, { useEffect } from 'react';
import { AppMenuBar } from '@/components/layout/AppMenuBar';
import { TopCommandBar } from '@/components/layout/TopCommandBar';
import { SplitWorkspace } from '@/components/layout/SplitWorkspace';
import { StatusBar } from '@/components/layout/StatusBar';
import { ProLicenseModal } from '@/components/monetization/ProLicenseModal';
import { LegalModal } from '@/components/legal/LegalModal';
import { CommandPalette } from '@/components/CommandPalette';
import { DataHealthInspector } from '@/components/security/DataHealthInspector';
import { DiffViewerModal } from '@/components/diff/DiffViewerModal';
import { UpdateNotificationModal } from '@/components/updater/UpdateNotificationModal';
import { BatchProcessingModal } from '@/components/batch/BatchProcessingModal';
import { DownloadModal } from '@/components/download/DownloadModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { LicenseActivationBanner } from '@/components/monetization/LicenseActivationBanner';
import { LandingPage } from '@/components/landing/LandingPage';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useConversion } from '@/hooks/useConversion';
import { useSEO } from '@/hooks/useSEO';

export const App: React.FC = () => {
  useConversion();
  useSEO();

  const showHealthInspector = useAppStore((s) => s.showHealthInspector);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const showDiffModal = useAppStore((s) => s.showDiffModal);
  const setShowDiffModal = useAppStore((s) => s.setShowDiffModal);
  const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);
  const viewMode = useAppStore((s) => s.viewMode);

  // Settings
  const themeAccent = useSettingsStore((s) => s.themeAccent);

  // Synchronize dynamic theme accent
  useEffect(() => {
    const root = document.documentElement;
    if (themeAccent === 'emerald') {
      root.style.setProperty('--color-accent', '#10b981');
      root.style.setProperty('--color-accent-hover', '#059669');
      root.style.setProperty('--color-accent-muted', 'rgba(16, 185, 129, 0.12)');
    } else if (themeAccent === 'cyan') {
      root.style.setProperty('--color-accent', '#06b6d4');
      root.style.setProperty('--color-accent-hover', '#0891b2');
      root.style.setProperty('--color-accent-muted', 'rgba(6, 182, 212, 0.12)');
    } else if (themeAccent === 'zinc') {
      root.style.setProperty('--color-accent', '#a1a1aa');
      root.style.setProperty('--color-accent-hover', '#71717a');
      root.style.setProperty('--color-accent-muted', 'rgba(161, 161, 170, 0.12)');
    } else {
      // Default: Swiss Industrial Electric Pulse (Orange)
      root.style.setProperty('--color-accent', '#FF4F00');
      root.style.setProperty('--color-accent-hover', '#E64700');
      root.style.setProperty('--color-accent-muted', 'rgba(255, 79, 0, 0.12)');
    }
  }, [themeAccent]);

  // Global hotkeys listener: Cmd+, / Ctrl+, opens Settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowSettingsModal]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-surface-base text-zinc-50">
      {viewMode === 'landing' ? (
        <div className="h-full w-full overflow-y-auto scroll-smooth select-text">
          <LandingPage />
        </div>
      ) : (
        <div className="h-full w-full overflow-hidden flex flex-col select-none">
          <AppMenuBar />
          <TopCommandBar />
          <SplitWorkspace />
          <StatusBar />
        </div>
      )}
      <ProLicenseModal />
      <LegalModal />
      <CommandPalette />
      <DataHealthInspector
        isOpen={showHealthInspector}
        onClose={() => setShowHealthInspector(false)}
      />
      <DiffViewerModal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
      />
      <UpdateNotificationModal />
      <BatchProcessingModal />
      <DownloadModal />
      <SettingsModal />
      <LicenseActivationBanner />
    </div>
  );
};

export default App;
