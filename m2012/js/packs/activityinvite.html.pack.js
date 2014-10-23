/**
 * @fileOverview 定义通讯录地址本组件Model对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.Widget.Contacts.Model";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.Model.prototype*/
    {
        /** 弹出菜单组件
         *@constructs M2012.UI.Widget.Contacts.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@param {String} options.filter 过滤的数据类型:email|mobile|fax
         *@param {Boolean} options.selectMode 如果是对话框选择模式，则增加一些功能
         *@example
         var model = new M2012.UI.Widget.Contacts.Model({
             filter:"email"
         });
         */
        initialize: function (options) {
            options = options || {};

            if (top.$App) {
                this.contactsModel = window.top.$App.getModel("contacts");
            } else {
                this.contactsModel = M2012.Contacts.getModel();
            }

            this.filter = options.filter;
            this.colate = options.colate; //change by Aerojin 2014.06.09 过滤非本域用户

            if (options.selectMode) {
                this.selectedList = [];
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,

        dataReady: function (callback) {
            var This = this;
            this.contactsModel.requireData(function () {
                This.contactsData = This.contactsModel.get("data");
                callback();
            });
        },

        /**
         *重构收敛了添加选中联系人的方法
         */
        addSelectedItem: function (item) {
            //无filter，默认按serialId进行对比判同，在通讯录分组选择框中使用
            var compare = _.isUndefined(this.filter) ? item.serialId : item.addr;

            if(this.isSelectedItem(compare)){
                return false;
            }else{
                this.selectedList.push(item);
                return true;
            }
        },
        /**
         *获得组列表
         */
        getGroupList: function () {
            return this.contactsModel.getGroupList();
        },
        /**
         *获得读信联系人组id added by tj
         */
        getReadGroupId: function () {
            var groupList = this.getGroupList();
            for (var i = 0; i < groupList.length; i++) {
                if (groupList[i].name == "读信联系人") {
                    return groupList[i].id;
                }
            }
        },
        /**
         *获得组联系人
         */
        getGroupMembers: function (gid,options) {
            options = options || {};
            //change by Aerojin 2014.06.09 过滤非本域用户
            var contacts =  this.contactsModel.getGroupMembers(gid, {
                filter: this.filter || this.colate,
                colate: this.colate
            });
            if(options.getSendText){
                for(var i=0,len=contacts.length;i<len;i++){
                    if(this.filter == "email"){
                        contacts[i] = contacts[i].getEmailSendText();
                    }else if(this.filter == "mobile"){
                        contacts[i] = contacts[i].getMobileSendText();
                    } else if (this.filter == "fax") {
                        contacts[i] = contacts[i].getFaxSendText();
                    }
                }
            }
            return contacts;
        },


        /**
         * 获得最近联系人。先按内容与SerialId查找到联系人，然后再按条件获得联系方式，注意尽量保持原始的AddrContent
         */
        getLastestContacts: function (data) {
            var contacts = data || this.contactsData.lastestContacts;
            var result = [], ct;
            if (this.filter == "fax") {
                return result;//传真没实现最近紧密联系人
            }
            var addrType = this.filter == "email" ? "E" : "M";
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                var addrcontent = c.AddrContent;

                if (!/\d{5,}/.test(c.SerialId)) {
                    if (c.AddrType == "E") {
                        ct = this.contactsModel.getContactsByEmail(c.AddrContent)[0];
                    } else if (c.AddrType == "M") {
                        ct = this.contactsModel.getContactsByMobile(c.AddrContent)[0];
                    }
                } else {
                    ct = this.contactsData.contactsMap[c.SerialId];
                }

                if (ct) {
                    if (this.filter === "email" && c.AddrType !== "E") {
                        //条件是电邮，但是是通过手机号查找到的联系人，则取出第一电邮替代通讯方式
                        addrcontent = ct.getFirstEmail();
                        if (!addrcontent) {
                            ct = false;
                        }
                    } else if (this.filter === "mobile" && c.AddrType !== "M") {
                        addrcontent = ct.getFirstMobile();
                        if (!addrcontent) {
                            ct = false;
                        }
                    }
                }

                if (ct) {
                    result.push({
                        addr: addrcontent,
                        name: ct.name,
                        SerialId: ct.SerialId
                    });
                } else if (c.AddrType == addrType) {
                    var rndId = this.createLastContactsId();
                    this.lastContactsMap[rndId] = {
                        addr: c.AddrContent,
                        name: c.AddrName,
                        SerialId: rndId
                    };
                    result.push(this.lastContactsMap[rndId]);
                }
            }
            return result;
        },

        /**
         *生成一个假的联系人id，为了兼容一些不存在于通讯录中的最近联系人
         */
        createLastContactsId:function(){
            var rnd = parseInt(Math.random() * 100000000);
            return -rnd;
        },

        lastContactsMap: {},

        /**
         *获得紧密联系人
         */
        getCloseContacts: function () {
            var contacts = this.contactsData.closeContacts;
            return this.getLastestContacts(contacts);
        },
        /**
         *获得未分组联系人
         */
        getUngroupContacts: function (allContacts) {
            var contactsMap = this.contactsData.contactsMap;
            var noGroup = this.contactsData.noGroup;
            var result = [];
            //change by Aerojin 2014.06.18 过滤非本域用户
            for (var i = 0, len = noGroup.length; i < len; i++) {
                var c = contactsMap[noGroup[i]];
                if (this.colate && c && c.getFirstEmail().indexOf(this.colate) > -1) {
                    result.push(c);
                } else if (!this.colate && c) {
                    result.push(c);
                }
            }
            return result;
        },
        /**搜索联系人*/
        getSearchContacts: function () {
            var result = this.contactsModel.search(this.get("keyword"), {
                contacts: this.getContacts()
            });
            return result;
        },
        /**获得联系人*/
        getContacts: function () {
            var contacts = this.get("contacts");
            if (!contacts) {
                var contacts = this.contactsData.contacts;
                if (this.filter || this.colate) {
                    contacts = this.contactsModel.filterContacts(contacts, { filter: this.filter || this.colate, colate: this.colate }); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
                this.set("contacts", contacts);
            }
            return contacts;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            return this.contactsModel.getGroupMembers(this.contactsModel.getVIPGroupId(), { filter: this.filter });
        },
        /**获得vip分组id*/
        getVIPGroupId: function () {
            return this.contactsModel.getVIPGroupId();
        },
        getContactsById: function (cid) {
            if (cid > 0) {
                var item = this.contactsModel.getContactsById(cid);
                if (item) {
                    var email = item.getFirstEmail();
                    return {
                        //this.filter=undefined时,返回邮箱,以解决编辑/新建组手机号码为空的用户无法加入到组.--可能存在BUG--
                        addr: this.filter == "email" ? email : (item.getFirstMobile() || email),
                        name: item.name,
                        SerialId: item.SerialId
                    };
                } else {
                    return null;
                }
            } else {
                return this.lastContactsMap[cid];
            }
        },
        isSelectedItem:function(addr){
            var list = this.selectedList;
            for(var i=0,len = list.length;i<len;i++){
                if(list[i].addr == addr || list[i].SerialId == addr){
                    return true;
                }
            }
            return false;
        },
        getSendText:function(name,addr){
            return this.contactsModel.getSendText(name,addr);
        },

        /**清空最近联系人记录*/
        clearLastContacts: function (isClose) {
            var This = this;
            //todo 这是老的代码移植过来
            var param = {
                type: isClose ? "close" : "last"
            };
            var Msg = {
                warn_delclose: "确认清空所有紧密联系人记录？",
                warn_dellast: "确认清空所有最近联系人记录？"
            };
            top.$Msg.confirm(Msg['warn_del' + param.type], function () {
                top.addBehavior("19_9561_11清空最近/紧密", isClose ? "2" : "1");
                top.Contacts.EmptyLastContactsInfo(param, function (result) {
                    if (result.success) {
                        /**
                         *@event#M2012.UI.Widget.Contacts.Model
                         */
                        This.trigger("contactshistoryupdate");
                    } else {
                        top.$Msg.alert(result.msg);
                    }
                });
            }, {
                icon:"warn"
            });
        },

        /**清空紧密联系人记录*/
        clearCloseContacts:function(){
            this.clearLastContacts(true);
        },

        /**
         *重新加载通讯录数据
         */
        reloadContactsData: function () {
            this.contactsModel.loadMainData();
        }
    }));

})(jQuery, _, M139);
﻿/**
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
﻿/*global Backbone: false */

/**
  * @fileOverview 定义通讯录数据实体类
  */

