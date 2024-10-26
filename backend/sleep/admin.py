from django.contrib import admin

from .models import SleepLog


class SleepLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'sleep_duration', 'sleep_quality')
    list_filter = ('user', 'date', 'sleep_quality')
    search_fields = ('user__username',)


admin.site.register(SleepLog, SleepLogAdmin)
