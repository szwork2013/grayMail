; (function ($, _, M139) {

    var superClass = M2012.Disk.View.listTemplate;
    var _class = "M2012.Disk.View.Recycle";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //当前视图名称
        viewName: "recycle",

        logger: new M139.Logger({ name: _class }),

        //视图主控
        master: null,

        //视图对应数据模型
        model: null,

        //当前视图父容器
        container: null,

        //右键菜单
        contextMenuEl: null,

        //排序菜单数据
        sortData: {
            name: "文件名",
            date: "删除时间",
            size: "文件大小"
        },

        initialize: function (args) {
            var self = this;
            self.master = args.master;
            superClass.prototype.initialize.apply(self, arguments);
        },

        /**
         * 重写父类方法，用于设置右键菜单
         * @param {Object} container  //设置区域容器
        **/
        setContextMenu: function (container) {
            var self = this;
            if (self.contextMenuEl) {
                self.contextMenuEl.remove();
                self.contextMenuEl = null;
            }
            var html = self.template.contextMenu;
            html = $T.format(html, { cid: self.cid });
            self.contextMenuEl = $(html).appendTo(container);

            self.contextMenuEl.find("li").unbind().click(function (e) {
                var me = $(this);
                var cmd = me.attr("cmd");
                if (!cmd) return;

                var data = self.getCheckedData();
                if (!data) return;

                switch (cmd) {
                    case "delete": self.realDel(data);
                        break;
                    case "restore": self.restore(data);
                        break;
                }
            });

            $(document.body).bind("click", function (e) {
                self.contextMenuEl.hide();
            })
        },

        /**
         * 重写父类方法，用于设置操作选项
         * @param {Object} container  //设置区域容器
        **/
        setOptButtons: function (container) {
            var self = this;
            var master = self.master;
            var content = self.template.operation;
            content = $T.format(content, { cid: self.cid });
            container.html(content);

            //还原
            self.getElement("btnRestore").click(function (e) {
                var data = self.getCheckedData();
                if (!data)
                    return;
                self.restore(data);
            });
            //彻底删除
            self.getElement("btnDelete").click(function (e) {
                var data = self.getCheckedData();
                if (!data)
                    return;
                self.realDel(data);
            });
            //彻底删除
            self.getElement("btnClear").click(function (e) {
                var data = self.model.get("cacheData");
                if (!data || data.length == 0)
                    return;
                self.clearAll();
            });
        },

        /**
         * 获取选中的数据并给出提示
        **/
        getCheckedData: function () {
            var self = this;
            var data = self.model.getCheckedData();
            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.master.common.showTips(mssage);
                return null;
            }
            return data;
        },

        /**
         * 还原操作
         * @param {Object} data  //要还原的数据项
        **/
        restore: function (data) {
            var self = this;
            var master = self.master;

            top.BH("disk_recycle_restore");
            self.model.restore(data, function () {
                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.RESTORE_SUCCESS,
                    params: { delay: 3000 }
                });
                self.initData({ notip: true });
            }, function (args) {

                if (args && args.code == "S_ERROR_SPACE_LIMIT") {
                    top.$Msg.alert(self.template.spaceLimit, {
                        isHtml: true
                    });
                    return;
                }
                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.OPERATE_ERROR,
                    params: { delay: 3000 },
                    className: "msgRed"
                });
            });
        },

        /**
         * 彻底删除操作
         * @param {Object} data  //要彻底删除的数据项
        **/
        realDel: function (data) {
            top.BH("disk_recycle_del");
            var self = this;
            var master = self.master;
            top.$Msg.confirm(self.template.delConfirm, function () {
                self.model.realDel(data, function () {
                    master.trigger(master.EVENTS.TIP_SHOW, {
                        message: self.model.TIPS.DEL_SUCCESS,
                        params: { delay: 3000 }
                    });
                    self.initData({ notip: true });
                }, function () {
                    master.trigger(master.EVENTS.TIP_SHOW, {
                        message: self.model.TIPS.OPERATE_ERROR,
                        params: { delay: 3000 },
                        className: "msgRed"
                    });
                });
            }, { icon: "i_warn", isHtml: true });

        },

        /**
         * 清除数据
        **/
        clearAll: function () {
            var self = this;
            var master = self.master;
            top.BH("disk_recycle_clear");
            top.$Msg.confirm(self.template.clearConfirm, function () {
                self.model.clearAll(function () {
                    master.trigger(master.EVENTS.TIP_SHOW, {
                        message: self.model.TIPS.CLEAR_SUCCESS,
                        params: { delay: 3000 }
                    });
                    self.initData({ notip: true });
                }, function () {
                    master.trigger(master.EVENTS.TIP_SHOW, {
                        message: self.model.TIPS.OPERATE_ERROR,
                        params: { delay: 3000 },
                        className: "msgRed"
                    });
                });
            }, { icon: "i_warn", isHtml: true });
        },

        setNavigation: function () {
            var self = this;
            var content = self.model.TIPS.RECYCLE_NOTIFY;
            self.getElement("navContainer").html(content);
        },

        /**
         * 重写父类方法，用于设置列表头信息
         * @param {Object} container  //设置区域容器
        **/
        setTabHeader: function (container) {
            var self = this;
            var content = self.template.tabHeader;
            content = $T.format(content, { cid: self.cid });
            container.append(content);
        },

        /**
         * 重写父类方法，用于设置列表正文信息
         * @param {Object} container  //设置区域容器
         * @param {Object} data  //展示数据
        **/
        setTabContent: function (container, data) {
            var self = this;
            var template = _.template(self.template.tableRow);
            container.empty().html(template(data));

            container.find("tr").unbind().click(function (e) {
                var me = $(this);
                var chkbox = null;

                if (e.target.tagName.toUpperCase() != "INPUT") {
                    chkbox = me.find("input[type='checkbox']")[0];
                    var checked = !chkbox.checked;
                    chkbox.checked = checked;
                } else {
                    chkbox = e.target;
                }

                if (chkbox.checked) {
                    me.addClass("trClick");
                } else {
                    me.removeClass("trClick")
                }

                // 设置选中数据
                self.model.setCheckedData({
                    data: [$T.Html.decode(me.data("id"))],
                    isChecked: chkbox.checked,
                    silent: true
                });

            }).hover(function (e) {
                $(this).addClass("trHover");

            }, function (e) {
                $(this).removeClass("trHover");
            }).live('contextmenu', function (e) {
                var row = $(this);
                self.showContextMenu(row, e);
                //屏蔽浏览器右键默认行为
                return false;
            });
        },

        /**
         * 显示右键菜单
         * @param {Object} target  //目标元素所在行或单元
         * @param {Object} e  //事件参数
        **/
        showContextMenu: function (target, e) {
            var self = this;
            if (!self.contextMenuEl)
                return;

            var id = $T.Html.decode(target.data("id"));
            var data = self.model.get("checkData") || [];

            //如果已经选择的项不包含自己，则需要清空已选择列表
            if (!_.contains(data, id)) {
                self.model.set({ checkData: null });
                // 设置选中数据
                self.model.setCheckedData({
                    data: [$T.Html.decode(target.data("id"))],
                    isChecked: true
                });
            }

            self.contextMenuEl.css({
                top: e.clientY,
                left: e.clientX
            }).show();
        },

        /**
         * 重写父类方法，用于设置列表正文信息
         * @param {Object} container  //设置区域容器
         * @param {Object} data  //展示数据
        **/
        setThumbContent: function (container, data) {
            var self = this;
            var template = _.template(self.template.thumbView);

            container.empty().html(template(data));
            container.find("li").unbind().click(function (e) {
                var me = $(this);
                var chkbox = null;
                if (e.target.tagName.toUpperCase() != "INPUT") {
                    chkbox = me.find("input[type='checkbox']")[0];
                    var checked = !chkbox.checked;
                    chkbox.checked = checked;
                } else {
                    chkbox = e.target;
                }
                if (chkbox.checked) {
                    me.addClass("listViewChecked");
                } else {
                    me.removeClass("listViewChecked")
                }

                // 设置选中数据
                self.model.setCheckedData({
                    data: [$T.Html.decode(me.data("id"))],
                    isChecked: chkbox.checked,
                    silent: true
                });

            }).hover(function (e) {
                var me = $(this);
                me.addClass("listViewHover");
                me.find("input[type='checkbox']").show();

            }, function (e) {
                var me = $(this);
                if (!me.hasClass("listViewChecked")) {
                    me.removeClass("listViewHover");
                    me.find("input[type='checkbox']").hide();
                }
            }).live('contextmenu', function (e) {
                self.showContextMenu($(this), e);
                //屏蔽浏览器右键默认行为
                return false;
            });;
        },

        /**
         * 重写父类方法，用于设置无数据时的提醒信息
         * @param {Object} container  //设置区域容器
         **/
        setEmptyTips: function (container) {
            var self = this;
            container.html(self.template.empty);
        },

        template: {
            //列表头
            tabHeader: [
                 '<th title="点击按名称排序" style="cursor:pointer" sort="name-desc"><span>文件名</span></th>',
                 '<th class="t-date wh5" title="点击按删除时间排序" style="cursor:pointer" sort="date-desc"><span>删除时间</span></th>',
                 '<th class="t-size wh6" title="点击按大小排序" style="cursor:pointer" sort="size-desc"><span>大小</span></th>'
            ].join(""),
            //列表项
            tableRow: [
                '<% _.each(obj, function(i){ %>',
                '<tr data-id="<%=_.escape(i.itemID)%>">',
                    '<td class="t-check wh1">',
                        '<input type="checkbox"/>',
                    '</td>',
                    '<td class="t-name" style="vertical-align: middle;">',
                        '<div class="fl p_relative">',
                            '<a href="javascript:void(0);" data-type="<%=i.type%>" class="<%=i.fileIcon%>"></a>',
                        '</div>',
                        '<a class="attchName" title="<%=_.escape(i.name)%>" data-type="<%=i.type%>"><span><%=_.escape(i.name)%></span></a>',
                    '</td>',
                    '<td class="t-date wh5" style="vertical-align: middle;"><%=i.deleteTime%></td>',
                    '<td class="t-size wh6" style="vertical-align: middle;"><%=i.size%></td>',
                '</tr>',
                '<% }) %>'
            ].join(""),

            thumbView: [
                '<% _.each(obj, function(i){ %>',
                '<ul>',
                    '<li class="listItem" data-id="<%=_.escape(i.itemID)%>" style="cursor: pointer">',
                        '<p class="chackPbar">',
                            '<input name="checkbox" type="checkbox" class="checkView" style="display: none;">',
                        '</p>',
					'<a class="viewPic">',
					    '<span class="spanimg">',
                            '<img data-type="<%=i.type%>" src="<%=i.fileThumb%>" title="<%=_.escape(i.name)%>" style="width: 65px; height:65px;">',
                        '</span>',
                    '</a>',
					'<div class="viewIntroduce">',
						'<p title="<%=_.escape(i.name)%>"><%=_.escape(i.shortName)%></p>',
					'</div>',
                    '</li>',
                '</ul>',
                '<% }) %>'

            ].join(""),

            //操作项目
            operation: [
                '<li class="mr_0">',
                    '<a id="{cid}_btnRestore" href="javascript:void(0)" class="btnTb">',
                        '<span class="p_relative">还原</span>',
                    '</a>',
                '</li>',
                '<li class="mr_0">',
                    '<a id="{cid}_btnDelete" href="javascript:void(0)" class="btnTb ml_6">',
                        '<span class="p_relative">彻底删除</span>',
                    '</a>',
                '</li>',
                '<li class="mr_0">',
                    '<a id="{cid}_btnClear" href="javascript:void(0)" class="btnTb ml_6">',
					    '<span class="p_relative">清空回收站</span>',
                    '</a>',
                '</li>'
            ].join(""),

            empty: [
                '<dl>',
                    '<dt>',
                        '<img src="../../images/module/networkDisk/rec-empty.png" />',
                    '</dt>',
                    '<dd>',
                        '<p class="fz_14">没有文件</p>',
                    '</dd>',
                    '<dd>',
                        '<p>您可以在这里找回60天内删除的文件！</p>',
                    '</dd>',
                '</dl>'
            ].join(""),

            contextMenu: [
                '<div id="{cid}_contextMenu" style="z-index: 9001; position: absolute; display:none;" class="menuPop shadow" bindAutoHide="0">',
			        '<ul>',
                        '<li index="1" cmd="delete" ><a href="javascript:;"><span class="text"><i class="icon i-deleteForever"></i>彻底删除</span></a></li>',
                        '<li index="2" cmd="restore" ><a href="javascript:;"><span class="text"><i class="icon i-restore"></i>还原</span></a></li>',
			        '</ul>',
		        '</div>'
            ].join(""),

            spaceLimit: [
                '<p>网盘容量不足，无法还原文件（夹）。</p>',
                '<p><a href="javascript:void(0)" onclick="top.$App.showOrderinfo()">升级邮箱，获取更大容量！</a></p>'
            ].join(""),

            clearConfirm: [
               '<p>确认清空回收站？</p>',
               '<p>清空后，文件将无法恢复。</p>'
            ].join(""),

            delConfirm: [
               '<p>确认彻底删除吗？</p>',
               '<p>删除后，文件将无法恢复。</a></p>'
            ].join("")
        }

    }));

    $(function () {
        new M2012.Disk.View.Recycle({ master: window.$Disk });
    });

})(jQuery, _, M139);