(function (jQuery,_,M139){
    var $ = jQuery;
    var inM2012 = false;
    /**通讯录数据实体
    *@constructs M2012.Contacts.ContactsInfo
    */
    function ContactsInfo(options) {
        for (var p in options) {
            this[p] = options[p] || "";
        }
        var emails = this.emails = [];
        var mobiles = this.mobiles = [];
        var faxes = this.faxes = [];
        if (!this.name) this.name = (this.AddrFirstName || "") + (this.AddrSecondName || "");
        this.lowerName = this.name.toLowerCase();
        if (this.FamilyEmail) emails.push(this.FamilyEmail);
        if (this.OtherEmail) emails.push(this.OtherEmail);
        if (this.BusinessEmail) emails.push(this.BusinessEmail);

        if (this.MobilePhone) mobiles.push(this.MobilePhone);
        if (this.OtherMobilePhone) mobiles.push(this.OtherMobilePhone);
        if (this.BusinessMobile) mobiles.push(this.BusinessMobile);

        if (this.OtherFax) faxes.push(this.OtherFax);
        if (this.FamilyFax) faxes.push(this.FamilyFax);
        if (this.BusinessFax) faxes.push(this.BusinessFax);
        if (!inM2012) {
            inM2012 = Boolean(top.$App);
        }
        if (inM2012) {
            this.fixPhoto();
        }
    }
    var defPhoto;
    var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];
    var baseUrl;
    ContactsInfo.prototype =
        /**
        *@lends M2012.Contacts.ContactsInfo.prototype
        */
    {
        getMobileSendText: function () {
            var n = this.getFirstMobile();
            n = n && n.replace(/\D/g, "");
            if (!n) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + n + ">";
        },
        getEmailSendText: function () {
            var e = this.getFirstEmail();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFaxSendText: function () {
            var e = this.getFirstFax();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFirstEmail: function () {
            if (this.emails && this.emails[0]) return this.emails[0];
            return "";
        },
        getFirstMobile: function () {
            if (this.mobiles && this.mobiles[0]) return this.mobiles[0];
            return "";
        },
        getFirstFax: function () {
            if (this.faxes && this.faxes[0]) return this.faxes[0];
            return "";
        },
        /**
         *模糊搜索
         */
        match: function (keyword) {
            return [
            this.name,
            this.BusinessEmail,
            this.BusinessFax,
            this.BusinessMobile,
            this.CPName,
            this.FamilyEmail,
            this.FamilyFax,
            this.FirstNameword,
            this.Jianpin,
            this.MobilePhone,
            this.OtherEmail,
            this.OtherFax,
            this.OtherMobilePhone,
            this.Quanpin,
            this.UserJob].join("").toLowerCase().indexOf(keyword) > -1;
        },
        fixPhoto: function () {
            if (this.ImagePath) return;
            if (!defPhoto) {
                defPhoto = $App.getResourcePath() + "/images/face.png";
				/*不再用g2的域名访问地址
                baseUrl = M139.Text.Url.makeUrl(getDomain("webmail") + "/addr/apiserver/httpimgload.ashx", {
                    sid: $App.getSid()
                });
				*/
				//
				function getPhotoUploadedAddr() {
						var tmpurl = location.host;
						var url2 = "";
						if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
							url2 = "http://image0.139cm.com";
						} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
							url2 = "http://images.139cm.com";
						} else if (tmpurl.indexOf("10086ts") > -1) {
							url2 = "http://g2.mail.10086ts.cn";
						}else if(tmpurl.indexOf("10086rd") > -1){
							url2 = "http://static.rd139cm.com";
						}
						return url2 ;
				}
				baseUrl = getPhotoUploadedAddr()
            }
            if (this.ImageUrl) {
                if (this.ImageUrl.indexOf("http://") == 0) {
                    return;
                }
                this.ImagePath = this.ImageUrl;
            //  var path = this.ImagePath.toLowerCase(); 不能转大小写
				var path = this.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    this.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
					this.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                this.ImageUrl = defPhoto;
                this.ImagePath = "/upload/photo/nopic.jpg";
            }
        }
    }
    M139.namespace("M2012.Contacts.ContactsInfo", ContactsInfo);



})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录数据管理模块
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var isFirstLoadQueryUserInfo = true;
    M139.namespace("M2012.Contacts.Model", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.prototype*/
    {

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model
        */
        initialize: function (options) {
            this.initEvents();
        },

        /**
         *@inner
         */
        getUserNumber: function () {
            return top.$User.getUid();
        },

        /**
         *加载通讯录数据
         */
        loadMainData: function (options, callback) {
            options = options || {};
            var This = this;
            this.isLoading = true;

            //options.testUrl = "/m2012/js/test/html/contactsData.js";//用测试数据
            if (options.testUrl) {
                //测试数据
                $.get(options.testUrl, function (responseText) {
                    This.onMainDataLoad(M139.JSON.tryEval(responseText), callback);
                });
            } else {
                var requestData = {
                    GetUserAddrJsonData: {
                        //UserNumber: this.getUserNumber()
                    }
                };
                M2012.Contacts.API.call("GetUserAddrJsonData", requestData,
                    function (e) {
                        This.isLoading = false;
                        if (e) {
                            if (e.responseData) {
                                if (e.responseData.ResultCode == "0") {
                                    This.onMainDataLoad(e.responseData, callback);
                                } else if (e.responseData.ResultCode == "216") {
                                    $App.trigger("change:sessionOut", {}, true);
                                } else {
                                    M139.Logger.getDefaultLogger().error('addrsvr response error', e.responseData);
                                }
                            } else {
                                M139.Logger.getDefaultLogger().error('addrsvr response invalid', e.responseText);
                            }
                        } else {
                            M139.Logger.getDefaultLogger().error('addrsvr response empty');
                        }
                    }
                );
            }
        },


        loadQueryUserInfo: function (callback) {
            if (SiteConfig.m2012NodeServerRelease && $App.isShowWelcomePage() && isFirstLoadQueryUserInfo) {
                //第一次加载读欢迎页内联json
                var data = getWelcomeInlinedJSON();
                if (data) {
                    setTimeout(function () {
                        inlinedCallback(data, true);
                    }, 0);
                } else {
                    $App.on("welcome_QueryUserInfo_load", function (data) {
                        inlinedCallback(data, true);
                    });
                }
            } else {
                var client = new M139.ExchangeHttpClient({
                    name: "ContactsLoadMainDataHttpClient",
                    responseDataType: "JSON2Object"
                });
                client.on("error", function(e) {
                    if (options && _.isFunction(options.error)) {
                        options.error(e);
                    }
                });
                var reqData = "<QueryUserInfo><UserNumber>" + $User.getUid() + "</UserNumber></QueryUserInfo>";
                client.request(
                {
                    method: "post",
                    url: "/addrsvr/QueryUserInfo?sid=" + $App.query.sid + "&formattype=json",
                    data: reqData
                }, callback);
            }
            isFirstLoadQueryUserInfo = false;
            function inlinedCallback(data, todoClone) {//TODO Clone
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
                    json = document.getElementById("welcome").contentWindow.inlinedQueryUserInfoJSON;
                } catch (e) { }
                return json;
            }
        },

        //获取个人资料
        getUserInfo: function (options, callback) {
            var self = this;            
            if (!top.$User) {
                return;
            }
            
            options = options || {};
            
            //options.refresh true  每次都刷新数据
            if(self.UserInfoData && !options.refresh){
                if (callback && typeof (callback) == "function") {
                    try {
                        callback(self.UserInfoData);
                        return;
                    } catch (ex) {}
                }
            }

            self.getUserInfoWaiting = true;
            this.loadQueryUserInfo(
                function (e) {
                    if (e && e.responseData) {
                        var code = e.responseData.ResultCode;
                        var data = {
                            "code": "S_FALSE", //这是取缓存验证用户失败时默认的返回code
                            "ResultCode": code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }
                            data = {
                                "code": "S_OK",
                                "var": self.userInfoTranslate(e.responseData["UserInfo"][0])
                            };
                        }
                        self.UserInfoData = data;
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                    self.getUserInfoWaiting = false;
                }
            );
        },
        contactRequest:function(apiName,options,callback){
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });
            if (!options) { options = {}; }
            options.UserNumber = top.$User.getUid();
            var reqData = {};
            reqData[apiName]= options

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/"+apiName+"?sid=" + top.$App.query.sid + "&formattype=json",
                    data: reqData
                },
                function (e) {
                    if (callback) {callback(e); }
                }
            );
        },
        //修改个人资料
        modifyUserInfo: function (userInfo, callback) {
			var self = this;
            this.contactRequest("ModUserInfo", userInfo, function (e) {
				self.UserInfoData = null;
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });
        },
        modifyGroup:function(options,callback){
            //<EditGroupList><UserNumber>8613590330157</UserNumber><GroupId>1171021884</GroupId><SerialId>1025214752</SerialId><GroupType>1</GroupType></EditGroupList>
            this.contactRequest("EditGroupList", options, function (e) {
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });

        },
        userInfoTranslate: function (UserInfo) {
            var map = {
                "a": "UserType",
                "b": "SourceType",
                "c": "AddrFirstName",
                "d": "AddrSecondName",
                "e": "AddrNickName",
                "f": "UserSex",
                "g": "CountryCode",
                "h": "ProvCode",
                "i": "AreaCode",
                "j": "CityCode",
                "k": "StreetCode",
                "l": "ZipCode",
                "m": "HomeAddress",
                "n": "MobilePhoneType",
                "o": "BirDay",
                "p": "MobilePhone",
                "q": "BusinessMobile",
                "r": "BusinessPhone",
                "s": "FamilyPhone",
                "t": "BusinessFax",
                "u": "FamilyFax",
                "v": "OtherPhone",
                "w": "OtherMobilePhone",
                "x": "OtherFax",
                "y": "FamilyEmail",
                "z": "BusinessEmail",
                "c2": "OtherEmail",
                "c3": "PersonalWeb",
                "c4": "CompanyWeb",
                "c5": "OtherWeb",
                "c6": "OICQ",
                "c7": "MSN",
                "c8": "OtherIm",
                "c9": "CPCountryCode",
                "d0": "CPProvCode",
                "d1": "CPAreaCode",
                "a0": "CPCityCode",
                "a1": "CPStreetCode",
                "a2": "CPZipCode",
                "a3": "CPAddress",
                "a4": "CPName",
                "a5": "CPDepartName",
                "a6": "Memo",
                "a7": "ContactCount",
                "a8": "ContactType",
                "a9": "ContactFlag",
                "b0": "SynFlag",
                "b1": "SynId",
                "b2": "RecordSeq",
                "b3": "FirstNameword",
                "b4": "CountMsg",
                "b5": "StartCode",
                "b6": "BloodCode",
                "b7": "StateCode",
                "b8": "ImageUrl",
                "b9": "SchoolName",
                "c0": "BokeUrl",
                "c1": "UserJob",
                "e1": "FamilyPhoneBrand",
                "e2": "BusinessPhoneBrand",
                "e3": "OtherPhoneBrand",
                "e4": "FamilyPhoneType",
                "e5": "BusinessPhoneType",
                "e6": "OtherPhoneType",
                "e7": "EduLevel",
                "e8": "Marriage",
                "e9": "NetAge",
                "e0": "Profession",
                "f1": "Income",
                "f2": "Interest",
                "f3": "MoConsume",
                "f4": "ExpMode",
                "f5": "ExpTime",
                "f6": "ContactMode",
                "f7": "Purpose",
                "f8": "Brief",
                "f9": "FavoEmail",
                "f0": "FavoBook",
                "g1": "FavoMusic",
                "g2": "FavoMovie",
                "g3": "FavoTv",
                "g4": "FavoSport",
                "g5": "FavoGame",
                "g6": "FavoPeople",
                "g7": "FavoWord",
                "g8": "Character",
                "g9": "MakeFriend",
                "ui": "UserInfo",
                "un": "UserNumber",
                "sd": "SerialId",
                "gd": "GroupId",
                "gp": "Group",
                "gi": "GroupInfo",
                "ct": "Contacts",
                "ci": "ContactsInfo",
                "gl": "GroupList",
                "li": "GroupListInfo",
                "tr": "TotalRecord",
                "rc": "ResultCode",
                "rm": "ResultMsg",
                "gn": "GroupName",
                "cn": "CntNum",
                "ri": "RepeatInfo",
                "lct": "LastContacts",
                "lctd": "LastContactsDetail",
                "lci": "LastContactsInfo",
                "cct": "CloseContacts",
                "cci": "CloseContactsInfo",
                "an": "AddrName",
                "at": "AddrType",
                "ac": "AddrContent",
                "us": "UserSerialId",
                "ai": "AddrId",
                "lid": "LastId",
                "ate": "AddrTitle",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "cf": "ComeFrom",
                "cte": "CreateTime",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "Bct": "BirthdayContacts",
                "bci": "BirthdayContactInfo"
            }
            var result = {};
            for (elem in UserInfo) {
                if (map[elem]) {
                    result[map[elem]] = UserInfo[elem];
                }
            }
            return result;
        },
        //获取隐私设置
        getPrivateSettings: function (callback) {
            if (!window.$User) {
                return;
            }

            var self = this;
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                responseDataType: "JSON2Object"
            });

            var reqData = "<GetPrivacySettings><UserNumber>" + $User.getUid() + "</UserNumber></GetPrivacySettings>";

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/GetPrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {

                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var code = respData.ResultCode;
                        var data = {
                            "code": "S_FALSE" //这是取缓存验证用户失败时默认的返回code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }

                            data = {
                                "code": "S_OK",
                                "var": {
                                    "addMeRule": respData.WhoAddMeSetting,
                                    "UserInfoSetting": respData.UserInfoSetting //这个是一个对象
                                }
                            };
                        }
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                }
            );
        },

        //更新隐私设置
        //注意：经测试，如果UserInfoSetting未传递所有值，则未传递的值默认设置为“仅好友可见”，值为0
        //建议暂不使用此接口设置数据
        /*
        options={
              UserNumber:8613800138000, //此字段可忽略，会自动添加
              WhoAddMeSetting:0,
              UserInfoSetting:{
                AddrFirstName:0,
                UserSex:0,
                BirDay:0,
                ImageUrl:0,
                FamilyEmail:0,
                MobilePhone:0,
                FamilyPhone:0,
                OtherIm:0,
                HomeAddress:0,
                CPName:0,
                UserJob:0,
                BusinessEmail:0,
                BusinessMobile:0,
                BusinessPhone:0,
                CPAddress:0,
                CPZipCode:0
              }
            }
        */
        updatePrivateSettings: function (options, callback) {
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });

            var UserNumber = $User.getUid();
            var reqData = { "UserNumber": UserNumber }; //默认加上号码
            reqData = { "SavePrivacySettings": $.extend(reqData, options) };

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/SavePrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {
                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var result = {
                            "code": (respData.ResultCode == "0" ? "S_OK" : respData.ResultCode) || "FS_UNKNOWN",
                            "var": {
                                "msg": respData.ResultMsg || ""
                            }
                        };

                        if (callback) {
                            callback(result);
                        }
                    }
                }
            );
        },
        /**
         *获取通讯录数据
         */
        requireData: function (callback) {
            var data = this.get("data");
            if (data) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (!this.isLoading) {
                    this.loadMainData();
                }
                this.on("maindataload", function (data) {
                    this.off("maindataload", arguments.callee);
                    if (callback) {
                        setTimeout(function () {
                            callback(data);
                        }, 0);
                    }
                });
            }
        },

        /**通讯是否已加载*/
        isLoaded: function () {
            return !!this.get("data");
        },

        /**
         *通讯录数据加载完成后处理数据
         *@inner
         */
        onMainDataLoad: function (json, callback) {
            json.Groups = json.Group || json.Groups;

            //后台不输出数组的时候容错
            if (!json.LastContacts) json.LastContacts = [];
            if (!json.CloseContacts) json.CloseContacts = [];
            if (!json.BirthdayContacts) json.BirthdayContacts = [];
            if (!json.Contacts) json.Contacts = [];
            if (!json.Groups) json.Groups = [];
            if (!json.GroupMember) json.GroupMember = {};
            if (!json.NoGroup) json.NoGroup = [];

            json.TotalRecord = parseInt(json.TotalRecord);
            json.TotalRecordGroup = parseInt(json.TotalRecordGroup);
            json.TotalRecordRelation = parseInt(json.TotalRecordRelation);
            json.userSerialId = json.UserSerialId;

            var exports = {
                TotalRecord: json.TotalRecord,
                TotalRecordGroup: json.TotalRecordGroup,
                TotalRecordRelation: json.TotalRecordRelation,
                noGroup: json.NoGroup
            };

            //分组
            this.createGroupData({
                data: json,
                exports: exports
            });

            //联系人
            this.createContactsData({
                data: json,
                exports: exports
            });

            //组关系
            this.createGroupMemberData({
                data: json,
                exports: exports
            });
            //处理最近、紧密联系人
            this.createLastAndCloseContactsData({
                data: json,
                exports: exports
            });

            //处理生日联系人
            this.createBirthdayContactsData({
                data: json,
                exports: exports
            });
            
            //处理VIP联系人
            this.createVIPContactsData({
                data: json,
                exports: exports
            });
            
            //处理用户个人资料  QueryUserInfo合并至GetUserAddrJsonData接口输出
            if(json["UserInfo"] && json["UserInfo"][0]){
                this.UserInfoData = {
                    "code": "S_OK",
                    "var": this.userInfoTranslate(json["UserInfo"][0])
                };
            }

            this.set("data", exports);
            this.trigger("maindataload", exports);
            if (callback) callback(exports);
        },

        /**
         *加载通讯录主干数据后处理分组数据
         *@inner
         */
        createGroupData: function (options) {
            if (options.append) {
                //添加新组后更新缓存
                var data = this.get("data");
                var groups = data.groups;
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                var newGroup = {
                    GroupId: options.append.groupId,
                    id: options.append.groupId,
                    GroupName: options.append.groupName,
                    name: options.append.groupName,
                    CntNum: 0,
                    count: 0
                };
                groups.push(newGroup);
                groupsMap[newGroup.id] = newGroup;
                groupMember[newGroup.id] = [];
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataGroups = data.Groups;
                var groups = new Array(dataGroups.length);
                var groupsMap = {};
                for (var i = 0, len = dataGroups.length; i < len; i++) {
                    var g = dataGroups[i];
                    groupsMap[g.gd] = groups[i] = {
                        GroupId: g.gd,
                        id: g.gd,
                        GroupName: g.gn,
                        name: g.gn,
                        CntNum: g.cn,
                        count: g.cn
                    };
                }
                exports.groups = groups;
                exports.groupsMap = groupsMap;
            }
        },

        /**
         *加载通讯录主干数据后处理联系人数据
         *@inner
         */
        createContactsData: function (options) {
            if (options.remove) {
                var data = this.get("data");
                var serialId = options.serialId;
                delete data.contactsMap[serialId];
                delete data.contactsIndexMap[serialId];
                var contacts = data.contacts;
                for (var i = contacts.length - 1; i >= 0; i--) {
                    if (contacts[i].SerialId == serialId) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                data.emailHash = null;//清除字段缓存
            } else if (options.append) {
                var data = this.get("data");
                var newContacts = options.append;
                var contacts = data.contacts;
                var contactsMap = data.contactsMap;
                var contactsIndexMap = data.contactsIndexMap;
                var nogroup = data.noGroup;
                for (var i = 0; i < newContacts.length; i++) {
                    var c = newContacts[i];
                    c.Quanpin = c.FullNameword || "";
                    c.Jianpin = c.FirstWord || "";

                    var info = new M2012.Contacts.ContactsInfo(c);
                    contacts[contacts.length] = info;
                    contactsMap[info.SerialId] = info;
                    contactsIndexMap[info.SerialId] = contacts.length;
                }
                data.emailHash = null;//清除字段缓存
                data.TotalRecord += newContacts.length;
            }else{
                var exports = options.exports;
                var data = options.data;
                var dataContacts = data.Contacts

                var contacts = new Array(dataContacts.length);
                var contactsMap = {};
                var contactsIndexMap = {};

                var csClass = M2012.Contacts.ContactsInfo;
                for (var i = 0, len = dataContacts.length; i < len; i++) {
                    var c = dataContacts[i];
                    var info = new csClass({
                        SerialId: c.sd,
                        AddrFirstName: c.c,
                        AddrSecondName: c.d,
                        MobilePhone: c.p,
                        BusinessMobile: c.q,
                        OtherMobilePhone: c.w,
                        FamilyEmail: (c.y || "").toLowerCase(),
                        BusinessEmail: (c.z || "").toLowerCase(),
                        OtherEmail: (c.c2 || "").toLowerCase(),
                        FirstNameword: (c.b3 || "").toLowerCase(),
                        FamilyFax: c.u,
                        BusinessFax: c.t,
                        OtherFax: c.x,
                        ImageUrl: c.b8,
                        Quanpin: (c.d2 || "").toLowerCase(),
                        Jianpin: (c.d3 || "").toLowerCase(),
                        CPName: c.a4,
                        UserJob: c.c1
                    });
                    contacts[i] = info;
                    contactsMap[c.sd] = info;
                    contactsIndexMap[c.sd] = i;
                }
                exports.contacts = contacts;
                exports.contactsMap = contactsMap;
                exports.contactsIndexMap = contactsIndexMap;
            }

            //刷新通讯录标签
            var addrtab = $App.getTabByName("addr");
            if (addrtab) {
                addrtab.isRendered = false;
            }
        },

        updateContactsData: function (options) {
            var data = this.get("data");
            var contactinfos = options.modification;
            var map = data.map || [];
            var contacts = data.contacts;
            var contactsMap = data.contactsMap;
            var groupsMap = data.groupsMap;

            var j, k, flag, groups = [];

            for (k = contactinfos.length; k--; ) {

                var info = new M2012.Contacts.ContactsInfo(contactinfos[k]);
                contactsMap[info.SerialId] = info;

                for (j = contacts.length; j--; ) {
                    if (contacts[j].SerialId == info.SerialId) {
                        contacts[j] = info;
                        break;
                    }
                }

                //删除现有map后重建关系
                groups.length = 0;
                for (j = map.length; j--; ) {
                    if (map[j].SerialId == info.SerialId) {
                        groups.push(map[j].GroupId);
                        map.splice(j, 1);
                    }
                }

                //先删除groups、groupsMap 的联系人数，注意groups是旧的组关系
                for (j = groups.length; j--; ) {
                    flag = groupsMap[groups[j]];
                    flag.count = parseInt(flag.count) - 1;
                    flag.CntNum = parseInt(flag.CntNum) - 1;
                }

                //重建map
                groups = info.GroupId.split(','); //groups有""的元素
                for (j = groups.length; j--; ) {
                    if (groups[j]) {
                        map.push({ SerialId: info.SerialId, GroupId: groups[j] });
                        flag = groupsMap[groups[j]];
                        flag.count = parseInt(flag.count) + 1;
                        flag.CntNum = parseInt(flag.CntNum) + 1;
                    }
                }

                //更新未分组
                for (j = data.noGroup.length; j--; ) {
                    if (data.noGroup[j] == info.SerialId) {
                        data.noGroup.splice(j, 1);
                        break;
                    }
                }

                if (groups.length == 0) {
                    data.noGroup.push(String(info.SerialId));
                    if (data.groupedContactsMap) {
                        delete data.groupedContactsMap[info.SerialId];
                    }
                } else {
                    if (data.groupedContactsMap) {
                        data.groupedContactsMap[info.SerialId] = 1;
                    }
                }

            }
            if(data.emailHash){//还要更新二级hash缓存
                if(info.emails && info.emails.length>0){
                    data.emailHash[info.emails[0]]=info;
                 }
            }
            groups.length = 0;
            groups = null;
        },


        /**
         *加载通讯录主干数据后处理联系人组关系数据
         *@inner
         */
        createGroupMemberData: function (options) {
            if (options.append) {
                //添加组关系缓存
                var appendItem = options.append;//格式为{SerialId:"",groups:[]}
                var groups = appendItem.GroupId;
                
                groups = groups.length == 0 ? [] : groups;
                groups = _.isString(groups) ? groups.split(",") : groups;

                var data = this.get("data");
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                if (groups.length == 0) {
                    //如果没分组，联系人id添加到noGroup
                    data.noGroup.push(appendItem.SerialId);
                } else {
                    _.each(groups, function (gid) {
                        var gm = groupMember[gid];
                        if (_.isUndefined(gm)) {
                            data.groupMember[gid] = [];
                            gm = data.groupMember[gid];
                        }

                        gm.push(appendItem.SerialId);
                        groupsMap[gid].CntNum = gm.length;
                    });
                }
            } else {
                var data = options.data;
                var exports = options.exports;
                var contactsMap = exports.contactsMap;
                var groupsMap = exports.groupsMap;
                var groupMember = data.GroupMember;
                for (var gid in groupMember) {
                    var group = groupsMap[gid];
                    if (!group) {
                        if(/^\d+$/.test(gid)){
                            delete groupsMap[gid];//删除组脏数据
                        }
                    } else {
                        var members = groupMember[gid];
                        for (var i = 0; i < members.length; i++) {
                            if (!contactsMap[members[i]]) {
                                members.splice(i, 1);//删除联系人脏数据
                                i--;
                            }
                        }
                        group.CntNum = members.length;
                    }
                }
                exports.groupMember = groupMember;
            }
        },

        /**
         *加载通讯录主干数据后处理最近联系人和紧密联系人数据
         *@inner
         */
        createLastAndCloseContactsData: function (options) {
            if (options.append) {
                var data = this.get("data");

                var lastestContacts = data.lastestContacts;
                if (!$.isArray(lastestContacts)) {
                    return;
                }

                var items = options.append || [];
                for (var i = 0; i < items.length; i++) {
                    var l = items[i];
                    lastestContacts.unshift(l);
                }
                var map = {};
                //排除重复
                for (var i = 0; i < lastestContacts.length; i++) {
                    var l = lastestContacts[i];
                    if (map[l.AddrContent]) {
                        lastestContacts.splice(i, 1);
                        i--;
                    } else {
                        map[l.AddrContent] = 1;
                    }
                }
                if (lastestContacts.length > 50) {
                    lastestContacts.length = 50;
                }
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataLastContacts = data.LastContacts;
                var dataCloseContacts = data.CloseContacts;
                var lastestContacts = [];
                var closeContacts = [];


                for (var i = 0, len = dataLastContacts.length; i < len; i++) {
                    var l = dataLastContacts[i];
                    if (typeof l.ac == "object") continue;//不懂？
                    lastestContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }

                for (var i = 0, len = dataCloseContacts.length; i < len; i++) {
                    var l = dataCloseContacts[i];
                    if (typeof l.ac == "object") continue;
                    closeContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }
                exports.lastestContacts = lastestContacts;
                exports.closeContacts = closeContacts;
            }
        },

        /**
         *加载通讯录主干数据后处理过生日的联系人数据
         *@inner
         */
        createBirthdayContactsData: function (options) {
            var exports = options.exports;
            var data = options.data;
            var dataBirContacts = data.BirthdayContacts;
            var birthdayContacts = new Array(dataBirContacts.length);
            for (var i = dataBirContacts.length - 1; i >= 0; i--) {
                var k = dataBirContacts[i];
                birthdayContacts[i] = {
                    SerialId: k.sd,
                    AddrName: k.an,
                    MobilePhone: k.p,
                    FamilyEmail: k.y,
                    BusinessEmail: k.z,
                    OtherEmail: k.c2,
                    BirDay: k.o
                };
            };
            exports.birthdayContacts = birthdayContacts;
        },

        /**
         *处理vip联系人数据
         *@inner
         */
        createVIPContactsData: function (options) {
            //"Vip":[{"vipg":"1158807544","vipc":"188722633,998324356","vipn":"2"}]
            var data = options.data;
            var exports = options.exports;
            var vipData = data.Vip && data.Vip[0];
            var vip = {};
            if (vipData) {
                try{
                    vip.groupId = vipData.vipg;
                    vip.contacts = vipData.vipc ? vipData.vipc.split(",") : [];
                } catch (e) {
                    //todo
                }
            }
            exports.vip = vip;
        },

        /**
         *根据联系人id获得对象
         *@param {String} cid 联系人id (SerialId)
         *@returns {M2012.Contacts.ContactsInfo} 返回联系人对象
         */
        getContactsById: function (cid) {
            return this.get("data").contactsMap[cid] || null;
        },
        /**
         *根据联系人id获取当前联系人的所有组
         *@param {String} cid 联系人id (SerialId)
         *@returns [] 返回联系人组
         */
        getContactsGroupById: function(cid){
            var groups = [];
            var member = this.get("data").groupMember;
            for(var key in member){
                if(member[key] && member[key].length > 0){
                    if(member[key].join(',').indexOf(cid) > -1){
                        groups.push(key);
                    }
                }
            }

            return groups;
        },
        /**
         *根据组id获得对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupById: function (gid) {
            return this.get("data").groupsMap[gid] || null;
        },

        /**
         *根据组名获得组对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupByName: function (groupName) {
            var groups = this.getGroupList();
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                if (g.name === groupName) {
                    return g;
                }
            }
            return null;
        },


        /**
         *获得联系人的分组id列表
         *@param {String} serialId 联系人id
         *@returns {Object} 返回组对象
         */
        getContactsGroupId: function (serialId) {
            var groupMember = this.get("data").groupMember;
            var groups = [];
            for (var gid in groupMember) {
                var members = groupMember[gid];
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i] === serialId) {
                        groups.push(gid);
                        break;
                    }
                }
            }
            return groups;
        },

        /**
         *返回一个联系组的克隆列表
         *@returns {Array} 返回数组
         */
        getGroupList: function () {
            var groups = this.get("data");
            if (groups) {
                groups = groups.groups;
            }

            if (groups && _.isFunction(groups.concat)) {
                groups = groups.concat();
            } else {
                groups = [];
            }

            return groups;
        },
        /**
         *返回一个分组共有多少联系人，数据接口输出的有可能不准确，可纠正
         *@param {String} gid 组id (groupId)
         *@returns {Number} 返回组联系人个数
         */
        getGroupMembersLength: function (gid) {
            var group = this.getGroupById(gid);
            if (!group) {
                throw "M2012.Contacts.Model.getGroupContactsLength:不存在联系人分组gid=" + gid;
            }
            return group.CntNum;
        },
        /**
         *返回一个联系组的所有联系人id
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[seriaId,seriaId,seriaId]
         */
        getGroupMembersId: function (gid, options) {
            var result = this.getGroupMembers(gid, options);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = result[i].SerialId;
            }
            return result;
        },
        /**
         *返回一个联系组的所有联系人列表
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        getGroupMembers: function (gid, options) {
            options = options || {};
            var filter = options.filter;                        
            var cData = this.get("data");
            var contactsMap = cData.contactsMap;
            var groupMember = cData.groupMember;
            var result = [];
            if (gid == this.getVIPGroupId()) {
                result = this.getVIPContacts();
            } else {
                var gm = groupMember[gid];
                if (gm) {
                    for (var i = 0, len = gm.length; i < len; i++) {
                        var cid = gm[i];
                        var c = contactsMap[cid];
                        if (c) {
                            result.push(c);
                        }
                    }
                }
            }
            if (options && options.filter) {
                result = this.filterContacts(result, { filter: options.filter, colate: options.colate });
            }
            return result;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            var data = this.get("data");
            var result = [];
            var vip = data && data.vip;
            var contactsMap = data && data.contactsMap;
            if (vip && vip.contacts) {
                var contacts = vip.contacts;
                for (var i = 0; i < contacts.length; i++) {
                    var c = contacts[i];
                    var item = contactsMap[c];
                    if (item) {//vip联系人有可能被删除了
                        result.push(item);
                    }
                }
            }
            return result;
        },
        /**
         *获得vip分组id
         */
        getVIPGroupId: function () {
            var id = "";
            var data = this.get("data");
            if (data && data.vip) {
                id = data.vip.groupId;
            }
            return id;
        },

        /**
         *筛选联系人
         *@param {Array} contacts 要筛选的联系人
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选属性：email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        filterContacts: function (contacts, options) {
            var filter = options.filter;
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (filter == "email" && c.getFirstEmail()) {
                    result.push(c);
                } else if (filter == "mobile" && c.getFirstMobile()) {
                    result.push(c);
                } else if (filter == "fax" && c.getFirstFax()) {
                    result.push(c);
                } else if (options.colate && c.getFirstEmail().indexOf(filter) > -1) {
                    result.push(c); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
            }
            return result;
        },

        /**
         *绑定一些事件
         *@inner
         */
        initEvents:function(){
            var self = this;
            var E = "dataForMatch_email", M = "dataForMatch_mobile", F = "dataForMatch_fax";

            //清除用来做索引的缓存
            self.on("update", function (e) {
                if (e.type == "AddSendContacts" || e.type == "AddContacts" || e.type == "EditContacts") {
                    if (self.has(E)) {
                        self.unset(E);
                    }

                    if (self.has(M)) {
                        self.unset(M);
                    }

                    if (self.has(F)) {
                        self.unset(F);
                    }
                }
            });

            //重新加载联系人数据时，也清理做索引的缓存
            self.on("maindataload", function () {
                if (self.has(E)) {
                    self.unset(E);
                }

                if (self.has(M)) {
                    self.unset(M);
                }

                if (self.has(F)) {
                    self.unset(F);
                }
            });
        },

        //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
        getDataForMatch: function (filter) {
            var dataKey = "dataForMatch_" + filter;
            var data = this.get(dataKey);
            if (!data) {
                var contacts = this.filterContacts(this.get("data").contacts, {
                    filter: filter
                });
                data = getOldLinkManList(contacts, filter);
                this.set(dataKey, data);
            }
            return data;
            function getOldLinkManList(contacts, filter) {
                var key;
                if (filter == "email") {
                    key = "emails";
                } else if (filter == "fax") {
                    key = "faxes";
                } else if (filter == "mobile") {
                    key = "mobiles";
                }
                var linkManList = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var c = contacts[i];
                    var addrs = c[key];
                    for (var j = 0; j < addrs.length; j++) {
                        var addr = addrs[j];
                        linkManList.push({
                            name: c.name,
                            lowerName: c.lowerName,
                            addr: addr,
                            id: c.SerialId,
                            quanpin: c.Quanpin,
                            jianpin: c.Jianpin
                        });
                    }
                }
                return linkManList;
            }
        },
        /**
         *根据输入匹配联系人
         *@inner
         */
        getInputMatch: function (options) {
            var contacts = this.getDataForMatch(options.filter);
            var keyword = options.keyword;
            var len = contacts.length;
            var matches = [];
            var matchTable = {};
            var attrToNumber = {
                "addr": "01",
                "name": "02",
                "quanpin": "03",
                "jianpin": "04"
            }
            var numberToAttr = {
                "01": "addr",
                "02": "name",
                "03": "quanpin",
                "04": "jianpin"
            }
            var SPLIT_CHAR = "0._.0";//匹配键的分隔符
            //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
            function pushMatch(attrName, index, arrIndex) {
                var matchKey = index + SPLIT_CHAR + attrName;
                if (index < 10) matchKey = "0" + matchKey;
                var arr = matchTable[matchKey];
                if (!arr) matchTable[matchKey] = arr = [];
                arr.push(arrIndex);
            }
            for (var i = 0; i < len; i++) {
                var item = contacts[i];
                //if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
                var minIndex = 10000;
                var minIndexAttr = null;
                var index = item.addr.indexOf(keyword);
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.addr;
                }
                if (index == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
                index = item.lowerName.indexOf(keyword && keyword.toLowerCase());// update by tkh 用户输入的关键字统一转换成小写
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.name;
                }
                if (minIndex == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }

                if (!/[^a-zA-Z]/.test(keyword)) {
                    if (item.quanpin && item.jianpin) {
                        index = item.quanpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.quanpin;
                        }
                        if (minIndex == 0) {
                            pushMatch(minIndexAttr, minIndex, i);
                            continue;
                        }
                        index = item.jianpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.jianpin;
                        }
                    }
                }
                if (minIndexAttr) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
            }

            var allMatchKeys = [];
            for (var p in matchTable) {
                allMatchKeys.push(p);
            }
            allMatchKeys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            var MAX_COUNT = options.maxLength || 30;
            for (var i = 0; i < allMatchKeys.length; i++) {
                var k = allMatchKeys[i];
                var arr = matchTable[k];
                //从key中获取matchAttr和matchIndex，后面用于着色加粗
                var matchAttr = getAttrNameFromKey(k);
                var matchIndex = getMatchIndexFromKey(k);
                for (var j = 0; j < arr.length; j++) {
                    var arrIndex = arr[j];
                    matches.push({
                        info: contacts[arrIndex],
                        matchAttr: matchAttr,
                        matchIndex: matchIndex
                    });
                    if (matches.length >= MAX_COUNT) break;
                }
            }
            //var matchKey = index + SPLIT_CHAR + attrName;
            function getAttrNameFromKey(key) {
                return numberToAttr[key.split(SPLIT_CHAR)[1]];
            }
            function getMatchIndexFromKey(key) {
                return parseInt(key.split(SPLIT_CHAR)[0], 10);
            }
            return matches;
        },

        /**搜索联系人：姓名、拼音、传真、职位等
         *@param {String} keyword 搜索关键字
         *@param {Object} options 搜索选项集
         *@param {Array} options.contacts 要搜索的联系人集（否则是全部联系人）
         */
        search: function (keyword, options) {
            options = options || {};
            if (options.contacts) {
                var contacts = options.contacts;
            } else {
                var contacts = this.get("data").contacts;
                if (options.filter) {
                    contacts = this.filterContacts(contacts, { filter: options.filter });
                }
            }
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (c.match(keyword)) {
                    result.push(c);
                }
            }
            return result;
        },
        /**
         *得到地址
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getAddr: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getEmail(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getNumber(text);
            }
            return "";
        },
        /**
         *得到名字
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getName: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getName(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getName(text);
            }
            return "";
        },

        /**
         *得到发送文本 "name"<addr>
         *@param {String} name 姓名
         *@param {String} addr 地址
         *@example
         var text = model.getSendText("李福拉","lifula@139.com");
         var text = model.getSendText("李福拉","15889394143");
         */
        getSendText: function (name, addr) {
            name = (name || "") && name.replace(/["\r\n]/g, " ");
            return "\"" + name + "\"<" + addr + ">";
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByEmail: function (email) {
            email = $Email.getEmailQuick(email);
            var item = this.getHashContacts()[email];
            if (item) {
                return [item];
            } else {
                return [];
            }
        },

        getHashContacts:function(){
            var data = this.get("data");
            if (!data) return {};
            if (!data.emailHash) {
                var contacts = data.contacts;
                var hash = {};
                if (contacts) {
                    for (var i = 0, len = contacts.length; i < len; i++) {
                        var c = contacts[i];
                        for (var j = 0; j < c.emails.length; j++) {
                            hash[c.emails[j]] = c;
                        }
                    }
                }
                data.emailHash = hash;
            }
            return data.emailHash || {};
        },

        /**
         *根据手机号获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByMobile: function (mobile) {
            var data = this.get("data");
            var result = [];
            if (!data || !data.contacts) return result;
            for (var i = 0, contacts = data.contacts, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    if (c.mobiles[j] == mobile) {
                        result.push(c);
                    }
                }
            }
            return result;
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {String} 返回联系人姓名，如果找不到，返回@前的账号部分
         */
        getAddrNameByEmail: function (email) {
            email = email.trim();
            var c = this.getContactsByEmail(email);
            if (c && c.length > 0) {
                return c[0].name;
            } else {
                var name = $Email.getNameQuick(email);
                if (name && name.replace(/['"\s]/g,"") != "") {
                    return name;
                } else {
                    name = email.replace(/<[^>]+>$/, "");
                    if (name && name.replace(/['"\s]/g, "") != "") {
                        return name;
                    } else {
                        return email;
                    }
                }
            }
        },

        /**
         *更新通讯录缓存数据
         */
        updateCache: function (options) {
            var type = options.type;
            switch (type) {
                case "AddGroup":
                    this.createGroupData({
                        append:options.data
                    });
                    break;
                case "DeleteContacts":
                    this.createContactsData({
                        remove:options.data
                    });
                    break;

                case "AddSendContacts":
                    //添加最近联系人
                    this.createLastAndCloseContactsData({
                        append: options.data.items
                    });
                    var newContacts = options.data.newContacts;
                    //添加新联系人
                    if (newContacts && newContacts.length > 0) {
                        this.createContactsData({
                            append:newContacts
                        });

                        for (var i = 0, m = newContacts.length; i < m; i++) {
                            this.createGroupMemberData({ append: newContacts[i] });
                        }
                    }

                    //if (c.GroupId) {
                    //    var groups = c.GroupId.split(','), group;
                    //    for (var j = groups.length; j--; ) {
                    //        group = data.groupMember[groups[j]];
                    //        if (group) {
                    //            group.push(info.SerialId);
                    //        }

                    //        group = data.groupsMap[groups[j]];
                    //        if (group) {
                    //            group.CntNum = Number(group.CntNum) + 1;
                    //            group.count = group.CntNum;
                    //        }
                    //    }
                    break;

                case "AddContacts":
                    this.createContactsData({
                        append: _.isArray(options.data) ? options.data : [options.data]
                    });
                    var data = _.isArray(options.data) ? options.data[0] : options.data;
                    if (data && data.GroupId) {
                        this.createGroupMemberData({
                            append: data
                        });
                    }
                    break;

                case "EditContacts":
                    this.updateContactsData({
                        modification: _.isArray(options.data) ? options.data : [options.data]
                    });
                    break;

            }

            /**服务端响应事件
            * @name M2012.Contacts.Model#update
            * @event
            * @param {Object} e 事件参数
            * @param {String} e.type 更新行为：AddGroup|AddContacts|EditGroup
            * @param {Object} e.data 更新的数据
            * @example
            model.on("update",function(e){
                console.log(e.type);
                console.log(e);
            });
            */
            this.trigger("update", options);

        },

        /**
         * 获取通讯录现有总条数
         * @param {Function} 回调函数，这是可等待数据加载成功后才给出的
         * @return {Number} 总条数，如果未加载到数据，则返回 -1
         */
        getContactsCount: function(callback) {

            if (callback) {
                M139.Timing.waitForReady('"undefined" !== typeof top.$App.getModel("contacts").get("data").contacts.length', function () {
                    callback(this.get("data").contacts.length);
                });
            }

            if (this.isLoaded()) {
                return this.get("data").contacts.length;
            } else {
                return -1;
            }
        }
    }));


    jQuery.extend(M2012.Contacts,
    /**@lends M2012.Contacts*/
    {
        /**返回一个M2012.Contacts.Model模块实例*/
        getModel: function () {

            if (window != window.top) {
                return top.M2012.Contacts.getModel();
            }

            if (!this.current) {
                this.current = new M2012.Contacts.Model();
            }
            return this.current;
        }

    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.InputSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.InputSuggest
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Function} options.onInput 捕获输入，该函数返回一个数组，表示要提示的项
        *@param {Function} options.onSelect 选择了其中一项（回车、或者鼠标点选）
        *@param {String} options.template 容器(提示菜单)的html模板
        *@param {String} options.itemTemplate
        *@param {String} options.itemPath
        *@param {String} options.itemInsertPath
        *@param {String} options.itemContentPath
        *@param {String} options.itemFocusClass
        *@example
        */
        initialize:function(options){
            options = _.defaults(options,DefaultStyle);

            var div = document.createElement("div");
            div.innerHTML = this.options.template;
            this.setElement(div.firstChild);

            this.onSelect = options.onSelect || this.onSelect;
            this.onInput = options.onInput || this.onInput;
            this.textbox = options.textbox;
            this.initEvent();

            superClass.prototype.initialize.apply(this,arguments);
        },

        /**@inner*/
        initEvent:function(){
            var options = this.options;
            var This = this;
            var jTb = jQuery(options.textbox);


            jTb.bind("keydown", function (e) {
                This.onTextBoxKeyDown(e);
            }).bind("change", function (e) {
                setTimeout(function () {
                    if (jTb.val() == "") {
                        This.hide();
                    }
                },10);
            });

            //由原本的监听keyup改为定时监控输入值
            M139.Timing.watchInputChange(options.textbox, function (e) {
                This.onTextBoxChange(e);
            });
            


            if (M139.Browser.is.ie) {
                //拖滚动条的时候阻止文本框失焦点
                this.$el.mousedown(function (e) {
                    jTb.attr("mode", "edit");
                    jTb.focus();
                }).mousemove(function () {
                    jTb.focus();
                });
                $(document).click(function (e) {
                    if (e.target != This.el) {
                        This.hide();
                    }
                });
            }else{
                jTb.bind("blur", function (e) {
                    This.hide();
                });
                this.$el.mousedown(function (e) {
                    //禁用默认事件，可以在鼠标拉滚动条的时候菜单不消失(ie除外)
                    M139.Event.stopEvent(e);
                });
            }
        },

        /**选中第几项（高亮),鼠标经过或者键盘选择*/
        selectItem:function(index){
            var item = typeof index == "number" ? this.getItem(index) : index;
            var last = this.getSelectedItem();
            if (last != null) this.utilBlurItem(last);
            this.utilFocusItem(item);

            var ele = item[0];
            this.utilScrollToElement(this.el,ele); //如果选中的项被遮挡的话则滚动滚动条
        },

        /**
         *获得需要滚动的元素
         *@inner
         */
        getScrollElement:function(){
            return this.el;
        },

        /**根据下标获得项*/
        getItem:function(index){
            return this.$el.find(this.options.itemPath+"[index='"+index+"']").eq(0);
        },

        /**获得当前提示的所有项*/
        getItems:function(){
            return this.$el.find(this.options.itemPath);
        },
        
        /**获得当前选中项*/
        getSelectedItem:function(){
            var sel = this.$el.find(this.options.itemPath+"[i_selected='1']");
            if(sel.length){
                return sel.eq(0);
            }else{
                return null;
            }
        },

        /**获得当前选中下标*/
        getSelectedIndex:function(){
            var item = this.getSelectedItem();
            if(item){
                return item.attr("index") * 1;
            }else{
                return -1;
            }
        },

        /**@inner*/
        onItemSelect:function(item){

            this.hide();

            var value = $(item).attr("data-value");
            if(jQuery.isFunction(this.onSelect)){
                this.onSelect(value);
            }

            this.textbox.value = value;

            this.textbox.setAttribute("mode", "");


            this.trigger("select",{value:value});
        },


        /**
         *显示提示列表,每次show默认会清除之前的item
         *@param {Array} list 提示数据项[{text:"",title:""}]
         */
        show:function(list){
            if (this.isShow) return;
            if (this.el.parentNode != document.body) {
                document.body.appendChild(this.el);
                //document.body.appendChild(bgIframe);
            }

            var This = this;
            
            this.clear();
            
            var options = this.options;
            for(var i=0,len = list.length;i<len;i++){
                var data = list[i];
                var item = jQuery(options.itemTemplate);
                item.attr("index",i);
                item.attr("data-value",data.value);
                item.find(options.itemContentPath).html(data.text);
                item.appendTo(this.$el.find(options.itemInsertPath));
                item.mousedown(onItemClick);
                item.mouseover(onItemMouseOver);
            }
            
            function onItemClick(){
                This.onItemSelect(this);
            }
            function onItemMouseOver(){
                This.selectItem(this.getAttribute("index")*1);
            }

            var offset = $(this.textbox).offset();
            var top = offset.top + $(this.textbox).height();
            
            var width = Math.max(this.textbox.offsetWidth, 400);
            var parent = $(this.textbox).parent().parent();
            var parentW = parent.offset().left + parent.width();
            var elW = offset.left + width;
            var left = elW > parentW ? offset.left - (elW - parentW) : offset.left;
            
            var height = list.length > 8 ? "300px" : "auto";
            
            //会话邮件写信页
            if(/conversationcompose/i.test(window.location.href)){
                height = list.length > 5 ? "125px" : "auto";
            }

            this.$el.css({
                width: width + "px",
                height: height,
                overflowY: "auto",
                top: top,
                left: left
            });

            //设置最高的建议浮层高度
            if (options.maxItem && options.maxItem > 0) {
                var maxLen = options.maxItem;
                var itemHeight = 24; //单个24px
                this.$el.css({
                    height: list.length > maxLen ? (itemHeight * maxLen) + "px" : "auto"
                });
            }

            this.selectItem(0); //显示的时候选中第一项
            this.isShow = true;
            superClass.prototype.show.apply(this,arguments);
        },

        /**隐藏菜单*/
        hide:function(){
            if (!this.isShow) return;
            this.el.style.display = "none";
            //bgIframe.style.display = "none";
            this.clear();
            this.isShow = false;
        },


        /**
         *修改选中项外观
         *@inner
         */
        utilFocusItem:function(item){
            item.attr("i_selected",1);
            item.css({
                backgroundColor: "#e8e8e8",//选中时候灰色
                color : "#444"
            });
            item.find("span").css("color", "#444");
        },

        /**
         *修改失去焦点项外观
         *@inner
         */
        utilBlurItem:function(item){
            item.attr("i_selected",0);
            item.css({
                backgroundColor : "",
                color : ""
            });
            item.find("span").css("color", "");
        },

        /**
         *如果选中的项被遮挡的话则滚动滚动条
         *@inner
         */
        utilScrollToElement:function(container,element){
            var elementView = {
                top: this.getSelectedIndex() * $(element).height()
            };
            elementView.bottom = elementView.top + element.offsetHeight
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        },

        /**清除所有提示项*/
        clear:function(){
            var op = this.options;
            if(op.itemInsertPath){
                this.$el.find(op.itemInsertPath).html("");
            }else if(op.itemPath){
                this.$el.find(op.itemPath).remove();
            }
        },

        /**
         *监听到文本框值变化时触发，同时触发oninput
         *@inner
         */
        onTextBoxChange: function (evt) {
            var keys = M139.Event.KEYCODE;
            switch (evt && evt.keyCode) {
                //case keys.ENTER:
                case keys.UP:
                case keys.DOWN:
                case keys.LEFT:
                case keys.RIGHT: return;
            }
            this.hide();
            var items = this.onInput(this.options.textbox.value.trim());

            if (items && items.length > 0) {
                this.show(items);
            }
        },

        /**
         *文本框键盘按下触发
         *@inner
         */
        onTextBoxKeyDown:function(evt){
            var This = this;
            var keys = M139.Event.KEYCODE;
            evt = evt || event;
            switch (evt.keyCode) {
                case keys.SPACE:
                case keys.TAB:
                case keys.ENTER: doEnter(); break;
                case keys.UP: doUp(); break;
                case keys.DOWN: doDown(); break;
                case keys.RIGHT:
                case keys.LEFT: this.hide(); break;
                default: return;
            }
            function doEnter() {
                var item = This.getSelectedItem();
                if (item != null) This.onItemSelect(item);
                if (evt.keyCode == keys.ENTER) {
                    M139.Event.stopEvent(evt);
                }
            }
            function doUp() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    index--;
                    index = index < 0 ? index + This.getItems().length : index;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
            function doDown() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    var len = This.getItems().length;
                    index = (index + 1) % len;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
        }
    }));

    var DefaultStyle = {
        template:['<div class="menuPop shadow" style="display:none;z-index:6024;padding:0;margin:0;">',
            '<ul></ul>',
        '</div>'].join(""),
        itemInsertPath:"ul",
        itemPath:"ul > li",
        itemTemplate:'<li style="width:100%;overflow:hidden;white-space:nowrap;"><a href="javascript:;"><span></span></a></li>',
        itemContentPath:"span:eq(0)"
    };
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M2012.UI.Suggest.InputSuggest;
    /***/
    M139.namespace("M2012.UI.Suggest.AddrSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.AddrSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.AddrSuggest
        *@extends M139.UI.Suggest.InputSuggest
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 要筛选的通讯录数据类型
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Boolean} options.onlyAddr 返回的值是否不包含署名，默认是flase
        *@example
        */
        initialize:function(options){
            this.contactModel = M2012.Contacts.getModel();
            this.filter = options.filter;
            this.onlyAddr = options.onlyAddr;
            superClass.prototype.initialize.apply(this,arguments);
        },
        /**
         *返回输入匹配的联系人，为基类提供数据
         *@inner
         */
        onInput:function(value){
            var result = [];
            if (value != "") {
                value = value.toLowerCase();
                var items = this.contactModel.getInputMatch({
                    keyword: value,
                    filter: this.filter
                });

                var inputLength = value.length;
                //防止重复
                var repeat = {};
                for (var i = 0; i < items.length; i++) {
                    var matchInfo = items[i];
                    var obj = matchInfo.info;
                    var addrText = "";
                    if (repeat[obj.addr + "|" + obj.name]) {
                        continue;
                    } else {
                        repeat[obj.addr + "|" + obj.name] = 1;
                    }
                    if (matchInfo.matchAttr == "addr") {
                        matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else if (matchInfo.matchAttr == "name") {
                        matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else {
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText);
                    }
                    var value = obj.addr;
                    if(!this.onlyAddr){
                        if(this.filter == "email"){
                            value = M139.Text.Email.getSendText(obj.name,obj.addr);
                        }else{
                            value = M139.Text.Mobile.getSendText(obj.name,obj.addr);
                        }
                    }
                    result.push({text:addrText,value:value,name:obj.name});
                }
                delete repeat;
            }
            return result;
        }
    }));

    jQuery.extend(M2012.UI.Suggest.AddrSuggest,
    /**@lends M2012.UI.AddrSuggest*/
    {
        /**
         *创建自动输入提示组件实例
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.textbox 要捕获的文本框
         *@param {String} options.filter 要筛选的通讯录数据类型
         *@param {Number} options.maxItem 可选参数，一次最多显示几个，默认50个
         */
        create:function(options){
            var ui = new M2012.UI.Suggest.AddrSuggest(options);
            return ui;
        }
    });
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义输入自动联想发件人组件
 */

