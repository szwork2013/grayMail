/**
 * @fileOverview 懒人贺卡
 *
 主要功能：
 1:弹出贺卡  渲染联系人checkbox选项、贺卡flash等
 2:组装邮件容器
 3:获取表单数据并验证
 4:发送贺卡邮件
 ****************************************************************************************************************************************
 *简述流程: 
 *
 *   注：下述的联系人邮箱指非自己、非系统、非自己设置手机号码的有效邮箱。
 *        /conf/config.10086.cn.js进行配置节日时间段。
 *        1:配置加载
 *        SiteConfig.lazyCard中加载，例：
 *        key->键值，保存在服务器上，记录是否弹出。
 *        begin-> 节日开始时间点
 *        end-> 节日开始时间点
 *        lazyCard:[{key:"2013cj",begin:"2013-02-06",end:"2013-02-10"},{key:"2013yx",begin:"2013-02-20",end:"2013-02-25"}]   
 *        2:贺卡配置加载 
 *        详情见 /js/prod/m2012.lazycard.resource.js
 *一般流程
 *      1:入口在welcome的匿名函数中，并根据1)配置的节日时间段2)key值(是否弹出)进行判断需不需要加载该js进行。
 *   ==>1A：条件满足  加载JS并弹出。
 *   ==>1B: 条件不满足 不加载JS实例化，不弹出  
 *      2:加载贺卡数据，渲染弹出贺卡
 *   ==>检测自己、系统以及设置了自己手机号的邮箱联系人，并将上述邮箱进行屏蔽。   
 *      3:渲染完毕，绑定事件     
 *   ==> 3A:有联系人并联系人有邮箱，以checkbox选中联系人的方式进行发送，在发送之前做非空检测。
 *     ==> 3Aa:联系人邮箱超过三人以上，在联系人checkbox下面有"展开/收起"按钮。
 *     ==> 3Ab:联系人邮箱三人以下，一人以上，则不显示"展开/收起"按钮。
 *   ==> 3B:没有联系人邮箱的情况，以input Text输入框，让用户自行输入，其中可多个联系人邮箱发送，以逗号隔开，在发送之前做非空以及邮箱检测。
 *     
 *      4:贺卡发送
 *   ==> 4A:成功渲染。
 *   ==> 4B:失败渲染。
 *
 ******************************************************************************************************************************************    
 */

