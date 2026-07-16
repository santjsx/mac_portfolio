import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Globe, ExternalLink, 
  Folder, FileText, FileCode, Link as LinkIcon,
  ChevronLeft, ChevronRight, Image as ImageIcon,
  CheckSquare, Square, Send, Settings, Sparkles, BookOpen, X,
  Lock, SkipBack, SkipForward, Play, Pause, Volume2
} from 'lucide-react';
import { sections, person } from './sectionsData';
import { useLiveAPI } from '../../hooks/useLiveAPI';

// --- Safari Simulated Sandbox Helper Subcomponents ---

const PomodoroTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    let t: any;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);
  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };
  return (
    <div className="bg-neutral-900 text-white p-4 rounded-xl flex flex-col items-center gap-3">
      <span className="text-[8px] font-black text-white/50 tracking-wider">FOCUS TIMER MOCK</span>
      <div className="text-3xl font-black font-mono">{format(seconds)}</div>
      <div className="flex gap-2">
        <button onClick={() => setIsRunning(!isRunning)} className="px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded-md text-[10px] font-bold text-white transition-all cursor-pointer">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setSeconds(1500); setIsRunning(false); }} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[10px] font-bold text-white transition-all cursor-pointer">
          Reset
        </button>
      </div>
    </div>
  );
};

const CypherSandbox: React.FC = () => {
  const [text, setText] = useState('');
  const encryptText = (str: string) => {
    if (!str) return 'Enter plain text above...';
    try {
      return btoa(str).split('').reverse().join('').substring(0, 16) + '== (AES-GCM mock)';
    } catch {
      return 'Encryption error';
    }
  };
  return (
    <div className="bg-neutral-900 text-white p-4 rounded-xl flex flex-col gap-2">
      <span className="text-[8px] font-black text-white/50 tracking-wider">AES-GCM CRYPTO WORKBENCH</span>
      <input 
        type="text" 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Type raw message here..."
        className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-xs outline-none text-white focus:border-green-500"
      />
      <div className="bg-black/40 p-2.5 rounded-lg text-[9px] font-mono break-all text-green-400">
        Ciphertext: {encryptText(text)}
      </div>
    </div>
  );
};

const PDFStudioSandbox: React.FC = () => {
  const [merging, setMerging] = useState(false);
  const [success, setSuccess] = useState(false);
  const triggerMerge = () => {
    setMerging(true);
    setSuccess(false);
    setTimeout(() => {
      setMerging(false);
      setSuccess(true);
    }, 1500);
  };
  return (
    <div className="bg-neutral-900 text-white p-4 rounded-xl flex flex-col gap-2.5">
      <span className="text-[8px] font-black text-white/50 tracking-wider">DOCUMENT MERGER INDEX</span>
      <div className="flex gap-2 text-[9px] font-bold select-none justify-center">
        <span className="bg-white/10 px-2.5 py-1 rounded">📄 resume_intro.pdf</span>
        <span className="bg-white/10 px-2.5 py-1 rounded">📄 certifications.pdf</span>
      </div>
      <button 
        onClick={triggerMerge} 
        disabled={merging}
        className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 text-white cursor-pointer"
      >
        {merging ? 'Compiling Pages...' : 'Merge PDF Documents'}
      </button>
      {merging && <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/2 animate-pulse" /></div>}
      {success && <div className="text-[9px] text-green-400 font-bold text-center">✓ merged_output.pdf generated successfully!</div>}
    </div>
  );
};

const FinanceSandbox: React.FC = () => {
  const [balance, setBalance] = useState(2450);
  const [transactions, setTransactions] = useState([
    { desc: 'Contract Phase Payment', val: 1200, type: 'in' },
    { desc: 'Vercel Server Tier', val: -45, type: 'out' }
  ]);
  const addTx = () => {
    setBalance(b => b - 80);
    setTransactions(t => [...t, { desc: 'Premium Domain Renewal', val: -80, type: 'out' }]);
  };
  return (
    <div className="bg-neutral-900 text-white p-4 rounded-xl flex flex-col gap-2">
      <span className="text-[8px] font-black text-white/50 tracking-wider">BALANCE LEDGER</span>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-black font-mono">${balance}</div>
        <button onClick={addTx} className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 rounded text-[9px] font-bold text-white cursor-pointer">
          + Add Expense
        </button>
      </div>
      <div className="space-y-1 mt-1">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex justify-between items-center text-[9px] opacity-80 border-t border-white/5 pt-1">
            <span>{tx.desc}</span>
            <span className={tx.type === 'in' ? 'text-green-400 font-bold' : 'text-rose-400 font-bold'}>
              {tx.type === 'in' ? '+' : ''}${tx.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TerminalSandbox: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(['Welcome to Hybrid OS terminal v2.', 'Type "help" or "neofetch".']);
  const handleCmd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.toLowerCase().trim();
    let res = '';
    if (cmd === 'help') {
      res = 'Available commands: help, neofetch, clear';
    } else if (cmd === 'neofetch') {
      res = 'OS: Hybrid OS v2.0\nShell: bash\nMemory: 8192MB / 16384MB';
    } else if (cmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } else {
      res = `bash: command not found: ${cmd}`;
    }
    setLogs(prev => [...prev, `$ ${input}`, res]);
    setInput('');
  };
  return (
    <div className="bg-black border border-white/10 text-xs font-mono p-3 rounded-xl flex flex-col gap-2 text-left h-36">
      <div className="flex-grow overflow-y-auto scroll-container text-[9px] text-green-400 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap">{log}</div>
        ))}
      </div>
      <form onSubmit={handleCmd} className="flex border-t border-white/10 pt-2 shrink-0 select-text">
        <span className="text-green-500 mr-1.5">$</span>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          className="bg-transparent border-none outline-none text-[9px] text-white flex-grow font-mono"
        />
      </form>
    </div>
  );
};


interface SectionContentProps {
  sectionKey: string;
  isFocused?: boolean;
  isMusicPlaying?: boolean;
  setIsMusicPlaying?: (val: boolean) => void;
  musicProgress?: number;
  setMusicProgress?: (val: number) => void;
  currentTrackIdx?: number;
  setCurrentTrackIdx?: (val: number) => void;
  playlist?: any[];
  togglePlayback?: () => void;
  nextTrack?: () => void;
  prevTrack?: () => void;
  volume?: number;
  setVolume?: (val: number) => void;
  currentWallpaper?: string;
  setCurrentWallpaper?: (val: string) => void;
}

type TabType = 'bio' | 'system' | 'links';

