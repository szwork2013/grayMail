/**
 * 登录提醒类
 * @example
 * M139.UI.TipLoginView.show();
 */
M139.core.namespace("M139.UI.TipLoginView", Backbone.View.extend({
    initialize: function (options) {
    }
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.TipLoginView,{
		adId:1303,//1303,//广告id1303 1304测试环境
		items:{name :{content:'设置发件人姓名，让邮件接收人更快认出你',linkName:'马上设置',loginBehavior:'登录tips发件人',linkAction:"M139.UI.TipLoginView.updateUserInfo('name');"},
		       birth:{content:'快去填写您的生日，生日时会收到满满的祝福哦',linkName:'立即填写',loginBehavior:'登录tips生日提醒',linkAction:"M139.UI.TipLoginView.updateUserInfo('birth');"},
			   mail :{content:'新邮件到达，免费短信马上提醒',linkName:'立即设置',loginBehavior:'登录tips邮件',linkAction:"M139.UI.TipLoginView.updateUserInfo('mail');"},
		       addr :{content:'联系人太少？快来试试批量导入功能吧！',linkName:'立即导入',loginBehavior:'登录tips导入通讯录',linkAction:"M139.UI.TipLoginView.updateUserInfo('importContact');"}
			  },
		title:"尊敬的139邮箱用户",
	    /**
	     *成功登录显示的内容，需要完成贺卡中的彩信
	     */
		show: function () {
            //别名设置引导 add by QZJ
		    var now = this.isShowTureName();
		    if (now) {
		        var divContent = [
                    '<div class="boxIframeText boxIframeText_new">',
                         '<div class="norTips"><span class="norTipsIco"><i class="i_139Prompt"></i></span>',
                             '<dl class="norTipsContent">',
                                 '<dt class="norTipsLine">想获得个性化的邮箱地址？想不透露个人手机号？快来设置别名账号，让您的邮箱更独特！</dt>',
                             '</dl>',
                         '</div>',
                     '</div>',
                     '<div class="boxIframeBtn"><span class="bibText"></span><span class="bibBtn"> ',
 		                '<a class="btnSure" href="javascript:top.$Evocation.create(\'type=6\');top.addBehaviorExt({ actionId: 105303, thingId: 0 });"><span>立即设置</span></a>',
                     '</span></div>'].join("");
		        top.$App.setUserCustomInfoNew({ "setedName": now }, function () {
		            $BTips.addTask({
		                title: '139邮箱温馨提示',
		                content: divContent,
		                bhShow: { actionId: 8000, thingId: 3776 },
		                bhClose: '登录tips关闭'
		            });
		        })

		        return;
		    }



		  if (!$BMTips.isUserOpen($BMTips.types['login'])) { return; };
		  var self = this;
	      $BMTips.getOnlineUsers('login',function(data){
	      	  $BMTips.users.login = data;
	   	      top.$PUtils.getUserinfo(function (result) {
	   	      	    result.isShowUser = data.length>0?true:false;
					var showType = self.getShowType(result);
					self.showOnlineTips(showType,result);
	   	      });
	      });
		},
	    /**
        是否显示别名引导
        */
		isShowTureName: function () {
		    var aliasName = top.$User.getAliasName();
		    var data = top.$App.getConfig('UserData');
		    var firstLogin = data && data["mainUserConfig"]["shownewuserguide"] && data["mainUserConfig"]["shownewuserguide"][0];

		    var lastShowTime = top.$App.getUserCustomInfo('setedName');
		    var now = top.M139.Date.getServerTime();
		    now.setDate(now.getDate() - 3);
		    now = $Date.format('yyyyMMdd', now);
		    if ((!lastShowTime || lastShowTime < now) && firstLogin != '1' && aliasName == "") {
		        return $Date.format('yyyyMMdd', top.M139.Date.getServerTime());
		    } else {
		        return false;
		    }
		},
		/**
		 * 得到要显示的类型
		 * @param {Object} userInfo
		 */
		getShowType:function(userInfo){
	        //todo1 通讯录数据取法，通过函数封装
		    var contactData = top.$App.getConfig("ContactData");
		    var showType = "";
		    if (contactData && contactData.contacts && contactData.contacts.length == 0) {   //input/importHome.ht
		        type = 'addr';
			}else if(userInfo.isShowUser){
				type='loginUser';
			}else if(!userInfo.AddrFirstName){//没有设置名称
				type = 'name';
			}else if(!userInfo.BirDay){
				type = 'birth';
			}else if(!$BMTips.isUserOpen($BMTips.types['mail'])){
				type = 'mail';
			}else{
				type = 'ad';
			}
			return type;
		},
		/**
		 * 显示tips
		 * @param {Object} showType
		 * @param {Object} userInfo
		 */
		showOnlineTips:function(showType,userInfo){
			var param = this.buildShowParams(showType,userInfo);
			var divContent;
			if (showType === 'ad') {
				top.M139.Timing.waitForReady('top.$App.getConfig("AdLink")', function(){
					var response = top.$App.getConfig("AdLink");
					if (response && response[M139.UI.TipLoginView.adId] && response[M139.UI.TipLoginView.adId][0] && response[M139.UI.TipLoginView.adId][0].text) {
						param.content = response[M139.UI.TipLoginView.adId][0].text;
						param.display='none';
						divContent = top.$T.Utils.format(M139.UI.TipLoginView._template, param);
						$BTips.addTask({
							title: M139.UI.TipLoginView.title,
							content: divContent,
							bhShow: {
								actionId: 102421,
								thingId: 1,
								moduleId: 19
							},
							bhClose: '登录tips关闭'
						});
					}
				});
				return;
			}
		    divContent = top.$T.Utils.format(M139.UI.TipLoginView._template,param);
			$BTips.addTask({title:M139.UI.TipLoginView.title,
							content:divContent,
							bhShow:{actionId: 102421, thingId: 1, moduleId: 19},
							bhClose:'登录tips关闭'
							});
		},
		/**
		 * 获取组装tips的参数
		 * @param {Object} showType
		 * @param {Object} userInfo
		 */
		buildShowParams:function(showType,userInfo){
			var deautSender = top.$User.getDefaultSender()|| $PUtils.mobileMail;
			var param = {sender:deautSender,mobile:top.$User.getShortUid()};
			param.imgSrc = userInfo.headImg;
	       	param.name =  top.$T.Html.encode(userInfo.userName);
			param.hrefHead = "top.$App.show('account','&info=userInfo');";
	       	_.extend(param,M139.UI.TipLoginView.items[showType]);
	       	var index=-1,fullUser=null;
	       	if(type==='loginUser'){
	       		fullUser  = $BMTips.updateUserGName($BMTips.users.login);
	       		param.content = $BMTips.buildSummary($BMTips.users.login,fullUser,'login'); //修改这里的长度
			    index     = $BMTips.getRightTimeIndex();
			    param.linkName = index==-1?'问候一下':$BMTips.configOnline[index].linkName;
			    param.linkAction = "$BMTips.sayHello('login');";
	       	}
		    return param;
		},
		/**
		 * 跳转更新用户设置信息
		 * @param {Object} type
		 */
		updateUserInfo:function(type){
			if(type==='name'){
			    top.$App.show('account','&info=accountSet');
			}else if(type==='birth'){
			 	top.$App.show('account','&info=userInfo');
			}else if(type==='mail'){
			 	top.$App.show('preference','&info=onlinetips');
			}else if(type==='head'){
				top.$App.show('account','&info=userInfo');
			}else if(type==='importContact'){
				top.appView.show("addrinputhome");
			}
		},
		_template:[ '<div class=\'imgInfo imgInfo-rb\'>',
				         '<a class=\'imgLink\' href=\"javascript:{hrefHead}void(0);\" title=\'图片\'><img width=\'52\' height=\'52\' src=\'{imgSrc}\' alt=\'\'></a>',
				 		 '<dl> <dt><strong>{name}</strong></dt><dd class=\'gray\'>{sender}</dd><dd>{mobile}</dd></dl>',
				         '<p class=\'topline\'>{content}</p>',
				         '<p class=\'ta_r\' style=\'display:{display}\'><a href=\"javascript:{linkAction}void(0);\">{linkName}<span class=\'f_st\'>&gt;&gt;</span> </a></p>',
			 		'</div>'].join("")
		})
})(jQuery,_,M139);