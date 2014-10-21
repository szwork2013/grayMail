/*
 * Copyright (c) 2009, RICHINFO Technology Center. All Rights Reserved.
 *
 * developer       time             version        description
 * ------------    -----------      ----------     ----------------
 * niliang         2009.03.30         1.0
 * 
 */

/***********************************************
 This file is the merge contact module script.
 ************************************************/

//Global base data
var BloodArray=[['A型','A型'],['B型','B型'],['AB型','AB型'],['O型','O型'],['其他','其他'],['血型','-1']];
var ConstellationArray=[['牡羊','牡羊'],['金牛','金牛'],['双子','双子'],['摩羯','摩羯'],['巨蟹','巨蟹'],['狮子','狮子'],
                        ['天秤','天秤'],['天蝎','天蝎'],['射手','射手'],['水瓶','水瓶'],['双鱼','双鱼'],['处女','处女'],['星座','-1']];
var tableArray = ["姓 名","电子邮箱","商务邮箱","手机号码","商务手机","所属分组",
    "昵 称","性 别","生 日","星座","血型","飞信号码","MSN","个人主页","备 注",
    "常用固话","家庭地址",
    "公司名称","职 务","公司固话","传真号码","公司地址","公司邮编","公司主页"];
var contactKey  = ["name","FamilyEmail","BusinessEmail","MobilePhone","BusinessMobile","GroupId",
    "AddrNickName","UserSex","BirDay","StartCode","BloodCode","OtherIm","MSN","PersonalWeb","Memo",
    "FamilyPhone","FamilyAddress",
    "CPName","UserJob","BusinessPhone","BusinessFax","CompanyAddress","CPZipCode","CompanyWeb"];
var gContactsGroups;//用户组信息
var gOldContactsDetails=[];//重复联系人原始数组(不操作)
var gMergedContactsDetails = {};//合并后的联系人对象（可操作）,用于右侧显示
var gUseContactsDetails=[];//当前使用的联系人数组，用于左侧显示
var gUnUseContactsDetails=[];//暂不合并联系人数组
var gTemplateContactsDetails={};//当前使用的联系人模板
var gContactsObject = window.top.Contacts;//通讯录对象
var gRepeatIdList;//重复组id列表


//Global msg 
var msgRepeatContactEmptyErr = "未找到重复联系人";
var msgMergeContactSaveErr = "系统繁忙，请稍后重试";
var msgMergeContactSuccess = "第{0}组联系人合并成功";
var msgMergeContactFinish = "{0}组联系人合并成功";
var msgNeedTwo="合并时，需至少保留2个联系人数据";
var msgIsLastGroup="您确定不处理最后一组联系人，直接返回通讯录首页？";
var msgUnMerge="已跳过合并第{0}组重复联系人";
var msgMergeAllConfirm="如果遇到以下信息，将保留较新的资料，包括：姓名、性别、头像。联系人的其他信息，将会叠加保留。您确定要全部合并吗？";
var msgLoadingData="数据加载中，请稍候......";

