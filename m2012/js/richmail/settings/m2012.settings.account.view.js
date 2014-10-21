/**
    * @fileOverview 定义设置页账户View层的文件.
*/
/**
    *@namespace 
    *设置页账户View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Account.View', superClass.extend(//安全锁
    /**
    *@lends M2012.Settings.Account.View.prototype
    */
    {
    el: "#folderPassword",
    events: {
        "click #editLockArea": "editLockArea",
        "click #editPassword": "editPassword",
        "click #unLock": "unLock"
    },
    template: "",
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    initialize: function (options) {
        var self = this;


        this.model = new M2012.Settings.Account.Model(options);
        this.initEvents();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    checkBillSub: function (customData) {
        var folders = this.getTop().$App.getFolders();
        var foldLen = folders.length;
        var bill = false;
        var sub = false;
        $.each(customData, function (i, e) {
            if (e.fid == 8) {
                bill = true;
            }
            if (e.fid == 9) {
                sub = true;
            }
        })
        for (var n = 0; n < foldLen; n++) {
            if (folders[n].fid == 8 && bill == false) { //订阅中心和帐单中心
                customData.push(folders[n]);
            }
            if (folders[n].fid == 9 && sub == false) { //订阅中心和帐单中心
                customData.push(folders[n]);
            }
        };
        return customData;
    },
    /**
    *获取我的文件夹的数据,把数据绑定到模板上，再加载到HTML中。
    */
    render: function (type, trTem, tdTem, table, tr) {
        var _top = this.getTop();
        if (!_top || !_top.$App) {
            return;
        }
    
        var self = this;
        var anchor = $T.Url.queryString("anchor");
        var data = _top.$App.getFolders(type).concat([]);
        if (type == "custom") {
            data = this.checkBillSub(data);
        }
        var objAnchor = self.model.anchor[anchor];
        //var pm=appView.tabpageView.model; //父view的model，即模块管理类
        //this.el=pm.getModule(pm.get("currentModule")).element;//显示容器
        var templateStr = $("#" + trTem).val();
        var templateTd = $("#" + tdTem).val();
        var rp = new Repeater(templateStr);
        var rpTd = new Repeater(templateTd);
        if (!data) {
            return;
        } else {
            var arrTdInfo = self.createJsonData(type, data);
            var html = rp.DataBind(arrTdInfo); //数据源绑定后即直接生成dom
            if (arrTdInfo.length > 0) {
                $("#setLock").show();
                $("#setLock").prev().hide();
                $("#" + table).remove();
                $("#safelockTab").append(html);
            }
            for (var i = 0; i < arrTdInfo.length; i++) {
                var infoTd = arrTdInfo[i]["folderInfo"];
                var htmlTd = rpTd.DataBind(infoTd);
                $("#safelockTab ." + tr).eq(i).html(htmlTd);
            }
        }
        if (anchor && objAnchor && anchor == objAnchor["url"]) {
            var i = 100, b = objAnchor["id"];
            var timer = setInterval(function () {
                var a = $("#" + b);
                a = a.offset().top + a.height();

                document.body.scrollTop = a;
                if (document.body.scrollTop === 0) {
                    document.documentElement.scrollTop = a;
                }

                if (i--) {
                    clearInterval(timer);
                }
            }, 100);
        }
		//add by zhangsixue 理应有数据此值为1，但是。。。
		var passFlag = _top.$App.getView("folder").model.get("passFlag");
		var passFlags = $.map(_top.$App.getFolders().concat([]),function(num){
			return num["folderPassFlag"];
		});
		//当所有文件夹未未加密但是总属性显示加密的情况下发生，兼容服务端BUG!!!
		if(passFlags.join("").indexOf("1") == -1 && passFlag == 1){
			$("#setLock").show();
			$("#setLock").prev().hide();
			$("#" + table).remove();
		}
        return superClass.prototype.render.apply(this, arguments);
    },
    /**
    *把数据经过整理，以达到输出成多行3列的表格形式。
    格式2行3列：
    [
    {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]},
    {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]}
    ]
    */
    createJsonData: function (type, result) {
        var arrResponse = [];
        if (!result) {
            return;
        }
        else {
            var len = result.length;
            for (var n = 0; n < len; n++) {
                if (result[n].folderPassFlag == 1) {
                    arrResponse.push(result[n]);
                }
            }
            var num = 3;
            var arrTr = [];
            var arrTd = [];
            var arrTable = [];
            var arrData = [];
            var arrLen = arrResponse.length;
            var groups = Math.ceil(arrLen / num);
            var other = arrLen % num;
            for (var o = 0; o < arrLen; o++) {
                var name = pubName = arrResponse[o].name;
                if (type == "pop") {//如果是代收邮件
                    var name = pubName = arrResponse[o].email;
                    var foldername = arrResponse[o].name;
                    if (foldername.indexOf("@") > -1) {
                        var name = name.split("@")[1];
                        name = name.split(".")[0];
                        name = name + "邮箱";
                    } else {
                        name = foldername;
                    }
                }
                arrTr.push({
                    name: name,
                    mail: pubName
                })
            }
            if (other > 0) {//给多出来的单元格添加空数据
                for (var m = 0; m < num - other; m++) {
                    arrTr.push({
                        name: "",
                        mail: ""
                    })
                }
            }
            for (var i = 0; i < groups; i++) {
                var startNum = num * i;
                var endNum = num * (i + 1);
                arrTd.push({
                    folderInfo: arrTr.slice(startNum, endNum)
                });
            }
        }
        return arrTd;
    },
    /**
    *获取SID值
    */
    getSid: function () {
        var sid = $T.Url.queryString("sid");
        return sid;
    },
    /**
    *跳转到安全锁密码验证页面
    *type=edit表示是从修改加锁范围入口进来的。
    */
    editLockArea: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock.html?type=edit&sid=" + this.getSid();
    },
    /**
    *跳转到安全锁密码验证页面
    *type=editPassword表示是从修改安全锁密码入口进来的。
    */
    editPassword: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock_edit_password.html?type=editPassword&sid=" + this.getSid();
    },
    /**
    *跳转到安全锁密码验证页面
    *type=unlock表示是从关闭安全锁入口进来的。
    */
    unLock: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock.html?type=unlock&sid=" + this.getSid();
    },
    /**
    *在无安全锁的状态下点击入口进入设置安全锁的页面，初始状态无需要验证安全锁
    */
    initEvents: function () {
        if (!top.$App) {
            return;
        }

        this.mailTips();
        var self = this;
        var custom = top.$App.getFolders("custom").concat([]);
        var folders = top.$App.getFolders("pop");
        folders=folders.concat(custom);
        $("#setSafeLock").click(function () {
            if (folders.length == 0) {
                top.$Msg.alert(
                                self.model.messages.noFolderToLock,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                return
            }
            var model = $("#setSafeLock").attr("name");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            window.location = "account_lock.html?type=normal&sid=" + self.getSid();
        });
    },
    /**
    *错误提示信息
    */
    mailTips: function () {
        $("#popTable .gray").live("mouseover", function () {
            //var html = $(this).html();
            var self = this;
            var html = $(this).html();
            var appendHtml = '<span class="formError" style="position:absolute; line-height: 16px; ">' + html + '</span>';
            setTimeout(function () {
                $("#popTable .gray").next().remove();
                $(self).parent().append(appendHtml);
            }, 250)
        })
        $("#popTable .gray").live("mouseout", function () {
            var self = this;
            setTimeout(function () {
                $(self).next().remove();
            }, 250)
        });

    }
}));

})(jQuery, _, M139);



