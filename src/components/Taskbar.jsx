import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';

const Taskbar = memo(function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindows();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-12 z-[9000] flex items-center px-2 gap-1"
      style={{
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 255, 65, 0.1)',
      }}
      initial={{ y: 48 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: 'spring', damping: 20 }}
    >
      {/* Start button */}
      <motion.button
        className="h-8 px-3 rounded-lg flex items-center gap-2 text-neon-green font-display text-xs tracking-wider hover:bg-neon-green/10 transition-colors border border-transparent hover:border-neon-green/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-base">⬡</span>
        <span className="hidden sm:inline">AGNEESH</span>
      </motion.button>

      {/* Separator */}
      <div className="w-px h-6 bg-dark-border mx-1" />

      {/* Open windows */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {windows.map((win) => (
          <motion.button
            key={win.id}
            onClick={() => handleTaskClick(win)}
            className={`h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-mono transition-all min-w-0 max-w-[160px] ${
              activeWindowId === win.id && !win.minimized
                ? 'bg-white/5'
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
            <span className="text-sm">{win.icon}</span>
            <span className="truncate text-gray-300" style={{
              color: activeWindowId === win.id ? win.color : undefined
            }}>
              {win.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Performance indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
          <span className="text-[10px] font-mono text-gray-500">SYS OK</span>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-dark-border" />

        {/* Clock */}
        <div className="text-right pl-2">
          <div className="text-xs font-mono text-neon-green tracking-wider">{timeStr}</div>
          <div className="text-[10px] font-mono text-gray-500">{dateStr}</div>
        </div>
      </div>
    </motion.div>
  );
});

export default Taskbar;
