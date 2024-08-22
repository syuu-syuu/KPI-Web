from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import os


@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        print("Received a request!")
        print("Request method:", request.method)
        print("Request files:", request.FILES)

        uploaded_file = request.FILES.get("files")
        if uploaded_file:
            file_extension = os.path.splitext(uploaded_file.name)[1]
            if file_extension.lower() in [".csv", ".xlsx"]:
                # Read file
                if file_extension.lower() == ".csv":
                    df = pd.read_csv(uploaded_file)
                elif file_extension.lower() == ".xlsx":
                    df = pd.read_excel(uploaded_file)

                # Process data here

                return JsonResponse(
                    {"status": "success", "message": "File uploaded and processed"}
                )
            else:
                return JsonResponse(
                    {"status": "error", "message": "Unsupported file format"},
                    status=400,
                )
        else:
            return JsonResponse(
                {"status": "error", "message": "No file uploaded"}, status=400
            )
    return JsonResponse(
        {"status": "error", "message": "Invalid request method"}, status=405
    )