(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/***/
	M139.namespace("M2012.UI.Suggest.InputAssociate", superClass.extend(
	/**@lends M2012.UI.Suggest.InputAssociate.prototype */
	{
		/**
		 *输入自动联想发件人组件
		 *@constructs M2012.UI.Suggest.InputAssociate
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
		 *@example
		 */
		initialize : function(options) {
			if(!options || !options.richInputBox) {
				console.log('创建自动联想发件人组件需要传入地址输入框组件实例！');
			}
			this.richInputBox = options.richInputBox;
			this.jContainer = options.richInputBox.jAddrTipsContainer;
			this.contactsModel = options.richInputBox.contactsModel;
			this.response = {
				isSuccess : true,
				requestEmail : '',
				emailList : []
			};
			this.responseCache = [];
			// 缓存响应结果
			this.emailsStr = '';
			// 请求参数：EmailList
			this.emailsStrCache = [];
			// 缓存请求参数：EmailList
			this.isWaiting = false;
			// 联想地址上限
			this.maxAddrs = 5;
			
			superClass.prototype.initialize.apply(this, arguments);
		},
		render : function() {
			var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var emails = self.richInputBox.getInputBoxItems();
				emails = emails.ASC();
				self.emailsStr = self.getEmailsStr(emails);
				var response = self.getResponse(self.emailsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				} else if(emails.length > 0 && emails.length <= 20) {//多于20人不再联想
					self.emailsStrCache.push(self.emailsStr);
					if(!self.isWaiting) {
						self.emailsStr = self.emailsStrCache.pop();
						self.isWaiting = true;
						var request = "<GetAudienceEmailList><UserNumber>{0}</UserNumber><EmailList>{1}</EmailList></GetAudienceEmailList>";
						request = request.format(top.$User.getUid(), self.emailsStr);
						$RM.call("GetAudienceEmailList", request, function(response){
							self.successHandler(response.responseData);
						}, {error: self.error });
					}
				} else {
					if(self.jContainer.html().indexOf('您是否在找') > -1){
						self.jContainer.hide();
					}
				}
			}, 50);
		},
		/**
		 *根据请求参数requestEmail获得缓存中保存的响应
		 *@param requestEmail 请求参数
		 *@inner
		 */
		getResponse : function(requestEmail) {
			if(!requestEmail) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestEmail == requestEmail) {
					return response;
				}
			}
		},
		/**
		 *根据请求地址输入框组件返回的邮件地址列表获取请求参数
		 *@param emails 邮件地址列表
		 *@inner
		 */
		getEmailsStr : function(emails){
			if(!emails){
				return '';
			}
			var tempArray = [];
			for(var i = 0;i < emails.length;i++){
				tempArray.push($T.Email.getEmail(emails[i]));
			}
			return tempArray.join(',');
		},
		/**
		 *请求接口成功后回调改函数
		 *@param responseObj 响应数据对象
		 *@inner
		 */
		successHandler : function(responseObj) {
			var self = this;
			self.isWaiting = false;
			// todo 测试数据
			// responseObj.EmailList = [{"Serialid":"980802114","Email":"346788382@qq.com"},{"Serialid":"1019969704","Email":"tongkaihong@163.com"},{"Serialid":"974791953","Email":"tongkaihong@richinfo.cn"}];
			if(responseObj && responseObj.EmailList) {
				self.response.isSuccess = true;
				self.response.requestEmail = self.emailsStr;
				self.response.emailList = responseObj.EmailList;
				self.responseCache.push(self.response);
				self.callback(self.response);
			}
		},
		/**
		 *请求接口成功后回调函数将调用该函数
		 *@param response 组装后的响应数据对象
		 *@inner
		 */
		callback : function(response) {
			var self = this;
			if(response.isSuccess) {
				var contactArr = response.emailList;
				var len = contactArr.length > self.maxAddrs ? self.maxAddrs : contactArr.length;
				if(len > 0) {
					var html = '您是否在找：';
					for(var i = 0; i < len; i++) {
						var contact = contactArr[i];
						if(i > 0){
							html += ',';
						}
						html += self.getContactHtml(contact);
					}
					var instances = M2012.UI.RichInput.instances;
		            for(var i=0;i<instances.length;i++){
		            	instances[i].jAddrTipsContainer.hide();
		            }
					self.jContainer.html(html).show();
					
					self.jContainer.unbind('click').bind('click', function(event) {
						var jEle = $(event.target);
						if(jEle[0].nodeName.toLowerCase() == 'a'){
							var rel = jEle.attr("rel");
							if(rel == "addrInfo") {
								self.richInputBox.insertItem(jEle.attr('title'));
								self.richInputBox.focus();
								// todo 行为统计
								//top.addBehavior('写信页-点击推荐的联系人');
								jEle.remove();
								var associates = self.jContainer.find("a[rel='addrInfo']");
					        	if(associates.size() == 0){
					        		self.jContainer.hide();
					        	}
							}
						}
					});
				} else {
					self.jContainer.hide();
				}
			}
		},
		/**
		 *请求接口失败后的回调函数
		 *@inner
		 */
		error : function() {
			this.isWaiting = false;
		},
		/**
		 *组装联想结果html
		 *@inner
		 */
		getContactHtml : function(contact) {
			var self = this;
			var serialid = contact.Serialid;
			var addr = contact.Email;
			var name = _getName();
			var nameLen = name.length;
			var addrText = name;
			if(nameLen > 12) {
				addrText = name.substring(0, 9) + "...";
			}
			var title = '"' + name.replace(/\"/g, '') + '"<' + addr + '>';
			var html = '<a href="javascript:;" hidefocus="1" title="' + $T.Html.encode(title) + '" rel="addrInfo">' + $T.Html.encode(addrText) + '</a>';
			return html;

			function _getName() {
				var contactById = self.contactsModel.getContactsById(serialid);
				var name = (contactById && contactById.name) ? contactById.name : '';
				if(!name) {
					// var lastLinkList = top.LastLinkList, linkMan = {};
					// for(var i = 0; i < lastLinkList.length; i++) {
						// linkMan = lastLinkList[i];
						// if(linkMan.addr == addr) {
							// name = linkMan.name;
							// break;
						// }
					// }
					//if(!name) {
						var contactByEmail = self.contactsModel.getContactsByEmail(addr);
						if(contactByEmail && contactByEmail.length > 0) {
							name = contactByEmail[0].name;
						}
					//}
				}
				return name ? name : addr.split('@')[0];
			}
		}
	}));
})(jQuery, Backbone, _, M139);

﻿/**
 * @fileOverview 定义输入收件人地址域名纠错组件
 */

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputCorrect", superClass.extend(
    /**@lends M2012.UI.Suggest.InputCorrect.prototype */
    {
        /**
         *输入收件人地址域名纠错组件
         *@constructs M2012.UI.Suggest.InputCorrect
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
         *@example
         */
        initialize : function(options) {
            if(!options || !options.richInputBox) {
                console.log('创建收件人地址域名纠错组件需要传入地址输入框组件实例！');
            }
            this.richInputBox = options.richInputBox;
            this.jContainer = options.richInputBox.jAddrDomainTipsContainer;
			
            this.response = {
                isSuccess : true,
                requestDomain : '',
                suggestions : {}
            };
            this.responseCache = [];
            // 缓存响应结果
            this.domainsStr = '';
            // 请求参数：domain
            this.domainsStrCache = [];
            this.isWaiting = false;
            
            superClass.prototype.initialize.apply(this, arguments);
        },
		suggesDomainTemplate:"",
		callApi: M139.RichMail.API.call,
        render : function() {
            var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var domains = self.richInputBox.getInputBoxItemsDomain();
				domains = domains.ASC();
				self.domainsStr = domains.join(',');
				var response = self.getResponse(self.domainsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				}else if(domains.length > 0) {
					self.domainsStrCache.push(self.domainsStr);
					if(!self.isWaiting){
						self.isWaiting = true;
						self.callApi("mbox:checkDomain",{domain:domains},function(response){
							self.successHandler(response.responseData);
						},{error: self.error});
					}
				}else{
					self.jContainer.hide();
				}
			}, 50);
			
        },
        /**
         *根据请求参数requestDomain获得缓存中保存的响应
         *@param requestDomain 请求参数
         *@inner
         */
        getResponse : function(requestDomain) {
			if(!requestDomain) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestDomain == requestDomain) {
					return response;
				}
			}
        },
        /**
         *请求接口成功后回调改函数
         *@param responseObj 响应数据对象
         *@inner
         */
        successHandler : function(responseObj) {
            var self = this;
            self.isWaiting = false;
			if(responseObj && responseObj['var'] && responseObj['var'].suggestions) {
                self.response.isSuccess = true;
                self.response.requestDomain = self.domainsStr;
                self.response.suggestions = responseObj['var'].suggestions;
                self.responseCache.push(self.response);
                self.callback(self.response);
            }
        },
        /**
         *请求接口成功后回调函数将调用该函数
         *@param response 组装后的响应数据对象
         *@inner
         */
        callback : function(response) {
            var self = this;
			if(response.isSuccess) {
			    var html = '<p class="gray">我们发现您输入的地址可能有误，请修改：</p>';
				var domainHtml = [],i=0;
				var suggestions = response.suggestions;
				for(var domain in suggestions){
					i++;
					var sugDomains = suggestions[domain];
					self.richInputBox.showErrorDomain(domain);
					domainHtml.push(self.getDomainHtml(domain,sugDomains));
				}
				if(i>0) {
					html += domainHtml.join('');
					this.jContainer.html(html).show();
					this.bindClickEvent();
				}else{
					this.jContainer.hide();
				}
			}
        },
		bindClickEvent:function(){
			var self = this;
			self.jContainer.unbind('click').bind('click', function(event) {
				var jEle = $(event.target);
				if(jEle[0].nodeName.toLowerCase() == 'a'){
					var rel = jEle.attr("rel");
					if(rel == "domain") {
						var domain = jEle.attr('domain');
						var errorDomain = jEle.parent().attr('domain');
						self.richInputBox.changItemDomain(errorDomain,domain);
						jEle.parent().remove();
						if(self.jContainer.find('p').length == 1){
							self.jContainer.hide();
						}
						top.BH('compose_emaildomain_correct');
					}
				}
			});
		},
		getDomainHtml : function(errDomain,sugDomains){
			var html = '<p domain="{errDomain}">{errDomain} → {sugDomainHtml}</p>';
			var sugDomainHtml = [];
			for(var i=0; i<sugDomains.length; i++){
				if(i>0) sugDomainHtml.push('，');
				sugDomainHtml.push('<a href="javascript:;" hidefocus="1" rel="domain" domain='+ sugDomains[i] +'>'+ sugDomains[i] +'</a>');
			}
			return $T.format(html,{errDomain:errDomain,sugDomainHtml:sugDomainHtml.join('')});
		},
        /**
         *请求接口失败后的回调函数
         *@inner
         */
        error : function() {
            this.isWaiting = false;
        }
    }));
})(jQuery, Backbone, _, M139);

﻿

