/**
*分页器
*使用说明：
*   1. 页面初始化：ListPager.Render.initialPager()(必选)，设置控件链接click事件。
*   2. 页面初始化：ListPager.Filter.pageSize=xx(可选)，设置页显示数据条数。
*   3. 页面初始化：ListPager.pageChanged=eventHandler(可选)，设置翻页时触发事件。
*   4. 页面初始化：ListPager.Render.renderList=eventHandler(必选)，设置分页时页面呈现数据列表方法。
*   5. 获取数据成功后：ListPager.Filter.setData(list)(必选)，设置页面列表数据。
*   6. 获取数据成功后：ListPager.Render.renderPage(pageIndex)(必选)，展示分页控件和数据列表。
*
*Ref by JQuery,DiskCommon
*/
var ListPager = {
    Filter: {
        pageIndex: 0,
        pageSize: 10,
        order: "date",     //默认排序
        isAsc: false,      //是否为正序
        sortData: null,   //设置排序算法
        initialize: true,   //是否第一次加载
        setData: function(data) {
            window["cacheListPagerDataSource"] = data;
			if(top.yunxiangsichuan == true){
				return;
			}
            //初始化排序
            if (ListPager.Filter.order != "" && ListPager.Filter.sortData) {
                ListPager.Filter.isAsc = !ListPager.Filter.isAsc; //防止自动“倒序”
                ListPager.Filter.sortData(ListPager.Filter.order);
            }
        },
        getData: function() {
            var data = window["cacheListPagerDataSource"];
            if (!$.isArray(data)) {
                return null
            };
            var listData = [];
            var start = ListPager.Filter.pageSize * ListPager.Filter.pageIndex;
            var end = start + ListPager.Filter.pageSize;
            return $.grep(data, function(n, index) {
                if (index >= start && index < end) { return true; }
            });
        },
        //获取所以数据
        getAllData: function() {
            return window["cacheListPagerDataSource"];
        },
        //获取总页数
        getPageCount: function() {
            var total = 0;
            if (window["cacheListPagerDataSource"]) {
                total = window["cacheListPagerDataSource"].length;
            }
            return Math.ceil(total / ListPager.Filter.pageSize);
        },
		getDataCount: function(){
            if(window["cacheListPagerDataSource"]){
                return window["cacheListPagerDataSource"].length;
            }
            return 0;
        }
    },
    pageChanged: null,
    __onPageChange: function() {
        if (ListPager.pageChanged) {
            ListPager.pageChanged();
        }
    },
    Disable: function(ele) {
        $.disableElement(ele);
        $(ele).hide();
    },
    Enable: function(ele) {
        $.enableElement(ele);
        $(ele).show();
    },

    Render: {
        //呈现列表(需在页面初始化时提供)
        renderList: null,
        //在页面呈现分页控件和数据列表
        renderPage: function(pageIndex) {
            ListPager.Render.renderPager(pageIndex);
            ListPager.Render.renderList(ListPager.Filter.getData());
            ListPager.__onPageChange();
        },

        //初始化分页器
        initialPager: function() {
            var pager = $(".page>a").unbind();
            $(pager[0]).click(function(e) {
                if (this.disabled) {
                    e.preventDefault();
                    return;
                }
                ListPager.Render.renderPage(0);
                e.preventDefault();
            });
            $(pager[1]).click(function(e) {
                e.preventDefault();
                if (this.disabled || ListPager.Filter.pageIndex == 0) {
                    DiskTool.FF.alert("已到第一页");
                    return;
                }
                ListPager.Render.renderPage(ListPager.Filter.pageIndex - 1);
            });
            $(pager[5]).click(function(e) {
                e.preventDefault();
                if (this.disabled || ListPager.Filter.pageIndex == 0) {
                    DiskTool.FF.alert("已到第一页");
                    return;
                }
                ListPager.Render.renderPage(ListPager.Filter.pageIndex - 1);
            });
            $(pager[2]).click(function(e) {
                e.preventDefault();
                if (this.disabled || ($(".page>select>option").length / 2) == ListPager.Filter.pageIndex + 1) {
                    DiskTool.FF.alert("已到最后一页");
                    return;
                }
                ListPager.Render.renderPage(ListPager.Filter.pageIndex + 1);
            });
            $(pager[6]).click(function(e) {
                e.preventDefault();
                if (this.disabled || ($(".page>select>option").length / 2) == ListPager.Filter.pageIndex + 1) {
                    DiskTool.FF.alert("已到最后一页");
                    return;
                }
                ListPager.Render.renderPage(ListPager.Filter.pageIndex + 1);
            });
            $(pager[3]).click(function(e) {
                e.preventDefault();
                if (this.disabled) {
                    return;
                }
                ListPager.Render.renderPage($(".page>select>option").length - 1);
            });
        },

        //显示分页器
        renderPager: function(pageIndex) {
            var pageCount = null;
            //如果是首次初始化
            if (ListPager.Filter.initialize == true) {
                pageCount = ListPager.Filter.getPageCount();
                var optionHtml = [];
                for (var i = 1; i <= pageCount; i++) {
                    optionHtml.push("<option>{0}/{1}页</option>".format(i, pageCount));
                }
                if (optionHtml.length == 0) {
                    optionHtml.push("<option>{0}/{1}页</option>".format(0, 0));
                }
                $(".page>select").html(optionHtml.join(""))
                .unbind("change").change(function() {
                    ListPager.Render.renderPage(this.selectedIndex);
                });
                ListPager.Filter.initialize = false;
            }
            else {
                pageCount = $(".page>select>option").length / 2;
            }

            //修正pageIndex
            if (pageCount <= 0) {
                pageIndex = 0;
            } else {
                pageIndex = pageIndex < 0 ? 0 : pageIndex;
                pageIndex = pageIndex >= pageCount ? pageCount - 1 : pageIndex;
            }
            ListPager.Filter.pageIndex = pageIndex;

            //无数据不显示链接
            if (pageCount == 0) {
                $(".page").find("a").hide();
                return;
            }

            //有数据时
            $(".page").show();
            var pager = $(".page");
            var aPager = pager.find("a");

            if (pageCount == 1) {
                //ListPager.Disable(aPager[0]);
                ListPager.Disable(aPager[1]);
                ListPager.Disable(aPager[2]);
                //ListPager.Disable(aPager[3]);
                //ListPager.Disable(aPager[4]);
                ListPager.Disable(aPager[5]);
                ListPager.Disable(aPager[6]);
                //ListPager.Disable(aPager[7]);
            }
            else {

                if (pageIndex == 0) {
                    //ListPager.Disable(aPager[0]);
                    ListPager.Disable(aPager[1]);
                    ListPager.Enable(aPager[2]);
                    //ListPager.Enable(aPager[3]);
                    //ListPager.Disable(aPager[4]);
                    ListPager.Disable(aPager[5]);
                    ListPager.Enable(aPager[6]);
                    //ListPager.Enable(aPager[7]);
                }
                else if (pageIndex == pageCount - 1) {
                    //ListPager.Enable(aPager[0]);
                    ListPager.Enable(aPager[1]);
                    ListPager.Disable(aPager[2]);
                    //ListPager.Disable(aPager[3]);
                    //ListPager.Enable(aPager[4]);
                    ListPager.Enable(aPager[5]);
                    ListPager.Disable(aPager[6]);
                    //ListPager.Disable(aPager[7]);
                }
                else {
                    //ListPager.Enable(aPager[0]);
                    ListPager.Enable(aPager[1]);
                    ListPager.Enable(aPager[2]);
                    //ListPager.Enable(aPager[3]);
                    //ListPager.Enable(aPager[4]);
                    ListPager.Enable(aPager[5]);
                    ListPager.Enable(aPager[6]);
                    //ListPager.Enable(aPager[7]);
                }
            }
            $(".page>select").each(function() {
                this.selectedIndex = pageIndex;
            });
        }
    }
}

//默认日期向下箭头
if ($) {
    $(function() {
        $(".tbl-list>thead>tr>th.t-date>span.t-arrow").html("↓");
    });
}
