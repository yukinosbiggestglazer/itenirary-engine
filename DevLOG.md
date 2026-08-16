# Development Log

## 2026-08-15 — Initial POI Pipeline

### Goal

Build the first working version of the POI data pipeline using OpenStreetMap
and the Overpass API.

The initial goal was to move from a hardcoded query for one city to a system where the user can provide multiple cities and choose which POI types they want.

---

## What I Worked On

Started with a hardcoded Overpass query for Chiba and gradually converted it into a dynamic pipeline.

Current structure:

    main.py
       ↓
    query.py
       ↓
    fetch.py
       ↓
    filter.py

The user input is structured as:

    1
    Tokyo
    2
    park
    mall

Internally this becomes:

    {
        "Tokyo": ["park", "mall"]
    }

Multiple cities can have different POI selections.

---

## Overpass API / Query Construction

### Basic Query Structure

An Overpass query generally looks like:

    [out:json][timeout:120];

    area
    ["name:en"="Tokyo"]["boundary"="administrative"]
    ->.searchArea;

    (
        nwr["leisure"="park"]["wikidata"](area.searchArea);
        nwr["shop"="mall"]["wikidata"](area.searchArea);
    );

    out center;

### `[out:json]`

Tells Overpass to return the result as JSON.

This is useful because Python can directly process the response using:

    data = response.json()

### `area`

We first identify the administrative area corresponding to the city.

    area
    ["name:en"="Tokyo"]["boundary"="administrative"]
    ->.searchArea;

The resulting area is stored as:

    .searchArea

and can then be used to restrict all POI searches to that city.

### `nwr`

`nwr` means:

    n = node
    w = way
    r = relation

OpenStreetMap represents places using these three element types.

Using `nwr` means we do not have to separately search:

    node(...)
    way(...)
    relation(...)

This is useful because a POI can be represented differently in OSM.

For example, a park may be represented as a way/polygon while another
POI may be represented as a node.

### OSM Tags

The queries use OSM tags to identify POI types.

Examples:

    ["leisure"="park"]

    ["tourism"="museum"]

    ["shop"="mall"]

    ["amenity"="restaurant"]

The first value is the tag key and the second is its value.

For example:

    ["tourism"="museum"]

means:

    key   = tourism
    value = museum

### `wikidata`

Some queries include:

    ["wikidata"]

This means the OSM element must have a Wikidata identifier.

For example:

    nwr["leisure"="park"]["wikidata"](area.searchArea);

The reason for using this was to reduce noisy/incomplete OSM results and
focus on POIs that have a corresponding Wikidata entity.

Wikidata identifiers can also be useful later for enriching POI information.

However, this is a filtering choice rather than a requirement of the
POI itself. Some valid OSM POIs may not have a Wikidata tag and will
therefore be excluded.

### `brand:wikidata`

Some commercial POIs use:

    ["brand:wikidata"]

instead of:

    ["wikidata"]

For example:

    nwr["shop"="convenience"]["brand:wikidata"](area.searchArea);

This was used for categories such as convenience stores, restaurants,
and cafes where the important Wikidata entity may be the brand rather
than the individual location.

Example:

    brand:wikidata = a known chain/brand

This can help identify established commercial POIs while reducing
random or poorly tagged locations.

### Why Different Tags Were Used

Not every POI category was queried in exactly the same way.

Examples:

    Park:
    ["leisure"="park"]["wikidata"]

    Museum:
    ["tourism"="museum"]["wikidata"]

    Mall:
    ["shop"="mall"]["wikidata"]

    Restaurant:
    ["amenity"="restaurant"]["brand:wikidata"]

The exact OSM tagging depends on the type of POI and how it is commonly
represented in OpenStreetMap.

The current filtering is intentionally somewhat conservative. The goal
for the first pipeline version is to get reasonably useful and
identifiable POIs rather than blindly retrieving every possible OSM
object.

---

## Problems / Difficulties

### 1. Hardcoded City

The original query was hardcoded to Chiba:

    area
    ["name"="千葉市"]
    ["boundary"="administrative"]

This worked but could not support arbitrary cities.

