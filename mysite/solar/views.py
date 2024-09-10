from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.http import JsonResponse
from .services.file_processor.process_files import read_uploaded_files
from .serializer import SiteSerializer, SiteMonthlyDataSerializer
from .models import Site, SiteMonthlyData, InverterData
from datetime import datetime
from dateutil import parser


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


def get_available_time_range(request, site_id):
    # Get the earliest and latest timestamps for the given site
    print(f"Getting available time range for current site ID: {site_id}")
    earliest = SiteMonthlyData.objects.all().order_by("timestamp").first()
    latest = SiteMonthlyData.objects.all().order_by("-timestamp").first()
    if earliest and latest:
        print(f"Earliest: {earliest.timestamp}, Latest: {latest.timestamp}")
        return JsonResponse(
            {
                "earliest": earliest.timestamp.isoformat(),
                "latest": latest.timestamp.isoformat(),
            }
        )
    return JsonResponse({"error": "No data found for this site"}, status=404)


class UploadFileView(APIView):
    def post(self, request):
        print("Received a request!", request)
        print("Request site:", request.data.get("site_id"))
        print("Request files:", request.FILES.getlist("files"))

        uploaded_files = request.FILES.getlist("files")

        if not uploaded_files:
            return Response(
                {"status": "error", "message": "No files uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            site_id = request.data.get("site_id")
            request.session["site_id"] = site_id

            return Response(
                {"status": "success", "message": "File uploaded and processed"},
                status=status.HTTP_200_OK,
            )

            # dfs = read_uploaded_files(uploaded_files)
            # if not dfs:
            #     print("No DataFrames were created.")
            # else:
            #     print(f"Number of DataFrames: {len(dfs)}")
            #     print(f"Type of first DataFrame: {type(dfs[0])}")

            # return render_dataframe(request, dfs=dfs)

        except ValueError as e:
            print(f"Error occurred: {str(e)}")
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class SiteMonthlyDataViewSet(viewsets.ViewSet):
    queryset = SiteMonthlyData.objects.all()

    @action(detail=False, methods=["get"])
    def list_original(self, request):
        site_id = request.query_params.get("site_id")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not site_id or not start_date or not end_date:
            return Response({"error": "Missing required parameters"}, status=400)

        try:
            start_date = parser.isoparse(start_date)
            end_date = parser.isoparse(end_date).replace(
                hour=23, minute=59, second=59, microsecond=999999
            )
            print(start_date, end_date)
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)

        queryset = (
            SiteMonthlyData.objects.all()
            .filter(site_id=site_id, timestamp__range=(start_date, end_date))
            .prefetch_related("inverters")
        )

        serializer = SiteMonthlyDataSerializer(queryset, many=True)
        # print(queryset, serializer.data)
        return Response(serializer.data)
