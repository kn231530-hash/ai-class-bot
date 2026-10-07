import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  voiceState: 'idle' | 'listening' | 'processing' | 'speaking';
  height?: number;
  barCount?: number;
  analyser?: AnalyserNode | null;
  accentColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  voiceState,
  height = 54,
  barCount = 36,
  analyser,
  accentColor = '#06B6D4'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dataArray: Uint8Array<ArrayBuffer> | null = null;
    if (analyser) {
      dataArray = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }

    const render = () => {
      phaseRef.current += 0.08;
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      // Total spacing: width = barCount * barWidth + (barCount - 1) * gap
      const barWidth = 3;
      const gap = 3;
      const totalBarWidth = barCount * barWidth + (barCount - 1) * gap;
      const startX = Math.max(0, (width - totalBarWidth) / 2);

      if (analyser && dataArray && isActive) {
        analyser.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barWidth + gap);
        let barNormalizedHeight = 0.12; // resting min

        if (isActive) {
          if (analyser && dataArray) {
            const index = Math.floor((i / barCount) * (dataArray.length * 0.45));
            const freq = dataArray[index] || 0;
            barNormalizedHeight = Math.max(0.12, freq / 255);
          } else if (voiceState === 'listening' || voiceState === 'speaking') {
            // Procedural living waveform calculation with dual sine waves
            const sin1 = Math.sin(phaseRef.current + i * 0.28);
            const sin2 = Math.cos(phaseRef.current * 1.4 + i * 0.45);
            const centerBell = Math.sin((i / barCount) * Math.PI); // Peak towards middle
            const boost = voiceState === 'speaking' ? 0.85 : 0.65;
            barNormalizedHeight = Math.max(0.12, Math.abs(sin1 * 0.6 + sin2 * 0.4) * centerBell * boost + 0.15);
          } else if (voiceState === 'processing') {
            // Travelling pulse ripple
            const pulse = Math.sin(phaseRef.current * 2 - i * 0.35);
            barNormalizedHeight = Math.max(0.15, (pulse + 1) * 0.4);
          }
        }

        const barH = Math.max(4, barNormalizedHeight * (h - 8));
        const y = (h - barH) / 2;

        ctx.save();
        ctx.beginPath();
        // Rounded caps
        const radius = barWidth / 2;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barH - radius);
        ctx.quadraticCurveTo(x + barWidth, y + barH, x + barWidth - radius, y + barH);
        ctx.lineTo(x + radius, y + barH);
        ctx.quadraticCurveTo(x, y + barH, x, y + barH - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (isActive && (voiceState === 'speaking' || voiceState === 'listening' || voiceState === 'processing')) {
          const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
          gradient.addColorStop(0, '#06B6D4'); // Neural Cyan
          gradient.addColorStop(1, '#8B5CF6'); // Mastery Violet
          ctx.fillStyle = gradient;

          // Ambient glow
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = voiceState === 'speaking' ? 10 : 6;
        } else {
          ctx.fillStyle = '#374151'; // Inactive resting bar color as per design spec
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, voiceState, barCount, analyser, accentColor]);

  return (
    <div className="flex items-center justify-center w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={barCount * 6 + 20}
        height={height}
        className="max-w-full"
      />
    </div>
  );
};
