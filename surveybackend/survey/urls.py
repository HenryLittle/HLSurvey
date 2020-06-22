from django.urls import path
from survey import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('auth/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/registerAccount/', views.RegisterAccount.as_view()),
    path('survey/findSurveyByUserId/', views.FindSurveyByUserId.as_view()),
    path('survey/saveSurveyByUserId/', views.SaveSurveyByUserId.as_view()),
    path('survey/getSurveyById/', views.GetSurveyById.as_view()),
    path('survey/deleteSurveyById/', views.DeleteSurveyById.as_view()),
    path('survey/submitSurveyResult/', views.SubmitSurveyResult.as_view()),
    path('survey/getSurveyResById/', views.GetSurveyResById.as_view()),
    path('survey/updateSurveyLimitCount/', views.UpdateSurveyLimitCount.as_view()),
    path('survey/updateSurveyLimitMode/', views.UpdateSurveyLimitMode.as_view()),
    path('survey/updateSurveyTimeRange/', views.UpdateSurveyTimeRange.as_view()),
    
]