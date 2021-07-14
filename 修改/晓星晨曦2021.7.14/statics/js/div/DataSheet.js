document.write("<script language='JavaScript' src='/statics/js/jquery-3.6.0.min.js/'></script>")
document.write("<script language='JavaScript' src='/statics/js/jquery.cookie.js'></script>")
    var getTotal, getSearchSelect
    var table = layui.table
    var laypage = layui.laypage
    var form = layui.form
    var checkSearch = false

    //窗口加载事件
    window.onload = function(){
        var data = {
            'order': '1',
            'csrfmiddlewaretoken': $.cookie("csrftoken")
        }
        $.post('/drawTable/', data, function (result) {
            getTotal = result
            page()
        })
    }

    //从数据库获取数据
    function GetData(num){
        checkSearch = false
        var data = {
            'order': '0',
            'num': num * 100,
            'csrfmiddlewaretoken': $.cookie("csrftoken")
        }
        $.post('/drawTable/', data, function (result) {
            writeTable(result['num'], result['data'])
        })
    }

    function page(){
        laypage.render({
            elem:'page',
            count: getTotal,
            limit: 100,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                GetData(obj.curr - 1)
            }
        })
    }

    function writeTable(num, data){
        table.render({
            elem: '#DataSheet',
            sortType: 'server',
            autoSort: false,
            height: 'full-' + (document.getElementById('page').offsetHeight + document.getElementById('searchInput').offsetHeight + 10),
            cellMinWidth: 110,
            cols: [[
                {field:'day_id', title:'承运日期', sort:true},
                {field:'dpt_cty_cd', title:'出发城市', sort:true},
                {field:'arrv_cty_cd', title:'到达城市', sort:true},
                {field:'dpt_airpt_cd', title:'出发机场', sort:true},
                {field:'arrv_airpt_cd', title:'到达机场', sort:true},
                {field:'carr_cd', title:'航空公司', sort:true},
                {field:'flt_nbr', title:'航班号', sort:true},
                {field:'cls_cd', title:'主舱位', sort:true},
                {field:'sub_cls_cd', title:'子舱位', sort:true},
                {field:'flt_rte_cd', title:'航班航线', sort:true},
                {field:'flt_seg_dpt_hh', title:'航段起飞小时', sort:true},
                {field:'flt_seg_dpt_mm', title:'航段起飞分钟', sort:true},
                {field:'flt_seg_arrv_dt', title:'到达日期', sort:true},
                {field:'flt_seg_arrv_hh', title:'航段到达小时', sort:true},
                {field:'flt_seg_arrv_mm', title:'航段到达分钟', sort:true},
                {field:'flt_seg_seq_nbr', title:'航段序号', sort:true},
                {field:'aircrft_typ', title:'机型', sort:true},
                {field:'flt_seg_dstnc', title:'航段距离', sort:true},
                {field:'leg_qty', title:'航节数', sort:true},
                {field:'cls_cpc_qty', title:'航节主舱位运力量', sort:true},
                {field:'pax_qty', title:'旅客量', sort:true},
                {field:'fc_pax_qty', title:'主舱位是F和C的旅客量', sort:true},
                {field:'grp_pax_qty', title:'团队旅客量', sort:true},
                {field:'ffp_pax_qty', title:'常旅客量', sort:true},
                {field:'net_amt', title:'每旅客分摊收入', sort:true},
                {field:'y_fr_amt', title:'Y舱基准价', sort:true},
            ]],
            data: data,
            limit: num
        })
    }

    table.on('sort(DataSheet)', function (obj) {
        console.log(obj)
        var content = document.getElementById('searchInput').value
        if(content === "" && getSearchSelect === undefined){
            checkSearch = false
        }
        if(!checkSearch){
            table.reload('DataSheet', {
                initSort: obj,
                url: '/drawTable/',
                where: {
                    field: obj.field,
                    order: obj.type,
                }
            })
        }else{
            if (/null/.test(obj.type)){
                table.reload('DataSheet', {
                    initSort: obj,
                    url: '/drawTable/',
                    where: {
                        field: getSearchSelect,
                        content: content,
                        order: "search"
                    }
                })
            } else {
                table.reload('DataSheet', {
                    initSort: obj,
                    url: '/drawTable/',
                    where: {
                        field: obj.field,
                        order: 'search-' + obj.type,
                    }
                })
            }
        }
    })

    //搜索功能相关
    form.on('select(searchSelect)', function(data){
        getSearchSelect = data.value
    })

    //搜索
    function search() {
        var content = document.getElementById('searchInput').value
        if(getSearchSelect !== undefined && content !== ""){
            checkSearch = true
            table.reload('DataSheet', {
                url: '/drawTable/',
                where: {
                    field: getSearchSelect,
                    content: content,
                    order: "search"
                }
            })
        }else{
            checkSearch = false
            table.reload('DataSheet', {
                url: '/drawTable/',
                where: {
                    field: '',
                    order: 'null',
                }
            })
            layer.open({
                title: '提示',
                content: '没选择搜索项或没输入搜索内容！'
            })
        }
    }
