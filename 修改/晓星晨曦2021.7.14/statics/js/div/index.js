var xmSelect = layui.xmSelect                                       //使用xm-select
var GetX_Data, GetX_ChooseItem, GetX_ParentValue, GetX_ParentName   //获取X轴数据，获取X轴选择项，获取X轴父级Value值，获取X轴父级Name
var GetY_ChooseItem = ""                                            //获取Y轴选择项
var GetResponseData = ""                                            //获取后端返回的数据
var YItemName = ['航段距离', '航节主舱位运力量', '旅客量', '主舱位是F和C的旅客量', '团队旅客量', '常旅客量', '每旅客分摊收入', 'Y舱基准价', '座公里', '客公里', '客座率']
var checkEmpty = true

window.onload = function (e) {
    $.ajax({
        url: '/statics/data/X_Location.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            GetX_Data = data['data']
            X_Location.update({
                data: data['data']
            })
        },
        error: function (data) {
            alert("出错了,原因:" + data)
        }
    })
}

var X_Location = xmSelect.render({
    el: '#X_Location',
    height: '200px',
    filterable: true,
    iconfont: {
        parent: 'hidden'
    },
    tree: {
        show: true,
        showFolderIcon: true,
        showLine: true,
        indent: 20,
        strict: true
    },
    toolbar: {
        show: true,
        list: ['CLEAR']
    },
    style: {
        width: '250px',
        margin: '5px'
    },
    data: [],
    on(data) {
        var arr = data.arr
        var isAdd = data.isAdd
        var change = data.change
        if (change)
            setTimeout(ChangeXShowText(arr.length), 1)
        //设置禁用
        if (isAdd && arr.length != 0) {
            var currData = change.slice(0, 1)
            var getParentValue, getParentName
            try {
                getParentValue = currData[0].__node.parent.__node.parent.value
                getParentName = currData[0].__node.parent.__node.parent.name
            } catch (e) {
                getParentValue = currData[0].__node.parent.value
                getParentName = currData[0].__node.parent.name
            }

            //获取所选项和父级的value
            GetX_ChooseItem = arr
            GetX_ParentValue = getParentValue
            GetX_ParentName = getParentName
            setTimeout(ChangeDisabled(getParentValue), 1)  //设置禁用事件
        } else if (arr.length == 0) {
            GetX_ChooseItem = ""
            GetX_ParentValue = ""
            GetX_ParentName = ""
            setTimeout(ChangeDisabled(0), 1)  //设置禁用事件
        }
    }
})

var Y_Location = xmSelect.render({
    el: '#Y_Location',
    filterable: true,
    style: {
        "width": "250px",
        "margin": "5px",
    },
    toolbar: {
        show: true,
    },
    data: [
        {name: '航段距离', value: 0},
        {name: '航节主舱位运力量', value: 1},
        {name: '旅客量', value: 2},
        {name: '主舱位是F和C的旅客量', value: 3},
        {name: '团队旅客量', value: 4},
        {name: '常旅客量', value: 5},
        {name: '每旅客分摊收入', value: 6},
        {name: 'Y舱基准价', value: 7},
        {name: '座公里', value: 8},    //航节主舱位运力量 * 航段距离 var seat_kil = GetResponseData[]['data'][18-23] * GetResponseData[]['data'][17]
        {name: '客公里', value: 9},   //旅客量 * 航段距离 var guess_kil = GetResponseData[]['data'][20] * GetResponseData[]['data'][17]
        {name: '客座率', value: 10},   //(客公里 / 座公里) var plf = seat_kil / guess_kil
    ],
    on: function (data) {
        var arr = data.arr
        var isAdd = data.isAdd
        var change = data.change

        if(isAdd){
            if (checkEmpty){
                checkDrawOne = true
                checkDrawTwo = true
                checkEmpty = false
                try {
                    let workbody = document.getElementById('WorkBody')
                    for (let i = 0; i < 44; i++)
                        workbody.removeChild(document.getElementById('charts'))
                } catch (e) {}
            }
        }

        if (change)
            setTimeout(ChangeYShowText(arr.length), 1)

        if (isAdd && arr.length != 0) {
            checkEmpty = false
            GetY_ChooseItem = arr
        } else {
            GetY_ChooseItem = ""
            checkDrawOne = true
            checkDrawTwo = true
            checkEmpty = false
            try {
                var workbody = document.getElementById('WorkBody')
                for (let i = 0; i < 44; i++)
                    workbody.removeChild(document.getElementById('charts'))
            } catch (e) {}
        }
    }
})

