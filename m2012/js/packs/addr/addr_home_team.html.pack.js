(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    function getSelection(){
        try{
            var str = window.getSelection();
            return str.toString();
        }catch(e){
            var range = document.selection.createRange();
            return range.text;    
        }
    }

    M139.namespace('M2012.GroupMail.App', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
            "click [data-action=close]" : "closeHandler",
            "click [data-tid]" : "tidHandler" ,
            "mouseup [data-select]" : "selectHandler"
        },
        tidHandler : function( e ){
            var cur = e.target || e.srcElement,
                tid = cur.getAttribute("data-tid");
                while(!tid){
                    cur = cur.parentNode;
                    tid = cur.getAttribute("data-tid")
                }
                top.BH(tid);
        },
        selectHandler : function( e ){
            var cur = e.target || e.srcElement ;
            var text = getSelection();
            if( text!== "" ){
                top.BH("group_mail_content_select");
            }
        },
        closeHandler : function( e ){
            var cur = e.target || e.srcElement;
                $("#" + cur.getAttribute("data-aim")).hide();
        },
        EVENT : {
            "SEND_GROUPMAIL_EVENT" : "sendGroupMailEvent",  // 发送群邮件按钮绑定的自定义事件名称
            "CREATE_GROUP" : "createGroup"  // 新建群组按钮绑定的自定义事件名称
        },
        /**
         * [STATUS description]
         * @MSG_LIST 列表消息展示状态
         * @MSG_LIST_EMPTY 列表消息为空时的状态
         * @GROUP_EMPTY 群组为空时状态
         * 值对应model的 wrappers数组键与_cover的STYLE数组键
         */
        STATUS : {
            MSG_LIST : 0 ,
            MSG_LIST_EMPTY : 1 ,
            GROUP_EMPTY : 2 
        },
        _model : Backbone.Model.extend({
                defaults:{  
                   wrappers : [ $("#groupInfoReply") , $("#empty_msg_list_wrapper") , $("#group_empty_wrapper")],
                   status : null 
                }
            }),
        initialize: function (options) {
            this.model = new this._model();
            this.initEvents();
            this.interval = 0; // 用于频繁点击事件
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var that = this;
            // 根据不同的群组,群消息状态显示不同的视图
            this.model.on("change:status" , function(){
                that._change(that.model.get("status"));
            });

            // 当群组消息为空时, 给发送群邮件按钮绑定点击事件
            this.off(this.EVENT.SEND_GROUPMAIL_EVENT).on(this.EVENT.SEND_GROUPMAIL_EVENT, function(fn) {
                $("#empty_msg_list_wrapper").find("a[class='btnSetG']").bind("click",function() {
                    // 这里设置成间隔50ms之后在触发
                    clearTimeout(that.interval);
                    that.interval = _.isFunction(fn) && setTimeout(fn, 50);
                });
            });

            // 当无任何群组时,给新建群组绑定点击事件
            this.off(this.EVENT.CREATE_GROUP).on(this.EVENT.CREATE_GROUP, function(fn) {
                $("#group_empty_wrapper").find("a[class='btnSetG']").bind("click",function() {
                    _.isFunction(fn) && fn();
                });
            });
        },
        /**
         * [_change description]
         */
        _change : function( status ){
            var that = this , wrappers = that.model.get("wrappers");
            _.each( wrappers , function( $el ){
                $el.hide();
            });
            wrappers[status].show();
        },
        /**
         * [setSatatus 整体视图状态改变]
         * @param {[type]} sta [description]
         */
        setStatus : function( sta ){
            if( sta === this.STATUS["GROUP_EMPTY"] ){
                $("#main_wrapper").hide();
            }else{
                $("#main_wrapper").show();
            }
            this.model.set("status" , sta );
        },
        /**
         * [getStatus 获取视图状态]
         * @return {[string]} [description]
         */
        getStatus : function(){
            return this.model.get("status");  
        },
        /**
         * [cover 加载过程中的覆盖层]
         * @param  {[number]} status [父级元素]
         * @param  {[boolean]} cover_sta     []
         * @return {[type]}         [description]
         */
        coverShow : function( status ){
            if(status === this.STATUS["GROUP_EMPTY"]){
                 this._cover.show( $("#main_wrapper")[0] , status );

            }else{
                var wrappers = this.model.get("wrappers");
                this._cover.show(wrappers[status][0] , status);
            }
            this._cover._STATUS = status;
        },
        coverHide : function( status ){
            this._cover.hide( status );
        },
        /**
         * [regularName 名称头像显示规则]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         * @return size 尺寸大小, 默认50px
         */
        regularName : function(str, size){
            var reg = /([\u4E00-\u9FA5])|[^\u4E00-\u9FA5,^a-z,^A-Z,^\d]/g;
            var str_arr = str.split("");
            var result , name, value;

            value = (size ? size : 50);

            if( result = reg.exec( str ) ){
                if(result.index > 1){
                    name = str.slice(0,2).split("");
                    name[0] = name[0].toUpperCase();
                  return ("<span style='font-size:24px;display: block;height:{0}px;line-height:{0}px;'>" + name.join("") + "</span>").format(value);
                }
                if( !result[1] && (result.index === 0)  ){
                  return false;//按照规则需要返回默认头像图片
                }else{
                  return  str_arr[0];
                }
            }else{
                name = str.slice(0,2).split("");
                name[0] = name[0].toUpperCase();
                return ("<span style='font-size:24px;display: block;height:{0}px;line-height:{0}px;'>" + name.join("") + "</span>").format(value);
            }
        }
    }));

 
})(jQuery, _, M139);


