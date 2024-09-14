from django.db.models import Sum
from django.db.models.functions import ExtractDay, ExtractYear, ExtractMonth
from datetime import datetime
from solar.models import (
    SiteHourlyData,
    SiteDailySummary,
    SiteMonthlySummary,
    SiteCumulativeMonthlySummary,
)
from django.db import transaction


def calculate_daily_availability(site, year=None, month=None):
    """
    Calculate and save daily availability for the given site, year, and month.
    """

    # Fetch all hourly data for the given site and month, excluding inverters marked as exclusive

    queryset = (
        SiteHourlyData.objects.filter(
            site=site, POA_Irradiance__gt=50
        ).prefetch_related("inverters")
        # .exclude(inverters__is_exclusive=True)
    )

    if year is not None and month is not None:
        queryset = queryset.filter(timestamp__year=year, timestamp__month=month)

    daily_summary = (
        queryset.values("timestamp__date")
        .annotate(  # Group by date (i.e., day)
            actual_daily_sum=Sum("inverters__processed_value"),
            expected_daily_sum=Sum("inverters__expected_value"),
        )
        .values("timestamp__date", "actual_daily_sum", "expected_daily_sum")
    )

    daily_summaries_to_save = []

    # Save the daily summary to SiteDailySummary
    with transaction.atomic():
        for data in daily_summary:
            date = data["timestamp__date"]
            actual_total = data["actual_daily_sum"] if data["actual_daily_sum"] else 0
            expected_total = (
                data["expected_daily_sum"] if data["expected_daily_sum"] else 0
            )
            if expected_total and expected_total > 0:
                availability = actual_total / expected_total * 100
            else:
                availability = 0

            daily_summaries_to_save.append(
                SiteDailySummary(
                    site=site,
                    date=date,
                    actual_total=actual_total,
                    expected_total=expected_total,
                    availability=availability,
                )
            )

        # Bulk create or update daily summaries
        SiteDailySummary.objects.bulk_create(
            daily_summaries_to_save,
            update_conflicts=True,  # Allows updating if conflicts are found
            update_fields=["actual_total", "expected_total", "availability"],
            unique_fields=["site", "date"],
        )


def calculate_monthly_availability(site, year=None, month=None):
    """
    Calculate and save monthly availability for the given site.
    If year and month are provided, it calculates for that specific month.
    Otherwise, it calculates for all months for the site.
    """
    # Filter by site and date if year and month are provided
    daily_summaries = SiteDailySummary.objects.filter(site=site)
    if year and month:
        daily_summaries = daily_summaries.filter(date__year=year, date__month=month)

    # Aggregate daily summaries to get monthly totals
    monthly_summaries = (
        daily_summaries.annotate(year=ExtractYear("date"), month=ExtractMonth("date"))
        .values("year", "month")
        .annotate(
            actual_total_sum=Sum("actual_total"),
            expected_total_sum=Sum("expected_total"),
        )
    )

    monthly_summary_objects = []

    with transaction.atomic():
        for summary in monthly_summaries:
            actual_total = summary["actual_total_sum"] or 0
            expected_total = summary["expected_total_sum"] or 0
            availability = (
                (actual_total / expected_total * 100) if expected_total > 0 else 0
            )
            year_month = summary["year"] * 100 + summary["month"]

            # Create or update monthly summary objects
            monthly_summary_objects.append(
                SiteMonthlySummary(
                    site=site,
                    year_month=year_month,
                    actual_total=actual_total,
                    expected_total=expected_total,
                    availability=availability,
                )
            )

        # Perform bulk upsert using a single query
        SiteMonthlySummary.objects.bulk_create(
            monthly_summary_objects,
            update_conflicts=True,  # Allows updating if conflicts are found
            update_fields=["actual_total", "expected_total", "availability"],
            unique_fields=["site", "year_month"],
        )


def get_contract_year_start(site, year, month):
    """Determine the contractual year start based on the site and given month."""
    if month >= site.contract_start_month:
        return year * 100 + site.contract_start_month
    else:
        return (year - 1) * 100 + site.contract_start_month


