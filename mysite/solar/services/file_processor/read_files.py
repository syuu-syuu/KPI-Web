import pandas as pd
import os


def detect_separator(line):
    if "," in line:
        return ","
    return ";"


def read_file(uploaded_file):
    file_extension = os.path.splitext(uploaded_file.name)[-1]
    if file_extension.lower() != ".csv":
        raise ValueError(f"Unsupported file format: {file_extension}")

    # Read the first 10 lines to detect the header and separator
    lines = []
    for _ in range(10):
        line = uploaded_file.readline().decode(
            "utf-8"
        )  # Ensure decoding from bytes to string
        if not line:
            break
        lines.append(line)

    # Find the header index
    header_index = next(
        (i for i, line in enumerate(lines) if "timestamp" in line.lower()), None
    )
    if header_index is None:
        raise ValueError("Header not found in the file.")

    # Detect separator from the header line
    separator = detect_separator(lines[header_index])

    # Rewind the file pointer back to the beginning
    uploaded_file.seek(0)

    # Read the data into a DataFrame, skipping rows until the header
    df = pd.read_csv(uploaded_file, skiprows=header_index, header=0, sep=separator)

    # Check and drop the first row if it's an extra unit row
    if pd.isna(df.iloc[0, 0]):
        df.drop(index=0, inplace=True)
        df.reset_index(drop=True, inplace=True)

    print("DataFrame loaded successfully:")
    print(df.head())  # Print first 5 rows
    print("DataFrame info:")
    print(df.info())  # Print a summary of the DataFrame

    return df


def read_uploaded_files(uploaded_files):
    for uploaded_file in uploaded_files:
        read_file(uploaded_file)
