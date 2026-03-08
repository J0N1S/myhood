from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Poll, Vote

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'choice', 'created_at']
        read_only_fields = ['user', 'created_at']

class PollSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)
    total_votes = serializers.IntegerField(read_only=True)
    yes_votes = serializers.IntegerField(read_only=True)
    no_votes = serializers.IntegerField(read_only=True)
    abstain_votes = serializers.IntegerField(read_only=True)
    passed = serializers.BooleanField(read_only=True)
    user_vote = serializers.SerializerMethodField()
    duration = serializers.IntegerField(write_only=True, required=True, help_text="ხანგრძლივობა დღეებში")
    document = serializers.FileField(required=False, allow_null=True, use_url=True)
    image = serializers.ImageField(required=False, allow_null=True, use_url=True)

    class Meta:
        model = Poll
        fields = [
            'id', 'title', 'description', 'image', 'document', 'passing_percentage', 'owners_only', 'budget',
            'created_by', 'created_at', 'end_date', 'duration',
            'is_active', 'total_votes', 'yes_votes', 'no_votes', 'abstain_votes', 'passed', 'user_vote'
        ]
        read_only_fields = ['created_by', 'created_at', 'end_date']

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                vote = obj.votes.get(user=request.user)
                return vote.choice
            except Vote.DoesNotExist:
                pass
        return None

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        # Build absolute URLs for file fields
        if ret.get('document') and request:
            if not ret['document'].startswith('http'):
                ret['document'] = request.build_absolute_uri(ret['document'])
        if ret.get('image') and request:
            if not ret['image'].startswith('http'):
                ret['image'] = request.build_absolute_uri(ret['image'])
        return ret

    def create(self, validated_data):
        duration_days = validated_data.pop('duration')
        validated_data['end_date'] = timezone.now() + timedelta(days=duration_days)
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
