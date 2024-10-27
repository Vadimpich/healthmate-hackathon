from django.contrib.auth import get_user_model
from django.db import models

from utils.validators import validate_date, validate_calories

User = get_user_model()


class MealLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='meals')
    date = models.DateField(validators=[validate_date])
    MEAL_TYPES = [
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    ]
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES)
    total_calories = models.PositiveIntegerField(
        default=0,
        help_text="Общее количество калорий"
    )

    class Meta:
        unique_together = (('user', 'date'),)

    def __str__(self):
        return f"{self.get_meal_type_display()} пользователя {self.user.username} на {self.date}"
