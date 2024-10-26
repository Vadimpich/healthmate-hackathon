# Generated by Django 5.1.2 on 2024-10-26 10:48

import utils.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stepslog',
            name='date',
            field=models.DateField(validators=[utils.validators.validate_date]),
        ),
        migrations.AlterField(
            model_name='stepslog',
            name='steps',
            field=models.PositiveIntegerField(help_text='Количество шагов', validators=[utils.validators.validate_steps]),
        ),
    ]
