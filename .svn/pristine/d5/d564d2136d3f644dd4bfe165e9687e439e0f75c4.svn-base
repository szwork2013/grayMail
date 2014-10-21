
(function (jQuery, Backbone, _, M139) {

    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("Evocation.Mms.View", superClass.extend(
    {
        popHtml: [
            '<div class="repeattips-box boxIframeMain_bg clearfix">',
                '<div class="newWrite_pic">',
                    '<div id="evocation_mmsImage"></div>',
                    '<a id="evocation_changeImage" href="javascript:;">换一张彩信</a>',
                '</div>',
                '<div class="newWrite_right">',
                    '<ul class="newWrite">',
                        '<li class="clearfix">',
                            '<a id="evocation_contacts" class="newWrite_label" title="选择联系人" bh="evocation_mms_addaddr" hidefocus="1" href="javascript:;">接收人：</a>',
                            '<div class="newWrite_con">',
                                '<div id="evocationContainer" class="newWrite_input newWrite_input_first"></div>',
                            '</div>',
                        '</li>',
                    '</ul>',
                    '<div class="newWriteBox">',
                        '<div class="newWrite_content" style="height:122px;">',
                            '<textarea id="evocation_content" class="newWrite_content_scroll" style="height:122px;">祝福附言</textarea>',
                        '</div>',
                    '</div>',
                    '<p id="evocation_sendNum" class="newWriteLimit">还可输入 <b>10000</b> 字</p>',
                    '<div class="newWritePrompt">',
                        '<p id="evocation_freeMms"></p>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="boxIframeBtn height28">',
                '<div id="evocation_valid" class="newWriteVerification" style="display:none;">',
                    '<p class="red pb_5 v-visible">请输入图片验证码</p>',
                    '<input type="text" name="" class="">',
                    '<div class="newWriteVerification_img">',
                        '<img id="validImg" src="" alt="" title="">',
                        '<strong>图案显示的是什么？</strong><br>',
                        '<a href="javascript:;">看不清，换一张</a>',
                    '</div>',
                '</div>',
                '<span class="bibBtn">', //mt_70
                    '<a id="evocation_send" bh="evocation_mms_send" href="javascript:;" class="btnSetG" hidefocus="1" role="button"><span>发 送</span></a>',
                '</span>',
            '</div>'
        ].join(''),
        
        /*popHtml: ['<div class="quicksend-box">',
                 '<h3>现在，您可以通过本对话框快速发送彩信啦！</h3> ',
             '<table class="writeTable">',
                 '<tbody>',
                     '<tr>',
                         '<th scope="row"  width="65" style="padding-right:5px;" class="ta_r" valign="top">',
                                '接收人：',
                         '</th>',
                         '<td>',
                             '<div class="p_relative" style="z-index:3;">',
                                 '<div id="evocationContainer">',
                                 '</div>',
                             '</div>',
                         '</td>',
                         '<td width="30">',
                             '<a href="javascript:top.addBehaviorExt({ actionId: 104586  });" id="evocation_contacts" class="quick-add"><span class="heng"></span><span class="shu"></span></a>',
                         '</td>',
                     '</tr>',
                     '<tr>',
                           '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">',
                           '发送内容：',
                         '</th>',
                         '<td >',
                             '<div class="qiucklr clearfix" style="width:378px">',
                                 '<div class="qiucklr-left" style="width:180px" id="evocation_mmsImage"></div>',
                                 '<div class="qiucklr-right"style="width:188px">',
                                     '<div class="textarea-qiucksend"><textarea style="height:182px" id="evocation_content">祝福附言</textarea></div>',
                                 '<div id="evocation_sendNum" style="height:25px;line-height:25px;border:1px #ccc solid; border-top:none; background:#eee; padding:0 10px">还可输入 <b></b> 字</div>',
                                 '</div>',
                             '</div>',
                            '<p class="pt_5"><a id="evocation_changeImage" href="javascript:void(0)">换一张彩信</a></p>',
                             '<p class="pb_5" id="evocation_freeMms"></p>',
                         '</td>   ',
                          '<td width="30"> &nbsp;',
                         '</td> ',
                     '</tr>  ',
                     '<tr style="display:none" id="evocation_valid">',
                           '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">',
                           '<P class="pt_20">验证码：</P>',
                         '</th>',
                         '<td>',
                                 '<p class="red pb_5 v-visible"></p><!-- 没有报错时用 v-hidden 替换 v-visible -->',
                               '<div><input class="iText" type="text" /></div>',
                               '<div class="clearfix mt_5">',
                                   '<div class="imgtext"></div>',
                                   '<div class="imgtext2">',
                                       '图片中显示的图案是什么？将你认为正确答案前的 <em class="c_ff6600">字母或数字</em>',
                                       '填入框中(不分大小写)',
                                       '<br>',
                                       '<a href="#">看不清，换一张</a>',
                                   '</div>',
                               '</div>',
                         '</td> ',
                          '<td width="30"> &nbsp;',
                         '</td> ',
                     '</tr>                ',
                     '<tr>',
                           '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">                          ',
                           '&nbsp;',
                         '</th>',
                         '<td colspan="2">',
                              '<p class="pb_5" style="display:none" id="evocation_sendTime"></p>',
                               '<p><a class="btnTb" id="evocation_send" href="javascript:top.addBehaviorExt({ actionId: 104585 });"><span>立即发送</span></a></p>',
                         '</td> ',
                     '</tr>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),*/

        mmsStore: [
            { 
                title:'世界杯-健康熬夜小贴士', 
                frame:0, 
                contentType:1, 
                contentName:'%u4E16%u754C%u676F-%u5065%u5EB7%u71AC%u591C%u5C0F%u8D34%u58EB.gif', 
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2014-6-30/33154bfc-1132-4a0e-93df-47a683ed12d4.gif', 
                content:'', 
                contentSize:24054, 
                playTime:4, 
                width:176, 
                height:220, 
                round:0, 
                zoom:0 
            }, 
            {
                title:'狂欢吧年会',
                frame:0,
                contentType:1,
                contentName:'%u72C2%u6B22%u5427%u5E74%u4F1A.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-12-31/db0a3b98-3523-4c37-b853-0eb46ced3a8c.gif',
                content:'',
                contentSize:75336,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {
                title: '2013年度网络红人',
                frame: 0,
                contentType: 1,
                contentName: '2013%u5E74%u5EA6%u7F51%u7EDC%u7EA2%u4EBA.gif',
                contentPath: 'http://g2.mail.10086.cn/mmsstorage///2013-11-29/4e1d5b7b-455b-4651-b6fc-62b9d916c5f2.gif',
                content: '',
                contentSize: 81003,
                playTime: 4,
                width: 176,
                height: 220,
                round: 0,
                zoom: 0
            },
            {
                title:'爱心彩信',
                frame:0,
                contentType:1,
                contentName:'%u95EA%u7535%u5B50%u5F69%u4FE1-04%281%29.jpg',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-21/a1db37a8-6f08-48b1-8bf9-ccc1c6cf3c58.jpg',
                content:'',
                contentSize:92864,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {
                title: '霜降祝福',
                frame:0,
                contentType:1,
                contentName:'%u971C%u964D%u795D%u798F.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-21/6ed3f698-66f6-48cc-9eb8-aebe8ae7d08e.gif',
                content:'',
                contentSize:50915,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {
                title:'有我挂念你',
                frame:0,
                contentType:1,
                contentName:'%u6709%u6211%u6302%u5FF5%u4F60.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-21/6ac41719-b116-4c42-9e6e-7b98ecb7cf79.gif',
                content:'',
                contentSize:72387,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },    
            {        
                title:'注意防病',
                frame:0,
                contentType:1,
                contentName:'%u6CE8%u610F%u9632%u75C5.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-21/1c4e597a-6f87-4907-8e83-058b8715b2cb.gif',
                content:'',
                contentSize:35871,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {        
                title:'想你念你',
                frame:0,
                contentType:1,
                contentName:'%u60F3%u4F60%u5FF5%u4F60.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-15/ce195ee3-9338-4698-9bad-c4bb34e34689.gif',
                content:'',
                contentSize:88503,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {        
                title:'秋季午休',
                frame:0,
                contentType:1,
                contentName:'%u79CB%u5B63%u5348%u4F11.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-15/36e68653-c34c-453f-8a3e-1beaadf8f61c.gif',
                content:'',
                contentSize:42219,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {    
                title:"贴心问候",
                frame:0,
                contentType:1,
                contentName:'%u8D34%u5FC3%u95EE%u5019.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-15/a42e7e23-6c16-49d9-aa8a-7e47836edbb0.gif',
                content:'',
                contentSize:84732,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {        
                title:"你的脸",
                frame:0,
                contentType:1,
                contentName:'%u4F60%u7684%u8138.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-15/17559bdf-8c01-46e7-ab16-f34eb66e9e0c.gif',
                content:'',
                contentSize:50802,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {    
                title:"造句",
                frame:0,
                contentType:1,
                contentName:'%u9020%u53E5.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-8/55f7faa7-6794-48df-b952-d9ef4ea87d9d.gif',
                content:'',
                contentSize:53719,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            },
            {        
                title:'菊正浓',
                frame:0,
                contentType:1,
                contentName:'%u83CA%u6B63%u6D53.gif',
                contentPath:'http://g2.mail.10086.cn/mmsstorage///2013-10-8/16290149-b1e4-4a5d-81ca-7a741bd6b318.gif',
                content:'',
                contentSize:41839,
                playTime:4,
                width:176,
                height:220,
                round:0,
                zoom:0
            }
            ],
        
        initialize: function (options) {
            this.popWindow();
            this.initMmsInfo();            
            this.model.setLetterSendTime('彩信');     //显示定时发送
            this.initEvents();
        },

        initEvents: function () {
            this.model.addContacts('mobile', 'mms');          //通信录组件接入  
            this.model.setcontent();     //设置预设内容
            this.bindMmsSend();          //邮件发送事件绑定
            this.countLimit();           //短信定数限制
        },

        setNumberOfSend: function (length) {//返回发送条数数据
            if (typeof length == 'undefined') {
                var nowLength = this.model.get('content').length;
            } else {
                var nowLength = length;
            }
            var text = ( 10000 - nowLength) <0? 0: 10000 - nowLength;
            $('#evocation_sendNum b').text(text);
        },
        popWindow:function(){        
            top.$App.evoctionPop = top.$Msg.showHTML(this.popHtml, {
                dialogTitle: "发彩信",
                width: 500,
                onclose: function(){
                    top.BH('evocation_mms_close');
                    $(".menuPop.shadow").hide(); //地址栏联想隐藏
                }
            });
        },

        initMmsInfo: function () {
            var self = this;

            //导入图片
            var mmsImage = self.getRandom();
            mmsImage = '<img src="' + mmsImage.contentPath + '">';
            $('#evocation_mmsImage').append(mmsImage);
            $('#evocation_changeImage').click(function () {
                mmsImage = self.getRandom();
                mmsImage = mmsImage.contentPath;
                $('#evocation_mmsImage img').attr("src", mmsImage);
            });
            self.setNumberOfSend();
            var url = "/mw2/mms/s?func=mms:mmsInitData&sid=" + top.$App.getSid();
            var param = '<object><int name="fromType">1</int></object>';

            M139.RichMail.API.call(url, param, function (result) {
                self.processData(result.responseData);
            });

            

        },

        processData: function (msg) {
            var self = this;
            if (msg && msg.code == "S_OK") {
                //显示验证码
                if(msg.groupNumHint){
                    self.model.set('groupLength', msg.groupNumHint);
                }
                if (msg.validateUrl && msg.validateUrl.length > 0) {
                    self.model.set('validImage', msg.validateUrl);
                    $('#validImg').attr('src',msg.validateUrl);
                    $('#evocation_valid').show().attr("show", 'true');
                    $('#evocation_send').parent().addClass('mt_70');
                    $('#evocation_valid p:eq(1)').text('请输入验证码!');
                    $("#evocation_valid a").click(function () {
                        $('#evocation_valid').find('img').attr("src", msg.validateUrl + Math.random());
                        $('#evocation_valid').find('input').focus().val('');
                        return false;
                    });
                }

                //提示剩余条数
                var data = msg.chargeHint;
                if (data.length > 0) {
                    data = '温馨提示：' + data;
                    $('#evocation_freeMms').html(data);
                }

            } else if (msg.code == "S_ERROR") {
                //top.FloatingFrame.alert(mmsPopMsg.SystemBusy);
                top.FloatingFrame.alert(msg.msg);
            }
        },

        getRandom: function () {
            if (!this.notFirstLoad) {
                this.notFirstLoad = true;
                this.model.set('mmsIndex', 0);
                this.model.set('mmsObject', this.mmsStore[0]);
                return this.mmsStore[0];
            }
            var nowIndex = this.model.get('mmsIndex');
            var mmsIndex;
            do {
                mmsIndex = parseInt(Math.random() * 1000);
                mmsIndex = mmsIndex % this.mmsStore.length;
            }
            while (mmsIndex == nowIndex);

            this.model.set('mmsIndex', mmsIndex);
            this.model.set('mmsObject', this.mmsStore[mmsIndex]);
            return this.mmsStore[mmsIndex];
        },

        bindMmsSend: function () {
            var self = this;
            $('#evocation_send').bind('click', function () {
                if ($('#evocation_content').val().length > 10000) {
                    var thisVal = $(this).val().slice(0, 9999);
                    $(this).val(thisVal);
                    top.$Msg.alert('彩信内容不能超过10000字');
                    return;
                }

                /********   发送前的验证   *******/

                var isSending = self.model.get('mmsSending');
                if (isSending) {
                    top.$Msg.alert('彩信正在发送中....');
                    return;
                }
                //   1. 验证收信人地址是否正确
                if (self.model.richInput.getErrorText()) {
                    //self.model.richInput.showEmptyTips("非移动号码不能发送");
                    $Msg.alert('非移动号码不能发送。');
                    return;
                }


                //   2. 验证收信人地址是否为空
                var address = self.model.richInput.getValidationItems(self.model.richInput);
                if (address.length == 0) {
                    //self.model.richInput.showEmptyTips("请填写接收人")
                    $('#evocation_contacts').click(); //为空则弹出联系人对话框
                    return;
                } else {
                    for (var i = 0; i < address.length; i++) {
                        if (address[i].length > 13) {
                            address[i] = address[i].slice(-12, -1)
                        }
                    }
                    address = address.join(',');
                }


                //   4. 验证码是否为空
                if ($('#evocation_valid').attr('show') && $('#evocation_valid input').val() == '') {
                    $('#evocation_valid p:eq(1)').text('请输入验证码！');
                    return;
                }

                //   5. 判断赠送条数是否用完
                var userFreeCount = self.model.get('userFreeCount');
                if (userFreeCount < 1) {
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
            });
        },

        sendMessage: function (address) {
            var self = this;
            var url = "/mw2/mms/s?func=mms:sendMms&sid=" + top.$App.getSid();
            var param = self.getSendBody(address);
            M139.RichMail.API.call(url, param, function (result) {
                self.successCallback(result.responseData);
            });
            self.model.set('mmsSending', 1);
            M139.UI.TipMessage.show("彩信正在发送....");
        },

        successCallback: function (msg) {
            var self = this;
            if (msg.code == "S_OK") {
                self.model.mmsSuccess();
                self.model.set('mmsSending', 0);
            } else if (msg.code == "MMS_SPLIT_FIRM") {//拆分代码
                //彩信超过100KB确认是否可以拆分
                return;
            } else if (msg.code == "MMS_FIRE_ERROR") {
                self.model.set('mmsSending', 0);
                M139.UI.TipMessage.hide();
                top.$Msg.alert(msg.resultMsg);
                return;
            } else if (msg.code == "MMS_ACARD_ERROR") {
                self.model.set('mmsSending', 0);
                M139.UI.TipMessage.hide();
                top.$Msg.alert(msg.resultMsg);
                return;
            } else if (msg.code == "MMS_VALIDATE_ERROR") {
                self.model.set('mmsSending', 0);
                M139.UI.TipMessage.hide();
                $('#evocation_valid p:eq(1)').text(msg.resultMsg);
                var url = msg.validateUrl;
                $('#validImg').attr('src',url);
                self.model.set('validImg', url);

                return;
            } else if (msg.code == "MMS_VALIDATE_INPT" || msg.validateUrl) {//图片校验
                self.model.set('mmsSending', 0);
                M139.UI.TipMessage.hide();
                //如果需要输入验证码
                var validAgain = self.model.set('validAgain');
                if (validAgain) {
                    $('#evocation_valid p:eq(1)').text('验证码错误,请重新输入');
                }

                var url = self.model.get('validImage');
                if (!url) {
                    self.model.set('validImage', msg.validateUrl);
                    $('#validImg').attr('src',msg.validateUrl);
                    $('#evocation_valid').show().attr("show", 'true');
                    $('#evocation_send').parent().addClass('mt_70');
                    $('#evocation_valid p:eq(1)').text('请输入验证码!');
                } else {
                    $('#evocation_valid').find('img').attr("src", msg.validateUrl);
                    $("#evocation_valid a").click(function () {
                        $('#evocation_valid').find('img').attr("src", msg.validateUrl + Math.random());
                        $('#evocation_valid').find('input').focus().val('');
                        return false;
                    });
                }
                validAgain++;
            } else {
                self.model.set('mmsSending', 0);
                M139.UI.TipMessage.hide();
                top.$Msg.alert(msg.resultMsg);
                return;
            }
        },

        getSendBody: function (address) {

            var object = this.model.get('mmsObject');
            var content = $.trim($('#evocation_content').val());
            if (!content) {
                content = '暂无内容';
            }

            var data = '<object>';
            data +=  '<string name="receiverNumber">' + address + '</string>';   //收件人地址
            data += '<string name="sendNumber">' + top.UserData.userNumber  + '</string>';  //发件人地址
            data += this.bodySendTime();         //定时发送
            data += '<string name="subject">' + this.bodySubject() + '</string>';  //标题
            data += '<string name="isSave">0</string>';   //？  可能是保存到彩信记录  0不保存，1保存
            data += '<string name="oldId">-1</string>';   //？
            data += '<boolean name="splitFirm">false</boolean>';   //？
            data += '<string name="sendMmsSeqId">7382</string>';   //？
            data += '<int name="fromType">1</int>';   //？
            data += '<int name="actionId">1</int>';   //？
            data += '<array name="frameList">';         
            data += '<object>';//图片内容
            data += '<string name="content" />';
            data += '<string name="contentPath">' + (object.contentPath).replace("http://g2.mail.10086.cn", "/uploads/sys") + '</string>';  //彩信图片
            data += '<int name="contentType">1</int>';
            data += '<int name="frame">0</int>';
            data += '<int name="playTime">' + object.playTime + '</int>';
            data += '<int name="contentSize">' + object.contentSize + '</int>';
            data += '<string name="contentName">' + object.contentName + '</string>';
            data += '<int name="width">' + object.width + '</int>';
            data += '<int name="height">' + object.height + '</int>';
            data += '</object>';
            data += '<object>'; //文字内容
            data += '<string name="content">' + escape(content) + '</string>';
            data += '<string name="contentPath" />';
            data += '<int name="contentType">2</int>';
            data += '<int name="frame">1</int>';
            data += '<int name="playTime">' + object.playTime + '</int>';
            data += '<int name="contentSize">-1</int>';
            data += '<string name="contentName" />';
            data += '<int name="width">' + object.width + '</int>';
            data += '<int name="height">' + object.height + '</int>';
            data += '</object>';
            data += '</array>';
            data += this.bodyValidate();
            data += '</object>';
            return data;
        },

        countLimit: function () {
            var self = this;
            $('#evocation_content').bind('keyup', function () {
                var length = $(this).val().length;
                if (length >= 10000) {
                    var thisVal = $(this).val().slice(0, 10000);
                    $(this).val(thisVal);
                    top.$Msg.alert('彩信内容不能超过10000字');
                }

                self.setNumberOfSend(length);
            });

        },




        //**************     getSendBody 用于获取报文信息的片断函数     ---start---     *************************/
        bodyValidate:function(){
            var validate = $('#evocation_valid').attr("show");
            if (validate) {
                return '<string name="validate">' + $('#evocation_valid input').val() + '</string>';
            }
            else {
                return '<string name="validate" />';
            }
        },
        //**************
        bodySendTime: function () {
            var time = this.model.get('sendTime');
            time = time.replace(/-/g, '');
            if (time) {
                return '<string name="sendType">1</string><string name="sendTime">' + time + '</string>'
            } else {
                return '<string name="sendType">0</string><string name="sendTime" />';
            }
        },
        //**************
        getSendName: function () {
            var usrInfo = top.$PUtils.userInfo;
            if (usrInfo.userName && usrInfo.userName != usrInfo.UserNumber) {
                return usrInfo.userName;
            } else if (usrInfo.aliasName) {
                return usrInfo.aliasName;
            } else if (usrInfo.AddrNickName) {
                return usrInfo.AddrNickName;
            } else if (usrInfo.UserNumber) {
                return usrInfo.UserNumber;
            } else {
                return '';
            }
        },
        //**************
        bodySubject: function () {
            var title = this.model.get('mmsObject');
            title = title.title;
            title = this.getSendName() + '为您制作的彩信《' + title + '》';
            return escape(title);
        }
        //**************      getSendBody 用于获取报文信息的片断函数     ----end----      *************************/

    }));
  
})(jQuery,Backbone,_,M139);