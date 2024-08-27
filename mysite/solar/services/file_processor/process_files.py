from .read_files import read_uploaded_files
from .rename_columns import rename


def process_files(uploaded_files):
    df = read_uploaded_files(uploaded_files)
    df = rename(df)
