# myapp/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import login
from .serializers import UserSerializer
from .backend import CustomAuthBackend
from django.http import HttpRequest
from django.contrib.auth import logout
from rest_framework import viewsets
# from .models import Task
# from .serializers import TaskSerializer


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('username')
    password = request.data.get('password')
    django_request = HttpRequest()
    django_request.method = request.method
    django_request.POST = request.POST
    django_request.COOKIES = request.COOKIES
    django_request.session = request.session
    django_request.META = request.META

    django_request.user = request.user
    django_request.auth = request.auth
    print(email)
    print(password)
    print(request)

    # user = CustomAuthBackend.authenticate(request, username=email, password=password)
    user = CustomAuthBackend.authenticate(request=django_request, email=email, password=password)

    print("hello", user)
    if user is not None:
        login(django_request, user, backend='django.contrib.auth.backends.ModelBackend')
        return Response({'message': 'Logged in successfully.'})
    return Response({'message': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)

# class TaskViewSet(viewsets.ModelViewSet):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer
