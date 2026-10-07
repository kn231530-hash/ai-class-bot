import React from 'react';
import { X, Volume2, Check, Sparkles, Brain, Shield, Compass } from 'lucide-react';
import { Persona } from '../types';
import { PERSONAS } from '../data/curriculumData';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onPreviewVoice: (persona: Persona) => void;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  currentPersona,
  onSelectPersona,
  onPreviewVoice
}) => {
  if (!isOpen) return null;

  const getPersonaIcon = (id: string) => {
    switch (id) {
      case 'nova':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'astraea':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'cipher':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'lyra':
        return <Compass className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-modal rounded-2xl p-5 sm:p-6 overflow-hidden relative border border-cyan-500/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Select Neural Voice Mentor</h3>
            <p className="text-xs text-slate-400">Choose specialized cognitive voice persona & speaking style</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona list */}
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {PERSONAS.map(persona => {
            const isSelected = persona.id === currentPersona.id;
            return (
              <div
                key={persona.id}
                onClick={() => onSelectPersona(persona)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${persona.tagColor}15`,
                        borderColor: `${persona.tagColor}40`
                      }}
                    >
                      {getPersonaIcon(persona.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-semibold text-sm text-slate-100">{persona.name}</h4>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${persona.tagColor}20`,
                            color: persona.tagColor
                          }}
                        >
                          {persona.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{persona.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>PITCH: {persona.voicePitch}x</span>
                        <span>•</span>
                        <span>SPEED: {persona.voiceRate}x</span>
                        <span>•</span>
                        <span className="capitalize">{persona.voiceGender} Neural Voice</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onPreviewVoice(persona);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Preview Voice Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity"
          >
            Confirm Voice Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
