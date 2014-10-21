//冲突检测
if (!window.mail139) {
    var mail139 = {};
}

if (!mail139.addr) {
    mail139.addr = {};
}

//尽可能聚合顶层的对象;
var Pt = {

    $U: top.$Url,
    $RM: top.$RM,
    $Cookie: top.M139.Text.Cookie,
    $T: top.$T,
    UI_Menu: M2012.UI.ListMenu,
    alert: function () {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },
    confirm: function () {
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },
    parent: function () {
        return top;
    },

    getSid: function () {
        return top.$App.getSid();
    },
    
    getMaxSend: function () {
        return top.$User.getMaxSend();
    },
    
    getMaxContactLimit: function () {
        return top.$User.getMaxContactLimit();
    },
    
    getServiceItem: function () {
        return top.$User.getServiceItem();
    },

    ucDomain: function (path) {
        return top.getDomain("webmail") + path;
    },

    param: function (key) {
        return this.parent().$Url.queryString(key, location.href);
    },

    htmlEncode: function (str) {
        return M139.Text.Html.encode(str);
    },

    cookie: function (name, value) {
        if (arguments.length === 2) {
            this.$Cookie.set({name: name, value: value});
        } else {
            return this.$Cookie.get(name);
        }
    },

    callOldApi: function (option) {
        var api = "/sharpapi/addr/apiserver/" + option.action;
        var params = option.param || {};
        params.sid = this.getSid();

        var url = this.$U.makeUrl(api, params);

        this.$RM.call(url, {}, function (json) {
            json = json.responseData;
            if (Number(json.ResultCode) === 0) {
                if ($.isFunction(option.success)) {
                    option.success(json);
                }
            } else {
                if ($.isFunction(option.error)) {
                    option.error(json);
                }
            }
        });
    }
};


var vipMsg = ADDR_I18N[ADDR_I18N.LocalName]["vip"];
var Retry={
	retryTime : 0,
	retryData : "",
	retryFun : null
} ; //home页全局变量，用来做重试操作使用。

