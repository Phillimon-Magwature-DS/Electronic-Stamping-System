from django.urls import path
from . import views

urlpatterns = [
    path('help-desk/', views.help_desk, name='help_desk'),
]