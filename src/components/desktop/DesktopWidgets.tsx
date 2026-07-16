import React, { useState, useEffect } from 'react';
import { Sun, Volume2, Play, Pause, SkipForward, SkipBack, BatteryCharging, RotateCcw, Monitor } from 'lucide-react';
import { useLiveAPI } from '../../hooks/useLiveAPI';

interface DesktopWidgetsProps {
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
}

interface CustomSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  label: string;
}

// Pixel-perfect centered range slider replicating macOS Control Center style
const CustomSlider: React.FC<CustomSliderProps> = ({ min, max, value, onChange, icon, label }) => {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full text-[var(--text-primary)]">
      <div className="flex justify-between items-center text-[10px] font-extrabold opacity-60 mb-2 select-none">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="flex items-center h-6 relative select-none">
        {/* Left Icon */}
        <div className="opacity-70 mr-3 shrink-0">
          {icon}
        </div>
        
        {/* Slider Track System */}
        <div className="relative flex-1 h-3 flex items-center">
          {/* Background Track */}
          <div className="absolute inset-0 bg-[var(--text-primary)]/10 rounded-full" />
          
          {/* Active Fill Bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[var(--text-primary)]/70 rounded-full"
            style={{ width: `${percent}%` }}
          />
          
          {/* Knob / Thumb (doesn't get clipped at edges) */}
          <div 
            className="absolute w-4.5 h-4.5 rounded-full bg-white shadow-md border border-black/10 -translate-x-1/2 pointer-events-none"
            style={{ left: `${percent}%` }}
          />
          
          {/* Hidden Input overlaid to handle drags, clicks, keyboard events */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

export const DesktopWidgets: React.FC<DesktopWidgetsProps> = ({
  brightness,
  setBrightness,
  volume,
  setVolume,
  isMusicPlaying,
  musicProgress,
  currentTrackIdx,
  playlist,
  togglePlayback,
  nextTrack,
  prevTrack
}) => {
  const [time, setTime] = useState(new Date());
  const live = useLiveAPI();

  // Keep date/time updated in real-time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Analog Clock Hand Rotations ---
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secRotate = seconds * 6;
  const minRotate = minutes * 6 + seconds * 0.1;
  const hrRotate = (hours % 12) * 30 + minutes * 0.5;

  // --- Date Strings for the Big Central Widget ---
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dateStr = time.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  // --- Battery API Status Integration ---
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(true);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBatteryLevel(Math.round(batt.level * 100));
        setIsCharging(batt.charging);

        const onLevelChange = () => setBatteryLevel(Math.round(batt.level * 100));
        const onChargingChange = () => setIsCharging(batt.charging);

        batt.addEventListener('levelchange', onLevelChange);
        batt.addEventListener('chargingchange', onChargingChange);

        return () => {
          batt.removeEventListener('levelchange', onLevelChange);
          batt.removeEventListener('chargingchange', onChargingChange);
        };
      });
    }
  }, []);

  // --- Interactive Geolocation & Open-Meteo Weather ---
  const [weatherCity, setWeatherCity] = useState('NEW YORK');
  const [weatherTemp, setWeatherTemp] = useState(24);
  const [weatherCondition, setWeatherCondition] = useState('Sunny');

  useEffect(() => {
    async function fetchLocalWeather() {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (!ipRes.ok) throw new Error('IP API failed');
        const ipData = await ipRes.json();
        
        const city = ipData.city ? ipData.city.toUpperCase() : 'NEW YORK';
        const lat = ipData.latitude || 40.7128;
        const lon = ipData.longitude || -74.0060;

        setWeatherCity(city);

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!weatherRes.ok) throw new Error('Open-Meteo failed');
        const weatherData = await weatherRes.json();
        
        const current = weatherData.current_weather;
        if (current) {
          setWeatherTemp(Math.round(current.temperature));
          
          const code = current.weathercode;
          let cond = 'Sunny';
          if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
          else if (code >= 45 && code <= 48) cond = 'Foggy';
          else if (code >= 51 && code <= 67) cond = 'Rainy';
          else if (code >= 71 && code <= 77) cond = 'Snowy';
          else if (code >= 80 && code <= 82) cond = 'Showers';
          else if (code >= 95 && code <= 99) cond = 'Thunderstorm';
          
          setWeatherCondition(cond);
        }
      } catch (err) {
        console.warn('Could not fetch local weather, falling back:', err);
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) {
            const parts = tz.split('/');
            const city = parts[parts.length - 1].replace(/_/g, ' ').toUpperCase();
            setWeatherCity(city);
          }
        } catch (_) {}
      }
    }
    fetchLocalWeather();
  }, []);

  const formatTrackTime = (secondsTotal: number) => {
    const min = Math.floor(secondsTotal / 60);
    const sec = String(secondsTotal % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  // --- Calendar Grid Helper ---
  const currentYear = time.getFullYear();
  const currentMonth = time.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = time.toLocaleString('en-US', { month: 'long' }).toUpperCase();

  // --- Determine Track Metadata ---
  const hasLiveSpotify = !!live.spotify;
  const activeSong = hasLiveSpotify ? live.spotify!.song : (playlist[currentTrackIdx]?.name || "Lofi Chill Chords.mp3");
  const activeArtist = hasLiveSpotify ? live.spotify!.artist : (playlist[currentTrackIdx]?.artist || "santjsx");

  return (
    <div className="absolute inset-0 pt-16 pb-36 px-8 z-0 pointer-events-none flex flex-col justify-between overflow-hidden">
      {/* Top Section Grid for Widgets */}
      <div className="w-full flex justify-between gap-6">
        {/* LEFT COLUMN WIDGETS */}
        <div className="flex flex-col gap-6 pointer-events-auto">
          {/* Weather Widget */}
          <div className="w-56 h-[142px] rounded-[32px] glass p-5 flex flex-col justify-between text-[var(--text-primary)] shadow-lg">
            <div>
              <div className="text-[10px] font-extrabold tracking-wider opacity-60">{weatherCity}</div>
              <div className="text-4xl font-black mt-1 leading-none tracking-tight">{weatherTemp}°</div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs font-bold text-amber-500 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse block" />
                  {weatherCondition}
                </div>
                <div className="text-[10px] opacity-70 mt-0.5">H:{weatherTemp + 3}° L:{weatherTemp - 4}°</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-amber-500 dark:text-amber-300">
                <Sun size={32} className="animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Analog Clock Widget */}
          <div className="w-56 h-56 rounded-[32px] glass p-5 flex items-center justify-center text-[var(--text-primary)] shadow-lg">
            <div className="relative w-44 h-44 rounded-full border-2 border-[var(--border-color)] bg-[var(--text-primary)]/5 flex items-center justify-center shadow-inner">
              {/* Dial ticks */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-[10px] font-black opacity-60"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-64px) rotate(${-i * 30}deg)`,
                  }}
                >
                  {i === 0 ? 12 : i}
                </div>
              ))}
              {/* Clock center pin */}
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--text-primary)] z-30 shadow-md" />
              {/* Hour hand */}
              <div
                className="absolute w-1 h-12 bg-[var(--text-primary)] rounded-full origin-bottom bottom-[50%] z-10"
                style={{
                  transform: `rotate(${hrRotate}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
              {/* Minute hand */}
              <div
                className="absolute w-[3px] h-[18px] bg-[var(--text-primary)]/70 rounded-full origin-bottom bottom-[50%] z-20"
                style={{
                  transform: `rotate(${minRotate}deg)`,
                  transformOrigin: '50% 100%',
                  height: '62px',
                }}
              />
              {/* Second hand */}
              <div
                className="absolute w-[1px] h-[68px] bg-red-500 origin-bottom bottom-[50%] z-25"
                style={{
                  transform: `rotate(${secRotate}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
            </div>
          </div>

          {/* Quick Buttons Row */}
          <div className="w-56 flex gap-4">
            <button 
              onClick={() => setBrightness(100)}
              className="flex-1 h-12 rounded-2xl glass flex items-center justify-center gap-1.5 text-[var(--text-primary)] active:scale-95 transition-transform hover:bg-[var(--text-primary)]/10 cursor-pointer"
            >
              <Sun size={14} />
              <span className="text-[10px] font-black tracking-tight">BRIGHT</span>
            </button>
            <button 
              onClick={() => {
                document.body.style.filter = document.body.style.filter === 'grayscale(100%)' ? 'none' : 'grayscale(100%)';
              }}
              className="flex-1 h-12 rounded-2xl glass flex items-center justify-center gap-1.5 text-[var(--text-primary)] active:scale-95 transition-transform hover:bg-[var(--text-primary)]/10 cursor-pointer"
            >
              <Monitor size={14} />
              <span className="text-[10px] font-black tracking-tight">MONOCHROME</span>
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION COLUMN */}
        <div className="flex flex-col gap-6 items-center">
          {/* Top side-by-side row: Music Player + Sound/Display Sliders */}
          <div className="flex gap-6 pointer-events-auto">
            {/* Music Player Widget */}
            <div className="w-80 h-[142px] rounded-[32px] glass p-5 flex gap-4 text-[var(--text-primary)] shadow-lg">
              {/* Album Art Cover */}
              {hasLiveSpotify ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md shrink-0 border border-[var(--border-color)] relative">
                  <img 
                    src={live.spotify!.albumArt} 
                    alt="" 
                    className="w-full h-full object-cover select-none" 
                    draggable="false"
                  />
                  {/* Equalizer overlay */}
                  <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded-md flex gap-0.5 items-end h-4 select-none">
                    <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                    <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.4s]" />
                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 shadow-md relative overflow-hidden flex items-center justify-center shrink-0 border border-[var(--border-color)] select-none">
                  <div className={`w-8 h-8 rounded-full border border-white/20 bg-black/35 flex items-center justify-center ${isMusicPlaying ? 'animate-spin-slow' : ''}`}>
                    <Play size={10} fill="currentColor" className="text-white/60 ml-0.5" />
                  </div>
                </div>
              )}
              {/* Controls and Stats */}
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                  <div className="font-extrabold text-sm tracking-tight truncate leading-tight">{activeSong}</div>
                  <div className="text-[10px] opacity-60 font-semibold truncate mt-0.5">{activeArtist}</div>
                </div>
                {/* Timeline slider */}
                <div className="w-full">
                  <div className="relative w-full h-1 bg-[var(--text-primary)]/20 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full bg-[var(--text-primary)] transition-all duration-300 ${hasLiveSpotify ? 'w-[78%]' : ''}`}
                      style={{ width: hasLiveSpotify ? undefined : `${(musicProgress / 180) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] opacity-50 font-bold mt-1">
                    {hasLiveSpotify ? (
                      <>
                        <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5 font-black tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping inline-block mr-0.5" />
                          LIVE
                        </span>
                        <span className="opacity-75 truncate">Last.fm sync</span>
                      </>
                    ) : (
                      <>
                        <span>{formatTrackTime(musicProgress)}</span>
                        <span>-{formatTrackTime(180 - musicProgress)}</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Media controls */}
                <div className="flex items-center justify-center gap-6 shrink-0 mt-0.5">
                  <button 
                    onClick={prevTrack}
                    className="opacity-75 hover:opacity-100 transition-opacity active:scale-90 cursor-pointer animate-none" 
                    disabled={hasLiveSpotify}
                  >
                    <SkipBack size={16} fill="currentColor" className={hasLiveSpotify ? 'opacity-30' : ''} />
                  </button>
                  <button 
                    onClick={hasLiveSpotify ? undefined : togglePlayback}
                    className="w-8 h-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-color)] flex items-center justify-center active:scale-95 hover:scale-105 transition-all shadow-md shrink-0 cursor-pointer animate-none"
                    disabled={hasLiveSpotify}
                  >
                    {hasLiveSpotify ? (
                      <Volume2 size={14} fill="currentColor" />
                    ) : isMusicPlaying ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                  <button 
                    onClick={nextTrack}
                    className="opacity-75 hover:opacity-100 transition-opacity active:scale-90 cursor-pointer animate-none" 
                    disabled={hasLiveSpotify}
                  >
                    <SkipForward size={16} fill="currentColor" className={hasLiveSpotify ? 'opacity-30' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Display & Sound Slider controls */}
            <div className="w-80 h-[142px] rounded-[32px] glass p-5 flex flex-col justify-between text-[var(--text-primary)] shadow-lg">
              <CustomSlider 
                min={15} 
                max={100} 
                value={brightness} 
                onChange={setBrightness} 
                icon={<Sun size={14} className="opacity-70" />} 
                label="DISPLAY BRIGHTNESS"
              />
              <CustomSlider 
                min={0} 
                max={100} 
                value={volume} 
                onChange={setVolume} 
                icon={<Volume2 size={14} className="opacity-70" />} 
                label="SOUND VOLUME"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN WIDGETS */}
        <div className="flex flex-col gap-6 pointer-events-auto">
          {/* Calendar Widget */}
          <div className="w-56 min-h-[142px] h-auto rounded-[32px] glass p-4 pb-5 text-[var(--text-primary)] shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-1 text-[9px] font-black tracking-wider text-red-500 dark:text-red-400">
              <span>{monthName}</span>
              <span className="opacity-60">{currentYear}</span>
            </div>
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5 text-center mt-1.5 text-[9px] font-bold">
              {weekdays.map((w, idx) => (
                <span key={`wd-${idx}`} className="opacity-40 text-[8px]">{w}</span>
              ))}
              {calendarDays.map((day, idx) => {
                const isToday = day === time.getDate();
                return (
                  <span
                    key={`day-${idx}`}
                    className={`w-5 h-5 flex items-center justify-center rounded-full justify-self-center transition-all ${
                      isToday 
                        ? 'bg-red-500 text-white font-black shadow-sm scale-110' 
                        : day 
                        ? 'opacity-85 hover:bg-[var(--text-primary)]/10 cursor-default' 
                        : 'pointer-events-none'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Battery Status circles widget */}
          <div className="w-56 h-56 rounded-[32px] glass p-5 flex flex-col justify-between text-[var(--text-primary)] shadow-lg">
            <div className="text-[10px] font-extrabold tracking-wider opacity-60">BATTERY STATUS</div>
            
            <div className="flex justify-around items-center flex-1">
              {/* Laptop Battery */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r="32" className="stroke-[var(--text-primary)]/10 fill-none" strokeWidth="4" />
                    <circle 
                      cx="36" 
                      cy="36" 
                      r="32" 
                      className={`${isCharging ? 'stroke-emerald-500 dark:stroke-emerald-400' : 'stroke-[var(--text-primary)]'} fill-none transition-all duration-500`}
                      strokeWidth="4" 
                      strokeDasharray={201}
                      strokeDashoffset={201 - (201 * batteryLevel) / 100}
                    />
                  </svg>
                  <div className="flex flex-col items-center z-10">
                    {isCharging ? (
                      <BatteryCharging size={18} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
                    ) : (
                      <span className="text-[10px] font-extrabold">{batteryLevel}%</span>
                    )}
                  </div>
                </div>
                <span className="text-[9px] font-bold opacity-60">MacBook</span>
              </div>

              {/* Phone Battery (Mocked) */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r="32" className="stroke-[var(--text-primary)]/10 fill-none" strokeWidth="4" />
                    <circle 
                      cx="36" 
                      cy="36" 
                      r="32" 
                      className="stroke-[var(--text-primary)] fill-none" 
                      strokeWidth="4" 
                      strokeDasharray={201}
                      strokeDashoffset={201 - (201 * 72) / 100}
                    />
                  </svg>
                  <div className="z-10">
                    <span className="text-[10px] font-extrabold">72%</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold opacity-60">iPhone</span>
              </div>
            </div>
          </div>

          {/* Settings Shortcut Row */}
          <div className="w-56 flex gap-4">
            <button 
              onClick={() => {
                setVolume(50);
                setBrightness(85);
                if (isMusicPlaying) togglePlayback();
                document.body.style.filter = 'none';
              }}
              className="flex-1 h-12 rounded-2xl glass flex items-center justify-center gap-1.5 text-[var(--text-primary)] active:scale-95 transition-transform hover:bg-[var(--text-primary)]/10 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="text-[10px] font-black tracking-tight">RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Center Clock & Date Widget (Absolute Centered on wallpaper to prevent overlap) */}
      <div className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 select-none cursor-default z-0 pointer-events-auto">
        <div className="rounded-[32px] glass p-6 w-[420px] text-center shadow-xl">
          <h2 className="text-4xl font-black tracking-wider select-none leading-none mb-1 text-[var(--text-primary)] opacity-95">
            {dayName}
          </h2>
          <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] opacity-85 uppercase select-none mb-2">
            {dateStr}
          </div>
          <div className="text-sm font-semibold tracking-wider text-[var(--accent)] font-mono select-none">
            • {timeStr} •
          </div>
        </div>
      </div>
    </div>
  );
};