The goal was to make the city part of the query dynamic.

### 2. City Lookup

Initially tried:

    ["name"="Tokyo"]

This did not reliably return the desired area.

Also tried:

    {{geocodeArea:Tokyo}}

This did not work when sending the query directly to the Overpass API.
That syntax is associated with Overpass Turbo rather than being something
to rely on in the direct API request.

The working approach became:

    ["name:en"="Tokyo"]["boundary"="administrative"]

This successfully returned Tokyo's administrative area.

### 3. Building Queries Dynamically

Initially it was unclear how to construct a multiline Overpass query
from Python.

Created a dictionary:

    poi_queries = {
        "park": 'nwr["leisure"="park"]["wikidata"](area.searchArea);',
        "museum": 'nwr["tourism"="museum"]["wikidata"](area.searchArea);',
        "mall": 'nwr["shop"="mall"]["wikidata"](area.searchArea);',
        ...
    }

Then the requested POIs are looked up and appended to the query.

This means the query can be generated from:

    city → list of POIs

without writing separate query logic for every combination.

### 4. Understanding Python Modules

Initially the files were more tightly coupled.

Separated them into:

    query.py
    fetch.py
    filter.py
    main.py

Also learned the purpose of:

    if __name__ == "__main__":

so that the main pipeline can be run directly without automatically
executing when the module is imported.

### 5. JSON vs Direct Data Passing

Initially considered writing the Overpass response to a JSON file and
then letting the filtering code read it.

Eventually the fetched JSON data was passed directly:

    data = fetch_data(query)
    filter_data(data)

This avoids unnecessary disk I/O.

JSON files can still be useful later for debugging, caching, or storing
sample API responses.

---

## Testing

Tested the following:

    City: Tokyo
    POIs:
        park
        mall

Generated query:

    [out:json][timeout:120];

    area
    ["name:en"="Tokyo"]["boundary"="administrative"]
    ->.searchArea;

    (
    nwr["leisure"="park"]["wikidata"](area.searchArea);
    nwr["shop"="mall"]["wikidata"](area.searchArea);
    );

    out center;

Result:

    Fetch status: 200
    Fetched: 424 elements

    park   353
    mall   71

This confirmed that dynamic city and POI query construction is working.

---

## Current Pipeline

    User Input
        ↓
    city → POI dictionary
        ↓
    Query Construction
        ↓
    Overpass API
        ↓
    JSON response
        ↓
    POI Filtering
        ↓
    Categorized POIs

---

## Current Limitations

- `query.py` still gets input directly through `input()`.
- `filter_data()` currently prints results instead of returning structured data.
- Some POI types exist in `poi_queries` but are not fully handled by the
  filtering layer.
- Error handling is still minimal.
- The `wikidata` / `brand:wikidata` requirements may exclude valid POIs.
- City lookup using `name:en` may not work uniformly for every city.
- FastAPI has not been connected yet.

---

## Backend Notes

Once FastAPI is introduced, the API should provide the city and POI
information to the pipeline instead of passing raw Overpass queries.

Something along the lines of:

    {
        "cities": [
            {
                "name": "Tokyo",
                "pois": ["park", "museum"]
            }
        ]
    }

Expected flow:

    Frontend
        ↓
    FastAPI
        ↓
    Pipeline
        ↓
    Overpass API

The API should remain separate from query construction, fetching, and
filtering.

The current `input()` based system can therefore be replaced later with
function arguments received from the FastAPI request.

---

## Git

Initialized Git for the pipeline and connected it to the existing
GitHub repository.

Learned the basic workflow:

    git add
        ↓
    git commit
        ↓
    git push

Also started using conventional commit prefixes such as:

    feat:
    fix:
    refactor:
    docs:
    chore:

---

## Next Steps

- Wait for the backend API design.
- Replace `input()` with API-provided data.
- Make `filter_data()` return structured POI data.
- Finish filtering for all supported POI categories.
- Improve error handling.
- Reconsider the `wikidata` / `brand:wikidata` restrictions based on
  the quality and quantity of returned data.
- Begin the spatial and algorithmic layer once the data pipeline is stable.





