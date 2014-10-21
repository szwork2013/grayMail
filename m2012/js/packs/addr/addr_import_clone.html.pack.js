CVSKeys={
    "姓":["姓氏"],
    "名":["名字","姓名"],
    "常用邮箱一":["电邮地址","电子邮件地址","邮件地址"],
    "常用邮箱二":["电邮地址2"],
    "常用手机一":["手机","移动电话"],
    "常用手机二":[],
    "常用电话一":["主要电话","联系电话"],
    "常用传真":["商务传真"],
    "组名":[],
    "昵称":["名称","昵称"],
    "街道(详细)":["住宅街道","住宅所在街道"],
    "家庭地址":["住宅街道","联系地址"],
    "邮政编号(详细)":["住宅邮编","住宅所在地的邮政编码","邮政编码"],
    "固话(详细)":["住宅电话"],
    "传真(详细)":["住宅传真","传真","传真电话"],
    "备注":["附注"],
    "公司名称":["公司"],
    "职务":["职务"],
    "商务手机":[],
    "商务固话":["商务电话","公司电话","公司电话"],
    "商务传真":["商务传真"],
    "商务邮箱":["邮件地址2"],
    "公司主页":[],
    "街道(商务)":["商务街道"],
    "公司地址":["商务街道","公司地址"],
    "邮政编码(商务)":["商务邮编","公司邮政"],
    "个人主页":["网页","个人主页","主页地址"],
    "其它主页":[],
    "QQ":["QQ"],
    "MSN":["MSN"],
    "其它聊天工具":[]
};
var titles139=["姓","名","常用邮箱一","常用邮箱二","常用手机一","常用手机二",
                "常用电话一","常用传真","组名","昵称","街道(详细)","家庭地址",
                "邮政编号(详细)","固话(详细)","传真(详细)","备注","公司名称",
                "职务","商务手机","商务固话","商务传真","商务邮箱","公司主页",
                "街道(商务)","公司地址","邮政编码(商务)","个人主页","其它主页",
                "QQ","MSN","其它聊天工具","性别","生日"];
var titleCache={};
function getTitleMatch139Title(titles,title139){
    if(titleCache[title139])return titleCache[title139];
    var arr=CVSKeys[title139];
    var result="";
    for(var i=0;i<arr.length;i++){
        var index=titles.indexOf(arr[i]);
        if(index>=0){
            result=titles[index];
            break;
        }
    }
    titleCache[title139]=result;
    return result;
}

Array.prototype.indexOf=function(obj){
    for(var i=0,len=this.length;i<len;i++){
        if(this[i]==obj)return i;
    }
    return -1;
}
String.prototype.fm=function(){
    return this.replace(/,/g,"，").replace(/^\s+|\s+$/g,"");
}


var CsvTitles;
function parseCsvAddr(cvsData){
    var lines=cvsData.split(/\r?\n/);
    var friendly=true;
    if(lines[0].indexOf("\"")!=0){
        friendly=false;
        CsvTitles=lines[0].split(",");
    }else{
        CsvTitles=eval("["+lines[0]+"]");
    }
    var result=[],dataRow,dataObj;
    //result[0]=titles139.toString();
    for(var i=1,len=lines.length;i<len;i++){
        if(friendly){
            dataRow=eval("["+lines[i]+"]");
        }else{
            dataRow=lines[i].split(",");
        }
        dataObj=new CsvDataRow();
        for(var j=0,jlen=CsvTitles.length;j<jlen;j++){
            dataObj[CsvTitles[j]]=dataRow[j];
        }
        if(!dataObj.formated)dataObj.format();
        result.push(dataObj);
    }
    return result;
}
function isRealData(dataString){
    if(dataString.indexOf("\"名称\",\"名字\"")==0){
        return true;
    }
    return false;
}
function CsvDataRow(){

}
CsvDataRow.prototype.format=function(){
    var This=this;
    $(titles139).each(
        function(){
            var title=getTitleMatch139Title(CsvTitles,this)
            This[this]=title?This[title]:"";
        }
    );
    this.formated=true;
}
CsvDataRow.prototype.toString=function(){
    var This=this;
    //if(!this.formated)this.format();
    var result=[];
    $(titles139).each(function(){
        var str=This[this];
//        //组名设置成邮件地址
//        if(this=="组名"){
//            str=mailID;
//        }
        result.push(str?str.fm():"");
    });
    return result.join(",");
}


