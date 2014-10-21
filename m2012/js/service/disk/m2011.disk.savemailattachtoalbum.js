﻿var Messages ={    Empty       : "相册名称不能为空",    MaxLength   : "最大长度不能超过24字节（12个汉字）",    InvalidChar : "不能有以下特殊字符 \\/:*?\"<>|",    RepeatDirName:"相册名称不能重复",    Exception   : "创建相册失败，请稍后再试。",    Space:"不能只输入空格"}var pid = "";var rootDefaultAlbumName = "最新上传";function PageInit(){     DiskTool.DialogAuto();     $("#aSaveAttach").click(function(e){         SaveAttachToDisk();         e.preventDefault();     });          $("#aCancel").click(function(){        top.FloatingFrame.close();     });     $("#aAdd").click(function(){        if($("#selDir")[0].length > 50) {            alert("抱歉，您已经创建了50个相册，无法再创建。");            return;        }        $("#newPhoto").show();     });     $("#aAddAlbum").click(function(){        AddAlbum();     });     $("#aCancel1").click(function(){         showMsg("");        $("#newPhoto").hide();     });     /*界面超时处理*/     if(Utils.PageisTimeOut(true))return;     //初始化目录     initDir();     return;}function initDir(){    var option = "<option value='{0}'>{1}</option>";    //$("#selDir").append(option.format("0", rootDefaultAlbumName));    $.postXml({        url : DiskTool.resolveUrl("getDiskAlbumList", true),        success: function(result){            if(result.code == "S_OK"){                var dir = result['var'].albumList;                pid = DiskConf.albumDirID;                for(var i = 0; i < dir.length; i++){                    $("#selDir").append(option.format(dir[i].albumId, dir[i].albumName));                }                var tempDirName = $("#dirName").val();                $("#dirName").val("");                SelectByName($("#selDir")[0], tempDirName);            }        },        error: function(error){             DiskTool.handleError(error);        }    });} function SaveAttachToDisk(){    var fileName = Utils.queryString("filename");    var url = Utils.queryString("tourl");    if(!CheckAlbum(fileName)) {        return;    }    var selDirId = $("#selDir").val();    SaveAttach(fileName, pid, url, 1, selDirId); } function SaveAttach(fileName, did, url, selComefrom, selItemId) {    if(top.isIE6()) {       $("#selDir").hide();    }    DiskTool.ShowWaiting();	$.postXml({		url: DiskTool.resolveUrl("saveAttach", true),		data: XmlUtility.parseJson2Xml({            filename: escape(fileName),            usernumber: top.UserData.userNumber,			directoryid: did,			ComeFrom: selComefrom,			BItemId: selItemId,			url: url,			cookieValue: Utils.getCookie("Coremail"),			type: 0        }),		success: function(data) {			DiskTool.HideWaiting();			if(data.code == "S_OK") {				DiskTool.addDiskBehavior({					actionId: 12,					thingId: 4,					moduleId: 11,					actionType: 10				});				top.FloatingFrame.close();			} else {				alert(data.summary);			}		},		error: function() {			DiskTool.handleError(error);		}	}); } function AddAlbum(){    var dirName = $("#dirName").val();    var invalidMsg = validName(dirName);    if(invalidMsg) {        showMsg(invalidMsg);        return;    }    if(CheckRepeatName($("#selDir")[0],dirName)) {        showMsg(Messages.RepeatDirName);        return;    }          if(top.isIE6()) {        $("#selDir").hide();    }    DiskTool.ShowWaiting();    $.postXml({        url : DiskTool.resolveUrl("addDiskAlbum", true),		data: XmlUtility.parseJson2Xml({            albumName: dirName        }),        success: function(result){            DiskTool.HideWaiting();                 if(top.isIE6()) {                $("#selDir").show();            }            if (result.code == DiskConf.isOk) {                //新增行为				DiskTool.addDiskBehavior({					actionId: 33,					moduleId: 11,					actionType: 10				});                //关闭窗口                $("#selDir").find("option").remove();                initDir();                showMsg("");                $("#newPhoto").hide();            } else {				alert(result.summary);			}        },        error: function(error){            DiskTool.HideWaiting();                 if(top.isIE6()) {                $("#selDir").show();            }            showMsg(error);        }    });   }  function showMsg(msg) {    if(msg&&msg!="") {        $(".error-p").html(msg).show();    } else {        $(".error-p").html(msg);        $(".error-p").hide();    } } function SelectByName(st,name) {    for(var i=0;i<st.options.length;i++) {        if(st.options[i].text == name) {            st.options[i].selected = true            break;        }    } } function CheckRepeatName(st,name) {    var isRepeated = false;    for(var i=0;i<st.options.length;i++) {        if(st.options[i].text == name) {            isRepeated = true;            break;        }    }    return isRepeated; } function validName(name) {    if(name == null){        return Messages.Empty;    }    name = $.trim(name);    if(name == ""){        return Messages.Empty;    }         //查看长度    if(name.length > 12) {        return Messages.MaxLength;    }           if(!checkOtherChar(name)){        return Messages.InvalidChar;    }         return null;             }//查看特殊字符//\/:*?"<>|function checkOtherChar(str) {    for(var loop_index=0; loop_index<str.length; loop_index++){         if(str.charAt(loop_index) == '*'         ||str.charAt(loop_index) == '|'         ||str.charAt(loop_index) == ':'         ||str.charAt(loop_index) == '"'         ||str.charAt(loop_index) == '<'         ||str.charAt(loop_index) == '>'         ||str.charAt(loop_index) == '?'         ||str.charAt(loop_index) == '\\'         ||str.charAt(loop_index) == '\''         ||str.charAt(loop_index) == '/'){             return false;         }     }    return true;}