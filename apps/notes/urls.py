from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NodeViewSet

router = DefaultRouter()
router.register(r'nodes', NodeViewSet, basename='node')

urlpatterns = [
    path('', include(router.urls)),
]

# Las URLs resultantes serán:
# /api/nodes/ - GET (listar), POST (crear)
# /api/nodes/<id>/ - GET (detalle), PUT/PATCH (actualizar), DELETE (eliminar)
# /api/nodes/<id>/children/ - GET (listar hijos)
# /api/nodes/<id>/share/ - POST (compartir)
# /api/nodes/<id>/move/ - POST (mover)
# /api/nodes/<id>/share_info/ - GET (info de compartidos)
# /api/nodes/<id>/toggle_complete/ - POST (marcar/desmarcar completo)
# /api/nodes/root_nodes/ - GET (listar nodos raíz)
# /api/nodes/batch_update/ - POST (actualizar múltiples)
# /api/nodes/search/ - GET (búsqueda avanzada)