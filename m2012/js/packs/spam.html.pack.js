/**
* @fileOverview 定义设置页基本参数的文件.
*/


(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页基本参数
    */
    M139.namespace('M2012.Settings.Spam.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Spam.Model.prototype
    */
        {
        defaults: {
            spam_level: null,
            spam_deal: null,
            virus_status: null,
            virus_sucess: null,
            virus_fail: null,
            virus_doubt: null,
            virus_notify_me: 0,
            virus_notify_send: 0,
            type: null, //1 黑名单   0白名单
            opType: null//delete  删除黑白名单   add 新增黑白名单
        },
        /**
        *获取代收文件夹的数据
        */
        getWaste: function (callback) {
            var options = {
                attrIds: [
                    ]
            }
            $RM.getAttrs(options, function (result) {
                callback(result["var"]);
            });
        },
        getWhiteBlackList: function (options, callback) {
            $RM.getWhiteBlackList(options, function (result) {
                if (result && result["var"]) {
                    callback(result["var"]);
                }
            });
        },
        setWhiteBlackList: function (options, callback) {
            $RM.setWhiteBlackList(options, function (result) {
                callback(result);
            });
        },
        setPreference: function (callback) {
            var options = {
                attrs: {
                    spam_level: this.get("spam_level"),
                    spam_deal: this.get("spam_deal"),
                    virus_status: this.get("virus_status"),
                    virus_sucess: this.get("virus_sucess"),
                    virus_fail: this.get("virus_fail"),
                    virus_doubt: this.get("virus_doubt"),
                    virus_notify_me: this.get("virus_notify_me"),
                    virus_notify_send: this.get("virus_notify_send")
                }
            }
            $RM.setAttrs(options, function (result) {
                callback(result);
            });
        },
        getMessages: {
            operateSuccess: "您的设置已保存",
            spamSaveError: "服务器繁忙，请稍后再试",
            confirmDel: "确定将 {0} 从名单中删除？",
            delAll: "确定要删除选中的邮件地址？",
            mailAddrError: '格式错误，如：test@example.com',
            domainAddrError: '格式错误，如：*@example.com',
            selectMailToDel:'请选择之后再删除',
            mailAddrExist:'输入框有已经设置过的邮件地址',
            addSuccess:'{0}名单添加成功',
            delSuccess:'{0}名单删除成功'

        }
    })
    );

})(jQuery, _, M139);
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
    M139.namespace('M2012.Settings.Spam.View', superClass.extend(
    /**
    *@lends SpamView.prototype
    */
        {
        el: "body",
        events: {
            'click #addBlackWhite': 'addBlackWhite',
            'click .cancelBlackWhite': 'closeAdd',
            'click .showAddr': 'showAddr',
            'click input[name=virus_status]:first': 'hideLayer',
            'click input[name=virus_status]:last': 'showLayer',
            'click #mailAddr': 'getAddressBook'
        },
        initialize: function () {
            this.model = new M2012.Settings.Spam.Model();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *声明反垃圾页HTML最外层的ID
        *@param {String} spam:id值
        *页面加载即执行，针对反垃圾和反病毒的设置
        */
        render: function (spam) {
            var self = this;
            this.model.getWaste(function (dataSource) {
                var dom = $("#" + spam);
                var domRadio = dom.find("input[keyvalue]");
                var len = domRadio.length;
                for (var i = 0; i < len; i++) {
                    var keyvalue = domRadio.eq(i).attr("keyvalue");
                    var key = keyvalue.split("-")[0];
                    var value = keyvalue.split("-")[1];
                    var data = key + "-" + dataSource[key];
                    if (keyvalue == data) {
                        domRadio.eq(i).attr("checked", "checked");
                    }
                }
                if (dataSource.virus_status != 1) {
                    var id = $("#virusMail");
                    var item = $("#itemLayer");
                    top.$App.setOpacityLayer(id, item);
                }
                top.BH("junk_load");
            });
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
        *获取反垃圾页黑白名单数据，并加以组装
        *@param {String} type:黑名单or白名单
        *页面加载即执行，针对黑白名单的设置
        *
        */
        renderBlackWhite: function (type) {//black  黑名单    white   白名单
            var self = this;
            var getType = type == "black" ? 0 : 1; //0  黑名单   1   白名单
            var options = { type: getType }
            this.model.getWhiteBlackList(options, function (dataSource) {
                var mailList = $("#" + type + "listMail");
                var domainList = $("#" + type + "listDomain");
                var domainArray = [];
                var mailArray = [];
                var mailhtmlArray = [];
                var domainhtmlArray = [];
                var len = dataSource.length;
                if (len == 0) {
                    mailList.hide().prev().hide();
                    mailList.next().hide();
                    domainList.hide().prev().hide();
                    domainList.next().hide();
                }
                for (var i = 0; i < len; i++) {
                    var data = dataSource[i];
					//add by zsx
					var data1 ="";
					if(data.length > 55){
						data1 = data.substr(0,45) + "...@" + data.split("@")[1];
					}else{
						data1 = data;
					}
                    var name = data.split("@")[0];
                    var html = ['<li><a href="javascript:;">删除</a><label hidefocus=true for="' + type + i + '"><input id="' + type + i + '" type="checkbox" value="" /><span id="data" style="display:none;">'+data+'</span>' + data1 + '</label></li>'].join("");
                    if (name == "*") {//按发件域名
                        domainArray.push(data)
                        domainhtmlArray.push(html);
                        if (len == 1) {
                            mailList.hide().prev().hide();
                            mailList.next().hide();
                        }
                    } else {//按发件邮箱
                        mailArray.push(data);
                        mailhtmlArray.push(html);
                        if (len == 1) {
                            domainList.hide().prev().hide();
                            domainList.next().hide();
                        }
                    }
                }
                self.getPage(mailArray, mailList, mailhtmlArray);
                self.getPage(domainArray, domainList, domainhtmlArray);
            });
        },
        /**
        *分页功能
        */
        getPage: function (array, list, htmlArr) {
            var self = this;
            var page = 10;
            var len = array.length;
            var listPage = list.next().find(".pageList");
            var num = Math.ceil(len / 10);
            var groupArray = [];
            var htmlArray = [];
            for (var i = 1; i < num + 1; i++) {
                groupArray.push({
                    group: array.slice((i - 1) * page, i * page)
                })
                htmlArray.push({
                    group: htmlArr.slice((i - 1) * page, i * page)
                })
            }
            if (groupArray.length > 0) {
                var pt = M2012.UI.PageTurning.create({
                    pageIndex: 1,
                    pageCount: num,
                    maxPageButtonShow: 5,
                    container: $(listPage)
                });
                pt.on("pagechange", function (pageIndex) {
                    self.gotoPage(groupArray, pageIndex, list, htmlArray);
                });
                self.gotoPage(groupArray, 1, list, htmlArray);
            }
        },
        getMailFrom: function () {
            var arr = [];
            var val = $("#tbAddr").val();
            var ex = /\;|\,|，|；/;
            if (val.match(ex)) {
                arr = val.split(ex);
            } else {
                arr.push(val)
            }
            return arr;
        },
        getAddressBook: function () {
            var self = this;
            var view = top.M2012.UI.Dialog.AddressBook.create({
                filter: "email",
                items: self.getMailFrom(),
                receiverText: "发件人"
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
                var val = $("#tbAddr").val();
                if (val != "") {
                    $("#tbAddr").val(text + ";" + val);
                } else {
                    $("#tbAddr").val(text);
                }
            });
            view.on("cancel", function () {
            });
        },
        /**
        *显示第几页
        */
        gotoPage: function (group, page, list, htmlArr) {
            var mail = [];
            var data = group[page - 1]["group"];
            var html1 = htmlArr[page - 1]["group"];
            var len = html1.length;
            var dataLen = data.length;
            for (var n = 0; n < dataLen; n++) {
                mail.push({
                    mail: data[n]
                })
            }
            list.find("li").remove();
            for (var i = 0; i < len; i++) {
                list.addClass("blacklist").append(html1[i]);
            }
            list.next().show();
            list.prev().show();
            list.show();
        },
        /**
        *显示添加黑白名单的界面
        */
        showAddr: function (e) {
            var value = $(e.currentTarget).attr("key");
            var status = $(e.currentTarget).attr("type");
            var text = status == "domain" ? "域名" : "人";
            var arr = [
            { type: value, status: status, text: text }
            ]
            $("#creatTabBody").remove();
            var templateStr = $("#creattabTem").val();
            var rp = new Repeater(templateStr);
            var html = rp.DataBind(arr);
            $(e.currentTarget).parent().after(html);
            if (status == "domain") {
                $("#mailAddr").remove();
            }
        },
        /**
        *关闭添加黑白名单的界面
        */
        closeAdd: function () {
            $("#creatTabBody").remove();
        },
        /**
        *添加黑白名单
        */
        addBlackWhite: function (e, options, callback) {
            if (e) {//入口在设置页
                var value = $(e.currentTarget).attr("key");
                var type = $(e.currentTarget).attr("type");
                var addr = $("#tbAddr").val();
            } else {//入口在其他地方e传null  读信页、写信页    
                var value = options.key;
                var type = options.type || "";
                var addr = options.name;
            };
            var typeStatus = type == "domain" ? true : false;
            var status = value == "black" ? 0 : 1;
            var getValue = value == "black" ? "white" : "black";
            var addrArr = [];
            var self = this;
            var domainStatus = false;
            var ex = /\;|\,|，|；/;
            if (addr.match(ex)) {
                addrArr = addr.split(ex);
            } else {
                addrArr.push(addr)
            }
            var len = addrArr.length;
            for (var i = 0; i < len; i++) {
                if (addrArr[i] == "") {//处理最后一个数组元素为空的情况（字符串的最后带了正则匹配的字符）
                    break
                }
                var mail = $Email.isEmail(addrArr[i]);
                if (addrArr[i].indexOf("*@") == 0) {
                    var add = addrArr[i].replace("*@", "x@");
                    var admail = $Email.isEmail(add);
                    if (admail) {
                        domainStatus = true;
                    }
                }
                if ((!domainStatus || addrArr[i].indexOf("*@") != 0) && typeStatus) {
                    self.getTop().$Msg.alert(
                        self.model.getMessages.domainAddrError,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                    return
                }
                else if ((!mail || mail && addrArr[i].indexOf("*@") == 0) && !typeStatus) {
                    self.getTop().$Msg.alert(
                        self.model.getMessages.mailAddrError,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                    return
                }
            }
            for (var n = 0; n < addrArr.length; n++) {
                for (var j = n + 1; j < addrArr.length; j++) {
                    if (addrArr[n] == addrArr[j]) {
                        addrArr.splice(n, 1);
                        n--;
                    }
                }
            };
            var mailAddr = addrArr.join(",");
            var options = {
                opType: "add",
                type: status,
                member: mailAddr
            }
            var delArr = [];
            var getType = status == 0 ? 1 : 0;
            var bw = status == 0 ? "黑" : "白";
            var obj = { type: getType }
            this.model.getWhiteBlackList(obj, function (result) {
                if (mailAddr.length == 0) {
                    self.getTop().$Msg.alert(
                        "地址不能为空",
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                    return
                }
                for (var o = 0; o < result.length; o++) {
                    for (var m = 0; m < addrArr.length; m++) {
                        if (result[o] == addrArr[m]) {
                            delArr.push(result[o]);
                        }
                    }
                }
                if (delArr.length > 0) {
                    var text = "";
                    if (delArr.length == 1) {
                        text = delArr[0];
                    }
                    else {
                        text = delArr.join(",")
                    }
                    var parent = $("#" + getValue + "listMail");
                    var len = parent.find("li").siblings().length - 1;
                    var submitData = {
                        status: getType,
                        text: text,
                        type: getValue,
                        len: len,
                        parent: parent
                    }
                    self.delBlackWhite(submitData);
                }
                self.model.setWhiteBlackList(options, function (dataSource) {
                    if (dataSource["code"] == "S_OK") {
                        if (callback) {
                            callback()
                            return
                        }
                        var text = self.model.getMessages.addSuccess;
                        top.M139.UI.TipMessage.show($T.Utils.format(text, [bw]), { delay: 2000 });
                        self.renderBlackWhite(value);
                        self.renderBlackWhite(getValue);
                        self.closeAdd();
                        if ($(".blacklist-page")) {
                            $(".blacklist-page").remove();
                        }
                    } else if (dataSource["code"] == "FS_UNKNOWN" && dataSource["errorCode"] == "2029") {
                        self.getTop().$Msg.alert(
                        self.model.getMessages.mailAddrExist,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                    }
                })
            })
        },
        /**
        *删除反垃圾页黑白名单时提交的请求
        *@param {String} type:黑名单or白名单
        *@param {Array} array:发件邮箱和发件域名的数组
        */
        delBlackWhite: function (obj) {
            var self = this;
            var value = obj.type;
            var options = {
                opType: "delete",
                type: obj.status,
                member: obj.text
            }
            this.model.setWhiteBlackList(options, function (dataSource) {
                var bw = obj.status == 0 ? "黑" : "白";
                if (dataSource["code"] == "S_OK") {
                    var text = self.model.getMessages.delSuccess;
                    top.M139.UI.TipMessage.show($T.Utils.format(text, [bw]), { delay: 2000 });
                    self.renderBlackWhite(value);
                    $(".selectall input").removeAttr("checked")
                    if (obj.len == 0) {
                        obj["parent"].prev().hide();
                        obj["parent"].next().hide();
                        obj["parent"].hide();
                    }
                }
            })
        },
        /**
        *设置基本参数信息
        */
        saveData: function () {
            var self = this;
            this.model.setPreference(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    top.M139.UI.TipMessage.show(self.model.getMessages.operateSuccess, { delay: 2000 });
                    top.BH("set_spam_save_success");
                } else {
                    top.$Msg.alert(
                        self.model.getMessages.spamSaveError,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );

                }
            });
        },
        /**
        *事件处理
        *全选事件
        *删除事件，单个删除和全选删除
        *保存数据的事件
        *取消保存的事件
        */
        initEvents: function () {
            this.selectAll();
            this.deleteData();
            var self = this;
            var data = {}
            $("#doOk").click(function () {
                data = self.getValue();
                self.model.set(data)
                self.saveData();
            })
            $("#doCancel").click(function () {
                self.getTop().$App.close();
            })
            $(".blacklist li").hover(function () {
                $(this).addClass("on");
            }, function () {
                $(this.removeClass("on"))
            })
        },
        /**
        *通过input的checked属性获取设置好的数据，组装成JSON
        */
        getValue: function () {
            var inputChecked = $("#setSpam").find("input:checked");
            var len = inputChecked.length;
            var obj = {};
            for (var i = 0; i < len; i++) {
                var keyvalue = inputChecked.eq(i).attr("keyvalue");
                var key = keyvalue.split("-")[0];
                var value = keyvalue.split("-")[1];
                var reg = /^\d+$/;
                if (inputChecked.attr("type") == "radio") {
                    if (reg.test(value)) {
                        value = parseInt(value);
                    }
                    obj[key] = value;
                }
                if (inputChecked.attr("type") == "checkbox") {
                    if (inputChecked.attr("checked")) {
                        obj[key] = 1;
                    } else {
                        obj[key] = 0;
                    }
                }
            }
            return obj;
        },
        /**
        *删除黑白名单
        */
        deleteData: function () {
            var self = this;
            $("#setSpam ul .blacklist li a").live("click", function () {//单个删除
                var This = $(this);
                var parent = This.parent().parent();
                var id = parent.attr("id");
                var status = id.indexOf("white") > -1 ? 1 : 0;
                var type = status == 0 ? "black" : "white";
             //   var text = This.next().text();
			 //edit by zsx 取html而不是text，否则会有xss漏洞。
				var text = This.next().find("#data").html();
				var text1 = $T.Xml.decode(text); //post的时候会$T.Xml.encode,所以...
                var len = This.parent().siblings().length;
                var obj = {
                    status: status,
                    text: text1,
                    type: type,
                    len: len,
                    parent: parent
                }
                var messages = self.model.getMessages.confirmDel;
                messages = $T.Utils.format(messages, [text]);

                var popup = M139.UI.Popup.create({
                    target: This,
                    icon: "i_warn",
                    width: "288",
                    buttons: [{ text: "确定", cssClass: "btnSure", click: function () {
                        self.delBlackWhite(obj);
                        if ($(".blacklist-page")) {
                            $(".blacklist-page").remove();
                        }
                        popup.close();
                    }
                    },
		            { text: "取消", click: function () { popup.close(); } }
	                ],
                    content: messages
                });
                $(".delmailTips").remove();
                popup.render();

            })
            $("#btnDelBlackMail,#btnDelBlackDomain,#btnDelWhiteMail,#btnDelWhiteDomain").click(function () {//多选删除
                var parent = $(this).parent().prev();
                var checked = parent.find("input:checked");
                var id = parent.attr("id");
                var status = id.indexOf("white") > -1 ? 1 : 0;
                var type = status == 0 ? "black" : "white";
                var len = checked.length;
                var str = "";
                var arr = [];
                for (var i = 0; i < len; i++) {
                  //  var text = checked.eq(i).parent().text();
					var text = checked.eq(i).parent().find("#data").html();
					text = $T.Xml.decode(text);
                    arr.push(text);
                }
                str = arr.join(",");
                if (str == "") {
                    self.getTop().$Msg.alert(
                        self.model.getMessages.selectMailToDel,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
                    return;
                }
                var allLength = $(this).parent().prev().children().length;
                if (len == allLength) {
                    var lenStatus = 0;
                }
                var messages = self.model.getMessages.delAll;
                var obj = {
                    status: status,
                    text: str,
                    type: type,
                    len: lenStatus,
                    parent: parent
                }
                top.$Msg.confirm(
                        messages,
                        function () {
                            self.delBlackWhite(obj);
                            if ($(".blacklist-page")) {
                                $(".blacklist-page").remove();
                            }
                        },
                        function () { },
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
            })
        },
        hideLayer: function () {
            var id = $("#virusMail");
            id.find(".blackbanner").remove();
        },
        showLayer: function () {
            var id = $("#virusMail");
            var item = $("#itemLayer");
            top.$App.setOpacityLayer(id, item);
        },
        /**
        *全选
        */
        selectAll: function () {
            $("#setSpam .selectall").live("click", function () {
                var userInput = $(this).parent().prev().find("input");
                if ($(this).find("input").attr("checked")) {
                    userInput.attr("checked", "checked")
                } else {
                    userInput.removeAttr("checked")
                }

            });
        }
    })
    );
    spamView = new M2012.Settings.Spam.View();
    spamView.renderBlackWhite("white");
    spamView.renderBlackWhite("black");
    spamView.render("setSpam");
})(jQuery, _, M139);



﻿/*global Backbone: false */

/**
  * @fileOverview 定义通讯录数据实体类
  */

(function (jQuery,_,M139){
    var $ = jQuery;
    var inM2012 = false;
    /**通讯录数据实体
    *@constructs M2012.Contacts.ContactsInfo
    */
    function ContactsInfo(options) {
        for (var p in options) {
            this[p] = options[p] || "";
        }
        var emails = this.emails = [];
        var mobiles = this.mobiles = [];
        var faxes = this.faxes = [];
        if (!this.name) this.name = (this.AddrFirstName || "") + (this.AddrSecondName || "");
        this.lowerName = this.name.toLowerCase();
        if (this.FamilyEmail) emails.push(this.FamilyEmail);
        if (this.OtherEmail) emails.push(this.OtherEmail);
        if (this.BusinessEmail) emails.push(this.BusinessEmail);

        if (this.MobilePhone) mobiles.push(this.MobilePhone);
        if (this.OtherMobilePhone) mobiles.push(this.OtherMobilePhone);
        if (this.BusinessMobile) mobiles.push(this.BusinessMobile);

        if (this.OtherFax) faxes.push(this.OtherFax);
        if (this.FamilyFax) faxes.push(this.FamilyFax);
        if (this.BusinessFax) faxes.push(this.BusinessFax);
        if (!inM2012) {
            inM2012 = Boolean(top.$App);
        }
        if (inM2012) {
            this.fixPhoto();
        }
    }
    var defPhoto;
    var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];
    var baseUrl;
    ContactsInfo.prototype =
        /**
        *@lends M2012.Contacts.ContactsInfo.prototype
        */
    {
        getMobileSendText: function () {
            var n = this.getFirstMobile();
            n = n && n.replace(/\D/g, "");
            if (!n) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + n + ">";
        },
        getEmailSendText: function () {
            var e = this.getFirstEmail();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFaxSendText: function () {
            var e = this.getFirstFax();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFirstEmail: function () {
            if (this.emails && this.emails[0]) return this.emails[0];
            return "";
        },
        getFirstMobile: function () {
            if (this.mobiles && this.mobiles[0]) return this.mobiles[0];
            return "";
        },
        getFirstFax: function () {
            if (this.faxes && this.faxes[0]) return this.faxes[0];
            return "";
        },
        /**
         *模糊搜索
         */
        match: function (keyword) {
            return [
            this.name,
            this.BusinessEmail,
            this.BusinessFax,
            this.BusinessMobile,
            this.CPName,
            this.FamilyEmail,
            this.FamilyFax,
            this.FirstNameword,
            this.Jianpin,
            this.MobilePhone,
            this.OtherEmail,
            this.OtherFax,
            this.OtherMobilePhone,
            this.Quanpin,
            this.UserJob].join("").toLowerCase().indexOf(keyword) > -1;
        },
        fixPhoto: function () {
            if (this.ImagePath) return;
            if (!defPhoto) {
                defPhoto = $App.getResourcePath() + "/images/face.png";
				/*不再用g2的域名访问地址
                baseUrl = M139.Text.Url.makeUrl(getDomain("webmail") + "/addr/apiserver/httpimgload.ashx", {
                    sid: $App.getSid()
                });
				*/
				//
				function getPhotoUploadedAddr() {
						var tmpurl = location.host;
						var url2 = "";
						if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
							url2 = "http://image0.139cm.com";
						} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
							url2 = "http://images.139cm.com";
						} else if (tmpurl.indexOf("10086ts") > -1) {
							url2 = "http://g2.mail.10086ts.cn";
						}else if(tmpurl.indexOf("10086rd") > -1){
							url2 = "http://static.rd139cm.com";
						}
						return url2 ;
				}
				baseUrl = getPhotoUploadedAddr()
            }
            if (this.ImageUrl) {
                if (this.ImageUrl.indexOf("http://") == 0) {
                    return;
                }
                this.ImagePath = this.ImageUrl;
            //  var path = this.ImagePath.toLowerCase(); 不能转大小写
				var path = this.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    this.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
					this.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                this.ImageUrl = defPhoto;
                this.ImagePath = "/upload/photo/nopic.jpg";
            }
        }
    }
    M139.namespace("M2012.Contacts.ContactsInfo", ContactsInfo);



})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录数据管理模块
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var isFirstLoadQueryUserInfo = true;
    M139.namespace("M2012.Contacts.Model", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.prototype*/
    {

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model
        */
        initialize: function (options) {
            this.initEvents();
        },

        /**
         *@inner
         */
        getUserNumber: function () {
            return top.$User.getUid();
        },

        /**
         *加载通讯录数据
         */
        loadMainData: function (options, callback) {
            options = options || {};
            var This = this;
            this.isLoading = true;

            //options.testUrl = "/m2012/js/test/html/contactsData.js";//用测试数据
            if (options.testUrl) {
                //测试数据
                $.get(options.testUrl, function (responseText) {
                    This.onMainDataLoad(M139.JSON.tryEval(responseText), callback);
                });
            } else {
                var requestData = {
                    GetUserAddrJsonData: {
                        //UserNumber: this.getUserNumber()
                    }
                };
                M2012.Contacts.API.call("GetUserAddrJsonData", requestData,
                    function (e) {
                        This.isLoading = false;
                        if (e) {
                            if (e.responseData) {
                                if (e.responseData.ResultCode == "0") {
                                    This.onMainDataLoad(e.responseData, callback);
                                } else if (e.responseData.ResultCode == "216") {
                                    $App.trigger("change:sessionOut", {}, true);
                                } else {
                                    M139.Logger.getDefaultLogger().error('addrsvr response error', e.responseData);
                                }
                            } else {
                                M139.Logger.getDefaultLogger().error('addrsvr response invalid', e.responseText);
                            }
                        } else {
                            M139.Logger.getDefaultLogger().error('addrsvr response empty');
                        }
                    }
                );
            }
        },


        loadQueryUserInfo: function (callback) {
            if (SiteConfig.m2012NodeServerRelease && $App.isShowWelcomePage() && isFirstLoadQueryUserInfo) {
                //第一次加载读欢迎页内联json
                var data = getWelcomeInlinedJSON();
                if (data) {
                    setTimeout(function () {
                        inlinedCallback(data, true);
                    }, 0);
                } else {
                    $App.on("welcome_QueryUserInfo_load", function (data) {
                        inlinedCallback(data, true);
                    });
                }
            } else {
                var client = new M139.ExchangeHttpClient({
                    name: "ContactsLoadMainDataHttpClient",
                    responseDataType: "JSON2Object"
                });
                client.on("error", function(e) {
                    if (options && _.isFunction(options.error)) {
                        options.error(e);
                    }
                });
                var reqData = "<QueryUserInfo><UserNumber>" + $User.getUid() + "</UserNumber></QueryUserInfo>";
                client.request(
                {
                    method: "post",
                    url: "/addrsvr/QueryUserInfo?sid=" + $App.query.sid + "&formattype=json",
                    data: reqData
                }, callback);
            }
            isFirstLoadQueryUserInfo = false;
            function inlinedCallback(data, todoClone) {//TODO Clone
                if (todoClone) {
                    data = $App.deepCloneJSON(data);
                }
                callback({
                    responseData: data
                });
                inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
            }
            function getWelcomeInlinedJSON() {
                var json = null;
                try {
                    json = document.getElementById("welcome").contentWindow.inlinedQueryUserInfoJSON;
                } catch (e) { }
                return json;
            }
        },

        //获取个人资料
        getUserInfo: function (options, callback) {
            var self = this;            
            if (!top.$User) {
                return;
            }
            
            options = options || {};
            
            //options.refresh true  每次都刷新数据
            if(self.UserInfoData && !options.refresh){
                if (callback && typeof (callback) == "function") {
                    try {
                        callback(self.UserInfoData);
                        return;
                    } catch (ex) {}
                }
            }

            self.getUserInfoWaiting = true;
            this.loadQueryUserInfo(
                function (e) {
                    if (e && e.responseData) {
                        var code = e.responseData.ResultCode;
                        var data = {
                            "code": "S_FALSE", //这是取缓存验证用户失败时默认的返回code
                            "ResultCode": code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }
                            data = {
                                "code": "S_OK",
                                "var": self.userInfoTranslate(e.responseData["UserInfo"][0])
                            };
                        }
                        self.UserInfoData = data;
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                    self.getUserInfoWaiting = false;
                }
            );
        },
        contactRequest:function(apiName,options,callback){
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });
            if (!options) { options = {}; }
            options.UserNumber = top.$User.getUid();
            var reqData = {};
            reqData[apiName]= options

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/"+apiName+"?sid=" + top.$App.query.sid + "&formattype=json",
                    data: reqData
                },
                function (e) {
                    if (callback) {callback(e); }
                }
            );
        },
        //修改个人资料
        modifyUserInfo: function (userInfo, callback) {
			var self = this;
            this.contactRequest("ModUserInfo", userInfo, function (e) {
				self.UserInfoData = null;
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });
        },
        modifyGroup:function(options,callback){
            //<EditGroupList><UserNumber>8613590330157</UserNumber><GroupId>1171021884</GroupId><SerialId>1025214752</SerialId><GroupType>1</GroupType></EditGroupList>
            this.contactRequest("EditGroupList", options, function (e) {
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });

        },
        userInfoTranslate: function (UserInfo) {
            var map = {
                "a": "UserType",
                "b": "SourceType",
                "c": "AddrFirstName",
                "d": "AddrSecondName",
                "e": "AddrNickName",
                "f": "UserSex",
                "g": "CountryCode",
                "h": "ProvCode",
                "i": "AreaCode",
                "j": "CityCode",
                "k": "StreetCode",
                "l": "ZipCode",
                "m": "HomeAddress",
                "n": "MobilePhoneType",
                "o": "BirDay",
                "p": "MobilePhone",
                "q": "BusinessMobile",
                "r": "BusinessPhone",
                "s": "FamilyPhone",
                "t": "BusinessFax",
                "u": "FamilyFax",
                "v": "OtherPhone",
                "w": "OtherMobilePhone",
                "x": "OtherFax",
                "y": "FamilyEmail",
                "z": "BusinessEmail",
                "c2": "OtherEmail",
                "c3": "PersonalWeb",
                "c4": "CompanyWeb",
                "c5": "OtherWeb",
                "c6": "OICQ",
                "c7": "MSN",
                "c8": "OtherIm",
                "c9": "CPCountryCode",
                "d0": "CPProvCode",
                "d1": "CPAreaCode",
                "a0": "CPCityCode",
                "a1": "CPStreetCode",
                "a2": "CPZipCode",
                "a3": "CPAddress",
                "a4": "CPName",
                "a5": "CPDepartName",
                "a6": "Memo",
                "a7": "ContactCount",
                "a8": "ContactType",
                "a9": "ContactFlag",
                "b0": "SynFlag",
                "b1": "SynId",
                "b2": "RecordSeq",
                "b3": "FirstNameword",
                "b4": "CountMsg",
                "b5": "StartCode",
                "b6": "BloodCode",
                "b7": "StateCode",
                "b8": "ImageUrl",
                "b9": "SchoolName",
                "c0": "BokeUrl",
                "c1": "UserJob",
                "e1": "FamilyPhoneBrand",
                "e2": "BusinessPhoneBrand",
                "e3": "OtherPhoneBrand",
                "e4": "FamilyPhoneType",
                "e5": "BusinessPhoneType",
                "e6": "OtherPhoneType",
                "e7": "EduLevel",
                "e8": "Marriage",
                "e9": "NetAge",
                "e0": "Profession",
                "f1": "Income",
                "f2": "Interest",
                "f3": "MoConsume",
                "f4": "ExpMode",
                "f5": "ExpTime",
                "f6": "ContactMode",
                "f7": "Purpose",
                "f8": "Brief",
                "f9": "FavoEmail",
                "f0": "FavoBook",
                "g1": "FavoMusic",
                "g2": "FavoMovie",
                "g3": "FavoTv",
                "g4": "FavoSport",
                "g5": "FavoGame",
                "g6": "FavoPeople",
                "g7": "FavoWord",
                "g8": "Character",
                "g9": "MakeFriend",
                "ui": "UserInfo",
                "un": "UserNumber",
                "sd": "SerialId",
                "gd": "GroupId",
                "gp": "Group",
                "gi": "GroupInfo",
                "ct": "Contacts",
                "ci": "ContactsInfo",
                "gl": "GroupList",
                "li": "GroupListInfo",
                "tr": "TotalRecord",
                "rc": "ResultCode",
                "rm": "ResultMsg",
                "gn": "GroupName",
                "cn": "CntNum",
                "ri": "RepeatInfo",
                "lct": "LastContacts",
                "lctd": "LastContactsDetail",
                "lci": "LastContactsInfo",
                "cct": "CloseContacts",
                "cci": "CloseContactsInfo",
                "an": "AddrName",
                "at": "AddrType",
                "ac": "AddrContent",
                "us": "UserSerialId",
                "ai": "AddrId",
                "lid": "LastId",
                "ate": "AddrTitle",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "cf": "ComeFrom",
                "cte": "CreateTime",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "Bct": "BirthdayContacts",
                "bci": "BirthdayContactInfo"
            }
            var result = {};
            for (elem in UserInfo) {
                if (map[elem]) {
                    result[map[elem]] = UserInfo[elem];
                }
            }
            return result;
        },
        //获取隐私设置
        getPrivateSettings: function (callback) {
            if (!window.$User) {
                return;
            }

            var self = this;
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                responseDataType: "JSON2Object"
            });

            var reqData = "<GetPrivacySettings><UserNumber>" + $User.getUid() + "</UserNumber></GetPrivacySettings>";

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/GetPrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {

                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var code = respData.ResultCode;
                        var data = {
                            "code": "S_FALSE" //这是取缓存验证用户失败时默认的返回code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }

                            data = {
                                "code": "S_OK",
                                "var": {
                                    "addMeRule": respData.WhoAddMeSetting,
                                    "UserInfoSetting": respData.UserInfoSetting //这个是一个对象
                                }
                            };
                        }
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                }
            );
        },

        //更新隐私设置
        //注意：经测试，如果UserInfoSetting未传递所有值，则未传递的值默认设置为“仅好友可见”，值为0
        //建议暂不使用此接口设置数据
        /*
        options={
              UserNumber:8613800138000, //此字段可忽略，会自动添加
              WhoAddMeSetting:0,
              UserInfoSetting:{
                AddrFirstName:0,
                UserSex:0,
                BirDay:0,
                ImageUrl:0,
                FamilyEmail:0,
                MobilePhone:0,
                FamilyPhone:0,
                OtherIm:0,
                HomeAddress:0,
                CPName:0,
                UserJob:0,
                BusinessEmail:0,
                BusinessMobile:0,
                BusinessPhone:0,
                CPAddress:0,
                CPZipCode:0
              }
            }
        */
        updatePrivateSettings: function (options, callback) {
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });

            var UserNumber = $User.getUid();
            var reqData = { "UserNumber": UserNumber }; //默认加上号码
            reqData = { "SavePrivacySettings": $.extend(reqData, options) };

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/SavePrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {
                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var result = {
                            "code": (respData.ResultCode == "0" ? "S_OK" : respData.ResultCode) || "FS_UNKNOWN",
                            "var": {
                                "msg": respData.ResultMsg || ""
                            }
                        };

                        if (callback) {
                            callback(result);
                        }
                    }
                }
            );
        },
        /**
         *获取通讯录数据
         */
        requireData: function (callback) {
            var data = this.get("data");
            if (data) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (!this.isLoading) {
                    this.loadMainData();
                }
                this.on("maindataload", function (data) {
                    this.off("maindataload", arguments.callee);
                    if (callback) {
                        setTimeout(function () {
                            callback(data);
                        }, 0);
                    }
                });
            }
        },

        /**通讯是否已加载*/
        isLoaded: function () {
            return !!this.get("data");
        },

        /**
         *通讯录数据加载完成后处理数据
         *@inner
         */
        onMainDataLoad: function (json, callback) {
            json.Groups = json.Group || json.Groups;

            //后台不输出数组的时候容错
            if (!json.LastContacts) json.LastContacts = [];
            if (!json.CloseContacts) json.CloseContacts = [];
            if (!json.BirthdayContacts) json.BirthdayContacts = [];
            if (!json.Contacts) json.Contacts = [];
            if (!json.Groups) json.Groups = [];
            if (!json.GroupMember) json.GroupMember = {};
            if (!json.NoGroup) json.NoGroup = [];

            json.TotalRecord = parseInt(json.TotalRecord);
            json.TotalRecordGroup = parseInt(json.TotalRecordGroup);
            json.TotalRecordRelation = parseInt(json.TotalRecordRelation);
            json.userSerialId = json.UserSerialId;

            var exports = {
                TotalRecord: json.TotalRecord,
                TotalRecordGroup: json.TotalRecordGroup,
                TotalRecordRelation: json.TotalRecordRelation,
                noGroup: json.NoGroup
            };

            //分组
            this.createGroupData({
                data: json,
                exports: exports
            });

            //联系人
            this.createContactsData({
                data: json,
                exports: exports
            });

            //组关系
            this.createGroupMemberData({
                data: json,
                exports: exports
            });
            //处理最近、紧密联系人
            this.createLastAndCloseContactsData({
                data: json,
                exports: exports
            });

            //处理生日联系人
            this.createBirthdayContactsData({
                data: json,
                exports: exports
            });
            
            //处理VIP联系人
            this.createVIPContactsData({
                data: json,
                exports: exports
            });
            
            //处理用户个人资料  QueryUserInfo合并至GetUserAddrJsonData接口输出
            if(json["UserInfo"] && json["UserInfo"][0]){
                this.UserInfoData = {
                    "code": "S_OK",
                    "var": this.userInfoTranslate(json["UserInfo"][0])
                };
            }

            this.set("data", exports);
            this.trigger("maindataload", exports);
            if (callback) callback(exports);
        },

        /**
         *加载通讯录主干数据后处理分组数据
         *@inner
         */
        createGroupData: function (options) {
            if (options.append) {
                //添加新组后更新缓存
                var data = this.get("data");
                var groups = data.groups;
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                var newGroup = {
                    GroupId: options.append.groupId,
                    id: options.append.groupId,
                    GroupName: options.append.groupName,
                    name: options.append.groupName,
                    CntNum: 0,
                    count: 0
                };
                groups.push(newGroup);
                groupsMap[newGroup.id] = newGroup;
                groupMember[newGroup.id] = [];
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataGroups = data.Groups;
                var groups = new Array(dataGroups.length);
                var groupsMap = {};
                for (var i = 0, len = dataGroups.length; i < len; i++) {
                    var g = dataGroups[i];
                    groupsMap[g.gd] = groups[i] = {
                        GroupId: g.gd,
                        id: g.gd,
                        GroupName: g.gn,
                        name: g.gn,
                        CntNum: g.cn,
                        count: g.cn
                    };
                }
                exports.groups = groups;
                exports.groupsMap = groupsMap;
            }
        },

        /**
         *加载通讯录主干数据后处理联系人数据
         *@inner
         */
        createContactsData: function (options) {
            if (options.remove) {
                var data = this.get("data");
                var serialId = options.serialId;
                delete data.contactsMap[serialId];
                delete data.contactsIndexMap[serialId];
                var contacts = data.contacts;
                for (var i = contacts.length - 1; i >= 0; i--) {
                    if (contacts[i].SerialId == serialId) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                data.emailHash = null;//清除字段缓存
            } else if (options.append) {
                var data = this.get("data");
                var newContacts = options.append;
                var contacts = data.contacts;
                var contactsMap = data.contactsMap;
                var contactsIndexMap = data.contactsIndexMap;
                var nogroup = data.noGroup;
                for (var i = 0; i < newContacts.length; i++) {
                    var c = newContacts[i];
                    c.Quanpin = c.FullNameword || "";
                    c.Jianpin = c.FirstWord || "";

                    var info = new M2012.Contacts.ContactsInfo(c);
                    contacts[contacts.length] = info;
                    contactsMap[info.SerialId] = info;
                    contactsIndexMap[info.SerialId] = contacts.length;
                }
                data.emailHash = null;//清除字段缓存
                data.TotalRecord += newContacts.length;
            }else{
                var exports = options.exports;
                var data = options.data;
                var dataContacts = data.Contacts

                var contacts = new Array(dataContacts.length);
                var contactsMap = {};
                var contactsIndexMap = {};

                var csClass = M2012.Contacts.ContactsInfo;
                for (var i = 0, len = dataContacts.length; i < len; i++) {
                    var c = dataContacts[i];
                    var info = new csClass({
                        SerialId: c.sd,
                        AddrFirstName: c.c,
                        AddrSecondName: c.d,
                        MobilePhone: c.p,
                        BusinessMobile: c.q,
                        OtherMobilePhone: c.w,
                        FamilyEmail: (c.y || "").toLowerCase(),
                        BusinessEmail: (c.z || "").toLowerCase(),
                        OtherEmail: (c.c2 || "").toLowerCase(),
                        FirstNameword: (c.b3 || "").toLowerCase(),
                        FamilyFax: c.u,
                        BusinessFax: c.t,
                        OtherFax: c.x,
                        ImageUrl: c.b8,
                        Quanpin: (c.d2 || "").toLowerCase(),
                        Jianpin: (c.d3 || "").toLowerCase(),
                        CPName: c.a4,
                        UserJob: c.c1
                    });
                    contacts[i] = info;
                    contactsMap[c.sd] = info;
                    contactsIndexMap[c.sd] = i;
                }
                exports.contacts = contacts;
                exports.contactsMap = contactsMap;
                exports.contactsIndexMap = contactsIndexMap;
            }

            //刷新通讯录标签
            var addrtab = $App.getTabByName("addr");
            if (addrtab) {
                addrtab.isRendered = false;
            }
        },

        updateContactsData: function (options) {
            var data = this.get("data");
            var contactinfos = options.modification;
            var map = data.map || [];
            var contacts = data.contacts;
            var contactsMap = data.contactsMap;
            var groupsMap = data.groupsMap;

            var j, k, flag, groups = [];

            for (k = contactinfos.length; k--; ) {

                var info = new M2012.Contacts.ContactsInfo(contactinfos[k]);
                contactsMap[info.SerialId] = info;

                for (j = contacts.length; j--; ) {
                    if (contacts[j].SerialId == info.SerialId) {
                        contacts[j] = info;
                        break;
                    }
                }

                //删除现有map后重建关系
                groups.length = 0;
                for (j = map.length; j--; ) {
                    if (map[j].SerialId == info.SerialId) {
                        groups.push(map[j].GroupId);
                        map.splice(j, 1);
                    }
                }

                //先删除groups、groupsMap 的联系人数，注意groups是旧的组关系
                for (j = groups.length; j--; ) {
                    flag = groupsMap[groups[j]];
                    flag.count = parseInt(flag.count) - 1;
                    flag.CntNum = parseInt(flag.CntNum) - 1;
                }

                //重建map
                groups = info.GroupId.split(','); //groups有""的元素
                for (j = groups.length; j--; ) {
                    if (groups[j]) {
                        map.push({ SerialId: info.SerialId, GroupId: groups[j] });
                        flag = groupsMap[groups[j]];
                        flag.count = parseInt(flag.count) + 1;
                        flag.CntNum = parseInt(flag.CntNum) + 1;
                    }
                }

                //更新未分组
                for (j = data.noGroup.length; j--; ) {
                    if (data.noGroup[j] == info.SerialId) {
                        data.noGroup.splice(j, 1);
                        break;
                    }
                }

                if (groups.length == 0) {
                    data.noGroup.push(String(info.SerialId));
                    if (data.groupedContactsMap) {
                        delete data.groupedContactsMap[info.SerialId];
                    }
                } else {
                    if (data.groupedContactsMap) {
                        data.groupedContactsMap[info.SerialId] = 1;
                    }
                }

            }
            if(data.emailHash){//还要更新二级hash缓存
                if(info.emails && info.emails.length>0){
                    data.emailHash[info.emails[0]]=info;
                 }
            }
            groups.length = 0;
            groups = null;
        },


        /**
         *加载通讯录主干数据后处理联系人组关系数据
         *@inner
         */
        createGroupMemberData: function (options) {
            if (options.append) {
                //添加组关系缓存
                var appendItem = options.append;//格式为{SerialId:"",groups:[]}
                var groups = appendItem.GroupId;
                
                groups = groups.length == 0 ? [] : groups;
                groups = _.isString(groups) ? groups.split(",") : groups;

                var data = this.get("data");
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                if (groups.length == 0) {
                    //如果没分组，联系人id添加到noGroup
                    data.noGroup.push(appendItem.SerialId);
                } else {
                    _.each(groups, function (gid) {
                        var gm = groupMember[gid];
                        if (_.isUndefined(gm)) {
                            data.groupMember[gid] = [];
                            gm = data.groupMember[gid];
                        }

                        gm.push(appendItem.SerialId);
                        groupsMap[gid].CntNum = gm.length;
                    });
                }
            } else {
                var data = options.data;
                var exports = options.exports;
                var contactsMap = exports.contactsMap;
                var groupsMap = exports.groupsMap;
                var groupMember = data.GroupMember;
                for (var gid in groupMember) {
                    var group = groupsMap[gid];
                    if (!group) {
                        if(/^\d+$/.test(gid)){
                            delete groupsMap[gid];//删除组脏数据
                        }
                    } else {
                        var members = groupMember[gid];
                        for (var i = 0; i < members.length; i++) {
                            if (!contactsMap[members[i]]) {
                                members.splice(i, 1);//删除联系人脏数据
                                i--;
                            }
                        }
                        group.CntNum = members.length;
                    }
                }
                exports.groupMember = groupMember;
            }
        },

        /**
         *加载通讯录主干数据后处理最近联系人和紧密联系人数据
         *@inner
         */
        createLastAndCloseContactsData: function (options) {
            if (options.append) {
                var data = this.get("data");

                var lastestContacts = data.lastestContacts;
                if (!$.isArray(lastestContacts)) {
                    return;
                }

                var items = options.append || [];
                for (var i = 0; i < items.length; i++) {
                    var l = items[i];
                    lastestContacts.unshift(l);
                }
                var map = {};
                //排除重复
                for (var i = 0; i < lastestContacts.length; i++) {
                    var l = lastestContacts[i];
                    if (map[l.AddrContent]) {
                        lastestContacts.splice(i, 1);
                        i--;
                    } else {
                        map[l.AddrContent] = 1;
                    }
                }
                if (lastestContacts.length > 50) {
                    lastestContacts.length = 50;
                }
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataLastContacts = data.LastContacts;
                var dataCloseContacts = data.CloseContacts;
                var lastestContacts = [];
                var closeContacts = [];


                for (var i = 0, len = dataLastContacts.length; i < len; i++) {
                    var l = dataLastContacts[i];
                    if (typeof l.ac == "object") continue;//不懂？
                    lastestContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }

                for (var i = 0, len = dataCloseContacts.length; i < len; i++) {
                    var l = dataCloseContacts[i];
                    if (typeof l.ac == "object") continue;
                    closeContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }
                exports.lastestContacts = lastestContacts;
                exports.closeContacts = closeContacts;
            }
        },

        /**
         *加载通讯录主干数据后处理过生日的联系人数据
         *@inner
         */
        createBirthdayContactsData: function (options) {
            var exports = options.exports;
            var data = options.data;
            var dataBirContacts = data.BirthdayContacts;
            var birthdayContacts = new Array(dataBirContacts.length);
            for (var i = dataBirContacts.length - 1; i >= 0; i--) {
                var k = dataBirContacts[i];
                birthdayContacts[i] = {
                    SerialId: k.sd,
                    AddrName: k.an,
                    MobilePhone: k.p,
                    FamilyEmail: k.y,
                    BusinessEmail: k.z,
                    OtherEmail: k.c2,
                    BirDay: k.o
                };
            };
            exports.birthdayContacts = birthdayContacts;
        },

        /**
         *处理vip联系人数据
         *@inner
         */
        createVIPContactsData: function (options) {
            //"Vip":[{"vipg":"1158807544","vipc":"188722633,998324356","vipn":"2"}]
            var data = options.data;
            var exports = options.exports;
            var vipData = data.Vip && data.Vip[0];
            var vip = {};
            if (vipData) {
                try{
                    vip.groupId = vipData.vipg;
                    vip.contacts = vipData.vipc ? vipData.vipc.split(",") : [];
                } catch (e) {
                    //todo
                }
            }
            exports.vip = vip;
        },

        /**
         *根据联系人id获得对象
         *@param {String} cid 联系人id (SerialId)
         *@returns {M2012.Contacts.ContactsInfo} 返回联系人对象
         */
        getContactsById: function (cid) {
            return this.get("data").contactsMap[cid] || null;
        },
        /**
         *根据联系人id获取当前联系人的所有组
         *@param {String} cid 联系人id (SerialId)
         *@returns [] 返回联系人组
         */
        getContactsGroupById: function(cid){
            var groups = [];
            var member = this.get("data").groupMember;
            for(var key in member){
                if(member[key] && member[key].length > 0){
                    if(member[key].join(',').indexOf(cid) > -1){
                        groups.push(key);
                    }
                }
            }

            return groups;
        },
        /**
         *根据组id获得对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupById: function (gid) {
            return this.get("data").groupsMap[gid] || null;
        },

        /**
         *根据组名获得组对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupByName: function (groupName) {
            var groups = this.getGroupList();
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                if (g.name === groupName) {
                    return g;
                }
            }
            return null;
        },


        /**
         *获得联系人的分组id列表
         *@param {String} serialId 联系人id
         *@returns {Object} 返回组对象
         */
        getContactsGroupId: function (serialId) {
            var groupMember = this.get("data").groupMember;
            var groups = [];
            for (var gid in groupMember) {
                var members = groupMember[gid];
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i] === serialId) {
                        groups.push(gid);
                        break;
                    }
                }
            }
            return groups;
        },

        /**
         *返回一个联系组的克隆列表
         *@returns {Array} 返回数组
         */
        getGroupList: function () {
            var groups = this.get("data");
            if (groups) {
                groups = groups.groups;
            }

            if (groups && _.isFunction(groups.concat)) {
                groups = groups.concat();
            } else {
                groups = [];
            }

            return groups;
        },
        /**
         *返回一个分组共有多少联系人，数据接口输出的有可能不准确，可纠正
         *@param {String} gid 组id (groupId)
         *@returns {Number} 返回组联系人个数
         */
        getGroupMembersLength: function (gid) {
            var group = this.getGroupById(gid);
            if (!group) {
                throw "M2012.Contacts.Model.getGroupContactsLength:不存在联系人分组gid=" + gid;
            }
            return group.CntNum;
        },
        /**
         *返回一个联系组的所有联系人id
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[seriaId,seriaId,seriaId]
         */
        getGroupMembersId: function (gid, options) {
            var result = this.getGroupMembers(gid, options);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = result[i].SerialId;
            }
            return result;
        },
        /**
         *返回一个联系组的所有联系人列表
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        getGroupMembers: function (gid, options) {
            options = options || {};
            var filter = options.filter;                        
            var cData = this.get("data");
            var contactsMap = cData.contactsMap;
            var groupMember = cData.groupMember;
            var result = [];
            if (gid == this.getVIPGroupId()) {
                result = this.getVIPContacts();
            } else {
                var gm = groupMember[gid];
                if (gm) {
                    for (var i = 0, len = gm.length; i < len; i++) {
                        var cid = gm[i];
                        var c = contactsMap[cid];
                        if (c) {
                            result.push(c);
                        }
                    }
                }
            }
            if (options && options.filter) {
                result = this.filterContacts(result, { filter: options.filter, colate: options.colate });
            }
            return result;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            var data = this.get("data");
            var result = [];
            var vip = data && data.vip;
            var contactsMap = data && data.contactsMap;
            if (vip && vip.contacts) {
                var contacts = vip.contacts;
                for (var i = 0; i < contacts.length; i++) {
                    var c = contacts[i];
                    var item = contactsMap[c];
                    if (item) {//vip联系人有可能被删除了
                        result.push(item);
                    }
                }
            }
            return result;
        },
        /**
         *获得vip分组id
         */
        getVIPGroupId: function () {
            var id = "";
            var data = this.get("data");
            if (data && data.vip) {
                id = data.vip.groupId;
            }
            return id;
        },

        /**
         *筛选联系人
         *@param {Array} contacts 要筛选的联系人
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选属性：email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        filterContacts: function (contacts, options) {
            var filter = options.filter;
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (filter == "email" && c.getFirstEmail()) {
                    result.push(c);
                } else if (filter == "mobile" && c.getFirstMobile()) {
                    result.push(c);
                } else if (filter == "fax" && c.getFirstFax()) {
                    result.push(c);
                } else if (options.colate && c.getFirstEmail().indexOf(filter) > -1) {
                    result.push(c); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
            }
            return result;
        },

        /**
         *绑定一些事件
         *@inner
         */
        initEvents:function(){
            var self = this;
            var E = "dataForMatch_email", M = "dataForMatch_mobile", F = "dataForMatch_fax";

            //清除用来做索引的缓存
            self.on("update", function (e) {
                if (e.type == "AddSendContacts" || e.type == "AddContacts" || e.type == "EditContacts") {
                    if (self.has(E)) {
                        self.unset(E);
                    }

                    if (self.has(M)) {
                        self.unset(M);
                    }

                    if (self.has(F)) {
                        self.unset(F);
                    }
                }
            });

            //重新加载联系人数据时，也清理做索引的缓存
            self.on("maindataload", function () {
                if (self.has(E)) {
                    self.unset(E);
                }

                if (self.has(M)) {
                    self.unset(M);
                }

                if (self.has(F)) {
                    self.unset(F);
                }
            });
        },

        //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
        getDataForMatch: function (filter) {
            var dataKey = "dataForMatch_" + filter;
            var data = this.get(dataKey);
            if (!data) {
                var contacts = this.filterContacts(this.get("data").contacts, {
                    filter: filter
                });
                data = getOldLinkManList(contacts, filter);
                this.set(dataKey, data);
            }
            return data;
            function getOldLinkManList(contacts, filter) {
                var key;
                if (filter == "email") {
                    key = "emails";
                } else if (filter == "fax") {
                    key = "faxes";
                } else if (filter == "mobile") {
                    key = "mobiles";
                }
                var linkManList = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var c = contacts[i];
                    var addrs = c[key];
                    for (var j = 0; j < addrs.length; j++) {
                        var addr = addrs[j];
                        linkManList.push({
                            name: c.name,
                            lowerName: c.lowerName,
                            addr: addr,
                            id: c.SerialId,
                            quanpin: c.Quanpin,
                            jianpin: c.Jianpin
                        });
                    }
                }
                return linkManList;
            }
        },
        /**
         *根据输入匹配联系人
         *@inner
         */
        getInputMatch: function (options) {
            var contacts = this.getDataForMatch(options.filter);
            var keyword = options.keyword;
            var len = contacts.length;
            var matches = [];
            var matchTable = {};
            var attrToNumber = {
                "addr": "01",
                "name": "02",
                "quanpin": "03",
                "jianpin": "04"
            }
            var numberToAttr = {
                "01": "addr",
                "02": "name",
                "03": "quanpin",
                "04": "jianpin"
            }
            var SPLIT_CHAR = "0._.0";//匹配键的分隔符
            //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
            function pushMatch(attrName, index, arrIndex) {
                var matchKey = index + SPLIT_CHAR + attrName;
                if (index < 10) matchKey = "0" + matchKey;
                var arr = matchTable[matchKey];
                if (!arr) matchTable[matchKey] = arr = [];
                arr.push(arrIndex);
            }
            for (var i = 0; i < len; i++) {
                var item = contacts[i];
                //if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
                var minIndex = 10000;
                var minIndexAttr = null;
                var index = item.addr.indexOf(keyword);
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.addr;
                }
                if (index == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
                index = item.lowerName.indexOf(keyword && keyword.toLowerCase());// update by tkh 用户输入的关键字统一转换成小写
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.name;
                }
                if (minIndex == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }

                if (!/[^a-zA-Z]/.test(keyword)) {
                    if (item.quanpin && item.jianpin) {
                        index = item.quanpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.quanpin;
                        }
                        if (minIndex == 0) {
                            pushMatch(minIndexAttr, minIndex, i);
                            continue;
                        }
                        index = item.jianpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.jianpin;
                        }
                    }
                }
                if (minIndexAttr) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
            }

            var allMatchKeys = [];
            for (var p in matchTable) {
                allMatchKeys.push(p);
            }
            allMatchKeys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            var MAX_COUNT = options.maxLength || 30;
            for (var i = 0; i < allMatchKeys.length; i++) {
                var k = allMatchKeys[i];
                var arr = matchTable[k];
                //从key中获取matchAttr和matchIndex，后面用于着色加粗
                var matchAttr = getAttrNameFromKey(k);
                var matchIndex = getMatchIndexFromKey(k);
                for (var j = 0; j < arr.length; j++) {
                    var arrIndex = arr[j];
                    matches.push({
                        info: contacts[arrIndex],
                        matchAttr: matchAttr,
                        matchIndex: matchIndex
                    });
                    if (matches.length >= MAX_COUNT) break;
                }
            }
            //var matchKey = index + SPLIT_CHAR + attrName;
            function getAttrNameFromKey(key) {
                return numberToAttr[key.split(SPLIT_CHAR)[1]];
            }
            function getMatchIndexFromKey(key) {
                return parseInt(key.split(SPLIT_CHAR)[0], 10);
            }
            return matches;
        },

        /**搜索联系人：姓名、拼音、传真、职位等
         *@param {String} keyword 搜索关键字
         *@param {Object} options 搜索选项集
         *@param {Array} options.contacts 要搜索的联系人集（否则是全部联系人）
         */
        search: function (keyword, options) {
            options = options || {};
            if (options.contacts) {
                var contacts = options.contacts;
            } else {
                var contacts = this.get("data").contacts;
                if (options.filter) {
                    contacts = this.filterContacts(contacts, { filter: options.filter });
                }
            }
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (c.match(keyword)) {
                    result.push(c);
                }
            }
            return result;
        },
        /**
         *得到地址
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getAddr: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getEmail(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getNumber(text);
            }
            return "";
        },
        /**
         *得到名字
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getName: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getName(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getName(text);
            }
            return "";
        },

        /**
         *得到发送文本 "name"<addr>
         *@param {String} name 姓名
         *@param {String} addr 地址
         *@example
         var text = model.getSendText("李福拉","lifula@139.com");
         var text = model.getSendText("李福拉","15889394143");
         */
        getSendText: function (name, addr) {
            name = (name || "") && name.replace(/["\r\n]/g, " ");
            return "\"" + name + "\"<" + addr + ">";
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByEmail: function (email) {
            email = $Email.getEmailQuick(email);
            var item = this.getHashContacts()[email];
            if (item) {
                return [item];
            } else {
                return [];
            }
        },

        getHashContacts:function(){
            var data = this.get("data");
            if (!data) return {};
            if (!data.emailHash) {
                var contacts = data.contacts;
                var hash = {};
                if (contacts) {
                    for (var i = 0, len = contacts.length; i < len; i++) {
                        var c = contacts[i];
                        for (var j = 0; j < c.emails.length; j++) {
                            hash[c.emails[j]] = c;
                        }
                    }
                }
                data.emailHash = hash;
            }
            return data.emailHash || {};
        },

        /**
         *根据手机号获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByMobile: function (mobile) {
            var data = this.get("data");
            var result = [];
            if (!data || !data.contacts) return result;
            for (var i = 0, contacts = data.contacts, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    if (c.mobiles[j] == mobile) {
                        result.push(c);
                    }
                }
            }
            return result;
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {String} 返回联系人姓名，如果找不到，返回@前的账号部分
         */
        getAddrNameByEmail: function (email) {
            email = email.trim();
            var c = this.getContactsByEmail(email);
            if (c && c.length > 0) {
                return c[0].name;
            } else {
                var name = $Email.getNameQuick(email);
                if (name && name.replace(/['"\s]/g,"") != "") {
                    return name;
                } else {
                    name = email.replace(/<[^>]+>$/, "");
                    if (name && name.replace(/['"\s]/g, "") != "") {
                        return name;
                    } else {
                        return email;
                    }
                }
            }
        },

        /**
         *更新通讯录缓存数据
         */
        updateCache: function (options) {
            var type = options.type;
            switch (type) {
                case "AddGroup":
                    this.createGroupData({
                        append:options.data
                    });
                    break;
                case "DeleteContacts":
                    this.createContactsData({
                        remove:options.data
                    });
                    break;

                case "AddSendContacts":
                    //添加最近联系人
                    this.createLastAndCloseContactsData({
                        append: options.data.items
                    });
                    var newContacts = options.data.newContacts;
                    //添加新联系人
                    if (newContacts && newContacts.length > 0) {
                        this.createContactsData({
                            append:newContacts
                        });

                        for (var i = 0, m = newContacts.length; i < m; i++) {
                            this.createGroupMemberData({ append: newContacts[i] });
                        }
                    }

                    //if (c.GroupId) {
                    //    var groups = c.GroupId.split(','), group;
                    //    for (var j = groups.length; j--; ) {
                    //        group = data.groupMember[groups[j]];
                    //        if (group) {
                    //            group.push(info.SerialId);
                    //        }

                    //        group = data.groupsMap[groups[j]];
                    //        if (group) {
                    //            group.CntNum = Number(group.CntNum) + 1;
                    //            group.count = group.CntNum;
                    //        }
                    //    }
                    break;

                case "AddContacts":
                    this.createContactsData({
                        append: _.isArray(options.data) ? options.data : [options.data]
                    });
                    var data = _.isArray(options.data) ? options.data[0] : options.data;
                    if (data && data.GroupId) {
                        this.createGroupMemberData({
                            append: data
                        });
                    }
                    break;

                case "EditContacts":
                    this.updateContactsData({
                        modification: _.isArray(options.data) ? options.data : [options.data]
                    });
                    break;

            }

            /**服务端响应事件
            * @name M2012.Contacts.Model#update
            * @event
            * @param {Object} e 事件参数
            * @param {String} e.type 更新行为：AddGroup|AddContacts|EditGroup
            * @param {Object} e.data 更新的数据
            * @example
            model.on("update",function(e){
                console.log(e.type);
                console.log(e);
            });
            */
            this.trigger("update", options);

        },

        /**
         * 获取通讯录现有总条数
         * @param {Function} 回调函数，这是可等待数据加载成功后才给出的
         * @return {Number} 总条数，如果未加载到数据，则返回 -1
         */
        getContactsCount: function(callback) {

            if (callback) {
                M139.Timing.waitForReady('"undefined" !== typeof top.$App.getModel("contacts").get("data").contacts.length', function () {
                    callback(this.get("data").contacts.length);
                });
            }

            if (this.isLoaded()) {
                return this.get("data").contacts.length;
            } else {
                return -1;
            }
        }
    }));


    jQuery.extend(M2012.Contacts,
    /**@lends M2012.Contacts*/
    {
        /**返回一个M2012.Contacts.Model模块实例*/
        getModel: function () {

            if (window != window.top) {
                return top.M2012.Contacts.getModel();
            }

            if (!this.current) {
                this.current = new M2012.Contacts.Model();
            }
            return this.current;
        }

    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录地址本对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.AddressBook";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.AddressBook.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.AddressBook
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 地址本类型:email|mobile|fax|mixed
        *@param {String} options.receiverText 显示接收人标题（默认为"接收人")
        *@param {String} options.dialogTitle 对话框标题（默认为"从联系人添加");
        *@param {Boolean} options.getDetail 是否返回object类型的联系人数据
        *@param {Boolean} options.showLastAndCloseContacts 是否显示最近联系人、紧密联系人（默认值为true)
        *@param {Boolean} options.showVIPGroup 是否显示最近联系人、紧密联系人（默认值为true)
        *@example
        */
        initialize: function (options) {
            this.filter = options.filter;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:['<div class="addFormContact">',
             '<table>',
                 '<tbody><tr>',
                     '<td width="193">联系人(<var class="Label_ContactsLength"></var>)</td>',
                     '<td width="36"></td>',
                     '<td width="195"><var class="Label_ReceiverText"></var></td>',
                 '</tr>',
                 '<tr>',
                     '<td>',
                     '<div class="addFcLeft p_relative AddressBookContainer">',
                     '</div>',
                     '</td>',
                     '<td class="ta_c"><i class="i_addjt"></i></td>',
                     '<td>',
                         '<div style="width:221px;" class="menuPop addFcRight">',
                             /*
                             '<a href="#" class="lia">',
                                 '<i class="i_del"></i>',
                                 '<span>18688959302 sdfsdffffffffffffffffffffffffffffffff</span>',
                             '</a>',
                             */
                         '</div>',
                     '</td>',
                 '</tr>',
             '</tbody></table>',
         '</div>'].join(""),

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(){
                This.onSelect();
            },function(){
                This.onCancel();
            },{
                width:"500px",
                buttons:["确定","取消"],
                dialogTitle:options.dialogTitle || "从联系人添加"
            });

            this.addressBook = new M2012.UI.Widget.Contacts.View({
                container: this.dialog.$(".AddressBookContainer")[0],
                showLastAndCloseContacts: options.showLastAndCloseContacts,
                showVIPGroup: options.showVIPGroup,
                showSelfAddr:options.showSelfAddr,
                maxCount: options.maxCount,
                selectMode:true,
                filter:this.filter,
				isAddVip:options.isAddVip,
                comefrom:options.comefrom
            }).render().on("additem", function (e) {
                if (e.isGroup) {
                    var list = e.value;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        This.onAddItem(item.name, item.addr,item.serialId);
                    }
                } else {
                    This.onAddItem(e.name, e.addr,e.serialId);
                }
            }).on("removeitem",function(e){
                This.onRemoveItem(e.addr,e.serialId);
            }).on("additemmax", function (e) {
                This.trigger("additemmax");
            });

            this.on("print",function(){
                //初始化组件的时候，有可能用户已经添加了部分联系人
                if(options.items){
                    this.addressBook.addSelectedItems(options.items);
                }
            });

            this.setElement(this.dialog.el);

            this.setTips({
                contactsLength:this.addressBook.model.getContacts().length,
                receiverText:options.receiverText || "接收人"
            });

            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },
        selectedTemplate: ['<a hidefocus="1" data-contactsid ="{serialId}"  data-addr="{addr}" href="javascript:;" class="lia">',
            '<i class="i_del"></i>',
            '<span>{sendText}</span>',
        '</a>'].join(""),
        initEvent:function(e){
            var This = this;
            this.$(".addFcRight").click(function(e){
                if(e.target.className == "i_del"){
                   
					var addr = e.target.parentNode.getAttribute("data-addr");
					if(This.options.isAddVip){
						addr = e.target.parentNode.getAttribute("data-contactsid");
					}
					This.addressBook.removeSelectedAddr(addr);
                }
            });
        },
        onAddItem:function(name,addr,serialId){
            var sendText = this.filter == "email" ? M139.Text.Email.getSendText(name,addr) :
                M139.Text.Mobile.getSendText(name,addr);
            var html = M139.Text.format(this.selectedTemplate,{
                addr:M139.Text.Html.encode(addr),
                sendText:M139.Text.Html.encode(sendText),
                serialId:M139.Text.Html.encode(serialId)
            });
            $(".addFcRight").append(html);
        },
        onRemoveItem:function(addr,serialId){
           if(!this.options.isAddVip){
				this.$("a[data-addr='"+addr+"']").remove();
			}else{
				this.$("a[data-contactsid='"+serialId+"']").remove();
			}
        },
        setTips:function(options){
            this.$(".Label_ContactsLength").html(options.contactsLength);
            this.$(".Label_ReceiverText").html(options.receiverText);
        },
        onSelect:function(){
            var items = this.addressBook.getSelectedItems();
            //默认返回的是["",""]，如果是getDetail返回[{},{}],可以有serialId等参数
            if (this.options.getDetail !== true) {
                for (var i = 0; i < items.length; i++) {
                    items[i] = items[i].value;
                }
            }
            this.trigger("select",{
                value:items
            });
        },
        onCancel:function(){
            this.trigger("cancel");
        }
    }));


     //扩展静态函数
    $.extend(M2012.UI.Dialog.AddressBook,
    /**@lends M2012.UI.Dialog.AddressBook*/
    {
        /**
        *创建实例
        *@param {Object} options 参数集
        *@example
        */
        create: function (options) {
            var view = new M2012.UI.Dialog.AddressBook(options).render();
            return view;
        }
    });
 })(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件Model对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.Widget.Contacts.Model";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.Model.prototype*/
    {
        /** 弹出菜单组件
         *@constructs M2012.UI.Widget.Contacts.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@param {String} options.filter 过滤的数据类型:email|mobile|fax
         *@param {Boolean} options.selectMode 如果是对话框选择模式，则增加一些功能
         *@example
         var model = new M2012.UI.Widget.Contacts.Model({
             filter:"email"
         });
         */
        initialize: function (options) {
            options = options || {};

            if (top.$App) {
                this.contactsModel = window.top.$App.getModel("contacts");
            } else {
                this.contactsModel = M2012.Contacts.getModel();
            }

            this.filter = options.filter;
            this.colate = options.colate; //change by Aerojin 2014.06.09 过滤非本域用户

            if (options.selectMode) {
                this.selectedList = [];
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,

        dataReady: function (callback) {
            var This = this;
            this.contactsModel.requireData(function () {
                This.contactsData = This.contactsModel.get("data");
                callback();
            });
        },

        /**
         *重构收敛了添加选中联系人的方法
         */
        addSelectedItem: function (item) {
            //无filter，默认按serialId进行对比判同，在通讯录分组选择框中使用
            var compare = _.isUndefined(this.filter) ? item.serialId : item.addr;

            if(this.isSelectedItem(compare)){
                return false;
            }else{
                this.selectedList.push(item);
                return true;
            }
        },
        /**
         *获得组列表
         */
        getGroupList: function () {
            return this.contactsModel.getGroupList();
        },
        /**
         *获得读信联系人组id added by tj
         */
        getReadGroupId: function () {
            var groupList = this.getGroupList();
            for (var i = 0; i < groupList.length; i++) {
                if (groupList[i].name == "读信联系人") {
                    return groupList[i].id;
                }
            }
        },
        /**
         *获得组联系人
         */
        getGroupMembers: function (gid,options) {
            options = options || {};
            //change by Aerojin 2014.06.09 过滤非本域用户
            var contacts =  this.contactsModel.getGroupMembers(gid, {
                filter: this.filter || this.colate,
                colate: this.colate
            });
            if(options.getSendText){
                for(var i=0,len=contacts.length;i<len;i++){
                    if(this.filter == "email"){
                        contacts[i] = contacts[i].getEmailSendText();
                    }else if(this.filter == "mobile"){
                        contacts[i] = contacts[i].getMobileSendText();
                    } else if (this.filter == "fax") {
                        contacts[i] = contacts[i].getFaxSendText();
                    }
                }
            }
            return contacts;
        },


        /**
         * 获得最近联系人。先按内容与SerialId查找到联系人，然后再按条件获得联系方式，注意尽量保持原始的AddrContent
         */
        getLastestContacts: function (data) {
            var contacts = data || this.contactsData.lastestContacts;
            var result = [], ct;
            if (this.filter == "fax") {
                return result;//传真没实现最近紧密联系人
            }
            var addrType = this.filter == "email" ? "E" : "M";
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                var addrcontent = c.AddrContent;

                if (!/\d{5,}/.test(c.SerialId)) {
                    if (c.AddrType == "E") {
                        ct = this.contactsModel.getContactsByEmail(c.AddrContent)[0];
                    } else if (c.AddrType == "M") {
                        ct = this.contactsModel.getContactsByMobile(c.AddrContent)[0];
                    }
                } else {
                    ct = this.contactsData.contactsMap[c.SerialId];
                }

                if (ct) {
                    if (this.filter === "email" && c.AddrType !== "E") {
                        //条件是电邮，但是是通过手机号查找到的联系人，则取出第一电邮替代通讯方式
                        addrcontent = ct.getFirstEmail();
                        if (!addrcontent) {
                            ct = false;
                        }
                    } else if (this.filter === "mobile" && c.AddrType !== "M") {
                        addrcontent = ct.getFirstMobile();
                        if (!addrcontent) {
                            ct = false;
                        }
                    }
                }

                if (ct) {
                    result.push({
                        addr: addrcontent,
                        name: ct.name,
                        SerialId: ct.SerialId
                    });
                } else if (c.AddrType == addrType) {
                    var rndId = this.createLastContactsId();
                    this.lastContactsMap[rndId] = {
                        addr: c.AddrContent,
                        name: c.AddrName,
                        SerialId: rndId
                    };
                    result.push(this.lastContactsMap[rndId]);
                }
            }
            return result;
        },

        /**
         *生成一个假的联系人id，为了兼容一些不存在于通讯录中的最近联系人
         */
        createLastContactsId:function(){
            var rnd = parseInt(Math.random() * 100000000);
            return -rnd;
        },

        lastContactsMap: {},

        /**
         *获得紧密联系人
         */
        getCloseContacts: function () {
            var contacts = this.contactsData.closeContacts;
            return this.getLastestContacts(contacts);
        },
        /**
         *获得未分组联系人
         */
        getUngroupContacts: function (allContacts) {
            var contactsMap = this.contactsData.contactsMap;
            var noGroup = this.contactsData.noGroup;
            var result = [];
            //change by Aerojin 2014.06.18 过滤非本域用户
            for (var i = 0, len = noGroup.length; i < len; i++) {
                var c = contactsMap[noGroup[i]];
                if (this.colate && c && c.getFirstEmail().indexOf(this.colate) > -1) {
                    result.push(c);
                } else if (!this.colate && c) {
                    result.push(c);
                }
            }
            return result;
        },
        /**搜索联系人*/
        getSearchContacts: function () {
            var result = this.contactsModel.search(this.get("keyword"), {
                contacts: this.getContacts()
            });
            return result;
        },
        /**获得联系人*/
        getContacts: function () {
            var contacts = this.get("contacts");
            if (!contacts) {
                var contacts = this.contactsData.contacts;
                if (this.filter || this.colate) {
                    contacts = this.contactsModel.filterContacts(contacts, { filter: this.filter || this.colate, colate: this.colate }); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
                this.set("contacts", contacts);
            }
            return contacts;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            return this.contactsModel.getGroupMembers(this.contactsModel.getVIPGroupId(), { filter: this.filter });
        },
        /**获得vip分组id*/
        getVIPGroupId: function () {
            return this.contactsModel.getVIPGroupId();
        },
        getContactsById: function (cid) {
            if (cid > 0) {
                var item = this.contactsModel.getContactsById(cid);
                if (item) {
                    var email = item.getFirstEmail();
                    return {
                        //this.filter=undefined时,返回邮箱,以解决编辑/新建组手机号码为空的用户无法加入到组.--可能存在BUG--
                        addr: this.filter == "email" ? email : (item.getFirstMobile() || email),
                        name: item.name,
                        SerialId: item.SerialId
                    };
                } else {
                    return null;
                }
            } else {
                return this.lastContactsMap[cid];
            }
        },
        isSelectedItem:function(addr){
            var list = this.selectedList;
            for(var i=0,len = list.length;i<len;i++){
                if(list[i].addr == addr || list[i].SerialId == addr){
                    return true;
                }
            }
            return false;
        },
        getSendText:function(name,addr){
            return this.contactsModel.getSendText(name,addr);
        },

        /**清空最近联系人记录*/
        clearLastContacts: function (isClose) {
            var This = this;
            //todo 这是老的代码移植过来
            var param = {
                type: isClose ? "close" : "last"
            };
            var Msg = {
                warn_delclose: "确认清空所有紧密联系人记录？",
                warn_dellast: "确认清空所有最近联系人记录？"
            };
            top.$Msg.confirm(Msg['warn_del' + param.type], function () {
                top.addBehavior("19_9561_11清空最近/紧密", isClose ? "2" : "1");
                top.Contacts.EmptyLastContactsInfo(param, function (result) {
                    if (result.success) {
                        /**
                         *@event#M2012.UI.Widget.Contacts.Model
                         */
                        This.trigger("contactshistoryupdate");
                    } else {
                        top.$Msg.alert(result.msg);
                    }
                });
            }, {
                icon:"warn"
            });
        },

        /**清空紧密联系人记录*/
        clearCloseContacts:function(){
            this.clearLastContacts(true);
        },

        /**
         *重新加载通讯录数据
         */
        reloadContactsData: function () {
            this.contactsModel.loadMainData();
        }
    }));

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.Contacts.View";

    var GroupsId = {
        //所有联系人
        All: -1,
        //未分组
        Ungroup: -2,
        //最近联系人
        Lastest: -3,
        //紧密联系人
        Close: -4,
        Search: -5
    };

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.Widget.Contacts.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {Object} options.model model对象，为组件提供数据支持
         *@param {String} options.template 组件的html代码
         *@param {Boolean} options.showSelfAddr 是否显示发给自己，默认是true
         *@param {Boolean} options.showCreateAddr 是否显示添加联系人，默认是true 
         *@param {Boolean} options.showAddGroup 是否显示添加整组的图标，默认是true 
         *@param {Boolean} options.showLastAndCloseContacts 是否显示最近紧密联系人，默认是true 
         *@param {String} options.maxCount 最大添加个数
         *@example
         new M2012.UI.Widget.Contacts.View({
             container:document.getElementById("addrContainer"),
             filter:"email"
         }).render().on("select",function(e){
             if(e.isGroup){
                 alert(e.value.length);
             }else{
                 alert(e.value);
             }
         });
         */
        initialize: function (options) {
            var This = this;
            this.filter = options.filter;
            this.selectMode = options.selectMode;
            this.showCountElFlag = options.comefrom == 'compose_addrinput' ? 'none' : '';
            //change by Aerojin 2014.06.09 过滤非本域用户
            this.model = new M2012.UI.Widget.Contacts.Model({
                filter: this.filter,
                colate: options.colate,
                selectMode: this.selectMode
            });
            var el = $D.getHTMLElement(options.container);
            el.innerHTML = this.template;
            if(options.width !== "auto") {
            	el.style.width = "191px";
            }
            this.setElement(el);
            this.model.dataReady(function () {
                This.render();
                clearTimeout(timer);
            });

            //3秒后显示重试按钮
            var timer = setTimeout(function () {
                This.showRetryDiv();
            }, 3000);

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        retryCount: 0, //用户点击重新加载联系人的次数
        MemberFirstSize: 10, //分组里首次显示最多几个联系人
        MemberPageSize: 500,//分组里每次显示最多几个联系人，点更多加载更多
        template: ['<div class="AddrEmptyTip ta_c loadingerror" style="height:280px;padding:80px 0 0 0">',
        '<div class="LoadingImage" style="padding-top:50px;"><img src="/m2012/images/global/searchloading.gif" /></div>',
            '<div class="bodyerror RetryDiv" style="display:none">',
 		        '<img src="../images/global/smile.png" width="73" height="72">',
 		        '<p>没加载出来，再试一次吧。</p>',
 		        '<a class="btnTb BtnRetry" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	        '</div>',
 		'</div>',
        '<div class="ContentDiv tabContent p_relative" style="display:none;">',
 	    '<div class="searchContact">',
 	      '<input type="text" class="searchContactText">',
 	      '<a hidefocus="1" href="javascript:;" class="searchContactBtn"><i class="i_c-search"></i></a>',
 	    '</div>',
        '<div class="searchEnd-empty SearchEmptyTip" style="display:none">',
            '<a href="javascript:" class="delmailTipsClose BtnCloseSearchEmptyTip"><i class="i_u_close"></i></a>',
            '<p class="gray">查找结果：</p>',
            '<p>没有符合条件的联系人</p>',
        '</div>',
 	    '<div class="searchEnd" style="display:none">',
 		    '<ul class="contactList">',
            '<li data-groupId="-5"><a hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表"><i class="i_plusj"></i><span>搜索结果</span><var></var></a>',
            '<ul class="pb_5">',
               //'<li><a href="javascript:void(0)">18688959302</a></li>',
             '</ul>',
            '</li>',
            '</ul>',
 	    '</div>',
         '<ul class="contactList GroupList">',
           
         '</ul>',
         '<div class="contactListNew">',
		    '<a bh="compose_addressbook_createcontacts" hidefocus="1" class="AddNewContacts" href="javascript:;">+ 新建联系人</a>',
		 '</div>',
        '</div>'].join(""),
        GroupItemTemplate: [
            '<li data-groupId="{groupId}">',
             '<a title="{clearGroupTitle}" href="javascript:;" style="display:{showClearGroup}" class="i_r_yq2 i_dels ClearGroup"></a>',
             '<a bh="compose_addressbook_addgroupclick" hidefocus="1" style="display:{showAddGroup}" title="添加整组" href="javascript:;" class="i_r_yq2 AddGroup"></a>',
             '<a bh="{behavior}" hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表">',
                 '<i class="i_plusj"></i>',
                 '<span>{groupName}</span>',
                 '<var style="display:{showCountEl}">({count})</var>',
                 '</a>',
             '<ul class="pb_5" style="display:none"></ul>',
           '</li>'].join(""),
        MemberItemTemplate: '<li style="display:{display}" class="ContactsItem" data-addr="{addr}" data-contactsId="{contactsId}"><a hidefocus="1" href="javascript:void(0)" title="{addrTitle}">{contactsName}</a></li>',
        //联系人容器dom
        GroupContainerPath: "ul.GroupList",
        events: {
            "click .GroupButton": "onGroupButtonClick",
            "click .LoadMoreMember": "onLoadMoreMemberClick",
            "click .ContactsItem": "onContactsItemClick",
            "click .searchContactBtn": "onClearSearchInput",
            "click .AddGroup": "onAddGroupClick",
            "click .SendToMySelf": "onSendToMySelfClick",
            "click .AddNewContacts": "onAddNewContactsClick",
            "click .BtnCloseSearchEmptyTip": "hideGroupEmptyTip",
            "click .BtnRetry": "onRetryClick",
            "click .ClearGroup": "onClearGroupClick"
        },
        /**构建dom函数*/
        render: function () {
            var options = this.options;

            this.clearSearchButton = this.$("a.searchContactBtn");

            this.$(".AddrEmptyTip").hide();

            this.renderGroupListView();

            this.initEvent();

            if (options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
            if (options.showCreateAddr === false) {
                this.$(".contactListNew").hide();
            }
            this.$("div.ContentDiv").show();
            this.render = function () {
                return this;
            }

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *加载联系组界面
         *@inner
         */
        renderGroupListView: function () {
            var groups = this.model.getGroupList();
            var htmlCode = ['<li class="SendToMySelf contactList_a"><a bh="compose_addressbook_sendself" hidefocus="1" href="javascript:void(0)">发给自己</a></li>'];
            var template = this.GroupItemTemplate;

            if (this.options.showLastAndCloseContacts !== false) {

                //最近联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Lastest,
                    groupName: "最近联系人",
                    clearGroupTitle:"清空最近联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getLastestContacts().length,
                    behavior: "compose_addressbook_lastcontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));

                //紧密联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Close,
                    groupName: "紧密联系人",
                    clearGroupTitle: "清空紧密联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getCloseContacts().length,
                    behavior: "compose_addressbook_closecontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));
            }
            //所有联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.All,
                groupName: "所有联系人",
                showCountEl: this.showCountElFlag,
                count: this.model.getContacts().length,
                behavior: "compose_addressbook_allcontacts",
                showAddGroup: "none",
                showClearGroup: "none"
            }));

            //未分组联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.Ungroup,
                groupName: "未分组",
                showCountEl: this.showCountElFlag,
                count: this.model.getUngroupContacts().length,
                behavior: "compose_addressbook_ungroup",
                showAddGroup: "none",
                showClearGroup: "none"
            }));
            if (this.options.showVIPGroup !== false) {
                //vip联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: this.model.getVIPGroupId(),
                    groupName: "VIP联系人",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getGroupMembers(this.model.getVIPGroupId()).length,
                    behavior: "compose_addressbook_vip",
                    showAddGroup: this.options.showAddGroup === false ? "none" : "",
                    showClearGroup: "none"
                }));
            }
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                var members = this.model.getGroupMembers(g.id).length;
                var showAddGroup = this.options.showAddGroup === false ? "none" : "";
                var h = null;

                //读信联系人特别处理上报
                if (g.name == "读信联系人") {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_readcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                else {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_customcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                htmlCode.push(h);
            }
            htmlCode = htmlCode.join("");
            this.$(this.GroupContainerPath)[0].innerHTML = htmlCode;

            if (this.options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
        },
        /**
         *初始化事件行为
         *@inner
         */
        initEvent: function () {
            var This = this;
            //切换展开组
            this.model.on("change:currentGroup", function (model, gid) {
                var oldGid = model.previous("currentGroup");
                if (oldGid != null) {
                    this.hideGroupMember(oldGid);
                }
                if (gid) {
                    this.showGroupMember(gid);
                }
            }, this);

            //最近紧密联系人记录清除后
            this.model.on("contactshistoryupdate", function () {
                This.updateView();
            });

            //监听搜索框输入
            var input = this.$("input")[0];
            M139.Timing.watchInputChange(input, function () {
                This.onSearchInputChange(input.value);
            });

            //选择模式下，选中的联系人左边列表要隐藏
            if (this.selectMode) {
                this.on("additem", function (e) {
                    var addr = [];
                    if (!e.isGroup) {
                        e.SerialId = e.serialId;
                        addr = [e];
                    } else {
                        addr = e.value;
                    }

                    if (This.filter) {
                        for (var i=0; i<addr.length; i++) {
                            if(addr[i].addr && addr[i].addr.length){
                                This.utilGetMemberElement(addr[i].addr).hide();
                            }else{
                                This.utilGetMemberElementById(addr[i].serialId).hide();
                            }
                        }
                    } else {
                        for (var i=0; i<addr.length; i++) {
                            This.utilGetMemberElementById(addr[i].serialId).hide();
                        }
                    }
                });
                this.on("removeitem", function (e) {
                    if (This.filter) {
                        if(e && e.addr.length){     
                            This.utilGetMemberElement(e.addr).show();
                        }else{
                            This.utilGetMemberElementById(e.serialId).hide();
                        }
                    } else {
                        This.utilGetMemberElementById(e.serialId).show();
                    }
                });
            }

            this.on("print", function () {
                this.model.set("currentGroup", GroupsId.Lastest);
            });

        },
        /**@inner*/
        showGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").show();
        },
        /**@inner*/
        hideGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").hide();
        },

        /**
         *显示重试按钮
         *@inner
        */
        showRetryDiv: function () {
            var This = this;
            This.$(".LoadingImage").hide();
            This.$(".RetryDiv").show();

            if (This.retryCount > 1) {
                var total = -1, arrlength = -1, glength = -1, datstr = "hasdata";
                var cmodel = This.model.contactsModel || {};
                if (cmodel.get) {
                    var data = cmodel.get("data");
                    if (_.isUndefined(data)) {
                        datstr = "nodata";
                    } else {
                        total = data.TotalRecord;
                        if ($.isArray(data.Contacts)) {
                            arrlength = data.Contacts.length;
                        }
                        if ($.isArray(data.Groups)) {
                            glength = data.Groups.length;
                        }
                    }
                }

                This.logger.error($TextUtils.format('addrlist retry fail|filter={0}|mode={1}|retry={2}|data={3}|isLoading={4}|total={5}|contacts={6}|groups={7}',
                    [This.filter, This.selectMode, This.retryCount, datstr, cmodel.isLoading, total, arrlength, glength]));
            }
        },

        /**@inner*/
        renderMemberView: function (gid, mode) {
            var container = this.utilGetMemberContainer(gid);
            var containerInit = container.attr("init") || 0;
            if (mode == "init" && container.attr("init") == 1) {
                return;
            }

            //显示组成员
            var htmlCode = [];
            var template = this.MemberItemTemplate;
            var contacts;
            if (gid == GroupsId.All) {
                contacts = this.model.getContacts();
            } else if (gid == GroupsId.Lastest) {
                contacts = this.model.getLastestContacts();
            } else if (gid == GroupsId.Close) {
                contacts = this.model.getCloseContacts();
            } else if (gid == GroupsId.Ungroup) {
                contacts = this.model.getUngroupContacts();
            } else if (gid == GroupsId.Search) {
                contacts = this.model.getSearchContacts();
            } else {
                contacts = this.model.getGroupMembers(gid);
            }

            if (gid == GroupsId.Search && contacts.length == 0) {
                //显示搜索结果为空的提示
                this.showGroupEmptyTip();
                this.switchGroupMode();
            } else {
                this.hideGroupEmptyTip();
            }


            //一共几个联系人
            var total = contacts.length;
            //当前已显示几个
            var showCount = container.find("li[data-addr]").length;
            //一次追加几个
            var pageSize = containerInit == 1 ? this.MemberPageSize : this.MemberFirstSize;

            //分页显示的，每次显示10个，点击更多每次新显示10
            for (var i = showCount, len = Math.min(showCount + pageSize, total) ; i < len; i++) {
                var c = contacts[i];
                var addr = c.addr || this.getAddr(c);//最近联系人直接有addr属性，联系人对象需要获取
                var addrText = M139.Text.Html.encode(addr);

                if (!this.filter){
                    addr = c.SerialId;
                }

                var isDisplay = !(this.selectMode && this.model.isSelectedItem(addr))

                htmlCode.push(M139.Text.format(template, {
                    contactsId: c.SerialId,
                    contactsName: M139.Text.Html.encode(c.name),
                    addr: addrText,
                    addrTitle: addrText,
                    display: isDisplay ? "" : "none"
                }));
            }
            //如果还没显示完
            if (showCount + pageSize < total) {
                htmlCode.push('<li class="LoadMoreMember" data-groupId="'
                    + gid + '"><a hidefocus="1" href="javascript:;">更多<span class="f_SimSun">↓</span></a></li>');
            }
            htmlCode = htmlCode.join("");
            container.append(htmlCode);
            container.attr("init", 1);//表示已经加载过一次数据了
        },
        /**@inner*/
        onLoadMoreMemberClick: function (e) {
            $(M139.Dom.findParent(e.currentTarget, "li")).hide();
            var gid = this.utilGetClickGroupId(e);
            this.renderMemberView(gid);
        },


        /**@inner*/
        onClearSearchInput: function () {
            top.BH('compose_addressbook_search');
            var txt = this.$("input:text");
            if (this.$(".searchContact").hasClass("searchContact-on")) {
                txt.val("");
            }
            this.hideGroupEmptyTip();
            txt.focus();           
        },

        /**
         *搜索框输入值变化
         *@inner
         */
        onSearchInputChange: function (value) {
            if (value == "") {
                this.switchGroupMode();
                this.$(".searchContact").removeClass("searchContact-on");
            } else {
                this.renderSearchView(value);
                this.$(".searchContact").addClass("searchContact-on");
                this.trigger('BH_onSearch');
            }
        },

        /**
         *从搜索视图返回正常视图
         *@inner*/
        switchGroupMode: function () {
            this.$(".searchEnd").hide();
            this.$(".GroupList").show();
        },

        /**@inner*/
        renderSearchView: function (keyword) {
            this.$(".GroupList").hide();
            this.$(".searchEnd").show();
            this.$(".searchEnd li ul").html("").attr("init", 0);
            this.model.set("keyword", keyword);
            this.model.set("currentGroup", null);//否则不会触发change:currentGroup
            this.model.set("currentGroup", GroupsId.Search);
        },
        /**@inner*/
        onGroupButtonClick: function (e) {
            var gid = this.utilGetClickGroupId(e);
            var currentGid = this.model.get("currentGroup");
            if (currentGid == gid) {
                this.model.set("currentGroup", null);
            } else {
                this.model.set("currentGroup", gid);
            }
        },

        /**
         *点击发给自己
         *@inner
        */
        onSendToMySelfClick: function () {
            var name = top.$User.getTrueName();
            if(this.filter == "email"){
                var addr = top.$User.getDefaultSender();
            }else if(this.filter == "mobile"){
                var addr = top.$User.getShortUid();
            }
            var sendText = this.model.getSendText(name,addr);
            var result = {
                value:sendText,
                name:name,
                addr:addr
            };
            if (this.selectMode) {
				if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else {
				    var ok = this.model.addSelectedItem(result);
				    ok && this.trigger("additem", result);
                }
            } else {
                this.trigger("select", result);
            }
        },


        /**@inner*/
        showGroupMember: function (gid) {
            this.renderMemberView(gid, "init");
            //显示成员容器
            this.utilGetMemberContainer(gid).show();
            //折叠+变-
            this.utilGetGroupElement(gid).find("a.GroupButton i").addClass("i_minus");
        },
        /**@inner*/
        hideGroupMember: function (gid) {
            //隐藏成员容器
            this.utilGetMemberContainer(gid).hide();
            //折叠-变+
            this.utilGetGroupElement(gid).find("a.GroupButton i").removeClass("i_minus");
        },

        /**
         *点击选择联系人
         *@inner
         */
        onContactsItemClick: function (clickEvent) {
            var cid = M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-contactsId");
            var c = this.model.getContactsById(cid);
            var sendText = this.model.getSendText(c.name, c.addr);
            var result = {
                value:sendText,
                name:c.name,
                addr: c.addr,
                serialId: c.SerialId
            };
            if (this.selectMode) {
                if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else if(this.options.isAddVip && top.Contacts.IsPersonalEmail(c.SerialId)){
						top.FF.alert("不支持添加自己为VIP联系人。");
				}else{
                    var ok = this.model.addSelectedItem(result);
                    ok && this.trigger("additem", result);
				}
            } else {
                this.trigger("select", result);
                //最近联系人
                if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -3) {
                    top.BH("compose_addressbook_lastitem");
                }
                //紧密联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -4) {
                    top.BH("compose_addressbook_closeitem");
                }
                //所有联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -1) {
                    top.BH("compose_addressbook_allitem");
                }
                //未分组
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -2) {
                    top.BH("compose_addressbook_noitem");
                }
                //vip联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getVIPGroupId()) {
                    top.BH("compose_addressbook_vipitem");
                }
                //读信联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getReadGroupId()) {
                    top.BH("compose_addressbook_readitem");
                }
                else {
                    BH("compose_addressbook_itemclick");
                }
            }
        },

        /**
         *点击添加整组
         *@inner
         */
        onAddGroupClick: function (e) {
            var item;            
            var gid = this.utilGetClickGroupId(e);
            if (gid > 0) {
                if (this.selectMode) {
                    var list = this.model.getGroupMembers(gid).concat();
					var vipList=[];

                    for (var i = 0; i < list.length; i++) {
                        var c = list[i];
						if (this.filter == "email") {
                            var sendText = c.getEmailSendText();
                        } else if (this.filter == "mobile") {
                            var sendText = c.getMobileSendText();
                        }  
                        item = {
                            value:sendText,
                            name:c.name,
                            addr: this.getAddr(c),
                            serialId: c.SerialId,
                            SerialId: c.SerialId
                        };
                        list[i] = item;
						if (this.model.selectedList.length >= this.options.maxCount) {
							this.trigger("additemmax");
                            break;
                        } else if(this.options.isAddVip){ //vip联系人不能重复被选中-添加整组排重
							var selected = this.model.selectedList;
							var hasSelevted = false;
							for(var j=0; j< selected.length;j++){
								if(item.serialId == selected[j].serialId ||top.Contacts.IsPersonalEmail(item.serialId)){
									hasSelevted = true;
									break;
								}
							}
							if(!hasSelevted){
								var ok = this.model.addSelectedItem(item);
								ok && vipList.push(item);
							}
                        } else {
                            var ok = this.model.addSelectedItem(item);
                            if (!ok) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    this.trigger("additem", {
                        isGroup: true,
                        group: gid,
                        value: !this.options.isAddVip? list:vipList
                    });
                } else {
                    this.trigger("select", {
                        isGroup: true,
                        group: gid,
                        value: this.model.getGroupMembers(gid, {
                            getSendText: true
                        })
                    });
                }
                this.utilGetMemberContainer(gid).find("li").hide();
            }

            this.trigger("BH_onAddGroup");//增加行为ID
        },

        /**
         *点击添加联系人
         *@inner
         */
        onAddNewContactsClick: function () {
            var This = this;
            var topWin = M139.PageApplication.getTopAppWindow();
            var addView = new topWin.M2012.UI.Dialog.ContactsEditor().render();
            addView.on("success", function (result) {
                This.trigger('addContact', result);
                This.onAddContacts();
                //上报添加联系人成功行为
                BH("compose_linkmansuc");
            });

            addView.on('addGroupSuccess', function(result){                
                This.trigger('addGroup', result);
            });

            this.trigger('BH_onAddNewContacts');
        },

        /**
         *添加联系人成功时触发
         */
        onAddContacts: function () {
            this.updateView();
        },

        /**
         *由于数据变化 重绘通讯录界面
         */
        updateView:function(){
            //清除缓存数据
            this.model.set("contacts", null);
            this.renderGroupListView();
            this.model.set("currentGroup", null);
        },

        /**
         *点击重试，重新加载通讯录数据
         */
        onRetryClick: function () {
            var This = this;
            This.retryCount++;

            this.$(".LoadingImage").show();
            this.$(".RetryDiv").hide();
            setTimeout(function () {
                This.showRetryDiv();
            }, 5000);
            this.model.reloadContactsData();
        },

        /**
         *点击清空最近、紧密联系人
         */
        onClearGroupClick: function (e) {
            if ($(e.target).parent().attr('data-groupid') == -3) {
                top.BH("compose_addressbook_lastcancel");
            }
            if ($(e.target).parent().attr('data-groupid') == -4) {
                top.BH("compose_addressbook_closecancel");
            }
            var gid = this.utilGetClickGroupId(e);
            if (gid == GroupsId.Lastest) {
                this.model.clearLastContacts();
            } else if (gid == GroupsId.Close) {
                this.model.clearCloseContacts();
            }
        },

        /**
         *todo move to model
         *@inner
         */
        getAddr: function (c) {
            var addr = "";
            if (this.filter == "email") {
                addr = c.getFirstEmail();
            } else if (this.filter == "mobile") {
                addr = c.getFirstMobile();
            } else if (this.filter == "fax") {
                addr = c.getFirstFax();
            } else {
                addr = c.SerialId;
            }
            return addr;
        },

        /**
         *todo move to model
         *添加已选的部分联系人（对话框选择模式下有用）
         */
        addSelectedItems: function (selContacts) {
            var filter = this.filter;
            for (var i = 0; i < selContacts.length; i++) {
                var c = selContacts[i];
                if (typeof c == "object") {
                    var ok = this.model.addSelectedItem(c);
                    ok && this.trigger("additem", c);
                } else {
                    var addr = "";
                    var name = "";
                    if (filter == "email") {
                        addr = M139.Text.Email.getEmail(c);
                        name = M139.Text.Email.getName(c);
                        value = M139.Text.Email.getSendText(name, addr);
                    } else if (filter == "mobile") {
                        addr = M139.Text.Mobile.getMobile(c);
                        name = M139.Text.Mobile.getName(c);
                        value = M139.Text.Mobile.getSendText(name, addr);
                    }
                    if (addr) {
                        var item = {
                            name: name,
                            addr: addr,
                            value: value
                        };
                        var ok = this.model.addSelectedItem(item);
                        ok && this.trigger("additem", item);
                    }
                }
            }


        },
        removeSelectedAddr: function (param) {
            var list = this.model.selectedList;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var tmpCopareItem ="";
				tmpCopareItem = !this.options.isAddVip? item.addr :item.serialId;

                if (!this.filter) {
                    tmpCopareItem = item.serialId;
                }


				if (tmpCopareItem == param) {
                    list.splice(i, 1);
                    this.trigger("removeitem", item);
                    return;
                }
            }

        },

        /**
         *选择模式下获得选中的成员
         */
        getSelectedItems:function(){
            if(this.selectMode){
                var result = this.model.selectedList.concat();
                return result;
            }else{
                return null;
            }
        },

        /**@inner*/
        utilGetClickGroupId: function (clickEvent) {
            return M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-groupId");
        },
        utilGetMemberElement: function (addr) {
            return this.$("li[data-addr='" + addr + "']");
        },

        /**@inner*/
        utilGetMemberElementById: function (serialId) {
            return this.$("li[data-contactsid='" + serialId + "']");
        },

        /**@inner*/
        utilGetGroupElement: function (gid) {
            return this.$("li[data-groupId='" + gid + "']");
        },
        /**@inner*/
        utilGetMemberContainer: function (gid) {
            return this.utilGetGroupElement(gid).find("ul");
        }

    }));
})(jQuery, _, M139);
