import { useEffect, useMemo, type ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Loader2, TriangleAlert } from 'lucide-react';
import type { CityPOIResult, RequestState } from '@/types';
import { POI_CATEGORY_LABELS } from '@/types';
import { cityColor } from '@/utils/cityColors';

const JAPAN_CENTER: [number, number] = [36.2048, 138.2529];
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function markerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<span class="marker-pin" style="background:${color}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

/** Recenters/fits the map whenever the set of plottable points changes. */
function FitToPoints({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], animate: true });
  }, [points, map]);
  return null;
}

interface MapViewProps {
  requestState: RequestState;
  errorMessage: string | null;
  results: CityPOIResult[];
  cityColorIndex: Record<string, number>;
}

export function MapView({ requestState, errorMessage, results, cityColorIndex }: MapViewProps) {
  const plottable = useMemo(
    () =>
      results.flatMap((city) =>
        city.pois
          .filter((poi): poi is typeof poi & { lat: number; lon: number } => poi.lat != null && poi.lon != null)
          .map((poi) => ({ poi, city: city.name }))
      ),
    [results]
  );

  const points = useMemo<[number, number][]>(
    () => plottable.map(({ poi }) => [poi.lat, poi.lon]),
    [plottable]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={JAPAN_CENTER}
        zoom={5}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTRIBUTION} />

        {plottable.map(({ poi, city }) => (
          <Marker
            key={poi.id}
            position={[poi.lat as number, poi.lon as number]}
            icon={markerIcon(cityColor(cityColorIndex[city] ?? 0))}
          >
            <Popup>
              <div className="min-w-[140px]">
                <p className="text-sm font-semibold text-fg">{poi.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
                  {POI_CATEGORY_LABELS[poi.category]}
                </p>
                <p className="mt-1 text-xs text-fg-faint">{city}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitToPoints points={points} />
      </MapContainer>

      {/* Status overlays — non-blocking, sit above the map without hiding it */}
      {requestState === 'idle' && (
        <MapOverlay>
          <Compass size={18} className="text-fg-faint" />
          <span>Configure your cities and interests</span>
        </MapOverlay>
      )}
      {requestState === 'loading' && (
        <MapOverlay>
          <Loader2 size={18} className="animate-spin text-route-gold" />
          <span>Fetching POIs…</span>
        </MapOverlay>
      )}
      {requestState === 'error' && (
        <MapOverlay tone="danger">
          <TriangleAlert size={18} className="text-danger" />
          <span>{errorMessage ?? 'Something went wrong.'}</span>
        </MapOverlay>
      )}
    </div>
  );
}

function MapOverlay({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'danger' }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-5 z-[500] -translate-x-1/2 animate-fade-in">
      <div
        className={[
          'flex items-center gap-2 rounded-full border bg-ink-raised/90 px-4 py-2 text-sm font-medium shadow-panel backdrop-blur',
          tone === 'danger' ? 'border-danger/40 text-danger' : 'border-line text-fg-muted',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
