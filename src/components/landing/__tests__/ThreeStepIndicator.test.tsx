import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/store/useSettingsStore', () => ({
  useSettingsStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ language: 'es' }),
}));

import { ThreeStepIndicator } from '../ThreeStepIndicator';

describe('ThreeStepIndicator', () => {
  it('renders 3 steps in Spanish', () => {
    render(<ThreeStepIndicator />);
    expect(screen.getByText('Pega tus datos')).toBeTruthy();
    expect(screen.getByText('Elige la acción')).toBeTruthy();
    expect(screen.getByText('Copia el resultado')).toBeTruthy();
  });

  it('renders step descriptions', () => {
    render(<ThreeStepIndicator />);
    expect(screen.getByText('JSON, CSV o YAML')).toBeTruthy();
    expect(screen.getByText('100% local — nunca sale de tu máquina')).toBeTruthy();
  });

  it('renders step numbers 1, 2, 3', () => {
    render(<ThreeStepIndicator />);
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('has correct ARIA label', () => {
    render(<ThreeStepIndicator />);
    expect(screen.getByRole('region', { name: /3 steps/i })).toBeTruthy();
  });
});
