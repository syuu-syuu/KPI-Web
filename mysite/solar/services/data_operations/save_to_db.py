import pandas as pd
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
from solar.models import Site, SiteMonthlyData, InverterData, InverterNameMapping


def save_inverter_name_mappings(site_id, name_mapping):
    try:
        site = Site.objects.get(pk=site_id)
        for formatted_name, original_name in name_mapping.items():
            InverterNameMapping.objects.get_or_create(
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

    # Define inverter columns based on your DataFrame structure
    inverter_columns = [col for col in df.columns if col.startswith("Inverter_")]

    # Iterate over DataFrame rows
    for _, row in df.iterrows():
        # Parse and convert timestamp if necessary
        timestamp = pd.to_datetime(row["Timestamp"])

        # Convert POA Irradiance to Decimal
        poa_irradiance = Decimal(str(row["POA_Irradiance"])).quantize(Decimal("0.01"))

        # Convert 'Day/Night' to boolean
        is_day = True if row["Day_Night"].lower() == "day" else False

        # Create and save SiteMonthlyData instance
        monthly_data = SiteMonthlyData.objects.create(
            site=site, timestamp=timestamp, POA_Irradiance=poa_irradiance, is_day=is_day
        )

        # Create and save InverterData instances
        for inverter_col in inverter_columns:
            inverter_value = Decimal(str(row[inverter_col])).quantize(Decimal("0.01"))
            InverterData.objects.create(
                monthly_data=monthly_data,
                inverter_name=inverter_col,
                value=inverter_value,
            )
