import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAchievements } from '../contexts/AchievementContext';

const INTENTS = [
  { keywords: ['hello', 'hi', 'hey', 'greetings'], response: 'Hello SDE recruiter. Mainframe connection established. How can I assist your scouting mission today?' },
  { keywords: ['project', 'work', 'code', 'cargogo', 'arthatantra', 'tasks', 'portfolio'], response: 'Agneesh has shipped several flagships: CargoGo, ArthaTantra, and Decentralized Task Manager. Type "open projects" to view details.' },
  { keywords: ['skills', 'tech', 'languages', 'frontend', 'backend', 'mongodb'], response: 'Core proficiencies include: React, Node.js, Express, MongoDB, Python, FastAPI, Docker, and Solidity. Type "open skills" to view the matrix.' },
  { keywords: ['experience', 'hackathon', 'jobs', 'college'], response: 'Agneesh is pursuing a B.E. in CSE at Canara Engineering College, expected 2027. He won hackathons like VoidHack 2026. Type "open experience" for details.' },
  { keywords: ['resume', 'download', 'cv'], response: 'Initiating secure downlinks. Agneesh\'s professional resume packet is now downloading to your local client.', trigger: 'resume' },
  { keywords: ['help', 'commands', 'what can you do'], response: 'I can answer questions about Agneesh\'s skills, open apps (e.g., "open terminal", "open weather"), list projects, or download his resume.' }
];

const APP_MAP = [
  { names: ['about', 'profile', 'bio', 'whoami'], id: 'about', title: 'About Me', icon: '👤', color: '#00ff41' },
  { names: ['projects', 'works', 'portfolio'], id: 'projects', title: 'Projects', icon: '📁', color: '#00d4ff' },
  { names: ['skills', 'matrix', 'competencies'], id: 'skills', title: 'Skills Matrix', icon: '📊', color: '#b400ff' },
  { names: ['experience', 'timeline', 'college', 'education'], id: 'experience', title: 'Experience', icon: '💼', color: '#ff6b00' },
  { names: ['contact', 'email', 'social'], id: 'contact', title: 'Contact', icon: '📧', color: '#ff0080' },
  { names: ['terminal', 'shell', 'cli'], id: 'terminal', title: 'Terminal', icon: '⚡', color: '#00ff41' },
  { names: ['settings', 'config', 'theme'], id: 'settings', title: 'Settings', icon: '⚙️', color: '#00d4ff' },
  { names: ['music', 'player', 'synth'], id: 'music', title: 'Music Player', icon: '🎵', color: '#b400ff' },
  { names: ['games', 'game', 'snake', 'arcade'], id: 'games', title: 'Snake Game', icon: '🎮', color: '#ff6b00' },
  { names: ['weather', 'temperature'], id: 'weather', title: 'Weather', icon: '🌤️', color: '#00d4ff' },
  { names: ['certificates', 'certs'], id: 'certificates', title: 'Certificates', icon: '📜', color: '#ffd700' },
  { names: ['recycle', 'trash'], id: 'recycle', title: 'Recycle Bin', icon: '🗑️', color: '#888888' },
];

