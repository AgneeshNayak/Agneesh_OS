import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../../contexts/WindowContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useAchievements } from '../../contexts/AchievementContext';

const INTENTS = [
  { keywords: ['hello', 'hi', 'hey', 'greetings'], response: 'Hello SDE recruiter. Mainframe connection established. How can I assist your scouting mission today?' },
  { keywords: ['project', 'work', 'code', 'cargogo', 'arthatantra', 'tasks', 'portfolio'], response: 'Agneesh has shipped several flagships: CargoGo, ArthaTantra, and Decentralized Task Manager. Click "Open Projects" or type "open projects" to view details.' },
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
];

const QUICK_ACTIONS = [
  { label: '🚀 Open Projects', query: 'open projects' },
  { label: '⚡ Skill Matrix', query: 'open skills' },
  { label: '📥 Download Resume', query: 'download resume' },
  { label: '💻 Open Terminal', query: 'open terminal' },
  { label: '🌤️ Check Weather', query: 'open weather' },
];

const AIAssistantApp = memo(function AIAssistantApp() {
  const [messages, setMessages] = useState([
    { sender: 'jarvis', text: 'Mainframe AI online. Ask me about Agneesh\'s skills, projects, or command me to open apps.', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const { openWindow } = useWindows();
  const { getAccentColor, settings } = useSettings();
  const { unlockAchievement } = useAchievements();

  const chatEndRef = useRef(null);
  const accentColor = getAccentColor();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speech synthesis
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !settings.soundEnabled || settings.performanceMode) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Robotic')));
      if (voice) utterance.voice = voice;
      utterance.rate = 1.05;
      utterance.pitch = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }, [voiceEnabled, settings.soundEnabled, settings.performanceMode]);

  // Local Intent Processor
  const processQuery = useCallback((queryText) => {
    const clean = queryText.toLowerCase().trim();
    unlockAchievement('AI_SYNAPSE');

    // App launch actions
    if (clean.includes('open') || clean.includes('launch') || clean.includes('start')) {
      const match = APP_MAP.find(app => app.names.some(name => clean.includes(name)));
      if (match) {
        openWindow(match.id, match.title, match.icon, match.color);
        return `Executing mainframe command. Launching the ${match.title} module...`;
      }
    }

    // Keyword intent matching
    const matched = INTENTS.find(intent => intent.keywords.some(k => clean.includes(k)));
    if (matched) {
      if (matched.trigger === 'resume') {
        unlockAchievement('RECRUIT_ACQUIRED');
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Agneesh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return matched.response;
    }

    return 'Command query unrecognised. Try asking about my "skills", "projects", "download resume", or specify an app like "open terminal".';
  }, [openWindow, unlockAchievement]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: query, time: new Date() }]);
    setIsTyping(true);

    setTimeout(() => {
      const responseText = processQuery(query);
      setMessages(prev => [...prev, { sender: 'jarvis', text: responseText, time: new Date() }]);
      setIsTyping(false);
      speakText(responseText);
    }, 500 + Math.random() * 400);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white overflow-hidden font-mono select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-green"></span>
          </span>
          <div>
            <h3 className="text-xs font-display font-bold tracking-widest text-white">JARVIS AI MAINFRAME</h3>
            <p className="text-[9px] font-mono text-gray-500">Autonomous Neural Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setVoiceEnabled(prev => !prev)}
          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${voiceEnabled ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
        >
          {voiceEnabled ? '🔊 VOICE ON' : '🔇 VOICE OFF'}
        </button>
      </div>

      {/* Quick Command Chips */}
      <div className="p-2 border-b border-white/10 bg-black/20 flex gap-1.5 overflow-x-auto shrink-0">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => handleSendMessage(action.query)}
            className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Message Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className="max-w-[85%] sm:max-w-[75%] rounded-xl px-3.5 py-2.5 text-xs font-mono leading-relaxed"
              style={{
                background: msg.sender === 'user' ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                border: msg.sender === 'user' ? `1px solid ${accentColor}30` : '1px solid rgba(255,255,255,0.06)',
                color: msg.sender === 'user' ? '#ffffff' : '#d1d5db'
              }}
            >
              {msg.text}
            </div>
            <span className="text-[8px] font-mono text-gray-600 mt-1">
              {msg.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
            </span>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] border border-white/[0.05] rounded-xl max-w-[60px]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-2 sm:p-3 border-t border-dark-border bg-black/40 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me a question or type 'open terminal'..."
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-green/50 transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 text-neon-green transition-all cursor-pointer shrink-0"
        >
          SEND
        </button>
      </form>
    </div>
  );
});

export default AIAssistantApp;
