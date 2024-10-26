from django.contrib import admin

from .models import MealLog, Product


@admin.register(MealLog)
class MealLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'meal_type', 'total_calories')
    list_filter = ('user', 'meal_type', 'date')
    search_fields = ('user__username',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'calories')