﻿M139.namespace("M2012.GroupMail.Model", {
    Base : Backbone.Model.extend({
         initialize:function(options){
             var router = M139.HttpRouter;
             if(!this.isAdded){
                 router.addRouter("groupmail", [
                        "gom:queryGroupList", //获取组列表
                        "gom:getGroupInfo" , //获取组详情
                        "gom:queryMessageList", //获取消息列表
                        "gom:queryMessage", //获取消息全文
                        "gom:sendMessage", 
                        "gom:getUserList",
                        "gom:createGroup",
                        "gom:updateGroup",
                        "gom:delGroupUser",
                        "gom:delGroup",
                        "gom:replyMessage",
                        "gom:sendMail",
                        "gom:invitedUser",
                        "gom:queryInvitedRecord",
                        "gom:getGomUser",
                        "gom:invitationHandle",
                        "gom:exitGroup",
                        "gom:updateUserInfo",
                        "gom:queryGroupList",
                        "gom:photoGallery",  //群相册列表
                        "gom:spaceSize",  //群容量
                        "gom:preDownloadFile",  //相册下载
                        "gom:deleteFile",  //删除相片
                        "gom:batchPreDownload" // 批量下载接口
                 ]);
                 this.isAdded=true;
            }
         },
         /**
          * [成功获取数据时触发的事件对象映射]
          */
         dataEvent : {
               QUERY_GROUP : "gom:queryGroupList" ,
               QUERY_MSG : "gom:queryMessageList",
               BEFORE_QUERY_GROUP : "before:gom:queryGroupList",
               BEFORE_QUERY_MSG : "before:gom:queryMessageList",
               SUCEED_QUERY_GROUP : "succeed:gom:queryGroupList",
               ERROR_QUERY_GROUP : "error:gom:queryGroupList" ,
               BEFORE_REQUEST : "before:request" ,
               AFTER_REQUEST : "after:request"
         },

        request : function( url , options , callback ){
            var that = this ;
            this.trigger(this.dataEvent["BEFORE_REQUEST"] , this , options.events );
            M139.RichMail.API.call( url , options.params , function( result ){
                callback && callback( result );
                that.trigger(that.dataEvent["AFTER_REQUEST"] , result , options.events , that );
            });
        },
        //创建群
         createGroup:function(options,callback){

         },
         //获取群组列表，带消息数，成员数等
         getGroupList: function (callback) {
            var that = this ;
            M139.RichMail.API.call("gom:queryGroupList", {}, function (result) {
                 callback && callback(result.responseData["var"]);

                 //callback(result["var"]);
             });

         },
        //获取群组消息列表，支持分页排序
         getMessageList: function ( callback) {
            var options= {
                groupNumber:this.get("groupNumber")
            };
             M139.RichMail.API.call("gom:queryMessageList", options, function (result) {
                callback && callback(result.responseData["var"]);
                 //callback(result["var"]);
             });
         },
         //展开正文时获取消息内容原文，包括回复信息
         getMessage: function (options,callback) {
             M139.RichMail.API.call("gom:queryMessage", options, function (result) {
                 callback && callback(result.responseData);
                 //callback(result["var"]);
             });
         },
         getMemberList: function ( callback , options) {
             var options = {
                 groupNumber: this.get("groupNumber")
             };
             M139.RichMail.API.call("gom:getGomUser", options, function (result) {
                 callback && callback(result.responseData["var"]);
                 //callback(result["var"]);
             });
         },
         /**
          * [查询用户群组邀请记录]
          * @param  {[type]}   options  [description]
          * @param  {Function} callback [description]
          * @return {[type]}            [description]
          */
         queryInvitedRecord:function(options,callback){
             M139.RichMail.API.call("gom:queryInvitedRecord", options, function (result) {
                 callback && callback(result);
                 //callback(result["var"]);
             });
         },
         /**
          * [群成员接受/忽略邀请]
          * @return {[type]} [description]
          */
        updateInvitation : function( options , callback ){

            M139.RichMail.API.call("gom:invitationHandle", options, function (result) {
                 callback && callback(result);
                 //callback(result["var"]);
             });
        },
          //发送群邮件
         postMessage: function (options, callback) {
             this.request("gom:sendMessage", {params : options}, function (result) {
                 callback && callback(result.responseData);
             });
         },
         // 邮件消息回复
         replyMessage: function (options, callback) {
             this.request("gom:replyMessage", {params : options}, function (result) {
                 callback && callback(result.responseData);
             });
         },
         //创建群组
         createGom: function (options, callback) {
             M139.RichMail.API.call("gom:createGroup", options, function (result) {
                 callback && callback(result.responseData);
                 //callback(result["var"]);
             });
         },
         //编辑群组
         updateGom: function (options, callback) {
             M139.RichMail.API.call("gom:updateGroup", options, function (result) {
                 callback && callback(result.responseData);
             });
         },
         getUserList: function (options, callback) {
             M139.RichMail.API.call("gom:getUserList", options, function (result) {
                 callback && callback(result.responseData);
                 //callback(result["var"]);
             });
         },
         getGroupUserList: function (options, callback) {
             M139.RichMail.API.call("gom:getGomUser", options, function (result) {
                 callback && callback(result.responseData["var"]);
             });
         },
         exitGroup: function (options ,callback) {
             M139.RichMail.API.call("gom:exitGroup", options, function (result) {
                 callback && callback(result.responseData);
             });
         },
        // 上传图片的接口
         uploadFile: function (options, callback) {
            var self = this;
            self.callApi("gom:uploadFile", options, function (result) {
                callback && callback(result.responseData["var"]);
            });
         },
        //获取群组消息列表，支持分页排序
        getGroupMemberList: function ( callback) {
            var options= {
                groupNumber: this.get("groupNumber"),
                pageSize: this.get("pageSize"),
                pageIndex: this.get("pageIndex")
            };
            M139.RichMail.API.call("gom:getUserList", options, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },
        // 时间转化,秒数转化成相应的显示结构
        // 如: 2014-6-5 14:20:26
        transTime : function (time) {
            var date = new Date();
            date.setTime(time * 1000);
            return date.format("yyyy-MM-dd hh:mm:ss");
        }
        
    })
});

﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.Command', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        
        },
		render : function(){
		
		},
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);


