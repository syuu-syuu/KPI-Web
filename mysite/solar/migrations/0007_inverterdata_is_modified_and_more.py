# Generated by Django 5.0.6 on 2024-09-10 17:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("solar", "0006_sitemonthlydata_meter_power_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="inverterdata",
            name="is_modified",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="inverterdata",
            name="processed_value",
            field=models.DecimalField(
                blank=True, decimal_places=6, max_digits=20, null=True
            ),
        ),
        migrations.AddField(
            model_name="sitemonthlydata",
            name="count_missing",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="sitemonthlydata",
            name="count_should_on_but_not",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="sitemonthlydata",
            name="status",
            field=models.CharField(
                choices=[
                    ("A", "No issues, no changes"),
                    ("B", "Issues, auto-corrected"),
                    ("C", "Issues, auto-corrected, manual investigation required"),
                ],
                default="A",
                max_length=1,
            ),
        ),
        migrations.CreateModel(
            name="ExclusiveOutage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("start_time", models.DateTimeField()),
                ("end_time", models.DateTimeField()),
                (
                    "impacted_inverters",
                    models.ManyToManyField(
                        related_name="outages", to="solar.inverterdata"
                    ),
                ),
                (
                    "site",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="solar.site"
                    ),
                ),
            ],
        ),
    ]
