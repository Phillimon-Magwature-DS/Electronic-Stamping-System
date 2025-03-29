from django.conf import settings  # Add this line
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('docs/', include('documents.urls')),
    path('audit/', include('audit.urls')),
    path('help-desk/', include('help_desk.urls')),
    path('', RedirectView.as_view(url='auth/login/')),  # Redirect root to login page
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)