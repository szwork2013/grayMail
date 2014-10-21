/**
 * 显示日历列表的控件
 */
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //具有特殊性，取名为LabelMenu2
    M139.namespace('M2012.Calendar.View.LabelMenu', superClass.extend({
        template: {
            MAIN: ['<div class="dropDown dropDown-mytag" style="width:{width};">',
                        '<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>',
                        '<div class="dropDownText" style="height:23px;">',
                            '<span style="background-color:{color};" class="ad-tagt"></span>',
                            '<span class="tagText" title="{labelName}">{labelName}</span>',
                        '</div>',
                    '</div>'].join(""),
            ITEM: ['<span style="background-color:{color};" class="ad-tagt"></span>',
                   '<span class="tagText" style="display:inline;">{labelName}</span>'].join(""),

            DEFAULT_COLOR: "#58a8b4",
            DEFAULT_NAME: "模板日历",
            DEFAULT_LABELID: 10,

            MENU_WIDTH: "226px;"
        },
        configs: {
            filterLabels: [6, 8] //6：生日，8：宝宝防疫
        },

        master: null,
        /**
         *
         * new M2012.Calendar.View.LabelMenu({
         *     target: $(document.body),
         *     labels:{},
         *     labelId: 10001
         * })
         */
        initialize: function (options) {
            var _this = this;
            /**
            options = $.extend({
                labelId: 10,
                labelName: _this.template.DEFAULT_NAME,
                color: _this.template.DEFAULT_COLOR
            }, options);*/

            _this.model = new Backbone.Model();
            _this.options = options || {};
            _this.container = options.container || options.target;
            _this.master = options.master || window.$Cal;
            if (!_this.options.labels) {
                _this.options.labels = _this.master.getUserLabels();
            }
            // 数据改变触发事件
            if (options.onChange) {
                _this.onChange = function (e) {
                    options.onChange(e);
                };
            }

            //_this.labelId = options.labelId || _this.template.DEFAULT_LABELID;

            /**
            if (!options.labels) {
                //如果labels为空，则主动加载.原则上要求传递，否则会出现重复加载的情形
                var model2 = new M2012.Calendar.Popup.Meeting.Model();
                model2.getLabels(function (result) {
                    _this.model.set("labels", result);
                    _this.render();
                    _this.initEvents();
                });
                return;
            }*/

            //检测数据变化实时通知调用方
            _this.model.on("change:data", function (args) {
                _this.onChange(_this.model.get("data"));
            });

            _this.model.set("labels", options.labels);
            _this.render(options);
            _this.initEvents();
        },

        /**
         * 数据改变触发事件
         */
        onChange: function (e) {

        },

        render: function (options) {
            var _this = this;
            var itemsArr = [],
                hashItems = {};
            var data = options.labels;

            $(data).each(function (i, item) {
                var itemData = {
                    labelId: item.seqNo,
                    color: item.color,
                    labelName: item.labelName
                };
                if (i == 0) {
                    // 保存新添加的日历,默认返回数组的第一个为刚刚加的日历
                    _this.model.set("data", itemData);
                }

                var html = $T.format(_this.template.ITEM, {
                    color: itemData.color,
                    labelName: $T.Html.encode(item.labelName)
                });

                var subItem = {
                    html: html,
                    data: itemData
                };

                itemsArr.push(subItem);
                hashItems[item.seqNo] = subItem;
            });

            this.model.set({ "items": itemsArr, "hashItems": hashItems });
            var width = options.width || this.template.MENU_WIDTH;
            _this.model.set("width", width);
            var html = $T.format(_this.template.MAIN, {
                color: this.model.get("data").color,
                labelName: $T.Html.encode(this.model.get("data").labelName),
                width: width
            });

            _this.container.html(html);
        },
        initEvents: function () {
            var _this = this;
            var items = _this.model.get("items");
            var width = _this.model.get("width");
            _this.container.off('click').on("click", function () {
                new M2012.Calendar.View.CalendarPopMenu().create({
                    maxHeight: 200,
                    width: width, //去掉padding的2px
                    items: items,
                    dockElement: _this.container,
                    customClass: "menuPop-sd",
                    onItemClick: function (e) {
                        _this.onItemClick(e);
                    }
                });
            });
        },
        onItemClick: function (e) {
            var _this = this;
            _this.model.set("data", e.data);
            _this.container.find(".dropDownText").html(e.html);
        },
        getData: function () {
            return this.model.get("data");
        },
        setData: function (labelId) {
            var _this = this,
                hashItems = _this.model.get("hashItems"),
                data = hashItems[labelId];

            if (data) {
                _this.onItemClick(data);
            }
        },
        setIndex: function (index) {
            var _this = this;
            var items = _this.model.get('items') || [];
            var item = items[index] || items[0];

            if (item) { //items[0]也可能是undefined
                _this.setData(item.seqNo);
            }
        }
    }));


})(jQuery, _, M139, window._top || window.top);