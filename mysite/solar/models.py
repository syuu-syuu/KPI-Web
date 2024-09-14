from django.db import models


# Create your models here.
class Site(models.Model):
    site_id = models.AutoField(primary_key=True)
    site_name = models.CharField(max_length=200)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    address = models.CharField(max_length=255)

    STATE_CHOICES = [
        ("AL", "Alabama"),
        ("AK", "Alaska"),
        ("AZ", "Arizona"),
        ("AR", "Arkansas"),
        ("CA", "California"),
        ("CO", "Colorado"),
        ("CT", "Connecticut"),
        ("DE", "Delaware"),
        ("FL", "Florida"),
        ("GA", "Georgia"),
        ("HI", "Hawaii"),
        ("ID", "Idaho"),
        ("IL", "Illinois"),
        ("IN", "Indiana"),
        ("IA", "Iowa"),
        ("KS", "Kansas"),
        ("KY", "Kentucky"),
        ("LA", "Louisiana"),
        ("ME", "Maine"),
        ("MD", "Maryland"),
        ("MA", "Massachusetts"),
        ("MI", "Michigan"),
        ("MN", "Minnesota"),
        ("MS", "Mississippi"),
        ("MO", "Missouri"),
        ("MT", "Montana"),
        ("NE", "Nebraska"),
        ("NV", "Nevada"),
        ("NH", "New Hampshire"),
        ("NJ", "New Jersey"),
        ("NM", "New Mexico"),
        ("NY", "New York"),
        ("NC", "North Carolina"),
        ("ND", "North Dakota"),
        ("OH", "Ohio"),
        ("OK", "Oklahoma"),
        ("OR", "Oregon"),
        ("PA", "Pennsylvania"),
        ("RI", "Rhode Island"),
        ("SC", "South Carolina"),
        ("SD", "South Dakota"),
        ("TN", "Tennessee"),
        ("TX", "Texas"),
        ("UT", "Utah"),
        ("VT", "Vermont"),
        ("VA", "Virginia"),
        ("WA", "Washington"),
        ("WV", "West Virginia"),
        ("WI", "Wisconsin"),
        ("WY", "Wyoming"),
    ]
    city = models.CharField(max_length=100, default="Unknown")
    state = models.CharField(max_length=2, choices=STATE_CHOICES, default="NC")

    MONTH_CHOICES = [(i, i) for i in range(1, 13)]
    contract_start_month = models.PositiveSmallIntegerField(choices=MONTH_CHOICES)
    contract_end_month = models.PositiveSmallIntegerField(choices=MONTH_CHOICES)

    def __str__(self):
        return self.site_name


class SiteHourlyData(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    POA_Irradiance = models.DecimalField(max_digits=20, decimal_places=6)
    meter_power = models.DecimalField(
        max_digits=20, decimal_places=6, null=True, blank=True
    )
    is_day = models.BooleanField(
        null=True, blank=True
    )  # Allows storing NULL for 'Unknown'

    # Processed data fields
    DATA_STATUS_CHOICES = [
        ("A", "A - No issues, no changes"),
        ("B", "B - Issues, auto-corrected"),
        ("C", "C - Issues, auto-corrected, manual investigation required"),
        ("D", "D - Unprocessed"),
    ]
    status = models.CharField(max_length=1, choices=DATA_STATUS_CHOICES, default="D")
    count_should_on_but_not = models.IntegerField(null=True, blank=True)
    count_missing = models.IntegerField(null=True, blank=True)

    # User actions field for status C
    ACTION_STATUS_CHOICES = [
        ("A", "Action needed"),
        ("B", "Manually investigated and approved/edited"),
        ("C", "Added to exclusive outage"),
    ]

    action_status = models.CharField(
        max_length=2, choices=ACTION_STATUS_CHOICES, null=True, blank=True
    )

    is_exclusive = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.site.site_name} - {self.timestamp} - {self.meter_power} - {'Day' if self.is_day else 'Night'} - Status: {self.get_status_display()}"


class InverterData(models.Model):
    site_hourly_data = models.ForeignKey(
        SiteHourlyData, related_name="inverters", on_delete=models.CASCADE
    )
    inverter_name = models.CharField(max_length=100)

    value = models.DecimalField(max_digits=20, decimal_places=6, null=True, blank=True)

    processed_value = models.DecimalField(
        max_digits=20, decimal_places=6, null=True, blank=True
    )
    is_modified = models.BooleanField(default=False)

    is_exclusive = models.BooleanField(default=False)

    expected_value = models.DecimalField(
        max_digits=20, decimal_places=6, null=True, blank=True
    )

    def __str__(self):
        return f"{self.inverter_name} - Processed: {self.processed_value}, Expected: {self.expected_value}"


class InverterNameMapping(models.Model):
    site = models.ForeignKey(
        Site, related_name="inverter_name_mappings", on_delete=models.CASCADE
    )
    original_name = models.CharField(max_length=100)
    formatted_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.site.site_name}: {self.formatted_name} -> {self.original_name}"


class SiteDailySummary(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    date = models.DateField()

    # Aggregated totals and calculated availability
    actual_total = models.DecimalField(max_digits=20, decimal_places=6)
    expected_total = models.DecimalField(max_digits=20, decimal_places=6)
    availability = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["site", "date"], name="unique_site_date")
        ]

    def __str__(self):
        return f"Daily Availability: {self.site.site_name} - {self.date} - {self.availability}%"


class SiteMonthlySummary(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    year_month = models.PositiveIntegerField()  # 202409 - 2024 September

    # Aggregated totals and calculated availability
    actual_total = models.DecimalField(max_digits=20, decimal_places=6)
    expected_total = models.DecimalField(max_digits=20, decimal_places=6)
    availability = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["site", "year_month"], name="unique_site_year_month"
            )
        ]

    def __str__(self):
        return f"Monthly Availability: {self.site.site_name} - {self.year_month} - {self.availability}%"


class SiteCumulativeMonthlySummary(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    year_month = models.PositiveIntegerField()  # 202409 - 2024 September

    cumulative_actual_total = models.DecimalField(max_digits=20, decimal_places=6)
    cumulative_expected_total = models.DecimalField(max_digits=20, decimal_places=6)
    cumulative_availability = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["site", "year_month"], name="unique_cumulative_site_year_month"
            )
        ]

    def __str__(self):
        return f"Cumulative Availability: {self.site.site_name} - {self.year_month} - {self.cumulative_availability}%"
