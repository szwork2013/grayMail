M139.namespace("M2012.Mailbox.View", {
    SearchClassifyChoosed : Backbone.View.extend({
        el:"",
        template:"",
        events:{
        },
        initialize: function(options){
           var self = this;
           this.el = options.el;
           this.model = options.model;
        },
        renderContainer:function(){
            var self = this;
        //    self.listContainer = $('<ul></ul>');
        //    $(self.el).append(self.listContainer);
        //    self.cancelEl = $('<a href="javascript:;" class="a_open">取消</a>');
        //    $(self.el).append(self.cancelEl);
        //    self.addEvent();
        },
        render:function (){
            var self = this;
            this.renderContainer();
            var selected = this.model.get("selected");
			var keys = [];
			var values = [];
            var list = [];
            for(var key in selected){
				var tmphtml = self.createItemEl(key, selected[key]);
				//找到之前的列表删除，加入新的被点击的，并且去掉尾部的“显示全部”链接
				$(self.el).find("div[type='"+ key +"']").find("dd").remove().end().find("dl").append(tmphtml).next("a").remove();
            //    list.push(self.createItemEl(key, selected[key]));
            }
        //    this.listContainer.append(list.join(''));
			self.addEvent();
        },
        addEvent: function(){
            var self = this;
			/*
            self.listContainer.click(function(evt){
                var $el = $(evt.target);
                var isCancel = $el.attr('rel') == 'cancel';
                if(isCancel){
                    var $ul = $(this);
                    if($ul.children().length > 1){
                        var type = $el.attr('type');
                        self.cancel(type);
                    }else{
                        self.cancelAll();
                    }
                }
            });
            //取消全部
            self.cancelEl.click(function(){
                self.cancelAll();
            });
			*/
			//取消的事件按钮
			$(".earch-end-text").find("a[rel]").click(function(e){
			//	console.log(e.target);
				var $target = $(e.target); 
				var relType = $target.attr("rel");
				if(relType != ""){
					self.cancel(relType);
				}
				return false;//防止冒泡
				
			});
        },
        createItemEl:function(type, itemdata){
            var html = ['<li class="sela" title="'+ itemdata.title +'">',
                '<a hidefocus="true" href="javascript:;">',
                '<span class="scontent">',
                '<span class="stext">'+ itemdata.title +'</span>',
                //'<span class="snum">('+ itemdata.count +')</span>',
                '</span><i class="i_u_close" type="'+ type +'" rel="cancel"></i></a></li>'].join('');
			var tmpString = itemdata.title + "(" + itemdata.count + ")";
			var tmpString2 = "";
			if(tmpString.length > 18){
				tmpString2 = tmpString.substr(0,18);
			}else{
				tmpString2 = tmpString;
			}
			var html2 = '<dd title="' + tmpString + '"><a href="javascript:void(0)" rel="'+ type +'" class="fr">取消</a>' + tmpString2 +'</dd>';
            return html2;
        },
        cancel:function(type){
            var searchOptions = this.model.get("searchOptions");
            var approachSearch = searchOptions.approachSearch;
            var selected = this.model.get('selected');
            delete selected[type];
            delete approachSearch[type];
            this.model.set('selected',selected);
            searchOptions.isSearch = 1;
            $App.searchMail(searchOptions); //逼近式搜索
        },
        cancelAll:function(){
            var searchOptions = this.model.get("searchOptions");
            delete searchOptions.approachSearch;
            this.model.set('selected',null);
            searchOptions.isSearch = 1;
            $App.searchMail(searchOptions); //逼近式搜索
        }
    })
});