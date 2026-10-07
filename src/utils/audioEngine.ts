// Audio Engine: Web Audio API, Frequency Analyzer, Speech Synthesis & Recognition, Sound FX

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private gammaOscLeft: OscillatorNode | null = null;
  private gammaOscRight: OscillatorNode | null = null;
  private gammaGain: GainNode | null = null;
  private isGammaPlaying: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Futuristic UI activation beep
  playChime(type: 'activate' | 'success' | 'click' | 'alert' = 'click') {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'activate') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(240, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      } else {
        // subtle tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // 40Hz Gamma Neural Focus Sound (Binaural Beats)
  toggleGammaFocus(enable: boolean, volume = 0.04) {
    try {
      const ctx = this.getContext();
      if (!enable) {
        if (this.gammaGain) {
          this.gammaGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        }
        if (this.gammaOscLeft) {
          this.gammaOscLeft.stop();
          this.gammaOscLeft.disconnect();
          this.gammaOscLeft = null;
        }
        if (this.gammaOscRight) {
          this.gammaOscRight.stop();
          this.gammaOscRight.disconnect();
          this.gammaOscRight = null;
        }
        this.isGammaPlaying = false;
        return;
      }

      if (this.isGammaPlaying) return;

      const merger = ctx.createChannelMerger(2);
      this.gammaGain = ctx.createGain();
      this.gammaGain.gain.setValueAtTime(volume, ctx.currentTime);

      this.gammaOscLeft = ctx.createOscillator();
      this.gammaOscLeft.type = 'sine';
      this.gammaOscLeft.frequency.value = 210; // Left ear carrier

      this.gammaOscRight = ctx.createOscillator();
      this.gammaOscRight.type = 'sine';
      this.gammaOscRight.frequency.value = 250; // Right ear + 40Hz difference = 40Hz Gamma beat

      this.gammaOscLeft.connect(merger, 0, 0);
      this.gammaOscRight.connect(merger, 0, 1);
      merger.connect(this.gammaGain);
      this.gammaGain.connect(ctx.destination);

      this.gammaOscLeft.start();
      this.gammaOscRight.start();
      this.isGammaPlaying = true;
    } catch {
      // Silently ignore if audio context error
    }
  }

  isGammaActive(): boolean {
    return this.isGammaPlaying;
  }
}

export const sfx = new SoundEffectsEngine();

// Speech Synthesis Helper
export const speakWithNeuralVoice = (
  text: string,
  pitch = 1.0,
  rate = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onStart?.();
    setTimeout(() => onEnd?.(), 2500);
    return null;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  // Find a high quality natural or english voice
  const preferredVoice = voices.find(
    v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Victoria')) && v.lang.startsWith('en')
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };
  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
