# -*- coding: utf-8 -*-
import csv
import datetime
import json
import os
import random
import re

import xlrd
from django.db import connection
from django.http import HttpResponse
from xlrd import xldate_as_tuple

from match.settings import BASE_DIR


def haha(request):  # 用于测试数据
    if request.method == 'POST':
        ha = []
        cursor = connection.cursor()
        cursor.execute("SELECT aircrft_typ FROM sample_1k_flts GROUP BY aircrft_typ")
        row = cursor.fetchall()
        for i in row:
            hah = {
                "name": i[0],
                "value": i[0]
            }
            ha.append(hah)
        print(json.dumps(ha))
        return HttpResponse("测试")


# 获取数据
def getData(request):
    if request.method == 'POST':
        ResponseData = []
        getNum = random.randint(0, 950)
        cursor = connection.cursor()
        cursor.execute(f"select * from one_thousand_data limit 50 offset {getNum}")
        GetData = cursor.fetchall()
        for i in GetData:
            putData = []
            for j in i:
                putData.append(j)
            ResponseData.append(putData)
        return HttpResponse(json.dumps(ResponseData, ensure_ascii=False), content_type='application/json')


# 上传文件
def UploadFile(request):
    if request.method == 'POST':
        successFile = []
        getFiles = request.FILES.getlist('file')
        for f in getFiles:
            cursor = connection.cursor()
            fileURL = os.path.join(BASE_DIR, f.name)
            if f.name.split('.')[-1] == 'csv':  # 上传csv文件
                file = open(fileURL, 'wb+')
                for chunk in f.chunks():
                    file.write(chunk)
                file.close()
                file = open(fileURL)
                csv_reader = csv.reader(file)
                for i, row in enumerate(csv_reader):
                    getValues = ""
                    if i > 1:
                        for col in row:
                            getValues += f"'{col}'" + ','
                        getValues = getValues.rstrip(',')
                    cursor.execute(f'insert into uploaddata values({getValues})')
                file.close()
                successFile.append(f.name)
            elif f.name.split('.')[-1] == 'xlsx':  # 上传xlsx文件
                file = open(fileURL, 'wb+')
                for chunk in f.chunks():
                    file.write(chunk)
                file.close()
                wb = xlrd.open_workbook(f.name)
                sh = wb.sheet_by_name('Sheet1')
                # 解析数据-纠正格式
                for i in range(1, sh.nrows):
                    value = ""
                    for j in range(sh.ncols):
                        type = sh.cell(i, j).ctype
                        cell = sh.cell_value(i, j)
                        if type == 2 and cell % 1 == 0:
                            cell = int(cell)
                            value += f"'{cell}'" + ','
                        elif type == 3:
                            date = datetime.datetime(*xldate_as_tuple(cell, 0))
                            cell = date.strftime('%Y/%m/%d')
                            value += f"'{cell}'" + ','
                        else:
                            value += f"'{cell}'" + ','
                    value = value.rstrip(',')
                    cursor.execute(f'insert into uploaddata values({value})')
                successFile.append(f.name)
            os.remove(fileURL)
        return HttpResponse(json.dumps(successFile), content_type='application/json')


# 表格加载及重载
def drawTable(request):
    cursor = connection.cursor()
    cursor.execute('select count(*) from milion_data')
    count = cursor.fetchall()
    if request.method == "POST":
        cursor.execute('drop table temporary_table')
        order = request.POST.get('order')
        if(order == "1"):
            cursor.execute('create table temporary_table (like milion_data)')
            cursor.execute('select count(*) from milion_data')
            count = cursor.fetchall()[0][0]
            return HttpResponse(json.dumps(count), content_type='application/json')
        else:
            num = request.POST.get('num')
            cursor.execute('create table temporary_table (like milion_data)')
            cursor.execute(f'insert into temporary_table select * from milion_data limit 100 offset {num}')
            cursor.execute(f'select * from milion_data limit 100 offset {num}')
            row = cursor.fetchall()
            data = simplify(row)
            a = {
                'num': len(row),
                'data': data
            }
            return HttpResponse(json.dumps(a, ensure_ascii=False), content_type='application/json')
    elif request.method == 'GET':
        order = request.GET.get('order')
        page = request.GET.get('page')
        field = request.GET.get('field')
        data = []
        if order == "desc" or order == "asc":
            cursor.execute(f'insert into temporary_table select * from milion_data limit 100 offset {(int(page) - 1) * 100}')
            cursor.execute(f'select * from temporary_table order by {field} {order}')
            row = cursor.fetchall()
            data = simplify(row)
        elif re.match('search', order):
            if re.match('desc|asc', order.split('-')[-1]):
                print('来了')
                order = order.split('-')[-1]
                print(order)
                cursor.execute(f'select * from temporary_search_table order by {field} {order}')
                row = cursor.fetchall()
                data = simplify(row)
            else:
                content = request.GET.get('content')
                cursor.execute('drop table temporary_search_table')
                cursor.execute('create table temporary_search_table (like milion_data)')
                cursor.execute(f"insert into temporary_search_table select * from temporary_table where {field} like '%{content}%'")
                cursor.execute(f"select * from temporary_table where {field} like '%{content}%'")
                row = cursor.fetchall()
                data = simplify(row)
        else:
            cursor.execute(f'select * from milion_data limit 100 offset {(int(page) - 1) * 100}')
            row = cursor.fetchall()
            data = simplify(row)
        giveBack = {
            "code": 0,
            "msg": "",
            "count": count[0][0],
            "data": data
        }
        return HttpResponse(json.dumps(giveBack, ensure_ascii=False), content_type='application/json')


