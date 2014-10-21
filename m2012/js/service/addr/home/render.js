var Render = {

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