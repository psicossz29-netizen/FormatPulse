import React, { useEffect } from 'react';
import { SEOJsonLd } from './SEOJsonLd';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { GuidedUseCaseSection } from './GuidedUseCaseSection';
import { ThreeStepIndicator } from './ThreeStepIndicator';
import { TechTicker } from './TechTicker';
import { TechnicalShowcase } from './TechnicalShowcase';
import { WorkspaceSandboxSection } from './WorkspaceSandboxSection';
import { LiveSanitizerWidget } from './LiveSanitizerWidget';
import { ComparisonMatrix } from './ComparisonMatrix';
import { SecurityAuditSection } from './SecurityAuditSection';
import { RoiCalculator } from './RoiCalculator';
import { PricingSection } from './PricingSection';
import { InstallerDownloadSection } from './InstallerDownloadSection';
import { DeveloperFAQ } from './DeveloperFAQ';
import { LandingFooter } from './LandingFooter';
import { useAppStore } from '@/store/useAppStore';

export const LandingPage: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);

  // Global key shortcut: pressing Escape or Ctrl/Cmd+K switches to Workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setViewMode('workspace');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewMode]);

  return (
    <div className="min-h-screen w-full bg-[#06070b] text-zinc-50 flex flex-col font-sans selection:bg-accent selection:text-white">
      <SEOJsonLd />
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <GuidedUseCaseSection />
        <ThreeStepIndicator />
        <TechTicker />
        <WorkspaceSandboxSection />
        <TechnicalShowcase />
        <LiveSanitizerWidget />
        <ComparisonMatrix />
        <SecurityAuditSection />
        <RoiCalculator />
        <PricingSection />
        <InstallerDownloadSection />
        <DeveloperFAQ />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
