# Generated by Django 5.1.2 on 2024-10-27 09:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sleep', '0004_alter_sleeplog_sleep_quality'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sleeplog',
            name='sleep_start_time',
        ),
    ]
