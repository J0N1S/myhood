import os
from rest_framework import serializers
from .models import Document, DocumentFile

class DocumentFileSerializer(serializers.ModelSerializer):
    file_extension = serializers.ReadOnlyField()
    file_size = serializers.ReadOnlyField()

    class Meta:
        model = DocumentFile
        fields = ['id', 'file', 'original_name', 'file_extension', 'file_size']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        if ret.get('file') and request:
            if not ret['file'].startswith('http'):
                ret['file'] = request.build_absolute_uri(ret['file'])
        return ret


class DocumentSerializer(serializers.ModelSerializer):
    files = DocumentFileSerializer(many=True, read_only=True)
    created_at_year = serializers.SerializerMethodField()
    recorded_date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"], required=False)
    creator_name = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'category', 'recorded_date', 'is_private', 'created_by', 'creator_name', 'created_at', 'created_at_year', 'files']
        read_only_fields = ['created_by', 'created_at', 'creator_name']

    def get_created_at_year(self, obj):
        return obj.recorded_date.year

    def get_creator_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip()
        return ""

