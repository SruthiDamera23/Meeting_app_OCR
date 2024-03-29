from .models import Church
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ChurchSerializer

"""
church() view responds to get requests by serving all
church objects in the database; responds to post request
by adding a new church to the database.
"""
@api_view(['GET', 'POST', 'PUT'])
def church(request):
    if request.method == 'GET':
        queryset = Church.objects.all()
        serialized_queryset = [ChurchSerializer(church).data for church in queryset if not church.deleted]
        return Response(serialized_queryset, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = ChurchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Church added.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def edit_church(request,id):
    try:
        print(id)
        print(request.data)
        church_id = id
        church = Church.objects.get(id=church_id, deleted=False)
    except Church.DoesNotExist:
        return Response({'message': 'Church not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ChurchSerializer(church, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Church updated successfully.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
