(function (jQuery, _, M139) {
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

