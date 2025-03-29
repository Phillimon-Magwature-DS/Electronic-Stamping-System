from django.shortcuts import render

def help_desk(request):
    return render(request, 'help_desk/help_desk.html')