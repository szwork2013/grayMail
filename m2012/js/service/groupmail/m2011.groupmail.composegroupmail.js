
if ($.browser.msie) {
    ScreenShotControl.writeHtml();
}
ScreenShotControl.onStart = function(){
    $("#result").html("��ʼ�ϴ�");
}
ScreenShotControl.onProgress = function(param){
    $("#loading").html("���ϴ���:" + param.progress + "/" + param.totalSize);
}
ScreenShotControl.onStop = function(result){
    if (result.resultCode == 0) {//http status 200
        if (result.responseText == "false") {
            alert("�ϴ�ʧ��");
            return;
        }
        try {
            var myModule;
            for (var m in top.MM.modules) {
                var md = top.MM.modules[m];
                if (md.container == window.frameElement) {
                    myModule = md;
                    break;
                }
            }
            if (myModule != top.MM.currentModule) {
                top.MM.activeModule(myModule.name);
            }
        } 
        catch (e) {
        }
        
        
        var pic = eval("(" + result.responseText + ")");
        var url = top.ucDomain + "/groupmail/webservice/FileDownLoad.ashx?sid=" + top.UserData.ssoSid +
        "&fid=" +
        pic.Fileid +
        "&fname=" +
        pic.FileName +
        "&gn=" +
        ComposeGroupMail.gn() +
        "&gtype=" +
        ComposeGroupMail.gtype();
        EditorManager.insertImage(url);
    }
    else 
        if (result.resultCode == 1) {
        
        }
        else 
            if (result.resultCode == 2) {//http status 400+ 500+
                alert("�ϴ�ʧ��");
                
            }
}

$(document).ready(function(){
	// add by tkh �ı�iframe��name���ԣ��ϴ������Ȼͨ��top.frames['groupMailWrite']
	var groupMailIframe = top.document.getElementById('groupMailWrite');
	$(groupMailIframe).attr('name', 'groupMailWrite');
    ComposeGroupMail.load();
    
});

window["getGroupType"] = function(){
    return $(".group-nav>li:eq(0)").hasClass("current") ? "fetionGroup" : "139Group";
}

function onModuleClose(){
    if (EditorManager.getHtmlToTextContent().trim() != '' || EditorManager.getHtmlContent().match(/<img[^>]+?>/i)) {
        //�ر�д��ҳ��δ���͵����ݽ��ᶪʧ���Ƿ�ر�?
        return window.confirm(frameworkMessage.closeWrite);
    }
}

