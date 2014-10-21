/*外部依赖定义*/
var $ = top.$;

document.domain = window.location.host.replace(/:\w*$/,'').match(/[^.]+\.[^.]+$/)[0];
var contextPath = top.getDomain('dingyuezhongxin') +'/inner/';
var tqqShareUrl = "http://share.v.t.qq.com/index.php";//腾讯微博分享地址
var qzoneShareUrl ="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey";//腾讯空间分享地址
var tsinaShareUrl ="http://v.t.sina.com.cn/share/share.php";//新浪微博分享地址
var requestPath = "http://"+location.host+"/subscribe/inner/";

function getSid(){
	return top.$App.getSid();
}

$(document).ready(function(){
/**
 * 分享
 */
ShareMe={
    bindShareMeEvent:function(){
        this.bindTqq();
        this.bindQzone();
        this.bindTsina();
    },bindTqq:function(){
        $(".tqqClass",document).click(function(){
			var itemId = $(this).attr("itemId");
            openShareWindow(tqqShareUrl+"?"+createReqPram(null, itemId), itemId);
        });
    },bindQzone:function(){
        $(".qzoneClass",document).click(function(){
			var itemId = $(this).attr("itemId");
            openShareWindow(qzoneShareUrl+"?"+createReqPram("pics", itemId), itemId);
        });
    },bindTsina:function(){
        $(".tsinaClass",document).click(function(){
			var itemId = $(this).attr("itemId");
            openShareWindow(tsinaShareUrl+"?"+createReqPram(null, itemId), itemId);
        });
    }
}
/**
 * 创建参数
 */
function createReqPram(paramName,itemId){
	var obj = $("#itemcontent_" + itemId,document);
	var objSum = $("#itemsummary_" + itemId,document);
	var title = encodeURIComponent("139邮箱云邮局："+objSum.html());
	var columnId = obj.attr("paramColumnId");
	var img = obj.attr("paramImg");
    var url = encodeURIComponent("http://subscribe.mail.10086.cn/subscribe/readAll.do?columnId="+columnId+"&itemId="+itemId);

    var param = new Array();
    param.push("c=share");
    param.push("a=index");
    param.push("title="+ title);
    param.push("url="+url);

    if(paramName==null){
        param.push("pic="+img);
    }else{
        param.push(paramName+"="+img);
    }
    return param.join("&");
}
/**
 * 打开页面
 * @param url
 */
function openShareWindow(url, itemId){
	//top.addBehaviorExt({actionId:100651,moduleId:25,thingId:itemId});
	top.BH('mpost_submail_share');
    window.open(url);
}

/**
 * 设置jiathis参数
 */


String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};
$.postJSON = function(url, data, callback) {
	return $.post(url, data, callback, 'json');
};


	$('.item',document).mouseout(function(){
		$(this).css('backgroundColor','#fff');
	}).mouseover(function(){
		$(this).css('backgroundColor','#F4F9FB');
	});

	/*旧版取消订阅及更多订阅按钮事件*/
	$('.but3',document).mouseout(function(){
		$(this).css('backgroundColor','#d4d0c8');
	})
    .mouseover(function(){
		$(this).css('backgroundColor','#eee9e0');
	})
    .mousedown(function(){
		$(this).css('backgroundColor','#d4d0c8');
	})
    .mouseup(function(){
		$(this).css('backgroundColor','#f0f0f0');
	});

	/*摘要双击事件*/
	$('.digest',document).dblclick(function() {
		var id = $(this).attr('param');
		itemExpand(id);
        //getCommentNumber(id,2);
        return false;
	});
	/*内容双击事件*/
	$('.content',document).dblclick(function() {
		var id = $(this).attr('param');
		itemClose(id);
        return false;
	});
  /*邮件中右侧导读条的调整*/
  $("ul li a.item_title_down,.rightMenuClass",document).mouseover(function(){
	var height = $(this).height();
	$(this).parent().css("height",height);
  })
  .mouseout(function(){
	$(this).parent().css("height","28px");
  });
  /*右侧导读条精品订阅app行为统计*/
  if($(".jpdyapp",document).length>0){
	  $(".jpdyapp",document).click(function(){
		var id = $(this).attr("param");
		top.addBehaviorExt({actionId:104021,moduleId:11,thingId:id});
	  });
	};

	$('.item_title_down,.allTextClick',document).click(function() {
		var id = $(this).attr('param');
        $(".rightMenuClass.item_title_down",document).css("background","");
        if($(this).hasClass("rightMenuClass")){
            $(this).css("background","none repeat scroll 0 0 #E8F1F9").css("display","block");
        }
		itemExpand(id);
        //getCommentNumber(id,2);
        $("#itemNameId_"+id,document).css("color","#800080");
		top.BH('mpost_submail_detail');
        return false;
	});
	$('.closeContent,.item_title_up',document).click(function() {
		var id = $(this).attr('param');
		itemClose(id);
        return false;
	});
	var itemExpand = function(id) {
        
        if($('#itemcontent_' + id,document).css("display")=="block"){
            //$(".toolBar:last").next(".inboxfl").css("color","red");
            $(window.parent.document).find(".toolBar:last").next(".J-readMailArea").animate({scrollTop:$("#itemcontent_"+id,document).offset().top + 120},1000);
            return;
        }else{
            $(window.parent.document).find(".toolBar:last").next(".J-readMailArea").animate({scrollTop:$("#itemdigest_"+id,document).offset().top + 120},1000);
        }
		$('#itemdigest_' + id,document).hide();
		$(frameElement).attr('scrolling','no');
		$('#itemcontent_' + id,document).slideDown("normal",function(){
			frameElement.style.height = document.body.scrollHeight + 30 + "px";
            //top.RM.onResize();
			$(window.parent.document).find('#articlesFrame').height($("body",document).height()+ 30);
		});
		top.addBehaviorExt({actionId:100877,moduleId:14,thingId:id});
	};
	var itemClose = function(id) {
        //$(window.parent.document).find(".toolBar:last").next(".J-readMailArea").animate({scrollTop:$("#itemcontent_"+id,document).offset().top+45},500,function(){
            //$('#itemcontent_' + id,document).slideUp("normal", function() {
            //    $('#itemdigest_' + id,document).show();
            //    frameElement.style.height = $("#contentDiv",document).height()+20+"px";
            //    $(window.parent.document).find('#articlesFrame').height($("body",document).height()+ 20);
            //});
        //});
		//$(window.parent.document).find(".toolBar:last").next(".inboxfl").animate({scrollTop:$("#itemcontent_"+id,document).offset().top+100},500,function(){ //生产环境
		
		$(window.parent.document).find(".inboxflOff[style!='display: none;']").find(".inboxfl").animate({scrollTop:$("#itemcontent_"+id,document).offset().top+100},500,function(){   //灰度环境
			$('#itemcontent_' + id,document).slideUp("normal", function() {
				$('#itemdigest_' + id,document).show();
				frameElement.style.height = $("#contentDiv",document).height()+20+"px";
				$(window.parent.document).find('#articlesFrame').height($("body",document).height()+ 20);
			});
		});
	};
    //滚动条事件
    //$(window.parent.document).find(".toolBar:last").next(".J-readMailArea").bind("scroll",function(){
	//$(window.parent.document).find(".toolBar:last").next(".inboxfl").bind("scroll",function(){    //生产环境
	$(window.parent.document).find(".inboxflOff[style!='display: none;']").find(".inboxfl").bind("scroll",function(){    //灰度环境
		if($(this).scrollTop()>130){
            $("#rightMenuId",document).css("top",($(this).scrollTop()-135));
        }else{
            $("#rightMenuId",document).css("top",50);
        }
    });

	$(".transmitFriend",document).click(function() {
		var id = $(this).attr('param');
		var content = $('#item_content_text_' + id,document).html();
		var subject = $('#item_content_title_' + id,document).text().trim();
		//top.CM.show({"subject":subject,"content":content});
		top.window.setTimeout(function() {
			top.CM.show({
				"subject" : subject,
				"content" : content
			});
		}, 10);
		top.BH('mpost_submail_share');
	});

	$(".transmitMobile",document).click(function() {
		var id = $(this).attr('param');
		var columnId = $("#itemcontent_" + id,document).attr("paramColumnId");
		var url = "http://subscribe.mail.10086.cn/subscribe/readAll.do?columnId="+columnId+"&itemId="+id;
		var name = $("#subscribeButtonId",document).prev("span").find("a").html();
		var title = $("#itemNameId_"+id,document).html();
		if(typeof(title)!="undefined" && title.length>15){
			title = title.substring(0,15)+"...";
		}
		var content = "在139邮箱云邮局看到一本好杂志【"+name+"】【"+title+"】"+url;
		var indexKey = "subscribeMobileText" + Math.random();
		top[indexKey] = content;
		window.top.Links.show("sms","&composeText=" + indexKey);
		//top.addBehaviorExt({actionId:100653,moduleId:14,thingId:id});
		top.BH('mpost_submail_share');
	});
	
    /**
     * 取消收藏
     */
    /*
	$(".cancelFavorite",document).click(function(){
		var offsetObj = $(this).offset();
		var columnId = $(this).attr('columnId');
		var itemId = $(this).attr('itemId');
        var url = requestPath + 'del_favorite.action';
		$.post(url,{columnId:columnId,itemId:itemId,sid:getSid(),t:new Date().getTime()},function(data){
			if(data!=null&&typeof(data)!="undefined"&&data.resultCode=="0"){
				$("#cancelFavId_"+itemId,document).fadeOut("slow",function(){
					$("#addFavId_"+itemId,document).fadeIn("slow");
				});
                showPop("取消收藏成功",offsetObj);
			}else{
			    top.$Msg.alert('取消收藏失败!');
			}
		},'json');
    });
	*/

    /**
     * 增加收藏
     */
	 /*
    $(".addFavorite",document).click(function(){
		var offsetObj = $(this).offset();
		var columnId = $(this).attr('columnId');
		var itemId = $(this).attr('itemId');
        var url = requestPath + 'add_favorite.action';
		$.post(url,{"userFavorite.columnId":columnId,"userFavorite.itemId":itemId,sid:getSid(),t:new Date().getTime()},function(data){
			if(data!=null&&typeof(data)!="undefined"&&data.resultCode=="0"){
				$("#addFavId_"+itemId,document).fadeOut("slow",function(){
					$("#cancelFavId_"+itemId,document).fadeIn("slow");
				});
                showPop("收藏成功",offsetObj);
			}else{
				top.$Msg.alert('收藏失败!');
			}
		},'json');
        top.addBehaviorExt({actionId:100652,moduleId:14,thingId:itemId});
    });
	*/
    //绑定分享事件
    ShareMe.bindShareMeEvent();
	//邮件分享事件
	$(".139MailClass",document).click(function(){
			var itemId = $(this).attr("itemid");
			var columnId = $("#itemcontent_" + itemId,document).attr("paramColumnId");
			var title = "【139云邮局分享】 "+$(this).attr("columnname")+": "+$(".commentTitleClass[param='"+itemId+"']",document).attr("paramtitle");
			var html =new Array();
			var shareUrl = "http://subscribe.mail.10086.cn/subscribe/readAll.do?columnId="+columnId+"&itemId="+itemId;
			html.push('<a style="text-decoration: none; color: black; font-size: 14px;font-weight:bold;">'+$(".commentTitleClass[param='"+itemId+"']",document).attr("paramtitle")+'</a></br>');
			html.push($("#item_content_text_"+itemId,document).find("div").html());
			html.push("<br/><a target='_blank' href='"+shareUrl+"' style='font-size: 12px;font-weight:normal;'>点击查看原文</a>");
			top.$Evocation.create({type:'1', subject : title, isEdit : 0, content : html.join("")});
			//top.CM.show({subject:title,content:html.join("")});
			top.BH('mpost_item_sharemail');
	});
    frameElement.style.height = $("#contentDiv",document).height()+20+"px";
	$(window.parent.document).find('#articlesFrame').height($("body",document).height()+ 20);
    //$(window.parent.document).find(".toolBar:last").next(".J-readMailArea").children("i").hide();

	try{
		$("#subscribeButtonId",document).prev().children("a").removeAttr("href").removeAttr("target");
		$("h3 a",document).removeAttr("href").removeAttr("target");
		$("a[id*='item_content_title']",document).removeAttr("href").removeAttr("target");
    }catch(e){}
    
    //点击评论事件，由于要修改to_comment_list.action页面，暂时作跳转处理
    /*$(".commentTitleClass",document).click(function(){
        //top.$App.jumpTo('15',jumpToKey);
        var itemId = $(this).attr("param");
        if($(".commentClass_"+itemId,document).css("display")=="block"){
            $(".commentIframeClass_"+itemId,document).remove();
            $(this).parent().parent().css("background-color","");
            $(".commentClass_"+itemId,document).slideUp("normal",function(){
               frameElement.style.height = $("#contentDiv",document).height()+"px";
                //top.RM.onResize();
                $(window.parent.document).find('#articlesFrame').height($("body",document).height());
            });
        }else{
            $("#commentId_"+itemId,document).after('<iframe class="commentIframeClass_'+itemId+'" onload="resetIframeHeight(this);" src="'+contextPath+'to_comment_list.action?id='+itemId+'&type=2&title='+$(this).attr("paramTitle")+'" id="commentFrame" allowtransparency="true" marginwidth="0" marginheight="0" width="100%" frameborder="0" style="display:none;padding-top:10px;"></iframe>');
            $(".commentClass_"+itemId,document).slideDown();
            $(".commentIframeClass_"+itemId,document).slideDown();
            $(this).parent().parent().css("background-color","transparent");
        }
    });*/
    //插入订阅取消按钮
    //$("#subscribeButtonId",document).show();
    //右边导航
	if($("#rightMenuId",document)){
        $("#rightMenuId",document).show();
		var spanNumber = $(".rightMenuClass span",document).length;
		var aNumber = $(".rightMenuClass",document).length;
		if(aNumber*2==spanNumber){
			$(".rightMenuClass",document).css("overflow","hidden").css("_zoom","1");
			$(".rightMenuClass span:odd",document).css("width","138px").css("float","left").css("display","block").css("padding-left",null);
		}
    }
    /*
	if($("#itemSizeId",document).val()=="1"){
        var itemId = $("#commentNumberId",document).parent("a").attr("param");
        getCommentNumber(itemId,2);
    }*/
    //绑定事件
    bindSubscribeEvent();

	$(".myBookListClass",document).click(function(){
		var pageType = $('#pageType');
		var itemId = $("#commentNumberId",document).parent("a").attr("param");
		top.MB.subscribeTab('myMag');
		var ext1 = 1;
		if(pageType[0]&&pageType.text()=='magazine'){
			ext1=2;
		}
		top.addBehaviorExt({actionId:104486,moduleId:14,thingId:itemId,ext1:ext1});
	});
});

