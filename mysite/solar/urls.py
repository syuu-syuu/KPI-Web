from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, UploadFileView

# router = DefaultRouter(trailing_slash=False)
router = DefaultRouter()
router.register(r"sites", SiteViewSet)

urlpatterns = [
    path("upload_file/", UploadFileView.as_view()),
    path("", include(router.urls)),
]
