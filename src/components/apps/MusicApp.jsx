import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';

// Synthwave and retro tracks
const tracks = [
  { id: 1, title: 'Cyber Dreams', artist: 'Synthwave', duration: '3:42', bpm: 120 },
  { id: 2, title: 'Neon Nights', artist: 'Retrowave', duration: '4:15', bpm: 128 },
  { id: 3, title: 'Digital Rain', artist: 'Ambient', duration: '5:30', bpm: 80 },
  { id: 4, title: 'Neural Pulse', artist: 'Techno', duration: '3:58', bpm: 140 },
  { id: 5, title: 'Quantum State', artist: 'Chillstep', duration: '4:45', bpm: 95 },
  { id: 6, title: 'Ghost in Shell', artist: 'DnB', duration: '3:22', bpm: 174 },
];

// Frequencies for our synthesizer chord progression
const noteFreqs = {
  A2: 110.00, C3: 130.81, E3: 164.81, A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00,
  F2: 87.31, C2: 65.41, G2: 98.00, Dm2: 73.42, Bb2: 116.54, Am2: 110.00,
  E2: 82.41, B2: 123.47, Em2: 82.41, Cmaj2: 65.41, Gmaj2: 98.00, Dmaj2: 73.42,
  B2_alt: 123.47, G2_alt: 98.00, A2_alt: 110.00, Fs2: 92.50,
};