(function (jQuery, _, Backbone, M139) {
	var namespace = "M2012.UI.RichInput.DocumentView";
	M139.namespace(namespace, Backbone.View.extend({
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.DocumentView
		 *@param {Object} options 初始化参数集
		 *@param {HTMLElement} options.textbox 文本框对象
		 *@example
		 */
		initialize: function (options) {
			this.setElement(document.body);

			this.initEvent();
		},
		initEvent: function () {
			this.$el.mouseup($.proxy(this, "onMouseUp"))
				.mousedown($.proxy(this, "onMouseDown"));
		},
		// todo
		onMouseDown: function (e) {
			//var o;
			//var current;
			var box;
			var RichInput = M2012.UI.RichInput;

			//o = $(e.target).closest(".RichInputBox");
			//if(o.length > 0) {
			//	current = RichInput.getInstanceByContainer(o[0]);
			//}

			//RichInput.Tool.currentRichInputBox = current;

			for (var i = 0; i < RichInput.instances.length; i++) {
				box = RichInput.instances[i];
				//if (box !== current) {
					box.unselectAllItems();
				//}
			}
		},
		onMouseUp: function (e) {
			var tool = M2012.UI.RichInput.Tool;
			var current = tool.currentRichInputBox;
			var insertCurrent;
			var i, len;
			
			tool.fireDelay("drawInsertFlag");
			tool.hidDragEffect();
			tool.hidDrawInsertFlag();

			if (!current) return;

			if (tool.dragEnable) {
				var dragItems = tool.dragItems;
				var insertFlag = tool.insertFlag;
				if (insertFlag && dragItems && insertFlag.richInputBox) {
					insertCurrent = insertFlag.richInputBox;
					// todo (add by xiaoyu)
					// 坑！
					// 拖动排序，remove写在一个循环里，这段逻辑有问题：
					//   先添加后再删除可能因排重而失败（即使有testRepeat，在拖动多个时还是有问题）
					//   先删除再添加也会因参照元素脱离DOM树而添加失败
					// 导致的表现：拖动（一个或多个）元素到已选择的元素上，一些元素会被删除
					//if(insertCurrent && insertCurrent !== current) {
						len = dragItems.length;
						for (i = 0; i < len; i++) {
							var moveItem = dragItems[i];
							insertCurrent.insertItem(moveItem.allText, {
								nearItem: insertFlag.nearItem,
								isFocusItem: true,
								testRepeat: moveItem.richInputBox === insertCurrent ? false : true //当前拖拽，不排重(手动remove)；多个实例拖拽，要排重
							});
						}
						
						for (i = 0; i < len; i++) {
							dragItems[i].remove();
						}
					//}
				}
			} else if (current.selectArea) {
				var endPosition = {
					x: e.clientX,
					y: e.clientY + tool.getPageScrollTop()
				};
				//console.log("trySelect");
				current.trySelect(current.startPosition, endPosition);

				//if (current.getSelectedItems().length == 0) {
					//todo
					//Utils.focusTextBox(current.textbox);
				//}
			} else {
				return;
			}
			if ($.browser.msie) {
				//this.releaseCapture();
				if (tool.captureElement) {
					tool.captureElement.releaseCapture();
					tool.captureElement = null;
				}
			} else {
				// todo remove
				//window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}
			tool.dragEnable = false;
			current.selectArea = false;
			tool.dragItems = null;
			tool.insertFlag = null;
			tool.currentRichInputBox = null;
		}
	}));

	var current;
	M2012.UI.RichInput.DocumentView.create = function () {
		if (!current) {
			current = new M2012.UI.RichInput.DocumentView();
		}
		return current;
	}
})(jQuery, _, Backbone, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的子项元素对象
 */

(function (jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	var namespace = "M2012.UI.RichInput.ItemView";
	M139.namespace(namespace, superClass.extend(
	/**@lends M2012.UI.RichInput.ItemView.prototype*/
	{
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.ItemView
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@example
		 new M2012.UI.RichInput.ItemView({
			 text:"lifula@139.com",
			 richInput:richInput,
			 itemId:richInput.getNextItemId(),
			 errorMessage:"收件人格式不对"
		 }).render();
		 */
		initialize: function (options) {
			var $el = jQuery(options.template || this.template);

			this.setElement($el);

			var This = this;
			this.richInputBox = options.richInput;
			this.type = options.type;
			this.allText = options.text;

			if (this.type == "email" && /^\d+$/.test(this.allText)) {
				this.allText += "@139.com";
			}

			this.hashKey = this.addr = this.getAddr();
			this.account = $Email.getAccount(this.addr);
			this.domain = $Email.getDomain(this.addr);
			this.itemId = options.itemId;
			if (!this.addr) {
				this.error = true;
				this.errorMsg = options.errorMessage;
				this.$el.removeClass(this.selectedClass).addClass(this.errorClass);
			}
			if(this.richInputBox.errorfun){
				this.richInputBox.errorfun(this, this.allText);
				if(this.error)this.$el.removeClass(this.selectedClass).addClass(this.errorClass);
			}
			this.selected = false;

			return superClass.prototype.initialize.apply(this, arguments);
		},
		name: namespace,
		selectedClass: "btnNormal_write",
		errorClass:"btnError",
		otherClass:"btnOther",
		errorDomainClass:"addrDomainError",
		template: '<div class="addrBase addrBaseNew btnNormal_write" unselectable="on"><a href="javascript:;" class="addrBase_con"><b></b><span></span></a><a href="javascript:void(0);" class="addrBase_close" title="删除">x</a></div>',
		render: function () {
			var This = this;
			var title = this.error ? this.errorMsg : this.addr;
			var text = this.error ? this.allText : this.getName();

			//this.$el.text(text).attr("title", title).append("<span>;</span>");

			this.$el.attr("title", title);

			if (this.error) {
				this.$("b").text(this.allText);
			} else {
				if (this.allText.indexOf("<") > -1) {
					this.$("b").text(text);
					if(this.type == 'email'){
						this.$("span:eq(0)").html('&lt;' + this.account + '<span class="addrDomain">@' + this.domain + '</span>&gt;');
					}else{
						this.$("span:eq(0)").text("<" + this.getAddr() + ">");
					}
				} else {
					if(this.type == 'email'){
						this.$("b").html(this.account + "<span class='addrDomain'>@" + this.domain + "</span>");
					}else{
						this.$("b").text(this.allText);
					}
				}
			}

			this.$el.attr("rel", this.itemId);

			this.initEvents();

			//设置最大宽度
			if ($B.is.ie && $B.getVersion() < 8) {
				var containerWdith = this.richInputBox.$el.width();
				setTimeout(function () {
					var width = This.$el.width();
					if (width > 200 && (width + 10) > containerWdith) {
						This.$el.width(containerWdith - 10);
					}
				}, 0);
			}

			this.addDistinctBehavior("contact_insert");
			return superClass.prototype.render.apply(this, arguments);
		},
		/**
		 *初始化事件
		 *@inner
		 */
		initEvents:function(){
			this.$el.on("dblclick",$.proxy(this,"onDblclick"))
				.on("mouseenter", $.proxy(this, "onMouseEnter"))
				.on("mouseleave", $.proxy(this, "onMouseLeave"));

			this.on("select",function(){
				//this.$el.removeClass(this.selectedClass).addClass(this.selectedClass+"On");
				this.el.className = this.el.className.replace(/\bbtn\w+(?!On)/, function($0){return ($0+"On").replace("OnOn", "On")});
				//console.log("select: " + this.el.className);
			}).on("unselect",function(){
				//this.$el.removeClass(this.selectedClass+"On").addClass(this.selectedClass);
				this.el.className = this.el.className.replace(/\b(btn\w+)On/, function($0, $1){return $1});
				//console.log("unselected: " + this.el.className);
			}).on("errorDomain",function(){
				this.$el.attr("title", '该地址的域名可能不存在，请双击修改');
				this.$el.addClass(this.errorDomainClass + " " + this.otherClass);
			}).on("changeDomain",function(e){
				this.addr = this.addr.replace('@' + e.errorDomain,'@' + e.domain);
				this.allText = this.allText.replace('@' + e.errorDomain,'@' + e.domain);
				this.domain = e.domain;
				delete this.richInputBox.hashMap[this.hashKey];
				this.hashKey = this.addr;
				this.richInputBox.hashMap[this.hashKey] = this;
				this.$el.removeClass(this.errorDomainClass + " " + this.otherClass);
				this.$el.attr("title",this.addr);
				this.$el.find("span.addrDomain").html('@' + e.domain);
			});
		},
		/**
		 *@inner
		 */
		getAddr:function(){
			var addr = this.richInputBox.contactsModel.getAddr(this.allText, this.type);
			if (this.type == "email") {
				var domain = this.options.limitMailDomain;
				if (domain && $Email.getDomain(addr) !== domain) {
					addr = "";
				}
			}
			return addr;
		},
		/**
		 *@inner
		 */
		getName:function(){
			var name = this.richInputBox.contactsModel.getName(this.allText,this.type);
			return name;
		},

		/**
		 *选中该成员
		 */
		select: function() {
			var box = this.richInputBox;

			// 必须判断，否则触发很频繁
			if(this.selected == false) {
				this.addDistinctBehavior("contact_select");
				this.selected = true;
			}
 
			//todo remove to parentview
			if ($.browser.msie) { 
				var jTextBox = box.jTextBox;
				//鼠标划选的时候多次触发 有性能问题，所以延迟
				M2012.UI.RichInput.Tool.delay("ItemFocus", function() {
					box.focus();
				});
			} else if ($.browser.opera) {
				var scrollTop = box.container.parentNode.scrollTop;
				box.textbox.focus();
				box.container.parentNode.scrollTop = scrollTop;
			} else {
				box.focus();
			}
			this.trigger("select");
		},

		addDistinctBehavior: function(type){
			var prefix = this.richInputBox.comefrom;
			BH({key: prefix + "_" + type});
		},

		/**
		 *取消选中状态
		 */
		unselect: function() {
			this.selected = false;
			this.trigger("unselect");
		},
		/**
		 *移除元素
		 */
		remove: function() {
			//todo
			this.richInputBox.disposeItemData(this);
			return superClass.prototype.remove.apply(this, arguments);
		},

		/**
		 *双击执行编辑
		 *@inner
		 */
		onDblclick: function (e) {
			this.addDistinctBehavior("contact_dblclick");
			this.richInputBox.editItem(this);
		},

		onMouseEnter: function (e) {
			var self = this;
			var hover_close = false;
			if($(e.target).hasClass("addrBase_close")) {
				hover_close = true;
			}
			this.richInputBox.hoverItem = this;
			setTimeout(function(){
				if(self.richInputBox.hoverItem === self) {
					if(hover_close) {
						self.addDistinctBehavior("contact_hover_close");
					} else {
						self.addDistinctBehavior("contact_hover");
					}
				}
			}, 500);
		},

		onMouseLeave: function () {
			this.richInputBox.hoverItem = null;
		}
	}));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义通讯录富文本框的插件
 */

(function (jQuery, _, M139) {
	var $ = jQuery;
	var namespace = "M2012.UI.RichInput.Plugin";
	M139.namespace(namespace,
	/**@lends M2012.UI.RichInput.Plugin */
	{
		AddrSuggest: function (richInput, maxItem) {
			M2012.Contacts.getModel().requireData(function () {
				richInput.addrSuggest = new M2012.UI.Suggest.AddrSuggest({
					textbox: richInput.textbox,
					filter: richInput.type,
					maxItem: maxItem
				}).on("select", function () {
					richInput.createItemFromTextBox();
				});
			});
		}
	});
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的扩管文本框对象
 */

(function (jQuery, _, Backbone, M139) {
	var namespace = "M2012.UI.RichInput.TextBoxView";
	M139.namespace(namespace, Backbone.View.extend(
		/**@lends M2012.UI.RichInput.TextBoxView.prototype*/
		{
			/** 定义通讯录地址本组件代码
			 *@constructs M2012.UI.RichInput.TextBoxView
			 *@param {Object} options 初始化参数集
			 *@param {HTMLElement} options.element 托管的文本框对象
			 */
			initialize: function (options) {

				this.setElement(options.element);

				this.richInputBox = options.richInput;

				this.jTextBox = this.$("input");
				this.textbox = this.jTextBox[0];

				this.initEvent();
			},
			/**
			 *初始化事件
			 *@inner
			 */
			initEvent: function () {
				this.jTextBox.click($.proxy(this, "onClick"))
					.focus($.proxy(this, "onFocus"))
					.blur($.proxy(this, "onBlur"))
					.keydown($.proxy(this, "onKeyDown"))
					.keydown($.proxy(this, "onKeyUp"))
					.bind("paste", $.proxy(this, "onPaste"))
					.bind("cut", $.proxy(this, "onCut"));
				var This = this;
				M139.Timing.watchInputChange(this.textbox, function (e) {
					This.onChange(e);
				});
			},
			/**
			 *文本框内容变更时
			 *@inner
			 */
			onChange: function (e) {
				this.fixTextBoxWidth();
				this.trigger("input");
			},
			/**
			 *文本框根据内容自适应宽度
			 *@inner
			 */
			fixTextBoxWidth: function () {
				var jText = this.jTextBox;
				var minWidth = 10;
				if (jText.val() == "") {
					this.$el.width(minWidth);
					return;
				}
				if ($B.is.ie && $B.getVersion() < 10) {
					var width = jText[0].createTextRange().boundingWidth + 13;
				} else {
					//计算宽度
					var widthHelper = $("#widthHelper");
					if (widthHelper.length == 0) {
						widthHelper = $("<span id='widthHelper' style='position:absolute;left:0px;top:0px;visibility:hidden;'></span>");
						widthHelper.appendTo(document.body);
						widthHelper.css({
							fontSize: jText.css("font-size"),
							fontFamily: jText.css("font-family"),
							border: 0,
							padding: 0
						});
					}
					var width = widthHelper.text(jText.val().replace(/ /g, "1")).width() + 13;
					//fixed IE10下文本框会出来一个x
					//if ($B.is.ie && $B.getVersion() >= 10) {
					//	width += 20;
					//}
				}
				var maxWidth = this.richInputBox.$el.width() - 3;
				if (width > maxWidth) width = maxWidth;
				if (width < minWidth) width = minWidth;


				//设置最大宽度
				if ($B.is.ie && $B.getVersion() < 8) {
					if (width > 200) {
						var containerWdith = this.richInputBox.$el.width();
						if (width + 10 > containerWdith) {
							width = containerWdith - 10;
						}
					}
				}

				this.$el.width(width);
				jText.width(width);
			},

			setEditMode: function (itemView) {
				var jTextBox = this.jTextBox;
				this.richInputBox.editMode = true;
				jTextBox.attr("mode", "edit"); //防止自动触发blur
				setTimeout(function () {
					jTextBox.attr("mode", "");
				}, 0);
				jTextBox.val(itemView.allText);
				itemView.$el.replaceWith(this.$el);
				itemView.remove();
				
				M139.Dom.selectTextBox(this.textbox);
				this.fixTextBoxWidth();
			},

			setValue:function(value){
				this.textbox.value = value;
				this.fixTextBoxWidth();
			},

			/**
			 *粘贴
			 *@inner
			 */
			onPaste: function (e) {
				/*
				todo test
				if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
					var This = this;
					setTimeout(function() {
						var text = This.value;
						This.value = "";
						This.value = text; //火狐下的文本框渲染bug
					}, 0);
				}
				*/
			},
			/**
			 *剪切
			 *@inner
			 */
			onCut: function (e) {
				/*
				todo
				var current = e.richInputBox;
				RichInputBox.Plugin.AutoAssociateLinkMan(current);
				*/
			},
			/**
			 *获得焦点
			 *@inner
			 */
			onFocus: function (e) {
				this.richInputBox.trigger("focus");
				if(this.richInputBox.highlight){
					this.richInputBox.jItemContainer.addClass('writeTable-txt-on');
				}
				/*
				todo
				if(e && e.richInputBox){
					var current = e.richInputBox;
					RichInputBox.Plugin.AutoAssociateLinkMan(current);
				}
				*/
			   // add by tkh
			   if(e && this.richInputBox.inputAssociateView){
					this.richInputBox.inputAssociateView.render();// add by tkh
			   }
			   
			   /*if(e && this.richInputBox.inputCorrectView){
					this.richInputBox.inputCorrectView.render();// add by yly
			   }*/
			},
			/**
			 *失去焦点
			 *@inner
			 */
			onBlur: function (e) {
				var current = this.richInputBox;
				if (this.jTextBox.attr("mode") == "edit") {
					this.jTextBox.attr("mode", "");
					return;
				}
				current.editMode = false;
				current.createItemFromTextBox();
				current.jItemContainer.removeClass('writeTable-txt-on');
				///console.log("blurrrrrrrrrrrrr..");
				// warn ! IE8鼠标在联系人上按下时，光标会继续闪动，即它还是焦点
				// 这导致触发光标的blur事件，导致无法选中。 (add by xiaoyu)
				//current.unselectAllItems();
			},
			/**
			 *点击
			 *@inner
			 */
			onClick: function (e) {
				if (e && e.richInputBox) e.richInputBox.clearTipText();
			},

			/**
			 *按键松开
			 *@inner
			 */
			onKeyUp: function (e) {
				this.fixTextBoxWidth();
			},
			/**
			 *键盘按下
			 *@inner
			 */
			onKeyDown: function (e) {
				var This = this;
				if (e.shiftKey || e.ctrlKey) return;
				var current = this.richInputBox;
				var Keys = M139.Event.KEYCODE;
				var textbox = this.textbox;
				this.fixTextBoxWidth();
				switch (e.keyCode) {
					case Keys.BACKSPACE:
						{
							return KeyDown_Backspace.apply(this, arguments);
						}
					case Keys.DELETE:
						{
							return KeyDown_Delete.apply(this, arguments);
						}
					case Keys.SEMICOLON:
					case Keys.COMMA:
					case Keys.ENTER:
						{
							return KeyDown_Enter.apply(this, arguments);
						}
					case Keys.LEFT:
						{
							return KeyDown_Left.apply(this, arguments);
						}
					case Keys.RIGHT:
						{
							return KeyDown_Right.apply(this, arguments);
						}
					case Keys.UP: case Keys.Down:
						{
							e.isUp = e.keyCode == Keys.Up;
							return KeyDown_Up_Down.apply(this, arguments);
						}
					case Keys.TAB:
						{
							return KeyDown_Tab.apply(this, arguments);
						}
				}
				function KeyDown_Backspace(e) {
					if (textbox.value == "") {
						if (current.getSelectedItems().length > 0) return;
						var item = current.getTextBoxPrevItem();
						if (item) item.remove();
						textbox.focus();
					}
				}
				function KeyDown_Delete(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxNextItem();
						if (item) item.remove();
						textbox.focus();
					}
				}
				function KeyDown_Enter(e) {
					if (textbox.value.trim() != "") {
						setTimeout(function () {
							current.createItemFromTextBox();
						}, 0);
					}
					return false;
				}
				function KeyDown_Left(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxPrevItem();
						if (item) {
							current.moveTextBoxTo(item.$el);
							return false;
						}
					}
				}
				function KeyDown_Right(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxNextItem();
						if (item) {
							current.moveTextBoxTo(item.$el, true);
							return false;
						}
					}
				}
				function KeyDown_Up_Down(e) {
					if (textbox.value == "") {
						var offset = current.textboxView.offset();
						var nearItems = M2012.UI.RichInput.Tool.getNearlyElement({
							x: offset.left,
							y: offset.top + (e.isUp ? -5 : 20),
							richInputBox: current
						});
						if (nearItems) current.moveTextBoxTo(nearItems.element, nearItems.isAfter);
						return false;
					}
				}
				function KeyDown_Tab(e) {
					textbox.setAttribute("TabPress", "1");
					setTimeout(function () {
						textbox.setAttribute("TabPress", null);
					}, 0);
				}
			}
		}));
})(jQuery, _, Backbone, M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	var namespace = "M2012.UI.RichInput.View";

	M139.namespace(namespace, superClass.extend({
	/**@lends M2012.UI.RichInput.View.prototype*/
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.View
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@param {HTMLElement} options.container 组件的容器
		 *@param {Number|Function} options.maxSend 最大接收人个数，默认为50
		 *@param {Number} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
		 *@param {String} options.limitMailDomain 限定输入的邮件域
		 *@param {String} options.validateMsg 非法输入值的提示语
		 *@param {Boolean} options.highlight 聚焦输入框是否高亮，默认true
		 *@example
		 var richinputView = new M2012.UI.RichInput.View({
			 container:document.getElementById("addrContainer"),
			 type:"email",
			 maxSend:200,
			 sendIsUpTo:195
		 }).render();
		 */
		initialize: function(options) {

			M2012.UI.RichInput.instances.push(this);
			this.id = M2012.UI.RichInput.instances.length;

			M2012.UI.RichInput.DocumentView.create();

			// 控制接收人提示层的位置，默认是在接收人输入框的上方top，可以设置为下方bottom
			this.tipPlace = options.tipPlace || "top";
			var div = document.createElement("div");
			var templateData = {
				offset: "-28px",
				arrow: "tipsBottom",
				zIndex: parseInt(options.zIndex) || 3
			};
			if (this.tipPlace == "bottom") { // 提示层在接收人输入框的底部
				templateData = {
					offset: "29px",
					arrow: "tipsTop",
					zIndex: parseInt(options.zIndex) || 3
				}
			}
			div.innerHTML = $T.format(this.template, templateData);
			if (options.border) {
				$(div).find('div.ItemContainer').css('border', options.border);
			}
			if (options.heightLime) {
				$(div).children().css({
					'overflow-y': 'auto',
					'max-height': options.heightLime + 'px',
					'_height': 'expression(this.scrollHeight > 50 ? "' + options.heightLime + 'px" : "auto")'
				});
			}
			var el = div.firstChild;

			this.type = options.type;
			this.contactsModel = M2012.Contacts.getModel();

			this.model = new Backbone.Model();
			//ad wx产品运营中要扩展的方法
			this.change = options.change || function() {};
			this.errorfun = options.errorfun || null;

			this.setElement(el);
			this.jTextBox = this.$("input");
			this.textbox = this.jTextBox[0];
			this.textboxView = new M2012.UI.RichInput.TextBoxView({
				richInput: this,
				element: this.$("div.addrText")
			});
			//向下兼容
			this.jContainer = this.$el;
			this.container = this.el;

			this.jItemContainer = this.$(this.itemContainerPath);

			this.jAddrTipsContainer = this.$(this.addrTipsPath);

			this.jAddrDomainTipsContainer = this.$(this.addrDomainTipsPath);

			this.items = {};
			this.hashMap = {};

			var maxSend = options.maxSend || 50;
			if (!$.isFunction(maxSend)) {
				maxSend = new Function("", "return " + maxSend);
			}
			this.maxSend = maxSend;
			this.sendIsUpTo = function() {
				return options.sendIsUpTo || (this.maxSend() - 5);
			};
			this.tool = M2012.UI.RichInput.Tool;

			this.highlight = typeof(options.highlight) == 'undefined' ? true : options.highlight;

			return superClass.prototype.initialize.apply(this, arguments);
		},
		name: namespace,
		template: ['<div class="p_relative RichInputBox writeTable" style="z-index:{zIndex};">',
			'<div class="tips write-tips EmptyTips" style="left:0;top:{offset};display:none;">',
				'<div class="tips-text EmptyTipsContent">',
					//'请填写收件人',
				'</div>',
				'<div class="{arrow} diamond"></div>',
			'</div>',
			'<div class="ItemContainer writeTable-txt clearfix" unselectable="on" style="cursor: text;overflow-x:hidden">',
				'<div class="PlaceHold" style="position:absolute;color: silver;display:none;left:10px;"></div>',
				'<div class="addrText" style="margin-top: -3px; *margin:0 0 0 3px;">',
					'<input type="text" style="width:100%" class="addrText-input">',
				'</div>',
			'</div>',
			'<div class="addnum" style="display:none"></div>',
			'<div class="pt_5 addrDomainCorrection" style="display:none"></div>',
		'</div>'].join(""),
		itemPath: ".addrBaseNew",
		itemContainerPath: "div.ItemContainer",
		addrTipsPath: "div.addnum",
		addrDomainTipsPath: "div.addrDomainCorrection",
		/**构建dom函数*/
		render: function() {
			var options = this.options;
			var title = "";

			this.initEvent();

			//this.$el.appendTo(options.container);
			var container = $D.getHTMLElement(options.container);
			container.innerHTML = "";
			container.appendChild(this.el);

			// add by xiaoyu (for 行为统计模块区分)
			switch (container.id) {
			case "evocationContainer":
				this.comefrom = "simplemail";
				title = $(container).closest(".boxIframe").find(".DL_DialogTitle").text();
				if (title.indexOf("短信") !== -1) {
					title = "_sms";
				} else if (title.indexOf("彩信") !== -1) {
					title = "_mms";
				} else if (title.indexOf("贺卡") !== -1) {
					title = "_greetingcard";
				} else {
					title = "";
				}
				this.comefrom += title;
				break;
			case "to-edit":
			case "cc-edit":
			case "bcc-edit":
				this.comefrom = "conversation";
				break;
			default:
				this.comefrom = "compose"; // 来自写信页
			}

			M2012.UI.RichInput.Tool.unselectable(this.el.parentNode);
			M2012.UI.RichInput.Tool.unselectable(this.el);
			M2012.UI.RichInput.Tool.unselectable(this.el.firstChild);

			if (this.options.placeHolder) {
				this.setTipText(this.options.placeHolder);
			}

			//插件
			var plugins = options.plugins;
			for (var i = 0; i < plugins.length; i++) {
				new plugins[i](this);
			}

			return superClass.prototype.render.apply(this, arguments);
		},
		/**
		 *初始化事件
		 *@inner
		 */
		initEvent: function() {
			var This = this;
			this.$el.on("click", $.proxy(this, "onClick"))
				.on("keydown", $.proxy(this, "onKeyDown"))
				.on("mousedown", $.proxy(this, "onMouseDown"))
				.on("mouseup", $.proxy(this, "onMouseUp"));

			this.$("div.PlaceHold").click(function() {
				This.textbox.select();
				This.textbox.focus();
				//return false;
			});

			this.model.on("change:placeHolder", function() {
				This.switchTipText();
			});

			this.textboxView.on("input", function() {
				This.switchTipText();
			});

			this.on("itemchange", function() {
				This.switchTipText();
			});

			this.jTextBox.keydown(function(e) {
				This.trigger("keydown", e);
			}).blur(function(e) {
				This.trigger("blur", e);
			});
		},

		/**
		 *提示没有收件人
		 *@param {String} msg 可选参数，默认是：请填写收件人
		 */
		showEmptyTips: function(msg) {
			msg = msg || "请填写收件人";
			var tips = this.$("div.EmptyTips");
			tips
			/*.css({
				left:"0",
				top:"-28px"
			})*/.show().find("div.EmptyTipsContent").text(msg);
			setTimeout(function() {
				tips.hide();
			}, 3000);
			// commented (暂时去掉)
			//M139.Dom.flashElement(this.el);
		},

		/**
		 *提示接收人格式非法
		 *@param {String} msg 可选参数，默认是：接收人输入错误
		 */
		showErrorTips: function(msg) {
			var item = this.getErrorItem();
			if (!item) return;

			msg = msg || "接收人输入错误";
			var tips = this.$("div.EmptyTips");
			tips.show().find("div.EmptyTipsContent").text(msg);

			var itemOffset = item.$el.offset();
			var richinputOffset = this.$el.offset();
			tips.css({
				left: itemOffset.left - richinputOffset.left + parseInt(item.$el.width() / 2) - 16,
				top: itemOffset.top - richinputOffset.top + (this.tipPlace == "bottom" ? 25 : -32)
			});
			setTimeout(function() {
				tips.hide();
			}, 3000);
		},

		/**
		 *获得输入的项
		 *@inner
		 *@returns {Array} 返回输入的dom数组
		 */
		getItems: function() {
			var result = [];
			var items = this.items;
			this.$(this.itemPath).each(function() {
				var itemId = this.getAttribute("rel");
				var item = items[itemId];
				if (item) result.push(item);
			});
			return result;
		},

		/** 得到收件人输入项 */
		getToInstancesItems: function() {
			var instances = M2012.UI.RichInput.instances;
			return instances[0].getValidationItems().distinct();
		},

		/**
		 *todo 得到所有实例的输入项
		 */
		getAllInstancesItems: function() {
			var instances = M2012.UI.RichInput.instances;
			var result = [];
			for (var i = 0; i < instances.length; i++) {
				result = result.concat(instances[i].getValidationItems());
			}
			result = result.distinct();
			return result;
		},
		/**
		 *得到所有实例的输入对象（收件人、抄送、密送）
		 */
		getInputBoxItems: function() {
			return this.getAllInstancesItems();
		},
		/**
		 *得到所有实例的地址域名
		 */
		getInputBoxItemsDomain: function() {
			var result = [];
			for (var p in this.items) {
				var item = this.items[p];
				if (item && item.domain) {
					result.push(item.domain);
				}
			}
			result = result.distinct();
			return result;
		},
		/**
		 *判断是否重复输入
		 *@inner
		 */
		isRepeat: function(addr) {
			//取手机号码或者邮件地址作为key
			var hashKey = this.contactsModel.getAddr(addr, this.type);
			if (hashKey && this.hashMap[hashKey]) {
				//实现闪烁效果
				for (var p in this.items) {
					var item = this.items[p];
					if (item && item.hashKey == hashKey) {
						M139.Dom.flashElement(item.el);
						break;
					}
				}
				return true;
			} else {
				return false;
			}
		},
		/**
		 *todo event
		 *插入收件人之前
		 *@inner
		 */
		/*beforeInsertItem: function() {
			var This = this;
			var curItemsLen = this.getInputBoxItems().length;
			var addresseeTips = this.jAddrTipsContainer;
			if (curItemsLen >= this.maxSend()) {
				addresseeTips.html('不能再添加收件人！').show();
				//todo
				//this.blinkBox(addresseeTips, 'xxxclass');
				//this.hideBlinkBox(addresseeTips);
				return false;
			}
			return true;
		},

*/
		/**
		 *插入成员
		 *@param {String} addr 插入的地址
		 *@param {Object} options 选项集合
		 *@param {Boolean} options.isAfter 是否插入到文本框后方
		 *@param {HTMLElement} options.element 插入到目标元素后方
		 *@param {Boolean} options.isFocusItem 插入后是否显示为选中状态
		 */
		insertItem: function(addr, options) {
			options = options || {};
			var nearItem = options.nearItem;
			var isAfter = nearItem && nearItem.isAfter;
			var element = nearItem && nearItem.element;
			var isFocusItem = options.isFocusItem;

			if (!element) {
				element = this.textboxView.$el;
			} else {
				//for(var i = 0, items = this.items; i < items.length; i++){
				//	if(nearItem === items[i] && items[i].selected){
				//		element = this.textboxView.$el;
				//		break;
				//	}
				//}
			}

			//add wx
			(typeof this.change === "function") && this.change(addr);

			var list = _.isArray(addr) ? addr : this.splitAddr(addr);

			var totalLength = this.getInputBoxItems().length;
			var breakSender = false;
			var str, item, tipHTML = "";

			for (var i = 0; i < list.length; i++) {
				if (totalLength == this.maxSend()) {
					//todo 移到别的地方会好一些
					try {
						if ($.isFunction(this.options.onMaxSend)) {
							this.options.onMaxSend();
						} else {
							//TODO 这一坨应该放在写信页调用的onMaxSend里

							var serviceItem = top.$User.getServiceItem();
							var isFree = true;
							if(serviceItem == "0017" || serviceItem == "0016"){
								isFree = false;
							}
							var decrease = '请减少邮件群发人数',
							    upGrade = '<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">套餐升级</a>可增加群发人数!';

							if(this.noUpgradeTips){
								var tipHTML = '接收人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人！';
							}else{
								if (list.length == 1) {
									var tipHTML = '发送邮件人数已超过上限：<span style="color: #F60;">' + this.maxSend() + '</span>人!';
									if(isFree){
										tipHTML += upGrade;
									}else{
										tipHTML += decrease;
									}
								}else {
									var tipHTML = M139.Text.Utils.format('<span style="color: #F60;">{remain}</span>人未添加，最多添加<span style="color: #F60;">{maxSend}</span>人！', {
										remain: list.length - i,
										maxSend: this.maxSend()
									});								
									if(isFree){
										tipHTML += upGrade;
									}else{
										tipHTML += decrease;
									}
								}
							}
							this.showAddressTips({
								html: tipHTML,
								flash: true
							});
						}
					} catch (e) {}
					breakSender = true;
					break;
				} else {
					totalLength++;
				}
				str = list[i].trim();
				if (str != "") {
					if (options.testRepeat === false || !this.isRepeat(str)) {
						//move to itemview
						item = new M2012.UI.RichInput.ItemView({
							richInput: this,
							text: str,
							itemId: this.getNextItemId(),
							type: this.type,
							limitMailDomain: this.options.limitMailDomain,
							errorMessage: this.options.validateMsg || "地址有误，请双击修改"
						}).render();
						
						M2012.UI.RichInput.Tool.unselectable(item.el);
						this.items[item.itemId] = item;
						
						if (!item.error) {
							this.hashMap[item.hashKey] = true;
						}
						if (isAfter) {
							element.after(item.$el);
						} else {
							element.before(item.$el);
						}
						if (isFocusItem) item.select();
					}
				}
			}
			this.onItemChange({
				breakSender: breakSender
			});
		},
		/**
		 *todo event
		 *插入收件人之后
		 *@inner
		 */
		onItemChange: function(options) {
			options = options || {};
			if (!options.breakSender) {
				var addresseeTips = this.jAddrTipsContainer;
				var itemLength = this.getInputBoxItems().length;
				var html = '';
				if (itemLength >= this.sendIsUpTo()) {
					var remail = this.maxSend() - itemLength;
					html = '还可添加<strong class="c_ff6600">' + remail + '</strong>人';
					this.showAddressTips({
						html: html
					});
				} else {
					this.hideAddressTips();
				}
			}

			//收件人人数大于3人时提示群发单显(只在写信页用)
			// todo remove ?
			try {
				if (window.location.href.indexOf("html/compose.html") > -1) {
					top.$App.off('insertItem');
					var toLength = this.getToInstancesItems().length;
					toLength >= 3 && top.$App.trigger('insertItem', {
						totalLength: toLength
					});
				}
			} catch (e) {}

			this.trigger("itemchange");
		},

		/**
		 *地址栏下方的提示信息
		 *@param {Object} options 参数集
		 *@param {String} options.html 提示内容
		 *@param {Boolean} options.flash 是否闪烁
		 */
		showAddressTips: function(options) {
			var This = this;
			this.jAddrTipsContainer.html(options.html).show();
			if (options.flash) {
				M139.Dom.flashElement(this.jAddrTipsContainer);
			}
			clearTimeout(this.hideAddressTipsTimer);
			//5秒后提示自动消失
			this.hideAddressTipsTimer = setTimeout(function() {
				This.hideAddressTips();
			}, 5000);
		},
		hideAddressTips: function() {
			// add by tkh
			var associates = this.jAddrTipsContainer.find("a[rel='addrInfo']");
			if (associates.size() == 0) {
				this.jAddrTipsContainer.hide();
			}
		},

		/**
		 *得到文本框后一个成员
		 *@inner
		 */
		getTextBoxNextItem: function() {
			var node = this.textboxView.el.nextSibling;
			if (node) {
				var itemId = node.getAttribute("rel");
				if (itemId) {
					return this.items[itemId];
				}
			} else {
				return null;
			}
		},
		/**
		 *得到文本框前一个成员
		 *@inner
		 */
		getTextBoxPrevItem: function() {
			var node = this.textboxView.el.previousSibling;
			if (node) {
				var itemId = node.getAttribute("rel");
				if (itemId) {
					return this.items[itemId];
				}
			} else {
				return null;
			}
		},
		/**
		 *取消选择所有成员
		 *@inner
		*/
		unselectAllItems: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) {
					item.unselect();
				}
			}
		},
		/**
		 *选择所有成员
		 *@inner
		*/
		selectAll: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) {
					item.select();
				}
			}
		},

		/**
		 *复制选中成员
		 *todo 优化成原生的复制
		 *@inner 
		 */
		copy: function() {
			var This = this;
			var items = this.getSelectedItems();
			var list = [];
			for (var i = 0; i < items.length; i++) {
				list.push(items[i].allText);
			}
			M2012.UI.RichInput.Tool.Clipboard.setData(list);
			setTimeout(function() {
				M139.Dom.focusTextBox(This.textbox);
			}, 0);
		},
		/**
		 *剪切选中成员
		 *todo 优化成原生的剪切
		 *@inner 
		 */
		cut: function() {
			this.copy();
			var items = this.getSelectedItems();
			for (var i = 0; i < items.length; i++) {
				items[i].remove();
			}
			//console.log('cut 剪切');
			if (this.inputAssociateView) {
				this.inputAssociateView.render(); // add by tkh
			}
		},
		/**
		 *粘贴成员 todo 优化成原生的
		 *@inner 
		 */
		paste: function(e) {
			var This = this;
			setTimeout(function() {
				var text = This.textbox.value;
				if (/[;,；，]/.test(text) || (This.type == "email" && M139.Text.Email.isEmailAddr(text)) || (This.type == "mobile" && M139.Text.Mobile.isMobile(text))) {
					This.createItemFromTextBox();
				}
			}, 0);
		},

		/**
		 *获得选中的成员
		 *@inner 
		 */
		getSelectedItems: function() {
			var result = [];
			for (var p in this.items) {
				var item = this.items[p];
				if (item && item.selected) {
					result.push(item);
				}
			}
			return result;
		},

		/**
		 *清空输入项 
		 */
		clear: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) item.remove();
			}
		},

		/**
		 *移除选中的成员
		 *@inner 
		 */
		removeSelectedItems: function() {
			var items = this.getSelectedItems();
			for (var i = 0; i < items.length; i++) {
				items[i].remove();
			}
		},

		/**
		 *双击编辑联系人
		 */
		editItem: function(itemView) {
			this.textboxView.setEditMode(itemView);
		},

		/**
		 *@inner
		 *分割多个联系人
		 */
		splitAddr: function(addr) {
			if (this.type == "email") {
				return M139.Text.Email.splitAddr(addr);
			} else if (this.type == "mobile") {
				return M139.Text.Mobile.splitAddr(addr);
			}
			return [];
		},


		/**
		 *从文本框读取输入值，添加成员
		 */
		createItemFromTextBox: function() {
			var textbox = this.textbox;
			var value = textbox.value.trim();
			if (value != "" && value != this.tipText) {
				//todo 优化event
				if (this.type == "email" && /^\d+$/.test(value)) {
					value = value + "@" + ((top.$App && top.$App.getMailDomain()) || "139.com");
				}
				this.textboxView.setValue("");
				this.insertItem(value);
				if (this.inputAssociateView) {
					this.inputAssociateView.render(); // add by tkh 
				}
				if (this.inputCorrectView) {
					this.inputCorrectView.render(); //add by yly
				}
				this.focus();
			}
		},

		/**
		 *移动文本框到
		 *@inner
		 */
		moveTextBoxTo: function(insertElement, isAfter) {
			if (!insertElement) return;
			if (isAfter) {
				insertElement.after(this.textboxView.el);
			} else {
				insertElement.before(this.textboxView.el);
			}
			window.focus();
			this.jTextBox.focus();
		},

		/**
		 *移动文本框到末尾
		 *@inner
		 */
		moveTextBoxToLast: function() {
			var el = this.textboxView.el;
			if (el.parentNode.lastChild != el) {
				el.parentNode.appendChild(el);
			}
			if ($.browser.msie) window.focus();
			//textbox.focus();
		},

		/**
		 *移除成员数据
		 *@inner
		 */
		disposeItemData: function(item) {
			var items = this.items;
			delete items[item.itemId];

			//重新建立map，而不是直接删除key，因为有可能存在key相同的item
			this.hashMap = {};

			for (var id in items) {
				var item = items[id];
				if (!item.error) {
					this.hashMap[item.hashKey] = true;
				}
			}

			this.onItemChange();
		},
		/**
		 *根据鼠标移动的起始点和结束点，得到划选的成员
		 *@inner
		 */
		trySelect: function(p1, p2) {
			var startElement;
			var topPosition, bottomPosition;
			var elements;
			var itemHeight;
			var itemObj;

			if (p1.y == p2.y) {
				if (p1.x == p2.x) return;
				topPosition = Math.min(p1.x, p2.x);
				bottomPosition = Math.max(p1.x, p2.x);
			} else if (p1.y < p2.y) {
				topPosition = p1;
				bottomPosition = p2;
			} else {
				topPosition = p2;
				bottomPosition = p1;
			}

			elements = this.jContainer.find(this.itemPath);

			if (elements.length > 0) {
				itemHeight = elements.eq(0).height();
			}

			for (var i = 0; i < elements.length; i++) {
				var element = elements.eq(i);
				var offset = element.offset();
				var x = offset.left + element.width();
				var y = offset.top + itemHeight;
				var selected = false;

				if (!startElement) {
					if ((topPosition.x < x && topPosition.y <= y) || (y - topPosition.y >= itemHeight)) {
						startElement = element;
						selected = true;
					}
				} else if (bottomPosition.x > offset.left && bottomPosition.y > offset.top) {
					selected = true;
				} else if (bottomPosition.y - offset.top > itemHeight) {
					selected = true;
				}
				itemObj = this.items[element.attr("rel")];
				if (selected) {
					itemObj.selected == false && itemObj.select();
				} else {
					itemObj.unselect();
				}
			}
		},

		itemIdNumber: 0,
		/**
		 *返回下一个子项的id
		 *@inner
		 */
		getNextItemId: function() {
			return this.itemIdNumber++;
		},
		/**
		 *设置提示文本
		 */
		setTipText: function(text) {
			this.model.set("placeHolder", text);
		},
		/**
		 * 显示默认文本
		 * todo 是否调用太频繁了
		 */
		switchTipText: function() {
			if (this.textbox.value == "" && !this.hasItem()) {
				var text = this.model.get("placeHolder");
				this.$(".PlaceHold").show().text(text);
			} else {
				this.$(".PlaceHold").hide();
			}
		},
		/**
		 *输入组件获得焦点
		 */
		focus: function() {
			//if (document.all) {
			try {
				//当元素隐藏的时候focus会报错
				this.textbox.focus();
			} catch (e) {}
			//} else {
			//this.textbox.select(); //select焦点不会自动滚动到文本框
			//}
		},
		/**
		 *返回组件是否有输入值
		 *@returns {Boolean}
		 */
		hasItem: function() {
			return this.getItems().length > 0;
		},

		/**
		 *返回组件输入的所有地址
		 */
		getAddrItems: function() {
			var items = this.getItems();
			var result = [];
			for (var i = 0; i < items.length; i++) {
				if (!items[i].error) {
					result.push(items[i].addr);
				}
			}
			return result;
		},

		/**
		 *返回组件输入的所有地址（正确的）
		 */
		getValidationItems: function() {
			var items = this.getItems();
			var result = [];
			for (var i = 0; i < items.length; i++) {
				if (!items[i].error) {
					result.push(items[i].allText);
				}
			}
			return result;
		},

		/**
		 *返回第一个格式非法的输入文本
		 *@returns {String}
		 */
		getErrorText: function() {
			var item = this.getErrorItem();
			return item && item.allText;
		},
		/**
		 *@inner
		 */
		getErrorItem: function() {
			var items = this.getItems();
			for (var i = 0; i < items.length; i++) {
				if (items[i].error) {
					return items[i];
				}
			}
			return null;
		},

		getClickItemId: function(e) {
			var jEl = $(e.target).closest(this.itemPath);
			return jEl.length ? jEl.attr("rel") : null;
		},

		/**
		 *键盘按下
		 *@inner
		 */
		onKeyDown: function(e) {
			var Keys = M139.Event.KEYCODE;

			if (e.target.tagName == "INPUT" && e.target.value != "") {
				return;
			}
			if (e.keyCode == Keys.A && e.ctrlKey || e.keyCode == Keys.BACKSPACE) {
				e.preventDefault();
			}

			switch (e.keyCode) {
			case Keys.BACKSPACE:
			case Keys.DELETE:
				if(!e.ctrlKey && !e.shiftKey && !e.altKey){
					var selecteds = this.getSelectedItems();
					if (selecteds.length > 0) {
						this.moveTextBoxTo(selecteds[0].$el);
					}
					this.removeSelectedItems();
					window.focus();
					this.jTextBox.focus();
				}
				break;
			case Keys.A:
				if (e.ctrlKey) this.selectAll(e);
				break;
			case Keys.C:
				if (e.ctrlKey) this.copy(e);
				break;
			case Keys.X:
				if (e.ctrlKey) this.cut(e);
				break;
			case Keys.V:
				if (e.ctrlKey) this.paste(e);
				break;
			default:
				break;
			}
		},
		/**
		 *鼠标点击
		 *@inner
		 */
		onClick: function(e) {
			//console.log("onclick");
			if (!$(e.target).hasClass("ItemContainer")) {
				//console.log("click not processed.");
				return; // 只处理点击控件空白地方
			}

			var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
				richInputBox: this,
				x: e.clientX,
				y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
			});
			//console.log(nearItem);
			if (nearItem) {
				this.moveTextBoxTo(nearItem.element, nearItem.isAfter);
			} else {
				this.textbox.focus();
			}
		},

		onMouseUp: function(e) {
			var clickItem, items;
			var itemId = this.getClickItemId(e);

			$(document.body).off("mousemove", this.proxyMouseMove);
			delete this.proxyMouseMove;

			if(this.moveStartCount >= 3) {
				return;		// 拖动后松开鼠标，无操作
			}

			if (itemId) {
				clickItem = this.items[itemId];
				// todo 点击删除为何不触发onClick？
				if($(e.target).hasClass("addrBase_close")) {
					this.unselectAllItems();
					clickItem.remove();
					clickItem.addDistinctBehavior("contact_click_remove");
				} else if (!e.ctrlKey && !e.shiftKey) {
					items = this.getSelectedItems();

					//if ($.inArray(clickItem, items) == -1) {
					if (!this.selectArea && this.lastClickItem === clickItem) {
						this.unselectAllItems();
						clickItem.selected == false && clickItem.select();
					}
					//}

					if ($.browser.msie) {
						M2012.UI.RichInput.Tool.captureElement = e.target;
						e.target.setCapture();
					} else {
						// todo remove
						//window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					}
				}
			}
			this.selectArea = false;
		},

		/**
		 *鼠标按下
		 *@inner
		 */
		onMouseDown: function(e) {
			var target = e.target;
			var RichInput = M2012.UI.RichInput;

			e.stopPropagation();

			RichInput.Tool.currentRichInputBox = this;
			for (var i = 0; i < RichInput.instances.length; i++) {
				var box = RichInput.instances[i];
				if (box !== this && $(box.container).is(":visible")) {
					box.unselectAllItems();
				}
			}

			// 跳过这些元素，以保持编辑状态（蹲坑，终于看明白了...）
			// todo 让textbox停止冒泡就可以了...
			if (target.tagName == "INPUT" || 
				target.className == "addnum" || 
				target.parentNode.className == "addnum" || 
				target.className == "addrDomainCorrection" || 
				target.parentNode.className == "addrDomainCorrection" || 
				target.parentNode.parentNode.className == "addrDomainCorrection") {
				return;
			}

			var itemId = this.getClickItemId(e);

			this.startPosition = {
				x: e.clientX,
				y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
			};

			this.proxyMouseMove = $.proxy(this, "onMouseMove");
			$(document.body).on("mousemove", this.proxyMouseMove);

			if (itemId) {

				// 在联系人组件上按下才有拖动操作
				M2012.UI.RichInput.Tool.dragEnable = true;

				items = this.getSelectedItems();

				clickItem = this.items[itemId];

				if (e.ctrlKey) {
					clickItem.selected ? clickItem.unselect() : clickItem.select();
				} else if (e.shiftKey) {
					this.shiftSelectItem(clickItem);
				} else {
					this.lastClickItem = clickItem;
					if(clickItem.selected == false) {
						this.unselectAllItems();
						clickItem.select();
					}
				}

				// todo 这段的逻辑未整理好
				if (this.editMode == true) {
					this.createItemFromTextBox();
				}
				this.moveTextBoxToLast();
				this.focus();
				M139.Event.stopEvent(e);	// todo why ?
			} else {
				if (target == this.el || $.contains(this.el, target)) {
					if (!e.ctrlKey) {
						this.unselectAllItems();
					}
					this.selectArea = true;
					if (this.editMode == false) {
						this.createItemFromTextBox();
					}
					this.moveTextBoxToLast();
					//console.log("--------- select area --------------");
					this.focus();
				}
			}

			this.moveStartCount = 0;
			M2012.UI.RichInput.Tool.dragItems = this.getSelectedItems();
			M2012.UI.RichInput.Tool.currentRichInputBox = this;
		},

		/*
		* bug fixed: 
		* 鼠标点击时同时设置编辑光标的位置，会触发不必要的mousemove事件
		* 只能在mousedown状态下添加mousemove事件
		*/
		onMouseMove: function(e) {
			var tool = this.tool;

			if (this.editMode) return;

			this.moveStartCount++;

			// fix: IE8 iframe在mousedown时就触发mousemove，导致数据处理出错
			if (this.moveStartCount < 3) {
				return;
			}

			var p = {
				x: e.clientX,
				y: e.clientY + tool.getPageScrollTop(),
				target: e.target
			};

			e.preventDefault();

			if (tool.dragEnable) {
				// console.log("mouse moved, delay draweffect");
				tool.drawDragEffect(p);
				tool.delay("drawInsertFlag", function() {
					tool.drawInsertFlag(p);
				}, 20);
			} else if (this.selectArea) { // 点击空白处划选联系人
				//M2012.UI.RichInput.Tool.draw(this.startPosition, p);
				//console.log("moving...try Select");
				this.trySelect(this.startPosition, p);
			}
		},

		//按住shift选中
		shiftSelectItem: function(item) {
			var lastClickItem = this.lastClickItem;
			if (!lastClickItem || lastClickItem == item) return;
			var items = this.getItems();
			var a = $.inArray(lastClickItem, items);
			var b = $.inArray(item, items);
			var min = Math.min(a, b);
			var max = Math.max(a, b);

			$(items).each(function(index) {
				if (index >= min && index <= max) {
					this.select();
				} else {
					this.unselect();
				}
			});
		},

		showErrorDomain: function(errorDomain) {
			var items = this.items;
			var item = '';
			for (var p in items) {
				item = items[p];
				if (item.domain == errorDomain) {
					item.trigger('errorDomain');
				}
			}
		},
		changItemDomain: function(errorDomain, domain) {
			var items = this.items;
			var item = '';
			for (var p in items) {
				item = items[p];
				if (item.domain == errorDomain) {
					item.trigger('changeDomain', {
						errorDomain: errorDomain,
						domain: domain
					});
				}
			}
		}
	}));


	var instances = M2012.UI.RichInput.instances = [];
	M2012.UI.RichInput.getInstanceByContainer = function(element) {
		for (var i = 0; i < instances.length; i++) {
			var o = instances[i];
			if (o.container === element || o.jContainer === element) return o;
		}
		return null;
	}

	//工具类
	M2012.UI.RichInput.Tool = {
		getPageScrollTop: function() {
			return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		},
		//元素不可选中（禁用浏览器原生选中效果）
		unselectable: function(element) {
			if ($.browser.msie) {
				element.unselectable = "on";
			} else {
				element.style.MozUserSelect = "none";
				element.style.KhtmlUserSelect = "none";
			}
		},
		resizeContainer: function(element, autoHeight) {
		},
		//根据坐标获取最接近的item
		getNearlyElement: function(param) {
			var box = param.richInputBox;
			var overElemet;
			var isAfter = true;
			var jElements = box.jContainer.find(box.itemPath);
			var rowsElements = [];
			var _x, _y, jElement;
			var elementHeight = jElements.eq(0).height();

			//得到当前坐标所在行的元素
			for (var i = 0; i < jElements.length; i++) {
				jElement = jElements.eq(i);
				_y = jElement.offset().top;
				if (param.y > _y && param.y < _y + elementHeight) {
					rowsElements.push(jElement);
				}
			}

			//获得插入点
			for (var i = 0; i < rowsElements.length; i++) {
				jElement = rowsElements[i];
				_x = jElement.offset().left;
				if (param.x < _x + jElement.width() / 2) {
					overElemet = jElement;
					isAfter = false;
					break;
				}
				overElemet = jElement;
			}
			if (overElemet) {
				return {
					element: overElemet,
					isAfter: isAfter
				};
			} else {
				return null;
			}
		},
		bindEvent: function(richInputBox, element, events) {
			for (var eventName in events) {
				var func = events[eventName];
				element.bind(eventName, (function(func) {
					return (function(e) {
						e.richInputBox = richInputBox;
						return func.call(this, e);
					});
				})(func));
			}
		},
		draw: function(p1, p2) {
			if (!window.drawDiv) {
				window.drawDiv = $("<div style='position:absolute;left:0px;top:0px;border:1px solid blue;'></div>").appendTo(document.body);
			}
			var width = Math.abs(p1.x - p2.x);
			var height = Math.abs(p1.y - p2.y);
			drawDiv.width(width);
			drawDiv.height(height);
			drawDiv.css({
				left: Math.min(p1.x, p2.x),
				top: Math.min(p1.y, p2.y)
			});
		},
		//伪剪贴板对象
		Clipboard: {
			setData: function(arr) {
				var txtGhost = $("<input type='text' style='width:1px;height:1px;overflow:hidden;position:absolute;left:0px;top:0px;'/>").appendTo(document.body).val(arr.join(";")).select();
				setTimeout(function() {
					txtGhost.remove();
				}, 0);
			}
		},
		hidDragEffect: function() {
			if (this.dragEffectDiv) this.dragEffectDiv.hide();
		},
		//拖拽的时候效果
		drawDragEffect: function(p) {
			if (!this.dragEffectDiv) {
				this.dragEffectDiv = $("<div style='position:absolute;\
				border:2px solid #444;width:7px;height:8px;z-index:5000;overflow:hidden;'></div>").appendTo(document.body);
			}
			this.dragEffectDiv.css({
				left: p.x + 4,
				top: p.y + 10,
				display: "block"
			});
		},
		hidDrawInsertFlag: function() {
			if (this.drawInsertFlagDiv) this.drawInsertFlagDiv.hide();
		},
		//插入效果（游标）
		drawInsertFlag: function(p) {
			var hitRichInputBox, rich, offset, nearItem;
			if (!this.drawInsertFlagDiv) {
				this.drawInsertFlagDiv = $("<div style='position:absolute;\
				background-color:black;width:2px;background:black;height:15px;z-index:5000;overflow:hidden;border:0;'></div>").appendTo(document.body);
			}
			//ie9,10和火狐，拖拽的时候 mousemove e.target始终等于按下的那个元素，所以只能用坐标判断
			// todo ...
			if (($B.is.ie && $B.getVersion() > 8) || $B.is.firefox) {
				for (var i = M2012.UI.RichInput.instances.length - 1; i >= 0; i--) {
					rich = M2012.UI.RichInput.instances[i];
					if (!M139.Dom.isHide(rich.el, true) && p.y > rich.$el.offset().top) {
						hitRichInputBox = rich;
						break;
					}
				}
			} else {
				for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
					rich = M2012.UI.RichInput.instances[i];
					if (M2012.UI.RichInput.Tool.isContain(rich.container, p.target)) {
						hitRichInputBox = rich;
						break;
					}
				}
			}
			// todo 暂时禁止掉内部拖动排序
			if (hitRichInputBox/* && hitRichInputBox !== this*/) {
				nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
					richInputBox: hitRichInputBox,
					x: p.x,
					y: p.y
				});
			}
			if (nearItem) {
				offset = nearItem.element.offset();
				this.drawInsertFlagDiv.css({
					left: offset.left + (nearItem.isAfter ? (nearItem.element.width() + 2) : -2),
					top: offset.top + 4,
					display: "block"
				});
				this.insertFlag = {
					nearItem: nearItem,
					richInputBox: hitRichInputBox
				};
			} else {
				this.insertFlag = {
					richInputBox: hitRichInputBox
				};
			}
		},
		isContain: function(pNode, cNode) {
			while (cNode) {
				if (pNode == cNode) return true;
				cNode = cNode.parentNode;
			}
			return false;
		},
		delay: function(key, func, interval) {
			if (!this.delayKeys) this.delayKeys = {};
			if (this.delayKeys[key]) {
				clearTimeout(this.delayKeys[key].timer);
			}
			this.delayKeys[key] = {};
			this.delayKeys[key].func = func;
			var This = this;
			this.delayKeys[key].timer = setTimeout(function() {
				This.delayKeys[key] = null;
				func();
			}, interval || 0);
		},
		fireDelay: function(key) {
			if (!this.delayKeys || !this.delayKeys[key]) return;
			this.delayKeys[key].func();
			clearTimeout(this.delayKeys[key].timer);
		},
		hideBlinkBox: function(tipObj, time) {
			if (typeof(time) != 'number') time = 5000;
			var This = this;
			if (This.keep) clearTimeout(This.keep);
			This.keep = setTimeout(function() {
				tipObj.hide();
			}, time);
		},
		blinkBox: function(obj, className) {
			var This = this;
			obj.addClass(className);
			var keep;
			var loop = setInterval(function() {
				if (keep) clearTimeout(keep);
				obj.addClass(className);
				keep = setTimeout(function() {
					obj.removeClass(className);
				}, 100);
			}, 200);
			setTimeout(function() {
				if (loop) clearInterval(loop);
			}, 1000);
		}
	}


	//暂放至此 数组扩展 去重
	Array.prototype.distinct = function() {
		var filtered = [];
		var obj = {};
		for (var i = 0; i < this.length; i++) {
			if (!obj[this[i]]) {
				obj[this[i]] = 1;
				filtered.push(this[i]);
			}
		}
		return filtered;
	};


	// 排序 
	Array.prototype.ASC = function() {
		return this.sort(function(a, b) {
			if (a.localeCompare(b) > 0) return 1;
			else return -1;
		});
	}

	/**@lends M2012.UI.RichInput*/
	$.extend(M2012.UI.RichInput, {
		/**
		 *创建富收件人文本框实例
		 *@param {Object} options 参数集合
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@param {HTMLElement} options.container 组件的容器
		 *@param {Number} options.maxSend 最大接收人个数，默认为50
		 *@param {Number} options.preventAssociate 是否屏蔽推荐收件人功能
		 *@param {Number} options.preventCorrect 是否屏蔽域名纠错功能
		 *@param {Number|Function} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
		 */
		create: function(options) {
			var plugins = [];
			plugins.push(M2012.UI.RichInput.Plugin.AddrSuggest);
			options.plugins = plugins;
			var view = new M2012.UI.RichInput.View(options);
			if (!options.preventAssociate && top.$App) {
				view.inputAssociateView = new M2012.UI.Suggest.InputAssociate({
					richInputBox: view
				}); // add by tkh 地址输入框联想组件
			}
			if (!options.preventCorrect && top.$App && M2012.UI.Suggest.InputCorrect) {
				view.inputCorrectView = new M2012.UI.Suggest.InputCorrect({
					richInputBox: view
				});
			}
			if (options.noUpgradeTips) {
				view.noUpgradeTips = true;
			} else {
				view.noUpgradeTips = false;
			}
			return view;
		}
	});

})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义弹出菜单组件
 */

 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.PopMenu",superClass.extend(
 /**
  *@lends M2012.UI.PopMenu.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.PopMenu
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {Array} options.itemsContainerPath 定义子项的容器路径
    *@param {Array} options.items 定义子项内容
    *@param {String} options.itemsPath 定义子项节点路径
    *@param {String} options.itemsTemplate 定义子项html模板
    *@param {String} options.itemsContentPath 定义内dock容显示的位置
    *@param {String} options.splitLineTemplate 定义分割线的html模板
    *@param {String} options.subMenuIconTemplate 子菜单箭头图标
    *@param {String} options.subMenuIconInsertPath 子菜单箭头插入的位置
    *@param {String} options.subMenuInsertPath 定义子菜单插入的父元素的位置
    *@param {Number} options.scrollCount 定义最多到几个菜单项的时候出现滚动条，默认为15
    *@param {Number} options.maxHeight 定义菜单最多到多少像素高的时候出现垂直滚动条，默认240
    *@example
    */
    initialize: function (options) {
        var customClass = options.customClass || "";
        var customStyle = options.customStyle || "";
        options.template = options.template.replace("{customClass}", customClass);
        options.template = options.template.replace("{customStyle}", customStyle);
        var $el = jQuery(options.template);
        this.setElement($el);
        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.PopMenu",
    /**构建dom函数*/
    render:function(){
        var This = this;
        var options = this.options;
        var items = options.items;

        var itemContainer = options.itemsContainerPath ? this.$el.find(options.itemsContainerPath):this.$el;
        var itemCount = 0;

        if (options.selectMode) {
            this.$el.addClass(options.selectModeClass);
        }

        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(item.isLine){
                itemContainer.append(options.splitLineTemplate);
            }else{
                var node = jQuery(options.itemsTemplate).appendTo(itemContainer);

                if(item.text){
                    node.find(options.itemsContentPath).text(item.text);
                } else if (item.html) {
                    if (item.highlight == false) { //非高亮状态，不生成a:hover样式
                        node.html(item.html);
                    } else {
                        node.find(options.itemsContentPath).html(item.html);
                    }
                }

                if (options.selectMode) {
                    node.find(options.subMenuIconInsertPath).prepend(options.selectIconTemplate);
                }

                if(item.items && item.items.length){
                    //插入有子菜单的右箭头
                    node.find(options.subMenuIconInsertPath).append(options.subMenuIconTemplate);
                    node.attr("submenu","1");
                }
                node.attr("index",i);
                itemCount ++ ;
            }
        }

        this.on("print",function(){
            //判断是否要出滚动条
            if(itemCount > (options.scrollCount || 15) || this.getHeight() > options.maxHeight){
                this.$el.css({
                    "overflow-x":"hidden",
                    "overflow-y":"scroll",
                    "height":(options.maxHeight || 310)
                });
            }
            //处理溢出界面
            if (this.options.parentMenu) {
                var offset = this.$el.offset();
                var bottom = offset.top + M139.Dom.getElementHeight(this.$el);
                var moreTop = bottom - $(document.body).height()+10;
                if (moreTop > 0) {
                    this.$el.css("top", -moreTop + "px");
                }
            }
        });

        this.$el.find(options.itemsPath).mouseover(function(){
            This.onMenuItemMouseOver(this);
        }).click(function (e) {
            var obj = e.target;
            var isThisMenu = M139.Dom.containElement(This.el, obj);
            //子菜单的容器在菜单项里，这里要排除子菜单的点击
            if (isThisMenu) {
                This.$el.find("ul div *").each(function () {
                    if (this == obj) {
                        isThisMenu = false;
                    }
                });
            }
            if (isThisMenu) {
                This.onMenuItemClick(this);
            }

            e.stopPropagation();
            if ($.browser.msie && $.browser.version <= 7) { // update by tkh IE67 阻止浏览器的默认行为，解决bug：回复转发打开空白写信页
                e.preventDefault();
            }
        });

		if(options.hideInsteadOfRemove) {
	        this.on("itemclick", function () {
	            this.hide();
	        });
		} else {
	        this.on("itemclick", function () {
	            this.remove();
	        });
        }

        return superClass.prototype.render.apply(this, arguments);
    },
    /**@inner*/
    getItemByNode:function(node){
        return this.options.items[node.getAttribute("index")];
    },
    /**@inner*/
    onMenuItemClick:function(node){
        var index = node.getAttribute("index");
        if(!index) return;
        index = index | 0;
        var item = this.getItemByNode(node);
        if (jQuery.isFunction(item.onClick)) {
            item.onClick(item);
        }
        if (jQuery.isFunction(this.options.onItemClick)) {
            this.options.onItemClick(item, index);
        }
        this.trigger("itemclick", item, index);
    },

    /**移除菜单*/
    remove:function(){
        this.removeSubMenu();
        superClass.prototype.remove.apply(this,arguments);
    },

    selectItem:function(index){
	    var options = this.options;
        this.$(options.itemsPath).removeClass(options.selectedClass).eq(index).addClass(options.selectedClass);
    },

    /**
     *鼠标移动到菜单项上面，需要显示子菜单
     *@inner
     */
    onMenuItemMouseOver: function (node) {
        var This = this;
        if (node.getAttribute("submenu")) {
            var item = this.getItemByNode(node);
            this.trigger("itemMouseOver", item);
            //创建子菜单
            if (item.menu && this.subMenu == item.menu) {
                return;
            } else {
                var op = jQuery.extend({}, this.options);
                op.items = item.items;
                op.parentMenu = this;
                
                var left = op.width ?  parseInt(op.width) : 150;
                var _top = -5;

                if (op.width2) { op.width = op.width2;} //二级菜单支持独立宽度
                item.menu = new M2012.UI.PopMenu(op);
                /*
                if (menu.$el.height() + top > $(document.body).height()) {
                    options.top = top - menu.$el.height();
                }
                if (menu.$el.width() + left > $(document.body).width()) {
                    options.left = left - menu.$el.width();
                }*/


                this.trigger("subItemCreate", item);
                var $el = item.menu.render().get$El();
                var offset = this.$el.offset();
                if (offset.left > $(document.body).width() / 2) {
                    left = -$el.width();
                }

                $el.appendTo(node).css({
                    left: left+"px",
                    top: _top+"px"
                });

                item.menu.on("remove", function () {
                    item.menu = null;
                }).on("itemclick", function () {
                    This.remove();
                });
            }
            //一个菜单只能同时显示一个子菜单
            this.removeSubMenu();
            this.subMenu = item.menu;
        } else {
            this.removeSubMenu();
        }
    },

    show: function(){
	    var This = this;
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:this.el,
            callback: function(){This.hide()}
        });
	    superClass.prototype.show.apply(this, arguments);
    },

    hide: function(){
	    $D.unBindAutoHide({element: this.el});
	    superClass.prototype.hide.apply(this, arguments);
    },
    
    /**
     *移除子菜单
     *@inner
     */
    removeSubMenu:function(){
        if(this.subMenu){
            try {
                this.subMenu.remove();
                this.subMenu = null;
            }catch(e){}
        }
    }
}
));

