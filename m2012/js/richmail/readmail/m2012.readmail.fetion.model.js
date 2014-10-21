//create by zhangsixue 飞信转发模型层
(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.ReadMail.Fetion.Model", Backbone.Model.extend({
			selectedList : [],
			emailDetails:{},
			initialize : function () {
				this.dataSource = []; // 接口返回的原始数据
			},
			tipWords:{
				NO_TFETION_USER: '您不是飞信用户，无法使用此功能',
				BIND_FAIL : '由于网络超时，请刷新后重试',
				AT_LEAST_ONE_USER : '请至少选中一个飞信用户',
				SENDING : '正在发送中',
				SEND_SUCCESS: '发送成功',
				SEND_FAIL : '由于网络等原因发送失败，请重试。',
			//	MAX_2000_CHARSET : '飞信接收上限为2000字(包含发件人、主题和时间长度)',
				MAX_20_CONTACTS : '您最多可选择20位好友'
			},
			getFetionFriends : function (callback) {
				var self = this;
				top.$RM.call("together:getFetionFriends", {}, function (result) {
					var rD = result.responseData;
					if(rD){
						switch(rD.code){
							case 'S_OK' :
								self.dataSource = result.responseData['var']['fetionFriendsList'];
								callback && callback();
								break;
							case 'USER_NOT_EXIST' :
								self.flagCode = 1; //不属于飞信用户
								callback && callback();
								break;
							case 'USER_NOT_MOBILE' :
								self.flagCode = 2; //不属于移动用户
								callback && callback();
								break;
							case 'S_FAIL' :
								self.flagCode = 2;
								console.log("绑定失败");
								callback && callback();
								break;
							default :
								self.flagCode = 2;
								callback && callback();
								break;
						}
					}
					/*
					if(rD && rD.code == 'S_OK'){
						self.dataSource = result.responseData['var']['fetionFriendsList'];
					}else if(rD && rD.code == 'USER_NOT_EXIST'){
						self.flagCode = 1; //不属于飞信用户
					}else if(rD && rD.code == 'USER_NOT_MOBILE'){
						self.flagCode = 2; //不属于移动用户
					}
					if(rD && rD.code == 'S_FAIL'){
						console.log("绑定失败");
					}
					callback && callback();*/
					
				});
			},
			sendMailToFetio : function(callback){
				var self = this;
				var fetionIds = [];
				for(var i =0, l = self.selectedList.length; i < l ;i++ ){
					fetionIds.push(self.selectedList[i]["friendFetionNo"]);
				}
				var message = "发件人：" + self.emailDetails.sendAccount + "主 题：" + self.emailDetails.sendTitle + "时 间：" + self.emailDetails.sendTime + "正 文：" + self.emailDetails.sendContent;
				var data ={
					linkMans : fetionIds.join(","),
					message : message
				};
				top.$RM.call("together:sendMailToFetion", data, function(result){
				//	if(result.responseData && result.responseData.code == 'S_OK'){
						callback && callback(result);
				//	}else{
				//		console.log("发送失败！");
				//	}
					
				})
			},
			getContactsById : function (friendFetionNo) {
				var ds = this.dataSource;
				for (var i = 0; i < ds.length; i++) {
					var tmp = ds[i]["groupMembers"];
					for (var j = 0; j < tmp.length; j++) {
						if (friendFetionNo == tmp[j]["friendFetionNo"]) {
							return tmp[j];
							break;
						}
					}
				}
				return null;
			},
			isSelectedItem : function (item) {
				return $.inArray(item, this.selectedList) > -1;
			},
			isGreatThan20: function(){
				return this.selectedList.length >= 20
			},
			addSelectedItem : function (item) {
				if (this.isSelectedItem(item)) {
					return;
				} 
				this.selectedList.push(item);
			},
			removeSelectedItem : function (item) {
				if (this.isSelectedItem(item)) {
					var selectedList = this.selectedList;
					for (var j = 0; j < selectedList.length; j++) {
						if (item == selectedList[j]) {
							selectedList.splice(j, 1);
						}
					}
				}
			},
			setTheNumChoosed: function(){
				var num = this.selectedList.length;
				$("#numChoosed").html(num);
			},
			//之前的用正则取数据，放弃不用
			getCurrentMailContent: function(){
				//把个人信息带入发信的地方
				var currMid = $App.getCurrMailMid();
				var thisMailData =  M139.PageApplication.getTopApp().print[currMid];
				if(thisMailData){
					var sTitle = thisMailData["subject"];
				//	var sContent = thisMailData["html"]["content"].replace(/<script>.*?<\/script>/mig,"");
				//	var sContent = thisMailData["html"]["content"].replace(/<script>/ig,"&lt;script&gt;").replace(/<\/script>/ig,"&lt;/script&gt;");
				//	var sContent = thisMailData["html"]["content"].replace(/<script>/ig,"").replace(/<\/script>/ig,"").replace(/if\(callback\)parent\[callback\]\(window,"domready"\);/,"");
					var htmlContent = thisMailData["html"]["content"];
					var sContent = htmlContent.replace(/<script[^>]*?>[\s\S]*?<\/script>/mig,"");
					sContent = sContent.replace(/<table .*>.*?<\/table>/mig,"");//去表格
					sContent = sContent.replace(/<img .*>/,"");//去图片
					sContent = sContent.replace(/<style[^>]*?>[\s\S]*?<\/style>/mig,"");
					var filterText = $("<div>" + sContent + "</div>").text();
					var sTime = $Date.format("yyyy-MM-dd hh:mm:ss", new Date(thisMailData["sendDate"] * 1000));
					var data = {
						sendPersons: self.selectedList || [],
						sendTitle : sTitle || "",
						sendTime : sTime || "",
						sendContent: filterText || ""
					};
					return data;
				}
			},
			//纯文本读信
			getCurrentMailContent2 : function(callback){
				var currMid = $App.getCurrMailMid();
				var data = {
					fid : 0,
					mid : currMid,
					autoName : 1,
					markRead : 1,
					returnHeaders :{
						Sender :"",
						"X-RICHINFO" :""
					},
					filterStylesheets: 0,
					filterImages :0,
					filterLinks :0,
					keepWellFormed :0,
					header: 1,
					supportTNEF :1,
					returnAntispamInfo :1,
					mode: "text"

				};
				top.$RM.readMail(data,function(e){
					console.log(e);
					if(e && e.code == "S_OK"){
						callback && callback(e["var"]);
					}else{
						console.log("read mail fail！");
					}
					
				})
			}
		}));

})(jQuery, Backbone, _, M139);