/**
 * 多媒体播放器
 */
function initPlayer()
{
	//多媒体邮件中播放器
    var multiType = $('#multiType',document).val();
	//1:音频;2:视频
	if(multiType==2) 
	{
		var height = 300;
		var width =400;
		var jPlayer =$("#playerFrame",document);
		var playerPath =$("#playerSource",document).val(); 
		var playerVideoSource = [
					{type : "video/mp4", src : "http://images.139cm.com/subscribe/"+playerPath}
				];
		var mp = new M139.Component.MediaPlayer.Player({
						type: "video",
						sources: playerVideoSource,
						poster: "oceans-clip.png",
						height: height,
						width: width,
						preload: false,
						autoplay: false,
						container:  jPlayer[0],
					    basePath: "http://image0.139cm.com/m2012/component/mediaplayer/"
					});
		jPlayer.show();
	}else if(multiType==1){
		var height = 60;
		var width =340;
		var jPlayer =$("#playerFrame", document);
		var playerPath =$("#playerSource",document).val(); 
		var playerAudioSource = ["http://images.139cm.com/subscribe/"+playerPath];
		var mp = new M139.Component.MediaPlayer.Player({
						type: "audio",
						sources: playerAudioSource,
						height: height,
						width: width,
						preload: false,
						autoplay: false,
						container:  jPlayer[0],
					    basePath: "http://image0.139cm.com/m2012/component/mediaplayer/"
					});
		jPlayer.show();
	}
}

