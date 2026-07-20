import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export default function DeveloperMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [networkLogs, setNetworkLogs] = useState([
    { url: '/api/health', status: 200, duration: 15, timestamp: new Date() }
  ]);
  const [chunkLoads, setChunkLoads] = useState([]);
  const [renderCount, setRenderCount] = useState(0);

  const location = useLocation();
  const { getAccentColor, settings } = useSettings();
  const accentColor = getAccentColor();
  
  // Track component render tick
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Track keyboard shortcut Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Track FPS dynamically
  useEffect(() => {
    if (!isOpen) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let animFrameId;

    const tick = () => {
      frameCount++;
      const time = performance.now();
      if (time >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen]);

  // Intercept fetch requests dynamically
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'API Request';
      const start = performance.now();
      
      try {
        const response = await originalFetch.apply(this, args);
        const duration = Math.round(performance.now() - start);
        
        // Log to telemetry
        setNetworkLogs(prev => [
          ...prev, 
          { 
            url: url.replace(window.location.origin, ''), 
            status: response.status, 
            duration, 
            timestamp: new Date() 
          }
        ].slice(-8)); // limit log length
        
        return response;
      } catch (err) {
        const duration = Math.round(performance.now() - start);
        setNetworkLogs(prev => [
          ...prev, 
          { 
            url: url.replace(window.location.origin, ''), 
            status: 'FAILED', 
            duration, 
            timestamp: new Date() 
          }
        ].slice(-8));
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Monitor dynamic imports/lazy chunks
  useEffect(() => {
    // Audit loaded script tags corresponding to bundle chunks
    const checkChunks = () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const chunks = scripts.map(s => {
        const parts = s.src.split('/');
        return parts[parts.length - 1];
      }).filter(name => name.includes('.js') && !name.includes('main'));
      setChunkLoads(chunks);
    };

    checkChunks();
    const observer = new MutationObserver(checkChunks);
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-4 left-4 w-72 glass-strong rounded-xl border z-[10005] overflow-hidden text-[10px] font-mono text-gray-300"
      style={{
        borderColor: `${accentColor}40`,
        boxShadow: `0 0 20px ${accentColor}10, 0 10px 30px rgba(0,0,0,0.6)`
      }}
    >
      {/* DevTools Header Accent Bar */}
      <div 
        className="px-3 py-2 flex items-center justify-between border-b"
        style={{
          borderColor: `${accentColor}20`,
          background: `${accentColor}05`
        }}
      >
        <span style={{ color: accentColor }} className="font-bold">⚡ AgneeshOS TELEMETRY DEVPANEL</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          [×]
        </button>
      </div>

      {/* Stats Grids */}
      <div className="p-3 space-y-3.5">
        
        {/* Core telemetry */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-black/25 rounded border border-dark-border">
            <div className="text-gray-500 mb-0.5">METRIC: FPS</div>
            <div 
              className="text-sm font-bold"
              style={{ color: fps > 45 ? '#00ff41' : fps > 25 ? '#ffd700' : '#ff0040' }}
            >
              {fps} FPS
            </div>
          </div>
          <div className="p-2 bg-black/25 rounded border border-dark-border">
            <div className="text-gray-500 mb-0.5">RENDER COUNT</div>
            <div className="text-sm font-bold text-neon-blue">{renderCount} ticks</div>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-1">
          <div className="text-gray-500 uppercase text-[9px]">// Active OS Route</div>
          <div className="bg-black/20 p-2 rounded border border-dark-border font-semibold text-white break-all">
            {location.pathname}
          </div>
        </div>

        {/* Lazy Chunk telemetries */}
        <div className="space-y-1">
          <div className="text-gray-500 uppercase text-[9px]">// Loaded JS Chunks ({chunkLoads.length})</div>
          <div className="max-h-20 overflow-y-auto bg-black/25 p-2 rounded border border-dark-border space-y-0.5">
            {chunkLoads.map((chunk, idx) => (
              <div key={idx} className="text-gray-400 text-[9px] truncate">
                📦 {chunk}
              </div>
            ))}
          </div>
        </div>

        {/* Network Logs */}
        <div className="space-y-1">
          <div className="text-gray-500 uppercase text-[9px]">// Network Requests</div>
          <div className="max-h-24 overflow-y-auto bg-black/25 p-2 rounded border border-dark-border space-y-1">
            {networkLogs.length > 0 ? (
              networkLogs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-400 truncate max-w-[130px]" title={log.url}>
                    {log.url}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <span style={{ color: log.status === 200 || log.status === 201 ? '#00ff41' : '#ff0040' }}>
                      {log.status}
                    </span>
                    <span className="text-gray-600">({log.duration}ms)</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-600 italic">No connections captured.</div>
            )}
          </div>
        </div>

        {/* performance mode reminder */}
        <div className="flex justify-between items-center text-[8px] text-gray-500 pt-1 border-t border-dark-border">
          <span>Performance Mode</span>
          <span className={settings.performanceMode ? 'text-neon-green font-bold' : 'text-gray-600'}>
            {settings.performanceMode ? 'ACTIVE' : 'DEACTIVE'}
          </span>
        </div>

      </div>
    </div>
  );
}
