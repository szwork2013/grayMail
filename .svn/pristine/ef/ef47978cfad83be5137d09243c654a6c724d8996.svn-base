

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