/**
    * @fileOverview 定义设置页基本参数的文件.
*/


(function (jQuery, _,  M139) {

    /**
        *@namespace 
        *设置页基本参数
    */
    M139.namespace('M2012.Settings.Preference.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Preference.Model.prototype
    */
        {
        defaults: {
            preference_letters: 50,
			_custom_pageStyle: 1,
            preference_reply_title: null,
            preference_reply: null,
            preference_receipt: null,
            mailsizedisplay: 0,
            mailcontentdisplay: 0,
            auto_replay_status: null,
            auto_replay_content: null,
            auto_forward_status: null,
            flag: null,
            auto_forward_addr: "",
            auto_forward_bakup: 0,
            smtpsavesend: null,
            auto_replay_starttime: null,
            auto_replay_endtime: null,
            list_layout: null,
            onlineTipsTypes: ['ad', 'online', 'login', 'mail'],
            popMailForDate: 0,//POP时按时间收取邮件,0默认收取全部，1表示收取100天以内的邮件
            popStatusChange:false,//POP按时间和按文件夹收取的选项是否有变化
            defalutText:null,
            popFolderStatus:null

        },
        anchor: {
            clearFolders: { id: "clearFolders", url: "clearFolders" },
			forwardSet: { id: "forwardSet", url: "forwardSet" }
        },
        callApi: M139.RichMail.API.call,
        messages: {
            defaultAutoReplayCon: "您的来信已收到，我会尽快回信。",
            serverBusy: "服务器繁忙，请稍后再试。",
            saved: "您的设置已保存",
            mailAddrError: "请输入正确的邮箱地址（例：example@139.com）",
            timeError: "自动回复的时间段结束时间必须大于起始时间",
            operateFailed: "操作失败",
            autoReplayNull: "自动回复的内容不能为空",
            forwardMailError: "转发用户不能填写自己的邮箱地址",
            forwardMailNull: "转发邮箱地址不能为空",
            autoReplyContentMax: "自动回复内容大小超过限制！"
        },
        /**
        *获取基本参数接口getAttrs的数据
        */
        getPreference: function (callback) {
            var options = {
                attrIds: [
                    ]
            }
            $RM.getAttrs(options, function (result) {
                callback(result);
            });
        },
        savaData: function (arr, callback) {//appsvr序列化接口user:setAttrs mbox:updateFolders mbox:setUserFlag mbox:getAllFolders
            this.callApi("global:sequential", {
                items: arr
            }, function (res) {
                callback(res.responseData)
            });
        },
        forwardVerify:function(arr,callback) {
             this.callApi("user:forwardVerify", {
                mailaddr: arr,
                type:1,
                filterId:1
            }, function (res) {
                callback(res.responseData)
            });

        },

        updateFolders: function (obj,callback) {//webapp接口，无法序列化，单独请求,设置文件夹是否可收取
            this.callApi("mbox:updateFolders2", obj, function (res) {
                callback(res.responseData)
            });
        }
    })
    );

    })(jQuery, _, M139);