M139.namespace("M2012.Mailbox.View", {
    SearchClassifyItem : Backbone.View.extend({
        el:"",
        template:"",
        events:{
            //"click #search_switchon" : "toggleSearchclassify"
        },
        initialize: function(options){
           var self = this;
           this.el = options.el;
           this.model = options.model;
           this.title = options.title;
           this.data = options.data;
           this.key = options.key;
           this.type = options.type;
        },
        renderContainer:function(){
            var self = this;
			self.itemListEl = $('<div class="dl-text" type="'+ self.type +'"></div>');
			self.dl = $("<dl></dl>");
        //    self.itemNameEl = $('<h3>'+ self.title +'</h3>');
			self.itemNameEl = $("<dt>按<strong>"+self.title+"</strong>筛选</dt>");
            self.dl.append(self.itemNameEl);
            
            $(self.itemListEl).append(self.dl);
            if(self.data.length > 2){
                self.itemToggleEl = $('<a href="javascript:;" current="close" class="showall"><span>显示全部</span><i class="g-down"></i></a>');
                $(self.el).append(self.itemToggleEl);
                self.itemToggleEl.click(function(){
                    self.toggleItemList(this);
					return false; //防止冒泡，刷新页面
                });
            }
			$(self.itemListEl).append(self.itemToggleEl);
			self.el.append(self.itemListEl);
			if(top.$App.getView("mailbox").model.get("layout") == "top"){
				$(".showall").click(function(){
					var div_mail_height = $("#div_mail").height();
					
					var div_searchclassify = $("#div_searchclassify").height();
						if(div_searchclassify > div_mail_height){		
							$("#div_mail").css({"overflow-y":"auto", "height": div_mail_height + "px"});
						}else{
							$("#div_mail").attr("style","").css("height", div_mail_height + "px");
						}
				});
			}
            self.itemListEl.click(function(evt){
                self.changeSearchOptions(evt,this);
            });
        },
        render:function (){
            var self = this;
            this.renderContainer();
            var display = '';
            var list = [];
            var itemel = '';
            var itemdata = '';
            for(var i = 0, len = self.data.length; i<len; i++){
                display = i < 2 ? '' : 'none';
                itemdata = self.data[i];
                if(itemdata.count > 0){
                    itemel = self.createItemEl(display, itemdata);
                    list.push(itemel);
                }
            }
        //    this.itemListEl.append(list.join(''));
			this.dl.append(list.join(''));
		//	if((this.dl).find("dd").length == 1){
		//		this.dl.find("dd").prepend('<a href="javascript:void(0)" class="fr">取消</a>');
		//	}
        },
        createItemEl : function(display, itemdata){
            var title = itemdata[this.key] == '我的帐单' ? '账单中心' : itemdata[this.key];
			//控制为最大18个字符
			var tmpString = title + "(" + itemdata.count + ")";
			var tmpString2 = "";
			if(tmpString.length > 22){
				tmpString2 = tmpString.substr(0,22);
			}else{
				tmpString2 = tmpString;
			}
            var html = ['<dd title="'+ title +'" count="'+ itemdata.count +'" type="'+ this.type +'" val="'+ itemdata[this.type] +'" style="display:'+ display +'">',
                     '<a hidefocus="true" href="javascript:;">',
                     '<span class="scontent">',
                     '<span class="stext">'+ tmpString2 +'</span>',
                //     '<span class="snum"></span>',
                     '</span></a></dd>'].join('');
            return html;
        },
        changeSearchOptions : function(evt,parent){
            var el = evt.target;
            if(el == parent) return;
            top.$App.getView("mailbox_other").model.set("showSearchclassify",true);
        //    var li = $(el).parentsUntil($(parent)).last();
			var li = $(el).parents("dd");
            var title = li.attr('title');
            var count = li.attr('count');
            var type = li.attr('type');
            var val = li.attr('val');
            
            var selected = this.model.get("selected");
            if(!selected){
                selected = {};
            }
            selected[type] = {title:title,count:count};
            this.model.set("selected",selected);
            
            var searchOptions = this.model.get("searchOptions");
            searchOptions.isSearch = 0;
            if(!searchOptions.approachSearch){
                searchOptions.approachSearch = {};
            }
            if(type == 'during'){
                val = this.getDuringVal(title);
            }
            searchOptions.approachSearch[type] = val;
            $App.searchMail(searchOptions); //逼近式搜索
            BH('top_searchClass'+type);
        },
        getDuringVal:function(key){
            var during = {
                '一天内': 'D0,1',
                '一周内': 'W0,1',
                '一月内': 'M0,1',
                '六月内': 'M0,6',
                '一年内': 'Y0,1',
                '五年内': 'Y0,5'
            };
            var myDate = new Date(new Date());//new Date();
            var codes = during[key].split(",");
            switch (codes[0]) {
                case "D0":
                    myDate.setDate(myDate.getDate() - parseInt(codes[1]));
                    break;
                case "W0":
                    myDate.setDate(myDate.getDate() - parseInt(codes[1]) * 7);
                    break;
                case "M0":
                    myDate.setMonth(myDate.getMonth() - parseInt(codes[1]));
                    break;
                case "Y0":
                    myDate.setFullYear(myDate.getFullYear() - parseInt(codes[1]));
                    break;
            }
            return Math.round((myDate) / 1000);
        },
        toggleItemList : function(el){
            var self = this;
            if($(el).attr('current') == 'close'){
                self.dl.find('dd:gt(1)').show();
                $(el).attr('current','open');
                $(el).html('<span>只显示部分项</span><i class="g-up"></i>');
            }else{
                self.dl.find('dd:gt(1)').hide();
                $(el).attr('current','close');
                $(el).html('<span>显示全部</span><i class="g-down"></i>');
            }
        }
    })
});