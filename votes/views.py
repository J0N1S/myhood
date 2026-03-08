from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Poll, Vote
from .serializers import PollSerializer, VoteSerializer

class PollViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = PollSerializer
    queryset = Poll.objects.all().order_by('-created_at')

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        poll = self.get_object()
        
        if not poll.is_active:
            return Response({'detail': 'გამოკითხვა დასრულებულია'}, status=status.HTTP_400_BAD_REQUEST)

        if poll.owners_only and getattr(request.user, 'residential_status', None) != 'OWNER':
            return Response({'detail': 'ამ ინიციატივაზე ხმის მიცემა მხოლოდ მფლობელებს შეუძლიათ'}, status=status.HTTP_403_FORBIDDEN)

        choice = request.data.get('choice')
        if choice not in dict(Vote.CHOICES).keys():
            return Response({'detail': 'არასწორი არჩევანი'}, status=status.HTTP_400_BAD_REQUEST)

        # Update or create vote
        vote, created = Vote.objects.update_or_create(
            poll=poll,
            user=request.user,
            defaults={'choice': choice}
        )

        serializer = PollSerializer(poll, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
