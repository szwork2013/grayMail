﻿var SiteConfig = {
    labelIframeLoadingRelease: true,
    compressSendMailRelease: true,
    m2012NodeServerRelease: true,
    unifiedPositionStatic: true, // 统一位置广告使用静态化js 涉及到欢迎页广告和tips
    unifiedPositionUrl: "http://images.139cm.com/web_content_op/staticFile", // 统一位置静态资源文件的配置路径
	tabSetRelease: true,
    flashDomainReg: /./,
    mailDomain: "139.com",
    diskDev: "http://smsrebuild1.mail.10086.cn/disk/netdisk",
    ssoInterface: "http://ssointerface.mail.10086.cn:8080/ssointerface",
    embedRelease:true,
    isDev: '',
    scriptLog: "/mw2/weather/weather?func=user:monitorLogAction",
    behaviorLog: "/mw2/weather/weather?func=user:logBehaviorAction",
	billPath:"/mw/mw/billsvr?func={api}&sid={sid}",
	calendar_version:"20131101",
    myTask:false,
    checkIn:true,    
    onlineTips:true,
    plugOnlineTip :true,
    loginOnlineTip:true,
    emailOnlineTip:true,
    userOnlineTip: true,
    moreAlias: false,
    isShowLazyCard: true,
    ssoLogin: true, //第三方授权登录
    birthMail: true,
    mailNotice: true, //邮件到达通知5类改3类
    comboUpgrade: true, //套餐引导开关
    mealUpgradeAlias: true,//套餐详情调用新接口，屏蔽别名数量,别名长度
    
    isQuicklyShare: true, // add by tkh 文件快递重构开关
    isDiskDev: true, // add by tkh 网盘重构开关
	calendarPostcard: 10556,  //add by xyx    日历生日活动指定发贺卡ID
    
    //addr config
	isRemind: true,  //二度关系控制入口
    addrOutputSearch:false, //联系人导出页面的搜索功能是否开启
    showCaiYun: true, //是否在短彩页，显示彩云通讯录导入 入口
    showOutlookTool: true, //是否在通讯录页，显示Outlook小工具
    showBirthRemind: false, //通讯录好友生日提醒设置
    showImportResult: true, //新的导入结果页面
    addrbatchdisable: true,
    saveinboxcontact: true, //保存入信的联系人
    newContactsBack: true, //通讯录返回入口开关
    addrSysUpdate: true, //数据库分库开关
    //end addr config

    //#region calendar config
    isLotteryStarted: false, //马上邮奖活动是否已经展开
    //#endregion
	
	//disk config
    // pc客户端推广页面链接 引用页面：网盘，文件快递，附件夹及文件共享管理
    pcClientSetupHtml: "<a id=\"setupDiskTool\" href=\"javascript:top.$App.show('pcClientSetup');\" class=\"diskDown\"><i class=\"diskPc\"></i>彩云网盘PC客户端发布了，立即安装体验吧！</a>",
    //end disk config

	calendarRemind:true,//日程提醒增加开关
	//isLoadingCalendarRemind:true,//日程是否已经更新好
	colorCloudRelease: true,
	showBirthwish: true,
	showMicroBlog:true,
    showUmcUpgrade: true, //是否显示用管中心升级
    showUmcBox: true, //是否显示用管中心盒子

    tipsMassLink:true,
    yearLottery: false, //年终“邮”
    showCornerPic: false, //欢迎页右上角撕角广告
    evocation:true,
    showShiningIntro: false,
    //懒人贺卡改版了，不用静态配置贺卡内容，读取贺卡接口获取，但注意配置正确
    // key： 统一格式 6位字符 2014cj，前面4位是年份，后面2位是节日简称 如（cj 春节, yx 元宵节, ld 劳动节）
    lazyCard: { key: "2014dw", begin: "2014-05-27", end: "2014-06-02" },
    showLottery: false,
    billAllowProvince: { '1': 'gd','17': 'gd','26': 'gd'},
    billChargeUrl: "http://icmcc.mail.10086.cn/huidu/MailOffice/main/goUrl",  //顶部导航
    billChargeWelcomeUrl: "http://icmcc.mail.10086.cn/huidu/MailOffice/main/gdindex?sid=",   //欢迎页选项卡
    //footballUrl:"http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201405A1",  
    shanxiMail: true,  //陕西收费邮箱产品需求
    volumeSetByUs:true,
    showNewWriteOk:true  //显示重构后的写信完成页
};

