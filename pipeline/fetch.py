import requests
import pandas as pd
import json

def fetch_data(query) :
    headers = {
        "User-Agent": "ItenEngine/1.1"
    }

    url = "https://overpass-api.de/api/interpreter"

    response = requests.get(
        url,
        params = {"data": query},
        headers = headers,
        timeout = 180
    )

    print("Fetch status:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))

    data = response.json();
    print("Fetched:", len(data["elements"]), "elements")

    # maybe we'll use this later? or not idk
    # with open("chiba_pois.json", "w", encoding="utf-8") as f:
    #     json.dump(data, f, ensure_ascii=False, indent=2)

    return data