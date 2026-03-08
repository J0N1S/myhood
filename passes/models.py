import uuid
from django.db import models
from django.conf import settings

class VisitorPass(models.Model):
    PASS_TYPES = (
        ('guest', 'სტუმარი'),
        ('courier', 'კურიერი'),
        ('taxi', 'ტაქსი'),
        ('service', 'სერვისი'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'მოლოდინში'),
        ('entered', 'შემოვიდა'),
        ('completed', 'დასრულებული'),
        ('cancelled', 'გაუქმებული'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='passes')
    pass_type = models.CharField(max_length=20, choices=PASS_TYPES)
    visitor_name = models.CharField(max_length=255)
    car_plate = models.CharField(max_length=20, blank=True)
    duration_days = models.IntegerField(null=True, blank=True)
    notify_on_arrival = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visitor_name} - {self.get_pass_type_display()} ({self.get_status_display()})"
    
    class Meta:
        ordering = ['-created_at']
