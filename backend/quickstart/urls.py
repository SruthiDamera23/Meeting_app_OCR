from django.urls import path, include
from .views import signup, login_view, logout_view
# from .views import TaskViewSet
from rest_framework import routers

router = routers.DefaultRouter()
# router.register('tasks', TaskViewSet)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    # path('', include(router.urls)),

]
