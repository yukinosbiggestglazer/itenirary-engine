# hardcoded query (there can only be so many types of attractions)
poi_queries = {
    "park": 'nwr["leisure"="park"]["wikidata"](area.searchArea);',
    "garden": 'nwr["leisure"="garden"]["wikidata"](area.searchArea);',
    "convenience": 'nwr["shop"="convenience"]["brand:wikidata"](area.searchArea);',
    "mall": 'nwr["shop"="mall"]["wikidata"](area.searchArea);',
    "buddhist_temple": 'nwr["amenity"="place_of_worship"]["religion"="buddhist"]["wikidata"](area.searchArea);',
    "shinto_shrine": 'nwr["amenity"="place_of_worship"]["religion"="shinto"]["wikidata"](area.searchArea);',
    "aquarium": 'nwr["tourism"="aquarium"]["wikidata"](area.searchArea);',
    "zoo": 'nwr["tourism"="zoo"]["wikidata"](area.searchArea);',
    "museum": 'nwr["tourism"="museum"]["wikidata"](area.searchArea);',
    "castle": 'nwr["historic"="castle"]["wikidata"](area.searchArea);',
    "restaurant": 'nwr["amenity"="restaurant"]["brand:wikidata"](area.searchArea);',
    "cafe": 'nwr["amenity"="cafe"]["brand:wikidata"](area.searchArea);'
}

def get_places_pois():
    n = int(input())
    city = {}

    for i in range(n):
        c = input()
        n = int(input())
        pois = []

        for j in range(n):
            pois.append(input())

        city[c] = pois
    return city


city = get_places_pois()

def get_queries(): 
    qr = []
    for key,value in city.items(): 
        query = "[out:json][timeout:120];\n\narea\n"
        query += '["name:en"="' + key + '"]'
        query += '["boundary"="administrative"]\n->.searchArea;\n\n(\n'
        for poi in value:
            query += poi_queries[poi]
            query += "\n"

        query += ");\nout center;"
        qr.append(query)
    return qr

# q = get_queries()
# print(q[0])




# if youre seeing this i love yukino