function createXmlDomFromString(xml){
    if(window.ActiveXObject){
        var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(xml);
    }else{
        var parser=new DOMParser();
        var xmlDoc=parser.parseFromString(xml,"text/xml");
    }
    return xmlDoc;
}

//用jquery解析xml文档
function parse163Addr(xml, account){
    if(typeof xml == "string")xml=createXmlDomFromString(xml);
    //获得组
    var groupList=$(xml).find("boolean[name='reserved']").parent();
    var group=[];
    group.getGroupById=function(id){
        for(var i=0;i<this.length;i++){
            if(this[i].id==id)return this[i].name;
        }
        return "";
    }
    groupList.each(
        function(){
            group.push(
                {
                    id:getChildText(this,"string","id"),
                    name:getChildText(this,"string","name")
                }
            );
        }
    )
    //获得通讯录项
    var list=$(xml).find("array object array")[0];
    var result=[];
    $("object",list).each(function(){
        var item=new CsvDataRow();
        var tmp;
        item["姓"]="";
        item["名"]=getChildText(this,"string","FN");
        item["常用邮箱一"]   = getChildText(this,"string","EMAIL;PREF");
        item["商务邮箱"]     = getChildText(this,"string","EMAIL;BAK1");
        item["常用邮箱二"]   = getChildText(this,"string","EMAIL;BAK2");
        item["常用手机一"]=getChildText(this,"string","TEL;CELL");
        if (item["常用手机一"] == "") {
            item["常用手机一"] = searchChild(this, "X-VCARD3-TEL");
        }

        item["常用传真"]=getChildText(this,"string","TEL;WORK;FAX");
        item["组名"]= account; //(tmp=$(this).find("array[name='groups'] string")).length>0?group.getGroupById($(tmp[0]).text()):"";
        item["昵称"]=getChildText(this,"string","FN");
        item["家庭地址"]=getChildText(this,"string","ADR;HOME");
        item["邮政编号(详细)"]=getChildText(this,"string","PC;HOME");
        item["固话(详细)"]=getChildText(this,"string","TEL;HOME;VOICE");
        item["传真(详细)"]=getChildText(this,"string","TEL;WORK;FAX");
        item["备注"]=getChildText(this,"string","ZS");
        item["公司名称"]=getChildText(this,"string","ORGNAME");
        item["职务"]=getChildText(this,"string","TITLE");
        item["商务手机"]=getChildText(this,"string","TEL;CELL");
        item["商务固话"]=getChildText(this,"string","TEL;WORK;VOICE");
        item["商务传真"]=getChildText(this,"string","TEL;WORK;FAX");
        item["公司地址"]=getChildText(this,"string","ADR;WORK");
        item["邮政编码(商务)"]=getChildText(this,"string","PC;WORK");
        item["生日"]=getChildText(this,"date","BDAY");
        item["QQ"]=(tmp=getChildText(this,"string","ICQ")).indexOf("qq:")>=0?tmp.replace(/^.*?qq:(\d+).*?$/,"$1"):"";
        item["MSN"]=(tmp=getChildText(this,"string","ICQ")).indexOf("msn:")>=0?tmp.replace(/^.*?msn:([^;]+).*?$/,"$1"):"";
        result.push(item);
    })
    return result;

    function searchChild(node, key) {
        return $(node).children("*[name*=" + key + "]").text();
    }

	//返回xml元素子节点的文本，如不存在返回""
	function getChildText(node,tagName,attrVale){
		var result=$(node).find(tagName+"[name='"+attrVale+"']");

		if (result.length == 0) {
			return "";
		}

		result = result.text();

		if (result.indexOf("\n")>-1){
			//result = '"'+result+'"';  //TODO:这样修改需要服务端也做相应的修改，暂后。
			result = result.replace(/[\r\n]/g, "");
		}

		return result;
	}
}

