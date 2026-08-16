from pipeline.filter import filter_data
from pipeline.fetch import fetch_data
from pipeline.query import get_query


def run_pipeline(uinput):
    city_poi = {}

    for city, pois in uinput.items():
        query = get_query(city, pois)
        print(query)

        data = fetch_data(query)
        city_poi[city] = filter_data(data)

    return city_poi

