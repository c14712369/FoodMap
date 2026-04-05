import React from 'react';
import { X, MapPin, Star, MessageSquare, ExternalLink, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { typeConfig } from '../constants/categories';
import type { Place } from '../types';

interface PlaceSheetProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlaceSheet: React.FC<PlaceSheetProps> = ({ place, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {place && isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20"
          />

          {/* 抽屜本體 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute bottom-0 inset-x-0 glass-heavy rounded-t-[32px] z-30 pb-safe border-t border-white/10"
          >
            {/* 拖拉把手 */}
            <div className="w-12 h-1.5 bg-zinc-700/50 rounded-full mx-auto mt-3 mb-5" />

            <div className="px-6 pb-10">
              {/* 頂部：分類 tag + 關閉鈕 */}
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* 分類 tag */}
                  {(() => {
                    const cfg = typeConfig[place.type] || typeConfig['預設'];
                    return (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${cfg.bg} ${cfg.color}`}>
                        {place.type || '其他'}
                      </span>
                    );
                  })()}
                  {/* 料理類型 tag */}
                  {place.cuisine && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-zinc-400 border border-white/10">
                      {place.cuisine}
                    </span>
                  )}
                  {/* 地區 tag */}
                  {place.region && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-zinc-500 border border-white/10">
                      📍 {place.region}{place.country && place.country !== '台灣' ? `・${place.country}` : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 店名 */}
              <h2 className="text-xl font-bold text-white font-plus leading-snug mb-3">
                {place.name}
              </h2>

              {/* 評分 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="font-bold text-sm text-white">{place.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{place.reviews.toLocaleString()} 則評論</span>
                </div>
              </div>

              {/* 地址 */}
              <div className="flex items-start gap-2.5 mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300 text-sm leading-relaxed">{place.address}</p>
              </div>

              {/* 操作按鈕 */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={place.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white h-13 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                  <ExternalLink className="w-4 h-4" />
                  立即導航
                </a>
                <button className="flex items-center justify-center gap-2 glass-light active:scale-95 text-white h-13 rounded-2xl font-bold border border-white/10 transition-all duration-200">
                  <Bookmark className="w-4 h-4" />
                  儲存地點
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceSheet;
