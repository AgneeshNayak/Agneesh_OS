import { createContext, useContext, useState, useCallback, useRef } from 'react';

const WindowContext = createContext(null);

let windowCounter = 0;

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const zIndexRef = useRef(100);

  const openWindow = useCallback((appId, title, icon, color) => {
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

      const newWindow = {
        id: `window-${windowCounter}`,
        appId,
        title,
        icon,
        color: color || '#00ff41',
        minimized: false,
        maximized: false,
        zIndex: zIndexRef.current,
        position: {
          x: 80 + (windowCounter % 6) * 30,
          y: 40 + (windowCounter % 6) * 30
        },
        size: { width: 700, height: 500 },
      };

      setActiveWindowId(newWindow.id);
      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    setActiveWindowId(prev => {
      if (prev === windowId) {
        return null;
      }
      return prev;
    });
  }, []);

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
