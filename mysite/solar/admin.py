from django.contrib import admin

# Register your models here.
from .models import Site, SiteMonthlyData, InverterData, InverterNameMapping

admin.site.register([Site, SiteMonthlyData, InverterData, InverterNameMapping])
