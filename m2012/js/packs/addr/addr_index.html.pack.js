if (ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
}

var filter={
    uncompleted:"",
    firstNameWord:"",
    groupId:"",
    keyword:"",
    pageIndex:0,
    pageSize:20,
	sortType:"",
	emailOrder:1,
	nameOrder:-1,
	mobileOrder:1,
	needSort:false, //点击 通讯录列表 -姓名-邮箱-手机排序
    setDefault:function()//设置默认
    {
        filter.uncompleted="";
        filter.firstNameWord="";
        filter.groupId="";
        filter.keyword="";
    },
    setFilter:function(f){
        for(var p in f){
            filter[p]=f[p];
        }
    },
    sort:function(item){
	   //排序代码先保留
       /* var data=top.Contacts.data;
        var contacts=data.contacts;
        if(!data.sortOrder)data.sortOrder=1;
        data.sortOrder=-data.sortOrder;
        var index=data.sortOrder; 
        switch(item){
            case "name":{ 
				var chIndex = 0, digitIndex = 0,enIndex = 0,partIndex =0 ,sortBymobileName =[],sortByChName = [],sortByEnName =[],proteSign=[],noName=[];
				var chineseReg =  /^[\u4E00-\u9FA5]+$/, englishReg = /^[A-Za-z]+$/, digitalReg = /^[0-9]+$/;
				for(var i = 0; i<contacts.length;i++){
					if(chineseReg.test(contacts[i].name.charAt(0))){      //中文开头的姓名
						sortByChName.push(contacts[i]);
					}else if(englishReg.test(contacts[i].name.charAt(0))){ //英文开头的姓名
						sortByEnName.push(contacts[i]);
					} else if(digitalReg.test(contacts[i].name.charAt(0))){ //数字开头的姓名
						sortBymobileName.push(contacts[i]);
					}else if(!contacts[i].Quanpin){                        //姓名为空--历史数据中存在姓名为空
						noName.push(contacts[i]);							
						
					}else{												   //特殊字符开头的姓名	
						proteSign.push(contacts[i]);
					}
				}
				
				sortByChName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				sortByEnName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				sortBymobileName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				proteSign.sort(function(a,b){return a.Quanpin.localeCompare(b.Quanpin)});
				
				var sortedContacts = [];
					sortedContacts = sortByChName;
					sortedContacts = sortedContacts.concat(sortByEnName);
					sortedContacts = sortedContacts.concat(sortBymobileName);
					sortedContacts = sortedContacts.concat(proteSign);
					sortedContacts = index>0? sortedContacts : sortedContacts.reverse();
				top.Contacts.data.contacts  = sortedContacts.concat(noName); //没有姓名的永远排最后
				
				break;
            }
            case "email":{
				contacts.sort(function(a,b){
					if(!a.getFirstEmail() && b.getFirstEmail()) return 1;
					if(a.getFirstEmail() && !b.getFirstEmail()) return -1;
					if(!a.getFirstEmail() && !b.getFirstEmail()) return 0;
					return a.getFirstEmail().localeCompare(b.getFirstEmail())*index;  //index很重 取反？？？节省了if判断
				});
				
				var breakIndex = 0,sortBymobile =[],sortByName =[];
				for(var i = 0; i<contacts.length;i++){
					if(contacts[i].getFirstEmail() == ""){
						breakIndex = i;
						break;
					}
				}
				
				if(breakIndex>0){
					sortBymobile = contacts.slice(0,breakIndex);
					sortByName = contacts.slice(breakIndex,contacts.length);
					sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
					var sortedContacts = sortBymobile.concat(sortByName);
					top.Contacts.data.contacts  = sortedContacts;
				}
                break;
            }
            case "mobile":{
				contacts.sort(function(a,b){
					if(!a.getFirstMobile() && b.getFirstMobile()) return 1;
					if(a.getFirstMobile() && !b.getFirstMobile()) return -1;
					if(!a.getFirstMobile() && !b.getFirstMobile()) return 0;
					return a.getFirstMobile().localeCompare(b.getFirstMobile())*index;  //index很重 取反？？？节省了if判断
				});
				
				var breakIndex = 0,sortBymobile =[],sortByName =[];
				for(var i = 0; i<contacts.length;i++){
					if(contacts[i].getFirstMobile() == ""){
						breakIndex = i;
						break;
					}
				}
				
				if(breakIndex>0){
					sortBymobile = contacts.slice(0,breakIndex);
					sortByName = contacts.slice(breakIndex,contacts.length);
					sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
					var sortedContacts = sortBymobile.concat(sortByName);
					top.Contacts.data.contacts  = sortedContacts;
				}

                //return a.getFirstMobile().localeCompare(b.getFirstMobile())*index;
               break;
            }
        }*/
		this.sortType = item;
		this.pageIndex = 0;
		this.needSort = true;
		View.changeView("Sort");
   }
};
﻿var Render = {

    NEW_NULL_CONTACT: [
    '<div class="j_empty_field welcomeMain"><div class="welcome">',
                           '<div class="welcome_thead">',
                               '<h2 class="col_2d5">欢迎使用通讯录！</h2><p class="margbtm col_2d5">您可以通过以下方式<strong>导入联系人</strong></p>',
                               '<div class="welcomeBox mb20 clearfix">',
                                   '<a href="javascript:top.BH({ actionId: 104443 });View.changeView(\'Redirect\',{key:\'addr_import_pim\'});" class="importStyle"><span><i class="caiyun"></i><em>和通讯录</em></span></a>',
                                   '<a href="javascript:top.BH({ actionId: 104445 });View.changeView(\'Redirect\',{key:\'addr_import_clone\'});" class="importStyle"><span><i class="mailUser"></i><em>其他邮箱</em></span></a>',
                                   '<a href="javascript:top.BH({ actionId: 104446 });View.changeView(\'Redirect\',{key:\'input\'})" class="importStyle" style="margin-right:0;"><span><i class="importUser"></i><em>其他方式</em></span></a>',
                               '</div>',
                           '</div>',
                           '<p class="newRegister">还可以：<a href="javascript:View.changeView(\'Redirect\', { key: \'addContacts\' });">新建联系人</a></p>',
                       '</div></div>'].join(""),
    
    TOOLTIPS: {
        "import": ['<div class="mimtoolad">多种方式导入联系人，更好地完善您的通讯录。',
                        '<a href="javascript:top.BH({ actionId: 104447 });View.changeView(\'Redirect\',{key:\'addr_import_pim\'})">导入和通讯录</a>',
                        '<span class="pl5 pr5">|</span>',
                        '<a href="javascript:top.BH({ actionId: 104448 });View.changeView(\'Redirect\',{key:\'input\'})">选择其它方式</a>',
                        '<a href="javascript:;" title="关闭" class="mintooladax"><i class="i-del"></i></a>',
                   '</div>'].join(""),
        "login": ['<div class="mimtoolad">还在苦苦寻觅收件人吗？用和通讯录一键上传电话薄，手机联系人迅速变为收件人！',
                        '<a href="',
                        top.domainList.global.caiyun || "http://www.cytxl.com.cn/login.php?channel=139mail", //去彩云看看的链接地址
                        '" class="pl5 pr5" target="_blank">去“和通讯录”看看</a>',
                        '<a href="javascript:;" title="关闭" class="mintooladax"><i class="i-del"></i></a>',
                   '</div>'].join(""),
        "outlook": ['<div class="mimtoolad">使用139邮箱小工具，快速导入139邮箱通讯录至Outlook/Foxmail',
                        '<a class="ml10" href="javascript:View.changeView(\'ControlDownload\',{key:\'top\'});">立即下载</a>',
                        '<a href="javascript:;" title="关闭" class="mintooladax"><i class="i-del"></i></a>',
                    '</div>'].join(""),
        "outlookBannerTips": ['<div class="ct-box contacts-tips outlookBanner" style="display:block;">',
                                    '<div class="text-c mt5 mb5">快速导入139邮箱通讯录至Outlook/Foxmail</div>',
                                    '<div class="text-c">',
                                        '<a href="javascript:View.changeView(\'ControlDownload\',{key:\'right\'});">',
                                            '<img alt="快速导入139邮箱通讯录到Outlook/Foxmail" src="{0}/m2012/images/module/addr/madnet.png"/>',
                                        '</a>',
                                    '</div>',
                                '</div>'].join(""),
        "calendar": "",
        "remind":"",
        "uncomplete": '<div class="mimtoolad">小提示：请完善姓名为纯数字的邮箱前缀/手机号码、或缺少常用邮箱/手机的联系人资料</div>'
    },
    Template: {
        "fetionico": '<a hideFocus href="javascript:;" onclick="Tool.fetionchat(event, this);return false;" class="a-i j_fxico" title="飞信" name="addr_home_fxico" bh="addr_index_fetionico"><i class="i_phone_feixin"></i></a></td>'
    },

    //最近/紧密联系人来往记录
    tplRecord: _.template('<% _.each(obj, function(i){ %><tr><td width="125"><span class="date" title="<%= i.time %>"><%= _.escape(i.date) %></span><i class="<%= i.AddrType == \'M\' ? \'i-notes-sms\' : \'i-notes-mail\' %>"></i></td><td><span class="text"><%= _.escape(i.title) %></span></td></tr><% }) %>'),

    //几种来往记录
    defaultTitle: {
        E0:"发送了邮件",
        E1:"发送了邮件",
        E2:"发送了贺卡",
        E3:"发送了明信片",

        M1:"发送了短信",
        M2:"发送了彩信贺卡",
        M3:"发送了彩信明信片",
        M5:"发送了彩信",
        F1:"发送了传真"
    },

    tipsType:{
        "outlook":"outlook",
        "IMPORT":"import",
        "login":"login",
        "uncomplete": "uncomplete"
    },
    showTipList: [],
    asyncList:[],
    readyToShow: false,
    tipTimer: null,
    
    //两个分页控件
    lstPageNum1: null,
    lstPageNum2: null,

    encodeAttr: function(str) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\"/g, "&quot;");
        return str;
    },

    renderZeroContactView: function(container) {
        var ZERO_CONTACT = $('#tmpl_zerocontact').html();
        container.append(ZERO_CONTACT);

        container.find('#addservicer').click(function(){
            top.BH('addr_index_addservice');
            //添加联系人
            new top.M2012.UI.Dialog.ContactsEditor({
                name: '客服精灵',
                email: 'service@139.com',
                mobile: ''
            }).render();
        });

        container.find('#cancelservicer').click(function(){
            container.find('.welcomesmall').hide();
        });
    },

    renderGroupView: function() {
        var _groups = window.top.Contacts.data.groups;
        renderGroupList();
        renderCopyTo();
        renderMoveTo();

        if (_groups.length > 12) {
            $("#ulMoveTo, #ulMoveTo2, #ulCopyTo, #ulCopyTo2").css({
                height: 320, overflowY: "scroll"
            });
        }

        function renderGroupList() {
            var container = document.getElementById("ulGroupList");
            var contactsLength = window.top.Contacts.data.contacts.length;
            var realContactsLength = window.top.Contacts.data.TotalRecord;
            var contactsText = "所有联系人(" + realContactsLength + ")";
            var vipinfo =top.Contacts.data.vipDetails;
			var vipCount = vipinfo.vipn;
			var vipGroupId = vipinfo.vipGroupId || "vip";
			if (realContactsLength != contactsLength) {
                contactsText += " 显示" + contactsLength;
            }
			var groupsLen = _groups.length;

            container.innerHTML = "";
            container.innerHTML = '<li><i class="user_vip linkman_vip"></i><em>\
<a hidefocus="" href="javascript:View.changeView(\'ChangeFilter\',{key:\'groupId\',groupId:\'{3}\'});" title="VIP联系人"><span style="padding-left:1px;">VIP联系人</span><span id="vipCount">({2})</span></a></em></li>\
<li><i class="i-normal-user"></i><em><a hideFocus href="javascript:View.changeView(\'LastContacts\')" title="最近联系人">最近联系人</a></em></li>\
<li><i class="i-normal-user"></i><em><a hideFocus href="javascript:View.changeView(\'CloseContacts\')" title="紧密联系人">紧密联系人</a></em></li>\
<hr />\
<li><i class="i-normal-user"></i><em><a hideFocus href="javascript:View.changeView(\'ChangeFilter\',{key:\'groupId\',groupId:\'\'})" title="{0}">所有联系人</a><span>({1})</span></em></li>'.format(contactsText,realContactsLength,vipCount,vipGroupId);

            //未分组联系人
            var addrsNotInGroup = Tool.getContactsNotInGroup();
            container.innerHTML += '<li><i class="i-normal-user"></i><em><a hideFocus href="javascript:View.changeView(\'ChangeFilter\',{key:\'groupId\',groupId:\'-3\'})" title="未分组">未分组</a><span>({0})</span></em></li><hr />'.format(addrsNotInGroup.count);

            if(groupsLen == 0)
            {
                var noGroupHtml=$('<div class="ct-null ct-group-null"><p>暂无自建联系人分组<br>请立即<a class="j_addgroup" href="javascript:" title="新建组" class="tdu">新建组</a></p></div>');
                noGroupHtml.appendTo(container);
                $(container).find("a.j_addgroup").click(function()
                {
                    $("#aAddGroup").click();
                });
            }
            else
            {
                $(_groups).each(function(index) {
                    var li=$('<li rel="{0}"><span class="icon-grp">\
<a hideFocus href="javascript:View.changeView(\'DeleteGroup\',{groupId:\'{0}\'})" title="删除联系人分组" behavior="19_1414删组" class="rg a-i">\
<i class="i-del"></i></a><a hideFocus href="javascript:View.changeView(\'Redirect\',{key:\'editGroup\',groupId:\'{0}\'})" title="编辑联系人分组" behavior="19_1415改组" class="rg a-i">\
<i class="i-edit2"></i></a></span><i class="i-normal-user"></i>\
<em><a hideFocus href="javascript:View.changeView(\'ChangeFilter\',{key:\'groupId\',groupId:\'{0}\'})"></a></em>\
</li>'.format(this.GroupId));
                    li.appendTo(container);
                    var gn = this.GroupName;
                    var text = gn + "(" + this.CntNum + ")";

                    var a = li.find("em>a");
                    a.text(text)
                    a.attr("title", text);

                    //组名带省略号，联系人数量必须显示。
                    while (a.width() > 160) {
                        gn = gn.substring(0, gn.length - 1);
                        text = gn + "…(" + this.CntNum + ")";
                        a.text(text)
                    }
                });
            }
            //滑过组名显示编辑删除操作
            if ($.browser.msie && $.browser.version < 7) {
                $('#ulGroupList > li').hover(function() {
                    $(this).find(".icon-grp").show();
                }, function() {
                    $(this).find(".icon-grp").hide();
                });
            }
        }

        function renderCopyTo() {
            var ul = document.getElementById("ulCopyTo");

            if (!ul) return;
            var htmlCode = [];
            $(_groups).each(function(index) {
                htmlCode.push('<li groupId=\'{0}\'><a href="javascript:View.changeView(\'CopyToGroup\',{groupId:\'{0}\'});" hidefocus="1"><span>{1}</span></a></li>'.format(this.GroupId, Pt.htmlEncode(this.GroupName)));
            })
            htmlCode.push('<li groupId=\'-1\'><a href="javascript:View.changeView(\'CopyContactsToNewGroup\');" hidefocus="1"><span>新建分组...</span></a></li>');
            ul.innerHTML = htmlCode.join("");

            ul = document.getElementById("ulCopyTo2");
            if (!ul) return;
            ul.innerHTML = htmlCode.join("");
        }

        function renderMoveTo() {
            var ul = document.getElementById("ulMoveTo");
            if (!ul) return;

            var htmlCode = [];
            $(_groups).each(function(index) {
                htmlCode.push('<li groupId=\'{0}\'><a href="javascript:View.changeView(\'MoveToGroup\',{groupId:\'{0}\'});" hidefocus="1"><span>{1}</span></a></li>'.format(this.GroupId, Pt.htmlEncode(this.GroupName)));
            })
            ul.innerHTML = htmlCode.join("");

            ul = document.getElementById("ulMoveTo2");
            if (!ul) return;
            ul.innerHTML = htmlCode.join("");
        }
    },
    renderChinaMobileUser:function(){//屏蔽屏蔽互联网帐号功能
        if(top.$User.isChinaMobileUser && !top.$User.isChinaMobileUser()){
            $("#tipSms").parent().hide(); //通讯录首页右下角贴心小功能
        }
    },
    renderControlView: function () {
        var vipinfo = top.Contacts.data.vipDetails;
        var vipgroupId = vipinfo.vipGroupId || "vip";

        //首字母,页记录数,组选中行等的高亮
        if (filter.groupId != "-1" && filter.groupId != "-2" && filter.groupId != vipgroupId) {
            setLetterFocus();
            setPageSizeControlFocus();
            renderGroupLabel();
            Render.bindTableEvent();
            recovervipPageControl();
            switchMenuButton();
			setTabRefresh(filter);
        }
        if (filter.groupId == vipgroupId) {//首字母行隐藏 --MenuButton重新调整--翻页按钮隐藏 //todo-vip组Id需要修改
            renderGroupLabel();
            Render.bindTableEvent();
            vipPageControl();
            switchMenuButton();
        }
        function vipPageControl() {
            $("#firstLetter").hide();
            $("#btn_main_rpage").hide();
            $("#btn_main_rpage2").hide();
            $("#homepagerighttoprg").hide();
        }
        function recovervipPageControl() {
            $("#firstLetter").show();
            $("#btn_main_rpage").show();
            $("#btn_main_rpage2").show();
            $("#homepagerighttoprg").show();
        }
        //renderGroupRowFocus();
        //首字母高亮
        function setLetterFocus() {
            $("#firstLetter >div >div").removeClass("btn4-bg1").find("a").each(function () {
                if ($(this).html().toLowerCase() == filter.firstNameWord.toLowerCase() || ($(this).html().toLowerCase() == "all" && filter.firstNameWord.toLowerCase() == "")) {
                    $(this).parent().parent().addClass("btn4-bg1");
                }
            });
        }
        //页记录条数控制按钮高亮
        function setPageSizeControlFocus() {
            var _pageCount = lstPageNum1.length();
            var _pageTurn = $("#barPageTurn1,#barPageTurn2");

            if (_pageCount < 2) {
                _pageTurn.find("li:has(span)").show();
                _pageTurn.find("li:has(a)").hide();
                return;
            }

            var _pnlPage = $("#pnlPage1, #pnlPage2");
            _pnlPage.height("auto");
            if (_pnlPage.height() > 130) {
                _pnlPage.height("130px");//自动出现滚动条
            }

            if (filter.pageIndex == 0) {
                _pageTurn.find("li:has(a):last").show();
                _pageTurn.find("li:has(span):first").show();
                _pageTurn.find("li:has(span):last").hide();
                _pageTurn.find("li:has(a):first").hide();

            } else if (filter.pageIndex == _pageCount - 1) {
                _pageTurn.find("li:has(span):last").show();
                _pageTurn.find("li:has(a):first").show();
                _pageTurn.find("li:has(a):last").hide();
                _pageTurn.find("li:has(span):first").hide();

            } else {
                _pageTurn.find("li:has(span)").hide();
                _pageTurn.find("li:has(a)").show();
            }
        }

        function renderGroupLabel() {
            var groupTitle = "所有联系人";
            if (filter.groupId == vipgroupId) {
                var vipcount = vipinfo.vipn || 0;
                groupTitle = "VIP联系人(" + vipcount + ")";
            }
            else if (filter.groupId && parseInt(filter.groupId) > 0) {
                groupTitle = window.top.Contacts.getGroupById(filter.groupId).GroupName;
            } else if (filter.groupId == "-3") {
                groupTitle = "未分组联系人";
            }
            $("#divContactsList h4").text(groupTitle);
        }

        function switchMenuButton() {
            var g = top.Contacts.data.groups;
            var btnCopyTo = $("li.mr_10:has([id^=btnCopyTo])");
            var btnMoveTo = $("li.mr_10:has([id^=btnMoveTo])");
            var btnCancelVip = $("li.mr_10:has([id^=DelVip])");
            var btnAddlVip = $("li.mr_10:has([id^=addVip])");

            btnMoveTo.css('margin-right', '10px');
            $("#homepageMenuButDown li").show();
            $("#homepageMenuButTop li").show();
            btnCancelVip.hide();
            btnAddlVip.hide();

            //优先走VIP分组按钮判断逻辑
            if (filter.groupId == vipgroupId) {   //vip联系人 //todo-vip组Id需要修改
                $("#homepageMenuButDown li").hide();
                $("#homepageMenuButTop li").hide();
                btnCopyTo.hide();
                btnMoveTo.hide();
                btnCancelVip.show();
                btnAddlVip.show();
            }

            //再根据分组数量来显示某些按钮
            if (g.length == 0) {
                btnCopyTo.hide();
                btnMoveTo.hide();
                return;
            } else if (g.length == 1) {
                btnMoveTo.hide();
                if (filter.groupId > 0) {
                    btnCopyTo.hide();
                } else {
                    btnCopyTo.show();
                }
            } else {
                if (filter.groupId == "" || filter.groupId == "-3") {
                    btnMoveTo.hide();
                    btnCopyTo.show();
                } else if (filter.groupId != vipgroupId) {
                    btnCopyTo.show();
                    btnMoveTo.show();
                    if ($.browser.msie && $.browser.version < 8) {
                        btnMoveTo.css('margin-right', '8px');
                    }
                }
            }
        }

        function setTabRefresh(filter) {
            if (filter && filter.keyword) {
                var list = Tool.getFilterContacts();
                if (list && list.length <= 0) {
                    var contactTab = top.$App.getTabByName("addr");
                    contactTab && (contactTab.isRendered = false);
                }
            }
        }
    },
    bindTableEvent: function () {
        var contactPanel = $("#tableContactsList");
        contactPanel.find("td:has(a[jpath='name'])").hover(
            function (event) {
                //如果找不到关键元素则不显示
                if (!event.target.parentNode) return;
                if (!event.target.parentNode.cells) return;
                var tds = event.target.parentNode.cells;
                if (!tds[1]) return;
                //如果在快速编辑状态则不显示
                if (tds[1].getElementsByTagName('INPUT').length > 0) return;
                focusRow = tds[1];
                var _evt = event;
                Render.timer = setTimeout(
                    function () { Tool.showControlBar(_evt); Render.timer = false; }, 384
                );
            },
            function (event) {
                if (Render.timer) {
                    clearTimeout(Render.timer);
                    Render.timer = false;
                } else {
                    Tool.hideControlBar();
                }
                if ($(this).find("input:checked").length == 0) {
                    $(this).removeClass('current');
                }
            }
        ).css('cursor', 'pointer');

        //隐藏“和通讯录”入口
        var _this = this;
        _this.closeTip();
        //当通讯录未有记录时，新的显示UI
        var container = $("#divListContainer");
        if(_this.isShowAddrEmpty(container)){
            var isWelcomeExist = container.find(".j_empty_field").size() > 0;
            if (!isWelcomeExist) {
                var cmodel = top.$App.getModel("contacts");
                if (cmodel && cmodel.getContactsCount() === 0) {
                    _this.renderZeroContactView(container);
                }

                container.append(Render.NEW_NULL_CONTACT.format(top.$App.getResourceHost()));
            }
        } else {
            container.find(".j_empty_field").remove();
            if (filter.uncompleted) Render.showUncompleteTip();
        }
    },
    //显示的通讯录内容是否为空
    isShowAddrEmpty:function(container){
        return !container[0].getElementsByTagName('TABLE')[1].rows.length;
    },
    renderContactsList: function(isKeepChecked) {
        //保留之前选中的那些行
        if (isKeepChecked) {
            var lastCheckedContacts = Tool.getSelectedContacts(true);
            $(lastCheckedContacts).each(function() {
                lastCheckedContacts[this] = true;
            });
        }
        var contacts = Tool.getFilterContacts();
        var ft = filter;
        //分页下拉框
		if(ft.needSort){ //按姓名-邮件-电话-排序
			var emailOrder = ft.emailOrder,mobileOrder = ft.mobileOrder,nameOrder = ft.nameOrder;  //1-降序 -1升序
			switch(ft.sortType){
				case "name":{ 
					contacts = Tool.getFilterContacts();
					if(nameOrder<0){
						contacts.reverse();
					}
					filter.setFilter({
						 nameOrder: -nameOrder,
						 mobileOrder: 1,  //初始化手机排序-保证 任何时候第一次点击手机排序时 都是顺序排序-不会出现点击手机-再点姓名-再点手机-时出现倒序
						 emailOrder:1
						 //needSort:false
					});
					break;
				}
				case "email":{
					contacts.sort(function(a,b){
						if(!a.getFirstEmail() && b.getFirstEmail()) return 1;
						if(a.getFirstEmail() && !b.getFirstEmail()) return -1;
						if(!a.getFirstEmail() && !b.getFirstEmail()) return 0;
						return a.getFirstEmail().localeCompare(b.getFirstEmail())*emailOrder;  //emailOrder 取反？？？节省了if判断
					});
					
					var breakIndex = 0,sortBymobile =[],sortByName =[];
					for(var i = 0; i<contacts.length;i++){
						if(contacts[i].getFirstEmail() == ""){
							breakIndex = i;
							break;
						}
					}
					
					if(breakIndex>0){ //电话为空的部分-按姓名排序
						sortBymobile = contacts.slice(0,breakIndex);
						sortByName = contacts.slice(breakIndex,contacts.length);
						sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
						contacts = [];
						contacts= sortBymobile.concat(sortByName);
					}
					filter.setFilter({
						 nameOrder: 1,
						 mobileOrder: 1,
						 emailOrder:-emailOrder
						  //needSort:false
					});
					break;
				}
				case "mobile":{
					
					contacts.sort(function(a,b){ 
						if(!a.getFirstMobile() && b.getFirstMobile()) return 1;
						if(a.getFirstMobile() && !b.getFirstMobile()) return -1;
						if(!a.getFirstMobile() && !b.getFirstMobile()) return 0;
						return a.getFirstMobile().localeCompare(b.getFirstMobile())*mobileOrder;  
					});
					
					var breakIndex = 0,sortBymobile =[],sortByName =[];
					for(var i = 0; i<contacts.length;i++){
						if(contacts[i].getFirstMobile() == ""){
							breakIndex = i;
							break;
						}
					}
					
					if(breakIndex>0){ //邮件为空的部分-按姓名排序
						sortBymobile = contacts.slice(0,breakIndex);
						sortByName = contacts.slice(breakIndex,contacts.length);
						sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
						contacts =[];
						contacts = sortBymobile.concat(sortByName);
					}
					filter.setFilter({
						 nameOrder: 1,
						 mobileOrder: -mobileOrder,
						 emailOrder:1
						 //needSort:false
					});
				   break;
				}
				default:{
					contacts = Tool.getFilterContacts();
					break;
				}
			}
			
		}
		
		
        while (ft.pageIndex > 0 && ft.pageIndex * ft.pageSize >= contacts.length) {
            ft.pageIndex--;
        }
        Render.renderSelectPageIndex(Math.ceil(contacts.length / filter.pageSize));
	
        //分页
        if (contacts.length > ft.pageSize) {
            contacts = contacts.splice(ft.pageIndex * ft.pageSize, ft.pageSize);
        }
        //全选checkbox
        $("#chkSelectAll").attr("checked", null);
        //显示
        var table = document.getElementById("tableContactsList");
        /**2012.05.11
		*pyh 原来onclick="contactsBusinesscard(this);return false;"
		*修改点击联系人函数
		*7.19 还原点击email到写信，点击手机号到发短信
		*/
	    var template ='<tr style="">\
<td class="t b1 t-A"><input type="checkbox" title="选中"></td>\
<td class="t b2" ><a jPath="name" href="javascript:;" onclick = "editContacts(this);return false;" ></a></td>\
<td class="b3"><a hideFocus  href="javascript:;" onclick="sendMail(this);return false;" jPath="email"></a></td>\
<td class="b4"><a hideFocus  href="javascript:;" onclick="sendSMS(this);return false;" jPath="mobile"></a></td>\
<td class="t b6"><a hideFocus href="javascript:;" onclick="QE(this);return false;" class="a-i jico_edit" title="快捷编辑"><i class="i-edit1"></i></a>\
</tr>';
        var templateRow = $(template)[0];

        var tbody = document.createElement("TBODY");
        var E = Pt.htmlEncode;
        var reg = "";
        var kw2 = "<b>$1</b>";
        var enableHigh = ft.keyword.length > 0;

        if (enableHigh) {
            var kw = ft.keyword;
            kw = E(ft.keyword);
            kw = kw.replace(/([\!\\\~\$\^\&\*\(\)\-\+\?\[\]\.])/g, "[\\$1]");
            reg = new RegExp("(" + kw + ")", "ig");
        }


        var _this = this;
        var name, email, mobile;

        $(contacts).each(function() {
            name = E(this.name);
            email = this.getFirstEmail();
            mobile = this.getFirstMobile();

            var tr = templateRow.cloneNode(true);

            if (_this.fetionlogined() && $Mobile.isChinaMobile( Tool.fixmobile(mobile) ) ) {
                $(_this.Template.fetionico).insertAfter($(tr).find(".jico_edit"));
            }

            if (enableHigh) {
                name = name.replace(reg, kw2)
                email = email.replace(reg, kw2);
                mobile = mobile.replace(reg, kw2);
            }

            tr.SerialId = this.SerialId;
            var row = tr.getElementsByTagName("A");
            if(top.Contacts.IsVipUser(tr.SerialId)){
                $('<i class="user_vip"></i>').insertAfter($(tr).find("a[jPath=name]")[0]);
            }

            row[0].innerHTML = name; 
            row[1].innerHTML = email;
            row[2].innerHTML = mobile;

            tbody.appendChild(tr);
            if (isKeepChecked && lastCheckedContacts[this.SerialId]) {
                $(tr).addClass("current").find("input:checkbox").attr("checked", true); //之前选中的行
            }
        });

        table.replaceChild(tbody, table.firstChild);
    },

    fetionlogined: function() {
        try{
            return top.fetion$ && top.fetion$.fxbar.cache.user && !!top.fetion$.fxbar.cache.user.uid;
        } catch (e) {
            return false;
        }
    },

    //初始化分页下拉框
    renderSelectPageIndex: function(pageCount) {
        if (typeof pageCount != "number") {
            return;
        }

        thePageTurnner = new PageTurnner(pageCount, filter.pageIndex);

        var currPageNum = "1";
        if (filter.pageIndex > 0) {
            currPageNum = (filter.pageIndex+1) + "";
        }

        //算出页码
        var pageNum = [];
        for (var i = 1; i <= pageCount; i++) {
            pageNum.push(i + "/" + pageCount);
        }

        $("#btnPage1, #btnPage2").click(function(){
            hideMenu();
        });

        //新建一个页码下拉控件
        lstPageNum1 = new Pt.UI_Menu({
            data: pageNum,
            defaultValue: currPageNum + "/" + pageCount,
            expandButton: $("#btnPage1")[0],
            textField: $("#fieldPage1")[0],
            listContainer: $("#pnlPage1")[0],
            onItemCreate: function(itemData, index, total){
                return ["<li data-index=\"", index, "\"><a href=\"javascript:void(0)\" hidefocus=\"1\"><span>", itemData, "</span></a></li>"].join("");
            },
            onItemClick: function(args){
                var newNum = Number($(args.sender).data("index"));
                thePageTurnner.turnPage(newNum)
            }
        });

        lstPageNum2 = new Pt.UI_Menu({
            data: pageNum,
            defaultValue: currPageNum + "/" + pageCount,
            expandButton: $("#btnPage2")[0],
            textField: $("#fieldPage2")[0],
            listContainer: $("#pnlPage2")[0],
            onItemCreate: function(itemData, index, total){
                return ["<li data-index=\"", index, "\"><a href=\"javascript:void(0)\" hidefocus=\"1\"><span>", itemData, "</span></a></li>"].join("");
            },
            onItemClick: function(args){
                var newNum = Number($(args.sender).data("index"));
                thePageTurnner.turnPage(newNum)
            }
        });

        if (pageCount == 0) {
            //不足一页的情况。
            return;
        }

        thePageTurnner.addPageChangeListener(function(pageIndex) {
            //点上一页、下一页时，更新页码列表里当前页数。
            var pageNumber = parseInt(pageIndex)+1 + "/" + pageCount;
            lstPageNum1.value(pageNumber);
            lstPageNum2.value(pageNumber);

            if (filter.pageIndex == pageIndex) return;
            View.changeView("ChangeFilter", { key: "pageIndex", pageIndex: pageIndex });
        });

        var code = ['<li class="mr_10"><span class="linkTxt gray-ipt">上一页</span></li>'
            ,' <li class="mr_10" style="display:none"><a class="linkTxt" href="javascript:thePageTurnner.previousPage();">上一页</a></li>'
            ,' <li class="mr_10"><a class="linkTxt" href="javascript:thePageTurnner.nextPage();">下一页</a></li>'
            ,' <li class="mr_10" style="display:none"><span class="linkTxt gray-ipt">下一页</span></li>'].join("");
        $("#barPageTurn1, #barPageTurn2").html(code);        
    },

    fixViewData: function (item) {
        var _this = this;

        var typeStr = String(item.AddrType);
        if (typeStr.length < 2) {
            typeStr += item.ComeFrom;
        }

        item.time = item.CreateTime.toLocaleString();
        item.date = $Date.getFriendlyString(item.CreateTime);
        item.title = item.AddrTitle || (_this.defaultTitle[typeStr] || _this.defaultTitle['E0']);
    },

    //构造最近/紧密联系人视图,以下代码逻辑复杂
    renderLastContactsDetail: function() {
        var _this = this;
        var ContactsData = top.Contacts.data;
        var Maps = ContactsData.ContactsMap;
        var lastContactsDetail = ContactsData.lastContactsDetail;
        var contacts = ContactsData.contacts;
        var contactsHasRecord = ContactsData.contactsHasRecord = {};
        var strangerHasRecord = ContactsData.strangerHasRecord = {};
        var isCloseContacts = filter.isCloseContacts;
        var daysBefore = new Date(top.UserData.ServerDateTime);
        var _firstRecord, _deleteKey;

        daysBefore.setDate(daysBefore.getDate() - 90);

        for (var i = 0, len = lastContactsDetail.length; i < len; i++) {
            var item = lastContactsDetail[i];
            _this.fixViewData(item);

            if (isCloseContacts && item.CreateTime < daysBefore) continue;
            var temp = Tool.searchLastContactsInfoBeLong({type: item.AddrType, addr: item.AddrContent.toLowerCase()}, contacts);
            if (temp) {
                item.SerialId = temp.SerialId;

                contactsHasRecord[item.SerialId] = [item].concat(contactsHasRecord[item.SerialId] || []);
            } else {
                item.SerialId = "0";

                strangerHasRecord[item.AddrContent] = [item].concat(strangerHasRecord[item.AddrContent] || []);
            }
            item = null;
            temp = null;
        }

        var contactsHasRecord = top.Contacts.data.contactsHasRecord;
        var htmlTemplate = '<div class="g-s3m0">\
<div class="col-main-s3">\
<div class="col-wrap-s3">\
<div class="tou-info">\
<h5>{name}</h5>\
<p>{email}</p>\
<p>{mobile}\
<div class="btn_normal clear" style="display:block">\
<ul class="btn_main">\
<li class="mr_10"><a hidefocus="1" href="javascript:sendMail({sendMailParam});"><i class="l_border"></i>发邮件<i class="r_border"></i></a></li>\
<li class="mr_10 chinaMobile"><a hidefocus="1" href="javascript:sendSMS({sendSMSParam});"><i class="l_border"></i>发短信<i class="r_border"></i></a></li>\
<li class="mr_10 chinaMobile"><a hidefocus="1" href="javascript:sendMMS({sendMMSParam});"><i class="l_border"></i>发彩信<i class="r_border"></i></a></li>\
<li style="display:#display#" class="mr_10 chinaMobile"><a hidefocus="1" href="javascript:sendFax({sendFaxParam});"><i class="l_border"></i>发传真<i class="r_border"></i></a></li>\
</ul>\
</div>\
<a class="edit-info tdu" href="javascript:editContacts({editKey});">{editText}</a> \
<a class="del-info tdu" href="javascript:deleteLastContactsRecords({deleteKey});">删除记录</a>\
</div>\
<div class="notes">\
<h5>最近联系记录<a style="float:right;margin-right:5px;display:none" href="javascript:" hrefType="viewMore">查看更多</a></h5>\
<table>{recordsHtml}</table>\
</div>\
</div>\
</div>\
<div class="col-side-s3">\
<a href="javascript:" title="" class="tou"><img onload="Tool.fixImage(this)" src="{img}"></a>\
<p class="txt-ct mr10"><a style="display:{emailDisplay};" href="javascript:searchMailRecords({searchKey});" behavior="19_1416往来邮件" class="tdu">查看往来邮件</a></p>\
</div>\
<div class="line-x mt5"></div>\
</div>'.replace("#display#", top.UserData.provCode == "1" ? "" : "none");
		var recordList = document.getElementById("recordList");
        var htmlCode = [];
        var imgProxy = top.ucDomain + "/addr/apiserver/httpimgload.ashx?sid=" + top.$App.getSid() + "&path=";

        for (var serialId in contactsHasRecord) {

            var c = Maps[serialId];
            if (c.ImageUrl) {
                var imagePath = c.ImageUrl;
            } else {
                var imagePath = resourcePath + "/images/face.png";
            }

            var records = contactsHasRecord[serialId];
            _firstRecord = records[0];

            var searchKey = "{serialId:'" + serialId + "'}";
            _deleteKey = "{serialId: " + _firstRecord.SerialId + ", lastId: " + _firstRecord.LastId + " }";

            htmlCode.push({
                count: records.length,
                date: _firstRecord.CreateTime,
                html: new DelayHtml(htmlTemplate, {
                    img: imagePath,
                    serialId: serialId,
                    searchKey: searchKey,
                    deleteKey: _deleteKey,
                    editKey: searchKey,
                    name: top.$T.Html.encode(c.name),
                    emailDisplay: c.emails.length > 0 ? "" : "none",
                    mobileDisplay: c.mobiles.length > 0 ? "" : "none",
                    email: c.getFirstEmail(),
                    mobile: c.mobiles.length > 0 ? top.$T.Html.encode(c.getFirstMobile()) : "",
                    recordsHtml: getRecordsHtml(records),
                    sendMailParam: serialId,
                    sendMMSParam: serialId,
                    sendSMSParam: serialId,
                    sendFaxParam: serialId,
                    editText: "编辑详细资料"
                })
            });
        }
        
        for (var addr in strangerHasRecord) {
            records = strangerHasRecord[addr];
            var _firstRecord = records[0];
            var addrType = _firstRecord.AddrType;
            var addrName = _firstRecord.AddrName;
            var emailDisplay = "none";
            var mobileDisplay = "none";
            var faxDisplay = "none";

            if (addrType == "M") {
                mobileDisplay = "";
            } else if (addrType == "E") {
                emailDisplay = "";
            } else if (addrType == "F") {
                faxDisplay = "";
            }

            searchKey = "{" + {"M": "mobile", "E": "email", "F": "fax"}[addrType] + ":'" + Render.encodeAttr(addr) + "',name:'" + _firstRecord.AddrName + "'}";

            var sendParam = "{addrContent:Tool.getString(" + Tool.saveString(addr) + "),addrType:'" + addrType + "',addrName:Tool.getString(" + Tool.saveString(addrName) + ")}";
            
            _deleteKey = ["{serailId:", _firstRecord.SerialId,",lastId:", _firstRecord.LastId, ",",
                {"M": "mobile", "E": "email", "F": "fax"}[addrType], ": '", Render.encodeAttr(addr),
                "', name: '", _firstRecord.AddrName,"'}"].join('');

            htmlCode.push({
                count: records.length,
                date: _firstRecord.CreateTime,
                html: new DelayHtml(htmlTemplate, {
                    img: resourcePath + "/images/face.png", //2012.08.21 face2--face
                    searchKey: searchKey,
                    deleteKey: _deleteKey,
                    editKey: searchKey,
                    name: _firstRecord.AddrName,
                    emailDisplay: emailDisplay,
                    mobileDisplay: mobileDisplay,
                    email: Pt.htmlEncode(addr),
                    mobile: "(未添加到通讯录)",
                    sendMailDisplay: emailDisplay,
                    sendSMSDisplay: mobileDisplay,
                    sendMMSDisplay: mobileDisplay,
                    sendFaxDisplay: faxDisplay,
                    recordsHtml: getRecordsHtml(records),
                    sendMailParam: sendParam,
                    sendMMSParam: sendParam,
                    sendSMSParam: sendParam,
                    sendFaxParam: sendParam,
                    editText: "添加到通讯录"
                })
            });
        }
        

         /**
         * 后台返回的数据是单条联系记录，需要从前往后，归集到同一联系人名下，优先按serialId，AddrContent次之。
         */
        htmlCode = (function(LD, HC){
            var queue = [];
            var _contactList = $.map(LD, function(k){
                return {"sid": k.SerialId, "addr": k.AddrContent}
            });

            for (i = 0; i < _contactList.length; i++) {
                for (var j = 0; j < htmlCode.length; j++) {
                    if (_contactList[i].sid == HC[j].html.param.serialId 
                    || _contactList[i].addr == HC[j].html.param.email
                    || _contactList[i].addr == HC[j].html.param.mobile){
                        queue.push(HC[j]);
                        HC.splice(j, 1);
                        break;
                    }
                }
            }
            _contactList = null;
            return queue;
        })(lastContactsDetail, htmlCode);

        if (filter.isCloseContacts) {
            htmlCode.sort(function(a, b) {
                return b.count - a.count;
            });
        }

        if (isCloseContacts) {
            if (htmlCode.length > 20) htmlCode.length = 20;
        } else {
            if (htmlCode.length > 50) htmlCode.length = 50;
        }
        for (var i = 0, len = htmlCode.length; i < len; i++) {
            htmlCode[i] = htmlCode[i].html;
        }
        var jqRecordList=$(recordList);
        if (htmlCode.length == 0) {
            $("#nonLastContactsLabel").show();
            recordList.style.display="none";
            $("#btnEmptyLastC").hide();
        } else {
            $("#nonLastContactsLabel").hide();            
            jqRecordList.height("auto");
            $("#btnEmptyLastC").show();
            recordList.scrollTop = 0;  
            //配置参数   
            Render.lastContactsPageSize = 10;     
            Render.lastContactsPageIndex = 0;
            Render.recordsOnlyShow=5;
            Render.lastContactsHtmlArray=htmlCode;  
            var tmpNex="最近";
            if (filter.isCloseContacts) {
                tmpNex="紧密";
            }
            var pagerContainerHtml=['<div class="down" id="divNextPageOfLastContacts">'
                    ,'<div class="btn_normal clear" style="display:inline-block"><ul class="btn_main">'
                        ,'<li class="mr_10"><a hidefocus="1" href="javascript:Render.showNextPageOfLastContacts()"><i class="l_border"></i>显示下'
                        ,Render.lastContactsPageSize
                        ,'个', tmpNex, '联系人<i class="r_border"></i></a></li>'
                ,'</ul></div></div>'].join("");

            recordList.innerHTML=pagerContainerHtml;
            recordList.style.display="block";
            Render.showNextPageOfLastContacts();

            if ($.browser.msie && $.browser.version < 8.0) {
                setTimeout(function(){ $(document.body).hide() }, 0);
                setTimeout(function(){ $(document.body).show() }, 100);
            }
        }

        if (filter.isCloseContacts) {
            $("#lastContactsLabel").text("紧密联系人({0})".format(htmlCode.length));
        } else {
            $("#lastContactsLabel").text("最近联系人({0})".format(htmlCode.length));
        }

        function getRecordsHtml(records) {
            return _this.tplRecord(records);
        }
    },
    //显示下10个最近联系人或紧密联系人
    showNextPageOfLastContacts:function()
    {
        var pageHtmlArray=[];
        for(var i=0;i<Render.lastContactsHtmlArray.length;i++)
        {
            if(i>=Render.lastContactsPageSize*Render.lastContactsPageIndex && i<Render.lastContactsPageSize*(Render.lastContactsPageIndex+1))
            {
                pageHtmlArray.push(Render.lastContactsHtmlArray[i]);
            }
        }       
        var pageHtmlStr=pageHtmlArray.join("");
        var pageHtml=$(pageHtmlStr);
        pageHtml.find(".notes").each(function()
        {
            var obj=$(this);
            var tr=obj.find("table tr");
            tr.each(function()
            {
                if(this.rowIndex>=Render.recordsOnlyShow)
                {
                    obj.find("a[hreftype=viewMore]").show().toggle(function()
                    {
                        tr.show();
                    },
                    function()
                    {
                        tr.hide().each(function()
                        {
                            if(this.rowIndex<Render.recordsOnlyShow)
                            {
                                this.style.display="";
                            }
                        });
                    });
                    this.style.display="none";
                }
            });
        });
        $("#divNextPageOfLastContacts").before(pageHtml);  
        Render.lastContactsPageIndex++;
        if(Render.lastContactsPageSize*Render.lastContactsPageIndex>=Render.lastContactsHtmlArray.length)
        {
            $("#divNextPageOfLastContacts").hide();
        }

        if ($.browser.msie && $.browser.version < 8.0) {
            setTimeout(function(){ $(document.body).hide() }, 0);
            setTimeout(function(){ $(document.body).show() }, 100);
        }
    },

    showFloatTips: function () {
        var _this = this;
        if (top.Contacts.data.TotalRecord <= 0) return; //已显示大的引导内容

        //检查开关，规则。最后根据权重找出需要显示的内容
        //2013-09-09,TODO,此处可以优化为先根据权重查找,再请求接口
        var list = _this.showTipList;
        var type = _this.tipsType;

        if (list && list.length == 0) {
            _this.asyncList = [];
            var siteConfig = top.SiteConfig || {};

            //加入outlook浮层提示条
            _this.asyncList.push(true);
            var confOutlook = siteConfig["showOutlookTool"];
            if (confOutlook) {
                list.push(type.outlook);
            }

            //（在未有批量接口之前，异步请求使用彩云同样的方式，调用接口，成功后将结果push到全局变量showTipList中）
            //检查“和通讯录”部分
            var confCaiYun = siteConfig["showCaiYun"];
            if (confCaiYun) {
                _this.asyncList.push(false);
                var ccIndex = _this.asyncList.length - 1;
                _this.getColorCloudData(ccIndex);
            }
        }

        //延迟显示浮层,以解决彩云和生日提醒超时的情况
        var timeout = 3000;
        if (_this.readyToShow) { timeout = 0; } //已经显示过
        _this.tipTimer = setTimeout(function () {
            _this.execShowTips(true);
        }, timeout);
    },

    //正式显示浮层
    //@parm list {Array} 可供显示的类型列表
    //@parm force {Boolean} 是否强制显示，如果是，则不判断异步请求是否返回
    execShowTips: function (force) {
        var _this = this;
        var list = _this.showTipList;

        //非强制显示，未显示过，并且有未完成的异步请求时，返回
        if (!force && (_this.readyToShow || $.inArray(false, _this.asyncList) > -1)) {
            return;
        }

        //移除cookie中设定为不显示的
        list = _this.filterTips();

        if (list && list.length > 0) {
            clearTimeout(_this.tipTimer);

            //计算权重,比例
            var per = 1 / list.length; 
            var index = Math.floor(Math.random() / per); //计算随机出来所落在的区间
            var type = list[index]; //获取最后需要显示的类型

            _this.showTipList = [type]; //保存最后显示的
            _this.readyToShow = true;   //标记为可显示状态

            _this.closeTip();
            _this.showTip(type);
        }
    },

    //过滤已经点击过关闭按钮的浮层
    filterTips:function(){
        var _this = this;
        var types = _this.tipsType;
        var list = _this.showTipList;

        for (var i = list.length - 1; i >= 0; i--) {
            var key = list[i];
            if (top.$Cookie.get(key) == "true") {
                _this.showTipList.splice(i, 1);
            }
        }
        return _this.showTipList;
    },

    //是否不现实该浮层（通过cookie检测）
    isHideTip:function(key){
        var _this = this;
        return top.$Cookie.get(key) == "true";
    },

    //隐藏提示浮层
    closeTip: function (type) {
        if (type) {
            var _this = this;
            top.$Cookie.set({ "name": type, "value": true }); //下次不显示
            _this.showTipList = [];
            _this.closeTip();
        }
        else {
            var tips = $("#firstLetter~.mimtoolad");
            tips.remove(); //移除提示条
        }
    },

    //显示浮层
    showTip:function(type){
        if (type) {
            var _this = this;
            var template = _this.TOOLTIPS[type];
            if (template) {
                var _this = this;
                _this.closeTip();
                var firstLetter = $("#firstLetter");
                firstLetter.after(template);

                $(".mintooladax").unbind("click").bind("click", function () {
                    _this.closeTip(type);
                });
            }
        }
    },

    showUncompleteTip:function(){
        var _this = this;
        _this.showTip(_this.tipsType.uncomplete);
    },

    getColorCloudData: function (index) {
        var _this = this;
        var addrSum = top.Contacts.data.TotalRecord;

        if (addrSum <= 10) {
            //0<addrSum<=10时，显示彩云导入引导层
            _this.showTipList.push(_this.tipsType.IMPORT);
            _this.asyncList[index] = true; //标记为已处理完
            return;
        }

        //addrSum>10时，需要根据用户在“和通讯录”的状态来分别显示信息
        top.Contacts.getColorCloudInfoData(function (res) {
            var S_OK = "0";
            if (res && res.ResultCode && res.ResultCode == S_OK) {
                var caiyun = res.ColorCloudInfo;
                var key = {
                    registered: "Registered",
                    count: "Count",
                    update: "Update",
                    lastupdate: "LastUpdate"
                };
                var allRegStatus = { //状态列表
                    "yes": true, //已开通
                    "no": false, //未注册
                    "noEnable": false //统一认证后,未激活“和通讯录”
                };

                var regStatus = caiyun && caiyun[key.registered];
                var isRegistered = allRegStatus[regStatus]; //是否已注册
                if (!isRegistered) {
                    //addrSum>10 且 未开通“和通讯录”时，显示“去彩云看看”引导层
                    _this.showTipList.push(_this.tipsType.login); //加入列表，后续根据权重显示
                }
                else {
                    var count = caiyun && caiyun[key.count];
                    var update = caiyun && caiyun[key.update];
                    var lastupdate = caiyun && caiyun[key.lastupdate];

                    /*
                        要求以下条件全部满足时才显示:
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        通讯录数量超过10条（addrSum>10)
                        已注册“和通讯录”(registered=yes等)
                        “和通讯录”中有数据(count>0)
                        导入过“和通讯录”（lastupdate时间不为空）
                        “和通讯录”有更新（update>0）
                    */
                    if (count>0 && lastupdate && update > 0) {
                        //_this.showTipList.push(_this.tipsType.import);
                        var link = $("#liColorCloud a");
                        link.text("“和通讯录”更新(" + update + ")");

                        link.parent().show();
                        link.unbind("click").bind("click", function () {
                            top.BH({ actionId: 104456 });
                            View.changeView('Redirect', { key: 'addr_import_pim' });
                        });
                    }
                }
            }

            _this.asyncList[index] = true; //标记为已处理完
            _this.execShowTips();
        });
    },

    //显示右下角outlook提示条，Outlook插件（邮箱小工具）
    showOutlookTips: function () {
        var config = top.SiteConfig && top.SiteConfig["showOutlookTool"];
        if (config) {
            var _this = this;
            var tooltips=_this.TOOLTIPS;
            var bannerContainer = $("aside");
            var imgdomain = top.$App.getResourceHost();
            var html = tooltips.outlookBannerTips.format(top.$App.getResourceHost());
            bannerContainer.append(html);
        }
    }
}

