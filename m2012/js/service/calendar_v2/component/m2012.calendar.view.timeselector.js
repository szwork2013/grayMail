
; (function ($, _, M139, top) {

    var commonApi = M2012.Calendar.CommonAPI.getInstance();

    var className = "M2012.Calendar.View.TimeSelector";

    //#region 菜单数组,计算一次并缓存,防止多次new实例的时候都要计算
    var hourItems = (function () {
        var coll = [], i;
        for (i = 0; i < 24; i++) {
            coll.push({
                text: commonApi.padding(i, 2),
                data: i //number
            });
        }
        return coll;
    })();
    var minuteItems = (function () {
        var coll = [], i;
        for (i = 0; i < 6; i++) {
            var num = i * 10;
            coll.push({
                text: commonApi.padding(num, 2),
                data: num
            });
        }
        return coll;
    })();
    //#endregion

    M139.namespace(className, Backbone.View.extend({
        name: className,
        configData: {
            initData: {

            },
            hour: {
                name: "hour",
                max: 23,
                width: 65,
                height: "145px",
                items: _.clone(hourItems)
            },
            minute: {
                name: "minute",
                max: 59,
                width: 50, //没有滚动条,不需要这么宽
                height: "auto",
                items: _.clone(minuteItems)
            }
        },
        template: {
            MAIN: '<span class="textTimeOther ml_5"><input name="hour" type="text" value="00" maxlength="2"> : <input name="minute" type="text" value="00" maxlength="2"></span>',
            MAIN2: '<div class="createInput_right"><input name="hour" type="text" value="00" maxlength="2">:<input name="minute" type="text" value="00" maxlength="2"></div>',
            selectedClass: 'ses'
        },
        /*
         * 时间组件
         * var timeSelector = new M2012.Calendar.View.TimeSelector({
         *     container:$("#divId"), //需要展示的容器,必选参数
         *     hour:'08',   //时间,可选参数,传入hour和minute,优先选择此选项
         *     minute:'00',
         *     //time:"0800", //时间,可选参数,可以直接把时间传递进来
         *     onChange:callback, //时间变化时触发的回调,可选参数
         *     style:'MAIN2', //MAIN2的样式,大写,对照template中的key
         *     action: 'append', //是html还是append
         * 
         *     width:"140px" //超哥要求的
         * });
         * 
         * 有2中方法获取数据,第一种是上面的传递onChange方法实时监听,第二种是调用getData方法
         * var data = timeSelector.getData();
         */
        initialize: function (options) {
            options = options || {};
            var _this = this;
            _this.options = options;
            _this.container = options.container;
            if (!_this.container) {
                return;
            }

            _this.model = new Backbone.Model(_this.configData.initData);

            _this.render();
            _this.bindEvents();
            _this._initData();
        },
        render: function () {
            var _this = this,
                width = _this.options.width;

            //  _this.container.html(_this.template.MAIN);
            var dom = _this.template.MAIN;
            var style = _this.options['style'];
            if (!!style && _this.template[style]) {
                dom = _this.template[style]
            }

            _this.currentEl = $(dom).appendTo(_this.container);

            if (undefined !== width) {
                _this.currentEl.css("width", width);
            }

            _this.input = _this.currentEl.find("input");
            _this.hour = _this.currentEl.find("input[name='hour']");
            _this.minute = _this.currentEl.find("input[name='minute']");
        },
        bindEvents: function () {
            var _this = this,
                model = _this.model;

            _this.input.off("blur click").on("blur", function () {
                var input = $(this),
                    name = input.attr("name");
                if (!!name) {
                    _this.onBlur(name); //更新数据
                }
            }).on("click", function () {
                var input = $(this),
                    name = input.attr("name"),
                    data = _this.configData[name],
                    items = (data && data.items) || [];
                var menu;

                input.addClass(_this.template.selectedClass);//选中后的样式背景色

                if (data && items.length > 0) {
                    menu = new M2012.Calendar.View.CalendarPopMenu().create({
                        dockElement: input,
                        //direction:'down'
                        items: items,
                        width: data.width,
                        maxHeight: data.height,
                        onItemClick: function (item) {
                            var num = item.data;
                            input.val(commonApi.padding(num, 2));
                            model.set(name, num);
                        }
                    });

                    //输入时,移除menu
                    input.on("keydown", function () {
                        input.off("keydown");
                        menu && menu.remove && menu.remove();
                    });
                }
                input.select();
            });

            //可能存在需求,在变更时触发回调
            model.on("change:hour change:minute", function () {
                if (_this.timer) {
                    window.clearTimeout(_this.timer);
                }
                //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                self.timer = window.setTimeout(function () {
                    var callback = _this.options.onChange;
                    if (_.isFunction(callback)) {
                        callback(_this.getData());
                    }
                }, 0x64);

            });
        },
        _initData: function (options, silent) {
            var _this = this;

            options = options || _this.options;

            var hour = options.hour,
                minute = options.minute,
                time = options.time;

            if (typeof hour == 'number' && typeof minute == 'number') { //不能用!!hour和!!minute,因为可以为0
                //优先选取传递的hour和minute
                hour = Number(hour);
                minute = Number(minute);
            } else if (!!time) {
                //其次选取传递的time信息,如果time有唔,如2500,则会出bug,如果是abcd这样的time,会被Number成0
                time = commonApi.padding(Number(time), 4);
                hour = Number(time.slice(0, 2));
                minute = Number(time.slice(2, 4));
            } else {
                //未传递时间,根据产品需求,获取最近的一个可选择的时间点
                var data = _this.closestDate();
                hour = data.hour;
                minute = data.minute;
            }

            //显示
            _this.hour.val(commonApi.padding(hour, 2));
            _this.minute.val(commonApi.padding(minute, 2));

            _this.model.set({ hour: hour, minute: minute }, { silent: true }); //不触发,防止初始化的时候触发2次
            if (!silent) {
                _this.model.trigger("change:hour"); //因为上面没触发,这里触发一次回调
            }
        },
        setData: function (data, silent) {
            if (typeof silent == undefined) silent = true;
            this._initData(data, !!silent); //透传,公开setData,不公开_initData
        },
        closestDate: function (date) {
            //根据产品需求,获取最近的一个可选取的时间点
            var _this = this;
            date = (date && new Date(date)) || new Date(); //clone or new 

            var hour = date.getHours(),
                minute = date.getMinutes();
            hour += Math.ceil(minute / 60);
            minute = Math.floor(minute / 30) * 30;

            return {
                hour: hour % 24, //跨天的,要清零.如24点,要变成0点
                minute: minute
            };
        },
        onBlur: function (type) {
            //param type accept: hour/minute
            var _this = this;
            var input = _this[type],
                val = input.val(),
                max = _this.configData[type] && _this.configData[type].max;

            var number = val;
            if (/[^0-9]/.test(val)) {
                //如果有英文字符
                val = _this.model.get(type); //还原
                number = val;
            }

            if (Number(number) > Number(max)) { //大于最大可选择的数字
                number = max;
            }

            number = Number(number); //转成数字,以防止前面太多的0
            input.val(commonApi.padding(number, 2)); //可能是个位数

            _this.model.set(type, number);
            input.removeClass(_this.template.selectedClass);
        },
        getData: function () {
            var _this = this;
            //获取数据
            var hour = _this.model.get("hour"),
                minute = _this.model.get("minute"),
                shour = commonApi.padding(hour, 2),
                sminute = commonApi.padding(minute, 2);

            return {
                hour: hour,
                minute: minute,
                time: shour + sminute,
                text: shour + ":" + sminute
            };
        },
        hide: function () {
            //this.currentEl.find(".textTimeOther").addClass("hide");
            this.currentEl.addClass("hide");
        },
        show: function () {
            //this.currentEl.find(".textTimeOther").removeClass("hide");
            this.currentEl.removeClass("hide");
        }
    }));

    ////#region 使用方法,测试用
    //$(function () {
    //    setTimeout(function () {
    //        new M2012.Calendar.View.TimeSelector({
    //            container: $("#ul_action"),
    //            hour: 9,
    //            minute: 38,
    //            onChange: function (data) {
    //                console.log("%s 触发时间变化", new Date().getTime(), data);
    //            }
    //        });
    //    },1000);
    //});
    ////#endregion

})(jQuery, _, M139, window._top || window.top);