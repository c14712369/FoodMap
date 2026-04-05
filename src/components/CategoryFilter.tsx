import React from 'react';
import { Settings2 } from 'lucide-react';
import { CATEGORY_LIST, typeConfig } from '../constants/categories';
import type { AvailableIconName } from '../constants/categories';

interface CategoryFilterProps {
  activeType: string;
  typeCounts: Record<string, number>;
  customIcons: Record<string, AvailableIconName>;
  totalCount: number;
  onSelect: (type: string) => void;
  onOpenIconPicker: (type: string) => void;
}

import { AVAILABLE_ICONS } from '../constants/categories';

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeType, typeCounts, customIcons, totalCount, onSelect, onOpenIconPicker,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {/* 資料筆數徽章 */}
      <div className="px-4 py-2 rounded-xl text-sm font-semibold glass text-indigo-300 border border-white/5 shrink-0 flex items-center">
        共 {totalCount} 筆
      </div>

      {CATEGORY_LIST.map((type) => {
        const isActive = activeType === type;
        const config = typeConfig[type] || typeConfig['預設'];
        const count = type === '全部'
          ? Object.values(typeCounts).reduce((a, b) => a + b, 0)
          : (typeCounts[type] || 0);

        // 取得 icon（自訂優先）
        let IconComp = config.icon;
        const customIconName = type !== '全部' ? customIcons[type] : undefined;
        if (customIconName) {
          const found = AVAILABLE_ICONS.find(i => i.name === customIconName);
          if (found) IconComp = found.icon;
        }

        return (
          <div key={type} className="relative shrink-0 group">
            <button
              onClick={() => onSelect(type)}
              className={`flex items-center gap-1.5 pl-3 pr-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass text-zinc-400 border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              <IconComp size={14} strokeWidth={2.5} />
              <span>{type}</span>
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-zinc-500'
                }`}>
                  {count}
                </span>
              )}
            </button>

            {/* 換圖示按鈕（全部 不顯示）*/}
            {type !== '全部' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenIconPicker(type);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                title={`更換「${type}」圖示`}
              >
                <Settings2 size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
