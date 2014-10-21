(function ($, _, M) {

    //通讯录公共组件类
    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Kit";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        TIP: {},

        template: {
            tip: '<div class="tipsOther tip_{0}" tabindex="0" hidefocus="true" style="position: absolute; outline: none; left: 141px; top: 81px; z-index: 9999;">\
                        <div class="tips-text content_{0}">{1}</div>\
                        <div class="tipsBottom  diamond" style="left:10px"></div>\
                </div>'
        },

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;           
            
            this.initUI();
            superClass.prototype.initialize.apply(_this, arguments);
        },
        initUI: function(){

            this.ui = {};
            this.ui.el = this.$el;
        },
        initEvents: function () {
            var _this = this;
        },
        render: function () {
              
        },
        showTip: function(text, dom, options){
            var _this = this;
            var height = 30;
            var offset = dom.offset();
            var sTop = offset.top - height;
            var template = this.template.tip;
            
            if(this.delay){
                clearTimeout(this.delay);
            }

            if(!this.tip){
                this.tip = $(template.format(this.cid, text));
                this.$el.append(this.tip);
            }

            if(options && options.delay){
                this.delay = setTimeout(function(){
                    _this.hideTip();
                }, options.delay);
            }
            
            this.tip.find('.content_' + this.cid).text(text);
            this.tip.css({left: offset.left, top: sTop}).show();
            return this.tip;
        },
        hideTip: function() {
            this.$el.find('.tip_' + this.cid).hide();
        }

        
    }));
})(jQuery, _, M139);