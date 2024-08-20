import csv
from django.core.management.base import BaseCommand
from solar.models import Site


class Command(BaseCommand):
    help = "Import sites from a CSV file"

    def handle(self, *args, **kwargs):
        with open(
            "/Users/zhouzhongle/Downloads/KPI-Web/mysite/csv_importer/site_data.csv",
            encoding="utf-8-sig",
        ) as csvfile:
            reader = csv.DictReader(csvfile)
            # print("CSV Headers:", reader.fieldnames)
            for row in reader:
                site, created = Site.objects.update_or_create(
                    site_name=row["Site Name"],
                    defaults={
                        "latitude": row["Latitude"],
                        "longitude": row["Longitude"],
                        "address": row["Address"],
                        "contract_start_month": row["Start Month"],
                        "contract_end_month": row["End Month"],
                        "city": row["City"],
                        "state": row["State"],
                    },
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Successfully created site {site.site_name}"
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS(f"Updated site {site.site_name}")
                    )
