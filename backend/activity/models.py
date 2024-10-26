from django.db import models
from django.contrib.auth.models import User


class StepsLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='steps_logs')
    date = models.DateField()
    steps = models.PositiveIntegerField(help_text="Количество шагов")

    def __str__(self):
        return f"Шаги пользователя {self.user.username} за {self.date}: {self.steps}"

    class Meta:
        unique_together = ('user', 'date')