mail139.addr.home = {

    //你可能认识的人
    relationId: "",

    //指示是否正在做快速编辑
    isediting: false,

    //待完善
    uncompletedInfo: "",

    //本地存储的键名
    KEY_HOMEDATA_LS: "mail139_addr_homedata",

    //主函数
    main: function () {
        var that = this;

        top.WaitPannel.show(PageMsg.info_waiting);

        that.timerReload = setTimeout(function () {
            if (top.Contacts.reload) {
                top.Contacts.reload();
            }
        }, 4000);

        that.timerFail = setTimeout(function() {
            Pt.alert(PageMsg.error_sysbusy);
            top.WaitPannel.hide();
        }, 10000);

        window.top.Contacts.ready(function() {
            top.WaitPannel.hide();
            View.init();
            bindEvent();
            clearTimeout(that.timerReload);
            clearTimeout(that.timerFail);
        });

        that.blockOnedit(that);
        that.smsSearch();
        that.other();
    },

    setHomeUncompleted: function ()//设置首页等完善
    {
        if (mail139.addr.home.uncompletedInfo) {
            $("#liUncompleted a").text(mail139.addr.home.uncompletedInfo);
        }
        filter.setDefault();
    },

    //快速编辑联系人时，点其他链接与离开页面默认保存
    blockOnedit: function(_this) {

        $(window).unload(function(e) {
            var obj, msg, ischanged;
            obj = QuickEditServer;
            if (_this.edit.isChanged() && confirm(PageMsg.warn_withoutsave)) {
                QE($(obj.trQES).find('.i-edit-suc')[0]);
                e.stopPropagation();
                return false;
            }
        });

        $(document).bind("mousedown", function(event) {
            var obj, items, ischanged, clzName, actionEle;

            obj = QuickEditServer;
            if (!obj.haveEdit) return;

            if (_this.edit.isChanged()) {
                mail139.addr.home.isediting = true;
            } else {
                mail139.addr.home.isediting = false;
            }

            clzName = $(event.target)[0].className;
            actionEle = ',LI,A,BUTTON,IMG,SELECT,OPTION,';
            if (actionEle.indexOf(',' + event.target.tagName + ',') > -1
				|| clzName == "i-edit-suc" || clzName == "update") {
                event.stopPropagation();
                return false;
            } else {
                if (event.target.type == 'text') return;
                if (mail139.addr.home.isediting) {
                    QE($(obj.trQES).find('.i-edit-suc')[0]);
                } else {
                    items = obj.trQES.getElementsByTagName('TD');
                    hideEdit(items[1], items[2], items[3]);
                    obj.haveEdit = false;
                }
            }
        })
    },

    //显示短信查询通讯录提示
    smsSearch: function () {
        (function(p, tip) {
            var t = 0;
            p.mouseover(function(e) {
                tip.fadeIn();
                top.addBehavior("14_30189_4短信查询通讯录链接");
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
            }).mouseout(function() {
                t = setTimeout(function() {
                    clearTimeout(t);
                    tip.hide();
                }, 3000);
            });
        })($("#smsContactTip"), $("#tipSms"));
    },

    //其他启动项目
    other: function() {
        var _this = this;

        //加载界面显示的数据
        $('#imgPerson').attr('src', top.resourcePath + '/images/face.png');
        _this.load(function(rs) {
            _this.render.start(rs);
        });

        //显示Outlook插件入口浮层
        Render.showOutlookTips();
        Render.showFloatTips();

        //发传真范围：广东
        if (top.UserData.provCode != 1) {
            $("#btnFax, #btnFax2").parent().hide();
        }

        $(window).resize(function() {
            var frameHeight = $(window.frameElement).height();
            $("#sidebar").height(frameHeight);
            var div = $("div.profile");
            var aa = div.offset(); //取offset引发回流。
        });

        $(window).unload(function() {
            try {
                top.WaitPannel.hide();
            } catch (e) {
            }
        });
    },

    //绘制界面的几个地方
    render: {
        //集中调用
        start: function(rs) {
            var _this = this;

            for (var resp in rs) {
                if (rs.hasOwnProperty(resp)) {
                    try {
                        var data = rs[resp];
                        if (data && data.ResultCode === "0" && _this[resp]) {
                            _this[resp](data);
                        } else if (data.ResultCode === "12" || data.ResultCode === "13") {
                            top.Utils.showTimeoutDialog();
                        }
                    } catch (e) {
                        top.M139.Logger.getDefaultLogger().error("addrhomedata error", e);
                    }
                }
            }
        },

        //待清理
        GetNumWaitForCleaningResp: function (data) {
            if (parseInt(data.NumWaitForCleaning) > 0) {
                var link = $("#liClean a");
                link.text("待清理(" + data.NumWaitForCleaning + ")");
                link.parent().show();
            }
        },

        //待更新
        GetUpdatedContactsNumResp: function (data) {
            var btnUpdate = $("#liUpdateContacts");
            if (Number(data.UpdatedContactsNum) === 0) {
                btnUpdate.hide();
                return;
            }

            var str = "待更新(" + data.UpdatedContactsNum + ")";
            btnUpdate.find("a").text(str).unbind("click").click(function() {
                top.addBehaviorExt({ actionId: 101243, thingId: 0, moduleId: 14 });
                View.changeView('Redirect', { key: 'updateContacts' });
                return false;
            });
            btnUpdate.show();
        },

        //可能认识的人
        WhoAddMeByPageResp: function (data) {
            //手机号变星星。
            function replaceStar(name) {
                var showName = name;
                if (name.length == 11 && /^\d+$/.test(name)) {
                    showName = name.replace(/(?:^86)?(\d{3})\d{4}/, "$1****");
                }
                return showName;
            }
            
            var htmHave;
            var liWho = '<li><a behavior="14_30189_3具体头像或链接" href="javascript:{params};View.changeView(\'Redirect\',{key:\'whoaddme\'});" ><img  src="{ImageUrl}"><span>{showName}</span></a></li>';
            var buff = [];

            if (data.UserInfo.length === 0) {
                $("#19_1403_7").hide();
                return;
            }

            //显示可能认识的人总数
            if(Number(data.TotalRecord) > 0){
                var whoaddmecount='<span>(' + data.TotalRecord + ')</span>' ;
                $("#whoaddmeCount").html(whoaddmecount);
            }

            data = data.UserInfo;
            for (var i = 0, m = data.length; i < m; i++) {//取4个
                if (data[i].DealStatus != 0) continue;
                
                data[i].showName = Pt.htmlEncode(replaceStar(data[i].Name));
                data[i].ImageUrl = Pt.htmlEncode((new top.M2012.Contacts.ContactsInfo(data[i])).ImageUrl);

                if (data[i].RelationId) {
                    data[i].RelationId = data[i].RelationId;                    
                    data[i].params = 'mail139.addr.home.relationId=' + data[i].RelationId;
                }else if(data[i].UIN){
                    data[i].params = 'mail139.addr.home.uinId=' + data[i].UIN;
                }else{
                    data[i].params = '';
                }
                
                buff.push(top.$TextUtils.format(liWho, data[i]));
            }
            htmHave = '<ul>' + buff.join('') + '</ul>';
            $(htmHave).replaceAll("#divNoAddme");
        },

        //可能重复
        GetRepeatContactsResp: function (data) {
            var total = 0;

            for (var i = data.RepeatInfo.length; i--; ) {
                total += data.RepeatInfo[i].sd.split(",").length;
            }

            var btnRep = $("#liRepeat");
            if (total === 0) {
                btnRep.hide();
                return;
            }

            btnRep.find("a").text("可能重复({0})".format(total)).unbind("click").click(function() {
                //在所有联系人页面点击顶部导航按钮 2：可能重复按钮
                top.addBehaviorExt({ actionId: 30188, thingId: 2, moduleId: 14 });
                View.changeView('Redirect', { key: 'merge' });
                return false;
            });
            btnRep.show();
        },

        //个人资料
        QueryUserInfoResp: function (data) {

            (function (P) {
                P.lblName.html(P.uid);

                var i, pName = false;

                var imgurl = P.data.ImageUrl;
                P.imgPhoto.attr('src', imgurl);

                //我的资料调取先后规则：个人资料-姓名（即发件人姓名）>个人资料-昵称>邮箱前缀（别名）>邮箱前缀（手机号），不显示飞信别名
                if (P.data) {
                    P.pMobile.text(P.data.getFirstMobile());
                    P.pEmail.text(P.data.FamilyEmail);
                    pName = P.data.AddrFirstName;
                    if (!pName || pName.length == 0) {
                        pName = P.name;
                    }
                    if (!pName || pName.length == 0) {
                        pName = P.data.AddrNickName;
                    }
                }
                if (!pName || (pName.length < 1 && P.uids.length > 0)) {
                    for (i = 0; i < P.uids.length; i++) {
                        if (!(/^\d+$/.test(P.uids[i]))) {
                            pName = P.uids[i];
                            break;
                        }
                    }
                }
                if (!pName || pName.length == 0) {
                    pName = P.uid;
                }
                P.lblName.text(pName);

            })({
                name: top.trueName,
                uid: top.$Mobile ? top.$Mobile.remove86(top.uid) : top.uid, //remove 86 header
                uids: top.UserData.uidList,
                sid: Pt.getSid(),
                res: top.resourcePath,
                data: new top.M2012.Contacts.ContactsInfo(top.$App.getModel("contacts").userInfoTranslate(data.UserInfo[0])),
                uc: top.ucDomain,
                lblName: $('#j_lnk_myinfo'),
                imgPhoto: $('#imgPerson'),
                pMobile: $('#pUserMobile'),
                pEmail: $('#pUserEmail')
            });
        },

        //设置待完善联系人数量
        GetUncompletedContactsResp: function(data) {
            var btnUc = $("#liUncompleted");
            var link = btnUc.find("a");

            if (!data || Number(data.TotalRecord) === 0) {
                btnUc.hide();

                //处于修改完善联系人状态，修改完最后一条后，自动返回
                if (link.text() == "返回") {
                    filter.setFilter({ uncompleted: "" });
                    View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: "All" });
                }
                return;
            }

            //抽离提示数量的参数
            var uncompleted = "待完善";
            var home = mail139.addr.home;
            home.uncompletedCount = data.TotalRecord;
            home.uncompletedList = data.UncompletedContactsInfo;
            home.uncompletedInfo = "{0}({1})".format(uncompleted, home.uncompletedCount);

            //处于修改完善联系人状态，修改一个刷新列表
            if (link.text() == "返回") {
                //说明：取消原有的默认刷新，会导致排序错乱（gethomedata的问题）
                //保留排序规则以及对应页码。加载新数据并刷新
                var ft = { uncompleted: home.uncompletedList };
                if (filter.needSort) {
                    //排序取反，在render的时候会再次取反，以保证和之前的排序一致
                    switch (filter.sortType) {
                        case "name":
                            ft.nameOrder = -filter.nameOrder;
                            break;
                        case "email":
                            ft.emailOrder = -filter.emailOrder;
                            break;
                        case "mobile":
                            ft.mobileOrder = -filter.mobileOrder;
                            break;
                        default:
                            break;
                    }
                }
                filter.setFilter(ft);
                Render.renderContactsList();
                Render.renderSelectPageIndex(home.uncompletedCount); //重新初始化页码
                thePageTurnner.turnPage(thePageTurnner.pageIndex); //current page
                $("#divContactsList h4").text(PageMsg.info_Uncompleted);
                return;
            }

            link.attr("title",PageMsg.unConmpleted_title);
            link.text(home.uncompletedInfo).unbind("click").click(function() {
                var _this = $(this);
                if (_this.text().indexOf(uncompleted) < 0) {
                    _this.text(home.uncompletedInfo);
					link.attr("title", PageMsg.unConmpleted_title);
                    filter.setFilter({ uncompleted: "", needSort: false, sortType: "" }); //返回所有联系人时，取消之前的排序规则(破坏性操作返回时，恢复最原始视图)
                    View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: "All" });
                    return;
                } else {
                    _this.text("返回");
					_this.attr("title","");
                    //成功加载完善页面日志
                    top.addBehaviorExt({ actionId: 30178, thingId: 0, moduleId: 14 });
                    Render.closeTip();
                }
                //在所有联系人页面点击顶部导航按钮 3：待完善按钮
                top.addBehaviorExt({ actionId: 30188, thingId: 3, moduleId: 14 });

                var tmpHead = '<p style="text-align:left;"><span style="font-family:Applied Font;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">您现在有</span><span style="font-family:Applied Font;font-size:18px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF0000;">{0}</span><span style="font-family:Applied Font;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">个联系人的资料需要完善，建议完善</span></p>';
                tmpHead = tmpHead.format(home.uncompletedCount);

                filter.setFilter({ uncompleted: home.uncompletedList });
                View.orderDefault();
                $("#divContactsList h4").text(PageMsg.info_Uncompleted);
                return false;
            });
            btnUc.show();
        },

        GetColorCloudInfoResp: function (data) {},
        GetRemindBirdaysResp: function (data) {}
    },

    //快速编辑被调函数
    edit: {
        isChanged: function() {
            var obj, items, ischanged;
            obj = QuickEditServer;
            if (!obj.trQES) return;

            items = obj.trQES.getElementsByTagName('input');
            if (items.length < 4) return;
            ischanged = obj.nameQES != items[1].value
					|| obj.emailQES != items[2].value
					|| obj.mobileQES != items[3].value;
            return ischanged;
        },
        save: function(param) {
            //serialId, name, email, mobile
            var serialId = param.serialId;
            top.Contacts.getContactsInfoById(serialId, function(result) {
                if (!result.success) {
                    Pt.alert(result.msg);
                    return;
                }

                var contact = new top.ContactsInfo(result.contactsInfo);
                onqueryed(contact);
            });

            function isempty(s) {
                return !s || s.length == 0 || $.trim(s).length == 0;
            }

            function merge(c) {
                c.AddrFirstName = param.name

                //由于列表上优先显示FamilyEmail，所以可以先判商业邮箱为空
                //来确定用户需要修改FamilyEmail，否则FamilyEmail也空时就
                //更新BusinessEmail，都不是则更新FamilyEmail，置空OtherEmail
                var email1 = c.FamilyEmail,
                    email2 = c.BusinessEmail,
                    email3 = c.OtherEmail,
                    mobile1 = c.MobilePhone,
                    mobile2 = c.BusinessMobile,
                    mobile3 = c.OtherMobile;

                if (isempty(email2)) {
                    email1 = param.email;

                } else if (isempty(email1)) {
                    email2 = param.email;

                } else {
                    email1 = param.email;
                }

                c.FamilyEmail = email1;
                c.BusinessEmail = email2;
                c.OtherEmail = email3;

                if (isempty(mobile2)) {
                    mobile1 = param.mobile;

                } else if (isempty(mobile1)) {
                    mobile2 = param.mobile;

                } else {
                    mobile1 = param.mobile;

                }

                c.MobilePhone = mobile1;
                c.BusinessMobile = mobile2;
                c.OtherMobile = mobile3;

                return c;
            }

            function onqueryed(c) {

                c = merge(c);

                top.Contacts.ModContactsField(serialId, c, false, function(result) {
                    mail139.addr.home.isediting = false;
                    items = QuickEditServer.trQES.getElementsByTagName('td');

                    if (result.resultCode == '0') {

                        hideEdit(items[1], items[2], items[3]);
                        setSaveShow(QuickEditServer.trQES, false);
                        QuickEditServer.haveEdit = false;
                        Pt.alert(result.msg);
                        SetNewContact(items[1], items[2], items[3], result);
                        mail139.addr.home.reload();

                        if(top.Contacts.IsVipUser(serialId)){//更新VIP邮件
                            top.Contacts.updateCache("editVipContacts",param.serialId);
                            Tool.updateVipMail();
                        }
                        return true;
                    } else if (result.resultCode == "226" || result.resultCode == "224") {//重复
                        var DetailMsg = ADDR_I18N[ADDR_I18N.LocalName]["detail"];
                        var msg = result.resultCode =="226" ? DetailMsg.warn_emailRepeat : DetailMsg.warn_mobileRepeat;
                        top.$Msg.confirm(
                            msg,
                            function(){ 
                                top.Contacts.ModContactsField(QuickEditServer.serialIdQES, c, true, function(result) {
                                    if (result.resultCode == '0') {
                                        hideEdit(items[1], items[2], items[3]);
                                        setSaveShow(QuickEditServer.trQES, false);
                                        QuickEditServer.haveEdit = false;
                                        Pt.alert(result.msg);
                                        SetNewContact(items[1], items[2], items[3], result);
                                        mail139.addr.home.reload();

                                        if(top.Contacts.IsVipUser(serialId)){//更新VIP邮件
                                            top.Contacts.updateCache("editVipContacts",param.serialId);
                                            Tool.updateVipMail(); 
                                        }
                                        return true;
                                    }
                                    else {
                                        Pt.alert(result.msg);
                                    }
                                });
                            },
                            function(){ 
                                hideEdit(items[1], items[2], items[3]);
                                setSaveShow(QuickEditServer.trQES, false);
                                QuickEditServer.haveEdit = false;
                        });

                    }
                    else {
                        Pt.alert(result.msg);
                    }
                });
            }
        }
    },

    //异步加载数据
    load: function(onSuccess, onFail) {

        if (top.SiteConfig.addrbatchdisable) {
            var apilist = [
                {a:"QueryUserInfo", b: {}},
                {a:"WhoAddMeByPage", b: {attributes: {Page:"1", Record:"4", Relation: "0"}}},
                {a:"GetRepeatContacts", b: {}},
                {a:"GetUncompletedContacts", b: {}},
                {a:"GetUpdatedContactsNum", b: {}},
                {a:"GetNumWaitForCleaning", b: {}}
            ];

            var timer = setInterval(function() {
                if (!apilist.length) {
                    clearInterval(timer);
                    return;
                }

                var api = apilist.shift();
                var data = {};
                data[api.a] = api.b;

                top.M2012.Contacts.API.call(api.a, data, function(e) {
                    var rs = e.responseText;
                    if (/^(.*?)=/.test(rs)) {
                        rs = rs.match(/^(.*?)=/)[1];
                    } else {
                        rs = "GetNumWaitForCleaningResp";
                    }

                    if (rs) {
                        var result = {};
                        result[rs] = e.responseData;
                        onSuccess(result);
                    }
                }, {});

            }, 256);
            return;
        }

        top.M2012.Contacts.API.batchQuery({
            requestData: {
                BatchQuery: {
                    QueryUserInfo: {},
                    WhoAddMeByPage: { attributes: {Page:"1", Record:"4", Relation: "0"} },
                    GetRepeatContacts: {},
                    GetUncompletedContacts: {},
                    GetUpdatedContactsNum: {},
                    GetNumWaitForCleaning: {},
                    GetColorCloudInfo: {},
                    GetRemindBirdays: {}
                }
            },
            success: function(rs){
                onSuccess(rs);
            },
            error: function(rs){
                if ($.isFunction(onFail)) onFail(rs);
            }
        });

    },

    //重载异步数据
    reload: function() {
        var _this = this;
        _this.load(function(rs) {
            _this.render.start(rs);
        });
    }
};