function DelayHtml(pattern,param){
    this.pattern = pattern;
    this.param = param;
}

DelayHtml.prototype.toString = function() {
    return M139.Text.Utils.format(this.pattern, this.param);
}
﻿var View = {
    orderName: "al",
	isShowNormalGroup:true,
    orderDefault: function() {        
        if(mail139.addr.home.isediting)
        {
            return;        
        }
        Render.renderContactsList();
        Render.renderControlView();
    },
    change: function(func) {
        this.listeners.push(func);
    },
    onchange: function(args) {
        $(this.listeners).each(function() {
            this(args);
        })
    },
    listeners: [],
    //初始化整个界面
    init: function() {
        $("#totalRecord").text(top.Contacts.data.TotalRecord);

        var groupName = Pt.param("groupname");
		var groupId = Pt.param("groupid") || "";

		if (groupName && groupName!= "vipgroup") {
			var g = top.Contacts.getGroupByName(groupName);
			if (!g) {
				var m = window.location.href.match(/groupname=([^&]+)/i);
				try {
					groupName = decodeURI(m[1]);
					g = top.Contacts.getGroupByName(groupName);
				} catch (e) { }
			}
			if (g) {
				groupId = g.GroupId;
			}
		}else if(groupName == "vipgroup"){
		//vip联系人页面初始化 Links.show("addrvipgroup"); 跳到vip管理页面再点击分组的时候groupName一直存在没有改变(URL里的参数)，所有需要另外设置参数一起决定
			View.isShowNormalGroup = false;
			var vipgroup = top.Contacts.data.vipDetails;
			groupId = vipgroup.vipGroupId || "vip";
		}
		
		//用户当前页     
		var pageid = Pt.param("pageId");
		if(pageid && pageid !="")
		{
			pageid = parseInt(pageid);
		}else{
			pageid = 0;
		}    

		var keyword = Pt.param("keyword");
		filter.setFilter({
			firstNameWord: "All",
			groupId: groupId,
			keyword: keyword || "",
			pageIndex: pageid,
			pageSize: Tool.getPageSizeCookie()
		});

        Render.renderGroupView();
        Render.renderContactsList();
        Render.renderControlView();
        Render.renderChinaMobileUser();

    },
    //查看某组
    setGroupView: function(groupId) {
		var vipGroup = top.Contacts.data.vipDetails;
		var vipGroupId = vipGroup.vipGroupId ||"vip";
		View.isShowNormalGroup = (groupId != vipGroupId);
        
		if (View.isShowLastOrCloseContacts) {
            View.hideLastContacts();
        }
        filter.setFilter({
            firstNameWord: "All",
            groupId: groupId,
            keyword: "",
            pageIndex: 0
        });
        if(filter.uncompleted)
        {
            Render.showUncompleteTip();
            if(groupId !="" && groupId !="-3")
            {
                return;
            }
        }        
        if(groupId=="" || groupId == "-3")
        {
            mail139.addr.home.setHomeUncompleted();
            filter.setFilter({
                firstNameWord: "All",
                groupId: groupId,
                keyword: "",
                pageIndex: 0
            });
        }
        Render.renderContactsList();
        Render.renderControlView();
    },
    //首字母
    setFirstNameWord: function(letter) {
        filter.setFilter({
            firstNameWord: letter,
            keyword: "",
            pageIndex: 0
        });
        if(letter && letter=="All")
        {
            mail139.addr.home.setHomeUncompleted();
        }
        Render.renderContactsList();
        Render.renderControlView();
    },
    //变更页记录数20,50,100
    setPageSize: function(size) {
        filter.setFilter({
            pageIndex: 0,
            pageSize: size
        });
        Tool.setPageSizeCookie(size);
        Render.renderContactsList();
        Render.renderControlView();
    },
    //翻页
    turnPage: function(pageIndex) {        
        filter.setFilter({
            pageIndex: pageIndex
        });
        Render.renderContactsList();
        Render.renderControlView();
        var listContainer = document.getElementById("divListContainer");
        listContainer.scrollTop = 0;
    },
    //搜索
    doSearch: function(keyword) {
        filter.setFilter({
            groupId: "",
            firstNameWord: "All",
            keyword: keyword,
            pageIndex: 0
        });
        Render.renderContactsList();
        Render.renderControlView();
        if (View.isShowLastOrCloseContacts) {
            View.hideLastContacts();
        }
    },
    //显示最近/紧密联系人
    showLastOrCloseContacts: function(isCloseContacts) {
        View.isShowLastOrCloseContacts = true;
        top.WaitPannel.show("加载中，请稍候......");
        window.top.Contacts.getLastContactsDetail(function(result) {
            if (result.success) {
                $("#divContactsList").hide();
                $("#divLastContacts").show();

                filter.groupId = isCloseContacts ? "-2" : "-1";
                window.top.Contacts.data.lastContactsDetail = result.list;
                Render.renderLastContactsDetail();
                Render.renderControlView();
            } else {
                Pt.alert(PageMsg.error_sysbusy);
            }
            top.WaitPannel.hide();
        }, filter.isCloseContacts);
    },
    hideLastContacts: function() {
        $("#divContactsList").show();
        $("#divLastContacts").hide();
        View.isShowLastOrCloseContacts = false;
        //resizeAll();
    },
    dataUpdate: function(type) {
        if (type == "AddGroup") {
            Render.renderGroupView();
            Render.renderControlView();
        } else if (type == "DeleteGroup") {
            if (!top.Contacts.getGroupById(filter.groupId)) {
                filter.groupId = "";
            }
            Render.renderGroupView({needCount:true});
            Render.renderContactsList();
            Render.renderControlView();
        } else if (type == "DeleteContacts") {
            Render.renderGroupView({needCount:true});
            Render.renderContactsList(true);
            Render.renderControlView();
        } else if (type == "CopyContactsToGroup") {
            Render.renderGroupView({needCount:true});
            Render.renderContactsList();
            Render.renderControlView();
        } else if (type == "MoveContactsToGroup") {
            Render.renderGroupView();
            Render.renderContactsList();
            Render.renderControlView();
        }
    },
    changeView: function(type, param) {   //是否有请求发到通讯录后台。还没有返回的
        //if (!top.Contacts.allowChangeView()) {
        //    top.$Msg.alert(PageMsg.info_waiting);
        //    return;
        //}
        switch (type) { 
            case "sync":
                top.addBehaviorExt({ actionId: 102542, thingId: 0, moduleId: 14 });
                top.$App.show("syncguide");
                break;  
            case "Invite":
            {
                if(!mail139.addr.home.isediting)
                {
                    top.Links.show("invite");
                }
                break;
            }
            case "SendMail":
                {
                    redirectCompose();
                    break;
                }
            case "SendSMS":
                {
                    redirectSMS("");
                    break;
                }
            case "SendMMS":
                {
                    redirectMMS();
                    break;
                }
            case "Redirect":
                {                    
                    if(!mail139.addr.home.isediting)
                    {
                        if (param.key == "share") {
                            top.BH({ actionId: 104523, thingId: "0", moduleId: 19, actionType: 10 });
                        }
                        if (param.key == "whoaddme") {
                            top.BH({ actionId: 104538, thingId: "0", moduleId: 19, actionType: 10 });
                        }
                        Tool.showFrame(param);
                    }
                    break;
                }
            case "DeleteGroup":
                {                    
                    if(!mail139.addr.home.isediting)
                    {
                        deleteGroup(param.groupId);
                    }
                    break;
                }
            case "Sort":
                {
                    Render.renderContactsList();
                    Render.bindTableEvent();//修改排序之后
                    break;
                }
            case "SendFax":
                {
                    redirectFax();
                    break;
                }
            case "SendGCard":
                {
                    redirectGCard();
                    break;
                }
            case "SendPCard":
                {
                    redirectPCard();
                    break;
                }
                //已完成跳转部分
            case "ChangeFilter":
                {
                    if (mail139.addr.home.isediting) return;
                    QuickEditServer.haveEdit = false;
					//保持原来的排序
					var ft = filter;
					if(ft.needSort){
						switch(ft.sortType){
							case "email" :
									filter.setFilter({
										emailOrder: - ft.emailOrder
									});
									break;
							case "mobile":
								filter.setFilter({
										mobileOrder: - ft.mobileOrder
									});
									break;
							
							default :
								filter.setFilter({
										nameOrder: - ft.nameOrder
									});
									break;
						}
					}//--end 保持排序
					
                    switch (param.key) {
                        case "firstNameWord":
                            {
                                Render.closeTip(); //隐藏黄色提示浮层
                                View.setFirstNameWord(param.firstNameWord);
                                break;
                            }
                        case "pageSize":
                            {
                                View.setPageSize(param.pageSize);
                                break;
                            }
                        case "keyword":
                            {
                                View.doSearch(param.keyword);
                                break;
                            }
                        case "groupId":
                            {
                                top.addBehaviorExt({
                                    actionId: 1402
                                    , thingId: param.groupId ? 4 : 3
                                    , moduleId: 19
                                });
                                Render.closeTip(); //隐藏黄色提示浮层
                                View.setGroupView(param.groupId);
                                break;
                            }
                        case "pageIndex":
                            {
                                View.turnPage(param.pageIndex);
                                break;
                            }
                    }
                    break;
                }
            case "LastContacts":
                {
                    if (mail139.addr.home.isediting) return;
                    filter.isCloseContacts = false;
                    View.showLastOrCloseContacts(filter.isCloseContacts);
                    top.addBehaviorExt({ actionId: 1402, thingId: 1, moduleId: 19 });
                    //top.addBehaviorExt({ actionId:19401, thingId:0, moduleId:19 });
                    break;
                }
            case "CloseContacts":
                {
                    if (mail139.addr.home.isediting) return;
                    filter.isCloseContacts = true;
                    View.showLastOrCloseContacts(true);
                    top.addBehaviorExt({ actionId: 1402, thingId: 2, moduleId: 19 });
                    //top.addBehaviorExt({ actionId:19402, thingId:0, moduleId:19 });
                    break;
                }
            case "CopyToGroup":
                {
                    copyContactsToGroup(param.groupId);
                    break;
                }
            case "MoveToGroup":
                {
                    moveContactsToGroup(param.groupId);
                    break;
                }
            case "DeleteContacts":
                {
                    if (mail139.addr.home.isediting) return;
                    deleteContacts(param.serialId);
                    //top.addBehavior("19_1407删除联系人");
                    break;
                }
            case "CopyContactsToNewGroup":
               {
                    copyContactsToNewGroup();
                    break;
               }
            case "ControlDownload":
                {
                    var key = param && param.key;
                    if (key) {
                        switch (key) {
                            case "top":
                                top.BH({ actionId: 104303 });
                                break;
                            case "right":
                                top.BH({ actionId: 104305 });
                                break;
                            default:
                                break;
                        }
                    }

                    top.Utils.openControlDownload();
                    break;
                }
            case "birthRemind": {
                top.BH({ actionId: 104465 });
                Render.addRemindBirthdays();
            }
        }
    }
};

