
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2012.UI.Dialog.RecentMail";

    M.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Dialog.RecentMail.prototype*/
    {
        /** 定义最近收到的邮件对话框
         *@constructs M2012.UI.Dialog.RecentMail
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.template 模板
         *@example
         */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.template = options.template;
            this.initEvent();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,

        /**构建dom函数*/
        render: function () {
            var This = this;
            var options = this.options;

            var data = this.model.get("data");

            //去重
            data = M.unique(data, function(a,b){
                return $T.Email.compare(a.from, b.from);
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

            this.dialog = $Msg.showHTML(this.template(data), function (e) {
                This.onYesClick(e);
            }, function (e) {
                This.onCancelClick(e);
            }, null, {
                //width: 400,
                //height: 200,
                buttons: ["添加", "取消"],
                dialogTitle: "最近收信"
            });

            //$App.openDialog("最近收信", "M2012.View.UnfoldSetting", {type:"custom", width: 383, height: 120,buttons:["确定","取消"] });
            
            

            this.setElement(this.dialog.el);

            (function(el){
                var disabled = "btnGrayn";
                var _parent = $(el);
                var btn = _parent.find(".btnSure");
                btn.addClass(disabled);
                _parent.click(function(e){
                    if (e.target.type != "checkbox") {
                        return;
                    }

                    var chks = _parent.find(":checked");
                    if (chks.length > 0) {
                        btn.removeClass(disabled);
                    } else {
                        btn.addClass(disabled);
                    }
                });
            })(This.el);
        },

        /** 获取原始数据
         *  注意 1、剔除置顶邮件；2、关闭会话模式
         *@param {Object} options 初始化参数集
         *@example
         */
        requestInitData: function () {
            var This = this;
            top.M139.UI.TipMessage.show("正在列出邮件...");

            top.$App.getView("mailbox").model.getFreshMail(100, function(list){

                top.M139.UI.TipMessage.hide();
                if (!list) {
                    $Msg.alert("加载失败，请稍后重试", { ico: "warn" });
                    return false;
                }

                This.onInitDataLoad(list);
            })
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
            }).on("success", function (e) {
                this.dialog.close();
            });
        },

        onYesClick: function (e) {
            var mid = {}, mail = this.model.get("data");

            $.each(mail, function(n,i) {
                mid[i.mid] = i.from;
            });

            mail = mid;

            mid = $(this.el).find(":checked");
            mid = $.makeArray(mid);
            mid = $.map(mid, function(i){
                return mail[i.value];
            });

            mid = $.unique(mid);

            this.trigger("success", mid);
            e.cancel = true;
        },

        onCancelClick: function () {
            this.trigger("cancel");
        }
    }));
})(jQuery, _, M139);