//主函数入口
$(function() {
    mail139.addr.home.main();
});

function hideMenu() {
    $("#ulCopyTo,#ulMoveTo,#ulSendTo,#ulCopyTo2,#ulMoveTo2,#ulSendTo2,#pnlPageSize1,#pnlPageSize2,#pnlPage1,#pnlPage2").hide();
};

function bindEvent() {

    $("#j_lnk_myphoto, #j_lnk_myinfo").click(function(){
        View.changeView('Redirect', {key: 'mybusinesscard'});
        return false;
    });

  //姓名-邮箱-电话 -排序
	$("#name,#email,#mobile").click(function(){
		var sortType = $(this).attr("id");
		filter.sort(sortType);
	});
	
  //首字母
    $("#firstLetter a").click(function() {
        View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: $(this).text() });
    })

    //改变一页显示条数
    var pagesizes = [20, 50, 100];
    var defaultSize = Tool.getPageSizeCookie();

    $("#btnPageSize1, #btnPageSize2").click(function() {
        hideMenu();
    });

    //每页显示数
    var lstPage1 = new Pt.UI_Menu({
        data: pagesizes,
        defaultValue: defaultSize,
        expandButton: $("#btnPageSize1")[0],
        textField: $("#fieldPageSize1")[0],
        listContainer: $("#pnlPageSize1")[0],
        onItemCreate: function(itemData, index, total) {
            var html = "<li data-value=\"" + itemData + "\"><a href=\"javascript:;\" hidefocus=\"1\"><span>" + itemData + "</span></a></li>";
            return html;
        },
        onItemClick: function(args) {
            lstPage2.value(args.value);
            View.changeView("ChangeFilter", { key: "pageSize", pageSize: args.value });
        }
    });

    //每页显示数
    var lstPage2 = new Pt.UI_Menu({
        data: pagesizes,
        defaultValue: defaultSize,
        expandButton: $("#btnPageSize2")[0],
        textField: $("#fieldPageSize2")[0],
        listContainer: $("#pnlPageSize2")[0],
        onItemCreate: function(itemData, index, total) {
            var html = "<li data-value=\"" + itemData + "\"><a href=\"javascript:;\" hidefocus=\"1\"><span>" + itemData + "</span></a></li>";
            return html;
        },
        onItemClick: function(args) {
            lstPage1.value(args.value);
            View.changeView("ChangeFilter", { key: "pageSize", pageSize: args.value });
        }
    });

    //全选复选框
    $("#chkSelectAll").click(function() {
        var checked = this.checked;
        $("#tableContactsList input:checkbox").attr("checked", checked ? "checked" : null);
        if (checked) {
            $("#tableContactsList tr").addClass("current");
        } else {
            $("#tableContactsList tr").removeClass("current");
        }
    })
    //点写信
    $("#btnCompose,#btnCompose2").click(function() {
        View.changeView("SendMail");
        top.addBehaviorExt({ actionId: 26019, thingId: 1, moduleId: 14 });
        return false;
    });
    //点发短信
    $("#btnSMS, #btnSMS2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendSMS");
        top.addBehaviorExt({ actionId: 26019, thingId: 2, moduleId: 14 });
        return false;
    });
    //点发彩信
    $("#btnMMS, #btnMMS2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendMMS");
        top.addBehavior("14_26019_3通讯录工具栏发彩信");
        return false;
    });
    //发贺卡
    $("#btnGCard,#btnGCard2").click(function() {
        View.changeView("SendGCard");
        top.addBehaviorExt({ actionId: 26019, thingId: 5, moduleId: 14 });
        return false;
    });
    //发明信片
    $("#btnPCard,#btnPCard2").click(function() {
        View.changeView("SendPCard");
        top.addBehaviorExt({ actionId: 26019, thingId: 7, moduleId: 14 });
        return false;
    });
    //发传真
    $("#btnFax,#btnFax2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendFax");
        top.addBehaviorExt({ actionId: 26019, thingId: 6, moduleId: 14 });
        return false;
    });
    //点顶部合并按钮
    $("#btnMerge, #btnMerge2").click(function() {
        var serialId = Tool.getSelectedContacts(true);
        if (serialId.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        } else if (serialId.length < 2 || serialId.length > 5) {
            Pt.alert(PageMsg['warn_mergeover']);
            return;
        }
        View.changeView("Redirect", { key: "mergesingle", serialId: serialId.join('|') });
        return false;
    });
    //点发名片
    $("#btnCARD, #btnCARD2").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        top.addBehaviorExt({ actionId: 26019, thingId: 4, moduleId: 14 });
        var contacts = Tool.getSelectedContacts();
        if (contacts.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        } else if (contacts.length > 20) {
            Pt.alert(PageMsg.warn_sendcardover);
            return;
        }
        var receiver = "";
        var map = {};
        $(contacts).each(function() {
            var email = this.getFirstEmail();
            if (!email || map[email]) return;
            map[email] = true;
            var name = this.name.replace(/"/g, "");
            receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
        })
        View.changeView("Redirect", { key: "sendBuzzCard", receiver: encodeURIComponent(receiver) });
        return false;
    });
    //搜索
    $("#btnSearch").click(_doSearch);
    $("#txtSearch").keypress(function(e) {
        if (e.keyCode == 13) {
            _doSearch();
        }
    });

    function _doSearch() {
        var txt = $("#txtSearch");
        var keyword = txt.val().trim();
        if (keyword == "" || keyword == txt.attr("title")) {
            $(txt).blur();
            Pt.alert(PageMsg.warn_search);
            return;
        }
        View.changeView("ChangeFilter", { key: "keyword", keyword: keyword });
        top.addBehaviorExt({ actionId: 26025, thingId: 0, moduleId: 19 });
    }

    $(document).click(hideMenu);
    //复制到
    $("#btnCopyTo").click(function(e) {
        hideMenu();
        var ulCopyTo = $("#ulCopyTo");
        var items = ulCopyTo.show().find("li");
        items.show().filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
        top.addBehavior("19_26007复制到", 0);
    });
    //下方复制到
    $("#btnCopyTo2").click(function(e) {
        hideMenu();

        var bodyHeight = $(document).height();
        var ulCopyTo = $("#ulCopyTo2");

        var listHeight = ulCopyTo.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulCopyTo.css("top", _top).show();

        //隐藏当前组
        ulCopyTo.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();

        e.stopPropagation();
        top.addBehaviorExt({ actionId: 1409, thingId: 0, moduleId: 19 });
    });
    //发送按钮
    $("#btnSendTo").click(function(e) {
        hideMenu();
        $("#ulSendTo").show();
        e.stopPropagation();
    });
    //下方发送到
    $("#btnSendTo2").click(function(e) {
        hideMenu();
        var bodyHeight = $(document).height();

        var ulSendTo2 = $("#ulSendTo2");

        var listHeight = ulSendTo2.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulSendTo2.css("top", _top).show();
        e.stopPropagation();
    });

    //移动到
    $("#btnMoveTo").click(function(e) {
        hideMenu();
        var ulMoveTo = $("#ulMoveTo");
        ulMoveTo.show();
        ulMoveTo.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
    });
    //移动到
    $("#btnMoveTo2").click(function(e) {
        hideMenu();
        var bodyHeight = $(document).height();
        var ulMoveTo2 = $("#ulMoveTo2");

        var listHeight = ulMoveTo2.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulMoveTo2.css("top", _top).show();

        //隐藏当前组
        ulMoveTo2.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
    });
    //删除
    $("#btnDelete, #btnDelete2").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        top.addBehaviorExt({ actionId: 1407, moduleId: 19 });
        View.changeView("DeleteContacts", {});
        return false;
    });
	
	
 
    function toNewPage() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        View.changeView('Redirect', { key: 'addContacts' });
        top.addBehaviorExt({ actionId: 26024, thingId: 1, moduleId: 19 });
        return false;
    }

    //新建 按钮
    $("#btnAddNew, #btnAddNew2,#btnAddNew3").click(toNewPage);
    $("#btnAddNew4").live("click", toNewPage);

    //新建组
    $("#aAddGroup").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        View.changeView('Redirect', { key: 'addGroup' })
        top.addBehaviorExt({ actionId: 26026, thingId: 1, moduleId: 19 });
        return false;
    });

    //单击空白处查看联系人名片，靠近复选框的地方为选中当前行。
    $("#tableContactsList").click(function(e) {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        var T = e.target, tr = false;
        if (T.tagName == 'TD' && T.cellIndex != 0) {
            editContacts(T.parentNode.cells[1]); //原来：contactsBusinesscard 6.5修改
        } else if (T.cellIndex == 0) {
            var tr = $(T.parentNode);
            if (tr.hasClass("c-null")) {
                //此时显示空白引导提示语。
                return;
            }

            var C = T.getElementsByTagName('INPUT')[0];
            if(!C){return;}
            if (!C.checked) {
                tr.addClass("current");
            } else {
                tr.removeClass("current");
            }
            C.checked = !C.checked;
        } else if (T.tagName == 'INPUT') {
            var tr = T.parentNode.parentNode;
            if (tr) {
                if (T.checked) {
                    $(tr).addClass("current");
                } else {
                    $(tr).removeClass("current");
                }
            }
        }
    });
    //搜索框
    $("#txtSearch").focus(function() {
        $(this).removeClass("caaa");
        if (this.value == this.title) this.value = "";
    }).blur(function() {
        if (this.value.trim() == "") {
            $(this).addClass("caaa");
            this.value = this.title;
        }
    });
    $('#btnEmptyLastC').click(function() {
        emptyLastContactsRecords2();
    });

    //电子名片发送
    $('.cSendCard').hover(function() {
        $('.SendCardUl').show();
    }, function() {
        $('.SendCardUl').hide();
    }
    );

    $('.cSendByEmail').click(function() {
        redirectCompose('vCard');
    });

    $('.cSendByMms').click(function() {
        top.Contacts.QueryUserInfo(function(doc) {
            redirectMMS('&vCard=myVcard', VcarContent.connectSendContent(doc.info));
        });
    });

    $('.cSendBySms').click(function() {
        top.Contacts.QueryUserInfo(function(doc) {
            top.SmsContent = VcarContent.connectSendContent(doc.info);
        });
        redirectSMS('&vCard=myVcard&from=2');
    });

    top.addBehaviorExt({ actionId: 26027, thingId: 0, moduleId: 19 });
	
	//vip管理页面联系人
	$("#addVipTop,#addVipBowttom").click(function(){
		EditVipGroup();
		top.addBehaviorExt({ actionId: 103632, thingId: 0, moduleId: 14 });
	});
	//vip管理页面-取消vip联系人
	$("#DelVipTop,#DelVipBowttom").click(function(){
		top.addBehaviorExt({ actionId: 103633, thingId: 0, moduleId: 14 });
		var serialId = Tool.getSelectedContacts(true);
		
		if(serialId.length == 0){
			top.FF.alert(PageMsg["warn_noneselect"]);
			return false;
		}
		serialId = serialId.join(",");
		var param = {
			serialId :serialId
		}
		function cancelVip(){
			delSinglVipInCard(param);
		}
		top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip );
	});
	
}

