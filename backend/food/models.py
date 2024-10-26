from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class MealLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    date = models.DateField()
    MEAL_TYPES = [
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    ]
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES)
    total_calories = models.PositiveIntegerField(default=0, help_text="Общее количество калорий")

    def __str__(self):
        return f"{self.get_meal_type_display()} пользователя {self.user.username} на {self.date}"


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    meal = models.ForeignKey(MealLog, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    calories = models.PositiveIntegerField(help_text="Калорийность продукта")

    def __str__(self):
        return f"{self.name} ({self.calories} ккал) в {self.meal}"
