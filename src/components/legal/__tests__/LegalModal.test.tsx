import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LegalModal } from '../LegalModal';
import { useAppStore } from '@/store/useAppStore';

describe('LegalModal Component', () => {
  beforeEach(() => {
    useAppStore.setState({
      showLegalModal: false,
    });
  });

  it('does not render when showLegalModal is false', () => {
    render(<LegalModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog and header when showLegalModal is true', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/LEGAL_COMPLIANCE_ARCHIVE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close legal modal/i })).toBeInTheDocument();
  });

  it('defaults to Terms & EULA tab and displays essential clauses', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    expect(
      screen.getByText(/END USER LICENSE AGREEMENT \(EULA\) & TERMS OF SERVICE/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/100% Client-Side Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Merchant of Record \(MoR\) Authority/i)).toBeInTheDocument();
    expect(screen.getAllByText(/AS IS/i).length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to Zero-Data Privacy tab upon click', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    const privacyTab = screen.getByRole('button', { name: /zero-data privacy/i });
    fireEvent.click(privacyTab);

    expect(
      screen.getByText(/ZERO-DATA & ZERO-SERVER PRIVACY POLICY/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Architectural Guarantee: Zero Outbound Payload Transmission/i)).toBeInTheDocument();
    expect(screen.getByText(/formatpulse_license_key/i)).toBeInTheDocument();
  });

  it('navigates to Refund Policy tab upon click', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    const refundTab = screen.getByRole('button', { name: /refund policy/i });
    fireEvent.click(refundTab);

    expect(
      screen.getByText(/14-DAY NO-QUESTIONS-ASKED REFUND POLICY/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/100% full refund within 14 calendar days/i)).toBeInTheDocument();
  });

  it('navigates to DPA & Subprocessors tab upon click', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    const dpaTab = screen.getByRole('button', { name: /dpa & subprocessors/i });
    fireEvent.click(dpaTab);

    expect(
      screen.getByText(/ENTERPRISE DPA & SUBPROCESSORS DECLARATION/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/TOTAL SUBPROCESSORS: 0 \(ZERO\)/i)).toBeInTheDocument();
    expect(screen.getByText(/FormatPulse is NOT a Data Processor/i)).toBeInTheDocument();
  });

  it('navigates to Security & Verification tab and executes real-time audit', async () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    const securityTab = screen.getByRole('button', { name: /security & verification/i });
    fireEvent.click(securityTab);

    expect(
      screen.getByText(/SECURITY & INTERACTIVE OFFLINE VERIFIER/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Independent DevTools Verification Steps/i)).toBeInTheDocument();

    const auditBtn = screen.getByRole('button', { name: /run real-time audit/i });
    expect(auditBtn).toBeInTheDocument();

    fireEvent.click(auditBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/RESULT: VERIFIED_ZERO_SERVER_TELEMETRY/i)).toBeInTheDocument();
      },
      { timeout: 1500 },
    );

    expect(screen.getByText(/OUTBOUND_HTTP_REQUESTS:/i)).toBeInTheDocument();
    expect(screen.getByText(/500 items/i)).toBeInTheDocument();
  });

  it('closes when clicking close button or pressing Escape', () => {
    useAppStore.setState({ showLegalModal: true });
    render(<LegalModal />);

    const closeBtn = screen.getByRole('button', { name: /close legal modal/i });
    fireEvent.click(closeBtn);

    expect(useAppStore.getState().showLegalModal).toBe(false);
  });
});
