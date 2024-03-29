﻿;(function () {
    var FrameModel = Backbone.Model.extend({
        /**
        * 
        */
        initialize: function (options) {
            if (!window.LinkConfig) {	//只执行一次，避免子类重复执行
                window.LinkConfig = {	//模块配置，用于工厂模式创建相应的模块
                    welcome: { url: "welcome_v2.html", site: "", title: "首页", tab: "welcome",group:"welcome"},
                    compose: { url: "compose.html", site: "", title: "写信", mutiple: true },
                    activityInvite: { url: "activityinvite/invite.html", site: "", title: "会议邀请", mutiple: true },
                    account:             {group: "setting", title: "设置", url: "set/account.html", site: "", tab: "account" },
                    account_setname:     {group: "setting", title: "设置", url: "set/account.html?bubble=txtSenderName", site: "", tab: "account" },
                    account_accountSafe: {group: "setting", title: "设置", url: "set/account.html?anchor=accountSafe", site: "", tab: "account" },
                    account_secSafe:     {group: "setting", title: "设置", url: "set/account.html?anchor=secSafe", site: "", tab: "account" },
                    account_areaSign:    {group: "setting", title: "设置", url: "set/account.html?anchor=areaSign", site: "", tab: "account" },
                    account_userInfo:    {group: "setting", title: "设置", url: "set/account.html?anchor=userInfo", site: "", tab: "account" },
                    accountLock:         {group: "setting", title: "设置", url: "set/account_lock.html", site: "", tab: "account" },
                    lockForget:          {group: "setting", title: "设置", url: "set/account_lock_verifycode.html", site: "", tab: "account" },
                    editLockPass:        {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "account" },
                    preference:          {group: "setting", title: "设置", url: "set/preference.html", site: "", tab: "preference" },
                    preference_replySet: {group: "setting", title: "设置", url: "set/preference.html?anchor=replySet", site: "", tab: "preference" },
                    preference_forwardSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=forwardSet", site: "", tab: "preference" },
                    preference_autoDelSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=clearFolders", site: "", tab: "preference" },
                    preference_onlinetips: {group: "setting", title: "设置", url: "set/preference.html?anchor=onlinetips", site: "", tab: "preference" },
                    preference_clientSend: {group: "setting", title: "设置", url: "set/preference.html?anchor=clientSend", site: "", tab: "preference" },
                    preference_popReceiveMail: {group: "setting", title: "设置", url: "set/preference.html?anchor=popReceiveMail", site: "", tab: "preference" },
                    preference_autoSavaContact: {group: "setting", title: "设置", url: "set/preference.html?anchor=autoSavaContact", site: "", tab: "preference" },
                    popmail:    {group: "setting", title: "设置", url: "set/pop.html", site: "", tab: "popmail" },
                    addpop:     {group: "setting", title: "设置", url: "set/add_pop.html", site: "", tab: "popmail" },
                    addpopok:   {group: "setting", title: "设置", url: "set/add_pop_ok.html", site: "", tab: "popmail" },
                    type:       {group: "setting", title: "设置", url: "set/sort.html", site: "", tab: "type_new" },
                    type_new:   {group: "setting", title: "设置", url: "set/sort_new.html", site: "", tab: "type_new" },
                    createType: {group: "setting", title: "设置", url: "set/create_sort.html", site: "", tab: "type_new" },
                    tags:              {group: "setting", title: "设置", url: "set/tags.html", site: "", tab: "tags" },
                    tags_customerTags: {group: "setting", title: "设置", url: "set/tags.html?anchor=forwardSet", site: "", tab: "tags" },
                    tags_systemFolder: {group: "setting", title: "设置", url: "set/tags.html?anchor=systemFolder", site: "", tab: "tags" },
                    spam:               {group: "setting", title: "设置", url: "set/spam.html", site: "", tab: "spam" },
                    spam_whiteListArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=forwardSet", site: "", tab: "spam" },
                    spam_spamMailArea:  {group: "setting", title: "设置", url: "set/spam.html?anchor=spamMailArea", site: "", tab: "spam" },
                    spam_antivirusArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=antivirusArea", site: "", tab: "spam" },
                    mobile:          {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" },
                    partner:         {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" }, //兼容旧版，多写一个key
                    notice: {group: "setting", title: "设置", url: "set/notice.html", site: "", tab: "notice" },
                    set_addr: {group: "setting", title: "设置", url: "set_v2/set_addr.html", site: "", tab: "settingsaddr" },
                    set_calendar: {group: "setting", title: "设置", url: "set_v2/set_calendar.html", site: "", tab: "settingscalendar" },
                    set_disk: {group: "setting", title: "设置", url: "set_v2/set_disk.html", site: "", tab: "settingsdisk" },
                    set_mpost: {group: "setting", title: "设置", url: "/mpost2014/html/columnmanager.html?sid=" + top.sid, site: "", tab: "settingsmpost" },

                    pushEmail: { url: "/pushmail/default.aspx", site: "webmail", title: "pushEmail", tab: "pushemail" }, //pushemail地址
                    G3Phone: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?a=g3&environment=2&partId=1&path=&skin=shibo&sid=") + "&comeFrom=weibo&sid=" + top.sid, title: "G3通话", tab: "G3Phone" },
                    fetion: { url: "http://i2.feixin.10086.cn/home/indexpart", site: "", title: "飞信同窗", tab: "fetion" },
                    shequ: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?sid=") + "&comeFrom=weibo&sid=" + top.sid, comefrom: "weibo", title: "移动微博", group: "移动微博", tab: "shequ" },
                    cancelPackage: { url: "/userconfig/matrix/MailUpgrade.aspx?page=MailUpgrade.aspx", site: "webmail", title: "套餐信息", tab: "cancelpackage" },
                    syncguide: { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },
                    pay139: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent(domainList.global.pay139+"&sid=") + "&comeFrom=weibo&sid=" + top.sid, site: "", title: "手机支付", tab: "pay139" },
                    note: { url: "note/note.html", site: "", title: "和笔记", tab: "note" },
					heyuedu: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url="+ encodeURIComponent("http://read.10086.cn/email139/index?Sid=") +"&comeFrom=weibo&sid=" + top.sid, comeFrom:"weibo", site: "", title: "和阅读", tab: "heyuedu" },
                    sms: { url: "sms/sms_send.html", group: "sms", title: "发短信", homeUrl: "sms_send.html" },
                    mms: { url: "mms/mmsRedirect.html", group: "mms", title: "发彩信" },
                    diskDevOld: { url: "disk/disk_jump.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_default.html" },
                    diskDev: { url: "disk_v2/disk2.html", site: "", group: "disk", title: "彩云", homeUrl: "disk_v2/disk2.html" },// update by tkh 重构彩云
                    diskShare: { url: "disk_v2/disk_share.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_v2/disk_share.html" },// update by chenzhuo 移植彩云共享功能
                    greetingcard: { url: "card/card_sendcard.html", site: "", title: "贺卡" },
                    card_success: { url: "card/card_success.html", site: "", title: "贺卡" },
                    quicklyShareOld: { url: "largeattach/largeattach_welcome.html", site: "", title: "文件快递" },
                    quicklyShare: { url: "fileexpress/cabinet.html", site: "", group: "disk", title: "彩云网盘" },// update by tkh 重构文件快递默认打开暂存柜页面
                    postcard: { url: "/Card/PostCard/Default.aspx", group: "postcard", site: "webmail", title: "明信片", homeUrl: "Default.aspx" },
                    attachlist: { url: "mailattach/mailattach_attachlist.html", site: "", group: "disk", title: "彩云网盘" },
                    calendar: { url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" },
                    addMyCalendar: { url: "calendar_v2/mod/cal_mod_schedule_v1.html", homeUrl: "cal_index.html", title: "添加活动", group: "calendar" },
					vipEmpty: { url: "mail/vipmail_empty.html", site: "", title: "VIP邮件" },
                    clientPc: { url: getDomain("rebuildDomain") + "/disk/netdisk/wp.html?jsres=http%3A//images.139cm.com/rm/newnetdisk4//&res=http://images.139cm.com/rm/richmail&isrm=1", site: "", title: "pc客户端", target: "_blank"},
                    smallTool: { url: "/m2012/html/control139.htm", site: "", title: "pc客户端/小工具", target: "_blank" },
                    smallToolSetup: { url: "/m2012/controlupdate/mail139_tool_setup.exe", site: "", title: "小工具安装", target: "_blank" },
                    pcClientSetup: { url: "/m2012/html/disk_v2/wp.html", site: "", title: "pc客户端", target: "_blank" },
					health: { url: "health.html", group: "health", title: "邮箱健康度"},

                    //用户中心
					userCenter: { url: " http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=6", site: "", title: "用户中心" },
					voiceSetting: { url: "/m2012/html/voiceMail/redirect.html", site: "", title: "语音信箱" },


                    //通讯录块
                    addrvipgroup:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?v=20120620&homeRoute=10100", site: "" },
                    addrhome:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    addrinputhome:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_clone", site: "" },
                    addroutput:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_export", site: "" },
                    addrWhoAddMe:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_whoaddme", site: "" },
                    addrWhoWantAddMe: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_request", site: "" },
                    updateContact:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_update", site: "" },
                    addrshare:        { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_share_home.html?check=1", site: "" },
                    addrshareinput:   { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/share/ShareAddrInput.aspx", site: "webmail" },
                    addrbaseData:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    dyContactUpdate:  { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/updatecontactinfo.htm", site: "webmail" },
                    addrImport:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrImportFile: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_file", site: "" },
                    addrMcloudImport: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrAdd:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_add_contacts", site: "" },
					addrEdit:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_editContact", site: "" },
                    addrMyVCard:      { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_businesscard.html?type=mybusinesscard&pageId=0", site: "" },
                    addr:             { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    setPrivate:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_setprivacy", site: "" },
                    baseData:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    teamCreate: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_create", site: "" },
                    teamNotify: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_notify", site: "" },
                    syncGuide:        { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },

                    groupMail: { url: "/m2012/html/groupmail/list.html",site: "", title: "群邮件", group: "groupMail"  },
                    writeGroupMail: { url: "/m2012/html/groupmail/list.html?redirect=writeGroupMail", site: "", title: "群邮件", group: "groupMail" },
                    //groupMail: { url: "GroupMail/groupEmailList.htm", site: "webmail", title: "群邮件" },
                    groupMailWrite: { url: "GroupMail/GroupMail/ComposeGroupmail.aspx?action=write", site: "webmail", group: "groupMailCompose", title: "写群邮件" },
                    groupMailSetting: { url: "/GroupMail/GroupOper/GroupManager.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailFindGroup: { url: "/GroupMail/GroupOper/FindGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailCreateGroup: { url: "/GroupMail/GroupOper/CreateGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailAddGroupUser: { url: "/GroupMail/GroupOper/AddUserGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailEditGroup: { url: "/GroupMail/GroupOper/EditGroupNickName.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },

                    myrings: { url: "set/myrings.html", site: "", title: "咪咕音乐" },
                    billManager: { url: "bill/billmanager.htm", site: "", group: "mailsub_0", title: "服务邮件" },
                    billLife: { url: "/handler/bill/goto.ashx?lc=main", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeNew: { url: "/handler/bill/goto.ashx", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeSsoIndex: { url: "/handler/bill/goto.ashx?lc=main&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoWater: { url: "/handler/bill/goto.ashx?lc=pay.waterselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoElectric: { url: "/handler/bill/goto.ashx?lc=pay.electricselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoGass: { url: "/handler/bill/goto.ashx?lc=pay.gasselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeTraffic: { url: "/handler/bill/goto.ashx?lc=pay.trafficselect&provcode=0&areacode=0&from=1&fromtype=1", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    //uecLab: { url: "/LabsServlet.do", site: "uec", title: "实验室" },
                    uecLab: { url: "uec/lab.html", title: "实验室" },
                    selfSearch: { url: 'set/selfsearch.html', title: '自助查询' },

                    fax: { url: "fax/sso.aspx?style=3&id=2", site: "webmail", title: "收发传真" },
                    pushemail: { url: "/pushmail/default.aspx", site: "webmail", title: "手机客户端" },
                    smsnotify: { url: "sms/notifyfriends.html", group: "sms", title: "短信提醒" },
                    mobileGame: { url: "http://g.10086.cn/s/139qr/", group: "mobileGame", title: "手机游戏" },

                    // 主题运营活动
                    earth2013: { url: "topicality/earth2013/indexearth.html", site: "", title: "地球一小时" },
                    addcalendar: { url: "calendar/calendar_editcalendar.html", homeUrl: "calendar_view.html", title: "日历", group: "calendar" },

                    //每月任务
                    //myTask: { url: "taskmain/taskmain.html", site: "", title: "我的任务" },

                    myTask: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201306B1', site: "", title: "我的积分任务" },
                    sportLottery: { url: "http://3g.weicai.com/139mail/index.php", type: "sso", comefrom: "weibo" },
                    
                    changeSkin: {url: "changeskin.html", site: "", title: "换皮肤"}, // add by tkh 设置皮肤
                    

                    //邮箱营业厅
                    mailHall: { url: "hall/index.html", site: "", title: "邮箱营业厅" },//邮箱营业厅

                    //年终“邮”
                    lottery: { url: top.getDomain('lotteryRequest') + '/setting/s?func=setting:examineUserStatus&versionID=1', site: "", title: "开箱邮礼" },
                    //lotteryDetail: { url: 'https://happy.mail.10086.cn/web/act/cn/fuli/Rule.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryDetail: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/detail.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryad: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/index.aspx', site: "", title: "马上邮奖" },//年终“邮”
                    blueSky: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403A1', site: "", title: "蓝天自造" },
                    billCharge: { url: top.SiteConfig.billChargeUrl, site: "", title: "邮箱营业厅" },
                    colorfulEgg: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403D1', site: '', title: '生日彩蛋' },
                    smartLife: { url: top.getDomain('happyMailUrl') + '/api/sso/ssoformail.ashx?to=CN201407B1', site: "", title: "拥抱智能生活" },
                    nothing: {} //结尾
                };
                //window.LinksConfig = window.LinkConfig; //兼容旧版
                if (!domainList["global"]["billLife"]) {
                    domainList["global"]["billLife"] = "http://bill.mail.10086.cn";
                }
                this.addSubscribeLinks();
                this.fixlinks();//提供新开关动态修改链接入口
            }

        },
        modules: [], //模块列表
        defaults: {  //默认数据
            currentLink: null, //当前模块
            container: null
        },
        /***
        * 通过key值获取links配置
        */
        getLinkByKey: function (key) {
            return window.LinkConfig[key];
        },
        /***
        * 通过model取到当前的标签页id，再取到相应的links配置
        */

        getLink: function (moduleModel) {

            var currentModuleName = moduleModel.get("currentModule"); //模块管理model

            var key = currentModuleName;
            var module = moduleModel.getModule(currentModuleName);
            if (module.orignName) { //多实例，name已经加了guid，取orignName
                key = module.orignName;
            }
            var config = window.LinkConfig[key]; //为了适应写信页多实例，不能直接取module.name，而是取分组名称
            if (module.view && module.view.inputData && module.view.inputData.categroyId) {
                config.categroyId = module.view.inputData.categroyId;
            }
            return config;
            //alert(config.url);
        },

        /**
        * 创建module,module是实体数据{name:"模块名",
        * isload:false //是否加载过
        * type:"mailbox" //表示模块类型，如mailbox,welcome,readmail
        * title:"" 表示模块标题
        * element:null 模块容器dom
        */
        addLink: function (key, data) {
            window.LinkConfig[key] = data;
        },

        /** 添加我的订阅相关页面连接 */
        addSubscribeLinks: function () {
            //var host = getDomain('dingyuezhongxin'); // update by tkh
            var host = "http://" + top.location.host;
            var homemailhost = getDomain('homemail');
            this.addLink('goodMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('googSubscription', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" }); // 云邮局主页面
            this.addLink('mpostOnlineService', { url: host + "/mpost2014/html/onlineservice.html", channel: "subscribe", mutiple:true,refresh:true,title: "云邮局" }); // 云邮局在线服务（新页签）
            this.addLink('mpostOnlineRead', { url: host + "/mpost2014/html/mymagazine.html", group: "subscribe", title: "云邮局" }); // 云邮局在线阅读
            this.addLink('myMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCollect', { url: host + "/inner/show_favorite.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCloudSubscribe', { url: host + "/inner/mysubscribe.action", group: "subscribe", title: "云邮局" }); // add by tkh 新版精品订阅‘我的订阅’
            this.addLink('setSubscription', { url: host + "/inner/to_subscribe_manager.action", group: "subscribe", title: "云邮局" });
            this.addLink('myBookshelf', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('dingyuezhongxin', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" });
            this.addLink('dingyueDownload', { url: "http://jpdyapp.mail.10086.cn/?21", group: "subscribe", title: "云邮局" });

        },
        fixlinks :function(){
        	
            if(top.SiteConfig.calendarRemind){//修改日程提醒
           	
           	    if(top.SiteConfig.isLoadingCalendarRemind){
           	    	
           	    	this.addLink('calendar',{ url: "calendar_reminder/loading.html", homeUrl: "month.html", title: "日历", group: "calendar" });
           	    	
           	    }else{
           	    	
           	    	this.addLink('calendar',{ url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('createCalendar', { url: "calendar_v2/cal_index.html?redirect=addlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addcalendar', { url: "calendar_v2/cal_index.html?redirect=addact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addBirthcalendar', { url: "calendar_v2/cal_index.html?redirect=addbirthact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_act_view', { url: "calendar_v2/cal_index.html?redirect=actview", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_msg', { url: "calendar_v2/cal_index.html?redirect=msg", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_search', { url: "calendar_v2/cal_index.html?redirect=search", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_square', { url: "calendar_v2/cal_index.html?redirect=discovery", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_manage', { url: "calendar_v2/cal_index.html?redirect=labelmgr", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
                    this.addLink('calendar_viewlabel', { url: "calendar_v2/cal_index.html?redirect=viewlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	var lstSpecial = [{labelId:6,name:'birth',page:'list_system.html'},{labelId:1,name:'appointment',page:'list_system.html'},{labelId:2,name:'pay',page:'list_system.html'},
           	    					{labelId:3,name:'special',page:'list_system.html'},{labelId:5,name:'sport',page:'list_system.html'},{name:'baby',page:'list_baby.html'}
           	    				  ];
           	    	var item = null ,url = null , homeUrl = null;
           	    	for(var i = 0 ;i < lstSpecial.length; i++){
           	    		
           	    		item = lstSpecial[i];
           	    		homeUrl = item.page;
           	    		url = "calendar_v2/" + item.page;
           	    		if(item.labelId){
           	    			
           	    			url +=  ("?labelId=" + item.labelId);
           	    		}
           	    		
           	    		this.addLink('specialCalendar_'+item.name,{url: url,homeUrl: homeUrl,title: "日历",group: "calendar"});
           	    	}
           	    }
           		
           	
           }
            if (SiteConfig.m2012NodeServerRelease) {
                LinkConfig.welcome.url = "/m2012server/welcome";
            }
        }

    }, {
	    getLinkByKey: function (key) {
            return window.LinkConfig[key];
        }
    });

    window.FrameModel = FrameModel;

})();