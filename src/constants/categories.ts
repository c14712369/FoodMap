import {
  Utensils, Coffee, Dessert, Palette, MapPin, Tent, ShoppingBag,
  Camera, Music, BookOpen, Heart, Star, Flame, Leaf, Fish,
  IceCream, Soup, Sandwich, Pizza, Salad, Beer, Globe, Mountain,
  TreePine, Building2, Landmark, Bike, Waves, Sun, Moon,
} from 'lucide-react';

export type PlaceType = '餐廳' | '咖啡廳' | '甜點' | '藝術' | '購物' | '景點' | '夜市';

export const CATEGORY_LIST: Array<'全部' | PlaceType> = [
  '全部', '餐廳', '咖啡廳', '甜點', '藝術', '景點', '夜市', '購物',
];

export interface CategoryConfig {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
  hex: string;
}

export const typeConfig: Record<string, CategoryConfig> = {
  '餐廳':  { icon: Utensils,    color: 'text-orange-400', bg: 'bg-orange-500/20', hex: '#f97316' },
  '咖啡廳': { icon: Coffee,      color: 'text-amber-400',  bg: 'bg-amber-500/20',  hex: '#d97706' },
  '甜點':  { icon: Dessert,     color: 'text-pink-400',   bg: 'bg-pink-500/20',   hex: '#ec4899' },
  '藝術':  { icon: Palette,     color: 'text-purple-400', bg: 'bg-purple-500/20', hex: '#a855f7' },
  '景點':  { icon: Tent,        color: 'text-emerald-400',bg: 'bg-emerald-500/20',hex: '#10b981' },
  '夜市':  { icon: MapPin,      color: 'text-red-400',    bg: 'bg-red-500/20',    hex: '#ef4444' },
  '購物':  { icon: ShoppingBag, color: 'text-sky-400',    bg: 'bg-sky-500/20',    hex: '#0ea5e9' },
  '預設':  { icon: MapPin,      color: 'text-blue-400',   bg: 'bg-blue-500/20',   hex: '#6366f1' },
};

// 可選的圖示清單（給 IconPicker 使用）
export const AVAILABLE_ICONS = [
  { name: 'Utensils',    icon: Utensils,    label: '刀叉' },
  { name: 'Coffee',      icon: Coffee,      label: '咖啡' },
  { name: 'Dessert',     icon: Dessert,     label: '甜點' },
  { name: 'Palette',     icon: Palette,     label: '調色盤' },
  { name: 'MapPin',      icon: MapPin,      label: '圖釘' },
  { name: 'Tent',        icon: Tent,        label: '帳篷' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: '購物袋' },
  { name: 'Camera',      icon: Camera,      label: '相機' },
  { name: 'Music',       icon: Music,       label: '音樂' },
  { name: 'BookOpen',    icon: BookOpen,    label: '書本' },
  { name: 'Heart',       icon: Heart,       label: '愛心' },
  { name: 'Star',        icon: Star,        label: '星星' },
  { name: 'Flame',       icon: Flame,       label: '火焰' },
  { name: 'Leaf',        icon: Leaf,        label: '葉子' },
  { name: 'Fish',        icon: Fish,        label: '魚' },
  { name: 'IceCream',    icon: IceCream,    label: '冰淇淋' },
  { name: 'Soup',        icon: Soup,        label: '湯碗' },
  { name: 'Sandwich',    icon: Sandwich,    label: '三明治' },
  { name: 'Pizza',       icon: Pizza,       label: '披薩' },
  { name: 'Salad',       icon: Salad,       label: '沙拉' },
  { name: 'Beer',        icon: Beer,        label: '啤酒' },
  { name: 'Globe',       icon: Globe,       label: '地球' },
  { name: 'Mountain',    icon: Mountain,    label: '山' },
  { name: 'TreePine',    icon: TreePine,    label: '松樹' },
  { name: 'Building2',   icon: Building2,   label: '建築' },
  { name: 'Landmark',    icon: Landmark,    label: '地標' },
  { name: 'Bike',        icon: Bike,        label: '單車' },
  { name: 'Waves',       icon: Waves,       label: '海浪' },
  { name: 'Sun',         icon: Sun,         label: '太陽' },
  { name: 'Moon',        icon: Moon,        label: '月亮' },
] as const;

export type AvailableIconName = typeof AVAILABLE_ICONS[number]['name'];
