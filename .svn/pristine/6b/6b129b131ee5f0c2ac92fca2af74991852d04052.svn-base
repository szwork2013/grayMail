var SiteConfig = {
    compressSendMailRelease: true,
    m2012NodeServerRelease: true,
    unifiedPositionStatic: true, // 统一位置广告使用静态化js 涉及到欢迎页广告和tips
    unifiedPositionUrl: "/Resource/staticFile", // 统一位置静态资源文件的配置路径
    comboUpgrade: true,
    tabSetRelease: true,
    mailDomain: "hmg1.rd139.com",
    flashDomainReg: /./,
    mailDomain: "hmg1.rd139.com",
    diskDev: "http://smsrebuild1.mail.10086.cn/disk/netdisk",
    ssoInterface: "http://ssointerface.mail.rd139cm.com:27788/SSOInterface",
    isDev: '',
    embedRelease: true,
    onlinetipDomain: "http://gfile90.mail.rd139cm.com/",
    scriptLog: "/mw2/weather/weather?func=user:monitorLogAction",
    behaviorLog: "/mw2/weather/weather?func=user:logBehaviorAction",
    billPath: "/mw/bill/billsvr?func={api}&sid={sid}",
    calendar_version: "20131101",
    myTask: true,
    checkIn: true,
    isRemind: true,  //二度关系控制入口
    onlineTips: true,
    plugOnlineTip: true,
    loginOnlineTip: true,
    emailOnlineTip: true,
    userOnlineTip: true,
    isShowLazyCard: true,
    birthMail: true,
    calendarRemind: true,//日程提醒增加开关
    isLoadingCalendarRemind: false,//日程是否已经更新好
    moreAlias: false, //多别名
    newLogoff: true,//设置页注销功能
    ssoLogin: true, //第三方授权登录
    mailNotice: true, //邮件到达通知5类改3类
    mealUpgradeOld: false,//套餐详情调用旧接口
    mealUpgradeAliasCount: false,//套餐详情调用新接口，屏蔽别名数量
    mealUpgradeAlias: true,//套餐详情调用新接口，屏蔽别名数量,别名长度

    //addr config
    addrOutputSearch: false, //联系人导出页面的搜索功能是否开启
    showCaiYun: true, //彩云通讯录融合开关
    showOutlookTool: true, //是否在通讯录页，显示Outlook小工具
    showBirthRemind: true, //通讯录好友生日提醒设置
    showImportResult: true, //通讯录导入结果页开启
    addrbatchdisable: true,
    saveinboxcontact: true, //保存入信的联系人
    newContactsBack: true, //通讯录返回入口开关
    addrSysUpdate: true, //数据库分库开关
    //end addr config

    //#region calendar config
    isLotteryStarted: true, //马上邮奖活动是否已经展开
    isMeetingReady: true,
    //#endregion

    showUmcUpgrade: true, //是否显示用管中心升级
    showUmcBox: true, //是否显示用管中心盒子
    colorCloudRelease: true,
    skinVersion: 20130522, // 皮肤版本号 add by tkh
    showBirthwish: true,
    showMicroBlog: true,
    isQuicklyShare: true, // add by tkh 文件快递重构开关
    isDiskDev: true, // add by tkh 网盘重构开关
    calendarPostcard: 694,  //add by xyx    日历生日活动指定发贺卡ID
    showShiningIntro: false,
    //disk config
    // pc客户端推广页面链接 引用页面：网盘，文件快递，附件夹及文件共享管理
    pcClientSetupHtml: "<a id=\"setupDiskTool\" href=\"javascript:top.$App.show('pcClientSetup');\" class=\"diskDown\"><i class=\"diskPc\"></i>彩云网盘PC客户端发布了，立即安装体验吧！</a>",
    //end disk config
    calendarSetScheTime: true,      //add by xyx共享和订阅日历下活动是否开启设置自定义时间
    evocation: true,
    yearLottery: true, //年终“邮”
    showCornerPic: true, //欢迎页右上角撕角广告
    tipsMassLink: true,
    //懒人贺卡改版了，不用静态配置贺卡内容，读取贺卡接口获取，但注意配置正确
    // key： 统一格式 6位字符 2014cj，前面4位是年份，后面2位是节日简称 如（cj 春节, yx 元宵节, ld 劳动节）
    lazyCard: { key: "2014cj", begin: "2014-01-22", end: "2014-02-11" },
    showLottery: true,
    billAllowProvince: { '1': 'gd' },
    billChargeUrl: "http://hall.mail.rd139cm.com:7000/MailOffice/main/goUrl",
    billChargeWelcomeUrl: "http://hall.mail.rd139cm.com:7000/MailOffice/main/province?sid=",
    showNewWriteOk:true //写信完成页新版开关
};

var topicalityList = {
    earth2013: { name: 'earth2013', title: '地球一小时', start: '2013-02-18 00:00:00', end: '2013-03-10 00:00:00' }
};

