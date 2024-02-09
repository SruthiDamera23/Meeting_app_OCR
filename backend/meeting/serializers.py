from rest_framework import serializers
from .models import Meeting
# Serializer class for the Meeting model.
class MeetingSerializer(serializers.ModelSerializer):
    # Specifies the metadata for the serializer, including the model and fields to include.
    class Meta:
        model = Meeting
        fields = '__all__'
