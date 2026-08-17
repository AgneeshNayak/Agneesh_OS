import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAchievements } from '../contexts/AchievementContext';

const commands = [
  // APPS
  { id: 'app-about', title: 'Open About Me', category: 'Applications', icon: '👤', action: 'app', appId: 'about', appTitle: 'About Me', color: '#00ff41' },
  { id: 'app-projects', title: 'Open Projects', category: 'Applications', icon: '📁', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#00d4ff' },
  { id: 'app-skills', title: 'Open Skills Matrix', category: 'Applications', icon: '📊', action: 'app', appId: 'skills', appTitle: 'Skills Matrix', color: '#b400ff' },
  { id: 'app-experience', title: 'Open Experience Log', category: 'Applications', icon: '💼', action: 'app', appId: 'experience', appTitle: 'Experience', color: '#ff6b00' },
  { id: 'app-contact', title: 'Open Contact Terminal', category: 'Applications', icon: '📧', action: 'app', appId: 'contact', appTitle: 'Contact', color: '#ff0080' },
  { id: 'app-terminal', title: 'Open Terminal Emulator', category: 'Applications', icon: '⚡', action: 'app', appId: 'terminal', appTitle: 'Terminal', color: '#00ff41' },
  { id: 'app-settings', title: 'Open System Settings', category: 'Applications', icon: '⚙️', action: 'app', appId: 'settings', appTitle: 'Settings', color: '#00d4ff' },
  { id: 'app-ai', title: 'Open AI Assistant (JARVIS)', category: 'Applications', icon: '🤖', action: 'app', appId: 'ai', appTitle: 'AI Assistant', color: '#00fff5' },
  { id: 'app-music', title: 'Open Music Player', category: 'Applications', icon: '🎵', action: 'app', appId: 'music', appTitle: 'Music Player', color: '#b400ff' },
  { id: 'app-games', title: 'Open Arcade Mini-Games', category: 'Applications', icon: '🎮', action: 'app', appId: 'games', appTitle: 'Snake Game', color: '#ff6b00' },
  { id: 'app-weather', title: 'Open Weather Monitor', category: 'Applications', icon: '🌤️', action: 'app', appId: 'weather', appTitle: 'Weather', color: '#00d4ff' },
  { id: 'app-certificates', title: 'Open Certificates Gallery', category: 'Applications', icon: '📜', action: 'app', appId: 'certificates', appTitle: 'Certificates', color: '#ffd700' },
  { id: 'app-recycle', title: 'Open Recycle Bin', category: 'Applications', icon: '🗑️', action: 'app', appId: 'recycle', appTitle: 'Recycle Bin', color: '#888888' },

  // PROJECTS (Shortcut to open projects app)
  { id: 'proj-laptop', title: 'Show Laptop Rental Management System', category: 'Projects', icon: '💻', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#00ff41' },
  { id: 'proj-warehouse', title: 'Show FEFO Smart Warehouse Management', category: 'Projects', icon: '📦', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#ffd700' },
  { id: 'proj-cargarage', title: 'Show CarGaragePro System', category: 'Projects', icon: '🚗', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#00d4ff' },
  { id: 'proj-placement', title: 'Show PlacementPro Portal', category: 'Projects', icon: '🎓', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#ff0080' },
  { id: 'proj-disaster', title: 'Show Real-Time Disaster Alert System', category: 'Projects', icon: '🚨', action: 'app', appId: 'projects', appTitle: 'Projects', color: '#ff6b00' },

  // SYSTEM ACTIONS
  { id: 'action-perf', title: 'Toggle Performance Mode', category: 'System Settings', icon: '⚡', action: 'performance' },
  { id: 'action-resume', title: 'Download Professional Resume', category: 'System Settings', icon: '📥', action: 'resume' },

  // LINKS
  { id: 'link-github', title: 'Open GitHub Repository', category: 'External Links', icon: '🐙', action: 'link', url: 'https://github.com/AgneeshNayak' },
  { id: 'link-linkedin', title: 'Open LinkedIn Profile', category: 'External Links', icon: '🔗', action: 'link', url: 'https://linkedin.com/in/AgneeshNayak' },
  { id: 'link-leetcode', title: 'Open LeetCode Profile', category: 'External Links', icon: '📝', action: 'link', url: 'https://leetcode.com/u/Agneesh_A_Nayak/' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { openWindow } = useWindows();
  const { settings, togglePerformanceMode, getAccentColor } = useSettings();
  const { unlockAchievement } = useAchievements();
  
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Accent color from system context
  const accentColor = getAccentColor();

  // Listen to global key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle palette on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) unlockAchievement('ACCESS_PALETTE');
          return next;
        });
        setQuery('');
        setSelectedIndex(0);
      }
      
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, unlockAchievement]);

  // Focus input field when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isOpen]);

  // Filter commands by fuzzy match query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const cleanQuery = query.toLowerCase().trim();
    return commands.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(cleanQuery) ||
        cmd.category.toLowerCase().includes(cleanQuery)
      );
    });
  }, [query]);

  // Reset selected item index if filtered results count changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Auto-scroll selected element into list viewport
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  // Handle option selection
  const handleSelect = useCallback((cmd) => {
    if (!cmd) return;

    switch (cmd.action) {
      case 'app':
        openWindow(cmd.appId, cmd.appTitle, cmd.icon, cmd.color);
        break;
      case 'performance':
        togglePerformanceMode();
        break;
      case 'resume':
        unlockAchievement('RECRUIT_ACQUIRED');
        window.open('/Agneesh_Resume.pdf', '_blank');
        const link = document.createElement('a');
        link.href = '/Agneesh_Resume.pdf';
        link.download = 'Agneesh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'link':
        window.open(cmd.url, '_blank');
        break;
      default:
        break;
    }

    setIsOpen(false);
  }, [openWindow, togglePerformanceMode, unlockAchievement]);

  // Handle keyboard list navigation
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9900] flex items-start justify-center pt-4 sm:pt-[12vh] px-3 sm:px-4 pb-4">
          
          {/* Backdrop Blur overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Centered VS Code-style modal box */}
          <motion.div
            className="w-full max-w-xl glass-strong rounded-xl overflow-hidden relative border flex flex-col max-h-[85vh]"
            style={{
              borderColor: `${accentColor}30`,
              boxShadow: `0 0 30px ${accentColor}15, 0 10px 40px rgba(0,0,0,0.6)`
            }}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            {/* Holographic scanner top overlay */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
            }} />

            {/* Input block */}
            <div className="p-4 border-b border-dark-border flex items-center gap-3">
              <span className="text-gray-500 font-mono text-sm font-bold">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or app name to launch..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder:text-gray-600"
              />
              <span className="text-[10px] font-mono text-gray-500 px-1.5 py-0.5 border border-dark-border rounded bg-black/20 uppercase">
                ESC
              </span>
            </div>

            {/* Filtered items list */}
            <div 
              ref={listRef}
              className="max-h-[320px] overflow-y-auto p-2 space-y-0.5"
            >
              {filteredCommands.length > 0 ? (
                // Group categorisation logic for visual separation
                filteredCommands.map((cmd, index) => {
                  const isSelected = index === selectedIndex;
                  const showHeader = index === 0 || filteredCommands[index - 1].category !== cmd.category;

                  return (
                    <div key={cmd.id}>
                      {showHeader && (
                        <div className="text-[10px] font-mono font-bold tracking-wider text-gray-600 uppercase px-3 py-1.5 mt-2 first:mt-0">
                          // {cmd.category}
                        </div>
                      )}
                      <button
                        onClick={() => handleSelect(cmd)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left font-mono text-xs group"
                        style={{
                          background: isSelected ? `${accentColor}10` : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm shrink-0" style={{ color: cmd.color || accentColor }}>
                            {cmd.icon}
                          </span>
                          <span className={`truncate ${isSelected ? 'text-white font-bold' : 'text-gray-400'}`}>
                            {cmd.title}
                          </span>
                        </div>
                        {isSelected && (
                          <span 
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0"
                            style={{
                              borderColor: `${accentColor}40`,
                              color: accentColor,
                              background: `${accentColor}05`
                            }}
                          >
                            Enter
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs font-mono text-gray-600">
                  No matching mainframe commands found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-black/30 border-t border-dark-border flex items-center justify-between text-[9px] font-mono text-gray-600 select-none">
              <span>ctrl + k to toggle</span>
              <span>use ↑↓ to navigate • enter to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
