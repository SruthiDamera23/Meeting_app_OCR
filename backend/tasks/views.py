from rest_framework import viewsets
# from rest_framework.pagination import PageNumberPagination
from .models import Task
from .serializers import TaskSerializer
from rest_framework.decorators import api_view
from django.http import HttpResponse

from rest_framework.pagination import PageNumberPagination

# Custom pagination class to retrieve all results at once
class AllResultsPagination(PageNumberPagination):
    page_size = 100000  # Set a large number to retrieve all results at once

class TaskViewSet(viewsets.ModelViewSet):
    # Queryset that retrieves all Task objects
    queryset = Task.objects.all()
    # Serializer class used for Task model
    serializer_class = TaskSerializer
    # Uncomment the following lines to use the default PageNumberPagination
    # pagination_class = PageNumberPagination
    # PAGE_SIZE = 100  # or any other value you want
    # Use custom pagination class to retrieve all results at once
    pagination_class = AllResultsPagination  # Use custom pagination class

    def my_view(request):
        # Create an HttpResponse object
        response = HttpResponse()
        # Set Access-Control-Allow-Origin header to allow requests from http://localhost:3000
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        return response

class EditTasks:
    @api_view(['PUT'])
    def edit_tasks(request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("safe serialization")
            return Response({'message': 'Task edited.'}, status=status.HTTP_200_OK)
        print("you fucked up")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['DELETE'])  # Use DELETE method
    def delete_task(request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        task.delete()  # Delete the task

        return Response({'message': 'Task deleted.'}, status=status.HTTP_204_NO_CONTENT)  # Use 204 status for successful deletion

