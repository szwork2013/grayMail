/*    迷你短信页    */
(function (jQuery, Backbone, _, M139) {

    var superClass = M139.View.ViewBase;
    M139.namespace("Evocation.Sms.View", superClass.extend(
    {
        popHtml: [
            '<div class="repeattips-box boxIframeMain_bg">', //height380
                '<ul class="newWrite">',
                    '<li>',
                        '<div class="clearfix">',
                            '<a id="evocation_contacts" class="newWrite_label" title="选择联系人" bh="evocation_sms_addaddr" href="javascript:;">接收人：</a>',
                            '<div class="newWrite_con">',
                                '<div id="evocationContainer" class="newWrite_input newWrite_input_first"></div>',
                            '</div>',
                        '</div>',
                    '</li>',
                '</ul>',
				'<div id="tips" class="windowPrompt" style="display:none;" hasshow="0">',
					'<span class="gray">有<strong>2</strong>',
					'位联通或电信用户，每条与本地资费相同，不计入赠送条数</span>',
					'<a id="tipsClose" href="javascript:;" title="关闭" class="i_t_close" bh="evocation_sms_tips_close"></a>',
				'</div>',
                '<div class="newWriteBox">',
                    '<div class="newWrite_content" style="height:250px;">',
                        '<textarea id="evocation_content" class="newWrite_content_scroll" style="height:250px;">短信内容</textarea>',
                    '</div>',
                '</div>',
                '<p id="evocation_sendTime" class="newWriteLimit" style="display:none"></p>',
                '<p id="evocation_sendNum" class="newWriteLimit">还可输入 <b>350</b> 字，本次将以 <b>0</b> 条计费</p>',
                '<div class="newWritePrompt">',
                    '<div id="evocation_freeSms"></div>',
                '</div>',
            '</div>',
            '<div class="boxIframeBtn height28">',
                '<div id="evocation_valid" style="display:none;" class="newWriteVerification">',
                    '<p class="red pb_5 v-visible">请输入图片验证码</p>',
                    '<input type="text" name="" class="">',
                    '<div class="newWriteVerification_img">',
                        '<img id="validImg" src="" alt="" title="">',
                        '<strong>图案显示的是什么？</strong><br>',
                        '<a href="javascript:;">看不清，换一张</a>',
                    '</div>',
                '</div>',
                '<span class="bibBtn">', //mt_70
                    '<a id="evocation_send" bh="evocation_sms_send" href="javascript:;" class="btnSetG" hidefocus="1" role="button"><span>发 送</span></a>',
                '</span>',
            '</div>'
        ].join(''),
        
        /*popHtml: 
            [ '<div class="quicksend-box">',
                 '<h3>现在，您可以通过本对话框快速发送短信啦！</h3> ',
                     '<table class="writeTable">',
                         '<tbody>',
                         '<tr>',
                             '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">',
                             ' 接收人：',
                             '</th>',
                             '<td>',
                             '<div class="p_relative" style="z-index:3;">',
                                     '<div id="evocationContainer"></div>',
                             '</div>',
                             '</td>',
                             '<td width="30">',
                             '<a href="javascript:top.addBehaviorExt({ actionId: 104579 });" id="evocation_contacts" class="quick-add"><span class="heng"></span><span class="shu"></span></a>',
                             '</td>',
                         '</tr>',
                         '<tr>',
                               '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">                          ',
                               '发送内容：',
                             '</th>',
                             '<td >',
                                 '<div style="width:366px" class="textarea-qiucksend"><textarea id="evocation_content"></textarea></div>',
                                 '<div  id="evocation_sendNum" style="width:356px; height:25px;line-height:25px;border:1px #ccc solid; border-top:none; background:#eee; padding:0 10px">还可输入 <b>350</b> 字，本次将以 <b>0</b> 条计费</div>',
                                 '<p class="pt_5" id="evocation_freeSms"></p>                           ',
                             '</td>   ',
                              '<td width="30"> &nbsp;',
                             '</td> ',
                         '</tr>',
                         '<tr style="display:none" id="evocation_valid">',
                               '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">                          ',
                               '<P class="pt_20">验证码：</P>',
                             '</th>',
                             '<td>',
                                     '<p class="red pb_5 v-visible">aa</p><!-- 没有报错时用 v-hidden 替换 v-visible -->',
                                   '<div><input class="iText" type="text" /></div>',
                                   '<div class="clearfix mt_5">',
                                       '<div class="imgtext">',
                                           '</div>',
                                       '<div class="imgtext2">',
                                           '图片中显示的图案是什么？将你认为正确答案前的 <em class="c_ff6600">字母或数字</em>',
                                           '填入框中(不分大小写)',
                                           '<br>                              ',
                                           '<a href="#">看不清，换一张</a>',
                                       '</div>',
                                   '</div>',
                             '</td> ',
                              '<td width="30"> &nbsp;',
                             '</td> ',
                         '</tr>',
                         '<tr>',
                               '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">                          ',
                               '&nbsp;',
                             '</th>',
                             '<td colspan="2">',
                                    '<p class="pb_5" style="display:none" id="evocation_sendTime"></p>  ',
                                   '<p><a class="btnTb"  id="evocation_send" href="javascript:top.addBehaviorExt({ actionId: 104578 }); " ><span>立即发送</span></a></p>',
                             '</td> ',
                         '</tr>',
                     '</tbody>',
                 '</table>',
             '</div>'].join(""),*/

        autoSaveTimer : {
            timer : null,
            interval : 120,
            subMailInfo : {content : ""}
        },
        
        initialize: function (options) {
            this.popWindow();                         //获得免费信息条数
            this.model.setLetterSendTime('短信');     //显示定时发送
            this.initEvents();                        //初始化事件
            top.BH("evocation_sms_load");
        },

        initEvents: function () {
            this.model.addContacts('mobile', 'sms');          //通信录组件接入                         //弹窗
            this.initSmsInfo();
            this.model.setcontent();     //设置预设内容
            this.setSubMailInfo(this.model.get("content"));
            this.bindSmsSend();         //邮件发送事件绑定
            this.countLimit();           //短信定数限制         
        },
        
        setSubMailInfo : function(content){
            this.autoSaveTimer['subMailInfo']['content'] = content;
        },
        
        // 比较是否有改动
       compare : function(isSetSubMailInfo){
            var self = this;
            var content = '';
            var cloneSubMailInfo = $.extend({}, self.autoSaveTimer['subMailInfo']);
            if(isSetSubMailInfo){
                self.setSubMailInfo(self.getsmsContent());
                content = self.autoSaveTimer['subMailInfo']['content'];
            }else{
                content = self.getsmsContent();
            }

            if (content === cloneSubMailInfo['content']) {
                return false;// 无改动
            }else{
                return true;// 有改动
            }    
       },

        popWindow: function () {//弹窗
            var self = this;
            top.$App.evoctionPop = top.$Msg.showHTML(this.popHtml, {
                dialogTitle: "发短信",
                width: 500,
                onBeforeClose: function(){
                    var isEdited = self.compare();
                    if (isEdited){
                        self.closeConfirm();
                    }
                    return isEdited;
                },
                onclose: function(){
                    top.BH('evocation_sms_close');
                    $(".menuPop.shadow").hide(); //隐藏联系人联想下拉框
                }
            });
        },
        
        closeConfirm: function(){
            var self = this;
            top.$Msg.confirm('还有未发送的短信，确定关闭发短信窗口？',function(){
                top.$App.evoctionPop.close();
                top.BH('evocation_sms_confirm_close');
            },function(){
                top.BH('evocation_sms_confirm_cancel');
            },{
                icon:"i_question",
                buttons:['关闭','取消']
            });
        },

        initSmsInfo: function () {//初始化剩余条数的数据
            var self = this;
            var url = "/mw2/sms/sms?func=sms:getSmsMainData&sid=" + top.$App.getSid() + "&rnd=" + Math.random();
            var param = "<object><int name='serialId'>-1</int><int name='dataType'>0</int></object>";

            M139.RichMail.API.call(url, param, function (result) {
                self.processData(result.responseData);
            });
        },

        processData: function (result) {
            if (result.code != 'S_OK'){
                return;
            }
            //var result = result.var //错误  IE6,7,8 报错
            var result = result['var'];
            var self = this;
            var freeInfo = result.freeInfo + result.limitInfo;
            var totalFree = result.totalFree;
            var userFreeCount = result.userFreeCount;
            var maxSend = result.groupLength;
            self.model.set({
                "totalFree": totalFree,
                "userFreeCount": userFreeCount,
                "groupLength": maxSend
            });
            $('#evocation_freeSms').html('温馨提示：' + freeInfo);


            var url = result.validateUrl;
            if (url) {
                self.model.set('validImg', url);
                $('#validImg').attr('src',url);
                $('#evocation_valid').show().attr("show", 'true');
                $('#evocation_send').parent().addClass('mt_70');
                $('#evocation_valid p:eq(1)').text('请输入验证码。');

                $("#evocation_valid a").click(function () {
                    $('#evocation_valid').find('img').attr("src", url + Math.random());
                    $('#evocation_valid').find('input').focus().val('');
                    return false;
                });
            }
        },

        bindSmsSend: function () {//发送邮件事件绑定
            var self = this;
            $('#evocation_send').bind('click', function () {
                /********   发送前的验证   *******/
                //  是否正在发送
                var isSending = self.model.get('smsSending');
                if (isSending) {
                    //top.$Msg.alert('短信正在发送中....'); //会去顶部提示同时出现，注释掉
                    return;
                }


                //   1. 验证收信人地址是否正确
                if (self.model.richInput.getErrorText()) {
                    //self.model.richInput.showEmptyTips("请填写正确的手机号码！");
                    $Msg.alert('一个或多个地址错误，请编辑后再试一次');
                    return;
                }

                //   2. 验证收信人地址是否为空 
                var address = self.model.richInput.getValidationItems(self.model.richInput);
                if (address.length == 0) {
                    //self.model.richInput.showEmptyTips("请填写正确的手机号码！")
                    $('#evocation_contacts').click(); //为空弹出联系人对话框
                    return;
                } else {
                    for (var i = 0; i < address.length; i++) {
                        if (address[i].length > 13) {
                            address[i] = address[i].slice(-12, -1)
                        }
                    }
                    address = address.join(',');
                }
                
                //   3. 验证短信内容是否为空
                if ($.trim($("#evocation_content").val()).length == 0) {
                    top.$Msg.alert('短信内容不能为空。');
                    return;
                }

                if ($.trim($("#evocation_content").val()).length >350) {
                    $("#evocation_content").val('');
                    top.$Msg.alert('字数超出了限制。');
                    return;
                }

                //   4. 验证码是否为空
                if ($('#evocation_valid').attr('show') && $('#evocation_valid input').val() == '') {
                    $('#evocation_valid p:eq(1)').text('请输入验证码！');
                    return;                
                }

                //*********判断赠送条数是否用完
                var userFreeCount = self.model.get('userFreeCount');
                var totalFree = self.model.get('totalFree');
                if (userFreeCount < 1 && totalFree!=0) {
                    top.$Msg.confirm(
                        "免费赠送信息已用完，超出条数将以0.1元计费，是否继续发送？",
                        function () {
                            self.sendMessage(address);  //发送信息
                        },
                        function () {
                            return;
                        },
                        { title: "温馨提示" }
                    );
                } else {
                    self.sendMessage(address);  //发送信息
                }
            })
        },

        sendMessage: function (address) {
            var self = this;
            var param = this.getSendBody(address);
            M139.RichMail.API.call("/mw2/sms/sms?func=sms:sendSms&sid=" + top.$App.getSid() + "&rnd=" + Math.random(), param, function (result) {
                self.smsCallback(result.responseData);
            });
            self.model.set('smsSending',1);
            M139.UI.TipMessage.show("短信正在发送....");            
        },

        smsCallback: function (data) {
            var self = this;

            if (data.code == "S_ERROR") {
                top.$Msg.alert(data.summary);
                M139.UI.TipMessage.hide();
                self.model.set('smsSending', 0);
                return;
            }

            if (data.code == "SMS_CONTENT_LIMIT"){
                top.$Msg.alert(data.summary);
                M139.UI.TipMessage.hide();
                self.model.set('smsSending', 0);
                return;
            }
            
            if (data.code != "S_TIMEOUT") {
                if (data.code == "S_OK") {
                    self.model.smsSuccess();
                    self.model.set('smsSending', 0);
                }else {
                    if (data["var"] && data["var"].cacheExist && data["var"].cacheExist == 1) {
                        window.location.reload();
                    }else {
                        var tips = '';
                        if (data.code == 'SMS_OVER_LIMIT') {
                            top.$Msg.alert(data.summary);
                            self.model.set('smsSending', 0);
                            return;
                        }

                        if (data.summary == '接收人输入有误，请修正！') {
                            $('#evocation_valid p:eq(1)').text('接收人输入有误，请修正！');
                            M139.UI.TipMessage.hide();
                            self.model.set('smsSending', 0);
                            return;
                        }

                        if (data.summary == "错误的图片验证码，请重试！" || /验证码/.test(data.summary) || data["var"].validateUrl.length > 1) {
                            //验证码
                            M139.UI.TipMessage.hide();
                            self.model.set('smsSending', 0);
                            var url = data["var"].validateUrl;
                            self.model.set('validImg', url);
                            $('#evocation_valid').show().find('img').attr('src', url);
                            $('#evocation_valid').show().attr("show", 'true');
                            $('#evocation_send').parent().addClass('mt_70');
                            $('#evocation_valid').find('input').focus().val('');
                            $("#evocation_valid a").click(function () {
                                if ($.trim(url).length == 0) {
                                    return;
                                }
                                $('#evocation_valid').find('img').attr("src", url + Math.random());
                                $('#evocation_valid').find('input').focus().val('');
                                return false;
                            });
                        }
                        
                        //日月封顶提示
                        if (top.SiteConfig.comboUpgrade) {
                            if (data.code == "SMS_DATE_LIMIT") {//日封顶
                                top.M139.UI.TipMessage.show("今天已达最大发送量!", { delay: 2000 });
                                return;
                            } else if (data.code == "SMS_MONTH_LIMIT") {//月封顶
                                top.M139.UI.TipMessage.show("本月已达最大发送量!", { delay: 2000 });
                                return;
                            }
                        }
                        if (data.summary == '错误的图片验证码，请重试！') {
                            $('#evocation_valid p:eq(1)').text('验证码错误，请重新输入。');
                        }

                    }
                }
            }
        },

        getSendBody: function (address) {
            var self = this;
            var data = '<object>';
            data += '<int name="doubleMsg">0</int>';
            data += '<int name="submitType">1</int>';
            data += '<string name="smsContent">' + self.getsmsContent() + '</string>';
            data += '<string name="receiverNumber">' + address + '</string>';
            data += self.getsendType();
            data += '<int name="smsType">1</int>';
            data += '<int name="serialId">-1</int>';
            data += '<int name="isShareSms">0</int>';
            data += self.getsendTime();
            data += '<string name="validImg">' + $('#evocation_valid input').val() + '</string>';
            data += '<int name="groupLength">10</int>';
            data += '</object>';
            return data;
                    
        },

        getsmsContent: function () {
            var content = $.trim($("#evocation_content").val());
            content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return content;
        },

        getsendType: function () {
            var text = $('#evocation_content').val();
            var type = 0;
            if(text.length > 70){
                type = 1;
            }
            return '<int name="sendType">' + type + '</int>'
        },

        getsendTime: function () {
            var time = this.model.get('sendTime');
            if (time) {
                return '<string name="comeFrom">3</string>' + '<string name="sendTime">' + time + '</string>'
            } else {
                return '<string name="comeFrom">104</string>' + '<string name="sendTime"></string>'
            }

        },

        countLimit: function () {
            var self = this;
            $('#evocation_content').bind('keyup', function () {
                var length = $('#evocation_content').val().length;
                if (length > 349) {
                    var thisVal = $(this).val().slice(0, 350);
                    $(this).val(thisVal);
                    length = 350;
                    top.$Msg.alert('短信内容应少于350字。');
                }
                self.model.setNumberOfSend(length);
            });

        }

    }));
  
})(jQuery, Backbone, _, M139);