export const SectionContent: React.FC<SectionContentProps> = ({ 
  sectionKey, 
  isMusicPlaying = false,
  musicProgress = 0,
  setMusicProgress,
  currentTrackIdx = 0,
  setCurrentTrackIdx,
  playlist = [],
  togglePlayback,
  nextTrack,
  prevTrack,
  volume = 50,
  setVolume,
  currentWallpaper = '/wallpaper.png',
  setCurrentWallpaper
}) => {
  const section = sections.find(s => s.key === sectionKey);
  const contactData = sections.find(s => s.key === 'contact')?.data || {};

  if (!section) return null;

  switch (sectionKey) {
    case 'about': {
      const live = useLiveAPI();
      const [activeTab, setActiveTab] = useState<TabType>('bio');

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'online': return 'bg-emerald-500';
          case 'idle': return 'bg-amber-500';
          case 'dnd': return 'bg-rose-500';
          default: return 'bg-slate-400';
        }
      };

      // Tab configuration
      const tabs = [
        { id: 'bio' as TabType, label: 'Biography', icon: <FileText size={13} className="text-blue-500" /> },
        { id: 'system' as TabType, label: 'System State', icon: <FileCode size={13} className="text-amber-500" /> },
        { id: 'links' as TabType, label: 'Quick Links', icon: <LinkIcon size={13} className="text-purple-500" /> }
      ];

      return (
        <div className="flex h-full flex-row items-stretch select-none bg-[var(--surface-color)]/25 leading-normal relative text-[var(--text-primary)] overflow-hidden">
          
          {/* FINDER SIDEBAR (Desktop only) */}
          <div className="w-44 border-r border-[var(--border-color)] bg-black/10 dark:bg-black/20 p-3 flex flex-col gap-4 select-none shrink-0 hidden md:flex">
            <div>
              <h5 className="px-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] opacity-50 uppercase mb-2">Favorites</h5>
              <div className="flex flex-col gap-0.5">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[var(--accent)] text-white font-extrabold' 
                        : 'hover:bg-white/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="px-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] opacity-50 uppercase mb-2">Tags</h5>
              <div className="flex flex-col gap-1.5 px-2">
                <span className="text-xs font-semibold flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Core</span>
                <span className="text-xs font-semibold flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Active</span>
                <span className="text-xs font-semibold flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Frontend</span>
              </div>
            </div>
          </div>

          {/* MAIN FINDER WINDOW PANE */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-color)]/10">
            
            {/* FINDER TOOLBAR */}
            <div className="h-11 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Back / Forward Controls */}
                <div className="flex items-center gap-0.5">
                  <button 
                    disabled={activeTab === 'bio'}
                    onClick={() => setActiveTab(activeTab === 'links' ? 'system' : 'bio')}
                    className={`p-1 rounded-lg transition-colors ${
                      activeTab === 'bio' ? 'opacity-35 cursor-default' : 'hover:bg-white/5 active:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    disabled={activeTab === 'links'}
                    onClick={() => setActiveTab(activeTab === 'bio' ? 'system' : 'links')}
                    className={`p-1 rounded-lg transition-colors ${
                      activeTab === 'links' ? 'opacity-35 cursor-default' : 'hover:bg-white/5 active:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                {/* Finder Breadcrumb Active Item */}
                <span className="text-xs font-black tracking-tight text-[var(--text-primary)]">
                  {tabs.find(t => t.id === activeTab)?.label}
                </span>
              </div>
            </div>

            {/* Mobile About Tabs Slider */}
            <div className="flex gap-2 p-3 overflow-x-auto scroll-container shrink-0 border-b border-[var(--border-color)] md:hidden select-none bg-black/5 dark:bg-black/10">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-3xs' 
                        : 'bg-[var(--surface-opaque)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANELS CONTENT AREA */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto scroll-container select-text leading-normal">
              
              {/* TAB 1: BIOGRAPHY */}
              {activeTab === 'bio' && (
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                  {/* Photo & Availability */}
                  <div className="flex flex-col items-center gap-3 shrink-0 select-none">
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-2xl bg-[var(--accent)] opacity-20 blur-md" />
                      <img 
                        src={person.photo} 
                        alt={person.name} 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-[var(--border-color)] relative z-10 object-cover shadow-sm" 
                        draggable="false"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-black text-sm text-[var(--text-primary)] leading-none">{person.name}</h3>
                      <div className="text-[10px] text-green-500 font-bold flex items-center gap-1 justify-center mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {person.availability}
                      </div>
                    </div>
                  </div>

                  {/* Bio Description details */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-[var(--accent)] uppercase">About Me</span>
                      <h2 className="text-base font-black text-[var(--text-primary)]">{person.role}</h2>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold leading-relaxed">
                      {person.bio}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-color)]">
                      <div>
                        <span className="block text-[8px] font-black text-[var(--text-secondary)] opacity-55 tracking-wider uppercase mb-0.5">Location</span>
                        <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1"><MapPin size={11} className="text-[var(--accent)]" /> {person.location}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-black text-[var(--text-secondary)] opacity-55 tracking-wider uppercase mb-0.5">Website</span>
                        <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1"><Globe size={11} className="text-[var(--accent)]" /> {person.domain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SYSTEM STATE (APIs widgets) */}
              {activeTab === 'system' && (
                <div className="space-y-3.5 max-w-lg mx-auto">
                  {/* Discord Lanyard Presence */}
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-opaque)] p-4 flex items-center justify-between shadow-3xs min-h-[76px] gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center shrink-0">
                        <img src="/skills_logos/discord.svg" alt="" className="w-4 h-4 object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                          <span>Discord Presence</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(live.discordStatus)}`} />
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold">@{person.handle}</div>
                      </div>
                    </div>
                    <div className="text-right text-xs font-extrabold text-[var(--text-primary)] min-w-0 flex-1 flex justify-end">
                      {live.discordActivity ? (
                        <div className="max-w-[240px] truncate bg-[var(--bg-color)]/25 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] text-[10px] font-semibold text-left">
                          <span className="font-black text-[8px] text-[var(--accent)] block uppercase tracking-wider mb-0.5">Active Now</span>
                          <span className="truncate block leading-tight">{live.discordActivity}</span>
                        </div>
                      ) : (
                        <span className="text-[var(--text-secondary)] opacity-60 font-bold capitalize">{live.discordStatus}</span>
                      )}
                    </div>
                  </div>

                  {/* Astros space counter */}
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-opaque)] p-4 flex items-center justify-between shadow-3xs min-h-[76px] gap-4">
                    <div>
                      <div className="text-xs font-black text-[var(--text-primary)]">Humans in Orbit (ISS)</div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-bold">Real-time Space Metric</div>
                    </div>
                    <div className="flex items-center gap-2 select-none shrink-0">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">Astronaut headcount:</span>
                      <span className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono leading-none">
                        {live.spaceHeadcount !== null ? live.spaceHeadcount : '--'}
                      </span>
                    </div>
                  </div>

                  {/* TMDb trending movie */}
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-opaque)] p-3.5 flex items-center justify-between shadow-3xs min-h-[76px] gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {live.trendingMovie ? (
                        <>
                          <img 
                            src={live.trendingMovie.poster} 
                            alt="" 
                            className="w-9 h-12 rounded-lg object-cover border border-white/10 shrink-0 shadow-sm select-none" 
                            draggable="false"
                          />
                          <div className="min-w-0">
                            <div className="text-[8px] font-black tracking-widest text-[var(--text-secondary)] opacity-60 uppercase">WEEKLY CINEMATIC TREND</div>
                            <div className="text-xs font-black text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[280px] mt-0.5 leading-tight">{live.trendingMovie.title}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] opacity-60 italic text-[var(--text-secondary)]">Loading weekly trends...</div>
                      )}
                    </div>
                    <div className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider shrink-0 select-none hidden sm:block">
                      Trending
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUICK LINKS */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[var(--accent)] uppercase">Connections</span>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">Get in touch directly</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a 
                      href={`mailto:${contactData.email}`}
                      className="flex items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-opaque)] gap-4 hover:border-[var(--accent)] hover:scale-[1.01] transition-all select-none"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] shrink-0">
                        <img src="/skills_logos/gmail-2026.svg" alt="" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Email Address</div>
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[190px]">{contactData.email}</div>
                      </div>
                    </a>
                    <a 
                      href={contactData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-opaque)] gap-4 hover:border-[var(--accent)] hover:scale-[1.01] transition-all select-none"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] shrink-0">
                        <img src="/skills_logos/GitHub.svg" alt="" className="w-5 h-5 object-contain dark:hidden" />
                        <img src="/skills_logos/github-dark.svg" alt="" className="w-5 h-5 object-contain hidden dark:block" />
                      </div>
                      <div className="text-left">
                        <div className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-wider">GitHub Handle</div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">@{person.handle}</div>
                      </div>
                    </a>
                    {contactData.twitter && (
                      <a 
                        href={contactData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-opaque)] gap-4 hover:border-[var(--accent)] hover:scale-[1.01] transition-all select-none"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] shrink-0">
                          <img src="/skills_logos/x-formerly-twitter-light.svg" alt="" className="w-4 h-4 object-contain dark:hidden" />
                          <img src="/skills_logos/x-formerly-twitter.svg" alt="" className="w-4 h-4 object-contain hidden dark:block" />
                        </div>
                        <div className="text-left">
                          <div className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Twitter / X</div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">@{person.handle}</div>
                        </div>
                      </a>
                    )}
                    {contactData.instagram && (
                      <a 
                        href={contactData.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-opaque)] gap-4 hover:border-[var(--accent)] hover:scale-[1.01] transition-all select-none"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-[var(--border-color)] shrink-0">
                          <img src="/skills_logos/instagram.svg" alt="" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="text-left">
                          <div className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Instagram</div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">@{person.handle}</div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* BREADCRUMB FOOTER STATUS BAR */}
            <div className="h-7 border-t border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--text-secondary)] opacity-60">
                <span>iCloud Drive</span>
                <span>&gt;</span>
                <span className="capitalize">{person.handle}</span>
                <span>&gt;</span>
                <span className="capitalize">{activeTab === 'bio' ? 'Biography' : activeTab === 'system' ? 'System State' : 'Quick Links'}</span>
              </div>
              <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-50">
                3 items, 24.8 GB available on iCloud
              </span>
            </div>

          </div>

        </div>
      );
    }

    case 'projects': {
      // GALLERY APP THEME (PHOTOS THEME)
      const [activeAlbum, setActiveAlbum] = useState<string>('all');
      const [viewedProject, setViewedProject] = useState<any | null>(null);

      const albums = [
        { id: 'all', label: 'All Projects', count: section.data.length },
        { id: 'productivity', label: 'Productivity', count: 2 },
        { id: 'utilities', label: 'Utilities & Code', count: 3 }
      ];

      const getFilteredProjects = () => {
        if (activeAlbum === 'productivity') {
          return section.data.filter((p: any) => p.name.includes('Planner') || p.name.includes('OS'));
        }
        if (activeAlbum === 'utilities') {
          return section.data.filter((p: any) => !p.name.includes('Planner') && !p.name.includes('OS'));
        }
        return section.data;
      };

      const filteredProjects = getFilteredProjects();

      return (
        <div className="flex h-full flex-row items-stretch select-none bg-[var(--surface-color)]/25 leading-normal relative text-[var(--text-primary)] overflow-hidden">
          {/* GALLERY SIDEBAR */}
          <div className="w-40 border-r border-[var(--border-color)] bg-black/10 dark:bg-black/20 p-3 flex flex-col gap-4 select-none shrink-0 hidden md:flex">
            <div>
              <h5 className="px-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] opacity-50 uppercase mb-2">Photos</h5>
              <div className="flex flex-col gap-0.5">
                {albums.map(alb => (
                  <button 
                    key={alb.id}
                    onClick={() => setActiveAlbum(alb.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                      activeAlbum === alb.id 
                        ? 'bg-[var(--accent)] text-white font-extrabold' 
                        : 'hover:bg-white/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon size={13} className={activeAlbum === alb.id ? 'text-white' : 'text-purple-500'} />
                      <span>{alb.label}</span>
                    </div>
                    <span className={`text-[9px] font-black ${activeAlbum === alb.id ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>{alb.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN GRID WINDOW */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-color)]/10">
            {/* TOOLBAR */}
            <div className="h-11 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-black tracking-tight text-[var(--text-primary)]">
                {albums.find(a => a.id === activeAlbum)?.label}
              </span>

              {/* Slider zoom simulator */}
              <div className="items-center gap-2 text-[10px] text-[var(--text-secondary)] opacity-60 hidden sm:flex">
                <span>Zoom:</span>
                <div className="w-16 h-1 bg-white/20 rounded-full relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>

            {/* Mobile Albums Categories Slider */}
            <div className="flex gap-2 p-3 overflow-x-auto scroll-container shrink-0 border-b border-[var(--border-color)] md:hidden select-none bg-black/5 dark:bg-black/10">
              {albums.map((alb) => {
                const isActive = activeAlbum === alb.id;
                return (
                  <button
                    key={alb.id}
                    onClick={() => setActiveAlbum(alb.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all border shrink-0 ${
                      isActive 
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-3xs' 
                        : 'bg-[var(--surface-opaque)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                    }`}
                  >
                    {alb.label}
                  </button>
                );
              })}
            </div>

            {/* PROJECTS PHOTO GRID */}
            <div className="flex-1 p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto content-start scroll-container">
              {filteredProjects.map((project: any, i: number) => (
                <div 
                  key={i}
                  onClick={() => setViewedProject(project)}
                  className="group flex flex-col bg-[var(--surface-opaque)] border border-[var(--border-color)] rounded-2xl overflow-hidden cursor-pointer shadow-3xs hover:border-[var(--accent)] hover:scale-[1.01] transition-all"
                >
                  <div className="aspect-video relative overflow-hidden select-none">
                    <img 
                      src={project.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="p-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[10px] font-black text-[var(--text-primary)] truncate max-w-[120px]">{project.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-secondary)] font-bold">{project.tags[0]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* STATUS BAR */}
            <div className="h-7 border-t border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-center shrink-0 text-[9px] font-bold text-[var(--text-secondary)] opacity-65">
              {filteredProjects.length} Photos • iCloud Synced
            </div>
          </div>

          {/* DYNAMIC PHOTOS QUICK LOOK OVERLAY DRAWER */}
          {viewedProject && (
            <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center p-6 select-none pointer-events-auto backdrop-blur-xs">
              <div className="w-[500px] max-w-full rounded-[28px] border border-[var(--border-color)] bg-[var(--surface-color)]/95 shadow-2xl flex flex-col overflow-hidden text-[var(--text-primary)] glass relative">
                
                {/* Top Right Close Button */}
                <button 
                  onClick={() => setViewedProject(null)}
                  className="absolute top-3.5 right-3.5 z-40 w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 shadow-sm"
                  aria-label="Close preview"
                >
                  <X size={11} className="stroke-[3]" />
                </button>

                {/* Main image & description details */}
                <div className="p-5 overflow-y-auto max-h-[380px] scroll-container flex flex-col gap-4 text-xs bg-[var(--bg-color)]/25 leading-normal select-text pt-7">
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-color)] shadow-xs select-none">
                    <img src={viewedProject.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-[var(--text-primary)]">{viewedProject.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{viewedProject.summary}</p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                      {viewedProject.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-bold border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-secondary)]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="h-11 border-t border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0">
                  <a 
                    href={viewedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-wide flex items-center gap-1 cursor-pointer shadow-sm select-none"
                  >
                    <BookOpen size={11} /> Open Site <ExternalLink size={10} />
                  </a>
                  <button 
                    onClick={() => setViewedProject(null)}
                    className="py-1.5 px-3 rounded-lg bg-black/10 dark:bg-white/10 text-[var(--text-primary)] text-[10px] font-black uppercase cursor-pointer select-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'skills': {
      // SYSTEM SETTINGS THEME (SYSTEM PREFERENCES THEME)
      const [activeCategory, setActiveCategory] = useState<string>('Desktop & Wallpaper');

      // State to make toggles interactive (live dashboard configuration stack)
      const [activeTechs, setActiveTechs] = useState<Record<string, boolean>>({
        "HTML5": true, "CSS3": true, "JavaScript": true, "TypeScript": true,
        "React": true, "Next.js": true, "Astro": true,
        "Node.js": true, "Firebase": true, "MongoDB": false, "Supabase": true,
        "GSAP": true, "Three.js": true, "WebGL": true, "Framer Motion": true,
        "Git": true, "NPM": true, "Vite.js": true, "VS Code": true
      });

      const categories = Object.keys(section.data || {});

      const toggleTech = (name: string) => {
        setActiveTechs(prev => ({
          ...prev,
          [name]: !prev[name]
        }));
      };

      const getCategoryIcon = (cat: string) => {
        switch (cat) {
          case 'Desktop & Wallpaper': return <ImageIcon size={13} className="text-white" />;
          case 'Languages': return <Globe size={13} className="text-white" />;
          case 'Frameworks': return <FileCode size={13} className="text-white" />;
          case 'Backend & Databases': return <Folder size={13} className="text-white" />;
          case 'Animations & WebGL': return <Sparkles size={13} className="text-white" />;
          default: return <Settings size={13} className="text-white" />;
        }
      };

      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case 'Desktop & Wallpaper': return 'bg-pink-500';
          case 'Languages': return 'bg-blue-500';
          case 'Frameworks': return 'bg-emerald-500';
          case 'Backend & Databases': return 'bg-indigo-600';
          case 'Animations & WebGL': return 'bg-orange-500';
          default: return 'bg-slate-500';
        }
      };

      return (
        <div className="flex h-full flex-row items-stretch select-none bg-[var(--surface-color)]/25 leading-normal relative text-[var(--text-primary)] overflow-hidden">
          {/* SYSTEM SETTINGS SIDEBAR */}
          <div className="w-52 border-r border-[var(--border-color)] bg-black/10 dark:bg-black/20 p-3 flex flex-col gap-4 select-none shrink-0 hidden md:flex">
            <div>
              <h5 className="px-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] opacity-55 uppercase mb-3">Settings</h5>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                      activeCategory === cat 
                        ? 'bg-[var(--accent)] text-white font-extrabold shadow-3xs' 
                        : 'hover:bg-white/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${getCategoryColor(cat)} shadow-3xs`}>
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="truncate">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN SETTINGS INTERFACE PANEL */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-color)]/10">
            {/* TOOLBAR */}
            <div className="h-11 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-black tracking-tight text-[var(--text-primary)]">
                {activeCategory}
              </span>
              <span className="text-[8px] font-extrabold opacity-40 uppercase">System Settings</span>
            </div>

            {/* Mobile Settings Categories Slider */}
            <div className="flex gap-2 p-3 overflow-x-auto scroll-container shrink-0 border-b border-[var(--border-color)] md:hidden select-none bg-black/5 dark:bg-black/10">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-2 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-3xs' 
                        : 'bg-[var(--surface-opaque)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                    }`}
                  >
                    <span className={`shrink-0 flex items-center p-1 rounded-md ${getCategoryColor(cat)} text-white`}>
                      {getCategoryIcon(cat)}
                    </span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* SETTINGS ROWS */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto scroll-container select-text space-y-4 bg-slate-50/50 dark:bg-[#1C1C1E]/50">
              
              {/* Apple ID Profile Banner Header exactly like iOS */}
              <div className="flex items-center gap-4 bg-[var(--surface-opaque)]/70 border border-[var(--border-color)] rounded-2xl p-4 shadow-3xs">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-500 flex items-center justify-center font-black text-white text-lg relative shrink-0 shadow-inner border border-white/20 select-none">
                  SR
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-[var(--text-primary)] leading-tight">Santhosh Reddy</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold truncate">Apple ID, iCloud+, Media & Purchases</p>
                </div>
              </div>

              {activeCategory === 'Desktop & Wallpaper' ? (
                // Render Wallpaper picker grid
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 select-none">
                    {[
                      { name: 'macOS Ventura', value: '/wallpaper.png', type: 'image' },
                      { name: 'macOS Sunset', value: '/macos_sunset.png', type: 'image' },
                      { name: 'Solid Slate', value: 'linear-gradient(135deg, #1e293b, #0f172a)', type: 'gradient' },
                      { name: 'Vibrant Peak', value: 'linear-gradient(135deg, #f43f5e, #ec4899, #8b5cf6)', type: 'gradient' },
                      { name: 'Solid Indigo', value: 'linear-gradient(135deg, #1e1b4b, #0f172a)', type: 'gradient' },
                      { name: 'Cosmic Nebula', value: 'linear-gradient(135deg, #581c87, #0f172a, #0369a1)', type: 'gradient' }
                    ].concat(
                      (currentWallpaper && !['/wallpaper.png', '/macos_sunset.png'].some(p => p === currentWallpaper) && !currentWallpaper.startsWith('linear-gradient'))
                        ? [{ name: 'Custom Wallpaper', value: currentWallpaper, type: 'image' }]
                        : []
                    ).map((wp) => {
                      const isSelected = currentWallpaper === wp.value;
                      return (
                        <button
                          key={wp.name}
                          onClick={() => setCurrentWallpaper && setCurrentWallpaper(wp.value)}
                          className={`flex flex-col rounded-2xl overflow-hidden border p-1 bg-[var(--surface-opaque)]/70 transition-all text-left ${
                            isSelected 
                              ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-[1.02]' 
                              : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                          }`}
                        >
                          {wp.type === 'image' ? (
                            <img 
                              src={wp.value} 
                              alt={wp.name}
                              className="aspect-video w-full object-cover rounded-xl bg-slate-200 dark:bg-slate-800"
                              draggable="false"
                            />
                          ) : (
                            <div 
                              className="aspect-video w-full rounded-xl"
                              style={{ background: wp.value }}
                            />
                          )}
                          <div className="p-2 flex justify-between items-center w-full min-w-0">
                            <span className="text-[10px] font-black truncate text-[var(--text-primary)]">{wp.name}</span>
                            {isSelected && (
                              <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[7px] shrink-0 font-extrabold">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Insert custom wallpaper URL input */}
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-opaque)]/50 p-4 shadow-3xs select-none space-y-2.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                      Insert Custom Wallpaper Link
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const url = formData.get('wallpaper-url') as string;
                        if (url && url.trim().startsWith('http')) {
                          setCurrentWallpaper && setCurrentWallpaper(url.trim());
                          e.currentTarget.reset();
                        } else {
                          alert('Please enter a valid HTTP/HTTPS image URL.');
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        type="url"
                        name="wallpaper-url"
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/photo-...)"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs bg-[var(--bg-color)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[var(--accent)] hover:opacity-90 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                    <div className="text-[9px] text-[var(--text-secondary)] font-bold">
                      Supports direct image links from Unsplash, Imgur, Discord, or any public hosting server.
                    </div>
                  </div>
                </div>
              ) : (
                // Render standard skill lists exactly like grouped iOS lists
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-opaque)]/70 divide-y divide-[var(--border-color)] overflow-hidden shadow-3xs select-none">
                  {section.data[activeCategory]?.map((skill: { name: string; logo: string }) => {
                    const isEnabled = !!activeTechs[skill.name];
                    return (
                      <div 
                        key={skill.name}
                        onClick={() => toggleTech(skill.name)}
                        className="flex items-center justify-between p-3.5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {skill.logo ? (
                            <img 
                              src={skill.logo} 
                              alt="" 
                              className="w-6 h-6 object-contain shrink-0 filter dark:drop-shadow-xs group-hover:scale-105 transition-transform" 
                              draggable="false"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-black text-[var(--text-primary)]">{skill.name}</div>
                            <div className="text-[9px] text-[var(--text-secondary)] font-bold">Status: {isEnabled ? 'Active Stack' : 'Not Loaded'}</div>
                          </div>
                        </div>

                        {/* Switch + chevron indicator */}
                        <div className="flex items-center gap-3">
                          <button
                            className={`w-9 h-5 rounded-full relative transition-all duration-300 ${
                              isEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span 
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300 ${
                                isEnabled ? 'left-[18px]' : 'left-0.5'
                              }`}
                            />
                          </button>
                          <ChevronRight size={13} className="text-[var(--text-secondary)] opacity-40 shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-[10px] text-[var(--text-secondary)] px-4 leading-relaxed font-bold">
                {activeCategory === 'Desktop & Wallpaper' 
                  ? '* Selecting a card instantly updates the desktop backdrop background for both macOS and iOS layouts.'
                  : '* Toggling settings updates local configurations. Disable settings items to adjust local configurations.'}
              </div>
            </div>

            {/* STATUS BAR */}
            <div className="h-7 border-t border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0 text-[9px] font-bold text-[var(--text-secondary)] opacity-60 select-none">
              <span>Preferences Pane</span>
              <span>System Preferences Sync OK</span>
            </div>
          </div>
        </div>
      );
    }

    case 'experience': {
      // NOTES APP THEME
      const notes = section.data || [];
      const [selectedNoteIdx, setSelectedNoteIdx] = useState<number>(0);
      const activeNote = notes[selectedNoteIdx] || notes[0];

      // Note text checklist configuration helper
      const getNoteChecklist = (org: string) => {
        if (org === 'Phase 03') {
          return [
            { text: 'Visual Design Tuning & UX Rhythm', done: true },
            { text: 'WebGL Shader implementations', done: true },
            { text: 'Framer Motion & GSAP animations', done: true },
            { text: 'Vite & SSR bundle optimization', done: false }
          ];
        }
        if (org === 'Phase 02') {
          return [
            { text: 'Client-side AES encryption standards', done: true },
            { text: 'Dynamic Last.fm music integrations', done: true },
            { text: 'Widget panels weather implementations', done: true }
          ];
        }
        return [
          { text: 'Core Javascript logic & APIs', done: true },
          { text: 'Database schema modeling', done: true },
          { text: 'CSS grids & layouts compliance', done: true }
        ];
      };

      return (
        <div className="flex h-full flex-row items-stretch select-none bg-[var(--surface-color)]/25 leading-normal relative text-[var(--text-primary)] overflow-hidden">
          {/* NOTES LIST COLUMN */}
          <div className="w-48 border-r border-[var(--border-color)] bg-black/10 dark:bg-black/20 p-2 flex flex-col gap-1.5 shrink-0 hidden md:flex overflow-y-auto scroll-container select-none">
            <h5 className="px-2 text-[9px] font-black tracking-widest text-[var(--text-secondary)] opacity-55 uppercase mb-1.5 mt-2">Notes Index</h5>
            {notes.map((note: any, idx: number) => {
              const isActive = selectedNoteIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedNoteIdx(idx)}
                  className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-1 transition-all ${
                    isActive 
                      ? 'bg-amber-500/20 border border-amber-500/35 text-amber-950 dark:text-amber-100 font-extrabold' 
                      : 'hover:bg-white/5 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-xs font-black truncate leading-tight block w-full">{note.role}</span>
                  <div className="flex items-center justify-between text-[9px] opacity-70 font-bold w-full">
                    <span>{note.period}</span>
                    <span className="text-amber-500 text-[8px] uppercase tracking-wider font-extrabold">{note.org}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* MAIN NOTE TEXT EDITOR */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-color)]/5">
            {/* TOOLBAR */}
            <div className="h-11 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-amber-500 mr-2 uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <img src="/logo.png" alt="" className="w-3.5 h-3.5 object-contain select-none" style={{ transform: 'translateY(-0.5px)' }} draggable="false" />
                  NOTES
                </span>
              </div>
              <span className="text-[9px] font-extrabold opacity-45 uppercase text-[var(--text-secondary)] select-none">
                Last Edit: Today, 10:24 AM
              </span>
            </div>

            {/* Mobile Notes Categories Slider */}
            <div className="flex gap-2 p-3 overflow-x-auto scroll-container shrink-0 border-b border-[var(--border-color)] md:hidden select-none bg-black/5 dark:bg-black/10">
              {notes.map((note: any, idx: number) => {
                const isActive = selectedNoteIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedNoteIdx(idx)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all border shrink-0 ${
                      isActive 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-3xs' 
                        : 'bg-[var(--surface-opaque)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                    }`}
                  >
                    {note.org}
                  </button>
                );
              })}
            </div>

            {/* NOTES CONTENT PAD */}
            <div className="flex-1 p-5 md:p-7 overflow-y-auto scroll-container select-text leading-normal bg-yellow-50/5 dark:bg-black/5">
              <div className="max-w-xl mx-auto space-y-6">
                
                {/* Date centered header */}
                <div className="text-center select-none">
                  <span className="text-[9px] font-black tracking-wide text-[var(--text-secondary)] opacity-50 uppercase">
                    {activeNote.period} • {activeNote.org}
                  </span>
                  <h1 className="text-xl font-black text-[var(--text-primary)] mt-1 tracking-tight leading-tight">
                    {activeNote.role}
                  </h1>
                </div>

                {/* Details text */}
                <div className="text-xs leading-relaxed text-[var(--text-secondary)] font-semibold border-t border-[var(--border-color)] pt-4 select-text">
                  {activeNote.detail}
                </div>

                {/* Checklist (Mac Notes feature) */}
                <div className="space-y-2 border-t border-[var(--border-color)] pt-4 select-none">
                  <h4 className="text-[9px] font-black uppercase text-[var(--text-secondary)] opacity-60 tracking-wider mb-2">Phase Milestones</h4>
                  {getNoteChecklist(activeNote.org).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[var(--text-primary)] font-bold">
                      {item.done ? (
                        <CheckSquare size={14} className="text-amber-500 shrink-0" />
                      ) : (
                        <Square size={14} className="text-[var(--text-secondary)] opacity-60 shrink-0" />
                      )}
                      <span className={item.done ? 'opacity-85 line-through decoration-black/20 dark:decoration-white/20' : ''}>{item.text}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* STATUS BAR */}
            <div className="h-7 border-t border-[var(--border-color)] bg-black/5 dark:bg-black/10 px-4 flex items-center justify-center shrink-0 text-[9px] font-bold text-[var(--text-secondary)] opacity-60 select-none">
              Notes App Database Sync OK
            </div>
          </div>
        </div>
      );
    }

    case 'contact': {
      // MAIL/iMESSAGE HYBRID THEME
      const [selectedInboxIdx, setSelectedInboxIdx] = useState<number>(0);

      const inboxMails = [
        {
          id: 0,
          sender: "Santhosh Reddy",
          email: contactData.email,
          subject: "Let's work together!",
          preview: "Hi! Thanks for checking out my macOS/iOS portfolio. I'm open for frontend development contracts...",
          time: "10:30 PM",
          badge: <img src="/skills_logos/gmail-2026.svg" alt="" className="w-3.5 h-3.5 object-contain" />
        },
        {
          id: 1,
          sender: "GitHub Core",
          email: "github.com/santjsx",
          subject: "View GitHub Repository Code",
          preview: "Explore the full codebase, personal components, window systems, and lo-fi synthesizer engines...",
          time: "Yesterday",
          badge: (
            <>
              <img src="/skills_logos/GitHub.svg" alt="" className="w-3.5 h-3.5 object-contain dark:hidden" />
              <img src="/skills_logos/github-dark.svg" alt="" className="w-3.5 h-3.5 object-contain hidden dark:block" />
            </>
          ),
          url: contactData.github
        },
        {
          id: 2,
          sender: "Twitter / 𝕏 Network",
          email: "x.com/Santhoshh_void",
          subject: "Follow for Creative Frontend Posts",
          preview: "Connecting with other visual engineers, showcasing CSS hacks, custom operative mockups, and UI layouts...",
          time: "July 12",
          badge: (
            <>
              <img src="/skills_logos/x-formerly-twitter-light.svg" alt="" className="w-3 h-3 object-contain dark:hidden" />
              <img src="/skills_logos/x-formerly-twitter.svg" alt="" className="w-3 h-3 object-contain hidden dark:block" />
            </>
          ),
          url: contactData.twitter
        },
        {
          id: 3,
          sender: "Instagram DMs",
          email: "instagram.com/whoissanthoshh",
          subject: "Open DM Chat Interface",
          preview: "Reach out via Instagram DMs for general queries, collaborations, or project pricing estimates...",
          time: "July 08",
          badge: <img src="/skills_logos/instagram.svg" alt="" className="w-3.5 h-3.5 object-contain" />,
          url: contactData.instagram
        },
        {
          id: 4,
          sender: "Spotify Profile",
          email: "open.spotify.com/user/21kfp...",
          subject: "Listen to Santjsx's Playlists",
          preview: "Browse curated track selections, lofi chill synth loops, audio progress, and custom ambient favorites...",
          time: "Just Now",
          badge: <img src="/icons/whitesur/spotify.svg" alt="" className="w-3.5 h-3.5 object-contain" />,
          url: contactData.spotify
        },
        {
          id: 5,
          sender: "Discord Handle",
          email: contactData.discord,
          subject: "Direct Message santjsx on Discord",
          preview: "Connect instantly for coding assistance, quick sync-ups, visual designer feedback, or contract proposals...",
          time: "9:41 AM",
          badge: <img src="/icons/whitesur/discord.svg" alt="" className="w-3.5 h-3.5 object-contain" />,
          url: `https://discord.com`
        }
      ];

      const activeMail = inboxMails[selectedInboxIdx] || inboxMails[0];

      return (
        <div className="flex h-full flex-row items-stretch select-none bg-[var(--surface-color)]/25 leading-normal relative text-[var(--text-primary)] overflow-hidden">
          {/* MESSAGES LIST SIDEBAR */}
          <div className="w-52 border-r border-[var(--border-color)] bg-black/10 dark:bg-black/20 shrink-0 hidden md:flex flex-col overflow-y-auto scroll-container select-none">
            <div className="p-3.5 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/10 shrink-0 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-[var(--text-primary)] uppercase">iMessage</span>
              <span className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full uppercase">Active</span>
            </div>
            <div className="flex-1 divide-y divide-[var(--border-color)]/40">
              {inboxMails.map((mail, idx) => {
                const isActive = selectedInboxIdx === idx;
                return (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedInboxIdx(idx)}
                    className={`w-full text-left p-3.5 flex items-center gap-3 transition-all ${
                      isActive 
                        ? 'bg-blue-500/10 border-l-4 border-l-blue-500' 
                        : 'hover:bg-white/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                      {mail.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-black truncate text-[var(--text-primary)]">{mail.sender.split(' ')[0]}</span>
                        <span className="text-[8px] opacity-65 font-bold">{mail.time}</span>
                      </div>
                      <p className="text-[9px] text-[var(--text-secondary)] font-bold truncate block w-full leading-normal mt-0.5">{mail.preview}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MESSAGES THREAD PANELS */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#F2F2F7] dark:bg-black select-text">
            {/* Header */}
            <div className="h-11 border-b border-[var(--border-color)] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-md px-4 flex items-center justify-between shrink-0 select-none z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-[10px] shrink-0 select-none">
                  {activeMail.sender.substring(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-black text-[var(--text-primary)]">{activeMail.sender}</div>
                  <div className="text-[8px] text-[var(--text-secondary)] font-bold">iMessage • Connected</div>
                </div>
              </div>
              <span className="text-[8px] font-extrabold opacity-40 uppercase tracking-widest text-[var(--text-secondary)]">iMessage</span>
            </div>

            {/* Mobile Inbox List Slider */}
            <div className="flex gap-2 p-3 overflow-x-auto scroll-container shrink-0 border-b border-[var(--border-color)] md:hidden select-none bg-black/5 dark:bg-black/10 z-10">
              {inboxMails.map((mail, idx) => {
                const isActive = selectedInboxIdx === idx;
                return (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedInboxIdx(idx)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-3xs' 
                        : 'bg-[var(--surface-opaque)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/35'
                    }`}
                  >
                    <span className="shrink-0 flex items-center">{mail.badge}</span>
                    <span>{mail.sender}</span>
                  </button>
                );
              })}
            </div>

            {/* Messages body (iMessage speech bubbles style) */}
            <div className="flex-1 p-5 overflow-y-auto scroll-container flex flex-col gap-4 bg-slate-100/50 dark:bg-neutral-900/35">
              
              {/* Text timestamp */}
              <div className="text-center select-none py-1">
                <span className="text-[8px] font-black tracking-wide text-neutral-400 dark:text-neutral-500 uppercase">
                  iMessage • {activeMail.time}
                </span>
              </div>

              {/* Sender Bubble 1 */}
              <div className="flex items-end gap-2.5 max-w-[80%] self-start">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-[var(--border-color)] flex items-center justify-center shrink-0 select-none">
                  {activeMail.badge}
                </div>
                <div className="bg-[#E9E9EB] dark:bg-[#262629] text-black dark:text-white rounded-2xl rounded-bl-none px-4 py-2.5 text-xs font-semibold leading-relaxed shadow-3xs">
                  Hi! {activeMail.id === 0 ? "Thanks for checking out my macOS/iOS portfolio. I'm open for frontend development contracts." : "You can view my direct workspace coordinate details and active links below. Let's sync up!"}
                </div>
              </div>

              {/* Sender Bubble 2 (Metadata & Action Details) */}
              <div className="flex items-end gap-2.5 max-w-[80%] self-start">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-[var(--border-color)] flex items-center justify-center shrink-0 opacity-0 select-none" />
                <div className="bg-[#E9E9EB] dark:bg-[#262629] text-black dark:text-white rounded-2xl rounded-bl-none px-4 py-3 text-xs font-semibold leading-relaxed space-y-2.5 shadow-3xs">
                  <div className="font-extrabold text-blue-600 dark:text-blue-400">{activeMail.subject}</div>
                  <div>{activeMail.preview}</div>
                  <div className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 break-all select-all font-bold p-1.5 rounded-lg bg-black/5 dark:bg-white/5">{activeMail.email}</div>
                </div>
              </div>

              {/* Sent reply bubble (Simulating guest response) */}
              <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs font-semibold leading-relaxed max-w-[70%] self-end shadow-3xs">
                Awesome! I'll check this out and get back to you soon. Let's connect!
              </div>

              {/* Double check badge */}
              <div className="text-right text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mr-1 select-none">
                Delivered
              </div>
            </div>

            {/* Chat Input Box */}
            <div className="p-3 border-t border-[var(--border-color)] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-md flex items-center gap-2 select-none">
              <div className="flex-1 h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 flex items-center text-xs text-[var(--text-secondary)] opacity-60">
                iMessage
              </div>
              {activeMail.url ? (
                <a 
                  href={activeMail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition-all shrink-0 active:scale-95"
                >
                  <ExternalLink size={13} />
                </a>
              ) : (
                <a 
                  href={`mailto:${activeMail.email}`}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition-all shrink-0 active:scale-95"
                >
                  <Send size={13} className="ml-[2px]" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'safari': {
      const [searchQuery, setSearchQuery] = useState('');
      const [showResults, setShowResults] = useState(false);
      const [activeProject, setActiveProject] = useState<any | null>(null);

      const favorites = [
        { name: "GitHub", url: contactData.github, icon: "/skills_logos/GitHub.svg", desc: "Source repositories" },
        { name: "Twitter / X", url: contactData.twitter, icon: "/skills_logos/x-formerly-twitter.svg", desc: "Developer updates" },
        { name: "Instagram", url: contactData.instagram, icon: "/skills_logos/instagram.svg", desc: "Photography & DMs" },
        { name: "Email", url: `mailto:${contactData.email}`, icon: "/skills_logos/gmail-2026.svg", desc: "Compose message" },
        { name: "Spotify", url: contactData.spotify, icon: "/icons/whitesur/spotify.svg", desc: "Music playlists" },
        { name: "Discord", url: "https://discord.com", icon: "/icons/whitesur/discord.svg", desc: "Handle: santjsx" }
      ];

      // Retrieve real project data list
      const projectsSection = sections.find(s => s.key === 'projects');
      const projectList = projectsSection?.data || [];

      const searchResults = [
        {
          title: "Santhosh Reddy - Creative Frontend Engineer",
          link: "https://santhoshh.xyz/about",
          snippet: "Operational tools designer specializing in fluid motion systems, WebGL interactive spaces, and high-fidelity macOS/iOS portfolio themes.",
          action: () => alert("To explore the Biography, please visit the Santhosh (About Me) app in your Dock!")
        },
        {
          title: "The Hustle Planner - High Performance Workspace",
          link: "https://the-hustle-planner.vercel.app/",
          snippet: "High-performance productivity engine featuring deep work timers, habit loops, and spatial calendar layouts designed for elite creators.",
          action: () => {
            const proj = projectList.find((p: any) => p.name === 'The Hustle Planner');
            if (proj) setActiveProject(proj);
          }
        },
        {
          title: "Hybrid OS - Web Desktop Mockup",
          link: "https://hybrid-os.vercel.app/",
          snippet: "A web-based desktop operating system mockup complete with window management, terminal emulator, and custom interactive widgets.",
          action: () => {
            const proj = projectList.find((p: any) => p.name === 'Hybrid OS');
            if (proj) setActiveProject(proj);
          }
        },
        {
          title: "PDF Studio - Client side Editor",
          link: "https://pdf-studio-sable.vercel.app/",
          snippet: "A powerful, client-side PDF editing suite supporting secure annotations, document merging, page extraction, and digital signatures.",
          action: () => {
            const proj = projectList.find((p: any) => p.name === 'PDF Studio');
            if (proj) setActiveProject(proj);
          }
        }
      ];

      const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          setShowResults(true);
        }
      };

      const getBrowserAddress = () => {
        if (activeProject) {
          return activeProject.link.replace('https://', 'https://simulated-sandbox.');
        }
        if (showResults) {
          return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        }
        return 'https://www.safaristart.com';
      };

      return (
        <div className="flex h-full flex-col bg-white dark:bg-[#1C1C1E] text-black dark:text-white leading-normal select-none overflow-hidden relative animate-none">
          
          {/* Browser Body area (Occupies top flex space) */}
          <div className="flex-1 p-5 md:p-8 overflow-y-auto scroll-container select-text leading-normal bg-slate-50 dark:bg-[#1E1E1F]">
            {activeProject ? (
              // SIMULATED BROWSE SANDBOX
              <div className="max-w-3xl mx-auto space-y-6 pt-2">
                <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-3">
                  <div className="text-left select-none">
                    <span className="text-[8px] font-black uppercase text-[var(--accent)] tracking-widest">Local Sandbox</span>
                    <h2 className="text-base font-black tracking-tight text-black dark:text-white leading-tight mt-0.5">{activeProject.name}</h2>
                  </div>
                  <button 
                    onClick={() => setActiveProject(null)}
                    className="px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-black cursor-pointer select-none"
                  >
                    ← Back to Start
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
                  {/* Left Column: Visual Details & Audit Metrics */}
                  <div className="md:col-span-2 space-y-5 select-none">
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xs relative">
                      <img src={activeProject.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Performance Audit Badges (Lighthouse Mock) */}
                    <div className="rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] p-4 shadow-3xs space-y-3">
                      <div className="text-[9px] font-black uppercase text-black/55 dark:text-white/55 tracking-wider">Lighthouse Audit Metrics</div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-500 dark:text-emerald-400 font-extrabold text-[10px] flex items-center justify-center font-mono">99</span>
                          <span className="text-[8px] font-bold text-black/60 dark:text-white/60">Performance</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-500 dark:text-emerald-400 font-extrabold text-[10px] flex items-center justify-center font-mono">100</span>
                          <span className="text-[8px] font-bold text-black/60 dark:text-white/60">Accessibility</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-500 dark:text-emerald-400 font-extrabold text-[10px] flex items-center justify-center font-mono">100</span>
                          <span className="text-[8px] font-bold text-black/60 dark:text-white/60">Best Pract.</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-500 dark:text-emerald-400 font-extrabold text-[10px] flex items-center justify-center font-mono">100</span>
                          <span className="text-[8px] font-bold text-black/60 dark:text-white/60">SEO</span>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[var(--accent)] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center w-full"
                    >
                      Visit Live Production <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Right Column: Live Interactive Sandbox Widgets */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] p-5 shadow-3xs space-y-3">
                      <div className="text-xs font-black text-black dark:text-white">Simulated Interactive Sandbox</div>
                      <p className="text-[10px] font-semibold text-black/60 dark:text-white/60 leading-relaxed">
                        Below is an interactive mock of {activeProject.name}'s core visual logic stack. Try clicking the controls below!
                      </p>

                      {/* Render custom sandbox for each project */}
                      {activeProject.name === 'The Hustle Planner' && (
                        <div className="p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                          <PomodoroTimer />
                        </div>
                      )}
                      {activeProject.name === 'Uno Cypher' && (
                        <div className="p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                          <CypherSandbox />
                        </div>
                      )}
                      {activeProject.name === 'PDF Studio' && (
                        <div className="p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                          <PDFStudioSandbox />
                        </div>
                      )}
                      {activeProject.name === 'Track A Lot' && (
                        <div className="p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                          <FinanceSandbox />
                        </div>
                      )}
                      {activeProject.name === 'Hybrid OS' && (
                        <div className="p-1 bg-black/5 dark:bg-black/20 rounded-xl">
                          <TerminalSandbox />
                        </div>
                      )}
                    </div>

                    {/* Tech details */}
                    <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] text-xs space-y-2 leading-relaxed">
                      <div className="font-extrabold text-black dark:text-white">Technical Architecture & Details</div>
                      <div className="text-[10px] text-black/60 dark:text-white/60 leading-relaxed font-semibold">
                        {activeProject.summary}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1.5 select-none">
                        {activeProject.tags.map((t: string) => (
                          <span key={t} className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5 bg-slate-100 dark:bg-[#1E1E1F] text-black/60 dark:text-white/60">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !showResults ? (
              // START PAGE
              <div className="max-w-xl mx-auto space-y-8 pt-4">
                {/* Safari Brand */}
                <div className="flex flex-col items-center gap-2 select-none">
                  <img src="/icons/whitesur/safari.svg" alt="" className="w-12 h-12 object-contain" />
                  <h1 className="text-lg font-black tracking-tight">Favorites</h1>
                </div>

                {/* Grid of Bookmarks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 select-none">
                  {favorites.map((fav, idx) => (
                    <a 
                      key={idx}
                      href={fav.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] shadow-3xs flex flex-col items-center text-center gap-2 hover:scale-[1.02] hover:border-[var(--accent)] transition-all cursor-pointer"
                    >
                      <img src={fav.icon} alt="" className="w-8 h-8 object-contain filter dark:brightness-110" />
                      <div>
                        <div className="text-[10px] font-black text-black dark:text-white leading-tight">{fav.name}</div>
                        <div className="text-[8px] text-black/45 dark:text-white/45 font-bold mt-0.5 leading-none">{fav.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Project Bookmarks Panel */}
                <div className="space-y-3.5 select-none text-left">
                  <h3 className="text-xs font-black tracking-wider uppercase text-black/50 dark:text-white/40">Project Sandboxes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectList.map((proj: any, idx: number) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveProject(proj)}
                        className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] shadow-3xs flex items-center gap-3 hover:scale-[1.01] hover:border-[var(--accent)] transition-all cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0 border border-[var(--accent)]/10 text-[var(--accent)]">
                          <Folder size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-black truncate text-black dark:text-white leading-tight">{proj.name}</div>
                          <div className="text-[8px] text-black/45 dark:text-white/45 font-bold mt-0.5 truncate leading-none">Load simulation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Google Search Module */}
                <div className="border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] rounded-2xl p-5 shadow-3xs flex flex-col items-center gap-4 text-center mt-6">
                  <div className="text-xl font-black tracking-tighter text-blue-500 flex gap-0.5 select-none">
                    <span>G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span>
                  </div>
                  <form onSubmit={handleSearchSubmit} className="w-full max-w-sm flex gap-2">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 h-8 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 text-xs text-black dark:text-white outline-none focus:border-[var(--accent)] font-semibold select-text"
                    />
                    <button 
                      type="submit"
                      className="h-8 px-4 rounded-lg bg-[var(--accent)] text-white text-xs font-black cursor-pointer shadow-sm select-none"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // SEARCH RESULTS
              <div className="max-w-xl mx-auto space-y-6 pt-2">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3 select-none">
                  <span className="text-xs font-black text-black/55 dark:text-white/55">Search Results for:</span>
                  <span className="text-xs font-black text-[var(--accent)]">"{searchQuery}"</span>
                </div>

                <div className="space-y-5">
                  {searchResults.map((result, idx) => (
                    <div 
                       key={idx}
                      onClick={result.action}
                      className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2C2C2E] shadow-3xs hover:border-[var(--accent)] cursor-pointer transition-all space-y-1.5 text-left"
                    >
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate leading-tight select-none">{result.link}</div>
                      <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline leading-tight">{result.title}</h3>
                      <p className="text-[10px] text-black/65 dark:text-white/65 font-medium leading-relaxed">{result.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* iOS-Style Bottom Safari Address & Controls Bar */}
          <div className="h-16 border-t border-black/10 dark:border-white/10 bg-slate-100/90 dark:bg-[#2C2C2E]/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 gap-3 z-20">
            {/* Mock Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => { 
                  if (activeProject) {
                    setActiveProject(null);
                  } else {
                    setShowResults(false); 
                    setSearchQuery(''); 
                  }
                }}
                className={`p-2 rounded-xl transition-all active:scale-90 ${(showResults || activeProject) ? 'hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-black dark:text-white' : 'opacity-25'}`}
              >
                <ChevronLeft size={16} className="stroke-[2.5]" />
              </button>
              <button className="p-2 rounded-xl opacity-25">
                <ChevronRight size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Address Bar Capsule */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
              <div className="w-full h-9 rounded-full bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 flex items-center justify-between px-4 relative text-xs">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-center">
                  <Lock size={10} className="text-green-600 dark:text-green-400 shrink-0" />
                  <input 
                    type="text" 
                    value={getBrowserAddress()}
                    readOnly={true}
                    placeholder="Search or enter website"
                    className="bg-transparent border-none outline-none text-center text-xs font-semibold text-black dark:text-white placeholder-black/45 dark:placeholder-white/45 select-text w-full truncate"
                  />
                </div>
                {/* Reload button icon */}
                <button type="button" className="opacity-45 shrink-0 ml-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
            </form>

            {/* More / Share Mock Button */}
            <div className="w-8 shrink-0 text-right text-xs font-black text-blue-500 hover:opacity-85 cursor-pointer">
              aA
            </div>
          </div>
        </div>
      );
    }

    case 'vlc': {
      const activeTrack = playlist[currentTrackIdx] || { name: 'Lofi Chill Chords.mp3', artist: 'santjsx', album: 'Ambient Hacks' };

      const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };

      return (
        <div className="flex h-full flex-col bg-gradient-to-b from-[#1E1E24] to-[#0A0A0C] text-white font-sans select-none overflow-hidden relative animate-none">
          
          {/* iOS-style glowing background blur circles */}
          <div className="absolute top-8 left-8 w-40 h-40 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Main Visual Player Area */}
          <div className="flex-1 flex flex-col items-center justify-between p-6 relative gap-4 overflow-y-auto scroll-container">
            {/* Visualizer bars (Animating if playing) */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center items-end gap-1.5 h-16 opacity-25 pointer-events-none select-none px-12">
              {[...Array(24)].map((_, i) => {
                const duration = 0.6 + Math.random() * 0.8;
                return (
                  <motion.div 
                    key={i}
                    animate={isMusicPlaying ? { height: ["10%", "85%", "10%"] } : { height: "10%" }}
                    transition={{
                      repeat: Infinity,
                      duration: duration,
                      ease: "easeInOut",
                      delay: i * 0.04
                    }}
                    className="w-1.5 rounded-t-full bg-gradient-to-t from-orange-500 to-amber-400"
                  />
                );
              })}
            </div>

            {/* Vinyl Disc record container (Rotates dynamically) */}
            <div className="relative mt-2 select-none shrink-0 flex items-center justify-center">
              <motion.div
                animate={isMusicPlaying ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="w-32 h-32 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex items-center justify-center border border-white/10"
                style={{ background: 'radial-gradient(circle, #2C2C35 12%, #1C1C22 25%, #0B0B0E 50%, #000 85%)' }}
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-white/5 opacity-40 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-white/5 opacity-30 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-white/5 opacity-20 pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-white/5 opacity-10 pointer-events-none" />
                
                {/* Center Record Label */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center z-10 border-2 border-black/40 overflow-hidden shadow-inner">
                  <img src="/icons/whitesur/vlc.svg" alt="" className="w-8 h-8 object-contain" />
                </div>
              </motion.div>
            </div>

            {/* Track Metadata */}
            <div className="text-center space-y-1 relative z-10">
              <h2 className="text-sm font-black tracking-tight text-white leading-tight">{activeTrack.name}</h2>
              <p className="text-[10px] font-bold text-orange-400">Procedural Web Audio Synth Loop</p>
              <p className="text-[9px] text-white/55 font-bold">Artist: {activeTrack.artist} · Album: {activeTrack.album}</p>
            </div>

            {/* Playlist Selector List */}
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-2.5 space-y-1.5 relative z-20 select-none shadow-inner shrink-0">
              <div className="text-[8px] font-black uppercase text-white/40 tracking-wider px-2 mb-1">Playlist tracks</div>
              {playlist.map((track: any, idx: number) => {
                const isCurrent = currentTrackIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (setCurrentTrackIdx) setCurrentTrackIdx(idx);
                      if (setMusicProgress) setMusicProgress(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold flex justify-between items-center transition-all ${
                      isCurrent 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/35 shadow-3xs' 
                        : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="opacity-45">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="truncate">{track.name}</span>
                    </div>
                    <span className="text-[8px] opacity-50 shrink-0 font-mono">{track.artist}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-24 bg-black/30 backdrop-blur-md border-t border-white/10 flex flex-col shrink-0 px-4 pt-3.5 pb-4 gap-3.5 z-10">
            {/* Progress Slider (iOS 18 thick scrub style) */}
            <div className="flex items-center gap-2.5 text-[9px] font-mono text-white/50 font-bold">
              <span>{formatTime(musicProgress)}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-orange-500 rounded-full" 
                  style={{ width: `${(musicProgress / 180) * 100}%` }}
                />
              </div>
              <span>3:00</span>
            </div>

            {/* Playback Buttons & Volume */}
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-white/35 font-black uppercase tracking-wider hidden sm:block">VLC Player</div>

              {/* Primary Controls */}
              <div className="flex items-center gap-5 mx-auto select-none">
                <button 
                  onClick={prevTrack}
                  className="text-white/60 hover:text-white cursor-pointer transition-all active:scale-90"
                >
                  <SkipBack size={15} fill="currentColor" />
                </button>
                <button 
                  onClick={togglePlayback}
                  className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center cursor-pointer shadow-md select-none transition-all scale-100 active:scale-95 animate-none"
                >
                  {isMusicPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
                <button 
                  onClick={nextTrack}
                  className="text-white/60 hover:text-white cursor-pointer transition-all active:scale-90"
                >
                  <SkipForward size={15} fill="currentColor" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 w-24 shrink-0">
                <Volume2 size={13} className="opacity-50 text-white" />
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume && setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer outline-none accent-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'spotify': {
      const mockPlaylists = [
        { name: "Santhosh's Focus Chill", tracks: "48 Songs", image: "/icons/whitesur/vlc.svg" },
        { name: "Lofi Coding Ambient", tracks: "128 Songs", image: "/icons/whitesur/spotify.svg" },
        { name: "Late Night Synthesizers", tracks: "32 Songs", image: "/icons/whitesur/safari.svg" }
      ];

      return (
        <div className="flex h-full flex-col bg-[#121212] text-white font-sans overflow-hidden select-none relative">
          {/* Main Body Grid */}
          <div className="flex-1 overflow-y-auto scroll-container p-6 space-y-6">
            
            {/* Header profile card exactly like iOS Spotify verified view */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-b from-[#1DB954]/10 to-transparent p-5 rounded-2xl border border-white/5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1DB954] to-emerald-600 shadow-md relative overflow-hidden shrink-0 flex items-center justify-center border-2 border-[#1DB954] select-none">
                <span className="text-2xl font-black tracking-widest text-white uppercase">{person.name.substring(0,2)}</span>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[9px] font-black uppercase tracking-wider text-[#1DB954]">Spotify Verified Creator</div>
                <h2 className="text-xl font-black tracking-tight">{person.name}</h2>
                <p className="text-[10px] text-white/60 font-bold">santjsx · 1,248 Followers · 24 Public Playlists</p>
              </div>
            </div>

            {/* Curated Playlist Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-wider uppercase text-white/55">Curated Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mockPlaylists.map((plist, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 shadow-sm select-none"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1DB954]/20 flex items-center justify-center shrink-0 border border-[#1DB954]/15">
                      <img src={plist.image} alt="" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black truncate">{plist.name}</div>
                      <div className="text-[9px] text-white/55 font-bold mt-0.5">{plist.tracks}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile redirect card */}
            <div className="bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-2xl p-5 flex flex-col items-center gap-4 text-center">
              <p className="text-xs text-white/80 font-bold leading-relaxed max-w-md">
                Listen to Santhosh's actual playlists, favorite artists, and custom ambient sounds directly on Spotify.
              </p>
              <a 
                href={contactData.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-6 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95 select-none"
              >
                <ExternalLink size={13} /> Open Spotify Profile
              </a>
            </div>
          </div>

          {/* Footer Playing Status Bar */}
          <div className="h-10 bg-[#181818] border-t border-white/5 px-4 flex items-center justify-between shrink-0 text-[10px] text-white/60 font-semibold">
            <span>Logged in as santjsx</span>
            <span className="flex items-center gap-1.5 text-[#1DB954] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" /> Spotify Web API Connected
            </span>
          </div>
        </div>
      );
    }

    case 'discord': {
      const mockDms = [
        { sender: "Santhosh Reddy", text: "Hey! Welcome to my Discord space.", time: "10:32 AM" },
        { sender: "Santhosh Reddy", text: "If you want to discuss a project, need frontend advice, or want to collaborate, feel free to add me!", time: "10:33 AM" },
        { sender: "Santhosh Reddy", text: "My username handle is santjsx. You can click below to copy or message me!", time: "10:34 AM" }
      ];

      return (
        <div className="flex h-full flex-row bg-[#313338] text-white font-sans overflow-hidden select-none relative rounded-b-[20px]">
          
          {/* Discord Server Channels list Sidebar */}
          <div className="w-48 border-r border-black/15 bg-[#2B2D31] flex flex-col justify-between shrink-0 hidden sm:flex">
            <div>
              {/* Server title */}
              <div className="h-11 border-b border-black/15 px-4 flex items-center shadow-3xs font-black text-xs">
                Santhosh's Void
              </div>
              {/* Channels */}
              <div className="p-2.5 space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-[#949BA4] px-2.5 py-1">Text Channels</div>
                <div className="px-2.5 py-2 rounded-xl bg-white/5 text-xs font-black flex items-center gap-1.5 cursor-pointer text-white">
                  <span>#</span> welcome
                </div>
                <div className="px-2.5 py-2 rounded-xl hover:bg-white/5 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#949BA4] hover:text-white transition-colors">
                  <span>#</span> creative-hacks
                </div>
                <div className="px-2.5 py-2 rounded-xl hover:bg-white/5 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#949BA4] hover:text-white transition-colors">
                  <span>#</span> general-chat
                </div>
              </div>
            </div>

            {/* Profile footer segment */}
            <div className="h-12 bg-[#232428] px-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center font-black relative shrink-0">
                  SR
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#232428]" />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-[10px] font-black truncate">Santhosh Reddy</div>
                  <div className="text-[8px] text-white/50 font-bold truncate">@santjsx</div>
                </div>
              </div>
            </div>
          </div>

          {/* Discord Main Chat pane */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">
            {/* Header */}
            <div className="h-11 border-b border-black/15 px-4 flex items-center shadow-3xs font-black text-xs shrink-0 select-none">
              <span className="text-[#949BA4] text-base mr-2">#</span> welcome
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scroll-container p-4 space-y-4 select-text">
              {mockDms.map((dm, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center font-black text-white shrink-0 relative select-none">
                    SR
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#313338]" />
                  </div>
                  <div className="min-w-0 flex-1 leading-normal">
                    <div className="flex items-center gap-2 select-none">
                      <span className="text-xs font-black text-white hover:underline cursor-pointer">{dm.sender}</span>
                      <span className="text-[8px] text-white/35 font-bold">{dm.time}</span>
                    </div>
                    <p className="text-xs text-white/85 font-medium mt-0.5 whitespace-pre-line leading-relaxed">{dm.text}</p>
                  </div>
                </div>
              ))}

              {/* Add friend button container */}
              <div className="pt-4 select-none">
                <div className="p-5 rounded-2xl bg-[#2B2D31] border border-black/10 flex flex-col items-center gap-4 text-center">
                  <p className="text-xs font-bold text-white/70 max-w-sm">
                    Connect directly on Discord with handle <span className="text-[#5865F2] font-black">santjsx</span>.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText("santjsx");
                        alert("Discord handle 'santjsx' copied to clipboard!");
                      }}
                      className="py-2.5 px-5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                    >
                      Copy Handle
                    </button>
                    <a 
                      href="https://discord.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                    >
                      <ExternalLink size={13} /> Launch Discord
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'vscode': {
      const [fileContents, setFileContents] = useState({
        'AboutMe.tsx': `import React from 'react';

// Biography & Profile metadata
export const SanthoshReddy = () => {
  return {
    name: "Santhosh Reddy",
    role: "Web Developer & Creative Frontend Engineer",
    focus: "High-Agency Visual UIs, Motion Systems & WebGL",
    location: "India",
    availability: "Available / Open to Work",
    status: "Crafting premium operating system portfolios"
  };
};`,
        'Projects.json': `{
  "projects": [
    {
      "name": "The Hustle Planner",
      "brief": "Spatial work calendar & productivity loops.",
      "stack": ["Next.js", "GSAP", "Tailwind"]
    },
    {
      "name": "Hybrid OS",
      "brief": "Web-based desktop manager & widgets environment.",
      "stack": ["React", "Framer Motion", "TypeScript"]
    },
    {
      "name": "PDF Studio",
      "brief": "Secure client-side PDF reader and annotator.",
      "stack": ["React", "PDFLib", "Vite"]
    }
  ]
}`,
        'Skills.config': `// Technical Arsenal configuration
export const technicalSkills = {
  languages: ["TypeScript", "JavaScript", "HTML5", "CSS3"],
  frameworks: ["React", "Next.js", "Astro"],
  animations: ["GSAP", "Three.js", "WebGL", "Framer Motion"],
  backend: ["Node.js", "Firebase", "MongoDB", "Supabase"]
};`,
        'LiveAPI.ts': `// Live API Synchronizers
export async function syncLiveMetrics() {
  const lanyardStatus = await fetch("https://api.lanyard.rest/v1/users/1284925883240550552");
  const lastfmMusic = await fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks");
  
  return {
    realtimeDiscord: true,
    realtimeLastfm: true,
    status: "All API pipelines operational 🚀"
  };
}`,
        'Contact.md': `# Contact Santhosh Reddy

- Email: heysanthoshreddy@gmail.com
- GitHub: github.com/santjsx
- Twitter/X: @Santhoshh_void
- Instagram: @whoissanthoshh
- Spotify: santhoshh25
`
      });

      const [selectedFile, setSelectedFile] = useState<keyof typeof fileContents>('AboutMe.tsx');
      const [terminalLog, setTerminalLog] = useState<string[]>(['$ npm run dev', 'Vite v8.1.1 ready in 220ms', 'Local: http://localhost:5173/']);
      const [isRunning, setIsRunning] = useState(false);

      const runCodeSim = () => {
        setIsRunning(true);
        setTerminalLog(prev => [
          ...prev, 
          `$ npx ts-node ${selectedFile}`, 
          'Analyzing dependencies...', 
          'Compiling TypeScript code...',
          'Loading configurations...'
        ]);
        setTimeout(() => {
          let output = '';
          if (selectedFile === 'AboutMe.tsx') {
            output = 'OUTPUT:\n' + JSON.stringify({
              status: "Compiled Successfully",
              engineer: "Santhosh Reddy",
              profile: "Web Developer & Frontend Engineer",
              location: "India"
            }, null, 2);
          } else if (selectedFile === 'Projects.json') {
            output = 'OUTPUT:\n' + JSON.stringify({
              status: "Valid JSON schema",
              count: 3,
              records: ["The Hustle Planner", "Hybrid OS", "PDF Studio"]
            }, null, 2);
          } else if (selectedFile === 'Skills.config') {
            output = 'OUTPUT:\n' + JSON.stringify({
              loader: "Active Preferences System",
              languages: ["TS", "JS"],
              animations: ["GSAP", "Three.js", "WebGL", "Framer Motion"]
            }, null, 2);
          } else if (selectedFile === 'LiveAPI.ts') {
            output = 'OUTPUT:\n' + JSON.stringify({
              service: "Lanyard & Last.fm Gateway",
              latency: "142ms",
              pipelines: "Connected",
              astronauts_in_space: 10
            }, null, 2);
          } else {
            output = 'OUTPUT:\n' + JSON.stringify({
              method: "Mail & Social Handlers",
              email: "heysanthoshreddy@gmail.com",
              github: "github.com/santjsx",
              x: "x.com/Santhoshh_void"
            }, null, 2);
          }
          setTerminalLog(prev => [...prev, output, 'SUCCESS: Build completed.', '$ ']);
          setIsRunning(false);
        }, 1200);
      };

      return (
        <div className="flex h-full flex-row bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[11px] overflow-hidden select-none relative animate-none">
          
          {/* File Explorer Sidebar */}
          <div className="w-44 border-r border-[#2d2d2d] bg-[#252526] flex flex-col justify-between shrink-0 hidden sm:flex">
            <div>
              <div className="h-9 px-3.5 flex items-center border-b border-[#2d2d2d] text-[10px] font-black uppercase tracking-wider text-white/50">
                Explorer
              </div>
              <div className="p-2 space-y-1">
                <div className="font-extrabold text-[10px] text-white/45 px-2 flex items-center gap-1.5">
                  📁 macos-portfolio
                </div>
                <div className="pl-3 space-y-0.5">
                  <div className="font-bold text-[10px] text-white/35 flex items-center gap-1">
                    📁 src
                  </div>
                  <div className="pl-3 space-y-0.5">
                    {Object.keys(fileContents).map((filename) => {
                      const isSelected = selectedFile === filename;
                      return (
                        <button
                          key={filename}
                          onClick={() => setSelectedFile(filename as any)}
                          className={`w-full text-left px-2 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                            isSelected ? 'bg-[#37373d] text-white font-bold' : 'hover:bg-[#2a2a2b] text-[#8c8c8c] hover:text-white'
                          }`}
                        >
                          📄 {filename}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Git Status indicator */}
            <div className="p-3 border-t border-[#2d2d2d] text-[10px] text-[#8c8c8c] font-bold flex flex-col gap-2 select-none">
              <div>Branch: main</div>
              <a 
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-md bg-[#0e639c] hover:bg-[#1177bb] text-white text-center font-bold block cursor-pointer transition-colors active:scale-95"
              >
                Open GitHub Repo
              </a>
            </div>
          </div>

          {/* Code Editor and Terminal Pane */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            {/* Tabs Row */}
            <div className="h-9 bg-[#2d2d2d] flex items-center justify-between px-3 border-b border-[#252526] shrink-0 select-none">
              <div className="flex items-center gap-0.5 h-full overflow-x-auto scroll-container flex-1 mr-2">
                {Object.keys(fileContents).map((filename) => {
                  const isSelected = selectedFile === filename;
                  return (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(filename as any)}
                      className={`h-full px-3.5 border-r border-[#252526] flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                        isSelected 
                          ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc] font-bold' 
                          : 'opacity-50 hover:bg-[#2a2a2b]'
                      }`}
                    >
                      📄 {filename}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <button 
                onClick={runCodeSim}
                disabled={isRunning}
                className="flex items-center gap-1 py-1 px-2.5 rounded-md bg-[#007acc] hover:bg-[#0062a3] text-white font-extrabold cursor-pointer active:scale-95 transition-all text-[9px] uppercase tracking-wider shrink-0"
              >
                {isRunning ? 'Running...' : '▶ Run Code'}
              </button>
            </div>

            {/* Editor Area (Editable Textarea) */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <textarea
                value={fileContents[selectedFile]}
                onChange={(e) => {
                  const val = e.target.value;
                  setFileContents(prev => ({
                    ...prev,
                    [selectedFile]: val
                  }));
                }}
                className="flex-grow p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[11.5px] leading-relaxed resize-none outline-none focus:ring-0 border-none select-text overflow-y-auto selection:bg-[#264f78]"
                spellCheck="false"
              />
            </div>

            {/* Terminal Panel */}
            <div className="h-32 border-t border-[#2d2d2d] bg-[#1e1e1e] flex flex-col shrink-0">
              <div className="h-6 bg-[#252526] px-3 flex items-center justify-between text-[9px] uppercase font-black tracking-wider text-white/45 select-none shrink-0">
                <span>Terminal</span>
                <span className="cursor-pointer hover:text-white" onClick={() => setTerminalLog(['$ '])}>Clear</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto scroll-container font-mono text-[10px] text-[#cccccc] space-y-1 select-text text-left">
                {terminalLog.map((log, idx) => (
                  <div key={idx} className="leading-tight">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