var checkDrawOne = true
var checkDrawTwo = true
var Ydatas = []
var datas = []
var XName = []
var value
var values=[]
var valueArray = [17, 19, 20, 21, 22, 23, 24, 25, 9, 10, 11]

//画图表
function drawCharts_Draw() {
    XName = []
    Ydatas = []
    datas = []
    for (let i = 0; i < GetResponseData.length; i++) {
        XName.push(GetResponseData[i].name)
        for (let j = 0; j < GetResponseData[i].data.length; j++) {
            Ydatas.push(GetResponseData[i].data[j])
        }
    }
    if (GetY_ChooseItem.length == 0) {//Y轴未选
        for (let i = 0; i < 11; i++) {
            var arrs = 'arr' + i
            arrs = new Array()
            value = valueArray[i]
            values.push(i)
            for (let j = 0; j < Ydatas.length; j++) {
                if (value == 9 || value == 10 || value == 11) {
                    //座公里
                    num1 = (Ydatas[j][18] + Ydatas[j][19] + Ydatas[j][20] + Ydatas[j][21] + Ydatas[j][22] + Ydatas[j][23]) * Ydatas[j][17]
                    //客公里
                    num2 = (Ydatas[j][20] + Ydatas[j][21] + Ydatas[j][22] + Ydatas[j][23]) * Ydatas[j][17]
                    if (value == 9) {
                        arrs.push(num1)
                    } else if (value == 10) {
                        arrs.push(num2)
                    } else {
                        //客座率
                        arrs.push((num2 / num1) * 100).toFixed(2)
                    }
                } else {
                    arrs.push(Ydatas[j][value])
                }
            }
            datas.push(arrs)
        }
        if (checkDrawOne) {
            drawCharts_createElement(11)
            drawCharts_one(11)
            checkDrawOne = false
        } else {
            drawCharts_createElement(11)
            drawCharts_one(11)
        }
    } else {
        for (let i = 0; i < GetY_ChooseItem.length; i++) {
            var arrs = 'arr' + i
            arrs = new Array()
            value = GetY_ChooseItem[i].value;
            values.push(value)
            for (let i = 0; i < Ydatas.length; i++) {
                //求客坐率,坐公里 ，客公里
                if (value == 8 || value == 9 || value == 10) {
                    //座公里
                    num1 = (Ydatas[i][18] + Ydatas[i][19] + Ydatas[i][20] + Ydatas[i][21] + Ydatas[i][22] + Ydatas[i][23]) * Ydatas[i][17]
                    //客公里
                    num2 = (Ydatas[i][20] + Ydatas[i][21] + Ydatas[i][22] + Ydatas[i][23]) * Ydatas[i][17]
                    if (value == 8) {
                        arrs.push(num1)
                    } else if (value == 9) {
                        arrs.push(num2)
                    } else {
                        //客座率
                        arrs.push((num2 / num1 * 100).toFixed(2))
                    }
                } else {
                    arrs.push(Ydatas[i][valueArray[value]])
                }
            }
            datas.push(arrs)
        }
        if (checkDrawTwo) {
            drawCharts_createElement(GetY_ChooseItem.length)
            drawCharts_one(GetY_ChooseItem.length)
            checkDrawTwo = false
        } else {
            drawCharts_createElement(GetY_ChooseItem.length)
            drawCharts_one(GetY_ChooseItem.length)
        }
    }
}

//画图表-获取数据
var allGetNum = 0 //计点击确定次数
function drawCharts_GetData() {
    var GetX_Length = X_Location.getValue().length
    var GetX_Data = X_Location.getValue()
    let PostData = []
    if (GetX_Length == 10 || GetX_Length == 20) {
        for (let i = 0; i < GetX_Length; i++) {
            PostData.push(GetX_Data[i].name)
        }
        var fromData = new FormData();
        fromData.append('Xvalue', GetX_ParentValue)
        fromData.append('Xdata', PostData)
        fromData.append('num', allGetNum)
        //获取数据
        $.ajax({
            url: "/drawCharts/",
            headers: {"X-CSRFtoken": $.cookie("csrftoken")},
            data: fromData,
            type: "Post",
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (result) {
                GetResponseData = result
                allGetNum++
                drawCharts_Draw()
            }, error: function () {
                layer.open({
                    title: '提示',
                    content: '出错了啦！请联系工作人员，嘿嘿'
                })
            }
        })
    } else {
        layer.open({
            'title': '提示',
            'content': 'X轴只能选10或20项！'
        })
    }
}