﻿var Tool = {
    //得到选中的联系人
    getSelectedContacts: function(onlyId) {
        var result = [];
        $("#tableContactsList input:checkbox:checked[id!='chkSelectAll']").each(function() {
            var cid = Tool.getRowContactsId(this);
            if (onlyId) {
                result.push(cid);
            } else {
                var item = window.top.Contacts.getContactsById(cid);
                if (item) result.push(item);
            }
        })
        return result;
    },
    //得到筛选后的联系人列表
    getFilterContacts: function() {
        var contacts;
        var ft = filter;
        if(ft.uncompleted)
        {
            contacts = [];
            var contactsMap=top.Contacts.data.ContactsMap;
            var sids=ft.uncompleted;
            if ('string' == typeof sids) {
                sids = sids.split(',');
            }

            for(var i=0;i<sids.length;i++)
            {
                var item = contactsMap[sids[i]];
                if (item) contacts.push(item);
            }
            contacts.sort(function (first, second) {
                //按照现网规则排序一次
                var qp1 = first.Quanpin || first.AddrFirstName,
                    qp2 = second.Quanpin || second.AddrFirstName;
                var num1 = qp1 - 0,
                    num2 = qp2 - 0;
                if (num1 && num2) {//都是数字
                    return num1 - num2;
                }
                else if (!num1 && !num2) {//都不是数字
                    return qp1.localeCompare(qp2);
                }
                else {
                    return num1 ? 1 : -1; //字母的排在前面，数字的后面
                }
            });
            return contacts;
        }
        //筛选组
        var vipGroup = top.Contacts.data.vipDetails;
        var vipGroupId = vipGroup.vipGroupId ||"vip";
        var vipCount = vipGroup.vipn || 0;
        if (ft.groupId) {
            //未分组
            if (ft.groupId == "-3") {
                var addrNotInGroup = Tool.getContactsNotInGroup().contactsMap;
                contacts = [];
                var contactsMap = top.Contacts.data.ContactsMap;
                for (var i=0; i<addrNotInGroup.length; i++) {
                    var obj = contactsMap[addrNotInGroup[i]];
                    if (obj) contacts.push(obj);
                }
            }else if(ft.groupId == vipGroupId){ //vip联系人组后台没有传递映射关系过来，所有点击vip联系人组是，要手动组装vip联系人-vip联系人最多20人
                var vipContactsSid = "";
                if(vipCount >0){
                    vipContactsSid = vipGroup.vipSerialIds.split(",");
                    var tmpvipContacts = [];
                    for(var i = 0; i< vipContactsSid.length;i++){
                        var vip = top.Contacts.getContactsById(vipContactsSid[i]);
                        if(vip){
                            tmpvipContacts.push(vip);
                        }
                    }
                    contacts = tmpvipContacts;
                }else{
                    contacts = [];
                }
            } else {
                contacts = window.top.Contacts.getContactsByGroupId(ft.groupId);
            }
        } else {
            //所有联系人的操作均会触发
            var fw = ft.firstNameWord;
            if (fw == "" || fw == "All") {
                //查询字母时不显示浮层
                Render.showFloatTips();
            }
            contacts = [].concat(window.top.Contacts.data.contacts);
        }
        //搜索关键字
        if (ft.keyword) {
            var searchResult = []
            for (var i = 0; i < contacts.length; i++) {
                var item = contacts[i];
                if (item.search(ft.keyword)) {
                    searchResult.push(contacts[i]);
                }
            }
            contacts = searchResult;
        }
        var result = [];
        //首字母
        if (ft.firstNameWord.length == 1) {
            var firstNameWord = ft.firstNameWord.toLowerCase();
            for (var i = 0; i < contacts.length; i++) {
                var item = contacts[i];
                if (item.FirstNameword && item.FirstNameword.toLowerCase() == firstNameWord) {
                    result.push(item);
                }
            }
            return result;
        }
	
        return contacts;

    },
    //根据一个tr里的页面元素得到该tr对应的联系人id
    getRowContactsId: function(tag) {
        while (tag) {
            if (tag.tagName == "TR") {
                return tag.SerialId;
            }
            tag = tag.parentNode;
        }
        return null;
    },
    //外链跳转
    showFrame: function(param) {
        var links = {
            "share"         : "addr_share_home.html?check=1&sid=" + Pt.getSid(),
            "importI"       : Pt.ucDomain("/addr/matrix/input/default.aspx?sid=" + Pt.getSid()), //导入：彩云，其他邮箱

            "importClient"  : "addr_importclient.html?check=1&sid=" + Pt.getSid(),//导入：客户端,check=1表示检查控件是否安装
            "myinfo"        : "addr_detail.html?type=myinfo&sid=" + Pt.getSid() + "&pageId=" + filter.pageIndex,//我的资料
            "editContacts"  : "addr_detail.html?type=edit&id=" + param.serialId + "&pageId=" + filter.pageIndex,
            "sendBuzzCard"  : "addr_detail.html?type=mybusinesscard&sid=" + Pt.getSid() + "&sendto=" + param.receiver + "&pageId=" + filter.pageIndex,
            "addContacts"   : "addr_detail.html?type=add",//old备份到此为new
            "addGroup"      : "addr_group.html?sid=" + Pt.getSid(),
            "editGroup"     : "addr_group.html?id=" + param.groupId,
            "whoaddme"      : "addr_maybeknown.html",
            "input"         : "addr_import_file.html?sid=" + Pt.getSid(),
            "output"        : "addr_export.html?sid=" + Pt.getSid(),
            "merge"         : "addr_merge.html?sid=" + Pt.getSid(),
            "updateContacts": "addr_updatecontact.html?sid=" + Pt.getSid(),
            "mybusinesscard": "addr_businesscard.html?type=mybusinesscard&sid=" + Pt.getSid() + "&pageId=" + filter.pageIndex,
            "addr_import_pim": "addr_import_pim.html?sid=" + Pt.getSid(),
            "addr_import_file": "addr_import_file.html?sid=" + Pt.getSid(),
            "addr_import_clone": "addr_import_clone.html?sid=" + Pt.getSid()
        };
        var linksRouter = {
            "baseData": "baseData",
            "setPrivate": "setPrivate"
        };
        var link = links[param.key];
        if (param.key == "addContacts" && !param.serialId) {
            link += "&email={0}&mobile={1}&fax={2}&name={3}".format(
                escape(param.email || ""),
                escape(param.mobile || ""),
                escape(param.fax || ""),
                escape(param.name || "")
            );
        }
        else if (param.key == "importI" && param.type) {
            link += "&showtype=" + param.type;
            link += "&isweb2=1"; //标准版不做修改
        }else if(param.key == 'addr_import_pim' && param.type){
            link += "&showtype=" + param.type;
            link += "&isweb2=1"; //标准版不做修改
        }// add  change by jinrui 2014.02.13

        if(param.key == "whoaddme"){            
            if(mail139.addr.home){
                if(mail139.addr.home.relationId){
                    link += "?relationId=" + mail139.addr.home.relationId +"&r="+Math.random();
                }else if(mail139.addr.home.uinId){
                    link += "?uinId=" + mail139.addr.home.uinId +"&r="+Math.random();
                }else{
                   link += "?r="+Math.random(); 
                }                
            }else{
               link += "?r="+Math.random(); 
            }
        }


        if (!link) link = param.url;
        if (filter.groupId && parseInt(filter.groupId)>1){
            var and = link.indexOf('?')>-1 ? '&' : '?';
            link += and + 'groupid='+filter.groupId;
        }
        if (linksRouter[param.key]) {
            //优先调用LinksConfig配置，不用配置2次url
            top.$App.show(linksRouter[param.key]);
            return;
        }
        window.location.href = link;
    },
    showControlBar: function(e) {
        var trObj = $(focusRow.parentNode);
		
        var serialId = trObj[0].SerialId;
        if (typeof serialId === 'undefined') return;

        var info = top.Contacts.getContactsById(serialId); //联系人信息
        var htmlCode = "";
        
		var warpDiv ='<div id="controlBar" style="background:white;z-index: 20; position: absolute; top: 2px; left: 0px; display: none;box-shadow: 1px 2px 3px #CCC; -webkit-box-shadow: 1px 2px 3px #CCC; -moz-box-shadow: 1px 2px 3px #CCC; -o-box-shadow: 1px 2px 3px #CCC; " class="menuWrap w"></div>'; 
		htmlCode =' <div class="mPop" style="width:342px; border:1px solid #b0b0b0;">\
    <table class="attrCard" width="100%" id="attrCardPanel">\
      <tbody>\
        <tr>\
          <td>\
           <span class="cotect_dir" ><i class="b22">◆</i><i class="o2">◆</i></span>\
           <span class="cotect_dir2" ><i class="b">◆</i><i class="o">◆</i></span>\
            <div class="short" id="usrInfoArea"><div class="clearfix">\
             <div class="fl" style="margin:16px 20px 0 20px; height:68px;"><a hidefocus="" href="javascript:;" class="head_portrait" onclick="editContacts(this);return false;" behavior="在通讯录页联系人列表弹出联系人通用属性卡_头像"><img id="imgHead"  src="{0}" class="pic" style="width:48px;height:48px;"></a></div>\
              <div class="fl vip_phone" style="padding-top: 4px; _padding-top:8px;">\
                <h2 rel="name" title="{8}">{1}<i id="vipIcon" class="{5}" command= "{7}" title="{6}" ></i></h2>\
                <p><a title="写邮件" rel="email" href="javascript:;" command="gotoCompose" class="fe c_666">{2}</a></p>\
                <p><a behavior="写短信" class="fe c_666" href="javascript:void(0);"  command="gotoSMS">{3}</a></p> \
             </div>\
             </div> \
             <div class="getMail">\
              <table>\
                <tbody>\
                  <tr style="cursor:pointer; position:relative;">\
                    <td style="border-left:0;"><em class="fcI" command="editContacts">编辑</em></td>\
                    <td><em behavior="属性卡-发邮件" class="fcI" command="gotoCompose">发邮件</em></td>\
                    <td><em behavior="属性卡-发短信" class="fcI chinaMobile" command="gotoSMS">发短信</em></td>\
                    <td  style="border-right:0;"><em behavior="更多" class="fcI" command="moreMenu">更多</em><i class="contact_more"></i> </td>\
                  </tr>\
                </tbody>\
              </table>\
			   <ul  id= "moreLinksInGetMail" rel = "moreLinksInGetMail" class="toolBar_listMenu contact_listMeau" style="display:none; position:absolute;left:343px;top:49px; top:58px\\0;border:1px solid #b0b0b0;">\
                <li><a href="javascript:void(0);" command="gotoMailFilter" class="fcI" behavior="联系人页卡-设置邮件分拣"><em command="gotoMailFilter" class="fcI chinaMobile" behavior="联系人页卡-设置邮件分拣">创建收信规则</em></a></li>\
                <!-- 功能不完善 li><a href="javascript:void(0);" command="addTag" class="fcI" behavior="联系人页卡-设置自动标签"><em command="addTag" class="fcI" behavior="联系人页卡-设置自动标签">设置自动标签</em></a></li -->\
                <li><a href="javascript:void(0);" command="gotoMailNotify" class="fcI chinaMobile"><em command="gotoMailNotify" class="fcI">设置邮件到达通知</em></a></li>\
                <!-- 功能不完善  li style="display:{4}" rel="inviteFriend" ><a href="javascript:void(0);" command="inviteFriend" class="fcI" ><em command="inviteFriend" class="fcI chinaMobile" >邀请</em></a></li -->\
                <li><a href="javascript:void(0);" command="searchLetters" class="fcI" behavior="联系人页卡-往来邮件"><em command="searchLetters" class="fcI" behavior="联系人页卡-往来邮件">往来邮件</em></a></li>\
              </ul>\
            </div>\
           </div>\
            </td>\
        </tr>\
      </tbody>\
    </table>\
  </div>';

    
                

        var headImg = info.ImageUrl;
        
		//姓名 电话 邮件显示
        var name = trObj.find("a[jpath=name]").text();
        var email = trObj.find("a[jpath=email]").text();
        var mobile = trObj.find("a[jpath=mobile]").text();
        var _name = "";
        if (name) {
            _name = top.M139.Text.Utils.getTextOverFlow2(name, 20, true);
        } else {
            name = "";
        }
        var _email = "";
        if (email) {
            _email = email;
        } else {
            email = "";
        }
        var _mobile = "";
        if (mobile) {
            _mobile = mobile;
        } else {
            mobile = "";
        }

        if(name != "")
        {
            name = Pt.htmlEncode(name);
        }
        if(_name != "")
        {
            _name = Pt.htmlEncode(_name);
        }

        if (email != "" && email.length > 26) {
            _email = email.substring(0, 25) + "…";
        }

        if (mobile != "" && mobile.length > 26) {
            _mobile = mobile.substring(0, 25) + "…";
        }

        //判断是否是139邮箱
        var inviteFriendCss = "none";
		if(email.indexOf("@139.com") == -1){
			 inviteFriendCss ="";
		}
		
		//text
		var vipMsg = ADDR_I18N[ADDR_I18N.LocalName]["vip"];
		
		//vip标示显示控制
		var isVip = top.Contacts.IsVipUser(serialId);
		var vipIconClass = "user_gray_vip";
		var vipCommand = "addVip";
		var vipTitle = vipMsg.setVipTip;
		if(isVip){
			vipIconClass ="user_vip";
			vipCommand = "cancelVip";
			vipTitle = vipMsg.cancelVipTip;
		}
		
		var newhtmlCode = htmlCode.format(headImg, _name, _email, _mobile,inviteFriendCss,vipIconClass,vipTitle,vipCommand, name);
        var obj = $("#controlBar");
		
		if (obj.length==0) {
            obj = $(warpDiv);
        } else {
            obj.html(warpDiv);
        }
		$(newhtmlCode).appendTo($(obj));
		//位移控制
		var p = $(focusRow).offset();
		var _top = 0;
		var ey = e.pageY;
		var MenuHeight = 129;
		var bodyHeight = top.window.document.body.clientHeight; //窗口高度
			_top = bodyHeight-  p.top - 86 > MenuHeight ? p.top +24 : p.top - MenuHeight + 22 ;
		obj.appendTo(focusRow).css({
            "display": 'none',
            "left": 49,
            "top": _top
        }).unbind("click").click(function(e) {
            if (e.target.tagName == "A") {
                setTimeout("Tool.hideControlBar()", 16);
            }
        });
		if(bodyHeight-  p.top - 86 > MenuHeight){//86 
			$("#controlBar").find('span.cotect_dir').show();
			$("#controlBar").find('span.cotect_dir2').hide();
		}else{
			$("#controlBar").find('span.cotect_dir').hide();
			$("#controlBar").find('span.cotect_dir2').show();
		}
		
        //事件绑定
		var contactsData = {serialId: serialId,email : email,name :name , mobile : mobile};
		
		//更多
		obj.find("em[command=moreMenu]").click(function(e){
			gotoMoreMenu(e);
		});
		
		//添加vip联系人
		obj.find("*[command=addVip]").click(function(){
			top.addBehaviorExt({ actionId: 102044, thingId: 0, moduleId: 14 });
			Tool.hideControlBar();
			if(contactsData.email != ""){
				addSinglVipInCard(contactsData);
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "AddVip";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
		});	
		
		//取消vip联系人delSinglVipInCard	
		obj.find("*[command=cancelVip]").click(function(){
			top.addBehaviorExt({ actionId: 102045, thingId: 0, moduleId: 14 });
			Tool.hideControlBar();
			function cancelVip(){
				delSinglVipInCard(contactsData);
			}
			top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip );
		});		
		
		//编辑
		obj.find("em[command=editContacts]").click(function(){
			//editContactsInCard(contactsData);
            editContacts(contactsData);
			Tool.hideControlBar();
		});	
		 
		//邀请
		obj.find("a[command=inviteFriend]").click(function(){
			Tool.hideControlBar();
			if(contactsData.email != ""){
				//inviteFriendInCard(contactsData);
                top.$App.jumpTo('invitebymail', {
                    email: contactsData.email
                });
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "inviteFriend";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
			
		});	
		
			
		//快捷发邮件	
		obj.find("*[command=gotoCompose]").click(function(){
			Tool.hideControlBar();

            if (contactsData.email == "") {
                sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
                sendCantactServer.sendType = "Mail";
                sendCantactServer.hoverRow = trObj[0];
                if (!sendCantactServer.CheckContactType("e")) {
                    return;
                }
            }

            if (contactsData.email) {
                var args = { receiver: M139.Text.Email.getSendText(contactsData.name, contactsData.email)}
            }
            top.$App.show("compose", null, {
                inputData:args
            });
			
		});	
		
		//设置邮件分拣
		obj.find("a[command=gotoMailFilter]").click(function(){
			Tool.hideControlBar();
			if(contactsData.email != ""){
				//setFilterInCard(contactsData);
                top.$App.trigger("mailCommand", { command: "autoFilter", email: contactsData.email });
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "setFilter";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
		});
        
		
		//发短信gotoSMS
		obj.find("*[command=gotoSMS]").click(function(){//暂时屏蔽
			Tool.hideControlBar();
			sendSMS(focusRow);
		});
		
		//设置邮件到达通知
		obj.find("a[command=gotoMailNotify]").click(function(){//暂时屏蔽
			Tool.hideControlBar();
			//setMailNotifyInCard(contactsData);
            if (!top.$User.isChinaMobileUser()) {
                top.$User.showMobileLimitAlert();
                return;
            }
            top.$App.show("notice");
		});
		
		
        if (info && info.emails.length>0 ) {
			obj.find("a[command=searchLetters]").click(function(){
				Tool.hideControlBar();
				searchMailRecords(focusRow);
			});
        }else{
			obj.find("a[command=searchLetters]").parent().hide();
		}

        var GUANGDONG = "1";
        if (top.$User.getProvCode() == GUANGDONG) {
            obj.find("a[rel='fax']").show();
        }
        obj.fadeIn();       
        obj = null;
    },

    hideControlBar: function() {
        $("#controlBar").hide();
    },
    getPageSizeCookie: function() {
        return Pt.cookie("addr_ps") || 20;
    },
    setPageSizeCookie: function(pageSize) {
        setTimeout(function() {
            Pt.cookie("addr_ps", pageSize);
        }, 0);
    },

    compareMap : {
        "E": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.emails.some(function(e,i){
                    return a == e.toLowerCase();
                })) {
                    return b.SerialId;
                };

            } else {
                for (var j = b.emails.length; j--; ) {
                    if (a == b.emails[j].toLowerCase()) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        },
        "M": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.mobiles.some(function(e,i){
                    return $Mobile.compare(a, e);
                })) {
                    return b.SerialId;
                }

            } else {
                for (var j = b.mobiles.length; j--; ) {
                    if ( $Mobile.compare(a, b.mobiles[j]) ) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        },
        "F": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.faxes.some(function(e,i){
                    return $Mobile.compare(a, e);
                })) {
                    return b.SerialId;
                };

            } else {
                for (var j = b.faxes.length; j--; ) {
                    if ( $Mobile.compare(a, b.faxes[j]) ) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        }
    },

    searchLastContactsInfoBeLong: function(item, contacts) {

        var compareFoo = this.compareMap[item.type];

        var addr = item.addr;
        for (var i = 0, len = contacts.length; i < len; i++) {
            var serialid = compareFoo(addr, contacts[i]);
            if (serialid) {
                return contacts[i];
            }
        }
        return null;
    },
    saveString: function(value) {
        if (!keyMap[value]) {
            stringMap.push(value);
            keyMap[value] = stringMap.length - 1;
        }
        return keyMap[value];
    },
    getString: function(key) {
        return stringMap[key];
    },
    fixImage: function(img) {
        var fixSize = 96;
        img.removeAttribute("width");
        img.removeAttribute("height");
        if (img.width > img.height) {
            img.width = 96;
        } else {
            img.height = 96;
        }
    },
    getContactsNotInGroup: function() {
        var cData = top.M2012.Contacts.getModel().get("data");
        var addrsNotInGroup = cData.noGroup;
        var addrsNotInGroupCount = addrsNotInGroup.length;
        return {
            contactsMap: addrsNotInGroup,
            count: addrsNotInGroupCount
        };
    },
	updateVipMail:function(){
		if(top.Main.searchVipEmailCount){
			top.Main.searchVipEmailCount();
		}
	},

    fixmobile: function(str) {
        return $Mobile.remove86(str.replace(/[^\d]/g, ""));
    },

    fetionBean: {

        //一分钟内已发出的飞信添加好友
        addMap: {},

        //唤出飞信bar的提示框
        showtip: function(msg, id){
            return (function(d,a, fetion$){var g=fetion$.fxbar.ui.floatWindow({title:"提示"}),e=fetion$('<div class="fxbar_tip_m"></div>'),c=fetion$('<div class="statebk">'+d+"</div>"),b=fetion$('<div class="bt_bk"><a href="javascript:;" onclick="return false;">确定</a></div>'),f=fetion$('<div class="fxbar_tip_b"></div>');e.append(c).append(b);g.append(e).append(f);b.children().eq(0).bind("click",function(){g.hide()});g.show();if(a)g[0].id=a;return g;})(msg, id, top.fetion$);
        },

        ready: function(callback) {
            var fetion$ = top.fetion$, _this = this, count = 0;

            if (fetion$.fxbar.cache.contactMap) {
                return callback(fetion$.fxbar.cache.contactMap.values());
            }

            fetion$.fxbar.logic.loadContactList(); //加载飞信好友列表

            var timer = setInterval(function(){
                if (fetion$.fxbar.cache.contactMap && fetion$.fxbar.cache.contactMap.size() > 0 && fetion$.fxbar.cache.contactMap.values()) {
                    clearInterval(timer);

                    setTimeout(function(){
                        callback(fetion$.fxbar.cache.contactMap.values());
                    }, 500);
                } else {
                    count++;
                    if (count > 100) {
                        clearInterval(timer);
                        _this.showtip("飞信没有正常加载，请尝试点左上方飞信图标来发短信", "fx_tip_yx_error", $fx);
                    }
                }
            }, 0xff);
        },

        addBuddy: function(mobile) {
            var fetion$ = top.fetion$, _this = this, count = 0;

            function clear() {
                if (_this.addMap[mobile]) {
                    clearTimeout(_this.addMap[mobile]);
                    _this.addMap[mobile] = false;
                }
            };

            if (_this.addMap[mobile]) {
                _this.showtip("添加好友请求已发送，请耐心等待", "fx_tip_yx_wait");
                return;
            }

            fetion$.fxbar.common.beginAddBuddy({"mn": mobile});

            _this.addMap[mobile] = setTimeout(function(){
                clear();
            }, 60000);

            try {
                top.$("#fx_link_cancel, .fxbar_close").click(function(){
                    clear();
                });
            } catch (ex) {
            }
        },

        isfriend: function(mobile) {
            var fetion$ = top.fetion$, _this = this, user;

            return {
                yesqueue: [],
                noqueue: [],

                yes: function(callback){
                    this.yesqueue.push(callback);
                    return this;
                },
                no: function(callback){
                    this.noqueue.push(callback);
                    return this;
                },
                done: function() {
                    var promiss = this;
                    _this.ready(function(lst) {
                        var user;
                        for (var i = lst.length; i--; ) {
                            if ( $Mobile.compare(lst[i].mn, mobile) ) {
                                user = fetion$.fxbar.cache.contactMap.get(lst[i].uid);
                                break;
                            }
                        }

                        if (user) {
                            while(promiss.yesqueue.length) {
                                promiss.yesqueue.pop()(user);
                            }
                        } else {
                            while(promiss.noqueue.length) {
                                promiss.noqueue.pop()(mobile);
                            }
                        }
                    });
                    return this;
                }
            };
        },

        chat: function(mobile) {
            var _this = this, fetion$ = top.fetion$;

            _this.isfriend(mobile)
              .yes(function(user) {
                fetion$.fxbar.common.openChatWrapper(user);

            }).no(function(mn) {
                _this.addBuddy(mn);

            }).done();
        }
    },

    //唤出飞信对话框 TODO: 这个逻辑要移进fetionBean
    fetionchat: function(e, sender) {

        //登录状态
        if (!Render.fetionlogined()) {
            return;
        }

        var _this = Tool;

        try {
            var mobile = sender.parentNode.previousSibling;
            mobile = mobile.innerText || mobile.textContent;
            mobile = Tool.fixmobile(mobile);

            _this.fetionBean.chat(mobile);

        } catch (ex) {
            top.M139.Logger.getDefaultLogger().error('调用飞信bar出错', ex)
        }
    }
};
stringMap = [];
keyMap = {};
﻿function IsEmpty(code) {
    if(typeof(code) == "undefined" || code == null || code.length == 0) return true;
    return false;
}
var VcarContent = {
   //拼接名片信息
	connectSendContent:function(info){
       if(!info) return;
       
       var mmscontent = "";
        
       if(!IsEmpty(info.name)){
           mmscontent = "您好，以下是" + info.name + "的电子名片:\n"+info.name;
       }   
          
       if(!IsEmpty(info.FavoWord)){
            mmscontent += "\n" + info.FavoWord ;
       }
       
       if(!IsEmpty(info.UserJob)){
           mmscontent += "\n职务：" + info.UserJob;
       }
       
       if(!IsEmpty(info.CPName)){
           mmscontent += "\n公司：" + info.CPName;
       }
       
       if(!IsEmpty(info.CPAddress)){
           mmscontent += "\n地址：" + info.CPAddress;
       }
       
       if(!IsEmpty(info.FamilyEmail)){
           mmscontent += "\n邮箱：" + info.FamilyEmail;
       }
       
       if(!IsEmpty(info.MobilePhone)){ 
           mmscontent += "\n手机：" + info.MobilePhone;
       }
       if(!IsEmpty(info.OtherPhone) ){
           mmscontent += "\n电话：" + info.OtherPhone;
       }
       if(!IsEmpty(info.BusinessFax)){
           mmscontent += "\n传真：" + info.BusinessFax;
       }
       if(!IsEmpty(info.CPZipCode)){
           mmscontent += "\n邮编：" + info.CPZipCode;
       }
       return mmscontent;
   }
};
﻿//冲突检测
if (!window.mail139) {
    var mail139 = {};
}

