from django.test import TestCase
from solar.models import (
    Site,
    SiteHourlyData,
    InverterData,
    SiteDailySummary,
    SiteMonthlySummary,
    SiteCumulativeMonthlySummary,
)
from datetime import datetime
from decimal import Decimal
from django.utils.timezone import make_aware
from solar.services.data_operations.calculate_availability import (
    calculate_monthly_availability,
    calculate_cumulative_availability,
    calculate_cumulative_availability_for_new_month,
)


class SiteDataTestBase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.site = Site.objects.create(
            site_name="Test Site",
            longitude=-79.3832,
            latitude=43.6532,
            address="123 Test Street",
            city="Durham",
            state="NC",
            contract_start_month=10,
            contract_end_month=9,
        )


class SiteHourlyDataTestBase(SiteDataTestBase):
    def create_site_hourly_data(
        self,
        timestamp,
        is_day,
        POA_Irradiance,
        meter_power,
        # status,
        # count_should_on_but_not,
        # count_missing,
    ):
        """Helper function to create SiteHourlyData and return it."""

        return SiteHourlyData.objects.create(
            site=self.site,
            timestamp=make_aware(timestamp),
            is_day=is_day,
            POA_Irradiance=POA_Irradiance,
            meter_power=meter_power,
            # status=status,
            # count_should_on_but_not=count_should_on_but_not,
            # count_missing=count_missing,
        )

    def create_inverter_data(self, site_hourly_data, values):
        """Helper function to create InverterData for a given SiteHourlyData."""
        for i, value in enumerate(values, start=1):
            InverterData.objects.create(
                site_hourly_data=site_hourly_data,
                inverter_name=f"Inverter_{i}",
                value=value,
            )

    def create_data_a(self):
        """Creates the data for the 'A' test case."""
        site_hourly_data = self.create_site_hourly_data(
            timestamp=datetime(2024, 1, 1, 6, 0),
            is_day=True,
            POA_Irradiance=Decimal("500.654321"),
            meter_power=Decimal("400.654321"),
            # status="A",
            # count_should_on_but_not=0,
            # count_missing=0,
        )
        self.create_inverter_data(
            site_hourly_data,
            [
                Decimal("100.654321"),
                Decimal("120.654321"),
                Decimal("98.654321"),
                Decimal("101.654321"),
            ],
        )
        return site_hourly_data

    def create_data_b(self):
        """Creates the data for the 'B' test case."""
        site_hourly_data = self.create_site_hourly_data(
            timestamp=datetime(2024, 1, 1, 7, 0),
            is_day=True,
            POA_Irradiance=Decimal("51.000000"),
            meter_power=Decimal("80.654321"),
            # status="B",
            # count_should_on_but_not=2,
            # count_missing=2,
        )
        self.create_inverter_data(
            site_hourly_data,
            [None, Decimal("0"), Decimal("20.54321"), Decimal("20.54321")],
        )
        return site_hourly_data

    def create_data_c1(self):
        """Creates the data for the 'C1' test case."""
        site_hourly_data = self.create_site_hourly_data(
            timestamp=datetime(2024, 1, 1, 8, 0),
            is_day=True,
            POA_Irradiance=Decimal("100.000000"),
            meter_power=Decimal("90.654321"),
            # status="C",
            # count_should_on_but_not=1,
            # count_missing=2,
        )

        self.create_inverter_data(
            site_hourly_data,
            [None, Decimal("0"), Decimal("30.54321"), Decimal("30.54321")],
        )

        return site_hourly_data

    def create_data_c2(self):
        """Creates the data for the 'C2' test case."""
        site_hourly_data = self.create_site_hourly_data(
            timestamp=datetime(2024, 1, 1, 12, 0),
            is_day=True,
            POA_Irradiance=Decimal("500.123456"),
            meter_power=None,  # Missing meter power value
            # status="C",
            # count_should_on_but_not=None,
            # count_missing=2,
        )
        self.create_inverter_data(
            site_hourly_data,
            [None, 0, Decimal("30.54321"), Decimal("30.54321")],
        )
        return site_hourly_data

    def create_data_d(self):
        """Creates the data for the 'D' test case."""
        site_hourly_data = self.create_site_hourly_data(
            timestamp=datetime(2024, 1, 1, 23, 0),
            is_day=False,
            POA_Irradiance=Decimal("0.000000"),
            meter_power=Decimal("0.100000"),
        )
        self.create_inverter_data(
            site_hourly_data,
            [Decimal("0"), Decimal("0"), Decimal("0"), Decimal("0")],
        )
        return site_hourly_data


