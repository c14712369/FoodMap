import React, { useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Place } from '../types';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredPlaces: Place[];
  loading: boolean;
  onSelectPlace: (place: Place) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery, setSearchQuery, filteredPlaces, loading, onSelectPlace,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside 關閉下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasQuery = searchQuery.length > 0;
  const suggestions = filteredPlaces.slice(0, 6);

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-2xl flex items-center px-4 py-3.5 gap-3 relative z-50"
      >
        <Search className="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="探索週邊美食..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="bg-transparent border-none outline-none flex-1 text-white placeholder-zinc-500 text-base min-w-0"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!loading && hasQuery && (
          <button
            onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/20 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>

      {/* 下拉選單 */}
      <AnimatePresence>
        {showDropdown && hasQuery && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass-heavy rounded-2xl overflow-hidden z-40 border border-white/10 shadow-2xl origin-top"
          >
            {suggestions.length > 0 ? (
              suggestions.map(p => (
                <button
                  key={p.place_id || `${p.name}-${p.lat}`}
                  onClick={() => {
                    onSelectPlace(p);
                    setShowDropdown(false);
                    setSearchQuery(p.name || '');
                  }}
                  className="w-full px-4 py-3.5 text-left hover:bg-white/10 transition-all duration-200 flex items-center gap-3 border-b border-white/5 last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-medium truncate">{p.name}</span>
                    <span className="text-zinc-500 text-xs truncate">{p.address}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 flex flex-col items-center gap-2 text-zinc-500">
                <Search className="w-8 h-8 opacity-40" />
                <span className="text-sm">找不到「{searchQuery}」相關地點</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
