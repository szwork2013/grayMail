
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