class SiteAvailabilityTestBase(SiteDataTestBase):

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.create_daily_summaries()
        calculate_monthly_availability(cls.site)

    @classmethod
    def create_daily_summaries(cls):
        """Helper method to create daily summaries for testing."""
        daily_data = [
            (2023, 10, 1, 91.775748, 115.42276),
            (2023, 10, 2, 86.634335, 118.008495),
            (2023, 10, 3, 87.678695, 112.337892),
            (2023, 11, 1, 87.433667, 115.367885),
            (2023, 11, 2, 93.298456, 111.283695),
            (2023, 12, 1, 94.034442, 115.780289),
            (2023, 12, 2, 71.115039, 106.307042),
            (2024, 1, 1, 76.45944, 100.561626),
            (2024, 2, 1, 80.853658, 119.047289),
            (2024, 2, 2, 81.051662, 114.145563),
            (2024, 2, 3, 79.8793, 117.45231),
            (2024, 2, 4, 89.435587, 114.13069),
            (2024, 3, 1, 83.203065, 105.403422),
            (2024, 3, 2, 85.4493, 108.347583),
            (2024, 3, 3, 89.501573, 114.394051),
            (2024, 3, 4, 85.875824, 108.389867),
            (2024, 3, 5, 91.468058, 117.513194),
            (2024, 4, 1, 91.74917, 105.232415),
            (2024, 4, 2, 87.841209, 106.946341),
            (2024, 4, 3, 90.808099, 114.8702),
            (2024, 5, 1, 80.637276, 118.144552),
            (2024, 5, 2, 78.764543, 118.162939),
            (2024, 5, 3, 72.016319, 103.62859),
            (2024, 5, 4, 93.418939, 100.923113),
            (2024, 5, 5, 74.59844, 115.093354),
            (2024, 6, 1, 83.714971, 112.173366),
            (2024, 6, 2, 72.555445, 108.263157),
            (2024, 6, 3, 85.989879, 103.346381),
            (2024, 6, 4, 71.852241, 119.493451),
            (2024, 7, 1, 75.959743, 117.347507),
            (2024, 7, 2, 70.559348, 113.94081),
            (2024, 7, 3, 79.608566, 114.448206),
            (2024, 7, 4, 79.480495, 116.967631),
            (2024, 8, 1, 93.79411, 104.121949),
        ]

        for year, month, day, actual_total, expected_total in daily_data:
            availability = (
                round((actual_total / expected_total) * 100, 2)
                if expected_total > 0
                else 0
            )
            SiteDailySummary.objects.create(
                site=cls.site,
                date=datetime(year, month, day),
                actual_total=actual_total,
                expected_total=expected_total,
                availability=availability,
            )

    def run_monthly_assertions(
        self,
        year_month,
        expected_actual_total,
        expected_expected_total,
        expected_availability,
    ):
        """Reusable assertion helper for monthly summaries."""
        monthly_summary = SiteMonthlySummary.objects.get(
            site=self.site, year_month=year_month
        )

        # Assertions
        self.assertAlmostEqual(
            monthly_summary.actual_total,
            Decimal(expected_actual_total),
            places=6,
            msg=f"Failed for year_month={year_month}: Expected actual_total={expected_actual_total}, got {monthly_summary.actual_total}",
        )
        self.assertAlmostEqual(
            monthly_summary.expected_total,
            Decimal(expected_expected_total),
            places=6,
            msg=f"Failed for year_month={year_month}: Expected expected_total={expected_expected_total}, got {monthly_summary.expected_total}",
        )
        self.assertAlmostEqual(
            monthly_summary.availability,
            Decimal(expected_availability),
            places=2,
            msg=f"Failed for year_month={year_month}: Expected availability={expected_availability}, got {monthly_summary.availability}",
        )

    def test_monthly_all(self):
        """Test the monthly availability calculation for all months."""
        calculate_monthly_availability(self.site)

        # Expected results: year_month, actual_total, expected_total, availability
        expected_results = [
            (202310, 266.088778, 345.769147, 76.96),
            (202311, 180.732123, 226.651580, 79.74),
            (202312, 165.149481, 222.087331, 74.36),
            (202401, 76.459440, 100.561626, 76.03),
            (202402, 331.220207, 464.775852, 71.26),
            (202403, 435.497820, 554.048117, 78.60),
            (202404, 270.398478, 327.048956, 82.68),
            (202405, 399.435517, 555.952548, 71.85),
            (202406, 314.112536, 443.276355, 70.86),
            (202407, 305.608152, 462.704154, 66.05),
            (202408, 93.794110, 104.121949, 90.08),
        ]

        for year_month, actual_total, expected_total, availability in expected_results:
            self.run_monthly_assertions(
                year_month, actual_total, expected_total, availability
            )

    def test_monthly_specific(self):
        """Test the monthly availability calculation for a specific month."""
        # Calculate availability for October 2023
        calculate_monthly_availability(self.site, year=2023, month=10)
        self.run_monthly_assertions(202310, 266.088778, 345.769147, 76.96)

    def assert_summary_values(self, summary, expected):
        """Helper function to assert summary values."""
        self.assertEqual(summary.year_month, expected["year_month"])
        self.assertAlmostEqual(
            summary.cumulative_actual_total,
            Decimal(expected["cumulative_actual_total"]),
            places=6,
            msg=f"Failed for year_month={summary.year_month}: Expected cumulative_actual_total={expected['cumulative_actual_total']}, got {summary.cumulative_actual_total}",
        )
        self.assertAlmostEqual(
            summary.cumulative_expected_total,
            Decimal(expected["cumulative_expected_total"]),
            places=6,
            msg=f"Failed for year_month={summary.year_month}: Expected cumulative_expected_total={expected['cumulative_expected_total']}, got {summary.cumulative_expected_total}",
        )
        self.assertAlmostEqual(
            summary.cumulative_availability,
            Decimal(expected["cumulative_availability"]),
            places=2,
            msg=f"Failed for year_month={summary.year_month}: Expected cumulative_availability={expected['cumulative_availability']}, got {summary.cumulative_availability}",
        )

    def calculate_and_verify_summary(
        self, site, expected_results, year=None, month=None, new_month=False
    ):
        """Helper function to calculate and verify cumulative summaries."""

        def get_previous_year_month(year, month):
            return (year - 1, 12) if month == 1 else (year, month - 1)

        if new_month:
            previous_year, previous_month = get_previous_year_month(year, month)
            calculate_monthly_availability(site, year, month)
            calculate_cumulative_availability(
                site=site, year=previous_year, month=previous_month
            )
            calculate_cumulative_availability_for_new_month(
                site, year=year, month=month
            )
        else:
            calculate_cumulative_availability(site, year, month)

        if year and month:
            cumulative_summaries = SiteCumulativeMonthlySummary.objects.filter(
                site=site, year_month=year * 100 + month
            )
        else:
            cumulative_summaries = SiteCumulativeMonthlySummary.objects.filter(
                site=site
            ).order_by("year_month")

        for i, summary in enumerate(cumulative_summaries):
            expected = expected_results[i]
            self.assert_summary_values(summary, expected)

        # Check that all expected results have been verified
        self.assertEqual(
            len(cumulative_summaries),
            len(expected_results),
            msg="Length mismatch: Expected {} results, got {}".format(
                len(expected_results), len(cumulative_summaries)
            ),
        )

    def test_cumulative_all(self):
        expected_results = [
            {
                "year_month": 202310,
                "cumulative_actual_total": 266.088778,
                "cumulative_expected_total": 345.769147,
                "cumulative_availability": 76.96,
            },
            {
                "year_month": 202311,
                "cumulative_actual_total": 446.820901,
                "cumulative_expected_total": 572.420727,
                "cumulative_availability": 78.06,
            },
            {
                "year_month": 202312,
                "cumulative_actual_total": 611.970382,
                "cumulative_expected_total": 794.508058,
                "cumulative_availability": 77.03,
            },
            {
                "year_month": 202401,
                "cumulative_actual_total": 688.429822,
                "cumulative_expected_total": 895.069684,
                "cumulative_availability": 76.91,
            },
            {
                "year_month": 202402,
                "cumulative_actual_total": 1019.650029,
                "cumulative_expected_total": 1359.845536,
                "cumulative_availability": 74.98,
            },
            {
                "year_month": 202403,
                "cumulative_actual_total": 1455.147849,
                "cumulative_expected_total": 1913.893653,
                "cumulative_availability": 76.03,
            },
            {
                "year_month": 202404,
                "cumulative_actual_total": 1725.546327,
                "cumulative_expected_total": 2240.942609,
                "cumulative_availability": 77.00,
            },
            {
                "year_month": 202405,
                "cumulative_actual_total": 2124.981844,
                "cumulative_expected_total": 2796.895157,
                "cumulative_availability": 75.98,
            },
            {
                "year_month": 202406,
                "cumulative_actual_total": 2439.09438,
                "cumulative_expected_total": 3240.171512,
                "cumulative_availability": 75.28,
            },
            {
                "year_month": 202407,
                "cumulative_actual_total": 2744.702532,
                "cumulative_expected_total": 3702.875666,
                "cumulative_availability": 74.12,
            },
            {
                "year_month": 202408,
                "cumulative_actual_total": 2838.496642,
                "cumulative_expected_total": 3806.997615,
                "cumulative_availability": 74.56,
            },
        ]
        self.calculate_and_verify_summary(self.site, expected_results)

    def test_cumulative_specific_month(self):
        # Test for February 2024
        expected_feb = [
            {
                "year_month": 202402,
                "cumulative_actual_total": 1019.650029,
                "cumulative_expected_total": 1359.845536,
                "cumulative_availability": 74.98,
            }
        ]
        self.calculate_and_verify_summary(self.site, expected_feb, year=2024, month=2)

        # Test for December 2023
        expected_dec = [
            {
                "year_month": 202312,
                "cumulative_actual_total": 611.970382,
                "cumulative_expected_total": 794.508058,
                "cumulative_availability": 77.03,
            },
        ]

        self.calculate_and_verify_summary(self.site, expected_dec, year=2023, month=12)

        # Test for October 2023
        expected_oct = [
            {
                "year_month": 202310,
                "cumulative_actual_total": 266.088778,
                "cumulative_expected_total": 345.769147,
                "cumulative_availability": 76.96,
            }
        ]
        self.calculate_and_verify_summary(self.site, expected_oct, year=2023, month=10)

    def test_cumulative_new_month(self):
        # Test for a new month: February 2024
        expected_feb = [
            {
                "year_month": 202402,
                "cumulative_actual_total": 1019.650029,
                "cumulative_expected_total": 1359.845536,
                "cumulative_availability": 74.98,
            }
        ]
        self.calculate_and_verify_summary(
            self.site, expected_feb, year=2024, month=2, new_month=True
        )

        # Test for December 2023
        expected_dec = [
            {
                "year_month": 202312,
                "cumulative_actual_total": 611.970382,
                "cumulative_expected_total": 794.508058,
                "cumulative_availability": 77.03,
            },
        ]

        self.calculate_and_verify_summary(
            self.site, expected_dec, year=2023, month=12, new_month=True
        )

        # Test for a new month: October 2023
        expected_oct = [
            {
                "year_month": 202310,
                "cumulative_actual_total": 266.088778,
                "cumulative_expected_total": 345.769147,
                "cumulative_availability": 76.96,
            }
        ]
        self.calculate_and_verify_summary(
            self.site, expected_oct, year=2023, month=10, new_month=True
        )
