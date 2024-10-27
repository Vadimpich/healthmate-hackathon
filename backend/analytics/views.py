from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from activity.ai import analyze_activity
from analytics.models import Feedback
from sleep.models import SleepLog


class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = Feedback
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def analyze_health_view(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'Необходима авторизация.'}, status=401)

    sleep = SleepLog.objects.filter(user=user).last()

    if not sleep:
        activity_data = None
    else:
        activity_data = analyze_activity(
            user.gender,
            user.age,
            user.weight,
            user.height,
            sleep.sleep_duration,
            int(sleep.sleep_quality),
        ) + 3000
    food_data = None
    sleep_data = None

    response_data = {
        'activity': activity_data,
        'food': food_data,
        'sleep': sleep_data,
    }

    return Response(response_data, status=200)
