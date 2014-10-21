/**
* @fileOverview 分页视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Paging', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "",
        name : "paging",
        events: {
            "click #prevpage" : "goToPrevPage",
            "click #nextpage" : "goToNextPage"
        },
        template: ['<div class="letterPaginationBox">',
                        '<p class="letterPaginationBox_link">',
                            '<a id="prevpage" href="javascript:;">上页</a>',
                            '<a id="curpage" href="javascript:;" class="pagenum ml_5">',
                                '<span class="pagenumtext">1/1</span>',
                            '</a>',
                            '<a id="nextpage" href="javascript:;">下页</a>',
                        '</p>',
                   '</div>'].join(''),
        
        initialize: function (options) {
            this.pages = options && options.pages ? options.pages : 1;
            this.init();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var self = this;
            this.on('pageChange',function(){
                self.setPage();
                if(self.callback) self.callback(self.currentPage);
            });
        },
        setPage : function(){
            var pagenumtext = this.currentPage + '/' + this.pages;
            this.$el.find('.pagenumtext').text(pagenumtext);
            if(this.currentPage == 1){
                this.$el.find('#prevpage').addClass("gray");
            }else{
                this.$el.find('#prevpage').removeClass("gray");
            }
            if(this.currentPage == this.pages){
                this.$el.find('#nextpage').addClass("gray");
            }else{
                this.$el.find('#nextpage').removeClass("gray");
            }
        },
        init : function(){
            this.$el = jQuery(this.template);
            var container = $('.letterPage');
            this.$el.appendTo(container);
        },
        // 初始化分页
        initPaping : function(){
            var self = this;
            this.currentPage = 1;
            var pageMenu = [];
            var pages = self.pages;
            for(var i = 0; i < pages; i++) {
                var pageMenuItem = {
                    text : (i+1) + "/" + pages,
                    value : i+1
                };
                pageMenu.push(pageMenuItem);
            }
            self.$el.find("#curpage").unbind('click');
            M2012.UI.PopMenu.createWhenClick({
                target : self.$el.find("#curpage"),
                container : document.body,
                width : 80,
                maxHeight : 236,
                items : pageMenu,
                onItemClick : function(item){
                    self.currentPage = item.value;
                    self.trigger('pageChange');
                }
            });
        },
        render : function(pages,callback){
            this.pages = pages;
            this.callback = callback;
            this.initPaping();
            this.setPage();
        },
        goToPrevPage : function (e){
            if(this.currentPage > 1){
                this.currentPage--;
                this.trigger('pageChange');
            }
        },
        goToNextPage : function (e){
            if(this.currentPage < this.pages){
                this.currentPage++;
                this.trigger('pageChange');
            }
        }
    }));
})(jQuery, _, M139);


﻿/**
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
﻿/**
* @fileOverview 信纸视图层.
*@namespace 
*/
(function (jQuery, _ , M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;

	var SCENE = {
		"version2.0/scene/meeting.html?v=2" : "会议纪要" ,
		"version2.0/scene/offer.html?v=2" : "入职通知" ,
		"version2.0/scene/resume.html?v=2" : "个人简历",
		"version2.0/scene/resign.html?v=2" : "离职告别",
		"version2.0/scene/vacate.html?v=2" : "请假单",
		"version2.0/scene/fees.html?v=2" : "费用审批单"
	};

	var IS_SCENE_MODE = false;

	var hev = parent.htmlEditorView;
	var ed_doc = hev.editorView.editor.editorWindow.document;

	hev.editorView.editor.on("before_send_mail" , function( e ) {
		var content = ed_doc.body.innerHTML;
		ed_doc.body.innerHTML = content.replace(/<form[\s,\S]*?form>|<iframe[\s,\S]*?iframe>/g,"");
	});
	if( $B.is.firefox ){
		try{
			ed_doc.execCommand('enableObjectResizing', false, 'false');
		}catch(e){}
	} else if( $B.is.ie || $B.is.ie11 ){
		$(ed_doc).on("mousedown", "input", function(e){
			return false;
		});
	}

	var business_tpl = {
		ready : false ,
		init : function( doc , ed ){
			if( this.ready ){
				return;
			}
			this.ready = true;
			var that = this ;
			this.doc = doc;
			this.ed = ed;

			$(doc.body).on("click", function( e ){
				var $edts = that.$edts ;
					e = e || window.event ;
				var cur = e.srcElement || e.target ,
					action = cur.getAttribute("data-action");
				 	 if( action === "upload" ){
						if(cur.tagName === "IMG"){
								that.curImg = cur ;
							}else{
								that.curImg = cur.getElementsByTagName("IMG")[0];
							}								 	 	
				 	 	$(that.f).find("INPUT").click();
				 	 }
					if( action === "placeHolder" ){
						if( cur.parentNode.className === "editable" ){
							hev.editorView.editor.selectElementText( cur );
						}
						$edts.each(function(){
							var sp = this.getElementsByTagName("SPAN")[0];
							var txt = this.getAttribute("data-text");
						if(!sp&&($.trim(this.innerHTML)==="")){
							}else if( $.trim(sp.innerHTML) === "" || sp.innerHTML === txt ){
								sp.className="";
								sp.parentNode.className = "editable";
							}
						});
						cur.className = "tpl-black";	
						cur.parentNode.className = "";
					}
				});
		},
		curImg : {} ,
		initTpl : function( context ){
			var $edts = $(context).find(".editable");
			this.$edts = $edts ;
			$edts.each(function(){
				var text = this.innerHTML ;
				this.innerHTML = "<span data-action='placeHolder' data-text='"+ text +"' >" + text + "</span>";
				this.text = this.innerHTML ;
				this.setAttribute( "data-text" , text );
			});
			var imageUploader = new parent.M2012.Compose.View.UploadForm({
				wrapper : this.doc.body ,
				accepts: ["jpg", "jpeg", "gif", "bmp", "png"],
				uploadUrl: parent.utool.getControlUploadUrl(true),
				onSelect: function(value, ext){
					if (_.indexOf(this.accepts, ext) == -1) {
						$Msg.alert("只允许插入jpg, jpeg, gif, bmp, png格式的图片", {icon:"warn"});
						return false;	// 取消后续操作，不触发onload
					}
					return true;
				},
				onUploadFrameLoad: function (frame) {
					var imageUrl = parent.utool.getControlUploadedAttachUrl(frame);
					imageUrl && business_tpl.getImg( imageUrl );
				}
			}).render();	
			this.f = imageUploader.$el[0];
			this.f.contentEditable = false ;
			imageUploader.$el.hide();
			imageUploader.$("input").hide();
		} ,		
		getImg : function( url ){
			this.curImg.src = url ;
			this.curImg.style.display = "block";
		},
		reset : function(){	
			$(this.doc).unbind("click") ;
			this.ready = false ;
			this.doc = null ;
			this.ed = null ;
			this.curImg = null ;
		}
	};
    M139.namespace('M2012.Compose.View.LetterPaper', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "letterpaper",
        count : 19,
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
		// 信纸iframe加载完毕后执行初始化
		initLeterPaper : function(){
		    var self = this;
		    var letterMenu = [];
			var papers = self.model.papers;
			for(var i = 0, len = papers.length; i < len; i++) {
				var paper = papers[i];
				var letterMenuItem = {
					text : paper.group,
					value : i,
					onClick : function() {
						$("#papers > .dropDownText").html(this.text);
						self.render(parseInt(this.value, 10));
					}
				};
				/**
				 * [modify by wn]
				 * @deprecated  2014 -7- 28
				 * @type {[type]}
				 */
				if( paper.group === "商务模版 <span style='color:red;'>new</span>"){
					letterMenuItem.html = "商务模版 <span style='color:red;'>new</span>";
					letterMenuItem.onClick = function(){ 
						$("#papers > .dropDownText").html(this.html);
						self.render(parseInt(this.value, 10));
					};
					delete letterMenuItem.text;
				}				
				letterMenu.push(letterMenuItem);
			}
			//var width = $("#papers").css("width");
			M2012.UI.PopMenu.createWhenClick({
				target : $("#papers"),
	            width : 169,
	            items : letterMenu,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	            	if( /商务模版/g.test(item.html) ){
	            		top.BH("compose_scene");
	            	}
	                //alert("子项点击");
	            }
	        });
		    self.render(0);
            self.setLetterListH();
		},
        setLetterListH : function(){
            $('.letterList').height($(window).height() - $('#papers').outerHeight(true) - 1 - 30);
        },
		setPaper : function(letterPaperUrl, thisObj, letterPaperId){
			var set_paper = function( keep ){
				BH({key : "compose_letterpaper"});
				
				var self = letterPaperView;
				var paperLevel=(thisObj && thisObj.getAttribute("level"))||"",//可以使用当前信纸的特级
					userLevel = top.$User.getUserLevel();//当前用户等级
				if(letterPaperId){
					var paperItem = self.getLetterPaperItem(letterPaperId);
					if(paperItem && paperItem['page']){
						letterPaperUrl = paperItem['page'];
						paperLevel = paperItem.level || top.$User.getVipStr();
					}
				}
				if (paperLevel && paperLevel.indexOf(userLevel) > -1){//记录最后一个可用的信纸
					self.model.lastLetterPaperUrl = letterPaperUrl;
				}
			    $.get(letterPaperUrl, function(html) {
			        var reg1 = /(style="[^"]*?)background-image:\s*url\(([^\)]+)\)/ig;
			        var reg2 = /(background=")([^"]+)/ig;
			        var reg3 = /(<img[^>]+?src=")([^"]+)/ig;
					var reg4 = /(background:url\()(\S+\))/gi;//内联样式背景替换规则
			        var replaceUrl = self.model.letterPaperBaseUrl;
			        if (top.$T.Url.queryString("v", letterPaperUrl) == "2") {
			            replaceUrl = self.model.letterPaperBaseUrl + letterPaperUrl.replace(/\/[^\/]+$/, "/");
			        }
			        html = html.replace(reg1, "background=\"$2\" $1");
			        html = html.replace(reg2, "$1" + replaceUrl + "$2");
			        html = html.replace(reg3, "$1" + replaceUrl + "$2");
			        html = html.replace(reg4, "$1" + replaceUrl + "$2");
			        self.usePaper( html , keep );
					self.model.useLetterPager(paperLevel,userLevel,{set:self.setPaper,cancel:self.cancelPaper});//信纸使用入口
					//top.UserData.isUseLetterPager=true;
					business_tpl.initTpl( ed_doc.body );
			    });
			};
			if(  SCENE[letterPaperUrl] ){
				var reg = /\/([^\/]+).html/.exec( letterPaperUrl ) ;
				top.BH( "compose_scene_" + reg[1]);
				if(  $.trim( hev.getTextContent() ) !== "" ){
					top.$Msg.confirm( "确定使用" + SCENE[letterPaperUrl] + "模版？使用后，已输入内容将被清空!" ,
						function(){ set_paper(); IS_SCENE_MODE = true;
							business_tpl.init( ed_doc , hev );
						},{ dialogTitle:"使用邮件模版",icon:"warn"});
				}else{
					set_paper(); 
					IS_SCENE_MODE = true;
					business_tpl.init( ed_doc , hev );					
				}
			}else{
				if( IS_SCENE_MODE ){
					top.$Msg.confirm( "确定使用该信纸？使用后，已输入内容将被清空!" ,
					function(){ set_paper(); IS_SCENE_MODE = false; },{ dialogTitle:"使用信纸",icon:"warn"});					
				}else{
					set_paper( true );
				}
			}			
		},
		usePaper : function(html , keep ){
		    var doc = parent.htmlEditorView.editorView.editor.editorWindow.document;
		    var contentContainer = doc.getElementById("content139");
		    var text="";
		    if(contentContainer){
		        text=contentContainer.innerHTML;
		    }else{
		        text=doc.body.innerHTML;
		    }
		
		    var matchCss = html.match(/(<style.*?>[\w\W\s\S]+<\/style>)/i);
		    if(matchCss){
		        var styleCss=matchCss[1];
		    }
		    var letterHTML = html.match(/<body.*?>([\w\W\s\S]+)<\/body>/i)[1];
		    $("head style", doc).remove();
		    
		    doc.body.innerHTML=letterHTML;
		    if (matchCss) $(doc.body).append(styleCss);
		    doc.body.contenteditable = false;
		    
		    $("table",doc.body).each(function(){
		        if(this.parentNode == doc.body){
		            this.style.width="99%";
		        }
		    });
		    contentContainer = doc.getElementById("content139");
		    if (contentContainer) {
		    	if( keep ){
		        	contentContainer.innerHTML = text.replace(/(?:<br>)*$/i, "<br><br><br><br><br><br><br><br><br>");
		    	}
		    }
		    try{
		        this.setEditorFocus(doc);
		        doc.body.scrollTop=0;
		    }catch(e){}
		},
		cancelPaper : function(){
			/**
			 * [modify by wn]
			 * @deprecated  2014-8-7
			 * @type {[type]}
			 */
			var self = letterPaperView;
		    var doc = parent.htmlEditorView.editorView.editor.editorWindow.document;
		    var contentContainer=doc.getElementById("content139");
		    if(!contentContainer){
		    	if( IS_SCENE_MODE ){
		    		top.$Msg.confirm( "确定撤销使用邮件模版？使用后，已输入内容将被清空!" ,
					function(){ 	
			    		IS_SCENE_MODE = false ;
			    		doc.body.innerHTML = "";
					},{ dialogTitle:"撤销使用邮件模版",icon:"warn"});
		    		return;
		    	}else{
		    		return ;
		    	} 
		    }
		    doc.body.innerHTML = contentContainer.innerHTML;
			self.model.lastLetterPaperUrl = "";
			//top.UserData.isUseLetterPager = false;
		},
		setEditorFocus : function(doc) {
		    if(document.all){
		    	setTimeout(function () {
			        var r = doc.body.createTextRange();
			        r.moveStart("character",0);
			        if( doc.getElementById("content139") ){
				        r.moveToElementText(doc.getElementById("content139").firstChild||doc.getElementById("content139"));
				        r.collapse(false);
				        r.select();
			        }
		        }, 0);
		    }
		},
		render : function(index){
            var self = this;
		    this.paper = this.model.papers[index];
		    this.groupId = this.paper.groupId;
            this.pages = Math.ceil(this.paper.items.length / this.count);
            if(!this.pagingView){
                this.pagingView = new M2012.Compose.View.Paging();
            }
            this.pagingView.render(this.pages, function(curPage){
                self.renderPage(curPage);
            });
            this.renderPage(1); //默认显示第一页
		},
        renderPage : function(curPage){ //curPage当前页码
            var htmlCode = '<a hideFocus="1" href="javascript:;" onclick="letterPaperView.cancelPaper()"><img width="64" height="48" alt="取消信纸" src="/m2012/images/module/letter/no_lp.gif" /></a>';
			var itemTemplate='<a hideFocus="1" href="javascript:;" onclick="letterPaperView.setPaper(\'{0}\',this);return false;" level="{2}" paperId="{4}"><span class="{3}"></span><img width="64" height="48" src="{1}"/></a>';
		    var paper = this.paper;
            var groupId = this.groupId;
            var len = curPage * this.count;
            var maxLen = paper.items.length;
            len = len <= maxLen ? len : maxLen;
            var cur = (curPage - 1) * this.count;
		    for(var i = cur; i < len; i++){
				var currPaper = paper.items[i];
				var paperId = groupId + i;
				var cornerImg = "";
				if(currPaper.cornerImg){
				    cornerImg = currPaper.cornerImg.indexOf('vip')>-1?'vip':currPaper.cornerImg;
				}
				htmlCode+=top.$T.format(itemTemplate,[currPaper.page,currPaper.thumbnail,currPaper.level||top.$User.getVipStr(),cornerImg,paperId]);
		    }
		    $("#paperContainer").html(htmlCode);
		    $("#paperContainer a").hover(
		        function(){$(this).addClass("on")},
		        function(){$(this).removeClass("on")}
		    );
        },
		// 根据信纸ID取信纸item对象
		getLetterPaperItem : function(letterPaperId){
			var groupId = letterPaperId.substr(0, 3);
			var paperIndex = letterPaperId.substr(3);
			for(var i = 0,len = this.model.papers.length;i < len;i++){
				var group = this.model.papers[i];
				if(group['groupId'] == groupId){
					var items = group['items'];
					var index = parseInt(paperIndex, 10);
					return items[index];
				}
			}
		},
        initEvents : function (){
        }
    }));
    
    window.onload = function(){
        letterPaperModel = new M2012.Compose.Model.LetterPaper();
        letterPaperView = new M2012.Compose.View.LetterPaper({model : letterPaperModel});
        letterPaperView.initLeterPaper();
	}
})(jQuery, _, M139);


