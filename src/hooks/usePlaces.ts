import { useState, useEffect, useMemo } from 'react';
import type { Place } from '../types';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export function usePlaces(activeType: string, searchQuery: string) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APPS_SCRIPT_URL, { method: 'GET', redirect: 'follow' });
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const rawPlaces = (Array.isArray(data) ? data : [])
          .filter((p: any) => p.name && p.lat && p.lng)
          .map((p: any) => ({
            ...p,
            type: (p.type || '').trim(),
            lat: parseFloat(p.lat),
            lng: parseFloat(p.lng),
            rating: p.rating ? parseFloat(p.rating) : 0,
            reviews: p.reviews ? parseInt(p.reviews) : 0,
          }));

        // 去重：同一個 place_id 只保留第一筆
        const seen = new Set<string>();
        const uniquePlaces = rawPlaces.filter((p: Place) => {
          const key = p.place_id || `${p.name}-${p.lat}-${p.lng}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (import.meta.env.DEV) {
          const typeCounts: Record<string, number> = {};
          uniquePlaces.forEach((p: Place) => {
            const t = p.type || '(無分類)';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
          });
          console.log(`[FoodMap] 原始 ${rawPlaces.length} → 去重後 ${uniquePlaces.length}`, typeCounts);
        }

        setPlaces(uniquePlaces);
      } catch (err) {
        console.error('[FoodMap] Fetch error:', err);
        setError('資料載入失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 計算每個分類的數量（基於全部資料，不受搜尋影響）
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    places.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const matchType = activeType === '全部' || p.type === activeType;
      const matchSearch = !searchQuery ||
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.address || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [places, activeType, searchQuery]);

  return { places, filteredPlaces, typeCounts, loading, error };
}
