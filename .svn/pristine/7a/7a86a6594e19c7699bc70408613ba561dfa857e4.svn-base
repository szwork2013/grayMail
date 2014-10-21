/**
* @fileOverview 定义设置页代收邮件的文件.
*/
/**
*@namespace 
*设置页代收邮件
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Home', superClass.extend(
    /**
    *@lends M2012.Settings.Pop.View.Home.prototype
    */
	
    {
    initialize: function () {
        var sid = $T.Url.queryString("sid");
        $("#goBack").attr("href", function () {
            return "pop.html?sid=" + sid;
        });
        this.model = new M2012.Settings.Pop.Model();
        this.initEvents();
        this.type = $T.Url.queryString("type"); // successAndReceive   添加成功后跳转到首页并自动收取邮件
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    /**
    *获取代收文件夹的数据,把数据绑定到模板上，再加载到HTML中。
    */
    render: function () {
        var self = this;
        var result = [];
        var templateStr = $("#popMailTemplate").val();
		//接口合并后，$App.getFolders("pop")和$App.getPopList()中的数据顺序不一致，转换为一致
		function changeOrder(getFolders, getPopList){
			var tmpFolders = {};
			var tmpFoldersOrder = [];
			if(!getFolders || !getPopList){
				return;
			}
			for(var i = 0; i< getFolders.length; i++){
				tmpFolders[getFolders[i]["email"]] = getFolders[i];
			}
			for(var j =0; j<getPopList.length; j++){
				tmpFoldersOrder.push(tmpFolders[getPopList[j]["email"]] || null);
			}
			return tmpFoldersOrder;
		}
        var rp = new Repeater(templateStr);
        this.model.getPOPAccounts(function (datasource) {
            var source = datasource["var"];
			top.publicKey = datasource["publicKey"];
            var popLen = source.length;
            //var data = self.getTop().$App.getFolders("pop");
			var data = changeOrder(top.$App.getFolders("pop"),top.$App.getPopList());
            var len = data.length;
            var folderLen = data.length;
            for (var i = 0; i < len; i++) {
				if(data[i]){
					var name = data[i].email;
					var foldername = data[i].name;
					var size = $T.Utils.getFileSizeText(data[i].stats.messageSize * 1024, {
						maxUnit: "G"
					});
					if (data[i].stats.messageSize == "0") {
						size = "0K";
					}
					result.push({
						email: data[i].email,
						name: foldername,
						unreadMessageCount: data[i].stats.unreadMessageCount,
						messageCount: data[i].stats.messageCount,
						messageSize: size,
						fid: data[i].fid,
						folderPassFlag: data[i].folderPassFlag,
						id: data[i].popId,
						num: i
					})
				}   
            }
            var html = rp.DataBind(result); //数据源绑定后即直接生成dom
            if (source.length == 0) {
                $("#popNoData").show();
                $("#popHasData").hide();
            } else {
                $("#popHasData").show().html(html);

            }
            // 此代码会导致页面刷新的时候，最后一个代收账户自动代收 edit by zhangsixue
            if (popLen > 0) {
                var num = popLen - 1;
                var fid = source[num]["fid"];
                var This = $("#getPopMail_" + fid);
                var options = {
                    id: source[num]["id"]
                }
                if (self.type && self.type == "successAndReceive") {
                    self.freshMail(This, num, options);
                    self.type = ""; //防止删除正在代收的邮箱后，会自动代收下一个邮箱的邮件
                }
            }

            top.BH("pop_load");

        })
        return superClass.prototype.render.apply(this, arguments);
    },
    /**
    *事件处理
    */
    initEvents: function () {
        this.showEditLayer();
        this.hideEditLayer();
        this.addPopMail();
        this.deletePopMail();
        this.editFolderName();
        this.getPopMail();
        //收取所有代收
        this.getPopMailAll();
        //代收记录查询 add by zhangsixue
        $("#getRecords").live("click", function () {
            BH({ key: 'set_pop_queryatmanage' });
            top.$App.show('selfSearch', { type: 2 });
        })
        //    this.getPopMailAll();
    },
    popTime: null,
    /**
    *收取代收邮件 每秒刷新一次
    */
    freshMail: function (This, num, options) {
        var self = this;
        self.model.syncPOPAccount(options, function (dataSource) {
            self.model.getPOPAccounts(function (result) {
            //    var status = result["var"][num]["status"];
							// add by zsx
				if (result["var"][num]) {
					var status = result["var"][num]["status"];
				} else {
					var status = {};
				}
				if(!status){
					console.log(dataSource);
					return false;
				}
                var totalMail = status["messageCount"];
                var receiveMail = status["receivedMessageCount"];
                var html = self.model.messages.getMailHtml;
                html = $T.Utils.format(html, [receiveMail, totalMail]);
                This.html(html);
                self.popTime = setInterval(function () {
                    self.setIntervalPop(This, num, function (text, re) {
                        if (top.$App) {
                            var data = top.$App.getFolders("pop");
                        } else {
                            var data = [];
                        }
                        var len = data.length;
                        This.html(text);
                        for (var i = 0; i < len; i++) {
									// add by zsx
									if (result["var"][num]) {
										var t = result["var"][num]["fid"];
									} else {
										var t = 0;
									}
                            if (data[i].fid == t) {
                                var size = $T.Utils.getFileSizeText(data[i].stats.messageSize * 1024, {
                                    maxUnit: "G"
                                });
                                if (data[i].stats.messageSize == "0") {
                                    size = "0K";
                                }
                                $("#messageCount_" + data[i]["fid"]).html('<span class="c_ff6600">' + data[i]["stats"]["unreadMessageCount"] + '</span>/' + data[i]["stats"]["messageCount"] + '　占用:' + size);
                            }
                        }
                    });
                }, "3000");
            });

        })
    },
    getPopMail: function () {
        var self = this;
        $(".getPopMail").live("click", function () {
            var This = $(this);
            var num = This.parent().attr("num");
            var options = {
                id: This.parent().attr("popId")
            }
            self.freshMail(This, num, options);

        })
    },

    //同步所有的邮件 add by zhangsixue
    getPopMailAll: function () {
        var self = this;
        $("#getAll").live("click", function () {
            self.model.getPOPAccounts(function (result) {
                var length = result["var"].length;
                for (var i = 0; i < length; i++) {
                    var This = $("[num=" + i + "]").find("span").eq(0);
                    var options = {
                        id: result["var"][i]["id"]
                    }
                    self.freshMail(This, i, options);
                }
            });
            BH({ key: 'set_pop_getallatmanage' }); //代收邮件管理页收取全部的人数
        })
    },
    /*
    getPopMailAll: function () {
    var self = this;
    $("#getAll").live("click", function () {
    self.model.getPOPAccounts(function (result) {
    var length = result["var"].length;
    var list = new Array(length);
                
    var ThisArr = [];
    var optionsArr = [];
    for (var j = 0; j < length; j++) {
    list[j] = j;
    ThisArr.push($("[num=" + j + "]").find("a").eq(0));
    optionsArr.push({
    id: result["var"][j]["id"]
    });
    }
    console.log(list.length);
    function ReceivePop() {
    setTimeout(function () {
    popId = list.shift();
    console.log(list.length);
    This = ThisArr.shift();
    options = optionsArr.shift();
    self.freshMail(This, popId, options)
    if (list.length > 0) {
    ReceivePop();
    }
    }, 3000);
    }
    ReceivePop();

    });

    });
    },
    */
    /**
    *收取代收邮件 每次刷新时要显示的界面 收取完成后取消计时器
    */
    setIntervalPop: function (This, num, callback) {
        if (top.$App) {
            top.$App.trigger('reloadFolder', { reload: true });
        }
        var self = this;
        this.model.getPOPAccounts(function (result) {
            if (result["code"] != "S_OK") {
                This.html(self.model.messages.getingMailHtml);
                clearInterval(self.popTime);
                return;
            }
			// add by zsx
            if (result["var"][num]) {
                var status = result["var"][num]["status"];
            } else {
                var status = {};
            }
			if(!status){
				clearInterval(self.popTime);
				return false;
			}
            var totalMail = status["messageCount"];
            var receiveMail = status["receivedMessageCount"];
            var html = self.model.messages.getMailHtml;
            html = $T.Utils.format(html, [receiveMail, totalMail]);
            callback(html, result);
            if (status["code"] && status["code"] == "RUNNING" && status["messageCount"] != 0 && top.$App) {
            } else {
                This.html(self.model.messages.getingMailHtml);
                clearInterval(self.popTime);
            }
        })
    },
    /**
    *鼠标事件 触发修改文件夹名字
    */
    editFolderName: function () {
        var self = this;
		//优化效果，去除无效滑动效果
        $(".folderName").live("mouseover", function () {
			var current = this;
			self.timer2 = setTimeout(function(){
				var name = $(current).text();
				$(".folderInput").hide();
				$(".folderName").show();
				$(current).hide();
				$(current).next().show();
				$(current).next().find("input").val(name);
				self.model.set({ "folder": name });
			},180);
        }).live("mouseout",function(){
			clearTimeout(self.timer2);
		});
        $(".folderNameInput").live("mouseout", function () {
            var This = $(this);
            var val = This.val();
            var obj = {
                id: null,
                status: "rename"
            }
            var text = val == "" ? self.model.get("folder") : val;
            $(".folderName").show();
            $(".folderNameInput").blur();
            This.parent().prev().html($TextUtils.htmlEncode(text)).show();
            This.parent().hide();
            if (text != self.model.get("folder")) {
                if (!self.getTop().$App.checkFolderName(val, obj)) {
                    This.parent().prev().html(self.model.get("folder"));
                    return
                }
                self.updateFolders(text, This);
            }
        })
    },
    callApi: M139.RichMail.API.call,
    /**
    *修改文件夹命名
    */
    updateFolders: function (text, This) {
        var self = this;
        var fid = This.attr("id").split("_")[1];
        var options = {
            fid: fid,
            type: 1,
            name: text
        }
        this.model.updateFolders(options, function (result) {
            if (result["code"] == "S_OK") {
                top.M139.UI.TipMessage.show("文件夹名称修改成功", { delay: 2000 });
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                self.render();
            }

        });
    },
    /**
    *删除代收邮件
    */
    deletePopMail: function () {
        var self = this;
        $(".popDelete").live("click", function () {
            var This = $(this);
            var email = This.attr("email");
            var popup = M139.UI.Popup.create({
                target: This,
                icon: "i_warn",
                width: "342",
                buttons: [{ text: "确定", cssClass: "btnSure", click: function () { self.deleteFolders(This, email); clearInterval(self.popTime); popup.close(); } },
		                { text: "取消", click: function () { popup.close(); } }
	                ],
                content: '<p class="norTipsLine">删除"' + email + '"</p><p><label><input type="radio" checked id="moveMail" name="delete" class="mr_5" value="">邮件和文件夹都删除</label></p><p><label><input name="delete" type="radio" class="mr_5" value="">只删除文件夹，将邮件移动到“收件箱”中</label></p>'
            });

            popup.render();
        })
    },
    /**
    *修改代收邮件设置
    */
    modPOPAccount: function (obj, callback) {
        var self = this;
        var password = $("#popPassword").val();
        $("#sslEvent").bind("click", function () {
            var popPort = $("#popPort");
            if ($("#popSSL").attr("checked")) {
                if (obj.popType == 1) {
                    popPort.val(993);
                } else {
                    popPort.val(995);
                }
            } else {
                if (obj.popType == 1) {
                    popPort.val(143);
                } else {
                    popPort.val(110);
                }
            }
        })
        $("#btnOk" + obj.fid).bind("click", function () {
            $("#sslEvent").after(self.model.messages.loadingText);
            $("#yellowtips").hide();
            var server = $("#popServer").val();
            var id = $("#popServer").val();
            var port = $("#popPort").val();
            var username = $("#popMail").val();
            var isSSL = $("#popSSL").attr("checked");
            var isaoto = $("#checkboxGet2").attr("checked") == "checked" ? 1 : 0; //add by zhangsixue
            var options = {
                item: {
                    opType: "mod",
                    id: obj.id,
                    server: server,
                    port: port,
                    popType: obj.popType,
                    username: username,
                    leaveOnServer: obj.leaveOnServer,
                    timeout: obj.timeout,
                    fid: obj.fid,
                    folderName: obj.folderName,
                    isSSL: 0,
                    isAutoPOP: isaoto,
                    flag: self.model.get("flag")
                }
            };
            var modPassword = $("#popPassword").val();
			
            if (password != modPassword) {
            	if(top.publicKey){
            		var key2	= new RSAKeyPair("10001", '', top.publicKey); 
            //    options.password = modPassword; 改为加密传输，上面为产生密码，下面为加密。
					options.password = encryptedString(key2, modPassword);
            	}else{
            		options.password = modPassword;
            	}
            }
            if (isSSL) {
                options.isSSL = 1;
            }
            self.model.modPOPAccount(options, function (result) {
                if (result["code"] == "S_OK") {
                    $("#popmailTips .content-text").html(self.modSuccessHtml());
                    setTimeout('$("#popmailTips").parent().parent().remove()', 2000);
                    $(".loadingtext").remove();
                    top.$App.trigger("userAttrChange", { callback: function () {
                        top.$App.trigger('reloadFolder', { reload: true });
                        callback();
                    }
                   });

                } else {
                    $(".loadingtext").remove();
                    $("#yellowtips").show();
                }

            });
            return
        });
    },
    /**
    *删除代收邮件
    */
    deleteFolders: function (This, email) {
        var self = this;
        var fid = This.attr("id").split("_")[1];
        var folderPass = This.attr("folderpassflag");
        if (folderPass == 1) {
            self.getTop().$Msg.alert(
                        self.model.messages.lockedFolder,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
            return;
        }
        var type = $("#moveMail").attr("checked") ? "delete" : "deleteWithoutFolder";
        var options = {
            id: This.parent().attr("popId"),
            opType: "delete"
        }
        var data = {
            fid: fid,
            recursive: 0,
            ignoreCase: 0,
            isSearch: 1,
            isFullSearch: 0,
            start: 1,
            total: 1,
            limit: 10000
        };
        if (type == "deleteWithoutFolder") {
            this.model.searchMessages(data, function (result) {
                if (result["code"] == "S_OK") {
                    var moveData = {
                        ids: result["var"]["mid"],
                        newFid: 1
                    }
                    self.model.moveMessages(moveData, function () {
                        top.$App.trigger("userAttrChange", { callback: function () {
                            top.$App.trigger('reloadFolder', { reload: true });
                        }
                        })
                    })
                } else {
                    top.$Msg.alert(
                                self.model.messages.delPOPFail,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                    return
                };
            })
        } else {
        }
        this.model.delPOPAccount(options, function (dataSource) {
            if (dataSource["code"] == "S_OK") {
                var text = $T.Utils.format(self.model.messages.delPOPSuccess, [email]);
                top.M139.UI.TipMessage.show(text, { delay: 2000 });
                var obj = $("#popTr_" + fid);
                //  console.log(obj.siblings().length)
                //  self.render();
                //  只能移除此行，不能刷新页面，不然其他的代收会延迟,应该是移除当前行，并判断是否为最后一行。
                obj.remove();
                self.model.getPOPAccounts(function (datasource) {
                    var source = datasource["var"];
                    var popLen = source.length;
                    var data = self.getTop().$App.getFolders("pop");
                    var len = data.length;
                    var folderLen = data.length;
                    if (source.length == 0) {
                        $("#popNoData").show();
                        $("#popHasData").hide();
                    }
                });
                clearInterval(self.popTime)

            }

        })
    },
    /**
    *显示修改代收邮件的界面，并获取该条代收邮件的信息填充进HTML页面
    */
    showEditLayer: function () {
        var self = this;
        $("#popHasData").find(".popEdit").live("click", function () {
            if ($("#popmailTips").length > 0) {
                $("#popmailTips").parent().parent().remove()
            }
            var This = $(this);
            var index = This.parent().attr("num");
            self.model.getPOPAccounts(function (datasource) {
                var data = datasource["var"][index];
                var obj = {
                    username: data["username"],
                    port: data["port"],
                    isSSL: data["isSSL"],
                    server: data["server"],
                    popType: data["popType"],
                    checked: "",
                    id: data["id"],
                    fid: data["fid"],
                    leaveOnServer: data["leaveOnServer"],
                    timeout: data["timeout"],
                    folderName: data["folderName"],
                    popText: "",
                    isAuto: "" //add by zhangsixue
                }
                obj.isAuto = data["isAutoPOP"] === 1 ? "checked = 'checked'" : "";
                obj.checked = data["isSSL"] == 1 ? "checked" : "";
                obj.popText = data["popType"] == 1 ? "IMAP" : "POP";
                This.parent().parent().after(self.editHtml(obj))
                self.modPOPAccount(obj, function () {
                    self.render();
                });
            })
        })
    },
    /**
    *代收邮件首页点击修改设置链接的浮层状态
    */
    hideEditLayer: function () {
        $("#popHasData .i_u_close,#btnCancel").live("click", function () {
            $("#popmailTips").parent().remove();
        })
    },
    /**
    *添加代收邮件按钮点击事件
    */
    addPopMail: function () {
        var self = this;
        $("#btn_addpop1,#btn_addpop2").live("click", function () {
            var pop = top.$App.getFolders("pop");
            if (pop.length >= 8) {//代收邮件个数最多8个
                self.getTop().$Msg.alert(
                                self.model.messages.maxsMailsNum,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                return
            }
            var sid = $T.Url.queryString("sid");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            window.location = "add_pop.html?sid=" + sid;
            $("#popUsername").focus();
        })
    },
    modSuccessHtml: function () {
        var html = ['<div class="collection-ok">',
        '<i class="i_ok_min mr_5"></i><strong>修改设置成功</strong>',
        '</div>'].join("");
        return html;
    },
    /**
    *代收首页 修改代收设置的浮层HTML
    */
    editHtml: function (obj) {
        var html = ['<tr>',
                        '<td colspan="4">',
                        '<div class="tips cillection-tips" id="popmailTips">',
                                '<div class="tips-text">',
                                    '<div class="content-text">',
                                             '<ul class="form form-collection">',
                                                    '<li class="formLine">',
                                                        '<label class="label">要代收的邮箱：</label>',
                                                        '<div class="element">',
                                                                '<input id="popMail" type="text" class="iText" value="' + obj.username + '" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">邮箱密码：</label>',
                                                        '<div class="element">		',
                                                                    '<input id="popPassword" type="password" class="iText" value="**********" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">邮件接收服务' + obj.popText + '：</label>',
                                                        '<div class="element">',
                                                                    '<input id="popServer" disabled type="text" class="iText" value="' + obj.server + '" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">端口：</label>',
                                                        '<div class="element">		',
                                                                    '<div><input id="popPort" type="text" class="iText" value="' + obj.port + '" /><span class="gray ml_10"></span></div>',
                                                                    '<div class="gray">标准端口号为110</div>',
                                                                    '<div><label for="popSSL" id="sslEvent"><input id="popSSL" type="checkbox" ' + obj.checked + ' value="" class="mr_5" />此服务器要求加密连接(SSL)</label></div>',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet2" ' + obj.isAuto + ' class="mr_5"><label for="checkboxGet2" class="mr_10">自动收取</label>',
                '</div>',
           '</li>',
                                                '</ul>	',
                                                '<div class="collection-ok hide"><!-- 修改成功 -->',
                                                    '<i class="i_ok_min mr_5"></i><strong>修改设置成功</strong><br />',
                                                    '2秒后该区域收起',
                                                '</div>',
                                        '</div>',
                                        '<div class="tips-btn">',
                                            '<a href="javascript:void(0)" class="btnNormal " id="btnOk' + obj.fid + '"><span>确 定</span></a>	<a href="javascript:void(0)" class="btnNormal " id="btnCancel"><span>取 消</span></a>',
                                        '</div>',
                                        '<div id="yellowtips" class="tips yellowtips" style="left:457px;top:25px;display:none;">',
                                        '<div class="tips-text">',
                                            '<strong>验证失败</strong>',
                                            '原因可能是：<br />',
                                            '1.邮箱地址和密码不匹配；<br />',
                                            '2.pop地址不正确或端口打不开；<br />',
                                            '3.需在要代收邮箱的设置中手动开启POP功能。',
                                        '</div>',
                                        '<div class="tipsLeft diamond"></div>',
                                    '</div>',
                                '</div>',
                                '<a class="i_u_close" href="javascript:void(0)"></a>',
                                '<div class="tipsTop diamond"></div>',
                            '</div>',
                        '</td>',
                    '</tr>'].join("");
        return html;
    }
})
    );
popHomeView = new M2012.Settings.Pop.View.Home();
popHomeView.render();
})(jQuery, _, M139);


