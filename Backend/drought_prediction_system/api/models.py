from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    role_choices = (
        ('admin', 'Admin'),
        ('institutional', 'Institutional'),
        ('regular', 'Regular'),
    )


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    grand_father_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=13)
    role = models.CharField(max_length=20, choices=role_choices)

    def __str__(self):
        return self.user.username
    

class Region(models.Model):
    region_name = models.CharField(max_length=100)
    station = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.region_name
    
    def to_json(self):
        """"""
        return {
            "region_name": self.region_name,
            "station": self.station,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "added_by": self.added_by
        }
    

class WeatherData(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    date = models.DateField()
    min_temprature = models.FloatField()
    max_temprature = models.FloatField()
    rain = models.FloatField()
    relative_humidity_1 = models.FloatField()
    relative_humidity_2 = models.FloatField()
    wind = models.FloatField()
    evaporation = models.FloatField()
    radiation = models.FloatField()
    cumilative_rain = models.FloatField()

    def __str__(self):
        return self.region.region_name
    
    def to_json(self):
        return {
            "region": self.region,
            "date": self.date,
            "min_temprature": self.min_temprature,
            "max_temprature": self.max_temprature,
            "rain": self.rain,
            "rh1": self.relative_humidity_1,
            "rh2": self.relative_humidity_2,
            "wind": self.wind,
            "evaporation": self.evaporation,
            "radiation": self.radiation,
            "cum_rain": self.cumilative_rain
        }
    

class PredictedData(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    date = models.DateField() # 0 
    min_temprature = models.FloatField()
    max_temprature = models.FloatField()
    rain = models.FloatField()
    relative_humidity_1 = models.FloatField()
    relative_humidity_2 = models.FloatField()
    wind = models.FloatField()
    evaporation = models.FloatField()
    radiation = models.FloatField()
    SPI_index = models.FloatField()


    def __str__(self):
        return self.region.region_name
    

class File(models.Model):
    file_name = models.CharField(max_length=100)
    url = models.URLField()
    file_type = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.file_name
