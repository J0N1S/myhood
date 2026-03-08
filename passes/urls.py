from django.urls import path
from .views import (
    PassListCreateView, 
    ActivePassListView, 
    PassDetailView, 
    PassUpdateStatusView
)

urlpatterns = [
    path('', PassListCreateView.as_view(), name='pass-list-create'),
    path('active/', ActivePassListView.as_view(), name='pass-list-active'),
    path('<uuid:pk>/', PassDetailView.as_view(), name='pass-detail'),
    path('<uuid:pk>/status/', PassUpdateStatusView.as_view(), name='pass-update-status'),
]
