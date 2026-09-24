from rest_framework import viewsets
from .models import SamplingLocation
from .serializers import SamplingLocationSerializer
from django.contrib.gis.db.models.functions import Transform

# Create your views here.
class SamplingLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SamplingLocation.objects.annotate(
        geom_4326=Transform("geom", 4326)
    ).order_by("objectid")
    serializer_class = SamplingLocationSerializer