from .read_files import read_uploaded_files, test_read_uploaded_files
from .rename_columns import rename
from .normalize_data import normalize
from .check_missing import check_missing
from solar.services.data_operations.save_to_db import save_processed_data_to_db


def process_files(uploaded_files, site_id):
    df = read_uploaded_files(uploaded_files)
    df = rename(df, site_id)

    return df


def test_process_files(file_path, site_id):
    df = test_read_uploaded_files(file_path)
    df = rename(df, site_id)
    df = normalize(df, site_id)
    df = check_missing(df)
    save_processed_data_to_db(df, site_id)

    return df