# DevLog — 16 August 2026

## Backend + Frontend Integration

Today was focused on turning the existing POI pipeline into an actual backend service and connecting it to the frontend.

### 1. FastAPI Backend

Set up the FastAPI backend separately from the pipeline.

Current structure:

backend/
├── main.py
├── models.py
├── routes/
│   └── pois.py
└── services/
    └── poi_formatter.py

The backend is responsible for exposing the pipeline through API endpoints rather than containing the pipeline logic itself.

The `/pois` endpoint accepts city names and their selected POI categories.

### 2. Pydantic Models

Added Pydantic models to define the structure of requests received by the backend.

The API expects cities and their individual POI selections rather than raw Overpass queries.

Example:

{
    "cities": {
        "Tokyo": ["park", "mall"],
        "Kyoto": ["aquarium"],
        "Chiba": ["park", "zoo"]
    }
}

This keeps the API interface structured and prevents the frontend from needing to know anything about Overpass query syntax.

### 3. Backend Architecture

Separated the responsibilities between routes, services, and the pipeline.

The flow is now:

Frontend
    ↓
POST /pois
    ↓
routes/pois.py
    ↓
services/poi_formatter.py
    ↓
pipeline/main.py
    ↓
query.py → fetch.py → filter.py
    ↓
Overpass API

The route handles the HTTP request, while the service layer handles the interaction with the pipeline and conversion of its output into a frontend-friendly format.

### 4. Overpass API

Ran into HTTP 429 and 504 errors with the public Overpass instance while testing multiple cities.

Switched to the Mail.ru Overpass instance:

https://maps.mail.ru/osm/tools/overpass/api/interpreter

This performed significantly better for the current workload.

A query that was repeatedly hitting limits on the public instance completed in roughly four seconds on the Mail.ru instance.

### 5. Pipeline

The pipeline itself remains separate from the backend.

`pipeline/main.py` takes the city/POI configuration, generates an Overpass query, fetches the data, and filters the returned elements.

`filter.py` continues to return categorized raw OSM elements such as:

{
    "park": [...],
    "mall": [...],
    "zoo": [...]
}

The pipeline does not need to know anything about the frontend.

### 6. POI Formatting

Added `poi_formatter.py` to convert raw pipeline output into normalized API data.

Raw pipeline output:

{
    "Chiba": {
        "mall": [...],
        "zoo": [...]
    }
}

is converted into:

{
    "cities": [
        {
            "name": "Chiba",
            "pois": [
                {
                    "id": "...",
                    "name": "...",
                    "category": "mall",
                    "lat": 35.64,
                    "lon": 140.04
                }
            ]
        }
    ]
}

This means the frontend does not need to understand the structure of raw Overpass responses.

### 7. Frontend Integration

Connected the existing React frontend to the real FastAPI backend.

The frontend now sends:

POST /pois

instead of relying on mock POI data.

Had to configure CORS because the Vite frontend and FastAPI backend run on different ports during development.

After adding CORS middleware, the browser's preflight request succeeded and the actual POST request returned `200 OK`.

### 8. End-to-End Test

Successfully ran the complete system:

Frontend → FastAPI → POI service → Pipeline → Overpass → Pipeline filtering → POI formatting → Frontend.

The frontend successfully received and displayed hundreds of real OSM POIs.

One test returned approximately 390 POIs.

## Current Status

The basic POI discovery system is now functional end-to-end.

Completed:

- Dynamic multi-city input
- Per-city POI selection
- Dynamic Overpass query generation
- Overpass data fetching
- POI categorization
- FastAPI backend
- Pydantic request validation
- Backend route/service separation
- POI response normalization
- CORS configuration
- Frontend ↔ backend integration
- Real OSM POI data displayed in the frontend

## Next Steps

The next major stage is moving beyond simple POI discovery.

Potential next steps:

1. Clean up and harden the API.
2. Improve POI filtering and normalization.
3. Add spatial processing / POI density calculations.
4. Build the itinerary generation logic.
5. Add routing and distance calculations.
6. Develop the recommendation/scoring system.