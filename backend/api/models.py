from django.contrib.gis.db import models

# Create your models here.
class SamplingLocation(models.Model):
    objectid = models.IntegerField(primary_key=True)
    geom = models.PointField(srid=3071)
    primary_station_name = models.TextField()

    class Meta:
        managed = False
        db_table = "sampling_locations"