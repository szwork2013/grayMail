
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2011.UI.Dialog.RecentMail";

    M.namespace(namespace, superClass.extend(
    /**@lends M2011.UI.Dialog.RecentMail.prototype*/
    {
        /** 定义最近收到的邮件对话框
         *@constructs M2012.UI.Dialog.RecentMail
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.template 模板
         *@example
         */
        initialize: function (options) {
            var _this = this;
            _this.model = new Backbone.Model();
            _this.template = options.template;
            _this.$el = options.container;
            _this.btnOk = _this.$el.find(".YesButton");

            _this.initEvent();
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        name: namespace,
        
        template: "",

        /**构建dom函数*/
        render: function () {
            var _this = this;
            var data = _this.model.get("data");

            //去重
            data = M.unique(data, function(a,b){
                return $Email.compare(a.from, b.from);
            });

            var count = 0, buff = [];
            for (var m=data.length, i=0; i<m; i++) {
                if (!data[i].flags.top && data[i].from.length > 0 && data[i].subject.length > 0) {
                    buff.push({
                        "mid": data[i].mid,
                        "from": $T.Html.encode(data[i].from),
                        "subject": $T.Html.encode(data[i].subject)
                    });
                    count++;
                }
                if (count >=20) {
                    break;
                }
            }

            data = { maillist: buff };
            var html = _this.template(data);

            _this.$el.find("#recentmaillist").html(html);
            _this.btnOk.click(function(e){
                _this.onYesClick(e);
            });
            _this.$el.find(".CancelButton").click(function(){
                _this.trigger("cancel");
            });

            (function(el, btn){
                var disabled = "c_666";
                btn.addClass(disabled);
                el.click(function(e){
                    if (e.target.type != "checkbox") {
                        return;
                    }

                    var chks = el.find(":checked");
                    if (chks.length > 0) {
                        btn.removeClass(disabled);
                    } else {
                        btn.addClass(disabled);
                    }
                });
            })(_this.$el, _this.btnOk);

        },

        /** 获取原始数据
         *  注意 1、剔除置顶邮件；2、关闭会话模式
         *@param {Object} options 初始化参数集
         *@example
         */
        requestInitData: function () {
            var This = this;

            top.MS.getMailList(1, 1, 100, "date", "1", function(list){
                if (!list) {
                    parent.FF.close();
                    This.trigger("cancel");
                    parent.FF.alert("加载失败，请稍后重试", { ico: "warn" });
                    return false;
                }

                This.onInitDataLoad(list);
            });
        },

        onInitDataLoad: function (json) {
            if (json) { this.model.set("data", json); }
            this.trigger("initdataload");
        },

        initEvent: function (e) {
            this.on("initdataload", function () {
                this.render();
            }).on("print", function () {
                this.requestInitData();
            }).on("cancel", function(){
                parent.FF.close();
            });
        },

        onYesClick: function (e) {
            var _this = this;
            if (_this.btnOk.hasClass("c_666")) {
                return;
            }

            var mid = {}, mail = _this.model.get("data");

            $.each(mail, function(n,i) {
                mid[i.mid] = i.from;
            });

            mail = mid;

            mid = _this.$el.find(":checked");
            mid = $.makeArray(mid);
            mid = $.map(mid, function(i){
                return mail[i.value];
            });

            mid = $.unique(mid);

            _this.trigger("success", mid);
        }

    }));
})(jQuery, _, M139);