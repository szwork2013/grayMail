/**
 邮件列表拖放
 * */
M139.namespace("M2012.Mailbox.View", {
	Drag: Backbone.View.extend({
		initialize: function () {
		    this.model = $App.getMailboxView().model;
		},
		createInstance:function(options){
		    if (!$App.getView("dragmail")) {
		        var view = new M2012.Mailbox.View.Drag();
		        
				$App.registerView("dragmail", view);
		    }
		    var result = $App.getView("dragmail");
		    result.setElement(options.el);
			return result;
		},
		render: function () {
		    var self = this;
			if (!this.created) { //第一次创建拖放元素
			    this.elBasket = $("<div id='dragBasket' style='position:absolute;z-index:9999;display:none'><span class=\"msg msgYellow\"><i class=\"i_t_move\"></i> <span id='dragtips'>移动n封邮件</span></span></div>");
			    $(document.body).append(this.elBasket);
				this.created = true;
			}
			var basket = this.elBasket[0];
			var lastFid = -1;
			var dx = 0; //偏移量，用于判断是否执行了拖放
			var isDrag = false; //是否执行了拖放
			var orignElem; //最初鼠标按下时的那个dom元素
			var isTag=false;//是否是标签文件夹
			$D.setDragAble(basket, {
			    handleElement: self.$el.find("tr[mid]"),//TODO 7ms 优化
                //bounds:[0,0,800,600],
			    onDragStart: function (e) {
			        dx = 0;
			        orignElem = e.target || e.srcElement;
			        if (orignElem) {
			            if ($(orignElem)[0].tagName == "TEXTAREA" || $(orignElem)[0].tagName == "INPUT" || self.model.get('fid') === 7) {
			                return false; //返回false阻止拖动开始
			            } 
			        }
			    },
				onDragMove: function (e) {
				    dx++;
				    if (dx > 10) {

				        self.elBasket.show();
				        $(orignElem).parents("tr").find("input[type=checkbox]").attr("checked", true);
				        lastFid = hitTestFolder(basket);
				        var count = self.getSelectedCount();
				        if (count == 0) { //容错，出现0封邮件的拖放
				            self.elBasket.hide();
				            isDrag = false;
				            return;
				        }
				        $(basket).find("#dragtips").html("移动" + count + "封邮件");
				        if (lastFid > 0) { //命中文件夹
				            var actionText = isTag ? "标记" : "移动" ;
				            $(basket).find("#dragtips").html(actionText + self.getSelectedCount() + "封邮件");
				            $(basket).find(".msg").removeClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_right";
				        } else {
				            $(basket).find(".msg").addClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_move";
				        }
				        isDrag = true;
				    } else {
				        isDrag = false;
				    }
				    //console.warn(result);
				},
				onDragEnd: function (e) {
				    self.elBasket.hide();
				    dx = 0;
				    if (isDrag) {
				        if (lastFid > 0) {
				        	lastFid = Number(lastFid);
				            if (isTag) {
				                console.log("add tag:" + lastFid);
				                $App.trigger("mailCommand", {
				                    command: "tag", labelId: lastFid
				                });
				            } else {
				                console.log("move to:" + lastFid);
				                $App.trigger("mailCommand", {
				                    command: "move", fid: lastFid
				                });
				            }
				        }
				    } 
				}
			});
		    function hitTestFolder (basket) {

		        var result = -1;
		        var isReturn = false;//退出循环标志
		        $("#folder_custom li[fid] a,#folder_main li[fid] a,#folder_pop li[fid] a,#folder_tag li[fid] a").each(function (i, n) {
		            if (!isReturn) {
		                var li = $(n).parents("li").eq(0);
		                if ($D.hitTest(n, basket)) {

		                    if (basket.offsetTop < $("#sb_h").offset().top) {
		                        return;
		                    }
		                    $(n).addClass("on");//高亮背景
		                    result = li.attr("fid");

		                    if ($(n).parents("#folder_tag").length > 0) {
		                        isTag = true;
		                    } else {
		                        isTag = false;
		                    }
		                
		                    isReturn = true;
		                } else {
		                    $(n).removeClass("on");
		                }
		            } else {
		                $(n).removeClass("on");
		            }
		        });
		        if (result == 8 || result == 9) {
		            result = -1;
		        }
		        return result;
		    
		    }
		},
		getSelectedCount:function(){ //选中了几封邮件
		    var resultObj = $App.getCurrentView().model.getSelectedRow(this.$el);
		    return resultObj.mids.length;
		    
		}
		

	})
});