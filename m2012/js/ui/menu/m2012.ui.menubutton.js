/**
 * @fileOverview 定义弹出菜单按钮组件
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;

	/**
	*@lends M2012.UI.MenuButton.prototype
	*/
	M139.namespace("M2012.UI.MenuButton", superClass.extend({
		/** 菜单按钮组件
	    *@constructs M2012.UI.MenuButton
	    *@extends M139.View.ViewBase
	    *@param {Object} options 初始化参数集
	    *@param {String} options.text 按钮的文本
	    *@param {String} options.template 组件的html代码
	    *@param {HTMLElement} options.container 按钮的容器
	    *@param {Function} options.onClick 按钮的点击回调
	    *@param {Function} options.onItemClick 菜单的点击回调
	    *@param {Array} options.menuItems 菜单项列表
	    *@param {Boolean} options.leftSibling 左侧是否还有按钮，显示竖线不显示圆角
	    *@param {Boolean} options.rightSibling 右侧是否还有按钮，显示竖线不显示圆角
	    *@example
		    M2012.UI.MenuButton.create({
		        text:"按 钮",
		        container:$("#btnContainer"),
		        leftSibling:true, //左边还有按钮，影响样式
		        rightSibling:true, //右边还有按钮，影响样式
		        menuItems:[
		            {
		                text:"xxx",
		                onClick:function(){}
		            }
		        ],
		        onItemClick:function(){
		            alert("itemclick");
		        },
		        onClick:function(){
		            alert("onclick");
		        }
		    });
	    */
		initialize: function(options) {
			var div = document.createElement('div');
			div.innerHTML = options.template;
			this.setElement(div.firstChild);
			return superClass.prototype.initialize.apply(this, arguments);
		},

		name: "M2012.UI.MenuButton",

		render: function() {
			var This = this;
			var options = this.options;
			var html = options.text ? M139.Text.Html.encode(options.text) : options.html;

			this.el.firstChild.innerHTML = html;

			if (options.leftSibling) {
				$D.appendHTML(this.el.firstChild, options.leftSiblingTemplate);
			}

			if (options.menuItems) {
				if (options.menuIconTemplate) {
					var temp = options.onClick ? options.menuIconTemplate : options.menuIconNoSpliterTemplate;
					$D.appendHTML(this.el.firstChild, temp);
				}
			} else {
				options.noMenu(this.$el);
			}

			if (options.rightSibling) {
				var span = this.el.firstChild;
				span = (span.firstChild && span.firstChild.tagName == "SPAN") ? span.firstChild : span;
				$D.appendHTML(span, options.rightSiblingTemplate);
			} else if (!options.onClick && options.rightNoSibling) {
				options.rightNoSibling(this.$el);
			}


			if (options.onClick) {
				this.$el.click(function(e) {
					var menuIcon = This.$el.find(options.menuIconButtonPath)[0];
					var isClickIcon = menuIcon == e.target || (menuIcon && M139.Dom.containElement(menuIcon, e.target));

					if (!isClickIcon) { // 点的不是下拉箭头
						options.onClick();
					} else if (options.onClickBefore) {
						options.onClickBefore(e); //点击下拉箭头触发回调事件, change by Aerojin 2014.04.15
					}

					if ($.browser.msie && $.browser.version <= 8) { // update by tkh IE67 阻止浏览器的默认行为，解决bug：回复转发打开空白写信页
						e.preventDefault();
					}
					//return false;
				});
			} else if (options.menuItems) {
				this.$el.click(function(e) {
					if (options.onClickShow) {
						options.onClickShow(e);
					}
					This.showMenu();

					// 在应用中创建按钮时onclick事件和样式耦合
					// 因此在不需要onclick样式的按钮上记录onclick事件只能放到这里
					var text = $.trim(options.text);
					if (text == "移动到") {
						$App.isReadSessionMail() && BH('cMail_toolbar_move');
					} else if (text == "标记为") {
						$App.isReadSessionMail() && BH('cMail_toolbar_mark');
					}
				});
			}

			if (options.menuItems && options.onClick && options.menuIconButtonPath) {
				this.$el.find(options.menuIconButtonPath).click(function() {
					This.showMenu();
				});
			}

			return superClass.prototype.render.apply(this, arguments);
		},

		/**@inner*/
		showMenu: function() {
			var menu = this.menu;
			var options = this.options;

			if (menu === undefined) {
				this.menu = M2012.UI.PopMenu.create(_.chain(options).pick(["selectMode", "onItemClick", "customClass", "customStyle"]).extend({
					dockElement: this.$el,
					items: options.menuItems,
					hideInsteadOfRemove: true
				}).value());
			} else {
				menu.isHide() ? menu.show() : menu.hide();
			}
		}
	}));

	var DefaultMenuButtonStyle = {
		template: ['<a class="btnTb ml_6" href="javascript:">', '<span class="r pr_25 two"></span>', '</a>'].join(""),
		//下拉图标
		menuIconTemplate: '<span><i class="i_triangle_d"></i></span>',
		//按钮没有自己的onClick的时候，不出现中间那条线，也就不需要多一个span
		menuIconNoSpliterTemplate: '<i class="i_triangle_d"></i>',
		leftSiblingTemplate: '<i class="l-line"></i>',
		rightSiblingTemplate: '<i class="r-line"></i>',
		//当右边没有按钮的时候
		rightNoSibling: function($el) {
			$el.find("span.pr_25")[0].className = "pr_20 p_relative";
		},
		//当没有子菜单的时候
		noMenu: function($el) {
			$el.find("span.pr_25")[0].className = "p_relative";
		},
		menuIconButtonPath: "span > span"
	};


	jQuery.extend(M2012.UI.MenuButton, {
		/**
		*使用常规的样式创建一个菜单实例
		*@lends M2012.UI.MenuButton
		*@see #M2012.UI.MenuButton.prototype.initialize
		*/
		create: function(options) {
			if (!options || !(options.text || options.html) || !options.container) {
				throw "M2012.UI.MenuButton.create:参数非法";
			}
			options = _.defaults(options, DefaultMenuButtonStyle);
			var button = new M2012.UI.MenuButton(options);
			var el = button.render().el;
			var container = options.container || document.body;
			$(container).append(el);
			return button;
		}
	});

})(jQuery, _, M139);