var MAINDOMAIN = "http://mail.10086.cn";
var mwsvr = "http://smsrebuild1.mail.10086.cn";
var mwsvr2 = "http://smsrebuild0.mail.10086.cn";
var resourcePath = "http://images.139cm.com/m2012";
var svrPath = "/setting/s";

if (/\.\d+rd\./.test(location.host)) {
    MAINDOMAIN = "http://mail.10086rd.cn";
    mwsvr = "http://mw.mail.10086rd.cn";
    resourcePath = "http://static.rd139cm.com/m2012";

} else if (/\.\d+ts\./.test(location.host)) {
    MAINDOMAIN = "http://mail.10086ts.cn";
    mwsvr = "http://smmw46.mail.10086ts.cn";
    resourcePath = "http://images.mail.10086ts.cn:2080/m2012";
    svrPath = "/set/s";
} else if(/appmail3/.test(location.host)){
	resourcePath = "http://image0.139cm.com/m2012";
}

var rmResourcePath = resourcePath.replace("m2012", "rm/richmail");
var proxyPath = "/proxy.htm";

var svrMethod = {
    "mealInfo": "meal:getMealInfo",
        "init": "meal:initUpdate",
       "check": "meal:checkImageCode",
     "smsCode": "meal:sendSmsCode",
     "upgrade": "meal:mealUpdate"
};

(function(W){

    W.filltag = function (d, c, f) { var b, a, e = []; while (d.length) { a = d.shift(); switch (true) { case Object.prototype.toString.apply(a) === "[object Array]": b = "<script " + (a[1].length > 0 ? 'charset="' + a[1] + '" ' : "") + "src='" + (a[2] ? a[2] : c) + "/js/" + a[0] + "' type='text/javascript'><\/script>"; break; case a.indexOf(".js") > -1: b = "<script " + (f ? 'charset="' + f + '" ' : "") + "src='" + c + "/js/" + a + "' type='text/javascript'><\/script>"; break; case a.indexOf(".css") > -1: b = "<link rel='stylesheet' type='text/css' href='" + c + "/css/" + a + "' />"; break; case a.length == 0: b = "<link rel='stylesheet' type='text/css' />" } e.push(b) } document.write(e.join("")) };

    W.report = function(actionid) {
        var img = new Image();
        var url= mwsvr + "/weather/weather?func=user:logBehaviorAction&action=" + actionid + "&module=11"
        img.src=url;
        img=null;
    };

    W.proxyready = (function(){
        var client = false;

        function _ready(_url, _data, _callback){

            client.SendRequest('POST', _url, _data, function(rs){
                var obj = false;

                if(window.JSON && JSON.parse) {
                    try {
                        obj = JSON.parse(rs);
                    } catch (ex) {
                    }
                }

                if (!obj) {
                    try {
                        obj = eval("(" + rs + ")");
                    } catch (ex) {
                        window.console && console.log("ERROR", "json eval fail", ex);
                    }
                }

                if (!obj) {
                    obj = {code:"evalJsonFail", summary:"服务器异常，请稍候再试!"};
                } else if (obj["var"]) {
                    for(var i in obj["var"]) {
                        obj[i] = obj["var"][i];
                    }
                    delete obj["var"];
                }

                _callback(obj);
            });
        }
	getCookie = function (name) {
            var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return "";
        }
        return function(url, data, callback){

            var method = svrMethod[url];
            if (method) {
				if(getCookie("cookiepartid") == 1){
					url = mwsvr2 + svrPath + "?func=" + method + "&sid=" + Utils.queryString("sid");
				}else{
					url = mwsvr + svrPath + "?func=" + method + "&sid=" + Utils.queryString("sid");
				}
                
            }

            if (client) {
                return _ready(url, data, callback);
            }

            setTimeout(function(){
				if(getCookie("cookiepartid") == 1){
					$("body").append("<iframe src=\""+ mwsvr2 + proxyPath + "\" id=\"proxyPage\" name=\"proxyPage\" style=\"display:none;\"></iframe>");
				}else{
					$("body").append("<iframe src=\""+ mwsvr + proxyPath + "\" id=\"proxyPage\" name=\"proxyPage\" style=\"display:none;\"></iframe>");
				}
                
            }, 0);

            Utils.waitForReady("frames['proxyPage']._ajax", function(){
                client = frames['proxyPage']._ajax;
                _ready(url, data, callback);
            });
        };
    })();
})(window);
