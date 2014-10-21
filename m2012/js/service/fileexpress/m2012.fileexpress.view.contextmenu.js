/**
右键菜单view
 * */

M139.namespace("M2012.Fileexpress.View", {
	ContextMenu : Backbone.View.extend({
		el : "body",
		template : "",
		events : {},
		initialize : function (options) {
			var self = this;

			this.diskModel = options.model;
			this.fileList = options.fileListView;
			this.contextModel = new M2012.Fileexpress.Model.ContextMenu({
					model : this.diskModel
			});
			//因为dom还没生成，用live监听事件，统一给所有含有右键菜单的容器添加contextMenu事件
			//todo attach event on li
			$("#fileList").live('contextmenu', function (e) {
			//	debugger;
				var sender = this,thisCheckbox;
			//	BH("disk3_context");
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
				if(typeof menuItems == "undefined"){
					return;
				}
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
			
			
			var fileid = thisCheckbox.attr('fid');
			this.fileid = fileid;
			var type = thisCheckbox.attr("filetype");
			toggleSelect(thisCheckbox);
			function toggleSelect(target){
        		var mode = self.model.get('listMode');
				if(mode){
					var isSelected = target.attr('checked');
					target.attr('checked', isSelected?false:true);
					self.selectEvent(target);
				}else{
					var isSelected = target.attr('checked');
					target.attr('checked', isSelected?false:true);
					self.selectEvent(target);
				}
        	};
		//	thisCheckbox.attr("checked", true);
			
		//	var selectedFids = self.diskModel.get('selectedFids');
						
		//	self.diskModel.addOne(fileid, type == self.diskModel.dirTypes.FILE ? selectedFids : selectedDirIds);
		//	self.diskModel.addOne(fileid, selectedDirAndFileIds);
		//	self.diskModel.addOne(fileid, shareFileId);
			//记录当前选择的目录类型
		//	if (type !== self.diskModel.dirTypes.FILE) {
		//		self.diskModel.changeDirType(type);
		//	}
		//	self.fileList.renderSelectCount();//拖动的时候 状态栏
		},
		// 复选框单击事件
        selectEvent : function(target){
        	var self = this;
    		var fid = target.attr('fid');
			var selectedFids = self.model.get('selectedFids');
			// 保存 / 清除 选中文件的ID
			self.model.toggle(fid, selectedFids);
			// 渲染文件数量
			self.fileList.renderSelectCount();
			// 图标模式还需改变li的class属性
			var mode = self.model.get('listMode');
			if(mode){
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
				}else{
					target.parents('li').attr('class', 'listItem listViewHover');
				}
			}
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
			if(thisCheckbox.length == 0){
				return;
			}
			var fileid = thisCheckbox.attr('fid');
			var selectedList = this.diskModel.getSelectedFiles();//获取选中项
			var Mids = [];
			$.each(selectedList,function(){
				Mids.push(this.fid);
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
					
				//	if(self.model.get('listMode')){
						self.fileList.reselectFiles();//渲染未选中
				//	}else{
				//		self.fileList.reselectFiles();//渲染未选中
				//	}
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
				top.$App.trigger("cabinetCommand", {command : command});
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
		}
	})
});