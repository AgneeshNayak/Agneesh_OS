import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { DESKTOP_APPS } from '../data/desktopApps';
import { useAchievements } from '../contexts/AchievementContext';

const Taskbar = memo(function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openWindow } = useWindows();
  const { unlockAchievement } = useAchievements();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleTaskClick = (win) => {
    if (activeWindowId === win.id && !win.minimized) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const handleLaunchApp = useCallback((app) => {
    setIsStartOpen(false);
    if (app.external) {
      window.open(app.external, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow(app.id, app.label, app.icon, app.color);
  }, [openWindow]);

  const handleDownloadResume = () => {
    setIsStartOpen(false);
    unlockAchievement('RECRUIT_ACQUIRED');
    window.open('/Agneesh_Resume.pdf', '_blank');
    const link = document.createElement('a');
    link.href = '/Agneesh_Resume.pdf';
    link.download = 'Agneesh_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Start Menu / Mobile App Drawer Modal */}
      <AnimatePresence>
        {isStartOpen && (
          <div className="fixed inset-0 z-[9500] flex items-end sm:items-end justify-start p-2 sm:p-4 pb-14 pointer-events-auto">
            {/* Backdrop click listener */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStartOpen(false)}
            />

            {/* Centered / Scaled Navigation Panel */}
            <motion.div
              className="w-full max-w-md mx-auto sm:mx-0 glass-strong rounded-2xl border border-neon-green/30 overflow-hidden relative z-10 flex flex-col max-h-[85vh] sm:max-h-[75vh]"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                boxShadow: '0 0 30px rgba(0,255,65,0.15), 0 10px 40px rgba(0,0,0,0.8)'
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-dark-border flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neon-green/10 border border-neon-green/40 flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-neon-green tracking-wider">AGNEESH NAYAK</h3>
                    <p className="font-mono text-[10px] text-gray-400">Software Engineer • CSE '27</p>
                  </div>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setIsStartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer text-base font-bold"
                  title="Close Menu"
                >
                  ×
                </button>
              </div>

              {/* Menu Title */}
              <div className="px-4 py-2 bg-black/20 border-b border-dark-border flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-neon-blue uppercase">// NAVIGATION MENU</span>
                <span className="text-[9px] font-mono text-gray-500">Tap to launch</span>
              </div>

              {/* Apps & Navigation Grid */}
              <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DESKTOP_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-neon-green/30 transition-all text-center group cursor-pointer"
                  >
                    <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">{app.icon}</span>
                    <span className="text-xs font-mono text-gray-300 group-hover:text-white truncate w-full">{app.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Social Links */}
              <div className="px-4 py-3 border-t border-dark-border bg-black/40 grid grid-cols-3 gap-2">
                <a
                  href="https://github.com/AgneeshNayak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-center text-gray-300 hover:text-white transition-colors"
                >
                  🐙 GitHub
                </a>
                <a
                  href="https://linkedin.com/in/AgneeshNayak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-center text-gray-300 hover:text-white transition-colors"
                >
                  🔗 LinkedIn
                </a>
                <a
                  href="https://leetcode.com/u/Agneesh_A_Nayak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-center text-gray-300 hover:text-white transition-colors"
                >
                  📝 LeetCode
                </a>
              </div>

              {/* Download Resume Bottom Action */}
              <div className="p-3 border-t border-dark-border bg-black/60">
                <button
                  onClick={handleDownloadResume}
                  className="w-full py-2.5 px-4 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/50 text-neon-green font-display text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📥 DOWNLOAD RESUME (PDF)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Taskbar Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-12 z-[9000] flex items-center px-2 gap-1 select-none"
        style={{
          background: 'rgba(10, 10, 15, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 255, 65, 0.15)',
        }}
        initial={{ y: 48 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20 }}
      >
        {/* Start / Menu button */}
        <motion.button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={`h-8 px-3 rounded-lg flex items-center gap-2 font-display text-xs tracking-wider transition-all border cursor-pointer ${
            isStartOpen
              ? 'bg-neon-green/20 text-neon-green border-neon-green/50 shadow-[0_0_12px_rgba(0,255,65,0.2)]'
              : 'text-neon-green hover:bg-neon-green/10 border-transparent hover:border-neon-green/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open Navigation Menu"
        >
          <span className="text-base">⬡</span>
          <span className="hidden sm:inline">AGNEESH</span>
          <span className="sm:hidden text-[10px] font-mono">MENU</span>
        </motion.button>

        {/* Separator */}
        <div className="w-px h-6 bg-dark-border mx-1 shrink-0" />

        {/* Open windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {windows.map((win) => (
            <motion.button
              key={win.id}
              onClick={() => handleTaskClick(win)}
              className={`h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-mono transition-all min-w-0 max-w-[160px] shrink-0 cursor-pointer ${
                activeWindowId === win.id && !win.minimized
                  ? 'bg-white/10'
                  : win.minimized
                    ? 'opacity-50 hover:opacity-80'
                    : 'hover:bg-white/5'
              }`}
              style={{
                borderBottom: activeWindowId === win.id && !win.minimized
                  ? `2px solid ${win.color}`
                  : '2px solid transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <span className="text-sm shrink-0">{win.icon}</span>
              <span className="truncate text-gray-300" style={{
                color: activeWindowId === win.id ? win.color : undefined
              }}>
                {win.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0 pl-1">
          {/* Performance indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
            <span className="text-[10px] font-mono text-gray-500">SYS OK</span>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-dark-border" />

          {/* Clock */}
          <div className="text-right">
            <div className="text-xs font-mono text-neon-green tracking-wider font-semibold">{timeStr}</div>
            <div className="text-[9px] sm:text-[10px] font-mono text-gray-500">{dateStr}</div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

export default Taskbar;
