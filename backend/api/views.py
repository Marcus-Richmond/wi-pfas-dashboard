from django.contrib.gis.db.models.functions import Transform

from rest_framework import viewsets
from .models import *
from .serializers import *

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

# Create your views here.
class SamplingLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SamplingLocation.objects.annotate(geom_4326=Transform("geom", 4326)).order_by("objectid")
    serializer_class = SamplingLocationSerializer

    @method_decorator(cache_page(60))
    @method_decorator(vary_on_headers("Accept", "Cookie", "Authorization", "Origin"))

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class PFASsitesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PFASsites.objects.order_by("objectid")
    serializer_class = PFASsitesSerializer

    @method_decorator(cache_page(60))
    @method_decorator(vary_on_headers("Accept", "Cookie", "Authorization", "Origin"))

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)