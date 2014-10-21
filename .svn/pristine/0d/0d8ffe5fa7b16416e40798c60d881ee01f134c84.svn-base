/**
    * @fileOverview 定义设置页账户Model层的文件.
*/


(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页账户Model层
    */
    M139.namespace('M2012.Settings.Account.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Account.Model.prototype
    */
        {
        defaults: {
            defaultText: null,
            getTitle: [],
            Atitle: [],
            keyId: null,
            noSign: "不使用", //没有电子签名的时候显示的文字
            title: null,
            content: null,
            isDefault: 0,
            isAutoDate: 0,
            opType: null, //1 添加   2  修改   3 删除
            ImageUrl: null,
            newData: null,
            obj: null,
            num: 100,
            vcardCon: null, //接口里电子名片的content
            type: 0,
            signData: null,
            isMax: false//邮件签名是否达到最大个数3个
        },
        anchor: {
            sign: { id: "areaSign", url: "sign" },
            lock: { id: "areaSafeLock", url: "lock" },
            accountAdmin: { id: "accountAdminContainer", url: "accountAdmin" },
            basePersonalInfo: { id: "info_account", url: "basePersonalInfo" },
            userInfo: { id: "userInfo", url: "userInfo" }
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        messages: {
            successEdit: "电子名片编辑成功",
            signMaxNum: "邮件签名数量已达上限",
            entryName: "请输入联系人姓名",
            mailNull: "请输入常用邮箱",
            mobileNull: "请输入常用手机",
            mailError: "常用邮箱地址格式不正确，请重新输入",
            mobileError: "手机号码格式不正确，请重新输入",
            phoneError: "请输入正确的电话号码",
            zipcodeError: "请输入正确的邮政编码",
            nameExsit: "该签名标题已经存在",
            editVcardError: "编辑电子名片失败，请重试",
            signTitleNull: "签名的标题不能为空",
            signContentNull: "签名的内容不能为空",
            signContentMax: "签名内容不超过5000个字符或者2500个汉字",
            noFolderToLock: "您没有可加锁的文件夹",
            cancelSsoOrder: "取消授权成功"
        },

        initialize: function (options) {
            if (options) {
                this.set({
                    originalUserInfo: options.originalUserInfo
                });
            }
        },
      loadResource: function (url, callback) {
            var elem = null;
            elem = document.createElement("script");
            elem.charset = "utf-8";
            elem.src = url;
            elem.defer = true;

            if (document.all) {
                elem.onreadystatechange = function () {
                    if (elem.readyState == "loaded" || elem.readyState == "complete") {
                        if (callback) callback();
                    }
                }
            } else {
                elem.onload = function () {
                    if (callback) callback();
                }
            }
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(elem);
        },
       /**
        *获取接口返回的邮件签名数据
        */
        getSignatures: function (callback) {
            $RM.getSignatures(function (result) {
                callback(result["var"]);
            });
        },
        /**
        *获取接口返回的邮件签名数据
        */
        setSignatures: function (callback) {
            var self = this;
            var options = {
                opType: this.get("opType"),
                id: this.get("keyId"),
                title: this.get("title"),
                content: this.get("content"),
                isHtml: 1,
                isDefault: this.get("isDefault"),
                isAutoDate: this.get("isAutoDate"),
                isSMTP: 0,
                type: this.get("type")
            }
            $RM.setSignatures(options, function (result) {
                callback(result);
                self.getSignatures(function (data) {
                    top.$App.registerConfig("SignList", data);
                });
            });
        },
        /**
        *获取接口返回的邮件签名数据
        */
        delSignatures: function (callback) {
            var options = {
                opType: 2,
                id: this.get("keyId")
            }
            $RM.setSignatures(options, function (result) {
                callback(result);
            });
        }
    })
    );

})(jQuery, _, M139);




