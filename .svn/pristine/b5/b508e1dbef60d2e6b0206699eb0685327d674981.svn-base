M139.namespace("M2012.Folder.View", {
FolderMain :Backbone.View.extend({
el:"#sb_h", //folder_main改为sb_h
template:"",
events:{
    "click #folder_main li a[fid]": "folderClick",
	"click #list_folder_other li a[fid]": "folderClick",
    "click #btn_addFolder": "addFolder",
    "click #btn_clear": "clearFolder",
    "click #btn_clearJunk": "clearFolder"
    //"click #btn_setCustom": "openSetting",
    //"click #btn_groupMail":"showGroupMail"
    //"click #folder_other": "unfold"
},
initialize: function(){
   //alert("hello");
   this.model=new M2012.Folder.Model.FolderModel();
   
   var folderCustomView=new M2012.Folder.View.FolderCustom({model:this.model});
   var folderPopView=new M2012.Folder.View.FolderPop({model:this.model});
   var folderTagView=new M2012.Folder.View.FolderTag({model:this.model});
   this.folderTagView = folderTagView;
   this.model.set("isFirstLoad", true);
   var self=this;
   appView.on("change:star",function(){
   		self.render();
   })
   //刷新文件夹 
   appView.on("reloadFolder", function (e) {
       if (e && e.callback) { //如果有callback则执行，用户刷新文件夹的后续操作
           self.render(true, e.callback);
       } else {
           self.render(true);
       }

       self.validateMailCount();
       
       self.resizeSideBar();

       if (e && e.comefrom == "deleteFolder") {
           var obj = $App.getTabByName("mailbox_" + e.fid);
           if (obj) {
               $App.close(obj.name);
           }
       }
   })
   $("#sidebar").find(".subListScrollCon").scroll(function () {
       if (this.scrollTop > 0) {
           $(".subListScrollTop").show();
       } else {
           $(".subListScrollTop").hide();
       }
   });
   //读取未读邮件，减少文件夹未读数
   appView.on("reduceFolderMail",function(e){
        var fid = e.fid;
        var folder = self.model.getFolderById(fid);
        if (folder.stats.unreadMessageCount > 0) {//避免负数
            folder.stats.unreadMessageCount -= 1;
        }
	
        messageTotal = $User.getMessageInfo();
        if (messageTotal.unreadMessageCount) {
            var unreadLockCount = 0;
            messageTotal.unreadMessageCount--;

            $($App.getFolders()).each(function(i,n){
              if($App.getView("folder").model.isLock(n.fid)){
                unreadLockCount += $App.getFolderById(n.fid).stats.unreadMessageCount;
              }
            });

            if(messageTotal.unreadMessageCount <= unreadLockCount){
              $Evocation.msgBoxHot.hide();
            }
        }else{
             //用于消息提醒盒子的红点展示判断
            $Evocation.msgBoxHot.hide();
        }
        self.reduceBillSub();
        var type = self.model.getFolderType(fid);
        if (type == self.model.foldertype.system) {
            self.render();
            folderCustomView.render();//因为要重新生成自定义文件夹的tips
        } else if (type == self.model.foldertype.custom) {
            folderCustomView.render();
        } else if (type == self.model.foldertype.pop) {
            folderPopView.render();
        }
        
        self.validateMailCount();
        if ($App.getMailboxView().model.get("isSearchMode")) {
            var isStarMail =(e && e.isStar)
            self.reduceStarSearchMail(isStarMail);//星标邮件减少，搜索结果未读数减少
        }

        if (e && e.isVip) {
            var stats = self.model.get("vipMailStats");
            if(stats.unreadMessageCount>0){
                stats.unreadMessageCount -= 1;
            }
        }

   		
   })
    // add by tkh 读取未读群邮件，减少tag未读数
    /*
   appView.on("reduceGroupMail",function(){
        self.getOtherMailCount(self.model.systemFolders);
   })*/
   //读取未读邮件，减少tag未读数
   appView.on("reduceTagMail",function(e){
        var label = e.label;
   		var tagArr=self.model.getTagsById(label);
   		$(tagArr).each(function (i, m) {
   		    if (m.stats.unreadMessageCount > 0) { //避免负数
   		        m.stats.unreadMessageCount -= 1;
   		    }
   		})
   		folderTagView.render();
   		self.validateMailCount();
   })
   appView.on("unfoldCommand", function (e) {
       var flag = true;
       if (e.flag!=undefined) {
           flag = e.flag;
       }
       if (e.type == "folder" || e.type == "custom") {
           folderCustomView.unfold(flag);
       } else if (e.type == "tag") {
           folderTagView.unfold(flag);
       } else if (e.type == "pop") {
           folderPopView.unfold(flag);
       } else if (e.type == "other") {
           self.unfold(flag);
       }
   })
   $App.on("change:contact_maindata", function () {
       self.renderVipMailCount(true);
   });
   /*$App.on("contactLoad", function () {
       setTimeout(function () { //延时等待数据组装
           self.renderVipMailCount();
       }, 1000);
   });*/

 
  
   this.autoReceive();
  
},
loadUnfoldStatus: function () {
    var self = this;
    M139.Timing.waitForReady("$App.getConfig(\"PopList\")", function (attrs) {
        setTimeout(function () { //延时，避免收件箱的dom还未生成
            loadStatusInner("custom");
            loadStatusInner("pop");
            loadStatusInner("tag");
            function loadStatusInner(type) {
                var status = self.model.getUnfoldStatus(type);
                var flag = false;
                if (status == 2) { //总是展开
                    flag = true;
                } else if (status == 1) { //有未读时展开
                    var stats = self.model.getMailCount(type);
                    if (stats.unreadMessageCount > 0) {
                        flag = true;
                    }
                }
                
                $App.trigger("unfoldCommand", { type: type, flag: flag });
            }
        }, 500);
    })
},
reduceBillSub:function(){
    var mm = $App.getMailboxView().model;
    var fm = $App.getView("folder").model;
    if(mm.isBillMode()){
        fm.set("newBillCount", fm.get("newBillCount") - 1);
    }else if(mm.isSubscribeMode() ){
        fm.set("newSubscriptionCount", fm.get("newSubscriptionCount") - 1);
    }
},
reduceStarSearchMail: function (isStar) {
    var self = this;
    var mailboxModel = $App.getMailboxView().model;
    if (isStar) {//星标邮件减少
        var unreadStarCount = self.model.get("unreadStarCount");
        if (unreadStarCount > 0) {
            self.model.set("unreadStarCount",unreadStarCount - 1);
        }
        this.folderTagView.renderStarMail();
        //var obj = this.model.getStarObj();
        //$("#li_star a").html("星标邮件"+obj.count).attr("title",obj.title).attr("style",obj.style);
    }

    if (mailboxModel.get("isSearchMode")) {
        var searchStats = mailboxModel.get("searchStats");
        if (searchStats.unreadMessageCount > 0) {
            searchStats.unreadMessageCount -= 1;
        }
    }
},
refreshTaskCount:function(todoCount,totalCount){
    todoCount = this.model.get("todoTaskCount") + todoCount;
    totalCount = this.model.get("totalTaskCount") + totalCount;
    todoCount = todoCount > 0 ? todoCount : 0;
    totalCount = totalCount > 0 ? totalCount : 0;
    this.model.set({"todoTaskCount" : todoCount});
    this.model.set({"totalTaskCount" : totalCount});
    this.renderTaskMail();
},
renderBillSub:function(){
    var obj = this.model.getBillObj();
    $("#li_bill").attr({ "style": obj.style });
    $("#li_bill a").attr("title", obj.title).html('<i class="i_m_money"></i>服务邮件' + obj.count);

    obj = this.model.getSubscribeObj();
    $("#li_subscribe").attr({ "style": obj.style });
    $("#li_subscribe a").attr("title", obj.title).html('<i class="i_m_rss"></i>订阅邮件' + obj.count);
},
renderTaskMail:function(){
    var obj = this.model.getTaskObj();
    $("#li_remind").attr({ "style": obj.style });
    $("#li_remind a").attr("title", obj.title).html('<i class="i_cDon"></i>待办任务' + obj.count);
},
validateMailCount: function () { //告知欢迎页等模块需要重新加载
    var module = $App.getTabByName("welcome");
    if (module) {
        module.isRendered = false;
        module.data = { reload: true };
    }

    /*if (module.name == "welcome") {
        var result = module.view.render(false); //执行当前模块的render
        module.isRendered = true;//表示已显示过
    }else{
        $App.getTabByName("welcome").isRendered = false;
    }*/


},
setButtonVisible: function () {
    var folderInfo = this.model.getFolderById(4);
    if (folderInfo.stats.messageCount == 0) {
        $("#btn_clear").hide();
    }
    /*folderInfo = this.model.getFolderById(5);
    if (folderInfo && folderInfo.stats.messageCount == 0) {
        $("#btn_clearJunk").hide();
    }*/
},
//自动收取新邮件
autoReceive: function () {
    var self = this;
    try{
    	
    	// update by tkh  调PNS接口自动收信
    	if(self.autoReceiveTimer){
    		clearTimeout(self.autoReceiveTimer);
    	}
    	self.autoReceiveTimer = setTimeout(function(){
    	    //self.model.autoReceiveMail();
    	    new M2012.Model.Pns.PnsModel().startRequestPns();
    	}, 1000 * 5);
    }catch(ex){
        //alert(ex);
    }
},
render:function (reload,callback){
    var self=this;
    //this.template=$T.Html.decode($(self.el).html());
    function renderFunc(dataSource){
        //var htmlStr=_.template(self.template,dataSource);
        //$(self.el).html(htmlStr).show();
        var rp=new Repeater($("#template_folderMain").val()); //传入dom元素，dom元素即做为容器又做为模板字符串
     		var html=rp.DataBind(dataSource); //数据源绑定后即直接生成dom
     		$('#folder_main').html(html);
     		self.renderBillSub();

    		//其它文件夹分离绑定
    		/*var otherRp= new Repeater($("#template_otherFolders").val()); 
     		var otherHtml= otherRp.DataBind(dataSource); 
     		$('#list_folder_other').html(otherHtml);
    		


     		var icon = $("#folder_other").find("[name=i_unfoldOther]");
     		if (self.model.get("unfoldOther") && icon.hasClass("t_blackRight")) { //原来是展开状态，恢复展开
     		    self.unfold(true);
     		}*/
     		if (reload) {
     		    self.model.trigger("folderDataChange");//文件夹数据加载完成，通知各文件夹列表view执行render
     		}
     		appView.trigger("folderRendered");//通知appview文件夹渲染已完成
     		if (callback) {
     		    callback();
     		}

     		self.setButtonVisible();

     		if (self.model.get("isFirstLoad")) {
     		    self.loadUnfoldStatus();
     		}
     		self.model.set("isFirstLoad",false);
    }
    
    
    this.getDataSource(renderFunc,reload);
    
    
},


/**
*重设左边栏的高度
*当浏览器窗口高度<=其他文件夹就出现整个滚动条
*/
resizeSideBar: function () {
    setTimeout(function () {
        
        var sidebar = $("#sidebar .subListScrollCon"); //容器
        var bottomHeight = 150;//150是底部特色应用的高度，因为加载有延时，动态计算麻烦先写固定值
        var appHeight = $("#myapp").height();
        if (appHeight > 30) {
            bottomHeight = appHeight+10;
        }
        var height = $App.getBodyHeight() - sidebar.offset().top - bottomHeight; 
        $("#sb_h").height($App.getBodyHeight() - sidebar.offset().top);
        //console.log(sidebar[0].scrollHeight , height);
        if (sidebar[0].scrollHeight > height) {
            sidebar.height(height);
        } else if (sidebar[0].scrollHeight == height) {
            sidebar.css("height", "");//清除高度
        }else {
            $(".subListScrollTop").hide();
        }
       

	}, 10);
},
getDisplay: function (folder) { //是否显示该文件夹
    if (folder.stats.messageCount == 0) { //无邮件
        /*if (folder.hideFlag == 1) { //隐藏文件夹标识
            return "display:none";
        }*/
        var sys=this.model.SysFolderId;
        if (folder.fid == sys.advertise || folder.fid == sys.business || folder.fid == sys.virus || folder.fid == sys.junk || folder.fid == sys.archive) {
            return "display:none"; 
        }
    }
    return "";
},
    /*
getOtherMailCount: function (folderList) { //获取更多文件夹的邮件数量
    var unreadCount=0;
    var totalCount = 0;
    var groupMailInfo=$User.getGroupMailInfo();
    if (groupMailInfo) {
        var unreadG= Number(groupMailInfo.unread);
        var totalG= Number(groupMailInfo.totalMail);
        unreadCount += unreadG;
        totalCount += totalG; 

        var elem = $("#btn_groupMail");
        if (unreadG > 0) {
            elem.html("群邮件<var class='fw_b'>("+unreadG+")</var>");
        }else{
        	// add by tkh 用户删掉最后一封群邮件后，重新渲染
        	elem.html("群邮件");
        }
        elem.attr("title", unreadG > 0 ? $T.Utils.format("{0}封未读邮件", [unreadG]) : "群邮件");
    }
    var folderIdList = [4,5,6,10,11,12]; //草稿箱已经移出其它文件夹
    for (var i = 0; i < folderList.length; i++) {
        var folder = folderList[i];
        if ($.inArray(folder.fid, folderIdList) >= 0) {
            unreadCount += folder.stats.unreadMessageCount;
            totalCount += folder.stats.messageCount;
        }

    }
    setTimeout(function () {//做下延时，躲过被系统文件夹重绘时覆盖掉。
        console.log("render othermail count");
        var elem = $("#folder_other");
        elem.attr("title", unreadCount > 0 ?$T.Utils.format("{0}封未读邮件", [ unreadCount]) : "其他文件夹");
        //elem.attr("style", unreadCount > 0 ? "font-weight: bold;" : "");
        elem.find("span").html(unreadCount > 0 ? "<var class='fw_b'>(" + unreadCount + ")</var>" : "");
    }, 100);

},*/
showGroupMail:function(){
    $App.jumpTo("groupMail");
    /*M139.core.utilCreateScriptTag(
    {
        id: "groupMail_scriptId",
        src: "/m2012/js/matrixvm/m2011.matrixvm.groupmail.js",
        charset: "utf-8"
    },
    function () {
        $App.jumpTo("groupMail");
    }
    )*/
},
renderVipMailCount: function (refresh) { //获取vip邮件数量
    var self = this;
    function renderVipCountInner (stats) {
        if (stats) {
            self.model.set("vipMailStats", stats);
            var elem = $("#li_vip span");
            if (stats.unreadMessageCount > 0) {
                var count = stats.unreadMessageCount > 0 ? ("(" + stats.unreadMessageCount + ")") : "";
                var title = $T.Utils.format("{0}封未读邮件", [stats.unreadMessageCount]);
                

                elem.attr('title', title);
                //$("#li_vip a").css("font-weight", "bold");
                elem.html("VIP邮件" + "<var class='fw_b'>(" + stats.unreadMessageCount + ")</var>").attr("title", title);
            } else {
                var title = "VIP邮件";
                elem.attr('title', title);
                elem.html("VIP邮件");
            }
        }
    }
    if (this.model.get("vipMailStats") &&  !refresh) { //用缓存刷新界面
        renderVipCountInner(this.model.get("vipMailStats"));
    } else { 
        if( $App.getCurrentTab().name.match(/mailsub_[^0]/)){//订阅多实例邮件列表刷新时不能刷新vip，否则覆盖搜索结果
            return ;
        }
        var mailboxModel = $App.getView("mailbox").model;
        mailboxModel.getVipMailCount(renderVipCountInner);
    }
},
getDataSource:function(callback,reload){
	var self=this;
	function rebuildDataFunc(result){
	  
       var list=result;
       var folderids=self.model.SysFolderId;
       var result = { //初始化星标邮件、任务邮件
           star: self.model.getStarObj(),
           task: self.model.getTaskObj()
           };

       for(elem in folderids){
        if(elem){
            var folderObj=$.grep(list,function(n,i){    //查找对应的文件夹
                return n.fid==folderids[elem];
            });
            if(folderObj && folderObj.length>0){
                result[elem]={};

                if(folderObj[0].stats.unreadMessageCount>0){
                	result[elem].count="<var class='fw_b'>("+folderObj[0].stats.unreadMessageCount+")</var>";
                    //result[elem].style="font-weight: bold;";
                }else{
                	result[elem].count="";
                    result[elem].style="";
                }
                /*if (elem == "bill" || elem == "subscribe") { //账单和订阅加锁图标
                    if (folderObj[0] && folderObj[0].folderPassFlag) {
                        result[elem].lock = "<i class=\"i_lock mr_5\"></i>";
                    } else {
                        result[elem].lock = "";
                    }
                }*/

                result[elem].style =result[elem].style+ self.getDisplay(folderObj[0]);
                result[elem].title =folderObj[0].stats.unreadMessageCount > 0 ? $T.Utils.format("{0}封未读邮件", [folderObj[0].stats.unreadMessageCount]) : $T.Utils.format("{0}", [folderObj[0].name]);
                

            }else{//如果文件夹不存在，构造默认数据容错
                result[elem] = {};
                result[elem].style = self.getDisplay({ fid: folderids[elem], stats: { messageCount: 0 } });
            }
            
        }
       }

        //必须等待群邮件数量加载后，才可显示更多文件夹的邮件数量
        /*
        M139.Timing.waitForReady("$User.getGroupMailInfo()", function () {
               
            self.getOtherMailCount(list);
        });*/


        $App.getModel("contacts").requireData(function () { //显示vip邮件数量
            var delay = self.model.get("isFirstLoad") ? 2000 :0;//首次加载需要延时等待通讯录的VM数据组装
            setTimeout(function () {
                M139.Timing.waitForReady("Contacts.data.vipDetails", function () { //增加waitfor,确保vipmail已经组装了
                    self.renderVipMailCount();
                });
            }, delay);
        });
       
        
       callback(result); //异步返回值
	}
	if (reload) {
	    //self.model.set("vipMailStats", null);//清空vip邮件数，在渲染的时候会重新获取
		this.model.fetchFolderList(this.model.foldertype.system,rebuildDataFunc,true);	
	}else{
		rebuildDataFunc(this.model.systemFolders);
	}
	
},
folderClick:function(event){
	var element=(event.srcElement || event.target);
	var fidStr = $(element).parents("li[fid]").attr("fid");
	if(fidStr!="" && element.tagName!= "I"){
		$App.showMailbox(Number(fidStr));
	}
},
clearFolder: function (e) {
    var target=e.target || e.srcElement;
    var fid = $(target).parents("[fid]").attr("fid");
    
    $App.trigger("mailCommand",{command:"clear",fid:Number(fid)});
},
openSetting: function () {
    $App.openDialog("个性化设置", "M2012.View.UnfoldSetting", {type:"custom", width: 383, height: 120,buttons:["确定","取消"] });
},
    /*
unfold: function (flag) { //展开更多文件夹
    var self = this;
    
    //var element = $(event.srcElement || event.target);
    //element = element.parents("li").find("i");
    var element = $('#folder_other').find("[name=i_unfoldOther]");
    if (flag==true && element.hasClass("t_blackDown")) {
        return;
    } else if (flag == false && element.hasClass("t_blackRight")) {
        return;
    }
    element.toggleClass(function (idx, className) {
        element.removeClass(); //移除所有class
        //return className == "i_plus" ? "i_minus2" : "i_plus";
    	return className.indexOf("t_blackRight") > -1 ? "triangle t_blackDown":"triangle t_blackRight";
	});


    self.model.set("unfoldOther", element.hasClass("t_blackDown"));


    $("#list_folder_other").toggle();
    this.resizeSideBar();
},*/
addFolder: function () {
    $App.trigger("mailCommand", { command: "addFolder" });
}

})
});