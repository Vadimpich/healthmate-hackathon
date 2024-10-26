from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import StepsLog
from .serializers import StepsLogSerializer


class StepsLogListView(generics.ListAPIView):
    serializer_class = StepsLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = StepsLog.objects.filter(user=user)

        # Фильтрация по датам
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset


class StepsLogCreateView(generics.CreateAPIView):
    serializer_class = StepsLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StepsLogUpdateView(generics.UpdateAPIView):
    serializer_class = StepsLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StepsLog.objects.filter(
            user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
