from rest_framework import serializers

from .models import MealLog, Product


class MealLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLog
        fields = ('id', 'user', 'date', 'meal_type', 'total_calories')
        read_only_fields = ('user',)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'user', 'name', 'calories')
        read_only_fields = ('user',)
