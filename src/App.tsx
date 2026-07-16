import { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { sections, person } from './components/shared/sectionsData';

// Desktop Component Imports
import { MenuBar } from './components/desktop/MenuBar';
import { Dock } from './components/desktop/Dock';
import { DesktopWindow } from './components/desktop/Window';
import type { WindowState } from './components/desktop/Window';
import { Spotlight } from './components/desktop/Spotlight';
import { DesktopWidgets } from './components/desktop/DesktopWidgets';
import { LockScreen } from './components/desktop/LockScreen';

// Mobile Component Imports
import { StatusBar } from './components/mobile/StatusBar';
import { Springboard } from './components/mobile/Springboard';
import { AppView } from './components/mobile/AppView';

export default function App() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  // Play a premium pentatonic chime sweep upon unlocking
  const playUnlockChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5 (C major sweep)
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lp = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(1000, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.0);
      });
    } catch (err) {
      console.warn("Unlock sound could not be played:", err);
    }
  };
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('macos_portfolio_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Desktop Window State
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const zIndexRef = useRef(10);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Mobile State
  const [mobileActiveApp, setMobileActiveApp] = useState<string | null>(null);
  const [mobileHomePage, setMobileHomePage] = useState(0); // 0 = apps grid, 1 = widgets

  // System Sound & Screen Brightness State
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(50);

  // iOS 18 Customization states
  const [iconAppearance, setIconAppearance] = useState<'light' | 'dark' | 'tinted'>('light');
  const [tintColor, setTintColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'blue'>('indigo');
  const [islandState, setIslandState] = useState<{
    type: 'idle' | 'volume' | 'brightness' | 'music';
    value?: number;
    title?: string;
    artist?: string;
  }>({ type: 'idle' });

  const islandTimeoutRef = useRef<any>(null);

  const triggerIsland = (type: 'volume' | 'brightness' | 'music', val?: number, title?: string, artist?: string) => {
    if (islandTimeoutRef.current) clearTimeout(islandTimeoutRef.current);
    setIslandState({ type, value: val, title, artist });
    if (type !== 'music') {
      islandTimeoutRef.current = setTimeout(() => {
        setIslandState({ type: 'idle' });
      }, 2500);
    }
  };

  // Listen to volume/brightness/music changes to trigger Dynamic Island
  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (!isDesktop) {
      triggerIsland('volume', volume);
    }
  }, [volume, isDesktop]);

  const initialMountB = useRef(true);
  useEffect(() => {
    if (initialMountB.current) {
      initialMountB.current = false;
      return;
    }
    if (!isDesktop) {
      triggerIsland('brightness', brightness);
    }
  }, [brightness, isDesktop]);



  // Wallpaper State
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('macos_portfolio_wallpaper');
      return saved || '/wallpaper.png';
    }
    return '/wallpaper.png';
  });

  useEffect(() => {
    localStorage.setItem('macos_portfolio_wallpaper', currentWallpaper);
  }, [currentWallpaper]);

  // --- Unified Web Audio Synth Soundtrack Engine ---
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(12);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthTimeoutRef = useRef<any>(null);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);

  const playlist = useMemo(() => [
    {
      name: "Lofi Chill Chords.mp3",
      artist: "santjsx",
      album: "Creative Ambient Hacks",
      chords: [
        [130.81, 196.00, 261.63, 329.63, 493.88], // C3, G3, C4, E4, B4
        [110.00, 164.81, 220.00, 293.66, 392.00], // A2, E3, A3, D4, G4
        [87.31,  130.81, 174.61, 220.00, 349.23], // F2, C3, F3, A3, F4
        [98.00,  146.83, 196.00, 246.94, 293.66]  // G2, D3, G3, B3, D4
      ]
    },
    {
      name: "Late Night Study.mp3",
      artist: "Gabriel Pires",
      album: "Real Life Beats",
      chords: [
        [174.61, 220.00, 261.63, 349.23, 523.25], // F3, A3, C4, F4, C5 (Fmaj9)
        [196.00, 246.94, 293.66, 392.00, 587.33], // G3, B3, D4, G4, D5 (G6)
        [164.81, 196.00, 246.94, 329.63, 493.88], // E3, G3, B3, E4, B4 (Em7)
        [110.00, 164.81, 220.00, 293.66, 392.00]  // A2, E3, A3, D4, G4 (Am9)
      ]
    },
    {
      name: "Morning Coffee.mp3",
      artist: "Portfolio Soundtrack",
      album: "OS Themes",
      chords: [
        [130.81, 164.81, 196.00, 261.63, 329.63], // C3, E3, G3, C4, E4
        [87.31,  130.81, 174.61, 220.00, 261.63], // F2, C3, F3, A3, C4
        [130.81, 164.81, 196.00, 261.63, 329.63], // C3, E3, G3, C4, E4
        [98.00,  146.83, 196.00, 246.94, 293.66]  // G2, D3, G3, B3, D4
      ]
    }
  ], []);

  useEffect(() => {
    if (!isDesktop) {
      if (isMusicPlaying) {
        const track = playlist[currentTrackIdx];
        triggerIsland('music', undefined, track?.name || 'Ambient Loop', track?.artist || 'Santhosh Reddy');
      } else {
        setIslandState({ type: 'idle' });
      }
    }
  }, [isMusicPlaying, currentTrackIdx, isDesktop]);

  // Update gain node volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up
  useEffect(() => {
    return () => {
      if (synthTimeoutRef.current) clearTimeout(synthTimeoutRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Timer for track progress
  useEffect(() => {
    let timer: any;
    if (isMusicPlaying) {
      timer = setInterval(() => {
        setMusicProgress(p => (p >= 180 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMusicPlaying]);

  // Restart loop if track changes while playing
  useEffect(() => {
    if (isMusicPlaying) {
      if (synthTimeoutRef.current) clearTimeout(synthTimeoutRef.current);
      startSynthLoop();
    }
  }, [currentTrackIdx]);

  const startSynthLoop = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let step = 0;
    const playAmbientBeep = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
      const t = ctx.currentTime;
      const track = playlist[currentTrackIdx];
      const chords = track.chords;
      const chord = chords[step % chords.length];

      chord.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const nodeGain = ctx.createGain();
        const lpFilter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(550 - index * 30, t);

        nodeGain.gain.setValueAtTime(0, t);
        nodeGain.gain.linearRampToValueAtTime(0.08, t + 0.5);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);

        osc.connect(lpFilter);
        lpFilter.connect(nodeGain);
        nodeGain.connect(gainNodeRef.current!);

        osc.start(t);
        osc.stop(t + 4.0);
      });

      step++;
      synthTimeoutRef.current = setTimeout(playAmbientBeep, 4000);
    };

    playAmbientBeep();
  };

  const togglePlayback = () => {
    if (isMusicPlaying) {
      setIsMusicPlaying(false);
      if (synthTimeoutRef.current) clearTimeout(synthTimeoutRef.current);
    } else {
      setIsMusicPlaying(true);
      startSynthLoop();
    }
  };

  const nextTrack = () => {
    setCurrentTrackIdx(prev => (prev + 1) % playlist.length);
    setMusicProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIdx(prev => (prev - 1 + playlist.length) % playlist.length);
    setMusicProgress(0);
  };

  // Mouse Parallax Wallpaper Offset
  const [wallpaperOffset, setWallpaperOffset] = useState({ x: 0, y: 0 });

  // Viewport resize listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Sync dark mode to HTML class and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('macos_portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('macos_portfolio_theme', 'light');
    }
  }, [isDarkMode]);

  // Spotlight Keyboard Shortcut (Cmd+K / Ctrl+K) and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k' || e.key === ' ')) {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
      }
      
      if (e.key === 'Escape') {
        if (spotlightOpen) {
          setSpotlightOpen(false);
        } else if (isDesktop && activeWindowId) {
          // Esc closes the currently focused window
          closeWindow(activeWindowId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spotlightOpen, isDesktop, activeWindowId]);

  // Handle subtle wallpaper parallax drift on mousemove
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop) return;
    const { clientX, clientY } = e;
    // Translate offset max ~10px
    const x = ((clientX / window.innerWidth) - 0.5) * -15;
    const y = ((clientY / window.innerHeight) - 0.5) * -15;
    setWallpaperOffset({ x, y });
  };

  // Window Focus Handler
  const focusWindow = (id: string) => {
    const nextZ = ++zIndexRef.current;
    setOpenWindows(wins => wins.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
    setActiveWindowId(id);
  };

  // Window Open Handler
  const openWindow = (sectionKey: string, originRect?: DOMRect | null) => {
    const existing = openWindows.find(w => w.sectionKey === sectionKey);
    if (existing) {
      if (existing.minimized) {
        setOpenWindows(wins => wins.map(w => w.id === existing.id ? { ...w, minimized: false } : w));
      }
      focusWindow(existing.id);
      return;
    }

    const id = `win_${Date.now()}`;
    const offset = (openWindows.length * 24) % 120;
    let defaultWidth = 700;
    let defaultHeight = 500;

    if (sectionKey === 'vscode') {
      defaultWidth = 780;
      defaultHeight = 540;
    } else if (sectionKey === 'spotify') {
      defaultWidth = 760;
      defaultHeight = 520;
    } else if (sectionKey === 'about') {
      defaultWidth = 740;
      defaultHeight = 500;
    } else if (sectionKey === 'projects') {
      defaultWidth = 760;
      defaultHeight = 520;
    } else if (sectionKey === 'experience') {
      defaultWidth = 720;
      defaultHeight = 500;
    } else if (sectionKey === 'safari') {
      defaultWidth = 760;
      defaultHeight = 520;
    } else if (sectionKey === 'vlc') {
      defaultWidth = 560;
      defaultHeight = 400;
    } else if (sectionKey === 'skills') {
      defaultWidth = 720;
      defaultHeight = 500;
    }
    
    // Default cascades from viewport center
    const x = (window.innerWidth - defaultWidth) / 2 + offset;
    const y = (window.innerHeight - defaultHeight) / 2 + offset;
    const nextZ = ++zIndexRef.current;

    const newWin: WindowState = {
      id,
      sectionKey,
      x: Math.max(0, Math.min(x, window.innerWidth - 80)),
      y: Math.max(28, Math.min(y, window.innerHeight - 80)),
      width: defaultWidth,
      height: defaultHeight,
      zIndex: nextZ,
      minimized: false,
      maximized: false,
      origin: originRect || null
    };

    setOpenWindows(wins => [...wins, newWin]);
    setActiveWindowId(id);
  };

  // Window Close Handler
  const closeWindow = (id: string) => {
    setOpenWindows(wins => wins.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  };

  // Window Minimize Toggle Handler
  const toggleMinimize = (id: string, iconRect?: DOMRect | null) => {
    setOpenWindows(wins => wins.map(w => {
      if (w.id === id) {
        const nextMinimized = !w.minimized;
        return {
          ...w,
          minimized: nextMinimized,
          origin: iconRect || w.origin
        };
      }
      return w;
    }));
    
    // Focus next available window or null if none
    if (activeWindowId === id) {
      const remaining = openWindows.filter(w => w.id !== id && !w.minimized);
      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  // Window Maximize Toggle Handler
  const toggleMaximize = (id: string) => {
    setOpenWindows(wins => wins.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  };

  const updateWindowSize = (id: string, width: number, height: number) => {
    setOpenWindows(wins => wins.map(w => w.id === id ? { ...w, width, height } : w));
  };

  const updateWindowPos = (id: string, x: number, y: number) => {
    setOpenWindows(wins => wins.map(w => w.id === id ? { ...w, x, y } : w));
  };

  // Menu bar handler helpers
  const closeActiveWindow = () => {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  };

  const toggleGrayscale = () => {
    document.body.style.filter = document.body.style.filter === 'grayscale(100%)' ? 'none' : 'grayscale(100%)';
  };

  const resetSystem = () => {
    setVolume(50);
    setBrightness(85);
    setIsMusicPlaying(false);
    document.body.style.filter = 'none';
    setCurrentWallpaper('/wallpaper.png');
  };

  const toggleSpotlight = () => {
    setSpotlightOpen(prev => !prev);
  };

  const minimizeActiveWindow = () => {
    if (activeWindowId) {
      const win = openWindows.find(w => w.id === activeWindowId);
      if (win) {
        const dockIcon = document.getElementById(`dock-icon-${win.sectionKey}`);
        toggleMinimize(win.id, dockIcon ? dockIcon.getBoundingClientRect() : null);
      }
    }
  };

  const maximizeActiveWindow = () => {
    if (activeWindowId) {
      toggleMaximize(activeWindowId);
    }
  };

  const minimizeAll = () => {
    setOpenWindows(wins => wins.map(w => ({ ...w, minimized: true })));
  };

  const bringAllToFront = () => {
    setOpenWindows(wins => wins.map((w, idx) => ({ ...w, zIndex: 10 + idx })));
  };

  // Compute active title for MenuBar
  const activeTitle = useMemo(() => {
    if (!activeWindowId) return "Santhosh";
    const win = openWindows.find(w => w.id === activeWindowId && !w.minimized);
    if (!win) return "Santhosh";
    const sec = sections.find(s => s.key === win.sectionKey);
    return sec ? (sec.key === 'about' ? 'Santhosh' : sec.title) : "Santhosh";
  }, [activeWindowId, openWindows]);

  return (
    <div 
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax Wallpaper Layer */}
      <div 
        className="absolute inset-0 w-[102%] h-[102%] -left-[1%] -top-[1%] wallpaper-bg"
        style={{
          background: currentWallpaper.startsWith('linear-gradient') ? currentWallpaper : `url(${currentWallpaper}) center/cover no-repeat`,
          transform: isDesktop 
            ? `translate3d(${wallpaperOffset.x}px, ${wallpaperOffset.y}px, 0) scale(1.02)` 
            : 'none',
          transition: isDesktop ? 'transform 0.1s ease-out, background 0.3s ease' : 'background 0.3s ease'
        }}
      />

      {/* Conditional UI rendering */}
      {isDesktop ? (
        // macOS Desktop Layout
        <div className="relative w-full h-full pt-7 pb-20 select-none">
          <MenuBar 
            activeTitle={activeTitle} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            openWindow={openWindow}
            closeActiveWindow={closeActiveWindow}
            activeWindowId={activeWindowId}
            toggleGrayscale={toggleGrayscale}
            resetSystem={resetSystem}
            toggleSpotlight={toggleSpotlight}
            minimizeActiveWindow={minimizeActiveWindow}
            maximizeActiveWindow={maximizeActiveWindow}
            minimizeAll={minimizeAll}
            bringAllToFront={bringAllToFront}
            lockScreen={() => setIsLocked(true)}
          />

          {/* Desktop Widgets Backdrop */}
          <DesktopWidgets 
            brightness={brightness} 
            setBrightness={setBrightness} 
            volume={volume} 
            setVolume={setVolume} 
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
          />

          {/* Windows Layer */}
          <div className="absolute inset-0 pt-7 pointer-events-none z-10 overflow-hidden">
            <AnimatePresence>
              {openWindows.map(win => (
                <DesktopWindow 
                  key={win.id}
                  win={win}
                  sections={sections}
                  activeWindowId={activeWindowId}
                  closeWindow={closeWindow}
                  toggleMinimize={toggleMinimize}
                  toggleMaximize={toggleMaximize}
                  updateWindowPos={updateWindowPos}
                  updateWindowSize={updateWindowSize}
                  focusWindow={focusWindow}
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
              ))}
            </AnimatePresence>
          </div>

          <Dock 
            openWindows={openWindows} 
            openWindow={openWindow} 
            toggleMinimize={toggleMinimize}
            activeWindowId={activeWindowId}
          />

          <AnimatePresence>
            {spotlightOpen && (
              <Spotlight 
                setSpotlightOpen={setSpotlightOpen} 
                openWindow={openWindow} 
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        // iOS Mobile Layout
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-neutral-950">
          {/* Dynamic iOS Setup Background Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 50% 68%, rgba(249, 115, 22, 0.42) 0%, rgba(0, 0, 0, 0) 58%)'
          }} />
          
          <StatusBar 
            islandState={islandState} 
            isMusicPlaying={isMusicPlaying} 
          />
          
          {/* Springboard App Container */}
          <div className="flex-1 pt-12 relative z-10">
            <Springboard 
              setMobileActiveApp={setMobileActiveApp} 
              page={mobileHomePage} 
              setPage={setMobileHomePage} 
              toggleSpotlight={() => setSpotlightOpen(true)}
              brightness={brightness}
              setBrightness={setBrightness}
              volume={volume}
              setVolume={setVolume}
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
              iconAppearance={iconAppearance}
              setIconAppearance={setIconAppearance}
              tintColor={tintColor}
              setTintColor={setTintColor}
            />
          </div>

          {/* Bottom Dock (Mobile Static) */}
          <div className="pb-8 pt-4 px-4 h-28 shrink-0 relative z-10 select-none">
            <div className="glass rounded-[28px] p-4 flex justify-around items-center h-full border border-white/10 shadow-lg">
              {/* Phone Icon */}
              <button 
                onClick={() => setMobileActiveApp('contact')}
                className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform cursor-pointer relative"
                aria-label="Open Phone (Contact)"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center text-white shadow-md">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="shrink-0">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.1 15.1 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.4 11.4 0 0 1 8.5 4c0-.56-.44-1-1-1H4c-.56 0-1 .44-1 1C3 12.84 9.16 19 18 19c.56 0 1-.44 1-1v-2.5c0-.56-.44-1-1-1z" />
                  </svg>
                </div>
                {/* Red notification bubble 1+ */}
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border border-neutral-900 shadow-md">
                  1+
                </span>
              </button>

              {/* WhatsApp Icon */}
              <button 
                onClick={() => setMobileActiveApp('discord')}
                className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                aria-label="Open WhatsApp (Discord)"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              </button>

              {/* Camera Icon */}
              <button 
                onClick={() => setMobileActiveApp('projects')}
                className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                aria-label="Open Camera (Gallery)"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-neutral-200 to-neutral-400 flex items-center justify-center text-neutral-800 shadow-md border border-neutral-300">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </button>

              {/* Chrome/Safari Compass Icon */}
              <button 
                onClick={() => setMobileActiveApp('safari')}
                className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                aria-label="Open Safari (Browser)"
              >
                <img 
                  src="/icons/whitesur/safari.svg" 
                  alt="" 
                  className="w-full h-full object-contain filter drop-shadow-md select-none" 
                  draggable="false"
                />
              </button>
            </div>
          </div>

          {/* iOS App Fullscreen Window */}
          <AnimatePresence>
            {mobileActiveApp && (
              <AppView 
                key={mobileActiveApp}
                sectionKey={mobileActiveApp}
                closeApp={() => setMobileActiveApp(null)}
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
            )}
          </AnimatePresence>

          {/* iOS Spotlight Search Overlay */}
          <AnimatePresence>
            {spotlightOpen && (
              <Spotlight 
                setSpotlightOpen={setSpotlightOpen} 
                openWindow={(key) => {
                  setMobileActiveApp(key);
                  setSpotlightOpen(false);
                }} 
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Lock Screen Overlay */}
      <AnimatePresence>
        {isLocked && (
          <LockScreen 
            onUnlock={() => {
              setIsLocked(false);
              playUnlockChime();
            }}
            currentWallpaper={currentWallpaper}
            developerPhoto={person.photo}
            developerName={person.name}
            onSleep={() => setBrightness(15)}
            onRestart={() => {
              setIsLocked(true);
              setBrightness(85);
              playUnlockChime();
            }}
            isFlashlightOn={brightness === 100}
            onToggleFlashlight={() => {
              setBrightness(prev => prev === 100 ? 15 : 100);
            }}
            onCameraLaunch={() => {
              setIsLocked(false);
              playUnlockChime();
              if (isDesktop) {
                openWindow('projects');
              } else {
                setMobileActiveApp('projects');
              }
            }}
            isDesktop={isDesktop}
          />
        )}
      </AnimatePresence>

      {/* Screen Brightness Dimming Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[99999] bg-black transition-opacity duration-150"
        style={{ opacity: Math.max(0, Math.min(0.85, (100 - brightness) / 100 * 0.75)) }}
      />
    </div>
  );
}
