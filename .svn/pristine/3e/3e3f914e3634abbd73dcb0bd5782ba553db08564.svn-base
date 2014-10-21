/**
 * @fileOverview 写信页信纸模型
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model.LetterPaper",Backbone.Model.extend({
    	letterPaperBaseUrl : '',
    	tipWords : {
        	vipNoPermissionNotice:"VIP{0}{2}为{0}元版{1}邮箱特供{2}。立即升级，重新登录后即可使用。",
        	internetUserNotice:"尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。"
        },
		papers : [{
				groupId:"007",
		        group:"商务模版 <span style='color:red;'>new</span>",
		        items:[
		        	{thumbnail:"version2.0/scene/meeting.png",page:"version2.0/scene/meeting.html?v=2"},  
		            {thumbnail:"version2.0/scene/entry.png",page:"version2.0/scene/offer.html?v=2"},
		            {thumbnail:"version2.0/scene/resume.png",page:"version2.0/scene/resume.html?v=2"},
		            {thumbnail:"version2.0/scene/resign.png",page:"version2.0/scene/resign.html?v=2"},
		            {thumbnail:"version2.0/scene/vacate.png",page:"version2.0/scene/vacate.html?v=2"},
		            {thumbnail:"version2.0/scene/fees.png",page:"version2.0/scene/fees.html?v=2"}
		        ]
		    },
			{
				groupId:"001",
		        group:"飞信",
		        items:[
		            {thumbnail:"version2.0/fetion_fetionman/thumb.png",page:"version2.0/fetion_fetionman/index.html?v=2"},
		            {thumbnail:"version2.0/fetion_boxman/thumb.png",page:"version2.0/fetion_boxman/index.html?v=2"},
		            {thumbnail:"version2.0/fetion_superman/thumb.png",page:"version2.0/fetion_superman/index.html?v=2"}
		        ]
		    },
            {
				groupId:"002",
		        group:"简洁清新",
		        items:[
		            {thumbnail:"version2.0/shangwu1/thumb.jpg",page:"version2.0/shangwu1/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu2/thumb.jpg",page:"version2.0/shangwu2/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu3/thumb.jpg",page:"version2.0/shangwu3/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu4/thumb.jpg",page:"version2.0/shangwu4/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu5/thumb.jpg",page:"version2.0/shangwu5/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu6/thumb.jpg",page:"version2.0/shangwu6/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu7/thumb.jpg",page:"version2.0/shangwu7/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu8/thumb.jpg",page:"version2.0/shangwu8/index.html?v=2"},
		            {thumbnail:"version2.0/shangwu9/thumb.jpg",page:"version2.0/shangwu9/index.html?v=2"},
		            //有bug屏蔽{thumbnail:"version2.0/shangwu10/thumb.jpg",page:"version2.0/shangwu10/index.html?v=2"},
		            //有bug屏蔽{thumbnail:"version2.0/shangwu11/thumb.jpg",page:"version2.0/shangwu11/index.html?v=2"},
		            {thumbnail:"suo/bus_01.jpg",page:"bus_01.html"},
		            {thumbnail:"suo/bus_02.jpg",page:"bus_02.html"},
		            {thumbnail:"suo/business_xinzhi07.jpg",page:"business_xinzhi07.html"},
		            {thumbnail:"suo/business_xinzhi11.jpg",page:"business_xinzhi11.html"},
		            {thumbnail:"suo/business_xinzhi12.jpg",page:"business_xinzhi12.html"},
		            {thumbnail:"suo/business_xinzhi24.jpg",page:"business_xinzhi24.html"},
		            {thumbnail:"suo/business_xinzhi33.jpg",page:"business_xinzhi33.html"},
		            {thumbnail:"suo/business_xinzhi41.jpg",page:"business_xinzhi41.html"},
		            {thumbnail:"suo/business_xinzhi42.jpg",page:"business_xinzhi42.html"},
		            {thumbnail:"suo/business_xinzhi43.jpg",page:"business_xinzhi43.html"},
		            {thumbnail:"suo/business_xinzhi45.jpg",page:"business_xinzhi45.html"},
		            {thumbnail:"suo/business_xinzhi47.jpg",page:"business_xinzhi47.html"},
		            {thumbnail:"suo/business_xinzhi48.jpg",page:"business_xinzhi48.html"},
		            {thumbnail:"suo/business_xinzhi51.jpg",page:"business_xinzhi51.html"},
		            {thumbnail:"suo/business_xinzhi52.jpg",page:"business_xinzhi52.html"},
		            {thumbnail:"suo/business_xinzhi57.jpg",page:"business_xinzhi57.html"},
		            {thumbnail:"suo/business_xinzhi60.jpg",page:"business_xinzhi60.html"}
		        ]
		    },
            {
                groupId: "009",
                group: "移动微博",
                items: [
		            { thumbnail: "version2.0/yidongweibo/thumb.png", page: "version2.0/yidongweibo/index.html?v=2" }
                ]
            },
			{
				groupId:"003",
		        group:"甜蜜爱情",
		        items:[
		            {thumbnail:"version2.0/aiqing1/thumb.jpg",page:"version2.0/aiqing1/index.html?v=2"},
		            {thumbnail:"version2.0/aiqing2/thumb.jpg",page:"version2.0/aiqing2/index.html?v=2"},
		            {thumbnail:"suo/love_01.jpg",page:"love_01.html"},
		            {thumbnail:"suo/love_02.jpg",page:"love_02.html"},
		            {thumbnail:"suo/love_03.jpg",page:"love_03.html"},
		            {thumbnail:"suo/love_xinzhi20.jpg",page:"love_xinzhi20.html"},
		            {thumbnail:"suo/love_xinzhi06.jpg",page:"love_xinzhi06.html"},
		            {thumbnail:"suo/love_xinzhi09.jpg",page:"love_xinzhi09.html"},
		            {thumbnail:"suo/love_xinzhi14.jpg",page:"love_xinzhi14.html"},
		            {thumbnail:"suo/love_xinzhi21.jpg",page:"love_xinzhi21.html"},
		            {thumbnail:"suo/love_xinzhi35.jpg",page:"love_xinzhi35.html"},
		            {thumbnail:"suo/love_xinzhi49.jpg",page:"love_xinzhi49.html"}
		        ]
		    },
		    {
				groupId:"004",
		        group:"节日祝福",
		        items:[
		            {thumbnail:"version2.0/qixijie/thumb.jpg",page:"version2.0/qixijie/index.html?v=2"},
		            {thumbnail:"version2.0/fuqinjie/thumb.jpg",page:"version2.0/fuqinjie/index.html?v=2"},
		            {thumbnail:"version2.0/jiaoshijie/thumb.jpg",page:"version2.0/jiaoshijie/index.html?v=2"},
		            {thumbnail:"version2.0/duanwujie/thumb.jpg",page:"version2.0/duanwujie/index.html?v=2"},
		            {thumbnail:"version2.0/duanwujie2/thumb.jpg",page:"version2.0/duanwujie2/index.html?v=2"},
		            {thumbnail:"version2.0/ganenjie/thumb.jpg",page:"version2.0/ganenjie/index.html?v=2"},
		            {thumbnail:"version2.0/guoqingjie/thumb.jpg",page:"version2.0/guoqingjie/index.html?v=2"},
		            {thumbnail:"version2.0/ertongjie/thumb.jpg",page:"version2.0/ertongjie/index.html?v=2"},
		            {thumbnail:"version2.0/chunjie/thumb.jpg",page:"version2.0/chunjie/index.html?v=2"},
		            {thumbnail:"suo/jieri_01.jpg",page:"jieri_01.html"},
		            {thumbnail:"suo/jieri_02.jpg",page:"jieri_02.html"},
		            //{thumbnail:"suo/lantern01.jpg",page:"lantern01.html"},//有2009年字样淘汰
		            {thumbnail:"suo/lantern02.jpg",page:"lantern02.html"},
		            //{thumbnail:"suo/newyear02.jpg",page:"newyear02.html"},//有2009年字样淘汰
		            //{thumbnail:"suo/newyear03.jpg",page:"newyear03.html"},//有2009年字样淘汰
		            {thumbnail:"suo/newyear04.jpg",page:"newyear04.html"},
		            {thumbnail:"suo/newyear01.jpg",page:"newyear01.html"},
		            {thumbnail:"suo/jieri_xinzhi05.jpg",page:"jieri_xinzhi05.html"},
		            {thumbnail:"suo/jieri_xinzhi16.jpg",page:"jieri_xinzhi16.html"},
		            {thumbnail:"suo/jieri_xinzhi17.jpg",page:"jieri_xinzhi17.html"},
		            {thumbnail:"suo/jieri_xinzhi18.jpg",page:"jieri_xinzhi18.html"},
		            {thumbnail:"suo/jieri_xinzhi19.jpg",page:"jieri_xinzhi19.html"},
		            {thumbnail:"suo/jieri_xinzhi44.jpg",page:"jieri_xinzhi44.html"}
		        ]
		    },
		    {
				groupId:"005",
		        group:"趣味卡通",
		        items:[
		            {thumbnail:"version2.0/katong1/thumb.jpg",page:"version2.0/katong1/index.html?v=2"},
		            {thumbnail:"version2.0/katong2/thumb.jpg",page:"version2.0/katong2/index.html?v=2"},
		            {thumbnail:"version2.0/katong3/thumb.jpg",page:"version2.0/katong3/index.html?v=2"},
		            {thumbnail:"version2.0/katong4/thumb.jpg",page:"version2.0/katong4/index.html?v=2"},
		            {thumbnail:"suo/fun_01b.jpg",page:"fun_01b.html"},
		            {thumbnail:"suo/fun_xinzhi00.jpg",page:"fun_xinzhi00.html"},
		            {thumbnail:"suo/fun_xinzhi02.jpg",page:"fun_xinzhi02.html"},
		            {thumbnail:"suo/fun_xinzhi08.jpg",page:"fun_xinzhi08.html"},
		            {thumbnail:"suo/fun_xinzhi15.jpg",page:"fun_xinzhi15.html"},
		            {thumbnail:"suo/fun_xinzhi22.jpg",page:"fun_xinzhi22.html"},
		            {thumbnail:"suo/fun_xinzhi31.jpg",page:"fun_xinzhi31.html"},
		            {thumbnail:"suo/fun_xinzhi32.jpg",page:"fun_xinzhi32.html"},
		            {thumbnail:"suo/fun_xinzhi34.jpg",page:"fun_xinzhi34.html"},
		            {thumbnail:"suo/fun_xinzhi36.jpg",page:"fun_xinzhi36.html"},
		            {thumbnail:"suo/fun_xinzhi38.jpg",page:"fun_xinzhi38.html"},
		            {thumbnail:"suo/fun_xinzhi40.jpg",page:"fun_xinzhi40.html"},
		            {thumbnail:"suo/fun_xinzhi46.jpg",page:"fun_xinzhi46.html"},
		            {thumbnail:"suo/fun_xinzhi56.jpg",page:"fun_xinzhi56.html"},
		            {thumbnail:"suo/fun_xinzhi58.jpg",page:"fun_xinzhi58.html"},
		            {thumbnail:"suo/fun_xinzhi59.jpg",page:"fun_xinzhi59.html"}
		        ]
		    },
		    {
				groupId:"006",
		        group:"朋友问候",
		        items:[
		            {thumbnail:"version2.0/pengyou1/thumb.jpg",page:"version2.0/pengyou1/index.html?v=2"},
		            {thumbnail:"version2.0/pengyou2/thumb.jpg",page:"version2.0/pengyou2/index.html?v=2"},
		            {thumbnail:"version2.0/pengyou3/thumb.jpg",page:"version2.0/pengyou3/index.html?v=2"},
		            {thumbnail:"suo/friend_xinzhi01.jpg",page:"friend_xinzhi01.html"},
		            {thumbnail:"suo/friend_xinzhi04.jpg",page:"friend_xinzhi04.html"},
		            {thumbnail:"suo/friend_xinzhi10.jpg",page:"friend_xinzhi10.html"},
		            {thumbnail:"suo/friend_xinzhi13.jpg",page:"friend_xinzhi13.html"},
		            {thumbnail:"suo/friend_xinzhi37.jpg",page:"friend_xinzhi37.html"},
		            {thumbnail:"suo/friend_xinzhi39.jpg",page:"friend_xinzhi39.html"},
		            {thumbnail:"suo/friend_xinzhi50.jpg",page:"friend_xinzhi50.html"},
		            {thumbnail:"suo/friend_xinzhi54.jpg",page:"friend_xinzhi54.html"},
		            {thumbnail:"suo/friend_xinzhi55.jpg",page:"friend_xinzhi55.html"},
		            {thumbnail:"suo/friend_xinzhi61.jpg",page:"friend_xinzhi61.html"}
		        ]
		    }
	],
	mzone : {
		groupId:"007",
	    group:"动感地带",
	    items:[
	        {thumbnail:"suo/m-zone01.jpg",page:"m-zone01.html"},
	        {thumbnail:"suo/m-zone02.jpg",page:"m-zone02.html"},
	        {thumbnail:"suo/m-zone03.jpg",page:"m-zone03.html"},
	        {thumbnail:"suo/m-zone04.jpg",page:"m-zone04.html"},
	        {thumbnail:"suo/m-zone05.jpg",page:"m-zone05.html"}
	    ]
	},
	vip : {
		groupId:"008",
		group:"VIP信纸",
			vip:true,
	        items: [{
	            thumbnail: "version2.0/vip5_1/thumb.jpg",
	            page: "version2.0/vip5_1/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip5"
	        }, {
	            thumbnail: "version2.0/vip5_2/thumb.jpg",
	            page: "version2.0/vip5_2/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip5"
	        }, {
	            thumbnail: "version2.0/vip5_3/thumb.jpg",
	            page: "version2.0/vip5_3/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip5"
	        }, {
	            thumbnail: "version2.0/vip5_4/thumb.jpg",
	            page: "version2.0/vip5_4/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip5"
	        }, {
	            thumbnail: "version2.0/vip5_5/thumb.jpg",
	            page: "version2.0/vip5_5/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip5"
	        }, {
	            thumbnail: "version2.0/vip20_1/thumb.jpg",
	            page: "version2.0/vip20_1/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip20"
	        }, {
	            thumbnail: "version2.0/vip20_2/thumb.jpg",
	            page: "version2.0/vip20_2/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip20"
	        }, {
	            thumbnail: "version2.0/vip20_3/thumb.jpg",
	            page: "version2.0/vip20_3/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip20"
	        }, {
	            thumbnail: "version2.0/vip20_4/thumb.jpg",
	            page: "version2.0/vip20_4/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip20"
	        }, {
	            thumbnail: "version2.0/vip20_5/thumb.jpg",
	            page: "version2.0/vip20_5/index.html?v=2",
	            level: top.$User.getVipStr("5,20"),cornerImg:"vip20"
	        }]
		},
        //新增全部分类
        getAllPapers : function(){
            var papersItem = {
                groupId : "000",
                group   : "全部",
                items   : []
            };
            var papers = this.papers;
            for(var i in papers){
                papersItem.items = papersItem.items.concat(papers[i].items);
            }
            this.papers.unshift(papersItem);
        },
        /** 
        *信纸所需公共代码
        *@constructs M2012.Compose.Model.LetterPaper
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.letterPaperBaseUrl = 'http://'+location.host+'/RmWeb/letterpaper/';
        	if(top.$T.Cookie.get('SkinPath') == "skin_mZone"){
			  this.papers.unshift(this.mzone);
			}else{
			  this.papers.push(this.mzone);
			}
			//加载vip信纸
			this.papers.push(this.vip);
            this.getAllPapers();
        },
        //登录使用最后一次信纸路径
        lastLetterPaperUrl : "",
		/**
		 * 重置最后一次使用的信纸
		 * @param {object} 回调对象 call.set、call.cancel
		 */
        reSetPaper : function(call){
			if(call){
				console.log(this.lastLetterPaperUrl);
				this.lastLetterPaperUrl != "" ? call.set(this.lastLetterPaperUrl) : call.cancel();
			}
        },
		/**
		 * 得到提示语
		 * @param {string} level 等级字符，形式同getVipStr返回值相同中。
		 * @return {string} 提示语
		 */
        getTipWords : function(level){
        	var self = this;
        	if(top.$User.isInternetUser()){
        		return self.tipWords['internetUserNotice'];
        	}
        	var tipMsg = self.tipWords['vipNoPermissionNotice'];
            switch (level) {
                case top.$User.levelEnum.vip5+","+top.$User.levelEnum.vip20:
                    //return top.$T.format(tipMsg, ["5", "、20元版", "信纸"]);
                    return 'VIP信纸为5元版、20元版邮箱特供信纸。立即升级，重新登录后即可使用。';
                case top.$User.levelEnum.vip20:
                    return top.$T.format(tipMsg, ["20", "", "信纸"]);
				default :
					return top.$T.format(tipMsg, ["5", "、20元版", "信纸"]);
            }
        },
		/**
		 * 使用信纸
		 * @param {string} paperLevel 可用信纸的用户等级集合：如0016,0017
		 * @param {string} userLevel 当前用户等级
		 * @param {function} call 弹出对话框点击回调对象:set,cancel
		 */
		useLetterPager : function(paperLevel,userLevel,call){
			var self = this;
            //进行用户等级判断，无权限时显示提示框。
            var msg = "";
            if (paperLevel && paperLevel.indexOf(userLevel) == -1) {//不能使用信纸时弹出提示
                switch (userLevel)//组织提示语
                {
                    case top.$User.levelEnum.free0010:
                    case top.$User.levelEnum.free0015:
                        msg = self.getTipWords(paperLevel);//免费用户
                        break;
                    case top.$User.levelEnum.vip5:
                        msg = self.getTipWords(paperLevel);//vip5用户
                        break;
                }
                var tipDialog = top.$Msg.confirm(
			        msg,
			        function () {
			            if (top.$App.isNewWinCompose()) {
			                top.$App.closeNewWinCompose(true);
			            }
			        	if(top.$User.isInternetUser()){
			        		// 互联网用户跳转到设置页
			        		self.reSetPaper(call);
			        		top.$App.show("account",{anchor:"accountAdmin"});
			        	}else{
			        		// 移动用户打开套餐信息页面
				        	self.reSetPaper(call);
				        	top.$App.showOrderinfo();
			        	}
			        },
			        function () {
			            self.reSetPaper(call);
			        },
			        {
			        	isHtml:true,
			            buttons:["确定","取消"],
			            title:""
			        }
			    );
			    tipDialog.on('close', function(data){// data 格式  {event : e}
			    	self.reSetPaper(call);
			    });
			    
            }
		}
    }));
})(jQuery,Backbone,_,M139);