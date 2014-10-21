(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.Settings.View.NotifyMenu", superClass.extend({
        typeArr: function () {
            if (!top.SiteConfig.mailNotice) {
                var arr = [
                { notifyText: "普通短信", value: 1, hasItem: true, notifyTip: "显示70字", notifyImg: "../../images/module/set/type1.png", img: "type1.png", notifyClass: "" },
                { notifyText: "wap链接", value: 3, hasItem: true, notifyTip: "不支持iPhone", notifyImg: "../../images/module/set/type2.png", img: "type2.png", notifyClass: "" },
                { notifyText: "长短信", value: 4, hasItem: true, notifyTip: "显示350字", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "彩信", value: 2, hasItem: true, notifyTip: "支持查看2万字", notifyImg: "../../images/module/set/type4.png", img: "type4.png", notifyClass: "" },
                { notifyText: "免提短信", value: 5, hasItem: true, notifyTip: "直接显示70字", notifyImg: "../../images/module/set/type5.png", img: "type5.png", notifyClass: "" }
            //    { notifyText: "", isLine: true },
            //    { notifyText: "不接收通知", value: 0, hasItem: false }
                //0.关闭通知 1.普通短信  2.彩信 3.wap链接 4.长短信 5.免提短信 9:以“通讯录设置”为准
            ]
            }
            else {
                var arr = [
                { notifyText: "短信到达通知", value: 1, hasItem: true, notifyTip: "显示140字", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "短信邮件", value: 4, hasItem: true, notifyTip: "显示350字<br/>收费用户专享", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "彩信到达通知", value: 2, hasItem: true, notifyTip: "支持查看2万字", notifyImg: "../../images/module/set/type4.png", img: "type4.png", notifyClass: "" },
                { notifyText: "免提短信", value: 5, hasItem: true, notifyTip: "直接显示短信（最多70字），需手动保存", notifyImg: "../../images/module/set/type5.png", img: "type5.png", notifyClass: "" }
            //    { notifyText: "", isLine: true },
			//	{ notifyText: "不接收通知", value: 0, hasItem: false }
                //0.关闭通知 1.普通短信  2.彩信 3.wap链接 4.短信邮件 5.免提短信 9:以“通讯录设置”为准
            ]
            }
			if(this.bAcceptNotice){
				arr = arr.concat({ notifyText: "", isLine: true },{ notifyText: "不接收通知", value: 0, hasItem: false });
			}
            return arr;
        },
        templete: {
            defaultText: !top.SiteConfig.mailNotice ? "普通短信" : "短信到达通知",
            typeInfo: [],
            previewHtml: _.template([
                        '<div id="notifyDemo" class="tips notifyTypeTips">',
                            '<div class="tips-text">',
                                '<img src="<%= notifyImg %>" width="150" height="194" alt="到达通知的显示效果" />',
                                '<p><%= notifyTip %></p>',
                            '</div>',
                                '<div class="tipsLeft diamond <%= notifyClass %>">',
                                '</div>',
                            '</div>',
                        '</div>'].join(""))
        },

        PROVINCE: {
            GuangDong: 1,
            YunNan: 2
        },

        UserData: (new M2012.MatrixVM()).createUserData(),

        initialize: function (options) {
            var _this = this;
			_this.bAcceptNotice = options.acceptNotice;
            _this.templete.typeInfo = _this.typeArr();
            _this.model = new Backbone.Model();
            _this.container = options.container || $("body");

            if (typeof (options.showClose) === "boolean") {
                _this.model.set({ showClose: options.showClose });
            } else {
                _this.model.set({ showClose: true });
            }

            if (options.root) {
                var infos = _this.templete.typeInfo;
                for (var i = infos.length; i--; ) {
                    if (infos[i].notifyImg) {
                        infos[i].notifyImg = options.root + "/m2012/images/module/set/" + infos[i].img;
                    }
                }
            }

            _this.reduce(_this);

            _this.menuItems = this._createMenuItems();
            _this.initEvents();

            _this.model.bind('change:value', function (model, value) {
                var infos = _this.templete.typeInfo;
                for (var i = infos.length; i--; ) {
                    if (infos[i].value == value) {
                        _this.model.set({
                            text: infos[i].notifyText,
                            value: infos[i].value
                        });
                        _this.menu.setText(infos[i].notifyText);
                        _this.trigger("change", value);
                        break;
                    }
                }
            });

            _this.render();
        },

        render: function () {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvents: function () {
            var _this = this;
            var model = _this.model;

            _this.menu = M2012.UI.DropMenu.create({
                container: _this.container,
                defaultText: _this.templete.defaultText,
                menuItems: _this.menuItems,
                customClass: "notifyTypePop"
            });

            _this.menu.$el.addClass("dropDown-notify");

            _this.menu.on("change", function (item) {
                model.set({
                    text: item.text,
                    value: item.value
                });

                _this.trigger("change", model.get("value"));
            });

            _this.menu.on("subItemCreate", function (item) {
                $(item.menu.el).removeClass();
                $(item.menu.el).html(item.items[0].html);
            });
        },
        selectedValue: function () {
            return this.model.get("value");
        },
        selectedText: function () {
            return this.model.get("text");
        },
        reset: function () {
            var _this = this;
            _this.menu.enable();
            _this.menu.$el.css("color", "")
            _this.model.set({ value: 1 });
        },

        close: function () {
            var _this = this;
            _this.disable();
            _this.model.set({ value: 0 });
        },

        disable: function () {
            this.menu.disable();
            this.menu.$el.css("color", "#999")
        },

        _createMenuItems: function () {
            var _this = this;
            var typeInfo = _this.templete.typeInfo;
            var previewHtml = _this.templete.previewHtml;

            var showClose = _this.model.get("showClose");
            if (!showClose) {
                typeInfo = typeInfo.slice(0, 5);
            }

            var menuItems = [];
            for (var i = 0; i < typeInfo.length; i++) {
                var item = typeInfo[i];
                var subItem = {};
                if (item.isLine) {
                    subItem = { isLine: true };
                } else {
                    subItem = {
                        text: item.notifyText,
                        value: item.value
                    };

                    if (item.hasItem) {
                        var preview = previewHtml(item);
                        subItem = $.extend(subItem, {
                            items: [{
                                html: preview,
                                showHtml: true
                            }]
                        });
                    }
                }
                menuItems.push(subItem);
            }
            return menuItems;
        },

        reduce: function (_this) {

            var _reduceMenu = function () {
                for (var i = _this.templete.typeInfo.length; i--; ) {
                    if (',3,2,5,'.indexOf(_this.templete.typeInfo[i].value) > -1) {
                        _this.templete.typeInfo.splice(i, 1);
                    }
                }
            };

            var provCode = (function () {
                var _prov = false;

                if (_this.UserData) {
                    _prov = _this.UserData.provCode
                }

                if (!_prov) {
                    _prov = (top.$User ? top.$User.getProvCode() : (top.UserData ? top.UserData.provCode : "1")) || "1";
                }

                return _prov;
            })();

            if (_this.PROVINCE.GuangDong != provCode) {
                _this.templete.typeInfo[2].notifyTip = "支持查看2万字，0.3元/条"; 
            }

            if (_this.PROVINCE.YunNan == provCode) {
                _this.templete.typeInfo[2].notifyTip = "赠送100条/月，超过0.3元/条"; 
            }

            if (top.$User) {
                if (top.$User.isNotChinaMobileUser()) {
                    _reduceMenu();
                }
            } else {
                if (',81,82,83,84,'.indexOf(("," + provCode + ",")) > -1) {
                    _reduceMenu();
                    return;
                }
            }

        }


    })
    );

})(jQuery, _, M139);