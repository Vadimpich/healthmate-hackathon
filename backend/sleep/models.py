from django.contrib.auth import get_user_model
from django.db import models

from utils.validators import validate_date, validate_sleep_hours

User = get_user_model()


class SleepLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='sleep_logs')
    date = models.DateField(validators=[validate_date])
    sleep_duration = models.FloatField(
        help_text="Продолжительность сна в часах",
        validators=[validate_sleep_hours]
    )
    sleep_start_time = models.TimeField(help_text="Время начала сна")

    SLEEP_QUALITY_CHOICES = [
        ('excellent', 'Отлично'),
        ('good', 'Хорошо'),
        ('average', 'Средне'),
        ('poor', 'Плохо'),
    ]
    sleep_quality = models.CharField(max_length=10,
                                     choices=SLEEP_QUALITY_CHOICES)

    def __str__(self):
        return f"Сон пользователя {self.user.username} за {self.date}: {self.sleep_quality}"
