from rest_framework import serializers
from .models import Church
# Serializer class for the Meeting model.
class ChurchSerializer(serializers.ModelSerializer):
    # Specifies the metadata for the serializer, including the model and fields to include.
    class Meta:
        model = Church
        fields = '__all__'
