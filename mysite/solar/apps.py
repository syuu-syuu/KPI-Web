from django.apps import AppConfig
import os
from django.conf import settings
import shutil

class SolarConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'solar'

    def ready(self):
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        os.makedirs(settings.TEMP_DIR, exist_ok=True)

        temp_dir = settings.TEMP_DIR
        if os.path.exists(temp_dir):
            for item in os.listdir(temp_dir):
                item_path = os.path.join(temp_dir, item)
                if os.path.isdir(item_path):
                    shutil.rmtree(item_path)
