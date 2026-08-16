import { X, AlertCircle } from 'lucide-react';
import type { CityConfig, POICategory } from '@/types';
import type { CityValidation } from '@/utils/validation';
import { POISelector } from '@/components/POISelector/POISelector';

interface CityCardProps {
  city: CityConfig;
  color: string;
  validation: CityValidation;
  showValidation: boolean;
  onNameChange: (name: string) => void;
  onTogglePOI: (category: POICategory) => void;
  onRemove: () => void;
}

export function CityCard({
  city,
  color,
  validation,
  showValidation,
  onNameChange,
  onTogglePOI,
  onRemove,
}: CityCardProps) {
  const hasError = showValidation && (validation.emptyName || validation.noPOIs || validation.duplicate);

  return (
    <div className="relative animate-fade-in">
      {/* Station dot, sits on the sidebar's connecting line */}
      <span
        className="absolute left-[5px] top-[18px] h-2.5 w-2.5 rounded-full ring-[3px] ring-ink z-10"
        style={{ backgroundColor: color }}
        aria-hidden
      />

      <div
        className={[
          'ml-7 rounded-xl border bg-surface/70 shadow-card transition-colors',
          hasError ? 'border-danger/60' : 'border-line hover:border-fg-faint/60',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 px-3 pt-3">
          <input
            type="text"
            value={city.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="City name"
            aria-label="City name"
            className="min-w-0 flex-1 bg-transparent font-display text-[15px] font-medium tracking-wide text-fg placeholder:text-fg-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${city.name || 'city'}`}
            className="rounded-md p-1 text-fg-faint transition-colors hover:bg-ink hover:text-danger"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-3 pb-3 pt-2.5">
          <POISelector
            selected={city.pois}
            onToggle={onTogglePOI}
            accentColor={color}
          />
        </div>

        {hasError && (
          <div className="flex items-start gap-1.5 border-t border-line px-3 py-2 text-xs text-danger">
            <AlertCircle size={13} className="mt-[1px] shrink-0" />
            <span>
              {validation.emptyName && 'City name is required. '}
              {validation.duplicate && 'This city is already in your trip. '}
              {validation.noPOIs && 'Select at least one point of interest.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
