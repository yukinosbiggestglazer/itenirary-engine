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
        "museum": [],
        "aquarium": [],
        "place_of_worship": [],
        "convenience": [],
        "mall": [],
        "cafe": [],
        "restaurant": []
    }

    for i in range(0, len(sample_pois)):
        element = sample_pois[i]

        if (element["tags"].get("leisure") == "park"):
            pois["park"].append(element)
        elif (element["tags"].get("tourism") == "museum"):
            pois["museum"].append(element)
        elif (element["tags"].get("tourism") == "aquarium"):
            pois["aquarium"].append(element)
        elif (element["tags"].get("amenity") == "place_of_worship"):
            pois["place_of_worship"].append(element)
        elif (element["tags"].get("shop") == "convenience"):
            pois["convenience"].append(element)
        elif (element["tags"].get("shop") == "mall"):
            pois["mall"].append(element)
        elif (element["tags"].get("amenity") == "cafe"):
            pois["cafe"].append(element)
        elif (element["tags"].get("amenity") == "restaurant"):
            pois["restaurant"].append(element)

    for key,value in pois.items():
        print (key, " ", len(value))
