/**
* @fileOverview 会话邮件卡片底部工具栏
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
         
    M139.namespace('M2012.ReadMail.ConversationBottomBar.View', superClass.extend({

        /**
        *快捷回复提示语
        */
        tips: {
            replySuccess: '邮件回复成功',
            replyFail: '系统繁忙,请稍后重试。',
            replyContentError: '请输入要回复的内容。',
            replyMailError: '请输入正确的邮件地址。',
            replyMailNull: '请输入回复的邮件地址。'
        },

        replyPrefix: {
            "1": "Re:",
            "2": ">",
            "3": "Reply:"
        },

        events: {
            "click a[ref=more-oper]": "onBottomToolbarClick",
            "click a[ref=reply]": "onBottomToolbarClick",
            "click a[ref=replyall]": "onBottomToolbarClick",
            "click a[ref=forward]": "onBottomToolbarClick",
            "click a[ref=subject-edit]": "onBottomToolbarClick",

            "click a[ref=cc-edit]": "onAddCCorBCC",
            "click a[ref=bcc-edit]": "onAddCCorBCC",
            "click #subject": "onSubjectClick",
            "click #closelink": "removeReplybox",
            "click #sendbtn": "onSend",

            "keyup #subject-input": "checkSubjectInputLength",
            "blur #subject-input": "onSubjectInputBlur",

            "keyup #replytextarea": "monitorContentTextarea",
            "keyup #to-edit>textarea": "monitorAddrTextarea",
            "keyup #cc-edit>textarea": "monitorAddrTextarea",
            "keyup #bcc-edit>textarea": "monitorAddrTextarea",

            "blur #to-edit>textarea": "onAddrEditboxBlur",
            "blur #cc-edit>textarea": "onAddrEditboxBlur",
            "blur #bcc-edit>textarea": "onAddrEditboxBlur",

            "click #to": "onAddrShowboxClick",
            "click #cc": "onAddrShowboxClick",
            "click #bcc": "onAddrShowboxClick",
            "click #replytextarea": "onReplyTextareaClick"
        },
	
        name: "M2012.ReadMail.ConversationBottomBar", // 45<!--  94px  150px  189px -->'

        bottombarCurPos: {
            "reply": "45px",
            "replyall": "94px",
            "forward": "150px"
        },

	    template:{
	        replybox: (function () {
	            return ['<p class="cov-r-t">',
				            '<a href="javascript:;" ref="reply" bh="cov_reply">回复</a><em class="gray">|</em>',
                            '<a href="javascript:;" ref="replyall" bh="cov_replyall">回复全部</a><em class="gray">|</em>',
                            '<a href="javascript:;" ref="forward" bh="cov_forward">转发</a><em class="gray">|</em>',
                            '<a href="javascript:;" ref="more-oper" id="more-oper" bh="cov_moremenu">更多</a>',
				        '</p>',
                        '<div class="tips cov-write" id="replybox" style="display: none;">',
 	                        '<a href="javascript:;" id="closelink" class="c-w-cloase" title="关闭" bh="cov_closeeidtor">×</a>',
 	                        '<div class="tips-text">',
 		                        '<div class="cov-tab-div">',
                                '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
 			                        '<table class="cov-write-tab">',
 				                        '<tbody>',
                                            '<tr class="c-w-f">',
 					                            '<td class="td1">收件人：</td>',
 					                            '<td>',
 						                            '<div id="to"></div>',
                                                    '<div id="to-edit">',
							                            '<textarea class="area-input"></textarea>',
						                            '</div>',
 					                            '</td>',
                                                '<td class="td2" ref="ccbcc" style="display: none;"><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a> <a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
 				                            '</tr>',
 				                            '<tr style="display: none;">',
 					                            '<td class="td1">抄送：</td>',
 					                            '<td colspan="2">',
                                                    '<div id="cc"></div>',
                                                    '<div id="cc-edit">',
							                            '<textarea class="area-input"></textarea>',
						                            '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" style="display: none;"><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a> <a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
 				                            '</tr>',
                                            '<tr style="display: none;">',
 					                            '<td class="td1">密送：</td>',
 					                            '<td colspan="2">',
                                                    '<div id="bcc"></div>',
                                                    '<div id="bcc-edit">',
							                            '<textarea class="area-input"></textarea>',
						                            '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" style="display: none;"><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a> <a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
 				                            '</tr>',
 			                            '</tbody>',
                                    '</table>',
                                    '<!--[if lt ie 8]></div><![endif]-->',
 		                        '</div>			',
 		                        '<div class="c-w-text">',
 			                        '<p class="mb_5" style="display: none;">',
                                        '<span>主题：</span><span id="subject"></span>',
                                        '<input id="subject-input" class="iText ztinput" value="" style="display: none;"/></p>',
 			                        '<textarea id="replytextarea"></textarea>',
 		                        '</div>',
 	                        '</div>',
 	                        '<div class="tipsTop diamond" id="bottombar-cur-pos" style="left:45px;display:none;"></div><!--  94px  150px  189px -->',
                        '</div>',
                        /*'<div id="box-stand-in" class="cov-rarea" style="display:none;">',
					        '<div class="cov-rarea-c">点击此处可',
                                '<a href="javascript:;" ref="reply" bh="cov_reply">回复</a>或',
                                '<a href="javascript:;" ref="replyall" bh="cov_replyall">回复全部</a>或',
                                '<a href="javascript:;" ref="forward" bh="cov_forward">转发</a>',
					        '</div>',
				        '</div>',*/
                        '<div class="cov-r-btn" style="display:none;">',
 					        '<a href="javascript:;" id="sendbtn" class="cov-btn cov-b-b" bh="cov_clicksendmail">发 送</a>',
 				        '</div>',
	                    '<div class="tips write-tips EmptyTips" style="display: none;"><div class="tips-text EmptyTipsContent">收件人输入错误</div><div class="tipsTop diamond"></div></div>'].join("")
	        })()
        },        
        
        initialize: function(options){
            this.parentview = options.parentview;
            this.model = this.parentview.model;
            this.mid = options.mid;
            this.dataSource = options.data;
            this.setElement(options.el); //定义el

            this.curMail = this.model.get('sessionData')[this.mid];
            this.attachments = this.curMail && this.curMail.dataSource.attachments;
            
            this.rPrefix = this.replyPrefix[$App.getConfig('UserAttrs').replyPrefix];
            this.rQuote = $App.getConfig('UserAttrs').replyWithQuote;
            return superClass.prototype.initialize.apply(this, arguments);
        },    
    
        initEvents: function () {
            var self = this;
            this.setBottombar();

            //记录修改已读数量
            $App.on("showBottomBar", function (args) {                 
                var mid = args.mid;
                if(mid === self.mid){
                    self.setAutoSave();
                }
            });
        },

        setBottombar: function () {
            var self = this,
                $el = this.$el;

            $el.html(this.template.replybox);
            /*if (this.model.get('unReadedCount') == 0 && this.mid == this.model.get("lastMailMid")) {
                $el.find("#box-stand-in").show();
            }*/

            setTimeout(function(){
                self.parentview.onResize();
            },300);           
        },

        onBottomToolbarClick: function (e) {
            var self = this,
                $el = this.$el,
                target = e.target || e.srcElement,
                ref = $(target).attr("ref"),
                curMail = this.curMail;
                                    
            // 防止重复点击 --- “回复”，“回复全部”，“转发”
            if (ref in this.bottombarCurPos && ref == this.curTab) {
                return false;
            }

            var from = curMail.from,
                to = curMail.dataSource.to,
                cc = curMail.dataSource.cc,
                subject = curMail.dataSource.subject;

            // 处理 --- “回复”，“回复全部”，“转发”
            if (ref in this.bottombarCurPos) {

                // 记录上次点击的标签，防止重复点击
                self.curTab = ref;
                self.preloadAddr = true;

                // DOM准备
                if ($el.find("#replybox").length == 0) {
                    $el.html(this.template.replybox);
                }

                // DOM呈现
                if ($el.find("#replybox").is(":hidden")) {
                    $el.find("#replybox").show();
                    $el.find("#sendbtn").parent().show()
                    //$el.find("#box-stand-in").hide();
                }

                // 指示当前操作
                $el.find("#bottombar-cur-pos").show().animate({ "left": self.bottombarCurPos[ref] }, "normal");
                
                // 首次点击底部工具条添加“编辑主题”选项，且点击一次后置灰
                if ($el.find("#subject-edit").length == 0) {
                    $el.find("#more-oper").before('<a href="javascript:;" ref="subject-edit" id="subject-edit" bh="cov_editreplysubject">编辑主题</a><em class="gray">|</em>');
                } else {
                    $el.find("#subject-edit").removeClass("gray");
                }
            }            


            var $to = $el.find("#to"),
                $cc = $el.find("#cc"),
                $toTextarea = $el.find("#to-edit>textarea"),
                $ccTextarea = $el.find("#cc-edit>textarea"),
                $bccTextarea = $el.find("#bcc-edit>textarea"),
                $subject = $el.find("#subject"),
                $subjectEdit = $el.find("#subject-edit"),
                setSubject = function (prefix) {
                    subject = prefix + subject;
                    sliceSubject = subject.length > 50 ? subject.slice(0, 50) + "..." : subject.slice(0, 50);
                    $subject.text(sliceSubject).attr("title", subject);
                    self.$("#subject-input").closest("p").hide();
                },
                setAutoSave = function () {
                    self.lastSave = {
                        to: self.to,
                        cc: self.cc,
                        bcc: self.bcc,
                        subject: subject,
                        content: ""
                    };
                    
                    self.subject = subject;
                    self.content = "";

                    self.setAutoSave();
                };
            
            switch (ref) {
                case "reply":
                    $toTextarea.val(from).blur();
                    $ccTextarea.val("").blur();
                    $bccTextarea.val("").blur();

                    setSubject(this.rPrefix);
                    setAutoSave()
                    break;
                case "replyall":
                    $toTextarea.val(from +","+ to).blur();
                    $ccTextarea.val(cc).blur();
                    $bccTextarea.val("").blur();

                    setSubject(this.rPrefix);
                    setAutoSave()
                    break;
                case "forward":
                    $toTextarea.val("").blur();
                    $ccTextarea.val("").blur();
                    $bccTextarea.val("").blur();
                    $toTextarea.height(22).focus();

                    setSubject("Fw:");
                    setAutoSave()
                    break;
                case "subject-edit":
                    if (!$subjectEdit.hasClass("gray")) {
                        $el.find("#subject-input").closest("p").show();
                        self.onSubjectClick()
                        // 置灰编辑主题操作
                        $subjectEdit.addClass("gray");
                    }
                    break;
                case "more-oper":
                    self.createMoreMenu($(target));
                    break;
            }
        },

        setAutoSave: function () {

            var self = this,
                $el = this.$el,
                $replybox = this.$el.find("#replybox"),
                isChanged = function () {
                    for (var i in self.lastSave) {
                        if (self[i] != self.lastSave[i]) {
                            return true;
                        }
                    }
                    return false;
                };

            // 展开邮件时，如果快捷回复已经存在，继续设置定时存草稿
            if ($replybox.length && $replybox.is(":visible")) {
                if (this.autosaveInterval) {
                    clearInterval(this.autosaveInterval);
                }
                this.autosaveInterval = setInterval(function () {
                    if ($replybox.length && $replybox.is(":visible")) {
                        isChanged() && self.saveDraft();
                    } else {
                        clearInterval(self.autosaveInterval);
                    }
                }, 60 * 1000);
            }
        },

        /**
        * 更多操作菜单
        */
        createMoreMenu:function(moreContainer){
            var self = this,
                mid = this.mid, 
                lastFlag = false;

            if( mid === this.parentview.covCon.find("div.cov-cur:last").attr("mid")){
                lastFlag = true;
            }            
            
            this.moreMenuleft = this.moreMenuleft || ( moreContainer.offset().left - this.$el.offset().left);

            M2012.UI.PopMenu.create({
                items:[
                    {
                        text:"导出邮件",
                        onClick:function(){
                            var wmsvrPath2 =  domainList.global.wmsvrPath2;
                            var sid = $App.getSid();
                            var downloadUrl = wmsvrPath2 + "/mail?func=mbox:downloadMessages&sid={0}&mid={1}&";
                            window.open($T.Utils.format(downloadUrl,[sid,mid]));
                            BH('cov_exportmail');
                        }
                    },

                    {
                        text:"打印",
                        onClick:function(){
                        window.open("/m2012/html/printmail.html?mid=" + mid);
                        BH('cov_print');
                        }
                    },                    
                    
                    {
                        text:"显示邮件原文",
                        onClick:function(){
                            var orignUrl = "/RmWeb/view.do?func=mbox:getMessageData&mode=text&part=0&sid={0}&mid={1}&";
                            window.open($T.Utils.format(orignUrl,[sid,mid]));
                            BH('cov_mailcode');
                        }
                    },

                    {
                        text:"新窗口打开",
                        onClick:function(){
                            $App.openNewWin(mid);
                            BH('cov_newwinreadmail');
                        }
                    },

                    {
                        text:"删除",
                        onClick:function(){
                            var args = { 
                                command: "move", 
                                fid: 4, 
                                mids:[mid], 
                                comefrom: 'singleSessionMail', 
                                callback:function(){
                                    var titelCon = $('#cov-tab-title_' + mid),
                                        contentCon = $('#covcur_' + mid),
                                        total = self.model.get('total'),
                                        unReadedCount = self.model.get('unReadedCount');

                                    //未读数总数数量修改
                                    if(titelCon.find("i.i_m_n").length > 0 || contentCon.find("i.i_m_n").length > 0 ){
                                        unReadedCount--;
                                    }
                                    self.model.set({
                                        total:--total,
                                        unReadedCount:unReadedCount
                                    });

                                    //删除对应节点
                                    titelCon.remove();
                                    contentCon.remove();

                                    //更新mids
                                    self.parentview.delSessionMids(mid);
                                    self.parentview.removeItemBorderStyle();
                                } 
                            };

                            if(self.model.get('total') === 1){ delete args.comefrom }
                            $App.trigger("mailCommand", args);
                            BH('cov_delmail');
                        }
                    }

                ],
                container: moreContainer[0],
                top: '-130px',
                left: this.moreMenuleft + "px"
            });
        },

        onAddrEditboxBlur: function (e) {

            var self = this,

                target = e.target || e.srcElement,
                $textarea = $(target),
                $editbox = $textarea.parent(),
                editboxID = $editbox.attr("id"),
                showboxID = editboxID.split("-")[0],
                $showbox = this.$el.find("#"+showboxID),
                getAddrHtml = function ($cont) {
                    var str = "",
                        item,
                        isEmail = false,
                        getMailName = self.parentview.getMailName,
                        arr = $cont.val().split(","),
                        len = arr.length,
                        emailO = {},
                        email;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        item = arr[i];
                        email = $Email.getEmail(item);
                        if ($.trim(item) == "" || emailO[email]) {
                            arr.splice(i--, 1);
                            len--;
                            continue;
                        }
                        emailO[email] = true;
                        isEmail = $Email.isEmailAddr(item) || $Email.isEmail(item);
                        str += isEmail ? '<span>' + $T.Utils.htmlEncode(getMailName(item)) + ' , </span>' : '<span class="red">' + $T.Utils.htmlEncode(getMailName(item)) + ' , </span>';
                    }

                    // 保存过滤后的联系人地址，发送时用
                    self[showboxID] = arr;
                    return len == 0 ? "" : str + '<span class="other">+另外00人</span>';
                },
                clipAddrHtml = function ($cont) {

                    var width = 0,
                        cwidth = $cont.width(),
                        els = $cont.children(),
                        len = els.length,
                        last,
                        text;

                    for (var i = 0; i < len - 1; i++) {
                        width += $(els[i]).width();
                        // 如果只有一个邮件地址，或者所有邮件地址加起来长度没有超过一行，直接移除最后一项【+另外几人】
                        if (len == 2 || i == len - 2 && width <= cwidth) {
                            els.last().remove();
                            last = $cont.find(":last");
                            text = last.text().replace(",", "");
                            last.text(text);
                            break;
                        }
                    }

                    // 处理换行情况
                    if (width > cwidth) {
                        width = els.last().width();
                        for (var i = 0, len = els.length; i < len; i++) {
                            width += $(els[i]).width();
                            if (width > cwidth) break;
                        }
                        
                        els.filter(":gt(" + (i - 1) + ")").not(":last").hide();
                        last = els.filter(":eq(" + (i - 1) + ")");
                        text = last.text().replace(",", "");
                        last.text(text);

                        last = els.last();
                        text = last.text().replace(/\d+/, len - i - 1);
                        last.text(text);
                        if ($cont.find(".red").index() >= i) {
                            last.removeClass("other");
                            last.addClass("other-error");
                        }
                    }
                };

            // 确保tr可见，以便触发渲染、计算联系人和输入框的宽度
            var addrHTML = getAddrHtml($textarea);
            $showbox.show().closest("tr").show();
            $showbox.html(addrHTML);
            if (this[showboxID].length) {
                $editbox.hide();
                clipAddrHtml($showbox);
                if (showboxID == "cc") {
                    self.$el.find("a[ref=" + editboxID + "]").hide();
                }
            } else if (showboxID == "to") {
                $showbox.hide();
                $editbox.show();
            } else {
                $showbox.hide();
                // 预加载联系人时，如果联系人不存在则自动隐藏输入框；
                // 用户主动添加时不隐藏，因为隐藏会阻断用户点击旁边“抄送”、“密送”的动作
                if (this.preloadAddr) {
                    $editbox.show().closest("tr").hide();
                    self.$("a[ref=" + editboxID + "]").text(showboxID == "cc" ? "抄送" : "密送").show();

                    self.$("td[ref=ccbcc]").hide();
                    var ccbccSelector = showboxID == "cc" ? "#bcc" : "#cc";
                    ccbccSelector = self.$(ccbccSelector).is(":hidden") ? "#to" : ccbccSelector
                    self.$(ccbccSelector).closest("tr").find("td[ref=ccbcc]").show();
                }
            }
        },

        onAddrShowboxClick: function (e) {
            var self = this,

                target = e.target || e.srcElement,
                $showbox = $(target).closest("div"),
                $editbox = $showbox.next("div"),
                $textarea = $editbox.find("textarea");
            if (target.nodeName == "SPAN" && $(target).is(".other:visible, .other-error:visible")) {
                $(target).remove();
                $showbox.children().show();
            } else {
                $showbox.hide();
                $editbox.show();
                var scrollHeight = $textarea[0].scrollHeight == 0 ? 22 : $textarea[0].scrollHeight;
                $textarea.height(scrollHeight > 66 ? 66 : scrollHeight).focus();
            }
        },

        onSend: function () {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content = $el.find("#replytextarea").val();
            var replyMessageData = { mid: mid };
            var $errAddrs = $el.find("#to, #cc, #bcc").find(".red:visible, .other-error:visible");

            if (!(this.to && this.to.length)) {
                $Msg.alert(this.tips.replyMailNull);
                return;
            }
            if ($errAddrs.length) {
                var msg = "联系人输入错误";
                var tips = this.$(".EmptyTips")
                tips.show().find(".EmptyTipsContent").text(msg);

                var $item = $errAddrs.first();
                var itemOffset = $item.offset();
                var richinputOffset = $el.offset();
                tips.css({
                    left: itemOffset.left - richinputOffset.left + parseInt($item.width() / 2) - 20,
                    top: itemOffset.top - richinputOffset.top + 25
                });
                setTimeout(function () {
                    tips.hide();
                }, 3000);
                return;
            }

            //省略验证邮件地址格式
            var enableQuote = this.curTab == "forward" || $App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文
            content = M139.Text.Utils.htmlEncode(content);
            content = content.replace(/\r/gm, '').replace(/\n/gm, '<br>');

            if (enableQuote) {
                content += "<br/><br/><br/><br/><hr id=\"replySplit\"/>";
            }
            var postData = {
                to: this.to.join(","),
                cc: this.cc.join(","),
                bcc: this.bcc.join(","),
                mid: mid,
                content: content
            };
            var replyMessageData = {
                mid: mid
            };

            M139.UI.TipMessage.show("正在发送邮件...");
            this.replyMessage(postData, replyMessageData, function (sendMailRequest) {
                if (!enableQuote) {
                    sendMailRequest.attrs.content = content;
                }
                sendMailRequest && self.compose(sendMailRequest, function (flag, summary) {
                    if (flag) {
                        M139.UI.TipMessage.show(self.tips.replySuccess, { delay: 3000 });
                        $el.find("#closelink").click();
                    } else if (summary) {
                        M139.UI.TipMessage.show(summary, { delay: 3000 });
                    } else {
                        var failText = self.tips.replyFail;
                        M139.UI.TipMessage.show(failText, { delay: 3000 });
                    }
                });
            });
        },

        saveDraft: function () {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content = $el.find("#replytextarea").val();
            var replyMessageData = { mid: mid };


            //省略验证邮件地址格式
            var enableQuote = $App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文
            content = M139.Text.Utils.htmlEncode(content);
            content = content.replace(/\r/gm, '').replace(/\n/gm, '<br>');

            if (enableQuote) {
                content += "<br/><br/><br/><br/><hr id=\"replySplit\"/>";
            }
            var postData = {
                to: this.to.join(","),
                cc: this.cc.join(","),
                bcc: this.bcc.join(","),
                mid: mid,
                content: content,
                action: "autosave"
            };
            var replyMessageData = {
                mid: mid
            };

            this.replyMessage(postData, replyMessageData, function (sendMailRequest) {
                if (!enableQuote) {
                    sendMailRequest.attrs.content = content;
                }
                sendMailRequest && self.compose(sendMailRequest, function (flag, summary) {
                    if (flag) {
                        var time = new Date(),
                            hour = time.getHours(),
                            minu = time.getMinutes();
                        M139.UI.TipMessage.show(hour + "时" + minu + "分成功保存到草稿箱", { delay: 3000 });
                        // 保存回复关键信息，用于下次自动保存判断内容是否有改动
                        self.lastSave = {
                            to: self.to,
                            cc: self.cc,
                            bcc: self.bcc,
                            subject: $.trim($el.find("#subject-input").val()),
                            content: $.trim($el.find("#replytextarea").val())
                        };
                    }
                });
            });
        },

        monitorAddrTextarea: function (e) {
            var target = e.target || e.srcElement,
                $target = $(target),
                height = $target.height(),
                val = $target.val(),
                id = $target.parent().attr("id"),
                $link = this.$el.find("a[ref=" + id + "]");

            // 输入文本换行时自动增加文本框高度，最高不超过 3 行
            if (target.scrollHeight > height && height < 70) {
                height += 22;
                $target.height(height);
            }

            // 有文本输入时，隐藏对应的隐藏链接
            //if ($.trim(val).length && $link.is(":visible")) {
            //    $link.hide();
            //} else if ($.trim(val).length == 0 && $link.is(":hidden")) {
            //    $link.show();
            //}
        },

        onAddCCorBCC: function (e) {
            var target = e.target || e.srcElement,
                editID = $(target).attr("ref"),
                showID = editID.split("-")[0],
                $editbox = this.$el.find("#" + editID),
                $showbox = this.$el.find("#" + showID);

            $showbox.hide().closest("tr").show();
            $editbox.show().find("textarea").focus();

            this.$("a[ref=" + editID + "]").hide();
            this.$("td[ref=ccbcc]").hide();
            $showbox.closest("tr").find("td[ref=ccbcc]").show();

            this.preloadAddr = false;
        },

        removeReplybox: function () {
            this.$el.find('#replybox, #box-stand-in').remove();
            this.$el.find('#sendbtn').parent().remove();
            this.$el.find("#subject-edit").next().remove();
            this.$el.find("#subject-edit").remove();

            // 清空
            this.curTab = null;
            clearInterval(this.autosaveInterval);
        },

        checkCCBCCvisibility: function () {
            var cc = this.$("#cc").text(),
                bcc = this.$("#bcc").text();
            if (!$.trim(cc)) {
                this.$("#cc").closest("tr").hide();
                this.$("a[ref=cc-edit]").show();
            }
            if (!$.trim(bcc)) {
                this.$("#bcc").closest("tr").hide();
                this.$("a[ref=bcc-edit]").show();
            }

            this.$("td[ref=ccbcc]").hide();
            if (this.$("#cc").is(":hidden") && this.$("#bcc").is(":hidden")) {
                this.$("#to").closest("tr").find("td[ref=ccbcc]").show();
            } else if (this.$("#cc").is(":hidden")) {
                this.$("#bcc").closest("tr").find("td[ref=ccbcc]").show();
            } else if (this.$("#bcc").is(":hidden")) {
                this.$("#cc").closest("tr").find("td[ref=ccbcc]").show();
            }            
        },

        onSubjectClick: function () {
            var $el = this.$el,
                $subject = $el.find("#subject"),
                $subjectInput = $el.find("#subject-input"),
                txt = $subject.attr("title"),
                $p = $subjectInput.closest("p"),
                $prespan = $subject.prev("span"),
                inputwidth = $p.width() - $prespan.width() - 10;
            $subject.hide();
            $subjectInput.val(txt).width(inputwidth).show().focus();

            this.subjectLimitNum = Math.floor(inputwidth / 7);
            this.checkCCBCCvisibility();
        },

        onReplyTextareaClick: function () {
            this.checkCCBCCvisibility();
        },

        checkSubjectInputLength: function (e) {
            var $subjectInput = this.$el.find("#subject-input"),
                txt = $subjectInput.val();
            if ($.trim(txt).length > 200) {
                txt = $.trim(txt).slice(0, 200);
                $subjectInput.val(txt);
            }
        },

        onSubjectInputBlur: function () {
            var $el = this.$el,
                txt = $el.find("#subject-input").val(),
                txt = $.trim(txt),
                subject = $TextUtils.getTextOverFlow2(txt, this.subjectLimitNum, true);
            $el.find("#subject").attr("title", txt).text(subject).show().attr("style", "display: inline;");
            $el.find("#subject-input").hide();
            this.subject = txt;
        },

        monitorContentTextarea: function () {
            var txt = this.$("#replytextarea").val();
            this.content = $.trim(txt);
        },

        /**
        *快捷回复信件
        *@param {Object} options 初始化参数集
        */
        compose: function (options, callback) {
            var self = this;
            M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", options, function (result) {
                if (result.responseData.code && result.responseData.code == 'S_OK') {
                    callback && callback(true);
                } else if (result.responseData.summary) {
                    callback && callback(false, result.responseData.summary);
                } else {
                    callback && callback();
                }
            });
        },

        /**
        *快捷回复信件数据组装
        *@param {Object} postData 传递参数
        *@param {Object} replyMessageData 传递参数
        *@param {function} callback 回调函数 
        */
        replyMessage: function (postData, replyMessageData, callback) {
            var self = this,
                thiscallback = callback,
            //add by zsx 代收邮箱快捷回复的时候，取当前代收账户作为默认值
                defaultSender = $User.getDefaultSender(),
                mid = this.mid,
                subject = $.trim(self.$el.find("#subject").attr("title")),
                thisone,
                fid = parseInt(this.dataSource.fid);

            if (subject.length == 0) {
                subject = this.curTab == "forward" ? "Fw:" + this.originalSubject : this.rPrefix + this.originalSubject;
            }

                
            if (fid && $App.getFolderType(fid) == -3) {
                thisone = $App.getFolderById(fid).email;
                var poplist = top.$App.getPopList();
                var list = [];
                for (var i = 0; i < poplist.length; i++) {
                    list.push(poplist[i]["email"]);
                }
                if ($.inArray(thisone, list) > -1) {
                    defaultSender = thisone;
                }
            }
            //add by zsx如果是其他文件夹移动过来的邮件，快捷回复的时候，回复人要回复为默认值
            var findEmail = (function () {
                var toDiv = postData.to.split(",");
                var toList = [];
                for (var i = 0; i < toDiv.length; i++) {
                    toList.push(top.$Email.getEmail(toDiv[i]));
                }
                var poplist = top.$App.getPopList();
                var popArray = $.map(poplist, function (n) {
                    return n.email;
                });
                for (var j = 0; j < toList.length; j++) {
                    if ($.inArray(toList[j], popArray) > -1) {
                        return toList[j];
                    }
                }
                return "";
            })();
            if (findEmail == "") {
                defaultSender = $User.getDefaultSender();
            } else {
                defaultSender = findEmail;
            }

            if (self.composeId) {
                var sendMailRequest = {
                    attrs: {
                        account: defaultSender,
                        to: postData.to,
                        cc: postData.cc || "",
                        bcc: postData.bcc || "",
                        showOneRcpt: 0,
                        isHtml: 1,
                        subject: subject,
                        content: postData.content + '<div id="reply139content" style="display: block;">' + (self.curTab == "forward" ? self.originalContent : self.rQuote == 1 ? self.originalContent : "") +'</div>',
                        priority: 3,
                        requestReadReceipt: 0,
                        saveSentCopy: 1,
                        inlineResources: 1,
                        scheduleDate: 0,
                        normalizeRfc822: 0,
                        id: self.composeId,
                        attachments: this.curTab == "forward" && this.attachments ? this.attachments : ""
                    },
                    action: postData.action || "deliver",
                    returnInfo: 1
                };

                if (self.messageId) {
                    sendMailRequest.attrs.messageId = self.messageId;
                }
                thiscallback && thiscallback(sendMailRequest);
            } else {
                M139.RichMail.API.call("mbox:replyMessage", replyMessageData, function (result) {
                    if (result.responseData.code && result.responseData.code == 'S_OK') {
                        var content = postData.content;
                        var data = result.responseData["var"];
                        self.composeId = data.id;
                        self.originalContent = data.content || "";
                        // var uid = $User.getLoginName(); //发件人用默认帐号
                        var sendMailRequest = {
                            attrs: {
                                account: defaultSender,
                                to: postData.to,
                                cc: postData.cc || "",
                                bcc: postData.bcc || "",
                                showOneRcpt: 0,
                                isHtml: 1,
                                subject: subject,
                                content: content + '<div id="reply139content" style="display: block;">' + (self.curTab == "forward" ? self.originalContent : self.rQuote == 1 ? self.originalContent : "")+'</div>',
                                priority: 3,
                                requestReadReceipt: 0,
                                saveSentCopy: 1,
                                inlineResources: 1,
                                scheduleDate: 0,
                                normalizeRfc822: 0,
                                id: self.composeId,
                                attachments: self.curTab == "forward" && self.attachments ? self.attachments : ""
                            },
                            action: postData.action || "deliver",
                            returnInfo: 1
                        };

                        if (data.messageId) {
                            self.messageId = data.messageId;
                            sendMailRequest.attrs.messageId = data.messageId;
                        }
                        thiscallback && thiscallback(sendMailRequest);
                    } else {
                        $Msg.alert(self.tips.replyFail, {
                            icon: 'fail'
                        });
                    }
                });
            }
        }
    }));


})(jQuery, _, M139);    


