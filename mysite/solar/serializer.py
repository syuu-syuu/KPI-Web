from rest_framework import serializers
from .models import Site, SiteHourlyData, InverterData
from decimal import Decimal
import re


def format_string_value(value):
    if value is None or value == "":
        return "N/A"

    if float(value) == 0:
        return "0"

    value_str = str(value)
    if "." in value_str:
        value_str = value_str.rstrip("0").rstrip(".")

    return value_str


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = "__all__"

        def to_representation(self, instance):
            data = super().to_representation(instance)
            data["latitude"] = format_string_value(data.get("latitude"))
            data["longitude"] = format_string_value(data.get("longitude"))
            return data


class InverterDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = InverterData
        fields = [
            "inverter_name",
            "value",
            "processed_value",
            "expected_value",
            "is_modified",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["value"] = format_string_value(data.get("value"))
        data["processed_value"] = format_string_value(data.get("processed_value"))
        data["expected_value"] = format_string_value(data.get("expected_value"))
        data["is_modified"] = bool(data.get("is_modified", False))
        return data


class SiteHourlyDataSerializer(serializers.ModelSerializer):
    inverters = InverterDataSerializer(many=True, read_only=True)

    class Meta:
        model = SiteHourlyData
        fields = [
            "timestamp",
            "POA_Irradiance",
            "meter_power",
            "is_day",
            "status",
            "count_missing",
            "count_should_on_but_not",
            "inverters",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["POA_Irradiance"] = format_string_value(data.get("POA_Irradiance"))
        data["meter_power"] = format_string_value(data.get("meter_power"))

        if data.get("is_day") is True:
            data["is_day"] = "Day"
        elif data.get("is_day") is False:
            data["is_day"] = "Night"
        else:
            data["is_day"] = "Unknown"

        data["count_missing"] = data.get("count_missing", 0)
        data["count_should_on_but_not"] = data.get("count_should_on_but_not", 0)
        data["status"] = data.get("status", "D")

        return data