if (!mail139.addr) {
    mail139.addr = {};
}

//尽可能聚合顶层的对象;
var Pt = {

    $U: top.$Url,
    $RM: top.$RM,
    $Cookie: top.M139.Text.Cookie,
    $T: top.$T,
    UI_Menu: M2012.UI.ListMenu,
    alert: function () {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },
    confirm: function () {
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },
    parent: function () {
        return top;
    },

    getSid: function () {
        return top.$App.getSid();
    },
    
    getMaxSend: function () {
        return top.$User.getMaxSend();
    },
    
    getMaxContactLimit: function () {
        return top.$User.getMaxContactLimit();
    },
    
    getServiceItem: function () {
        return top.$User.getServiceItem();
    },

    ucDomain: function (path) {
        return top.getDomain("webmail") + path;
    },

    param: function (key) {
        return this.parent().$Url.queryString(key, location.href);
    },

    htmlEncode: function (str) {
        return M139.Text.Html.encode(str);
    },

    cookie: function (name, value) {
        if (arguments.length === 2) {
            this.$Cookie.set({name: name, value: value});
        } else {
            return this.$Cookie.get(name);
        }
    },

    callOldApi: function (option) {
        var api = "/sharpapi/addr/apiserver/" + option.action;
        var params = option.param || {};
        params.sid = this.getSid();

        var url = this.$U.makeUrl(api, params);

        this.$RM.call(url, {}, function (json) {
            json = json.responseData;
            if (Number(json.ResultCode) === 0) {
                if ($.isFunction(option.success)) {
                    option.success(json);
                }
            } else {
                if ($.isFunction(option.error)) {
                    option.error(json);
                }
            }
        });
    }
};


