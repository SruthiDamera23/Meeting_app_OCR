from .models import Church
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ChurchSerializer
from payment.models import Payment
import payment.views as pv
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
        print(request.data)
        serializer = ChurchSerializer(data=request.data)
        if serializer.is_valid():
            church = serializer.save()
            print(request.data)
            sub_id = sub_id = request.data.get('stripe_sub_id')
            payment = Payment.objects.create(
                payment_id=sub_id,
                church=church
            )
            return Response({'message': 'Church added.','id':int(church.id)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT','DELETE'])
def edit_church(request,id):
    if request.method == 'PUT':
        try:
            church_id = id
            church = Church.objects.get(id=church_id, deleted=False)
        except Church.DoesNotExist:
            return Response({'message': 'Church not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChurchSerializer(church, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Church updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            church_id = id
            church = Church.objects.get(id=church_id, deleted=False)
        except Church.DoesNotExist:
            return Response({'message': 'Church not found.'}, status=status.HTTP_404_NOT_FOUND)
        payment_obj = Payment.objects.filter(church=church).first()
        if payment_obj:
                pv.cancel_stripe_subscription(payment_obj.payment_id)
                print("Stripe Subscription cancelled")
                church.deleted = True
                church.save()
                return Response({'message': 'Church deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Church deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)