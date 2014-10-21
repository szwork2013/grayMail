/**
 * @fileOverview 定义文本处理类静态函数.
 */

(function (jQuery) {
    var $ = jQuery;
    /**定义文本处理类静态函数，缩写为$T
    *@namespace
    *@inner
    */
    M139.Text =
    /**@lends M139.Text */
    {
    /**
    *@namespace
    */
    Mobile: {
        /***
        *获得匹配中国移动手机号的正则(可能来自全局配置)
        *@returns {RegExp}
        **/
        getChinaMobileRegex: function () {
            return new RegExp("^8613[4-9][0-9]{8}$|^8615[012789][0-9]{8}$|^8618[23478][0-9]{8}$|^8614[7][0-9]{8}$");
        },
        /***
        *获得匹配移动手机号的正则(可能来自全局配置)
        *@returns {RegExp}
        **/
        getMobileRegex: function () {
            return new RegExp("^8613[0-9]{9}$|^8615[012356789][0-9]{8}$|^8618[0-9]{9}$|^8614[7][0-9]{8}$");
        },
        /***
        *检测输入文本是否为一个手机号（中国大陆的手机号），文本必须为纯数字号码
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isMobile: function (text) {
            text = this.add86(text);
            return this.getMobileRegex().test(text);
        },
        /***
        *检测输入文本是否为中国移动的手机号，文本必须为纯数字号码
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isChinaMobile: function (text) {
            if (!text) return false;
            text = this.add86(text);
            return this.getChinaMobileRegex().test(text);
        },
        /***
        *检测输入文本是否为一个手机号（中国大陆的手机号），可以带人名加尖括号，如："李福拉"<15889394143>
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isMobileAddr: function (text) {
            if (/^\d+$/.test(text)) {
                return this.isMobile(text);
            }
            var reg = /^(?:"[^"]*"|'[^']*'|[^"<>;,；，]*)\s*<(\d+)>$/;
            var match = text.match(reg);
            if (match) {
                var number = match[1];
                return this.isMobile(number);
            } else {
                return false;
            }
        },
        /***
        *检测输入文本是否为一个中国移动手机号，可以带人名加尖括号，如："李福拉"<15889394143>
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isChinaMobileAddr: function (text) {
            if (/^\d+$/.test(text)) {
                return this.isChinaMobile(text);
            }
            var reg = /^(?:"[^"]*"|'[^']*'|[^"<>;,；，]*)\s*<(\d+)>$/;
            var match = text.match(reg);
            if (match) {
                var number = match[1];
                return this.isChinaMobile(number);
            } else {
                return false;
            }
        },
        /***
        *解析一段字符串里的多个手机号，一般为逗号或分号分隔，并返回解析结果
        *@param {String} inputText 要解析的文本
        *@param {Object} options 可选参数，高级参数
        *@param {String} options.checkType 当该属性为chinamobile的时候，检查里面的手机号是中国移动手机号
        *@returns {Object} 返回一个结果集obj,obj.error表示非法的字段，obj.numbers表示收集到的手机号
        *@example
        var result = $Mobile.parse("15889394143;李福拉<13600000000>;lifula");
        //返回的结果
        {
        error:"lifula",//这个不是手机号
        numbers:["15889394143",'"李福拉"<13600000000>']
        }
        **/
        parse: function (inputText, options) {
            var result = {};
            result.error = "";
            if (typeof inputText != "string") {
                result.error = "参数不合法";
                return result;
            }
            /*
            简单方式处理,不覆盖签名里包含分隔符的情况
            */
            var lines = inputText.split(/[;,，；]/);
            var resultList = result.numbers = [];
            for (var i = 0; i < lines.length; i++) {
                var text = $.trim(lines[i]);
                if (text == "") continue;
                var checked = false;

                if (options && options.checkType && options.checkType.toLowerCase() == "chinamobile") {
                    checked = this.isChinaMobileAddr(text)
                } else {
                    checked = this.isMobileAddr(text)
                }

                if (checked) {
                    resultList.push(text);
                } else {
                    result.error = text;
                }
            }
            if (!result.error) {
                result.success = true;
            } else {
                result.success = false;
            }
            return result;
        },
        /**
        *返回一段带人名的手机地址中的人名，如：lifula<15889394143>中的"lifula"
        *@returns {String}
        */
        getName: function (addr) {
            if (this.isMobileAddr(addr)) {
                if (addr.indexOf("<") == -1) {
                    return "";
                } else {
                    return addr.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
                }
            }
            return "";
        },
        /**
        *返回一段带人名的手机地址中的手机号，如：lifula<15889394143>中的"15889394143"
        *@returns {String}
        */
        getNumber: function (addr) {
            if (typeof (addr) != "string") return "";
            addr = addr.trim();
            if (this.isMobile(addr)) {
                return addr;
            } else {
                var reg = /<(\d+)>$/;
                var match = addr.match(reg);
                if (match) {
                    return match[1].toLowerCase();
                } else {
                    return "";
                }
            }
            return "";
        },
        /**
        *判断两个手机号是否相等
        *@returns {Boolean}
        *@example
        $Mobile.compare("15889394143","李福拉<8615889394143>");//返回true
        */
        compare: function (mobile1, mobile2) {
            if (!mobile1 || !mobile2) {
                return false;
            }
            mobile1 = this.remove86(this.getNumber(mobile1));
            mobile2 = this.remove86(this.getNumber(mobile2));
            if (mobile1 && mobile1 == mobile2) return true;
            return false;
        },

        /**
        * 把传入字符串中的多个手机号码分解出来
        * @param {String} text 多个手机地址
        * @returns {Array}
        * @example
        $Mobile.splitAddr("15889394143,13600000000");
        //返回["15889394143","13600000000"]
        */
        splitAddr: function (text) {
            var list = text.split(/[,;；，]/);
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
                if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
                    var nextItem = list[i + 1];
                    if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                        list[i] = item + " " + nextItem;
                        list.splice(i + 1, 1);
                        i--;
                    }
                }
            }
            return list;
        },
        
        /**
        *给手机号码添加86，如果已存在则不添加
        *@returns {String}
        */
        add86: function (mobile) {
            if (typeof mobile != "string") mobile = mobile.toString();
            return mobile.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
        },
        /**
        *移除手机号码前的86
        *@returns {String}
        */
        remove86: function (mobile) {
            if (typeof mobile != "string") mobile = mobile.toString();
            return mobile.trim().replace(/^86(?=\d{11}$)/, "");
        },
        /**
        *根据人名以及手机号得到发送文本
        *@returns {String}
        *@example
        $Mobile.getSendText("李福拉","15889394143");
        //返回"李福拉"<15889394143>
        */
        getSendText: function (name, number) {
            if (typeof name != "string" || typeof number != "string") return "";
            return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g, "") + ">";
        }
    },
    /**
    *@namespace
    */
    Email: {
        /**
        *获得检测邮件地址的正则表达式(可能来自全局配置)
        *@returns {RegExp}
        */
        getEmailRegex: function () {
            //RFC 2822 太耗性能
            //return new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
            return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        },
        getEmailRegexQuckMode:function(){
            return /<([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6})>$/i;
        },
        /**
        * 验证邮箱地址是否合法
        * @param {string} text 验证的邮箱地址字符串
        * @returns {Boolean}
        * @example
        $Email.isEmail("lifula@139.com");//返回true
        */
        isEmail: function (text) {
            if (typeof text != "string") return false;
            text = $.trim(text);
            //RFC 2822
            var reg = this.getEmailRegex();
            return reg.test(text);
        },
        /**
        * 验证邮箱地址是否合法(可以带人名)
        * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
        * @returns {Boolean}
        * @example
        $Email.isEmailAddr("李福拉&lt;lifula@139.com&gt;");//返回true
        */
        isEmailAddr: function (text) {
            if (typeof text != "string") return false;
            text = $.trim(text);
            //无签名邮件地址
            if (this.isEmail(text)) {
                return true;
            }
            //完整格式
            var r1 = /^(?:"[^"]*"\s?|[^;,，；"]*|'[^']*')<([^<>\s]+)>$/;
            var match = text.match(r1);
            if (match) {
                if (this.isEmail(match[1])) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        },
        /**
        * 得到带人名的邮箱地址字符中的邮件地址部分。
        * @param {String} text 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getName("李福拉<lifula@139.com>");//返回"李福拉"
        $Email.getName("lifula@139.com");//返回"lifula"
        */
        getName: function (email) {
            if (typeof email != "string") return "";
            email = email.trim();
            if (this.isEmail(email)) {
                return email.split("@")[0];
            } else if (this.isEmailAddr(email)) {
                var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = $.trim(name.replace(/"/g, ""));
                if (name == "") return this.getAccount(email);
                return name;
            } else {
                return "";
            }
        },

        /**
         *快速模式，提高性能
         */
        getNameQuick: function (email) {
            var result = "";
            if (email.indexOf("<") == -1) {
                if (this.isEmail(email)) {
                    result = email.split("@")[0];
                } 
            }else{
                var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = name.replace(/"/g, "").trim();
                result = name || this.getAccount(email);
            }
            return result;
        },

        getObjQuick:function(text){
            var reg,match;
            if (text.indexOf("<") > -1) {
                reg = this.getEmailRegexQuckMode();
                match = text.match(reg);

                var name = text.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = name.replace(/"/g, "").trim();
                result = name || this.getAccount(text);

                return { original: text, email: match ? match[1].toLowerCase() : "", name: result }
            }else{
                reg = this.getEmailRegex();
                match = text.match(reg);
                return { original: text, email: match ? match[0].toLowerCase() : "", name: match[1] }
            }
        },

        /**
        * 得到带人名的邮箱地址字符中的邮件地址部分。
        * @param {String} text 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getEmail("李福拉&lt;lifula@139.com&gt;");//返回"lifula@139.com"
        */
        getEmail: function (text) {
            if (this.isEmailAddr(text)) {
                return this.getAccount(text) + "@" + this.getDomain(text);
            }
            return "";
        },

        getEmailQuick:function(text){
            var reg,match;
            if (text.indexOf("<") > -1) {
                reg = this.getEmailRegexQuckMode();
                match = text.match(reg);
                return match ? match[1].toLowerCase() : "";
            }else{
                reg = this.getEmailRegex();
                match = text.match(reg);
                return match ? match[0].toLowerCase() : "";
            }
        },

        /**
        * 得到邮箱地址字符中的账号部分。
        * @param {String} email 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getAccount("lifula@139.com");//返回"lifula"
        */
        getAccount: function (email) {
            if (typeof email != "string") return "";
            email = $.trim(email);
            if (this.isEmail(email)) {
                return email.split("@")[0].toLowerCase();;
            } else if (this.isEmailAddr(email)) {
                return email.match(/<([^@<>]+)@[^@<>]+>$/)[1].toLowerCase();
            } else {
                return "";
            }
        },
        /**
        * 得到邮箱地址字符中的域名部分。
        * @param {String} email 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getDomain("lifula@139.com");//返回"139.com"
        */
        getDomain: function (email) {
            if (typeof email != "string") return "";
            email = $.trim(email);
            if (this.isEmail(email)) {
                return email.split("@")[1].toLowerCase();
            } else if (this.isEmailAddr(email)) {
                return email.match(/@([^@]+)>$/)[1].toLowerCase();
            } else {
                return "";
            }
        },
        /**
        * 把传入字符串中的多个邮件地址解析出来
        * @param {String} text 多个邮件地址
        * @returns {Array}
        * @example
        $Email.splitAddr("lifula@139.com;李福拉&lt;lifl@richinfo.cn&gt;");
        //返回["lifula@139.com","李福拉&lt;lifl@richinfo.cn&gt;"]
        */
        splitAddr: function (text) {
            var list = text.split(/[,;；，]/);
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
                if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
                    var nextItem = list[i + 1];
                    if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                        list[i] = item + " " + nextItem;
                        list.splice(i + 1, 1);
                        i--;
                    }
                }
            }
            return list;
        },
        /**
        * 比对2个邮件地址是否相同
        * @param {String} email1 邮箱1
        * @param {String} email2 邮箱2
        * @returns {Boolean}
        * @example
        $Email.compare("lifula@139.com","李福拉&lt;lifula@139.com&gt;");//返回true
        */
        compare: function (email1, email2) {
            var m1 = this.getEmail(email1).toLowerCase();
            if (m1 && m1 == this.getEmail(email2).toLowerCase()) {
                return true;
            }
            return false;
        },
        /**
        * 格式化发件人地址
        * @param {String} name 署名
        * @param {String} email 邮件地址
        * @returns {String}
        * @example
        $Email.getSendText('李福拉','lifula@139.com');
        //返回"李福拉"&lt;lifula@139.com&gt;
        */
        getSendText: function (name, email) {
            if (typeof name != "string" || typeof email != "string") return "";
            return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + email.replace(/[\s;,；，<>"]/g, "") + ">";
        },
        /**
        * 解析一长串用户输入的邮件地址，得到解析结果
        * @param {Object} mailText 邮箱地址字符串，如："人名"&lt;account@139.com&gt;;account@139.com;account@139.com
        * @returns {Object}
        * @example
        $Email.parse('"人名"&lt;account@139.com&gt;;account@139.com;abc');
        //返回
        {
        error:"abc",//不是合法邮箱地址
        emails:['"人名"&lt;account@139.com&gt;',"account@139.com"]
        }
        */
        parse: function (mailText) {
            var result = {};
            result.error = "";
            if (typeof mailText != "string") {
                result.error = "参数不合法";
                return result;
            }
            /*
            简单方式处理,不覆盖签名里包含分隔符的情况
            */
            var lines = mailText.split(/[;,，；]/);
            var resultList = result.emails = [];
            for (var i = 0; i < lines.length; i++) {
                var text = $.trim(lines[i]);
                if (text == "") continue;
                if (this.isEmail(text)) {
                    resultList.push(text);
                } else if (this.isEmailAddr(text)) {
                    resultList.push(text);
                } else {
                    result.error = text;
                }
            }
            if (!result.error) {
                result.success = true;
            } else {
                result.success = false;
            }
            return result;
        },
        /**
		 * 解析email地址成数组对象
		 * <pre>示例：<br>
		 * <br>Utils.parseEmail("abc@abc.com");
		 * </pre>
		 * @param {string} text 必须参数，邮箱地址。
		 * @return {数组对象}
		 */
        parseEmail : function(text){
		    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
		    var regName=/^"([^"]+)"|^([^<]+)</;
		    var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
		    var matches=text.match(reg);
		    var result=[];
		    if(matches){
		        for(var i=0,len=matches.length;i<len;i++){
		            var item={};
		            item.all=matches[i];
		            var m=matches[i].match(regName);
		            if(m)item.name=m[1];
		            m=matches[i].match(regAddr);
		            if(m)item.addr=m[1];
		            if(item.addr){
		                item.account=item.addr.split("@")[0];
		                item.domain=item.addr.split("@")[1];
		                if(!item.name)item.name=item.account;
		                result.push(item);
		            }
		        }
		    }
		    return result;
		},
		getMailListFromString : function (p){
			if(typeof p != 'string'){
				return;
			}
	        p = p.split(",");
	        for(var i=0;i<p.length;i++){
	            if(p[i].trim()==""){
	                p.splice(i, 1);
	                i--;
	            }
	        }
		    return p;
		}
    },
    /**
    *@namespace
    */
    Url: {
        /**获取Url中的Get参数
        *@param {String} key url中的查询参数
        *@param {String} url 可选参数，默认是取当前窗口的location.href
        *@returns {String}
        *@example
        var sid = $T.Url.queryString("sid");
        */
        queryString: function (key, url) {
            url = (url === undefined ? location.search : url);
            url = url.split(/&|\?/);
            var result = null;
            key = String(key).toLowerCase();
            for (var i = 0; i < url.length; i++) {
                var keyValue = url[i];
                var part = keyValue.split("=");
                if (part[0].toLowerCase() == key) {
                    result = part[1];
                    break;
                }
            }
            if (result) {
                try {
                    result = M139.Text.Encoding.tryDecode(result);
                } catch (e) { }
            }
            return result;
        },
        /**
        @param {String} url 可选参数,要解析的url，默认是取当前窗口的location.href
        @returns {Object} 返回{key:value}对应的所有get参数集合的对象
        @example
        var obj = $Url.getQueryObj("http://baidu.com/?a=1&b=2");
        //返回
        {
        a:"1",
        b:"2"
        }
        */
        getQueryObj: function (url) {
            var result = {};
            url = url || location.href;
            if (typeof url != "string") {
                throw "参数url必须是字符串类型";
            }
            if (url.indexOf("?") != -1) {
                var search = url.split("?")[1];
                var list = search.split("&");

                for (var i = 0; i < list.length; i++) {
                    var pair = list[i].split("=");
                    var key = pair[0];
                    var value = pair[1];
                    try {
                        value = M139.Text.Encoding.tryDecode(value);
                    } catch (e) { }
                    result[key] = value;
                }
            }
            return result;
        },
        /**拼接Url字符串
        *@param {String} url 基础地址，可以带？也可以不带？
        *@param {Object} queryObj Get查询参数
        *@returns {String}
        *@example
        var url = $T.Url.makeUrl("http://baidu.com",{
            sid:"xxxxxxx",
            key:"yyyyyyy"
        });
        得到 http://baidu.com/?sid=xxxxxxx&key=yyyyyyy
        或者
        var url = $T.Url.makeUrl("http://baidu.com","a=1&b=2");
        得到 http://baidu.com/?a=1&b=2
        自动判断是否应该加上"?"
        */ 
        makeUrl: function (url, queryObj) {
            if (url.indexOf("?") == -1) {
                url += "?";
            }
            if (!/\?$/.test(url)) {
                url += "&";
            }
            if (typeof queryObj == "string") {
                url += queryObj;
            } else {
                url += this.urlEncodeObj(queryObj);
            }
            return url;
        },
        /**inner*/
        urlEncodeObj: function (queryObj) {
            var arr = [];
            for (var p in queryObj) {
                if (queryObj.hasOwnProperty(p)) {
                    arr.push(p + "=" + encodeURIComponent(queryObj[p]));
                }
            }
            return arr.join("&");
        },
        /**通过相对地址获得绝对地址,在非ie系列回调子串口的Function相当有用
        *@param {String} relativeUrl 必选参数，要转化的相对地址
        *@param {String} baseUrl 可选参数，参照的url,默认取当前窗口的location.href
        *@returns {String}
        *@example
        var url = $T.Url.getAbsoluteUrl("/s");
        得到 http://mail.10086.cn/s
        */
        getAbsoluteUrl: function (relativeUrl, baseUrl) {
            baseUrl = baseUrl || location.href;
            baseUrl = baseUrl.split("?")[0];//去掉search
            baseUrl = baseUrl.replace(/([^:\/])\/+/g, "$1/");//去掉重复的斜杠
            relativeUrl = relativeUrl.replace(/\/+/g, "/");//去掉重复的斜杠
            baseUrl = baseUrl.replace(/\/[^\/]*$/, "");//去掉最后一级路径
            if (relativeUrl.indexOf("http://") > -1) {
                return relativeUrl;
            }
            if (relativeUrl.indexOf("/") == 0) {
                return "http://" + this.getHost(baseUrl) + relativeUrl;
            }
            while (relativeUrl.indexOf("../") == 0) {
                relativeUrl = relativeUrl.replace("../", "");
                baseUrl = baseUrl.replace(/\/[^\/]*$/, "");
            }
            return baseUrl + "/" + relativeUrl;
        },
        /**
        *根据完整的本地路径或者网络路径，获得文件名
        *@returns {String}
        */
        getFileName: function (fullpath) {
            if (typeof fullpath == "string") {
                var url = fullpath.split("?")[0];
                var reg = /[^\/\\]+$/;
                var m = url.match(reg);
                if (m) {
                    return m[0];
                }
            }
            return "";
        },
        /**
        *获得小写的文件扩展名，不带.号
        *@returns {String}
        */
        getFileExtName: function (fileName) {
            if (fileName && fileName.indexOf(".") > -1) {
                return fileName.split(".").pop().toLowerCase();
            }
            return "";
        },
        /**
         *获得文件名，不包括扩展名
         *@returns {String}
         */
        getFileNameNoExt: function (filePath) {
            var name = this.getFileName(filePath);
            return name.replace(/([^.]+)\.[^.]+$/, "$1");
        },

        /**
         *根据给出的长度截断文件名，显示...，但是保留扩展名
         *@param {String} fileName 文件名
         *@param {Number} maxLength 要截断的最大长度
         *@returns {String} 返回缩略的文件名
         */
        getOverflowFileName: function(fileName,maxLength) {
            maxLength = maxLength || 25;
            fileName = this.getFileName(fileName);
            if (fileName.length <= maxLength) {
                return fileName;
            }
            var point = fileName.lastIndexOf(".");
            if (point == -1 || fileName.length - point > 5) {
                return fileName.substring(0, maxLength - 2) + "…";
            }
            var pattern = "^(.{" + (maxLength - 4) + "}).*(\\.[^.]+)$";
            return fileName.replace(new RegExp(pattern), "$1…$2");
        },

        /**
         *判断字符串是否为一个url链接
         *@param {String} url 要判断的文本
         *@returns {Boolean}
         */
        isUrl: function (url) {
            var reg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
            return reg.test(url);
        },

        /**
         *根据一个url返回host
         *@example
         M139.Text.Url.getHost("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn
         */
        getHost: function (url) {
            url = this.removeProtocols(url);
            var match = url.match(/([^\/]+)/);
            if (match) {
                return match[1];
            } else {
                return "";
            }
        },

        /**
         *移除一个url的协议部分
         *@example
         M139.Text.Url.removeProtocols("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn/g2
         */
        removeProtocols: function (url) {
            try{
                return url.replace(/^(http|ftp|https|file):\/\//, "");
            } catch (e) {
                return "";
            }
        },

        /**
         *移除一个http url的协议部分
         *@example
          M139.Text.Url.removeHttp("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn/g2
         */
        removeHttp:function(){
            return this.removeProtocols.apply(this,arguments);
        },

        /**
         *当你不确定一个url是否缺少http://开头的时候，可以调用一下(请别传一个相对地址进来)
         *@returns {String}
         *@example
         $Url.addHttp("163.com");
         返回:http://163.com
         */
        addHttp:function(url){
            if (!/^https?:\/\//.test(url)) {
                url = "http://" + url;
            }
            return url;
        },

        /**
         *连接一个url的多个部分，自动识别是否需要加上反斜杠
         *@returns {String}
         *@example
         $Url.joinUrl("appmail.mail.10086.cn","sms/sms");
         返回:appmail.mail.10086.cn/sms/sms
         */
        joinUrl:function(){
            return Array.prototype.join.call(arguments, "/").replace(/\/+/g,"/");//替换多余的/
        },

        /**
         *根据一个url移除host部分
         *@example
         M139.Text.Url.removeHost("http://appmail.mail.10086.cn/g2");//返回 /g2
         */
        removeHost: function (url) {
            url = this.removeProtocols(url);
            return url.replace(/^[^\/]+/, "");
        }
    },
    /**
    *@namespace
    */
    Xml: {
        /**@inner*/
        xml_encodes: {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        },
        /**@inner*/
        xml_decodes: {
            '&amp;': '&',
            '&quot;': '"',
            '&lt;': '<',
            '&gt;': '>'
        },
        /**
        *编码文本中的xml特殊字符
        *@param {String} text 要编码的文本
        *@returns {String}
        */
        encode: function (text) {
            if (typeof text != "string") {
                if (text === undefined) {
                    text = "";
                } else {
                    text = String(text);
                }
            } else if (text.indexOf("<![CDATA[") == 0) {
                return text;
            }
            var map = this.xml_encodes;
            //多次replace有bug，必须用逼近式替换
            return text.replace(/([\&"<>])/g, function (str, item) {
                return map[item];
            });
        },
        /**
        *解码文本中的xml实体字符
        *@param {String} text 要解码的文本
        *@returns {String}
        */
        decode: function (text) {
            var map = this.xml_decodes;
            return text.replace(/(&quot;|&lt;|&gt;|&amp;)/g, function (str, item) {
                return map[item];
            });
        },
        /**
        *解析xml文本，返回一个文档对象，捕获异常，解析失败返回null
        *@param {String} xmlString 要解析的xml文本
        *@returns {XMLDocument}
        */
        parseXML: function (xmlString) {
            var doc = null;
            try {
                if (document.all) {
                    var ax = this.getIEXMLDoc();
                    ax.loadXML(xmlString);
                    if (ax.documentElement) {
                        doc = ax;
                    }
                } else {
                    doc = jQuery.parseXML(xmlString);
                }
            } catch (e) { }
            return doc;
        },
        /**
        *主要为了兼容某些ie浏览器的xml组件有bug(jQuery没做容错)
        *@returns {XMLDocument}
        */
        getIEXMLDoc: function () {
            var XMLDOC = ["Microsoft.XMLDOM", "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
            if (this.enabledXMLObjectVersion) return new ActiveXObject(this.enabledXMLObjectVersion);
            for (var i = 0; i < XMLDOC.length; i++) {
                try {
                    var version = XMLDOC[i];
                    var obj = new ActiveXObject(version);
                    if (obj) {
                        this.enabledXMLObjectVersion = version; //缓存结果
                        return obj;
                    }
                } catch (e) { }
            }
            return null;
        },

        /**
         *将js对象转化成普通的xml文档字符串
         *@example
         var str = $Xml.obj2xml2({
            person:{
                name:"Lily",
                age:18
            }
         });
         返回：
         &lt;person&gt;
            &lt;name&gt;Lily&lt;/name&gt;
            &lt;age&gt;18&lt;/age&gt;
         &lt;/person&gt;
        */
        obj2xml2:function(inputObj) {
            var result = [];
            function obj2xmlInner(obj) {
                for (var elem in obj) {
                    var current = obj[elem];
                    if (typeof (current) == "string" || typeof (current) == "number" || typeof (current) == "boolean") {
                        var val = typeof (current) == "string" && current.indexOf("<![CDATA[") == 0 ? current : M139.Text.Xml.encode(current)
                        result.push("<" + elem + ">" + val + "</" + elem + ">");
                    } else if($.isArray(current)){
                        for(var i=0;i<current.length;i++){
                            result.push("<" + elem + ">");
                            result.push(obj2xmlInner(current[i]));
                            result.push("</" + elem + ">");
                        }
                    } else if (current && current.attributes){
                        result.push("<" + elem + " ");
                        for (var j in current.attributes) {
                            if (current.attributes.hasOwnProperty(j)) {
                                result.push(j + '="' + current.attributes[j] + '" ');
                            }
                        }
                        result.push(">");
                        delete current.attributes;
                        result.push(obj2xmlInner(current));
                        result.push("</" + elem + ">");
                    } else if (typeof (current) == "object") { //数组或object
                        result.push("<" + elem + ">");
                        result.push(obj2xmlInner(current));
                        result.push("</" + elem + ">");
                    }
                }
                //return result;
            }
            obj2xmlInner(inputObj);
            return result.join("");

        },
        /**
        *以rm报文的形式将object转换为xml
        *@param {Object} obj 要转换的对象实体
        *@returns {String}
        *@example
        var str = $Xml.obj2xml({name:"Lily",age:18});
        返回:
        &lt;object&gt;
        &lt;string name="name"&gt;Lily&lt;/string&gt;
        &lt;int name="age"&gt;18&lt;/int&gt;
        &lt;/object>
        */
        obj2xml: function (obj) {
            return varToXML(obj);
            function varToXML(obj) {
                return namedVarToXML(null, obj, "\n").substr(1);
            }
            function getDataType(obj) {
                return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
            }
            function namedVarToXML(name, obj, prefix) {
                if (obj == null) {
                    return prefix + tagXML("null", name);
                }
                var type = getDataType(obj);
                if (type == "String") {
                    return prefix + tagXML("string", name, $Xml.encode(textXML(obj)));
                } else {
                    if (type == "Object") {
                        if (obj.nodeType) {
                            T.Tip.show("参数错误");
                            return "";
                        }
                        var s = "";
                        for (var i in obj) {
                            s += namedVarToXML(i, obj[i], prefix + "  ");
                        }
                        return prefix + tagXML("object", name, s + prefix);
                    } else {
                        if (type == "Array") {
                            var s = "";
                            for (var i = 0; i < obj.length; i++) {
                                s += namedVarToXML(null, obj[i], prefix + "  ");
                            }
                            return prefix + tagXML("array", name, s + prefix);
                        } else {
                            if (type == "Boolean" || type == "Number") {
                                var s = obj.toString();
                                return prefix + tagXML(getVarType(obj, s), name, s);
                            } else {
                                if (type == "Date") {
                                    var s = "" + obj.getFullYear() + "-" + (obj.getMonth() + 1) + "-" + obj.getDate();
                                    if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                                        s += " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
                                    }
                                    return prefix + tagXML(getVarType(obj, s), name, s);
                                } else {
                                    return "";
                                }
                            }
                        }
                    }
                }
            }
            function getVarType(obj, stringValue) {
                if (obj == null) {
                    return "null";
                }
                var type = getDataType(obj);
                if (type == "Number") {
                    var s = stringValue ? stringValue : obj.toString();
                    if (s.indexOf(".") == -1) {
                        if (obj >= -2 * 1024 * 1024 * 1024 & obj < 2 * 1024 * 1024 * 1024) {
                            return "int";
                        } else {
                            if (!isNaN(obj)) {
                                return "long";
                            }
                        }
                    }
                    return "int";
                } else {
                    return type.toLowerCase();
                }
            }
            function tagXML(dataType, name, val) {
                var s = "<" + dataType;
                if (name) {
                    s += " name=\"" + textXML(name) + "\"";
                }
                if (val) {
                    s += ">" + val;
                    if (val.charAt(val.length - 1) == ">") {
                        s += "\n";
                    }
                    return s + "</" + dataType + ">";
                } else {
                    return s + " />";
                }
            }
            function textXML(s) {
                s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
                return s;
            }
            function replaceDataType(arr, xml) {
                var count = arr.length;
                for (var i = 0; i < count; i++) {
                    xml = xml.replace(arr[i].type, arr[i].replaceTxt);
                }
                return xml;
            }
        },
        /**
         *处理简单的xml文本转换成obj对象
         *@param {String} xml 要处理的xml文本
         *@returns {Object}
         *@example
         var obj = M139.Text.Xml.xml2object("&lt;person&gt;&lt;name&gt;lily&lt;/name&gt;&lt;age&gt;19&lt;/age&gt;&lt;/person&gt;");
         返回：
         {name:"lily",age:"19"}
        */
        xml2object: function (xml) {
            var result = null;
            var doc = this.parseXML(xml);
            if (doc && doc.documentElement) {
                var el = doc.documentElement;
                result = getObject(el);
            }
            return result;
            function getObject(el) {
                if (el.firstChild && el.firstChild.nodeType == 3) {
                    return $(el.firstChild).text();
                } else {
                    if (el.firstChild) {
                        var obj = {};
                        if (el.childNodes) {
                            for (var i = 0; i < el.childNodes.length; i++) {
                                var child = el.childNodes[i];
                                var oldItem = obj[child.nodeName];
                                //如果一个相同名称的节点出现多次，则第一次当做一个对象，第二次则组装成数组
                                if (oldItem) {
                                    if (!$.isArray(oldItem)) {
                                        obj[child.nodeName] = [oldItem];
                                    }
                                    obj[child.nodeName].push(getObject(child));
                                } else {
                                    obj[child.nodeName] = getObject(child);
                                }
                            }
                        }
                        return obj;
                    } else {
                        return "";
                    }
                }
            }
        }
    },
    /**
    *@namespace
    */
    Html: {
        /**@inner*/
        html_decodes: {
            '&amp;': '&',
            '&quot;': '"',
            '&lt;': '<',
            '&gt;': '>',
            "&nbsp;": " ",
            "&#39;": "'"
        },
        /**
        *转义html为安全文本
        *@returns {String}
        */
        encode: function (str) {
            if (typeof str != "string") return "";
            str = str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/\'/g, "&#39;")
                .replace(/ /g, "&nbsp;")
            //.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
            return str;
        },
        /**
        *encode的逆函数
        *@returns {String}
        */
        decode: function (text) {
            if (typeof text != "string") return "";
            var map = this.html_decodes;
            //多个replace会有bug
            return text.replace(/(&quot;|&lt;|&gt;|&amp;|&nbsp;|&#39;)/g, function (str, item) {
                return map[item];
            });
            return text;
        }
    },
    /**一些难分类的函数在此命名空间下定义
    *@namespace
    */
    Utils: {
        /***
        *获得描述性的文件大小文本，如：传入1124，返回1.1KB
        *@param {Number} fileSize 必选参数，文件大小
        *@param {String} options.byteChar 可选参数,可以把"B"替换为"字节"
        *@param {String} options.maxUnit 可选参数,最大单位,目前支持：B|K|M,默认为G
        *@param {String} options.comma 可选参数,是否用逗号分开每千单位
        *@returns {String}
        *@example
        //返回1G
        $T.Utils.getFileSizeText(1024 * 1024 * 1024);
        //返回10字节
        $T.Utils.getFileSizeText(10,{
        byteChar:"字节"
        });
        //返回102400B
        $T.Utils.getFileSizeText(102400,{
        maxUnit:"B"
        });
        //返回5,000KB
        $T.Utils.getFileSizeText(1024 * 5000,{
        maxUnit:"K",
        comma:true
        });
        */
        getFileSizeText: function (fileSize, options) {
            var unit = "B";
            if (!options) { options = {};}
            if (options.byteChar) {
                unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
                if (options.maxUnit == "B") options.maxUnit = unit;
            }
            var maxUnit = options.maxUnit || "T";
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "K";
                fileSize = fileSize / 1024;
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "M";
                    fileSize = fileSize / 1024;
                    //debugger
                    if (unit != maxUnit && fileSize >= 1024) {
                        unit = "G";
                        fileSize = fileSize / 1024;
						if(unit != maxUnit && fileSize >= 1024){
							unit = "T";
							fileSize = fileSize / 1024;
						}
                    }
                }
                fileSize = Math.ceil(fileSize * 100) / 100;
            }
            if (options.comma) {
                var reg = /(\d)(\d{3})($|\.)/;
                fileSize = fileSize.toString();
                while (reg.test(fileSize)) {
                    fileSize = fileSize.replace(reg, "$1,$2$3");
                }
            }
            return fileSize + unit;
        },
        /**
        *截断字符串，并显示省略号
        * @param {String} text 必选参数，要截断的字符串。
        * @param {Number} maxLength 必选参数，文字长度。
        * @param {Boolean} showReplacer 可选参数，截断后是否显示...，默认为true。
        *@returns {String}
        */
        getTextOverFlow: function (text, maxLength, showReplacer) {
            if (text.length <= maxLength) {
                return text;
            } else {
                return text.substring(0, maxLength) + (showReplacer ? "..." : "");
            }
        },
        getTextOverFlow2: function (text, maxLength, showReplacer) {
            var charArr = text.split("");
            var byteLen = 0;
            var reg=new RegExp("[\x41-\x5A]|[^\x00-\xff]", "g")
            for (var i = 0; i < charArr.length; i++) {
                var cArr = charArr[i].match(reg);
                byteLen += (cArr == null ? 1 : 2)

                if (byteLen > maxLength) {
                    return text.substring(0, i) + (showReplacer ? "..." : "");
                }
            }
            return text;
        },
        /***
        *格式化字符串，提供数组和object两种方式
        *@example
        *$T.Utils.format("hello,{name}",{name:"kitty"})
        *$T.Utils.format("hello,{0}",["kitty"])
        *@returns {String}
        */
        format: function (str, arr) {
            var reg;
            if ($.isArray(arr)) {
                reg = /\{([\d]+)\}/g;
            } else {
                reg = /\{([\w]+)\}/g;
            }
            return str.replace(reg,function($0,$1){
                var value = arr[$1];
                if(value !== undefined){
                    return value;
                }else{
                    return "";
                }
            });
        },

        /**
        * 数组数据批量格式化，返回数组 (性能优化，避免了重复构造正则)
        */
		formatBatch: function (tpl, maps) {
			var i, len, re, ret;
			var key, keys = [], keymaps = {};

			if( (len = maps.length) <= 0 ) return [];

			for (key in maps[0]) {
				keys.push(key);
				keymaps["{"+key+"}"] = key;
			}

			re = new RegExp("{(?:"+keys.join("|")+")}", 'gm');

			for(i=0,ret=[]; i<len; i++){
				ret.push(tpl.replace(re, function($0){
					return String(maps[i][keymaps[$0]]);
				}));
			}

			return ret;
		},

        /**
        * 得到字符串长度
        * <pre>示例：<br>
        * <br>alert("123".getBytes());
        * </pre>
        * @return {字符长度]
        */
        getBytes: function (str) {
            var cArr = str.match(/[^\x00-\xff]/ig);
            return str.length + (cArr == null ? 0 : cArr.length);
        },
        /**
		 * 得到xml对象
		 * <pre>示例：<br>
		 * <br>Utils.getXmlDoc(xmlStr);
		 * </pre>
		 * @param {Object} xml 必选参数，xml字符串。
		 * @return {xml对象}
		 */
        getXmlDoc: function (xml) {
            if (window.DOMParser) {
                var parser = new DOMParser();
                return parser.parseFromString(xml, "text/xml");
            }else{
		        var ax = this.createIEXMLObject();
		        ax.loadXML(xml);
		        return ax;
		    }
		},
		createIEXMLObject : function() {
		    var XMLDOC = ["Microsoft.XMLDOM","MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
		    if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
		    for (var i = 0; i < XMLDOC.length; i++) {
		        try {
		            var version = XMLDOC[i];
		            var obj = new ActiveXObject(version);
		            if (obj) {
		                enabledXMLObjectVersion = version;
		                return obj;
		            }
		        } catch (e) { }
		    }
		    return null;
		},
		/**
		 * 编码html标签字符
		 * <pre>示例：<br>
		 * <br>Utils.htmlEncode("&lt;div&gt;内容&lt;div/&gt;");
		 * </pre>
		 * @param {string} str 必选参数，要编码的html标签字符串
		 * @return {编码后的字符串}
		 */
	    htmlEncode: function(str){
	        if (typeof str == "undefined") return "";
	        str = str.replace(/&/g, "&amp;");
	        str = str.replace(/</g, "&lt;");
	        str = str.replace(/>/g, "&gt;");
	        str = str.replace(/\"/g, "&quot;");
	        //str = str.replace(/\'/g, "&apos;"); //IE不支持apos
	        str = str.replace(/ /g, "&nbsp;");
	        str = str.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
	        return str;
	    },
		/**
		 * 转换签名邮箱成对象。
		 * <pre>示例：<br>
		 * <br>Utils.parseSingleEmail('"签名"<帐号@139.com>');
		 * </pre>
		 * @param {Object} text 必选参数，邮箱地址。如："签名"<帐号@139.com> 或 帐号@139.com
		 * @return {Object 如result.addr,result.name,result.all}
		 */
		parseSingleEmail : function(text) {
		    text = $.trim(text);
		    var result = {};
		    var reg = /^([\s\S]*?)<([^>]+)>$/;
		    if (text.indexOf("<") == -1) {
		        result.addr = text;
		        result.name = text.split("@")[0];
		        result.all = text;
		    } else {
		        var match = text.match(reg);
		        if (match) {
		            result.name = $.trim(match[1]).replace(/^"|"$/g, "");
		            result.addr = match[2];
		            //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
		            result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
		            result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
		        } else {
		            result.addr = text;
		            result.name = text;
		            result.all = text;
		        }
		    }
		    if(result.name){
				result.name = this.htmlEncode(result.name);
			}
		    return result;
		},
		/**
        * 获取文件格式图标
        * size = 1 大图标 size = 0 小图标
        */
        getFileIcoClass: function(size,fileName){
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|rar|zip|7z|exe|apk|ipa|mp3|wav|iso|avi|rmvb|wmv|flv|bt|fla|swf|dvd|cd|fon)$/i;
            var length = fileName.split(".").length;
            var fileFormat = fileName.split(".")[length-1].toLowerCase();
            if(reg.test(fileName)){
                return size == 1 ? "i_file i_f_" + fileFormat : "i_file_16 i_m_" + fileFormat;
            }else{
                return size == 1 ? "i_file i_f_139" : "i_file_16 i_m_139";
            }
        },
        /**
        * 获取文件格式图标 网盘重构
        * size = 1 大图标 size = 0 小图标
        */
        getFileIcoClass2: function(size,fileName){
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|eml|rar|zip|7z|exe|apk|ipa|mp3|wav|iso|avi|rmvb|wmv|flv|bt|fla|swf|dvd|cd|fon|mp4|3gp|mpg|mkv|asf|mov|rm|wma|m4a|asf)$/i;
            var length = fileName.split(".").length;
            var fileFormat = fileName.split(".")[length-1].toLowerCase();
            if(reg.test(fileName)){
                return size == 1 ? "i_file i_f_" + fileFormat : "i-file-smalIcion i-f-" + fileFormat;
            }else{
                return size == 1 ? "i_file i_f_139" : "i-file-smalIcion i_m_139";
            }
        },
        /** 
         * 文本编辑框文字聚焦到最后
		 * <pre>示例：<br>
		 * <br>$T.Utils.textFocusEnd(document.getElementById('text'));
		 * </pre>
		 * @param {Object} textObj 必选参数，文本框DOM对象
        */
        textFocusEnd: function(textObj){
            if(textObj){
                textObj.focus();
                var len = textObj.value.length;
                if (document.selection) { //IE
                    var sel = textObj.createTextRange();
                    sel.moveStart('character', len);
                    sel.collapse();
                    sel.select();
                } else if (typeof textObj.selectionStart == 'number' && typeof textObj.selectionEnd == 'number') {
                    textObj.selectionStart = textObj.selectionEnd = len; //非IE 
                }
            }
        },
        /**
         *获得一个cguid，带在请求的url上，方便前后端串联日志
         *cguid规范：由时间和4位的随机数组成。格式：小时+分+秒+毫秒+4位的随机
         */
        getCGUID: function (d) {
            function padding(n, m) {
                var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
                return new Array(len + 1).join("0") + n;
            };
            var now = d || new Date();
            return '' + padding(now.getHours()) + padding(now.getMinutes()) + padding(now.getSeconds()) + padding(now.getMilliseconds(), 3) + padding(Math.ceil(Math.random() * 9999), 4);
        },


        /**
         *从cguid中提取时间(因为只有精确到小时，所以日期可能不准)
         */
        getDateTimeFromCGUID: function (cguid) {
            var reg = /^(\d{2})(\d{2})(\d{2})(\d{3})/;
            var match = cguid.match(reg);
            if (match) {
                var h = parseInt(match[1], 10);
                var m = parseInt(match[2], 10);
                var s = parseInt(match[3], 10);
                var ms = parseInt(match[4], 10);
                var d = new Date();
                return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s, ms);
            } else {
                return null;
            }
        }
        
    },
    /**
    *@namespace
    */
    Cookie: {
        /**
        *读取cookie值
        *@returns {String}
        */
        get: function (name) {
            var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return "";
        },
        /**
        *@param {Object} options 参数配置
        *@param {String} options.name cookie的名称
        *@param {String} options.value cookie的值
        *@param {String} options.domain cookie访问权限域名，默认为当前域名
        *@param {String} options.path 默认为 /
        *@param {Date} options.expires 如果不设置，则默认为会话cookie
        *@returns {void}
        */
        set: function (options) {
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
        }
    },
    /**
    *@namespace
    */
    Encoding: {
        /**
         *当编码字符串不确定是用escape还是encodeURIComponent哪种方式编码的时候，可以使用这个来尝试性解码
         */
        tryDecode: function (text) {
            var result = "";
            if (/%u[0-9A-Fa-f]{4}|\+/.test(text) && !/~|!/.test(text)) {
                try {
                    result = unescape(text);
                } catch (e) { }
            } else {
                try {
                    result = decodeURIComponent(text);
                } catch (e) { }
            }
            return result;
        }
    }
};

