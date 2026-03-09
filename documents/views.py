from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from .models import Document, DocumentFile
from .serializers import DocumentSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = DocumentSerializer

    def get_queryset(self):
        from django.db.models import Q
        user = self.request.user
        
        # Show only documents from the same building that are public OR created by the requester
        queryset = Document.objects.filter(
            Q(created_by__building_number=user.building_number),
            Q(is_private=False) | Q(created_by=user)
        ).select_related('created_by').prefetch_related(
            'files'
        ).order_by('-recorded_date', '-created_at')
        
        category = self.request.query_params.get('category', None)
        year = self.request.query_params.get('year', None)
        
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if year and year != 'all':
            queryset = queryset.filter(recorded_date__year=year)
            
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the master document Document
        document = serializer.save(created_by=request.user)

        # Process multiple files
        files = request.FILES.getlist('files')
        for file in files:
            DocumentFile.objects.create(
                document=document,
                file=file,
                original_name=file.name
            )

        headers = self.get_success_headers(serializer.data)
        # Re-fetch or re-serialize to include files
        response_serializer = self.get_serializer(document)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        document = self.get_object()
        if document.created_by != request.user:
            return Response({'detail': 'მხოლოდ შემქმნელს შეუძლია წაშლა'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

