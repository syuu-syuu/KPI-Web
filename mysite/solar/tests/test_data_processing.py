from django.test import TestCase
from solar.models import Site, SiteHourlyData, InverterData
from datetime import datetime
from decimal import Decimal
from solar.services.data_operations.process_data import process_site_hourly_data
from .test_data import SiteHourlyDataTestBase


class SiteHourlyDataProcessingTest(SiteHourlyDataTestBase):
    def assert_processed_values(self, site_hourly_data, expected_processed_values):
        """Helper function to assert expected values of processed SiteHourlyData and InverterData."""
        updated_site_hourly_data = SiteHourlyData.objects.get(id=site_hourly_data.id)

        self.assertEqual(
            updated_site_hourly_data.count_should_on_but_not,
            expected_processed_values["count_should_on_but_not"],
            "Asserting count_should_on_but_not",
        )
        self.assertEqual(
            updated_site_hourly_data.count_missing,
            expected_processed_values["count_missing"],
            "Asserting count_missing",
        )
        self.assertEqual(
            updated_site_hourly_data.status,
            expected_processed_values["status"],
            "Asserting status",
        )

        updated_inverters = InverterData.objects.filter(
            site_hourly_data=site_hourly_data
        )
        for inverter in updated_inverters:
            self.assertEqual(
                inverter.processed_value,
                expected_processed_values[inverter.inverter_name],
                "Asserting processed_value of" + inverter.inverter_name,
            )

    def test_process_a(self):
        site_hourly_data = self.create_data_a()
        process_site_hourly_data(self.site.site_id)
        expected_processed_values = {
            "count_should_on_but_not": 0,
            "count_missing": 0,
            "status": "A",
            "Inverter_1": Decimal("100.654321"),
            "Inverter_2": Decimal("120.654321"),
            "Inverter_3": Decimal("98.654321"),
            "Inverter_4": Decimal("101.654321"),
        }

        self.assert_processed_values(site_hourly_data, expected_processed_values)

    def test_process_b(self):
        site_hourly_data = self.create_data_b()
        process_site_hourly_data(self.site.site_id)
        expected_processed_values = {
            "count_should_on_but_not": 2,
            "count_missing": 2,
            "status": "B",
            "Inverter_1": Decimal("1"),
            "Inverter_2": Decimal("1"),
            "Inverter_3": Decimal("20.54321"),
            "Inverter_4": Decimal("20.54321"),
        }

        self.assert_processed_values(site_hourly_data, expected_processed_values)

    def test_process_c1(self):
        site_hourly_data = self.create_data_c1()
        process_site_hourly_data(self.site.site_id)
        expected_processed_values = {
            "count_should_on_but_not": 1,
            "count_missing": 2,
            "status": "C",
            "Inverter_1": Decimal("1"),
            "Inverter_2": Decimal("0"),
            "Inverter_3": Decimal("30.54321"),
            "Inverter_4": Decimal("30.54321"),
        }

        self.assert_processed_values(site_hourly_data, expected_processed_values)

    def test_process_c2(self):
        site_hourly_data = self.create_data_c2()
        process_site_hourly_data(self.site.site_id)
        expected_processed_values = {
            "count_should_on_but_not": None,
            "count_missing": 2,
            "status": "C",
            "Inverter_1": Decimal("0"),
            "Inverter_2": Decimal("0"),
            "Inverter_3": Decimal("30.54321"),
            "Inverter_4": Decimal("30.54321"),
        }

        self.assert_processed_values(site_hourly_data, expected_processed_values)

    def test_process_d(self):
        site_hourly_data = self.create_data_d()
        process_site_hourly_data(self.site.site_id)
        expected_processed_values = {
            "count_should_on_but_not": None,
            "count_missing": None,
            "status": "D",
            "Inverter_1": None,
            "Inverter_2": None,
            "Inverter_3": None,
            "Inverter_4": None,
        }

        self.assert_processed_values(site_hourly_data, expected_processed_values)
