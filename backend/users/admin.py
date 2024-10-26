from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Укажите поля, которые хотите отображать в админке
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('weight', 'height', 'gender')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('weight', 'height', 'gender')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
