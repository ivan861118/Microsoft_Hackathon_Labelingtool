from flask import Flask, render_template, redirect, url_for
from flask import request
from flask.views import View

import json
import glob
import settings

app = Flask(__name__)


class LabelView(View):
    methods=['GET', 'POST']
    

    def dispatch_request(self):
        if request.method == 'GET':
            context=self.get()
            # print(context)
            return render_template('index.html',context=context)
        elif request.method == 'POST':
            self.post()
            context={}
            return render_template('index.html',context=context)

    def get(self):
        images = self.read_images()
        datas = self.read_file()

        context={
            'datas':datas,
            'images': images
        }
        return context

    def post(self):
        context={}
        return context


    def read_file(self):
        json_array_name = glob.glob(settings.APP_STATIC+'/files/data_v2/output_json_tel/*.json')        
        datas = []

        for file_name in json_array_name:
            json_file = open(file_name)
            datas.append(json.load(json_file) )
        return datas
    
    def read_images(self):
        temp=[]
        images = glob.glob(settings.APP_STATIC+'/files/data_v2/output_img_tel/*.jpg')

        for i in range(len(images)):
            images[i] = images[i][-17:]
        return images

    
    
    

index_view = LabelView.as_view('index')
app.add_url_rule('/', methods=['GET','POST'],view_func=index_view)


    
    
    

