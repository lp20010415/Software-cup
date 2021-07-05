
    var xmSelect = layui.xmSelect                                       //使用xm-select
    var GetX_Data, GetX_ChooseItem, GetX_ParentValue, GetX_ParentName   //获取X轴数据，获取X轴选择项，获取X轴父级Value值，获取X轴父级Name
    var GetY_ChooseItem = ''                                            //获取Y轴选择项
    var GetResponseData = ""                                            //获取后端返回的数据
    var YItemName = ['航段距离', '航节主舱位运力量', '旅客量', '主舱位是F和C的旅客量', '团队旅客量', '常旅客量', '每旅客分摊收入', 'Y舱基准价', '座公里', '客公里', '客座率']

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
            strict: true,
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

            if (change)
                setTimeout(ChangeYShowText(arr.length), 1)

            if (isAdd && arr.length != 0) {
                GetY_ChooseItem = arr
            } else {
                GetY_ChooseItem = ""
                checkDrawOne = true
                checkDrawTwo = true
                try {
                    var workbody = document.getElementById('WorkBody')
                    for (let i = 0; i < 22; i++)
                        workbody.removeChild(document.getElementById('charts'))
                } catch (e) {
                }
            }
        }
    })

    //设置禁用
    function ChangeDisabled(value) {
        if (value != "0") {
            GetX_Data.forEach(item => {
                if (item.value != value) {
                    X_Location.disable([item.value])
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

    var checkDrawOne = true
    var checkDrawTwo = true
    var Ydatas = []
    var datas = []
    var value
    var valueArray = [17, 19, 20, 21, 22, 23, 24, 25, 9, 10, 11]

    //画图表
    function drawCharts_Draw() {
    console.log(GetResponseData)
        var XAllData = []
        var XName = []
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
                for (let j = 0; j < Ydatas.length; j++) {
                    if (value == 8 || value == 9 || value == 10) {
                        //座公里
                        num1 = (Ydatas[j][18] + Ydatas[j][19] + Ydatas[j][20] + Ydatas[j][21] + Ydatas[j][22] + Ydatas[j][23]) * Ydatas[j][17]
                        //客公里
                        num2 = (Ydatas[j][20] + Ydatas[j][21] + Ydatas[j][22] + Ydatas[j][23]) * Ydatas[j][17]
                        if (value == 8) {
                            arrs.push(num1)
                        } else if (value == 9) {
                            arrs.push(num2)
                        } else {
                            //客座率
                            arrs.push((num2 / num1 * 100).toFixed(3))
                        }
                    } else {
                        arrs.push(Ydatas[j][value])
                    }
                }
                datas.push(arrs)
            }
            if (checkDrawOne) {
                drawCharts_createElement(11)
                XAllData = drawCharts_Classify(GetResponseData.length)
                drawCharts_findMaxAndMin(XAllData)
                drawCharts_caculateVariacneAndS_D(XAllData)
                drawCharts_one(XName, XAllData, 11)
                checkDrawOne = false
            } else {
                XAllData = drawCharts_Classify(GetResponseData.length)
                drawCharts_findMaxAndMin(XAllData)
                drawCharts_caculateVariacneAndS_D(XAllData)
                drawCharts_one(XName, XAllData, 11)

            }
        } else {
            for (let i = 0; i < GetY_ChooseItem.length; i++) {
                var arrs = 'arr' + i
                arrs = new Array()
                value = GetY_ChooseItem[i].value;
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
                            arrs.push((num2 / num1 * 100).toFixed(3))
                        }
                    } else {
                        arrs.push(Ydatas[i][valueArray[value]])
                    }
                }
                datas.push(arrs)
            }
            if (checkDrawTwo) {
                drawCharts_createElement(GetY_ChooseItem.length)
                XAllData = drawCharts_Classify(GetResponseData.length)
                drawCharts_findMaxAndMin(XAllData)
                drawCharts_caculateVariacneAndS_D(XAllData)
                drawCharts_one(XName, XAllData, GetY_ChooseItem.length)
                checkDrawOne = false
            } else {
                XAllData = drawCharts_Classify(GetResponseData.length)
                drawCharts_findMaxAndMin(XAllData)
                drawCharts_caculateVariacneAndS_D(XAllData)
                drawCharts_one(XName, XAllData, GetY_ChooseItem.length)
            }
        }
    }

    //画图表-获取数据
    var allGetNum = 0
    var PostData = []
    function drawCharts_GetData() {
        var GetX_Length = X_Location.getValue().length
        var GetX_Data = X_Location.getValue()

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
            var div1 = document.createElement('div')
            var div2 = document.createElement('div')
            var label = document.createElement('label')

            var divCharts = document.createElement('div')
            var divChartsN_D = document.createElement('div')

            var WorkBody = document.getElementById('WorkBody')

            divCharts.setAttribute('id', 'charts' + i)
            divCharts.setAttribute('style', 'width:800px;height:300px')

            divChartsN_D.setAttribute('id', 'N_D' + i)
            divChartsN_D.setAttribute('style', 'width:300px;height:200px;')
            label.setAttribute('id', 'labelN_D' + i)
            label.innerHTML = "最大值:" + Math.max.apply(null, datas[i]) + "&emsp;&emsp;&emsp;最小值:" + Math.min.apply(null, datas[i])+"<br>方差:"+varianceArr(datas[i])+"&emsp;&emsp;&emsp;标准差:"+stdDeviation(datas[i])
            //'最大值:  最小值: 0<br>方差:66 &emsp;&emsp;标准差:77'
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

    //分配数据
    function drawCharts_Classify(length) {
        var XAllData = []
        for (let i = 0; i < GetResponseData.length; i++) {
            var XData = []
            var flt_seg_dstnc = []
            var leg_qty = []
            var cls_cpc_qty = []
            var pax_qty = []
            var fc_pax_qty = []
            var grp_pax_qty = []
            var ffp_pax_qty = []
            var net_amt = []
            var y_fr_amt = []
            var seat_kil = []
            var guess_kil = []
            var plf = []
            for (let j = 0; j < GetResponseData[i]['data'].length; j++) {
                flt_seg_dstnc.push(GetResponseData[i]['data'][j][17])
                leg_qty.push(GetResponseData[i]['data'][j][18])
                cls_cpc_qty.push(GetResponseData[i]['data'][j][19])
                pax_qty.push(GetResponseData[i]['data'][j][20])
                fc_pax_qty.push(GetResponseData[i]['data'][j][21])
                grp_pax_qty.push(GetResponseData[i]['data'][j][22])
                ffp_pax_qty.push(GetResponseData[i]['data'][j][23])
                net_amt.push(GetResponseData[i]['data'][j][24])
                y_fr_amt.push(GetResponseData[i]['data'][j][25])
            }
            for (let j = 0; j < 60 / GetResponseData.length; j++) {
                //坐公里
                var num1 = leg_qty[j] + cls_cpc_qty[j] + pax_qty[j] + fc_pax_qty[j] + grp_pax_qty[j] + ffp_pax_qty[j]
                var num2 = flt_seg_dstnc[j]
                var numOne = num1 * num2
                seat_kil.push(numOne)
                //客公里
                var num3 = pax_qty[j] + fc_pax_qty[j] + grp_pax_qty[j] + ffp_pax_qty[j]
                var num4 = flt_seg_dstnc[j]
                var numTwo = num3 * num4
                guess_kil.push(numTwo)
                //客座率
                plf.push((numTwo / numOne * 100).toFixed(3))

            }
            XData.push(flt_seg_dstnc)
            XData.push(cls_cpc_qty)
            XData.push(pax_qty)
            XData.push(fc_pax_qty)
            XData.push(grp_pax_qty)
            XData.push(ffp_pax_qty)
            XData.push(net_amt)
            XData.push(y_fr_amt)
            XData.push(seat_kil)
            XData.push(guess_kil)
            XData.push(plf)
            XAllData.push(XData)
        }
        return XAllData
    }

    //画第一步
    function drawCharts_one(XName, XAllData, length) {
        for (let i = 0; i < length; i++) {
            try {
                if (GetY_ChooseItem[i].name != "客座率") {
                    drawCharts_two(XName, XAllData, i, GetY_ChooseItem[i].value)
                } else {
                    drawCharts_two(XName, XAllData, i, GetY_ChooseItem[i].value)
                }
            } catch (e) {
                if (length != 11)
                    drawCharts_two(XName, XAllData, i, i)
                else
                    drawCharts_two(XName, XAllData, i, i)
            }
        }
    }

    //求数组标准差
    function stdDeviation(arr) {
        let sd,
            ave,
            sum = 0,
            sums = 0,
            len = arr.length;
        for (let i = 0; i < len; i++) {
            sum += Number(arr[i]);
        }
        ave = sum / len;
        for (let i = 0; i < len; i++) {
            sums += (Number(arr[i]) - ave) * (Number(arr[i]) - ave)
        }
        sd = (Math.sqrt(sums / len)).toFixed(2);
        return sd;
    };

    //求数组方差
    function varianceArr(arr) {
        let s,
            ave,
            sum = 0,
            sums = 0,
            len = arr.length;
        for (let i = 0; i < len; i++) {
            sum += Number(arr[i]);
        }
        ave = sum / len;
        for (let i = 0; i < len; i++) {
            sums += (Number(arr[i]) - ave) * (Number(arr[i]) - ave)
        }
        s = (sums / len).toFixed(2);
        return s;
    };


    var XDataMax
    var XDataMin

    //找最大值和最小值
    function drawCharts_findMaxAndMin(XAllData) {
        XDataMax = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        XDataMin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < XAllData[0].length; i++) {
            XDataMin[i] = XAllData[0][i][0]
        }
        for (let i = 0; i < XAllData.length; i++) {
            for (let j = 0; j < XAllData[i].length; j++) {
                for (let k = 0; k < XAllData[i][j].length; k++) {
                    if (parseInt(XAllData[i][j][k]) > XDataMax[j]) {
                        XDataMax[j] = XAllData[i][j][k]
                    }
                    if (parseInt(XAllData[i][j][k]) < XDataMin[j]) {
                        XDataMin[j] = XAllData[i][j][k]
                    }
                }
            }
        }
       // console.log(XDataMax + "----" + XDataMin)
    }

    var variance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var s_d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    //计算方差和标准差
    function drawCharts_caculateVariacneAndS_D(XAllData) {
        var sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var sumT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var average = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < XAllData.length; i++) {
            for (let j = 0; j < XAllData[i].length; j++) {
                XAllData[i][j].forEach(k => {
                    sum[j] += parseFloat(k)
                })
            }
        }
        for (let i = 0; i < sum.length; i++) {
            average[i] = (sum[i] / 60).toFixed(2)
        }
        for (let i = 0; i < XAllData.length; i++) {
            for (let j = 0; j < XAllData[i].length; j++) {
                XAllData[i][j].forEach(k => {
                    sumT[j] += parseInt(Math.pow(k - average[j], 2))
                })
            }
        }
        for (let i = 0; i < sumT.length; i++) {
            variance[i] = (sumT[i] / 60).toFixed(2)
        }
        for (let i = 0; i < variance.length; i++) {
            s_d[i] = (Math.sqrt(variance[i])).toFixed(2)
        }
        //console.log("方差约为:" + variance + "标准差约为" + s_d)
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

    //清空所选
    function cancel() {
        document.getElementById('XText').innerText = "10或20项(已选0项)"
        document.getElementById('YText').innerText = "默认全选"
        try {
            var workbody = document.getElementById('WorkBody')
            for (let i = 0; i < 22; i++)
                workbody.removeChild(document.getElementById('charts'))
        } catch (e) {
        }
        X_Location.setValue([])
        Y_Location.setValue([])
        allGetNum = 0
        ChangeDisabled(0)
    }
