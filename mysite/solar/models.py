from django.db import models


# Create your models here.
class Site(models.Model):
    uid = models.AutoField(primary_key=True)
    site_name = models.CharField(max_length=200)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.CharField(max_length=255)
    contract_start_month = models.DateField()
    contract_end_month = models.DateField()

    def __str__(self):
        return self.site_name


class SiteMonthlyData(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    poa_irradiance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.site.site_name} - {self.timestamp}"


class InverterData(models.Model):
    monthly_data = models.ForeignKey(
        SiteMonthlyData, related_name="inverters", on_delete=models.CASCADE
    )
    inverter_name = models.CharField(max_length=50)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.inverter_name} - {self.value}"
