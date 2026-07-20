import { useState, useEffect, useCallback, useRef } from 'react';

const BOOT_STAGES = [
  {
    id: 'bios',
    label: 'System POST',
    progress: [0, 15],
    lines: [
      { text: '', delay: 0 },
      { text: '╔══════════════════════════════════════════════════════════╗', delay: 100 },
      { text: '║             AgneeshOS v2.0.27 — Neural Build             ║', delay: 200 },
      { text: '║       Copyright © 2027 Agneesh Industries Pvt. Ltd       ║', delay: 300 },
      { text: '╚══════════════════════════════════════════════════════════╝', delay: 400 },
      { text: '', delay: 500 },
      { text: '> Checking system memory.............. 32768 MB  [OK]', delay: 700 },
      { text: '> Detecting neural processors......... 8 cores   [ACTIVE]', delay: 1000 },
      { text: '> Initializing quantum bridge......... LINKED    [CONNECTED]', delay: 1300 },
      { text: '> Boot device: NEURAL_SSD_01', delay: 1500 },
      { text: '', delay: 1600 },
    ]
  },
  {
    id: 'ai-core',
    label: 'Loading AI Core',
    progress: [15, 45],
    lines: [
      { text: '── Loading AI Core ──────────────────────────────────────', delay: 0 },
      { text: '', delay: 100 },
      { text: '  ▸ Neural engine v4.2.1 ........................ initialized', delay: 300 },
      { text: '  ▸ Pattern recognition module .................. loaded', delay: 600 },
      { text: '  ▸ Sentiment analysis core ..................... online', delay: 900 },
      { text: '  ▸ Natural language processor .................. calibrated', delay: 1200 },
      { text: '  ▸ Deep learning framework ..................... ready', delay: 1400 },
      { text: '', delay: 1500 },
    ]
  },
  {
    id: 'services',
    label: 'Initializing Neural Engine',
    progress: [45, 75],
    lines: [
      { text: '── Initializing System Services ─────────────────────────', delay: 0 },
      { text: '', delay: 100 },
      { text: '  ▸ Loading project database ............. 6 entries found', delay: 300 },
      { text: '  ▸ Skill matrix ......................... calibrated', delay: 600 },
      { text: '  ▸ Experience timeline .................. synced', delay: 900 },
      { text: '  ▸ Certificate vault .................... verified', delay: 1100 },
      { text: '  ▸ Contact relay ........................ armed', delay: 1300 },
      { text: '', delay: 1400 },
    ]
  },
  {
    id: 'network',
    label: 'Connecting to Satellite',
    progress: [75, 95],
    lines: [
      { text: '── Establishing Satellite Uplink ────────────────────────', delay: 0 },
      { text: '', delay: 100 },
      { text: '  ▸ Uplink established ................... 42.8 Gbps', delay: 400 },
      { text: '  ▸ Portfolio sync ....................... COMPLETE', delay: 700 },
      { text: '  ▸ GitHub integration ................... LINKED', delay: 1000 },
      { text: '  ▸ LinkedIn relay ....................... ACTIVE', delay: 1200 },
      { text: '', delay: 1300 },
    ]
  },
  {
    id: 'complete',
    label: 'System Ready',
    progress: [95, 100],
    lines: [
      { text: '══════════════════════════════════════════════════════════', delay: 0 },
      { text: '', delay: 100 },
      { text: '  ✦  ALL SUBSYSTEMS NOMINAL', delay: 300 },
      { text: '  ✦  AGNEESH-OS IS ONLINE', delay: 500 },
      { text: '', delay: 600 },
      { text: '  Welcome, Operator.', delay: 800 },
      { text: '', delay: 1000 },
    ]
  }
];

const SESSION_KEY = 'agneeshos-booted';

export function useBootSequence() {
  const [hasBooted, setHasBooted] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [currentStage, setCurrentStage] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const markBooted = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setHasBooted(true);
  }, []);

  const skip = useCallback(() => {
    clearAllTimeouts();
    setIsSkipped(true);
    setProgress(100);
    markBooted();
    // Small delay before marking complete so exit animation can play
    setTimeout(() => setIsComplete(true), 300);
  }, [clearAllTimeouts, markBooted]);

  useEffect(() => {
    if (hasBooted) {
      setIsComplete(true);
      return;
    }

    let stageIndex = 0;
    let overallDelay = 0;

    const runStage = (index) => {
      if (index >= BOOT_STAGES.length) {
        const t = setTimeout(() => {
          markBooted();
          setIsComplete(true);
        }, 800);
        timeoutsRef.current.push(t);
        return;
      }

      const stage = BOOT_STAGES[index];
      const [startProgress, endProgress] = stage.progress;

      // Animate progress
      const progressSteps = 10;
      const progressIncrement = (endProgress - startProgress) / progressSteps;
      const stageLineDuration = stage.lines[stage.lines.length - 1].delay;
      const progressInterval = stageLineDuration / progressSteps;

      for (let i = 0; i <= progressSteps; i++) {
        const t = setTimeout(() => {
          setProgress(Math.round(startProgress + progressIncrement * i));
        }, overallDelay + progressInterval * i);
        timeoutsRef.current.push(t);
      }

      // Set current stage label
      const t0 = setTimeout(() => setCurrentStage(index), overallDelay);
      timeoutsRef.current.push(t0);

      // Reveal lines
      stage.lines.forEach((line) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, { text: line.text, stageId: stage.id }]);
        }, overallDelay + line.delay);
        timeoutsRef.current.push(t);
      });

      overallDelay += stageLineDuration + 200;

      // Schedule next stage
      const tNext = setTimeout(() => runStage(index + 1), overallDelay);
      timeoutsRef.current.push(tNext);
    };

    runStage(0);

    return () => clearAllTimeouts();
  }, [hasBooted, clearAllTimeouts, markBooted]);

  return {
    hasBooted,
    currentStage: BOOT_STAGES[currentStage] || BOOT_STAGES[0],
    visibleLines,
    progress,
    isComplete,
    isSkipped,
    skip,
    stages: BOOT_STAGES,
  };
}
