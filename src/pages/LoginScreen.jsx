import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Fingerprint SVG paths for decorative animation
// NOTE: This is purely decorative - NO real biometric capture occurs
const FingerprintScan = ({ isScanning }) => (
  <div className="relative w-32 h-32 mx-auto mb-6">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Fingerprint circles - decorative only */}
      {[20, 25, 30, 35, 40].map((r, i) => (
        <motion.ellipse
          key={i}
          cx="50" cy="50" rx={r} ry={r * 1.2}
          fill="none"
          stroke="rgba(0, 255, 65, 0.15)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, delay: i * 0.2 }}
        />
      ))}
      {/* Curved lines for fingerprint ridges */}
      {[15, 18, 22, 26, 30, 34, 38, 42, 45].map((r, i) => (
        <motion.path
          key={`ridge-${i}`}
          d={`M ${50 - r} ${50 + r * 0.3} Q 50 ${50 - r * 1.1} ${50 + r} ${50 + r * 0.3}`}
          fill="none"
          stroke="rgba(0, 255, 65, 0.2)"
          strokeWidth="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
        />
      ))}
    </svg>
    {/* Scanning line - decorative animation */}
    {isScanning && (
      <motion.div
        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent"
        style={{ boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41' }}
        initial={{ top: '10%' }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    )}
    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-neon-green/40" />
    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-neon-green/40" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-neon-green/40" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-neon-green/40" />
  </div>
);

// Status readout component
const StatusReadout = ({ label, value, color = 'neon-green' }) => (
  <div className="flex items-center gap-2 text-[10px] font-mono">
    <div className={`w-1.5 h-1.5 rounded-full bg-${color} animate-pulse-neon`} />
    <span className="text-gray-500 uppercase tracking-wider">{label}</span>
    <span className={`text-${color} ml-auto`}>{value}</span>
  </div>
);

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(true);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => navigate('/desktop'), 800);
  }, [navigate]);

  const handlePasswordSubmit = useCallback((e) => {
    e.preventDefault();
    // Accept any password - this is a portfolio, not a secure app
    handleEnter();
  }, [handleEnter]);

  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    particles: {
      number: { value: 60, density: { enable: true, width: 800, height: 800 } },
      color: { value: ['#00ff41', '#00d4ff', '#b400ff'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.5, sync: false } },
      size: { value: { min: 1, max: 3 } },
      links: {
        enable: true,
        distance: 120,
        color: '#00ff41',
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        outModes: { default: 'bounce' },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 150, links: { opacity: 0.3 } },
      },
    },
  }), []);

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <ParticlesProvider init={particlesInit}>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-dark-bg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.1 : 1, filter: isTransitioning ? 'brightness(3)' : 'brightness(1)' }}
          transition={{ duration: 0.6 }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-50" />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.8) 70%, rgba(10,10,15,0.95) 100%)'
          }} />

          {/* Particles */}
          <Particles
            id="loginParticles"
            className="absolute inset-0"
            options={particlesOptions}
          />

        {/* CRT overlay */}
        <div className="crt-overlay" />

        {/* Top status bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 border-b border-neon-green/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <span className="text-neon-green/60 text-xs font-display tracking-widest">AGNEESH-OS</span>
            <span className="text-gray-600 text-xs font-mono">v2.0.27</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs font-mono">{dateStr}</span>
            <span className="text-neon-green text-sm font-mono font-bold tracking-wider">{timeStr}</span>
          </div>
        </motion.div>

        {/* Left status panel */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 space-y-3 hidden sm:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass rounded-lg p-3 space-y-2 w-44">
            <div className="text-[10px] font-display text-neon-green/60 tracking-wider mb-2">SYSTEM STATUS</div>
            <StatusReadout label="Neural Link" value="ACTIVE" />
            <StatusReadout label="Encryption" value="AES-256" />
            <StatusReadout label="Quantum Bridge" value="STABLE" />
            <StatusReadout label="Firewall" value="ARMED" />
            <StatusReadout label="Threat Level" value="NONE" />
          </div>
        </motion.div>

        {/* Right status panel */}
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 space-y-3 hidden sm:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass rounded-lg p-3 space-y-2 w-44">
            <div className="text-[10px] font-display text-neon-blue/60 tracking-wider mb-2">NETWORK</div>
            <StatusReadout label="Uplink" value="42.8 Gbps" color="neon-blue" />
            <StatusReadout label="Latency" value="0.3ms" color="neon-blue" />
            <StatusReadout label="Nodes" value="2,847" color="neon-blue" />
            <StatusReadout label="Satellites" value="12" color="neon-blue" />
            <StatusReadout label="Coverage" value="GLOBAL" color="neon-blue" />
          </div>
        </motion.div>

        {/* Main login panel */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <motion.div
            className="glass-strong rounded-2xl p-8 sm:p-10 w-full max-w-md relative"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              boxShadow: '0 0 30px rgba(0,255,65,0.05), 0 0 60px rgba(0,255,65,0.03)'
            }}
          >
            {/* Decorative corner elements */}
            <div className="absolute -top-px -left-px w-8 h-8 border-l-2 border-t-2 border-neon-green/40 rounded-tl-2xl" />
            <div className="absolute -top-px -right-px w-8 h-8 border-r-2 border-t-2 border-neon-green/40 rounded-tr-2xl" />
            <div className="absolute -bottom-px -left-px w-8 h-8 border-l-2 border-b-2 border-neon-green/40 rounded-bl-2xl" />
            <div className="absolute -bottom-px -right-px w-8 h-8 border-r-2 border-b-2 border-neon-green/40 rounded-br-2xl" />

            {/* Logo */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-neon" />
                <span className="text-[10px] font-mono text-neon-green/50 tracking-widest uppercase">Secure Access</span>
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-neon" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-neon-green text-glow-green tracking-wider mb-2">
                AGNEESH-OS
              </h1>
              <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-neon-green/30 to-transparent mb-3" />
              <p className="text-gray-400 font-mono text-xs tracking-[0.3em] uppercase">
                Authentication Terminal
              </p>
            </motion.div>

            {/* Fingerprint - decorative only, no real biometric capture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <FingerprintScan isScanning={isScanning} />
              <p className="text-center text-[10px] text-gray-600 font-mono mb-6">
                {/* Decorative text only - no real biometric processing */}
                BIOMETRIC SCAN: DECORATIVE ONLY
              </p>
            </motion.div>

            {/* Enter as Guest - primary action */}
            <motion.button
              onClick={handleEnter}
              className="w-full py-3.5 px-6 bg-neon-green/10 border border-neon-green/50 text-neon-green font-display text-lg tracking-[0.2em] rounded-xl hover:bg-neon-green/20 hover:border-neon-green/70 transition-all duration-300 mb-4 relative overflow-hidden group"
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,65,0.3)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="relative z-10">ENTER AS GUEST</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/10 to-neon-green/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>

            {/* Agent Login toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={() => { setShowLogin(!showLogin); setIsScanning(!showLogin); }}
                className="w-full text-center text-xs text-gray-500 hover:text-neon-blue font-mono py-2 transition-colors"
              >
                {showLogin ? '▲ Hide Agent Login' : '▼ Agent Login'}
              </button>

              <AnimatePresence>
                {showLogin && (
                  <motion.form
                    onSubmit={handlePasswordSubmit}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3">
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter access code..."
                          className="w-full bg-dark-bg/50 border border-dark-border focus:border-neon-green/50 text-neon-green font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors placeholder:text-gray-600"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neon-green/30 animate-pulse-neon" />
                      </div>
                      <motion.button
                        type="submit"
                        className="w-full py-2 px-4 border border-neon-blue/30 text-neon-blue font-mono text-xs tracking-wider rounded-lg hover:bg-neon-blue/10 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        AUTHENTICATE
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 border-t border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
            <span className="text-gray-500 text-[10px] font-mono tracking-wider">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
            <span>TLS 1.3</span>
            <span>•</span>
            <span>ENCRYPTED</span>
            <span>•</span>
            <span>SECURE CHANNEL</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </ParticlesProvider>
  );
}
