from django.urls import path
from .views import MealLogListView, MealLogCreateView, MealLogUpdateView, ProductListView, ProductCreateView, ProductUpdateView

urlpatterns = [
    path('meals/', MealLogListView.as_view(), name='meal-log-list'),
    path('meals/create/', MealLogCreateView.as_view(), name='meal-log-create'),
    path('meals/<int:pk>/edit/', MealLogUpdateView.as_view(), name='meal-log-update'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/create/', ProductCreateView.as_view(), name='product-create'),
    path('products/<int:pk>/edit/', ProductUpdateView.as_view(), name='product-update'),
]
