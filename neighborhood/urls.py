from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
