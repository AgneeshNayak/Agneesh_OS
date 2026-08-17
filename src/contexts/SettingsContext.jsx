import { createContext, useContext, useState, useCallback } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  performanceMode: false,
  particlesEnabled: true,
  theme: 'cyber-green', // 'cyber-green', 'cyber-blue', 'cyber-purple', 'cyber-pink'
  accentColor: '#00ff41',
  soundEnabled: false,
  cursorEffects: true,
  animationsEnabled: true,
  wallpaper: 'satellite', // 'satellite', 'matrix', 'gradient'
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('agneeshos-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('agneeshos-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const togglePerformanceMode = useCallback(() => {
    setSettings(prev => {
      const performanceMode = !prev.performanceMode;
      const next = {
        ...prev,
        performanceMode,
        // Performance mode disables heavy effects
        particlesEnabled: performanceMode ? false : true,
        cursorEffects: performanceMode ? false : true,
        animationsEnabled: performanceMode ? false : true,
      };
      localStorage.setItem('agneeshos-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem('agneeshos-settings');
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getAccentColor = useCallback(() => {
    const themeColors = {
      'cyber-green': '#00ff41',
      'cyber-blue': '#00d4ff',
      'cyber-purple': '#b400ff',
      'cyber-pink': '#ff0080',
    };
    return themeColors[settings.theme] || '#00ff41';
  }, [settings.theme]);

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      togglePerformanceMode,
      resetSettings,
      getAccentColor,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
