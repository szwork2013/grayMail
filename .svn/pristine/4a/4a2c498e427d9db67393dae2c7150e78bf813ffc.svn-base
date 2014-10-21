var CreateDoc = {
	/*提示语对象s*/
    Messages:{
        Empty        : "文件夹名称不能为空",
        MaxLength    : "最大长度不能超过20字",
        InvalidChar  : "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatDirName: "文件夹名称不能重复",
        Exception    : "创建文件夹失败，请稍后再试。",
        Level        : "文件夹层级不能超过5层",
        NotSys       : "不能与系统文件夹重名"
    },
	init: function() {
		$("p.dialog-error-tip").hide();
        DiskTool.DialogAuto();
		//加载文件夹下拉框
        CreateDoc.Ajax.getAllDirectory();
		//取消事件
        CreateDoc.__clickAnchor("aCancel", function(){
            top.FloatingFrame.close();
        });
		CreateDoc.__clickAnchor("aSumbit", function(){
            $("p.dialog-error-tip").hide();
            
            //检查文件夹合法性
            var dirName = $.trim($("#txtName").val());
            var invalidMsg = CreateDoc.validName(dirName);
            if(invalidMsg){
                $("#errorMsg").html(invalidMsg);
                
                CreateDoc.showTip();
            }
            else {
                //新增文件夹
                var select = $.getById("docPosition", true);
                var selectedPid = select.options[select.selectedIndex].value;
                CreateDoc.Ajax.create(dirName, selectedPid);
            }
        });
	},
	showTip: function () {
	    $("p.dialog-error-tip").show();
	    setTimeout(function () {
	        top.$Msg.getCurrent().resetHeight();
	    }, 100);
	},
	/*Ajax对象*/
	Ajax: {
		/*生成新建文件时的下拉框目录*/
		getAllDirectory: function() {
			$.postXml({
				url : DiskTool.resolveUrl("dirsort", true),
				success: function(result) {
					if(result.code == "S_OK") {
						var dirData = result['var'].dirs;
						var select = $("#docPosition");
						select.empty();
						var selectedIndex = 0;
						var pid = Utils.queryString("pid", window.location.href);                        
						if(pid == null || pid == ""){
							selectedIndex = 0;
						}
						var domSelect = select[0];
						//添加我的彩云的option
						var opMain = new Option(DiskConf.rootDirName, DiskConf.diskRootDirID);
						domSelect.options.add(opMain);
						//添加用户文件夹的option
						var cancelNum = 0;//相册和文件夹占有的数量
						for(var i = 0, len = dirData.length; i < len; i++) {
							var single = dirData[i];
							var strHtml = "";
							if(single.dirid != 20 && single.dirid != 30 && single.parentdir != 20 && single.parentdir != 30) {
								cancelNum ++;
								for(var j = 0; j < single.dirlevel; j++) {
									strHtml += "   ";
								}
								strHtml += "|--" + single.dirname;
								var op = new Option(strHtml, single.dirid);
								if(op.innerHTML) {
									op.innerHTML = DiskTool.replace(strHtml.encode(), " ", "&nbsp;");
								}
								if(selectedIndex == 0 && single.dirid == pid){
									selectedIndex = cancelNum;//去掉我的彩云所占去的index
									op.selected = true;
								}
								domSelect.options.add(op);
							} 
						}
						domSelect.selectedIndex = selectedIndex;
					}
				}
			});
		},
		/*创建文件夹*/
		create: function (dirName, pid) {
		    var self = this;
			/*界面超时处理*/
            if(Utils.PageisTimeOut(true)) return;
			$.postXml({
				url : DiskTool.resolveUrl("addDirectory", true),
                data: XmlUtility.parseJson2Xml({
                    parentDirId: pid,
                    dirName    : dirName
                }, true),
				success: function(result) {
					if(result.code == DiskConf.isException) {
						DiskTool.FF.alert(result.summary);
					} else if(result.code == DiskConf.isError) {
						$("#errorMsg").html(result.summary);
						CreateDoc.showTip();
					} else {//创建成功
						DiskTool.addDiskBehavior({
							actionId: 39,
							thingId: 0,
							moduleId: 11,
							actionType: 10
						});
						//刷新页面
						if(DiskTool.getDiskWindow() && DiskTool.getDiskWindow().parent) {
							DiskTool.getDiskWindow().parent.Event.refreshData(result['var'].id, 0);
						}
						//进入新目录
						var ridectUrl = "disk_default.html?ty=0&id=" + result['var'].id;
						DiskTool.getDiskWindow().location.href = top.M139.Text.Url.getAbsoluteUrl(ridectUrl, location.href);
						//关闭窗口
                        top.FloatingFrame.close();
					}
				},
				error: function(error){
                    DiskTool.handleError(error);
                }
			});
		}
	},
	/*验证文件夹名称*/
	validName: function(name){
        if(name == null) {
            return CreateDoc.Messages.Empty;
        }
        name = $.trim(name);
        if(name == ""){
            return CreateDoc.Messages.Empty;
        }
        //查看长度
        if(name.length > 20) {
            return CreateDoc.Messages.MaxLength;
        }
        //查看特殊字符 (\/:*?"<>|)
        function checkOtherChar(str) {
            for(var loop_index = 0; loop_index < str.length; loop_index++){ 
                if(str.charAt(loop_index) == '*' 
                ||str.charAt(loop_index) == '|' 
                ||str.charAt(loop_index) == ':' 
                ||str.charAt(loop_index) == '"' 
                ||str.charAt(loop_index) == '<' 
                ||str.charAt(loop_index) == '>' 
                ||str.charAt(loop_index) == '?' 
                ||str.charAt(loop_index) == '\\' 
                ||str.charAt(loop_index) == '\'' 
                ||str.charAt(loop_index) == '/'){ 
                    return false; 
                } 
            }
            return true;
        }
        if(!checkOtherChar(name)){
            return CreateDoc.Messages.InvalidChar;
        }
        return null;    
    },
	/* 私有方法 */
    __clickAnchor: function(id, action){
        $.getById(id).click(function(e){
            if(action){
                action();
            }
            e.preventDefault();
        });
    }
}

/*页面初始化入口*/
$(function(){
    CreateDoc.init();
    $(":text:first").focus();
});