var back = (function(d){
    return (function(url, b){
        /*
        $D.storage.remove("mail139_addr_homedata");
        url = "addr_index.html";
        b = d.createElement("a");
        if (b.click) {
            b.href = url;
            d.body.appendChild(b);
            b.click();
        } else {
            b = d.createElement("META");
            b.httpEquiv="refresh";
            b.content="0;url=" + url; 
            d.getElementsByTagName("head")[0].appendChild(b);
        }
        */
        setTimeout(function() {
            if(top.$Addr){                
                var master = top.$Addr;                
                master.trigger(master.EVENTS.LOAD_MAIN);
            }else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);
    });
})(document);

function IsEmpty(code) {
    if(typeof( code ) == "undefined" || code == null || code.length == 0) return true;
    return false;
}
function getQueryString(param,url){
    if(!url){
	    url=location.search;
    }
    var svalue = url.match(new RegExp("[?&]" + param + "=([^&]*)","i"));
    return svalue ? unescape(svalue[1]) : null;
}

function deepClone(source){
	if(source===null){return null;}
	if(source===undefined){return undefined;}
	if(typeof(source)!='object'){return source;}
	if(source.constructor==Array){
		var ret = [];
		for(var i=0;i<source.length;i++){ret[i] = arguments.callee(source[i]);}
	}else{
		var ret = {};
		for(var d in source){ret[d] = arguments.callee(source[d]);}
	}
	return ret;
}
function htmlEncode(text){
	return top.$T.Html.encode(text);
}

//编辑联系人模块   
var MergeContactsModule={
    groupCount:0,//重复的组数
    contactCount:0,//重复联系人数量
    successCount:0,//合并成功的组数量
    groupIndex:0,//当前组的索引，用来标识当前是第几组
    
    initPage: function(){
        //获取联系人组信息
        try{
            gContactsGroups = gContactsObject.data.groups;
        }catch(e){}
        
        //手动在首页指定合并
        var contactSerialId = getQueryString("serialId");
        if (contactSerialId && contactSerialId.length>0) {
            gRepeatIdList = [contactSerialId.split('|')];
            if(gRepeatIdList.length > 0){
                MergeContactsModule.getContactDetail(gRepeatIdList[0]);//获取组内联系人资料
            }else{
                top.FloatingFrame.alert(msgRepeatContactEmptyErr, back);
            }
            return;
        }

        try{
           top.M139.UI.TipMessage.show(msgLoadingData);

		   gContactsObject.getRepeatContacts(function(result){
                if(result.success){
                    gRepeatIdList = result.list;
                    MergeContactsModule.groupCount=result.list.length;  
                    for(var i=0;i<MergeContactsModule.groupCount;i++)
                    {
                        MergeContactsModule.contactCount +=result.list[i].length;
                    }                  
                    MergeContactsModule.setRepeatGroupInfo(MergeContactsModule.groupCount,MergeContactsModule.contactCount);
                    if(gRepeatIdList.length > 0){
                        if(gRepeatIdList.length==1)//只有一组联系人，显示为保存
                        {
                            $("#labelMergeAndGoToNext").text("保存");
                        }
                        MergeContactsModule.getContactDetail(gRepeatIdList[0]);//获取组内联系人资料
                    }else{
                        top.$Msg.alert(msgRepeatContactEmptyErr, { onclose: back, isHtml: true });
                    }
                    //成功加载合并页面
                     top.addBehaviorExt({actionId:30176,thingId:0,moduleId:14});
                     top.M139.UI.TipMessage.hide();
                }else{
                    top.FloatingFrame.alert(result.msg);
                }
            });
        }catch(e){top.FloatingFrame.alert(msgMergeContactSaveErr);top.WaitPannel.hide();}
        
        MergeContactsModule.bindEvent();
    },
    //绑定页面事件
    bindEvent:function(){
        //全部合并
        $("#aMergeAllContacts").attr("href","javascript:MergeContactsModule.mergeAllContacts();");
        //跳过
        $("#aGoToNext").attr("href","javascript:MergeContactsModule.goToNextEvent();");
        //合并，并处理下一组
        $("#aMergeAndGoToNext").attr("href","javascript:MergeContactsModule.mergeAndGoToNextEvent();");
        //返回
        $("#aBack_Up,#aBack_Down").attr("href","javascript:back();");
        //全部合并
        $("#aMergeAll_Up,#aMergeAll_Down").attr("href","javascript:MergeContactsModule.mergeAllContacts();");
        //撤消或撤消上一次
        $("#aUndoPrev").attr("href","javascript:MergeContactsModule.undoPrev();");
        //全部撤消
        $("#aUndoAll").attr("href","javascript:MergeContactsModule.undoAll();");
    },
    //跳过
    goToNextEvent:function()
    {
	top.BH("addr_merge_skip");
        if(MergeContactsModule.groupIndex==gRepeatIdList.length-1)//已经是最后一组
        {
            if(MergeContactsModule.successCount>0)//有合并成功的记录，则提示几组合并成功并跳到首页
            {
                top.FF.alert(msgMergeContactFinish.format(MergeContactsModule.successCount), back);
            }
            else
            {
                top.FF.confirm(msgIsLastGroup, back);
            }
            return ;
        }
        $("#aGoToNext").attr("href","javascript:");
        $("#divUndoMessage").hide();
        gUnUseContactsDetails=[];
        gUseContactsDetails=[];
        gMergedContactsDetails={};
        MergeContactsModule.groupIndex++;
        $("#spanGroupIndex").html(MergeContactsModule.groupIndex+1);
        if(MergeContactsModule.groupIndex==gRepeatIdList.length-1)//已经是最后一组，显示为保存
        {
            $("#labelMergeAndGoToNext").text("保存");
        }
        MergeContactsModule.showOtherMessage(msgUnMerge.format(MergeContactsModule.groupIndex));//已跳过合并第N组联系人
        MergeContactsModule.getContactDetail(gRepeatIdList[MergeContactsModule.groupIndex]);
    },
    //合并，并处理下一组
    mergeAndGoToNextEvent:function()
    {
    	top.BH("addr_merge_operNext");
        $("#aMergeAndGoToNext").attr("href","javascript:");   
        var usedSerialId=[]; 
        for(var i=0;i<gUseContactsDetails.length;i++)
        {
            usedSerialId.push(gUseContactsDetails[i]["SerialId"]);
        }

        if (/nopic/.test(gMergedContactsDetails.ImagePath)) {
            gMergedContactsDetails.ImagePath = "";
            gMergedContactsDetails.ImageUrl = "";
        }

        //合并联系人
        gContactsObject.MergeContacts(usedSerialId.join(","),gMergedContactsDetails,function(result)
        {
             if(result.success)
             {
                top.BH('addr_merge_success');
                MergeContactsModule.successCount++;
                
                if(top.$Addr){
                    var master = top.$Addr;
					
                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts', 
						actionKey: '330'
                    });
					
					setTimeout(function(){
						master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getMergeData'});
					}, 1000);                    
                }

                //如果最后一组处理完，则提示全部完成，并返回首页。
                if(MergeContactsModule.groupIndex==gRepeatIdList.length-1)
                {
                    return top.FF.alert(msgMergeContactFinish.format(MergeContactsModule.successCount), back);
                }

                MergeContactsModule.groupIndex++;
                MergeContactsModule.showOtherMessage(msgMergeContactSuccess.format(MergeContactsModule.groupIndex));//第几组联系人合并成功

                $("#spanGroupIndex").html(MergeContactsModule.groupIndex+1);
                if(MergeContactsModule.groupIndex==gRepeatIdList.length-1)//已经是最后一组，显示为保存
                {
                    $("#labelMergeAndGoToNext").text("保存");
                }
                MergeContactsModule.getContactDetail(gRepeatIdList[MergeContactsModule.groupIndex]);                
             }
             else
             {
                 //在usedSerialId中找出不符合规则的内容,20130508
                 var extMsg = result.extMsg || ""; //新增的“立即修改”链接。
                 if (extMsg) {
                     var field = result.field;
                     var contactId = usedSerialId[0]; //默认修改的SerialId
                     if (field) {
                         //查找到需要修改的对应SerialId
                         var errResult = MergeContactsModule.getErrorContactSid(usedSerialId, field);
                         contactId = errResult && errResult.sid;

                         //标记有错误的字段
                         MergeContactsModule.markErrorField(errResult);
                     }
                     var func = "top.FF.close();top.$App.show(\"addrEdit\",\"&id={0}&pageId=0\");".format(contactId); //方法名放在本文件，容易修改
                     extMsg = extMsg.format(func);
                 }
                 var msg = result.msg + extMsg;
                 top.FF.alert(msg);

                //top.FF.alert(result.msg);
             }
             $("#aMergeAndGoToNext").attr("href","javascript:MergeContactsModule.mergeAndGoToNextEvent();");
        });           
    },
    //在联系人中查找符合字段的联系人序列号SerialId
    getErrorContactSid: function (serialIds, field) {
        var result = null;
        for (var i = 0; i < serialIds.length; i++) {
            var contact = gContactsObject.getContactsById(serialIds[i]);
            console.log(contact);
            for (var k in contact) {
                if (typeof contact[k] == "string") {
                    var b = contact[k] == field;
                }
                if (contact[k] == field) {
                    result = {
                        "sid": serialIds[i],
                        "field": k
                    };
                    break;
                }
            }
            if (result) break;
        }
        if (!result) {
            console.log("serialid not found,use default!");
            result = { "sid": serialIds[0] };
        }
        return result;
    },
    markErrorField: function (options) {
        if (options) {
            var selector = "#{0}_{1}".format(options.field, options.sid); //#Key_Sid,如#MobilePhone_123456789
            console.log([selector,options]);
            $(selector).css("color", "red");//标记为红色
        }
    },
    //获取联系人详细资料
    getContactDetail: function(serialIds){
        try{
            gContactsObject.getContactsInfoById(serialIds, function(result){
                if(result.success){
                    if(!result.contacts || result.contacts.length==0)
                    {
                        return;
                    }
                    //清空数据
                    gOldContactsDetails = [];
                    gUseContactsDetails = [];
                    gUnUseContactsDetails = [];
                    
                    for(m in result.contacts){
                        gUseContactsDetails[m] = deepClone(result.contacts[m]);
                        gOldContactsDetails[m] = deepClone(result.contacts[m]);
                    }
                    gTemplateContactsDetails=gUseContactsDetails[0];
                    MergeContactsModule.fillContactListTable();//填充重复联系人列表页面
                    MergeContactsModule.removeFirstHrefEvent();
                    MergeContactsModule.mergeContactDetailData();
                    MergeContactsModule.fillMergeTable();//填充页面
                    
                }else{
                    top.FloatingFrame.alert(result.msg);
                }
                //跳过
                $("#aGoToNext").attr("href","javascript:MergeContactsModule.goToNextEvent();");
                //合并，并处理下一组
                $("#aMergeAndGoToNext").attr("href","javascript:MergeContactsModule.mergeAndGoToNextEvent();");
            });
        }catch(e){}
    },
    //全部合并
    mergeAllContacts:function()
    {	
    	top.BH("addr_merge_mergeAll");
        top.FloatingFrame.confirm(msgMergeAllConfirm, function() //确定
            {
                $("#aMergeAllContacts").attr("href","javascript:");
                gContactsObject.AutoMergeContacts(function(result){
                if (result.success){
                    top.$App.trigger("change:contact_maindata");
                    top.FloatingFrame.alert(msgMergeContactFinish.format(result.SuccNumber), back);
                    
                    if(top.$Addr){
                        var master = top.$Addr;
                            master.trigger(master.EVENTS.LOAD_MODULE, {
                                key: 'events:contacts',
                                actionKey: '331'
                            });

                        setTimeout(function(){
                            master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getMergeData'});
                        }, 1000);
                    }
                }else{
                    top.FloatingFrame.alert(result.msg);
                    MergeContactsModule.bindMergeAllEvent();
                }
            });
        });
    },
    //设置重复联系人组个数和总人数
    setRepeatGroupInfo:function(groupCount,contactCount)
    {
        $("#spanGroupCount").html(groupCount);
        $("#spanRepeatCount").html(contactCount);
    },
    //生成重复联系人列表
    fillContactListTable:function (){
        var container= $("#divRepeatContactList");
        container.empty();
        var allHtml = [];
        var singleContactData=null;
		
        for(var i = 0; i < gUseContactsDetails.length; i++){
            singleContactData=deepClone(gUseContactsDetails[i]);
            allHtml.push(MergeContactsModule.getSingleContactHtml(singleContactData));
        }
        container.html(allHtml.join(''));
    },
    //获取单个重复联系人的html
    getSingleContactHtml:function(singleContactData)
    {
        var html=[];
        html.push('<div class="box" id="contactBox_{0}">'.format(singleContactData["SerialId"]));
        html.push('<dl>');
        //头像
        //var imageUrl=MergeContactsModule.getContactImage(singleContactData["ImageUrl"]);
        var imageUrl=(new top.M2012.Contacts.ContactsInfo(singleContactData)).ImageUrl;
        html.push('<dt><a href="javascript:" title="" class="tou"><img src="{0}" width="96" height="96"></a></dt>'.format(imageUrl));
        //姓名 
        var tmpCname = htmlEncode(singleContactData["name"]);
        if(top.Contacts.IsVipUser(singleContactData["SerialId"])){
			var viptip = '<i class="user_vip" style="margin:0;float:left;margin-top:5px;_margin-top:3px;"></i>';
			html.push('<dd><h4 title="{0}" ><div style="float:left;max-width:88px;_width:88px;overflow:hidden;	white-space: nowrap;word-wrap:normal;text-overflow: ellipsis;overflow: hidden;">{1}</div>{2}</h4></dd>'.format(tmpCname,tmpCname,viptip));
		}else{
			html.push('<dd><h4 title="{0}">{1}</h4></dd>'.format(tmpCname,tmpCname));
		}
		
        //数据显示处理
        if(singleContactData["GroupId"])
        {
            html.push('<dd><strong>分组：</strong>');
            var groupNames=MergeContactsModule.getContactGroupNames(singleContactData["GroupId"]);
            if(groupNames)
            {
                var groupNameArray=groupNames.split(',');
                for(var i=0; i<groupNameArray.length;i++)
                {
                    html.push(htmlEncode(groupNameArray[i]));
                } 
            }
            html.push('</dd>');
        }
        singleContactData["UserSex"] = singleContactData["UserSex"] == "0" ? "男" : (singleContactData["UserSex"] == "1" ? "女" : "保密");
        singleContactData["FamilyAddress"] = (IsEmpty(singleContactData["ProvCode"]) ? "" : singleContactData["ProvCode"]) + 
        (IsEmpty(singleContactData["CityCode"]) ? "" : singleContactData["CityCode"]) + (IsEmpty(singleContactData["HomeAddress"]) ? "" : singleContactData["HomeAddress"]);
         singleContactData["CompanyAddress"] = (IsEmpty(singleContactData["CPProvCode"]) ? "" : singleContactData["CPProvCode"]) + 
        (IsEmpty(singleContactData["CPCityCode"]) ? "" : singleContactData["CPCityCode"]) + (IsEmpty(singleContactData["CPAddress"]) ? "" : singleContactData["CPAddress"]);
        singleContactData["StartCode"] = singleContactData["StartCode"] == "-1" ? "" : singleContactData["StartCode"];
        singleContactData["BloodCode"] = singleContactData["BloodCode"] == "-1" ? "" : singleContactData["BloodCode"];
        var filedValue='';
        //其它属性
        for(var i = 0; i < tableArray.length; i++)
        {
            if(contactKey[i]!="name" && contactKey[i]!="GroupId" && !IsEmpty(singleContactData[contactKey[i]]))
            {
                filedValue=singleContactData[contactKey[i]];
                //html.push('<dd><strong>{0}：</strong>{1}</dd>'.format(htmlEncode(tableArray[i]),htmlEncode(filedValue)));

                //加入ID，方便查找到对应的字段
                var spanId = contactKey[i] + "_" + singleContactData["SerialId"]; //以 字段_SID 命名，如：MobilePhone_123456789
                html.push('<dd><strong>{0}：</strong><span id="{1}">{2}</span></dd>'.format(htmlEncode(tableArray[i]), spanId, htmlEncode(filedValue)));
            }
        }
        html.push("</dl>");        
        if(gTemplateContactsDetails["SerialId"]!=singleContactData["SerialId"])
        {   
            html.push('<div class="btn">');
            html.push('<span><a href="javascript:MergeContactsModule.useThisContact({0})" hreftype="useThisContact" serialId="{0}">使用该联系人信息</a></span>'.format(singleContactData["SerialId"]));
            html.push('</div><a href="javascript:MergeContactsModule.unUseThisContact({0})" hreftype="unUseThisContact" title="" class="no-repeat tdu" serialId="{0}">暂不合并</a><div class="b-lt"></div><div class="b-lb"></div><div class="b-rt"></div><div class="b-rb"></div><div class="b-bx"></div><i class="i-add-cts"></i>'.format(singleContactData["SerialId"]));
        }
        else
        {   
            html.push('<div class="btn gray-disbg pray">');
            html.push('<span><a href="javascript:void();" class="gray-dis" hreftype="useThisContact" serialId="{0}">使用该联系人信息</a></span>'.format(singleContactData["SerialId"]));
            html.push('</div><a href="javascript:void();"  hreftype="unUseThisContact" title="" class="no-repeat tdu gray-ipt" serialId="{0}">暂不合并</a><div class="b-lt"></div><div class="b-lb"></div><div class="b-rt"></div><div class="b-rb"></div><div class="b-bx"></div><i class="i-add-cts"></i>'.format(singleContactData["SerialId"]));
        }
        html.push('</div>');
        return html.join('');
    },
    //合并相关联系人的数据
    mergeContactDetailData:function()
    {
        //合并后联系人数据
        gMergedContactsDetails=deepClone(gTemplateContactsDetails);

        var unUseContactsSerialId=[];
        for(var i=0;i<gUnUseContactsDetails.length;i++)
        {
            unUseContactsSerialId.push(gUnUseContactsDetails[i]["SerialId"]);
        }
        var remarks = ""; //备注
        gMergedContactsDetails["Memo"] ="";

        for(var i = 0; i < gUseContactsDetails.length; i++)
        { 
            for(key in gUseContactsDetails[i])
            {
                var fieldValue = gUseContactsDetails[i][key];
                //当前字段值为空或-1时，更新值
                if((IsEmpty(gMergedContactsDetails[key]) || gMergedContactsDetails[key]=="-1") && !IsEmpty(fieldValue))
                { 
                    gMergedContactsDetails[key]=gUseContactsDetails[i][key];
                  
                }else if(gMergedContactsDetails[key]!= fieldValue && !IsEmpty(fieldValue)){
                    switch(key){
                        case "MobilePhone": //常用手机 如果商务手机为空 则放到商务手机里
                               if(IsEmpty(gMergedContactsDetails["BusinessMobile"]) ){
                                   gMergedContactsDetails["BusinessMobile"] = fieldValue;
                                   break;
                               }
                               //与已有的号码相同则不放到备注 remarks.indexOf(keyValue == -1)
                               if(gMergedContactsDetails["BusinessMobile"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                  remarks += " 手机号码:" + fieldValue;
                               }
                               break;
                        case "BusinessMobile":
                               if(IsEmpty(gMergedContactsDetails["MobilePhone"])){
                                   gMergedContactsDetails["MobilePhone"] = fieldValue;
                                   break;
                               }
                               if(gMergedContactsDetails["MobilePhone"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                  remarks += " 商务手机:" + fieldValue;
                               }
                               break;
                               
                       case "FamilyEmail":
                               if(IsEmpty(gMergedContactsDetails["BusinessEmail"]) ){
                                   gMergedContactsDetails["BusinessEmail"] = fieldValue;
                                   break;
                               }
                               if(gMergedContactsDetails["BusinessEmail"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                   remarks += " 电子邮箱:" + fieldValue;
                               }
                               break;
                               
                      case "BusinessEmail":
                               if(IsEmpty(gMergedContactsDetails["FamilyEmail"]) ){
                                   gMergedContactsDetails["FamilyEmail"] = fieldValue;
                                   break;
                               }
                               if(gMergedContactsDetails["FamilyEmail"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                   remarks += " 商务邮箱:" + fieldValue;
                               }
                               break;
                     case "OtherPhone":
                               if(IsEmpty(gMergedContactsDetails["BusinessPhone"]) ){
                                   gMergedContactsDetails["BusinessPhone"] = fieldValue;
                                   break;
                               }
                               if(gMergedContactsDetails["BusinessPhone"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                   remarks += " 常用固话:" + fieldValue;
                               }
                               break;   
                     case "BusinessPhone":
                               if(IsEmpty(gMergedContactsDetails["OtherPhone"])){
                                   gMergedContactsDetails["OtherPhone"] = fieldValue;
                                   break;
                               }
                               if( gMergedContactsDetails["OtherPhone"] != fieldValue && remarks.indexOf(fieldValue) == -1){
                                   remarks += " 公司固话:" + fieldValue;
                               }
                               break;    
                     case "ImageUrl"://有的ImageUrl存了默认头像
                                var imgurl = gMergedContactsDetails["ImageUrl"];
                                var sysImgPath = ["rm/richmail/images/face.png","rm/richmail/images/nopic.jpg"];
                                if(imgurl.toLowerCase().indexOf(sysImgPath[0])>0 || imgurl.toLowerCase().indexOf(sysImgPath[1])>0){
                                    gMergedContactsDetails["ImageUrl"] = fieldValue;
                                }
                               break;          
                     case "GroupId"://分组要叠加到右侧分组字段而且不能重复
                           if(!Array.indexOf) { 
                                Array.prototype.indexOf = function(obj) {                
                                    for(var i=0; i<this.length; i++) { 
                                        if(this[i]==obj) { 
                                            return i; 
                                        } 
                                    } 
                                    return -1; 
                                } 
                            } 
                            var AllGroupIds = gMergedContactsDetails["GroupId"];
                            var signgroupids = fieldValue.split(",");
                            for(var gl=0; gl<signgroupids.length; gl++){
                               if(AllGroupIds.indexOf(signgroupids[gl]) == -1){
                                   AllGroupIds += "," + signgroupids[gl];
                               }
                            }
                           gMergedContactsDetails["GroupId"] = AllGroupIds;
                           break;
                     case "name":
                            break; 
                     case "UserSex":
                            break;
                     case "ProvCode" :
                           break;
                     case "CityCode":
                           break;
                     case "HomeAddress":
                            var code = IsEmpty(gUseContactsDetails[i]["ProvCode"])? "" : gUseContactsDetails[i]["ProvCode"];
                                code += IsEmpty(gUseContactsDetails[i]["CityCode"]) ? "" : gUseContactsDetails[i]["CityCode"];
                                code += fieldValue;
                                if(remarks.indexOf(code) == -1)
                                    remarks += " 家庭地址：" + code;
                            break;
                     case "CPProvCode" :
                            break;
                     case "CPCityCode":
                            break;
                     case "CPAddress":
                            var code = IsEmpty(gUseContactsDetails[i]["CPProvCode"])? "" : gUseContactsDetails[i]["CPProvCode"];
                                code += IsEmpty(gUseContactsDetails[i]["CPCityCode"]) ? "" : gUseContactsDetails[i]["CPCityCode"];
                                code += fieldValue;
                                if(remarks.indexOf(code) != -1)
                                     remarks += " 公司地址：" + code;
                             break;                                
                     default:
                             for(var mkl=0; mkl< contactKey.length;mkl ++){       
                                 if(key == contactKey[mkl] && remarks.indexOf(fieldValue) == -1){       
                                     remarks += " " + tableArray[mkl] + ":" + fieldValue ;
                                 }
                             }
                    }
                     
                }
              
            }
        }
        gMergedContactsDetails["Memo"] += remarks;
        //备注字段最长取100个字符
        gMergedContactsDetails["Memo"] = gMergedContactsDetails["Memo"].substring(0,100);
       
        //手机、邮件地址处理
        MergeContactsModule.processMergedData(gMergedContactsDetails,"MobilePhone","OthermobilePhone","BusinessMobile");      
        MergeContactsModule.processMergedData(gMergedContactsDetails,"FamilyEmail","OtherEmails","BusinessEmail");      
		
    },
    //合并过的手机、邮箱数组处理
    processMergedData:function(objMergedData,keyName1,keyName2,keyName3)
    {
        MergeContactsModule.mergeFiled(objMergedData,keyName1,keyName2);
        MergeContactsModule.mergeFiled(objMergedData,keyName2,keyName3);
        MergeContactsModule.mergeFiled(objMergedData,keyName1,keyName3);
    },
    mergeFiled:function(objMergedData,keyName1,keyName2)
    {
        var isEqual = false;
        var first = objMergedData[keyName1],
            secend = objMergedData[keyName2];
        var str = first || secend; //尝试取一个存在的值
        if (str) {
            var _Email = $Email || top.$Email;
            if (_Email.isEmail && _Email.isEmail(str)) {
                isEqual = _Email.compare(first, secend);
            }
            else {
                isEqual = first == secend;
            }
        }

        if (isEqual) {
            if (gMergedContactsDetails && IsEmpty(gMergedContactsDetails[keyName1])) {
                objMergedData[keyName1] = '';
            }
            else {
                objMergedData[keyName2] = '';
            }
        }

        //if(objMergedData[keyName1]==objMergedData[keyName2])//当两个字段值相等，要去掉其中一个
        //{
        //    if(gMergedContactsDetails && IsEmpty(gMergedContactsDetails[keyName1]))
        //    {
        //        objMergedData[keyName1]='';
        //    }
        //    else
        //    {
        //        objMergedData[keyName2]='';
        //    }
        //}
    },
    //填充合并后的表格数据
    fillMergeTable:function(){        
        var mergedHtml=[];
        var tempData=deepClone(gMergedContactsDetails);
        //var imageUrl=MergeContactsModule.getContactImage(tempData["ImageUrl"]);
        var imageUrl=(new top.M2012.Contacts.ContactsInfo(tempData)).ImageUrl;
		mergedHtml.push('<a href="javascript:" title="" class="tou"><img width = "96" height="96" src="{0}"></a>'.format(imageUrl));
        mergedHtml.push('<table cellspacing="0" cellpadding="0" class="details">');
        mergedHtml.push('<tbody>');
		var usedSerialId=[]; 
        for(var i=0;i<gUseContactsDetails.length;i++)
        {
            usedSerialId.push(gUseContactsDetails[i]["SerialId"]);
        }
		if(top.Contacts.FilterVip(usedSerialId).length >0){
			var viptip = '<i class="user_vip"></i>';
			mergedHtml.push('<tr><td class="t1">姓名</td><td><div class="td-value">{0}{1}<div></td></tr>'.format(htmlEncode(tempData["name"]), viptip));
		}else{
		    mergedHtml.push('<tr><td class="t1">姓名</td><td><div class="td-value">{0}<div></td></tr>'.format(htmlEncode(tempData["name"])));
		}
	
        
		if(tempData["GroupId"])
        {
            mergedHtml.push('<tr><td class="t1">分组</td><td><div class="td-value">');
            var groupNames=MergeContactsModule.getContactGroupNames(tempData["GroupId"]);
            if(groupNames)
            {
                var groupNameArray=groupNames.split(',');
                for(var i =0;i< groupNameArray.length;i++) //不能用in来遍历 会把protype函数遍历出来
                {
                    mergedHtml.push(htmlEncode(groupNameArray[i]));
                } 
            }
            mergedHtml.push('</div></td></tr>');
        }
         //数据显示处理
        tempData["UserSex"] = tempData["UserSex"] == "0" ? "男" : (tempData["UserSex"] == "1" ? "女" : "保密");
        tempData["FamilyAddress"] = (IsEmpty(tempData["ProvCode"]) ? "" : tempData["ProvCode"]) + 
        (IsEmpty(tempData["CityCode"]) ? "" : tempData["CityCode"]) + (IsEmpty(tempData["HomeAddress"]) ? "" : tempData["HomeAddress"]);
        tempData["CompanyAddress"] = (IsEmpty(tempData["CPProvCode"]) ? "" : tempData["CPProvCode"]) + 
        (IsEmpty(tempData["CPCityCode"]) ? "" : tempData["CPCityCode"]) + (IsEmpty(tempData["CPAddress"]) ? "" : tempData["CPAddress"]);
        tempData["StartCode"] = tempData["StartCode"] == "-1" ? "" : tempData["StartCode"];
        tempData["BloodCode"] = tempData["BloodCode"] == "-1" ? "" : tempData["BloodCode"];
        var filedName='';
        for(var i = 0; i < tableArray.length; i++)
        {
            filedName=contactKey[i];
            if(filedName!="name" && filedName!="GroupId" && !IsEmpty(tempData[filedName]))
            {
                mergedHtml.push('<tr><td class="t1">{0}</td><td><div class="td-value">{1}</div></td></tr>'.format(htmlEncode(tableArray[i]),htmlEncode(tempData[filedName])));
            }
        } 
        mergedHtml.push('</tbody>');
        mergedHtml.push('</table>');
        $("#divMergedContactInfo").html(mergedHtml.join(''));
    },
    //使用该联系人信息
    useThisContact:function(serialId)
    {
    	top.BH("addr_merge_useThisContactInfo");
        var currentSerialId='';
        var obj=null;
        MergeContactsModule.reBindHrefEvent();
        for(var i=0;i<gUseContactsDetails.length;i++)
        {
             if(gUseContactsDetails[i]["SerialId"]==serialId)
             {
                gTemplateContactsDetails=deepClone(gUseContactsDetails[i]);
                MergeContactsModule.mergeContactDetailData();
                MergeContactsModule.fillMergeTable();
                $("#contactBox_"+serialId+" [hreftype=useThisContact]").addClass("gray-dis pray").attr("href","javascript:void(0);");
                $("#contactBox_"+serialId+" [hreftype=useThisContact]").closest('div.btn').addClass('gray-disbg pray');
                $("#contactBox_"+serialId+" [hreftype=unUseThisContact]").addClass("gray-ipt").attr("href","javascript:void();");
                break;
             }
        }
    },
    //暂时不合并某联系人
    unUseThisContact:function(serialId)
    {
    	top.BH("addr_merge_NoMergeNow");
        if(gUseContactsDetails.length==2)
        {
            top.FF.alert(msgNeedTwo);
            return ;
        }

        for(var i=0;i<gUseContactsDetails.length;i++)
        {
            if(gUseContactsDetails[i]["SerialId"]==serialId)
            { 
                //记录暂不使用的联系人数据，放在数组开始位置
                gUnUseContactsDetails.unshift(deepClone(gUseContactsDetails[i]));
                //从正在使用的联系人数组中去掉当前联系人
                gUseContactsDetails.splice(i,1);
                i--;
                
                MergeContactsModule.showUndoMessage();
                $("#contactBox_"+serialId).remove();
            }
        }       
        MergeContactsModule.mergeContactDetailData();
        MergeContactsModule.fillMergeTable();
    },
    showOtherMessage:function(msg)
    {
        $("#divOtherMessage").html(msg).show();
    },
    //显示撤消消息
    showUndoMessage:function()
    {
        if(gUnUseContactsDetails.length==0)
        {
            $("#divUndoMessage").hide();
            return;
        }
        if(gUnUseContactsDetails.length==1)
        {
            $("#aUndoAll").hide();
            $("#aUndoPrev").html("撤消");
        }
        else
        {
             $("#aUndoAll").show();
             $("#aUndoPrev").html("撤消上一次");
        }
        $("#spanUndoCount").html(gUnUseContactsDetails.length);
        $("#divUndoMessage").show();
    },
    //撤消上一次
    undoPrev:function()
    {       
        var undoData=deepClone(gUnUseContactsDetails[0]);
        //把当前数据放入正在使用的联系人当中，再删除暂不使用数据中第一项数据
        gUseContactsDetails.push(undoData);
        gUnUseContactsDetails.splice(0,1);
       
        MergeContactsModule.fillContactListTable();
        MergeContactsModule.mergeContactDetailData();
        MergeContactsModule.fillMergeTable();

        MergeContactsModule.showUndoMessage();
    },
    //全部撤消
    undoAll:function()
    {
    	top.BH("addr_merge_cancelAll");
        gUnUseContactsDetails=[];
        gUseContactsDetails=deepClone(gOldContactsDetails);
        MergeContactsModule.fillContactListTable();
        MergeContactsModule.mergeContactDetailData();
        MergeContactsModule.fillMergeTable();
        
        MergeContactsModule.showUndoMessage();
    },
    //重新绑定“使用该联系人信息”和“暂不合并”链接的事件
    reBindHrefEvent:function()
    {
        $("#divRepeatContactList [hreftype=useThisContact]").each(function()
        {
            obj=$(this);
            currentSerialId=obj.attr("serialId");
            obj.removeClass("pray gray-dis").attr("serialId",currentSerialId).attr("href","javascript:MergeContactsModule.useThisContact({0});".format(currentSerialId));
            obj.closest('div.btn').removeClass('gray-disbg pray');
        });
        $("#divRepeatContactList [hreftype=unUseThisContact]").each(function()
        {
            obj=$(this);
            currentSerialId=obj.attr("serialId");
            obj.removeClass("gray-ipt").attr("serialId",currentSerialId).attr("href","javascript:MergeContactsModule.unUseThisContact({0});".format(currentSerialId));
        });
    },
    //当第一次绑定时，去掉第一个列表的点击事件
    removeFirstHrefEvent:function()
    {
        $("#divRepeatContactList [hreftype=useThisContact]:eq(0)").each(function()
        {
            $(this).addClass("pray").attr("href","javascript:void();");
        });
        $("#divRepeatContactList [hreftype=unUseThisContact]:eq(0)").each(function()
        {
            $(this).addClass("gray-ipt").attr("href","javascript:void();");
        });
    },
    //获取联系人所在组的组名
    getContactGroupNames:function(gid){
        if(!gContactsGroups || gContactsGroups.length == 0) return;
        var gidArray = "";
        if(!IsEmpty(gid)) gidArray = gid.split(",");
        var groupNames = "";
        try{
            for(var i = 0; i < gContactsGroups.length; i++){
                for(var j = 0; j < gidArray.length; j++){ 
                    if(gContactsGroups[i].GroupId == gidArray[j])
                        groupNames += gContactsGroups[i].GroupName + ", ";
                }
            }
            groupNames = $.trim(groupNames);
            groupNames = groupNames.length > 0 ? groupNames.substring(0, groupNames.length - 1) : groupNames;
        }catch(e){}
        return groupNames;
    }
}
