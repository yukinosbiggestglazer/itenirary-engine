from pipeline.main import run_pipeline


def get_pois(cities):
    pipeline_result = run_pipeline(cities)

    result = []

    for city_name, categories in pipeline_result.items():
        city_pois = []

        for category, elements in categories.items():
            for element in elements:
                tags = element.get("tags", {})
                center = element.get("center", {})

                city_pois.append({
                    "id": str(element["id"]),
                    "name": tags.get("name:en") or tags.get("name") or "Unknown",
                    "category": category,
                    "lat": center.get("lat"),
                    "lon": center.get("lon"),
                })

        result.append({
            "name": city_name,
            "pois": city_pois,
        })

    return {"cities": result}