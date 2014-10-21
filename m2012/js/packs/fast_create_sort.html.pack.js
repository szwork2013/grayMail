/**
* @fileOverview 定义设置页邮件分类的文件.
*/


(function (jQuery, _, M139) {

    /**
    *@namespace 
    *设置页邮件分类
    */
    M139.namespace('M2012.Settings.Classify.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Classify.Model.prototype
    */
    {
    defaults: {
        options: {
            items: [{
                onOff:0,
                opType: "add",
                name: "cx",
                ignoreCase: 1,
                conditionsRelation: 1,
                dealHistoryMail: 0,
                rulePiority: 1,
                filterId: -1,
                dealType: 3,
                ruleType: 3,
                folderId: 0,
                //forwardAddr: "sfsdf@163.sdf",
                forwardBakup: 0
            }]
        },
        advancedMode:false,//判别是否是高级模式
        moveToFolder: null,//数据保存 移动到文件夹  fid
        attachLabel: null, //数据保存 标记为标签  fid
        forwardAddr: null, //数据保存 自动转发的地址
        total: 5,//邮件排行榜默认取5条数据
        fastSortData: null,
        maxSortId: null, //保存分类id的最大值 用于排序
        getData: null,
        createName: null,
        content: null,
        fromType: 1,
        toType: 1,
        subjectType: 1,
        attachType:1,
        mailSizeType:1,
        mailRectimeType:1,
        mailRectimeStart:"00:00:00",
        mailRectimeEnd:"00:00:00",
        rebuildData: null,
        nameArr: null,
        conditionsRelation: 1,
        toRelation:0,
        subjectRelation:0,
        attachRelation:0,
        forwardVerify:0,//自动转发地址是否已验证
        dataLen:null//保存分类的条数 用于判断是否大于100条收信规则
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    messages: {
        selectRule: '请勾选要创建的收信规则',
        moreThan100: '你要创建的收信规则已达到100个的上限，请删除不必要的收信规则后再试',
        forwardAddrNull: '转发地址不能为空',
        autoReplyNull: '自动回复内容不能为空',
        filterConditionsNull: '请至少设置一项条件',
        performRuleNull: '请至少选择一项操作',
        inputTextNull: '输入框里的内容不能为空',
        mailAddrError: '请输入完整的Email地址，如zhangsan@example.com',
        mailDomainError: '请输入正确的域名地址，如@example.com',
        mailSizeError: '邮件大小请填写正整数',
        maxMailFromLen: '发件人和发件域名加起来不能超过10个',
        maxMailToLen: '收件人最多输入10个Email地址',
        folderNameError: '不能有相同的文件夹名字',
        sortCreateSucceed:'收信规则创建成功',
        sortCreateFail: '遇到异常，收信规则创建失败，请重试',
        autoReplyContentMax: '自动回复内容大小超过限制',
        filterConditionsMax: '只支持过滤一种条件',
        accountListError:'请选择适用帐号'


    },
    /**
    *获取排序的ID，接口会改成在后动自动排序，不需要传递sortId。
    */
    getSortId: function () {
        var self = this;
        this.getFilter_139(function (datasource) {
            datasource = datasource["var"];
            var max = 0;
            $.each(datasource, function (i, o) {
                max = Math.max(max, o.sortId);
            });
            self.set({ "maxSortId": max,"dataLen":datasource.length });
        });
    },
    callApi: M139.RichMail.API.call,
    /**
    *邮件发送排行数据
    */
    statMessages: function (callback) {
        var options = {
            startTime: 0,
            endTime: 13284989480,
            minSendNumber: 10,
            total: this.get("total")//排名前5的发件人
        };
        $RM.statMessages(options, function (result) {
            callback(result["var"]);
        });
    },
    /*
    *分拣规则的获取  139专用接口
    */
    getFilter_139: function (callback) {
       var tmpObj = {
            filterFlag: 0,
            reqFrom: 0
        };
        this.callApi("user:getFilter_139", tmpObj, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    /**
    *分拣规则的建立 139专用接口
    */
    setFilter_139: function (options, callback) {
        var self = this;
        self.callApi("user:setFilter_139", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
        
    },

    /**
    *分拣规则的获取  新接口
    */
    getFilter_New: function (callback) {
        $RM.getFilter_New(function (result) {
            callback(result);
        });
    },
    /**
    *分拣规则的建立 新接口
    */
    setFilter_New: function (options, callback) {
        var self = this;
        $RM.setFilter_New(options, function (result) {
            callback(result);
            self.getTop().appView.trigger('reloadFolder', { reload: true });
        });
    },
    /**
    *分拣规则的获取 老接口
    */
    getFilter: function (callback) {
        $RM.getFilter(function (result) {
            callback(result["var"]);
        });
    },
    /**
    *分拣规则的建立 老接口
    */
    setFilter: function (options, callback) {
        var self = this;
        $RM.setFilter(options, function (result) {
            callback(result);
            self.getTop().appView.trigger('reloadFolder', { reload: true });
        });
    },
    /**
    *快速创建收信规则
    */
    fastCreateFilter: function (folder, fastSortData, len, callback) {
        var self = this;
        var data = [];
        var sortId = self.get("maxSortId") + 1;
        for (var i = 0; i < len; i++) {
            var fid = folder[i].fid;
            var obj = {
                func: "user:setFilter_139",
                "var": {
                    onOff: 0,
                    opType: "add",
                    name: "cx",
                    ignoreCase: 1,
                    conditionsRelation: 2,
                    dealHistoryMail: fastSortData[i].history,
                    rulePiority: 1,
                    filterId: -1,
                    fromType: 1,
                    sortId: sortId++,
                    from: fastSortData[i].from,
                    dealType: 2,
                    folderId: 1,
                    moveToFolder: fid
                }
            };
            data.push(obj);

        }
        this.callApi("global:sequential2", { items: data }, function (res) {
            callback(res.responseData);
        });
    },
    /**
    *获取文件夹列表
    */
    getAllFolders: function (callback) {
        $RM.getFolderList(function (result) {
            callback(result["var"]);
        });

    },
    getImageCode: function(callback){
            this.callApi("user:getImageCode",{},function(res){
                callback && callback(res);
            })
        
        },
    getFilterType: function (type) {
        var arrTitle = [
                { text: "包含", type: 1 },
                { text: "不包含", type: 2 }
            ];
        if (type == "attachType") {
            arrTitle = [
                { text: "附件名包含", type: 1 },
                { text: "附件名不包含", type: 2 },
                { text: "无附件", type: 3 }
                ]

        };
        if (type == "mailSizeType") {
            arrTitle = [
                { text: "大于等于", type: 1 },
                { text: "小于", type: 2 }
                ]
        };
        if (type == "mailRectimeStart" || type == "mailRectimeEnd") {
            for (var i = 0; i < 24; i++) {
                arrTitle[i]={ text: i < 10 ?"0"+i+":00":i+":00", type: i < 10 ?"0"+i+":00:00":i+":00:00" }
            };

        };
        if (type == "conditionsRelation") {
            arrTitle = [
            { text: "选中的所有条件", type: 1 },
            { text: "选中的任意条件", type: 2 }
            ]
        };
        if (type.match(/Relation/) && type !== "conditionsRelation"  ) {//处理几个条件
            arrTitle = [
                { text: "满足任一关键字", type: 0 },
                { text: "满足所有关键字", type: 1 }
        ];}

        return arrTitle;
    },
    /**
    *历史邮件分拣
    */
    filterHistoryMail: function (options, callback) {
        $RM.filterHistoryMail(options, function (result) {
            callback(result["var"]);
        });
    }
})
);

})(jQuery, _, M139);
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
