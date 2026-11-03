import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Download, ShieldCheck, Zap, HelpCircle, Layers, Moon, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);
  const language = useSettingsStore((s) => s.language);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = [
    {
      label: language === 'es' ? 'Abrir el estudio (Workspace)' : 'Launch Studio (Workspace)',
      category: 'Acción',
      icon: Terminal,
      action: () => {
        onClose();
        setViewMode('workspace');
      },
    },
    {
      label: language === 'es' ? 'Descargar para Windows .exe' : 'Download Windows .exe',
      category: 'Descarga',
      icon: Download,
      action: () => {
        onClose();
        setShowDownloadModal(true);
      },
    },
    {
      label: language === 'es' ? 'Conversor de formatos' : 'Format converter',
      category: 'Sección',
      icon: Layers,
      action: () => {
        onClose();
        window.location.hash = '#productos';
      },
    },
    {
      label: language === 'es' ? 'Flujo de trabajo (Paso a paso)' : 'Workflow steps',
      category: 'Sección',
      icon: Layers,
      action: () => {
        onClose();
        window.location.hash = '#flujo';
      },
    },
    {
      label: language === 'es' ? 'Verificar privacidad en DevTools' : 'Verify privacy in DevTools',
      category: 'Seguridad',
      icon: ShieldCheck,
      action: () => {
        onClose();
        window.location.hash = '#seguridad';
      },
    },
    {
      label: language === 'es' ? 'Precios y Planes Lifetime' : 'Pricing & Lifetime Plans',
      category: 'Comercial',
      icon: Zap,
      action: () => {
        onClose();
        window.location.hash = '#pricing';
      },
    },
    {
      label: language === 'es' ? 'Preguntas frecuentes (FAQ)' : 'Frequently Asked Questions (FAQ)',
      category: 'Ayuda',
      icon: HelpCircle,
      action: () => {
        onClose();
        window.location.hash = '#faq';
      },
    },
    {
      label: language === 'es' ? 'Alternar tema Claro / Oscuro' : 'Toggle Light / Dark theme',
      category: 'Ajuste',
      icon: Moon,
      action: () => {
        onClose();
        const curr = document.documentElement.dataset.theme;
        const next = curr === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('fp-theme', next);
      },
    },
  ];

  const filtered = items.filter((it) =>
    it.label.toLowerCase().includes(query.toLowerCase()) ||
    it.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl bg-[#111114] border border-[#26262C] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#26262C]">
          <Search className="w-4 h-4 text-[#FF4F00] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={language === 'es' ? 'Ir a una sección o ejecutar una acción...' : 'Go to section or execute action...'}
            className="flex-1 bg-transparent border-none text-[#F4F4F5] text-sm font-geist placeholder-[#9A9AA5] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs font-geist text-[#9A9AA5]">
              {language === 'es' ? 'Sin resultados para la búsqueda' : 'No matching results'}
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={item.label}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#FF4F00]/15 text-[#F4F4F5] border border-[#FF4F00]/30'
                        : 'text-[#9A9AA5] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF4F00]' : 'text-[#9A9AA5]'}`} />
                      <span className="font-geist text-sm text-[#F4F4F5] font-medium">{item.label}</span>
                    </div>
                    <span className="font-geist-mono text-[11px] text-[#9A9AA5] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Keyboard Hints Footer */}
        <div className="px-4 py-2 border-t border-[#26262C] bg-[#09090B]/60 flex items-center justify-between text-[11px] font-geist-mono text-[#9A9AA5]">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para seleccionar</span>
          </div>
          <span>ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
};
