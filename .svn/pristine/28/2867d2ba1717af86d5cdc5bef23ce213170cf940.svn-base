/**
 * @fileOverview 定义账号管理所需公共代码
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.AccountAdmin', Backbone.Model.extend({
        accountTypes: {
            NO_ALIAS_ACCOUNT: 'noAliasAccount', // 没有邮箱账号
            NO_MOBILE_ACCOUNT: 'noMobileAccount', // 没有手机账号
            HAS_ALL_ACCOUNT: 'hasAllAccount'// 两种账号都有
        },
        accountType: '',
        defaultMobileValue: '支持移动、联通、电信手机', // 手机号码输入框默认值
        defaultAliasValue: '例:bieming', // 手机号码输入框默认值
        SENDMSG_INTERVAL: 60,
        tipMessage: {
            SEND_PASSWORDSUC: '短信验证码已发送至您的手机：{0}',
            SEND_PASSWORDFAI: '获取短信验证码失败！',
            MOBILE_FORMATERROR: '请输入合法的手机号码！',
            MOBILE_LENGTHRROR: '请输入11位手机号码！',
            MOBILE_AVAILABLE: '该手机号码可用！',
            MOBILE_INVAILABLE: '该手机号码不可用！',
            LACK_MOBILE: '请输入您的手机号码！',
            LACK_PASSWORD: '请输入您的邮箱密码！',
            LACK_CHECKCODE: '请输入您的短信验证码！',
            CHECKCODE_FORMATERROR: '请输入合法的短信验证码！',
            BIND_MOBILEFAI: '手机号码绑定失败！',
            ERROR_PASSWORD: '您的密码输入有误，请重新输入！',
            MOBILE_EXIST: '该手机号码已注册139邮箱，请更换号码重新绑定！',

            MSG_SEND_FAILURE: "系统繁忙，请稍后再试",
            MSG_SENT: "验证码已发送",
            MSG_WAIT_TEXT: "秒后可重新获取",
            MSG_DEFAULT_TEXT: "获取短信验证码",
            MSG_RESEND_TEXT: "重新获取短信验证码",

            ACCOUNT_TEXT: "邮箱帐号"
        },
        responseCode: {
            FA_NEWPHONE_REGISTTED: "FA_NEWPHONE_REGISTTED",
            FA_OLDPHONE_CHANGING: "FA_OLDPHONE_CHANGING",
            FA_OLDPHONE_TOLIMITED: "FA_OLDPHONE_TOLIMITED",
            FA_NEWPHONE_TOLIMITED: "FA_NEWPHONE_TOLIMITED",
            FA_NEWPHONE_CHANGING: "FA_NEWPHONE_CHANGING",
            FA_OLDPHONE_EMPTY: "FA_OLDPHONE_EMPTY",
            FA_NEWPHONE_EMPTY: "FA_NEWPHONE_EMPTY",
            S_6: "-6",
            S_9: "9",
            S_OK: "S_OK",
            S_ERROR: "ERROR",
            FA_PWD_ERROR: "FA_PWD_ERROR",
            FA_PWD_EMPTY: "FA_PWD_EMPTY",
            FA_IS_NOT_PHONE: "FA_IS_NOT_PHONE",
            FA_SEND_ERROR: "FA_SEND_ERROR",
            FA_Frequency_Limited: "FA_Frequency_Limited",
            FA_SMS_EMPTY: "FA_SMS_EMPTY",
            FA_PWD_EXPIRE: "FA_PWD_EXPIRE",
            FA_SMS_OVERFLOW: "FA_SMS_OVERFLOW",
            FA_SMS_UNPASS: "FA_SMS_UNPASS",
            FA_CHANGE_FAIL: "FA_CHANGE_FAIL"
        },
        responseMsg: {
            FA_NEWPHONE_REGISTTED: '此号码已注册139邮箱，不能进行绑定',
            //S_3020 : '老号码正在进行的换号号码不能进行换号',
            FA_OLDPHONE_CHANGING: '正在为您绑定手机号码，绑定成功后您将收到短信通知，请注意查收。',
            FA_OLDPHONE_TOLIMITED: '老号码换号次数达到当月上限',
            FA_NEWPHONE_TOLIMITED: '该号码绑定次数达到当月上限',
            FA_NEWPHONE_CHANGING: '该号码正在进行绑定',
            FA_OLDPHONE_EMPTY: '旧手机号码不能为空',
            FA_NEWPHONE_EMPTY: '手机号码不能为空',
            S_6: '别名或手机号码不存在，请重新输入',
            S_9: '非中国移动手机号码',
            S_OK: '绑定手机号码成功',
            //S_ERROR : '业务ID不存在，非法登陆',
            S_ERROR: '请先获取短信验证码，并输入正确的验证码',
            FA_PWD_ERROR: '密码错误，请重新输入',
            FA_PWD_EMPTY: '密码不能为空，请输入密码',
            FA_IS_NOT_PHONE: '请输入11位的手机号码',

            FA_SEND_ERROR: '短信验证码发送错误',
            FA_Frequency_Limited: '发送频率受限制',
            FA_SMS_EMPTY: '请输入短信验证码',
            FA_PWD_EXPIRE: '短信验证码已超过30分钟，请重新获取',
            FA_SMS_OVERFLOW: '短信验证码输错三次，请重新获取',
            FA_SMS_UNPASS: '短信验证码输入错误，请重新输入',

            FA_CHANGE_FAIL: '绑定失败，请稍后再试'
        },
        callApi: M139.RichMail.API.call,
        verifyNumberData: {// 验证号码是否可用的请求报文格式
            newNumber: '',
            password: ''
        },
        changeNumberData: {// 绑定手机号码的请求报文格式
            transId: '',
            smsValidateCode: '',
            checkServiceItem: '0015'
        },
        initialize: function () {
            this.accountList = [];
            this.accountType = '';
            this.initData();
        },
        initData: function () {
            var self = this;
            var user = parent.$User;
            if (user.isChinaMobileUser()) {
                self.tipMessage.ACCOUNT_TEXT = "别名帐号";
            }
            if (user) {
                try {
                    var accountList = [];
                    var accounts = user.getAccountList() || [];
                    var hasAliasAccount = false, hasMobileAccount = false;
                    for (var i = 0, aLen = accounts.length; i < aLen; i++) {
                        var account = accounts[i];
                        if (account.type == 'fetion') {
                            account.index = 0;
                            account.text = '飞信帐号';
                        }
                        if (account.type == 'passid') {
                            account.index = 3;
                            account.text = '通行证帐号';
                        };
                        if (account.type == 'mobile') {
                            account.index = 1;
                            account.text = '手机帐号';
                            hasMobileAccount = true;
                        }
                        if (account.type == 'common') {
                            account.index = 2;
                            account.text = self.tipMessage['ACCOUNT_TEXT'];
                            hasAliasAccount = true;
                        }
                        accountList.push(account);
                    }
                    self.accountList = accountList;
                    if (!hasAliasAccount) {
                        self.accountType = self.accountTypes['NO_ALIAS_ACCOUNT'];
                    } else if (!hasMobileAccount) {
                        self.accountType = self.accountTypes['NO_MOBILE_ACCOUNT'];
                    } else {
                        self.accountType = self.accountTypes['HAS_ALL_ACCOUNT'];
                    }
                } catch (e) {
                    e.cancel = true;
                }
            }
        },
        /** 验证手机号码
        *@param {Object} options 初始化参数集
        *@param {String} options.oldNumber 邮箱别名
        *@param {String} options.newNumber 新手机
        *@param {String} options.passwordType 1（原密码）或2（短信密码）
        *@param {String} options.password 密码
        *@param {String} options.verfiyCode 图片验证码 
        *@param {Function} callback 回调
        */
        verifyNumber: function (options, callback) {
            this.callApi("user:checkPhoneAction", options, function (response) {
                console.log(response);
                if (callback) {
                    callback(response.responseData);
                }
            });
        },
        /** 绑定手机号码
        *@param {Object} options 初始化参数集
        *@param {String} options.transId 事物ID
        *@param {String} options.checkServiceItem 业务ID(0010/0015/0016/0017)
        *@param {String} options.smsValidateCode 短信验证码
        *@param {Function} callback 回调
        */
        bindMobile: function (options, callback) {
            this.callApi("user:bindPhoneAction", options, function (response) {
                console.log(response);
                //response.responseData = {code : 'S_OK'};
                if (callback) {
                    callback(response.responseData);
                }
            });
        },
        fail: function (errObj) {
            this.set({ "serverexception": errObj });
        }
    })
  );

})(jQuery, _, M139);