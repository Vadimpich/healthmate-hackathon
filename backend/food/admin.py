from django.contrib import admin

from .models import MealLog, Product


class ProductInline(admin.TabularInline):
    model = Product
    extra = 1


class MealLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'meal_type', 'total_calories')
    list_filter = ('user', 'meal_type', 'date')
    search_fields = ('user__username',)
    inlines = [ProductInline]  # Встраиваем продукты в интерфейс приёма пищи


admin.site.register(MealLog, MealLogAdmin)
