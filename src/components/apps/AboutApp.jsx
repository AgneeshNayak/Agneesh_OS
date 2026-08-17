import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ target, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.1)' }}>
      <div className="text-2xl font-display text-neon-green text-glow-green">{count}{suffix}</div>
      <div className="text-xs font-mono text-gray-400 mt-1">{label}</div>
    </div>
  );
};

const timelineEvents = [
  { year: '2023', title: 'Started B.E. in CSE', desc: 'Canara Engineering College, Mangalore', icon: '🎓' },
  { year: '2024', title: 'First Full Stack Project', desc: 'Built end-to-end web applications', icon: '🚀' },
  { year: '2025–26', title: '6th Sem Academic Topper (9.44 CGPA)', desc: 'Dept of CSE, Canara Engineering College', icon: '🏆' },
  { year: '2026', title: 'Full Stack & Web Systems', desc: 'Shipping production web systems & hackathon projects', icon: '💻' },
  { year: '2027', title: 'Expected Graduation', desc: 'B.E. Computer Science & Engineering', icon: '🎯' },
];

const AboutApp = memo(function AboutApp() {
  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center text-center py-4 sm:py-6 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto mb-5 rounded-full overflow-hidden shrink-0 relative border-2 border-neon-green/60 p-1"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,65,0.25), rgba(0,212,255,0.25))',
            boxShadow: '0 0 35px rgba(0,255,65,0.3), 0 0 70px rgba(0,255,65,0.15)',
          }}
          animate={{
            boxShadow: [
              '0 0 25px rgba(0,255,65,0.25), 0 0 50px rgba(0,255,65,0.15)',
              '0 0 50px rgba(0,255,65,0.5), 0 0 90px rgba(0,255,65,0.3)',
              '0 0 25px rgba(0,255,65,0.25), 0 0 50px rgba(0,255,65,0.15)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/profile.jpg"
            alt="Agneesh Nayak Professional Headshot"
            className="w-full h-full object-cover object-top rounded-full"
          />
        </motion.div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-neon-green text-glow-green tracking-wider mb-2.5">
          AGNEESH NAYAK
        </h1>
        
        {/* Topper Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-3 rounded-full text-xs sm:text-sm font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
          <span>🏆</span>
          <span>6th Sem CSE Academic Topper • 9.44 CGPA</span>
        </div>

        <p className="font-mono text-xs sm:text-sm md:text-base text-neon-blue">
          Computer Science Student • Full Stack Web Developer
        </p>
        <p className="font-mono text-[11px] sm:text-xs text-gray-400 mt-1">
          Canara Engineering College, Mangalore | CSE '27
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatedCounter target={6} label="Projects Shipped" />
        <AnimatedCounter target={15} label="Technologies" suffix="+" />
        <AnimatedCounter target={3} label="Hackathons" suffix="+" />
      </motion.div>

      {/* Bio */}
      <motion.div
        className="p-4 rounded-xl" style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display text-sm text-neon-blue tracking-wider mb-3">// ABOUT ME</h2>
        <p className="text-gray-300 text-sm leading-relaxed font-body">
          I'm a dedicated Computer Science student at Canara Engineering College, Mangalore,
          with a strong focus on full-stack web development, modern software engineering, and database systems.
          I specialize in building robust, user-centric web applications and scalable backend architectures.
        </p>
        <p className="text-gray-300 text-sm leading-relaxed font-body mt-3">
          Currently focused on developing production-ready web platforms, optimizing system performance,
          and shipping full-stack projects using React.js, Node.js, Express, and MongoDB.
        </p>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display text-sm text-neon-purple tracking-wider mb-4">// TIMELINE</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-green/30 via-neon-blue/30 to-neon-purple/30" />
          {timelineEvents.map((event, i) => (
            <motion.div
              key={event.year}
              className="flex gap-4 mb-5 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 z-10"
                style={{ background: 'rgba(18,18,26,0.9)', border: '1px solid rgba(0,255,65,0.2)' }}>
                {event.icon}
              </div>
              <div className="flex-1 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-neon-green font-mono text-xs">{event.year}</span>
                  <span className="text-white font-body text-sm font-semibold">{event.title}</span>
                </div>
                <p className="text-gray-400 text-xs font-mono">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

export default AboutApp;
