from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import VisitorPass
from .serializers import VisitorPassSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PassListCreateView(generics.ListCreateAPIView):
    serializer_class = VisitorPassSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Users can only see their own passes
        return VisitorPass.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ActivePassListView(generics.ListAPIView):
    serializer_class = VisitorPassSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Only pending or entered passes
        return VisitorPass.objects.filter(
            owner=self.request.user, 
            status__in=['pending', 'entered']
        )

class PassDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VisitorPassSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return VisitorPass.objects.filter(owner=self.request.user)

class PassUpdateStatusView(generics.UpdateAPIView):
    serializer_class = VisitorPassSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return VisitorPass.objects.filter(owner=self.request.user)
        
    def patch(self, request, *args, **kwargs):
        pass_instance = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = [choice[0] for choice in VisitorPass.STATUS_CHOICES]
        
        if new_status not in valid_statuses:
            return Response({"error": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)
            
        pass_instance.status = new_status
        pass_instance.save()
        
        serializer = self.get_serializer(pass_instance)
        return Response(serializer.data)
