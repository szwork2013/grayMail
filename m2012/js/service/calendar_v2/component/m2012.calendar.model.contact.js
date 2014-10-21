; (function ($, _, M139, top) {

    var supperClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Contact";

    M139.namespace(_class, supperClass.extend({

        name: _class,
        master: null,
        defaults: {
            //是否显示"添加参与人主题"
            showTitle: true,
            //是否展示联系人输入区域
            canInvite: false,
            //是否有联系人信息
            hasContact: false,
            //是否显示状态列
            showStatus: false,
            //是否显示短信资费提示信息
            showFreeInfo: false,
            //短信套餐说明信息
            freeInfo: "",
            //是否仅仅是139邮箱联系人
            isOnly139: false,

            actionType: 0,
            emailNotify: 1,
            inviteAuth: 2,
            inviterUin: "",
            name: "",
            recEmail: "",
            recMobile: "",
            refuseResion: "",
            shareType: 2,
            shareUin: "",
            smsNotify: 0,
            status: 0
        },

        /**
         *  联系人信息实体
         *  @param {Object}  args.master //视图主控
        **/
        initialize: function (args) {
            var self = this;
            self.master = args.master || window.$Cal;

            self.initEvents();
            //用传入的参数初始化数据模型
            self.initData(args);

            supperClass.prototype.initialize.apply(self, arguments);
        },

        /**
      *  用传入的参数初始化数据模型
      *  @param {Object}  args //联系人相关信息
     **/
        initEvents: function () {
            var self = this;

            //监控显示资费提醒标示，用以下载资费提示信息
            self.on("change:showFreeInfo", function () {

                if (!self.get("showFreeInfo"))
                    return;

                self.initCalendar(function (args) {
                    var freeInfo = args && args.freeInfo ? args.freeInfo : "";
                    self.set({
                        freeInfo: freeInfo
                    });
                });
            });
        },

        /**
         *  用传入的参数初始化数据模型
         *  @param {Object}  args //联系人相关信息
        **/
        initData: function (args) {
            var self = this;

            if (_.isEmpty(args)) {
                return;
            }

            //对比每一个键值，键值和数据类型相同则更新
            for (var key in args) {
                if (!_.has(self.attributes, key)) {
                    continue;
                }
                if (typeof self.get(key) === typeof args[key]) {
                    var data = {};
                    data[key] = args[key];
                    self.set(data);
                }
            }
        },

        /**
         *  联系选择控件
         *  @param {String}  email //邮件地址
        **/
        isDefaultSender: function (email) {
            var self = this;
            var accounts = M2012.Calendar.Model.Contact.getCurrUserAccounts();
            return _.contains(accounts, email);
        },

        /**
         *  获取联系人实体信息
         *  @param {Object}  args //联系人
         */
        getContact: function (args) {
            var self = this;
            var data = $.extend(self.getObject(args), {
                master: self.master
            });
            return new M2012.Calendar.Model.Contact(data);
        },

        /**
         *  结合通讯录获取完善的联系人信息
         *  @param {Object or String}  obj //联系人信息或联系人邮件地址
        **/
        getObject: function (obj) {
            obj = obj || {};
            var self = this;
            var type = $.type(obj);

            switch (type) {
                //如果只传一个email地址过来则需要转化为对象
                case "string":
                    obj = {
                        email: $T.Email.getEmail(obj),
                        emailNotify: 1,
                        smsNotify: 0
                    };
                    break;
                case "object":
                    var domain = self.master.capi.getEmailDomain();
                    var email = obj.recEmail || 'undefined@' + domain;
                    obj.email = $T.Email.getEmail(email);
                    break;
            }

            if (!obj.email)
                return null;

            var contactInfo = self.getContactInfo(obj.email) || {};
            return {
                shareUin: obj.email,
                inviterUin: obj.email,
                recEmail: obj.email,
                smsNotify: obj.smsNotify || 0,
                emailNotify: obj.emailNotify || 0,
                // 新增,邀请活动的状态
                status: obj.status || 0,
                // 拒绝原因,用于拒绝别人邀请的活动(默认为空串)
                refuseResion: obj.refuseResion || "",
                recMobile: contactInfo.mobile || "",
                name: contactInfo.name || "",
                actionType: 0,
                shareType: 2,
                inviteAuth: 2
            };
        },

        /**
         *  过滤模型数据，返回指定的邀请信息
        **/
        filterData: function () {
            var self = this;
            var data = self.toJSON();

            return {
                actionType: data.actionType || 0,
                emailNotify: data.emailNotify || 0,
                inviteAuth: data.inviteAuth || 2,
                inviterUin: data.inviterUin || "",
                name: data.name || "",
                recEmail: data.recEmail || "",
                recMobile: data.recMobile || "",
                refuseResion: data.refuseResion || "",
                shareType: data.shareType || 2,
                shareUin: data.shareUin || "",
                smsNotify: data.smsNotify || 0,
                status: data.status || 0
            }
        },

        /**
         *  结合通讯录信息，通过邮件地址获取联系人信息
         *  @param {String}  email //邮件地址
         **/
        getContactInfo: function (email) {
            var _this = this;
            var mobile = "";
            var name = "";

            if (!window.ISOPEN_CAIYUN) { //TODO 先做邮箱内的
                var contactInfo = top.Contacts.getContactsByEmail(email);

                if (contactInfo && contactInfo.length > 0) {
                    mobile = contactInfo[0].MobilePhone;
                    name = contactInfo[0].AddrFirstName
                }

                // 产品要求,要么有手机号,要么就根据输入的邮件地址判断是否手机号
                // 这个最原始的添加日历页面中也是这样的逻辑,迁移过来先
                var domain = _this.master.capi.getEmailDomain();
                var userMobile = mobile || ($Email.getDomain(email) == domain ? $Email.getName(email) : "");
                userMobile = $Mobile.isChinaMobile(userMobile) ? userMobile : "";
            }
            return {
                mobile: userMobile,
                name: name
            };
        },

        /**
         * 根据邀请状态值获取状态信息
         * @param {Number} status   //邀请状态
        **/
        getStatusDesc: function (status) {
            switch (status) {
                case 0:
                    return "未回复";
                case 1:
                    return "已接受";
                case 2:
                    return "已谢绝";
                case 3:
                    return "已删除";
                default:
                    return "未回复";
            }
        },

        /**
         * 判断邮箱地址是否是139邮箱地址
         * @param {String} email //邮箱地址
        **/
        checkIs139Mail: function (email) {
            var self = this;

            if (!self.get("isOnly139"))
                return true;

            var domain = self.master.capi.getEmailDomain();
            return $Email.getDomain(email) == domain;
        },

        /**
         * 初始化日历,获取联系人控件中的短信赠送信息
         * @param {Function} fnSuccess   //执行成功后的处理函数
         * @param {Function} fnError     //执行失败后的处理函数
        **/
        initCalendar: function (fnSuccess, fnError) {
            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.initCalendar({
                        data: { comeFrom: 0 },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);
                            } else {
                                var msg = "获取日历初始化信息失败 ";
                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {
                            var msg = "获取日历初始化信息失败 ";
                            fnError && fnError(msg);
                            self.logger.error(msg);
                        }
                    });
                }

            });
        }

    }, {

        /**
         *  获取当前用户的所有账号信息
         */
        getCurrUserAccounts: function () {
            var accounts = [];

            //先获取用户的账号列表
            if (!window.ISOPEN_CAIYUN) {
                var mailList = top.$User.getAccountList() || [];
                accounts = _.map(mailList, function (item) {
                    return item.name;
                });
            }
            return accounts;
        }
    }));

    (function () {

        var base = Backbone.Collection;
        var current = "M2012.Calendar.Collection.Contact";

        M139.namespace(current, base.extend({

            name: current,

            /**
             *  联系人集合
             *  @param {Object}  master //日历视图主控
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master || window.$Cal;

                base.prototype.initialize.apply(self, arguments);
            },

            /**
             *  是否存在指定联系人
             *  @param {Sting}  email //联系人邮件地址
            **/
            isExist: function (email) {
                var self = this;
                var exist = false;

                email = $T.Email.getEmail(email);

                $.each(self.models, function (i, model) {
                    if (model.get("recEmail") === email) {
                        exist = true;
                        return false;
                    }
                });
                return exist;
            },

            /**
             *  获取所有联系人信息
             *  @return {Array}   //联系人信息集合
            **/
            toArray: function () {
                var self = this;
                var data = [];
                //需要将实体中的数据进行过滤，只返回后台需要的字段
                $.each(self.models, function (i, model) {
                    data.push(model.filterData());
                });
                return data;
            }


        }));

    })();


}(jQuery, _, M139, window._top || window.top));