function parseSohuAddr(text, account){
    var fieldmap =
        {"昵称":"姓"
        ,"电子邮件地址":"常用邮箱一"
        ,"移动电话":"常用手机一"
        ,"商务电话":"商务固话"
        ,"商务传真":"商务传真"
        ,"住宅电话":"常用电话一"
        ,"公司所在地的邮政编码":"邮政编码(商务)"
        ,"个人网页":"个人主页"
        ,"公司所在街道":"公司地址"
        ,"家庭所在街道":"家庭地址"
        ,"家庭所在地的邮政编码":"邮政编号(详细)"
        ,"附注":"备注"
    };
    var rows = text.split("\n");
    var contacts = [];

    //得到头部标题
    var title = []; 
    var row = rows.shift();
    row = row.split(",");
    for(var i=0; i<row.length; i++){
        title[i] = row[i];
    }
    //得到所有数据
    while(rows.length > 0 && row!=""){
        row = rows.shift();
        row = row.split(",");
        var obj = {};
        for(var i=0; i<row.length; i++){
            obj[title[i]]=row[i];
        }
        contacts.push(obj);
    }

    //根据映射关系得到139标准格式
    while(contacts.length>0){
        row = contacts.shift();        
        var obj=new CsvDataRow();
        for(var field in fieldmap){
            obj[fieldmap[field]] = row[field];
        }
        obj["组名"] = account;
        rows.push(obj);
    }    
    return rows;
}
function parse21cnAddr(text, account){
    var fieldmap =
        {"姓名":"姓"
        ,"电子邮件地址":"常用邮箱一"
        ,"生日":"生日"
        ,"性别":"性别"
        ,"QQ":"QQ"
        ,"MSN":"MSN"
        ,"手机":"常用手机一"
        ,"公司电话":"商务固话"
        ,"住宅电话":"常用电话一"
        ,"公司":"公司名称"
        ,"邮政编码":"邮政编码(商务)"
        ,"个人主页":"个人主页"
        ,"联系地址":"公司地址"
        ,"昵称":"昵称"
        ,"附注":"备注"
    };
    var rows = text.split("\n");
    var contacts = [];

    //得到头部标题
    var title = []; 
    var row = rows.shift();
    row = row.split(",");
    for(var i=0; i<row.length; i++){
        title[i] = row[i];
    }
    //得到所有数据
    while(rows.length > 0 && row!=""){
        row = rows.shift();
        row = row.split(",");
        var obj = {};
        for(var i=0; i<row.length; i++){
            obj[title[i]]=row[i];
        }
        contacts.push(obj);
    }

    //根据映射关系得到139标准格式
    while(contacts.length>0){
        row = contacts.shift();
        if (!row["姓名"]) continue;
        var obj=new CsvDataRow();
        for(var field in fieldmap){
            obj[fieldmap[field]] = row[field];
        }
        obj["组名"] = account;
        rows.push(obj);
    }    
    return rows;
}

