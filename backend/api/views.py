from django.http import JsonResponse, HttpResponse
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

def current_user(request):
    # Token authentication
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == 'token':
        try:
            token_obj = Token.objects.select_related('user').get(key=parts[1])
            user = token_obj.user
            return JsonResponse({'username': user.username, 'email': user.email})
        except Token.DoesNotExist:
            return JsonResponse({'detail': 'Invalid token'}, status=401)
    # Session authentication fallback
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username, 'email': request.user.email})
    return JsonResponse({'username': None}, status=401)

@ensure_csrf_cookie
def get_csrf_token(request):
    """Ensure CSRF cookie is set."""
    return HttpResponse()
