/**
 * @fileOverview 页面跳转
 */

(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.SsoRedirect", superClass.extend(
    /**@lends M2012.SsoRedirect.prototype*/
   {
     
       initialize: function (options) {
           superClass.prototype.initialize.apply(this, arguments);
           var self = this;
		   
		   $App.on("initSsoRedirect",function(){
				self.ssoRedirect(); //避免在固定标签前插入
		   });
		     
           
       },

       defaults: {
           name: "M2012.SsoRedirect"
       },

       /**绑定事件处理
       *@inner
       **/
        initEvents: function () {
           var self = this;
           
        },
       
        SsoConfig:{
            compose:function(){ $App.show('compose')},
            "Send.aspx":function(){	Links.show("sms");	},
            "MMSSend.aspx":function(){	Links.show("mms");	},
            "SendFax.aspx":function(){	Links.show("fax");	},
            "contactlist.aspx":function(){	Links.show("addr");	},
            "Clone/default.aspx":function(){  Links.show("migrate");	},
            pushmail:function(){ Links.show("pushemail");},
            timeset:function(){	Links.show("timeset");}, //已失效
            mails:function(){
                M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () { 
                    $App.showMailbox(1);
	            });
            },
            "/mailnotify.aspx":function(){$App.show('notice');},
            "/LoginSMS.aspx":function(){$App.show('notice');}
        },
		
		/**
		* 判断来源，执行回调
		* @param {function} callback
		*/
		ssoComposeAction:function(id, actionType, callback){
			if(!id || "string" != typeof id){
				return;
			}
        var item = {
	        music: {//12530音乐站点
	            exe: function(id, call){
                    //查询歌曲url
	                var url = "http://mdll.10086.cn/" + "newweb/jsp/music_service/music_info_4_139.jsp?id={0}",                //彩铃推荐给好友的信纸模板
	                	subject = "好友{0}向您推荐了歌曲《{1}》，快来试听吧";//参数0：好友手机号，参数1：歌曲名
					//参数0：歌曲名，参数1：歌手名，参数2：试听地址，参数3：资源服务器路径
	                	contentTemplate = '<table style="margin:0;font-family:Arial, Helvetica, sans-serif; width:100%;background:#F4F9FF;" align="center" cellpadding="0" cellspacing="0"><tbody><tr>\
									<td style="background:url({3}/images/myRings_mail_top_x.png)" width="235"><img src="{3}/images/myRings_mail_logo.png" alt="logoImg" height="53" width="235"></td>\
									<td style="background:url({3}/images/myRings_mail_top_x.png)">&nbsp;</td>\
									<td width="5"><img src="{3}/images/myRings_mail_top_r.png" alt="bgImg" height="53" width="5"></td></tr></tbody></table><table style="margin:0;font-family:Arial, Helvetica, sans-serif; width:100%;background:#F4F9FF;" align="center" cellpadding="0" cellspacing="0"><tbody><tr><td width="20"></td><td><table style="border-bottom:1px #efefef solid;" cellpadding="0" width="100%"><tbody><tr><td style="padding-bottom: 48px; font-size: 14px; font-family: Arial,Helvetica,sans-serif;" valign="top"><table style="margin:16px auto;width:100%;color:#333;"><tbody><tr><td style="font-size: 12px;">\
									<h2 style="color:#FF6600;font-size:12px;">{0}</h2>\
									<p style="margin:8px 0;">歌手：<span>{1}</span></p>\
									<p style="margin:8px 0;">试听地址：<a style="color:#666" href="{2}" target="_blank">{2}</a></p></td></tr><tr><td style="font-size: 12px;"></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" style="border-top:1px #fff solid" width="100%"><tr><td style="width:190px;text-align:right;font-size:14px;font-family:Arial, Helvetica, sans-serif;color:#0739ac;line-height:2.5;"><strong>139邮箱</strong><a href="http://mail.10086.cn/" style="margin-left:.5em;color:#0739ac" target="_blank">mail.10086.cn</a></td><td style="text-align:right;font-size:12px;font-family:Arial, Helvetica, sans-serif;line-height:2.5;color:#555555;">感谢您一直以来的支持，我们将不断创新，为您带来更好的邮箱体验!</td><td width="10"></td></tr></table></td><td width="20"></td></tr></tbody></table></td></tr></tbody></table>';
	                	singerId = "",//歌手ID
	 					singerName = "",//歌手名
	 					songName = "",//歌曲名
	 					songId = "",//歌曲ID
	 					userNumber = $User.getUid() || "";
                    //请求音乐接口得到歌曲详细信息
                    "undefined" != typeof searchResult && (searchResult = "")
					//76修改到此
                    try {
                        $.getScript(url.format(id), function(){
	                        if (searchResult &&
	                        "object" == typeof searchResult &&
	                        searchResult.songList) {
	                            singerId = searchResult.songList.singerId || "";
	                            singerName = searchResult.songList.singerName || "";
	                            songName = searchResult.songList.songName || "";
	                            songId = searchResult.songList.songId || "";
	                            userNumber = userNumber.replace(/^86/, "")
								//调用写信接口								
								top.$App.show("compose",null,{inputData:{
									subject: subject.format(userNumber, songName), 
									content:content.format(songName, singerName, 'http://music.10086.cn/'+'newweb/qk/qkshow/' + songId + '/t/139mail.html', "http://images.139cm.com/rm/coremail" )}
								});
							}
                            call && call();
                        }, "utf-8", null)
                    } 
	                catch (e) {
                }
	            }
            },
				feixin: {},//飞信
				mm: {},//应用商城
				shequ: {},//说客
				cmpay: {},//手栅支付
				game: {},//游戏
				jiathis:{//jiathis分享接口ba
					exe:function(id, call){

                        var api = "user:getShareData";
                        var data = {
                            id: id
                        };

                        var options = {
                            onrouter: function (router) {
                                router.addRouter("setting", [api]);
                            }
                        };

                        $RM.call(api, data, callback, options);

                        function callback(result) {
                            if (result && result.responseData) {
                                result = result.responseData;
                                if (result.code === "S_OK") {
                                    result = result['var'] || {};

                                    //调用写信接口
                                    top.$App.show("compose", null, { inputData: {
                                        subject: result.title || "", //标题
                                        content: result.content + '<br>' + result.title
                                    }});
                                    call && call();
                                    return true;
                                }
                            }
                            return false;
                        }
					}
				}
			},
			pArr = null, //参数数组
			key = "", //行为来源，对应item的key
			id = "", //行为数据源id
			//来源
			from = actionType && "string" == typeof actionType && actionType.toLowerCase().trim() ||"";
			//用正则得到参数数组
			pArr = from.match(/(\S+)\_(\S+)/i);
			//得到键值
			key = pArr && pArr[1] || "";
			//得到id
			id = pArr && pArr[2] || "";
			//根据配置执行方法，否则运行默认写信页
			item[key] && item[key].exe ? item[key].exe(id, callback) : CM.show();
			item = pArr = null;
		},

       
        ssoRedirect:function(){
			var self = this;
            var id= $T.Url.queryString("id"),//分类，对应下面的case
	        to = $T.Url.queryString("to"),
            draftId = $T.Url.queryString("draftId"),
            t = $T.Url.queryString("t"),
	        c_composeitem=$T.Url.queryString("c_composeitem"),//写信行为分类
	        _goto=$T.Url.queryString("goto"),
	        smsShareId = $T.Url.queryString("ShareSmsId"),
	        searchString = location.search,
	        mobilePhone="",//手机号
	        idReg=/id=\d+/gi,//从cookie中读取id正则
	        itemReg=/c_composeitem=\S+_\d+/gi,//从cookie中读取item正则
	        mobilePhoneReg=/user=\S+/gi,//从cookie中读取手机号正则
	        aIdMatch=null,//id正则计算结果
	        aItemMatch=null,//item正则计算结果
	        aMobilePhoneMatch=null,//user正则计算结果
	        cookieDomain='.mail.' + document.domain,//cookie域
	        sParamFromCookie="",//从cookie中得到参数
	        messageExpiresTime=null,//如果是短信分享，记录短信分享ID的cookie超时时间
	        fileid = $T.Url.queryString("c_fileid");//彩云sso登录文件id
                        
            // 新窗口写信
            if ($App.isNewWinCompose()) {

                $('#main').show();

                if (draftId && draftId != 'null' && draftId != 'undefined' && location.hash.indexOf("newwin_") == -1) {
                    location.hash = "#newwin_";
                    $App.show('compose', { type: 'draft', mid: draftId });
                } else {
                    CM.show(); // 打开新的写信页
                }

                return;
            }

	        //单元测试，清空变量，模拟.net端cookie设置
	        //id=c_composeitem=mobilePhone="";
	        //Utils.setCookie("mailshare","id=2|c_composeitem=music_199|user=13691910301",new Date(2012,10,10),cookieDomain);
	        /**
	         * sunsc:第三方sso登录后通过.net透传得到cookie。url优先->cookie(使用完立即删除)
	         * cookie数据格式如：
	         * 12530:id=2|c_composeitem=music_199|user=13691910301
	         * jiathis:id=2|c_composeitem=jiathis_12
	         * 发短信:id=2|c_composeitem=message_
	         * 其中id是功能分类，下面会用case。c_composeitem对应ssoComposeAction方法中的item方法
	         * 如果id != 2，则有可能是需要跳转到其他业务，则不处理分享请求
	         */
	        if(!id || !c_composeitem || "string"!=typeof id || "string"!=c_composeitem){
		        //得到cookie
		        sParamFromCookie= $T.Cookie.get("mailshare")||"";
		        if(sParamFromCookie && "string"==typeof sParamFromCookie && sParamFromCookie.indexOf("|")>-1){
			        //取id
			        aIdMatch=sParamFromCookie.match(idReg);
			        id=aIdMatch && aIdMatch[0] || "";
			        id= id && id.replace("id=","");
			        //取c_composeitem
                    aItemMatch = sParamFromCookie.match(itemReg);
			        c_composeitem=aItemMatch && aItemMatch[0]||"";
                    c_composeitem = c_composeitem && c_composeitem.replace("c_composeitem=", "");
			        //如果是12530站点登录，增加读到cookie中的手机号逻辑
			        if(c_composeitem.indexOf("music")>-1){
				        //取user，手机号码
				        aMobilePhoneMatch=sParamFromCookie.match(mobilePhoneReg);
				        mobilePhone=aMobilePhoneMatch && aMobilePhoneMatch[0]||"";
				        mobilePhone=mobilePhone && mobilePhone.replace("user=", "");
				        //比较sso登录cookie中的号码和当前登录用户手机号是否一样。
				        if(mobilePhone.replace(/^86/gi,"")!=top.UserData.userNumber.replace(/^86/gi,"")){
					        //清空变量，sso登录后不做操作。
					        id=c_composeitem=mobilePhone="";
				        }
			        }
			        //jiathis短信分享
			        if (c_composeitem.indexOf("message") > -1) {
				        messageExpiresTime=new Date();
				        messageExpiresTime.setMinutes(messageExpiresTime.getMinutes()+1);
				        $T.Cookie.set("shareMsgId",c_composeitem.replace("message_",""),messageExpiresTime,cookieDomain);
			        }

                    //删除cookie
                    $T.Cookie.set({
                        domain: cookieDomain,
                        name: "mailshare",
                        value: ""
                    });

			        idReg=itemReg=aIdMatch=aItemMatch=null;
		        }
	        }
	        searchString = searchString.replace("?", "&");
	        //排除原有的一些参数
	        searchString = searchString.replace(/&style=[^&]+|&uid=[^&]+|&sid=[^&]+|&funcid=[^&]+|&reload=[^&]+|&id=[^&]+/ig, "");
	        if(id){
	            if(/\D/.test(id)){
	                if(LinkConfig[id]){
	                    //Links.show(id,searchString);
	                    setTimeout(function () {
	                        top.$App.show(id, searchString);
	                    }, 200);
	                    return true;
	                }else{
	                	if(id && id.indexOf('dingyuezhongxin') != -1){ // add by tkh 云邮局相关的跳转
	                		var mpostParams = id.split('_'); // dingyuezhongxin_columnId_pageType_columnName
	                		
	                		if(mpostParams.length === 1){
	                			$App.show("googSubscription");
	                			return;
	                		}
	                		
	                		if(mpostParams.length === 2){// 跳转到云邮局栏目详情页
	                			$App.show("googSubscription", {cid : mpostParams[1], comeFrom : '1003'});
	                			return;
	                		}
	                		
	                		if(mpostParams.length > 2){
	                			var columnId = mpostParams[1];
				        		var pageType = mpostParams[2];
				        		var columnName = '';
				        		if(mpostParams.length === 4){
				        			var tempName = mpostParams[3].replace(/\s+/, '');
				        			columnName = tempName?tempName : '云邮局';
				        		}
				        		
				        		if(pageType == 1){ // 跳转到我的报刊页
				        			$App.show("googSubscription", {cid : columnId, mtype : 0});
				        		}else if(pageType == 2){ // 跳转到云邮局在线服务页（仅限服务号columnId）
				        			$App.show("googSubscription");
				        			$App.show("mpostOnlineService", null, {
						            	title : columnName,
						            	key : columnId,
						            	inputData : {
						            		columnId : columnId,
						            		columnName : columnName
						            	}
						            });
				        		}else if(pageType == 3){ // 跳转到云邮局专题详情页
				        			// dingyuezhongxin_columnId_pageType_topic-activite-3/topic-activite-3
				        			if(columnName){
				        				columnName = columnName.replace(/\-/g, '_');
				        			}
				        			$App.show("googSubscription", {topicid : columnId, mtype : 3, templatename : columnName});
				        		}
	                		}
	                		return true;
	                	}
	                	
	                    Links.show(id,searchString); //跳转旧版处理
	                    return true;
	                }
	            }else{
			        if(id.match(/\d+/ig)){
				        switch (id) {
				            case "0": {//邮件列表
				                M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () {
				                    //$App.showMailbox(1);
				                    $App.getView("mailbox").model.getFreshUnread(function (mid) {
				                        $App.readMail(mid);
				                    });
				                });
				                break;
				            }
					        case "1":{//邮件搜索
						        Links.show("searchadvance",searchString);
						        break;
					        }
					        case "2":{//写信   
					        	var options = {} 
					        	if(c_composeitem == "setCompose"){
					        		options = {
					        			subject:"新版邮箱第一印象",
					        			content:["电脑登录标准版2.3，惊觉信息架构升级，真真高大上。<br/>",
					        			"手机登录酷版，体验html5技术与贴心交互，快就一个字。<br/>",
					        			"为新版邮箱点139个赞！"].join('')
					        		}
					        	}
					        	if(to){
					        		options.receiver = to;
					        	}
					            if(!$.isEmptyObject(options)){
					            	$App.show("compose",null,{inputData:options});
					            }else{
					            	self.ssoComposeAction(id,c_composeitem);
					            }
						        break;
					        }
					        case "4":{//邮箱伴侣,新版暂无邮箱伴侣
						        $App.show("mobile",searchString);
						        break;
						        
					        }
					        case "5":{//网络书签
						        Links.show("weblink",searchString);
						        break;
					        }
					        case "6":{//好友推荐
						        Links.show("invite",searchString);
						        break;
					        }
					        case "8":{//自写短信
						        Links.show("sms",searchString);
						        break;
					        }
					        case "9":{//自写彩信
						        Links.show("mms",searchString);
						        break;
					        }
					        case "10":{//修改密码
						        Links.show("password",searchString);
						        break;
					        }
					        case "11":{//日程提醒
						        Links.show("calendar",searchString);
						        break;
					        }
					        case "12":{//资讯中心
						        Links.show("rss",searchString);
						        break;
					        }
					        case "13":{//修改别名
						        //Links.show("accountManage",searchString);
						        $App.show('account');
						        break;
					        }
					        case "14":{//传真
						        //处理从社区版本打开传真页面时，打开是旧版的w问题，因此需要替换掉URL参数style=?
						        Links.show("fax",searchString.replace(/style=\d+/gi,""));
						        break;
					        }
	                        case "15"://读信
	                            {
	                    	        M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () { 
                                        var source = 'interface';
                                        var mid = $T.Url.queryString('mid') || $T.Url.queryString('box_mid');
		                                var fid = $T.Url.queryString("fid") || "1";                  
                                        if(mid){
                                            var returnObj = $App.readMail(mid,false,fid,{source:source});
                                            if(returnObj){
                                                $App.showPage({ name: returnObj.name, view: returnObj.view });
                                                
                                                function callback_readmail() {
                                                    $App.trigger("reloadFolder", { reload: true });
                                                    $App.off(callback_readmail);//只执行一次
                                                }
                                                $App.on('letterInfoReady', callback_readmail);//读信成功后再刷新
                                            }
                                        }               
	                                });
	                                break;
	                            }
					        case "16":{
						            Links.show("homemail",searchString);
						            break;
						        }
					        case "17":{
						        Links.show("diskDev",searchString);
						        break;
						        }
					        case "18":{
						        Links.show("postcard",searchString);
						        break;}
					        case "9":{
						        Links.show("postcard",searchString);
						        break;}
					        case "8":{
						        Links.show("greetingcard",searchString);
						        break;
						        }
					        case "20":{
						        /*CM.show({ //视频邮件
							        videomail: 1
						        });*/
						        $App.show('compose');
						        break;
						        }
					        case "21":{
						        Links.show('quicklyShare',searchString); //文件快递
						        break;
					        }
				            case "22": 
				                M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () { 
                                    $App.showMailbox(8);  //账单中心
	                            });
						        break;
					            //跳转进手机彩云的我的共享功能
					        case "23"://彩云登录跳转
						        Links.show("diskDev",searchString+"&goid=12");
						        break;
					        //跳转进手机彩云的好友共享对话框
					        case "24"://彩云登录跳转
						        Links.show("diskDev",searchString.replace("c_fileid","fileid")+"&goid=13");
						        break;
					        case "25":{//安全锁 社区按本用到
						        //Links.show('secretfolder');
						        $App.show("account",{anchor:"lock"}); 
						        break;
					        }
					        case "28":{//邮箱设置首页 社区按本用到
						        //Links.show('optionindex');
						        $App.show('account');
						        break;
					        }
					        case "29":{//设置签名 社区按本用到
						        //Links.show('signature');
						        $App.show("account",{anchor:"sign"}); 
						        break;
					        }
					        case "30":{//设置奥运，外域登录
					            /* 
					            if(top.SiteConfig.OlympicMail){
					                Utils.waitForReady("top.OM",function(){
						              top.OM.openTourchPage('login');
						            });
					            }
					           */
					            $Msg.alert('活动已经结束');
					            break;
					        }
					        case "31":{//设置加油，外域登录
					            /*if(top.SiteConfig.CheerUpOlympic){
					                 Utils.waitForReady("top.CU",function(){
						                top.CU.openTourchPage('login');
						             });
					            }*/
					            $Msg.alert('活动已经结束');
					            break;
					        }
					         case "32": {//打开签到，外域登录
				                /*if (top.SiteConfig.CheckIn) {
				                    Utils.waitForReady('$("iframe[name=\'welcome\']")[0].contentWindow.CheckIn._ajax', function () {
				                         $("iframe[name = 'welcome']")[0].contentWindow.CheckIn.showface();
        				                
				                    });
				                }*/
				                //console.log('打开签到页面');
				                $App.show('welcome');
				                break;
				            }
				            case "33":{ //精品订阅，标题有点问题
			                	M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () { 
                                    $App.showMailbox(9);
			                	});
			                	break;
				            }
				            case "34":{//已经有用，活动插件tips
				            	
				            }

				            case "35": {//任务邮件
				                M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () {
				                    appView.searchTaskmail();
				                });
				                break;
				            }
				            case "36": {//运营快速唤起
				                M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () {
				                    $App.showMailbox(1);
				                    var params = location.search;
				                    params = params.slice(1);
				                    params = params.split('&')
				                    for (var i = 0; i < params.length; i++) {
				                        if (typeof params[i] == "string") {
				                            var paramsValue = params[i].split('=');
				                            if (paramsValue[0] == 'params') {
				                                params = paramsValue[1];
				                                break;
				                            }
				                        }
				                    }
				                    params = decodeURIComponent(params);
				                    $Evocation.create(params)
				                });
				                break;
				            }
				            case "37": {//咪咕音乐
				                $App.show('myrings');
				                break;
				            }
				            case "38": {//精品订阅
				                top.$App.show('googSubscription');
				                break;
				            }
				            case "39": {//日历
				                top.Links.show('calendar_search','&search=日历服务');;
				                break;
				            }
							case "40": {//已发送
				                $App.showMailbox(3);
				                break;
				            }
				            case "41": { //日历广场
				                $App.show('calendar_square', searchString);
				                break;
				            }
				            case "42": { //创建活动
				                $App.show('addcalendar', searchString);
				                break;
				            }
				            case "43": { //搜索活动
				                $App.show('calendar_search', searchString);
				                break;
				            }
				            case "44": { //创建日历
				                $App.show('createCalendar', searchString);
				                break;
				            }
				            case "45": { //日历消息（消息盒子)
				                $App.show('calendar_msg');
				                break;
				            }
				            case "46": { //管理日历
				                $App.show('calendar_manage');
				                break;
				            }
							case "47": {//账单生活-主页
				                $App.show("billLifeNew", searchString);
				                break;
				            }
							case "48": {//账单生活-水费
				                $App.show("billLifeNew", "&lc=pay.waterselect&provcode=0&areacode=0&from=1&fromtype=1");
				                break;
				            }
							case "49": {//账单生活-电费
				                $App.show("billLifeNew", "&lc=pay.electricselect&provcode=0&areacode=0&from=1&fromtype=1");
				                break;
				            }
							case "50": {//账单生活-燃气
				                $App.show("billLifeNew", "&lc=pay.gasselect&provcode=0&areacode=0&from=1&fromtype=1");
				                break;
							}
				            case "51": {
				                $App.show('lottery', { originID: 3 });
				                break;
				            }
				            case "52": {
				                Links.show("greetingcard", searchString);
				                break;
				            }
				            case "53": {
				                $App.show('myScore');
				                break;
				            }
				            case "54": {
				                $App.show('myScore', {flag: '3' });
				                break;
				            }
				            case "55": {
				                $App.show('myScore', {flag: '4' });
				                break;
				            }
				            case "60": {
				                $App.show('smartLife');
				                break;
				            }
				            default:
						        { //邮件列表
							        M139.Timing.waitForReady('top.$App.getView("folder").model.folders', function () { 
                                        $App.showMailbox(1);
	                                });
							        return true;
						        }
				        }
			        }else{
				        Links.show(id,searchString);
			        }
		            return true;
		        }
	        }else if(_goto){
		        _goto=_goto.toLowerCase();
		        for(elem in this.SsoConfig){
			        var key=elem.toLowerCase();
			        if(_goto.indexOf(key)>=0){
				        var func=this.SsoConfig[elem];
				        func();
				        return true;
			        }
		        }
		        
		        
		        for(elem in LinkConfig){
			        var url=LinkConfig[elem]["url"].replace(/{stylePath}/ig,"").toLowerCase();
			        if (_goto.indexOf(url) >= 0) {
				        Links.show(elem,searchString);
				        return true;
			        }
		        }
		        
	        }else if(smsShareId){
	            Links.show("smsShare", "&ShareSmsId=" + smsShareId);
	            return true;
	        }else{
	            return false;
	        }
         }
     
     
     
   }));

})(jQuery, Backbone, _, M139);