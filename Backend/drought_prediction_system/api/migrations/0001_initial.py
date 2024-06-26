# Generated by Django 5.0.6 on 2024-05-21 06:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grand_father_name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=13)),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('institutional', 'Institutional'), ('regular', 'Regular')], max_length=20)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
