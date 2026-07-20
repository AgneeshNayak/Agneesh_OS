import { memo } from 'react';

// Import all sub-applications statically to eliminate on-demand chunk resolution latency
import AboutApp from '../components/apps/AboutApp';
import ProjectsApp from '../components/apps/ProjectsApp';
import SkillsApp from '../components/apps/SkillsApp';
import ContactApp from '../components/apps/ContactApp';
import TerminalApp from '../components/apps/TerminalApp';
import SettingsApp from '../components/apps/SettingsApp';
import MusicApp from '../components/apps/MusicApp';
import WeatherApp from '../components/apps/WeatherApp';
import AIAssistantApp from '../components/apps/AIAssistantApp';
import GamesApp from '../components/apps/GamesApp';
import ExperienceApp from '../components/apps/ExperienceApp';
import CertificatesApp from '../components/apps/CertificatesApp';
import RecycleBinApp from '../components/apps/RecycleBinApp';

const APP_COMPONENTS = {
  'about': AboutApp,
  'projects': ProjectsApp,
  'skills': SkillsApp,
  'contact': ContactApp,
  'terminal': TerminalApp,
  'settings': SettingsApp,
  'music': MusicApp,
  'weather': WeatherApp,
  'ai-assistant': AIAssistantApp,
  'games': GamesApp,
  'experience': ExperienceApp,
  'certificates': CertificatesApp,
  'recycle-bin': RecycleBinApp,
};

const AppRenderer = memo(function AppRenderer({ appId }) {
  const Component = APP_COMPONENTS[appId];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-2xl mb-2">🚧</p>
          <p className="text-sm font-mono text-gray-400">App "{appId}" not found</p>
        </div>
      </div>
    );
  }

  // Render component directly for zero-latency instant launch
  return <Component />;
});

export default AppRenderer;
