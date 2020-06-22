from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import AbstractUser, BaseUserManager
# use the following command to check sql script for migration
# python manage.py sqlmigrate survey 0001

class UserManager(BaseUserManager):
    def create_user(self, email, username, password, alias=None):
        user = self.model(
        email = self.normalize_email(email),
                username = username,)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_staff()
        user.is_superuser = True
        user.save()
        return user

class Account(AbstractUser):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username

class Survey(models.Model):
    data = JSONField()
    createAt = models.DateTimeField(auto_now=True)
    startAt = models.BigIntegerField(default=0)
    endAt = models.BigIntegerField(default=0)

    isPerDay = models.BooleanField(default=False)
    allowedCount = models.IntegerField(default=0)
    # delete the survey when the user is deleted
    creator = models.ForeignKey('Account', on_delete=models.CASCADE)

class SurveyRes(models.Model):
    data = JSONField()
    submitedAt = models.BigIntegerField(default=0)
    survey = models.ForeignKey('Survey', on_delete=models.CASCADE, null=True)
    submitter = models.ForeignKey('Account', on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return str(self.data)
    