M139.namespace("M2012.Folder.View", {
FolderCustom :Backbone.View.extend({
el: "#customfolder_list",     

template: ['<a bh="left_foldermanager" hidefocus id="folder_inbox" href="javascript:;"  >',
				'<i name="i_unfold" class="triangle t_blackRight" bh="left_unfoldInbox"></i>',
                '<span>我的文件夹</span>',
				'<i class="i_add" id="btn_addfolder" bh="left_createFolder" title="添加文件夹"></i>',
				'<i class="i_set" id="btn_setCustom" bh="left_inboxSetting" onClick="return false" title="我的文件夹个性化设置"></i>',
			'</a>',
			'<div id="folder_custom" style="display:none">',
			   '<ul class="small" style="display:block;">',
               '<!--item start-->',
               '<li fid="$fid"><a hidefocus href="javascript:void(0)" fid="$fid"  title="@getTitle()" @getStyle() >@getLock() @maxLength(name,10)',
               	'@getMailCount()</a></li>',
               '<!--item end-->',
             '</ul>',
			 '</div>'].join(""),			 
events:{
	"click #folder_custom li[fid]":"folderClick",
	"click #btn_addfolder": "addFolder",
	"click #btn_setCustom": "openSetting", 
	//"click #folder_inbox span": "showFolderManage",
	"click #folder_inbox":"unfold"
},
initialize: function(options){
   var self=this;
   this.model=options.model;
   this.model.on("folderDataChange", function () { //文件夹数据源发生改变时调用render
       M139.Timing.waitForReady("$App.getConfig(\"PopList\")", function () {
           setTimeout(function () { //改成异步，让代收文件夹先渲染，否则会多出代收的文件夹
               self.el = "#customfolder_list";//收件箱显示后才有容器el
               self.render();
           }, 10);
       });
   });
  
},
render:function (){
    var self=this;
    //this.template=$T.Html.decode($(self.el).html());


    this.getDataSource(function(dataSource){
        var rp=new Repeater(self.template); //传入dom元素，dom元素即做为容器又做为模板字符串
        rp.Functions = self.model.renderFunctions;
        var html = rp.DataBind(dataSource); //数据源绑定后即直接生成dom
 		$(self.el).html(html);
		
 		var subFids = self.model.getInboxSub();
 		var sendedbox = $("#li_sendedbox");

 		$("#folder_main").find("li[isCustom]").remove();//先清场

 		$(subFids).each(function (i, n) {
 		    var subFolder = $("#folder_custom").find("li[fid=" + n + "]");
		        
 		    subFolder.attr("isCustom", 1);//打上印记，便于刷新的时候清场
 		    sendedbox.before(subFolder);

 		});
 		
		//标题处理
 		var stats = self.model.getMailCount("custom");
 		var title = stats.unreadMessageCount > 0 ? $T.Utils.format("{0}封未读邮件", [stats.unreadMessageCount]) : "我的文件夹";
		var customContainer = $('#folder_inbox');
		customContainer.attr('title',title);
		if (stats.unreadMessageCount > 0) {
			var unreadMessageCount = '<var class="fw_b">(' + stats.unreadMessageCount + ')</var>';
 		    //customContainer.css("font-weight", "bold"); //有未读加粗
 		    customContainer.find("span").html(String.format("我的文件夹{0}", [unreadMessageCount]));
 		}
		
		/*
 		$Hint.register($("#folder_inbox"), self.renderCustomTips(dataSource));
 		$Hint.on("show", function (args) {
 		    if ($(args.sender).attr("id") == "folder_inbox") { //判断tips
 		        if (args.el.html()=="") { //无二级目录
 		            args.isShow = false;
 		        }else if ($("#folder_inbox").find("[name=i_unfold]").hasClass("t_blackDown")) {
 		            args.isShow = false;
 		        }
 		    }
 		    
 		});
		*/
 		var icon = $("#folder_inbox").find("[name=i_unfold]");
 		if (dataSource.length == 0) { //无自定义文件夹时隐藏加号
 		    icon.remove();
 		} else if (self.model.get("unfoldCustom") && icon.hasClass("t_blackRight")) { //原来是展开状态，恢复展开
 		    self.unfold(true);
 		}
 		/*if (self.model.get("isFirstLoad")) {
 		    var status = self.model.getUnfoldStatus("custom");
 		    if (status == 2 || (status == 1 && stats.unreadMessageCount>0)) {
 		        self.unfold(true);
 		    } else {
 		        self.unfold(false);
 		    }
 		}*/

    });
    
},
renderCustomTips: function (dataSource) {
    var data = dataSource.concat();//复制数组
    data=$.grep(data, function (a) { //筛选有未读邮件的
        return a.stats.unreadMessageCount > 0;
    });
    if (data.length == 0) {//无未读邮件
        return;
    }
    data.sort(function (a,b) { //按新邮件数对文件夹排序
        return  b.stats.unreadMessageCount-a.stats.unreadMessageCount;
    });
    var isMore=false;
    if (data.length > 4) {
        data=data.slice(0,4);//截取前4个文件夹
        isMore=true;
    }

    //data = [$App.getFolderById(1)].concat(data);//加入收件箱
    var template = ['<div id="tip_inbox" style="width:170px;"><!--item start-->',
        '<div><a fid="$fid" href="javascript:appView.showMailbox($fid)">@getName(name)($stats.unreadMessageCount)</a>'
        , '</div><!--item end-->',isMore?"......":"",'</div>'].join("");
    var rp = new Repeater(template); //传入dom元素，dom元素即做为容器又做为模板字符串
    rp.Functions = {
        getName: function (name) {
            return $T.Utils.getTextOverFlow2(name, Number(12), true);
        }
    }
    var html = rp.DataBind(data); //数据源绑定后即直接生成dom
    /*$("#tip_inbox a").live("click", clickHandler);
    function clickHandler() {
        $("#tip_inbox a").die("click", clickHandler);//回收
        $App.showMailbox(Number(Number($(this).attr("fid"))));
    }*/
    return html;



},
pushOtherFolder: function (customFolders) {
     
        var folderList = this.model.getFolders("system");
        var folderIdList = [5, 6, 10, 11, 12]; //广告文件夹、商讯生活等
        
        function inCustom(fid) { //判断是否已经添加过
            var result = false;
            $.grep(customFolders,function (n, i) {
                if (fid == n.fid) {
                    result = true;
                    return;
                }
            });
            return result;
        }

        for (var i = 0; i < folderList.length; i++) {
            var folder = folderList[i];
            if ($.inArray(folder.fid, folderIdList) >= 0 && !inCustom(folder.fid)) {
                customFolders.push(folder);
                folderList.splice(i, 1);//从系统文件夹中移除
                i--;
                //unreadCount += folder.stats.unreadMessageCount;
                //totalCount += folder.stats.messageCount;
            }

        }
     
     
},
getDataSource:function(callback){
	var self=this;
	this.model.fetchFolderList(this.model.foldertype.custom, function (result) {
	    self.pushOtherFolder(result);
	       callback(result); //异步返回值
    });
},
folderClick:function(event){
	var element=(event.srcElement || event.target);
	var fidStr=$(element).parents("li[fid]").attr("fid");
	if(fidStr!=""){
		$App.showMailbox(Number(fidStr));
	}
},
addFolder: function () {
    $App.trigger("mailCommand", { command: "addFolder" });
	//new M2012.Folder.View.AddFolder({model:this.model}).render();

},
openSetting: function () { //个性化设置
    $App.openDialog("个性化设置", "M2012.View.UnfoldSetting", {type:"custom", width: 383, height: 120,buttons:["确定","取消"] });
},
showFolderManage: function(){ //文件夹管理页
	$App.show('tags');
},
unfold:function(flag){
    var self=this;
	
	//判断点击是否折叠
	var eventElement;
	var _event = flag;
	if(typeof(_event) !== 'boolean'){
		eventElement = _event.srcElement || _event.target;
	}
	if( eventElement && eventElement.id ){
		var elemId = eventElement.id;
		if (elemId === 'btn_addfolder' || elemId === 'btn_setCustom') {
			return;
		}
	}
	
    var element = $("#folder_inbox").find("[name=i_unfold]");
    if (flag == true && element.hasClass("t_blackDown")) {
        return;
    } else if (flag == false && element.hasClass("t_blackRight")) {
        return;
    }
	element.toggleClass(function(idx,className){
	    element.removeClass();//移除所有class
		return className.indexOf("t_blackRight") > -1 ? "triangle t_blackDown":"triangle t_blackRight";
	});

		
	self.model.set("unfoldCustom", element.hasClass("t_blackDown"));
	
	if ($("#folder_custom ul").children().length > 0) {
	    $("#folder_custom").toggle();
	} else { //无数据时隐藏，避免ie下的占用高度
	    $("#folder_custom").hide();
	}

	$App.getView("folder").resizeSideBar();
}
})
   
});