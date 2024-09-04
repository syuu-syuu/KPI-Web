from django.shortcuts import render
import pandas as pd
from django.http import HttpResponse
from solar.services.file_processor.process_files import test_process_files

sample_data = {
    "Timestamp": [
        "2023-09-01 06:00",
        "2023-09-01 07:00",
        "2023-09-01 08:00",
        "2023-09-01 09:00",
        "2023-09-01 10:00",
        "2023-09-01 11:00",
    ],
    "POA Irradiance": [
        0.6604338,
        48.02438,
        245.9818,
        484.4322,
        686.4131,
        897.1225,
    ],
    "Inverter_1": [
        0,
        32.248,
        237.8458,
        499.3326,
        670.6104,
        816.714,
    ],
    "Inverter_2": [
        0,
        25.53703,
        205.4032,
        466.2597,
        635.9458,
        797.2877,
    ],
    "Inverter_3": [
        0,
        37.13757,
        222.1378,
        465.8517,
        656.3559,
        798.8707,
    ],
    "Production Meter Power": [
        -8.580125,
        183.2424,
        1298.397,
        2870.966,
        3994.97,
        4806.351,
    ],
}


# Only for test purposes
def render_dataframe(request):
    # Temporary Retrieve the site_id from the session
    site_id = request.session.get("site_id")
    print(f"Site ID: {site_id}")
    df_to_be_rendered = test_process_files(
        "siteData/2023-09/2023-09_Dairy Solar.csv", site_id
    )
    dataframe_html_list = []

    if df_to_be_rendered is None:
        print("Rendering sample data.")
        dataframe_html_list.append(
            pd.DataFrame(sample_data).to_html(classes="table table-striped")
        )
    else:
        print("Rendering uploaded data.")
        dataframe_html_list.append(
            df_to_be_rendered.to_html(classes="table table-striped")
        )

    combined_html = "<br><br>".join(dataframe_html_list)
    return render(
        request,
        "data_render/dataframe_view.html",
        {"dataframe_html": combined_html},
    )
