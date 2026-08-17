import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useWindowSize } from '../hooks/useWindowSize';
import { useSound } from '../hooks/useSound';

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
  const { playSound } = useSound();

  const frameRef = useRef(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Snap state (left, right, or null)
  const [snapState, setSnapState] = useState(null);

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

  // Window move & resize listener
  useEffect(() => {
    if (isMobile) return;
    
    const onMouseMove = (e) => {
      if (isDragging.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxX = Math.max(0, window.innerWidth - size.width);
        const maxY = Math.max(0, window.innerHeight - 80);
        const nextX = Math.max(0, Math.min(maxX, dragStart.current.posX + dx));
        const nextY = Math.max(0, Math.min(maxY, dragStart.current.posY + dy));

        // Snap indicator calculations near screen side margins (within 35px)
        if (e.clientX < 35) {
          setSnapState('left');
        } else if (e.clientX > window.innerWidth - 35) {
          setSnapState('right');
        } else {
          setSnapState(null);
        }

        updateWindowPosition(id, { x: nextX, y: nextY });
      }

      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const maxW = Math.max(300, window.innerWidth - position.x);
        const maxH = Math.max(250, window.innerHeight - position.y - 48);
        updateWindowSize(id, {
          width: Math.max(300, Math.min(maxW, resizeStart.current.w + dx)),
          height: Math.max(250, Math.min(maxH, resizeStart.current.h + dy)),
        });
      }
    };

    const onMouseUp = (e) => {
      if (isDragging.current) {
        isDragging.current = false;

        // Apply Snap resizing physically on mouse release
        if (snapState === 'left') {
          updateWindowPosition(id, { x: 0, y: 0 });
          updateWindowSize(id, { width: window.innerWidth / 2, height: window.innerHeight - 48 });
          playSound('click');
        } else if (snapState === 'right') {
          updateWindowPosition(id, { x: window.innerWidth / 2, y: 0 });
          updateWindowSize(id, { width: window.innerWidth / 2, height: window.innerHeight - 48 });
          playSound('click');
        }
        setSnapState(null);
      }
      if (isResizing.current) {
        isResizing.current = false;
        playSound('click');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id, snapState, updateWindowPosition, updateWindowSize, isMobile, playSound]);

  const isFullscreen = maximized || isMobile;

  const windowStyle = isFullscreen
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex }
    : { top: position.y, left: position.x, width: size.width, height: size.height, zIndex };

  return (
    <>
      {/* Snap Assist Preview Overlay */}
      {snapState && (
        <div 
          className="fixed top-0 bottom-12 border-2 border-dashed pointer-events-none z-[99999] transition-all duration-150"
          style={{
            left: snapState === 'left' ? '0' : '50%',
            width: '50%',
            borderColor: color,
            backgroundColor: `${color}06`,
            boxShadow: `0 0 20px ${color}15`,
          }}
        />
      )}

      <AnimatePresence>
        {!minimized && (
          <motion.div
            ref={frameRef}
            className="fixed flex flex-col"
            style={{
              ...windowStyle,
              // Live blur/grayscale overlay of inactive background windows
              filter: isActive ? 'none' : 'blur(0.5px) grayscale(15%)',
              transition: isDragging.current || isResizing.current ? 'none' : 'filter 0.3s, border-color 0.3s'
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.1, 
              // Kinematic exit trajectory targeting taskbar coordinates
              y: window.innerHeight - position.y - 120,
              x: (window.innerWidth / 2) - position.x - (size.width / 2)
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            onMouseDown={() => focusWindow(id)}
          >
            {/* Window chrome with glass effect */}
            <div
              className="rounded-xl overflow-hidden flex flex-col h-full"
              style={{
                background: 'rgba(12, 12, 20, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isActive ? `1px solid ${color}50` : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isActive
                  ? `0 0 25px ${color}18, 0 12px 40px rgba(0,0,0,0.6)`
                  : '0 6px 20px rgba(0,0,0,0.5)',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                borderRadius: isFullscreen ? '0px' : '12px',
              }}
            >
              {/* Title bar */}
              <div
                className={`flex items-center h-10 px-3 select-none shrink-0 rounded-t-xl ${isMobile ? 'cursor-default' : 'cursor-move'}`}
                style={{
                  background: isActive
                    ? `linear-gradient(90deg, ${color}15, rgba(12,12,20,0.95))`
                    : 'rgba(16, 16, 26, 0.8)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseDown={onDragMouseDown}
              >
                {/* Window controls */}
                <div className="window-controls flex items-center gap-1.5 mr-3">
                  <button
                    onClick={() => closeWindow(id)}
                    className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors relative group flex items-center justify-center cursor-pointer"
                    title="Close"
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/0 group-hover:text-black/60">×</span>
                  </button>
                  {!isMobile && (
                    <>
                      <button
                        onClick={() => {
                          minimizeWindow(id);
                          playSound('window-close');
                        }}
                        className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors relative group flex items-center justify-center cursor-pointer"
                        title="Minimize"
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black/0 group-hover:text-black/60">−</span>
                      </button>
                      <button
                        onClick={() => {
                          maximizeWindow(id);
                          playSound('click');
                        }}
                        className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors relative group flex items-center justify-center cursor-pointer"
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
        )}
      </AnimatePresence>
    </>
  );
});

export default WindowFrame;
