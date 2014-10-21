/**   
* @fileOverview 邮件附件存彩云
* @Code by Sukunwei
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 邮件附件存彩云
*/
	M139.namespace("M2012.ReadMail.SaveToMcloud.Model",Backbone.Model.extend({
			
	    defaults: {
	        loginUser: null, //$User.getLoginName(),
		    sid: null,//$App.getSid(), //sid
		    userNumber:null, //用户手机号
			//userNumber: '18299752969', //用户手机号
			sidVal:'cloudUpload', //彩云标识
			RMKEY: '671300886', //RMKEY,暂时不依赖，随便定一个值
			downUrl:null, //下载路径
			isAll:false, //是否全部存
			fileSize:null, //文件大小
			fileName:null, //文件名带后缀
			saveStatus:true, //保存状态,
			checkTime:5000, //轮询时间间隔
			maxTime: 1000 * 30

			//maxTime:1000 * 60 * 20 //最长时间（20分钟）
		},
		
		/** 
		* 请求URL
		* saveMcloud:'http://172.16.42.15:8211/resourceupload/fileupload', //存彩云请求
			callBack:'http://172.16.42.15:8211/cloudUploadCallBack' //查询状态请求
		*
		*/
		requestUrl:{
		    url: 'http://app.mail.10086rd.cn/colorcloud',
		    saveMcloud: getDomain("colorcloud") + '/fileupload', //存彩云请求
		    callBack: getDomain("colorcloud") + '/cloudUploadCallBack',//查询状态请求
		    saveMcloud_dev: getDomain("colorcloud") +'/fileupload'

		},
		
		/** 
		* 提示语
		*/
		tips:{
			link:'<a href="http://caiyun.feixin.10086.cn/portal/index.jsp" target="_blank">查看</a>',
			saveStatus:'<img src="/m2012/images/global/loading_xs.gif" />&nbsp;正在保存中...',
			oneSaveSuccess: '{0}已成功保存到彩云网盘<span style="padding-left:20px;"><a href="http://caiyun.feixin.10086.cn/portal/index.jsp" target="_blank">查看</a></span>',
			saveFail:'保存失败，请稍后重试',
			warn:'无法同时保存多个附件到彩云，请稍后再试。'
		},
		
		/** 
		* 判断是否冲突，不允许多个同时存储
		*/
		checkSaveConflict:function(){
			if(!this.get('saveStatus')){
				$Msg.alert(this.tips.warn);
				return;
			}
		},
		
		/**
		* 附件存彩云
		* http://192.168.9.53:8181/resourceupload/fileupload?userNumber=15023451001&downUrl= http://rm.mail.10086ts.cn/RmWeb/view.do?func=attach:download&mid=010300017994e117000000a2&offset=2456&size=1574&name=focus.html&encoding=1&sid=MTM2MzY3Njk5OTAwMTA5NDA2NDIwMQAA000001&type=attach &sid= MTM2MzY3Njk5OTAwMTA5NDA2NDIwMQAA000001 &sidVal=cloudUpload&RMKEY=671300886&&fileSize=1574&fileName=focus.html
		*/
		saveToMcloudRequest:function(callback){
		    var self = this;
		    //var aa = this.get('RMKEY');
		    this.set("userNumber", $User.getShortUid());
			var options = {
			    userNumber: this.get('userNumber'),
			    loginUser: $User.getLoginName(),
				sid:$App.getSid(),
				provCode:$User.getProvCode() || null,
				areaCode:$User.getAreaCode() || null,
				sidVal:this.get('sidVal'),
				//RMKEY:this.get('RMKEY'),
				downUrl:this.get("downUrl").replace(/appmail(3?).mail.10086.cn/, "webapp-pd.api.localdomain:9001"),
				fileSize:this.get('fileSize'),
				fileName:this.get('fileName'),
				format:'json'
			};
			var getUrl = self.requestUrl.saveMcloud_dev; //测试请求地址
			getUrl = $T.Url.makeUrl(getUrl,options) + "&jsoncallback=?";
			$.getJSON(getUrl, function(data){
				callback && callback(data);
			});
		},
		
		/** 
		* 判断存彩云是否成功
		*/
		checkSaveSuccessRequest: function (callback) {
		    this.set("userNumber", $User.getShortUid());
			var self = this;
			var getUrl = self.requestUrl.callBack; 
			var options = {
			    loginUser: $User.getLoginName(),
				userNumber:this.get('userNumber'),
				sid: $App.getSid(),
				sidVal:this.get('sidVal'),
				fileName:this.get('fileName'), //文件带后缀 
				format:'json'
			};
			getUrl = $T.Url.makeUrl(getUrl,options) + "&jsoncallback=?";
			$.getJSON(getUrl,function(response) {
				callback && callback(response);
    		});
		}
		
	}));

})(jQuery, _, M139);


