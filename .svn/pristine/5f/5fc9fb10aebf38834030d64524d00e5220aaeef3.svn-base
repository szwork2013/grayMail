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