import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppMenuBar } from '../AppMenuBar';
import { useAppStore } from '@/store/useAppStore';

describe('AppMenuBar (Desktop Native Navigation)', () => {
  beforeEach(() => {
    useAppStore.setState({
      inputValue: '',
      outputValue: '{"test": 123}',
      showSettingsModal: false,
    });
  });

  it('renders all top-level desktop menu headers', () => {
    render(<AppMenuBar />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('opens File menu and exposes export actions', () => {
    render(<AppMenuBar />);
    const fileMenu = screen.getByText('File');
    fireEvent.click(fileMenu);

    expect(screen.getByText('Open File...')).toBeInTheDocument();
    expect(screen.getByText('Export Output As...')).toBeInTheDocument();
    expect(screen.getByText('Batch Multi-File (ZIP)')).toBeInTheDocument();
  });

  it('opens Preferences menu and triggers Settings modal', () => {
    render(<AppMenuBar />);
    const prefsMenu = screen.getByText('Preferences');
    fireEvent.click(prefsMenu);

    const settingsOption = screen.getByText('Settings Dialog...');
    fireEvent.click(settingsOption);

    expect(useAppStore.getState().showSettingsModal).toBe(true);
  });
});
