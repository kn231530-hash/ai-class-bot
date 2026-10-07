import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Send, Volume2, Sparkles, Sliders, RotateCcw,
  Copy, Check, Activity, Zap, Play, Square, MessageSquare
} from 'lucide-react';
import { Persona, TranscriptMessage, VoiceState } from '../types';
import { AudioWaveform } from './AudioWaveform';

interface VoiceNexusProps {
  currentPersona: Persona;
  voiceState: VoiceState;
  onToggleMic: () => void;
  messages: TranscriptMessage[];
  onSendMessage: (text: string) => void;
  onReplayAudio: (msg: TranscriptMessage) => void;
  onClearSession: () => void;
  onOpenPersonaModal: () => void;
  voiceRate: number;
  onRateChange: (rate: number) => void;
  voicePitch: number;
  onPitchChange: (pitch: number) => void;
  autoLoopListening: boolean;
  onToggleAutoLoop: () => void;
  latencyMs: number;
  analyser: AnalyserNode | null;
}

export const VoiceNexus: React.FC<VoiceNexusProps> = ({
  currentPersona,
  voiceState,
  onToggleMic,
  messages,
  onSendMessage,
  onReplayAudio,
  onClearSession,
  onOpenPersonaModal,
  voiceRate,
  onRateChange,
  voicePitch,
  onPitchChange,
  autoLoopListening,
  onToggleAutoLoop,
  latencyMs,
  analyser
}) => {
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript on new message
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isProcessing = voiceState === 'processing';

  const quickPrompts = [
    'How do residual streams prevent vanishing gradients?',
    'Explain PagedAttention fragmentation mechanics',
    'Compare Multi-Query vs Grouped-Query Attention',
    'Drill me on QKV affine projections with Socratic questions'
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      {/* Mentor Header Card */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 mb-3 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPersonaModal}
            className="relative group p-0.5 rounded-xl transition-transform hover:scale-105"
            title="Click to switch neural persona"
          >
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border font-heading font-black text-lg transition-colors"
              style={{
                backgroundColor: `${currentPersona.tagColor}15`,
                borderColor: `${currentPersona.tagColor}50`,
                color: currentPersona.tagColor
              }}
            >
              {currentPersona.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0B0F19]" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-sm sm:text-base text-white">
                {currentPersona.name}
              </h2>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${currentPersona.tagColor}20`,
                  color: currentPersona.tagColor
                }}
              >
                {currentPersona.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm sm:max-w-md line-clamp-1">
              {currentPersona.specialty}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-colors ${
              showSettings
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Audio & Synthesis Parameters"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onClearSession}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Conversation Stream"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Synthesis Tuning Drawer */}
      {showSettings && (
        <div className="glass-panel-elevated rounded-xl p-3.5 mb-3 border border-cyan-500/20 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-heading font-semibold text-slate-200">Neural Speech Engine Controls</span>
            <span className="text-[10px] font-mono text-cyan-400">LATENCY: {latencyMs}ms</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Voice Speed</span>
                <span className="font-mono text-cyan-300">{voiceRate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.35"
                step="0.05"
                value={voiceRate}
                onChange={e => onRateChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Neural Pitch</span>
                <span className="font-mono text-purple-300">{voicePitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={voicePitch}
                onChange={e => onPitchChange(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <span className="text-slate-300">Continuous Loop</span>
              <button
                onClick={onToggleAutoLoop}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoLoopListening ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoLoopListening ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Living Frequency Orb & Waveform Chamber */}
      <div className="relative glass-panel rounded-2xl p-4 sm:p-5 mb-3 border border-slate-800/90 shadow-xl overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle cyber background grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isListening
                ? 'bg-cyan-400 animate-ping'
                : isSpeaking
                ? 'bg-purple-400 animate-pulse'
                : isProcessing
                ? 'bg-amber-400 animate-spin'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-slate-300 uppercase tracking-wider font-semibold">
            {isListening
              ? 'Real-Time Audio Ingestion'
              : isSpeaking
              ? `${currentPersona.name} Synthesizing Response`
              : isProcessing
              ? 'Neural Latent Decoding...'
              : 'Voice Nexus Resting'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400 font-mono">48 kHz</span>
        </div>

        {/* Equalizer Waveform */}
        <div className="w-full max-w-md py-2">
          <AudioWaveform
            isActive={isListening || isSpeaking || isProcessing}
            voiceState={voiceState}
            height={48}
            barCount={42}
            analyser={analyser}
            accentColor={currentPersona.tagColor}
          />
        </div>

        {/* Live Audio Mode Indicator text */}
        <p className="text-[11px] text-slate-400 mt-1 text-center font-mono">
          {isListening ? (
            <span className="text-cyan-300">Speak naturally. Real-time neural speech processor active.</span>
          ) : isSpeaking ? (
            <span className="text-purple-300">Listening to {currentPersona.name} explain. Tap mic to pause.</span>
          ) : (
            <span>Tap the floating central mic below or select a cognitive inquiry below to start.</span>
          )}
        </p>
      </div>

      {/* Conversational Stream Transcript Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3 min-h-[220px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-cyan-400/70">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-slate-300 mb-1">
              Neural Voice Stream Empty
            </h3>
            <p className="text-xs max-w-sm text-slate-400 mb-4">
              Begin a voice dialogue with {currentPersona.name} on deep learning architectures, KV cache memory, or adversarial alignment.
            </p>

            {/* Quick Prompt Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md text-left">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-850 text-xs text-slate-300 transition-all text-left flex items-start gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {/* Sender badge & timestamp */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-400">
                  <span className={isUser ? 'text-cyan-400 font-semibold' : 'text-purple-400 font-semibold'}>
                    {isUser ? 'YOU' : currentPersona.name.toUpperCase()}
                  </span>
                  <span>{msg.timestamp}</span>
                  {msg.latencyMs && (
                    <span className="text-[10px] text-slate-400">({msg.latencyMs}ms)</span>
                  )}
                </div>

                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed border relative group ${
                    isUser
                      ? 'bg-slate-900/90 border-cyan-500/30 text-slate-100 rounded-tr-sm shadow-md'
                      : 'glass-panel-elevated border-purple-500/30 text-slate-200 rounded-tl-sm shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Key Concepts Chips */}
                  {msg.keyConcepts && msg.keyConcepts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.keyConcepts.map((concept, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/50"
                        >
                          #{concept}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover utility actions */}
                  <div className="mt-2 flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isUser && (
                      <button
                        onClick={() => onReplayAudio(msg)}
                        className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Replay Voice Synthesis"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={transcriptEndRef} />
      </div>

      {/* Text Input fallback with embedded Mic trigger as per design spec */}
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <div className="relative rounded-full glass-panel-elevated border border-slate-700/80 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all flex items-center shadow-lg">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Message or speak to ${currentPersona.name}...`}
            className="w-full bg-transparent pl-4 pr-24 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {/* Quick in-input mic toggle */}
            <button
              type="button"
              onClick={onToggleMic}
              className={`p-2 rounded-full transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-cyan-400'
              }`}
              title="Voice Mic Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold disabled:opacity-40 hover:opacity-95 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