# 画图表
def drawCharts(request):
    Alldata = []
    Getdata = []
    if request.method == "POST":
        cursor = connection.cursor()
        post = request.POST
        Xvalue = post.get('Xvalue')
        Xdata = post.get('Xdata').split(',')
        print(f'Xvalue:{Xvalue}---Xdata:{Xdata}')
        if len(Xdata) == 10:
            for i, value in enumerate(Xdata):
                cursor.execute(f"select * from sample_1k_flts where {Xvalue} = '{value}' limit 6 offset {i * 6}")
                row = cursor.fetchall()
                for j in range(len(row)):
                    Getdata.append(list(row[j]))
            for i, v1 in enumerate(Getdata):
                print(v1)
                for j, v2 in enumerate(v1):
                    if v2 is None:
                        Getdata[i][j] = "0"
            for i in range(0, len(Getdata), 6):
                a = []
                a.append(Getdata[i])
                a.append(Getdata[i + 1])
                a.append(Getdata[i + 2])
                a.append(Getdata[i + 3])
                a.append(Getdata[i + 4])
                a.append(Getdata[i + 5])
                b = {
                    "name": Getdata[i][0],
                    "data": a
                }
                Alldata.append(b)
        elif len(Xdata) == 20:
            for i, value in enumerate(Xdata):
                cursor.execute(f"select * from sample_1k_flts where {Xvalue} = '{value}' limit 3 offset {i * 3}")
                row = cursor.fetchall()
                for j in range(len(row)):
                    Getdata.append(list(row[j]))
            for i, v1 in enumerate(Getdata):
                print(v1)
                for j, v2 in enumerate(v1):
                    if v2 is None:
                        Getdata[i][j] = "0"
            for i in range(0, len(Getdata), 6):
                a = []
                a.append(Getdata[i])
                a.append(Getdata[i + 1])
                a.append(Getdata[i + 2])
                a.append(Getdata[i + 3])
                a.append(Getdata[i + 4])
                a.append(Getdata[i + 5])
                b = {
                    "name": Getdata[i][0],
                    "data": a
                }
                Alldata.append(b)
    return HttpResponse(json.dumps(Alldata, ensure_ascii=False), content_type='application/json')


# 简化代码量
def simplify(row):
    data = []
    for i in row:
        push = {
            'day_id': i[0],
            'dpt_cty_cd': i[1],
            'arrv_cty_cd': i[2],
            'dpt_airpt_cd': i[3],
            'arrv_airpt_cd': i[4],
            'carr_cd': i[5],
            'flt_nbr': i[6],
            'cls_cd': i[7],
            'sub_cls_cd': i[8],
            'flt_rte_cd': i[9],
            'flt_seg_dpt_hh': i[10],
            'flt_seg_dpt_mm': i[11],
            'flt_seg_arrv_dt': i[12],
            'flt_seg_arrv_hh': i[13],
            'flt_seg_arrv_mm': i[14],
            'flt_seg_seq_nbr': i[15],
            'aircrft_typ': i[16],
            'flt_seg_dstnc': i[17],
            'leg_qty': i[18],
            'cls_cpc_qty': i[19],
            'pax_qty': i[20],
            'fc_pax_qty': i[21],
            'grp_pax_qty': i[22],
            'ffp_pax_qty': i[23],
            'net_amt': i[24],
            'y_fr_amt': i[25],
        }
        data.append(push)
    return data

