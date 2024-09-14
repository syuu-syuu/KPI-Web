from django.contrib import admin

# Register your models here.
from .models import (
    Site,
    SiteHourlyData,
    InverterData,
    InverterNameMapping,
    SiteDailySummary,
    SiteMonthlySummary,
    SiteCumulativeMonthlySummary,
)

admin.site.register(
    [
        Site,
        SiteHourlyData,
        InverterData,
        InverterNameMapping,
        SiteDailySummary,
        SiteMonthlySummary,
        SiteCumulativeMonthlySummary,
    ]
)
