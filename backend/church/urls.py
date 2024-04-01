from django.urls import path
from rest_framework import routers
from .views import church,edit_church

router = routers.DefaultRouter()
# URLs for the meeting app.
# 'church/': Endpoint for CRUD operations on church objects.
urlpatterns = [
    path('church/', church, name='church'),
    path('edit-church/<int:id>', edit_church, name='editChurch')
]