var vipMsg = ADDR_I18N[ADDR_I18N.LocalName]["vip"];
var Retry={
	retryTime : 0,
	retryData : "",
	retryFun : null
} ; //home页全局变量，用来做重试操作使用。

mail139.addr.home = {

    //你可能认识的人
    relationId: "",

    //指示是否正在做快速编辑
    isediting: false,

    //待完善
    uncompletedInfo: "",

    //本地存储的键名
    KEY_HOMEDATA_LS: "mail139_addr_homedata",

    //主函数
    main: function () {
        var that = this;

        top.WaitPannel.show(PageMsg.info_waiting);

        that.timerReload = setTimeout(function () {
            if (top.Contacts.reload) {
                top.Contacts.reload();
            }
        }, 4000);

        that.timerFail = setTimeout(function() {
            Pt.alert(PageMsg.error_sysbusy);
            top.WaitPannel.hide();
        }, 10000);

        window.top.Contacts.ready(function() {
            top.WaitPannel.hide();
            View.init();
            bindEvent();
            clearTimeout(that.timerReload);
            clearTimeout(that.timerFail);
        });

        that.blockOnedit(that);
        that.smsSearch();
        that.other();
    },

    setHomeUncompleted: function ()//设置首页等完善
    {
        if (mail139.addr.home.uncompletedInfo) {
            $("#liUncompleted a").text(mail139.addr.home.uncompletedInfo);
        }
        filter.setDefault();
    },

    //快速编辑联系人时，点其他链接与离开页面默认保存
    blockOnedit: function(_this) {

        $(window).unload(function(e) {
            var obj, msg, ischanged;
            obj = QuickEditServer;
            if (_this.edit.isChanged() && confirm(PageMsg.warn_withoutsave)) {
                QE($(obj.trQES).find('.i-edit-suc')[0]);
                e.stopPropagation();
                return false;
            }
        });

        $(document).bind("mousedown", function(event) {
            var obj, items, ischanged, clzName, actionEle;

            obj = QuickEditServer;
            if (!obj.haveEdit) return;

            if (_this.edit.isChanged()) {
                mail139.addr.home.isediting = true;
            } else {
                mail139.addr.home.isediting = false;
            }

            clzName = $(event.target)[0].className;
            actionEle = ',LI,A,BUTTON,IMG,SELECT,OPTION,';
            if (actionEle.indexOf(',' + event.target.tagName + ',') > -1
				|| clzName == "i-edit-suc" || clzName == "update") {
                event.stopPropagation();
                return false;
            } else {
                if (event.target.type == 'text') return;
                if (mail139.addr.home.isediting) {
                    QE($(obj.trQES).find('.i-edit-suc')[0]);
                } else {
                    items = obj.trQES.getElementsByTagName('TD');
                    hideEdit(items[1], items[2], items[3]);
                    obj.haveEdit = false;
                }
            }
        })
    },

    //显示短信查询通讯录提示
    smsSearch: function () {
        (function(p, tip) {
            var t = 0;
            p.mouseover(function(e) {
                tip.fadeIn();
                top.addBehavior("14_30189_4短信查询通讯录链接");
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
            }).mouseout(function() {
                t = setTimeout(function() {
                    clearTimeout(t);
                    tip.hide();
                }, 3000);
            });
        })($("#smsContactTip"), $("#tipSms"));
    },

    //其他启动项目
    other: function() {
        var _this = this;

        //加载界面显示的数据
        $('#imgPerson').attr('src', top.resourcePath + '/images/face.png');
        _this.load(function(rs) {
            _this.render.start(rs);
        });

        //显示Outlook插件入口浮层
        Render.showOutlookTips();
        Render.showFloatTips();

        //发传真范围：广东
        if (top.UserData.provCode != 1) {
            $("#btnFax, #btnFax2").parent().hide();
        }

        $(window).resize(function() {
            var frameHeight = $(window.frameElement).height();
            $("#sidebar").height(frameHeight);
            var div = $("div.profile");
            var aa = div.offset(); //取offset引发回流。
        });

        $(window).unload(function() {
            try {
                top.WaitPannel.hide();
            } catch (e) {
            }
        });
    },

    //绘制界面的几个地方
    render: {
        //集中调用
        start: function(rs) {
            var _this = this;

            for (var resp in rs) {
                if (rs.hasOwnProperty(resp)) {
                    try {
                        var data = rs[resp];
                        if (data && data.ResultCode === "0" && _this[resp]) {
                            _this[resp](data);
                        } else if (data.ResultCode === "12" || data.ResultCode === "13") {
                            top.Utils.showTimeoutDialog();
                        }
                    } catch (e) {
                        top.M139.Logger.getDefaultLogger().error("addrhomedata error", e);
                    }
                }
            }
        },

        //待清理
        GetNumWaitForCleaningResp: function (data) {
            if (parseInt(data.NumWaitForCleaning) > 0) {
                var link = $("#liClean a");
                link.text("待清理(" + data.NumWaitForCleaning + ")");
                link.parent().show();
            }
        },

        //待更新
        GetUpdatedContactsNumResp: function (data) {
            var btnUpdate = $("#liUpdateContacts");
            if (Number(data.UpdatedContactsNum) === 0) {
                btnUpdate.hide();
                return;
            }

            var str = "待更新(" + data.UpdatedContactsNum + ")";
            btnUpdate.find("a").text(str).unbind("click").click(function() {
                top.addBehaviorExt({ actionId: 101243, thingId: 0, moduleId: 14 });
                View.changeView('Redirect', { key: 'updateContacts' });
                return false;
            });
            btnUpdate.show();
        },

        //可能认识的人
        WhoAddMeByPageResp: function (data) {
            //手机号变星星。
            function replaceStar(name) {
                var showName = name;
                if (name.length == 11 && /^\d+$/.test(name)) {
                    showName = name.replace(/(?:^86)?(\d{3})\d{4}/, "$1****");
                }
                return showName;
            }
            
            var htmHave;
            var liWho = '<li><a behavior="14_30189_3具体头像或链接" href="javascript:{params};View.changeView(\'Redirect\',{key:\'whoaddme\'});" ><img  src="{ImageUrl}"><span>{showName}</span></a></li>';
            var buff = [];

            if (data.UserInfo.length === 0) {
                $("#19_1403_7").hide();
                return;
            }

            //显示可能认识的人总数
            if(Number(data.TotalRecord) > 0){
                var whoaddmecount='<span>(' + data.TotalRecord + ')</span>' ;
                $("#whoaddmeCount").html(whoaddmecount);
            }

            data = data.UserInfo;
            for (var i = 0, m = data.length; i < m; i++) {//取4个
                if (data[i].DealStatus != 0) continue;
                
                data[i].showName = Pt.htmlEncode(replaceStar(data[i].Name));
                data[i].ImageUrl = Pt.htmlEncode((new top.M2012.Contacts.ContactsInfo(data[i])).ImageUrl);

                if (data[i].RelationId) {
                    data[i].RelationId = data[i].RelationId;                    
                    data[i].params = 'mail139.addr.home.relationId=' + data[i].RelationId;
                }else if(data[i].UIN){
                    data[i].params = 'mail139.addr.home.uinId=' + data[i].UIN;
                }else{
                    data[i].params = '';
                }
                
                buff.push(top.$TextUtils.format(liWho, data[i]));
            }
            htmHave = '<ul>' + buff.join('') + '</ul>';
            $(htmHave).replaceAll("#divNoAddme");
        },

        //可能重复
        GetRepeatContactsResp: function (data) {
            var total = 0;

            for (var i = data.RepeatInfo.length; i--; ) {
                total += data.RepeatInfo[i].sd.split(",").length;
            }

            var btnRep = $("#liRepeat");
            if (total === 0) {
                btnRep.hide();
                return;
            }

            btnRep.find("a").text("可能重复({0})".format(total)).unbind("click").click(function() {
                //在所有联系人页面点击顶部导航按钮 2：可能重复按钮
                top.addBehaviorExt({ actionId: 30188, thingId: 2, moduleId: 14 });
                View.changeView('Redirect', { key: 'merge' });
                return false;
            });
            btnRep.show();
        },

        //个人资料
        QueryUserInfoResp: function (data) {

            (function (P) {
                P.lblName.html(P.uid);

                var i, pName = false;

                var imgurl = P.data.ImageUrl;
                P.imgPhoto.attr('src', imgurl);

                //我的资料调取先后规则：个人资料-姓名（即发件人姓名）>个人资料-昵称>邮箱前缀（别名）>邮箱前缀（手机号），不显示飞信别名
                if (P.data) {
                    P.pMobile.text(P.data.getFirstMobile());
                    P.pEmail.text(P.data.FamilyEmail);
                    pName = P.data.AddrFirstName;
                    if (!pName || pName.length == 0) {
                        pName = P.name;
                    }
                    if (!pName || pName.length == 0) {
                        pName = P.data.AddrNickName;
                    }
                }
                if (!pName || (pName.length < 1 && P.uids.length > 0)) {
                    for (i = 0; i < P.uids.length; i++) {
                        if (!(/^\d+$/.test(P.uids[i]))) {
                            pName = P.uids[i];
                            break;
                        }
                    }
                }
                if (!pName || pName.length == 0) {
                    pName = P.uid;
                }
                P.lblName.text(pName);

            })({
                name: top.trueName,
                uid: top.$Mobile ? top.$Mobile.remove86(top.uid) : top.uid, //remove 86 header
                uids: top.UserData.uidList,
                sid: Pt.getSid(),
                res: top.resourcePath,
                data: new top.M2012.Contacts.ContactsInfo(top.$App.getModel("contacts").userInfoTranslate(data.UserInfo[0])),
                uc: top.ucDomain,
                lblName: $('#j_lnk_myinfo'),
                imgPhoto: $('#imgPerson'),
                pMobile: $('#pUserMobile'),
                pEmail: $('#pUserEmail')
            });
        },

        //设置待完善联系人数量
        GetUncompletedContactsResp: function(data) {
            var btnUc = $("#liUncompleted");
            var link = btnUc.find("a");

            if (!data || Number(data.TotalRecord) === 0) {
                btnUc.hide();

                //处于修改完善联系人状态，修改完最后一条后，自动返回
                if (link.text() == "返回") {
                    filter.setFilter({ uncompleted: "" });
                    View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: "All" });
                }
                return;
            }

            //抽离提示数量的参数
            var uncompleted = "待完善";
            var home = mail139.addr.home;
            home.uncompletedCount = data.TotalRecord;
            home.uncompletedList = data.UncompletedContactsInfo;
            home.uncompletedInfo = "{0}({1})".format(uncompleted, home.uncompletedCount);

            //处于修改完善联系人状态，修改一个刷新列表
            if (link.text() == "返回") {
                //说明：取消原有的默认刷新，会导致排序错乱（gethomedata的问题）
                //保留排序规则以及对应页码。加载新数据并刷新
                var ft = { uncompleted: home.uncompletedList };
                if (filter.needSort) {
                    //排序取反，在render的时候会再次取反，以保证和之前的排序一致
                    switch (filter.sortType) {
                        case "name":
                            ft.nameOrder = -filter.nameOrder;
                            break;
                        case "email":
                            ft.emailOrder = -filter.emailOrder;
                            break;
                        case "mobile":
                            ft.mobileOrder = -filter.mobileOrder;
                            break;
                        default:
                            break;
                    }
                }
                filter.setFilter(ft);
                Render.renderContactsList();
                Render.renderSelectPageIndex(home.uncompletedCount); //重新初始化页码
                thePageTurnner.turnPage(thePageTurnner.pageIndex); //current page
                $("#divContactsList h4").text(PageMsg.info_Uncompleted);
                return;
            }

            link.attr("title",PageMsg.unConmpleted_title);
            link.text(home.uncompletedInfo).unbind("click").click(function() {
                var _this = $(this);
                if (_this.text().indexOf(uncompleted) < 0) {
                    _this.text(home.uncompletedInfo);
					link.attr("title", PageMsg.unConmpleted_title);
                    filter.setFilter({ uncompleted: "", needSort: false, sortType: "" }); //返回所有联系人时，取消之前的排序规则(破坏性操作返回时，恢复最原始视图)
                    View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: "All" });
                    return;
                } else {
                    _this.text("返回");
					_this.attr("title","");
                    //成功加载完善页面日志
                    top.addBehaviorExt({ actionId: 30178, thingId: 0, moduleId: 14 });
                    Render.closeTip();
                }
                //在所有联系人页面点击顶部导航按钮 3：待完善按钮
                top.addBehaviorExt({ actionId: 30188, thingId: 3, moduleId: 14 });

                var tmpHead = '<p style="text-align:left;"><span style="font-family:Applied Font;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">您现在有</span><span style="font-family:Applied Font;font-size:18px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF0000;">{0}</span><span style="font-family:Applied Font;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">个联系人的资料需要完善，建议完善</span></p>';
                tmpHead = tmpHead.format(home.uncompletedCount);

                filter.setFilter({ uncompleted: home.uncompletedList });
                View.orderDefault();
                $("#divContactsList h4").text(PageMsg.info_Uncompleted);
                return false;
            });
            btnUc.show();
        },

        GetColorCloudInfoResp: function (data) {},
        GetRemindBirdaysResp: function (data) {}
    },

    //快速编辑被调函数
    edit: {
        isChanged: function() {
            var obj, items, ischanged;
            obj = QuickEditServer;
            if (!obj.trQES) return;

            items = obj.trQES.getElementsByTagName('input');
            if (items.length < 4) return;
            ischanged = obj.nameQES != items[1].value
					|| obj.emailQES != items[2].value
					|| obj.mobileQES != items[3].value;
            return ischanged;
        },
        save: function(param) {
            //serialId, name, email, mobile
            var serialId = param.serialId;
            top.Contacts.getContactsInfoById(serialId, function(result) {
                if (!result.success) {
                    Pt.alert(result.msg);
                    return;
                }

                var contact = new top.ContactsInfo(result.contactsInfo);
                onqueryed(contact);
            });

            function isempty(s) {
                return !s || s.length == 0 || $.trim(s).length == 0;
            }

            function merge(c) {
                c.AddrFirstName = param.name

                //由于列表上优先显示FamilyEmail，所以可以先判商业邮箱为空
                //来确定用户需要修改FamilyEmail，否则FamilyEmail也空时就
                //更新BusinessEmail，都不是则更新FamilyEmail，置空OtherEmail
                var email1 = c.FamilyEmail,
                    email2 = c.BusinessEmail,
                    email3 = c.OtherEmail,
                    mobile1 = c.MobilePhone,
                    mobile2 = c.BusinessMobile,
                    mobile3 = c.OtherMobile;

                if (isempty(email2)) {
                    email1 = param.email;

                } else if (isempty(email1)) {
                    email2 = param.email;

                } else {
                    email1 = param.email;
                }

                c.FamilyEmail = email1;
                c.BusinessEmail = email2;
                c.OtherEmail = email3;

                if (isempty(mobile2)) {
                    mobile1 = param.mobile;

                } else if (isempty(mobile1)) {
                    mobile2 = param.mobile;

                } else {
                    mobile1 = param.mobile;

                }

                c.MobilePhone = mobile1;
                c.BusinessMobile = mobile2;
                c.OtherMobile = mobile3;

                return c;
            }

            function onqueryed(c) {

                c = merge(c);

                top.Contacts.ModContactsField(serialId, c, false, function(result) {
                    mail139.addr.home.isediting = false;
                    items = QuickEditServer.trQES.getElementsByTagName('td');

                    if (result.resultCode == '0') {

                        hideEdit(items[1], items[2], items[3]);
                        setSaveShow(QuickEditServer.trQES, false);
                        QuickEditServer.haveEdit = false;
                        Pt.alert(result.msg);
                        SetNewContact(items[1], items[2], items[3], result);
                        mail139.addr.home.reload();

                        if(top.Contacts.IsVipUser(serialId)){//更新VIP邮件
                            top.Contacts.updateCache("editVipContacts",param.serialId);
                            Tool.updateVipMail();
                        }
                        return true;
                    } else if (result.resultCode == "226" || result.resultCode == "224") {//重复
                        var DetailMsg = ADDR_I18N[ADDR_I18N.LocalName]["detail"];
                        var msg = result.resultCode =="226" ? DetailMsg.warn_emailRepeat : DetailMsg.warn_mobileRepeat;
                        top.$Msg.confirm(
                            msg,
                            function(){ 
                                top.Contacts.ModContactsField(QuickEditServer.serialIdQES, c, true, function(result) {
                                    if (result.resultCode == '0') {
                                        hideEdit(items[1], items[2], items[3]);
                                        setSaveShow(QuickEditServer.trQES, false);
                                        QuickEditServer.haveEdit = false;
                                        Pt.alert(result.msg);
                                        SetNewContact(items[1], items[2], items[3], result);
                                        mail139.addr.home.reload();

                                        if(top.Contacts.IsVipUser(serialId)){//更新VIP邮件
                                            top.Contacts.updateCache("editVipContacts",param.serialId);
                                            Tool.updateVipMail(); 
                                        }
                                        return true;
                                    }
                                    else {
                                        Pt.alert(result.msg);
                                    }
                                });
                            },
                            function(){ 
                                hideEdit(items[1], items[2], items[3]);
                                setSaveShow(QuickEditServer.trQES, false);
                                QuickEditServer.haveEdit = false;
                        });

                    }
                    else {
                        Pt.alert(result.msg);
                    }
                });
            }
        }
    },

    //异步加载数据
    load: function(onSuccess, onFail) {

        if (top.SiteConfig.addrbatchdisable) {
            var apilist = [
                {a:"QueryUserInfo", b: {}},
                {a:"WhoAddMeByPage", b: {attributes: {Page:"1", Record:"4", Relation: "0"}}},
                {a:"GetRepeatContacts", b: {}},
                {a:"GetUncompletedContacts", b: {}},
                {a:"GetUpdatedContactsNum", b: {}},
                {a:"GetNumWaitForCleaning", b: {}}
            ];

            var timer = setInterval(function() {
                if (!apilist.length) {
                    clearInterval(timer);
                    return;
                }

                var api = apilist.shift();
                var data = {};
                data[api.a] = api.b;

                top.M2012.Contacts.API.call(api.a, data, function(e) {
                    var rs = e.responseText;
                    if (/^(.*?)=/.test(rs)) {
                        rs = rs.match(/^(.*?)=/)[1];
                    } else {
                        rs = "GetNumWaitForCleaningResp";
                    }

                    if (rs) {
                        var result = {};
                        result[rs] = e.responseData;
                        onSuccess(result);
                    }
                }, {});

            }, 256);
            return;
        }

        top.M2012.Contacts.API.batchQuery({
            requestData: {
                BatchQuery: {
                    QueryUserInfo: {},
                    WhoAddMeByPage: { attributes: {Page:"1", Record:"4", Relation: "0"} },
                    GetRepeatContacts: {},
                    GetUncompletedContacts: {},
                    GetUpdatedContactsNum: {},
                    GetNumWaitForCleaning: {},
                    GetColorCloudInfo: {},
                    GetRemindBirdays: {}
                }
            },
            success: function(rs){
                onSuccess(rs);
            },
            error: function(rs){
                if ($.isFunction(onFail)) onFail(rs);
            }
        });

    },

    //重载异步数据
    reload: function() {
        var _this = this;
        _this.load(function(rs) {
            _this.render.start(rs);
        });
    }
};

//主函数入口
$(function() {
    mail139.addr.home.main();
});

function hideMenu() {
    $("#ulCopyTo,#ulMoveTo,#ulSendTo,#ulCopyTo2,#ulMoveTo2,#ulSendTo2,#pnlPageSize1,#pnlPageSize2,#pnlPage1,#pnlPage2").hide();
};

