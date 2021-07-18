import json

from django.db import connection
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse

from DataAction.Action import simplify
from match.settings import BASE_DIR

orData = []
xorData = []
name = []
xname=""


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


#   柱状图
def BarCharts(request):
    return render(request, "file_charts/BarCharts.html", {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


#   折线图
def LineCharts(request):
    return render(request, 'file_charts/LineCharts.html', {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


#   面积图
def AreaCharts(request):
    return render(request, "file_charts/AreaCharts.html", {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


#   饼图
def PieCharts(request):
    return render(request, "file_charts/PieCharts.html",{
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


#   散点图
def ScatterCharts(request):
    return render(request, "file_charts/ScatterCharts.html",{
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


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


#   测试页面
def test(request):
    return render(request, 'test.html')


#   测试默认页面
def index(request):
    return render(request, "index.html")
