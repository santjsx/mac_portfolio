import React, { useState, useEffect } from 'react';
import { Wifi, Sun, Moon } from 'lucide-react';

interface MenuBarProps {
  activeTitle: string;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  openWindow: (key: string) => void;
  closeActiveWindow: () => void;
  activeWindowId: string | null;
  toggleGrayscale: () => void;
  resetSystem: () => void;
  toggleSpotlight: () => void;
  minimizeActiveWindow: () => void;
  maximizeActiveWindow: () => void;
  minimizeAll: () => void;
  bringAllToFront: () => void;
  lockScreen: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  activeTitle, 
  isDarkMode, 
  setIsDarkMode,
  openWindow,
  closeActiveWindow,
  activeWindowId,
  toggleGrayscale,
  resetSystem,
  toggleSpotlight,
  minimizeActiveWindow,
  maximizeActiveWindow,
  minimizeAll,
  bringAllToFront,
  lockScreen
}) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(false);

  // Keep Clock updated
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync battery state dynamically
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-item-container')) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [activeMenu]);

  const formatClock = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${dayName} ${monthName} ${day}  ${hours}:${minutes} ${ampm}`;
  };

  const menus = {
    'logo': [
      { label: 'About This Portfolio', action: () => openWindow('about') },
      { label: 'System Settings...', action: () => openWindow('skills') },
      { type: 'separator' },
      { label: 'Toggle Grayscale Mode', action: toggleGrayscale },
      { label: 'Reset System Settings', action: resetSystem },
      { type: 'separator' },
      { label: 'Lock Screen', action: lockScreen }
    ],
    'File': [
      { label: 'New Santhosh Window', action: () => openWindow('about') },
      { label: 'Spotlight Search...', action: toggleSpotlight },
      { type: 'separator' },
      { label: 'Close Active Window', action: closeActiveWindow, disabled: !activeWindowId }
    ],
    'Edit': [
      { label: 'Copy Contact Email', action: () => {
        navigator.clipboard.writeText('heysanthoshreddy@gmail.com');
        alert('Email copied to clipboard!');
      }},
      { label: 'Copy Discord Username', action: () => {
        navigator.clipboard.writeText('santjsx');
        alert('Discord username "santjsx" copied to clipboard!');
      }}
    ],
    'View': [
      { label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode', action: () => setIsDarkMode(!isDarkMode) },
      { type: 'separator' },
      { label: 'Zoom/Maximize Window', action: maximizeActiveWindow, disabled: !activeWindowId },
      { label: 'Minimize Window to Dock', action: minimizeActiveWindow, disabled: !activeWindowId }
    ],
    'Go': [
      { label: 'Biography (Santhosh)', action: () => openWindow('about') },
      { label: 'Projects (Photos)', action: () => openWindow('projects') },
      { label: 'Active Stack (Settings)', action: () => openWindow('skills') },
      { label: 'Experience (Notes)', action: () => openWindow('experience') },
      { label: 'Contact Directory (Mail)', action: () => openWindow('contact') },
      { label: 'Spotify Profile (App)', action: () => openWindow('spotify') },
      { label: 'Discord Server (App)', action: () => openWindow('discord') }
    ],
    'Window': [
      { label: 'Minimize All Windows', action: minimizeAll },
      { label: 'Bring All to Front', action: bringAllToFront }
    ],
    'Help': [
      { label: 'Portfolio Codebase (GitHub)', action: () => window.open('https://github.com/santjsx', '_blank') },
      { label: 'Support & Web Browser', action: () => openWindow('safari') }
    ]
  };

  const renderDropdown = (menuKey: keyof typeof menus) => {
    const items = menus[menuKey];
    if (activeMenu !== menuKey) return null;
    return (
      <div 
        className="absolute top-8.5 left-0 glass-opaque rounded-[14px] py-1.5 px-1 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.3)] border border-black/[0.08] dark:border-white/[0.08] min-w-[200px] z-50 select-none animate-none"
      >
        {items.map((item, idx) => {
          if ('type' in item && item.type === 'separator') {
            return <div key={`sep-${idx}`} className="h-[1px] bg-[var(--border-color)] my-1 mx-1.5" />;
          }
          
          const menuItem = item as { label: string; action: () => void; disabled?: boolean };
          const isDisabled = menuItem.disabled;

          return (
            <button
              key={`item-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                menuItem.action();
                setActiveMenu(null);
              }}
              disabled={isDisabled}
              className={`w-[calc(100%-8px)] text-left mx-1 px-3 py-1.5 flex justify-between items-center rounded-[8px] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-all duration-100 cursor-pointer select-none font-semibold text-[11px] ${
                isDisabled ? 'opacity-35 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <span>{menuItem.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-8 glass flex items-center justify-between px-4 z-50 text-[11px] font-semibold select-none text-[var(--text-primary)]"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      {/* Left Menu Items */}
      <div className="flex items-center gap-2 select-none h-full">
        {/* Logo Menu */}
        <div className="relative h-full flex items-center menu-item-container">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'logo' ? null : 'logo')}
            className={`cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 rounded-md p-1 flex items-center justify-center transition-colors h-7 w-8 ${activeMenu === 'logo' ? 'bg-white/10 dark:bg-white/5' : ''}`}
          >
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain select-none" draggable="false" />
          </button>
          {renderDropdown('logo')}
        </div>

        {/* Active Title */}
        <span className="font-extrabold cursor-default px-2 select-none mr-2 text-[12px]">{activeTitle}</span>

        {/* Categories Menus */}
        {(['File', 'Edit', 'View', 'Go', 'Window', 'Help'] as const).map((name) => {
          return (
            <div key={name} className="relative h-full flex items-center menu-item-container hidden md:flex">
              <button
                onClick={() => setActiveMenu(activeMenu === name ? null : name)}
                className={`cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 px-2.5 py-1 rounded-md transition-colors leading-none h-7 flex items-center ${activeMenu === name ? 'bg-white/10 dark:bg-white/5' : ''}`}
              >
                {name}
              </button>
              {renderDropdown(name)}
            </div>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="hover:opacity-85 active:opacity-100 cursor-pointer font-semibold transition-opacity flex items-center gap-1.5"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
        <span className="flex items-center gap-2">
          <Wifi size={14} strokeWidth={2.2} className="shrink-0 animate-none" />
          
          {/* Custom High-Fidelity Battery Icon */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-medium opacity-90 select-none mr-0.5">{batteryLevel}%</span>
            <div className="relative rounded-[3.5px] p-[1.5px] flex items-center border-[1.2px] border-current" style={{ width: '22px', height: '11.5px' }}>
              <div 
                className={`h-full rounded-[1px] ${isCharging ? 'bg-green-500' : 'bg-current'}`} 
                style={{ width: `${batteryLevel}%` }} 
              />
              <div className="absolute bg-current rounded-r-[0.8px]" style={{ right: '-3px', top: '2.8px', width: '1.5px', height: '4px' }} />
            </div>
          </div>
        </span>
        <span className="font-medium tracking-wide">
          {formatClock(time)}
        </span>
      </div>
    </div>
  );
};
