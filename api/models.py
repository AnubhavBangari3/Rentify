from django.db import models
from django.contrib.auth.models import User
from .utils import get_random_code#For random code
from django.template.defaultfilters import slugify
from datetime import datetime

# Create your models here.

class Profile(models.Model):
    username=models.ForeignKey(User,on_delete=models.CASCADE,related_name="profile_users")
    first_name=models.CharField(max_length=200,null=True,blank=True)
    last_name=models.CharField(max_length=200,null=True,blank=True)
    email=models.EmailField(max_length=200,null=True,blank=True)
    phone_number = models.CharField(max_length=10, blank=True)
    is_seller = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=False)

    ##For unique
    slug=models.SlugField(unique=True,blank=True)
    
    access_token=models.CharField(max_length=265,blank=True)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now_add=True)
    #For dynamically creating unique slug if users have similar name
    def save(self,*args,**kwargs):
        b=False
        if self.first_name and self.last_name:
            to_slug=slugify(str(self.first_name)+""+str(self.last_name))
            b=Profile.objects.filter(slug=to_slug).exists()
            
            while b:
                to_slug=slugify(to_slug+""+str(get_random_code()))
                b=Profile.objects.filter(slug=to_slug).exists()
        else:
            to_slug=str(self.username)
        self.slug=to_slug
        super().save(*args,**kwargs)
    
    def __str__(self):
        return str(self.username.username)

class Properties(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    square_feet = models.IntegerField()
    posted_by = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="properties")
    image = models.ImageField(upload_to='property_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Interest(models.Model):
    property = models.ForeignKey(Properties, on_delete=models.CASCADE, related_name="interests")
    interested_by = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="interests")
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str.property

