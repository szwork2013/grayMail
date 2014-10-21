var recordProperty = {
    //接口地址
    url: {
        //新建
        getCreateRecordUrl: function() {
            return DiskTool.resolveUrl("addDiskMusicClass", true);
        },

        //重命名
        getRenameUrl: function() {
            return DiskTool.resolveUrl("renameDiskMusicClass", true);
        }
    },

    //提示语
    messages: {
        LoseInfo: "信息丢失，请重试",
        Empty: "专辑名称不能为空",
        MaxLength: "最大长度不能超过20字符",
        RepeatDirName: "专辑名称不能重复",
        Exception: "创建专辑失败，请稍后再试。",
        ExceedMax: "最多只允许新建10个专辑"
    },

    //音乐列表窗体
    parent: DiskTool.getDiskWindow(),

    //事件处理
    action: {
        pageLoad: function() {
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");
            $(function() {
                $("p.dialog-error-tip").hide();
                //窗口自适应高度
                DiskTool.DialogAuto();
                var optype = recordProperty.tool.getType();
                var mapper = {
                    aCancel: function() {
                        top.FloatingFrame.close();
                    },
                    aSumbit: function() {
                        if (optype == 2) {
                            recordProperty.action.rename();
                            return;
                        }
                        recordProperty.action.create();
                    }
                };
                //注册事件
                DiskTool.registerAnchor(mapper, function(val) { return val; });

                //重命名时需初始化页面
                if (optype == 2) {
                    recordProperty.action.initial();
                }
            });
        },

        //初始化页面内容
        initial: function() {
            var model = recordProperty.tool.getCurrentRecord();
            //无法获取当前专辑信息时关闭窗口
            if (!model) {
                var message = recordProperty.messages.LoseInfo;
                DiskTool.FF.alert(message, function() {
                    top.FloatingFrame.close();
                });
                return;
            }
            //设置页面信息
            $(".h").css("display", "block");
            $(":text").val(model.className).data("data", model.className);
            $("#tdFileInfo").html("共有{0}个音乐文件".format(model.fileCount));
            $("#tdTime").html(DiskTool.formatDate(model.createTime));
            $("#tdPos").html("\\我的音乐\\{0}".format(Utils.htmlEncode(model.className)));
        },

        //创建文件夹
        create: function() {
            var name = $.trim($(":text").val());
            var type = recordProperty.tool.getType();

            //验证名称
            var invalidMsg = recordProperty.tool.validateRecordName(name, type);
            if (invalidMsg && invalidMsg.length > 0) {
                $("#errorMsg").html(invalidMsg);
                $("p.dialog-error-tip").show();
                //重新计算高度
                setTimeout(function () {
                    top.$Msg.getCurrent().resetHeight();
                }, 100);
                return;
            }

            //请求服务器执行新建专辑操作
            recordProperty.server.create(name, function() {
                DiskTool.addDiskBehavior({
                    actionId: 33,
                    moduleId: 11,
                    actionType: 10
                });
                recordProperty.parent.music.tool.refreshList();
                top.FloatingFrame.close();
            });

        },

        //重命名
        rename: function() {
            var name = $.trim($(":text").val());
            var orgName = $(":text").data("data");
            var rid = recordProperty.tool.getRecordId();
            var type = recordProperty.tool.getType();

            //名称没变则直接关闭窗体
            if (name == orgName) {
                top.FloatingFrame.close();
                return;
            }

            //验证名称
            var invalidMsg = recordProperty.tool.validateRecordName(name, type);
            if (invalidMsg && invalidMsg.length > 0) {
                $("#errorMsg").html(invalidMsg);
                $("p.dialog-error-tip").show();
                return;
            }

            //请求服务器执行重命名专辑操作
            recordProperty.server.rename(rid, name, function() {
                DiskTool.addDiskBehavior({
                    actionId: 35,
                    moduleId: 11,
                    actionType: 10
                });
                recordProperty.parent.Toolbar.refreshList();
                top.FloatingFrame.close();
            });
        }
    },

    //服务器请求
    server: {
        //新建
        create: function(name, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return
            };
            $.postXml({
                url: recordProperty.url.getCreateRecordUrl(),
                data: XmlUtility.parseJson2Xml({
                    musicClassName: name
                }),
                success: function() {
                    //处理album数据
                    if (this.code == DiskConf.isOk) {
                        if (callback) { callback(); }
                    }
                    else { DiskTool.FF.alert(this.summary); }
                },
                error: function(error) { DiskTool.handleError(error); }
            });
        },

        //重命名
        rename: function(cid, name, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return
            };
            $.postXml({
                url: recordProperty.url.getRenameUrl(),
                data: XmlUtility.parseJson2Xml({
                    musicClassId: cid,
                    musicClassName: name
                }),
                success: function() {
                    //处理album数据
                    if (this.code == DiskConf.isOk) {
                        if (callback) { callback(); }
                    }
                    else { DiskTool.FF.alert(this.summary); }
                },
                error: function(error) { DiskTool.handleError(error); }
            });
        }
    },

    //工具类
    tool: {

        //用户标识sid
        getUserInfo: function() {
            var key = "cacheUid";
            if (!window[key]) {
                var url = window.location.href;
                window[key] = Utils.queryString("sid", url);
            }
            return window[key];
        },

        //专辑id
        getRecordId: function() {
            var key = "cacheRid";
            if (!window[key]) {
                var url = window.location.href;
                window[key] = Utils.queryString("id", url);
            }
            return window[key];
        },

        /*操作类型
        * 1: 创建专辑
        * 2: 修改专辑
        */
        getType: function() {
            var key = "cacheType";
            if (!window[key]) {
                var url = window.location.href;
                var val = Utils.queryString("type", url);
                window[key] = val ? val : 1;
            }
            return window[key];
        },

        //获取当前操作专辑
        getCurrentRecord: function() {
            var key = "cacheRecord";
            if (!window[key]) {
                var rid = recordProperty.tool.getRecordId();
                var cacheData = recordProperty.parent.music.cacheData.classList;
                $.each(cacheData, function() {
                    if (this.classId == rid) {
                        window[key] = this;
                        return false;
                    }
                })
            }
            return window[key];
        },

        /*验证专辑名称
        * name: 专辑名称
        * type: 类型 1:新建 2:重命名
        */
        validateRecordName: function(name, type) {
            name = name ? $.trim(name) : "";
            if (name.length == 0) {
                return recordProperty.messages.Empty;
            }
            //查看长度
            if (name.length > 20) {
                return recordProperty.messages.MaxLength;
            }
            //验证专辑名称是否重名
            var rid = recordProperty.tool.getRecordId();
            var cacheData = recordProperty.parent.music.cacheData.classList;
            var isRepeat = false;
            $.each(cacheData, function() {
                if (this.className == name) {
                    if (type == 1 || (type == 2 && this.classId != rid)) {
                        isRepeat = true;
                    }
                    if (isRepeat) return false;
                }
            });
            if (isRepeat) {
                return recordProperty.messages.RepeatDirName;
            }
            return DiskTool.validateName(name);
        }
    }
};

//页面加载
recordProperty.action.pageLoad();