export default function AICommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'jarvis', text: 'Mainframe AI online. Ask me about Agneesh\'s skills, projects, or command me to open apps (e.g. "open terminal").', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Dragging states for portability
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const { openWindow } = useWindows();
  const { getAccentColor, settings } = useSettings();
  const { unlockAchievement } = useAchievements();

  const chatEndRef = useRef(null);
  const accentColor = getAccentColor();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Telemetry sound on reply
  const playReplySound = useCallback(() => {
    if (!settings.soundEnabled || settings.performanceMode) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }, [settings.soundEnabled, settings.performanceMode]);

  // Voice Speech synthesis
  const speakText = useCallback((text) => {
    if (!settings.soundEnabled || settings.performanceMode) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // Prefer English voice
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Robotic')));
      if (voice) utterance.voice = voice;
      
      utterance.rate = 1.05;
      utterance.pitch = 0.85; // slightly lower pitch for JARVIS aesthetic
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignored
    }
  }, [settings.soundEnabled, settings.performanceMode]);

  // Handle local intent matching
  const parseQuery = useCallback((query) => {
    const clean = query.toLowerCase().trim();
    unlockAchievement('AI_SYNAPSE');

    // 1. Check for App Open actions
    if (clean.includes('open') || clean.includes('launch') || clean.includes('start')) {
      const match = APP_MAP.find(app => 
        app.names.some(name => clean.includes(name))
      );
      
      if (match) {
        openWindow(match.id, match.title, match.icon, match.color);
        return {
          text: `Executing mainframe command. Launching the ${match.title} module...`
        };
      }
    }

    // 2. Check for general text intents
    const matchedIntent = INTENTS.find(intent => 
      intent.keywords.some(keyword => clean.includes(keyword))
    );

    if (matchedIntent) {
      if (matchedIntent.trigger === 'resume') {
        unlockAchievement('RECRUIT_ACQUIRED');
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Agneesh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return { text: matchedIntent.response };
    }

    return {
      text: 'Command query unrecognised. Try asking about my "skills", "projects", "download resume", or specify an app to run like "open terminal".'
    };
  }, [openWindow, unlockAchievement]);

  // Send message handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    setMessages(prev => [...prev, { sender: 'user', text: userText, time: new Date() }]);
    setIsTyping(true);

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = parseQuery(userText);
      setMessages(prev => [...prev, { sender: 'jarvis', text: response.text, time: new Date() }]);
      setIsTyping(false);
      
      // Play speech synthesis and audio notification
      playReplySound();
      speakText(response.text);
    }, delay);

    // Backend endpoint ping
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText }),
      });
    } catch (err) {}
  };

  // Dragging event handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...position };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Register drag movement if cursor travels > 4px
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDragged.current = true;
    }
    
    setPosition({
      x: startPos.current.x + dx,
      y: startPos.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch event handlers for mobile dragging
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    startPos.current = { ...position };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;
    
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDragged.current = true;
    }

    setPosition({
      x: startPos.current.x + dx,
      y: startPos.current.y + dy
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleToggleOpen = () => {
    if (!hasDragged.current) {
      setIsOpen(prev => !prev);
    }
  };

  if (settings.performanceMode) return null;

  return (
    <div 
      className="fixed z-[9999]"
      style={{
        bottom: '96px', // Start above the clock taskbar
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          // Chat Panel Layout
          <motion.div
            className="w-80 h-96 glass-strong rounded-2xl flex flex-col overflow-hidden relative border"
            style={{
              borderColor: `${accentColor}30`,
              boxShadow: `0 0 30px ${accentColor}15, 0 10px 40px rgba(0,0,0,0.5)`
            }}
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            {/* Draggable header bar */}
            <div 
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="flex items-center justify-between p-3 border-b border-dark-border bg-black/40 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                <span className="text-[10px] font-display font-bold tracking-widest text-white">JARVIS AI (DRAG TO MOVE)</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors font-mono text-xs cursor-pointer"
              >
                [×]
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs font-mono leading-normal`}
                    style={{
                      background: msg.sender === 'user' ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                      border: msg.sender === 'user' ? `1px solid ${accentColor}30` : '1px solid rgba(255,255,255,0.05)',
                      color: msg.sender === 'user' ? 'white' : '#ccc'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-mono text-gray-600 mt-0.5">
                    {msg.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] border border-white/[0.05] rounded-xl max-w-[60px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-2 border-t border-dark-border flex bg-black/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me a question..."
                className="flex-1 bg-transparent px-3 py-2 outline-none border-none font-mono text-xs text-white placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                className="px-3 py-2 rounded-lg text-[10px] font-mono hover:bg-white/[0.03] transition-colors"
                style={{ color: accentColor }}
              >
                SEND
              </button>
            </form>
          </motion.div>
        ) : (
          // Hovering Portable Orb Layout
          <motion.button
            onClick={handleToggleOpen}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="w-12 h-12 rounded-full flex items-center justify-center relative cursor-grab active:cursor-grabbing group select-none"
            style={{
              background: `${accentColor}10`,
              border: `1.5px solid ${accentColor}`,
              boxShadow: `0 0 15px ${accentColor}30, inset 0 0 8px ${accentColor}10`
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Multi-layered orbital visual effect */}
            <div className="absolute inset-0.5 rounded-full border border-dashed animate-spin text-[8px]" style={{ borderColor: `${accentColor}20`, animationDuration: '6s' }} />
            <div className="absolute inset-1.5 rounded-full border border-dotted animate-spin text-[8px]" style={{ borderColor: `${accentColor}40`, animationDuration: '10s', animationDirection: 'reverse' }} />
            
            {/* Center Core dot */}
            <div className="w-3.5 h-3.5 rounded-full" style={{
              background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}60 70%, transparent 100%)`,
              boxShadow: `0 0 10px ${accentColor}`
            }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
