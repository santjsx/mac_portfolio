import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { SPRING_PRESETS, REDUCED_MOTION_TRANSITION } from '../shared/tokens';

interface DockProps {
  openWindows: Array<{ id: string; sectionKey: string; minimized: boolean }>;
  openWindow: (sectionKey: string, originRect?: DOMRect) => void;
  toggleMinimize: (id: string, iconRect?: DOMRect) => void;
  activeWindowId: string | null;
}

interface DockItem {
  key: string;
  title: string;
  dockLabel: string;
  icon: string;
  type: 'section' | 'external';
  url?: string;
}

export const Dock: React.FC<DockProps> = ({ openWindows, openWindow, toggleMinimize, activeWindowId }) => {
  const mouseX = useMotionValue(Infinity);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  // Define static order of dock applications (Core Portfolio pages + Socials & Tools)
  const dockItems: DockItem[] = [
    { key: 'about', title: 'Santhosh', dockLabel: 'Santhosh', icon: '/icons/whitesur/finder.svg', type: 'section' },
    { key: 'safari', title: 'Safari', dockLabel: 'Safari', icon: '/icons/whitesur/safari.svg', type: 'section' },
    { key: 'contact', title: 'Mail', dockLabel: 'Mail', icon: '/icons/whitesur/mail.svg', type: 'section' },
    { key: 'projects', title: 'Gallery', dockLabel: 'Gallery', icon: '/icons/whitesur/gallery.svg', type: 'section' },
    { key: 'experience', title: 'Notes', dockLabel: 'Notes', icon: '/icons/whitesur/notes.svg', type: 'section' },
    { key: 'skills', title: 'System Settings', dockLabel: 'System Settings', icon: '/icons/whitesur/settings.svg', type: 'section' },
    { key: 'vlc', title: 'VLC Player', dockLabel: 'VLC Player', icon: '/icons/whitesur/vlc.svg', type: 'section' },
    { key: 'vscode', title: 'VS Code', dockLabel: 'VS Code', icon: '/icons/whitesur/vscode.svg', type: 'section' },
    { key: 'discord', title: 'Discord', dockLabel: 'Discord', icon: '/icons/whitesur/discord.svg', type: 'section' },
    { key: 'spotify', title: 'Spotify', dockLabel: 'Spotify', icon: '/icons/whitesur/spotify.svg', type: 'section' }
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-40">
      <div 
        ref={containerRef}
        className="flex items-end gap-3.5 px-4.5 pb-3 pt-4 rounded-[24px] glass pointer-events-auto shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border-t border-white/[0.15] dark:border-t-white/[0.08]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="toolbar"
        aria-label="Application Dock"
      >
        {dockItems.map((item) => {
          const isSection = item.type === 'section';
          const isOpen = isSection && openWindows.some(w => w.sectionKey === item.key);
          const windowForSection = isSection && openWindows.find(w => w.sectionKey === item.key);
          const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            const iconRect = e.currentTarget.getBoundingClientRect();
            if (item.type === 'external' && item.url) {
              window.open(item.url, '_blank');
              return;
            }

            if (!windowForSection) {
              // Closed -> Open
              openWindow(item.key, iconRect);
            } else if (windowForSection.minimized) {
              // Open but minimized -> Restore
              toggleMinimize(windowForSection.id, iconRect);
            } else if (windowForSection.id === activeWindowId) {
              // Open and focused -> Minimize
              toggleMinimize(windowForSection.id, iconRect);
            } else {
              // Open but unfocused -> Focus
              openWindow(item.key, iconRect);
            }
          };

          return (
            <DockIcon 
              key={item.key} 
              item={item} 
              mouseX={mouseX} 
              isOpen={isOpen}
              onClick={handleClick}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DockIconProps {
  item: DockItem;
  mouseX: any;
  isOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DockIcon: React.FC<DockIconProps> = ({ item, mouseX, isOpen, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Calculate distance between mouse x and icon center x
  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current || val === Infinity) return 0;
    const bounds = ref.current.getBoundingClientRect();
    const iconCenter = bounds.x + bounds.width / 2;
    return val - iconCenter;
  });

  // Calculate scale factor: 1 + 0.5 * max(0, 1 - abs(distance)/100)
  const scaleSync = useTransform(distance, (dist: number) => {
    if (prefersReducedMotion || mouseX.get() === Infinity) return 1;
    const absDist = Math.abs(dist);
    const factor = Math.max(0, 1 - absDist / 100);
    return 1 + 0.5 * factor;
  });

  const springScale = useSpring(scaleSync, SPRING_PRESETS.dock);

  // Tooltip hover state
  const [hovered, setHovered] = useState(false);
  const tooltipTimeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setHovered(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={prefersReducedMotion ? REDUCED_MOTION_TRANSITION : { duration: 0.15 }}
            className="absolute -top-12 px-3 py-1 rounded-md text-xs font-semibold glass shadow-lg whitespace-nowrap z-50 text-[var(--text-primary)]"
          >
            {item.dockLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Button */}
      <motion.button
        id={`dock-icon-${item.key}`}
        ref={ref}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="w-12 h-12 flex items-center justify-center relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] select-none origin-bottom cursor-pointer"
        style={{ 
          scale: springScale
        }}
        aria-label={`Open ${item.title}`}
      >
        <img 
          src={item.icon} 
          alt="" 
          className="w-full h-full object-contain select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] hover:drop-shadow-[0_8px_12px_rgba(0,0,0,0.3)] transition-all duration-300" 
          draggable="false"
        />
      </motion.button>

      {/* Running App Dot */}
      <div 
        className={`w-1 h-1 rounded-full absolute -bottom-1 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-70' : 'scale-0 opacity-0'
        }`}
        style={{ 
          backgroundColor: 'var(--text-primary)' 
        }}
      />
    </div>
  );
};
