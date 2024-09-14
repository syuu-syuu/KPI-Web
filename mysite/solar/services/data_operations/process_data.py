from django.db import transaction
from solar.models import SiteHourlyData, InverterData
from decimal import Decimal

INV_OUTAGE_THRESHOLD = 0.1
POA_IRRADIANCE_THRESHOLD = 50


def update_inverters(
    problem_inverters,
    inverters_to_update,
    value=None,
):
    """Helper function to update multiple inverters' processed_value and is_modified fields."""
    for inverter in problem_inverters:
        inverter.processed_value = inverter.value if value is None else value
        inverter.is_modified = True
        inverters_to_update.append(inverter)


def calculate_counts(data, INV_sum, count_functioning, count_problematic):
    """Helper function to calculate count_should_on_but_not and determine status."""
    count_should_on_total = round(
        data.meter_power * Decimal("1.02") / (INV_sum / count_functioning)
    )
    count_should_on_but_not = count_should_on_total - count_functioning
    status = "B" if count_should_on_but_not == count_problematic else "C"

    return count_should_on_but_not, status


def process_site_hourly_data(site_id):
    with transaction.atomic():
        # Ensure that all the hourly data is of Status D before processing
        SiteHourlyData.objects.filter(site_id=site_id).update(status="D")

        # Fetch hourly data for the given site and filter out records of the night time
        queryset = (
            SiteHourlyData.objects.filter(
                site_id=site_id,
                # is_day=True,
                # POA_Irradiance__gt=POA_IRRADIANCE_THRESHOLD,
            )
            .select_for_update()
            .prefetch_related("inverters")
        )

        data_to_update = []
        inverters_to_update = []

        for data in queryset:
            inverters = data.inverters.all()

            problematic_inverters = []
            INV_sum, count_functioning = 0, 0
            for inverter in inverters:
                if inverter.value is None or inverter.value < INV_OUTAGE_THRESHOLD:
                    # print(
                    #     "Problematic inverter:",
                    #     inverter.inverter_name,
                    #     "value:",
                    #     inverter.value,
                    # )
                    problematic_inverters.append(inverter)
                else:
                    INV_sum += inverter.value
                    count_functioning += 1

            count_problematic = len(problematic_inverters)

            if count_problematic > 0:
                # if data.meter_power is None or data.meter_power < 0:
                if data.meter_power < 0:
                    # Case when meter power is not available; update all problematic inverters to 0
                    data.status = "C"
                    data.count_should_on_but_not = None
                    data.count_missing = count_problematic
                    update_inverters(problematic_inverters, inverters_to_update, 0)

                elif data.meter_power > INV_sum and count_functioning > 0:
                    # Case when meter power is greater than inverter sum
                    count_should_on_but_not, status = calculate_counts(
                        data, INV_sum, count_functioning, count_problematic
                    )
                    data.status = status
                    data.count_should_on_but_not = count_should_on_but_not
                    data.count_missing = count_problematic

                    # Update problematic inverters based on the calculated count
                    update_inverters(
                        problematic_inverters[:count_should_on_but_not],
                        inverters_to_update,
                        1,
                    )
                    update_inverters(
                        problematic_inverters[count_should_on_but_not:],
                        inverters_to_update,
                        0,
                    )
                else:
                    # Case when all inverters are problematic
                    data.status = "C"
                    data.count_should_on_but_not = count_problematic
                    data.count_missing = count_problematic
                    update_inverters(problematic_inverters, inverters_to_update, 0)

            else:
                # Case when there are no problematic inverters
                data.status = "A"
                data.count_should_on_but_not = 0
                data.count_missing = 0

            # Update non-problematic inverters to their original values
            update_inverters(
                [inv for inv in inverters if inv not in problematic_inverters],
                inverters_to_update,
            )

            data_to_update.append(data)

            # print(
            #     "Processed data:",
            #     "data.count_should_on_but_not:",
            #     data.count_should_on_but_not,
            #     "data.count_missing:",
            #     data.count_missing,
            #     "data.status",
            #     data.status,
            #     "\n",
            # )

        # Perform batch update
        if inverters_to_update:
            InverterData.objects.bulk_update(
                inverters_to_update, ["processed_value", "is_modified"]
            )

        if data_to_update:
            SiteHourlyData.objects.bulk_update(
                data_to_update, ["status", "count_should_on_but_not", "count_missing"]
            )