var DefaultMenuStyle = {
    template: ['<div class="menuPop shadow {customClass}" style="top:0;left:0;z-index:9001;{customStyle}">',
       '<ul>',
       '</ul>',
    '</div>'].join(""),
    splitLineTemplate:'<li class="line"></li>',
    itemsContainerPath:"ul",
    itemsPath:"ul > li",
    itemsTemplate: '<li><a href="javascript:;"><span class="text"></span></a></li>',
    itemsContentPath: 'a > span',
    subMenuIconTemplate: '<i class="i_triangle_h"></i>',
    selectModeClass: "menuPops",
    selectedClass: "cur",
    selectIconTemplate: '<i class="i_b_right"></i>',
    subMenuIconInsertPath:'a'
};


jQuery.extend(M2012.UI.PopMenu,
 /**
  *@lends M2012.UI.PopMenu
  */
{
    /**
    *使用常规的样式创建一个菜单实例
    *@param {Object} options 参数集合
    *@param {Array} options.items 菜单项列表
    *@param {HTMLElement} options.container 可选参数，父元素，默认是添加到body中
    *@param {String} options.top 坐标
    *@param {String} options.left 坐标
    *@example
    M2012.UI.PopMenu.create({
        items:[
            {
                text:"标已读",
                onClick:function(){
                    alert("标已读");
                }
            },
            {
                text:"标未读",
                onClick:function(){}
            },
            {
                isLine:true
            },
            {
                text:"标签",
                items:[
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#369;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签1&lt;/span&gt;',
                        onClick:function(){}
                    },
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#F60;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签2&lt;/span&gt;',
                        onClick:function(){}
                    }
                ]
            },
        ],
        onItemClick:function(item){
            alert("子项点击");
        }
    });
    */
    create:function(options){
        if(!options || !options.items){
            throw "M2012.UI.PopMenu.create:参数非法";
        }
        options = _.defaults(options,DefaultMenuStyle);
        var menu = new M2012.UI.PopMenu(options);
        menu.render().$el.appendTo(options.container || document.body).css("visibility","hidden");
        if (options.dockElement) {
            setTimeout(function () {
                M139.Dom.dockElement(options.dockElement, menu.$el, { direction: options.direction, dx: options.dx, dy: options.dy });
                menu.$el.css("visibility", "");
            }, 0);
        } else {
            var top = parseInt(options.top);
            var left = parseInt(options.left);
            if (menu.$el.height() + top > $(document.body).height()) {
                options.top = top - menu.$el.height();
            }
            if (menu.$el.width() + left > $(document.body).width()) {
                options.left = left - menu.$el.width();
            }
            menu.$el.css({
                left: options.left || 0,
                top: options.top || 0
            });
            menu.$el.css("visibility", "");
        }

        //点击页面其它地方自动隐藏
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:menu.el,
            callback: options.hideInsteadOfRemove ? function(){menu.hide()} : function(){menu.remove()}
        });

        return menu;
    },
    /**当点击时自动创建菜单
    */
    createWhenClick: function (options,createCallback) {
        if (!options || !options.target) {
            throw "必须包含options.target，表示被点击的元素";
        }
        $(options.target).click(function (e) {
            if (!options.dockElement) {
                options.dockElement = $(options.target);
            }
            var menu = M2012.UI.PopMenu.create(options);
            if (createCallback) {
                createCallback(menu);
            }
        });
            
        
    },


    bindAutoHide:function(options){
        return $D.bindAutoHide(options);
    },

    unBindAutoHide: function (options) {
        return $D.unBindAutoHide(options);
    }
    
});

})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义日历控件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Calendar", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Calendar.prototype
      */
    {
        /** 日历选择组件
        *@constructs M2012.UI.Picker.Calendar
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@param {Boolean} options.stopPassDate 是否禁选过去时间，默认是false
        *@example
        */
        initialize: function (options) {
            options = options || {};

            this.stopPassDate = options.stopPassDate;

            if (options.value) {
                if (this.stopPassDate) {
                    var now = new Date;
                    this.value = now > options.value ? now : options.value;
                } else {
                    this.value = options.value;
                }
            } else {
                this.value = new Date;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.Calendar",
        template:['<div class="dayControl" style="position:absolute;z-index:9999;background-color:white">',
             '<div class="dayControlTitle">',
                 '<a href="javascript:;" class="upYear UpMonth"></a>',
                 '<a href="javascript:;" class="upMonth UpYear"></a>',
                 '<span class="MonthLabel"></span>',
                 '<a href="javascript:;" class="downYear DownYear"></a>',
                 '<a href="javascript:;" class="downMonth DownMonth"></a>',
             '</div>',
             '<div class="dayControlNo"></div>',
             '<table>',
                 '<thead>',
                 '<tr>',
                     '<th>日</th>',
                     '<th>一</th>',
                     '<th>二</th>',
                     '<th>三</th>',
                     '<th>四</th>',
                     '<th>五</th>',
                     '<th>六</th>',
                 '</tr>',
                 '</thead>',
                 '<tbody>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),
        events:{
            "click a.UpYear": "onPrevYearClick",
            "click a.DownYear":"onNextYearClick",
            "click a.UpMonth":"onPrevMonthClick",
            "click a.DownMonth":"onNextMonthClick",
            "click td":"onDateClick"
        },
        render:function(){
            this.updateContent(this.value);
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *@inner
         */
        onPrevYearClick: function () {
            if (this.stopPassDate) {
                var prevYear = new Date(this.curValue);
                prevYear.setFullYear(prevYear.getFullYear() - 1);
                if (this.compareMonth(new Date,prevYear) > 0) {
                    return;
                }
            }
            this.curValue.setFullYear(this.curValue.getFullYear() - 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextYearClick:function(){
            this.curValue.setFullYear(this.curValue.getFullYear() + 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onPrevMonthClick: function () {
            if (this.stopPassDate && this.isCurrentMonth(this.curValue)) {
                //禁选过去月
                return;
            }

            this.curValue.setDate(0);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextMonthClick:function(){
            this.curValue.setDate(32);
            this.updateContent(this.curValue);
        },

        /**
         *日期变更后刷新html
         *@inner
         */
        updateContent: function (date) {
            this.$("tbody").html(this.getCalendarHTML(date));
            this.$(".MonthLabel").text(date.format("yyyy-MM"));
            this.curValue = new Date(date);
            this.focusSelectedCell(date);
        },


        /**
         *让选中的日期单元格高亮
         *@inner
         */
        focusSelectedCell:function(){
            this.$("td.on").removeClass("on");
            var date = this.value.getDate();
            this.$("td[rel='" + date + "']").addClass("on");
        },

        /**@inner*/
        onDateClick:function(e){
            var td = e.target;
            var date = td.innerHTML;
            
            if(/\d+/.test(date)){
                var selDate = new Date(this.curValue);
                selDate.setDate(date);

                if (this.stopPassDate) {
                    var now = new Date();
                    if (!M139.Date.isSameDay(now, selDate) && now > selDate) {
                        return;
                    }
                }

                this.value = selDate;
                this.focusSelectedCell();
                this.onSelect(selDate);
                this.hide();
            }
        },

        //是否过去的月份
        compareMonth:function(date1,date2){
            if (date1.getFullYear() > date2.getFullYear()) {
                return 1;
            } else if (date1.getFullYear() < date2.getFullYear()) {
                return -1;
            } else {
                return date1.getMonth() - date2.getMonth();
            }
        },

        //是否本月
        isCurrentMonth: function (date) {
            var now = new Date();
            return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
        },

        /**根据日期获得日期区域的html内容*/
        getCalendarHTML:function(date){
            var days = M139.Date.getDaysOfMonth(date);
            var firstMonthDay = M139.Date.getFirstWeekDayOfMonth(date);
            var htmlCode = [];
            var cellsCount = days + firstMonthDay ;

            //是否禁选过去时间
            var stopPassDate = this.stopPassDate;
            var passMonth = this.compareMonth(new Date(),date);
            var today = new Date().getDate();

            htmlCode.push("<tr>");
 
            for(var i=1,j=1;i<=cellsCount;i++,j++){
                if(i>firstMonthDay && j<=days){
                    htmlCode.push("<td rel='" + j + "' " + getColor(j) + ">" + j + "</td>");
                }else{
                    htmlCode.push("<td></td>");
                    j--;
                }
                if(i%7 == 0 || i==cellsCount){
                    htmlCode.push("</tr>");
                }
            }
            function getColor(date) {
                if (!stopPassDate) return "";
                var disableColor = 'style="color:silver;"';
                if (passMonth > 0) {
                    return disableColor;
                } else if (passMonth < 0) {
                    return "";
                }else{
                    return date < today ? disableColor : "";
                }
            }
            return htmlCode.join("");
        }
    }
    ));

    jQuery.extend(M2012.UI.Picker.Calendar , {
        create : function(options){
            var calendar = new M2012.UI.Picker.Calendar(options);
            return calendar;
        }
    });

})(jQuery, _, M139);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.ValidateTip";

    M139.namespace(_class, superClass.extend({

        defaults: {

            //目标元素
            //需要在其上显示提示信息的$(dom)
            target: null,

            //提示内容
            content: "",

            //提示框的默认宽度
            width: 80
        },

        //当前控件
        curentEl: null,


        /**
         *  消息弹出提醒控件
         *  @param {Object} args.target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} args.content  消息内容
         *  @param {Int} args.width 弹出框宽度
        **/
        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.target)
                self.target = args.target;

            if (args.content)
                self.content = args.content;

            if (args.width && $.isNumeric(args.width))
                self.width = args.width;

            self.render();

            self.initEvents();
        },

        initEvents: function () {

            this.curentEl.bind('blur', function () {
                M2012.Calendar.View.ValidateTip.hide();
            });
        },

        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid,
                content: self.content,
                width: self.width
            });

            self.curentEl = $(html).appendTo($(document.body));
        },

        /**
         * 更新提示内容
         */
        updateContent: function (content) {

            $('#' + this.cid + '_content').html(content);
        },

        setPositon: function (el) {

            var self = this;

            if (!el) return;

            var offset = $(el).offset();
            var left = offset.left;

            var height = self.curentEl.height();
            var top = offset.top - height - 15;
            self.curentEl.css({ left: left, top: top });
            self.curentEl.focus();
        },

        template: [
            "<div id=\"{cid}_wrap\" class=\"tips\" tabindex=\"0\" hidefocus=\"true\" style=\"position:absolute;outline:none;left:20px;top:-1000px;width:{width}px;display:'';z-index:9999;\">",
                "<div class=\"tips-text\"  id=\"{cid}_content\">{content}</div>",
			    "<div class=\"tipsBottom  diamond\" style=\"left:10px\"></div>",
           "</div>"
        ].join("")
    }, {

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        /**
         *  消息弹出提醒控件 此方法供外部调用
         *  @param {Object} target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} text  消息内容
         *  @param {Boolean} isAutoHide 是否自动消失
        **/
        show: function (text, target, isAutoHide) {
            var self = this;
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip({});
            }

            var control = $Cal_Validate_Tip;
            //更新界面内容
            control.updateContent(text);
            //设置位置
            control.setPositon(target);
            if (isAutoHide) {
                setTimeout(function () {
                    M2012.Calendar.View.ValidateTip.hide();
                }, 5000);//5s消失
            }
        },

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        hide: function () {
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip({});
            }
            window.$Cal_Validate_Tip.curentEl.css({ left: '-1000px' });
        }
    }));


})(jQuery, _, M139, window._top || window.top)
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.ValidateTip.Bottom";

    M139.namespace(_class, superClass.extend({

        defaults: {

            //目标元素
            //需要在其上显示提示信息的$(dom)
            target: null,

            //提示内容
            content: "",

            //提示框的默认宽度
            width: 80
        },

        //当前控件
        curentEl: null,


        /**
         *  消息弹出提醒控件
         *  @param {Object} args.target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} args.content  消息内容
         *  @param {Int} args.width 弹出框宽度
        **/
        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.target)
                self.target = args.target;

            if (args.content)
                self.content = args.content;

            if (args.width && $.isNumeric(args.width))
                self.width = args.width;

            self.render();

            self.initEvents();
        },

        initEvents: function () {

            this.curentEl.bind('blur', function () {
                M2012.Calendar.View.ValidateTip.Bottom.hide();
            });
        },

        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid,
                content: self.content,
                width: self.width
            });

            self.curentEl = $(html).appendTo($(document.body));
        },

        /**
         * 更新提示内容
         */
        updateContent: function (content) {

            $('#' + this.cid + '_content').html(content);
        },

        setPositon: function (el) {

            var self = this;

            if (!el) return;

            var offset = $(el).offset();
            var left = offset.left - 10;

            var height = $(el).height(); //这里取当前控件高度而不是弹框高度
            
            var top = offset.top + height + 14;
            console.log('top:'+top+'left:'+left);
            self.curentEl.css({ left: left, top: top });
            
            self.curentEl.focus();
        },

        template: [
            "<div id=\"{cid}_wrap\" class=\"tips\" tabindex=\"0\" hidefocus=\"true\" style=\"position:absolute;outline:none;left:20px;top:-1000px;width:{width}px;display:'';z-index:9999;\">",
                "<div class=\"tips-text\"  id=\"{cid}_content\">{content}</div>",
                "<div class=\"tipsTop diamond\" style=\"left:10px\"></div>",
           "</div>"
        ].join("")
    }, {

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        /**
         *  消息弹出提醒控件 此方法供外部调用
         *  @param {Object} target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} text  消息内容
         *  @param {Boolean} isAutoHide 是否自动消失
        **/
        show: function (text, target, isAutoHide) {
            var self = this;
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip.Bottom({});
            }

            var control = $Cal_Validate_Tip;
            //更新界面内容
            control.updateContent(text);
            //设置位置
            control.setPositon(target);
            if (isAutoHide) {
                setTimeout(function () {
                    M2012.Calendar.View.ValidateTip.Bottom.hide();
                }, 5000);//5s消失
            }
        },

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        hide: function () {
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip.Bottom({});
            }
            window.$Cal_Validate_Tip.curentEl.css({ left: '-1000px' });
        }
    }));


})(jQuery, _, M139, window._top || window.top)
/**
* @Author: anchen
* @Date:   2014-09-18 15:30:43
* @Last Modified by:   anchen
* @Last Modified time: 2014-10-21 16:31:47
*/
;(function(jQuery,Backbone,_,M139) {
    var $ = jQuery;
    M139.namespace('M2012.activityInvite.Model',Backbone.Model.extend({

        /**
         *@lends M2012.activityInvite.Model.prototype
         */
        defaults: {
            labelId: 10,
            //日历类型
            // 10：公历 20：农历
            calendarType: 10,
            //日程是否启用提醒
            //0：否  1：是
            enable: 1,
            //提醒提前时间,默认提前15分钟
            beforeTime: 15,
            //提醒提前类别
            //0分, 1时, 2天, 3周,4月
            beforeType: 0,
            //重复类型
            //0不重复, 3天, 4周,5月,6年
            sendInterval: 0,
            //用户输入的验证码
            validImg: "",
            //会议主题
            title: "",
            //会议地点
            site: "",
            //收件人
            to: '',
            //邀请信息
            inviteInfo: '',
            //会议详情
            content: "",
            //开始时间 (默认为当前时间半小时后)
            dtStart: '',
            //结束时间
            dtEnd: '',
            //大附件链接
            fileLink: "",//'<a href="javascript:">这是大附件的链接！</a>',
            //写信中的会议邀请
            source: 1,

            //是否是短信提醒   0：否 1：是
            remindBySms: 0,
            //是否是邮件提醒   0：否   1：是
            recMyEmail: 0,
            //活动提醒接收的手机号
            recMobile: "",
            //活动提醒接收的邮箱地点
            recEmail: "",
            //特殊类型
            specialType: 0,
            //是否有结束时间信息
            useEndTime: false,

            isAddToCalendar: true,

            week: "",
            //全天事件
            //0：否 1：是
            allDay: 0,

            tabName : '', // 当前邀请页签名称，用于激活标签页
            pageType : 'activityInvite',
            isFromSendBtn: false,//判断是否来自点击发送按钮,
            hasEmailItems: false
        },

        EVENTS: {
            VALIDATE_FAILED: 'activity#validate:failed'
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            STARTTIME_INVALID: "开始时间不能早于当前时间",
            ENDTIME_INVALID: "结束时间不能早于开始时间",
            DATA_LOADING: "正在加载中...",
            TITLE_ERROR: "请输入主题",
            RECIVER_NOT: "请选择联系人",
            RECEIVER_ERROR: "联系人输入错误",
            CANCEL_INVITE: "关闭会议邀请页，未保存的内容将会丢失，是否关闭？"
        },

        initialize: function() {
            var self = this;
            self.initEvents();

        },

        initEvents: function() {
            var self = this;

            self.on("invalid", function (model, error) {
                if (error && _.isObject(error)) {
                    for (var key in error) {

                        self.trigger(self.EVENTS.VALIDATE_FAILED, {
                            target: key,
                            message: error[key]
                        });
                        break;
                    }
                }
            });

            self.tabName = top.$App.getCurrentTab().name;

        },
        //比较是否有编辑
        compare: function() {
           var self = this;
           if (self.get("isFromSendBtn")) {
               return false;
           }

           if ($("#activityTitle").val() || self.get("hasEmailItems") || $("#activityAddr").val() || $("#activityContent").val()) {
               return true; //有编辑过
           } else {
               return false; //没有编辑过
           }
        },
        // 切换到当前邀请页标签
        active : function(){
            var self = this;
            var tabName = self.tabName;
            
            if(tabName && tabName.indexOf('activityInvite') != -1){
                top.$App.activeTab(tabName);
            }
        },
        // 判断当前会议邀请页是否为空白页
        isBlankInvite : function(){
            var self = this;
            if($("#activityTitle").val() || $("#activityAddr").val() || $("#activityContent").val() || self.get("hasEmailItems")){
                return false;
            }else{
                return true;
            }
        },

        //获取处理后的数据（走addCalendar接口）
        getData: function() {
            var self = this, endTime='';
            if (!self.get("useEndTime")){
                endTime = self.get("dtStart");
            } else {
                endTime =self.get("dtEnd");
            }
            //计算开始、结束时间
            return {
                labelId: self.get("labelId"),
                calendarType: self.get("calendarType"),
                beforeTime: self.get("beforeTime"),
                beforeType: self.get("beforeType"),
                sendInterval: self.get("sendInterval"),
                week: self.get("sendInterval") == 4 ? self.get("week") : "",
                recMySms: self.get("remindBySms"),//是否有短信提醒
                title: self.get("title"),
                site: self.get("site"),
                content: self.get("content"),
                dtStart: self.get("dtStart"),
                dtEnd: endTime,
                allDay: self.get("allDay"),
                recMobile: self.get("recMobile"),
                recEmail: self.get("recEmail"),
                enable: self.get("enable"),
                specialType: self.get("specialType"),
                validImg: self.get("validImg"),
                fileLink: "<![CDATA[" + self.get("fileLink") + "]]>",
                source: self.get("source"),
                inviteInfo:self.get("inviteInfo")

            };
        },
        /**
         * 验证数据的有效性
         **/
        validate: function (attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate) {
                return;
            }

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                var value = {};
                value[target] = message;
                //console.log(value);
                return value;
                };

            //验证主题内容有效性
            var key = "title";
            if (_.has(data, key)) {
                if (data.title.length == 0) {
                    return getResult(key, self.TIPS.TITLE_ERROR);
                }
            }

            //验证开始时间
            key = "dtStart";
            if (_.has(data, key)) {
                var startTime = data.dtStart;

                startTime = $Date.parse(startTime);

                if ( (startTime.getTime()) -(new Date()).getTime() < 0)
                return getResult(key, self.TIPS.STARTTIME_INVALID);
            }

            //验证结束时间
            key = "dtEnd";
            if (_.has(data, key) && attrs.useEndTime) {

                var startTime = $Date.parse(attrs.dtStart);
                var endTime = $Date.parse(data.dtEnd);

                if ((endTime.getTime()) - (startTime.getTime()) < 0) {
                    return getResult(key, self.TIPS.ENDTIME_INVALID);
                }
            }
        },
        //提交到服务器保存
        saveToServer: function (fnSuccess, fnError, fnFail, validate) {
            var self = this;
            if (self.get("isAddToCalendar")) {
                console.dir(self.getData());
                //api 测试
                M139.RichMail.API.call('calendar:addCalendar', self.getData(), function (result) {
                    
                    if (result.responseData.code == "S_OK") {

                        BH({key:"create_invite_suc"});
                        fnSuccess && fnSuccess(result.responseData["var"]);
                        return;
                    }
                    var msg = self.TIPS.OPERATE_ERROR;
                    fnError && fnError(msg, result);
                },function (e) {
                    fnError && fnError(self.TIPS.OPERATE_ERROR);
                });
            } else {
                var inviteTime = self.get("useEndTime")?'到'+self.get("dtEnd"):'';
                var attach = self.get("fileLink")?self.get("fileLink"):'';
                var mailInfo = {
                    title: '【会议邀请】'+self.get("title"),
                    to:self.get("to"),
                    content: '会议主题：'+self.get("title")+'<br>会议时间：'+self.get("dtStart") +inviteTime+"<br>会议内容："
                        +self.get("content")+"<br>"+attach
                };
                
                top.$PUtils.sendMail({email:mailInfo.to,content:mailInfo.content,subject:mailInfo.title,callback:function (result) {
                    if (result.responseData.code == "S_OK") {
                        BH({key:"send_invite_mail_suc"});
                        fnSuccess && fnSuccess(result.responseData["var"]);
                        return;
                    }
                    var msg = self.TIPS.OPERATE_ERROR;
                    fnError && fnError(msg, result);
                }});
            }
        }


        }
    ));
})(jQuery,Backbone,_,M139);





