/**
 * @fileOverview 向下兼容，老版本的一些配置变量的读写
 *包括UserData、FF、Utils
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var win;
    var vm = M139.namespace("M2012.MatrixVM", Backbone.Model.extend(
     /**
        *@lends M2012.MatrixVM.prototype
        */
    {
        /** 封装向下兼容对象实例，比如：UserData、FF、Utils等对象，使一些老的代码可以正常工作
        *@constructs M2012.MatrixVM
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            options = options || {};
            win = options.window || window;
        },
        start: function () {//运行入口
            this.createRequestByScript();
            this.createFloatingFrame();
            this.createPathConfig();
            this.createUtils();
            this.createLoadScript();
            this.createUserData();
            this.createGlobalVariable();
            this.createLinksShow();
            this.createModuleManager();
            this.createMailTool();
            this.createWaitPanel();
            this.createValidate();
            
        },

        /**创建老版本的FloatingFrame对象*/
        createFloatingFrame: function () {
            win.FF = window.FloatingFrame = FF;
            return FF;
        },
        /*创建resourcePath,siteConfig中的路径配置*/
        createPathConfig:function(){
            win.rmResourcePath = (top.getDomain("resource") || "") + "/rm/richmail";
            win.resourcePath = win.rmResourcePath.replace("richmail", "coremail");

            win.SiteConfig.ucDomain = getDomain("webmail");
            win.ucDomain = getDomain("webmail");
            win.SiteConfig.smsMiddleware = getDomain("rebuildDomain") + "/sms/";
            win.SiteConfig.mmsMiddleware = getDomain("rebuildDomain") + "/mms/";
            win.SiteConfig.largeAttachRebuildUrl = getDomain("rebuildDomain") + "/disk/";
            win.SiteConfig.disk = getDomain("rebuildDomain") + "/disk/netdisk";
            
            
        },
        createUtils:function(){
            //loadScript("m2011.utilscontrols.pack.js");
            
            win.Utils = {
                PageisTimeOut: function () {
                    return false;
                },
                waitForReady: function (query, callback) {
                    return M139.Timing.waitForReady(query, callback);
                },
                loadSkinCss: function (path, doc, prefix, dir) {
                    var version = "", skinFolder= "css", alt = "/";

                    //获取2.0皮肤映射的1.0值,给内嵌的老页面用
                    path = (top.$User.getSkinNameMatrix && top.$User.getSkinNameMatrix()) || 'skin_shibo';

                    if (/new_/.test(path)) {
                        skinFolder = "theme" + alt + path.match(/skin_(\w+)$/)[1];
                        path = path.replace("new_", "");
                    }

                    if (prefix) {
                        path = path.replace("skin", prefix + "_skin");
                    }

                    if (!doc) {
                        doc = document;
                    }

                    //加清皮肤样式缓存的版本号
                    if (top.SiteConfig && top.SiteConfig.skinCSSCacheVersion) {
                        version = "?v=" + top.SiteConfig.skinCSSCacheVersion;
                    }

                    var linkHref = top.rmResourcePath + alt + skinFolder + alt + path + ".css" + version;
                    if (dir) {
                        linkHref = dir + path + ".css" + version;
                    }

                    var links = doc.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        var l = links[i];

                        if (!l.href) {
                            l.href = linkHref + version;
                            return;
                        }
                    }
                },
                queryString: function (param, url) {
                    return $Url.queryString(param, url);
                },
                queryStringNon: function(param, url) {
                    for(var url = url || location.search, url = url.split(/&|\?/), e = null, c = 0; c < url.length; c++) {
                    var g = url[c].split("=");
                    if(g[0] == param) {
                    e = g[1];
                    break;
                     }
                     }
                     return e;
                },
                openControlDownload : function(removeUploadproxy) {
                    //var win = window.open(getDomain("webmail") + "/LargeAttachments/html/control139.htm");
                    //setTimeout(function() { win.focus(); }, 0);
                    top.$App.show("smallTool");
					//top.addBehavior("文件快递-客户端下载");
                },

                UI: {
                    selectSender: function (id, isAddPop, doc) {
                        var from = $Url.queryString("from");
                        if (typeof (doc) == "undefined")
                            doc = document;

                        if (typeof (isAddPop) == "undefined")
                            isAddPop = false;

                        var selFrom = doc.getElementById(id);
                        UserData = window.top.UserData;
                        var mailAccount = top.$User.getDefaultSender();

                        var trueName = top.$User.getTrueName();
                        var arr = top.$User.getAccountListArray();
                        if(mailAccount)addItem(mailAccount);
                        for (var i = 0; i < arr.length; i++) {
                            var mail = arr[i];
                            if (mailAccount != mail) addItem(mail);
                        }

                        //添加代收账号地址  
                        if (isAddPop) {
                            $(top.$App.getPopList()).each(function () {
                                for (var i = 0; i < selFrom.options.length; i++) {
                                    if (this == selFrom[i].value) return;
                                }
                                addItem(this.email);
                            })
                        }
                        selFrom.options.add(new Option("发信设置", "0"));

                        //发件人地址下拉框切换事件
                        var selFromOnChange = function (id) {
                            var selFrom = doc.getElementById(id);
                            if (selFrom.value == "0") {
                                selFrom[0].selected = true;
                                top.$App.show("account");
                                top.addBehavior("写信页_别名设置");
                            }
                            selFrom = null;
                        }

                        selFrom.onchange = function () { selFromOnChange(id) };

                        function addItem(addr) {
                            addr = addr.trim();
                            var text = trueName ? '"{0}"<{1}>'.format(trueName.replace(/"|\\/g, ""), addr) : addr; //发件人姓名替换双引号和末尾的斜杠
                            var item = new Option(text, addr);
                            selFrom.options.add(item);
                            item.innerHTML = item.innerHTML.replace(/\&amp\;#/ig, "&#");
                            if (item.value == from) item.selected = true;
                        }

                    }
                },
                parseSingleEmail: function (text) {
                    text = text.trim();
                    var result = {};
                    var reg = /^([\s\S]*?)<([^>]+)>$/;
                    if (text.indexOf("<") == -1) {
                        result.addr = text;
                        result.name = text.split("@")[0];
                        result.all = text;
                    } else {
                        var match = text.match(reg);
                        if (match) {
                            result.name = match[1].trim().replace(/^"|"$/g, "");
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
                    if (result.addr) {
                        result.addr = result.addr.encode();
                    }
                    return result;

                },
                parseEmail : function (text){
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
				}
            };
            win.getXmlDoc = function (xml) {
                return M139.Text.Xml.parseXML(xml);
            }
            //解析xml报文 通讯录用到
            win.xml2json = function(xmlNode,xml2jsonConfig){
                if(typeof xmlNode =="string"){
                    try{
                        var xmldom=getXmlDoc(xmlNode);
                        xmlNode=xmldom.documentElement;
                    } catch (ex) {
                    }
                }
                var config=xml2jsonConfig[xmlNode.tagName];
                if(!config){
                    return document.all?xmlNode.text:xmlNode.textContent;
                }else if(config.type=="simple"){
                    return xml2json_SimpleObject(xmlNode);
                }else if(config.type=="rich"){
                    return xml2json_RichObject(xmlNode,config);
                }else if(config.type=="array"){
                    return xml2json_Array(xmlNode);
                }else{
                    return null;
                }
                function xml2json_RichObject(xmlNode,config){
                    var result={};
                    var arrayElement=config.arrayElement;
                    if(arrayElement){
                        var arrayList=result[arrayElement]=[];
                    }
                    for(var i=0,childs=xmlNode.childNodes,len=childs.length;i<len;i++){
                        var child=childs[i];
                        if(child.nodeType==1){
                            if(child.tagName==config.arrayElement){
                                arrayList.push(xml2json(child,xml2jsonConfig));
                            }else{
                                result[child.tagName]=xml2json(child,xml2jsonConfig);
                            }
                        }
                    }
                    return result;
                }
                function xml2json_SimpleObject(xmlNode){
                    var result={};
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result[child.tagName]=document.all?child.text:child.textContent;
                        }
                    }
                    return result;
                }
                function xml2json_Array(xmlNode){
                    var result=[];
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result.push(xml2json(child,xml2jsonConfig));
                        }
                    }
                    return result;
                }
            }
            win.json2xml = function(obj) {
                var list = [];
                for (var p in obj) {
                    list.push("<");
                    list.push(p);
                    list.push(">");
                    list.push(encodeXML(obj[p]));
                    list.push("</");
                    list.push(p);
                    list.push(">");
                }
                return list.join("");
            }
            if (!String.format) {
                String.format = function (template,param) {
                    return M139.Text.Utils.format(template, param);
                }
            }
        },
        createLoadScript:function(){
            win.loadScriptM2011=function(key, _doc, charset, root) {
                var path = null;
                var scriptList = [
                    { "name": "jquery.js", "version": "20120302" },
                    { "name": "utils_controls.js", "version": "20121229" },
                    { "name": "framework.js", "version": "20121221" },
                    { "name": "common_option.js", "version": "20121123" },
                    { "name": "utils.js", "version": "20120302" },
                    { "name": "compose_2010_pack.js", "version": "20121227" },
                    { "name": "folderview.js", "version": "20121122" },
                    { "name": "welcome.js", "version": "20130104" }
                ];
                for (var i = 0; i < scriptList.length; i++) {
                    if (scriptList[i]["name"] == key) {
                        path = top.rmResourcePath + "/js/" + key + "?v=" + scriptList[i]["version"];
                        break;
                    }
                }
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                if (path == null) {
                    var _root = root || "/rm/richmail/js/";
                    path = getResourceHost() + _root + key;
                }

                if (path.indexOf("utils_controls.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", _doc, charset);
                } else if (path.indexOf("AddressBook.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.AddressBook.js", _doc);
                } else if (path.indexOf("RichInputBox.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.RichInputBox.js", _doc);
                }

                (_doc || document).write("<script charset=\"" + (charset || "gb2312") + "\" type=\"text/javascript\" src=\"" + path + "\"></" + "script>");
            }
            win.loadScripts = function (arr, _doc) {
                
                    for (var i = 0; i < arr.length; i++) {
                        win.loadScriptM2011(arr[i], _doc);
                    }
                
            }
            win.loadRes = function (w) {
                if (!w || !w.RES_FILES) return;
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                var resList = w.RES_FILES;
                for (var i = 0; i < resList.length; i++) {
                    if (resList[i].js) {
                        var path = resList[i].js;
                        if (path.indexOf("utils_controls.js") > -1) {
                            top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", w.document);
                        } else if (path.indexOf("jquery.js") > -1) { //群邮件继续使用旧版jquery，避免兼容问题
                            top.loadScript(rmResourcePath + "/js/jquery.js", w.document);
                        } else { //偷梁换柱，群邮件js文件映射到新版目录
                            path = path.replace("/groupmail/js/", "/groupmail/m2011.groupmail.");
                            top.loadScript(path.replace("/$base$", m2012ResourceDomain + "/m2012/js/service"), w.document, resList[i].charset || "gb2312");
                            //top.loadScript(path.replace("/$base$", getResourceHost() + "/rm"), w.document, resList[i].charset || "gb2312");
                        }
                    } else if (resList[i].css) {
                        var path = resList[i].css;
                        top.loadCSS(path.replace("/$base$", getResourceHost() + "/rm"),w.document);
                    }
                }
                if(w.location.href && w.location.href.indexOf('ComposeGroupmail') > -1){
                	// add by tkh 群邮件引入大附件model层m2012.ui.largeattach.model.js
	                try{
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/underscore.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/backbone.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/packs/m139.core.pack.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/ui/largeattach/m2012.ui.largeattach.model.js', w.document, "uft-8");
	                } catch (e) { }
                }
                w.RES_FILES = null;//清理
            }
        },
        createGlobalVariable: function () {
            var _this = this;
            win.coremailDomain = $App.getMailDomain();
            win.addrDomain = "/addrsvr";
            win.mailDomain = $App.getMailDomain();
            win.isRichmail = true;
            win.stylePath = "/m";
            win.wmsvrPath = "/s";
            win.wmsvrPath2 = "http://" + location.host + "/RmWeb";

            win.Main = {
                closeCurrentModule: function () {
                    $App.closeTab();
                }
            }
            win.Main.setReplyMMSData = function ($){
                if($){
                    top["replyMMSData"]={content:"string"==typeof $.content&&$.content||"",receivers:_.isArray($.receivers)&&$.receivers||[],subject:"string"==typeof $.subject&&$.subject||""};
                }
            }

            /*win.Utils={
                UI:{
                    selectSender: function () {
                        return "发件人";
                    }
                }
            }
            */
            win.behaviorClick = function (target, window) {
                top.M139.Logger.behaviorClick(target, window);
            }
            win.addBehavior = function (behaviorKey, thingId) {
                top.M139.Logger.logBehavior({
                    key: behaviorKey,
                    thingId: thingId
                });
            }
            win.addBehaviorExt = function (param) {
                if (param && param.actionId) {
                    top.M139.Logger.logBehavior({
                        thingId: param.thingId || 0,
                        actionId: param.actionId,
                        moduleId: param.moduleId || 0,
                        actionType: param.actionType,
                        pageId: 24
                    });
                }
            }
            win.ScriptErrorLog = function () {

            }
            win.MailTool = {
                getAccount: function (email) {
                    return $Email.getAccount(email);
                },
                getAddr: function (email) {
                    return $Email.getEmail(email);
                }
            }
            win.encodeXML = function (text) {
                return $Xml.encode(text);
            }
            win.FilePreview = {
                isRelease: function () { return true; },
                checkFile: function (fileName, fileSize) {
                    if (fileSize && fileSize > 1024 * 1024 * 20) {
                        return -1;
                    }
                    //var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|)$/i;
                    var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|)$/i; //临时屏蔽html文件的预览功能
                    var reg2 = /\.(?:rar|zip|7z)$/i;
                    if (reg.test(fileName)) {
                        return 1;
                    } else if (reg2.test(fileName)) {
                        return 2;
                    } else {
                        return -1;
                    }
                },
                getUrl: function (p) {
                    var previewUrl = "/m2012/html/onlinepreview/online_preview.html?fi={fileName}&mo={uid}&dl={downloadUrl}&sid={sid}&id={contextId}&rnd={rnd}&src={type}";
                    previewUrl += "&skin={skin}";
                    previewUrl += "&resourcePath={resourcePath}";
                    previewUrl += "&diskservice={diskService}";
                    previewUrl += "&filesize={fileSize}";
                    previewUrl += "&disk={disk}";
                    previewUrl = $T.Utils.format(previewUrl, {
                        uid: top.M139.Text.Mobile.remove86(top.uid),
                        sid: top.UserData.ssoSid,
                        rnd: Math.random(),
                        skin: window.top.UserConfig.skinPath,
                        resourcePath: encodeURIComponent(top.rmResourcePath),
                        diskService: encodeURIComponent(top.SiteConfig.diskInterface),
                        type: p.type || "",
                        fileName: encodeURIComponent(p.fileName),
                        downloadUrl: encodeURIComponent(p.downloadUrl),
                        contextId: p.contextId || "",
                        fileSize: p.fileSize || "",
                        disk: top.SiteConfig.disk
                    });
                    return previewUrl;

                }
            }; 
            win.GetDiskArgs=function() {
                return top.diskSelectorArgs;
            }
            win.OpenDisk=function(args) {
                //{sid:””, businessWindow:window, callback :function(){}, restype :1, selectMode :0, width :500,height:500}
                if (!args) { args = {}; }
                top.diskSelectorArgs = args;

                var url = SiteConfig["disk"] + "/html/selectdisk.html?sid=" + $App.getSid() + "&restype=" + (args.restype ? args.restype : 1);

                top.FF.open("彩云", url, 484, 405, true);


            }
            var self = this;
            win.GlobalEvent = {
                add: function (key, func) {
                    self.on(key, func);
                },
                broadcast: function (key, args) {
                    self.trigger(key, args);
                }
            }
            win.ReadMailInfo = {
                getDownloadAttachUrl: function (file) {
                    var temp = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
                    return top.wmsvrPath2 + temp.format(file.mid, file.fileOffSet, file.fileSize, encodeURIComponent(file.fileName), file.sid, file.type,file.encoding);
                }
            }

            if (_this.createContacts) _this.createContacts();
            
            win.reloadAddr = function() {
                $App.trigger("change:contact_maindata");
            };

            win.namedVarToXML = function (name, obj, prefix) {

                function getDataType (obj) {
                    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
                };
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

                if (obj == null) {
                    return prefix + tagXML("null", name);
                }
                //var type = obj.constructor;
                var type = getDataType(obj);
                if (type == "String") {
                    var xml = textXML(obj);
                    try {
                        xml = M139.Text.Xml.encode(xml);
                    } catch (e) { }
                    return prefix + tagXML("string", name, xml);
                } else {
                    if (type == "Object") {
                        if (obj.nodeType) {
                            top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
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
                                    top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                                    return "";
                                }
                            }
                        }
                    }
                }

            }
            win.UtilsMessage = {
                AddcontactEmptyError: "分组名称不能为空。",
                AddcontactSpecialError: "组名中不能包含特殊字符。",
                AddcontactSuccess: "添加成功!",
                AddsendcontactsAddError: "添加失败",
                AddsendcontactsAddSuccess: "添加成功!",
                AddsendcontactsNotice: "正在添加联系人...",
                AddsendcontactsOneError: "请至少选中一行!",
                AddsendcontactsTeamError: "请输入组名",
                ChecksecretfolderpwdError: "密码错误",
                Folder_smsError: "短信验证码输入错误，请重新输入!",
                Folder_smsNoError: "您还未获取短信验证码，请点击上方的按钮获取。",
                Folder_smsNotice: "正在获取短信验证码",
                FoldermanageError: "排序操作失败！",
                ForwardEmptyError: "邮箱地址不能为空",
                ForwardOneError: "很抱歉，只能转发到一个邮箱地址。",
                ForwardRightError: "请输入正确的邮箱地址（例：example@139.com）",
                ForwardSelfError: "转发用户不能填写自己的邮箱地址",
                PopfolderFullError: "邮箱容量将满,请及时清理",
                PopfolderFulledError: "邮箱容量已满, 请清理过期邮件",
                UtilsDebugError: "调试器错误",
                UtilsInvalidError: "Passing invalid object: {0}",
                UtilsNoloadError: "数据未加载成功，可能的原因是登录超时了。",
                UtilsRequestError: "请求出错:",
                UtilsScreenError: "截屏功能仅能在IE浏览器下使用",
                UtilsScreenInstallConfirm: "使用截屏功能必须安装139邮箱控件,是否安装?",
                UtilsTimeoutError: " <b>登录超时，可能由于以下原因：</b><br/>1、您同时使用多个帐号或多次登录邮箱<br/>2、您的网络链接长时间断开<br/>3、当前页面闲置太久",
                UtilsUpdateConfirm: "您安装的上传控件已经不能使用,是否更新?",
                UtilsUpgradeConfirm: "当前的截屏控件需要升级才可继续使用",
                UtilsUploadConfirm: "上传文件必须安装139邮箱控件,是否安装?",
                vipNoPermissionNotice: "VIP{0}{2}为{0}元版{1}邮箱专属{2}。<br/>立即升级，重新登录后即可使用。"
            };

            win.frameworkMessage = {
                AddsendcontactsTeamError: "请输入新分组名称",
                EditorFaceError: "纯文本模式无法使用表情!",
                EditorImgError: "纯文本模式无法插入图片!",
                EditorWordsError: "请先选择要加入链接的文字。",
                FetionAliasError: "对不起，设置邮箱别名后才能绑定飞信，请先设置邮箱别名",
                FetionAlreadyError: "您已绑定飞信",
                FetionBindConfirm: "系统将自动绑定飞信服务，是否继续?",
                FetionBindFeiError: "绑定失败，请重试",
                FetionLoading: "正在加载中......",
                FetionLoading2Confirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.\r\n{0},继续登录飞信吗?",
                FetionLoadingConfirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.继续登录飞信吗?",
                FetionLoginError: "您已经取消绑定飞信，请绑定飞信后登录",
                FetionNoOpenConfirm: "您的飞信服务还没有开通，现在是否注册？",
                FetionProofError: "获取凭证失败，请稍后再试",
                FetionTryLoading: "资源正在加载中，请稍后再试",
                FolderAddedError: "添加文件夹失败，请重试",
                FolderAlreadyError: "文件夹&nbsp;<b>{0}</b>&nbsp;已存在！",
                FolderCheckError: "已向服务器提交代收命令，请稍后检查您的代收文件夹。",
                FolderClearConfirm: "您确定要清空吗?",
                FolderCustomizeError: "自定义文件夹个数不能超过{0}个",
                FolderDelConfirm: "确定要删除该文件夹吗",
                FolderNameEmptyError: "文件夹名称不能为空",
                FolderNameOverError: "文件夹名字不能超过16个字母或者8个汉字！",
                FolderPopError: "POP代理正在执行中，请等待执行完毕",
                FolderSpecialError: "文件夹中不能包含特殊字符！",
                FolderWaiError: "正在为您代收邮件，请稍候......",
                GroupExists: "组名重复是否仍要添加？",
                LinksUnFunctionError: "该功能暂时无法使用",
                MailServerExistError: "对不起，文件夹名称已存在",
                MailServerLoginError: "对不起，登录超时，请重新登录。",
                MailboxAlreadyError: "您所选择的邮件已在当前文件夹中，请重新选择",
                MailboxBatchError: "您刚才有新邮件到达，请重新确认后再进行本项操作",
                MailboxDelConfirm: "系统提示：彻底删除此邮件后将无法取回，您确定要彻底删除吗？",
                MailboxDelsConfirm: "如果彻底删除，这{0}封邮件将无法找回，您确定吗？",
                MailboxExportMail: "仅支持导出200M以内的邮件",
                MailboxKeyError: "请输入关键字",
                MailboxMoveConfirm: "要转移的邮件包含已置顶邮件，转移后将不再置顶。您确定要转移吗？",
                MailboxSelError: "请选择邮件",
                MailboxSpamConfirm: "所选邮件将被移动到垃圾邮件夹。通过举报垃圾邮件，可以协助我们更有效的抵制垃圾邮件，感谢您！",
                MailboxTopError: "最多只能置顶10封邮件",
                MainConfigError: "配置文件未加载",
                MainSearchText: "邮件全文搜索...",
                MainWapSuccess: "139邮箱WAP访问地址已经发送到您的手机，请查收",
                Main_extDownConfirm: "尊敬的139用户，您好，请下载pushemail",
                ReadmailAttachSuccess: "附件：{0}保存成功，请到手机彩云我的文件柜查看。",
                ReadmailContentError: "请输入要回复的内容",
                ReadmailDelSuccess: "邮件已经删除!",
                ReadmailDiskError: "对不起，您尚未开通彩云服务。",
                ReadmailFilterError: "添加失败，您添加的过滤器数量已达到最大上限",
                ReadmailLoadError: "加载失败,请重试",
                ReadmailMailError: "请输入要回复的邮件地址",
                ReadmailReceiptConfirm: "对方要求发送已读回执,是否发送?<br />             <label for='chkShowReturnReceipt'>            <input id='chkShowReturnReceipt' onclick='window.chkShowReturnReceiptValue=this.checked' type='checkbox' />            以后都按本次操作            </label>",
                ReadmailReduktionSuccess: "操作成功，邮件已被还原到收件箱中。",
                ReadmailRejectionSuccess: "设置主题拒收成功",
                ReadmailReplySuccess: "回复成功",
                ReadmailRightMailError: "请输入正确的邮件地址:",
                ReadmailSelReceiveError: "请至少选择一个收件人",
                ReadmailTryAgainError: "服务器忙，请稍后重试",
                ReadmailWithdraw1Error: "撤回失败,邮件不存在",
                ReadmailWithdraw2Error: "撤回失败,此邮件不支持召回",
                ReadmailWithdraw3Error: "撤回失败,该邮件已超过撤回期限",
                SimpleframeSendConfirm: "确定不发送此明信片吗？",
                SysBusyTryAgainError: "系统繁忙，请稍后重试!",
                TablabelError: "Tab Init Error",
                TablabelExistError: "fTabLabelExist",
                TablabelNoTabError: "Tab 不存在",
                addContacting: "保存联系人中……",
                addFolderPageLoadError: "邮件地址格式有误，请重新填写！",
                addGroupTitle: "请输入新分组名称",
                addNotAllowed: "不支持添加自己为VIP联系人。",
                changeTagColorParamsError: "参数错误，改变标签颜色失败！",
                checkPswEnterPwdFormValid: "请输入密码！",
                checkPswNotOnlyNumFormValid: "密码不能是纯数字组合！",
                checkPswNotSeriesFormValid: "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA！",
                checkPswNotSpecialCharFormValid: "密码中包含不合法字符，可支持字母、数字、及_~@#$^符号！",
                checkPswPwdLengthFormValid: "密码须由6位至16位字符或数字组成！",
                checkSelectSongsError: "请选择歌曲再播放！",
                delConfirmMsg: "确定取消“VIP联系人”？<br>其邮件将同时取消“VIP邮件”标记。",
                delContactEventConfirm: "确定要删除该联系人？",
                editGroupListSuc: "{0}已加为VIP联系人，其邮件已自动标记为“VIP邮件”。",
                error_contactOverlimit: '保存联系人失败，联系人数量已达上限。你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactReachlimit: '保存联系人部分成功，联系人数量超出上限部分未保存，你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactRepeat: "保存联系人失败，联系人已存在。",
                exportMailLongTime: "文件夹邮件较多，导出邮件可能需要较长的时间。",
                folderManageDelFolderlConfig: "确定要删除该文件夹吗？",
                folderManagePageClearFolderConfirm: "您确定要清空吗？",
                folderManageReNameTitle1: "重命名",
                folderManageReNameTitle2: "请输入文件夹名称",
                folderviewClearFolderFilled: "邮箱容量已满, 请清理过期邮件！",
                folderviewClearFolderFull: "邮箱容量将满,请及时清理！",
                folderviewDeleteFolderConfirm: "确定要删除该文件夹吗？",
                folderviewdelegateConfirm: "删除代收邮箱将同时删除此文件夹内所有的邮件，是否继续删除？",
                groupLimit: "分组联系人总数已达上限，不能添加。",
                markTagIsRepateError: '"{0}" 已经标记过  "{1}" 标签了',
                markTagNoSelectMailError: "请选择邮件",
                modContactError: "修改联系人失败，请稍后再试。",
                modContactSuccess: "修改联系人成功",
                modifySecretFolderPwdPageComparePwdFormValid: "两次密码输入不一致，请重新输入！",
                modifySecretFolderPwdPageEnterNewPwdFormValid: "请输入新密码！",
                modifySecretFolderPwdPageEnterOldPwdFormValid: "请输入旧密码！",
                modifySecretFolderPwdPageModifyError: "修改失败，请稍后再试",
                modifySecretFolderPwdPageOldPwdError: "旧密码错误！",
                modifySecretFolderPwdPageSetLockPwdSuccess: "安全锁密码修改成功！",
                opClear: "您已清空VIP联系人，其邮件同时取消“VIP邮件”标记。",
                opSuc: "操作成功。",
                operatingTagError: "操作失败，请稍后再试。",
                searchKeyWordIsEmptyError: "请输入要搜索的内容",
                searchPageFormatDateError: "日期格式有误！",
                secretFolderFolderNotFould: "找不到指定的文件夹",
                secretFolderPwdInvalid: "密码不正确或者密码不符合规则",
                secretFolderSetPageLockAreaFormValid: "请选择加锁范围！",
                secretFolderSetPageMaxFolderError: "设置安全锁的文件夹个数超出最大限制，最大只可以设置{0}个！",
                secretFolderSetPagePwdError: "密码错误！",
                secretFolderSetPagePwdFormValid: "两次密码输入不一致，请重新输入！",
                secretFolderSetPageSetError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockSuccess: "安全锁设置成功！",
                showColorPickerParamsError: "参数错误，打开颜色盘失败！",
                sysBusy: "系统繁忙，操作失败。",
                sysError: "系统繁忙，请稍后再试!",
                tagManageDelFolderlConfig: "确定删除标签“{0}”吗？ 删除后相关邮件也将会移除此标签（邮件不会被删除）",
                tagManageReNameTitle1: "重命名",
                tagManageReNameTitle2: "请输入标签名称",
                tagMenuSelectError: "选择标签菜单或选择邮件出错，请稍后再试。",
                tagNameEmptyError: "标签名称不能为空！",
                tagNameOverError: "标签名字不能超过25个字母或汉字！",
                tagNameRepateError: "{0} 已经存在！",
                tagNameSpecialError: "标签名称中不能包含特殊字符！",
                tagOverflow: "很抱歉，每封邮件最多只能贴{0}张标签。",
                tearTagParamsError: "参数错误，撕掉标签操作失败！",
                userFolderPageBindDataClearEventConfirm: "您确定要清空吗？",
                vipContactsMax: "VIP联系人已达上限{0}个，不能添加。{1}",
                addVipSuc: "“{0}”已加为“VIP联系人”，其邮件已自动标记为“VIP邮件”。",
                cancelVipText: "确定取消“VIP联系人”？<br/>其邮件将同时取消“VIP邮件”标记。",
                waitPannelAddFolder: "正在添加文件夹...",
                waitPannelAddTagName: "正在添加标签...",
                waitPannelClearFolder: "正在清空文件夹...",
                waitPannelDelete: "正在删除...",
                waitPannelLoad: "数据加载中...",
                waitPannelModifyPwd: "正在修改安全锁密码...",
                waitPannelReName: "正在重命名文件夹...",
                waitPannelReTagName: "正在重命名标签...",
                waitPannelSetLockSuccess: "正在设置安全锁...",
                warn_contactEmailToolong: "电子邮箱地址太长了",
                warn_contactIllegalEmail: "电子邮箱地址格式不正确，请重新输入!",
                warn_contactMobileError: "手机号码格式不正确，请重新输入",
                warn_contactMobileToolong: "手机号码太长了",
                warn_contactNameToolong: "联系人姓名太长了",
                warn_contactNamenotfound: "请输入联系人姓名",
                zw: ""
            };
        },
        /**创建老版本的UserData对象*/
        createUserData: function () {
            win.UserData = {};

            try {
                userdata = $.extend({}, top.$App.getConfig("UserData"));
                $App.on("userAttrsLoad", function (args) {
                    win.trueName = $User.getTrueName();
                    if (win.UserData) { //可能userData尚未加载
                        win.UserData.userName = $User.getTrueName();
                    }

                    win.UserAttrs = $App.getConfig("UserAttrs");
                })
                $App.on("userDataLoad", function (args) {

                    win.UserData = $.extend({}, args);

                    win.uid = args.UID;
                    win.sid = $App.getSid();
                    win.UserData.ssoSid = win.sid;
                    win.UserData.ServerDateTime = new Date();//暂无服务器时间
                       
                    win.UserData.userNumber = win.uid;
                    if (win.trueName) {
                        win.UserData.userName = win.trueName;
                    }

                    var tempArr = [];
                    var list = win.UserData.uidList
                    for (var elem in list) {
                        if (list[elem].name) {
                            tempArr.push(list[elem].name.replace(/@.+/, ""));
                        }
                    }
                    win.UserData.uidList = tempArr;//替换回旧的uidList;

                    win.UserConfig = { "skinPath": "skin_shibo" };
                    
                    try {
                        //修复ps套餐特权的问题
                        var vip = top.$User.getServiceItem();
                        if (vip == "0016") {
                            args.vipInfo.MAIL_2000008 = "1";
                        } else if (vip == "0017") {
                            args.vipInfo.MAIL_2000008 = "2";
                        } else {
                            args.vipInfo.MAIL_2000008 = "0";
                        }
                        args.vipInfo.serviceitem = top.$User.getServiceItem();
                    } catch (e) { }


                });
                return userdata;
            } catch(e) {
            }

            if (top.UserData) {
                userdata = top.UserData;
            }

            win.UserData = userdata;//对UserData的写操作无法同步
            return win.UserData;
        },

        /**创建老版本的UserData对象*/
        createRequestByScript: function () {
            var _utils = {
                requestByScript: function(option, callback) {
                    try {
                        top.M139.core.utilCreateScriptTag.apply(top.M139.core, arguments);
                        return;
                    } catch (e) {
                    }
                    
                    var _src = top.getResourceHost() + "/m2012/js/packs/" + option.src;
                    top.Utils.requestByScript(option.id, _src, callback, option.charset)
                }
            };

            return _utils;
        },

        /**创建老版本的Links对象，实现Links.show*/
        createLinksShow: function () {
            /*win.Links = {
                show: function (name, params) {

                }
            }*/
            win.LinksConfig = win.LinkConfig; //兼容旧版
            win.Links = {

                old:{ //由于没有重构，要跳到1.0的
                    "migrate":"migrate", //一键搬家
                    "syncsetting":"syncsetting", //手机同步邮箱
                    "videomail":"videomail", //视频邮件
                    "invite":"invite", //邀请好友
                    "invitebymail":"invitebymail" //发邮件邀请好友
                },

                map:{ //创建links.show与$App.show的映射关系
                        "upgradeGuide": "mobile",
                        "partner": "mobile",
                        "uecLab":"uecLab",
                        //"setPrivate": "account",
                        "shequ139": "shequ",
                        "orderinfo": "mobile",
                        "mobileGame": "mobileGame",
                        "mnote": "note",
                        "shareAddr": "addrshare",
                        "shareAddrInput": "addrshareinput",
                        "dingyuezhongxin": "googSubscription", // update by tkh 云邮局的tabid统一改为：googSubscription
                        "urlReplace": "urlReplace",
                        "addrinputhome": "addrinputhome",
                        "addroutput": "addroutput",
                        "addr":"addrhome",
                        "addcalendar": "addcalendar",
			            "mobiSyncMail": "syncguide",
                        "syncGuide": "syncguide",
                        "addrImport": "addrImport",
                        "homemail": "googSubscription",
                        "addredit": "addrEdit",
                        "billmanager": "billManager",
                        "disk": "diskDev",
                        "mailnotify": "notice",
                        "tagsuser": "tags",
                        "accountManage": "account",
                        "antivirus": "spam_antivirusArea",
                        "baseData": "account",
                        "addMyCalendar": "addcalendar",
                        "popagent": "popmail", //06-24
                        "blacklist": "spam",
                        "optionindex": "account",
                        "password":"account_accountSafe",
                        "autoreply":"preference_replySet",
                        "autoforward":"preference_forwardSet",
                        "mailnotifyTips":"preference_onlinetips",
                        "filter":"type",
                        "changenumber":"account_accountSafe",
                        "folderall":"tags",
                        "folderpop":"popmail",
                        "inputAddr":"addrinputhome",
                        "inputAddrI":"addrMcloudImport",
                        "secretfolderpwd":"account_secSafe",
                        "addrWhoAddMe": "addrWhoAddMe",
                        "addrvipgroup":"addrvipgroup",
                        "setPrivacy": "setPrivate",
                        "notice":"notice",
                        "calendar_search": "calendar_search",
			"calendar_square":"calendar_square",
                        "calendar_manage":"calendar_manage"
                    },

                show: function (key, options) {
                    var map = this.map; //map放出来，方便判断
/*
if(SiteConfig.selfSearchRelease){
map["selfSearch"]="selfSearch";
}
*/
                    //urlreplace处理
                    //如：&urlReplace=/inner/reader/index?c=17302
                    if(options && /urlreplace/gi.test(options)) {
                        var getObj = window.LinkConfig[key];
                        var newUrl = ''; 
                        var param = '';
                        var urlReplaceObj = {};
                        if (options.indexOf("http://") == -1 && options.indexOf("https://") == -1) {
                            param = options.split('=')[0] + '=';
                            options = options.replace(param,'');
                            newUrl = getDomain(key) + options;
                        }
                        options = newUrl;
                        urlReplaceObj.group = getObj.group;
                        urlReplaceObj.title = getObj.title;
                        urlReplaceObj.url = options;
                        key = 'urlReplace';                       
                        window.LinkConfig[key] = urlReplaceObj;
                        options = null;
                    }

                    if (map[key]) {
                        $App.show(map[key], options);
                        return; 
                    }

                    if (options && options.indexOf('&') > -1) {
                        options = '?from=jumpto' + options;
                        var obj = $Url.getQueryObj(options);
                        //console.log(obj);
                        $App.jumpTo(key, obj);
                    } else {
                        //console.log(key);
                        $App.jumpTo(key);
                    }
                },
                showUrl: function (url, tabTitle) { //暂时跳到旧版读信

                    if (!_.isEmpty(url)) {
                        url = $.trim(url);
                    }

                    if (!_.isEmpty(tabTitle)) {
                        tabTitle = $.trim(tabTitle);
                    }

                    if (!_.isEmpty(url) && !_.isEmpty(tabTitle)) {
                        return $App.showUrl(url, tabTitle);
                    }

                    var jumpToKey = {
                        partid: top.$User.getPartid(),
                        source: 'jumpto',
                        mid: top.$App.getCurrMailMid()
                    };

                    $App.jumpTo('15', jumpToKey);
                }
            }
        },
        createMailTool: function () {
            $App.on("userAttrsLoad", function () {
                win.FM = { folderList: $App.getConfig("FolderList") };
            });
            
            win.MB = {
                show: function (fid) {
                    $App.showMailbox(fid);
                },
                showBillManager: function () {
                    $App.showMailbox(8);
                },                
                subscribeTab: function (key, isOpenFolder) { // add by tkh 是否打开'我的订阅'文件夹
                    if (key && $.inArray(key, ['myMag', 'myCollect', 'googSubscription'])>=0) {
                        $App.show(key);
                        return;
                    }
                    $App.showMailbox(9, isOpenFolder);
                }
            };
            win.CM = {
                show: function (options) {
                    // update by tkh 通过inputData传递参数到写信页，支持传递大文本。如邮件正文。
                    $App.show("compose",null,{inputData:options});
                },
                sendMail: function (sendMailInfo, categroy) {
                    var letter = {
                        to: sendMailInfo.to ? sendMailInfo.to.join(";") : "",
                        cc: sendMailInfo.cc ? sendMailInfo.cc.join(";") : "",
                        bcc: sendMailInfo.bcc ? sendMailInfo.bcc.join(";") : "",
                        showOneRcpt: (sendMailInfo.singleSend || sendMailInfo.showOneRcpt) ? 1 : 0,
                        isHtml: sendMailInfo.isHtml ? 1 : 0,
                        subject: sendMailInfo.subject,
                        content: sendMailInfo.content,
                        priority: sendMailInfo.priority || 3,
                        requestReadReceipt: sendMailInfo.sendReceipt ? 1 : 0,
                        saveSentCopy: sendMailInfo.saveToSendBox === false ? 0 : 1,
                        inlineResources: 0,
                        scheduleDate: 0,
                        normalizeRfc822: 0
                    };
                    var categroyList = {
                        compose: "103000000",
                        sms: "105000000",
                        contact: "109000000",
                        greetingCard: "102000000",
                        postCard: "101000000"
                    }
                    if (categroy == undefined) {
                        categroy = "compose";
                    }

                    //是否定时邮件
                    if (sendMailInfo.timeset && _.isDate(sendMailInfo.timeset)) {
                        letter.scheduleDate = parseInt(sendMailInfo.timeset.getTime() / 1000);
                    }
                    //设置发信帐号
                    (function getAccount(ac) {
                        //login|alias|number|fetion|default
                        if (!ac) ac = {};
                        if (_.isString(ac)) {
                            letter.account = ac;
                        } else if (_.isObject(ac)) {
                            ac.id = ac.id || "default";
                            var acSettings = {
                                "default": getDefaultId(),
                                "login": getLoginId(),
                                "alias": getAlisaId(),
                                "number": getNumberId(),
                                "fetion": getFetionId()
                            };
                            if (!top.$Email.isEmail(ac.id)) {
                                ac.id = acSettings[ac.id];
                            }
                            ac.name = (ac.name == null) ? getDefaultName() : ac.name;
                            letter.account = "\"{0}\"<{1}>".format(ac.name, ac.id);
                        }

                        function getDefaultId() {
                            return $User.getDefaultSender();
                        }
                        function getLoginId() {
                            return $User.getDefaultSender();
                        }
                        function getAlisaId() {
                            return $User.getAliasName();
                        }
                        function getFetionId() {
                            return $User.getDefaultSender();
                        }
                        function getNumberId() {
                            return $User.getUid() + "@" + mailDomain;
                        }
                        function getDefaultName() {
                            return $User.getTrueName();
                        }
                    })(sendMailInfo.account);
                    if (!M139.Text.Email.isEmailAddr(letter.account)) {
                        //return doError("ParamError", "account参数异常");
                    }
                    if (sendMailInfo.headers) {
                        letter.headers = {};
                        if (sendMailInfo.headers.subjectColor) {
                            //主题颜色
                            letter.headers["X-RM-FontColor"] = sendMailInfo.headers.subjectColor;
                        }
                        var sn = sendMailInfo.headers.smsNotify;
                        if (sn !== undefined) {
                            letter.headers["X-RM-SmsNotify"] = sn;
                        }
                    }
                    var requestXml = {
                        attrs: letter,
                        action: "deliver",
                        returnInfo: 1
                    };
                    if (sendMailInfo.loadingMsg) {
                        WaitPannel.show(sendMailInfo.loadingMsg);
                    }
                    var categroyId = categroyList[categroy];
                    if (!categroyId) {
                        categroyId = categroy;
                    }
                    top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=" + categroyId, requestXml, function (e) {
                        WaitPannel.hide();
                        var result = e.responseData;
                        if (sendMailInfo.callback) {
                            sendMailInfo.callback(result);
                            return;
                        }
                        if (result['code'] == 'S_OK') {
                            doSuccess(result['var']);
                        } else {
                            //后面要把所有错误类型整理出来
                            if (result["code"] == "FA_INVALID_DATE") {
                                doError("DateError", "定时发送的时间不能比当前的时间早", result["code"]);
                            } else {
                                doError("Unknown", "发送失败", result["code"]);
                            }
                        }
                    });
                    function doSuccess(mid) {
                        if (sendMailInfo.onsuccess) {
                            sendMailInfo.onsuccess({ mid: mid });
                        }
                    }
                    function doError(errorCode, errorMsg, code) {
                        if (sendMailInfo.onerror) {
                            sendMailInfo.onerror({ errorCode: errorCode, errorMsg: errorMsg, code: code });
                        }
                    }
                }
            }
        },
        createModuleManager: function() {
            win.MM = {
                show: function (name, params) {
                },
                activeModule:function(name){
                    top.$App.closeTab(name);
                },
				setTitle: function(title){
					top.$App.setTitle(title);
				},
                close: function (name, params) {
                    try {
                        top.$App.closeTab(name);
                        return;
                    } catch (ex) {
                    }

                    var _params = params || {};

                    if (_params.exec == "back") {
                        top.MM.goBack();
                    } else if (_params.exec == "closeAll") {
                        top.MM.closeAll();
                    } else {
                        top.MM.close(name);
                    }

                }
            };
            return win.MM;
        },

        /**创建老的加载中对象*/
        createWaitPanel: function () {
            win.WaitPannel = {
                show: function (msg, option) {
                    try {
                        top.M139.UI.TipMessage.show(msg, option);
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        if (option) {
                            if (option.delay) {
                                top.FF.alert(msg);
                                setTimeout(function(){
                                    top.FF.close();
                                }, option.delay);
                                return;
                            }
                        }

                        top.WaitPannel.show(msg);
                    }
                },
                hide: function () {
                    try {
                        top.M139.UI.TipMessage.hide();
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        top.WaitPannel.hide();
                    }
                }
            }
            return win.WaitPannel;
        },
        createValidate: function() {
    win.Validate = {
        config: {
				//3位是考虑到短号集群网。
				"mobile":{
					message:"手机格式不正确，请输入3-20位数字",
					//regex:/^\d{3,20}$/
					regex:/^[\(\)\-\d]{3,20}$/
				},
				"email":{
					message:"邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
					regex:new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$","i")
				},
				"phone":{
					message:"电话号码格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"fax":{
					message:"传真号码话格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"zipcode" :{
					message:"邮编格式不正确，请输入3-10位字母、数字、-或空格",
					regex:/^[\ \-\w]{3,10}$/
				},
				"otherim" :{
					message:"飞信号格式不正确，请输入6-10位数字",
					regex:/^\d{6,10}$/
				},
				"qq" :{
					message:"QQ格式不正确，请输入5-11位数字",
					regex:/^\d{5,11}$/
				}
        },
        test: function(key, value) {
            var obj = Validate.config[key];
            if(!obj) {
                throw "找不到的正则:" + key;
            }
            if(obj.regex.test(value)) {
                return true;
            } else {
                this.error = obj.message;
                return false;
            }
        },
        testBirthday: function(value) {

            var isDate = false;
            if(!value) return false;
            var r = value.match(/(\d{4})\-(\d{2})\-(\d{2})/);
            if(r) {
                try {
                    var t = [Number(r[1]), Number(r[2]) - 1, Number(r[3])];
                    var n = new Date();
                    if(t[0] > 0 && t[0] <= n.getFullYear() && t[1] > -1 && t[1] < 12 && t[2] > 0 && t[2] < 32) {
                        var d = new Date(t[0], t[1], t[2]);
                        if(d < n) {
                            isDate = (d.getFullYear() == t[0] && (d.getMonth()) == t[1] && d.getDate() == t[2]);
                        }
                    }
                } catch(ex) {}
            }
            return isDate;
        }
    }
}
    }));
    jQuery.extend(M2012.MatrixVM,
    /**@lends M2012.MatrixVM*/
    {
        /**在使用了老版本对象接口的情况下给予日志提示，描述使用新版本的方法*/
        tip: function (oldFunc, newWay) {

        }
    });
    //对话框组件
    var FF = {
        alert: function (msg, callback) {
            try {
                this.current = top.$Msg.alert(msg, { onclose: callback, isHtml: true, icon:"warn" });
                return this.current;
            } catch(e) {
            
            }
        
            if (top.FF && top.FF.alert) {top.FF.alert(msg)}
        },
        prompt: function (title, msg, defaultValue, callback, maxLength) {
            this.current = $Msg.prompt(msg, callback, {
                dialogTitle: title,
                defaultValue: defaultValue,
                maxLength: maxLength,
                isHtml: true
            });
            return this.current;
        },
        setHeight: function (height) {
            $Msg.getCurrent().setHeight(height);
            $Msg.getCurrent().resetHeight();
        },
        setWidth: function (height) {
            $Msg.getCurrent().setWidth(height);
        },
        close: function () {
            $Msg.getCurrent().close();
        },
        confirm: function (message, callback, cancelCallback, isYesAndNo) {
            var op = {
                icon:"warn",
                isHtml:true
            };
            if (isYesAndNo) {
                op.buttons = [" 是 ", " 否 "];
            }
            this.current = $Msg.confirm(message, callback, cancelCallback, op);
            return this.current;
        },
        show: function (html, title, width, height, fixSize, onclosed, eventHandlers) {
            this.current = $Msg.showHTML(html, {
                dialogTitle: title,
                width: width,
                height: height,
                onclick: onclosed
            });
            return this.current;
        },
        open: function (title, src, width, height, fixSize, miniIcon, hideIcon, hideTitle) {
            this.current = $Msg.open({
                url: src,
                dialogTitle: title,
                width: width,
                height: height,
                //onclick: onclosed,
                hideTitleBar: hideTitle
            });
            return this.current;
        },
        minimize: function () {
            $Msg.getCurrent().minisize();
        }
    };

})(jQuery, _, M139);
