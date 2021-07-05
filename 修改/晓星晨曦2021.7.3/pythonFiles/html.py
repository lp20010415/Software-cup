import json

from django.db import connection
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse

from DataAction.Action import simplify
from match.settings import BASE_DIR


def test(request):
    return render(request, 'test.html')


def index(request):
    return render(request, "index.html")


def UploadFile(request):
    return render(request, "file_operation/UploadFile.html")


def DataSheet(request):
    return render(request, "file_charts/DataSheet.html")


def BarCharts(request):
    return render(request, "file_charts/BarCharts.html")


def LineCharts(request):
    return render(request, "file_charts/LineCharts.html")


def AreaCharts(request):
    return render(request, "file_charts/AreaCharts.html")


def PieCharts(request):
    return render(request, "file_charts/PieCharts.html")


def ScatterCharts(request):
    return render(request, "file_charts/ScatterCharts.html")


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
