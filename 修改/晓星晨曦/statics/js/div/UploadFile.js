
document.write("<script language='JavaScript' src='/statics/js/jquery-3.6.0.min.js/'></script>")
document.write("<script language='JavaScript' src='/statics/js/jquery.cookie.js'></script>")

    window.onload = function(e){
        changeTextSize()
    }

    var element = layui.element;
    var checkUpload = false
    var GetFiles,successFile //获取文件
    var dropbox = document.getElementById('dropbox')        //上传框
    var showText = document.getElementById('showText')      //上传框内文字
    var UploadBtn = document.getElementById('UploadBtn')    //上传按钮
    var CancelBtn = document.getElementById('UploadCancel') //取消按钮
    var HandFile = document.getElementById('HandFile')      //手动上传
    var UploadProgress = document.getElementById('UploadProgress')  //上传进度条

    //单击上传
    dropbox.onclick = function(e){
        e.preventDefault()
        e.stopPropagation()
        HandFile.click()
    }

    // 拖拽上传
    dropbox.ondragenter = function (e) {
        e.preventDefault()
        UploadBtn.className = 'layui-btn layui-btn-lg layui-btn-normal layui-btn-disabled'
        dropbox.style.borderColor = 'rgba(0,0,0,0.3)'
        dropbox.style.background = 'rgba(102,204,255,0.5)'
        showText.style.color = 'rgba(0,0,0,0.3)'
        showText.innerText = '松开鼠标准备上传'
    }

    dropbox.ondragover = function(e){
        e.preventDefault()
    }

    dropbox.ondragleave = function (e) {
        e.preventDefault()
        UploadBtn.className = 'layui-btn layui-btn-lg layui-btn-normal layui-btn-disabled'
        dropbox.style.borderColor = 'rgba(0,0,0,1)'
        dropbox.style.background = 'rgba(102,204,255,1)'
        showText.style.color = 'rgba(0,0,0,1)'
        showText.innerText = '拖文件到此或单击此处准备上传文件(支持csv/xlsx文件)\n支持多文件上传，但只会上传格式正确的文件格式'
        changeTextSize()
    }

    dropbox.ondrop = function (e) {
        e.stopPropagation()
        e.preventDefault()
        dropbox.style.borderColor = 'rgba(0,0,0,1)'
        dropbox.style.background = 'rgba(102,204,255,1)'
        showText.style.color = 'rgba(0,0,0,1)'
        GetFiles = e.dataTransfer.files
        showText.innerText = '当前上传的文件有:'
        for(let i = 0;i < GetFiles.length;i++){
            showText.innerText += GetFiles[i].name.split('.')[0] + ',';
        }
        console.log(showText.innerText.length)
        if(showText.innerText.length > 90){
            showText.innerText = showText.innerText.substring(0, 90) + '....'
        }
        showText.innerText += '\n单击上传按钮开始上传'
        changeTextSize()
        UploadBtn.className = 'layui-btn layui-btn-lg layui-btn-normal'
        console.log(e.dataTransfer.files)
    }

    //改变文本位置
    function changeTextSize() {
        var uploadtext = document.getElementById('UploadText')
        var uploadprogress = document.getElementById('UploadProgress')
        if(uploadtext.className != "layui-hide"){
            let margintop = (285 - uploadtext.offsetHeight) / 2 + 'px'
            uploadtext.style.marginTop = margintop
        }else {
            let marginOne = (285 - uploadprogress.offsetHeight) / 2 + 'px' + ' '
            let marginTwo = (1289 - uploadprogress.offsetWidth) / 2 + 'px'
            uploadprogress.style.margin = marginOne + marginTwo
        }
    }

    //手动上传
    HandFile.onchange = function (e) {
        if(e.target.value){
            GetFiles = HandFile.files
            showText.innerText = '当前上传的文件有:'
            for(let i = 0;i < GetFiles.length;i++){
                showText.innerText += GetFiles[i].name.split('.')[0] + ',';
             }
            console.log(showText.innerText.length)
            if(showText.innerText.length > 90){
                showText.innerText = showText.innerText.substring(0, 90) + '....'
             }
            showText.innerText += '\n单击上传按钮开始上传'
            changeTextSize()
            UploadBtn.className = 'layui-btn layui-btn-lg layui-btn-normal'
        }else{
            UploadBtn.className = 'layui-btn layui-btn-lg layui-btn-normal layui-btn-disabled'
            dropbox.style.borderColor = 'rgba(0,0,0,1)'
            dropbox.style.background = 'rgba(102,204,255,1)'
            showText.style.color = 'rgba(0,0,0,1)'
            showText.innerText = '拖文件到此或单击此处准备上传文件(支持csv/xlsx文件)\n支持多文件上传，但只会上传格式正确的文件格式'
            changeTextSize()
        }
    }

    //上传按钮
    UploadBtn.onclick = function () {
        document.getElementById('UploadText').className = 'layui-hide'
        UploadProgress.className = ''
        changeTextSize()
        var formFile = new FormData();
        for(let i = 0;i < GetFiles.length;i++){
            formFile.append("file", GetFiles[i])
        }
        console.log(formFile.get('file'))
        $.ajax({
            url: "/Upload/",
            headers: {"X-CSRFtoken": $.cookie("csrftoken")},
            data: formFile,
            type: "Post",
            dataType: "json",
            processData: false,
            contentType: false,
            xhr: xhrOnProgress(function (e) {
                var percent = e.loaded / e.total;
                element.progress('Uploading', percent * 90 + '%')
            }),success: function (result) {
                element.progress('Uploading', '100%')
                successFile = result
                setTimeout('UploadComplete()', '2000')
            }
        })
        checkUpload = true
    }

    //取消按钮
    CancelBtn.onclick = function () {
        window.location.href = ''
    }

    //进度条事件
    var xhrOnProgress=function(fun) {
      xhrOnProgress.onprogress = fun; //绑定监听
      //使用闭包实现监听绑
      return function() {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        var xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function')
          return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
          xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
      }
    }

    //上传完成
    var UploadComplete = function (e) {
        element.progress('Uploading', '0%')
        UploadProgress.className = 'layui-hide'
        var uploadtext = document.getElementById('UploadText')
        var file = ""
        for(let i = 0;i < successFile.length;i++){
            file += successFile[i].split('.')[0] + ','
        }
        file = file.substring(0, file.length - 1)
        showText.innerText = '上\t传\t完\t成，成功文件如下:\n' + file
        uploadtext.className = ""
        changeTextSize()
    }