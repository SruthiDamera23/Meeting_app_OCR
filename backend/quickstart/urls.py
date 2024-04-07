from django.urls import path, include
from .views import get_users, signup, login_view, logout_view, delete_user, update_user
# from .views import TaskViewSet
from rest_framework import routers

router = routers.DefaultRouter()
# router.register('tasks', TaskViewSet)

urlpatterns = [
    path('users/<int:cid>', get_users, name='users'),
    path('deleteuser/<int:user_id>/', delete_user, name='deleteuser'),
    path('updateuser/', update_user, name="updateuser"),
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    # path('', include(router.urls))
]
