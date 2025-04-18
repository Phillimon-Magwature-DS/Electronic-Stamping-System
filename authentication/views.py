from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('dashboard')  # Redirect to the dashboard after login
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'authentication/login.html')

def logout(request):
    auth_logout(request)
    return redirect('login')  # Redirect to the login page after logout