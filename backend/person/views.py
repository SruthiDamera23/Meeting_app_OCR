from .models import Person
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PersonSerializer

"""
person() view responds to get requests by serving all
person objects in the database; responds to post request
by adding a new person to the database.
"""
@api_view(['GET', 'POST'])
def person(request):
    if request.method == 'GET':
        queryset = Person.objects.all()
        serialized_queryset = [PersonSerializer(member).data for member in queryset if not member.deleted]
        return Response(serialized_queryset, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Person added.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

