from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
# models
# from .models import Questionnaire, ChoiceQuestion, Choice
# views
from django.views.generic import View
# forms
# from .forms import QuestionnaireForm, ChoiceQuestionForm, ChoiceFormset

# For email
from django.conf import settings
import os
import glob
from os import path
# from django.conf.settings import PROJECT_ROOT


# from settings import STATICFILES_DIRS
import json
from django.http import HttpResponse

class LabelView(View):

    def get(self, request):
        ## Todo

        images = self.read_images()

        datas = self.read_file()
        print(images)
       
        # print(json.dumps(datas))
        context={
            'datas':json.dumps(datas),
            'images': images
        }

        return render(request, 'labeling/index.html', context)
    
    def read_file(self):
        # json_data = open(os.path.join(settings.PROJECT_ROOT, 'data_v2/output_json_tel/*.json'))
        import glob
        
        json_array_name = glob.glob(os.path.join(settings.PROJECT_ROOT, 'data_v2/output_json_tel/*.json'))
        
        datas = []

        for file_name in json_array_name:
            json_file = open(file_name)
            # print(json_data)
            datas.append(json.load(json_file) )
        
        return datas
    
    def read_images(self):

        temp=[]

        # pattern = settings.PROJECT_ROOT+'/data_v2/output_img_tel/*.jpg'
        # images = [path.basename(x) for x in glob(pattern)]

        images = glob.glob(settings.PROJECT_ROOT+'/data_v2/output_img_tel/*.jpg')

        for i in range(len(images)):
            images[i] = images[i][-17:]
        
        # json_data = open(os.path.join(settings.PROJECT_ROOT, 'data_v2/output_img_tel/*.jpg'))

        return images

    
    def post(self, request):
        text = request.POST['text']
        print(request.POST)
        
        
        return HttpResponse('')
        




