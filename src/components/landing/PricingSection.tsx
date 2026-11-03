import React from 'react';
import { Zap, Check, Shield, ExternalLink, Key, Building2, Users } from 'lucide-react';
import { PRICING_PLANS, buildCheckoutUrl } from '@/services/checkoutService';
import { openExternalUrl } from '@/core/desktopBridge';
import { useAppStore } from '@/store/useAppStore';

export const PricingSection: React.FC = () => {
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);

  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="max-w-[1160px] mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight max-w-[22ch] mx-auto">
            Compra única. Propiedad de por vida.
          </h2>
          <p className="mt-4 font-geist text-base sm:text-lg text-[#9A9AA5] max-w-xl mx-auto leading-relaxed">
            Sin suscripciones recurrentes ni costes ocultos. Licencia perpetua con validación local e ilimitada.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          {/* Individual Pro (Featured) */}
          <div className="p-8 rounded-[28px] bg-[#111114] border-2 border-[#FF4F00] relative flex flex-col justify-between shadow-[0_20px_50px_rgba(255,79,0,0.2)]">
            <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-[#FF4F00] text-white text-[11px] font-geist font-bold uppercase tracking-wider rounded-full shadow-md">
              {PRICING_PLANS.individual.badge}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <h3 className="text-xl font-display font-bold text-[#F4F4F5]">
                  {PRICING_PLANS.individual.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-[#FF4F00]/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#FF4F00]" />
                </div>
              </div>
              <p className="text-xs font-geist text-[#9A9AA5] mb-6 leading-relaxed">
                {PRICING_PLANS.individual.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-[#26262C]">
                <span className="text-4xl font-extrabold font-geist-mono text-[#F4F4F5]">
                  ${PRICING_PLANS.individual.priceUSD}
                </span>
                <span className="text-sm font-geist-mono text-[#9A9AA5] line-through">
                  ${PRICING_PLANS.individual.regularPriceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-geist-mono uppercase">
                  USD · Un solo pago
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.individual.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-geist text-[#F4F4F5]">
                    <div className="w-4 h-4 rounded-full bg-[#FF4F00]/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#FF4F00]" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('individual')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('individual'));
                }}
                className="w-full h-11 bg-[#FF4F00] hover:bg-[#FF6A20] text-white font-geist text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-xl shadow-[0_0_20px_rgba(255,79,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Obtener Licencia Pro ($14 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2.5 text-center text-[11px] font-geist text-[#9A9AA5]">
                Entrega instantánea mediante Polar.sh Merchant of Record
              </div>
            </div>
          </div>

          {/* Team Pack */}
          <div className="p-8 rounded-[28px] bg-[#111114] border border-[#26262C] hover:border-white/20 relative flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-display font-bold text-[#F4F4F5]">
                  {PRICING_PLANS.team.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#9A9AA5]" />
                </div>
              </div>
              <p className="text-xs font-geist text-[#9A9AA5] mb-6 leading-relaxed">
                {PRICING_PLANS.team.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-[#26262C]">
                <span className="text-4xl font-extrabold font-geist-mono text-[#F4F4F5]">
                  ${PRICING_PLANS.team.priceUSD}
                </span>
                <span className="text-sm font-geist-mono text-[#9A9AA5] line-through">
                  ${PRICING_PLANS.team.regularPriceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#9A9AA5] text-[10px] font-geist-mono uppercase">
                  USD · 5 Equipos
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.team.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-geist text-[#F4F4F5]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('team')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('team'));
                }}
                className="w-full h-11 bg-white/[0.05] hover:bg-white/[0.1] text-[#F4F4F5] font-geist text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-xl border border-[#26262C] hover:border-white/20"
              >
                <span>Comprar Team Pack ($79 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2.5 text-center text-[11px] font-geist text-[#9A9AA5]">
                Factura deducible de impuestos con NIF/CIF
              </div>
            </div>
          </div>

          {/* Enterprise Air-Gapped */}
          <div className="p-8 rounded-[28px] bg-[#111114] border border-[#26262C] hover:border-white/20 relative flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-display font-bold text-[#F4F4F5]">
                  {PRICING_PLANS.enterprise.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs font-geist text-[#9A9AA5] mb-6 leading-relaxed">
                {PRICING_PLANS.enterprise.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-[#26262C]">
                <span className="text-4xl font-extrabold font-geist-mono text-[#F4F4F5]">
                  ${PRICING_PLANS.enterprise.priceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-geist-mono uppercase">
                  USD · Ilimitados
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.enterprise.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-geist text-[#F4F4F5]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('enterprise')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('enterprise'));
                }}
                className="w-full h-11 bg-white hover:bg-zinc-200 text-[#09090B] font-geist text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-xl shadow-lg"
              >
                <span>Desplegar Enterprise ($199 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2.5 text-center text-[11px] font-geist text-[#9A9AA5]">
                Paquete de licencia intranet / air-gapped
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#111114] border border-[#26262C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center flex-none">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left text-xs font-geist text-[#9A9AA5]">
              <span className="text-[#F4F4F5] font-semibold">Garantía de reembolso de 14 días:</span> Si no se adapta a tus requisitos de cumplimiento o flujo, te devolvemos el 100% sin preguntas.
            </div>
          </div>

          <button
            onClick={() => setShowLicenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-[#26262C] text-[#F4F4F5] text-xs font-geist transition-all flex-none focus:outline-none"
          >
            <Key className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>¿Ya compraste? Activar Clave</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs font-geist text-[#9A9AA5]">
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-[#F4F4F5] transition-colors"
          >
            Términos del Servicio y EULA
          </button>
          {' · '}
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-[#F4F4F5] transition-colors"
          >
            Política de Privacidad Cero-Datos
          </button>
        </div>
      </div>
    </section>
  );
};
