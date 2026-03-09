from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Activity, Comment, Participation
from .serializers import ActivitySerializer, CommentSerializer
from django.utils import timezone

class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        user = self.request.user
        # Only return activities that belong to the same building_number
        return Activity.objects.filter(
            created_by__building_number=user.building_number
        ).select_related('created_by').prefetch_related(
            'comments__author', 'participations'
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        activity = self.get_object()
        if activity.created_by != request.user:
            return Response({'detail': 'მხოლოდ ავტორს შეუძლია წაშლა.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        activity = self.get_object()
        if activity.created_by != request.user:
            return Response({'detail': 'მხოლოდ ავტორს შეუძლია რედაქტირება.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def participate(self, request, pk=None):
        activity = self.get_object()
        user = request.user

        if not activity.is_active:
            return Response({'detail': 'აქტივობა დასრულებულია.'}, status=status.HTTP_400_BAD_REQUEST)

        participation, created = Participation.objects.get_or_create(activity=activity, user=user)
        
        if not created:
            # If it already exists, clicking again means "unparticipate" (toggle)
            participation.delete()
            return Response({'status': 'unparticipated'}, status=status.HTTP_200_OK)
            
        return Response({'status': 'participated'}, status=status.HTTP_201_CREATED)

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(
            activity__created_by__building_number=user.building_number
        ).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.author != request.user:
            return Response({'detail': 'მხოლოდ ავტორს შეუძლია კომენტარის წაშლა.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
