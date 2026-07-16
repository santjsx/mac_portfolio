import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { sections } from '../shared/sectionsData';

interface SpotlightProps {
  setSpotlightOpen: (open: boolean) => void;
  openWindow: (sectionKey: string, originRect?: DOMRect | null) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ setSpotlightOpen, openWindow }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Capture active element before opening to restore on close
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      // Restore focus on close
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Filter sections by title or keywords
  const filteredResults = sections.filter(section => {
    const q = query.toLowerCase().trim();
    if (!q) return false;
    return (
      section.title.toLowerCase().includes(q) ||
      section.dockLabel.toLowerCase().includes(q) ||
      section.keywords.some(keyword => keyword.toLowerCase().includes(q))
    );
  });

  // Clamp active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Handle keyboard navigation in Spotlight
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (filteredResults.length > 0 ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        const selectedSection = filteredResults[activeIndex];
        openWindow(selectedSection.key);
        setSpotlightOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSpotlightOpen(false);
    } else if (e.key === 'Tab') {
      // Focus trap within input to prevent tabbing away
      e.preventDefault();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0.15 } : { duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/35 backdrop-blur-sm pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSpotlightOpen(false);
        }
      }}
    >
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={prefersReducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-lg rounded-2xl glass-opaque border border-[var(--border-color)] shadow-2xl overflow-hidden focus:outline-none"
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={true}
        aria-haspopup="listbox"
        aria-controls="spotlight-results"
        tabIndex={-1}
      >
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-color)] bg-[var(--surface-color)]">
          <Search size={20} className="mr-3 text-[var(--text-secondary)] shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Spotlight Search (e.g. projects, resume, skills...)" 
            className="flex-1 bg-transparent outline-none text-lg placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)]"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="spotlight-results"
          />
          <div className="flex items-center gap-0.5 text-[var(--text-secondary)]/60 text-[10px] font-semibold border border-[var(--border-color)] px-1.5 py-0.5 rounded-md glass shrink-0">
            <span className="text-xs">ESC</span>
          </div>
        </div>

        {/* Search Results */}
        {query && (
          <div 
            id="spotlight-results" 
            className="py-2 max-h-[320px] overflow-y-auto scroll-container bg-[var(--bg-color)]/10"
            role="listbox"
          >
            {filteredResults.length > 0 ? (
              filteredResults.map((res, i) => {
                const isSelected = i === activeIndex;
                return (
                  <div 
                    key={res.key} 
                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[var(--accent)] text-white' 
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-color)]'
                    }`}
                    onClick={() => {
                      openWindow(res.key);
                      setSpotlightOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0`}
                      style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : res.color }}
                    >
                      <img src={res.icon} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{res.title}</span>
                      <span 
                        className={`text-[10px] block font-medium opacity-70 ${
                          isSelected ? 'text-white' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        Keyword matches: {res.keywords.slice(0, 3).join(', ')}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold flex items-center gap-1 opacity-90 animate-pulse">
                        Open <ArrowRight size={10} />
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-xs font-semibold text-[var(--text-secondary)]/75">
                No sections found matching "{query}"
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
