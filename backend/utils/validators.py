from django.utils import timezone

from django.core.exceptions import ValidationError


def validate_age(value):
    if value < 0 or value > 120:
        raise ValidationError('Возраст должен быть в диапазоне от 0 до 120.')


def validate_height(value):
    if value < 30 or value > 250:
        raise ValidationError(
            'Рост должен быть в диапазоне от 30 см до 250 см.')


def validate_weight(value):
    if value < 3 or value > 300:
        raise ValidationError('Вес должен быть в диапазоне от 3 кг до 300 кг.')


def validate_date(value):
    if value > timezone.now().date():
        raise ValidationError(
            'Добавлять данные можно только на даты, '
            'не превышающие текущую дату.'
        )


def validate_steps(value):
    if value < 0 or value > 100000:
        raise ValidationError(
            'Количество шагов должно быть в диапазоне от 0 до 100000.'
        )


def validate_sleep_hours(value):
    if value < 0 or value > 24:
        raise ValidationError(
            'Количество часов сна должно быть в диапазоне от 0 до 24.'
        )


def validate_calories(value):
    if value < 0 or value > 5000:
        raise ValidationError(
            'Количество калорий должно быть в диапазоне от 0 до 5000.'
        )
