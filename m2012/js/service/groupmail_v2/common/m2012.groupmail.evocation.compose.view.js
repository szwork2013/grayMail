/*   迷你写信页   */
(function (jQuery, Backbone, _, M139) {
				function getFiletypeobj(){
					return {
						'xls'  : 'xls.png',
						'xlsx'  : 'xls.png',
						'doc'  : 'word.png',
						'docx' : 'word.png',
						'jpeg' : 'jpg.png',
						'jpg'  : 'jpg.png',
						'rar'  : 'zip.png',
						'zip'  : 'zip.png',
						'7z'   : 'zip.png',
						'txt'  : 'txt.png',
						'rtf'  : 'txt.png',
						'ppt'  : 'ppt.png',
						'pptx'  : 'ppt.png',
						'xml'  : 'xml.png',
						'wmv'  : 'wmv.png',
						'wma'  : 'wma.png',
						'wav'  : 'wav.png',
						'vsd'  : 'vsd.png',
						'vob'  : 'vob.png',
						'fla'  : 'swf.png',
						'swf'  : 'swf.png',
						'flv'  : 'swf.png',
						'sis'  : 'sis.png',
						'rm'   : 'rm.png',
						'rmvb' : 'rm.png',
						'psd'  : 'psd.png',
						'ppt'  : 'ppt.png',
						'png'  : 'png.png',
						'pdf'  : 'pdf.png',
						'mpg'  : 'mpg.png', 
						'mp4'  : 'mp3.png',
						'mpeg' : 'mp3.png',
						'mpg'  : 'mp3.png',
						'mp3'  : 'mp3.png',
						'java' : 'java.png',
						'iso'  : 'iso.png',
						'htm'  : 'html.png',
						'html' : 'html.png', 
						'asp'  : 'html.png',
						'jsp'  : 'html.png',
						'aspx' : 'html.png',
						'gif'  : 'gif.png', 
						'exe'  : 'exe.png', 
						'css'  : 'css.png',
						'chm'  : 'chm.png',
						'cab'  : 'cab.png',
						'bmp'  : 'bmp.png',
						'avi'  : 'ai.png',
						'asf'  : 'asf.png'
					};
				}
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.GroupMail.View.Evocation", superClass.extend(
    {
        popHtml:
        ['<div class="repeattips-box boxIframeMain_bg">',
             '<ul class="newWrite">',
                 '<li class="clearfix">',
                    '<a id="evocation_contacts" class="newWrite_label" title="选择联系人" bh="evocation_compose_addaddr" href="javascript:;">收件人：</a>',
                    '<div class="newWrite_con">',
                         '<div class="newWrite_input newWrite_input_first" id="evocationContainer"></div>',
                    '</div>',
                 '</li>',
                 '<li class="clearfix">',
                    '<span class="newWrite_label">主&nbsp;&nbsp;&nbsp;题：</span>',
                    '<div class="newWrite_con">',
                        '<div class="newWrite_input newWrite_input_first">',
                            '<input id="evocation_title" type="text" maxlength="200" style="outline:none" class="newWriteText" value="">',
                         '</div>',
                    '</div>',
                 '</li>',
                 '<li style="display:none;" id="evocation_sendTo">',
                     '<div class="clearfix">',
                         '<span class="newWrite_label gray">发送至：</span>',
                         '<div class="newWrite_con">',
                             '<div style="height: auto;overflow: hidden;" class="newWrite_input_first clearfix newWrite_con_scroll">',
                                 '<div class="newWrite_input">',
                                     '<span style="display:inline-block;margin-top: 7px; *margin-top:8px;" class="gray" readonly="true"></span>',
                                 '</div>',
                             '</div>',
                         '</div>',
                     '</div>',
                 '</li>',
             '</ul>',
             '<div class="newWriteBox">',
                 '<div class="newWrite_content" style="height:250px;" id="evocation_content"></div>',
             '</div>',
         '</div>',
         '<p class="pb_5" style="display:none" id="evocation_sendTime"></p>',
        '<div class="boxIframeBtn height28 boxIframeBtn_por">',
            '<div id="evocation_mask" style="left:0;width:100%;position:absolute; top:0; height:40px; z-index:1000;display: none;" class="blackbanner"></div>',
            '<div class="tips evocationEidtBar" id="evocationEidtBar" style="left:0; top:-35px; display:none;">',
                '<div class="tips-text clearfix"></div>',
                '<div class="tipsBottom diamond" style="left:16px; bottom:-12px;"></div>',
            '</div>',
            '<span class="delmailTipsBtntext" id="evocationSpan" style="display:none;">',
                '<a id="evocationFont" class="edit-btn" href="javascript:;" bh="group_mail_write_pop_icon_click" title="编辑样式">', //选中时加上edit-btn-on
                    '<span class="edit-btn-rc"><b class="ico-edit ico-edit-qfont">编辑样式</b></span>',
                '</a>',
            '</span>',
            '<span class="bibBtn">',
            '<a id="evocation_send" href="javascript:;" class="btnSetG" hidefocus="1" role="button">',
            '<span>发 送</span></a>',
            '</span>',
        '</div>'].join(""),
        
        autoSaveTimer : {
            timer : null,
            interval : 120,
            subMailInfo : {
                content : "",// 编辑器内容
                subject : ""// 主题
            }
        },
        actionTypes : {
            CONTINUE : "continue",// 继续编辑 
            AUTOSAVE : "autosave",// 自动保存
            SAVE : "save",//存原稿并继续编辑
            DELIVER : "deliver"//立即发送邮件
        },
        
        initialize: function (option) {
            var items = option || {};
            this.model = new Evocation.Main.Model();
            this.model.set(items);
            this.popWindow();
            // 新增加,flag为groupmail,则特殊处理下
            /************************新增加,处理群邮件的逻辑(start)********************************/
            this.isGroupMail = (this.model.get("flag") == "groupMail");
            if (this.isGroupMail) {
                this.handlerGroupMail();
            }
            /************************处理群邮件的逻辑(end)********************************/

            //this.initEvents();     //初始化事件
        },
        // 专门针对flag为groupmail的特殊处理
        handlerGroupMail : function () {
            this.initGroupMailEvent();
            this.isSendUseable(false); // 按钮置灰
            this.bindFontEvent();
            this.setContent();   // 设置预设内容
        },
        initGroupMailEvent : function() {
            var self = this,
                isGroupCallback = this.model.get("callback"); // 群邮件处理时需要调用的接口
            $('#evocation_send').bind('click', function () {
                if (!self.model.get("notEmptyContent")) {
                    return;// 如果输入内容为空,则不执行
                }

                top.BH('group_mail_write_pop_send_click');
                // 先显示遮罩层
                $("#evocation_mask").show();
                // 如果有回调函数,则执行
                _.isFunction(isGroupCallback) && isGroupCallback({
                    "content" : self.getContent(), // 文本内容, 包含样式在内
                    "contentThum" : self.getGroupMailContent().substring(0, 200), // 截取之后的纯文本内容,过滤样式之后的
                    "success" : function() {
                        // 调用成功,则关闭窗口
                        currentEvoctionPop.close();
                    },
                    "fail" : function () {
                        // 接口调用异常需要调用的函数,显示遮罩层
                        $("#evocation_mask").hide();
                    }
                });
            });

            self.on("changeGroupMailContent", function(content) {
                // 绑定事件,当输入框中的内容改变时触发
                var reg =/(<\/?div[^>]?>)|(<br[\s|\/]*>)|(<\/?p[^>]?>)/ig,// 匹配<div>,</div>,<br>,<br/><p>等标签的正则表达式,IE11中必须匹配p元素
                    con = $T.Html.decode(content), // 解码之后的输入内容
                    notEmptyContent = !!con.replace(reg, "").trim();  // 如果notEmptyContent我true,表示内容不为空
                self.isSendUseable(notEmptyContent);
                self.model.set("notEmptyContent", notEmptyContent); // 保存值
            });

            self.model.on("change:hasSpecify", function() {
                var specify = self.model.get("hasSpecify"),
                    $evocation_contacts = $("#evocation_sendTo");
                $evocation_contacts.closest("ul").children().hide(); // 默认全部隐藏
                // 如果specify存在,则表示需要展示"发送至"的元素
                if (specify) {
                    $evocation_contacts.show(); // 指定了发送人,则表示要显示"发送至"
                    $evocation_contacts.closest("li").find(".newWrite_input span").text(specify); // 发送至填充值
                }else{
                    currentEvoctionPop && currentEvoctionPop.$el.find(".boxIframeBtn").hide(); // 隐藏按钮组
                }
            });

            self.on("loadGroupMailCss", function (doc) { // 阅读群邮件详情时需要用到
                var loadCssFn = self.model.get("loadCss"); // 如果创建弹窗配置有loadCss,表示需要加载样式
                _.isFunction(loadCssFn) && loadCssFn(doc);
            });

            self.model.set("hasSpecify", self.model.get("specify"));
        },
        // 发送按钮是否置灰
        isSendUseable : function (bool) {
            var evocation_send_element = $('#evocation_send');
            if (bool) {
                if (!evocation_send_element.hasClass("btnSetG")) {
                    evocation_send_element.addClass("btnSetG").removeClass("btnBan");
                }
            }else {
                if (!evocation_send_element.hasClass("btnBan")) {
                    evocation_send_element.addClass("btnBan").removeClass("btnSetG");
                }
            }
        },
        initEvents: function () {
            this.model.setLetterSendTime('邮件');
            this.setTitle();     //设置预设内容
            this.setContent();   //设置预设内容
            this.bindFontEvent();
            this.letterSend();   //邮件发送事件绑定
            //this.addContacts();  //通信录组件接入
        },

        setSubMailInfo : function(content, subject){
            this.autoSaveTimer['subMailInfo']['content'] = content;
            this.autoSaveTimer['subMailInfo']['subject'] = subject;
        },
        //创建自动存草稿定时器
        createAutoSaveTimer : function(){
            var self = this;
            self.autoSaveTimer['timer'] = setInterval(function(){
                var isEdited = self.compare(true);
                if (!isEdited) {
                    return;
                } else {
                    self.sendMail(self.actionTypes['AUTOSAVE']);
                }
            }, self.autoSaveTimer['interval'] * 1000);
       },
       // 比较是否有改动
       compare : function(isSetSubMailInfo){
            var isEidt = this.model.get('isEdit');
            if(!isEidt) return false;  //不可编辑状态直接返回

            var self = this;
            var content = '', subject = '';
            var cloneSubMailInfo = $.extend({}, self.autoSaveTimer['subMailInfo']);
            if(isSetSubMailInfo){
                self.setSubMailInfo(self.getContent(), self.getTitle());
                content = self.autoSaveTimer['subMailInfo']['content'];
                subject = self.autoSaveTimer['subMailInfo']['subject'];
            }else{
                content = self.getContent();
                subject = self.getTitle();
            }

            if (content === cloneSubMailInfo['content'] && subject == cloneSubMailInfo['subject']) {
                return false;// 无改动
            }else{
                return true;// 有改动
            }
       },

        /*******    写信页--添加通信录           *********/
        addContacts: function () {
            var self = this;
            var maxSend = top.$User.getMaxSend();
            var type = "email";
            var option = {
                container: document.getElementById('evocationContainer'),
                maxSend: maxSend,
                preventAssociate: true,
                type: type,
                highlight:false,
                border:'1px #fff solid',
                heightLime:120
            };
            M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/richinput.html.pack.js", charset: "utf-8" }, function () {
                self.richInput = M2012.UI.RichInput.create(option);
                self.richInput.render();
                var receiver = self.model.getReiceiver(type);  //model层返回收件人字符串,
                self.richInput.insertItem(receiver);

                /*******    通信录组件绑定  *********/
                $('#evocation_contacts').bind('click', function () {
                    var items = self.richInput.getValidationItems(self.richInput);
                    var view = top.M2012.UI.Dialog.AddressBook.create({
                        filter: type,
                        items: items
                    });
                    view.on("select", function (e) {
                        self.richInput.insertItem(e.value.join(";"));
                    });
                });
            });
        },

        /*******    写信页--设置标题           *********/
        setTitle: function () {
            var title = this.model.get('subject') || "";
            if (title) {
                $('#evocation_title').val(title).removeClass('gray');
            } else {
                $('#evocation_title').one("click" , function () {
                    $(this).val('').removeClass('gray');
                });
            }
        },
        /*******    写信页--设置内容           *********/
        setContent: function () {
			var self = this;
            var isEdit = this.model.get('isEdit');
            var content = this.model.get('content');
			var diskContent = this.model.get("diskContent");
			var whereFrom = this.model.get("whereFrom");
			var diskContentJSON = this.model.get("diskContentJSON");
			var fileContentJSON = this.model.get("fileContentJSON");
			var attachContentJSON = this.model.get("attachContentJSON");
			if(whereFrom == "disk" && diskContent){
				this.newWrite = currentEvoctionPop.$el.find("ul.newWrite");
				this.newWrite.after("<ul class='newWrite insertUL' style='height:auto !important; height:118px; max-height:118px; overflow-y: auto;position: relative;'>" +diskContent+ "</ul>");
                currentEvoctionPop.$el.find("ul.newWrite").find("a[removeLargeAttach]").click(function(){
					var pLi = $(this).closest("li");
					var objId = pLi.attr("objId");
					pLi.hide();
					for(var i = 0; i < diskContentJSON.length; i++){
						if(diskContentJSON[i].id === objId){
							diskContentJSON.splice(i,1);
						}
					}

				});
			}
			if(whereFrom == "file" && diskContent){
				this.newWrite = currentEvoctionPop.$el.find("ul.newWrite");
				this.newWrite.after("<ul class='newWrite' style='height:auto !important; height:118px; max-height:118px; overflow-y: auto;position: relative;'>" +diskContent+ "</ul>");
				this.getFileContent();
                currentEvoctionPop.$el.find("ul.newWrite").find("a[removeLargeAttach]").click(function(){
			//	debugger;
					var pLi = $(this).closest("li");
					var objId = pLi.attr("objId");
					pLi.hide();
					for(var i = 0; i < fileContentJSON.length; i++){
						if(fileContentJSON[i].fid === objId){
							fileContentJSON.splice(i,1);
						}
					}

					self.getFileContent();
				});
			}
			if(whereFrom == "attach" && diskContent){
				this.newWrite = currentEvoctionPop.$el.find("ul.newWrite");
				this.newWrite.after("<ul class='newWrite' style='height:auto !important; height:118px; max-height:118px; overflow-y: auto;position: relative;'>" +diskContent+ "</ul>");
                currentEvoctionPop.$el.find("ul.newWrite").find("a[removeLargeAttach]").click(function(){
			//		debugger;
					var pLi = $(this).closest("li");
					var objId = pLi.attr("objId");
					var composeId = self.model.get("attachmentsid");
					var requestXml = {
						targetServer:1,
						composeId: composeId,
						items: [objId]
					};
					top.$RM.call("upload:deleteTasks", requestXml, function (result) {

					});
					pLi.hide();
					for(var i = 0; i < attachContentJSON.length; i++){
						if(attachContentJSON[i].fileId === objId){
							attachContentJSON.splice(i,1);
						}
					}

				});
			}
            var showZoomIn = this.model.get('showZoomIn');
            var height = showZoomIn ? '321px' : '250px';
            if (isEdit) {
                content = $T.Html.decode(content);
                this.editor = currentEvoctionPop.$el.find("#evocation_content");
                this.editorView = M2012.UI.HTMLEditor.create({
                    contaier: this.editor,
                    blankUrl: "/m2012/html/editor_blank.htm",
                    userDefinedToolBarContainer: 'div.evocationEidtBar .tips-text',
                    editorBtnMenuDirection: 'up',
                    showButton: ['Bold','FontFamily','FontSize','FontColor','Italic','UnderLine']
                });

                this.editor.height(height);
                this.editor.find(".eidt-body").css({"height": height,'padding':0,'border':0});
                this.editor.find("iframe").css({"height": height});
                this.editor.find("iframe").load(function () {
                     // iframe加载完成之后,触发加载css文件的方法
                     // 只会在群邮件中查看详情时触发,不会影响别的功能
                     self.trigger("loadGroupMailCss", this.contentWindow.document);
                });

                this.editorView.editor.setHtmlContent(content);
                this.editorView.editor.on("keyup keydown",function() {
                    self.trigger("changeGroupMailContent", self.getContent());
                });

                this.editorView.editor.focus();
                this.replaceFontButtonBh();

                //$('#evocationSpan').show(); // 群邮件新需求, 先隐藏改变字体大小的按钮
                this.setSubMailInfo(content, this.getTitle());
            } else {
                $('#evocation_content').height(height).append(content);
            }
        },

        /**
         * 替换行为统计
         */
        replaceFontButtonBh: function(){
            var bh = ["group_mail_write_pop_bold_click", "group_mail_write_pop_font_family_click", "group_mail_write_pop_font_size_click", "group_mail_write_pop_font_color_click", "group_mail_write_pop_italic_click", "group_mail_write_pop_underline_click"];
            var buttons = $("#evocationEidtBar a");
            $.each(buttons,function(i,val){
                $(this).attr('bh',bh[i]);
            });
        },

        bindFontEvent: function(){
            $('#evocationFont').bind('click', function () {
                $('#evocationEidtBar').toggle();
                if($(this).hasClass('edit-btn-on')){
                    $(this).removeClass('edit-btn-on');
                }else{
                    $(this).addClass('edit-btn-on');
                }
            });
        },

        // 弹出写信窗口
        popWindow:function(){
            var self = this;

            // top.$Msg 替代 window.$Msg, 不然找不到元素啊
            currentEvoctionPop = top.$Msg.showHTML(this.popHtml,
            {
                dialogTitle: self.model.get("dialogTitle") || "新邮件",
                width: 500,
                //height: 400,
                showZoomSize: self.model.get('showZoomSize'), //是否显示缩放按钮
                zoomInSize: {width:300, height:72}, //放大比率
                showZoomIn: self.model.get('showZoomIn'), //是否默认放大
                onBeforeClose: function(e){
                    var isEdited = self.compare();
                    if (isEdited){
                        if (self.isGroupMail) {
                            if (self.model.get("hasSpecify") && self.model.get("notEmptyContent")) {
                                // 有发送指定人,并且内容不为空,才需要在关闭之前验证
                                self.closeGroupMailConfirm();
                            }else{
                                // 否则直接关闭,不提示
                                currentEvoctionPop.close();
                            }
                        }else{
                            //self.closeConfirm();
                        }
                    }
                    return isEdited;
                },
                onClose: function(){
                    // 关闭时记录操作日志
                    if (self.model.get("hasSpecify")) {
                        // 回复,写信关闭时的操作日志
                        top.BH('group_mail_write_pop_close_click');
                    }else{
                        // 查看引文时关闭时的操作日志
                        top.BH('group_mail_quote_pop_close_click');
                    }
                },
                onZoom: function(handle){
                    if(handle == 'zoomIn') {  //放大操作
                        $('#evocation_content').height(321);
                        if(self.editor) {
                            self.editor.find(".eidt-body").css({"height": "321px"});
                            self.editor.find("iframe").css({"height": "321px"});
                        }
                        top.BH('evocation_compose_zoomin');
                    }else{  //缩小操作
                        $('#evocation_content').height(250);
                        if(self.editor) {
                            self.editor.find(".eidt-body").css({"height": "250px"});
                            self.editor.find("iframe").css({"height": "250px"});
                        }
                        top.BH('evocation_compose_zoomout');
                    }
                }
            });
        },
        
        closeConfirm: function(){
            var self = this;
            top.$Msg.confirm('关闭后，已修改的内容会保存到草稿,确认关闭吗？',function(){
                self.sendMail('save');
                top.BH('evocation_compose_savedrafts_close');
                currentEvoctionPop.close();
            },function(){
                top.BH('evocation_compose_savedrafts_closeunsave');
                currentEvoctionPop.close();
            },function(){
                top.BH('evocation_compose_savedrafts_cancel');
            },{
                icon:"i_question",
                buttons:['关闭','关闭不保存草稿','取消']
            });
        },
        /*** 关闭群邮件弹窗之前的处理逻辑 **/
        closeGroupMailConfirm : function () {
            top.$Msg.confirm('关闭后输入的内容将不会保存，确认关闭吗？',function(){
                //todo 记录操作日志
                currentEvoctionPop.close();
                top.BH('group_mail_write_pop_tips_close_click');
            },function(){
                //todo 记录操作日志
                top.BH('group_mail_write_pop_tips_cancel_click');
            },{
                icon:"i_question",
                buttons:['关闭','取消']
            });
        },
        /*******    写信页--发送邮件事件绑定  *********/
        letterSend: function () {
            var self = this;
            $('#evocation_send').bind('click', function () {
                if (self.richInput.getErrorText()) {
                    //self.richInput.showEmptyTips("请正确填写收件人的邮箱地址");
                    //弹窗提示
                    $Msg.alert('一个或多个地址错误，请编辑后再试一次。');
                    return;
                }
                
                var address = self.richInput.getValidationItems(self.model.richInput);
                if (address.length == 0) {
                    //self.richInput.showEmptyTips("请填写收件人");
                    //弹出联系人组建
                    $('#evocation_contacts').click();
                    return;
                }
                self.sendMail();
            })
        },
        
        sendMail: function(action){
            var self = this;
            var address = self.richInput.getValidationItems(self.model.richInput);
            address = address.join(',');
            var mailInfo = {
                email: address,
                content: self.getContent(),
                subject: self.getTitle(),
                mid:self.mid || "" ,
                action: action ? action : 'deliver', //autosave save
                showOneRcpt: 0,
                scheduleDate: self.model.get('sendTime'),
                callback: function(result){
                    if (result && result.responseData && result.responseData.code == "S_OK") {
                        if(action == 'autosave'){ //自动保存草稿成功
                            var now = new Date();
                            var msg = $T.Utils.format('{0}点{1}分自动保存草稿成功', [now.getHours(), now.getMinutes()]);
                            top.M139.UI.TipMessage.show(msg, {delay : 1000});
                            self.mid = result.responseData['var'];
                        }else if(action == 'save'){
                            var now = new Date();
                            var msg = $T.Utils.format('{0}点{1}分保存草稿成功', [now.getHours(), now.getMinutes()]);
                            top.M139.UI.TipMessage.show(msg, {delay : 1000});
                        }else{
                            self.model.letterSuccess();
                        }
                    }
                }
            }
			if(this.model.get("attachContentJSON") && this.model.get("attachContentJSON").length > 0){
				mailInfo["attachments"]= this.model.get("attachContentJSON");
				mailInfo["id"]= this.model.get("attachmentsid");
			}
            /*if(action != self.actionTypes['AUTOSAVE']){
                clearInterval(self.autoSaveTimer['timer']);
            }*/
            top.$PUtils.sendMail(mailInfo);
        },

        /*******    写信页--弹窗           *********/
        getTitle: function () {            
            if ($('#evocation_title').hasClass('gray')) {
                return "来自" + $User.getDefaultSender() + "的邮件"
            } else {
                return $('#evocation_title').val();
            }
        },
        getDiskContent : function(){
				var htmlNewTemplate = ['<table id="attachAndDisk" style="margin-top:25px; border-collapse:collapse; table-layout:fixed; width:95%; font-size: 12px; line-height:18px; font-family:\'Microsoft YaHei\',Verdana,\'Simsun\';">',
					'<thead>',
						'<tr>',
							'<th style="background-color:#e8e8e8; height:30px; padding:0 11px; text-align:left;"><img src="{resourcePath}attachmentIcon.png" alt="" title="" style="vertical-align:middle; margin-right:6px; border:0;" />来自139邮箱的文件</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<td style="border:1px solid #e8e8e8;">',
								'{itemHtml}',
							'</td>',
						'</tr>',
						'<tr>',
							'<td style="border:1px solid #e8e8e8;">',
								'{itemHtml2}',
							'</td>',
						'</tr>',
					'</tbody>',
				 '</table>'].join("");
				 var tableContainer = ['<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="diskItem">',
											'<thead>',
												'<tr><td style="height:10px;"></td></tr>',
												'<tr>',
													'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-彩云网盘</strong></th>',
												'</tr>',
											'</thead>',
											'<tbody>',
												'{trs}',
											'</tbody>',
										'</table>'].join("");
				var itemHtmlNew = ['<tr><td style="padding-left:30px; height:40px;">',
														'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
															'<tr class="cts" dataString="{dataString}">',
																'<td width="42"><span class="dataString" style="display:none;">{dataString}</span>',
																'<img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
																'<td style="line-height:18px;">',
																	'<span>{fileName}<span class="gray"></span></span>',
																	'<span style="color:#999; margin-left:5px;">({fileSize})</span><span class="gray ml_5"></span>',
																	'<p style="padding:0; margin:0;"><span style="{display}">提取码：{tiquma}</span><a href="{linkUrl}">查看</a></p>',
																'</td>',
															'</tr>',
														'</table>',
											'</td>',
									'</tr>',
									'<tr><td style="height:10px;"></td></tr>'].join("");
				var midHtml = [];
				var diskContentJSON = this.model.get("diskContentJSON");
				var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
				var filetypeobj = getFiletypeobj();
				for (var i = 0; i < diskContentJSON.length; i++) {
					var f = diskContentJSON[i];
					f.fileName = f.name;
					f.fileSize = f.file.fileSize;
					f.fileId = f.id;
					var fileType = '', extName = f.name.match(/.\w+$/);
					if(extName){
						fileType = extName[0].replace('.','');
					}
					var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');
					midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
						fileIconSrc : fileIconSrc,
						fileName : f.name,
						fileSize : M139.Text.Utils.getFileSizeText(f.file.fileSize),
						exp : f.file.exp,
						linkUrl : f.linkUrl,
						display : f.passwd ? "" : "display:none;",
						tiquma : f.passwd ? f.passwd : "",
						dataString : M139.JSON.stringify(f)
					}));

				}
				var tableContainers = top.M139.Text.Utils.format(tableContainer,{trs : midHtml.join('')});
				var htmlNewTemplates = top.M139.Text.Utils.format(htmlNewTemplate,{itemHtml2 : tableContainers, resourcePath : resourcePath});
				return htmlNewTemplates;
				
		},
				// 获取大附件下载地址时需拼装xml格式的请求参数
		getXmlStr : function(files){
			var requestXml = '';
		    requestXml += "<![CDATA[";
		    requestXml += '<Request>';
		    var quickItems = [];
		    var netDiskXML = "";
		    for (var i = 0; i < files.length; i++) {
		        var file = files[i];
				quickItems.push(file.fid)
		    }
		    if(quickItems.length > 0){
		    	requestXml += "<Fileid>" + quickItems.join(",") + "</Fileid>";
		    }

		    requestXml += '</Request>';
		    requestXml += "]]>";
		    return requestXml;
		},
	   // 获取大附件下载地址
		mailFileSend : function(files, callback){
			//过滤掉彩云网盘的文件
			files = files || [];
			var xmlStr = this.getXmlStr(files);
			var data = {
        		xmlStr : xmlStr
        	}
    		top.M139.RichMail.API.call("file:mailFileSend", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
		},
		getFileContent : function(){
			var self = this;
				var htmlNewTemplate = ['<table id="attachAndDisk" style="margin-top:25px; border-collapse:collapse; table-layout:fixed; width:95%; font-size: 12px; line-height:18px; font-family:\'Microsoft YaHei\',Verdana,\'Simsun\';">',
					'<thead>',
						'<tr>',
							'<th style="background-color:#e8e8e8; height:30px; padding:0 11px; text-align:left;"><img src="{resourcePath}attachmentIcon.png" alt="" title="" style="vertical-align:middle; margin-right:6px; border:0;" />来自139邮箱的文件</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<td style="border:1px solid #e8e8e8;">',
								'{itemHtml}',
							'</td>',
						'</tr>',
						'<tr>',
							'<td style="border:1px solid #e8e8e8;">',
								'{itemHtml2}',
							'</td>',
						'</tr>',
					'</tbody>',
				 '</table>'].join("");
				 var tableContainer = ['<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="attachItem">',
								'<thead>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>',
									'<tr>',
										'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-超大附件</strong><a href="{downloadUrl}" style="font-weight:normal;">进入提取中心下载</a></th>',
									'</tr>',
								'</thead>',
								'<tbody>',
								'{trs}',
								'</tbody>',
						'</table>'].join("");
					var itemHtmlNew = ['<tr>',
										'<td style="padding-left:30px; height:40px;">',
											'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
												'<tr class="cts">',
													'<td width="42"><img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
													'<td style="line-height:18px;">',
														'<span>{fileName}<span class="gray"></span></span>',
														'<span style="color:#999; margin-left:5px;">({fileSize})</span><span style="color:#999; margin-left:5px;">({exp}天后过期)</span>',
													'</td>',
												'</tr>',
											'</table>',
										'</td>',
									'</tr>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>'].join("");
				var midHtml = [];
				var fileContentJSON = this.model.get("fileContentJSON");
				this.mailFileSend(fileContentJSON, function(res){
					var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
					var filetypeobj = getFiletypeobj();
					if(res.responseData.code === "S_OK"){
						var data = res.responseData["var"];
						var mailfileList = data.fileList;
						for (var i = 0; i < mailfileList.length; i++) {
							var f = mailfileList[i];
							var fileType = '', extName = f.fileName.match(/.\w+$/);
							if(extName){
								fileType = extName[0].replace('.','');
							}
							var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');

							midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
								fileIconSrc : fileIconSrc,
								fileName : f.fileName,
								fileSize : f.fileSize,
								exp : $Date.getDaysPass(new Date(),new Date(f.exp))
							}));

						}
						var tableContainers = top.M139.Text.Utils.format(tableContainer,{trs : midHtml.join(''), downloadUrl : mailfileList[0].url});
						var htmlNewTemplates = top.M139.Text.Utils.format(htmlNewTemplate,{itemHtml : tableContainers , resourcePath : resourcePath});
						self.htmlNewTemplates = htmlNewTemplates;
					}else{
						console.log("Fail");
					}
				});
		},
        /*******    写信页--获取邮件内容  *********/
        getContent: function () {
            var isEidt = this.model.get('isEdit');
            var content = isEidt ? this.editorView.editor.getHtmlContent() : $('#evocation_content').html();
			if(this.model.get("diskContentJSON").length > 0){
				content+= this.getDiskContent();
			}
			if(this.model.get("fileContentJSON").length > 0){
				content+= this.htmlNewTemplates;
			}

            return content;
        },
        // 获取群邮件(包括发送和回复)中的纯文本内容,不包括样式
        getGroupMailContent : function () {
            var isEidt = this.model.get('isEdit');

            return isEidt ? this.editorView.editor.getHtmlToTextContent().replace(/\r|\n/gi, ' ') : $('#evocation_content').html();
        }
    }));
  
})(jQuery,Backbone,_,M139);