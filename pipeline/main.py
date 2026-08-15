import numpy as np
import pandas as pd

from filter import filter_data
from fetch import fetch_data
from query import get_queries

if __name__ == "__main__":
    queries = get_queries()

    print(queries[0])

    for query in queries:
        data = fetch_data(query)
        filter_data(data)