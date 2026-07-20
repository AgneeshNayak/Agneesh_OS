import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootSequence } from '../hooks/useBootSequence';
import { containerVariants, lineVariants } from '../animations/bootAnimations';

export default function BootScreen() {
  const navigate = useNavigate();
  const { hasBooted, currentStage, visibleLines, progress, isComplete, skip } = useBootSequence();

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate]);

  const handleSkip = useCallback(() => {
    skip();
  }, [skip]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Escape' || e.code === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // If already booted this session, redirect immediately
  if (hasBooted && isComplete) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="boot-screen"
        className="fixed inset-0 bg-dark-bg flex flex-col overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02, filter: 'brightness(2)' }}
        transition={{ duration: 0.5 }}
      >
        {/* CRT Scanline Overlay */}
        <div className="crt-overlay" />

        {/* Main Terminal Area */}
        <div className="flex-1 overflow-hidden p-4 sm:p-8 font-mono">
          {/* Header bar */}
          <motion.div
            className="flex items-center gap-3 mb-4 pb-3 border-b border-neon-green/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-neon-red/80" />
              <div className="w-3 h-3 rounded-full bg-neon-yellow/80" />
              <div className="w-3 h-3 rounded-full bg-neon-green/80" />
            </div>
            <span className="text-neon-green/60 text-xs tracking-widest font-display uppercase">
              AgneeshOS Boot Terminal
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
              <span className="text-neon-green/40 text-xs">LIVE</span>
            </div>
          </motion.div>

          {/* Boot text lines */}
          <motion.div
            className="space-y-0.5 text-xs sm:text-sm leading-relaxed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {visibleLines.map((line, index) => (
              <motion.div
                key={index}
                variants={lineVariants}
                className={`whitespace-pre-wrap ${
                  line.text.includes('[OK]') || line.text.includes('[ACTIVE]') || line.text.includes('[CONNECTED]') || line.text.includes('COMPLETE') || line.text.includes('LINKED') || line.text.includes('ACTIVE') || line.text.includes('NOMINAL') || line.text.includes('ONLINE')
                    ? 'text-neon-green'
                    : line.text.includes('══') || line.text.includes('──') || line.text.includes('╔') || line.text.includes('╚') || line.text.includes('║')
                    ? 'text-neon-blue/70'
                    : line.text.includes('Welcome')
                    ? 'text-neon-cyan text-glow-blue text-base sm:text-lg font-bold'
                    : line.text.includes('✦')
                    ? 'text-neon-green text-glow-green font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {line.text}
                {index === visibleLines.length - 1 && line.text && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-neon-green ml-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Status Bar */}
        <motion.div
          className="p-4 sm:p-6 border-t border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Stage label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-neon-green/80 text-xs font-display tracking-wider uppercase">
              {currentStage.label}
            </span>
            <span className="text-neon-green font-mono text-sm font-bold">
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-2 bg-dark-surface rounded-full overflow-hidden border border-neon-green/10">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00ff41, #00d4ff, #00ff41)',
                backgroundSize: '200% 100%',
              }}
              initial={{ width: '0%' }}
              animate={{
                width: `${progress}%`,
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                width: { duration: 0.5, ease: 'easeOut' },
                backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
              }}
            />
            {/* Glow effect on progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full opacity-50 blur-sm"
              style={{ background: '#00ff41' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Stage indicators */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              {['POST', 'AI', 'SVC', 'NET', 'RDY'].map((label, i) => (
                <div
                  key={label}
                  className={`px-2 py-0.5 text-[10px] font-display tracking-wider border rounded ${
                    i <= (currentStage ? currentStage.id === 'bios' ? 0 : currentStage.id === 'ai-core' ? 1 : currentStage.id === 'services' ? 2 : currentStage.id === 'network' ? 3 : 4 : 0)
                      ? 'border-neon-green/50 text-neon-green bg-neon-green/10'
                      : 'border-dark-border text-gray-600'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Skip button */}
            <motion.button
              onClick={handleSkip}
              className="flex items-center gap-2 px-3 py-1 text-xs text-gray-500 hover:text-neon-green border border-dark-border hover:border-neon-green/30 rounded transition-all duration-300 font-mono"
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0,255,65,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>SKIP</span>
              <span className="text-[10px] opacity-50">[SPACE]</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 text-[10px] font-mono text-neon-green/20">
          <span>SYS: {new Date().toLocaleTimeString()}</span>
          <span>MEM: 32768MB</span>
          <span>CPU: 8-CORE NEURAL</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
