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
    """Return a random destination in Canada with a description."""

    curated_destinations = [
        {"city": "Banff", "description": "A stunning resort town in Alberta's Rockies, famous for its national park and hot springs."},
        {"city": "Whistler", "description": "A world-renowned ski resort in British Columbia, also popular in summer for mountain biking and hiking."},
        {"city": "Jasper", "description": "A picturesque town in Jasper National Park, Alberta, known for its wildlife and outdoor adventure."},
        {"city": "Niagara Falls", "description": "Home to the iconic waterfalls on the Ontario-US border, a must-see natural wonder."},
        {"city": "Tofino", "description": "A laid-back surf town on Vancouver Island, BC, known for its beaches, wildlife, and scenery."},
        {"city": "Quebec City", "description": "A historic city with cobblestone streets and a European feel, famous for its old town and Château Frontenac."},
        {"city": "Charlottetown", "description": "The capital of Prince Edward Island, known for its maritime charm and Anne of Green Gables heritage."},
    ]

    geonames_username = os.environ.get("GEONAMES_USERNAME")
    if geonames_username:
        try:
            response = requests.get(
                f"http://api.geonames.org/searchJSON?country=CA&featureClass=P&maxRows=1000&orderby=population&username={geonames_username}",
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
            destinations = curated_destinations + [
                {"city": "Vancouver", "description": "A vibrant west coast seaport in British Columbia, surrounded by mountains and ocean."},
                {"city": "Toronto", "description": "Canada's largest city, famous for its skyline and multicultural atmosphere."},
                {"city": "Montreal", "description": "A lively city in Quebec, known for its culture, festivals, and food scene."},
                {"city": "Calgary", "description": "Alberta's largest city, gateway to the Rockies and home of the Calgary Stampede."},
                {"city": "Ottawa", "description": "Canada's capital, known for its historic landmarks and vibrant arts scene."},
                {"city": "Edmonton", "description": "Alberta's capital, with a lively arts community and access to national parks."},
                {"city": "Winnipeg", "description": "Manitoba's capital, known for its arts scene and diverse culture."},
                {"city": "Victoria", "description": "A picturesque city on Vancouver Island, famous for its gardens and harbor."},
            ]
    else:
        destinations = curated_destinations + [
            {"city": "Vancouver", "description": "A vibrant west coast seaport in British Columbia, surrounded by mountains and ocean."},
            {"city": "Toronto", "description": "Canada's largest city, famous for its skyline and multicultural atmosphere."},
            {"city": "Montreal", "description": "A lively city in Quebec, known for its culture, festivals, and food scene."},
            {"city": "Calgary", "description": "Alberta's largest city, gateway to the Rockies and home of the Calgary Stampede."},
            {"city": "Ottawa", "description": "Canada's capital, known for its historic landmarks and vibrant arts scene."},
            {"city": "Edmonton", "description": "Alberta's capital, with a lively arts community and access to national parks."},
            {"city": "Winnipeg", "description": "Manitoba's capital, known for its arts scene and diverse culture."},
            {"city": "Victoria", "description": "A picturesque city on Vancouver Island, famous for its gardens and harbor."},
        ]
    
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
