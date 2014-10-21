/**
* @fileOverview 会话邮件写信
* @code by SuKunWei && Yeshuo
*/
var htmlEditorView = {};
var ComposeModel;
var PageMid;

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
         
    M139.namespace('M2012.ReadMail.ConversationBottomBar.Compose.View', superClass.extend({

        /**
         * 快捷回复提示语
         */
        tips: {
            replySuccess: '邮件回复成功',
            replyFail: '系统繁忙,请稍后重试。',
            replyContentError: '请输入要回复的内容。',
            replyMailError: '一个或多个地址错误，请编辑后再试一次。',
            replyMailNull: '收件人地址为空，请输入邮件地址后再发送。'

        },

        /**
         * 回复符号匹配
         */
        replyPrefix: {
            "1": "Re:",
            "2": ">",
            "3": "Reply:"
        },

        /**
         * 事件绑定
         */
        events: {
        
            "click a[ref=cc-edit]": "onAddCCorBCC",
            "click a[ref=bcc-edit]": "onAddCCorBCC",
            "click #subject": "onSubjectClick",
            "click #closelink": "closeReplybox",
            "click #sendbtn": "onSend",
            "click #gotoCompose": "onGotoCompose",
            "click #fontstyle": "showFontBar",
            "keyup #subject-input": "checkSubjectInputLength",
            "blur #subject-input": "onSubjectInputBlur",
            "click #to": "onAddrShowboxClick",
            "click #cc": "onAddrShowboxClick",
            "click #bcc": "onAddrShowboxClick",
            "click #replytextarea": "onReplyTextareaClick",
            "focus #replytextarea": "onReplyTextareaClick",
            'click #receiverto': 'showAddressBookDialog',
            'click #receivercc': 'showAddressBookDialog',
            'click #receiverbcc': 'showAddressBookDialog'
        },
    
        name: "M2012.ReadMail.ConversationBottomBar", 

        /**
         * 下标箭头匹配
         */
        bottombarCurPos: {
            "reply": "20px",
            "replyall": "90px",
            "forward": "155px"
        },

        /**
         * 模版定义
         */
        template:{
            replybox: (function () {
                return ['',
                        '<div class="tips cov-write" id="replybox" style="display: none; border-bottom:none;">',
                            '<a href="javascript:;" id="closelink" class="c-w-cloase" title="关闭" bh="cov_closeeidtor">×</a>',
                            '<div class="tips-text" id="tips-text" >',
                                '<div class="cov-tab-div">',
                                '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                                    '<table class="cov-write-tab">',
                                        '<tbody>',
                                            '<tr class="c-w-f">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receiverto">收件人：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="to" class="th27 hide"></div>',
                                                    '<div id="to-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a> <a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
                                            '</tr>',
                                            '<tr style="display: none;">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receivercc">抄　送：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="cc" class="th27 hide"></div>',
                                                    '<div id="cc-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
                                            '</tr>',
                                            '<tr style="display: none;">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receiverbcc">密　送：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="bcc" class="th27 hide"></div>',
                                                    '<div id="bcc-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a><!--<a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a>--></td>',
                                            '</tr>',
                                        '</tbody>',
                                    '</table>',
                                    '<!--[if lt ie 8]></div><![endif]-->',
                                '</div>',
                                '<div class="c-w-text" style="_zoom:1">',
                                    
                                    '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                                    '<table class="c-w-textitle" style="display:none;">',
                                        '<tbody>',
                                            '<tr>',
                                                '<td class="td1">主　题：</td>',
                                                '<td>',
                                                    '<div class="texttitle" id="subject" style="height:18px;"></div>',
                                                    '<input id="subject-input" class="iText ztinput" value="" style="display: none;"/>',
                                                '</td>',
                                            '</tr>',
                                        '</tbody>',
                                    '</table>',
                                    //附件区域
                                    '<div class="writeattrlist clearfix" style="display: none">',
                                        '<ul class="attrlistUl" id="attachContainer">',
                                        '</ul>',
                                    '</div>',
                                    '<!--[if lt ie 8]></div><![endif]-->',
                                    '<textarea id="replytextarea" style="display:none" ></textarea>',
                                    '<div id="htmlEdiorContainer"></div>',
                                '</div>',
                            '</div>',
                            '</div>',						
                        '<div class="tips tips-covfont" id="tips-covfont" style="visibility:hidden" >',
                            '<div class="tips-text clearfix">',
                            '</div>',
                            '<div class="tipsBottom diamond"></div>',
                        '</div>',
                        '<div class="cov-r-btn cov-r-border" style="display:none;">',
                            '<a href="javascript:;" id="sendbtn" class="cov-btn cov-b-b fl" style="margin-top:4px" bh="cov_clicksendmail">发 送</a>',
                            '<a title="编辑样式" id="fontstyle" href="javascript:;"  class="edit-btn" style="margin-top:5px">',
                                '<span class="edit-btn-rc"> <b class="ico-edit ico-edit-qfont">编辑样式</b>',
                                '</span>',
                            '</a>',
                            '<span class="line"></span>',
							'<a href="javascript:;"  title="添加附件" class="edit-btn" id="realUploadButton" >',
                                '<span class="edit-btn-rc"> <b class="ico-edit ico-edit-attr">附件</b>',
                                '</span>',
                            '</a>',
                            '<div class="floatWrap" >', 
								'<div id="floatDiv"  >',
									'<form style="" enctype="multipart/form-data" id="fromAttach" method="post" action="" target="frmAttachTarget">',
										'<input   style="height: 20px;" type="file" name="uploadInput" title="添加附件" id="uploadInput" multiple="true">',
									'</form>',
									'<iframe id="frmAttachTarget" style="display: none" name="frmAttachTarget"></iframe>',
								'</div>',
                            '</div>',
                            '<a title="超大附件" href="javascript:;" class="edit-btn" style="display:none" id="aLargeAttach">',
                                '<span class="edit-btn-rc"><b class="ico-edit ico-edit-cloud">云邮局</b>',
                                '</span>',
                            '</a>',
                            '<a bh="compose_editor_image" title="插入图片" href="javascript:;" class="edit-btn" id="aInsertPic"><span class="edit-btn-rc"><b class="ico-edit ico-edit-pic">图片</b></span></a>',
                            '<a id="caiyunDisk" title="彩云网盘" href="javascript:;" class="edit-btn"><span class="edit-btn-rc"><b class="i-color-cloud">彩云网盘</b></span></a>',
                            '<p class="fileLoading fl" style="display:none"><img src="/m2012/images/global/load.gif" width="16" height="16" > 图片插入中...</p>',
                            '<a href="javascript:;" id="gotoCompose" bh="cov_gotocompose" class="fr mr_10 mt_5" >切换到完整写信模式</a>',
							'<a class="fr mr_10 mt_5" style="display:none" id="gotoComposeLoading"><img src="/m2012/images/global/loading.gif">正在切换中...</a>',
                        '</div>',
                        '<p class="clearfix" style="height:5px;overflow:hidden;width:100%">&nbsp;</p>',
						'<input type="hidden" id="txtSubject" />',
					    '<div class="tips write-tips EmptyTips" style="display: none;"><div class="tips-text EmptyTipsContent">收件人输入错误</div><div class="tipsTop diamond"></div></div>'].join("")
            })()
        },        
        
        /**
         * 初始化
         */
        initialize: function(options){
            this.parentview = options.parentview;
            this.mid = PageMid = options.mid;
            this.data = options.data;
            // 绑定当前写信视图到主视图，用于在外层判断写信正文是否改变
            this.parentview['compose'+this.mid] = this;
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 定义容器
         */
        initContainer:function(){
            this.toEditBox = this.toEditBox || this.$el.find('#to-edit');
            this.ccEditBox = this.ccEditBox || this.$el.find('#cc-edit');
            this.bccEditBox = this.bccEditBox || this.$el.find('#bcc-edit');
            this.toAddrShowBox = this.toAddrShowBox || this.$el.find('#to');
            this.ccAddrShowBox = this.ccAddrShowBox || this.$el.find('#cc');
            this.bccAddrShowBox = this.bccAddrShowBox || this.$el.find('#bcc');
            this.replyContentBox = this.replyContentBox || this.$el.find('#replytextarea');
            this.subjectInput = this.subjectInput || this.$el.find('#subject-input');
            this.tipsText = this.tipsText || this.$el.find('#tips-text');
            this.covFont = this.covFont || this.$el.find('#tips-covfont');
            this.fontBtn = this.fontBtn || this.$el.find('#fontstyle');
        },
    
        /** 
         * 初始化事件 
         */        
        initEvents: function () {
            var self = this;
            var mid = this.mid;
            this.body = this.body || $('body');
            this.setBottombar();
            this.initContainer();

            //回复、全部回复、转发、标签主题
            top.$App.off("conversationCompose_" + mid);
            top.$App.on("conversationCompose_" + mid, function(args){
                $.extend(self, args);
                args && args.type && self.onBottomToolbarClick(args.type);
                if(args.type !== 'edit' &&args.type !== 'del' && args.type !== 'more' && args.type !== 'subject-focus'){
                    //self.replyContentBox.focus();
                    self.onReplyTextareaClick();                    
                }

                // 在每回复/全部回复/转发之间切换时，因为联系人发生了变化要对初始数据进行保存
                // 避免在没有修改的情况下点击关闭出现存草稿提示
                setTimeout(function(){
                    self.lastSave = self.getEditData();
                },1000)
            });

            //全局点击判断         
            this.body.click(function (e) {
                var target = e.srcElement || e.target; 
                self.hideEditBox(target);
            });

            top.$App.on("globalClick", function (e) {
                if (/conversationcompose.html/i.test(e.window.location.href)) {
                    return;
                }
                self.onAddrEditboxBlur(self.toEditBox);
                self.onAddrEditboxBlur(self.ccEditBox);
                self.onAddrEditboxBlur(self.bccEditBox);
            });
			
			//添加附件后高度自适应
			top.$App.off("conversationResize_" + mid);
			top.$App.on("conversationResize_" + mid, function(options){
				var type = options.type;
				var length = options.len;
				setTimeout(function(){
					self.onReSize();
					if(type === 'add'){
						self.parentview.scrollToPosition(27 * length);
					}
				},500)
			});

            top.$App.off('bottomComposeEditSubject');
            top.$App.on('bottomComposeEditSubject', function() {
                self.onSubjectClick();
            });
			
			//定义写信id
			this.initComposeId();

            top.$App.off('saveDraftsBeforeCloseTab');
            top.$App.on('saveDraftsBeforeCloseTab', function() {
                self.saveDraft(function() {self.removeReplybox();});
            });
        },

        /** 调整容器样式 */
        fixContainerCss: function(top){
            this.tipsText.css({ 'padding-top': top || 0 + 'px'});
        },

        /** 移除联系人输入框样式 */
        removeRichInputClass:function($el){
            this.writeTableCon = this.writeTableCon || this.body.find(".writeTable-txt");
            this.writeTableCon.removeClass("writeTable-txtOn");
        },

        /** 隐藏编辑框 */
        hideEditBox:function(target){
            var self = this;
            var domIdReg = /to|cc|bcc|sendbtn/i;
            var classReg = /writeTable-txt|addrBase|c-w-cloase|addnum/i;



            if (!$(target)[0]) { return }

            //点击显示层无效
            if (domIdReg.test($(target).attr('id')) || domIdReg.test($(target).parent().attr('id'))) {
                return;
            }
            //点击子项无效
            if ($(target).parents('#to-edit')[0] || $(target).parents('#cc-edit')[0] || $(target).parents('#bcc-edit')[0]) {
                return;
            }
            if (classReg.test($(target).attr('class')) || classReg.test($(target).parent().attr('class'))) {
                return;
            }
            if ( $(target).attr('rel') === 'addrInfo' ){
                return;
            }

            clearTimeout(self.hideTimer);

            self.hideTimer = setTimeout(function () {

                
                if(self.toEditBox.css('display') !== 'none' && self.toEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.toEditBox);
                        self.removeRichInputClass(self.toInputView.$el);
                    }
                }

                if(self.ccEditBox.css('display') !== 'none' && self.ccEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.ccEditBox);
                        self.removeRichInputClass(self.ccInputView.$el);
                    }
                }

                if(self.bccEditBox.css('display') !== 'none' && self.bccEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.bccEditBox);
                        self.removeRichInputClass(self.bccInputView.$el);
                    }
                } 


            },10);
        },

        /** 初始化界面 */
        setBottombar: function () {
            var self = this,
                $el = this.$el;
			$el.append(this.template.replybox); //插入节点
			
            setTimeout(function () {
                self.parentview.onResize();
            },500);
        },

        /** 重置回复框 */
        resetReplyBox:function(ref){
            
			/*this.toInputView.clear();
            this.ccInputView.clear();
            this.bccInputView.clear();
            this.editorView.editor.setHtmlContent(this.defaultFontsHtml);
			this.resetIframeHeight();
            $('#attachContainer').html('');
            uploadManager.fileList = [];*/
            var mid = this.mid;
            top.$App.off("conversationCompose_" + mid);
			top.$App.off('uploadImgStart_' + mid);
			// window.location.reload();			
        },

        /** 定义点击事件 */
        onBottomToolbarClick: function (ref) {
            var self = this,
                $el = this.$el,
                curMail = this.curMail;
         
            if (!ref) { return; }

            var from = curMail.from,
                to = curMail.dataSource.to,
                cc = curMail.dataSource.cc,
                bcc = curMail.dataSource.bcc,
                subject = curMail.dataSource.subject;

            var $subjectEdit = this.subjectEdit = this.parentview.$el.find("#edit-" + self.mid);    

            // 处理 --- “回复”，“回复全部”，“转发”
            if (this.bottombarCurPos[ref]) {

                
                self.preloadAddr = true;

                // DOM准备
                if ($el.find("#replybox").length == 0) {
                    $el.html(this.template.replybox);
                    this.initContainer();
                }

                // DOM呈现
                if ($el.find("#replybox").is(":hidden")) {
                    $el.find("#replybox").show();
                    $el.find("#sendbtn").parent().show();
                }

                // 指示当前操作
                this.parentview.$el.find("#bottombar-cur-pos").show().animate({ "left": self.bottombarCurPos[ref] }, "normal");
                
                // 首次点击底部工具条添加“编辑主题”选项，且点击一次后置灰(暂时需求干掉)
                if ($subjectEdit.length == 0 && "none" !== parent.$('#conversationcompose_' + self.mid).css("display")) {
                    var parentToolBar = this.parentview.$el.find('#bottomBar_' + self.mid);
                    parentToolBar.find("[name=more]").before('<a href="javascript:;" ref="edit" id="edit-'+self.mid+'" bh="cov_editreplysubject">编辑主题</a><em class="gray">|</em>');
                    $subjectEdit = this.subjectEdit = this.parentview.$el.find("#edit-" + self.mid);
                } else {
                    $subjectEdit.removeClass("clickFlag");
                }
            }            

            var $to = $el.find("#to"),
                $cc = $el.find("#cc"),
                $subject = $el.find("#subject"),
                $subjectInput = self.subjectInput, //$el.find("#subject-input"),
                setSubject = function (prefix) {
                    subject = prefix + subject;
                    sliceSubject = subject.length > 50 ? subject.slice(0, 50) + "..." : subject.slice(0, 50);
                    $subject.text(sliceSubject).attr("title", subject);
                    $subjectInput.closest("table").hide();
                },
                setAutoSave = function () {

                    self.subject = subject;
                    self.content = "";

                    self.setAutoSave();
                };

            switch (ref) {

                case "reply":

                    //需要初始化值
                    self.initToRichInputData(from);
                    self.initCcRichInputData();
                    self.initBccRichInputData();
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject(this.rPrefix);
                    self.subjectInput.parents("table").show();
                    setAutoSave();
					self.setFocus();
                    break;
                case "replyall":
                    var allAddress = [];
                    var newAddress = [];
                    var toAddress;
                    var fromAddress = [from];
                    var replyallMemo = {};
                    var remail;
                    allAddress = allAddress.concat(fromAddress);
                    if(to){
                        var toAddress = to.split(",");
                        allAddress = allAddress.concat(toAddress);
                    }                    
                    //过滤重复
                    $.each(allAddress,function(i,val){
                        remail = $Email.getEmail(val);
                        if(!replyallMemo[remail]){
                            replyallMemo[remail] = 1;
                            newAddress.push(val);
                        }
                    });
                 
                    self.initToRichInputData(newAddress.join(','));
                    self.initCcRichInputData(cc);
                    self.initBccRichInputData(bcc);
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject(this.rPrefix);
                    self.subjectInput.parents("table").show();
                    setAutoSave();
					self.setFocus();
                    break;
                case "forward":
                    self.initToRichInputData();
                    self.initCcRichInputData();
                    self.initBccRichInputData();
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject("Fw:");
                    showEditSubjectArea();
                    self.hideAddNum();
                    setAutoSave();
                    break;
                case "edit":
                    showEditSubjectArea();
                    break;
                case "subject-focus":
                    this.$el.find("#subject").trigger('click');
                    break;
            }

            function showEditSubjectArea(){
                // if (!$subjectEdit.hasClass("clickFlag")) {
                    self.subjectInput.parents("table").show();
                    self.onSubjectClick();
                    // $subjectEdit.addClass("clickFlag");  // gray2表示点击过
                // }
            }

            // 记录上次点击的标签，防止重复点击
            if(ref !== 'edit'){
                self.curTab = ref;
            }

            self.initEditorEvent();
        },

        /** 智能联想输入组件 */
        createRichInput:function(id){
            return M2012.UI.RichInput.create({
                container: document.getElementById(id),
                maxSend: top.$User.getMaxSend(),
                type: "email",
                preventAssociate: true   //屏蔽推荐收件人
            });
        },

        /** 写信容器高度自适应 */
        onReSize:function(speed){
            var self = this,
                mid = this.mid,
				speed = speed || 200,
                fixH = 5;
            if(!self.hasfixH){                 
                self.hasfixH = true;
            }else{
                fixH = 0;
            } 

            if (typeof (clearTimeout) === "undefined") { return } //iframe移除时
            clearTimeout(self.resizeTimer);
            self.resizeTimer = setTimeout(function(){
                self.iframe = self.iframe || parent.$('#conversationcompose_' + mid);
				$(self.iframe).animate({'height':self.getBodyHeight() + fixH + 'px'},50);
			},speed);
        },

        /** 获取iframe高度 */
        getBodyHeight:function(win){
            var self = this,
                win = win || window,
                bodyH = 0,
                dbody = win.document.body;

            if(dbody && dbody.clientHeight){
                bodyH = dbody.clientHeight;                
            }else if( win.document.documentElement && win.document.documentElement.clientHeight){
                bodyH = win.document.documentElement.clientHeight;
            }

            //IE6特殊处理
            if($B.is.ie && $B.getVersion() < 7){
                bodyH = dbody.scrollHeight;
            }

            return bodyH;
        },

        /** 数据是否变动 */
        isDataChanged:function(){
            var self = this,
                data = this.getEditData(),
                lastSave = this.lastSave;
            // 如果lastSave不存在证明页面还未完成初始化（粗略判断）
            if (!lastSave) return false;

            for(var i in lastSave){
                if (data[i] != lastSave[i]) {
                    return true;
                }
            }
            return false;
        },

        /** 自动保存 */
        setAutoSave: function () {

            var self = this,
                $el = this.$el,
                mid = this.mid,
                $replybox = parent.$('#conversationcompose_' + mid);

            if (!$replybox.is(":hidden")) {
                if (this.autosaveInterval) {
                    clearInterval(this.autosaveInterval);
                }
                this.autosaveInterval = setInterval(function () {
                    if (!$replybox.is(":hidden")) {
                        self.isDataChanged() && self.saveDraft();
                    } else {
                        clearInterval(self.autosaveInterval);
                    }
                }, 60 * 1000); //1分钟存一次草稿
            }

        },

        /** 获取对应的view */
        getInputViewById:function(id){
            var map = {
                    'to':this.toInputView,
                    'cc':this.ccInputView,
                    'bcc':this.bccInputView
            };
            return map[id];
        },

        /** 获取输入框地址 */
        getInputItemAddrs:function(id){
            
            var view = this.getInputViewById(id),
                addr;
            if(view){
                addr = view.getAddrItems();
                return addr;
            }   
            return []; 
        },    

        /** 编辑框失焦点 */
        onAddrEditboxBlur: function (target) {
            this.onReSize();
            return;

            if (!target || !target.attr('id') || target.attr('id').indexOf('-') === -1) {
                return;
            }

            var self = this,
                $editbox = target,
                editboxID = $editbox.attr("id"),
                showboxID = editboxID.split("-")[0],
                $showbox = this.$el.find("#"+showboxID),

                getAddrHtml = function (showboxID) {
                    var str = "",
                        item,
                        isEmail = false,
                        getMailName = self.parentview.getMailName,
                        arr = self.getInputItemAddrs(showboxID),
                       
                        len = arr.length,
                        emailO = {},
                        splitStr,
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
                        splitStr = i === len - 1 ? "" : "; ";
                        isEmail = $Email.isEmailAddr(item) || $Email.isEmail(item);
                        str += isEmail ? '<span>' + $T.Utils.htmlEncode(getMailName(item)) + splitStr + '</span>' : '<span class="red">' + $T.Utils.htmlEncode(getMailName(item)) + splitStr + '</span>';
                    }

                    // 保存过滤后的联系人地址，发送时用
                    self[showboxID] = arr;
                    return len == 0 ? "" : str + '<span class="other">+另外00人</span>';
                },
                clipAddrHtml = function ($cont) {

                    var width = 0,
                        cwidth = $cont.width(),
                        td2Wdith = $cont.parent().next().width(),
                        els = $cont.children(),
                        len = els.length,
                        last,
                        otherTipsWidth = 80,
                        flag,
                        text;

                    for (var i = 0; i < len - 1; i++) {
                        width += $(els[i]).width();
                        // 如果只有一个邮件地址，或者所有邮件地址加起来长度没有超过一行，直接移除最后一项【+另外几人】
                        if (len == 2 || i == len - 2 && width <= cwidth) {
                            els.last().remove();
                            last = $cont.find(":last");
                            text = last.text().replace(";", "");
                            last.text(text);
                            break;
                        }
                    }



                    // 处理换行情况
                    if (width > cwidth) {
                        width = els.last().width(); //另外的宽度+滚动条
                       
                        for (var i = 0, len = els.length; i < len - 1; i++) {
                            width += $(els[i]).width();
                            if (width > cwidth) break;
                        }

                        if( self[showboxID + '-flag']){
                            i = self[showboxID + '-flag'];  
                        }else{
                            if(showboxID == 'to'){ i-- } //特殊处理
                            self[showboxID + '-flag'] = i;
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
                        self.onReSize();
                    }
                    
                };
            
            // 确保tr可见，以便触发渲染、计算联系人和输入框的宽度
            var addrHTML = getAddrHtml(showboxID);
            $showbox.show().closest("tr").show();
            $showbox.html(addrHTML);
            if (this[showboxID].length) {
                $editbox.hide();
                clipAddrHtml($showbox);                    
                if (showboxID == "cc") {
                    self.$el.find("a[ref=" + editboxID + "]").hide();
                }
                self.onReSize();
            } else if (showboxID == "to") {
                $showbox.hide();
                $editbox.show();
            } else {
                $showbox.hide();
                if (this.preloadAddr) {
                    $editbox.show().closest("tr").hide();
                    self.$("a[ref=" + editboxID + "]").text(showboxID == "cc" ? "抄送" : "密送").show();
                    var ccbccSelector = showboxID == "cc" ? "#bcc" : "#cc";
                    ccbccSelector = self.$(ccbccSelector).is(":hidden") ? "#to" : ccbccSelector
                    self.onReSize();
                }
            }

            if(showboxID === 'to'){
                self.fixContainerCss(0);
                self.$el.find('.EmptyTips').hide();
            }

            self.onReSize();
            
        },

        /** 联系人显示层事件 */
        onAddrShowboxClick: function (e) {
            var self = this,
                target = e.target || e.srcElement,
                $showbox = $(target).closest("div"),
                $editbox = $showbox.next("div"),
                $textarea = $editbox.find("textarea");
                $showbox.hide();
                $editbox.show();

            //编辑状态下聚焦
            var id = $showbox.attr('id'),
                view = this.getInputViewById(id);
            if(view){
                view.focus();
            }

            self.onReSize();
        },

        /** 错误提示 */
        showErrorTipsBox:function(text, callback){
            top.$Msg.alert(
                text,
                {
                    isHtml:true,
                    icon:"warn",
                    onClose:function(e){
                        callback && callback();
                    }
                }
            );
        },
		
		// 获取下载大附件的html代码
		getLargeAttachsHtml: function(callback){
			
			var self = this;
			var html = '';
			
			// 调服务端接口获取大附件的下载地址
			ComposeModel.mailFileSend(Arr_DiskAttach, function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					var fileList = result.responseData['var']['fileList'];
    				var urlCount = 0;
                    var newArr_DiskAttach = [];
                    for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                        if(Arr_DiskAttach[i].fileType !== "netDisk"){
                            newArr_DiskAttach.push(Arr_DiskAttach[i]);
                        }
                    }
    				for(var j = 0,len = fileList.length;j < len;j++){
    					var mailFile = fileList[j];
    					for (var i = 0,diskLen = newArr_DiskAttach.length;i < diskLen; i++) {
                            var diskFile = newArr_DiskAttach[i];
                            if ((mailFile.fileId === diskFile.fileId || mailFile.fileName == diskFile.fileName) && !diskFile.getIt) {
                                diskFile.getIt = true;
                                diskFile.downloadUrl = mailFile.url;
                                diskFile.exp = mailFile.exp;
                                urlCount++;
                                break;
                            }
                        }
    				}
	                if (urlCount == newArr_DiskAttach.length) {
	                	html = getDiskLinkHtml();						
	                } else {
						top.console.log('获取大附件下载地址有误！！');
                        self.logger.error("get aLargeAttach error");
	                }
						callback && callback(html);
				}else{
					callback && callback(html);
					top.console.log('获取大附件下载地址失败！！');
                    self.logger.error("get aLargeAttach fail");
				}
			});
		},
		

        /** 发送邮件 */
        onSend: function () {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content =  self.editorView.editor.getHtmlContent();  //$el.find("#replytextarea").val();
            var replyMessageData = { mid: mid };

            if(self.sendFlag){ //正在发送中
                return;
            }
            
            //判断是否收件人为空
            if (!self.toInputView.hasItem()) {
                window.scrollTo(0, 0);
                //self.fixContainerCss(15); 
                //self.toInputView.showEmptyTips("请填写收件人");
                self.showErrorTipsBox(self.tips.replyMailNull, function(){
                    self.toInputView.focus();     
                });
                return;
            }

            //错误地址判断
            var richInput = null,
                addrBox = null;
            if (self.toInputView.getErrorText()) {
                richInput = self.toInputView;
                addrBox = self.toAddrShowBox;
                //self.fixContainerCss(14);
            } else if (self.ccInputView.getErrorText()) {
                richInput = self.ccInputView;
                addrBox = self.ccAddrShowBox;
            } else if (self.bccInputView.getErrorText()) {
                richInput = self.bccInputView;
                addrBox = self.bccAddrShowBox;
            }
            if (richInput) {
                self.showErrorTipsBox(self.tips.replyMailError, function(){
                    addrBox.trigger('click');
                });
                return;
            }
			
			//省略验证邮件地址格式
            var enableQuote = this.curTab == "forward" || top.$App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文
            //content = M139.Text.Utils.htmlEncode(content);
            //content = content.replace(/\r/gm, '').replace(/\n/gm, '<br>');
			
			var enableQuoteSplit = enableQuote ? "<hr id=\"replySplit\"/>" : "";

            var postData = {
                to: this.toInputView.getAddrItems().join(","),
                cc: this.ccInputView.getAddrItems().join(","),
                bcc: this.bccInputView.getAddrItems().join(","),
                mid: mid,
                content: content
            };
            var replyMessageData = {
                mid: mid
            };

			//添加超大附件链接正文内容
            /*var newArr_DiskAttach = [];
            for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                if(Arr_DiskAttach[i].fileType !== "netDisk"){
                    newArr_DiskAttach.push(Arr_DiskAttach[i]);
                }
            }
            if(newArr_DiskAttach.length == 0){
                this.model.mailInfo['content'] += getDiskLinkHtml();
            }
            if (newArr_DiskAttach.length > 0 && action == this.model.actionTypes['DELIVER']) {
                this.resolveLargeAttachs(action, callback);
            }else{
                this.callComposeApi(action, callback);
            }*/


			if (Arr_DiskAttach.length > 0) {
                var newArr_DiskAttach = [];
                for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                    if(Arr_DiskAttach[i].fileType !== "netDisk"){
                        newArr_DiskAttach.push(Arr_DiskAttach[i]);
                    }
                }

                if (newArr_DiskAttach.length == 0) {
                    content += getDiskLinkHtml() + enableQuoteSplit;
                    postData.content = content;
                    self.callReplyMessage(enableQuote, postData, replyMessageData, content);
                } else {
                    this.getLargeAttachsHtml(function(data){
                        content += data + enableQuoteSplit;
                        postData.content = content;
                        self.callReplyMessage(enableQuote, postData, replyMessageData, content);
                    }); 
                }							
		    }else{
				content += enableQuoteSplit;
				postData.content = content;
				self.callReplyMessage(enableQuote, postData, replyMessageData, content);
			}

            // this.parentview.$el.find('li[name=del]').show();
            // this.parentview.$el.find('li[name=edit]').hide();
			
        },
		
		/** 发信封装 */
		callReplyMessage:function(enableQuote, postData, replyMessageData, content){
			
			var self = this;
			var $el = this.$el;
			
			top.M139.UI.TipMessage.show("正在发送邮件...");
            self.sendFlag = true;
            this.replyMessage(postData, replyMessageData, function (sendMailRequest) {
                if(!enableQuote) {
					sendMailRequest.attrs.content = content;
                }
                sendMailRequest && self.compose(sendMailRequest, function (flag, summary) {
                    if (flag){
                        self.resetReplyBox();
                        top.M139.UI.TipMessage.show(self.tips.replySuccess, { delay: 3000 });
                        self.removeReplybox();
                    } else if (summary) {
                        top.M139.UI.TipMessage.show(summary, { delay: 3000 });
                    } else {
                        var failText = self.tips.replyFail;
                        top.M139.UI.TipMessage.show(failText, { delay: 3000 });
                    }
                    self.sendFlag = false;
                });
            });
			
		},
		

        /** 跳转异常时处理 */
        onGotoComposeFix:function(){

            var self = this; 
            var $el = this.$el;
            var mid = this.mid;
            var content =  self.editorView.editor.getHtmlContent();//$el.find("#replytextarea").val();
            var subject = $.trim(self.subjectInput.val());
            var type = this.curTab; // 'reply','replyall','forward'
            var toAll = type === 'replyall' ? 1 : 0;

            //存草稿后再打开


            //内容换行处理
            //content = content.replace(/\r\n/gm,'<br/>');
            //content = content.replace(/\n/gm,'<br/>');

            //传送到写信页的替换数据，使用后要立即清空
            var postToComposeData = {
                type: this.curTab,
                content: content,
                subject: subject,
                account: this.toInputView.getAddrItems().join(","),
                to: this.toInputView.getAddrItems().join(","), 
                cc: this.ccInputView.getAddrItems().join(","), 
                bcc: this.bccInputView.getAddrItems().join(",") 
            };

            //暂时这样实现，待回复功能优化后这块可以干掉           
            M139.PageApplication.getTopApp().sessionPostData = postToComposeData;

            if( type === 'forward'){
                top.$App.forward(mid);
            }else{
                top.$App.reply(toAll, mid, true);
            }

            //清空
            this.editorView.editor.setHtmlContent('');
			this.resetIframeHeight();
            this.removeReplybox();

        },

        /** 
         * 跳转完整写信模式 
         * 就是先存草稿再打开草稿
         */
        onGotoCompose:function(){
            var self = this;
			$('#gotoCompose').hide();
			$('#gotoComposeLoading').show();
			self.saveDraft(function(mid){
                self.resetIframeHeight();
                self.removeReplybox();
                top.$App.restoreDraft(mid);//打开草稿
            });
        },


        /** 字体样式调整层隐藏显示 */
        showFontBar:function(){
            var self = this,
                jTarget = this.fontBtn,
                bodyHeight;

            if(jTarget.hasClass("edit-btn-on")){
                jTarget.removeClass("edit-btn-on");
                self.covFont.css("visibility","hidden");
                self.covFont.next().addClass("cov-r-border");              
                setTimeout(function(){
                    self.onReSize();
                },100);    
            }else{
                jTarget.addClass("edit-btn-on");
                self.covFont.css("visibility","visible");
                self.covFont.next().removeClass("cov-r-border");
                setTimeout(function(){
                    self.onReSize();
                },200);                
                top.BH("cov_richeditor");
            }
           
        },

        /** 容器滚动条调整 */
        containerScrollTo:function(height){
            var height = height || 0;
            var bContainer = this.parentview.bContainer;
            var scrolltop = bContainer.scrollTop();
            bContainer.animate({scrollTop:(scrolltop + height)}, 300);
        },

        /** 智能输入事件绑定 */
        richInputInitEvents:function(view, target){
            var self = this;

            view && view.on("blur",function(){
                self.onReSize();
            }).on("itemchange",function(){
                self.onReSize();
            }).on("focus",function(){
                self.richInputAddClass(view);
            })

            var txtContainer = view.$el.find(".writeTable-txt");
            txtContainer.on("click",function(){
                self.richInputAddClass(view);
            });

        },

        /** 联系人输入框添加边线 */
        richInputAddClass:function(view){
            this.removeRichInputClass();
            view.$el.find(".writeTable-txt").addClass("writeTable-txtOn");
        },

     
        /** 存草稿 */
        saveDraft: function (callback) {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content = self.editorView.editor.getHtmlContent();
            var replyMessageData = { mid: mid };


            //省略验证邮件地址格式
            var enableQuote = top.$App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文

            if (enableQuote) {
                content += "<br/><br/><br/><br/><hr id=\"replySplit\"/>";
            }
            var postData = {
                to: this.toInputView.getAddrItems().join(","), 
                cc: this.ccInputView.getAddrItems().join(","), 
                bcc: this.bccInputView.getAddrItems().join(","), 
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
 
                sendMailRequest && self.compose(sendMailRequest, function (flag, composeMid) {
                    if (flag) {
                        var time = new Date(),
                            hour = time.getHours(),
                            minu = time.getMinutes();

                        top.M139.UI.TipMessage.show(hour + "时" + minu + "分成功保存到草稿箱", { delay: 3000 });
                        // 保存回复关键信息，用于下次自动保存判断内容是否有改动
                        self.lastSave = self.getEditData();
                        callback && callback(composeMid);
                    }else{
						//存草稿异常处理，调用fix方式（不能带附件）
						self.onGotoComposeFix();
					}
                });
            });
        },
		
		/** 
         * 获取写信相关数据Id,originalContent,messageId 
         * 由于上传附件是要绑定写信id的，所以初始化时要调用生成Id
         */
		initComposeId:function(){
			var self = this;	
			var replyMessageData = {
                mid: self.mid
            };
			top.M139.RichMail.API.call("mbox:replyMessage", replyMessageData, function (result) {

				if (result.responseData.code && result.responseData.code == 'S_OK') {
					var data = result.responseData["var"];
					window.composeId = self.composeId = data.id;
					self.originalContent = data.content || "";
					self.messageId = data.messageId;
				}else {
					top.$Msg.alert(self.tips.replyFail, {
						icon: 'fail'
					});
                    self.logger.error("conversationmail replyMessage error", "[mbox:replyMessage]", result);
                }
			});		
		},

        /** 密送、抄送 */
        onAddCCorBCC: function (e) {
            var target = e.target || e.srcElement,
                editID = $(target).attr("ref"),
                showID = editID.split("-")[0],
                $editbox = this.$el.find("#" + editID), //cc-edit,bcc-edit
                $showbox = this.$el.find("#" + showID), //cc,bcc
                cc = this.curMail.dataSource.cc,
                bcc = this.curMail.dataSource.bcc;
			
			var toTr = this.$("#to").closest("tr"),
				ccTr = this.$("#cc").closest("tr"),
				bccTr = this.$("#bcc").closest("tr"),
				toTr_ccEdit = toTr.find("a[ref=cc-edit]"),
				toTr_bccEdit = toTr.find("a[ref=bcc-edit]");
				toTr_ccEdit.hide();
				toTr_bccEdit.hide();
				
			var thisTr = $showbox.closest("tr");
            $showbox.hide(); 
            thisTr.show();//所在行显示
            $(".eidt-body").css("zoom","1"); //IE7 bug修复 
			
			this.$("a[ref=" + editID + "]").hide(); //所在行编辑隐藏
			
			if(editID === 'cc-edit'){
				bccTr.is(":hidden") && thisTr.find("a[ref='bcc-edit']").show();
			}
			
			if(editID === 'bcc-edit'){
				ccTr.is(":hidden") && thisTr.find("a[ref='cc-edit']").show();
			}
			
            this.preloadAddr = false;
            this.onReSize();
        },

        /** 创建收件人输入框智能联想 */
        initToRichInputData:function(to){
            if( !this.toInputView){
                this.toInputView = this.createRichInput('to-edit');
                this.toInputView.render();
                this.richInputInitEvents(this.toInputView, '#to-edit'); 
                this.toInputView.clear();
                to && this.toInputView.insertItem(to);
            } else {
                this.toInputView.clear();
                to && this.toInputView.insertItem(to);
            }
        },

        /** 创建抄送人输入框智能联想 */
        initCcRichInputData:function(cc){
            if( !this.ccInputView){
                this.ccInputView = this.createRichInput('cc-edit');
                this.ccInputView.render();
                this.richInputInitEvents(this.ccInputView, '#cc-edit'); 
                this.ccInputView.clear();
                cc && this.ccInputView.insertItem(cc);
            } else {
                this.ccInputView.clear();
                cc && this.ccInputView.insertItem(cc);
            }
        },

        /** 创建密送人输入框智能联想 */
        initBccRichInputData:function(bcc){
            if( !this.bccInputView){
                this.bccInputView = this.createRichInput('bcc-edit');
                this.bccInputView.render();
                this.richInputInitEvents(this.bccInputView, '#bcc-edit'); 
                bcc && this.bccInputView.insertItem(bcc);           
            } else {
                this.bccInputView.clear();
                bcc && this.bccInputView.insertItem(bcc);
            }
        },

        /** 隐藏添加提示 */
        hideAddNum:function(){
            this.$el.find('div.addnum').hide();
        },

        // 点击关闭回复框
        closeReplybox: function() {
            var self = this;
            if (self.isDataChanged()) {
                dialog = top.$Msg.confirm(
                        '关闭后，已修改的内容会保存到草稿箱，确认关闭？',
                        function () {
                            self.saveDraft(function() {self.removeReplybox();});                            
                        },
                        function () {
                            self.removeReplybox();
                        },
                        {
                            dialogTitle:'系统提示',
                            icon:"warn",
                            isHtml: true,
                            buttons: ['关闭', '关闭不保存草稿', '取消']
                        }); 
            } else {
                self.removeReplybox();
            }             
        },
        /** 关闭回复框功能 */
        removeReplybox: function () {
            var self = this;
            var parent = this.parentview.$el
            var mainbody = parent.find('div[name=covMail_mainbody][mid='+ this.mid +']');
            // mainbody.find('li[name=del]').show();
            // mainbody.find('li[name=edit]').hide();
            mainbody.find("div[name=covMail_bottom_compose]").hide();

            this.parentview.curTab = null;
            this.parentview.bottomview.curBtn = null;
            this.curTab = null;
            this.resetReplyBox();

            clearInterval(this.autosaveInterval);
            clearTimeout(this.hideTimer);            
            setTimeout(function() {                       
                mainbody.find("div[name=covMail_bottom_compose]").remove();
            }, 300);

            // 校验是否关闭当前页签
            var total = this.model.get('total');
            var composeiframes = parent.find('div[name=covMail_bottom_compose]:visible');
            if (total == 0 && composeiframes.length == 0) top.$App.close();
        },

        /** 
         * 密送、抄送隐藏逻辑
         * 收件人一直显示
         * 如果有抄送，且密送不显示，则显示'密送'
         * 如果有密送，且抄送不显示，则显示'抄送'
         */
        checkCCBCCvisibility: function () {
            var cc = this.ccInputView.getAddrItems().join(",") || this.ccInputView.getErrorText(),
                bcc = this.bccInputView.getAddrItems().join(",") || this.bccInputView.getErrorText();

            var toTr = this.$("#to").closest("tr"),
				toTr_ccEdit = toTr.find("a[ref=cc-edit]"),
				toTr_bccEdit = toTr.find("a[ref=bcc-edit]"),
				
				bccTr = this.$("#bcc").closest("tr"),
				bccTr_ccEdit = bccTr.find("a[ref=cc-edit]"),
				
				ccTr = this.$("#cc").closest("tr"),
				ccTr_bccEdit = ccTr.find("a[ref=bcc-edit]");

			//先隐藏所有抄送,密送
			this.$(".td2 a").hide();
			
			//tr输出
			cc ? ccTr.show() : ccTr.hide();
            bcc ? bccTr.show() : bccTr.hide();
			
			if(cc){
				//隐藏抄送
				bccTr_ccEdit.hide(); 
				toTr_ccEdit.hide();				
            }else{
				if(bccTr.is(":hidden")){
					toTr_ccEdit.show(); //显示抄送 
                }else{
                    bccTr_ccEdit.show(); //显示抄送 
                }
			}
			
			if(bcc){
				//隐藏密送
				ccTr_bccEdit.hide(); 
				toTr_bccEdit.hide();				
            }else{
				if(ccTr.is(":hidden")){
					toTr_bccEdit.show(); //显示密送 
                }else{
                    ccTr_bccEdit.show(); //显示密送 
                }
			}
        },

        /** 标题点击 */
        onSubjectClick: function () {
            var self = this,
                $el = this.$el,
                $subject = $el.find("#subject"),
                $subjectInput = self.subjectInput,
                txt = $subject.attr("title"),
                $table = $subjectInput.parents("table"),
                inputwidth = $table.width() - 80;
            $subjectInput.parents("table").show();  
            $subject.hide();
            $subjectInput.val(txt).width(inputwidth).show();
            top.$TextUtils.textFocusEnd($subjectInput[0]);
            this.subjectLimitNum = Math.floor(inputwidth / 7) + 100;
            this.checkCCBCCvisibility();
            this.onReSize();
   
            setTimeout(function(){
                self.onReSize();
            },100)

        },

        /** 内容点击 */
        onReplyTextareaClick: function () {
            var self = this;
            setTimeout(function(){
                self.checkCCBCCvisibility();
                self.onReSize();
            },100);
        },

        /** 标题字数限制 */
        checkSubjectInputLength: function (e) {
            var $subjectInput = this.subjectInput,
                txt = $subjectInput.val();
            if ($.trim(txt).length > 200) {
                txt = $.trim(txt).slice(0, 200);
                $subjectInput.val(txt);
            }
        },

        /** 标题blur */
        onSubjectInputBlur: function () {
            var $el = this.$el,
                txt = this.subjectInput.val(),
                txt = $.trim(txt),
                subject = top.$TextUtils.getTextOverFlow2(txt, this.subjectLimitNum, true);
            $el.find("#subject").attr("title", txt).text(subject).show();
            this.subjectInput.hide();
            this.subject = txt;
        },

        /** 获取内容 */
        monitorContentTextarea: function () {
            var txt = self.editorView.editor.getHtmlContent();
            this.content = $.trim(txt);
        },

        /**
         * 快捷回复信件
         * @param {Object} options 初始化参数集
         */
        compose: function (options, callback) {
            var self = this;
            top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", options, function (result) {
                if (result.responseData.code && result.responseData.code == 'S_OK') {
                    callback && callback(true, result.responseData['var']);
                } else if (result.responseData.summary) {
                    callback && callback(false, result.responseData.summary);
                    self.logger.error("conversationmail compose error", "[mbox:compose]", result);
                } else {
                    //callback && callback();
                }
            });
        },
		
		/**
		 * 回复框正文高度还原
		 */
		resetIframeHeight:function(){
			var iframe = this.editorView.editor.frame;
			$(iframe).height(125);
			$(iframe.parentNode.parentNode).height(125);
		},

        /**
         * 回复框正文高度自适应
         */
        onReplyBoxAutoHeight:function(options){
            var self = this;
            clearTimeout(this.replyBoxAtuoHeightTimer);
			var speed = 100;
            this.replyBoxAtuoHeightTimer = setTimeout(function(){
                
                var iframe = options.frame,
				    doc = iframe.contentWindow.document,
                    editorBody = doc.body,
                    editorHeight = self.getBodyHeight(iframe.contentWindow), //$(editorBody).height();
                    editorMaxheight = self.getEditorMaxHeight();
				
                if( editorHeight <= 125 ){
                    editorHeight = 125;
					speed = 200;
                }
                
				if( editorHeight > editorMaxheight){
					editorHeight = editorMaxheight;
					doc.getElementsByTagName("html")[0].style.overflow = "auto";
					editorBody.style.overflow = "hidden";
				}else{
					doc.getElementsByTagName("html")[0].style.overflow = "hidden";
					editorBody.style.overflow = "hidden";
				}
				
                //iframe.style.height = editorHeight + 'px';
                //iframe.parentNode.parentNode.style.height = editorHeight + 'px';

                //IE6处理
                if( $B.is.ie && $B.getVersion() < 7){
                    editorBody.style.height = editorHeight + 'px';//IE6 
                    editorBody.style.overflowY = 'scroll';                     
                }

                $(iframe).animate({'height':editorHeight + 'px'},speed);
				$(iframe.parentNode.parentNode).animate({'height':editorHeight + 'px'},speed);				
				setTimeout(function(){
					self.onReSize(1);				
				},speed)

            },200);    

        },

        /** 
        * 初始化写信编辑器
        */
        initEditorEvent:function(){

            var self = this,
                editorView;
		
            if(self.editorView){
                return;
            }
			
            editorView = htmlEditorView.editorView = self.editorView = M2012.UI.HTMLEditor.create({

                combineButton: [
                    "FontFamily",
                    "FontSize",
                    "Bold",
                    "Italic",
                    "UnderLine",
                    "FontColor",
                    "BackgroundColor",
                    "SetBackgroundColor",
                    "UnorderedList",
                    "OrderedList",
                    "AlignLeft",
                    "AlignCenter",
                    "AlignRight",
                    "Outdent",
                    "Indent",
                    "RowSpace"
                ],            
                contaier:$("#htmlEdiorContainer"),
                blankUrl:"../html/coveditor_blank.htm?sid="+top.sid,
                isShowSetDefaultFont:true,
                placeHolder: " ",
                uploadForm:{
                    getUploadUrl: function(callback){

						ComposeModel.requestComposeId(function(){
                            var url = utool.getControlUploadUrl(true);
                            setTimeout(function(){
                                callback(url);
                            },0);
                        });
                    },
                    fieldName: "uploadInput",
                    getResponseUrl: function(responseText){
                        var imageUrl = '';
                        var returnObj = ComposeModel.getReturnObj(responseText);
                        returnObj.insertImage = true;
                        upload_module.model.composeAttachs.push(returnObj);
                        uploadManager.refresh();
                        
                        if(returnObj){
                            imageUrl = ComposeModel.getAttachUrl(returnObj.fileId, returnObj.fileName, false);
                        }
                        return imageUrl;
                    }
                }
            });
        
            editorView.on("buttonclick",function(e){
				
				if(/FontFamily|FontSize/.test(e.command)){
					self.initFontScrollEvent(e.command);
				}
            });

            
			var commands = ["keyup","keydown","paste","afterexeccommand"];
            
			$.each(commands,function(i,val){
                editorView.editor.on(val, function () {
                    self.onReplyBoxAutoHeight(editorView.editor);
                    // self.memoTimeHandler();
                });
            });

            editorView.editor.on("focus", function () {
                self.onReplyTextareaClick();
            });

            editorView.editor.on("paste", function (e) {
			    if(self.isRight){
                    paste(e); //右键粘贴
                }
            });
			
			//默认聚焦
			editorView.editor.on("ready", function(e){
				self.setFocus();
			});					

            editorView.editor.on("mousedown", function (e) {
                if($B.is.ie){
                    var ele = e.target;
                    self.ieImgel = null;
                    self.ieTableEl = null;
                    if(ele.tagName == 'IMG'){
                        self.ieImgel = $(ele);
                    }else if(ele.tagName == 'TABLE'){
                        self.ieTableEl = $(ele);
                    }
                }
                if(e.button == 2){ //右键
                    self.isRight = true;
                }else{
                    self.isRight = false;
                }
            });

            editorView.editor.on("keydown", function (e) {
                if (e.ctrlKey && e.keyCode == M139.Event.KEYCODE.V) {
                    paste(e);
                }else if(e.keyCode == M139.Event.KEYCODE.BACKSPACE){ //ie浏览器选中图片时，按退格会退出到登录页，但实际是想删除图片
                    if(self.ieImgel){
                        self.ieImgel.remove();
                        self.ieImgel = null;
                        $(editorView.editor.frame.contentWindow.document.body).find('#divImgEditorMenuBar').remove();
                        return false;
                    }
                    if(self.ieTableEl){
                        self.ieTableEl.remove();
                        self.ieTableEl = null;
                        return false;
                    }
                }
            });

            function paste(e) {
                self.editorView.editor.markFont();
                try {
                    e.returnValue = window.captureClipboard();
                    if(e.returnValue === false){
                        top.$Event.stopEvent(e);
                    }

                    setTimeout(function(){
                        self.editorView.editor.resetTextSizeForIe();
                    }, 50);
                } catch (e) {
                }
            }

			//默认字体设置
			var defaultFontsHtml = self.defaultFontsHtml = this.getDefaultFonts(editorView.editor) || '';
            editorView.editor.setHtmlContent(defaultFontsHtml);
			//行为统计
            this.replaceFontButtonBh();   
            //初始化存草稿数据
            setTimeout(function(){
                self.lastSave = self.getEditData();
            },1000)

            //插入图片后
            editorView.editor.on("insertImage", function (e) {
                self.hideUploadImgStatus();
				resizeHeight();
				setTimeout(function(){
					resizeHeight();
				},2000)
			});
			
			function resizeHeight(){
			    self.onReplyBoxAutoHeight(editorView.editor); 
                self.onReSize();
			}
			
            //上传图片监听
            if(window.conversationPage && window.PageMid){
				top.$App.off('uploadImgStart_' + window.PageMid);
                top.$App.on('uploadImgStart_' + window.PageMid,function(){
                    self.showUploadImgStatus(window);
                });
            }

        },

        /** 显示上传图片过程 */
        showUploadImgStatus:function(win){
            var self = this;
            self.uploadImgStautsCon = self.uploadImgStautsCon || $("p.fileLoading");
            self.uploadImgLoading = win.setTimeout(function(){
                self.uploadImgStautsCon.show();
                $("div.picpop").hide();
            },3000)
        },

        /** 隐藏上传图片过程 */
        hideUploadImgStatus:function(){
            var self = this;
            self.uploadImgStautsCon = self.uploadImgStautsCon || $("p.fileLoading");
            clearTimeout(self.uploadImgLoading);
            self.uploadImgStautsCon.hide();
        },

        /** 获取编辑数据 todo附件数据还未添加 */
        getEditData:function(){
            var self = this;
            return {
                to: self.toInputView.getAddrItems().join(","),
                cc: self.ccInputView.getAddrItems().join(","),
                bcc: self.bccInputView.getAddrItems().join(","),
                content: self.editorView.editor.getHtmlContent(),
                subject: $.trim(self.subjectInput.val()),
                attachs: self.$el.find("#attachContainer li").length
            }
        },

		/** 编辑器聚焦 */
		setFocus:function(){
			var self = this;
			var mid = this.mid;
            if(this.editorView && this.editorView.editor && this.editorView.editor.editorWindow){
				setTimeout(function(){
					self.editorView.editor.editorWindow.focus();
					// self.parentview.scrollToEditorPos(mid, self.getEditorMaxHeight());
				},1000)
			}
		},
		
		/** 调整编辑器高度 */
		getEditorMaxHeight: function(){
            //var attachHeight = $('#attachContainer').height();
            var attachHeight = 0;
			return top.$App.getBodyHeight() + attachHeight - 290;
		},
		

		/** 定义字体滚动区域事件 */
		initFontScrollEvent:function(command){
		
			if(command === 'FontSize' && !this.FontSizeContainer){
				this.FontSizeContainer = $('div.FontSizeList');
                this.FontSizeContainer.mousewheel(function(event, delta) {
					_scrollTop($(this), event, delta);			
				});
			}
			
			if(command === 'FontFamily' && !this.FontFamilyListContainer){
				this.FontFamilyListContainer = $('div.FontFamilyList');
				this.FontFamilyListContainer.mousewheel(function(event, delta) {
					_scrollTop($(this), event, delta);
                });
			}
			
			function _scrollTop(container, event, delta){
				var _top = container.scrollTop();
				if( delta > 0){
					container.scrollTop(_top - 100);
				}else{
					container.scrollTop(_top + 100);
				}
				event.stopPropagation();
				event.preventDefault();
			}
			
		},
		
		/** 默认字体设置 */
		getDefaultFonts:function(editor){
			
			if(!editor){ return ""}
			var self = this;
			var doc = document;
			var newLineDiv = doc.createElement("div");
			var temp = '<div style="font-family: {fontFamily}; font-size: {fontSize}; color: {color}; line-height: {lineHeight};"><br><br><br><br><br><br></div>';
			var fonts = top.$User.getDefaultFont();
			var formatObj = {
			   fontFamily : fonts.family,
			   fontSize : editor.getPxSize(fonts.size),
			   color : fonts.color,
			   lineHeight : fonts.lineHeight
			};
			var html = top.$T.Utils.format(temp, formatObj);
			return html;			
		},

        /** 滚动条位置调整 */		
        memoTimeHandler:function(){
            var self = this;
			var mid = this.mid;
			
            clearTimeout(self.memoTimer);
            self.memoTimer = setTimeout(function(){
				self.parentview.scrollToEditorPos(mid, self.getEditorMaxHeight());
            },500)
        },

        /**
         * 替换行为统计
         */
        replaceFontButtonBh:function(){
            var bh = ["cov_fontbold", "cov_fontitalic", "cov_fontunderline", "cov_fontfamily", "cov_fontsize", "cov_fontcolour", "cov_fontbackground", "cov_fontitemstyle", "cov_fontnumberstyle", "cov_fontalignleft", "cov_fontaligncenter", "cov_fontalignright", "cov_fontreducetab", "cov_fontaddtab", "cov_fontlineheight" ];
            var buttons = $("#tips-covfont a");
            $.each(buttons,function(i,val){
                $(this).attr('bh',bh[i]);
            });
        },

        /**
         * 快捷回复信件数据组装
         * @param {Object} postData 传递参数
         * @param {Object} replyMessageData 传递参数
         * @param {function} callback 回调函数 
         */
        replyMessage: function (postData, replyMessageData, callback) {
            var self = this,
                thiscallback = callback,
				//add by zsx 代收邮箱快捷回复的时候，取当前代收账户作为默认值
                defaultSender = top.$User.getDefaultSender(),
                mid = this.mid,
                emptySubject = defaultSender + '的来信',
                subject = $.trim(self.$el.find("#subject").attr("title")) || emptySubject,
                thisone,
                fid = parseInt(this.dataSource.fid);
                
            if (subject.length == 0) {
                subject = this.curTab == "forward" ? "Fw:" + this.originalSubject : this.rPrefix + this.originalSubject;
            }

                
            if (fid && top.$App.getFolderType(fid) == -3) {
                thisone = top.$App.getFolderById(fid).email;
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
                defaultSender = top.$User.getDefaultSender();
            } else {
                defaultSender = findEmail;
            }
			
			var sendMailRequest = {
                    attrs: {
                        account: defaultSender,
                        to: postData.to,
                        cc: postData.cc || "",
                        bcc: postData.bcc || "",
                        showOneRcpt: 0,
                        isHtml: 1,
                        subject: subject,
                        content: '',
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
			
            if (self.composeId) {
				if(self.messageId) {
                    sendMailRequest.attrs.messageId = self.messageId;
                }
				sendMailRequest.attrs.content = postData.content + '<div id="reply139content" style="display: block;">' + (self.curTab == "forward" ? self.originalContent : self.rQuote == 1 ? self.originalContent : "") +'</div>'
                thiscallback && thiscallback(sendMailRequest);
            }
        },

        showAddressBookDialog: function(e) {
            var self = this;
            var target = e.target;
            var id = target.id;
            var inputViewId = id.slice('receiver'.length);
            var inputView = this.getInputViewById(inputViewId);
            var items = inputView.getValidationItems();
            var view = top.M2012.UI.Dialog.AddressBook.create({
                filter:"email",
                items:items,
                comefrom:"compose_addrinput"
            });
            view.on("select",function(e){
                // var richInputManager = self.model.addrInputManager;
                // richInputManager.addMailToCurrentRichInput(e.value.join(";")).focus();
                inputView.insertItem(e.value.join(";"));
            });
            view.on("cancel",function(){
                //alert("取消了");
            });
        }
    }));


    //初始化
    $(function(){
        
        //获取参数
        var match = location.href.match(/mid=([^&]+)/),
            mid,
            options,
            dataSource,
            container,
            el,
            parentview; //会话邮件的主view

        if(match && match[1]){
            mid = match[1];
            
            if(!mid){ return }
            options = top.M139.PageApplication.getTopApp().sessionCompose[mid];
            
            if(!options){ return }
          
            new M2012.ReadMail.ConversationBottomBar.Compose.View({
                el:$('body'),
                parentview:options.parentview,
                mid:mid,
                data:options.data
            }).initEvents();

            M139.core.utilCreateScriptTag(
            {
                id: "conversationrichupload",
                src: "conversationrichupload.html.pack.js",
                charset: "utf-8"
            },
            function () {
                $('#realUploadButton').click(function(){
                    $('#uploadInput').trigger("click");
                }); 
            });

        }

    });


})(jQuery, _, M139);    

