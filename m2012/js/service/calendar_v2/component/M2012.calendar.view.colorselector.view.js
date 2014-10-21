
(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Calendar.View.ColorSelector', superClass.extend({
        TEMPLATE: {
            COLORS: ['<div id="{id}" class="pt_10 pb_5">颜色：',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-1" index="0"></a>',//怨最早的人吧，他不用class的颜色，自己定义了一套
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-2" index="1"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-3" index="2"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-4" index="3"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-5" index="4"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-6" index="5"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-7" index="6"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-8" index="7"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-9" index="8"></a>',
 						'<a href="javascript:void(0);" class="ad-tagt ad-tag-10" index="9"></a>',
 					'</div>'].join("")
        },
        SELECTED: "ad-tag-on",
        COLORS: {
            "1": "#6699ff",
            "2": "#319eff",
            "3": "#58a8b4",
            "4": "#009898",
            "5": "#51b749",
            "6": "#ff9966",
            "7": "#cc9999",
            "8": "#cc0000",
            "9": "#cc99cc",
            "10": "#b5bfca"
        },

        /**
        * @param {Object} options 初始化参数
        * @param {String} options.container 展示颜色组件的目标容器,对象ID,优先获取
        * @param {Object} options.target 展示颜色组件的目标容器,jquery对象(如果没传递container的ID,则可以通过传递target对象)
        * @param {Int} options.index 默认选中的颜色索引，优先获取index
        * @param {String} options.color 默认选中的颜色值(如#cccccc)，如果列表中不存在则使用默认的第一个
        * @param {Boolean} options.enabled 是否可操作，即可选择颜色
        * @param {Function} options.callback 在选中颜色时的回调方法,参数为{index:number,color:string}
        */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            _this.options = options;
            if (options.container) {
                _this.target = $("#" + options.container); //jquery obj
            } else {
                _this.target = options.target;
            }
            _this.callback = options.callback || $.noop;

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;
            var options = _this.options;

            //添加html到对应的dom
            var id = "color_selector_" + (new Date()).getTime();
            var template = $T.format(_this.TEMPLATE.COLORS, { id: id });
            //$(template).appendTo(_this.target);
            _this.target.html(template);

            _this.id = id;
            _this.$el = $("#" + id);
            _this._setBackgroundColor();

            //设置默认颜色
            var index = 0;
            if (options.index) {
                index = options.index;
            }
            else if (options.color) {
                index = _this._getIndexByColor(options.color);
            }
            _this.setColor(index);
        },
        initEvents: function () {
            var _this = this;
            var isEnabled = true;
            if (typeof _this.options.enabled == 'boolean') {
                isEnabled = _this.options.enabled;
            }
            _this.setEnabled(isEnabled);
        },
        _setBackgroundColor: function () {
            var _this = this;
            var colors = _this.COLORS;
            _this.$el.find('a').each(function (i, item) {
                $(this).css({ "background-color": colors[i + 1] }); //colors从1到10
            });
        },
        _getIndexByColor: function (color) {
            var _this = this;
            var index = 0;
            if (!_this.colorMap) {
                _this.colorMap = {};
                var colors = _this.COLORS;
                for (var key in colors) {
                    var k = colors[key].toUpperCase();
                    _this.colorMap[k] = parseInt(key) - 1; //转换成 {"#cccccc":1} 
                }
            }
            if (color && color.indexOf("#") == -1) {
                color = "#" + color;
            }
            color = color.toUpperCase();
            var index = _this.colorMap[color] || 0;
            return index;
        },
        setColor: function (color) {
            //color是颜色值，或者索引
            var _this = this;
            var index = 0;
            if (typeof color == 'string') {
                index = _this._getIndexByColor(color);
            }
            else if (typeof color == 'number') {
                index = color;
            }
            else {
                return;
            }

            //设置颜色
            var allColor = _this.$el.find("a");
            if (index > -1 && index < allColor.length) {
                allColor.removeClass(_this.SELECTED);
                allColor.eq(index).addClass(_this.SELECTED);
            }
            _this.callback({
                index: index,
                color: _this.COLORS[index + 1]
            });
        },
        /**
        * 通过此方法获取选中的颜色
        */
        getSelectedColor: function () {
            var _this = this;
            var selected = _this.$el.find("." + _this.SELECTED);
            return selected.css("background-color");
        },
        setEnabled: function (enabled) {
            var _this = this;
            if (enabled) {
                _this.$el.find("a").bind("click", function () {
                    var color = parseInt($(this).attr("index"));
                    _this.setColor(color);
                });
            } else {
                _this.$el.find("a").unbind("click");
            }
        }
    }));
})(jQuery, _, M139, window._top || window.top);