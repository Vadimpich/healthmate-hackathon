from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import SleepLog
from .serializers import SleepLogSerializer


class SleepLogListView(generics.ListAPIView):
    serializer_class = SleepLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = SleepLog.objects.filter(user=user)

        # Фильтрация по датам
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset


class SleepLogCreateView(generics.CreateAPIView):
    serializer_class = SleepLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SleepLogUpdateView(generics.UpdateAPIView):
    serializer_class = SleepLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SleepLog.objects.filter(
            user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
