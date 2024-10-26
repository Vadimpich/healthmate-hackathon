from django.contrib import admin

from .models import StepsLog


@admin.register(StepsLog)
class StepsLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'steps')
    list_filter = ('user', 'date')
    search_fields = ('user__username',)
