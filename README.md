# Itenirary Engine

POI discovery and itinerary planning engine built around **OpenStreetMap + Overpass API**.

## Current Progress

* [x] Dynamic city input
* [x] Dynamic POI selection
* [x] Dynamic Overpass query generation
* [x] Multiple-city support
* [x] POI data fetching
* [x] Basic POI categorization
* [ ] FastAPI backend
* [ ] POI density / spatial algorithms
* [ ] Itinerary generation
* [ ] Recommendation system

## Structure

```text
pipeline/
├── main.py
├── query.py
├── fetch.py
└── filter.py
```

## Stack

Python · OpenStreetMap · Overpass API · FastAPI

Backend Notes
API should accept cities + POI types, not raw Overpass queries.
Keep FastAPI separate from the pipeline logic.
Let the pipeline handle query construction, fetching, and filtering.
Return normalized POI data rather than raw Overpass responses.
Avoid input() once the API is connected.
