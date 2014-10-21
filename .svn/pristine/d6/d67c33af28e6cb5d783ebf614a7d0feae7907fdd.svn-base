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
    M139.namespace('M2012.Settings.SafeLock.View.Pop', superClass.extend(
    /**
    *@lends M2012.Settings.SafeLock.View.Pop.prototype
    */
        {
        template: "",
        initialize: function () {
            this.mailTips();
            this.model = new M2012.Settings.SafeLock.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        render: function () {
            var self = this;
            var data = this.getTop().$App.getFolders("pop");
            var type = $T.Url.queryString("type");
            if (!data) {
                return;
            } else {
                if (type == "edit") {
                    this.folderNoLock(data);
                    var len = data.length;
                    for (var n = 0; n < len; n++) {
                        if (data[n].folderPassFlag == 1) {
                            $("#popTable tbody input").eq(n).attr("checked", true);
                            $("#verifyPasswordLi").removeClass("hide");
                            $("#passwordLi,#confirmPasswordLi").remove();
                            var h2Html = $("#setAreaH2").html();
                            var text = h2Html.replace("安全锁", "修改加锁范围");
                            $("#setAreaH2").html(text);
                        }
                    }
                    $("#verifyPass").focus();
                }
                else if (type == "unlock") {
                    $("#lockAreaLi").remove();
                    $("#verifyPasswordLi").removeClass("hide");
                    $("#verifyPass").focus();
                }
                else {
                    if (!this.model.checkLockFolder()) {
                        this.folderNoLock(data);
                    }
                    else {
                        this.folderHasLock(data);
                    }
                }
            };
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
        *有加锁文件夹
        */
        folderHasLock: function (data) {
            var len = data.length;
            var newData = [];
            for (var n = 0; n < len; n++) {
                if (data[n].folderPassFlag == 1) {
                    newData.push(data[n])
                }
            }
            var newLen = newData.length;
            if (newLen == 0) {
                $("#popTable").remove();
                return
            }
            this.dataToHtml(newData);
        },
        /**
        *无加锁文件夹
        */
        folderNoLock: function (data) {
            this.dataToHtml(data);
            $("#safelockTab input[type=checkbox]").removeClass("hide");
            $("#passwordLi,#confirmPasswordLi").removeClass("hide");
            $("#lockAreaText").html("加锁范围：");
            $("#setBtn").html(this.model.unLockHtml());
        },
        dataToHtml: function (data) {
            var templateStr = $("#setPopTemplate").val();
            var templateTd = $("#setPopTdTemplate").val();
            var rp = new Repeater(templateStr);
            var rpTd = new Repeater(templateTd);
            var arrTdInfo = this.createJsonData(data);
            var html = rp.DataBind(arrTdInfo); //数据源绑定后即直接生成dom
            $("#popTable tbody").append(html);
            var userTr = $("#safelockTab .popTr");
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
            if ($("#popTable tr").length == 1) {
                $("#popTable").remove();
            }
        },
        /**
        *把数据经过整理，以达到输出成多行3列的表格形式。
        格式2行3列：
        [
        {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]},
        {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]}
        ]
        */
        createJsonData: function (result) {
            var len = result.length;
            var num = 3;
            var arrTr = [];
            var arrTd = [];
            var arrTable = [];
            var arrData = [];
            var groups = Math.ceil(len / num);
            var other = len % num;
            for (var o = 0; o < len; o++) {
                var name = pubName = result[o].email;
                var foldername = result[o].name;
                if (foldername.indexOf("@") > -1) {
                    name = $Email.getDomain(name);
                    name = name.split(".")[0];
                    name = name + "邮箱";
                } else {
                    name = foldername;
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
        /**
        *显示完整的邮箱地址TIPS
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
    })
    );

    lockViewPop = new M2012.Settings.SafeLock.View.Pop();
    lockViewPop.render();

})(jQuery, _, M139);


