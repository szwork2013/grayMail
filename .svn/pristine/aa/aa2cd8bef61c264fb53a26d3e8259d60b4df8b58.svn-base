/**
 * 邮箱工具类
 */
MailTool = {
    /**
    * 验证邮箱地址是否合法
    * <pre>示例：<br>
    * MailTool.checkEmail('account@139.com');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串
    * @return {Boolean}
    */
    checkEmail: function (text) {
        if (typeof text != "string") return false;
        text = $.trim(text);
        //RFC 2822
        var reg = new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
        var result = reg.test(text);
        return result;
    },
    /**
    * 验证邮箱地址是否合法(另一种形式)
    * <pre>示例：<br>
    * MailTool.checkEmailText('"人名"&lt;account@139.com&gt;');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
    * @return {Boolean}
    */
    checkEmailText: function (text) {//单个
        if (typeof text != "string") return false;
        text = $.trim(text);
        //无签名邮件地址
        if (this.checkEmail(text)) {
            return true;
        }
        //完整格式
        var r1 = new RegExp('^(?:"[^"]*"\\s?|[^<>;,，；"]*)<([^<>\\s]+)>$');
        var match = text.match(r1);
        if (match) {
            if (this.checkEmail(match[1])) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    /**
    * 得到邮箱地址字符中的域名部分。
    * <pre>示例：<br>
    * MailTool.getDomain('account@domain.com');<br>rusult is "domain.com"
    * </pre>
    * @param {string} email 邮件地址字符串
    * @return {域字符串}
    */
    getDomain: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[1].toLowerCase();
        } else if (this.checkEmailText(email)) {
            return email.match(/@([^@]+)>$/)[1].toLowerCase();
        } else {
            return "";
        }
    },
    /**
    * 返回邮箱地址的前缀部分。
    * <pre>示例：<br>
    * MailTool.getAccount('account@domain.com');<br>rusult is "account"
    * </pre>
    * @param {string} email 邮箱地址字符串
    * @return {邮箱前缀字符串}
    */
    getAccount: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            return email.match(/<([^@<>]+)@[^@<>]+>$/)[1];
        } else {
            return "";
        }
    },
    /**
    * 得到人名+邮箱中的人名部分。
    * <pre>示例1：<br>
    * <br>MailTool.getName('"人名"&lt;account@domain.com&gt;');<br>
    * rusult is "人名"<br>
    * <br>示例2：<br>
    * <br>MailTool.getName('account@domain.com');<br>
    * rusult is "account"
    * </pre>
    * @param {string} email 复合邮箱地址。
    * @return {人名部分字符串}
    */
    getName: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
            name = $.trim(name.replace(/"/g, ""));
            if (name == "") return MailTool.getAccount(email);
            return name;
        } else {
            return "";
        }
    },
    /**
    * 得到邮箱地址
    * <pre>示例：<br>
    * MailTool.getAddr('"人名"&lt;account@139.com&gt;');<br>
    * rusult is "account@139.com";
    * </pre>
    * @param {string} email 邮箱地址，如："人名"&lt;account@139.com&gt;。
    * @return {邮箱地址字符串}
    */
    getAddr: function (email) {
        if (MailTool.checkEmailText(email)) {
            return MailTool.getAccount(email) + "@" + MailTool.getDomain(email);
        }
        return "";
    },
    /**
    * 比对2个邮件地址是否相同
    * <pre>示例：<br>
    * MailTool.compareEmail(emailaddr1,emailaddr2);
    * </pre>
    * @param {string} mail1 邮箱1
    * @param {string} mail2 邮箱2
    * @return {Boolean}
    */
    compareEmail: function (mail1, mail2) {
        var m1 = MailTool.getAddr(mail1).toLowerCase();
        if (m1 && m1 == MailTool.getAddr(mail2).toLowerCase()) {
            return true;
        }
        return false;
    },
    /**
    * 验证多种形式的邮箱地址。
    * <pre>示例：<br>MailTool.parse('"人名"&lt;account@139.com&gt;;account@139.com;account@139.com');</pre>
    * @param {Object} mailText 邮箱地址字符串，如："人名"&lt;account@139.com&gt;;account@139.com;account@139.com
    * @return {Boolean}
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
            if (this.checkEmail(text)) {
                resultList.push(text);
            } else if (this.checkEmailText(text)) {
                resultList.push(text);
            } else {
                result.error = "邮件地址不合法:“" + text + "”";
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
    * 验证邮箱地址是否是139邮箱。
    * <pre>示例：<br>
    * MailTool.is139Email('account@139.com');
    * </pre>
    * @param {Object} 邮箱地址字符串。
    * @return {Boolean}
    */
    is139Email: function (email) {
        var domain = this.getDomain(email);
        if (domain === (top.mailDomain || "139.com")) return true;
        return false;
    },
    /**
    * 验证邮箱地址是否是带手机号的139邮箱。
    */
    is139NumberEmail: function (email) {
        var is139 = this.is139Email(email);
        if (is139) {
            return /^\d{11}$/.test(this.getAccount(email));
        }
        return false;
    },
    /**
    * 格式化发件人地址，传入"name","account@domain.com",返回"name"<account@domain.com>
    * <pre>示例：<br>
    * MailTool.getSendText('李福拉','lifula@139.com');
    * @return {String}
    * </pre>
    */
    getSendText: function (name, addr) {
        if (!Utils.isString(name) || !Utils.isString(addr)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + addr.replace(/[\s;,；，<>"]/g, "") + ">";
    },
    /**
    * 智能分割以字符串形式存在的多个邮件地址
    * <pre>示例：<br>
    * MailTool.splitAddr('李福拉<lifula@139.com>;lifl@richinfo.cn');
    * @return {Array}
    * </pre>
    */
    splitAddr: function (text) {
        var list = text.split(/[,;；，]/);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
            //if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
            if (item.indexOf("\"") > -1 && item.indexOf("\"") == item.lastIndexOf("\"")) {
                var nextItem = list[i + 1];
                if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                    list[i] = item + " " + nextItem;
                    list.splice(i + 1, 1);
                    i--;
                }
            }
        }
        return list;
    }
}
/**
 * 号码工具类
 */
