    function sum(arr) {
        return eval(arr.join("+"));
    }

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
                PieDrawCharts_createElement()
                for (let i = 0; i < arrayObj.length; i++) {
                    createrPieCharts(i)
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

    function createrPieCharts(i) {
        let formatter = '{a}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">{b}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">{c}</span>'
        if (YItemName[i] === "客座率")
            formatter = '{a}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">{b}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">{c}%</span>'
        let pieCharts = echarts.init(document.getElementById('charts' + i), 'westeros')
        let pieseries = []
        if (xord.length === 10) {
            for (let k = 0; k < arrayObj[i].length / 10; k++) {
                pieseries.push(
                    {
                        name: YItemName[yname[i]],
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: sum(arrayObj[i].slice(0, 6)).toFixed(2), name: xord[0]},
                            {value: sum(arrayObj[i].slice(6, 12)).toFixed(2), name: xord[1]},
                            {value: sum(arrayObj[i].slice(12, 18)).toFixed(2), name: xord[2]},
                            {value: sum(arrayObj[i].slice(18, 24)).toFixed(2), name: xord[3]},
                            {value: sum(arrayObj[i].slice(24, 30)).toFixed(2), name: xord[4]},
                            {value: sum(arrayObj[i].slice(30, 36)).toFixed(2), name: xord[5]},
                            {value: sum(arrayObj[i].slice(36, 42)).toFixed(2), name: xord[6]},
                            {value: sum(arrayObj[i].slice(42, 48)).toFixed(2), name: xord[7]},
                            {value: sum(arrayObj[i].slice(48, 54)).toFixed(2), name: xord[8]},
                            {value: sum(arrayObj[i].slice(54, 60)).toFixed(2), name: xord[9]}
                        ]
                    }
                )
            }
        } else {
            for (let k = 0; k < arrayObj[i].length / 20; k++) {
                pieseries.push(
                    {
                        name: YItemName[yname[i]],
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: sum(arrayObj[i].slice(0, 3)).toFixed(2), name: xord[0]},
                            {value: sum(arrayObj[i].slice(3, 6)).toFixed(2), name: xord[1]},
                            {value: sum(arrayObj[i].slice(6, 9)).toFixed(2), name: xord[2]},
                            {value: sum(arrayObj[i].slice(9, 12)).toFixed(2), name: xord[3]},
                            {value: sum(arrayObj[i].slice(12, 15)).toFixed(2), name: xord[4]},
                            {value: sum(arrayObj[i].slice(15, 18)).toFixed(2), name: xord[5]},
                            {value: sum(arrayObj[i].slice(18, 21)).toFixed(2), name: xord[6]},
                            {value: sum(arrayObj[i].slice(21, 24)).toFixed(2), name: xord[7]},
                            {value: sum(arrayObj[i].slice(24, 27)).toFixed(2), name: xord[8]},
                            {value: sum(arrayObj[i].slice(27, 30)).toFixed(2), name: xord[9]},
                            {value: sum(arrayObj[i].slice(30, 33)).toFixed(2), name: xord[10]},
                            {value: sum(arrayObj[i].slice(33, 36)).toFixed(2), name: xord[11]},
                            {value: sum(arrayObj[i].slice(36, 39)).toFixed(2), name: xord[12]},
                            {value: sum(arrayObj[i].slice(39, 42)).toFixed(2), name: xord[13]},
                            {value: sum(arrayObj[i].slice(42, 45)).toFixed(2), name: xord[14]},
                            {value: sum(arrayObj[i].slice(45, 48)).toFixed(2), name: xord[15]},
                            {value: sum(arrayObj[i].slice(48, 51)).toFixed(2), name: xord[16]},
                            {value: sum(arrayObj[i].slice(51, 54)).toFixed(2), name: xord[17]},
                            {value: sum(arrayObj[i].slice(54, 57)).toFixed(2), name: xord[18]},
                            {value: sum(arrayObj[i].slice(57, 60)).toFixed(2), name: xord[19]},
                        ]
                    }
                )
            }
        }
        let pieOption = {
            title: {
                text: YItemName[yname[i]]
            },
            tooltip: {
                show: true,
                formatter: formatter
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
            legend: {
                data: xord,
                x: 'left',      //可设定图例在左、右、居中
                y: 'center',    //可设定图例在上、下、居中
                orient: 'vertical',
                padding: [50, 50, 0, 10],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
            },
            calculable: true,
            series: pieseries
        }
        pieCharts.setOption(pieOption)
    }

    function PieDrawCharts_createElement() {
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
        let formatter = '{a}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">{b}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">{c}</span>'
        try {
            if (GetY_ChooseItem[j].name === "客座率")
                formatter = '{a}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">{b}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">{c}%</span>'
        } catch (e) {
            if (i === 10)
                formatter = formatter = '{a}<br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">{b}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">{c}%</span>'
        }

        let BarCharts1 = echarts.init(document.getElementById('charts' + i), 'westeros')
        let series = []
        if (GetX_ChooseItem.length === 10) {
            for (let k = 0; k < datas[i].length / 10; k++) {
                series.push(
                    {
                        name: YItemName[j],
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: sum(datas[i].slice(0, 6)).toFixed(2), name: PostData[0]},
                            {value: sum(datas[i].slice(6, 12)).toFixed(2), name: PostData[1]},
                            {value: sum(datas[i].slice(12, 18)).toFixed(2), name: PostData[2]},
                            {value: sum(datas[i].slice(18, 24)).toFixed(2), name: PostData[3]},
                            {value: sum(datas[i].slice(24, 30)).toFixed(2), name: PostData[4]},
                            {value: sum(datas[i].slice(30, 36)).toFixed(2), name: PostData[5]},
                            {value: sum(datas[i].slice(36, 42)).toFixed(2), name: PostData[6]},
                            {value: sum(datas[i].slice(42, 48)).toFixed(2), name: PostData[7]},
                            {value: sum(datas[i].slice(48, 54)).toFixed(2), name: PostData[8]},
                            {value: sum(datas[i].slice(54, 60)).toFixed(2), name: PostData[9]}
                        ]
                    }
                )
            }
        } else {
            for (let k = 0; k < datas[i].length / 20; k++) {
                series.push(
                    {
                        name: YItemName[j],
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: sum(datas[i].slice(0, 3)).toFixed(2), name: PostData[0]},
                            {value: sum(datas[i].slice(3, 6)).toFixed(2), name: PostData[1]},
                            {value: sum(datas[i].slice(6, 9)).toFixed(2), name: PostData[2]},
                            {value: sum(datas[i].slice(9, 12)).toFixed(2), name: PostData[3]},
                            {value: sum(datas[i].slice(12, 15)).toFixed(2), name: PostData[4]},
                            {value: sum(datas[i].slice(15, 18)).toFixed(2), name: PostData[5]},
                            {value: sum(datas[i].slice(18, 21)).toFixed(2), name: PostData[6]},
                            {value: sum(datas[i].slice(21, 24)).toFixed(2), name: PostData[7]},
                            {value: sum(datas[i].slice(24, 27)).toFixed(2), name: PostData[8]},
                            {value: sum(datas[i].slice(27, 30)).toFixed(2), name: PostData[9]},
                            {value: sum(datas[i].slice(30, 33)).toFixed(2), name: PostData[10]},
                            {value: sum(datas[i].slice(33, 36)).toFixed(2), name: PostData[11]},
                            {value: sum(datas[i].slice(36, 39)).toFixed(2), name: PostData[12]},
                            {value: sum(datas[i].slice(39, 42)).toFixed(2), name: PostData[13]},
                            {value: sum(datas[i].slice(42, 45)).toFixed(2), name: PostData[14]},
                            {value: sum(datas[i].slice(45, 48)).toFixed(2), name: PostData[15]},
                            {value: sum(datas[i].slice(48, 51)).toFixed(2), name: PostData[16]},
                            {value: sum(datas[i].slice(51, 54)).toFixed(2), name: PostData[17]},
                            {value: sum(datas[i].slice(54, 57)).toFixed(2), name: PostData[18]},
                            {value: sum(datas[i].slice(57, 60)).toFixed(2), name: PostData[19]},
                        ]
                    }
                )
            }
        }
        let option = {
            title: {
                text: YItemName[j]
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
                show: true,
                formatter: formatter
             },
            legend: {
                data: PostData,
                x: 'left',      //可设定图例在左、右、居中
                y: 'center',    //可设定图例在上、下、居中
                orient: 'vertical',
                padding: [50, 50, 0, 10],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
            },
            calculable: true,
            series: series
        };
        BarCharts1.setOption(option)
    }
