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

﻿
(function (jQuery, _, M139) {
var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.List",superClass.extend({

    defaults:{  
       groupNumber:null, //群号码
       pageSize:20, //每页显示条数
       pageIndex:1,  //当前页码
       hasSendContent : false, //  发信窗口中是否有内容,默认为false
       dataSum : {},  // 数据数目, 包括群邮件和群会话, 用于标签页切换
       currentView : "groupSession", // 默认当前视图为会话视图
       currentGroupLoadComplete : true,  // 当前群组的群消息是否已经加载完成, 默认加载完成
       currentAlbumLoadComplete : true,  // 当前群组的群相册是否已经加载完成, 默认加载完成
       isFirstAlbumInit : true,  // 判断是否是第一次创建Album,默认是
       cacheScrollTop : {} // 保存缓存的滚动条滚动的高度, 切换tab页时需要回填
	},
	initialize : function(options){
      return superClass.prototype.initialize.apply(this, arguments);
	},
	getGroupList : function ( callback , opts ) {
	    var that = this ,
	    	syn = that.dataEvent["QUERY_GROUP"] ,
	    	options ,
	    	params = that.toJSON() ;

    	if( typeof callback !== "function" ){
    		opts = callback ;
    		callback = undefined ;
    	}
		try{
			//params = _.extend( params , opts.param );
		}catch(e){
			//console.warn(e);
		}
	    options = opts || {};
	    /**
	     * 当silent为true时，不触发事件
	     */
	    if(!options.silent){
	    	that.trigger( that.dataEvent["BEFORE_QUERY_GROUP"] );
	    }
	    this.request( syn , {
	    	params:params
	    } , function (result) {
	    	var data = result.responseData["var"],
	    		gNumber = that.get("groupNumber");
	    		try{
	    			/**
	    			 * 有可能数据为空，抛出异常
	    			 */
			    	if(!gNumber){
			    		that.set("groupNumber" , data[0]["groupNumber"]);
			    		that.set("totalRecord" , data[0]["totalMsgCount"]);
                        // 将userId保存
                        that.set("currentUserId", data[0].userId);
			    		data[0]["unreadCount"] =  0;
			    	}
		    	}catch(e){
		    		// throw {
		    		// 	msg:""
		    		// }
		    		//console.warn(e);
		    	}
		    switch(result.responseData["code"]){
		    	case "S_OK":
			    	that.set( "groups" , data );
			    	callback && callback(result.responseData["var"]);
			        that.trigger( syn , result );
			        if(!options.silent){
			       		that.trigger( that.dataEvent["AFTER_QUERY_QROUP"] );
			    	}
			        break;
			    case "FS_UNKNOWN":
			    	that.trigger( that.dataEvent["ERROR_QUERY_GROUP"] , result );
			    	break;
			    default:
			    	break;
	        }
	   
	     });
	} ,
	getMessageList : function( callback ,  opts ){
		var params = {
		        groupNumber : this.get("groupNumber") , 
		        pageSize : this.get("pageSize") , 
		        pageIndex : this.get("pageIndex")
		        //此接口还需要以下数据
		        // userId
		        // userName
		        // groupName
	    	} , 
	    	options ,
	    	that = this ,
	    	syn = that.dataEvent["QUERY_MSG"];
    	if( typeof callback !== "function" ){
    		opts = callback ;
    		callback = undefined ;
    	}
		try{
			params = _.extend( params , opts.param );
		}catch(e){

		}
    	options = opts || {};
        if(!options.silent){
       		that.trigger(that.dataEvent["BEFORE_QUERY_MSG"]);
    	}
    	this.request( syn , {
    		params : params
    	}, function (result) {
            that.set("totalRecord" , parseInt(result.responseData["var"].totalRecord ) );
	    	callback&&callback(result.responseData["var"]);
	        that.trigger( syn , result );
	       if(!options.silent){
	       		that.trigger(that.dataEvent["AFTER_QUERY_MSG"]);
	    	}
	    });
	} ,
	queryGroupDetail : function( gNumber , callback ){
		this.request( "gom:getGroupInfo" , {
			events : {
				typeName : "DetailGroupInfo" 
			} ,
			params : {
				groupNumber : gNumber
			}
		} );

	}
}));

})(jQuery, _, M139);
﻿(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M2012.GroupMail.Model.Base;
    M139.namespace("M2012.Album.Model", superClass.extend({
        defaults: {
            //上传是否批量上传
            isBatchUpload: false,
            //上传事物id
            batchTransId: '0',
            //选中相片id，并且是当前用户上传，删除专用
            selectedIds: [],

            //除删除之外（下载、发送、存彩云用）
            commonIdS: [],

            //当前用户id
            curUserId: 0,

            //当前用户姓名
            curUserName: '',

            //当前用户email
            curEmail: '',

            //当前用户是否群管理员
            isAdmin: false,

            //当前页数
            point: 1,

            //每页记录数
            pointSize: 5,

            pageCount: 0,

            // 时间轴对应下的所有图片的下载地址
            downloadUrlList : {},

            // 预览图片对象
            focusImagesView : {},

            //
            uploadFileList : {}
        },
        imageExts: "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
        thumbnailSize: "80*80", //缩略图大小
        capacity: 1, //相册容量，单位GB
        tipWords: {
            DELETE_SUC: "图片已删除",
            DELETE_FAIL: "图片删除失败",
            DELETE_CONFIRM: "图片删除后不可恢复，确定删除图片？",
            DOWNLOAD_FAIL: "图片下载失败"
        },
        name: "M2012.Album.Model",
        logger: new top.M139.Logger({
            name: "M2012.Album.Model"
        }),
        callApi: M139.RichMail.API.call,

        albumEvent: {
            GET_ALBUM_LIST: "gom:photoGallery",
            GET_SPACE_SIZE: "gom:spaceSize",
            DOWNLOAD: "gom:preDownloadFile",
            DELETE: "gom:deleteFile",
            UPLOAD: "gom:uploadFile"
        },

        initialize: function (options) {
            this.initEvent();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvent: function () {

            
        },

        // 获取文件拓展名
        getExtName: function (fileName) {
            if (fileName) {
                var reg = /\.([^.]+)$/;
                var results = fileName.match(reg);
                return results ? results[1].toLowerCase() : "";
            } else {
                return "";
            }
        },

        formatDate: function (d) {
            var D = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
            with (d || new Date)
                return [D[getHours()] || getHours(), D[getMinutes()] || getMinutes()].join(' : ');
        },

        //群相册列表
        getAlbumList: function (callback, opt) {
            var self = this;
            self.callApi("gom:photoGallery", { groupNumber: opt.groupNumber, point: opt.point, pointSize: 5 }, function (result) {
                callback && callback(result);
            });
        },

        //群相册获取相册容量
        getSpaceSize: function (callback, opt) {
            var self = this;
            self.callApi("gom:spaceSize", { groupNumber: opt.groupNumber }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //群相册删除相片
        deletePics: function (callback, opt) {
            var self = this;
            self.callApi("gom:deleteFile", { groupNumber: opt.groupNumber, fileId: opt.picArr }, function (result) {
                callback && callback(result);
            });
        },

        //群相册下载相片
        downloadPics: function (callback, opt) {
            var self = this;
            self.callApi("gom:preDownloadFile", { groupNumber: opt.groupNumber, fileId: opt.picArr }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //上传
        uploadPics: function (callback, opt) {
            var self = this;
            self.callApi("gom:uploadFile", { groupNumber: opt.groupNumber, transId: opt.transId, comefrom: 1 }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        // 批量下载接口
        batchPreDownload: function (callback, opt) {
            var self = this;
            self.callApi("gom:batchPreDownload", { groupNumber: opt.groupNumber, operateType: 2, fileId : opt.fileId}, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //存彩云
        saveCaiyunbatchPreDownload: function (callback, opt) {
            var self = this;
            self.callApi("gom:batchPreDownload", { groupNumber: opt.groupNumber, operateType: 2, fileId: opt.fileId }, function (result) {
                callback && callback(result);
            });
        }

    }));
})(jQuery, Backbone, _, M139);

﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase,
        interval = 0,
        firstLoad = true;
    M139.namespace('M2012.GroupMail.View.Main', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        tips: {
            loading : "正在加载中...",
            query_error_tip : "查询出错...",
            close_tab_tip : '关闭写信页，未保存的内容将会丢失，是否关闭？'
        },
        initialize: function (options) {
            this.model = new M2012.GroupMail.Model.List();


            //群相册
            this.albumModel = new M2012.Album.Model();
            // isGroupAlbumFirstLoad,标记群相册是否是首次加载
            this.albumModel.set("isGroupAlbumFirstLoad", true);


            this.initEvents();
            //@fixed lt IE8 width bug
            top.$("#groupMail").css({
                width:"100%"
            });
            //从通讯录进来的iframe ID
            top.$("#writeGroupMail").css({
                width:"100%"
            });            
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var model = this.model,
                albumModel = this.albumModel,
                that = this;
            /**
             * 注册覆盖层事件
             * @return {[type]} [description]
             */
            model.on( model.dataEvent["BEFORE_QUERY_MSG"] , function(){
                top.M139.UI.TipMessage.show(that.tips.loading);
            });

            model.on( model.dataEvent["BEFORE_QUERY_GROUP"] , function(){
                top.M139.UI.TipMessage.show(that.tips.loading);
            });

            model.on( model.dataEvent["ERROR_QUERY_GROUP"] , function( result ){
                top.M139.UI.TipMessage.show(that.tips.query_error_tip);
            });

            model.on( model.dataEvent["AFTER_QUERY_GROUP"] , function(){
                top.M139.UI.TipMessage.hide();
            });

            model.on( model.dataEvent["AFTER_QUERY_MSG"] , function(){
                top.M139.UI.TipMessage.hide();
            });

            model.on( model.dataEvent["AFTER_REQUEST"] , function( response ){
                var data = response.responseData ; 
                if( data.code === "S_ERROR" && data.summary === "服务端校验不通过"){
                    top.$App.setSessionOut();
                }
            });

            // 当点击写群邮件按钮时,所做的处理
            model.on("call:postMessage",function(param) {
                // 调用后台发送邮件接口
                model.postMessage({
                    "groupNumber" : model.get("groupNumber"),
                    "content" :  param.content, // todo $T.Html.encode(param["content"])
                    "contentThum" : param.contentThum
                },function(response) {
                    if (response["code"] != "S_OK") {
                        top.M139.UI.TipMessage.show('发送失败', { delay: 3000, className: "msgRed"});
                        _.isFunction(param.fail) && param.fail();
                        return;
                    }

                    top.M139.UI.TipMessage.show('发送成功', { delay: 3000 });
                    // 关闭窗口
                    _.isFunction(param.success) && param.success();
                    // 刷新消息列表
                    model.getMessageList();
                },function () {
                    // 异常的情况
                    top.M139.UI.TipMessage.show('发送失败', { delay: 3000, className: "msgRed"});
                    _.isFunction(param.fail) && param.fail();
                });
            });

            // 当点击写群邮件按钮时,调用的方法
            model.on("writeGroupMail",function() {
                model.trigger("createEvocation", {
                    'to':'4',
                    'type': '1',
                    'specify': $T.Html.decode(model.get("groupName")) || 'unknown', // 发送对象为该群组的名称,默认未知
                    'dialogTitle' : '写群邮件',
                    'flag' : 'groupMail',
                    'callback' : function (param) { // 点击弹窗中的"发送"按钮时,触发回调函数
                        model.trigger("call:postMessage", param);
                    }
                })
            });

            // 点击创建群组按钮，调用的方法
            model.on("createGroup", function () {
                top.$App && top.$App.show("teamCreate");
            });

            // 创建写信或回复信息的窗口
            model.on("createEvocation", function (params) {
                var that = this;
                if (top.SiteConfig.evocation) {
                    var option = {};
                    if (typeof params == "string") {
                        var param = params || "";
                        param = param.split('&');
                        for (var i = 0; i < param.length; i++) {
                            option[param[i].split('=')[0]] = param[i].split('=')[1]
                        }
                    } else if (typeof params == "object") {
                        option = params;
                    }

                    // groupmail.evocation.pack.js只加载一次
                    if (that.isEvocationJsLoaded) {
                        // 鼠标连续点击,也只会打开一个窗口
                        top.currentEvoctionPop.isClosed && _.isFunction(top.M2012.GroupMail.View.Evocation) && new top.M2012.GroupMail.View.Evocation(option);
                        return;
                    }

                    document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
                    // 为了解决遮罩层的问题,将groupmail.evocation.pack.js加载到顶层页面
                    top.M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/groupmail/groupmail.evocation.pack.js", charset: "utf-8" }, function () {
                        that.isEvocationJsLoaded = true;
                        // 创建时去顶层查找M2012.GroupMail.View.Evocation构造函数
                        _.isFunction(top.M2012.GroupMail.View.Evocation) && new top.M2012.GroupMail.View.Evocation(option);
                    });
                }
            });

            // 页面加载完成,外部才能通过配置进行页面的跳转
            model.on("change:load_complete", function () {
                that.redirect();
            });

            // 监听未读的群消息数,如果查看了消息,则修改数目
            model.on("change:reduceGroupMail", function() {
                top.appView && top.appView.trigger("reduceGroupMail");
            });

            // 窗口改变时动态调整高度
            // id: 表示要调整容器的id
            model.on("adjustHeight", function (id){
                var container = $("#" + id),
                    top = container.offset().top,
                    bodyHeight = $(document.body).height();
                container[0].style.overflowY = 'auto';
                container.height(bodyHeight - top);
            });

            // tab页签切换时, 展示对应的视图
            model.on("showCurrentView", function (view) {
                // 当前页面所处的视图
                var currentView = model.get("currentView");
                // 显示引导页, true时当前列表中有数据, 不需要显示, false表示没有任何数据要显示
                var showDirection = !!model.get("dataSum")[currentView];

                if (showDirection) {
                    // 不显示引导页
                    (currentView == "groupAlbum") ? $("#groupSession").hide() : $("#groupAlbum").hide();
                    $("#" + currentView).show();
                    isCacheScrollTop(currentView);
                }else{
                    // 显示引导页, 注意下面的注释信息****
                    if (currentView == "groupAlbum"){
                        $("#groupSession").hide();
                        $("#" + currentView).hide(); // 群相册中引导页跟主显示区域不在同一个容器中, 需要要隐藏掉主显示区域
                        isCacheScrollTop(currentView);
                    }else{
                        $("#groupAlbum").hide();
                        $("#" + currentView).show(); // 群邮件中引导页跟主显示区域列表在同一个容器中, 不能隐藏掉主显示区域
                        isCacheScrollTop(currentView);
                    }
                }

                function isCacheScrollTop(view) {
                    // 需要重置滚动条的状态
                    var obj = {
                        groupSession : "mainMsgListWrapper",
                        groupAlbum : "groupAlbum_time"
                    };

                    var containerName = obj[view];
                    var cacheScrollTop = model.get("cacheScrollTop")[containerName];

                    if (cacheScrollTop) {
                        // 如果缓存中有保存滚动条的滚动高度, 则回填
                        // 解决在非FF的浏览器下, 切换标签页滚动条未保存滚动状态的问题
                        $("#" + containerName).scrollTop(cacheScrollTop);
                    }
                }
            });

            // tab页签切换后, 在切换不同的群组, 要改变顶上的群名称显示
            model.on("changeToolbarGroupName", function() {
                // 回填群组图标和群组名称
                 $("#groupAlbum_title").html($T.Utils.format("<i class='{groupIcon}'></i>{groupName}", {
                    groupName: that.model.get("groupName"),
                    groupIcon: that.model.get("groupIcon")
                }));
            });

            // 点击tab页签时触发
            $("#groupAlbumTabs ul li").click(function (e) {
                var targetElementName = $(this).data("target");
                $(this).removeClass("").addClass("groupOn").siblings().removeClass("groupOn");
                model.set("currentView", targetElementName);
            });

            // 视图改变时触发
            model.on("change:currentView", function() {
                var currentView =  model.get("currentView");
                var isFirstAlbumInit = model.get("isFirstAlbumInit");
                // 当前视图是"群相册"视图
                if (currentView == "groupAlbum"){
                    // 判断是否是第一次创建Album
                    if (isFirstAlbumInit) {
                        // 如果还未创建, 则创建, 该逻辑只会在页面初始化时走一次
                        new M2012.GroupMail.View.Album({ model: albumModel, groupmailModel: model });
                        albumModel.trigger(albumModel.albumEvent["GET_ALBUM_LIST"], true);
                        model.set("isFirstAlbumInit", false);
                    }else{
                        // 如果是, 在判断当前视图是否已经加载过了, 没有加载就重新调用后台接口加载一次, 已经加载了直接显示视图
                        !model.get("currentAlbumLoadComplete") ? albumModel.trigger(albumModel.albumEvent["GET_ALBUM_LIST"], false) : model.trigger("showCurrentView");
                    }
                }else {
                    // 当前视图是"群邮件"视图, 直接判断是否已经加载过, 不需要做是否创建的逻辑, 因为进入群邮件，就已经创建了msglist
                    !model.get("currentGroupLoadComplete") ? model.getMessageList() : model.trigger("showCurrentView");
                }
            });
            /**
             * 实时改变保存在model中的群组未读消息数据
             * 保证点击群组时, 缓存中群组对应的未读消息能够同步
             * @param groupNumber
             */
            model.on("changeGroupMsgUnreadCount", function(obj) {
                var groups = that.model.get("groups"),
                    groupNumber = obj.groupNumber,
                    unreadNum = obj.unreadNum || 0;
                _.find( groups , function( group , order ){
                    if (Number(group["groupNumber"]) === Number(groupNumber)) {
                        groups[order]["unreadCount"] = unreadNum;
                    }
                });
            });

            /**
             * 当向编辑窗口中输入文字, 或插入图片时
             * 需动态的调整外层容器的高度
             * 实现原理: 编辑器中的body高度与外层容器的高度一致
             */
            model.off("changeGroupMailWriteMessageWinHeight").on("changeGroupMailWriteMessageWinHeight", function(obj) {
                var frameDoc = $("#htmlEdiorContainer").find("iframe")[0].contentWindow.document;
                // 不知道为何除火狐外的所有浏览器都不支持scrollHeight..
                $("#editContent").height(frameDoc.body.offsetHeight); // offsetHeight?? // 外层容器的高度和body的scrollHeight相等, 自适应高度
            });

            /**
             * 发送消息成功之后,需要做的操作
             * 1.清空编辑框中的信息
             * 2.显示占位提示信息
             * 3.重新设置外层容器的高度为默认值(这里为130像素)
             */
            model.off("cleanGroupMailContent").on("cleanGroupMailContent", function() {
                model.htmlEditorView.setEditorContent("");// 清空内容
                model.htmlEditorView.editorView.showPlaceHolder();// 显示占位信息
                $("#editContent").height("130px"); // 默认高度130像素
            });

            /**
             * 保存当前群组未读消息时触发
             * 如果未读消息数目不为0, 则显示消息提示条
             * 反之则隐藏
             */
             model.off("isShowNewMsgBar").on("isShowNewMsgBar", function(obj) {
                 if (!obj) {
                     return;
                 }

                 var newMsgContainer = $("#newMsgContainer");

                 // obj.unreadNum为0时有两种情况
                 // 1. 切换到第一页
                 // 2. 未读数目设置为0
                 if (!Number(obj.unreadNum)) {
                     newMsgContainer.hide();
                     return;
                 }

                 // 否则显示
                 newMsgContainer.show()
             });

            /**
             * 关闭群邮件标签页之前, 判断写信的内容是否为空
             * 如果为空提示用户
             */
            top.$App && top.$App.on("closeTab", function(args) {
                if (args.name && args.name === 'groupMail') {
                    var hasSendContent = model.get("hasSendContent");
                    if (hasSendContent) {
                        if(window.confirm(that.tips.close_tab_tip)){
                            top.M139.UI.TipMessage.hide();
                            args.cancel = false;
                            top.$App.off("closeTab", arguments.callee);
                        }else{
                            args.cancel = true;
                        }
                    }else {
                        top.M139.UI.TipMessage.hide();
                        args.cancel = false;
                        top.$App && top.$App.off("closeTab", arguments.callee);
                    }
                }
            });

            // 当移除掉写信输入框中的焦点时触发
            model.off("isShowPlaceHolder").on("isShowPlaceHolder", function (callback) {
                var hasSendContent = model.get("hasSendContent");
                // 输入框中没有内容时, 才显示占位提示
                _.isFunction(callback) && callback(hasSendContent);
            });
        },
        render : function() {

            var model = this.model;
            var albumModel = this.albumModel;

            window.$App = new M2012.GroupMail.App();
            // 先清除掉监听事件，防止重复绑定
            top.$App.off("changeGroupMsgSum");

            // 消息列表
            new M2012.GroupMail.View.MsgList({ model:model });
            // 分页显示
            new M2012.GroupMail.View.msgPager({ model : model });


            // 群成员列表展示
            new M2012.GroupMail.View.Session.MemberList({model: model});

            // 群组列表
            new M2012.GroupMail.View.GroupList({model: model});

            // 群相册展示
            // new M2012.GroupMail.View.Album({ model: albumModel, groupmailModel: model });
            // 初始化写信窗口
            model.htmlEditorView = new M2012.Compose.View.HtmlEditor({groupmailModel : model, model : {}});
        },
		getDataSource : function(callback){
		
		},
        /**
         * 页面重定向
         * 公开群邮件部分功能供其他模块调用t
         * 调用方式： $App.show(key,{}); key配置在全局变量window.LinkConfig中
         */
        redirect: function () {
            var that = this,
                value = $Url.queryString("redirect");

            if (!value) {
                return;
            }

            switch (value) {
                case "writeGroupMail": // 写群邮件时
                    that.model.set("groupNumber", $Url.queryString("groupNumber") || 'unknown');
                    that.model.set("groupName", $Url.queryString("groupName") || 'unknown');
                    that.model.trigger("writeGroupMail");
                    break;
            }
        }
    }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase,
        _popTip =  M139.UI.Popup.create({
                    name: "tips_reject_reason",
                    target: {},
                    width: 250,
                    direction: "down",
                    content: "<p>Loading..</p>"
               }),
        _tipData = {} ,
        _currentGnumber = 0 ,
        _popDetailTimer = null ,
        _model;
    function _fixPopStyle(){
        $("#popup_tips_reject_reason").css({
            left:20
        });
        $("#popup_tips_reject_reason")
            .find("[name=popup_arrow]")
            .css({
                left:20
            });                        
        $("#popup_tips_reject_reason")
        .find(".delmailTipsClose")
        .hide();
         $("#popup_tips_reject_reason").on("mouseleave" , function(){
            _popTip.close();
        });
    }

    M139.namespace('M2012.GroupMail.View.GroupList', superClass.extend(
    {
        el: "#ul_grouplist",
        events: {
            "click [data-gn]":"groupClick" ,
            "mouseover [data-gn]" : "mouseoverHandler" ,
            "mouseleave [data-gn]" : "mouseleaveHandler"
        },
        constant : {
            unreadMsgCount : 99
        },
        mouseoverHandler : function(e) {


        },
        mouseleaveHandler : function(e){


        },
        groupListTimer : null ,
        initialize: function (options) {
            var that = this;
            _model = options.model;
        	this.model = options.model;
           /**
             * [注册请求数据事件]
             * @完成数据请求时渲染自身
             */
            this.model.on( that.model.dataEvent["QUERY_GROUP"] , function(result){
                var allGroups = result.responseData["var"] ;
                _.find( allGroups , function( obj , order ){
                    if( parseInt(obj["groupNumber"] , 10 ) === parseInt( that.model.get("groupNumber"),10 ) ) {
                        if( parseInt(obj["unreadCount"] , 10 ) > 0 ){
                            $(".new_mail_warning").each(function(){
                                $(this).html('<span class="tip-box" data-action="page_num" data-page = "1"  data-tid="group_mail_new_tips_click" >有 '+ obj["unreadCount"] +' 封新邮件<a href="javascript:;" data-tid="group_mail_new_tips_close_click"  data-action = "close" data-aim="new_mail_warning" class="close"></a></span>')
                                .show();
                                });
                        }
                        return true;
                    }
                });
               
                that.render(result);
                that.model.trigger("adjustHeight", "groupWrapper");
            });

            this.model.on( that.model.dataEvent["AFTER_REQUEST"] , function( data , options , model ){
                try{
                    var responseData = data.responseData["var"][0];
                    _popTip["options"]["content"] = ["<p>" ,
                                                     $T.Html.encode(responseData.groupName) , "</p>" ,
                                                     "<p> 创建者 : " , responseData.owner,
                                                     "</p><p> 总人数 : ",
                                                     responseData.totalUserCount ,
                                                     "</p><p>创建时间 : " ,
                                                    responseData.createTime.split(" ")[0]
                                                     , "</p>"
                                                    ].join("");
                    if( _currentGnumber === responseData.groupNumber){
                        _popTip.render();
                    }
                    _fixPopStyle();
                    _popTip["target"].setAttribute("data-detail" , responseData.groupNumber);
                    _tipData[responseData.groupNumber] = {
                        groupName : responseData.groupName ,
                        owner : responseData.owner ,
                        totalUserCount : responseData.totalUserCount ,
                        createTime : responseData.createTime
                    };
                    
                }catch(e){}
                });

            /**
             * 初始化时候，请求数据
             */
            
            that.model.set("load_complete", true); // 页面加载完成
            this.model.getGroupList();
            /**
             *  轮询获取数据
             */
            /**
            this.groupListTimer = setInterval(function(){
                that.model.getGroupList({
                    silent : true
                });
            } , 60000);
*/
            that.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var that = this,
                mainWrapper = $("#groupWrapper");

            // 创建群邮件按钮绑定事件
            mainWrapper.find("[role='button']").click(function() {
                that.model.trigger("writeGroupMail");
            });

            // 新建群组链接绑定事件
            mainWrapper.find("#createGroupLink").click(function() {
                that.model.trigger("createGroup");
            });

            // 动态调整群组列表高度
            $(window).resize(function() {
                that.model.trigger("adjustHeight", "groupWrapper");
            });

            // pns消息推送, 动态改变群组的未读消息数
            top.$App && top.$App.on("changeGroupMsgSum", function (obj) {
                var groupNumber = obj.groupNumber;
                // 先根据groupNumber找到对应的群组节点
                var groupNode = $(that.el).find("li[data-gn='" + groupNumber + "']");
                if (!groupNode.length) {
                    // 未找到，直接返回
                    return ;
                }

                // 找到群组节点下的A节点以及目标未读消息节点
                var node = groupNode.find("a"),
                    unreadNode = node.find(".msg-topredtips"),
                    unreadNum, // 记录未读消息总数
                    unreadMsgCount = that.constant.unreadMsgCount;
                if (unreadNode.length) {
                    // 如果"未读消息节点"存在, 表示有未读消息,
                    // 最多只显示99条未读消息
                    (Number(unreadNode.text()) + 1) > unreadMsgCount ? unreadNode.text(unreadMsgCount) :
                        unreadNode.text(Number(unreadNode.text()) + 1);
                    unreadNum = Number(unreadNode.text());
                }else{
                    // 否则在其直接父元素后面追加节点
                    node.append("<span class='msg-topredtips'>1</span>");
                    unreadNum = 1;
                }

                // 如果PNS推送的群组号码正好是当前视图所在的群组号码,将未读图标隐藏起来
                if (Number(groupNumber) === Number(that.model.get("groupNumber"))) {
                    node.find(".msg-topredtips").hide();
                }

                // 改变缓存在model中的groups数据
                that.model.trigger("changeGroupMsgUnreadCount", {
                    groupNumber :  groupNumber,
                    unreadNum : unreadNum
                });
            });
        },
        /**
         * [groupClick]
         * @设置选择的groupNumber,并处理已读消息数量
         */
        groupClick:function(e){
            $("#new_mail_warning").hide();
            var cur = e.target || e.srcElement ;
            while(cur.tagName !== "LI" ){
                cur = cur.parentNode;
            }
            var groupNumber = $(cur).attr("data-gn") , num = 0;
            /**
             * 重置页码,需要在设置groupNumber之前，设置groupNumber将驱动获取新数据
             */
            this.model.set("pageIndex" , 1);
            this.model.set("groupNumber", groupNumber );
            var target = this.model.get("groups");
            _.find( target , function( group , order){
                    num = order;
                    return parseInt(group["groupNumber"] , 10) === parseInt(groupNumber , 10) ;
                });
            /**
             * 点击后，已读数等于消息总数
             */
            target[num]["unreadCount"] = 0;
            this.model.set("groups" , target);

            // 将未读数清0
            this.model.trigger("isShowNewMsgBar", {
                unreadNum : 0
            });

            // 清空写信窗口中的信息
            this.model.trigger("cleanGroupMailContent");
            // 切换TAB页时相关
            this.model.set("currentGroupLoadComplete", false);
            this.model.set("currentAlbumLoadComplete", false);


            this.render();
        },
		render : function( data ){
            var that = this ,
                result;
             
                if(!data){
                    /**
                     * 如果没有传入数据，则使用模型数据
                     */
                    data = this.model.get("groups");
                }else{
                    data = data.responseData["var"];
                }
                result = data;
                _.each(result , function(obj , order) {
                    if( parseInt(obj["groupNumber"] , 10 ) === parseInt(that.model.get("groupNumber") , 10) ){
                        that.model.set("groupName", $T.Html.encode(obj["groupName"])); // 保存群组名称,用于回复或发送群消息
                        that.model.set("groupIcon", !!Number(obj["owner"]) ? "i_groupAdd_s" : "i_groupIco_s"); // 保存群组图标

                        obj.current = true;
                    }else{
                        obj.current = false ;
                    }    
                });
                if( result.length > 0 ){
                    $(that.el).html( _.template( $("#template_group_list").html(), { data : result }));
                }else{ 
                    //无群组，显示引导页
                   $App.setStatus($App.STATUS["GROUP_EMPTY"]);
                    // 创建群组按钮绑定点击事件
                   $App.trigger($App.EVENT.CREATE_GROUP, function () {
                       that.model.trigger("createGroup");
                   });
                }
            // tab页签切换后, 在切换不同的群组, 要改变顶上的群名称显示
            this.model.trigger("changeToolbarGroupName");
		}
    }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var interval;
    M139.namespace('M2012.GroupMail.View.MsgList', superClass.extend(
    {
        el: "#ul_msg_list",
        events: {
            "click [data-action=expand]" : "clickHandler"
        },
        EVENT : {
            SHOW_CONTACT_CARD : "showContactCard",
            Adjust_NewBar_Position : "adjustNewBarPosition", // 调整消息栏位置事件
            Default_NewBar_Position : "defaultNewBarPosition" // 默认的消息栏位置
        },
        template : [//http://placehold.it/50
            '<div class="groupMailUl groupMailDetailBox" style="padding:0;">',
               '<dl class="clearfix mailDl" >',
                   '<dd class="avatar fl" style="margin:0;padding:0;" onmouseover="top.BH(' + "'group_mail_quote_pop_head_hover'"  +')">',
                        '{imgContent}',
                   '</dd>',
                   '<dd class="content" style="margin-left: 68px;">',
                        '<div class="clearfix p_relative">',
                            '<h3 class="author" onmouseover="top.BH(' + "'group_mail_quote_pop_contacts_hover'"  +')">{author}</h3>',
                            '<p class="date" style="margin:0;">{createTime}</p>',
                            '<div class="mainContain" style="height:auto;">',
                                //'<p style="margin:0;padding:0;">为企业的各个社交媒体提供分析和管理服务的公司Sprinkr今天获得4000美元的D轮融资，由Iconiq Capital领投，Battery',
                                //'Ventures和Intel Capital参投。 Sprinklr为企业提供其社交媒体的跨平台管理和图表分析等服务，它的顾客包括微软和维珍美国等。',
                               // '在美国，提供跨平台社交媒体管理服务的还有Spredfast、SocialFlow、Lithium。 Sprinklr的CEO为企业的各个社交媒体提供分析',
                               // '和管理服务的公司Sprinkr今天获得4000美元的D轮融资。</p>',
                                '{content}',
                            '</div>',
                         '</div>',
                    '</dd>',
                '</dl>',
            '</div>'].join(" "),
        newMsgTemplate : [
            '<a href="javascript:;">有{newMsgNum}条新消息，点击查看</a>'
        ].join(""),
        joinGroupTemplate : [
            '<li>',
                '<div class="tipsBlue">黎永洪加入了群组，快和大家打个招呼吧。<a id="closeJoinTip" class="i_t_close" href="javascript:;"></a></div>',
            '</li>'
        ].join(""),
        clickHandler : function( e ){
            var that = this;
            e = e || window.event;
            var cur = e.target || e.srcElement,
                action = cur.getAttribute("data-action"),uid,mid;
                while(!action){
                    cur = cur.parentNode;
                    action = cur.getAttribute("data-action");
                }
                uid = cur.getAttribute("data-uid");
                mid = cur.getAttribute("data-mid");
                clearTimeout(interval);
                interval = setTimeout(function() {
                    // 获取邮件内容详细信息,延迟200毫秒,防止用户不断点击,重复调用后台接口
                    that.showGroupMailDetail({
                        uid : uid,
                        mid : mid
                    });
                }, 200);
        },
        initialize: function (options) {
            var that = this;
        	this.model = options.model;
            this.myModel = new Backbone.Model();
            this.userInfo = {}; // 存储用户信息

           /**
             * [注册请求数据事件]
             * @完成数据请求时渲染自身
             * @当前组id改变时候请求数据
             */
            this.model.on( that.model.dataEvent["QUERY_MSG"],function( result ){
                var gNumber = that.model.get("groupNumber");
                var total = parseInt(result.responseData["var"].totalRecord ,10 ),
                    prevTotal = parseInt(that.model.get("totalRecord") , 10 );
                   /**
                    * 同步新邮件提示
                    */
                /**
                if( ( total - prevTotal ) > 0 ){
                    $(".new_mail_warning").each(function(){
                        $(this).html('<span class="tip-box" data-action="page_num" data-page = "1"  data-tid="group_mail_new_tips_click"  >有 '+ (total - prevTotal) +' 封新邮件<a href="javascript:;" data-tid="group_mail_new_tips_close_click"  data-action = "close" data-aim="new_mail_warning" class="close"></a></span>')
                        .show();
                        });
                }else{
                    $(".new_mail_warning").each(function(){
                        $(this).hide();
                    });
                }*/
                
                /**
                 * [dm 图片路径]
                 * @type {RegExp}
                 */

                //var dm  = /http:\/\/[^\/]*/.exec(window.location.href)[0];
                /**
                _.each(result.responseData["var"].message , function( obj ){
                    var d = new Date(),
                        ymd = obj["createDate"].split(" ")[0].split("-"),
                        hms = obj["createDate"].split(" ")[1].split(":");
                        d.setFullYear(parseInt(ymd[0],10) , parseInt(ymd[1], 10)-1 ,parseInt(ymd[2] , 10) );
                        d.setHours(parseInt(hms[0],10) , parseInt(hms[1],10) , parseInt(hms[2],10));  
                        obj["createDate"] = d.getTime();
                        if( obj['user']['imageUrl']!== "" ){
                           obj['user']['imageUrl'] = new top.M2012.Contacts.ContactsInfo({ImageUrl: obj['user']['imageUrl'] }).ImageUrl;
                        } 
                });*/
                that.render(result.responseData["var"]);
                that.initEvents();
                that.model.trigger("adjustHeight", "mainMsgListWrapper");
                that.model.set("totalRecord" , result.responseData["var"].totalRecord );
                that.model.set("reduceGroupMail", true);
            });

            this.model.on("change:groupNumber",function(e){
                if (that.model.get("currentView") == "groupSession"){
                    that.model.getMessageList();
                }
            });

            this.model.on("call:replyMessage",function(param) {
                // 点击回复链接时做的操作
                that.model.replyMessage({
                    "groupNumber" : that.model.get("groupNumber"),
                    "messageId" : that.model.get("messageId"),
                    "content" : param.content, // todo $T.Html.encode(param.content)
                    "contentThum" : param.contentThum
                },function(response) {
                    if (response["code"] != "S_OK") {
                        top.M139.UI.TipMessage.show('发送失败', { delay: 3000 , className: "msgRed"});
                        _.isFunction(param.fail) && param.fail();
                        return;
                    }
                    top.M139.UI.TipMessage.show('发送成功', { delay: 3000});
                    // 关闭窗口
                    _.isFunction(param.success) && param.success();
                    // 刷新消息列表
                    that.model.getMessageList();
                },function () {
                    // 异常的情况
                    top.M139.UI.TipMessage.show('发送失败', { delay: 3000, className: "msgRed"});
                    _.isFunction(param.fail) && param.fail();
                });
            });

            // pns推送, 如果有消息, 需要给予用户提示
            top.$App && top.$App.on("changeGroupMsgSum", function (info) {
                if (info) {
                    var groupNumber = info.groupNumber;

                    if (Number(groupNumber) != Number(that.model.get("groupNumber"))) {
                        // 如果pns推送的消息中, 群组号码不是当前视图的群组号码, 不处理
                        return;
                    }

                    if (that.getElement("newMsgContainer").is(":visible")) {
                        var sum = Number(that.getElement("newMsgContainer").text().replace(/\D/g, ""));
                        // 如果已经有显示, 直接叠加数目
                        that.getElement("newMsgContainer").html($T.Utils.format(that.newMsgTemplate, {
                            newMsgNum : sum + 1
                        }));
                        // 改变缓存在model中的groups数据
                        that.model.trigger("changeGroupMsgUnreadCount", {
                            groupNumber :  that.model.get("groupNumber"),
                            unreadNum : sum + 1
                        });

                        // 重新设置未读数
                        that.model.trigger("isShowNewMsgBar", {
                            unreadNum : sum + 1
                        });
                    }else{
                        // 直接弹出新消息提示栏
                        that.getElement("newMsgContainer").html($T.Utils.format(that.newMsgTemplate, {
                            newMsgNum : 1
                        }));
                        // 改变缓存在model中的groups数据
                        that.model.trigger("changeGroupMsgUnreadCount", {
                            groupNumber :  that.model.get("groupNumber"),
                            unreadNum : 1
                        });
                        // 重新设置未读数
                        that.model.trigger("isShowNewMsgBar", {
                            unreadNum : 1
                        });
                    }
                    that.trigger(that.EVENT.Adjust_NewBar_Position);
                }
           });

            // 改变窗口大小时,也应该实时调整页面的高度
            $(window).resize(function() {
                that.model.trigger("adjustHeight", "mainMsgListWrapper");
            });

            // 监听消息列表区域滚动事件
            that.getElement("mainMsgListWrapper").scroll(function() {
                // bugfix: 群邮件页面，拉动滚动条后，插入图片/插入标签的浮层没有消失
                $(document).click();
                // 如果有消息条, 则调整消息条的高度
                that.trigger(that.EVENT.Adjust_NewBar_Position);
                // 保存滚动条滚动的高度
                that.model.get("cacheScrollTop")["mainMsgListWrapper"] = $("#mainMsgListWrapper").scrollTop();
            });

            // 调整消息提示栏位置
            this.on(that.EVENT.Adjust_NewBar_Position, function () {
                var scrollTop = that.getElement("mainMsgListWrapper").scrollTop();
                if (scrollTop > 185) { // todo 400的高度现在先写死
                    // 滚动条滚动的高度超过了写信窗口的高度, 则重新设置
                    that.getElement("newMsgContainer").css({
                        position : "absolute",
                        width :  $(that.el).width() - 2, // 消息卡的宽度减去两个像素
                        top : scrollTop + "px"
                    });
                }else{
                    that.trigger(that.EVENT.Default_NewBar_Position);
                }
            });

            // 默认消息提示栏位置(原始位置)
            this.on(that.EVENT.Default_NewBar_Position, function () {
                that.getElement("newMsgContainer").css({
                    position : "relative",
                    width : "",
                    top : "0px"
                });
            });
        },
        getElement : function (id) {
            return $("#" + id);
        },

        initEvents : function(){
            var that = this;
            // 回复链接绑定事件
            $(this.el).find("#replyMsg a").click(function() {
                that.model.set("messageId", $(this).closest("li").data("msgid")); // 保存消息ID
                that.model.trigger("createEvocation", {
                    'to':'4',
                    'type': '1',
                    'specify': $T.Html.decode(that.model.get("groupName")) || 'unknown', // 发送对象为该群组的名称
                    'dialogTitle' : '回复群邮件', // 弹窗标题
                    'flag' : 'groupMail', // 只针对群邮件的标记符,在evocation.compose.view.js中特殊处理
                    'callback' : function (param) { // 点击弹窗中的"发送"按钮时,触发回调函数
                        that.model.trigger("call:replyMessage", param);
                    }
                });
            });

            // 点击联系人显示联系人卡片
            $(this.el).find("#author").click(function(e) {
                that.trigger(that.EVENT.SHOW_CONTACT_CARD, e);
            }).hover(function() {
                top.BH('group_mail_contacts_hover');
            }, function (e) {
            });

            // 给联系人图标绑定图标移入事件和鼠标点击事件
            $(this.el).find("a[data-tid='group_mail_head_click']").hover(function(e) {
                // 鼠标移进事件
                var msgId = $(this).closest("li").data("msgid"),
                    userEmail = that.getUserByMessageId(msgId).userEmail;
                $(this).attr("title", userEmail);
                top.BH('group_mail_head_hover');
            },function() {
                // 鼠标移出事件
            }).click(function (e) {
                // 点击事件
                that.trigger(that.EVENT.SHOW_CONTACT_CARD, e);
            });

            // 点击联系人名称和联系人图片时都需要弹出联系人卡片
            that.off(that.EVENT.SHOW_CONTACT_CARD).on(that.EVENT.SHOW_CONTACT_CARD, function(e) {
                if (that.myContactsCard && !that.myContactsCard.isHide()) {
                    return;
                }
                // 创建(new)联系人卡片对象,直接使用window.parent.M2012.UI.Widget.ContactsCard会出问题
                // 编辑之后,把邮件列表中的联系人卡片图片也给修改了
                var contactCardComp = new window.parent.M2012.UI.Widget.ContactsCard().render(),
                    target = e.target || e.srcElement,
                    li = $(target).closest("li"),
                    msgId = li.data("msgid"),
                    imgUrl = (li.data("img") == 'undefined') ? '' : li.data("img"),
                    userInfo = that.getUserByMessageId(msgId),
                    regularImg = $App.regularName(userInfo.userName);
                that.myContactsCard = contactCardComp;

                /*----------配置dx,dy属性的原因-------------*/
                // m139.dom.js中dockElement方法未考虑外层页是iframe的情况,导致联系人卡片弹窗定位不精确
                // 所以加上系统上方导航栏的高度,暂时定为110px
                if(contactCardComp) {
                    contactCardComp.show({
                        dockElement: target,
                        email: userInfo.userEmail,
                        flag : "groupMail",
                        groupMail : {
                            // 有则显示imgUrl, 没有则判断regularImg是否为false, 为false,则显示默认图片
                            imgUrl: imgUrl ? new top.M2012.Contacts.ContactsInfo({ImageUrl: imgUrl }).ImageUrl : (!regularImg ? "/m2012/images/global/avatar/avatar_s_01.png" : ''), // 保存卡片的图片路径
                            firstName : regularImg || 'G'
                        },
                        dx : 1,
                        dy : 110
                    });
                }
            });

            // 发送邮件消息编辑窗口内容改变时触发
            that.model && that.model.off("changeGroupMailContent").on("changeGroupMailContent",function() {
                // 将带格式的内容保存到model
                var htmlContent = that.model.htmlEditorView.getEditorContent();
                that.myModel.set("msgContent", $.trim(htmlContent));
            });

            // 如果要发送的内容是超链接(IE中才能模拟此问题),将超链接增加"target=_blank"属性
            that.off("replaceSuperLinks").on("replaceSuperLinks", function() {
                var links = that.model.htmlEditorView.editorView.editor.editorDocument.links;
                for (var i = 0, len = links.length; i < len; i++){
                    $(links[i]).attr("target", "_blank");
                }
            });

            // 给"发送按钮"绑定点击事件
            that.getElement("send_btn").unbind("click").bind("click", function() {
                var textContent = $.trim(that.model.htmlEditorView.editorView.editor.getHtmlToTextContent()); // 纯文本内容
                //var htmlContent = that.myModel.get("msgContent"); // 带格式的内容
                // IE中替换超链接
                that.trigger("replaceSuperLinks");
                var htmlContent = $.trim(that.model.htmlEditorView.getEditorContent());

                if (!!that.model.get("hasSendContent")) {
                    // 显示遮罩层
                    that.getElement("send_mask").removeClass("hide");
                    // 请求后台接口
                    that.model.trigger("call:postMessage", {
                        content : htmlContent,
                        contentThum : !!$.trim(textContent) ? $.trim(textContent) : "图片", // 只有图片时,缩略字段传值为图片
                        success : function () {
                            // 操作成功之后, 将弹出层隐藏
                            that.getElement("send_mask").addClass("hide");
                            that.model.trigger("cleanGroupMailContent");
                        },
                        fail : function () {
                            // fail error
                            console.warn && console.warn("fail error");
                            that.getElement("send_mask").addClass("hide");
                        }
                    });
                }
            });

            // 发送内容改变时触发的事件
            that.myModel.on("change:msgContent", function () {
                var htmlContent = that.myModel.get("msgContent");
                var editor = that.model.htmlEditorView.editorView.editor;
                // 如果editor.editorDocument不存在, 表示首次加载该页面, 设置为空值
                var textContent = editor.editorDocument ? $.trim(that.model.htmlEditorView.editorView.editor.getHtmlToTextContent()) : "";
                   // reg =/(<br[\s|\/]*>)/ig;!!content.replace(reg, "").trim()

                if (!!textContent) {
                    that.getElement("send_btn").addClass("btnSetG").removeClass("btnBan");
                    that.model.set("hasSendContent", true);
                }else {
                    // 如果纯文本内容为空, 分两种情况
                    // 1. 编辑框中的内容为空, 则为空
                    // 2. 编辑框中只有图片的情况, 则也需要将"发送按钮"设置成可点击状态
                    if ((htmlContent.indexOf("img") != -1) || (htmlContent.indexOf("IMG") != -1)) {
                        // 第二种情况, 只有图片(IE中的标签为IMG)
                        that.getElement("send_btn").addClass("btnSetG").removeClass("btnBan");
                        that.model.set("hasSendContent", true);
                    }else {
                        // 第一种情况, 文本内容是空
                        that.getElement("send_btn").addClass("btnBan").removeClass("btnSetG");
                        that.model.set("hasSendContent", false);
                    }
                }
            });

            // 重新加载列表, "发送"按钮应该设置成"不可发送状态"
            that.myModel.set({msgContent: ""});

            // 消息提示条绑定事件, 刷新消息列表
            that.getElement("newMsgContainer").unbind("click").bind("click", function(){
                // 改变缓存在model中的groups数据, 对应的群组未读消息数清0
                that.model.trigger("changeGroupMsgUnreadCount", {
                    groupNumber :  that.model.get("groupNumber"),
                    unreadNum : 0
                });
                // 点击后则将未读数清空
                that.model.trigger("isShowNewMsgBar", {
                    unreadNum : 0
                });
                // 只要点击了新消息提示条, 页面都会跳转到首页
                that.model.set("pageIndex", 1);
                that.model.getMessageList();
            });
        },
        repeaterFn:{
            getContent:function(content){
                return content;
            }
        },
		render : function(result) {
            var that = this;

            if(result.message && result.message.length){
                $(that.el).html(_.template( $("#template_msg_list").html() , { data : result } ));
                that.saveUserInfo(result.message);
                /**
                 * 设置界面状态为，消息显示状态
                 */
                $App.setStatus($App.STATUS["MSG_LIST"]);

            }else{
                /**
                 * 设置界面状态为，无消息状态
                 */
                $App.setStatus($App.STATUS["MSG_LIST_EMPTY"]);
            }

            // 切换群组时,应该将消息提示栏复位
            that.trigger(that.EVENT.Default_NewBar_Position);

            /*******切换标签页时的逻辑**************/
            that.model.get("dataSum")["groupSession"] = (result.message ? result.message.length : 0);
            that.model.trigger("showCurrentView");
            that.model.set("currentGroupLoadComplete", true);

            //bugfix: 群邮件翻页后滚动条定位到下一页的第一封群邮件, 跳转到第一条时滚动条设置在最顶部
            that.getElement("mainMsgListWrapper").scrollTop((that.model.get("pageIndex") > 1) ? 150 : 0);
		},
        /**
         * 查看邮件详情时, 需要加载样式文件
         * @param cssFile 要加载样式文件的名称
         * @param doc 当前文档
         */
        loadCssFile : function (cssFile, doc) {
            var path = "/m2012/css/" + cssFile,
                cssTag = doc.getElementById('loadCss'),
                head = doc.getElementsByTagName('head').item(0);
            if (cssTag) head.removeChild(cssTag);  // 如果存在,则移除

            var css = doc.createElement('link');
            css.href = path;
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.id = 'loadCss';
            head.appendChild(css);
        },
        // 保存用户信息:包括邮件地址等,以key/value的形式
        // key: messageId, value : user
        // messageId唯一
        saveUserInfo : function (msgArr) {
            for (var i = 0; i < msgArr.length; i++) {
                this.userInfo[msgArr[i].messageId] = msgArr[i].user;
            }
        },
        /**
         * 根据消息ID获取相对应的用户联系信息
         * @param msgId
         * @returns {*|{}}
         */
        getUserByMessageId : function(msgId) {
            return this.userInfo[msgId] || {};
        },
        /**
         * 构建查看原文弹窗中的图片展示内容
         * 当imgUrl不为空时,直接展示后台提供的路径地址
         * 当imgUrl为空时,则显示用户名的第一个字母
         * @param imgUrl 图片路径
         * @param userName 用户名称
         * @returns {string}
         */
        buildImageContent : function(imgUrl, userName) {
            var content = '',
                regularImg = '';
            if (imgUrl) { // 如果有提供图片,则直接显示
                imgUrl = new top.M2012.Contacts.ContactsInfo({ImageUrl: imgUrl }).ImageUrl;
                content = '<a href="javascript:;"><img src="' + $T.Html.encode(imgUrl) + '" alt="" style="border:0;" width="50px" height="50px"></a>';

            } else {
                regularImg = $App.regularName(userName);
                if ( !regularImg ) { // 特殊字符,显示默认图片
                    content = '<a href="javascript:;"><img src="/m2012/images/global/avatar/avatar_s_01.png" alt="" style="border:0;" width="50px" height="50px"></a>';
                } else { // 按照产品的规则要求显示名称
                    content = '<i class="avBg bg_1481e7">' + regularImg + '</i>';
                }
            }
            return content;
        },
        /**
         * 获取邮件内容详细信息
         * @param info 包括uid,mid
         */
        showGroupMailDetail : function (info) {
            var that = this;
            that.model.getMessage({
                groupNumber : that.model.get("groupNumber") ,
                userId : info.uid ,
                messageId : info.mid
            } , function( response ){
                if (response["code"] != "S_OK") {
                    return;
                }

                var userInfo = response["var"]["message"] || {},
                    imgUrl = userInfo["user"]["imageUrl"] || '',
                    userName = userInfo["user"]["userName"] || '',
                    content = $T.format(that.template, {
                        content : userInfo.content || '无',
                        author : userName || '无',
                        imgContent : that.buildImageContent(imgUrl, userName), // 获取图像信息
                        createTime : userInfo["createDate"] || '1970-01-01 00:00:00'
                    });

                that.model.trigger("createEvocation", {
                    'to':'4',
                    'type': '1',
                    'content': $T.Html.encode(content), // 查看的消息内容详情
                    'dialogTitle' : '查看原文',
                    'flag' : 'groupMail',
                    'loadCss' : function (doc) {
                        that.loadCssFile("module/addr/group.css", doc);
                        $(doc.body).css("height","auto"); // 微调样式
                        $(doc.body).attr("contenteditable", false);// 不可编辑模式
                        $(doc).attr("designMode", "off"); // 不可编辑模式
                    }
                });
            });
        }
    }));
})(jQuery, _, M139);


(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var _model = null ,
        _menuCounter = 0 ; //防止事件冒泡多次createMenu

    M139.namespace('M2012.GroupMail.View.msgPager', superClass.extend(
    {
        el: "#msg_status_wrapper",
        allies : [ $("#msg_pager_bottom")],
        m139Pages:[],
        template:"",
        events: {
            "click [data-action]":"clickHandle"
        },
        clickHandle : function( e ){
            e = e || window.event;
            var cur = e.target || e.srcElement,
                action = cur.getAttribute("data-action");
                switch( action ){
                    case "close" :
                        if(cur.getAttribute("data-aim") === "new_mail_warning"){
                            $(cur.parentNode.parentNode).hide();
                        }
                        break;
                    /**
                     * [clickHandle 驱动数据获取]
                     * @page_list 展开页列表
                     * @page_num 展示选中页码
                     * @page_pre 上一页数据
                     * @page_next 下一页数据
                     */
                    case "page_num":
                        var page_number = cur.getAttribute("data-page");
                         _model.getMessageList(function( data ){
                            _model.set("pageIndex" , data.curPage);
                        } , {
                            param : {
                                pageIndex : parseInt( page_number , 10 )
                            }
                        });
                        break;
                    default:
                        break;
                }
        },
        initialize: function (options) {
            var that = this;
        	this.model = options.model;
            _model = this.model;
            var self = this;
            /**
             * [注册请求数据事件]
             * @完成数据请求时渲染自身
             * @当前页码改变时渲染自身
             */
            this.model.on( "gom:queryMessageList" ,function( result ){
                that.render(result.responseData);
            });
      
            var pages = [ 
                    M2012.UI.PageTurning.create(_.extend({ container : $("#msg_pager_top")[0] } , M2012.UI.PageTurning.STYLE_2 , {
                            template : '<div class="toolBarPaging mr_15 fr"><div>' ,
                            prevButtonTemplate: '<a rel="prev" data-tid="group_mail_pager_click" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
                            nextButtonTemplate: '<a rel="next" data-tid="group_mail_pager_click" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray -->
                            selectButtonTemplate: '<a rel="selector" data-tid="group_mail_pager_pop_click" href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
                            pageNumberButtonTemplate : ""
                        })) , 
                    M2012.UI.PageTurning.create(_.extend({ container : $("#msg_pager_bottom")[0] } , M2012.UI.PageTurning.STYLE_2 , {
                            template : '<div class="toolBarPaging fr"><div>' ,
                            prevButtonTemplate: '<a rel="prev" data-tid="group_mail_pager_click" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
                            nextButtonTemplate: '<a rel="next" data-tid="group_mail_pager_click" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray --> 
                            selectButtonTemplate: '<a rel="selector" data-tid="group_mail_pager_pop_click"  href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
                            pageNumberButtonTemplate : ""
                        }))
                    ];
            for(var i = 0 ; i < pages.length ; ++ i ){
                pages[i].on("pagechange",function(pageIndex){

                    if (pageIndex == 1) {
                        // 如果切换到第一页, 应该将消息栏隐藏(设置未读数为0)
                        // 同时要显示最新的数据
                        _model.trigger("isShowNewMsgBar", {
                            unreadNum : 0
                        });
                    }
                    _model.getMessageList(function( data ){
                        _model.set("pageIndex" , data.curPage);
                        } , {
                        param : {
                            pageIndex : pageIndex
                        }
                    });
                });
                var selectClick = pages[i].onSelectPageClick;

                var aopFn = (function( curItem ){
                    var handlefn = function(){
                        var contentEl , p , plist = M139.UI.Popup.popupList;
                        for( p in plist){
                            if(plist[p].contentElement){
                                contentEl = plist[p].contentElement;
                                break;
                            }
                        }
                        contentEl.find(".i_u_close").attr("data-tid" , "group_mail_pager_pop_close_click");
                        contentEl.find(".btnNormal").attr("data-tid" , "group_mail_pager_pop_done_click");
                    }
                    return function(){
                        selectClick.apply( curItem , []);
                        handlefn.apply( curItem , [] );
                    };
                })(pages[i]);

                pages[i].onSelectPageClick =  aopFn;
                this.m139Pages.push(pages[i]);
            }
        },
        initEvents : function(){
            this.el.find("#replyMsg").click(function() {
            });
        },
		render : function(result){
            var allies = this.m139Pages , i = 0 ,l = allies.length ,
                totalPages = Math.ceil( parseInt( result["var"].totalRecord , 10 )/this.model.get("pageSize"));

            for(; i < l ; ++i ){    
                allies[i].update(this.model.get("pageIndex") , totalPages , true)
            }
            if( totalPages < 2){
                $("#msg_pager_bottom").hide();
            }else{
                $("#msg_pager_bottom").show();
            }
		}
    }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.GroupMail.View.Album", superClass.extend(
    {
        el: "#uploadList",
        name: "M2012.GroupMail.View.Album",
        logger: new top.M139.Logger({ name: "M2012.GroupMail.View.Album" }),
        template: [
            '<li class="groupSession_timeList_li<%= cls %>" id="<%-templateId%>">',
                '<div class="groupSession_name clearfix">',
                    '<strong><%-timePoint%></strong>',
                    '<span class="i_icoTime"></span>',
                    '<a href="javascript:;" data-tid="group_mail_contacts_click" title=<%-email%>><%-userName%></a>',
                    '<span name="count">上传了 <%-count%> 张图片</span>',
                '</div>',
                '<ul class="groupSession_pic clearfix">',
                    '<% _.each(photos, function(o, i) { %>',
                        '<li data-fileid=<%=o["imgId"]%>>',
                            '<a href="javascript:;">',
                                '<img src=<%-o["imgUrl"]%> width="80" height="80" alt="" title=<%-o["imgName"]%> data-userid="<%-userId%>" data-filesize="<%-o["imgSize"]%>">',
                                '<span class="" name="topleft"></span>',
                            '</a>',
                        '</li>',
                    '<% }); %>',
                '</ul>',
            '</li>'
        ].join(''),
        templateUploadHeader: [
            '<li class="groupSession_timeList_li groupSession_name_first" id="<%-templateId%>">',
                '<div class="groupSession_name clearfix">',
                    '<strong><%-timePoint%></strong>',
                    '<span class="i_icoTime"></span>',
                    '<a href="javascript:;" data-tid="group_mail_contacts_click" title=<%-email%>><%-userName%></a>',
                    '<span name="count">上传了 <%-count%> 张图片</span>',
                '</div>',
                '<ul class="groupSession_pic clearfix">',
                '</ul>',
            '</li>'
        ].join(""),
        events: {            
        },
        selectedIds: [],
        commonIds: [],
        uploadArr: [],
        initialize: function (options) {
            this.model = options.model;
            this.groupmailModel = options.groupmailModel;

            this.collection = new Backbone.Collection;

            this.initUI();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function () {
            this.ui = {};
            this.ui.main = $('#groupAlbum');

            //工具栏
            this.ui.toolbar = $('#albumToolbar');
            this.ui.uploadBtn = $('#uploadBtn');
            this.ui.downloadBtn = $('#downloadBtn');
            this.ui.deleteBtn = $('#deleteBtn');
            this.ui.sendBtn = $('#sendBtn');
            this.ui.saveBtn = $('#saveBtn');

            this.ui.listDiv = $('.groupSession_time');
            //list           
            this.ui.listContainer = $('#uploadList');

            //无列表
            this.ui.noListContainer = $('.groupSessionNot');

        },
        initEvents: function () {
            var self = this,
                model = this.model;

            this.collection.on('add', function (e) {
                var template = _.template(self.template);
                var templateId = "li_" + new Date().getTime();
                var item = template({
                    cls: e.get('first') ? ' groupSession_name_first' : '',
                    timePoint: e.get('timePoint'),
                    email: e.get('email'),
                    userId: e.get('userId'),
                    userName: e.get('userName'),
                    count: e.get('count'),
                    photos: e.get('photos'),
                    templateId : templateId
                });

                !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = e.attributes);
                $(self.el).append(item);
            });

            this.collection.on('reset', function () {
                $(self.el).html('');
            });

            $('.groupSession_time').scroll(function () {
                if (self.model.get('point') <= self.model.get('pageCount')
                    && $(document).height() - $(this).scrollTop() - $(this).height() < 50) {
                    self.model.set('point', self.model.get('point') + 1);
                    self.loadMore(self.model.get('point'));
                }
                // 保存滚动条滚动的高度
                self.groupmailModel.get("cacheScrollTop")["groupAlbum_time"] = $("#groupAlbum_time").scrollTop();
            });

            //列表
            model.on(model.albumEvent['GET_ALBUM_LIST'], function (firstLoad) {
                self.model.getAlbumList(function (result) {
                    if (result && result.responseData) {
                        var resp = result.responseData;
                        if (resp['code'] === 'S_OK') {
                            var data = resp['var'];
                            if (data) {
                                if (data.length > 0) {
                                    //self.render(data);
                                    //控制上传遮罩层的隐藏和显示
                                    self.setUI();
                                    self.collection.reset();
                                    _.each(data, function (ele, index) {
                                        if (index == 0) {
                                            ele.first = true;
                                        }
                                        self.collection.add(ele);
                                    });
                                    self.eventHandler();
                                    self.addPreviewEvent();
                                } else {
                                    self.noAlbumHandler();
                                }
                            }

                            /*******切换标签页时的逻辑**************/
                            self.groupmailModel.get("dataSum")["groupAlbum"] = data.length || 0;
                            self.groupmailModel.trigger("showCurrentView");
                            self.groupmailModel.set("currentAlbumLoadComplete", true);

                            self.setUserData(result);
                            if (firstLoad) {
                                // 首次加载时, 初始化上传组件
                                var fileUpload = self.initFileUploader('uploadBtn');
                                self.fileUpload = fileUpload;
                                //setTimeout(function () {
                                //    fileUpload.dock('#uploadBtn');
                                //}, 100);
                                self.setContainerHeight();
                            }
                        } 
                        if (resp['summary'] == '服务端校验不通过') {
                            top.$App.setSessionOut();
                        }
                        
                    } else {
                        self.logger.error('getAlbumList return data error', '[album:getAlbumList]', result);
                    }
                }, { point: 1, groupNumber: self.groupmailModel.get('groupNumber') });
            });

            //群组切换，重新渲染群相册页面
            self.groupmailModel.on('change:groupNumber', function () {
                if (self.groupmailModel.get("currentView") != "groupAlbum") {
                    return;
                }
                self.resetSelectedPics();

                self.model.set('pageCount', 0);
                self.model.set('point', 1);
                
                self.ui.toolbar.find('a.btnNormal').addClass('groupAlbum_btnNo');
                self.model.trigger(self.model.albumEvent['GET_ALBUM_LIST']);
            });

            $(window).resize(function () {
                self.setContainerHeight();
                if (self.uploaderWhenListNil && !$('#btnNil').is(':hidden')) {
                    self.uploaderWhenListNil.dock('#btnNil');
                }
            });
        },
        resetSelectedPics: function () {
            var self = this;
            self.commonIds = [];
            self.model.set('commonIds', []);
            self.selectedIds = [];
            self.model.set('selectedIds', []);            
        },
        setContainerHeight: function () {            
            var otherH = 0;
            if (!$('#albumToolbar').is(':hidden')) {
                otherH = $('#groupAlbumTabs').outerHeight() + $('#albumToolbar').outerHeight() + 33;
            } else {
                //工具栏隐藏时高度为0，此时加上它本来的高度24px
                otherH = $('#groupAlbumTabs').outerHeight() + 57;
            }            
            $("#groupAlbum_time").height($(window).height() - otherH);
        },
        setUI: function () {
            var self = this;
            self.ui.noListContainer.hide();
            self.ui.main.show();
            self.ui.toolbar.show();
            if (self.fileUpload) {
                self.fileUpload.dock('#uploadBtn');
                self.fileUpload.isShow(true);
            }
            if (self.uploaderWhenListNil && self.uploaderWhenListNil.getMarginLeft() == '0px') {
                self.uploaderWhenListNil.isShow(false);
            }
            if (self.fileUpload && self.fileUpload.getMarginLeft() == '-999px') {
                self.fileUpload.isShow(true);
            }
        },
        setUserData: function (result) {
            var self = this;
            if (result.responseData['isOwner']) {
                //1为管理员
                var isOwner = result.responseData['isOwner'];
                if (isOwner == '1') {
                    self.model.set({ 'isAdmin': true });
                } else {
                    self.model.set({ 'isAdmin': false });
                }
            }
            if (result.responseData['curUserId']) {
                var curUserId = $.trim(result.responseData['curUserId']);
                if (curUserId != '') {
                    self.model.set({ 'curUserId': parseInt(curUserId) });
                }
            }
            if (result.responseData['curUserName']) {
                var curUserName = $.trim(result.responseData['curUserName']);
                if (curUserName) {
                    self.model.set({ 'curUserName': curUserName });
                }
            }
            if (result.responseData['email']) {
                var email = $.trim(result.responseData['email']);
                if (email) {
                    self.model.set({ 'curEmail': email });
                }
            }
            if (result.responseData['pageCount']) {
                var pageCount = result.responseData['pageCount'];
                if (pageCount) {
                    self.model.set({ 'pageCount': parseInt(pageCount) });
                }
            }
        },
        judgeExt: function (files) {
            var self = this,
                success = true;
            $.each(files, function (i, p) {
                var fileName = p.fileName;
                var ext = self.model.getExtName(fileName);
                if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif'
                    || ext == 'png' || ext == 'jpe' || ext == 'bmp') {                    
                } else {
                    top.M139.UI.TipMessage.show('图片格式有误', { delay: 1000, className: 'msgRed' });
                    success = false;
                    return false;
                }
            });
            return success;
        },
        initFileUploader: function (bindElement) {
            var self = this;
            var totalLength = 0, i = 0;
            return new FileUpload({
                container: document.getElementById(bindElement),
                getUploadUrl: function () {
                    //地址上灰度和全网是必须适配
                    //现网可能要去掉mw2目录
                    var singleUrl = [
                        "http://" + window.location.host + '/mw2/groupmail/s?func=gom:uploadFile',
                        '&groupNumber=', self.groupmailModel.get('groupNumber'),
                        '&sid=', top.sid,
                        '&comefrom=1'
                    ].join('');
                    return self.model.get('isBatchUpload') ? (singleUrl + '&transId=' + self.model.get('batchTransId')) :
                        (singleUrl + '&transId=' + Math.random() + new Date().getTime());

                },
                onselect: function (files) {                    
                    if (files.length == 0) return;
                    if (!self.judgeExt(files)) {
                        this.reset();
                        return;
                    }
                    var me = this;
                    totalLength = files.length;

                    //添加新轴点
                    var timePoint = self.model.formatDate();
                    var prependHtml = _.template(self.templateUploadHeader,
                        {
                            timePoint: timePoint, userName: self.model.get('curUserName'),
                            userId: self.model.get('curUserId'), count: files.length,
                            email: self.model.get('curEmail'),
                            templateId: 'li_' + new Date().getTime()
                        });
                    self.ui.listContainer.prepend(prependHtml);

                    //改变一下原来列表第一个元素的样式
                    $('.groupSession_name_first').eq(1).removeClass(' groupSession_name_first');

                    if (files.length > 1) {
                        self.model.set('isBatchUpload', true);
                        self.model.set('batchTransId', Math.random() + '' + new Date().getTime());
                    } else {
                        self.model.set('isBatchUpload', false);
                        self.model.set('batchTransId', '0');
                    }

                    $(files).each(function (i, n) {
                        self.updateUI(n);
                    });
                    setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                        me.upload();
                    }, 10);
                },
                onprogress: function (fileInfo) {
                    self.updateUI(fileInfo);
                },
                oncomplete: function (fileInfo, responseText) {                    
                    try {
                        var responseData = eval('(' + responseText + ')');
                    } catch (ex) { self.logger.error('responseText exception'); }
                    var $pic = $('.groupSession_pic').first().find('li[taskid=' + fileInfo.taskId + ']');
                    var rslt = {},
                        fileId = 0,
                        thumUrl = '',
                        name = '',
                        size = 0;
                    if (responseData) {
                        var code = responseData['code'];
                        if (code === 'S_OK') {
                            rslt = responseData['var'];

                            fileId = rslt.fileId;
                            thumUrl = rslt.thumUrl;

                            name = fileInfo.fileName;
                            size = fileInfo.fileSize;

                            //设置DOM节点属性fileId
                            $pic.attr('data-fileid', fileId);
                            $pic.find('img').attr('data-fileid', fileId);

                            //设置缩略图src属性
                            $pic.find('img').attr('src', thumUrl)
                                            .attr('title', name)
                                            .attr('data-filesize', size);
                            $pic.find('.i_groupIco_bg').remove();
                            $pic.find('.i_groupIco_num').remove();
                            $pic.removeAttr('taskid');

                            self.updateUI(fileInfo);
                        } else if (code === 'PML10406010') {
                            self.uploadError($pic, '图片格式不符合要求', responseData['summary']);
                        } else if (code === 'PML10406012') { //超容量
                            self.uploadError($pic, '群组容量不足', responseData['summary']);
                        } else if (responseData['summary'] == '服务端校验不通过') {
                            top.$App.setSessionOut();
                        }
                    } else {
                        console.log("上传返回报文格式有误");
                    }

                    var picObj = {
                        imgId: fileId,
                        imgName: name,
                        imgSize: size,
                        imgUrl: thumUrl
                    };
                    self.uploadArr.push(picObj);
                                        
                    i++;
                    //最后一次
                    if (i == totalLength) {
                        //将轴点加到("uploadFileList")
                        var templateId = $(".groupSession_name_first").attr('id');
                        var item = {
                            count: totalLength,
                            email: self.model.get('curEmail'),
                            photos: self.uploadArr,
                            timePoint: '',
                            userId: self.model.get('curUserId'),
                            userName: self.model.get('curUserName')
                        };
                        !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = item);
                        self.addPreviewEvent();

                        self.eventHandler();
                        i = 0;
                        self.uploadArr = [];

                        //重置
                        this.reset();
                    }
                },
                logKey: 'group_mail_album_uploadPic'
            });
        },
        uploadError: function (target, errorStr, summary) {
            var self = this;
            top.M139.UI.TipMessage.show(errorStr, { delay: 1000, className: 'msgRed' });
            summary && self.logger.log(summary);
            target.find('img').attr('src', '../../images/201312/face_06.jpg');
            target.find('.i_groupIco_num').remove();
        },
        /**
         * 给图片绑定预览的事件
         * 只针对img元素
         */
       addPreviewEvent : function () {
           var that = this;
           $(that.el).find("li ul li").unbind("click").click(function(event) {
               if (event.target && event.target.tagName.toLowerCase() != 'img') {
                   // 如果点击的不是图片，直接返回
                   return;
               }
               top.BH && top.BH('group_mail_album_preview');

               // 图片在ul中的位置
               var picture_index = $(this).index(); // 图片在ul中的位置
               // 当前文件fileId
               var fileId = $(this).data("fileid");
               // ul在坐标轴中的位置, 从0开始
               var li_id = $(this).closest("ul").closest("li").attr("id");
               //var ul_index = $(this).closest("ul").closest("li").attr("id");

               // 从缓存当中获取该轴点下的所有缩略图信息
               var currentPhotoList = that.model.get("uploadFileList")[li_id].photos;
               // 从缓存当中获取该轴点下的所有原图地址信息
               var cacheDownloadUrlList = that.model.get("downloadUrlList")[li_id];

               // 从缓存当中获取下载图片信息, 如果存在直接返回数据
               if (cacheDownloadUrlList) {
                   // 直接从缓存中取数据, 直接预览
                   beginPreview(buildPreviewData(currentPhotoList, cacheDownloadUrlList), picture_index);
                   return;
               }

               // 如果不存在, 根据所有id调用批量接口获取图片数据, 并将请求后的数据放入缓存
               var fileIdArr = [];
               fileIdArr.push(fileId);
               $.each($(this).siblings(), function() {
                   fileIdArr.push($(this).data("fileid"));
               });

               that.model.batchPreDownload(function(response){
                   // 缓存起来
                   response && (that.model.get("downloadUrlList")[li_id] = response);
                   // 预览操作
                   beginPreview(buildPreviewData(currentPhotoList, response), picture_index);
               }, {
                   groupNumber : that.groupmailModel.get("groupNumber"),
                   fileId : fileIdArr.join(",")
               });

               /**
                * 通过imgID获取对应的大图地址
                * @param imgId
                * @param downloadUrlArr
                * @returns {*}
                */
               function getDownLoadUrlByImgId (imgId , downloadUrlArr) {
                   for (var a = 0; a < downloadUrlArr.length; a++) {
                       if (downloadUrlArr[a].imgId == imgId) {
                           return downloadUrlArr[a].downloadUrl;
                       }
                   }
                   return "";
               }

               /**
                * 构建预览数据
                * @param currentPhotoList 缓存中获取的缩列图数据列表
                * @param downloadList 获取下载地址(可能是缓存可能直接从接口获取)
                */
               function buildPreviewData(currentPhotoList, downloadList) {
                   var imgList = [];
                   for (var i = 0, len = currentPhotoList.length; i < len; i++) {
                       imgList.push({
                           bigthumbnailURL : getDownLoadUrlByImgId(currentPhotoList[i].imgId, downloadList), // 大图地址(下载地址)
                           fileName : currentPhotoList[i].imgName, // 文件名称
                           thumbnailURL : currentPhotoList[i].imgUrl, // 缩略图地址
                           presentURL : getDownLoadUrlByImgId(currentPhotoList[i].imgId, downloadList) // 下载图地址, 暂时设置为跟大图一样
                       });
                   }
                   return imgList;
               }

               /**
                * 开始预览图片
                * @imgList 图片列表
                * @index 当前图片索引
                */
               function beginPreview(imgList, index) {
                   if (!$.isEmptyObject(that.model.focusImagesView)) {
                       that.model.focusImagesView.render({ data: imgList, index : index });
                   }else{
                       top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                       top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                           that.model.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                           that.model.focusImagesView.render({ data: imgList, index : index});
                       });
                   }
               }
           });
       },

        //上传UI变化
        updateUI: function (fileInfo) {
            var self = this;

            var ul = $(".groupSession_pic").first();
            switch (fileInfo.state) {
                case "waiting":
                    var targetStr = [
                            '<li taskid=', fileInfo.taskId, '>',
                                '<a href="javascript:;">',
                                    '<img src="../../images/201312/face_05.jpg" width="80" height="80" alt="" data-userid=', self.model.get("curUserId"),'>',
                                    '<span class="" name="topleft"></span>',
                                    '<span class="i_groupIco_bg"></span>',
                                    '<span class="i_groupIco_num">等待中</span>',
                                '</a>',
                            '</li>'
                    ].join('');
                    ul.append(targetStr);
                    console.log(fileInfo.fileName + "(等待上传...)");
                    break;
                case "uploading":
                    var target = ul.find("li[taskId=" + fileInfo.taskId + "]");
                    doProgress(fileInfo.percent, target);
                    console.log(fileInfo.fileName + "(" + fileInfo.percent + "%)");
                    break;
                case "complete":
                    console.log(fileInfo.fileName + "(完成)");
                    break;
            }

            //进度条
            function doProgress(progress, target) {
                if (progress < 100) {
                    setTimeout(function () {
                        doProgress();
                    }, 100);
                    setProgress(progress, target);
                    progress++;
                }
            }
            
            function setProgress(progress, target) {
                if (progress) {
                    target.find('.i_groupIco_num').html(progress + "%");
                    target.find('.i_groupIco_bg').css("width", (100 - progress) + "%");
                }
            }

        },

        eventHandler: function () {
            var self = this;
            // 图片悬浮
            $(self.el).find('li[data-fileid]').off("hover").on('hover', function (event) {
                if ($(this).hasClass("groupFocus")) return;

                if ($(this).find('img').attr('src').indexOf('../../images/201312/face_05.jpg') > -1 ||
                    $(this).find('img').attr('src').indexOf('../../images/201312/face_06.jpg') > -1) {
                    return;
                }

                if (event.type == 'mouseenter') {
                    $(this)
                        .addClass("groupHover")
                        .find("span").addClass("i_groupIco_ck");
                } else {
                    $(this)
                        .removeClass("groupHover")
                        .find("span").removeClass("i_groupIco_ck");
                }
            });

            // 选中操作
            $(".groupSession_pic").find("span[name='topleft']").off("click").on('click', function (event) {
                top.BH && top.BH('group_mail_album_select');
                if ($(this).next().next().html() == '等待中') return;
                var imgId = $(this).closest("li").data("fileid");
                var userId = $(this).prev().data("userid");
                if ($(this).hasClass("i_groupIco_ck")) {
                    $(this).closest("li").removeClass().addClass("groupFocus");
                    $(this).removeClass().addClass("i_groupIco_ok");
                    //加个判断，判断最近的userId是否和当前登录用户id相同， 相同时才加入数组中
                    if (!self.model.get('isAdmin')) {
                        if (parseInt(userId) == self.model.get("curUserId")) {
                            self.selectedIds.push(imgId);
                            self.model.set('selectedIds', self.selectedIds);
                            self.ui.toolbar.find('a.btnNormal').removeClass("groupAlbum_btnNo");
                        } else {
                            for (var i = 0; i < 4; i++) {
                                if (i != 1) {
                                    self.ui.toolbar.find('a.btnNormal').eq(i).removeClass("groupAlbum_btnNo");
                                }
                            }
                        }                         
                    } else {
                        self.selectedIds.push(imgId);
                        self.model.set('selectedIds', self.selectedIds);
                        self.ui.toolbar.find('a.btnNormal').removeClass("groupAlbum_btnNo");
                    }                    
                    self.commonIds.push(imgId);
                    self.model.set('commonIds', self.commonIds);
                } else {
                    $(this).closest("li").removeClass().addClass("groupHover");
                    $(this).removeClass().addClass("i_groupIco_ck");
                    self.selectedIds = _.reject(self.selectedIds, function (id) { return id == imgId; });
                    self.model.set('selectedIds', self.selectedIds);

                    self.commonIds = _.reject(self.commonIds, function (id) { return id == imgId; });
                    self.model.set('commonIds', self.commonIds);

                    if (self.commonIds.length == 0) {
                        self.ui.toolbar.find('a.btnNormal').addClass("groupAlbum_btnNo");
                    }
                }
            });

            //下载
            self.ui.downloadBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_download');

                self.model.downloadPics(function (result) {
                    if (result && result.downloadUrl) {
                        $('#albumDownloadFrame').attr('src', result.downloadUrl);
                    } else {
                        top.M139.UI.TipMessage.show(self.model.tipWords['DOWNLOAD_FAIL'], { delay: 1000, className: 'msgRed' });
                        self.logger.error('album download return data error', '[album:download]', result);
                    }
                }, {
                    groupNumber: self.groupmailModel.get('groupNumber'),
                    picArr: self.model.get('commonIds').toString()
                });
            });

            //删除
            /**只有上传者和管理员才有权限删除照片
             *如果同时选择了别人上传的和自己的上传的照片，点击删除只能删除自己的
             *如果只选择了别人上传的照片，则删除Button置灰不可点击
             */
            self.ui.deleteBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_delete');

                top.$Msg.confirm(self.model.tipWords['DELETE_CONFIRM'], function () {
                    self.model.deletePics(function (result) {
                        if (result && result.responseData && result.responseData.code == 'S_OK') {
                            //移除DOM节点
                            //1、选中了轴点内所有图时，移除整个轴点
                            //2、否则移除相应图片而不移除轴点
                            _.each(self.selectedIds, function (ele, index) {
                                var picLi = $(self.el).find('li[data-fileid=' + ele + ']');
                                picLi && picLi.remove();
                            });
                            
                            _.each($(self.el).find('li[id] ul'), function (element) {
                                if ($(element).children('li').length == 0) {
                                    $(element).closest('li[id]').remove();
                                } else {
                                    //改变上传图片数量
                                    $(element).prev().find('span[name="count"]').html("上传了 "
                                        + $(element).children('li').length + " 张图片");
                                }
                            });
                            self.commonIds = _.difference(self.commonIds, self.selectedIds);
                            self.model.set('commonIds', self.commonIds);
                            self.selectedIds = [];
                            self.model.set('selectedIds', []);
                            
                            if (self.commonIds.length == 0) {
                                self.ui.toolbar.find('a.btnNormal').addClass('groupAlbum_btnNo');
                            } else { //置灰删除键即可
                                self.grayDel();
                            }
                            top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], { delay: 3000 });

                            //判断页面是否0相片，如果是，展示引导页
                            var timePointLi = self.ui.listContainer.children('li');
                            if (timePointLi.length == 0) {
                                self.groupmailModel.get("dataSum")["groupAlbum"] = 0;
                                self.noAlbumHandler();
                                return;
                            }

                            //如果删掉了第一个轴点，改变一下原第一个轴点下一个轴点的class
                            var firstLi = timePointLi.first();
                            if (!firstLi.hasClass('groupSession_name_first')) {
                                firstLi.addClass('groupSession_name_first');
                            }
                        } else {
                            top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_FAIL'], { delay: 1000, className: 'msgRed' });
                            self.logger.error('album delete return data error', '[album:delete]', result);
                        }
                    }, {
                        groupNumber: self.groupmailModel.get('groupNumber'),
                        picArr: self.model.get('selectedIds').toString()
                    });
                }, null, null, { isHtml: true, dialogTitle: "删除图片", icon: "i_warn", buttons: ['删除', '取消'] });
            });

            //发送
            self.ui.sendBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_send');

                var htmlCode = '';
                var fileList = [];
                var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_cloudS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})</span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';

                _.each(self.model.get('commonIds'), function (element, index) {
                    var $img = $(self.el).find('li[data-fileid=' + element + '] img');
                    var img = {
                        name: M139.Text.Utils.htmlEncode($img.attr('title')),
                        linkUrl: $img.attr('src'),
                        id: $img.parents('li').data('fileid'),
                        file: { fileSize: $img.data('filesize') }
                    };
                    fileList.push(img);

                    var shortName = getShortName(M139.Text.Utils.htmlEncode($img.attr('title'))),
                        prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
                        suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
                    var data = {
                        objId: $img.parents('li').data('fileid'),
                        prefix: prefix,
                        suffix: suffix,
                        fileSizeText: M139.Text.Utils.getFileSizeText($img.data('filesize')),
                        fileId: $img.parents('li').data('fileid')
                    };
                    htmlCode += top.$T.Utils.format(itemTemp, data);

                });
                top.$Evocation.create({
                    type: "compose", subject: "【139邮箱-群相册】" + fileList[0].name,
                    content: "", whereFrom: "disk", diskContent: htmlCode, diskContentJSON: fileList
                });

                function getShortName(fileName) {
                    if (fileName.length <= 30) return fileName;
                    var point = fileName.lastIndexOf(".");
                    if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
                    return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
                }
            });

            //存彩云
            self.ui.saveBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_saveCaiyun');

                var arr = self.model.get('commonIds');
                if (arr.length > 0) {
                    self.model.saveCaiyunbatchPreDownload(function (result) {
                        if (result && result.responseData && result.responseData['code'] === 'S_OK') {
                            var data = result.responseData['var'];
                            if (data && $.isArray(data)) {
                                var attaches = [];
                                $.each(data, function (i, obj) {
                                    attaches.push({
                                        fileSize: obj['imgSize'],
                                        fileName: obj['imgName'],
                                        url: obj['downloadUrl']
                                    });
                                });
                                var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                                    Attachinfos: attaches
                                });

                                saveToDiskview.render().on('success', function () {
                                    console.log('存彩云成功');
                                });
                            }
                        } else {
                            top.M139.UI.TipMessage.show('获取批量下载地址失败', { delay: 3000, className: 'msgRed' });
                        }

                    }, {
                        groupNumber: self.groupmailModel.get('groupNumber'),
                        fileId: self.model.get('commonIds').toString()
                    });
                } else {
                    top.M139.UI.TipMessage.show('未选中图片', { delay: 3000, className: 'msgYellow' });
                }
            });

            //点击显示联系人页卡
            $(self.el).find('a[data-tid="group_mail_contacts_click"]').off('click').click(function (e) {
                if (self.myContactsCard && !self.myContactsCard.isHide()) {
                    return;
                }
                var contactCardComp = new window.parent.M2012.UI.Widget.ContactsCard().render(),
                    target = e.target || e.srcElement,
                    email = $(target).attr('title');
                self.myContactsCard = contactCardComp;
                if (contactCardComp) {
                    contactCardComp.show({
                        dockElement: target,
                        email: email,
                        dx: 1,
                        dy: 120
                    });
                }
            });
        },
        render: function (result) {            
        },
        grayDel: function () {
            var self = this;
            self.ui.toolbar.find('a.btnNormal').eq(1).addClass("groupAlbum_btnNo");
        },
        noAlbumHandler: function () {
            var self = this;
            self.ui.main.hide();
            self.ui.noListContainer.height($(window).height() - $('#groupAlbumTabs').height() - 159);
            self.ui.noListContainer.show();

            //隐藏工具按钮
            self.ui.toolbar.hide();            
            self.fileUpload && self.fileUpload.isShow(false);
            if (self.uploaderWhenListNil) {
                if (self.uploaderWhenListNil.getMarginLeft() == '-999px') { 
                    self.uploaderWhenListNil.isShow(true);
                }
                return;
            }

            setTimeout(function () {
                var len = 0, index = 0;
                var uploaderWhenListNil = new FileUpload({
                    container: document.getElementById("btnNil"),
                    getUploadUrl: function () {
                        //地址上灰度和全网是必须适配
                        var singleUrl = [
                            "http://" + window.location.host + '/mw2/groupmail/s?func=gom:uploadFile',
                            '&groupNumber=', self.groupmailModel.get("groupNumber"),
                            '&sid=', top.sid,
                            '&comefrom=1'
                        ].join('');
                        return self.model.get('isBatchUpload') ? (singleUrl + '&transId=' + self.model.get('batchTransId')) :
                            (singleUrl + '&transId=' + Math.random() + new Date().getTime());

                    },
                    onselect: function (files) {
                        if (files.length == 0) return;
                        if (!self.judgeExt(files)) {
                            this.reset();
                            return;
                        }
                        var me = this;
                        len = files.length;

                        //添加新轴点                        
                        self.ui.listContainer.html('');
                        self.ui.noListContainer.hide();
                        self.ui.main.show();
                        self.ui.toolbar.show();
                        if (self.fileUpload) {
                            self.fileUpload.dock('#uploadBtn');
                            self.fileUpload.isShow(true);
                        }
                                                
                        var timePoint = self.model.formatDate();
                        var prependHtml = _.template(self.templateUploadHeader,
                            {
                                timePoint: timePoint, userName: self.model.get('curUserName'),
                                userId: self.model.get('curUserId'), count: files.length,
                                email: self.model.get('curEmail'),
                                templateId: 'li_' + new Date().getTime()
                            });
                        self.ui.listContainer.prepend(prependHtml);
                        

                        //改变一下原来列表第一个元素的样式
                        $(".groupSession_name_first").eq(1).removeClass(" groupSession_name_first");

                        if (files.length > 1) {
                            self.model.set('isBatchUpload', true);
                            self.model.set('batchTransId', Math.random() + '' + new Date().getTime());
                        } else {
                            self.model.set('isBatchUpload', false);
                            self.model.set('batchTransId', '0');
                        }

                        $(files).each(function (i, n) {
                            self.updateUI(n);
                        });
                        setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                            me.upload();
                        }, 10);
                    },
                    onprogress: function (fileInfo) {
                        self.updateUI(fileInfo);
                    },
                    oncomplete: function (fileInfo, responseText) {
                        console.log("responseText: " + responseText);
                        try {
                            var responseData = eval("(" + responseText + ")");
                        } catch (ex) { console.log("responseText try catch"); }
                        var $pic = $(".groupSession_pic").first().find("li[taskid=" + fileInfo.taskId + "]");
                        var rslt = {},
                            fileId = 0,
                            thumUrl = '',
                            name = '',
                            size = 0;
                        if (responseData) {
                            var code = responseData['code'];
                            if (code === 'S_OK') {
                                rslt = responseData['var'];

                                fileId = rslt.fileId;
                                thumUrl = rslt.thumUrl;

                                name = fileInfo.fileName;
                                size = fileInfo.fileSize;

                                //设置DOM节点属性fileId
                                $pic.attr('data-fileid', fileId);
                                $pic.find('img').attr('data-fileid', fileId);

                                //设置缩略图src属性
                                $pic.find('img').attr('src', thumUrl)
                                                .attr('title', name)
                                                .attr('data-filesize', size);
                                $pic.find('.i_groupIco_bg').remove();
                                $pic.find('.i_groupIco_num').remove();
                                $pic.removeAttr('taskid');

                                self.updateUI(fileInfo);
                            } else if (code === 'PML10406010') {
                                self.uploadError($pic, '图片格式不符合要求', responseData['summary']);
                            } else if (code === 'PML10406012') { //超容量
                                self.uploadError($pic, '群组容量不足', responseData['summary']);
                            } else if (responseData['summary'] == '服务端校验不通过') {
                                top.$App.setSessionOut();
                            }
                        } else {
                            console.log("上传返回报文格式有误");
                        }

                        var picObj = {
                            imgId: fileId,
                            imgName: name,
                            imgSize: size,
                            imgUrl: thumUrl
                        };
                        self.uploadArr.push(picObj);

                        index++;
                        if (index == len) {
                            //将轴点加到("uploadFileList")
                            var templateId = $(".groupSession_name_first").attr('id');
                            var item = {
                                count: len,
                                email: self.model.get('curEmail'),
                                photos: self.uploadArr,
                                timePoint: '',
                                userId: self.model.get('curUserId'),
                                userName: self.model.get('curUserName')
                            };
                            !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = item);
                            self.groupmailModel.get("dataSum")["groupAlbum"] = index;
                            self.addPreviewEvent();

                            self.eventHandler();
                            index = 0;
                            self.uploadArr = [];

                            //隐藏
                            this.isShow(false);

                            //重置
                            this.reset();
                        }
                    },
                    logKey: 'group_mail_album_uploadPic'
                });
                self.uploaderWhenListNil = uploaderWhenListNil;
            }, 1000);            
        },
        loadMore: function (num) {
            var self = this;
            if (num > self.model.get('pageCount')) {
                return;
            }
            self.model.getAlbumList(function (result) {
                if (result && result.responseData) {
                    if (result.responseData['var']) {
                        var data = result.responseData['var'];
                        if (data && $.isArray(data) && data.length > 0) {
                            _.each(data, function (element, index) {
                                self.collection.add(element);
                            });
                            self.addPreviewEvent();
                            self.eventHandler();
                        }
                    }
                }
            }, { groupNumber: self.groupmailModel.get('groupNumber'), point: num });
        }

    }));
})(jQuery, _, M139);
﻿
(function (jQuery, _, M139) {
var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.Session.MemberList",superClass.extend({

    defaults:{  
	},
	initialize : function(options){
	},
    /**
     * 如果该联系人在通讯录内, 并且使用的不是电话号码作为邮件地址, 需更新通讯录
     * @param param
     * @param fnSuccess
     * @param fnFail
     */
    updateAddress: function(param, fnSuccess, fnFail){
        top.Contacts.execContactDetails(param, function (result) {
            if (result.success) {
                fnSuccess(result);
            } else {
                fnFail(result);
            }
        });
    },
    /**
     * 如果该用户不在通讯录内, 需将这个联系人加入到通讯录
     * @param contact
     * @param fnSuccess
     * @param fnError
     */
    addAddress : function (contact, fnSuccess, fnError) {
        var contactInfo = new top.M2012.Contacts.ContactsInfo();
        contactInfo.name = contact.name;
        contactInfo.email = contact.email;
        contactInfo.mobile = contact.MobilePhone;

        top.M2012.Contacts.API.addContacts(contactInfo, function(response){
            console.log(response);
            if (response.success) {
                _.isFunction(fnSuccess) && fnSuccess(response);
            }else{
                _.isFunction(fnError) && fnError(response);
            }
        });
    }
}));

})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var interval;
    M139.namespace('M2012.GroupMail.View.Session.MemberList', superClass.extend(
    {
        el: "#groupAlbumContacts",
        events: {
            "click [data-action=expand]" : "clickHandler"
        },
        EVENT : {
            SHOW_CONTACT_CARD : "showContactCard"
        },
        Constant : {
            Screen_Width_Limit : 1024 // 屏幕宽度设置值
        },
        template : [
            '<li class="" isSelf="{isSelf}" title="{userEmail}">',
                '<a class="clearfix" href="javascript:;">',
                    '{img}',
                    '<div class="groupAlbumContacts_list_con">',
                        '<p>{userName}</p>',
                        '<span>{userEmail}</span>',
                    '</div>',
                '</a>',
            '</li>'].join(" "),
        iconTemplate : [
            "<i class='{groupIcon}'></i>{groupName}"
        ].join(""),
        initialize: function (options) {
            var that = this;
            this.model = options.model;
            this.selfModel = new M2012.GroupMail.Model.Session.MemberList();

            this.model.on("change:groupNumber",function(e){
                that.model.getGroupMemberList(function(response) {
                    // 调用接口成功时的处理
                    // success handle
                    response && that.render(response);
                    that.initEvents();
                    //that.model.trigger("adjustHeight", "groupAlbumContacts_list");
                }, function () {
                    // 调用接口失败时的处理
                    // error handle
                });
            });

            // 伸缩按钮绑定事件
            $("#switchOn").click(function() {
                var groupAlbumBoxCon = $("#groupAlbumBoxCon");
                $(that.el).toggle();
                if (groupAlbumBoxCon.hasClass("mr_0")) {
                    // 伸缩
                    top.BH && top.BH("group_mail_session_expandList");
                }else{
                    // 展开
                    top.BH && top.BH("group_mail_session_unExpandList");
                }
                groupAlbumBoxCon.toggleClass("mr_0");
                $("#msg_status_wrapper").toggleClass("writeMainOff");
            });

            // 根据屏幕宽度判断是否需要隐藏群成员列表
            // 屏幕宽度超过1024时, 群组列表始终出现, 反之, 群组列表默认收起
            that.on("hideMemberList", function() {
                var screenWidth = window.screen.width;
                if (screenWidth <= that.Constant.Screen_Width_Limit) {
                    // 小于等于1024, 群组列表收起, 展示收缩按钮
                    $("#switchOn").removeClass("hide");
                    $(that.el).hide();
                    $("#groupAlbumBoxCon").addClass("mr_0");
                }
                // 默认伸缩按钮是隐藏的(大于1024时)
            });

            // 默认触发
            that.trigger("hideMemberList");
        },
        getElement : function (tag) {
            return $(this.el).find(tag);
        },
        initEvents : function(){
            var that = this;
            // 初始化时先设置群成员列表的高度
            that.model.trigger("adjustHeight", "groupAlbumContacts_list");
            // 改变窗口大小时,也应该实时调整页面的高度
            $(window).resize(function() {
                that.model.trigger("adjustHeight", "groupAlbumContacts_list");
            });

            // 鼠标左键点击时改变颜色
            that.getElement("li").click(function() {
                $(this).addClass("groupOn").siblings().removeClass("groupOn");
            });

            // 给群成员列表绑定鼠标右键点击事件
            that.getElement("li").contextmenu(function(e){
                var isSelf = Number($(this).attr("isSelf")),
                    email = $(this).attr("title");

                if (!!isSelf) {
                    // 如果是自己, 暂时不显示右键菜单
                    return false;
                }

                that.popMenu(e, email);
                return false; //屏蔽浏览器右键默认行为
            });
        },
        /**
         * 根据后台返回的路径构建图片路径
         * @param result
         */
        getImgPath : function (result) {
            var path = '';
            if (!result) {
                console.warn && console.warn("imgurl error");
                return path;
            }

            if (result.imageUrl) {
                path = "<img title='' alt='' src='" + new top.M2012.Contacts.ContactsInfo({ ImageUrl: result.imageUrl }).ImageUrl + "'>";
            }else if ($App.regularName(result.name)) {
                path = '<i class="groupAlbumContacts_list_con_tou"><span style="font-size:24px;display: block;height:32px;line-height:32px;">' + $App.regularName(result.name, 32) + '</span></i>';
            }else {
                path = "<img title='' alt='' src='/m2012/images/global/avatar/avatar_s_01.png'>";
            }

            return path;
        },
		render : function(result) {
            var that = this,
                elementArr = [],
                element = result["users"];

            for (var i = 0,len = element.length; i < len; i++) {
                elementArr.push($T.Utils.format(that.template, {
                    userName : $T.Html.encode(element[i].name) || 'default',
                    userEmail : $T.Html.encode(element[i].email) || 'default@139.com',
                    isSelf : Number(element[i].userId) == Number(that.model.get("currentUserId")) ? 1 : 0,
                    img : that.getImgPath(element[i])
                }));
            }

            // 填充群成员总数
            $(that.el).find("#memberAccount").html("（" + (element.length || 0) + "人）");

            // 填充群成员列表
            $(that.el).find("ul").html(elementArr.join(""));
		},
        /**
         * 实时设置页面的高度
         * 页面初始化,以及调整窗口(resize)时会调用该方法
         **/
        adjustHeight: function () {

        },
        /**
         * 如果该成员在通讯录列表中存在, 则不展示"添加到通讯录"
         * 如果该成员在通讯录列表中不存在, 则需要展示"添加到通讯录"
         * @param isExist 邮件地址是否在通讯录中存在 boolean
         * @returns {*[]}
         */
        getMenuList : function (isExist) {
            var arr = [
                { text: '发邮件', command: "sendEmail", bh:"group_mail_session_email_rightClick" },
                { text: '发短信', command: "sendSms", bh: "group_mail_session_message_rightClick" },
                { text: '添加到通讯录', command: "toAddress", bh: "group_mail_session_address_rightClick"}
                //{ isLine: true } 显示分割线, 这里不需要显示
            ];

            !!isExist && arr.pop();
            return arr;
        },
        //获取鼠标的绝对坐标
        getMousePos:function(event){
            var e = event || window.event;
            return {
                x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        },
        /**
         * 弹出右键菜单
         * @param e
         * @param email
         */
        popMenu : function (e, email) {
            var that = this,menu,
                position = that.getMousePos(e);

            menu = M2012.UI.PopMenu.create({
                width2: 180,
                items: that.getMenuList(that.isExist(email)),
                top: position.y + "px",
                left: position.x + "px",
                onItemClick: function (item) {
                    // 操作日志
                    item.bh && top.BH && top.BH(item.bh);
                    // 不同的操作处理
                    that.command(item.command);
                }
            });

            // 绑定自动隐藏事件
            bindHideEvent(menu.el);

            // 先保存起来, 或许会有用
            this.selfModel.set("currentMenu", menu);

            // 右键菜单自动消失
            function bindHideEvent(el) {
                var timerId = -1;
                $(el).mouseenter(function () {
                    clearTimeout(timerId);
                }).mouseleave(function () {
                    disappearInFuture();
                });
                function disappearInFuture() {
                    timerId = setTimeout(function () {
                        menu.remove();
                    }, 500);
                }
            }
        },
        command : function (command) {
            var that = this,
                contactInfo = that.selfModel.get("contactInfo");

            var msg = {
                phone_msg : '手机号码',
                phone_msg_tip: '电话号码不能为空'
            };

            switch (command) {
                case 'sendEmail':
                    top.$Evocation.create({
                        'to':'4',
                        'type': '1',
                        'specify': '"{0}"<{1}>'.format(contactInfo.name, contactInfo.email)
                    });
                    break;
                case 'sendSms':
                    sendSms(that.isExist(contactInfo.email));
                    break;
                case 'toAddress':
                    //添加联系人
                    new top.M2012.UI.Dialog.ContactsEditor({
                            name: contactInfo.name,
                            email: contactInfo.email,
                            mobile: contactInfo.mobile
                    }).render();
                    break;
                default:
                    break;
            }

            /**
             * 发送邮件前先判断是否在通讯录中
             * 1. 不在通讯中, 直接弹窗输手机号码
             * 2. 在通讯录中, 分两种情况 :
             *    (1) : 使用的手机号码作为邮箱号码
             *    (2) : 使用通行证号或别名作为邮箱号码
             * @param isExist 为true时代表该邮件地址在通讯录中
             */
            function sendSms (isExist) {
               if (isExist) {
                   if ((!contactInfo.MobilePhone || $.trim(contactInfo.MobilePhone) == "") &&
                       (!contactInfo.BusinessMobile || $.trim(contactInfo.BusinessMobile) == "")) {
                       // 表示使用通行证号或别名作为邮箱号码(这个是借用通讯录的逻辑m2012.addr.view.check.js)
                       operate(true, msg.phone_msg, handleSms);
                       return;
                   }

                   // 表示使用的手机号码作为邮箱号码, 为正常的流程处理, 直接弹出写短信窗口
                   top.$Evocation.create({
                       'to':'4',
                       'type': '2',
                       'specify': _.isFunction(contactInfo.getFirstMobile) && contactInfo.getFirstMobile().replace(/\D/g, "")
                   });
                   return;
               }

                // 不在通讯录中的处理方式
                operate(false, msg.phone_msg, handleSms);

                /**
                 * 发送信息时的详细处理步骤
                 * @param info 操作中需要用到的用户信息
                 */
                function handleSms(info) {
                    var isExist = info.isExist,
                        phoneNumber = info.txtValue;
                    if (!isCorrectPhoneNumber(phoneNumber)) {
                        // 输入的手机号不正确时系统给予提示
                        return;
                    }

                    if (isExist) {
                        // 在通讯录中, 但不以手机号作为邮箱地址时的处理, 需要调用接口更新通讯录中对应的那条记录
                        that.selfModel.updateAddress(getContactParam(phoneNumber), function (response) {
                            // success handle
                            fnSuccess(phoneNumber);
                        }, function (response) {
                            // error handle
                            fnError(response);
                        });
                    } else {
                        // 不在通讯录中时的处理, 需要调用接口向通讯录中添加一条数据
                        that.selfModel.addAddress(getContactParam(phoneNumber), function (response) {
                            var SerialId = response.contacts && response.contacts.SerialId;
                            console.log && console.log("add Address success, SerialId: " + SerialId);
                            fnSuccess(phoneNumber);
                        }, function (response) {
                            // error handle
                            fnError(response);
                        });
                    }
                }

                /**
                 * 操作失败时的提示信息
                 * @param result
                 */
                function fnError (result) {
                    // isHtml为true表示要显示样式
                    top.$Msg.alert(result.msg, {isHtml : true});
                }

                /**
                 * 操作成功时
                 */
                function fnSuccess(phoneNumber) {
                    // 检测对应功能是否对互联网用户开放
                    if (!(top.$User && !top.$User.checkAvaibleForMobile())) {
                        // 弹出短信窗口
                        top.$Evocation.create({
                            'to':'4',
                            'type': '2',
                            'specify': phoneNumber.replace(/\D/g, "")
                        });
                        console.warn && console.warn("checkAvaibleForMobile error");
                    }
                    // 关闭输入手机号码的弹窗
                    that.inputDialog.close();

                    // may be need do some other...

                }


                /**
                 * 验证输入的手机号码是否正确
                 * @param phoneNumber 用户输入的手机号码
                 */
                function isCorrectPhoneNumber(phoneNumber) {
                    if (!phoneNumber) {
                        // 如果手机号码为空
                        getElement("txtMessage").text(msg.phone_msg_tip);
                        return false;
                    }

                    if (!top.Validate.test("mobile", phoneNumber)) {
                        // 不满足手机号码格式
                        getElement("txtMessage").text(top.Validate.error);
                        return false;
                    }

                    if (phoneNumber.length > 100) {
                        // 超过长度限制
                        getElement("txtMessage").text(top.frameworkMessage['warn_contactMobileToolong']);
                        return false;
                    }

                    return true;
                }

                /**
                 * 获取调用接口时所需的参数
                 * @param phoneNumber 用户输入的电话号码
                 */
                function getContactParam(phoneNumber) {
                    var param = {};
                    // contactInfo的值会根据这个联系人是否在通讯内中而不相同
                    $.extend(param, contactInfo);
                    // 将电话号码替换成用户从弹窗中输入的电话号码
                    param["MobilePhone"] = top.encodeXML(phoneNumber);
                    return param;
                }
            }

            /**
             * 不同的操作(发短信或发邮件)有不同的处理方式, 这个在该方法中进行分配
             * @param isExist 表示该联系人是否在通讯录中存在,isExist表示存在
             * @param msg 要提示的信息
             * @param fn  该操作需要调用的函数
             */
            function operate(isExist, msg, fn) {
                // 处理非手机号码作为邮件地址的情况, 需弹出窗让用户输入手机号
                that.inputDialog = top.$Msg.showHTML(getNextHtml(msg, that.cid));
                getElement("btnNext").click(function(){
                    var textValue = $.trim(getElement("txtValue").val());
                    _.isFunction(fn) && fn({
                       isExist : isExist,
                       txtValue : textValue
                    });
                });
            }

            /**
             * 获取弹窗中的模板
             * @param name
             * @param id
             * @returns {*}
             */
            function getNextHtml(name, id) {
                return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="{1}_txtValue" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="{1}_txtMessage" name="divError"  style="color:Red;padding-left:113px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:;"  id="{1}_btnNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
                </div>'.format(name, id);
            }

            /**
             * 根据ID查找弹出窗中相应的元素
             * @param id
             * @returns {*}
             */
            function getElement(id) {
                return that.inputDialog.$el.find("#" + that.cid + "_" + id);
            }

        },
        /**
         * @param email : 邮件地址
         * 此方法用途:
         *  1.根据邮件地址判断是否在通讯录中存在, 存在返回true, 否则返回false
         *  2.将对应的通讯信息保存在model当中
         */
        isExist : function (email) {
            var that = this;
            var address = M139.Text.Email.getEmail(email);
            if (!address) {
                console.warn && console.warn("address: " + address);
                return false;
            }

            var contactInfo = top.M2012.Contacts.getModel().getContactsByEmail(address),
                contact = contactInfo && contactInfo[0],
                info = {};

            if (contact && contact.SerialId) {
                // 存在SerialId, 表示在通讯录中存在(好像有contact的话一定会有SerialId??)
                info.id = contact.SerialId;
                info.email = address;
                // 保存通讯录信息
                that.selfModel.set("contactInfo", $.extend(contact, info));
                return true;
            }

            // 通讯录中不存在时, 保存name和email
            info.name = M139.Text.Email.getName(email);
            info.email = address;
            // 保存通讯录信息
            that.selfModel.set("contactInfo", info);

            console.warn && console.warn("contact: " + contact);
            return false;
        }
    }));
})(jQuery, _, M139);


