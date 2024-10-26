from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from activity.ai import analyze_activity
from food.ai import analyze_food
from sleep.ai import analyze_sleep


@login_required
def analyze_health_view(request):
    user = request.user

    activity_data = analyze_activity(user)
    food_data = analyze_food(user)
    sleep_data = analyze_sleep(user)

    response_data = {
        'activity': activity_data,
        'food': food_data,
        'sleep': sleep_data,
    }

    return JsonResponse(response_data)
