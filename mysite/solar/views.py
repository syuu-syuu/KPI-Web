from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.http import JsonResponse
from .services.file_processor.process_files import read_uploaded_files
from .serializer import SiteSerializer, SiteHourlyDataSerializer
from .models import Site, SiteHourlyData, InverterData
from dateutil import parser
import pytz
from .services.file_processor.process_files import process_files
from .services.data_operations.process_data import process_site_hourly_data
from .services.data_operations.calculate_expected import calculate_expected
from .services.data_operations.calculate_availability import (
    calculate_daily_availability,
    calculate_monthly_availability,
    calculate_cumulative_availability,
    calculate_cumulative_availability_for_new_month,
)
from django.shortcuts import get_object_or_404

from .services.file_processor.get_geocoding import getGeocoding, getTimeZone
from django.core.files.storage import default_storage
from django.conf import settings
import os

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class UploadFileView(APIView):
    def post(self, request):
        print("Request for uploading file(s) for site:", request.data.get("site_id"), request.FILES.getlist("files"))
        uploaded_files = request.FILES.getlist("files")
        site_id = request.data.get("site_id")

        if not uploaded_files:
            return Response(
                {"status": "error", "message": "No files uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Create a temporary directory for the current site if it doesn't exist
            temp_dir = os.path.join(settings.TEMP_DIR, f'temp_{site_id}')
            os.makedirs(temp_dir, exist_ok=True)


            # Save the uploaded files to the temporary directory
            saved_files = []
            for file in uploaded_files:
                file_path = os.path.join(temp_dir, file.name)
                with default_storage.open(file_path, 'wb') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
                saved_files.append(file_path)

            request.session['pending_files'] = saved_files  
            request.session['site_id'] = site_id    

            return Response({
                "status": "success",
                "message": "Files uploaded successfully",
                "files": [os.path.basename(f) for f in saved_files]
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            print(f"Error occurred: {str(e)}")
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

class ProcessFileView(APIView):
    def post(self, request):
        site_id = request.session.get('site_id')
        saved_files = request.session.get('pending_files')

        print("Processing files for site:", site_id)
        print("Filepaths:", saved_files)

        if not saved_files:
            return Response({
                "status": "error",
                "message": "No pending files to process"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            process_files(saved_files, site_id)

            # Clean up temporary files
            for file in saved_files:
                os.remove(file)

            temp_dir = os.path.join(settings.TEMP_DIR, f'temp_{site_id}')
            os.rmdir(temp_dir)

            # Clean up session data
            request.session.pop('pending_files', None)
            request.session.pop('site_id', None)
            
            return Response({"status": "success", "message": f"Successfully processed {len(saved_files)} files for site {site_id}"}, status=status.HTTP_200_OK)
           
        except Exception as e:
            return Response({"error": str(e), "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     
           
    
class SiteHourlyDataViewSet(viewsets.ViewSet):
    queryset = SiteHourlyData.objects.all()

    @action(detail=False, methods=["get"])
    def get_available_time_range(self, request):
        site_id = request.query_params.get("site_id")
        print(f"Getting available time range for current site ID: {site_id}")
        site_data = SiteHourlyData.objects.filter(site_id=site_id)
        earliest = site_data.order_by("timestamp").first()
        latest = site_data.order_by("-timestamp").first()
        if earliest and latest:
            print(f"Earliest: {earliest.timestamp}, Latest: {latest.timestamp}")
            return JsonResponse(
                {
                    "earliest": earliest.timestamp.isoformat(),
                    "latest": latest.timestamp.isoformat(),
                }
            )
        return JsonResponse({"error": "No data found for this site"}, status=404)

    @action(detail=False, methods=["get"])
    def get_hourly(self, request):
        site_id = request.query_params.get("site_id")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        print("Getting dates:", start_date, end_date)

        if not site_id or not start_date or not end_date:
            return Response({"error": "Missing required parameters"}, status=400)

        try:
            # Get site's timezone
            lat, lng = getGeocoding(site_id)
            site_timezone = pytz.timezone(getTimeZone(lat, lng))

            # Parse dates from ISO format, remove UTC timezone, and localize to site timezone
            # start_date = site_timezone.localize(parser.isoparse(start_date).replace(tzinfo=None))
            # end_date = site_timezone.localize(
            #     parser.isoparse(end_date).replace(hour=23, minute=59, second=59, microsecond=999999, tzinfo=None)
            # )
            start_date = parser.isoparse(start_date).replace(
                hour=0,
                minute=0,
                second=0,
            )

            end_date = parser.isoparse(end_date).replace(
                hour=23,
                minute=59,
                second=59,
            )

            # start_date = site_timezone.localize(start_date)
            # end_date = site_timezone.localize(end_date)
            print("💙 start_date, end_date:", start_date, end_date)

        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)

        queryset = (
            SiteHourlyData.objects.all()
            .filter(site_id=site_id, timestamp__range=(start_date, end_date))
            .order_by("timestamp")
            .prefetch_related("inverters")
        )

        serializer = SiteHourlyDataSerializer(queryset, many=True)
        # print(queryset, serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def process_original(self, request):
        site_id = request.data.get("site_id")

        if not site_id:
            return Response({"error": "Missing site_id"}, status=400)

        try:
            process_site_hourly_data(site_id)
            return Response({"success": "Data processed successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class KPIViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"])
    def calculate_availabilities(self, request, year=None, month=None):
        site_id = request.data.get("site_id")
        site = get_object_or_404(Site, pk=site_id)

        calculate_expected(site_id)
        calculate_daily_availability(site, year, month)
        calculate_monthly_availability(site, year, month)
        calculate_cumulative_availability(site, year, month)

        return Response({"status": "Availability calculations complete."})
