from django.urls import path

from activity.views import (
    StepsLogListView, StepsLogCreateView, StepsLogUpdateView
)

urlpatterns = [
    path('activity/', StepsLogListView.as_view(), name='steps-log-list'),
    path('activity/create/', StepsLogCreateView.as_view(), name='steps-log-create'),
    path('activity/<int:pk>/edit', StepsLogUpdateView.as_view(),
         name='steps-log-update'),
]
