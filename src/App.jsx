import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { SettingsProvider } from './contexts/SettingsContext';
import { AchievementProvider } from './contexts/AchievementContext';
import CustomCursor from './components/CustomCursor';

import BootScreen from './pages/BootScreen';
import LoginScreen from './pages/LoginScreen';
import Desktop from './pages/Desktop';

import { PageTransition } from './components/MotionPrimitives';

export default function App() {
  useEffect(() => {
    // Instantiate Lenis for smooth scroll physics
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <SettingsProvider>
      <AchievementProvider>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<PageTransition><BootScreen /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginScreen /></PageTransition>} />
          <Route path="/desktop" element={<PageTransition><Desktop /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AchievementProvider>
    </SettingsProvider>
  );
}
