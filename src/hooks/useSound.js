import { useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export function useSound() {
  const { settings } = useSettings();
  const audioCtxRef = useRef(null);

  const initCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = useCallback((type) => {
    // Strict mute enforcement
    if (!settings.soundEnabled || settings.performanceMode) return;

    try {
      const ctx = initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (type) {
        case 'click':
          // Short, crisp chiptune click
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'window-open':
          // Ascending swoop
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.18);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          
          osc.start(now);
          osc.stop(now + 0.18);
          break;

        case 'window-close':
          // Descending sweep
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(250, now + 0.18);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          
          osc.start(now);
          osc.stop(now + 0.18);
          break;

        case 'achievement':
          // Classic retro chiptune chime arpeggio
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          
          osc.type = 'square';
          osc2.type = 'triangle';
          
          gain.connect(ctx.destination);
          gain2.connect(ctx.destination);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          gain2.gain.setValueAtTime(0, now);
          gain2.gain.linearRampToValueAtTime(0.05, now + 0.01);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          osc2.connect(gain2);

          // Chime arpeggio notes
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
          osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6

          osc2.frequency.setValueAtTime(261.63, now); // C4
          osc2.frequency.setValueAtTime(329.63, now + 0.14); // E4

          osc.start(now);
          osc.stop(now + 0.3);
          osc2.start(now);
          osc2.stop(now + 0.3);
          break;

        default:
          break;
      }
    } catch (e) {
      console.warn('Procedural synth sound trigger failed:', e);
    }
  }, [settings.soundEnabled, settings.performanceMode]);

  return { playSound };
}