function parsetomAddr(text, account){
    var fieldmap =
        {"姓名":"姓"
        ,"邮件地址":"常用邮箱一"
        ,"生日":"生日"
        ,"ICQ":"QQ"
        ,"MSN":"MSN"
        ,"移动电话":"常用手机一"
        ,"公司电话":"商务固话"
        ,"公司地址":"公司地址"
        ,"联系电话":"常用电话一"
        ,"传真电话":"商务传真"
        ,"公司":"公司名称"
        ,"公司邮政":"邮政编码(商务)"
        ,"邮政编码":"邮政编号(详细)"
        ,"主页地址":"公司主页"
        ,"联系地址":"家庭地址"
    };
    text = text.replace(/[\"\;]/g, "");
    var rows = text.split("\n");
    var contacts = [];

    //得到头部标题
    var title = []; 
    var row = rows.shift();
    row = row.split(",");
    for(var i=0; i<row.length; i++){
        title[i] = row[i];
    } 
    //得到所有数据
    while(rows.length > 0){
        row = rows.shift();
        row = row.split(",");
        var obj = {};
        for(var i=0; i<row.length; i++){
            obj[title[i]]=row[i];
        }
        contacts.push(obj);
    }

    //根据映射关系得到139标准格式
    while(contacts.length>0){
        row = contacts.shift();
        if (row["姓名"] == undefined || row["姓名"].length==0) continue;
        var obj=new CsvDataRow();
        for(var field in fieldmap){
            obj[fieldmap[field]] = row[field];
        }
        obj["组名"] = account;
        rows.push(obj);
    }

    return rows;
}

(function ($, _, M) {

var superClass = M.Model.ModelBase;
var _class = "M2012.Addr.Model.Import.Common";

function getDelay() {
    return Math.floor(Math.random() * 4500) + 1500;
}

/**
* 导入公共模型
*/
M.namespace(_class, M.Model.ModelBase.extend({

    name: _class,
    timer: false,

    initialize: function() {
        return superClass.prototype.initialize.apply(this, arguments);
    },

    eventHandler : function(result, options) {
        function onload() {
            options.success.call(options, { batchid: options.batchid });
            top.$App.off("contactLoad", onload);
        }

        function onerror() {
            if (_.isFunction(options.error)) {
                options.error.call(options, result);
            }
        }

        var _this = this;
        var batchOperId = options.batchid;
        _this.logger.debug("querystatus", result);

        if (result.status !== 200) {
            onerror();
            return;
        }

        var responseData = result.responseData;

        if (responseData.ResultCode == "0") {
            //0:完成1:处理中2:失败 3:超时失效 5 批次不存在 32769 处理中
            var status = responseData["LoadStatus"];
            var isCancel = false;

            if (_.isFunction(options.process)) {
                isCancel = options.process.call(options, status, responseData, batchOperId);
            }

            if (isCancel) {
                window.clearTimeout(_this.timer);
                return;
            }

            if (status === "0") {
                window.clearTimeout(_this.timer);

                top.$App.on("contactLoad", function () {
                    //重新点击导入按键时，原window已被删除，此时window对象应做判断，防止出现undefined
                    if (window) {
                        setTimeout(function () {
                            onload();
                        }, 2000);
                    }
                });
                top.$App.trigger("change:contact_maindata");
                
            } else if (status === "1" || status === "32769") {
                //使用setTimeout是为了做到第一个请求回来后，才延时下一个请求，而且每次请求的间隔都是随机的
                _this.timer = window.setTimeout(function() {
                    _this.getStatus({ batchid: options.batchid, callback: function(result) {
                        _this.eventHandler(result, options);
                    }});
                }, getDelay());

            } else {
                onerror();
            }
        } else {
            onerror();
        }
    },

    queryStatus: function(options) {
        var _this = this;
        _this.getStatus({batchid: options.batchid, callback: function(result) {
            _this.eventHandler(result, options);
        }});
    },


    getStatus: function(options) {
        var api = "/addrsvr/GetBatchOperStatus";
        var params = {
            sid: top.sid,
            formattype: "json",
            rnd: Math.random()
        };

        var url = top.$Url.makeUrl(api, params);
        var data = {
            GetBatchOperStatus: {
                BatchOperId: options.batchid
            }
        };

        top.M2012.Contacts.API.call(url, data, function(result){
             options.callback(result);
        });
    }

}));

})(jQuery, _, M139);

;
(function ($, _, M) {

    function parseAddressData(text, domain, account) {

        var result = false;
        switch (domain) {
            case "@163.com": case "@yeah.net":
                result = parse163Addr(text, account);
                break;
            case "@21cn.com":
                result = parse21cnAddr(text, account);
                break;
            case "@tom.com":
                result = parsetomAddr(text, account);
                break;
            case "@sohu.com":
                result = parseSohuAddr(text, account);
                break;
            case "@126.com":
                return text;
                break;
        }

        if (result) {
            return titles139 + "\r\n" + result.join("\r\n");
        }
        return "";
    }

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Import.Clone";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        //@gmail.com暂时先屏蔽
        defaults: { domains: ["@163.com", "@126.com", "@yeah.net", "@sohu.com", "@21cn.com"] },
        EVENTS: {
            IMPORT: "clone:start",
            FETCH: "clone:fetch",
            FETCHED: "clone:fetched",
            FETCHFAIL: "clone:fetchfail",
            ADD: "clone:add",
            ADDED: "clone:added",
            ADDFAIL: "clone:addfail",
            RELOAD: "clone:reload",
            RELOADFAIL: "clone:statuserror"
        },

        initialize: function () {
            superClass.prototype.initialize.apply(this, arguments);

            var _this = this;
            _this.model = new M2012.Addr.Model.Import.Common();
            _this.bind('change:status', function (model, value, changes) {
                _this.logger.debug('status changing', arguments);
                if (value === 'import') {
                    model.fetch();
                }
            });
        },

        validate: function (attributes) {
            var errMsg = false;

            if (_.isEmpty(attributes.password)) {
                errMsg = { "field": "password", "tipid": "warn_passwordempty" };
            }

            if (_.isEmpty(attributes.account)) {
                errMsg = { "field": "account", "tipid": "warn_noaccount" };
            }

            if (errMsg) {
                return errMsg
            }
        },
        
        fetch: function() {
            var _this = this;
            var domain = _this.get('domain');

            if (domain == "@sohu.com" || domain == "@21cn.com") {
                var api = "/sharpapi/addr/matrix/banjia/getaddress.aspx";
                var params = {
                    sid: top.$App.getSid()
                };

                var url = top.$Url.makeUrl(api, params);

                var account = _this.get('account');

                var mailid = account + domain;

                var param = $.param({ mailID: mailid, password: _this.get('password') });

                _this.trigger(_this.EVENTS.FETCH);
                try {
                    top.$RM.call(url, param, function (e) {
                        _this.trigger(_this.EVENTS.FETCHED);
                        var response = $.trim(String(e.responseText));

                        if (_.isEmpty(response) || response == "FA_UNAUTHORIZED" || response == "FA_CLONE_ERROR") {
                            _this.logger.error("抓取其他邮箱失败|" + mailid);
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            return;
                        }

                        _this.logger.info("抓取其他邮箱成功", response.substring(0, 100));
                        _this.fetchBH(domain);
                        var contactData = parseAddressData(response, domain, mailid);

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.clone(contactData, mailid);

                    },
                    {
                        requestDataType: "Nothing",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        error: function (err) {
                            //404可能是服务端报错，或者会话过期
                            //500+是服务端错误
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            _this.logger.error('fetch failed|status=' + err.status, err.responseText);
                        }
                    });
                } catch (ex) {
                    _this.trigger(_this.EVENTS.FETCHFAIL);
                }
            }

            else if (domain == "@163.com" || domain == "@126.com" || domain == "@yeah.net") {
                var api = "wangyisync";
                var account = _this.get('account');
                var mailid = account + domain;
                var param = $.param({ account: mailid, password: _this.get('password') });

                _this.trigger(_this.EVENTS.FETCH);
                try {
                    top.M2012.Contacts.API.call(api, param, function (result) {
                        _this.trigger(_this.EVENTS.FETCHED);

                        if (!result) {
                            _this.logger.error("抓取其他邮箱失败|" + mailid);
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            return;
                        }

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.fetchBH(domain);
                        _this.trigger(_this.EVENTS.ADD);
                        var rs = result.responseData;
                        if (rs && rs.code == "S_OK") {
                            _this.trigger(_this.EVENTS.ADDED);
                            var _batchid = rs.CCBatchID;
                            _this.logger.info('clone success|batchid=' + _batchid);

                            _this.model.queryStatus({
                                batchid: _batchid,
                                success: function () {
                                    _this.trigger(_this.EVENTS.RELOAD);
                                    _this.set({ batchid: _batchid });
                                },
                                error: function (args) {
                                    _this.logger.error('clone fail|batchid=' + _batchid);
                                    _this.trigger(_this.EVENTS.RELOADFAIL, args);
                                    _this.set({ status: 'imported' }, { silent: true });
                                }
                            });
                        } else {
                            _this.trigger(_this.EVENTS.ADDFAIL, result);
                            _this.set({ status: 'imported' }, { silent: true });
                        }
                    },
                    {
                        httpMethod: "get",
                        error: function (err) {
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            _this.logger.error('fetch failed|status=' + err.status, err.responseText);
                        }
                    });
                }
                catch (ex) {
                    _this.trigger(_this.EVENTS.FETCHFAIL);
                }
            }
        },

        clone: function (data, mailid) {
            var _this = this;
            function onload() {
                top.$App.off("contactLoad", onload);
            }

            _this.trigger(_this.EVENTS.ADD);
            top.M2012.Contacts.API.cloneContacts({
                params: {
                    CloneContacts: {
                        Account: mailid,
                        Merge: _this.get("repeatmodel"),
                        ContactData: data
                    }
                },
                callback: function (res) {
                    var rs = res.responseData;
                    if (rs && rs.code == "S_OK") {
                        _this.trigger(_this.EVENTS.ADDED);
                        var _batchid = rs.summary;
                        _this.logger.info('clone success|batchid=' + _batchid);

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.model.queryStatus({
                            batchid: _batchid,
                            success: function () {
                                _this.trigger(_this.EVENTS.RELOAD);
                                _this.set({ batchid: _batchid });
                            },
                            error: function(args) {
                                _this.logger.error('clone fail|batchid=' + _batchid);
                                _this.trigger(_this.EVENTS.RELOADFAIL, args);
                                _this.set({ status: 'imported' }, { silent: true });
                            }
                        });
                    } else {
                        _this.trigger(_this.EVENTS.ADDFAIL, res);
                        _this.set({ status: 'imported' }, { silent: true });
                    }
                }
            });
        },

        fetchBH: function (domain) {
            switch (domain) {
                case "@163.com": top.BH("163fetch");
                    break;
                case "@126.com": top.BH("126fetch");
                    break;
                case "@yeah.net": top.BH("yeahfetch");
                    break;
                case "@gmail.com": top.BH("gmailfetch");
                    break;
                case "@21cn.com": top.BH("21cnfetch");
                    break;
                case "@sohu.com": top.BH("sohufetch");
                    break;
            }
        }

    }));

})(jQuery, _, M139);


