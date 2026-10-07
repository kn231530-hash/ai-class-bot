import React from 'react';
import { Zap, Radio, Headphones, Smartphone, Monitor, ShieldCheck } from 'lucide-react';
import { Persona } from '../types';

interface NavbarProps {
  currentPersona: Persona;
  onOpenPersonaModal: () => void;
  streakDays: number;
  totalXp: number;
  latencyMs: number;
  isGammaActive: boolean;
  onToggleGamma: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onOpenPersonaModal,
  streakDays,
  totalXp,
  latencyMs,
  isGammaActive,
  onToggleGamma,
  isMobileFrame,
  onToggleMobileFrame
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-purple-600 to-cyan-400 p-[1px] shadow-sm shadow-cyan-500/30">
            <div className="w-full h-full bg-[#0B0F19] rounded-[7px] flex items-center justify-center">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-cyan-400 via-slate-100 to-purple-400 bg-clip-text text-transparent">
                SYNTHETIX
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-medium">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight hidden sm:block">
              Neural Voice Intelligence & Mastery Academy
            </p>
          </div>
        </div>

        {/* Center / Telemetry Pills */}
        <div className="hidden md:flex items-center gap-3">
          {/* Active Mentor Badge */}
          <button
            onClick={onOpenPersonaModal}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-xs transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: currentPersona.tagColor }}
            />
            <span className="text-slate-300 font-medium">{currentPersona.name}</span>
            <span className="text-[10px] text-slate-400">({currentPersona.title})</span>
          </button>

          {/* 40Hz Gamma Focus Audio Toggle */}
          <button
            onClick={onToggleGamma}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
              isGammaActive
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/30'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
            title="40Hz Gamma Binaural Focus Frequency (Subtle Audio Backdrop)"
          >
            <Headphones className={`w-3.5 h-3.5 ${isGammaActive ? 'text-purple-400' : 'text-slate-400'}`} />
            <span>40Hz FOCUS {isGammaActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right Stats & View Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak & XP */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="text-amber-300 font-semibold">{streakDays}d</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-semibold">{totalXp} XP</span>
          </div>

          {/* Device Preview Toggle */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden lg:flex items-center gap-1 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs"
            title={isMobileFrame ? 'Switch to Studio Expansive View' : 'Switch to Handheld Mobile Frame View'}
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-cyan-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-purple-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
