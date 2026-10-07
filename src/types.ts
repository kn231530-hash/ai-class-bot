export type TabType = 'voice' | 'academy' | 'drills' | 'analytics';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface Persona {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarSeed: string;
  voiceGender: 'female' | 'male';
  voicePitch: number;
  voiceRate: number;
  systemPrompt: string;
  tagColor: string;
  description: string;
}

export interface TranscriptMessage {
  id: string;
  sender: 'user' | 'agent';
  personaId?: string;
  text: string;
  timestamp: string;
  latencyMs?: number;
  confidence?: number;
  keyConcepts?: string[];
  audioDuration?: number;
}

export interface LessonChecklist {
  id: string;
  text: string;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  tierId: number;
  tierName: string;
  title: string;
  shortDesc: string;
  estimatedMinutes: number;
  progressPercent: number;
  isCompleted: boolean;
  xpReward: number;
  category: string;
  audioDuration: string;
  summary: string;
  fullContent: string[];
  checklist: LessonChecklist[];
  quiz?: QuizQuestion;
  tags: string[];
}

export interface DrillScenario {
  id: string;
  title: string;
  role: string;
  difficulty: 'Tier 1' | 'Tier 2' | 'Tier 3';
  objective: string;
  promptScenario: string;
  initialAgentSpeech: string;
  evaluationCriteria: {
    articulation: number;
    technicalDepth: number;
    pacingWpm: number;
    coherence: number;
  };
  sampleAnswer: string;
}

export interface TelemetryStats {
  latencyMs: number;
  accuracyPercent: number;
  tokenVelocity: number; // tokens/sec
  currentDecibels: number;
  streakDays: number;
  totalXp: number;
  completedLessonsCount: number;
}
