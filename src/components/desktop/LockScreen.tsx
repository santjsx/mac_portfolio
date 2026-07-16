import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Power, RefreshCw, Moon, Flashlight, Camera } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
  currentWallpaper: string;
  developerPhoto: string;
  developerName: string;
  onSleep: () => void;
  onRestart: () => void;
  isFlashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  onCameraLaunch?: () => void;
  isDesktop?: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  currentWallpaper,
  developerPhoto,
  developerName,
  onSleep,
  onRestart,
  isFlashlightOn = false,
  onToggleFlashlight,
  onCameraLaunch,
  isDesktop = true,
}) => {
  const [time, setTime] = useState(new Date());
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep time updated
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus password input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes}`;
  };

  const formatAmPm = (d: Date) => {
    return d.getHours() >= 12 ? 'PM' : 'AM';
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUnlockAttempt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      onUnlock();
    }, 450);
  };

  const handleBgClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.auth-panel') && !target.closest('.action-button') && !target.closest('.quick-action-btn')) {
      handleUnlockAttempt();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onClick={handleBgClick}
      className="fixed inset-0 z-[99999] flex flex-col justify-between items-center p-12 text-white select-none overflow-hidden animate-none"
    >
      {/* Blurred lockscreen background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-105 brightness-[0.55] transition-all duration-700"
        style={{
          background: currentWallpaper.startsWith('linear-gradient')
            ? currentWallpaper
            : `url(${currentWallpaper}) center/cover no-repeat`,
        }}
      />

      {/* Flashlight beam glow effect */}
      {isFlashlightOn && !isDesktop && (
        <div 
          className="absolute inset-0 pointer-events-none z-5 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 12% 88%, rgba(253, 224, 71, 0.22) 0%, rgba(253, 224, 71, 0.05) 30%, rgba(0,0,0,0) 65%)'
          }}
        />
      )}

      {/* Top action pills for power */}
      {!isDesktop && (
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <button 
            onClick={onSleep} 
            className="w-8 h-8 rounded-full bg-black/30 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white/80 cursor-pointer action-button"
            aria-label="Sleep"
          >
            <Moon size={13} />
          </button>
          <button 
            onClick={onRestart} 
            className="w-8 h-8 rounded-full bg-black/30 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white/80 cursor-pointer action-button"
            aria-label="Restart"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      )}

      {/* Date & Time Header Display */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mt-12 relative z-10 flex flex-col items-center gap-1"
      >
        <span className="text-[14px] font-black uppercase tracking-[0.25em] text-white/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          {formatDate(time)}
        </span>
        <div className="flex items-baseline justify-center gap-1 select-none">
          <h1 className="text-[76px] font-black tracking-tight leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] font-sans">
            {formatTime(time)}
          </h1>
          <span className="text-[18px] font-black uppercase tracking-wide text-white/75 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
            {formatAmPm(time)}
          </span>
        </div>
      </motion.div>

      {/* Auth / Login Dashboard Panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex flex-col items-center gap-5 relative z-10 auth-panel"
      >
        {/* Rounded Profile Avatar */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-md group-hover:scale-105 transition-all duration-300" />
          <img
            src={developerPhoto}
            alt={developerName}
            className="w-[100px] h-[100px] rounded-full border-[2.5px] border-white/80 object-cover relative z-10 shadow-lg"
            draggable="false"
          />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-black tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">{developerName}</h2>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Guest User
          </p>
        </div>

        {/* Password input simulation */}
        <form
          onSubmit={handleUnlockAttempt}
          className="flex items-center bg-black/35 backdrop-blur-md border border-white/15 hover:border-white/25 rounded-full px-3 py-1.5 w-60 justify-between transition-all relative shadow-lg"
        >
          <input
            ref={inputRef}
            type="password"
            placeholder="Type any key to unlock..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-center text-white placeholder-white/45 w-full font-bold select-text"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center cursor-pointer transition-all shrink-0 ml-1.5"
            aria-label="Unlock"
          >
            <ArrowRight size={12} className={isSubmitting ? 'animate-ping' : ''} />
          </button>
        </form>

        <span className="text-[9px] font-black tracking-wider uppercase text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          Or click screen to unlock instantly
        </span>
      </motion.div>

      {/* Footer Section */}
      {isDesktop ? (
        /* Sleep, Restart, Shutdown Action Buttons (Desktop Layout) */
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center items-center gap-12 relative z-10 mb-8 select-none"
        >
          <button
            onClick={onSleep}
            className="flex flex-col items-center gap-2 group action-button cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 group-hover:bg-white/20 group-hover:scale-105 flex items-center justify-center transition-all text-white/70 group-hover:text-white shadow-md">
              <Moon size={16} />
            </div>
            <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">
              Sleep
            </span>
          </button>

          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-2 group action-button cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 group-hover:bg-white/20 group-hover:scale-105 flex items-center justify-center transition-all text-white/70 group-hover:text-white shadow-md">
              <RefreshCw size={15} />
            </div>
            <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">
              Restart
            </span>
          </button>

          <button
            onClick={onSleep}
            className="flex flex-col items-center gap-2 group action-button cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 group-hover:bg-white/20 group-hover:scale-105 flex items-center justify-center transition-all text-white/70 group-hover:text-white shadow-md">
              <Power size={15} />
            </div>
            <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">
              Shut Down
            </span>
          </button>
        </motion.div>
      ) : (
        /* iOS Quick Actions & Home Indicator (Mobile Layout) */
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full relative z-10 flex flex-col items-center select-none"
        >
          {/* Quick Actions row (Flashlight & Camera) */}
          <div className="flex justify-between items-center w-full px-6 mb-8 max-w-[400px]">
            {/* Flashlight button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFlashlight) onToggleFlashlight();
              }}
              className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg quick-action-btn ${
                isFlashlightOn 
                  ? 'bg-yellow-300 border-yellow-400 text-black scale-105' 
                  : 'bg-black/30 text-white hover:bg-black/55 active:scale-95'
              }`}
              aria-label="Flashlight toggle"
            >
              <Flashlight size={18} className={isFlashlightOn ? 'fill-current text-amber-900' : ''} />
            </button>

            {/* Camera button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onCameraLaunch) onCameraLaunch();
              }}
              className="w-12 h-12 rounded-full border border-white/10 bg-black/30 hover:bg-black/55 active:scale-95 flex items-center justify-center cursor-pointer transition-all shadow-lg quick-action-btn text-white"
              aria-label="Camera launch"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Swipe Home Indicator Bar */}
          <div 
            onClick={() => onUnlock()}
            className="w-full flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-[130px] h-[5px] rounded-full bg-white/75 shadow-xs transition-colors hover:bg-white active:bg-white" />
            <span className="text-[9px] font-black text-white/50 tracking-wider uppercase mt-1.5 animate-pulse">
              Swipe up or Tap bar to unlock
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
