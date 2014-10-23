﻿(function(){
    window.onload = function(){
     var mailboxModel = new top.M2012.Mailbox.Model.Mailbox();
    
        mailboxModel.getBillTypeList(function( result ){
            if ( result["var"] ) {
                var bills=result["var"]; 
                for (var i = 0, m = bills.length; i < m; i++) {
                    var initStatus = bills[i].status;
                    var initBusinessType = parseInt( bills[i].businessType , 10 ) ; 
                    if (initBusinessType === 11) { 
                            $("#ask_wrapper").show();
                    }
                }
            }
        });   
    };   

    function getDate(){
        var toDate = new Date();
        var FullYear = toDate.getFullYear(); //取当前年份
        var toMonth = toDate.getMonth() + 1; //取当前月份
        var toHao = toDate.getDate(); //取当前是几号
        var months = [];
        var years = [];
    //  var toMonth = 4 ; 测试用
        years = [FullYear, FullYear, FullYear];
        if(toHao < 20){
            months = [toMonth - 4,toMonth - 3,toMonth - 2];
        }else{
            months = [toMonth - 3,toMonth - 2,toMonth - 1];
        }
        for(var i =0; i < 3; i++){
            if(months[i] < 1){
                months[i] = months[i] + 12;
                years[i] = years[i] - 1;
            }
        }
        
        return {year: years, months: months};
    }
    
    function transDate(month){
        return month < 10 ? '0' + month : '' + month;
    }
    
    function getWhichHasOrder(callback){
        $RM.call("bill:getBatterypitcherBill",null,function(res){
        //  console.log(res);
            if(res["responseData"]["code"] == "S_OK"){
                callback && callback(res["responseData"]["billDates"]);
            }else{
                callback && callback([]);
            }
        });
    }

    function getHtmlContent(callback2){
        var date = getDate();
        var years = date.year;
        var months = date.months;
        var html = "";
        getWhichHasOrder(function(res){
            for(var len = months.length - 1, i = len; i >= 0; i--){
                var check= "";
                if(i == 2){
                    check = "checked='checked'";
                }
                var disabled = "";
                var dateValue = years[i] + transDate(months[i]);
                if($.inArray(dateValue, res) > -1){
                    disabled = "disabled='disabled' checked='checked'";
                }
                html +='<span class="mr_10"><input type="checkbox" value='+ dateValue +' name="month" id="month'+ i +'" '+ check + disabled +' class="mr_5"  /><label for="month'+ i +'">'+ years[i] +'年'+ months[i] +'月</label></span>\n';
            }
            callback2 && callback2(html);
        });
    }
 function alertCallback(){
        getHtmlContent(function(html){
            var htmlAlter = "<div id='htmlAlter' style='padding: 18px;'><p style='font-size: 14px;'>请选择需要补投话费账单的月份：</p><div style='padding: 10px 0px'>"+html+"</div></div>";
            top.$Msg.showHTML(htmlAlter,
            function(e){
                var checklist = top.$("#htmlAlter input[name='month']:checked:not(':disabled')");//选中的未被禁用的复选框
                var checklistValue =[];
                for(var i = 0; i < checklist.length; i++){
                    checklistValue.push(checklist.eq(i).val());
                }
                if(checklistValue.length == 0){
                    top.$Msg.alert("请至少选择一个补投月份。");
                    e.cancel = true;
                    return false;
                }
                top.$RM.call("bill:batterypitcherBill",{ billDate: checklistValue.join(",") },function(res){
                    if(res["responseData"]["code"] == "S_OK"){
                    //  for(var j = 0; j < checklistValue.length; j++){
                        //  top.$Cookie.set({name : checklistValue[j], value: checklistValue[j], expires: $Date.getDateByDays(new Date(), 7)});
                    //  }
                        top.$Msg.alert("您的话费账单补投申请已受理。我们会尽快为您安排补投，届时请留意“我的账单”新邮件。");
                    }else{
                        top.$Msg.alert("补投申请提交失败，请稍候再试。");
                    }
                });
            },
            function(){
            console.log("do nothing!");
            },
            {
                dialogTitle:'话费账单补投申请',
                buttons:['确定','取消'],
                width: 400,
                height: 80
            });
        });
    }
M139.namespace("M2012.Mailbox.View", {
    Toolbar: Backbone.View.extend({
        events: {
            "click #btn_unread": "onUnreadBtnClick",
            "click #popWriteMail": "onPopWriteMailClick",
            "click #syncPOPAccount": "onSyncPopAccountClick",
            "click #file_mail": "onFileMailClick",
            "click #classify_mail": "onClassifyMailClick",
            "click #classify_mail2": "onClassifyMailClick",
            "click #clean_mail": "onCleanMailClick",
            "click #btn_markUnread": "onMarkUnreadClick",
            "click #btn_deleteUnread": "onDeleteUnreadClick",
            "click #btn_deleteAllOrdinary": "onDeleteAllOrdinaryClick",
            "click a#btn_setting" : "onMailBoxSettingClick",
			"click a#btn_contactMailsTotal" : "onContactMailsTotalClick" ,
            /**
             * @2014-7-7 add by wn
             * 申请补投事件注册
             */
            "click a[data-ask]" : "onAskClick"
        },
        tipTemplate:['<div id="filterTip" class="tipsLayer filterTip" style="top:100px;left:450px;z-index:150;">',
                        '<div class="tipsLayerMain">',
                            '<div class="tipsLayerMainInner tipsLayerMainInner-singleLineTxt">',
                                '邮件太多？ <a href="javascript:" onClick="return false" class="classify_mail toclassify_mail" bh="mailbox_history"><span id="toclassify_mail" >试试创建收信规则</span></a>吧!',   
                            '</div>',
                        '</div>',
                        '<i class="i-tipsLayerArrow tipsBottomArrow"></i>',
                        '<a href="javascript:" id="closetip2" class="closeTipsLayerBtn closetip" title="关闭"><i class="i-closeTipsLayer"></i></a>',
                    '</div>'].join(""),
        initialize: function (options) {
            //alert("hello");
            var self = this;
            this.setElement(options.el);
            this.model = options.model;

            this.model.on("mabilbox_render", function (data) {
                var view = $App.getCurrentView().toolbarView;//多实例，找到当前的列表
                view.renderHeader();
                if (!data) {  //生成分页
                    data = view.model.get("mailListData");
                }
                view.createPager(data);
                //    self.renderSubscribeListIco();我的订阅打开的时候，不要需那两个模式
            });

            $App.on("refreshCount", function () { //监听刷新未读数
                self.refreshCount();
            })

            //add by zhangsixue
            $("#queryDelMessage").live("click", function () {
                BH({ key: 'set_pop_delquery' });
                top.$App.show('selfSearch', { type: 1 });
            })
            $("#daishoujiluchaxun").live("click", function () {
                BH({ key: 'set_pop_querylist' });
                top.$App.show('selfSearch', { type: 2 });
            })


        },
		onAskClick : function(){
            alertCallback();
        },
		/** 精品阅读模式 */
		renderSubscribeListIco:function(){
			var fid = this.model.get("fid");
			if(fid !== 9){return}
			if($(this.el).find('span.changeIco')[0]){return} //避免重复渲染
			var html = ['',
				'<span class="fl changeIco" style="margin:2px 20px 0 0">',
				'<a href="javascript:$App.show(\'myCloudSubscribe\');" class="readModel mr_10" title="在线阅读模式"></a>',
				'<a href="javascript:;" class="listModel listModelBlue" title="邮件列表模式"></a>',
				'</span>'].join('');				
				$(this.el).find('div.toolBarArray').prepend(html);
		},
		
		setTitle: function () {
		    var fid = this.model.get("fid");
		    var clearTabLogo = true;
		    //var clusterLogoInterval;
		    if ($App.getCurrentTab().name.indexOf("mail") != 0) { return; }//当前不是邮件列表
		    if (!this.model.get("subscribeName")) {
		        if (!this.model.get("isSearchMode")) { //搜索模式
		            var folderInfo = this.model.getFolderInfo(fid);
		            if (folderInfo) {
		                this.model.set("messageCount", folderInfo.stats.messageCount); //给model赋值邮件总数，在列表里会用到
		                $App.setTitle(folderInfo.name);
		            }
		        } else {
		            //var searchOptions = this.model.get("searchOptions");
		            if (this.model.isStarMode()) {
		                $App.setTitle("星标邮件");
		            } else if (this.model.isVipMode()) {
		                $App.setTitle("VIP邮件");
		            } else if (this.model.isBillMode()) {
		                $App.setTitle("服务邮件");
		            } else if (this.model.isSubscribeMode()) {
		                if (this.model.isClusterList()) {
		                    clearTabLogo = false;
		                }
		                var title = this.model.get("from");
		                title = title ? $Email.getName(title) : "订阅邮件";
		                $App.setTitle(title);
		            } else if (this.model.isTaskMode()) {
		                $App.setTitle("待办任务");
		            } else if (this.model.get('isContactsMail')) {
		                $App.setTitle("往来邮件");
		            } else if (this.model.isUnreadMode()) {
		                $App.setTitle("未读邮件");
		            } else {
		                $App.setTitle("邮件搜索");
		            }
		        }
		    } else if (this.model.get("multiInstance")) { //多实例
		        var title = this.model.get("subscribeName");
		        title = title ? $Email.getName(title) : "订阅邮件";
		        $App.setTitle(title);
		    }
		},


		getBillCharge: function () {
		    return '';
		    var tabTitle = $App.getCurrentTab().title;
		    if (tabTitle != "收件箱") {  //无奈之举，除了这中文名，没一个属性是唯一的
		        return ''
		    }
		    if (!top.SiteConfig.billAllowProvince) {
		        return "";
		    }
		    var province = top.SiteConfig.billAllowProvince[top.$User.getProvCode()];
		    var billChargeBar = '';
		    if (province) {
		        billChargeBar = '<div id="billChargeBar" style="display:none" class="yellowTips mb_10"><p style="height:24px; line-height:24px">7×24小时话费充值、精准业务推荐办理、引领信息生活、专注用户服务，智能化邮箱营业厅打造服务新体验—<a href="javascript:top.$App.show(\'billCharge\',{ct:\'main\',ac:\'index\'});">立即体验</a>。</p><a href="javascript:" class="yellowTips_close">×</a></div>';
		    }
		    return billChargeBar;
		},


        render: function () {
            var self = this;
            var fid = this.model.get("fid");

            this.setTitle();

            var toolbarHtml = [//'<div class="inboxHeader" id="inboxHeader"></div> 
            '<div class="toolBar">',
                '<ul class="toolBarUl">',
            //'<li class="mr_10"></li>',
            //'<li class=""></li>',
            //'<li class="mr_10 ml-1"></li>',
                '</ul>',
                '<div id="maillist_pager"></div>',
                '<div class="toolBarArray fr mr_5 p_relative"> <a href="javascript:" class="one on" id="btn_more" style="display:none"></a><a href="javascript:" id="btn_setting" class="two"></a> </div>',
                '</div>'].join("");

            //帐单余额显示
            var billCharge = this.getBillCharge();
            toolbarHtml += billCharge;

            //邮件封数显示
            toolbarHtml+='<p id="inboxHeader" class="mb_5 ml_10 clearfix"></p>';

            //我的订阅文件夹列表头部导航
            var isMySubscription = false;
            var showMailApp = false;
            if (this.model.isSubscribeMode()) {
                isMySubscription = true;
                toolbarHtml += ['<div style="height:24px;display:none" class="yellowTips mb_10" style="" id="cloudMailApp">',
                '<p style="height:24px; line-height:24px"></p>',
                '<a class="yellowTips_close" id="CloseloudMailApp" href="javascript:">×</a>',
                '</div>'].join('');
            }


			

            //我的账单文件夹列表头部导航
            var billtypeFlag = false;
            /*		if(fid == this.model.get('specialFolderId').myBill || (this.model.get('isSearchMode') && this.model.get('billtype'))){
            billtypeFlag = true;
            }*/
            if (this.model.isBillMode()) {
                billtypeFlag = true;
            }
            if (billtypeFlag) {
                var state = ["", ""]
                var current = this.model.get("billTab");
                current = current ? current : 0; 
                
                state[current] = "class=\"on\"";
                 
                
                /**
                 * @2014-7-4 modified by wn
                 * 避免能说明当前tab的值被清空.
                 * 为何要清空 billTab ?
                 * 
                 */
                // this.model.set("billTab",null);
                var myBillTabHtml = [
                '<div class="biitab">',
                '<div class="tab setTab" id="billTab">',
                    '<div class="tabTitle">',
                        '<ul>',
                            
                            '<li ' + state[0] + '><a hidefocus="1" href="javascript:;" onclick="$App.showBill(2)"> <span>我的账单</span></a></li>',
                             '<li ' + state[1] + '><a hidefocus="1" href="javascript:;" onclick="$App.showBill(1)"> <span>我的服务</span></a></li>',
                            //@2014-7-3 modify by wn 下线账单管理       
                            // '<li> <a hidefocus="1" tabid="billManage" href="javascript:$App.show(\'billManager\');$App.closeTab(\'mailbox_' + fid + '\')"> <span>账单管理</span> </a></li>',
                            '<li> <a hidefocus="1" tabid="billManage2" href="javascript:$App.show(\'billLife\');"> <span>账单生活</span> </a></li>',
                            '<li ' + state[3] + '><a hidefocus="1" href="javascript:;" onclick="$App.showBill(4)"> <span>语音信箱</span></a></li>',
                        '</ul>',
                    '</div>',
                    '</div>',
                '</div>'].join('');
                toolbarHtml = myBillTabHtml + toolbarHtml;
            }

            /** 待办任务 */
            var taskSearchFlag = false;
            if (this.model.isTaskMode()) {
                taskSearchFlag = true;
            }
            if (taskSearchFlag) {
                var css1 = 'on';
                var css2 = '';
                if (!this.model.get('isTaskbacklogMode')) {
                    css1 = '';
                    css2 = 'on';
                }
                /*var taskTabHtml = [
               '<div class="tab setTab" id="taskTab">',
                   '<div class="tabTitle">',
                       '<ul>',
                           '<li class="' + css1 + '"><a hidefocus="1" href="javascript:;" onclick="$App.searchTaskmail();"><span>待办任务</span></a></li>',
                           '<li class="' + css2 + '"><a hidefocus="1" href="javascript:$App.searchTaskmail({flags:{taskFlag:2}});" bh="taskmail_finish"><span>已完成</span></a></li>',
                       '</ul>',
                   '</div>',
               '</div>'].join('');
                toolbarHtml = taskTabHtml + toolbarHtml;*/
            }

            var toolbar = $(toolbarHtml);
            this.el.innerHTML = "";
            this.$el.append(toolbar);

            //邮箱账单显示接口
            if (billCharge) {
                top.M139.Timing.waitForReady("top.$App.getConfig('UserData')", function () {
                    var isPop = top.$App.getConfig('UserData');
                    if (isPop && isPop.mainUserConfig && isPop.mainUserConfig.usercustominfo) {
                        var lastShowTime = top.$App.getUserCustomInfo('billCharge');
                        if (typeof lastShowTime == 'undefined') {
                            self.showBillCharge();
                        } else if (lastShowTime.length == 8) {
                            var now = top.M139.Date.getServerTime();
                            now.setDate(now.getDate() - 1);
                            now = $Date.format('yyyyMMdd', now);
                            if (lastShowTime < now) {
                                self.showBillCharge();
                            }
                        }
                    }
                });
                
            }

            //云邮局App入口
            if (isMySubscription) {
                this.isShowMailApp();
            }

            this.$el.attr('style', '*position: relative;*z-index: 2;zoom:1;'); //防止ie6遮盖
            /*if ($.browser.msie && $.browser.version <= 7) { //ie6,7的工具栏折行问题。
            $("#maillist_pager").css("width", "130px");
            }*/

            var self = this;
            var toolbar = toolbar.find("ul.toolBarUl"); //button menu的容器
            var readmailOption = null;
            if (self.model.get("layout") != "list") { //左右、上下布局需要显示读信的回复、转发等工具栏
                readmailOption = {
                    mid: null,
                    mail: self.model.get("mailListData")
                };
            }

            this.menu = new M2012.Mailbox.View.MailMenu({ el: toolbar, model: this.model, readmail: readmailOption });

            this.menu.render();

            if (fid == "9") {
                this.$el.find("#subscribeTab a[tabid!='']").click(function () { //精品订阅切换
                    var tabid = $(this).attr('tabid');
                    if (tabid) {
                        $App.close('mailbox_9');
                        $App.show(tabid);
                    }
                });
                this.$el.find('#subscribefreeback').attr('href', 'http://uec.mail.10086.cn/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=' + $App.getSid());
            }
            //邮件备份列表不显示设置按钮
            if(fid == "7"){
                this.$el.find("#btn_setting").hide();
            }
        },

        showBillCharge: function () {
            var self = this;
            self.$el.find('#billChargeBar').find('a.yellowTips_close').click(function () {
                self.$el.find('#billChargeBar').hide();
                now = $Date.format('yyyyMMdd', top.M139.Date.getServerTime());
                top.$App.setUserCustomInfoNew({ billCharge: now }, function (res) {
                    console.log(res);
                });
            });
            var billCharge = $App.get('billCharge');
            if (billCharge) {
                self._showBillCharge(billCharge);
            } else {
                $App.on("billChargeLoad",function(data){
                    self._showBillCharge(data);
                })
                /*
                top.M139.RichMail.API.call('mailoffice:getTipsinfo', {}, function (res) {
                    res = res.responseData;
                    if (res && res['code'] == "S_OK") {
                        var data = res['var'];
                        $App.set({ 'billCharge': data });
                        self._showBillCharge();
                    }
                }, { method: "GET" });*/

            }
        },

        _showBillCharge: function (data) {
            var self = this;
            if (!data) return;
            var billChargeBar = self.$el.find('#billChargeBar');
            var content = ['<p>' + data.tipsMsg,
                '<a class="ml_5" href="' + data.tipsUrl + '">' + data.tipsName + '</a>',
                '<a hidefocus="1" class="btnG ml_5" href="' + data.packageUrl + '"><span>' + data.packageName + '</span></a></p>',
                '<a href="javascript:" class="yellowTips_close">×</a>'].join('');
            billChargeBar.find('p').replaceWith(content);
        },

        createPager: function (data) {
            var self = this;

            this.$el.find("#maillist_pager").html(""); //先清除
            var pagerBottom = $($App.getCurrentTab().element).find("#maillist_pager_bottom");
            pagerBottom.html("");//先清除
            var pageCount =  this.model.get("fid") == 7 ? Math.ceil($App.getFolderById(7).stats.messageCount/this.model.get("pageSize")) : this.model.getPageCount(data);
            //var pageCount = this.model.getPageCount(data);
            //生成分页
            this.pager = M2012.UI.PageTurning.create({
                styleTemplate: 2,
                container: this.$el.find("#maillist_pager"),
                pageIndex: this.model.get("pageIndex"),
                maxPageButtonShow: 5,
                pageCount: pageCount
            });

            this.pager2 = M2012.UI.PageTurning.create({
                styleTemplate: 2,
                container: pagerBottom,
                pageIndex: this.model.get("pageIndex"),
                maxPageButtonShow: 5,
                pageCount: pageCount
            });

            function pageChange(index) {
                self.model.set("pageIndex", index);
                self.model.set("listPosition", 0);//重置滚动条
                self.parentView.listView.render(true);//$App.getView("mailbox").listView.render(true);           
                BH("mailbox_pager");
            }
            this.pager.on("pagechange", pageChange);
            this.pager2.on("pagechange", pageChange);
        },

        showMailApp:function(){
            var self = this;
            var content = $App.get('cloudMailAppContent');
            var cloudMailApp = self.$el.find("#cloudMailApp");
            if(content){
                cloudMailApp.show().find('p').replaceWith(content).show();
                $(window).trigger('resize');
            }else{
                $App.on('showCloudMailApp',function(options){
                    cloudMailApp.show().find('p').replaceWith(options.content);
                    $(window).trigger('resize');
                });
            }

            //设置显示频率，点击关闭后再不也显示
            cloudMailApp.find("a#CloseloudMailApp").click(function () {
                cloudMailApp.hide();
                top.$App.setUserCustomInfo(47, 2);
                $(window).trigger('resize');
            });

            //设置显示频率，一天只显示一次            
            var today = top.M139.Date.getServerTime();
            $Cookie.set({ 
                name: 'listCloudApp_' + top.UserData.UID, value: "1", 
                expires: top.$Date.getDateByDays(today, 1) 
            });
                        
        },

        //是否显示云邮局App
        isShowMailApp: function () {
            var self = this;
            top.M139.Timing.waitForReady("top.$App.getConfig('UserData')", function () {
                var isPop = top.$App.getConfig('UserData');
                if (isPop && isPop.mainUserConfig && isPop.mainUserConfig.usercustominfo) {
                    var showed = top.$App.getUserCustomInfo(47);                    
                    if (showed != '2') {//如果已经标示，再也不显示
                        var dayShowed = $Cookie.get('listCloudApp_' + top.UserData.UID);
                        if (!dayShowed) { 
                            self.showMailApp(); 
                        }                         
                    }
                }                
            })
        },

        //滑动翻页
        flipPage: function (direction, callback) {
            var self = this;
            var distinctIndex = this.model.get("pageIndex"); //目标页码
            if (direction == "next") {
                distinctIndex = distinctIndex + 1;
            } else if (direction == "prev") {
                distinctIndex = distinctIndex - 1;
            }
            this.pager.trigger("pagechange", distinctIndex);
            function dataComplate(args) {
                self.model.off("mabilbox_render", dataComplate);
                if (callback) {
                    callback(args);
                }
            }
            this.model.on("mabilbox_render", dataComplate);
        },

        addSelectFolderMenu: function (folderType) {
            /*var folderTypeName = "";
            if (folderType != 1 && folderType != 2) { //是自定义文件夹，代收，或tag
            //创建切换文件夹菜单
            var map = { 3: "custom", 5: "tag", "-3": "pop" };
            folderTypeName = map[folderType];
    
            } else {
            $("#btn_selectFolder").hide();//隐藏切换文件夹下拉箭头
            }*/


            var self = this;
            M2012.UI.PopMenu.createWhenClick({
                target: self.$el.find("#folderName"),
                items: this.model.getFolderMenuItems("all", { command: "open" }),
                onItemClick: function (item) {
                    $App.showMailbox(parseInt(item.args.fid));
                }
            });


        },
        refreshCount: function () {//刷新顶部数量
            var folderInfo = this.model.getFolderInfo(this.model.get("fid"));
            this.$el.find("#sp_unread").html(" " + folderInfo.stats.unreadMessageCount + " 封");
            //'<span id="sp_total">共 ', folderInfo.stats.messageCount, ' 封，</span>',
            var prefix = this.model.get('isContactsMail') ? ("与" + this.model.get('contactsEmail') + "的往来邮件&nbsp;") : "";
            this.$el.find("#sp_total").html(prefix+'共 ' + folderInfo.stats.messageCount + ' 封，');
        },

        onUnreadBtnClick: function () {
            var fid = this.model.get("fid");
            folderType = this.getFolderType();
            var options = { command: "viewUnread", "inherit": true };
            if (folderType == 5) { //标签
                options["fid"] = 0;
                options["label"] = [fid];
            } else {
                options["fid"] = fid;
            }
			if(this.model.get("IamFromLaiwang")){
				this.model.set("UnReadIamFromLaiwang",true);
				BH("rmcontact_clickUnreadMessage");//往来邮件未读 上报行为统计ID:104689
				this.model.set("UnReadMessageSTotalMessage",this.model.getFolderInfo().stats.messageCount);
			}
            $App.trigger("mailCommand", options);
        },

        onPopWriteMailClick: function () {
            var fid = this.model.get("fid");
            var folderInfo = this.model.getFolderInfo();
            var folderInfoName = { inputData: { userAccount: folderInfo.email } }
            $App.show('compose', null, folderInfoName);
        },
        
        //邮件代收入口
        onSyncPopAccountClick: function (e) {
            var self = this;
            var fid = this.model.get("fid");
            var folderInfo = this.model.getFolderInfo();
            var popId = folderInfo.popId;
            var jTarget = $(e.currentTarget);
            var options = {
                id: popId
            }
            var popReceive = this.model.get("popReceive");
            if (popReceive) {
                clearInterval(this.popTime)
            }
            this.model.set({ popReceive: true })
			var condition5 = '<img src="/m2012/images/global/loading.gif" width="16" height="16" /> 收取中 <span class="bl"><span class="fw_b black">{0}</span>/{1} </span>'; //正在收取代收邮件
            var html = $T.Utils.format(condition5, ["0", "0"]);
            jTarget.html(html);
            
            var condition6 = '<a bh="mailbox_pop_2" href="javascript:;">收取</a>'; //收取代收邮件的链接
            this.model.syncPOPAccount(options, function () {//代收邮件后每3秒刷新一次工具条，显示代收的进度
                self.popTime = setInterval(function () {
                    self.setIntervalPop(jTarget, condition6, condition5, popId, fid);
                }, "3000")
            });
        },
        //邮件归档入口
        onFileMailClick :function(){
            if (M2012.FileMail) {
                showDialog();
            } else {
                this.loadJsScript('filemail', 'filemail.html.pack.js', showDialog);
            }
            function showDialog() {
                M139.UI.TipMessage.show("正在加载中...");
                if ($("#filemailDialog").length < 1) {
                    var dialog = $Msg.showHTML("<div id='filemailDialog'></div>", null, null, null, {
                        dialogTitle: "邮件归档"
                    });
                    var filemailview = new M2012.FileMail.View({ el: '#filemailDialog' });
                    filemailview.model.set('dialog', dialog);
                    filemailview.initEvents();
                }
            }
        },
        
        //邮件分拣入口
        onClassifyMailClick :function(){
            if (M2012.ClassifyMail) {
                showDialog();
            } else {
                this.loadJsScript("classifymail", "classify.html.pack.js", showDialog);
            }
            function showDialog() {
                var maxFilterTotal = 100; //最大分拣规则
                var options = { filterFlag: 1 };
                top.M139.RichMail.API.call("user:getFilter_New", options, function (result) {
                    if (result && result.responseData && result.responseData.code === 'S_OK') {
                        if (result.responseData.filterTotal && result.responseData.filterTotal > maxFilterTotal) {
                            $App.show('type_new'); //跳到设置页
                        } else {
                            renderHtml();
                        }
                    } else {
                        $App.logger('[user:getFilter_New] return data error');
                        $Msg.alert('网络繁忙，请稍后重试！');
                    }
                });

                function renderHtml() {
                    M139.UI.TipMessage.show("正在加载中...");
                    if ($("#classifymailDialog").length < 1) {
                        var dialog = $Msg.showHTML("<div id='classifymailDialog' ></div>", null, null, null, {
                            dialogTitle: "快速创建收信规则",
                            width: 500
                        });
                        var classifymailview = new M2012.ClassifyMail.View({ el: '#classifymailDialog' });
                        classifymailview.model.set('dialog', dialog);
                        classifymailview.initEvents();
                    }
                }
            }
        },
        //邮件清理入口
        onCleanMailClick :function(){
            BH('mailbox_mailClean');
            if (M2012.CleanMail) {
                showDialog();
            } else {
                this.loadJsScript("cleanmail", "cleanmail.html.pack.js", showDialog);
            }

            function showDialog() {
                M139.UI.TipMessage.show("正在加载中...");
                if ($("#cleanmailDialog").length < 1) {
                    var dialog = $Msg.showHTML("<div id='cleanmailDialog' style='width:450px'></div>", null, null, null, {
                        dialogTitle: "邮件清理",
                        width: 452
                    });
                    var cleanmailview = new M2012.CleanMail.View({ el: '#cleanmailDialog' });
                    cleanmailview.model.set('dialog', dialog);
                    cleanmailview.initEvents();
                }
            }
        },
        //全部标已读
        onMarkUnreadClick: function () {
            var fid = this.model.get("fid");
            $App.trigger("mailCommand", { command: "markAll", fid: fid });
        },
        //全部删底删除未读
        onDeleteUnreadClick: function () {
            var fid = this.model.get("fid");
            $App.trigger("mailCommand", { command: "deleteAll", fid: fid });
        },
        //全部删除(普通删除，移到已删除文件夹)
        onDeleteAllOrdinaryClick: function () {
            var fid = this.model.get("fid");
            $App.trigger("mailCommand", { command: "deleteAllOrdinary", fid: fid });
        },

        onMailBoxSettingClick: function(){
            //收件箱有多个容器，要限定在当前文件夹中查找
            new M2012.Mailbox.View.MailSetting({ el: this.el }).render();
            BH("mailbox_setting");
        },
		onContactMailsTotalClick: function(){
			//往来邮件点击未读后，会显示全部多少封，点击全部后，要能显示全部
            var options = { command: "viewUnreadContactMails"};
			//do something
			BH("rmcontact_clickTotalMessage");//往来邮件，确定，上报行为统计ID:104690
            $App.trigger("mailCommand", options);
		},
        getFolderType: function () {
            var fid = this.model.get("fid");
            var folderInfo = this.model.getFolderInfo();
            var folderType = $App.getFolderType(fid);
            return folderType;
        },
        loadJsScript: function (id, src, callback) {
            //避免IE6重复加载
            if (id && $('#' + id)[0]) {
                callback && callback();
                return;
            }
            M139.core.utilCreateScriptTag(
            {
                id: id,
                src: src,
                charset: "utf-8"
            },
            function () {
                callback && callback();
            })
        },
        showClassifyTips: function() {
            var self = this;
            $("body").append(self.tipTemplate);
             $D.bindAutoHide({
                action:"click",
                element:$(".filterTip"),
                callback:function(){
                    $(".filterTip").remove();
                }
            });
            $(".toclassify_mail").click(function() {
                self.onClassifyMailClick();
                $(".filterTip").remove();
            })
            $(".closetip").click(function() {
                $(".filterTip").remove();
            })
            /*var template = [
                    '<div direction="bottom" top="10px">',
                        '邮件太多？',
                        '<a href="javascript:M2012.Mailbox.View.Toolbar.prototype.onClassifyMailClick();" onClick="M2012.Mailbox.View.Toolbar.prototype.onClassifyMailClick()" id="classify_mail2" bh="tipsclassify_onclick">试试创建收信规则</a>吧!',
                    '</div>'
                ].join('');
                operatetipsview.showTips([{'pageUrl':'index','positionId':'sp_total','elementId':'classify_mail','content':template}]);
            */
        },
        renderHeader: function () {
            var self = this;
            var fid = this.model.get("fid");
            var folderInfo = this.model.getFolderInfo();

            if ($App.getCurrentTab().title == '账单中心' && this.model.get('isSearchMode')) { //账单中心特殊处理
                var billtype = this.model.get('billtype');
                folderInfo["name"] = this.model.getBillTypeName(billtype) || '账单中心';
            }

            if (this.model.isTaskMode()) {
                folderInfo["name"] = this.model.get('isTaskbacklogMode') ? '待办任务' : '已完成';
            }

            if (!folderInfo) { return; } //容错
            var popId = null;

            popId = folderInfo.popId;
            var folderType = $App.getFolderType(fid); //folderInfo.type;
            var isContactsMail = this.model.get('isContactsMail')
            var prefix = isContactsMail ? ("与" + this.model.get('contactsEmail') + "的往来邮件，") : "";
            var headerHtml = [
            //'<strong id="folderName" bh="mailbox_folderDrop">', M139.Text.Html.encode(folderInfo["name"]),
            //'<i class="i_triangle_d" id="btn_selectFolder" bh="mailbox_folderDrop"></i>', '</strong>',
            '<span id="sp_total">', 
             prefix, 
            '共 '+folderInfo.stats.messageCount+' 封，', 
            '</span>',
            '<a href="javascript:" id="btn_unread" bh="mailbox_unread">未读邮件</a><span id="sp_unread"> ', folderInfo.stats.unreadMessageCount, ' 封</span>'];
            var searchFolder =$App.getMailboxView().model.get("searchOptions") ;
            if(fid === 2 || (searchFolder && searchFolder.fid === 2) || fid == 7) {//特殊处理草稿箱
                headerHtml = [ '<span id="sp_total">', prefix, '共 ', folderInfo.stats.messageCount, ' 封</span>'];

            };
            /**
            * 邮箱分类，归档，清理入口条件 
            * 邮箱清理：收件箱超过(>=)10000封邮件时唤出
            * 邮箱归档：收件箱超过(>=)10000封邮件且用户文件夹小于96个时唤出
            * 邮箱分类：收件箱超过499封且用户文件夹小于96个时唤出（待加：分类规则<100条）
            * 邮件代收：代收文件夹时加上邮件代收的工具条
            */
            var mcount1 = 199, mcount2 = 999 ,mcount3 = 9999 ,fcount = 96; //真实设置
            var folderInfoName = { inputData: { userAccount: folderInfo.email } }
            //var mcount1 = 10, mcount2 = 199, mcount3 = 299, fcount = 96; //测试数据
            var conditions = '';

            var condition0 = '，<a href="javascript:;"  id="btn_markUnread" bh="mailbox_markUnread">全部标为已读</a>|<a href="javascript:;" id="btn_deleteUnread" bh="mailbox_deleteUnread">彻底删除未读</a>';
            var condition1 = '，邮件太多， <a href="javascript:;" onClick="return false" id="classify_mail" class="classify_mail" bh="toolbarclassify_onclick">创建收信规则</a>吧!';
            //var condition2 = '，使用 <a href="javascript:;" onClick="return false" id="file_mail" bh="mailbox_mailFile">邮件归档</a><span class="line">|</span><a href="javascript:;" onClick="return false" id="classify_mail">邮件分类</a><span class="line">|</span><a href="javascript:;" onClick="return false" id="clean_mail">邮件清理</a> 为邮箱提速 '; //10000封以上且小于95个文件夹出现
            //var condition3 = '，使用 <a href="javascript:;" onClick="return false" id="clean_mail">邮件清理</a> 为邮箱提速 '; //>95个文件夹时且10000封以上出现
            var condition4 = '，<a href="javascript:;" bh="mailbox_pop_1" id="popWriteMail">写信</a><span class="line">|</span> <span id="syncPOPAccount"><a bh="mailbox_pop_2" href="javascript:;">收取</a></span><span class="line">|</span><span id="daishoujiluchaxun"><a href="javascript:;">代收记录查询</a></span> '; //文件夹为代收时出现
            //var condition5 = '<img src="/m2012/images/global/loading.gif" width="16" height="16" /> 收取中 <span class="bl"><span class="fw_b black">{0}</span>/{1} </span>'; //正在收取代收邮件
            //var condition6 = '<a bh="mailbox_pop_2" href="javascript:;">收取</a>'; //收取代收邮件的链接
            var condition7 = '<span class="inboxHeaderfr"><a bh="mailbox_pop_3" href="javascript:$App.show(\'addpop\')">添加</a><span class="line">|</span><a bh="mailbox_pop_4" href="javascript:$App.show(\'popmail\')" hidefocus="">管理代收邮箱</a></span>'; //代收工具条右侧的设置链接
            var condition8 = '，<a href="javascript:;" id="btn_deleteAllOrdinary">全部删除</a>';
			//往来邮件共多少封
			var condition9 = '，<a href="javascript:;" id="btn_contactMailsTotal">往来邮件</a> 共 {x} 封';
			var condition10 = '';

            var condition_custom = '<span class="inboxHeaderfr"><a href="javascript:$App.show(\'tags\')" hidefocus=""><i class="i_set"></i>&nbsp;管理文件夹</a></span>';
            var html_voice = '<span class="inboxHeaderfr"><a href="javascript:$App.show(\'voiceSetting\')" hidefocus=""><i class="i_set"></i>&nbsp;设置语音信箱</a></span>';;
            var condiction_autoDel = '<span>&nbsp;（邮件{0} 天后将{1}，去</span><a href="javascript:$App.show(\'preference_autoDelSet\')" hidefocus="">设置</a><span>）</span>';
            var condiction_delBack = '<span class="inboxHeaderfr"><a href="javascript:;" id="queryDelMessage">&nbsp;删信记录查询</a>&nbsp;|<a href="javascript:$App.showMailbox(7);">&nbsp;查看自动备份的邮件</a></span>';
            var html_vipmail = '<span class="inboxHeaderfr"><a href="javascript:$App.show(\'addrvipgroup\')" bh="manage_vip_contacts" hidefocus=""><i class="i_set"></i>&nbsp;管理vip联系人</a></span>';


            var mesCount = folderInfo.stats.messageCount;
            var filesCount = $App.getFolders('custom') ? $App.getFolders('custom').length : 0;

            var inboxHeader = this.$el.find('#inboxHeader:eq(0)');

            if (fid == 1 && folderInfo.stats.unreadMessageCount > 20) { //当未读邮件超过20封时出现，当满足其它条件时覆盖此条件
                conditions = condition0;
            }

            if (fid == 1 && mesCount > mcount1 && filesCount < fcount) {
                conditions = condition1;
            }
            
            if (fid == 1 && mesCount > mcount2 && (!$App.getCustomAttrs("filterTip")||$App.getCustomAttrs("filterTip") && $App.getCustomAttrs("filterTip").substr(0,1) == "0")) {
                self.showClassifyTips();
                var above9999 = $App.getCustomAttrs("filterTip").substr(1,1)||"0";
                $App.setCustomAttrs("filterTip","1"+above9999);          
            } else if(fid == 1 && mesCount < mcount2 && $App.getCustomAttrs("filterTip") && $App.getCustomAttrs("filterTip").substr(0,1) == "1") {
                var above9999 = $App.getCustomAttrs("filterTip").substr(1,1)||"0";
                $App.setCustomAttrs("filterTip","0"+above9999);          
            }
            if (fid == 1 && mesCount > mcount3 && (!$App.getCustomAttrs("filterTip")||$App.getCustomAttrs("filterTip") && $App.getCustomAttrs("filterTip").substr(1,1) == "0")) {
                self.showClassifyTips();
                var above999 = $App.getCustomAttrs("filterTip").substr(0,1)||"0";
                $App.setCustomAttrs("filterTip",above999+"1");          
            } else if(fid == 1 && mesCount < mcount3 && $App.getCustomAttrs("filterTip") && $App.getCustomAttrs("filterTip").substr(1,1) == "1") {
                var above999 = $App.getCustomAttrs("filterTip").substr(0,1)||"0";
                $App.setCustomAttrs("filterTip",above999+"0");          
            }
                  
         
            if (fid == 4) { //已删除
                conditions = $T.Utils.format(condiction_autoDel, [folderInfo.keepPeriod, "彻底删除"]);
                conditions = folderInfo.keepPeriod > 0 ? condiction_delBack+conditions : condiction_delBack;
            } else if (fid == 8 && folderInfo.keepPeriod > 0) { //账单
                conditions = $T.Utils.format(condiction_autoDel, [folderInfo.keepPeriod, "账单"]);
            } else if (fid == 9 && folderInfo.keepPeriod > 0) { //订阅
                conditions = $T.Utils.format(condiction_autoDel, [folderInfo.keepPeriod, "订阅"]);
            }
            if (folderType == -3) {//如果是代收邮件列表
                conditions = condition4;
                headerHtml.unshift(condition7)
            }
            if (folderType == 3) { //自定义文件夹
                headerHtml.unshift(condition_custom); //插入前面，否则ie6折行
            }
            if (this.model.isBillMode() && this.model.get("billTab") == 3) { //语音信箱
                headerHtml.unshift(html_voice);
            }

            if (this.model.get("isVipMode")) { //加入vip管理
                headerHtml.unshift(html_vipmail);
            }
			//搜索的时候，且不为往来邮件的时候
            if (this.model.isApproachMode() && mesCount > 0 && !self.model.get("IamFromLaiwang")) {

                conditions = condition8;
            }

            
			//搜索的时候，且为往来邮件的时候初始化
			if (isContactsMail && mesCount > 0 && self.model.get("IamFromLaiwang")) {
				console.log(self.model.get("searchOptions"));
                conditions = condition10;
            }
			//搜索的时候，且为往来邮件，且点了未读后显示的
			if(isContactsMail && mesCount >= 0 && self.model.get("UnReadIamFromLaiwang")){
				var UnReadMessageSTotalMessage = self.model.get("UnReadMessageSTotalMessage");
                headerHtml.splice(2,1);// 删除“共xxx封，”
                headerHtml.splice(3,1, "<span>未读邮件</span>");//往来邮件的时候，点击未读邮件后，未读邮件不可点
				condition9 = condition9.replace("{x}",UnReadMessageSTotalMessage); //显示之前的总封数
				conditions = condition9;
			}
            headerHtml.push(conditions);
            /**
             * @add by wn 2014-7-4
             * 控制补投显示
             */
            var bill_type = self.model.get("bill_type") ;
            if( bill_type === undefined || bill_type === "0" || bill_type === "10" ){
                headerHtml.push("<span id='ask_wrapper' style='display:none;'><span> 未收到移动账单?</span> <a style='color:red;' data-ask='true' href='#'>申请补投</a></span>");
            }
            
            var inboxHeader = this.$el.find('#inboxHeader:eq(0)');

            if (this.model.isTaskMode()) {
                inboxHeader.remove();
            } else {
                inboxHeader[0].innerHTML = headerHtml.join('');
            }            

            if (self.model.isBillMode() && mesCount == 0) {
                inboxHeader.hide(); //账单中心特殊处理
            }
            
            if (mesCount == 0) {
                // 邮件数量为0时隐藏全部邮件数/未读邮件数
                // 当右侧存在链接时需要显示链接
                if (inboxHeader.find('.inboxHeaderfr').length) {
                    inboxHeader.children().not('span.inboxHeaderfr').hide()
                    // 临时方案
                    inboxHeader.find('span.inboxHeaderfr').addClass('mt_10');
                } else {
                    inboxHeader.hide();
                }
            } else {// 临时方案
                inboxHeader.find('span.inboxHeaderfr').removeClass('mt_10');
            }
            this.addSelectFolderMenu(folderType); //添加文件夹打开菜单
        },

        //代收邮件时的进度计时器
        setIntervalPop: function (This, syncText, loadingText, popId, fid) {
            top.$App.trigger('reloadFolder', { reload: true });
            var self = this;
            var options = {
                status: 1,
                id: popId
            };
            this.model.getPOPAccounts(options, function (result) {
                if (result["code"] != "S_OK") {
                    This.html(syncText);
                    clearInterval(self.popTime)
                    return
                }
                var status = result["var"][0]["status"];
                if(!status){
                    clearInterval(self.popTime);
                    return false;
                }
                var totalMail = status["messageCount"];
                var receiveMail = status["receivedMessageCount"];
                if (status["code"] && status["code"] == "RUNNING" && status["messageCount"] != 0 && top.$App) {
                    var html = $T.Utils.format(loadingText, [receiveMail, totalMail]);
                    This.html(html);
                } else {
                    This.html(syncText);
                    clearInterval(self.popTime)
                }
            });
        }

})
});


})();