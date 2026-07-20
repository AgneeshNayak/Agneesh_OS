import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

const commandsList = {
  help: 'Show available commands',
  about: 'About Agneesh',
  skills: 'List technical skills',
  projects: 'View projects',
  contact: 'Show contact info',
  github: 'Open GitHub profile',
  linkedin: 'Open LinkedIn profile',
  leetcode: 'Open LeetCode profile',
  resume: 'Download/View Resume',
  whoami: 'Display current user',
  neofetch: 'Show system information',
  clear: 'Clear terminal output',
  sudo: 'Run command with administrative privileges',
  date: 'Show current date and time',
  echo: 'Print arguments',
  history: 'Show command history',
  matrix: 'Enter the matrix'
};

import { useAchievements } from '../../contexts/AchievementContext';

const executeCommand = (cmd, args, history) => {
  const c = cmd.toLowerCase();
  switch (c) {
    case 'help':
      const out = Object.keys(commandsList).map(k => `${k.padEnd(10)} - ${commandsList[k]}`);
      return { output: ['Available commands:', ...out], color: 'text-green-400' };
    case 'about':
      return { output: ['Agneesh is a passionate developer creating futuristic experiences.'], color: 'text-blue-400' };
    case 'skills':
      return { output: ['Skills: React, JavaScript, Node.js, Framer Motion, Tailwind CSS'], color: 'text-yellow-400' };
    case 'projects':
      return { output: ['Projects:', '- AgneeshOS: AI OS themed portfolio', '- Cyberpunk Chat', '- React Web App'], color: 'text-cyan-400' };
    case 'contact':
      return { output: ['Email: agneeshnayak88@gmail.com', 'GitHub: https://github.com/AgneeshNayak', 'LinkedIn: https://linkedin.com/in/AgneeshNayak', 'LeetCode: https://leetcode.com/u/Agneesh_A_Nayak/'], color: 'text-purple-400' };
    case 'github':
      window.open('https://github.com/AgneeshNayak', '_blank');
      return { output: ['Opening GitHub profile: https://github.com/AgneeshNayak'], color: 'text-white' };
    case 'linkedin':
      window.open('https://linkedin.com/in/AgneeshNayak', '_blank');
      return { output: ['Opening LinkedIn profile: https://linkedin.com/in/AgneeshNayak'], color: 'text-white' };
    case 'leetcode':
      window.open('https://leetcode.com/u/Agneesh_A_Nayak/', '_blank');
      return { output: ['Opening LeetCode profile: https://leetcode.com/u/Agneesh_A_Nayak/'], color: 'text-white' };
    case 'resume':
      return { output: ['Triggering secure downlink...', 'Downloading Agneesh_Resume.pdf'], color: 'text-white' };
    case 'whoami':
      return { output: ['guest'], color: 'text-green-400' };
    case 'neofetch':
      return { output: [
        '   /\\   guest@agneeshos',
        '  /  \\  OS: AgneeshOS 1.0',
        ' /____\\ Kernel: 5.15.0-generic',
        '/      \\Uptime: 42 days',
        '        Shell: bash',
      ], color: 'text-green-500' };
    case 'sudo':
      return { output: ['ACCESS DENIED. This incident will be reported.'], color: 'text-red-500' };
    case 'date':
      return { output: [new Date().toString()], color: 'text-gray-300' };
    case 'echo':
      return { output: [args.join(' ')], color: 'text-white' };
    case 'history':
      return { output: history.map((h, i) => `${i + 1}  ${h}`), color: 'text-gray-400' };
    case 'matrix':
      return { output: ['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit.', 'Knock, knock, Neo.'], color: 'text-green-600' };
    default:
      return { output: [`Command not found: ${c}. Type 'help' for a list of commands.`], color: 'text-red-400' };
  }
};

const TerminalApp = () => {
  const [output, setOutput] = useState([
    { text: 'AgneeshOS Terminal v1.0.0', color: 'text-green-500' },
    { text: "Type 'help' to see available commands.", color: 'text-green-400' }
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('TERMINAL_ACCESS');
  }, [unlockAchievement]);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const newHistory = [...history, input];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length);

    setOutput(prev => [...prev, { text: `guest@agneeshos ~ $ ${input}`, color: 'text-gray-300' }]);
    
    if (cmd.toLowerCase() === 'clear') {
      setOutput([]);
    } else {
      const result = executeCommand(cmd, args, newHistory);
      setOutput(prev => [
        ...prev,
        ...result.output.map(line => ({ text: line, color: result.color }))
      ]);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setInput(history[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setInput(history[historyIndex + 1]);
      } else {
        setHistoryIndex(history.length);
        setInput('');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-black font-mono text-sm p-4 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
        {output.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap break-all ${line.color}`}>
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleCommand} className="flex items-center shrink-0">
        <span className="text-green-500 mr-2">guest@agneeshos ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none border-none caret-green-500"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </motion.div>
  );
};

export default memo(TerminalApp);
