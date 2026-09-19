from rest_framework.routers import DefaultRouter
from .views import SamplingLocationViewSet

router = DefaultRouter()

router.register(
    "locations",
    SamplingLocationViewSet,
    basename="sampling-location",
)

urlpatterns = router.urls
