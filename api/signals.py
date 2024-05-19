from django.contrib.auth.models import User
from .models import Profile
from django.db.models.signals import post_save
from django.dispatch import receiver


# @receiver(post_save,sender=User)
# def create_profile(sender,instance,created,**kwargs):
#     print("Signals instance:",instance)
#     current=User.objects.get(username=instance)
#     print("current:",current)
#     if created:
#         print("Signals instance i:",instance)
#         profile = Profile.objects.create(
#             username=instance,
#             first_name=instance.first_name,
#             last_name=instance.last_name,
#             email=instance.email,
#         )
#         # Now you can set additional fields on the Profile instance
#         profile.phone_number = instance.phone_number
#         profile.is_seller = instance.is_seller
#         profile.is_buyer = instance.is_buyer
#         print("profile:",profile)
#         profile.save()