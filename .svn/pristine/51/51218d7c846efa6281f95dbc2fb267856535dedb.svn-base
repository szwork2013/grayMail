var DocProperty = {
	//提示语
    Messages:{
        Empty       : "文件夹名称不能为空",
        MaxLength   : "最大长度不能超过20字节（10个汉字）",
        InvalidChar : "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatDirName:"文件夹名称不能重复",
        Exception   : "创建文件夹失败，请稍后再试。",
        NotSys      : "不能与系统文件夹重名"
    },
	fileOldName: "",
	pageLoad : function(){
        $("p.dialog-error-tip").hide();
         DiskTool.DialogAuto();
        //加载文件夹下拉框
        DocProperty.Ajax.getInfo();
        //取消
        DocProperty.__clickAnchor("aCancel", function(){
            top.FloatingFrame.close();
        })
        DocProperty.__clickAnchor("aSumbit", function(){
            $("p.dialog-error-tip").hide();
            //检查文件夹合法性
            var dirName = $.trim($(":text").val());
            var invalidMsg = DocProperty.validName(dirName);
            if(invalidMsg){
                $("#errorMsg").html(invalidMsg);
                $("p.dialog-error-tip").show();
                try {
                    //调整对话框高度
                    top.$Msg.getCurrent().resetHeight();
                } catch (e) { }
            } else {
				//判断名字是否改变
				if(DocProperty.fileOldName == dirName) {//相同刚直接关闭
					top.FloatingFrame.close();
				} else {
					//Rename文件夹
					DocProperty.Ajax.rename(dirName, Utils.queryString("id", window.location.href));
				}
            }
        });
        this.resetHeight();
       
	},
	resetHeight:function(){
	    setTimeout(function () { top.$Msg.getCurrent().resetHeight(); }, 100);
	},
	validName : function(name){
        if(name == null){
            return DocProperty.Messages.Empty;
        }
        name = $.trim(name);
        if(name == ""){
            return DocProperty.Messages.Empty;
        }
        //查看长度
        if(name.length > 50) {
            return DocProperty.Messages.MaxLength;
        }
        //查看特殊字符
        //\/:*?"<>|
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
            return DocProperty.Messages.InvalidChar;
        }
        return null;     
    },
	/* Ajax通讯 */
    Ajax: {
		getUserInfo: function(){
            if(!window["cacheUid"]){
                window["cacheUid"] = Utils.queryString("sid", window.location.href)
            }
            return window["cacheUid"];
        },
		//重命名文件夹
		rename: function (dirName, pid) {
			/*界面超时处理*/
            if(Utils.PageisTimeOut(true))return;
            $.postXml({
                url : DiskTool.resolveUrl('renameDirectory', true),
                data: XmlUtility.parseJson2Xml({
                    dirName: dirName,
                    dirId  : pid
                }),
                success: function(result){
                    if(result.code == 'S_OK'){                      
                        //DiskTool.addDiskBehavior(35, 11, 10);
						DiskTool.addDiskBehavior({
							actionId: 35,
							thingId: 0,
							moduleId: 11,
							actionType: 10
						});
                        //刷新页面
                        DiskTool.getDiskWindow().Toolbar.refreshList();
						DiskTool.getDiskWindow().FileList.Render.renderParent();
                        //关闭窗口
                        top.FloatingFrame.close();
                    } else {
                        $("#errorMsg").html(result.summary);
                        $("p.dialog-error-tip").show();
                        setTimeout(function () { top.$Msg.getCurrent().resetHeight(); }, 100);
                    }
                },
                error: function(error){
                    DiskTool.handleError(error);
                }
            });
		},
		getInfo: function(){
            /*界面超时处理*/
            if(Utils.PageisTimeOut(true)) return;
            $.postXml({
                url : DiskTool.resolveUrl("dirdetail", true),
                data: XmlUtility.parseJson2Xml({
                    dirid   : Utils.queryString("id", window.location.href),
                    dirType : 1
                }),
                success: function(result){
                    if(result.code == 'S_OK'){
                       var data = result['var'];
					   //组合路径信息
					    var pathStr = "";
					    if(DiskTool.getDiskWindow().currentNav) {
							var dirNav = DiskTool.getDiskWindow().currentNav;
							for(var i = dirNav.length - 1; i >= 0; i--) {
								pathStr += "/" + dirNav[i].Name;
							}
					    } else {
							pathStr += "/彩云网盘";
					    }
					    var dirName = data.dirname;
					    if (top.$TextUtils) {
					        dirName=top.$TextUtils.getTextOverFlow(data.dirname, 20,"...");
					    }
					    pathStr += "/" + dirName;
                        $("#tdPos").html(Utils.htmlEncode(pathStr));
                        $("#tdSize").html(DiskTool.getFileSizeText(data.totalsize));
                        $("#tdFileInfo").html("{0}个文件夹，{1}个文件".format(data.subdirnum, data.filenum));
                        $(":text").val(data.dirname);
                        $("#tdCtime").html(data.createtime);
						DocProperty.fileOldName = data.dirname;
                    } else {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                    }
                },
                error: function(error){
                    DiskTool.handleError(error);
                }
            });
        }
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
$(function(){
    DocProperty.pageLoad();
    $(":text:first").focus();
});