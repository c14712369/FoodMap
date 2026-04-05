import React from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_ICONS, typeConfig } from '../constants/categories';
import type { AvailableIconName } from '../constants/categories';

interface IconPickerProps {
  isOpen: boolean;
  targetType: string | null;       // 哪個分類要換圖示
  currentIconName?: AvailableIconName;
  onSelect: (iconName: AvailableIconName) => void;
  onReset: () => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({
  isOpen, targetType, currentIconName, onSelect, onReset, onClose,
}) => {
  const config = targetType ? (typeConfig[targetType] || typeConfig['預設']) : typeConfig['預設'];
  const hex = config.hex;

  return (
    <AnimatePresence>
      {isOpen && targetType && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal 本體 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-50 glass-heavy rounded-3xl border border-white/15 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* 分類顏色預覽 */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: hex + '33', border: `1.5px solid ${hex}66` }}
                >
                  {(() => {
                    const IconComp = currentIconName
                      ? (AVAILABLE_ICONS.find(i => i.name === currentIconName)?.icon || config.icon)
                      : config.icon;
                    return <IconComp size={18} color={hex} strokeWidth={2.5} />;
                  })()}
                </div>
                <div>
                  <div className="text-white font-bold text-base">更換「{targetType}」圖示</div>
                  <div className="text-zinc-500 text-xs">點選圖示套用</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 重設按鈕 */}
                <button
                  onClick={onReset}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="重設為預設圖示"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* 圖示網格 */}
            <div className="p-4 grid grid-cols-5 gap-2.5 max-h-72 overflow-y-auto">
              {AVAILABLE_ICONS.map(({ name, icon: IconComp, label }) => {
                const isSelected = currentIconName === name;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onSelect(name as AvailableIconName);
                      onClose();
                    }}
                    className={`relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'border-2 text-white'
                        : 'border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                    }`}
                    style={isSelected ? {
                      backgroundColor: hex + '22',
                      borderColor: hex,
                      color: hex,
                    } : {}}
                    title={label}
                  >
                    {isSelected && (
                      <div
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: hex }}
                      >
                        <Check size={10} color="white" strokeWidth={3} />
                      </div>
                    )}
                    <IconComp
                      size={22}
                      strokeWidth={2}
                      color={isSelected ? hex : undefined}
                    />
                    <span className="text-[10px] font-medium leading-none text-center opacity-70">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-3 border-t border-white/10">
              <p className="text-zinc-600 text-xs text-center">
                選擇後立即更新地圖上所有「{targetType}」的圖釘，並自動儲存設定
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IconPicker;
