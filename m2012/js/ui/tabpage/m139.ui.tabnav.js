/** 
 * 导航页控件
 * @param {Object} container 左侧导航控件的容器，请传递页面中的dom元素引用
 * @param {Function} onTabChange　导航页切换的回调函数
	var tab = new TabNav({
		container:document.getElementById("#nav"),
		onTabChange:function (item){
		}
	});
	tab.render();
 */
M139.namespace("M139.UI.TabNav", Backbone.View.extend({

	events: {
		"click li.nav-item": "changeTab",
		"click .groupToggleShow": "toggleFold"
	},

	initialize: function(options){
		var tpl = "", html, items, obj = {};

		this.items = [];
		this.onTabChange = options.onTabChange;

		for(var key in options.items) {
			items = options.items[key];
			this.items = this.items.concat(items.data);
			obj[key] = $TextUtils.formatBatch(items.itemTemplate, items.data).join("");
		}
		
		html = $TextUtils.format(options.template, obj);

		var $el = $(html).hide().css("marginLeft", 0);
		$el.appendTo(options.container);
		$el.find("li.nav-item").each(function(index) {
			$(this).attr("nav-index", index);
		});
		this.setElement($el);
	},

	render: function(){
		return this;
	},

	getItems: function(){
		return this.items;
	},

	//切换tab栏
	changeTab: function(e){
		var index = $(e.currentTarget).attr("nav-index") | 0;
		if((typeof index == "number") && index < 0 || index >= this.items.length) {
			return ;
		}
		//$App.show(this.items[index].key);
		var key = this.items[index].key;
		setTimeout(function(){	// IE6, 7下页面加载空白
			$App.show(key);
		}, 0);
		
		this.onTabChange(this.items[index]);
	},

	switchItem: function(key){
		var index, len;
		var items = this.items;
		if(typeof key === "string") {
			for(index=0,len=items.length; index<len; index++){
				if(key === items[index].key) break;
			}
		} else {
			index = key;
		}

		this.$el.find("li a.on").removeClass("on");
		this.$el.find("li.nav-item:eq(" + index + ")>a").addClass("on");
	},

	// 切换组折叠与显示
	toggleFold: function(e) {
		var element = $(e.currentTarget).find("i");
		var jGroup = $(e.currentTarget).next("ul");
		if (element.hasClass('t_blackRight')) {
			jGroup.show();
			element.removeClass("t_blackRight").addClass("t_blackDown");
		} else {
			jGroup.hide();
			element.removeClass("t_blackDown").addClass("t_blackRight");
		}
	},

	hide: function(){
		this.$el.hide();
	},
	show: function(key){
		//$("#sub").hide();
		this.$el.show();
	}
}));
