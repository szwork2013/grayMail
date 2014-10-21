var View = {
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
