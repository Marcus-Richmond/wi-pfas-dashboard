from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework_gis.fields import GeometryField
from .models import *

class SamplingLocationSerializer(GeoFeatureModelSerializer):
    geom = GeometryField(source="geom_4326", read_only=True)

    class Meta:
        model = SamplingLocation
        geo_field = "geom"
        fields = ("objectid", "geom", "primary_station_name")

class PFASsitesSerializer(GeoFeatureModelSerializer):
    geom = GeometryField(read_only=True)

    class Meta:
        model = PFASsites
        geo_field = "geom"
        fields = ("objectid", "geom", "sitename")