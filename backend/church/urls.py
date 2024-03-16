from django.urls import path
from rest_framework import routers
from .views import church

router = routers.DefaultRouter()
# URLs for the meeting app.
# 'church/': Endpoint for CRUD operations on church objects.
urlpatterns = [
    path('church/', church, name='church')
]
