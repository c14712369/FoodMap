export type PlaceType = '餐廳' | '咖啡廳' | '甜點' | '藝術' | '購物' | '景點' | '夜市';

export interface Place {
  place_id: string;
  name: string;
  type: PlaceType;
  cuisine: string;
  rating: number;
  reviews: number;
  address: string;
  lat: number;
  lng: number;
  url: string;
  added_at?: string;
}

export interface MapConfig {
  apiKey: string;
  sheetUrl: string; // Apps Script 獲取 JSON 的網址
}
