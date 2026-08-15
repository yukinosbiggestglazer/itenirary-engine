import numpy as np
import pandas as pd

from filter import filter_data
from fetch import fetch_data
from query import get_query

if __name__ == "__main__":
    n = int(input("Number of cities: "))

    for i in range(n):
        city = input("City: ")
        m = int(input("Number of POIs: "))
        pois = []

        for j in range(m):
            pois.append(input("POI: "))

        query = get_query(city, pois)
        print(query)
        data = fetch_data(query)

        if data is not None:
            filter_data(data)

        # algorith(pois) -> in the future