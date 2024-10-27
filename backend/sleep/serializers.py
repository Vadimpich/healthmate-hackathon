from rest_framework import serializers

from .models import SleepLog


class SleepLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepLog
        fields = ('id', 'user', 'date', 'sleep_duration', 'sleep_quality')
        read_only_fields = ('user',)
