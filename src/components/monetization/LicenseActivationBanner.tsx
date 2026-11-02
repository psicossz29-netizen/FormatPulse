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
      className="fixed bottom-12 right-4 sm:right-8 z-50 max-w-md w-full bg-zinc-900 border border-emerald-500/40 text-zinc-100 p-4 rounded shadow-2xl shadow-emerald-950/50 flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-sm flex-none border border-emerald-500/20">
        {notification.type === 'success' ? (
          <Check className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <Sparkles className="w-5 h-5 text-accent" strokeWidth={2.5} />
        )}
      </div>

      <div className="flex-1 min-w-0 font-mono">
        <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
          <span>{notification.title}</span>
        </h4>
        <p className="text-2xs text-zinc-400 mt-1 leading-relaxed">
          {notification.description}
        </p>

        {notification.type === 'pending' && (
          <button
            onClick={() => {
              setNotification(null);
              setShowLicenseModal(true);
            }}
            className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent hover:bg-accent-hover text-white text-3xs font-bold rounded-xs transition-colors"
          >
            <span>Enter License Key</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <button
        onClick={() => setNotification(null)}
        className="text-zinc-500 hover:text-zinc-300 p-1 rounded-xs transition-colors"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
