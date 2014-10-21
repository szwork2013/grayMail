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