﻿
(function (jQuery, _, M139) {

var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.Manage",superClass.extend({

    defaults: {
    	mainState: 'contacts', //首页视图状态
        groupNumber: 0,  //首页当前选择的群ID
        groupName: '', //首页当前选中的群名称
        refreshMain: '', //刷新群组主视图
        refreshNotice: '', //刷新喇叭数量
        pageIndex: 1, //群组列表区当前页码数
        pageSize: 50 //每页显示数（群组人员上限）
    },
    REFRESH_STATE:{
    	DEFAULT: 'defaults', //默认,默认选中第一个群组
    	NEW_GROUP: 'newGroup',//创建群组
    	NOTIFY: 'notify', //状态消息
    	REFRESH: 'refresh' //只刷新不做额外操作
    },
	initialize:function(options){
      	return superClass.prototype.initialize.apply(this, arguments);
	},
	getInviteList:function(callback){
		var groupNumber=this.get("groupNumber");
		superClass.prototype.queryInvitedRecord.call(this,{},function(result){
		    result=$.grep(result,function(n,i){ //筛选当前分组的
				return (n["groupNumber"]==groupNumber)
				
			});
			callback(result);

		})
	},
	createGom: function(options){
	    superClass.prototype.createGom.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	updateGom: function(options){
	    superClass.prototype.updateGom.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }	        
	    });
	},
	getUserList: function (options) {
	    superClass.prototype.getUserList.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	getGroupList: function (opts) {
	    var that = this,
	    	syn = that.dataEvent["QUERY_GROUP"],
	    	params = that.toJSON();

	    try {
	        params = _.extend(params, opts.param);
	    } catch (e) {
	        
	    }
	    
	    M139.RichMail.API.call(syn, params, function (result) {
	        switch (result.responseData["code"]) {
	            case "S_OK":
                    opts.success(result);
	                break;
                case "S_ERROR":
	            	opts.error(result);
	            	break;
	        }

	    });
	},
	getNoticeCount: function (callback, opts) {
	    var that = this,
	    	syn = "gom:queryInvitedRecord",
	    	params = {
	    	    type: 1,
	    	    pageSize: 5,
	    	    pageIndex: 10
	    	};

	    M139.RichMail.API.call(syn, params, function (result) {
	        //var count = result.responseData["totalRecord"];
	        switch (result.responseData["code"]) {
	            case "S_OK":
	                callback && callback(result);
	                that.trigger(syn, result);
	                break;
	            default:
	                break;
	        }

	    });
	},
	exitGroup: function (options) {
	    superClass.prototype.exitGroup.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	validate: function () {
	    
	}
}));

})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.Manage.Main', superClass.extend(
    {
        el: "body",
        template:"",
        MAIN_STATE: {
            GROUP: 'group',
            CONTACTS: 'contacts',
            GROUP_NOTIFY: 'groupNotify'            
        },
        events: {
            "click #btn-create": "createClick"
        },
        initialize: function (options) {
            this.model = options.model;
            var self = this;
            
            this.ui = {};
            this.ui.groupsNav = $('#addr-tab  .groups-nav');
            this.ui.btnCreate = $('#btn-create');
            this.ui.listBody = $('#main_container .addr-list-body');
            this.ui.m139GroupList = $('#group-contacts-list');
            this.ui.m139ContactsList = $('#m139-contacts-list');
            this.ui.mainIframe = $('#main_iframe');
            this.ui.mainContainer = $('#main_container');

            this.ui.leftbarGroup = $('#leftbar-group');
            this.ui.leftbarContacts = $('#leftbar-contacts');            

            this.initEvents();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {            
            var _this = this;
            var ui = this.ui;

            this.model.on('change:mainState', function (args) {
                var state = _this.model.get('mainState');
                _this[state].render(_this, args.target);
            });

            ui.groupsNav.click(function (e) {
                var state = $(this).data('state');

                _this.model.set({ mainState: state }, {silent: true});
                _this.model.trigger("change:mainState",{target: $(this)});
            });
        },
        createClick: function () {
            var key = this.model.get('mainState') == this.MAIN_STATE.CONTACTS ? 'addr_add_contacts' : 'addr_team_create';

            if (key == 'addr_team_create') {
                top.BH('gom_create_group')
            }

            $Addr.trigger('redirect', { key: key });
        },
		render : function(){
		    this.groupPanel = new M2012.GroupMail.View.GroupPanel({ model: this.model });
		    this.memberListView = new M2012.GroupMail.View.MemberList({ model: this.model });
		    this.model.set({ refreshNotice: new Date() });
		},	
		// 初始化模型层数据
		getDataSource : function(callback){
		
		},
        contacts:{
            render: function(self, target){
                var ui = self.ui;

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(0).parent().addClass('liline on');

                ui.listBody.hide();
                ui.leftbarGroup.hide();                

                ui.leftbarContacts.show();
                ui.m139ContactsList.show();

                /*强制刷新通讯录*/
               /*
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId: _DataBuilder.allContactsGroupId()
                }, { showMain: true });
                */
               
                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                    key: 'events:selectGroup',
                    command: 'SELECT_GROUP',
                    data: {
                        groupId: 0                        
                    },
                    param: {
                        showMain: true
                    }
                });

                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                     key: 'events:resetLeftbar'
                });
                
                top.BH('gom_tab_contacts');
            }
        },
        group: {
            render: function (self, target) {
                var ui = self.ui;
                var height = $(window).height();

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(1).parent().addClass('liline on');

                /*强制刷新通讯录*/
                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                    key: 'events:selectGroup',
                    command: 'SELECT_GROUP',
                    data: {
                        groupId: 0                        
                    },
                    param: {
                        showMain: true
                    }
                });

                ui.listBody.hide();                
                ui.leftbarContacts.hide();                                

                ui.leftbarGroup.show();                
                ui.m139GroupList.show().height(height);
                self.model.set({ refreshMain: self.model.REFRESH_STATE.DEFAULT });
                top.BH('gom_tab_group');
            }
        },
        groupNotify:{
            render: function (self, target) {
                var ui = self.ui;
                var height = $(window).height();

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(1).parent().addClass('liline on');

                ui.listBody.hide();
                ui.leftbarContacts.hide();

                ui.leftbarGroup.show();                
                ui.m139GroupList.show().height(height);

                if (!self.memberListView) {
                    self.render();
                }

                top.BH('gom_tab_notify');
                self.model.set({ refreshMain: self.model.REFRESH_STATE.NOTIFY });
                $Addr.trigger('redirect', { key: 'addr_team_notify' });
            }
        }
    }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.MemberList', superClass.extend(
    {
        el: "#group-contact-list",
        template: '<tr><td class="td1">\
                    <input class="memberItem" type="checkbox" id=<%=cid%> />\
                    <i class="<%=cls%>" title="群组创建人"></i>\
                </td>\
                <td class="td2">\
                    <em class="editings_em">\
                        <span class="editings_span" title=<%=name %>>\
                            <%=name %>\
                        </span>\
                    </em>\
                </td>\
                <td class="td3" title=<%=email %>><%=email %></td>\
                <td class="td4" title=<%=mobile %>><%=mobile %></td>\
                <td class="td5" title=<%=tGroups%>><% for (var i in groups) { if(groups[i]) { %> <span class="addr-s-t"><%= groups[i] %></span> <% } } %></span></td>\
                <td class="td6">\
                </td></tr>',
        events: {
        },
        initialize: function (options) {
            top.BH("gom_load_list_success");
            var self = this;
            this.model = options.model;

            this.collection = new Backbone.Collection;
            this.toolbar = new M2012.GroupMail.View.toolbar({ model: options.model });

            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var self = this;

            this.collection.on('add', function (e) {
                var cls = e.get('owner') != 1 ? '' : 'i-addrPeople';
                var groups = M139.Text.Html.encode(e.get('gomName')).split(",");
                var template = _.template(self.template);
                var item = template({
                    cid: e.cid,
                    cls: cls,
                    name: M139.Text.Html.encode(e.get('name')),
                    email: M139.Text.Html.encode(e.get('email')),
                    mobile: e.get('mobile'),
                    groups: groups,
                    tGroups: groups.join("、")
                });

                $(self.el).append(item);
            });

            this.collection.on('reset', function (e) {
                $(self.el).html('');
            });

            $("#toggle-team-contacts").click(function () {
                var check = this.checked;
                $("input.memberItem").each(function () { this.checked = check; });

                var checkedLength = $("input.memberItem:checked").length;
                //改变样式，获取选取长度
                self.changeNameField(checkedLength);
            });

            $(self.el).delegate("input.memberItem", "click", function () {
                var checkedLength = $("input.memberItem:checked").length;
                self.changeNameField(checkedLength);
                if (checkedLength == self.collection.length) {
                    $("#toggle-team-contacts").attr("checked", true);
                }
                if (checkedLength == 0) {
                    $("#toggle-team-contacts").attr("checked", false);
                }
                
            });

            $("#nameTd").delegate("#cancelSelect", "click", function () {
                $("#toggle-team-contacts").prop("checked", false);
                $(".memberItem").each(function () {
                    if (this.checked) {
                        this.checked = false;
                    }
                });
                $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
            });

            this.model.on("change:groupNumber", function (e) {
                self.model.getGroupMemberList(function (result) {
                    if (result && result["users"].length > 0) {
                        //清空集合
                        self.collection.reset();

                        //初始化群成员的checkbox和表头
                        self.initMemberHeader();

                        _.each(result["users"], function (u) {
                            self.collection.add(u);
                        });
                    }
                });
            });
            
            this.model.on('addContact', function (arr) {
                $(self.el).find("input.memberItem").each(function () {
                    if (this.checked) {
                        var item = self.collection.get(this.id);
                        arr.push(item.toJSON());
                    }
                });
            });
        },
        render: function () {
            var self = this;
            $(self.el).html(_.template(self.template));
        },
		changeNameField: function (checkedLength) {
		    if (checkedLength != 0) {
		        $("#nameTd")[0].innerHTML = "<span class='hide'>姓名 <a href='javascript:;' class='i-d-up'></a></span>" +
                    "<span>已选择：<strong class='c_ff6600'>" + checkedLength + "</strong>个联系人 <a href='javascript:;' class='c_ff6600' id='cancelSelect'>取消选择</a></span>";
		    } else {
		        $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
		    }
		},
        initMemberHeader: function() {
            if ($("#toggle-team-contacts").length != 0 && $("#nameTd").length != 0) {
                if ($("#toggle-team-contacts").prop("checked"))
                    $("#toggle-team-contacts").prop("checked", false);
                $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
            }
        }
    }));
})(jQuery, _, M139);

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.toolbar', superClass.extend(
    {
        el: "#group_toolbar",
        DEFAULT_TIP: {
            EXIT_SUCCESS: '您已退出群组',
            EXIT_FAIL: '暂时无法处理该请求，请稍后再试',
            SELECTED: '请选择联系人',
            ALL_EXIST: '联系人已在通讯录中',
            EXIT_AFFIRM: '退出后，将接收不到此群组的邮件。确定退出？'
        },
        events: {
            "click #goBack": "back",
            "click #group_exit": "groupExit",
            "click #grourp_edit": "groupEdit",
            "click #grourp_send_mail": "groupSendMail",
            "click #group_add_contacts": "groupAddContacts"
        },
        initialize: function (options) {
            this.model = options.model;
            var self = this;

            this.contactsModel = new top.M2012.Contacts.getModel();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
           

        },
        render: function () {
          

        },
        groupExit: function () {
            var _this = this;            

            top.$Msg.confirm(_this.DEFAULT_TIP.EXIT_AFFIRM, function () {
                var options = {
                    groupNumber:  _this.model.get('groupNumber')
                };

                options.success = function (result) {
                    _this.model.set({ refreshMain: _this.model.REFRESH_STATE.DEFAULT});
                    _this.model.set({ refreshNotice: new Date() });
                    top.BH('gom_exit_success');                    
                    top.M139.UI.TipMessage.show(_this.DEFAULT_TIP.EXIT_SUCCESS, { delay: 3000});
                };

                options.error = function (result) {
                    top.$Msg.alert(_this.DEFAULT_TIP.EXIT_FAIL);
                };

                _this.model.exitGroup(options);
            });

            top.BH('gom_exit_group');
        },
        groupEdit: function () {
            var groupNumer = this.model.get('groupNumber');
            top.BH('gom_edit_group');
            $Addr.trigger('redirect', { key: 'addr_team_edit', groupNumner: groupNumer });
        },
        groupSendMail: function () {
            var groupName = this.model.get('groupName');
            var groupNumber = this.model.get('groupNumber');

            top.BH('gom_send_mail');
            top.$App.show('writeGroupMail', { groupNumber: groupNumber, groupName: groupName });
        },
        groupAddContacts: function () {
            var editor;
            var _this = this;
            var list = [];
            var addList = [];
            var contacts = top.Contacts;

            this.model.trigger('addContact', list);

            _.each(list, function(e){
                if(!contacts.isExistEmail(e.email) && !contacts.isExistMobile(e.mobile)){
                    addList.push(e);
                }
            });

            if (addList && addList.length > 0) {                
                editor = new top.M2012.UI.Dialog.ContactsEditor({ addContacts: addList });
                editor.batchrender();
                editor.on('success', function (result) {
                    if(result.success){
                        _this.addContacts(result.contacts);
                    }
                    editor.dialog.close();
                    top.BH('gom_add_contacts_success');
                });

                editor.on('cancel', function () {
                    editor.dialog.close();
                });                
            } else {                
                var tip = list.length ? this.DEFAULT_TIP.ALL_EXIST : this.DEFAULT_TIP.SELECTED;
                top.M139.UI.TipMessage.show(tip, { delay: 3000, className: "msgYellow" });                
            }

            top.BH('gom_add_contacts');
        },
        addContacts: function(result){
            var options = {};
            var master = top.$Addr;
            var data = result ? result[0] : false;
            if(master){                
                if(data){
                    options = {
                        actionKey: '110',
                        key: 'events:contacts',                        
                        contactId: data.SerialId,
                        groupId: data.GroupId.split(',')
                    };

                    master.trigger(master.EVENTS.LOAD_MODULE, options);
                }else{
                    options = {
                        actionKey: '310',
                        key: 'events:contacts'
                    };

                    setTimeout(function(){
                        master.trigger(master.EVENTS.LOAD_MODULE, options);                        
                    }, 5000);
                }                
            }
        },
        back: function () {
            if (top.$Addr) {
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }
        }
    }));
})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.GroupPanel', superClass.extend(
    {
        el: "#div_teamlist",
        template: $("#tpl-team-groups-item").html(),
        events: {
            "click li[gn]": "groupClick",
            "mouseover [gn]": "mouseoverHandler",
            "mouseleave [gn]": "mouseleaveHandler"
        },        
        initialize: function (options) {
            var self = this;
            this.model = options.model;

            this.initUI();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function() {
            this.container = $("#div_teamlist");
        },
        initEvents: function () {
            var self = this;
            $(window).resize(function () {
                self.setGroupsListHeightNew();
                self.setGroupMemberListHeight();
            });

            this.model.unbind(self.model.dataEvent["QUERY_GROUP"]);
            this.model.on(self.model.dataEvent["QUERY_GROUP"], function (result) {
                self.render(result);
            });

            this.model.unbind("change:refreshMain");
            this.model.on("change:refreshMain", function (e, o, args) {
                if (self[o]) {
                    self[o].render.call(self, args);
                    this.set({refreshMain: null}, {silent: true});
                }
            });

            this.model.unbind("change:refreshNotice");
            this.model.on("change:refreshNotice", function () {
                self.model.getNoticeCount(self.renderNoticeCount);
            });

            this.model.on("change:groups", function () {
                this.trigger("change:groupNumber");
            });
        },
        groupClick: function (e) {
            var cur = e.target || e.srcElement;
            while(!cur.getAttribute("gn")){
                cur = cur.parentNode;
            }
            top.BH("gom_group_rows");
            $Addr.trigger($Addr.EVENTS.LOAD_MAIN);
            var groupNumber = $(cur).attr("gn"), num = 0;
            // 进入群组页面, 直接点击"发群邮件"按钮, groupName为空, 保存操作在render方法里面处理
            //var groupName = $($(cur).find(".numN")[0]).prop("title");
            this.model.set("groupNumber", groupNumber);
            //this.model.set("groupName", groupName);

            var target = this.model.get("groups");
            _.find(target, function (group, order) {
                num = order;
                return parseInt(group["groupNumber"], 10) === parseInt(groupNumber, 10);
            });
            this.model.set("groups", target);
            this.render();
		},
		mouseoverHandler: function (e) {
		    e = e || window.event;
		    var cur = e.target || e.srcElement;
		    while (cur.tagName !== "LI") {
		        cur = cur.parentNode;
		    }
		    if (cur.className === "on") {
		        return;
		    }
		    cur.className = " hover";
		},
		mouseleaveHandler: function (e) {
		    e = e || window.event;
		    var cur = e.target || e.srcElement;
		    while (cur.tagName !== "LI") {
		        cur = cur.parentNode;
		    }
		    cur.className = cur.className.replace(" hover", "");
		},
		render: function (data) {
		    var self = this,
                result;

		        if (!data) {
		            data = this.model.get("groups");
		        } else {
                    data = data.responseData["var"];
                }

		        result = data;

		        _.each(result, function (obj, order) {
		            if (parseInt(obj["groupNumber"], 10) === parseInt(self.model.get("groupNumber"), 10)) {
                        self.model.set("groupName", obj['groupName']); // 保存群组名称
		                obj.current = true;
		            } else {
		                obj.current = false;
		            }
		        });

		        if (result && result.length > 0) {
                    self.hasGroupHandlers(result);
                } else {
                    self.noGroupHandlers();
                }
        },
        setGroupsListHeightNew: function() {
            $("#div_teamlist").css("height", "");
            var _this = this;
            var $parent = _this.$el.parent();
            var windowHeight = $(window).height();
            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").outerHeight();
            }
            var totalHeight = $("#addr-left-btns").outerHeight() + $("#addr-tab").height() + maybeKnownHeight + $("#div_teamlist").height() + 65;
            if (totalHeight > windowHeight) {
                var parentHeight = $parent.height();
                $("#div_teamlist").height(parentHeight - (totalHeight - windowHeight));
            }
        },
        //设置群成员列表高度
        setGroupMemberListHeight :function () {
            var $rootPanel = $("#group-contacts-list");
            var $target = $rootPanel.find(".addr-list");
            var toolbarHeight = $("#group_toolbar").height();
            var contactsHeaderHeight = $("#teamTable").height();

            // 页面固定占用的高度
            var fixedHeight = toolbarHeight + contactsHeaderHeight + 20;

            var windowHeight = $(window).height();
            $target.height(windowHeight - fixedHeight);
        },
        //渲染铃铛信息数
        renderNoticeCount: function (result) {
            var count = parseInt(result.responseData["totalRecord"]);
            if (count > 99) {
                $("#span_notify")[0].innerHTML = "<span>99</span>";
            } else if (count == 0) {
                $("#span_notify")[0].innerHTML = "";
            } else {
                $("#span_notify")[0].innerHTML = "<span>" + count + "</span>";
            }
        },
        defaults: {
            render: function(args){
                //默认
                // 1.刷新群组和列表区
                // 2.选中第一个群组
                var self = this;
                args.callback = function(result) {
                    var data = result.responseData["var"];
                    if (data && data.length > 0) {
                        self.model.set({"groupNumber": data[0].groupNumber});
                    }
                };
                this.refresh.render.call(this, args);
            }
        },
        newGroup: {
            render: function(args){
                //新建群组
                // 1.刷新群组和列表区
                // 2.选中创建的组
                //args = {groupNumber: 1111}]
                var self = this;
                this.refresh.render.call(this, args);
                self.model.set({"groupNumber": args.groupNumber});
            }
        },
        notify: {
            render: function(args){
                //点击消息区
                // 1.刷新群组和列表区
                var self = this;
                args.callback = function() {
                    self.model.set({"groupNumber": null});
                };
                this.refresh.render.call(this, args);
            }
        },
        refresh: {
            render: function(args){
                //常用, 只刷新不做额外的操作
                // 1.刷新群组和列表区
                var _this = this;
                var options = {};
                options.success = function(result) {
                    _this.model.set({groups: result.responseData["var"]});
                    if(args.callback) {
                        args.callback(result);
                    }
                    _this.model.trigger(_this.model.dataEvent["QUERY_GROUP"], result);
                };

                options.error = function(result) {
                    if (result.responseData["summary"] == "服务端校验不通过") {
                        top.$App.setSessionOut();
                    }
                };

                this.model.getGroupList(options);
            }
        },
        hasGroupHandlers: function(result) {
            var self = this;
            $("#div_teamlist").show();
            //$("#group-contacts-list").show();
            $("#group-contacts-list-new").show();
            $("#member-no-group-container").hide();
            $("#div_leftBarNoGroup").hide();
            $("#downCreate").show();
            $(this.el).html(_.template($("#tpl-team-groups-item").html(), {data: result}));
            self.setGroupsListHeightNew();
        },
        noGroupHandlers: function() {
            $("#div_teamlist").hide();
            //$("#group-contacts-list").hide();
            $("#group-contacts-list-new").hide();
            new M2012.GroupMail.View.LeftBarNoGroup().render();
            $("#div_leftBarNoGroup").show();
            // TODO
            $("#div_leftBarNoGroup").height(352);
            new M2012.GroupMail.View.NoGroup().render();
            $("#member-no-group-container").show();
            $("#downCreate").hide();
        }
    }));
})(jQuery, _, M139);


