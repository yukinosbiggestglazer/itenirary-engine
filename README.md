# Itinerary Engine

POI discovery and itinerary planning engine built around **OpenStreetMap + Overpass API**.

## Current Progress

- [x] Dynamic city input
- [x] Dynamic POI selection
- [x] Dynamic Overpass query generation
- [x] Multiple-city support
- [x] POI data fetching
- [x] Basic POI categorization
- [x] FastAPI backend
- [x] Frontend ↔ Backend integration
- [x] Normalized POI API response
- [ ] POI density / spatial algorithms
- [ ] Itinerary generation
- [ ] Recommendation system

## Structure

    .
    ├── backend/
    │   ├── main.py
    │   ├── models.py
    │   ├── routes/
    │   │   └── pois.py
    │   └── services/
    │       ├── pois.py
    │       └── poi_formatter.py
    │
    ├── pipeline/
    │   ├── main.py
    │   ├── query.py
    │   ├── fetch.py
    │   ├── filter.py
    │   └── __init__.py
    │
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── ...
    │
    └── README.md

## Architecture

    Frontend
        │
        │ POST /pois
        ▼
    FastAPI
        │
        ▼
    Route
        │
        ▼
    Service
        │
        ▼
    Pipeline
        ├── Query generation
        ├── Overpass data fetching
        └── POI filtering
        │
        ▼
    OpenStreetMap / Overpass API

The **frontend** handles user input and visualization.

The **backend** exposes the pipeline through an API and handles request validation, routing, and response formatting.

The **pipeline** handles query construction, Overpass data fetching, and POI filtering.

## Stack

- **Frontend:** React · TypeScript · Vite · Tailwind CSS
- **Backend:** Python · FastAPI · Pydantic
- **Pipeline:** Python · OpenStreetMap · Overpass API

## API

### `POST /pois`

Accepts multiple cities, with each city having its own POI selection.

Example request:

    {
      "cities": [
        {
          "name": "Tokyo",
          "pois": ["park", "mall"]
        },
        {
          "name": "Kyoto",
          "pois": ["aquarium"]
        }
      ]
    }

The backend runs the pipeline for each city and returns normalized POI data.

## Backend Notes

- API accepts **cities + POI types**, not raw Overpass queries.
- Keep FastAPI separate from the pipeline logic.
- Let the pipeline handle query construction, fetching, and filtering.
- Normalize POI data before returning it to the frontend.
- Avoid `input()` once the API is connected.
- Keep routing and business logic separate from the pipeline.