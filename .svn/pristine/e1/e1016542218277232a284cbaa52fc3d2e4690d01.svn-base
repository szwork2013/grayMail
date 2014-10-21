M139.namespace("M2012.Mailbox.View", {
MailSetting :Backbone.View.extend({
el:"body",
events:{
    //"click #btn_layout_list,#btn_layout_left,#btn_layout_top":"layoutClick", //叉号点击移除标签
    //"hover [name=tag_item]":"itemHover"
},
template: [ '<div class="viewSet">',
     '<dl class="clearfix" id="dl_layout">',
         '<dt>列表视图：</dt>',
         '<dd>',
 			'<a href="javascript:" title="分页列表" class="viewa" id="btn_layout_list"></a>',
 			'<a href="javascript:" title="上下分栏" class="viewa2" id="btn_layout_top" > <span class="top1"></span></a>',
 			'<a href="javascript:" title="左右分栏" class="viewa3" id="btn_layout_left"> <span class="left1"></span> </a>',
 		'</dd>',
     '</dl> ',
 	'<div class="line"></div>',
 	'<dl class="clearfix">',
 		'<dt>列表显示：</dt>',
 		'<dd><input type="checkbox" id="chk_summary" class="mr_5"><label for="chk_summary">正文摘要</label></dd>',
 		'<dd><input type="checkbox" id="chk_size"  class="mr_5"><label for="chk_size">邮件大小</label></dd>                ',
 	'</dl>',
 	'<dl class="clearfix">',
 		'<dt>显示密度：</dt>',
 		'<dd><div id="div_pagestyle"></div></dd>',
 	'</dl>',
 	'<dl class="clearfix">',
 		'<dt>每页显示：</dt>',
 		'<dd><div id="div_pagesize"></div></dd>',
 	'</dl>',
 	'<div class="line"></div>',
 	'<dl class="clearfix">',
 		'<dt>邮件列表视图：</dt>',
 		'<dd><input type="checkbox" id="chk_session" class="mr_5"><label for="chk_session">会话模式</label></dd>',
 	'</dl>  ',
 '</div>'].join(""),

initialize: function(options){
   //alert("hello");
   var self=this;
    //this.el=options.el;
   console.log(options.el);
   if (options.el) {
       this.setElement(options.el);
   }
   this.model=$App.getMailboxView().model; //与邮件列表共用model,mailboxview是一开始就创建的


   
},
layoutClick: function (btn) {
    var id = btn.id;
    $(btn).parents("dl").find("a").removeClass("viewaOn");
    $(btn).addClass("viewaOn");
    /*
	switch(id){
	    case "btn_layout_list":
	        this.model.set("layout", "list");
	        $App.setAttrs({ "list_layout": 0 });//保存到服务器
		    break;
	    case "btn_layout_left":
	        this.model.set("layout", "left");
	        $App.setAttrs({ "list_layout": 2 });//保存到服务器
		    break;
	    case "btn_layout_top":
	        this.model.set("layout", "top");
	        $App.setAttrs({ "list_layout": 1 });//保存到服务器
		    break;
	}
	this.popup.close();
	appView.trigger("showMailbox");*/
},

saveSetting:function(){
    $App.getMailboxView().model.clearSuperSelect();
    var self = this;
    //this.model.set("layout", this.layout);
    var showSummary = $("#chk_summary").attr("checked") ? true : false;
    this.model.set("showSummary", showSummary);
    var showSize = $("#chk_size").attr("checked") ? true : false;
    self.model.set("showSize", showSize);

    var sessionMode=$("#chk_session").attr("checked")?1:0;

    var layoutMap = {
        "btn_layout_list":0, "btn_layout_top":1, "btn_layout_left":2
    }
    var selectedLayoutId = $("#dl_layout .viewaOn")[0].id;
    this.model.set("layout", this.model.getLayoutStr(layoutMap[selectedLayoutId]));

    var pageSize = this.dropMenu.getSelectedItem().value;
	var pageStyle = this.styleDropMenu.getSelectedItem().value;
	
    this.model.set("pageSize", pageSize);
	this.model.set("pageStyle", pageStyle);
	
    $App.setAttrs({
        "mailcontentdisplay": showSummary?1:0,
        "mailsizedisplay": showSize ? 1 : 0,
        "preference_letters": pageSize,
        "list_layout": layoutMap[selectedLayoutId],
		"_custom_pageStyle": pageStyle
    });//保存到服务器
	
    this.model.set("pageStyle", pageStyle);
	$App.trigger('pageStyleChange',{pageStyle:pageStyle});
	try{
		if($App.getTabByName('preference')){
			$App.getTabByName('preference').isRendered = false; //刷新设置页
		}
	}catch(e){}

    $App.setReadMailMode(sessionMode, function (mode) {
        
        sessionMode === 1 ? BH('set_sessionmode') : BH('cancel_sessionmode');

        appView.trigger("showMailbox", { comefrom: "commandCallback" });

        
        $App.trigger("refreshSplitView");//刷新分栏
        
    })

    for (key in this.behaviorList) { //上报有变更过的行为点
        if (key) {
            BH(key);
        }
    }

    this.popup.close();

    //appView.trigger("showMailbox");

},
pushBehavior: function (key) {
    this.behaviorList[key] = 1;
},
render:function(){
    var self = this;
    this.behaviorList = {};
		var popup=M139.UI.Popup.create({
		name:"maillist_set",
		target:self.$el.find("#btn_setting")[0],//document.getElementById("btn_setting"),
		buttons: [{ text: "确定", cssClass: "btnSure", click: function () { self.saveSetting() } },
			{text:"取消",click:function(){popup.close();}}
		],
		content: this.template,
		autoHide:true
		}
		);
		this.popup=popup;
		
		popup.render();
		var layout = this.model.get("layout");
		var map = {
		    list: "#btn_layout_list", top: "#btn_layout_top", left: "#btn_layout_left"
		}
		$(map[layout]).addClass("viewaOn");
		//改变邮件列表布局
		$("#btn_layout_list,#btn_layout_left,#btn_layout_top").click(function (args) {
		    
		    self.layoutClick.call(self, this);
		    self.pushBehavior("mailbox_layout_ok");
		});
		//是否显示正文摘要
		$("#chk_summary").attr("checked",this.model.get("showSummary")).change(function(){
		    /*self.model.set("showSummary", $(this).attr("checked") ? true : false);
		    $App.setAttrs({ "mailcontentdisplay": $(this).attr("checked") ? 1 : 0 });//保存到服务器
			appView.trigger("showMailbox");*/
		    self.pushBehavior("mailbox_summay_ok");
		})
		
		//是否显示邮件大小
		$("#chk_size").attr("checked",this.model.get("showSize")).change(function(){
		    /*self.model.set("showSize", $(this).attr("checked") ? true : false);
		    $App.setAttrs({ "mailsizedisplay": $(this).attr("checked") ? 1 : 0 });//保存到服务器
			appView.trigger("showMailbox");*/
		    self.pushBehavior("mailbox_size_ok");
		})
		
		
		//切换读信模式 code by arway
        $("#chk_session").attr("checked",$App.isSessionMode()).change(function(){
           /* var self = this;
            var setmode = $App.isSessionMode() ? 0 : 1; // 1 -> 0  0 -> 1
            $App.setReadMailMode(setmode,function(mode){
                $(self).attr('checked', mode == 1 ? true : false);
                appView.trigger("showMailbox");
            })*/
            self.pushBehavior("mailbox_session_ok");
        });


        this.dropMenu=new M2012.UI.DropMenu.create({
            container: $("#div_pagesize"),
            menuItems: [{ text: "20封", value: 20 }, { text: "50封", value: 50 }, { text: "100封", value: 100 }]
        });
        var pageSize = this.model.get("pageSize");
        
        this.dropMenu.setSelectedValue(pageSize);
        popup.on("close", function (args) {
            
            if ($(args.event.target).parents(".menuPop").length > 0) {
                args.cancel = true;
            }            
        });
		
		
		//显示密度
		this.styleDropMenu=new M2012.UI.DropMenu.create({
            container: $("#div_pagestyle"),
            menuItems: [{ text: "紧凑", value:3}, { text: "适中", value:1}, { text: "宽松", value:2 }]
        });
        var pageStype = this.model.get("pageStyle") || 1;
        this.styleDropMenu.setSelectedValue(pageStype);
		
}

})
});