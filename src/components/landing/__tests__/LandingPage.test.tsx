import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../LandingPage';
import { useAppStore } from '@/store/useAppStore';

describe('FormatPulse Landing Page (2026 Swiss Industrial Design)', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: 'landing',
      licenseTier: 'free',
    });
  });

  it('renders technical brand header with zero-server status badge', () => {
    render(<LandingPage />);

    expect(screen.getByText('ZERO-SERVER ENGINE')).toBeInTheDocument();
  });

  it('renders clear human headline and core value proposition', () => {
    render(<LandingPage />);

    // Renders either ES or EN headline based on initial language
    expect(
      screen.getByText(/Convierte, formatea y protege|Convert, format and protect/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/ARQUITECTURA SWISS PRECISION|SWISS PRECISION ARCHITECTURE/i)).toBeInTheDocument();
  });

  it('renders guided workflow section with all 4 use case cards', () => {
    render(<LandingPage />);

    expect(screen.getAllByText(/Limpiar y Formatear|Clean & Format/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Convertir Formatos|Convert Formats/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ocultar Datos Sensibles|Mask Sensitive Data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Generar Código|Generate Code/i).length).toBeGreaterThan(0);
  });

  it('renders all 3 lifetime commercial pricing plans with accurate price tags', () => {
    render(<LandingPage />);

    expect(screen.getByText('Individual Pro')).toBeInTheDocument();
    expect(screen.getByText('$14')).toBeInTheDocument();
    expect(screen.getByText('Team Pack')).toBeInTheDocument();
    expect(screen.getByText('$79')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Air-Gapped')).toBeInTheDocument();
    expect(screen.getByText('$199')).toBeInTheDocument();
  });

  it('switches viewMode to workspace when Launch Workspace is clicked', () => {
    render(<LandingPage />);

    const launchButtons = screen.getAllByText(/Abrir Workspace|Launch Workspace/i);
    expect(launchButtons.length).toBeGreaterThan(0);

    fireEvent.click(launchButtons[0]!);
    expect(useAppStore.getState().viewMode).toBe('workspace');
  });

  it('renders developer FAQ with expandable accordion items', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/How do you technically guarantee that no data touches a remote server/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Does the license key validation work in air-gapped networks/i),
    ).toBeInTheDocument();
  });

  it('renders streamlined technical features showcase without clutter', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Privacidad Absoluta|Absolute Privacy/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Motor Multihilo Web Worker|Multithreaded Web Worker Engine/i),
    ).toBeInTheDocument();
  });

  it('renders Spaceship-inspired Workspace Sandbox and Desktop Installer sections', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/PRUEBA EL MOTOR|Test The Engine/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Dedicated Desktop Power. Zero Cloud Latency/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Windows SmartScreen Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/SHA-256:/i)).toBeInTheDocument();
  });
});
