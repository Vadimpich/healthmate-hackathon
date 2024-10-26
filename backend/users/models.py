from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='profile')

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
        return f"Профиль пользователя: {self.user.username}"
