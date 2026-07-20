export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'brightness(3)',
    transition: { duration: 0.5 }
  }
};

export const lineVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.1 }
  }
};

export const progressBarVariants = {
  initial: { width: '0%' },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: 'easeOut' }
  })
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 5px rgba(0, 255, 65, 0.3)',
      '0 0 20px rgba(0, 255, 65, 0.6)',
      '0 0 5px rgba(0, 255, 65, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

export const screenFlash = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0],
    transition: { duration: 0.3 }
  }
};

export const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const textFlicker = {
  animate: {
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
  }
};
