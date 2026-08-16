# Itenirary — Frontend (Phase 1)

A dark, map-centric interface for configuring multi-city trips: add any number
of cities, choose points of interest independently per city, and fetch the
matching POIs from the backend pipeline.

This is **Phase 1** of the frontend. It covers city/POI configuration and
displaying returned POIs on a map and in a results list. It does **not**
implement itinerary optimization, routing, or scoring — that UI will be built
once the algorithm and its response format are finalized.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Leaflet / React-Leaflet (dark CARTO basemap) for the map
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Connecting to the backend

Copy `.env.example` to `.env` and set the FastAPI base URL:

```bash
VITE_API_URL=http://localhost:8000
```

The frontend will `POST {VITE_API_URL}/pois` with:

```json
{
  "cities": [
    { "name": "Tokyo", "pois": ["park", "mall"] },
    { "name": "Kyoto", "pois": ["museum", "castle"] }
  ]
}
```

and expects back:

```json
{
  "cities": [
    {
      "name": "Tokyo",
      "pois": [
        { "id": "...", "name": "Ueno Park", "category": "park", "lat": 35.71, "lon": 139.77 }
      ]
    }
  ]
}
```

`lat`/`lon` are optional per POI — results without coordinates still show in
the results panel, just without a map marker.

**If `VITE_API_URL` is unset**, the app transparently falls back to a local
mock (`src/api/mockPois.ts`) so the UI can be built and tested before the
backend is reachable. Every other part of the app is unaware this fallback
exists — it only talks to `src/api/pois.ts`.

## Project structure

```text
src/
├── api/
│   ├── pois.ts          # The only module that knows about POST /pois
│   └── mockPois.ts       # Dev-only mock, used solely by pois.ts
├── components/
│   ├── Sidebar/          # Brand header, city list (line-map), fetch action
│   ├── CityCard/          # One city's name input + POI selector + validation
│   ├── POISelector/       # Independent per-city chip multi-select
│   ├── Map/               # Leaflet map, city-colored markers, status overlay
│   └── ResultsPanel/      # Returned POIs grouped by city
├── types/
│   └── index.ts           # POI categories, request/response contracts
├── utils/
│   ├── cityColors.ts       # Stable color-per-city assignment
│   └── validation.ts       # City name / POI / duplicate validation
├── App.tsx                 # Top-level state + layout
└── main.tsx
```

## Design notes

- Each city is assigned a color (from a fixed 6-color sequence) the moment
  it's added. That color is reused for its station dot in the sidebar, its
  markers on the map, and its section heading in the results panel, so a
  city reads as the same color everywhere.
- Validation (empty name, no POIs selected, duplicate city) is inline per
  city and only surfaces after the first "Fetch POIs" attempt, so an empty
  first card doesn't greet the user with errors.
- On narrow viewports the three-column layout stacks vertically: sidebar,
  then map, then results.

## Known limitations (by design, for Phase 1)

- No itinerary optimization, routing, or ranking — only raw POI retrieval.
- City input is a plain text field, not a geocoding-backed search.
- The mock API's coordinates are approximate placeholders for a handful of
  well-known cities, purely to make the map useful during UI development.