/**
 * 绑定按钮事件
 */
function bindSubscribeEvent(){
    $("#btnDelSubscribe",document).click(function() {
        /*
		var obj = $(this);
		var param = $(this).attr("param");
		var paramArray = param.split('|');
		var id = paramArray[0];
		var url = requestPath+ 'del_subscribe.action';
		var timestamp = new Date().getTime();
		$.post(url,{columnId:id,subComeFrom:502,sid:getSid(),t:timestamp},function(data){
			if (data.resultCode=="20") {
				obj.hide();
				$("<span id='spanCanceled' style='position:relative;top:-5px;color:#A0A0A0;'>已取消订阅</span>").insertAfter(obj);
			} else if(data.resultCode=="21"){
				var columnName = paramArray[1];
				var price = paramArray[2];
				showUnsubscribeNotice(columnName,price);
			} else{
				top.$Msg.alert('退订失败，请稍后重试!');
			}
		},'json');
		*/
		top.$Msg.alert('请在我的云邮局服务中退订。');
	});

    /*新版取消订阅及更多订阅按钮事件*/
    $('#btnDelSubscribe',document).mouseout(function(){
        $("#imgCancel",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_03.gif');
    })
    .mouseover(function(){
        $("#imgCancel",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_03_01.gif');
    })
    .mousedown(function(){
        $("#imgCancel",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_03_02.gif');
    })
    .mouseup(function(){
        $("#imgCancel",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_03.gif');
    });

    $('#139Command_LinksShow').mouseout(function(){
        $("#imgMore",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_05.gif');
    })
    .mouseover(function(){
        $("#imgMore",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_05_01.gif');
    })
    .mousedown(function(){
        $("#imgMore",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_05_02.gif');
    })
    .mouseup(function(){
        $("#imgMore",document).attr('src','http://images.139cm.com/subscribe/images/mail/btn_05.gif');
    });
}

function showPop(content,offsetObj){
    if($("#noticePopId",document)){
        $("#noticePopId",document).remove();
    }
    var html = '<div style="background: none repeat scroll 0 0 #E5E5E5;height: 40px;margin: 80px;width: 105px; position: absolute; top:'+(offsetObj.top-125)+'px;left:'+(offsetObj.left-80)+'px;" id="noticePopId">'+
                '<span style="width:105px;background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #CCCCCC;height: 40px;left: -84px;margin: 80px;position: absolute;top: -84px; z-index: 10;">'+
                '<i style="background: url(&quot;http://images.139cm.com/subscribe/images/subscribe.gif&quot;) no-repeat scroll -163px -50px transparent;height: 16px;left: 12px;position: absolute;top: 12px;width: 16px;"></i>'+
                '<em id="popConentId" style="left: 32px;position: absolute;top: 12px;font-size: 12px;">'+content+'</em>'+
                '<i style="background: url(&quot;http://images.139cm.com/subscribe/images/subscribe.gif&quot;) no-repeat scroll -94px -96px transparent;height: 10px;left: 40px;position: absolute;top: 40px;width: 15px;"></i>'+
                '</span>'+
                '</div>';

    $("body",document).append(html);
    $("#noticePopId",document).fadeIn(function(){
        setTimeout(function(){
            $("#noticePopId",document).fadeOut("slow");
        },"1000");
    });
    return false;
}

/**
 * 重新设置iframe高度
 */
function resetIframeHeight(obj){
    top.$App.trigger('mailResize',{mid:top.$App.getCurrMailMid()});    
}

/**
 * 获评评论数量
 */
 /*
function getCommentNumber(itemId,type){
  var url = requestPath + 'queryCommentNumber.action';
  $.post(url,{id:itemId,type:type,sid:getSid(),t:new Date().getTime()},function(data){
    if(data==null||typeof(data)=="undefined"){
            return;
        }
        $(".commentNumberClass_"+itemId,document).text(data.currentPage);
  },'json');
}*/



/**
 * 显示订阅提示
 */
function showSubscribeNotice(columnName,price){
    var html =  "<div>\n" +
        "<i></i>\n" +
        "<h4 id=\"SubStr\" style=\"color:#FF0000\">请通过手机短信确认订阅！</h4>\n" +
        "<p id=\"AlertStr\" style=\"line-height:22px;\">您已申请订阅<strong style=\"font-weight:bold;\">《"+columnName+"》，资费："+price+"</strong>。我们已将确认订阅短信发送到您的<strong style=\"font-weight:bold;\">手机，请回复 Y </strong>确认并完成订阅。</p>\n" +
        "\t<p  style=\"line-height:22px;\">订阅成功后根据您的<strong style=\"font-weight:bold;\">投递设置</strong>，我们将发送您所订阅的杂志到<strong style=\"font-weight:bold;\">“我的订阅”</strong>文件夹。请注意查收。</p>\n" +
        "<p id=\"bntView\"  style=\"line-height:22px;\">\n" +
        "\t<a style=\"text-decoration: none;margin: 10px auto;width: 84px;font: bold 14px/33px 'simsun';background-image:url('http://homemail.mail.10086.cn/Template/images/btnAll.gif'); background-position: -400px 0;color: white;text-shadow: 1px 1px;position: relative;display:block;text-align:center;\" href=\"javascript:top.FF.close();\" id=\"closePage\">确定</a>\n" +
        "\t</p>\n" +
        "<p id=\"P1\"  style=\"line-height:22px;\"><span class=\"STYLE1\"><b>温馨提示：</b></span></p>\n" +
        "<p style=\"line-height:22px;\">您可以在<strong style=\"font-weight:bold;\">“订阅管理”</strong> 中管理所有订阅的杂志期刊。</p></p>\n" +
        "</div>";
    //top.$Msg.show(html,"精品订阅",480);
      top.$Msg.showHTML(html,{
                width:480,
                dialogTitle:'云邮局',
                buttons:["确定"]
            }); 
}

/**
 *
 */
function showUnsubscribeNotice(columnName,price){
    var html = "<div>\n" +
        "<i></i>\n" +
        "<h4 id=\"SubStr\" style=\"color:#FF0000\">请通过手机短信确认订阅！</h4>\n" +
        "<p id=\"AlertStr\" style=\"line-height:22px;\">您已申请退订<strong style=\"font-weight:bold;\">《"+columnName+"》，资费："+price+"</strong>。我们将退订短信发送到您的<strong style=\"font-weight:bold;\">手机，请回复 TD </strong>并确认完成退订。</p\n" +
        "\t<p id=\"bntView\"  style=\"line-height:22px;\">\n" +
        "\t<a style=\"text-decoration: none;margin: 10px auto;width: 84px;font: bold 14px/33px 'simsun';background-image:url('http://homemail.mail.10086.cn/Template/images/btnAll.gif'); background-position: -400px 0;color: white;text-shadow: 1px 1px;position: relative;display:block;text-align:center;\" href=\"javascript:top.FF.close();\" id=\"closePage\">确定</a>\n" +
        "\t</p>\n" +
        "</div>";
    //top.FF.show(html,"精品订阅",480);
    top.$Msg.showHTML(html,{
                width:480,
                dialogTitle:'云邮局',
                buttons:["确定"]
            }); 
}
//插入推荐区域
function insertRecommend(width){
    if($("#recummendDivId",document).length>0){
        $("#recummendDivId",document).remove();
        $("#columnTempleteDl",document).remove();
    }
    var html = "<div style=\"width: "+width+";line-height:100%;border: 1px solid #D9D9D9; position: relative; -moz-box-shadow: 1px 1px 3px #F1F1F1; -webkit-box-shadow: 1px 1px 3px #F1F1F1; box-shadow: 1px 1px 3px #F1F1F1; margin: 10px 0; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;\">\n" +
        "<div style=\"color: #242F35; font-size: 13px; overflow: hidden; _zoom: 1; padding: 10px;\">\n" +
        "<h2 style=\"font-weight: bold; font-size: 13px; float: left; margin: 0; padding: 0\">大家都在看</h2>\n" +
        "</div>\n" +
        "<div id=\"recommentDiv\" class=\"cet_book guestLikeBar clear\" style=\"padding: 0 4px; overflow: hidden; _zoom: 1;\">\n" +
        "<dl style=\"border-left: 1px dashed #ccc; font-size: 12px; padding: 30px 0 30px 55px; width: 90px;width:80px; height: auto; float: right; margin: 0 !important; display: inline;\">\n" +
        "<dt style=\"margin: 0; padding: 0;\">\n" +
        "<a class=\"but4 showIndex\" style=\"cursor: pointer;\"><img src=\"http://images.139cm.com/subscribe/images/add.png\" border=\"0\"></a>\n" +
        "</dt>\n" +
        "<dd style=\"margin: 0; padding: 0;\">\n" +
        "<a class=\"but4 showIndex\" style=\"cursor: pointer;color: #999;\" >更多订阅&gt;</a>\n" +
        "</dd>\n" +
        "</dl>\n" +
        "</div>\n" +
        "</div>" +
        "<dl id=\"columnTempleteDl\" style=\"display:none;width: 132px; height: 132px; *height: 135px; font-size: 12px; margin: 0 8px 0; padding-bottom: 13px; float: left; overflow: hidden;\">\n" +
        "<dt style=\"width: 132px; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin: 0; padding: 3px;\">\n" +
        "<span style=\"position: relative;\">\n" +
        "<img src=\"\" width=\"60\" height=\"60\" >\n" +
        "<i style=\"display:none;position: absolute;right: -1px;bottom: -1px;background: url(http://images.139cm.com/subscribe/images/rssOk-24.png) no-repeat;width: 24px;height: 25px;\"></i>\n" +
        "</span>\n" +
        "</dt>\n" +
        "<dd style=\"margin: 0;padding: 0;margin-top: 7px;width: 132px;-moz-text-overflow: ellipsis;-webkit-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;\"><strong id=\"columnNameDiv\"></strong></dd>\n" +
        "<dd id=\"descDD\" style=\"color: #999; width: 134px; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin: 0; padding: 0; margin-top: 7px;\">\n" +
        "<a href='javascript:void(0);' style='text-decoration: none;color:#1E5494;' id=\"categorySpan\"></a><span style=\"margin: 0 3px;\">|</span><span id=\"descSpan\"></span>\n" +
        "</dd>\n" +
        "<dd style=\"width: 134px; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin: 0; padding: 0; margin-top: 7px;\">\n" +
        "<button type=\"button\"  class=\"noSubscribeClass subClass\">订阅</button>\n" +
        "<span class=\"subscribeClass\" style=\"display:none\">\n" +
        "<a>\n" +
        "<span class='readClass'>阅读</span>\n" +
        "<span style=\"color:#B3B3B3;\">|</span>\n" +
        "<span class=\"delSubClass\" style=\"color:#1E5494!important;cursor:pointer;\">退订</span>\n" +
        "</a>\t\n" +
        "</span>\n" +
        "</dd>\n" +
        "</dl>";
       
    $("#contentDiv",document).append(html);
    top.$App.trigger('mailResize',{mid:top.$App.getCurrMailMid()});    
}

//阅读杂志
function readMagazine(param,columnId,columnName) {
	var journalId = "";
	try{
		if(param){
			journalId=param.split("&")[0].split("=")[1];		
		}
		var jsUrl = contextPath+"scripts/packs/subscribereader.all.pack.js?v=20140115";
		var cssUrl = contextPath+"style/module/picture.css?v=20140115";
		if($("#subscribeReaderCss",top.document).length<1){
			top.$("head").append('<link id="subscribeReaderCss" rel="stylesheet" href="'+cssUrl+'" type="text/css">');
		}
		top.M139.core.utilCreateScriptTag({
			id: "subscribeReaderJs",
			src: jsUrl,
			charset: "utf-8"
		}, function(){
			try{
				$subscribeReaderApp = new top.M2012.Subscribe.Reader.Application({journalId : journalId,resourcePath:contextPath});
				$subscribeReaderApp.run();
			}catch(e){
				top.$App.showUrl(contextPath+'reader/index.action?'+param,columnName);
			}
		});
	}catch(e){
		top.$App.showUrl(contextPath+'reader/index.action?'+param,columnName);
	}
}

//杂志阅读
function readM(columnId,columnName){
	var jsUrl = contextPath+"scripts/packs/subscribereader.all.pack.js?v=20140115";
	var cssUrl = contextPath+"style/module/picture.css?v=v=20140115";
	if($("#subscribeReaderCss",top.document).length<1){
		top.$("head").append('<link id="subscribeReaderCss" rel="stylesheet" href="'+cssUrl+'" type="text/css">');
	}
	top.M139.core.utilCreateScriptTag({
		id: "subscribeReaderJs",
		src: jsUrl,
		charset: "utf-8"
	}, function(){
		try{
			$subscribeReaderApp = new top.M2012.Subscribe.Reader.Application({columnId : columnId,resourcePath:contextPath});
			$subscribeReaderApp.run();
		}catch(e){
			top.$App.showUrl(contextPath+'reader/index.action?c='+columnId,columnName);
		}
	});
}

//阅读邮件
function readR(){
	//top.MB.subscribeTab('mySubscribe');
    top.$App.showMailbox(9);
}

function bingRecommendEvent(){
    /**推荐相关事件绑定**/
    $('.subClass',document).click(function(){
		var param = $(this).attr("param");
        var paramArray = param.split('|');
        var id = paramArray[0];
        var offsetObj = $(this).offset();
        var timestamp = new Date().getTime();
        var url = requestPath+ 'subscribe.action';
		$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
			if(data.resultCode=="10"){
                $('#noSubscribeClass_'+id,document).hide();
                $('#subscribeClass_'+id,document).show();
                $(".subPic_"+id,document).show();
                offsetObj.left = offsetObj.left-30;
                showPop("订阅成功",offsetObj);
            }else if(data.resultCode=="11"){
                var columnName = paramArray[1];
                var price = paramArray[2];
                showSubscribeNotice(columnName,price);
            }else{
                top.$Msg.alert("订阅失败，请重试！");
            }
		},'json');
    });
    $('.delSubClass').click(function(){
		var param = $(this).attr("param");
        var paramArray = param.split('|');
        var id = paramArray[0];
        var offsetObj = $(this).offset();
        var timestamp = new Date().getTime();
        var url = requestPath+ 'del_subscribe.action';
		$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
			if(data.resultCode=="20"){
                $('#noSubscribeClass_'+id,document).show();
                $('#subscribeClass_'+id,document).hide();
                $(".subPic_"+id,document).hide();
                offsetObj.left = offsetObj.left-81;
                showPop("退订成功",offsetObj);
            }else if(data.resultCode=="21"){
                var columnName = paramArray[1];
                var price = paramArray[2];
                showUnsubscribeNotice(columnName,price);
            }else{
                top.$Msg.alert('退订失败!');
            }
		},'json');
    });

	$('.showIndex',document).click(function(){
		top.Links.show('dingyuezhongxin');
	});
}


function bingRecommendMail(){
	
	$('.recommendSubClass',document).click(function(){
		var param = $(this).attr("param");
		var paramArray = param.split('|');
		var id = paramArray[0];
		var offsetObj = $(this).offset();
		var timestamp = new Date().getTime();
		var url = requestPath+ 'subscribe.action';
		$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
			if(data.resultCode=="10"){
				$('#recommendNoSubscribeClass_'+id,document).hide();
				$('#recommendSubscribeClass_'+id,document).show();
				offsetObj.left = offsetObj.left-30;
				showPop("订阅成功",offsetObj);
			}else if(data.resultCode=="11"){
				var columnName = paramArray[1];
				var price = paramArray[2];
				showSubscribeNotice(columnName,price);
			}else{
				top.FF.alert("订阅失败，请重试！");
			}
		},'json');
		top.addBehaviorExt({actionId:104038,moduleId:14,thingId:id,ext1:6});
	});
	$('.recommendDelSubClass',document).click(function(){
		var param = $(this).attr("param");
		var paramArray = param.split('|');
		var id = paramArray[0];
		var offsetObj = $(this).offset();
		var timestamp = new Date().getTime();
		var url = requestPath+ 'del_subscribe.action';
		$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
			if(data.resultCode=="20"){
					$('#recommendNoSubscribeClass_'+id,document).show();
					$('#recommendSubscribeClass_'+id,document).hide();
					offsetObj.left = offsetObj.left-81;
					showPop("退订成功",offsetObj);
				}else if(data.resultCode=="21"){
					var columnName = paramArray[1];
					var price = paramArray[2];
					showUnsubscribeNotice(columnName,price);
				}else{
					top.FF.alert('退订失败!');
				}
		},'json');
		});
}
function bingRecomendRead(){
		/*点击阅读*/
		$(".recommendReadClass",document).click(function(){
			var value = $(this).attr('param');
			var columnID = $(this).attr("columnID");
			var columnName = $(this).attr("columnName");
			if(value == 1){
				readM(columnID,columnName);
			}else{
				readR();
			}
		});
		$(".myRecommendSubscribeId",document).click(function(){
			var id = $(this).attr('param');
			top.addBehaviorExt({actionId:104038,moduleId:14,ext1:id});
			readR();
		});
}
function bingRecomendBehavior(){
		
		$(".recommendFeedBackId",document).click(function(){
			var id = $(this).attr('param');
			top.addBehaviorExt({actionId:104038,moduleId:14,ext1:id});
		});
		$(".recommendCategoryId",document).click(function(){
			var id = $(this).attr('param');
			top.addBehaviorExt({actionId:104038,moduleId:14,ext1:5});
		});
		$(".recommendColumnDetailId",document).click(function(){
			var id = $(this).attr('param');
			top.addBehaviorExt({actionId:104038,moduleId:14,ext1:4});
		});
}
function isColumnSubscribed(){
		var count = 0;
		var id;
		var url = requestPath + 'column_is_subscribed.action';
		$('.recommendSubClass',document).each(function(){
			var param = $(this).attr("param").split("|");
			if(count ==0){
				id =param[0];
				count++;
			}else{
				id = id +"|" + param[0];
			}
		});
		$.post(url,{'columnID':id},function(data){	
				var d = data.result.split("|");
				var columnid = id.split("|");
				for( i=0;i<d.length;i++){
					if(d[i] == "isSub"){
					$('#recommendNoSubscribeClass_'+columnid[i],document).hide();
					$('#recommendSubscribeClass_'+columnid[i],document).show();
					}
				}
				
			 },'json');
}

