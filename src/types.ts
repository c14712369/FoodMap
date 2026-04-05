export interface Place {
  place_id: string;
  name: string;
  type: string;
  cuisine: string;
  rating: number;
  reviews: number;
  address: string;
  lat: number;
  lng: number;
  url: string;
  region?: string;
  country?: string;
  added_at?: string;
}
