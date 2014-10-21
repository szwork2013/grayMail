M139.namespace("M2012.Folder.View", {
    FolderTag: Backbone.View.extend({
        el: "#tag_list",
        template: ['<a bh="left_tag" hidefocus id="fd_tagStat" href="javascript:"><i name="i_unfold" class="triangle t_blackRight" bh="left_unfoldTag"></i><span>我的标签</span><i class="i_add" title="添加标签" id="btn_addtag" bh="left_createTag"></i><i title="标签个性化设置" class="i_set" id="btn_setTag" onClick="return false"></i></a>',
             '<ul class="small" style="display:none;" id="folder_tag">',
             
               '<!--item start-->',
               '<li fid="$fid"><a href="javascript:" title="@getTitle()" @getStyle()><span class="tagMin@getSpecialTag(1)" style="border-color:@getColor()"><span class="tagBody" style="border-color:@getColor();background-color:@getColor();">@getSpecialTag(2)</span></span>',
               	'<span class="tagText">@maxLength(name,10)@getMailCount() </span></a></li>',
  			  '<!--item end-->',
              '</ul>'].join(""),
        events: {
            "click #tag_list li[fid]": "folderClick",
            "click #btn_addtag":"addTag",
            //"click i[name=i_unfold]": "unfold",
            "click #btn_setTag": "openSetting",
			"click #fd_tagStat": "unfold"
            //"click #fd_tagStat span": "myTagClick"
        },
        initialize: function (options) {
            var self = this;
            this.model = options.model;
            this.isFirstLoad = true;
            this.model.on("folderDataChange", function () { //文件夹数据源发生改变时调用render
                self.render();
            });

        },
        renderStarMail:function(){
            var obj = this.model.getStarObj()//初始化星标邮件
            $("#li_star").attr({ "style": obj.style });
            $("#li_star a").attr("title", obj.title);
            $("#li_star span").html(obj.count);

        },
        render: function () {
            var self = this;
            //this.template=$T.Html.decode($(self.el).html());
            this.getDataSource(function (dataSource) {
               
                var rp = new Repeater(self.template); //传入dom元素，dom元素即做为容器又做为模板字符串
                rp.model = self.model;//重要，赋值model引用，用于自定义函数中使用
                rp.Functions = self.model.renderFunctions;
                var html = rp.DataBind(dataSource); //数据源绑定后即直接生成dom
                $(self.el).html(html);
                //self.renderStarMail();
                var stats = self.model.getMailCount("tag");
                //stats.messageCount+=self.model.get("totalStarCount"); 
                //stats.unreadMessageCount += self.model.get("unreadStarCount");
                var title =stats.unreadMessageCount > 0 ? $T.Utils.format("{0}封未读邮件", [stats.unreadMessageCount]) : "我的标签";
                $("#fd_tagStat").attr("title", title);
                
                if (stats.unreadMessageCount > 0) {
                    //$("#fd_tagStat").css("font-weight", "bold"); //有未读加粗
					var unreadMessageCount = '<var class="fw_b">(' + stats.unreadMessageCount + ')</var>';
                    $("#fd_tagStat span").html($T.Utils.format("我的标签{0}", [unreadMessageCount]));
                }

                var icon = $("#tag_list").find("[name=i_unfold]");
                if (dataSource.length == 0) {
                    //icon.remove();
                }else if (self.model.get("unfoldTag") && icon.hasClass("t_blackRight")) { //原来是展开状态，恢复展开
                    self.unfold({ target: icon });
                }

                if (self.isFirstLoad) {
                    M139.Timing.waitForReady("$App.getConfig('UserAttrsAll')", function (attrs) {
                        self.model.createSpecialTag();
                    });
                }
             
            });
            this.isFirstLoad = false;
        },
        getDataSource: function (callback) {
            var self = this;
            this.model.fetchFolderList(this.model.foldertype.tag, function (result) {
                callback(result); //异步返回值
            });
        },
        addTag: function () {
            $App.trigger("mailCommand", { command: "addTag" });
        	//new M2012.Folder.View.AddTag({model:this.model}).render();
        },
        folderClick: function (event) {
            var element = (event.srcElement || event.target);
            var fidStr = $(element).parents("li[fid]").attr("fid");
            if (fidStr != "") {
                $App.showMailbox(Number(fidStr));
            }
        },
        myTagClick:function(event){
            $App.show("tags");
	    return false;
        },
        openSetting: function () {
            $App.openDialog("个性化设置", "M2012.View.UnfoldSetting", { type: "tag", width: 383, height: 120, buttons: ["确定", "取消"] });
        },
        /***
        * 折叠文件夹
        */
        unfold: function (flag) {
            var self = this;
            
			//点击操作元素不折叠
			var eventElement;
			var _event = flag;
			if(typeof(_event) !== 'boolean'){
				eventElement = _event.srcElement || _event.target;
			}
			if( eventElement && eventElement.id ){
				var elemId = eventElement.id;
				if (elemId === 'btn_addtag' || elemId === 'btn_setTag') {
					return;
				}
			}
			
            var element = $(this.el).find("[name=i_unfold]");
            if (flag==true && element.hasClass("t_blackDown")) {
                return; 
            } else if (flag == false && element.hasClass("t_blackRight")) {
                return;
            }
            element.toggleClass(function (idx, className) {
                element.removeClass(); //移除所有class
                //return className == "i_plus" ? "i_minus2" : "i_plus";
            	return className.indexOf("t_blackRight") > -1 ? "triangle t_blackDown":"triangle t_blackRight";
			});
            
            self.model.set("unfoldTag", element.hasClass("t_blackDown"));
            
            element.parent().next().toggle();

            $App.getView("folder").resizeSideBar();
        }
    })
});