(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.Clone";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].clone;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#pnlclone",

        TIP: {
            EMAIL: '请输入邮箱帐号',
            PASSWORD: '请输入邮箱密码'
        },

        logger: new M139.Logger({ name: _class }),

        initialize: function () {
            this.model = new M2012.Addr.Model.Import.Clone();
            this.initEvents();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvents: function () {
            var _this = this;

            _this.on("print", function () {
                _this.logger.debug("printing..."); //启动

                var title = _this.model.defaults.domains;
                var items = [];
                for (var i = 0; i < title.length; i++) {
                    items.push({ text: title[i], value: title[i] });
                }

                _this.logger.debug("init domain list", title);

                var defaultText = items[0].text;
                _this.model.set({ domain: defaultText }, { silent: true });

                var obj = $("#domainlist");
                var dropMenu = M2012.UI.DropMenu.create({
                    "defaultText": defaultText,
                    "menuItems": items,
                    "container": obj,
                    "width": "120px"
                });

                dropMenu.on("change", function (item) {
                    _this.model.set({ domain: item.value }, { silent: true });
                    _this.logger.debug("domain selected", _this.model.get("domain"), item);
                });
            });

            _this.$("#btnClone").click(function (e) {
                if(_this.check()){
                    var frm = document.frmClone;
                    var account = frm.account.value;
                    var pwd = frm.password.value;
                    var repeatmodel = $(frm.repeatmodel).filter(':checked').val();
                    _this.model.set({ status: 'import', account: account, password: pwd, repeatmodel: repeatmodel });
                    top.BH('addr_importClone_clone');
                }
            });

            _this.$('#account,#password').focus(function(){
                $('#tipWrap').hide();
            });

            _this.$("#goBack").click(function(){
                _this.back(_this);
            });

            _this.$("#btnCancel").click(function() { 
                _this.cancel(_this); 
                top.BH('addr_importClone_cancel');
            });

            _this.model.bind("error", function (model, err) {
                if (err) {
                    var msg = PageMsg[err.tipid];
                    if (_.isEmpty(msg)) {
                        msg = PageMsg["fail_other"];
                    }

                    top.$Msg.alert(msg, { onclose: function () {
                        if (err.field) {
                            $("#" + err.field).focus();
                        }
                    }, icon: "warn"
                    });
                    this.logger.debug("has error." + err);
                }
            });

            _this.model.bind("change:batchid", function (model) {
                //导入成功页跳转
                top.BH('addr_importClone_success');                
                window.location.href = ["http://", top.location.host, "/m2012/html/addr/addr_importresult.html?sid=", top.sid, "&bid=", model.get("batchid"), "&from=importClone"].join("");                
            });

            var EVENT = _this.model.EVENTS;
            _this.model.bind(EVENT.FETCH , function () {
                top.M139.UI.TipMessage.show("正在抓取……");
                _this.processing = true;
            });

            _this.model.bind(EVENT.FETCHFAIL , function (err) {
                top.M139.UI.TipMessage.show("抓取失败", { delay: 3000 });
                if (_this.dialog) { _this.dialog.close() }
                if (err && err.tipid)
                    top.$Msg.alert(PageMsg[err.tipid]);
                else
                    top.$Msg.alert("未知错误");
                _this.processing = false;
            });

            _this.model.bind(EVENT.ADD , function () {
                top.M139.UI.TipMessage.show("正在导入……");
            });

            _this.model.bind(EVENT.ADDED , function () {
                top.M139.UI.TipMessage.show("已导入，正在刷新联系人……");
            });

            _this.model.bind(EVENT.ADDFAIL, function (res) {
                top.M139.UI.TipMessage.show("导入失败", { delay: 5000 });
                if (_this.dialog) { _this.dialog.close() }

                var FF = top.FloatingFrame;
                var msg = "导入失败";
                var rs = res.responseData;
                if (rs) {
                    //if (!_.isEmpty(rs.summary)) {
                    //    msg = rs.summary;
                    //}
                    if (rs.code == "ER_OVER_LIMIT") {
                        //msg = rs.summary; 
                        //与导入本地联系人同步 
                        var contactsNumLimit = top.Contacts.getMaxContactLimit();
                        if (contactsNumLimit == 3000) {
                            msg = "联系人数量已达上限3000，<a href='javascript:void(0);' onclick='top.$App.showOrderinfo()' style='color:#0344AE'>升级邮箱</a>添加更多！";
                        }
                        else {
                            msg = "联系人数量已达上限{0}".format(contactsNumLimit);
                        }
                    } else if (rs.code == "ER_NOT_ENOUGH") {
                        msg = rs.summary;
                    } else if (rs.errorCode == "105") { msg = "SID为空"; }
                    else if (rs.errorCode == "106") { msg = "SID失效"; }
                    else if (rs.errorCode == "800") { msg = "参数缺失"; }
                    else if (rs.errorCode == "801") { msg = "用户名密码错误"; }
                    else if (rs.errorCode == "802") { msg = "请求处理中"; }
                    else if (rs.errorCode == "803") { msg = "网络暂时无应答"; }
                    else if (rs.summary && $.trim(rs.summary) != "") { msg = rs.summary; }
                }

                //top.$Msg.alert(msg);
                FF.alert(msg);
                _this.processing = false;
            });

            _this.model.bind(EVENT.RELOAD, function () {
                top.M139.UI.TipMessage.show("导入完成", { delay: 3000 });
                _this.processing = false;
            });

            $(window).on('unload', function() {
                if (_this.dialog) { _this.dialog.close() }
            });

            $(document.frmClone.repeatmodel).click(function(){
                if($(this).val() == "1"){
                    top.BH('addr_importClone_ignore');
                }else{
                    top.BH('addr_importClone_replace');
                }
            });

            top.BH('addr_pageLoad_import');
        },

        check: function(){
            var returnValue = true;         
            var frm = document.frmClone;
            var account = $.trim(frm.account.value);
            var pwd = $.trim(frm.password.value);

            if(!account.length){
                this.showTip(this.TIP.EMAIL, $(frm.account));
                returnValue = false;
            }

            if(returnValue && !pwd.length){
                this.showTip(this.TIP.PASSWORD, $(frm.password));
                returnValue = false;
            }

            return returnValue;
        },
        showTip: function(text, dom){
            var height = 30;
            var offset = dom.offset();
            var sTop = offset.top - height;

            $('#tipContent').text(text);
            $('#tipWrap').show().css({left: offset.left, top: sTop});
        },

        back: function () {
            //返回
            setTimeout(function () {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
            return false;
        },

        cancel: function (_this) {
            if (_this.processing) {
                _this.dialog = top.$Msg.confirm(PageMsg['warn_whencancel'], function () {
                    _this.model.set({ status: "cancel" }, { silent: true });
                    _this.back();
                    top.M139.UI.TipMessage.show("导入取消", { delay: 3000 });
                    _this.dialog = false;
                }, null, null, { isHtml: true });
            } else {
                _this.back();
            }
            return false;
        }

    }));

    $(function () { new M2012.Addr.View.Import.Clone(); });

})(jQuery, _, M139);

