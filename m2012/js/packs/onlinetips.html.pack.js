/**
 * 右下角弹出框模型类，主要功能获取数据
 * @example M139.UI.TIP.RemindModel;
 */
//todo1 命名M139.UI.Tip.RemindModel 
M139.core.namespace("M139.UI.RemindTipModel", Backbone.Model.extend({
    initialize: function (options) {
    }
}));
(function(jQuery,_,M139){
    jQuery.extend(M139.UI.RemindTipModel, {
		 materialIds:[10679,10680,10678,10621,10620,10564,178,173,192,10561], //打招呼贺卡ID10561
		 users: { log: [], online: [] },
		 types:{'ad':0,'online':1,'login':2,'mail':3,'active':4,'calendar':5},
		 maxStrCount:83,//显示好友的最大中文字数，长度,多次实验统计得出
		 nameCharMaxCount:28,//单个名字的最大字符数
		 configOnline:[{linkName:"带给TA节日的问候",start:"2012-12-11",end:"2012-12-25",materialIds:[10613,10610,10609,10612,356,355,353]},
	              {linkName:"带给TA节日的问候",start:"2012-12-26",end:"2013-01-01",materialIds:[222,383,396,387,386,10616,382]},
				  {linkName:"带给TA春节的问候",start:"2013-02-03",end:"2013-02-16",materialIds:[10627,395,392,121,138]},
				  {linkName:"带给TA元宵节的问候",start:"2013-02-17",end:"2013-02-24",materialIds:[10632,10631,148,147,136]}],
		 url:'/mw/mw/s?func=user:getOnlineFriends&sid=',
		 logger: new top.M139.Logger({
			name: "online tips"
		 }),
		 /**
		  * 处理获取的在线人
		  * @param {Object} type
		  * @param {Object} callback
		  */
		 getOnlineUsers: function (type, callback) {
			var self = this;
			var lineType = type == 'online' ? 1 : 400;
			var data = {lineType:lineType}
			top.M139.RichMail.API.call('user:getOnlineFriends', data, function (response) {
				  var data = [];
		          if (response.responseData.code && response.responseData.code == "S_OK") {
		               callback(response.responseData['var']);
		          } else {
                     self.logger.error("getOnlineFriends returndata error", "[user:getOnlineFriends]", response)
		          }   
			});
		},
		/**
		 * 获取tips属性设置
		 */
		getNewMailTipsSetting:function(){
			var userData = top.$App.getConfig("UserData")||{};
			if(userData.mainUserConfig&&userData.mainUserConfig.newmailtips&&userData.mainUserConfig.newmailtips.length>1){
				return userData.mainUserConfig.newmailtips[1];
			}else{
				return "1111";//全部不弹出
			}
		},
		/**
		 * 获取适当长度值
		 * @param {Object} len
		 */
		getLength:function(len){
		 	return [60,20,18,10,8,8][len]
		},
		/**
		 * 组名加括号
		 * @param {Object} groupName
		 */
		getGroupName:function(groupName){
			return groupName?('('+groupName+')'):'';
		},
		/**
		 * 更新用户用组信息 长度截取
		 * @param {Object} users
		 */
		updateUserGName:function(users){
			users = users||[];
		  	var fullUser = [];
		  	var _this = this;
		  	var chLenth = this.getLength(users.length-1);//朋友名长度
		  	var groupName = null,cardName='',cardFullName='';
		 	$.map(users,function(obj){
					    groupName = _this.getGroupName(obj.groupName);
						obj.cardFullName = obj.friendName+groupName;
						fullUser.push(obj.cardFullName);
						if(top.$T.Utils.getBytes(obj.friendName)>_this.nameCharMaxCount){//贺卡中的长度
						   cardName = top.$PUtils.getLeftStr(obj.friendName,_this.nameCharMaxCount,true);
						}else{
						   cardName = obj.friendName;
						}
						if(top.$T.Utils.getBytes(obj.friendName)>chLenth){
						  obj.friendName = top.$PUtils.getLeftStr(obj.friendName,chLenth,true);
						}
						obj.cardName = cardName+groupName;
						obj.friendName+=groupName;
					   });
		    return fullUser;
		},
		/**
		 * 查看是否超过指定长度
		 * @param {Object} str
		 * @param {Object} len
		 */
		isStrOverLen:function(str,len){
			str = str.replace(/(<font color='#0344AE'>)+/g,"");
			str = str.replace(/(<\/font>)+/g,"");
			return top.$T.Utils.getBytes(str)>len;
		},
	    /**
	     * 构建主题
	     * @param {Object} users
	     * @param {Object} fullUser
	     * @param {Object} type
	     */
		buildSummary:function(users,fullUser,type){
		    var head = '你的好友', content = [], len = users.length,summary;
		    var typeName = type === 'login' ? '在线' : '上线';
		    //随机显示6个人名
		    var showUser = [];
		    if (fullUser.length > 6) {
		        for (var i = 0; i < 6; i++) {
		            var randomUser = parseInt(Math.random() * 1000) % fullUser.length;
		            showUser.push(fullUser.splice(randomUser, 1)[0]);
		        }
		    } else {
		        showUser = fullUser;
		    }
		    var tail = "<font color='red' title='" + showUser.join(",") + "'>" + len + "</font>" + "人" + typeName;
		    for (var i = 0; i < showUser.length; i++) {
			    content.splice(0, 0, "<font color='#0344AE'>" + showUser[i] + '</font>');
			    if(this.isStrOverLen(content.join(''),this.maxStrCount)){
				   content.splice(0,1);
				   if(len===1){
				   		content.splice(0,0,"<font color='#0344AE'>"+top.$PUtils.getLeftStr(users[i].friendName,this.nameCharMaxCount,true)+'</font>');
				   }
				}
			}
			if(len>1){
			  if(content.length<len){
				tail = '等'+tail;
			  }
			}else{
				tail = typeName;
			}
			summary = head+content.join('，')+tail;
			return summary;
		},
		/**
		 * 用户是否打开或关闭配置 
		 * @param {Object} num 第几位
		 */									
		isUserOpen:function(num){
		   var tipsConfig = this.getNewMailTipsSetting();
		   if(tipsConfig&&tipsConfig.length>3){
		     return 1==tipsConfig.charAt(num);
		   }else{
		     return false;
		   }
	 	},
		/**
		 * 暂无用
		 */
	 	compatible:function(){
	 		//新版本获取数据 top.$App.getConfig("UserData").mainUserConfig.newmailtips;
	 		//新版本更新数据  top.$App.setMailTips("1000");
	    },
		/**
		 * 获取当前时间在哪个时间点内
		 */
	 	getRightTimeIndex:function(){
		    var today = top.$Date.getServerTime()||new Date();
			var len = this.configOnline.length,item,starttime,endtime;
			var index = -1;
		    for(var i=0;i<len;i++){
		        item = this.configOnline[i];
                //todo data-->date
			   starttime = $PUtils.dateFormat(item['start']);
			   endtime  =  $PUtils.dateFormat(item['end']);
			   if(today instanceof Date&&starttime instanceof Date && endtime instanceof Date &&today >=starttime&&today<=endtime){
			      index = i;
				  break;
			   }
			}
			return index;
  		},
		/**
		 * 更新tips
		 * @param {Object} title
		 * @param {Object} content
		 */
		updateTip:function(title,content){
			$BTips.updateContent(title,content);
	    },
		/**
		 * 读信
		 */
	    readMail:function(){ 
	        var mail = $BMTips.newMail[$BMTips.currentMail];
            //更新文件夹未读邮件数
	        if (mail && mail.flags && mail.flags.read == 1) {
	            var isStar = (mail.flags && mail.flags.starFlag) ? true : false;
	            $App.trigger("reduceFolderMail", { fid: mail.fid, isStar: isStar });//文件夹未读邮件减少
	        }
	       $App.readMail(mail.mid, false,mail.fid,{mailData:mail});
	    },
		/**
		 *打招呼
		 *@param {string}  type   邮件或上线人
		 */
		sayHello:function(type){
			top.$App.jumpTo('greetingcard',"&sayHello="+type+"&materialId="+this.getMaterialId());
		},
		/**
		 * 记住用户操作
		 * @param {Object} type
		 */
		remember:function(type){
			var tipsConfig = this.getNewMailTipsSetting();
			if(type==='active'){
				tipsConfig = this.setCharVal(tipsConfig,this.types[type]+1,1);
				top.$App.setMailTips(tipsConfig);
			}
		},
		/**
		 * 设置某位数值
		 * @param {Object} str
		 * @param {Object} num
		 * @param {Object} val
		 */
		setCharVal:function(str,num,val){
			str = str||'';
			var len = str.length,sub = num-len;
			var strs = str.split('');
			if(sub>1){
				for(var i=0;i<sub;i++){
				  strs[len+i] = 0;
			 	}
			}
			strs[num-1]=val;
			return strs.join('');
		},
		/**
		 * 随机取贺卡id
		 */
		getMaterialId:function(){
		   var index = this.getRightTimeIndex();
		   var materialIds = this.materialIds;
		   if(index!=-1){
		      materialIds = this.configOnline[index].materialIds;
		   }
		   var length = materialIds.length;
		   return materialIds[parseInt(Math.random()*length)];
		}
	})
	window.$BMTips = M139.UI.RemindTipModel;
}
)(jQuery,_,M139);
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
/**
 * 右下角弹出mailview
 * @example
 * M139.UI.TipMailView.show();
 */
