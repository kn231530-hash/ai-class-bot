import React, { useState } from 'react';
import {
  BookOpen, Check, Play, Pause, ChevronRight, Award,
  Sparkles, Clock, Volume2, ArrowLeft, CheckCircle2, RotateCcw
} from 'lucide-react';
import { Lesson, Persona } from '../types';
import { sfx } from '../utils/audioEngine';

interface AcademyCurriculumProps {
  lessons: Lesson[];
  onToggleChecklistItem: (lessonId: string, itemId: string) => void;
  onStartVoiceWithLesson: (lesson: Lesson) => void;
  onPlayLessonLecture: (lesson: Lesson) => void;
  currentPersona: Persona;
  isLecturePlaying: boolean;
  activeLessonLectureId: string | null;
}

export const AcademyCurriculum: React.FC<AcademyCurriculumProps> = ({
  lessons,
  onToggleChecklistItem,
  onStartVoiceWithLesson,
  onPlayLessonLecture,
  currentPersona,
  isLecturePlaying,
  activeLessonLectureId
}) => {
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filteredLessons = lessons.filter(l =>
    selectedTier === 'all' ? true : l.tierId === selectedTier
  );

  const totalCompleted = lessons.filter(l => l.isCompleted || l.progressPercent >= 100).length;
  const overallProgress = Math.round((totalCompleted / lessons.length) * 100);

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    sfx.playChime('click');
  };

  const handleQuizSubmit = (correctIndex: number) => {
    setQuizSubmitted(true);
    if (selectedQuizAnswer === correctIndex) {
      sfx.playChime('success');
    } else {
      sfx.playChime('alert');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-3 sm:px-4 pb-28 pt-2">
      {/* If a lesson is open, show Lesson Deep-Dive Reader */}
      {activeLesson ? (
        <div className="animate-in fade-in slide-in-from-right-3 duration-200">
          {/* Back Bar */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setActiveLesson(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Curriculum</span>
            </button>

            <span className="text-xs font-mono text-purple-400 font-semibold">
              {activeLesson.tierName}
            </span>
          </div>

          {/* Lesson Main Container */}
          <div className="glass-panel-elevated rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    {activeLesson.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    {activeLesson.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <Award className="w-3 h-3" />
                    +{activeLesson.xpReward} XP
                  </span>
                </div>
                <h1 className="font-heading font-bold text-lg sm:text-xl text-white">
                  {activeLesson.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">{activeLesson.shortDesc}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPlayLessonLecture(activeLesson)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-heading font-semibold text-xs transition-all shadow-md ${
                    isLecturePlaying && activeLessonLectureId === activeLesson.id
                      ? 'bg-rose-500 text-white shadow-rose-500/20'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  {isLecturePlaying && activeLessonLectureId === activeLesson.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Lecture</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Audio Lecture</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onStartVoiceWithLesson(activeLesson)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full font-heading font-semibold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 hover:opacity-95 shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Drill in Nexus</span>
                </button>
              </div>
            </div>

            {/* Audio Lecture Status Banner */}
            {isLecturePlaying && activeLessonLectureId === activeLesson.id && (
              <div className="my-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs animate-pulse">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 font-medium">
                    {currentPersona.name} is narrating this lesson at {currentPersona.voiceRate}x speed...
                  </span>
                </div>
                <span className="font-mono text-[10px] text-cyan-400">{activeLesson.audioDuration}</span>
              </div>
            )}

            {/* Lesson Body Content */}
            <div className="my-5 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 italic font-sans border-l-2 border-l-cyan-400">
                "{activeLesson.summary}"
              </div>

              {activeLesson.fullContent.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Checklist Section - As specified: 20x20px square with 6px rounded corners */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h3 className="font-heading font-semibold text-sm text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Mastery Verification Checklist
              </h3>
              <div className="space-y-2.5">
                {activeLesson.checklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onToggleChecklistItem(activeLesson.id, item.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 cursor-pointer transition-all"
                  >
                    {/* Checklist box: 20x20px with 6px rounded corners */}
                    <div
                      className={`w-5 h-5 rounded-[6px] shrink-0 flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-[#8B5CF6] shadow-sm shadow-purple-500/50'
                          : 'border border-slate-600 bg-slate-800/80 hover:border-slate-400'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs select-none ${
                        item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flash Quiz Verification Section */}
            {activeLesson.quiz && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Cognitive Knowledge Check
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">+100 XP</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mb-3">
                  {activeLesson.quiz.question}
                </p>

                <div className="space-y-2 mb-3">
                  {activeLesson.quiz.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizAnswer === optIdx;
                    const isCorrect = optIdx === activeLesson.quiz!.correctIndex;
                    let optionClass = 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected) {
                        optionClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      optionClass = 'bg-cyan-950/60 border-cyan-400 text-cyan-200';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => !quizSubmitted && setSelectedQuizAnswer(optIdx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${optionClass}`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono bg-slate-800 border border-slate-700">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedQuizAnswer === null}
                    onClick={() => handleQuizSubmit(activeLesson.quiz!.correctIndex)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs disabled:opacity-40 hover:opacity-95 transition-opacity"
                  >
                    Submit Verification
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <p className="font-semibold text-white mb-1">
                      {selectedQuizAnswer === activeLesson.quiz.correctIndex ? '✓ Correct! Explanation:' : '✗ Insight:'}
                    </p>
                    <p className="text-slate-400">{activeLesson.quiz.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Curriculum List View */
        <div>
          {/* Top Academy Banner */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-4 border border-slate-800/80 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  Synthetix Knowledge Framework
                </span>
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white mt-0.5">
                  Accelerated Neural Academy
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-lg">
                  Master transformer mechanics, KV-cache dynamics, autonomous reasoning loops, and adversarial cyber containment.
                </p>
              </div>

              {/* Overall Progress Gauge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-cyan-300">{overallProgress}% Complete</div>
                  <div className="text-[10px] text-slate-400 font-mono">{totalCompleted}/{lessons.length} Modules</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center p-1 relative">
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center font-mono text-xs font-bold text-cyan-400"
                    style={{
                      background: `conic-gradient(#06B6D4 ${overallProgress * 3.6}deg, #1F2937 0deg)`
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0B0F19] flex items-center justify-center">
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Filter Tabs */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTier === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                All Tiers
              </button>
              <button
                onClick={() => setSelectedTier(1)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTier === 1
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Tier 1: Mechanics
              </button>
              <button
                onClick={() => setSelectedTier(2)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTier === 2
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Tier 2: Synthetic Reasoning
              </button>
              <button
                onClick={() => setSelectedTier(3)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTier === 3
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Tier 3: Cyber Architectures
              </button>
            </div>
          </div>

          {/* Academy Card Grid - Following design spec exact guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredLessons.map(lesson => {
              const completedCount = lesson.checklist.filter(c => c.completed).length;
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleOpenLesson(lesson)}
                  className="rounded-2xl glass-panel p-4 border border-white/10 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-lg"
                >
                  {/* Top Edge Hairline Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  {/* Card Header & Badges */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {lesson.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{lesson.estimatedMinutes}m</span>
                        <span>•</span>
                        <span className="text-amber-400">+{lesson.xpReward} XP</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {lesson.shortDesc}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Progress Track */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-slate-400">
                      <span>{completedCount}/{lesson.checklist.length} Checkpoints</span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-cyan-400 font-semibold">
                        <span>Study</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* 2px Neon Cyan/Violet Gradient Progress Bar along the card footer as specified */}
                    <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                        style={{ width: `${lesson.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
