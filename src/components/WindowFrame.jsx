import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useWindowSize } from '../hooks/useWindowSize';

const WindowFrame = memo(function WindowFrame({ windowData, children }) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
  } = useWindows();

  const { id, title, icon, color, minimized, maximized, zIndex, position, size } = windowData;
  const isActive = activeWindowId === id;
  const { isMobile } = useWindowSize();

  const frameRef = useRef(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Dragging handlers
  const onDragMouseDown = useCallback((e) => {
    if (isMobile) return;
    if (e.target.closest('.window-controls')) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    focusWindow(id);
  }, [id, position, focusWindow, isMobile]);

  const onResizeMouseDown = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };
    focusWindow(id);
  }, [id, size, focusWindow, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const onMouseMove = (e) => {
      if (isDragging.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        updateWindowPosition(id, {
          x: dragStart.current.posX + dx,
          y: Math.max(0, dragStart.current.posY + dy),
        });
      }
      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        updateWindowSize(id, {
          width: Math.max(400, resizeStart.current.w + dx),
          height: Math.max(300, resizeStart.current.h + dy),
        });
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id, updateWindowPosition, updateWindowSize, isMobile]);

  if (minimized) return null;

  const isFullscreen = maximized || isMobile;

  const windowStyle = isFullscreen
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex }
    : { top: position.y, left: position.x, width: size.width, height: size.height, zIndex };

  return (
    <AnimatePresence>
      <motion.div
        ref={frameRef}
        className="fixed flex flex-col"
        style={windowStyle}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onMouseDown={() => focusWindow(id)}
      >
        {/* Window chrome with glass effect */}
        <div
          className="rounded-xl overflow-hidden flex flex-col h-full"
          style={{
            background: 'rgba(12, 12, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isActive ? color + '40' : 'rgba(42,42,62,0.6)'}`,
            boxShadow: isActive
              ? `0 0 20px ${color}15, 0 8px 32px rgba(0,0,0,0.5)`
              : '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            borderRadius: isFullscreen ? '0' : '12px',
          }}
        >
          {/* Title bar */}
          <div
            className={`flex items-center h-10 px-3 select-none shrink-0 ${isMobile ? 'cursor-default' : 'cursor-move'}`}
            style={{
              background: isActive
                ? `linear-gradient(90deg, ${color}08, transparent)`
                : 'transparent',
              borderBottom: `1px solid ${isActive ? color + '20' : 'rgba(42,42,62,0.4)'}`,
            }}
            onMouseDown={onDragMouseDown}
          >
            {/* Window controls */}
            <div className="window-controls flex items-center gap-1.5 mr-3">
              <button
                onClick={() => closeWindow(id)}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors relative group flex items-center justify-center"
                title="Close"
              >
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/0 group-hover:text-black/60">×</span>
              </button>
              {!isMobile && (
                <>
                  <button
                    onClick={() => minimizeWindow(id)}
                    className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors relative group flex items-center justify-center"
                    title="Minimize"
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/0 group-hover:text-black/60">−</span>
                  </button>
                  <button
                    onClick={() => maximizeWindow(id)}
                    className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors relative group flex items-center justify-center"
                    title={maximized ? 'Restore' : 'Maximize'}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/0 group-hover:text-black/60">+</span>
                  </button>
                </>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-base">{icon}</span>
              <span
                className="text-xs font-display tracking-wider truncate"
                style={{ color: isActive ? color : '#888' }}
              >
                {title}
              </span>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isActive ? color : '#444',
                  boxShadow: isActive ? `0 0 6px ${color}60` : 'none',
                }}
              />
              <span className="text-[9px] font-mono text-gray-600">
                {windowData.appId.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-auto relative">
            {children}
          </div>
        </div>

        {/* Resize handle */}
        {!isFullscreen && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            onMouseDown={onResizeMouseDown}
            style={{
              background: `linear-gradient(135deg, transparent 50%, ${color}30 50%)`,
              borderRadius: '0 0 12px 0',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
});

export default WindowFrame;
