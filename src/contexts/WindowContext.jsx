import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const WindowContext = createContext(null);

let windowCounter = 0;

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const zIndexRef = useRef(100);
  const { playSound } = useSound();

  const openWindow = useCallback((appId, title, icon, color) => {
    playSound('window-open');
    setWindows(prev => {
      // If already open, just focus it
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        zIndexRef.current += 1;
        return prev.map(w =>
          w.id === existing.id
            ? { ...w, minimized: false, zIndex: zIndexRef.current }
            : w
        );
      }

      windowCounter += 1;
      zIndexRef.current += 1;

      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

      const winWidth = Math.min(720, Math.max(300, screenW - 32));
      const winHeight = Math.min(520, Math.max(340, screenH - 96));

      const posX = Math.max(16, Math.min(60 + (windowCounter % 5) * 25, screenW - winWidth - 16));
      const posY = Math.max(16, Math.min(30 + (windowCounter % 5) * 25, screenH - winHeight - 60));

      const newWindow = {
        id: `window-${windowCounter}`,
        appId,
        title,
        icon,
        color: color || '#00ff41',
        minimized: false,
        maximized: false,
        zIndex: zIndexRef.current,
        position: { x: posX, y: posY },
        size: { width: winWidth, height: winHeight },
      };

      setActiveWindowId(newWindow.id);
      return [...prev, newWindow];
    });
  }, [playSound]);

  const closeWindow = useCallback((windowId) => {
    playSound('window-close');
    setWindows(prev => prev.filter(w => w.id !== windowId));
    setActiveWindowId(prev => {
      if (prev === windowId) {
        return null;
      }
      return prev;
    });
  }, [playSound]);

  const minimizeWindow = useCallback((windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, minimized: true } : w
      )
    );
  }, []);

  const maximizeWindow = useCallback((windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, maximized: !w.maximized } : w
      )
    );
  }, []);

  const focusWindow = useCallback((windowId) => {
    zIndexRef.current += 1;
    setActiveWindowId(windowId);
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, zIndex: zIndexRef.current, minimized: false }
          : w
      )
    );
  }, []);

  const updateWindowPosition = useCallback((windowId, position) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, position } : w
      )
    );
  }, []);

  const updateWindowSize = useCallback((windowId, size) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, size } : w
      )
    );
  }, []);

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
}