var attachUplpading = false;
var sendFlag = false;
var ComposeGroupMail = {
    //�����б�
    attach: [],
    //�󸽼��б�
    disk_attach: [],
    //�û�Ⱥ�б�
    groupList: [],
    gn: function(){
        if (this.action == "write") {
            return $("#sl_grouplist").val()
        }
        else 
            if (this.action == "reply") {
                return top.Utils.queryString("gn", decodeURIComponent(window.location.href));
            }
    },
    gtype: function(){
        return 0;
    },
    gName: function(){
        if (this.action == "write") {
            return $("#sl_grouplist option:selected").text()
        }
        else 
            if (this.action == "reply") {
                return decodeURI(Tool.getUrlParamValue(window.location.href, "gName"));
            }
        
    },
    MailFolder: function(){
        return top.Utils.queryString("mf", decodeURIComponent(window.location.href))
    },
    topicid: function(){
        return Tool.getUrlParamValue(window.location.href, "id");
    },
    action: top.Utils.queryString("action", decodeURIComponent(window.location.href)),
    load: function(){
        //��ʼ���༭��
		EditorManager.onload = function(){
			//��ʱ���𣬵ȴ��༭��ʵ�ֺ�����ӡ�
			//EditorManager.setHtmlContent(frameworkMessage.spam_write)
		};
        var editor = EditorManager.create({
            container: document.getElementById("editor"),
            height: this.setHeight(),
            version: 2,
            showFace: true,
            imageButtonOnClick: function(){
                url = "http://" + location.host + "/GroupMail/GroupMail/image-upload.htm?fid=" + frameElement.id + "&sid=" + top.UserData.ssoSid + "&gn=" + ComposeGroupMail.gn() + "&gtype=" + ComposeGroupMail.gtype();
                top.FloatingFrame.open("����ͼƬ", url, 480, 220, true);
            },
            //�󶨽�����ť�¼�
            screenShotButtonOnClick: function(){
                ComposeGroupMail.shot();
            }
        });


        //���ϴ������¼�
        $("#upload").bind('change', ComposeGroupMail.uploadFile);
        //�󶨷��Ͱ�ť�¼�
        $("#SendMail1,#SendMail2").click(function(){
            if (ComposeGroupMail.disk_attach.length > 0) {
            	// update by tkh
                ComposeGroupMail.requestLargeAttachDownloadUrl(ComposeGroupMail.save);
            }
            else {
                ComposeGroupMail.save()
            }
        });
        $("#Cancel1,#Cancel2").bind('click', function(){
            top.Main.closeCurrentModule()
        });
        //���ϴ�ͼƬ��ť�¼�(���ɱ༭��ʵ��)
        $(".pic").bind('click', function(){
            if (ComposeGroupMail.gn() == 0) {
                //��ѡ��һ��Ⱥ��
                Tool.FF.alert(frameworkMessage.chooseGroup);
                return;
            }
            url = "http://" + location.host + "/GroupMail/GroupMail/image-upload.htm?fid=" + frameElement.id + "&sid=" + top.UserData.ssoSid + "&gn=" + ComposeGroupMail.gn() + "&gtype=" + ComposeGroupMail.gtype();
            top.FloatingFrame.open("����ͼƬ", url, 480, 220, true);
        });
        
        //�󶨴󸽼���ť�¼�        
        /*$("#aLargeAttach").click(function(){
            ComposeGroupMail.showFileSelectBox();
        });*/
        // add by tkh ��ֲ���󸽼�ҵ���߼�
        $("#aLargeAttach").click(function(){
            ComposeGroupMail.createLargeAttachComponet();
        });
        ComposeGroupMail.renderUploadMenu();
        ComposeGroupMail.initEventUploadMenu();
		
        if (this.action == "write") {
            //�������ұ�����ť�¼�
            $("#addressSwitch").bind("click", function(){
                $("#addressSwitch").toggleClass("addressSwitchOff");
            })
            $("#addressSwitch").toggle(function(){
                $(".group-sider").hide();
                $("body").addClass("hide-s");
            }, function(){
                $(".group-sider").show();
                $("body").removeClass("hide-s");
            });
            
            //��ȡȺ�б���Ϣ        
            window.isloading = true;
            $.post2({
                url: "../GroupMailAPI/getUserGroups.ashx",
                data: {
                    sid: top.UserData.ssoSid
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        ComposeGroupMail.groupList = result.resultData;
                        ComposeGroupMail.renderGroupList();
                        ComposeGroupMail.init();
                        ComposeGroupMail.setSider();
                        ComposeGroupMail.setTab();
                    }
                },
                complete: function(){
                    window.isloading = false;
                }
            });
        }
        else 
            if (this.action == "reply") {
            
                $(".group-sider-wrap").hide();
                $(".switch-bar").hide();
                $(".group-wrapper")[0].style.marginRight = "0px";
                
                $("body").addClass("hide-s");
                $("#addressSwitch").hide();
                $(".receive").toggleClass('subject');
                $("#sl_grouplist").replaceWith("<input type='text' class='text' disabled='true' value=" + this.gName() + "(" + this.gn() + ")" + ">");
                var subject = decodeURIComponent(Tool.getUrlParamValue(window.location.href, "subject"));
                $("#txtSubject").val(subject);
                $("#txtSubject").attr("disabled", "true");
                
            }
    },
    // add by tkh�����ϴ��󸽼����
	createLargeAttachComponet : function(){
		var self = this;
		new M2012.UI.LargeAttach.Model().requireUpload({},function(view){
		      self.uploadDialog = view;
		      //ѡ�ļ���Ļص�
		      view.on("select", function (e) {
		            //console.log(e);
		            //����e.files���ļ��б�
		            //e.autoSend��ָ�û�����ˣ��ϴ����Զ�����
		            if(e && e.files){
		            	BH({key : "compose_largeattachsuc"});
		            	
		            	var files = e.files;
		            	$(files).each(function(){
		            		this.state = 'success';
		            	});
		            	setNetLink(files);
		            	// �ϴ���ɺ��Զ������ʼ�
		            	if(e.autoSend){
		            		$("#SendMail1").click();
		            	}
		            }
		      });
		});
	},
	// add by tkh ��Ⱦ�ݴ�����̲˵�
	renderUploadMenu : function(){
		var html = [ '|<a hidefocus="1" href="javascript:void(0);">',
					 '<i id="uploadMenu" style="background: url({0}) no-repeat;display: inline-block;overflow: hidden;vertical-align: middle;width: 18px;height: 16px;background-position: -371px -16px;" id="uploadMenu">',
					 '</i>',
					 '</a>'].join("");
		var mennuHtml = [ '<div id="menuItems" style="display:none;position: absolute;width: 100px;top: 5px; left: 117px; -webkit-box-shadow: 2px 2px 1px rgba(0,0,0,.1);box-shadow: 2px 2px 1px rgba(0,0,0,.1);border: 1px solid #999;background-color: #FFF;padding: 4px 0;-webkit-border-radius: 3px;border-radius: 3px;">',
					 '<ul>',
					 '<li id="storageCabinet">',
					 '<a href="javascript:;" style="height: 24px;line-height: 24px;display: block;color: #000;padding: 0 15px;vertical-align: baseline;position: relative;"><span style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 100%;display: inline-block;height: 24px;line-height: 24px;">�ݴ���ļ�</span></a></li>',
					 '<li id="uploadDisk">',
					 '<a href="javascript:;" style="height: 24px;line-height: 24px;display: block;color: #000;padding: 0 15px;vertical-align: baseline;position: relative;"><span style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 100%;display: inline-block;height: 24px;line-height: 24px;">�����ļ�</span></a></li>',
					 '</ul>',
					 '</div>'].join("");
		
		$("#aLargeAttach").after(html.format('http://'+top.location.host+'/m2012/images/global/global.png') + mennuHtml);
	},
	// add by tkh Ϊ�ݴ�����̲˵����¼�
	initEventUploadMenu : function(){
		$("#menuItems li").mouseover(function(event){
			$(this).find("a").css({'background-color': '#5d99ce', 'color' : '#FFF', 'text-decoration' : 'none'});
		});
		$("#menuItems li").mouseout(function(event){
			$(this).find("a").css({'background-color': '', 'color' : '', 'text-decoration' : ''});
		});
		
		$("#uploadMenu").click(function(event){
			$("#menuItems").show();
			return false;
		});
		$(document).click(function(event){
			$("#menuItems").hide();
		});
		
        $("#storageCabinet").click(function(event){
        	var cabinetIFrame = top.$Msg.open({
	            dialogTitle:"�ݴ���ļ�",
	            url:"storagecabinet.html?sid="+top.sid,
	            width:400,
	            height:353
	        });
	        // ע���¼����� 
	        top.$App.on('obtainCabinetFiles', function(files){
	        	BH({key : "compose_storagecabinetsuc"});
	        	console.log(files);
	        	setNetLink(files);
	        	cabinetIFrame.close();
	        	//top.$App.off('obtainCabinetFiles');
            });
            cabinetIFrame.on('remove', function(){
            	top.$App.off('obtainCabinetFiles');
            }); 
        });
        $("#uploadDisk").click(function(event){
        	var diskIFrame = top.$Msg.open({
	            dialogTitle:"�����ļ�",
	            url:"netdisk.html?sid="+top.sid,
	            width:400,
	            height:353
	        });
	        // ע���¼����� 
	        top.$App.on('obtainDiskFiles', function(files){
	        	BH({key : "compose_netdisksuc"});
	        	setNetLink(files);
	        	diskIFrame.close();
	        	//top.$App.off('obtainDiskFiles');
            });
            diskIFrame.on('remove', function(){
            	top.$App.off('obtainDiskFiles');
            }); 
        });
	},
    setHeight: function(){
        var height = $(document).height() - $('.menu-2').offset().top - $(".toolbar").height() - 90;
        return height < 300 ? 300 : height;
    },
    uploadFile: function(){
        try {
            if ($("#upload").val() == '') {
                return;
            }
            document.forms["formFile"].action = "../WebService/FileUpload.ashx?sid=" + top.UserData.ssoSid + "&gn=" + ComposeGroupMail.gn() + "&gtype=" + ComposeGroupMail.gtype();
            document.forms["formFile"].submit();
            attachUplpading = true;
            
        } 
        catch (e) {
            $("#hidden_frame").attr("src", "empty.htm").load(function(){
                $(this).unbind("load", arguments.callee);
                ComposeGroupMail.uploadFile();
            });
            attachUplpading = false;
            return;
        }
        $("#hidden_frame").bind('load', ComposeGroupMail.callBack);
    },
    callBack: function(){
        attachUplpading = false;
        $("#hidden_frame").unbind("load", arguments.callee);
        if ($("#hidden_frame")[0].contentWindow.errResult) {
            var errResult = $("#hidden_frame")[0].contentWindow.errResult;
            if (errResult) 
                Tool.FF.alert(errResult);
            return;
        }
        if ($("#hidden_frame")[0].contentWindow.uploadResult) {
            var s = $("#hidden_frame")[0].contentWindow.uploadResult;
            if (s.Fileid) {
                var fileName = $("#upload").val();
                if (fileName != "" && fileName.indexOf("\\") >= 0) {
                    fileName = fileName.match(/[\/\\]([^\/\\]+)$/)[1];
                }
                s.FileName = fileName;
                $("#upload").val('');
                
                ComposeGroupMail.attach.push(s);
                $('#ol_attach').append("<li id='li_" + s.Fileid + "'><i class=\"attach\"></i>" + s.FileName + "<a class=\"del\" onclick=\"ComposeGroupMail.deleteAttach('" + s.Fileid + "')\">ɾ��</a></li>");
                if ($("#ol_attach").height() > 50) {
                    $("#ol_attach").height(50);
                }
                if (EditorManager.setHeight) {
                    EditorManager.setHeight(ComposeGroupMail.setHeight())
                }
            }
            else {
                //�ϴ��ļ��������Ժ����ԡ�
                Tool.FF.alert(frameworkMessage.uploadError);
            }
            return;
        }
    },
    
    deleteAttach: function(fid){
        var delIndex = -1;
        $.each(ComposeGroupMail.attach, function(i, v){
            if (v.Fileid == fid) {
                delIndex = i;
            }
        });
        ComposeGroupMail.attach.slice(delIndex, 1);
        if (delIndex != -1) {
            $("#li_" + fid).remove();
            if ($("#ol_attach").get()[0].scrollHeight <= 50) {
                $("#ol_attach").css("height", "");
            }
        }
    },
    //�󸽼�
    showFileSelectBox: function(){
        var url = top.ucDomain + "/LargeAttachments/html/selectbox.htm#select&compose=" + frameElement.name;
        if (top._uploadWindow && !top._uploadWindow.isDisposed) {
            top._uploadWindow.show();
        }
        else {
            top._uploadWindow = FF.open("ѡ���ļ�", url, 520, 400, true, document.all ? true : false, true);
        }
    },
    diskCallBack: function(f){
        if (f && f.state == "success") {
            ComposeGroupMail.disk_attach.push(f);
            $('#ol_attach').append("<li id='lid_" + f.fileId + "'><i class=\"attach\"></i>" + f.fileName + "[���Ӹ���]<a class=\"del\" onclick=\"ComposeGroupMail.deleteDiskAttach('" + f.fileId + "')\">ɾ��</a></li>");
            if ($("#ol_attach").height() > 50) {
                $("#ol_attach").height(50);
            }
            if (EditorManager.setHeight) {
                EditorManager.setHeight(ComposeGroupMail.setHeight())
            }
        }
        else {
            //�ϴ��ļ��������Ժ����ԡ�
            Tool.FF.alert(frameworkMessage.uploadError);
        }
        return;
    },
    deleteDiskAttach: function(fid){
        var delIndex = -1;
        $.each(ComposeGroupMail.disk_attach, function(i, v){
            if (v.fileId == fid) {
                delIndex = i;
            }
        });
        ComposeGroupMail.disk_attach.slice(delIndex, 1);
        if (delIndex != -1) {
            $("#lid_" + fid).remove();
            if ($("#ol_attach").get()[0].scrollHeight <= 50) {
                $("#ol_attach").css("height", "");
            }
        }
    },
    //׷�����̸�������
    getDiskLinkHtml: function(){
        if (ComposeGroupMail.disk_attach && ComposeGroupMail.disk_attach.length > 0) {
            var html = '<style type="text/css">body, div, p,h3{margin:0;padding:0;}body{font-size:12px;font-family:Verdana, Arial, Helvetica, sans-serif, ����;}.fileExpAddressee{display:block;padding:16px 8px 8px 8px;}.fileExpAddressee h3{text-indent:8px;margin-bottom:8px;}.fileExpAddressee .fileAccessoriesC{display:block;padding:16px;background:#fff;}.fileExpAddressee .fileAccessoriesC p{margin-bottom:20px;line-height:20px;}.fileExpAddressee .fileAccessoriesC b{margin-right:8px;}.fileExpAddressee{background:#EEFAE2;}h3{font-weight:bold;font-size:14px;}.fe{color:#7B7C80;}a{text-decoration:underline;outline:none;color:#0344ae;}a:hover{cursor:pointer;}</style>'
            html += '<div class="fileAccessoriesC"> </div> <div class="fileExpAddressee"><h3>����139������ļ����</h3><div class="fileAccessoriesC"><p>';
            html += "<a href='" + ComposeGroupMail.disk_attach[0].downloadUrl + "'>�鿴������Ϣ</a><br/><br/>";
            for (var i = 0; i < ComposeGroupMail.disk_attach.length; i++) {
                var f = ComposeGroupMail.disk_attach[i];
                html += "<a href='" + f.downloadUrl + "'>" + f.fileName + "</a>&nbsp;&nbsp;<span class='fe'>(" + $T.Utils.getFileSizeText(f.fileSize) + ", " + f.exp + "����)</span><br><br>";
            }
            html += '</p></div></div>';
            return html;
        }
        else {
            return "";
        }
    },
    requestLargeAttachDownloadUrl : function(callback){
    	var self = this;
		// ������˽ӿڻ�ȡ�󸽼������ص�ַ
		var Arr_DiskAttach = ComposeGroupMail.disk_attach;
		self.mailFileSend(Arr_DiskAttach, function(result){
			console.log('result mailFileSend mailFileSend mailFileSend mailFileSend!!!!');
			console.log(result);
			if(result.responseData && result.responseData.code == 'S_OK'){
				var fileList = result.responseData['var']['fileList'];
				var urlCount = 0;
				for(var j = 0,len = fileList.length;j < len;j++){
					var mailFile = fileList[j];
					for (var i = 0,diskLen = Arr_DiskAttach.length;i < diskLen; i++) {
                        var diskFile = Arr_DiskAttach[i];
                        if (mailFile.fileName == diskFile.fileName && !diskFile.getIt) {
                            diskFile.getIt = true;
                            diskFile.downloadUrl = mailFile.url;
                            diskFile.exp = mailFile.exp;
                            urlCount++;
                            break;
                        }
                    }
				}
                if (urlCount == Arr_DiskAttach.length) {
                	if (callback) {
                		callback({
                            success: true,
                            responseText: ComposeGroupMail.getDiskLinkHtml()
                        });
                	}
                } else {
                    if (callback) {
                    	callback({
                            success: false,
                            errorMsg: '��ȡ�󸽼�ʧ�ܣ����Ժ�����'
                        });
                    }
                }
			}else{
				if (callback) {
					callback({
                        success: false,
                        errorMsg: '��ȡ�󸽼�ʧ�ܣ����Ժ�����'
                    });
				}
			}
		});
    },
    
    // add by tkh ��ȡ�󸽼����ص�ַ
	mailFileSend : function(files, callback){
		var xmlStr = this.getXmlStr(files);
		var data = {
    		xmlStr : xmlStr
    	}
		top.M139.RichMail.API.call("disk:mailFileSend", data, function(res) {
			if(callback){
				callback(res);
			}
        });
	},
	// add by tkh ��ȡ�󸽼����ص�ַʱ��ƴװxml��ʽ���������
	getXmlStr : function(files){
		var requestXml = '';
	    requestXml += "<![CDATA[";
	    requestXml += '<Request>';
	    var quickItems = [];
	    var netDiskXML = "";
	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        if (file.fileType == "netDisk") {
	        	var tempStr = "<File><FileID>{0}</FileID><FileName>{1}</FileName><FileGUID>{2}</FileGUID><FileSize>{3}</FileSize></File>";
	        	netDiskXML += $T.Utils.format(tempStr, [file.fileId, $T.Xml.encode(file.fileName), file.fileGUID, file.fileLength]);
	        } else {
	        	quickItems.push(file.uploadId || file.fileId)
	        }
	    }
	    if(quickItems.length > 0){
	    	requestXml += "<Fileid>" + quickItems.join(",") + "</Fileid>";
	    }
	    if(netDiskXML){
	    	requestXml += "<DiskFiles>" + netDiskXML + "</DiskFiles>";
	    }
	    requestXml += '</Request>';
	    requestXml += "]]>";
	    return requestXml;
	},
    shot: function(){
        //����
        if ($.browser.msie) {
        
            if (ScreenShotControl.enable()) {
                ScreenShotControl.shot({
                    //��ͼ�ϴ���ַ
                    uploadUrl: "http://" + window.location.host + "/groupmail/WebService/FileUploadControl.ashx?sid=" + top.UserData.ssoSid + "&gn=" + ComposeGroupMail.gn() + "&gtype=" + ComposeGroupMail.gtype()
                });
            }
            else 
                if (ScreenShotControl.needToUpdate()) {
                    if (confirm("ʹ�ý������ܱ�������139����ؼ�,�Ƿ�����?")) {
                        window.open("http://g1.mail.10086.cn/LargeAttachments/html/control139.htm");
                    }
                }
                else {
                    if (confirm("ʹ�ý������ܱ��밲װ139����ؼ�,�Ƿ�װ?")) {
                        window.open("http://g1.mail.10086.cn/LargeAttachments/html/control139.htm");
                    }
                }
        }
        else 
            alert("�����������֧�ָù���");
        
        return false;
    },
    save: function(disk_attach){
    
        if (ComposeGroupMail.gn() == 0) {
            //��ѡ��һ��Ⱥ��
            Tool.FF.alert(frameworkMessage.chooseGroup);
            return false;
        }
        if ($.trim($("#txtSubject").val()) == '') {
            //������Ⱥ�ʼ����⡣
            Tool.FF.alert(frameworkMessage.groupMailTitle);
            return false;
        }
        
        if (EditorManager.getHtmlToTextContent().trim() == '' && !EditorManager.getHtmlContent().match(/<img[^>]+?>/i)) {
            //������Ⱥ�ʼ����ݡ�
            Tool.FF.alert(frameworkMessage.groupMailContent);
            return;
        }
        if ($("tr.verify").css("display") != 'none' && $("#txt_Auth_code").val() == '') {
            //��������֤�롣
            Tool.FF.alert(frameworkMessage.verifyCode);
            return;
        }
        if (attachUplpading) {
            //�����ϴ��У����Ժ�
            Tool.FF.alert(frameworkMessage.attachUplpading);
            return;
        }
        var strAttach = "";
        $.each(ComposeGroupMail.attach, function(i, v){
            strAttach += v.ContentType + ":" + v.FileName + ":" + v.Filesize + ":" + v.Fileid + "|"
        });
        if (strAttach != "") {
            strAttach = strAttach.substr(0, strAttach.length - 1);
        }
        if (!sendFlag) {
            sendFlag = true;
            top.WaitPannel.show("�ʼ����ڷ���...");
            var content = EditorManager.getHtmlContent();
            if (disk_attach && disk_attach.responseText) {
                content += disk_attach.responseText;
            }
            $.post2({
                url: "../GroupMailAPI/SendGroupMail.ashx",
                data: {
                    sid: top.UserData.ssoSid,
                    gn: ComposeGroupMail.gn(),
                    subject: $.trim($("#txtSubject").val()),
                    attach: strAttach,
                    content: content,
                    code: $("#txt_Auth_code").val(),
                    action: ComposeGroupMail.action,
                    id: ComposeGroupMail.topicid()
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        var topicid = 0;
                        if (ComposeGroupMail.action == 'write') 
                            topicid = result.resultData;
                        else 
                            if (ComposeGroupMail.action == 'reply') 
                                topicid = result.resultData.topicid
                        window.location.href = "sent-success.htm?gname=" + encodeURIComponent(ComposeGroupMail.gName()) + "&id=" + topicid + "&action=" + ComposeGroupMail.action + "&subject=" + encodeURIComponent($.trim($("#txtSubject").val())) + "&mf=" + ComposeGroupMail.MailFolder() + "&rn=" + Math.random();
                    }
                    if (result.resultCode == 1) {
                        Tool.FF.alert(result.errorMsg);
                        $("#sp_imgValidate").hide();
                        return;
                    }
                    
                },
                complete: function(){
                    sendFlag = false;
                    top.WaitPannel.hide();
                }
                
            });
        }
        
    },
    setTab: function(){
        //$(".group-sider").height($(window).height() - $(".toolbar").height());
        //$(".group-name-list").height($(window).height() - $(".group-name-list").offset().top - 20);
        $(".inlet>a")[0].onclick = function(){
            top.$App.show("groupMailCreateGroup");
        };
        $(".inlet>a")[1].onclick = function(){
            top.$App.show("groupMailFindGroup");
        }
        if (ComposeGroupMail.groupList.MaxGroupCount <= ComposeGroupMail.groupList.CreatedCount) {
            $(".inlet>a")[0].style.display = 'none';
        }
        var liArray = $(".group-nav>li");
        //����Ⱥ        
        $(liArray[0]).click(function(){
            if (window.isloading) {
                //���ݶ�ȡ�У����Ժ����
                Tool.FF.alert(frameworkMessage.dataLoading);
                return;
            }
            liArray.removeClass("current");
            $(this).addClass("current");
            $(".inlet").hide();
            ComposeGroupMail.renderGroupList();
        });
        //�Խ�Ⱥ        
        $(liArray[1]).click(function(){
            if (window.isloading) {
                //���ݶ�ȡ�У����Ժ����
                Tool.FF.alert(frameworkMessage.dataLoading);
                return;
            }
            liArray.removeClass("current");
            $(this).addClass("current");
            $(".inlet").show();
            ComposeGroupMail.renderGroupList();
        });
    },
    //����Ⱥ�б�
    renderGroupList: function(list){
        //������
        if (!list) {
            var dataName = window["getGroupType"]();
            list = ComposeGroupMail.groupList[dataName];
        }
        var opn = document.createElement("OPTION");
        $("#sl_grouplist").empty().append(opn);
        opn.value = '0';
        opn.innerHTML = '��ѡ��Ⱥ';
        $.each(list.openList, function(i, v){
            var opn = document.createElement("OPTION");
            $("#sl_grouplist").append(opn);
            opn.value = v.groupNumber;
            opn.innerHTML = v.groupName + "(" + v.groupNumber + ")";
        });
        //�Ҳ��б�  
        var groupList = $('.group-name-list');
        groupList.empty();
        $.each(list.openList, function(i, v){
            groupList.append('<li onclick=ComposeGroupMail.selGroup(' + v.groupNumber + ')><i class="i-group"></i><span title="' + v.groupName + '">' + v.groupName + '</span>(' + v.groupNumber + ')</li>')
        });
        $.each(list.nomemberList, function(i, v){
            tmpLine = $('<li><div><i class="i-group-2"></i><span title="' + v.groupName + '">' + v.groupName + '</span>(' + v.groupNumber + ')</div><p style="display:none"><a href="javascript:void(0)">�����Ա</a></p></li>');
            tmpLine.find('a').click(function(){
            
                top.$App.show("groupMailAddGroupUser", "&gn=" + v.groupNumber);
            });
            groupList.append(tmpLine);
        });
        var liArray = $(".group-name-list>li");
        liArray.hover(function(){
            $(this).addClass("hover");
            
        }, function(){
            liArray.removeClass("hover");
            
        });
        $(".group-name-list>li:has(div)").hover(function(){
            $(this).addClass("curr").find("div").addClass("group-list");
            $(this).find("p").show();
            var scrolltop = $(this).position().top + 50;
            $(".group-name-list").scrollTop(scrolltop);
        }, function(){
            $(this).removeClass("curr").find("div").removeClass("group-list");
            $(this).find("p").hide();
        });
        
    },
    init: function(){
        var gn = top.Utils.queryString("gn", decodeURIComponent(window.location.href))
        if (gn) {
            setTimeout(function(){
                $("#sl_grouplist option[value='" + gn + "']").attr("selected", true);
            }, 1);
            
        }
    },
    selGroup: function(gn){
        if (gn) {
            setTimeout(function(){
                $("#sl_grouplist option[value='" + gn + "']").attr("selected", true);
            }, 1);
            
        }
    },
    setSider: function(){
        $(".switch-bar>a").click(function(){
            if ($(this).find("i").hasClass("arrow-l")) {
                $(this).find("i").removeClass("arrow-l").addClass("arrow-r");
                $(".group-sider-wrap").show();
                $(".switch-bar")[0].style.right = "";
                $(".group-wrapper")[0].style.marginRight = "";
            }
            else {
                $(this).find("i").removeClass("arrow-r").addClass("arrow-l");
                $(".group-sider-wrap").hide();
                $(".switch-bar")[0].style.right = "0px";
                $(".group-wrapper")[0].style.marginRight = "20px";
            }
        });
    }
}



function setNetLink(files){
    $.each(files, function(i, v){
        ComposeGroupMail.diskCallBack(v);
    });
}
