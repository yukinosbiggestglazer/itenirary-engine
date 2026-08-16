/**
 * Cities are assigned a color from this fixed sequence, in the order they were
 * added. Reused as both the sidebar "line map" dot color and the map marker
 * color, so a city reads as the same color everywhere in the UI.
 */
export const CITY_COLOR_SEQUENCE = [
  '#D4A857', // gold
  '#4FA3A1', // teal
  '#C15B3E', // terracotta
  '#8098D6', // periwinkle
  '#8FAE6B', // sage
  '#B583B0', // plum
] as const;

export function cityColor(index: number): string {
  return CITY_COLOR_SEQUENCE[index % CITY_COLOR_SEQUENCE.length];
}
