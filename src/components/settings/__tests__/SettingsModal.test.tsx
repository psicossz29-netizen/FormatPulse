import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from '../SettingsModal';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';

describe('SettingsModal (Antigravity Industrial Preferences)', () => {
  beforeEach(() => {
    useAppStore.setState({
      showSettingsModal: true,
      licenseTier: 'pro',
      licenseKey: 'PRO-AIRGAP-TEST-KEY',
    });
    useSettingsStore.getState().resetToDefaults();
  });

  it('renders modal dialog with Antigravity-style sidebar categories', () => {
    render(<SettingsModal />);
    expect(screen.getByRole('dialog', { name: 'FormatPulse Preferences' })).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Security & PII')).toBeInTheDocument();
    expect(screen.getByText('Engine & Workers')).toBeInTheDocument();
    expect(screen.getByText('License & Seats')).toBeInTheDocument();
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
  });

  it('navigates to Appearance tab and allows changing typography size', () => {
    render(<SettingsModal />);
    const appearanceBtn = screen.getByText('Appearance');
    fireEvent.click(appearanceBtn);

    expect(screen.getByText('Editor Typography Size')).toBeInTheDocument();
    const btn16px = screen.getByText('16px');
    fireEvent.click(btn16px);
    expect(useSettingsStore.getState().fontSize).toBe(16);
  });

  it('navigates to Security & PII tab and configures formula guard', () => {
    render(<SettingsModal />);
    const securityBtn = screen.getByText('Security & PII');
    fireEvent.click(securityBtn);

    expect(screen.getByText('Default PII Sanitization Mode')).toBeInTheDocument();
    expect(screen.getByText('Formula Injection Guard (CSV)')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<SettingsModal />);
    const closeBtn = screen.getByLabelText('Close settings');
    fireEvent.click(closeBtn);
    expect(useAppStore.getState().showSettingsModal).toBe(false);
  });
});
