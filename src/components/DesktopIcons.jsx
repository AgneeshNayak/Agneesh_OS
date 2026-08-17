import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DESKTOP_APPS } from '../data/desktopApps';
import { useWindows } from '../contexts/WindowContext';

const DesktopIcon = memo(function DesktopIcon({ app, onActivate }) {
  const handleClick = (e) => {
    // Single tap on touch devices, or double click on mouse
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768) {
      onActivate(app);
    }
  };

  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl w-18 sm:w-20 hover:bg-white/5 transition-colors group cursor-pointer"
      onClick={handleClick}
      onDoubleClick={() => onActivate(app)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      title={`Open ${app.label}`}
    >
      {/* Icon container */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 group-hover:shadow-lg shrink-0"
        style={{
          background: `${app.color}10`,
          border: `1px solid ${app.color}20`,
          boxShadow: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 15px ${app.color}30`;
          e.currentTarget.style.borderColor = `${app.color}50`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = `${app.color}20`;
        }}
      >
        {app.icon}
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-[11px] font-mono text-gray-300 group-hover:text-white text-center leading-tight line-clamp-2 transition-colors">
        {app.label}
      </span>
    </motion.button>
  );
});

const DesktopIcons = memo(function DesktopIcons() {
  const { openWindow } = useWindows();

  const handleActivate = useCallback((app) => {
    if (app.external) {
      window.open(app.external, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow(app.id, app.label, app.icon, app.color);
  }, [openWindow]);

  return (
    <div className="absolute top-2 left-2 right-2 bottom-14 overflow-auto p-1 sm:p-2 z-30">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] sm:grid-cols-[repeat(auto-fill,80px)] gap-1 content-start justify-items-center">
        {DESKTOP_APPS.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: 'spring', damping: 20 }}
          >
            <DesktopIcon app={app} onActivate={handleActivate} />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default DesktopIcons;
