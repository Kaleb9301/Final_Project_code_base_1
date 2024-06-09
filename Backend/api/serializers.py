from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile,
    WeatherData,
    Region
)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }


class UserDetailFetcherSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'profile')
        extra_kwargs = {
            'username': {'read_only': True},
            'email': {'read_only': True},
            'first_name': {'read_only': True},
            'last_name': {'read_only': True},
        }
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'profile')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()

        UserProfile.objects.create(
            user=user,
            grand_father_name=profile_data['grand_father_name'],
            phone_number=profile_data['phone_number'],
            role=profile_data['role']
        )

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.save()

        profile.grand_father_name = profile_data.get('grand_father_name', profile.grand_father_name)
        profile.phone_number = profile_data.get('phone_number', profile.phone_number)
        profile.role = profile_data.get('role', profile.role)
        profile.save()

        return instance


class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'
        extra_kwargs = {
            'added_by': {'read_only': True}
        }

