from django.urls import path
from .views import random_destination

urlpatterns = [
    path('random-destination/', random_destination, name='random_destination'),
]
