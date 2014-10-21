/**
* @fileOverview 定义设置页邮件分类-快速分类的文件.
*/
/**
*@namespace 
*设置页邮件分类-快速分类
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Classify.View.Fast', superClass.extend(
    /**
    *@lends M2012.Settings.Classify.View.Fast.prototype
    */
    {
    el: "body",
    events: {
        "click #btn_save": "rebuildData",
        "click #btn_cancel": "goBack"
    },
    goBack: function () {
        var sid = $T.Url.queryString("sid");
        location.href = "sort_new.html?sid=" + sid;
    },
    initialize: function () {
        this.model = new M2012.Settings.Classify.Model();
        this.initEvents();
        this.model.getSortId();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    render: function () {
        this.getFilterList();
        return superClass.prototype.render.apply(this, arguments);
    },
    initEvents: function () {
        $("#historyMail").click(function () {
            var This = $(this);
            if (This.attr("checked")) {
                $(".mailText").addClass("hide");
                $(".mailTotal").removeClass("hide");
            } else {
                $(".mailText").removeClass("hide");
                $(".mailTotal").addClass("hide");
            }
        })
    },
    /**
    *逻辑判断，打开页面时需要展示的数据。
    */
    getFilterList: function () {
        var self = this;
        var nameArr = [];
        this.model.set({ "total": 10 }); //快速创建分类规则，最多10条规则
        var mailBoxCounts = this.getTop().$App.getFolders("system")[0].stats.messageCount;
        $("#mailCouts").html(mailBoxCounts);
        this.model.statMessages(function (data) {
            try {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].from == "") {
                        data.splice(i, 1);
                    }
                }
            } catch (e) { }
            var templateStr = $("#sortFastTemplate").val();
            var rpph = new Repeater(templateStr);
            rpph.Functions = {
                getName: function () {
                    var name = this.DataRow["name"] == "" ? top.$App.getAddrNameByEmail(this.DataRow["from"]) : this.DataRow["name"];
					name = name.replace(/"/g,"");
                    if (M139.Text.Utils.getBytes(name) > 16) {
                        name = name.substring(0, 16);
                        var str = name.match(/[^\x00-\xff]/ig);
                        if (str != null) {
                            name = name.substring(0, 8)
                        }
                    }
                    name = M139.Text.Html.encode(name);
                    return name
                }
            }
            var html = rpph.DataBind(data);
            $("#sortFasttb").html(html);
        });
    },
    /**
    *组装要提交的数据。
    */
    rebuildData: function () {
        var self = this;
        var isChecked = $("input[name=checked]");
        var checkedLen = isChecked.length;
        var data = [];
        var arrName = [];
        var obj = {};
        var history = $("#historyMail").attr("checked") ? 2 : 0;
        var createData = [];
        var folderArr = [];
        var folders = top.$App.getFolders("system");
        var pop = top.$App.getFolders("pop");
        folders = folders.concat(top.$App.getFolders("custom"));
        folders = folders.concat(pop);

        for (var p = 0; p < folders.length; p++) {
            folderArr.push(folders[p].name)
        }
        for (var n = 0; n < checkedLen; n++) {
            if (isChecked.eq(n).attr("checked")) {
                var from = $(".mailFrom").eq(n).text();
                var total = $(".mailTotal").eq(n).text();
                var name = $(".folderName").eq(n).val();
                name = name.replace(/(^\s*)|(\s*$)/g, "");
                var num = $.inArray(name, folderArr);
                if (num == -1) {
                    createData.push(folders[num])
                    var checkFolder = top.$App.checkFolderName(name);
                    if (!checkFolder) {
                        return
                    }
                    arrName.push(name);
                }
                obj = {
                    from: from,
                    total: total,
                    name: name,
                    history: history
                }
                data.push(obj);
            }
        }
        for (var t = 0; t < arrName.length; t++) {
            for (j = t + 1; j < arrName.length; j++) {
                if (arrName[t] == arrName[j]) {
                    arrName.splice(t, 1);
                    t--;
                }
            }
        }
        top.$App.addFolders(arrName, function (res) {
            if (res) {
                var arrFolder = [];
                for (var i = 0; i < data.length; i++) {
                    var folder = top.$App.getFolderByFolderName(data[i].name);
                    arrFolder.push(folder)
                }
                self.setFilter(data, arrFolder);
            }
        });
    },
    ruleMoreThan100: function (len) {
        var dataLen = this.model.get("dataLen");
        if (dataLen+len > 100) {
            top.$Msg.alert(
                            this.model.messages.moreThan100,
                            {
                                dialogTitle: "系统提示",
                                icon: "warn"
                            });
            return;
        }
        return true
    },
    /**
    *建立分拣规则。
    */
    setFilter: function (data, folder) {
        var self = this;
        var len = data.length;
        var folderName = $("input[type=text]");
        if (len == 0) {
            self.getTop().$Msg.alert(
                        self.model.messages.selectRule,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
            return;
        }
        var status = this.ruleMoreThan100(len);
        if (!status) {
            return
        }
        this.model.fastCreateFilter(folder, data, len, function (res) {
            if (res["code"] == "S_OK") {
                top.M139.UI.TipMessage.show("收信创建成功", { delay: 2000 });
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                self.goBack();
            } else {
                self.getTop().$Msg.alert(
                        self.model.messages.sortCreateFail,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                return;
            }

        });
    }
})
);
var fastCreateView = new M2012.Settings.Classify.View.Fast();
fastCreateView.render();
})(jQuery, _, M139);