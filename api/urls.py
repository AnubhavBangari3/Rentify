from django.urls import path,include

from .views import RegisterView,LoginAPI,LogoutAPI,ProfileView,PropertyListCreateView

from rest_framework.routers import DefaultRouter
router=DefaultRouter()
router.register("register",RegisterView,basename="register")

urlpatterns=[
    path("",include(router.urls)),
    path("login",LoginAPI.as_view(),name="login"),
    path("logout",LogoutAPI.as_view(),name="logout"),
    path("profile/",ProfileView.as_view(),name="profile"),
    path("property/",PropertyListCreateView.as_view(),name="property")

]