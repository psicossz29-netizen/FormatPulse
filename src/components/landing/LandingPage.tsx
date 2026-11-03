import React, { useState, useEffect } from 'react';
import { SEOJsonLd } from './SEOJsonLd';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { FormatPillStrip } from './FormatPillStrip';
import { TrioGridSection } from './TrioGridSection';
import { BentoProductSection } from './BentoProductSection';
import { ScrollFlowSection } from './ScrollFlowSection';
import { SecurityDevToolsSection } from './SecurityDevToolsSection';
import { PricingSection } from './PricingSection';
import { InstallerDownloadSection } from './InstallerDownloadSection';
import { DeveloperFAQ } from './DeveloperFAQ';
import { LandingFooter } from './LandingFooter';
import { CommandPaletteModal } from './CommandPaletteModal';

export const LandingPage: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global key shortcut: Ctrl/Cmd+K toggles the Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#09090B] text-[#F4F4F5] flex flex-col font-geist selection:bg-[#FF4F00] selection:text-white" id="top">
      <SEOJsonLd />
      <LandingNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <main className="flex-1">
        <HeroSection />
        <FormatPillStrip />
        <TrioGridSection />
        <BentoProductSection />
        <ScrollFlowSection />
        <SecurityDevToolsSection />
        <PricingSection />
        <InstallerDownloadSection />
        <DeveloperFAQ />
      </main>
      <LandingFooter />
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