NumberTool = {
    /**
    * 加86前缀
    * <pre>示例：<br>
    * NumberTool.add86(手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {加86前缀的号码}
    */
    add86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
    },
    /**
    * 去86前缀
    * <pre>示例：<br>
    * NumberTool.add86(86手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {去86前缀的号码}
    */
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    isChinaMobileNumber: function(num) {
        num = num.toString();
        if (num.length != 13 && num.length != 11) return false;
        if (num.length == 11) {
            num = "86" + num;
        }
        var reg = new RegExp(top.UserData.regex);
		return reg.test(num);
    },
    isChinaMobileNumberText: function(text) {
        if (/^\d+$/.test(text)) {
            return this.isChinaMobileNumber(text);
        }
        var reg = /^(?:"[^"]*"|[^"<>;,；，]*)\s*<(\d+)>$/;
        var match = text.match(reg);
        if (match) {
            var number = match[1];
            return this.isChinaMobileNumber(number);
        } else {
            return false;
        }
    },
    getName: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return "";
            } else {
                return numberText.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
            }
        }
        return "";
    },
    getNumber: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return numberText;
            } else {
                var reg = /<(\d+)>$/;
                var match = numberText.match(reg);
                if (match) {
                    return match[1];
                } else {
                    return "";
                }
            }
        }
        return "";
    },
    compareNumber: function(m1, m2) {
        if ( typeof(m1) === "undefined" || typeof(m2) === "undefined" ) {
            return false
        }

        m1 = m1.toString();
        m2 = m2.toString();
        m1 = this.remove86(this.getNumber(m1));
        m2 = this.remove86(this.getNumber(m2));
        if (m1 && m1 == m2) return true;
        return false;
    },
    parse: function(inputText) {
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
            if (this.isChinaMobileNumberText(text)) {
                resultList.push(text);
            } else {
                result.error = "该号码不是正确的移动手机号码：“" + text + "”";
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    getSendText: function (name, number) {
        if (!Utils.isString(name) || !Utils.isString(number)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g,"") + ">";
    }
}


var __DateTool = {
    //获得月份的天数，不传参数默认返回本月天数
    daysOfMonth: function(d) {
        if (!d) d = new Date();
        var isLeapYear = this.isLeapYear(d.getFullYear());
        return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][d.getMonth()];
    },
    //年份是否闰年
    isLeapYear: function(y) {
        if (!y) y = new Date();
        if (y.getFullYear) y = y.getFullYear();
        return (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0));
    },
    //获得星期几
    WEEKDAYS: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    getWeekDayText: function(d) {
        if (!d) d = new Date();
        return this.WEEKDAYS[d.getDay()];
    }
};
if(!window.DateTool){
    //防止命名冲突
    DateTool = __DateTool;
}


