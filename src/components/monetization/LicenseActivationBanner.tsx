import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const LicenseActivationBanner: React.FC = () => {
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const [notification, setNotification] = useState<{
    type: 'success' | 'pending';
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const activatedParam = params.get('license_activated');
    const tierParam = params.get('tier');

    if (activatedParam === 'true') {
      if (licenseTier !== 'free') {
        setNotification({
          type: 'success',
          title: `FormatPulse ${licenseTier.toUpperCase()} Lifetime Activated!`,
          description: 'Thank you for supporting FormatPulse. Unlimited file sizes and all enterprise engines are unlocked.',
        });
      } else {
        setNotification({
          type: 'pending',
          title: 'Order Completed via Polar.sh!',
          description: 'Your license key was sent to your email. Click here to enter and activate it.',
        });
      }

      // Clean query parameter from URL
      params.delete('license_activated');
      if (tierParam) params.delete('tier');
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, [licenseTier]);

  if (!notification) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-12 right-4 sm:right-8 z-50 max-w-md w-full rounded-2xl bg-[#111114]/95 border border-[#26262C] text-[#F4F4F5] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div
        className={`p-2.5 rounded-xl flex-none border ${
          notification.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30'
        }`}
      >
        {notification.type === 'success' ? (
          <Check className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
        ) : (
          <Sparkles className="w-5 h-5 text-[#FF4F00]" strokeWidth={2.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-[#F4F4F5] flex items-center gap-1.5 font-sans">
          <span>{notification.title}</span>
        </h4>
        <p className="text-2xs text-[#9A9AA5] mt-1 leading-relaxed font-sans">
          {notification.description}
        </p>

        {notification.type === 'pending' && (
          <button
            onClick={() => {
              setNotification(null);
              setShowLicenseModal(true);
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF4F00] hover:bg-[#FF6A20] text-white text-xs font-semibold tracking-tight shadow-[0_0_15px_rgba(255,79,0,0.35)] transition-all font-sans cursor-pointer"
          >
            <span>Enter License Key</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        onClick={() => setNotification(null)}
        className="text-[#71717A] hover:text-[#F4F4F5] p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