//PageTurnner是一个不包含任何UI的逻辑对象
function PageTurnner(pageCount, pageIndex) {
    var thePageTurnner = this;
    this.pageIndex = pageIndex;
    this.pageCount = pageCount;
    this.fristPage = function() {
        this.turnPage(0);
    }
    this.lastPage = function() {
        this.turnPage(pageCount - 1);
    }
    this.nextPage = function() {
        this.turnPage(parseInt(thePageTurnner.pageIndex) + 1);
    }
    this.previousPage = function() {
        this.turnPage(thePageTurnner.pageIndex - 1);
    }
    this.turnPage = function(index) {
        if (index < 0 || index >= pageCount || index == this.pageIndex) return;
        this.pageIndex = index;
        this.callPageChangeHandler(index);
    }
    this.pageChangeHandlers = [];
    this.addPageChangeListener = function(handler) {

        this.pageChangeHandlers.push(handler);
    }
    this.callPageChangeHandler = function(pageIndex) {
        for (var i = 0; i < this.pageChangeHandlers.length; i++) {
            this.pageChangeHandlers[i](pageIndex);
        }
    }
}

//写信按钮
function redirectCompose(params) {
    hideMenu();
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    
    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);

    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + ', ' + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + ', ' + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$', MAXSEND), { isHtml: true });
    } else {
        if (contacts.length == 1) {
            sendCantactServer.selContact = contacts[0];
            sendCantactServer.sendType = "Mail";
            //发送电子名片，未填写邮件地址时，会被替换成发邮件(看上一行代码);这里用另外一个参数保存一下
            if (params && params == 'vCard') sendCantactServer.sendType2 = params;
            if (!sendCantactServer.CheckContactType("e")) {
                return false;
            }
        }
        var receiver = "";
        var map = {};
        $(contacts).each(function() {
            var email = this.getFirstEmail();
            if (!email || map[email]) return;
            map[email] = true;
            var name = this.name.replace(/"/g, "");
            receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
        });
        if (params && params == 'vCard') { 
            top.$App.show("compose",null,{inputData:{ receiver: receiver, type: 'vCard'}});
            //window.top.CM.show({ receiver: receiver, type: 'vCard' }); 
        }
        else {
            top.$App.show("compose",null,{inputData:{ receiver: receiver}});
            //swindow.top.CM.show({ receiver: receiver });
        }
    }
}

//发彩信[新]
function senNewMMS(receiver, params, scontent) {
    if (top.$User && !top.$User.checkAvaibleForMobile()) { // 检测对应功能是否对互联网用户开放
            return;
    }
    var arr = [];
    if (receiver) {
        arr = receiver.split(",");
    }
    top.Main.setReplyMMSData({ receivers: arr, content: scontent || "" });

    window.top.Links.show("mms", "&mmstype=diy&initData=replyMMSData" + (params || ""));
}

//发彩信按钮
function redirectMMS(params, scontent) {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "MMS";
        if (!sendCantactServer.CheckContactType("m")) {
            return false;
        }
    }
    var map = {};
    $(contacts).each(function() {
        var mobile = this.getFirstMobile().replace(/\D/g, "");
        if (!mobile || map[mobile]) return;
        map[mobile] = true;
        receiver += mobile + ",";
    })
    senNewMMS(receiver, params || "", scontent || "");
}
//发短信按钮
function redirectSMS(params) {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    hideMenu();
    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    else if (contacts.length == 1) {
        sendSMS(contacts[0].SerialId, params);
        return;
    }
    var map = {};
    $(contacts).each(function() {
        var mobile = this.getFirstMobile().replace(/\D/g, "");
        if (!mobile || map[mobile]) return;
        map[mobile] = true;
        receiver += mobile + ",";
    })
    window.top.Links.show("sms", "&mobile=" + receiver + params || '');
}

function redirectFax() {
    hideMenu();
    var receiver = [];
    var contacts = Tool.getSelectedContacts();
    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    } else if (contacts.length == 1) {
        sendFax(contacts[0].SerialId);
        return;
    }

    var map = {};
    $(contacts).each(function() {
        var fax = this.getFirstFax().replace(/\D/g, "");
        if (!fax || map[fax]) return;
        map[fax] = true;
        receiver.push(fax)
    })

    var faxNumber = receiver.join(',');
    Tool.hideControlBar();
    showfax(faxNumber);
}

function showfax(faxNumber) {
    window.top.Links.show("fax", "&to=" + faxNumber);
    setTimeout(function() {
        top.Utils.waitForReady("top.MM.currentModule.container.contentWindow.document.getElementById", function() {
            try {
                top.MM.currentModule.container.contentWindow.document.getElementById("tbRMobile").value = faxNumber;
            } catch (e) { }
        });
    }, 1500);
}

//发明信片按钮
function redirectPCard() {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);
        return;
    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$',MAXSEND));
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "PCard";
        if (!sendCantactServer.CheckContactType("e")) {
            return false;
        }
    }
    var receiver = "";
    var map = {};
    $(contacts).each(function() {
        var email = this.getFirstEmail();
        if (!email || map[email]) return;
        map[email] = true;
        var name = this.name.replace(/"/g, "");
        //name = encodeURIComponent(name);
        receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
    });
    receiver = encodeURIComponent(receiver);//中文
    //receiver = escape(receiver);//统一用escape

    top.Links.show("postcard", "&source=Addr&to=" + receiver + "&sendDate=&classid=2");
}

//发贺卡按钮
function redirectGCard() {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);
        return;
    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$',MAXSEND));
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "GCard";
        if (!sendCantactServer.CheckContactType("e")) {
            return false;
        }
    }
    var receiver = "";
    var map = {};
    $(contacts).each(function() {
        var email = this.getFirstEmail();
        if (!email || map[email]) return;
        map[email] = true;
        var name = this.name.replace(/"/g, "");
        //name = encodeURIComponent(name);
        receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
    });
    receiver = encodeURIComponent(receiver);//中文
    //console.log(receiver);
    top.Links.show("greetingcard", "&source=Addr&to=" + receiver + "&sendDate=&classid=5");

}

//点击删除组
function deleteGroup(groupId) {
    if (top.Utils.PageisTimeOut(true)) {
        return;
    }
    var contactsId = top.Contacts.getContactsByGroupId(groupId);
    if (contactsId.length == 0) {
       top.FloatingFrame.confirm(PageMsg.warn_delgrouponly, deleteTeam);
        return;
    }

    var content = PageMsg.warn_delgroup.replace("$checkbox$", "<br><label for='yesDeleteTeam'><input id='yesDeleteTeam' type='checkbox' />") + "</label>";
    var dialog = top.$Msg.confirm(content, function() {
				var deleteAll = !!dialog.jContainer.find("#yesDeleteTeam").attr("checked");
				deleteTeam(deleteAll);
			},"","",{isHtml:true});

    function deleteTeam(deleteContacts) {
        window.top.Contacts.deleteGroup(groupId, function(result) {
            if (result.success) {
                top.M139.UI.TipMessage.show(PageMsg.info_success_del, { delay: 2000 });
                View.dataUpdate("DeleteGroup");
				if(deleteContacts){ //彻底删除本组联系人--更新vip联系人信息
					var delContactsId = [];
					for(var i=0; i<contactsId.length; i++){
						if(contactsId[i]){
							delContactsId.push(contactsId[i].SerialId);
						}
					}
					var vipList = top.Contacts.FilterVip(delContactsId);
					if(vipList.length>0){
						vipLIst = vipList.join(",");
						top.Contacts.updateCache("delVipContacts",vipLIst);
						//top.Main.searchVipEmailCount();
						Tool.updateVipMail();
						var vip = top.Contacts.data.vipDetails;
						var vipCount = vip.vipn || 0;
						$("#vipCount").text("(" + vipCount+ ")");
					}
				}
            } else {
                Pt.alert(result.msg);
            }
        }, deleteContacts);
    }
}

//点击快速编辑图标
function QE(sender) {
    var serialId = Tool.getRowContactsId(sender);
    QuickEditServer.serialIdQES = serialId;
    showEdit(sender, serialId);
    top.addBehaviorExt({ actionId: 1417, thingId: 1, moduleId: 14 });
}

