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


class SiteMonthlyData(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    POA_Irradiance = models.DecimalField(max_digits=20, decimal_places=6)
    meter_power = models.DecimalField(
        max_digits=20, decimal_places=6, null=True, blank=True
    )
    is_day = models.BooleanField(
        null=True, blank=True
    )  # Allows storing NULL for 'Unknown'

    def __str__(self):
        return f"{self.site.site_name} - {self.timestamp} - {'Day' if self.is_day else 'Night'}"


class InverterData(models.Model):
    monthly_data = models.ForeignKey(
        SiteMonthlyData, related_name="inverters", on_delete=models.CASCADE
    )
    inverter_name = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=20, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"{self.inverter_name} - {self.value}"


class InverterNameMapping(models.Model):
    site = models.ForeignKey(
        Site, related_name="inverter_name_mappings", on_delete=models.CASCADE
    )
    original_name = models.CharField(max_length=100)
    formatted_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.site.site_name}: {self.formatted_name} -> {self.original_name}"


class ExclusiveOutage(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    impacted_inverters = models.ManyToManyField(InverterData, related_name="outages")

    def __str__(self):
        return f"{self.site.site_name} - {self.start_time} to {self.end_time}"

    @property
    def duration(self):
        return self.end_time - self.start_time
