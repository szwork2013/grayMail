/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      shareFile.js
* 檔功能描述：  文件共享的js功能类,对应dialogShareFile.htm
* 創建人：      lizg  
* 創建日期：    2011/12/31
* 修改人：            
* 修改日期：
* 程式版次： 
* 修改描述：           
*/
//共享模式
var shareMode = {
    Default: "default",
    Photo: "photo",
    Album: "album",
    Music: "music"
};
var shareFile = {
    //彩云窗体
    parent: DiskTool.getDiskWindow(),
    //电话号码串
    //用于记录手动输入的号码
    reciverByHand: "",
    //标识有新号码添加进通讯录
    isAddContact: false,
	//最大共享人数
	maxShareNum: "",
    //获取父页面选择的文件/文件夹
    parentFile: [],
    //服务器请求地址
    url: {
        //我的共享列表
        getMyShareListUrl: function() {
            return DiskTool.resolveUrl("getMyShareList", true);
        },
        //好友共享文件列表
        getFriendShareListUrl: function() {
//            return DiskTool.resolveUrl("getFriendShareList", true);
            return DiskTool.resolveUrl("friendShareList", true);//join_mcloud
        },
        //获取共享好友列表
        getMyFriendListUrl: function() {
            return DiskTool.resolveUrl("getMyFriendList", true);
        },
        //共享文件
        getShareResourceUrl: function() {
//            return DiskTool.resolveUrl("shareResource", true);
            return DiskTool.resolveUrl("share", true);//join_mcloud
        },
        //取消共享
        getDeleteShareUrl: function() {
            return DiskTool.resolveUrl("deleteShare", true);
        },
        //获取文件被共享的所有用户列表
        getRecUserList: function() {
//            return DiskTool.resolveUrl("getRecUserList", true);
            return DiskTool.resolveUrl("shareDetail", true);
        }
    },

    //提示语
    messages: {
        Empty: "请添加分享人！",
        MinFileCount: "共享内容不能为空！",
        SameRecvName: "接收人手机号码不能重复，请重新输入！",
        LenNotEnough: "请输入完整的手机号码！",
        NotMobile: "只可共享给中国移动用户！",
        ChinaMobile: "联系人手机号码必须为中国移动用户，以下联系人手机号码不符合规定：{0}",
        MaxRecName: "最多填写{0}个接收人！",
        ShareFailure: "共享失败，请稍后再试。",
        ShareSuccess: "共享成功！您的好友将收到短信提醒!",
        InputVerifyCode: "请输入验证码",
        verifyCodeError: "验证码错误，请重新输入",
        LimitFileShare: "您今天的文件共享次数已达到最大限制，请明天再试！",
        ShareTooMuch: "共享过于频繁，请30分钟后再试!"
    },

    //事件
    action: {
        //页面加载
        pageLoad: function() {
            $(function() {
                // 设置页面元素呈现
                shareFile.tool.visible("pAllClear", false);
                $("#hidReciver").val("");

                //获取选择的文件/文件夹
                shareFile.parentFile = shareFile.tool.getShareFile();
				
				//显示最大共享数(套餐升级)
				if (top.SiteConfig.comboUpgrade) {
					var win = DiskTool.getDiskWindow();
                    var diskModel = win.mainView.model;
                    var diskInfo = diskModel.get("diskInfo");
					if(diskInfo.shareNum) {
						shareFile.maxShareNum = diskInfo.shareNum;
					} else {
						shareFile.maxShareNum = 20;
					}
					
					if(top.$User.getServiceItem() == top.$User.getVipStr("20")) {//20元版的套餐升级隐藏掉增加共享人数连接
						$('#disk_AddShareNum').hide();
					}
				} else {
					shareFile.maxShareNum = 20;
				}
				$('#spMaxShareNum').text(shareFile.maxShareNum);
                //清空手动输入联系人号码记录
                shareFile.reciverByHand = "";
				
                var map = {
                    aAddRec: function() {
                        var recNum = $("#txtRecName").val().trim();
                        shareFile.action.addReciver(recNum);
                    },
                    spanAddDisplay: shareFile.action.showShareTo,
                    spanAddedDisplay: shareFile.action.showAlreadyShare,
                    allClear: shareFile.action.clearAllShare,
                    aCancel: top.FloatingFrame.close,
                    aSumbit: function() {
                        if (shareFile.tool.checkData()) {
                            shareFile.action.submitData();
                        }
                    }
                };
                DiskTool.registerAnchor(map, function(val) { return val; });
                //呈现共享列表
                shareFile.render.renderShare();
                //呈现通讯录
                shareFile.render.renderAddress();
                //设置输入框事件
                shareFile.action.setInputEvent();
                //智能匹配
                top.Contacts.init("mobile", window);
                AutoCompleteMenu.createPhoneNumberMenuFromLinkManList($("#txtRecName")[0], true);
            });
        },

        //显示“共享给”用户列表
        showShareTo: function() {
            //隐藏“已共享”
            $("#ulReceveAdded").hide();
            //显示“共享给”、手动输入框
            $("#ulReceve").show();
            $(".addPhone").show();
            //“共享给”有数据项则显示“全部清除”按钮
            var currentSize = parseInt($("#spAdd").text()) || 0;
            if (currentSize > 0) {
                shareFile.tool.visible("pAllClear");
            }
            //交换样式
            $("#spanAddDisplay").addClass("current");
            $("#spanAddedDisplay").removeClass("current");
        },

        //显示“已共享”用户列表
        showAlreadyShare: function() {
            //隐藏部分页面元素
            $("#ulReceve").hide();
            $(".addPhone").hide();
            shareFile.tool.visible("pAllClear", false);
            //显示“已共享”列表
            $("#ulReceveAdded").show();
            //交换样式
            $("#spanAddedDisplay").addClass("current");
            $("#spanAddDisplay").removeClass("current");
        },

        //设置手动输入框事件
        setInputEvent: function() {
            $("#txtRecName").focus(function() {
                if (this.value == $(this).attr("defaultValue")) this.value = "";
            }).blur(function() {
                if (this.value == "") this.value = $(this).attr("defaultValue");
            }).keyup(function(e) {
                if (e.keyCode == 13) { $("#aAddRec").click(); }
            }).keydown(function(e) {
                if (e.keyCode == 8 && !e.ctrlKey && !e.shiftKey) {
                    var p = getTextBoxPos(this); //controls.js
                    if (!p || p.start != p.end || p.start == 0 || p.start < this.value.length) return;
                    var lastValue = this.value;
                    var deleteChar = lastValue.charAt(p.start - 1);
                    if (/[;,；，]/.test(deleteChar)) {
                        var leftText = lastValue.substring(0, p.start);
                        var rightText = lastValue.substring(p.start, lastValue.length);
                        var cutLeft = leftText.replace(/(^|[;,；，])[^;,；，]+[;,；，]$/, "$1$1");
                        this.value = cutLeft + rightText;
                    }
                }
            });
        },

        //清除所以“已共享”
        clearAllShare: function() {
            $("#ulReceve").empty();
            $('#spAdd').text("0");
            $('#hidReciver').val("");
            shareFile.tool.visible("pAllClear", false);
        },

        //删除共享项
        removeItem: function(i) {
            if ($(".file-list li").length == 1) {
                shareFile.tool.showMsgDny(shareFile.messages.MinFileCount);
                return;
            }
            $("#li{0}".format(i)).remove();
            var spFilecnt = $("#spFilecnt");
            var count = parseInt(spFilecnt.text() || 0);
            if (count > 0) {
                spFilecnt.text(count - 1);
            }
        },

        //添加共享用户列表项
        addReciver: function(number, isDefault) {
            number = number.replace("+", "");
            //是否来自"已共享"接收人
            isDefault = isDefault || false;
            var recItem = new shareFile.listItemPlugin();
            var rexMobile = /<(86)?(\d{11})>/;
            var localRecUl = $(isDefault ? "#ulReceveAdded" : "#ulReceve");
            var txtRecName = $("#txtRecName");
            var recNumbers = number.split(",");
            var checkNum = null;

            for (var i = 0, length = recNumbers.length; i < length; i++) {
                var recNo = recNumbers[i].trim();
                if (recNo.length == 0) {
                    continue;
                }
                //手机号码不够11位
                if (recNo.length < 11) {
                    shareFile.tool.showMsgDny(shareFile.messages.LenNotEnough, "mobile");
                    return false;
                }
                //共享接收人不能超过20个
                if (!isDefault && localRecUl.find("li").length >= shareFile.maxShareNum && !recItem.isExists(recNo)) {
                    localRecUl.find("li span").removeClass();
                    shareFile.tool.showMsgDny(shareFile.messages.MaxRecName.format(shareFile.maxShareNum), "mobile");
                    return false;
                }
                //判断是否是中国移动的电话号码
                checkNum = rexMobile.test(recNo) ? rexMobile.exec(recNo)[2] : recNo;
                if (!Utils.isChinaMobileNumber(checkNum)) {
                    shareFile.tool.showMsgDny(shareFile.messages.NotMobile, "mobile");
                    return false;
                }
                //接收人来自通讯录
                if (rexMobile.test(recNo) || isDefault) {
                    recItem.add(recNo, checkNum, isDefault);
                }
                //接收人来自手动输入，同时记录输入的手机号码
                else {
                    recItem.add('"{0}"<{1}>'.format(recNo, recNo), checkNum);
                    shareFile.reciverByHand += ",{0}".format(recNo);
                }
                var rxReplace = /\+?(86)?(\d{11})\s*,/;
                if (txtRecName.val().indexOf(",") > 1) {
                    txtRecName.val(txtRecName.val().replace(rxReplace, ""));
                } else {
                    txtRecName.val("");
                }
            }
        },

        //设置共享
        submitData: function() {
            var recName = null;
            var fileIds = [];
            var folderIds = [];
            var comeFrom = null;
            var mode = shareFile.tool.getShareMode();
			DiskTool.addDiskBehavior({
				actionId: 405,
				thingId: 0,
				moduleId: 14,
				actionType: 12
			});
            //DiskTool.addDiskBehavior(405, 14, 12);
            $("#pDoing").show();
            //获取共享号码
            recName = $("#hidReciver").val().trim();
            recName = recName.replace(/，/g, ",");
            recName = recName.length > 0 ? recName.substring(1) : recName;

            //遍历有所有的“共享给”项，找出共享内容id
            $(".file-list li input").each(function() {
                if (this.value.length == 0) {
                    return true;
                }
                var vals = this.value.split(",");
                if (vals[1] == "2" || vals[1] == "0") {
                    fileIds.push(vals[0]);
                } else {
                    folderIds.push(vals[0]);
                }
            });
            //获取共享内容来源标识
            switch (mode) {
                case shareMode.Album: comeFrom = 1; break;
                case shareMode.Music: comeFrom = 2; break;
                default: comeFrom = 0;
            }
			
			var shareType = 0;
			var dirType = top.M139.Text.Url.queryString("dirType", location.search); // add by tkh 分享文件的所属目录类型
			if(dirType == 3){
				shareType = 1;
			}
			if(dirType == 4){
				shareType = 2;
			}

            var currentShareFile = shareFile.parentFile[0];
            var shareDirType = currentShareFile.type == "directory" ? currentShareFile["directory"]["dirType"] : 1;

            //设置共享
            shareFile.server.shareResource({
                receiverNumber: recName,
                fileIds: fileIds.join(","),
                folderIds: folderIds.join(","),
                dirType: shareDirType,
                shareComefrom: shareType
                //shareComefrom: comeFrom
            }, function() {
                shareFile.action.addContact();
                DiskTool.FF.alert(this.summary, function() {
//                    shareFile.parent.Toolbar.refreshList();
                //    shareFile.parent.mainView.model.trigger("refresh");
                    shareFile.parent.mainView.model.set('shareFileId', []);
                    DiskTool.FF.close();
                });
            });
        },

        //将联系人添加到通讯录
        addContact: function() {
            var numbers = shareFile.reciverByHand.split(",");
            var list = [];
            //初始化标识
            shareFile.isAddContact = false;

            //遍历找出新号码
            $.each(numbers, function(i, n) {
                n = $.trim(n);
                if (n.length == 0) {
                    return true;
                }
                if (!top.Contacts.isExistMobile(n)) {
                    var contact = new top.ContactsInfo();
                    contact.name = n;
                    contact.email = "";
                    contact.mobile = n;
                    contact.groupId = "";
                    list.push(contact);
                    shareFile.isAddContact = true;
                }
            });
            //添加号码到通讯录
            if (shareFile.isAddContact) {
                //window.top.Contacts.addContacts(list);
                //新版添加联系人不支持批量处理 todo
                for (var i = 0, l = list.length; i < l; i++) {
                    top.M2012.Contacts.API.addContacts(list[i], function (result) {
                        if (result.success) {
                            top.M139.UI.TipMessage.show("添加成功", { delay: 3000 });
                        } else {
                            top.M139.UI.TipMessage.show("添加失败", { delay: 3000 });
                        }
                    });
                }
            }
        }
    },

    //呈现
    render: {

        //呈现通讯录联系人
        renderAddress: function() {
            var obj = {};
            obj.container = $("#addressList")[0];
            obj.type = "mobile";
            obj.callback = "shareAddReciver"; // "shareFile.action.addReciver"; //"setMobile";
            obj.withName = true;
            obj.width = "230px";
            obj.autoWidth = false;
            obj.hideTitle = true;
            top.Contacts.createAddressPage(obj);
        },

        //呈现共享内容
        renderShare: function() {
            var mode = shareFile.tool.getShareMode();
            var list = null;
            var adpter = [];

            $(".file-list").empty();

            if (top.SiteConfig.isDiskDev) {
                list = shareFile.parentFile;
            } else {
                if (mode == shareMode.Default || mode == shareMode.Music) {

                    list = shareFile.parent.DiskTool.Toolbar.getAllSelectedRow();
                }
                else if (mode == shareMode.Album) {
                    list = shareFile.parent.album.tool.getAllSelectedRow();
                }
                else if (mode == shareMode.Photo) {
                    list = shareFile.parent.albumPhoto.tool.getAllSelectedRow();
                }
            }


            //呈现“共享给”联系人列表
            //1:文件夹  2:文件  3:相册 4:音乐专辑
            if (list && list.length > 0) {
                var obj = {};
                $.each(list, function(i, n) {
                    if (top.SiteConfig.isDiskDev) {
                        obj.name = n.name;
                        obj.id = n.id;
                        obj.type = n.type;

                        switch (mode) {
                            case shareMode.Default:
                                break;
                            case shareMode.Album:
                                obj.type = 3;
                                break;
                            case shareMode.Photo:
                                obj.type = 2;
                                break;
                            case shareMode.Music:
                                obj.name = (n.type == 1) ? n.className : n.fileName;
                                obj.id = (n.type == 1) ? n.classId : n.fileId;
                                obj.type = (n.type == 1) ? 4 : 2;
                                break;
                        }
                    } else {
                        switch (mode) {
                            case shareMode.Default:
                                obj.name = n.filename || n.srcfilename;
                                obj.id = n.fileid;
                                obj.type = n.type || n.filetype;
                                break;
                            case shareMode.Album:
                                obj.name = n.albumName;
                                obj.id = n.albumId;
                                obj.type = 3;
                                break;
                            case shareMode.Photo:
                                obj.name = n.title;
                                obj.id = n.fileId;
                                obj.type = 2;
                                break;
                            case shareMode.Music:
                                obj.name = (n.type == 1) ? n.className : n.fileName;
                                obj.id = (n.type == 1) ? n.classId : n.fileId;
                                obj.type = (n.type == 1) ? 4 : 2;
                                break;
                        }
                    }

                    //呈现该项
                    var ext = shareFile.tool.getTypeCss(obj.name, obj.type);
                    var li = $(
                    "<li id='li{5}' title='{0}'>\
                        <i class='{1}'></i>{2}\
                        <input id='hidid{5}' type='hidden' value='{3},{4}' />\
                        <i class='i-delete' style='cursor:pointer;' ></i>\
                    </li>".format(Utils.htmlEncode(obj.name), ext, shareFile.tool.getShortName(obj.name), obj.id, obj.type, i)).appendTo(".file-list");
                    li.find("i.i-delete").click(function() { shareFile.action.removeItem(i); });
                    adpter.push(obj);
                });
            }
            //设置共享内容统计个数
            $("#spFilecnt").text(adpter.length);
            //呈现已共享联系人列表
            if (adpter.length == 1) {
                shareFile.server.getRecUserList(adpter[0].id, function() {
                    if (!this || this.length == 0) {
                        return;
                    }
                    var defaultVal = "";
                    $.each(this, function() {
                        var shortName = this.recvuserNumber;
                        if (shortName && shortName.length == 13) {
                            shortName = shortName.substring(2);
                        }
                        var alias = (this.alias ? this.alias : shortName);
                        var shareList = top.Contacts.getSingleContactsByMobile(this.recvuserNumber, true);
                        alias = (shareList && shareList.Name) ? shareList.Name : alias;
                        defaultVal += '"{0}"<{1}>,'.format(alias, shortName);
                    });
                    if (defaultVal.length > 0) {
                        shareFile.action.addReciver(defaultVal, true);
                    }
                });
            }
        }
    },

    //服务器请求
    server: {
        //获取已共享联系人列表
        getRecUserList: function(fileId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return
            };
            $.postXml({
                url: shareFile.url.getRecUserList(),
                data: XmlUtility.parseJson2Xml({
//                    fileId: fileId.toString()
                    shareObjId: fileId.toString()
                }),
                success: function() {
                    //处理数据
                    if (this.code == DiskConf.isOk) {
                        if (callback) {
                            callback.call(this["var"].recUserList);
                        }
                    } else {
                        alert(this.summary);
                        //DiskTool.FF.alert(this.summary);
                    }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //共享操作
        shareResource: function(params, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: shareFile.url.getShareResourceUrl(),
                data: XmlUtility.parseJson2Xml({
                    shareFileIds: params.fileIds,
                    shareDirIds: params.folderIds,
                    dirType: params.dirType,
                    recvUserNumbers: params.receiverNumber
                }),//join_mcloud
                success: function() {
                    $("#pDoing").hide();
                    //处理数据
                    if (this.code == DiskConf.isOk) {
                        if (callback) {
                            callback.call(this);
                        }
                    } else { DiskTool.FF.alert(this.summary); }

                },
                error: function(error) {
                    $("#pDoing").hide();
                    DiskTool.handleError(error);
                }
            });
        }
    },

    //工具类
    tool: {
        //获取共享操做方式
        getShareMode: function() {
            var mode = "default";
            var url = shareFile.parent.location.href.toLowerCase();
            var rules = {
                "default": "disk_default.html",
                "photo": "disk_photolist.html",
                "album": "album.html", //坑爹的判断方式，居然用文件名来决定逻辑
                "music": "disk_music.html"
            };
            $.each(rules, function(name, value) {
                if (url.indexOf(value) > -1) {
                    mode = name;
                    return false;
                }
            });
            return mode;
        },
        getShareFile: function(){
            var files;
            var diskModel = shareFile.parent.mainView.model;

            if (top.M139.Text.Url.queryString("shareType", location.search) == "batch") {// update by tkh单击工具栏命令按钮分享的是批量选中的文件
                files = diskModel.getSelectedDirAndFiles();
            } else {// 单击文件列表超链接分享的是单个文件
                files = diskModel.getShareFile();
            }

            //兼容处理，如果选择的是文件，将type='file' 改为2
            var newFiles = jQuery.extend(true, [], files);
            for (var i = 0, len = newFiles.length; i < len; i++) {
                var file = newFiles[i];
                if (file.type == "file" || file.ext) {
                    file.type = 2;
                }
            }

            return newFiles;
        },
        //动态显示，3秒后隐藏
        showMsgDny: function(msg, type, delayTime) {
            var delay = delayTime || 3000;
            if (type == "mobile") {
                $("#errorMsgMobile").text(msg);
                $("#divMsgMobile").show();
                $("#divMsgMobile").fadeOut(delay);
            }
            else {
                $("#msgShare").text(msg);
                $("#pMsgShare").show();
                $("#pMsgShare").fadeOut(delay);
            }
        },
        //获取信息项的类型
        getTypeCss: function(name, type) {
            if (type == "directory") {
                return "fold";
            }

            var pn = /.*\.(\w+)$/;
            if (pn.test(name)) {
                var fileExt = pn.exec(name)[1].toLowerCase();
                var exts = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.eml,.zip,.rar,.jar,.iso,.jpg,.jpeg,.gif,.png,.bmp,.chm,.htm,.html,.unknown,.exe,.swf,.avi,.rm,.rmvb,.wmv,.mp3,.wav,.mid,.wav,.flv";
                return exts.indexOf(fileExt) > -1 ? fileExt : "unknown";
            }
            return "fold";
        },
        //长文件名简写
        getShortName: function(name) {
            name = name ? name : "";
            if (name.length > 40) {
            	if(name.indexOf('.') != -1){ // update by tkh 解决bug :没有拓展名的文件会报错
            		name = name.substr(0, 35) + "...." + /.*\.(\w+)$/.exec(name)[1];
            	}else{
            		name = name.substr(0, 35) + "....";
            	}
            }
            return Utils.htmlEncode(name);
        },
        //检查输入信息
        checkData: function() {
            var recName = $("#hidReciver").val().trim();
            var length = $("#ulReceve").find("li").length;
            if (length == 0 || recName.length == 0) {
                shareFile.tool.showMsgDny(shareFile.messages.Empty, "mobile");
                return false;
            }
            return true;
        },
        //设置层的显示隐藏
        visible: function(id, v) {
            if (typeof v == "undefined" || v.constructor != Boolean) {
                v = true;
            }
            var s = v ? "visible" : "hidden";
            $("#" + id).css({ visibility: s });
        }
    },
    //共享联系人项
    listItemPlugin: function() {
        this.rexMobile86 = /(86)?(\d{11})/;
    }
};
//共享联系人项操作
shareFile.listItemPlugin.prototype = {
    //共享联系人项
    isExists: function(val) {
        var rex = /<(86)?(\d{11})>/;
        var mobileNo = rex.test(val) ? rex.exec(val)[2] : val;
        var li = $("#ulReceve").find("li[key='{0}']".format(mobileNo));
        return li.length > 0;
    },

    /* 给共享人(共享给/已共享)添加项
    * val: xxx<13900000001>
    * isDefault：表示添加的项是否是"已共享"*/
    add: function(val, number, isDefault) {
        var ulContainer = $("#{0}".format(isDefault ? "ulReceveAdded" : "ulReceve"));
        var spCounter = $("#{0}".format(isDefault ? "spAdded" : "spAdd"));
        var mobileNo = this.rexMobile86.exec(number)[2];
        //清除所有项的样式
        ulContainer.find("li span").removeClass();
        //添加重复的联系人高亮标注
        if (this.isExists(val)) {
            ulContainer.find("li[key='{0}']".format(mobileNo)).find("span").addClass("added");
            return;
        }

        //已经添加人数
        var currentSize = parseInt(spCounter.text()) || 0;
        var li = $("<li key='{0}' title='{1}'><span>{1}</span></li>".format(mobileNo, val));

        // “共享给” 联系人列表展示
        if (!isDefault) {
            li.append($("<a href='javascript:;'></a>"));
            shareFile.tool.visible("pAllClear");
            if (this.rexMobile86.exec(number).length == 3) {
                number = "86" + this.rexMobile86.exec(number)[2];
            }
            //给隐藏域赋值
            var hidReciver = $("#hidReciver");
            hidReciver.val("{0},{1}".format(hidReciver.val(), number));

            //删除项操作
            li.find("a").click(function() {
                var rexMobile = /<(86)?(\d{11})>/;
                var hidReciver = $("#hidReciver");
                var num = rexMobile.exec(li.attr("title"))[2];
                hidReciver.val(hidReciver.val().replace(",86{0}".format(num), ""));
                li.remove();
                //刷新计数
                var count = parseInt(spCounter.text()) || 0;
                count = count >= 1 ? (count - 1) : 0;
                spCounter.text(count);
                if (count == 0) {
                    shareFile.tool.visible("pAllClear", false);
                }
            });
        }
        ulContainer.append(li);
        spCounter.text(++currentSize);
    }
};

//通讯录点击行触发事件
function shareAddReciver(number, isDefault) {
    shareFile.action.addReciver(number, isDefault);
}
