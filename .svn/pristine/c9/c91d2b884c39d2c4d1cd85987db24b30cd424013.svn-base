/**
 导入邮件
 * */
M139.namespace("M2012.View.UnfoldSetting",  Backbone.View.extend({
        el: null,
        template: [ '<div class="boxIframeText perdivset">',
 			'<h2><span id="folderTypeName">我的文件夹</span>二级目录显示规则设置：</h2>',
 			'<p><input type="radio" value="2" name="unfold" id="unfold2"><label for="unfold2">总是展开</label></p>',
 			'<p><input type="radio" value="1" name="unfold" id="unfold1"><label for="unfold1">有未读邮件时展开<strong class="c00800" id="rec_unread" style="display:none">(推荐)</strong></label></p>',
 			'<p><input type="radio" value="0" name="unfold" id="unfold0"checked><label for="unfold0">总是折叠<strong class="c00800" id="rec_fold" >(推荐)</strong></label></p>	',
 		'</div>	'].join(""),
        events: {
        },
        initialize: function (options) {
            var self = this;
            this.model = $App.getView("folder").model;
            this.folderType = options.type;//文件夹类型
            console.warn(options);
        },

        render: function () {
            return this.template;
        },
        onRender:function(){
			var self = this;
            var status = this.model.getUnfoldStatus(this.folderType);
            var map = { 0: "#unfold0", 1: "#unfold1", 2: "#unfold2" };
            var $el = $(this.el);
			var thisDialog = this.dialog;
			
            $el.find(map[status]).attr("checked", true);

            var folderTypeMap = {"custom":"我的文件夹","pop":"代收邮箱","tag":"我的标签"};
			var text = folderTypeMap[this.folderType] || '';
            $el.find("#folderTypeName").html(text);
			
			//左下角提示功能
			var linkTemp = '<a href="javascript:;" hidefocus="" id="dialog_foldermanager"><i class="i_set"></i>管理' + text + '</a>';
			var folderEventMap = {
				"custom":function(){$App.show('tags')},
				"pop":function(){$App.show("popmail")},
				"tag":function(){$App.show('tags')}
			};
			var thisTipsEvent = folderEventMap[this.folderType];
			thisDialog.setBottomTip(linkTemp);
			$el.find(".bibText a").click(function (evt) {
			    evt.preventDefault();
				self.dialog.close();
				thisTipsEvent();
				
			});
			
			
            if (this.folderType == "tag") {
                $el.find("#rec_fold").show();
                $el.find("#rec_unread").hide();
            }
            
        },
        button1Click: function () {
            var self = this;
            this.model.setUnfoldStatus(this.folderType, $("[name=unfold]:checked").val(),
                function () {
                    //self.model.set("isFirstLoad", true); //导致设置后不生效
                    $App.trigger("reloadFolder", { reload: true });
					
					//"custom": 0, "tag": 1, "pop": 2
					var tipsText = {
							'custom':'我的文件夹个性化设置成功',
							'tag':'标签个性化设置成功',
							'pop':'代收文件夹个性化设置成功'
						};  
					var text = tipsText[self.folderType] || '';
					text && M139.UI.TipMessage.show(text, { delay:3000 });
					
                    if (self.folderType == 1 || self.folderType == 'custom') {
                        BH("left_inboxSetting_ok");
                    } else if (self.folderType == -3  || self.folderType == 'pop') {
                        BH("left_popSetting_ok");
                    }
                });
        }

    })
);