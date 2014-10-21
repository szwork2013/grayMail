/**
 * @fileOverview 定义树目录组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.TreeView.MainView";
    M139.namespace(namespace, superClass.extend(
     /**
      *@lends M2012.UI.TreeView.MainView".prototype
      */
    {
        /** 树目录组件
        *@constructs M2012.UI.TreeView.MainView
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {Array} options.treeViewContainer 定义树视图的容器路径
        *@param {Array} options.nodeTemplate 定义子节点的html结构
        *@param {Array} options.nodeLabel 定义子节点的标题路径
        *@param {Array} options.nodeLabelIcon 定义子节点的图标元素路径
        *@param {Array} options.nodeSwitchButton 定义子节点的展开状态开关元素
        *@param {Array} options.nodes 定义子节点数据源
        *@example
        */
        initialize: function (options) {
            if (options.el) {
                var $el = $(options.el);
                $el.html(options.template);
            } else {
                var $el = jQuery(options.template);
            }

            this.model = new Backbone.Model();
            this.nodes = options.nodes;


            this.setElement($el);

            return superClass.prototype.initialize.apply(this, arguments);
        },

        defaults: {
            name: namespace
        },
        
        render: function () {
            var options = this.options;
            this.treeViewContainer = this.$(options.treeViewContainer);
            

            this.initEvent();
            this.renderNodes();
			this.updatePathTip();
            return superClass.prototype.render.apply(this, arguments);
        },

        initEvent:function(){
            this.model.on("change:selectedNode", function (model,node) {
                var lastNode = model.previous("selectedNode");
              	var curNode = model.get("selectedNode");
                if (lastNode) {
                    lastNode.unselect();
                }
                if(curNode){
	                var curNodeEl = curNode.$el;
	                curNodeEl[0].scrollIntoView();
		            var textEl = $(model.get("selectedNode").$el).find("span").eq(0);

	                textEl.css({
	                    color: "white",
	                    background: "rgb(50,119,222)"
	                });

                }
				
                this.updatePathTip();

            },this);
            
        },
        getSelectPath:function(){
            var node = this.model.get("selectedNode");
            var path = [];
            while (node) {
				if(node.text == "彩云网盘"){
					node.text = "全部文件";
				}
				var nodeId = node.tag.directoryId;
				var nodeText = node.text;
				nodeText = M139.Text.Utils.getTextOverFlow(nodeText, 5, false);//夹断文件夹名;
                path.unshift('<a href="javascript:void(0);" nodeid="'+ nodeId +'">'+ nodeText +'</a>');
				//path.unshift(nodeText);
                node = node.parentNode;
            }
            return path;
        },

        /**
         *上面显示选中的路径
         */
        updatePathTip:function(){
			//debugger;
			var This = this;
           var path = this.getSelectPath();
		// 移动到顶部   
        //   for (var i = 0; i < path.length; i++) {
        //       path[i] = M139.Text.Utils.getTextOverFlow(path[i], 5, false);//夹断文件夹名
        //   }
			var newPath = [];
			var length = path.length;
			if(length > 5){
				newPath = [path[0], path[1], '...', path[length-2], path[length-1]];
			}else{
				newPath = path;
			}
           this.$(".attrsavediskP").html("" + newPath.join(" > "));
            //this.$(".attrsavediskP").text("保存至：彩云网盘");
			this.$(".attrsavediskP a").unbind("click").bind("click",function(){
				var thisid = $(this).attr("nodeid");
				This.options.selectedId = thisid;
				//This.renderNodes();
				This.onNodeSelected(This.containers[thisid]);
			});
        },
		containers:{},
        onNodeSelected:function(node){
            this.model.set("selectedNode", node);
			this.updatePathTip();
        },
        renderNodes: function () {
            var This = this;
            var options = this.options;
		//	debugger;
            var nodesLen = this.nodes.length;
            for (var i = 0; i < nodesLen; i++) {
                var item = this.nodes[i];
                var node = new M2012.UI.TreeView.NodeView({
                    tree: this,
                    depth:0,
                    text: item.text,
                    tag: item.tag,
                    childNodes : item.childNodes,
                    template: options.nodeTemplate,
                    label: options.nodeLabel,
                    labelIcon: "a > i:eq(1)",
                    switchButton: "a > i:eq(0)",
                    childContainer: options.nodeChildContainer,
                    container: this.treeViewContainer,
                    selectedId : options.selectedId, // add by tkh
                    containers : This.containers
                });
                node.render();

                
				if(This.containers[item.directoryId] != 'undefined'){
					This.containers[item.directoryId] = node ;
				}
				// add by tkh 默认选中元素
				if(options.selectedId){
					if(options.selectedId == item.tag.directoryId){
						node.select();
					}
				}else{
					if (node.tag.directoryId === 10) {
	                    node.select();//选中根元素
	                }
				}
            }
        }
    }));
    var DefalutStyle = {
        template: [
 			'<p class="attrsavediskP">',//电影存盘<span class="fsongt">&gt;</span>港台电影
 			'</p>',
 			'<div class="attrsavedisk">',
 			'<ul>',
 			'</ul>',
 			'</div>'].join(""),
        nodeTemplate:['<li>',
            '<a href="javascript:;" class="on txtd"><i class="i_plus"></i><i class="i_wjj"></i><span>text</span></a>',
            '<ul></ul>',
        '</li>'].join(""),
        nodeLabel: "a:eq(0)",
        nodeLabelIcon: "a > i:eq(1)",
        nodeSwitchButton: "a > i:eq(0)",
        nodeChildContainer: "ul",
        treeViewContainer: ".attrsavedisk > ul"
    };

    jQuery.extend(M2012.UI.TreeView, {
        create: function (options) {
            options = _.defaults(options, DefalutStyle);
            return new M2012.UI.TreeView.MainView(options);
        }
    });
})(jQuery, _, M139);