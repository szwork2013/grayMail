/**
* @fileOverview 读信页往来邮件
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 读信页往来邮件会话
    */
        M139.namespace('M2012.ReadMail.ContactRecord.View', superClass.extend({
            el: "",
            template: {
                container: ['<div id="contactMails" class="contactsMailnew innerboxshadow">',
         '<div class="contactsMailnew-name">',
           '<p>与<span class="sendname"><a class="name" id="sendname" href="javascript:" bh="rmcontact_clickContacts">-</a></span>的往来邮件</p>',
         '</div>',
         '<div class="readtabnew">',
           '<ul class="readtabnew-ul clearfix">',
             '<li class="li1 on">',
               '<a href="javascript:void(0)"  hidefocus="" bh="rmcontact_clickRecMessage">',
                 '<span name="myreceive">我收到的邮件</span>',
               '</a>',
             '</li>',
             '<li class="li2">',
               '<a href="javascript:void(0)" hidefocus="" bh="rmcontact_clickSendMessage">',
                 '<span name="mysend" >我发送的邮件</span>',
               '</a>',
             '</li>',
           '</ul>',
           '<div class="readtabnew-text sweb dealings-scroll" id="contactrecord">',

             '</div>'].join(""),
                list: ['<div class="tips-attr {on}" mid="{mid}">',
           '<div class="tips-text innerboxshadow">',
             '<div class="imgInfo imgInfo-attr">',
               '<ul class="readtabnew-list">',
                 '<li>',
                     '<div class="readtabnew-warp">',
                           '<div class="date">',
                               '<p class="time">{receiveDate}</p>',
                           '</div>',
                           '<div class="cutline"></div>',
                           '<div class="mail-title">{subject}{attach}</div>',
                     '</div>',
                 '</li>',
               '</ul>',
             '</div>',
           '</div></div>'].join(""),
                tipRead: ['<div class="tipsRight-small"></div>',
           '<div class="readMailInfo">',
             '<div class="rMList" id="receiver_from"><span class="rMl">主　题：</span>',
               '<div class="rMr">',
                 '<div class="gAddr">{subject}</div>',
                 '</div>',
             '</div>',
             '<div class="rMList" id="receiver_to"><span class="rMl">发送至：</span>',
               '<div class="rMr">',
                 '<div class="gAddr" id="receiver_list"><strong class="gAddrN">{to}</strong></div>',
               '</div>',
             '</div>',
             '<div id="sendDate" class="rMList"><span class="rMl">日　期：</span>',
               '<div class="rMr p_relative">{receiveDate}</div>',
             '</div>',
             '<div class="rMList" id="tip_attach" style="display:none"><span class="rMl">附　件：</span>',
               '<div class="rMr">',
                 '<div id="card_attach">共<span class="orange">{attachCount}</span>个附件</div>',
               '</div>',
             '</div>',
           '</div>'].join("")
            },
            events:{
                "click [name=myreceive]": "changeType",
                "click [name=mysend]": "changeType",
                "click #contact_more": "showMore",
                "click [name=contact_compose]":"compose"
            },

        initialize: function (options) {
            var self = this;
            this.keyword = options.keyword;
            this.email = $Email.getEmail(this.keyword);
            this.contactsInfo = options.contactsInfo;
            console.log(options.contactsInfo);
            this.parentView = options.parentView;
            this.model = new M2012.ReadMail.ContactRecord.Model();
            this.model.set('email', this.email);
            this.mid = options.mid;
            this.model.set('mid', this.mid);
            this.mailmodel = $App.getView("mailbox").model;
			this.originHeight = 0;
			this.timer = null;
			this.layOut = $App.getLayout();

			this.model.on("change:type", function () {
			    self.renderList();
			});


            return superClass.prototype.initialize.apply(this, arguments);
        },
        initListEvents: function () {
            var self = this;
            //引入nicescroll组件，添加滚动条
             // M139.core.utilCreateScriptTag({src: "/m2012/js/lib/jquery.nicescroll.min.js" }, function(){
             //    self.$el.find("#contactrecord").niceScroll();
             // });
             
            var row = this.$el.find("#contactrecord .tips-attr");
            var rowCon = this.$el.find("#contactrecord");
            var curMid = this.mid;
            // 列表的hover事件：如果存在滚动条鼠标移入才显示，移除消失
            rowCon.unbind().hover(function() {
                rowCon.css('overflow-y', 'auto');
            }, function() {
                // 消除单个row重绘造成长度不一致
                if (row.length * 52 > rowCon.height()) {
                    rowCon.css('overflow-y', 'auto').css('overflow-y', 'hidden');
                } else {
                    rowCon.css('overflow-y', 'hidden');
                }
                self.$el.find("#tip_readcard").hide();
            });
            // 列表项hover事件
            row.hover(function (e) {
                BH("rmcontact_hoverreadmail");
                var that = $(this);
                var mid = $(this).attr("mid");
                $(this).addClass("on");                
                self.rowTimeout = setTimeout(function() {
                    self.$el.find("#tip_readcard").show().css("top", (that.position().top+72) + "px");
                    self.showReadCard(mid,that);
                    self.rowTimeout = null;
                }, 100);                 
            }, function (e) {
                // 当前邮件始终选中
                $(this).removeClass("on");
                if (self.rowTimeout) {
                    clearTimeout(self.rowTimeout);
                }
            });

            row.click(function (e) {
                BH("rmcontact_readmail");
                var mid = $(this).attr("mid");
                // row.removeClass("click-on");
                // $(this).removeClass('on').addClass("click-on");
                self.readMail(mid);
            });

            var contactCard;
            this.$el.find("#sendname").click(function () {
                
                contactCard = self.showContact(this);
            });

            /*this.$el.find("#contactrecord").css("overflow", "hidden");
            this.$el.find("#contactrecord").hover(function () {
                $(this).css("overflow", "scroll");
            }, function () {
                $(this).css("overflow", "hidden");
            });*/
 
            
        },
        changeType:function(e){
            $(e.target).parents("ul").find("li").removeClass("on");
            $(e.target).parents("li").addClass("on");
            this.model.set("type", $(e.target).attr("name"));
        },
        showMore:function(){
            var options = this.model.get("searchContactsMailOptions"); 
			//点了搜索更多之后，再点未读邮件，再点搜索更多，会显示上一次的未读，清空此影响
			if(options && options.flags){
				delete options.flags["read"];
			}
			var sendName = this.model.get("email");
			if (this.contactsInfo.length > 0) {
			    sendName = this.contactsInfo[0].name;
			}
			top.$App.getView("mailbox_other").model.set("IamFromLaiwang",true);//设置是来往邮件的搜索
			top.$App.getView("mailbox_other").model.set("UnReadIamFromLaiwang", false);//点击未读后，再重新点更多，会用影响，清楚此影响
			top.$App.getView("mailbox_other").model.set("contactsEmail", sendName);
            $App.trigger("mailCommand", { command: "showTraffic", email: options, thisEmail: this.model.get("email")});//把这个人的邮件地址传下去
        },
        showContact:function(target){
            return M2012.UI.Widget.ContactsCard.show({
                dockElement: target,
                margin: 5,
                email: this.email
            });
        },
        showReadCard: function (mid,target) {
            var self = this;
            var row = this.model.getMailById(mid);
            var receiver = this.parentView.getReceiverEmail(false, row.to);
            $(self.el).find("#receiver_list").html("");
            var subject = $TextUtils.htmlEncode($TextUtils.getTextOverFlow2(row.subject, 52, true));
            var html = M139.Text.Utils.format(this.template.tipRead, {
                mid: row.mid,
                subject: subject,
                to: receiver,
                attachCount: row.attachmentNum,//附件数量
                receiveDate: $Date.format("yyyy-MM-dd hh:mm:ss",new Date(row.receiveDate * 1000))
            });
            this.$el.find("#tip_readcard").html(html);
            //this.$el.find("#receiver_to").css("text-overflow", "ellipsis");
            this.currentCardMid = mid;
            this.model.readMail(mid, function (result) {
                if (self.currentCardMid == mid) {  //防止鼠标移的太快，上一个加载的数据覆盖到当前的卡片
                    if (result && result.cc) {
                        var cc = self.parentView.getReceiverEmail(false, result.cc);
                        //$(self.el).find("#receiver_to").find("div").remove();//先清除，避免来回移动太快重复添加
                        $(self.el).find("#receiver_list").append(cc);
                    }  
                    var attachments = result.attachments;
                    if (attachments && attachments.length > 0) {
                        $(self.el).find("#tip_attach").show();
                    } else {
                        $(self.el).find("#tip_attach").hide();
                    }
                    /*var attachList = [];
                    $(attachments).each(function (i, n) {
                        if (i < 5) {
                            attachList.push("<div><i class=\"i_atta\"></i>" +$TextUtils.htmlEncode( $TextUtils.getTextOverFlow2(n.fileName,24,"...")) + "</div>")
                        } else if (i == 5) {
                            attachList.push("<div>......</div>")
                        }
                    });*/
                    $(self.el).find("#card_attach").find("div").remove();//先清除，避免来回移动太快重复添加
                    // $(self.el).find("#card_attach").append(attachList.join(""));

                    var card = self.$el.find("#tip_readcard");
                    //console.log(card.offset().top + card.height());
                    //console.log($(document.body).height());
                    //console.log($(target).position().top - card.height());
                    if (card.offset().top + card.height() + 25 > $(document.body).height()) {
                        console.log("move up");
                        self.$el.find("#tip_readcard").css("top", ($(target).position().top + 65 - card.height()) + "px");

                        self.$el.find(".tipsRight-small").css("top", card.height());//小三角
                    }
                }
            });
        },
        readMail:function(mid){
            var mailData = this.model.getMailById(mid);
            var maillistLayout = $App.getView("mailbox").model.get("layout");
            //要区分草稿箱
            if (mailData && mailData.fid == 2) {
                $App.restoreDraft(mid);
            } else {
                //列表上下和左右模式的时候，不单独处理
                if (maillistLayout == "list") {

                    $App.readMail(mid, false, null, { mailData: mailData });
                    if (this.targetTab) {
                        $App.getView("tabpage").replace(this.targetTab.name, $App.getCurrentTab().name);
                    } 
                    this.targetTab = $App.getCurrentTab();
                    
                   
                } else {
                    //$App.getView("maillist").readMailSplitView(mid);//上下模式，当前页面打开
                    $App.readMail(mid, false, null, { mailData: mailData });
                }

            }
           
        },
        
        compose:function(){
            $App.show("compose", null, {
                inputData: {
                    receiver: this.keyword
                }
            });
        },
        render: function (show) {
            var self = this;
            BH("rmcontact_render");
            

            if ($(self.el).find(".contactsMailnew").length == 0) {                
                var sendName=this.model.get("email");
                if (this.contactsInfo.length > 0) {
                    sendName = this.contactsInfo[0].name; 
                }

                var container = $(this.template.container);
                container.find("#sendname").html($TextUtils.htmlEncode(sendName));
                container.append('<div class="mail-msgtips tips innerboxshadow" id="tip_readcard" style="display:none"></div>');
                // 追加页面前设置往来邮件容器高度
                // var contactrecordH = self.getContactsMailConH();
                // container.find('#contactrecord').height(contactrecordH);
                $(self.el).find(".J-readMailArea").append(container);
                self.setContactsMailConH();
                // ie6下需要通过js实现来邮件容器的fixed效果
                if ($B.is.ie && $B.getVersion() === 6) {
                    // 初始位置校正
                    container.css({'position': 'absolute', 'top': 0, 'right':0});
                    // 滚动实时位置调整
                    $(self.parentView.el).find('div.J-readMailArea:eq(0)').scroll(function() {
                        var offsetTop = $(this).scrollTop();
                        container.css('top', offsetTop);
                    });
                }
                this.renderList();
            }
            

        },

        setContactsMailConH: function() {
            var el = $(this.parentView.el);
            var h = $D.getWinHeight() - el.find('#leftbox').offset().top - 67 - 30 - 17;// 顶部元素 + 边距 + 微调                                
            el.find('#contactrecord').height(h);
        },

        renderList:function(){
            var self = this;
            var container = self.$el.find("#contactrecord");
            var paddingTop = (container.height() - 87)/2;
            container.html('<p class="ta_c pt_10 pb_10"><img src="../images/global/load.gif"> 加载中...</p>');
            this.model.searchContactsMail(function (result,moreData) {
                    
                var arr = [];
                var len = result && result.length || 0;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var row = result[i];
                        var subject = $TextUtils.htmlEncode($TextUtils.getTextOverFlow2(row.subject, row.attachmentNum > 0 ? 50 : 52, true));
                                                
                        arr.push(M139.Text.Utils.format(self.template.list, {
                            mid: row.mid,
                            subject: subject,
                            attach:row.attachmentNum>0?'<i class="i_atta"></i>':"",//是否有附件
                            receiveDate:self.model.getReceiveDate(new Date(row.receiveDate*1000)),
                            on: row.mid == self.mid ? 'click-on' : ''
                        })); 

                    }
                    if (moreData) { 
                        arr.push('<div class="checkmore on"><a id="contact_more" href="javascript:void(0)" bh="rmcontact_moremail" >查看更多</a></div>');
                    }
                    container.css('overflow-y', 'hidden').html(arr.join(""));

                    /*if (52 * len > container.height()) { // 52为单封往来邮件的整体高度
                        container.css('overflow-y', 'auto');
                    } else {
                        container.css('overflow-y', 'hidden');
                    }*/


                } else { //无群组，显示引导页                    
                    var emptyDOM = '<div class="notext" style="padding-top: '+paddingTop+'px"><span class="i-smile"></span><p>还没有邮件，要多多<a name="contact_compose" href="javascript:" bh="rmcontact_connect">联系</a>哦</p></div>';                    
                    container.html(emptyDOM);
                }



                self.initListEvents();

                //var readmailHeight = $(self.el).find(".J-readMailArea").height();
                //readmailHeight - 70;

                /*var targetHeight = $(document.body).height() - container.offset().top - 15;
                container.height(targetHeight);
                console.log(targetHeight);
                console.log(container.height());
                if (container[0].scrollHeight > targetHeight) {
                    container.height(container[0].scrollHeight);
                }*/
            });
        }

    }));
    

})(jQuery, _, M139);


