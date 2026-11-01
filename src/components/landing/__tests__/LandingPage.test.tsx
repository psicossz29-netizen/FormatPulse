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
    expect(screen.getByText('// features')).toBeInTheDocument();
    expect(screen.getByText('// security')).toBeInTheDocument();
    expect(screen.getByText('// vs-cloud')).toBeInTheDocument();
    expect(screen.getByText('// pricing')).toBeInTheDocument();
    expect(screen.getByText('// faq')).toBeInTheDocument();
  });

  it('renders anti-AI-slop headline and core value proposition', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Stop pasting confidential payloads into cloud converters/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/SWISS PRECISION ARCHITECTURE/i)).toBeInTheDocument();
  });

  it('renders interactive hero playground with code tabs', () => {
    render(<LandingPage />);

    expect(screen.getByText('TypeScript Interface')).toBeInTheDocument();
    expect(screen.getByText('OpenAPI 3.1 Spec')).toBeInTheDocument();
    expect(screen.getByText('Secrets & PII Redaction')).toBeInTheDocument();
    expect(screen.getByText('CSV to SQL DDL + Seed')).toBeInTheDocument();
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

    const launchButtons = screen.getAllByText(/Launch Workspace/i);
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

  it('renders live interactive PII sandbox and ROI calculator widgets', () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Test the PII & Secrets Engine in your browser right now/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Estimate Engineering Hours & SaaS Costs Saved/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/DEV TIME SAVED/i)).toBeInTheDocument();
  });
});