M139.core.namespace("M139.UI.TipMailView", Backbone.View.extend({
    initialize: function (options) {}
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.TipMailView,{
	title:'您有 {count} 封新邮件',
	/**
	 *开启邮箱提醒
	 */
	show:function(){
		top.$App.on("newMailArrival",this.receiveMail);
	},
	/**
	 *获取到的新邮件
	 * @param {array} data 所有邮件
	 * @param {map}  receiveDate 最后收到的邮件
	 * @param {string} type 邮件类型
	 */
	receiveMail:function(mails){
		 if(!$BMTips.isUserOpen($BMTips.types['mail'])){return;}
		 var j=1,len = mails.length;
		 $BMTips.currentMail = 0;
		 $BMTips.newMailCount = len;
		 if(len<=0) return ;
		 $BMTips.newMail  = mails;
	     var curMail = $BMTips.newMail[0];
	     var hTitle = "您有" + mails.length+"封新邮件";
		 var content = M139.UI.TipMailView.buildMailHtml($BMTips.newMail[$BMTips.currentMail],$BMTips.currentMail+1,$BMTips.newMailCount);
        if($BTips.isCalendarTip){   //因为日历消息同时也会下发邮件，这样日历的tips会闪一下就被邮件的tips会冲掉了
            setTimeout(function(){
		        $BTips.instance.close();
                delete $BTips.isCalendarTip;
            }, 10000);
        }else{
            $BTips.instance.close();
        }
		 //加入到队列中
		 $BTips.addTask({
						 	title:hTitle,
							content:content,
							bhShow:{ actionId: 102421, thingId: 2, moduleId: 19 },
							bhClose:'邮件tips关闭',
							timeout:20000
						});
		//滚动标题
		mails.length > 0 && M139.UI.TipMailView.showRollTitle(hTitle); 
	},
	/**
	 *得到下一封邮件
	 *@param {int}  position 邮件所在位置
	 */
	nextMail:function(position){
		 if("R"==position){
		   if($BMTips.currentMail+1<$BMTips.newMailCount){
		     $BMTips.currentMail++;
		   }else{
		     return ;
		   }
		 }else if('L'==position){ 
		   if($BMTips.currentMail>0){
		    $BMTips.currentMail--;
		   }else{
		     return ;
		   }
		 }
		 var hTitle = "您有" + $BMTips.newMailCount+"封新邮件";
		 var content = this.buildMailHtml($BMTips.newMail[$BMTips.currentMail],$BMTips.currentMail+1,$BMTips.newMailCount);
		 $BMTips.updateTip(hTitle,content);
	},
	/**
	 * 构建邮件主题
	 * @param {Object} curMail
	 * @param {Object} index
	 * @param {Object} total
	 */
	buildMailHtml:function(curMail,index,total){
	    var click = "top.$BMTips.readMail();top.$BTips.hide();";
	    // update by tkh 发件人过长需截取
	    var fromMan = top.$T.Html.encode(curMail.from.replace(/"/g,""));
	    fromMan = top.$T.Utils.getTextOverFlow2(fromMan, 33, true);
		var param = {
				email:fromMan,
				hander:click,
				subject:top.$T.Html.encode(curMail.subject),
				cur:index,total:total,
				fromMan:curMail.from.replace(/"/g,""),
				display:$BMTips.newMailCount>1?'':'none'
		};
	  return  top.$T.Utils.format(M139.UI.TipMailView._template,param);
	},
		
	rollTitleConfig:{
		"orgTitle": document.title, //原标题
        "rollSpeed":420,//滚动间隔
        "timeHandler": null, //计时器
        "run": 1 //是否运行提示
	},
	
	/**
	 * 新到达邮件浏览器滚动标题
	 * $param {string} tit 邮件标题
	*/
	showRollTitle:function(tit){
		var config = this.rollTitleConfig;
			speed = config.rollSpeed,
			strIndex = 0,
			rollTitle = tit + '　' + tit;
		
		//开始滚动		
		config.run = 1; 
		clearInterval(config.timeHandler)
		
		config.timeHandler = setInterval(function(){
			if( config.run !== 1 ){ clearInterval(config.timeHandler) }
			if( strIndex === rollTitle.length ){
				strIndex = 0;
			}else{
				strIndex++;
			}			
			document.title = rollTitle.substring(strIndex,rollTitle.length) + '　' + rollTitle.substring(0,strIndex);
		},speed);
		
		//全局点击时还原标题,搜：M139.UI.TipMailView.reSetDocTitle()
		
	},
	
	//还原浏览器标题
	reSetDocTitle:function(){
		var config =  this.rollTitleConfig;
		config.run = 0;
		setTimeout(function(){
			document.title = config.orgTitle;
		},1000);
	},
	
	_template:[ '<div class="imgInfo imgInfo-rb">',
                 '<a class="imgLink" href="javascript:void(0);" title="图片"><i class="i_mail_b"></i></a>',
                 '<dl>',
                     '<dt><strong id="fromMan">{email}</strong></dt>',
                     '<dd class="maila"><a bh="邮件tips查邮件" href="javascript:{hander};void(0);">{subject}</a></dd>',
                 '</dl>',
                 '<p style="display:{display};" class="imgInfo-rb-page"><a  bh="邮件tips左右导航" href="javascript:top.M139.UI.TipMailView.nextMail(\'L\');void(0);" class="pre"></a><span >{cur}/{total}</span><a bh="邮件tips左右导航" href="javascript:top.M139.UI.TipMailView.nextMail(\'R\');void(0);" class="next"></a></p>',
             '</div>'].join("")
	})
})(jQuery,_,M139);
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
/**
 * 邮箱助手提醒类
 * @example
 * M139.UI.TipActiveView.show();
 */
M139.core.namespace("M139.UI.TipActiveView", Backbone.View.extend({
    initialize: function (options) {
    }
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.TipActiveView,{
		locationHrefId  :34,	//从工具登录过来
		href:'https://chrome.google.com/webstore/search-extensions/139%E9%82%AE%E7%AE%B1%E5%8A%A9%E6%89%8B?hl=zh-CN',
		title:"尊敬的139邮箱用户",
		imgSrc:'mail-rb_chrome.jpg',
		show:function(){
	        if($BMTips.isUserOpen($BMTips.types['active'])){return;}
	  		 //判断是否为chrome内核,判断是否从首页跳过来
			var isChrome = top.$B.is.chrome;
	    	var isFromHasTool = $T.Url.queryString("id") == M139.UI.TipActiveView.locationHrefId;
	    	
			if (isChrome && !isFromHasTool) {//webkit浏览器并且非助手过来
			    var param = { href:M139.UI.TipActiveView.href,
							  remember:"top.$BMTips.remember('active');",
							  src:top.$App.getResourceHost()+"/m2012/images/global/"+M139.UI.TipActiveView.imgSrc
							};
				var content = top.$T.Utils.format(M139.UI.TipActiveView._template,param);
				$BTips.addTask({width:338,
								title:M139.UI.TipActiveView.title,
								content:content,
								bhShow:{actionId:104183,thingId:1,moduleId:19},
								bhClose:'助手tip关闭',
								timeout:15000
							   });
		 	}
		},
		_template:[ '<div class="imgInfo imgInfo-rb chrom-tips-rb">',
	                '<a target="_blank" bh="助手tip跳转" href="{href}"><img src="{src}"></a>',
	                 '<p class="topline">',
	                     '<a target="_blank" bh="助手tip跳转" href="{href}">139邮箱助手</a>全新上线，用插件武装你的浏览器！',
	                 '</p>',
	                 '<p class="mt_10 mb_5 clearfix">',
	                    '<a href="{href}" bh="助手tip跳转" target="_blank" class="fr">马上去试试<span class="f_st">&gt;&gt;</span></a> <a bh="助手tip不再提醒" href="javascript:{remember};void(0);" class="c_999 no_tips">不再提醒</a>',
	                 '</p>',
	             '</div>'].join("")
	})
})(jQuery,_,M139);
