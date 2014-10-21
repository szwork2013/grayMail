/** 
 * @fileOverview 定义联系人选项卡组件
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.ContactsCard";
    /**
    *@namespace
    *@name M2012.UI.Widget.ContactsCard
    */
    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Widget.ContactsCard.prototype*/
    {
        /** 定义联系人选项卡组件
        *@constructs M2012.UI.Widget.ContactsCard
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@inner
        */
        initialize: function (options) {
            var $el = jQuery(this.template);

            this.setElement($el);

            this.contactsModel = M2012.Contacts.getModel();

            this.model = new Backbone.Model();

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:[
        '<div class="tips contactTips" style="left:20px;top:400px;z-index:1023;display:none;">',
 	        '<div class="tips-text">',
 		        '<div class="imgInfo"><img class="imgLink FaceImage" rel="../images/ad/face.jpg" width="50" height="50" alt="">',
 			        '<dl>',
 				        '<dt><span class="Lbl_Name">{name}</span><a class="ml_5 Vip" style="display:none;" href="javascript:;"></a></dt>',
 				        '<dd class="gray Lbl_Email">{email}</dd>',
 				        '<dd class="gray Lbl_Mobile">{mobile}</dd>',
 			        '</dl>',
 		        '</div>',
 		        '<div class="sTipsBtn2 clearfix">',
 			        '<a hidefocus="1" href="javascript:;" class="Contacts">加到通讯录</a>',
                    '<a bh="contactscard_compose" hidefocus="1" href="javascript:;" class="SendEmail">发邮件</a>',
                    '<a bh="contactscard_sms" hidefocus="1" href="javascript:;" class="SendSMS">发短信</a>',
                    '<a hidefocus="1" href="javascript:;" class="more on ShowMore">更多<span class="morfont">&gt;</span></a>',
 		        '</div>',
 		        '<div class="menuPop shadow MoreMenu" style="left:335px;top:70px;display:none">',
                     '<ul>',
                         '<li><a bh="lianxikaclassify_onclick" hidefocus="1" class="LetterSort" href="javascript:;"><span>创建收信规则</span></a></li>',
                         //'<li><a bh="contactscard_tags" hidefocus="1" class="LetterTag" href="javascript:;"><span>设置标签</span></a></li>          ',
                         '<li><a bh="set_mail_arrive_notice" hidefocus="1" class="Notify" href="javascript:;"><span>设置邮件到达通知</span></a></li>',
                         //'<li><a bh="contactscard_reject" hidefocus="1" class="Reject" href="javascript:;"><span>拒收</span></a></li>',
                         //'<li style="display:none"><a bh="contactscard_invite" class="BtnInvite" hidefocus="1" href="javascript:;"><span>邀请</span></a></li>', //通讯录兼容标准版2.0-灰度线验收2013-3-29，屏蔽邀请入口
                         '<li><a bh="contactscard_letterhistory" hidefocus="1" class="LetterHistory" href="javascript:;"><span>往来邮件</span></a></li>',
                     '</ul>',
                 '</div>',
 	        '</div>',
             '<div class="tipsTop diamond"></div>',
         '</div>'].join(""),
        events:{
            "click .Contacts": "onContactsClick",
            "click .SendEmail": "onSendEmailClick",
            "click .SendSMS": "onSendSMSClick",
            "click .BtnInvite": "onInviteClick",
            "click .Reject": "onRejectClick",
            "click .LetterHistory": "onLetterHistoryClick",
            "click .LetterSort": "onLetterSortClick",
            "click .LetterTag": "onLetterTagClick",
            "click .Notify": "onNotifyClick",
            "click .Vip": "onVipClick",
            "click a:": "onButtonClick"
        },
        /**
         *@inner
         *构建dom函数
        */
        render:function(){
            var options = this.options;
            this.initEvent();

            this.$el.appendTo(document.body);

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *@inner
         *显示联系人卡片
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.dockElement 联系人卡片停靠的元素
         *@param {String} options.email 联系人的邮件地址（会自动搜索通讯录联系人）
         *@param {String} options.serialId 可选参数，联系人的id
         *@example
         var card = new M2012.UI.Widget.ContactsCard().render();
         card.show({
            dockElement:document.getElementById("myDiv")
            email:"lifula@139.com"
         });
         */
        show: function (options,isDelay) {
            var This = this;

            if (!options.email && !options.serialId) {
                return;
            }
            if (!options.dockElement || M139.Dom.isRemove($(options.dockElement)[0])) {
                return;
            }
            var jEl = $(options.dockElement);
            if (!jEl.attr("bindcard")) {
                //防止重复绑定
                jEl.attr("bindcard", "1").mouseleave(function () {
                    This.delayHide();
                });
            }
            //延迟显示
            if (isDelay) {
                clearTimeout(this.showTimer);
                this.showTimer = setTimeout(function () {
                    This.show(options);
                }, 500);
                return;
            }

            //绑定数据
            this.setAddrInfo(options);

            //弹出框定位
            var direction = M139.Dom.dockElement(options.dockElement, this.el, {
                margin: options.margin || 0,
                dx : options.dx,
                dy : options.dy
            });

            //改变箭头方向
            if (direction == "up") {
                this.$("div.tipsTop").addClass("tipsBottom").removeClass("tipsTop");
            } else {
                this.$("div.tipsBottom").addClass("tipsTop").removeClass("tipsBottom");
            }

            var overflowX = $(options.dockElement).offset().left + this.$el.width() - $(document.body).width();
            //处理溢出屏幕
            if (overflowX > 0) {
                this.$el.css("left", $(options.dockElement).offset().left - overflowX);
                this.$("div.tipsTop,div.tipsBottom").css("left",15 + overflowX);
            } else {
                this.$("div.tipsTop,div.tipsBottom").css("left", 15);
            }


            this.cancelHide();

            if (options.flag == 'groupMail') { // 专门针对群邮件中联系人卡片的显示图片
                this.renderGroupMailImage(options["groupMail"]);
            }else{
				// 保留原先的逻辑
                this.renderFaceImage();
                this.requestFaceImage();
            }

            try {
                BH("contactscard_show");
            } catch (e) { }

            return superClass.prototype.show.apply(this, arguments);
        },
        

        /**
         *获取联系人头像
         *@inner
         */
        requestFaceImage: function () {
            var This = this;
            var info = this.model.get("info");
            var addrInfo = [];
            if (info.mobile) {
                addrInfo.push(info.mobile);
            }
            if (info.email && M139.Text.Email.getDomain(info.email) == $App.getMailDomain()) {
                var account = M139.Text.Email.getAccount(info.email);
                if (account !== info.mobile) {
                    addrInfo.push(account);
                }
            }
            // 调用后端的批量接口获取图像数据
            M2012.Contacts.API.GetBatchImageUrl({
                addressInfo : addrInfo,
                info : info
            }, function (url) {
                var currentInfo = This.model.get("info");
                if (info.email === currentInfo.email) {//防串
                    This.renderFaceImage(url);
                }
            });
        },

        renderFaceImage: function (url) {
            var img = this.$(".FaceImage");
            if (url) {
                img.attr("src", url);
            } else {
                //默认头像
                img.attr("src", img.attr("rel"));
            }
        },

        renderGroupMailImage : function(param) {
            if (!param) {
                return;
            }

            var img = this.$(".FaceImage");
            if (param.imgUrl) {
                img.replaceWith('<img class="imgLink FaceImage" rel="../images/ad/face.jpg" src="' + param.imgUrl + '" width="50" height="50" alt="">');
            }else{
                // 必须加上FaceImage,保证img元素存在并被替换
                img.replaceWith('<i class="FaceImage group_detailBig">' + param.firstName + '</i>');
            }
        },
        /**
         *@inner
         */
        showMoreMenu:function(){
            var menu = this.$(".MoreMenu");
            menu.show();
            try {
                //这里会不存在？
                var overflowX = menu.offset().left + menu.width() - $(document.body).width();
                if (overflowX > 0) {
                    menu.css("left", 101);
                } else {
                    menu.css("left", 335);
                }
            } catch (e) {
                menu.css("left", 335);
            }
            var menuTop = this.$el.height() - 29;
            //计算溢出值
            var moreTop = this.$el.offset().top + menuTop + M139.Dom.getElementHeight(menu) - $(document.body).height();
            if (moreTop > 0) {
                menuTop -= moreTop;
            }
            menu.css("top", menuTop);
            BH("contactscard_more");
        },

        /**
         *初始化事件行为
         *@inner
         */
        initEvent:function(){
            var This = this;
            $(this.dockElement).mouseover(function(){
                This.show();
            });

            this.$("a.ShowMore").mouseenter(function () {
                This.showMoreMenu();
            }).click(function () {
                This.showMoreMenu();
            });
            this.$el.mouseleave(function () {
                This.$(".MoreMenu").hide();
                This.delayHide();
            });

            this.$el.mouseenter(function () {
                This.cancelHide();
            });

            this.model.on("change:info",function(){
                This.updateHTML();
            });
        },
        /**
         *延迟消失
         *@inner
         */
        delayHide:function(){
            var This = this;
            clearTimeout(this.showTimer);
            if (this.$el.css("display") != "none") {
                this.hideTimer = setTimeout(function () {
                    This.hide();
                }, 500);
            }
        },
        /**
         *取消延迟消失
         *@inner
         */
        cancelHide:function(){
            clearTimeout(this.hideTimer);
        },

        /**
         *@innner
         *更新界面
         */
        updateHTML:function(){
            var info = this.model.get("info");
            this.$(".Lbl_Name").text(info.name);
            this.$(".Lbl_Email").text(info.email||"");
            this.$(".Lbl_Mobile").text(info.mobile||"");
            
            this.isVip = 0; //不在通讯录内
            var contactsBtn = "加到通讯录";
            if(info.id){
                contactsBtn = "编辑";
                this.isVip = 2; //不是vip联系人
                var _vipc = top.Contacts.getVipInfo();
                var i = $.inArray(info.id, _vipc.vipSerialIds.split(','));
                if(i > -1) this.isVip = 1; //是vip联系人
            }
            this.updateVipIcon();
            this.$(".Contacts").text(contactsBtn);

            if (info.email && M139.Text.Email.getDomain(info.email) != $App.getMailDomain()) {
                this.$(".BtnInvite").parent().show();
            } else {
                this.$(".BtnInvite").parent().hide();
            }

        },
        
        updateVipIcon:function(){
            if(this.isVip == 1){
                this.$(".Vip").removeClass('user_gray_vip').addClass('user_vip')
                     .attr('bh','contactscard_delvip')
                     .attr('title','取消“VIP联系人”')
                     .show();
                
            }else if(this.isVip == 2){
                this.$(".Vip").removeClass('user_vip').addClass('user_gray_vip')
                     .attr('bh','contactscard_addvip')
                     .attr('title','添加“VIP联系人”，其邮件将同时标记为“VIP邮件”')
                     .show();
                
            }else{
                this.$(".Vip").hide();
            }
        },

        /**
         *@inner
         *从show参数获取联系人信息
         */
        setAddrInfo:function(options){
            var info = {};
            var addr = M139.Text.Email.getEmail(options.email);
            if(options.serialId){
                var c = this.contactsModel.getContactsById(options.SerialId);
            }else if(options.email){
                var name = M139.Text.Email.getName(options.email);
                var c = this.contactsModel.getContactsByEmail(addr);
                c = c && c[0];
                if (!c) {
                    info.name = name;
                    //info.email = addr;
                } 
            }
            if(c){
                info.name = c.name;
                //info.email = c.getFirstEmail();
                info.mobile = c.getFirstMobile();
                info.id = c.SerialId;
            }
            info.email = addr;
            this.model.set("info",info);//change:info 事件触发别的动作
        },

        /**
         *点击发邮件
         *@inner
         */
        onSendEmailClick: function () {
            var info = this.model.get("info");
            if (info.email) {
                var args = { receiver: M139.Text.Email.getSendText(info.name,info.email) }
            }
            $App.show("compose", null, {
                inputData:args
            });
            return false;
        },

        /**
         *点击发短信
         *@inner
         */
        onSendSMSClick: function () {
            var info = this.model.get("info");
            if (info.mobile) {
                var args = { mobile: M139.Text.Mobile.getSendText(info.name, info.mobile) }
            }
            $App.jumpTo("sms", args);
            return false;
        },

        /**
         *点击添加到通讯录、编辑联系人按钮
         *@inner
         */
        onContactsClick: function () {
            var info = this.model.get("info");
            if (info.id) {
                //编辑联系人
                new M2012.UI.Dialog.ContactsEditor({
                    serialId: info.id
                }).render();
                BH("contactscard_edit");
            } else {
                //添加联系人
                new M2012.UI.Dialog.ContactsEditor({
                    name: info.name,
                    email: info.email,
                    mobile: info.mobile
                }).render();
                BH("contactscard_add");
            }
            return false;
        },



        /**
         *点击邀请
         *@inner
         */
        onInviteClick: function () {
            var email = this.model.get("info").email;
            $App.jumpTo('invitebymail', {
                email: email
            });
            return false;
        },
        /**
         *点击拒收
         *@inner
         */
        onRejectClick: function () {
            $App.trigger("mailCommand", { command: "refuseMail", email: this.model.get("info").email });
            return false;
        },
        /**
         *点击往来邮件
         *@inner
         */
        onLetterHistoryClick:function(){
            $App.trigger("mailCommand", { command: "showTraffic", email: this.model.get("info").email });
            return false;
        },

        /**
         *点击邮件分类
         *@inner
         */
        onLetterSortClick: function () {
            $App.trigger("mailCommand", { command: "autoFilter", email: this.model.get("info").email,name: this.model.get("info").name});
            return false;
        },

        /**
         *点击设置标签
         *@inner
         */
        onLetterTagClick:function(){
            $App.trigger("mailCommand", { command: "autoFilterTag", email: this.model.get("info").email,name: this.model.get("info").name });
            return false;
        },
        /**
         *点击设置到达通知
         *@inner
         */
        onNotifyClick: function () {
            if (!$User.isChinaMobileUser()) {
                $User.showMobileLimitAlert();
                return;
            }
            $App.show("notice");
            return false;
        },
        /**
         *点击添加会删除vip联系人
         *@inner
         */
        onVipClick: function () {
            var This = this;
            var info = this.model.get('info');
            var param = {
                serialId : info.id,
                name : info.name,
                success : function(){
                    This.isVip = This.isVip == 1 ? 2 : 1;
                    This.updateVipIcon();

                    if (This.isVip == 1) {
                        $(top.$App.getCurrentTab().element).find("a.Vip").removeClass('user_gray_vip').addClass('user_vip');
                    } else {
                        $(top.$App.getCurrentTab().element).find("a.Vip").removeClass('user_vip').addClass('user_gray_vip');
                    }

                    $App.trigger("showMailbox", { comefrom: "commandCallback" });
                }
            };
            if(this.isVip == 1){
                top.Contacts.delSinglVipContact(param);
            }else if(this.isVip == 2){
                top.Contacts.addSinglVipContact(param);
            }
        },
        
        /**
         *@inner
         */
        onButtonClick: function (e) {
            var This = this;
            //除了点击更多按钮，其它都隐藏贺卡
            if (!$(e.target).hasClass("ShowMore")) {
                setTimeout(function () {
                    This.hide();
                }, 0);
            }
            M139.Logger.behaviorClick(e.target);//因为对话框很快被移除，无法冒泡，因此主动触发行为点击监控
            return false;
        }
    }));


    //静态函数
    jQuery.extend(M2012.UI.Widget.ContactsCard,
        /**@lends M2012.UI.Widget.ContactsCard*/
        {
            /**
             *显示联系人卡片
             *@param {Object} options 参数集合
             *@param {HTMLElement} options.dockElement 联系人卡片停靠的元素
             *@param {String} options.email 联系人的邮件地址（会自动搜索通讯录联系人）
             *@param {String} options.serialId 可选参数，联系人的id
             *@example
             M2012.UI.Widget.ContactsCard.show({
                dockElement:document.getElementById("myDiv")
                email:"lifula@139.com"
             });
             */
            show:function(options){
                this._create().show(options, true);
            },
            /**@inner*/
            _create: function () {
                if (!this.current) {
                    this.current = new M2012.UI.Widget.ContactsCard().render();
                }
                return this.current;
            }
        }
    );

 })(jQuery,_,M139);