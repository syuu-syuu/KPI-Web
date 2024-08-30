from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"sites", views.SiteViewSet)

urlpatterns = [
    path("upload_file/", views.UploadFileView.as_view()),
    path("", include(router.urls)),
]