def calculate_cumulative_availability(site, year=None, month=None):
    """
    Calculate and save cumulative availability for the given site.
    If year and month are provided, it calculates for that specific month.
    Otherwise, it calculates for all months of the site.
    """
    # Determine the range of months to calculate
    if year and month:
        # Calculate contract year start and filter for the specific period
        start_year_month = get_contract_year_start(site, year, month)
        current_year_month = year * 100 + month
        monthly_summaries = SiteMonthlySummary.objects.filter(
            site=site,
            year_month__gte=start_year_month,
            year_month__lte=current_year_month,
        ).order_by("year_month")
    else:
        # Calculate for all months if no specific year and month are provided
        monthly_summaries = SiteMonthlySummary.objects.filter(site=site).order_by(
            "year_month"
        )

    # Initialize cumulative totals and track contract year
    cumulative_actual_total, cumulative_expected_total = 0, 0
    current_contract_year_start = None

    # List to collect cumulative summaries for bulk creation/updating
    cumulative_summaries = []

    # Loop through monthly summaries and calculate cumulative availability
    with transaction.atomic():
        for monthly_summary in monthly_summaries:
            year = monthly_summary.year_month // 100
            month = monthly_summary.year_month % 100
            contract_year_start = get_contract_year_start(site, year, month)

            # Reset cumulative totals if a new contractual year starts
            if contract_year_start != current_contract_year_start:
                cumulative_actual_total, cumulative_expected_total = 0, 0
                current_contract_year_start = contract_year_start

            # Accumulate monthly totals
            cumulative_actual_total += monthly_summary.actual_total
            cumulative_expected_total += monthly_summary.expected_total

            # Calculate cumulative availability
            cumulative_availability = (
                (cumulative_actual_total / cumulative_expected_total) * 100
                if cumulative_expected_total > 0
                else 0
            )

            # Collect the cumulative summary object
            cumulative_summaries.append(
                SiteCumulativeMonthlySummary(
                    site=site,
                    year_month=monthly_summary.year_month,
                    cumulative_actual_total=cumulative_actual_total,
                    cumulative_expected_total=cumulative_expected_total,
                    cumulative_availability=cumulative_availability,
                )
            )

        # Bulk create or update cumulative summaries
        SiteCumulativeMonthlySummary.objects.bulk_create(
            cumulative_summaries,
            update_conflicts=True,  # Allows updating if conflicts are found
            update_fields=[
                "cumulative_actual_total",
                "cumulative_expected_total",
                "cumulative_availability",
            ],
            unique_fields=["site", "year_month"],
        )


def get_previous_year_month(year, month):
    """Calculate the previous year and month in YYYYMM format."""
    if month == 1:
        return (year - 1) * 100 + 12  # Previous year, December
    else:
        return year * 100 + (month - 1)  # Same year, previous month


def calculate_cumulative_availability_for_new_month(site, year, month):
    """
    Update cumulative availability for the new month using the previous month's cumulative data.
    """
    current_year_month = year * 100 + month
    cumulative_actual_total, cumulative_expected_total = 0, 0

    # print(
    #     "Current Month:",
    #     month,
    #     "Current Year Month:",
    #     current_year_month,
    #     "Contract Start Month:",
    #     site.contract_start_month,
    # )

    if month != site.contract_start_month:
        previous_year_month = get_previous_year_month(year, month)
        print("Previous Year Month:", previous_year_month)
        previous_month_summary = SiteCumulativeMonthlySummary.objects.filter(
            site=site, year_month=previous_year_month
        ).first()
        # print(
        #     "Previoys Month Cumulative Actual Total:",
        #     previous_month_summary.cumulative_actual_total,
        #     "Previous Month Cumulative Expected Total:",
        #     previous_month_summary.cumulative_expected_total,
        # )
        if previous_month_summary:
            cumulative_actual_total = previous_month_summary.cumulative_actual_total
            cumulative_expected_total = previous_month_summary.cumulative_expected_total

    try:
        monthly_summary = SiteMonthlySummary.objects.get(
            site=site, year_month=current_year_month
        )
    except SiteMonthlySummary.DoesNotExist:
        print(f"No monthly summary found for {site.site_name} in {year}-{month}.")

    cumulative_actual_total += monthly_summary.actual_total
    cumulative_expected_total += monthly_summary.expected_total

    cumulative_availability = (
        (cumulative_actual_total / cumulative_expected_total) * 100
        if cumulative_expected_total > 0
        else 0
    )

    # print(
    #     "Cumulative Availability:",
    #     cumulative_availability,
    #     "Cumulative Actual Total:",
    #     cumulative_actual_total,
    #     "Cumulative Expected Total:",
    #     cumulative_expected_total,
    # )

    SiteCumulativeMonthlySummary.objects.update_or_create(
        site=site,
        year_month=current_year_month,
        defaults={
            "cumulative_actual_total": cumulative_actual_total,
            "cumulative_expected_total": cumulative_expected_total,
            "cumulative_availability": cumulative_availability,
        },
    )
