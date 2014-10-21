
(function ($, _, M139, top) {

    var _super = Backbone.View;
    var _class = "M2012.Calendar.View.AboutToday";
    var CHG_HEIGHT = "leftmenu#change:height";

    M139.namespace(_class, _super.extend({

        name: _class,

        el: "#pnlToday",
        template: null,
        isCollapsed: true,

        logger: new M139.Logger({ name: _class }),

        events: {
            "click": "expand",
            "mouseover": "highlight",
            "mouseout": "normal"
        },

        /**
         * 左上角今日黄历、吉凶宜忌的视图
         * @param {Object} options
         */
        initialize: function (options) {
            var _this = this;
            _super.prototype.initialize.apply(_this, arguments);
            _this.master = options.master;

            _this.bindData();
            _this.initEvents();
            _this.render(_this.model);
        },

        initEvents: function () {
            var _this = this;
            var master = _this.master;
            var EVENTS = master.EVENTS;

            _this.template = _.template($("#tplToday").html());
            _this.templateExt = _.template($("#tplTodayInfo").html());

            _this.$el = $(_this.el);
            _this.$elToday = _this.$el.find("#pnlDayInfo");
            //_this.$elInfo = _this.$el.find("#pnlExtInfo");
            _this.$elInfo = $("#lunarTips");

            _this.model.on("change", function () {
                _this.render.apply(_this, arguments);
            });

            //视图选中，日期数据变更
            master.on("change:year change:month change:day", function (model) {
                var curr = _this.model.toJSON();
                var change = model.toJSON();
                if (curr.today != change.day || curr.year != change.year || curr.month != change.month) {
                    _this.fetch.apply(_this, arguments);
                }
            });

            master.trigger(EVENTS.CAL_DATA_INIT, {
                success: function (result) {
                    var initData = result['var'];
                    var lunar = initData['huangli'];
                    if (_.isUndefined(lunar)) {
                        _this.logger.error("某日黄历 查宜忌详情失败 接口数据异常", initData);
                        return;
                    }

                    lunar.id = lunar.dayId;
                    _this.model.set(lunar);
                    _this.lunars.add(lunar);

                    //chongSha: "冲鼠[正冲丙子]煞北",
                    //ganzhi: "甲午年 丁卯月 壬午日",
                    //gongli: "2014-03-12",
                    //ji: "结婚 开工 安葬",
                    //pengZu: "壬不汲水更难提防 午不苫盖屋主更张",
                    //taishen: "仓库碓外西北",
                    //yi: "订婚 开光 求医 治病 动土 上梁 搬家 入宅"
                },
                error: function (err) {
                    if (err && err.code == "FS_SESSION_ERROR") {
                        top.$App.trigger("change:sessionOut", {}, true); //会话过期
                    }
                }
            });

            _this.$el.hover(function() {
                // 当鼠标进入黄历区域
                //do something
                _this.$elInfo.show();
            },function() {
                // 鼠标离开黄历区域时
                _this.hideTip();
            });
        },

        bindData: function (data) {
            var _this = this;
            var master = _this.master;

            var capi = master.capi;
            var now = capi.Today;
            var defaults = _this.calcLunar(now);

            $.extend(defaults, {
                hidden: _this.isCollapsed,
                yi: "黄道吉日",
                ji: "百无禁忌",

                dutygod: "平",
                taishen: "正南",

                chongSha: "冲* 煞*",
                pengZu: "破家治病主必安康"
            });

            _this.lunars = new Backbone.Collection();
            _this.model = new Backbone.Model(defaults);
        },

        /**
         * 根据日历实例计算出农历干支信息
         * @param date
         * @returns {{gongli: (*|format|format|String|格式化后的日期|格式化后的字符串或null), weekday: (*|format|format|String|格式化后的日期|格式化后的字符串或null), today: (*|number), month: number, year: number, aYear: (*|aYear), bYear: string, bMonth: string, bDay: string, cMonth: (*|cMonth|cMonth|cMonth), cDay: (*|cDay|cDay|cDay|cDay|Function)}}
         */
        calcLunar: function (date) {
            var _this = this;
            var master = _this.master;
            var capi = master.capi;
            var calObj = capi.createDateObj(date);

            return {
                gongli: $Date.format("yyyy-MM-dd", date),
                weekday: $Date.format("星期w", date),
                today: date.getDate(),
                month: date.getMonth()+1,
                year: date.getFullYear(),

                aYear: calObj.aYear,

                ganzhiYear: calObj.bYear + '年',
                ganzhiMonth: calObj.bMonth + '月',
                ganzhiDay: calObj.bDay + '日',

                cMonth: calObj.cMonth,
                cDay: calObj.cDay
            };
        },

        render: function (model) {
            var data = model.toJSON();
            // 渲染黄历主体模板
            this.$elToday.html(this.template(data));
            // 渲染黄历详情模板
            this.$elInfo.html(this.templateExt(data));
            return this;
        },

        /**
         * 鼠标进入黄历区域,增加"高亮显示"样式
         */
        highlight: function () {
            this.$el.addClass("focus");
        },

        /**
         * 鼠标离开黄历显示区域,移除"高亮显示"样式
         */
        normal: function () {
            this.$el.removeClass("focus");
        },

        /**
         * 隐藏黄历详情提示区域
         * @param e
         */
        hideTip : function(e) {
            this.$elInfo.hide();
        },

        /**
         * 展开老黄历神位与冲煞
         * 显示黄历详情提示区域
         */
        expand: function () {
            var _this = this;
            _this.$elInfo.show();
            _this.master.capi.addBehavior("calendar_huangli_click");
        },

        fetch: function (master) {
            var _this = this;

            var EVENTS = master.EVENTS;
            var masterData = master.toJSON();
            var mDate = new Date(masterData.year, masterData.month - 1, masterData.day, 9);

            //这里先用前端的数据，显示今日日期的农历信息。然后同时请求服务端的详情。
            var caldata = _this.calcLunar(mDate);
            var mDayId = Math.floor(mDate.getTime() / 86400000);

            //获取本地缓存，如果有就直接返回
            var cache = _this.lunars.get(mDayId);

            $.extend(caldata, cache ? cache.toJSON() : {
                yi: "……",
                ji: "……",
                taishen: "……",
                chongSha: "……",
                pengZu: "……"
            });

            _this.model.set(caldata);
            _this.logger.debug("今日黄历 查询宜忌详情...", caldata);

            if (cache) {
                return;
            }

            //获得主控API实例
            master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    var year = Number(masterData.year);
                    var month = Number(masterData.month);
                    var day = Number(masterData.day);

                    var startDate = year + '-' + month + '-1'; //2014-12-1
                    var endDate = ((month > 11 ? 1 : 0) + year) + '-' + (month > 11 ? 1 : month + 1) + '-1'; //2015-1-1

                    //获取农历的宜忌
                    api.getHuangliData({
                        data: {
                            comeFrom: 0,
                            startDate: startDate,
                            endDate: endDate
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                var viewData = result['var'];
                                if (!_.isArray(viewData)) {
                                    _this.logger.error("某日黄历 查宜忌详情失败 接口数据异常", viewData);
                                    return;
                                }

                                for (var i = 0; i < viewData.length; i++) {
                                    viewData[i].id = viewData[i].dayId;
                                    delete viewData[i].dayId;

                                    if (viewData[i].id == mDayId) {
                                        _this.model.set(viewData[i]);
                                    }

                                    _this.lunars.add(viewData);
                                }
                            } else {
                                _this.logger.error("某日黄历 查宜忌详情失败 ERROR", result);
                            }
                        },
                        error: function () { }
                    });
                }
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);
