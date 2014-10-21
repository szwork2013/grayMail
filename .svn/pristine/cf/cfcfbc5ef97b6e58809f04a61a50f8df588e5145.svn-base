/**
*时间选择器，单纯的时间区间以及星期选择，通过方法获取设置的json
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.Settings.View.TimeRangeSelector";
    M139.namespace(namespace, superClass.extend({

        initialize: function (options) {
            if (!options || !options.container) {
                throw namespace + "参数错误！";
            }

            this.container = options.container || $("body");
            this.setElement(this.container);
            this.type = options.type;
            this.model = new Backbone.Model();
            this.initEvents();

            var value = $.extend({}, this._default);
            value = $.extend(value, options.value);

            this.model.set({range: value});

            //sample:
            //options = {
            //    container: $("body"),
            //    type: "modify",
            //    value: { tid: "tid_0_1_1", begin: 8, end: 22, weekday: "1,2,3,4" }
            //}
        },

        _default: {
            "begin": 8,
            "end": 22,
            "weekday": "1,2,3,4,5,6,7"
        },

        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var container = _this.container;

            model.bind("change:range", function(model, range){
                var viewData = _this.data(range);
                _this.render(viewData);
            });

            _this.on("rended", function(){
                var domObj = {
                    timefield: container.find("#timefield"),
                    weekfield: container.find("#weekfield"),
                    btnOk: container.find("#btnOk"),
                    btnCancel: container.find("#btnCancel")
                };

                var range = model.get("range");

                var weekPicker = new M2012.UI.Picker.Week({
                    container: domObj.weekfield,
                    value: range.weekday
                });

                var timePicker = new M2012.UI.Picker.TimeRange({
                    bindInput: domObj.timefield,
                    isArea: true,
                    value: {
                        start: range.begin,
                        end: range.end
                    }
                });

                timePicker.on("show", function(range){
                    if (top.$D) {
                        timePicker.$el.css("z-index", top.$D.getNextZIndex()+1);
                    }
                });

                timePicker.on("select", function(range){
                    domObj.timefield.val(_this._getTime(range.value));
                    domObj.timefield.data("value", range.value)
                });

                domObj.btnOk.click(function(){

                    var weekObj = weekPicker.getSelection();
                    var time = domObj.timefield.data("value");

                    if (typeof(time) !== "object") {
                        time = M139.JSON.tryEval(time); //for ie6,7
                    }

                    var range = model.get("range");
                    range.weekday = weekObj.value;
                    range.begin = time.start;
                    range.end = time.end;
                    range.discription = weekObj.discription + "，" + _this._getTime(range);

                    _this.trigger("submit", { "value": range, "success": function(){
                        container.trigger("click");
                        container.empty();
                    } });
                });

                domObj.btnCancel.click(function(){
                    container.trigger("click");
                    container.empty();
                    _this.trigger("cancel");
                });
            });
        },

        data: function(range) {
            var viewData = {
                "tid": range.tid || "addtion",
                "begin": range.begin,
                "end": range.end, 
                "discription": this._getTime(range),
                "button": {
                    "text": false,
                    "_class": false
                }
            };

            if (this.type === "modify") {
                viewData.button.text = "修 改";
                viewData.button._class = "tips-btn2 mb_10";
            }

            return viewData;
        },

        render: function (viewData) {
            var _this = this;
            _this.container.html(_this.template(viewData));
            _this.trigger("rended");
        },

        _getTime: function(timeRange) {
            var desc = ":00 ~ " + timeRange.end + ":00";
            if (typeof(timeRange.begin) == "undefined") {
                desc = timeRange.start + desc;
            } else {
                desc = timeRange.begin + desc;
            }
            return desc;
        },

        // template //{
        template: _.template([
                '<ul id="j_panel_range_<%= tid %>" class="form nofitimeset-form">',
                    '<li class="formLine">',
                        '<label class="label">时段：</label>',
                        '<div class="element">',
                            '<div><input id="timefield" type="text" class="iText time-iText" data-value=\'{"start":<%= begin %>,"end":<%= end %>}\' value="<%= discription %>" readonly /></div>',
                        '</div>',
                    '</li>',
                    '<li class="formLine">',
                        '<label class="label">日期：</label>',
                        '<div id="weekfield" class="element"></div>',
                    '</li>',
                '</ul>',
                '<div class="<%= button._class ? button._class : \'tips-btn\' %>">',
                    '<a id="btnOk" data-tid="<%= tid %>" class="btnNormal" href="javascript:void(0)"><span><%= button.text ? button.text : \'确 定\' %></span></a> ',
                    '<a id="btnCancel" data-tid="<%= tid %>" class="btnNormal" href="javascript:void(0)"><span>取 消</span></a>',
                '</div>'].join(""))
        //}

    })
    );
})(jQuery, _, M139);