//定义缩写
$T = M139.Text;
$Xml = M139.Text.Xml;
$JSON = M139.Text.JSON;
$Cookie = M139.Text.Cookie;
$Email = M139.Text.Email;
$Mobile = M139.Text.Mobile;
//fixed
$Mobile.getMobile = $Mobile.getNumber;
$TextUtils = M139.Text.Utils;
$Url = M139.Text.Url;

$T.format = M139.Text.Utils.format;
/**@inner*/

if(typeof String.prototype.trim !== "function") {
	String.prototype.trim = function () {
	    return this.replace(/^\s+|\s+$/g, "");
	};
}

String.prototype.toNormalString = function(){
    var regUnc = /&#([^\;]+);/ig;
    var str = new String(this);
    var ms = str.match(regUnc);
    if (ms==null || ms.length==0)return this;
    for(var i=0; i<ms.length; i++){
        var _char = String.fromCharCode(parseInt(ms[i].replace(regUnc, "$1"),10));
        str = str.replace(ms[i], _char);
    }
    return str;
}
String.prototype.getByteCount = function(){
  var A=this.length,_,$=0;
  while(A--){
    _=this.charCodeAt(A);
    switch(true){
    case _<=127:
      $+=1;
      break ;
    case _<=2047:
      $+=2;
      break ;
    case _<=65535:
      $+=3;
      break ;
    case _<=131071:
      $+=4;
      break ;
    case _<=34359738367:
      $+=5;
      break ;
    }
  }
  return $;
}
/*String.prototype.format = function (){
    var str=this,tmp;
    for(var i=0;i<arguments.length;i++){
        tmp=String(arguments[i]).replace(/\$/g,"$$$$");
        str=str.replace(eval("/\\{"+i+"\\}/g"),tmp);
    }
    return str;
}*/
String.prototype.format = function (){
	var str = this;
	var args = arguments;
	var len = args.length;
	str = str.replace(/\{(\d+)\}/g, function($0, $1){
		$1 = String($1);
		return ($1 >= len) ? $0 : args[$1];
	});
	return str;
}
String.prototype.encode = function () {
    return M139.Text.Html.encode(this);
}
String.prototype.decode = function () {
    return M139.Text.Html.decode(this);
}
})(jQuery);