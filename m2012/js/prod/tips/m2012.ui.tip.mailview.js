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