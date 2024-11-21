from rest_framework.routers import DefaultRouter
from .views import (
    ActividadViewSet, 
    PaqueteViewSet, 
    PaqueteCabanaViewSet, 
    PaqueteActividadViewSet
)

router = DefaultRouter()
router.register(r'actividades', ActividadViewSet)
router.register(r'paquetes', PaqueteViewSet)

urlpatterns = router.urls