from rest_framework import serializers
from .models import Account, Survey, SurveyRes

class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'data', 'createAt', 'startAt', 'endAt', 'creator', 'isPerDay', 'allowedCount']

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['username', 'email', 'password']


class SurveyResSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyRes
        fields = ['id', 'data', 'submitedAt', 'survey', 'submitter']