from django.shortcuts import render

from django.http import HttpResponse
from rest_framework.response import Response

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import serializers

from django.contrib.auth.models import User
from .models import Profile,Properties
from .serializers import RegisterSerializer,LoginSerializer,ProfileSerializer,PropertiesSerializer
from rest_framework import status
from django.contrib.auth import logout

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated

# Create your views here.



class RegisterView(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer

#Login 
class LoginAPI(APIView):
    serializer_class=LoginSerializer
    def post(self,request,format=None):
            serializer =LoginSerializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            password = serializer.validated_data['password']
            login(request, user)
            user=authenticate(user,password)
            print("user:",user)
            d={}
            
            if user:
                  t=RefreshToken.for_user(user)
                        
                  
                  d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
                  print(d)
                  return Response(d, status=status.HTTP_202_ACCEPTED)
            print(serializer.errors)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self,request):

            user = User.objects.get(username=self.request.user)
            serializer=LoginSerializer(user,many=False)
            t=RefreshToken.for_user(user)
            
            d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
            print(d)
            return Response(d, status=status.HTTP_202_ACCEPTED)

class LogoutAPI(APIView):
    permission_classes=(IsAuthenticated,)
    def post(self, request):    
        try:
            print("Inside log out")
            refresh_token = request.data["refresh_token"]
            print(request.user)
            #RefreshToken.for_user(user)
            token = RefreshToken.for_user(request.user)
            print("Token:",token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Inside log out except")
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      def get(self,request):
          print("checking:",request.user)
          profile=Profile.objects.get(username_id=request.user.id)
          serializer=ProfileSerializer(profile,many=False)
          return Response(serializer.data)

class PropertyListCreateView(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class=Properties

    def post(self, request, format=None):
        profile=Profile.objects.get(username_id=request.user.id)
        serializer = PropertiesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        profile = Profile.objects.get(username_id=request.user.id)
        properties = Properties.objects.filter(posted_by=profile)
        serializer = PropertiesSerializer(properties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)