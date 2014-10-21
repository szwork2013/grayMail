; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Weather";

    M139.namespace(_class, superClass.extend({
        STATUS: {
            SUCCESS: "S_OK"
        },

        initialize: function (options) {

            var _this = this;
            options = options || {};

            _this.master = options.master;
            _this.model = new M2012.Calendar.Model.Weather({
                master: _this.master
            });

            _this.initEvents();
            _this.render();
        },
        initEvents: function () {
            var _this = this;
            $(_this.elements).unbind("mouseover mouseout")
                .bind("mouseover", function (event) {
                    if (event.target.tagName.toLowerCase() == "i" && !!($(event.target).attr("tag-for"))) {
                        _this.onCommand(event);
                    }
                }).bind("mouseout", function (event) {
                    _this.hideWeatherDetail();
                });
        },
        render: function () {
            var _this = this;
            if (!$(_this.elements)) return;

            if (window.weatherData) {
                _this.showWeather(window.weatherData);
            } else {
                _this.model.getDefaultWeather(function (data) {
                    window && (window.weatherData = data);
                    _this.showWeather(data);
                })
            }
        },

        showWeather: function (data) {
            var _this = this;
            if (data) {
                var weathers = data.weather;
                if (weathers && weathers.length > 0) {
                    for (var i = 0, len = weathers.length; i < len; i++) {
                        var weatherInfo = weathers[i];
                        if (weatherInfo.pic0) {
                            var item = $(_this.elements + "[rel='" + i + "']");//$("i[tag-for='weather'][rel='0']")
                            item.addClass(_this.weatherClass + weatherInfo.pic0);
                            item.attr({
                                execCmd: "showWeatherDetail",
                                date: weatherInfo.date,
                                pic0: weatherInfo.pic0,
                                pic1: weatherInfo.pic1,
                                weather: weatherInfo.weather,
                                temper: weatherInfo.temper,
                                wind: weatherInfo.wind
                            });
                            item.show();
                        }
                    }
                }
            }
        },

        onCommand: function (event) {
            var _this = this;
            var container = $(event.target);
            var data = {
                event: event,
                id: _this.weatherTipsName,
                target: container,
                index: container.attr("rel"),
                after: container.attr("after-item"),
                date: container.attr("date"),
                pic0: container.attr("pic0"),
                pic1: container.attr("pic1"),
                weather: container.attr("weather"),
                temper: container.attr("temper"),
                wind: container.attr("wind")
            };
            var command = _this[container.attr("execcmd")];
            command && command(data, _this);
        },

        showWeatherDetail: function (data, _this) {
            _this.hideWeatherDetail();

            var template = _this.template.weatherTips;
            var afterItem = $("#" + data.after).find('#ul_action');
            afterItem.after($T.format(template, data));

            //计算一下箭头位置
            var div = $("#" + _this.weatherTipsName);
            var divHeight = div.outerHeight(),
                winHeight = $(document.body).height() - 45,//去掉toolbar的高度
                offset = data.target.offset().top;
            var className = "tips_top",
                top = 0;
            if (offset + divHeight > winHeight && offset >= divHeight) {
                var heightMod = (data.index == 0) ? 0 : 4; //今天的边框有4px的位移.
                className = "tips_bottom";
                top = top - (divHeight + 10 + heightMod);
                div.css("top", top);
            }
            div.closest("td").addClass("onMousOver"); //
            div.find("span").addClass(className);
            div.show();
        },
        hideWeatherDetail: function () {
            var item = $("#" + this.weatherTipsName);
            item.closest("td").removeClass("onMousOver");
            item.remove();
        },

        elements: "i[tag-for='weather']",
        weatherTipsName: "calendar_month_weather_detail",
        weatherClass: "weaBig",

        template: {
            weatherTips: ['<div id="{id}" class="weathertips" style="display:none;z-index:99;">',
                            '<h2>{date}</h2>',
                            '<p>{temper}</p>',
                            '<p>{weather}</p>',
                            '<p>{wind}</p>',
                            '<i class="wea{pic0}"></i>',
                            '<span class="diomTips"></span>',
                        '</div>'].join("")
        }
    }

        ));

})(jQuery, _, M139, window._top || window.top);