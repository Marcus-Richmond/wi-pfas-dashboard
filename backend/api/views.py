from rest_framework import viewsets
from .models import SamplingLocation
from .serializers import SamplingLocationSerializer

# Create your views here.
class SamplingLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SamplingLocation.objects.all().order_by("objectid")
    serializer_class = SamplingLocationSerializer