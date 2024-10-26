from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="HealthMate API",
        default_version='v1',
        description="Документация к API HealthMate",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Allauth
    path('accounts/', include('allauth.urls')),

    # API
    path('api/', include('users.urls')),
    path('api/', include('activity.urls')),
    path('api/', include('food.urls')),
    path('api/', include('sleep.urls')),
    path('api/', include('analytics.urls')),

    # YASG
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),  # Swagger UI
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),  # ReDoc

]
