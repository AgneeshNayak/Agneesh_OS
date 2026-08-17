import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AchievementContext = createContext(null);

const ACHIEVEMENT_LIST = [
  { id: 'SYSTEM_BOOT', title: 'System Boot', desc: 'Successfully loaded AgneeshOS mainframe.', icon: '⚡' },
  { id: 'TERMINAL_ACCESS', title: 'Shell Operator', desc: 'Invoked the terminal shell command line.', icon: '⚡' },
  { id: 'AI_SYNAPSE', title: 'Neural Synapse', desc: 'Established communication link with JARVIS AI.', icon: '🤖' },
  { id: 'GAMER_MODE', title: 'Arcade Pilot', desc: 'Launched a mainframe arcade mini-game.', icon: '🎮' },
  { id: 'ACCESS_PALETTE', title: 'Keyboard Wizard', desc: 'Invoked the Ctrl+K command palette search.', icon: '⌨️' },
  { id: 'RECRUIT_ACQUIRED', title: 'Mission Objective', desc: 'Downloaded Agneesh\'s SDE resume.', icon: '📥' },
  { id: 'DASHBOARD_ACTIVATE', title: 'Recruiter Scout', desc: 'Accessed the Ctrl+H recruiter dashboard.', icon: '💼' }
];

import { useSound } from '../hooks/useSound';

export function AchievementProvider({ children }) {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const { settings } = useSettings();
  const { playSound } = useSound();

  // Load unlocked achievements from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agneeshos-achievements');
      const loaded = saved ? JSON.parse(saved) : [];
      setUnlockedIds(loaded);
      
      // Unlock boot achievement immediately on load
      setTimeout(() => {
        triggerUnlock('SYSTEM_BOOT', loaded);
      }, 3000);
    } catch {
      // Fallback
    }
  }, []);

  const triggerUnlock = (id, currentList) => {
    const list = currentList || unlockedIds;
    if (list.includes(id)) return;

    const ach = ACHIEVEMENT_LIST.find(a => a.id === id);
    if (!ach) return;

    // Play retro beep using useSound hook
    playSound('achievement');

    // Show toast popup
    const toastId = `${id}-${Date.now()}`;
    setToasts(prev => [...prev, { ...ach, toastId }]);

    // Update state & local storage
    const nextList = [...list, id];
    setUnlockedIds(nextList);
    localStorage.setItem('agneeshos-achievements', JSON.stringify(nextList));

    // Auto-remove toast after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== toastId));
    }, 4500);
  };

  const unlockAchievement = useCallback((id) => {
    setUnlockedIds(prev => {
      if (prev.includes(id)) return prev;
      triggerUnlock(id, prev);
      return prev;
    });
  }, [unlockedIds]);

  return (
    <AchievementContext.Provider value={{
      achievements: ACHIEVEMENT_LIST,
      unlockedIds,
      unlockAchievement,
      toasts
    }}>
      {children}

      {/* Interactive Floating Achievement Toast popups overlay */}
      <div className="fixed bottom-16 right-4 z-[10000] flex flex-col gap-3 pointer-events-none select-none max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.toastId}
            className="flex items-center gap-4 p-4 rounded-xl border pointer-events-auto bg-dark-bg/95 border-neon-green/30"
            style={{
              boxShadow: '0 0 20px rgba(0,255,65,0.15), inset 0 0 8px rgba(0,255,65,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-neon-green/10 border border-neon-green/30 text-neon-green animate-pulse-neon">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-neon-green uppercase tracking-widest mb-0.5">ACHIEVEMENT UNLOCKED</div>
              <div className="text-xs font-display font-bold text-white tracking-wide truncate">{toast.title}</div>
              <div className="text-[10px] font-mono text-gray-500 leading-normal">{toast.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
