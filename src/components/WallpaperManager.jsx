import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import ThreeBackground from './ThreeBackground';

// ==========================================
// 1. MATRIX DIGITAL RAIN COMPONENT
// ==========================================
function MatrixRain() {
  const canvasRef = useRef(null);
  const { getAccentColor } = useSettings();
  const accentColor = getAccentColor();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const matrixChars = '01101010011001010110001101101000011011100110100101100011011010010110000101101110'.split('');
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);

    // Track active columns drop Y coordinates
    const drops = Array(columns).fill(1);

    let frameId;
    const draw = () => {
      // Semi-transparent background for trails effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = accentColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Pick random character
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Reset drops when they hit screen bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [accentColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none select-none block" 
    />
  );
}

// ==========================================
// 2. SOFT GRADIENT BLOB (PERFORMANCE OPTIMIZATION FRIENDLY)
// ==========================================
function GradientBlob() {
  const { getAccentColor } = useSettings();
  const accent = getAccentColor();

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden bg-dark-bg select-none pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #050508 0%, #0c0c14 100%)'
      }}
    >
      {/* CSS Blob 1 */}
      <div 
        className="absolute w-[45vw] h-[45vw] rounded-full filter blur-[120px] opacity-[0.06] animate-float"
        style={{
          background: accent,
          left: '10%',
          top: '15%',
          animationDuration: '16s'
        }}
      />
      {/* CSS Blob 2 */}
      <div 
        className="absolute w-[35vw] h-[35vw] rounded-full filter blur-[100px] opacity-[0.04] animate-float"
        style={{
          background: accent,
          right: '15%',
          bottom: '20%',
          animationDuration: '24s',
          animationDirection: 'reverse'
        }}
      />
    </div>
  );
}

// ==========================================
// MAIN WALLPAPER COORDINATOR
// ==========================================
export default function WallpaperManager() {
  const { settings } = useSettings();

  // Downgrade immediately during Performance Mode
  if (settings.performanceMode) {
    return <GradientBlob />;
  }

  switch (settings.wallpaper) {
    case 'satellite':
      return <ThreeBackground />;
    case 'matrix':
      return <MatrixRain />;
    case 'gradient':
    default:
      return <GradientBlob />;
  }
}
