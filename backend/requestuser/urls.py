from django.urls import path, include
from .views import get_requests, signup, login_view, logout_view
# from .views import TaskViewSet
from rest_framework import routers

router = routers.DefaultRouter()
# router.register('tasks', TaskViewSet)

urlpatterns = [
    path('signup-approve/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('requests/', get_requests, name='requests'),
    path('deleterequest/<int:pk>/', get_requests, name='requests'),
    
    # path('', include(router.urls)),

]
