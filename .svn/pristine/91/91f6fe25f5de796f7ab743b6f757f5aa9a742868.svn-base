(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contactsPagingBar",

        events : {
            "click a.next" : "nextPage",
            "click a.prev" : "prevPage",
            "click #page-size-caller" : "togglePageSizeConfig",
            "click #page-index-caller" : "assignPageIndex",
            "click a.Page-size" : "configPageSize",
            "mouseleave #page-size-container" : "closePageSizeConfig"
            // TODO
            // "mouseleave #page-size-caller":"closePageSizeConfig"
        },

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#contacts-paging').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            this.model.on("change", this.render, this);
        },

        initEvents : function() {
            var _this = this;

        },

        nextPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex < maxIndex) {
                this.model.set("pageIndex", pageIndex + 1);
            }
        },

        prevPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex > 1) {
                this.model.set("pageIndex", pageIndex - 1);
            }
        },

        togglePageSizeConfig : function(ev) {
            ev.preventDefault();
            $("#page-size-container").toggle();
        },

        assignPageIndex : function(ev) {
            ev.preventDefault();

            var _this = this;
            var This = this;
            //显示下拉菜单
            var popup = M139.UI.Popup.create({
                target : this.$("#page-index-caller"),
                width : 135,
                buttons : [{
                    text : "确定",
                    cssClass : "btnNormal",
                    click : function() {
                        var $inputIndex = popup.contentElement.find("input:text");
                        var index = new Number($inputIndex.val());
                        var maxIndex = new Number(_this.model.get("maxIndex"));
                        if (index > maxIndex) {
                            index = maxIndex;
                        } else if (index < 1) {
                            index = 1;
                        }
                        $inputIndex.val(index);
                        _this.model.set("pageIndex", index);

                        popup.close();
                    }
                }],
                content : '<div style="padding-top:15px;">跳转到第 <input type="text" style="width:30px;"/> 页</div>'
            });
            popup.render();
            popup.contentElement.find("input:text").keyup(function(e) {
                this.value = this.value.replace(/\D/g, "");
            }).focus();
            M139.Dom.bindAutoHide({
                element : popup.contentElement[0],
                stopEvent : true,
                callback : function() {
                    popup.contentElement.remove();
                }
            });
        },

        configPageSize : function(ev) {
            ev.preventDefault();

            var newPageSize = $(ev.currentTarget).find("span").text().trim();
            var pageSize = this.model.get("pageSize");
            if (newPageSize == pageSize) {
                $("#page-size-container").hide();
            } else {
                this.model.set({
                    pageSize : newPageSize,
                    pageIndex : 1
                });
            }
        },

        closePageSizeConfig : function(ev) {
            ev.preventDefault();
            $("#page-size-container").hide();
        },

        render : function() {
            this.logger.debug("rendering...");
            if (this.model.get("totalRecords") === 0) {
                this.$el.empty();
            } else {
                this.$el.html(this.template(this.model.toJSON()));
            }
            return this;
        },

        dispose : function() {

        }
    }));

    // $(function() {
    // var model = new M2012.Addr.Model.Contacts.Paging();
    // new M2012.Addr.View.Contacts.Paging({
    // model : model
    // }).render();
    // });

})(jQuery, _, M139);
