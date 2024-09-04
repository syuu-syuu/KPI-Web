import numpy as np
from solar.services.data_operations.save_to_db import save_inverter_name_mappings


def find_keywords(column, keywords_list):
    for keywords in keywords_list:
        if all(keyword.lower() in column.lower() for keyword in keywords):
            return True
    return False


def column_basic(df):
    keyword_mapping = {
        "Timestamp": [["timestamp"]],
        "POA Irradiance": [["poa"]],
        "Meter Power": [["meter", "power"], ["electric", "power"]],
    }

    rename_mapping = {}
    for new_name, keywords_list in keyword_mapping.items():
        found = False
        for col in df.columns:
            found = find_keywords(col, keywords_list)
            if found:
                rename_mapping[col] = new_name
                break
        if not found:
            df[new_name] = np.nan

    df.rename(columns=rename_mapping, inplace=True)

    return df


def column_inverter(df, site_id):
    inverter_name_mapping = {}
    known_columns = {
        "Timestamp",
        "POA Irradiance",
        "Meter Power",
    }
    inverter_index = 1

    for col in df.columns:
        if col not in known_columns:
            new_name = "Inverter_" + str(inverter_index)
            df.rename(columns={col: new_name}, inplace=True)
            # Used for renaming cols to their original names in the end of the processing
            inverter_name_mapping[new_name] = col
            inverter_index += 1

    save_inverter_name_mappings(site_id, inverter_name_mapping)

    return df


def column_reorder(df):
    inverter_columns = sorted(
        (col for col in df.columns if "Inverter" in col),
        key=lambda s: int(s.split("_")[1]),
    )

    columns_order = ["Timestamp", "POA Irradiance", "Meter Power"] + inverter_columns
    df = df[columns_order]

    return df


def rename(df, site_id):
    return (
        df.pipe(column_basic)
        .pipe(column_inverter, site_id=site_id)
        .pipe(column_reorder)
    )
