from django.urls import path
from .views import analyze_health_view, FeedbackListCreateView

urlpatterns = [
    path('analytics/', analyze_health_view, name='analyze-health'),
    path('feedback/', FeedbackListCreateView.as_view(), name='feedback'),
]
