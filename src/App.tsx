import React, { useState, useEffect, useRef } from 'react';
import {
  TabType, VoiceState, Persona, TranscriptMessage, Lesson,
  TelemetryStats, DrillScenario
} from './types';
import { PERSONAS, INITIAL_LESSONS } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { VoiceActionBar } from './components/VoiceActionBar';
import { VoiceNexus } from './components/VoiceNexus';
import { AcademyCurriculum } from './components/AcademyCurriculum';
import { DrillLab } from './components/DrillLab';
import { AnalyticsView } from './components/AnalyticsView';
import { PersonaModal } from './components/PersonaModal';
import { sfx, speakWithNeuralVoice, stopSpeech } from './utils/audioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('voice');
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const voiceStateRef = useRef<VoiceState>('idle');
  voiceStateRef.current = voiceState;
  const [voiceRate, setVoiceRate] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.05);
  const [autoLoopListening, setAutoLoopListening] = useState<boolean>(false);
  const [isGammaActive, setIsGammaActive] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('synthetix_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [messages, setMessages] = useState<TranscriptMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      personaId: 'nova',
      text: 'Neural Nexus initialized. I am Nova, Principal Neural Architect. All transformer diagnostic channels and speech stream interfaces are calibrated at 48kHz. What architectural system shall we interrogate today?',
      timestamp: '00:01',
      latencyMs: 114,
      confidence: 0.99,
      keyConcepts: ['Transformer Topology', 'Latency Optimization']
    }
  ]);

  const [stats, setStats] = useState<TelemetryStats>({
    latencyMs: 118,
    accuracyPercent: 99.4,
    tokenVelocity: 124,
    currentDecibels: -18,
    streakDays: 14,
    totalXp: 4280,
    completedLessonsCount: 1
  });

  const [activeLessonLectureId, setActiveLessonLectureId] = useState<string | null>(null);
  const [isLecturePlaying, setIsLecturePlaying] = useState<boolean>(false);

  // Web Audio Analyser references
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<unknown>(null);

  // Save lessons to localStorage on updates
  useEffect(() => {
    localStorage.setItem('synthetix_lessons', JSON.stringify(lessons));
  }, [lessons]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setVoiceState('idle');
        };

        recognition.onend = () => {
          if (voiceState === 'listening') {
            setVoiceState('idle');
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [voiceState]);

  // Connect microphone for real Web Audio API waveforms
  const initMicrophoneAudio = async () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (!micStreamRef.current && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const node = audioContextRef.current.createAnalyser();
        node.fftSize = 128;
        source.connect(node);
        setAnalyser(node);
      }
    } catch {
      // If mic permission blocked, procedural waveforms will render smoothly
    }
  };

  const handleToggleMic = async () => {
    sfx.playChime('click');

    if (voiceState === 'speaking') {
      stopSpeech();
      setVoiceState('idle');
      return;
    }

    if (voiceState === 'listening') {
      // Stop listening
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (recognitionRef.current && (recognitionRef.current as any).stop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).stop();
      }
      setVoiceState('idle');
      return;
    }

    // Start listening
    await initMicrophoneAudio();
    setVoiceState('listening');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (recognitionRef.current && (recognitionRef.current as any).start) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).start();
      } catch {
        // Already started or busy
      }
    } else {
      // Fallback timer if browser lacks Web Speech API recognition: simulate realistic speech detection after 3.5s
      setTimeout(() => {
        if (voiceStateRef.current === 'listening') {
          handleSendMessage('How does PagedAttention eliminate memory fragmentation during generation?');
        }
      }, 3500);
    }
  };

  // Generate Persona Response
  const generateAgentResponse = (userPrompt: string): { reply: string; concepts: string[] } => {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('pagedattention') || lower.includes('kv') || lower.includes('fragmentation') || lower.includes('memory')) {
      return {
        reply: `PagedAttention addresses physical GPU RAM fragmentation by borrowing paging principles from operating systems. In traditional sequential allocation, up to 70% of KV-cache memory is wasted due to internal fragmentation—reserving contiguous memory for maximum predicted context lengths. By partitioning keys and values into dynamic, non-contiguous physical blocks with an indirection page table, we achieve virtually zero wasted memory and near 4x higher serving concurrency.`,
        concepts: ['PagedAttention', 'KV-Cache', 'Virtual Memory', 'GPU Bandwidth']
      };
    }

    if (lower.includes('residual') || lower.includes('gradient') || lower.includes('vanishing') || lower.includes('manifold')) {
      return {
        reply: `In modern mechanistic interpretability, we conceptualize the residual stream as a continuous additive feature bus. Rather than each transformer layer mutating the complete token state, each attention head and MLP layer writes an additive residual update: x_{l+1} = x_l + Attention(x_l) + MLP(x_l). This additive highway preserves clean gradient flow back to early token embeddings and enables precision concept steering via activation vectors.`,
        concepts: ['Residual Stream', 'Additive Bus', 'Activation Vectors', 'Gradient Highway']
      };
    }

    if (lower.includes('attention') || lower.includes('qkv') || lower.includes('softmax') || lower.includes('scale')) {
      return {
        reply: `Multi-head attention projects token representations into independent query, key, and value affine subspaces. The dot-product similarity QK^T computes raw interaction energy, strictly scaled by 1/√d_k. Without this variance normalizer, larger subspace dimensions drive dot products to high magnitudes, saturating Softmax and pushing backpropagated gradients into vanishing regions.`,
        concepts: ['Attention Geometry', 'QKV Projection', 'Softmax Normalization', 'Subspace Orthogonality']
      };
    }

    if (lower.includes('injection') || lower.includes('jailbreak') || lower.includes('red team') || lower.includes('adversar')) {
      return {
        reply: `Adversarial containment must operate at two distinct layers: first, token-level lexical sanitization against zero-width unicode smuggling and base64 injection; second, latent semantic activation probes that monitor whether safety direction vectors in the residual stream are being suppressed. We enforce an air-gapped dual-evaluator architecture where untrusted user input never touches privileged tool tokens.`,
        concepts: ['Indirect Prompt Injection', 'Latent Probing', 'Air-Gapped Sandbox', 'Dual-LLM Evaluator']
      };
    }

    // Default intelligent response matching persona
    return {
      reply: `Analyzing your inquiry through the ${currentPersona.specialty} lens. To optimize this cognitive subsystem, we must preserve strict dimensional orthogonality while minimizing memory-bandwidth bottlenecks. The key tradeoff lies in test-time compute scaling versus autoregressive generation latency. Let us test your hypothesis directly with a targeted drill.`,
      concepts: ['System Architecture', 'Latency Budget', 'Test-Time Compute']
    };
  };

  const handleSendMessage = (text: string) => {
    sfx.playChime('click');
    const userMsg: TranscriptMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 0.99
    };

    setMessages(prev => [...prev, userMsg]);
    setVoiceState('processing');

    const simulatedLatency = Math.floor(100 + Math.random() * 35);
    setStats(prev => ({
      ...prev,
      latencyMs: simulatedLatency,
      totalXp: prev.totalXp + 25
    }));

    setTimeout(() => {
      const response = generateAgentResponse(text);
      const agentMsg: TranscriptMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        personaId: currentPersona.id,
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: simulatedLatency,
        keyConcepts: response.concepts
      };

      setMessages(prev => [...prev, agentMsg]);
      setVoiceState('speaking');

      // Synthesize neural voice speech
      speakWithNeuralVoice(
        response.reply,
        currentPersona.voicePitch * voicePitch,
        currentPersona.voiceRate * voiceRate,
        () => setVoiceState('speaking'),
        () => {
          setVoiceState('idle');
          if (autoLoopListening) {
            setTimeout(() => handleToggleMic(), 400);
          }
        }
      );
    }, 650);
  };

  const handleReplayAudio = (msg: TranscriptMessage) => {
    stopSpeech();
    sfx.playChime('click');
    setVoiceState('speaking');
    speakWithNeuralVoice(
      msg.text,
      currentPersona.voicePitch * voicePitch,
      currentPersona.voiceRate * voiceRate,
      () => setVoiceState('speaking'),
      () => setVoiceState('idle')
    );
  };

  const handleClearSession = () => {
    stopSpeech();
    sfx.playChime('click');
    setMessages([]);
    setVoiceState('idle');
  };

  const handleToggleChecklistItem = (lessonId: string, itemId: string) => {
    sfx.playChime('click');
    setLessons(prev =>
      prev.map(l => {
        if (l.id !== lessonId) return l;
        const updatedChecklist = l.checklist.map(c =>
          c.id === itemId ? { ...c, completed: !c.completed } : c
        );
        const completedCount = updatedChecklist.filter(c => c.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);
        const isDone = progress >= 100;

        if (isDone && !l.isCompleted) {
          sfx.playChime('success');
          setStats(s => ({ ...s, totalXp: s.totalXp + l.xpReward }));
        }

        return {
          ...l,
          checklist: updatedChecklist,
          progressPercent: progress,
          isCompleted: isDone
        };
      })
    );
  };

  const handleStartVoiceWithLesson = (lesson: Lesson) => {
    sfx.playChime('activate');
    setActiveTab('voice');
    const promptText = `Drill me on ${lesson.title}: ${lesson.summary}`;
    handleSendMessage(promptText);
  };

  const handlePlayLessonLecture = (lesson: Lesson) => {
    sfx.playChime('click');
    if (isLecturePlaying && activeLessonLectureId === lesson.id) {
      stopSpeech();
      setIsLecturePlaying(false);
      setActiveLessonLectureId(null);
      setVoiceState('idle');
      return;
    }

    stopSpeech();
    setIsLecturePlaying(true);
    setActiveLessonLectureId(lesson.id);
    setVoiceState('speaking');

    const lectureSpeech = `${lesson.title}. ${lesson.summary} ${lesson.fullContent.join(' ')}`;
    speakWithNeuralVoice(
      lectureSpeech,
      currentPersona.voicePitch * voicePitch,
      currentPersona.voiceRate * voiceRate,
      () => {
        setIsLecturePlaying(true);
        setVoiceState('speaking');
      },
      () => {
        setIsLecturePlaying(false);
        setActiveLessonLectureId(null);
        setVoiceState('idle');
      }
    );
  };

  const handleToggleGamma = () => {
    const nextState = !isGammaActive;
    sfx.toggleGammaFocus(nextState);
    setIsGammaActive(nextState);
    sfx.playChime(nextState ? 'activate' : 'click');
  };

  const handleSelectPersona = (persona: Persona) => {
    setCurrentPersona(persona);
    setIsPersonaModalOpen(false);
    sfx.playChime('activate');
    const greetingText = `Switched mentor to ${persona.name}, ${persona.title}. Voice frequency tuned for ${persona.specialty}.`;
    const newMsg: TranscriptMessage = {
      id: `sys-${Date.now()}`,
      sender: 'agent',
      personaId: persona.id,
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latencyMs: 110,
      keyConcepts: [persona.name, 'Cognitive Profile']
    };
    setMessages(prev => [...prev, newMsg]);
    speakWithNeuralVoice(
      greetingText,
      persona.voicePitch,
      persona.voiceRate,
      () => setVoiceState('speaking'),
      () => setVoiceState('idle')
    );
  };

  const handlePreviewVoice = (persona: Persona) => {
    stopSpeech();
    sfx.playChime('click');
    speakWithNeuralVoice(
      `Hello, I am ${persona.name}. Calibrating neural speech synthesis.`,
      persona.voicePitch,
      persona.voiceRate
    );
  };

  const handleExportNotes = () => {
    const textData = messages.map(m => `[${m.sender.toUpperCase()} - ${m.timestamp}]:\n${m.text}\n`).join('\n');
    navigator.clipboard.writeText(textData);
    sfx.playChime('success');
    alert('Synthetix session transcripts and telemetry copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#DFE2F1] flex flex-col font-sans selection:bg-cyan-500/25 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPersona={currentPersona}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        streakDays={stats.streakDays}
        totalXp={stats.totalXp}
        latencyMs={stats.latencyMs}
        isGammaActive={isGammaActive}
        onToggleGamma={handleToggleGamma}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center py-2 sm:py-4 px-2 sm:px-4">
        {/* If Mobile Frame Mode is enabled, wrap in an ergonomic phone container as specified in design doc */}
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[420px] rounded-[42px] border-4 border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0B0F19] my-2 relative pb-10 ring-1 ring-cyan-500/20'
              : 'max-w-5xl'
          }`}
        >
          {/* Dynamic Safe Area / Island if Mobile Frame */}
          {isMobileFrame && (
            <div className="w-full pt-3 pb-2 flex justify-center items-center pointer-events-none">
              <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse mr-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>
          )}

          {/* Screen Routing */}
          {activeTab === 'voice' && (
            <VoiceNexus
              currentPersona={currentPersona}
              voiceState={voiceState}
              onToggleMic={handleToggleMic}
              messages={messages}
              onSendMessage={handleSendMessage}
              onReplayAudio={handleReplayAudio}
              onClearSession={handleClearSession}
              onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
              voiceRate={voiceRate}
              onRateChange={setVoiceRate}
              voicePitch={voicePitch}
              onPitchChange={setVoicePitch}
              autoLoopListening={autoLoopListening}
              onToggleAutoLoop={() => setAutoLoopListening(!autoLoopListening)}
              latencyMs={stats.latencyMs}
              analyser={analyser}
            />
          )}

          {activeTab === 'academy' && (
            <AcademyCurriculum
              lessons={lessons}
              onToggleChecklistItem={handleToggleChecklistItem}
              onStartVoiceWithLesson={handleStartVoiceWithLesson}
              onPlayLessonLecture={handlePlayLessonLecture}
              currentPersona={currentPersona}
              isLecturePlaying={isLecturePlaying}
              activeLessonLectureId={activeLessonLectureId}
            />
          )}

          {activeTab === 'drills' && (
            <DrillLab
              currentPersona={currentPersona}
              voiceState={voiceState}
              onToggleMic={handleToggleMic}
              onRecordDrillResponse={() => {}}
              onPlaySampleSpeech={text => {
                stopSpeech();
                sfx.playChime('click');
                speakWithNeuralVoice(text, currentPersona.voicePitch, currentPersona.voiceRate);
              }}
              analyser={analyser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              stats={stats}
              onExportNotes={handleExportNotes}
            />
          )}
        </div>
      </main>

      {/* Fixed 88px clearance Floating Voice Action Bar Dock */}
      <VoiceActionBar
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          sfx.playChime('click');
        }}
        voiceState={voiceState}
        onToggleMic={handleToggleMic}
        latencyMs={stats.latencyMs}
        activePersonaName={currentPersona.name}
      />

      {/* Neural Persona Modal */}
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
        onPreviewVoice={handlePreviewVoice}
      />
    </div>
  );
}
