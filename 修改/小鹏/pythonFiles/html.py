from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def UploadFile(request):
    return render(request, "file_operation/UploadFile.html")


def TableChoose(request):
    return render(request, "file_operation/TableChoose.html")
