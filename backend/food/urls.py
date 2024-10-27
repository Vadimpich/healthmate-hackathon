from django.urls import path
from .views import MealLogListView, MealLogCreateView, MealLogUpdateView

urlpatterns = [
    path('meals/', MealLogListView.as_view(), name='meal-log-list'),
    path('meals/create/', MealLogCreateView.as_view(), name='meal-log-create'),
    path('meals/<int:pk>/edit/', MealLogUpdateView.as_view(), name='meal-log-update'),
]
