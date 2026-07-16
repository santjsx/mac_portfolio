import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { SPRING_PRESETS, REDUCED_MOTION_TRANSITION } from '../shared/tokens';
import { SectionContent } from '../shared/SectionContent';
import { sections } from '../shared/sectionsData';

interface AppViewProps {
  sectionKey: string;
  closeApp: () => void;
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

export const AppView: React.FC<AppViewProps> = ({ 
  sectionKey, 
  closeApp,
  isMusicPlaying,
  setIsMusicPlaying,
  musicProgress,
  setMusicProgress,
  currentTrackIdx,
  setCurrentTrackIdx,
  playlist,
  togglePlayback,
  nextTrack,
  prevTrack,
  volume,
  setVolume,
  currentWallpaper,
  setCurrentWallpaper
}) => {
  const section = sections.find(s => s.key === sectionKey);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll listener for title interpolation
  const { scrollY } = useScroll({ container: scrollRef });

  // Map scroll Y position to header opacity and scale
  // Header title fades in as page title scrolls out
  const headerTitleOpacity = useTransform(scrollY, [25, 55], [0, 1]);
  const largeTitleOpacity = useTransform(scrollY, [0, 30], [1, 0]);
  const largeTitleY = useTransform(scrollY, [0, 30], [0, -10]);

  // Swipe up to close from bottom indicator
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y < -60 || info.velocity.y < -300) {
      closeApp();
    }
  };

  if (!section) return null;

  return (
    <motion.div 
      layoutId={`app-container-${section.key}`}
      className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-[var(--bg-color)] text-[var(--text-primary)]"
      transition={prefersReducedMotion ? REDUCED_MOTION_TRANSITION : SPRING_PRESETS.page}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* iOS Navigation Header (Sticky, frosted) */}
      <div 
        className="h-11 shrink-0 flex items-center justify-between px-2 relative z-30 border-b border-[var(--border-color)] bg-[var(--surface-color)] backdrop-blur-xl"
      >
        {/* Back Button (tap target >= 44x44) */}
        <button 
          onClick={closeApp}
          className="ios-target flex items-center gap-0.5 text-blue-500 font-semibold cursor-pointer select-none"
          aria-label="Go back to Home screen"
        >
          <ChevronLeft size={24} />
          <span className="text-sm font-bold">Home</span>
        </button>

        {/* Small centered header title (shows on scroll) */}
        <motion.div 
          style={{ opacity: headerTitleOpacity }}
          className="font-extrabold text-sm absolute left-1/2 -translate-x-1/2 cursor-default"
        >
          {section.title}
        </motion.div>

        {/* Spacer to balance back button */}
        <div className="w-14 h-11 pointer-events-none" />
      </div>

      {/* Scrollable Main Content Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-container pt-4 pb-16"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Large App Title */}
        <motion.h1 
          style={{ 
            opacity: prefersReducedMotion ? 1 : largeTitleOpacity, 
            y: prefersReducedMotion ? 0 : largeTitleY 
          }}
          className="text-3xl font-black px-6 tracking-tight mb-4 select-none cursor-default"
        >
          {section.title}
        </motion.h1>

        {/* Dynamic section content */}
          <SectionContent 
            sectionKey={section.key} 
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
      </div>

      {/* iOS Home Indicator Swipe Handle */}
      <motion.div 
        drag={prefersReducedMotion ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute bottom-0 left-0 right-0 h-9 z-40 flex justify-center items-end pb-2 cursor-grab active:cursor-grabbing pointer-events-auto"
        aria-label="Swipe up to go home"
      >
        <div className="w-32 h-1 rounded-full bg-[var(--text-primary)] opacity-35" />
      </motion.div>
    </motion.div>
  );
};
