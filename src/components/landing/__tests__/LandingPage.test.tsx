import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../LandingPage';
import { useAppStore } from '@/store/useAppStore';

describe('FormatPulse Landing Page (Design B - Spaceship Architecture)', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: 'landing',
      licenseTier: 'free',
    });
  });

  it('renders navigation header with Spaceship mega-menu items and search button', () => {
    render(<LandingPage />);

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Producto|Product/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Soluciones|Solutions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Recursos|Resources/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Privacidad|Privacy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Precios|Pricing/i).length).toBeGreaterThan(0);
  });

  it('renders hero headline, subtitle and primary action buttons', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Convierte, tipa y limpia tus datos|Convert, type and sanitize your data/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Abrir el estudio|Abrir estudio|Launch Studio/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders interactive studio with PII mask switch and output tabs', () => {
    render(<LandingPage />);

    expect(screen.getAllByText(/Enmascarar datos personales|Mask personal data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Zod').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SQL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('YAML').length).toBeGreaterThan(0);
  });

  it('renders Trio grid section (Todo ocurre en tu navegador)', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/Todo ocurre en tu navegador|Everything happens in your browser/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Sin servidor de por medio|Zero servers? involved/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders Bento product section (Tres herramientas en una sola mesa)', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/Tres herramientas en una sola mesa de trabajo|Three tools in a single workbench/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Conversor de formatos|Format converter/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Generador de esquemas|Schema generator/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders scroll-linked workflow section', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/De pegar a copiar, sin pasos de más|From paste to copy/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Pega tus datos|Paste your data/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders DevTools Network tab security verification and comparison table', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/No tienes que creernos: compruébalo en 20 segundos|verify it in 20 seconds/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Sin peticiones con tus datos|Zero network requests with your data/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/En muchos formateadores en línea|In common online converters/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders all 3 lifetime commercial pricing plans ($14, $79, $199)', () => {
    render(<LandingPage />);

    expect(screen.getByText('Individual Pro')).toBeInTheDocument();
    expect(screen.getByText('$14')).toBeInTheDocument();
    expect(screen.getByText('Team Pack')).toBeInTheDocument();
    expect(screen.getByText('$79')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Air-Gapped')).toBeInTheDocument();
    expect(screen.getByText('$199')).toBeInTheDocument();
  });

  it('renders native Windows desktop installer section with SHA-256 hash', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/Potencia de escritorio nativa|Dedicated Desktop Power/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/SHA-256:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Verificación de Windows SmartScreen|Windows SmartScreen Verification/i).length).toBeGreaterThan(0);
  });

  it('renders FAQ accordions with answers', () => {
    render(<LandingPage />);

    expect(
      screen.getAllByText(/¿Se envían mis datos a algún servidor\?|Does my data get sent to any remote server\?/i).length,
    ).toBeGreaterThan(0);
  });

  it('switches viewMode to workspace when primary CTA is clicked', () => {
    render(<LandingPage />);

    const launchButtons = screen.getAllByText(/Abrir el estudio|Abrir estudio|Launch Studio/i);
    expect(launchButtons.length).toBeGreaterThan(0);

    fireEvent.click(launchButtons[0]!);
    expect(useAppStore.getState().viewMode).toBe('workspace');
  });
});