function bindEvent() {

    $("#j_lnk_myphoto, #j_lnk_myinfo").click(function(){
        View.changeView('Redirect', {key: 'mybusinesscard'});
        return false;
    });

  //姓名-邮箱-电话 -排序
	$("#name,#email,#mobile").click(function(){
		var sortType = $(this).attr("id");
		filter.sort(sortType);
	});
	
  //首字母
    $("#firstLetter a").click(function() {
        View.changeView("ChangeFilter", { key: "firstNameWord", firstNameWord: $(this).text() });
    })

    //改变一页显示条数
    var pagesizes = [20, 50, 100];
    var defaultSize = Tool.getPageSizeCookie();

    $("#btnPageSize1, #btnPageSize2").click(function() {
        hideMenu();
    });

    //每页显示数
    var lstPage1 = new Pt.UI_Menu({
        data: pagesizes,
        defaultValue: defaultSize,
        expandButton: $("#btnPageSize1")[0],
        textField: $("#fieldPageSize1")[0],
        listContainer: $("#pnlPageSize1")[0],
        onItemCreate: function(itemData, index, total) {
            var html = "<li data-value=\"" + itemData + "\"><a href=\"javascript:;\" hidefocus=\"1\"><span>" + itemData + "</span></a></li>";
            return html;
        },
        onItemClick: function(args) {
            lstPage2.value(args.value);
            View.changeView("ChangeFilter", { key: "pageSize", pageSize: args.value });
        }
    });

    //每页显示数
    var lstPage2 = new Pt.UI_Menu({
        data: pagesizes,
        defaultValue: defaultSize,
        expandButton: $("#btnPageSize2")[0],
        textField: $("#fieldPageSize2")[0],
        listContainer: $("#pnlPageSize2")[0],
        onItemCreate: function(itemData, index, total) {
            var html = "<li data-value=\"" + itemData + "\"><a href=\"javascript:;\" hidefocus=\"1\"><span>" + itemData + "</span></a></li>";
            return html;
        },
        onItemClick: function(args) {
            lstPage1.value(args.value);
            View.changeView("ChangeFilter", { key: "pageSize", pageSize: args.value });
        }
    });

    //全选复选框
    $("#chkSelectAll").click(function() {
        var checked = this.checked;
        $("#tableContactsList input:checkbox").attr("checked", checked ? "checked" : null);
        if (checked) {
            $("#tableContactsList tr").addClass("current");
        } else {
            $("#tableContactsList tr").removeClass("current");
        }
    })
    //点写信
    $("#btnCompose,#btnCompose2").click(function() {
        View.changeView("SendMail");
        top.addBehaviorExt({ actionId: 26019, thingId: 1, moduleId: 14 });
        return false;
    });
    //点发短信
    $("#btnSMS, #btnSMS2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendSMS");
        top.addBehaviorExt({ actionId: 26019, thingId: 2, moduleId: 14 });
        return false;
    });
    //点发彩信
    $("#btnMMS, #btnMMS2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendMMS");
        top.addBehavior("14_26019_3通讯录工具栏发彩信");
        return false;
    });
    //发贺卡
    $("#btnGCard,#btnGCard2").click(function() {
        View.changeView("SendGCard");
        top.addBehaviorExt({ actionId: 26019, thingId: 5, moduleId: 14 });
        return false;
    });
    //发明信片
    $("#btnPCard,#btnPCard2").click(function() {
        View.changeView("SendPCard");
        top.addBehaviorExt({ actionId: 26019, thingId: 7, moduleId: 14 });
        return false;
    });
    //发传真
    $("#btnFax,#btnFax2").click(function() {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
        View.changeView("SendFax");
        top.addBehaviorExt({ actionId: 26019, thingId: 6, moduleId: 14 });
        return false;
    });
    //点顶部合并按钮
    $("#btnMerge, #btnMerge2").click(function() {
        var serialId = Tool.getSelectedContacts(true);
        if (serialId.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        } else if (serialId.length < 2 || serialId.length > 5) {
            Pt.alert(PageMsg['warn_mergeover']);
            return;
        }
        View.changeView("Redirect", { key: "mergesingle", serialId: serialId.join('|') });
        return false;
    });
    //点发名片
    $("#btnCARD, #btnCARD2").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        top.addBehaviorExt({ actionId: 26019, thingId: 4, moduleId: 14 });
        var contacts = Tool.getSelectedContacts();
        if (contacts.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        } else if (contacts.length > 20) {
            Pt.alert(PageMsg.warn_sendcardover);
            return;
        }
        var receiver = "";
        var map = {};
        $(contacts).each(function() {
            var email = this.getFirstEmail();
            if (!email || map[email]) return;
            map[email] = true;
            var name = this.name.replace(/"/g, "");
            receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
        })
        View.changeView("Redirect", { key: "sendBuzzCard", receiver: encodeURIComponent(receiver) });
        return false;
    });
    //搜索
    $("#btnSearch").click(_doSearch);
    $("#txtSearch").keypress(function(e) {
        if (e.keyCode == 13) {
            _doSearch();
        }
    });

    function _doSearch() {
        var txt = $("#txtSearch");
        var keyword = txt.val().trim();
        if (keyword == "" || keyword == txt.attr("title")) {
            $(txt).blur();
            Pt.alert(PageMsg.warn_search);
            return;
        }
        View.changeView("ChangeFilter", { key: "keyword", keyword: keyword });
        top.addBehaviorExt({ actionId: 26025, thingId: 0, moduleId: 19 });
    }

    $(document).click(hideMenu);
    //复制到
    $("#btnCopyTo").click(function(e) {
        hideMenu();
        var ulCopyTo = $("#ulCopyTo");
        var items = ulCopyTo.show().find("li");
        items.show().filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
        top.addBehavior("19_26007复制到", 0);
    });
    //下方复制到
    $("#btnCopyTo2").click(function(e) {
        hideMenu();

        var bodyHeight = $(document).height();
        var ulCopyTo = $("#ulCopyTo2");

        var listHeight = ulCopyTo.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulCopyTo.css("top", _top).show();

        //隐藏当前组
        ulCopyTo.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();

        e.stopPropagation();
        top.addBehaviorExt({ actionId: 1409, thingId: 0, moduleId: 19 });
    });
    //发送按钮
    $("#btnSendTo").click(function(e) {
        hideMenu();
        $("#ulSendTo").show();
        e.stopPropagation();
    });
    //下方发送到
    $("#btnSendTo2").click(function(e) {
        hideMenu();
        var bodyHeight = $(document).height();

        var ulSendTo2 = $("#ulSendTo2");

        var listHeight = ulSendTo2.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulSendTo2.css("top", _top).show();
        e.stopPropagation();
    });

    //移动到
    $("#btnMoveTo").click(function(e) {
        hideMenu();
        var ulMoveTo = $("#ulMoveTo");
        ulMoveTo.show();
        ulMoveTo.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
    });
    //移动到
    $("#btnMoveTo2").click(function(e) {
        hideMenu();
        var bodyHeight = $(document).height();
        var ulMoveTo2 = $("#ulMoveTo2");

        var listHeight = ulMoveTo2.height();
        var _this = $(this);
        var menuBottom = _this.offset().top + listHeight;

        var _top = menuBottom > bodyHeight ?
            0 - listHeight - 8 : _this.height()
        ulMoveTo2.css("top", _top).show();

        //隐藏当前组
        ulMoveTo2.find("li").filter("*[groupId='{0}']".format(filter.groupId)).hide();
        e.stopPropagation();
    });
    //删除
    $("#btnDelete, #btnDelete2").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        top.addBehaviorExt({ actionId: 1407, moduleId: 19 });
        View.changeView("DeleteContacts", {});
        return false;
    });
	
	
 
    function toNewPage() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        View.changeView('Redirect', { key: 'addContacts' });
        top.addBehaviorExt({ actionId: 26024, thingId: 1, moduleId: 19 });
        return false;
    }

    //新建 按钮
    $("#btnAddNew, #btnAddNew2,#btnAddNew3").click(toNewPage);
    $("#btnAddNew4").live("click", toNewPage);

    //新建组
    $("#aAddGroup").click(function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        View.changeView('Redirect', { key: 'addGroup' })
        top.addBehaviorExt({ actionId: 26026, thingId: 1, moduleId: 19 });
        return false;
    });

    //单击空白处查看联系人名片，靠近复选框的地方为选中当前行。
    $("#tableContactsList").click(function(e) {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        var T = e.target, tr = false;
        if (T.tagName == 'TD' && T.cellIndex != 0) {
            editContacts(T.parentNode.cells[1]); //原来：contactsBusinesscard 6.5修改
        } else if (T.cellIndex == 0) {
            var tr = $(T.parentNode);
            if (tr.hasClass("c-null")) {
                //此时显示空白引导提示语。
                return;
            }

            var C = T.getElementsByTagName('INPUT')[0];
            if(!C){return;}
            if (!C.checked) {
                tr.addClass("current");
            } else {
                tr.removeClass("current");
            }
            C.checked = !C.checked;
        } else if (T.tagName == 'INPUT') {
            var tr = T.parentNode.parentNode;
            if (tr) {
                if (T.checked) {
                    $(tr).addClass("current");
                } else {
                    $(tr).removeClass("current");
                }
            }
        }
    });
    //搜索框
    $("#txtSearch").focus(function() {
        $(this).removeClass("caaa");
        if (this.value == this.title) this.value = "";
    }).blur(function() {
        if (this.value.trim() == "") {
            $(this).addClass("caaa");
            this.value = this.title;
        }
    });
    $('#btnEmptyLastC').click(function() {
        emptyLastContactsRecords2();
    });

    //电子名片发送
    $('.cSendCard').hover(function() {
        $('.SendCardUl').show();
    }, function() {
        $('.SendCardUl').hide();
    }
    );

    $('.cSendByEmail').click(function() {
        redirectCompose('vCard');
    });

    $('.cSendByMms').click(function() {
        top.Contacts.QueryUserInfo(function(doc) {
            redirectMMS('&vCard=myVcard', VcarContent.connectSendContent(doc.info));
        });
    });

    $('.cSendBySms').click(function() {
        top.Contacts.QueryUserInfo(function(doc) {
            top.SmsContent = VcarContent.connectSendContent(doc.info);
        });
        redirectSMS('&vCard=myVcard&from=2');
    });

    top.addBehaviorExt({ actionId: 26027, thingId: 0, moduleId: 19 });
	
	//vip管理页面联系人
	$("#addVipTop,#addVipBowttom").click(function(){
		EditVipGroup();
		top.addBehaviorExt({ actionId: 103632, thingId: 0, moduleId: 14 });
	});
	//vip管理页面-取消vip联系人
	$("#DelVipTop,#DelVipBowttom").click(function(){
		top.addBehaviorExt({ actionId: 103633, thingId: 0, moduleId: 14 });
		var serialId = Tool.getSelectedContacts(true);
		
		if(serialId.length == 0){
			top.FF.alert(PageMsg["warn_noneselect"]);
			return false;
		}
		serialId = serialId.join(",");
		var param = {
			serialId :serialId
		}
		function cancelVip(){
			delSinglVipInCard(param);
		}
		top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip );
	});
	
}

//PageTurnner是一个不包含任何UI的逻辑对象
function PageTurnner(pageCount, pageIndex) {
    var thePageTurnner = this;
    this.pageIndex = pageIndex;
    this.pageCount = pageCount;
    this.fristPage = function() {
        this.turnPage(0);
    }
    this.lastPage = function() {
        this.turnPage(pageCount - 1);
    }
    this.nextPage = function() {
        this.turnPage(parseInt(thePageTurnner.pageIndex) + 1);
    }
    this.previousPage = function() {
        this.turnPage(thePageTurnner.pageIndex - 1);
    }
    this.turnPage = function(index) {
        if (index < 0 || index >= pageCount || index == this.pageIndex) return;
        this.pageIndex = index;
        this.callPageChangeHandler(index);
    }
    this.pageChangeHandlers = [];
    this.addPageChangeListener = function(handler) {

        this.pageChangeHandlers.push(handler);
    }
    this.callPageChangeHandler = function(pageIndex) {
        for (var i = 0; i < this.pageChangeHandlers.length; i++) {
            this.pageChangeHandlers[i](pageIndex);
        }
    }
}

//写信按钮
function redirectCompose(params) {
    hideMenu();
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    
    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);

    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + ', ' + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + ', ' + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$', MAXSEND), { isHtml: true });
    } else {
        if (contacts.length == 1) {
            sendCantactServer.selContact = contacts[0];
            sendCantactServer.sendType = "Mail";
            //发送电子名片，未填写邮件地址时，会被替换成发邮件(看上一行代码);这里用另外一个参数保存一下
            if (params && params == 'vCard') sendCantactServer.sendType2 = params;
            if (!sendCantactServer.CheckContactType("e")) {
                return false;
            }
        }
        var receiver = "";
        var map = {};
        $(contacts).each(function() {
            var email = this.getFirstEmail();
            if (!email || map[email]) return;
            map[email] = true;
            var name = this.name.replace(/"/g, "");
            receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
        });
        if (params && params == 'vCard') { 
            top.$App.show("compose",null,{inputData:{ receiver: receiver, type: 'vCard'}});
            //window.top.CM.show({ receiver: receiver, type: 'vCard' }); 
        }
        else {
            top.$App.show("compose",null,{inputData:{ receiver: receiver}});
            //swindow.top.CM.show({ receiver: receiver });
        }
    }
}

//发彩信[新]
function senNewMMS(receiver, params, scontent) {
    if (top.$User && !top.$User.checkAvaibleForMobile()) { // 检测对应功能是否对互联网用户开放
            return;
    }
    var arr = [];
    if (receiver) {
        arr = receiver.split(",");
    }
    top.Main.setReplyMMSData({ receivers: arr, content: scontent || "" });

    window.top.Links.show("mms", "&mmstype=diy&initData=replyMMSData" + (params || ""));
}

//发彩信按钮
function redirectMMS(params, scontent) {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "MMS";
        if (!sendCantactServer.CheckContactType("m")) {
            return false;
        }
    }
    var map = {};
    $(contacts).each(function() {
        var mobile = this.getFirstMobile().replace(/\D/g, "");
        if (!mobile || map[mobile]) return;
        map[mobile] = true;
        receiver += mobile + ",";
    })
    senNewMMS(receiver, params || "", scontent || "");
}
//发短信按钮
function redirectSMS(params) {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    hideMenu();
    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    else if (contacts.length == 1) {
        sendSMS(contacts[0].SerialId, params);
        return;
    }
    var map = {};
    $(contacts).each(function() {
        var mobile = this.getFirstMobile().replace(/\D/g, "");
        if (!mobile || map[mobile]) return;
        map[mobile] = true;
        receiver += mobile + ",";
    })
    window.top.Links.show("sms", "&mobile=" + receiver + params || '');
}

function redirectFax() {
    hideMenu();
    var receiver = [];
    var contacts = Tool.getSelectedContacts();
    if (contacts.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    } else if (contacts.length == 1) {
        sendFax(contacts[0].SerialId);
        return;
    }

    var map = {};
    $(contacts).each(function() {
        var fax = this.getFirstFax().replace(/\D/g, "");
        if (!fax || map[fax]) return;
        map[fax] = true;
        receiver.push(fax)
    })

    var faxNumber = receiver.join(',');
    Tool.hideControlBar();
    showfax(faxNumber);
}

function showfax(faxNumber) {
    window.top.Links.show("fax", "&to=" + faxNumber);
    setTimeout(function() {
        top.Utils.waitForReady("top.MM.currentModule.container.contentWindow.document.getElementById", function() {
            try {
                top.MM.currentModule.container.contentWindow.document.getElementById("tbRMobile").value = faxNumber;
            } catch (e) { }
        });
    }, 1500);
}

//发明信片按钮
function redirectPCard() {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);
        return;
    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$',MAXSEND));
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "PCard";
        if (!sendCantactServer.CheckContactType("e")) {
            return false;
        }
    }
    var receiver = "";
    var map = {};
    $(contacts).each(function() {
        var email = this.getFirstEmail();
        if (!email || map[email]) return;
        map[email] = true;
        var name = this.name.replace(/"/g, "");
        //name = encodeURIComponent(name);
        receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
    });
    receiver = encodeURIComponent(receiver);//中文
    //receiver = escape(receiver);//统一用escape

    top.Links.show("postcard", "&source=Addr&to=" + receiver + "&sendDate=&classid=2");
}

//发贺卡按钮
function redirectGCard() {
    var receiver = "";
    var contacts = Tool.getSelectedContacts();
    var MAXSEND = Pt.getMaxSend();
    var serviceItem = Pt.getServiceItem();
    hideMenu();

    if (contacts.length == 0) {
        Pt.alert(PageMsg.warn_noneselect);
        return;
    } else if (contacts.length > MAXSEND) {
        var msg = serviceItem == '0017' ? PageMsg['warn_emailover'] + PageMsg['warn_emailoverreducetip']
                                        : PageMsg['warn_emailover'] + PageMsg['warn_emailovergradetip'];
        Pt.alert(msg.replace('$maxsend$',MAXSEND));
        return;
    }
    else if (contacts.length == 1) {
        sendCantactServer.selContact = contacts[0];
        sendCantactServer.sendType = "GCard";
        if (!sendCantactServer.CheckContactType("e")) {
            return false;
        }
    }
    var receiver = "";
    var map = {};
    $(contacts).each(function() {
        var email = this.getFirstEmail();
        if (!email || map[email]) return;
        map[email] = true;
        var name = this.name.replace(/"/g, "");
        //name = encodeURIComponent(name);
        receiver += contacts.length > 20 ? (email + "; ") : '"{0}"<{1}>; '.format(name, email);
    });
    receiver = encodeURIComponent(receiver);//中文
    //console.log(receiver);
    top.Links.show("greetingcard", "&source=Addr&to=" + receiver + "&sendDate=&classid=5");

}

//点击删除组
function deleteGroup(groupId) {
    if (top.Utils.PageisTimeOut(true)) {
        return;
    }
    var contactsId = top.Contacts.getContactsByGroupId(groupId);
    if (contactsId.length == 0) {
       top.FloatingFrame.confirm(PageMsg.warn_delgrouponly, deleteTeam);
        return;
    }

    var content = PageMsg.warn_delgroup.replace("$checkbox$", "<br><label for='yesDeleteTeam'><input id='yesDeleteTeam' type='checkbox' />") + "</label>";
    var dialog = top.$Msg.confirm(content, function() {
				var deleteAll = !!dialog.jContainer.find("#yesDeleteTeam").attr("checked");
				deleteTeam(deleteAll);
			},"","",{isHtml:true});

    function deleteTeam(deleteContacts) {
        window.top.Contacts.deleteGroup(groupId, function(result) {
            if (result.success) {
                top.M139.UI.TipMessage.show(PageMsg.info_success_del, { delay: 2000 });
                View.dataUpdate("DeleteGroup");
				if(deleteContacts){ //彻底删除本组联系人--更新vip联系人信息
					var delContactsId = [];
					for(var i=0; i<contactsId.length; i++){
						if(contactsId[i]){
							delContactsId.push(contactsId[i].SerialId);
						}
					}
					var vipList = top.Contacts.FilterVip(delContactsId);
					if(vipList.length>0){
						vipLIst = vipList.join(",");
						top.Contacts.updateCache("delVipContacts",vipLIst);
						//top.Main.searchVipEmailCount();
						Tool.updateVipMail();
						var vip = top.Contacts.data.vipDetails;
						var vipCount = vip.vipn || 0;
						$("#vipCount").text("(" + vipCount+ ")");
					}
				}
            } else {
                Pt.alert(result.msg);
            }
        }, deleteContacts);
    }
}

//点击快速编辑图标
function QE(sender) {
    var serialId = Tool.getRowContactsId(sender);
    QuickEditServer.serialIdQES = serialId;
    showEdit(sender, serialId);
    top.addBehaviorExt({ actionId: 1417, thingId: 1, moduleId: 14 });
}

//编辑
function editContacts(param) {
    if (mail139.addr.home.isediting) return;
    if (typeof (param) != "object") {
        var serialId = param;
    } else {
        if (param.serialId) {
            var serialId = param.serialId;
        } else if (param.tagName) {
            var serialId = Tool.getRowContactsId(param);
        } else {
            View.changeView("Redirect", { key: "addContacts", name: param.name, email: param.email, mobile: param.mobile, fax: param.fax });
            return;
        }
    }
    if (serialId) View.changeView("Redirect", { key: "editContacts", serialId: serialId });
    top.addBehaviorExt({ actionId: 1417, thingId: 0, moduleId: 14 });
}

function getDataTR(tag) {//得到编辑数据行
    while (tag) {
        if (tag.tagName == "TR") {
            return tag;
        }
        tag = tag.parentNode;
    }
    return null;
}

function getDataTD(tr, tdName) {
    return $(tr).children("td:has(a[jpath='" + tdName + "'])");
}

//取编辑值
function getEditValue(td) {
    return $(td).children("input").val();
}

function setSaveShow(currentRow, isShow) {
    var $row = $(currentRow);
    var $ico = $row.find('.i-edit1, .i-edit-suc');
    var $txt = $row.find('input');

    $ico.removeClass();
    if (isShow) {
        $ico.addClass('i-edit-suc');

        //设置回车保存
        $txt.keypress(function(e){
            if (e.which === 13) {
                $ico.trigger(jQuery.Event( "click" ));
            }
        });

    } else {
        $ico.addClass("i-edit1");
    }
}

function showEdit(tag, serialId) {//编辑或保存当前选中行
    var tmpTR = QuickEditServer.trQES; //用户前一个操作行
    var currentRow = getDataTR(tag);
    QuickEditServer.trQES = currentRow;
    if (currentRow) {
        var tdName = getDataTD(currentRow, "name");
        var tdEmail = getDataTD(currentRow, "email");
        var tdMobile = getDataTD(currentRow, "mobile");
        if (tdName && tdEmail && tdMobile) {
            var btnUpdate = $(currentRow).find("td .i-edit1");
            if (btnUpdate && btnUpdate.length > 0) {//编辑
                if (QuickEditServer.haveEdit) {
                    QuickEditServer.trQES = tmpTR; //恢复用户前一个操作行
                    return false;
                }

                var inputText, nameLink;
                //姓名
                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"12\" name=\"name\" id=\"name\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdName).children("a")[0];
                QuickEditServer.nameQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.nameQES )
                );

                $(tdName).prepend(inputText);
                $(nameLink).hide();

                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"90\"  name=\"FamilyEmail\" id=\"FamilyEmail\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdEmail).children("a")[0];
                QuickEditServer.emailQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.emailQES )
                );

                $(tdEmail).prepend(inputText);
                $(nameLink).hide();

                inputText = "<input class=\"ipt-edit\" type=\"text\" maxlength=\"20\"  name=\"MobilePhone\" id=\"MobilePhone\" class=\"tinytxt\" value=\"{0}\"/>";
                nameLink = $(tdMobile).children("a")[0];
                QuickEditServer.mobileQES = $(nameLink).text();

                inputText = inputText.format(
                    Pt.htmlEncode( QuickEditServer.mobileQES )
                );

                $(tdMobile).prepend(inputText);
                $(nameLink).hide();

                QuickEditServer.haveEdit = true;
                setSaveShow(currentRow, true);
            }
            else { //保存
                if (!mail139.addr.home.edit.isChanged()) {
                    hideEdit(tdName, tdEmail, tdMobile);
                    QuickEditServer.haveEdit = false;
                    return false;
                }

                var vName = getEditValue(tdName);
                var vEmail = getEditValue(tdEmail);
                var vMobile = getEditValue(tdMobile);

                vName = $.trim(vName);
                vEmail = $.trim(vEmail);
                vMobile = $.trim(vMobile);
                if (!ValidateEditData(vName, vEmail, vMobile)) {//数据验证
                    top.$Msg.alert(top.Contacts.validateAddContacts.error);
                    return false;
                }

                mail139.addr.home.edit.save({
                    'serialId': QuickEditServer.serialIdQES,
                    'name': vName, 'email': vEmail, 'mobile': vMobile
                });
                return true;
            }
        }
    }
}

