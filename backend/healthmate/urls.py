from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('activity.urls')),
    path('api/', include('food.urls')),
    path('api/', include('sleep.urls')),
]
