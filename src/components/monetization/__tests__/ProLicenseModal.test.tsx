import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProLicenseModal } from '../ProLicenseModal';
import { useAppStore } from '@/store/useAppStore';
import * as desktopBridge from '@/core/desktopBridge';

describe('ProLicenseModal Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAppStore.setState({
      showLicenseModal: true,
      licenseTier: 'free',
      licenseKey: null,
    });
  });

  it('renders license modal with all 3 commercial plans ($14, $79, $199)', () => {
    render(<ProLicenseModal />);
    expect(screen.getByRole('dialog', { name: 'FormatPulse License Manager' })).toBeInTheDocument();
    expect(screen.getByText('Pro Lifetime')).toBeInTheDocument();
    expect(screen.getByText('Team Pack')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('$14 USD')).toBeInTheDocument();
    expect(screen.getByText('$79 USD')).toBeInTheDocument();
    expect(screen.getByText('$199 USD')).toBeInTheDocument();
  });

  it('switches between pricing plans when clicked', () => {
    render(<ProLicenseModal />);
    const teamTab = screen.getByText('Team Pack').closest('button');
    expect(teamTab).toBeInTheDocument();
    fireEvent.click(teamTab!);

    expect(screen.getByText(/Proceed to Polar Checkout — \$79 USD Lifetime/i)).toBeInTheDocument();

    const entTab = screen.getByText('Enterprise').closest('button');
    fireEvent.click(entTab!);

    expect(screen.getByText(/Proceed to Polar Checkout — \$199 USD Lifetime/i)).toBeInTheDocument();
  });

  it('dispatches external checkout link via desktop bridge on button click', async () => {
    const openUrlSpy = vi.spyOn(desktopBridge, 'openExternalUrl').mockResolvedValue(true);
    render(<ProLicenseModal />);

    const checkoutBtn = screen.getByText(/Proceed to Polar Checkout/i).closest('button');
    expect(checkoutBtn).toBeInTheDocument();
    fireEvent.click(checkoutBtn!);

    expect(openUrlSpy).toHaveBeenCalledTimes(1);
    expect(openUrlSpy).toHaveBeenCalledWith(
      expect.stringMatching(/https:\/\/buy\.polar\.sh\/(polar_cl_|polar_prod_)/),
    );
  });

  it('allows copying the direct Polar checkout link to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ProLicenseModal />);
    const copyBtn = screen.getByTitle('Copy Polar checkout URL to clipboard');
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1);
      expect(screen.getByText('✓ Polar URL Copied!')).toBeInTheDocument();
    });
  });
});
