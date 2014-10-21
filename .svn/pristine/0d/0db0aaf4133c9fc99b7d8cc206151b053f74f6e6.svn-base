/**
右键菜单view
 * */

M139.namespace("M2012.Disk.View", {
	ContextMenu : Backbone.View.extend({
		el : "body",
		template : "",
		events : {},
		initialize : function (options) {
			var self = this;

			this.diskModel = options.model;
			this.fileList = options.fileListView;
			this.contextModel = new M2012.Disk.Model.ContextMenu({
					model : this.diskModel
			});
			//因为dom还没生成，用live监听事件，统一给所有含有右键菜单的容器添加contextMenu事件
			//todo attach event on li
			$("#fileList").live('contextmenu', function (e) {
				var sender = this,thisCheckbox;
				BH("disk3_context");
				var target = e.target;
				//alert(pos.x+","+pos.y);
				thisCheckbox = $(e.target).parents("tr").find("input[type=checkbox]");
				if(thisCheckbox.length == 0){
					if($(e.target).is("li")){
						thisCheckbox = $(e.target).find("input[type=checkbox]");
					}else{
						thisCheckbox = $(e.target).parents("li").find("input[type=checkbox]");
					}	
				}
				if(thisCheckbox.attr('disabled') == 'disabled'){
					return false;
				}
				if (self.model.get("currentMenu")) { //如果上一个菜单还没消失则自动消失，避免出现多个菜单
					self.model.get("currentMenu").remove();
				}
				var menuItems = [];
			//	self.setThisSelected(e);
				menuItems = self.getMailMenu(e);
				
				self.model.set("menuItems", menuItems["data"]);
				self.model.set("menustr", menuItems["menustr"]);
				self.model.set("rightContextString", menuItems["rightContextString"]);
				self.render(e);
				e.stopPropagation();
				e.preventDefault();
				return false; //屏蔽浏览器右键默认行为
			});
			//$("div_maillist").live('contextmenu',function(e){showContextMenu(e,"mail")});


		},
		setThisSelected : function(e){
			var self = this;
			var templi = $(e.target);
			var thisCheckbox = templi.parents("tr").find("input[type=checkbox]");
			if(thisCheckbox.length == 0){
				if(templi.is("li")){
					thisCheckbox = templi.find("input[type=checkbox]");
					templi.addClass("listViewHover").addClass("listViewChecked");
					templi.find(".chackPbar input").show();
				}else{
					thisCheckbox = templi.parents("li").find("input[type=checkbox]");
					templi.parents("li").addClass("listViewHover").addClass("listViewChecked");
					templi.parents("li").find(".chackPbar input").show();
				}
			}
			this.thisCheckbox = thisCheckbox;
			
			
			var fileid = thisCheckbox.attr('fileid');
			this.fileid = fileid;
			var type = thisCheckbox.attr("filetype");
			
			if(self.model.isRootDir(fileid)){
				thisCheckbox.attr("checked", false);
				self.diskModel.set("SelectSysDir",fileid)
			}else{
				thisCheckbox.attr("checked", true);
			}
			
			
			var selectedFids = self.diskModel.get('selectedFids');
			var selectedDirIds = self.diskModel.get("selectedDirIds");
			var selectedDirAndFileIds = self.diskModel.get("selectedDirAndFileIds");
			var shareFileId = self.diskModel.get("shareFileId");
						
			self.diskModel.addOne(fileid, type == self.diskModel.dirTypes.FILE ? selectedFids : selectedDirIds);
			self.diskModel.addOne(fileid, selectedDirAndFileIds);
			self.diskModel.addOne(fileid, shareFileId);
			//记录当前选择的目录类型
			if (type !== self.diskModel.dirTypes.FILE) {
				self.diskModel.changeDirType(type);
			}
			self.fileList.renderSelectCount();//拖动的时候 状态栏
		},
		getMailMenu : function (e) { //邮件列表菜单
			var self = this;
			var isSingle = false; //是否单封 默认是多封邮件一起选中
			
			var thisCheckbox = $(e.target).parents("tr").find("input[type=checkbox]");
			if(thisCheckbox.length == 0){
				if($(e.target).is("li")){
					thisCheckbox = $(e.target).find("input[type=checkbox]");
				}else{
					thisCheckbox = $(e.target).parents("li").find("input[type=checkbox]");
				}	
			}
			var fileid = thisCheckbox.attr('fileid');
			
			var selectedList = this.diskModel.getSelectedDirAndFiles();//获取选中项
			var Mids = [];
			$.each(selectedList,function(){
				Mids.push(this.id);
			});
			if(Mids.length == 1 && Mids[0] == fileid){
				isSingle = true;
			}else{
				if (selectedList.length == 0) { //只有一封被选中 或者已经选中的就是这一封
					isSingle = true;
				self.setThisSelected(e);//只选中这一封
				}else if(($.inArray(fileid, Mids) == -1)){
					//删除其他选中的(可以先全部删除，后面再选中那一封)
					self.model.selectNone(); //内部未选中
					if(self.model.get('listMode')){
						self.model.trigger('reselectIconFiles');
					}else{
						self.fileList.reselectFiles();//渲染未选中
					}
					self.setThisSelected(e);//只选中这一封
					isSingle = true;
				}
			}
			return this.contextModel.getMailMenu(isSingle);

		},
		//获取鼠标的绝对坐标
		getMousePos : function (e) {
			var x,
			y;
			var e = e || window.event;
			return {
				x : e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
				y : e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			};
		},
		render : function (e) {
			var self = this;
			var menuItems = this.model.get("menuItems");
			var menustr = this.model.get("menustr");
			var rightContextString = this.model.get("rightContextString");
			if(!rightContextString){
				return; //如果菜单内容为空，则什么也不做。
			}
			var pos = this.getMousePos(e);
			var menu = $(menustr).appendTo(document.body)
			var left1 = pos.x;
			var top1 = pos.y;
			if(menu.height() + pos.y > $(document).height()){
				top1 = top1 - menu.height();
			}
			menu.css({ left : left1, top : top1});
			menu.find("li").click(function(){
				var command = $(this).attr("command");
				top.$App.trigger("diskCommand", {command : command});
				menu.remove();
			});
			bindAutoHide(menu);
			function bindAutoHide(el) {
				$(el).mouseenter(function () {
					clearTimeout(timerId);
				}).mouseleave(function () {
					dispearInFuture();
				});
				var timerId = -1;
				function dispearInFuture() {
					timerId = setTimeout(function() {
						menu.remove();
					}, 500);
				}
			}
			/*
			var menu = M2012.UI.PopMenu.create({
					width : 150,
					width2 : 180,
					items : menuItems,
					top : pos.y + "px",
					left : pos.x + "px",
					onItemClick : function (item) {
						//alert(item.command);
						var commandArgs = _.clone(item);
						for (elem in item.args) {
							commandArgs[elem] = item.args[elem];
						}
						$App.trigger("mailCommand", commandArgs);
						if (item.args && item.args.bh) {
							BH(item.args.bh);
						}
					}

				});
			
			this.model.set("currentMenu", menu);
			bindAutoHide(menu.el);

			menu.on("itemMouseOver", function (item) {
				if (item.bh2) { //鼠标划过的行为
					BH(item.bh2);
				}
			});
			menu.on("subItemCreate", function (item) { //二级菜单render前触发
				//bindAutoHide(item.menu.el);
				if (item.command == "preview") { //读信预览
					$(item.menu.el).removeClass(); //清除原有菜单样式
					$(item.menu.el).css({
						width : "570px",
						position : "absolute"
					}); //修改宽度
					$(item.menu.el).html(self.getPreviewMail());
				}
				//console.log(item);
			});

			//右键菜单自动消失
			function bindAutoHide(el) {
				$(el).mouseenter(function () {
					clearTimeout(timerId);
				}).mouseleave(function () {
					dispearInFuture();
				});
				var timerId = -1;
				function dispearInFuture() {

					timerId = setTimeout(function () {
							menu.remove();
						}, 500);
				}
			}
			*/

		}
	})
});