var domainList = {
    1: {
        subscribeUrl:"http://appmail3.mail.10086.cn/subscribe/inner/bis/",  
        webmail:"http://g3.mail.10086.cn",
        addr: "/addr",
        sms: "/sms",
        middleware: "/mw",
        disk: "/disk",
        setting: "/setting",
        colorcloud: "http://smsrebuild0.mail.10086.cn/colorcloud/",
        rebuildDomain: "http://smsrebuild0.mail.10086.cn",
        lotteryRequest: "http://smsrebuild0.mail.10086.cn",  //用于区别测试线
        rarPreviewSaveDisk: "http://172.16.210.51", //压缩包内的文件存网盘下载地址需要用IP
        dingyuezhongxin: "http://subscribe3.mail.10086.cn",
        resource:"http://image0.139cm.com",
        uec: "http://smsrebuild0.mail.10086.cn/uec/"
    },
    12: {
        subscribeUrl:"http://appmail.mail.10086.cn/subscribe/inner/bis/",  
        webmail: "http://g2.mail.10086.cn",
        addr: "/addr",
        sms: "/sms",
        middleware: "/mw",
        disk: "/disk",
        setting: "/setting",
        colorcloud: "http://smsrebuild0.mail.10086.cn/colorcloud/",
        rebuildDomain: "http://smsrebuild1.mail.10086.cn",
        lotteryRequest: "http://smsrebuild1.mail.10086.cn",  //用于区别测试线
        rarPreviewSaveDisk: "http://172.16.210.162:80", //压缩包内的文件存网盘下载地址需要用IP
        dingyuezhongxin: "http://subscribe2.mail.10086.cn",
        resource: "http://images.139cm.com",
        uec: "http://uec.mail.10086.cn/"
    },
    global: {
        happyMailUrl:"http://zone.mail.10086.cn",
        subscribeUrl:"http://appmail.mail.10086.cn/subscribe/inner/bis/",
        betadomain: "appmail3.mail.10086.cn",
        image: "http://appmail3.mail.10086.cn/",
        mail:"http://mail.10086.cn",
        weibo: "http://auth.weibo.10086.cn",//移动微博登录地址
        weiboHome: "http://weibo.10086.cn",//移动微博主页
        fetionSpace: "http://i2.feixin.10086.cn/",
        fetionWebIMInitUrl: "http://webim.feixin.10086.cn/webimbar/initialize.aspx",
        fetionLoginUrl: "http://maillist.i.139cm.com/mail139fetion/LoginFetion",//飞信整合,我方后台登录接口
        fetionFate: "http://lbs.fetion.com.cn",//飞信位缘
        pay139: "https://cmpay.10086.cn/club/fetion_index.xhtml?mail=1&AGENT=139MAIL",//手机支付请求地址
        help: "http://help.mail.10086.cn/statichtml",
        interface_oss: "http://interface.n20svrg.139.com:8080/",	//oss的接口页面
        homemail: "http://homemail.mail.10086.cn",   //精品订阅
        stat: "http://interface.n20svrg.139.com:8080/UrlRedirect/MailRedirect.aspx",//统计链接
        books: "http://hand.139.com",
        mailScribeScriptUrl: "http://images.139cm.com/subscribe/js/subscribeaction.js?v=20120704",
        rmResourcePath:"http://images.139cm.com/rm/richmail",
        diskInterface: "http://disk1.mail.10086.cn/spaceinterface",
        disk:"http://mw.mail.10086.cn/disk/netdisk",
        wmsvrPath2:"http://appmail.mail.10086.cn/RmWeb",
	    uec:"http://uec.mail.10086.cn/",
        loginDomain:'http://mail.10086.cn',
        syncguide:"http://images.139cm.com/rm/richmail/page/sync_guide_inner.html",
        UMCSVR: "http://www.cmpassport.com/umcsso/plugin",
        caiyun: "http://www.cytxl.com.cn/login.php?channel=139mail",
        userzone: "http://zone.mail.10086.cn/api/sso/ssoformail.ashx",
        dingyuezhongxin:"http://subscribe2.mail.10086.cn" //订阅中心的域名
    }
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
    var result = "";
    if (arr != null) {
        result = unescape(arr[2])
    };

    //当灰度中帐号，与全网帐号在相同浏览器下，依次登录，灰度帐号会读取到全网的cookiepartid，这段代码，则根据url中的appmail3进行分区修正。
    if (name == "cookiepartid" && /appmail[^\.]*?.mail.10086.cn/.test(location.host)) {
        var betahost = domainList["global"]["betadomain"];//"appmail3.mail.10086.cn";
        if (betahost) { //有配置才修正
            if (result == "1" && location.host != betahost) {
                result = "12";
            } else if (result == "12" && location.host == betahost) {
                result = "1";
            }
        }
    }
    return result;
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

if (getCookie("cookiepartid") == "1") {
    domainList.global.rmResourcePath = domainList.global.rmResourcePath.replace("images", "image0");

    //日程只灰度
    SiteConfig.calendarRemind = true;//日程提醒增加开关
    SiteConfig.isLoadingCalendarRemind = false;//日程是否已经更新好
}

; (function () {
    //记住登录版本
    setCookie({
        name: "matrix_version",
        value: "2.0",
        expires: new Date(2015, 0, 1)
    });
    try {
        setCookie({
            name: "matrix_version",
            value: "2.0",
            domain: "mail." + document.domain, //2个cookie域都写，向下兼容
            expires: new Date(2015, 0, 1)
        });
    } catch (e) { }
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

        __loadScript = window.loadScript || function(){};//保存原始函数指针
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

//<fileConfig>
var Config_FileVersion = {
    "defaults": "2014-10-15T06:28:03.569Z",
    "frame.css": "L4JR9MwJo4UxBxm6ZqOzpA%3D%3D",
    "global.css": "v7vRylwXr8SZW4vyflfWNA%3D%3D",
    "extract.css": "VvrWlcuShi5QstR7bC7qaw%3D%3D",
    "send.css": "1SmSQWQcrCFBuvaL5hmY5A%3D%3D",
    "addr_float.css": "KOrVr1vXmzn6xEoLxnrO1g%3D%3D",
    "attr.css": "FLxmweYw4GdObgTMTzusQQ%3D%3D",
    "attrview.css": "gYTfQbClmnkpManBKVdHtw%3D%3D",
    "bigattr.css": "CP6U%2BEwWqJih3uOVbMS2EA%3D%3D",
    "bill.css": "0xGteB3vA3vzTp7x76Ft6A%3D%3D",
    "schedule.css": "LzDjukrGQOYnSpFNBivNMA%3D%3D",
    "css.css": "heCmh18Mm8Iv%2FbnUhoampg%3D%3D",
    "upgrade.css": "ZgLMusujF7YJFyUI92NHcQ%3D%3D",
    "m2011.disk.loginSite.css": "Nyp5cghw0OsGay5Z4thfGQ%3D%3D",
    "editer.css": "wIXN4kls0rvqaMHh%2FFFtQw%3D%3D",
    "folder.css": "p6slBpkQ0VJjleQU9YwE5g%3D%3D",
    "imgeditor.css": "rRr5AAMkyFi5lN%2FTFg%2BbEg%3D%3D",
    "inbox.css": "VzHEoDJBswCu4AD683OI%2Fg%3D%3D",
    "lab.css": "DqPsvrl7syUWVKs92mxT3Q%3D%3D",
    "letter.css": "hSLcQdsXjcq2wUxzoajZwg%3D%3D",
    "mailcontent.css": "UdHqNfW8W%2FP5p9KemSpXdw%3D%3D",
    "evertask.css": "ZkJtUuS37LsfNjdUiwjuIw%3D%3D",
    "not.css": "ByBBffo7xonylA7dLacQAg%3D%3D",
    "publichack.css": "ZvvTG3paTzUgt4M%2FTaYtaw%3D%3D",
    "savezcg.css": "W2xfmMHIoETCpwLoSt5cRw%3D%3D",
    "selfsearch.css": "eg2kmG%2FZU2BWq%2FTicnZOSQ%3D%3D",
    "set.css": "lKXzyGxuBgYtAvC7%2BsmOnw%3D%3D",
    "feature_meal_guide.css": "putXLVZ6X4kHFflfudUH0Q%3D%3D",
    "feature_meal_upgrade.css": "PujRVdVrD%2FEPl%2Fw5FTrrNQ%3D%3D",
    "myrings.css": "8wQlhlft8mZYr6GgyB8rOA%3D%3D",
    "subscribetab.css": "dSbMBorJmy516iNiyuaF0Q%3D%3D",
    "welcome.css": "ibnmtIPR1ip%2Ba6DV5L07VA%3D%3D",
    "wirelessmusic.css": "iQ7Tssco%2Bix7XKjLKz2w7w%3D%3D",
    "write.css": "FVxYZDDMwI%2B%2BpKf%2B6JcfTg%3D%3D",
    "index.html.pack.css": "0Fffy5BZvi1%2Ba0mmzBslbw%3D%3D",
    "skin_normal.css": "Wi%2FlNVAff3tNReBuwF54yw%3D%3D",
    "account.branch.html.pack.js": "jirygBADHSB%2BXSCxPWdonQ%3D%3D",
    "account.html.pack.js": "skPMCQO8Lsci%2BGAkgTydJQ%3D%3D",
    "account_lock.html.pack.js": "hZdpq6xcLMYmV60D7fy9uw%3D%3D",
    "account_lock_edit_password.html.pack.js": "woVYWJKkiOSnxiCu6flW0Q%3D%3D",
    "account_lock_verifycode.html.pack.js": "x0fOtcZAsyNAKnDt2EziOg%3D%3D",
    "add_pop.html.pack.js": "K3QlQi1gMUHKnYgt5ODq9A%3D%3D",
    "addr_clean.html.pack.js": "anKkpulHpnbv64YKKx0SNA%3D%3D",
    "addr_detail.html.pack.js": "l6MFIQLmF2YpzZOlUVYVnQ%3D%3D",
    "addr_importclient.html.pack.js": "7Edpe9hGYx4eXzN95wQCxw%3D%3D",
    "addr_importhome.html.pack.js": "mUBCWZGCTJfvjzZWURq9%2Bg%3D%3D",
    "addr_index.html.pack.js": "xkaRhdJ1E2g6bxszuiF0Cw%3D%3D",
    "addr_maybeknown.html.pack.js": "a6mhkesV%2FwJAI17ijObL%2FQ%3D%3D",
    "addr_merge.html.pack.js": "2HdyV0ArQGzLMIijRo1g6w%3D%3D",
    "addr_onykeyaddsuc.html.pack.js": "bP%2Bv4sxr4NAwMa6C9XyjRQ%3D%3D",
    "addr_request.html.pack.js": "owHEP%2FUTkkHv%2BhPVfpPQIA%3D%3D",
    "addr_updatecontactinfo.html.pack.js": "SUZvTzlnQk9t%2Bo7dC7NcjA%3D%3D",
    "addr_zh_hans.pack.js": "dw%2FQuzewxcvCGCuN%2B5UpsA%3D%3D",
    "calendar_reminder.lib.pack.js": "IlIgSM7aez586S3vY3wSDg%3D%3D",
    "card_sendcard.html.pack.js": "aMJ1y9TsACcwy6NPoWYfpg%3D%3D",
    "card_sendmms.html.pack.js": "DV3s8O4jhXpFkvmaQBSs%2FQ%3D%3D",
    "classify.html.pack.js": "pDjiUBzJO%2F4geAFVySDQkw%3D%3D",
    "cleanmail.html.pack.js": "l2EiUhK9pHO40MWiMRnurQ%3D%3D",
    "compose.html.pack.js": "PosvfKncudQMMEjqSrM1Cw%3D%3D",
    "create_sort.html.pack.js": "eGHYUH%2F1uID8aqUmFX05pg%3D%3D",
    "fast_create_sort.html.pack.js": "8G47hNr22X0XXZIC73zn7g%3D%3D",
    "features.html.pack.js": "AJx6hJvT16n0wm93iDcbOw%3D%3D",
    "filemail.html.pack.js": "vDUe7d5mazeIBt%2B6HKZ7kg%3D%3D",
    "focusimages.html.pack.js": "FCVFHyZPsT8OZjZOHDfsHw%3D%3D",
    "index.html.pack.js": "7W1Ag7lqho1%2FQjGhay48aA%3D%3D",
    "lazycard.html.pack.js": "1M9EoZl7pmKlW9i7c16LEA%3D%3D",
    "libs.pack.js": "3MEbMh8CL7qNQw%2B2%2FHCgWQ%3D%3D",
    "logoff.html.pack.js": "2SPSZhiVffZd5lZZqVO0lg%3D%3D",
    "m139.core.pack.js": "sOxRZIHjmGmw7d0uSwyKlA%3D%3D",
    "m2011.utilscontrols.pack.js": "5SBsL74Qc0RU5knNN%2Fq8Uw%3D%3D",
    "m2012.matrixvm.pack.js": "gsIGKr74OJwwaKVczXTUJw%3D%3D",
    "m2012.settings.rings.pack.js": "G4f4BWHSQGKzfg2nvGgIGQ%3D%3D",
    "m2012.ui.common.pack.js": "pw%2F1yja8jRBkIwMTFHpXpQ%3D%3D",
    "m2012.ui.largeattach.pack.js": "ScwGTK9qs41JG1cKhTG07w%3D%3D",
    "m2012_contacts_async.pack.js": "cxa9UESbLAK%2BAbVElusRTQ%3D%3D",
    "miniquery.pack.js": "IWsxzLd6f7yDh1tUgGCxzQ%3D%3D",
    "mnote.html.pack.js": "n9JyOVX%2FS3WGYbl%2Bqikb4A%3D%3D",
    "mobile.html.pack.js": "nb9%2BEy%2FMl4FYKYDOF4J98A%3D%3D",
    "modify_passowrd.html.pack.js": "g34b0ql8JPPsSAROR9aVPA%3D%3D",
    "netdisk.html.pack.js": "Y5lpvEjov2Z10%2Ffz6aK16w%3D%3D",
    "notice.html.pack.js": "Ko3OTVimXkAHOMiBlLAGrA%3D%3D",
    "notice_ext.pack.js": "n6SH1hCJ5LyHXCDq8Ux7Rw%3D%3D",
    "notice_ext_2011.pack.js": "4T1owZA7w2%2BJR5FEYbNoBg%3D%3D",
    "online_preview.html.pack.js": "fcBDUwuRa%2FahM1WVQX3OWQ%3D%3D",
    "onlinetips.html.pack.js": "rS34H4UptbqgsPzlczQ%2Bkg%3D%3D",
    "operatetips.pack.js": "sn9ZwP4N43cUxIVbyV7TvA%3D%3D",
    "password_email.html.pack.js": "yqyk%2B7vzUmxlHWQUZsOPBg%3D%3D",
    "password_question.html.pack.js": "avOCOFoglAR7sVlH33z45A%3D%3D",
    "pop.html.pack.js": "VeKZFrffdDBVn1lGJiFabg%3D%3D",
    "preference.branch.html.pack.js": "AiBcY3l0mpNK4v5yOpe%2BmQ%3D%3D",
    "preference.html.pack.js": "d5zq77dkMJFPbYxfFYXn9Q%3D%3D",
    "product.main.html.pack.js": "4mcJuQ3oMuZmrvBMNoQgUg%3D%3D",
    "richinput.html.pack.js": "pfxFZaDw9yq3ZigTZQfFqg%3D%3D",
    "set.selfsearch.html.pack.js": "qc4wCbcsWS7fbDk6ng7AQA%3D%3D",
    "sort.html.pack.js": "vftA2Ypo5Va%2F6ylNNPBFiQ%3D%3D",
    "spam.html.pack.js": "9NHkpT7LNKu3%2BFFC%2BGrlBQ%3D%3D",
    "storagecabinet.html.pack.js": "X4mF4BIBulZNIrwkUQSqig%3D%3D",
    "tags.html.pack.js": "ytG%2B8NqoPwBPZuOSLCGX8w%3D%3D",
    "taskmain.html.pack.js": "zoa1Le%2BaUe2CvV9m91RbSQ%3D%3D",
    "uec.lab.html.pack.js": "GVxoaXbEPW2Eg6%2FLAzaBCQ%3D%3D",
    "verify_lock.html.pack.js": "4N2ZjG7y%2Fd4%2FZkQvdbZWxw%3D%3D",
    "welcome.html.pack.js": "bZPrhc5Flw4bPfmMJ6sdqg%3D%3D",
    "welcome.prod.main.pack.js": "9yCKwsclo585hScdAL%2BNwg%3D%3D",
    "write_ok.html.pack.js": "bIT0n1exW58B2UVBy2iP8Q%3D%3D",
    "btips.css": "DGUk9ooaJvH%2FobG5cmrbxw%3D%3D",
    "initset.css": "ZfIYdXCc2YCtEOn0vbKZIg%3D%3D",
    "cabinet.html.pack.js": "sMEQ28CIRX9JlN6vuGyJRA%3D%3D",
    "cabinet_send.html.pack.js": "omrBjUknfhAZZeMWXX7vtQ%3D%3D",
    "cabinet_write_ok.html.pack.js": "cnGO9zxB0CpRgE6IrIgONQ%3D%3D",
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
    "initset.html.pack.js": "%2Fm3hQPZs%2BZxFIBig7jTB%2FQ%3D%3D",
    "m2012.product.birthdaywish.pack.js": "UJ3wXLrWacneyzBZ7gPDKA%3D%3D",
    "selectfile.html.pack.js": "CxCdR4Wl1F%2B%2FVztQIjc1FQ%3D%3D",
    "importresult.css": "vKpQPi2wSY42Qo5Juet%2BpA%3D%3D",
    "139tool.css": "HbvjJyAuwW5qUhOhyNWRsg%3D%3D",
    "fileExp_global.css": "2fwwDDZukADOd6xHgl5Jww%3D%3D",
    "addr_importresult.html.pack.js": "ICeepCC1OYoiaTuqdk19gQ%3D%3D",
    "addr_mailtofriends.html.pack.js": "jT8C%2BPWNBwLuX7ezAemyrA%3D%3D",
    "importmail.html.pack.js": "1a3fJUF8hsP3IgwkNiPzwQ%3D%3D",
    "music.html.pack.js": "EeP1GupEWofSIV41G7sDQw%3D%3D",
    "m2011.disk.diskcommon.js": "2013-07-02T07:08:15.203Z",
    "revival.css": "wQipMUxIGArY1SYiBpyWZw%3D%3D",
    "smsnot.css": "%2BGiidNWBeO2oCyrbkOrZHQ%3D%3D",
    "skin_cat_index.html.pack.css": "Cttb5SwobBLvFx5TRdeIyw%3D%3D",
    "skin_golf_index.html.pack.css": "0gIqBg95VA0x1t%2FqnjndFA%3D%3D",
    "skin_light_index.html.pack.css": "OSrJiyhI%2BU255KGJZ3bX3A%3D%3D",
    "skin_normal_index.html.pack.css": "tuF3C8A2Kks9%2FA20HoQDdQ%3D%3D",
    "skin_pink_index.html.pack.css": "20ruTPEq%2Bbyv3VY%2BugSkoA%3D%3D",
    "skin_star_index.html.pack.css": "E6GYmsehUXKkPXkxFpWKQA%3D%3D",
    "skin.css": "rEMtuPOvTOTjnyj0h80sZw%3D%3D",
    "skin_cat.css": "nGmySo0m0HCBb9OmIO6Vrg%3D%3D",
    "skin_golf.css": "XDoYcFLx2%2FviKcHMjD2ZjQ%3D%3D",
    "skin_light.css": "uI62TkX1eGlwdITAINnuUg%3D%3D",
    "skin_pink.css": "zt0Nf0qIi%2F%2FB8sZ5QpjgBQ%3D%3D",
    "skin_star.css": "S2Mcs%2FVW47DglRcq5DVgPg%3D%3D",
    "calendar_reminder.common.pack.js": "m35q3AlPDGNQ7yyqGLWIFw%3D%3D",
    "calendar_reminder.manage.label.html.pack.js": "iA1XWR%2FDtJyfCWqCZkZWUA%3D%3D",
    "disk.html.pack.js": "ALfgZt3lGYMKrumgXaw7uA%3D%3D",
    "addr.css": "zo9nAs2415Ow5Gld7%2BEs4A%3D%3D",
    "hall.css": "f1PuAtUKuZtgoh0t4CFeKg%3D%3D",
    "calendar_reminder.miniquery.pack.js": "uuPPZwUO4N8AOnBEBBr%2FdQ%3D%3D",
    "calendar_reminder.msgbox.html.pack.js": "MPqi20slfVnlu5x4imq04A%3D%3D",
    "m2012.smsnotifyfriends.pack.js": "gFXxqLTP%2F%2F9PJt%2FiEnHEXw%3D%3D",
    "calendar_reminder.richinput.html.pack.js": "tWid45RH8TXege3w97kXjw%3D%3D",
    "m139.core.out.pack.js": "FkIMF02CPxQec4HJ7EzKuQ%3D%3D",
    "mailremind.html.pack.js": "FN1tGKWcFJn66nNV2eLlaQ%3D%3D",
    "skin_brocade_index.html.pack.css": "2P0TInnuXoWvFH69niE4jw%3D%3D",
    "skin_flowers_index.html.pack.css": "VJoC4aBmow%2Fg%2BeF4jL6zPQ%3D%3D",
    "skin_mstar_index.html.pack.css": "i7t6gmE18d2L6jUWmOaUcQ%3D%3D",
    "skin_paint_index.html.pack.css": "MNHyrMl23kElw1KUilohHQ%3D%3D",
    "skin_rose_index.html.pack.css": "N%2FwQilGGY38mixNus3rQqg%3D%3D",
    "skin_sunflower_index.html.pack.css": "5cl9dCQcAJPfwNkuR3LNLw%3D%3D",
    "skin_sunset_index.html.pack.css": "v98yAIitpl2mLG17lIBl3Q%3D%3D",
    "skin_brocade.css": "5FOHou7tfBFQwsK8FRV8qQ%3D%3D",
    "skin_flowers.css": "zBHWFBLICQeW4%2F8cf5GJRQ%3D%3D",
    "skin_mstar.css": "1DIgPt966vQ2iiw4EVPEew%3D%3D",
    "skin_paint.css": "giMGI%2Bw03v%2BT74rVsHUcog%3D%3D",
    "skin_rose.css": "kB2Zmsy6eqrI477RVfG3%2Bw%3D%3D",
    "skin_sunflower.css": "bVvjrlCpVPGCuV05BrBLWw%3D%3D",
    "skin_sunset.css": "uOe3CAqPf%2B5%2Fo4errvAgVw%3D%3D",
    "addr_basicinfo.html.pack.js": "8xDJMG38lNDgy3qDpPmbsg%3D%3D",
    "addr_businessinfo.html.pack.js": "pbzSxMGYVmiwdSK3hxei0w%3D%3D",
    "addr_contact.html.pack.js": "mEtprX%2Bc6md3SgNwM06KvQ%3D%3D",
    "addr_mypicture.html.pack.js": "NXxlBJm4OUd5Qdd5GRrhBw%3D%3D",
    "addr_personalcir.html.pack.js": "DPoiPiwH548yYX4G3UYaZw%3D%3D",
    "calendar.search.html.pack.js": "FrSmWZkKzmK3qo%2F5Kp1gCQ%3D%3D",
    "evocation.pack.js": "PdFBMJYJdnd4KnSX9z0Ahg%3D%3D",
    "fontbase.css": "z2WCTky1kCx1uouKA3JJUw%3D%3D",
    "addr_share_home.html.pack.js": "cBdzwT1tWUywlwzz65uRZQ%3D%3D",
    "calendar_reminder.view_schedule.html.pack.js": "KdUf3yWVsl1dHCKKS%2F3Q%2FQ%3D%3D",
    "letterpaper.htm.pack.js": "z8gPMtUAlOYyhUCl2cYv1g%3D%3D",
    "welcome_v2.html.pack.js": "UMn8jjIHvisuhsN7lqB2CA%3D%3D",
    "welcome_weather.html.pack.js": "rXuT%2BGZj341ZbFkFEA6U4Q%3D%3D",
    "cloudPostOffice.css": "XNmkKF83ZKOzBsv1ms6G%2Fw%3D%3D",
    "hall.biz.html.pack.js": "xZ1omfH7lmWqzYhAriAUDg%3D%3D",
    "hall.index.html.pack.js": "eCrj29Xhl0EVUlrCkZF2AA%3D%3D",
    "hall.mybiz.html.pack.js": "cLQHz0t2TP5Nv70tmDOgJg%3D%3D",
    "hall.points.html.pack.js": "e92VDMItd7iMnbV2gOdQ1A%3D%3D",
    "m2012.addmailnotify.pack.js": "L3QXe%2F02OThFl%2BQJdYpUeQ%3D%3D",
    "tip.calendar.msg.html.pack.js": "YtEztT1ykt9KVDi74Nf3wg%3D%3D",
    "netdisk.css": "hx3Sz92BwSOSEEPwwjQKEA%3D%3D",
    "skin_mcloud_index.html.pack.css": "zJA%2FUUxj0eD5KpuFGt0O3w%3D%3D",
    "skin_mcloud.css": "FslPgUDhbGlLe%2Flvf%2FA95Q%3D%3D",
    "m2012.contacts.tellnew201311.pack.js": "KovK4SZxUSAbCLVUDGp%2BgQ%3D%3D",
    "m2012.contacts.vcard2013.pack.js": "DNSCFUhCPEzGeJP1v6oVpQ%3D%3D",
    "m2012_contacts_saveinbox_async.pack.js": "kc4izyNJaHSUM%2FXNwWawRQ%3D%3D",
    "selectfile.html.pack - 副本.js": "5%2FLMSKMwzCEA%2FebaQmI58A%3D%3D",
    "pop.html.pack - 副本.js": "Ut3EVajfcKp9PC1LS0kWog%3D%3D",
    "atta.css": "eVU09G7Tv7aaj8t4pkFVvA%3D%3D",
    "square.css": "jtZN4ROOSBnfd7uFyfIc5Q%3D%3D",
    "calendar.getPublicCalendars.pack.js": "Z9ARK0%2F10LgJ5DLD3gAkTg%3D%3D",
    "calendar.square.html.pack.js": "MNGLvyhm4Bm6GJMkSLtZOw%3D%3D",
    "welcome_v3.html.pack.js": "Is3%2Bry47AF1YKLsVMhW6Nw%3D%3D",
    "skin_newyear_index.html.pack.css": "CgvUBCEdi9hTDYZWtlntkA%3D%3D",
    "skin_newyear.css": "QvZ3UXoORxURPtiiJKuotA%3D%3D",
    "skin_cherry.css": "okHk%2B78MRJjvCNiCUfQpvg%3D%3D",
    "skin_dew.css": "mUb%2FQ11oEaW9rA33JdAr8Q%3D%3D",
    "skin_lithe.css": "hwUCKfZqARxrCh0NX%2BBHPA%3D%3D",
    "skin_warm.css": "fJVP2W7TDIRz9Zt7goUiUw%3D%3D",
    "player.css": "avldJ4cs%2FsEOaGj6E7nlbw%3D%3D",
    "qiuckre.css": "X95HC%2BEAe8OIWYDeuSjeHg%3D%3D",
    "skin_cherry_index.html.pack.css": "misg%2FXh7O8L9VtCBFB8kMA%3D%3D",
    "skin_dew_index.html.pack.css": "8IHfiqz%2BLUWIxnDIL8GB2Q%3D%3D",
    "skin_lithe_index.html.pack.css": "yE9C2YH9Li9PnbZ2OBKg3g%3D%3D",
    "skin_morning_index.html.pack.css": "fz8e%2BmkMGc9k2R8N%2BSlV6w%3D%3D",
    "skin_night_index.html.pack.css": "5RzRAQ6jIURoHFvDimxfwQ%3D%3D",
    "skin_warm_index.html.pack.css": "N9Gh0W0SMn9kNUYRfzDLrQ%3D%3D",
    "skin_morning.css": "1Vr2rqqXPTJOcH1rCV%2BrfA%3D%3D",
    "skin_night.css": "arqpLsagjexjLRFrOTz%2FEg%3D%3D",
    "coversationcompose.html.pack.js": "h54DbZWX0%2BOATMNdp26jag%3D%3D",
    "NetdiskToolDownload.css": "DMe9dutB0%2B82TS9Te1FnNQ%3D%3D",
    "skin_autumn_index.html.pack.css": "bKcCfK%2Bb0vxZ9QaosDphOQ%3D%3D",
    "skin_child_index.html.pack.css": "i3tZqWf3gyXepB7hSrR0Cw%3D%3D",
    "skin_spring_index.html.pack.css": "gWnE0VudAcmSeBZ9n3lM%2FQ%3D%3D",
    "skin_summer_index.html.pack.css": "ovtZjkUEUAwDmXZ29tqVrQ%3D%3D",
    "skin_winter_index.html.pack.css": "t7obeq6Rdr%2FnWjiVp67MzQ%3D%3D",
    "skin_woman_index.html.pack.css": "jxWuILOSea%2FEVzpvayGp3g%3D%3D",
    "skin_autumn.css": "D9%2FtyKymbIdEVFDP3JnHCw%3D%3D",
    "skin_child.css": "SGrl23xLZ3fmepZGZdR71Q%3D%3D",
    "skin_spring.css": "To%2BwEe0rg%2FqKMt5ceTEKkg%3D%3D",
    "skin_summer.css": "6FEq6uj6o95fnGV0hcUzgw%3D%3D",
    "skin_winter.css": "B5zbdlOGEMjlHOI3HY%2Bejw%3D%3D",
    "skin_woman.css": "agelDIla1XTHV2kr%2BVKsCw%3D%3D",
    "addr_import_clone.html.pack.js": "pQM6uLJCpnwP7YfgWK%2FWCA%3D%3D",
    "addr_import_file.html.pack.js": "fAokoqgiWbuS46YwVtklIw%3D%3D",
    "addr_import_pim.html.pack.js": "ZRO0G%2BuyurHqfxc3WD8qTw%3D%3D",
    "card_sendcard.html.pack.source.js": "D5%2FVfUMjZIOv88o1DxV8WA%3D%3D",
    "addrnew.css": "JakyzTz5fr2b6sK2sagMJQ%3D%3D",
    "networkDisk.css": "q6Sx%2Fr1GPnpcSU%2Bt4iXUfw%3D%3D",
    "conversationrichupload.html.pack.js": "dvXWr2QT75NCH7Pv2Fh6CQ%3D%3D",
    "index.html.pack2.js": "SAtgb%2BFxzfwpruPhlKGziQ%3D%3D",
    "sengcard.css": "BtRIq6PHpL6%2Fu%2FNdYjrv2A%3D%3D",
    "calendar.css": "79TgEgfJw8riUF98%2BI1x1A%3D%3D",
    "calendar.pack.css": "RAr%2BZsIgJLDvnyeRxCIl1w%3D%3D",
    "s_global.css": "aLMp2piT40CZx9itXLnJQA%3D%3D",
    "skin_purple.css": "ETZdIh5c66pvl8p2oVHSoA%3D%3D",
    "skin_皮肤.css": "PEqfUFPbmAJ1rlu3YtxfoA%3D%3D",
    "cal_labelmgr.html.pack.js": "rkToacRQBUiYLdOSGi86SQ%3D%3D",
    "cal_schedule.html.pack.js": "y78oyVe8YIBDKLdYmIfEiQ%3D%3D",
    "cal_activity.html.pack.js": "S5SP03sBL4r7%2BULZsMEWWQ%3D%3D",
    "cal_activity_viewer.html.pack.js": "36Y8Ygs4HeIUDOsAhzoQSQ%3D%3D",
    "cal_discovery.html.pack.js": "it1sVcU0aZqrYIMMCCs8bg%3D%3D",
    "cal_index.html.pack.js": "BQBSE6TqEFuRY7VLywwP1w%3D%3D",
    "cal_index_addLabel_async.html.pack.js": "5qXpRP8fUnfQtu5pb4bj5Q%3D%3D",
    "cal_index_async.html.pack.js": "n9WwsDtTKfdh6lzO1zMNeg%3D%3D",
    "cal_index_discovery_async.html.pack.js": "lAGGvtN7yGr4hKJho5ahTA%3D%3D",
    "cal_index_list_async.html.pack.js": "%2BcE4WxoWU0AzCBlUgNlV5A%3D%3D",
    "cal_index_listview_async.html.pack.js": "vKwut%2B1vMM9MWwzPz0ozyg%3D%3D",
    "cal_notify.html.pack.js": "fSMOBtq8Ab%2FxptHTeNma%2Fg%3D%3D",
    "cal_message.html.pack.js": "WR%2BDbToeSjtBYQXBFCLPlg%3D%3D",
    "cal_search.html.pack.js": "cmzbKoV625PtS7sw9QvZMA%3D%3D",
    "cal_index_calendarSquare_async.html.pack.js": "jcJKfY60d79Dpt76u1kP8g%3D%3D",
    "cal_index_day_async.html.pack.js": "Kc99i%2BRowILsNYltHImL2Q%3D%3D",
    "conversationcompose.pack.css": "dkxKpXNJOZWsI1p0N0v5ZA%3D%3D",
    "addr_maybeknown_prod.pack.js": "5NMoKczPZZz7QylmrXVKsg%3D%3D",
    "cal_edit_label.html.pack.js": "Ekv4RC0wTYwZw4qWe8XZyw%3D%3D",
    "m2012.changeskin.pack.js": "sAlgKzP2j%2Fk5OLFZfAFNJw%3D%3D",
    "addr_contacts_list.html.pack.js": "CllGbn0%2FcSlWlp%2Bm0dZxaw%3D%3D",
    "addr_groups_list.html.pack.js": "ddrYjFLQ%2BTWSO0kYbkaL2A%3D%3D",
    "addr_master.html.pack.js": "uXBAEuX%2B3FAR8JouXaqEsQ%3D%3D",
    "cal_view_sharedorinvited_schedule.html.pack.js": "0pr2KgoZulmipH%2FvFLmnAQ%3D%3D",
    "cal_add_pop_activity.html.pack.js": "pZ%2B8YYQZk21ych0VdJLcHw%3D%3D",
    "cal_view_pop_activity.html.pack.js": "S4S0DsB1HMndcCIbJAs5Bw%3D%3D",
    "cov.css": "nOWd5j0tiwbvBmaC7kz%2BoA%3D%3D",
    "addr_home_base.html.pack.js": "ZqfJT8lh0O0N3aykZWuhZQ%3D%3D",
    "addr_home_index.html.pack.js": "scotkjE6f4KNPSJbFopssQ%3D%3D",
    "addr_home_main.html.pack.js": "TscoMUvv%2Bj7WIZvtRQkP9A%3D%3D",
    "cal_index_dayview_async.html.pack.js": "p3JjlvO1G8Twegn58TU2Tw%3D%3D",
    "skin_bluesky_index.html.pack.css": "q4WoXBYHtLCjZeOmCDdLrA%3D%3D",
    "skin_lightblue_index.html.pack.css": "Kh3Y1Mf55CqjuUt%2FSqGMFA%3D%3D",
    "skin_bluesky.css": "tNrrfcXOI6R5zhJkX63WJA%3D%3D",
    "skin_lightblue.css": "FZvAPyY3wHhzrs%2BqcZWABw%3D%3D",
    "addr_home_andAddr.html.pack.js": "Gi8%2BEQSGs%2B0FH8LFewFs8A%3D%3D",
    "cabinet_write.html.pack.js": "lJSaHjF57NztvjWJqX9dfA%3D%3D",
    "disk_write.html.pack.js": "sKSrurHfuU6bz1zx4ANsoQ%3D%3D",
    "largeAttach.html.pack.js": "s3diz9tJAYF317poMRBubA%3D%3D",
    "picture.css": "FqOA2EJw7I2sPCzMy%2Ba17Q%3D%3D",
    "videoPlay.css": "aRW6rMPZFet9261Wf1ofkw%3D%3D",
    "skin_red_index.html.pack.css": "7JL%2BaFv7cSxWCWNFgQCQEA%3D%3D",
    "skin_red.css": "hp8qdy8GVV7srQ6MiaceAg%3D%3D",
    "cal_edit_activity.html.pack.js": "56X%2FsuG8%2Fq9vmg25s1PzjQ%3D%3D",
    "cal_pop_activity.html.pack.js": "30%2BpSMOCj45AldqHr0dSDQ%3D%3D",
    "mailattach.pack.js": "EylxYchzAh6agU6hwSGhTw%3D%3D",
    "detail_andAddr.html.pack.js": "Dl3ZNL2kBSRJrbWw6YbAEw%3D%3D",
    "documentPreview.css": "H6V0IBaYbhCdRGgGrVs2Fw%3D%3D",
    "skin_claritBamboo_index.html.pack.css": "VtQT8HaEilr87ZsTJLN%2BDA%3D%3D",
    "skin_claritBrown_index.html.pack.css": "jhRNtSiWfa8wir3gnaMbAQ%3D%3D",
    "skin_claritGreen_index.html.pack.css": "btV%2BpbWZwP1NKuyiZw%2BxIg%3D%3D",
    "skin_claritPurple_index.html.pack.css": "I9K3p7%2BQ9kOjQT9ablCgrg%3D%3D",
    "skin_claritRed_index.html.pack.css": "MRJFE0MIWd62YKu8BeSNfA%3D%3D",
    "skin_claritBamboo.css": "6Qj5l70I96cIpv7ZoB26rw%3D%3D",
    "skin_claritBrown.css": "sBjfEH5dIUF%2F%2Fdb0aHKsKA%3D%3D",
    "skin_claritGreen.css": "80d8mJo6ZI4qFZbq0EUUqA%3D%3D",
    "skin_claritPurple.css": "bW4FEyATZYGvbGj9YBDCVg%3D%3D",
    "skin_claritRed.css": "aci6oM%2BGZ5k6bnXi9h0aJA%3D%3D",
    "m2012.calendar.prod_inviteactivity.html.pack.js": "3VjYttdjqzUIt4nmGtaeMw%3D%3D",
    "m2012.calendar.prod_share.html.pack.js": "YA6J2G4IPRFGewBOcTYASQ%3D%3D",
    "officialsharing.html.pack.js": "ymcjunMaaQr8T2VyxwSD2g%3D%3D",
    "group.css": "rSZlWGx5kjwaUVZ7G0amKg%3D%3D",
    "in_mail_atta_preview.css": "6UwCojbJdqwQYc8STU722g%3D%3D",
    "addr_home_team.html.pack.js": "nFg9ISNsKXnUgqJ0KP0iJQ%3D%3D",
    "addr_home_team_detail.html.pack.js": "9eBs%2FNbY75uM5WlEM%2FLsXQ%3D%3D",
    "addr_home_team_notify.html.pack.js": "yWV9Dn%2FZdz2OmeGe1%2FFEXQ%3D%3D",
    "disk_share.html.pack.js": "seZEEJ9athrTyFbPlzdmog%3D%3D",
    "groupmail.evocation.pack.js": "pFLZWuFl60Ja7zXtfNGI3Q%3D%3D",
    "groupmail.html.pack.js": "5p1%2FBrmfKyyuPAmNptlXGw%3D%3D",
    "health.css": "1lWIxke%2FfnLaXW2Jni3vtg%3D%3D",
    "health.html.pack.js": "nMsKomk7vdd3vfHozNgBvg%3D%3D",
    "disk_index.html.pack.js": "xAVfOiBQ5B6NZ%2BscYH6JXQ%3D%3D",
    "disk_recycle_async.html.pack.js": "kTcPIXg7q0HNouV%2FoT1dFQ%3D%3D",
    "skin_claritFlower_index.html.pack.css": "ot%2FES7WiC%2B8SRCCllaIyag%3D%3D",
    "skin_claritForest_index.html.pack.css": "Rk1%2Bk59EjsPYpf8xqnwhtg%3D%3D",
    "skin_claritGrass_index.html.pack.css": "sZOFzFH81mit7AuX2Wy67g%3D%3D",
    "skin_claritGreeng_index.html.pack.css": "Oj2e0QqbVqZ131if%2B8%2FWGw%3D%3D",
    "skin_claritLeaf_index.html.pack.css": "yVy6NgQJR9MlPFRyc0%2BCpA%3D%3D",
    "skin_claritOnRoad_index.html.pack.css": "LMZmfQlIBSmlZizuBk1uJA%3D%3D",
    "skin_claritRoad_index.html.pack.css": "EJRDjFtRgeTtZjF3zCjYJA%3D%3D",
    "skin_claritSky_index.html.pack.css": "6o8FApC9xWTHqr3g0Bx87w%3D%3D",
    "skin_claritSunset_index.html.pack.css": "NRYxjd8316bCJaqCEhoizQ%3D%3D",
    "skin_claritTifany_index.html.pack.css": "yYyWkfaZn%2BTBI2t%2FfvEjwQ%3D%3D",
    "skin_claritUniverse_index.html.pack.css": "dg3qEKvNkwzWfb4qbP4XWg%3D%3D",
    "skin_claritWave_index.html.pack.css": "Rsa54vyecuszCRkWYuzrbQ%3D%3D",
    "skin_claritFlower.css": "2gh7NL6%2FRqqwpOnDXqmQQw%3D%3D",
    "skin_claritForest.css": "7jedr7ixSohvqIYkJGLW4w%3D%3D",
    "skin_claritGrass.css": "iScLfyxEdqD8ARDGAb5pWg%3D%3D",
    "skin_claritGreeng.css": "c3IX6qHFNvgcxUnVKwj4aQ%3D%3D",
    "skin_claritLeaf.css": "QGFLUMZBK5J9tYw1FrIBoQ%3D%3D",
    "skin_claritOnRoad.css": "fNfw6IIrk438ZV4ml7soCA%3D%3D",
    "skin_claritRoad.css": "w8K7c8Ws0QR1wP6BZrnr2g%3D%3D",
    "skin_claritSky.css": "o%2BaDBavr%2BizY0mRVbEospw%3D%3D",
    "skin_claritSunset.css": "y87PmNVHgttBpMm%2FvWkahw%3D%3D",
    "skin_claritTifany.css": "bOfuWdCT%2Fug5ivnQXV0RIw%3D%3D",
    "skin_claritUniverse.css": "9SDZQCqfXR4CJzIE57j0gQ%3D%3D",
    "skin_claritWave.css": "JTE3IHjbfbsEw3tLeNqZnw%3D%3D",
    "compose.html.pack - 副本.js": "nw02caG%2BbWpPrUKQnY%2B0Cw%3D%3D",
    "disk.html.pack - 副本.js": "UhbpbFF2yeUFPCFUOlzCQQ%3D%3D",
    "largeAttach.html.pack - 副本.js": "d5lUg7qVgLi6ipwAYbO9YA%3D%3D",
    "m2012.calendar.prod_sharelabel.html.pack.js": "wGeNyWzyq2v%2B725TYrcxfw%3D%3D",
    "addr_component.html.pack.js": "F776irLS378tuFo4%2F5aIqw%3D%3D",
    "addr_personinfo.html.pack.js": "Czuml87LWeqz%2FW9Mw7ddsw%3D%3D",
    "filedownload.css": "uZRv2NcQmYZZXaLG3yYTSA%3D%3D",
    "timePlug.css": "p9vKPocUE%2FYvN5pf5ae22g%3D%3D",
    "addr_maybeknown_dialog.html.pack.js": "1FgK9vJ9JTkFFGxzKcRnaQ%3D%3D",
    "attach_write.html.pack.js": "ZFPC1b3ROOTuatV%2FwoWutA%3D%3D",
    "cal_compatibility.pack.js": "YzJwm0e6NZqo2jB0dJ4CuQ%3D%3D",
    "cal_edit_activity_async.html.pack.js": "BDDGzyDN9IMTwTNsGmlIIQ%3D%3D",
    "cal_edit_sharelabel.html.pack.js": "fQ10h%2FhZntEH7CI%2BLcqd3g%3D%3D",
    "cal_index_message_async.html.pack.js": "1KayfcxuYywhuK5R9YIfOw%3D%3D",
    "cal_index_search_async.html.pack.js": "eoyrtUzWLStSNQyRnLVdLg%3D%3D",
    "cal_labelmanage.html.pack.js": "A9VHEFIeBkQBjBmMDYEsFQ%3D%3D",
    "cal_pop_activity_async.html.pack.js": "YMCXo1AgPcw5e7IC67CPyg%3D%3D",
    "cal_pop_subscribedetail.pack.js": "jnOKXQwMQaDTojEn85%2Bpww%3D%3D",
    "cal_special_activity_async.html.pack.js": "%2BTu672XqD%2FlH6yFZpurpEw%3D%3D",
    "write_ok_new.html.pack.js": "yRke%2FsgHg5rhQmIEXeFB%2Fw%3D%3D",
    "groupAlbum.css": "kx8s%2F%2FnOmQE93Yn45B1MNw%3D%3D",
    "set_v2.css": "LR7%2BkquLoBSL%2FZA4nAvvXg%3D%3D",
    "activityinvite.html.pack.js": "BgXjEgVFZr9FWftuZ2JWsA%3D%3D",
    "analyze_sdk.pack.js": "MCJIAnb3%2FH%2BFX3jB8wBbig%3D%3D",
    "cal_contactcomp.html.pack.js": "SFyZMsYGxSKk2FyjWiZgeA%3D%3D",
    "cal_grouplabel.html.pack.js": "7%2F9GeNMI1LgECYcPdhCHqg%3D%3D",
    "cal_index_groupactivity_async.html.pack.js": "C5Ey6uwnptbrG9aOl%2BB6uw%3D%3D",
    "cal_view_timeline.html.pack.js": "YUDOP8BGzkbhX6FVhL9Dxw%3D%3D",
    "groupmail.compose.html.pack.js": "km631J3uYB8VIuu3mrjMWg%3D%3D",
    "m2012.settings_v2.addr.pack.js": "B7zXEj5WPz7sZdKFJXDflQ%3D%3D",
    "m2012.settings_v2.calendar.pack.js": "7r1gCK0rjHK3HcS4rVSRug%3D%3D",
    "m2012.settings_v2.disk.pack.js": "Ii51zhSXtvrZxf52QMfWww%3D%3D"
}
//</fileConfig>