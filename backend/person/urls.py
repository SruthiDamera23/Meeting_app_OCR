from django.urls import path
from rest_framework import routers
from .views import person

router = routers.DefaultRouter()
# URLs for the meeting app.
# 'meeting/': Endpoint for CRUD operations on meeting objects.
urlpatterns = [
    path('person/', person, name='person')
]

