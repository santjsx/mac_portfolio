import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sun, Music } from 'lucide-react';

interface StatusBarProps {
  islandState?: {
    type: 'idle' | 'volume' | 'brightness' | 'music';
    value?: number;
    title?: string;
    artist?: string;
  };
  isMusicPlaying?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  islandState = { type: 'idle' }, 
  isMusicPlaying = false 
}) => {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(77);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Battery API integration
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBatteryLevel(Math.round(batt.level * 100));
        setIsCharging(batt.charging);

        const onLevel = () => setBatteryLevel(Math.round(batt.level * 100));
        const onCharging = () => setIsCharging(batt.charging);
        batt.addEventListener('levelchange', onLevel);
        batt.addEventListener('chargingchange', onCharging);

        return () => {
          batt.removeEventListener('levelchange', onLevel);
          batt.removeEventListener('chargingchange', onCharging);
        };
      });
    }
  }, []);

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Battery fill color logic
  const battFill = isCharging 
    ? '#30d158' 
    : batteryLevel <= 20 
      ? '#ff3b30' 
      : 'currentColor';

  const renderIslandContent = () => {
    switch (islandState.type) {
      case 'volume':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between w-full h-full px-3.5 text-white text-[10px] font-bold"
          >
            <Volume2 size={12} className="text-white/80 shrink-0" />
            <div className="flex-1 mx-2 relative h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-white rounded-full" style={{ width: `${islandState.value}%` }} />
            </div>
            <span className="shrink-0 w-8 text-right tabular-nums">{islandState.value}%</span>
          </motion.div>
        );
      case 'brightness':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between w-full h-full px-3.5 text-white text-[10px] font-bold"
          >
            <Sun size={12} className="text-white/80 shrink-0" />
            <div className="flex-1 mx-2 relative h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-white rounded-full" style={{ width: `${islandState.value}%` }} />
            </div>
            <span className="shrink-0 w-8 text-right tabular-nums">{islandState.value}%</span>
          </motion.div>
        );
      case 'music':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between w-full h-full px-3.5 text-white"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden relative">
              <Music size={11} className="text-white/60" />
            </div>
            <div className="flex-1 min-w-0 mx-2 text-left flex flex-col justify-center">
              <span className="text-[10px] font-extrabold truncate leading-tight w-full">
                {islandState.title}
              </span>
              <span className="text-[8px] font-bold text-white/50 truncate leading-none mt-0.5 w-full">
                {islandState.artist}
              </span>
            </div>
            <div className="flex gap-[2px] items-end h-3 shrink-0 px-1 select-none">
              {[1, 2, 3, 4].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-[2.5px] bg-emerald-400 rounded-[1px]"
                  animate={isMusicPlaying ? {
                    height: bar === 1 ? [3, 10, 4, 11, 3] : bar === 2 ? [4, 8, 3, 9, 4] : bar === 3 ? [3, 12, 4, 10, 3] : [5, 9, 3, 11, 5],
                  } : {
                    height: 3
                  }}
                  transition={isMusicPlaying ? {
                    duration: 0.6 + bar * 0.08,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  } : {}}
                  style={{ height: '3px' }}
                />
              ))}
            </div>
          </motion.div>
        );
      case 'idle':
      default:
        return null;
    }
  };

  const getIslandDimensions = () => {
    switch (islandState.type) {
      case 'volume':
      case 'brightness':
        return {
          width: '200px',
          height: '38px',
          borderRadius: '20px',
        };
      case 'music':
        return {
          width: '240px',
          height: '46px',
          borderRadius: '23px',
        };
      case 'idle':
      default:
        return {
          width: '126px',
          height: '37px',
          borderRadius: '20px',
        };
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-[54px] px-8 flex items-center justify-between z-50 select-none pointer-events-none text-white">
      
      {/* ══════ LEFT: Time ══════ */}
      <div className="flex items-center pointer-events-auto">
        <span className="text-[15px] font-semibold tracking-[-0.3px] tabular-nums">
          {formatTime(time)}
        </span>
      </div>

      {/* ══════ CENTER: Dynamic Island (Animated via Framer Motion) ══════ */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[5px] z-50 flex items-center justify-center pointer-events-auto">
        <motion.div 
          animate={getIslandDimensions()}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 24
          }}
          className="bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.06)] shadow-xl overflow-hidden flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {renderIslandContent()}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ══════ RIGHT: Status Icons ══════ */}
      <div className="flex items-center gap-[6px] pointer-events-auto">
        
        {/* Cellular Signal Bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" className="shrink-0">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill="currentColor" opacity="1" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="currentColor" opacity="1" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="currentColor" opacity="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="currentColor" opacity="1" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="shrink-0">
          <path 
            d="M8 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" 
            fill="currentColor"
          />
          <path 
            d="M5.64 8.36a3.35 3.35 0 0 1 4.72 0" 
            stroke="currentColor" 
            strokeWidth="1.4" 
            strokeLinecap="round"
          />
          <path 
            d="M3.46 6.18a6.15 6.15 0 0 1 9.08 0" 
            stroke="currentColor" 
            strokeWidth="1.4" 
            strokeLinecap="round"
          />
          <path 
            d="M1.28 3.95a9.06 9.06 0 0 1 13.44 0" 
            stroke="currentColor" 
            strokeWidth="1.4" 
            strokeLinecap="round"
          />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center gap-[2px]">
          <span className="text-[11px] font-medium tracking-tight tabular-nums opacity-80 mr-[2px]">
            {batteryLevel}%
          </span>
          
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none" className="shrink-0">
            <rect 
              x="0.5" y="0.5" 
              width="22" height="12" 
              rx="2.5" 
              stroke="currentColor" 
              strokeWidth="1" 
              opacity="0.4"
            />
            <rect 
              x="23.5" y="4" 
              width="2" height="5" 
              rx="1" 
              fill="currentColor" 
              opacity="0.4"
            />
            <rect 
              x="2" y="2" 
              width={Math.max(1, (batteryLevel / 100) * 19)} 
              height="9" 
              rx="1.5" 
              fill={battFill}
            />
            {isCharging && (
              <path 
                d="M12.5 2L9.5 6.5H12L10.5 11L15 6H12L13.5 2H12.5Z" 
                fill={batteryLevel > 20 ? '#000' : '#fff'} 
                opacity="0.7"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
