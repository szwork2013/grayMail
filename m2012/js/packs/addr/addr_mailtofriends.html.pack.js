//#region Model
; (function (jQuery, _, M139) {
    M139.namespace("M2012.Contacts.MailToFriends.Model", Backbone.Model.extend({
        defaults: {
            importId: null,
            groupName: null,
            inviteType: null,

            selectType: 1, //1:全选; 0:全不选
            toggle: 0, //-1时触发反选，反选完重设为0，为下一次反选做准备

            isDataReady: false,
            isGetListError:false
        },
        API:top.Contacts,
        getFinshImportList: function (callback) {
            var _this = this;
            var isReady = _this.get("isDataReady");
            if (!isReady) {
                var importId = _this.get("importId");
                _this.API.getFinishImportList(importId, function (data) {
                    var SUCCESS = "0", code = data.ResultCode;
                    isReady = code == SUCCESS;
                    if (isReady) {
                        callback && callback(data.FinshImportList);
                    } else {
                        _this.set({ "isGetListError": true });
                    }
                });
            }
        }
    }));
})(jQuery, _, M139);
//#endregion

//#region View
(function ($, _, M139) {

    function bh(a,b) {
        if (top.BH) {
            top.BH({ actionId: a });
        } else {
            top.addBehaviorExt({
                actionId: a,
                thingId: b,
                moduleId: 14
            });
        }
    }

    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.Contacts.MailToFriends.View", superClass.extend(
    {
        queryString: {
            BATCHID: "bid", //通过URL跳转过来的导入批次号，数据安全由服务端保障
            GROUPNAME: "groupname",
            INVITETYPE: "invitetype"
        },
        templates: {
            LI: '<li><label><input type="checkbox" name="RadioInvite" value="{value}" checked="checked"/>{text}</label></li>'
        },
        Messages: {
            SUBJECT: "{user}给您发送的邀请函",
            SELECT_FRIENDS: "请选择需要发邀请信的好友",
            NICKNAME_IS_NULL: "请输入您的昵称",
            SENDING: "正在发送，请稍等...",
            FAIL: "通知好友邮件发送失败",
            ERROR: "获取数据失败"
        },
        selectType: {
            ALL: 1,
            NULL: 0,
            TOGGLE: 2,
            RESET: -1 //重设标记位
        },
        initialize: function () {
            var _this = this;
            _this.model = new M2012.Contacts.MailToFriends.Model();

            //保存变量
            var batchId = $Url.queryString(_this.queryString.BATCHID),
                groupName = $Url.queryString(_this.queryString.GROUPNAME),
                inviteType = $Url.queryString(_this.queryString.INVITETYPE);
            var contentTemplate = $("#txtMailBody").val(); //邮件内容的模板
            var nickName = top.$User && top.$User.getTrueName() || top.trueName || "";
                sender = top.$User && top.$User.getDefaultSender() || (top.uid + "@" + top.mailDomain);
            _this.model.set({
                importId: batchId,
                groupName: groupName,
                inviteType: inviteType,
                content: contentTemplate,
                nickName: nickName,
                sender: sender,
                sendName: nickName || sender
            });

            //POST form action
            var form = $("#form1");
            var url = form.attr("action");
            form.attr("action", $T.format(url, {
                sid: top.sid,
                groupname: groupName,
                invitetype: inviteType,
                batch: batchId
            }));

            //nickname
            $("#txtNickName").val(nickName);

            //content
            $("#txtMailBody").val($T.format(contentTemplate, { name: nickName, email: sender }));

            _this.initEvents();
            _this.render();
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var types = _this.selectType;

            //#region 监听事件绑定
            model.on("change:selectType", function () {
                var selectType = _this.model.get("selectType");
                _this.selectInputs(selectType);
                model.set({ selectType: types.RESET }, { silent: true }); //重设
            });

            model.on("change:isGetListError", function () {
                var isError = _this.get("isGetListError");
                if (isError) {
                    top.M139 && top.M139.UI.TipMessage.show(_this.Messages.ERROR, { delay: 2000 });
                }
            });
            //#endregion

            //全选，反选，清空
            $("#selectAll").on("click", function () { model.set({ selectType: types.ALL }); });
            $("#selectNull").on("click", function () { model.set({ selectType: types.NULL }); });
            $("#selectOther").on("click", function () { model.set({ selectType: types.TOGGLE }); });

            //返回
            $("#goback").on("click", function () { 
                _this.back();
                //top.Links.show("addr"); 
            });

            //修改昵称
            $("#txtNickName").on("keyup", function () { _this.setContent(); });

            //发送，发送并返回
            $("#btnInvite").on("click", function () { 
                top.BH('addr_request_send');
                _this.informFriends();                 
            });
            $("#btnInviteLook").on("click", function () { 
                top.BH('addr_request_sendCopy');
                _this.informFriendsAndGoback(); 
            });

            $("#txtMailBody").on('focus', function(){ this.blur() });
        },
        render: function () {
            var _this = this;

            _this.model.getFinshImportList(function (list) {
                _this.initView(list);
            });

            bh(104464);
        },
        initView: function (list) {
            var _this = this;
            var template = _this.templates.LI;
            var htmls = [];
            $.each(list, function (i, item) {
                htmls += $T.format(template, {
                    text: [item.AddrName, "&lt;", item.Email, "&gt;"].join(""),
                    value: item.Email
                });
            });
            $("#ulImported").html(htmls);
        },
        setContent: function () {
            var _this = this;
            var template = _this.model.get("content");
            var sender = _this.model.get("sender");
            var nickName = $("#txtNickName").val();
            $("#txtMailBody").val($T.format(template, { name: nickName, email: sender }));
        },
        informFriends: function () {
            var _this = this;
            _this.sendMail(function () {
                top.BH('addr_notifierEmail_success');
                window.location.href = "http://" + top.location.host +
                    "/m2012/html/addr/addr_invitesuccess.html?sid=" + top.sid;
                return false;
            });
        },
        informFriendsAndGoback: function () {
            var _this = this;
            _this.sendMail(function () {
                if (top.$App) {
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                } else {
                    top.Links.show('addr', '&groupname=' + encodeURI(_this.model.get("groupName")));
                }
                return false;
            });
        },
        sendMail: function (callback, onerror) {
            var _this = this;
            var msgs = _this.Messages;

            //检查昵称
            var nickInput = $("#txtNickName");
            var nickName = nickInput.val();
            if (!nickName) {
                top.$Msg.alert(msgs.NICKNAME_IS_NULL);
                return;
            }

            //检查通知的好友列表
            var inputs = $("#ulImported input:checked");
            if (inputs.length <= 0) {
                top.$Msg.alert(msgs.SELECT_FRIENDS);
                return;
            }

            var subject = $T.format(msgs.SUBJECT, { user: nickName }),
               content = $("#txtMailBody").val();
            var emails = [];
            $.each(inputs, function (i, item) {
                emails.push($(this).val());
            });

            top.M139 && top.M139.UI.TipMessage.show(_this.Messages.SENDING);

            if (top.$PUtils) {
                top.$PUtils.sendMail({
                    email: emails.join(","), //收件人地址‘,’号分隔
                    subject: $T.Html.encode(subject),
                    content: content.replace(/\r\n|\n/g, "<br/>"), //change by AeroJin 2014.02.25
                    callback: function (result) {
                        top.M139 && top.M139.UI.TipMessage.hide();
                        var data = result.responseData;
                        var SUCCESS = "S_OK";
                        if (data.code == SUCCESS) {
                            callback && callback(data);
                        }
                        else {
                            onerror ? onerror(data) : (function () { top.M139 && top.M139.UI.TipMessage.show(_this.Messages.FAIL, { delay: 3000 }) })();
                        }
                    }
                });
            } else {
                top.CM.sendMail({
                    to: emails,
                    singleSend: true, //是否群发单显
                    isHtml: false,
                    subject: subject,
                    content: content.replace(/\r\n|\n/g, "<br/>"), //change by AeroJin 2014.02.25
                    saveToSendBox: false, //保存到发件箱
                    onsuccess: function(result) {
                        if (result.mid) {
                            callback && callback(result);
                        } else {
                            top.FF.alert(_this.Messages.FAIL);
                        }
                    },
                    onerror: function() {
                        top.FF.alert(_this.Messages.FAIL);
                    }
                });
            }
        },
        selectInputs: function (type) {
            var _this = this;
            var types = _this.selectType;
            var inputs = $("#ulImported input");
            switch (type) {
                case types.ALL:
                    inputs.attr("checked", true);
                    break;
                case types.NULL:
                    inputs.attr("checked", false);
                    break;
                case types.TOGGLE:
                    $.each(inputs, function (i, item) {
                        var input = $(this);
                        var checked = input.attr("checked");
                        input.attr("checked", !checked);
                    });
                    break;
                default:
                    break;
            }
        },
        back: function(){
            //返回
            setTimeout(function() {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
            return false;
        }
    }));

    $(function () {
        window.View = new M2012.Contacts.MailToFriends.View();
    });
})(jQuery, _, M139);
//#endregion