function SetNewContact(tdName, tdEmai, tdMobil, result) {
    var c = result.ContactInfo,
        name = c.AddrFirstName,
        email1 = c.FamilyEmail,
        email2 = c.BusinessEmail,
        mobile1 = c.MobilePhone,
        mobile2 = c.BusinessMobile;

    $(tdName).children("a").text(name);
    if (email1 && $.trim(email1)) {
        $(tdEmai).children("a").text(email1);
    } else if (email2 && $.trim(email2)) {
        $(tdEmai).children("a").text(email2);
    }
    else {
        $(tdEmai).children("a").text("");
    }

    var $mn = $(tdMobil);
    var $txtMn = $mn.children('a');
    var $col_op = $mn.next();

    if (mobile1 && $.trim(mobile1)) {
        $txtMn.text(mobile1);
    } else if (mobile2 && $.trim(mobile2)) {
        $txtMn.text(mobile2);
    } else {
        $txtMn.text("");
    }

    //这里增加更新，飞信图标的逻辑
    var mobile = mobile1 || mobile2 || "";
    mobile = Tool.fixmobile(mobile);

    if (mobile && Render.fetionlogined() && $Mobile.isChinaMobile(mobile)) {
        if ($col_op.find('.j_fxico').length === 0) {
            $(Render.Template.fetionico).insertAfter($col_op.find(".jico_edit"));
        }
    } else {
        $col_op.find(".j_fxico").remove();
    }
}

function hideEdit(tdName, tdEmail, tdMobile) {
    $(tdName).children("#name").remove();
    $(tdName).children("a").show();

    $(tdEmail).children("#FamilyEmail").remove();
    $(tdEmail).children("a").show();

    $(tdMobile).children("#MobilePhone").remove();
    $(tdMobile).children("a").show();

    QuickEditServer.haveEdit = false;

    setSaveShow(QuickEditServer.trQES, false);
}

var gContactsDetails = new top.ContactsInfo({
    "name": "", "FamilyEmail": "", "OtherEmail": "", "MobilePhone": "", "FamilyPhoneBrand": "", "FamilyPhoneType": "",
    "OtherMobilePhone": "", "OtherPhoneBrand": "", "OtherPhoneType": "", "OtherPhone": "", "OtherFax": "", "GroupId": "",
    "ImageUrl": "", "AddrNickName": "", "UserSex": "", "BirDay": "", "StartCode": "", "BloodCode": "", "OtherIm": "", "OICQ": "", "MSN": "", "PersonalWeb": "", "Memo": "",
    "FamilyPhone": "", "FamilyFax": "", "ProvCode": "", "CityCode": "", "HomeAddress": "", "ZipCode": "",
    "CPName": "", "UserJob": "", "BusinessEmail": "", "BusinessMobile": "", "BusinessPhoneBrand": "", "BusinessPhoneType": "", "BusinessPhone": "", "BusinessFax": "",
    "CPProvCode": "", "CPCityCode": "", "CPAddress": "", "CPZipCode": "", "CompanyWeb": ""
});

//快速编辑
var QuickEditServer = {
    serialIdQES: ""
    , haveEdit: false//是否已存在编辑行
    , haveSel: null
    , trQES: null//当前编辑的行
    , nameQES: ""//当前编辑行联系人的初始：name
    , emailQES: ""//当前编辑行联系人的初始：email
    , mobileQES: ""//当前编辑行联系人的初始：mobile
    , isCheck: true//编辑数据是否验证通过
    , checkEdit: function() {//离开快速编辑框验证
        var ans = true;
        var msg = "您正在编辑的信息尚未保存，是否保存后再离开？";

        if (QuickEditServer.trQES) {
            var tdName = getDataTD(QuickEditServer.trQES, "name");
            var tdEmail = getDataTD(QuickEditServer.trQES, "email");
            var tdMobile = getDataTD(QuickEditServer.trQES, "mobile");
            if (tdName && tdEmail && tdMobile) {
                if ($(tdName).children("input")) {
                    var nameText = $(tdName).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.nameQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
                if ($(tdEmail).children("input")) {
                    var nameText = $(tdEmail).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.emailQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
                if ($(tdMobile).children("input")) {
                    var nameText = $(tdMobile).children("input")[0];
                    if (nameText) {
                        if (!nameText.disabled) {
                            var vName = nameText.value;
                            if (QuickEditServer.mobileQES != vName) {
                                ans = window.confirm(msg);
                                if (ans == true) {
                                    QuickEditServer.isCheck = true;
                                    return true;
                                }
                                else {//要保存数据                                    
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!QuickEditServer.isCheck) {
            ans = window.confirm(msg);
            if (ans == true) {
                QuickEditServer.isCheck = true;
                return true;
            }
            else {//要保存数据                                    
                return false;
            }
        }
        return true;
        var tdName = getDataTD(QuickEditServer.trQES, "name");
        var tdEmail = getDataTD(QuickEditServer.trQES, "email");
        var tdMobile = getDataTD(QuickEditServer.trQES, "mobile");
        if (tdName && tdEmail && tdMobile) {
            hideEdit(tdName, tdEmail, tdMobile);
            QuickEditServer.haveEdit = false;
        }
    }
}

var sendCantactServer = {
    selContact:null, sendType:""//类型验证type:Mail表示发邮件,PCard表示明信片,GCard表示发贺卡,MMS表示发短信，SMS表示发彩信，Fax表示发传真
    , serialId:"", nextHtm:"", inputV:""//输入值
    , hoverRow:null //所在行
    , sinviteFriend:function () {//邀请
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                inviteFriendInCard({serialId:sendCantactServer.selContact.SerialId, email:sendCantactServer.inputV }); //邀请好友
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sAddVip:function () { //添加vip联系人
        var request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                addSinglVipInCard({serialId:info.SerialId, name:info.name }); //添加VIP联系人
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });

    },
    sQuickSendEmail:function () {//快捷发邮件
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                sendMailQuickInCard({serialId:info.SerialId, name:info.name, email:sendCantactServer.inputV}); //快捷发邮件
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    },
    sSetFilter:function () {
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId, top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);
                var info = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
                setFilterInCard({serialId:info.SerialId, name:info.name, email:sendCantactServer.inputV}); //设置邮件分拣
                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    },
    //[FIXED]  Used
    sMailSCS:function () { //发邮件
        var request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                //top.$App.show("compose", null, {inputData:{ receiver:"\"" + sendCantactServer.selContact.name + "\"<" + sendCantactServer.inputV + ">;" }})

                //修复：通讯录联系人中未填写邮件，发送自己的电子名片时，会被替换成发送邮件的问题
                var composeParms = { inputData: { receiver: "\"" + sendCantactServer.selContact.name + "\"<" + sendCantactServer.inputV + ">;" } };
                if (sendCantactServer.sendType2) {
                    composeParms.inputData.type = sendCantactServer.sendType2;
                    sendCantactServer.sendType2 = null;
                }
                top.$App.show("compose", null, composeParms);

                //补上刚才编辑的那行联系人电邮地址
                $(sendCantactServer.hoverRow).find("a[jPath='email']").text(sendCantactServer.inputV);

                top.addBehavior("成功编辑通讯录联系人_发邮件");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sPCardSCS:function () { //明信片
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                top.Links.show("postcard", "&source=Addr&to=" + sendCantactServer.inputV + "&sendDate=&classid=2");
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='emaild']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发明信片");
            } else {
                Pt.alert(result.msg);
            }
        });
    }, sGCardSCS:function () {//贺卡
        var request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );
        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.FamilyEmail = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.FamilyEmail = sendCantactServer.inputV;
                sendCantactServer.selContact.emails.push(sendCantactServer.inputV);
                top.Links.show("greetingcard", "&source=Addr&to=" + sendCantactServer.inputV + "&sendDate=&classid=5");
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='email']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发贺卡");
            } else {
                Pt.alert(result.msg);
            }
        });
    },

    /**
     * 发短信时，遇到没有手机号时的弹出的添加手机号的逻辑
     */
    sMMSSCS:function () {
        var request;

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.MobilePhone = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }

        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.MobilePhone = sendCantactServer.inputV;
                sendCantactServer.selContact.mobiles.push(sendCantactServer.inputV);
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='mobile']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发彩信");

                senNewMMS(sendCantactServer.inputV.replace(/\D/g, ""));
            } else {
                Pt.alert(result.msg);
            }
        });
    },

    sSMSSCS:function () { //短信

        var request = "<AddContactsField><SerialId>{0}</SerialId><MobilePhone>{1}</MobilePhone></AddContactsField>".format(
            sendCantactServer.selContact.SerialId,
            top.encodeXML(sendCantactServer.inputV)
        );

        //[FIXED] 接口改变，需要传所有的信息
        var contacts = top.Contacts.getContactsById(sendCantactServer.selContact.SerialId);
        if (contacts) {
            contacts.MobilePhone = top.encodeXML(sendCantactServer.inputV);
            request = contacts;
        }
        top.FF.close();
        top.Contacts.execContactDetails(request, function (result) {
            if (result.success) {
                sendCantactServer.selContact.MobilePhone = sendCantactServer.inputV;
                sendCantactServer.selContact.mobiles.push(sendCantactServer.inputV);
                $("#tableContactsList tr[SerialId='{0}'] a[jPath='mobile']".format(sendCantactServer.selContact.SerialId)).text(sendCantactServer.inputV);
                top.addBehavior("成功编辑通讯录联系人_发短信");
                window.top.Links.show("sms", "&mobile=" + sendCantactServer.inputV.replace(/\D/g, ""));
            } else {
                Pt.alert(result.msg);
            }
        });
    },


    checkInput:function (inputValue) {//输入数据检查

        if (sendCantactServer.sendType == "MMS" || sendCantactServer.sendType == "SMS") {
            if (inputValue && !top.Validate.test("mobile", inputValue)) {
                top.Contacts.validateAddContacts.error = top.Validate.error;
                return false;
            }
            if (inputValue && inputValue.getByteCount() > 100) {
                top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactMobileToolong'];
                return false;
            }
        } else if (sendCantactServer.sendType == "Fax") {
            if (inputValue && !top.Validate.test("fax", inputValue)) {
                top.Contacts.validateAddContacts.error = top.Validate.error;
                return false;
            }
        } else {
            if (!top.Validate.test("email", inputValue)) {
                top.Contacts.validateAddContacts.error = PageMsg['error_emailIllegal'];
                return false;
            }
            if (inputValue && inputValue.getByteCount() > 60) {
                top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactEmailToolong'];
                return false;
            }
        }

        return true;
    }, toNext:function () {//类型验证type:Mail表示发邮件,PCard表示明信片,GCard表示发贺卡,MMS表示发彩信，SMS表示发短信，Fax表示发传真
        switch (sendCantactServer.sendType) {
            case "Mail":
                sendCantactServer.sMailSCS();
                break;
            case "PCard":
                sendCantactServer.sPCardSCS();
                break;
            case "GCard":
                sendCantactServer.sGCardSCS();
                break;
            case "MMS":
                sendCantactServer.sMMSSCS();
                break;
            case "SMS":
                sendCantactServer.sSMSSCS();
                break;
            case "AddVip":
                sendCantactServer.sAddVip();
                break;
            case "inviteFriend":
                sendCantactServer.sinviteFriend();
                break;
            case "quickSendMail":
                sendCantactServer.sQuickSendEmail();
                break;
            case "setFilter":
                sendCantactServer.sSetFilter();
                break;
        }
    }, CheckContactType:function (type) {
        if (type == "e") {
            if ((!sendCantactServer.selContact.FamilyEmail || $.trim(sendCantactServer.selContact.FamilyEmail) == "") &&
                (!sendCantactServer.selContact.BusinessEmail || $.trim(sendCantactServer.selContact.BusinessEmail) == "")) {
                sendCantactServer.ShowNext("邮箱地址", "邮箱");
                return false;
            }
        }
        else if (type == "m") {
            //如果已在通讯录，则检测完善手机号步骤
            //如果没在通讯录，则是未保存的最近联系人，这时就还需要添加联系人操作
            if (sendCantactServer.selContact == null) {
                sendCantactServer.ShowNext("手机号码", "手机号码");
                return false;
            }

            if ((!sendCantactServer.selContact.MobilePhone || $.trim(sendCantactServer.selContact.MobilePhone) == "") &&
                (!sendCantactServer.selContact.BusinessMobile || $.trim(sendCantactServer.selContact.BusinessMobile) == "")) {
                sendCantactServer.ShowNext("手机号码", "手机号码"); //请输入手机号码
                return false;
            }
        }

        return true;
    }, GetNextHtm:function (name) {
        sendCantactServer.nextHtm = '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="tb_folderName" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="divError" name="divError"  style="color:Red;padding-left:100px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:void(0)"  id="btnSendNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
            </div>'.format(name);
    }, ShowNext:function (title, name) {
        sendCantactServer.GetNextHtm(name);
        top.FF.show(sendCantactServer.nextHtm, "联系人资料没有" + title);
        top.$("#btnSendNext").click(function () {
            var inputValue = top.$("#tb_folderName").val().trim();
            if (inputValue == "") {
                top.$("#divError").text("不能为空");
                return false;
            }
            if (!sendCantactServer.checkInput(inputValue)) {
                top.$("#divError").text(top.Contacts.validateAddContacts.error);
                return false;
            }
            sendCantactServer.inputV = inputValue;
            sendCantactServer.toNext();
        });
    }
};

//得到编辑联系人数据
function getEditData() {
    try {
        top.Contacts.getContactsInfoById(QuickEditServer.serialIdQES, function(result) {
            if (result.success) {
                for (m in result.contactsInfo) {
                    gContactsDetails[m] = result.contactsInfo[m];
                }
                QuickEditServer.haveSel = true;
            }
            else {
                Pt.alert(result.msg);
            }
            return;
        });
    } catch (e) { }
}

//数据更新:有修改为true
function updateEditData(name, email, mobile) {
    var isEdit = false;
    if ($.trim(gContactsDetails["AddrFirstName"]) != name) {
        gContactsDetails["AddrFirstName"] = name;
        isEdit = true;
    }
    if ($.trim(QuickEditServer.emailQES) == $.trim(gContactsDetails["FamilyEmail"])) {
        if (email != $.trim(gContactsDetails["FamilyEmail"])) {
            gContactsDetails["FamilyEmail"] = email;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.emailQES) == $.trim(gContactsDetails["BusinessEmail"])) {
        if (email != $.trim(gContactsDetails["BusinessEmail"])) {
            gContactsDetails["BusinessEmail"] = email;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.mobileQES) == $.trim(gContactsDetails["MobilePhone"])) {
        if (mobile != $.trim(gContactsDetails["MobilePhone"])) {
            gContactsDetails["MobilePhone"] = mobile;
            isEdit = true;
        }
    }
    if ($.trim(QuickEditServer.mobileQES) == $.trim(gContactsDetails["BusinessMobile"])) {
        if (mobile != $.trim(gContactsDetails["BusinessMobile"])) {
            gContactsDetails["BusinessMobile"] = mobile;
            isEdit = true;
        }
    }
    return isEdit;
}

//验证数据合法性
function ValidateEditData(name, email, mobile) {
    if (!name || $.trim(name) == "") {
        top.Contacts.validateAddContacts.error = "请输入联系人姓名";
        QuickEditServer.isCheck = false;
        return false;
    }
    if ($.trim(name).getByteCount() > 100) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = top.frameworkMessage['warn_contactNameToolong'];
        return false;
    }
    if (email && !top.Validate.test("email", email)) {
        top.Contacts.validateAddContacts.error = top.Validate.error;
        QuickEditServer.isCheck = false;
        return false;
    }
     if (email && !(email.length >= 6 &&  email.length <= 90)) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = "请输入正确的邮件地址";
        return false;
    }

    if (mobile && !top.Validate.test("mobile", mobile)) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = top.Validate.error;
        return false;
    }
    if (mobile && mobile.getByteCount() > 100) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = frameworkMessage['warn_contactMobileToolong'];
        return false;
    }
    if (!email && !mobile) {
        QuickEditServer.isCheck = false;
        top.Contacts.validateAddContacts.error = "手机号码和邮件地址请至少填写一项!";
        return false;
    }
    QuickEditServer.isCheck = true;
    return true;
}

//联系人名片
function contactsBusinesscard(param) {
    if (mail139.addr.home.isediting) return;
    top.addBehaviorExt({ actionId: 1417, thingId: 3, moduleId: 19 });
    if (typeof (param) != "object") {
        var serialId = param;
    } else {
        if (param.serialId) {
            var serialId = param.serialId;
        } else if (param.tagName) {
            var serialId = Tool.getRowContactsId(param);
        } else {
            View.changeView("Redirect", { key: "contactsBusinesscard", name: param.name, email: param.email, mobile: param.mobile, fax: param.fax });
            return;
        }
    }
    if (serialId) View.changeView("Redirect", { key: "contactsBusinesscard", serialId: serialId });
}

//删除联系人
function deleteContacts(obj) {
    if (obj) {
        var serialId = Tool.getRowContactsId(obj);
    } else {
        var serialId = Tool.getSelectedContacts(true);
        if (serialId.length == 0) {
            Pt.alert(PageMsg.warn_noneselect);
            return;
        }
    }
    if (filter.groupId && filter.groupId > 0) {
        var msg = PageMsg['warn_delInGroup'] || "";
        msg = msg.replace("$checkbox$", "<br><label for='yesDeleteContactsFromGroup'><input id='yesDeleteContactsFromGroup' type='checkbox'/>");
        msg = msg.length < 1 ? "" : (msg + "</label>");

        var dialog = top.$Msg.confirm(msg,function(){
			var isRealDeleteContacts = !!dialog.jContainer.find("#yesDeleteContactsFromGroup").attr("checked");	
		   if (isRealDeleteContacts) {
                realDelete();
            } else {
                deleteFromGroup();
            }
        },"","",{isHtml:true})
    } else {
		var tipMsg = PageMsg['warn_delcontact'] || "" ;
		var hasVip = top.Contacts.FilterVip(serialId);
		if(hasVip.length > 0){
			tipMsg = serialId.length > 1 ? PageMsg['warn_delContactsHasVip'] : PageMsg['warn_delVipContact'];
		}
        top.FloatingFrame.confirm(tipMsg, realDelete);
    }
    //彻底删除
    function realDelete() {
		
        window.top.Contacts.deleteContacts(serialId, function(result) {
            if (result.success) {
                View.dataUpdate("DeleteContacts", { GroupId: filter.groupId });
                mail139.addr.home.reload();
				//更新vip联系人信息
				var vipList = top.Contacts.FilterVip(serialId); 
				if(vipList.length>0){
					vipLIst = vipList.join(",");
					top.Contacts.updateCache("delVipContacts",vipLIst);
					//top.Main.searchVipEmailCount();
					Tool.updateVipMail();
					var vip = top.Contacts.data.vipDetails;
					var vipCountUpdate = vip.vipn || 0;
					$("#vipCount").text("(" + vipCountUpdate + ")");
				}
            } else {
                Pt.alert(result.msg);
            }
        });
    }
    //仅删除组关系
    function deleteFromGroup() {
        window.top.Contacts.deleteContactsFromGroup(filter.groupId, serialId, function(result) {
            if (result.success) {
                View.dataUpdate("DeleteContacts", { GroupId: filter.groupId });
            } else {
                Pt.alert(result.msg);
            }
        });
    }
}

//单点发邮件
function sendMail(obj) {
    $("#controlBar").hide();
    if (typeof (obj) != "object") {
        var serialId = obj;
    } else {
        if (obj.addrType && obj.addrType != "E") {
            strangerAddContacts("email", obj);
            return;
        }
        if (obj.addrContent) {

            top.$App.show("compose",null,{inputData:{receiver: obj.addrContent + ";"}})
            //window.top.CM.show({ receiver: obj.addrContent + ";" });
            top.addBehaviorExt({ actionId: 26014, thingId: 7, moduleId: 19 });
            return;
        } else {
            var serialId = Tool.getRowContactsId(obj);
        }
    }
    var info = window.top.Contacts.getContactsById(serialId);
    if (info.emails.length == 0) {
        sendCantactServer.selContact = info;
        sendCantactServer.sendType = "Mail";
        if (!sendCantactServer.CheckContactType("e")) {
            return;
        }
    } else {
        top.$App.show("compose",null,{inputData:{receiver: "\"" + info.name + "\"<" + info.getFirstEmail() + ">;" }})
        top.addBehaviorExt({ actionId: 26014, thingId: 7, moduleId: 19 });
    }
}

function strangerAddContacts(type, obj) {

    var info;
    if (obj.addrType) {
        info = new top.ContactsInfo({
            name: (obj.addrName || obj.addrContent)
        });
    } else {
        info = obj;
    }

    switch (obj.addrType) {
        case "E": 
            {
                info.FamilyEmail = obj.addrContent;
                break;
            }
        case "M": 
            {
                info.MobilePhone = obj.addrContent;
                break;
            }
        case "F": 
            {
                info.BusinessFax = obj.addrContent;
                break;
            }
    }

    switch (type) {
        case "email": 
            {
                var title = PageMsg['warn_emailtitle'];
                var message = PageMsg['warn_email'];
                var property = "FamilyEmail";
                var maxLength = 90;
                break;
            }
        case "mms":
        case "sms": 
            {
                var title = PageMsg['warn_mobiletitle'];
                var message = PageMsg['warn_mobile'];
                var property = "MobilePhone";
                var maxLength = 20;
                break;
            }
        case "fax": 
            {
                var title = PageMsg['warn_faxtitle'];
                var message = PageMsg['warn_fax'];
                var property = "BusinessFax";
                var maxLength = 30;
                break;
            }
    }

    top.FloatingFrame.prompt(title, message, "", function(num) {
        if (num.trim() == "") {
            Pt.alert(message);
            return;
        }
        info[property] = num;
        top.Contacts.addContactDetails(info, function(result) {
            if (result.success) {
                switch (type) {
                    case "email":
                        {
                            sendMail(result.serialId);
                            break;
                        }
                    case "sms":
                        {
                            sendSMS(result.serialId);
                            break;
                        }
                    case "mms":
                        {
                            sendMMS(result.serialId);
                            break;
                        }
                    case "fax":
                        {
                            sendFax(result.serialId);
                            break;
                        }
                }
            } else {
                Pt.alert(result.msg);
            }
        });
    }, maxLength);
}

