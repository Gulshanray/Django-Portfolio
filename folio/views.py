from django.shortcuts import render, redirect
from .forms import ContactForm


def home(request):
    return render(request, 'index.html')

def index(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index') 
    else:
        form = ContactForm()
    
    context = {'form': form}
    return render(request, 'index.html', context)

