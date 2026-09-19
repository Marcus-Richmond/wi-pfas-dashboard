from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework_gis.fields import GeometryField
from .models import SamplingLocation

class SamplingLocationSerializer(GeoFeatureModelSerializer):
    geom = GeometryField(transform=4326, read_only=True)

    class Meta:
        model = SamplingLocation
        geo_field = "geom"
        fields = ("objectid", "geom", "primary_station_name")