var domainList = {
    1: {
        subscribeUrl:"http://appmail.mail.10086.cn/subscribe/inner/bis/",  
        webmail: "http://g2.mail.rd139cm.com",
        rebuildDomain: "http://smmw46.mail.rd139cm.com/",
        lotteryRequest: "http://smmw46.mail.rd139cm.com/",  //用于区别测试线
        addr: "/addr",
        sms: "/sms",
        middleware: "/mw",
        disk: "/disk",
        setting: "/setting",
        resource: "http://rm.mail.rd139cm.com"
    },
    12: {
        subscribeUrl:"http://appmail.mail.10086.cn/subscribe/inner/bis/",  
        webmail: "http://g2.mail.rd139cm.com",
        rebuildDomain: "http://smmw46.mail.rd139cm.com/",
        lotteryRequest: "http://smmw46.mail.rd139cm.com/",  //用于区别测试线
        rarPreviewSaveDisk: "http://192.168.9.55", //压缩包内的文件存网盘下载地址需要用IP
        addr: "/addr",
        sms: "/sms",
        middleware: "/mw",
        disk: "/disk",
        setting: "/setting",
        colorcloud: "http://app.mail.10086rd.cn/colorcloud/",
        resource: "http://rm.mail.rd139cm.com"
    },
    21: {
        webmail: "http://g2.mail.rd139cm.com",
        rebuildDomain: "http://smmw46.mail.rd139cm.com/",
        lotteryRequest: "http://smmw46.mail.rd139cm.com/",  //用于区别测试线
        rarPreviewSaveDisk: "http://192.168.9.55", //压缩包内的文件存网盘下载地址需要用IP
        addr: "/addr",
        sms: "/sms",
        middleware: "/mw",
        disk: "/disk",
        setting: "/setting",
        resource: "http://rm.mail.rd139cm.com"
    },
    global: {
        happyMailUrl:"http://zone.mail.10086.cn",
        image: "http://mail.rd139cm.com",
        mail: "http://mail.rd139cm.com",
        weibo: "http://auth.weibo.10086.cn",//移动微博登录地址
        subscribeUrl:"http://rm.mail.rd139cm.com/subscribe/inner/bis/",
        weiboHome: "http://weibo.10086.cn",//移动微博主页
        fetionSpace: "http://i2.feixin.10086.cn/",
        fetionWebIMInitUrl: "http://webim.feixin.10086.cn/webimbar/initialize.aspx",
        fetionLoginUrl: "http://maillist.i.139cm.com/mail139fetion/LoginFetion",//飞信整合,我方后台登录接口
        fetionFate: "http://lbs.fetion.com.cn",//飞信位缘
        pay139: "https://cmpay.10086.cn/club/fetion_index.xhtml?mail=1&AGENT=139MAIL",//手机支付请求地址
        help: "http://help.mail.10086.cn/statichtml",
        interface_oss: "http://interface.n20svrg.139.com:8080/",	//oss的接口页面
        homemail: "http://homemail.mail.10086.cn:28001",   //精品订阅
        stat: "http://interface.n20svrg.139.com:8080/UrlRedirect/MailRedirect.aspx",//统计链接
        books: "http://hand.139.com",
        mailScribeScriptUrl: "http://images.139cm.com/subscribe/js/subscribeaction.js?v=20120704",
        rmResourcePath: "http://" + location.host + "/rm/richmail",
        diskInterface: "http://rmdisk1.mail.rd139cm.com/spaceinterface",
        disk: "http://rm.mail.rd139cm.com/disk/netdisk",
        wmsvrPath2: "http://rm.mail.rd139cm.com/RmWeb",
        syncguide: "http://images.mail.rd139cm.com:2080/rm/richmail/page/sync_guide_inner.html",
        caiyun: "http://www.cytxl.com.cn/login.php?channel=139mail",
        uec: "http://rm.mail.rd139cm.com/uec/",
        UMCSVR: "https://www.umc.rd139cm.com:30030/UmcSSO/plugin",
        userzone: "http://zone.mail.10086.cn/api/sso/ssoformail.ashx",
        billLife: "http://bill.mail.rd139cm.com",
        dingyuezhongxin: "http://subscribe1.mail." + location.host.match(/[^.]+\.[^.]+$/)[0] + ":18080" //订阅中心
    }
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return "";
}

function getDomain(key) {
    var part = getCookie("cookiepartid");
    var obj = domainList[part];
    if (obj[key]) {
        return obj[key]
    } else {
        return domainList["global"][key];
    }
}


; (function () {
    //记住登录版本
    setCookie({
        name: "matrix_version",
        value: "2.0",
        expires: new Date(2015, 0, 1)
    });
    setCookie({
        name: "matrix_version",
        value: "2.0",
        domain: "mail." + document.domain, //2个cookie域都写，向下兼容
        expires: new Date(2015, 0, 1)
    });
    function setCookie(options) {
        var name = options.name;
        var value = options.value;
        var path = options.path || "/";
        var domain = options.domain;
        var expires = options.expires;
        var str = name + "=" + escape(value) + "; ";
        str += "path=" + path + "; ";
        if (domain) str += "domain=" + domain + "; ";
        if (expires) str += "expires=" + expires.toGMTString() + "; ";

        document.cookie = str;

        __loadScript = window.loadScript || function () { };//保存原始函数指针
        __loadScript.myname = "mail139";//给函数打签名
        var loadScriptCheckTimer = setInterval(function () {
            //判断函数是否被篡改
            if (window.loadScript && loadScript.myname !== "mail139") {
                loadScript = __loadScript;//恢复函数
            }
        }, 1000);
    }
})();

