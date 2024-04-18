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
from .models import User
from subscription.models import Subscription
from church.models import Church
# from .models import Task
# from .serializers import TaskSerializer


@api_view(['POST'])
def signup(request):
    print("=======",request.data)
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
        temp_data = fetch_user_and_prev(email)
        priv = temp_data.user_type
        user_id=temp_data.id
        church = temp_data.church
        church_id = 0
        if priv>1 :
            church_id = church.id
        return Response({'message': 'Logged in successfully.','user':email,'priv':int(priv),'church':int(church_id),'user_id':int(user_id)})
    return Response({'message': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def signup(request):
    data = request.data
    if data['user_type']==1:
        data['church']=None
    serializer = UserSerializer(data=data)
    cid = data['church']
    church = Church.objects.get(id=cid)
    subscription_id = church.subscription.id
    church_user_count = User.objects.filter(church=cid).count()
    subscription_limit = Subscription.objects.filter(id=subscription_id).values_list('count', flat=True).first()
    if church_user_count >= subscription_limit :
        return Response({'message': 'User Limit Exceeded!!'}, status=status.HTTP_226_IM_USED)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def fetch_user_and_prev(user):
    return User.objects.get(email=user)
    
@api_view(['GET'])
def get_users(request,cid):
    if(cid>0):
        users = User.objects.filter(church=cid)
    else:
        users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['DELETE', 'POST'])
def delete_user(request, user_id):
    if request.method == 'POST' and request.POST.get('_method') == 'DELETE':
        # Override method if _method=DELETE is provided in the request body
        request.method = 'DELETE'

    try:
        user = User.objects.get(id=user_id)  # Get the user instance
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    serializer = RequestUserSerializer(users, many=True)  # Serialize users data
    return Response(serializer.data)

@api_view(['POST'])
def update_user(request):
    try:
        user_id = request.data.get('id')
        updated_data = {
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'email': request.data.get('email'),
            'user_type': request.data.get('user_type'),
            'church': request.data.get('church'),
        }
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user, data=updated_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class TaskViewSet(viewsets.ModelViewSet):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer
