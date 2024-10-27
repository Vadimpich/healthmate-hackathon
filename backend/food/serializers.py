from rest_framework import serializers

from .models import MealLog


class MealLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLog
        fields = ('id', 'user', 'date', 'meal_type', 'total_calories')
        read_only_fields = ('user',)
