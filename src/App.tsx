import { useState, useEffect, useMemo } from 'react'
import { 
  APIProvider, 
  Map, 
  Marker,
  useMap
} from '@vis.gl/react-google-maps'
import { Navigation, Search, Star, Coffee, Utensils, Dessert, Palette, MapPin, Tent, ShoppingBag, MessageSquare, X, LocateFixed } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Place, PlaceType } from './types'

// 設定環境變數
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const typeConfig: Record<string, { icon: any, color: string, bg: string }> = {
  '餐廳': { icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-500/20' },
  '咖啡廳': { icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-600/20' },
  '甜點': { icon: Dessert, color: 'text-pink-500', bg: 'bg-pink-500/20' },
  '藝術': { icon: Palette, color: 'text-purple-500', bg: 'bg-purple-500/20' },
  '景點': { icon: Tent, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
  '夜市': { icon: MapPin, color: 'text-red-500', bg: 'bg-red-500/20' },
  '預設': { icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/20' }
};

const MapController = ({ userLocation, initialLocateDone, setInitialLocateDone }: any) => {
  const map = useMap();
  useEffect(() => {
    if (map && userLocation && !initialLocateDone) {
      map.panTo(userLocation);
      map.setZoom(15);
      setInitialLocateDone(true);
    }
  }, [map, userLocation, initialLocateDone, setInitialLocateDone]);
  return null;
};

const App = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [initialLocateDone, setInitialLocateDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<PlaceType | '全部'>('全部');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APPS_SCRIPT_URL, { method: 'GET', redirect: 'follow' });
        const data = await response.json();
        if (data.error) return;
        const validPlaces = (Array.isArray(data) ? data : [])
          .filter(p => p.name && p.lat && p.lng)
          .map(p => ({
            ...p,
            lat: parseFloat(p.lat),
            lng: parseFloat(p.lng),
            rating: p.rating ? parseFloat(p.rating) : 0,
            reviews: p.reviews ? parseInt(p.reviews) : 0
          }));
        setPlaces(validPlaces);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const matchType = activeType === '全部' || p.type?.trim() === activeType;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [places, activeType, searchQuery]);

  return (
    <div className="fixed inset-0 w-full h-full bg-zinc-950 overflow-hidden font-inter">
      <APIProvider apiKey={GOOGLE_API_KEY}>
        <Map
          mapId={GOOGLE_MAP_ID}
          defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
          defaultZoom={15}
          disableDefaultUI={true}
          onClick={() => setIsBottomSheetOpen(false)}
          className="w-full h-full"
        >
          <MapController userLocation={userLocation} initialLocateDone={initialLocateDone} setInitialLocateDone={setInitialLocateDone} />

          {userLocation && (
            <Marker position={userLocation} />
          )}

          {filteredPlaces.map(p => (
            <Marker
              key={p.place_id}
              position={{ lat: p.lat, lng: p.lng }}
              onClick={() => {
                setSelectedPlace(p);
                setIsBottomSheetOpen(true);
              }}
            />
          ))}
        </Map>

        {/* 頂部搜尋與分類 */}
        <div className="absolute top-4 inset-x-4 z-10 flex flex-col gap-3">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass rounded-2xl flex items-center px-4 py-3.5 gap-3">
            <Search className="w-5 h-5 text-zinc-400" />
            <input 
              type="text" placeholder="探索週邊美食..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-white placeholder-zinc-500 text-base"
            />
            {loading && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
          </motion.div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['全部', '餐廳', '咖啡廳', '甜點', '藝術', '景點', '夜市'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type as any)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                  activeType === type ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'glass text-zinc-400 border-white/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 定位鈕 */}
        <div className="absolute bottom-40 right-4 z-10">
          <button onClick={() => setInitialLocateDone(false)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl">
            <LocateFixed className="w-6 h-6" />
          </button>
        </div>

        {/* 詳情抽屜 */}
        <AnimatePresence>
          {selectedPlace && isBottomSheetOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBottomSheetOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20" />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute bottom-0 inset-x-0 glass-heavy rounded-t-[32px] z-30 pb-safe border-t border-white/10"
              >
                <div className="w-12 h-1.5 bg-zinc-700/50 rounded-full mx-auto mt-3 mb-5" />
                <div className="px-6 pb-8">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${(typeConfig[selectedPlace.type?.trim()] || typeConfig['預設']).bg} ${(typeConfig[selectedPlace.type?.trim()] || typeConfig['預設']).color}`}>
                          {selectedPlace.type}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white font-plus leading-tight mb-1">{selectedPlace.name}</h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <span className="font-bold text-sm">{selectedPlace.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400 text-sm">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{selectedPlace.reviews} 則評論</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setIsBottomSheetOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex items-start gap-2 mb-8 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-zinc-300 text-sm leading-relaxed">{selectedPlace.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <a href={selectedPlace.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 bg-indigo-600 text-white h-14 rounded-2xl font-bold shadow-xl">立即導航</a>
                    <button className="flex items-center justify-center gap-2.5 glass-light text-white h-14 rounded-2xl font-bold border border-white/10">儲存地點</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </APIProvider>
    </div>
  )
}

export default App
