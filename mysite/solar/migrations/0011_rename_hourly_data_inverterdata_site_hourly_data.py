# Generated by Django 5.0.6 on 2024-09-13 16:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('solar', '0010_alter_sitehourlydata_status'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inverterdata',
            old_name='hourly_data',
            new_name='site_hourly_data',
        ),
    ]
