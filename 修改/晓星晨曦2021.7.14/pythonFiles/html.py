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


def test(request):
    return render(request, 'test.html')


def index(request):
    return render(request, "index.html")


def UploadFile(request):
    return render(request, "file_operation/UploadFile.html")


def DataSheet(request):
    return render(request, "file_charts/DataSheet.html")


def BarCharts(request):
    return render(request, "file_charts/BarCharts.html", {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


def LineCharts(request):
    return render(request, 'file_charts/LineCharts.html', {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


def AreaCharts(request):
    return render(request, "file_charts/AreaCharts.html", {
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


def PieCharts(request):
    return render(request, "file_charts/PieCharts.html",{
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })


def ScatterCharts(request):
    return render(request, "file_charts/ScatterCharts.html",{
        "ordata": json.dumps(orData),
        "xorData": json.dumps(xorData),
        "name": json.dumps(name),
        "xname": json.dumps(xname)
    })

#  测试
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
