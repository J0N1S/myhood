import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('REQUEST', 'მოთხოვნა'),
        ('ACTIVITY', 'აქტივობა')
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=ACTIVITY_TYPES, default='ACTIVITY')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='neighborhood_activities')
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()

    @property
    def is_active(self):
        return timezone.now() < self.end_date

    def __str__(self):
        return f"[{self.get_type_display()}] {self.title}"

    class Meta:
        ordering = ['-created_at']

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='neighborhood_comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.activity.title}"
        
    class Meta:
        ordering = ['created_at']

class Participation(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='participations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='neighborhood_participations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('activity', 'user')

    def __str__(self):
        return f"{self.user} is participating in {self.activity.title}"
