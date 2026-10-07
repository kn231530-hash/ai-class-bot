import React from 'react';
import { Mic, MicOff, Sparkles, BookOpen, Target, Activity } from 'lucide-react';
import { TabType, VoiceState } from '../types';

interface VoiceActionBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  voiceState: VoiceState;
  onToggleMic: () => void;
  latencyMs: number;
  activePersonaName: string;
}

export const VoiceActionBar: React.FC<VoiceActionBarProps> = ({
  activeTab,
  onTabChange,
  voiceState,
  onToggleMic,
  latencyMs,
  activePersonaName
}) => {
  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isProcessing = voiceState === 'processing';

  return (
    <aside aria-label="Voice Controls & Navigation" className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none pb-2 sm:pb-4 px-3 max-w-xl mx-auto">
      {/* Floating Glass Dock */}
      <div className="w-full glass-panel-elevated rounded-full p-2 px-3 sm:px-4 flex items-center justify-between pointer-events-auto border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 relative">
        {/* Left Nav: Nexus & Academy */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('voice')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'voice'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Nexus</span>
          </button>

          <button
            onClick={() => onTabChange('academy')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'academy'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">Academy</span>
          </button>
        </div>

        {/* Center: The Floating 64x64px Neural Mic */}
        <div className="relative -top-3 sm:-top-4 mx-2 flex flex-col items-center">
          {/* Concentric Pulse Rings when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
              <div className="absolute -inset-2 rounded-full border border-cyan-400/50 animate-pulse pointer-events-none" />
            </>
          )}

          {isSpeaking && (
            <div className="absolute -inset-1.5 rounded-full border border-purple-400/60 animate-pulse pointer-events-none" />
          )}

          <button
            onClick={onToggleMic}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg ${
              isListening
                ? 'bg-gradient-to-tr from-cyan-400 to-purple-500 scale-105 shadow-[0_0_30px_rgba(6,182,212,0.65)] ring-4 ring-cyan-400/30'
                : isSpeaking
                ? 'bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(139,92,246,0.55)] ring-2 ring-purple-400/40'
                : isProcessing
                ? 'bg-slate-800 border-2 border-cyan-400/60 animate-spin text-cyan-400'
                : 'bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-400/40'
            }`}
            title={isListening ? 'Stop listening' : 'Start speaking with Neural Voice'}
          >
            {isListening ? (
              <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 animate-bounce" />
            ) : isSpeaking ? (
              <span className="flex items-center justify-center gap-0.5">
                <span className="w-1 h-4 bg-slate-950 rounded-full animate-pulse" />
                <span className="w-1 h-6 bg-slate-950 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-3 bg-slate-950 rounded-full animate-pulse delay-150" />
              </span>
            ) : isProcessing ? (
              <Activity className="w-6 h-6 text-cyan-400" />
            ) : (
              <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" />
            )}
          </button>

          {/* Micro Telemetry badge below mic button */}
          <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700/60 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isListening
                  ? 'bg-cyan-400 animate-ping'
                  : isSpeaking
                  ? 'bg-purple-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span>{isListening ? 'LISTENING' : isSpeaking ? 'SYNTHETIX' : `${latencyMs}ms`}</span>
          </div>
        </div>

        {/* Right Nav: Drills & Telemetry */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('drills')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'drills'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Drills</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Metrics</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