/**
 * 新的选择组带新建组的控件。
 * <pre>示例：<br>
 * var chkGroup = new GroupCheckbox($('#group')[0], document);
 * chkGroup.check(['556465','98989','65656']);
 * var groupid = chkGroup.check();
 * </pre>
 * @param {Object} parent 父容器
 * @param {string} context 上下文document
 * @return {Object}
 */
function GroupCheckbox(parent, context){
    if (!parent) return;
    context = context || document;
    parent.style.visibility="hidden";
    parent.innerHTML = '<ul class="group"></ul><a href="javascript:;"><i class="plus"></i>新建分组</a>';
    var container = parent.firstChild;

    var lbl = context.createElement("LABEL");
    var ele = context.createElement("INPUT");
    ele.type = "checkbox";
    lbl.appendChild(ele);
    lbl.appendChild(context.createTextNode(" "));
    ele = context.createElement("LI");
    ele.appendChild(lbl);
    lbl = null;

    var row2 = context.createElement("LI");
    row2.innerHTML = "<span>默认保存到 &quot;未分组&quot;</span>";
    container.appendChild(row2);

    var groups = top.Contacts.data.groups;
    for (var i = groups.length - 1, k=groups[i]; i >= 0; k=groups[--i]){
        var gid = "Chk_" + k.GroupId;
        row2 = ele.cloneNode(true); //li
        lbl = row2.firstChild; //label
        lbl['for'] = gid;
        lbl.replaceChild(context.createTextNode(k.GroupName), lbl.lastChild);

        lbl = lbl.firstChild; //input
        lbl.id = gid;
        lbl.value = k.GroupId;

        container.appendChild(row2);
    }
    ele = null; row2 = null; lbl = null;
    parent.style.visibility = "visible";

    //加下方的新建组
    var btnAdd = parent.lastChild;
    btnAdd.onclick = function(){
        var Contacts = top.Contacts;
        var frameworkMessage = top.frameworkMessage;
        var FF = top.FF;
        var txtGName = context.createElement('INPUT');
        var btnOk = context.createElement('A');
        var btnCanel = context.createElement('A');
        var tip = frameworkMessage.addGroupTitle;
    
        btnAdd.style.display = "none"; 
        txtGName.value = tip;
        txtGName.maxLength=16;
        txtGName.className = "text gp def";
        
        btnOk.href = "javascript:void(0)";
        btnCanel.href = "javascript:void(0)";
        btnCanel.style.marginLeft = ".5em";
        btnOk.innerHTML = "添加";
        btnCanel.innerHTML = "取消";
    
        txtGName.onfocus = function(){
            if(this.value==tip){
                this.value = "";
                this.className = "text gp";
            } else {
                this.select();
            }
        };
        txtGName.onblur = function(){
            if (this.value.length==0){
               this.value = tip;
               this.className = "text def gp";
            }
        };
    
        btnOk.onclick = function(){
            var gpName = txtGName.value;
            if (gpName.length>0 && gpName != tip) {
                var _this = this;
                Contacts.addGroup(gpName,function(result){
                    if(result.success){
                        var p = _this.parentNode;
                        var lst = p.getElementsByTagName('UL')[0];
                        var li = context.createElement('LI');
                        li.innerHTML = "<label for='Chk_" + result.groupId + "'><input id='Chk_" + result.groupId + "' value='" + result.groupId + "' type='checkbox' checked='checked' />" + htmlEncode(gpName) + "</label>";
                        lst.appendChild(li);
                        lst.scrollTop=lst.scrollHeight;
                        btnCanel.onclick();
                    }else{
                        FF.alert(result.msg);
                    }
                });
            }
        };
        
        btnCanel.onclick = function(){
            parent.removeChild(txtGName);
            parent.removeChild(btnOk);
            parent.removeChild(btnCanel);
            btnAdd.style.display = "inline";
        };
    
        parent.appendChild(txtGName);
        parent.appendChild(btnOk);
        parent.appendChild(btnCanel);
    }

    this.container = container;
    this.check = function(checkedGroup){
        var chks = this.container.getElementsByTagName("INPUT");
        if (checkedGroup) {
            each(chks, function(i){
                i.checked = contain(i.value)
            });
        } else {
            var buff = [];
            each(chks, function(i){
                i.checked && buff.push(i.value);
            })
            return buff;
        }
        function each(arr, callback){
            for (var j=0, m=arr.length; j<m; j++){
                callback(arr[j]);
            }
        }
        function contain(v){
            for (var j=0, m=chks.length; j<m; j++){
                if (chks[j]==v) return true;
            }
            return false;
        }
    }

    function htmlEncode(str){
        return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;")
        .replace(/ /g, "&nbsp;");       
    }
}