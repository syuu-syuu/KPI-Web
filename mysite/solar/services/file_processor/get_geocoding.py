import pandas as pd
from timezonefinder import TimezoneFinder
from solar.models import Site


# Get longitude and latitude
def getGeocoding(site_id):
    site = Site.objects.get(site_id=site_id)
    return site.latitude, site.longitude


def getTimeZone(latitude, longitude):
    if latitude and longitude:
        tf = TimezoneFinder()
        return tf.timezone_at(lng=longitude, lat=latitude)

    return None


def getTargetTime(original_time, original_timezone, target_timezone):
    if original_time.tzinfo is None:
        original_time = original_time.tz_localize(original_timezone)
    target_time = original_time.tz_convert(target_timezone)

    return target_time
