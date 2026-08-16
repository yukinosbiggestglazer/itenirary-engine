from pipeline.main import run_pipeline

def generate_itinerary(cities):
    result = run_pipeline(cities)
    return result