from django.shortcuts import render

def audit_logs(request):
    return render(request, 'audit/logs.html')