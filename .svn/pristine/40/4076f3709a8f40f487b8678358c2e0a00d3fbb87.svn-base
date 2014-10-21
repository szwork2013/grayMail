;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;

    /**
     *
     * @type {String}
     * @private
     */
    var _class = "M2012.Calendar.Model.API";
    M139.namespace(_class, M139.Model.ModelBase.extend({

        name: _class,
        defaults: {},
        EVENTS: {},

        initialize: function () {
            superClass.prototype.initialize.apply(this, arguments);
            var _this = this;
        },

        request: function (api, options) {
            function success(result) {
                if (result.status == 200) {
                    if (_.isFunction(options.success)) {
                        options.success.call(options, result.responseData, result.responseText);
                    }
                } else {
                    if (_.isFunction(options.error)) {
                        options.error.apply(options, arguments);
                    }
                }
            }

            var _options = _.extend({
                error: function (err) {
                    if (_.isFunction(options.error)) {
                        options.error.apply(options, arguments);
                    }
                }
            }, options);

            top.$RM.call(api, $.extend(options.data, {
                comeFrom: top.isCaiyun ?
                    M2012.Calendar.Constant.caiyunComeFrom :
                    M2012.Calendar.Constant.comeFrom
            }), success, _options);
        },

        //#region 标签管理

        //新建标签
        addLabel: function (args) {
            this.request("calendar:addLabel", args);
        },
        //修改标签
        updateLabel: function (args) {
            this.request("calendar:updateLabel", args);
        },
        //删除标签
        deleteLabel: function (args) {
            this.request("calendar:deleteLabel", args);
        },
        //取消标签共享
        deleteLabelShare: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:deleteLabelShare", args);
        },
        //取消标签共享
        setLabelUpdateNotify: function (args) {
            this.request("calendar:setLabelUpdateNotify", args);
        },

        //订阅者设置活动变更通知方式
        setSubLabelUpdateNotify: function (args) {
            this.request("calendar:setSubLabelUpdateNotify", args);
        },
        //根据主键查询用户标签
        getLabelById: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:getLabelById", args);
        },
        //查询用户标签列表
        getLabels: function (args) {
            if (typeof data == 'string') data = { actionType: data };
            this.request("calendar:getLabels", args);
        },
        //处理日历共享请求
        processShareLabelInfo: function (args) {
            this.request("calendar:processShareLabelInfo", args);
        },
        //#endregion

        //#region 日程管理

        //初始化信息
        initCalendar: function (args) {
            this.request("calendar:initCalendar", args);
        },
        //添加活动
        addCalendar: function (args) {
            this.request("calendar:addCalendar", args);
        },
        //更新活动
        updateCalendar: function (args) {
            this.request("calendar:updateCalendar", args);
        },
        //被邀请人设置个性化提醒时间
        setCalendarRemind: function (args) {
            this.request("calendar:setCalendarRemind", args);
        },
        //批量添加生日提醒
        addBirthdayCalendar: function (args) {
            this.request("calendar:addBirthdayCalendar", args);
        },
        //删除/取消日程
        delCalendar: function (args) {
            this.request("calendar:delCalendar", args);
        },
        //日程列表查询
        getCalendarListView: function (args) {
            this.request("calendar:getCalendarListView", args);
        },
        //日程视图查询
        /**
         * @param args {Object} 请求参数
         * @param args.data {Object} 需要Post到服务器的参数
         * @param args.success {Function} 需要Post到服务器的参数
         * @param args.error {Function} 需要Post到服务器的参数
         * @param args.data.startDate {String} 开始时间,如2013-11-01
         * @param args.data.endDate {String} 可选参数,结束时间,如2013-11-30
         * @param args.data.includeLabels {String} 可选参数,包含的日历Id,多个实用逗号分割
         * @param args.data.includeTypes {String} 可选参数,包含类型Id,多个使用逗号分割
         * @param args.data.maxCount {Int} 可选参数,每天活动详情的最大的数量
         */
        getCalendarView: function (args) {
            this.request("calendar:getCalendarView", args);
        },
        //日程详细信息查询
        getCalendar: function (args) {
            this.request("calendar:getCalendar", args);
        },
        //查询日程总数
        getCalendarCount: function (callback) {
            this.request("calendar:getCalendarCount", {}, callback);
        },

        getDefaultWeather: function (args) {

            this.request("weather:getDefaultWeather", args);
        },

        //取消邀请关系(即关闭)活动
        cancelInvited: function (args) {
            this.request("calendar:cancelInvitedInfo", args);
        },

        //更新邀请信息状态
        updateInviteStatus: function (args) {
            this.request("calendar:updateInviteStatus", args);
        },

        //附件上传地址获取
        getNormalUploadUrl: function (args) {
            if (typeof data == 'string') data = { returnUrl: data };
            this.request("calendar:getNormalUploadUrl", args);
        },
        //附件下载地址获取
        getDownloadUrl: function (args) {
            if (typeof data == 'string') data = { fileId: data };
            this.request("calendar:getDownloadUrl", args);
        },
        //附件上传（由服务器去下载附件的情况）
        uploadFile: function (args) {
            if (typeof data == 'string') data = { downloadUrls: data };
            this.request("calendar:uploadFile", args);
        },
        //添加邮件待处理日程
        addMailCalendar: function (args) {
            this.request("calendar:addMailCalendar", args);
        },
        //更新邮件待处理日程
        updateMailCalendar: function (args) {
            this.request("calendar:updateMailCalendar", args);
        },
        //邮件待处理日程查询
        getMailCalendar: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:getMailCalendar", args);
        },
        //邮件待处理删除/取消日程
        delMailCalendar: function (args) {
            this.request("calendar:delMailCalendar", args);
        },

        /**
         * 获取某天的黄历详情
         */
        getHuangliData: function (args) {
            args.onrouter = function (route) {
                route.addRouter("calendar", ["calendar:getHuangliData"]);
            };
            this.request("calendar:getHuangliData", args);
        },

        shareCalendar: function (args) {
            args = args || {};
            this.request("calendar:shareCalendar", args);
        },

        //#endregion

        //#region 黑白名单

        //新增黑白名单
        addBlackWhiteItem: function (args) {
            this.request("calendar:addBlackWhiteItem", args);
        },
        //删除黑白名单
        delBlackWhiteItem: function (args) {
            if (typeof data == 'string') data = { uin: data };
            this.request("calendar:delBlackWhiteItem", args);
        },
        //获取黑白名单项
        getBlackWhiteItem: function (args) {
            if (typeof data == 'string') data = { uin: data };
            this.request("calendar:getBlackWhiteItem", args);
        },
        //获取黑白名单列表
        getBlackWhiteList: function (args) {
            this.request("calendar:getBlackWhiteList", args);
        },

        //#endregion

        //#region 消息盒子

        //获取消息盒子未读数量
        getMessageCount: function (args) {
            this.request("calendar:getMessageCount", args);
        },
        /**
          * 获取消息盒子列表
          * @param args {Object} 请求参数
          * @param args.pageIndex {Int} 页数,默认为1
          * @param args.pageSize {Int} 每页数量
          * @param args.type {Int} 消息类型: 1表示邀请,2表示共享
          * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
          * @param args.error {Function} 接口请求失败时的回调
          */
        getMessageList: function (args) {
            this.request("calendar:getMessageList", args);
        },
        /**
         * 查看消息（根据消息ID获取消息实体） 
         * @param args.data {Int} 消息ID
         * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
         * @param args.error {Function} 接口请求失败时的回调
         */
        getMessageById: function (args) {
            args = args || {};
            if (typeof args.data == 'number') args.data = { messageId: args.data };
            this.request("calendar:getMessageById", args);
        },
        /**
         * 删除消息 
         * @param args.data {Object,Int,Array} 消息ID
         * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
         * @param args.error {Function} 接口请求失败时的回调
         */
        delMessage: function (args) {
            args = args || {};
            if (typeof args.data == 'number') args.data = { seqno: args.data };
            else if (args.data instanceof Array) {
                //TODO,数组拼接之后会变成string，接口要求为int
                //MARK: 后台不管XML的标签属性,统一转成string然后按需转换成对应类型
                args.data = { seqno: args.data.join(",") };
            }
            this.request("calendar:delMessage", args);
        },

        //#endregion

        //#region 公共日历

        /**
         * 订阅公共日历
         * 用于: 搜索页面
         * @param data {Object} 订阅内容的对象
         * @param data.labelId {Int} 公共日历ID
         * @param data.color {String} 公共日历颜色（用户自定义）
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        subscribeLabel: function (args) {
            this.request("calendar:subscribeLabel", args);
        },
        /**
         * 退订公共日历
         * 用于: 搜索页面
         * @param data {Int/Object} 参数
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        cancelSubscribeLabel: function (args) {
            if (typeof data == 'number') data = { labelId: data };
            this.request("calendar:cancelSubscribeLabel", args);
        },
        /**
         * 搜索公共日历
         * 用于: 搜索页面
         * @param data {String/Object} 需要搜索的关键字
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        searchPublicLabel: function (args) {
            if (typeof data == 'string') {
                data = { searchText: data };
            }
            this.request("calendar:searchPublicLabel", args);
        },
        /**
         * 获取指定日历下的所有活动信息
         * @param args  需要传递给接口的参数以及回调函数
         */
        getCalendarList: function (args) {
            this.request("calendar:getCalendarList", args);
        },
        /**
         * 获取日历广场中所有的日历分类
         * @param args  需要传递给接口的参数以及回调函数
         */
        getAllLabelTypes: function (args) {
            this.request("calendar:getAllLabelTypes", args);
        },
        /**
         * 批量添加日历
         * @param args  需要传递给接口的参数以及回调函数
         */
        batchAddCalendar: function (args) {
            this.request("calendar:batchAddCalendar", args);
        },
        /**
         * 根据日历分类ID获取分类下的所有日历
         * @param args  需要传递给接口的参数以及回调函数
         */
        getLabelsByType: function (args) {
            this.request("calendar:getLabelsByType", args);
        },
        /**
         * 复制"订阅日历"下的所有活动到我的日历下
         * @param args  需要传递给接口的参数以及回调函数
         */
        copyCalendar: function (args) {
            this.request("calendar:copyCalendar", args);
        },
        /**
         * 从公共接口中获取日历广场中的数据
         * @param args
         */
        getUnifiedPositionContent: function (args) {
            this.request("unified:getUnifiedPositionContent", args);
        },
        /**
         * 获取单个已发布的日历
         * @param args
         */
        getPublishedLabelByOper: function (args) {
            this.request("calendar:getPublishedLabelByOper", args);
        },
        /**
         * 查询某个订阅日历下的所有活动,替换之前的getCalendarList接口
         * @param args
         */
        getCalendarsByLabel: function (args) {
            this.request("calendar:getCalendarsByLabel", args);
        },
        /**
         * 查询群组日历活动列表信息
         * @param args
         */
        getGroupCalendarList: function (args) {
            this.request("calendar:getGroupCalendarList", args);
        },
        /**
         * 添加群日历
         * @param args
         */
        addGroupLabel: function (args) {
            this.request("calendar:addGroupLabel", args);
        }
        //#endregion
    }));

    M2012.Calendar.API = new M2012.Calendar.Model.API();

})(jQuery, _, M139, window._top || window.top);
