/**
* @fileOverview 定义设置页邮件分类-普通分类的文件.
*/
/**
*@namespace 
*设置页邮件分类-普通分类
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Classify.View.Normal', superClass.extend(
    /**
    *@lends NormalCreateView.prototype
    */
    {
    el: "body",
    events: {
        "click #btn_save": "setFilter",
        "click #btn_cancel": "goBack",
        "click #goBack": "goBack",
        "click .showAddressBook": "getAddressBook",
        //"click .showAddressBook": "cleanText",
        "click input[name=rule]": "cleanText",
        "blur input[name=rule]": "huifuText",
        "click #dropDown_attach": "chosechecked",
        "click #dropDown_mailRectimeStart": "cleanText",
        "click #dropDown_mailRectimeEnd": "cleanText",
        "click #checkbox_forward":"forward",
        "click #text_forward":"toforward",
        "blur #text_forward":"forwardEmail",
        "click #advancedMode":"toAdvancedMode",
        "click #text_reply":"autoReply",
        "click #easyMode":"toEasyMode"

    },
    initialize: function () {
        this.ruleTypeIsOne = true;
        this.folderChecked = false;
        this.model = new M2012.Settings.Classify.Model();
        this.initEvents();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    /**
    *根据不同的入口，在创建规则页面打开时，自动填充某些规则的内容
    */
    getInitData: function () {
        var menuArrs = ["conditionsRelation","from","to","subject","attach","mailSize","mailRectimeStart","mailRectimeEnd","toRelation","subjectRelation","attachRelation"];
        for (var i in menuArrs) {
            this.getSelectMenu(menuArrs[i]); //为下拉菜单添加内容  
        };
        var type = $T.Url.queryString("type");
        switch (type) {
            case "workMail":
                var name = "公司邮件";
                this.showWorkMail(name);
                $("#checkbox_move").attr("checked", true);//从公司邮件创建收信规则
                break;
            case "friendMail":
                var name = "朋友邮件";
                this.showFriendMail(name);
                $("#checkbox_move").attr("checked", true); //从朋友邮件创建收信规则
                break;
            case "normalMail":
                this.showNormalMail();//正常创建收信规则
                break;
            case "edit":
                this.showEditStatus();//编辑现有收信规则
                break;
            default:
                this.showNormalMail();
                break
        }
       /* this.editorView = M2012.UI.HTMLEditor.create({//引入编辑器组建
            contaier:$('#text_reply'),
            blankUrl:"../editor_blank.htm"
        })*/
    },
    showWorkMail: function (name) {
        this.getMenuMoveToFolder(name);
        this.getMenuMarkTag();
        this.model.getSortId();
    },
    showFriendMail: function (name) {
        this.getMenuMoveToFolder(name);
        this.getMenuMarkTag();
        this.model.getSortId();
    },
    showNormalMail: function () {
        this.getMenuMoveToFolder();
        this.getMenuMarkTag();
        this.model.getSortId();
    },
   
    /**
    *入口是从分类规则列表的修改链接点进来，将规则的信息展示出来。表现在页面上就是文本框的信息，复选按钮的选择与否。
    */
    showEditStatus: function () {// 
        var self = this;
        var index = $T.Url.queryString("index");
        this.model.getFilter_139(function (datasource) {
                var datasource = datasource["var"];
                datasource.reverse();
                var newData = datasource;
                var arrTitle = [];
                var key = newData[index];
                self.model.set({ "content": key.replayContent, "moveToFolder": (self.getTop().$App.getFolderById(key.moveToFolder) ? key.moveToFolder : 1), "attachLabel": key.attachLabel });//重设moveToFolder值，覆盖掉self.getMenuMoveToFolder()里的初始值
                if (key.conditionsRelation == 2 && !self.model.get("advancedMode")) {
                    var html=["<div style=\"text-indent:70px;margin-bottom:12px;\">","如果邮件符合以下任一条件：","</div>"].join('');
                    $("li#allcondition").html(html);
                };

                var name = "";
                var tag = "";
                if (key.moveToFolder != 0 && key.moveToFolder) {
                    name = self.getTop().$App.getFolderById(key.moveToFolder) ? self.getTop().$App.getFolderById(key.moveToFolder).name:"收件箱";
                }
                if (key.attachLabel != 0 && key.attachLabel) {
                    tag = self.getTop().$App.getFolderById(key.attachLabel).name;
                }
                self.getMenuMoveToFolder(name);

                self.getMenuMarkTag(tag);
                var onOff = $("input[key=onoff]");
                if (key.onOff == 0 && key.dealHistoryMail == 2) {
                    onOff[1].checked = true;
                } else if (key.onOff == 1) {
                    onOff[2].checked = true;
                };
                if (key.replayContent && key.replayContent != "您的来信已收到，我会尽快回信。") {
                    $("#text_reply").val(M139.Text.Html.decode(key.replayContent));
                };
                if (key.ruleType == 0 || key.ruleType == 3) {
                    $("#139mail").attr("checked",true);
                }else{
                    $("#139mail").attr("checked",false);
                } 
                if ((key.ruleType == 1 || key.ruleType == 3) && key.popAccount) {
                    var popAccount = key.popAccount.split(";");
                    var AccountList = $("input[name=popaccount]")
                    for(;popAccount.length;) {
                        var itemAccount = popAccount.pop();
                        for (var i = 0; i < AccountList.length; i++) {
                            if(AccountList[i].value == itemAccount){
                                AccountList[i].checked=true;
                            }
                        };
                        
                    };
                };
                var ruleArr = [//定义规则的JSON数组
                { rule: key.from, textObj: $("#text_from"), checkboxObj: $("#checkboxGet_from") },
                { rule: key.to, textObj: $("#text_to"), checkboxObj: $("#checkboxGet_to") },
                { rule: key.subject, textObj: $("#text_subject"), checkboxObj: $("#checkboxGet_subject") },
                { rule: key.attach, textObj: $("#text_attach"), checkboxObj: $("#checkboxGet_attach")},
                { rule: key.mailSize, textObj: $("#text_mailSize"), checkboxObj: $("#checkboxGet_mailSize")},
                { rule: key.mailRectimeStart, textObj:$("#dropDown_mailRectimeStart"), checkboxObj: $("#checkboxGet_mailRectime")}, 
                { rule: key.mailRectimeEnd, textObj:$("#dropDown_mailRectimeEnd"), checkboxObj: $("#checkboxGet_mailRectime")}, 
                { rule: key.forwardAddr, textObj: $("#text_forward"), checkboxObj: $("#checkbox_forward") },
                { rule: $Xml.decode(key.replayContent), textObj: $("#text_reply"), checkboxObj: $("#checkbox_reply") }
            ];
                var RuleLen = ruleArr.length;
                for (var i = 0; i < RuleLen; i++) {//状态判断 和文本框关联的复选框
                    if (ruleArr[i].rule) {
                        ruleArr[i]["textObj"].val(ruleArr[i].rule); //把接口里的数据填充到文本框里
                        ruleArr[i]["checkboxObj"].attr("checked", true); //有数据的文本框对应的复选按钮为选中状态
                    }
                }
                if (ruleArr[7].rule) {
                    $("#forwardTips").text(key.forwardAddrVerify == 0 ? "（已验证）":"（正在等待该邮箱验证）");
                    $("#li_forward").show();
                    self.forwardAddrVerify=key.forwardAddrVerify; 
                    if (key.forwardBakup != undefined && key.forwardBakup == 0) {
                        var saveMail = $("[name=isSaveMail]")
                        saveMail[1].checked = true;
                    };               
                };
                var keyFrom = key.fromType == 0 ? 1 : key.fromType;
                var keyTo = key.toType == 0 ? 1 : key.toType;
                var keySubject = key.subjectType == 0 ? 1 : key.subjectType;
                var keyAttach = key.attachType == 0 ? 1 : key.attachType;
                var keyMailSize = key.mailSizeType == 0 ? 1 : key.mailSizeType;
                var keyMailRectimeStart = key.mailRectimeStart;
                var keyMailRectimeEnd = key.mailRectimeEnd;
                var keyConditionsRelation = key.conditionsRelation;
                var keyToRelation = key.toRelation;
                var keySubjectRelation = key.subjectRelation;
                var keyAttachRelation = key.attachRelation;

                

                var fromTypeArr = [
                { other: keyFrom, key: datasource[index].from,  check: $("#dropDown_from .dropDownText"), type: "fromType", status: datasource[index].fromType },
                { other: keyTo, key: datasource[index].to,  check: $("#dropDown_to .dropDownText"), type: "toType", status: datasource[index].toType },
                { other: keySubject, key: datasource[index].subject,  check: $("#dropDown_subject .dropDownText"), type: "subjectType", status: datasource[index].subjectType },
                { other: keyAttach, key: datasource[index].attach,  check: $("#dropDown_attach .dropDownText"), type: "attachType", status: datasource[index].attachType },
                { other: keyMailSize, key: datasource[index].mailSize,  check: $("#dropDown_mailSize .dropDownText"), type: "mailSizeType", status: datasource[index].mailSizeType },
                { other: keyMailRectimeStart, key: datasource[index].mailRectimeStart,  check: $("#dropDown_mailRectimeStart .dropDownText"), type: "mailRectimeStart", status: datasource[index].mailRectimeStart },
                { other: keyMailRectimeEnd, key: datasource[index].mailRectimeEnd,  check: $("#dropDown_mailRectimeEnd .dropDownText"), type: "mailRectimeEnd", status: datasource[index].mailRectimeEnd },
                { other: keyConditionsRelation, key: datasource[index].conditionsRelation,  check: $("#dropDown_conditionsRelation .dropDownText"), type: "conditionsRelation", status: datasource[index].conditionsRelation },
                { other: keySubjectRelation, key: datasource[index].subjectRelation, check: $("#dropDown_subjectRelation .dropDownText"), type: "subjectRelation", status: datasource[index].subjectRelation },
                { other: keyAttachRelation, key: datasource[index].attachRelation, check: $("#dropDown_attachRelation .dropDownText"), type: "attachRelation", status: datasource[index].attachRelation },
                { other: keyToRelation, key: datasource[index].toRelation, check: $("#dropDown_toRelation .dropDownText"), type: "toRelation", status: datasource[index].toRelation }
            ];
                var fromLen = fromTypeArr.length;
                for (var m = 0; m < fromLen; m++) {
                    arrTitle = self.model.getFilterType(fromTypeArr[m].type);
                    $.each(arrTitle, function (p, item) {
                        if (item && fromTypeArr[m].other == item["type"]) {
                            fromTypeArr[m]["check"].text(item["text"]);
                            self.model.set({
                                fromType: keyFrom,
                                toType: keyTo,
                                subjectType: keySubject,
                                attachType: keyAttach,
                               mailSizeType:keyMailSize,
                               mailRectimeStart:keyMailRectimeStart,
                               mailRectimeEnd:keyMailRectimeEnd,
                               subjectRelation:keySubjectRelation,
                               toRelation:keyToRelation,
                               attachRelation:keyAttachRelation,
                               conditionsRelation:keyConditionsRelation
                            });
                        }
                      
                    });
                }
                var otherArr = [
                { other: key.forwardBakup, check: $("#isSaveMail"), type: "forwardBakup", status: 1 }
            ];
                var otherLen = otherArr.length;
                for (var o = 0; o < otherLen; o++) {//状态判断 和文本框关联的复选框之外的复选框//满足任一规则 1：与，2：或
                    if (otherArr[o]["other"] == otherArr[o]["status"]) {
                        otherArr[o]["check"].attr("checked", true);
                    } else {
                        otherArr[o]["check"].removeAttr("checked");
                    }
                }
                var dealType = key["dealType"].split(",");
                for(;dealType.length;) { 
                    $("input[dealtype=dealType_" + dealType.pop() + "]").attr("checked", true);
                }
                self.noAttach(key.attachType);
        });
    },
    /**
    *逻辑判断，打开页面时需要展示的数据。
    */
    render: function () {
        if (!this.model.get("advancedMode")) {
            var html=["<div style=\"text-indent:70px;margin-bottom:12px;\">","如果邮件同时符合以下条件：","</div>"].join('');
            $("li#allcondition").html(html);
            $(".advancedMode").hide();
            //$("input#checkboxGet_from,input#checkboxGet_attach,input#checkboxGet_to,input#checkboxGet_subject").attr("checked",true);
        } else {
            var html=['<label class="label">',' 如果邮件符合：','</label>',
                        '<div class="element">',
                                    '<div id="dropDown_conditionsRelation" class="dropDown-sortnew" style="width:130px;"></div>',
                        '</div>'].join('');
            $("li#allcondition").html(html);
            $(".advancedMode").show();
            //$("input#checkboxGet_from,input#checkboxGet_attach,input#checkboxGet_to,input#checkboxGet_subject").attr("checked",false);
        };
        var popList = top.$App.getPopList().concat().sort(function(a, b) {
                return b.popId - a.popId;
            }); 
        var html = [];
        html.push('<input type="checkbox"  id="139mail" class="mr_5" checked><label for="139mail" class="mr_10" >本139邮箱</label>');
        var acclen = 9;
        for(var i in popList) {
            acclen = acclen + popList[i].email.length;
            if (acclen > 70) {
                html.push("<br/>");
                acclen = 0;
            };
            html.push('<input type="checkbox" value="'+popList[i].email+'" id="'+popList[i].email+'" class="mr_5" name="popaccount"><label for="'+popList[i].email+'" class="mr_10" >'+popList[i].email+'</label>')
            
        };
        /*var htmllen=html.length;
        for (var i = 0; i < htmllen; i++) {
            if (i % 2 === 1) {
                html[i] = html[i]+"<br/>"
            };
        };*/
        $("div#ids").html(html.join(""));
        this.getInitData();
        var text = $("input[type=text]");
        var textLen = text.length;
        for (var n = 0; n < textLen; n++) {//判断文本框是否为空，不为空就勾选复选按钮
            if (text.eq(n).val() != "") {
                var key = text.eq(n).attr("key");
                $("#checkboxGet_" + key).attr("checked", "true");
            }
        }
        return superClass.prototype.render.apply(this, arguments);
    },
    /**
    *获取分类的dealType。
    */
    getDealType: function (options) {
        var self = this;
        var attType = [];
        var dealType = $("#getClassifyDeal input[name=dealType]");
        var dealLen = dealType.length;
        options.items[0].replayContent = "您的来信已收到，我会尽快回信。";
        for (var i = 0; i < dealLen; i++) {
            var type = dealType.eq(i).attr("dealType");
            type = type.split("_")[1];
            if (dealType.eq(i).attr("checked")) {
                if (type == "0") {
                    attType = [];
                    attType.push(type);
                    break;
                };
                if (type == "2") {//放入文件夹
                    options.items[0].moveToFolder = this.model.get("moveToFolder");
                    options.items[0].folderId = 0;
                }
                if (type == "5") {//标记上标签
                	options.items[0].attachLabel = this.model.get("attachLabel");
                    options.items[0].folderId = 0;
                }
                if (type == "3") {//转发到
                    var textForward = $("#text_forward");
                    var addr = textForward.val();
                    if (addr == ''|| addr == "example@example.com") {
                        top.M139.UI.TipMessage.show("自动转发地址不能为空",{className:"msgOrange", delay: 1000 });
                        return;
                    };
                    var saveMail = $("[name=isSaveMail]");
                    if (addr == "") {
                        self.alertWindow(self.model.messages.forwardAddrNull);
                        return;
                    }
                    if (saveMail[0].checked) {
                       options.items[0].forwardBakup = 1; 
                    };

                    options.items[0].forwardAddr = addr;
                    options.items[0].forwardAddrVerify = self.forwardAddrVerify ? self.forwardAddrVerify:1;
                }
                if (type == "4") {//自动回复
                    var editorValue = $("#text_reply").val();
                    if (editorValue == "" ) {
                        top.M139.UI.TipMessage.show(self.model.messages.autoReplyNull,{className:"msgOrange", delay: 1000 });
                        return;
                    }
                    if (editorValue.length > 500) {
                        top.M139.UI.TipMessage.show(self.model.messages.autoReplyContentMax,{className:"msgOrange", delay: 1000 });
                        return;
                    }
                    options.items[0].replayContent = M139.Text.Html.encode(editorValue); //要加HTML转码 add by zsx
                }
                attType.push(type);
            }
        }
        var obj = {
            dealType: attType,
            options: options
        };
        return obj;
    },
    getInputText: function (obj) {
        var arr = [];
        var val = (obj.val() == "支持输入多个关键字，以分号（;）隔开" ? "": obj.val())
        var ex = /\;|\,|，|；/;
        if (val.match(ex)) {
            arr = val.split(ex);
        } else {
            arr.push(val);
        }
        return arr;
    },
    /**
    *创建收信规则。
    */
    setFilter: function (e) {
        if (this.model.get("advancedMode")) {
            BH("byclassifymailadvanced_onclick");
        } else {
            BH("byclassifynormal_onclick");
        }
        $("#btn_save").attr("disabled","disabled");
        $("#btn_save").unbind("click");
        var self = this;
        var onOff = $("input[key=onoff]");
        var attRule = [];
        var classifyObj = {};
        var objRuleCheck = $("#getClassifyRule input[data-name=conditionType]"); 
        var objRule = $("#getClassifyRule input[name=rule]");
        var ruleLen = objRule.length;
        for (var i = 0, onOfflen = onOff.length;i<onOfflen; i++) {//对收信规则的启动状态进行设置
            if (onOff[i].checked) {
                var onOffkey = i;
            };
        };
        if (onOffkey == 1) {
            var dealHistoryMail = 2;
            onOffkey = 0;
        } else if (onOffkey == 2) {
            onOffkey = 1;
        };
        var options = this.model.get("options");
        options.items[0]["onOff"] = onOffkey;  
        if (dealHistoryMail == 2) {
            options.items[0]["dealHistoryMail"] = dealHistoryMail;//对历史邮件进行分拣
        };     
        options.items[0]["ruleType"] = 3;//默认使用所有帐号
         if (this.model.get("advancedMode")) {//如果是高级模式就检测使用帐号有哪些
            var AccountLocal = $("#139mail").attr("checked");
            var AccountList = $("input[name=popaccount]");
            var AccountListlen = AccountList.length;
            var AccountArrs=[];
            for (var i = 0; i < AccountListlen; i++) {
                if(AccountList[i].checked) {
                    AccountArrs.push(AccountList[i].value);
                } 
            };
            if (!AccountLocal&&AccountArrs.length === 0) {
                top.M139.UI.TipMessage.show(self.model.messages.accountListError,{className:"msgOrange", delay: 1000 });
                return;
            };
            
            if (AccountLocal&&AccountArrs.length === 0) {
                options.items[0]["ruleType"] = 0;
            } else if (!AccountLocal&&AccountArrs.length !== 0) {
                options.items[0]["ruleType"] = 1;
                options.items[0]["popAccount"] = AccountArrs.join(";");
            } else {
                options.items[0]["popAccount"] = AccountArrs.join(";");
                options.items[0]["ruleType"] = 3;
            }
            var relationArrs = ["conditionsRelation","toRelation","subjectRelation","attachRelation"];//对各条件的关系进行检测
            var relationLen = relationArrs.length;
            for (var i = 0; i < relationLen; i++) {
                options.items[0][relationArrs[i]]= self.model.get(relationArrs[i]);     
            };
            
        }
        if ($("#checkboxGet_mailSize").prop("checked")) {//检测邮件大学限制是否为正整数
            var mailSize = $("#text_mailSize").val();
            if (isNaN(mailSize) || mailSize <= 0 || !(Math.round(Number(mailSize)) === Number(mailSize)) ) {
                top.M139.UI.TipMessage.show(self.model.messages.mailSizeError,{className:"msgOrange", delay: 1000 });
                return;
            };
        };
        
        var getOptions = this.getDealType(options);
        if (!getOptions) { return; };
        var attType = getOptions["dealType"];
        options = getOptions["options"];
        for (var n = 0; n < ruleLen; n++) {
            var rule = objRule.eq(n).attr("id").split("_")[1];
            var value = $("#text_" + rule).val();
            if (objRule.eq(n).val() != "" && objRule.eq(n).val() != "支持输入多个关键字，以分号（;）隔开" ) {
                attRule.push(n);
                options.items[0][rule] = value;
            }
        }
        if (self.model.get("attachType") == 3) {
            attRule.push(3);
        };
        if (objRuleCheck.eq(5).attr("checked")) {//对接收时间复选框做特殊处理
            attRule.push(5);
        };
        var fromObj = $("#text_from");
        var toObj = $("#text_to");
        var subjectObj = $("#text_subject");
        var attachObj = $("#text_attach");
        var mailSizeObj = $("#text_mailSize");

        var fromArr = self.getInputText(fromObj);
        var toArr = self.getInputText(toObj);
        var subjectArr = self.getInputText(subjectObj);
        var attachArr = self.getInputText(attachObj);
        var mailSizeArr = self.getInputText(mailSizeObj);

        var subject = subjectArr.join(";");
        var to = toArr.join(";");
        var from = fromArr.join(";");
        var attach = attachArr.join(";");
        var mailSize =mailSizeArr.join(";");

        var obj = [
            { id: fromObj, arr: fromArr, str: from, type: "from" },
            { id: toObj, arr: toArr, str: to, type: "to" },
            { id: subjectObj, arr: subjectArr, str: subject, type: "subject" },
            { id: attachObj, arr: attachArr, str: attach, type:"attach"},
            { id: mailSizeObj,value:mailSizeArr,str: mailSize, type: "mailSize"}
        ];
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            if (obj[i].str) {
                var type = self.model.get(obj[i].type + "Type");
                    options.items[0][obj[i].type + "Type"] = type;
                options.items[0][obj[i].type] = obj[i].str;
            }
        }
        if (attRule.length == 0) {
            top.M139.UI.TipMessage.show(self.model.messages.filterConditionsNull, {className:"msgOrange", delay: 1000 });
            return;
        }
        if (attType.length == 0) {
            top.M139.UI.TipMessage.show(self.model.messages.performRuleNull,{className:"msgOrange", delay: 1000 });
            return;
        }
        var op = options.items[0]
        if (op && op.dealHistoryMail == 2 && op.popAccount && op.popAccount.length != 0 && (op.fromType == 2 || op.toType == 2 || op.subjectType == 2 || op.attach == 2) ) {
            self.getTop().$Msg.alert(
            "那些符合“不包含”条件的代收帐号的历史邮件，将不会执行选中的操作",
            {
                title:"温馨提示",
                dialogTitle:"温馨提示"
            });
        };
        options = this.getRuleType(options, objRuleCheck);
        options.items[0].sortId = this.model.get("maxSortId") + 1;
        if ($T.Url.queryString("index")) {
            options.items[0].opType = "mod";
            options.items[0].filterId = $T.Url.queryString("filterId");
            options.items[0].sortId = $T.Url.queryString("sortId");
        }
        options.items[0].dealType = attType.toString();
        this.model.setFilter_139(options, function (datasource) {
                if (datasource["code"] == "S_OK") {
                    top.BH("set_add_sort_save_success");
                    var sid = $T.Url.queryString("sid");
                    location.href = "sort_new.html?sid=" + sid;
                    top.M139.UI.TipMessage.show(self.model.messages.sortCreateSucceed,{delay: 1000 });
                } else {
                    top.M139.UI.TipMessage.show(self.model.messages.sortCreateFail,{className:"msgRed", delay: 1000 });
                }
            });
    },
    //获取f下拉菜单组建值
    //0:无效
    //1：包含以下所有词语  2：包含以下任一词语
    getRuleType: function (options, objRule,e) {
        var self = this;
        var ruleType = [
                { key: "from", type: "fromType" },
                { key: "to", type: "toType" },
                { key: "subject", type: "subjectType" },
                { key: "attach",type:"attachType"},
                { key: "mailSize",type:"mailSizeType"}
                
            ];
        var typeLen = ruleType.length;
        for (var m = 0; m < typeLen; m++) {
            var getrule = objRule.eq(m).attr("id").split("_")[1];
            if (getrule.indexOf(ruleType[m]["key"]) > -1 && objRule.eq(m).attr("checked")) {
                var t = ruleType[m]["type"];
                options.items[0][t] = self.model.get(t);
            }
        }
        if (objRule.eq(5).attr("checked")||$("#checkboxGet_mailRectime").attr("checked")) {
            options.items[0]["mailRectimeType"] = 1;
            options.items[0]["mailRectimeStart"] = self.model.get("mailRectimeStart");
            options.items[0]["mailRectimeEnd"] = self.model.get("mailRectimeEnd");

        };
        return options;
    },
    getMailFrom: function (type) {
        var arr = [];
        var obj = $("#text_" + type);
        var val = obj.val();
        var ex = /\;|\,|，|；/;
        if (val.match(ex)) {
            arr = val.split(ex);
        } else {
            arr.push(val);
        }
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
            if (arr[i] == "") {//处理最后一个数组元素为空的情况（字符串的最后带了正则匹配的字符）
                break;
            }
        }
        return arr;
    },
    getAddressBook: function (e) {
        var self = this;
        var key = $(e.currentTarget).attr("key");
        //if (!self.getMailFrom(key)) { return; };
        var view = top.M2012.UI.Dialog.AddressBook.create({
            filter: "email",
            items: self.getMailFrom(key)
        });
        view.$el.find(".SendToMySelf").addClass("hide");
        view.on("select", function (e) {
            var value = eval('(' + JSON.stringify(e) + ')').value;
            var mailArr = [];
            var len = value.length;
            for (var i = 0; i < len; i++) {
                var mail = $Email.getEmail(value[i]);
                mailArr.push(mail);
            }
            var text = mailArr.join(";");
            if(self.getMailFrom(key) != undefined && self.getMailFrom(key)[0] != "支持输入多个关键字") {
                text = self.getMailFrom(key).join(";")+";"+text;
            }
            $("#text_" + key).val(text);
            if (text != "") {
                $("#checkboxGet_" + key).attr("checked", true);
            }
        });
        view.on("cancel", function () {
        });
    },
    cleanText:function(e) {
        if ($(e.target).val() == "支持输入多个关键字，以分号（;）隔开") {
            $(e.target).val("");
            $(e.target).removeClass("gray");
            
            };
        var checkedId = "checkboxGet_"+e.target.id.split("_")[1];
        if (!e.target.id.split("_")[1]) {
            checkedId="checkboxGet_mailRectime";
        };
        if (!$("#"+checkedId).prop("checked")) {
            $("#"+checkedId).attr("checked",true);

        };
        
    },
    chosechecked:function(e) {
         var checkedId = "checkboxGet_"+e.target.parentElement.parentElement.id.split("_")[1];
         if (!$("#"+checkedId).prop("checked")) {
            $("#"+checkedId).attr("checked",true);

        };
    },

    huifuText:function(e) {
        if ($(e.target).val() == "" && e.target.id.split("_")[1] != "mailSize") {
            $(e.target).val("支持输入多个关键字，以分号（;）隔开");
            $(e.target).addClass("gray");
            
            };
        var checkedId = "checkboxGet_"+e.target.id.split("_")[1];
        if (!e.target.id.split("_")[1]) {
            checkedId="checkboxGet_mailRectime";
        };
        if ($("#"+checkedId).prop("checked")&& ($(e.target).val()==""||$(e.target).val()=="支持输入多个关键字，以分号（;）隔开")) {
            $("#"+checkedId).attr("checked",false);

        };

    },
    /**
    *勾选自动转发复选框 显示自动转发需要的选项和验证码
    */
    forward:function(e) {
        var key = $("#checkbox_forward").prop("checked");
        var item = $("#li_forward");
        if (key) {
            item.show();
        } else {
            item.hide();
        }
    },
    /**
    *点击自动转发地址栏直接选择自动转发选项
    */
    toforward:function(e) {
        var key = $("#checkbox_forward").prop("checked");
        var item = $("#li_forward");
        var This=$("#text_forward")
        if (This.val() === ""||This.val() === "example@example.com" ) {
            This.val("")
            $("#forwardTips").text("（保存后请登录该邮箱，通过验证后方可生效）");
        };
        if (!key) {
            $("#checkbox_forward").trigger("click");
            item.show();

       }; 
       
    },
    forwardEmail:function(e) {
        var email = $("#text_forward").val();
        if (email != ""&&!$Email.isEmail(email)) {
            $("#forwardTips").text("（Email地址格式有误，请重新输入）");
        } else {
            $("#forwardTips").text("（保存后请登录该邮箱，通过验证后方可生效）");
        }
    },
    /**
    *文本框聚焦时自动勾选复选框
    *文本框失焦时，如果文本框内容为空去掉勾选
    *HTML页面id的值： 
    *复选框：id="checkbox_from"   文本框:id="text_from"   
    *from,to,size,domain,subject分别表示收件人、发件人、发信大小、发件域名、来信内容
    */
    autoSelected: function () {
        var checkbox = $("input[type=radio],#checkbox_reply");
        var text = $("input[type=text],#text_reply");
        var len = checkbox.length;
        var self = this;
        text.focus(function () {
            var objKey = $(this).attr("key");
            for (var i = 0; i < len; i++) {
                var checkboxKey = checkbox.eq(i).attr("key");
                if (objKey == checkboxKey) {
                    checkbox.eq(i).attr("checked", "true");
                    break;
                }
            }
        });
    },
    getSelectMenu: function (type, defaultText) {
        var arrTitle = [
                { text: "包含", type: 1 },
                { text: "不包含", type: 2 }
        ];
        var size = "89px"
        if(type === "attach"){//处理附件名规则
            arrTitle = [
                { text: "附件名包含", type: 1 },
                { text: "附件名不包含", type: 2 },
                { text: "无附件", type: 3 }
            ];
            size = "105px"

        }
        if (type === "mailSize") {//处理邮件大小规则
            arrTitle = [
                { text: "大于等于", type: 1 },
                { text: "小于", type: 2 }
        ];
        }
        if (type === "mailRectimeStart"||type === "mailRectimeEnd") {//处理接收邮件时间
            for (var i = 0; i < 24; i++) {
                arrTitle[i]={ text: i < 10 ?"0"+i+":00":i+":00", type: i < 10 ?"0"+i+":00:00":i+":00:00" }
            };

        }
        if (type.match(/Relation/) && type !== "conditionsRelation"  ) {//处理几个条件
            arrTitle = [
                { text: "满足任一关键字", type: 0 },
                { text: "满足所有关键字", type: 1 }
        ];
            size = "120px";
        }
        if (type === "conditionsRelation") {//高级模式规则的关系
             arrTitle = [
                { text: "选中的所有条件", type: 1 },
                { text: "选中的任意条件", type: 2 }
        ];
            size = "130px";
        };
        var obj = $("#dropDown_" + type);
        var self = this;
        var dropMenu = M2012.UI.DropMenu.create({
            defaultText: defaultText || arrTitle[0].text,
            width: "400px",
            menuItems: arrTitle,
            container: obj,
            width: size
        });
        dropMenu.on("change", function (item) {
            var typeObj = {
                from: { "fromType": item.type },
                to: { "toType": item.type },
                subject: { "subjectType": item.type },
                attach: { "attachType": item.type },
                mailSize: { "mailSizeType": item.type },
                mailRectimeStart: { "mailRectimeStart": item.type },
                mailRectimeEnd: { "mailRectimeEnd": item.type },
                conditionsRelation: { "conditionsRelation": item.type },
                subjectRelation: { "subjectRelation": item.type },
                toRelation: { "toRelation": item.type },
                attachRelation: { "attachRelation": item.type }

            };
            var json = typeObj[type];
            self.model.set(json);
            self.noAttach();
            timeStart = self.model.get('mailRectimeStart');
            timeEnd = self.model.get('mailRectimeEnd');
            self.compareTime(timeStart,timeEnd);

        });
    },
    noAttach:function(key,e) {//无附件特殊处理
        var self = this;
        if (self.model.get("attachType") == 3 || key == 3) {
            $("#text_attach").attr("disabled","disabled");
        } else {
            $("#text_attach").removeAttr("disabled");   
        }

    },
    //如果接收邮件的起始时间晚于终止时间 特殊处理
    compareTime:function(timeStart,timeEnd,e) {
        var date = $("#datetext");
        if (timeStart > timeEnd) {
            date.text("次日");
        } else {
            date.text("当日");
        }
    },
    /**
    *在下拉菜单中获取我的文件夹列表
    */
    getMenuMoveToFolder: function (defaultText) {
        var systemFolder = this.getTop().$App.getFolders("system");
        var systemFolderCount = systemFolder.length;
        var customFolder = this.getTop().$App.getFolders("custom");
        customFolder = systemFolder.concat(customFolder);
        var len = customFolder.length;
        var arrTitle = [];
        var selectedFid = $Url.queryString("fid"); //从url中获取默认选中项
        var selectedIndex = 0;
        for (var i = 0; i < len; i++) {
            arrTitle.push({ text: customFolder[i].name, fid: customFolder[i].fid });
            if (selectedFid && customFolder[i].fid == selectedFid) {
                $("#checkbox_move").attr("checked", true);
                selectedIndex = i;
            }

            if (systemFolderCount - 1 == i && i < len - 1) { //插入华丽的分隔线（无文件夹时不加）
                arrTitle.push({ isLine: true });
            }
        }
        arrTitle.push({ isLine: true });
        var obj = $("#dropDownFolder");
        if (defaultText && top.$App.getFolderByFolderName(defaultText)) {
            var defaultFid = top.$App.getFolderByFolderName(defaultText).fid;
        }
        this.model.set({ "moveToFolder": defaultFid || arrTitle[0].fid });
        var self = this;
        var dropMenu = M2012.UI.DropMenu.create({
            defaultText: defaultText || arrTitle[0].text,
            menuItems: arrTitle,
            container: obj,
            width: "180px",
            maxHeight: "200"
        });
        self.addSureCreate(obj, "addFolderSure");
        dropMenu.on("change", function (item) {
            self.model.set({ "moveToFolder": item.fid })
            $("#checkbox_move").attr("checked", true);
			$("#historyMail").removeAttr("disabled");
        });
    },
    /**
    *在下拉菜单中获取我的标签列表
    */
    getMenuMarkTag: function (defaultText) {
        var self = this;
        var tagFolder = this.getTop().$App.getFolders("tag");
        var len = tagFolder.length;
        var arrTitle = [];
        var selectedIndex = 0;
        var selectedLabelId = $Url.queryString("labelId"); //从url中获取默认选中项
        for (var i = 0; i < len; i++) {
            var isSpecial = (tagFolder[i]["name"] == "重要任务" || tagFolder[i]["name"] == "紧急任务");
            var color = this.getTop().$App.getTagColor(tagFolder[i]["folderColor"]);
            var tagItemHtml = ['<span class="text"><span class="tagMin', isSpecial ? " tagJJ" : "", '" style="',
            'border-left-color:', color, ';border-right-color:', color,
            '"><span class="tagBody" style="',
            'border-bottom-color:', color, ';border-top-color:', color,
            ';background-color:',
	      	color,
	      	, '">', isSpecial ? ' <i class="i_jj"></i>' : "", '</span></span><span class="tagText">',
	      	tagFolder[i]["name"], '</span></span>'].join("");
            arrTitle.push({ html: tagItemHtml, fid: tagFolder[i].fid });
            if (selectedLabelId && tagFolder[i]["fid"] == selectedLabelId) {
                $("#checkbox_tag").attr("checked", true);

            }

        }
        arrTitle.push({ isLine: true });
        var obj = $("#dropDownTag");
        if (defaultText) {
            var defaultFid = top.$App.getFolderByFolderName(defaultText).fid;
            var folderColor = top.$App.getFolderByFolderName(defaultText).folderColor;
            var color = top.$App.getTagColor(folderColor);
            var tagItemHtml = ['<span class="text"><span class="tagMin" style="',
            'border-left-color:', color, ';border-right-color:', color,
            '"><span class="tagBody" style="',
            'border-bottom-color:', color, ';border-top-color:', color,
            ';background-color:',
	      	color,
	      	, '"></span></span><span class="tagText">',
	      	defaultText, '</span></span>'].join("");
            defaultText = tagItemHtml;
        }
        self.model.set({ "attachLabel": defaultFid || arrTitle[0].fid });
        var dropMenu = M2012.UI.DropMenu.create({
            defaultText: defaultText || arrTitle[0].html,
            menuItems: arrTitle,
            container: obj,
            width: "180px",
            maxHeight: "200"
        });
        self.addSureCreate(obj, "addTagSure");
        dropMenu.on("change", function (item) {
            self.model.set({ "attachLabel": item.fid });
            $("#checkbox_tag").attr("checked", true);
        });
    },
    /**
    *返回邮件分类首页
    */
    goBack: function () {
        var sid = $T.Url.queryString("sid");
        location.href = "sort_new.html?sid=" + sid;
    },
    toAdvancedMode: function(e) {//高级模式切换到简洁模式
        this.model.set("advancedMode",true);
        this.render();
        html ='<a href="javascript:" id="easyMode" bh="classifymailnormal_onclick"  >切换到简洁模式</a>'
        $("#toMode").html(html);
        //$("#btn_save").attr("bh","byclassifyadvanced_onclick");

    },
    toEasyMode: function(e) {//简洁模式切换到高级模式
        this.model.set("advancedMode",false);
        this.render();
        html = '<a href="javascript:" id="advancedMode"  bh="classifymailadvanced_onclick">切换到高级模式</a>'
        $("#toMode").html(html);
        //$("#btn_save").attr("bh","byclassifynormal_onclick");

    },
    getTagHtml: function () {
        var html = ['<div class="pl_5 sorttagpop">',
            '<input class="iText mr_5  gray" value="输入标签名称" maxlength="16" style="width:99px;"  type="text" id="tfName">',
        /*'<div class="sorttagpopcolor mr_5">',
        '<span class="tag tagRed" href="javascript:void(0)"><span class="tagBody"><span><i class="i_triangle_dw"></i></span></span></span>',
        '</div>',*/
            '<a href="javascript:void(0)" class="btnNormal " id="addTagSure"><span>确 定</span></a>',
            '</div>'].join("");
        return html;
    },
    getFolderHtml: function () {
        var html = ['<div class="pl_5 sorttagpop">',
        '<input class="iText mr_5 gray" value="输入文件夹名称" maxlength="16" style="width:99px;" type="text" id="tfName"><a href="javascript:void(0)" class="btnNormal " id="addFolderSure"><span>确 定</span></a>',
        '</div>'].join("");
        return html;
    },
    autoReply:function(e) {
        if (!$("#checked_reply").prop("checked")) {
            $("#checked_reply").attr("checked",true)
        };
    },
    /**
    *事件处理
    */
    initEvents: function () {
        var self = this;
        this.autoSelected();
        //this.checkHistoryMail();
        
        $("#text_reply").blur(function () {

            var This = $(this);
            var editorValue = This.val();
            if (editorValue == "") {
                $("#checkbox_reply").removeAttr("checked");
            }
        });
        $("#dropDownTag").click(function () {
            $(".menuPop").append('<p class="pl_10"><a href="javascript:void(0)" id="addTag">单击添加标签</a></p>');
        });
        $("#dropDownFolder").click(function () {
            $(".menuPop").append('<p class="pl_10"><a href="javascript:void(0)" id="addFolder">单击添加文件夹</a></p>');
        });
        $("#addTag").live("click", function () {
            $(this).parent().after(self.getTagHtml()).hide();
        });
        $("#addFolder").live("click", function () {
            $(this).parent().after(self.getFolderHtml()).hide();
        });
        $("#tfName").live("focus", function () {
            $(this).val("");
        });
    },
    addSureCreate: function (obj, id) {
        var self = this;
        $("#" + id).live("click", function () {
            var text = $("#tfName").val();
            text = text.replace(/(^\s*)|(\s*$)/g, "");
            if (id == "addFolderSure") {
                var checkFolder = self.getTop().$App.checkFolderName(text);
                if (!checkFolder) {
                    return
                };
                self.getTop().$App.addFolder(text, null, function (res) {
                    self.model.set({ "moveToFolder": res.fid });
                    $("#checkbox_move").attr("checked", true)
                })
                var html = text;
            } else {
                var checkTag = self.getTop().$App.checkTagName(text);
                if (checkTag) {
                    top.$Msg.alert(
                    checkTag,
                    {
                        dialogTitle: "系统提示",
                        icon: "warn",
                        isHtml: true
                    }
                );
                    return false;
                }
                self.getTop().$App.addTag(text, 0, null, function (res) {
                    self.getMenuMarkTag(text);
                    self.model.set({ "attachLabel": res.fid });
                    $("#checkbox_tag").attr("checked", true)

                })
                var html = self.tagHtml(text);
            }
            $(this).parent().parent().remove();
            obj.find(".dropDownText").html(html);
        })

    },
    tagHtml: function (text) {
        var html = '<span class="text"><span class="tagMin" style="border-left-color:#FF0000;border-right-color:#FF0000"><span class="tagBody" style="border-bottom-color:#FF0000;border-top-color:#FF0000;background-color:#FF0000"></span></span><span class="tagText">' + text + '</span></span>';
        return html;
    }
})
    );
var normalCreateView = new M2012.Settings.Classify.View.Normal();
normalCreateView.render();
})(jQuery, _, M139);


