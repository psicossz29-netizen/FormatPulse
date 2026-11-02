import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAppStore } from '@/store/useAppStore';

describe('App Shell', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: 'workspace',
      licenseTier: 'free',
    });
  });
  it('renders the FormatPulse logo', () => {
    render(<App />);
    expect(screen.getByText('FORMATPULSE')).toBeInTheDocument();
  });

  it('renders input format selectors (JSON appears in both In and Out sections)', () => {
    render(<App />);
    const jsonElements = screen.getAllByText('JSON');
    expect(jsonElements.length).toBeGreaterThanOrEqual(2);

    const csvElements = screen.getAllByText('CSV');
    expect(csvElements.length).toBeGreaterThanOrEqual(2);

    const yamlElements = screen.getAllByText('YAML');
    expect(yamlElements.length).toBeGreaterThanOrEqual(2);
  });

  it('renders PRO format badges', () => {
    render(<App />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Zod Schema')).toBeInTheDocument();
    expect(screen.getByText('SQL DDL')).toBeInTheDocument();
    expect(screen.getByText('PII Sanitizer')).toBeInTheDocument();
    expect(screen.getByText('JSON Schema')).toBeInTheDocument();
    expect(screen.getByText('OpenAPI 3.1')).toBeInTheDocument();
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('Pydantic v2')).toBeInTheDocument();
    expect(screen.getByText('Rust Serde')).toBeInTheDocument();
    expect(screen.getByText('Go Struct')).toBeInTheDocument();
    const proBadges = screen.getAllByText('PRO');
    expect(proBadges.length).toBe(10);
  });

  it('renders the status bar with privacy indicator', () => {
    render(<App />);
    expect(screen.getByText('100% CLIENT-SIDE')).toBeInTheDocument();
    expect(screen.getByText('ZERO NETWORK IO')).toBeInTheDocument();
  });

  it('renders the free tier badge by default', () => {
    render(<App />);
    expect(screen.getByText('FREE TIER')).toBeInTheDocument();
  });

  it('renders the Activate PRO button', () => {
    render(<App />);
    expect(screen.getByText('Activate PRO')).toBeInTheDocument();
  });

  it('renders Load File button', () => {
    render(<App />);
    expect(screen.getByText('Load File')).toBeInTheDocument();
  });

  it('renders the input and output panel labels', () => {
    render(<App />);
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('renders the In/Out section markers in the command bar', () => {
    render(<App />);
    expect(screen.getByText('In')).toBeInTheDocument();
    expect(screen.getByText('Out')).toBeInTheDocument();
  });

  it('renders the version tag', () => {
    render(<App />);
    expect(screen.getByText('// v1.0')).toBeInTheDocument();
  });

  it('renders the command palette launcher button', () => {
    render(<App />);
    expect(screen.getByText('Commands')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('renders the security audit and diff buttons in the command bar', () => {
    render(<App />);
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
    expect(screen.getByText('Diff')).toBeInTheDocument();
  });

  it('renders landing page when viewMode is landing', () => {
    useAppStore.setState({ viewMode: 'landing' });
    render(<App />);
    expect(screen.getByText('ZERO-SERVER ENGINE')).toBeInTheDocument();
  });

  it('switches between landing and workspace view modes', () => {
    useAppStore.setState({ viewMode: 'landing' });
    const { unmount } = render(<App />);
    expect(screen.getByText('ZERO-SERVER ENGINE')).toBeInTheDocument();
    unmount();

    useAppStore.setState({ viewMode: 'workspace' });
    render(<App />);
    expect(screen.getByText('100% CLIENT-SIDE')).toBeInTheDocument();
  });
});

describe('ProLicenseModal', () => {
  it('does not render modal by default (modal is hidden)', () => {
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
