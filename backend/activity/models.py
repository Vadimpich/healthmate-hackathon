from django.db import models
from django.contrib.auth import get_user_model

from utils.validators import validate_date, validate_steps

User = get_user_model()


class StepsLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='steps_logs')
    date = models.DateField(validators=[validate_date])
    steps = models.PositiveIntegerField(
        help_text="Количество шагов",
        validators=[validate_steps]
    )

    def __str__(self):
        return f"Шаги пользователя {self.user.username} за {self.date}: {self.steps}"

    class Meta:
        unique_together = ('user', 'date')
