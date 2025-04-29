from django.http import JsonResponse

def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username, 'email': request.user.email})
    return JsonResponse({'username': None}, status=401)
