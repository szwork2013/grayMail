/**   
* @fileOverview 我的应用
*/
(function (jQuery, _, M139) {

/**
* @namespace 
* 我的应用
*/

M139.namespace("M2012.Myapp.Model",Backbone.Model.extend({
    defaults:{
        userData: null,
        offsetTop:null,//app弹出层弹出后的offset().top值，防止应用增加和减少的时候弹出层跟着动
        joinList:false, //是否合并数据
        defaultApp: [ //默认数据 发彩信、贺卡、文件快递和彩云笔记
        		{id:"",key:"1",name:"短信",state:"1"},
        		{id:"",key:"3",name:"发贺卡",state:"1"},
        		{id:"",key:"14",name:"附件夹",state:"1"},
				{id:"87",key:"2",name:"彩信",state:"1"},
				{ id: "", key: "6", name: "暂存柜", state: "1" },
				{id:"90",key:"11",name:"和笔记",state:"1"},
				{ id: "", key: "8", name: "收发传真", state: "1" },
                { id: "", key: "21", name: "群邮件", state: "1" },
				{id:"",key:"4",name:"明信片",state:"1"}
            ],
        customAppAll:{
            "1": { order:1,icon: "i_apps i_apps_mess", text: "短信　", behavior: "left_sms", link: "sms", desc: "在邮箱就能发短信，打字更快更方便。长短信支持一次显示350字。", id: "sms_link", ext: "1",alwaysShow:true},
            "2": { order:2, icon: "i_apps i_apps_cmess", text: "彩信", behavior: "left_mms", link: "mms", desc: "在邮箱就能发彩信，可添加动画及音乐，支持长达10000字。", id: "mms_link", ext: "1", alwaysShow: true,order:2 },
            "3": { order:3,icon: "i_apps i_apps_hk", text: "发贺卡", behavior: "left_grettingcard", link: "greetingcard", desc: "精美的FLASH贺卡，为您的朋友送去最真诚的祝福！",id:'greetingcard_link',order:3 },
            //"5": { icon: "i_apps i_apps_mdisk", text: "彩云", behavior: "left_disk", link: "javascript:top.Links.show('diskDev','&id=2');", desc: "存储您的音乐、照片以及各种文档，并支持分享给您的好友。", id: "disk" },
            "6": { order: 7, icon: "i_apps i_apps_file", text: "暂存柜", behavior: "left_quicklyShare", link: "javascript:$App.show(\'diskDev\', {from:\'cabinet\'})", desc: "可上传G级超大文件，快递到任意邮箱、中国移动手机。", id: "quicklyShare" },
            //"7": { icon: "i_apps i_apps_day", text: "日历", behavior: "left_calendar", link: "javascript:$App.show(\'calendar\')", desc: "按日历安排事项、约会、生日、备忘，在指定时间短信提醒自己或他人。", ext: "1",id:'calendar_link' },            
		    //"19": {icon:"icos funs9",text:"彩信仓库",behavior:"彩信仓库",link:"mmsstore",desc:"可存放彩信、图片和手机照片，支持图片编辑，在线发送彩信。",id:'mmsstore_link'},
		    //"10": { icon: "icos funsa", text: "网络书签", behavior: "网络书签", link: "weblink", desc: "备份保存您的IE收藏夹，珍藏的网络书签永不丢失。", ext: "1" },
		    //"18":{icon:"icos funsc",text:"资讯中心",behavior:"资讯中心",link:"rss",desc:"浏览新闻、娱乐、体育等资讯，多个精彩频道，让您轻松订阅。",ext:"1"},
		    //"16":{icon:"icos funsd",text:"实用工具",behavior:"实用工具",link:"uzone",desc:"火车时刻、身份证归属、手机、IP、区号轻松查询。",ext:"1"},
		    //"14":{icon:"icos funsm",text:"手机支付",behavior:"我的应用-手机支付",link:"pay139",desc:"中国移动提供的综合性移动支付服务,省时、省力更省心！",ext:"1"},
		    //"15":{icon:"icos funsk",text:"飞信位缘",behavior:"飞信位缘",link:"fetionFate",desc:"飞信上的真实地理位置交友社区服务，通过手机定位，可以迅速结识身边朋友，还能获取最酷的周边生活信息。"},
            //"9":{icon:"i_apps i_apps_tc",text:"购买体彩", target:"_blank", behavior:"left_buylottery",link:top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://3g.weicai.com/139mail/index.php?sid=") + "&comeFrom=weibo&sid=" + top.sid,desc:"广东移动体彩，300万用户的选择！支持话费买彩票，2元最高可中1000万！",id:"tc_link"},
		    //"10": { icon: "i_apps i_apps_fc", text: "手机福彩", target: "_blank", behavior: "left_fucai", link: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://10086.gd-fc.net/waiwei/139GetLogin.jsp?sid=") + "&comeFrom=weibo&sid=" + top.sid, desc: "支持双色球、36选7、好彩1、26选5、3D手机投注，安全高效、操作简便、24小时服务！", id: "fc_link" },
		    "11":{order:5,icon:"i_apps i_apps_cynote",text:"和笔记",behavior:"left_note",link:"javascript:$App.show(\'note\')",desc:"中国移动彩云平台首款云应用，记录瞬间想法，跨平台同步！",id:"note_link"},
		    //"12":{icon:"i_apps i_apps_cy",text:"和彩云", target:"_blank", behavior:"left_colorcloud",link:"https://caiyun.feixin.10086.cn",desc:"中国移动旗下的个人云服务，提供安全便捷、跨平台跨终端的文件备份存储功能。",id:"colorcloud_link"},
		    //"13":{icon:"i_apps i_apps_music",text:"咪咕音乐",behavior:"left_music",link:"javascript:$App.show(\'myrings\')",desc:"咪咕音乐为您提供美妙的音乐。",id:"music_link"},
		    //"14": { order: 6, icon: "i_apps i_apps_fjj", text: "附件夹", behavior: "left_attach", link: "javascript:$App.show(\'diskDev\', {from:\'attachment\'})", desc: "管理你邮件中的所有附件。可以按文件类型、发件人、时间范围进行分类查找。", id: "attach_link" },
		    "8": { order: 8, icon: "i_apps i_apps_cz", text: "收发传真", behavior: "left_fax", link: "javascript:top.$App.show('googSubscription');top.$App.show('mpostOnlineService', null, {title : '收发传真',key : '38487',inputData : {columnId : '38487',columnName : '收发传真'}});", desc: "不需要传真机，就能向全国任意传真机发送接收传真，节省纸张更环保。", id: 'fax_link' },
        	"4": { order: 9, icon: "i_apps i_apps_mxp", text: "明信片", behavior: "left_postcard", link: "javascript:top.$App.show('googSubscription');top.$App.show('mpostOnlineService', null, {title : '明信片',key : '38488',inputData : {columnId : '38488',columnName : '明信片'}});", desc: "免费精致的明信片，方便您给亲朋好友送去温馨祝福！", ext: "1", id: 'postcard_link' },
        	"20": { order: 10, icon: "i_apps i_apps_egg", text: "生日彩蛋", behavior: "left_colorfulEgg", link: "javascript:top.$App.show('colorfulEgg');", desc: "在您生日来临之际，有机会获得来自139邮箱或好友赠送的生日彩蛋。", ext: "1", id: 'postcard_link' },
			//"15": { icon: "i_apps i_apps_yyt", text: "邮箱营业厅", behavior: "mail_hall", link: "javascript:top.hallReload=true;$App.show(\'mailHall\');", desc: "１３９邮箱营业厅通过中国移动互联网站，向客户提供以互联网为平台的业务咨询和办理，让客户充分享受自由自在的感受。", id: "hall_link" },
			//"16":{icon:"i_apps i_apps_txl",text:"通讯录", behavior:"left_addr",link:"javascript:$App.show(\'addr\')",desc:"邮箱通讯录，随时保存朋友的个人信息，方便随时交流。",id:"addr_link"},
			//"17":{icon:"i_apps i_apps_date",text:"日历", behavior:"left_calendar",link:"javascript:$App.show(\'calendar\')",desc:"按日历安排事项、约会、生日、备忘，在指定时间短信提醒自己或者他人。",id:"calendar_link"},
			//"18":{icon:"i_apps i_apps_jpdy", text: "云邮局", behavior: "left_googSubscription", link: "javascript:$App.show(\'googSubscription\');", desc: "轻松阅读海量的免费互联网、杂志内容，让您轻松享受阅读之旅。", id:"googSubscription_link"},
            //"19":{icon:"i_apps  i_apps_hred", text: "和阅读", behavior: "left_heyuedu", link: "javascript:$App.show(\'heyuedu\');", desc: "轻松享受海量精品图书、最新书讯，让你真正享受随身阅读的乐趣", id:"heyuedu_link"}
        	"21": { order: 4, icon: "i_apps i_apps_hk", text: "群邮件", behavior: "", link: "groupMail", desc: "群邮件", id: 'groupmail_link', alwaysShow: true },
        	"22":  { order: 11, icon: "i_apps i_apps_fjj", text: "语音信箱", behavior: "", link: "voiceMail", desc: "语音信箱", id: 'groupmail_link', alwaysShow: true }
		}
	},
	
	/** 固定标签对应 */
	specialApp:{
		'16':{name:'addr'},
		'17':{name:'calendar'},
		'18':{name:'googSubscription'}
	},

	
	/**
	* 获取我的应用
	*/
	getMyapp: function () {
	    var self = this;
	    var appData = $User.getMyApp();
	    var allData = this.get("customAppAll");
	    /** 权重排序（接口不作处理，只能前端排序），依靠customAppAll中定义的order属性排序 */
	    appData.sort(function (a, b) {
	        var o1 = allData[a.key]?allData[a.key].order:999;
	        var o2 = allData[b.key] ? allData[b.key].order : 999; 

	        return o1 - o2;

	    });
	    return appData;
   
	},
	
	/**
	* 我的应用默认数据
	*/
	getDefaultMyapp:function(){
		return this.get('defaultApp');
	
	},
	
	/**
	* 设置我的应用,可以批量设置
	*/
	setMyApp:function(options,callback){
		
		//添加通讯录、日历、云邮局统计
		var addr_id = $User.getMyAppIdByKey('16'),
			calendar_id = $User.getMyAppIdByKey('17'),
			googSubscription_id = $User.getMyAppIdByKey('18');
			
		$.each(options.apps,function(i,val){
			if(val.state === '1'){
				addr_id === val.id && BH('left_add_addr');
				calendar_id === val.id && BH('left_add_calendar');
				googSubscription_id === val.id && BH('left_add_googSubscription');
			}
		});
	
	    M139.RichMail.API.call("user:setMyApp",options,function(result){            
            callback && callback(result.responseData);
        });
	},
	
	/**
	* 设置myapp缓存对象状态
	*/
	changeState:function(id,state,callback){
	    var myapp = this.getMyapp();
	    for(var i=0;i<myapp.length;i++){
	        if(myapp[i].id == id){
	            myapp[i].state = state;
	        } 
	    }
	    callback && callback();
	},
	
	
	/**
	* 加载客户应用
	* @param Bollean {first} 是否设置过
	* @param int {getState} 选择状态 0 - state:0  1 - state:1  2- all
	*/
	loadCustomApp:function(first,getState){
	    var self = this;
	    var customAppAll = self.get('customAppAll');
	    var myapp = self.getDefaultMyapp();
	    if (this.get('loadData')) { myapp = self.getMyapp() }
	    var result = [];	    	    
	    for(var i = 0; i < myapp.length; i++){
	        if(customAppAll[myapp[i].key]){
	            customAppAll[myapp[i].key].state = myapp[i].state;
	            customAppAll[myapp[i].key].key = myapp[i].id;
	            if(i<17){ //这里数量限制暂不确定，以前规定是不超过8项
					if(getState == 1){
					    if (customAppAll[myapp[i].key].state == '1'  || customAppAll[myapp[i].key].alwaysShow) {
					        result.push(customAppAll[myapp[i].key]);
					    }
	                }
					if(getState == 2){
	                    result.push(customAppAll[myapp[i].key]);
	                }
	            }
	        }
	    }	    
	    return result;
    }
    
}));

})(jQuery, _, M139);