//动态创建标签
function drawCharts_createElement(length) {
    for (let i = 0; i < length; i++) {
        let value = 0
        try{
            value = GetY_ChooseItem[i].value
        }catch (e) {
            value = i
        }
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let label = document.createElement('label')

        let divCharts = document.createElement('div')
        let divChartsN_D = document.createElement('div')

        let WorkBody = document.getElementById('WorkBody')
        let checkElement = document.getElementById('charts' + i)
        if (checkElement){
            let label = document.getElementById('labelN_D' + i)
            if (value != 10)
                label.innerHTML = "总和:" + sum(datas[i]).toFixed(2) + "&emsp;&emsp;&emsp;平均值:" + average(datas[i]).toFixed(2) + "<br>最大值:" + (Math.max.apply(null, datas[i])).toFixed(2) + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, datas[i])).toFixed(2) + "<br>方差:" + varianceArr(datas[i]) + "<br>标准差:" + stdDeviation(datas[i])
            else
                label.innerHTML = "总和:" + sum(datas[i]).toFixed(2) + "%" + "&emsp;&emsp;&emsp;平均值:" + average(datas[i]).toFixed(2) + "%" + "<br>最大值:" + (Math.max.apply(null, datas[i])).toFixed(2) + "%" + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, datas[i])).toFixed(2) + "%" + "<br>方差:" + varianceArr(datas[i]) + "%" + "<br>标准差:" + stdDeviation(datas[i]) + "%"
            continue
        } else{
            divCharts.setAttribute('id', 'charts' + i)
            divCharts.setAttribute('style', 'width:700px;height:300px')

            divChartsN_D.setAttribute('id', 'N_D' + i)
            divChartsN_D.setAttribute('style', 'width:400px;height:200px;')
            label.setAttribute('id', 'labelN_D' + i)
            if (value != 10)
                label.innerHTML = "总和:" + sum(datas[i]).toFixed(2) + "&emsp;&emsp;&emsp;平均值:" + average(datas[i]).toFixed(2) + "<br>最大值:" + (Math.max.apply(null, datas[i])).toFixed(2) + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, datas[i])).toFixed(2) + "<br>方差:" + varianceArr(datas[i]) + "<br>标准差:" + stdDeviation(datas[i])
            else
                label.innerHTML = "总和:" + sum(datas[i]).toFixed(2) + "%" + "&emsp;&emsp;&emsp;平均值:" + average(datas[i]).toFixed(2) + "%" + "<br>最大值:" + (Math.max.apply(null, datas[i])).toFixed(2) + "%" + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, datas[i])).toFixed(2) + "%" + "<br>方差:" + varianceArr(datas[i]) + "%" + "<br>标准差:" + stdDeviation(datas[i]) + "%"
            div1.setAttribute('id', 'charts')
            div1.setAttribute('class', 'layui-inline')
            div1.append(divCharts)

            div2.setAttribute('id', 'charts')
            div2.setAttribute('class', 'layui-inline')
            div2.append(label)
            div2.append(divChartsN_D)

            WorkBody.append(div1)
            WorkBody.append(div2)
        }

    }
    $.ajax({
        url: "/indexApi/",
        type: "post",
        data: {
            "orData": datas,
            "xorData": XName,
            "name":values,
            "xname":[GetX_ParentName, GetX_ParentValue]
        },
        dataType: "json",
        traditional: true,
        success: function (data) {
        },
    })
}

