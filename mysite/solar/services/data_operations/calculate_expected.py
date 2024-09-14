from django.db.models import Avg, Count, Q
import numpy as np
from datetime import timedelta
from solar.models import SiteHourlyData, InverterData
from django.db import transaction
from decimal import Decimal


INV_OUTAGE_THRESHOLD = 0.1
POA_IRRADIANCE_THRESHOLD = 50


def calculate_avg_top_20_percent(inverters):
    """
    Calculate the average of the top 20% working inverters.
    """
    positive_values = [
        inv.processed_value
        for inv in inverters
        # if (inv.processed_value and inv.processed_value > 0)
        if inv.processed_value > 0
    ]

    if not positive_values:
        return None

    positive_values.sort()
    index_80 = int(len(positive_values) * 0.8)
    top_20 = positive_values[index_80:]
    # if top_20:
    #     avg_top_20 = sum(top_20) / len(top_20)
    #     print(f"Top 20% average: {avg_top_20}")
    #     return avg_top_20
    # else:
    #     return None
    return sum(top_20) / len(top_20) if top_20 else None


def calculate_expected(site_id, start_time=None, end_time=None):
    """
    Calculate and update the expected values for inverters for a specific site.
    If start_time and end_time are not provided, calculate over all data.
    """

    # Filter the data based on the provided site_id and time range
    if start_time and end_time:
        hourly_data = (
            SiteHourlyData.objects.filter(
                site_id=site_id, timestamp__gte=start_time, timestamp__lte=end_time
            )
            .prefetch_related("inverters")
            .exclude(inverters__is_exclusive=True)
        )
    else:
        hourly_data = (
            SiteHourlyData.objects.filter(site_id=site_id).prefetch_related("inverters")
            # .exclude(inverters__is_exclusive=True)
        )

    # Iterate through the monthly data and calculate the expected value for each inverter
    for data in hourly_data:
        inverters = data.inverters.all()

        # Calculate the average top 20% processed values for the inverters
        avg_top_20 = calculate_avg_top_20_percent(inverters)

        # Update the expected_value for each inverter
        if avg_top_20:
            inverters_to_update = []
            for inverter in inverters:
                if inverter.processed_value == Decimal("0"):
                    # Update the inverter's expected_value to avg_top_20
                    inverter.expected_value = avg_top_20
                else:
                    inverter.expected_value = inverter.processed_value

                inverters_to_update.append(inverter)

            # for inverter in inverters_to_update:
            #     print(
            #         f"Expected value for {inverter.inverter_name} updated to {inverter.expected_value}"
            #     )

            # Use bulk_update to update all inverters in one database call
            try:
                with transaction.atomic():
                    InverterData.objects.bulk_update(
                        inverters_to_update, ["expected_value"]
                    )
            except Exception as e:
                print(f"Error updating expected values: {e}")
