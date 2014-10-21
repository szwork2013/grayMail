/**
 * @author Administrator
 */
function MailServer(){
    this.context = null; //函数上下文
    var This = this;
    //返回收件箱文件夹列表
    this.getFolderList = function(callback){
        var url = "/coremail/fcg/ldapapp?funcid=foldmain&tempname=foldmain.htm&sid=" + sid + "&rnd=" + Math.random();
        $.loadXML(url, null, function(result){
            try {
                callback.call(FM, result);
            } 
            catch (ex) {
                return;
            }
            
        });
    }
    
    //添加文件夹
    this.addFolder = function(folderName, callback){
        //WaitPannel.show("正在添加文件夹");
        var url = "/coremail/fcg/ldapapp?funcid=foldmain&tempname=foldmain.blank.htm&newfolder.x=1&sid=" + sid;
        
        if (document.all) {
            url += "&newfoldername=" + folderName;
            $.get(url, null, function(result){
                //WaitPannel.hide();
                callback.call(This.context, parseXML(result));
            }, null);
        }
        else { //firefox不支持gb2312
            postByFrame(url, {
                newfoldername: folderName
            }, function(result){
                //WaitPannel.hide();
                callback.call(This.context, parseXML(result));
            });
        }
        
    }
    this.forwardMail = function(fid, mids){
        mid = mids[0];//.replace(/%0A/ig,"%250A");
        mid_str = mids.join(",");
        
        //mid_str=mid_str.replace(/%0A/ig,"%250A");
        top.forwardParam = {
            sid: sid,
            fid: fid,
            fromforward2: "y",
            "modify_attach.x": 1,
            "rtn2mails": 1,
            tonr_tempname: "compose.htm",
            oldmid: mid,
            oldmids: mid_str
        
        };
        
        var url = stylePath + "/forward.htm?funcid=forwhand&sid=" + sid + "&fid=" + fid +
        "&fromforward2=y&modify.x=1&modify_attach.x=1&rtn2mails=1&tonr_tempname=compose.htm&oldmid=" +
        mid
        CM.show(url);
        
    }
    
    
    this.readMail = function(mid, callback){
        var url = "/coremail/fcg/ldmsapp?funcid=readlett&sid=" + sid + "&mid=" + mid;
        url += "&fid=1&ord=0&desc=1";
        RM.show(url, "读邮件");
    }
    //flag 1=标记为未读,2=标记为已读,3=标记为重要,4=标记为不重要
    this.markMail = function(ids, flag, callback){
        //WaitPannel.show("正在标记邮件");
        var url = top.ucDomain + "/GroupMail/GroupMailAPI/MailOperaing.ashx?sid=" + top.UserData.ssoSid;
        var action = '';
        switch (flag) {
            case 1:
                action = "cancelread";
                break;
            case 2:
                action = "read";
                break;
            case 3:
                action = "important";
                break;
            case 4:
                action = "cancelimportant";
                break;
        }
        $.post2({
            url: url,
            data: {
                id: ids.join(";"),
                action: action
            },
            success: function(result){
                //WaitPannel.hide();
                if (result.resultCode == 0) {
                    callback.call(This.context, flag);
					MailOperating.refreshMailsCount();
                }
            }
        });
    }
    
    this.deleteMail = function(ids, param, callback){
        //WaitPannel.show("正在删除邮件");
        var url = top.ucDomain + "/GroupMail/GroupMailAPI/MailOperaing.ashx";
        if (param["isReal"]) {
            $.post2({
                url: url,
                data: {
                    sid: top.UserData.ssoSid,
                    id: ids.join(";"),
                    action: "truncate"
                },
                success: function(result){
                    //WaitPannel.hide();
                    if (result.resultCode == 0) {
                        callback.call(This.context, param["pi"], param["isReal"]);
						MailOperating.refreshMailsCount();
                    }
                }
            });
        }
        else {
            $.post2({
                url: url,
                data: {
                    sid: top.UserData.ssoSid,
                    id: ids.join(";"),
                    action: "delete"
                },
                success: function(result){
                    //WaitPannel.hide();
                    if (result.resultCode == 0) {
                        callback.call(This.context, param["pi"], param["isReal"]);
						MailOperating.refreshMailsCount();
                    }
                }
            });
        }
        
        
    }
    this.cancelDelete = function(ids, param, callback){
        //WaitPannel.show("正在还原邮件");
        var url = top.ucDomain + "/GroupMail/GroupMailAPI/MailOperaing.ashx";        
        $.post2({
            url: url,
            data: {
                sid: top.UserData.ssoSid,
                id: ids.join(";"),
                action: "canceldelete"
            },
            success: function(result){
                //WaitPannel.hide();
                if (result.resultCode == 0) {
                    callback.call(This.context, param["pi"]);
                }
            }
        });
        
    }
    
    this.spamMail = function(obj, param, callback){
        //WaitPannel.show("正在标记邮件");
        var url = "/coremail/fcg/ldapapp?funcid=mails&sid=" + sid;
        for (elem in param) {
            obj[elem] = param[elem];
        }
        obj["markflag"] = 1;
        if (param["desc"] != undefined) {
            obj["desc"] = param["desc"];
            obj["ord"] = param["ord"];
        }
        else {
            obj["desc"] = 1;
            obj["ord"] = 0;
        }
        
        var target = 5;//移到垃圾邮件文件夹
        if (param["btnRevertJunk.x"] == 1) {
            target = 1;//移到收件箱
        }
        var isFromMail = obj["isFromMail"] ? 1 : 0;
        
        $.post(url, obj, function(result){
            //WaitPannel.hide();
            callback.call(This.context, parseXML(result), target, isFromMail);
        }, null);
    }
    
    this.moveMail = function(obj, param, callback){
        //WaitPannel.show("正在转移邮件");
        var url = "/coremail/fcg/ldapapp?funcid=mails&btnMove.x=1&sid=" + sid + "&rnd=" + Math.random();
        ;
        for (elem in param) {
            obj[elem] = param[elem];
        }
        if (param["desc"] != undefined) {
            obj["desc"] = param["desc"];
            obj["ord"] = param["ord"];
        }
        else {
            obj["desc"] = 1;
            obj["ord"] = 0;
        }
        obj["filter_tempname"] = "move";
        
        var isReadMail = null;
        if (param["isReadMail"]) {
            param["isReadMail"] = true;
        }
        $.post(url, obj, function(result){
            //WaitPannel.hide();
            callback.call(This.context, parseXML(result), param["tofolder"], isReadMail);
        }, null);
    }
    
    this.getMailList = function(pageIndex, pageSize, isSearch, order, desc, mt, mf, callback){
        var url = top.ucDomain + "/GroupMail/GroupMailAPI/topiclist.ashx?sid=" + top.sid;
        var gn = window["cacheGN"] == null ? "" : window["cacheGN"];
        var gType = "";
        if (gn != "") {
            gType = window["getGroupType"]() == "fetionGroup" ? 1 : 0;
        }
		top.WaitPannel.show("数据读取中，请稍候...");
        $.post2({
            url: url,
            data: {
                //MailStatus = 0;
                order: order,
                ot: desc ? "desc" : "asc",
                pi: pageIndex,
                ps: pageSize,
                gn: gn,
                gt: gType,
                mt: mt,
                mf: mf
            },
            success: function(result){
                if (result.resultCode == 0) {
                    callback.call(This.context, result.resultData, pageIndex);
                }
            },
			complete: function(){
                top.WaitPannel.hide();
            }
        });
    }
    
    this.searchMail = function(param, callback){
        //WaitPannel.show("正在搜索邮件");
        var url = "/coremail/fcg/ldsrchapp?sid=" + sid + "&rnd=" + Math.random() +
        "&subfolder=yes&headeronly=yes";
        var word = "";
        if (param["word"]) {
            if (param["word"] != "word") {
                word = param["word"];
            }
            else {
                word = "";
            }
            
            delete param["word"];
        }
        
        if (param["advance"] && word == "word") {
            word = "";
        }
        
        
        if (jQuery.browser.mozilla) {
            if (word != "word") {
                Utils.getGB2312(word, function startSearch(result){
                    url += "&word=" + result;
                    $.loadXML(url, param, searchCallback);
                });
            }
            else {
                $.loadXML(url, param, searchCallback);
            }
            
        }
        else {
            url += "&word=" + word;
            
            $.loadXML(url, param, searchCallback);
            
        }
        
        function searchCallback(result){
            /*
             if(param["traffic"]){
             var list=result["maillist"]
             for(var i=0;i<list.length;i++){
             var fid=list[i]["url"].match(/fid=(\d+)/i)[1];
             if(fid==2 || fid==4){
             //delete list[i];
             list.splice(list[i],1);
             i--;
             }
             
             }
             }*/
            //WaitPannel.hide();
            callback.call(This.context, result);
        }
        
    }
    
    
}
