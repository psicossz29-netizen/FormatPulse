import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION, SUPPORT_EMAIL, REPOSITORY_URL } from '@/constants/version';
import { openExternalUrl } from '@/core/desktopBridge';

export const LandingFooter: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  return (
    <footer className="border-t border-[#26262C] bg-[#09090B] py-14 select-none">
      <div className="max-w-[1160px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <a href="#top" className="flex items-center gap-2.5 font-display font-bold text-lg text-[#F4F4F5] mb-3">
              <FormatPulseLogo size={24} animate={false} />
              <span>FormatPulse</span>
              <span className="text-[10px] font-mono text-[#9A9AA5] px-1.5 py-0.5 rounded border border-[#26262C] bg-[#111114]">
                v{APP_VERSION}
              </span>
            </a>
            <p className="font-geist text-sm text-[#9A9AA5] max-w-sm leading-relaxed">
              Estudio de datos 100% local. Convierte formatos, infiere esquemas y enmascara datos sensibles sin telemetría de servidor.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-geist-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span>Ejecución local en memoria · Sin cookies de rastreo</span>
            </div>
          </div>

          {/* Col 2: Producto */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F4F4F5] mb-4">Producto</h4>
            <ul className="space-y-2.5 font-geist text-sm text-[#9A9AA5]">
              <li>
                <a href="#productos" className="hover:text-[#F4F4F5] transition-colors">
                  Conversor de formatos
                </a>
              </li>
              <li>
                <a href="#flujo" className="hover:text-[#F4F4F5] transition-colors">
                  Flujo de trabajo
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F4F4F5] transition-colors">
                  Planes y Precios
                </a>
              </li>
              <li>
                <a href="#installer" className="hover:text-[#F4F4F5] transition-colors">
                  Instalador Windows .exe
                </a>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('workspace')}
                  className="hover:text-[#FF4F00] text-left transition-colors font-medium"
                >
                  Abrir estudio →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Recursos y Legal */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F4F4F5] mb-4">Recursos</h4>
            <ul className="space-y-2.5 font-geist text-sm text-[#9A9AA5]">
              <li>
                <a href="#seguridad" className="hover:text-[#F4F4F5] transition-colors">
                  Auditoría de Privacidad
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#F4F4F5] transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <button
                  onClick={() => setShowLegalModal(true)}
                  className="hover:text-[#F4F4F5] text-left transition-colors"
                >
                  Términos y Privacidad Cero
                </button>
              </li>
              <li>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    void openExternalUrl(REPOSITORY_URL);
                  }}
                  className="hover:text-[#F4F4F5] transition-colors"
                >
                  Repositorio GitHub
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`}
                  onClick={(e) => {
                    e.preventDefault();
                    void openExternalUrl(`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`);
                  }}
                  className="hover:text-[#F4F4F5] transition-colors"
                >
                  Contacto y Soporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#26262C] flex flex-col sm:flex-row items-center justify-between gap-4 font-geist text-xs text-[#9A9AA5]">
          <p>© 2026 FormatPulse. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="hover:text-[#F4F4F5] transition-colors"
            >
              Descargar Desktop v{APP_VERSION}
            </button>
            <span>·</span>
            <span className="text-emerald-400">100% Local-First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