//画正态分布
function drawCharts_drawN_D(i, data) {
    var N_DCharts = echarts.init(document.getElementById('N_D' + i))
    var calculate = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    calculate[1] = (average(data) - (3 * stdDeviation(data))).toFixed(2)
    calculate[2] = (average(data) - (2 * stdDeviation(data))).toFixed(2)
    calculate[3] = (average(data) - (1 * stdDeviation(data))).toFixed(2)
    calculate[4] = average(data).toFixed(2)
    calculate[5] = (average(data) + (1 * stdDeviation(data))).toFixed(2)
    calculate[6] = (average(data) + (2 * stdDeviation(data))).toFixed(2)
    calculate[7] = (average(data) + (3 * stdDeviation(data))).toFixed(2)
    var option = {
        title: {
            text: '正态分布'
        },
        toolbox:{
            show: true,
            feature: {
                dataView: {
                    title: '数据视图',
                    lang: ['数据视图', '退出', '刷新'],
                    readOnly: false
                },
                restore: {
                    title: '刷新'
                },
                saveAsImage: {
                    title: '导出'
                }
            }
        },
        tooltip: {
            formatter: function (params, ticket, callback) {
                var res = "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;'></span>" + params[0].name
                return res
            },
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        },
        legend: {show: false},
        calculable: true,
        xAxis: {
            name: 'X轴',
            type: 'category',
            data: calculate,
            boundaryGap: false,
            axisLabel: {
                fontSize: 8,
                rotate: 60
            }
        },
        yAxis: {
            name: 'Y轴',
            type: 'value',
            axisLine:{
                show: true
            },
            axisLabel: {
                show: true,
                formatter: '{value}'
            }
        },
        series: [
                {
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    areaStyle: {
                        type: 'default',
                        color: '#FF8000',
                    },
                    data: [0,3,19,46,60,46,19,3,0],
                },
            ]
        }
    N_DCharts.setOption(option)
}

//画第一步
function drawCharts_one(length) {
    for (let i = 0; i < length; i++) {
        try {
            if (GetY_ChooseItem[i].name != "客座率") {
                drawCharts_drawN_D(i, datas[i])
                drawCharts_two(XName, i, GetY_ChooseItem[i].value)
            } else {
                drawCharts_drawN_D(i, datas[i])
                drawCharts_two(XName, i, GetY_ChooseItem[i].value)
            }
        } catch (e) {
            if (length != 11){
                drawCharts_drawN_D(i, datas[i])
                drawCharts_two(XName, i, i)
            } else{
                drawCharts_drawN_D(i, datas[i])
                drawCharts_two(XName, i, i)
            }
        }
    }
}

//求数组总和
function sum(arr) {
    let sum = 0
    for (let i = 0;i < arr.length;i++){
        sum += Number(arr[i])
    }
    return sum
}

//求数组总和2
function sums(arr, ave) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += (Number(arr[i]) - ave) * (Number(arr[i]) - ave)
    }
    return sum
}

//数组平均值
function average(arr) {
    let ave = sum(arr) / arr.length;
    return ave
}

//求数组方差
function varianceArr(arr) {
    let s = 0,
        ave = average(arr),
        sum = sums(arr, ave);
    s = (sum / arr.length).toFixed(2);
    return s;
}

//求数组标准差
function stdDeviation(arr) {
    let sd = 0,
        ave = average(arr),
        sum = sums(arr, ave);
    sd = (Math.sqrt(sum / arr.length)).toFixed(2);
    return sd;
}

//改变X轴所选个数文字显示
function ChangeXShowText(num) {
    var XText = document.getElementById('XText')
    XText.innerText = "10或20项(已选" + num + "项)"
}

//改变Y轴所选个数文字显示
function ChangeYShowText(num) {
    var YText = document.getElementById('YText')
    if (num == 0)
        YText.innerText = "默认全选"
    else
        YText.innerText = "默认全选(已选" + num + "项)"
}

//设置禁用
function ChangeDisabled(value) {
    if (value != "0") {
        GetX_Data.forEach(item => {
            if (item.value != value) {
                X_Location.disable([item.value])
            }else {
                X_Location.enable([item.value])
            }
        })
    } else {
        // {#GetX_Data.forEach(item=>{ #}//现存BUG
        // {#    X_Location.enable([item.value])#}
        // {# })#}
        GetX_Data.forEach(item => {
            item.disabled = false
            item.children.forEach(item2 => {
                item2.disabled = false
                if (item2.children) {
                    item2.children.forEach(item3 => {
                        item3.disabled = false
                    })
                }
            })
        })
        X_Location.update({data: GetX_Data})
    }
}

//添加项
function addItem(data, id) {
    if(id == "X"){
        ChangeXShowText(data.length)
        X_Location.setValue(data)
    }else if(id == "Y"){
        if (data.length != 11){
            ChangeYShowText(data.length)
            Y_Location.setValue(data)
        }
    }
}

//清空所选
function cancel() {
    document.getElementById('XText').innerText = "10或20项(已选0项)"
    document.getElementById('YText').innerText = "默认全选"
    try {
        var workbody = document.getElementById('WorkBody')
        for (let i = 0; i < 44; i++)
            workbody.removeChild(document.getElementById('charts'))
    } catch (e) {
    }
    X_Location.setValue([])
    Y_Location.setValue([])
    allGetNum = 0
    checkEmpty = true
    ChangeDisabled(0)
}
