import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Sun,
  Radio, 
  Instagram, 
  Search,
  Volume2,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  RotateCcw,
  Monitor
} from 'lucide-react';
import { SPRING_PRESETS, REDUCED_MOTION_TRANSITION } from '../shared/tokens';
import { useLiveAPI } from '../../hooks/useLiveAPI';

// iOS 18 style vertical pill slider
interface VerticalSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  label: string;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({ min, max, value, onChange, icon, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    const updateValue = (clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = rect.height;
      const offset = clientY - rect.top;
      const ratio = Math.max(0, Math.min(1, 1 - (offset / height)));
      const nextVal = Math.round(min + ratio * (max - min));
      onChange(nextVal);
    };

    updateValue(e.clientY);

    const handlePointerMove = (moveEv: PointerEvent) => {
      updateValue(moveEv.clientY);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none w-14 shrink-0">
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="w-7 h-24 bg-white/10 rounded-[14px] border border-white/5 relative overflow-hidden cursor-pointer touch-none shadow-inner"
      >
        <div 
          className="absolute left-0 right-0 bottom-0 bg-white/70 rounded-[14px] pointer-events-none transition-all duration-75"
          style={{ height: `${percent}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white z-10 opacity-90 mix-blend-difference">
          {icon}
        </div>
      </div>
      <span className="text-[8px] font-black text-white/50 tracking-wider uppercase text-center truncate w-full">{label}</span>
    </div>
  );
};

// Connectivity toggles group widget (iOS 18 layout style)
const ConnectivityWidget: React.FC = () => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [cellular, setCellular] = useState(false);
  const [airdrop, setAirdrop] = useState(true);

  return (
    <div className="rounded-[24px] bg-black/40 border border-white/10 p-3 w-full max-w-[130px] h-32 flex flex-col justify-between shadow-lg text-left select-none shrink-0">
      <div className="grid grid-cols-2 gap-2 h-full">
        {/* WiFi */}
        <button 
          onClick={() => setWifi(!wifi)}
          className={`rounded-full flex items-center justify-center transition-all cursor-pointer ${
            wifi ? 'bg-blue-500 text-white shadow-md' : 'bg-white/10 text-white/70'
          }`}
          aria-label="Toggle WiFi"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M12 20h.01M17 15.5a7 7 0 0 0-10 0M21 11a13 13 0 0 0-18 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Bluetooth */}
        <button 
          onClick={() => setBluetooth(!bluetooth)}
          className={`rounded-full flex items-center justify-center transition-all cursor-pointer ${
            bluetooth ? 'bg-blue-500 text-white shadow-md' : 'bg-white/10 text-white/70'
          }`}
          aria-label="Toggle Bluetooth"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="m7 7 10 10-5 5V2l5 5L7 17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Cellular */}
        <button 
          onClick={() => setCellular(!cellular)}
          className={`rounded-full flex items-center justify-center transition-all cursor-pointer ${
            cellular ? 'bg-green-500 text-white shadow-md' : 'bg-white/10 text-white/70'
          }`}
          aria-label="Toggle Cellular"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M17 3v18M12 8v13M7 13v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* AirDrop */}
        <button 
          onClick={() => setAirdrop(!airdrop)}
          className={`rounded-full flex items-center justify-center transition-all cursor-pointer ${
            airdrop ? 'bg-cyan-500 text-white shadow-md' : 'bg-white/10 text-white/70'
          }`}
          aria-label="Toggle AirDrop"
        >
          <Radio size={16} strokeWidth={2.5} className="shrink-0" />
        </button>
      </div>
    </div>
  );
};

interface SpringboardProps {
  setMobileActiveApp: (key: string | null) => void;
  page: number;
  setPage: (page: number) => void;
  toggleSpotlight: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
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
  iconAppearance: 'light' | 'dark' | 'tinted';
  setIconAppearance: (val: 'light' | 'dark' | 'tinted') => void;
  tintColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue';
  setTintColor: (val: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue') => void;
}

export const Springboard: React.FC<SpringboardProps> = ({ 
  setMobileActiveApp, 
  page, 
  setPage,
  toggleSpotlight,
  brightness,
  setBrightness,
  volume,
  setVolume,
  isMusicPlaying,
  currentTrackIdx,
  playlist,
  togglePlayback,
  nextTrack,
  prevTrack,
  iconAppearance,
  setIconAppearance,
  tintColor,
  setTintColor,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeFolder, setActiveFolder] = useState<'social' | 'utilities' | null>(null);
  const live = useLiveAPI();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 15);
    return () => clearInterval(timer);
  }, []);

  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarMonthName = currentTime.toLocaleString('en-US', { month: 'long' }).toUpperCase();

  const handleDragEnd = (_: any, info: any) => {
    if (prefersReducedMotion) return;
    const swipeOffset = info.offset.x;
    const swipeVelocity = info.velocity.x;

    if (swipeOffset < -50 || swipeVelocity < -300) {
      if (page === 0) setPage(1);
    } else if (swipeOffset > 50 || swipeVelocity > 300) {
      if (page === 1) setPage(0);
    }
  };

  const socialMiniatures = [
    { key: 'discord', icon: '/icons/whitesur/discord.svg' },
    { key: 'spotify', icon: '/icons/whitesur/spotify.svg' }
  ];

  const utilityMiniatures = [
    { key: 'skills', icon: '/icons/whitesur/settings.svg' },
    { key: 'experience', icon: '/icons/whitesur/notes.svg' },
    { key: 'vlc', icon: '/icons/whitesur/vlc.svg' }
  ];

  // Helper properties to implement iOS 18 icon styling/filters
  const getIconWrapperClass = (isFolder: boolean = false) => {
    const base = "w-14 h-14 active:scale-90 transition-transform cursor-pointer relative rounded-[14px] overflow-hidden flex items-center justify-center";
    if (isFolder) return "w-14 h-14 active:scale-90 transition-transform cursor-pointer relative";
    return base;
  };

  const getIconImageStyle = () => {
    if (iconAppearance === 'dark') {
      return { filter: 'brightness(0.72) contrast(1.15) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' };
    }
    if (iconAppearance === 'tinted') {
      return { filter: 'grayscale(1) brightness(0.85) contrast(1.1)' };
    }
    return {};
  };

  const tintColorsMap = {
    indigo: '#6366f1',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    blue: '#3b82f6'
  };

  const tintColorsOpaqueMap = {
    indigo: 'rgba(99, 102, 241, 0.75)',
    emerald: 'rgba(16, 185, 129, 0.75)',
    amber: 'rgba(245, 158, 11, 0.75)',
    rose: 'rgba(244, 63, 94, 0.75)',
    blue: 'rgba(59, 130, 246, 0.75)'
  };

  const renderIconOverlay = () => {
    if (iconAppearance !== 'tinted') return null;
    return (
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-color rounded-[14px] border border-white/10" 
        style={{ backgroundColor: tintColorsOpaqueMap[tintColor] }} 
      />
    );
  };

  return (
    <div className="h-full flex flex-col relative select-none z-10">
      <motion.div 
        drag={prefersReducedMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${page * 100}%` }}
        transition={prefersReducedMotion ? REDUCED_MOTION_TRANSITION : SPRING_PRESETS.page}
        className="flex-1 flex w-full h-full cursor-grab active:cursor-grabbing relative"
        style={{ touchAction: 'pan-y' }}
      >
        {/* PAGE 0: PREMIUM iOS HOME SETUP WITH WIDGETS AND APP GRID */}
        <div className="min-w-full h-full px-6 pt-5 pb-2 flex flex-col justify-between overflow-hidden">
          
          {/* 2-Column Widgets Grid */}
          <div className="grid grid-cols-2 gap-3.5 w-full select-none pointer-events-auto">

            {/* Spotify widget */}
            <button 
              onClick={() => setMobileActiveApp('spotify')}
              className="aspect-square rounded-[24px] overflow-hidden relative shadow-xl cursor-pointer active:scale-[0.96] transition-all duration-200 select-none w-full group/spotify"
            >
              {live.spotify ? (
                <>
                  <img 
                    src={live.spotify.albumArt || '/logo.png'} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover scale-125 blur-xl brightness-50 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-neutral-950 to-black" />
              )}
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-left z-10">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-400 shrink-0">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.41c-.18.18-.47.18-.66 0-1.89-1.89-4.88-2.22-8.08-1.49-.25.06-.5-.1-.56-.35-.06-.25.1-.5.35-.56 3.56-.81 6.84-.43 9.03 1.76.18.17.18.47.08.64zm1.23-2.73c-.23.23-.61.23-.84 0-2.17-2.17-5.48-2.61-9.06-1.52-.3.09-.61-.08-.7-.38-.09-.3.08-.61.38-.7 3.96-1.2 7.62-.7 10.09 1.77.22.23.22.61.13.83zm.11-2.91c-.28.28-.73.28-1.01 0-2.6-2.6-6.88-3.07-10.9-1.86-.35.1-.73-.1-.83-.45-.1-.35.1-.73.45-.83 4.49-1.35 9.22-.81 12.16 2.13.28.28.28.73.13 1.01z" />
                    </svg>
                    <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">Spotify</span>
                  </div>
                  {live.spotify && <span className="flex h-1.5 w-1.5 relative shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>}
                </div>

                <div className="min-w-0">
                  <h3 className="text-white text-[12px] font-extrabold leading-tight truncate">
                    {live.spotify ? live.spotify.song : (playlist[currentTrackIdx]?.name || 'Lofi Ambient Loop')}
                  </h3>
                  <p className="text-white/60 text-[9px] font-bold mt-0.5 truncate leading-none">
                    {live.spotify ? live.spotify.artist : (playlist[currentTrackIdx]?.artist || 'Santhosh Reddy')}
                  </p>
                  <div className="flex gap-[3px] items-center mt-2.5 h-3 select-none">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div 
                        key={idx} 
                        className={`w-0.5 rounded-[1px] bg-emerald-400 transition-all duration-300 ${
                          live.spotify ? 'animate-pulse h-3' : 'h-1'
                        }`} 
                        style={{
                          animationDelay: `${idx * 0.15}s`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>

            {/* Movie reel widget */}
            <button 
              onClick={() => setMobileActiveApp('vlc')}
              className="aspect-square rounded-[24px] overflow-hidden relative shadow-xl cursor-pointer active:scale-[0.96] transition-all duration-200 select-none w-full group/movies"
            >
              {live.trendingMovie ? (
                <>
                  <img 
                    src={live.trendingMovie.poster || ''} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover scale-110 filter brightness-[0.45] transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-left text-white z-10">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">Movies</span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/20 uppercase tracking-wide">
                        Trending
                      </span>
                    </div>
                    <div>
                      <div className="text-[12px] font-extrabold leading-tight truncate w-full">
                        {live.trendingMovie.title}
                      </div>
                      <div className="text-[8px] font-medium text-white/60 mt-0.5 truncate w-full">
                        Weekly Popular Release
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-neutral-950 to-black" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/5 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border border-white/10" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-left text-white z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">Movies</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold leading-tight">Loading...</div>
                      <div className="text-[8px] font-medium text-white/35 mt-1">Fetching trending films</div>
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* App Icons Grid */}
          <div className="grid grid-cols-4 gap-y-6 gap-x-3 w-full mt-5 content-start pointer-events-auto">
            {/* 1. Santhosh (Bio) */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('about')}
                className={getIconWrapperClass(false)}
              >
                <img src="/icons/whitesur/finder.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                {renderIconOverlay()}
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Santhosh
              </span>
            </div>

            {/* 2. Safari */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('safari')}
                className={getIconWrapperClass(false)}
              >
                <img src="/icons/whitesur/safari.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                {renderIconOverlay()}
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Safari
              </span>
            </div>

            {/* 3. Photos (Gallery) */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('projects')}
                className={getIconWrapperClass(false)}
              >
                <img src="/icons/whitesur/gallery.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                {renderIconOverlay()}
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Photos
              </span>
            </div>

            {/* 4. Social networks Folder */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setActiveFolder('social')}
                className={getIconWrapperClass(true)}
              >
                <div 
                  className="w-full h-full rounded-[15px] backdrop-blur-md p-2 flex items-center justify-center border shadow-lg transition-all"
                  style={{
                    backgroundColor: iconAppearance === 'tinted' ? `${tintColorsMap[tintColor]}22` : 'rgba(255,255,255,0.15)',
                    borderColor: iconAppearance === 'tinted' ? `${tintColorsMap[tintColor]}33` : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="grid grid-cols-3 gap-1 w-full h-full content-center items-center justify-items-center">
                    {socialMiniatures.map(app => (
                      <img 
                        key={app.key} 
                        src={app.icon} 
                        alt="" 
                        className="w-3 h-3 object-contain shrink-0" 
                        style={getIconImageStyle()} 
                      />
                    ))}
                    <div 
                      className="w-3 h-3 rounded-[3px] flex items-center justify-center text-[5px] text-white shrink-0 bg-gradient-to-tr from-purple-500 to-pink-500 animate-none"
                      style={getIconImageStyle()}
                    >
                      <Instagram size={5} />
                    </div>
                  </div>
                </div>
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border border-neutral-900 shadow-md">
                  22
                </span>
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Social
              </span>
            </div>

            {/* 5. VS Code */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('vscode')}
                className={getIconWrapperClass(false)}
              >
                <img src="/icons/whitesur/vscode.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                {renderIconOverlay()}
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                VS Code
              </span>
            </div>

            {/* 6. Utilities Folder */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setActiveFolder('utilities')}
                className={getIconWrapperClass(true)}
              >
                <div 
                  className="w-full h-full rounded-[15px] backdrop-blur-md p-2 flex items-center justify-center border shadow-lg transition-all"
                  style={{
                    backgroundColor: iconAppearance === 'tinted' ? `${tintColorsMap[tintColor]}22` : 'rgba(255,255,255,0.15)',
                    borderColor: iconAppearance === 'tinted' ? `${tintColorsMap[tintColor]}33` : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="grid grid-cols-3 gap-1 w-full h-full content-center items-center justify-items-center">
                    {utilityMiniatures.map(app => (
                      <img 
                        key={app.key} 
                        src={app.icon} 
                        alt="" 
                        className="w-3 h-3 object-contain shrink-0" 
                        style={getIconImageStyle()} 
                      />
                    ))}
                  </div>
                </div>
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Utilities
              </span>
            </div>

            {/* 7. AirDrop */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('spotify')}
                className={getIconWrapperClass(false)}
              >
                <div className="w-full h-full bg-gradient-to-tr from-sky-500 to-blue-400 flex items-center justify-center text-white shadow-md border border-sky-400/20" style={getIconImageStyle()}>
                  <Radio size={24} strokeWidth={2.5} className="shrink-0" />
                </div>
                {renderIconOverlay()}
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                AirDrop
              </span>
            </div>

            {/* 8. Gmail */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              <button 
                onClick={() => setMobileActiveApp('contact')}
                className={getIconWrapperClass(false)}
              >
                <img src="/icons/whitesur/mail.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                {renderIconOverlay()}
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border border-neutral-900 shadow-md">
                  1
                </span>
              </button>
              <span className="text-[10px] font-black text-center truncate w-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Gmail
              </span>
            </div>
          </div>

          {/* Search Pill */}
          <div className="flex justify-center w-full mt-4 select-none pointer-events-auto">
            <button 
              onClick={toggleSpotlight}
              className="px-3.5 py-1 rounded-full bg-white/10 border border-white/5 backdrop-blur-md flex items-center gap-1 text-[9px] text-white/70 font-black shadow-xs active:scale-95 transition-all cursor-pointer pointer-events-auto animate-none"
            >
              <Search size={9} className="text-white/50" />
              <span>Cerca</span>
            </button>
          </div>
        </div>

        {/* PAGE 1: iOS 18 CONTROL CENTER SCREEN */}
        <div className="min-w-full h-full px-6 pt-5 pb-4 flex flex-col justify-start gap-4 overflow-y-auto scroll-container pointer-events-auto select-none">
          
          {/* iOS 18 Control Center widgets block */}
          <div className="flex gap-4 items-stretch justify-start w-full">
            {/* 2x2 Connectivity widget */}
            <ConnectivityWidget />
            
            {/* Brightness & Volume Sliders (Vertical Pills) */}
            <div className="rounded-[24px] bg-black/40 border border-white/10 p-3.5 flex-1 flex gap-2.5 justify-around items-center shadow-lg">
              <VerticalSlider 
                min={15} 
                max={100} 
                value={brightness} 
                onChange={setBrightness} 
                icon={<Sun size={13} />} 
                label="Bright"
              />
              <VerticalSlider 
                min={0} 
                max={100} 
                value={volume} 
                onChange={setVolume} 
                icon={<Volume2 size={13} />} 
                label="Volume"
              />
            </div>
          </div>

          {/* Utility Buttons Row */}
          <div className="flex gap-3.5 w-full">
            <button 
              onClick={() => {
                document.body.style.filter = document.body.style.filter === 'grayscale(100%)' ? 'none' : 'grayscale(100%)';
              }}
              className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wide cursor-pointer text-white"
            >
              <Monitor size={12} />
              <span>MONOCHROME</span>
            </button>
            <button 
              onClick={() => {
                setVolume(50);
                setBrightness(85);
                document.body.style.filter = 'none';
              }}
              className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wide cursor-pointer text-white"
            >
              <RotateCcw size={12} />
              <span>RESET SYSTEM</span>
            </button>
          </div>

          {/* iOS 18 Icon Customization Panel */}
          <div className="rounded-[24px] bg-black/40 border border-white/10 p-4 flex flex-col gap-3.5 shadow-lg text-left text-white">
            <div className="text-[10px] font-black tracking-widest text-white/50 uppercase">
              ICON APPEARANCE (iOS 18)
            </div>
            
            <div className="flex gap-2">
              {(['light', 'dark', 'tinted'] as const).map((mode) => {
                const isActive = iconAppearance === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setIconAppearance(mode)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-black border-white shadow-md scale-102 font-extrabold' 
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {iconAppearance === 'tinted' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden flex flex-col gap-2 mt-1"
                >
                  <div className="text-[9px] font-black text-white/40 uppercase tracking-wider">
                    Select Tint Accent:
                  </div>
                  <div className="flex gap-2 justify-between items-center px-1">
                    {(['indigo', 'emerald', 'amber', 'rose', 'blue'] as const).map((color) => {
                      const isSelected = tintColor === color;
                      const colorClasses = {
                        indigo: 'bg-indigo-500',
                        emerald: 'bg-emerald-500',
                        amber: 'bg-amber-500',
                        rose: 'bg-rose-500',
                        blue: 'bg-blue-500'
                      };
                      return (
                        <button
                          key={color}
                          onClick={() => setTintColor(color)}
                          className={`w-6 h-6 rounded-full ${colorClasses[color]} flex items-center justify-center transition-all cursor-pointer ${
                            isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`Tint ${color}`}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Connected Music Player Widget */}
          <div className="rounded-[24px] bg-black/40 border border-white/10 p-4 flex gap-4 text-white shadow-lg items-center text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 shadow-md relative overflow-hidden flex items-center justify-center shrink-0 border border-white/10 select-none">
              <div className={`w-8 h-8 rounded-full border border-white/20 bg-black/35 flex items-center justify-center ${isMusicPlaying ? 'animate-spin-slow' : ''}`}>
                <Play size={10} fill="currentColor" className="text-white/60 ml-0.5 animate-none" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between h-20 py-1 min-w-0">
              <div>
                <div className="font-extrabold text-xs tracking-tight truncate leading-tight">
                  {playlist[currentTrackIdx]?.name || 'Ambient Loop'}
                </div>
                <div className="text-[9px] opacity-60 font-bold truncate mt-0.5">
                  {playlist[currentTrackIdx]?.artist || 'Santhosh Reddy'}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-1 select-none">
                <button 
                  onClick={prevTrack}
                  className="opacity-75 hover:opacity-100 transition-opacity active:scale-90 cursor-pointer text-white" 
                >
                  <SkipBack size={14} fill="currentColor" className="animate-none" />
                </button>
                <button 
                  onClick={togglePlayback}
                  className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  {isMusicPlaying ? <Pause size={12} fill="currentColor" className="animate-none" /> : <Play size={12} fill="currentColor" className="ml-0.5 animate-none" />}
                </button>
                <button 
                  onClick={nextTrack}
                  className="opacity-75 hover:opacity-100 transition-opacity active:scale-90 cursor-pointer text-white" 
                >
                  <SkipForward size={14} fill="currentColor" className="animate-none" />
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Calendar Widget */}
          <div className="rounded-[24px] bg-black/40 border border-white/10 p-4.5 text-white shadow-lg flex flex-col justify-between text-left">
            <div className="flex justify-between items-center border-b border-white/10 pb-1 text-[9px] font-black tracking-wider text-red-400">
              <span>{calendarMonthName}</span>
              <span className="opacity-60">{currentYear}</span>
            </div>
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5 text-center mt-1.5 text-[9px] font-bold">
              {weekdays.map((w, idx) => (
                <span key={`wd-${idx}`} className="opacity-40 text-[8px]">{w}</span>
              ))}
              {calendarDays.map((day, idx) => {
                const isToday = day === currentTime.getDate();
                return (
                  <span
                    key={`day-${idx}`}
                    className={`w-5 h-5 flex items-center justify-center rounded-full justify-self-center transition-all ${
                      isToday 
                        ? 'bg-red-500 text-white font-black shadow-sm scale-110' 
                        : day 
                        ? 'opacity-85 hover:bg-white/10 cursor-default' 
                        : 'pointer-events-none'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Page Dots Indicators */}
      <div className="flex justify-center gap-2 pb-4 h-5 shrink-0 select-none pointer-events-auto">
        <button 
          onClick={() => setPage(0)}
          className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
            page === 0 ? 'bg-white' : 'bg-white/35'
          }`}
          aria-label="App screen page 1"
        />
        <button 
          onClick={() => setPage(1)}
          className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
            page === 1 ? 'bg-white' : 'bg-white/35'
          }`}
          aria-label="Widgets screen page 2"
        />
      </div>

      {/* iOS Folder Fullscreen Overlay Modals */}
      <AnimatePresence>
        {activeFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center p-6 pointer-events-auto"
            onClick={() => setActiveFolder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={SPRING_PRESETS.window}
              className="w-[280px] rounded-[38px] bg-neutral-900/60 border border-white/10 p-6 flex flex-col justify-between backdrop-blur-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-center mb-6">
                <h2 className="text-xl font-black text-white select-none">
                  {activeFolder === 'social' ? 'Social Networking' : 'Utilities'}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-y-6 gap-x-3 justify-items-center">
                {activeFolder === 'social' ? (
                  <>
                    {/* Discord */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <button
                        onClick={() => {
                          setMobileActiveApp('discord');
                          setActiveFolder(null);
                        }}
                        className={getIconWrapperClass(false)}
                      >
                        <img src="/icons/whitesur/discord.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                        {renderIconOverlay()}
                      </button>
                      <span className="text-[9px] font-black text-white/80">Discord</span>
                    </div>

                    {/* Spotify */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <button
                        onClick={() => {
                          setMobileActiveApp('spotify');
                          setActiveFolder(null);
                        }}
                        className={getIconWrapperClass(false)}
                      >
                        <img src="/icons/whitesur/spotify.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                        {renderIconOverlay()}
                      </button>
                      <span className="text-[9px] font-black text-white/80">Spotify</span>
                    </div>

                    {/* Instagram */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <a
                        href="https://instagram.com/whoissanthoshh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={getIconWrapperClass(false)}
                      >
                        <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center text-white shadow-md" style={getIconImageStyle()}>
                          <Instagram size={22} className="animate-none" />
                        </div>
                        {renderIconOverlay()}
                      </a>
                      <span className="text-[9px] font-black text-white/80">Instagram</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Settings */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <button
                        onClick={() => {
                          setMobileActiveApp('skills');
                          setActiveFolder(null);
                        }}
                        className={getIconWrapperClass(false)}
                      >
                        <img src="/icons/whitesur/settings.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                        {renderIconOverlay()}
                      </button>
                      <span className="text-[9px] font-black text-white/80">Settings</span>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <button
                        onClick={() => {
                          setMobileActiveApp('experience');
                          setActiveFolder(null);
                        }}
                        className={getIconWrapperClass(false)}
                      >
                        <img src="/icons/whitesur/notes.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                        {renderIconOverlay()}
                      </button>
                      <span className="text-[9px] font-black text-white/80">Notes</span>
                    </div>

                    {/* VLC */}
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <button
                        onClick={() => {
                          setMobileActiveApp('vlc');
                          setActiveFolder(null);
                        }}
                        className={getIconWrapperClass(false)}
                      >
                        <img src="/icons/whitesur/vlc.svg" alt="" className="w-full h-full object-contain filter drop-shadow-md" style={getIconImageStyle()} />
                        {renderIconOverlay()}
                      </button>
                      <span className="text-[9px] font-black text-white/80">VLC Player</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
