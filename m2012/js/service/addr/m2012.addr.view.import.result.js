//#region Model
; (function (jQuery, _, M139) {
    M139.namespace("M2012.Contacts.ImportResult.Model", Backbone.Model.extend({
        defaults: {
            importId: null,
            groupName: null,
            inviteType: null,
            showType: 0, //0:导入失败,1:跳过导入
            isDataReady: false,
            getImportDataError: false
        },
        ReasonMap:{
            "3001": "系统异常，暂时无法导入",
            "3002": "请求格式不正确，暂时无法导入",
            "3003": "联系人没有姓名",
            "3004": "联系人没有手机和邮箱",
            "3005": "联系人手机格式不正确。应由“3-40位数字、+、（）、-、空格”组成",
            "3006": "联系人手机格式不正确。应由“3-40位数字、+、（）、-、空格”组成",
            "3007": "联系人手机格式不正确。应由“3-40位数字、+、（）、-、空格”组成",
            "3008": "联系人邮箱格式不正确。格式应为“用户名+@+网站名”，如：zhangsan@139.com，长度6-90位",
            "3009": "联系人邮箱格式不正确。格式应为“用户名+@+网站名”，如：zhangsan@139.com，长度6-90位",
            "3010": "联系人邮箱格式不正确。格式应为“用户名+@+网站名”，如：zhangsan@139.com，长度6-90位",
            "3011": "联系人固话格式不正确。应由3-30位数字、-组成",
            "3012": "联系人固话格式不正确。应由3-30位数字、-组成",
            "3013": "联系人固话格式不正确。应由3-30位数字、-组成",
            "3014": "联系人传真格式不正确。应由3-30位数字、-组成",
            "3015": "联系人传真格式不正确。应由3-30位数字、-组成",
            "3016": "联系人传真格式不正确。应由3-30位数字、-组成",
            "3017": "联系人IM格式不正确。应由6-9位数字组成",
            "3018": "联系人生日格式不正确。应为YYYY-MM-DD格式",
            "3019": "联系人邮编格式不正确。应由长度3-10位的数字、字母、“-”分隔符及中间空格组成",
            "3020": "联系人邮编格式不正确。应由长度3-10位的数字、字母、“-”分隔符及中间空格组成",
            "3021": "联系人QQ号码格式不正确。应由5-11位数字组成",
            "3022": "通讯录联系人总数已达上限{3000/4000/6000}",
            "3023": "与邮箱内联系人重复，跳过导入",
            "3024": "联系人资料缺乏有效信息。应至少有手机号码、邮箱地址、固定电话、传真之中的一项资料"
        },
        API: top.Contacts,
        getImportResultData: function (callback) {
            var _this = this;
            if (!_this.get("isDataReady")) {
                var importId = _this.get("importId");
                if (!importId) return;
                _this.API.getFinishImportResult(_this.get("importId"), function (result) {
                    if (window.parent && window.parent.EventsAggr) {
                        window.parent.EventsAggr.Contacts.keyTrigger("IMPORT_CONTACTS");
                    }
                    var keyMap = {
                        INFO: "NoImportInfo",
                        TOTAL: "ImportNum",
                        NOTIMPORTDATA: "FailInfo",
                        SKIPIMPORTDATA: "SkipInfo",
                        REASONCODE: "NoImportReason",
                        NAME: "AddrName"
                    };

                    var code = result.ResultCode,
                        infos = result[keyMap.INFO],
                        SUCCESS = "0",
                        isReady = code == SUCCESS;
                    if (isReady) {
                        _this.set({ isDataReady: isReady }, { silent: true });
                    }

                    var failInfo = [], skipInfo = [];
                    if (infos) {
                        //将原因代码转成内容的描述
                        failInfo = _this.formatData(infos[keyMap.NOTIMPORTDATA], keyMap);
                        skipInfo = _this.formatData(infos[keyMap.SKIPIMPORTDATA], keyMap);
                    }

                    var data = {
                        isReady: isReady,
                        count: result[keyMap.TOTAL],
                        failData: failInfo,
                        skipData: skipInfo
                    };

                    callback && callback(data);
                }, function () {
                    _this.set({ "getImportDataError": true });
                });
            }
        },
        formatData: function (data, keyMap) {
            var _this = this;
            var result = [];
            if (data) {
                var ReasonList = _this.ReasonMap;
                $.each(data, function (i, item) {
                    var reasonId = item[keyMap.REASONCODE];
                    item[keyMap.REASONCODE] = ReasonList[reasonId];
                    if (item[keyMap.NAME] == "") item[keyMap.NAME] = "(空)";
                    result.push(item);
                });
            }
            return result;
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
    M139.namespace("M2012.Contacts.ImportResult.View", superClass.extend(
    {
        el: "#backboneEl",
        template: {
            TITLE: "导入完成: {totalcount}人已导入，<span class='red'>{failcount}人</span> 未导入<span class='fz_12 fw_n c_666'>（其中跳过导入{skipcount}人）</span>",
            LINE: "<tr handlerId='{id}'><td>{name}</td><td>{reason}</td></tr>"
        },
        type: {
            NOTALLOW: 0,
            SKIP: 1
        },
        queryString: {
            BATCHID: "bid", //通过URL跳转过来的导入批次号，数据安全由服务端保障
            GROUPNAME: "groupname",
            INVITETYPE: "invitetype"
        },
        initialize: function () {
            var _this = this;
            _this.model = new M2012.Contacts.ImportResult.Model();

            var importId = $Url.queryString(_this.queryString.BATCHID);
            var groupName = $Url.queryString(_this.queryString.GROUPNAME);
            var inviteType = $Url.queryString(_this.queryString.INVITETYPE);
            var initData = { "importId": importId, "groupName": groupName, "inviteType": inviteType };
            _this.model.set(initData); //导入单号,群组

            _this.initEvents();
            _this.render();

            return superClass.prototype.initialize.apply(_this, arguments);
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;
            model.on("change:showType", function () {
                var type = model.get("showType");
                _this.show(type);
            });

            $("#topGoBack").on("click", _this.goBack);
            $("#mailtoFriends").on("click", function () { _this.mailtoFriends(); return false; });
            $("#liFailImport").on("click", function () { _this.showFailImport(); });
            $("#liSkipImport").on("click", function () { _this.showSkipImport(); });
            $("#importMore").on("click", function () { _this.importMore(); });
        },
        render: function () {
            var _this = this;
            _this.model.getImportResultData(function (data) { _this.initView(data); });
            bh(104463);
        },
        initView: function (data) {

            //#region 渲染未导入方法
            //options.data {Array} 需要显示的内容
            //options.doms {Object} 所关联的DOM,JQ对象
            //options.show {Boolean} 是否为默认显示项
            function renderDetail(options) {
                var showData = options.data;
                var showCount = showData.length;
                var doms = options.doms;

                if (showCount > 0) {
                    var strHtml = _this.createHtml(showData);
                    $(doms.tb).html(strHtml);
                    if (options.show) {
                        $(doms.li).addClass("on");
                        $(doms.div).addClass("show");
                    }
                    _this.$el.removeClass("hide");
                }
                else {
                    $(doms.li).addClass("hide");
                }
            }
            //#endregion

            if (data) {
                var _this = this;
                if (data.isReady) {
                    var title = _this.template.TITLE;
                    var failData = data.failData;
                    var skipData = data.skipData;
                    var failCount = failData.length;
                    var skipCount = skipData.length;

                    title = $T.format(title, { totalcount: data.count, failcount: (failCount + skipCount), skipcount: skipCount });
                    $("#importTitle").html(title);
                    if (data.count > 0) $("#mailtoFriends").removeClass("hide"); //有成功导入的联系人，显示通知入口

                    var type = { NONE: 0, FAIL: 1, SKIP: 2 };
                    var defaultShow = failCount > 0 ? type.FAIL : (skipCount > 0 ? type.SKIP : type.NONE);

                    //未导入
                    var pageDom = {
                        FAIL: { li: "#liFailImport", div: "#divFailImport", tb: "#tbFailImport" },
                        SKIP: { li: "#liSkipImport", div: "#divSkipImport", tb: "#tbSkipImport" }
                    };
                    renderDetail({ data: failData, doms: pageDom.FAIL, show: defaultShow == type.FAIL });
                    renderDetail({ data: skipData, doms: pageDom.SKIP, show: defaultShow == type.SKIP });
                }
                else {
                    //do nothing
                }
            }
            else {
                //console.error("导入结果请求失败", data);
            }
        },

        goBack: function () {
            setTimeout(function() {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
           /*
            if (top.$App) {
                top.$App.show("addrhome");
            } else {
                top.Links.show('addr');
            }*/
            return false;
        },

        importMore : function() {
            var pagesMap = {
                importFile : "addr_import_file.html",
                importClone : "addr_import_clone.html",
                importPim : "addr_import_pim.html"
            };
            var importFromKey = $Url.queryString("from") || "importClone";
            var importFromPage = pagesMap[importFromKey];
            top.BH('addr_importPim_continue');
            window.location.assign(importFromPage + "?sid=" + top.$App.getSid());
        },

        mailtoFriends: function () {
            var _this = this;
            var isReady = _this.model.get("isDataReady");
            if (!isReady) return; //接口未返回或返回失败

            var importId = _this.model.get("importId");
            var groupName = _this.model.get("groupName");
            var inviteType = _this.model.get("inviteType");

            var url = ["addr_mailtofriends.html?sid=", top.sid,
                    "&invitetype=", inviteType,
                    "&bid=", importId,
                    "&groupname=", groupName].join("");

            bh(104462);
            window.location.href = url;
        },
        showFailImport: function () {
            var _this = this;
            _this.model.set({ showType: _this.type.NOTALLOW });
        },
        showSkipImport: function () {
            var _this = this;
            _this.model.set({ showType: _this.type.SKIP });
        },
        show: function (type) {
            var _this = this;
            var dom = [
                { li: "#liFailImport", div: "#divFailImport" },
                { li: "#liSkipImport", div: "#divSkipImport" }
            ];

            //先取消所有选中
            var container = $("#backboneEl");
            container.find("ul li").removeClass("on");
            container.find(".tabContent").removeClass("show");

            //重新标记选中
            var jqDom = dom[type];
            if (jqDom) {
                $(jqDom.li).addClass("on");
                $(jqDom.div).addClass("show");
            }
        },
        createHtml: function (data) {
            var _this = this;
            var html = [];
            var template = _this.template;
            var line = template.LINE;
            if (data && data.length > 0) {
                $.each(data, function (i, item) {
                    html.push($T.format(line, {
                        id: item.NoImportId,
                        name: item.AddrName,
                        reason: item.NoImportReason
                    }));
                });
            }
            else {
                //do nothing
            }
            return html.join("");
        }
    }));

    $(function () {
        window.ResultView = new M2012.Contacts.ImportResult.View();
    });
})(jQuery, _, M139);
//#endregion