//编辑
function editContacts(param) {
    if (mail139.addr.home.isediting) return;
    if (typeof (param) != "object") {
        var serialId = param;
    } else {
        if (param.serialId) {
            var serialId = param.serialId;
        } else if (param.tagName) {
            var serialId = Tool.getRowContactsId(param);
        } else {
            View.changeView("Redirect", { key: "addContacts", name: param.name, email: param.email, mobile: param.mobile, fax: param.fax });
            return;
        }
    }
    if (serialId) View.changeView("Redirect", { key: "editContacts", serialId: serialId });
    top.addBehaviorExt({ actionId: 1417, thingId: 0, moduleId: 14 });
}

function getDataTR(tag) {//得到编辑数据行
    while (tag) {
        if (tag.tagName == "TR") {
            return tag;
        }
        tag = tag.parentNode;
    }
    return null;
}

function getDataTD(tr, tdName) {
    return $(tr).children("td:has(a[jpath='" + tdName + "'])");
}

//取编辑值
function getEditValue(td) {
    return $(td).children("input").val();
}

function setSaveShow(currentRow, isShow) {
    var $row = $(currentRow);
    var $ico = $row.find('.i-edit1, .i-edit-suc');
    var $txt = $row.find('input');

    $ico.removeClass();
    if (isShow) {
        $ico.addClass('i-edit-suc');

        //设置回车保存
        $txt.keypress(function(e){
            if (e.which === 13) {
                $ico.trigger(jQuery.Event( "click" ));
            }
        });

    } else {
        $ico.addClass("i-edit1");
    }
}

function showEdit(tag, serialId) {//编辑或保存当前选中行
    var tmpTR = QuickEditServer.trQES; //用户前一个操作行
    var currentRow = getDataTR(tag);
    QuickEditServer.trQES = currentRow;
    if (currentRow) {
        var tdName = getDataTD(currentRow, "name");
        var tdEmail = getDataTD(currentRow, "email");
        var tdMobile = getDataTD(currentRow, "mobile");
        if (tdName && tdEmail && tdMobile) {
            var btnUpdate = $(currentRow).find("td .i-edit1");
            if (btnUpdate && btnUpdate.length > 0) {//编辑
                if (QuickEditServer.haveEdit) {
                    QuickEditServer.trQES = tmpTR; //恢复用户前一个操作行
                    return false;
                }

                var inputText, nameLink;
                //姓名
                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"12\" name=\"name\" id=\"name\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdName).children("a")[0];
                QuickEditServer.nameQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.nameQES )
                );

                $(tdName).prepend(inputText);
                $(nameLink).hide();

                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"90\"  name=\"FamilyEmail\" id=\"FamilyEmail\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdEmail).children("a")[0];
                QuickEditServer.emailQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.emailQES )
                );

                $(tdEmail).prepend(inputText);
                $(nameLink).hide();

                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"20\"  name=\"MobilePhone\" id=\"MobilePhone\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdMobile).children("a")[0];
                QuickEditServer.mobileQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.mobileQES )
                );

                $(tdMobile).prepend(inputText);
                $(nameLink).hide();

                QuickEditServer.haveEdit = true;
                setSaveShow(currentRow, true);
            }
            else { //保存
                if (!mail139.addr.home.edit.isChanged()) {
                    hideEdit(tdName, tdEmail, tdMobile);
                    QuickEditServer.haveEdit = false;
                    return false;
                }

                var vName = getEditValue(tdName);
                var vEmail = getEditValue(tdEmail);
                var vMobile = getEditValue(tdMobile);

                vName = $.trim(vName);
                vEmail = $.trim(vEmail);
                vMobile = $.trim(vMobile);
                if (!ValidateEditData(vName, vEmail, vMobile)) {//数据验证
                    top.$Msg.alert(top.Contacts.validateAddContacts.error);
                    return false;
                }

                mail139.addr.home.edit.save({
                    'serialId': QuickEditServer.serialIdQES,
                    'name': vName, 'email': vEmail, 'mobile': vMobile
                });
                return true;
            }
        }
    }
}

function SetNewContact(tdName, tdEmai, tdMobil, result) {
    var c = result.ContactInfo,
        name = c.AddrFirstName,
        email1 = c.FamilyEmail,
        email2 = c.BusinessEmail,
        mobile1 = c.MobilePhone,
        mobile2 = c.BusinessMobile;

    $(tdName).children("a").text(name);
    if (email1 && $.trim(email1)) {
        $(tdEmai).children("a").text(email1);
    } else if (email2 && $.trim(email2)) {
        $(tdEmai).children("a").text(email2);
    }
    else {
        $(tdEmai).children("a").text("");
    }

    var $mn = $(tdMobil);
    var $txtMn = $mn.children('a');
    var $col_op = $mn.next();

    if (mobile1 && $.trim(mobile1)) {
        $txtMn.text(mobile1);
    } else if (mobile2 && $.trim(mobile2)) {
        $txtMn.text(mobile2);
    } else {
        $txtMn.text("");
    }

    //这里增加更新，飞信图标的逻辑
    var mobile = mobile1 || mobile2 || "";
    mobile = Tool.fixmobile(mobile);

    if (mobile && Render.fetionlogined() && $Mobile.isChinaMobile(mobile)) {
        if ($col_op.find('.j_fxico').length === 0) {
            $(Render.Template.fetionico).insertAfter($col_op.find(".jico_edit"));
        }
    } else {
        $col_op.find(".j_fxico").remove();
    }
}

function hideEdit(tdName, tdEmail, tdMobile) {
    $(tdName).children("#name").remove();
    $(tdName).children("a").show();

    $(tdEmail).children("#FamilyEmail").remove();
    $(tdEmail).children("a").show();

    $(tdMobile).children("#MobilePhone").remove();
    $(tdMobile).children("a").show();

    QuickEditServer.haveEdit = false;

    setSaveShow(QuickEditServer.trQES, false);
}

var gContactsDetails = new top.ContactsInfo({
    "name": "", "FamilyEmail": "", "OtherEmail": "", "MobilePhone": "", "FamilyPhoneBrand": "", "FamilyPhoneType": "",
    "OtherMobilePhone": "", "OtherPhoneBrand": "", "OtherPhoneType": "", "OtherPhone": "", "OtherFax": "", "GroupId": "",
    "ImageUrl": "", "AddrNickName": "", "UserSex": "", "BirDay": "", "StartCode": "", "BloodCode": "", "OtherIm": "", "OICQ": "", "MSN": "", "PersonalWeb": "", "Memo": "",
    "FamilyPhone": "", "FamilyFax": "", "ProvCode": "", "CityCode": "", "HomeAddress": "", "ZipCode": "",
    "CPName": "", "UserJob": "", "BusinessEmail": "", "BusinessMobile": "", "BusinessPhoneBrand": "", "BusinessPhoneType": "", "BusinessPhone": "", "BusinessFax": "",
    "CPProvCode": "", "CPCityCode": "", "CPAddress": "", "CPZipCode": "", "CompanyWeb": ""
});

