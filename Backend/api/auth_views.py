from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer
from .models import User, Region, WeatherData


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)    



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_my_password(request):
    user = request.user
    user.set_password(request.data['password'])
    user.save()
    return Response(status=status.HTTP_200_OK)



@api_view(['GET'])
def get_all_admins(request):
    users = User.objects.all()
    admins = [
        user for user in users if user.profile.role == 'admin'
    ]
    serializer = UserSerializer(admins, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def dashboard_data(request):
    #total users count
    total_users = User.objects.all().count()
    #total regions count
    total_regions = Region.objects.all().count()
    #total weather data count
    total_weather_data = WeatherData.objects.all().count()

    return Response({
        'total_users': total_users,
        'total_regions': total_regions,
        'total_weather_data': total_weather_data
    })

@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)