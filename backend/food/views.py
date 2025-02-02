from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import MealLog
from .serializers import MealLogSerializer


class MealLogListView(generics.ListAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealLog.objects.filter(user=self.request.user)


class MealLogCreateView(generics.CreateAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MealLogUpdateView(generics.UpdateAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealLog.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
