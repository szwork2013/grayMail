/**
 * 右下角弹出onlinetips
 * @example
 * M139.UI.TipOnlineView.show();
 */
M139.core.namespace("M139.UI.TipOnlineView", Backbone.View.extend({
    initialize: function (options) {}
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.TipOnlineView,{
		title:"上线提醒",
		show:function(){
			 if(!$BMTips.isUserOpen($BMTips.types['online'])){return ;}
			 var callback = function(data){
       	   		    if(!data) return;
		       	 	if(data.length>0){
		       	 		if(!$BMTips.logSuc)$BMTips.logSuc={};
		       	 		$BMTips.users.online = data;
		       	 		M139.UI.TipOnlineView.showNewOnlineMan(data);
		       	 	}
			 }
			 $BMTips.getOnlineUsers('online',callback);
		},
		/**
		 *取得新上线人的
		 *@param {array}  newUsers   最新上线人
		 */
		showNewOnlineMan:function(newUsers){
	       var fullUsers = $BMTips.updateUserGName(newUsers);
		   var content = $BMTips.buildSummary(newUsers,fullUsers,'online'); //修改这里的长度
		   var handleContent = this.buildContent(newUsers[0].imageUrl,newUsers[0].friendName,newUsers[0].friendMail,content);
		   
		   $BTips.addTask({
		   	              title:M139.UI.TipOnlineView.title,
						  content:handleContent,
						  bhShow:{ actionId: 102421, thingId: 3, moduleId: 19 },
						  bhClose:'上线tips关闭',
						  timeout:15000
						  });
		},
		/**
		 *上线提醒内容的组装
		 *@param {number}  length 上线人数
		 *@param {string}  imgsrc   图片地址
		 *@param {string}  name    上线人名  
		 *@param {string}  email  上线人邮件地址
		 */
		buildContent:function(imgsrc,name,email){
			 var displayHead = "block;",
			     sendMail    = "M139.UI.TipOnlineView.sendMail();";
			 if(imgsrc){
			 	 displayHead = "none;";
			 }
			 imgsrc = $PUtils.getImageSrc(imgsrc);
			 var index = $BMTips.getRightTimeIndex();
			 var linkName = index==-1?'问候一下':$BMTips.configOnline[index].linkName;
			 var linkAction="$BMTips.sayHello('online');";
			 divContent  = top.$T.Utils.format( M139.UI.TipOnlineView._template,{imgsrc:imgsrc,name:name,email:email,displayHead:displayHead,linkName:linkName,linkAction:linkAction,sendMail:sendMail});
			 return divContent;
		},
		/**
		 * 发邮件
		 */
		sendMail:function(){
			var el = $("#tip_RemindMail");
			var email = top.$User.getDefaultSender()||el.attr("email");
			var name = el.attr("name");
			var content =  top.$T.Utils.format(M139.UI.TipOnlineView._headMailHtml,{resourcePath:top.$App.getResourceHost()+"/m2012/",name:name});
			var subject = "《近况如何？赶快上传头像吧！》";
			var callback = function(res){
				var data = res.responseData;
				var msg = "您的提醒已经成功发出，耐心等待他的头像吧~~~";
				if(!data||(data&&data.code!='S_OK')){
				      msg = "发送邮件失败！";
					  top.ScriptErrorLog.sendLog(top.UserData.DefaultSender+"给好友"+el.attr('name')+"发送邮件失败");
				}
			    top.$Msg.alert(msg);
			}
			top.$PUtils.sendMail({email:email,content:content,subject:subject,callback:callback});
		},
		_headMailHtml:"<style>html,body,dl,dt,dd,img,p{margin:0;padding:0;font-size:12px;}"+
					  	"img{vertical-align:top;border:none;}</style><table border='0' cellpadding='0' cellspacing='0' style='width:726px;margin:10px auto;'>"+
					  	"<tr id=\"quickHeadImg\"><td><img src='{resourcePath}/images/prod/onlinetips/yd_01.jpg' alt='引导邮件' /></td></tr>"+
					  	"<tr><td style='background:#EAF1F7;border-left:1px solid #DEDEE0;border-right:1px solid #DEDEE0;'>"+
					  	"<div style='position:relative;width:100%'>"+
					  	"<dl style='width:488px;padding:30px 20px 10px 60px;float:left;'>"+
					  	"<dt style='margin-bottom:10px;font-size:14px;' id='tipsName'>Hi，{name}：</dt>"+
					  	"<dd style='line-height:25px;font-size:14px;'>近况如何？ 赶快上传头像吧！方法很简单~~</dd></dl>"+
					  	"<a rel='prod' param='updateHead'  id=\"guidSMail\" href='javascript:void(0)' style='position:absolute;left:0;left:565px;top:50px;'><img style=\"cursor:pointer;\" src='{resourcePath}/images/prod/onlinetips/yd_upBtn.gif' alt='引导邮件' /></a>"+  
					  	"</div></td></tr><tr><td><img src='{resourcePath}/images/prod/onlinetips/yd_02.jpg' alt='引导邮件' /></td></tr>"+
					  	"<tr><td> <div style='position:relative;'> <img   src='{resourcePath}/images/prod/onlinetips/yd_03.jpg' alt='引导邮件' />"+
					  	"<p style='color:#999;position:absolute;top:0;left:0;width:726px;text-align:center;line-height:35px;'>139邮箱mail.10086.cn&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您一直以来的支持，我们将不断创新，为您带来更好的邮箱体验!	</p>"+
					  "</div></td></tr></table>",
		_template: [ '<div class="imgInfo imgInfo-rb">',
                 '<a class="imgLink" href="javascript:void(0);" title="图片"><img width="52" height="52" src="{imgsrc}" alt=""></a>',
                 '<dl>',
                     '<dt><strong>{name}</strong> 上线了</dt>',
                     '<dd class="gray">{email}</dd>',
                     '<dd>{mobile}</dd>',
                     '<dd style="display:{displayHead};"><a email="{email}" id="tip_RemindMail" href="javascript:{sendMail};">提醒TA上传头像<span class="f_st">&gt;&gt;</span> </a></dd>',
                     '<dd><a href="javascript:{linkAction};void(0);">{linkName}！<span class="f_st">&gt;&gt;</span> </a></dd>',
                 '</dl>',
             '</div>'].join("")
	})
})(jQuery,_,M139);