var _ajax = {
    /*
    option = {
        url:url,
        callback:callback,
        type: get or post
    }
    */
    proxyUrl:{
        html5: "http://html5.mail.10086.cn/proxy.htm"
    },

    send:function(option){
        var self = this;
        if(document.domain == "html5.mail.10086.cn" || document.domain == "m.mail.10086.cn"){
            self._send(option,window);
        }else{
            self.createProxy(function(win){
                self._send(option,win);
            })
        }
    },

    _send:function(option,win){
        var self = this;
        var host = "html5.mail.10086.cn"
        if(document.domain == "m.mail.10086.cn"){
            host = location.host + '/mw' + location.pathname.match(/\d+/)[0];
        }
        var url = "http://" + host + option.path;
        url += (option.path.indexOf('?')>-1?'&':'?') + 'sid=' + self.getSid();
        url += '&cguid=' + Math.random();
        var data = option.data;
        win._ajax.post(url,data,function(res){
            option.callback && option.callback(res);
        })
    },

    createProxy:function(callback){
        var self = this;
        var url = self.proxyUrl.html5;
        var ifr = document.getElementById("ProxyHtml5");
        if(ifr && isRead){
            callback(ifr.contentWindow);
        }else{
            var ifr = document.createElement('iframe');
            ifr.onload = function(){
                isRead = true;
                callback(ifr.contentWindow);
            }
            ifr.style.display = "none"
            ifr.id = 'ProxyHtml5'
            ifr.src = url;
            document.body.appendChild(ifr);            
        }
    },

    getSid:function(){
        if(top.sid){
            return top.sid; //标准版2.3，标准版1.0，酷
        }else if(top.getArg){
            return top.getArg('sid'); //基础版（触屏版）
        }else if(top.app && top.app.get){
            return top.app.get('sid');
        }else{
            return "";
        }
    },

    BH:function(option){
        var rqBody = ['<object>',
            '<string name="version">m2012</string>',
            '<array name="behaviors">',
            '<object>',
            '<string name="action">{actionId}</string>',
            //'<string name="thingId">{thingId}</string>',
            '</object>',
            '</array>',
            '</object>'].join('');
       var data = {
            path:"/weather/weather?func=user:logBehaviorAction",
            data:rqBody.format(option),
            callback:function(res){
                console.log(res);
            }
       }
       this.send(data)
    },

    _objPool: [],

    _getInstance: function() {
        for (var i = 0; i < this._objPool.length; i++) {
            if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
                return this._objPool[i];
            }
        }
        this._objPool[this._objPool.length] = this._createObj();
        return this._objPool[this._objPool.length - 1];
    },
    _createObj: function() {
        if (window.XMLHttpRequest) {
            var objXMLHttp = new XMLHttpRequest();
        }
        else {
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            for (var n = 0; n < MSXML.length; n++) {
                try {
                    var objXMLHttp = new ActiveXObject(MSXML[n]);
                    break;
                }
                catch (e) {
                }
            }
        }
        if (objXMLHttp.readyState == null) {
            objXMLHttp.readyState = 0;
            objXMLHttp.addEventListener("load", function() {
                objXMLHttp.readyState = 4;
                if (typeof objXMLHttp.onreadystatechange == "function") {
                    objXMLHttp.onreadystatechange();
                }
            }, false);
        }
        return objXMLHttp;
    },
    post: function(url, data, callback,isSyn) {
        if (typeof data == "string") {
            data = data.trim();
        }
        this.SendRequest("post", url, data, callback,isSyn)
    },
    get: function(url, data, callback,isSyn) {
        this.SendRequest("get", url, data, callback,isSyn)
    },
    /// 开始发送请求    
    SendRequest: function(method, url, data, callback,isSyn) {
        var objXMLHttp = this._getInstance();
        if(typeof isSyn=='undefined'){isSyn = true};
        with (objXMLHttp) {
            try {
                if (url.indexOf("?") > 0) {
                    url += "&randnum=" + Math.random();
                }
                else {
                    url += "?randnum=" + Math.random();
                }
                open(method, url,isSyn);
                setRequestHeader("Content-Type", "application/xml");
                setRequestHeader("Accept", "text/javascript");
                send(data);
                onreadystatechange = function() {
                    // if(objXMLHttp.readyState == 4)
                    //   alert(objXMLHttp.status)
                    if (objXMLHttp.readyState == 4 && ((objXMLHttp.status >= 200 && objXMLHttp.status < 300) || objXMLHttp.status == 304)) {
                        callback(responseText);
                    }
                }
            }
            catch (e) {
                //alert(e);
                top.FloatingFrame.alert(UtilsMessage["UtilsNoloadError"]);
            }
        }
    }

}

var isRead =false


String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.format = function(obj){
    return this.replace(/\{([\w]+)\}/g,function(e){
        var k = e.slice(1,-1)
        return obj[k]?obj[k]:"";
    })
}

var isOpen = null;   //缓存在全局的一个变量，防止对同状态的请求

var getNoticeStutas = function(fn){
    option = {
        path:'/setting/s?func=user:getMailNotify', 
        data:'',
        callback:function(res){
            var json = eval('('+res+')');
            if(json && json['code'] == "S_OK"){
                var data = json['var'];
                var len = 0;
                for(var i=0; i<data.length; i++){
                    var d = data[i];
                    if((d.fromtype == 0 || d.fromtype == 1) && d.enable){
                        len++;
                    }
                }
                isOpen = len>=2;
                fn(isOpen);
            }else{
                fn(isOpen);
            }       
        }};
    _ajax.send(option);
}
var setData =[ '<object>',
   '<array name="mailnotify">',
     '<object>',
       '<int name="notifyid">2</int>',
       '<boolean name="enable">{open}</boolean>',
       '<int name="notifytype">1</int>',
       '<int name="fromtype">0</int>',
       '<boolean name="supply">false</boolean>',
       '<array name="timerange">',
         '<object>',
           '<int name="begin">8</int>',
           '<int name="end">22</int>',
           '<string name="weekday">1,2,3,4,5,6,7</string>',
           '<string name="discription">每天，8:00 ~ 22:00</string>',
           '<string name="tid">tid_0_0_0</string>',
         '</object>',
       '</array>',
       '<array name="emaillist">',
       '</array>',
     '</object>',
     '<object>',
       '<int name="notifyid">1</int>',
       '<boolean name="enable">{open}</boolean>',
       '<int name="notifytype">1</int>',
       '<int name="fromtype">1</int>',
       '<boolean name="supply">false</boolean>',
       '<array name="timerange">',
         '<object>',
           '<int name="begin">8</int>',
           '<int name="end">22</int>',
           '<string name="weekday">1,2,3,4,5,6,7</string>',
           '<string name="discription">每天，8:00 ~ 22:00</string>',
           '<string name="tid">tid_1_1_0</string>',
         '</object>',
       '</array>',
       '<array name="emaillist">',
       '</array>',
     '</object>',
   '</array>',
 '</object>'].join("");

var setNotice = function(fn,option){
    var data = setData.format(option)
    var option = {
        path:"/setting/s?func=user:updateMailNotify",
        data:data,
        callback:function(res){
            var json = eval('('+res+')');
            fn(json);
            try{
                top.$App && top.$App.trigger("userAttrChange");
            }catch(e){};
        }
    }
    _ajax.send(option);
}
