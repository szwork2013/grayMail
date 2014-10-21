/**
    * @fileOverview 定义安全锁View层的文件.
*/
/**
    *@namespace 
    *设置页安全锁View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.SafeLock.View', superClass.extend(
        /**
        *@lends M2012.Settings.SafeLock.View.prototype
        */
        {
            template: "",
            initialize: function () {
                this.model = new M2012.Settings.SafeLock.Model();
                this.initEvents();
                return superClass.prototype.initialize.apply(this, arguments);
            },
            getTop: function () {
                return M139.PageApplication.getTopAppWindow();
            },
            render: function (type, trTem, tdTem, table, tr) {
                var self = this;
                var data = this.getTop().$App.getFolders(type);
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
                    $("#" + table).append(html);
                    var userTr = $("#safelockTab ." + tr);
                    for (var i = 0; i < arrTdInfo.length; i++) {
                        var infoTd = arrTdInfo[i]["folderInfo"];
                        var htmlTd = rpTd.DataBind(infoTd);
                        userTr.eq(i).html(htmlTd);
                    }
                    var userTrlen = userTr.find("td").length;
                    for (var m = 0; m < userTrlen; m++) {//当一行三列的表格的数据不够三列的时候，给无数据的单元格填充空的HTML，以覆盖模板里的checkbox复选框。
                        if (userTr.find("td").eq(m).text().trim()) {
                        } else {
                            userTr.find("td").eq(m).html("");
                        }
                    }
                };
                return superClass.prototype.render.apply(this, arguments);
            },
            renderSaveData: function () {
                this.model.firstLock(function (dataSource) {
                    if (dataSource["code"] == "FS_UNKNOWN") {
                        location.href = "account.html?sid=" + $T.Url.queryString("sid");
                    }
                })
            },
            /**
            *把数据经过整理，以达到输出成多行3列的表格形式。
            格式2行3列：
            [
            {
            folderInfo:[
            {name:"",email:""},
            {name:"",email:""},
            {name:"",email:""}
            ]
            },
            {
            folderInfo:[
            {name:"",email:""},
            {name:"",email:""},
            {name:"",email:""}
            ]
            }
            ]
            */
            createJsonData: function (type, result) {
                var len = result.length;
                var num = 3;
                var arrTr = [];
                var arrTd = [];
                var arrTable = [];
                var arrData = [];
                var groups = Math.ceil(len / num);
                var other = len % num;
                for (var o = 0; o < len; o++) {
                    var name = pubName = result[o].name;
                    if (type == "pop" && name.indexOf("@") > -1) {//如果是代收邮件
                        var name = pubName = result[o].email;
                        name = name.split("@")[1];
                        name = name.split(".")[0];
                        name = name + "邮箱";
                    }
                    arrTr.push({
                        name: name,
                        mail: pubName,
                        fid: result[o].fid
                    })
                }
                if (other > 0) {//给多出来的单元格添加空数据
                    for (var m = 0; m < num - other; m++) {
                        arrTr.push({
                            name: "",
                            mail: "",
                            fid: ""
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

                return arrTd;
            },
            getTemplate: function () {
                var model = $("#setFaceLock").attr("name");
                appView.showFrame(model);
                setModel.set({ "tabid": model });
            },
            /**
            *判断密码的输入正不正确，确定和取消按钮的事件响应，提交AJAX请求
            */
            initEvents: function () {
                this.model.checkPass();
                this.selectAll();
                this.mailTips();
                var self = this;
                $("#doOk").click(function () {
                    var success = self.model.get("checkSuccess");
                    if (success) {//密码验证成功，AJAX请求开关
                        self.model.set({
                            "ids": self.getCheckbox()
                        })
                        self.renderSaveData();
                    } else { //密码验证失败

                    }
                })
            },
            /**
            *获取选中的复选框fid，拼成数组
            */
            getCheckbox: function () {
                var userInput = $("#userTable").find("input:checked");
                var popInput = $("#popTable").find("input:checked");
                var userLen = userInput.length;
                var popLen = popInput.length;
                var arrFid = [];
                for (var i = 0; i < userLen; i++) {
                    var input = userInput.eq(i)
                    arrFid.push(parseInt(input.attr("fid")))
                }
                for (var i = 0; i < popLen; i++) {
                    var input = popInput.eq(i)
                    arrFid.push(parseInt(input.attr("fid")))
                }
                return arrFid;
            },
            /**
            *全选
            */
            selectAll: function () {
                $("#allUser").click(function () {
                    var userInput = $("#userTable").find("input");
                    if ($(this).attr("checked")) {
                        userInput.attr("checked", "true")
                    } else {
                        userInput.removeAttr("checked")
                    }

                });
                $("#allPop").click(function () {
                    var popInput = $("#popTable").find("input");
                    if ($(this).attr("checked")) {
                        popInput.attr("checked", "true")
                    } else {
                        popInput.removeAttr("checked")
                    }

                });
            },
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
        })
    );

    lockView = new M2012.Settings.SafeLock.View();
    lockView.render("pop", "setPopTemplate", "setPopTdTemplate", "popTable", "popTr");
    lockView.render("custom", "setUserTemplate", "setUserTdTemplate", "userTable", "userTr");

})(jQuery, _, M139);


