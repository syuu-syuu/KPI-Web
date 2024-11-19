from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, UploadFileView, SiteHourlyDataViewSet, KPIViewSet

# router = DefaultRouter(trailing_slash=False)
router = DefaultRouter()
router.register(r"sites", SiteViewSet, basename="site")
router.register(
    r"site_hourly_data",
    SiteHourlyDataViewSet,
    basename="site_hourly_data",
)
router.register(
    r"kpi",
    KPIViewSet,
    basename="kpi",
)

urlpatterns = [
    path("upload_file/", UploadFileView.as_view()),
    path("", include(router.urls)),
]
