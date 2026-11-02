import React from 'react';
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
import { LandingPage } from '@/components/landing/LandingPage';
import { useAppStore } from '@/store/useAppStore';
import { useConversion } from '@/hooks/useConversion';
import { useSEO } from '@/hooks/useSEO';

export const App: React.FC = () => {
  useConversion();
  useSEO();

  const showHealthInspector = useAppStore((s) => s.showHealthInspector);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const showDiffModal = useAppStore((s) => s.showDiffModal);
  const setShowDiffModal = useAppStore((s) => s.setShowDiffModal);
  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-surface-base text-zinc-50">
      {viewMode === 'landing' ? (
        <div className="h-full w-full overflow-y-auto scroll-smooth select-text">
          <LandingPage />
        </div>
      ) : (
        <div className="h-full w-full overflow-hidden flex flex-col select-none">
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
    </div>
  );
};

export default App;
