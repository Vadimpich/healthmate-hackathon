# Generated by Django 5.1.2 on 2024-10-27 09:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0004_alter_meallog_date_alter_product_calories'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='user',
        ),
        migrations.DeleteModel(
            name='MealProduct',
        ),
        migrations.DeleteModel(
            name='Product',
        ),
    ]
