import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiffViewerModal } from '../DiffViewerModal';
import { useAppStore } from '@/store/useAppStore';

describe('DiffViewerModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
    useAppStore.setState({
      inputValue: '',
      outputValue: '',
      inputFormat: 'json',
    });
  });

  it('does not render when isOpen is false', () => {
    render(<DiffViewerModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog and header when open', () => {
    render(<DiffViewerModal isOpen={true} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/STRUCTURAL SCHEMA & PAYLOAD DIFF/i)).toBeInTheDocument();
  });

  it('displays structural diff between input and output', () => {
    useAppStore.setState({
      inputValue: JSON.stringify({ name: 'Alice', age: 30 }),
      outputValue: JSON.stringify({ name: 'Alice', age: 31, city: 'London' }),
      inputFormat: 'json',
    });

    render(<DiffViewerModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/Total Changes:/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 added/i)).toBeInTheDocument();
    expect(screen.getByText(/~1 modified/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy diff/i })).toBeInTheDocument();
  });

  it('switches to custom comparison JSON mode', () => {
    useAppStore.setState({
      inputValue: JSON.stringify({ a: 1 }),
      inputFormat: 'json',
    });

    render(<DiffViewerModal isOpen={true} onClose={onClose} />);

    const customBtn = screen.getByRole('button', { name: /custom comparison json/i });
    fireEvent.click(customBtn);

    const textarea = screen.getByPlaceholderText(/paste comparison json here/i);
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: JSON.stringify({ a: 2, b: 3 }) } });
    expect(screen.getByText(/\+1 added/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DiffViewerModal isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByRole('button', { name: /close diff modal/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
