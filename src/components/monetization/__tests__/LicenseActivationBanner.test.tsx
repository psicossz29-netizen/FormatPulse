import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LicenseActivationBanner } from '../LicenseActivationBanner';
import { useAppStore } from '@/store/useAppStore';

describe('LicenseActivationBanner', () => {
  beforeEach(() => {
    useAppStore.setState({
      licenseTier: 'free',
      licenseKey: null,
      showLicenseModal: false,
    });
    window.history.replaceState({}, '', '/');
  });

  it('renders nothing when no license_activated query param is present', () => {
    const { container } = render(<LicenseActivationBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders success notification when license_activated=true and tier is pro', () => {
    useAppStore.setState({ licenseTier: 'pro' });
    window.history.replaceState({}, '', '/?license_activated=true');

    render(<LicenseActivationBanner />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/PRO Lifetime Activated!/i)).toBeInTheDocument();
  });

  it('renders pending notification with button when license_activated=true but tier is free', () => {
    useAppStore.setState({ licenseTier: 'free' });
    window.history.replaceState({}, '', '/?license_activated=true');

    render(<LicenseActivationBanner />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Order Completed via Polar.sh!/i)).toBeInTheDocument();
    const enterBtn = screen.getByRole('button', { name: /Enter License Key/i });
    expect(enterBtn).toBeInTheDocument();

    fireEvent.click(enterBtn);
    expect(useAppStore.getState().showLicenseModal).toBe(true);
  });

  it('dismisses when clicking X button', () => {
    useAppStore.setState({ licenseTier: 'pro' });
    window.history.replaceState({}, '', '/?license_activated=true');

    render(<LicenseActivationBanner />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    const closeBtn = screen.getByTitle('Dismiss');
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