//快速编辑
var QuickEditServer = {
    serialIdQES: ""
    , haveEdit: false//是否已存在编辑行
    , haveSel: null
    , trQES: null//当前编辑的行
    , nameQES: ""//当前编辑行联系人的初始：name
    , emailQES: ""//当前编辑行联系人的初始：email
    , mobileQES: ""//当前编辑行联系人的初始：mobile
    , isCheck: true//编辑数据是否验证通过
    , checkEdit: function() {//离开快速编辑框验证
        var ans = true;
        var msg = "您正在编辑的信息尚未保存，是否保存后再离开？";

        if (QuickEditServer.trQES) {
            var tdName = getDataTD(QuickEditServer.trQES, "name");
            var tdEmail = getDataTD(QuickEditServer.trQES, "email");
            var tdMobile = getDataTD(QuickEditServer.trQES, "mobile");
            if (tdName && tdEmail && tdMobile) {
                if ($(tdName).children("input")) {
                    var nameText = $(tdName).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.nameQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
                if ($(tdEmail).children("input")) {
                    var nameText = $(tdEmail).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.emailQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
                if ($(tdMobile).children("input")) {
                    var nameText = $(tdMobile).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.mobileQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!QuickEditServer.isCheck) {
            ans = window.confirm(msg);
            if (ans == true) {
                QuickEditServer.isCheck = true;
                return true;
            }
            else {//要保存数据                                    
                return false;
            }
        }
        return true;
        var tdName = getDataTD(QuickEditServer.trQES, "name");
        var tdEmail = getDataTD(QuickEditServer.trQES, "email");
        var tdMobile = getDataTD(QuickEditServer.trQES, "mobile");
        if (tdName && tdEmail && tdMobile) {
            hideEdit(tdName, tdEmail, tdMobile);
            QuickEditServer.haveEdit = false;
        }
    }
}

var sendCantactServer = {
    selContact:null, sendType:""//类型验证type:Mail表示发邮件,PCard表示明信片,GCard表示发贺卡,MMS表示发短信，SMS表示发彩信，Fax表示发传真
    , serialId:"", nextHtm:"", inputV:""//输入值
    , hoverRow:null //所在行
    , sinviteFriend:function () {//邀请
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                inviteFriendInCard({serialId:sendCantactServer.selContact.SerialId, email:sendCantactServer.inputV }); //邀请好友
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sAddVip:function () { //添加vip联系人
        var request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                addSinglVipInCard({serialId:info.SerialId, name:info.name }); //添加VIP联系人
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });

    },
    sQuickSendEmail:function () {//快捷发邮件
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                sendMailQuickInCard({serialId:info.SerialId, name:info.name, email:sendCantactServer.inputV}); //快捷发邮件
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    },
    sSetFilter:function () {
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                setFilterInCard({serialId:info.SerialId, name:info.name, email:sendCantactServer.inputV}); //设置邮件分拣
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    },
    //[FIXED]  Used
    sMailSCS:function () { //发邮件
        var request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                //top.$App.show("compose", null, {inputData:{ receiver:"\"" + sendCantactServer.selContact.name + "\"<" + sendCantactServer.inputV + ">;" }})

                //修复：通讯录联系人中未填写邮件，发送自己的电子名片时，会被替换成发送邮件的问题
                var composeParms = { inputData: { receiver: "\"" + sendCantactServer.selContact.name + "\"<" + sendCantactServer.inputV + ">;" } };
                if (sendCantactServer.sendType2) {
                    composeParms.inputData.type = sendCantactServer.sendType2;
                    sendCantactServer.sendType2 = null;
                }
                top.$App.show("compose", null, composeParms);

                //补上刚才编辑的那行联系人电邮地址
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);

                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sPCardSCS:function () { //明信片
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                top.Links.show("postcard", "&source=Addr&to=" + sendCantactServer.inputV + "&sendDate=&classid=2");
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='emaild']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发明信片");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sGCardSCS:function () {//贺卡
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                top.Links.show("greetingcard", "&source=Addr&to=" + sendCantactServer.inputV + "&sendDate=&classid=5");
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='email']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发贺卡");
            } else {
                Pt.alert(result.msg);
            }
        });
    },

    /**
     * 发短信时，遇到没有手机号时的弹出的添加手机号的逻辑
     */
    sMMSSCS:function () {
        var request;

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.MobilePhone = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }

        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.MobilePhone = sendCantactServer.inputV;
                sendCantactServer.selContact.mobiles.push(sendCantactServer.inputV);
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='mobile']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发彩信");

                senNewMMS(sendCantactServer.inputV.replace(/\D/g, ""));
            } else {
                Pt.alert(result.msg);
            }
        });
    },

    sSMSSCS:function () { //短信

        var request = "<AddContactsField><SerialId>{0}</SerialId><MobilePhone>{1}</MobilePhone></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.MobilePhone = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.MobilePhone = sendCantactServer.inputV;
                sendCantactServer.selContact.mobiles.push(sendCantactServer.inputV);
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='mobile']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发短信");
                window.top.Links.show("sms", "&mobile=" + sendCantactServer.inputV.replace(/\D/g, ""));
            } else {
                Pt.alert(result.msg);
            }
        });
    },


    checkInput:function (inputValue) {//输入数据检查

        if (sendCantactServer.sendType == "MMS" || sendCantactServer.sendType == "SMS") {
            if (inputValue && !top.Validate.test("mobile", inputValue)) {
                top.Contacts.validateAddContacts.error = top.Validate.error;
                return false;
            }
            if (inputValue && inputValue.getByteCount() > 100) {
                top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactMobileToolong'];
                return false;
            }
        } else if (sendCantactServer.sendType == "Fax") {
            if (inputValue && !top.Validate.test("fax", inputValue)) {
                top.Contacts.validateAddContacts.error = top.Validate.error;
                return false;
            }
        } else {
            if (!top.Validate.test("email", inputValue)) {
                top.Contacts.validateAddContacts.error = PageMsg['error_emailIllegal'];
                return false;
            }
            if (inputValue && inputValue.getByteCount() > 60) {
                top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactEmailToolong'];
                return false;
            }
        }

        return true;
    }, toNext:function () {//类型验证type:Mail表示发邮件,PCard表示明信片,GCard表示发贺卡,MMS表示发彩信，SMS表示发短信，Fax表示发传真
        switch (sendCantactServer.sendType) {
            case "Mail":
                sendCantactServer.sMailSCS();
                break;
            case "PCard":
                sendCantactServer.sPCardSCS();
                break;
            case "GCard":
                sendCantactServer.sGCardSCS();
                break;
            case "MMS":
                sendCantactServer.sMMSSCS();
                break;
            case "SMS":
                sendCantactServer.sSMSSCS();
                break;
            case "AddVip":
                sendCantactServer.sAddVip();
                break;
            case "inviteFriend":
                sendCantactServer.sinviteFriend();
                break;
            case "quickSendMail":
                sendCantactServer.sQuickSendEmail();
                break;
            case "setFilter":
                sendCantactServer.sSetFilter();
                break;
        }
    }, CheckContactType:function (type) {
        if (type == "e") {
            if ((!sendCantactServer.selContact.FamilyEmail || $.trim(sendCantactServer.selContact.FamilyEmail) == "") &&
                (!sendCantactServer.selContact.BusinessEmail || $.trim(sendCantactServer.selContact.BusinessEmail) == "")) {
                sendCantactServer.ShowNext("邮箱地址", "邮箱");
                return false;
            }
        }
        else if (type == "m") {
            //如果已在通讯录，则检测完善手机号步骤
            //如果没在通讯录，则是未保存的最近联系人，这时就还需要添加联系人操作
            if (sendCantactServer.selContact == null) {
                sendCantactServer.ShowNext("手机号码", "手机号码");
                return false;
            }

            if ((!sendCantactServer.selContact.MobilePhone || $.trim(sendCantactServer.selContact.MobilePhone) == "") &&
                (!sendCantactServer.selContact.BusinessMobile || $.trim(sendCantactServer.selContact.BusinessMobile) == "")) {
                sendCantactServer.ShowNext("手机号码", "手机号码"); //请输入手机号码
                return false;
            }
        }

        return true;
    }, GetNextHtm:function (name) {
        sendCantactServer.nextHtm = '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="tb_folderName" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="divError" name="divError"  style="color:Red;padding-left:100px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:void(0)"  id="btnSendNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
            </div>'.format(name);
    }, ShowNext:function (title, name) {
        sendCantactServer.GetNextHtm(name);
        top.FF.show(sendCantactServer.nextHtm, "联系人资料没有" + title);
        top.$("#btnSendNext").click(function () {
            var inputValue = top.$("#tb_folderName").val().trim();
            if (inputValue == "") {
                top.$("#divError").text("不能为空");
                return false;
            }
            if (!sendCantactServer.checkInput(inputValue)) {
                top.$("#divError").text(top.Contacts.validateAddContacts.error);
                return false;
            }
            sendCantactServer.inputV = inputValue;
            sendCantactServer.toNext();
        });
    }
};

//得到编辑联系人数据
function getEditData() {
    try {
        top.Contacts.getContactsInfoById(QuickEditServer.serialIdQES, function(result) {
            if (result.success) {
                for (m in result.contactsInfo) {
                    gContactsDetails[m] = result.contactsInfo[m];
                }
                QuickEditServer.haveSel = true;
            }
            else {
                Pt.alert(result.msg);
            }
            return;
        });
    } catch (e) { }
}

//数据更新:有修改为true
function updateEditData(name, email, mobile) {
    var isEdit = false;
    if ($.trim(gContactsDetails["AddrFirstName"]) != name) {
        gContactsDetails["AddrFirstName"] = name;
        isEdit = true;
    }
    if ($.trim(QuickEditServer.emailQES) == $.trim(gContactsDetails["FamilyEmail"])) {
        if (email != $.trim(gContactsDetails["FamilyEmail"])) {
            gContactsDetails["FamilyEmail"] = email;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.emailQES) == $.trim(gContactsDetails["BusinessEmail"])) {
        if (email != $.trim(gContactsDetails["BusinessEmail"])) {
            gContactsDetails["BusinessEmail"] = email;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.mobileQES) == $.trim(gContactsDetails["MobilePhone"])) {
        if (mobile != $.trim(gContactsDetails["MobilePhone"])) {
            gContactsDetails["MobilePhone"] = mobile;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.mobileQES) == $.trim(gContactsDetails["BusinessMobile"])) {
        if (mobile != $.trim(gContactsDetails["BusinessMobile"])) {
            gContactsDetails["BusinessMobile"] = mobile;
            isEdit = true;
        }
    }
    return isEdit;
}

//验证数据合法性
function ValidateEditData(name, email, mobile) {
    if (!name || $.trim(name) == "") {
        top.Contacts.validateAddContacts.error = "请输入联系人姓名";
        QuickEditServer.isCheck = false;
        return false;
    }
    if ($.trim(name).getByteCount() > 100) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = top.frameworkMessage['warn_contactNameToolong'];
        return false;
    }
    if (email && !top.Validate.test("email", email)) {
        top.Contacts.validateAddContacts.error = top.Validate.error;
        QuickEditServer.isCheck = false;
        return false;
    }
     if (email && !(email.length >= 6 &&  email.length <= 90)) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = "请输入正确的邮件地址";
        return false;
    }

    if (mobile && !top.Validate.test("mobile", mobile)) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = top.Validate.error;
        return false;
    }
    if (mobile && mobile.getByteCount() > 100) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactMobileToolong'];
        return false;
    }
    if (!email && !mobile) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = "手机号码和邮件地址请至少填写一项!";
        return false;
    }
    QuickEditServer.isCheck = true;
    return true;
}

//联系人名片
function contactsBusinesscard(param) {
    if (mail139.addr.home.isediting) return;
    top.addBehaviorExt({ actionId: 1417, thingId: 3, moduleId: 19 });
    if (typeof (param) != "object") {
        var serialId = param;
    } else {
        if (param.serialId) {
            var serialId = param.serialId;
        } else if (param.tagName) {
            var serialId = Tool.getRowContactsId(param);
        } else {
            View.changeView("Redirect", { key: "contactsBusinesscard", name: param.name, email: param.email, mobile: param.mobile, fax: param.fax });
            return;
        }
    }
    if (serialId) View.changeView("Redirect", { key: "contactsBusinesscard", serialId: serialId });
}

