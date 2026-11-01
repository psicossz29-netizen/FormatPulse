import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { detectPresetFromURL } from '@/core/presets';

export function useSEO(): void {
  const loadPreset = useAppStore((s) => s.loadPreset);

  useEffect(() => {
    const preset = detectPresetFromURL();
    if (preset) {
      loadPreset(preset.id);
    } else {
      if (typeof document !== 'undefined') {
        document.title = 'FormatPulse — Local-First Data & Schema Engine (Zero Telemetry)';
      }
    }
  }, [loadPreset]);
}
