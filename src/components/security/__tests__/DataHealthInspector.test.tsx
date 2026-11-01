import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataHealthInspector } from '../DataHealthInspector';
import { useAppStore } from '@/store/useAppStore';

describe('DataHealthInspector Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
    useAppStore.setState({
      inputValue: '',
      inputFormat: 'json',
      outputFormat: 'csv',
    });
  });

  it('does not render when isOpen is false', () => {
    render(<DataHealthInspector isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders placeholder when input is empty', () => {
    render(<DataHealthInspector isOpen={true} onClose={onClose} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByText(/NO VALID INPUT DATA TO AUDIT/i)).toBeInTheDocument();
  });

  it('renders health report, security score and grade for clean data', () => {
    useAppStore.setState({
      inputValue: JSON.stringify({ name: 'FormatPulse', version: '1.0' }),
    });

    render(<DataHealthInspector isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/DATA HEALTH & SECURITY AUDIT/i)).toBeInTheDocument();
    expect(screen.getByText(/GRADE A\+/i)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/No secrets or unredacted credentials detected/i)).toBeInTheDocument();
  });

  it('displays detected threats and sanitize button when secrets are present', () => {
    useAppStore.setState({
      inputValue: JSON.stringify({
        aws_key: 'AKIAIOSFODNN7EXAMPLE',
        dni: '12345678Z',
      }),
    });

    render(<DataHealthInspector isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/AWS Access Key ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Spanish DNI \/ NIE/i)).toBeInTheDocument();
    expect(screen.getByText(/Sanitize \d Threat\(s\) Now/i)).toBeInTheDocument();

    const sanitizeBtn = screen.getByText(/Sanitize \d Threat\(s\) Now/i);
    fireEvent.click(sanitizeBtn);

    // Clicking sanitize should switch output format to pii-sanitizer and close inspector
    expect(useAppStore.getState().outputFormat).toBe('pii-sanitizer');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DataHealthInspector isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByRole('button', { name: /close inspector/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
