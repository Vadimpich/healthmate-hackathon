
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from activity.ai import analyze_activity
from activity.models import StepsLog
from food.ai import analyze_food
from sleep.ai import analyze_sleep
from sleep.models import SleepLog


@api_view(['GET'])
def analyze_health_view(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'Необходима авторизация.'}, status=401)

    sleep = SleepLog.objects.filter(user=user).last()
    steps = StepsLog.objects.filter(user=user).last()

    activity_data = analyze_activity(
        user.gender,
        user.age,
        user.weight,
        sleep.sleep_duration,
        sleep.sleep_quality,
        steps.steps
    )
    food_data = None
    sleep_data = None

    response_data = {
        'activity': activity_data,
        'food': food_data,
        'sleep': sleep_data,
    }

    return Response(response_data, status=200)
