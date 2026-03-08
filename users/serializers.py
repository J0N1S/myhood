from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'password', 'first_name', 'last_name', 
            'personal_number', 'city', 'street', 'district', 'address', 
            'building_number', 'apartment_number', 'phone_number', 'floor', 
            'role', 'residential_status', 'is_phone_verified', 'is_email_verified'
        )
        read_only_fields = ('role', 'is_phone_verified', 'is_email_verified')

class ResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'floor', 'apartment_number', 'residential_status', 'phone_number'
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            personal_number=validated_data['personal_number'],
            city=validated_data['city'],
            street=validated_data['street'],
            district=validated_data['district'],
            address=validated_data['address'],
            building_number=validated_data['building_number'],
            apartment_number=validated_data['apartment_number'],
            phone_number=validated_data['phone_number'],
            floor=validated_data.get('floor', ''),
            residential_status=validated_data.get('residential_status', 'OWNER')
        )
        return user
