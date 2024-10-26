from django.contrib.auth.models import AbstractUser
from django.db import models

from utils.validators import validate_age, validate_weight, validate_height


class CustomUser(AbstractUser):
    age = models.PositiveSmallIntegerField(
        default=0,
        validators=[validate_age]
    )
    weight = models.FloatField(
        null=True, blank=True, verbose_name='Вес',
        validators=[validate_weight]
    )
    height = models.FloatField(
        null=True, blank=True, verbose_name='Рост',
        validators=[validate_height]
    )
    GENDER_CHOICES = (
        (1, 'Мужской'),
        (2, 'Женский')
    )
    gender = models.IntegerField(null=True, blank=True, choices=GENDER_CHOICES,
                                 verbose_name='Пол')

    def __str__(self):
        return f"Пользователь {self.username}"