(function(jQuery, _, M139) {
    var $ = top.jQuery; //贺卡弹出在顶层

    /**
     * @namespace
     * 懒人贺卡
     */

    M139.namespace('M2012.LazyCard.View', Backbone.View.extend({

        /**
         *@lends  懒人贺卡
         */
        el: '',

        template: "",

        initialize: function(param) {
            var self = this;
            this.model = new M2012.LazyCard.Model();
            this.initEvent();
            var option = {   //保存的字符串Key,表示是否已弹出的记录 
                customInfo:(top.$App.getCustomAttrs("lazyCard")||"").replace(/\/>|\s*/g, "")
            };
            
            this.model.set("lazycard", option.customInfo);      
            /*
            * 通过外层传入当前类别的贺卡索引 例：春节贺卡、元宵贺卡等。
            * 其中每一个类别贺卡有一个集合。 
            */
            if (param && !isNaN(param.cardCfgIdx)) {
                self.model.set("cardCfgIdx", param.cardCfgIdx);
            }
        },
        initEvent: function() {
            this.model.on("successRender", this.successRender);
            this.model.on("errorRender", this.errorRender);
        },
        /*
        *记录弹出,将该类别的贺卡对应key进行保存,进行保存记录成功之后再弹出
        */      
        recordCardShow: function () {
            
            var self = this;
            var userCustomeKey = self.model.get("userCustomeKey");
            //var param = "";
            //if(userCustomeKey) param = self.model.packageParam(userCustomeKey);
            top.$App.setCustomAttrs("lazyCard", userCustomeKey, function (rs) {
                self.show(rs);
            });
        },
        /*
        *加载数据以及容器
        */
        loadData:function(){
            var self = this;
            self.model.initCardData();  //初始化贺卡数据
            self.model.initContacts();  //初始化联系人数据
            self.loadContactHtml();     //组装联系人容器
            self.loadCardHtml();        //组装贺卡容器
        },
        /*
        *弹出贺卡
        */
        showCard: function() {          
            var self = this;
            var cardConfig  = self.model.get("cardConfig");
            var contacts    = top.$App.getModel("contacts");
            
            contacts.requireData(function () {
                self.loadData();            //加载数据(贺卡数据、联系人数据)
                cardConfig.zfIsClose = false;
                self.recordCardShow();//记录弹出之后，在服务器状态保存成功之后弹出贺卡
            });
        },
        show:function(rs){
            var self = this;
            if(rs && rs.code && rs.code == "S_OK"){
                var cardConfig  = self.model.get("cardConfig");
                var cardPanel = top.$Msg.showHTML(cardConfig.cardVarHtml, { 
                dialogTitle: cardConfig.type + "贺卡",
                width: 540
                });
                self.model.set("tempPanel", cardPanel);
                self.showCardEvent();
            }
        },
        loadMailHtml:function(){
            var self = this;
            var cardConfig = self.model.get("cardConfig");
            /**
            *组装贺卡主题
            */
            if($.trim(top.trueName) != "") {
                cardConfig.cardSubject = top.trueName + cardConfig.metaSubject;
            } else {
                var phone = top.$User.getUid();
                phone = phone ? ( phone.substring(0,2) == "86" ?  phone.substring(2) : phone ) :  0;
                cardConfig.cardSubject = top.$User.getUid().substring(2) + cardConfig.metaSubject;
            }
            /*
            *组装贺卡正文
            */
            cardConfig.cardContent = $("#taZf").val();
            cardConfig.cardContent = cardConfig.cardContent ? cardConfig.cardContent.replace(/(\r)?\n/g, '<br>') : "";
            var rp = top.getDomain("resource")+"/rm/richmail";
            cardConfig.mailVarHtml = ["<table id=\"cardinfo\" width=\"660\" align=\"center\" style=\"background:#FDFBE2; font-size:12px; margin-top:18px\">", "<tr><td style=\"background-repeat:no-repeat; background-position:center 10px; padding:0 60px 0 55px; vertical-align:top; text-align:center;\" background=\"", rp, "/images/heka_mail_bg.jpg\">", "<div style=\"text-align:right; height:60px; line-height:60px;padding-right:48px\"><a style=\"color:#000; font-family:\"宋体\"\" id=\"139command_greetingcard3\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\">登录139邮箱发送更多贺卡>></a></div>" + "<h2 style=\"font-size:14px; margin:12px 0\">", cardConfig.cardSubject, "</h2><table style=\"width:440px; height:330px;margin:0 auto;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-repeat:no-repeat;background-position:155px 59px;text-align:center\" background=\"", cardConfig.cardImg, "\" id=\"139command_flash\" rel=\"", cardConfig.cardSwf, "\"></td></tr></table><div style=\"margin:24px 0; font-size:14px\">如果您无法查看贺卡，<a style=\"color:#369\" href=\"http://file.mail.10086.cn/card/card_readcard.html?resPath=", rp, "&link=", $.trim(cardConfig.cardSwf), "&from=", encodeURIComponent(cardConfig.cardSubject), "\" target=\"_blank\">点击此处查看</a></div>", "<div><a id=\"139command_greetingcard1\" style=\"color:#369\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\" style=\"margin-right:60px\"><img style=\"border:none\" src=\"", rp, "/images/heka_mail_bt01.gif\" alt=\"\" /></a><a id=\"139command_greetingcard2\" style=\"color:#369\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\"><img style=\"border:none\" src=\"", rp, "/images/heka_mail_bt02.gif\" alt=\"\" /></a></div><div style=\"line-height:1.8; text-align:left; font-size:14px; padding:12px 48px\">", cardConfig.cardContent, "</div></td></tr></table><table><tr><td background=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?rnd=", Math.random(), "\"></td></tr></table>"].join("");
        },
        /**
        *弹出联系人的容器
        */
        loadContactHtml: function() { 
            var self = this;
            var cardConfig      = self.model.get("cardConfig");
            var contactVarHtml  = "";
            var count           = 0;
            var strChecked      = "checked";
            var receiveMail     = "",           //sun:接受人邮箱
                currContant     = null;         //sun:当前联系人数据

            /*sun:itemIdx,元素索引，只有收接人有邮箱时才会在循环中累加itemIdx++
            *
            * 当没有联系人的时候，不再提供联系人checkbox选中按钮，而是渲染Input Text输入框，用户自行输入收件人。
            */            
            if (cardConfig.arrContant && cardConfig.arrContant.length == 0) {
                var contantStyle            = ".diamond{filter: progid:DXImageTransform.Microsoft.Matrix(  M11=0.7071067811865475, M12=-0.7071067811865477,    M21=0.7071067811865477, M22=0.7071067811865475, SizingMethod='auto expand');-moz-transform: rotate(45deg);-webkit-transform: rotate(45deg);-o-transform: rotate(45deg);-ms-transform: rotate(45deg);transform:rotate(45deg);}:root .diamond{filter:none\\9;}/*ie9 hack*/ .tips{position:absolute;background: #FFFFc1;border:1px solid #E7c560;padding:5px 10px;}  .tipsBottom{position:absolute;display:block;width:8px;height:8px;font-size:0;background:#FFFFc1;border-right:1px solid #E7c560;border-bottom:1px solid #E7c560;bottom:-5px;bottom:-4px\\0;*bottom:-7px;left:15px;}.tipsLeft{position:absolute;display:block;width:8px;height:8px;font-size:0;background:#FFFFc1;border-left:1px solid #E7c560;border-bottom:1px solid #E7c560;left:-5px;left:-7px\\0;*left:-7px;top:10px;}.tipsRight{position:absolute;display:block;width:8px;height:8px;font-size:0;background:#FFFFc1;border-right:1px solid #E7c560;border-top:1px solid #E7c560;right:-5px;right:-4px\\0;*right:-7px;top:10px;}.tipsTop{position:absolute;display:block;width:6px;height:6px;font-size:0;background:#FFFFc1;border-left:1px solid #E7c560;border-top:1px solid #E7c560;top:-4px;top:-5px\\0;*top:-5px;left:10px;} ";
                contactVarHtml              = ["<style>",contantStyle,"</style><tr><td style='height:26px;line-height:26px;text-align:center;vertical-align:top'>收件人:</td><td>","<div class='tips' style='left:72px;top:57px;*top:77px;display:none' id='tipBubble'>   <div class='tips-text'> 请填写收件人</div><div class='tipsBottom diamond'></div></div><input   id='addContacts' type='text'  name='mail'  last_handler_value='请填写邮箱地址' style='width:98%;margin-top:4px;' />","</td></tr>"].join("");
                currContant                 = null;
                cardConfig.contactVarHtml   = contactVarHtml;
                return;
            }

            contactVarHtml = [];
            
            /*
            *  组装联系人容器
            */   
            for(var i = itemIdx = 0, contantLength = cardConfig.arrContant.length; i < contantLength && i < 50; i++, itemIdx++) {
                currContant = cardConfig.arrContant[i];         //sun:得到当前联系人数据
                if(currContant) {
                    receiveMail = currContant.mail;                //sun:得到接受方邮箱
                    if(top.$Email.isEmail(receiveMail)) {       //sun:校验接受邮箱，没有邮箱不显示
                        if(count >= 3) {
                            strChecked = "";
                        }
                        var cName  = $.trim(currContant.name);
                            cName  = cName ? cName : $.trim(receiveMail);
                            cName = $T.Utils.htmlEncode(cName);
                            cName = top.$T.Utils.getBytes(cName) > 20 ? top.$PUtils.getLeftStr(cName,20, "...") : cName;
                        var cardtr = ["<td><label title='",receiveMail,"'><input type='checkbox' name='mail' value='",receiveMail,"' title='",receiveMail,"' ",strChecked ,">",cName,"</label></td>"].join("");
                        //sun:中间行、新行的结束和起始条件，元素行索引被3整除，则行结束，即每行有三列
                        if((itemIdx + 1) % 3 == 0 && i != contantLength - 1) {
                            cardtr = [cardtr,"</tr>","<tr>"].join("");
                        } else if(i == 0) { //sunsc:起始行
                            cardtr = ["<tr>",cardtr].join("");
                        }   
                        //sunsc:行结束
                        if(i == contantLength - 1) {
                            cardtr = [cardtr,"</tr>"].join("");
                        }
                        contactVarHtml.push(cardtr);
                        count++;
                    } else { //sunsc:如果邮箱不合法，不显示，元素下标递减
                        itemIdx--;
                    }
                }
            }

            contactVarHtml = contactVarHtml.join("");

            cardConfig.contactVarHtml = contactVarHtml;
        },
        loadCardHtml: function() { //弹出贺卡的容器
            var self = this;
            var cardConfig  = self.model.get("cardConfig");
            var cdh         = ["<h2 style='font-weight: bold; color: rgb(255, 89, 7); padding: 0pt;width:300px;' class=''>为您的朋友送去", cardConfig.type, "祝福</h2>"].join("");
            var cdp         = ["<p style='line-height: 24px; width: 500px; font-size: 12px;' class='wcDot1'>轻松一键，为您的<em id='receiveNum' style='color: rgb(255, 89, 7);'>50</em>个好友送去《<label id='lblCardName'>", cardConfig.cardName, "</label>》贺卡！</p>"].join("");
            var cdbtn       = "立即发送";
            var cdContant   = ["<li style='margin-top: 10px; color: rgb(102, 102, 102); font-size: 12px; width: 500px; border: 1px solid rgb(204, 204, 204);' class=''>", "<h5 style='background: none repeat scroll 0% 0% rgb(248, 248, 248); border-bottom: 1px solid rgb(204, 204, 204); padding: 3px 0pt; display: none;' id='selall'>", "<label><input type='checkbox' id='sAllCardMail'>全选</label>", " </h5>", " <div style='width: 500px; height: 22px; overflow: hidden;' id='moreCardMail'>", "<table style='width: 500px;*width:480px;' class='cardmail'><colgroup><col width='170'><col width='170'><col></colgroup><tbody> ", cardConfig.contactVarHtml, "</tbody></table></div><h5 id='zfCarcSwitch' style='text-align: center; background: none repeat scroll 0% 0% rgb(248, 248, 248); cursor: pointer; height: 15px; line-height: 14px; border-top: 1px solid rgb(238, 238, 238); color: rgb(153, 153, 153);' colspan='3' >显示全部\u25bc</h5></li>"].join("");
            /*
            *当没有联系人的时候只显示一个input，让用户自行输入联系人邮箱
            */
            if(cardConfig.arrContant.length == 0) {
                cdp         = ["<p style='line-height: 24px; width: 500px; font-size: 12px;' class='wcDot1'>轻松一键，为你的好友送去《<label id='lblCardName'>", cardConfig.cardName, "</label>》贺卡！</p>"].join("");
                cdContant   = ["<li style='margin-top: 10px; color: rgb(102, 102, 102); font-size: 12px; width: 500px; border: 1px solid rgb(204, 204, 204);' class=''>", "<h5 style='background: none repeat scroll 0% 0% rgb(248, 248, 248); border-bottom: 1px solid rgb(204, 204, 204); padding: 3px 0pt; display: none;' id='selall'>", " <label><input type='checkbox' id='sAllCardMail'>全选</label>", " </h5>", " <div style='width: 500px; height:auto; ' id='moreCardMail'>", "<table style='width: 500px;*width:480px;' class='cardmail'>", "<colgroup>", "<col width='10%'>", "<col width='90%'>", "</colgroup>", "<tbody>", cardConfig.contactVarHtml, "</tbody>", "</table>", "</div>", "<h5 id='zfCarcSwitch' style='text-align: center; background: none repeat scroll 0% 0% rgb(248, 248, 248); cursor: pointer; height: 15px; line-height: 14px; border-top: 1px solid rgb(238, 238, 238); color: rgb(153, 153, 153);' colspan='3' >显示全部\u25bc</h5>", "</li>"].join("");
            }
            cardConfig.cardVarHtml = ["<style>.wTipCont li{float:none;width:490px;}.wTipCont .wcDot1 {float:none;padding:0pt} .winTipC {  padding: 10px 0;}</style>", "<div style='width:500px;margin:10px auto 0 auto;padding-bottom:10px;'><ul><li style='color: rgb(102, 102, 102);' class=''>", cdh, cdp, "</li>", cdContant, "<li style='border: 5px solid rgb(238, 238, 238); margin-top: 8px;width: 492px;' id='christmasCard'><embed id=\"flashCard\" width='200' height='180' style='border: 1px solid green; width: 200px; margin-right: 5px; height: 180px; float: left;' src='", cardConfig.cardSwf, "' type='application/x-shockwave-flash'><div id=\"cardContentDiv\" style='padding: 1px; margin-left: 205px;'>", "<h6 style='padding: 0pt; height: 12px;'>祝福语：</h6><textarea id='taZf' style='border: 1px solid rgb(238, 238, 238); line-height: 20px; margin-top: 10px; padding-left: 5px;width:272px; height: 154px;' >", cardConfig.cardContent, "</textarea></div></li><li style='width: 500px; float: none; text-align: center; padding-top: 10px; clear: both;'><a id='changeCard' href='#' style='display:none;float:left;margin-left:4px;'>换一张</a><button id='scmail'>&nbsp;", cdbtn, "&nbsp;</button></li></ul></div>"].join("");
        },
        showCardEvent: function() { //弹出贺卡之后的绑定
            var self = this;
            var cardConfig      = self.model.get("cardConfig");
            var checkboxList    = $("#moreCardMail input[type ='checkbox']");
            var receiversInput  = $("#addContacts");
            if(cardConfig.arrContant.length == 0) { //当没有联系人以及记录时
                receiversInput.blur(function() {
                    var self = $(this);
                    var val = self.val();
                    if(!val || val.lastIndexOf(';') == (val.length - 1)) {
                    } else {
                        self.val(val + ";");
                    }
                });
            }

            _updateSelectCount();//联系人数目随选中的联系人渲染
            
            //绑定选中联系人改变选中的联系人数目
            checkboxList.add("#sAllCardMail").click(_updateSelectCount);

            /*
            * 绑定贺卡切换按钮，弹出框左下的"换一张"按钮。
            */
            $("#changeCard").show().click(function() {
                var currentIndex    = parseInt(self.model.get("currentIndex")) || 0;
                var dataLength      = parseInt(self.model.get("dataLength")) || 0;
                var cardCfgIdx      = parseInt(self.model.get("cardCfgIdx")) || 0;

                currentIndex++;

                    if(currentIndex >= dataLength) {
                        currentIndex = 0;
                    }
                /*
                *更换贺卡后，进行数据更新。
                */
                var dataConfig      = top.$App.LazyPeopleOfCardsConfig || null,
                    mainIndex       = cardCfgIdx,                                        //当前类别贺卡对象索引   例:春节
                    cardContentDiv  = $("#cardContentDiv"), 
                    flashCard       = $("#flashCard"),
                    data            = dataConfig[mainIndex],                             //当前贺卡
                    card            = _getItemByIdx(dataConfig, mainIndex, currentIndex),//当前贺卡数据
                    cardContent     = card.cardContent || "",                            //贺卡文字内容
                    cardName        = card.cardName || "";                               //贺卡名称
                
                $("#lblCardName").text(cardName);
                
                /*
                *重置Flash
                */
                flashCard.remove();
                
                cardContentDiv.before(["<embed id='flashCard' width='200' height='180' style='border: 1px solid green; width: 200px; margin-right: 5px; height: 180px; float: left;' src='", card.cardFlash, "' type='application/x-shockwave-flash'>"].join(""));
                
                /*
                *设置贺卡文字内容
                */
                $("#taZf").val(cardContent);
                cardConfig.cardContent  = cardContent;
                cardConfig.cardSwf      = card.cardFlash;
                cardConfig.cardName     = cardName;
                cardConfig.cardImg      = card.cardImg;
                cardConfig.metaSubject  = data.fromSubject.format(cardName);
                self.model.set("currentIndex", currentIndex); //保存当前贺卡对应索引，便于第下次操作
            });
            /**
             * 获得当前类别贺卡对象
             * @param {Object}  贺卡数据配置
             * @param {number}  所有类别贺卡集合索引
             * @param {number}  当前贺卡集合索引
             * @return {object} 返回当前贺卡
             */
            function _getItemByIdx(CardsConfig, mainIndex, dataIndex) {
                return CardsConfig && CardsConfig[mainIndex].dataList[dataIndex];
            }
            
            /*
            *更新联系人选中的个数
            */
            function _updateSelectCount() {
                var selectedCount = 0;
                var checkboxList = $("#moreCardMail input[type ='checkbox']");
                checkboxList.each(function() {
                    var self = $(this);
                    if(self.prop("checked")) {
                        selectedCount++;
                    }
                });
                $("#receiveNum").text(selectedCount);
            }
            

            if(cardConfig.arrContant.length <= 3) {

                $("#zfCarcSwitch").hide();
            }

            /*
            * 绑定弹起，伸缩按钮 Todo
            */
            $('#zfCarcSwitch').click(function() {
                var self = $(this);
                var moreCardMailVar = $('#moreCardMail');
                var christmasCardVar=  $('#christmasCard');
                var selallVar       = $('#selall');
                var changeCardVar   = $("#changeCard");
                var isExpanded      = !!moreCardMailVar.prop("isExpanded");
                if(!isExpanded){
                    moreCardMailVar.css({height: "150px", overflowY: "auto"}).prop("isExpanded",true);
                    christmasCardVar.hide();
                    selallVar.show();
                    self.text("收起\u25b2");
                    changeCardVar.hide();
                }else{
                    changeCardVar.show();
                    moreCardMailVar.css({height: "22px", overflowY: "hidden"}).prop("isExpanded",false);
                    christmasCardVar.show();
                    selallVar.hide();
                    $("#moreCardMail").scrollTop(0);
                    self.text("显示全部\u25bc")
                }

            });
             
            /*
            * 全选按钮绑定
            */    

            $('#sAllCardMail').change(function() { 
                $("#moreCardMail input[name='mail']").attr("checked", $(this).prop("checked")); 
            });


            /*
            * 发送贺卡
            **/
            $('#scmail').click(function() { 
                top.addBehavior(cardConfig.behavior);
                if(!self.validateReceiver()) { //在validateReceiver方法里面进行了联系人获取
                    return false;
                }
                self.loadMailHtml();           //将当前待发送贺卡数据进行组装
                self.model.sendCard();      
                $("#changeCard").unbind();
            });

        },
        /*
        *获取选中的有效的联系人
        *1:有联系人选中时：选中联系人进行非空检测，验证完毕后将联系人缓存至cardconfig中
        *2:没有联系人，用户自行添加时:对填写的联系人邮箱进行验证，验证完毕后将联系人缓存至cardconfig中
        */
        validateReceiver:function(){
            var self = this;
            var cardConfig = self.model.get("cardConfig");
            var receivers = "";
            $("#moreCardMail input[name='mail']:checked").each(function(index, domEle) {
                var chkMail = $.trim($(this).val());
                if(top.$Email.isEmail(chkMail)) {
                    receivers += ";" + chkMail;
                }
            });

           /*
           * 没有联系人时，进行input Text验证
           */     

            if(cardConfig.arrContant.length == 0) {
                var chkMail         = $.trim($("#addContacts").val());
                var isValidateOK    = false,
                    varInput        = $("#addContacts"),
                    tipMsg          = "",   //提示语
                    errorMail       = [],
                    entireErrorMail = "";
                    chkMail         = chkMail.split(';');

                chkMail.pop();              //将空格弹出

                $("#tipMsg").remove();      //清空重置
                
                for(var i = 0; i < chkMail.length; i++) {
                    if(!$Email.isEmail(chkMail[i])) {
                        errorMail.push(chkMail[i]);
                    }
                }

                errorMail       = errorMail.length > 0 ? errorMail.join(";")+";" : errorMail.join("");
                entireErrorMail = errorMail;
                errorMail       = errorMail.length > 60 ?  errorMail = errorMail.substring(0, 60) + "..." : errorMail; //截取
                isValidateOK    = (errorMail == "") ? true : false;
                tipMsg          = ["<p id='tipMsg' style='padding:5px 0;' title='",entireErrorMail,"'>您填写的<span style='color:red'>",errorMail,"</span>存在格式错误。</p>"].join("");
                
                if(chkMail == "") {
                    tipMsg = "<p id='tipMsg' style='color:red;padding:5px 0;'>请先写收件人邮箱</p>";
                    $("#tipBubble").show();
                    varInput.css({"border": "1px solid red", "height": "16px"});
                    setTimeout(function(){   //Todo   delay没有生效
                    varInput.css("border", "1px solid #ccc");
                    $("#tipBubble").hide();
                    },2000);
                    varInput.focus();
                    return false;
                } else if(!isValidateOK) {
                    varInput.after(tipMsg);
                    varInput.focus();
                    return false;
                } else {
                    receivers += chkMail.join(";");
                    cardConfig.cardReceiver = receivers;
                    return true;
                }
            } 

            receivers = receivers != ""  ?  receivers.substring(1, receivers.length) : receivers;
            if(receivers == "") {
                alert("提示：请选择要发送的好友！");
                return false;
            }
            cardConfig.cardReceiver = receivers;
            return true;
        },
        successRender: function(res) {//成功渲染结果页
            var self = this;
            top.WaitPannel.hide();
            var cardConfig = self.get("cardConfig");
            if(cardConfig.zfIsClose) {
                return;
            }

            var dialogMsg = top.$Msg.confirm("贺卡发送完成", function() {
                cardConfig.zfIsClose = true;
                dialogMsg.close();
                top.Links.show("greetingcard");
            }, function() {
                cardConfig.zfIsClose = true;
                dialogMsg.close();
            }, {
                buttons: ["继续发送贺卡", "关闭"],
                icon: "ok",
                height: 25,
                width: 430
            })
        },
        errorRender: function(res) {//失败渲染
            top.WaitPannel.hide();
            var msg = "贺卡发送失败";
            var dialogMsg = top.$Msg.alert(msg, function() {
                cardConfig.zfIsClose = true;
                dialogMsg.close();
            });

        },
        render: function() {
        }
    }));
})(jQuery, _, M139);