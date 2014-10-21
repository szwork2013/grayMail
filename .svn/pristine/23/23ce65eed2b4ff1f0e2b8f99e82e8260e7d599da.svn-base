M139.HttpRouter = {
    /**
    * 服务器列表，服务器的路径规则，通过addServer
    */
    serverList: {
        "appsvr": { domain: "http://" + location.host, path: "/s?func={api}&sid={sid}" },
        "webapp": { domain: "http://" + location.host, path: "/RmWeb/mail?func={api}&sid={sid}" },
        "setting": { domain: "http://" + location.host, path: "/setting/s?func={api}&sid={sid}" },
        "addr": { domain: "http://" + location.host, path: "/addrsvr/{api}?sid={sid}&formattype=json" },
        "addr_p3_gw" : { domain: "http://" + location.host, path: "/addr_p3_gw/SyncUserInfo/addrlistservice_sync_get?func={api}&sid={sid}" },
        "weather": { domain: "http://" + location.host, path: "/mw2/weather/weather?func={api}&sid={sid}" },
        "positioncontent": { domain: "http://" + location.host, path: "/mw/mw/getUnifiedPositionContent?sid={sid}" },
        "mms": { domain: "http://" + location.host, path: "/sm/mms/mms?func={api}&sid={sid}" },
        "sms": { domain: "http://" + location.host, path: "/mw2/sms/sms?func={api}&sid={sid}" },
        "search": { domain: "http://" + location.host, path: "/bmail/s?func={api}&sid={sid}" },
        "card": { domain: "http://" + location.host, path: "/mw2/card/s?func={api}&sid={sid}" },
        "together": { domain: "http://" + location.host, path: "/together/s?func={api}&sid={sid}" },
        "disk": { domain: "http://" + location.host, path: "/mw2/disk/disk?func={api}&sid={sid}" },
        "file": { domain: "http://" + location.host, path: "/mw2/file/disk?func={api}&sid={sid}" }, // add by tkh 测试线以file/disk?func=调用彩云文件快递新接口
        "note": { domain: "http://" + location.host, path: "/mw2/file/mnote?func={api}&sid={sid}" },
		"evernote": {domain: "http://" + location.host, path: "/mw2/file/mnote?func={api}&sid={sid}"},
        "uec": { domain: "http://" + location.host, path: "/uec/uec/s?func={api}&sid={sid}" },
        "bill": { domain: "http://" + location.host, path: "/mw/mw/billsvr?func={api}&sid={sid}"}, //注意：测试线路径不一致
        "middleware": { domain: "http://" + location.host, path: "/middleware/s?func={api}&sid={sid}"},
        "calendar": { domain: "http://" + location.host, path: "/mw2/calendar/s?func={api}&sid={sid}" },
        "businessHall": { domain: "http://" + location.host, path: "/together/s?func={api}&sid={sid}" },//邮箱营业厅
	"billcharge": { domain: "http://" + location.host, path: "/mail_hall/info?func={api}&sid={sid}" },//邮箱账单        
        "groupmail": { domain: "http://" + location.host, path: "/mw2/groupmail/s?func={api}&sid={sid}" },//群邮件
	"nothing": {},
        "webdav": { domain: "http://" + location.host, path: "/addr_p3_gw/dav/addrlistservice_sync_webdav?func={api}&sid={sid}" }
        },
    /**
    * 接口列表，通过addRouter配置
    */
    apiList: {
        "mbox:getAllFolders": "appsvr"
    },
    addServer: function(key, data) {
        this.serverList[key] = data;
    },
    addRouter: function(server, list) {
        for (var i = 0; i < list.length; i++) {
            var name = list[i];
            this.apiList[name] = server;
        }
        return true;
        /*if(!this.apiList[server]){
        this.apiList[server]=[];//没有则初始化
        }
        var orignList=this.apiList[server];//取出原数据
        orignList.concat(apiList); //合并原数据与新数据。
        return this.routerList;*/
    },
    /*
    addUrl:function(key,data){
    if(data.server && data.path){
    var server=data.server;
    if(this.serverList[server]){
    data.path=$T.format(data.path,{server:this.serverList[server]});
    }
    }
    	
    urlList[key]=data;
    },*/
    getUrl: function(api) {
        
        var qs = {};
        
        if(api.indexOf('?') > 0) //处理如 uec:list?a=1&b=2 这样的情况
        {
            qs = $Url.getQueryObj(api); // 得到 {a:1, b:2} 对象
            api = api.split('?')[0];    // 得到 uec:list
        }
        
        var domainKey = this.apiList[api];
        if (!domainKey) {
            if (api.indexOf("&") > 0) { //容错，加了get参数后找不到接口的问题
                domainKey = this.apiList[api.split("&")[0]];
            }
        }
        var domain = this.serverList[domainKey].domain;
        var url = domain + this.serverList[domainKey].path;


        // mod by yuanhb start : append api params to result url.
        var result = $T.format(url,
        {
            sid: $T.Url.queryString("sid") || top.sid,
            api: api
        });
        if (api == "global:sequential2") {
            result = result.replace("global:sequential2","global:sequential");
        };
        if (result && qs) {
            result = $Url.makeUrl(result , qs);
        }

        if (!top.COMEFROM) {
            top.COMEFROM = $T.Url.queryString("comefrom");
        }
        if (top.COMEFROM) {
            result += "&comefrom=" + top.COMEFROM;
        }

        return result;
//        return $T.format(url, $.extend(
//        {
//            sid: $T.Url.queryString("sid") || top.sid,
//            api: api
//
//        }, qs) );
        // mod by yuanhb end
    },

    hostConfig_12:{
        "mw": {
            host:"mw.mail.10086.cn",
            proxy:"/proxy.htm"
        },
        "mw2": {
            host:"smsrebuild1.mail.10086.cn",
            proxy:"/proxy.htm"
        },
        "bill": {
            host:"mw.mail.10086.cn",
            proxy:"/bill/proxy.htm"
        },
        "sm":{
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "together": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "setting": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addrsvr": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addr_p3_gw": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "uec": {
            host: "uec.mail.10086.cn",
            proxy: "proxy.htm"
        },
        "g2": {
            host: "g2.mail.10086.cn",
            proxy:"/proxy.htm"
        },        
        "mail_hall": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "sharpapi": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "pns": {
            host: "pushmsg.mail.10086.cn",
            proxy: "pns/proxy.htm",
            keepPath: true
        }
    },
    hostConfig_1: {
        "mw": {
            host: "mw-test.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "mw2": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "bill": {
            host:"mw-test.mail.10086.cn",
            proxy:"/bill/proxy.htm"
        },
        "sm": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "together": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "setting": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath:true
        },
        "addrsvr": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addr_p3_gw": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "uec": {
            host: "uec0.mail.10086.cn",
            proxy: "proxy.htm"
        },
        "g2": {
            host: "g3.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "g3": {
            host: "g3.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "mail_hall": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "sharpapi": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "pns": {
            host: "pushmsg0.mail.10086.cn",
            proxy: "pns/proxy.htm",
            keepPath: true
        }
    },
    /**
     *返回代理配置
     */
    getProxy: function (url) {
        if (document.domain != "10086.cn") {
            return null;
        }
        var proxyServerPath = M139.Text.Url.removeHost(url).replace(/\/+/g, "/").split("/")[1];
        var partId ;
        if (window.getCookie) {//避免无top窗口引用时取不到cookie
            partId = getCookie("cookiepartid");
        } else {
            partId = M139.Text.Cookie.get("cookiepartid");
        }

        //当灰度中帐号，与全网帐号在相同浏览器下，依次登录，灰度帐号会读取到全网的cookiepartid，这段代码，则根据url中的appmail3进行分区修正。
        if (partId === "12") {
			var betahost = false;
			if ("[object Function]" === Object.prototype.toString.call(window.getDomain)) {
				//如果当期是top
				betahost = window.getDomain("betadomain");
			}
			
			if (!betahost && "[object Function]" === Object.prototype.toString.call(top.getDomain)) {
				betahost = top.getDomain("betadomain");
			}
			
			if (!betahost) {
				//填个默认值
				betahost = "appmail3.mail.10086.cn";
			}

            if ("undefined" !== typeof (betahost) && betahost !== "") { //有配置才修正
                if (betahost === location.host) {
                    partId = "1";
                }
            } else {
				//如果始终都无法得到配置，未避免误修正，所以不处理
			}
        }

        var hostConfig = this["hostConfig_" + partId] || this.hostConfig_12;
        var item = hostConfig[proxyServerPath];
        if (proxyServerPath && item) {
            var newUrl = this.removeProxyPath(url, proxyServerPath, item.keepPath);

            return {
                url: newUrl,
                host: item.host,
                proxy: item.proxy
            };
        } else {
            //不需要使用代理
            return null;
        }
    },

    getNoProxyUrl: function (url) {
        var proxy = this.getProxy(url);
        if (proxy) {
            return "http://" + proxy.host + proxy.url;
        } else {
            return url;
        }
    },

    /**
     *移除掉路由前缀（因nginx配置很不统一）
     */
    removeProxyPath: function (url, proxyServerPath,keepPath) {
        url = M139.Text.Url.removeHost(url);
        if (keepPath) {
            return url;
        } else {
            return url.replace("/" + proxyServerPath, "");
        }
    },

    ProxyFrameMap:{},

    /**
     *等待代理页加载
     */
    proxyReady: function (url, callback) {
        var iframe = this.ProxyFrameMap[url];
        if (!iframe) {
            var html = '<iframe src="{0}" style="display:none"></iframe>'.format(url);
            this.ProxyFrameMap[url] = iframe = $(html).appendTo(document.body);
            //增加确保代理页加载成功的机制（默认重试3次）
            M139.Iframe.checkIframeHealth({
                iframe: iframe[0]
            });
        }
        if (M139.Iframe.isAccessAble(iframe[0])) {
            return callback(iframe[0].contentWindow);
        } else {
            M139.Iframe.domReady(iframe[0], function () {
                callback(iframe[0].contentWindow);
            });
        }
    }
};
/*
    var proxy = M139.HttpRouter.getProxy("http://" + location.host + "/g2");
    console.log(JSON.stringify(proxy));

    M139.Text.Url.removeHost("http://" + location.host + "/g2");

*/