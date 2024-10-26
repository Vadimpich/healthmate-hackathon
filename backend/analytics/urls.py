from django.urls import path
from .views import analyze_health_view

urlpatterns = [
    path('analytics/', analyze_health_view, name='analyze-health'),
]
