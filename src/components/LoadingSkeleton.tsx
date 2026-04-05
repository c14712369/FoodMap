import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const LoadingSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center gap-6"
    >
      {/* 品牌 logo 動畫 */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center"
      >
        <MapPin className="w-10 h-10 text-indigo-400" />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-white font-bold text-xl tracking-wide">FoodMap</div>
        <div className="text-zinc-500 text-sm">正在載入美食地圖...</div>
      </div>

      {/* 進度點動畫 */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingSkeleton;
