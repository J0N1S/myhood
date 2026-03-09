from django.db import models
from django.conf import settings
from django.utils import timezone
import os

class Document(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'საერთო'),
        ('financial', 'ფინანსური'),
        ('rules', 'წესდება'),
        ('protocols', 'ოქმები'),
    ]

    title = models.CharField(max_length=255, verbose_name="სათაური")
    description = models.TextField(blank=True, null=True, verbose_name="აღწერა")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general', verbose_name="კატეგორია")
    recorded_date = models.DateField(default=timezone.now, verbose_name="თარიღი")
    is_private = models.BooleanField(default=False, verbose_name="პრივატული")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_documents')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-recorded_date', '-created_at']

class DocumentFile(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='documents/', verbose_name="ფაილი")
    original_name = models.CharField(max_length=255, verbose_name="ფაილის სახელი")

    def __str__(self):
        return self.original_name

    @property
    def file_extension(self):
        _, extension = os.path.splitext(self.file.name)
        return extension.lower().replace('.', '')

    @property
    def file_size(self):
        try:
            return self.file.size
        except (FileNotFoundError, OSError):
            return 0

