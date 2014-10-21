M139.namespace("M2012.Mailbox.View", {
MailTag :Backbone.View.extend({
el:"#div_main",
events:{
    "click [name=tag_item] a": "deleteClick", //叉号点击移除标签
    "hover [name=tag_item]":"itemHover"
},
createInstance:function(){//单例模式
	if(!$App.getView("tagview")){
   		$App.registerView("tagview",new M2012.Mailbox.View.MailTag());
	}
	this.seqId=1;
   return $App.getView("tagview");
},
initialize: function(options){
   //alert("hello");
   var self=this;
   //this.el=options.el;
   this.model=$App.getMailboxView().model; //与邮件列表共用model,mailboxview是一开始就创建的

 
   
},

deleteClick: function (sender, target) {//删除标签按钮点击
	$Event.stopEvent(sender);

	// BUG
	// 当target为空时，无论如何个赋值都改变不了undefined的命运
	// 所有重新声明一个变量来保存从事件中获取的目标元素
	var targetElement;
    if (!target) {
    	targetElement = sender.srcElement || sender.target;
        targetElement = $(targetElement).parents("[name=tag_item]");
    } else {
    	targetElement = target;
    }

	
	var currentTab=$App.getCurrentTab();
	var tagId=$(targetElement).attr("tagid");	
	var mid = $(targetElement).closest('div[name=covMail_summary]').attr('data-mid') || // 会话模式摘要
			  $(targetElement).closest('div[name=covMail_mainbody]').attr('mid') ||		// 会话模式正文
			  $(targetElement).parents("tr").attr("mid");								// 邮件列表
  	mid = mid ? mid : currentTab.view.model.get("mid");									// 读信页（普通读信 or 分栏读信）	
	
	this.model.removeTagForMail([mid],tagId,function(){
		// 会话邮件列表or会话邮件正文删除不刷新
		var inCovMail = $(targetElement).closest('div[name=covMail_summary]')[0] || $(targetElement).closest('div[name=covMail_mainbody]');
		if(inCovMail ) {
			$App.trigger('deleteCovMailTag', {mid: mid, tagId: tagId});
		// 通知邮件列表数据改变
		} else {
			$App.trigger("mailboxDataChange",{render:true});//刷新整个视图
			$App.trigger("refreshSplitView");//渲染读信侧分栏
		}
		targetElement.remove(); //删除成功，移除dom
	    $App.trigger("reloadFolder");		
		$App.trigger("removeTag",{mids:[mid],labelId:tagId, currMid:mid});
	});
	BH("mailbox_tag_delete");

	return false;
},
itemHover:function(sender){
	var target=sender.srcElement || sender.target;
	if($(target).attr("name")!=='tag_item'){ //如果不是当前元素，冒泡到上级一直找到tagItem
		target=$(target).parents("[name=tag_item]");
	}
	if($(target).hasClass("tagOn")){
		$(target).removeClass("tagOn");
	} else{
		$(target).addClass("tagOn");
	}
},
attachHintForTag: function () {

    $Hint.register($("#tag_list span[name=tagMin]"), function (sender) {
        return ["<div>" , $(sender).attr("titleEx") , "&nbsp;<a id='btn_tagMinDelete' rel='",$(sender).attr("id"),"' href='javascript:'>[删除]</a></div>"].join("");
    });
    var self = this;
    $("#btn_tagMinDelete").die("click");
    $("#btn_tagMinDelete").live("click",function () {
        var id = $(this).attr("rel");
        return self.deleteClick(null,$("#"+id)); 
    });
},
render: function (tagIds, isMini) { //此render函数由repeater调用，上下文为repeater对象实例
        
 		var tags=$App.getTagsById(tagIds);
 		var arr = [];
 		
 		if (isMini == undefined) {
 		    isMini=this.model.get("layout") == "left";//邮件列表左右布局使用mini tag
 		}

		for(var i=0;i<tags.length;i++){
			var color=$App.getTagColor(tags[i]["folderColor"]);
			if(isMini){ //迷你型tag
			    arr = arr.concat(['<span id="tagMin_', Math.random().toString().replace(".", ""), '" name="tagMin" tagId="', tags[i].fid, '" titleEx="', tags[i].name, '" class="tagMin" style="border-color:', color,
				'"><span class="tagBody" style="background-color:',color,';border-color:',color,
				'" onclick="appView.showMailbox(', tags[i].fid, ')"></span></span>']);
			}else{
			    var tagHtml=['<span name="tag_item" tagId="', tags[i].fid,
			'" href="javascript:" class="tag" style="border-color:',color,
			'"><span class="tagBody" style="background-color:',color,
			';border-color:', color, '"><span bh="mailbox_tag_open" name="tag_span" onclick="appView.showMailbox(', tags[i].fid, ')">', tags[i].name,
			'</span><a href="javascript:" name="cl_tag" ><i class="i_cl_w"></i></a></span></span>'];
			    /*if ($App.getCurrentTab().group == "mailbox") { //邮件列表添加多一层div容器
			        tagHtml.unshift('<div class="TagDiv">');
			        tagHtml.push("</div>");
			    }*/
			    arr = arr.concat(tagHtml);
			}
		}
		/*if(isMini){
		    arr.unshift('<div>');
		    arr.push('</div>');
		}else{  //TagDdiv放外面,读信用unwrap去掉tagdiv
		    arr.unshift('<div class="TagDiv">');
		    arr.push("</div>");
		}*/
		return arr.join("");
}

})
});