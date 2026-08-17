// Premium Cyberpunk Design System Tokens

export const COLORS = {
  bg: {
    base: '#0a0a0f',
    surface: '#12121a',
    elevated: '#1a1a2e',
    panel: 'rgba(18, 18, 26, 0.75)',
  },
  border: {
    default: '#2a2a3e',
    accentAlpha: 'rgba(0, 255, 65, 0.15)',
  },
  accent: {
    green: '#00ff41',
    blue: '#00d4ff',
    purple: '#b400ff',
    pink: '#ff0080',
    cyan: '#00fff5',
    yellow: '#ffd700',
  }
};

export const MOTION = {
  ease: {
    outExpo: [0.16, 1, 0.3, 1], // Linear/Vercel standard easeOutExpo
    inOutExpo: [0.87, 0, 0.13, 1],
    springDefault: { type: 'spring', stiffness: 350, damping: 25 },
    springStiff: { type: 'spring', stiffness: 500, damping: 20 },
    springSmooth: { type: 'spring', stiffness: 260, damping: 30 },
  },
  duration: {
    micro: 0.15,   // 150ms
    standard: 0.3, // 300ms
    hero: 0.6,     // 600ms
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};