//删除联系人
function deleteContacts(obj) {
    if (obj) {
        var serialId = Tool.getRowContactsId(obj);
    } else {
        var serialId = Tool.getSelectedContacts(true);
        if (serialId.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        }
    }
    if (filter.groupId && filter.groupId > 0) {
        var msg = PageMsg['warn_delInGroup'] || "";
        msg = msg.replace("$checkbox$", "<br><label for='yesDeleteContactsFromGroup'><input id='yesDeleteContactsFromGroup' type='checkbox'/>");
        msg = msg.length < 1 ? "" : (msg + "</label>");

        var dialog = top.$Msg.confirm(msg,function(){
			var isRealDeleteContacts = !!dialog.jContainer.find("#yesDeleteContactsFromGroup").attr("checked");	
		   if (isRealDeleteContacts) {
                realDelete();
            } else {
                deleteFromGroup();
            }
        },"","",{isHtml:true})
    } else {
		var tipMsg = PageMsg['warn_delcontact'] || "" ;
		var hasVip = top.Contacts.FilterVip(serialId);
		if(hasVip.length > 0){
			tipMsg = serialId.length > 1 ? PageMsg['warn_delContactsHasVip'] : PageMsg['warn_delVipContact'];
		}
        top.FloatingFrame.confirm(tipMsg, realDelete);
    }
    //彻底删除
    function realDelete() {
		
        window.top.Contacts.deleteContacts(serialId, function(result) {
            if (result.success) {
                View.dataUpdate("DeleteContacts", { GroupId: filter.groupId });
                mail139.addr.home.reload();
				//更新vip联系人信息
				var vipList = top.Contacts.FilterVip(serialId); 
				if(vipList.length>0){
					vipLIst = vipList.join(",");
					top.Contacts.updateCache("delVipContacts",vipLIst);
					//top.Main.searchVipEmailCount();
					Tool.updateVipMail();
					var vip = top.Contacts.data.vipDetails;
					var vipCountUpdate = vip.vipn || 0;
					$("#vipCount").text("(" + vipCountUpdate + ")");
				}
            } else {
                Pt.alert(result.msg);
            }
        });
    }
    //仅删除组关系
    function deleteFromGroup() {
        window.top.Contacts.deleteContactsFromGroup(filter.groupId, serialId, function(result) {
            if (result.success) {
                View.dataUpdate("DeleteContacts", { GroupId: filter.groupId });
            } else {
                Pt.alert(result.msg);
            }
        });
    }
}

//单点发邮件
function sendMail(obj) {
    $("#controlBar").hide();
    if (typeof (obj) != "object") {
        var serialId = obj;
    } else {
        if (obj.addrType && obj.addrType != "E") {
            strangerAddContacts("email", obj);
            return;
        }
        if (obj.addrContent) {

            top.$App.show("compose",null,{inputData:{receiver: obj.addrContent + ";"}})
            //window.top.CM.show({ receiver: obj.addrContent + ";" });
            top.addBehaviorExt({ actionId: 26014, thingId: 7, moduleId: 19 });
            return;
        } else {
            var serialId = Tool.getRowContactsId(obj);
        }
    }
    var info = window.top.Contacts.getContactsById(serialId);
    if (info.emails.length == 0) {
        sendCantactServer.selContact = info;
        sendCantactServer.sendType = "Mail";
        if (!sendCantactServer.CheckContactType("e")) {
            return;
        }
    } else {
        top.$App.show("compose",null,{inputData:{receiver: "\"" + info.name + "\"<" + info.getFirstEmail() + ">;" }})
        top.addBehaviorExt({ actionId: 26014, thingId: 7, moduleId: 19 });
    }
}

function strangerAddContacts(type, obj) {

    var info;
    if (obj.addrType) {
        info = new top.ContactsInfo({
            name: (obj.addrName || obj.addrContent)
        });
    } else {
        info = obj;
    }

    switch (obj.addrType) {
        case "E": 
            {
                info.FamilyEmail = obj.addrContent;
                break;
            }
        case "M": 
            {
                info.MobilePhone = obj.addrContent;
                break;
            }
        case "F": 
            {
                info.BusinessFax = obj.addrContent;
                break;
            }
    }

    switch (type) {
        case "email": 
            {
                var title = PageMsg['warn_emailtitle'];
                var message = PageMsg['warn_email'];
                var property = "FamilyEmail";
                var maxLength = 90;
                break;
            }
        case "mms":
        case "sms": 
            {
                var title = PageMsg['warn_mobiletitle'];
                var message = PageMsg['warn_mobile'];
                var property = "MobilePhone";
                var maxLength = 20;
                break;
            }
        case "fax": 
            {
                var title = PageMsg['warn_faxtitle'];
                var message = PageMsg['warn_fax'];
                var property = "BusinessFax";
                var maxLength = 30;
                break;
            }
    }

    top.FloatingFrame.prompt(title, message, "", function(num) {
        if (num.trim() == "") {
            Pt.alert(message);
            return;
        }
        info[property] = num;
        top.Contacts.addContactDetails(info, function(result) {
            if (result.success) {
                switch (type) {
                    case "email":
                        {
                            sendMail(result.serialId);
                            break;
                        }
                    case "sms":
                        {
                            sendSMS(result.serialId);
                            break;
                        }
                    case "mms":
                        {
                            sendMMS(result.serialId);
                            break;
                        }
                    case "fax":
                        {
                            sendFax(result.serialId);
                            break;
                        }
                }
            } else {
                Pt.alert(result.msg);
            }
        });
    }, maxLength);
}

//复制到
function copyContactsToGroup(groupId) {
    if (groupId == filter.groupId) {
        Pt.alert(PageMsg['warn_hasgrouped']);
        return;
    }
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    window.top.Contacts.copyContactsToGroup(groupId, serialId, function(result) {
        if (result.success) {
            Pt.alert(PageMsg['info_success_copy']);
            View.dataUpdate("CopyContactsToGroup", { GroupId: filter.groupId });
        } else {
            Pt.alert(result.msg);
        }
    });
}

//复制到新建组
function copyContactsToNewGroup() {
    var MAXLENGTH_GROUP = 16;
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    sendCantactServer.GetNextHtm("分组名称");
    top.FF.show(sendCantactServer.nextHtm, "新建组");
    top.$("#btnSendNext").click(function() {
        var groupName = top.$("#tb_folderName").val().trim();
        if (groupName == "") {
            top.$("#divError").text("分组名称不能为空");
            return false;
        } else if (top.Contacts.isExistsGroupName(groupName)) {
            top.$("#divError").text("组名重复，请尝试其它组名");
            return false;
        } else if (groupName.length > MAXLENGTH_GROUP) {
            top.$("#divError").text(PageMsg['warn_groupoverflow'].replace("$maxlength$", MAXLENGTH_GROUP));
            return false;
        }
        else {
            window.top.Contacts.editGroupList({ groupName: groupName, serialId: serialId },
            function(result) {
                if (result.ResultCode == "0") {

                    var param = {
                        "groupName": groupName,
                        "serialId": serialId.join(","),
                        "groupId": result.GroupInfo[0].GroupId
                    }

                    top.Contacts.updateCache("AddGroup", param);
                    top.Contacts.updateCache("CopyContactsToGroup", param);
                    View.dataUpdate("CopyContactsToGroup");

                    top.FF.close();
                    Pt.alert("复制成功");
                } else {
                    Pt.alert("复制失败");
                }
            });
        }
    });

}

//移动到
function moveContactsToGroup(groupId) {
    if (groupId == filter.groupId) {
        Pt.alert(PageMsg['warn_hasgrouped']);
        return;
    }
    if (!filter.groupId || !groupId) {
        throw PageMsg['error_notarget'];
    }
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        return Pt.alert(PageMsg['warn_noneselect']);
    }
    window.top.Contacts.moveContactsToGroup(serialId, filter.groupId, groupId, function(result) {
        if (result.success) {
            Pt.alert("移动成功");
            View.dataUpdate("MoveContactsToGroup", { GroupId: filter.groupId });
        } else {
            Pt.alert(result.msg);
        }
    });
}

//搜索往来邮件
function searchMailRecords(param) {
    if (!param.serialId && !param.email) {
        var param = { serialId: Tool.getRowContactsId(param) };
    }
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        var keyword = "";

        //新基础层与CM都不支持多关键字搜索
        keyword = info.getFirstEmail();

    } else if (param.email) {
        var keyword = param.email;
    }
    $("#controlBar").hide();

    top.$App.trigger("mailCommand",{command:"showTraffic",email:$.trim(keyword)});
    top.addBehaviorExt({ actionId: 1416, thingId: 0, moduleId: 19 });
    top.addBehaviorExt({ actionId: 26014, thingId: 1, moduleId: 19 });
}

//联系人页卡-设置邮件分拣
function setFilterInCard(param){
	var obj = param ;
	var floders;//邮件分拣-转移到自定义文件夹及系统文件夹不包括type=5的标签
	if (typeof Array.prototype.filter == "function") {
		floders = top.FM.folderList.filter(function(f){return f.type!=5});
	} else {
		floders = $.grep(top.FM.folderList, function(f){return f.type!=5})
	}
	var email = "setFilterFrame";

    var html ="";
	var str1 = '<div id="forWinSetFilter" for ="forWinSetFilter"><iframe src="/setfilter.htm?name={0}&email={1}" id="setFilterFrame" name="setFilterFrame" frameborder="0" scrolling="no" style="width:100%;height:165px;"></iframe>'+
			   '<iframe src="/setfiltersuc.htm" id="setfiltersuc" name="setfiltersuc" frameborder="0" scrolling="no" style="width:100%;height:120px; display:none;"></iframe>'+
			   '<iframe src="/addfolderforcreatefilter.htm" id="newFilterFrame" name="newFilterFrame" frameborder="0" scrolling="no" style="width:100%;height:151px; display:none;"></iframe>'+
				'<ul id="filterToFloders" class="toolBar_listMenu listMenu_bar" style=" position: absolute; z-index: 1109;display:none; width:205px; width:206px\\0;  *width:206px;top: 103px;left: 61px;border: 1px solid #b1b1b1;padding: 2px 0;">';
		html += str1.format(escape(obj.name), obj.email);
		
	for(var i=0; i<floders.length; i++){
		var str = '<li id="{0}" f_name = "{1}" ><a href="javascript:void(0);"  style="width:205px;" ><span>{1}</span></a></li>'.format(floders[i].fid,floders[i].name);
		if(i == floders.length-1){ //最后一项上加上一个class
			str = '<li  id="{0}" f_name = "{1}" ><a href="javascript:void(0);" class="clasy_bd"  style="width:205px;" ><span>{1}</span></a></li>'.format(floders[i].fid,floders[i].name);
		}
		html += str;
	}	
	
	html += '<li id="addFloder"><a href="javascript:void(0);" style="width:205px;"><span>新建文件夹</span></a></li></ul></div>';
	
    top.FF.show(html,"创建邮件分拣规则");
}

