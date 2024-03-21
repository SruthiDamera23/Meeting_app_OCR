# myapp/serializers.py

from rest_framework import serializers
from .models import RequestUser
# from .models import Task

#Serialiser to create a user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestUser
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = RequestUser.objects.create_user(**validated_data)
        return user
