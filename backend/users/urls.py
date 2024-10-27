from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (UserRegistrationView, UserLogoutView, UserProfileView,
                    UserLoginView)

app_name = 'users'

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='token-obtain-pair'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
