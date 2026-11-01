import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommandPalette } from '../CommandPalette';
import { useAppStore } from '@/store/useAppStore';

describe('CommandPalette Component', () => {
  beforeEach(() => {
    // Reset palette state
    useAppStore.setState({
      showCommandPalette: false,
      inputValue: '',
      outputValue: '',
      showLicenseModal: false,
      showLegalModal: false,
    });
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('is not visible by default', () => {
    render(<CommandPalette />);
    expect(screen.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument();
  });

  it('renders search input and commands when showCommandPalette is true', () => {
    useAppStore.setState({ showCommandPalette: true });
    render(<CommandPalette />);

    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/type a command or search presets/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Load Preset: JSON to TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Preset: CSV to SQL DDL & Seed/i)).toBeInTheDocument();
  });

  it('filters command list by query', () => {
    useAppStore.setState({ showCommandPalette: true });
    render(<CommandPalette />);

    const searchInput = screen.getByPlaceholderText(/type a command or search presets/i);
    fireEvent.change(searchInput, { target: { value: 'Zod' } });

    expect(screen.getByText(/Load Preset: JSON to Zod Schema/i)).toBeInTheDocument();
    expect(screen.queryByText(/Load Preset: CSV to SQL DDL & Seed/i)).not.toBeInTheDocument();
  });

  it('executes a preset command upon click and closes palette', () => {
    useAppStore.setState({ showCommandPalette: true });
    render(<CommandPalette />);

    const presetItem = screen.getByText(/Load Preset: JSON to TypeScript/i);
    fireEvent.click(presetItem);

    const state = useAppStore.getState();
    expect(state.showCommandPalette).toBe(false);
    expect(state.outputFormat).toBe('typescript');
    expect(state.inputValue).toContain('Sarah Connor');
    expect(state.activePresetId).toBe('json-to-typescript');
  });

  it('closes on Escape key', () => {
    useAppStore.setState({ showCommandPalette: true });
    render(<CommandPalette />);

    const dialog = screen.getByRole('dialog', { name: /command palette/i });
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(useAppStore.getState().showCommandPalette).toBe(false);
  });

  it('triggers license modal action from palette', () => {
    useAppStore.setState({ showCommandPalette: true });
    render(<CommandPalette />);

    const licenseItem = screen.getByText(/Activate PRO Lifetime License/i);
    fireEvent.click(licenseItem);

    expect(useAppStore.getState().showLicenseModal).toBe(true);
    expect(useAppStore.getState().showCommandPalette).toBe(false);
  });

  it('toggles palette with global Ctrl+K / Cmd+K shortcut', () => {
    render(<CommandPalette />);
    expect(useAppStore.getState().showCommandPalette).toBe(false);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(useAppStore.getState().showCommandPalette).toBe(true);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(useAppStore.getState().showCommandPalette).toBe(false);
  });
});
