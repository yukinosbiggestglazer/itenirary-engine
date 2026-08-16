# Itinerary Engine

POI discovery and itinerary planning engine built around **OpenStreetMap + Overpass API**.

## Current Progress

* [x] Dynamic city input
* [x] Dynamic POI selection
* [x] Dynamic Overpass query generation
* [x] Multiple-city support
* [x] POI data fetching
* [x] Basic POI categorization
* [x] FastAPI backend
* [x] Frontend ↔ Backend integration
* [x] Normalized POI API response
* [ ] POI density / spatial algorithms
* [ ] Itinerary generation
* [ ] Recommendation system

## Structure

```text
.
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   │   └── pois.py
│   └── services/
│       └── poi_formatter.py
│
├── pipeline/
│   ├── main.py
│   ├── query.py
│   ├── fetch.py
│   └── filter.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md





Architecture



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
POI Formatter
    │
    ▼
Pipeline
    ├── Query generation
    ├── Overpass data fetching
    └── POI filtering
    │
    ▼
OpenStreetMap / Overpass API






The pipeline is responsible for data acquisition and processing.

The backend exposes the pipeline through an API and converts pipeline output into a normalized format for the frontend.

The frontend handles user input and visualization.

Stack
Frontend: React · TypeScript · Vite · Tailwind CSS
Backend: Python · FastAPI · Pydantic
Pipeline: Python · OpenStreetMap · Overpass API
API
POST /pois

Accepts multiple cities, each with its own POI categories.

Example request:

```
{
  "cities": {
    "Tokyo": ["park", "mall"],
    "Kyoto": ["aquarium"],
    "Chiba": ["park", "zoo"]
  }
}
```

The backend runs the pipeline for each city and returns normalized POI data.

Backend Notes
API accepts cities + POI types, not raw Overpass queries.
Keep FastAPI separate from the pipeline logic.
Let the pipeline handle query construction, fetching, and filtering.
The service layer converts pipeline output into normalized POI data.
Avoid input() once the API is connected.
Use the API layer as the interface between the frontend and pipeline.