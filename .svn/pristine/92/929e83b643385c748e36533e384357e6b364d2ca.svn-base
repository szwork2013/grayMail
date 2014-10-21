(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.AndAddr.ContactInfo.Model", Backbone.Model.extend({
        /*defaults: {
            pic: '', //头像
            firstName: '', //用户姓名
            mobilePhone: '', //手机
            familyEmail: '', //邮箱
            workEmail: '', //工作邮箱
            fax: '', //传真
            fetion: '', //飞信
            webSite: '', //网站
            address: '', //地址
            birthday: '', //生日
            position: '', //职位
            remark: '', //备注
            group: '' //分组
        },
        initialize: function () {
            
        },*/
        getDataSource: function (callback) {
            this.queryUserInfo(function (result) {
                var userInfo = {};
                var data = result.responseData;
                if (data.code == 'S_OK') {
                    userInfo = data['var'];
                    //userInfo = { "id": "6450603840", "name": "<script>alert(1);</script>", "familyName": "黄曦", "givenName": "", "nickName": "", "gender": "", "company": "彩讯", "department": "平台", "position": "工程师", "email": ["huangxi@richinfo.cn"], "workMail": "", "homeMail": "", "otherMail": "", "mobile": ["13517648234", "13517649682", "13800138000", "13800138001", "13800138002"], "workMobile": ["13888888888"], "homeMobile": "", "iphone": "", "otherMobile": "", "tel": "", "workTel": "", "homeFax": "", "fax": ["135162123"], "otherFax": "", "workFax": ["1231311231"], "otherTel": "", "homeTel": "", "carTel": "", "homeAddress": "中国广东广州南山区", "companyAddress": "中国广西梧州", "birthday": ["1999-05-01"], "anniversary": ["2014-06-20"], "website": ["www.baidu.com"], "companyWebsite": "", "homeWebsite": "", "otherWebsite": ["www.operw.com", "www.trewe.com"], "qq": ["8123123", "2342342341"], "fetion": ["876232123", "1231312312"], "msn": ["saada@124.com"], "note": ["我就是我"], "groupMap": { "105439104": "测试分组", "105439": "组" } };
                } else {
                    top.console.log("获取用户信息失败！result.code:"
                        + data.errorCode + ", summary:" + data.summary);
                }
                //console.log(userInfo);
                callback && callback(userInfo);
            });
        },
        queryUserInfo: function (callback) {
            var api = "andAddr:readContactDetail";
            var data = {
                contactId: $Url.queryString("contactId")
            };
            var url = top.$Url.makeUrl(api, data);    

            top.M2012.Contacts.API.call(url, {}, function(result) {
                callback(result);
            });
        }
    }));
})(jQuery, Backbone, _, M139);
