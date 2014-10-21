
; (function (jQuery, _, M139, top) {
    var className = "M2012.Calendar.UI.Invite.Model";
    M139.namespace(className, Backbone.Model.extend({
        defaults: {
            data: [],
            quickList: {},
            params: {
                actionType: 0,
                shareType: 2,
                inviteAuth: 2
            },
            max: 20,
            status: {
                OK:"finish",
                MAX: "max",
                PARTITAL: "partital",
                NOTHING: "none",
                ERR_DOMAIN:"errordomain",
                SELF : "self"
            }
        },
        initialize: function () {
            var _this = this;

            var accountList = '';
            if (!window.ISOPEN_CAIYUN) {
                var mailList = top.$User.getAccountList();
                accountList = _.map(mailList, function (item) {
                    return item.name;
                });
            }
            _this.set("accountList", accountList);
        },
        setData: function (arr, options) {
            var _this = this;

            //人数限制
            var maxLen = _this.get("max");

            var quickList = {};
            $(arr).each(function (i, item) {
                if (i>maxLen) return false; //添加人数最大限制

                if (!item || !item.email) return true;
                _this._checkMailFormat(item);

                var key = $T.Email.getEmail(item.email);
                if (!quickList[key]) {
                    quickList[key] = _this._getObject(item);
                }
            });

            _this.set("data", quickList);

            if (options && options.silent == true) return; //不通知

            _this.trigger("change:data", quickList);
        },
        addData: function (obj) {
            //这个方法只是添加数据,一般是单条，先做通讯录的兼容
            var _this = this;
            var result;
            
            var accountList = _this.get("accountList");
            var quickList = _this.get("data");
            var status = _this.get("status");
            
            var maxLen = _this.get("max");
            var len = _.keys(quickList).length;
            if (len >= maxLen) {
                return status.MAX;
            }

            var isCheckDomain = _this.get("checkdomain");

            if (!$.isArray(obj)) {
                obj = [obj];
            }

            $(obj).each(function (i, item) {
                if (len + i > maxLen) {
                    result = status.MAX;
                    return false; //添加人数最大限制
                }

                if (!item || !item.email) {
                    result = status.PARTITAL;
                    return true;
                }
                _this._checkMailFormat(item);

                //是否本域邮箱
                if (isCheckDomain && !_this.isLocalDomain(item.email)) {
                    result = status.ERR_DOMAIN;
                    return false;
                }

                var key = $T.Email.getEmail(item.email);
                if (_.contains(accountList, key)) {
                    return true;
                }  // 过滤自己的邮箱

                if (!quickList[key]) {
                    quickList[key] = _this._getObject(item);
                }
            });

            _this.trigger("change:data", quickList);

            if (!result) result = status.OK;
            return result;
        },
        isExist:function(email){
            var data = _.keys(this.get("data"));
            return _.contains(data, $T.Email.getEmail(email));
        },
        isDefaultSender:function(email){
            var accountList = this.get("accountList");
            return _.contains(accountList, email);
        },
        _checkMailFormat:function(item){
            var mail = item.email;
            mail += mail.indexOf("@") > -1 ? '' : "@"+this.getLocalDomain();
            item.email = mail;
            return item;
        },
        _getObject: function (obj) {
            var _this = this;
            obj = obj || {};
            var contactInfo = _this._getContactInfo(obj.email);
            return $.extend({
                shareUin: obj.email,
                inviterUin: obj.email,
                recEmail: obj.email,
                smsNotify: obj.smsNotify,
                emailNotify: obj.emailNotify,
                status : obj.status, // 新增,邀请活动的状态
                refuseResion : obj.refuseResion || "", // 拒绝原因,用于拒绝别人邀请的活动(默认为空串)
                isShowStatus : obj.isShowStatus || false, // 是否要显示邀请的状态
                recMobile: contactInfo.mobile,
                name: contactInfo.name
            }, _this.get("params"));
        },
        _getContactInfo: function (email) {
            var _this = this;
            var type = _this.get("type");

            var mobile = "",
                name = "";
            if (!window.ISOPEN_CAIYUN) { //TODO 先做邮箱内的
                var contactInfo = top.Contacts.getContactsByEmail(email);

                if (contactInfo && contactInfo.length > 0) {
                    mobile = contactInfo[0].MobilePhone;
                    name = contactInfo[0].AddrFirstName
                }

                // 产品要求,要么有手机号,要么就根据输入的邮件地址判断是否手机号
                // 这个最原始的添加日历页面中也是这样的逻辑,迁移过来先
                var userMobile = mobile || ($Email.getDomain(email) == "139.com" ? $Email.getName(email) : '');
                userMobile = $Mobile.isChinaMobile(userMobile) ? userMobile : '';
            }
            return {
                mobile: userMobile,
                name: name
            };
        },
        getLocalDomain: function () {
            return ((window.SiteConfig && SiteConfig.mailDomain) || "139.com");
        },
        isLocalDomain: function (email) {
            return $T.Email.getDomain(email) == this.getLocalDomain();
        },

        /**
         * 新增,根据返回的邀请状态标记得到正确的邀请状态信息
         * @param status 状态标记符号
         * @returns 详细的状态信息
         */
        getDetailStatusInfo : function (status) {
            var msg = "未回复";
            if (typeof status === 'undefined') {
                return msg;
            }

            switch (status) {
                case 0:
                    msg = "未回复";
                    break;
                case 1:
                    msg = "已接受";
                    break;
                case 2:
                    msg = "已谢绝";
                    break;
                case 3:
                    msg = "已删除";
                    break;
                default:
                    msg = "未知处理";
                    break;
            }
            return msg;
        },
        /**
         * 点击查看拒绝详情图标,则弹出详情提示信息框
         * @param info 包括目标图标,详情内容等信息
         */
        popRefuseInfo : function (info) {
            var _this = this;
            if (_this.popTip) {
                M139.UI.Popup.close("tips_reject_reason");
                _this.popTip = null;
            }
            _this.popTip = M139.UI.Popup.create({
                name: "tips_reject_reason",
                target: info.elem,
                width: 150,
                closeClick: function () {
                    _this.popTip = null;
                },
                direction: "up",
                content: $T.format('<p class="mr_5 mt_10" style="word-wrap:break-word; word-break:break-all;">{reason}</p>', { reason: $T.Html.encode(info.reason) }) //这里可能存在二次转码
            });
            _this.popTip.render();
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Calendar.UI.Invite.View', superClass.extend({
        template: {
            /* 这段HTML目测没有共用性 */
            MAIN: ['<table id="{tableId}" class="meetformtab {isHide}">',
                        '<thead>',
                            '<tr>',
                                '<th>参与人</th>',
                                '<th class="td4">通知方式</th>',
                                '<th class="td6" id="_status" style="display:none;">状态</th>',
                                '<th class="td3">操作</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody id={tbodyId}>',
                            '{itemList}',
                        '</tbody>',
                    '</table>'].join(""),
            ITEM: ['<tr>',
                        '<td style="word-break:break-all;" title="{name}">{name}</td>',
                        '<td class="td4">',
                            '<input data-mail="{email}" data-type="emailNotify" type="checkbox" {isMailChecked}><label for="" class="mr_10 ml_5">邮件</label>',
                            '<input data-mail="{email}" data-type="smsNotify" type="checkbox" {isMsgChecked} {isDisabled}><label for="" title="{smsTip}" class="ml_5">短信</label>',
                        '</td>',
                        '<td class="td6" style="width: 90px;display:{isShowStatus}">{statusDetail}<a href="javascript:void(0);" class="i_warn_min warnTips" refuseResion="{refuseResion}" style="display:{isDisplayReason}"></a></td>',
                        '<td class="td3"><a data-mail="{email}" href="javascript:void(0)">删除</a></td>',
                    '</tr>'].join(""),
            TIPS: ['<div id="{cid}_invite_tips" class="tips meet-tips" style="display:none;">',
                        '<div class="tips-text">请输入邮箱地址</div>',
                        '<div class="tipsBottom diamond"></div>',
                    '</div>'].join("")
        },
        configs: {
            PLACEHOLDER: '请输入邮箱地址，多个地址以逗号“，”隔开',
            INVITE_MAX: "邀请人数已达到上限20人",
            INVITE_EMPTY: "请输入邮箱地址",
            ERROR_EMAIL_ADDR: "您输入的邮箱地址错误或不是139邮箱地址",

            EMAIL_EXIST: '该好友已经邀请过',
            NOT_ALLOW_TO_ADD_MYSELF: "暂不支持添加自己",
            MSG_INVITE_MAX:'邀请人数已达到上限<strong class="c_ff6600">{count}</strong>人',

            keyMap: {
                ENTER: 13,
                SEMICOLON: ($.browser.mozilla || $.browser.opera) ? 59 : 186, //分号
                COMMA: 188 //逗号
            }
        },
        /**
         *
         * new M2012.Calendar.UI.Invite.View({
         *     target:$(document.body),
         *     input:$("#xxx"),
         *     checkdomain:true,
         *     data:[
         *         {
         *             email:'example@139.com',
         *             smsNotify:1,
         *             emailNotify:0
         *         }
         *     ]
         * })
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            _this.model = new M2012.Calendar.UI.Invite.Model();
            _this.container = options.container || options.target;
            _this.input = options.input;
            _this.model.set("checkdomain", options.checkdomain || false);

            //保存dom
            _this.tableId = _this.cid + "_invite_main_table";
            _this.tbodyId = _this.cid + "_invite_tbody";

            _this.setData((options.data || []), { silent: true }); //保存数据
            _this.render();
        },
        render: function () {
            var _this = this;

            var html = _this.getTableHtml();
            _this.container.html(html);
            _this.input.before($T.format(_this.template.TIPS, { cid: _this.cid }));

            _this.initEvents();
        },
        initEvents: function () {
            var _this = this;

            _this.table = $("#" + _this.tableId);
            _this.tbody = $("#" + _this.tbodyId);
            _this.tips = $("#" + _this.cid + "_invite_tips");

            _this.model.on("change:data", function () {
                //数据变更，重新渲染
                var tbody = _this.getBodyHtml();
                _this.tbody.html(tbody);
                _this.model.trigger("change:show", { isshow: (!!tbody) });
            });

            _this.model.on("change:show", function (data) {
                //显示隐藏table
                var isshow = _this.model.get("isshow");
                if (isshow == data.isshow) return;

                if (data.isshow) {
                    _this.table.removeClass("hide");
                } else {
                    _this.table.addClass("hide");
                }
                _this.model.set("isshow", data.isshow);
            });

            //自动联想邀请人,在m2012.ui.richinput.view.js中调用
            _this.addrInput = M2012.UI.RichInput.create({
                container: _this.input[0],
                preventAssociate: true,
                placeHolder: _this.configs.PLACEHOLDER,
                type: "email",
                maxSend: function () {
                    var data = _.values(_this.model.get("data"));
                    return _this.model.get("max") - data.length;
                },
                onMaxSend: function () {
                    _this.addrInput.showAddressTips({
                        html: $T.format(_this.configs.MSG_INVITE_MAX, { count: _this.model.get("max") })
                    });
                },
                errorfun: function (obj, text) {
                    var email = $T.Email.getEmail(text);
                    if (_this.model.isDefaultSender(email)) {
                        obj.error = true;
                        obj.errorMsg = _this.configs.NOT_ALLOW_TO_ADD_MYSELF;
                        return;
                    }
                    if (_this.model.isExist(email)) {//已经存在
                        obj.error = true;
                        obj.errorMsg = _this.configs.EMAIL_EXIST;
                        return;
                    }

                    //自动添加,setTimeout是因为清除email时，richinput还没执行完,
                    setTimeout(function () {
                        if ($Email.isEmailAddr(email)) {
                            _this.addData(email);
                            _this.addrInput.clear();
                            return;
                        }
                    }, 100);
                },
                change: function (items, msg) {
                    // 当向列表中添加数据时,如果是合法的数据(通过按"回车键"或"鼠标点击"的方式),外层容器显示滚动条
                    _this.items = items || {}; // 将items保存起来,调用deleteData方法时需要用到
                    if (!items) {
                        return;
                    }

                    if ($.isEmptyObject(items)){ //如果输入框中的值为空
                        // 并且下拉列表为空时,则可以去掉滚动条
                        if ($.isEmptyObject(_this.model.get("data"))) {
                            _this.model.trigger("change:hideScroll"); //列表为空
                        }
                    }else{ // 输入框中有联系地址(不管正确与否,只要有值),需要增加滚动条
                       _this.model.trigger("change:showScroll");
                    }
                }
            }).render();

            _this.tbody.on("click", function (e) {
                var elem = $(e.target);
                var tagName = e.target.tagName.toLowerCase();
                switch (tagName) {
                    case 'input':
                        //勾选
                        _this.updateData({
                            email: elem.attr("data-mail"),
                            type: elem.attr("data-type"),
                            checked: elem.attr("checked")
                        });
                        break;
                    case 'a':
                        //删除
                        var reason = elem.attr("refuseResion");
                        if (reason) { // 拒绝理由的图标需特殊处理
                            _this.model.popRefuseInfo({
                                reason : reason || 'unknown info',
                                elem : elem
                            });
                            return;
                        }
                        // 表示删除链接
                        _this.deleteData(elem);
                        break;
                    default:
                        break;
                }
            });
        },
        getTableHtml: function () {
            var _this = this;

            var tbody = _this.getBodyHtml();
            var html = $T.format(_this.template.MAIN, {
                tableId: _this.tableId,
                tbodyId: _this.tbodyId,
                itemList: tbody,
                isHide: (!tbody ? 'hide' : '') //没有内容时，隐藏
            });

            return html;
        },
        getBodyHtml: function () {
            var _this = this;
            var tbody = '';
            var data = _.values(_this.model.get("data"));

            if (data.length) {
                // 如果界面要显示邀请的状态,并且有邀请人信息
                // 根据两种情况判断是否需要显示状态信息:1.元素中的isShowStatus属性为true, 2.打开编辑页面,有联系人信息在添加的情况
                if (data[0].isShowStatus) {
                    $("#_status").show();
                    _this.isShowStatus = true;
                }
            }

            $(data).each(function (i, item) {
                tbody += $T.format(_this.template.ITEM, {
                    name: $T.Html.encode(item.name)||item.shareUin, //TODO 要从通讯录里面获取信息
                    email: item.shareUin,
                    isMailChecked: !!item.emailNotify ? "checked" : "",
                    isMsgChecked: !!item.smsNotify ? "checked" : "",
                    isDisabled: !!item.recMobile ? "" : "disabled",//是否可以选择短信
                    smsTip: !!item.recMobile ? "" : "暂只支持向移动手机号及移动手机邮箱发送短信通知", // 新增,如果没有手机号,则短信按钮置灰,并且有tip提示
                    isShowStatus : _this.isShowStatus ? "" : "none", // 是否显示邀请活动的状态信息//todo 要注意
                    statusDetail : _this.model.getDetailStatusInfo(item.status), // 状态详情
                    isDisplayReason : !!item.refuseResion ? "" : "none", // 如果详情不为空,则显示可以通过点击查看详情的图标
                    refuseResion : item.refuseResion // 保存拒绝邀请活动的详情信息
                });
            });

            return tbody;
        },
        hideSuggest:function(){
            var _this = this;
            var addrSuggest = _this.addrInput.addrSuggest;
            addrSuggest && addrSuggest.hide();
        },
        setData: function (arr) {
            //这个方法会把之前的数据清除掉,在initialize时未传递data参数时，可通过此方法设置初始数据
            this.model.setData(arr);
        },
        addData: function (obj) {
            //这个方法只是添加数据,单条
            var data;
            var type = $.type(obj);
            var inviteActivityInfo = {}; // 邀请的活动信息,包括状态,拒绝详情等
            var defaultSet = {
                emailNotify: 1,
                smsNotify: 0
            };

            switch (type) {
                case 'string':
                    data = $.extend({ email: $T.Email.getEmail(obj) }, defaultSet);
                    break;
                case 'object':
                    data = [obj];
                    break;
                case 'array':
                    data = _.map(obj, function (item) {
                        if ($.type(item) === 'object') {
                            // 如果数组元素不是字符串,而是对象的话,重新设置item,暂时在编辑活动详情页面用到
                            inviteActivityInfo = {
                                status : item.status,   // 没有则undefined
                                refuseResion : item.refuseResion, // 没有则undefined
                                isShowStatus : true  // 是否显示邀请的状态
                            };

                            item = item.recEmail || 'undefined@139.com'; // 默认值'undefined@139.com'
                        }
                        item = $T.Email.getEmail(item);
                        if (!item) return true;
                        return $.extend({ email: item }, defaultSet, inviteActivityInfo);
                    });
                    break;
                default: //other
                    data = [];
                    break;
            }
            if (data.length == 0) return;

            return this.model.addData(data);
        },
        updateData:function(options){
            var _this = this;
            var data = _this.model.get("data");

            //保存修改
            var key=options.email,
                item=options.type;
            if (data[key]) {
                data[key][item] = options.checked ? 1 : 0;
            }
        },
        deleteData:function(elem){
            var _this = this;
            var email = elem.attr("data-mail");
            var tr = elem.closest("tr");

            var data = _this.model.get("data");
            delete data[email];
            tr.remove();

            if ($.isEmptyObject(data)) {
                _this.model.trigger("change:show", { isshow: false }); //列表为空时的情况
                if ($.isEmptyObject(_this.items)) { // 触发M2012.Calendar.UI.Invite.View的change事件时保存
                    _this.model.trigger("change:hideScroll"); //李超增加,如果列表为空并且输入框中也没有任何值,则可以去掉滚动条
                }
            }
        },
        getEmails:function(){
            var data = this.model.get("data");
            return _.keys(data); //只获取value，返回数组
        },
        getData: function () {
            var data = this.model.get("data");
            return _.values(data); //只获取value，返回数组
        }
    }));

})(jQuery, _, M139, window._top || window.top);
;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.View.CalendarAddPopup",
        Validate = M2012.Calendar.View.ValidateTip,
        commonAPI = M2012.Calendar.CommonAPI.getInstance();

    M139.namespace(_class, _super.extend({
        name: _class,
        template: {
            COLORS: ['<div class="repeattips-box" id="{cid}_outer">',
                '<p class="tac mt_15"><img src="../../images/module/calendar2.0/pic_02.jpg"></p>',
                '<div class="pt_20 repeattips-bottom clearfix" style="z-index:1000;">',
                    '<span class="numFour">日历名称：</span>',
                    '<div class="inputSelect clearfix fl">',
                       '<div id="{cid}_tip" style="left: 60px; top: -15px; display: none;" class="tips">',
                            '<div class="tips-text"></div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<input type="text" class="iText" id="{cid}_labelName">',
                        '<div class="inputSelect_color">',
                            '<a href="javascript:void(0);" class="dropDownA" id="{cid}_colorLink"><span class="theme-i" style="background-color: #90cf61;" data-value="#90cf61"><i class="i_xgg"></i></span><i class="i_triangle_d"></i></a>',
                            '<div class="inputSelect_box" style="display:none;" id="{cid}_colorSelect">',
                                '<ul class="clearfix">',
                                    '<li role="option"><span class="theme-i" style="background-color: #90cf61;" data-value="#90cf61"><i class="i_xgg" style="display:block;"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #a5a5f0;" data-value="#a5a5f0"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #fcc44d;" data-value="#f2b73a"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #f399d5;" data-value="#ea8fcc"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #93cbee;" data-value="#80bce1"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #ef7f7f;" data-value="#ef7f7f"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #afbecf;" data-value="#9eb4cd"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #7fdada;" data-value="#69d1d1"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #5eabf3;" data-value="#5eabf3"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #ffb089;" data-value="#ffa77c"><i class="i_xgg"></i></span></li>',
                                 '</ul>',
                            '</div>',
                        '</div>',
                    '</div>',
                 '</div>',
                 '<div class="pt_20 repeattips-bottom clearfix">',
                     '<span class="numFour">添加参与人：</span> ',
                     '<div class="addPeople addPeopleOther" style="width:240px;">',
                         '<div id="{cid}_invite_input_container"></div>',
                         '<a id="{cid}_select_addr_link" href="javascript:void(0);" title="选择联系人" class="i_peo" style="z-index:4;"></a>',
                        // '<input class="iText" type=text> <a href="#"></a>',//
                     '</div>',
                 '</div>',
                '<div id="{cid}_invite_list_container" class="addPeopleMain"></div>', // 展开的联系人列表
            '</div>'
            ].join(""),
            DialogTitle: "新建日历"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:37px; width:100%; z-index:1000;" class="blackbanner"></div>',
        events : { // TODO 如何给document绑定事件
            "click .inputSelect_box li" : "chooseColor", // 勾选框
            "click .inputSelect_color" : "toggleColor",  // 颜色选择器
            "click #btn_save" : "save", // 保存按钮
            "click #btn_cancel" : "cancel", // 取消按钮
            //"click #btn_edit" : "edit", // "编辑详细链接"
             "change .iText" : "hideTip",
            //"keyup .iText" : "validate",
            //"keydown .iText" : "validate",
            "focus .iText" : "hideTip"
        },
        config : {
            MAX_ADDR_SELECT: 20,
            MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人'
        },
        logger : new top.M139.Logger({
            name : "M2012.Calendar.View.MyCalendar"
        }),
        initialize: function (options) {
            options = options || {};
            options.master = window.$Cal;
            this.master = options.master;
            this.render(options);
            // 设置作用域,必须使用,不然无法通过backbone的方式绑定事件
            this.$el = this.dialog.$el;
            this.model = new M2012.Calendar.Model.CalendarAddPopup(options);
            //this.replaceButtons();
            this.defineElement();
            this.bindEvent();
        },
        defineElement : function () {
            var that = this;
            this.tipDomEl = this.$el.find("#" + this.cid + "_tip");
            this.labelNameEl = this.$el.find("#" + this.cid + "_labelName");
            this.colorLinkEl = this.$el.find("#" + this.cid + "_colorLink");
            this.outerEl = this.$el.find("#" + this.cid + "_outer");
            this.colorSelectEl = this.$el.find("#" + this.cid + "_colorSelect");
            // 设置初始值,点击"编辑按钮"时不需要对数据进行校验
            this.model.set("color", "#90cf61");
            this.model.set("labelName", {value : ''});
            this.dialog.inviteInputContainer = this.dialog.$el.find("#" + this.cid + "_invite_input_container");
            this.dialog.inviteListContainer = this.dialog.$el.find("#" + this.cid + "_invite_list_container");
            this.dialog.selectAddrLink = this.dialog.$el.find("#" + this.cid + "_select_addr_link");
            this.dialog.btnEl = this.dialog.$el.find("div .boxIframeBtn").css("position", "relative");

            //同时邀请别人
            this.invites = new M2012.Calendar.UI.Invite.View({
                target: this.dialog.inviteListContainer,
                input: this.dialog.inviteInputContainer
            });
            this.invites.model.on("change:hideScroll", function (args) {
                // 如果联系人列表为空时会触发该方法,m2012.calendar.ui.invite.view.js
                // todo 暂时先这么修改,有可能多次触发
                if (that.outerEl.hasClass("repeattips-boxScroll")) {
                    // 如果列表为空,则清除滚动条
                    that.outerEl.removeClass("repeattips-boxScroll");
                }
            });
            this.invites.model.on("change:showScroll", function () {
                // 如果联系人列表中有数据时,m2012.calendar.ui.invite.view.js中change触发
                if (!that.outerEl.hasClass("repeattips-boxScroll")) {
                    that.outerEl.addClass("repeattips-boxScroll");
                }
                // 将滚动条定位到底部
                that.inviteMainTable.get(0).scrollIntoView(false);
            });
            // 修改"参与人"控件的样式,不能改变公共的
            this.changeCssStyle();
        },
        changeCssStyle : function () { //使用js代码修改参与人控件
            this.dialog.$el.find(".addpeowidth").css("width", "auto"); // 宽度自适应
            this.dialog.$el.find(".PlaceHold").remove(); // 移除占位符
            //console.log(this.dialog.$el.find("#" + this.cid + "_invite_input_container input").parent().css("width", "90%"));
            this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table").css({
                "width" : "100%",
                "margin-top" : "0px"
            }); // 表格宽度自适应
            // 表格中的第一个th宽度设置为40%
            this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table thead tr th:first").attr("width", "40%");
            // 保存table,出现滚动条时，需要将滚动条带到最底部时需要这个对象
            this.inviteMainTable = this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table");
            // 增加样式,输入的字符不能超过图片的位置
            //this.invites.addrInput.$("div.addrText").addClass("addrText_wb");
        },
        /**
         * 1.给"添加参与人"的图标绑定点击事件
         * 2.给document绑定点击事件,关闭颜色选择器弹出窗口
         */
        bindEvent : function () {
            var that = this;
            that.dialog.selectAddrLink.on("click", function () {
                var selectedAddress = that.invites.getData(),
                    maxAddressCount = that.config.MAX_ADDR_SELECT - (selectedAddress.length || 0); //最大的可选数量
                top.M2012.UI.Dialog.AddressBook.create({
                    filter: "email",
                    maxCount: maxAddressCount
                }).on("select", function (e) {
                    // 在model的addData里面判断这些地址是否合格,根据返回值的不同来判断
                    // 如果e.value为自己,则不会添加到列表
                    that.invites.addData(e.value); //添加到列表中
                    // 列表中有数据时显示滚动条
                    if (that.invites.getData().length) { // length大于0时表示有值
                        if (!that.outerEl.hasClass("repeattips-boxScroll")) {
                            that.outerEl.addClass("repeattips-boxScroll");
                        }
                        // 定位到联系人,先增加滚动条后在增加瞄点
                        that.inviteMainTable.get(0).scrollIntoView(false);
                    }
                }).on("additemmax", function () {
                    // 如果添加的联系人超过最大个数,则回调此方法
                    top.$Msg.alert($T.format(that.config.MSG_INVITE_MAX, {
                        max: that.config.MAX_ADDR_SELECT
                    }));
                });
            });

            // 点击非颜色选择器区域时关闭选择器弹出窗
            $(document).click(function (e) {
                var target = e.srcElement || e.target;
                // 点击非颜色选择器区域时关闭选择器
                if ($(target).closest("#" + that.cid + "_colorSelect").length) {
                    return;
                }
                if ($(target).closest("#" + that.cid + "_colorLink").length) {
                    return;
                }
                that.colorSelectEl.hide();
                that.showLine(that.colorSelectEl.is(":visible"));
            });

            this.labelNameEl.on("keyup keydown",function(e) {
                that.limitLength(e);
            });

            // 鼠标移除事件
            this.colorLinkEl.parents().hover(function() {

            },function() {
                that.colorSelectEl.hide();
                that.showLine(that.colorSelectEl.is(":visible"));
            });
        },
        /**
         * 替换弹出窗口默认生成的按钮样板并展示
         * 替换原因: (公共的样式现在不支持新需求,也不能随意更改公共的样式)
         */
        replaceButtons : function () {
            var boxIFrameBtnEl = this.dialog.$el.find(".boxIframeBtn"),
                template = $T.format(this.template.BUTTONS);
            boxIFrameBtnEl.html(template).show();
        },
        /**
         * 做四件事情
         * 1:修改父节点的背景颜色 2:勾选效果 3:保存设置到值到model 4.关闭弹出窗口
         * @param event
         */
        chooseColor : function (event) {
            var target = event.target || event.srcElement,
                color = $(target).data("value");
            $(target).closest("div").prev().find("span").css("background-color", color).data("value", color);
            $(target).children(":first").show().end().parent().siblings().find("i").hide(); // 去掉兄弟节点的勾选样式
            $(target).closest("div").hide();
            this.showLine($(target).closest("div").is(":visible"));
            this.model.set("color", color);
        },
        toggleColor : function (event) {
            var target = event.target || event.srcElement,
                colorArea = $(target).closest("a").next();
            colorArea.toggle();
            this.showLine(colorArea.is(":visible"));
        },
        /**
         * 去掉或增加颜色选择框的横线样式
         * @param isShow 为true时,表示颜色选择窗口展开,则需要增加on样式,反之则去除
         */
        showLine : function (isShow) {
            isShow ? this.colorLinkEl.addClass("on") : this.colorLinkEl.removeClass("on");
        },
        render : function () {
            var that = this,
                template = $T.format(that.template.COLORS, {
                    cid: that.cid
                });
            that.dialog = $Msg.showHTML(template,
                function (e) {
                    // 点击确定按钮
                    e.cancel = true;
                    that.save(e);
                },
                //function (e) {
                    // 点击取消按钮 // ai
                    //that.cancel();s
                //},
                {
                    name:"popup_createCalendar_view",
                    width: "375px",
                    dialogTitle: that.template.DialogTitle,
                    buttons: ['保存', '取消'],
                    onClose: function () {
                        // 关闭弹出窗口之前先关闭其他的展开列表
                        $(that.dialog.el).click();
                    }
                }
            );
        },
        /**
         * 两个功能
         * 1.校验数据 2.调后台接口
         */
        save : function (e) {
            // name: $T.Html.encode(name)
            // 只需要验证是否为空
            if (!$.trim(this.labelNameEl.val())) {
                Validate.show('日历名称不能为空', this.labelNameEl);
                M139.Dom.flashElement(this.labelNameEl.selector);
                return;
            }

            var param = this.wrapParam(),
                that = this;

            $(that.showMaskContent).insertBefore(that.dialog.btnEl.children(":first"));
            this.model.getLabels({comeFrom:0, actionType : 0}, function (detail, text){
                  if (detail.code == 'S_OK') {
                      if (that.model.isLabelNameExist(detail["var"]["userLabels"], param.labelName)) {
                          that.dialog.btnEl.children(":first").remove();
                          Validate.show('日历名称已经存在', that.labelNameEl);
                      } else {
                          that.submit(param,e);
                      }
                  }
            },function (detail) {
                  console.warn(detail);
            });
        },
        submit : function (param, e) {
            var that = this;

            //$(that.showMaskContent).insertBefore(that.dialog.btnEl.children(":first"));
            this.model.addLabel(param, function(detail, json) {
                if (detail.code == 'S_OK') {
                    var label = detail["var"];
                    top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });

                    // TODO 添加成功,则关闭窗口,跳转到月视图
                    that.master.trigger(that.master.EVENTS.LABEL_ADDED, {
                        seqNo: label.id,
                        labelName : param.labelName,
                        color : param.color,
                        labelShareInfo : param.labelShareInfo,
                        isShare: param.isShare
                    });

                    that.cancel();
                    that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                    new M2012.Calendar.Popup.View.Activity({master:that.master, labelId: label.id || 10});
                } else {
                    var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                    if (info) {
                        if (detail.errorCode == 17) {
                            // 当errorCode为17时,特殊处理下...
                            // 17是用户将日历名称命名为"我的日历"
                            Validate.show(info, that.labelNameEl);
                        }else{
                            // 如果错误码在commonapi中有对应的错误信息,则弹出提示窗口
                            $Msg.alert(info);
                        }
                    }else{
                        // info为空时,不处理
                        top.M139.UI.TipMessage.show('创建失败', { delay: 3000 });
                    }
                    that.dialog.btnEl.children(":first").remove();
                }
            }, function (json){
                console.log('fnError');
            });
        },
        cancel : function () {
            this.dialog.close();
        },
        /**
         * 需要传递到编辑页面的参数
         * labelName : 日历名称,默认为空
         * color : 背景色,默认值"58a8b4"
         * isNewCalendarTemplate : 标志是新创建日历

        edit : function () {
            var params  = {
                labelName : this.model.get("labelName").value,
                color : this.model.get("color"),
                isNewCalendarTemplate : true
            };

            M2012.CalendarReminder.Url.redirect("add_label.html?from=month&" + $.param(params));
        },*/
        limitLength : function (e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                value = $(target).val();

            // 只需要验证长度
            //this.setModel(value, false, true);
            if (value.length > 30) {
                Validate.show('不能超过30个字', this.labelNameEl);
                M139.Dom.flashElement(this.labelNameEl.selector);
                $(target).val(value.substr(0, 30));
            }
        },
        hideTip : function () {
            this.tipDomEl.hide();
        },
        /**
         * 控制验证范围,点击"保存"时只需要验证是否为空,而"输入"时只需要验证长度
         * @param value 元素的值
         * @param isValidateNotEmpty 是否需要验证不为空 true表示需要校验
         * @param isValidateLength   是否需要验证长度 true表示需要校验
         */
        setModel : function (value, isValidateNotEmpty, isValidateLength) {
            var that = this,
                isLegal = true;
            this.model.set("labelName", {
                    "value" : $.trim(value),
                    "isValidateNotEmpty" : isValidateNotEmpty,
                    "isValidateLength" : isValidateLength
                },{
                    error : function (model, errorInfo) {
                        that.tipDomEl.children(":first").html(errorInfo).end().show();
                        M139.Dom.flashElement(that.labelNameEl.selector);
                        isLegal = false;
                    }
                });
            return isLegal;
        },
        wrapParam : function () { // 封装需要传递的参数
            var inviteData = this.invites.getData(),
                length = inviteData.length, // 如果长度为0,表示页面没有选择
                param =  {
                    labelName : $.trim(this.labelNameEl.val()),
                    color : this.model.get("color"),
                    isShare : 0
                };

            if (length > 0) {
                param.labelShareInfo = inviteData;
                param.isShare = 1;
            }

            return param;
        }
    }));
})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.CalendarAddPopup",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, _super.extend({
        name: _class,
        defaults: {
            defaultParams: {
                comeFrom : 0,
                labelId : 0,
                description : '',   //标签描述
                isPublic : 0
            }
        },
        TIP_MSGS:{
            "isNotEmpty": "日历名称不能为空",
            "maxLength": "不能超过30个字"
        },
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * 每次调用set方法时,都会调用此方法,如果验证通过,则返回false
         * @param param
         * @returns {*}
         */
        validate: function (param) {
            var data = param.labelName;
            if (data) {
                if(data.isValidateNotEmpty && !data.value && data.value === "") {
                    return this.TIP_MSGS["isNotEmpty"];
                }

                if (data.isValidateLength && data.value && data.value.length > 30) {
                    return this.TIP_MSGS["maxLength"];
                }
            }
            return false;
        },
        /**
         * 直接使用新模板创建日历时需要调用的接口
         * @param data  调用接口需要传递的参数
         * @param fnSuccess 调用接口成功时的回调函数
         * @param fnError 调用接口异常时的回调函数(如网路异常问题)
         */
        addLabel: function (data, fnSuccess, fnError) {
            data = $.extend(data, this.get("defaultParams")); //默认数据
            commonAPI.callAPI({
                data : data,
                fnName : "addLabel",
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getLabels : function (data, fnSuccess, fnError){
            commonAPI.callAPI({
                data : data,
                fnName : "getLabels",
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 判断页面输入的名称是否已经存在
         * @param labelNameArr  用户已经创建的日历集合
         * @param labelName 页面上输入的日历名称
         */
        isLabelNameExist : function (labelNameArr, labelName) {
            labelNameArr = [].slice.call(labelNameArr);
            if (labelNameArr instanceof Array) {
                for (var i = 0, len = labelNameArr.length; i < len; i++) {
                    if (labelNameArr[i].labelName && labelNameArr[i].labelName === labelName) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 判断用户已经创建的日历是否达到最大数
         */
        isExtendMax : function (length) {
            return (length === 10);
        }
    }));
})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.Popup.View.Activity",
        commonAPI = M2012.Calendar.CommonAPI.getInstance(),
        Validate = M2012.Calendar.View.ValidateTip,
        Constant = M2012.Calendar.Constant,
        $Utils = M2012.Calendar.CommonAPI.Utils,
        remindType = M2012.Calendar.Constant.remindSmsEmailTypes;
    M139.namespace(_class, _super.extend({
        name: _class,
        template: {
            activity: [
                 '<div class="repeattips-box repeattips-boxOther">',
                     '<div class="norTips">',
                         '<span class="norTipsIco"><i class="i_ok"></i></span>',
                         '<div class="norTipsContent"><p class="norTipsLine">创建日历成功！赶快创建活动吧。</p></div>',
                     '</div>',
                     '<div class="tips-text-div">',
                         '<form class="form-addtag">',
                             '<fieldset>',
                                  '<legend class="hide">添加日程</legend>',
                                  '<ul class="form">',
                                      '<li class="formLine">',
                                          '<input type="text" value="记下你准备做的事" class="iText iText-addzt gray" id="{cid}_activityName">',
                                      '</li>',
                                      '<li class="formLine"><label class="label">时间：</label>',
                                          '<div id="{cid}_dateComponent" class="element"></div>',
                                      '</li>',
                                      '<li class="formLine"><label class="label">日历：</label>',
                                          '<div id="{cid}_label_container" class="element"></div>',
                                      '</li>',
                                      '<li class="formLine"><label class="label">提醒：</label>',
                                          '<div id="{cid}_remind" class="element">',
                                      '</li>',
                                      '<li class="formLine">',
                                           '<div id="{cid}_indentity"></div>',
                                      '</li>',
                                  '</ul>',
                             '</fieldset>',
                         '</form>',
                     '</div>',
                 '</div>'
            ].join(""),
            DialogTitle: "创建活动"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:37px; width:100%; z-index:1000;" class="blackbanner"></div>',
        config : {
            MAX_ADDR_SELECT: 20,
            MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人',
            DEFAULT_ACTIVITYNAME : "default_activityName"
        },
        logger : new top.M139.Logger({
            name : "M2012.Calendar.View.MyCalendar"
        }),
        initialize: function (options) {
            var that = this;
            options = options || {};
            this.master = options.master;
            this.labelId = options.labelId;
            this.render(options);
            // 设置作用域,必须使用,不然无法通过backbone的方式绑定事件
            this.$el = this.dialog.$el;
            this.model = new M2012.Calendar.Popup.Model.Activity(options);
            this.defineElement();
            this.initUIComponent();
            this.saveInitValue();
            this.bindEvent();

            this.model.getLabels({comeFrom : 0, actionType : 0}, function (detail, text) {
                that.labelComponent = new M2012.Calendar.View.LabelMenu({
                    target: that.labelContainerEl,
                    labels: detail['var'].userLabels
                });
                that.labelComponent.setData(that.labelId); // 回填刚创建的日历
            },function (detail) {
                console.error && console.error("Call detail getLabels: " + detail);
            })
        },
        defineElement : function () {
            var dialog = this.$el;
            this.tipDomEl = dialog.find("#" + this.cid + "_tip");
            this.labelNameEl = dialog.find("#" + this.cid + "_labelName");
            this.labelContainerEl = dialog.find("#" + this.cid + "_label_container");
            this.remindContainterEl = dialog.find("#" + this.cid + "_remind");
            this.dateContainterEl = dialog.find("#" + this.cid + "_dateComponent");
            this.activityNameEl = dialog.find("#" + this.cid + "_activityName");
            this.btnEl = dialog.find("div .boxIframeBtn").css("position", "relative");
        },
        /**
         * 1.给"添加参与人"的图标绑定点击事件
         * 2.给document绑定点击事件,关闭颜色选择器弹出窗口
         */
        bindEvent : function () {
            var that = this;
            // 提醒主题添加"focus"事件
            this.activityNameEl.bind("focus", function() {
                if ($.trim($(this).val()) === this.defaultValue) {
                    $(this).val("");
                }
            }).bind("blur", function () {
                if (!$.trim($(this).val())) {
                    $(this).val(this.defaultValue);
                }
            }).bind("keyup keydown change", function () {
                var activityName = $.trim($(this).val()),
                    maxLength = M2012.Calendar.Constant.lengthConfig.inputLength;
                if (activityName.length > maxLength) {
                    Validate.show('仅能输入' + maxLength + '个字', $(this));
                    $(this).val(activityName.substr(0, maxLength));
                }
            });
        },
        render : function () {
            var that = this,
                template = $T.format(that.template.activity, {
                    cid: that.cid
                });
            that.dialog = $Msg.showHTML(template,
                function(e){
                    e.cancel = true;
                    $(document.body).click(); // 点保存之前，先关闭掉弹出的窗口
                    that.submit(e);
                },{
                    name:"popup_createActivity_view",
                    width: "323px",
                    dialogTitle: that.template.DialogTitle,
                    buttons: ['保存', '取消'],
                    onClose : function () {
                        $(that.dialog.el).click();
                    }
                }
            );
        },
        initUIComponent : function () {
            var that = this;
            // 提醒插件
            this.remindComponent = new M2012.Calendar.View.Reminder({
                container: this.remindContainterEl,
                onChange : function (args) {
                    that.model.set("remindObj", args);
                }
            });
            // 调整提醒插件中元素的宽度,与UE原型页面上的保持一致
            this.remindComponent.getElement("remind_type").children(":first").css("width","92px");

            // 时间插件
            /**
            this.dateComponent = new M2012.Calendar.View.DateTimePicker2({
                container: this.dateContainterEl,
                onSelected : function (dateObj) {
                    console.log(dateObj);
                    that.model.set("dateObj", dateObj);
                }
            });*/
                // 创建新的时间选择控件
            this.dateComponent = new M2012.Calendar.View.DaytimePicker({
                master: that.master,
                container: this.dateContainterEl,
                onChange: function (obj) {
                    that.model.set("dateObj", obj);
                }
            });

            // 调整时间插件中元素的宽度,与UE原型页面上的保持一致
            //this.dateComponent.dayControl.getElement("date_input").css("width", "134px");
            this.dateContainterEl.children(":last").width("95px");
            // 验证码插件
            // 验证码
            this.identify = new M2012.Calendar.View.Identify({
                wrap: this.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });
            // 调整验证码控件的位置
            $(this.identify.getSelector("_input")).css("width", "90px");
            $(this.identify.getSelector("_wrap")).children(":first").removeClass("label");
        },
        saveInitValue : function () {
            // 保存默认的活动值
           this.model.set(this.config.DEFAULT_ACTIVITYNAME, this.activityNameEl.get(0).defaultValue);
        },
        //处理验证码
        accessIdentify: function (detail) {
            if (this.identify) {
                if ($Utils.getObjValue(detail.errorCode, Constant.IDENTIFY_CODES)) {
                    this.identify.handerError(detail.errorCode);
                } else {
                    this.identify.hide();
                }
            }
        },
        /**
         * 两个功能
         * 1.校验数据 2.调后台接口
         */
        save : function () {
        },
        cancel : function () {
            this.dialog.close();
        },
        hideTip : function () {
            this.tipDomEl.hide();
        },
        wrapParam : function () { // 封装需要传递的参数
            var setTime = $Date.format("yyyy-MM-dd hh:mm:ss", this.model.get("dateObj").datetime),// 时间数据
                labelObj = this.labelComponent ? this.labelComponent.getData() : {}; // 我的日历数据
            var remindObj = this.model.get("remindObj");
            var remindData =   {
                beforeType : remindObj.beforeType,
                beforeTime : remindObj.beforeTime,
                recMyEmail : remindObj.remindType== remindType.email.value ? 1 : 0,
                recMySms : remindObj.remindType == remindType.freeSms.value ? 1 : 0,
                recEmail: commonAPI.getUserEmail(),
                recMobile: commonAPI.getUserMobile(),
                enable : remindObj.enable
            };

            var param = {
                comeFrom : 0,
                /**
                dateFlag : dateObj.date,
                endDateFlag: dateObj.date,
                startTime: dateObj.time,
                endTime: dateObj.time,*/
                dtStart : setTime,
                dtEnd : setTime,
                calendarType : dateObj.calendarType,
                title : $.trim(this.activityNameEl.val()),
                validImg : this.identify.getData() || '' // 验证码
            };

            return $.extend(param, commonAPI.transform(remindData), labelObj);
        },
        submit : function (e) {
            var that = this;

            if (this.validate()) {
                var param = this.wrapParam();

                $(that.showMaskContent).insertBefore(that.btnEl.children(":first"));
                this.model.addCalendar(param, function (detail, text) {
                    if (detail.code == 'S_OK') {
                        top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                        that.cancel(); // 关闭
                        that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                    }else {
                        if (detail.errorCode === 999) { // 999的错误为异常错误, 直接报错给用户
                            top.M139.UI.TipMessage.show('创建失败', { className : "msgRed", delay: 3000 });
                            $(that.btnEl).children(":first").remove(); // 将遮罩层去掉
                            return;
                        }
                        var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                        info ? $Msg.alert(info) : that.accessIdentify(detail); // 无信息返回,暂时认为要输入验证码
                        $(that.btnEl).children(":first").remove();// 将遮罩层去掉
                    }
                }, function() {
                    console.error("submit failure");
                });
            }
        },
        validate : function () { // 校验数据
            var self = this,
                activityName = $.trim(self.activityNameEl.val());
            if (activityName === self.model.get(self.config.DEFAULT_ACTIVITYNAME)) {
                Validate.show('主题不能为空', self.activityNameEl);
                return false;
            }

            return true;
        }
    }));
})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Popup.Model.Activity", //M2012.Calendar.Model
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, _super.extend({
        name: _class,
        TIP_MSGS:{
            "isNotEmpty": "日历名称不能为空",
            "maxLength": "不能超过30个字"
        },
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * 直接使用新模板创建日历时需要调用的接口
         * @param data  调用接口需要传递的参数
         * @param fnSuccess 调用接口成功时的回调函数
         * @param fnError 调用接口异常时的回调函数(如网路异常问题)
         */
        getLabels: function (data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : "getLabels",
                master : this.master
            }, fnSuccess, fnError);
        },

        /**
         * 添加活动
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        addCalendar : function (data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : "addCalendar",
                master : this.master
            }, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);

﻿
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    M139.namespace("M2012.Calendar.Model.Meeting", Backbone.Model.extend({
        defaults: {
            defaultParams: {
                sendInterval: 0,
                comeFrom: 0,
                //calendarType: 10,
                week: "0000000"
            },
            defaultLabelId: 10, //我的日历
            beforeTypes: {
                "0": 1,             //提前为分钟
                "1": 60,            //提前为小时
                "2": 60 * 24,       //提前为天
                "3": 60 * 24 * 7    //提前为周
            },
            calendarType: {
                calendar: 10, //公历
                lunar: 20 //农历
            },
            datePattens: {
                NORMAL: "{yyyy}-{MM}-{dd}",
                EVERY_YEAR: "{MM}{dd}",
                EVERY_MONTH: "{dd}",

                //另一种传数字的方式
                "0": "{yyyy}-{MM}-{dd}",
                "1": "{MM}{dd}",
                "2": "{dd}"
            }
        },
        initialize: function (options) {
            this.api = M2012.Calendar.API;
            this.master = options.master;
        },
        callAPI: function (funcName, options) {
            this.api.request(funcName, options);
        },
        getLabels: function (callback) {
            var _this = this;
            var params = { actionType: 0 };
            callback = callback || $.noop;

            this.callAPI("calendar:getLabels", {
                data: params,
                success: function (result) {
                    _this.set("labels", result);

                    callback(result);
                },
                error: function () {
                    callback();
                }
            });
        },
        addCalendar: function (data, callback, onfail, onerror) {
            var params = this.get("defaultParams")//默认数据
            data = $.extend(data, params);

            this.callAPI("calendar:addCalendar", {
                data: data,
                success: function (data, json) {
                    if (data.code != "S_OK") {
                        onfail && onfail(data);
                    } else {
                        callback && callback(data, json);
                    }
                },
                error: onerror
            });
        },
        initCalendar: function (callback) {
            this.callAPI("calendar:initCalendar", {
                data: {},
                success: function (result) {
                    var data = result["var"] || {};
                    callback(data);
                },
                error: function () { callback(); }
            });
        },

        joinDate: function (obj, type) {
            var allPattens = this.get("datePattens");
            var patten = allPattens[type] || allPattens[0]; //为空则默认为NORMAL
            var commonApi = this.master.capi;
            return $T.format(patten, {
                yyyy: commonApi.padding(obj.year, 4),
                MM: commonApi.padding(obj.month, 2),
                dd: commonApi.padding(obj.day, 2)
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿

/**
 * 会议邀请合并在 cal_index_addLabel_async.html.pack.js 中
 * 因为添加日历的第二步,也有添加活动.也有通讯录联想等,减少js合并以及引用 
 */

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Calendar.View.Meeting', superClass.extend({
        template: {
            MAIN: ['<div>',
                     '<div>',
                        '<div class="meetSendscro">',
                         '<div class="meetSend">',
                             '<form>',
                             '<fieldset>',
                                 '<legend class="hide">表单作用</legend>',
                                 '<ul class="form meetsend-form">',
                                     //{cid}_select_label
                                     '<li id="{cid}_label_container" class="formLine">',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议主题：</label>',
                                         '<div class="element">',
                                             //{cid}_title_empty_tip
                                             '<div id="{cid}_title_empty_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议主题不能为空</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_title_input
                                             '<input id="{cid}_title_input" maxlength="{titleMaxLen}" class="iText" type="text">',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议内容：</label>',
                                         '<div class="element">',
                                             //{cid}_content_over_tip
                                             '<div id="{cid}_content_over_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议内容不能超过500个字</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_content_input
                                             '<textarea id="{cid}_content_input" class="iText tagarea"></textarea>',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议地点：</label>',
                                         '<div class="element">',
                                             //{cid}_pos_over_tip
                                             '<div id="{cid}_pos_over_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议地点不能超过100个字</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_location_input
                                             '<input id="{cid}_location_input" maxlength="{locationMaxLen}" class="iText" type="text">',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">开始时间：</label>',
                                         //{cid}_start_time
                                         '<div id="{cid}_start_time" class="element">',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">结束时间：</label>',
                                         //{cid}_end_time
                                         '<div id="{cid}_end_time" class="element">',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">&nbsp;</label>',
                                         '<div class="element">',
                                            //{cid}_all_day
                                            '<input id="{cid}_all_day" type="checkbox"><label for="{cid}_all_day" class="ml_5 mr_10">全天</label>',
                                            //{cid}_lunar_day
                                            '<input id="{cid}_lunar_day" type="checkbox"><label for="{cid}_lunar_day" class="ml_5">农历</label>',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">提醒自己：</label>',
                                         //{cid}_remind
                                         '<div id="{cid}_remind" class="element"> ',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         //{cid}_btnAddInvite
                                         '<p><a id="{cid}_btnAddInvite" href="javascript:void(0)">+添加其他参与人</a><span class="gray ml_5">该活动除了您在会议日历下共享的参与人外，还可以添加其他参与人</span></p>',
                                     '</li>',
                                 '</ul>',
                             '</fieldset>',
                         '</form>',
                         '</div>',
                            //{cid}_invite_div
                            '<div id="{cid}_invite_div" style="display:none;" class="tips meetform-tips">',
                                '<div class="tips-text">',
                                    '<div class="addpeowidth">',
                                        '<div class="p_relative" style="z-index:3;">',
                                            //{cid}_invite_input_container
                                            '<div id="{cid}_invite_input_container"></div>',
                                        '</div>',
                                        //{cid}_select_addr
                                        '<a id="{cid}_select_addr_link" href="javascript:void(0);" title="选择联系人" class="i_peo"></a>',
                                        //{cid}_invite_input
                                        //'<input id="{cid}_invite_input" class="iText" style="width:468px;" type="text" />',
                                    '</div>',
                                    //{cid}_invite_list_container
                                    '<div id="{cid}_invite_list_container"></div>',
                                    //{cid}_msg_content //使用短信通知参与人，会产生短信费用。
                                    '<p>',
                                        '<p>使用短信通知参与人，会产生短信费用。<br>',
                                            '<span id="{cid}_msg_content"></span>',
                                        '</p>',
                                    '</p>',
                                '</div>',
                                '<div class="tipsTop diamond"></div>',
                            '</div>',
                         '</div>',
                      '</div>',
                      //按钮区域
                      '<div class="boxIframeBtn">',
                         '<span class="bibText"></span>',
                         '<span class="bibBtn">',
                             //{cid}_loading
                             '<span id="{cid}_loading" class="spanImg hide" style="margin-right:20px"><img src="/m2012/images/global/load.gif" alt="加载中..." title="加载中,请稍候..."></span>',
                             //{cid}_submit
                             '<a id="{cid}_submit" href="javascript:void(0)" class="btnSure"><span>确 定</span></a> ',
                             //{cid}_submit_and_send
 					         '<a id="{cid}_submit_and_send" href="javascript:void(0)" style="position:relative; top:3px\0;" class="ml_10">',
   						        '<i class="i_m_n" style="height:14px\0;"></i>',
                                '<span class="ml_5">确定并发送会议材料</span>',
                             '</a>',
                         '</span>',
                     '</div>',
                    '</div>'].join(""),

            dialogTitle: "创建会议邀请"
        },
        keyMap: {
            ENTER: 13,
            SEMICOLON: ($.browser.mozilla || $.browser.opera) ? 59 : 186, //分号
            COMMA: 188 //逗号
        },
        configs: {
            MAX_TITLE_LEN: 100,
            MAX_COMMENT_LEN: 500,
            MAX_LOCATION_LEN:100,

            ERRORCODE: {
                FILTER_TITLE_RUBBISH: 126,
                FILTER_CONTENT_RUBBISH: 108,
                NEED_IDENTIFY: 910, //需要图片验证码
                FREQUENCY_LIMIT: 911 //频率超限
            },

            MESSAGES: {
                126: "添加的内容含敏感词，请重新输入",
                108: "添加的内容含敏感词，请重新输入",
                910: "您添加太频繁了，请稍后再试", //暂时先不提示验证码
                911: "您添加太频繁了，请稍后再试",

                BEFORE_TIME_NOW: "开始时间早于当前时间,会无法下发当天之前的提醒通知",

                MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人',

                TITLE_OVER_LENGTH: "不能超过100个字符",
                TITLE_EMPTY: '会议主题不能为空'
            },

            MAX_ADDR_SELECT:20
        },
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.master = options.master || window.$Cal;
            _this.model = new M2012.Calendar.Model.Meeting({ master: _this.master });

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                titleMaxLen: _this.configs.MAX_TITLE_LEN,
                commentMaxLen: _this.configs.MAX_COMMENT_LEN,
                locationMaxLen: _this.configs.MAX_LOCATION_LEN
            });

            _this.dialog = $Msg.showHTML(html, {
                name:"calendar_popup_addmeeting_view",
                width: "550px",
                dialogTitle: _this.template.dialogTitle,
                onClose: function () {
                    _this.invites.hideSuggest();
                    if (_this.options && _this.options.updateLabel == true) {
                        _this.refreshView();
                    }
                }
            });
        },
        initEvents: function () {
            var _this = this;
            var options = _this.options;
            var dialog = _this.dialog;
            var $dialogEl = dialog.$el;
            var config = _this.configs;

            //保存一堆自己都记不住的dom
            //#region 
            dialog.mainContainer = $dialogEl.find(".meetSendscro");
            dialog.labelContainer = $dialogEl.find(_this.getSelector("_label_container"));
            dialog.titleTip = $dialogEl.find(_this.getSelector("_title_empty_tip"));
            dialog.titleInput = $dialogEl.find(_this.getSelector("_title_input"));
            dialog.contentTip = $dialogEl.find(_this.getSelector("_content_over_tip"));
            dialog.contentInput = $dialogEl.find(_this.getSelector("_content_input"));
            dialog.locationTip = $dialogEl.find(_this.getSelector("_pos_over_tip"));
            dialog.locationInput = $dialogEl.find(_this.getSelector("_location_input"));
            dialog.startTimeContainer = $dialogEl.find(_this.getSelector("_start_time"));
            dialog.endTimeContainer = $dialogEl.find(_this.getSelector("_end_time"));
            dialog.cbAllDay = $dialogEl.find(_this.getSelector("_all_day"));
            dialog.cbLunarDay = $dialogEl.find(_this.getSelector("_lunar_day"));
            dialog.remindContainer = $dialogEl.find(_this.getSelector("_remind"));
            dialog.btnAddInvite = $dialogEl.find(_this.getSelector("_btnAddInvite"));
            dialog.inviteDiv = $dialogEl.find(_this.getSelector("_invite_div"));
            dialog.inviteTip = $dialogEl.find(_this.getSelector("_invite_tips"));
            //dialog.inviteInput = $dialogEl.find(_this.getSelector("_invite_input"));
            dialog.inviteInputContainer = $dialogEl.find(_this.getSelector("_invite_input_container"));
            dialog.linkSelectAddr = $dialogEl.find(_this.getSelector("_select_addr_link"));
            dialog.inviteListContainer = $dialogEl.find(_this.getSelector("_invite_list_container"));
            dialog.msgContainer = $dialogEl.find(_this.getSelector("_msg_content"));
            dialog.loading = $dialogEl.find(_this.getSelector("_loading"));
            dialog.btnSubmit = $dialogEl.find(_this.getSelector("_submit"));
            dialog.btnSubmitAndSend = $dialogEl.find(_this.getSelector("_submit_and_send"));
            
            //#endregion

            //#region 渲染对应组件

            dialog.titleInput.on("focus", function () {
                dialog.titleTip.hide();
            }).on("keyup", function () {
                var len = $(this).val().length;
                if (len == config.MAX_TITLE_LEN) {
                    dialog.titleTip.find(".tips-text").html(_this.configs.MESSAGES.TITLE_OVER_LENGTH);
                    dialog.titleTip.show();

                    //定时隐藏
                    if (dialog.titleTimer) clearTimeout(dialog.titleTimer);
                    dialog.titleTimer = setTimeout(function () {
                        dialog.titleTip.hide();
                    }, 2500);
                }
            });

            dialog.contentInput.on("keyup keydown", function () {
                //TODO 迟早会重构,先用CP+CV的方法搞定
                var text = $(this).val();
                if (text.length > config.MAX_COMMENT_LEN) {
                    dialog.contentTip.show();
                    $(this).val(text.substr(0, config.MAX_COMMENT_LEN));
                    //定时隐藏
                    if (dialog.contentTimer) clearTimeout(dialog.contentTimer);
                    dialog.contentTimer = setTimeout(function () {
                        dialog.contentTip.hide();
                    }, 2500);
                }
            });
            dialog.locationInput.on("keyup", function () {
                var text = $(this).val();
                if (text.length >= config.MAX_LOCATION_LEN) {
                    $(this).val(text.substring(0, config.MAX_LOCATION_LEN));
                    dialog.locationTip.show();

                    //定时隐藏
                    if (dialog.locationTimer) clearTimeout(dialog.locationTimer);
                    dialog.locationTimer = setTimeout(function () {
                        dialog.locationTip.hide();
                    }, 2500);
                }
            });

            //日历选择
            _this.label = new M2012.Calendar.View.LabelMenu({
                target: dialog.labelContainer,
                labels: options.labels,
                labelId: options.labelId,
                width: "466px"
            });

            //开始时间
            _this.startDateTime = new M2012.Calendar.View.DateTimePicker2({
                container: dialog.startTimeContainer,
                onSelected: function (obj) {
                    _this.model.set("startTimeObj", obj);
                }
            });

            //结束时间
            _this.endDateTime = new M2012.Calendar.View.DateTimePicker2({
                container: dialog.endTimeContainer,
                offset: 1, //再下一个30分钟的选项
                onSelected: function (obj) {
                    _this.model.set("endTimeObj", obj);
                }
            });

            //用来显示开始时间和结束时间的提示语
            _this.model.on("change:startTimeObj", function () {
                _this.checkTime();
            }).on("change:endTimeObj", function () {
                _this.checkTime();
            });

            //全天
            dialog.cbAllDay.on("click", function () {
                var fullday = $(this).attr("checked") ? true : false;
                var options = { fullday: fullday };
                _this.startDateTime.setType(options);
                _this.endDateTime.setType(options);
            });

            //农历
            dialog.cbLunarDay.on("click", function () {
                var lunar = $(this).attr("checked") ? true : false;
                var options = { lunar: lunar };
                _this.startDateTime.setType(options);
                _this.endDateTime.setType(options);
            });

            //提醒自己
            _this.remind = new M2012.Calendar.View.Reminder({
                container: dialog.remindContainer
            });

            //强DOM侵入,产品提的体验问题,只能改了
            var remind = $(dialog.remindContainer.selector);
            remind.find(".dropDown-tips").css({ "width": "131px" });
            remind.find(".dropDown-ymtime").removeClass("ml_10");
            //end

            //#endregion

            //#region 一堆组件的监听事件

            _this.model.set("isAddInvite", false); //默认不显示 添加其他参与人
            dialog.btnAddInvite.on("click", function () {
                var isshow = _this.model.get("isAddInvite");
                _this.model.set("isAddInvite", !isshow);
                if (isshow) {
                    //隐藏
                    dialog.inviteDiv.slideUp();
                } else {
                    //显示
                    dialog.inviteDiv.slideDown(250);
                    
                    //setTimeout(function () {
                    //    //滚动到最下面，如果比获取initCalendar接口快的话就不是最下面
                    //    dialog.mainContainer.scrollTop(dialog.mainContainer[0].scrollHeight + 50);
                    //    _this.invites.addrInput.focus();
                    //}, 500);

                    //请求短信接口
                    _this.getMsgFeeTip();

                    setTimeout(function () {
                        dialog.mainContainer.animate({ "scrollTop": 1000 }, function () {
                            _this.invites.addrInput.focus();
                        });
                    }, 0);
                }
            });

            //同时邀请别人
            _this.invites = new M2012.Calendar.UI.Invite.View({
                target: dialog.inviteListContainer,
                input: dialog.inviteInputContainer
            });

            //打开通讯录选择联系人
            if (window.ISOPEN_CAIYUN) {
                dialog.linkSelectAddr.remove();
            } else {
                var max = _this.configs.MAX_ADDR_SELECT;
                dialog.linkSelectAddr.on("click", function () {
                    var selectedAddr = _this.invites.getData();
                    var maxAddrCount = max - (selectedAddr.length || 0); //最大的可选数量
                    var addrView = top.M2012.UI.Dialog.AddressBook.create({
                        filter: "email",
                        //items: _this.invites.getEmails(),
                        maxCount: maxAddrCount
                    }).on("select", function (e) {
                        var items = e.value;
                        _this.invites.addData(items); //添加到列表中
                    }).on("additemmax", function () {
                        top.$Msg.alert($T.format(_this.configs.MESSAGES.MSG_INVITE_MAX, {
                            max: max
                        }));
                    });
                });
            }

            dialog.btnSubmit.on("click", function (e) {
                _this.onSubmitClick();
            });
            
            //如果是彩云，没的发邮件
            if (window.ISOPEN_CAIYUN) {
                dialog.btnSubmitAndSend.remove();
            } else {
                dialog.btnSubmitAndSend.on("click", function (e) {
                    _this.onSubmitClick({ sendMail: true });
                });
            }

            //#endregion

            try {
                //至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top < 0) {
                        $dialogEl.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        getMsgFeeTip: function () {
            var _this = this;
            var feeData = _this.model.get("fee");
            if (!feeData) {
                _this.model.initCalendar(function (data) {
                    _this.model.set("fee", data);
                    _this.dialog.msgContainer.html(data.freeInfo);
                });
            }
        },
        checkTime: function () {
            var _this = this;
            var startDate = _this.model.get("startTimeObj") || {},
                endDate = _this.model.get("endTimeObj") || {};

            var isshow = false;
            //简单点用字符串比
            if ((endDate.date < startDate.date) || //结束日期小于开始日期
                (endDate.date == startDate.date && endDate.time < startDate.time)) { //日期相同，时间不同
                isshow = true;
            }

            if (isshow) {
                _this.startDateTime.showTip();
            } else {
                _this.startDateTime.hideTip();
            }
            return isshow;
        },
        isTimeBefore:function(params){
            var _this = this;
            var startDate = _this.model.get("startTimeObj");

            if (!params.enable) return false; //没勾选提醒

            //#region 以下计算提前时间
            var date = new Date(startDate.datetime.getTime()); //复制，不修改原来的
            var beforeType = params.beforeType,
                beforeTime = params.beforeTime;
            var beforeMinutes = 0; //提前的时间,全部折算回分钟
            var beforeTypeData = _this.model.get("beforeTypes"); //数据原型
            if (beforeTypeData[beforeType]) {
                beforeMinutes = beforeTime * beforeTypeData[beforeType]; //折算回提前多少分钟
            }
            beforeMinutes = date.getMinutes() - beforeMinutes; //实际的提前时间
            date.setMinutes(beforeMinutes);
            //#endregion

            if (date <= new Date()) {
                return true;
            }
            return false;
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        onSubmitClick: function (options) {
            var _this = this;
            options = options || {};

            //if (_this.busy) {
            //    _this.alert = top.$Msg.alert("处理中，请稍候...");
            //    return;
            //}

            var dialog = _this.dialog;
            var title = dialog.titleInput.val();

            if ($.trim(title) == "") {
                _this.dialog.mainContainer.animate({ "scrollTop": 0 });
                _this.dialog.titleTip.find(".tips-text").html(_this.configs.MESSAGES.TITLE_EMPTY);
                _this.dialog.titleTip.show();
                M139.Dom.flashElement(dialog.titleInput.selector);
                setTimeout(function () {
                    _this.dialog.titleTip.hide();
                }, 3000);
                return;
            }

            var calTypes = _this.model.get("calendarType");

            //获取对象或者dom的值
            var labelObj = _this.label.getData();
            var content = dialog.contentInput.val(),
                location = dialog.locationInput.val();
            var startDateObj = _this.startDateTime.getData(),
                endDateObj = _this.endDateTime.getData();
            var fullday = dialog.cbAllDay.attr("checked") ? true : false;
            var calendarType = dialog.cbLunarDay.attr("checked") ? calTypes.lunar : calTypes.calendar;
            var remindObj = _this.remind.getData();
            var invites = [];
            if (_this.model.get("isAddInvite")) {
                invites = _this.invites.getData();
            }

            //拼参数
            var params = {
                calendarType: calendarType, //日历类型

                title: title.substr(0, _this.configs.MAX_TITLE_LEN),
                content: content.substr(0, _this.configs.MAX_COMMENT_LEN),
                site: location.substr(0, _this.configs.MAX_LOCATION_LEN),

                labelId: labelObj.labelId,
                color: labelObj.color,

                beforeTime: remindObj.beforeTime,
                beforeType: remindObj.beforeType,
                recMyEmail: remindObj.recMyEmail,
                recMySms: remindObj.recMySms,
                enable: remindObj.enable,

                //dateFlag: startDateObj.date,
                //endDateFlag: endDateObj.date,
                //startTime: startDateObj.time,
                //endTime: endDateObj.time,

                dtStart: startDateObj.sdatetime,
                dtEnd: endDateObj.sdatetime,
                untilDate: endDateObj.date,
                allDay: 0,

                inviteInfo: invites
            };

            //全天事件，修正时间
            if (fullday) {
                var enddate = new Date(endDateObj.datetime.getTime());
                enddate.setDate(enddate.getDate() + 1); //全天.日期加1

                $.extend(params, {
                    //startTime: "0800",
                    //endTime: "2359",
                    dtStart: startDateObj.date + " 00:00:00",
                    dtEnd: M139.Date.format("yyyy-MM-dd", enddate) + " 00:00:00",
                    allDay: 1
                });
            }

            var isTimeAllow = _this.checkTime();
            if (isTimeAllow) return; //时间区间选择不正确

            if (_this.isTimeBefore(params)) { //比当前时间早，提示
                top.$Msg.confirm(_this.configs.MESSAGES.BEFORE_TIME_NOW, function () {
                    _this.addMeetingEvent(params, options.sendMail);
                });
                return;
            }

            //if (calendarType == calTypes.lunar) {
            //    //农历，换成农历的时间。
            //    //WARN: 此段要放在isTimeBefore时间比较之后，因为比较时间是用的公历
            //    var startDate = _this.model.joinDate(startDateObj.lunar),
            //        endDate = _this.model.joinDate(endDateObj.lunar);

            //    params = $.extend(params, {
            //        dateFlag: startDate,
            //        endDateFlag: endDate
            //    });
            //}

            //为解决闰月的问题，加上公历的真实时间
            params = $.extend(params, {
                realDate: startDateObj.date,
                realEndDate: endDateObj.date
            });

            _this.addMeetingEvent(params, options.sendMail);
        },
        toggleLoading:function(){
            var dialog=this.dialog,
                btnSubmit=dialog.btnSubmit,
                btnSubmitAndSend=dialog.btnSubmitAndSend,
                loading=dialog.loading;

            btnSubmit.toggleClass("hide");
            btnSubmitAndSend.toggleClass("hide");
            loading.toggleClass("hide");
        },
        addMeetingEvent: function (params, isSendMail) {
            var _this=this;

            _this.toggleLoading();

            _this.model.addCalendar(params, function (result) {
                //_this.alert && _this.alert.close();

                if (isSendMail == true) {
                    var emails = _.map(params.inviteInfo, function (item) {
                        return item.email || item.recEmail || item.inviterUin; //随便找一个有邮箱的
                    });

                    top.$App.show("compose", null, {
                        inputData: {
                            receiver: emails,
                            subject: params.title,
                            content: '附上“' + $T.Html.encode(params.title) + '”的会议材料，请查收附件！'
                        }
                    });

                    _this.dialog.close();

                    _this.refreshView();
                    return false;
                }

                _this.dialog.close();
                _this.refreshView();
                //BH('calendar_addinvite_succeed');
                _this.master && _this.master.capi.addBehavior("calendar_addinviteact_success"); // 行为日志ID
                return false;
            }, function (json) {
                var code = json && json.errorCode;
                var msgList = _this.configs.MESSAGES;

                var msg = msgList[code];

                if (msg) {
                    top.$Msg.alert(msg);
                }
                //_this.busy = false;

                _this.toggleLoading();
            }, function () {
                //_this.busy = false;
                _this.toggleLoading();
            });
        },
        refreshView: function () {
            //$Cal && $Cal.trigger($Cal.EVENTS.NAVIGATE, { path: "mainview/refresh" });
            //M2012.Calendar.CommonAPI.getInstance().updateMainView();
            top.M139.UI.TipMessage.show("创建成功", { delay: 3000 });
			$Cal && $Cal.trigger("master:navigate", { path: "view/update" });
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
; (function (jQuery, _, M139, top) {
    var className = "M2012.Calendar.Model.BlackWhiteList";
    M139.namespace(className, Backbone.Model.extend({
        defaults: {
            blackList: [],
            whiteList:[]
        },
        initialize: function (options) {
            this.api = M2012.Calendar.API;
        },
        callAPI: function (funcName, data, callback, onfail, onerror) {
            var _this = this;
            data = $.extend({
                comeFrom: 0 //加上默认来源
            }, data);

            var param = {
                data: data,
                success: function (responseObj, responseText) {
                    if (responseObj && responseObj.code != "S_OK") {
                        onfail && onfail(responseObj);
                    } else {
                        callback && callback(responseObj["var"], responseObj);
                    }
                },
                error: onerror
            };

            _this.api.request(funcName, param);

            //this.api(funcName, data,
            //    function (response,json) { //success
            //        if (typeof callback == 'function') {
            //            callback(response);
            //        }
            //    }, function (code, json) { //onfail, eg. code or resultcode incorrect
            //        _this.trigger("onfail");
            //        if (typeof onfail == 'function') {
            //            onfail(json);
            //        }
            //    }, function () { //onfail, eg. response is null or empty
            //        _this.trigger("onerror");
            //        if (typeof onerror == 'function') {
            //            onerror();
            //        }
            //    });
        },

        //#region 黑白名单

        //新增黑白名单
        addBlackWhiteItem: function (data, callback) {
            this.callAPI("calendar:addBlackWhiteItem", data, callback);
        },
        //删除黑白名单
        delBlackWhiteItem: function (data, callback) {
            if (typeof data == 'string') data = { uin: data };
            this.callAPI("calendar:delBlackWhiteItem", data, callback,callback);
        },
        //获取黑白名单项
        //@param {Array} uins 需要删除的uin数组
        getBlackWhiteItem: function (uins, callback) {
            if (typeof data == 'string') data = { uin: uins.join(",") };
            this.callAPI("calendar:getBlackWhiteItem", data, callback,callback);
        },
        //获取黑白名单列表
        getBlackWhiteList: function (callback) {
            var _this = this;
            _this.callAPI("calendar:getBlackWhiteList", {}, function (result, json) {
                var data = {};
                if (result) {
                    data = {
                        blacklist: result.black || [],
                        whitelist: result.white || []
                    };

                    _this.set("blacklist", data.blacklist);
                    _this.set("whitelist", data.whitelist);
                }
                callback(data);
            });
        }

        //#endregion
    }));
})(jQuery, _, M139, window._top || window.top);
﻿

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var master = window.$Cal;

    M139.namespace('M2012.Calendar.View.BlackWhiteList', superClass.extend({
        template: {
            dialogTitle: "日历黑白名单管理",
            BLACK_TEXT: "黑名单",
            WHITE_TEXT: "白名单",
            ERROR_TEXT: "获取黑白名单失败，请稍后再试",

            MAIN: ['<div class="bw-name">',
                        '<ul>',
                            '<li id="whiteTitle" data-type="whiteitems"><a href="javascript:void(0)">日历白名单</a></li>',
                            '<li id="blackTitle" data-type="blackitems"><a href="javascript:void(0)">日历黑名单</a></li>',
                        '</ul>',
                    '</div>',
                    '<div id="popup_white_list" class="bw-text hide">',
                        '<p>添加别人为白名单，可以自动<span class="ml_5 mr_5 c_009900">接受</span>TA给您发送的所有日历消息请求。</p>',
                        '<p class="mt_5"><a id="addwhitelist" data-type="whitelist" href="javascript:void(0)">+添加白名单</a></p>',
                        '{whiteListHtml}', //白名单列表
                    '</div>',
                    '<div id="popup_black_list" class="bw-text">',
                        '<p>添加别人为黑名单，可以自动<span class="ml_5 mr_5 red">屏蔽</span>TA给您发送的所有日历消息请求。</p>',
                        '<p class="mt_5"><a id="addblacklist" data-type="blacklist" href="javascript:void(0)">+添加黑名单</a></p>',
                        '{blackListHtml}', //黑名单列表
                    '</div>'].join(""),
            LIST_TEMPLATE: ['<div class="bw-table">',
                                '<div class="bw-table-t">',
                                    '<div data-type="tips" class="tips meet-tips hide">',
                                        '<div class="tips-text">请先选择</div>',
                                        '<div class="tipsBottom diamond"></div>',
                                    '</div>',
                                    '<input data-cmd="selectAll" class="mr_5" type="checkbox"><label class="mr_5" for="">全选</label>',
                                    '<a data-cmd="deleteSelected" data-type="{type}" href="javascript:void(0)">删除</a>',
                                '</div>',
                                '<div class="bw-table-ul">',
                                    '{itemList}', //黑白名单列表
                                '</div>',
                            '</div>'].join(""),
            ITEM: '<div class="bw-table-li"><input class="mr_5" type="checkbox" data-type="item" data-uin="{uin}"><label for="">{name}&lt;{email}&gt;</label></div>'
        },
        types:{
            blacklist: {
                TEXT: "黑名单",
                KEY: "blacklist",
                type: 2,
                emptyHtml: '<div class="bw-empty">黑名单为空</div>'
            },
            whitelist: {
                TEXT: "白名单",
                KEY: "whitelist",
                type: 1,
                emptyHtml: '<div class="bw-empty">白名单为空</div>'
            }
        },
        /**
         * 黑白名单弹窗
         * @param {String} options.type 默认展开的类型,默认为白名单,可选参数: whitelist/blacklist
         * @example
         * new M2012.Calendar.Popup.BlackWhiteList.View();
         *
         *
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            _this.defaultType = _this.types[options.type] || _this.types.whitelist;//默认打开白名单,除非有设定
            _this.master = options.master;

            _this.model = new M2012.Calendar.Model.BlackWhiteList({ master: _this.master });

            //监听一些失败的情况
            _this.listenOnError();

            _this.model.getBlackWhiteList(function (data) {
                _this.render();
            });
        },
        listenOnError: function () {
            var _this = this;
            var model = _this.model;

            model.on("onfail,onerror", function () {
                top.M139.UI.TipMessage.show(_this.template.ERROR_TEXT, { delay: 3500, className: "msgRed" });
                _this.busy = false;
            });
        },
        render: function () {
            var _this = this;
            var model = _this.model;
            var template = _this.template;

            var whitelist = model.get("whitelist"),
                blacklist = model.get("blacklist");
            var whiteListHtml = _this.joinHtml(whitelist, _this.types.whitelist);
            var blackListHtml = _this.joinHtml(blacklist, _this.types.blacklist);

            var dialogHtml = $T.format(template.MAIN, {
                whiteListHtml: whiteListHtml,
                blackListHtml: blackListHtml
            });

            _this.dialog = $Msg.showHTML(dialogHtml,
                {
                    width: '480px',
                    dialogTitle: template.dialogTitle
                });

            _this.initEvents();
        },
        initEvents: function () {
            var _this = this;
            var $dialogEl = _this.dialog.$el;
            var dialog = _this.dialog;

            //保存元素
            dialog.li = $dialogEl.find("#whiteTitle,#blackTitle");
            dialog.whitelist = $dialogEl.find("#whiteTitle");
            dialog.blacklist = $dialogEl.find("#blackTitle");

            dialog.allList = $dialogEl.find("#popup_white_list,#popup_black_list");
            dialog.add = $dialogEl.find("#addwhitelist,#addblacklist");

            dialog.whiteitems = $dialogEl.find("#popup_white_list");
            dialog.blackitems = $dialogEl.find("#popup_black_list");

            //标签切换
            dialog.li.off("click").on("click", function (e) {
                dialog.li.removeClass("on");
                var li = $(this);
                li.addClass("on");

                //显示对应列表的内容
                var type = li.attr("data-type");
                dialog.allList.addClass("hide");
                dialog[type].removeClass("hide");
            });

            //添加黑白名单按钮点击
            dialog.add.off("click").on("click", function (e) {
                var type = $(this).attr("data-type");
                dialog.close();

                new M2012.Calendar.View.AddBlackWhite({
                    type: type,
                    closeClick: function (e) {
                        //TODO 显示黑白名单，等于new一个自己的实例
                        new M2012.Calendar.View.BlackWhiteList({ master: master, type: type });
                    }
                });
            });

            $dialogEl.find(".bw-table").off("click").on("click", function (e) {
                var sender = $(e.target);
                var container = sender.closest(".bw-table");
                var cmd = sender.attr("data-cmd"),
                    type = sender.attr("data-type");
                if (cmd) {
                    _this[cmd](container, type);
                }
            });

            //dialog.whiteTitle.trigger("click"); //显示白名单
            dialog[_this.defaultType.KEY].trigger("click"); //根据参数显示黑白名单

            ////极端情况，至少看到标题栏，起码可以关掉弹窗
            try {
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top <= 0) {
                        $dialogEl.css("top", 10);
                    }
                }, 250);
            }
            catch (e) { }
        },
        joinHtml: function (obj, currentType) {
            var _this = this;
            var itemTemplate = _this.template.ITEM;
            var html = '';
            if (obj && obj.length > 0) {
                var lists = '';
                $(obj).each(function (i, item) {
                    lists += $T.format(itemTemplate, {
                        name: $T.Html.encode(item.name),
                        email: $T.Html.encode(item.email),
                        uin: item.uin
                    });
                });
                html = $T.format(_this.template.LIST_TEMPLATE, {
                    itemList: lists,
                    type: currentType.KEY
                });
            } else {
                html = currentType.emptyHtml;
            }
            return html;
        },
        deleteSelected: function (container,type) {
            var _this = this;

            var chkList = container.find("input[data-type='item']:checked");
            var uins = [];
            chkList.each(function (i, item) {
                uins.push($(this).attr("data-uin"));
            });

            if (uins.length > 0) {
                _this.model.delBlackWhiteItem({
                    uin: uins.join(",")
                }, function (result, json) {
                    chkList.parent().remove();

                    //为空就要显示空白
                    if (container.find("input[data-type='item']").size() == 0) {
                        var currentType = _this.types[type];
                        container.after(currentType.emptyHtml);
                        container.remove();
                    }
                });
            } else {
                var tips = container.find("div[data-type='tips']");
                tips.removeClass("hide");

                if (_this.timer) {
                    clearTimeout(_this.timer);
                    _this.timer = null;
                }

                _this.timer = setTimeout(function () {
                    tips.addClass("hide");
                }, 1500);
            }
        },
        selectAll: function (container) {
            var _this = this;

            var checked = !!(container.find("input[data-cmd='selectAll']").attr("checked"));
            container.find("input[data-type='item']").attr("checked", checked); //全选
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    window.SiteConfig = window.SiteConfig || top.SiteConfig;
    M139.namespace('M2012.Calendar.View.AddBlackWhite', superClass.extend({
        template: {
            ERROR_TEXT: "添加失败，请稍后再试",

            MAIN: ['<div class="bw-text">',
                        '{tips}',
                        '<div class="saddpeowidth">',
                            '<div id="emptyTips" class="tips meet-tips hide">',
                                '<div class="tips-text">邮箱地址不能为空</div>',
                                '<div class="tipsBottom diamond"></div>',
                            '</div>',
                            '<input id="txtEmail" class="iText" type="text">',
                        '</div>',
                        '<p class="gray mt_10">添加多个139邮箱地址时，以分号隔开</p>',
                        '<div id="errorTips"></div>',
                    '</div>'].join(""),
            EMAIL_FORMAT_ERR: '<p class="red mt_10">邮件地址格式错误，如abc@139.com</p>'
        },
        types: {
            whitelist: {
                dialogTitle: "添加白名单",
                text: "白名单",
                tips: '<p>添加别人为白名单，可以自动<span class="ml_5 mr_5 c_009900" style="color: green;">接受</span>TA给您发送的所有日历消息请求。</p>',
                errorTips: '<p class="c_009900 mt_10">邮件地址已存在白名单内</p>',
                type: "1" //白名单标记位
            },
            blacklist: {
                dialogTitle: "添加黑名单",
                text: "黑名单",
                tips: '<p>添加别人为黑名单，可以自动<span class="ml_5 mr_5 red">屏蔽</span>TA给您发送的所有日历消息请求。</p>',
                errorTips: '<p class="c_009900 mt_10">邮件地址已存在黑名单内</p>',
                type: "2"
            }
        },
        /**
         * 黑白名单弹窗
         * @param {String} options.type 显示的类型，表示添加黑名单还是白名单，可选：blacklist/whitelist
         * @param {String} options.email 邮件地址，例如: 张三<zhangsan@139.com>
         * @example
         * new M2012.Calendar.View.AddBlackWhite({type:"whitelist"});
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};

            _this.model = new M2012.Calendar.Model.BlackWhiteList();

            _this.currentType = _this.types[options.type] || _this.types.whitelist;
            _this.render();
        },
        render: function () {
            var _this = this;
            var template = _this.template;

            var dialogHtml = $T.format(template.MAIN, {
                tips: _this.currentType.tips
            });

            _this.dialog = $Msg.showHTML(dialogHtml,
                function (e) {
                    //确定
                    e.cancel = true; //点击确定时不关闭，等回调完成时再处理
                    _this.onConfirmClick(e);
                },
                function (e) {
                    //取消
                },
                {
                    width: '480px',
                    dialogTitle: _this.currentType.dialogTitle,
                    buttons: ['确定', '取消'],
                    onClose: function (e) {
                        _this.options.closeClick && _this.options.closeClick(e);
                    }
                });

            _this.initEvents();
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;

            var $dialogEl = _this.dialog.$el;

            //保存元素
            _this.dialog.errorTips = $dialogEl.find("#errorTips");
            _this.dialog.emptyTips = $dialogEl.find("#emptyTips");
            _this.dialog.input = $dialogEl.find("#txtEmail");
            _this.dialog.confirm = $dialogEl.find(".YesButton");

            _this.dialog.input.on("focus", function (e) {
                _this.dialog.emptyTips.addClass("hide");
            }).on("keyup", function (e) {
                if (e.keyCode == 13) {//Enter
                    _this.dialog.confirm.trigger("click");
                }
            });

            if (_this.options.email) {
                _this.dialog.input.val(_this.options.email);
            }
        },
        onConfirmClick: function (e) {
            var _this = this;

            if (_this.busy) {
                $Msg.alert("正在处理中，请稍后...");
                return;
            }

            var inputs = _this.dialog.input.val().replace("/\s/gi", "");
            if (inputs) {
                inputs = inputs.replace(/[,，;；]/gi, ";");
                var emails = inputs.split(";");
                var list = [];
                $(emails).each(function (i, item) {
                    if (item == '') return true; //下一个

                    if (_this.isLocalDomain(item)) {
                        list.push($T.Email.getEmail(item));
                    } else {
                        _this.dialog.errorTips.html(_this.template.EMAIL_FORMAT_ERR);
                        return false;
                    }
                });

                if (list.length == 0) {
                    _this.dialog.errorTips.html(_this.template.EMAIL_FORMAT_ERR);
                    return;
                }

                var params = {
                    type: _this.currentType.type,
                    email: list.join(",")
                };

                _this.busy = true; //标记繁忙
                _this.model.addBlackWhiteItem(params, function (result, json) {
                    _this.busy = false; //标记繁忙
                    //弹出提示框，提示某些邮箱添加失败
                    if (result && result.error && result.error.length > 0) {
                        new M2012.Calendar.View.ErrorList({
                            list: result.error,
                            onClose: function () {
                                _this.options.closeClick && _this.options.closeClick();
                            }
                        });
                        _this.dialog.close({ silent: true });
                        return;
                    }

                    //创建成功，关闭窗口，并打开黑白名单的窗口
                    _this.dialog.close();
                });
            } else {
                _this.dialog.emptyTips.removeClass("hide");
                M139.Dom.flashElement(_this.dialog.input.selector);
                _this.dialog.input.focus();
                return;
            }
        },
        isLocalDomain: function (email) {
            var domain = (window.SiteConfig && SiteConfig.mailDomain) || "139.com";
            return $T.Email.getDomain(email) == domain;
        }
    }));

    M139.namespace('M2012.Calendar.View.ErrorList', superClass.extend({
        template: {
            ERROR_TEXT: "添加失败，请稍后再试",

            MAIN: ['<div class="bw-text">',
                        '<p>以下邮箱地址未注册</p>',
                        '<div class="bw-table">',
                            '<div class="bw-table-t">邮箱地址</div>',
                            '{errorList}',
                        '</div>',
                    '</div>'].join(""),
            ERROR_ITEM: '<div class="bw-table-li">{email}</div>'
        },
        /**
         * 显示添加时的错误列表
         * @param {Array} options.list 错误的邮件列表(list中的数据为对象)
         * @param {Function} options.onClose 关闭按钮的回调
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            if (!options.list) return;

            _this.list = options.list;
            _this.onClose = options.onClose || function () { };

            _this.render();
        },
        render: function () {
            var _this = this;
            var html = _this.joinHtml();
            $Msg.showHTML(html, {
                width: "480px",
                onClose: function () {
                    _this.onClose();
                },
                buttons:["确定"]
            })
        },
        joinHtml: function () {
            var _this = this;
            var template = _this.template;
            var listHtml = '';
            $(_this.list).each(function (i, item) {
                listHtml += $T.format(template.ERROR_ITEM, {
                    email: $T.Html.encode(item.email)
                });
            });

            var html = $T.format(template.MAIN, {
                errorList: listHtml
            });
            return html;
        }
    }));
})(jQuery, _, M139, window._top || window.top);
