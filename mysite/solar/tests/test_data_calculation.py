from decimal import Decimal
from solar.models import InverterData, SiteDailySummary
from .test_data import SiteHourlyDataTestBase
from solar.services.data_operations.process_data import process_site_hourly_data
from solar.services.data_operations.calculate_expected import calculate_expected
from solar.services.data_operations.calculate_availability import (
    calculate_daily_availability,
)


class SiteHourlyDataExpectedTest(SiteHourlyDataTestBase):
    def assert_inverter_expected_values(self, site_hourly_data, expected_values):
        """Helper function to assert expected values of InverterData."""
        updated_inverters = InverterData.objects.filter(
            site_hourly_data=site_hourly_data
        )
        for inverter in updated_inverters:
            self.assertEqual(
                inverter.expected_value,
                expected_values[inverter.inverter_name],
                "Asserting expected_value of" + inverter.inverter_name,
            )

    def execute_inverter_test(self, data_creation_method, expected_values):
        """Abstracted method to run common test logic for inverter tests."""
        site_hourly_data = data_creation_method()
        process_site_hourly_data(self.site.site_id)
        calculate_expected(self.site.site_id)
        self.assert_inverter_expected_values(site_hourly_data, expected_values)

    def test_expected_b(self):
        expected_values = {
            "Inverter_1": Decimal("1"),
            "Inverter_2": Decimal("1"),
            "Inverter_3": Decimal("20.54321"),
            "Inverter_4": Decimal("20.54321"),
        }

        self.execute_inverter_test(self.create_data_b, expected_values)

    def test_expected_c1(self):
        expected_values = {
            "Inverter_1": Decimal("1"),
            "Inverter_2": Decimal("30.54321"),
            "Inverter_3": Decimal("30.54321"),
            "Inverter_4": Decimal("30.54321"),
        }
        self.execute_inverter_test(self.create_data_c1, expected_values)

    def test_expected_c2(self):
        expected_values = {
            "Inverter_1": Decimal("30.54321"),
            "Inverter_2": Decimal("30.54321"),
            "Inverter_3": Decimal("30.54321"),
            "Inverter_4": Decimal("30.54321"),
        }

        self.execute_inverter_test(self.create_data_c2, expected_values)


class SiteDailyAvailabilityTest(SiteHourlyDataTestBase):
    def assert_daily_summary(self, expected_results):
        """Helper function to assert the daily summary results."""
        daily_summaries = SiteDailySummary.objects.filter(site=self.site).order_by(
            "date"
        )
        for summary, expected in zip(daily_summaries, expected_results):
            self.assertEqual(
                summary.actual_total, expected["actual_total"], "Asserting actual_total"
            )
            self.assertEqual(
                summary.expected_total,
                expected["expected_total"],
                "Asserting expected_total",
            )
            self.assertAlmostEqual(
                summary.availability, expected["availability"], places=2
            )

    def execute_daily_availability_test(self, data_creation_method, expected_results):
        """Abstracted method to run common test logic for daily availability tests."""
        data_creation_method()
        process_site_hourly_data(self.site.site_id)
        calculate_expected(self.site.site_id)
        calculate_daily_availability(self.site)
        self.assert_daily_summary(expected_results)

    def test_daily_b(self):
        expected_results = [
            {
                "date": "2024-01-01",
                "actual_total": Decimal("43.08642"),
                "expected_total": Decimal("43.08642"),
                "availability": Decimal("100.00"),
            },
        ]

        self.execute_daily_availability_test(self.create_data_b, expected_results)

    def test_daily_c1(self):
        expected_results = [
            {
                "date": "2024-02-01",
                "actual_total": Decimal("62.08642"),
                "expected_total": Decimal("92.62963"),
                "availability": Decimal("67.02652272"),
            },
        ]

        self.execute_daily_availability_test(self.create_data_c1, expected_results)

    def test_daily_c2(self):
        expected_results = [
            {
                "date": "2024-03-01",
                "actual_total": Decimal("61.08642"),
                "expected_total": Decimal("122.17284"),
                "availability": Decimal("50.00"),
            },
        ]

        self.execute_daily_availability_test(self.create_data_c2, expected_results)
