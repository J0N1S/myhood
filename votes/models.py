import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone

class Poll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_polls')
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    image = models.ImageField(upload_to='polls/images/', null=True, blank=True)
    document = models.FileField(upload_to='polls/documents/', null=True, blank=True)
    passing_percentage = models.PositiveIntegerField(default=50, help_text="მინიმალური მომხრეების პროცენტი (მაგ. 50 ან 60)")
    owners_only = models.BooleanField(default=False, verbose_name="მხოლოდ მფლობელები")
    budget = models.PositiveIntegerField(default=0, verbose_name="საჭირო ბიუჯეტი")

    @property
    def is_active(self):
        return timezone.now() < self.end_date

    @property
    def total_votes(self):
        return self.votes.count()

    @property
    def yes_votes(self):
        return self.votes.filter(choice='yes').count()

    @property
    def no_votes(self):
        return self.votes.filter(choice='no').count()

    @property
    def abstain_votes(self):
        return self.votes.filter(choice='abstain').count()

    @property
    def passed(self):
        if self.is_active:
            return None
        if self.total_votes == 0:
            return False
        yes_percent = (self.yes_votes / self.total_votes) * 100
        return yes_percent >= self.passing_percentage

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Vote(models.Model):
    CHOICES = (
        ('yes', 'კი'),
        ('no', 'არა'),
        ('abstain', 'თავი შევიკავე')
    )
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='votes')
    choice = models.CharField(max_length=20, choices=CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll', 'user')

    def __str__(self):
        return f"{self.user} voted {self.choice} on {self.poll.title}"