function isPreloadUser() {
    return true;
}
//默认进收件箱的用户
function isDefaultShowMailBoxUser(number) {
    number = number.replace(/^86/, "");
    var list = ["13802882899", "13902220729", "13902220586", "13922201256", "13922200384", "13802882108", "13802882178", "13802880496", "13802881946", "13802881077", "13902220840", "13802881804", "13802881210", "13802881801", "13802880240", "13902220080", "13822260016", "13802881808", "13802880992", "13802882626", "13802881828", "13902220562", "13902923092", "13902220019", "13802880345", "13922200254", "13802880898"];
    list.push("15013703301");//fengwp
    list.push("15889394143");//lifl
    list.push("15023451002");//test 12
    list.push("15801232405");//test 1
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i] === number) {
            return true;
        }
    }
    return false;
}
//<fileConfig>
var Config_FileVersion = {
    "defaults": "2014-05-29T05:40:13.382Z",
    "frame.css": "R0PSNdmh0wrVu9WvcrKmWw%3D%3D",
    "global.css": "DoaPWcez8IEqPtCscGv7Mg%3D%3D",
    "extract.css": "VvrWlcuShi5QstR7bC7qaw%3D%3D",
    "send.css": "1SmSQWQcrCFBuvaL5hmY5A%3D%3D",
    "addr_float.css": "KOrVr1vXmzn6xEoLxnrO1g%3D%3D",
    "attr.css": "FLxmweYw4GdObgTMTzusQQ%3D%3D",
    "attrview.css": "oK6DRRbESlncNCRCXMc%2BrA%3D%3D",
    "bigattr.css": "ricTxTPKNXjDrQWgnlWG0g%3D%3D",
    "bill.css": "0xGteB3vA3vzTp7x76Ft6A%3D%3D",
    "schedule.css": "iX02ZriwXNwiZscoM7WDqQ%3D%3D",
    "css.css": "heCmh18Mm8Iv%2FbnUhoampg%3D%3D",
    "upgrade.css": "ZgLMusujF7YJFyUI92NHcQ%3D%3D",
    "m2011.disk.loginSite.css": "%2Bd9Gg52dRf0XVksdsnzlqA%3D%3D",
    "editer.css": "wIXN4kls0rvqaMHh%2FFFtQw%3D%3D",
    "folder.css": "p6slBpkQ0VJjleQU9YwE5g%3D%3D",
    "imgeditor.css": "rRr5AAMkyFi5lN%2FTFg%2BbEg%3D%3D",
    "inbox.css": "VzHEoDJBswCu4AD683OI%2Fg%3D%3D",
    "lab.css": "DqPsvrl7syUWVKs92mxT3Q%3D%3D",
    "letter.css": "TtO0HHQIfdriSbyv5RNhpg%3D%3D",
    "mailcontent.css": "UdHqNfW8W%2FP5p9KemSpXdw%3D%3D",
    "evertask.css": "ZkJtUuS37LsfNjdUiwjuIw%3D%3D",
    "not.css": "32KNGfV%2Fnc4%2B%2BW4J1VUsag%3D%3D",
    "publichack.css": "ZvvTG3paTzUgt4M%2FTaYtaw%3D%3D",
    "savezcg.css": "W2xfmMHIoETCpwLoSt5cRw%3D%3D",
    "selfsearch.css": "XkdIte2Qynogw3fDAwIqCQ%3D%3D",
    "set.css": "3X2ChM8SE9WIWC%2BIyNMgfw%3D%3D",
    "feature_meal_guide.css": "putXLVZ6X4kHFflfudUH0Q%3D%3D",
    "feature_meal_upgrade.css": "PujRVdVrD%2FEPl%2Fw5FTrrNQ%3D%3D",
    "myrings.css": "8wQlhlft8mZYr6GgyB8rOA%3D%3D",
    "subscribetab.css": "dSbMBorJmy516iNiyuaF0Q%3D%3D",
    "welcome.css": "axBy0ad8xDWKF%2FLeHDDP3Q%3D%3D",
    "wirelessmusic.css": "iQ7Tssco%2Bix7XKjLKz2w7w%3D%3D",
    "write.css": "I8dov6WYwY3eKfokUCMmHg%3D%3D",
    "index.html.pack.css": "I7zBF61%2Bjz6yvvSTAg%2BcRw%3D%3D",
    "skin_normal.css": "Wi%2FlNVAff3tNReBuwF54yw%3D%3D",
    "account.branch.html.pack.js": "jirygBADHSB%2BXSCxPWdonQ%3D%3D",
    "account.html.pack.js": "Glg%2B1oVaa7uJo4kyDiJA6Q%3D%3D",
    "account_lock.html.pack.js": "hZdpq6xcLMYmV60D7fy9uw%3D%3D",
    "account_lock_edit_password.html.pack.js": "woVYWJKkiOSnxiCu6flW0Q%3D%3D",
    "account_lock_verifycode.html.pack.js": "x0fOtcZAsyNAKnDt2EziOg%3D%3D",
    "add_pop.html.pack.js": "K3QlQi1gMUHKnYgt5ODq9A%3D%3D",
    "addr_clean.html.pack.js": "anKkpulHpnbv64YKKx0SNA%3D%3D",
    "addr_detail.html.pack.js": "umdHUdVw%2BtJ48038KNj%2F4Q%3D%3D",
    "addr_importclient.html.pack.js": "7Edpe9hGYx4eXzN95wQCxw%3D%3D",
    "addr_importhome.html.pack.js": "mUBCWZGCTJfvjzZWURq9%2Bg%3D%3D",
    "addr_index.html.pack.js": "o%2FjQuv5fwNP2ZPSqjVvP7Q%3D%3D",
    "addr_maybeknown.html.pack.js": "mA4C70ExzRKq7CAljJAHkw%3D%3D",
    "addr_merge.html.pack.js": "gef28ThLfZQHxJdFTwTw7A%3D%3D",
    "addr_onykeyaddsuc.html.pack.js": "KMWPkoC9maGD%2BGQDhtd4RQ%3D%3D",
    "addr_request.html.pack.js": "2W6j0SrROYEwT%2Fj1uNimGw%3D%3D",
    "addr_updatecontactinfo.html.pack.js": "3nFLnnONYh9SxWdIYDz37g%3D%3D",
    "addr_zh_hans.pack.js": "dw%2FQuzewxcvCGCuN%2B5UpsA%3D%3D",
    "calendar_reminder.lib.pack.js": "IlIgSM7aez586S3vY3wSDg%3D%3D",
    "card_sendcard.html.pack.js": "8mmhzAfxY3Ow0rgbOpDDDw%3D%3D",
    "card_sendmms.html.pack.js": "h%2FMtyVvTKKp%2BC0WMF2yosw%3D%3D",
    "classify.html.pack.js": "l3%2BpEzI86xyfCN6FacTDIQ%3D%3D",
    "cleanmail.html.pack.js": "l2EiUhK9pHO40MWiMRnurQ%3D%3D",
    "compose.html.pack.js": "jisr9yOw46yMNwRfbNU4oQ%3D%3D",
    "create_sort.html.pack.js": "jEOQcvzTb6l0D9sQK1uWRA%3D%3D",
    "fast_create_sort.html.pack.js": "SiZ4SxeHKD2D24Z3XmiIfw%3D%3D",
    "features.html.pack.js": "5UdrKyozk7G%2BTiPSmlEILA%3D%3D",
    "filemail.html.pack.js": "imn%2FZ%2FmmVH%2BQEcLy1dXsMQ%3D%3D",
    "focusimages.html.pack.js": "rZo4bQJfMp22slb%2BFIFJHw%3D%3D",
    "index.html.pack.js": "7PJhEL7UBODv2PIr0SYQrw%3D%3D",
    "lazycard.html.pack.js": "1M9EoZl7pmKlW9i7c16LEA%3D%3D",
    "libs.pack.js": "3MEbMh8CL7qNQw%2B2%2FHCgWQ%3D%3D",
    "logoff.html.pack.js": "2SPSZhiVffZd5lZZqVO0lg%3D%3D",
    "m139.core.pack.js": "iCcei5XPwFiLj3SiDWkdrg%3D%3D",
    "m2011.utilscontrols.pack.js": "Qa78%2FTqdT0k%2BjaYIBIM8jQ%3D%3D",
    "m2012.matrixvm.pack.js": "SwfVLi1SDc6cSeA0zEooVg%3D%3D",
    "m2012.settings.rings.pack.js": "G4f4BWHSQGKzfg2nvGgIGQ%3D%3D",
    "m2012.ui.common.pack.js": "FgwM6FvjYbtDsDIxn8WzrQ%3D%3D",
    "m2012.ui.largeattach.pack.js": "ScwGTK9qs41JG1cKhTG07w%3D%3D",
    "m2012_contacts_async.pack.js": "2%2FtxNc4HrOJaO06gX2ng4g%3D%3D",
    "miniquery.pack.js": "30MgyTbUKIBI4332xOP70w%3D%3D",
    "mnote.html.pack.js": "VKjx2d49%2B3CNjs6xjbW3Mw%3D%3D",
    "mobile.html.pack.js": "C86r3DoNdsuftWGvbRkoVg%3D%3D",
    "modify_passowrd.html.pack.js": "g34b0ql8JPPsSAROR9aVPA%3D%3D",
    "netdisk.html.pack.js": "Y5lpvEjov2Z10%2Ffz6aK16w%3D%3D",
    "notice.html.pack.js": "VuVKsvKQ9ytCrB%2Flcx4Ykg%3D%3D",
    "notice_ext.pack.js": "iC4Mxui0cNiV8Pp7AhbQyg%3D%3D",
    "notice_ext_2011.pack.js": "JdwD5ymYz88Q6xElncKD6g%3D%3D",
    "online_preview.html.pack.js": "O0w0KM20x%2FvvrxlT8D1DmA%3D%3D",
    "onlinetips.html.pack.js": "WKvFeTVWRg0MNJsgvb4bRA%3D%3D",
    "operatetips.pack.js": "N5SANv3JObRYeFTNm93rew%3D%3D",
    "password_email.html.pack.js": "yqyk%2B7vzUmxlHWQUZsOPBg%3D%3D",
    "password_question.html.pack.js": "avOCOFoglAR7sVlH33z45A%3D%3D",
    "pop.html.pack.js": "jdz3MAlbaMTVcjbkXMyozw%3D%3D",
    "preference.branch.html.pack.js": "D1NvugIkARyV%2BiH11P1Ziw%3D%3D",
    "preference.html.pack.js": "%2FA9L6tseYE9%2FaXsRhp7WzA%3D%3D",
    "product.main.html.pack.js": "4mcJuQ3oMuZmrvBMNoQgUg%3D%3D",
    "richinput.html.pack.js": "7vfOuvllgopfz1SDvvjBXw%3D%3D",
    "set.selfsearch.html.pack.js": "acjo5NmyyGsYSl3ssO1Tgg%3D%3D",
    "sort.html.pack.js": "BniSELQbb6BxfNpaegykvQ%3D%3D",
    "spam.html.pack.js": "kuDOD0viPSLY%2FOHNiupjkQ%3D%3D",
    "storagecabinet.html.pack.js": "X4mF4BIBulZNIrwkUQSqig%3D%3D",
    "tags.html.pack.js": "YhXPyftaeBiZZrNKjobH%2FA%3D%3D",
    "taskmain.html.pack.js": "zoa1Le%2BaUe2CvV9m91RbSQ%3D%3D",
    "uec.lab.html.pack.js": "FWkBIhEjuBxfB5rJklChyw%3D%3D",
    "verify_lock.html.pack.js": "4N2ZjG7y%2Fd4%2FZkQvdbZWxw%3D%3D",
    "welcome.html.pack.js": "bZPrhc5Flw4bPfmMJ6sdqg%3D%3D",
    "welcome.prod.main.pack.js": "9yCKwsclo585hScdAL%2BNwg%3D%3D",
    "write_ok.html.pack.js": "jffin8Zuy3pAjOvuzF2JHw%3D%3D",
    "importresult.css": "vKpQPi2wSY42Qo5Juet%2BpA%3D%3D",
    "btips.css": "DGUk9ooaJvH%2FobG5cmrbxw%3D%3D",
    "139tool.css": "ovExv4WAK1OXA5l4AZ6ueA%3D%3D",
    "fileExp_global.css": "2fwwDDZukADOd6xHgl5Jww%3D%3D",
    "initset.css": "ZfIYdXCc2YCtEOn0vbKZIg%3D%3D",
    "skin.css": "QdltLBxNXTO0cnz1KcTpRg%3D%3D",
    "skin_cat.css": "qee4VGV42Lcx9ZoINznbmg%3D%3D",
    "skin_golf.css": "7HOOosrWMRDAifVwLcJtww%3D%3D",
    "skin_light.css": "rgSvOmG4qfwpym4kwaSB1Q%3D%3D",
    "skin_pink.css": "QAw2UYSyBLd1EdDe5Q4FzQ%3D%3D",
    "skin_star.css": "4BmLr2%2FJndNT%2BwVyWgD5rQ%3D%3D",
    "addr_importresult.html.pack.js": "hCN6tl7O6bVn9%2ByU%2BrYuYA%3D%3D",
    "addr_mailtofriends.html.pack.js": "wpIXtAU3z4Do0XqnMxNuPA%3D%3D",
    "api.mockdata.pack.js": "cHJgiDHuyeJTahKtd860Dw%3D%3D",
    "cabinet.html.pack.js": "xfD9kViAlNmlwpdU2LHgCA%3D%3D",
    "cabinet_send.html.pack.js": "uznKEAAoCYPTghNlno0%2BFw%3D%3D",
    "cabinet_write_ok.html.pack.js": "naeQ5J%2BBSqMYBMUbgZ3OIQ%3D%3D",
    "cabinetframe.html.pack.js": "qeJnNE0kvGjcUnUwINj7gg%3D%3D",
    "calendar_editlabel.html.pack.js": "wElGK18qttyYqEGeUT64gQ%3D%3D",
    "calendar_reminder.add_appointment.html.pack.js": "guiNRLjZ8S2yfPjv8y042Q%3D%3D",
    "calendar_reminder.add_baby.html.pack.js": "Ac9N%2FDsRBrDBB2hgl7cPvw%3D%3D",
    "calendar_reminder.add_birthday.html.pack.js": "2fqhIDVynIukHXDNmFug4Q%3D%3D",
    "calendar_reminder.add_pay.html.pack.js": "AXDP1kgKnSVMoGaQM6fbAQ%3D%3D",
    "calendar_reminder.add_race.html.pack.js": "r767AoxO%2FmXtCdvc1%2FSzhQ%3D%3D",
    "calendar_reminder.add_special.html.pack.js": "UK%2FmoILjWWs3xzs1msTHlg%3D%3D",
    "calendar_reminder.day.html.pack.js": "qwOE4V8A2vbE5KUU%2FlSZvg%3D%3D",
    "calendar_reminder.edit_label.html.pack.js": "I%2Fq6ZrxxMrcW4z9wGKkoZw%3D%3D",
    "calendar_reminder.edit_schedule.html.pack.js": "9UwAF8AjA3NigTAKrE7VRg%3D%3D",
    "calendar_reminder.list.html.pack.js": "HTDzl0YfeCCzvoiB75GtRg%3D%3D",
    "calendar_reminder.list_baby.html.pack.js": "y0xXM9EjuXeEy1v39rGLxw%3D%3D",
    "calendar_reminder.list_system.html.pack.js": "ANvXeq8N9%2FXiQRWGjBjvCw%3D%3D",
    "calendar_reminder.message_box.html.pack.js": "BuKXrLKWRc%2BrKGcvq%2FFagw%3D%3D",
    "calendar_reminder.month.html.pack.js": "EsY4vCnG%2FTE1FTf7fDpE0w%3D%3D",
    "calendar_reminder.out.html.pack.js": "HGtFDy199pZ%2BtZfShd77FA%3D%3D",
    "calendar_reminder.week.html.pack.js": "%2BDYjC8x8F0ovXZHooik7pQ%3D%3D",
    "calendarday.html.pack.js": "ZCFW4gTwADQsW9oS%2F5Gyfg%3D%3D",
    "calendaredit.html.pack.js": "TYYA0ye2pmaPQYMSckk22g%3D%3D",
    "calendarmonth.html.pack.js": "nyVuNOnwXqaSDFifK%2BpgoQ%3D%3D",
    "calendarout.html.pack.js": "Nuso52uEAUXk22j1QjbEMw%3D%3D",
    "calendarweek.html.pack.js": "KfexsSKekda8TvBaS%2Fl1rA%3D%3D",
    "diskframe.html.pack.js": "fdMZYwcgKgVLjA8aJWXtIQ%3D%3D",
    "importmail.html.pack.js": "1a3fJUF8hsP3IgwkNiPzwQ%3D%3D",
    "initset.html.pack.js": "%2Fm3hQPZs%2BZxFIBig7jTB%2FQ%3D%3D",
    "m2012.product.birthdaywish.pack.js": "UJ3wXLrWacneyzBZ7gPDKA%3D%3D",
    "music.html.pack.js": "EeP1GupEWofSIV41G7sDQw%3D%3D",
    "selectfile.html.pack.js": "3Rtwp2hQVsVNqr5RzCqt1A%3D%3D",
    "revival.css": "wQipMUxIGArY1SYiBpyWZw%3D%3D",
    "smsnot.css": "%2BGiidNWBeO2oCyrbkOrZHQ%3D%3D",
    "calendar_reminder.manage.label.html.pack.js": "iA1XWR%2FDtJyfCWqCZkZWUA%3D%3D",
    "disk.html.pack.js": "UE9zqKyDtK%2FvzAY%2FfbGIwg%3D%3D",
    "addr.css": "aWMwgM%2FV3T0QG%2FybX7KGsg%3D%3D",
    "hall.css": "f1PuAtUKuZtgoh0t4CFeKg%3D%3D",
    "skin_cat_index.html.pack.css": "d7FxdjHjXz%2B1ih%2BjS%2F23jg%3D%3D",
    "skin_golf_index.html.pack.css": "US0rI11U1UN%2BZBo3vM1KpA%3D%3D",
    "skin_light_index.html.pack.css": "msTyb1g28%2BF2HNXeBV%2Bwcw%3D%3D",
    "skin_normal_index.html.pack.css": "qeRSTHJb2PFAuj5160wlBA%3D%3D",
    "skin_pink_index.html.pack.css": "JvUION70dpkVDImBENtsLw%3D%3D",
    "skin_star_index.html.pack.css": "EXzpefvtoOPiX6HrGhrAtw%3D%3D",
    "calendar_reminder.common.pack.js": "r47r8t%2BG4wR0lf8M8c4FcQ%3D%3D",
    "calendar_reminder.miniquery.pack.js": "uuPPZwUO4N8AOnBEBBr%2FdQ%3D%3D",
    "calendar_reminder.msgbox.html.pack.js": "MPqi20slfVnlu5x4imq04A%3D%3D",
    "m2012.smsnotifyfriends.pack.js": "TuU0ZN27LdV%2FQ1R6DY1h5Q%3D%3D",
    "calendar_reminder.richinput.html.pack.js": "Kp5mTndgbzqOny4E3pANOQ%3D%3D",
    "m139.core.out.pack.js": "j0fVhu8xjJw8vMUE5TlCqg%3D%3D",
    "mailremind.html.pack.js": "Gk%2BBeEsvRdkopWOshe3SGg%3D%3D",
    "skin_brocade_index.html.pack.css": "yv7u7M9rltO517skyfkndQ%3D%3D",
    "skin_flowers_index.html.pack.css": "PjbP1un8%2BPyDmQB10MdO8g%3D%3D",
    "skin_mstar_index.html.pack.css": "MzZvFruTWhrwsJ5x4aVufA%3D%3D",
    "skin_paint_index.html.pack.css": "WvJTnwyJdq9PDrXSl0JA8Q%3D%3D",
    "skin_rose_index.html.pack.css": "zYofDAQFDLE55BOyG95V6g%3D%3D",
    "skin_sunflower_index.html.pack.css": "okjvSs0TbZP39QurMq62Vg%3D%3D",
    "skin_sunset_index.html.pack.css": "dIb8vjKKXOpN%2FSrKrIXdsA%3D%3D",
    "skin_brocade.css": "KkEah1xPfGZnn0M%2BMM7kmA%3D%3D",
    "skin_flowers.css": "A6WOWzVX%2FxwHQ60eyHL11w%3D%3D",
    "skin_mstar.css": "czhJs5XIXRPm60LsRJtUtg%3D%3D",
    "skin_paint.css": "FxrQh82Wo49bnA4GR3WLSg%3D%3D",
    "skin_rose.css": "gFy%2B%2FhSTcoY5jMflQuBNPQ%3D%3D",
    "skin_sunflower.css": "BmaxiS0YzMG%2FPXyk%2ByaD3w%3D%3D",
    "skin_sunset.css": "BlV3k1JU9ZtZRUHes6KFaQ%3D%3D",
    "addr_basicinfo.html.pack.js": "IFQF%2F482hmgiKKYQPW%2F3%2FQ%3D%3D",
    "addr_businessinfo.html.pack.js": "7%2FCRsnldhfO%2BnVGy2auNIQ%3D%3D",
    "addr_contact.html.pack.js": "CwE6L7bI80cmqSLEsRceog%3D%3D",
    "addr_mypicture.html.pack.js": "Q7LA%2BjeHq%2Br6NiKeDL%2B36w%3D%3D",
    "addr_personalcir.html.pack.js": "QJ%2B9MTmtaKFjS%2FqapHehyw%3D%3D",
    "calendar.search.html.pack.js": "FrSmWZkKzmK3qo%2F5Kp1gCQ%3D%3D",
    "evocation.pack.js": "IpT22r5mvNm4sTj9cLBHWA%3D%3D",
    "fontbase.css": "z2WCTky1kCx1uouKA3JJUw%3D%3D",
    "addr_share_home.html.pack.js": "cBdzwT1tWUywlwzz65uRZQ%3D%3D",
    "calendar_reminder.view_schedule.html.pack.js": "KdUf3yWVsl1dHCKKS%2F3Q%2FQ%3D%3D",
    "letterpaper.htm.pack.js": "sARfvnKEJrsZKcifrn3Z7A%3D%3D",
    "welcome_v2.html.pack.js": "UMn8jjIHvisuhsN7lqB2CA%3D%3D",
    "welcome_weather.html.pack.js": "AlFGTiyoZaSnwYexugzRWg%3D%3D",
    "cloudPostOffice.css": "XNmkKF83ZKOzBsv1ms6G%2Fw%3D%3D",
    "hall.biz.html.pack.js": "xZ1omfH7lmWqzYhAriAUDg%3D%3D",
    "hall.index.html.pack.js": "eCrj29Xhl0EVUlrCkZF2AA%3D%3D",
    "hall.mybiz.html.pack.js": "cLQHz0t2TP5Nv70tmDOgJg%3D%3D",
    "hall.points.html.pack.js": "e92VDMItd7iMnbV2gOdQ1A%3D%3D",
    "m2012.addmailnotify.pack.js": "L3QXe%2F02OThFl%2BQJdYpUeQ%3D%3D",
    "tip.calendar.msg.html.pack.js": "YtEztT1ykt9KVDi74Nf3wg%3D%3D",
    "netdisk.css": "hx3Sz92BwSOSEEPwwjQKEA%3D%3D",
    "skin_mcloud_index.html.pack.css": "zJA%2FUUxj0eD5KpuFGt0O3w%3D%3D",
    "skin_mcloud.css": "Ax7RCbnOvrrfmWyPyNdegA%3D%3D",
    "m2012.contacts.tellnew201311.pack.js": "KovK4SZxUSAbCLVUDGp%2BgQ%3D%3D",
    "m2012.contacts.vcard2013.pack.js": "DNSCFUhCPEzGeJP1v6oVpQ%3D%3D",
    "addr_maybeknown_prod.pack.js": "RcXTGLhPJmjG5dzdGYNI9A%3D%3D",
    "atta.css": "eVU09G7Tv7aaj8t4pkFVvA%3D%3D",
    "square.css": "euDKVp3zHxASaUVKowyeTw%3D%3D",
    "calendar.getPublicCalendars.pack.js": "Z9ARK0%2F10LgJ5DLD3gAkTg%3D%3D",
    "calendar.square.html.pack.js": "MNGLvyhm4Bm6GJMkSLtZOw%3D%3D",
    "m2012_contacts_saveinbox_async.pack.js": "Nt%2FnKRB6Sp1GgPlAamvsig%3D%3D",
    "welcome_v3.html.pack.js": "Rgth3jbsLB%2F7TLQyUxl7dg%3D%3D",
    "skin_newyear_index.html.pack.css": "gj%2FujGXDaNIo0UFaSPYjmw%3D%3D",
    "skin_newyear.css": "b8QNxKKUtjmsbNwlamOzJQ%3D%3D",
    "skin_cherry.css": "5pHOaUKCJminzKmDpCTsqg%3D%3D",
    "skin_dew.css": "EqbGv9T3H4Wd4cI6Ojlpjg%3D%3D",
    "skin_lithe.css": "F7Kl6XOPuJcBQCmIEQCOuA%3D%3D",
    "skin_warm.css": "cGLiF2fjiFvngtDAbEMYWQ%3D%3D",
    "player.css": "avldJ4cs%2FsEOaGj6E7nlbw%3D%3D",
    "qiuckre.css": "D9HG04fkxMiD3SXM897RDg%3D%3D",
    "skin_cherry_index.html.pack.css": "5lb13Dl8Y1bnt92u97Nexw%3D%3D",
    "skin_dew_index.html.pack.css": "U4Hid5ABCuDWnrrzgkycGA%3D%3D",
    "skin_lithe_index.html.pack.css": "wXeQEPn75zHkcVzW6s2Yyg%3D%3D",
    "skin_morning_index.html.pack.css": "x7RQgUxjLA7X4Lv6tA32sg%3D%3D",
    "skin_night_index.html.pack.css": "XoUnqNYbKmZuTTFDcNAHng%3D%3D",
    "skin_warm_index.html.pack.css": "lQQCg2ImnXFP95IgpBycLQ%3D%3D",
    "skin_morning.css": "0E%2FWFS8pQlsyK1aqsakAtw%3D%3D",
    "skin_night.css": "iRb%2FKZ8kAcMf6SQmlty0kA%3D%3D",
    "coversationcompose.html.pack.js": "WtK%2BvGFGAMw3yuhSTDB%2Bvw%3D%3D",
    "NetdiskToolDownload.css": "oDam6cISLQfWg5Qd2S7qtg%3D%3D",
    "skin_autumn_index.html.pack.css": "hHsLMSrb72y9MiU07bx5VQ%3D%3D",
    "skin_child_index.html.pack.css": "TS5sMY7c2WZW4VlUKejYBA%3D%3D",
    "skin_spring_index.html.pack.css": "WDqW7wpUAVOxssLzzje4fw%3D%3D",
    "skin_summer_index.html.pack.css": "q4f9%2F%2BFaSaXI8fny9uvuuA%3D%3D",
    "skin_winter_index.html.pack.css": "h%2FRJLfFdEUmz7Qa8KAfCGw%3D%3D",
    "skin_woman_index.html.pack.css": "%2BkKkmjrqydYO427o0YF%2FFA%3D%3D",
    "skin_autumn.css": "TiDtcRxMexa8pYMiYivQ0g%3D%3D",
    "skin_child.css": "WOWB4Mu%2BOE%2B6JCdfp%2FR8MQ%3D%3D",
    "skin_spring.css": "1DtpYIC%2Be6Fc6lxC23H42w%3D%3D",
    "skin_summer.css": "irrYCt6vZUQRgX2gl4ZN5A%3D%3D",
    "skin_winter.css": "rUOC3EsLtSVESNGwXRbYGA%3D%3D",
    "skin_woman.css": "lNSzZppUHO4sxWqxTl9Mog%3D%3D",
    "addr_import_clone.html.pack.js": "Ty%2FDzIQY%2B7KCQJ2R8y%2Fg5A%3D%3D",
    "addr_import_file.html.pack.js": "6kzVVd6nxe2jRAmopruZuA%3D%3D",
    "addr_import_pim.html.pack.js": "wAGgnCRBK%2B4Z5U%2F4xMDuOA%3D%3D",
    "card_sendcard.html.pack.source.js": "D5%2FVfUMjZIOv88o1DxV8WA%3D%3D",
    "addrnew.css": "K8xGj9NJYjhGxsjLVnE66w%3D%3D",
    "networkDisk.css": "gIxlLmYjTxLDg%2BSDdQq%2F1Q%3D%3D",
    "conversationrichupload.html.pack.js": "DAAHGYoJbZA8Rwl5T%2FsMpg%3D%3D",
    "index.html.pack2.js": "SAtgb%2BFxzfwpruPhlKGziQ%3D%3D",
    "sengcard.css": "BtRIq6PHpL6%2Fu%2FNdYjrv2A%3D%3D",
    "calendar.css": "pIy4hOdTBvTLwlbY4z%2FLWw%3D%3D",
    "calendar.pack.css": "P5TE1H225eLyRmSBkL%2FKfg%3D%3D",
    "s_global.css": "aLMp2piT40CZx9itXLnJQA%3D%3D",
    "skin_purple.css": "ETZdIh5c66pvl8p2oVHSoA%3D%3D",
    "skin_皮肤.css": "PEqfUFPbmAJ1rlu3YtxfoA%3D%3D",
    "cal_labelmgr.html.pack.js": "gr3JkigP01Xrqrdaxepntw%3D%3D",
    "cal_schedule.html.pack.js": "y78oyVe8YIBDKLdYmIfEiQ%3D%3D",
    "cal_activity.html.pack.js": "d12HHwfMlkz12A7ZTAKJwQ%3D%3D",
    "cal_activity_viewer.html.pack.js": "8xu9NfS%2FnDTZGew8dPER1A%3D%3D",
    "cal_discovery.html.pack.js": "it1sVcU0aZqrYIMMCCs8bg%3D%3D",
    "cal_index.html.pack.js": "8DwuyDBfB8T3TGJXqZL%2FeA%3D%3D",
    "cal_index_addLabel_async.html.pack.js": "%2FLfobf%2FUEFYbx%2B0bc%2BXPpA%3D%3D",
    "cal_index_async.html.pack.js": "trfdMWo1PhQkcK%2BwfD6mbA%3D%3D",
    "cal_index_discovery_async.html.pack.js": "ZYv8Bwj%2BV2NhLliNviVxFQ%3D%3D",
    "cal_index_list_async.html.pack.js": "qKmbp9DQHnMgEt%2B054wMnA%3D%3D",
    "cal_index_listview_async.html.pack.js": "2GGDJ3gnkc7D85tIe%2BES3Q%3D%3D",
    "cal_notify.html.pack.js": "fSMOBtq8Ab%2FxptHTeNma%2Fg%3D%3D",
    "addr_contacts_list.html.pack.js": "O7xitW5PfplyfXUWrteWoQ%3D%3D",
    "addr_groups_list.html.pack.js": "cJCrKtz%2BUWf4cVqI2k1EWw%3D%3D",
    "addr_master.html.pack.js": "lQYsk1DHARSWDMuY5U4nUg%3D%3D",
    "cal_message.html.pack.js": "jycNiFcy7iQLJqy24nC0Aw%3D%3D",
    "cal_search.html.pack.js": "n9QhA8uXMcdvocPuq9oTGA%3D%3D",
    "cal_index_day_async.html.pack.js": "Kc99i%2BRowILsNYltHImL2Q%3D%3D",
    "m2012.changeskin.pack.js": "rc7YhM1JHm4geEKOtRLXdA%3D%3D",
    "conversationcompose.pack.css": "No%2FW1efP3iBST29uQGrHIw%3D%3D",
    "cal_edit_label.html.pack.js": "RjLH5NbR2zmZCI26BLT1Vg%3D%3D",
    "cal_view_sharedorinvited_schedule.html.pack.js": "n93KIN8ZzVb58%2BvxzJI9ZA%3D%3D",
    "cal_add_pop_activity.html.pack.js": "pZ%2B8YYQZk21ych0VdJLcHw%3D%3D",
    "cal_view_pop_activity.html.pack.js": "S4S0DsB1HMndcCIbJAs5Bw%3D%3D",
    "cov.css": "nOWd5j0tiwbvBmaC7kz%2BoA%3D%3D",
    "addr_home_base.html.pack.js": "HmbsZZU7fugVjlI%2B2q9tKg%3D%3D",
    "addr_home_index.html.pack.js": "sYL25aC78%2Bl4PNMJohbLmw%3D%3D",
    "addr_home_main.html.pack.js": "7jtkxYgG%2Bpi4noAlYsj5dg%3D%3D",
    "cal_index_dayview_async.html.pack.js": "nSmFZQjinnvN3qnJ%2BMhLzQ%3D%3D",
    "skin_bluesky_index.html.pack.css": "l%2FzLRhi%2B%2BOFmh0%2FtaAsmYg%3D%3D",
    "skin_lightblue_index.html.pack.css": "BXiPbEqLnNrmD5wfGS%2BrrA%3D%3D",
    "skin_bluesky.css": "A8KIEdC%2FpEQuWdYTRW8tUQ%3D%3D",
    "skin_lightblue.css": "ZIvF0ps6b3buLEfvBahfCQ%3D%3D",
    "addr_home_andAddr.html.pack.js": "SyoyIEKqqLFrsdu%2BOFJuxg%3D%3D",
    "cal_edit_activity.html.pack.js": "zzyHjQrVk6SMfJGrYB0s%2Bw%3D%3D",
    "cal_pop_activity.html.pack.js": "ld9hJIwwiPc0%2FCKdIekKXw%3D%3D",
    "cabinet_write.html.pack.js": "oQ9GeXadByNJeF0cAoplUw%3D%3D",
    "disk_write.html.pack.js": "e1q6ekC61hBapEI9PsDjVw%3D%3D",
    "largeAttach.html.pack.js": "Hf5NgaN0%2BiJ8V5QN0A%2Bx9Q%3D%3D",
    "picture.css": "Ym1luInfk64j%2BN45044rwQ%3D%3D",
    "videoPlay.css": "xgUCahMPaXqTns2%2FjfRsqg%3D%3D",
    "skin_red_index.html.pack.css": "RW74OmbQcJeX6%2F5Tz2664w%3D%3D",
    "skin_red.css": "Wi%2FlNVAff3tNReBuwF54yw%3D%3D"
}
//</fileConfig>
