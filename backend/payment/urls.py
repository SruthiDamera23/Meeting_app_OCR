from django.urls import path
from .views import *

urlpatterns = [
    path('charge/', charge_card, name='charge_card'),
    path('payments/', get_all_payments, name='get_all_payments'),
]
