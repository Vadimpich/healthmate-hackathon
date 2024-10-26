from rest_framework import serializers

from .models import StepsLog


class StepsLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepsLog
        fields = ('id', 'user', 'date', 'steps')
        read_only_fields = ('user',)