//复制到
function copyContactsToGroup(groupId) {
    if (groupId == filter.groupId) {
        Pt.alert(PageMsg['warn_hasgrouped']);
        return;
    }
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    window.top.Contacts.copyContactsToGroup(groupId, serialId, function(result) {
        if (result.success) {
            Pt.alert(PageMsg['info_success_copy']);
            View.dataUpdate("CopyContactsToGroup", { GroupId: filter.groupId });
        } else {
            Pt.alert(result.msg);
        }
    });
}

//复制到新建组
function copyContactsToNewGroup() {
    var MAXLENGTH_GROUP = 16;
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        Pt.alert(PageMsg['warn_noneselect']);
        return;
    }
    sendCantactServer.GetNextHtm("分组名称");
    top.FF.show(sendCantactServer.nextHtm, "新建组");
    top.$("#btnSendNext").click(function() {
        var groupName = top.$("#tb_folderName").val().trim();
        if (groupName == "") {
            top.$("#divError").text("分组名称不能为空");
            return false;
        } else if (top.Contacts.isExistsGroupName(groupName)) {
            top.$("#divError").text("组名重复，请尝试其它组名");
            return false;
        } else if (groupName.length > MAXLENGTH_GROUP) {
            top.$("#divError").text(PageMsg['warn_groupoverflow'].replace("$maxlength$", MAXLENGTH_GROUP));
            return false;
        }
        else {
            window.top.Contacts.editGroupList({ groupName: groupName, serialId: serialId },
            function(result) {
                if (result.ResultCode == "0") {

                    var param = {
                        "groupName": groupName,
                        "serialId": serialId.join(","),
                        "groupId": result.GroupInfo[0].GroupId
                    }

                    top.Contacts.updateCache("AddGroup", param);
                    top.Contacts.updateCache("CopyContactsToGroup", param);
                    View.dataUpdate("CopyContactsToGroup");

                    top.FF.close();
                    Pt.alert("复制成功");
                } else {
                    Pt.alert("复制失败");
                }
            });
        }
    });

}

//移动到
function moveContactsToGroup(groupId) {
    if (groupId == filter.groupId) {
        Pt.alert(PageMsg['warn_hasgrouped']);
        return;
    }
    if (!filter.groupId || !groupId) {
        throw PageMsg['error_notarget'];
    }
    var serialId = Tool.getSelectedContacts(true);
    if (serialId.length == 0) {
        return Pt.alert(PageMsg['warn_noneselect']);
    }
    window.top.Contacts.moveContactsToGroup(serialId, filter.groupId, groupId, function(result) {
        if (result.success) {
            Pt.alert("移动成功");
            View.dataUpdate("MoveContactsToGroup", { GroupId: filter.groupId });
        } else {
            Pt.alert(result.msg);
        }
    });
}

//搜索往来邮件
function searchMailRecords(param) {
    if (!param.serialId && !param.email) {
        var param = { serialId: Tool.getRowContactsId(param) };
    }
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        var keyword = "";

        //新基础层与CM都不支持多关键字搜索
        keyword = info.getFirstEmail();

    } else if (param.email) {
        var keyword = param.email;
    }
    $("#controlBar").hide();

    top.$App.trigger("mailCommand",{command:"showTraffic",email:$.trim(keyword)});
    top.addBehaviorExt({ actionId: 1416, thingId: 0, moduleId: 19 });
    top.addBehaviorExt({ actionId: 26014, thingId: 1, moduleId: 19 });
}

//联系人页卡-设置邮件分拣
function setFilterInCard(param){
	var obj = param ;
	var floders;//邮件分拣-转移到自定义文件夹及系统文件夹不包括type=5的标签
	if (typeof Array.prototype.filter == "function") {
		floders = top.FM.folderList.filter(function(f){return f.type!=5});
	} else {
		floders = $.grep(top.FM.folderList, function(f){return f.type!=5})
	}
	var email = "setFilterFrame";

    var html ="";
	var str1 = '<div id="forWinSetFilter" for ="forWinSetFilter"><iframe src="/setfilter.htm?name={0}&email={1}" id="setFilterFrame" name="setFilterFrame" frameborder="0" scrolling="no" style="width:100%;height:165px;"></iframe>'+
			   '<iframe src="/setfiltersuc.htm" id="setfiltersuc" name="setfiltersuc" frameborder="0" scrolling="no" style="width:100%;height:120px; display:none;"></iframe>'+
			   '<iframe src="/addfolderforcreatefilter.htm" id="newFilterFrame" name="newFilterFrame" frameborder="0" scrolling="no" style="width:100%;height:151px; display:none;"></iframe>'+
				'<ul id="filterToFloders" class="toolBar_listMenu listMenu_bar" style=" position: absolute; z-index: 1109;display:none; width:205px; width:206px\\0;  *width:206px;top: 103px;left: 61px;border: 1px solid #b1b1b1;padding: 2px 0;">';
		html += str1.format(escape(obj.name), obj.email);
		
	for(var i=0; i<floders.length; i++){
		var str = '<li id="{0}" f_name = "{1}" ><a href="javascript:void(0);"  style="width:205px;" ><span>{1}</span></a></li>'.format(floders[i].fid,floders[i].name);
		if(i == floders.length-1){ //最后一项上加上一个class
			str = '<li  id="{0}" f_name = "{1}" ><a href="javascript:void(0);" class="clasy_bd"  style="width:205px;" ><span>{1}</span></a></li>'.format(floders[i].fid,floders[i].name);
		}
		html += str;
	}	
	
	html += '<li id="addFloder"><a href="javascript:void(0);" style="width:205px;"><span>新建文件夹</span></a></li></ul></div>';
	
    top.FF.show(html,"创建邮件分拣规则");
}

//联系人页卡-快捷发信
function sendMailQuickInCard(param){
    var addrObj = param;
    var sid = Pt.getSid();
    var type = 'compose';
    var receiver = '"' + addrObj.name + '"<' + addrObj.email + '>';
		receiver = escape(receiver);
    var rnd = Math.random();
    var url = top.wmsvrPath2 + "/float_compose.htm?sid={0}&type={1}&receiver={2}&rnd={3}";
		url = url.format(sid,type,receiver,rnd);
    var htmlCode = "<iframe id='float_compose' src={0} frameBorder='0' scrolling=no style='width:100%;height:{2}px;'></iframe>".format(url,null,267);
    top.FF.show(htmlCode,"发邮件",516,267,true,function(){
        var float_compose = $('#float_compose');
        if(float_compose && float_compose.length > 0 && float_compose[0].contentWindow.ifrClosed){
            float_compose[0].contentWindow.ifrClosed();
        }else{
            top.FF.close();
        }
    });		
}

//联系人页卡-自动标签//对改联系人发来的信件标签-但不对历史邮件进行标签
function addTagInCard(){
	 top.tagsUI.showAddTagPage(this.OptSource,true);
}

//联系人页卡-邮件到达通知
function setMailNotifyInCard(){
  top.Links.show('mailnotify',"&type=setFilter");
}

//联系人页卡--邀请
function inviteFriendInCard(param){
	var addrObj = param;
    var email = addrObj.email.toLowerCase();
    top.Links.show("invitebymail", "&email=" + email);
}

//联系人页卡--编辑
function editContactsInCard(param){
	if(param.serialId){
		top.Links.show("addrContacts", "&type=edit&id=" + param.serialId);
	}
	
}

//联系人页卡--添加vip联系人
function addSinglVipInCard(param){
	if(!param.serialId){
		return false;
	}
	
	if(top.Contacts.IsPersonalEmail(param.serialId)){
		Pt.alert("不支持添加自己为VIP联系人。");
		return false;
	}
	
	var vips = top.Contacts.data.vipDetails;
	var vipGroupId = "",vipCount =0,vipMaxCount = top.Contacts.MAX_VIP_COUNT; //因后端接口限制
	if(vips.isExist){
		vipGroupId =vips.vipGroupId;
		vipCount = vips.vipn ;
	}
	
	if(vipCount >= vipMaxCount){
		var a = '<a hidefocus="" style="text-decoration:none;"href="javascript:top.FF.close();top.$App.show(\'addrvipgroup\');" ><br/>管理VIP联系人</span></a>';
		var msg = vipMsg.vipContactsMax.format(vipMaxCount,a);
		top.FF.alert(msg);
		return false;
	}
	top.WaitPannel.show("正在保存...");
	var requestData = {
				groupId : vipGroupId,
				serialId: param.serialId,
				groupType:1
	}
	
	//回调
	function callback(res){

		top.WaitPannel.hide();
		if(res.ResultCode != 0){
			if(res.resultCode == 23){ //分组联系人已达上限
				top.FF.alert(vipMsg.groupLimit);
				return false;
			}
			
			if(Retry.retryTime >=3){
				top.FF.alert(vipMsg.syserror);
				Retry.retryData = "";
				Retry.retryFun = null;
				Retry.retryTime = 0;
			}else{ //重试3次
				Retry.retryData = param;
				Retry.retryFun = addSinglVipInCard;
				top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.window.document.getElementById(\'addr\').contentWindow.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
					var Obj = top.window.document.getElementById("addr").contentWindow.Retry;
						Obj.retryData = "";
						Obj.retryFun = null;
						Obj.retryTime = 0;
				});
			}
			return false;
		}
		
		var sucMsg = vipMsg.addVipSuc.format(param.name);
			top.FF.alert(sucMsg);
		var vip = top.Contacts.data.vipDetails;
		var vipnum  = 0;
		if(vip.isExist){
			vipnum = vip.vipn
		}
		vipnum ++; 
		$("#vipCount").html("("+ vipnum + ")");
		
		top.Contacts.updateCache("addVipContacts",param.serialId);
		top.$App.trigger("change:contact_maindata");
		//第一次 创建VIP联系人会到后台取数据-导致数据还没获取到，前端已开始页面刷新，导致渲染有误。top.Contacts.isReady = false表示未后端数据未更新完
		var firstUpdateCash = top.Contacts.isReady;
		if(firstUpdateCash){
			updateCallback();
		}else{
			setTimeout(function(){top.WaitPannel.show("正在保存......");firstUpdateCash = top.Contacts.isReady;updateCallback();}, 380);
		}
		
		function updateCallback(){
			if(firstUpdateCash){
				Render.renderGroupView();
				Render.renderContactsList(true);
				Render.renderControlView();
				top.addBehaviorExt({ actionId: 103635, thingId: 0, moduleId: 14 });

				top.WaitPannel.hide();
			}
		}
	}
	
	top.Contacts.AddGroupList(requestData,callback);
}

//联系人页卡--取消vip联系人DelGroupList
function delSinglVipInCard(param){
	if(!param.serialId){
		return false;
	}
	top.WaitPannel.show("正在保存...");
	if(!top.Contacts.IsExitVipGroup){
		return false; //不存在vip联系人组
	}
	
	var vips = top.Contacts.data.vipDetails;
	var requestData = {
				groupId : vips.vipGroupId,
				serialId: param.serialId
	}
	//回调
	function callback(res){
		top.WaitPannel.hide();
		if(res.ResultCode != 0){
			if(Retry.retryTime >=3){
				top.FF.alert(vipMsg.syserror);
				Retry.retryData = "";
				Retry.retryFun = null;
				Retry.retryTime = 0;
			}else{ //重试3次
				Retry.retryData = param;
				Retry.retryFun = delSinglVipInCard;
				top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.window.document.getElementById(\'addr\').contentWindow.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
					var Obj = top.window.document.getElementById("addr").contentWindow.Retry; 
						Obj.retryData = "";
						Obj.retryFun = null;
						Obj.retryTime = 0;
				});
			}
			return false;
		}
		
		
		top.FF.alert(vipMsg.opSuc);
		var vipCount =top.Contacts.data.vipDetails.vipn - param.serialId.split(",").length;
		$("#vipCount").html("("+ vipCount + ")");
		top.Contacts.updateCache("delVipContacts",param.serialId);
		top.$App.trigger("change:contact_maindata");
		//vip联系人管理页 取消vip 刷新页面
		Render.renderGroupView();
		Render.renderContactsList(true);
		Render.renderControlView();
		Tool.updateVipMail();
		//top.Main.searchVipEmailCount(); //更新VIP邮件todo
	}
	top.Contacts.DelGroupList(requestData,callback);
}

//联系人页卡--更多
function gotoMoreMenu(e){
	$("#moreLinksInGetMail").bind('mouseleave',function(){$(this).hide();});//更多右侧的菜单
	
	//top值计算
	var topRelativeHeight = $("#usrInfoArea >div").height();
	if($.browser.msie & $.browser.version < 8){
		topRelativeHeight  += 1;
	}else{
		topRelativeHeight += 1;
	}
	topRelativeHeight += "px";
	var leftTableHeight = document.getElementById("attrCardPanel").offsetHeight;
	//var currentOffsetTop = 	$(e.target).offset().top;
	var currentOffsetTop = 	$("#controlBar").offset().top +84 +80;
	var currentBodyHeight =top.window.document.body.clientHeight; //窗口高度
	var rightMenuHeight = $("#moreLinksInGetMail").height();
	if(rightMenuHeight +currentOffsetTop> currentBodyHeight){ 
		/*if($.browser.msie & $.browser.version < 8){
			$("#moreLinksInGetMail").css("top","43px");
		}else{
			$("#moreLinksInGetMail").css("top","25px");
		}*/
		$("#moreLinksInGetMail").css("top","25px");
		
	}else{
		$("#moreLinksInGetMail").css("top",topRelativeHeight);
	}
	
	$("#moreLinksInGetMail").show();
	
}

//vip管理页面-批量添加vip联系(添加到vip组-刷新组信息)
function EditVipGroup(){
	var anchorLocal = (function(d){
		return (function(url){
			var b = d.createElement("a");
			b.href = url;
			d.body.appendChild(b);
            try {
                b.click();
            } catch (e) {
                b = d.createElement("META");
                b.httpEquiv="refresh";
                b.content="0;url=" + url;
                d.getElementsByTagName("head")[0].appendChild(b);
            }
		});
	})(document);

	top.Contacts.addVIPContact(function(){
		anchorLocal("addr_index.html?v=20120620&groupname=vipgroup");
	});
}



//搜索短信发送记录
function searchMobileRecords(param) {
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        if (info) {
            param.mobile = info.getFirstMobile();
        }
    }
    top.Links.show("smsHistory", "&Mobile=" + param.mobile);
}

//删除联系记录
function deleteLastContactsRecords(param) {
    param.type = filter.isCloseContacts ? "close" : "last";
    if (param.serialId) {
        var info = window.top.Contacts.getContactsById(param.serialId);
        var obj = {
            serialId: info.SerialId,
            email: info.emails.concat(),
            mobile: info.mobiles.concat(),
            fax: info.faxes.concat(),
            type: param.type,
            lastId: param.lastId
        };
    } else {
        var obj = param;
    }
    top.FloatingFrame.confirm(PageMsg['warn_delrecent'], function() {
        window.top.Contacts.DeleteLastContactsInfo(obj, function(result) {
            if (result.success) {
                View.showLastOrCloseContacts(filter.groupId == "-2");
            } else {
                Pt.alert(result.msg);
            }
        });
    })
}

//点垃圾桶图标，清空最近联系人记录
function emptyLastContactsRecords2() {
    (function(f, F, c) {
        var dat = c.data;
        //只有两个对象存在来判断；
        //dat.closeContacts || dat.lastestContacts

        if ((f.isCloseContacts && dat.closeContacts.length < 1)
             || (!f.isCloseContacts && dat.lastestContacts.length < 1)) {
            return;
        }

        var param = {
            type: f.isCloseContacts ? "close" : "last"
        };

        F.confirm(PageMsg['warn_del' + param.type], function() {
            top.addBehavior("19_9561_11清空最近/紧密", f.isCloseContacts ? "2" : "1");
            c.EmptyLastContactsInfo(param, function(result) {
                if (result.success) {
                    View.showLastOrCloseContacts(f.groupId == "-2");
                } else {
                    F.alert(result.msg);
                }
            });
        });

    })(filter, top.FloatingFrame, top.Contacts);
}


﻿

/**
 * 完成跳转，到发短/彩信/传真的流程控制处理
 */
(function(){

    //显示下一步对话框
    function NextBox(option) {

        var onError = function(summary, e) {
            var el = top.FF.current.$el;
            var txtError = el.find("#divError");
            if (txtError.length > 0) {
                txtError.text(summary);
            } else {
                el.find(".formLine").append('<li><div id="divError" name="divError" style="color:red;padding-left:100px">' + summary + '</div></li>');
            }
            e.cancel = true;
        };

        var dialog = top.FF.prompt(option.title, option.message, "",  function(num, e) {
            num = num.trim();

            if (!num) {
                onError((option.nullArgError || PageMsg['warn_mobile']), e);
                return;
            }

            if ($.isFunction(option.next)) {
                option.next(num, onError, e);
            }
        });

        return dialog;
    }

    //保存最近联系人为通讯录联系人
    function saveLastContact(info, success) {
        // {addrContent: "email", addrType: "E", addrName: "username"}

        var _info = { name: info.addrName };
        switch (info.addrType) {
            case "E": {
                _info.email = info.addrContent;
                break;
            }
            case "M": {
                _info.mobile = info.addrContent;
                break;
            }
            case "F": {
                _info.fax = info.addrContent;
                break;
            }
        }

        top.M2012.Contacts.API.addContacts(_info, function (result) {
            if (result.success) {
                top.M139.UI.TipMessage.show("添加成功", { delay: 3000 });
                success(result.contacts.SerialId);
            } else {
                top.FF.alert(result.error || result.msg);
            }
        });
    }

    //根据一个serialId，得到一个手机号，只针对，已保存联系人。
    function fetchMobile(serialId, onMobileFetch) {

        var contact = top.$App.getModel("contacts").getContactsById(serialId);
        if (!contact) {
            return;
        }

        if (contact.getFirstMobile()) {
            onMobileFetch(contact.getFirstMobile());

        } else {
            var _title = PageMsg['warn_mobiletitle'];
            var _message = PageMsg['warn_mobile'];

            var nextBox = new NextBox({
                title: _title,
                message: _message,
                next: function(value, onerror, e) {
                    var info = {
                        SerialId: serialId,
                        AddrFirstName: contact.name,
                        MobilePhone: value
                    };

                    var _info = new top.ContactsInfo(info);
                    var vdResult = _info.validateDetails(true);
                    if (!vdResult.success) {
                        onerror(vdResult.msg, e);
                        return;
                    }
                    _info = null;
                    vdResult = null;

                    top.Contacts.ModContactsField(serialId, info, false, function(result) {
                        if (result.success) {
                            onMobileFetch(value);
                        } else {
                            onerror(result.msg, e);
                        }
                        top.addBehaviorExt({ actionId: 26016, thingId: 2, moduleId: 19 });
                    });
                }
            });
        }
    }

    //根据一个serialId，得到一个传真号码，只针对，已保存联系人。
    function fetchFax(serialId, onFaxFetch) {

        var contact = top.$App.getModel("contacts").getContactsById(serialId);
        if (!contact) {
            return;
        }

        if (contact.getFirstFax()) {
            onFaxFetch(contact.getFirstFax());

        } else {
            var _title = PageMsg.warn_faxtitle;
            var _message = PageMsg.warn_fax;
            var _error = PageMsg.error_faxIllegal;

            var nextBox = new NextBox({
                title: _title,
                message: _message,
                nullArgError: _error,
                next: function(value, onerror, e) {

                    var _info = new top.ContactsInfo({
                        SerialId: serialId,
                        AddrFirstName: contact.name,
                        BusinessFax: value
                    });

                    var vdResult = _info.validateDetails(true);
                    if (!vdResult.success) {
                        onerror(vdResult.msg, e);
                        return;
                    }
                    _info = null;
                    vdResult = null;

                    //OPTIMIZE: 因为字段保存接口不支持传真，所以只能先读到所有字段再修改保存。
                    top.Contacts.getContactsInfoById(serialId, function(result) {
                        if (!result.success) {
                            onerror(result.msg, e);
                            return;
                        }

                        var info = result.contactsInfo;
                        info.BusinessFax = value;
                        info.OverWrite = "1";

                        top.Contacts.editContactDetails(info, function(_result) {
                            if (_result.success) {
                                onFaxFetch(value);
                                nextBox.close();
                            } else {
                                onerror(_result.msg, e);
                            }
                        });
                    });

                    e.cancel = true;
                }
            });
        }
    }

    function redirectSMS(receiver, params) {
        window.top.Links.show("sms", "&mobile=" + receiver + (params || ''));
    }

    function redirectMMS(receiver, params) {
        senNewMMS(receiver);
    }

    function redirectFax(receiver) {
        Tool.hideControlBar();
        window.top.Links.show("fax", "&to=" + receiver);

        top.Utils.waitForReady("top.frames['fax'].contentWindow.document.getElementById('tbRMobile').value='" + receiver + "'");
        top.addBehaviorExt({ actionId: 26014, thingId: 2, moduleId: 19 });
    }

    function singleMobileSend(serialId, onredirect, params) {
        fetchMobile(serialId, function(value){
            if (onredirect) onredirect(value, params);
            top.addBehaviorExt({ actionId: 26014, thingId: 10, moduleId: 19 });
        });
    }

    function singleFaxSend(serialId, onredirect) {
        fetchFax(serialId, function(value){
            if (onredirect) onredirect(value);
        });
    }

    //有三个来源，四种情况
    //1、选择联系人 > 发送菜单 > 发短/彩信  redirectSMS(param)
    //2、联系人页卡 > 发短信  sendSMS($domObj)
    //3、直接点击联系人的手机号 （未考虑） sendSMS(domObj)
    //4、最近/紧密联系人点发短/彩信 (分已保存/未保存)  sendSMS(serialId) / sendSMS({addrContent:"mobile/email",addrType:'E/M',addrName:"name"})

    window.sendSMS = function(obj, params){

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleMobileSend(serialId, redirectSMS, params);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleMobileSend(_serialId, redirectSMS, params);
            });
        }
    }

    window.sendMMS = function(obj) {

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleMobileSend(serialId, redirectMMS);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleMobileSend(_serialId, redirectMMS);
            });
        }
    }

    window.sendFax = function(obj) {

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleFaxSend(serialId, redirectFax);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleFaxSend(_serialId, redirectFax);
            });
        }
    }

})();
