from django.contrib.auth import get_user_model
from django.db import models

from utils.validators import validate_feeling_level

User = get_user_model()


class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='feedback')
    date = models.DateField(auto_now_add=True)
    feeling_level = models.PositiveIntegerField(
        validators=[validate_feeling_level])

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.feeling_level}"
