(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.Weather.View', superClass.extend(
    {
        el: "#weatherTool",

        template: ['<ul>',
            '<li class="acquired">城市：<a id="cityBtn" href="javascript:void(0);" class="c_457fbd" bh="welcome_weathercity">{area}<i class="triangle t_BlueDowm ml_5"></i></a><a id="checkWeather" href="javascript:;" class="aqdTxt c_457fbd">[后天]</a></li>',
            '{weatherHtml}',
            '</ul>'].join(""),

        templeteWeatherDay: '<li>{day}：<i class="{icon}"></i>{temperature} {weather}</li>',

        templateTip: ['<div class="tips-text">',
                        '<div class="seloption">',
                            '<ul class="clearAll ta_c">',
                                '{weatherHtml}',
                            '</ul>',
                            //'<a class="i_close" href="javascript:;" title="关闭"><!-- 等级3 --></a>	',
                        '</div>',
                        '<span class="tips-top diamond"></span>',
                    '</div>',
                    '<iframe src="javascript:;"></iframe>'].join(""),

        templeteLiWeatherTip: ["<li>",
                                    '<p class="c_555">{recentDay} {date}</p>',
                                    '<p>{temperature}</p>',
                                    '<p>{desc}</p>',
                                    '<p><i class="{ICO}"></i></p>',
                                "</li>"].join(""),

        events: {
        },

        initialize: function (options) {
            this.model = options.model;
            this.initEvents();
        },

        initEvents: function(){
            var self = this;

            //$("#province").change(self.changeProvince(self)); //切换省份
            $("#province").change(function(){
                var provinceCode = $(this).val();
                self.changeProvince(provinceCode);
            });
            $("#city").change(function(){
                var cityCode = $(this).val();
                self.changeCity(cityCode);
            }); //城市监听

            $("#queryWeather").click(function(){
                if($(this).parent().hasClass('cur')){
                    var provinceCode = $("#province").val();
                    var cityCode = $("#city").val();
                    self.queryWeather(cityCode);
                }
            }); //查看天气

            $("#setWeather").click(function(){
                if($(this).parent().hasClass('cur')){
                    var cityCode = $("#city").val();
                    self.setWeather(cityCode);
                }
            })
        },

        weatherBarEvent: function(){
            var self = this;
            var temperatureTips = $("#temperatureTips");
            //self.controlTip("Temperature"); //天气绑定事件
            $("#checkWeather").click(function(){
                top.BH('wel_tomorrow');
                temperatureTips.show();
                return false;
            });
            temperatureTips.click(function(){return false;});
            $("body").click(function(){
                temperatureTips.hide();
            });
            self.controlTipOther("cityBtn", "i_close"); //城市绑定事件
            $("#cityBtn").click(function(){
                self.getProvince();
            }); //组装省份
        },

        //单击控制浮层显隐
        controlTipOther: function(btnId, btnClose){
            var btn = $("#" + btnId),
                tip = $("#" + btnId + "Tip"), //弹出层
                btnClose = tip.find("." + btnClose); //关闭按钮

            btn.click(function(){
                tip.show();
            });
            btn.css({"cursor": "pointer"});
            if (btnClose) {
                btnClose.unbind().bind("click", function(){
                    tip.hide();
                })
            }
        },

        render: function(){
            var self = this;
            this.model.reqDefaultWeather(function(result){
                result && result.weather && self.cityWeatherRender(result, true, true);
            });
        },

        //组装省份
        getProvince: function(){
            var self = this;
            if (self.model.get('areas')!=null){
                //self.provincesRender();
                return;
            }else{
                self.model.reqAreas(function(result){
                    self.provincesRender();
                });
            }
        },

        changeCity: function(cityCode){
            var self = this;
            var queryWeather = $("#queryWeather"),
                setWeather = $("#setWeather"),
                parent = queryWeather.parent();
            if (cityCode == 0) {
                queryWeather.unbind("click", function(){
                    self.queryWeather(cityCode);
                });
                setWeather.unbind("click",function(){
                    self.setWeather(cityCode);
                });
                parent.removeClass("cur");
            } else {
                queryWeather.unbind().bind("click", function(){
                    self.queryWeather(cityCode);
                });
                setWeather.unbind().bind("click", function(){
                    self.setWeather(cityCode);
                });
                parent.addClass("cur");
            }
        },

        provincesRender: function(){
            var self = this;
            var areas = this.model.get('areas'),
                provinceNode = document.getElementById("province"),
                arr = ['<option value="0">---省份---</option>'];

            for (var i = 0, l = areas.length; i < l; i++) {
                var item = areas[i];

                arr.push(top.$T.Utils.format('<option value="{provinceCode}">{provinceName}</option>', {
                    provinceCode: item.areaCode,
                    provinceName: item.areaName
                }))
            }
            arr = arr.join("");
            $('#province').html(arr);
            //$('#city').trigger("change");
        },

        changeProvince: function(provinceCode){
            var self = this;

            var queryWeather = $("#queryWeather"),
                setWeather = $("#setWeather"),
                parent = queryWeather.parent();

            var cities = this.model.queryProvince(provinceCode),
                cityNode =  document.getElementById("city"),
                arr = ['<option value="0">---城市---</option>'];

            if (cities != undefined) {
                for (var i = 0, l = cities.length; i < l; i++) {
                    var item = cities[i];
                    arr.push(top.$T.Utils.format('<option value="{cityCode}">{cityName}</option>', {
                        cityCode: item.areaCode,
                        cityName: item.areaName
                    }))
                }
            }
            arr = arr.join("");
            $("#city").html(arr);
            parent.addClass("cur");
            cityNode.options[1] && (cityNode.options[1].setAttribute("selected", true));
            setTimeout(function(){ //解决ie6中先change后改变selected的问题
                $("#city").trigger("change");
            }, 100);
        },

        /*
         * 渲染天气相关内容
         * @param {Boolean} updateWeatherBar 可选项 是否更新天气栏目
         * @param {Boolean} updateWeatherTip 可选项 是否更新天气提示浮层，清空内容，重新载入
         * @param {Boolean} showWeatherTip 可选项 是否显示天气浮层
         */
        cityWeatherRender: function (weatherInfo, updateWeatherBar, updateWeatherTip, showWeatherTip){
            if (updateWeatherBar) {
                weatherInfo && this.weatherBar(weatherInfo);
                this.weatherBarEvent();
            }
            this.weatherTip(weatherInfo, 3, updateWeatherTip, showWeatherTip); //3为显示最近3天天气
        },

        /*
         * 查询地区天气
         * @param {String} cityCode 地区编号
         */
        queryWeather: function(cityCode){
            var self = this;
            this.model.reqCityWeather(cityCode,function(result){
                result && result.weather && self.cityWeatherRender(result, true, true, false);
            });
        },

        /*
         * 设置默认天气
         * @param {String} cityCode 地区编号
         */
        setWeather: function(cityCode){
            var self = this;
            self.model.reqSetWeather(cityCode,function(result){
                result && result.weather && self.cityWeatherRender(result, true, true, true);
                top.BH('welcome_weathersetok');
            });
        },

        //更新城市天气工具栏
        weatherBar: function (info){
            var self = this;
            var weatherData = [info.weather[0], info.weather[1]];
            var weatherHtml = getWeatherMoreDayTemplete(this.templeteWeatherDay, weatherData);
            var str = top.$T.Utils.format(this.template, {
                area: info.city,
                weatherHtml: weatherHtml
            });

            $(this.el).empty().append(str);

            function getWeatherMoreDayTemplete (templete, data) {
                var html = [];
                var day = ["今天", "明天", "后天"];

                for (var i = 0, len = data.length; i < len; i++) {
                    var itemWeather = data[i];

                    html.push(M139.Text.format(self.templeteWeatherDay, {
                        day: day[i],
                        icon: "weaBig" + itemWeather["pic0"],//pic0是小图 大图前缀:wea,如wea0
                        temperature: itemWeather["temper"],
                        weather: itemWeather["weather"].substr(0, 7)//多于7个汉字的时候，会换行，截去
                    }));
                }

                return html.join("");
            }
        },

        //天气提示，展示最近3天的天气
        weatherTip: function (info, recentDays, updateWeatherTip, showWeatherTip){
            var html =  this.getWeatherTipHtml(info, recentDays),
                tip = $("#temperatureTips"),
                child = tip.find("div");

            $("#cityBtnTip").hide();//天气设置浮层消失
            updateWeatherTip && child.remove();
            switch (child.length) {
                case 0:
                    break;
                case 1:
                    child.eq(0).hide();
                    tip.show();
                    break;
                case 2:
                    child.eq(1).remove();
                    tip.show();
                    break;
            }
            tip.append(html);
            showWeatherTip && tip.show();
        },

        getWeatherTipHtml: function (info, recentDays){
            var self = this;
            var todayW = info.weather,
                recentDay = '今天',
                currentDate = self.model.getCurrentDate(),
                recentDate = top.$Date.format("MM月dd日",currentDate),
                weatherHtml = [];

            for(var i = 0; i < recentDays; i++){
                var item = todayW[i];

                switch(i){
                    case 0:
                        recentDay = '今天';
                        break;
                    case 1:
                        recentDay = '明天';
                        recentDate = self.model.getNextMonthDate(currentDate);
                        break;
                    case 2:
                        recentDay = '后天';
                        recentDate = self.model.getNextMonthDate(currentDate);
                        break;
                }

                weatherHtml.push(M139.Text.format(this.templeteLiWeatherTip, {
                    recentDay: recentDay,
                    date: recentDate,
                    desc: item.wind,
                    temperature: item.temper,
                    ICO: "wea" + item.pic0
                }));
            }

            return M139.Text.format(this.templateTip, {
                weatherHtml: weatherHtml.join("")
            });
        },

		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);

