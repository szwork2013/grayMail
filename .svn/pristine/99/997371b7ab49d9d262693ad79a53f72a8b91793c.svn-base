/**
 网盘拖拽实现移动到功能
 * */
M139.namespace("M2012.Disk.View", {
	Drag: Backbone.View.extend({
		initialize: function (options) {
		//	this.model = $App.getView("mailbox").model;
		//	this.model = new M2012.Disk.Model();
			this.model = options.model;
		},
		createInstance:function(self,options){
		//	debugger;
		//	if (!top.$App.getView("dragdisk")) {
				top.$App.registerView("dragdisk", new M2012.Disk.View.Drag(options));
		//	}
			this.fileList = self;
			return top.$App.getView("dragdisk");
		},
		alert1: function(){
			alert("alert1");
		},
		render: function () {
		//	console.log(321123);
		    var self = this;
			if (!this.created) { //第一次创建拖放元素
			    this.el = $("<div id='dragBasket' style='position:absolute;z-index:9999;display:none'><span class=\"msg msgYellow\"><i class=\"i_t_move\"></i> <span id='dragtips'>移动n个文件</span></span></div>");
				$(document.body).append(this.el);
				this.created = true;
			}
			var basket = this.el[0];
			var lastFid = -1;
			var dx = 0; //偏移量，用于判断是否执行了拖放
			var isDrag = false; //是否执行了拖放
			var orignElem; //最初鼠标按下时的那个dom元素
			var repeaterRender = true; //拖动的时候某些渲染和显示只显示一次，避免多余显示
			var listMode = self.model.get("listMode");
			var handleElement = $("#fileList2").find("tr[fileid]");
			if(listMode == 1){
				handleElement = $("#fileList").find("li[fileid]");
			}
			$D.setDragAble(basket, {
			    handleElement: handleElement,//TODO 7ms 优化
                //bounds:[0,0,800,600],
			    onDragStart: function (e) {
			        dx = 0;
					console.log("begin!");
			        orignElem = e.target || e.srcElement;
			        if (orignElem) {
			            if ($(orignElem)[0].tagName == "INPUT") {
			                return false; //返回false阻止拖动开始
			            } 
			        }
			    },
				onDragMove: function (e) {
				    dx++;
				    if (dx > 10) {
						console.log("moveing!");
				        self.el.show();
						if(repeaterRender){
							
							var thisCheckbox = $(orignElem).parents("tr").find("input[type=checkbox]");
							if(listMode == 1){
								thisCheckbox = $(orignElem).parents("li").find("input[type=checkbox]");
							}
							if(!thisCheckbox.prop("disabled")){
							
							//	console.log(thisCheckbox);
								thisCheckbox.attr("checked", true);
							//	thisCheckbox.click();
								var fid = thisCheckbox.attr('fileid');
								var type = thisCheckbox.attr("filetype");
								var selectedFids = self.model.get('selectedFids');
								var selectedDirIds = self.model.get("selectedDirIds");
								var selectedDirAndFileIds = self.model.get("selectedDirAndFileIds");
								var selectedDirType = self.model.get("selectedDirType");
								var shareFileId = self.model.get("shareFileId");
								//var startEle = model.get('startEle');

								// 保存 / 清除 选中文件或者目录的ID
								self.model.addOne(fid, type == self.model.dirTypes.FILE ? selectedFids : selectedDirIds);
								self.model.addOne(fid, selectedDirAndFileIds);
								self.model.addOne(fid, shareFileId);
								//记录当前选择的目录类型
								if (type !== self.model.dirTypes.FILE) {
									self.model.changeDirType(type);
								}
							//	self.fileList.selectEvent($(orignElem).parents("tr").find("input[type=checkbox]"));//拖动的时候，把选择的数据加到model里
							//	self.fileList.renderSelectCount();//拖动的时候 状态栏
								self.model.trigger("renderSelectCount");
								repeaterRender = false;
							}

						}
				        lastFid = hitTestFolder(basket);
					//	console.log(1111);
					//	console.log(self.model.get("selectedFids"));
					//	console.log(self.model.get("selectedDirIds"));
					//	console.log(2222);
					//	console.log("aa");
					//	console.log($("#dragBasket").offset());
					//	console.log("bb");
					//	console.log(lastFid + "123");
				        $(basket).find("#dragtips").html("移动" + self.getSelectedCount() + "个文件");
						/*
				        if (lastFid > 0 && lastFid != 8 & lastFid != 9) { //命中文件夹
				            var actionText = isTag ? "标记" : "移动" ;
				            $(basket).find("#dragtips").html(actionText + self.getSelectedCount() + "封邮件");
				            $(basket).find(".msg").removeClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_right";
				        } else {
				            lastFid = null;
				            $(basket).find(".msg").addClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_move";
				        } */
						if(lastFid){
							$(basket).find(".msg").removeClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_right";
						}else{
							lastFid = "";
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
				    self.el.hide();
				    dx = 0;
					repeaterRender = true;
				//	console.log("end!");
				//	console.log('1-' + lastFid + '-2');
				    if (isDrag) { 
				        if (lastFid) {
							//top.$App.trigger("diskCommand", args);
							self.requestDiskFileMove(lastFid);
				        }
				    } 
				}
			});
		    function hitTestFolder (basket) {

		        var result = "";
		        var isReturn = false;//退出循环标志
				var trs = $("#fileList2 tr[fileid]");
				if(listMode == 1){
					trs = $("#fileList li[fileid]");
				}
		        trs.each(function (i, n) {
		            if (!isReturn) {
		                var input = $(n).find("input[filetype='1']");
						
		                if ($D.hitTest(n, basket)) {
		                    $(n).addClass("on");//高亮背景
						//	console.log("a");
						//	console.log($(n).offset());
		                //  console.log("b");
							result = input.attr("fileid");
		                
		                    isReturn = true;
		                } else {
		                    $(n).removeClass("on");
		                }
		            } else {
		                $(n).removeClass("on");
		            }
		        });
		        return result;
		    
		    }
		},
		getSelectedCount:function(){ //选中了几封邮件
		    var resultObj = this.model.get("selectedFids").length + this.model.get("selectedDirIds").length;
		    return resultObj;
		    
		},
		//彩云文件/文件夹移动
        requestDiskFileMove: function (dirId) {
            var self = this;
            var dirId = String(dirId);
            var requestData = {
                fileIds: self.model.get("selectedFids").join(","),
                directoryIds: self.model.get("selectedDirIds").join(","),
                srcDirType: 1,
                toDirectoryId: dirId,
                toDirType: 0
            };

            top.M139.UI.TipMessage.show("正在移动...");
            M139.RichMail.API.call("disk:move", requestData, function (response) {
                top.M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
					self.model.trigger('refresh', null);
                } else {
                    var error = response.responseData.summary;
                    top.$Msg.alert(error, {ico: "warn"});
                }
            });
        }
	})
});