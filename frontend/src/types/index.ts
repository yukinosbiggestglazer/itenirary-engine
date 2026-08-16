/**
 * The POI categories currently supported by the backend pipeline.
 * Keep this list in sync with the Overpass filter config on the backend.
 */
export const POI_CATEGORIES = [
  'park',
  'garden',
  'convenience',
  'mall',
  'buddhist_temple',
  'shinto_shrine',
  'aquarium',
  'zoo',
  'museum',
  'castle',
  'restaurant',
  'cafe',
] as const;

export type POICategory = (typeof POI_CATEGORIES)[number];

export const POI_CATEGORY_LABELS: Record<POICategory, string> = {
  park: 'Park',
  garden: 'Garden',
  convenience: 'Convenience',
  mall: 'Mall',
  buddhist_temple: 'Buddhist Temple',
  shinto_shrine: 'Shinto Shrine',
  aquarium: 'Aquarium',
  zoo: 'Zoo',
  museum: 'Museum',
  castle: 'Castle',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
};

/** A single city configuration as edited in the sidebar. */
export interface CityConfig {
  /** Client-side identifier only; never sent to the backend. */
  id: string;
  name: string;
  pois: POICategory[];
}

/** Shape sent to POST /pois — one entry per city, each with its own POI list. */
export interface FetchPOIsRequest {
  cities: Record<string, POICategory[]>;
}

/** A single point of interest returned by the backend. */
export interface POIResult {
  id: string;
  name: string;
  category: POICategory;
  /** Coordinates are optional — some OSM entries may lack them. */
  lat?: number;
  lon?: number;
}

/** One city's worth of returned POIs. */
export interface CityPOIResult {
  name: string;
  pois: POIResult[];
}

/** Shape returned by POST /pois. */
export interface FetchPOIsResponse {
  cities: CityPOIResult[];
}

export type RequestState = 'idle' | 'loading' | 'success' | 'error';
