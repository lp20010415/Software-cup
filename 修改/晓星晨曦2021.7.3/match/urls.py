"""match URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pythonFiles import html
from DataAction import Action

urlpatterns = [
    path('admin/', admin.site.urls),
    path('UploadFile/', html.UploadFile),
    path('DataSheet/', html.DataSheet),
    path('BarCharts/', html.BarCharts),
    path('LineCharts/', html.LineCharts),
    path('AreaCharts/', html.AreaCharts),
    path('PieCharts/', html.PieCharts),
    path('ScatterCharts/', html.ScatterCharts),
    path('index/', html.index),
    path('test/', html.GetData),
    path('test1/', html.test),
    path('GetData/', Action.getData),
    path('UploadFile/', Action.UploadFile),
    path('drawTable/', Action.drawTable),
    path('drawCharts/', Action.drawCharts),
    path('haha/', Action.haha),
]
