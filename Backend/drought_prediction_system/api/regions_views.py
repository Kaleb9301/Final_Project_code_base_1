from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Region
from .serializers import RegionSerializer
from .custom_permissons import IsAdminUser

@api_view(['GET'])
def get_regions(request):
    regions = Region.objects.all()
    serializer = RegionSerializer(regions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_region(request):
    serializer = RegionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(added_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_region(request, pk):
    try:
        region = Region.objects.get(pk=pk)
    except Region.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = RegionSerializer(region)
    return Response(serializer.data)

@api_view(['PUT'])
def update_region(request, pk):
    try:
        region = Region.objects.get(pk=pk)
    except Region.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = RegionSerializer(region, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_region(request, pk):
    try:
        region = Region.objects.get(pk=pk)
    except Region.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    region.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
