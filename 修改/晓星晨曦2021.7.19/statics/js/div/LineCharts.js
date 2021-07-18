    for (let i = 0; i < ord.length; i++) {
        let arrs = 'arr' + i
        arrs = []
        arrs = ord[i].split(",")
        arrayObj.push(arrs)
    }
    if (ord.length !== 0) {
        layer.open({
            content: '您是否需要将原有数据，进行绘图？',
            btn: ['确定', '取消'],
            yes: function (index) {
                LineDrawCharts_createElement()
                for (let i = 0; i < arrayObj.length; i++) {
                    createrLineCharts(i)
                    drawCharts_drawN_D(i, arrayObj[i])
                }
                ChangeDisabled(xname[1])// 设置禁用
                if (xname[1] === "day_id"){
                    for (let i = 0;i < xord.length;i++){
                        xord[i] = "c" + xord[i]
                    }
                }else if(xname[1] === "flt_seg_arrv_dt"){
                    for (let i = 0;i < xord.length;i++){
                        xord[i] = "d" + xord[i]
                    }
                }
                addItem(xord, "X")// 添加项
                addItem(yname, "Y")// 添加项
                layer.close(index);
            },btn2: function (index) {
                ord = ""
                xord = ""
                name = ""
                xname = ""
                layer.close(index)
            }
        })
    }

    function createrLineCharts(i) {
        let formatterY = '{value}'
        let seriess = []
        if (xord.length === 10){
             for (let k = 0; k < arrayObj[i].length / 10; k++) {
                seriess.push(
                    {
                        name: YItemName[yname[i]],
                        type: 'line',
                        stack: 'all',
                        data: [arrayObj[i][k], arrayObj[i][6 + k], arrayObj[i][12 + k], arrayObj[i][18 + k], arrayObj[i][24 + k], arrayObj[i][30 + k], arrayObj[i][36 + k], arrayObj[i][42 + k], arrayObj[i][48 + k], arrayObj[i][54 + k]],
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                            },
                        },
                    },
                )
            }
        }else if(xord.length === 20) {
            for (let k = 0; k < arrayObj[i].length / 20; k++) {
                seriess.push(
                    {
                        name: YItemName[yname[i]],
                        type: 'line',
                        stack: 'all',
                        data: [arrayObj[i][k], arrayObj[i][3 + k], arrayObj[i][6 + k], arrayObj[i][9 + k], arrayObj[i][12 + k], arrayObj[i][15 + k], arrayObj[i][18 + k], arrayObj[i][21 + k], arrayObj[i][24 + k], arrayObj[i][27 + k],
                            arrayObj[i][30 + k], arrayObj[i][33 + k], arrayObj[i][36 + k], arrayObj[i][39 + k], arrayObj[i][42 + k], arrayObj[i][45 + k], arrayObj[i][48 + k], arrayObj[i][51 + k], arrayObj[i][54 + k], arrayObj[i][57 + k]],

                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                            },
                        },
                    },
                )
            }
        }

        let LineCharts = echarts.init(document.getElementById('charts' + i), 'westeros')
        let lineOption = {
            title: {
                text: YItemName[yname[i]]
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
                formatter: function (params) {
                    let res = params[0].name + '<br>'
                    if (YItemName[i] !== "客座率") {
                        for (let i = 0; i < params.length; i++) {
                            res += "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;'></span>" + params[i].seriesName + params[i].data + "<br/>"
                        }
                    } else {
                        for (let i = 0; i < params.length; i++) {
                            res += "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;'></span>" + params[i].seriesName + (1 * params[i].data).toFixed(2) + "%<br/>"
                        }
                    }
                    return res
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [YItemName[yname[i]]]
            },
            calculable: true,
            xAxis: {
                name: xname[0],
                type: 'category',
                data: xord,
                axisLabel: {
                    fontWeight: 'bold',
                    fontSize: 8,
                    rotate: 30
                }
            },
            yAxis: {
                name: YItemName[yname[i]],
                type: 'value',
                axisLine: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    margin: 2,
                    fontWeight: 'bold',
                    fontSize: 8,
                    formatter: formatterY
                }
            },
            series: seriess
        };
        LineCharts.setOption(lineOption)
    }

    //根据ord数组长度，生成对应个div
    function LineDrawCharts_createElement() {
        for (let i = 0; i < ord.length; i++) {
            let value = YItemName[yname[i]]
            let div1 = document.createElement('div')
            let div2 = document.createElement('div')
            let label = document.createElement('label')

            let divCharts = document.createElement('div')
            let divChartsN_D = document.createElement('div')

            let WorkBody = document.getElementById('WorkBody')

            divCharts.setAttribute('id', 'charts' + i)
            divCharts.setAttribute('style', 'width:700px;height:300px')

            divChartsN_D.setAttribute('id', 'N_D' + i)
            divChartsN_D.setAttribute('style', 'width:400px;height:200px;')
            label.setAttribute('id', 'labelN_D' + i)
            if (value !== '客座率')
                label.innerHTML = "总和:" + sum(arrayObj[i]).toFixed(2) + "&emsp;&emsp;&emsp;平均值:" + average(arrayObj[i]).toFixed(2) + "<br>最大值:" + (Math.max.apply(null, arrayObj[i])).toFixed(2) + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, arrayObj[i])).toFixed(2) + "<br>方差:" + varianceArr(arrayObj[i]) + "<br>标准差:" + stdDeviation(arrayObj[i])
            else
                label.innerHTML = "总和:" + sum(arrayObj[i]).toFixed(2) + "%" + "&emsp;&emsp;&emsp;平均值:" + average(arrayObj[i]).toFixed(2) + "%" + "<br>最大值:" + (Math.max.apply(null, arrayObj[i])).toFixed(2) + "%" + "&emsp;&emsp;&emsp;最小值:" + (Math.min.apply(null, arrayObj[i])).toFixed(2) + "%" + "<br>方差:" + varianceArr(arrayObj[i]) + "%" + "<br>标准差:" + stdDeviation(arrayObj[i]) + "%"
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

    function drawCharts_two(XName, i, j) {
        let formatterY = '{value}'
        try {
            if (GetY_ChooseItem[j].name === "客座率")
                formatterY = '{value}%'
        } catch (e) {
            if (i === 10)
                formatterY = '{value}%'
        }

        let BarCharts1 = echarts.init(document.getElementById('charts' + i), 'westeros')
        let seriess = []
        if (GetX_ChooseItem.length === 10) {
            for (let k = 0; k < datas[i].length / 10; k++) {
                seriess.push(
                    {
                        name: YItemName[j],
                        type: 'line',
                        stack: 'all',
                        data: [datas[i][k], datas[i][6 + k], datas[i][12 + k], datas[i][18 + k], datas[i][24 + k], datas[i][30 + k], datas[i][36 + k], datas[i][42 + k], datas[i][48 + k], datas[i][54 + k]],
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                            },
                        },
                    },
                )
            }
        } else {
            for (let k = 0; k < datas[i].length / 20; k++) {
                seriess.push(
                    {
                        name: YItemName[j],
                        type: 'line',
                        stack: 'all',
                        data: [datas[i][k], datas[i][3 + k], datas[i][6 + k], datas[i][9 + k], datas[i][12 + k], datas[i][15 + k], datas[i][18 + k], datas[i][21 + k], datas[i][24 + k], datas[i][27 + k],
                            datas[i][30 + k], datas[i][33 + k], datas[i][36 + k], datas[i][39 + k], datas[i][42 + k], datas[i][45 + k], datas[i][48 + k], datas[i][51 + k], datas[i][54 + k], datas[i][57 + k]],
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                            },
                        },
                    },
                )
            }
        }
        let option = {
            title: {
                text: YItemName[j]
            },
            tooltip: {
                formatter: function (params) {
                    let res = params[0].name + '<br>'
                    if (params[0].seriesName !== "客座率") {
                        for (let i = 0; i < params.length; i++) {
                            res += "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;'></span>" + params[i].seriesName + params[i].data + "<br/>"
                        }
                    } else {
                        for (let i = 0; i < params.length; i++) {
                            res += "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;'></span>" + params[i].seriesName + (1 * params[i].data).toFixed(2) + "%<br/>"
                        }
                    }
                    return res
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [YItemName[j]]
            },
            calculable: true,
            xAxis: {
                name: GetX_ParentName,
                type: 'category',
                data: XName,
                axisLabel: {
                    rotate: 30
                }
            },
            yAxis: {
                name: YItemName[j],
                type: 'value',
                axisLine: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    formatter: formatterY
                }
            },
            series: seriess
        };
        BarCharts1.setOption(option)
    }