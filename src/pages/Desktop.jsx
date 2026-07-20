import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WindowProvider, useWindows } from '../contexts/WindowContext';
import WindowFrame from '../components/WindowFrame';
import DesktopIcons from '../components/DesktopIcons';
import Taskbar from '../components/Taskbar';
import AppRenderer from '../components/AppRenderer';
import ErrorBoundary from '../components/ErrorBoundary';
import ThreeBackground from '../components/ThreeBackground';
import CommandPalette from '../components/CommandPalette';
import AICommandCenter from '../components/AICommandCenter';
import RecruiterDashboard from '../components/RecruiterDashboard';
import DeveloperMode from '../components/DeveloperMode';

function DesktopContent() {
  const { windows } = useWindows();

  return (
    <div className="fixed inset-0 overflow-hidden bg-dark-bg">
      <CommandPalette />
      <AICommandCenter />
      <RecruiterDashboard />
      <DeveloperMode />
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ThreeBackground />

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,15,0.5) 100%)'
        }} />
      </div>

      {/* CRT overlay */}
      <div className="crt-overlay" />

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Open Windows */}
      {windows.map((win) => (
        <WindowFrame key={win.id} windowData={win}>
          <ErrorBoundary>
            <AppRenderer appId={win.appId} />
          </ErrorBoundary>
        </WindowFrame>
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}

export default function Desktop() {
  // Clear boot flag is handled elsewhere; desktop just renders
  return (
    <WindowProvider>
      <DesktopContent />
    </WindowProvider>
  );
}
