# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework import viewsets
from .services.file_processor.process_files import read_uploaded_files
from .models import Site
from .serializer import SiteSerializer


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class UploadFileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
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
