from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.auth import authenticate,login
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
# import bcrypt

from .models import Profile,Properties

class RegisterSerializer(serializers.ModelSerializer):
    username=serializers.CharField(write_only=True,required=True)
    email=serializers.EmailField(required=True,
                                 validators=[UniqueValidator(queryset=User.objects.all())])
    password=serializers.CharField(write_only=True,required=True,validators=[validate_password])
    password2=serializers.CharField(write_only=True,required=True)

    phone_number = serializers.CharField(write_only=True, required=True)  # Add phone_number field
    is_seller = serializers.BooleanField(default=False)  # Add is_seller field
    is_buyer = serializers.BooleanField(default=False)   # Add is_buyer field

    class Meta:
        model=User
        fields = ('username', 'email', 'first_name', 'last_name','password', 'password2','phone_number', 'is_seller', 'is_buyer',)
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    def validate(self,attribute):
        if attribute['password'] != attribute['password2']:
            raise serializers.ValidationError({"password":"Password fields didn't match"})
        return attribute
    def create(self,validated_data):
        print("validated_data:",validated_data)
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )        
        user.set_password(validated_data['password'])
        user.save()
        print("user s:",user)

        profile = Profile.objects.create(
            username=user,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone_number=validated_data['phone_number'],  # Set phone_number from validated_data
            is_seller=validated_data['is_seller'],  # Set is_seller from validated_data
            is_buyer=validated_data['is_buyer']  # Set is_buyer from validated_data
        )
        print("profile:",profile)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username=serializers.PrimaryKeyRelatedField(read_only=True)
    profile_name=serializers.SerializerMethodField("getName")

    class Meta:
        model=Profile
        fields=('id','username','first_name','last_name','email','slug','profile_name','phone_number','is_seller',
        'is_buyer',)

    def getName(self,instance):
        return instance.username.username


'''
Login Serializer start
'''

class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        # This will be used when the DRF browsable API is enabled
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            print("User login serializer:",user)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

'''
Login Serializer end
'''

class PropertiesSerializer(serializers.ModelSerializer):
    #posted_by=serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Properties
        fields = [
            'id',  # Including the ID field for completeness
            'title',
            'description',
            'price',
            'address',
            'city',
            'state',
            'zip_code',
            'bedrooms',
            'bathrooms',
            'square_feet',
            'posted_by',
            'created_at',
            'updated_at','image',
        ]
        read_only_fields = ['id', 'posted_by', 'created_at', 'updated_at']  # Fields that should not be modified directly