/**
 * @Author: zhangjia
 * @Date:   2014-09-18 17:22
 * @Last Modified by:   anchen
 * @Last Modified time: 2014-10-21 16:30:40
 */
;(function(jQuery, _, M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /**
     * 邀请会议
     */
    M139.namespace('M2012.activityInvite.View',superClass.extend(
        /**
         *@lends M2012.activityInvite.View.prototype
         */
        {
            name: 'M2012.activityInvite.View',
            el:"body",
            events: {
                "click #inviteMore" : 'showAddressBookDialog',
                "click #cancelInviteBtn": "cancelInvite"//底部取消会议邀请
            },
            initialize: function(options) {
                this.model = options.model;
                this.maxSenders = top.$User.getMaxSend();
                this.render();
                this.initializeDate();
                this.createEmailInput(); //创建邮件地址富文本框
                this.initEvents();
                this.currentRichInput = null;
                return superClass.prototype.initialize.apply(this, arguments);
            },

            initEvents: function() {
                var self = this;
                self.registerMouseEvent();
                self.regCloseTabEvent();
                self.createCalander();
                self.createTimer();
                self.isEndTimeChecked();
                self.isAddToCalendarChecked();
                self.isChinaMobileUserCheck();
                self.isSMSRemindChecked();
                self.handleMSPlaceholder();

                // 监控数据校验结果并实时呈现错误信息
                self.model.on(self.model.EVENTS.VALIDATE_FAILED, function (args) {
                    if (!args || !args.target || !args.message)
                        return;
                    var targetEl = null;

                    switch (args.target) {
                        //验证主题
                        case "title": targetEl = $("#activityTitle");
                            break;
                        //验证备注
                        case "dtStart": targetEl = $("#startTxtCalendar");
                            break;
                        case "dtEnd": targetEl = $("#endTxtCalendar");
                            break;

                    }

                    if (targetEl && targetEl.length > 0) {

                        targetEl.focus();
                        window.setTimeout(function(){
                            M2012.Calendar.View.ValidateTip.Bottom.show(args.message, targetEl);
                        },100);
                    }

                });
            },
            // 注册隐藏右侧通讯录面板鼠标事件
            registerMouseEvent : function(){
                $("#switchSider").toggle(function(event){

                    $(this).attr('title', '显示右边栏');
                    $("#writeWrap").addClass("writeMainOff");
                },function(event){
                    $(this).attr('title', '隐藏右边栏');
                    $("#writeWrap").removeClass("writeMainOff");
                });
            },
            // 初始化定时时间 todo 重复操作
            initializeDate : function(date){
                var self = this;
                // 初始化时间
                var now = date || self.getDefaultDate();
                var date = $Date.format("yyyy年MM月dd日 周w", now);
                var time = self.getFullTime(now.getHours())+ ':' + self.getFullTime(now.getMinutes());
                $("#startTxtCalendar > div:eq(0)").html(date);
                $("#startDateFormat").html($Date.format("yyyy-MM-dd", now));
                $("#endTxtCalendar > div:eq(0)").html(date);
                $("#startHourText").html(self.getFullTime(now.getHours()));
                $("#endHourText").html(self.getFullTime(now.getHours()));
                $("#startMiniuteText").html(self.getFullTime(now.getMinutes()));
                $("#endMiniuteText").html(self.getFullTime(now.getMinutes()));
                $("#endDateFormat").html($Date.format("yyyy-MM-dd", now));


            },
            getDefaultDate: function (){
                var now = new Date();
                var now = new Date();
                return new Date(now.getTime() + 30 * 60 * 1000);
            },

            getFullTime:function (time){
                return time >= 10?time:('0'+time);
            },
            // 创建定时器组件 todo 重复操作
            createCalander : function(){
                var self = this;
                var startCalendarPicker = this.calendarPicker = M2012.UI.Picker.Calendar.create({
                    bindInput: $("#startTxtCalendar")[0],
                    value: new Date(),
                    stopPassDate: true
                });
                var startText = $("#startTxtCalendar > div:eq(0)");
                startCalendarPicker.on("select", function (e) {
                    BH({key:"compose_activity_datetime"});
                    var calendar = e.value.format("yyyy年MM月dd日 周w");
                    startText.html(calendar);
                    $("#startDateFormat").html(e.value.format("yyyy-MM-dd"));
                    self.model.set({dtStart:self.getStartDateTime()});

                });
                var endCalendarPicker = this.calendarPicker = M2012.UI.Picker.Calendar.create({
                    bindInput: $("#endTxtCalendar")[0],
                    value: new Date(),
                    stopPassDate: true
                });
                var endText = $("#endTxtCalendar > div:eq(0)");
                endCalendarPicker.on("select", function (e) {
                    BH({key:"compose_activity_datetime"});
                    var calendar = e.value.format("yyyy年MM月dd日 周w");
                    endText.html(calendar);
                    $("#endDateFormat").html(e.value.format("yyyy-MM-dd"));
                    self.model.set({dtEnd:self.getEndDateTime()});
                    //console.log('change_date:'+self.model.get("dtEnd"));
                });

            },
            // 创建时间组件(开始时间和结束时间) todo DOM重复操作
            createTimer : function(){
                var self = this;
                var startHourItems = self._getMenuItems(0, 23, 'startHourText');
                var startHourMenu = M2012.UI.PopMenu.createWhenClick({
                    target : $('#startHourMenu')[0],
                    width : 70,
                    maxHeight : 170,
                    items : startHourItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtStart:self.getStartDateTime()});

                    }
                });
                var startMiniuteItems = self._getMenuItems(0, 59, 'startMiniuteText');
                M2012.UI.PopMenu.createWhenClick({
                    target : $("#startMiniuteMenu")[0],
                    width : 70,
                    maxHeight : 170,
                    items : startMiniuteItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtStart:self.getStartDateTime()});

                    }
                });
                //结束时间
                var endHourItems = self._getMenuItems(0, 23, 'endHourText');
                var endHourMenu = M2012.UI.PopMenu.createWhenClick({
                    target : $('#endHourMenu')[0],
                    width : 70,
                    maxHeight : 170,
                    items : endHourItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtEnd:self.getEndDateTime()});
                        //console.log('change_hour:'+self.model.get("dtEnd"));

                    }
                });
                var endMiniuteItems = self._getMenuItems(0, 59, 'endMiniuteText');
                M2012.UI.PopMenu.createWhenClick({
                    target : $("#endMiniuteMenu")[0],
                    width : 70,
                    maxHeight : 170,
                    items : endMiniuteItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtEnd:self.getEndDateTime()});
                        
                    }
                });
            },
            //结束时间标签事件处理
            isEndTimeChecked: function() {
                var el = $("#endTimeCheck"),self = this;
                el.change(function(){
                    if ( el.is(':checked') ){
                        $(".endTimeDiv").show();
                        self.model.set({
                            useEndTime:!self.model.get('useEndTime')
                        });
                        self.model.set({
                            dtEnd:self.getEndDateTime()
                        });
                        //console.log(self.model.get("dtEnd"));

                    } else {
                        $(".endTimeDiv").hide();
                        self.model.set({useEndTime:false});
                        self.model.set({
                            dtEnd:''
                        });
                    }
                });
            },
            //是否选择添加到自己的日历
            isAddToCalendarChecked: function() {
                var el = $("#addToCalendar"),self = this;
                el.change(function(){
                    if ( el.is(':checked') ){
                        self.model.set({
                            isAddToCalendar:true
                        });
                    } else {
                        self.model.set({isAddToCalendar:false});
                    }
                });
            },
            //得到会议开始的时间
            getStartDateTime : function() {
                var self = this;
                var date = $("#startDateFormat").html();
                var time = $("#startHourText").html()+ ':' + $("#startMiniuteText").html();
                return (date + ' '+time+':00');
            },
            //得到会议结束的时间
            getEndDateTime : function() {
                var self = this;
                var date = $("#endDateFormat").html();
                var time = $("#endHourText").html()+ ':' + $("#endMiniuteText").html();
                return (date + ' '+time+':00');
            },
            //是否短信通知
            isSMSRemindChecked: function() {
                var self = this, el = $("#isSMSRemind");
                el.change(function(){
                    if ( el.is(':checked') ){
                        var textTip = '请您在'+self.model.get("dtStart")+'参加会议：'+self.model.get('title');
                        el.next().next().removeAttr("disabled").val(textTip);
                        self.model.set({remindBySms:1});
                    } else {
                        el.next().next().val("").attr("disabled","disabled");
                        self.model.set({remindBySms:0});
                    }
                })
            },
            //是否内部用户
            isChinaMobileUserCheck: function() {
                var self = this;
                if (!top.$User.isChinaMobileUser()){
                    $("#isSMSRemind").attr("disabled","disabled");
                }
            },
            initPageEvents: function() {
                var self = this;
                //主题、地点、内容变化实时同步到model
                $.each([$("#activityTitle"), $("#activityAddr"), $("#activityContent")], function () {
                    var el = this;
                    //控件值发生变化后传递到后端
                    el.change(function () {
                        var data = {};
                        var key = this.name;

                        data[key] = $.trim(this.value);
                        //console.log(data);
                        self.model.set(data, {
                            validate: false,
                            target: key
                        });
                    });

                    //增加实时检测字数功能
                    self.checkInputWords(el, Number(el.attr("maxlength") - 3));
                });
                //初始化开始时间和结束时间
                var now = self.getDefaultDate();
                var date = $Date.format("yyyy-MM-dd", now);
                var time = self.getFullTime(now.getHours())+ ':' + self.getFullTime(now.getMinutes());
                self.model.set({dtStart:date+' '+time+":00"});
                self.model.set({dtEnd:date+' '+time+":00"});
                //保存
                $("#sendInviteBtn").click(function () {
                    BH({key:"compose_activity_send"});
                    self.model.set({isFromSendBtn:true});
                    self.save(true);
                });
            },
            //渲染视图
            render: function() {
                var self = this;
                //初始化右侧联系人
                new M2012.UI.Widget.Contacts.View({
                    container: document.getElementById("divAddressList"),
                    filter: "email",
                    width: "auto"
                }).on("select",function(e){
                        var addr = e.isGroup ? e.value.join(";") : e.value;
                        self.addMailToRichIput(addr).focus();
                        var data = null;
                        if (e && e.value) {
                            data = e.value;
                        }
                        self.model.set({ inviteInfo: data }, {
                            silent: true
                        });
                    });

                self.initPageEvents();
            },


            /**
             * 获得时/分菜单项
             */
            _getMenuItems : function(begin, end, id){
                var self = this;
                var items = [];
                for(var i = begin;i <= end;i++){
                    var text = '';
                    if(i < 10){
                        text = '0' + i;
                    }else{
                        text = i + '';
                    }
                    var item = {
                        text : text,
                        onClick : function() {
                            $("#"+id).html(this.text);
                            self.targetText = this.text;
                            // todo 第二个popMenu从dom移除后，会将第一个popMenu的bindautohide属性置为'0'，导致第一个popMenu不响应全局单击事件
                            // $("div.sTipsSetTime").attr('bindautohide', '1');
                        }
                    }
                    items.push(item);
                }
                return items;
            },

            //创建邮件地址输入框
            createEmailInput: function() {
                var self = this;
                self.toRichInput = M2012.UI.RichInput.create({
                    container:document.getElementById("emailAddrInput"),
                    maxSend : self.maxSenders,
                    type:"email",
                    tipPlace: "bottom"
                }).render();
                self.toRichInput.setTipText('联系人');
                self.toRichInput.on("focus",function(){
                    self.currentRichInput = this;
                });
                self.toRichInput.on("itemchange",function(){
                    if(self.toRichInput.hasItem()) {
                        self.model.set({hasEmailItems:true});
                    } else {
                        self.model.set({hasEmailItems:false});
                    }
                });
            },

            //添加邮箱至成员输入框
            addMailToRichIput: function(addr) {
                if (!this.currentRichInput){
                    this.currentRichInput = this.toRichInput;
                }
                this.currentRichInput.insertItem(addr);
                return this.currentRichInput;
            },

            // 验证收件人（会议成员）
            checkInputAddr : function() {
                var self = this,
                    isContinue = true;
                if (!self.toRichInput.hasItem()) {
                    window.scrollTo(0,0);
                    // 弹出框提示
                    self.toRichInput.showEmptyTips(self.model.TIPS.RECIVER_NOT);
                    self.toRichInput.focus();
                    isContinue = false;
                }
                var richInput = null;
                if (self.toRichInput.getErrorText()) {
                    richInput = self.toRichInput;
                }

                if(richInput){
                    richInput.showErrorTips(self.model.TIPS.RECEIVER_ERROR);
                    self.toRichInput.focus();
                    isContinue = false;
                }
                return isContinue;
            },

            //联系人选择（弹框）
            showAddressBookDialog : function(event){
                var self = this;
                var target = event.target;
                //self._setCurrentRichInput(target);
                var view = top.M2012.UI.Dialog.AddressBook.create({
                    filter:"email",
                    items:'just test',
                    comefrom:"activity_invite"
                });
                view.on("select",function(e){
                    self.addMailToRichIput(e.value.join(";")).focus();
                });
                view.on("cancel",function(){
                    //alert("取消了");
                });
            },

            //截取value字符串前len个字节，一个汉字为2字节
            getCutCode: function(value, len) {
                var count = 0;
                for (var i = 0; i<value.length; i++) {
                    var codeByte = (value.charAt(i).charCodeAt(0)>255)?2:1;
                    count = count + codeByte;
                    if (count >= len) {
                        return value.slice(0, i+1) ;
                        break;
                    }
                }
            },
            /** 实时监控输入框数据
             * @param {jQuery Object}  inputEl     //输入框元素
             * @param {Number}         maxLength   //允许输入字符的最大长度
             **/
            checkInputWords: function (inputEl, maxLength) {
                var self = this;
                inputEl.unbind("keyup parse").bind("keyup parse", function (e) {
                    var value = $.trim(inputEl.val());
                    if ($TextUtils.getBytes(value) > maxLength) {

                        inputEl.val(self.getCutCode(value,maxLength));

                        var key = inputEl.attr("id");

                        //更新数据到model
                        var data = {};
                        data[key] = $.trim(inputEl.val());
                        self.model.set(data, {
                            silent: true,
                            validate: false
                        });
                    }
                });
            },
            //对邀请的成员信息过滤
            getValidateReiciver: function(inviteArr){
                var self = this;
                var arr = [];
                for (var i = 0;i<inviteArr.length;i++){
                    arr.push({
                        inviteAuth: 2,
                        inviterUin : inviteArr[i].addr,
                        recMobile : inviteArr[i].addr,
                        recEmail : inviteArr[i].addr,
                        smsNotify : 0,
                        emailNotify : 1
                    });
                }

                return arr;
            },

            //修复IE下的placeholder问题
            handleMSPlaceholder: function(){
                var self = this;
                if(!self.placeholderSupport()){   // 判断浏览器是否支持 placeholder
                    $('[placeholder]').focus(function() {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                            input.css('color','#000');
                        }
                    }).blur(function() {
                        var input = $(this);
                        if (input.val() == '' || input.val() == input.attr('placeholder')) {
                            input.css('color','#999');
                            input.val(input.attr('placeholder'));
                        }
                    }).blur();
                }
            },

            placeholderSupport:function () {
                return 'placeholder' in document.createElement('input');
            },
            //取消会议邀请
            cancelInvite : function(){
                var self = this;
                var isEdited = self.model.compare();
                if (!isEdited || window.confirm(self.model.TIPS['CANCEL_INVITE'])) {
                    BH({key:"compose_activity_cancel"});
                    top.$App.close();
                }

            },

            // 注册关闭会议邀请标签页事件
            regCloseTabEvent : function(){
                var self = this;
                top.$App.on("closeTab", self.closeActivityTabCallback);
            },

            // 关闭会议邀请标签页回调
            closeActivityTabCallback : function(args){
                var self = this;
                if(!top || !top.$App){
                    return;
                }

                if (top.$App.getCurrentTab().name.indexOf('activityInvite') != -1) {
                    aiView.model.active();
                }

                if(args.name && args.name === aiView.model.tabName){
                    var isEdited = aiView.model.compare();
                    if(isEdited){
                        if(window.confirm(aiView.model.TIPS['CANCEL_INVITE'])){
                            BH({key:"compose_activity_cancel"});
                            top.M139.UI.TipMessage.hide();
                            args.cancel = false;
                            top.$App.off("closeTab", aiView.closeTabCallback);
                        }else{
                            args.cancel = true;
                        }
                    }else{
                        top.M139.UI.TipMessage.hide();
                        args.cancel = false;
                        top.$App.off("closeTab", aiView.closeTabCallback);
                    }
                }
            },
            /**
             *  提交数据
             **/
            save: function (validate) {
                var self = this;

                if(window.isAttachUploading()) {
                    top.$Msg.alert("附件上传尚未完成，请稍后发送！");
                    return;
                }

                if (!self.model.isValid()) {
                    return;
                }

                if(!self.checkInputAddr()){
                    //console.log('收件人验证未通过！');
                    return;
                } else {
                    self.model.set({to:self.currentRichInput.getValidationItems().join(',')})
                    self.model.set({inviteInfo:self.getValidateReiciver(self.currentRichInput.getItems())})
                }


                if (window.filesToSend.length == 0) {
                    //新增会议邀请
                    self.saveData(validate);
                } else {
                    getSendLink(function (fileLink) {   //获取超大附件链接后再发送
                        self.model.set("fileLink", fileLink);
                        //console.log(fileLink);
                        self.saveData(validate);
                    });
                }
            },

            /**
             * 保存数据到服务端
             * @param {Boolean}  validate     //是否验证输入数据
             **/
            saveData: function (validate) {
                var self = this;
                var mask = $("#maskDiv");
                //遮挡住操作按钮
                mask.removeClass("hide");

                self.model.saveToServer(function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_SUCCESS, {
                        delay: 3000
                    });
                    mask.addClass("hide");
                    top.M139.UI.TipMessage.show("会议邀请已发送", {
                        delay: 3000
                    });
                    top.$App.close();

                }, function (msg, result) {
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                    mask.addClass("hide");
                }, function () {
                    mask.addClass("hide");
                }, validate);
            }

        })
    );

})(jQuery, _, M139);
 function SWFObject(swf, id, w, h, ver, c){
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("swf",swf);	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	if(ver)this.setAttribute("version",ver);
	if(c)this.addParam("bgcolor",c);
}
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
}
SWFObject.prototype.getParam = function(key){
	return this.params[key];
}
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
}
SWFObject.prototype.getHTML = function(){
	var con = '';
	if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed class="flash" type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object class="flash" id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
}
SWFObject.prototype.write = function(elementId){	
	if(typeof elementId == 'undefined'){
		document.write(this.getHTML());
	}else{
	    var n = document.getElementById(elementId);
	    //n.innerHTML = this.getHTML();
	    if (!n) {
	        n = $(elementId);
	    }
	    $(n).append(this.getHTML());
	}
}
﻿
/*
上传组件，IE浏览器默认flash上传，其它浏览器html5

示例:
    var fileUpload = new FileUpload({
        container: document.getElementById("uploadBtn"),
        onselect: function (files) {
            var self = this;
            $(files).each(function (i, n) {
                updateUI(n);
            });
            setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                self.upload();
            }, 10);
        },
        onprogress: function (fileInfo) {
            updateUI(fileInfo);
        },
        oncomplete: function (fileInfo, responseText) {
            updateUI(fileInfo);
           
        }
    });
*/

