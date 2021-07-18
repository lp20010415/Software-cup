import json
import re

from django.db import connection
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse

from DataAction.Action import simplify
from match.settings import BASE_DIR

orData = []
xorData = []
name = []
xname = ""
checkGo = False
Gourl = ""

#   Api页面
def indexApi(request):
    global orData
    global xorData
    global name
    global xname
    orData = request.POST.getlist("orData")
    xorData = request.POST.getlist("xorData")
    name = request.POST.getlist("name")
    xname = request.POST.getlist("xname")
    return render(request, "file_charts/indexApi.html")


#   上传文件
def UploadFile(request):
    return render(request, "file_operation/UploadFile.html")


#   数据表
def DataSheet(request):
    return render(request, "file_charts/DataSheet.html")


#   跳转页面
def GoUrl(request):
    global checkGo
    global Gourl
    print(request.path)
    url = 'file_charts' + request.path.rstrip('/') + ".html"
    if request.method == 'POST':
        checkGo = True
        return render(request, url, dealPostData(False))
    elif checkGo:
        checkGo = False
        return render(request, url, dealPostData(True))
    checkGo = False
    return render(request, url, dealPostData(False))


#   处理传输数据
def dealPostData(check):
    data = {}
    if check:
        data = {
            "ordata": json.dumps(orData),
            "xorData": json.dumps(xorData),
            "name": json.dumps(name),
            "xname": json.dumps(xname)
        }
    else:
        data = {
            'ordata': json.dumps([]),
            'xorData': json.dumps([]),
            'name': json.dumps([]),
            'xname': json.dumps("")
        }
    return data


#  测试获取数据
def GetData(request):
    cursor = connection.cursor()
    cursor.execute('select count(*) from milion_data')
    count = cursor.fetchall()
    cursor.execute('select * from milion_data limit 50 offset 0')
    row = cursor.fetchall()
    data = simplify(row)
    giveBack = {
        "code": 0,
        "msg": "",
        "count": count[0][0],
        "data": data
    }
    return render(request, 'GetData.html', {'data': 'alert("哈")'})
    # return render(request, 'GetData.html', {'data': json.dumps(giveBack, ensure_ascii=False)})


#   测试默认页面
def index(request):
    return render(request, "index.html")



