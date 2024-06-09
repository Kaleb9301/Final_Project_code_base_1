from django.urls import path
from .auth_views import (
    register_user,
    get_all_admins,
    change_my_password,
    get_me,
    dashboard_data
)
from .regions_views import (
    get_region,
    get_regions,
    create_region,
    update_region,
    delete_region
)
from .weather_data_views import (
    get_weather_data,
    get_weather_data_by_id,
    filter_by_date,
    create_weather_data,
    update_weather_data,
    delete_weather_data,
    upload_csv
)
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView


urlpatterns = [
    path('auth/register/', register_user, name='register_user'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', UserDetailsView.as_view(), name='user_details'),
    path('auth/get_me/', get_me, name='get_me'),
    path('auth/change_password/', change_my_password, name='change_my_password'),
    path('auth/dashboard_data/', dashboard_data, name='dashboard_data'),
    path('auth/admins/', get_all_admins, name='get_all_admins'),

    # Regions
    path('regions/', get_regions, name='get_regions'),
    path('regions/create/', create_region, name='create_region'),
    path('regions/<int:pk>/', get_region, name='get_region'),
    path('regions/<int:pk>/update/', update_region, name='update_region'),
    path('regions/<int:pk>/delete/', delete_region, name='delete_region'),

    # Weather Data
    path('weather_data/', get_weather_data, name='get_weather_data'),
    path('weather_data/<int:pk>/', get_weather_data_by_id, name='get_weather_data_by_id'),
    path('weather_data/filter_by_date/<str:date_str>/', filter_by_date, name='filter_by_date'),
    path('weather_data/create/', create_weather_data, name='create_weather_data'),
    path('weather_data/<int:pk>/update/', update_weather_data, name='update_weather_data'),
    path('weather_data/<int:pk>/delete/', delete_weather_data, name='delete_weather_data'),
    path('weather_data/upload', upload_csv, name='upload_csv')
]