;function FileUpload(options) {
    var uploader = null;
    var elementIndex = Math.random().toString().substr(2);//用于创建多个实例
    //console.log(elementIndex);
    if (options) {
        //为什么要多创建一级div容器？flash 的activex创建后，再改变位置会引起activex对象失效，所以要在创建前就定好位
        var div = document.createElement("div");
        div.id = "UploadDiv" + elementIndex;
        div.style.zIndex = 9999;
        document.body.appendChild(div);
        var c = $(options.container);

        function dock(dockContainer) {
            if (dockContainer) {
                c = $(dockContainer);
            }
            //绝对定位到上传按钮的坐标，flash本身为透明遮罩
            $(div).css({
                position: "fixed",
                left: (c.offset().left || 250) + "px",
                opacity: 0,
                top: (c.offset().top || 87) + "px"
            });
        }
        dock();

        if ($.browser.msie || options.uploadType == "flash") {
            var objName = "JSForFlashUpload_" + elementIndex;
            //flash上传方式
            var url = (options.swfPath || "/m2012/flash/muti_upload.swf");//+ "?name=" + objName;
            var so = new SWFObject(url, "flashupload" + elementIndex, c.width(), c.height());
            so.addParam("wmode", "transparent");
            so.write(div.id);

            options.activexObj = document.getElementById("flashupload" + elementIndex);

            window["UploadFacade"] = new FlashUpload(options);
            uploader = window["UploadFacade"];

        } else {

            $(div).html(['<form style="" enctype="multipart/form-data" id="fromAttach" method="post" action="" target="frmAttachTarget">',
                 '<input style="height: ', c.height(), 'px;width:', c.width(), 'px" type="file" name="uploadInput" id="uploadInput' + elementIndex + '" multiple="true">',
                 '</form>',
                 '<iframe id="frmAttachTarget" style="display: none" name="frmAttachTarget"></iframe>'].join(""));
            options.uploadInput = document.getElementById("uploadInput" + elementIndex);
            uploader = new Html5Upload(options);
           
        }

    }
    
    this.dock = dock;
    this.upload = function () {//触发上传请求
        //alert("uploader.load");
        uploader.upload();
    },
    this.cancel = function (taskId) {//取消上传
        uploader.cancel(taskId);
    }
    this.getUploadFiles = function () {//获取上传队列
        return uploader.getUploadFiles();

    }
    
    $.extend(options, this);//继承FileUpload的能力
}


