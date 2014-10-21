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


