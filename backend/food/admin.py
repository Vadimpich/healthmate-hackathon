from django.contrib import admin

from .models import MealLog


@admin.register(MealLog)
class MealLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'meal_type', 'total_calories')
    list_filter = ('user', 'meal_type', 'date')
    search_fields = ('user__username',)
