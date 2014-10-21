M139.namespace("M2012.Folder.View", {
FolderPop :Backbone.View.extend({
el:"#pop_list",
template: ['<a bh="left_pop" hidefocus id="fd_popStat" href="javascript:void(0)"><i name="i_unfold" class="triangle t_blackRight" bh="left_unfoldPop"></i><span>代收邮箱</span><i id="btn_addpop" title="添加代收邮箱" name="addpop" class="i_add" bh="left_createPop"></i><i class="i_set" title="代收文件夹个性化设置" onClick="return false" id="btn_setPop" bh="left_popSetting"></i></a>',
             '<ul class="small" style="display:none;" id="folder_pop">',
               '<!--item start-->',
               '<li  fid="$fid"><a href="javascript:" title="@getTitle()" @getStyle()>@getLock()<span class="otheMail">@maxLength(name,10)',
               	'</span><span class="otheMailNum">@getMailCount()</span></a></li>',
               '<!--item end-->'].join(""),
events:{
	"click #pop_list li[fid]":"folderClick",
	"click #btn_addpop": "addPop",
	"click #btn_setPop": "openSetting",
	"click #fd_popStat": "unfold"
//	"click #fd_popStat span": "popClick"
},
initialize: function(options){
   var self=this;
   this.model=options.model;

   this.model.on("folderDataChange", function () { //文件夹数据源发生改变时调用render
       M139.Timing.waitForReady("$App.getConfig(\"PopList\")", function () {
           self.model.setPopFolders();
           self.render();
       });
   		
   		
   });
  
},
render:function (){
    var self=this;
    //this.template=$T.Html.decode($(self.el).html());
    this.getDataSource(function (dataSource) {
        var rp=new Repeater(self.template); //传入dom元素，dom元素即做为容器又做为模板字符串
        rp.Functions = self.model.renderFunctions;
 		var html=rp.DataBind(dataSource); //数据源绑定后即直接生成dom
 		$(self.el).html(html);

 		var stats = self.model.getMailCount("pop");
 		//var title = $T.Utils.format("代收文件夹中共有{0}封邮件，其中新邮件{1}封", [stats.messageCount, stats.unreadMessageCount]);
 		//$("#fd_popStat").attr("title", title);
 		
 		if (stats.unreadMessageCount > 0) {
 		   // $("#fd_popStat").css("font-weight", "bold"); //有未读加粗
 		    var unreadMessageCount = '<var class="fw_b">(' + stats.unreadMessageCount + ')</var>';
			$("#fd_popStat span").html($T.Utils.format("代收邮箱{0}", [unreadMessageCount]));

 		}
    var title = stats.unreadMessageCount > 0 ? $T.Utils.format("{0}封未读邮件", [stats.unreadMessageCount]) : '代收邮箱';
      $("#fd_popStat").attr("title", title);

		/*
 		$Hint.register($("#fd_popStat"), self.renderCustomTips(dataSource));
 		$Hint.on("show", function (args) {
 		    if ($(args.sender).attr("id") == "fd_popStat") { //判断tips
 		        if (args.el.html() == "") { //无二级目录
 		            args.isShow = false;
 		        }else if ($("#fd_popStat").find("[name=i_unfold]").hasClass("t_blackDown")) {
 		            args.isShow = false;
 		        }
 		    }

 		});
		*/

 		var icon = $("#pop_list").find("[name=i_unfold]");
 		if (dataSource.length == 0) {
 		    icon.remove();
 		}else if (self.model.get("unfoldPop") && icon.hasClass("t_blackRight")) { //原来是展开状态，恢复展开
 		    self.unfold({ target: icon });
 		}

 

    });
    
},
renderCustomTips: function (dataSource) {
    var data = dataSource.concat();//复制数组
    data = $.grep(data, function (a) { //筛选有未读邮件的
        return a.stats.unreadMessageCount > 0;
    });

    if (data.length == 0) {//无代收或代收目录无新邮件
        return;
    }
    var isMore = false;
    if (data.length > 4) {
        data = data.slice(0, 4);//截取前4个文件夹
        isMore = true;
    }

    var template = ['<div id="tip_inbox" style="width:230px;"><!--item start-->',
        '<div><a fid="$fid" href="javascript:appView.showMailbox($fid)">$name($stats.unreadMessageCount)</a>'
        , '</div><!--item end-->',isMore?"......":"",'</div>'].join("");
    var rp = new Repeater(template); //传入dom元素，dom元素即做为容器又做为模板字符串
    var html = rp.DataBind(data); //数据源绑定后即直接生成dom

    return html;



},
getDataSource:function(callback){
	var self=this;
	this.model.fetchFolderList(this.model.foldertype.pop,function(result){
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
popClick: function () {
    $App.show("popmail");
    return false;
},
addPop:function(event){
    $App.show("addpop");
	return false;
},
openSetting: function () {
    //alert("show setting");

    $App.openDialog("个性化设置", "M2012.View.UnfoldSetting", { type: "pop", width: 383, height: 120, buttons: ["确定", "取消"] });
    
},
unfold: function (flag) {
    var self = this;
    
	//判断点击是否折叠
	var eventElement;
	var _event = flag;
	if(typeof(_event) !== 'boolean'){
		eventElement = _event.srcElement || _event.target;
	}
	if( eventElement && eventElement.id ){
		var elemId = eventElement.id;
		if (elemId === 'btn_addpop' || elemId === 'btn_setPop') {
			return;
		}
	}
	
    var element = $(this.el).find("[name=i_unfold]");
    if (flag==true && element.hasClass("t_blackDown")) {
        return;
    } else if (flag == false && element.hasClass("t_blackRight")) {
        return;
    }
	element.toggleClass(function(idx,className){
		element.removeClass();//移除所有class
		//return className=="i_plus" ? "i_minus2":"i_plus";
		return className.indexOf("t_blackRight") > -1 ? "triangle t_blackDown":"triangle t_blackRight";
	});
	
	self.model.set("unfoldPop", element.hasClass("t_blackDown"));
	
	element.parent().next().toggle();

	$App.getView("folder").resizeSideBar();
}
})
});