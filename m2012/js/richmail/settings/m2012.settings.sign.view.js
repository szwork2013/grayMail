/* @fileOverview 定义设置签名View层的文件.
*/
/**
*@namespace 
*设置签名View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.Sign.View', superClass.extend(//邮件签名
    /**
    *@lends M2012.Settings.Sign.View.prototype
    */
        {
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        vcardHtml: null,
        initialize: function (option) {
            var self = this;
            this.norTipsContent = $("#norTipsContent");
            this.icoImg = $("#norTipsIco img");
            this.txtUserName = $("#txtUserName");
            this.txtEmail = $("#txtEmail");
            this.txtMobile = $("#txtMobile");
            this.txtRemarks = $("#txtRemarks");
            this.mailSignView = $("#mailSignView");
            this.httpimgload = "/g2/addr/apiserver/httpimgload.ashx?sid=";
            this.model = new M2012.Settings.Account.Model({ originalUserInfo: option.userInfo });
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
            this.ifDel();
            this.addSign();
            this.editSign();
        },
        frmInfoOnLoad : function (obj) {},
        accountSetView: function (data) {
            if (typeof (accountSetting) != "undefined") {
                accountSetting.model.set({
                    userName: $T.Html.decode(data.AddrFirstName),
                    email: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    image: data.ImageUrl,
                    ImageUrl: data.ImageUrl
                })
            }
        },
        getVcardCon: function (callback) {
            var self = this;

            data = self.model.get("originalUserInfo");
            if (data) {
                var result = [
                        { key: $T.Html.encode(data.AddrFirstName) },
                        { key: $T.Html.encode(data.FavoWord) },
                        { key: $T.Html.encode(data.UserJob) },
                        { key: $T.Html.encode(data.CPName) },
                        { key: $T.Html.encode(data.CPAddress) },
                        { key: data.FamilyEmail },
                        { key: data.MobilePhone },
                        { key: data.OtherPhone },
                        { key: data.BusinessFax },
                        { key: $T.Html.encode(data.CPZipCode) }
                    ]
                var arr = [
                        { key: "vcardTitle", type: "" },
                        { key: "vcardSubject", type: "" },
                        { key: "vcardJob", type: "职务:" },
                        { key: "vcardCompany", type: "公司:" },
                        { key: "vcardAddr", type: "地址:" },
                        { key: "vcardMail", type: "邮箱:" },
                        { key: "vcardMobile", type: "手机:" },
                        { key: "vcardPhone", type: "电话:" },
                        { key: "vcardFax", type: "传真:" },
                        { key: "vcardZipCode", type: "邮编:" }
                    ]

                if (data.ImageUrl) {
                    var url, link;
                    if(data.ImageUrl.indexOf("//") == -1){
                        link = self.checkDomain(top.getDomain('resource'));
                        url = link + $T.Html.encode(data.ImageUrl);
                    } else {
	                    url = $T.Html.encode(data.ImageUrl);
                    }
                    url = M139.HttpRouter.getNoProxyUrl(url);
                } else {
                    url = top.$App.getResourceHost() + "/m2012/images/ad/face.jpg";
                }

                self.icoImg.attr("src", url);

                var len = result.length;
                var listArr = [];
                for (var i = 0; i < len; i++) {
                    if (result[i].key && result[i].key != undefined) {
                        var html = "<p class='norTipsLine'>" + arr[i].type + result[i].key + "</p>";
                        listArr.push(html)
                    }
                }
                var text = listArr.join("");
                text = text.replace("<br>*年*月*日 星期*", "<br>$时间$");
                self.vcardHtml = text;
                if (callback) {
                    callback(text)
                }
            }
        },
        /**
        *获取邮件签名列表数据。
        */
        render: function () {
            var self = this;
            self.statusIsDefault = false;
            self.getSignData();
            self.getVcardData();
            top.BH("account_load");
            return superClass.prototype.render.apply(self, arguments);
        },
        has: false, //是否有电子名片
        /**
        *默认签名的index值，初始值null
        */
        isDefaultIndex: null,
        /**
        *组装JSON数组，获取签名的title、content、id。
        */
        initSign: function (dataSource) {
            var newData = dataSource; //保存原始的数据到newData
            var self = this;
            var titleArr = [];
            var idArr = [];
            var contentArr = [];
            var result = {};
            var len = dataSource.length;
            var status = false;
            for (var m = 0; m < len; m++) {
                if (dataSource[m].title == "我的电子名片") {
                    var data = dataSource.splice(m, 1);
                    dataSource.unshift(data[0]);
                }
            }
            for (var o = 0; o < newData.length; o++) {
                var title = newData[o].title;
                var type = newData[o].type;
                var newDefault = newData[o].isDefault;
                titleArr.push({ html: title, myData: o, type: type });
                if (type == 1) {
                    this.has = true;
                }
                if (newDefault == 1) {
                    this.statusIsDefault = true;
                    this.isDefaultIndex = o;
                }
            }
            self.model.set({ newData: newData })
            if (len == 0) {
                $("#mailSignView").hide();
                self.model.set({ "defaultText": self.initText() });
            }
            for (var i = 0; i < len; i++) {
                var id = dataSource[i].id;
                var content = dataSource[i].content;
                var con = content.replace(/&lt;/g, "<");
                con = con.replace(/&gt;/g, ">");
                con = con.replace(/&quot;/g, '"');
                con = con.replace("<br>$时间$", "<br>*年*月*日 星期*")
                con = $T.Html.decode(con);
                dataSource[i].content = con;

                idArr.push({ id: id, myData: i + 1 });
                contentArr.push({ con: con, myData: i });
            }
            if (!this.has) {
                titleArr.unshift({ html: "我的电子名片", myData: 0, type: 1 });
            }
            if (titleArr.length > 3) {//最多只能设置3个签名+一个电子名片 
                this.model.set({ "isMax": true });
            } else {
                this.model.set({ "isMax": false });
            }
            if (this.statusIsDefault) {//如果有默认签名
                var n = this.isDefaultIndex;
                $("#mailSignView").show();
                $("#btnEditSign").attr("index", n)
                if (dataSource[n].title == "我的电子名片") {
                    self.getVcardCon(function (text) {
                        if (dataSource[n].isAutoDate == 1) {
                            text = text + "<p class='norTipsLine'>*年*月*日 星期*</p>"
                        }
                        self.norTipsContent.html(text).prev().show();
                        self.mailSignView.find("#btnIfDel").hide();
                    });
                } else {
                    var datacon = dataSource[n].content;
                    datacon = datacon.replace("<script>", "");
                    datacon = datacon.replace("/<script>", "");
                    self.norTipsContent.html(datacon).prev().hide();
                    self.mailSignView.find("#btnIfDel").show();
                }
                self.model.set({ "keyId": dataSource[n].id, "defaultText": dataSource[n].title, "content": dataSource[n].content, "isAutoDate": dataSource[n].isAutoDate }); //初始状态的签名，保存起来，当点击“不使用”的时候取出来进行修改
            } else {//没有默认签名的情况下
                $("#mailSignView").hide();
                self.model.set({ "defaultText": self.initText() });
            }
            titleArr.unshift({ html: this.initText(), myData: -2 }, { isLine: true })
            self.showMenu(titleArr, contentArr, idArr, dataSource);
        },
        getOptions: function (obj) {
            var src = obj("#faceImg").attr("src");
            var title = obj("#vcardTitle").val();
            var subject = obj("#vcardSubject textarea").val();
            var job = obj("#vcardJob").val();
            var company = obj("#vcardCompany").val();
            var addr = obj("#vcardAddr").val();
            var mail = obj("#vcardMail").val();
            var mobile = obj("#vcardMobile").val();
            var phone = obj("#vcardPhone").val();
            var fax = obj("#vcardFax").val();
            var zipcode = obj("#vcardZipCode").val();
            
            src = decodeURIComponent(src);
            if(src.indexOf("?") > 0){
	            src = src.substr(0, src.indexOf("?"));
            }

            var options = {
                ImageUrl: src.indexOf("&path=") > 0 ? $T.Html.decode(src.split("path=")[1]) : src,
                AddrFirstName: title,
                FavoWord: subject,
                UserJob: job,
                CPName: company,
                CPAddress: addr,
                FamilyEmail: mail,
                MobilePhone: mobile,
                OtherPhone: phone,
                BusinessFax: fax,
                CPZipCode: $T.Html.encode(zipcode)
            }
            return options;
        },
        checkData: function (parentObj, e) {
            var objTitle = parentObj("#vcardTitle");
            var objMail = parentObj("#vcardMail");
            var objMobile = parentObj("#vcardMobile");
            var objPhone = parentObj("#vcardPhone");
            var objFax = parentObj("#vcardFax");
            var objZipcode = parentObj("#vcardZipCode");
            var title = objTitle.val();
            var mail = objMail.val();
            var mobile = objMobile.val();
            var phone = objPhone.val();
            var fax = objFax.val();
            var zipcode = objZipcode.val();
            var self = this;
            var ex = /1\d{10}|((0(\d{3}|\d{2}))-)?\d{7,8}(-\d*)?/;
            var ifPhone = ex.test(phone);
            var ifFax = ex.test(fax);
            var arr = [
                { text: self.model.messages.entryName, id: objTitle, status: title == "" },
                { text: self.model.messages.mailNull, id: objMail, status: mail == "" },
                { text: self.model.messages.mobileNull, id: objMobile, status: mobile == "" },
                { text: self.model.messages.mailError, id: objMail, status: !$Email.isEmail(mail) },
                { text: self.model.messages.mobileError, id: objMobile, status: !$Mobile.isMobile(mobile) },
                { text: self.model.messages.phoneError, id: objPhone, status: phone != "" && !ifPhone },
                { text: self.model.messages.phoneError, id: objFax, status: fax != "" && !ifFax },
                { text: self.model.messages.zipcodeError, id: objZipcode, status: zipcode != "" && isNaN(zipcode) }
            ];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].status) {
                    self.alertWindow(arr[i].text, arr[i].id);
                    e.cancel = true;
                    return false
                }
            };
            return true
        },
        checkDomain: function (url) {
            if (url.indexOf("/g2/") > -1) {
                if (/cookiepartid=1(;|$)/.test(document.cookie)) {
                    url = url.replace("/g2/", "/g3/");
                }
            }
            return url;
        },
        getVcardData: function (callback) {
            var self = this;

            (function (data) {
                var tableArr = [{
                    title: data.AddrFirstName,
                    job: data.UserJob,
                    company: data.CPName,
                    addr: data.CPAddress,
                    mail: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    phone: data.OtherPhone,
                    fax: data.BusinessFax,
                    zipcode: data.CPZipCode
                }]
                tableArr[0].subject = "<textarea class='accountTextare'>" + data.FavoWord + "</textarea>";
                var arr = [
                    { value: data.FavoWord, key: "简介", type: "subject" },
                    { value: data.UserJob, key: "职务", type: "job" },
                    { value: data.CPName, key: "公司", type: "company" },
                    { value: data.CPAddress, key: "地址", type: "addr" },
                    { value: data.FamilyEmail, key: "邮箱", type: "mail" },
                    { value: data.MobilePhone, key: "手机", type: "mobile" },
                    { value: data.OtherPhone, key: "电话", type: "phone" },
                    { value: data.BusinessFax, key: "传真", type: "fax" },
                    { value: data.CPZipCode, key: "邮编", type: "zipcode" }
                ]
                var len = arr.length;
                var htmlArr = [];
                for (var i = 0; i < len; i++) {
                    if (arr[i].value != undefined) {
                        var html = '<tr><td width="40">' + arr[i].key + '：</td><td>' + arr[i].value + '</td></tr>';
                        htmlArr.push(html)
                    } else {
                        var type = arr[i]["type"];
                        tableArr[0][type] = String(tableArr[0][type]).replace("undefined", "");
                    }
                }
                var text = htmlArr.join("");
                var con = self.getVcardHtml(data, text);
                self.model.set({ "vcardCon": con })
                if (callback) { callback() }
            })(self.model.get("originalUserInfo"));
        },
        editVcardEvent: function (e, data, text) {
            var self = this;
            var parentObj = parent.$;
            if (!self.checkData(parentObj, e)) {
                return
            }

            var options = self.getOptions(parentObj);
            self.model.set({ originalUserInfo: options })
            var con = self.getVcardHtml(data, text);
            var defaultStatus = parentObj("#defaultSign").attr("checked") ? 1 : 0;

            if (parentObj("#addDate").attr("checked")) {
                var dateStatus = 1;
                con1 = con + "<br>$时间$";
            } else {
                var dateStatus = 0;
                con1 = con;
            }
            M2012.Contacts.getModel().modifyUserInfo(options, function (result) {
                if (result.ResultCode == 0) {
                    self.getVcardCon(function (text) {
                        self.model.set({
                            opType: 3,
                            title: "我的电子名片",
                            content: con1,
                            isDefault: defaultStatus,
                            isAutoDate: dateStatus,
                            type: 1
                        })
                        self.model.setSignatures(function (dataSource) {
                            //self.render();
                        })
                        top.M139.UI.TipMessage.show(self.model.messages.successEdit, { delay: 2000 });
                        self.accountSetView(options);
                    });
                } else {
                    self.alertWindow(self.model.messages.editVcardError);
                }
            })
        },
        openVcard: function () {
            var self = this;
            var sid = $T.Url.queryString("sid");
            (function (data) {
                var url = "/m2012/images/ad/face.jpg"; //默认图片
                var link = top.getDomain('resource');
                link = self.checkDomain(link);
                if (data.ImageUrl && data.ImageUrl.indexOf("//") == -1) {
                    url = link + $T.Html.encode(data.ImageUrl);
                    url = M139.HttpRouter.getNoProxyUrl(url);
                }
                var tableArr = [{
                    src: url,
                    title: $T.Html.encode(data.AddrFirstName),
                    job: $T.Html.encode(data.UserJob),
                    company: $T.Html.encode(data.CPName),
                    addr: $T.Html.encode(data.CPAddress),
                    mail: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    phone: data.OtherPhone,
                    fax: data.BusinessFax,
                    zipcode: data.CPZipCode
                }]
                var gray = !data.FavoWord ? "gray" : "";
                var favoword = !data.FavoWord ? "个性签名" : data.FavoWord;
                tableArr[0].subject = "<textarea class='accountTextare " + gray + "'>" + favoword + "</textarea>";
                var arr = [
                    { value: data.FavoWord, key: "简介", type: "subject" },
                    { value: data.UserJob, key: "职务", type: "job" },
                    { value: data.CPName, key: "公司", type: "company" },
                    { value: data.CPAddress, key: "地址", type: "addr" },
                    { value: data.FamilyEmail, key: "邮箱", type: "mail" },
                    { value: data.MobilePhone, key: "手机", type: "mobile" },
                    { value: data.OtherPhone, key: "电话", type: "phone" },
                    { value: data.BusinessFax, key: "传真", type: "fax" },
                    { value: data.CPZipCode, key: "邮编", type: "zipcode" }
                ]
                var len = arr.length;
                var htmlArr = [];
                for (var i = 0; i < len; i++) {
                    if (arr[i].value != undefined) {
                        var html = '<tr><td width="40">' + arr[i].key + '：</td><td>' + arr[i].value + '</td></tr>';
                        htmlArr.push(html)
                    } else {
                        var type = arr[i]["type"];
                        tableArr[0][type] = String(tableArr[0][type]).replace("undefined", "");
                    }
                }
                var text = htmlArr.join("");
                var str = $("#vcardHtml").val();
                var rp1 = new Repeater(str);
                var html1 = rp1.DataBind(tableArr); //数据源绑定后即直接生成dom
                var dialog = self.getTop().$Msg.showHTML(
                    html1,
                    function (e) {
                        self.editVcardEvent(e, data, text);
                    },{
                        dialogTitle: "编辑电子名片",
                        isHtml: true,
                        buttons: ["确 定", "取 消"]
                    }
                );
                
                dialog.$el.find(".accountTextare").focus(function () {
                    var This = $(this);
                    if (This.hasClass("gray")) {
                        This.val("").removeClass("gray");
                    }
                })
                self.getAutoDate(dialog.$el);
                self.model.getSignatures(function (re) {
                    re = self.model.get("newData");
                    var index = $("#btnEditSign").attr("index");
                    var obj = {
                        title: re[index]["title"],
                        con: re[index]["content"],
                        isDefault: re[index]["isDefault"],
                        isAutoDate: re[index]["isAutoDate"]
                    };
                    if (obj.isAutoDate == 1 || obj["con"].indexOf("<br>*年*月*日 星期*") > -1) {
                        dialog.$el.find("#addDate").attr("checked", true);
                        dialog.$el.find("#showNewDate").show();
                    } else {
                        dialog.$el.find("#addDate").removeAttr("checked");
                    };
                });

				// 上传修改头像
				dialog.$el.find("#faceImgSpan").click(function(e){
					$("#info_image input:file")[0].click();
				});
            })(self.model.get("originalUserInfo"));
        },
        setImgUrl: function (url, imgObj) {
            imgObj.attr("src", url)
        },

        /**
        *是否显示时间。
        */
        getAutoDate: function (obj) {
            var self = this;
            obj.find("#addDate").click(function () {
                var content = obj.find("#htmlEdiorContainer iframe").contents().find("body");
                var text = "<br>*年*月*日 星期*";
                if ($(this).attr("checked")) {
                    self.model.set({ "isAutoDate": 1 });
                    obj.find("#showNewDate").show();
                } else {
                    self.model.set({ "isAutoDate": 0 });
                    obj.find("#showNewDate").hide();
                }
            });
        },
        getSignData: function () {
            var self = this;
            this.model.getSignatures(function (result) {
                self.model.set({ "signData": result })
                self.initSign(result);
            })
        },
        ifAddSign: function (data, callback) {
            var self = this;
            var tips = self.model.messages.signContentMax;
            var name = "新建签名";
            var obj = {
                title: "",
                con: '<span style="color:gray">' + tips + '</span>',
                isDefault: "",
                isAutoDate: ""
            }
            var objCon = obj.con;
            self.model.set({
                keyId: -1,
                opType: 1
            })
            var json = {
                objCon: objCon,
                name: name,
                obj: obj,
                data: data,
                callback: callback
            }
            self.getDialog(json);
        },
        ifEditSign: function (data, callback) {
            data = this.model.get("newData")
            var self = this;
            var name = "编辑签名";
            var index = $("#btnEditSign").attr("index");
            var obj = {
                title: data[index]["title"],
                con: data[index]["content"],
                isDefault: data[index]["isDefault"],
                isAutoDate: data[index]["isAutoDate"]
            }
            self.model.set({
                opType: 3
            })
            data.splice(index, 1)
            var objCon = obj.con;
        //    objCon = objCon.replace(/&lt;/g, "<");
        //    objCon = objCon.replace(/&gt;/g, ">");
		objCon = objCon.replace(/&/g,"&amp;"); //add by zsx 反转义
            objCon = objCon.replace("<br>*年*月*日 星期*", "");
            var json = {
                objCon: objCon,
                name: name,
                obj: obj,
                data: data,
                callback: callback
            }
            self.getDialog(json);
        },
        //检查签名的标题和内容是否合法
        checkSignData: function (val, signLen, con, json, e) {
            var self = this;
            for (var i = 0; i < signLen; i++) {
                if (json["data"][i].title == val || val == "我的电子名片" || val == "不使用") {
                    self.alertWindow(self.model.messages.nameExsit);
                    e.cancel = true;
                    return false;
                }
            }
            var arr = [
                { text: self.model.messages.signTitleNull, status: val == "" },
                { text: self.model.messages.signContentNull, status: con == "" },
                { text: self.model.messages.signContentMax, status: M139.Text.Utils.getBytes(con) > 5000 }
            ];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].status) {
                    self.alertWindow(arr[i].text);
                    e.cancel = true;
                    return false
                }
            };
            return true
        },
        getDialog: function (json) {
            var self = this;
            var dialog = self.getTop().$Msg.showHTML(
                    self.getSignHtml(json.obj),
                    function (e) {
                        var parentObj = parent.$;
                        var val = parentObj("#signTitle").val();
                        val = val.replace(/(^\s*)|(\s*$)/g, "");
                        val = val.replace(/</g, "&lt;");
                        val = val.replace(/>/g, "&gt;");
                        var signLen = json["data"].length;
                        var con = parentObj("#htmlEdiorContainer iframe").contents().find("body").html();
                        //con = $T.Html.decode(con); 去掉解码，edit by zsx
						con = con.replace(/&lt;iframe/ig,'&lt').replace(/&lt;\/iframe&gt;/ig,'&lt;&gt;').replace(/onload|onerror/,'');
                        var status = self.checkSignData(val, signLen, con, json, e);
                        if (!status) {
                            return
                        }
                        var defaultStatus = parentObj("#defaultSign").attr("checked") ? 1 : 0;
                        if (parentObj("#addDate").attr("checked")) {
                            var dateStatus = 1;
                            con1 = con + "<br>$时间$"
                        } else {
                            var dateStatus = 0;
                            con1 = con;
                        }
                        self.model.set({
                            title: $T.Html.decode(val),
                            content: con1,
                            isDefault: defaultStatus,
                            isAutoDate: dateStatus,
                            type: 0
                        })
                        self.model.setSignatures(function (dataSource) {
                            if (dataSource["code"] == "S_OK") {
                                json["callback"]();
                            }
                        });
                    },
                    function (e) {
                        self.render();
                    },
                    {
                        dialogTitle: json.name,
                        isHtml: true,
                        buttons: ["确 定", "取 消"]
                    }
                );
            self.getAutoDate(dialog.$el);
            var editor = dialog.$el.find("#htmlEdiorContainer");
            var tips=self.model.messages.signContentMax;
            var editorView = M2012.UI.HTMLEditor.create({
                contaier: editor,
                maxLength: 5000,
                placeHolder: tips,
                maxLengthErrorTip: tips,
                blankUrl: "/m2012/html/editor_blank.htm"
            });
            editor.find("#ED_Bold").after(editor.find("#ED_Italic"))
            editor.find(".eidt-body").css({ "height": "180px" })
            editor.find(".eidt-body-full").css({ "padding-top": "30px" })
            editor.find(".edit-btn,.eidt-bar .eidt-bar-li .line,.eidt-bar .pushon").css({ "display": "none" })
            editor.find("#ED_Bold,#ED_FontFamily,#ED_FontSize,#ED_FontColor,#ED_Italic").css({ "display": "inline-block" })
            editorView.editor.setHtmlContent($T.Html.decode(json.objCon));
            if (json["obj"].isAutoDate == 1 || json["obj"]["con"].indexOf("<br>*年*月*日 星期*") > -1) {
                dialog.$el.find("#addDate").attr("checked", true);
                dialog.$el.find("#showNewDate").show();
            } else {
                dialog.$el.find("#addDate").removeAttr("checked");
            }
            editorView.on("focus", function () {
                var obj = editor.find("iframe").contents().find("body");
                console.log(obj.attr("contenteditable"))
                if (obj.text() == tips) {
                    obj.html("");
                }
            })
            editorView.on("blur", function () {
                var obj = editor.find("iframe").contents().find("body");
                if (obj.text() == "") {
                    obj.html('<span style="color:gray">' + tips + '</span>');
                }
            })
        },
        openSign: function (This, callback) {
            var self = this;
            self.model.getSignatures(function (data) {
                if (This.attr("index")) {
                    self.ifEditSign(data, callback);
                }
                else {
                    self.ifAddSign(data, callback);
                }

            })
        },
        /**
        *无任何签名时显示的文字。
        */
        initText: function () {
            var text = this.model.get("noSign");
            return text;
        },
        /**
        *点击下拉事件，获取签名列表。
        */
        showMenu: function (title, content, idArr, dataSource) {
            var self = this;
            var list = [];
            //console.log(title);
            //id.click(function () {
            self.getMenu(title, content, idArr, dataSource);
            //})
        },
        /**
        *下拉菜单内签名数据的组装和显示。
        */
        getMenu: function (title, content, idArr, dataSource) {
            var self = this;
            self.getVcardCon();
            var dropMenu = M2012.UI.DropMenu.create({
                defaultText: self.model.get("defaultText"),
                //selectedIndex:1,
                menuItems: title,
                container: $("#dropDown")
            });
            dropMenu.$el.css({ "width": "150px" });
            this.dropDownText = $("#dropDown .dropDownText");
            var val = this.dropDownText.text();
            dropMenu.on("change", function (item) {
                var text = item.html;
                var type = item.type;
                var num = item.myData;
                if (text == val) {
                    return
                }
                var isDefault = 1;
                var opType = 3;
                var keyId = "";
                var con = self.model.get("vcardCon");
                var tit = text;
                var isAutoDate = 0
                var t = 1;
                if (text == self.initText()) {
                    isDefault = 0;
                    keyId = self.model.get("keyId");
                    con = self.model.get("content");
                    tit = self.model.get("defaultText");
                    t = self.model.get("type");

                } else if (text == "我的电子名片") {
                    if (!self.has) {
                        opType = 1;
                        keyId = -1;
                    } else {
                        keyId = idArr[num]["id"];
                        isAutoDate = dataSource[num]["isAutoDate"];
                    }
                } else {
                    con = dataSource[num]["content"];
                    con = con.replace("<br>*年*月*日 星期*", "<br>$时间$")
                    tit = $T.Html.decode(text);
                    t = 0;
                    keyId = idArr[num]["id"];
                    isAutoDate = dataSource[num]["isAutoDate"];
                }
                self.model.set({
                    "isDefault": isDefault,
                    "opType": opType,
                    "keyId": keyId,
                    "content": con,
                    "title": tit,
                    "isAutoDate": isAutoDate,
                    "type": t
                })
                self.model.setSignatures(function (dataSource) {
                    self.render()
                })
            });
        },
        /**
        *删除邮件签名。
        */
        delSign: function () {
            var self = this;
            this.model.delSignatures(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    self.model.set({ "defaultText": self.initText(), "isDefault": 0 });
                    self.statusIsDefault = false;
                    self.render();
                }
            })
        },
        /**
        *点击事件，是否删除。
        */
        ifDel: function () {
            var self = this;
            $("#btnIfDel").click(function () {
                var popup = M139.UI.Popup.create({
                            target: document.getElementById("btnIfDel"),
                            icon: "i_warn",
                            width: "200",
                            buttons: [{ text: "确定", cssClass: "btnSure", click: function () { self.delSign(); popup.close(); } },
        		                { text: "取消", click: function () { popup.close(); } }
        	                ],
                            content: "确定删除签名吗"
                        }
	                );

                popup.render();

            })
        },
        alertWindow: function (text, obj) {
            this.getTop().$Msg.alert(
                        text,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn",
                            onClose: function (e) {
                                if (obj) {
                                    obj.focus();
                                }
                            }
                        }
                    );
        },
        /**
        *添加邮件签名的弹出层。
        */
        addSign: function () {
            var self = this;
            $("#btnAddSign").click(function () {
                var This = $(this);
                if (self.model.get("isMax") == true) {
                    var text = self.model.messages.signMaxNum;
                    self.alertWindow(text);
                    return;
                }
                self.openSign(This, function () {
                    self.render();
                    top.BH("set_add_sign_save_success");
                });
            })
        },
        /**
        *编辑签名的弹出层，分为二种情况  编辑签名和编辑电子名片。
        */
        editSign: function () {
            var self = this;
            $("#btnEditSign").unbind();
            $("#btnEditSign").click(function () {
                var This = $(this);
                var sid = $T.Url.queryString("sid");
                var myInfo = $("#norTipsIco");
                if ($("#norTipsIco:hidden").length == 0) {
                    try {
                        self.openVcard();
                    } catch (e) { };
                    return;
                };
                var index = $(this).attr("index");
                self.openSign(This, function () {
                    self.render();
                });
            })
        },
        getSignHtml: function (obj) {
            var html = [
                '<link href="/m2012/css/module/editer.css" type="text/css" rel="stylesheet" />',
                '<style></style>',
                '<div class="acccount-edit">',
                '<input id="signTitle" type="text" maxlength="20" value="' + obj.title + '" class="iText mb_10">',
                '<div id="htmlEdiorContainer">',
                '</div>',
                '</div>',
                '<div class="editcardPop-foot">',
                '<label class="mr_10" for="defaultSign"><input id="defaultSign" checked type="checkbox" value="" class="mr_5">设为默认邮件签名</label>',
                '<label for="addDate"><input id="addDate" type="checkbox" value="" class="mr_5">添加写信日期<span style="display:none;" id="showNewDate"  class="gray">(*年*月*日 星期*)</span></label>',
                '</div>'].join("");
            return html;
        },
        getVcardHtml: function (obj, text) {
            var self = this;
            var link = self.httpimgload;
            link = self.checkDomain(link);
            var url = link + $T.Url.queryString("sid") + "&path=" + encodeURIComponent(obj.ImageUrl);
            url = M139.HttpRouter.getNoProxyUrl(url);

            var html = ['<table>',
            '<tbody>',
            '<tr>',
            '<td style="color:#b1b1b1;">-----------------------------------------------------</td>',
            '</tr>',
            '<tr>',
            '</tr>',
            '</tbody>',
            '</table>',
            '<table border="0" style="font-family:宋体;font-size:12px;border:1px solid #b5cbdd;-webkit-border-radius:5px;line-height:21px;background-color:#f8fcff;">',
            '<tbody>',
            '<tr>',
            '<td style="vertical-align:top;padding:5px;"><img rel="signImg" width="96" height="96" src="',
            url,
            '"></td>',
            '<td style="padding:5px;">',
            '<table style="font-size:12px;line-height:19px;">',
            '<tbody>',
            '<tr>',
            '<td colspan="2"><strong id="dzmp_unm" style="font-size:14px;">',
            $T.Html.encode(obj.AddrFirstName),
            '</strong></td>',
            '</tr>',
            '<tr>',
            '<td colspan="2" style="padding-bottom:5px;">',
            $T.Html.encode(obj.FavoWord),
            '</td>',
            '</tr>',
            $T.Html.encode(text),
            '</tbody>',
            '</table>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>'].join("");
            return html;
        }
    })
        );

})(jQuery, _, M139);
