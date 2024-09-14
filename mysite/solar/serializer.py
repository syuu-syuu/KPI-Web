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


class InverterDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = InverterData
        fields = ["inverter_name", "value"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["value"] = format_string_value(data.get("value"))
        return data


class SiteHourlyDataSerializer(serializers.ModelSerializer):
    inverters = InverterDataSerializer(many=True, read_only=True)

    class Meta:
        model = SiteHourlyData
        fields = ["timestamp", "POA_Irradiance", "meter_power", "is_day", "inverters"]

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

        return data
