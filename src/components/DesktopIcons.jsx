import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DESKTOP_APPS } from '../data/desktopApps';
import { useWindows } from '../contexts/WindowContext';

const DesktopIcon = memo(function DesktopIcon({ app, onDoubleClick }) {
  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl w-20 hover:bg-white/5 transition-colors group"
      onDoubleClick={() => onDoubleClick(app)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      title={`Open ${app.label}`}
    >
      {/* Icon container */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:shadow-lg"
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
      <span className="text-[11px] font-mono text-gray-300 group-hover:text-white text-center leading-tight line-clamp-2 transition-colors">
        {app.label}
      </span>
    </motion.button>
  );
});

const DesktopIcons = memo(function DesktopIcons() {
  const { openWindow } = useWindows();

  const handleDoubleClick = useCallback((app) => {
    if (app.external) {
      window.open(app.external, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow(app.id, app.label, app.icon, app.color);
  }, [openWindow]);

  return (
    <div className="absolute top-2 left-2 right-2 bottom-14 overflow-auto p-2">
      <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-1 content-start">
        {DESKTOP_APPS.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', damping: 20 }}
          >
            <DesktopIcon app={app} onDoubleClick={handleDoubleClick} />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default DesktopIcons;
