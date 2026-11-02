import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockSetViewMode  = vi.fn();
const mockSetInputValue   = vi.fn();
const mockSetOutputFormat = vi.fn();

vi.mock('@/store/useAppStore', () => ({
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      setViewMode: mockSetViewMode,
      setInputValue: mockSetInputValue,
      setOutputFormat: mockSetOutputFormat,
    }),
}));

vi.mock('@/store/useSettingsStore', () => ({
  useSettingsStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ language: 'es' }),
}));

import { GuidedUseCaseSection } from '../GuidedUseCaseSection';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GuidedUseCaseSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 4 use-case cards', () => {
    render(<GuidedUseCaseSection />);
    expect(screen.getByText('Limpiar y Formatear')).toBeTruthy();
    expect(screen.getByText('Convertir Formatos')).toBeTruthy();
    expect(screen.getByText('Ocultar Datos Sensibles')).toBeTruthy();
    expect(screen.getByText('Generar Código')).toBeTruthy();
  });

  it('renders section heading in Spanish', () => {
    render(<GuidedUseCaseSection />);
    expect(screen.getByText('¿Qué quieres hacer hoy?')).toBeTruthy();
  });

  it('renders 4 CTA labels', () => {
    render(<GuidedUseCaseSection />);
    const ctaButtons = screen.getAllByText('Probar ahora →');
    expect(ctaButtons.length).toBe(4);
  });

  it('clicking a card calls setViewMode with "workspace"', async () => {
    const user = userEvent.setup();
    render(<GuidedUseCaseSection />);
    const card = screen.getByLabelText('Limpiar y Formatear');
    await user.click(card);
    expect(mockSetViewMode).toHaveBeenCalledWith('workspace');
  });

  it('clicking the "Ocultar Datos" card sets pii-sanitizer output format', async () => {
    const user = userEvent.setup();
    render(<GuidedUseCaseSection />);
    const card = screen.getByLabelText('Ocultar Datos Sensibles');
    await user.click(card);
    expect(mockSetOutputFormat).toHaveBeenCalledWith('pii-sanitizer');
  });

  it('clicking the "Generar Código" card sets typescript output format', async () => {
    const user = userEvent.setup();
    render(<GuidedUseCaseSection />);
    const card = screen.getByLabelText('Generar Código');
    await user.click(card);
    expect(mockSetOutputFormat).toHaveBeenCalledWith('typescript');
  });
});
