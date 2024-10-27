from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from activity.ai import analyze_activity
from activity.models import StepsLog
from sleep.ai import analyze_sleep
from analytics.models import Feedback
from analytics.serializers import FeedbackSerializer
from sleep.models import SleepLog


class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        feedback, created = Feedback.objects.update_or_create(
            user=user,
            defaults=serializer.validated_data
        )



@api_view(['GET'])
def analyze_health_view(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'Необходима авторизация.'}, status=401)

    sleep = SleepLog.objects.filter(user=user).order_by('date').last()
    steps = StepsLog.objects.filter(user=user).order_by('date').last()
    print(steps)

    if not steps or not sleep:
        activity_data = 8000
    if not sleep:
        sleep_data = None
    else:
        activity_data = analyze_activity(
            user.gender,
            user.age,
            user.weight,
            user.height,
            sleep.sleep_duration,
            int(sleep.sleep_quality),
            steps.steps,
            steps.feeling * 2
        )
        sleep_data = analyze_sleep(
            sleep.sleep_duration,
            int(sleep.sleep_quality),
        )
    food_data = None

    response_data = {
        'activity': activity_data,
        'food': food_data,
        'sleep': sleep_data,
    }

    return Response(response_data, status=200)
