M139.namespace("M2012.Main.View", {
    TopView: Backbone.View.extend({
        el: "#header",
        events: {
            "click #btn_set": "onSettingClick",
            "click #accountList": "onAccountListClick"
        },
        initialize: function (options) {

            this.model = null;
            this.initEvents();

        
            //全局点击事件
            $GlobalEvent.on("click", this.resetTopFixTabsCssAndDropdown);        
        },
        onSettingClick:function(){
            $("#accountList").removeClass("infoSelon");
            $App.show('account');
            BH("top_accountManager");
            return false;
        },
        onReceiveLetterClick: function () {
            $App.getView("folder").model.set("vipMailStats", null);//清空vip数据，用于重新加载
            $App.trigger("reloadFolder", {
                callback: function () {
                    $App.showMailbox(1);
                }
            });
        },
        onComposeClick:function(e){
            e.preventDefault();
            var modules = $App.getView("tabpage").model.pages;
            for (var elem in modules) {
                if (elem && elem.indexOf("compose") >= 0) {
                    var win = $(modules[elem].element).find("iframe")[0].contentWindow;
                    try {
                        //判断有新开的写信tab，并且未被修改过，则切换过去。加catch防止iframe正在加载中时拒绝访问
                        if (win.mainView.model.get("pageType") == "compose" && win.mainView.model.isBlankCompose() == true) {
                            $App.getView("tabpage").activeTab(elem);
                            return;
                        }
                    } catch (ex) { }
                }
            }
            $App.show('compose');
            return false;
        },
        onAccountListClick: function (e) {
            var jTarget = $(e.currentTarget);
            if (jTarget.hasClass("infoSelon")) {
                jTarget.removeClass("infoSelon");
            } else {
                jTarget.addClass("infoSelon");
            }
            $("#umcpassportplugin").hide();
            $('#helpmenu').removeClass('infoSelon');
            $('body > .menuPop').remove();
            e.stopPropagation();
        },
        initEvents: function () {
            var self = this;
            $("#logout").attr("href", getDomain("mail") + '/login/Logout.aspx?sid=' + sid + "&redirect=" + encodeURIComponent(getDomain("mail") + "/logout.htm"));


            $(document.getElementById("btn_compose")).click(function (e) {
                self.onComposeClick(e);
            });
            $(document.getElementById("btn_receive")).click(function (e) {
                self.onReceiveLetterClick(e);
            });

            $App.on("userDataLoad", function () {
                var provCode = 0;

                if ($User.isChinaMobileUser()) {
                    provCode = $User.getProvCode();
                } else {
                    $("#mailLog").attr("href", "javascript:$App.showMailbox(1)");
                }
                $("#help").attr("href", getDomain("help") + "/" + provCode + "/index.html?sid=" + $App.getSid());


                var uecDomain = getDomain("uec");
                if ($User.isGrayUser()) {
                    uecDomain = "http://smsrebuild0.mail.10086.cn/uec";
                }
                $("#btn_feedback").attr("href", uecDomain + "/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=" + $App.getSid());
            });
            $("#recommend").hover(
                  function () {
                      $(this).offset().left > 0 && $(this).addClass("selectOn");
                  },
                  function () {
                      $(this).removeClass("selectOn");
                  }
            );

            
            //this.initForAccount();

            VoiceInput.create({
                button: "#btn_foiceSearch", //input: "#tb_mailSearch",
                onComplete: function (text) {
                    var input = $("#tb_mailSearch");
                    if (input.val() == self.seachBoxtip) {
                        input.val(text)
                    } else {
                        input.val(input.val() + text);
                    }
                    setTimeout(function () {
                        input.focus();
                    }, 500);

                }
            });

            $('#setDefaultTab, #mailSetLi').mouseover(function () {
                var id = $(this).attr('id');
                var className = 'on';
                if (id == 'accountSet') {
                    className = 'selected';
                } else if(id == 'setDefaultTab') {
                    className = 'focus';
                }
                $('#mailSetLi').each(function() {
                    if ($(this).find('.J-dropdown').hasClass('hide')) {
                        $(this).removeClass('selected focus on');
                    }
                }); 
                $(this).addClass(className);
            }).mouseout(function () {
                if ($(this).find('.J-dropdown').hasClass('hide')) {
                    $(this).removeClass('selected focus on');
                }
            });
        },
        initForAccount: function () {//处理默认账号菜单的事件绑定
            $GlobalEvent.on("click", function (e) {
                var elem = $("#accountList");
                if (elem.hasClass("infoSelon")) {
                    elem.removeClass("infoSelon");
                }
            });
        },
        preInitSearch: function () {
            var self = this;
            var isInit = false;
            // 首先执行一次给this.seachBoxtip赋初始值
            self.switchSearchBoxTips();
            $("#tb_mailSearch").css("color", "gray").val(self.seachBoxtip);
            self.initForSearch();
            /*$("#tb_mailSearch").focus(function () {
                $(this).unbind("focus", arguments.callee);
                if (!isInit) {
                    self.initForSearch();
                }
                isInit = true;
            });
            $("#searchIcon").mousedown(function () {
                $(this).unbind("mousedown", arguments.callee);
                if (!isInit) {
                    self.initForSearch();
                }
                isInit = true;
            });*/
			$("#op_mail").mouseover(function(){$(this).css("cursor","default")}) //鼠标移动到第一行，应该显示不可点击
        },
        initForSearch: function () {//处理搜索菜单
            var self = this;
            self.firstShow = true;
            var menu = $("#searchMenu");
            var tb = $("#tb_mailSearch");
            var searchIcon = $("#searchIcon");
            // 暂时屏蔽网盘文件搜索
            menu.find('#li_op_disk').remove();
            // 初始化各模块下需要隐藏的提示项
            if ($App.getConfig("UserAttrs") && $App.getConfig("UserAttrs").fts_flag == 1) {
                $('#open_all').hide();
                var items = menu.find('li a');
                var defaultItemSeq = {
                    'addr': [6],
                    'diskDev': [8, 9],
                    'googSubscription': [10],
                    'calendar': [7]
                }
            } else {
                $('#li_op_all').hide();
                $('#li_op_subject_content').hide();

                var items = menu.find("li[id!='li_op_all'][id!='li_op_subject_content'] a");
                menu.find("#li_op_all, #li_op_subject_content").remove();
                var defaultItemSeq = {
                    'addr': [4],
                    'diskDev': [6, 7],
                    'googSubscription': [8],
                    'calendar': [5]
                }
                $('#open_all').click(function() {
                    //$App.setAttrs({fts_flag:1});
                    //$App.getConfig("UserAttrs").fts_flag = 1;
                    $RM.setAttrs({attrs: {fts_flag:1}}, function (result) {
                       if (result["code"] == "S_OK") {
                            BH("open_search_all_succeed")
                            var dialog = $Msg.confirm(
                                                "全文检索开通成功，刷新页面生效",
                                                function () {
                                                    location.reload();
                                                },
                                                {
                                                    title:"",
                                                    dialogTitle:'系统通知',
                                                    icon:"ok",
                                                    buttons:["立即刷新"]
                                                }
                            )
                        } else {
                            top.M139.UI.TipMessage.show("全文检索开通失败",{className:"msgRed", delay: 1000 });
                        }
                   });
                })
            }
            // 滑动事件
            items.hover(function () {
                //$(this).addClass("selected");
                selectItem($(this));
            }, function () {
                //$(this).removeClass("selected");
                //blurItem($(this));
            });
            var key = {
                up: 38, down: 40, enter: 13, left: 37, right: 39
            };
            //切换搜索下拉菜单
            function switchSearchMenu(visible) { 
                if (tb.val().trim() == '') visible = false;
                if (visible) {
                    show();
                    self.firstShow = false;
                } else {
                    hide();
                }
            }

            function showItemByChannel(channel) {
                var seqs = defaultItemSeq[channel];
                for (var i = 0, len = seqs.length; i < len; i++) {
                    menu.find('li:eq('+ seqs[i] +')').show();
                }
            }
            //显示搜索下拉菜单
            function show() {
                var searchDefaultSetting = $App.getCustomAttrs("searchDefaultSetting");
                var keyword = tb.val().trim();
                menu.find("strong").text($TextUtils.getTextOverFlow(keyword, 5, true));
            //    searchIcon.addClass("searchEnter"); 搜索输入框内，去掉enter icon
                var index = 1;
                //取得用户设置的默认搜索项
                var channel = $('#toFixTabs').find('li.on').attr('name');
                menu.find('li').hide();
                if (channel == 'addr' || channel == 'diskDev' || channel == 'googSubscription'||channel=='calendar') {
                    index = defaultItemSeq[channel][0];
                    showItemByChannel(channel);                    
                } else {
                    $.each(items, function(i,value){
                        if($(this).attr("field") == searchDefaultSetting){
                            index = i;
                            return false;
                        }
                    });

                    menu.find('li').not(":eq("+defaultItemSeq['calendar'][0]+")").show();
                }
                
                items.removeClass("sel");
                items.eq(index).addClass("sel");//默认选中
                selectItem(items.eq(index)); //默认选中

                tb.parent().addClass("searchContentOn");
                menu.removeClass("hide");
            }
            //隐藏搜索下拉菜单
            function hide() {
                tb.parent().removeClass("searchContentOn");
                menu.addClass("hide");
            //    searchIcon.removeClass("searchEnter"); 搜索输入框内，去掉enter icon
            }

            function setSearchFrom() {
                top.$App.getView("mailbox_other").model.set("searchIsComeformDefault", "from");
            }
            var clickSearchItem = false; //鼠标点击区域是否在搜索框范围内，用于失焦后隐藏搜索菜单
            function doSearch(type, field) {
                clickSearchItem = true;
                top.$App.getView("mailbox").model.set("IamFromLaiwang",false);
                var searchDefaultSetting = $App.getCustomAttrs("searchDefaultSetting");
                var keyword = tb.val().trim();
                var channel = $('#toFixTabs').find('li.on').attr('name');
                top.$App.getView("mailbox_other").model.set("searchContent",keyword);//把搜索的内容记住，没有内容的时候会搜索主题，需要用到
                if (keyword == "" || keyword == self.seachBoxtip) {
                    $Msg.alert("请输入关键词");
                } else {
                    if (type == "mail") {
                        if (keyword.length > 100) {
                            top.FF.alert('仅支持对100个字符的关键词搜索，100个字符外的字词将被忽略');
                            keyword = keyword.substring(0, 100);
                        }
                        top.$App.getView("mailbox_other").model.set("showSearchclassify",true);// 只有通过搜索框搜索邮件，先显示逼近式搜索模块
                        if (field && field != "all") {
                            var options = addCondiction(keyword, field);
                            $App.searchMail(options);
                        } else if(field == "all") {
                            $App.searchMail(keyword);
                        }else{
                            $App.searchMail(keyword);
                        }
                    } else if (type == "attach") {
                        BH('diskv2_search');
                        $App.show('diskDev',{from: "attachment",keyword : keyword});
                    } else if (type == "disk") {
                        $App.show("diskDev", "&keyword=" + escape(keyword));
                    } else if (type == "contact") {
                        if (channel == 'addr') {
                            $App.trigger("searchkeywordChange", {type:"addr",keyword: keyword});
                        } else {
                            $App.show("addrhome", { goid: 9001, keyword: keyword, homeRoute: 10300});
                        }                        
                    } else if (type == 'tempStorage') {
                        BH('diskv2_search');
                        $App.show('diskDev',{from: "cabinet",keyword : keyword})
                    } else if (type == 'googSubscription') {
                        $App.show("googSubscription", { keyword: keyword });
                    } else if (type == 'calendar') {
                        BH("calendar_calendarsearch_click");
                        $App.trigger("calendarSearch", { type: 'subscribe', keyword: keyword });
                    }
                }
                switchSearchMenu(false); //在搜索时，如果菜单是显示的，则切换为隐藏
                tb.blur();
            }
            function addCondiction(keyword, field) {
                var options = keyword;
                var field = field.split("_");
                var condictions = [];
                for(var i = 0; i < field.length; i++){
                    condictions.push({
                        field: field[i],
                        operator: "contains",
                        value: keyword
                    });
                }
                if (keyword != '') {
                    options = {condictions: condictions};
                    if (field == 'attachName') {
                        options.flags = { attached: 1 };
                    }
                }
                return options;
            }
            $("#op_from,#op_to_from,#op_subject,#op_subject_content,#op_all").click(function () {
                //每次搜索的时候清楚提示框，结果影响位置
                //$("#guideHTML").hide();
                //$("#div_mail").unbind("scroll");
                top.$App.getView("mailbox").model.set("IamFromLaiwang",false);
                var field = $(this).attr('field') || null;
                if (field) {
                    BH('search_' + field);//统计代码
                }else{
                    BH('top_search');
                }
                if(field == "from"){
                    setSearchFrom();//默认搜索下搜索发件人的时候记住这个状态
                }
                top.$App.getView("mailbox_other").model.set("setting", field); //选择了搜索项目后把搜索的东西传递下去
                doSearch("mail", field);
                return false;
            });
            $("#op_disk").click(function () { doSearch("disk"); return false; });
            $("#op_contact").click(function () { doSearch("contact"); return false; });
            $("#op_attach").click(function () { doSearch("attach"); return false; });
            $("#op_tempStorage").click(function () { doSearch("tempStorage"); return false; });
            $("#op_googSubscription").click(function () { doSearch("googSubscription"); return false; });
            $("#op_calendar").click(function () { doSearch("calendar"); return false; });

        $("#searchIcon").click(function () {
        //有searchEnter的已经被干了
        //    if ($(this).hasClass("searchEnter")) { //回车状态下是搜索
        //        doSearch("mail");
        //        //$App.searchMail($("#tb_mailSearch").val());
        //        switchSearchMenu(false);
        //        BH("top_searchEnter");
       //     } else { //下拉图标，出菜单
                //switchSearchMenu(true);
                showAdvanceSearch();
                BH("top_searchDrop");
        //    }

            });

            // 搜索按钮
            $('#searchBtnIcon').click(function () {
                BH('search_icon');
                var searchDefaultSetting2 = $App.getCustomAttrs("searchDefaultSetting");
                //每次搜索的时候清楚提示框，结果影响位置
                //$("#guideHTML").hide();
                //$("#div_mail").unbind("scroll");
                // 根据模块来确定搜索类型
                var channel = $('#toFixTabs').find('li.on').attr('name');
                if (channel == 'addr') {
                    doSearch("contact"); return false;
                } else if (channel == 'diskDev') {
                    doSearch("attach"); return false;
                } else if (channel == 'googSubscription') {
                    doSearch("googSubscription"); return false;
                } else if (channel == 'calendar') {
                    doSearch("calendar"); return false;
                }

                if(searchDefaultSetting2 && "from,subject,to_from,subject_content,all".indexOf(searchDefaultSetting2) > -1){
                    doSearch('mail',searchDefaultSetting2);
                    top.$App.getView("mailbox_other").model.set("setting", searchDefaultSetting2); //传入右边的浮框的选中的值
                    if(searchDefaultSetting2 == "from"){
                        setSearchFrom(); //默认搜索下搜索发件人的时候记住这个状态
                    }
                }else{
                    doSearch('mail',"from"); //放入默认的值
                    top.$App.getView("mailbox_other").model.set("setting", "from"); //传入右边的浮框的选中的值
                    setSearchFrom(); //默认搜索下搜索发件人的时候记住这个状态
                }

            //    doSearch("mail");
                switchSearchMenu(false);
            });
            
            function tb_focus() {
                if (self.seachBoxtip == $(this).val()) {
                    $(this).val("").css("color", "black");
                }
                switchSearchMenu(true);
                setTimeout(function () {
                    if (self.popupSearch && $("#popup_searchadvance").length > 0) {
                        self.popupSearch.close();
                    }
                }, 50);
            }
            //tb_focus.call(tb[0]);//因为改成异步绑定，所以这里要先触发一次
            tb.focus(tb_focus).blur(function (e) {
                if ("" == $(this).val()) {
                    $(this).css("color", "gray");
                    tb.val(self.seachBoxtip);
                }
                
                window.setTimeout(function () { //点击到搜索按钮，点击菜单都会触发失焦事件，会造成执行顺序混乱，所以要延时200毫秒执行
                                        
                    if (!clickSearchItem) {
                        switchSearchMenu(false);
                    }
                    clickSearchItem = false; //变量复位
                }, 200);
                //hide();
            }).keydown(function (e) {
                switch (e.keyCode) {
                    case key.up: doUp(); break;
                    case key.down: doDown(); break;
                    default: return;
                }
            }).keyup(function (e) {
                switch (e.keyCode) {
                    case key.enter: doEnter(); break;
                        /*case key.right:
                        case key.left: switchSearchMenu(false); break;*/
                    default:
                        //var keyword = $(this).val().trim() || "关键词";
                        var keyword = $(this).val().trim();
                        var isHide = menu.hasClass('hide');
                        if (isHide) switchSearchMenu(true); //在输入关键字时，如果菜单是隐藏的，则切换为显示
                        if (keyword == '') switchSearchMenu(false);
                        menu.find("strong").text($TextUtils.getTextOverFlow(keyword, 5, true));
                }
            });
            function showAdvanceSearch() {
                switchSearchMenu(false);
                var dialogHeight = 320;
                if ($App.getConfig("UserAttrs") && $App.getConfig("UserAttrs").fts_flag == 1) {
                    dialogHeight = 380;
                }
                this.popupSearch = M139.UI.Popup.create({
                    name: "searchadvance", width: 360, height: dialogHeight,
                    //autoHide:true,
                    target: document.getElementById("searchContainer"),
                    content: "<iframe src='advance_search.htm' frameborder=\"0\" allowTransparency=\"true\" style='border:0px;width:330px;height:" + dialogHeight + "px'/>"
                });
                this.popupSearch.render();

                //微调位置
                fixPosition();

                function fixPosition() {
                    var $el = $('#popup_searchadvance');
                    if ($el.attr('data-fix')) { return }
                    var left = $el.css('left').replace('px', '');
                    var top = $el.css('top').replace('px', '');
                    left = parseInt(left, 10) + 5;
                    top = parseInt(top, 10) - 10;
                    $el.find('div[name=popup_arrow]').remove();
                    $el.css({ left: left + 'px', top: top + 'px' });
                    $el.attr('data-fix', 1);
                }
            }
            $("#btn_searchAdvance").click(function (e) { //给高级搜索绑定事件，此时按钮还未生成（用 live）
                showAdvanceSearch();
                e.preventDefault();
                BH("top_searchAdvance");
            });

            function doEnter() {
                var item = getSelectedItem();
                var searchDefaultSetting2 = $App.getCustomAttrs("searchDefaultSetting");
                //每次搜索的时候清楚提示框，结果影响位置
                //$("#guideHTML").hide();
                //$("#div_mail").unbind("scroll");
                if (item != null) {
                    item.click();
                    
                } else {
                    // 根据模块来确定搜索类型
                    var channel = $('#toFixTabs').find('li.on').attr('name');
                    if (channel == 'addr') {
                        doSearch("contact"); return false;
                    } else if (channel == 'diskDev') {
                        doSearch("attach"); return false;
                    } else if (channel == 'googSubscription') {
                        doSearch("googSubscription"); return false;
                    } else if (channel == 'calendar') {
                        doSearch("calendar"); return false;
                    }

                    if(searchDefaultSetting2 && "from,subject,to_from,subject_content,all".indexOf(searchDefaultSetting2) > -1){
                        doSearch('mail',searchDefaultSetting2);
                        if(searchDefaultSetting2 == "from"){
                            setSearchFrom(); //默认搜索下搜索发件人的时候记住这个状态
                        }
                    }else{
                        doSearch('mail',"from"); //放入默认的值
                        top.$App.getView("mailbox_other").model.set("setting", "from"); //传入右边的浮框的选中的值
                        setSearchFrom(); //默认搜索下搜索发件人的时候记住这个状态
                    }
                }
            }
            function doUp() {
                var index = getSelectedIndex();
                var index = getSelectedIndex();
                if (index >= 0) {
                    do {
                        index--;
                        index = index < 0 ? index + items.length : index;
                        if(index == 0){
                            index = items.length - 1;
                        }
                    } while (!items.eq(index).is(':visible'));
                    
                    selectItem(items.eq(index));
                }
            }
            function doDown() {
                var index = getSelectedIndex();
                if (index >= 0) {
                    do {
                        index = (index + 1) % items.length;
                        if(index == 0){
                            index = 1;
                        }
                    } while (!items.eq(index).is(':visible'));
                    
                    selectItem(items.eq(index));
                }
                if(index == -1){
                    selectItem(items.eq(1));
                }
            }
            function getSelectedItem() {
                var index = getSelectedIndex();
                if (index >= 0) return items.eq(index);
                return null;
            }
            function getSelectedIndex() {
                for (var i = 0; i < items.length; i++) {
                    if (items.eq(i).hasClass('selected')) return i;
                }
                return -1;
            }
            function selectItem(item) {
                var last = getSelectedItem();
                if (last != null) blurItem(last);
                if(item.attr("id") != "op_mail"){
                    item.addClass('selected');
                }
                item.attr('id') === 'btn_searchAdvance' && item.find('b').removeClass('c_666');
            }
            function blurItem(item) {
                item.removeClass('selected');
                item.attr('id') === 'btn_searchAdvance' && item.find('b').addClass('c_666');
            }
        },
        //获取账号列表，必须要在userData加载成功后才能调用
        getAccountList: function () {
            return $User.getAccountList();
        },

        //获取默认发信账号
        getDefaultSender: function () {
            var data = $App.getConfig("UserData");
            if (!data) { return $App.getConfig("UserAttrs").uid; }

            if (data && data.defaultSenderAccount) {
                return data.defaultSenderAccount;
            } else {
                var int_defaultSender = data.defaultSender; //DefaultSender取值 0=未设置   1=手机号  2=普通别名 3=飞信别名|通行证号

                //未设置过或者服务端接口异常未返回时,取当前登录名
                if (int_defaultSender === "0" || int_defaultSender === "" || _.isUndefined(int_defaultSender)) {
                    var loginName = data.loginName || $User.getShortUid(); //容错
                    return $App.getAccountWithLocalDomain(loginName);
                }

                var fetchMethod = {
                    "1": function (a) { return a.type === "mobile" }, //1
                    "2": function (a) { return a.type === "common" }, //2
                    "3": function (a) { return a.type === "fetion" || a.type === "passid" } //3
                }[int_defaultSender];

            var accountList = this.getAccountList();
            for (var i = accountList.length; i--; ) {
                if ( fetchMethod(accountList[i]) ) {
                    return accountList[i].name;
                }
            }

                //没找到的情况下容错处理
                return accountList[0].name;
            };

        },
        //设置默认发信账号
        setDefaultSender: function (account, type, callback) {
            //if (top.SiteConfig.moreAlias) {
                /*if (account.indexOf("@") > -1) {
                    account = account.split("@")[0];
                };
                var data = {
                    "default": account,
                    "type": type
                };*/
                var data = {
                    setDefaultSendAccount:account
                }
                M139.HttpRouter.addRouter("setting", ["user:setDefaultSendAccount"]);
                M139.RichMail.API.call("user:setDefaultSendAccount", data, function (response) {
                    if (callback) { callback(response.responseData) }
                }, function () {
                    $Msg.alert("服务器发生不可预期的错误");
                    return
                });
            //}
            /*else {
                var url = '/sharpapi/serviceapi/alterdefault.ashx?sid=' + $App.getSid() + "&type=" + account + "&rnd=" + Math.random();;
                url = M139.HttpRouter.getNoProxyUrl(url);

                var img = new Image();
                img.src = url;
            };
            setTimeout(function () { //因为image 对象的onload不起作用，无法精确判断成功，用延时实现
                $App.trigger("userAttrChange", {
                    callback: function () { }
                });
            }, 500);*/

        },
        renderAccountList: function (data) {
            var self = this;
            var $accountSet = $("#accountSet");
            if (data) {
                //var menuItems = [{ html: "<span>选择默认发信账号</span>", highlight: false }, { isLine: true }];
                var defaultSender = this.getDefaultSender(); //默认发信账号
                var html = ['<li><a href="javascript:;"><span class="text">默认发信帐号：</span></a></li>'];
                var accountList = self.getAccountList();

                var hasAccount = false;
                $(accountList).each(function (i, n) {
                    html.push('<li status=' + $User.getDefaultAccountType(n.type) + ' item="');
                    html.push(n.name);
                    if (n.name == defaultSender) {
                        $accountSet.find("a:eq(0)").html('<i class="i-users"></i>'+ n.name +'<i class="triangle t_blackDown"></i>'); //设置当前
                        html.push('"class="selecteds"');
                        hasAccount = true;
                    }
                    html.push('"><a href="javascript:"><span class="text">')
                    html.push(n.name);
                    if (n.name == defaultSender) {
                        html.push('</span><i class="i_icok"></i></a></li>');
                    } else {
                        html.push('</span></a></li>');
                    }
                    
                });

                //容错：如果服务端返回的 默认发件帐号，无法在帐号列表里找到，则直接显示出默认发件帐号
                if (!hasAccount) {
                    $accountSet.find('a:eq(0)').html('<i class="i-users"></i>'+ defaultSender +'<i class="triangle t_blackDown"></i>');
                }

                function getAccountHtml(tipText, buttonText) {
                    var html = ['<div class="bingIng">',
                    '<dl class="mb_5">',
                      '<dt class="gray mt_5 mb_5">' + tipText + '</dt>',
                      '<dd class="ta_c"><a id="bindAccount" href="javascript:void(0)" class="btnNormal c_000"><span style="margin:0;">' + buttonText + '</span></a></dd>',
                    '</dl>',
                '</div>'].join("");
                    return html;
                }
                function insertAccountHtml(tipText, buttonText) {
                    var jBindAccount = $("#accountList div.bingIng");
                    if (jBindAccount.size() == 0) {
                        $("#accountList ul").after(getAccountHtml(tipText, buttonText));
                    }
                }

                var line = $accountSet.find('li.line:eq(0)').index();
                $accountSet.find('li:lt('+line+')').remove();
                $accountSet.find('ul:eq(0)').prepend(html.join(""));
                /*
                document.getElementById("accountList").getElementsByTagName("ul")[0].innerHTML = html.join("");
                var aLen = $User.getAliasName('fetion') ? 2 : 1;
                if (accountList.length == aLen) {
                    if (!$User.isInternetUser()) {
                        var buttonText = '邮箱帐号';
                        if ($User.isChinaMobileUser()) {
                            buttonText = '别名帐号';
                        }
                        insertAccountHtml('使用“' + buttonText + '@139.com”发邮件，保护手机号码隐私。', '申请' + buttonText);
                    } else {
                        insertAccountHtml('绑定手机号码，享受免费、无限量邮件到达通知短信！', '绑定手机号码');
                    }
                    $("#bindAccount").click(function (event) {
                        top.$App.show("account");
                        return false;
                    });
                } else {
                    var jBindAccount = $("#accountList div.bingIng");
                    if (jBindAccount.size() > 0) {
                        jBindAccount.remove();
                    }
                }*/

                $accountSet.unbind('click').click(function (e) {
                    e.stopPropagation();
                    self.resetTopFixTabsCssAndDropdown(this);                  
                });

                $accountSet.find('li[item] a').unbind('click').click(function () {
                        var account = $(this).parents("li").attr("item");
                        var type = $(this).parents("li").attr("status");
                        $(this).parents("li").addClass('selecteds').siblings('li[item]').removeClass('selecteds');
                        if (top.SiteConfig.moreAlias) {
                            self.setDefaultSender(account, type, function (result) {
                                if (result.code != "S_OK") {
                                    $Msg.alert("系统繁忙，请稍后再试");
                                    return
                                }
                                $accountSet.find("a:eq(0)").html('<i class="i-users"></i>'+ account +'<i class="triangle t_blackDown"></i>');
                                M139.UI.TipMessage.show("默认发信帐号设置成功", { delay: 2000 });
                            });
                        } else {
                            $accountSet.find("a:eq(0)").html('<i class="i-users"></i>'+ account +'<i class="triangle t_blackDown"></i>');
                            self.setDefaultSender(account);
                        }
                        BH("top_defaultAccount");
                    });

                // 统计日志
                $accountSet.find('a:eq(0)').unbind('click').click(function(){
                    BH('top_account');
                })
                $('#logout').unbind('click').click(function(){
                    BH('top_logout');
                });
            }
        },
        checkAvaibleForMobile: function () {
            $User.checkAvaibleForMobile("#sms_link,#btn_sms,#mms_link,#link_cm,#link_score,#btn_g3,#note_link,#fetionContainerId,#btn_pushemail,#tc_link,#fc_link,#colorcloud_link,#music_link,#recommend a,#btn_userCenter");

            if ($User.isNotChinaMobileUser()) {
                $("#li_weibo_fetion").hide();
            }

        },

        //显示统一通行证盒子
        renderUmcBox: function (data) {

            var hasUmc = !!data.isumcuser;
            if (!hasUmc) {
                return;
            }

            var UMCSVR = getDomain("UMCSVR") || "http://www.rdcmpassport.com:30030/UmcSSO/plugin";
            var VERSION = "1.0";
            var FROM139 = "3";
            var self = this;

            function createUmcSvr(api) {
                return [UMCSVR, '?func=', api, "&sourceid=", FROM139, "&ver=", VERSION].join('');
            }

            function createPluginUrl(args) {
                return [createUmcSvr("plug:init"), "&anchor=", args.anchor, "&artifact=", args.artifact, "&passid=", args.passid].join('');
            }

            function callArtifactApi(onfetch, onfail) {
                M139.RichMail.API.call("umc:getArtifact", {}, function (response) {
                    var respData = response.responseData;
                    if (respData) {

                        if (respData.code == "S_OK") {
                            respData = respData['var'];

                            if (respData.artifact) {
                                onfetch(respData);	
                            } else if (onfail) {
                                onfail();
                            } else {
                                M139.Logger.getDefaultLogger().info("umc.getartifact is empty", true);
                            }
                        }
                    }
                });
            }

            function fetchArtifact(onfetch) {
                if (top._session_flag_umcbox_added_) return;
                top._session_flag_umcbox_added_ = true;

                //$("#header .infoSel:has(#btn_set):eq(1)")
                //$("#header .logoinfo").append('<div class="infoSel" id="umcboxpluginbar" style="color:#DDE5EE;line-height: 22px;"></div>');
                var temp = ['<li id="umcboxpluginbar" class="newLogoInfo_li">',
                                //'<a href="javascript:void(0);" id="umcboxpluginbar" class="newLogoInfo_a">',
                                    //'互联网通行证 <i class="triangle t_whiteDown"></i>',
                                //'</a>',
                            '</li>',
                            '<li class="newLogoInfo_li noMar">|</li>'].join("");
                $('#mailSetLi').before(temp);
			
                if (top.SiteConfig.testUmcFeatures) {
                    var passid = "800011348";
                    var url = UMCSVR.replace("/UmcSSO/plugin", "") + "/test/getartifact?account=13601000030";
                    $.getScript(url, function () {
                        self.umcBoxAdded = true;
                        onfetch({'artifact': artifact, 'passid': passid});
    					fixAlink();
                    });
                    return;
                }

                //鉴于获取凭证失败率较高，所以失败后隔10秒重试一次。
                callArtifactApi(onfetch, function() {
                    setTimeout(function() {
                        M139.Logger.getDefaultLogger().info("umc.getartifact fetch again", true);
                        callArtifactApi(onfetch, null);
                    }, 15000);
                });
            }
		
    		//微调连接内容
    		function fixAlink(){
                var flag = true;
    		    var umcbox = $('#umcboxpluginbar');
                umcbox.addClass('newLogoInfo_raset')
    		    umcbox.find('a:eq(0)').addClass('newLogoInfo_a').html('互联网通行证').unbind('click').click(function(){
                    self.resetTopFixTabsCssAndDropdown();
                    var left = umcbox.offset().left;
                    if (flag && $B.is.ie && $B.getVersion() <= 8) {
                        setTimeout(function() {
                            $('#umcpassportplugin').css('left', left + 96 + 'px');
                            flag = false;
                        }, 50);
                    } else {
                        $('#umcpassportplugin').css('left', left + 96 + 'px');
                    }
                    
                    BH('click_umcboxpluginbar');
                });
    		    umcbox.unbind().mouseover(function () { umcbox.addClass("on"); }).mouseout(function () { umcbox.removeClass("on"); });
    		}
			

            function oninit() {
                fixAlink();
            }

            fetchArtifact(function(args){

                var boxid = "umcboxpluginbar";

                args = $.extend({
                    sourceid: FROM139, anchor: boxid
                }, args);


                var url = createPluginUrl(args);

                M139.Core.utilCreateScriptTag({
                    id: "UMC_SSO_BOX_PACK",
                    src: url
                }, function(){
                    oninit(boxid);
                });
            });
        },

    /**
     * 显示右下角的用管中心的升级提醒
     * @param data
     */
    renderUmcUpgrade: function (data) {

        //如果总开关关闭，则全局关闭。
        if (top.SiteConfig.showUmcUpgrade) {

            //如果总开关打开，则看服务端分省开关是否打开
            if ( typeof(data.isumcprov) !== "undefined" ) {
                var provopen = !!data.isumcprov;
                if (!provopen) {
                    return;
                }
            }

            //如果服务端开关没有实现，则看前端分省开关是否打开
            if ( typeof(top.SiteConfig.showUmcProv) !== "undefined" ) {
                var provlist = top.SiteConfig.showUmcProv || [];
                var provCode = $User.getProvCode();
                if ($.inArray(provCode, provlist) == -1) {
                    return;
                }
            }
        } else {
            return;
        }

        var hasUmc = !!data.isumcuser;
        if (hasUmc) {
            return;
        }
        
        
        var view = new M2012.UI.Tip.UmcUpgradeTip.View({});
        view.render();
        

    },
	
	//帮助中心菜单
	renderHelpMenu:function(){
		var self = this;
		var helpMenuContainer = $('#mailSetLi');
		var menuList = helpMenuContainer.find('.J-dropdown');
		
		//帮助中心
		var provCode = 0;
		if ($User.isChinaMobileUser()) {
			provCode = $User.getProvCode();
		}
		menuList.find("#helpcenter").attr('href', getDomain("help") + "/" + provCode + "/index.html?sid=" + $App.getSid());
		
		//反馈
		var uecDomain = getDomain("uec");
        if ($User.isGrayUser()) {
			uecDomain = "http://smsrebuild0.mail.10086.cn/uec";
        }
        menuList.find("#feedback").attr("href", uecDomain + "/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=" + $App.getSid());
		
		//更新日志
		//menuList.find("li:eq(6) a").attr('href','http://help.mail.10086.cn/statichtml/1/Category/39/List_1.html');
		
		helpMenuContainer.unbind('click').click(function (e) {
			self.resetTopFixTabsCssAndDropdown(this);
			e.stopPropagation();
		}).children('a').unbind('click').click(function(){
            BH('top_setting');
        }).end().find('ul>li').unbind('click').click(function(){
            BH($(this).find('a').attr('bh'));
        });
	},
	
	//手机通知图标
	phoneNoticeEvent:function(){
		var self = this;
		var container = $('#phoneNotice');
		var isInternetUser = $User.isInternetUser();
		if(isInternetUser){
			container.find('i').removeClass('i-phoneNotice').addClass('i-phoneNoticeGray');	
		}
		container.unbind('click').click(function(){
			isInternetUser ?  $User.showMobileLimitAlert() : $App.show('notice');
                        return false;
		});
	},
	
	// add by tkh 改掉精品订阅的地址，深圳灰度用户加载新版精品订阅
	switchSubscribe : function(){
		var self = this;
		if(top.$User.isGrayUser() && top.$User.getAreaCode() == 3){
			LinkConfig.googSubscription = { url: 'http://subscribe3.mail.10086.cn/inner/index.jsp', group: "subscribe", title: "精品订阅" };
        }else{
        	LinkConfig.googSubscription = { url: 'http://subscribe2.mail.10086.cn/inner/index.jsp', group: "subscribe", title: "精品订阅" };
        	LinkConfig.myCollect = { url: 'http://subscribe2.mail.10086.cn/inner/show_favorite.action', group: "subscribe", title: "精品订阅" };
        }
        var jGoogSubscription = $("#googSubscription");
        if(jGoogSubscription.size() > 0){
        	if(top.$User.isGrayUser() && top.$User.getAreaCode() == 3){
        		jGoogSubscription.attr('src', 'http://subscribe3.mail.10086.cn/inner/index.jsp');
        	}else{
        		jGoogSubscription.attr('src', 'http://subscribe2.mail.10086.cn/inner/index.jsp');
        	}
        }
	},

    renderHealth: function(){
	    if(location.href.indexOf("rd139cm") > 0) return ;
        var health = $App.getConfig('healthyHistory');
        if(health){
            var lastUpdateDay = health.lastUpdateTime.substring(0,health.lastUpdateTime.indexOf(' ')),
                score = health.totalScore,
                timeArr = lastUpdateDay.split('-'),
                day = Math.floor(($.now() - new Date(timeArr[0], timeArr[1]-1, timeArr[2]).getTime()) / (24 * 3600 * 1000)),
                overDay = ($.now() - new Date(timeArr[0], timeArr[1]-1, timeArr[2]).getTime()) >= 72 * 3600 * 1000,
                overMonth = ($.now() - new Date(timeArr[0], timeArr[1]-1, timeArr[2]).getTime()) >=  3 * 30*24 * 3600 * 1000,
                lastTipsDay = new Date(health.lastTipsRemind).getDay(),
                isThisWeekTips = (new Date(new Date().format("yyyy-MM-dd") + ' 00:00:00').getTime() - (lastTipsDay - 1) * 24 * 3600 * 100) > new Date(health.lastTipsRemind).getTime()
                    || !($.now() - new Date(health.lastTipsRemind).getTime() <= 24 * 3600 * 1000),
                status = {};
            if($User.isChinaMobileUser()){
                if(score == 0){
                    status = ["i-redShield", "139邮箱体检帮您提升邮箱安全与效能"];
                }else if(overDay){
                    status = ["i-redShield", "超过" + day + "天未体检"];
                }else if(score < 50){
                    status = ["i-redShield",  "健康度：" + score + "分；<br>有隐患，请立即修复"];
                }else if(score < 90){
                    status = ["i-yellowShield", "健康度：" + score + "分；<br>还不错，修复后更好"];
                }else{
                    status = ["i-greenShield", "健康度：" + score + "分；<br>非常好，请继续保持"];
                }
                top.$('#healthSet i').removeClass('i-redShield, i-yellowShield, i-greenShield').addClass(status[0]);
                top.$('#healthSet .tips-text').html(status[1]);
                top.$('#healthSet a').hover(function(){
                    top.$('#healthSet .tipsOther').css('display', 'block');
                },function(){
                    top.$('#healthSet .tipsOther').css('display', 'none');
                }).on('click',function(){
                    top.$App.jumpTo('health');
                });
            }else{
                top.$('#healthSet').css('display', 'none').next().css('display', 'none');
            }

            if(overMonth && isThisWeekTips){
                setTimeout(function(){
                    M139.RichMail.API.call("healthy:updateLastTipsTime", {}, function (response) {
                        if (response.responseData && response.responseData.code == "S_OK") {
                            $BTips.addTask({
								width: 385,
                                title: "邮箱健康提醒",
                                content: ['<div class="norTips clearfix"><div class="norTipsIco fl"><img src="../images/module/welcome/htest.png" width="66" height="66"></div>',
                                    '<dl class="norTipsContent pt_10"><dt class="norTipsLine fw_b">邮箱已超过<var class="c_ff5907"> 3',
                                    '</var>个月未体检，建议立即体检。</dt>',
                                        '<dd>最近体检是 <var class="c_ff5907">' + lastUpdateDay + '</var> ，建议每周一次体检。</dd></dl></div>',
                                    '<div class="boxIframeBtn"><span class="bibText"></span><span class="bibBtn">',
                                    '<a class="btnDoHealth btnSure" href="javascript:top.$App.jumpTo(\'health\')"><span>立即体检</span></a></span></div>'
                                ].join(''),
                                timeout: 1000 * 20
                            });
                        }
                    });
                },10 * 1000);
            }
        }
    },

	
    render: function () {
        var self = this;
        $App.on("userDataLoad", function (data) {
            self.renderAccountList(data);
            self.checkAvaibleForMobile();

            self.renderUmcBox(data);
            //self.renderUmcUpgrade(data);
	    self.phoneNoticeEvent();
	    self.renderHelpMenu();
	    self.renderHealth();			
            //self.switchSubscribe(); // add by tkh


            //顶部邮箱营业厅，add by qzj
            /*
			var provinceName = top.SiteConfig.billAllowProvince[top.$User.getProvCode()];

			if (provinceName) {
			    var href = "javascript:$App.show('billCharge', {'ct':'main','ac':'index'})"
			    $('#toFixTabs').find('li[name=billCharge]').show().find('a').attr('href', href);
			}*/
			M139.Logger.getDefaultLogger().debug("userdataload topviewrender");
        });

        if (!$User.isChinaMobileUser()) { //非移动用户自动打开收件箱
            $App.on("folderLoaded", function () {
                $App.off("folderLoaded", arguments.callee);
                $App.showMailbox(1);
                setTimeout(function () {
                    $("[tabid=mailbox_1] .i_close").remove(); //收件箱不显示关闭
                }, 200);
            });
            $(".mailLogo_new").attr("href", "javascript:$App.showMailbox(1)");
        }
    },


    showTopFixedTabs: function () {
        var self = this;
        var tabpageModel = $App.getView("tabpage").model;

        var topFixTabs = tabpageModel.getInitTabsData();  // 固定页签数组
        var $defaultTabTxt = $('#defaultTabTxt');       // 显示默认页签的文本框
        var defaultEntryTab = this.getDefaultEntrytab();    // 默认进入的固定页签
        var defaultTabsRange = [];                      // 用于生成默认页签下拉框对象数组
        for (var i = 0, len = topFixTabs.length; i < len; i++) {
            var item = topFixTabs[i];
            defaultTabsRange.push({
                text: tabpageModel.topFixTabObj[item],
                value: item,
                myData: i
            })
        }
        
        // 展示顶部固定标签
        // 非移动用户隐藏“欢迎页”，“日历”
        if (!$User.isChinaMobileUser()) {
            $('#toFixTabs li[name=welcome], #toFixTabs li[name=calendar]').hide();
        }
        $('#toFixTabs>li').click(function () {
            BH('click_fixedtab_' + $(this).attr("name"));
            //$(this).addClass("on").siblings().removeClass('on');
        });

        var $setDefaultTab = $("#setDefaultTab");
        // 事件-显示设置默认页签浮层
        $setDefaultTab.click(function (e) {
            e.stopPropagation();
            BH('set_default_tab');
            self.resetTopFixTabsCssAndDropdown(this);

            // 设置当前默认标签
            defaultEntryTab = self.getDefaultEntrytab();
            $defaultTabTxt.text(tabpageModel.topFixTabObj[defaultEntryTab]);
        });

        // 选择新的默认标签
        $defaultTabTxt.parent().click(function () {
            if (self.menuDefaultEntryTab) {
                $(self.menuDefaultEntryTab.el).remove();
            }
            self.menuDefaultEntryTab = M2012.UI.PopMenu.create({
                selectMode: true,
                width: 90,
                dx:-1,
                dockElement: $defaultTabTxt,
                items: defaultTabsRange,
                onItemClick: function (item) {
                    defaultEntryTab = item.value;
                    $defaultTabTxt.text(tabpageModel.topFixTabObj[defaultEntryTab]);
                    self.menuDefaultEntryTab = false;
                }
            });

            var selectItem = $.grep(defaultTabsRange, function (i) {
                return i.value === defaultEntryTab;
            });
            //self.menuDefaultEntryTab.selectItem(selectItem[0] ? selectItem[0].myData : 0);
        });
        // 事件-阻止默认页签设置浮层事件冒泡
        $('#setDefaultTabDiv').click(function (e) {
            e.stopPropagation();
        });
        // 事件-确认默认页签设置
        $('#setDefaultTabConfirm').click(function (e) {
            e.stopPropagation();
            BH('set_defaultentrytab_' + defaultEntryTab);
            $setDefaultTab.removeClass('focus');
            $("#setDefaultTabDiv").addClass('hide');

            // 设置登陆后打开的页签
            $App.setUserConfigInfo("defaultentrytab", defaultEntryTab, function () {
                //先记录在cookie, 这样不用重新登录就能取到最新值
                $Cookie.set({
                    name: "defaultTab" + $App.getSid(),
                    value: defaultEntryTab
                });
                if (!$App.getConfig("UserData").mainUserConfig.defaultentrytab) {
                    $App.getConfig("UserData").mainUserConfig.defaultentrytab = [];
                }
                $App.getConfig("UserData").mainUserConfig.defaultentrytab[1] = defaultEntryTab;

                $('#toFixTabs>li').removeClass('on').filter('[name=' + defaultEntryTab + ']').addClass('on');
                defaultEntryTab == 'mailbox_1' ? $App.showMailbox(1) : $App.show(defaultEntryTab);
            });
        });

        // 事件-取消默认页签设置
        $('#setDefaultTabCalcel').click(function (e) {
            e.stopPropagation();
            $setDefaultTab.removeClass('focus');
            $("#setDefaultTabDiv").addClass('hide');
        });
    },

    resetTopFixTabsCssAndDropdown: function(context){
        $('#setDefaultTab, #mailSetLi, #accountSet').each(function(){
            var id = $(this).attr('id');
            var className = 'on';
            if (id == 'accountSet') {
                className = 'selected';
            } else if(id == 'setDefaultTab') {
                className = 'focus';
            }
            if (context && $(context).attr('id') == $(this).attr('id')){
                $(this).find('.J-dropdown').toggleClass('hide');
                if ($(this).find('.J-dropdown').hasClass('hide')) {
                    $(this).removeClass(className);
                } else {
                    $(this).addClass(className);
                }
            } else {
                $(this).removeClass(className).find('.J-dropdown').addClass('hide');
            }
        });
    },

    getDefaultEntrytab: function() {
        // $Cookie.get('defaultTab' + $App.getSid()) || $Url.queryString("tab");
        var defaultEntryTab = $Cookie.get("defaultTab" + $App.getSid()) || $Url.queryString("tab");    // 默认进入的固定页签
        var topFixTabs = $App.getView("tabpage").model.getInitTabsData();
        // 初始化默认进入的固定页签
        if (!defaultEntryTab || topFixTabs.join(",").indexOf(defaultEntryTab) == -1) {
            defaultEntryTab = $User.isChinaMobileUser() ? 'welcome' : 'mailbox_1';
        }
        return defaultEntryTab;
    },

    setSearchBox: function (currentModule) {
        if (currentModule == 'googSubscription' || currentModule == 'diskDev' || currentModule == 'calendar' || currentModule == 'addr' ) {
            $('#searchIcon, #btn_foiceSearch').hide();
            $('#tb_mailSearch').width(207);
        } else {
            $('#searchIcon, #btn_foiceSearch').show();
            $('#tb_mailSearch').width(177);
        }
    },

    switchSearchBoxTips: function() {
        var currentModule = $App.getCurrentTab() && $App.getCurrentTab().name;
        var tips = {
            calendar: "搜索公开日历"
        };
        switch(currentModule) {
            case 'diskDev':
                this.seachBoxtip = '搜索文件';
                break;
            case 'googSubscription':
                this.seachBoxtip = '搜索报刊、服务';
                break;
            case 'calendar':
                this.seachBoxtip = tips.calendar; //searchBoxtip,单词拼错了
                break;
			case 'addr':
                this.seachBoxtip = '搜索联系人';
                break;
            default:
                this.seachBoxtip = '搜索关键词';
        }

        var $tb = $("#tb_mailSearch")
        var word = $.trim($tb.val());
        if (word == '搜索关键词' || word == '搜索文件' || word == '搜索报刊、服务' || word == tips.calendar || word == '搜索联系人') {
            $tb.val(this.seachBoxtip);
        }
    }
})
});