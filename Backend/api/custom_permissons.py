# permissions.py
from rest_framework.permissions import BasePermission
from .models import UserProfile

class IsAdminUser(BasePermission):
    """
    Custom permission to only allow users with 'admin' role in Profile.
    """

    def has_permission(self, request, view):
        user = request.user
        if user and user.is_authenticated:
            try:
                profile = UserProfile.objects.get(user=user)
                print(profile.role, "profile.role")
                return profile.role == 'admin'
            except UserProfile.DoesNotExist:
                return False
        return False
