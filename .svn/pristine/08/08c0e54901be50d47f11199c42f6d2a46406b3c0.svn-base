(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        // el : "#and-contacts-list #contactsPagingBar",

        events : {
            "click a.next" : "nextPage",
            "click a.prev" : "prevPage",
            "click #page-index-caller" : "assignPageIndex"
        },

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#contacts-paging').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            this.model.on("change:pageIndex", this.changePageIndex, this);
            this.model.on("change:maxIndex", this.changeMaxIndex, this);
            this.model.on("change:firstPage", this.changeFirstPage, this);
            this.model.on("change:lastPage", this.changeLastPage, this);
        },

        changePageIndex : function() {
            this.$("label.page-index").text(this.model.get("pageIndex"));
        },

        changeMaxIndex : function() {
            this.$("label.max-index").text(this.model.get("maxIndex"));
            this.$el.toggle(this.model.hasContacts());
        },

        changeFirstPage : function() {
            var firstPage = this.model.get("firstPage");
            var $prev = this.$("a.prev");
            $prev.toggleClass("up-gray", firstPage);
        },

        changeLastPage : function() {
            var firstPage = this.model.get("lastPage");
            var $next = this.$("a.next");
            $next.toggleClass("down-gray", firstPage);
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

        /**
         * 指定分页的页码。
         *
         * @param ev
         */
        assignPageIndex : function(ev) {
            ev.preventDefault();

            var _this = this;
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

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get("totalRecords") === 0) {
                this.$el.hide();
            }
            return this;
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