const MusicApp = memo(function MusicApp() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  const canvasRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Web Audio Nodes refs
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const sequencerIntervalRef = useRef(null);
  const stepRef = useRef(0);
  const animationFrameRef = useRef(null);

  // 1. Initialize Audio Context & Nodes
  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    
    analyser.fftSize = 64; // Small fft for clean visualizer bars
    
    // Connect nodes
    gain.connect(analyser);
    analyser.connect(ctx.destination);
    
    // Set initial volume
    gain.gain.value = volume / 100;
    
    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;
    analyserRef.current = analyser;
  };

  // 2. Play a synth note procedural sound
  const playSynthNote = (freq, type = 'sawtooth', duration = 0.3, volumeMultiplier = 0.5) => {
    const ctx = audioCtxRef.current;
    const dest = gainNodeRef.current;
    if (!ctx || !dest) return;

    // Create oscillator and filter
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Filter to warm up the sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'sawtooth' ? 800 : 1500, ctx.currentTime);

    // Pluck envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3 * volumeMultiplier, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Connections
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  };

  // 3. Sequencer step scheduler
  const runSequencerStep = useCallback((trackIndex) => {
    const step = stepRef.current;
    const chordIndex = Math.floor(step / 4) % 4; // 4 chords progression
    const subStep = step % 4;

    // Define progressions for each track
    let chordProgression = [];
    let bassNote = 0;
    let waveType = 'sawtooth';

    switch (trackIndex) {
      case 0: // Cyber Dreams (Synthwave) - Am, F, C, G
        chordProgression = [
          [noteFreqs.A3, noteFreqs.C4, noteFreqs.E4], // Am
          [noteFreqs.A3, noteFreqs.C4, noteFreqs.F4], // F
          [noteFreqs.G3, noteFreqs.C4, noteFreqs.E4], // C
          [noteFreqs.G3, noteFreqs.B3, noteFreqs.D4], // G
        ];
        bassNote = [noteFreqs.A2, noteFreqs.F2, noteFreqs.C2, noteFreqs.G2][chordIndex];
        waveType = 'sawtooth';
        break;
      case 1: // Neon Nights (Retrowave) - Dm, Bb, C, Am
        chordProgression = [
          [noteFreqs.D4, noteFreqs.F4, noteFreqs.A4], // Dm
          [noteFreqs.D4, noteFreqs.F4, noteFreqs.Bb3], // Bb
          [noteFreqs.E4, noteFreqs.G4, noteFreqs.C4], // C
          [noteFreqs.E4, noteFreqs.A4, noteFreqs.C4], // Am
        ];
        bassNote = [noteFreqs.Dm2, noteFreqs.Bb2, noteFreqs.C2, noteFreqs.Am2][chordIndex];
        waveType = 'sawtooth';
        break;
      case 2: // Digital Rain (Ambient) - Em7, Cmaj7, Gmaj7, Dmaj7
        chordProgression = [
          [noteFreqs.E3, noteFreqs.G3, noteFreqs.B3, noteFreqs.D4],
          [noteFreqs.C3, noteFreqs.E3, noteFreqs.G3, noteFreqs.B3],
          [noteFreqs.G3, noteFreqs.B3, noteFreqs.D4, noteFreqs.A4],
          [noteFreqs.D3, noteFreqs.E3, noteFreqs.A3, noteFreqs.D4],
        ];
        bassNote = [noteFreqs.E2, noteFreqs.C2, noteFreqs.G2, noteFreqs.D2][chordIndex];
        waveType = 'sine'; // Sine for soft raindrops
        break;
      case 3: // Neural Pulse (Techno) - Bm, G, A, F#m
        chordProgression = [
          [noteFreqs.D4, noteFreqs.F4, noteFreqs.B3],
          [noteFreqs.D4, noteFreqs.G4, noteFreqs.B3],
          [noteFreqs.E4, noteFreqs.A4, noteFreqs.C4],
          [noteFreqs.C4, noteFreqs.F4, noteFreqs.A3],
        ];
        bassNote = [noteFreqs.B2_alt, noteFreqs.G2_alt, noteFreqs.A2_alt, noteFreqs.Fs2][chordIndex];
        waveType = 'square';
        break;
      case 4: // Quantum State (Chillstep) - Cmaj7, Em7, Fmaj7, G6
        chordProgression = [
          [noteFreqs.C3, noteFreqs.E3, noteFreqs.G3, noteFreqs.B3],
          [noteFreqs.E3, noteFreqs.G3, noteFreqs.B3, noteFreqs.D4],
          [noteFreqs.F3, noteFreqs.A3, noteFreqs.C4, noteFreqs.E4],
          [noteFreqs.G3, noteFreqs.B3, noteFreqs.D4, noteFreqs.E4],
        ];
        bassNote = [noteFreqs.C2, noteFreqs.E2, noteFreqs.F2, noteFreqs.G2][chordIndex];
        waveType = 'triangle';
        break;
      case 5: // Ghost in Shell (DnB)
        chordProgression = [
          [noteFreqs.A3, noteFreqs.C4, noteFreqs.E4],
          [noteFreqs.C4, noteFreqs.E4, noteFreqs.G4],
          [noteFreqs.E4, noteFreqs.G4, noteFreqs.B4],
          [noteFreqs.D4, noteFreqs.F4, noteFreqs.A4],
        ];
        bassNote = [noteFreqs.A2, noteFreqs.C2, noteFreqs.E2, noteFreqs.D2][chordIndex];
        waveType = 'sawtooth';
        break;
      default:
        return;
    }

    // Play bass on step 0 and 2
    if (subStep === 0 || subStep === 2) {
      playSynthNote(bassNote, 'sawtooth', 0.4, 0.7);
    }

    // Play arpeggio chord note based on step
    const notes = chordProgression[chordIndex];
    if (notes && notes.length > 0) {
      const noteToPlay = notes[subStep % notes.length];
      playSynthNote(noteToPlay, waveType, 0.25, 0.4);
    }

    stepRef.current = (step + 1) % 16; // 16 step loop
  }, []);

  // Update volume gain in real-time
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Handle sequencer start and stop
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const bpm = tracks[currentTrack].bpm;
      const stepDurationMs = (60 / bpm) * 1000 / 2; // Eighth note interval

      sequencerIntervalRef.current = setInterval(() => {
        runSequencerStep(currentTrack);
      }, stepDurationMs);
    } else {
      if (sequencerIntervalRef.current) {
        clearInterval(sequencerIntervalRef.current);
      }
    }

    return () => {
      if (sequencerIntervalRef.current) {
        clearInterval(sequencerIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrack, runSequencerStep]);

  // Audio Visualizer Canvas Loop
  useEffect(() => {
    let active = true;

    const draw = () => {
      if (!active || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Clear with slight alpha decay for trailing glow
      ctx.fillStyle = 'rgba(5, 5, 15, 0.3)';
      ctx.fillRect(0, 0, width, height);

      let dataArray = new Uint8Array(32);
      if (isPlaying && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Draw resting sine wave if paused
        const time = Date.now() / 150;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#b400ff';
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.05 + time) * 3;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }

      if (isPlaying) {
        const barWidth = (width / 20) - 2;
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#b400ff');
        gradient.addColorStop(0.5, '#00d4ff');
        gradient.addColorStop(1, '#00ff41');

        for (let i = 0; i < 20; i++) {
          const val = dataArray[i] || 0;
          const pct = val / 255;
          const barHeight = Math.max(4, pct * height * 0.95);

          // Draw neon glowing bar
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#b400ff';
          ctx.fillRect(
            i * (barWidth + 2),
            height - barHeight,
            barWidth,
            barHeight
          );
          ctx.shadowBlur = 0; // reset
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Progress Bar update interval
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentTrack(t => (t + 1) % tracks.length);
            return 0;
          }
          return prev + 0.2;
        });
      }, 500);
    } else {
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  // Clean up nodes on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleTrackSelect = useCallback((index) => {
    setCurrentTrack(index);
    setProgress(0);
    setIsPlaying(true);
    stepRef.current = 0;
  }, []);

  const track = tracks[currentTrack];

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(5,5,15,0.95)' }}>
      {/* Now Playing */}
      <div className="p-6 text-center border-b border-neon-purple/10">
        
        {/* Real-time Web Audio Synthesizer Canvas Visualizer */}
        <div className="relative h-20 mb-4 rounded-lg bg-black/30 overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={340}
            height={80}
            className="w-full h-full block"
          />
        </div>

        <h3 className="font-display text-lg text-neon-purple tracking-wider">{track.title}</h3>
        <p className="text-xs font-mono text-gray-500">{track.artist} • {track.bpm} BPM</p>

        {/* Progress bar */}
        <div className="mt-4 mx-auto max-w-xs">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #b400ff, #00d4ff)', width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono text-gray-600">
              {Math.floor(progress / 100 * 240 / 60)}:{String(Math.floor(progress / 100 * 240 % 60)).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono text-gray-600">{track.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={() => {
              setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);
              setProgress(0);
              stepRef.current = 0;
            }}
            className="text-gray-400 hover:text-white text-lg transition-colors"
          >
            ⏮
          </button>
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'rgba(180,0,255,0.2)', border: '1px solid rgba(180,0,255,0.4)' }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(180,0,255,0.3)' }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>
          <button
            onClick={() => {
              setCurrentTrack((currentTrack + 1) % tracks.length);
              setProgress(0);
              stepRef.current = 0;
            }}
            className="text-gray-400 hover:text-white text-lg transition-colors"
          >
            ⏭
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-gray-500">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-purple-500"
          />
          <span className="text-[10px] font-mono text-gray-500">{volume}%</span>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => handleTrackSelect(i)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left ${i === currentTrack ? 'bg-neon-purple/5' : ''}`}
            style={{ borderLeft: i === currentTrack ? '2px solid #b400ff' : '2px solid transparent' }}
          >
            <span className="text-sm w-6 text-center font-mono" style={{ color: i === currentTrack ? '#b400ff' : '#666' }}>
              {i === currentTrack && isPlaying ? '♫' : i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: i === currentTrack ? '#b400ff' : '#ccc' }}>{t.title}</p>
              <p className="text-[10px] font-mono text-gray-600">{t.artist}</p>
            </div>
            <span className="text-[10px] font-mono text-gray-600">{t.duration}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-dark-border text-center">
        <p className="text-[10px] font-mono text-green-400">⚡ Live Audio Synthesis Engine Online</p>
      </div>
    </div>
  );
});

export default MusicApp;