//联系人页卡-快捷发信
function sendMailQuickInCard(param){
    var addrObj = param;
    var sid = Pt.getSid();
    var type = 'compose';
    var receiver = '"' + addrObj.name + '"<' + addrObj.email + '>';
		receiver = escape(receiver);
    var rnd = Math.random();
    var url = top.wmsvrPath2 + "/float_compose.htm?sid={0}&type={1}&receiver={2}&rnd={3}";
		url = url.format(sid,type,receiver,rnd);
    var htmlCode = "<iframe id='float_compose' src={0} frameBorder='0' scrolling=no style='width:100%;height:{2}px;'></iframe>".format(url,null,267);
    top.FF.show(htmlCode,"发邮件",516,267,true,function(){
        var float_compose = $('#float_compose');
        if(float_compose && float_compose.length > 0 && float_compose[0].contentWindow.ifrClosed){
            float_compose[0].contentWindow.ifrClosed();
        }else{
            top.FF.close();
        }
    });		
}

//联系人页卡-自动标签//对改联系人发来的信件标签-但不对历史邮件进行标签
function addTagInCard(){
	 top.tagsUI.showAddTagPage(this.OptSource,true);
}

//联系人页卡-邮件到达通知
function setMailNotifyInCard(){
  top.Links.show('mailnotify',"&type=setFilter");
}

//联系人页卡--邀请
function inviteFriendInCard(param){
	var addrObj = param;
    var email = addrObj.email.toLowerCase();
    top.Links.show("invitebymail", "&email=" + email);
}

//联系人页卡--编辑
function editContactsInCard(param){
	if(param.serialId){
		top.Links.show("addrContacts", "&type=edit&id=" + param.serialId);
	}
	
}

//联系人页卡--添加vip联系人
function addSinglVipInCard(param){
	if(!param.serialId){
		return false;
	}
	
	if(top.Contacts.IsPersonalEmail(param.serialId)){
		Pt.alert("不支持添加自己为VIP联系人。");
		return false;
	}
	
	var vips = top.Contacts.data.vipDetails;
	var vipGroupId = "",vipCount =0,vipMaxCount = top.Contacts.MAX_VIP_COUNT; //因后端接口限制
	if(vips.isExist){
		vipGroupId =vips.vipGroupId;
		vipCount = vips.vipn ;
	}
	
	if(vipCount >= vipMaxCount){
		var a = '<a hidefocus="" style="text-decoration:none;"href="javascript:top.FF.close();top.$App.show(\'addrvipgroup\');" ><br/>管理VIP联系人</span></a>';
		var msg = vipMsg.vipContactsMax.format(vipMaxCount,a);
		top.FF.alert(msg);
		return false;
	}
	top.WaitPannel.show("正在保存...");
	var requestData = {
				groupId : vipGroupId,
				serialId: param.serialId,
				groupType:1
	}
	
	//回调
	function callback(res){

		top.WaitPannel.hide();
		if(res.ResultCode != 0){
			if(res.resultCode == 23){ //分组联系人已达上限
				top.FF.alert(vipMsg.groupLimit);
				return false;
			}
			
			if(Retry.retryTime >=3){
				top.FF.alert(vipMsg.syserror);
				Retry.retryData = "";
				Retry.retryFun = null;
				Retry.retryTime = 0;
			}else{ //重试3次
				Retry.retryData = param;
				Retry.retryFun = addSinglVipInCard;
				top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.window.document.getElementById(\'addr\').contentWindow.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
					var Obj = top.window.document.getElementById("addr").contentWindow.Retry;
						Obj.retryData = "";
						Obj.retryFun = null;
						Obj.retryTime = 0;
				});
			}
			return false;
		}
		
		var sucMsg = vipMsg.addVipSuc.format(param.name);
			top.FF.alert(sucMsg);
		var vip = top.Contacts.data.vipDetails;
		var vipnum  = 0;
		if(vip.isExist){
			vipnum = vip.vipn
		}
		vipnum ++; 
		$("#vipCount").html("("+ vipnum + ")");
		
		top.Contacts.updateCache("addVipContacts",param.serialId);
		top.$App.trigger("change:contact_maindata");
		//第一次 创建VIP联系人会到后台取数据-导致数据还没获取到，前端已开始页面刷新，导致渲染有误。top.Contacts.isReady = false表示未后端数据未更新完
		var firstUpdateCash = top.Contacts.isReady;
		if(firstUpdateCash){
			updateCallback();
		}else{
			setTimeout(function(){top.WaitPannel.show("正在保存......");firstUpdateCash = top.Contacts.isReady;updateCallback();}, 380);
		}
		
		function updateCallback(){
			if(firstUpdateCash){
				Render.renderGroupView();
				Render.renderContactsList(true);
				Render.renderControlView();
				top.addBehaviorExt({ actionId: 103635, thingId: 0, moduleId: 14 });

				top.WaitPannel.hide();
			}
		}
	}
	
	top.Contacts.AddGroupList(requestData,callback);
}

//联系人页卡--取消vip联系人DelGroupList
function delSinglVipInCard(param){
	if(!param.serialId){
		return false;
	}
	top.WaitPannel.show("正在保存...");
	if(!top.Contacts.IsExitVipGroup){
		return false; //不存在vip联系人组
	}
	
	var vips = top.Contacts.data.vipDetails;
	var requestData = {
				groupId : vips.vipGroupId,
				serialId: param.serialId
	}
	//回调
	function callback(res){
		top.WaitPannel.hide();
		if(res.ResultCode != 0){
			if(Retry.retryTime >=3){
				top.FF.alert(vipMsg.syserror);
				Retry.retryData = "";
				Retry.retryFun = null;
				Retry.retryTime = 0;
			}else{ //重试3次
				Retry.retryData = param;
				Retry.retryFun = delSinglVipInCard;
				top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.window.document.getElementById(\'addr\').contentWindow.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
					var Obj = top.window.document.getElementById("addr").contentWindow.Retry; 
						Obj.retryData = "";
						Obj.retryFun = null;
						Obj.retryTime = 0;
				});
			}
			return false;
		}
		
		
		top.FF.alert(vipMsg.opSuc);
		var vipCount =top.Contacts.data.vipDetails.vipn - param.serialId.split(",").length;
		$("#vipCount").html("("+ vipCount + ")");
		top.Contacts.updateCache("delVipContacts",param.serialId);
		top.$App.trigger("change:contact_maindata");
		//vip联系人管理页 取消vip 刷新页面
		Render.renderGroupView();
		Render.renderContactsList(true);
		Render.renderControlView();
		Tool.updateVipMail();
		//top.Main.searchVipEmailCount(); //更新VIP邮件todo
	}
	top.Contacts.DelGroupList(requestData,callback);
}

//联系人页卡--更多
function gotoMoreMenu(e){
	$("#moreLinksInGetMail").bind('mouseleave',function(){$(this).hide();});//更多右侧的菜单
	
	//top值计算
	var topRelativeHeight = $("#usrInfoArea >div").height();
	if($.browser.msie & $.browser.version < 8){
		topRelativeHeight  += 1;
	}else{
		topRelativeHeight += 1;
	}
	topRelativeHeight += "px";
	var leftTableHeight = document.getElementById("attrCardPanel").offsetHeight;
	//var currentOffsetTop = 	$(e.target).offset().top;
	var currentOffsetTop = 	$("#controlBar").offset().top +84 +80;
	var currentBodyHeight =top.window.document.body.clientHeight; //窗口高度
	var rightMenuHeight = $("#moreLinksInGetMail").height();
	if(rightMenuHeight +currentOffsetTop> currentBodyHeight){ 
		/*if($.browser.msie & $.browser.version < 8){
			$("#moreLinksInGetMail").css("top","43px");
		}else{
			$("#moreLinksInGetMail").css("top","25px");
		}*/
		$("#moreLinksInGetMail").css("top","25px");
		
	}else{
		$("#moreLinksInGetMail").css("top",topRelativeHeight);
	}
	
	$("#moreLinksInGetMail").show();
	
}

//vip管理页面-批量添加vip联系(添加到vip组-刷新组信息)
function EditVipGroup(){
	var anchorLocal = (function(d){
		return (function(url){
			var b = d.createElement("a");
			b.href = url;
			d.body.appendChild(b);
            try {
                b.click();
            } catch (e) {
                b = d.createElement("META");
                b.httpEquiv="refresh";
                b.content="0;url=" + url;
                d.getElementsByTagName("head")[0].appendChild(b);
            }
		});
	})(document);

	top.Contacts.addVIPContact(function(){
		anchorLocal("addr_index.html?v=20120620&groupname=vipgroup");
	});
}



//搜索短信发送记录
function searchMobileRecords(param) {
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        if (info) {
            param.mobile = info.getFirstMobile();
        }
    }
    top.Links.show("smsHistory", "&Mobile=" + param.mobile);
}

//删除联系记录
function deleteLastContactsRecords(param) {
    param.type = filter.isCloseContacts ? "close" : "last";
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        var obj = {
            serialId: info.SerialId,
            email: info.emails.concat(),
            mobile: info.mobiles.concat(),
            fax: info.faxes.concat(),
            type: param.type,
            lastId: param.lastId
        };
    } else {
        var obj = param;
    }
    top.FloatingFrame.confirm(PageMsg['warn_delrecent'], function() {
        window.top.Contacts.DeleteLastContactsInfo(obj, function(result) {
            if (result.success) {
                View.showLastOrCloseContacts(filter.groupId == "-2");
            } else {
                Pt.alert(result.msg);
            }
        });
    })
}

//点垃圾桶图标，清空最近联系人记录
function emptyLastContactsRecords2() {
    (function(f, F, c) {
        var dat = c.data;
        //只有两个对象存在来判断；
        //dat.closeContacts || dat.lastestContacts

        if ((f.isCloseContacts && dat.closeContacts.length < 1)
             || (!f.isCloseContacts && dat.lastestContacts.length < 1)) {
            return;
        }

        var param = {
            type: f.isCloseContacts ? "close" : "last"
        };

        F.confirm(PageMsg['warn_del' + param.type], function() {
            top.addBehavior("19_9561_11清空最近/紧密", f.isCloseContacts ? "2" : "1");
            c.EmptyLastContactsInfo(param, function(result) {
                if (result.success) {
                    View.showLastOrCloseContacts(f.groupId == "-2");
                } else {
                    F.alert(result.msg);
                }
            });
        });

    })(filter, top.FloatingFrame, top.Contacts);
}

