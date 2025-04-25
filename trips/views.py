from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random

# Create your views here.

@api_view(["GET"])
def random_destination(request):
    destinations = [
        {"city": "Vancouver", "description": "A vibrant west coast seaport in British Columbia, surrounded by mountains and ocean."},
        {"city": "Toronto", "description": "Canada's largest city, famous for its skyline and multicultural atmosphere."},
        {"city": "Montreal", "description": "A lively city in Quebec known for its culture, cuisine, and festivals."},
        {"city": "Calgary", "description": "A cosmopolitan Alberta city with a booming oil industry and proximity to the Rockies."},
        {"city": "Halifax", "description": "A major port city in Nova Scotia, rich in maritime history and charm."},
        {"city": "Quebec City", "description": "A historic city with cobblestone streets and a European feel."},
        {"city": "Ottawa", "description": "The capital of Canada, home to Parliament Hill and national museums."},
        {"city": "Winnipeg", "description": "Manitoba's capital, known for its arts scene and diverse culture."},
        {"city": "Victoria", "description": "A picturesque city on Vancouver Island, famous for its gardens and harbor."},
    ]
    return Response(random.choice(destinations))
