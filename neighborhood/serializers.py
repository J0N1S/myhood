from rest_framework import serializers
from .models import Activity, Comment, Participation

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_info = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'activity', 'author', 'author_name', 'author_info', 'text', 'created_at']
        read_only_fields = ['id', 'author', 'author_name', 'author_info', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"

    def get_author_info(self, obj):
        parts = []
        if obj.author.floor:
            parts.append(f"სართ. {obj.author.floor}")
        if obj.author.apartment_number:
            parts.append(f"ბინა {obj.author.apartment_number}")
        return ', '.join(parts)

class ParticipationSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Participation
        fields = ['id', 'activity', 'user', 'user_name', 'created_at']
        read_only_fields = ['id', 'activity', 'user', 'user_name', 'created_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

class ActivitySerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    participations_count = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id', 'title', 'description', 'type', 'created_by', 'creator_name',
            'created_at', 'end_date', 'comments', 'participations_count',
            'is_participating', 'is_active'
        ]
        read_only_fields = ['id', 'created_by', 'creator_name', 'created_at', 'comments', 'participations_count', 'is_participating', 'is_active']

    def get_creator_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"

    def get_participations_count(self, obj):
        return obj.participations.count()

    def get_is_participating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participations.filter(user=request.user).exists()
        return False
