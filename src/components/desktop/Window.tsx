import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import type { Section } from '../shared/sectionsData';
import { SPRING_PRESETS, REDUCED_MOTION_TRANSITION } from '../shared/tokens';
import { SectionContent } from '../shared/SectionContent';

export interface WindowState {
  id: string;
  sectionKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  origin?: DOMRect | null;
}

interface WindowProps {
  win: WindowState;
  sections: Section[];
  activeWindowId: string | null;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string, iconRect?: DOMRect | null) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, w: number, h: number) => void;
  focusWindow: (id: string) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (val: boolean) => void;
  musicProgress: number;
  setMusicProgress: (val: number) => void;
  currentTrackIdx: number;
  setCurrentTrackIdx: (val: number) => void;
  playlist: any[];
  togglePlayback: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (val: number) => void;
  currentWallpaper: string;
  setCurrentWallpaper: (val: string) => void;
}

export const DesktopWindow: React.FC<WindowProps> = ({
  win,
  sections,
  activeWindowId,
  closeWindow,
  toggleMinimize,
  toggleMaximize,
  updateWindowPos,
  updateWindowSize,
  focusWindow,
  isMusicPlaying,
  setIsMusicPlaying,
  musicProgress,
  setMusicProgress,
  currentWallpaper,
  setCurrentWallpaper,
  currentTrackIdx,
  setCurrentTrackIdx,
  playlist,
  togglePlayback,
  nextTrack,
  prevTrack,
  volume,
  setVolume
}) => {
  const section = sections.find(s => s.key === win.sectionKey);
  const prefersReducedMotion = useReducedMotion();
  const isFocused = win.id === activeWindowId;

  // Window bounds constraints
  const getBounds = () => {
    return {
      top: 32, // Below menu bar
      left: 80 - win.width,
      right: window.innerWidth - 80,
      bottom: window.innerHeight - 80
    };
  };

  // Determine transition target properties
  const getAnimateTarget = () => {
    if (win.minimized) {
      if (win.origin) {
        return {
          opacity: 0,
          scale: 0.1,
          x: win.origin.x + win.origin.width / 2 - win.width / 2,
          y: win.origin.y + win.origin.height / 2 - win.height / 2,
          width: win.width,
          height: win.height,
        };
      }
      return { opacity: 0, scale: 0.2 };
    }

    if (win.maximized) {
      const topMargin = 44; // 32 menu bar + 12 margin
      const sideMargin = 12;
      const bottomSpace = 96; // Leave space for dock
      return {
        opacity: 1,
        scale: 1,
        x: sideMargin,
        y: topMargin,
        width: window.innerWidth - (sideMargin * 2),
        height: window.innerHeight - topMargin - bottomSpace,
      };
    }

    return {
      opacity: 1,
      scale: 1,
      x: win.x,
      y: win.y,
      width: win.width,
      height: win.height
    };
  };

  if (!section) return null;

  const renderContent = () => {
    return (
      <SectionContent 
        sectionKey={section.key} 
        isFocused={isFocused}
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        musicProgress={musicProgress}
        setMusicProgress={setMusicProgress}
        currentTrackIdx={currentTrackIdx}
        setCurrentTrackIdx={setCurrentTrackIdx}
        playlist={playlist}
        togglePlayback={togglePlayback}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
        volume={volume}
        setVolume={setVolume}
        currentWallpaper={currentWallpaper}
        setCurrentWallpaper={setCurrentWallpaper}
      />
    );
  };

  // Drag start handler (Pointer events)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only trigger drag on title bar
    const target = e.target as HTMLElement;
    if (target.closest('.traffic-lights') || target.closest('.no-drag')) return;

    focusWindow(win.id);
    if (win.maximized) return;

    const bounds = getBounds();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = win.x;
    const initialY = win.y;

    const handlePointerMove = (moveEv: PointerEvent) => {
      let nextX = initialX + (moveEv.clientX - startX);
      let nextY = initialY + (moveEv.clientY - startY);

      // Clamp coordinates
      nextX = Math.max(bounds.left, Math.min(nextX, bounds.right));
      nextY = Math.max(bounds.top, Math.min(nextY, bounds.bottom));

      updateWindowPos(win.id, nextX, nextY);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Resize start handler
  const handleResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    focusWindow(win.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = win.width;
    const initialH = win.height;

    const handlePointerMove = (moveEv: PointerEvent) => {
      let nextW = initialW + (moveEv.clientX - startX);
      let nextH = initialH + (moveEv.clientY - startY);

      // Clamp dimensions
      nextW = Math.max(320, Math.min(nextW, window.innerWidth - win.x));
      nextH = Math.max(240, Math.min(nextH, window.innerHeight - win.y));

      updateWindowSize(win.id, nextW, nextH);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleTrafficLightClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(win.id);
  };

  const handleTrafficLightMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dockIcon = document.getElementById(`dock-icon-${win.sectionKey}`);
    toggleMinimize(win.id, dockIcon ? dockIcon.getBoundingClientRect() : null);
  };

  const handleTrafficLightMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMaximize(win.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: win.x, y: win.y }}
      animate={getAnimateTarget()}
      exit={{ 
        opacity: 0, 
        scale: 0.9, 
        transition: { duration: 0.15 } 
      }}
      transition={prefersReducedMotion ? REDUCED_MOTION_TRANSITION : SPRING_PRESETS.window}
      onPointerDown={() => focusWindow(win.id)}
      style={{ zIndex: win.zIndex }}
      className={`absolute flex flex-col rounded-[20px] overflow-hidden glass-opaque pointer-events-auto select-none transition-shadow duration-300 border ${
        isFocused 
          ? 'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.1)] border-black/[0.15] dark:border-white/[0.22]' 
          : 'shadow-[0_12px_28px_-10px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.15)] border-black/[0.1] dark:border-white/[0.08] opacity-[0.99]'
      } ${win.minimized ? 'pointer-events-none' : ''}`}
    >
      {/* Title Bar */}
      <div 
        onPointerDown={handlePointerDown}
        onDoubleClick={handleTrafficLightMaximize}
        className="h-11 flex items-center px-4 shrink-0 cursor-default select-none border-b border-[var(--border-color)] relative"
        style={{ 
          background: isFocused ? 'var(--surface-color)' : 'rgba(128,128,128,0.02)',
        }}
      >
        {/* Traffic Lights */}
        <div className="flex gap-2 absolute left-4 z-10 traffic-lights group/lights">
          {/* Close button */}
          <button 
            onClick={handleTrafficLightClose}
            tabIndex={isFocused ? 0 : -1}
            style={{ width: '12.5px', height: '12.5px' }}
            className={`rounded-full border border-black/5 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
              isFocused 
                ? 'bg-[#FF5F56] border-[#E0443E]' 
                : 'bg-zinc-300 dark:bg-zinc-700 border-zinc-400/10 group-hover/lights:bg-[#FF5F56] group-hover/lights:border-[#E0443E]'
            }`}
            aria-label="Close window"
          >
            <X size={8} className="opacity-0 group-hover/lights:opacity-100 text-black/60 font-black shrink-0" />
          </button>
          {/* Minimize button */}
          <button 
            onClick={handleTrafficLightMinimize}
            tabIndex={isFocused ? 0 : -1}
            style={{ width: '12.5px', height: '12.5px' }}
            className={`rounded-full border border-black/5 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
              isFocused 
                ? 'bg-[#FFBD2E] border-[#DEA123]' 
                : 'bg-zinc-300 dark:bg-zinc-700 border-zinc-400/10 group-hover/lights:bg-[#FFBD2E] group-hover/lights:border-[#DEA123]'
            }`}
            aria-label="Minimize window"
          >
            <Minus size={8} className="opacity-0 group-hover/lights:opacity-100 text-black/60 font-black shrink-0" />
          </button>
          {/* Maximize button */}
          <button 
            onClick={handleTrafficLightMaximize}
            tabIndex={isFocused ? 0 : -1}
            style={{ width: '12.5px', height: '12.5px' }}
            className={`rounded-full border border-black/5 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
              isFocused 
                ? 'bg-[#27C93F] border-[#1AAB29]' 
                : 'bg-zinc-300 dark:bg-zinc-700 border-zinc-400/10 group-hover/lights:bg-[#27C93F] group-hover/lights:border-[#1AAB29]'
            }`}
            aria-label="Maximize window"
          >
            <Maximize2 size={8} className="opacity-0 group-hover/lights:opacity-100 text-black/60 font-black shrink-0" />
          </button>
        </div>

        {/* Title Text */}
        <div 
          className={`flex-1 text-center font-bold text-xs truncate px-16 transition-colors duration-200 ${
            isFocused ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-80'
          }`}
        >
          {section.title}
        </div>
      </div>

      {/* Window Body */}
      <div 
        className="flex-1 overflow-hidden bg-[var(--bg-color)]/25 relative flex flex-col"
      >
        {renderContent()}
      </div>

      {/* Resize Handle */}
      {!win.maximized && (
        <div 
          onPointerDown={handleResizeDown}
          className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20"
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
};
