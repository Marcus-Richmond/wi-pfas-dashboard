from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(
    "locations",
    SamplingLocationViewSet,
    basename="sampling-location",
)

router.register(
    "PFASsites",
    PFASsitesViewSet,
    basename="pfas-sites",
)

urlpatterns = router.urls
