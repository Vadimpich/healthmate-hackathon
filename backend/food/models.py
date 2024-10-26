from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class MealLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='meals')
    date = models.DateField()
    MEAL_TYPES = [
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    ]
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES)
    total_calories = models.PositiveIntegerField(default=0,
                                                 help_text="Общее количество калорий")

    def __str__(self):
        return f"{self.get_meal_type_display()} пользователя {self.user.username} на {self.date}"


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='products')
    name = models.CharField(max_length=100)
    calories = models.PositiveIntegerField(help_text="Калорийность продукта")

    def __str__(self):
        return f"{self.name} ({self.calories} ккал)"


class MealProduct(models.Model):
    meal = models.ForeignKey(MealLog, on_delete=models.CASCADE,
                             related_name='meal_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE,
                                related_name='meal_products')
    quantity = models.PositiveIntegerField(default=1,
                                           help_text="Количество продукта в приёме пищи")

    class Meta:
        unique_together = ('meal', 'product')

    def __str__(self):
        return f"{self.product.name} в {self.meal.get_meal_type_display()} на {self.meal.date}"
