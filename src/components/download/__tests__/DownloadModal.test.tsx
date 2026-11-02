import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadModal } from '../DownloadModal';
import { useAppStore } from '@/store/useAppStore';

describe('DownloadModal', () => {
  beforeEach(() => {
    useAppStore.setState({
      showDownloadModal: true,
      viewMode: 'landing',
    });
    vi.clearAllMocks();
  });

  it('renders nothing when showDownloadModal is false', () => {
    useAppStore.setState({ showDownloadModal: false });
    const { container } = render(<DownloadModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal with installer title and SmartScreen guide when open', () => {
    render(<DownloadModal />);
    expect(
      screen.getByText(/INSTALLER \/\/ WINDOWS x64 NATIVE/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/¿Por qué Windows muestra la pantalla de SmartScreen\?/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Iniciar Descarga/i)).toBeInTheDocument();
    expect(screen.getByText(/winget install formatpulse/i)).toBeInTheDocument();
  });

  it('displays the step-by-step instructions for SmartScreen', () => {
    render(<DownloadModal />);
    expect(screen.getByText(/Más información/i)).toBeInTheDocument();
    expect(screen.getByText(/Ejecutar de todas formas/i)).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<DownloadModal />);
    const closeBtn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);
    expect(useAppStore.getState().showDownloadModal).toBe(false);
  });
});
