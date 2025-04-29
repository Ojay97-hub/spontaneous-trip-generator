from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
import os
import requests
import json

# Create your views here.

# Helper to fetch Wikipedia summary with max length
MAX_DESC_LENGTH = 300

def get_wikipedia_summary(title, admin1=None):
    """
    Fetch Wikipedia summary for a place. Try plain title first,
    then 'title, admin1' if the first result is disambiguation or missing.
    """
    def fetch_summary(query):
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '%20')}"
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
            print(f"[Wiki] Error fetching summary for {query}: {e}")
        return None

    # Try plain title first
    summary = fetch_summary(title)
    if not summary and admin1:
        # Try 'Title, Admin1' (e.g., 'Whistler, British Columbia')
        summary = fetch_summary(f"{title}, {admin1}")
    return summary

# Claude AI description generator
def get_claude_description(city, admin1=None, wiki_summary=None):
    """
    Generate a location description using Claude AI, including links to popular tourist sites.
    """
    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("[Claude] API key not found.")
        return None
    prompt = f"""
    Write a vibrant, engaging, and concise travel description for the following location suitable for a spontaneous trip generator app.
    City: {city}
    Province/Region: {admin1 or ''}
    """
    if wiki_summary:
        prompt += f"\nWikipedia summary: {wiki_summary}\n"
    prompt += (
        "\nInclude 2-4 of the most popular tourist attractions or local highlights in this location, and for each, provide a direct clickable markdown link to the official website or a reliable tourism source. "
        "Format the links as [Attraction Name](https://example.com). "
        "Keep the overall description under 350 characters before the links. "
        "Then, add the links on new lines after the description."
    )
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    data = {
        "model": "claude-3-haiku-20240307",
        "max_tokens": 400,
        "temperature": 0.8,
        "system": "You are a helpful travel assistant.",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    print(f"[Claude] Calling Claude for city: {city}, admin1: {admin1}")
    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            data=json.dumps(data),
            timeout=12
        )
        print(f"[Claude] Response status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"[Claude] Raw API result: {result}")
            ai_content = result.get("content", [])
            if ai_content and isinstance(ai_content, list):
                text = ai_content[0].get("text", None)
                print(f"[Claude] AI description: {text}")
                return text
        else:
            print(f"[Claude] API error: {response.status_code} {response.text}")
    except Exception as e:
        print(f"[Claude] Exception: {e}")
    return None

@api_view(["GET"])
def random_destination(request):
    """Return a random destination in the selected country with a description."""

    country_code = request.GET.get('country', 'CA')
    # Map of supported country codes to GeoNames API country codes and curated destinations
    country_data = {
        'CA': {
            'geonames_code': 'CA',
            'curated': [
                {"city": "Vancouver", "description": "A vibrant west coast seaport in British Columbia, surrounded by mountains and ocean."},
                {"city": "Toronto", "description": "Canada's largest city, famous for its skyline and multicultural atmosphere."},
                {"city": "Montreal", "description": "A lively city in Quebec, known for its culture, festivals, and food scene."},
                {"city": "Calgary", "description": "Alberta's largest city, gateway to the Rockies and home of the Calgary Stampede."},
                {"city": "Ottawa", "description": "Canada's capital, known for its historic landmarks and vibrant arts scene."},
                {"city": "Edmonton", "description": "Alberta's capital, with a lively arts community and access to national parks."},
                {"city": "Winnipeg", "description": "Manitoba's capital, known for its arts scene and diverse culture."},
                {"city": "Victoria", "description": "A picturesque city on Vancouver Island, famous for its gardens and harbor."},
            ]
        },
        'US': {
            'geonames_code': 'US',
            'curated': [
                {"city": "New York", "description": "The city that never sleeps, famous for Times Square, Central Park, and its skyline."},
                {"city": "San Francisco", "description": "Known for the Golden Gate Bridge, steep streets, and vibrant culture."},
                {"city": "Chicago", "description": "The Windy City, known for its architecture and deep-dish pizza."},
                {"city": "Los Angeles", "description": "The entertainment capital, home to Hollywood and beautiful beaches."},
                {"city": "Miami", "description": "A vibrant city with stunning beaches, nightlife, and Cuban culture."},
            ]
        },
        'GB': {
            'geonames_code': 'GB',
            'curated': [
                {"city": "London", "description": "The historic capital, famous for Big Ben, the Thames, and world-class museums."},
                {"city": "Edinburgh", "description": "Scotland's capital, known for its castle and festivals."},
                {"city": "Manchester", "description": "A lively city famous for football and music."},
            ]
        },
        'FR': {
            'geonames_code': 'FR',
            'curated': [
                {"city": "Paris", "description": "The City of Light, known for the Eiffel Tower, art, and cuisine."},
                {"city": "Nice", "description": "A beautiful city on the French Riviera, famous for its beaches and old town."},
            ]
        },
        'IT': {
            'geonames_code': 'IT',
            'curated': [
                {"city": "Rome", "description": "The Eternal City, home to ancient ruins and vibrant piazzas."},
                {"city": "Venice", "description": "A romantic city of canals and bridges."},
            ]
        },
        'JP': {
            'geonames_code': 'JP',
            'curated': [
                {"city": "Tokyo", "description": "Japan's bustling capital, known for its blend of tradition and modernity."},
                {"city": "Kyoto", "description": "Famous for its temples, gardens, and geisha culture."},
            ]
        },
        'ES': {
            'geonames_code': 'ES',
            'curated': [
                {"city": "Barcelona", "description": "Known for Gaudí architecture and Mediterranean beaches."},
                {"city": "Madrid", "description": "Spain's capital, famous for art, parks, and tapas."},
            ]
        },
        'AU': {
            'geonames_code': 'AU',
            'curated': [
                {"city": "Sydney", "description": "Home to the Opera House and beautiful beaches."},
                {"city": "Melbourne", "description": "A cultural capital known for coffee and arts."},
            ]
        },
        'DE': {
            'geonames_code': 'DE',
            'curated': [
                {"city": "Berlin", "description": "Germany's capital, rich in history and culture."},
                {"city": "Munich", "description": "Known for Oktoberfest and Bavarian charm."},
            ]
        },
        'BR': {
            'geonames_code': 'BR',
            'curated': [
                {"city": "Rio de Janeiro", "description": "Famous for its Carnival, beaches, and Christ the Redeemer."},
                {"city": "São Paulo", "description": "Brazil's largest city, known for culture and food."},
            ]
        },
    }

    country_info = country_data.get(country_code, country_data['CA'])
    geonames_code = country_info['geonames_code']
    curated_destinations = country_info['curated']

    geonames_username = os.environ.get("GEONAMES_USERNAME", "demo")
    destinations = []
    try:
        response = requests.get(
            f"http://api.geonames.org/searchJSON?country={geonames_code}&featureClass=P&maxRows=1000&orderby=population&username={geonames_username}",
            timeout=5
        )
        response.raise_for_status()
        data = response.json()
        cities = data.get("geonames", [])
        major_cities = [
            {
                "city": city.get("name", "Unknown"),
                "description": f"{city.get('name', 'Unknown')} in {city.get('adminName1', '')}. Population: {city.get('population', 'N/A')}.",
                "adminName1": city.get("adminName1", "")
            }
            for city in cities if city.get("population", 0) and int(city["population"]) >= 100000
        ]
        destinations = major_cities + curated_destinations
    except requests.exceptions.RequestException as e:
        print(f"[GeoNames] API failed, falling back to hardcoded list. Error: {e}")
        destinations = curated_destinations

    selected = random.choice(destinations)
    try:
        ai_desc = get_claude_description(selected["city"], selected.get("adminName1"))
        if ai_desc:
            print(f"[random_destination] Using Claude description for {selected['city']}")
            selected["description"] = ai_desc
        else:
            print(f"[random_destination] Falling back to Wikipedia for {selected['city']}")
            wiki_desc = get_wikipedia_summary(selected["city"], selected.get("adminName1"))
            if wiki_desc:
                print(f"[random_destination] Using Wikipedia description for {selected['city']}")
                selected["description"] = wiki_desc
    except Exception as e:
        print(f"[Claude/Wiki] AI/Wiki API failed. Error: {e}")
    finally:
        selected.pop("adminName1", None)
    return Response(selected)
