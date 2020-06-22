from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.utils import timesince

from survey.models import Account, Survey, SurveyRes
from survey.serializers import SurveySerializer, AccountSerializer, SurveyResSerializer

from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

import time


class RegisterAccount(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            account = Account.objects.filter(email=request.data['email'])
            print(request.data['email'])
            if (len(account) == 0):
                Account.objects.create_user(**serializer.data)
                return HttpResponse(status=status.HTTP_200_OK)
            else:
                return HttpResponse('User existed', status=status.HTTP_403_FORBIDDEN)
        else:
            return HttpResponse('Invalid data', status=status.HTTP_400_BAD_REQUEST)

class FindSurveyByUserId(APIView):
    # permission_classes = (IsAuthenticated, )
    permission_classes = (AllowAny, )

    def get(self, request):
        userid = request.query_params['userid']
        surveys = Survey.objects.filter(creator_id=userid) 
        if surveys:
            serializer = SurveySerializer(surveys, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

class SaveSurveyByUserId(APIView):
    permission_classes = (IsAuthenticated, )
    # permission_classes = (AllowAny, )
    
    def post(self, request):
        # save the new survey to database
        userid = request.query_params['userid']
        survey = Survey(data=request.data, creator_id=userid)
        survey.save()
        return HttpResponse(status.HTTP_201_CREATED)


class GetSurveyById(APIView):
    permission_class = (AllowAny, )

    def get(self, request):
        surveyId = request.query_params['id']
        survey = Survey.objects.filter(id=surveyId)
        if survey:
            serializer = SurveySerializer(survey[0], many=False)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

class DeleteSurveyById(APIView):
    permission_classes = (IsAuthenticated, )
    # permission_classes = (AllowAny, )

    def post(self, request):
        userid = request.query_params['userid']
        surveyId = request.query_params['id']
        survey = Survey.objects.filter(id=surveyId)
        if survey:
            if userid == str(survey.creator.id):
                res = survey.delete()
                if len(res) == 1:
                    return HttpResponse(status.HTTP_200_OK)
        
        return HttpResponse('no survey found', status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitSurveyResult(APIView):

    permission_classes = (AllowAny, )

    def post(self, request):
        userid = request.query_params['userid']
        surveyId = request.query_params['id']
        submitedAt = time.time()
        if userid == '-1':
            res = SurveyRes(data=request.data, submitedAt=submitedAt, survey_id=surveyId, submitter_id=None)
            res.save()
        else:
            res = SurveyRes(data=request.data, submitedAt=submitedAt, survey_id=surveyId, submitter_id=userid)
            res.save()
        
        return HttpResponse(status=status.HTTP_201_CREATED)

class GetSurveyResById(APIView):
    permission_class = (IsAuthenticated, )
    # permission_classes = (AllowAny, )

    def get(self, request):
        surveyId = request.query_params['id']
        results = SurveyRes.objects.filter(survey_id=surveyId)
        if results:
            serializer = SurveyResSerializer(results, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)


class UpdateSurveyLimitCount(APIView):
    permission_class = (IsAuthenticated, )

    def get(self, request):
        surveyId = request.query_params['id']
        count = request.query_params['count']
        count = int(count)
        survey = Survey.objects.get(id=surveyId)
        survey.allowedCount = count
        survey.save()
        return HttpResponse(status=status.HTTP_200_OK)

class UpdateSurveyLimitMode(APIView):
    permission_class = (IsAuthenticated, )

    def get(self, request):
        surveyId = request.query_params['id']
        mode = request.query_params['isPerDay']
        survey = Survey.objects.get(id=surveyId)
        survey.isPerDay = mode
        survey.save()
        return HttpResponse(status=status.HTTP_200_OK)

class UpdateSurveyTimeRange(APIView):
    permission_class = (IsAuthenticated, )

    def get(self, request):
        surveyId = request.query_params['id']
        start = request.query_params['startAt']
        end = request.query_params['endAt']
        start = int(start)
        end = int(end)
        survey = Survey.objects.get(id=surveyId)
        survey.startAt = start
        survey.endAt = end
        survey.save()
        return HttpResponse(status=status.HTTP_200_OK)

