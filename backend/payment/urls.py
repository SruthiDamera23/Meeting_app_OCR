from django.urls import path
from .views import charge_card

urlpatterns = [
    path('charge/', charge_card, name='charge_card'),
]
