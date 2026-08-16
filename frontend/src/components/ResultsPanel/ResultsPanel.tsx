import type { ReactNode } from 'react';
import { MapPin, Loader2, TriangleAlert, Compass } from 'lucide-react';
import type { CityPOIResult, RequestState } from '@/types';
import { POI_CATEGORY_LABELS } from '@/types';
import { cityColor } from '@/utils/cityColors';

interface ResultsPanelProps {
  requestState: RequestState;
  errorMessage: string | null;
  results: CityPOIResult[];
  cityColorIndex: Record<string, number>;
}

export function ResultsPanel({ requestState, errorMessage, results, cityColorIndex }: ResultsPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col border-line bg-ink-raised md:w-[300px] md:border-l">
      <div className="border-b border-line px-5 py-5">
        <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-fg-muted">
          POI Results
        </h2>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
        {requestState === 'idle' && (
          <EmptyState
            icon={<Compass size={20} />}
            title="Nothing fetched yet"
            detail="Configure your cities and interests, then fetch POIs to see results here."
          />
        )}

        {requestState === 'loading' && (
          <EmptyState
            icon={<Loader2 size={20} className="animate-spin" />}
            title="Fetching POIs…"
            detail="Querying the pipeline for each city's points of interest."
          />
        )}

        {requestState === 'error' && (
          <EmptyState
            icon={<TriangleAlert size={20} className="text-danger" />}
            title="Request failed"
            detail={errorMessage ?? 'Something went wrong while fetching POIs.'}
          />
        )}

        {requestState === 'success' && results.length === 0 && (
          <EmptyState
            icon={<Compass size={20} />}
            title="No POIs found"
            detail="The pipeline returned no results for this configuration."
          />
        )}

        {requestState === 'success' && results.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            {results.map((city) => {
              const color = cityColor(cityColorIndex[city.name] ?? 0);
              return (
                <div key={city.name}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                    <h3 className="font-display text-sm font-semibold text-fg">{city.name}</h3>
                    <span className="text-xs text-fg-faint">({city.pois.length})</span>
                  </div>
                  <div className="mb-3 h-px w-full bg-line" />

                  {city.pois.length === 0 ? (
                    <p className="pl-1 text-xs text-fg-faint">No POIs returned for this city.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {city.pois.map((poi) => (
                        <li key={poi.id} className="flex items-start gap-2">
                          <MapPin size={14} className="mt-[2px] shrink-0" style={{ color }} />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-fg">{poi.name}</p>
                            <p className="font-mono text-[10px] uppercase tracking-wide text-fg-faint">
                              {POI_CATEGORY_LABELS[poi.category]}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

function EmptyState({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-line px-4 py-10 text-center">
      <span className="text-fg-faint">{icon}</span>
      <p className="text-sm font-medium text-fg-muted">{title}</p>
      <p className="text-xs text-fg-faint">{detail}</p>
    </div>
  );
}
