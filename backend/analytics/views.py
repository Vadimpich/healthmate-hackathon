
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

    data = [
        user.gender,
        user.age,
        user.weight,
        user.height,
        sleep.sleep_duration,
        int(sleep.sleep_quality),
    ]
    print(data)
    activity_data = analyze_activity(
        *data
    ) + 3000
    food_data = None
    sleep_data = None

    response_data = {
        'activity': activity_data,
        'food': food_data,
        'sleep': sleep_data,
    }

    return Response(response_data, status=200)
