from django.contrib.auth.backends import BaseBackend
from .models import RequestUser

class CustomAuthBackend(BaseBackend):
    def authenticate(request, email=None, password=None, **kwargs):
        print("++++++", request)
        print("++++++", email)
        print("++++++", password)
        try:
            user = RequestUser.objects.get(email=email)
            if user.check_password(password):
                return user
        except RequestUser.DoesNotExist:
            return None