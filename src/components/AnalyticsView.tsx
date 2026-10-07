import React from 'react';
import {
  Activity, Zap, Award, Clock, Cpu, BarChart2, CheckCircle2,
  Download, Copy, Flame, Radio, Shield, Brain
} from 'lucide-react';
import { TelemetryStats } from '../types';

interface AnalyticsViewProps {
  stats: TelemetryStats;
  onExportNotes: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, onExportNotes }) => {
  const skillDimensions = [
    { label: 'Attention Mechanics', score: 96, color: '#06B6D4' },
    { label: 'KV-Cache Dynamics', score: 88, color: '#8B5CF6' },
    { label: 'Agentic Tool Grounding', score: 82, color: '#10B981' },
    { label: 'Red-Team Resilience', score: 79, color: '#F59E0B' },
    { label: 'Verbal Articulation', score: 93, color: '#06B6D4' }
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-4 border border-slate-800/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Cognitive Telemetry & Growth Vectors
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white">
            Telemetry & Competency Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Real-time tracking of speech latency, token throughput velocity, mastery XP, and conceptual retention.
          </p>
        </div>

        <button
          onClick={onExportNotes}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold transition-all hover:bg-slate-850"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Session Synthesis</span>
        </button>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Streak Ring Card */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 to-rose-500 mb-2 relative">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <span className="font-mono text-xl font-extrabold text-amber-300">{stats.streakDays} Days</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Synaptic Streak</span>
        </div>

        {/* Total Mastery XP */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-600 mb-2 relative">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <span className="font-mono text-xl font-extrabold text-cyan-300">{stats.totalXp} XP</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Tier 2 Scholar</span>
        </div>

        {/* Neural Audio Latency */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 to-cyan-500 mb-2 relative">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <span className="font-mono text-xl font-extrabold text-emerald-400">{stats.latencyMs} ms</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Roundtrip Latency</span>
        </div>

        {/* Recognition Accuracy */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-emerald-400 mb-2 relative">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <span className="font-mono text-xl font-extrabold text-purple-300">{stats.accuracyPercent}%</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Phonetic Accuracy</span>
        </div>
      </div>

      {/* Cognitive Skill Competency Matrix */}
      <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 border border-slate-700/80 mb-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white">
              Neural Competency Spectrum
            </h3>
            <p className="text-xs text-slate-400">Algorithmic calibration evaluated across voice sessions</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">91.6 Avg Mastery</span>
        </div>

        <div className="space-y-3.5">
          {skillDimensions.map((dim, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-300 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                  {dim.label}
                </span>
                <span className="font-mono text-slate-400">
                  <span className="text-slate-100 font-bold">{dim.score}</span> / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${dim.score}%`,
                    background: `linear-gradient(90deg, #06B6D4 0%, ${dim.color} 100%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware & Token Telemetry Box */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-xs">
        <h4 className="font-heading font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Hardware & Edge Inference Telemetry
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] block text-slate-500">Audio Sample Rate</span>
            <span className="text-slate-200 font-semibold">48,000 Hz</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] block text-slate-500">Token Velocity</span>
            <span className="text-slate-200 font-semibold">124 tok/sec</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] block text-slate-500">Binaural Carrier</span>
            <span className="text-purple-300 font-semibold">210 / 250 Hz</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] block text-slate-500">Security Sandbox</span>
            <span className="text-emerald-300 font-semibold">CONTAINED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
