import { useState, useEffect } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps'
import { AnimatePresence } from 'framer-motion'
import { usePlaces } from './hooks/usePlaces'
import { useIconSettings } from './hooks/useIconSettings'
import CategoryMarker from './components/CategoryMarker'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import PlaceSheet from './components/PlaceSheet'
import LocateButton from './components/LocateButton'
import LoadingSkeleton from './components/LoadingSkeleton'
import IconPicker from './components/IconPicker'
import type { Place } from './types'
import type { AvailableIconName } from './constants/categories'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID  = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

// ─── 定位追蹤子元件 ───────────────────────────────────────
const MapController = ({ userLocation, done, setDone }: any) => {
  const map = useMap();
  useEffect(() => {
    if (map && userLocation && !done) {
      map.panTo(userLocation);
      map.setZoom(15);
      setDone(true);
    }
  }, [map, userLocation, done, setDone]);
  return null;
};

const UserTracker = ({ active, done, setDone }: {
  active: boolean;
  done: boolean;
  setDone: (v: boolean) => void;
}) => {
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!active) return;
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      pos => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.warn(err),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [active]);

  return (
    <>
      <MapController userLocation={loc} done={done} setDone={setDone} />
      {loc && (
        <AdvancedMarker position={loc}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            backgroundColor: '#3b82f6', border: '3px solid white',
            boxShadow: '0 0 0 4px rgba(59,130,246,0.3)',
          }} />
        </AdvancedMarker>
      )}
    </>
  );
};

// ─── 主元件 ───────────────────────────────────────────────
const App = () => {
  const [activeType, setActiveType]           = useState<string>('全部');
  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedPlace, setSelectedPlace]     = useState<Place | null>(null);
  const [isSheetOpen, setIsSheetOpen]         = useState(false);
  const [trackingActive, setTrackingActive]   = useState(false);
  const [locateDone, setLocateDone]           = useState(false);
  const [iconPickerType, setIconPickerType]   = useState<string | null>(null);

  const { filteredPlaces, typeCounts, loading } = usePlaces(activeType, searchQuery);
  const { customIcons, setIconForType, resetIconForType } = useIconSettings();

  // 自動偵測已授權的定位
  useEffect(() => {
    try {
      navigator.permissions?.query({ name: 'geolocation' }).then(res => {
        if (res.state === 'granted') setTrackingActive(true);
      }).catch(() => {});
    } catch { /* ignore */ }
  }, []);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsSheetOpen(true);
  };

  const handleLocate = () => {
    setLocateDone(false);
    setTrackingActive(true);
  };

  const handleSelectCategory = (type: string) => {
    setActiveType(type);
    setSearchQuery('');
    setSelectedPlace(null);
    setIsSheetOpen(false);
  };

  const totalCount = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  const currentPickerIconName = iconPickerType ? customIcons[iconPickerType] : undefined;

  return (
    <div className="fixed inset-0 w-full h-full bg-zinc-950 overflow-hidden font-inter">
      <APIProvider apiKey={GOOGLE_API_KEY}>

        {/* 地圖 */}
        <Map
          mapId={GOOGLE_MAP_ID}
          defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
          defaultZoom={15}
          disableDefaultUI
          colorScheme="DARK"
          className="w-full h-full"
        >
          <UserTracker active={trackingActive} done={locateDone} setDone={setLocateDone} />

          {filteredPlaces.map(p => (
            <AdvancedMarker
              key={p.place_id || `${p.name}-${p.lat}-${p.lng}`}
              position={{ lat: p.lat, lng: p.lng }}
              onClick={() => handleSelectPlace(p)}
            >
              <CategoryMarker
                type={p.type}
                customIconName={customIcons[p.type] as AvailableIconName | undefined}
              />
            </AdvancedMarker>
          ))}
        </Map>

        {/* 頂部 UI */}
        <div className="absolute top-4 inset-x-4 z-40 flex flex-col gap-2.5">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredPlaces={filteredPlaces}
            loading={loading}
            onSelectPlace={handleSelectPlace}
          />
          <CategoryFilter
            activeType={activeType}
            typeCounts={typeCounts}
            customIcons={customIcons as Record<string, AvailableIconName>}
            totalCount={totalCount}
            onSelect={handleSelectCategory}
            onOpenIconPicker={type => setIconPickerType(type)}
          />
        </div>

        {/* 定位按鈕 */}
        <LocateButton onClick={handleLocate} />

        {/* 底部詳情抽屜 */}
        <PlaceSheet
          place={selectedPlace}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />

        {/* Icon Picker Modal */}
        <IconPicker
          isOpen={iconPickerType !== null}
          targetType={iconPickerType}
          currentIconName={currentPickerIconName as AvailableIconName | undefined}
          onSelect={name => {
            if (iconPickerType) setIconForType(iconPickerType, name);
          }}
          onReset={() => {
            if (iconPickerType) resetIconForType(iconPickerType);
          }}
          onClose={() => setIconPickerType(null)}
        />

        {/* 全畫面載入動畫 */}
        <AnimatePresence>
          {loading && <LoadingSkeleton />}
        </AnimatePresence>

      </APIProvider>
    </div>
  );
};

export default App;
