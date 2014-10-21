/**
 * @fileOverview 设置》账户页主方法
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.Account.Main', Backbone.Model.extend({
        defaults: {
            ImageUrl: "",   //头像地址，更新完头像后要更新这个
            userName: "",
            email: "",
            mobile: "",
            birthday: "",

            /* 以下为隐私设置 */
            //  0，询问；1，总是同意；2，总是忽略
            privacy: 0,     //帐号隐私
            AddrFirstName: 0,
            FamilyEmail: 0,
            MobilePhone: 0,
            BirDay: 0
        },
        status: {
            updateSuccess: "0",
            usernameError: "24577",
            emailError: "81",
            phoneError: "80",

            SUCCESS: "S_OK",
            PARTIAL: "S_PARTIAL",
            FAILURE: "FS_FAILURE"
        },
        resultMsg: {
            /* 通讯录接口返回的错误信息 */
            userName: "fail to modify the real name for cmail user",
            email: "the field value is not email format",
            phone: "the field value is not mobile format",

            userNameTip: "发件人姓名有误",
            emailTip: "邮件地址有误",
            phoneTip: "手机号码有误",
            ERR_EMAIL: "邮箱格式不正确，应如：zhangsan@139.com",
            ERR_MOBILE: "手机号码有误",
            unknownError:"未知错误"
        },
        /** 账户设置页
         *@constructs M2012.Settings.Model.Account.Main
        */
        initialize: function () {
            var _this = this;
        },
        htmlDecode: function (text) {
            return parent.$T.Xml.decode(text);
        },
        htmlEncode: function (text) {
            return parent.$T.Xml.encode(text);
        },
        /**
        *更新用户头像信息,初始化完成后执行回调
        */
        initData: function (callback) {
            var This = this;
            var htmlDecode = This.htmlDecode;
            var status = This.status;

            /* 默认报文 */
            var respData = {
                "code": status.FAILURE,
                "var": {}
            };
            /* 先获取账户信息 */
            top.M2012.Contacts.getModel().getUserInfo(null, function (result) { //null参数是无用的。但接口如此
                var code = result.code;
                var data = result["var"];
                if (code == status.SUCCESS) {
                    This.set({
                        ImageUrl: data.ImageUrl,
                        userName: htmlDecode(data.AddrFirstName || ""),   //用户名
                        email: htmlDecode(data.FamilyEmail || ""),        //用户邮箱
                        mobile: htmlDecode(data.MobilePhone || ""),       //手机
                        birthday: data.BirDay           //生日
                    });

                    This.set({ originalUserInfo: data });

                    /* 获取用户隐私设置 */
                    top.M2012.Contacts.getModel().getPrivateSettings(function (result) {
                        
                        if (result.code == status.SUCCESS) {
                            var data = result["var"];
                            var userSettings = data.UserInfoSetting;

                            var whoAddMe = Number(data.addMeRule);

                            if (whoAddMe < 0) {
                                whoAddMe = 1; //小于零是后台未读取到值，要显示缺省值 1 总是同意
                            }

                            This.set({
                                "privacy": whoAddMe,                            //账户隐私
                                "AddrFirstName": userSettings.AddrFirstName,    //姓名隐私设置
                                "FamilyEmail": userSettings.FamilyEmail,        //邮件隐私设置
                                "MobilePhone": userSettings.MobilePhone,        //手机
                                "BirDay": userSettings.BirDay,                  //生日
                                "UserInfoSetting": userSettings                 //此处仅保存用户设置，在更新时从这里取内容
                            });

                            respData.code = status.SUCCESS;
                            if (callback && typeof (callback) == "function") {
                                callback(respData);
                            }
                        }
                        else {
                            if (callback && typeof (callback) == "function") {
                                respData.code = status.PARTIAL; //部分成功
                                callback(respData);
                            }
                        }
                    });
                } else {
                    //获取失败，不处理,或者后期的日志上报
                    callback(respData);
                }
            });
        },
        /**
        *更新用户隐私设置
        */
        updatePrivacy: function (callback) {
            /* 更新隐私设置 */
            var This = this;
            var rule = parseInt(This.get("privacy")) || 0;
            var userSettings = This.get("UserInfoSetting");
            var privacyData = {
        //        "WhoAddMeSetting": rule, 帐户安全中帐号隐私需要隐藏
                "UserInfoSetting": userSettings
            };

            top.M2012.Contacts.getModel().updatePrivateSettings(privacyData, function (result) {
                callback(result);
            });
        },
        /**
        *更新用户账户信息
        */
        updateUserInfo: function (postData, callback) {
            var This = this;

            //检查邮箱和手机是否符合规范
            var checkResult = { code: "FA_ERROR", msg: null };
            var ErrMsgs = This.resultMsg,
                email = This.get("email"),
                mobile = This.get("mobile");
            if (email && !top.$Email.isEmail(email)) {
                checkResult.code = "ER_EMAIL_INVALID";
                checkResult.msg = ErrMsgs.ERR_EMAIL;
                callback(checkResult);
                return;
            }
            if (mobile && !top.$Mobile.isMobile(mobile)) {
                checkResult.code = "ER_MOBILE_INVALID";
                checkResult.msg = ErrMsgs.ERR_MOBILE;
                callback(checkResult);
                return;
            }
            //检查邮箱和手机是否符合规范 end

            var status = This.status;
            var htmlEncode = This.htmlEncode;
            var data = {
                "code": status.FAILURE,
                "var": {}
            };
            /* 更新账户信息 */
            if (!postData) {
                //未提供默认的提交数据，则提交所有数据
                var birthday = This.get("birthday");
                postData = {
                //    "ImageUrl": This.get("ImageUrl"),上传的时候已经设置好图片
                    "AddrFirstName": This.get("userName"),
                    "FamilyEmail": htmlEncode(This.get("email")),
                    "MobilePhone": htmlEncode(This.get("mobile"))
                };
                if (birthday) {
                    postData["BirDay"] = birthday;
                }
            }

            top.ModUserInfoResp = undefined; //先清空返回值,获取返回值后的eval会重新赋值
            top.M2012.Contacts.getModel().modifyUserInfo(postData, function (result) {
                var respData = top.ModUserInfoResp;
                var resultMsg=This.resultMsg;
                if (respData && respData.ResultCode) {
                    if (respData.ResultCode == status.updateSuccess) {
                        data.code = status.SUCCESS;

                    } else if (respData.ResultCode == status.usernameError || respData.resultMsg == resultMsg.userName) {
                        data.msg = resultMsg.userNameTip;
                    }
                    else if (respData.ResultCode == status.emailError || respData.resultMsg == resultMsg.email) {
                        data.msg = resultMsg.emailTip;
                    }
                    else if (respData.ResultCode == status.phoneError || respData.resultMsg == resultMsg.phone) {
                        data.msg = resultMsg.phoneTip;
                    }
                    else {
                        data.msg = resultMsg.unknownError;
                    }
                } else {
                    data.msg = resultMsg.unknownError;
                }
                callback(data);
            });
        },
        update: function (callback) {
            var This = this;
            var status = This.status;
            This.updateUserInfo(null, function (result) {
                if (result.code == status.SUCCESS) {
                    This.updatePrivacy(function (result) {
                        callback(result);
                    });
                }
                else {
                    callback(result);
                }
            });
        }
    })
    );
})(jQuery, _, M139);