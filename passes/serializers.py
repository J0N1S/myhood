from rest_framework import serializers
from .models import VisitorPass

class VisitorPassSerializer(serializers.ModelSerializer):
    pass_type_display = serializers.CharField(source='get_pass_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = VisitorPass
        fields = [
            'id', 'pass_type', 'pass_type_display', 'visitor_name', 
            'car_plate', 'duration_days', 'notify_on_arrival', 
            'status', 'status_display', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def create(self, validated_data):
        # Set the owner from the user in the context (set by the view)
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
