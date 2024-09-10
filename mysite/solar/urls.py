from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteViewSet,
    UploadFileView,
    get_available_time_range,
    SiteMonthlyDataViewSet,
)

# router = DefaultRouter(trailing_slash=False)
router = DefaultRouter()
router.register(r"sites", SiteViewSet, basename="site")
router.register(
    r"site_monthly_data",
    SiteMonthlyDataViewSet,
    basename="site_monthly_data",
)

urlpatterns = [
    path("upload_file/", UploadFileView.as_view()),
    path("", include(router.urls)),
    path("get_available_time_range/<int:site_id>/", get_available_time_range),
]
