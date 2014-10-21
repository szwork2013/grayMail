/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.Contacts.View";

    var GroupsId = {
        //所有联系人
        All: -1,
        //未分组
        Ungroup: -2,
        //最近联系人
        Lastest: -3,
        //紧密联系人
        Close: -4,
        Search: -5
    };

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.Widget.Contacts.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {Object} options.model model对象，为组件提供数据支持
         *@param {String} options.template 组件的html代码
         *@param {Boolean} options.showSelfAddr 是否显示发给自己，默认是true
         *@param {Boolean} options.showCreateAddr 是否显示添加联系人，默认是true 
         *@param {Boolean} options.showAddGroup 是否显示添加整组的图标，默认是true 
         *@param {Boolean} options.showLastAndCloseContacts 是否显示最近紧密联系人，默认是true 
         *@param {String} options.maxCount 最大添加个数
         *@example
         new M2012.UI.Widget.Contacts.View({
             container:document.getElementById("addrContainer"),
             filter:"email"
         }).render().on("select",function(e){
             if(e.isGroup){
                 alert(e.value.length);
             }else{
                 alert(e.value);
             }
         });
         */
        initialize: function (options) {
            var This = this;
            this.filter = options.filter;
            this.selectMode = options.selectMode;
            this.showCountElFlag = options.comefrom == 'compose_addrinput' ? 'none' : '';
            //change by Aerojin 2014.06.09 过滤非本域用户
            this.model = new M2012.UI.Widget.Contacts.Model({
                filter: this.filter,
                colate: options.colate,
                selectMode: this.selectMode
            });
            var el = $D.getHTMLElement(options.container);
            el.innerHTML = this.template;
            if(options.width !== "auto") {
            	el.style.width = "191px";
            }
            this.setElement(el);
            this.model.dataReady(function () {
                This.render();
                clearTimeout(timer);
            });

            //3秒后显示重试按钮
            var timer = setTimeout(function () {
                This.showRetryDiv();
            }, 3000);

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        retryCount: 0, //用户点击重新加载联系人的次数
        MemberFirstSize: 10, //分组里首次显示最多几个联系人
        MemberPageSize: 500,//分组里每次显示最多几个联系人，点更多加载更多
        template: ['<div class="AddrEmptyTip ta_c loadingerror" style="height:280px;padding:80px 0 0 0">',
        '<div class="LoadingImage" style="padding-top:50px;"><img src="/m2012/images/global/searchloading.gif" /></div>',
            '<div class="bodyerror RetryDiv" style="display:none">',
 		        '<img src="../images/global/smile.png" width="73" height="72">',
 		        '<p>没加载出来，再试一次吧。</p>',
 		        '<a class="btnTb BtnRetry" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	        '</div>',
 		'</div>',
        '<div class="ContentDiv tabContent p_relative" style="display:none;">',
 	    '<div class="searchContact">',
 	      '<input type="text" class="searchContactText">',
 	      '<a hidefocus="1" href="javascript:;" class="searchContactBtn"><i class="i_c-search"></i></a>',
 	    '</div>',
        '<div class="searchEnd-empty SearchEmptyTip" style="display:none">',
            '<a href="javascript:" class="delmailTipsClose BtnCloseSearchEmptyTip"><i class="i_u_close"></i></a>',
            '<p class="gray">查找结果：</p>',
            '<p>没有符合条件的联系人</p>',
        '</div>',
 	    '<div class="searchEnd" style="display:none">',
 		    '<ul class="contactList">',
            '<li data-groupId="-5"><a hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表"><i class="i_plusj"></i><span>搜索结果</span><var></var></a>',
            '<ul class="pb_5">',
               //'<li><a href="javascript:void(0)">18688959302</a></li>',
             '</ul>',
            '</li>',
            '</ul>',
 	    '</div>',
         '<ul class="contactList GroupList">',
           
         '</ul>',
         '<div class="contactListNew">',
		    '<a bh="compose_addressbook_createcontacts" hidefocus="1" class="AddNewContacts" href="javascript:;">+ 新建联系人</a>',
		 '</div>',
        '</div>'].join(""),
        GroupItemTemplate: [
            '<li data-groupId="{groupId}">',
             '<a title="{clearGroupTitle}" href="javascript:;" style="display:{showClearGroup}" class="i_r_yq2 i_dels ClearGroup"></a>',
             '<a bh="compose_addressbook_addgroupclick" hidefocus="1" style="display:{showAddGroup}" title="添加整组" href="javascript:;" class="i_r_yq2 AddGroup"></a>',
             '<a bh="{behavior}" hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表">',
                 '<i class="i_plusj"></i>',
                 '<span>{groupName}</span>',
                 '<var style="display:{showCountEl}">({count})</var>',
                 '</a>',
             '<ul class="pb_5" style="display:none"></ul>',
           '</li>'].join(""),
        MemberItemTemplate: '<li style="display:{display}" class="ContactsItem" data-addr="{addr}" data-contactsId="{contactsId}"><a hidefocus="1" href="javascript:void(0)" title="{addrTitle}">{contactsName}</a></li>',
        //联系人容器dom
        GroupContainerPath: "ul.GroupList",
        events: {
            "click .GroupButton": "onGroupButtonClick",
            "click .LoadMoreMember": "onLoadMoreMemberClick",
            "click .ContactsItem": "onContactsItemClick",
            "click .searchContactBtn": "onClearSearchInput",
            "click .AddGroup": "onAddGroupClick",
            "click .SendToMySelf": "onSendToMySelfClick",
            "click .AddNewContacts": "onAddNewContactsClick",
            "click .BtnCloseSearchEmptyTip": "hideGroupEmptyTip",
            "click .BtnRetry": "onRetryClick",
            "click .ClearGroup": "onClearGroupClick"
        },
        /**构建dom函数*/
        render: function () {
            var options = this.options;

            this.clearSearchButton = this.$("a.searchContactBtn");

            this.$(".AddrEmptyTip").hide();

            this.renderGroupListView();

            this.initEvent();

            if (options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
            if (options.showCreateAddr === false) {
                this.$(".contactListNew").hide();
            }
            this.$("div.ContentDiv").show();
            this.render = function () {
                return this;
            }

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *加载联系组界面
         *@inner
         */
        renderGroupListView: function () {
            var groups = this.model.getGroupList();
            var htmlCode = ['<li class="SendToMySelf contactList_a"><a bh="compose_addressbook_sendself" hidefocus="1" href="javascript:void(0)">发给自己</a></li>'];
            var template = this.GroupItemTemplate;

            if (this.options.showLastAndCloseContacts !== false) {

                //最近联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Lastest,
                    groupName: "最近联系人",
                    clearGroupTitle:"清空最近联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getLastestContacts().length,
                    behavior: "compose_addressbook_lastcontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));

                //紧密联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Close,
                    groupName: "紧密联系人",
                    clearGroupTitle: "清空紧密联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getCloseContacts().length,
                    behavior: "compose_addressbook_closecontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));
            }
            //所有联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.All,
                groupName: "所有联系人",
                showCountEl: this.showCountElFlag,
                count: this.model.getContacts().length,
                behavior: "compose_addressbook_allcontacts",
                showAddGroup: "none",
                showClearGroup: "none"
            }));

            //未分组联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.Ungroup,
                groupName: "未分组",
                showCountEl: this.showCountElFlag,
                count: this.model.getUngroupContacts().length,
                behavior: "compose_addressbook_ungroup",
                showAddGroup: "none",
                showClearGroup: "none"
            }));
            if (this.options.showVIPGroup !== false) {
                //vip联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: this.model.getVIPGroupId(),
                    groupName: "VIP联系人",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getGroupMembers(this.model.getVIPGroupId()).length,
                    behavior: "compose_addressbook_vip",
                    showAddGroup: this.options.showAddGroup === false ? "none" : "",
                    showClearGroup: "none"
                }));
            }
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                var members = this.model.getGroupMembers(g.id).length;
                var showAddGroup = this.options.showAddGroup === false ? "none" : "";
                var h = null;

                //读信联系人特别处理上报
                if (g.name == "读信联系人") {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_readcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                else {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_customcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                htmlCode.push(h);
            }
            htmlCode = htmlCode.join("");
            this.$(this.GroupContainerPath)[0].innerHTML = htmlCode;

            if (this.options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
        },
        /**
         *初始化事件行为
         *@inner
         */
        initEvent: function () {
            var This = this;
            //切换展开组
            this.model.on("change:currentGroup", function (model, gid) {
                var oldGid = model.previous("currentGroup");
                if (oldGid != null) {
                    this.hideGroupMember(oldGid);
                }
                if (gid) {
                    this.showGroupMember(gid);
                }
            }, this);

            //最近紧密联系人记录清除后
            this.model.on("contactshistoryupdate", function () {
                This.updateView();
            });

            //监听搜索框输入
            var input = this.$("input")[0];
            M139.Timing.watchInputChange(input, function () {
                This.onSearchInputChange(input.value);
            });

            //选择模式下，选中的联系人左边列表要隐藏
            if (this.selectMode) {
                this.on("additem", function (e) {
                    var addr = [];
                    if (!e.isGroup) {
                        e.SerialId = e.serialId;
                        addr = [e];
                    } else {
                        addr = e.value;
                    }

                    if (This.filter) {
                        for (var i=0; i<addr.length; i++) {
                            if(addr[i].addr && addr[i].addr.length){
                                This.utilGetMemberElement(addr[i].addr).hide();
                            }else{
                                This.utilGetMemberElementById(addr[i].serialId).hide();
                            }
                        }
                    } else {
                        for (var i=0; i<addr.length; i++) {
                            This.utilGetMemberElementById(addr[i].serialId).hide();
                        }
                    }
                });
                this.on("removeitem", function (e) {
                    if (This.filter) {
                        if(e && e.addr.length){     
                            This.utilGetMemberElement(e.addr).show();
                        }else{
                            This.utilGetMemberElementById(e.serialId).hide();
                        }
                    } else {
                        This.utilGetMemberElementById(e.serialId).show();
                    }
                });
            }

            this.on("print", function () {
                this.model.set("currentGroup", GroupsId.Lastest);
            });

        },
        /**@inner*/
        showGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").show();
        },
        /**@inner*/
        hideGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").hide();
        },

        /**
         *显示重试按钮
         *@inner
        */
        showRetryDiv: function () {
            var This = this;
            This.$(".LoadingImage").hide();
            This.$(".RetryDiv").show();

            if (This.retryCount > 1) {
                var total = -1, arrlength = -1, glength = -1, datstr = "hasdata";
                var cmodel = This.model.contactsModel || {};
                if (cmodel.get) {
                    var data = cmodel.get("data");
                    if (_.isUndefined(data)) {
                        datstr = "nodata";
                    } else {
                        total = data.TotalRecord;
                        if ($.isArray(data.Contacts)) {
                            arrlength = data.Contacts.length;
                        }
                        if ($.isArray(data.Groups)) {
                            glength = data.Groups.length;
                        }
                    }
                }

                This.logger.error($TextUtils.format('addrlist retry fail|filter={0}|mode={1}|retry={2}|data={3}|isLoading={4}|total={5}|contacts={6}|groups={7}',
                    [This.filter, This.selectMode, This.retryCount, datstr, cmodel.isLoading, total, arrlength, glength]));
            }
        },

        /**@inner*/
        renderMemberView: function (gid, mode) {
            var container = this.utilGetMemberContainer(gid);
            var containerInit = container.attr("init") || 0;
            if (mode == "init" && container.attr("init") == 1) {
                return;
            }

            //显示组成员
            var htmlCode = [];
            var template = this.MemberItemTemplate;
            var contacts;
            if (gid == GroupsId.All) {
                contacts = this.model.getContacts();
            } else if (gid == GroupsId.Lastest) {
                contacts = this.model.getLastestContacts();
            } else if (gid == GroupsId.Close) {
                contacts = this.model.getCloseContacts();
            } else if (gid == GroupsId.Ungroup) {
                contacts = this.model.getUngroupContacts();
            } else if (gid == GroupsId.Search) {
                contacts = this.model.getSearchContacts();
            } else {
                contacts = this.model.getGroupMembers(gid);
            }

            if (gid == GroupsId.Search && contacts.length == 0) {
                //显示搜索结果为空的提示
                this.showGroupEmptyTip();
                this.switchGroupMode();
            } else {
                this.hideGroupEmptyTip();
            }


            //一共几个联系人
            var total = contacts.length;
            //当前已显示几个
            var showCount = container.find("li[data-addr]").length;
            //一次追加几个
            var pageSize = containerInit == 1 ? this.MemberPageSize : this.MemberFirstSize;

            //分页显示的，每次显示10个，点击更多每次新显示10
            for (var i = showCount, len = Math.min(showCount + pageSize, total) ; i < len; i++) {
                var c = contacts[i];
                var addr = c.addr || this.getAddr(c);//最近联系人直接有addr属性，联系人对象需要获取
                var addrText = M139.Text.Html.encode(addr);

                if (!this.filter){
                    addr = c.SerialId;
                }

                var isDisplay = !(this.selectMode && this.model.isSelectedItem(addr))

                htmlCode.push(M139.Text.format(template, {
                    contactsId: c.SerialId,
                    contactsName: M139.Text.Html.encode(c.name),
                    addr: addrText,
                    addrTitle: addrText,
                    display: isDisplay ? "" : "none"
                }));
            }
            //如果还没显示完
            if (showCount + pageSize < total) {
                htmlCode.push('<li class="LoadMoreMember" data-groupId="'
                    + gid + '"><a hidefocus="1" href="javascript:;">更多<span class="f_SimSun">↓</span></a></li>');
            }
            htmlCode = htmlCode.join("");
            container.append(htmlCode);
            container.attr("init", 1);//表示已经加载过一次数据了
        },
        /**@inner*/
        onLoadMoreMemberClick: function (e) {
            $(M139.Dom.findParent(e.currentTarget, "li")).hide();
            var gid = this.utilGetClickGroupId(e);
            this.renderMemberView(gid);
        },


        /**@inner*/
        onClearSearchInput: function () {
            top.BH('compose_addressbook_search');
            var txt = this.$("input:text");
            if (this.$(".searchContact").hasClass("searchContact-on")) {
                txt.val("");
            }
            this.hideGroupEmptyTip();
            txt.focus();           
        },

        /**
         *搜索框输入值变化
         *@inner
         */
        onSearchInputChange: function (value) {
            if (value == "") {
                this.switchGroupMode();
                this.$(".searchContact").removeClass("searchContact-on");
            } else {
                this.renderSearchView(value);
                this.$(".searchContact").addClass("searchContact-on");
                this.trigger('BH_onSearch');
            }
        },

        /**
         *从搜索视图返回正常视图
         *@inner*/
        switchGroupMode: function () {
            this.$(".searchEnd").hide();
            this.$(".GroupList").show();
        },

        /**@inner*/
        renderSearchView: function (keyword) {
            this.$(".GroupList").hide();
            this.$(".searchEnd").show();
            this.$(".searchEnd li ul").html("").attr("init", 0);
            this.model.set("keyword", keyword);
            this.model.set("currentGroup", null);//否则不会触发change:currentGroup
            this.model.set("currentGroup", GroupsId.Search);
        },
        /**@inner*/
        onGroupButtonClick: function (e) {
            var gid = this.utilGetClickGroupId(e);
            var currentGid = this.model.get("currentGroup");
            if (currentGid == gid) {
                this.model.set("currentGroup", null);
            } else {
                this.model.set("currentGroup", gid);
            }
        },

        /**
         *点击发给自己
         *@inner
        */
        onSendToMySelfClick: function () {
            var name = top.$User.getTrueName();
            if(this.filter == "email"){
                var addr = top.$User.getDefaultSender();
            }else if(this.filter == "mobile"){
                var addr = top.$User.getShortUid();
            }
            var sendText = this.model.getSendText(name,addr);
            var result = {
                value:sendText,
                name:name,
                addr:addr
            };
            if (this.selectMode) {
				if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else {
				    var ok = this.model.addSelectedItem(result);
				    ok && this.trigger("additem", result);
                }
            } else {
                this.trigger("select", result);
            }
        },


        /**@inner*/
        showGroupMember: function (gid) {
            this.renderMemberView(gid, "init");
            //显示成员容器
            this.utilGetMemberContainer(gid).show();
            //折叠+变-
            this.utilGetGroupElement(gid).find("a.GroupButton i").addClass("i_minus");
        },
        /**@inner*/
        hideGroupMember: function (gid) {
            //隐藏成员容器
            this.utilGetMemberContainer(gid).hide();
            //折叠-变+
            this.utilGetGroupElement(gid).find("a.GroupButton i").removeClass("i_minus");
        },

        /**
         *点击选择联系人
         *@inner
         */
        onContactsItemClick: function (clickEvent) {
            var cid = M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-contactsId");
            var c = this.model.getContactsById(cid);
            var sendText = this.model.getSendText(c.name, c.addr);
            var result = {
                value:sendText,
                name:c.name,
                addr: c.addr,
                serialId: c.SerialId
            };
            if (this.selectMode) {
                if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else if(this.options.isAddVip && top.Contacts.IsPersonalEmail(c.SerialId)){
						top.FF.alert("不支持添加自己为VIP联系人。");
				}else{
                    var ok = this.model.addSelectedItem(result);
                    ok && this.trigger("additem", result);
				}
            } else {
                this.trigger("select", result);
                //最近联系人
                if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -3) {
                    top.BH("compose_addressbook_lastitem");
                }
                //紧密联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -4) {
                    top.BH("compose_addressbook_closeitem");
                }
                //所有联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -1) {
                    top.BH("compose_addressbook_allitem");
                }
                //未分组
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -2) {
                    top.BH("compose_addressbook_noitem");
                }
                //vip联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getVIPGroupId()) {
                    top.BH("compose_addressbook_vipitem");
                }
                //读信联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getReadGroupId()) {
                    top.BH("compose_addressbook_readitem");
                }
                else {
                    BH("compose_addressbook_itemclick");
                }
            }
        },

        /**
         *点击添加整组
         *@inner
         */
        onAddGroupClick: function (e) {
            var item;            
            var gid = this.utilGetClickGroupId(e);
            if (gid > 0) {
                if (this.selectMode) {
                    var list = this.model.getGroupMembers(gid).concat();
					var vipList=[];

                    for (var i = 0; i < list.length; i++) {
                        var c = list[i];
						if (this.filter == "email") {
                            var sendText = c.getEmailSendText();
                        } else if (this.filter == "mobile") {
                            var sendText = c.getMobileSendText();
                        }  
                        item = {
                            value:sendText,
                            name:c.name,
                            addr: this.getAddr(c),
                            serialId: c.SerialId,
                            SerialId: c.SerialId
                        };
                        list[i] = item;
						if (this.model.selectedList.length >= this.options.maxCount) {
							this.trigger("additemmax");
                            break;
                        } else if(this.options.isAddVip){ //vip联系人不能重复被选中-添加整组排重
							var selected = this.model.selectedList;
							var hasSelevted = false;
							for(var j=0; j< selected.length;j++){
								if(item.serialId == selected[j].serialId ||top.Contacts.IsPersonalEmail(item.serialId)){
									hasSelevted = true;
									break;
								}
							}
							if(!hasSelevted){
								var ok = this.model.addSelectedItem(item);
								ok && vipList.push(item);
							}
                        } else {
                            var ok = this.model.addSelectedItem(item);
                            if (!ok) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    this.trigger("additem", {
                        isGroup: true,
                        group: gid,
                        value: !this.options.isAddVip? list:vipList
                    });
                } else {
                    this.trigger("select", {
                        isGroup: true,
                        group: gid,
                        value: this.model.getGroupMembers(gid, {
                            getSendText: true
                        })
                    });
                }
                this.utilGetMemberContainer(gid).find("li").hide();
            }

            this.trigger("BH_onAddGroup");//增加行为ID
        },

        /**
         *点击添加联系人
         *@inner
         */
        onAddNewContactsClick: function () {
            var This = this;
            var topWin = M139.PageApplication.getTopAppWindow();
            var addView = new topWin.M2012.UI.Dialog.ContactsEditor().render();
            addView.on("success", function (result) {
                This.trigger('addContact', result);
                This.onAddContacts();
                //上报添加联系人成功行为
                BH("compose_linkmansuc");
            });

            addView.on('addGroupSuccess', function(result){                
                This.trigger('addGroup', result);
            });

            this.trigger('BH_onAddNewContacts');
        },

        /**
         *添加联系人成功时触发
         */
        onAddContacts: function () {
            this.updateView();
        },

        /**
         *由于数据变化 重绘通讯录界面
         */
        updateView:function(){
            //清除缓存数据
            this.model.set("contacts", null);
            this.renderGroupListView();
            this.model.set("currentGroup", null);
        },

        /**
         *点击重试，重新加载通讯录数据
         */
        onRetryClick: function () {
            var This = this;
            This.retryCount++;

            this.$(".LoadingImage").show();
            this.$(".RetryDiv").hide();
            setTimeout(function () {
                This.showRetryDiv();
            }, 5000);
            this.model.reloadContactsData();
        },

        /**
         *点击清空最近、紧密联系人
         */
        onClearGroupClick: function (e) {
            if ($(e.target).parent().attr('data-groupid') == -3) {
                top.BH("compose_addressbook_lastcancel");
            }
            if ($(e.target).parent().attr('data-groupid') == -4) {
                top.BH("compose_addressbook_closecancel");
            }
            var gid = this.utilGetClickGroupId(e);
            if (gid == GroupsId.Lastest) {
                this.model.clearLastContacts();
            } else if (gid == GroupsId.Close) {
                this.model.clearCloseContacts();
            }
        },

        /**
         *todo move to model
         *@inner
         */
        getAddr: function (c) {
            var addr = "";
            if (this.filter == "email") {
                addr = c.getFirstEmail();
            } else if (this.filter == "mobile") {
                addr = c.getFirstMobile();
            } else if (this.filter == "fax") {
                addr = c.getFirstFax();
            } else {
                addr = c.SerialId;
            }
            return addr;
        },

        /**
         *todo move to model
         *添加已选的部分联系人（对话框选择模式下有用）
         */
        addSelectedItems: function (selContacts) {
            var filter = this.filter;
            for (var i = 0; i < selContacts.length; i++) {
                var c = selContacts[i];
                if (typeof c == "object") {
                    var ok = this.model.addSelectedItem(c);
                    ok && this.trigger("additem", c);
                } else {
                    var addr = "";
                    var name = "";
                    if (filter == "email") {
                        addr = M139.Text.Email.getEmail(c);
                        name = M139.Text.Email.getName(c);
                        value = M139.Text.Email.getSendText(name, addr);
                    } else if (filter == "mobile") {
                        addr = M139.Text.Mobile.getMobile(c);
                        name = M139.Text.Mobile.getName(c);
                        value = M139.Text.Mobile.getSendText(name, addr);
                    }
                    if (addr) {
                        var item = {
                            name: name,
                            addr: addr,
                            value: value
                        };
                        var ok = this.model.addSelectedItem(item);
                        ok && this.trigger("additem", item);
                    }
                }
            }


        },
        removeSelectedAddr: function (param) {
            var list = this.model.selectedList;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var tmpCopareItem ="";
				tmpCopareItem = !this.options.isAddVip? item.addr :item.serialId;

                if (!this.filter) {
                    tmpCopareItem = item.serialId;
                }


				if (tmpCopareItem == param) {
                    list.splice(i, 1);
                    this.trigger("removeitem", item);
                    return;
                }
            }

        },

        /**
         *选择模式下获得选中的成员
         */
        getSelectedItems:function(){
            if(this.selectMode){
                var result = this.model.selectedList.concat();
                return result;
            }else{
                return null;
            }
        },

        /**@inner*/
        utilGetClickGroupId: function (clickEvent) {
            return M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-groupId");
        },
        utilGetMemberElement: function (addr) {
            return this.$("li[data-addr='" + addr + "']");
        },

        /**@inner*/
        utilGetMemberElementById: function (serialId) {
            return this.$("li[data-contactsid='" + serialId + "']");
        },

        /**@inner*/
        utilGetGroupElement: function (gid) {
            return this.$("li[data-groupId='" + gid + "']");
        },
        /**@inner*/
        utilGetMemberContainer: function (gid) {
            return this.utilGetGroupElement(gid).find("ul");
        }

    }));
})(jQuery, _, M139);