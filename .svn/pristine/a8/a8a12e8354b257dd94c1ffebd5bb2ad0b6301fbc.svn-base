/**   
* @birthdayWish 生日祝福
*/

(function (jQuery, _, M139) {

    M139.namespace("M2012.Product.BirthdayWish.Model", Backbone.Model.extend({

        defaults: {
            receiver: [],
            param: {
                account: null,
                email: null,
                subject: '我的生日许愿',
                content: null,
                callback: null
            },
            hasName:'',
            hasWishes: ''
        },

        tips: {
            wrongAddress: '<div class="tips write-tips EmptyTips" style="left: 0px; top: -28px; z-index:20"><div class="tips-text EmptyTipsContent" style="">请正确填写收件人的邮箱地址</div><div class="tipsBottom diamond" style=""></div></div>',
            emptyAddress: '<div class="tips write-tips EmptyTips" style="left: 0px; top: -28px; z-index:20"><div class="tips-text EmptyTipsContent" style="">请填写收件人</div><div class="tipsBottom diamond" style=""></div></div>'
        },
        
        sendBody: {
            content: [ '<table width="100%"  cellpadding="0" cellspacing="0"  background="LETTERURL/images/module/letter_paper/bday_04.gif" style="background-repeat:repeat;height:308px;width: 99%;">',
             '<tbody>',
               '<tr>',
                 '<td background="LETTERURL/images/module/letter_paper/bday_06.gif" style="background-repeat:repeat;height:75px; font-size:0;" >',
                   '<table width="100%" cellpadding="0" cellspacing="0">',
                     '<tbody>',
                       '<tr>',
                         '<td valign="top" background="LETTERURL/images/module/letter_paper/bday_01.gif" style="background-position:left top; background-repeat:no-repeat;height:75px;">&nbsp;</td>',
                       '</tr>',
                     '</tbody>',
                   '</table>',
                 '</td>',
               '</tr>',
               '<tr>',
                 '<td valign="top" style="font-size:0;">',
                   '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:0;table-layout: fixed">',
                     '<tbody>',
                       '<tr>',
                         '<td valign="top" width="64" background="LETTERURL/images/module/letter_paper/bday_03.gif" style="background-position:left top; background-repeat:no-repeat;height:75px; font-size:0;"></td>',
                         '<td valign="top" background="LETTERURL/images/module/letter_paper/bday_02.png" style="background-position:right bottom; background-repeat:no-repeat;font-size:0;line-height:33px;padding-right:64px;color:#990000;min-height:300px;height:auto!important;height:300px;word-wrap: break-word; word-break: normal;">',
                           '<div style="font-family: 宋体; font-size: 13px; color: rgb(0, 0, 0);">{0}</div>',
                           '<div style="font-family: 宋体; font-size: 13px; padding:0 30px; color: rgb(0, 0, 0);">{4}是我的生日，今年生日我许下了美好的心愿：</div>',
                           '<div style="font-family: 宋体; font-size: 13px; padding:0 30px; color: rgb(0, 0, 0);">{1}</div>',
                           '<div style="font-family: 宋体; font-size: 13px; padding:0 30px; color: rgb(0, 0, 0);">希望得到你的祝福，那将是我最大的快乐。 <a id="139Command_LinksShow" href="http://mail.10086.cn/?id=greetingcard" rel="greetingcard" params="&materialId={6}&to={5}"  clicklog="true"  target="_blank">送祝福</a></div>',
                           '<div style="font-family: 宋体; font-size: 13px; padding:30px; text-align:right; color: rgb(0, 0, 0);"><span style=" display:inline-block;text-align:center">{2}<br />{3}</span></div>',
                         '</td>',
                       '</tr>',
                     '</tbody>',
                   '</table>',
                 '</td>',
               '</tr>',
               '<tr>',
                 '<td valign="top" height="47" background="LETTERURL/images/module/letter_paper/bday_07.gif" style="background-repeat:repeat;font-size:0;">',
                   '<table width="100%" cellpadding="0" cellspacing="0">',
                     '<tbody>',
                       '<tr>',
                         '<td valign="top" background="LETTERURL/images/module/letter_paper/bday_08.gif" style="background-position:right bottom; background-repeat:no-repeat;height:47px;width:188px;">&nbsp;</td>',
                       '</tr>',
                     '</tbody>',
                   '</table>',
                 '</td>',
               '</tr>',
             '</tbody>',
           '</table>'].join("")
        },


        getSendTitle: function () {
            var name = this.getAddressName();
            if (name == '') {
                name = top.$PUtils.userInfo.UserNumber;
            }
            var title = '今年生日' + name + '许下了美好的愿望';
            return title;
        },

        //获取许愿邮件内容
        getSendBody: function () {
            var receiver = this.setSendReceiver(); //称呼
            var wishes = this.setSendWishes();     //许愿内容
            var addName = this.getAddressName();         //落款名字
            var time = this.getAddressTime();            //落款时间
            var sendBody = this.sendBody.content;       //未格式化的发送内容
            var birthday = this.getBirthdayTime();      //生日时间
            var url = top.$App.getResourceHost();     //背景图片绝对地址
            var sendAdrress = this.getSendAddress(); //送祝福的收信人地址
            var cardId = this.getCardId();
            url += '/m2012/';
            sendBody = sendBody.replace(/LETTERURL/g, url);
            //debugger;
            sendBody = $T.Utils.format(sendBody, [receiver, wishes, addName, time, birthday, sendAdrress, cardId]);
            return sendBody;
        },


        //获取收件人内容
        setSendReceiver: function () {
            var receiver = '朋友';
            return '亲爱的' + receiver + ':';
        },

        getCardId: function () {
            var cards = [10677, 10664, 10655, 10646, 10637, 10560, 10559, 10558, 10557, 10556, 158, 157, 156, 155, 154, 153, 152, 151, 150, 149];
            var random = parseInt(Math.random() * 10000) % 20;
            return cards[random];
        },

        //获取许愿内容
        setSendWishes: function () {
            var wishes = [];
            $(":checkbox:checked").each(function () {  //获取复选框许愿内容
                wishes.push($(this).next("label").html());
            });

            if (this.get('otherWish')) {//获取其它许愿内容
                var otherWish = document.getElementById('otherWish').value;
                if (otherWish != '愿望不怕多，全部写来告诉TA') {
                    wishes.push(otherWish);
                }
            }

            if (wishes.join('') == ""){//如果没有内容，返回空
                return '';
            }

            wishes = wishes.join('<br />');

            this.set({ 'hasWishes': true })//解锁(用于发送按钮判断)

            return wishes;
        },


        //获取落款人名字，可以为空
        getAddressName: function () {
            if (this.get('hasName')) {
                return this.get('hasName');
            } else {
                var customName = document.getElementById('customName').value;
                if (customName && customName != '填写你的名字') {
                    return customName;
                }else{
                    return '';
                }
            }
        },


        //获取生日时间
        getBirthdayTime: function () {
            var birthday = top.$PUtils.userInfo.BirDay;
            var birthyear = new Date(top.UserData.ServerDateTime);
            birthyear = birthyear.getFullYear();
            birthday = birthday.replace(/-0/g, '-');
            birthday = birthday.split('-');
            birthday = birthyear + '年' + birthday[1] + '月' + birthday[2] + '日';
            return birthday;
        },


        //获取落款时间
        getAddressTime: function () {
            var now = new Date(top.UserData.ServerDateTime);
            var addressTime = now.getFullYear() + '年';
            addressTime += now.getMonth() + 1 + '月';
            addressTime += now.getDate() + '日';
            return addressTime;
        },


        //设置hasName为用户设置的名字，如果名字，别字，昵称都没设置就设置''
        getUserName: function () {
            var usrInfo = top.$PUtils.userInfo;
            if (usrInfo.userName && usrInfo.userName != usrInfo.UserNumber) {
                this.set({ 'hasName': usrInfo.userName });
            } else if (usrInfo.aliasName) {
                this.set({ 'hasName': usrInfo.aliasName });
            } else if (usrInfo.AddrNickName) {
                this.set({ 'hasName': usrInfo.AddrNickName });
            } else {
                this.set({ 'hasName': '' });
            }
        },

        getSendAddress: function () {
            var userInfo = top.$User.getAccountList();
            for (var i = 0; i < userInfo.length; i++) {
                if (userInfo[i].type == 'mobile') {
                    return userInfo[i].name;
                }
            }
           return top.$PUtils.userInfo.FamilyEmail;
        },
        
        sendMail: function (param) {
            top.$PUtils.sendMail(param)
        },
        
        
        sendCallback: function (response) {
            
            var xx = top.$App;

            if (response && response.responseData.code == 'S_OK') {

                top.BH('birthdayWish_success');
                top.M139.UI.TipMessage.show('愿望邮件发送成功', {
                delay: 2000
                });

                xx.get("birthWishFrame").close();
                xx.set("birthWishFrame", null);

            } else {
                top.M139.UI.TipMessage.show('发送失败，请稍后再试', {
                    delay: 2000
                });

              
            }

            
        },

        close: function () {    //关闭弹出窗
            top.$App.get("birthWishFrame").close();
            //top.$App.set("birthWishFrame", null);
        }

    }));

})(jQuery, _, M139);