(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.LeftBarNoGroup', superClass.extend(
        {
            el: "#div_leftBarNoGroup",
            template: '<div style="padding-left:46px; position: absolute; top:50%; left:0; margin-top:-32px;"> \
    <p class="gray mb_10">将联系人存为群组<br>轻松发送群邮件</p> \
    <p><a id="leftbarCreate" href="javascript:;" style="width:auto; height:auto; margin:0; float:none; display: inline;">新建群组</a></p></div>',
            events: {
                "click #leftbarCreate" : "createGroup"
            },
            initialize: function() {
                return superClass.prototype.initialize.apply(this, arguments);
            },
            render: function() {
                var self = this;
                $(self.el).html(_.template(self.template));
            },
            createGroup: function() {
                top.BH("gom_null_create_leftgroup");
                $Addr.trigger('redirect', { key: 'addr_team_create' });
            }
        }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.NoGroup', superClass.extend(
    {
        el: "#member-no-group-container",
        template: '<div class="p_relative emptyGroup"> \
            <h3>高效沟通的利器——群邮件</h3> \
        <p class="fz_12 c_666 empty_sub">使用群邮件，更好地进行 项目讨论、小组会议、流程沟通····</p> \
    <div class="ta_c" style="padding-top: 330px"> \
        <a href="javascript:;" class="btnSetG" hidefocus=""><span>新建群组</span></a> \
        </div> \
    </div>',
        events: {
            "click .btnSetG": "createTeam"
        },
        initialize: function (options) {
            //this.model = options.model;
            //this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
           
        },
        createTeam: function() {
            //群成员列表引导用户新建群组按键事件
            top.BH("gom_null_create_rightgroup");
            $Addr.trigger('redirect', { key: 'addr_team_create' });
        },
		render : function(){
		    $(this.el).html(_.template(this.template));
		},
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);


