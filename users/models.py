from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', User.Role.CHAIRMAN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        CHAIRMAN = 'CHAIRMAN', 'თავმჯდომარე'
        RESIDENT = 'RESIDENT', 'მაცხოვრებელი'
        TEMPORARY = 'TEMPORARY', 'დროებითი'

    username = None # Remove the username field
    email = models.EmailField('email address', unique=True)

    # Required Info
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    personal_number = models.CharField(max_length=11, unique=True)
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=255)
    district = models.CharField(max_length=150)
    address = models.CharField(max_length=100)
    building_number = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20, unique=True)
    
    # Optional Address Info
    floor = models.CharField(max_length=10, blank=True, null=True)

    # Authority and Status
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RESIDENT,
    )
    
    # Verification Flags
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'personal_number', 'city', 'street', 'district', 'address', 'building_number', 'apartment_number', 'phone_number']

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
