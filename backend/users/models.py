from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True,
                               verbose_name='Аватар')
    weight = models.FloatField(null=True, blank=True, verbose_name='Вес')
    height = models.FloatField(null=True, blank=True, verbose_name='Рост')
    GENDER_CHOICES = (
        (1, 'Мужской'),
        (2, 'Женский')
    )
    gender = models.IntegerField(null=True, blank=True, choices=GENDER_CHOICES,
                                 verbose_name='Пол')

    def __str__(self):
        return f"Пользователь {self.username}"
