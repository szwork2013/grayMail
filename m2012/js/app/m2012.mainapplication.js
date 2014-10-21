﻿/**
 * @fileOverview 定义标准版的App类对象M2012.MainApplication
 */


(function (jQuery, Backbone, _, M139) {

    function enqueueMailInfo(mailinfo) {
        var _this = this;

        M139.core.utilCreateScriptTag(
            {
                id: "contact_inbox_async_method",
                src: $App.getResourceHost() + "/m2012/js/packs/m2012_contacts_saveinbox_async.pack.js",
                charset: "utf-8"
            },
            function() {
                //重写掉域内方法，达到第一次读信时，仅加载一次异步函数。
                enqueueMailInfo = function(_mailinfo) {
                    $App.trigger('app:mailreaded#savecontact', _mailinfo);
                };

                $App.trigger('app:mailreaded#savecontact', mailinfo);
            }
        );
    }

    var $ = jQuery;
    var superClass = M139.PageApplication;
    var isFirstLoadGetInfoSet = true;
    var isFirstLoadInitConfigData = true;
    var reloadFolderFirst = true;
    M139.namespace("M2012.MainApplication", superClass.extend(
    /**@lends M2012.MainApplication.prototype*/
   {
   /** 
   *顶层窗口的App类
   *@constructs M2012.MainApplication
   *@extends M139.PageApplication
   *@param {Object} options 初始化参数集
   *@example
   */
   initialize: function (options) {
       superClass.prototype.initialize.apply(this, arguments);
   },

   defaults: {
       /**@field*/
       name: "M2012.MainApplication"
   },

   /**主函数入口*/
   run: function () {
       // 赋值sid方便调用。
       window.sid = $T.Html.encode($App.query.sid); 

       // 新窗口写信：隐藏边栏，突出写信主体
       // 判断URL中包含新窗口写信的标识，且hash中没有字段表明新窗口状态已结束
       if (this.isNewWinCompose()) {
            $('#sub, #divTab, #header').hide();
            $('#top').children().not('a:first').hide()
            $('#top>a:first').attr('href', 'javascript:;').css('cursor', 'default');
           $('#main').removeClass('main').addClass("main_write").hide();
           $('#logoArea').addClass('Loading_Hidden_Top');
           $(window).bind('beforeunload', function() {
              var curTab = $App.getCurrentTab();
              if (curTab.name.indexOf('compose_') > -1 && $App.isNewWinCompose()) {
                  var mainView = $($App.getCurrentTab().element).find("iframe").get(0).contentWindow.mainView;
                  var hasEdited = mainView && mainView.model.compare();
                  if (hasEdited) {
                      return mainView.model.tipWords['CANCEL_SEND'];
                  }
              }
           });
       }

       this.registerView("folder", new M2012.Folder.View.FolderMain());
       this.loadLevel = 0;

       this.initConfigData();
       this.initEvents();

       this.initModels();


       this.initApi(); //初始化全局公共函数
       this.initSubViews();
       this.initOldTimesAdapter(); //旧版适配器
       this.initProductView(); //加载运营业务 暂不开放
       this.initSsoRedirect(); //页面跳转
	   this.getDiskAttConf();//获取超大附件是否自动存网盘的设置
       //注册频道，以模块的group || channel做为频道名
       this.registerChannel("welcome", { leftNav: "mail" ,defaultTab:"welcome"});
       this.registerChannel("addr", { leftNav: "none", defaultTab: "addr", hideTab: true });
       this.registerChannel("disk", { leftNav: "none", defaultTab: "diskDev", hideTab: true });
       this.registerChannel("calendar", { leftNav: "none", defaultTab: "calendar", hideTab: true });
       this.registerChannel("subscribe", { leftNav: "none", defaultTab: "googSubscription" });
       this.registerChannel("billCharge", { leftNav: "none", defaultTab: "billCharge", hideTab: true });
       this.registerChannel("note", { leftNav: "none",hideTab: false, withinMail: true});
       this.registerChannel("groupMail", { leftNav: "none", hideTab: false, withinMail: true });
       this.registerChannel("setting", { leftNav: function(){return ""}, defaultTab: "mail", hideTab: false, withinMail: true });
   },

   /**绑定事件处理
   *@inner
   **/
   initEvents: function () {
       var self = this;

        this.on("folderRendered", function () { //文件夹加载完成
            this.onResize();
        });

        var headerHeight = $(".headerTopMenu").height();

		function resizeMainView(){
			var bodyHeight = $(document.body).height();
			$("#mainContentBox").height(bodyHeight - headerHeight);
		}

		resizeMainView();

       $(window).resize(function () {
	       resizeMainView();
           self.onResize();
       });

       //全局快捷操作
       top.$GlobalEvent.on("keydown", function (e) {
           $App.keyReply(e.event, e.window);
       });
	   
	   //全局点击事件事件处理
	   top.$GlobalEvent.on("click", function (e) {
            if( M139.UI.TipMailView && M139.UI.TipMailView.rollTitleConfig && M139.UI.TipMailView.rollTitleConfig.run === 1){
				M139.UI.TipMailView.reSetDocTitle(); //还原浏览器标题
			}
       });
	   

       //超时显示重新登录对话框
       this.on("change:sessionOut", function (model, sessionOut) {
           if (sessionOut) {
               this.showSessionOutDialog();
           }
       });

       //通讯录主数据需要更新
       this.on("change:contact_maindata", function (model, value) {
           self.initContactData();
       });

       this.on("sms_send", function (args) { //短信已发条数++
           var count = args.count;
           var info = $User.getSmsMMsInfo();
           if (info) {
               info.UsedSmsCount = Number(info.UsedSmsCount) + count;
           }
       });
       this.on("mms_send", function (args) { //彩信已发条数++
           var count = args.count;
           var info = $User.getSmsMMsInfo();
           if (info) {
               info.UsedMmsCount = Number(info.UsedMmsCount) + count;
           }
       });

       if ($B.is.ie) {
           this.on("closeTab", function () {
               M139.Dom.fixIEFocus();
           });
       }
	  this.on("addCalendar", function(data,options){//添加日程
       		self.addCalendar(data,options);
	  });
       //用于欢迎页动态消息的局部刷新，需要放在顶层
	  this.on("showTab", function (m) {
	      if (m.name == "welcome") {
	          if (top.$App.dyinfoChanged || top.$App.dyinfoChanged1) {
	              var welcomeView = top.document.getElementById("welcome").contentWindow.welcomeView;
	              welcomeView && welcomeView.reloadProd();
	          }
              /*
	          //用于欢迎页唤起的的遮罩显示
	          if (top.showWelcomeMask != 'showed' && !top.SiteConfig.closeWelcomeMask && top.$User.getPartId() != '1' && location.host.indexOf(3) < 0) {
	              self.showWelcomeMask();
	          }*/

	          
	      }
	  })

        if (SiteConfig.saveinboxcontact) {
            var _this = this;
            _this.on('readmail', function(mailinfo) {
                enqueueMailInfo(mailinfo);
            });
        }

       //监控页面放大缩小，提示ctrl+0
       setTimeout(function () {
           try {
               if (!($B.is.ie && $B.getVersion() < 8)) {
                   M2012.UI.Tip.ZoomTip.watchZoom();
               }
           } catch (e) { }
       }, 5000);

       /**
        *加载异常后检测网络链接 trigger from m139.httpclient etc..
        */
       this.on("httperror", function (e) {
           if (e.isTimeout || e.status == 401 || e.status == 502 || e.loadResourceError) {
               M2012.UI.Tip.NetHealthCheck.check();
           }
       });

       // 统计日志 - 首页收件箱固定标签点击
       $('#divTab li').live("click", function () {
            var id = $(this).attr('tabid');
            if (id == 'mailbox_1') {
               BH('click_mailbox_tab');
           }
       });
   },

   showWelcomeMask: function () {
       var self = this;
       //默认加载页不是首页且第一次加载
       if (top.showWelcomeMask != 'loaded') {
           //不弹的情况：1.有设置默认显示版块，且不是欢迎页；2. 从1.0跳进来，打开指定标签页
           if (($Url.queryString('tab') && $Url.queryString('tab') != "welcome" )|| $Url.queryString('id')) {
               top.showWelcomeMask = 'loaded';
               return;
           }
           //标记已经弹过，再切换到欢迎就不会弹了
           top.showWelcomeMask = 'showed';
       }
       

       //等待数据加载完成
       top.M139.Timing.waitForReady("top.$App.getConfig('UserData')", function () {
           //3个if return，只为保证用户在欢迎页弹出遮罩；
           if (!top.$App.getConfig('UserData')) return;
           if (UserData.mainUserConfig && UserData.mainUserConfig.shownewuserguide && UserData.mainUserConfig.shownewuserguide[0] == "1") return;
           if ($App.getCurrentTab().name != "welcome") {
               top.showWelcomeMask = 'loaded';
               return;
           }
           if (!top.$App.getUserCustomInfo("newLoginGuide")) {
               top.$App.setUserCustomInfoNew({ "newLoginGuide": 1 }, function () {
                   _appendHtml('newLoginGuide');
               })
           }
       });


       function _appendHtml(html) {
           var html = self.template[html];
           $(top.document.body).append(html).find('maskContent_1').show();
           var content = $('#maskContent');

           //是否显示余额
           var isShowCharge = false;
           if (top.$User.getProvCode() == "1" && $("body").width() > 978) {
               isShowCharge = true;
               content.find('li').eq(2).find('a.showNext').text('下一个');
           }

           content.find('.showNext').click(function () {
               var li = $(this).parents('li').eq(0);
               li.hide();
               if (li.next().length > 0) {
                   var nextLi = li.next().show();
               }else if (isShowCharge) {
                   $('#chargeContent').show();
               }else {
                   hideAll();
               }
           })

           content.find('.closeGuide').click(function () { hideAll(); });
           $('#closeMaskCharge,#welcomeMask').click(function () { hideAll(); });
       }

       function hideAll() {
           $('#welcomeMask,#maskContent,#chargeContent').hide();

       }
   },

   template: {
       newLoginGuide: [
           '<div id="welcomeMask" class="layer_mask closeGuide" style="overflow: hidden; z-index: 5009;"></div>',
            '<style>',
            '.newGuideWrap{}',
            '.newGuideWrap .guideLayer{position:fixed;_position:absolute;z-index:5010;display:none;}',
            '.newGuideWrap .guide_01{display:block;width:813px;height:241px;left:50%;top:50%;margin:-120px 0 0 -406px;background:url(../images/201312/guide_01.png) no-repeat;}',
            '.newGuideWrap .guide_02{width:611px;height:246px;left:0;top:0;background:url(../images/201312/guide_02.png) no-repeat;}',
            '.newGuideWrap .guide_03{width:813px;height:241px;left:0;bottom:0;background:url(../images/201312/guide_03.png) no-repeat;}',
            '.newGuideWrap .closeGl{width:28px;height:28px;cursor:pointer;position:absolute;top:5px;right:5px;background:url(../images/201312/guide_close.png) no-repeat;}',
            '.newGuideWrap .guideTxtArea{position:absolute;top:105px;left:360px;color:white;}',
            '.newGuideWrap .btnG,.newGuideWrap .btnG span,.newGuideWrap .btnTb,.newGuideWrap .btnTb span{height:28px;line-height:28px;overflow:hidden;width:80px;text-align:center;font-size:14px;padding:0;}',
            '.newGuideWrap .btnTb,.newGuideWrap .btnTb span{border:0;}',
             '</style>',
           '<ol class="newGuideWrap" id="maskContent">',
             '<li class="guideLayer guide_01">',
                 '<div class="guideTxtArea">',
                     '<p class="fz_18" style="color: white;">了解新版首页框架变化，使用起来更顺畅</p>',
                     '<p class="mt_20"><a hidefocus="1" class="btnG showNext" href="javascript:void(0)"><span>开始了解</span></a><a hidefocus="1" class="btnTb ml_20 closeGuide" href="javascript:void(0)" ><span>跳 过</span></a></p>',
                 '</div>',
                 '<a href="javascript:;" class="closeGl closeGuide" style="top:10px;right:132px;"></a>',
             '</li>',
             '<li class="guideLayer guide_02">',
                 '<div class="guideTxtArea" style="top:160px;left:195px;">',
                     '<p class="fz_18" style="color: white;">核心功能全新组合　一目了然</p>',
                     '<p class="mt_20 ta_c"><a hidefocus="1" class="btnG showNext" href="javascript:void(0)" ><span>下一个</span></a></p>',
                 '</div>',
                 '<a href="javascript:;" class="closeGl closeGuide" style="top:77px;right:134px;"></a>',
             '</li>',
             '<li class="guideLayer guide_03" >',
                 '<div class="guideTxtArea" style="top:115px;left:413px;width:335px;">',
                     '<p class="fz_18" style="color: white;">特色应用 :  短信  彩信   发贺卡   附件夹…</p>',
                     '<p class="mt_20 ta_c"><a hidefocus="1" class="btnG showNext" href="javascript:void(0)" ><span>我知道了</span></a></p>',
                 '</div>',
                 '<a href="javascript:;"  class="closeGl closeGuide" style="top:25px;right:6px;" ></a>',
             '</li>',
         '</ol>',
       '<div class="callsGuidePop" id="chargeContent" style="display:none"><a href="javascript:" class="nextA" id="closeMaskCharge"></a></div>'].join("")
   },

   /**装载模块
   *@inner
   **/
   initModels: function () {


   },

   /** 页面跳转 */
   initSsoRedirect: function () {
       var ssoredirect = new M2012.SsoRedirect();
       var self=this;
       this.on("folderLoaded", function () {
           if (self.isDefaultEntryInvoke) { return; }
           self.isDefaultEntryInvoke = true;
           //进入默认标签
           var ssoId = $Url.queryString("id");
           if (!ssoId) {
               var defTab = self.getView("top").getDefaultEntrytab();
               if (defTab) {
                   var defTabGoto = {
                       /*'welcome': function() {
                          $App.show('welcome');
                       },*/
                       "addr": function () {
                          $App.show('addr');
                       },
                       "calendar": function () {
                           $App.show('calendar');
                       },
                       "googSubscription": function () {
                           $App.show('googSubscription');
                       },
                       "mailbox_1": function () {
                           //等待邮件基本参数加载成功后才能进收件箱
                           function gotoMailbox() {
                               $App.off("userAttrsLoad", gotoMailbox);
                               $App.showMailbox(1);
                           }
                           $App.on("userAttrsLoad", gotoMailbox);
                       },
                       'diskDev': function() {
                           $App.show('diskDev');
                       }
                   }
                   if (defTabGoto[defTab]) {
                       defTabGoto[defTab]();
                   }
               }
           }
       });
   },

    /** 加载运营业务
    此JS被合并到welcome.prod.main.pack.js里面了
    */
   initProductView: function () {


       setTimeout(function () { //异步执行，避免prodFuns还未定义
           $App.prodFuns = top.ProductFuns;
           var pfs = top.$App.prodFuns;
           //top.$App.on("userDataLoad", function () {//请不要加在这里面，防止两次加载，用户设置到欢迎页面时
           top.M139.Timing.waitForReady('top.$App.getConfig("UserData")', function () {

               if (top.SiteConfig.onlineTips && !top.$User.isNotChinaMobileUser()) pfs.showOnlineTips();

               //ie下问题
               setTimeout(function () {

                   if (top.SiteConfig.isShowLazyCard) pfs.loadLazyCard();

               }, 1000);

           });

           pfs.loadOperateTips();
       }, 100);
   },
   onUserDataComplete: function (callback) {
       if (!this.completeCallbackList) {
           this.completeCallbackList = [];
       }
       this.completeCallbackList.push(callback);
       this.checkUserDataComplete();


   },
   checkUserDataComplete: function () {
       if (this.loadLevel >= 2) {
           if (this.completeCallbackList) {
               /*for (var i = 0; i < this.completeCallbackList.length; i++) {
                   this.completeCallbackList[i]();
               }*/
               while (this.completeCallbackList.length>0) {
                   var fun = this.completeCallbackList.shift();
                   fun();
               }
           }
       }
   },
   /**加载用户信息数据
   @inner
   */
   initConfigData: function () {
       var self = this;

      // this.getMergeInfoData(); //合并接口

       this.initContactData();
       

       var loadCount = 0;
       this.loadAttrs1(function (o) {//加载user:getInitData
           loadCount++;
           checkComplete(o);
           //等待getInitData成功之后才加载文件夹
           
       });
       
       /*this.loadAttrs2(function (o) {//加载用户配置user:getAttrs
           loadCount++;
           checkComplete(o);

       });*/

       var attrsAll = {};
       function checkComplete(o) {
           /*for (elem in o) { //将两个attrs取并集
           if (elem) {
           attrsAll[elem] = o[elem];
           }
           }*/
           //if (loadCount == 2) { //loadattr1和loadattr2都加载成功了
               self.loadLevel++;
               self.isUserAttrsLoad = true;
               self.trigger("userAttrsLoad", self.getConfig("UserAttrsAll"));
               self.checkUserDataComplete();
               
           //}
       }

       this.getMainData();

        //getPersonal
        /*
        M139.RichMail.API.call("user:getPersonal", null, function (response) {
            if (response.responseData && response.responseData.code == "S_OK") {
               var ud = response.responseData["var"];
               self.registerConfig("PersonalData", ud);
               self.trigger("personalDataLoad", ud);
            }
        });*/
        
        /*
        top.M139.Timing.waitForReady("$App.getConfig('userMobileSetting')", function () { 
            var ud = $App.getConfig('userMobileSetting');
            self.registerConfig("PersonalData", ud);
            self.trigger("personalDataLoad", ud);
        });*/


       if (window.MessageInfo) {
           this.registerConfig("MessageInfo", MessageInfo);
       }

       $App.on("userAttrChange", function (args) {
           var _original_callback = args && args.callback;
           args = $.extend(args, {
               "callback": function () { //重新加载所有的用户数据
                   $App.getView("top").renderAccountList(self.getConfig("UserData")); //重新生成顶部导航

                   if (_original_callback) {
                       _original_callback();
                   }
               }
           });

           self.reloadUserAttrs(args);
       });

       //adlink
       this.getAdLinkData();
       //this.loadOperateTips();
   },
   //加载通讯录数据，必须在getMainData之后调用，因为通讯录的接口需要usernumber todo get usernumber from cookie
   initContactData: function (userNumber) {
       var self = this;
       var contacts = M2012.Contacts.getModel();
       this.registerModel("contacts", contacts);
       contacts.loadMainData({
           //testUrl:"/m2012/js/test/html/contactsData.js",//用测试数据
           //userNumber: $User.getUid()
       }, function (data) {
           self.registerConfig("ContactData", data);
           self.trigger("contactLoad", data);
       });

       contacts.on("update", function (options) {
           self.trigger("contactUpdate", options);
       });
   },


    //初始化个人信息
    initUserMainData:function(ud,callback){
        var self = this;
        if(ud){
            if (ud.UID == "8613632599010") { //测试桩代码
                ud.UID = "8680000000000";
            }
            self.registerConfig("UserData", ud);
            self.trigger("userDataLoad", ud);
            if (callback) { callback(ud) }                 
        }
        //self.logger.error("userMainData data error", "[info:getInfoSet]", response);
    },

    //初始化定义数据
    initMainInfoData:function(callback){
        var self = this;
        this.loadMWGetInfoSet(function (response) {
            
            if (response.responseData && response.responseData.code == "S_OK") {
                var data = response.responseData["var"];

		//邮箱体检
                if(data.healthyHistory){
                    self.registerConfig("healthyHistory", data.healthyHistory);
                }else{
                    self.logger.error("healthyHistory data error", "[info:getInfoSet]", response);
                }
                
                //用户的大量个人信息
                if(data.userMainData){
                    self.initUserMainData(data.userMainData,callback);
                }else{
                    self.logger.error("userMainData data error", "[info:getInfoSet]", response);
                }

                //套餐信息
                if(data.mealInfo){
                    self.registerConfig("mealInfo", data.mealInfo);
                }else{
                    self.logger.error("mealInfo data error", "[info:getInfoSet]", response);
                }

                //消息中心
                if(data.infoCenter){
                    self.registerConfig("infoCenter", data.infoCenter);
                }else{
                    self.logger.error("infoCenter data error", "[info:getInfoSet]", response);
                }

             
                //到达通知，邮箱伴侣，短信赠送条数已发条数
                if(data.userMobileSetting){
                    self.registerConfig("PersonalData", data.userMobileSetting);
                    self.trigger("personalDataLoad", data.userMobileSetting);
                }else{
                    self.logger.error("userMobileSetting data error", "[info:getInfoSet]", response);
                }

              
                //好友生日
                if(data.birthdayRemind){
                    self.registerConfig("birthdayRemind", data.birthdayRemind);
                }else{
                    self.logger.error("birthdayRemind data error", "[info:getInfoSet]", response);
                }
                self.loadLevel++;
                self.isInfoSetLoad = true;
                self.trigger("infoSetLoad", data);
                self.checkUserDataComplete();
               

            }else{
                self.logger.error("info:getInfoSet", "[info:getInfoSet]", response)
            }

       }); 
    },

    /**
       深复制json，使用欢迎页加载json，如果欢迎页刷新，对象将失效，所以要做克隆
    */
    deepCloneJSON: function (json) {
        if (!json) return json;
        if (typeof json !== "object") {
            return json;
        } else {
            if (_.isArray(json)) {
                var newArr = [];
                for (var i = 0, len = json.length; i < len; i++) {
                    newArr.push(arguments.callee.call(this, json[i]));
                }
                return newArr;
            }else{
                var newObj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        newObj[key] = arguments.callee.call(this, json[key]);
                    }
                }
                return newObj;
            }
        }
    },

    /**
       判断是否显示欢迎页，外网用户不显示欢迎页 
    */
    isShowWelcomePage: function () {
        var iframe = document.getElementById("welcome");
        if (iframe && iframe.tagName === "IFRAME") {
            return true;
        }else{
            return $User.isChinaMobileUser();
        }
    },

    loadMWGetInfoSet: function (callback) {
        if (SiteConfig.m2012NodeServerRelease && this.isShowWelcomePage() && isFirstLoadGetInfoSet) {
            //第一次加载，尝试读欢迎页内联JSON
            var data = getWelcomeInlinedJSON();
            if (data) {
                setTimeout(function () {
                    inlinedCallback(data, true);
                }, 0);
            } else {
                this.on("welcome_getInfoSet_load", function (data) {
                    inlinedCallback(data, true);
                });
            }
        } else {
            M139.RichMail.API.call("info:getInfoSet", null, callback);
        }
        isFirstLoadGetInfoSet = false;
        function inlinedCallback(data, todoClone) {
            if (todoClone) {
                data = $App.deepCloneJSON(data);
            }
            callback({
                responseData: data
            });
            inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
        }
        function getWelcomeInlinedJSON() {
            var json = null;
            try{
                json = document.getElementById("welcome").contentWindow.inlinedGetInfoSetJSON;
            } catch (e) { }
            return json;
        }
    },

    loadRMInitDataConfig: function (callback) {
        if (SiteConfig.m2012NodeServerRelease && this.isShowWelcomePage() && isFirstLoadInitConfigData) {
            //第一次加载，尝试读欢迎页内联JSON
            var data = getWelcomeInlinedJSON();
            if (data) {
                setTimeout(function () {
                    inlinedCallback(data, true);
                }, 0);
            } else {
                this.on("welcome_getInitDataConfig_load", function (data) {
                    clearInterval(waitTimer);
                    inlinedCallback(data, true);
                });
                //如果欢迎页1秒内未加载出来
                var waitTimer = setTimeout(function () {
                    M139.RichMail.API.call("user:getInitDataConfig", {visiblePurgeBoxFlag: 1} , function (response) {
                        inlinedCallback(response.responseData);
                    });
                }, 1000);
            }
        } else {
            M139.RichMail.API.call("user:getInitDataConfig", {visiblePurgeBoxFlag: 1} , callback);
        }
        isFirstLoadInitConfigData = false;
        function inlinedCallback(data, todoClone) {
            if (todoClone) {
                data = $App.deepCloneJSON(data);
            }
            callback({
                responseData: data
            });
            inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
        }
        function getWelcomeInlinedJSON() {
            var json = null;
            try {
                json = document.getElementById("welcome").contentWindow.inlinedInitDataConfigJSON;
            } catch (e) { }
            return json;
        }
    },

   /* 加载主要接口数据（合并7个接口，对应如下）
      "mealInfo":"meal:getMealInfo", //套餐信息
      "infoCenter":"user:getInfoCenter" //消息中心
      "userMainData":"user:getMainData" //用户的大量个人信息
      "userMobileSetting":"user:getPersonal" //到达通知，邮箱伴侣，短信赠送条数已发条数
      "singInInfo":"poperations:singInit" //签到信息
      "weatherInfo":"weather:getDefaultWeather" //天气预报
      "birthdayRemind":"card:birthdayRemind" //原贺卡站点的已发生日提醒联系人接口   
   */
   getMainData: function (callback) {
        var self = this;
        
        if(!$App.getConfig('UserData')){ //第一次
            self.initMainInfoData(callback);
        }else{ //下一次
            M139.RichMail.API.call("user:getMainData", null, function (response) {
                if (response.responseData && response.responseData.code == "S_OK") {
                    var ud = response.responseData["var"];
                    self.initUserMainData(ud,callback);
                }else{
                    self.logger.error("getMainData data error", "[user:getMainData]", response)
                }
            });
        }
   },
   //获取是否自动存网盘
   getDiskAttConf: function(callback){
        var self = this;

        if (typeof callback !== "function") {
            callback = $.noop;
        }

        M139.RichMail.API.call("disk:getDiskAttConf", null, function (result) {
	        var data = result.responseData || {};
            if (data.code == "S_OK") {
                $App.setConfig('DiskAttConf', 'autoSaveToDisk', data['var'].largerAttSave);
            } else {
                self.logger.error("getDiskAttConf data error", "[disk:getDiskAttConf]", result);
            }
            callback(data);
        });
   },
   //设置是否自动存网盘
   setDiskAttConf: function(enabled, callback){
        var self = this;
        if (typeof callback !== "function") {
            callback = $.noop;
        }

        M139.RichMail.API.call("disk:updateDiskAttConf", {"enable": String(Boolean(enabled))}, function (result) {
	        var data = result.responseData || {};
            if(data.code == "S_OK") {
                $App.setConfig('DiskAttConf', 'autoSaveToDisk', Boolean(enabled) ? "0" : "1");
            } else {
                self.logger.error("updateDiskAttConf failed", "[disk:updateDiskAttConf]", result);
            }
	        callback(data);
        })
   },

    /** 获取广告数据 */
    getAdLinkData: function (callback) {
        var self = this;
        var url = '/sharpapi/userconfig/service/ajaxhandler.ashx?func=user:adlink&sid=' + sid;
        var gurl = M139.HttpRouter.getNoProxyUrl(url);
        $.getScript(gurl, function() {
            if (AdLink) {
                self.registerConfig("AdLink", AdLink);
                callback && callback(AdLink);
            } else {
                callback && callback(null);
            }
        });
    },


   //通过main_ajax加载userAttrs数据，只有一部分
   loadAttrs1: function (callback, onloading) {
       var self = this;
       this.loadRMInitDataConfig(function (response) {
           if (response.responseData.code == "S_OK") {
               //var ud = M139.JSON.tryEval(M139.Text.Cookie.get("UserData"));
               var data = response.responseData["var"];

               //注册从rm加载的用户属性
               if (data.userAttrs) { self.registerConfig("UserAttrs", data.userAttrs); } //用户基本参数
               if (data.messageInfo) { self.registerConfig("MessageInfo", data.messageInfo); } //邮件总数，未读总数，邮件容量
               if (data.PopList) {
                   self.registerConfig("PopList", data.PopList);
                   window.PopList = data.PopList; //容错。
               } //代收列表
               if (data.SignList) { self.registerConfig("SignList", data.SignList); } //签名列表
               if (data.folderList) { self.registerConfig("FolderList", data.folderList); } //文件夹列表

               //注册user:getAttrs
               if (data.userConfig) { self.registerConfig("UserAttrsAll", data.userConfig); }

               if ($.isFunction(onloading)) {
                   onloading(self.getConfig("UserAttrs"));
               }
               self.registerConfig("InitData", response.responseData);  //存储getInitData返回值
               //加载文件夹
               self.getView("folder").render(true, function () {
                   $App.trigger("folderLoaded", {}); //文件夹首次加载消息
                   if(reloadFolderFirst){
                      setTimeout('$App.trigger("reloadFolder");reloadFolderFirst=false;',200); 
                   }
               });

               if (callback) { callback(self.getConfig("UserAttrs")); }

               M139.RichMail.API.call("user:moveHOMail", {});//割接账单
           }

       });
   },
   //通过getAttrs加载userAttrs数据，只有另外一部分
   loadAttrs2: function (callback) {
       var self = this;
       //从服务端加载所有的用户配置信息
       var data = {
           attrIds: []
       }
       $RM.getAttrs(data, function (result) {
           self.registerConfig("UserAttrsAll", result["var"]);
           callback(result["var"]);
       });

   },
   reloadUserAttrs: function (args) {
       var self = this;
       var loaded = 0;
       function loadComplate() {
           loaded++;
           if (loaded == 2) {
               $App.trigger("userAttrsLoad", self.getConfig("UserAttrsAll"));
               $App.trigger("userDataLoad", self.getConfig("UserData"));
               if (args && $.isFunction(args.callback)) {
                   args.callback();
               }
           }
       }
       this.loadAttrs1(loadComplate, function (userattrs) {
           if (args && typeof (args.trueName) != "undefined") { //后台接口取不到最新的truename，直接改本地变量
               userattrs.trueName = args.trueName;
           }
       });
       //this.loadAttrs2(loadComplate);
       this.getMainData(loadComplate);

   },
   
   /**@inner*/
   changeSkin : function(name){
   		var skinName = name || $User.getSkinName();
   		var link = $("#skinLink");
   		var href = link.attr('href');

      // 根据当天时间段变化的皮肤，进行匹配
      if(isAlternateSkin(skinName)){
        skinName = chooseAlternateSkin(skinName);
      }

   		href = href.replace(/skin_[^_]+/, skinName);
   		if ($B.is.firefox) {
            //火狐下先预加载css,否则切换过程会渲染凌乱
          $('<img src="' + href + '"/>').bind("error", function () {
              setTimeout(function () {
                  link.attr('href', href);
              }, 500);
          });
      } else {
          link.attr('href', href);
      }

      var bgImg = $('#skinBgImg');
      if (skinName.indexOf('_clarit') > -1) {
          var src = '../images/skin/'+ skinName.split('_')[1] +'/skinBody.jpg';
          bgImg.attr('src', src);
          $('#skinBgSub').show();
      } else {
          bgImg.attr('src', '');
          $('#skinBgSub').hide();
      }
       
        
   		setTimeout(function () {

          //处理1.0的iframe
   		    eachFrames(window, function (win) {
   		        if (win.Utils && win.Utils.loadSkinCss) {
   		            win.Utils.loadSkinCss("", win.document);
   		        }
   		    });

          // 处理2.0
          var moduleArr = ['#welcome', '#addr', '#calendar', '#diskDev', '#googSubscription', '#groupMail'];
          for (var i = moduleArr.length; i--;) {
              var iframe = $(moduleArr[i])[0];
              if (iframe) {
                  try {
                      $App.setModuleSkinCSS(iframe.contentWindow.document);
                  } catch (e) { console.log(e); }
              }
          }

   		    function eachFrames(win, func) {
   		        try {
   		            var frames = win.frames;
   		            for (var i = 0; i < frames.length; i++) {
   		                try {
   		                    func(frames[i]);
   		                    eachFrames(frames[i], func);
   		                } catch (e) { }
   		            }
   		        } catch (e) { }
   		    }
   		}, 100);
   },

   setModuleSkinCSS: function(doc) {
      if (!doc) {
          throw new Error('请传入document对象');
          return;
      }

      var skinName = top.$User.getSkinName();
      // 根据当天时间段变化的皮肤，进行匹配
      if(isAlternateSkin(skinName)){
          skinName = chooseAlternateSkin(skinName);
      }
      var link = $('#moduleSkinCSS', doc || document);
      var href = link.attr('href');

      // 样式节点已存在
      if (link[0]) {
          if (href.indexOf(skinName) == -1) {
              href = href.replace(/skin_[^.]+/, skinName);
              link.attr('href', href);
          }
      // 初次加载
      } else {
          href = top.m2012ResourceDomain + '/m2012/css/skin/' + skinName + '.css'
          var version = top.getResourceVersion(skinName + '.css')
          if (version) {
              href += '?v=' + version;
          }
          $('head:eq(0)', doc).append('<link id="moduleSkinCSS" rel="stylesheet" href="' + href + '" type="text/css" />');
      }
   },

   /**
    * top.$App.trigger("addCalendar",{startTime:"0800",endTime:"1000",extInfos:[{appName:''}]},
    *                            {fnSuccess:function(){alert(1);}}
    *             );
    */
   addCalendar:function(data,callbackObj){
   		callbackObj = callbackObj || {};
   		var callName = callbackObj.callName || 'addBirthdayCalendar';
   		//初始回调函数
 	 	var fnback = function(){};
     	var fnSuccess = callbackObj.fnSuccess || fnback,
	           fnFail = callbackObj.fnFail || fnback , 
	          fnError = fnError || fnback;
	    //初始基本数据
     	data =  $.extend({comeFrom:0,calendarType:10,labelId:6,//生日标签
	     					recMySms:1,recMyEmail:0,beforeTime:15,
	     					sendInterval : 6,enable:1,beforeType:0,
	     					startTime:"0800",endTime:"2359"
	                        },data);
	    //调用
	 	top.M139.RichMail.API.call('calendar:'+callName, data, function(res){
	 	 	
	 	 		if( !res || typeof res != 'object' ){
                    fnError();
                    return;
                }
                
                var json = res.responseData;
                if( !json || typeof json != 'object' ){//出错
                    fnError();
                    return;
                }
                
                var code = json['code'];
                if( code == 'S_OK' ){ //成功
                    var data = json['var'] || {};
                    fnSuccess( data, json ); 
                } else {
                    fnFail( code, json ); 
                }
	 	 });
   	
   },
   /**@inner*/
   initSubViews: function () {
       //页面主容器
       var self = this;
       var containerMain = document.getElementById("div_main");

       this.registerView("tabpage", new TabPageView({ container: containerMain}));
       this.registerView("mailbox", new M2012.Mailbox.View.Main());
       this.registerView("mailbox_other",new M2012.Mailbox.View.Main({ multiInstance: true}));
     
     
       this.getView("tabpage").render(); //标签页    
     
       this.registerView("tabmenu", new M2012.TabMenu.View());     //标签下拉菜单

       this.registerView("remind", new M2012.Remind.View());
       this.registerView("top", new M2012.Main.View.TopView());
       this.getView("top").render();
       //固定标签，读取配置数据    
       // 必须放在"top"视图注册之后，存在依赖关系
       this.createFixedTabs();


       this.registerView("contextmenu", new M2012.Mailbox.View.ContextMenu());
       var mailboxModel = this.getView("mailbox").model;
       if ($B.is.webkit || $B.is.firefox) {
           setTimeout(function () {
               //mailboxModel.fillPreloadData();
               /*var composeFrame =$("<iframe src=\"/m2012/html/compose.html?sid=" + $App.getSid() + "\" style=\"display:none\"></iframe>");
               $(document.body).append(composeFrame);
               composeFrame.load(function () { //预加载写信页资源，加载成功后移除
                   setTimeout(function () {
                       composeFrame.attr("src", "");
                       composeFrame.remove();
                   }, 1000);
               });*/
               $.get("/m2012/html/compose.html?sid=" + $App.getSid());
               /*$.get("/m2012/html/editor_blank.htm?sid=" + $App.getSid());
               if (window.Config_FileVersion) { //预加载写信页js
                   new Image().src=(m2012ResourceDomain + "/m2012/js/packs/compose.html.pack.js?v=" + window.Config_FileVersion["compose.html.pack.js"]);
               }*/
           }, 2000);
       }
       this.registerView("command", new M2012.Mailbox.View.Command({ model: mailboxModel })); //实例化command命令执行类

       if ($User.isChinaMobileUser()) {
           var fetionImView = new M2012.Fetionim.View();
           fetionImView.render();
       }else{
           $('#fetionElemTop').hide();
       }
   },
   /** 创建固定标签 
   * 要区分是否设置过固定标签 
   * 如从未设置过则显示：欢迎页、通讯录、日历、精品订阅（云邮局） 【非移动：欢迎页、通讯录、精品订阅】
   * 设置过则显示：按照设置的显示，若固定标签不包含收件箱，则默认显示收件箱（移动用户可关闭）。
   */ 
   createFixedTabs: function () {

       var self = this;
       var frameView = new FrameView({ parent: this.getView("tabpage") });

       self.getView("tabpage").createOrignTabs(["mailbox_1"], self.getView("mailbox"));
       if ($User.isChinaMobileUser()) { //是移动用户才显示欢迎页
           self.show("welcome");
       }

       top.$App.onUserDataComplete(function () {
           self.getView("top").showTopFixedTabs();           
           // 由于搜索提示语初始化需要依据当前模块，所以放在这里初始化
           $App.getView('top').preInitSearch();
           var fixedtabs = self.getView("tabpage").model.getFixedTabsData(); //固定标签数据
           setTimeout(function () {
               /*if (fixedtabs[0] && $.trim(fixedtabs[0]) != "/>") {
                   self.getView("tabpage").createOrignTabs(fixedtabs, frameView); //打开固定标签
               }
               if ($App.getCustomAttrs('hasSetFixedTabs') == '' || $App.getCustomAttrs('fixedtabs').indexOf('mailbox') === -1) {
                   self.getView("tabpage").createOrignTabs(["mailbox_1"], self.getView("mailbox")); //未设置过的或不固定收件箱
               }*/
               $App.trigger("initSsoRedirect", {});
               //TODO 改变标签页顺序,收件箱放最后
               if ($App.query.tab && !$App.query.id) {
                   var tabDiv = document.getElementById('divTab');
                   var tabItems = tabDiv.getElementsByTagName('li');
                   for (var i = 0; i < tabItems.length; i++) {
                       var tabItem = tabItems[i];
                       //收件箱不在最后,要调整
                       if (tabItem.getAttribute('tabid') == "mailbox_1" && i != tabItems.length - 1) {
                           tabItem.parentNode.insertBefore(tabItem, tabItems[tabItems.length - 1]);
                           break;
                       }
                   }
               }
           }, 100);

       });
       //$('#tabsMenuIco').show();

   },

   initOldTimesAdapter: function () {

       var vm = new M2012.MatrixVM();
       vm.start();


   },

   _defResource: "http://images.139cm.com",

   getResourceHost: function () {
       var rescfg = top.m2012ResourceDomain;

       if (rescfg) {
           return rescfg;
       }

       try {
           rescfg = top.domainList.global.rmResourcePath;
       } catch (ex) {
       }

       rescfg = rescfg.match(/^(http:\/\/)?([^\/]+)/i)[0];
       if (rescfg) {
           return rescfg;
       }

       return this._defResource;
   },

   getResourcePath: function () {
       try {
           return top.domainList.global.rmResourcePath;
       } catch (ex) {
           try {
               return top.rmResourcePath;
           } catch (ex1) {

           }
       }
       return this._defResource + "/m2012";
   },
   getSiteConfig: function (key) {
       return SiteConfig[key];
   },
   /**
   *增加一些快速使用的API
   *@inner
   */
   initApi: function () {
       jQuery.extend(this,
       /**@lends M2012.MainApplication.prototype*/
               {
               /**
               *获得sid
               */
               getSid: function () {
                   return $T.Html.encode(this.query.sid);
               },

               /**
               *获取邮件域名:139.com,rd139com,hmg1.rd139.com
               */
               getMailDomain: function () {
                   return SiteConfig.mailDomain || "139.com";
               },

               /**
               * 使用本域邮件域名来组合成一个帐号
               * @param {String} account 邮件帐号，无邮件域
               */
               getAccountWithLocalDomain: function (account) {
                   return account + "@" + $App.getMailDomain();
               },

               /**
               * 使用本域邮件域名来组合成一个帐号
               * @param {String} account 邮件帐号（完整，带邮件域）
               */
               isLocalDomainAccount: function (fullaccount) {
                   return $Email.getDomain(fullaccount) === $App.getMailDomain();
               },


               //获取是否带原邮件回复 todo 直接调用$User
               getReplyWithQuote: function () {
                   return $User.getReplyWithQuote();
               },

               /**
               *获取代收账户列表
               */
               getPopList: function () {
                   return $App.getConfig("PopList") ? $App.getConfig("PopList") : [];
               },

               /**
               *获取签名列表
               */
               getSignList: function () {
                   return $App.getConfig("SignList") ? $App.getConfig("SignList") : [];
               },

               //是否信窗口读信
               isNewWin: function () {
                   return location.search.indexOf("t=newwin") > -1;
               },

               //是否会话模式命令
               isSessionCommand: function (command) {
                  var map = {
                      'delete':true,
                      'move':true,
                      'mark':true
                  };
                  var flag = map[command] && $App.isSessionMode() && $App.isSessionFid($App.getCurrentFid());
                  if ($App.getCurrentTab().group == 'mailbox' || $App.getCurrentTab().group.indexOf('mailsub_') >=0) { //列表页
                      return flag && !$App.getCurrentTab().view.model.get('isSearchMode');
                  }else{ //读信页
                     return flag;
                  }
               },

               /**
               *读邮件,如果是列表中存在的邮件，第二个参数mailData可以不传递，如果是列表中不存在的邮件，则需要传递
               *@param {String} mid 邮件的id
               *@param {Boolean} win 是否新窗口读信
               *@param {number} currFid 当前文件夹
               */
               readMail: function (mid, win, currFid, options) {
                   var self = this;
                   var readmailview = new M2012.ReadMail.View();
                   var returnobj = readmailview.callReadMail(mid, win, currFid, options);
                   if (returnobj) {
                       return returnobj;
                   }
               },


               /**  
               添加黑白名单 
               *@param {Object} e 点击的元素  $(e.currentTarget).attr("key")  key的值："black","white"
               *@param {Object} options 黑白名单的名称options={name:"dfs@fsdf.fsd"}
               */
               addBlackWhite: function (e, options, callback) {
                   if (typeof (top.addBlackWhiteView) != "undefined") {
                       top.addBlackWhiteView.addBlackWhite(e, options, callback);
                   }
                   else {
                       M139.registerJS("M2012.Settings.Spam", "packs/spam.html.pack.js?v=" + Math.random());
                       M139.requireJS(['M2012.Settings.Spam'], function () {
                           top.addBlackWhiteView = new M2012.Settings.Spam.View();
                           top.addBlackWhiteView.addBlackWhite(e, options, callback);
                       });
                   }
               },

               /**  读信正文输出 */
               writeContent: function (dataSource, win) {
                   var readmailcontentview = new M2012.ReadMail.View.ReadMailContent();
                   readmailcontentview.writeContent(dataSource, win);
               },

               showBill: function (type) {
                   //$("#billTab li").removeClass("on");
                   var m = this.getView("mailbox_other").model;
                   
                   if (type == 2) { //我的账单
                       //$("#billTab li").eq(1).addClass("on");
                       m.set("billTab", 0);
                       BH("service_mail_load");
                       this.searchMail({
                           fid: 1, exceptFids: [4], isFullSearch: 0, flags: { billFlag: 1 }, condictions: [
                               {
                                   field: "logoType",
                                   operator: "GE",
                                   value: 0
                               },
                               {
                               field: "logoType",
                               operator: "LT",
                               value: 2
                           }]
                       });
                   } else if (type == 1) {//我的服务
                       //$("#billTab li").eq(2).addClass("on");
                       m.set("billTab", 1);
                       BH("my_service_load");
                       this.searchMail({
                           fid: 1, exceptFids: [4], isFullSearch: 0, flags: { billFlag: 1 }, condictions: [{
                               field: "logoType",
                               operator: "GE",
                               value: 2
                           }]
                       });
                   } else if (type == 4) {//语音信箱
                       //$("#billTab li").eq(2).addClass("on");
                       m.set("billTab", 3);
                       BH("my_service_load");
                       this.searchMail({
                           fid: 1, exceptFids: [4], isFullSearch: 0, flags: { billFlag: 1 }, condictions: [{
                               field: "logoType",
                               operator: "=",
                               value: 4
                           }]
                       });
                   }
               },
               showSubscribe: function (sendId, subscribeName) {
                
                   var view;
                   // 订阅邮件入口调用showSubscribe（true），要进行区分
                   if (sendId && typeof sendId != 'boolean') {
                       view = new M2012.Mailbox.View.Main({ multiInstance: true, subscribeName: subscribeName ? subscribeName : '', isSearch: true });
                   } else {
                       view = $App.getView("mailbox_other");
                   }

                   // 从“订阅邮件”进入，搜索范围为收件箱
                   if (typeof sendId == 'boolean') {
                      view.model.set('fid', 1);
                   } else {
                    view.model.set('fid', $App.getCurrentFid());// 订阅新开标签model由于没执行appView.on("showMailbox"事件，model没有设置fid为当前文件夹ID，默认值为1
                   }
                   
                   var searchOptions = {
                            fid: $App.getCurrentFid(), 
                            exceptFids: [4], 
                            isFullSearch: 0, 
                            flags: { subscriptionFlag: 1 },
                            sessionEnable: sendId && typeof sendId != 'boolean' ? 0 : 2,
                            condictions: sendId && typeof sendId != 'boolean' ? 
                                         [{ field: "sendId", value: sendId, operator: "EQ" }] :
                                         [{ field: "sendId", value: 0, operator: "GT" }, { field: "sendId", value: '9223372036854775807', operator: "LT" }]
                   };
                            
                   view.prepareSearch(searchOptions);
                   if (!sendId || typeof sendId == 'boolean') { sendId = 0; }

                   //重置变量
                   view.model.set("isVipMode", false);
                   view.model.set("isTaskMode", false);
                   view.model.set("isTaskbacklogMode",false);
                   view.model.set("isTaskdoneMode",false);
                   view.model.set("isContactsMail", false);

                   $App.showPage({ name: "mailsub_" + sendId, view: view });
               },
               //注：获取当前邮件列表视图，只适用于邮件列表
               getCurrentView: function () {
                   return this.getMailboxView();
               },
               isMailbox:function(){
                   var current = this.getCurrentTab();
                   if (current.name.indexOf("mailsub") >= 0 || current.name.indexOf("mailbox") >= 0) {
                       return true;
                   }
                   return false;
               },

               // 该方法不适用于读信页
               // 需对读信页做特殊处理
               getMailboxView: function () {
                   var current = this.getCurrentTab();
                   if (current && current.name.indexOf("mailsub") >= 0) {
                       return current.view;
                   } else {
                       return this.getView("mailbox");
                   }
               },
               /**
               *打开文件夹
               *@param {Number} fid 文件夹id，1收件箱，2草稿箱，3已发送，4已删除，8我的账单
               */
               showMailbox: function (fid, isOpenFolder) {
                   var view = this.getView("mailbox");
                   if (fid > 1) {
                       view=this.getView("mailbox_other")
                   }

                   if (fid == 8) {
                       this.showBill(2);
                       return;
                   } else if (fid == 9) {
                       this.showSubscribe();
                       return;
                   }


                   if (this.getView("folder").model.isLock(fid)) {//检查文件夹是否加锁，
                       if (!this.getView("folder").model.get("passwordChecked")) { //未验证过密码
                           this.showUnlock(fid);
                           return;
                       }
                   }
                   view.model.set("pageIndex", 1); //重置为第1页
                   view.model.set("isSearchMode", false); //重置为非搜索状态
                   view.model.set("isVipMode", false);
                   view.model.set("isTaskMode", false);
                   view.model.set("isContactsMail", false); //重置往来邮件模式
                   view.model.set("IamFromLaiwang", false); //重置往来邮件模式

                   this.trigger("showMailbox", { fid: fid,view:view });
               },
               doCommand: function (commandName, options) {
                   if (!options) { options = {}; }
                   options.command = commandName;
                   $App.trigger("mailCommand", options)
               },
               showUnlock: function (fid, mid) {
                   new M2012.Folder.View.Unlock({ fid: fid, mid: mid || null, model: this.getView("folder").model }).render();
               },
               getLayout: function () {
                  var layout = $App.getMailboxView().model.get("layout");
                  // FIX:收件箱多标签后读信页获取model不准确
                  // 这里根据“读信页签对应必是list布局”进行校正
                  if ($App.getCurrentTab().name.indexOf('readmail_') > -1) {
                      layout = 'list';
                  }
                   return layout;
               },
               flipPage: function (direction, callback) { //邮件列表翻页
                   this.getView("mailbox").toolbarView.flipPage(direction, callback);
               },
               searchMail: function (options) {
                   var view = this.getView("mailbox_other");
                   view.prepareSearch(options);
                   //往来邮件搜索更多的时候，把当前邮件的邮箱地址传递
                   if(arguments[1]){
                       view.model.set("isContactsMailAndTheEmailIs", arguments[1]);
                   }
                   if(options.isVip){
	                   BH("vip_mail_load");
                   }
                   if (options) {
                       // options.order && view.model.set("order", options.order);
                       view.model.set("isVipMode", options.isVip ? true : false);
                       view.model.set("isTaskMode", options.isTaskmail ? true : false);
                       view.model.set("isTaskbacklogMode", options.isTaskmail && options.flags.taskFlag == 1 ? true : false);
                       view.model.set("isTaskdoneMode", options.isTaskmail && options.flags.taskFlag == 2 ? true : false);
                       view.model.set("isContactsMail", options.isContactsMail ? true : false);
                   }
                   this.trigger("showMailbox", { fid: 1,isSearch:true,view:view }); //文件夹fid传1只是为了避免非空检测，实际搜索的fid条件=0
                   //this.getView("mailbox").searchMail(keyword);
               },
               searchVip: function () {
                   this.getMailboxView().model.searchVip();
               },
               searchTaskmail: function (options) {
                   this.getMailboxView().model.searchTaskmail(options);
               },
               getMailDataByMid: function (mid) {
                   var result = this.getMailboxView().model.getMailById(mid);
                   if (!result) {
                       result = (this.getView("mailbox").model.getMailById(mid) || this.getView("mailbox_other").model.getMailById(mid))
                   }
                   return result;
               },
               getFreshMail: function (count, callback, options) {
                   return this.getMailboxView().model.getFreshMail(count, callback, options);
               },
               /**
               *根据标签id获得我的标签数据对象
               *@param {Number} tagsId 标签的id，即fid
               */
               getTagsById: function (tagsId) {
                   return this.getView("folder").model.getTagsById(tagsId);
               },
               /***
               *根据颜色id获取我的标签颜色值
               *@param {Number} color
               *@returns {String} 返回#xxxxxx的颜色值
               */
               getTagColor: function (color) {
                   return this.getView("folder").model.getColor(color);
               },
               /***
               *判断自定义文件夹是否可被POP
               *@returns {Boolean} 
               */
               checkCustomFolderPopFlag: function () {
                   var custom = $App.getFolders("custom")[0];
                   if (custom && custom.pop3Flag == 1) {
                       return true;
                   } else {
                       return false;
                   }
               },
               /***
               *设置当前标签页的标题
               *@param {String} title 标题
               */
               setTitle: function (title,name) {
                   this.getView("tabpage").setTitle(title,name);
               },
               setIcon: function (state) {
                   $App.getView("tabpage").tab.setStateIcon(this.getCurrentTab().name, state);
               },
               /***
               *设置透明层
               *@param {obj} id 透明层的外层容器
               *@param {obj} item 和透明层同级的容器 需要减去它的高度
               */
               setOpacityLayer: function (id, item) {
                   var itemHeight = 0;
                   if (item) {
                       var paddingTop = item.css("paddingTop");
                       paddingTop = paddingTop.replace("px", "");
                       var paddingBottom = item.css("paddingBottom");
                       paddingBottom = paddingTop.replace("px", "");
                       itemHeight = item.height() + parseInt(paddingTop) + parseInt(paddingBottom);
                   }
                   var height = id.height() - itemHeight;
                   var top = id.css("paddingTop");
                   top = top.replace("px", "");
                   top = parseInt(top) + parseInt(itemHeight);
                   var len = id.find(".blackbanner").length;
                   var html = '<div style="top: {0}px; height:{1}px; z-index:10; " class="blackbanner"></div>';
                   html = $T.Utils.format(html, [top, height]);
                   if (len == 0) {
                       id.append(html);
                   }

               },
               showChannel:function(name){
                   this.getView("tabpage").showChannel(name);
               },
               /***
               * 获取当前的标签页数据对象
               */
               getCurrentTab: function () {
                   return this.getView("tabpage").model.getCurrent();
               },
               //得到指定的标签页对象
               getTabByName: function (key) {
                   return this.getView("tabpage").model.getModule(key);
               },
               //使指定的标签页失效，切换时重绘
               validateTab: function (name) {
                   var tab;
                   if (name) {
                       tab = $App.getTabByName(name);
                   } else {
                       tab = $App.getCurrentTab();
                   }
                   if (tab) {
                       tab.isRendered = false;
                   }
               },
               registerChannel: function (tabName, renderFunc) {
                   this.getView("tabpage").registerChannel(tabName, renderFunc);
               },
               /***
               * 关闭当前标签页
               */
               close: function (name) {
                   return this.getView("tabpage").close(name);
               },

               /***
               * 关闭指定标签页
               */
               closeTab: function (tabName) {
                   return this.getView("tabpage").close(tabName);
               },
               activeTab:function(tabName){
                   return this.getView("tabpage").activeTab(tabName);
               },
               clearTabCache:function(tabName){
                   return this.getView("tabpage").clearTabCache(tabName);
               },
               closeAllTab: function () {
                   return this.getView("tabpage").closeAllTab();
               },
               getCurrentFid: function () {
                   return this.getCurrentView().model.get("fid");
               },
               /***
               *根据文件夹id获取文件夹数据对象
               *@param {Number} fid 文件夹id
               *@returns {Object}
               */
               getFolderById: function (fid) {
                   return this.getView("folder").model.getFolderById(fid);
               },
               /***
               *获取文件夹列表，此函数必须要等文件夹加载后才可调用。
               *@param {String} type 文件夹类型：1.system系统文件夹 2.custom 自定义文件夹  3.tag 标签文件夹　4.pop 代收文件夹
               *@returns {Array} 特定的文件夹列表
               */
               getFolders: function (type) {
                   return this.getView("folder").model.getFolders(type);

               },
               getFolderType: function (fid) {
                   return this.getView("folder").model.getFolderType(fid);
               },

               getFolderByFolderName: function (name) {
                   return this.getView("folder").model.getFolderByFolderName(name);
               },

               /***
               *创建文件夹
               *@param {String} folderName 文件夹名称  
               *@param {String} from 发件人邮件地址，创建分类规则   
               *@param {Boolean} dealHistoryMail 是否对历史邮件分拣
               *@returns {Object} 文件夹信息
               */
               addFolder: function (folderName, from, callback) {
                   return this.getView("folder").model.addFolder(folderName, from, callback);
               },

               /***
               *批量创建文件夹
               *@param {String} folderNames 文件夹名称  
               *@param {function} callback 
               */
               addFolders: function (folderNames, callback) {
                   return this.getView("folder").model.addFolders(folderNames, callback);
               },

               /***
               *创建标签
               *@param {String} tagName 标签名称  
               *@param {String} from 发件人邮件地址，创建分类规则   
               */
               addTag: function (tagName, color, from, callback) {
                   return this.getView("folder").model.addTag(tagName, color, from, callback);
               },

               /***
               *验证文件夹名称
               *@param {String} folderName 文件夹名称  
               */
               checkFolderName: function (folderName, obj) {
                   return this.getView("folder").model.checkFolderName(folderName, obj);
               },
               checkTagName: function (tagName, obj) {
                   return this.getView("folder").model.checkTagName(tagName, obj);
               },
               /**
               * 判断是否代收文件夹
               * @param {number} fid 文件夹id
               */
               isPopFolder: function (fid) {
                   return this.getView('folder').model.isPopFolder(fid);
               },
               /**是否是标签文件夹
               */
               isTagFolder: function (fid) {
                   return this.getView('folder').model.isTagFolder(fid);
               },
               getAddrNameByEmail: function (email) {
                   return $App.getModel("contacts").getAddrNameByEmail(email);
               },
               /***
               *判断是否会话模式
               */
               isSessionMode: function () {
                   var userAttrs = $App.getConfig("UserAttrs");
                   if (userAttrs) {
                       return userAttrs.sessionMode == 1 ? true : false;
                   } else {
                       return false;
                   }
               },

               /**
               * 判断是否会话文件夹
               * 非会话文件夹：已发送(3),草稿箱（2）已删除（4）垃圾邮件（5）保留文件夹（10）
               * 非会话文件夹：我的标签
               */
               isSessionFid: function (fid) {
                   var notSessionFids = [2, 3, 4, 5, 10];
                   var flag = true;

                   if ($.inArray(fid, notSessionFids) > -1 || !fid) {
                       flag = false;
                   }

                   if (flag && $App.getFolders('tag')) {
                       var tagsFolders = $App.getFolders('tag');
                       $.each($App.getFolders('tag'), function (index, val) {
                           if (tagsFolders[index].fid == fid) {
                               flag = false;
                               return false;
                           }
                       });
                   }

                   return flag;
               },

               /** 判断是否会话邮件mid */
               isSessionMid: function (mid) {
                   var flag = false;
                   if (mid) {
                       var data = $App.getMailDataByMid(mid) || null;
                       if (data && data.mailNum && data.mailNum > 1) {
                           flag = true;
                       }
                   }
                   return flag;

               },

               /** 新窗口读信 */
               openNewWin: function (mid) {
                   /*var url = 'http://' + location.host + '/m2012/html/newwinreadmail.html?t=newwin&mid='+mid;
                   window.open(url); 
                   */

                   var url = 'http://' + location.host + '/m2012/html/newwinreadmail.html?t=newwin&mid=' + mid;
                   var r = document.documentElement; //防止窗口被浏览器拦截
                   var f = document.createElement("form");
                   f.target = "_blank";
                   f.method = "get";
                   $(f).append('<input type="hidden" name="t" value="newwin" />');
                   $(f).append('<input type="hidden" name="mid" value="' + mid + '" />');
                   $(f).append('<input type="hidden" name="sid" value="' + $App.getSid() + '" />');
                   r.insertBefore(f, r.childNodes[0]);
                   f.action = url;
                   f.submit();

               },

               /**
               * 读信模式切换
               * @param {number} mode 0 - 设置标准模式  1 - 设置会话模式
               */
               setReadMailMode: function (mode, callback, onerror) {
                   var options = { flag: mode };
                   M139.RichMail.API.call("mbox:setSessionMode", options, function (result) {
                       if (result.responseData.code && result.responseData.code == 'S_OK') {
                           top.$App.setConfig("UserAttrs", "sessionMode", mode);
                           var userAttrs = top.$App.getConfig("UserAttrs");
                           userAttrs.sessionMode = mode;
                           callback && callback(mode);
                       } else {
                           if (onerror && result.responseData) {
                               onerror(result.responseData.code);
                           }
                           ;
                       }
                   });
               },
               /**
               * 回复 / 回复全部
               * @param type 0-回复 1-回复全部
               * @param mid 原信ID
               * @param withAttach 是否带附件回复  'true'-是 'false'-否
               */
                   /**
                 * 回复 / 回复全部
                 * @param type 0-回复 1-回复全部
                 * @param mid 原信ID
                 * @param withAttach 是否带附件回复  'true'-是 'false'-否
                 */
               reply: function (type, mid, withAttach) {
                   var params = {};
                   var replyType = 'reply';
                   if (type === 1) {
                       replyType = 'replyAll';
                   }
                   params.type = replyType;
                   params.mid = mid;
                   params.withAttach = withAttach;
                   params.lastTabName = $App.getCurrentTab().name;
                   params.userAccount = top.$User.getDefaultSender();

                   var tabName = $App.getCurrentTab().name;
                 
                   this.show('compose', params);
                   this.getView("tabpage").replace(tabName, $App.getCurrentTab().name);
               },
                   /**
                   * 转发
                   * @param mid 原信ID
                   */
               forward: function (mid) {
                   var params = {};
                   params.type = 'forward';
                   params.mid = mid;
                   params.lastTabName = $App.getCurrentTab().name;

                   //add by zsx 把代收邮件的账户传入
                   if (arguments[1] && arguments[1]["userAccount"]) {
                       params.userAccount = arguments[1].userAccount;
                   }

                   // 获取当前tab的name（新开标签后tabname会发生变化）
                   // 判断是否需要是替换当前标签（新开标签后model和view会发生变化）
                   // 这两个操作必须放在新开标签前
                   var tabName = $App.getCurrentTab().name;
                   var isReadMail = this.isReadMail();
                   var isReadSessionMail = this.isReadSessionMail();

                   this.show('compose', params);
                   if (isReadMail && !isReadSessionMail) {
                       this.getView("tabpage").replace(tabName, $App.getCurrentTab().name);
                   }
               },

               isReadMail: function() {
                  var curTab = $App.getCurrentTab();
                  return curTab.name.indexOf("readmail") > -1;
               },

               isReadSessionMail: function() {
                  var curTab = $App.getCurrentTab();
                  var curView = $App.getCurrentTab().view;
                  var covMailList = curView && curView.$el && curView.$el.find('#covMailSummaryList')[0];

                  // 普通模式下根据'#covMailSummaryList'元素是否存在进行判断
                  var condition1 = curTab.name.indexOf("readmail") > -1 && covMailList;
                  // 分栏模式下根据'#covMailSummaryList'元素是否存在进行判断
                  var condition2 = $('#readWrap').find('#covMailSummaryList')[0];
                  // 普通模式下还可以根据当前所读邮件下是否包含多封邮件进行判断（弥补'#covMailSummaryList'元素尚未创建的情况，用于toolbar）
                  var condition3 = curTab.name.indexOf("readmail") > -1 && curView.model.get('total') > 1;
                  if( condition1 || condition2 || condition3) {
                      return true;
                  } else {
                      return false;
                  }
               },
               /**
               * 作为附件转发
               * @param mid 原信ID
               * @param subject 原信主题
               */
               forwardAsAttach: function (mid, subject) {
                   var params = {};
                   params.type = 'forwardAsAttach';
                   params.ids = mid;
                   params.subject = subject;
                   params.lastTabName = $App.getCurrentTab().name;
                   //add by zsx 把代收邮件的账户传入
                   if(arguments[2] && arguments[2]["userAccount"]){
                   		params.userAccount = arguments[2].userAccount;
                   }
                   var tabName = $App.getCurrentTab().name;
                   var isReadMail = this.isReadMail();
                   var isReadSessionMail = this.isReadSessionMail();

                   if (isReadMail && !isReadSessionMail) {
                       setTimeout(function () {
                           $App.closeTab(tabName);
                       }, 500);
                   }
                   this.show('compose', params);
               },
               /**
               * 恢复草稿
               * @param mid 原信ID
               */
               restoreDraft: function (mid) {
                   var params = {};
                   params.type = 'draft';
                   params.mid = mid;
                   this.show('compose', params);
               },
               /**
               * 编辑邮件再次发送
               * @param mid 原信ID
               */
               editMessage: function (mid) {
                   var params = {};
                   params.type = 'resend';
                   params.mid = mid;
                   this.show('compose', params);
               },
               /**
               * 发送电子名片
               * @param sd
               */
               sendVcard: function (sd) {
                   var params = {};
                   params.type = 'vCard';
                   params.sd = sd;
                   this.show('compose', params);
               },
               /**
               * 打开写信页同时显示大附件上传框
               */
               uploadLargeAttach: function () {
                   var params = {};
                   params.type = 'uploadLargeAttach';
                   this.show('compose', params);
               },
               getAttrs: function (attrName) {
                   var attrs = $App.getConfig("UserAttrs");
                   var attrs2 = $App.getConfig("UserAttrsAll");
                   if (attrs && attrs[attrName]) {
                       return attrs[attrName];
                   } else if (attrs2 && attrs2[attrName]) {
                       return attrs2[attrName];
                   } else {
                       return "";
                   }


               },
               setAttrs: function (attrList, callback) {
                   var data = {
                       attrs: attrList
                   };
                   $RM.setAttrs(data, function (result) {
                       if (result["code"] == "S_OK") {
                           var attrs = $App.getConfig("UserAttrsAll");
                           for (elem in attrList) {
                               attrs[elem] = attrList[elem];
                           }
                           if (callback) { callback(result); }
                       }
                   });
               },
               /*获取rm自定义字段，如果字段不存在返回为空
               注：为保持规范，所有的自定义字段要在此注释中声明
               unfold:文件夹折叠状态*/
               getCustomAttrs: function (key) {//获取自定义字段

                   var v = this.getAttrs("_custom_" + key); //rm后台存储以_custom_为前缀
                   if (v) {
                       return v.trim();
                   } else {
                       return "";
                   }
               },
               /*设置rm自定义字段*/
               setCustomAttrs: function (key, val, callback) {//设置自定义字段
                   var realKey = "_custom_" + key;
                   var data = {};
                   if (val == "") { val = " " };//避免后台报错
                   data[realKey] = val;
                   this.setAttrs(data, callback);
               },
               /**
               *打开套餐升级引导
               */
               showOrderinfo: function () {
                   BH('show_orderinfo');
                   window.open("/m2012/html/set/feature_meal_guide/index.html?sid=" + $App.getSid());
               },
               /***
               用于修改os_user_config表的记录
               configId在数据库中是以整型定义的，重构接口时为了适应未来，接口定义为key和value的形式，在服务端做映射
               key值与configId的映射如下：
       
               // config=1用户天气预报显示的地区
               public final static String WEATHER_AREA = "WeatherArea";
       
               // config=7用户登录的时候上次选择的版本号
               public final static String LOGIN_VERSION = "LoginVersion";
       
               // config=8用户已经设置了固定密码
               public final static String CONSTANT_PASSWORD = "ConstantPassword";
       
               // config=9用户已经屏蔽了显示密码设置的向导
               public final static String PASSWORD_GUIDE = "PasswordGuide";
       
               // config=11：用户是否欠费，ConValue1=0表示不欠费，=1表示欠费
               public final static String IS_OWN_USER = "IsOwnUser";
       
               // config=13 新用户向导
               public final static String SHOW_NEW_USER_GUIDE = "ShowNewUserGuide";
       
               // config=14用于短信,判断是否设置了不再提示推荐邮箱伴侣
               public final static String PARTNER_PROMOTE_SMS = "PartnerPromoteSms";
       
               // config=15用于彩信,判断是否设置了不再提示推荐邮箱伴侣
               public final static String PARTNER_PROMOTE_MMS = "PartnerPromoteMms";
       
               // config=17标准版换肤
       
               public final static String SKIN = "Skin";
       
               // config=19记录用户换肤标识
               public final static String SKIN_FLAG = "SkinFlag";
               // config=20 新邮件到达提示设置
               public final static String NEW_MAIL_TIPS = "NewmailTips";
               // config=21是否保存下发短信
               public final static String SAVE_SMS = "SaveSms";
               // config=22自定义功能入口
               public final static String CUSTOM_APP = "CustomApp";
               // config=23 最后一次邮件代收时间
               public final static String LAST_POP_DATE = "LastPopDate";
       
               // config=27邮箱换号记录
               public final static String CHANGE_NUMBER_RECORD = "ChangeNumberRecord";
       
               // config=29冻结用户
               public final static String IS_FREEZE_USER = "IsFreezeUser";
               // config=31高级活跃需求
       
               public final static String USER_CUSTOM_INFO = "UserCustomInfo";
               // config=32短信双通道
       
               public final static String DUAL_CHANNEL = "DualChannel";
               // config=33不安全密码登录
               public final static String UNSAFE_PASSWORD = "UnsafePassword";
               // config=34tips使用
               public final static String GUIDE_TIPS = "GuideTips";
               // config=35 异步注册请求受理：1-受理 0-受理后已登录
               public final static String REGISTER_SYNC_RESULT = "RegisterSyncResult";
               // config=36 外网用户注册设置问题
               public final static String EXTERNAL_QUESTION = "ExternalQuestion";
               // config=37 外网用户注册设置问题对应的答案
               public final static String EXTERNAL_ANSWER = "ExternalAnswer";
               // config=38外网用户注册设置的邮箱地址
               public final static String EXTERNAL_EMAIL = "ExternalEmail";
               // config=39标准版2.0的换肤属性
               public final static String SKIN_PATH2 = "SkinPath2";
               // config=600通讯录的隐私设置
               */
               setUserConfigInfo: function (key, val, callback) {
                   M139.RichMail.API.call("user:setUserConfigInfo", { configTag: key, configValue: val },
                               function (result) {
                                   if (callback) { callback(result); }
                               }
                           )
               }
           });
   },
   getUserConfigInfo: function (key, type) {
       key = key.toLowerCase();
       var data = $App.getConfig('UserData').mainUserConfig;
       if (data[key] && data[key].length == 2) {
           if (type == undefined) {
               return data[key][1];
           } else {
               return data[key][type];
           }
       } else {
           return "";
       }
   },
   setMailTips: function (value) {
       this.setUserConfigInfo("newmailtips", value);
       this.getMainData()
   },
   getUserCustomInfo: function (key) {
       try {
           var text = top.$App.getUserConfigInfo("usercustominfo");
       } catch (e) {
           return;
       }
       if (text) {
           var reg = new RegExp("(?:^|&)" + key + "=(\\d+)");
           var match = text.match(reg);
           if (match) {
               return match[1];
           }
           return;
       }
       return;
   },
       /*
       设置os_userconfig表中configId=31的数据，以json方式传值，支持任意类型的key和value，
       注意key和value中不能包含&符号，调用成功后才会触发callback.
      $App.setUserCustomInfoNew({userName:"golden sky",age:32},
          function(result){
            console.warn(result.mainUserConfig.usercustominfo)
          }
      );
 
       */
   setUserCustomInfoNew: function (json, callback) {
       var config = $User.getUserConfig();
       var oldData = {};
       if (config && config["usercustominfo"] && config["usercustominfo"].length>1) {
           oldValue = config["usercustominfo"][1];
           if (oldValue.indexOf("&") == 0) {
               oldValue = oldValue.substring(1);
           }
           oldData = $T.Url.getQueryObj("?" + oldValue);
       } else if (config && !config["usercustominfo"]) {//数据加载成功，但是usercustominfo从未写入过
           oldData = {};
       } else { //容错，如果用户数据未加载时不写入，避免值被覆盖
           return;
       }

       var newData = $.extend(oldData, json);
       var self = this; 
       this.setUserConfigInfo("usercustominfo", $T.Url.urlEncodeObj(newData), function () {
           self.getMainData(callback);
          
       });
   },
   setUserCustomInfo: function (key, value, callback) {
       var self = this;
       var newValue = "";
       var isRightParam = !isNaN(key) && !isNaN(value) && key >= 0 && key <= 101 && value >= 0 && value <= 9;
       //var oldValue = $User.getUserConfig()["usercustominfo"][1] || "";
       var oldValue = '';
       if ($User.getUserConfig() && $User.getUserConfig()["usercustominfo"] && $User.getUserConfig()["usercustominfo"][1]) {
           oldValue = $User.getUserConfig()["usercustominfo"][1];
       } else { //容错，如果用户数据未加载时不写入，避免值被覆盖
           return;
       }
       if (isRightParam) {
           var reg = new RegExp("(?:^|&)" + key + "=\\d+");
           if (reg.test(oldValue)) {
               var newValue = oldValue.replace(reg, "&" + key + "=" + value);
           } else {
               var newValue = oldValue + "&" + key + "=" + value;
           }

       };
       self.setUserConfigInfo("usercustominfo", newValue);
       self.getMainData()
       if (callback) { callback() }
       return value;
   },
   onResize: function () {
       var fv = $App.getView("folder");
       if (fv) {
           fv.resizeSideBar();
       }
       //var mainHeight = $(document.body).height() - $("#div_main").offset().top;
       var mainHeight = $D.getWinHeight() - $("#div_main").offset().top;//写死性能高
       var currentModule = this.getCurrentTab() && this.getCurrentTab().name;
       if ($B.is.ie && $B.getVersion() <= 8 && currentModule && (currentModule == 'mailbox_1' || currentModule.indexOf('mailsub_') > -1 || currentModule.indexOf('readmail_') > -1)) {
          $("#div_main:eq(0)").height(mainHeight - 4); //减去的5是框架边框的高度
       } else {
          $("#div_main:eq(0)").height(mainHeight - 5); //减去的5是框架边框的高度
       }

       this.getView("tabpage").resize();

       // 透明皮肤的背景图片需要动态计算大小
      var subOffsetTop = $("#div_main").offset().top || 0;
       var winW = $D.getWinWidth() > 1280 ? $D.getWinWidth() : 1280;
       var winH = winW * 0.625;
       $('#skinBgImg').css({width: winW, height: winH});
       if ($User.getSkinName().indexOf('_clarit') > -1) {
            $('#skinBgSub').height($D.getWinHeight() - subOffsetTop);
       }
       $(".skinBody").css({width: winW, height: $D.getWinHeight(),overflow: 'hidden'});
   },
   /**在tabpageview中显示指定的view,传入对象的name表示模块英文名（唯一），view为指定的view
   * @example 
   * $App.showPage({name:"readmail_"+mid,view:readmailView})
   */
   showPage: function (pageObj) {
       var m = this.getView("tabpage").model;
       var prevModule = null;
       //1.未创建过  2.像写信页这种多实例模块，每次无条件重新创建新模块
       if (!m.existModule(pageObj.name) || pageObj.mutiple) {
           m.createModule(pageObj);
       } else {
           var module = m.getModule(pageObj.name);
           module.view = pageObj.view; //替换为新生的view
           module.isRendered = false; //需要刷新
           if (pageObj.name.indexOf("mailsub") >= 0) {
               this.disposeView(pageObj.name);//邮件列表多实例，清除原来的事件绑定，避免多次绑定
           }
           //pageObj.view.render.call(pageObj.view,true);//如果已存在则重新渲染
       }
       //m.set("isRendered", true);
       prevModule = m.get("currentModule");
       if (pageObj.name == prevModule) {
           m.set("currentModule", null); //先置为空才能触发改变
       }
       m.set("currentModule", pageObj.name, pageObj.group);
       this.trigger("showPage", { "name": pageObj.name, "prev": prevModule });
   },
   disposeView: function (name) {
       view = $App.getTabByName(name).view;
       if (view) {
           $(view.el).off();
           view.undelegateEvents();
       }
   },
   /**
   * 根据key值在tagpage中显示一个iframe页，此函数已不再使用，为了兼容而保留，请调用show，
   */
   showFrame: function (key) {
       var frameView = new FrameView({ parent: this.getView("tabpage") });

       this.showPage({ name: key, view: frameView });

   },
   showUrl: function (url, title,group) {
       var frameView = new FrameView({ parent: this.getView("tabpage"), url: url, title: title });
       this.showPage({ name: "frame_" + Math.random(), view: frameView ,group:(group || title)});
   },
   showHtml: function (html, title) {
       var frameView = new FrameView({ parent: this.getView("tabpage"), html: html, title: title });
       this.showPage({ name: "frame_" + title, view: frameView });

   },

   openThirdParty: function (key) {
       var link = FrameModel.getLinkByKey(key);
       var url = link.url;
       url += url.indexOf("?") > -1 ? "&sid=" : "?sid=";
       url = SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent(url) + "&comeFrom=" + link.comefrom + "&sid=" + top.sid;
       window.open(url);
   },

   //封装云邮局订阅接口
   //传参特殊，@param必须是json格式的字符串，如‘{"comeFrom":503,"columnId":38530}’
   subscribe:function(param){
      var url = top.getDomain('image') + "subscribe/inner/bis/subscribe?sid=" + top.sid;
      M139.RichMail.API.call(url, param); //自动订阅
   },
   
   /***
   * 根据key值在tagpage中显示一个iframe页,param将会转化为页面的get参数
   * @param {String} key 注册的标签键值
   * @param {Object} param 加往iframe的url get参数
   * @param {Object} options 选项参数集合
   * @param {Object} options.inputData 传递数据集合给子页面
   */
   show: function (key, param, options) {
        var options = options || {};
		var link = FrameModel.getLinkByKey(key);
		var pageOp = null, frameView = null;

		if (link) {
            if (link["target"] == "_blank") {
                window.open(link.url);
            } else {
                frameView = new FrameView({ parent: $App.getView("tabpage"), param: param, inputData: options.inputData });
	            pageOp = {
	                name: key, view: frameView, title: link["title"], group: link["group"],
	                channel: link["channel"], mutiple: link["mutiple"], data: options
	            };
	            if (options && options.title) {
	                pageOp.title = options.title;
	            }
	            this.showPage(pageOp);
            }
        }
    },

   /**
   * 系统发信给自己
   * @param {Object} options 
   * @param {String} options.from  系统邮箱帐号
   * @param {String} options.subject 邮件标题
   * @param {String} options.content 邮件内容
   */
   mailToMe: function (options, callback) {
       if (options.subject && options.content) {
           M139.RichMail.API.call("user:mailToMe", options, function (response) {
               callback && callback(response.responseData.code);
           });
       }
   },

   /**
   * 获取附件下载路径
   * @param {Object} file  
   * @param {String} file.mid 附件id
   * @param {String} file.offset 附件offset
   * @param {int} file.size 附件大小
   * @param {String} file.name 附件名称
   * @param {String} file.encode 附件编码
   * @param {int} file.attachType 附件类型
   * @example 
   * $App.getDownLoadUrl({
   mid:'xxx',
   offset:'xxx', 
   size:'xxx', 
   type:'xxx', 
   encoding:'xxx',  
   });    
   */
   getDownLoadUrl: function (file) {
       if (file) {
           var url = "/RmWeb/view.do";
           return M139.Text.Url.makeUrl(url, {
               func: 'attach:download',
               mid: file.mid,
               offset: file.offset,
               size: file.size,
               name: encodeURIComponent(file.name),
               sid: $App.getSid(),
               type: file.attachType,
               encoding: file.encode
           }) + '&name=' + encodeURIComponent(file.name); //filename用makeurl用IE下载会乱码
       } else {
           return '';
       }
   },

   jumpTo: function (key, options) {
       var embedList = ["attachlist", "greetingcard", "postcard", "sms", "mms", "fax", "diskDev", "quicklyShare", "calendar", "groupMail", "dingyuezhongxin", "addrWhoAddMe", "addrWhoWantAddMe","health"];
       if ($App.getSiteConfig("embedRelease") && $.inArray(key, embedList) >= 0) {//内嵌版的增值业务
           if (key == "sms" || key == "mms") {
               if (!$User.checkAvaibleForMobile()) {
                   return;
               }
           }
           
           if(key === "quicklyShare"){
           		var isOldDisk = options && options.isOldDisk;
	       		if(top.SiteConfig.isQuicklyShare && isOldDisk != 'true'){
	       			$App.show("quicklyShare", options);
	       		}else{
	       			$App.show("quicklyShareOld", options);
	       		}
	       		return;
	       }
	       
	       if(key === "diskDev"){
	       		if(top.SiteConfig.isDiskDev){
	       			$App.show("diskDev", options);
	       		}else{
	       			$App.show("diskDevOld", options);
	       		}
	       		return;
	       }

           $App.show(key, options);
           return;
       }
       if (key == "voiceMail") { this.showBill(4); return;}
       //精品订阅特殊处理
       if (/jpdy/gi.test(key)) {
           $App.show(key, options);
           return;
       }

       //老版本的设置生日
       if (key == "baseData") {
           $App.show("account", { anchor: "basePersonalInfo" });
           return;
       }

       var url = "/main.htm?func=global:execTemp&sid=" + $App.getSid() + "&id=" + key + "&fromM2012=1";
       var flag = $App.getCustomAttrs('jumpFlag');
       if (options) {
           url = M139.Text.Url.makeUrl(url, options);
       }
       if (flag != '') {
           window.open(url);
       } else {
           $Msg.confirm(
                   '标准版2.0尚在Beta阶段，您将进入标准版(旧版)的对应功能页面。确定要进入标准版(旧版)的对应功能页面吗？',
                   function () {
                       window.open(url);
                       if ($('#checkJump:checked').length > 0) {
                           $App.setCustomAttrs('jumpFlag', 1);
                       }
                       return false;
                   },
                   {
                       dialogTitle: '页面跳转',
                       icon: "warn"
                   }
               );
           //插入节点
           var checkHtml = '<input type="checkbox" id="checkJump" /> <label for="checkJump">不再提示</label>';
           $('.BottomTip').html(checkHtml);
       }


   },

   /** 控制读信的高度 */
   readmailResize: function (mid) {
       var iframe = $('iframe[id=mid_' + mid + ']');
       if (iframe) {
           var h = iframe.contents().height();
           iframe.height(h);
       }
   },

   /** 获取当前读信mid */
   getCurrMailMid: function () {
       var mid = null;
       var tabname = $App.getCurrentTab().name;
       if (tabname.indexOf('readmail_') > -1) {
           mid = tabname.split('_')[1];
       }
       var splitrmtop = $('#readWrap .readMail-left'); //上下
       var splitrmleft = $('#readWrap .mailSectionWrap'); //左右
       if (splitrmtop.length > 0 && splitrmtop.attr('id')) {
           mid = splitrmtop.attr('id').split('_')[1];
       }
       if (splitrmleft.length > 0 && splitrmleft.attr('id')) {
           mid = splitrmleft.attr('id').split('_')[1];
       }
       return mid;
   },

   /** 快捷键回复 */
   keyReply: function (e, win) {
       /*if (!e.shiftKey) {
       return;
       }*/


       //如果是在输入框输入，不触发快捷键
       var target = e.target;
       if (/input|textarea/i.test(target.tagName)) {
           return;
       } else if (win && win.location.href.indexOf("blank.htm") > -1) {
           //编辑器输入也不触发
           return;
       }

       var keycode = e.keyCode;
       var mids = [];
       var currmid;


       //快捷回复
       var args = {
           attach: false,
           command: "reply",
           mids: mids,
           all: false
       };
       if (e.shiftKey && keycode == 65) { //shift+a
           currmid = $App.getCurrMailMid();
           currmid && mids.push(currmid);
           args.all = true;
       }
       if (e.shiftKey && keycode == 82) { //shift+r
           currmid = $App.getCurrMailMid();
           currmid && mids.push(currmid);
       }

       mids.length > 0 && $App.trigger("mailCommand", args);

       //快捷写信
       if (e.shiftKey && keycode == 67) { //shift+c
           $App.show('compose');
       }

       //搜索快捷键 "/"
       if (keycode == 191) { // /
           var tb_mailSearch = $("#tb_mailSearch");
           if ($B.is.firefox) { //火狐浏览器默认搜索快捷键为 /
               tb_mailSearch.focus();
               setTimeout(function () {
                   var val = tb_mailSearch.val();
                   tb_mailSearch.val(val.substring(0, val.length - 1));
               }, 0);
           } else {
               setTimeout(function () {
                   tb_mailSearch.focus();
               }, 0);
           }
       }
   },

   openDialog: function (title, className, options) {
       if (!options) { options = {} }
       if (!M2012["View"]) {
           M2012["View"] = {};
       }
       if (eval(className)) {
           loadCallback();
       } else {
           M139.core.registerJS(className, "richmail/dialog/" + className.toLowerCase() + ".js");
           M139.core.requireJS([className], loadCallback);
       }
       function loadCallback() {
           //var view = eval("new " + className + "(options)");
           var view_class = eval(className);
           var view = new view_class(options);
           if (view.button1Click) {
               var button1Click = function () {
                   view.button1Click.call(view);
               }
           }

           options.dialogTitle = title;
           var dialog = $Msg.showHTML(view.render(), button1Click, null, null, options);
           view.dialog = dialog;
           view.el = dialog.el;
           if (view.onRender) { view.onRender(); }


       }
   },

   /**
   *判断是否已超时
   *@returns {Boolean}
   */
   isSessionOut: function () {
       return !!this.get("sessionOut");
   },

   /**
   *检查是否超时，并弹出重新登录对话框
   */
   checkSessionOut: function () {
       var sessionOut = this.isSessionOut();
       if (sessionOut) {
           this.showSessionOutDialog();
       }
       return sessionOut;
   },

   /**
   *设置状态为超时
   */
   setSessionOut: function () {
       this.showSessionOutDialog();
       this.set("sessionOut", true);
   },

   /**
   *显示超时，要重新登录的对话框(js是异步加载的，所以不是马上弹出)
   */
   showSessionOutDialog: function () {
       if (M2012.UI.Dialog.SessionOut) {
           showDialog();
       } else {
           M139.core.utilCreateScriptTag({ src: "/m2012/js/ui/dialog/m2012.ui.dialog.sessionout.js" }, showDialog);
       }
       function showDialog() {
           //防止一次弹多个
           if (!$App.get("sessionOutDialogShow")) {
               $App.set("sessionOutDialogShow", true);
               new M2012.UI.Dialog.SessionOut().render().on("remove", function () {
                   $App.set("sessionOutDialogShow", false);
               });
               
           }
       }
   },
   
    /**
   *options为{func:function(){}}形式，用于点击绑定的异步调用
   */
   showOauthDialog: function(options){
       if (M2012.UI.Dialog.BindOauth) {
           showDialog();
       } else {
           M139.core.utilCreateScriptTag({ src: "/m2012/js/ui/dialog/m2012.ui.dialog.bindoauth.js" }, showDialog);
       }
       function showDialog() {
           if (!$App.get("showOauthDialogShow")) {
               $App.set("showOauthDialogShow", true);
               new M2012.UI.Dialog.BindOauth(options).render().on("remove", function () {
                   $App.set("showOauthDialogShow", false);
               });
           }
       }

   },

   /**
   *http请求M139.RichMail.API.call()返回后调用
   */
   onHttpClientResponse: function (client, res) {
       if (res && res.responseData && res.responseData.code && res.responseData.code != "S_OK") {
           var errorCode = res.responseData.errorCode;
           var code = res.responseData.code.toLowerCase();
           var summary = res.responseData.summary;
           //2011,2012 = 基础邮箱超时
           //S_FALSE = 中间件超时
           if (errorCode == "2011" || errorCode == "2012" || code == "fa_invalid_session" || (summary && summary.indexOf("RMKEY") > -1)) {
               //|| code == "s_false"
               //超时
               this.setSessionOut();
           }
           //上报日志
           M139.Logger.sendClientLog({
               level: "ERROR",
               name: "RichMailHttpClient",
               url: client.requestOptions.url,
               errorMsg: "Not Response S_OK",
               responseText: res.responseText
           });
       }
       /*
       //监测到sid不一致
       var OsSSOSid="";
       var userData=Utils.getCookie("UserData");
       if(userData && userData.indexOf("ssoSid")>=0){
       OsSSOSid=Utils.getCookie("UserData").match(/ssoSid:['"](.+?)['"]/)[1];
       }
       */
   },
   // 自适应  返回写信页iframe
   getComposeIframe: function () {
       var iframes = $(".main-iframe");
       for (var i = 0; i < iframes.length; i++) {
           var iframe = iframes[i];
           if ($(iframe).attr('src').indexOf('compose') > -1) {
               return iframe;
           }
       }
   },

   /** 读写信图片缩放工具栏 */
   showImgEditor: function (doc) {
       var imgs = doc.find("img");
       if((imgs && imgs.length > 0)){
       if (window.ImgEditorMenu) {
           ImgEditorMenu.mouseEvent(doc);
       } else {
               window.setTimeout(function(){
           M139.core.utilCreateScriptTag({
               id: "imgeditor",
               src: "/m2012/js/richmail/readmail/m2012.readmail.imgeditormenu.js",
               charset: "utf-8"
           }, function () {
               ImgEditorMenu.mouseEvent(doc);
           });
               },1000);
           }
       }
   },

   /** 获取系统帐号 */
   getSysAccount: function () {
       return ['subscribe@139.com', 'homemail@139.com', 'admin@139.com', 'postmaster@139.com', 'idea@139.com', 'antispam@139.com', 
       'ued@139.com', 'mail139@139.com', 'uec@139.com', 'service@139.com', 'mail139_holiday@139.com', 'kefu@139.com', 'administrator@139.com', 
       'hostmaster@139.com', 'webmaster@139.com', 'club@139.com', 'port@139.com', 'mail139_vip@139.com', 'szlvsechuxing@139.com', 
       'subscribe-topic@139.com', 'care@139.com'];
   },

    /** 获取会话邮件切换到完整模式内容 */
    getSessionDataContent:function(){
        var sessionData = top.M139.PageApplication.getTopApp().sessionPostData,
            content = '';
        if( sessionData && sessionData.content ){
            content = sessionData.content;
        }
        M139.PageApplication.getTopApp().sessionPostData = null; //清空
        return content;
    },

    /**
       获取body的高度 又确保不引发重绘
    */
   getBodyHeight: function () {
       var h;
       if (window.innerHeight) {
           h = window.innerHeight;
       } else {
           var welcome = document.getElementById("welcome");
           if (welcome && welcome.tagName == "IFRAME") {
               var frameH = parseInt(welcome.style.height);
           }
           if (frameH) {
               h = frameH + 112;
           } else {
               h = $D.getWinHeight();
           }
       }
       return h;
   },
  closeWriteOkPage: function() {
      var tabs = $App.getView('tabpage').tab.tabs;
      for (var tabName in tabs) {
          if (tabName.indexOf('compose_') > -1 && $App.getTabByName(tabName).data.status) {
              $App.closeTab(tabName);
          }
      }

   },
       /**判断当前是否为写信新窗口*/
   isNewWinCompose: function () {
       var t = top.$T.Url.queryString("t");
       if (t == 'win_compose' && top.location.hash.indexOf("newwin_done") == -1) {
           return true;
       } else {
           return false;
       }
   },

   /**写信新窗口还原成完整界面*/
   closeNewWinCompose: function (needShowNewWinComposeLink) {
       needShowNewWinComposeLink && this.trigger("closeNewWinCompose");
       if (this.isNewWinCompose()) {
           top.location.hash = "#newwin_done";
           setTimeout(function () {
              $('#logoArea').removeClass('Loading_Hidden_Top');
              $('#main').removeClass("main_write").addClass('main');
              $('#sub, #divTab, #header').show();
              $('#top').children().show()
              $('#top>a:first').attr('href', 'javascript:$App.show("welcome");').css('cursor', 'pointer');
           }, 100);
       }
   }


}));

})(jQuery, Backbone, _, M139);