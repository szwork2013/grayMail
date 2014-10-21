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

﻿
(function ($, _, M) {

var _base = {

    __getUrl:function(page, type){
        return "/sharpapi/addr/apiserver/" + page + "?sid=" + sid + (type ? "&APIType=" + type : "") + "&rnd=" + Math.random();
    },

    //添加联系人(单个)
    getAddContactsUrl: function() {
        return Contacts.__getUrl("AddContact.ashx");
    },
    //添加联系人(多个)
    getAddMultiContactsUrl: function() {
        return Contacts.__getUrl("AddMultiContacts.ashx");
    },
    //添加最近联系人(多个)
    getAddLastestContactsUrl: function() {
        return Contacts.__getUrl("AddLastContacts.ashx");
    },
    //自动保存联系人，附带添加最近联系人。
    getAutoSaveRecentContactsUrl: function(){
        return Contacts.__getUrl("AutosaveContact.ashx");
    },
    //取i联系整合接口
    getIAPIUrl: function(action) {//i联系
        return Contacts.__getUrl("iContactService.ashx", action);
    },
    addrInterfaceUrl: function(action){
        return Contacts.__getUrl("addrinterface.ashx", action);
    },
    getLoadLastContactsDataUrl: function() {
        return Contacts.addrInterfaceUrl("GetLCContacts");
    },
    getAPIUrl: function(action){
        return Contacts.addrInterfaceUrl(action);
    },

     //直呼型接口地址
    apiurl : function(action){
        //return top.addrDomain + "/" + action + "?sid=" + sid + "&r=" + Math.random();
        return "/addrsvr/" + action + "?sid=" + sid + "&r=" + Math.random();
    },
    
    MAX_VIP_COUNT: 10,
    
    MAX_CONTACT_LIMTE: 3000,
    getMaxContactLimit: function(){
        var limit = $User.getMaxContactLimit();
        if (limit < 3000) {
            limit = this.MAX_CONTACT_LIMTE;
        }
        return limit;
    },

    //初始化旧数据LinkManList
    init:function(){},

    //通讯录已加载
    isReady: false,
    waitingQueue: [],

    runWaiting: function() {
        $(this.waitingQueue).each(function() { this() });
        this.waitingQueue.length = 0;
    },

    ready: function(callback){
        if(this.isReady){
            callback();
        }else{
            this.waitingQueue.push(callback);
        }
    },


    createAddressPage : function(param) {
        var url = "/m2012/html/addrwin.html?";
        for (var p in param) {
            if(!/container|width|height|withName/.test(p)){
                url += "&" + p + "=" + param[p];
            }
        }
        if (param.withName) {
            url += "&useNameText=true&useAllEmailText=true";
        }
        param.container.innerHTML = "<iframe frameBorder='0' src='{0}' style='width:{1};height:{2}'></iframe>"
        .format(url, param.width || "100%", param.height || "100%");
    },
    
    addSinglVipContact: function(param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
        if(top.Contacts.IsPersonalEmail(param.serialId)){
            //top.FF.alert("不支持添加自己为VIP联系人。");
            top.M139.UI.TipMessage.show("不支持添加自己为VIP联系人。", { delay: 2000, className: 'msgYellow'});
            return false;
        }
        
        var vips = top.Contacts.data.vipDetails;
        var vipGroupId = "",vipCount =0,vipMaxCount = top.Contacts.MAX_VIP_COUNT; //因后端接口限制
        if(vips.isExist){
            vipGroupId =vips.vipGroupId;
            vipCount = vips.vipn ;
        }
        
        if(vipCount >= vipMaxCount){
            var a = '<a hidefocus="" style="text-decoration:none;" href="javascript:top.FF.close();top.Links.show(\'addrvipgroup\');" ><br/>管理VIP联系人</span></a>';
            var msg = vipMsg.vipContactsMax.format(vipMaxCount,a);
            top.FF.alert(msg);

            return false;
        }
        top.WaitPannel.show("正在保存...");
        var requestData = {
                    groupId : vipGroupId,
                    serialId: param.serialId,
                    groupType:1
        }
        
        //回调
        function callback(res){

            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(res.resultCode == 23){ //分组联系人已达上限
                    top.FF.alert(vipMsg.groupLimit);
                    return false;
                }
                
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.syserror);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = AddGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
			//var name = $T.Html.encode(param.name);
            var sucMsg = vipMsg.addVipSuc.replace('“{0}”', '');
            //top.FF.alert(sucMsg);
            top.M139.UI.TipMessage.show(sucMsg, { delay: 2000});
            
            top.BH('addvipsuccess');
            
            if(param.success) param.success();
            
            top.Contacts.updateCache("addVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function AddGroupList(){
			top.Contacts.AddGroupList(requestData,callback);
		}	
        AddGroupList();
    },
	
	delSinglVipContact : function (param){
		var self = this;
		var vipMsg = top.frameworkMessage;
		function cancelVip(){
			self.delSinglVipContact2(param);
		}
		top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip);
	},
    
    delSinglVipContact2 : function (param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
		
        top.WaitPannel.show("正在保存...");
        if(!top.Contacts.IsExitVipGroup){
            return false; //不存在vip联系人组
        }
        
        var vips = top.Contacts.data.vipDetails;
        var requestData = {
                    groupId : vips.vipGroupId,
                    serialId: param.serialId
        }
        //回调
        function callback(res){
            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.sysError);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = DelGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry; 
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
            //top.FF.alert(vipMsg.opSuc);
            top.M139.UI.TipMessage.show("取消成功", { delay: 2000 });
            if(param.success) param.success();
            
            top.Contacts.updateCache("delVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function DelGroupList(){
			top.Contacts.DelGroupList(requestData,callback);
		}
		DelGroupList();
    },

    addVIPContact: function (successCallback) {
		var self = this;
        var maxCount = this.MAX_VIP_COUNT;
        var contactsModel = top.M2012.Contacts.getModel();
        var tempVipArr = contactsModel.get("data").vip.contacts;
        var selItems = [];
        if(tempVipArr &&  tempVipArr instanceof Array){
            selItems = Array.prototype.slice.call(tempVipArr,0);
        }
        for (var i = 0; i < selItems.length; i++) {
            var c = contactsModel.getContactsById(selItems[i]);
            if (!c || !c.getFirstEmail()) {
                selItems.splice(i, 1);
                i--;
            } else {
                selItems[i] = {
                    name: c.name,
                    addr: c.getFirstEmail(),
                    serialId: c.SerialId,
                    value: contactsModel.getSendText(c.name, c.getFirstEmail())
                };
            }
        }

        

        var view = top.M2012.UI.Dialog.AddressBook.create({
            receiverText: "VIP联系人",
            showLastAndCloseContacts: false,
            showVIPGroup: false,
            showSelfAddr: false,
            getDetail: true,
            filter: "email",
            maxCount: maxCount,   //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
            items: selItems,
            isAddVip:true
        });
        view.on("select", function (e) {
            var ids = [];
            var list = e.value;
            for (var i = 0; i < list.length; i++) {
                ids.push(list[i].serialId);
            }
            //selectedCallback(ids);
			self.submitVipContact(ids, function(){ successCallback(ids); });
        });
        view.on("additemmax", function () {
            $Msg.alert("VIP联系人已达上限"+ maxCount +"个，不能添加。", {
                icon: "warn"
            });
        }); 
    },
	submitVipContact:function(ids,successCallback,options){ //type: "add" ,增加
		var self = this;
		selectedCallback(ids);
		//添加VIP联系人组件-submit执行函数
        function selectedCallback(vipList){
            var vipC = top.Contacts.getVipInfo();
            var groupId = vipC.vipGroupId;
            if( !vipC.hasContact && vipList.length == 0){
                return;
            }
            var serialIds = vipList.join(',');
			if(options && options.type == "add") serialIds = vipC.vipSerialIds + ',' + serialIds;
            var param = { groupId: groupId, groupType: 1, serialId: serialIds };

            top.Contacts.editGroupList(param, callBack);
            function callBack(result) {
                var vipPanelTips = top.frameworkMessage;
                if(result.ResultCode != '0'){
                    if(result.resultCode == '23'){
                        FF.alert(vipPanelTips.groupLimit);
                        return false;
                    }
                    //重试 -变量使用View.Retry来保存重试数据
                    var Obj = Retry;
                    if(Obj.retryTime>=3){
                        Obj.retryData = "";
                        Obj.retryFun = null;
                        Obj.retryTime = 0;
                        top.FF.alert(vipPanelTips.sysError);
                    }else{
                        Obj.retryData = vipList;
                        Obj.retryFun = selectedCallback;
                        top.FF.alert(vipPanelTips.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;top.jslog(\'VIpretyr\',Obj);var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                            var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                        });
                    }
                    return false;
                }
                var msg = vipPanelTips.opSuc + '<br>';
                if(vipList.length == 0){
                    msg += vipPanelTips.opClear;
                }else{
                    msg += vipPanelTips.editGroupListSuc.format('所选联系人');
                    top.addBehavior('成功添加VIP联系人');
                }
                top.Contacts.updateCache("editVipContacts", serialIds);
				
				if(options && options.notAlert){
					if (successCallback) {
						successCallback();
					}
				}else{
					top.FF.alert(msg, function(){
                        top.FF.close();
                        //js会阻塞提示框关闭, 所以设置延时
                        if (successCallback) {
                            setTimeout(function(){successCallback();}, 5); 
                        }
                    });
				}
				
                top.$App.trigger("change:contact_maindata");
            }
        }
	},

    /**
     *返回是否自动保存联系人判断
     */
    isAutoSaveContact:function(){
        var isAuto = top.$App.getUserCustomInfo(9);
        if (!isAuto || isAuto === '1') {
            return true;
        } else {
            return false;
        }
    },

    /**
     *收敛ajax请求接口
     */
    ajax: function (options) {
        if (/^\/+(mw|mw2|g2|addrsvr)\//.test(options.url)) {
            var conf = {
                headers: {},
                method: options.method,
                error: options.error,
                async: options.async,
                responseDataType: ""
            };

            if (typeof options.data == "object") {
                if (!options.contentType) {
                    options.contentType = "application/x-www-form-urlencoded"
                }
            }

            if (options.contentType) {
                conf.headers["Content-Type"] = options.contentType;
            }

            return top.M139.RichMail.API.call(options.url, options.data, function (e) {
                var isJson = options.dataType && options.dataType.toLowerCase() == "json";
                var result;
                if (isJson) {
                    result = e.responseData;
                } else {
                    result = e.responseText;
                }
                if (options.success) {
                    options.success(result);
                }
            }, conf);
        } else {
            return doJQAJAX();
        }
        function doJQAJAX() {
            return $.ajax(options);
        }
    },


    scriptReady: function(target, callback) {
        var _this = this;
        var _caller = _this.scriptReady.caller;

        M139.core.utilCreateScriptTag(
            {
                id: "contact_async_method",
                src: $App.getResourceHost() + "/m2012/js/packs/m2012_contacts_async.pack.js",
                charset: "utf-8"
            },
            function(){
                if ("string" === typeof target && _caller === _this[target]) {
                    window.console && console.log("[ERROR] Contacts." + target + "() not found");
                    return;
                }

                if ("function" === typeof target) target();
                if ("function" === typeof callback) callback();
            }
        );
    },

    data: {
        groups: null, //联系人组
        contacts: null, //联系人
        map: null, //组关系
        lastestContacts: null, //最近联系人
        userSerialId: null,
        birthdayContacts: null, //即将生日的好友，
        Vip: null //vip联系人信息
    },

    onchangeListeners: [],
    change: function(func) {
        this.onchangeListeners.push(func);
    },
    onchange: function(args) {
        $(this.onchangeListeners).each(function() {
            try {
                this(args);
            } catch (e) { }
        })
    },

    FROMTYPE: {
        MAIL: 0x10,  //电子邮件
        MOBILE: 0x20,//短彩信
        FAX: 0x40,   //传真

        NONE: 0,     //默认
        SMS: 1,      //发短信成功页
        CARD: 2,     //发贺卡成功页
        POST: 3,     //发明信片成功页
        EMAIL: 4,    //发邮件成功页
        MMS: 5,      //发彩信成功页
        FILE: 6      //发文件快递成功页
    },

    ConvertFrom : function(a){
        var F=this.FROMTYPE;
        var from = a & 0x0f; //取来源
        var type = a & 0xf0; //来类别
        var last = '1';
        var key = 'E';

        if(from == F.MMS){
            last = "2";
        }

        switch(type){
            case F.FAX: key='F'; break;
            case F.MAIL: key='E'; break;
            case F.MOBILE: key='M'; break;
        }

        return {'from': from, 'type': type, 'key': key, 'last': last};
    }
};



/* 新格式
Object
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsIndexMap: Object [新增]
    contactsMap: Object [新增]
    groupedContactsMap: Object [新增]
    groups: Array[22]
    groupsMap: Object
    lastestContacts: Array[50]
    map: Array[137]
    vip: Object [新增]
*/

/*  旧格式
Object
    ContactsMap: Array[603322342]
    TotalRecord: 2733
    Vip: Array[1]  [未迁移]
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsHasRecord: Object
    groups: Array[22]
    groupsMap: Object
    lastContactsDetail: Array[232]
    lastestContacts: Array[50]
    map: Array[137]
    strangerHasRecord: Object
    userSerialId: undefined
    vipDetails: Object
*/

$.extend(M2012.MatrixVM.prototype, {

    _addrDataNull: {
        ContactsMap: [],
        TotalRecord: 0,
        Vip: [],
        birthdayContacts: [],
        closeContacts: [],
        contacts: [],
        contactsHasRecord: {},
        groups: [],
        groupsMap: {},
        lastContactsDetail: [],
        lastestContacts: [],
        map: [],
        strangerHasRecord: {},
        userSerialId: "",
        vipDetails: {
            hasContact: false,
            isExist: false,
            vipContacts: [],
            vipEmails: [],
            vipGroupId: "",
            vipSerialIds: "",
            vipn: "0"
        }
    },

    createContacts: function(){

        var ci = M2012.Contacts.ContactsInfo;

        window.Contacts = {};
        window.ContactsInfo = ci;

        //联系人搜索
        window.ContactsInfo.prototype.search = function(keyword) {
            var text = (this.name + "," + this.emails + "," + this.mobiles + "," + this.faxes);
            if (this.Quanpin || this.Jianpin) text += "," + this.Quanpin + "," + this.Jianpin;
            //tofix: 下面的职务与公司名，在GetUserAddrJsonData接口并未返回，所以下面的条件永远不生效
            if(this.UserJob)text+=","+this.UserJob;
            if(this.CPName)text+=","+this.CPName;
            return text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
        }

        /**
         * 验证通讯录实体对象的数据合法性
         * @param uncheckEmpty boolean 不检查关键字段是否为空
         * @return object
         *  {success: boolean,
         *   msg: string,
         *   errorProperty: string
         *  }
         */
        window.ContactsInfo.prototype.validateDetails=function(uncheckEmpty){
            var T = this;
            if (!uncheckEmpty){
                if(!T.name || T.name.trim()==""){
                    return failResult("请输入姓名","name");
                }
                if(T.FamilyEmail)T.FamilyEmail=T.FamilyEmail.trim();
                if(T.MobilePhone)T.MobilePhone=T.MobilePhone.trim();
                if(T.OtherEmail)T.OtherEmail=T.OtherEmail.trim();
                if(T.OtherMobilePhone)T.OtherMobilePhone=T.OtherMobilePhone.trim();
                if(!T.FamilyEmail && !T.MobilePhone && !T.BusinessEmail && !T.BusinessMobile){
                    return failResult("电子邮箱和手机号码，请至少填写一项");
                }
            }
            

            if(T.AddGroupName){
                if(Contacts.getGroupByName(T.AddGroupName)){
                    return failResult("新建的组名已存在","AddGroupName");
                }else{
                    T.AddNewGroup="true";
                }
            }
            if(T.FamilyEmail){
                  var emaiLen = T.FamilyEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.FamilyEmail) ){
                    return failResult("电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
            if(T.BusinessEmail){
                  var emaiLen = T.BusinessEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.BusinessEmail) ){
                    return failResult("商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
              
            if(T.MobilePhone && !Validate.test("mobile",T.MobilePhone)){
                return failResult("手机号码格式不正确，请输入3-20位数字");
             }
             
             if(T.BusinessMobile && !Validate.test("mobile",T.BusinessMobile)){
                return failResult("商务手机格式不正确，请输入3-20位数字");
             }
            
             if(T.CPZipCode && !Validate.test("zipcode",T.CPZipCode)){
                  return failResult("公司邮编格式不正确，请输入3-10位字母、数字、-或空格");
             }
                
            //if(T.ZipCode && !Validate.test("zipcode",T.ZipCode)){
            //    return failResult("邮政邮编格式不正确，请输入3-10位字母、数字、-或空格");
            // }    
            if(T.FamilyPhone && !Validate.test("phone",T.FamilyPhone)){
                return failResult("常用固话格式不正确，请输入3-30位数字、-", "familyphone");
            }
            if(T.BusinessPhone && !Validate.test("phone",T.BusinessPhone)){
                return failResult("公司固话格式不正确，请输入3-30位数字、-");
            }
            //if(T.OtherPhone && !Validate.test("phone",T.OtherPhone)){
            //  return failResult("常用固话格式不正确，请输入3-30位数字、-");
            //}

            if(T.BusinessFax && !Validate.test("fax",T.BusinessFax)){
                return failResult("传真号码格式不正确，请输入3-30位数字、-");
            }

            if(T.BirDay && !Validate.testBirthday(T.BirDay)){
                return failResult("请输入正确的生日日期:"+T.BirDay,"BirDay");
            }

            if(T.OtherIm && !Validate.test("otherim",T.OtherIm)){
                return failResult("飞信号格式不正确，请输入6-10位数字");
            }

            return {success:true};
            function failResult(msg,property){
                return {
                    success:false,
                    msg:msg,
                    errorProperty:property||""
                };
            }
        };

        $.extend(window.Contacts, _base);
        
        var _this = this;
        _this.attacthContactMethod();

        $App.on("GlobalContactLoad", function (args) {
            _base.runWaiting();
        });

        $App.on("contactLoad", function (args) {
            _this.loadContactData();
        });

        $App.on("contactUpdate", function (args) {
            _this.loadContactData();
        });
    },

    loadContactData: function() {
        var _this = this;
        var _data = false;

        M139.Timing.waitForReady(
        function(){
            return _data;
        },
        function(){
            var temp = $.extend({}, _this._addrDataNull);
            $.extend(temp, _data);

            temp.ContactsMap = temp.contactsMap;
            
            (function(tmp){
                var _vip = tmp.vip;
                _vip.contacts = _vip.contacts || [];
                _vip.groupId = _vip.groupId || "";
                var _vipCount = _vip.contacts.length;

                var i = 0;
                var _vipEmails = [];
                var _vipContacts = [];

                for (i = 0; i < _vipCount; i++) {
                    var contact = tmp.contactsMap[_vip.contacts[i]];
                    if (contact) { _vipContacts.push(contact); }
                }

                for (i = 0; i < _vipContacts.length; i++) {
                    var _vipContact = _vipContacts[i];
                    var _vipContactEmails = [];
                    if(_vipContact.FamilyEmail) _vipContactEmails.push(_vipContact.FamilyEmail);
                    if(_vipContact.BusinessEmail) _vipContactEmails.push(_vipContact.BusinessEmail);
                    _vipEmails = _vipEmails.concat(_vipContactEmails);  //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
                }

                tmp.vipDetails = {
                    isExist      : _vip.groupId.length > 0,   //vip联系人分组是否存在
                    hasContact   : _vipCount > 0,   //
                    vipGroupId   : _vip.groupId || "vip",
                    vipContacts  : _vipContacts || "",
                    vipEmails    : _vipEmails || "",
                    vipSerialIds : _vip.contacts.join(",") || "", 
                    vipn         : _vipCount || 0
                }
            })(temp);

            window.Contacts.data = temp;
            window.Contacts.isReady = true;

            top.$App.trigger("GlobalContactLoad", temp);
        });

        $App.getModel("contacts").requireData(function(data){
            _data = data;
        });
    }

})
top.Retry={
	retryTime : 0,
	retryData : "",
	retryFun : null
} ; //home页全局变量，用来做重试操作使用。

})(jQuery, _, M139);

﻿
;

function AddrCrossAjax(_url, _data, _onResponse, _onError){

    var xhr = false;

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
        if (typeof xhr.withCredentials !== "boolean") {
            xhr = false;
        }
    }

    if (xhr) {
        xhr.open("POST", _url, true);
        xhr.withCredentials = true;
        if (xhr.setRequestHeader) {
            xhr.setRequestHeader('Content-Type', 'text/plain');
        }

        xhr.onreadystatechange = function(){
            if (this.readyState == 4){
                if (this.status == 200){
                    if (_onResponse) _onResponse(this.responseText);
                } else {
                    if (_onError) _onError(this.status);
                }
            }
        };
        xhr.send(_data);
        return;
    }

    //如果浏览器版本可能不允许 Cross-Origin Resource Sharing 协议则使用Iframe代理
    apiProxyReady(function(T){
        T.ajax.request(_url, {
            "method": "POST",
            "header": {"Content-Type":"application/xml"},
            "data": _data,
            "onfailure": function(xhr){
                if (_onError) _onError(xhr.status);
            },
            "onsuccess": function(xhr, res){
                if (_onResponse) _onResponse(res);
            }
        });
    });
}; // end function ajax

function doAPIrequest(param){

    var url=param.url;
    var request=param.request;
    var timeout=param.timeout||30000;
    var type=param.type||"post";
    var successHandler=param.successHandler;
    var callback=param.callback;
    var err=param.error;

    AddrCrossAjax(url, request, onResponse, err);

    function onResponse(response) {
        Contacts.hideLoading();
        if(param.responseEncode){
            response = param.responseEncode(response);
        }
        try{ //返回json
            var responseObj = eval("(" + response + ")");
            if( responseObj.ResultCode == 0){
                if(successHandler){
                    successHandler(responseObj);
                }
            }
        }catch(e){
            var doc=getXmlDoc(response);
            if(doc && doc.documentElement){
                var rc=doc.getElementsByTagName("ResultCode")[0];
                rc=rc||doc.getElementsByTagName("rc")[0];
                var msg=doc.getElementsByTagName("ResultMsg")[0];
                msg=msg||doc.getElementsByTagName("rm")[0];
                if(rc){
                    var text=rc.text||rc.textContent;
                    var message=msg.text||msg.textContent;
                    if(text=="0"){
                        if(successHandler)successHandler(doc,rc);
                    }else{
                        error(text,message,doc);
                    }
                }else{
                    error();
                }
            }else{
                error();
            }
        }
    }

    function error(resultCode,resultMessage, xdoc){
        if (err) {
            err();
            return;
        }

        var RC_CODE = {
            GroupExisted: 9,
            ContactOverLimit: 21,
            GroupOverLimit: 22,
            ContactInGroupOverLimit: 23,
            ContactExisted: 28,
            AddContactTooQuick: 32,
            InputContactTooQuick: 33
        };
        var result = { success: false, resultCode: -1, msg: "" };
        var rc = -1;

        if ( param.showLoading != false ) {
            Contacts.hideLoading();
        }

        if (typeof(resultCode) == "string"){
            result.resultCode = resultCode;
        }

        rc = parseInt(result.resultCode);

        switch(rc) {
            case RC_CODE.GroupExisted:
            case RC_CODE.GroupOverLimit:
            case RC_CODE.ContactInGroupOverLimit:
            case RC_CODE.AddContactTooQuick:
            case RC_CODE.InputContactTooQuick:
                result.msg=resultMessage;
                break;

            case RC_CODE.ContactOverLimit:
                result.msg="保存失败，联系人数量已达上限。你可以<br /><a href=\"javascript:(function(){top.FF.close();top.Links.show('addr');})();\">管理通讯录&gt;&gt;</a>" ;
                break;

            case RC_CODE.ContactExisted:
                rc = xdoc.getElementsByTagName("SerialId")[0];
                rc = rc.text||rc.textContent;
                result.SerialId = parseInt(rc);
                break;
            default:
                result.msg = YIBUMSG.ajax_othererror;
                break;
        }

        if(callback){
            callback(result);
        }
    }
};


function getXMLTest(doc){
    if(doc.xml)return doc.xml;
    var root=doc.documentElement||doc;
    var xml="<"+root.tagName+">";
    $(root.tagName+" > *",doc).each(function(){
        xml+="<"+this.tagName+">"+encodeXML(this.textContent)+"</"+this.tagName+">";
    });
    xml+="</"+root.tagName+">";
    return xml;
}
function replaceSimpleXML(xml){
    if(typeof xml!="string"){
        xml=getXMLTest(xml);
    }
    var rm=replaceMent;
    for(var p in rm){
        var reg=new RegExp("(</?)"+p+">","g");
        xml=xml.replace(reg,"$1"+rm[p]+">");
    }
    return xml;
}

function LastContactsInfo(param) {
    for(var p in param){
        this[p]=param[p];
    }
    var reg=/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/;
    var m=this.CreateTime.match(reg);
    this.CreateTime=new Date(m[1],m[2]-1,m[3],m[4],m[5],m[6]);
}

(function ($, _, M) {


String.prototype.bind=function(data){
    var result=this;
    for(var p in data){
        var reg=new RegExp("\\{"+p+"\\}","gi");
        result=result.replace(reg,data[p]);
    }
    return result;
}

var _syncMethods = {

    getContactsByMobile: function(mobile) {
        var result = [];
        if (!Contacts.data.contacts || mobile == '' || 'undefined' == typeof mobile) {
            return result;
        }

        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.mobiles.length; j++) {
                var m = c.mobiles[j];
                m = m.replace(/[^\d]+/g, "");//tofix:修正(86)+8686-86,等手机号
                if(m.length==13)m=m.replace(/^86/, "");
                if (m == mobile) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByMobile: function(mobile, useRepeat) {
        var contacts = Contacts.data.contacts;
        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        if (!contacts) return null;
        if (!window._mobileCache_) {
            _mobileCache_ = {};
            _repeatMobile_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    var m = c.mobiles[j];
                    if(m.length==13)m=m.replace(/^86/, "");
                    if (!_mobileCache_[m]) {
                        _mobileCache_[m] = c;
                    } else if (_mobileCache_[m].name != c.name) {
                        _repeatMobile_[m] = true;
                    }
                }
            }
            setTimeout(function() { _mobileCache_ = undefined; _repeatMobile_ = undefined; }, 0);
        }
        if (_repeatMobile_[mobile] && !useRepeat) {
            return null;
        } else {
            return _mobileCache_[mobile];
        }
    },
    //调用新版的函数
    getNameByAddr: function(addr, name) {
        arguments.callee.exists = false;
        var addrName = top.$App.getModel("contacts").getAddrNameByEmail(addr);
        addrName = top.M139.Text.Html.encode(addrName);
        if (addrName == top.M139.Text.Email.getAccount(addr)) {
            return top.M139.Text.Email.getEmail(addr);
        } else {
            return addrName;
        }
    },

    getGroupByName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupName==groupName){
                return g;
            }
        }
        return null;
    },

    getGroupById: function(groupId){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupId==groupId){
                return g;
            }
        }
        return null;
    },

    isExistsGroupName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            if(groups[i].GroupName==groupName){
                return true;
            }
        }
        return false;
    },

    //验证新增联系人数据
    validateAddContacts: function(obj){
        Contacts.validateAddContacts.error="";
        if(!obj.name || obj.name.trim()==""){
            Contacts.validateAddContacts.error="请输入联系人姓名";
            return false;
        }
        if(obj.name.trim().getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactNameToolong'];
            return false;
        }
        if(obj.email && !Validate.test("email",obj.email)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.email && obj.email.getByteCount()>60){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactEmailToolong'];
            return false;
        }
        if(obj.mobile && !Validate.test("mobile",obj.mobile)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.mobile && obj.mobile.getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactMobileToolong'];
            return false;
        }
        if(!obj.email && !obj.mobile){
            Contacts.validateAddContacts.error="电子邮箱和手机号码，请至少填写一项";
            return false;
        }
        if(obj.newGroup){
            if(Contacts.getGroupByName(obj.newGroup)!=null){
                Contacts.validateAddContacts.error="联系组\""+obj.newGroup+"\"已经存在!";
                return false;
            }
        }
        return true;
    },

    getContactsByGroupId: function (groupId, onlyId) {
        var model = top.M2012.Contacts.getModel();
        if (onlyId) {
            return model.getGroupMembersId(groupId);
        } else {
            return model.getGroupMembers(groupId);
        }
    },

    getContactsById: function(contactsId){
        return Contacts.data.ContactsMap[contactsId]||null;
    },

    getContactsGroupById: function(contactsId){
        var groups = [];
        var member = Contacts.data.groupMember;
        for(var key in member){
            if(member[key] && member[key].length > 0){
                var str = member[key].join(',');
                if(str.indexOf(contactsId) > -1){
                    groups.push(key);
                }
            }
        }

        return groups;
    },

    getVipInfo: function(){
        return Contacts.data.vipDetails||null;
    },

    //根据VIP联系人信息组装数据提供刷新VIP邮件使用
    setVipInfo: function(vips){
        if(!vips){return false;}
        var vipinfo = vips;
        var vipn =0,vips = "",isExist =false,hasContact=false,vipGroupId="",vipArr = [] , vipEmails = [];
        if(vipinfo.length > 0){
            isExist = true;
            vipGroupId = vipinfo.vipGroupId;
            vipn = vipinfo.vipn;
        }
        if(vipn > 0){
            hasContact = true;
            vips = vipinfo.vipSerialIds;
            var vipIdArray = vips.split(",");
    
            for(var i=0; i<vipIdArray.length;i++){
                var info = Contacts.data.ContactsMap[vipIdArray[i]];
                if(info){
                    vipArr.push(info);
                    vipEmails = vipEmails.concat(info.emails);
                }
            }
        }
        Contacts.data.vipDetails ={
                        isExist      : isExist,   //vip联系人分组是否存在
                        hasContact   : hasContact,   //
                        vipGroupId   : vipGroupId,
                        vipContacts  : vipArr,
                        vipEmails    : vipEmails,
                        vipSerialIds : vips,
                        vipn         : vipn
                    };
    },

    //根据email地址找到联系人
    getContactsByEmail: function(email){
        var result = [];
        if (!Contacts.data.contacts) return result;
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.emails.length; j++) {
                if (c.emails[j] == email) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByEmail: function(email,useRepeat) {//默认放弃有重复name的,除非useRepeat为true
        var contacts = Contacts.data.contacts;
        if (!contacts || !email) return null;
        email = email.toLowerCase();
        if (!window._emailCache_) {
            _emailCache_ = {};
            _repeatEmail_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.emails.length; j++) {
                    var e = c.emails[j].toLowerCase();
                    if (!_emailCache_[e]) {
                        _emailCache_[e] = c;
                    } else if (_emailCache_[e].name != c.name) {
                        _repeatEmail_[e] = true;
                    }
                }
            }
            setTimeout(function() { _emailCache_ = undefined; _repeatEmail_ = undefined; }, 0);
        }
        if (_repeatEmail_[email] && !useRepeat) {
            return null;
        } else {
            return _emailCache_[email];
        }
    },

    //是否存在的手机
    isExistMobile: function(mobile) {
        var contacts = Contacts.data.contacts;
        mobile = mobile.toString().trim().replace(/^86/,"");
        if (!contacts) return true;
        for (var i = 0, len = contacts.length; i < len; i++) {
            var info = contacts[i];
            if (
                (info.MobilePhone && info.MobilePhone.trim().replace(/^86/,"") == mobile)
                || (info.BusinessMobile && info.BusinessMobile.trim().replace(/^86/,"") == mobile)
                || (info.OtherMobilePhone && info.OtherMobilePhone.trim().replace(/^86/,"") == mobile)) {
                return true;
            }
        }
        return false;
    },

    //是否存在的邮箱
    isExistEmail: function(email){
        var contacts=Contacts.data.contacts;
        if(!contacts)return true;
        if(!email)return false;
        email=email.toLowerCase();
        for(var i=0,len=contacts.length;i<len;i++){
            var info=contacts[i];
            if(
                (info.FamilyEmail && info.FamilyEmail.toLowerCase()==email)
                ||(info.BusinessEmail && info.BusinessEmail.toLowerCase()==email)
                ||(info.OtherEmail && info.OtherEmail.toLowerCase()==email)){
                return true;
            }
        }
        return false;
    },

    getContactsCount: function() {
        return top.Contacts.data.TotalRecord;
    },

    QueryUserInfo: function(callback){

        var request="<QueryUserInfo><UserNumber>{0}</UserNumber></QueryUserInfo>".format($User.getUid());
        function successHandler(doc){
            var result={};
            var obj=doc.responseData;
            result.success=true;
            //result.msg= YIBUMSG.contactsaved;
            result.msg= "保存成功";//下版本修复
            if(obj.UserInfo){
                //result.info=new top.ContactsInfo(obj.UserInfo);
				 var helper = top.$App.getModel("contacts");
				 var fullInfo = helper.userInfoTranslate(obj.UserInfo[0]);
				result.info = new M2012.Contacts.ContactsInfo( fullInfo );
			}else{
                result.info=null;
            }
            if(callback){
                callback(result);
            }
        }
		 $RM.call("QueryUserInfo", request, function(a){
				successHandler(a);
			}, { error: function(){ alert("连接失败"); } });
		/*
        doAPIrequest({
            url:Contacts.apiurl("QueryUserInfo"),
            callback:callback,
            request:request,
            successHandler:successHandler,
            responseEncode:replaceSimpleXML
        });*/

    },

    /**
     * 将list添加到本地最近联系人缓存中。
     * @param {Array} list 必选参数，带属性AddrContent联系人数组。
     */
    addLastestContactsToCache: function(list) {
        var lastestContacts = Contacts.data.lastestContacts;
        if(!lastestContacts) return;
        $(list).each(function() {
            for (var i = 0; i < lastestContacts.length; i++) {
                if (lastestContacts[i] && lastestContacts[i].AddrContent == this.AddrContent) {
                    lastestContacts.splice(i, 1);
                    i--;
                }
            }
        });
        var arr = list.concat(lastestContacts);
        Contacts.data.lastestContacts = arr;
    },

    //邮件列表发件人浮层，加改手机使用。
    addContactsMobile: function(serialId, number, callback) {
        var info = Contacts.getContactsById(serialId);
        var request = "<AddContactsField><SerialId>{0}</SerialId><MobilePhone>{1}</MobilePhone></AddContactsField>".format(
            info.SerialId,
            encodeXML(number)
        );
        Contacts.execContactDetails(request, function(result) {
            if (result.success) {
                info.MobilePhone = number;
                info.mobiles[0] = number;
                if (callback) callback(result);
            } else {                
                if (callback) callback(result);
            }
        }, false);
    },

    //通讯录首页快速编辑使用，只更改其中几个字段时使用。
    //注意，该服务端接口必须填满所有字段，否则会清空
    ModContactsField: function (serialId, contactsDetails, isOver, callback, msg) {
        //TODO 暂时没想到好方法，在请求此方法时，YIBUMSG为空（未加载m2011.matrixvm.contacts.async.js)的情形,特加了个msg参数
        //关联文件：m2012.contacts.httpclient.js, 行700左右

        var properties;
        var feContact = contactsDetails;
        var orContact = this.getContactsById(serialId);

        var key = [ "AddrFirstName", "FamilyEmail", "MobilePhone", "BusinessEmail", "BusinessMobile" ];
        for (var i = key.length; i--; ) {
            properties = feContact[key[i]];
            if (properties) {
                orContact[key[i]] = properties;
            }

            if (typeof(properties) == "string" && properties.length == 0) {
                orContact[key[i]] = "";
            }
        }

        var buff = ["<ModContactsField>",
            "<UserNumber>", $User.getUid(), "</UserNumber>",
            "<SerialId>", serialId, "</SerialId>"];

        for (var m = key.length, i = 0; i < m; i++) {
            buff.push("<", key[i], ">", encodeXML(orContact[key[i]]), "</", key[i], ">");
        }

        buff.push("<OverWrite>", (isOver ? "1" : "0"),"</OverWrite>");
        buff.push("</ModContactsField>")

        var requestBody = buff.join('');
        var requestUrl = Contacts.addrInterfaceUrl("ModContactsField");

        function successHandler(doc) {
            var info = doc.responseData;

            var result = {};
            result.resultCode = info.ResultCode;
            result.msg = msg || YIBUMSG.contactsaved;
            result.ContactInfo = contactsDetails;
            result.SerialId = contactsDetails.SerialId;

            if (result.resultCode == '0'){
                Contacts.getContactsInfoById(serialId, function(_result){
                    Contacts.updateCache("EditContactsDetails", { 'info':_result.contactsInfo });
                    result.ContactInfo = _result.contactsInfo;
                    result.msg = msg || YIBUMSG.contactsaved;
                    result.success = true;

                    if (callback) callback(result);
                });
            }else{
                result.success = false;
                if (callback) callback(result);
            }
        }

        $RM.call("ModContactsField", requestBody, function(a){
            successHandler(a);
        }, { error: function(){ alert("连接失败"); } });

    },

    /*
    * 判断联系人是否是vip联系人-只需要判断serialId是否在vipgroup里面就行因为 vip组最多20人，这样循环最快
    *groupId 默认为vip组的id
    *serialId 联系人id
    *return BOOLEAN  返回联系人是否在某个组-默认查询vip组 -vip组ID固定(****)
    */
    IsVipUser: function(serialId){
        if(!serialId){
            return false;
        }
        var vipContacts = Contacts.data.vipDetails;
        if(!vipContacts.isExist){ //不存在vip联系人组
            return false;
        }
        if(!vipContacts.hasContact){
            return false; //VIP联系人为0
        }
    
        var vips = vipContacts.vipSerialIds;
        return vips.indexOf(serialId) > -1;
    },

    //从多个联系人中筛选出vip联系人
    /*
    *serialIdList ["3123","312321"]
    */
    FilterVip: function(serialIdList){
        var isVip = false;
        var vipList = [];
        if(!serialIdList){
            top.jslog("联系人sid组为空",serialIdList);
            return vipList;
        }
        for(var i=0;i<serialIdList.length;i++){
            isVip = top.Contacts.IsVipUser(serialIdList[i]);
            if(isVip){
                vipList.push(serialIdList[i]);
            }
        }
       return vipList;
    },

    //判断是否有vip联系人组
    IsExitVipGroup: function(){
        var vipgroup = Contacts.data.vipDetails;
        return vipgroup.length > 0 ;
    },

    //判断传入的sid是否是用户自己的 ()
    IsPersonalEmail: function(serialId){
		if(!serialId){return false;}
        //var info = top.Contacts.getContactsById(serialId);
        var info = top.Contacts.data.ContactsMap[serialId];
        var emails = info.emails;
        var personalEmails = $User.getAccountListArray();

        for(var i=0; i<emails.length; i++){
            for(var j=0;j<personalEmails.length;j++){
                if(personalEmails[j] ==emails[i]) {
                    return true; //break 只能退出当前for循环，没法退出最外层for循环，只能使用return 退出整个函数
                }
            }
        
        }
        return false;
    }

};

    //异步方法体的函数
    var _asyncMethods = {

        //#region //{ 联系人操作方法

        addContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addContacts", function(){_this.addContacts.apply(_this, arg)});
        }

        ,addContactsMuti: function(contacts, callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("addContactsMuti", function(){_this.addContactsMuti.apply(_this, arg)});
        }

        ,addContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,true);
        }

        ,editContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,false);
        }

        ,execContactDetails: function(contacts, callback, isAdd) {
            var _this = this, arg = arguments;
            _this.scriptReady("execContactDetails", function(){_this.execContactDetails.apply(_this, arg)});
        }

        ,deleteContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContacts", function(){_this.deleteContacts.apply(_this, arg)});
        }

        ,addLastestContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addLastestContacts", function(){_this.addLastestContacts.apply(_this, arg)});
        }

        //最近联系人详细数据
        ,getLastContactsDetail: function(callback,isClose){
            var _this = this, arg = arguments;
            _this.scriptReady("getLastContactsDetail", function(){_this.getLastContactsDetail.apply(_this, arg)});
        }

        ,getCloseContactsDetail: function(callback) {
            this.getLastContactsDetail(callback, true);
        }

        //异步查询联系人详细数据
        ,getContactsInfoById: function(id,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getContactsInfoById", function(){_this.getContactsInfoById.apply(_this, arg)});
        }

        //获取重复联系人列表
        ,getRepeatContacts: function(callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getRepeatContacts", function(){_this.getRepeatContacts.apply(_this, arg)});
        }

        //获取待更新联系人的人数
        ,getUpdatedContactsNumData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getUpdatedContactsNumData", function(){_this.getUpdatedContactsNumData.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 组操作方法

        ,addGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addGroup", function(){_this.addGroup.apply(_this, arg)});
        }

        ,changeGroupName: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("changeGroupName", function(){_this.changeGroupName.apply(_this, arg)});
        }

        ,deleteGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteGroup", function(){_this.deleteGroup.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 联系人分组 关联方法

        ,deleteContactsFromGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContactsFromGroup", function(){_this.deleteContactsFromGroup.apply(_this, arg)});
        }

        ,moveContactsToGroup: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("moveContactsToGroup", function(){_this.moveContactsToGroup.apply(_this, arg)});
        }

        ,copyContactsToGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("copyContactsToGroup", function(){_this.copyContactsToGroup.apply(_this, arg)});
        }

        /**
        * 给编辑分组联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        * param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        * param.groupType: 1 || ""
        * param.serialIds:联系人id串
        */
        ,editGroupList: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("editGroupList", function(){_this.editGroupList.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 用户自身资料操作方法

        //添加或编辑用户自身资料
        ,AddUserInfo: function(info,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("AddUserInfo", function(){_this.AddUserInfo.apply(_this, arg)});
        }

        //#endregion //}
        
        //#region //{ 用户相互关系相关方法

        ,getWhoWantAddMeData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoWantAddMeData", function(){_this.getWhoWantAddMeData.apply(_this, arg)});
        }

        ,agreeOrRefuseAll: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("agreeOrRefuseAll", function(){_this.agreeOrRefuseAll.apply(_this, arg)});
        }

        //#endregion //}
        
        //>
        //合并联系人
        //<
        ,MergeContacts: function(serialId,info,callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.MergeContacts.apply(Contacts,arg)});
        }
        //>
        //智能全自动合并联系人
        //<
        ,AutoMergeContacts: function(callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.AutoMergeContacts.apply(Contacts,arg)});
        }
        //>
        //<
        ,getAddrConfig: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getAddrConfig.apply(Contacts,arg)});
        }
        //>
        //删除最近联系记录
        //<
        ,DeleteLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.DeleteLastContactsInfo.apply(Contacts,arg)});
        }
        //>

        //删除最近联系记录
        //<
        ,EmptyLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.EmptyLastContactsInfo.apply(Contacts,arg)});
        }

        ,addContactsToCacheExec: function() {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.addContactsToCache.apply(Contacts,arg)});
        }

        //<9.28
        ,addLastestContactsExt: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execaddLastestContactsExt", function(){
                    Contacts.execaddLastestContactsExt.apply(Contacts, arg);
                });
            });
	        //Contacts.scriptReady(function(){Contacts.addLastestContactsExt.apply(Contacts,arg)});
        }

        ,getWhoAddMePageData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoAddMePageData", function(){_this.getWhoAddMePageData.apply(_this, arg)});
        }
        ,getWhoAddMeData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getWhoAddMeData.apply(Contacts,arg)});
        }

        ,getDealListData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getDealListData.apply(Contacts,arg)});
        }
        ,deleleteDealList: function(relationId, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.deleleteDealList.apply(Contacts,arg)});
        }

        //同步添加若干联系人（同自动保存联系人接口AutoSaveReceivers）
        ,syncAddContacts: function(obj, callback, groupid){
            var arg=arguments;
            Contacts.scriptReady(function(){Contacts.execSyncAddContacts.apply(Contacts,arg)});
        }



        //用户隐私设置
        ,savePrivacySettings: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execSavePrivacySettings", function(){
                    Contacts.execSavePrivacySettings.apply(Contacts, arg);
                });
            });
        }

        //获取用户隐私设置信息params 包括 请求参数 和回调函数
        ,getPrivacySettings: function(params) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execGetPrivacySettings", function(){
                    Contacts.execGetPrivacySettings.apply(Contacts, arg);
                });
            });
        }
        /**
         * 可能认识的人页面批量添加选择人员。
         * @param {String} request 必选参数，请求参数。
         */
        ,OneKeyAddWAM: function(request,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("OneKeyAddWAM", function(){_this.OneKeyAddWAM.apply(_this, arg)});
        }
        /**
         * 可能认识的人分组接口。
         * @param {String} request 必选参数，请求参数。
         */
        ,WMAGroupList: function(request,callback){
	       var _this = this, arg = arguments;
            _this.scriptReady("WMAGroupList", function(){_this.WMAGroupList.apply(_this, arg)});
        }

        ,modDealStatus: function(p, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.modDealStatus.apply(Contacts,arg)});
        }

        ,updateCache: function(type, param) {    
            var arg = arguments;
            Contacts.scriptReady(function() { Contacts.updateCache.apply(Contacts, arg) });
        }

        /**
         * 发信成功页自动保存联系人与记录最近联系人。
         * @param {Array } contacts 必选参数，包含主送、抄送、密送的所有收件人的逗号隔开数组行 1@a.c, 2@a.c。
         * @param {String} from 必选参数，E、E1之类的来源标识 详见FROMTYPE枚举。
         * @param {Object} panel 必选参数，生成已保存联系人列表的DOM对象。
         * @param {String} subject 必选参数，刚才发送的邮件的标题。
         * @return void
         */
        ,AutoSaveRecentContacts: function(contacts, from, panel, subject) {
	        var _this = this, arg = arguments;
            _this.scriptReady("AutoSaveRecentContacts", function(){_this.AutoSaveRecentContacts.apply(_this, arg)});
        }
        /**
        *发信页 查询所有收件人是否在是整组
        */
        ,IsAllContactsSameGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execIsAllContactsSameGroup", function(){
                    Contacts.execIsAllContactsSameGroup.apply(Contacts, arg);
                });
            });
        }


        /**
         *发信成功页另存为组
         */
        ,saveRecieverToGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execsaveRecieverToGroup", function(){
                    Contacts.execsaveRecieverToGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 发信成功页删除联系人。
         * @param {String} serialId 必选参数，联系人ID。
         * @return void
         */
        ,DelSavedContact: function(serialId, lst, ext){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execDelSavedContact", function(){
                    Contacts.execDelSavedContact.apply(Contacts, arg);
                });
            });
        }

        /**
         * 发信成功页修改联系人。
         * @param {String} serialId 必选参数，联系人ID。
         * @param {String} mobile 必选参数，修改后的手机号。
         * @param {String} name 必选参数，修改后的姓名。
         * @param {Object} lnk 必选参数，”修改“字样的A标签。
         * @param {Object} lstGroup 必选参数，组列表所在的UL标签。
         * @return void
         */
        ,ModSavedContact: function(serialId, mobile, name, lnk, pnl){
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execModSavedContact", function(){
                    Contacts.execModSavedContact.apply(Contacts, arg);
                });
            });
        }

        /**
         * 给自动保存联系人页快速添加组
         * @param {Object} btn
         * @param {Object} context
         */
        ,QuickAddGroup: function(btn, context){
           var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execQuickAddGroup", function(){
                    Contacts.execQuickAddGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 修改部分个人信息的接口
         * @param {Function} callback
         */
        ,ModUserInfoIncrement: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function() {
                if (Contacts.ModUserInfoIncrement.caller == null) {
                    Contacts.ModUserInfoIncrement.apply(Contacts,arg);
                }
            });
        }

        //禁用自动保存联系人后，发送成功出现的保存联系人页面
        ,createAddContactsPage: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execCreateAddContactsPage", function(){
                    Contacts.execCreateAddContactsPage.apply(Contacts, arg);
                });
            });
        }

        //给分组添加联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        /**
        *param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        *param.groupType: vip || ""
        *param.serialIds:联系人id串
        */
        ,AddGroupList: function(param,callback){
	        var _this = this, arg = arguments;
            _this.scriptReady("AddGroupList", function(){_this.AddGroupList.apply(_this, arg)});
        }



        //将联系人移除分组--取消vip联系人调用的此接口
        ,DelGroupList: function(param,callback){
			 var _this = this, arg = arguments;
            _this.scriptReady("DelGroupList", function(){_this.DelGroupList.apply(_this, arg)});
        }
        
        //获取“和通讯录”待更新联系人的人数
        , getColorCloudInfoData: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getColorCloudInfoData", function () { _this.getColorCloudInfoData.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportList: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportList", function () { _this.getFinishImportList.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportResult: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportResult", function () { _this.getFinishImportResult.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getRemindBirthdays: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getRemindBirdays", function () { _this.getRemindBirthdays.apply(_this, arg) });
        }

        /**
         * 设置生日提醒联系人的接口
         * 告知服务器，对应号码的联系人，已经设置生日提醒
         * @parm contactsNumbers {Array} 联系人号码数组，如[13800138000,13800138001]
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , setRemindBirthdays: function (contactsNumbers, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("setRemindBirdays", function () { _this.setRemindBirthdays.apply(_this, arg) });
        }

    };


/* 新格式
Object
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsIndexMap: Object [新增]
    contactsMap: Object [新增]
    groupedContactsMap: Object [新增]
    groups: Array[22]
    groupsMap: Object
    lastestContacts: Array[50]
    map: Array[137]
    vip: Object [新增]
*/

/*  旧格式
Object
    ContactsMap: Array[603322342]
    TotalRecord: 2733
    Vip: Array[1]  [未迁移]
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsHasRecord: Object
    groups: Array[22]
    groupsMap: Object
    lastContactsDetail: Array[232]
    lastestContacts: Array[50]
    map: Array[137]
    strangerHasRecord: Object
    userSerialId: undefined
    vipDetails: Object
*/

    $.extend(M2012.MatrixVM.prototype, {

        attacthContactMethod: function() {
            $.extend(window.Contacts, _syncMethods);
            $.extend(window.Contacts, _asyncMethods);
        }

    })

})(jQuery, _, M139);

