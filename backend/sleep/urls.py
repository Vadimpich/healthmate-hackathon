from django.urls import path
from .views import SleepLogListView, SleepLogCreateView, SleepLogUpdateView

urlpatterns = [
    path('sleep/', SleepLogListView.as_view(), name='sleep-log-list'),
    path('sleep/create/', SleepLogCreateView.as_view(), name='sleep-log-create'),
    path('sleep/<int:pk>/edit/', SleepLogUpdateView.as_view(), name='sleep-log-update'),
]
