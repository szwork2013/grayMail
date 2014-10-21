(function (jQuery, _, M139) {
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

