import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { MOTION } from '../styles/tokens';

// ==========================================
// 1. MAGNETIC BUTTON PRIMITIVE
// ==========================================
export function MagneticButton({ children, className = '', range = 35, ...props }) {
  const { settings } = useSettings();
  const ref = useRef(null);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs
  const springX = useSpring(x, MOTION.ease.springSmooth);
  const springY = useSpring(y, MOTION.ease.springSmooth);

  const handleMouseMove = (e) => {
    if (settings.performanceMode || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Check if mouse is inside range
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      // Pull element offset toward cursor
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      // Snap back
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// 2. 3D GLOW CARD PRIMITIVE
// ==========================================
export function GlowCard({ children, className = '', accentColor = '#00ff41', ...props }) {
  const { settings } = useSettings();
  const cardRef = useRef(null);

  // Coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tilt transforms
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  // Smooth springs
  const springRotateX = useSpring(rotateX, MOTION.ease.springSmooth);
  const springRotateY = useSpring(rotateY, MOTION.ease.springSmooth);

  // Glowing dot position
  const glowX = useMotionValue(-100);
  const glowY = useMotionValue(-100);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse coords (0 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Set relative inputs
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);

    // Set absolute glow dot coords
    glowX.set(mouseX);
    glowY.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glowX.set(-200);
    glowY.set(-200);
  };

  const isHeavy = settings.performanceMode;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHeavy ? 0 : springRotateX,
        rotateY: isHeavy ? 0 : springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`relative rounded-xl overflow-hidden glass border transition-shadow duration-300 ${className}`}
      {...props}
    >
      {/* Interactive Glowing Radial Background Spotlight */}
      {!isHeavy && (
        <motion.div
          className="absolute pointer-events-none rounded-full w-48 h-48 -translate-x-1/2 -translate-y-1/2 opacity-25 filter blur-3xl mix-blend-screen"
          style={{
            left: glowX,
            top: glowY,
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 80%)`,
          }}
        />
      )}
      <div style={{ transform: isHeavy ? 'none' : 'translateZ(20px)' }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}

// ==========================================
// 3. REVEAL TYPING TEXT PRIMITIVE
// ==========================================
export function RevealText({ text, className = '', delay = 0, speed = 0.03 }) {
  const { settings } = useSettings();
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (settings.prefersReducedMotion || settings.performanceMode) {
      setDisplayedText(text);
      return;
    }

    let idx = 0;
    let timer;
    const startDelay = setTimeout(() => {
      timer = setInterval(() => {
        setDisplayedText(text.substring(0, idx + 1));
        idx++;
        if (idx >= text.length) {
          clearInterval(timer);
        }
      }, speed * 1000);
    }, delay * 1000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(timer);
    };
  }, [text, delay, speed, settings.prefersReducedMotion, settings.performanceMode]);

  return (
    <span className={`${className}`}>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-blink border-r border-current ml-0.5" />
      )}
    </span>
  );
}

// ==========================================
// 4. PAGE ENTRANCE TRANSITION WRAPPER
// ==========================================
export function PageTransition({ children, className = '' }) {
  const { settings } = useSettings();

  if (settings.prefersReducedMotion || settings.performanceMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ ease: MOTION.ease.outExpo, duration: MOTION.duration.standard }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
