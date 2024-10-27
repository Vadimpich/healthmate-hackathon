from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'date', 'feeling_level']
        read_only_fields = ['id', 'user', 'date']
