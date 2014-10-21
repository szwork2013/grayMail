M139.namespace("M2012.GroupMail.Model", {
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