var FlashUpload = function(options){
    
    var resultObject = {
        activexObj: options.activexObj,
        upload:function(){
            this.activexObj.upload(true);
        },
        cancel: function (taskId) {
            this.activexObj.cancel(taskId);
        },
        getUploadUrl: function () {
            return this.agent.getUploadUrl();
        },
        getUploadFiles: function () {
            return this.uploadFiles;
        },
        onload: function (param) {

        },
        getFileById: function (taskId) {
            for (var i = 0; i < this.uploadFiles.length; i++) {
                if (this.uploadFiles[i].taskId == taskId) {
                    return this.uploadFiles[i];
                }
            }
            return null;
        },
        onloadcomplete: function (args) {
            var self = this;
            //console.log("onloadcomplete", args);

            
            var file = this.getFileById(args.taskId);
             
            file.md5 = args.md5;
            UploadLargeAttach.prepareUpload(file, function (postParams) {

                    self.activexObj.setUploadUrl(file.uploadUrl);
                    self.activexObj.uploadRequest();

            });
             
        },
        onrequest: function (args) {
            var result;
           
                result = UploadLargeAttach.postParams;
                //result["Filename"] = result["filename"];
                result["range"] = args.offset + "-" + (Number(args.offset) + (Number(args.length) - 1)).toString();

          


            return result;
        },
        onselect: function (files) {
            for (var i = 0; i < files.length; i++) {
                files[i].fileName = decodeURIComponent(files[i].fileName);
                files[i].state = "waiting";

            }
            
            //uploadView.onselect(jsonFileList);
            this.agent.onselect && this.agent.onselect(files);

            this.uploadFiles = files;

            return true;
        },
        onprogress: function (args) {
            var taskId = args.taskId;
            var fileInfo=this.getFileById(taskId);
            fileInfo.state = "uploading";
            fileInfo.percent = args.percent;
            //fileInfo.fileName = decodeURIComponent(fileInfo.fileName);//防止乱码，flash里面做了encode
            
            this.agent.onprogress && this.agent.onprogress(fileInfo);
        },
        oncomplete: function (data) {
            if (data) {
                var fileInfo = this.getFileById(data.taskId);
                fileInfo.state = "complete";
                //fileInfo.fileName = decodeURIComponent(fileInfo.fileName);//防止乱码，flash里面做了encode
                this.agent.oncomplete && this.agent.oncomplete(fileInfo, data.data);
            }
        },
        onerror: function (taskId, errorCode, errorMsg) {
            alert("文件上传失败：" + errorMsg);
            this.agent.onerror && this.agent.onerror(errorMsg);
        },
        onmouseover: function () {

        },
        onmouseout: function () {

        },
        onclick: function () {
            return true;//返回false不会弹出文件选择框
            //alert("onclick");
        }

    }
    if (options) {
        resultObject.agent = options;
    }
    return resultObject;
}

var Html5Upload = function (options) {
   
}


var UploadLargeAttach = {
    prepareUpload: function (file, callback) {

        /*
        POST http://rm.mail.10086ts.cn/mw2/file/disk?func=file:fastUpload&sid=xxx
    
        <object>
    <string name="fileName">测试环境hosts.txt</string>
    <int name="fileSize">908</int>
    <string name="fileMd5">2bfda476d9e76462a9a8f1ca4aff1c16</string>
    </object>
        */
        var self = this;
        this.currentFile = file;
        file.isLargeAttach = true;

        function preUpload(md5Value) {
            var data = {
                fileName: file.fileName,
                fileSize: file.fileSize,
                fileMd5: md5Value
            }
            file.comeFrom = "cabinet";
            file.fileType = "keepFolder";
            M139.RichMail.API.call("file:fastUpload", data, function (result) {

                if (file.isCancel) { //md5过程中取消上传
                    //uploadManager.removeFile(file);
                    //uploadManager.autoUpload();
                    return;
                }
                if (result.responseData["code"] && result.responseData["code"] == "S_OK") {
                    var status = result.responseData["var"]["status"];
                    file.fileName = result.responseData["var"]["fileName"];//取预上传接口返回的文件名称，文件可能重名被自动改名，或单副本取文件原始名称，否则发送时无法匹配到文件
                    if (status == "0") {
                        var params = result.responseData["var"]["postParam"];
                        file.fileId = result.responseData["var"]["fileId"];
                        file.fileIdForSend = result.responseData["var"]["fileId"];
                        file.uploadUrl = result.responseData["var"]["url"];
                        self.
                            uploadUrl = file.uploadUrl;
                        //params.fileObj = file.fileObj;
                        self.postParams = params;
                        callback(params);
                    } else if (status == "1") { //单副本，直接插入


                        file.fileId = result.responseData["var"].fileId;
                        file.state = "complete";
                        //var fileCabinet = [self.transformFile(file)];
                        //top.$App.trigger('obtainCabinetFiles', fileCabinet);
                        completeFile(file);
                        //继续下一个文件上传
                        //fileUpload.cancel(file.taskId);
                        fileUpload.upload();
                    }
                }

            });
        }
        if (file.md5) {    //flash上传已计算好md5
            preUpload(file.md5);
        } else {
            this.getFileMd5(preUpload);
        }

    }
}

window.filesToSend = [];
function completeFile(fileInfo) {
    filesToSend.push(fileInfo);
    updateUI(fileInfo);
}
function deleteFile(taskId) {
    var files = fileUpload.getUploadFiles();

    for(var k = 0;k < files.length; k++) {
        if (taskId == files[k].taskId) {

            if (files[k].state == "uploading"){
                //files.splice(k,1);
                fileUpload.cancel(taskId);
            } else {
                files.splice(k,1);
                return;
            }

        }
    }
    /*
    for (var i = 0; i < window.filesToSend.length; i++) {
        if (taskId == window.filesToSend[i].taskId) {
            window.filesToSend.splice(i, 1);
            i--;
        }
    }*/
}

function getFileTypeObj() {
    return {
        'xls': 'xls.png',
        'xlsx': 'xls.png',
        'doc': 'word.png',
        'docx': 'word.png',
        'jpeg': 'jpg.png',
        'jpg': 'jpg.png',
        'rar': 'zip.png',
        'zip': 'zip.png',
        '7z': 'zip.png',
        'txt': 'txt.png',
        'rtf': 'txt.png',
        'ppt': 'ppt.png',
        'pptx': 'ppt.png',
        'xml': 'xml.png',
        'wmv': 'wmv.png',
        'wma': 'wma.png',
        'wav': 'wav.png',
        'vsd': 'vsd.png',
        'vob': 'vob.png',
        'fla': 'swf.png',
        'swf': 'swf.png',
        'flv': 'swf.png',
        'sis': 'sis.png',
        'rm': 'rm.png',
        'rmvb': 'rm.png',
        'psd': 'psd.png',
        'ppt': 'ppt.png',
        'png': 'png.png',
        'pdf': 'pdf.png',
        'mpg': 'mpg.png',
        'mp4': 'mp3.png',
        'mpeg': 'mp3.png',
        'mpg': 'mp3.png',
        'mp3': 'mp3.png',
        'java': 'java.png',
        'iso': 'iso.png',
        'htm': 'html.png',
        'html': 'html.png',
        'asp': 'html.png',
        'jsp': 'html.png',
        'aspx': 'html.png',
        'gif': 'gif.png',
        'exe': 'exe.png',
        'css': 'css.png',
        'chm': 'chm.png',
        'cab': 'cab.png',
        'bmp': 'bmp.png',
        'avi': 'ai.png',
        'asf': 'asf.png',
        'mov': 'rm.png',
        'JPG': 'jpg.png'
    };
}
function getLinkHtml(fileList,downloadUrl) {
    $(fileList).each(function (i, n) {
        /*var fileName = n.fileName
        var exp = n.exp;
        var url = n.url;*/
        $(window.filesToSend).each(function (i2,n2) {
            if (n2.fileName == n.fileName) {
                $.extend(n2, n);
                //console.log(n2);
            }
        })
    });
    var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
    var fileTypeObj = getFileTypeObj();
    var outsideTableHtml=['<table id="attachAndDisk" style="margin-top:25px; border-collapse:collapse; table-layout:fixed; width:95%; font-size: 12px; line-height:18px; font-family:\'Microsoft YaHei\',Verdana,\'Simsun\';">',
				'<thead>',
					'<tr>',
						'<th style="background-color:#e8e8e8; height:30px; padding:0 11px; text-align:left;"><img src="{resourcePath}attachmentIcon.png" alt="" title="" style="vertical-align:middle; margin-right:6px; border:0;" />来自139邮箱的文件</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td style="border:1px solid #e8e8e8;">',
							'{itemHtml}',
						'</td>',
					'</tr>',
				'</tbody>',
			 '</table>'].join("");
    var tableHtml = ['<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="attachItem" class="newAttachItem">',
								'<thead>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>',
									'<tr>',
										'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-超大附件</strong><a href="{downloadUrl}" style="font-weight:normal;">进入下载页面</a></th>',
									'</tr>',
								'</thead>',
								'<tbody>',
								'{trs}',
								'</tbody>',
						'</table>'].join("");
    var itemHtmlNew = ['<tr>',
                        '<td style="padding-left:30px; height:40px;">',
                            '<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
                                '<tr class="cts">',
                                    '<td width="42"><img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
                                    '<td style="line-height:18px;">',
                                        '<span>{fileName}<span class="gray"></span></span>',
                                        '<span style="color:#999; margin-left:5px;">({fileSize})</span><span style="color:#999; margin-left:5px;">({exp}天后过期)</span>',
                                    '</td>',
                                '</tr>',
                            '</table>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td style="height:10px;"></td>',
                    '</tr>'].join("");

    var midHtml = [];
    //debugger;
    for (var i = 0; i < filesToSend.length; i++) {
        var f = filesToSend[i];
        var fileType = '', extName = f.fileName.match(/.\w+$/);
        if (extName) {
            fileType = extName[0].replace('.', '');
        }
        var fileIconSrc = resourcePath + (fileTypeObj[fileType] || 'none.png');

        midHtml.push(top.M139.Text.Utils.format(itemHtmlNew, {
            fileIconSrc: fileIconSrc,
            fileName: f.fileName,
            fileSize: f.fileSize,
            exp: $Date.getDaysPass(new Date(), $Date.parse(f.exp))
        }));

    }
    var result= top.M139.Text.Utils.format(tableHtml, {
        trs: midHtml.join(''),
        downloadUrl: downloadUrl
    });
    result = top.M139.Text.Utils.format(outsideTableHtml, {itemHtml:result});
    return result;

  
}

function getSendLink(callback) {
    var requestXml = ['<![CDATA[<Request>'];
    requestXml.push("<Fileid>");
    for (var i = 0; i < window.filesToSend.length; i++) {
        var file = window.filesToSend[i];
        requestXml.push(file.fileId);
        if (i != window.filesToSend.length - 1) {
            requestXml.push(",");
        }
    }
    requestXml.push("</Fileid></Request>]]> ");
    var data= {
        xmlStr: requestXml.join("")
    }

    M139.RichMail.API.call("file:mailFileSend", data, function (res) {
        if (callback) {
            var fileList = res.responseData["var"].fileList;
            var html = getLinkHtml(fileList, res.responseData["var"].downloadUrl);
            callback(html);
        }
    });
}

//判断附件是否在上传中
function isAttachUploading(){

    var files=fileUpload.getUploadFiles();
    if (!files) {
        return false;
    }
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.state == "uploading") {
            return true;
        }
    }
    return false;
}

function updateUI(fileInfo) {
  
    var ul = $("#attachContainer");
    var li = "";
    var taskId = fileInfo.taskId.substr(2);//taskId有点号会使选择器失效
    switch (fileInfo.state) {
        case "waiting":
            li = ['<li taskId=', taskId, ' class="" style="display: list-item;">',
 					'<i class="i_attachmentS"></i>',
 					'<span class="ml_5" name="fileName">', fileInfo.fileName, '(正在扫描文件...)<span class="gray" name="status"></span></span>',
 					'<span class="gray ml_5">', $T.Utils.getFileSizeText(fileInfo.fileSize), '</span>',
 					'<span class="ml_5 gray" name="line" style="display:none">|</span>',
 					'<a command="DeleteFile" filetype="common"  href="javascript:void(0)" name="btn_delete" class="ml_5" hidefocus="1">删除</a>',
 				'</li>'].join("");
            ul.append(li);
            break;
        case "uploading":
            ul.find("li[taskId=" + taskId + "]").find("[name=fileName]").html(fileInfo.fileName + "(" + fileInfo.percent + "%)");
            break;
        case "complete":

            ul.find("li[taskId=" + taskId + "]").find("[name=fileName]").html(fileInfo.fileName + "(已完成)");
            ul.find("[name=btn_delete],[name=line]").show();
            break;
    }
}
$(function () {

    function isSupportFlash() {
        if (navigator.userAgent.indexOf("MSIE") > 0 || $B.is.ie11) {
            try {
                var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                return true;
            }
            catch (e) {
                return false;
            }
        }
        if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0 || navigator.userAgent.indexOf("WebKit") > 0) {
            swf = navigator.plugins["Shockwave Flash"];
            if (swf) { return true;}
        }
        return false;
    }
    if (!isSupportFlash()) {
        $("#realUploadButton").click(function () {
            top.$Msg.alert("您尚未安装Flash插件，无法使用上传附件功能");
        });
        return;
    }
    
    window.fileUpload = new FileUpload({
        swfPath: "/m2012/flash/muti_upload.swf",
        container: document.getElementById("realUploadButton"),
        uploadType: "flash",
        getUploadUrl: function () {
            return UploadLargeAttach.uploadUrl;
            //return "http://192.168.9.64/test/upload.ashx?sid=xxxxx";
        },
        onselect: function (files) {
            var self = this;
            BH({ key: "compose_activity_addattachment" }); 
            var sizeToLarge=false;
            $(files).each(function (i, n) {
                if (n.fileSize > 100 * 1024 * 1024) {
                    sizeToLarge = true;
                    return;
                }
            });
            if (sizeToLarge) {
                top.$Msg.alert("每个附件不能超出100M，请重新选择");
                return;
            }

            $(files).each(function (i, n) {

                updateUI(n);
            });

            setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                self.upload();
            }, 10);
        },
        onerror: function (e) {
            alert("error");
        },
        onprogress: function (fileInfo) {

            updateUI(fileInfo);
        },
        oncomplete: function (fileInfo, responseText) {
            
            /*var m = responseText.match(/\<fileid\>(.+?)\<\/fileid\>/);
            fileInfo.fileId = m[1];*/
            completeFile(fileInfo);
            this.upload();
            //console.log(this.getUploadFiles());
            //console.log("responseText", responseText);

        }
    });

    setInterval(function () { fileUpload.dock();}, 1000);
    $("#attachContainer").click(function (e) {
        if ($(e.target).attr("name") == "btn_delete") {
            var taskId = $(e.target).parents("li[taskId]").attr("taskId");
            taskId = "0." + taskId;
            $(e.target).parents("li[taskId]").remove();
            deleteFile(taskId);
        }
    });
    
});
