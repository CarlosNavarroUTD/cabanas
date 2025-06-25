#myproject/hosts.py

from django_hosts import patterns, host
from django.conf import settings

host_patterns = patterns('',
    host(r'www', 'myproject.urls', name='www'),
    host(r'api', 'myproject.urls.api', name='api'),
    host(r'axol-backend', 'myproject.urls', name='axol-backend'),
    host(r'(?P<slug>[\w-]+)', 'apps.tiendas.urls.storefront', name='storefront'),
)


