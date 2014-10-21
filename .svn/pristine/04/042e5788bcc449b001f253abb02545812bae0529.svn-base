/**
 * @fileOverview 定义树组件的节点视图
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.TreeView.NodeView";
    M139.namespace(namespace, superClass.extend(
     /**
      *@lends M2012.UI.TreeView.NodeView".prototype
      */
    {
        /** 树组件的节点视图
        *@constructs M2012.UI.TreeView.NodeView
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {String} options.childContainer 子节点容器路径
        *@param {String} options.label 标题元素
        *@param {String} options.labelIcon 图标元素
        *@example
        */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.tree = options.tree;
            this.tag = options.tag;
            this.depth = options.depth;
            var opened = options.opened === true;
            if (!options.parentNode) {
                opened = true;//根节点默认展开
            }
            this.model.set("opened", opened);

            var $el = jQuery(options.template);
            this.setElement($el);

            this.parentNode = options.parentNode;

            return superClass.prototype.initialize.apply(this, arguments);
        },

        defaults: {
            name: namespace
        },

        render: function () {
            var options = this.options;
            if(options.container){
                this.$el.appendTo(options.container);
            }else{
                this.$el.appendTo(this.parentNode.childContainer);
            }

            this.label = this.$(options.label);
            if(options.text !== '彩云网盘'){
	            this.label.css('paddingLeft',this.depth*22+10+"px")
            }
            this.labelIcon = this.$(options.labelIcon);

            this.switchButton = this.$(options.switchButton);

            this.childContainer = this.$(options.childContainer);
            this.childNodes = options.childNodes;
            
            this.setText(options.text);

            this.childContainer = this.$(options.childContainer);


            this.bindEvent();


            this.renderChildNodes();
            this.renderSwitchStatus();

            if (!this.childNodes || this.childNodes.length == 0) {
                this.switchButton.css("visibility", "hidden");
            }
            

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *初始化绑定事件
         *@inner
         */
        bindEvent: function () {
            var This = this;

            this.label.click(function (e) {
                This.onLabelClick(e);
            });
            this.model.on("change:opened", function () {
                This.renderSwitchStatus();
            }).on("change:selected", function () {
                This.renderSelectedMode();
            });;



            this.label.dblclick(function (e) {
                This.toggleNode();
            });
            this.switchButton.click(function (e) {
                This.toggleNode();
            });
        },

        toggleNode:function(){
            this.model.set("opened", !this.model.get("opened"));
        },

        onLabelClick: function (e) {
            this.select();
        },

        select:function(){
            this.model.set("selected", true);
		//	debugger;
			var thisSelectId = this.tag && this.tag.directoryId;
			top.$App && top.$App.setCustomAttrs("diskSelectId",thisSelectId);
            this.tree.onNodeSelected(this);
			
        },

        unselect:function(){
            this.model.set("selected", false);
        },

        /**
         *组装子节点界面
         *@inner
         */
        renderChildNodes: function () {
            var options = this.options;
            var childNodes = this.childNodes;
            if (childNodes) {
                for (var i = 0; i < childNodes.length; i++) {
                    var info = childNodes[i];
                    var node = new M2012.UI.TreeView.NodeView({
                        parentNode:this,
                        tree: this.tree,
                        text: info.text,
                        tag: info.tag,
                        depth: this.depth + 1,
                        label: options.label,
                        template: options.template,
                        label: options.label,
                        labelIcon: "a > i:eq(1)",
                        switchButton: "a > i:eq(0)",
                        childContainer: options.childContainer,
                        childNodes: info.childNodes,
                        parentNode: this,
                        containers : options.containers,
                        selectedId : options.selectedId
                    });
                    
                    node.render();
					if(options.containers[info.tag.directoryId] != 'undefined'){
						options.containers[info.tag.directoryId] = node ;
					}
                    // add by tkh 
                    if(options.selectedId == info.tag.directoryId){
	                    var parentNode = node.parentNode;
	                    while(parentNode){
		                    parentNode.model.set("opened", true);
		                    parentNode = parentNode.parentNode;
	                    }
						node.select();
					}
                }
            }
        },
        /**
         *设置节点的文本标题
         */
        setText: function (text) {
            this.text = text;
            this.label.find("span").text(text);
            //this.labelIcon[0].className = this.model.getLabelIcon(text);
        },

        renderSwitchStatus: function () {
            if (this.model.get("opened")) {
                this.label.addClass("on");
                this.childContainer.show();
            } else {
                this.label.removeClass("on");
                this.childContainer.hide();
            }
        },
        renderSelectedMode: function () {
            var selected = this.model.get("selected");
            var textEl = this.label.find("span");
            if (selected) {
                textEl.css({
                    color: "white",
                    background: "rgb(50,119,222)"
                });
            } else {
                textEl.css({
                    color: "",
                    background: ""
                });
            }
        }
    }))

})(jQuery, _, M139);