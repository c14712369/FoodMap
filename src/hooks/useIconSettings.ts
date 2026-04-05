import { useState, useEffect, useCallback } from 'react';
import { AVAILABLE_ICONS, typeConfig } from '../constants/categories';
import type { AvailableIconName } from '../constants/categories';

const STORAGE_KEY = 'foodmap_icon_settings';

type IconSettings = Record<string, AvailableIconName>;

function loadSettings(): IconSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useIconSettings() {
  const [customIcons, setCustomIcons] = useState<IconSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customIcons));
    } catch {
      // localStorage 不可用時忽略
    }
  }, [customIcons]);

  const setIconForType = useCallback((type: string, iconName: AvailableIconName) => {
    setCustomIcons(prev => ({ ...prev, [type]: iconName }));
  }, []);

  const resetIconForType = useCallback((type: string) => {
    setCustomIcons(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, []);

  // 取得某分類的 icon component（自訂優先，否則用預設）
  const getIconForType = useCallback((type: string) => {
    const customIconName = customIcons[type];
    if (customIconName) {
      const found = AVAILABLE_ICONS.find(i => i.name === customIconName);
      if (found) return found.icon;
    }
    return (typeConfig[type] || typeConfig['預設']).icon;
  }, [customIcons]);

  return { customIcons, setIconForType, resetIconForType, getIconForType };
}
