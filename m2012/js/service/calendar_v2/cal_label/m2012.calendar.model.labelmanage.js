; (function ($, _, M139, top) {
    var className = "M2012.Calendar.Model.LabelManage";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        logger: new M139.Logger({ name: className }),
        //枚举集合
        Types: {
            0: 'allLabels',
            1: 'sysLabels',
            2: 'userLabels',
            3: 'shareLabels',
            4: 'subscribedLabels',
            5: 'groupLabels',

            all: 0,
            system: 1,
            user: 2,
            shared: 3,
            subscribe: 4,
            group: 5
        },
        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
         */
        initialize: function (args) {
            var that = this;
            that.master = args.master;
        },

        callAPI: function (fnName, data, fnSuccess, fnError) {
            var that = this;
            that.master.capi.callAPI({
                data: data,
                fnName: fnName
            }, fnSuccess, fnError);
        },
        /**
         * 调用后台接口获取日历数据
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getLabels: function (data, fnSuccess, fnError) {
            var that = this;
            var param = { comeFrom: 0, actionType: 0 } || data;
            this.callAPI("getLabels", param, function (response) {
                if (response.code === 'S_OK') {
                    var data = that.wrapLabels(response["var"]);
                    !$.isEmptyObject(data) && _.isFunction(fnSuccess) && fnSuccess(data);
                }
            }, fnError);
        },
        /**
         * 删除别人共享给自己的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        deleteLabelShare: function (param, fnSuccess, fnError) {
            this.callAPI("deleteLabelShare", param, fnSuccess, fnError);
        },
        /**
         * 删除自己创建的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        deleteLabel: function (param, fnSuccess, fnError) {
            param = $.extend({
                comeFrom: 0,
                isDelAllCals: 0   //删除标签时，是否删除该标签下的所有日程：0:不删除, 1:删除
            }, param);
            this.callAPI("deleteLabel", param, fnSuccess, fnError);
        },
        /**
        * 删除群日历
        * @param param
        * @param fnSuccess
        * @param fnError
        */
        deleteGroupLable: function (param, fnSuccess, fnError) {
            param = param || {};
            if (param.isOwner) {
                delete param.isOwner;
                this.callAPI("deleteLabel", param, fnSuccess, fnError);
                return;
            }
            this.callAPI("deleteLabelShare", param, fnSuccess, fnError);
        },
        /**
         * 退订"订阅日历"下的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        cancelSubscribeLabel: function (param, fnSuccess, fnError) {
            param = $.extend({ comeFrom: 0 }, param);
            this.callAPI("cancelSubscribeLabel", param, fnSuccess, fnError);
        },
        /**
         * @param data  接口返回的数据
         * @param typeName key
         * @returns {*|Array}
         */
        getListByType: function (data, typeName) {
            var that = this,
                intKey = that.Types[typeName],
                strKey = that.Types[intKey];
            return data[strKey] || [];
        },
        /**
         * 将从接口返回的数据进一步封装
         * 封装之后的数据用于界面展示
         * @param result
         * @returns {*}
         */
        wrapLabels: function (result) {
            if (!result) {
                // 如果接口返回数据为空, 直接返回
                return {};
            }

            var that = this,
                shared = that.getListByType(result, "shared"),
                subscribe = that.getListByType(result, "subscribe"),
                system = that.getListByType(result, "system"),
                group = that.getListByType(result, "group"),
                user = that.getListByType(result, "user");

            // 转换数据类型, 增加isBeShared字段, 标记该日历是"别人共享给自己的"
            _.each(shared, function (item) {
                $.extend(item, { isBeShared: true });
            });

            // 增加一个虚拟的类型： 所有标签，方便处理
            result['allLabels'] = [].concat(user, system, shared, subscribe);

            // 转换数据类型
            _.each(result['allLabels'], function (item) {
                $.extend(item,
                    {
                        labelId: Number(item.seqNo || item.labelId),
                        labelName: $T.Html.encode(item.labelName) // 防止XSS攻击
                    });
            });

            // 新增需求, 共享的日历归类到"我的日历"下面
            user = user.concat(shared);
            return {
                'all': result['allLabels'],
                'user': user,
                'shared': shared,
                'subscribe': subscribe,
                'system': system,
                'group': group
            };
        }
    }));
})(jQuery, _, M139, window._top || window.top);
