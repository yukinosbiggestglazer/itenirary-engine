import type { CityConfig } from '@/types';

export interface CityValidation {
  emptyName: boolean;
  noPOIs: boolean;
  duplicate: boolean;
}

/** Per-city validation, keyed by city id, computed against the full list (for duplicate checks). */
export function validateCities(cities: CityConfig[]): Record<string, CityValidation> {
  const seenNames = new Map<string, number>();
  for (const city of cities) {
    const key = city.name.trim().toLowerCase();
    if (!key) continue;
    seenNames.set(key, (seenNames.get(key) ?? 0) + 1);
  }

  const result: Record<string, CityValidation> = {};
  for (const city of cities) {
    const key = city.name.trim().toLowerCase();
    result[city.id] = {
      emptyName: key.length === 0,
      noPOIs: city.pois.length === 0,
      duplicate: key.length > 0 && (seenNames.get(key) ?? 0) > 1,
    };
  }
  return result;
}

export function isCityValid(v: CityValidation): boolean {
  return !v.emptyName && !v.noPOIs && !v.duplicate;
}

export function canSubmit(cities: CityConfig[]): boolean {
  if (cities.length === 0) return false;
  const validation = validateCities(cities);
  return cities.every((c) => isCityValid(validation[c.id]));
}
