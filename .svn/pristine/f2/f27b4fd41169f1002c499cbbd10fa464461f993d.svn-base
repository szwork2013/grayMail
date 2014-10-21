/**
 右键菜单view
 * */

M139.namespace("M2012.Mailbox.View", {
ContextMenu :Backbone.View.extend({
el:"body",
template:"",
events:{
},
initialize: function(options){
   var self=this;
   
   // 由于mailboxModel在2.3版本实现了多实例化
   // 导致这里获取的model在运行过程中可能不正确
   // 在具体处理时还是要再次通过$App.getMailboxView().model进行获取
   // yeshuo
   this.mailboxModel = $App.getMailboxView().model;
   this.model = new M2012.Mailbox.Model.ContextMenu({ mailboxModel: this.mailboxModel });
   //因为dom还没生成，用live监听事件，统一给所有含有右键菜单的容器添加contextMenu事件
  //todo attach event on li
   $("#folder_main,#list_folder_other,#folder_custom,#pop_list,#tag_list,#div_maillist,#folder_other,#li_star,#btn_groupMail,#btn_attachlist,#folder_inbox").live('contextmenu', function (e) {
        self.mailboxModel = $App.getMailboxView().model;
   		var sender=this;
        var target = e.target;
        //alert(pos.x+","+pos.y);
        if(self.model.get("currentMenu")){ //如果上一个菜单还没消失则自动消失，避免出现多个菜单
        	self.model.get("currentMenu").remove();
        }
        
		var menuItems=[];
        switch(sender.id){ //根据点击区域生成不同菜单
        	case "folder_main"://点击系统文件夹
        	    //var fid=$(target).attr("fid"); //todo parents("[fid]")
        	    menuItems=self.getFolderMenu("system",e);
        	    break;
			case "list_folder_other"://点击其它文件夹
				menuItems=self.getFolderMenu("system",e);
				break;	
        	case "folder_custom"://点击自定义文件夹
        	//var fid=$(target).parents("li[fid]").attr("fid");
        	    menuItems = self.getFolderMenu("custom", e);
        	    break;
            case "pop_list"://点击pop文件夹
        	    menuItems = self.getFolderMenu( "pop", e);
        	    break;
            case "tag_list"://点击tag文件夹
        	    menuItems = self.getFolderMenu( "tag", e);
        	    break;
            case "div_maillist"://点击邮件列表
                if ($(target).closest(".dayAreaTable").length > 0) { //避免选中表头和section时出菜单
                    var fid = $App.getCurrentFid();
                    if($App.isSessionMode() && $App.isSessionFid(fid)){
                        menuItems = self.getSessionMailMenu(fid, e);
                    }else{
                        menuItems = self.getMailMenu(fid, e);                        
                    }

                } else {
                    return;
                } 
        	    break;
            case "li_star":
                menuItems = self.getFolderMenu("star", e);
                break;
            case "folder_other":
                menuItems = self.getFolderMenu("other", e); 
                break;
            case "btn_groupMail":
                menuItems = self.getFolderMenu("groupMail", e);
                break;
            case "btn_attachlist":
                menuItems = self.getFolderMenu("attachlist", e);
                break;
            case "folder_inbox":
                menuItems = self.getFolderMenu("myfolders", e);
                break;
            default:
                break;

        }
        self.model.set("menuItems", menuItems);
        self.render(e, sender.id);
		

        return false; //屏蔽浏览器右键默认行为
   }
   	);
   //$("div_maillist").live('contextmenu',function(e){showContextMenu(e,"mail")});
   

},
getPreviewMail: function () {
    this.mailboxModel = $App.getMailboxView().model;
    var mid = this.mailboxModel.getSelectedRow($App.getMailboxView().listView.$el).mids[0]; //取当前选中的一封mid
    var subject = this.mailboxModel.getMailById(mid).subject;
    subject = $T.Html.encode(subject);
    var src = 'readmailcontent.html?rnd=' + Math.random();
    /*var html = '<h3 id="viewSubject" style="color:#000;">'+subject+'</h3><hr>\
                <div class="info">\
                    <div id="viewP">\
                        <iframe id="previewContent" scrolling="no" noresize="noresize" src="'+ src + '" frameborder="0" style="width:100%;height:300px;">\
                        </iframe>\
                    </div>\
                    <div class="p-loading" style="position:absolute;left:0;top:0;width:100%;height:345px;"><div>\
                </div>';*/
    var html = ['<div class="dRound shadow indboxview">',
 	'<div class="dRoundBody">',
 		'<h3 id="viewSubject">',subject,'</h3>',
 		'<div class="indboxviewC">',
 			'<iframe id="previewContent" scrolling="no" noresize="noresize" src="' ,src, '" frameborder="0" style="width:100%;height:300px;"> </iframe>',
 		'</div>',
 	'</div>',
 '</div>'].join("");
    this.model.readMail(mid, function (result) { //调用服务端读信接口
        function writeMail() {
            console.warn("preview iframe loaded");
            var doc = $("#previewContent")[0].contentWindow.document;
            doc.open();
            doc.writeln(result.html.content);
            resizeFrm(doc);
            doc.close();
        }
        function resizeFrm(fdoc) {//重新计算宽高，用于滚动条显示

                var fbody = fdoc.body;
                var clientHeight, clientWidth;
                if (fbody.scrollHeight) {
                    clientHeight = fbody.scrollHeight;
                    clientWidth = fbody.scrollWidth;
                } else {
                    clientHeight = fbody.offsetHeight;
                    clientWidth = fbody.offsetWidth;
                }
                $("#previewContent").css({ 'height': clientHeight, 'width': clientWidth });

                //LI.find('.p-loading').remove();
            
        }
        if ($("#previewContent").length == 0) {
            $("#previewContent").load(function () { //iframe加载成功后再执行，否则domain未设置会跨域
                writeMail();
            });
        } else {
            writeMail();
        }

    })
    return html;

},

getFolderMenu: function (type, e) {//文件夹菜单
    fid = $(e.target).parents("li").attr("fid");
    if (type == "system" && fid > 10) {
        type = "customSub";
    }
    if (type == "custom" && fid <=12) {
        type="system";
    }
    return this.model.getFolderMenu(type,fid);


},
getMailMenu: function (fid, e) {//邮件列表菜单
    this.mailboxModel = $App.getMailboxView().model;
    var selectedMidList = this.mailboxModel.getSelectedRow($App.getMailboxView().listView.$el).mids;//获取选中项

    var isSingle;//是否单封
    var mid = $(e.target).parents("tr").attr("mid");
    // 1.鼠标不在已选择的范围内，取消所有，选中单封
    if ($.inArray(mid, selectedMidList) == -1) {
        isSingle = true;
        // 清空跨页选择
        this.unSelectedAll();
        if (mid) {
            $(e.target).parents("tr").find("input").attr("checked", true);
            this.mailboxModel.trigger("checkboxChange", $(e.target));
            //this.mailboxModel.trigger("mailSelectedChange", { count: 1 });
        }
    // 2.只有一封被选中
    } else if (selectedMidList.length==1) {
        isSingle = true;
        this.mailboxModel.trigger("checkboxChange", $(e.target));
    // 3.鼠标在已选择的范围内，不触发任何操作，保持当前选择结果不变
    } else {

    }
    return this.model.getMailMenu(mid,isSingle);
},

/** 会话邮件菜单 */
getSessionMailMenu: function (fid, e) {//邮件列表菜单
    var selectedSessionIdList = this.mailboxModel.getSelectedRow($("#div_maillist")).sessionId;//获取选中项

    var isSingle;//是否单封
    var sessionId = Number($(e.target).parents("tr").attr("sessionId"));
    if ($.inArray(sessionId, selectedSessionIdList) == -1) { //鼠标不在已选择的范围内，取消所有，选中单封
        this.unSelectedAll();
        isSingle = true;
        if (sessionId) {
            $(e.target).parents("tr").find("input").attr("checked", true);

            this.mailboxModel.trigger("checkboxChange");
        }
    } else if (selectedSessionIdList.length==1) { //只有一封被选中
        isSingle = true; 
        this.mailboxModel.trigger("checkboxChange");
    }
    return this.model.getSessionMailMenu(sessionId,isSingle);

},

unSelectedAll:function(){
    $App.getMailboxView().model.superSelectResult = {};
    $("#div_maillist").find(".dayAreaTable input[type=checkbox]").attr("checked",false);
},
//获取鼠标的绝对坐标
getMousePos:function(e){ 
	var x,y; 
	var e = e||window.event; 
	return { 
		x:e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft, 
		y:e.clientY+document.body.scrollTop+document.documentElement.scrollTop 
	}; 
},
 render: function (e, id) {
     var self = this;
     var menuItems = this.model.get("menuItems");
     var pos = this.getMousePos(e);
     var width = id == 'folder_inbox' ? 180 : 150;
    var menu = M2012.UI.PopMenu.create({
        width: width,
        width2: 180,
        items: menuItems,
        top: pos.y + "px",
        left: pos.x + "px",
        onItemClick: function (item) {
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
            $(item.menu.el).removeClass();//清除原有菜单样式
            $(item.menu.el).css({width:"570px",position:"absolute"}); //修改宽度
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
            
            timerId=setTimeout(function () {
                menu.remove();
            }, 500);
        }
    }
    
}
})
});