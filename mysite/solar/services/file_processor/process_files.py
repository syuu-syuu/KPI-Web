from .read_files import read_uploaded_files, test_read_uploaded_files
from .rename_columns import rename
from .normalize_data import normalize


def process_files(uploaded_files, site_id):
    df = read_uploaded_files(uploaded_files)
    df = rename(df, site_id)

    return df


def test_process_files(file_path, site_id):
    df = test_read_uploaded_files(file_path)
    df = rename(df, site_id)
    df = normalize(df, site_id)

    return df
