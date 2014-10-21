
; (function ($, _, M139) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.ShareRecive";

    M139.namespace(_class, superClass.extend({
        name: _class,

        model: null,

        common: null,

        initialize: function () {
            var self = this;

            self.common = new M2012.Disk.Share.Common();
            self.model = new M2012.Disk.Model.ShareRecive({
                common: self.common
            });

            $(window).resize(function () {
                self.adjustHeight();
            });

            //绑定事件监听
            self.initEvents();
            //呈现视图
            self.render();

            superClass.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;

            self.model.on("change", function () {

                //监测文件夹访问路径，实时改变导航信息
                if (self.model.hasChanged("navs")) {

                    self.setNavigate();
                    self.render();
                }
                    // 监控选择项的变化
                else if (self.model.hasChanged("checkData")) {

                    self.setCheckedUI();
                }
                    //监控排序字段的变化
                else if (self.model.hasChanged("sortExp")) {
                    self.setSortting();
                    //排序数据
                    self.model.sortData();
                    //重新向视图填充数据
                    self.fillData();
                }
                    //监听页码变化实现数据翻页加载
                else if (self.model.hasChanged("pageIndex")) {
                    self.fillData();
                }
            });


            //监控操作提示信息
            self.model.on(self.model.EVENTS.SHOW_TIPS, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

            //设置排序相关UI点击
            self.setSortUI();

            //下载
            $("#btnDown").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.download();
            });

            //存彩云
            $("#btnCopy").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.copyToDisk();

            });

            //删除
            $("#btnDelete").click(function (e) {
                var me = $(this);

                if (self.common.isLocked(me))
                    return;

                self.delFiles();
            });

            //点击导航切换视图
            $("#navContainer").click(function (e) {
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
                    self.model.setNavigate(data);
                }
            });

            //全选
            $("#cbSelectAll").click(function (e) {
                var me = this;
                var ids = [];
                //查找所有id
                $("#tblist").find("tr[data-shareid]").each(function () {
                    var row = $(this);
                    if (row.attr("system"))
                        return true;
                    ids.push($T.Html.decode(row.data("shareid")));
                });

                // 设置选中数据
                self.model.setCheckedData({
                    data: ids,
                    isChecked: me.checked
                });

            });

            //列表行点击事件
            $("#tblist").click(function (e) {
                //点击文件图标
                var el = $(e.target);
                var rowEl = el.closest("tr");
                var shareId = rowEl.data("shareid");
                shareId = shareId ? $T.Html.decode(shareId) : "";

                if (!shareId)
                    return;

                if (el.attr("sharetype")) {

                    //锁定元素防止短时间内重复点击
                    if (self.common.isLocked(el))
                        return;

                    var obj = self.model.getShareObj(shareId);
                    if (!obj)
                        return;

                    switch (el.attr("sharetype")) {
                        //文件夹
                        case self.common.shareObjTypes.DIR:
                            var isSystem = rowEl.attr("system");
                            self.model.setNavigate({
                                dirId: shareId,
                                path: obj.path,
                                isSystem: isSystem,
                                dirName: obj.shareObjName
                            });
                            break;
                            //文件
                        case self.common.shareObjTypes.FILE:
                            var file = {
                                thumbnailURL: obj.thumbnailUrl || "",
                                bigthumbnailURL: obj.bigThumbnailUrl || "",
                                presentURL: obj.presentURL || obj.presentLURL || obj.presentHURL,
                                name: obj.shareObjName,
                                id: obj.shareObjId,
                                size: obj.shareFileSize || 0,
                                path: self.model.getCurDirPath()
                            };
                            self.common.previewFile(file);
                            break;
                    }
                    return;
                }

                //如果点击了checkbox
                if (el.attr("type") === "checkbox") {
                    self.model.setCheckedData({
                        data: [shareId],
                        isChecked: el.get(0).checked,
                        silent: true
                    });
                }

            });
        },

        /**
         * 设置排序相关UI操作
        **/
        setSortUI: function () {
            var self = this;
            var sortMenus = $("#sortMenus");

            //页面点击后关闭排序选择面板
            $(document.body).bind("click", function () {
                sortMenus.addClass("hide");
            });

            //点击排序展示排序菜单
            $("#btnSort").click(function (e) {
                var me = $(this);
                var offset = me.offset();
                top.BH('caiyunSort');
                M139.Event.stopEvent(e);
                sortMenus.removeClass("hide").css({
                    top: offset.top + me.height() + 5,
                    left: offset.left + me.outerWidth() - sortMenus.outerWidth()
                });

            });

            //排序菜单
            sortMenus.find("li").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (me.hasClass("cur")) {
                    if (sort.indexOf("asc") > -1) {
                        sort = sort.replace("asc", "desc");
                    }
                    else {
                        sort = sort.replace("desc", "asc");
                    }
                }

                self.model.set({ sortExp: sort });
            });

            //表头点击排序
            $("#tbl_th").find("th").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (!sort)
                    return;

                if (me.attr("cur")) {
                    if (sort.indexOf("asc") > -1)
                        sort = sort.replace("asc", "desc");
                    else
                        sort = sort.replace("desc", "asc");
                }

                self.model.set({ sortExp: sort });
            });
        },

        /**
         * 设置排序箭头
       **/
        setSortting: function () {
            var self = this;
            var sort = self.model.get("sortExp");
            var spliter = sort.split("-");
            var field = spliter[0];
            var isAsc = spliter[1] == "asc";

            //设置排序菜单栏选择项
            $("#sortMenus").find("li").removeClass("cur")
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

            $("#tbl_th").find("th").removeAttr("cur")
                .find("span.t-arrow").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<span class=\"t-arrow\">{0}</span>";
                        html = $T.format(html, [isAsc ? "↑" : "↓"]);
                        //设为当前选择列并追加排序标示箭头
                        me.attr({
                            cur: 1,
                            sort: sort
                        }).append(html);
                        return false;
                    }
                });
        },

        /**
         * 设置选中项选中状态
        **/
        setCheckedUI: function () {
            var self = this;
            var data = self.model.get("checkData");
            data = data || [];

            $("#tblist").find("tr[data-shareid]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("shareid"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                }

            });

        },

        /**
        * 初始化分页控件值
       **/
        setPager: function () {
            var self = this;
            var container = $("#dv_pager");

            //清空之前创建的分页控件
            container.empty();

            //添加分页控件
            self.pager = M2012.UI.PageTurning.create({
                container: container,
                styleTemplate: 2,
                maxPageButtonShow: 5,
                pageSize: self.model.get("pageSize"),
                pageIndex: self.model.get("pageIndex"),
                pageCount: self.model.get("pageCount")
            }).unbind("pagechange").bind("pagechange", function (index) {
                top.BH("caiyunPageN");
                self.model.set({
                    pageIndex: index
                });
            });

        },

        /**
         * 设置导航路径信息
         */
        setNavigate: function () {
            var self = this;
            var html = $("#tplNavigation").html();
            var template = _.template(html);
            var data = self.model.get("navs");
            $("#navContainer").html(template(data));
        },

        /**
         * 页面高度自适应
         */
        adjustHeight: function () {
            var self = this;
            var container = $("#tbl_body");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },

        /**
      * 呈现视图
      */
        render: function () {
            var self = this;

            //清空列表
            $("#tbl_th").removeClass("hide");
            $("#tbl_body").removeClass("hide");
            $("#dv_nofile").addClass("hide");
            $("#tblist").empty();

            //设置页面导航信息
            self.setNavigate();

            self.adjustHeight();

            //还原选中项的默认状态
            $("#cbSelectAll").removeAttr("checked");
            self.model.set({ checkData: [] }, { silent: true });

            //通知UI显示数据加载中
            self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                message: self.model.TIPS.DATA_FETCHING,
                params: { delay: 15000 }
            });

            self.model.fetch(function (data) {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);

                //没有数据时的显示
                if (!data || data.length === 0)
                    self.showNothing();

                self.setPager();
                self.fillData();

            }, function () {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);
                //没有数据时的显示
                self.showNothing();

                self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                    message: self.model.TIPS.FETCH_DATA_ERROR,
                    params: {
                        delay: 3000,
                        className: "msgRed"
                    }
                });
            });
        },

        /**
        * 设置导航路径信息
        */
        fillData: function () {
            var self = this;
            var data = self.model.filterData();
            var container = $("#tblist").empty();

            if (data && data.length > 0) {
                var html = $("#tplShareList").html();
                var template = _.template(html);
                container.html(template(data));

                //还原选中项状态
                $("#cbSelectAll").removeAttr("checked");
                self.setCheckedUI();
            }
        },

        /**
         * 下载
        **/
        download: function () {

            var self = this;
            var data = self.model.getCheckedFiles();

            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            top.BH("diskv2_download_package");

            self.common.download({
                directoryIds: data.checkedDirIds,
                fileIds: data.checkedFids,
                isFriendShare: 1,
                path: self.model.getCurDirPath(),
                success: function (url) {
                    $("#downloadFrame", window.parent.document).attr('src', url);
                },
                error: function () {
                    var tip = self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(tip, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
            });
        },

        /**
         * 存彩云网盘
        **/
        copyToDisk: function () {
            var self = this;
            var contents = self.model.getCopyToFiles();

            if (!contents) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            new top.M2012.UI.Dialog.SaveToDisk({
                data: contents,
                type: 'shareCopy'
            }).render();
        },

        /**
         * 删除文件
         */
        delFiles: function () {
            var self = this;
            var data = self.model.getCheckedFiles();

            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            //判断是否子目录，子目录下不允许删除
            var navs = self.model.get("navs");
            if (navs && navs.length > 0) {
                var mssage = self.model.TIPS.SUBDIR_CANNOTDEL;
                self.common.showTips(mssage);
                return;
            }

            var fileCount = data.checkedFids.length;
            var dirCount = data.checkedDirIds.length;

            //获取确认提示语
            var message = "";
            var TIPS = self.model.TIPS;
            if (fileCount > 0 && dirCount > 0) {
                message = $T.format(TIPS.DELETE_FILEANDDIR, [dirCount, fileCount]);

            } else if (fileCount > 0) {
                message = $T.format(TIPS.DELETE_FILE, [fileCount]);

            } else if (dirCount > 0) {
                message = $T.format(TIPS.DELETE_DIR, [dirCount]);
            }

            top.$Msg.confirm(message, function () {
                self.model.delFiles({
                    checkedDirIds: data.checkedDirIds,
                    checkedFids: data.checkedFids,
                    success: function () {
                        self.render();
                    },
                    error: function () {
                        var tip = self.model.TIPS.OPERATE_ERROR;
                        top.M139.UI.TipMessage.show(tip, {
                            delay: 3000,
                            className: "msgRed"
                        });
                    }
                });

            }, function () {

            }, {
                buttons: ["是", "否"]
            });

        },

        /**
         * 没有信息时的展示
         */
        showNothing: function () {

            $("#dv_nofile").removeClass("hide");
            $("#tbl_th").addClass("hide");
            $("#tbl_body").addClass("hide");
        }

    }));


})(jQuery, _, M139);
