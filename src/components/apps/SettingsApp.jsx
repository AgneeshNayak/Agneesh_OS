import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';

const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between py-2 cursor-pointer" onClick={() => onChange(!checked)}>
    <span className="text-gray-200">{label}</span>
    <div className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-700'}`}>
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  </div>
);

const ThemeSelector = ({ currentTheme, onSelect }) => {
  const themes = [
    { id: 'cyber-green', color: '#00ff41', name: 'Green' },
    { id: 'cyber-blue', color: '#00d4ff', name: 'Blue' },
    { id: 'cyber-purple', color: '#b400ff', name: 'Purple' },
    { id: 'cyber-pink', color: '#ff0080', name: 'Pink' },
  ];

  return (
    <div className="flex space-x-4 py-2">
      {themes.map(theme => (
        <div
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${currentTheme === theme.id ? 'border-white' : 'border-transparent'}`}
          style={{ backgroundColor: theme.color }}
          title={theme.name}
        />
      ))}
    </div>
  );
};

const SettingsApp = () => {
  const { settings, updateSetting, togglePerformanceMode, resetSettings } = useSettings();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full bg-gray-900 text-white overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-400">System Settings</h2>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-2 text-yellow-400">Performance Mode</h3>
        <p className="text-sm text-gray-400 mb-4">Disables particles, animations, and cursor effects for maximum performance.</p>
        <Toggle
          label="Enable Performance Mode"
          checked={settings.performanceMode}
          onChange={togglePerformanceMode}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Theme Color</h3>
        <ThemeSelector
          currentTheme={settings.theme}
          onSelect={(theme) => updateSetting('theme', theme)}
        />
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Visuals & Audio</h3>
        <Toggle
          label="Particles"
          checked={settings.particlesEnabled}
          onChange={(val) => updateSetting('particlesEnabled', val)}
        />
        <Toggle
          label="Cursor Effects"
          checked={settings.cursorEffects}
          onChange={(val) => updateSetting('cursorEffects', val)}
        />
        <Toggle
          label="Animations"
          checked={settings.animationsEnabled}
          onChange={(val) => updateSetting('animationsEnabled', val)}
        />
        <Toggle
          label="Sound Effects"
          checked={settings.soundEnabled}
          onChange={(val) => updateSetting('soundEnabled', val)}
        />
      </div>

      <button
        onClick={resetSettings}
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
      >
        Reset to Defaults
      </button>
    </motion.div>
  );
};

export default memo(SettingsApp);
