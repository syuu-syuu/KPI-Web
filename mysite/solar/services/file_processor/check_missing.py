import numpy as np
import pandas as pd


def check_missing_irradiance(df):
    condition_missing = df["POA Irradiance"].isna()
    # Fill all the missings with -999
    df.loc[condition_missing, "POA Irradiance"] = -999

    # If existing Irradiance > 2, modify any corresponding "Day/Night" info to "Day".
    condition_day_irr = df["POA Irradiance"] > 2
    condition_night_irr = (df["POA Irradiance"] != -999) & (df["POA Irradiance"] <= 1)
    df.loc[condition_day_irr, "Day/Night"] = "Day"
    df.loc[condition_night_irr, "Day/Night"] = "Night"

    return df


def fill_inverter_with_0(df, condition_off):
    INV_OUTAGE_THRESHOLD = 0.1
    inverter_cols = [col for col in df.columns if col.startswith("Inverter_")]
    condition_problematic = df[inverter_cols].isna() | (
        df[inverter_cols] < INV_OUTAGE_THRESHOLD
    )
    condition_can_be_filled = condition_problematic.any(axis=1) & condition_off
    if condition_can_be_filled.sum() > 0:
        # Replace problematic inverter values with 0
        df.loc[condition_can_be_filled, inverter_cols] = df.loc[
            condition_can_be_filled, inverter_cols
        ].mask(condition_problematic, 0)

    return df


def check_missing(df):
    # Replace all " - " with NaN before handling missings.
    df.replace(" - ", np.nan, inplace=True)

    df = check_missing_irradiance(df)

    # Check and autofill inverter
    # Step 1
    # Fill problematic inverter values with 0 when the site is off.
    # The site should be off during night time or when meter power is below 1.
    condition_site_off = (df["Meter Power"] <= 1) | (df["Day/Night"] == "Night")
    df = fill_inverter_with_0(df, condition_site_off)

    return df
