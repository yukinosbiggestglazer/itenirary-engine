import { Check } from 'lucide-react';
import { POI_CATEGORIES, POI_CATEGORY_LABELS, type POICategory } from '@/types';

interface POISelectorProps {
  selected: POICategory[];
  onToggle: (category: POICategory) => void;
  accentColor: string;
}

/**
 * Chip-based multi-select for POI categories. Fully controlled — the parent
 * CityCard owns the selected list, so each city's selector is independent
 * even though they all render from the same POI_CATEGORIES source.
 */
export function POISelector({ selected, onToggle, accentColor }: POISelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Points of interest">
      {POI_CATEGORIES.map((category) => {
        const isActive = selected.includes(category);
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            aria-pressed={isActive}
            className={[
              'group inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-150',
              isActive
                ? 'text-ink shadow-sm'
                : 'border-line bg-ink-raised/40 text-fg-muted hover:border-fg-faint hover:text-fg',
            ].join(' ')}
            style={
              isActive
                ? { backgroundColor: accentColor, borderColor: accentColor }
                : undefined
            }
          >
            {isActive && <Check size={12} strokeWidth={3} />}
            {POI_CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}
