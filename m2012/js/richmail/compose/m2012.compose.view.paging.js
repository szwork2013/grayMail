/**
* @fileOverview 分页视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Paging', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "",
        name : "paging",
        events: {
            "click #prevpage" : "goToPrevPage",
            "click #nextpage" : "goToNextPage"
        },
        template: ['<div class="letterPaginationBox">',
                        '<p class="letterPaginationBox_link">',
                            '<a id="prevpage" href="javascript:;">上页</a>',
                            '<a id="curpage" href="javascript:;" class="pagenum ml_5">',
                                '<span class="pagenumtext">1/1</span>',
                            '</a>',
                            '<a id="nextpage" href="javascript:;">下页</a>',
                        '</p>',
                   '</div>'].join(''),
        
        initialize: function (options) {
            this.pages = options && options.pages ? options.pages : 1;
            this.init();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var self = this;
            this.on('pageChange',function(){
                self.setPage();
                if(self.callback) self.callback(self.currentPage);
            });
        },
        setPage : function(){
            var pagenumtext = this.currentPage + '/' + this.pages;
            this.$el.find('.pagenumtext').text(pagenumtext);
            if(this.currentPage == 1){
                this.$el.find('#prevpage').addClass("gray");
            }else{
                this.$el.find('#prevpage').removeClass("gray");
            }
            if(this.currentPage == this.pages){
                this.$el.find('#nextpage').addClass("gray");
            }else{
                this.$el.find('#nextpage').removeClass("gray");
            }
        },
        init : function(){
            this.$el = jQuery(this.template);
            var container = $('.letterPage');
            this.$el.appendTo(container);
        },
        // 初始化分页
        initPaping : function(){
            var self = this;
            this.currentPage = 1;
            var pageMenu = [];
            var pages = self.pages;
            for(var i = 0; i < pages; i++) {
                var pageMenuItem = {
                    text : (i+1) + "/" + pages,
                    value : i+1
                };
                pageMenu.push(pageMenuItem);
            }
            self.$el.find("#curpage").unbind('click');
            M2012.UI.PopMenu.createWhenClick({
                target : self.$el.find("#curpage"),
                container : document.body,
                width : 80,
                maxHeight : 236,
                items : pageMenu,
                onItemClick : function(item){
                    self.currentPage = item.value;
                    self.trigger('pageChange');
                }
            });
        },
        render : function(pages,callback){
            this.pages = pages;
            this.callback = callback;
            this.initPaping();
            this.setPage();
        },
        goToPrevPage : function (e){
            if(this.currentPage > 1){
                this.currentPage--;
                this.trigger('pageChange');
            }
        },
        goToNextPage : function (e){
            if(this.currentPage < this.pages){
                this.currentPage++;
                this.trigger('pageChange');
            }
        }
    }));
})(jQuery, _, M139);

