from django.contrib import admin

# Register your models here.
from .models import Site, SiteMonthlyData, InverterData

admin.site.register([Site, SiteMonthlyData, InverterData])
