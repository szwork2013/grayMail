M139.namespace("M2012", {
    RemindboxView: Backbone.View.extend({

        el: "#msgBox",

        listTemplate:['<div class="tips-text">',
            '<div class="tipsInfoBox_title"><strong>通知</strong><a href="javascript:;" id="msgBoxEmpty" class="i_delb"></a></div>',
            '<ul class="tipsInfoBox_list">{list}</ul>',
            '</div>'].join(''),

        itemTemplate :['<li class="clearfix" seqNO="{seqNO}" type={type}>',
            '<i class="{icon}"></i>',
            '<div class="tipsInfoBox_listCon">',
                '<p>{msg}</p>',
            '</div>',
            '<span class="tipsInfoBox_listTime">{time}</span>',
            '<a href="javascript:;"  rel="关闭" class="closeMin" msg="msgBoxClose"></a>',
        '</li>'].join(""),

        emptyTemplate:'<div class="tips-text tipsInfoBox_no"><i class="i_warn"></i>目前没有通知</div>',

        getShowTime:function(sendTime){
            //sendTime必须是时间对象，传入时需要做转换
            var now = top.M139.Date.getServerTime();       

            var passTime = now - sendTime;
            if(passTime > 1000 * 60 * 60 * 24 * 30){
                return false;
            }

            //用于判断是不是昨天
            var yesterDay = new Date(now);
            yesterDay.setDate(yesterDay.getDate()-1);

            if(passTime < 1000 * 60 * 5){
                return '刚刚';
            }else if(passTime < 1000 * 60 * 60){
                return (0 | (passTime /(1000*60))) + '分钟前';
            }else if(sendTime.getMonth() == now.getMonth() && sendTime.getDate() == now.getDate()){
                return '今天' + $Date.format('hh:mm',sendTime);
            }else if(sendTime.getMonth() == yesterDay.getMonth() && sendTime.getDate() == yesterDay.getDate()){
                return '昨天' + $Date.format('hh:mm',sendTime);
            }else if(sendTime.getFullYear() == now.getFullYear()){
                return (sendTime.getMonth()+1) + '月' + sendTime.getDate() + '日';
            }else if((sendTime.getFullYear() + 1) == now.getFullYear()){
                return sendTime.getFullYear() + '年' + (sendTime.getMonth()+1) + '月';
            }
        },

        getShowMsgList:function(msgHash){
            var i,j;
            var msgArr = [];
            var structure = [
                ['mail'],
                ['addrGroupinvite','addrMaykown'],
                ['calendarInvite','calendarActive'],
                ['cabinet'],
                ['myMagazine','magazineHome']
            ]
            for(i=0; i<structure.length; i++){
                var group = structure[i];
                for(j=0; j<group.length; j++){
                    if(msgHash[group[j]]){
                        msgArr.push(msgHash[group[j]]);
                        break;
                    }
                }
            }
            return msgArr;
        },


        options:{
            mail:{
                icon:"tipsInfoBox_ico_1",
                msg:"您有<strong>{num}</strong>封未读邮件", 
                gotoUrl:function(){
                    $Evocation.hasNewMail = false;
                    top.$App.trigger("mailCommand", { command: "viewUnread", fid: 0 });
                }
            },
            addrGroupinvite:{
                icon:"tipsInfoBox_ico_2",
                msg:"您有<strong>{num}</strong>个群组邀请",
                gotoUrl:function(){
                    $App.show('teamNotify');
                }
            },
            addrMaykown:{
                icon:"tipsInfoBox_ico_2",
                msg:"您有<strong>{num}</strong>个可能认识的人",
                gotoUrl:function(){
                    $App.show('addrWhoAddMe');
                }
            },
            calendarInvite:{
                icon:"tipsInfoBox_ico_3",
                msg:"您有<strong>{num}</strong>个日历活动邀请",
                gotoUrl:function(){
                    $App.show("calendar","&redirect=msg");
                }                  
            },
            calendarActive:{
                icon:"tipsInfoBox_ico_3",
                msg:"您有<strong>{num}</strong>个日历活动快开始了",
                gotoUrl:function(){
                    $App.show('calendar');
                }
            },
            cabinet:{
                icon:"tipsInfoBox_ico_4",
                msg:"您暂存柜有<strong>{num}</strong>个文件快过期了",
                gotoUrl:function(){
                    top.$App.show('diskDev', {from:'cabinet'})
                }
            },
            myMagazine:{
                icon:"tipsInfoBox_ico_5",
                msg:"您的报刊今天更新了<strong>{num}</strong>篇文章",
                gotoUrl:function(){
                    top.$App.show("googSubscription",{mtype : 0});
                }
            },
            magazineHome:{
                icon:"tipsInfoBox_ico_5",
                msg:"报刊亭上架了<strong>{num}</strong>本新杂志",
                gotoUrl:function(){
                    top.$App.show("googSubscription",{mtype : 4});
                }
            }
        },
        initialize: function (options) {
            this.model = new M2012.RemindboxModel(); 
        },

        render:function(list){
            var self = this;
            var unreadListReady = null;
            var msgListReady = null;
            var isLogin = typeof $Evocation.hasNewMail != 'undefined' ;
            //未读邮件需要特殊处理，自己读接口获取，此处与消息获取并发请求，减少等等时间
            //第一次登录 或者 有新邮件到达 就请求一次，获取数据
            if(typeof $Evocation.hasNewMail == 'undefined' || $Evocation.hasNewMail){
                self.model.getUnreadMailList({},function(res){
                    unreadListReady = res;
                    if(msgListReady !== null){
                        handleData();
                    }
                });             
            }else{                
                unreadListReady = {
                    'stats':{messageCount:0},
                    'var':[]
                };   
                if(msgListReady !== null){
                    handleData();
                }          
            }

            self.model.getMsgList(function(res){
                if(res && res.code == "S_OK"){
                    msgListReady = res['var'];
                    if(unreadListReady !== null){
                        handleData();
                    }
                }else{
                    msgListReady = [];
                    if(unreadListReady !== null){
                        handleData();
                    }
                }
            });
           

            function handleData(){
                //未读邮件特殊处理，在这里push到消息数组里面
                var num =unreadListReady.stats.messageCount;
                var list = unreadListReady['var'];
                if(unreadListReady.stats.messageCount){
                    var latest =  new Date(list[0].receiveDate*1000);
                    var time = self.getShowTime(latest);
                    if(time && time != 'false'){
                        msgListReady.push({
                            "seqNO": '',
                            "msgType": "mail",
                            "msgContent": num,
                            "createTime": top.$Date.format("yyyy-MM-dd hh:mm:ss", latest)
                        });
                    }
                }

                //未读邮件，群组的消息体有无点击是在前端记录，不记入数据库，需要在这里面特殊处理
                self.listRender(msgListReady);     
                self.bindAutoHide();
            }
        },

        filterLocalItem:function(list){
            var map={'mail':1,'groupmail_gin':1};
            //格式：msgBox=1425316203614|abcdefg，被记录表示不显示
            var _cookie = $Cookie.get('msgBox');
            if(!_cookie){  //如果没有cookie记录，不处理
                return list
            }

            //如果cguid不同，表示已经重新登录，不处理
            var arr = _cookie.split('|');
            var cguid = $Url.queryString('cguid');
            if(cguid != arr[0]){  
                return list
            }

            var notShow = arr[1];
            for(var i in list){
                if(map[list[i].msgType]){
                    list.splice(i,1);
                    i--;
                }
            }
            return list;
        },

        bindAutoHide:function(){
            var self = this;
            M139.Dom.bindAutoHide({
                action:"click",
                element:$("#msgBox")[0],
                callback:function(e){
                    var e = e.event || window.event; 
                    var t =  e.target || e.srcElement;
                    if(t.id == 'msgBox' || $('#msgBox').find(t).length || $(t).attr('msg')=='msgBoxClose'){
                        $('#msgBox').attr('bindautohide','');
                        self.bindAutoHide();
                    }else{
                        self.closeWindow();
                    }
                }
            });
        },

        transferList :{
            mail:'mail',
            groupmail_gin: 'addrGroupinvite',
            addr_mkpn: 'addrMaykown',
            calendar_cain: 'calendarInvite',
            calendar_cen: 'calendarActive',
            netdisk_tsen: 'cabinet',
            cpo_cpopu: 'myMagazine',
            cpo_cponm: 'magazineHome'
        },

        //适配器模式，用于转换后台的数据至方面前端使用的数据
        transferData: function(list) {
            var self = this;
            var listObj = {};
            var transfer = self.transferList;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var key = transfer[item.msgType];
                var date = $.trim(item.createTime);
                var num = item.msgContent;
                if(key == 'addrMaykown' && num>50){num = '50+'}
                if(key == 'mail' && num>99){num = '99+'}
                if(num == 0 || !key){
                    continue;
                }
                date = $Date.parse(date);
                //消息提示，如果是函数，就用执行后的返回值
                var msg = self.options[key].msg;
                if($.isFunction(msg)){
                    msg = msg();
                }
                var time = self.getShowTime(date);
                if(time){
                    listObj[key] = { 
                        icon: self.options[key].icon,
                        type: key,
                        msg: $T.format(msg, {num:num}),
                        seqNO: list[i].seqNO,
                        time: time,
                        gotoUrl: self.options[key].gotoUrl
                    }
                }
            }
            return listObj;
        },

        getUnreadMail:function(){
            return $User.getUnreadMessageCount();
        },

        listRender:function(list){
            var self = this,i=0;
            if(list.length == 0){
                self.emptyRender();
                return;
            }
            var listHash = self.transferData(list);
            if($.isEmptyObject(listHash)){
                self.emptyRender();
                return;
            }
            var msgList = self.getShowMsgList(listHash);
            var html = ul = "";
            for(;i<msgList.length;i++){
                ul += $T.format(self.itemTemplate,msgList[i]);
            }
            html = $T.format(self.listTemplate,{list:ul});
            $(self.el).fadeIn(200).find('>div').replaceWith(html);
            if(self.hasLockedMail()){
                $(self.el).find('li[type=mail] p').addClass('tipsInfoBox_listCon_p').append('<span class="gray">(不含加锁邮件)</span>');
            }
            self.eventInit();
        },

        emptyRender:function(){
            var self = this;
            $(this.el).show().find('>div').replaceWith(self.emptyTemplate);
            $Evocation.msgBoxHot.hide()
        },

        eventInit:function(){
            var self = this;
            $(self.el).find('#msgBoxEmpty').bind({
                'click':function(){
                    var seqNOs = $(self.el).find('li').map(function(){
                        return $(this).attr('seqNO');
                    }).get().join(',');
                    self.model.removeMsg({seqNO:seqNOs},function(res){
                        if(res && res.code == "S_OK"){}else{};
                    });
                    $('#msgBox li').remove();
                    self.closeAll();
                    $Evocation.hasNewMail = false;
                }
            })
            $(self.el).find('li').bind({
                'click':function(e){
                    //var e = e.event || window.event; 
                    var node = e.target || e.srcElement; 
                    var li=$(this);
                    var type = li.attr('type');
                    //如果点中的是关闭按钮
                    if(node && node.rel == "关闭"){
                        li = $(node).parent('li');
                        if(li.attr('type') == 'mail'){
                            $Evocation.hasNewMail = false;
                        }
                        li.remove(); 
                        self.checkEmpty();
                    }else{
                        li.remove();  
                        self.options[type].gotoUrl();
                        self.closeAll();
                    }        
                    var seqNO = li.attr('seqNO');          
                    self.model.removeMsg({seqNO:seqNO},function(res){
                        console.log(res);
                    });
                },
                'mouseover':function(){
                    $(this).addClass('boxFocus').find('.closeMin').show();
                },
                'mouseout':function(){
                    $(this).removeClass('boxFocus').find('.closeMin').hide();
                }
            });

        },

        clickMsg:function(domLi){
            var type = domLi.attr('type');
            this.options[type].gotoUrl();
            this.closeAll();
        },

        removeMsg:function(domLi){
            var seqNO = domLi.attr('seqNO');
            this.model.removeMsg({seqNO:seqNO},function(res){
                console.log(res);
            })
        },

        closeAll:function(){
            var self = this;
            self.closeWindow();
            self.checkEmpty();
        }, 

        checkEmpty:function(){
            var self = this;
            var len =  $(this.el).find('li').length;
            if(len == 0){
                top.$Evocation.msgBoxHot.hide();
                self.closeWindow();
            }
        },

        closeWindow:function(){
            $('#msgBox').fadeOut(200).attr('bindautohide','');
        },

        hasLockedMail:function(){
            var has = false;
            $($App.getFolders()).each(function(i,n){
                if($App.getView("folder").model.isLock(n.fid)){
                    has = true;
                }
            });
            return has;
        }
    })
});

setTimeout(function(){
    $App.on('msgBoxMailArrival',function(mail){
        top.$Evocation.msgBoxHot.show();
        $Evocation.hasNewMail = mail;    
    });

    $('#msgBoxClick,#msgBoxComing').bind({
        'mouseover':function(){
            $('#msgBoxClick').addClass('focus');            
        },
        'mouseleave':function(){
            $('#msgBoxClick').removeClass('focus');
        },
        'click':function(){
            $Evocation.showMessageBox();
        }
    });
},1000)


