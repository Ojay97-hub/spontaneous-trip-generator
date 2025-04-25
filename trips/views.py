from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
import os
import requests

# Create your views here.

# Helper to fetch Wikipedia summary with max length
MAX_DESC_LENGTH = 300

def get_wikipedia_summary(title):
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title.replace(' ', '%20')}"
        resp = requests.get(url, timeout=4)
        if resp.status_code == 200:
            data = resp.json()
            summary = data.get("extract")
            if summary and not data.get("type") == "disambiguation":
                # Truncate summary if too long
                if len(summary) > MAX_DESC_LENGTH:
                    summary = summary[:MAX_DESC_LENGTH].rsplit(' ', 1)[0] + '...'
                return summary
    except Exception as e:
        print(f"[Wiki] Error fetching summary for {title}: {e}")
    return None

@api_view(["GET"])
def random_destination(request):
    geonames_username = os.environ.get("GEONAMES_USERNAME")
    # Curated popular locations (not necessarily big cities)
    curated_destinations = [
        {"city": "Banff", "description": "A stunning resort town in Alberta's Rockies, famous for its national park and hot springs."},
        {"city": "Whistler", "description": "A world-renowned ski resort in British Columbia, also popular in summer for mountain biking and hiking."},
        {"city": "Jasper", "description": "A picturesque town in Jasper National Park, Alberta, known for its wildlife and outdoor adventure."},
        {"city": "Niagara Falls", "description": "Home to the iconic waterfalls on the Ontario-US border, a must-see natural wonder."},
        {"city": "Tofino", "description": "A laid-back surf town on Vancouver Island, BC, known for its beaches, wildlife, and scenery."},
        {"city": "Quebec City", "description": "A historic city with cobblestone streets and a European feel, famous for its old town and Château Frontenac."},
        {"city": "Charlottetown", "description": "The capital of Prince Edward Island, known for its maritime charm and Anne of Green Gables heritage."},
    ]
    POPULATION_THRESHOLD = 100000
    # Fallback hardcoded big cities (with descriptions)
    fallback_destinations = [
        {"city": "Vancouver", "description": "A vibrant west coast seaport in British Columbia, surrounded by mountains and ocean."},
        {"city": "Toronto", "description": "Canada's largest city, famous for its skyline and multicultural atmosphere."},
        {"city": "Montreal", "description": "A lively city in Quebec, known for its culture, festivals, and food scene."},
        {"city": "Calgary", "description": "Alberta's largest city, gateway to the Rockies and home of the Calgary Stampede."},
        {"city": "Ottawa", "description": "Canada's capital, known for its historic landmarks and vibrant arts scene."},
        {"city": "Edmonton", "description": "Alberta's capital, with a lively arts community and access to national parks."},
        {"city": "Winnipeg", "description": "Manitoba's capital, known for its arts scene and diverse culture."},
        {"city": "Victoria", "description": "A picturesque city on Vancouver Island, famous for its gardens and harbor."},
    ]

    if geonames_username:
        try:
            url = f"http://api.geonames.org/searchJSON?country=CA&featureClass=P&maxRows=1000&orderby=population&username={geonames_username}"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            cities = data.get("geonames", [])
            # Filter for major cities (above population threshold)
            major_cities = [
                {
                    "city": city.get("name", "Unknown"),
                    "description": f"{city.get('name', 'Unknown')} in {city.get('adminName1', '')}. Population: {city.get('population', 'N/A')}."
                }
                for city in cities if city.get("population", 0) and int(city["population"]) >= POPULATION_THRESHOLD
            ]
            # Combine with curated destinations
            combined = major_cities + curated_destinations
            if combined:
                selected = random.choice(combined)
                # Try to get Wikipedia summary
                wiki_desc = get_wikipedia_summary(selected["city"])
                if wiki_desc:
                    selected["description"] = wiki_desc
                print(f"[GeoNames] Selected: {selected['city']}, Source: {'GeoNames API' if selected in major_cities else 'Curated List'}")
                return Response(selected)
        except Exception as e:
            print(f"[GeoNames] API failed, falling back to hardcoded list. Error: {e}")
    # Fallback: combine hardcoded big cities and curated destinations
    combined = fallback_destinations + curated_destinations
    selected = random.choice(combined)
    wiki_desc = get_wikipedia_summary(selected["city"])
    if wiki_desc:
        selected["description"] = wiki_desc
    print(f"[GeoNames] Selected: {selected['city']}, Source: Hardcoded/Curated List")
    return Response(selected)
