import random
from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, ResidentSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully. Now perform Login to get your token",
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ResidentsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ResidentSerializer

    def get_queryset(self):
        user = self.request.user
        qs = User.objects.filter(
            city=user.city,
            district=user.district,
            street=user.street,
            building_number=user.building_number
        ).order_by('apartment_number')
        return qs

class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        base_qs = User.objects.filter(
            city=user.city,
            district=user.district,
            street=user.street,
            building_number=user.building_number
        )
        total_residents = base_qs.filter(apartment_number__isnull=False).count()
        total_owners = base_qs.filter(residential_status='OWNER').count()
        
        return Response({
            'total_residents': total_residents,
            'total_owners': total_owners
        })

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')
        if not identifier:
            return Response({"error": "Identifier is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(Q(email=identifier) | Q(phone_number=identifier)).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(100000, 999999))
        cache_key = f"password_reset_otp_{identifier}"
        cache.set(cache_key, otp, timeout=300) # 5 minutes

        return Response({
            "message": "OTP generated successfully",
            "otp": otp # remove in production, used for dev display
        }, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if not all([identifier, otp, new_password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"password_reset_otp_{identifier}"
        saved_otp = cache.get(cache_key)

        if not saved_otp or saved_otp != otp:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(Q(email=identifier) | Q(phone_number=identifier)).first()
        if not user:
             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()
        cache.delete(cache_key)

        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
