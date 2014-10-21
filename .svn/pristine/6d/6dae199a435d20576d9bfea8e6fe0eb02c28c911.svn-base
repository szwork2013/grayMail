(function (jQuery, _, M139) {
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

