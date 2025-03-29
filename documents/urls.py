from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('upload/', views.upload_document, name='upload_document'),
    path('stamp/', views.stamp_document, name='stamp_document'),
    path('management/', views.management, name='management'),
    path('documents/', views.view_documents, name='documents'),
    
    path('stamp_library/', views.stamp_library, name='stamp_library'),
    path('signature_library/', views.signature_library, name='signature_library'),
    path('logo_library/', views.logo_library, name='logo_library'),
    path('upload_file/', views.upload_file, name='upload_file'),  # Add this line
    
    path('create/stamp/', views.create_stamp, name='create_stamp'),
    path('create/signature/', views.create_signature, name='create_signature'),
    path('create/logo/', views.create_logo, name='create_logo'),
    path('api/save-design/', views.save_design, name='save_design'),
]