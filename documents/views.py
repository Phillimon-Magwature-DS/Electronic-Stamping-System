from django.shortcuts import render, redirect
from django.core.files.storage import default_storage
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import base64
from django.core.files.base import ContentFile
import os
from datetime import datetime


def upload_document(request):
    if request.method == 'POST' and request.FILES.get('document'):
        file = request.FILES['document']
        file_name = default_storage.save(file.name, file)
        request.session['uploaded_file'] = file_name
        return redirect('stamp_document')  # Redirect to the stamping page

    return render(request, 'documents/upload.html')

def stamp_document(request):
    file_name = request.session.get('uploaded_file')
    if not file_name:
        return redirect('upload_document')
    
    file_url = request.build_absolute_uri(settings.MEDIA_URL + file_name)
    return render(request, 'documents/stamp_document.html', {
        'file_url': file_url,
        'file_name': file_name
    })

def management(request):
    return render(request, 'documents/management.html')

def stamp_library(request):
    return render(request, 'documents/stamp_library.html')

def signature_library(request):
    return render(request, 'documents/signature_library.html')

def logo_library(request):
    return render(request, 'documents/logo_library.html')

@csrf_exempt  # Add this decorator to handle CSRF token for AJAX requests
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        category = request.POST.get('type', 'stamp')  # Changed from 'category' to 'type' to match your JS
        file_name = default_storage.save(f'{category}/{file.name}', file)
        return JsonResponse({
            'success': True, 
            'file_url': default_storage.url(file_name),
            'message': f'File uploaded successfully to {category} library!'
        })
    return JsonResponse({'success': False, 'error': 'Invalid request'})


def create_stamp(request):
    return render(request, 'documents/design_canvas.html', {'design_type': 'stamp'})

def create_signature(request):
    return render(request, 'documents/design_canvas.html', {'design_type': 'signature'})

def create_logo(request):
    return render(request, 'documents/design_canvas.html', {'design_type': 'logo'})

@csrf_exempt
def save_design(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            design_type = data.get('type')
            image_data = data.get('image_data')
            
            if not all([design_type, image_data]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'})
            
            # Extract base64 image data
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            
            # Generate unique filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{design_type}_{timestamp}.{ext}"
            
            # Save to appropriate directory
            file_path = os.path.join(settings.MEDIA_ROOT, design_type + 's', filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(imgstr))
            
            return JsonResponse({
                'success': True,
                'file_url': os.path.join(settings.MEDIA_URL, design_type + 's', filename)
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

def dashboard(request):
    return render(request, 'documents/dashboard.html')

def view_documents(request):
    return render(request, 'documents/documents.html')