; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.listTemplate";

    M139.namespace(_class, superClass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),
        //视图数据模型
        model: null,
        //视图控制器
        master: null,
        //当前视图的父容器
        container: null,
        //排序数据
        sortData: null,

        initialize: function (args) {
            var self = this;

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;
                    self.model = new M2012.Disk.Model.Recycle({
                        master: self.master
                    });
                    self.initEvents();
                    // self.render();
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                    $(window).resize(function () {
                        self.adjustHeight();
                    });
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过args.name来判断是不是切换到了当前视图
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.render();
                }
            });
            return superClass.prototype.initialize.apply(self, arguments);
        },

        /**
         * 初始化事件        
        **/
        initEvents: function () {
            var self = this;

            self.master.on("change:list_view_type", function () {
                self.setViewSwitchUI();
                self.fillData();
            });
            //排序方式发生变化时重新设置排序标示
            self.model.on("change:sortExp", function () {
                self.setSortUI();
                //排序数据
                self.model.sortData();
                //重新向视图填充数据
                self.fillData();
            });
            //页码发生变化时重新设置排序标示
            self.model.on("change:pageIndex", function () {
                //重新向视图填充数据
                self.fillData();
            });
            //导航信息发生变化后重新显示导航信息
            self.model.on("change:navs", function () {
                self.setNavigation();
            });

            //选择项发生变化后重新初始化选择项
            self.model.on("change:checkData", function () {
                self.setCheckedUI();
            });
        },

        /**
         * 初始页面数据  
         * @param {Boolean}  args.notip  //是否忽略加载信息提示
        **/
        initData: function (args) {
            var self = this;
            var master = self.master;
            var notip = false;

            args = args || {};
            if (_.isBoolean(args.notip))
                notip = args.notip;

            //通知UI显示数据加载中
            if (!notip)
                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.DATA_FETCHING,
                    params: { delay: 15000 }
                });

            self.model.fetch(function (data) {
                //重新获取数据后选择项需要清空
                self.model.set({ checkData: null });
                //关闭数据加载提示
                if (!notip)
                    master.trigger(master.EVENTS.TIP_HIDE);

                self.setPager();
                self.fillData();

            }, function () {
                //关闭数据加载提示     
                if (!notip)
                    master.trigger(master.EVENTS.TIP_HIDE);
                //需要重新设置下页数
                self.setPager();
                //没有数据时的显示
                self.showEmpty();

                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.FETCH_DATA_ERROR,
                    params: {
                        delay: 3000,
                        className: "msgRed"
                    }
                });
            });

        },

        adjustHeight: function () {
            var self = this;
            var container = self.getElement("divbody");
            var bodyHeight = $("body").height();
            var top = container.offset().top;          
            container.height(bodyHeight - top);

            var right = "14px";
            //出现滚动条时去掉与右边的间距
            if (container[0].scrollHeight > container[0].offsetHeight) {
                right = "0px"
            }
            container[0].style.marginRight = right;
        },

        /**
         * 设置列表页操作按钮 
         * @param {Object}  container  //内容设置区域父容器jQuery对象
        **/
        setContextMenu: function (container) {

            //  throw 'This method is not implemented: "setOptButtons"';
        },


        /**
         * 设置列表页操作按钮 
         * @param {Object}  container  //内容设置区域父容器jQuery对象
        **/
        setOptButtons: function (container) {

            //  throw 'This method is not implemented: "setOptButtons"';
        },

        /**
         * 设置分页控件
        **/
        setPager: function () {
            var self = this;
            var container = self.getElement("pager");

            //清空之前创建的分页控件
            container.empty();
            //添加分页控件
            self.pager = M2012.UI.PageTurning.create({
                container: container,
                styleTemplate: 2,
                maxPageButtonShow: 5,
                pageSize: self.model.get("pageSize") || 0,
                pageIndex: self.model.get("pageIndex") || 0,
                pageCount: self.model.get("pageCount") || 0
            }).unbind("pagechange").bind("pagechange", function (index) {
                top.BH("caiyunPageN");
                self.model.set({
                    pageIndex: index
                });
            });
        },

        /**
         * 设置导航
        **/
        setNavigation: function (container) {
            var self = this;
            var html = self._template.nav;
            var template = _.template(html);
            var data = self.model.get("navs") || [];

            if (!container) {
                container = self.getElement("navContainer");
            }
            container.html(template(data));
        },

        /**
         * 设置导航
        **/
        setViewSwitchUI: function () {
            var self = this;
            var switchEl = self.getElement("switchmode");
            var type = self.master.get("list_view_type");
            switchEl.find("i").each(function (e) {
                var cssName = this.className;
                if (cssName.indexOf("_checked") < 0)
                    cssName += "_checked";
                var mode = $(this).data("mode");
                if (type == mode)
                    cssName = this.className.replace("_checked", "");
                this.className = cssName;
            });
        },

        /**
         * 设置选中项选中状态
        **/
        setCheckedUI: function () {
            var self = this;
            var data = self.model.get("checkData");
            data = data || [];

            self.getElement("tabody").find("tr[data-id]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("id"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                }
            });
            self.getElement("listview").find("li[data-id]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("id"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                    if (ckb[0].checked) {
                        ckb.show();
                        row.addClass("listViewHover").addClass("listViewChecked");
                    } else {
                        ckb.hide();
                        row.removeClass("listViewHover").removeClass("listViewChecked");
                    }
                }
            });
        },

        /**
         * 设置表头
         * @param {Object}  container   //内容设置区域父容器jQuery对象
        **/
        setTabHeader: function (container) {

            // throw 'This method is not implemented: "setTabHeader"';
        },

        /**
         * 设置列表内容呈现
         * @param {Object}  container   //内容设置区域父容器jQuery对象
         * @param {Object}  data   //当前页视图数据
        **/
        setTabContent: function (container, data) {

            // throw 'This method is not implemented: "setTabContent"';
        },

        /**
        * 设置缩略图列表内容呈现
        * @param {Object}  container   //内容设置区域父容器jQuery对象
        * @param {Object}  data   //当前页视图数据
       **/
        setThumbContent: function (container, data) {

            // throw 'This method is not implemented: "setThumbContent"';
        },

        /**
         * 设置无内容时的信息提示
         * @param {Object}  container   //内容设置区域父容器jQuery对象
        **/
        setEmptyTips: function (container) {

            //  throw 'This method is not implemented: "setEmptyTips"';
        },

        /**
         * 设置排序菜单相关UI
        **/
        setSortMenu: function () {
            var self = this;
            //如果存在排序数据则初始化排序菜单
            if (!self.sortData)
                return;

            var data = [];
            for (var i in self.sortData) {
                data.push({
                    key: i,
                    name: self.sortData[i]
                });
            }
            var template = _.template(self._template.sort);
            self.getElement("sortMenus").html(template(data));
        },

        /**
         * 排序后重新设置表头和排序下拉菜单选中项
        **/
        setSortUI: function () {
            var self = this;
            var sort = self.model.get("sortExp");
            var aExp = sort.split("-");
            var field = aExp[0];
            var isAsc = aExp[1] == "asc";
            //设置排序菜单栏选择项            
            self.getElement("sortMenus").find("li").removeClass("cur")
                .find("em").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<em class=\"downRinking\">{0}</em>";
                        html = $T.format(html, [isAsc ? "↑" : "↓"]);
                        //设为当前选择列并追加排序标示箭头
                        me.addClass("cur").attr({
                            sort: sort
                        }).find("span").append(html);
                        return false;
                    }
                });

            //设置列表头排序选择项
            self.getElement("tabheadrow").find("th").removeAttr("cur")
                .find("i").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<i class=\"{0}\"></i>";
                        html = $T.format(html, [isAsc ? "i_th1" : "i_th0"]);
                        //设为当前选择列并追加排序标示箭头
                        me.attr({ cur: 1, sort: sort }).append(html);
                        return false;
                    }
                });
        },

        /**
         * 呈现数据
        **/
        render: function () {
            var self = this;

            if (!self.container)
                return;

            var html = $T.format(self._template.main, { cid: self.cid });
            self.container.html(html);
            //设置右键菜单
            self.setContextMenu(self.container);
            //设置页面操作按钮
            self.setOptButtons(self.getElement("options"));

            //初始化排序菜单项
            self.setSortMenu();

            //设置分页控件
            self.setPager();
            //设置列表视图切换控件
            self.setViewSwitchUI();

            //设置导航信息显示
            self.setNavigation();

            //设置表头内容
            self.setTabHeader(self.getElement("tabheadrow"));

            //设置无数据时的提示信息
            self.setEmptyTips(self.getElement("emptytips"));

            self.setSortUI();

            //初始化页面元素事件
            self.initPageEvents();

            self.adjustHeight();

            //初始化页面数据
            self.initData();
        },

        fillData: function () {
            var self = this;
            var data = self.model.filterData();

            //没有数据时的显示
            if (!data || data.length === 0) {
                self.showEmpty();
                return;
            }

            var type = self.master.get("list_view_type");
            var common = self.master.common;
            //设置列表内容
            if (type == common.LIST_VIEW_TYPE.LIST) {
                self.getElement("tabcontent").show();
                self.getElement("divheader").show();
                self.getElement("listview").hide();
                var container = self.getElement("tabody");
                self.setTabContent(container, data);
            } else if (type == common.LIST_VIEW_TYPE.THUMB) {
                var container = self.getElement("listview").show();
                self.getElement("divheader").hide();
                self.getElement("tabcontent").hide();
                self.setThumbContent(container, data);
            }
            self.adjustHeight();
            //重置选择项
            self.getElement("ckball").removeAttr("checked");
            self.setCheckedUI();
        },

        /**
         * 初始化页面元素事件
         **/
        initPageEvents: function () {
            var self = this;
            //点击切换列表视图
            self.getElement("switchmode").unbind().click(function (e) {
                if (e.target.tagName.toLowerCase() == "i") {
                    var mode = $(e.target).data("mode");
                    self.master.set({
                        list_view_type: mode
                    });
                    console.log(self.master.get("list_view_type"));
                }
            });

            //点击导航切换视图
            self.getElement("navContainer").click(function (e) {
                var el = $(e.target);
                if (el.get(0).tagName.toLowerCase() === "a") {
                    var dirId = el.data("dirid");
                    var path = el.data("path");
                    var isSystem = el.data("system");
                    var dirName = el.text();
                    var data = null;
                    if (dirId && path && name)
                        data = {
                            dirId: $T.Html.decode(dirId),
                            path: $T.Html.decode(path),
                            dirName: $T.Html.decode(dirName),
                            isSystem: isSystem
                        };
                    self.model.setNavigation(data);
                }
            });

            //排序点击相关
            var sortMenusEl = self.getElement("sortMenus");
            //页面点击后关闭排序选择面板
            $(document.body).bind("click", function () {
                sortMenusEl.addClass("hide");
            });

            //点击排序展示排序菜单
            self.getElement("btnSort").click(function (e) {
                var me = $(this);
                var offset = me.offset();
                top.BH('caiyunSort');
                M139.Event.stopEvent(e);
                sortMenusEl.removeClass("hide").css({
                    top: offset.top + me.height() + 5,
                    left: offset.left + me.outerWidth() - sortMenusEl.outerWidth()
                });
            });

            //排序触发事件
            var sortFunc = function (e) {
                var me = $(this);
                var sort = me.attr("sort");
                if (!sort)
                    return;

                if (me.hasClass("cur") || me.attr("cur")) {
                    var args = ["asc", "desc"];
                    if (sort.indexOf("desc") > -1)
                        args = args.reverse();

                    sort = String.prototype.replace.apply(sort, args);
                }
                self.model.set({ sortExp: sort });
            };
            //排序菜单点击排序
            sortMenusEl.find("li").click(sortFunc);
            //表头点击排序
            self.getElement("tabheadrow").find("th").click(sortFunc);

            //全选
            self.getElement("ckball").click(function (e) {
                var me = this;
                var ids = [];
                //查找所有id
                self.getElement("tabody").find("tr[data-id]").each(function () {
                    var row = $(this);
                    if (row.attr("system"))
                        return true;
                    ids.push($T.Html.decode(row.data("id")));
                });

                // 设置选中数据
                self.model.setCheckedData({
                    data: ids,
                    isChecked: me.checked
                });

            });
        },

        /**
         * 无数据时的显示  
        **/
        showEmpty: function () {
            var self = this;
            self.getElement("divheader").hide();
            self.getElement("divbody").hide();
            self.getElement("empty").show();
        },

        /**
         * 获取页面元素jQuery对象
         * @param {String} id  //id为{cid}_id 格式的中的id部分
        **/
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        _template: {
            main: [
              '<div id="{cid}_container">',
                  '<div id="{cid}_sortMenus" class="menuPop menuPops shadow hide" bindautohide="1">',
                  '</div>',
                  '<div class="toolBar bgMargin border-btm">',
                      '<ul class="toolBarUl" id="{cid}_options">',
                          '<!--操作按钮-->',
                      '</ul>',
                      '<div>',                          
                           '<span class="">',
                              '<span class="viewTipPic fr mr_10 ml_10" id="{cid}_switchmode">',
                                  '<a href="javascript:void(0)" class="mr_5"><i class="i_view"  data-mode="1" ></i></a>',
                                  '<a href="javascript:void(0)"><i class="i_list"  data-mode="2"></i></a>',
                              '</span>',
                          '</span>',
                          '<div id="{cid}_pager" class="">',
                              '<!--翻页控件-->',
                          '</div>',
                      '</div>',
                      '<a href="javascript:void(0)" class="diskSortTitle pagenum" style="float: right;" id="{cid}_btnSort">',
                          '<span class="pagenumtext">排序</span>',
                      '</a>',
                  '</div>',

                  '<div class="inboxHeader bgMargin">',
                      '<span id="{cid}_navContainer">',
                          '<!--导航-->',
                      '</span>',
                  '</div>',
                   '<div  id="{cid}_empty" style="margin-top:128px;line-height:22px; display:none;">',
                      '<div id="{cid}_emptytips" class="imgInfo addr-imgInfo ta_c">',
                          '<!--无信息提示-->',
                      '</div>',
                  '</div>',
                  '<div class="diskTableList onScollTable" id="{cid}_divheader">',
                      '<table cellspacing="0"  cellpadding="0" class="listHead newShareTable" id="{cid}_tabheader">',
                          '<thead>',
                              '<tr id="{cid}_tabheadrow">',
                                  '<th class="t-check wh1" style="text-align: left; padding-left: 8px; vertical-align: middle;">',
                                      '<input type="checkbox" id="{cid}_ckball" />',
                                  '</th>',
                                  '<!--表头-->',
                              '</tr>',
                          '</thead>',
                      '</table>',
                  '</div>',
                  '<div class="appendixList p_relative" style="margin-top: 0px; overflow-y: auto; overflow-x: hidden;" id="{cid}_divbody">',
                      '<table cellspacing="0"  cellpadding="0" class="tbl-list listHead newShareTable" id="{cid}_tabcontent">',
                          '<tbody id="{cid}_tabody">',
                              '<!--表格-->',
                          '</tbody>',
                      '</table>',
                      '<div id="{cid}_listview" style="margin-top:14px"><div>',
                  '</div>',

              '</div>'
            ].join(""),

            sort: [
                '<ul>',
                    '<% _.each(obj, function(i){ %>',
                    '<li sort="<%=i.key%>-desc"><a href="javascript:void(0);"><i class="i_b_right"></i><span class="text">按<%=i.name%></span></a></li>',
                    '<% }) %>',
                 '</ul>'
            ].join(""),

            nav: [
                '<a href="javascript:;">全部文件</a>',
                '<% _.each(obj, function(i){ %>',
                '<span class="f_st">&nbsp;&gt;&nbsp;</span>',
                '<a href="javascript:;" data-path="<%=_.escape(i.path)%>" data-system="<%=i.isSystem%>" data-dirid="<%=_.escape(i.dirId)%>"><%=_.escape(i.dirName)%></a>',
                '<% }) %>'
            ].join("")
        }

    }));

})(jQuery, _, M139);