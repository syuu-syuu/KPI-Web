import pandas as pd
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
from solar.models import Site, SiteHourlyData, InverterData, InverterNameMapping


def save_inverter_name_mappings(site_id, name_mapping):
    try:
        site = Site.objects.get(pk=site_id)
        for formatted_name, original_name in name_mapping.items():
            InverterNameMapping.objects.update_or_create(
                site=site,
                original_name=original_name,
                defaults={"formatted_name": formatted_name},
            )

        print(f"Successfully saved inverter name mappings for site {site.site_name}")

    except ObjectDoesNotExist:
        print(f"Site with ID {site_id} does not exist.")


def save_processed_data_to_db(df, site_id):
    try:
        site = Site.objects.get(pk=site_id)
    except ObjectDoesNotExist:
        print(f"Site with ID {site_id} does not exist.")
        return

    # Iterate over DataFrame rows
    for _, row in df.iterrows():
        timestamp = row["Timestamp"]

        # Convert POA Irradiance & Meter Power to Decimal
        poa_irradiance = Decimal(str(row["POA Irradiance"])).quantize(
            Decimal("0.000001")
        )
        meter_power = (
            None
            if pd.isna(row.get("Meter Power"))
            else Decimal(str(row["Meter Power"])).quantize(Decimal("0.000001"))
        )

        # Convert 'Day/Night' to boolean
        is_day = {"day": True, "night": False}.get(row["Day/Night"].lower(), None)

        # Upsert: Create or update SiteHourlyData instance
        site_hourly_data, created = SiteHourlyData.objects.update_or_create(
            site=site,
            timestamp=timestamp,
            defaults={
                "POA_Irradiance": poa_irradiance,
                "meter_power": meter_power,
                "is_day": is_day,
            },
        )

        # Upsert: Create or update InverterData instances
        inverter_columns = [col for col in df.columns if col.startswith("Inverter_")]
        for inverter_col in inverter_columns:
            inverter_value = (
                None
                if pd.isna(row.get(inverter_col))
                else Decimal(str(row[inverter_col])).quantize(Decimal("0.000001"))
            )
            InverterData.objects.update_or_create(
                site_hourly_data=site_hourly_data,
                inverter_name=inverter_col,
                defaults={"value": inverter_value},
            )
