# Generated by Django 5.0.6 on 2024-08-18 16:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Site',
            fields=[
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('site_name', models.CharField(max_length=200)),
                ('longitude', models.DecimalField(decimal_places=7, max_digits=10)),
                ('latitude', models.DecimalField(decimal_places=7, max_digits=10)),
                ('address', models.CharField(max_length=255)),
                ('contract_start_month', models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10), (11, 11), (12, 12)])),
                ('contract_end_month', models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10), (11, 11), (12, 12)])),
            ],
        ),
        migrations.CreateModel(
            name='SiteMonthlyData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('POA_Irradiance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('site', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='solar.site')),
            ],
        ),
        migrations.CreateModel(
            name='InverterData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inverter_name', models.CharField(max_length=50)),
                ('value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('monthly_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inverters', to='solar.sitemonthlydata')),
            ],
        ),
    ]
