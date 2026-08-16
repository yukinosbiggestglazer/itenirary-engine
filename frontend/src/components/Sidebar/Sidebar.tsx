import { Plus, Route, Loader2, AlertTriangle } from 'lucide-react';
import type { CityConfig, POICategory, RequestState } from '@/types';
import { CityCard } from '@/components/CityCard/CityCard';
import { cityColor } from '@/utils/cityColors';
import { validateCities, canSubmit } from '@/utils/validation';

interface SidebarProps {
  cities: CityConfig[];
  requestState: RequestState;
  errorMessage: string | null;
  attemptedSubmit: boolean;
  onAddCity: () => void;
  onRemoveCity: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onTogglePOI: (id: string, category: POICategory) => void;
  onSubmit: () => void;
}

export function Sidebar({
  cities,
  requestState,
  errorMessage,
  attemptedSubmit,
  onAddCity,
  onRemoveCity,
  onNameChange,
  onTogglePOI,
  onSubmit,
}: SidebarProps) {
  const validation = validateCities(cities);
  const isLoading = requestState === 'loading';
  const ready = canSubmit(cities);

  return (
    <aside className="flex h-full w-full flex-col border-line bg-ink-raised md:w-[340px] md:border-r">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-route-gold/15 text-route-gold">
          <Route size={17} strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="font-display text-[17px] font-bold tracking-[0.04em] text-fg">ITENIRARY</h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-faint">Trip planner · Phase 1</p>
        </div>
      </div>

      {/* Scrollable city list */}
      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-faint">
          Cities {cities.length > 0 && <span className="text-fg-faint/70">({cities.length})</span>}
        </p>

        {cities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center">
            <p className="text-sm text-fg-muted">No cities yet.</p>
            <p className="mt-1 text-xs text-fg-faint">Add a city to start choosing points of interest.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Continuous line-map spine connecting each station (city) */}
            <div className="absolute bottom-2 left-[10px] top-2 w-px bg-gradient-to-b from-line via-line to-transparent" />
            <div className="space-y-3">
              {cities.map((city, i) => (
                <CityCard
                  key={city.id}
                  city={city}
                  color={cityColor(i)}
                  validation={validation[city.id]}
                  showValidation={attemptedSubmit}
                  onNameChange={(name) => onNameChange(city.id, name)}
                  onTogglePOI={(category) => onTogglePOI(city.id, category)}
                  onRemove={() => onRemoveCity(city.id)}
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onAddCity}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-2.5 text-sm font-medium text-fg-muted transition-colors hover:border-route-gold/50 hover:text-route-gold"
        >
          <Plus size={15} />
          Add City
        </button>
      </div>

      {/* Submit action */}
      <div className="border-t border-line px-5 py-4">
        {attemptedSubmit && !ready && requestState !== 'loading' && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-danger">
            <AlertTriangle size={13} />
            Fix the highlighted cities before fetching.
          </p>
        )}
        {requestState === 'error' && errorMessage && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-danger">
            <AlertTriangle size={13} />
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
            isLoading
              ? 'cursor-wait bg-route-gold/40 text-ink/70'
              : 'bg-route-gold text-ink hover:brightness-110 active:brightness-95',
          ].join(' ')}
        >
          {isLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Fetching POIs…
            </>
          ) : (
            'Fetch POIs'
          )}
        </button>
      </div>
    </aside>
  );
}
