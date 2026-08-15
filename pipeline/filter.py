import pandas as pd
import json 
import requests


def filter_data(data):
    # access from json for future purposes?
    # with open("chiba_pois.json") as f:
    #     data = json.load(f)

    sample_pois = data["elements"]

    pois = {
        "park": [],
        "garden": [],
        "convenience": [],
        "mall": [],
        "buddhist_temple": [],
        "shinto_shrine": [],
        "aquarium": [],
        "zoo": [],
        "museum": [],
        "castle": [],
        "restaurant": [],
        "cafe": []
    }

    for element in sample_pois:
        tags = element.get("tags", {})

        if tags.get("leisure") == "park":
            pois["park"].append(element)
        elif tags.get("leisure") == "garden":
            pois["garden"].append(element)
        elif tags.get("shop") == "convenience":
            pois["convenience"].append(element)
        elif tags.get("shop") == "mall":
            pois["mall"].append(element)
        elif (tags.get("amenity") == "place_of_worship"
              and tags.get("religion") == "buddhist"):
            pois["buddhist_temple"].append(element)
        elif (tags.get("amenity") == "place_of_worship"
              and tags.get("religion") == "shinto"):
            pois["shinto_shrine"].append(element)
        elif tags.get("tourism") == "aquarium":
            pois["aquarium"].append(element)
        elif tags.get("tourism") == "zoo":
            pois["zoo"].append(element)
        elif tags.get("tourism") == "museum":
            pois["museum"].append(element)
        elif tags.get("historic") == "castle":
            pois["castle"].append(element)
        elif tags.get("amenity") == "restaurant":
            pois["restaurant"].append(element)
        elif tags.get("amenity") == "cafe":
            pois["cafe"].append(element)

    for key, value in pois.items():
        print(key, len(value))

    return pois
