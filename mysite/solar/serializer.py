from rest_framework import serializers
from .models import Site, SiteMonthlyData, InverterData


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

        # Convert value to float
        if data.get("value") is not None:
            try:
                data["value"] = float(data["value"])
            except ValueError:
                data["value"] = None

        return data


class SiteMonthlyDataSerializer(serializers.ModelSerializer):
    inverters = InverterDataSerializer(many=True, read_only=True)

    class Meta:
        model = SiteMonthlyData
        fields = ["timestamp", "POA_Irradiance", "meter_power", "is_day", "inverters"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Convert POA_Irradiance to float
        if data.get("POA_Irradiance") is not None:
            try:
                data["POA_Irradiance"] = float(data["POA_Irradiance"])
            except ValueError:
                data["POA_Irradiance"] = None

        # Convert meter_power to float
        if data.get("meter_power") is not None:
            try:
                data["meter_power"] = float(data["meter_power"])
            except ValueError:
                data["meter_power"] = None

        if data.get("is_day") is True:
            data["is_day"] = "Day"
        elif data.get("is_day") is False:
            data["is_day"] = "Night"
        else:
            data["is_day"] = "Unknown"

        return data
