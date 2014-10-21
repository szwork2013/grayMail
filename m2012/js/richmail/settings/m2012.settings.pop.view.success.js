/**
* @fileOverview 定义设置页反垃圾的文件.
*/
/**
*@namespace 
*设置页反垃圾
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Success', superClass.extend(
    /**
    *@lends M2012.Settings.Pop.View.Success.prototype
    */
        {
        initialize: function (obj) {
            this.model = new M2012.Settings.Pop.Model();
            this.initEvents(obj);
            top.$App.trigger('reloadFolder', { reload: true });
            return superClass.prototype.initialize.apply(this, arguments);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *获取代收文件夹的数据,把数据绑定到模板上，再加载到HTML中。
        */
        render: function () {
            return superClass.prototype.render.apply(this, arguments);
        },
        saveAndReceive: function (obj) {
            var self = this;
            var initName = obj.folderName;
            $("#saveAndReceive").live("click", function () {
                //如果把代收邮件范围修改了，则修改账户信息 add by zhangsixue
                var flag = obj.flag;
                var thechoose = $("input[name='range1']:checked").val(); //用户选的值
                if (thechoose != flag) {
                    //如果修改了flag值，
                    if (thechoose == 1) {
                        BH({ key: 'set_pop_getmonth' });
                    } else if (thechoose == 2) {
                        BH({ key: 'set_pop_getsevenday' });
                    }
                    options2 = {
                        id: obj.popId,
                        status: 1
                    };
                    self.model.getPOPAccountsById(options2, function (res) {
                        var data = res["var"][0];
                        var obj2 = {
                            username: data["username"],
                            port: data["port"],
                            isSSL: data["isSSL"],
                            server: data["server"],
                            popType: data["popType"],
                            id: data["id"],
                            fid: data["fid"],
                            leaveOnServer: data["leaveOnServer"],
                            timeout: data["timeout"],
                            folderName: data["folderName"],
                            isAuto: data["isAutoPOP"] //add by zhangsixue
                        }
                        obj2.flag = thechoose;
                        var options = {
                            item: {
                                opType: "mod",
                                id: obj2.id,
                                server: obj2.server,
                                port: obj2.port,
                                popType: obj2.popType,
                                username: obj2.username,
                                leaveOnServer: obj2.leaveOnServer,
                                timeout: obj2.timeout,
                                fid: obj2.fid,
                                folderName: obj2.folderName,
                                isSSL: obj2.isSSL,
                                isAutoPOP: obj2.isAuto,
                                flag: thechoose
                            }
                        };
                        self.model.modPOPAccount(options, function (res) {
                            if (res["code"] == "S_OK") {
                                BH("set_pop_add");
                                var folderName = $("#folderName").val();
                                var source = self.getTop().$App.getFolders("pop");
                                var len = source.length;
                                var fid = source[len - 1].fid;
                                var options = {
                                    fid: fid,
                                    type: 1,
                                    name: folderName
                                }
                                var json = {
                                    id: null,
                                    status: "rename"
                                }
                                if (initName != folderName) {
                                    var checkName = top.$App.checkFolderName(folderName, json);
                                    if (!checkName) {
                                        return
                                    };
                                    self.model.updateFolders(options, function (res) {
                                        if (res["code"] == "S_OK") {
                                            self.getTop().$App.trigger('reloadFolder', { reload: true });
                                        }

                                    });
                                };
                                var data = {
                                    id: obj.popId
                                }

                                self.model.syncPOPAccount(data, function (dataSource) {
                                    //  add by zhangsixue
                                    if (thechoose == 0) {
                                        BH({ key: 'set_pop_getall' });
                                    }
                                    if (dataSource["code"] == "S_OK") {
                                        self.getTop().$App.trigger('reloadFolder', { reload: true });
                                        var sid = $T.Url.queryString("sid");
                                        window.location = "pop.html?sid=" + sid + "&type=successAndReceive";
                                    }
                                })

                            };
                        });
                    })
                } else {
                    BH("set_pop_add");
                    var folderName = $("#folderName").val();
                    var source = self.getTop().$App.getFolders("pop");
                    var len = source.length;
                    var fid = source[len - 1].fid;
                    var options = {
                        fid: fid,
                        type: 1,
                        name: folderName
                    }
                    var json = {
                        id: null,
                        status: "rename"
                    }
                    if (initName != folderName) {
                        var checkName = top.$App.checkFolderName(folderName, json);
                        if (!checkName) {
                            return
                        };
                        self.model.updateFolders(options, function (res) {
                            if (res["code"] == "S_OK") {
                                self.getTop().$App.trigger('reloadFolder', { reload: true });
                            }

                        });
                    };
                    var data = {
                        id: obj.popId
                    }

                    self.model.syncPOPAccount(data, function (dataSource) {
                        //  add by zhangsixue
                        if (thechoose == 0) {
                            BH({ key: 'set_pop_getall' });
                        }
                        if (dataSource["code"] == "S_OK") {
                            self.getTop().$App.trigger('reloadFolder', { reload: true });
                            var sid = $T.Url.queryString("sid");
                            window.location = "pop.html?sid=" + sid + "&type=successAndReceive";
                        }
                    })
                }
            })
        },
        /**
        *事件处理
        */
        initEvents: function (obj) {
            this.saveAndReceive(obj);
        }
    })
    );
})(jQuery, _, M139);


