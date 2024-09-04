from django.urls import path
from .views import render_dataframe

urlpatterns = [
    path("render/", render_dataframe, name="render_dataframe"),
]
