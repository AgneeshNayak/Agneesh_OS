import { useEffect, useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function CustomCursor() {
  const { settings, getAccentColor } = useSettings();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const trailRef = useRef(null);

  useEffect(() => {
    // If cursor effects are disabled, do not mount cursor logic
    if (!settings.cursorEffects || settings.performanceMode) {
      document.body.style.cursor = 'auto';
      return;
    }

    // Hide the native cursor
    document.body.style.cursor = 'none';

    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'auto';
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    addEventListeners();
    return () => removeEventListeners();
  }, [settings.cursorEffects, settings.performanceMode]);

  // Handle tracking state of interactive elements for cursor resizing
  useEffect(() => {
    if (!settings.cursorEffects || settings.performanceMode) return;

    const onMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('.cursor-pointer') ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    return () => document.removeEventListener('mouseover', onMouseOver);
  }, [settings.cursorEffects, settings.performanceMode]);

  // Render trail smoothly using requestAnimationFrame
  useEffect(() => {
    if (!settings.cursorEffects || settings.performanceMode) return;

    let frameId;
    const animateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Ease/speed multiplier
        const speed = 0.15;
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      frameId = requestAnimationFrame(animateTrail);
    };
    frameId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(frameId);
  }, [position, settings.cursorEffects, settings.performanceMode]);

  if (!settings.cursorEffects || settings.performanceMode || hidden) {
    return null;
  }

  const accentColor = getAccentColor();

  return (
    <>
      {/* Outer ring (trail) */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none rounded-full z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
          width: hovered ? '40px' : clicked ? '15px' : '24px',
          height: hovered ? '40px' : clicked ? '15px' : '24px',
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 10px ${accentColor}40`,
          backgroundColor: clicked ? `${accentColor}20` : 'transparent',
          opacity: 0.8,
        }}
      />
      {/* Inner dot */}
      <div
        className="fixed pointer-events-none rounded-full z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '6px',
          height: '6px',
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
        }}
      />
    </>
  );
}