$(document).ready(function(){
	
	//window.setTimeout(initPlayer,2000);
	initPlayer();
	
	$("#mpostappid",document).click(function(){
		top.addBehaviorExt({actionId:104912,moduleId:14,ext1:id});
	});

    var pageType = $('#pageType',document);
    
    if(pageType[0]&&pageType.text()=='magazine'){
		$(".readerLink",document).removeAttr("href");
        $(".readerLink",document).click(function(){
            readMagazine($(this).attr('param'),$(this).attr('columnId'),$(this).attr('columnName'));
        });
    }else if(pageType[0]&&pageType.text()=='mailrecommend'){
		
		isColumnSubscribed();
		bingRecommendMail();
		bingRecomendRead();
		bingRecomendBehavior();
		
		var posturl = requestPath+ 'mail_unsubcribe.action';
		$.post(posturl,{'status':'1','flag':'20001'},function(data){
			if(data.result == "true"){
				$(".unSubscribeMailId",document).html("已退订");
				$(".unSubscribeMailId",document).unbind("click");
			}
		},"json");

		$(".unSubscribeMailId",document).click(function(){
			var id = $(this).attr('param');
			var offsetObj = $(this).offset();
			var url = requestPath +'mail_unsubcribe.action';
			$.post(url,{'status':'0','flag':'20001'},function(data){
				if(data.result == "success"){
					$(".unSubscribeMailId",document).html("已退订");
					$(".unSubscribeMailId",document).unbind("click");
				}else if(data == "failed"){
					top.FF.alert('退订失败!');
				}else{
					top.FF.alert('错误的请求');
				}
			},'json');
			top.addBehaviorExt({actionId:104038,moduleId:14,ext1:id});
		});
	}else if(pageType[0]&&pageType.text()=='mailoperate'){
		$("a.a2",document).removeAttr("href");
		$(".recommendSubClass",document).removeAttr("href");
		var count = 0;
		var id;
		var url = requestPath + 'column_is_subscribed.action';
		$('.recommendSubClass',document).each(function(){
			var param = $(this).attr("param").split("|");
			if(count ==0){
				id =param[0];
				count++;
			}else{
				id = id +"|" + param[0];
			}
		});
		$.post(url,{'columnID':id},function(data){	
				var d = data.result.split("|");
				var columnid = id.split("|");
				for( i=0;i<d.length;i++){
					if(d[i] == "isSub"){
					$('.recommendNoSubscribeClass_'+columnid[i],document).hide();
					$('.recommendSubscribeClass_'+columnid[i],document).show();
					}
				}
			 },'json');
		$('.recommendSubClass',document).click(function(){
			var param = $(this).attr("param");
			var paramArray = param.split('|');
			var id = paramArray[0];
			var timestamp = new Date().getTime();
			var url = requestPath+ 'subscribe.action';
			$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
				if(data.resultCode=="10"){
					$('.recommendNoSubscribeClass_'+id,document).hide();
					$('.recommendSubscribeClass_'+id,document).show();
					$("#mpostsubid",document).hide();
					$("#mpostredid",document).show();
				}else if(data.resultCode=="11"){
					var columnName = paramArray[1];
					var price = paramArray[2];
					showSubscribeNotice(columnName,price);
				}else{
					top.FF.alert("订阅失败，请重试！");
				}
			},'json');
			top.addBehaviorExt({actionId:104038,moduleId:14,thingId:id,ext1:6});
		});
	$('.recommendDelSubClass',document).click(function(){
		var param = $(this).attr("param");
		var paramArray = param.split('|');
		var id = paramArray[0];
		//var offsetObj = $(this).offset();
		var timestamp = new Date().getTime();
		var url = requestPath+ 'del_subscribe.action';
		$.post(url,{columnId:id,subComeFrom:502,recommend:'email',sid:getSid(),t:timestamp},function(data){
			if(data.resultCode=="20"){
					$('.recommendNoSubscribeClass_'+id,document).show();
					$('.recommendSubscribeClass_'+id,document).hide();
					//offsetObj.left = offsetObj.left-81;
					//showPop("退订成功",offsetObj);
				}else if(data.resultCode=="21"){
					var columnName = paramArray[1];
					var price = paramArray[2];
					showUnsubscribeNotice(columnName,price);
				}else{
					top.FF.alert('退订失败!');
				}
		},'json');
		});
		bingRecomendRead();
	}
	
	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	if(pageType[0]&&pageType.text()=='mailrecommend' || pageType[0]&&pageType.text() == 'mailoperate'){

	}else{
		var params = null;
		if($('#btnDelSubscribe',document).attr('param')){
			params = $('#btnDelSubscribe',document).attr('param').split("|");
		}else{
			return;
		}
		var recommendUrl = requestPath + "recommend.action";
		$.post(recommendUrl,{columnId:params[0],sid:getSid(),t:new Date().getTime()},function(obj){
			if(obj==null||typeof(obj)=="undefined"){
			  return;
			}
			if(!isArray(obj)){
				return;
			}
			var l = obj.length;
			if(l>0){
				if(pageType[0]&&pageType.text()=='magazine'){
					insertRecommend("761px");
				}else{
					insertRecommend("750px");
				}
					var recommentDiv = $('#recommentDiv',document);
					var dlElement = $('#columnTempleteDl',document);
					for(var i=0;i<l;i++){
						var dl = dlElement.clone(true);
						dl.removeAttr('id');
						var columnId = obj[i].columnId;
						var categoryId = obj[i].categoryId;
						dl.find('.noSubscribeClass').attr('id','noSubscribeClass_'+columnId);
						dl.find('.subscribeClass').attr('id','subscribeClass_'+columnId);
						var btnStr = "免费订阅";
						if(obj[i].feeModel!=0){
							btnStr = obj[i].subprice+'元/'+obj[i].feeway;
						}
						var columnName = obj[i].name;
						dl.find('.subClass,.delSubClass').attr('param',obj[i].columnId+'|'+columnName+'|'+btnStr);
						dl.find('.subClass').html(btnStr);
						dl.find('img').attr('src',obj[i].logoUrl).attr('alt',columnName).attr("param",columnId).css("cursor","pointer").click(function(){
							var id = $(this).attr("param");
							top.Links.show('dingyuezhongxin','&columnId='+id+'&recommend=email');
						});
						dl.find('#categorySpan').html(obj[i].categoryName).attr("param",categoryId).click(function(){
							var id = $(this).attr("param");
							top.Links.show('dingyuezhongxin','&categoryId='+id+'&recommend=email');
						});
						dl.find('#descSpan').html(obj[i].description);
						dl.find('#columnNameDiv').html(columnName).attr("param",columnId).css("cursor","pointer").click(function(){
							var id = $(this).attr("param");
							top.Links.show('dingyuezhongxin','&columnId='+id+'&recommend=email');
						});
						dl.find("i").attr("class","subPic_"+obj[i].columnId);
						dl.css("display","block");
				if(obj[i].isPackage==1){
				  dl.find(".readClass").css('cursor',"pointer").attr("param",columnId).click(function(){
					var id = $(this).attr("param");
					top.Links.show('dingyuezhongxin','&columnId='+id+'&recommend=email');
				  });
				}if(obj[i].isMagazine==1){
				  dl.find(".readClass").css('cursor',"pointer").attr("columnName",columnName).attr("param",columnId).click(function(){
					var id = $(this).attr("param");
					var name = $(this).attr("columnName");
					readM(id,name);
				  });
				}else{
				  dl.find(".readClass").css('cursor',"pointer").click(function(){
					readR();
				  });
				}
						recommentDiv.append(dl);
					}
					bingRecommendEvent();
				}
		},'json');
	}
});