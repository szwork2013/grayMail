TabPageView =Backbone.View.extend({
    initialize: function(options){
        var model=new TabPageModel(options);
        this.model=model;
        this.el=options.container;
        var self = this;
        model.on("change:currentModule", function (model, val, group) {
            if (val != null) { //为了触发onchange，先设为null再设为null再设为目标值，所以会触发两次
                var currentModule = val;      //找到当前模块，执行当前模块的render
                try {
                    this.showModule(currentModule);
                    self.activeTab(currentModule);
                    self.renderChannel(currentModule);
                    // 控制标签管理菜单显示隐藏
                    if ($App.getView('tabpage').tab.count > 5) {
                        $('#tabsMenuIco').show();
                    } else {
                        $('#tabsMenuIco').hide();
                    }
                    // 【云邮寄模块】需要隐藏下拉三角、语音输入
                    $App.getView('top').setSearchBox(currentModule);
                    // 切换模块时改变搜索框的默认提示语
                    $App.getView('top').switchSearchBoxTips();
                    // 除欢迎页和邮件列表，其他模块的高度有调整，需要触发iframe变化
                    if ($('#' + currentModule).length) {
                        $('#' + currentModule).resize();
                    } else if (typeof group == 'string') {
                        $('#' + group).resize()
                    }

                    /*
                     * 子模块支持透明皮肤
                     */
                    var moduleName = $App.getCurrentTab().name;
                    var module = {
                        'addr': true,
                        'calendar': true,
                        'diskDev': true,
                        'googSubscription': true
                    }
                    var allowMailbox = function (name) {
                        var layout = $App.getMailboxView().model.get('layout');
                        return (name === 'mailbox_1' || name.indexOf('mailsub_') > -1) && layout === 'list';
                    }

                    // 欢迎页、收件箱透明化处理
                    // 欢迎页透明化处理需要2步：1-容器div_main背景透明化；2-iframe内引用皮肤样式
                    if (moduleName === 'welcome' || allowMailbox(moduleName)) {
                        $('#div_main').addClass('TransparentBg');
                    } else {
                        $('#div_main').removeClass('TransparentBg');
                    }

                    // 子模块透明化处理
                    // 1-移除容器div_main背景色；2-iframe内引用皮肤样式；3-调整左样式边栏（云邮局除外，因为云邮局iframe的高度没有变化）
                    if (module[moduleName]) {
                        $('#div_main').addClass('mainIframeBg_noBg');

                        if (moduleName !== 'googSubscription') {
                            $('#skinBgSub').addClass('skin_not');
                        } else {
                            $('#skinBgSub').removeClass('skin_not');
                        }
                    } else {
                        $('#div_main').removeClass('mainIframeBg_noBg');
                        $('#skinBgSub').removeClass('skin_not');
                    }

                    $App.onResize();
                } catch (ex) {
                    console.error(ex.message);
                }
                
                this.lastModule = currentModule;
                $App.closeWriteOkPage();
            }

        });
	
        this.tab=new TabLabel(document.getElementById("divTab"),this);
        this.tab.call = [this.onTabDelete, this.onTabActive, this.onTabClose];

        this.watchScrollbar();
	
    },
    el:null,//声明自己的容器
    template: "",
    orignTabs:null,
    events: {
        // "click .itemTitle":"changeTitle"
    },
    render:function (){
        var self=this;
    
        var currentModule = this.model.get("currentModule");
        if (currentModule) {
            this.activeTab(currentModule);
        }
    
   
    },
    setTitle:function(title,moduleName){
        //title=title.encode();
        if(!moduleName){
            moduleName=this.model.get("currentModule");
        }
        this.tab.title(moduleName,title);
        this.model.getModule(moduleName).title=title;
	
    },
    getVisibleCount: function () {
        return $("#divTab ul").find("li[tabid]:visible").length;
    },
    renderCloseAllButton: function () {
        var self = this;

	
    },

    /** 标签管理按钮 */
    renderMenuListButton:function(){
        var self = this;
        if($("#tabsMenuIco")[0]){
		
            return;
        }
        //setTimeout(function () {//异步执行
        $("#divTab ul").append('<li id="tabsMenuIco" class="noAll" tabindex="0"><a href="javascript:;" class="closeAll" title="点击查看更多"></a></li>');
        //},0);
    },
    //激活tab,会重复执行，以后优化
    //激活tab,会重复执行，以后优化
    activeTab: function (moduleName) {
        //alert("active:"+moduleName);
        if (this.tab.exist(moduleName)) {
            this.tab.active(moduleName);
        } else {	//如果tab不存在则创建
            this.createTab(moduleName);
        }
        try {
            $App.trigger("showTab", this.model.getModule(moduleName));
        } catch (ex) {
            //避免showtab事件中有异常，影响整个标签页切换
        }

    },
    replace:function(tabOld,tabNew){
        this.tab.replace(tabOld, tabNew);
    },
    //关闭指定标签页
    close:function(tabName){
        if(!tabName){
            tabName=this.model.get("currentModule");
        }
        this.tab.close(tabName);
    },
    //关闭全部标签页
    closeAllTab:function(){
        for (elem in this.model.pages) {
            if (elem != "welcome") {
                this.close(elem);
            }
        }
    },
    resize:function(){
        this.tab.size();
    },
    fixFlashRemove: function (tabName) {
        // 控制标签显示隐藏
        if ($.browser.msie && (tabName.indexOf("compose") >= 0 || tabName == "account"
                   || tabName == "mms" || tabName == "postcard") || tabName == "greetingcard" || tabName=="activityInvite"
                   || tabName == "quicklyShare" || tabName == "diskDev") { //特殊处理销毁flash时引发的异常__flash__removeCallback
            var module = this.model.getModule(tabName);
            if (module) {
                var elem = module.element;
                if($(elem).find("iframe")[0]){ //有些iframe还未打开
                    var flash = $("object", $(elem).find("iframe")[0].contentWindow.document);
                    if (flash.attr("classid") == "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000") {
                        flash.remove();
                    }
                }
            }
        
        }
    },
    //关闭当前标签页时触发的事件
    onCloseTab:function(tabName){
        var module = this.model.getModule(tabName);
        if (module) {
            this.fixFlashRemove(tabName);
            var elem = module.element;
            this.model.deleteModule(tabName);
            var iframe = $(elem).find("iframe");
            if (iframe.length > 0) {//释放iframe内存
                var frm = iframe.get(0);
                
                if (tabName.indexOf("compose_") >= 0) {
                    var childFrm = $("iframe", frm.contentWindow.document);
                    $(childFrm).each(function (i,n) {
                        n.src="about:blank";
                        $(n).remove();
                    });
                    
                }
                /*try {
                    frm.contentWindow.document.write('');
                    frm.contentWindow.document.clear();
                } catch (e) { };*/
                frm.src = "about:blank";
                frm.parentNode.removeChild(frm);
            }
            $(elem).remove(); //关闭标签时，清空dom内容回收内存
 
        
        

        }
	
        //    this.renderCloseAllButton();
        //this.renderMenuListButton(); //关闭时不用再调用了，因为是固定显示的
	
        /*var module;
            if(moduleName){
                module=this.modules[moduleName];
            }else{
                module=this.currentModule;
            }
            
            module.close=true;
            module.element.style.display="none";
            if (module.group != this.prevModule.group) {
                if(module==MM.currentModule){	//关闭的模块当前处于激活状态
                    //this.showModule(this.prevModule.name);
                }
                
            }
            return true;*/
    },
    clearTabCache:function(tabName){
        for (elem in this.model.pages) {
            var current = this.model.pages[elem];
            if (current.name.indexOf(tabName) >= 0) {
                current.isRendered = false;
            }
        }
    },
    createOrignTabs: function (orignTabs, view, isHeaderTab) {
        for (var i = 0; i < orignTabs.length; i++) {
            var key = orignTabs[i];
            if (key == "mailbox_1") {
                this.model.createModule({ view: $App.getView("mailbox"), name: "mailbox_1", title: "收件箱", group: "mailbox", deactive: true });
                this.createTab(key, true, isHeaderTab);
            } else {
                var link = window.LinkConfig[key];
                var obj = { name: key, view: view, title: link["title"], group: link["group"], mutiple: link["mutiple"], deactive: true }
                this.model.createModule(obj);
                this.createTab(key, true, isHeaderTab);
            }
        }

    },
    watchScrollbar: function () {
        if (($.browser.msie && $.browser.version < 8) || !$.browser.msie) {//只有IE8以上浏览器存在滚动条复位问题
            return;
        }
        var watchList = ["#sidebar", "#div_maillist", "#readmail_container", "#covMailSummaryList"]
        M139.Timing.setInterval("watchScrollbar", function () {
            for (var i = 0; i < watchList.length; i++) {
                var elems = $(watchList[i]);
                if (elems.length > 0) {
                    elems.each(function (i, n) {
                        if (!n.getAttribute("hasWatched")) {
                            console.log("start watch........",n);
                            M139.Timing.watchElementScroll(n);
                            n.setAttribute("hasWatched",true);
                        }

                    });
               
                }
            }
        },1000);
    },
channelOptions: {},
showChannel:function(channelName){
	
	// add by tkh 点击云邮局频道，如果有‘红点’触发更新消息状态的事件
	if(top.$App.pushMpostMsg){
		top.$App.trigger('updateMpostMsgStatus');
	}
	
	// add by tkh 邮箱顶层保留现场之后进入云邮局页面不会刷新，触发云邮局内部的事件刷新数据
	if(channelName === 'subscribe'){
		top.$App.trigger('renderMpostMailnotify');
	}
	
    var targetTab = "mail";
    if (this.channelOptions[channelName]) {
        targetTab=this.channelOptions[channelName].defaultTab;
    }
    var state=this.model.get("channelState");
    if (state[channelName] && state[channelName].current) {
        targetTab = state[channelName].current;
        if (this.tab.exist(targetTab)) {
            $App.activeTab(targetTab);
        } else { //容错，标签可能被自动关闭 
            if (this.channelOptions[channelName] && this.channelOptions[channelName].defaultTab) {
                $App.show(this.channelOptions[channelName].defaultTab);
            } else {
                $App.showMailbox(1);
            }
        }
    } else {    //未打开过该频道
        if (targetTab == "mail") { //邮件频道不用 app.show打开，要特殊处理下
            $App.showMailbox(1);
        } else {
            $App.show(targetTab);
        }
    }

},
registerChannel: function (name, options) {
    //renderFunc = (options && options.renderFunc) || "none";
    this.channelOptions[name] = options;

},
renderChannel: function (name) {
    var self = this;
    var folderLeft = $("#sub");
    function showMainFolder(show, remainWidth) {
        if (show) {
            $("#leftOther").hide();
            !$App.isNewWinCompose() && folderLeft.show();
            $("#main").css("left", "200px");
            var fv = $App.getView("folder");
            if (fv) {
                fv.resizeSideBar();//隐藏再显示后滚动条会重置，重设滚动条高度
            }
        } else {
            $("#leftOther").show();
            !$App.isNewWinCompose() && folderLeft.hide();
            var left = remainWidth ? "200px" : "0px";
            $("#main").css("left", left);
        }
    }
    function setTabVisible(channel) {
        // 控制顶部导航模块选中样式
        $("#toFixTabs [class=on]").removeClass();
        $("#toFixTabs [channel="+channel+"]").addClass("on");
        
        // 通讯录、日历、网盘模块高度需要调整
        /*
        if (channel == 'addr' || channel == 'calendar' || channel == 'disk') {
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }*/

        var op = self.channelOptions[channel];
        if (op && op.withinMail) { //在邮件频道显示
            $("#toFixTabs [channel=mail]").addClass("on");
        }
        if (op && op.hideTab) {
            $("#divTab ul").hide();
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $("#divTab ul").show();
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }
        for (elem in self.tab.tabs) {
            var t = self.tab.tabs[elem];
            var m = self.model.getModule(elem);
            if (!m) continue;

            var currentOp = self.channelOptions[m.group] ? self.channelOptions[m.group]:self.channelOptions[m.channel];//循环取频道设置
            if (channel == "mail" || (op && op.withinMail)) { //邮件模块
                if (currentOp) {//隐藏其它频道的标签
                    if (currentOp.hideTab == false) {
                        $(t).show();
                    } else {
                        $(t).hide();
                    }
                } else {
                    $(t).show();
                }
            } else if (channel == 'welcome' || channel == 'subscribe' || channel == "note") { // 为在欢迎页显示“收件箱”入口做的特殊处理
                channel = channel == 'welcome' ? 'mailbox' : channel;
                if (m.group == channel || m.channel == channel) {
                    $(t).show();
                } else {
                    $(t).hide();
                }
            } else {//其它的全隐藏。
                $(t).hide();
            }

        }
        // 调整tablabel数目为显示标签的数目
        self.tab.count = $('#divTab li:visible').not('#tabsMenuIco').length;
        if (self.prevChannel && self.prevChannel != channel) {//切换频道时因为时序问题，无法判断当前频道有几个标签，所以要再次调用resize。prevChannel是为了提高性能减少重复计算
            self.tab.size();
        }
        
        self.prevChannel = channel;
    }
    var module = this.model.getModule(name);
    var channelName = module.channel || module.group;//取模块的group或channel作为channel名称 
    
    if (this.channelOptions[channelName]) {
        this.model.saveChannelState(channelName,name);
        var leftNav = this.channelOptions[channelName].leftNav;
        if (leftNav == "none") { //iframe全部内容实现，不需要顶层的左侧导航
            showMainFolder(false);
            setTabVisible(channelName);
        } else if (leftNav == "mail") { //共用邮件channel的左侧导航
            showMainFolder(true, true);
            setTabVisible(channelName);
        } else {    //由top窗口创建左侧导航,目前暂未使用，未来预留
            showMainFolder(false, true);
            if (folderLeft.prev().attr("class") == "sub") {//已创建过
                folderLeft.prev().html(leftNav());
            } else {
                folderLeft.before("<div class=\"sub\" id=\"leftOther\">" + leftNav() + "</div>");
            }
        }

    } else {
        var visibleChannel = (name == "welcome" ? "welcome" : "mail");
        this.model.saveChannelState(visibleChannel,name);
        showMainFolder(true);

        setTabVisible(visibleChannel);
    }
},
//达到最大标签数处理,打开第26个标签时关闭第25个
maxTabHandler:function(){
    var maxTabsNum = this.model.get('maxTabsNum') || 23; //26 = 25 + 管理标签
    var lastTab;
    var lastTabId;
    this.tabContainer = this.tabContainer || $('#divTab ul');
    var $visibleTabs = this.tabContainer.find('li:visible').not('#tabsMenuIco');
    if( $visibleTabs.length >= maxTabsNum){
        lastTab = this.tabContainer[0].lastChild.previousSibling; //最后一个标签页
        lastTabId = lastTab.getAttribute('tabid');
        lastTabId && $App.closeTab(lastTabId);
    }
},

createTab: function (tabName, deactivate, isHeaderTab) {
    var mod = this.tab.exist(tabName);
    if (mod) {
        //this.tab.active(tabName);
        return;
    }

    try{
        this.maxTabHandler();        
    }catch(e){
        console.log(e);
    }


	var title=this.model.pages[tabName].title;
    var t = {
        name: tabName,
        text: title,
        group: this.model.pages[tabName].group
    };
    if (tabName == "welcome") {
        t.close = true;
    }	
    this.tab.add(t, deactivate, isHeaderTab);
},
//tab标签页点击叉号时触发，用于清除当前模块
onTabDelete:function(tabName){
	//因为同分组的tab替换时也会触发onTabDelete，所以只有未分组的module，才能直接删除模块
	/*var module=this.model.getModule(tabName);
    if(module.group==module.name){	//未分组的module
    	this.model.deleteModule(tabName);
    }else{	//分组的module，不做处理
    	
    }*/
    return ;
},
onTabActive:function(tabName){
//返回true表示激活tab成功
    this.model.set("currentModule",tabName);//设置当前模块，重要
    //this.model.showModule(tabName);
    return true;
},
onTabClose: function (name) { 
    var args = { cancel: false, name: name };
    try{
        $App.trigger("closeTab", args);
    } catch (ex) { }


    if (!args.cancel) { 
        this.onCloseTab(name);
        return true;
    } else {//取消关闭
        return false;
    }
}

});