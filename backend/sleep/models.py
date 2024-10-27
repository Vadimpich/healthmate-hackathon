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

    SLEEP_QUALITY_CHOICES = [
        (10, 'Отлично'),
        (7, 'Хорошо'),
        (4, 'Средне'),
        (1, 'Плохо'),
    ]
    sleep_quality = models.CharField(max_length=10,
                                     choices=SLEEP_QUALITY_CHOICES)

    class Meta:
        unique_together = (('user', 'date'),)

    def __str__(self):
        return f"Сон пользователя {self.user.username} за {self.date}: {self.sleep_quality}"
