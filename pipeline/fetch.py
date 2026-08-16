import requests
import time
import json

def fetch_data(query) :
    for attempt in range (3):
        try: 
            headers = {
                    "User-Agent": "ItenEngine/1.1"
                }
            url = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
            response = requests.get(
                url,
                params = {"data": query},
                headers = headers,
                timeout = 180
            )
            if response.status_code == 200:
                data = response.json()
                print("Fetched:", len(data["elements"]), "elements")
                return data

            print(
                f"Overpass returned HTTP {response.status_code}"
            )
            print(response.text[:500])
            
        except requests.RequestException as e:
            print ("Request failed: ", e)

        if attempt < 2:
            delay = 10 * (attempt + 1)
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)

    print("All attempts failed.")

    # maybe we'll use this later? or not idk
    # with open("chiba_pois.json", "w", encoding="utf-8") as f:
    #     json.dump(data, f, ensure_ascii=False, indent=2)

    return None