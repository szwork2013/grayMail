M139.namespace("M2012.Mailbox.View", {
	Command: Backbone.View.extend({
		el: "",
		initialize: function (options) {
			this.model = options.model;
			var self = this;
			$App.on("mailCommand", function (args) { //监听其它模块发起的菜单命令
				console.log(args);
				self.doCommand(args.command, args);
			});


		},
		createInstance: function (options) {
			if (!$App.getView("mailCommand")) {
				$App.registerView("mailCommand", new M2012.Mailbox.View.Command(options));
			}
			return $App.getView("mailCommand");
		},
		mailValidate: function (command, args) {
		    if ($App.isMailbox() && args.mids) {
		        var listEl = $($App.getMailboxView().el);
		        switch (args.command) {
		            case "tag":
		                $(args.mids).each(function (i, n) {
		                    var elem = listEl.find("tr[mid=" + n + "]").find(".TagDiv");

		                    //  如果存在则不重复添加
		                    if (elem.find('[tagid='+ args.labelId +']')[0]) return true;

		                    var tagView = M2012.Mailbox.View.MailTag.prototype.createInstance()
		                    elem.append(tagView.render([args.labelId]));
		                });
		                return true;
		                break;
		            case "mark":
		                if (args.type == "starFlag") {
		                    $(args.mids).each(function (i,n) {
		                        var elem = listEl.find("tr[mid=" + n + "]").find("[name=list_starmail]");
		                        elem.removeClass().addClass(args.value == 1 ? "i_starM_y" : "i_starM");
		                    });
		                    return true;
		                    
		                } else if (args.type == "read") {
		                    $(args.mids).each(function (i, n) {
		                        var jRow = listEl.find("tr[mid=" + n + "]");
		                        if (args.value == 0) { //标已读
		                            jRow.find("h3").removeClass();
		                            jRow.find("[name=from]").removeClass("fw_b");
		                            jRow.find(".i_m_n").removeClass().addClass("i_m_o");
		                        } else {
		                            jRow.find("h3").addClass("fw_b");
		                            jRow.find("[name=from]").addClass("fw_b");
		                            jRow.find(".i_m_o").removeClass().addClass("i_m_n");
		                        }
		                    });
		                    return true;
		                }
		                break;
		            
		        }
		    }
		},
		// 邮件操作核心函数
		// 所有的操作都通过这个命令执行
		doCommand: function (command, args) {

			if (!args) { args = {} };//未传则置空
			var self = this;
			var folderModel = $App.getView("folder").model;//获得文件夹model的引用
			var mailboxModel = $App.getMailboxView().model;//订阅邮件多实例特殊处理
			var model = mailboxModel;
			
			var fid = mailboxModel.get('fid');
			var mids;
			var sessionIds; //会话sessionIds
			var sessionMids;//标签用到
			var isSessionMode = $App.isSessionMode();
			var selectOO = this.getSelectedMail();
			var superSelectOO = mailboxModel.superSelectResult || {};			

			var mailtype = args.mailtype || ''; //mailtype == 'sessionmail'
			var comefrom = args.comefrom || ''; //来源判断

			if (args && args.mids) { //如果有传mid，直接取用
				mids = args.mids;
			} else {	//如果没传，获取列表中选中项的mid
				mids = selectOO.mids;
			}
			
			if (args && args.sessionIds){
			    sessionIds = args.sessionIds;
			} else {
		        sessionIds = selectOO.sids;
			}

			var sendIds = []; //聚合邮件sendIds
			var clusterMids = [];
			var sessionIdsWithoutCluster = [];			
			var sendFlag = "";// 判断是否为顶层聚合邮件，此时对全部聚合邮件执行删除、移动等批量操作需要传入sendFlag=1
			var hasClusterMail = false;
			var containSessionMail = false;

			// 对会话模式下“回复”功能进行校验
			if (command == "reply" && $App.isSessionMode() && (!mids || mids.length > 1)) {
				var text = "请选择一封邮件进行操作";
				M139.UI.TipMessage.show(text, {
					colour: 'msgRed',
					prior: true,
					delay: 3000
				});
				return false;
			}

			// 彻底删除后需要清除待办任务的短信提醒
			var taskMidArr = [];
			if (mids) {
				
				// 用户选择处理,支持跨页
				for (var i = 0, len = mids.length; i < len; i++) {
					var mid = mids[i];
					var mail = superSelectOO[mid] || mailboxModel.getMailById(mids[i]);
					
					// 对置顶和举报进行校验，如果包含聚合邮件则不允许执行
					// 位置不能和	if (!mail) continue; 对调
					// 因为mailboxModel.isSubscriptionMail包含对读信页mail为空时的校验        
					if ((command == "mark" && args.type == "top")) {
						if (mailboxModel.isSubscriptionMail(mail)) {
							var text = command == "您选择了聚合的邮件，它不能进行置顶。";
							M139.UI.TipMessage.show(text, {
								colour: 'msgRed',
								prior: true,
								delay: 3000
							});
							return false;
						}
					}
					if (!mail) continue;

					// 筛选待办邮件
					if (mail.taskDate) {taskMidArr.push(mid);}

					// 整理数据
					if ( mailboxModel.isClusterMail(mid)) {
					   hasClusterMail = true;
					   sendFlag = (mailboxModel.isClusterColumn() || mailboxModel.isClusterList()) ? "" : 1;
					   sendIds.push(mail.sendId);
					   clusterMids.push(mid);
					} else {
					   sessionIdsWithoutCluster.push(mail.mailSession);
					}
				}   
			}			
            
            if(isSessionMode && ( mids || sessionIds) && $App.isSessionCommand(command)&& comefrom!='singleSessionMail'){
	            mailtype = 'sessionmail';//判断会话邮件的条件
	            if(command === 'move' || command === 'delete'){
		            mids && $.each(mids, function(i,val){
		        		var data = mids ? mailboxModel.getMailById(val) : superSelectOO[val];
		        		if(data && data.mailNum > 1){
		        			containSessionMail = true;
		        		}
	        		});
            }
        }

        // 读信页取不到mail信息，clusterMids和sessionIdsWithoutCluster均为null
		// 这里要兼容一下
		if (mailtype == 'sessionmail' && clusterMids.length == 0 && sessionIdsWithoutCluster.length == 0) {
			sessionIdsWithoutCluster = sessionIds;
		}
         
         mailboxComplaintView.model.set({
             mailtype:mailtype,
             comefrom:comefrom,
             ids:mids,
             sessionIds:sessionIds,
             commandCallback:commandCallback
         });
			

			function addBehavior() {
			    var map = {
			        markAll: "mailbox_markUnread_ok", deleteAll: "mailbox_deleteUnread_ok",
			        "delete": "mailbox_realDelete_ok", spam: "mailbox_spam_ok"
			    }
			    var tabReadMail = /readmail_/gi.test($App.getCurrentTab().name);
			    if (command == "move" && args.fid == 4) { //move 到fid=4才是普通删除
			        if(tabReadMail){
			            BH('toolbar_deleteok');
			        }else{
			            if(!args.resumeDel)BH("mailbox_delete_ok");
			        }
			        return; 
			    }
			    if(map[command]){
			        if(tabReadMail && command == 'delete'){
	    		        BH('toolbar_realdeleteok');
			        }else{
    			        BH(map[command]);
			        }
			    }
			}
			
			// 完成操作后回调（所有操作公用回调）
			function commandCallback() { 
			    M139.UI.TipMessage.hide();
			    if (messageSuccess) { //成功提示
			        setTimeout(function () {
			            M139.UI.TipMessage.show(messageSuccess, { delay: 3000 });
			        }, 1000);
			    }

			    if (args.command != "mark" && args.command != "tag") { //标记无刷新操作时，不能清除已选择结果
			        // 清空超级全选结果
			        model.clearSuperSelect()
			    }

			    // 参数中传入的回调，针对每个操作的具体处理
			    args.callback && args.callback();

			    // 彻底删除邮件的同时删除待办提醒
			    if (command === "delete" && taskMidArr.length) {
			    	var remindView = $App.getView('remind');
			    	remindView && remindView.model.batchDelRemind({midArr: taskMidArr});
			    }

                //会话邮件里删除单封邮件不刷新
			    // 在会话邮件读信卡片内的操作不针对页面进行刷新
			    if (args.inCovMainbody) {
			    	$App.trigger("reloadFolder", { reload: true });
			        return;
			    }

			    // 单个会话邮件的列表页面的操作对列表进行重新渲染（分栏模式暂时没纳入）
			    // 如果删除了所有邮件，不执行该分支
		    	if ($App.isReadSessionMail() && $App.getLayout() == 'list') {
			    	if ((command == "delete" || (command == "move" && args.fid==4))) {
			    		$App.trigger('delCovMails', {mids: mids});
			    	} else if (command == "move") {
			    		$App.trigger('moveCovMails', {mids: mids, fid: args.fid});
			    	} else if (command == "mark") {
			    		$App.trigger('markCovMails', {mids: mids, type: args.type, value: args.value});
			    	} else if (command == "tag") {
			    		$App.trigger('tagCovMails', {mids: mids, labelId: args.labelId});
			    	} else {
			    		$App.getCurrentTab().view.render();
			    	}
		    		
			    	$App.trigger("reloadFolder", { reload: true });
			        return;	
			    }
			    
                //会话邮件里删除单封邮件不刷新（TODO:应该可以删除了）
			    if( comefrom == 'singleSessionMail'){
			    	$App.trigger("reloadFolder", { reload: true });
			        return;
			    }
			    if( comefrom == 'spammail'){
			        $Msg.alert('操作成功，邮件已被还原到收件箱中。');
			    }
                
                if( comefrom == 'risktips_spam'){ 
                    top.BH('readmail_complaintpropertysafesucc');
                }

			    if (command == "move" || command == "delete" || command == "spam" || command == "unSpam" || command == "refuseMail") {
			        mailboxModel.set("mid", null);//删除和转移邮件后清空mid选择
			        
			        // 如果在
			        //删除单封邮件时读取下一封邮件，多选无效
			        if($App.getCurrMailMid()){
			        	var currMid = $App.getCurrMailMid();
			        	if($App.getLayout()=='list'){ //普通模式
					        $App.trigger('readNextMail',{ 
					        	mid:currMid,
					        	sessionIds:sessionIds
					        });
			        	}else{   //分栏模式
			        		$App.trigger('splitReadNextMail',{
					        	mid:currMid,
					        	sessionIds:sessionIds
			        		});
			        	}
			        }

			    }

			    $App.trigger("reloadFolder", { reload: true });//数据已改变，通知文件夹列表刷新
			    $App.on("folderRendered", onFolderLoaded);
			    

			    
			    function onFolderLoaded() {
			        $App.off("folderRendered", onFolderLoaded);//清理事件
			        
			        args.mids = mids;
			        args.sessionIds = sessionIds;
			        if (self.mailValidate(command, args)) { //标记邮件无刷新
			            return;
			        }

			        if ($App.getCurrentTab().name.indexOf("readmail_") >= 0) { //当前是读信，trigger读信的后续处理
			            $App.trigger("mailboxDataChange");//通知下次刷新邮件列表
						$App.trigger("readmailControl", { command: command, args: args, mids: mids, sessionIds: sessionIds }); //读信处理相关逻辑业务
					} else {
						$App.trigger("readMaiDataChange", { command: command, args: args, mids: mids, sessionIds: sessionIds }) //通知读信页需要刷新
			            $App.trigger("showMailbox", { comefrom: "commandCallback" }); //必须要等文件夹刷新之后，再通知邮件列表刷新
			        }
			        $App.clearTabCache("mailsub_");
					
			    }
			    //console.warn("command callback");
			    //如果是分栏模式，操作完成后需要重新刷新分栏读信
			    $App.trigger("refreshSplitView");//刷新分栏

			    

			    addBehavior();
			    // 取消跨页选择判定标识
			    mailboxModel.set('crossPageSelect', false);
			}

			
			var message = "正在操作中...";
			var messageSuccess = "";
			
			switch (command) {
			    case "delete":
			        if (checkSelect()) {
			        	
			        	var dialog;
	                    message = "正在删除邮件...";
	                    messageSuccess = "所选邮件已彻底删除";
						 //说是只改删除邮件文件夹里面彻底删除的提示语
                        var delTip = args.fid == 4 ? '彻底删除的邮件，我们将自动为您备份7天。您可以在已删除邮件夹中'+
                        '<a id="lookMailBack" href="javascript:;">&nbsp;查看自动备份的邮件</a>': "彻底删除后，邮件不可恢复。";
                        var confirmMessage = hasClusterMail ? "选择的邮件中包含多封邮件，是否彻底删除？" :
                                        delTip;

                        //会话模式
			            if(containSessionMail && mailtype === 'sessionmail'){
				            dialog = $Msg.confirm(
	                            '选择的邮件中包含多封邮件，是否彻底删除？',
	                            function () {
	                                M139.UI.TipMessage.show(message);
	                                model.deleteSessionMail(sessionIds, commandCallback);
	                                BH("sure_thorough_delete");
	                            },
	                            function() {
	                            	BH("cencel_thorough_delete");
	                            },	         
	                            {
	                            	title:"",
	                                dialogTitle:'彻底删除邮件',
	                                icon:"warn",
									isHtml: true,
									buttons:['删除','取消']
	                            });	
	                        $(".btnSure") && $(".btnSure").attr("class","btnRed");
	                        $(".CancelButton") && $(".CancelButton").attr("bh","cencel_thorough_delete");
	                        $("a.CloseButton") && $("a.CloseButton").attr("bh","cencel_thorough_delete");	            	
			            }else{

			            	dialog = $Msg.confirm(
                            	confirmMessage,
	                            function () {
	                                M139.UI.TipMessage.show(message);
	                                model.deleteMail({ mids: mids, sendIds: sendIds, sendFlag: sendFlag }, commandCallback);
	                                BH("sure_thorough_delete");
	                            },
	                            function() {
	                            	BH("cencel_thorough_delete");
	                            },
	                            {
	                                dialogTitle:'彻底删除邮件',
	                                icon:"warn",
									isHtml: true,
									buttons:['删除','取消']
	                            }
	                        );
	                        $(".btnSure")&&$(".btnSure").attr("class","btnRed");
	                        $("a.CancelButton") && $("a.CancelButton").attr("bh","cencel_thorough_delete");	
	                        $("a.CloseButton") && $("a.CloseButton").attr("bh","cencel_thorough_delete");
			            }
			            dialog.$el.find('#lookMailBack').click(function(){
                            dialog.close();
                            $App.showMailbox(7);
                        })
			            dialog.$el.find("a.btnSure").addClass("btnRed");
			            dialog.$el.find("a.CancelButton").attr("bh","cencel_thorough_delete");
			            dialog.$el.find("a.CloseButton").attr("bh","cencel_thorough_delete");

			        } 
					break;
			    case "mark":
			        if (checkSelect()) {
			            message = "正在标记邮件...";
			            messageSuccess = "所选邮件标记成功";
			            
                        if(args.type == 'starFlag' && args.value == 0){
                            messageSuccess = "取消星标成功";
                        }

			            M139.UI.TipMessage.show(message);
			            if ( mailtype != 'sessionmail' || $App.isReadSessionMail()) {
			                model.markMail(mids, args, commandCallback);
			            } else {			            	
			                model.markSessionMail({ mids: clusterMids, sessionIds: sessionIdsWithoutCluster }, args, commandCallback);
			            }
			        }
					break;
			    case "move":
			        if (checkSelect()) {
			            if (args.fid == -1) { //移动到新建文件夹
			                this.doCommand("addFolder", { mid: mids });
			                return;
			            }

			            message = "正在转移邮件...";
			            messageSuccess = "所选邮件移动成功";

                       var _m = $App.getMailboxView().model;
                        if( parseInt(_m.get("billTab"),10) === 0 ){
                            if(args.fid === 1){
                                messageSuccess = "您选择了的邮件已经在收件箱";
                            }
                        }
                        
			            if (args.fid == 4) {
			                message = args.resumeDel ? "正在恢复邮件......." : "正在删除邮件.......";
			                messageSuccess = args.resumeDel ? "所选邮件已恢复到“已删除”文件夹" : "所选邮件已删除";
			            }
			            
			            if((!hasClusterMail||!mailboxModel.isSubscriptionMail(mail)) && (mailtype != 'sessionmail' || $App.isReadSessionMail())){
			            	M139.UI.TipMessage.show(message);
			                model.moveMail({ mids: mids, sendIds: sendIds, sendFlag: sendFlag }, args.fid, commandCallback);
			            }else{

			                if( args.fid !== 4){
			                	sessionIds ? model.moveSessionMail(sessionIds, args.fid, commandCallback) : model.moveMail({ mids: mids, sendIds: sendIds, sendFlag: sendFlag }, args.fid, commandCallback);
				            }else{
				            	var tipsFlag = $App.getCustomAttrs("sesdeltips");

				            	//是否包含会话邮件
				            	if(containSessionMail || (mailboxModel.isSubscriptionMail(mail) && hasClusterMail) || hasClusterMail && !tipsFlag){
						            var dialog = $Msg.confirm(
			                            "选择的邮件中包含多封邮件，是否删除？",
			                            function () {
			                            	M139.UI.TipMessage.show(message);
											containSessionMail ? model.moveSessionMail(sessionIds, args.fid, commandCallback):model.moveMail({ mids: mids, sendIds: sendIds, sendFlag: sendFlag }, args.fid, commandCallback);
											BH("sure_delete");
											if($('#nodeltips:checked')[0]){
												$App.setCustomAttrs('sesdeltips', "1");
											}
			                            },
			                            function() {
	                            			BH("cencel_delete");
	                            		},
			                            {
			                            	title:"",
			                                dialogTitle:'删除邮件',
			                                icon:"warn",
			                                buttons:["删除","取消"]
			                            }
			                        );
			                        $(".btnSure")&&$(".btnSure").attr("class","btnRed");
			                        $("a.CancelButton") && $("a.CancelButton").attr("bh","cencel_delete");
			                        $("a.CloseButton") && $("a.CloseButton").attr("bh","cencel_delete");

			                        //dialog.$el.find("span.bibText").html('<input type="checkbox" id="nodeltips" /> 以后不再提示');	  
		                    	}else{
		                    		model.moveSessionMail(sessionIds, args.fid, commandCallback);
		                    	}
		                    }
			            }
			        }
			        if (hasClusterMail) {
			            BH(mailboxModel.isClusterColumn() ? "deleteormove_cluster_columnlist" : "deleteormove_cluster_mailbox");
			        }
					break;
			    case "tag":
			        if (checkSelect()) {

			        	//会话邮件处理
			        	if( mids && sessionIds && $App.getCurrentTab().name.indexOf("readmail_") > -1){
			        		var count = this.getSessionTagsCount(mids[0]);
			        		if(count >=10 ){
								$Msg.alert("标签数量已经超过上限!");
			        			return;
			        		}
	        				sessionMids = this.getSessionTagsMids(mids[0]);
	        				if(sessionMids.length > mids.length){
	        					mids = sessionMids;	
	        				}	        				
	        			}

			            if (args.labelId == -1) { //移动到新建标签
			                this.doCommand("addTag", { mid: mids });
			                return;
			            }
			            message = "正在给邮件打标签...";
			            messageSuccess = "所选邮件标记成功";
			            M139.UI.TipMessage.show(message);
			            BH('toolbar_tag');
			            model.addSpecialTagBehavior(args.labelId, "specialtag_mark");
			            model.addTagForMail(mids, args.labelId, commandCallback);
			        }
					break;
			    case "sort":
			        message = "正在排序邮件...";
			        M139.UI.TipMessage.show(message);
			        model.set("order", args.order);
			        model.set("desc", args.desc);
                    if(mailboxModel.get('isSearchMode')){
                        var searchOptions = mailboxModel.get('searchOptions');
                        searchOptions.order = args.order;
                        searchOptions.desc = args.desc;
                        mailboxModel.set('searchOptions',searchOptions);
                    }
                    //$App.trigger("showMailbox"); //刷新
                    commandCallback();
			        break;
			    case "spam":
			        if (checkSelect()) {
			            mailboxComplaintView.mailComplaint();
			        }
			        break;
			    case "unSpam":
                    if (checkSelect()) {
                        mailboxComplaintView.notRubbishMail();
                    }
			        break;
			    case "refuseMail":
                    top.BH("reject");
                    var email = args.email;
			        if (email && mailboxComplaintView.isAllowRefuseEmailaddr(email)) {
                        mailboxComplaintView.model.set({from:email});
                        mailboxComplaintView.spamMail();
			        }
			        break;
			    case "markAll": //全部标记已读
			        message = "正在标记邮件...";
			        messageSuccess = "所选邮件标记成功";
			        M139.UI.TipMessage.show(message);
			        if (!args.type && mailboxModel.get("isSearchMode")) {
			            args.type = "search";
			        }
			        var doMarkAll = mailboxModel.markAllRead(args.fid, args.type, commandCallback);
			        if (!doMarkAll) { //未读数为0，没有操作
			            M139.UI.TipMessage.hide(); 
			        }
			        break;
			    case "deleteAll"://全部删除未读
			        message = "正在删除邮件...";
			        messageSuccess = "所选邮件已删除";
			        $Msg.confirm(
                       "确实要删除这" + mailboxModel.getFolderInfo().stats.unreadMessageCount + "封邮件吗？",
                       function () {
                           M139.UI.TipMessage.show(message);
                           mailboxModel.deleteAllUnread(args.fid, commandCallback);
                       }
                    );
	    	        break;
                case "deleteAllOrdinary": //全部删除（普通删除，移到已删除文件夹）
                    mailboxModel.deleteAllOrdinary();
                    break;
			    case "open": //打开文件夹
			        $App.showMailbox(Number(args.fid));
			        break;
			    case "reply": 
			    	var mid;
			        var current=$App.getCurrentTab();
			        /*if($App.getCurrentTab().name.indexOf("readmail_") > -1) {
                      $App.close($App.getCurrentTab().name);
                  	}*/
			        /*if (!mid) {
			            if (!mids || mids.length == 0) {
			                $Msg.alert("请选择邮件");
			                return false;
			            } else {
			                mid = mids[0];
			            }
			        }*/
			        
			        //分栏读信时邮件列表勾选优先级 > 读信
			        if(mids && mids.length>0){ 
			        	mid = mids[0]
			        } else if (!$App.isSessionMode()){
			        	mid = mailboxModel.get("mid");
			        }
			        if(!mid){
			            $Msg.alert("请选择邮件");
			            return false;
			        }
			        
			        var params = {
			            mid:mid,
			            type: args.all ? "replyAll" : "reply",
			            withAttach: args.attach,
			            userAccount : top.$User.getDefaultSender(),
			            lastTabName: current.name
			        };
			        if(args.email){
			        	params.userAccount = args.email;
			        }

                    // 判断是否需要是替换当前标签（新开标签后model和view会发生变化）
                    // 这两个操作必须放在新开标签前
                    var isReadMail = $App.isReadMail();
                    var isReadSessionMail = $App.isReadSessionMail();

			        $App.show('compose', params);
			       
			        if (isReadMail && !isReadSessionMail) {
                       $App.getView("tabpage").replace(current.name, $App.getCurrentTab().name);
                   	}			        
			        break;
			    case "forward":
			    	var mid;
			    	if (!$App.isReadSessionMail()) {
			    		mid = mailboxModel.get("mid");
			    	}
			        
			        if(mids && mids.length>0){ mid = mids[0]} //转发当前邮件
			        var title = "";//转发多封时标题
			        if (!mid) {
			            if (!mids || mids.length == 0) {
			                $Msg.alert("请选择邮件");
			                return false;
			            } else {
			                if (mids.length>1) {
			                    //同时转发多封，强制按附件转发
			                    title = mailboxModel.getMailById(mids[0]).subject;
			                    args.attach = true;
			                    mid = mids;
			                } else {
			                    mid = mids[0];
			                }
			            }
			        }
					
					//列表选择多封邮件，强制按附件转发
					if(mids && mids.length > 1){
						title = "";
						args.attach = true;
						mid = mids;
					}
					
			        //var mail= mailboxModel.get("mailListData");
			        //add by zsx 如果传入的有代收邮箱，把代收邮箱传递
			        var pop ={};
			        if (args.email){
			        	pop.userAccount = args.email;
			        }
			        if (args.attach) {
			            $App.forwardAsAttach(mid,title,pop);
			        } else {
			            $App.forward(mid,pop);
			        }
			        break;
			    case "showTraffic":
				args.email.isContactsMail = true;
			        $App.searchMail(args.email,args.thisEmail);//搜索的当前人的邮箱
			        break;
			    case "addVip":
                    /*
			        var addrDialog = top.M2012.UI.Dialog.AddressBook.create({
			            filter: "email","getDetail":true,
			            items: []
			        });
			        addrDialog.on("select", function (e) {
			            var result = e.value;
			            console.warn(e);
			            if (result.length > 0) {
			                mailboxModel.addVipContact(result);
			            }
			        });*/

			        Contacts.addVIPContact(function () {
			            $App.close("vipEmpty");
			            $App.searchVip();
			        });
			       
			        break;
			    case "viewMail":
			        var searchOptions = { fid: args.fid, flags: args.flags }
			        
			        if (args.flags=="important") { 
			            searchOptions = { fid: args.fid, condictions: [{ field: "priority", operator:"",value:"1"}] }
			        } else if (args.flags == "all") {
			            $App.showMailbox(args.fid);
			            return;
			        }

			        $App.searchMail(searchOptions);
			        break;
			    case "viewUnread": //查看未读
			        var searchOptions = { fid: args.fid, flags: { read: 1 } }
			        if (mailboxModel.get("isSearchMode")) {//如果是在搜索结果页查看未读，继承原来的搜索条件
			            if (args && args.inherit) { //继承原有搜索条件
			                searchOptions = mailboxModel.get("searchOptions");
			            }
			            if (searchOptions.flags) {
			                searchOptions.flags["read"] = 1
			            } else {
			                searchOptions.flags = { read: 1 };
			            }

			        }
			        if (args.label) { //标签未读
			            searchOptions.label = args.label;
			        }
			        /*var unreadflags = { read: 1 };
			        if (mailboxModel.isStarMode()) {
			            unreadflags["starFlag"] = 1;
			        }*/
			        $App.searchMail(searchOptions);
			        break;
				case "viewUnreadContactMails":
					var searchOptions = mailboxModel.get("searchOptions");
					top.$App.getView("mailbox_other").model.set("IamFromLaiwang",true);//设置是来往邮件的搜索
					top.$App.getView("mailbox_other").model.set("UnReadIamFromLaiwang",false);//点击未读后，再重新点更多，会用影响，清楚此影响
					//删除已读的标识
					if(searchOptions.flags){
					//	delete searchOptions.flags["read"];
						delete searchOptions.flags;
					}
					$App.searchMail(searchOptions);
					break;
			    case "viewReply": //查看已回复
			        $App.searchMail({ fid: args.fid, flags: { replied: 1 } })
			        break;
			    case "unfold": //展开文件夹
			        $App.trigger("unfoldCommand", { type: args.type });
			        break;
			    case "addFolder": //添加文件夹
			        new M2012.Folder.View.AddFolder({ model: folderModel ,email:args.email,comefrom:args.comefrom,mid:args.mid}).render();
			        break;
			    case "addTag": //添加标签
			        new M2012.Folder.View.AddTag({ model: folderModel ,email:args.email,comefrom:args.comefrom,mid:args.mid}).render();
			        break;
			    case "filter": //打开过滤器
			        var filterParam = { fid: (args.fid || null) };

			        if ($App.isTagFolder(args.fid)) { //是标签文件夹
			            filterParam = { labelId: args.fid };//是标签文件夹
			        }

			        $App.show("createType", filterParam);
			        break;
			    case "folderManage":
			        $App.show("tags");
			        if ($.browser.msie && $.browser.version == 6) {
			            M139.Event.stopEvent();
			        }
			        break;
			    case "inboxSub":
			        folderModel.setInboxSub(args.fid,args.type);
			        break;
			    case "showStar":
			        $App.searchMail({ flags: { starFlag: 1 } })
			        break;
			    case "autoFilter": //弹出分类规则
			        new M2012.Folder.View.AutoFilter({ model: folderModel ,actionType:"folder",email:args.email,name:args.name}).render();
			        break;
			    case "autoFilterTag": //弹出自动标签设置
			        new M2012.Folder.View.AutoFilter({ model: folderModel, actionType: "tag", email: args.email,name:args.name}).render();
			        break;
			    case "pop"://代收
			        var options = {};
			        if (args && args.fid) {
			            var info = $App.getFolderById(args.fid);
			            options.id = info.popId;
			        }
			        messageSuccess = "已向服务器提交代收命令，请稍后检查您的代收文件夹";
			        
			        mailboxModel.syncPOPAccount(options, function () {
			            commandCallback();
			        })
			        break;
			    case "addPop":
			        $App.show("addpop");
			        break;
			    case "clear": //清空文件夹
			        $Msg.confirm(
                        "您确定要清空吗?",
                        function () {
                            folderModel.clearFolder(args.fid, function () {

                                if (mailboxModel.get("fid") == args.fid) { //如果清空当前文件夹，跳转到收件箱
                                    $App.close();
                                }
                                commandCallback();
                            });
                        },
                        {
                            title: "清空文件夹",
                            icon: "warn"
                        }
                    );
			        
			        break;
			    
			    case "newWindow":
			        var fid = mailboxModel.getFolderInfo().fid;
			        $App.openNewWin(mids);
			        //window.open("/m2012/html/index.html?sid=" + $App.getSid() + "&t=newwin&mid=" + mids+"&fid="+fid);
			        break;
			    case "jump":
			        $App.jumpTo(args.key);
			        break;
			    case "show":
			        $App.show(args.key);
			        break;
			    case "importMail": // 导入邮件
			        $App.registerView("importMailDialog", $Msg.open({
			            url : "importmail.html",
			            dialogTitle : "导入邮件",
			            height : 165,
			            name : "importmaildialog"
			        }));
			        break;
			    case "exportMail": //导出选中的邮件
			        if (checkSelect()) {
			        	if ($App.getUserCustomInfo("26") === "1") {
			        		new M2012.Mailbox.Model.Export().exportMail(mids);
			        	} else {
			        		$Msg.confirm([
			        			mids.length > 1 ? "<p>导出的文件为压缩文件，请解压后使用。</p>" : "",
			        			"<p>建议安装Foxmail、Outlook邮件客户端查看eml 邮件。</p>",
			        			'<div style="margin-top:10px;"><input type="checkbox" id="exportmail_tips_checkbox" /><strong style="position:relative;top:1px;padding-left:3px;">不再提示</strong></div>'].join(""), function() {
			        				if (document.getElementById("exportmail_tips_checkbox").checked) {
			        					$App.setUserCustomInfo("26", "1");
			        				}
			        				new M2012.Mailbox.Model.Export().exportMail(mids);
			        		}, {
			        			icon : "warn",
								buttons : ["导出邮件", "取消"],
								isHtml : true,
								dialogTitle : "导出邮件"
			        		});
			        	}
			        }
			        break;
			    case "covtoggle":
			    	$App.trigger('conversationToggle', { sessionId:args.mailSession, doAction:args.doAction, callBack: args.callBack});
			    	break;			   
			    case "backupMail":  //备份到网盘
			        if (checkSelect()) {
				        var backupType = $App.getCurrentTab().title == '服务邮件'? 1:'';//为1是备份到备份邮件下的服务邮件
			            $Msg.confirm('您选择的邮件将会备份到“彩云网盘”中，是否确定备份?',
                            function () {
                                if (mids.length > 100) {
                                    M139.UI.TipMessage.show("备份失败，单次备份不能超出100封", {
                                        className: "msgRed",
                                        delay: 3000
                                    });
                                    return;

                                }
                                model.backupMail(mids,backupType, function (res) {
                                    var res = res.responseData;
                                    if (res && res.code == "S_OK") {
                                        takeData(res['var']);
                                        BH('toolbar_backupMailSucess')
                                    } else {
                                        $Msg.alert('由于网络原因，邮件备份失败，请稍后再试！');
                                    }
                                });
                            },
                            {
                                icon: "warn",
                                isHtml: true,
                                dialogTitle: "邮件备份"
                            });
			        }
			        break;
		        case 'savetoNote':
		        	if (checkSelect()) {
                        model.savetoNote(mids, function (res) {
                            if (res.responseData && res.responseData["code"] == "S_OK") {
				                M139.UI.TipMessage.show("邮件已转存至和笔记 <a href='javascript:top.$App.show(\"note\")'>查看</a>");
				                var noteId = res.responseData["var"]["noteid"];         //返回新建的noteId
				            } else {
				                M139.UI.TipMessage.show("保存失败，请重试");
				            }
				            setTimeout(function () {
				                M139.UI.TipMessage.hide();
				            }, 3000);
                        });
			        }
		        	break;
            }

			function takeData(data, sucessNum) {
			    var s_num = parseInt(data.totalNum - data.errNum) + (sucessNum ? parseInt(sucessNum) : 0);//需要补上之前成功的
			    f_num = parseInt(data.errNum),
                f_mids = data.errMailIdList,
                backupDirId = data.backupDirId;
			    if (f_num == 0) {               //如果全部保存成功
			        if (s_num == 1) {           //如果只保存了1封
			            M139.UI.TipMessage.show('备份成功  <a href=\"javascript:;\" onclick=\'top.Links.show(\"diskDev\",\"&id='+backupDirId+'\",true);return false;\'>去查看</a>', { delay: 3000 });
			        } else if (s_num > 1) {     //如果保存了多封
			            M139.UI.TipMessage.show('备份成功' + s_num + '封邮件 <a href=\"javascript:;\" onclick=\'top.Links.show(\"diskDev\",\"&id='+backupDirId+'\",true);return false;\'>去查看</a>', { delay: 3000 });
			        }
			    } else if (f_num > 0) {
			        //如果有不成功的，进入递归
			        var message1 = '由于网络原因，邮件备份失败，请重试？',
                        message2 = '备份成功' + s_num + '封，备份失败' + f_num + '封，是否继续备份？';
			        $Msg.confirm(s_num + f_num == 1 ? message1 : message2,
                        function () {
                            model.backupMail(f_mids, function (res) {
                                var res = res.responseData;
                                if (res.code == "S_OK") {
                                    takeData(res['var'], s_num);
                                } else {
                                    $Msg.alert('由于网络原因，邮件备份失败，请稍后再试！')
                                }
                            });
                        },
                        {
                            icon: "warn",
                            isHtml: true,
                            dialogTitle: "邮件备份"
                        });
			    }
			}

			function checkSelect() { //是否选择了邮件
			    var select = true;
			    /*if( mailtype == 'sessionmail'){
                    if (!sessionIds || sessionIds.length == 0) {
			            select = false;
			        }
			    }else{*/
                    if (!mids || mids.length == 0) {
			            select = false;
			        }
			    // }
				if(comefrom == 'singleSessionMail'){
			        select = true;
			    }
			    if(select){
			        return true;
			    }else{
			        $Msg.alert("请选择邮件。");
			        return false;
			    }
			}
			



		},

		/** 获取会话邮件mids */
		getSessionTagsMids:function(mid){
			var container = $('#readTag_' + mid),
				mids = container.attr("data-mids");
			return mids ? mids.split(",") : [mid];
		},

		/** 获取会话邮件标签数 */
		getSessionTagsCount:function(mid){
			var container = $('#readTag_' + mid);
			return container.find("span[name='tag_item']").length;
		},

		getSelectedMail: function () {	
			var el =null;
		    var view = $App.getMailboxView();
		    if (view.listView) {
		        el = view.listView.$el;//订阅邮件多实例特殊处理
		    };	   		    
		    // 从跨页选择对象中取得列表中已选择邮件
		    var resultObj = this.model.getSelectedRow(el);
		    // 列表页，取选择的邮件
		    if (resultObj.mids && resultObj.mids.length && $App.getCurrentTab().name.indexOf('readmail_') == -1) {
		    	return resultObj;
		    } else {
		    	if ($App.getCurrentTab().name.indexOf('readmail_') > -1) {
		    		// 会话邮件列表
		    		if ($App.isReadSessionMail()) {
		    			var mid = $App.getCurrentTab().view.getCheckedMidArr();
		    		} else {
			    		var mid =  $App.getCurrMailMid();
			    		mid = mid ? [mid] : null;
			    	}
		    	} else {
		    		var mid = $App.getMailboxView().model.get("mid");
		    		mid = mid ? [mid] : null;
		    	}		    	

		    	// 用意不明，待确定
		    	if ($App.isSessionMode()) {
		    		var sessionId = $App.getCurrentTab().view.model.get('sessionId');
		    	} else {
		    		var sessionId = $("#div_maillist").find("tr[mid=" + mid+"]").attr("sessionId");
		    	}
	            
	            return {
	            	mids: mid,
	            	sids: sessionId ? [+sessionId] : null
	            }
		    }
		}

	})
});