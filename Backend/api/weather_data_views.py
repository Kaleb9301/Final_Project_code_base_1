from datetime import datetime
import os
from django.core.files.storage import default_storage

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from .models import WeatherData
from .serializers import WeatherDataSerializer
from .custom_permissons import IsAdminUser
from .process_csv import process_csv
from .t2 import get_predictions_and_spei


@api_view(['GET'])
def get_weather_data(request):
    paginator = PageNumberPagination()
    weather_data = WeatherData.objects.all()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(weather_data, request)
    serializer = WeatherDataSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_weather_data(request):
    serializer = WeatherDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_weather_data_by_id(request, pk):
    try:
        weather_data = WeatherData.objects.get(pk=pk)
    except WeatherData.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = WeatherDataSerializer(weather_data)
    return Response(serializer.data)



@api_view(['GET'])
def filter_by_date(request, date_str):
    try:
        start_, end_ = date_str.split('-')
        start_date = datetime.strptime(start_, '%Y%m%d').date()
        end_date = datetime.strptime(end_, '%Y%m%d').date()

        weather_data = WeatherData.objects.filter(date__range=[start_date, end_date])
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    serializer = WeatherDataSerializer(weather_data, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_weather_data(request, pk):
    try:
        weather_data = WeatherData.objects.get(pk=pk)
    except WeatherData.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = WeatherDataSerializer(weather_data, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_weather_data(request, pk):
    try:
        weather_data = WeatherData.objects.get(pk=pk)
    except WeatherData.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    weather_data.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request):
    file = request.data['file']
    file_name = file.name

    if not file_name.endswith('.csv'):
        return Response({"error": "Invalid file format"}, status=status.HTTP_400_BAD_REQUEST)

    temp_file_path = default_storage.save(f"temp/{file_name}", file)

    try:
        file_content = process_csv(temp_file_path)
        for data in file_content:
            data["region"] = 11
            serializer = WeatherDataSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    finally:
        default_storage.delete(temp_file_path)

    return Response({"message": "Data uploaded successfully"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_weather_prediction(request):
    start_date = request.query_params.get('sd')
    end_date = request.query_params.get('ed')
    region = request.query_params.get('region')
    predictions, avg = get_predictions_and_spei(start_date.replace("/", "-"), end_date.replace("/", "-"), region)[0], get_predictions_and_spei(start_date, end_date, region)[1]
    res = {}
    res["data"] = predictions
    res["avrage_spi"] = avg
    return Response(res, status=status.HTTP_200_OK)