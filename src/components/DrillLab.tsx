import React, { useState } from 'react';
import {
  Target, Mic, MicOff, Volume2, Award, Sparkles, CheckCircle2,
  AlertTriangle, Play, RefreshCw, BarChart2, ShieldAlert, Cpu
} from 'lucide-react';
import { DrillScenario, Persona, VoiceState } from '../types';
import { DRILL_SCENARIOS } from '../data/curriculumData';
import { AudioWaveform } from './AudioWaveform';
import { sfx } from '../utils/audioEngine';

interface DrillLabProps {
  currentPersona: Persona;
  voiceState: VoiceState;
  onToggleMic: () => void;
  onRecordDrillResponse: (drill: DrillScenario, transcript: string) => void;
  onPlaySampleSpeech: (text: string) => void;
  analyser: AnalyserNode | null;
}

export const DrillLab: React.FC<DrillLabProps> = ({
  currentPersona,
  voiceState,
  onToggleMic,
  onRecordDrillResponse,
  onPlaySampleSpeech,
  analyser
}) => {
  const [selectedDrill, setSelectedDrill] = useState<DrillScenario>(DRILL_SCENARIOS[0]);
  const [drillAnswerText, setDrillAnswerText] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [drillScore, setDrillScore] = useState<{
    articulation: number;
    technicalDepth: number;
    pacingWpm: number;
    coherence: number;
    overall: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const handleSelectDrill = (drill: DrillScenario) => {
    setSelectedDrill(drill);
    setIsEvaluated(false);
    setDrillScore(null);
    setDrillAnswerText('');
    sfx.playChime('click');
  };

  const handleSimulateEvaluation = () => {
    // Generate realistic telemetry evaluation based on input or scenario
    const textLen = drillAnswerText.trim().split(/\s+/).length;
    const baseDepth = textLen > 25 ? 94 : textLen > 10 ? 82 : 72;
    const articulation = Math.min(99, Math.max(80, baseDepth + Math.floor(Math.random() * 8) - 3));
    const technicalDepth = Math.min(98, Math.max(75, baseDepth + Math.floor(Math.random() * 6)));
    const pacingWpm = 132 + Math.floor(Math.random() * 15);
    const coherence = Math.min(99, Math.max(82, baseDepth + 4));
    const overall = Math.round((articulation + technicalDepth + coherence) / 3);

    const result = {
      articulation,
      technicalDepth,
      pacingWpm,
      coherence,
      overall,
      feedback: `Strong systems-level grounding. Your distinction between memory-bandwidth limitations and compute bottlenecks directly addressed the core executive hesitation.`,
      strengths: [
        'Precise usage of architectural terminology without excessive jargon fluff',
        'Directly answered the timeline constraint before elaborating',
        'Natural vocal cadence and pacing around 135 WPM'
      ],
      improvements: [
        'Mention concrete hardware cost metrics (e.g. FLOPs utilization percentage)',
        'Clarify fallback logic in case speculative draft acceptance rate dips below 60%'
      ]
    };

    setDrillScore(result);
    setIsEvaluated(true);
    sfx.playChime('success');
  };

  const handleLoadSampleToTest = () => {
    setDrillAnswerText(selectedDrill.sampleAnswer);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-4 border border-slate-800/80 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Neural Voice Simulations & Defense Drills
          </span>
        </div>
        <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white">
          Active Defense & Pitch Drills
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Simulate high-stakes verbal scenarios: defend complex architectures to CTOs, triage active prompt injection attacks, or brief executive boards.
        </p>

        {/* Drill Selector Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {DRILL_SCENARIOS.map(drill => (
            <button
              key={drill.id}
              onClick={() => handleSelectDrill(drill)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedDrill.id === drill.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {drill.difficulty}: {drill.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Drill Card */}
      <div className="glass-panel-elevated rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-xl mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                {selectedDrill.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ROLE: {selectedDrill.role}
              </span>
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              {selectedDrill.title}
            </h3>
          </div>

          <button
            onClick={() => onPlaySampleSpeech(selectedDrill.initialAgentSpeech)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Play Scenario Audio</span>
          </button>
        </div>

        {/* Objective & Agent Challenge */}
        <div className="my-4 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
              Mission Objective:
            </span>
            <p className="text-slate-200 leading-relaxed">{selectedDrill.objective}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs relative">
            <div className="flex items-center gap-2 mb-1.5 text-cyan-300 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Interlocutor Prompt:</span>
            </div>
            <p className="text-slate-100 italic leading-relaxed">
              "{selectedDrill.initialAgentSpeech}"
            </p>
          </div>
        </div>

        {/* Speech input / text sandbox for drill */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Your Verbal Response</span>
            <button
              onClick={handleLoadSampleToTest}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Fill Benchmark Response
            </button>
          </div>

          <textarea
            rows={4}
            value={drillAnswerText}
            onChange={e => setDrillAnswerText(e.target.value)}
            placeholder="Speak your response via the neural mic or type your structured technical defense..."
            className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleMic}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  voiceState === 'listening'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{voiceState === 'listening' ? 'Recording Voice...' : 'Record Voice Answer'}</span>
              </button>

              <button
                type="button"
                onClick={() => onPlaySampleSpeech(selectedDrill.sampleAnswer)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-slate-400 hover:text-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Benchmark</span>
              </button>
            </div>

            <button
              onClick={handleSimulateEvaluation}
              disabled={!drillAnswerText.trim()}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs disabled:opacity-40 hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Evaluate Articulation & Depth</span>
            </button>
          </div>
        </div>

        {/* Evaluation Rubric Results */}
        {isEvaluated && drillScore && (
          <div className="mt-6 pt-5 border-t border-slate-800 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h4 className="font-heading font-bold text-base text-white">
                  Neural Delivery Scorecard
                </h4>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold">
                SCORE: {drillScore.overall}/100
              </div>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Articulation</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{drillScore.articulation}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Technical Depth</span>
                <span className="text-lg font-bold text-purple-300 font-mono">{drillScore.technicalDepth}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Pacing</span>
                <span className="text-lg font-bold text-amber-300 font-mono">{drillScore.pacingWpm} wpm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Coherence</span>
                <span className="text-lg font-bold text-emerald-300 font-mono">{drillScore.coherence}%</span>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
                <span className="text-cyan-400 font-semibold block mb-1">Synthetix AI Assessment:</span>
                <p className="leading-relaxed">{drillScore.feedback}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-slate-300">
                  <span className="text-emerald-400 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Strengths
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {drillScore.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-300">
                  <span className="text-amber-400 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Mastery Calibration
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {drillScore.improvements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
