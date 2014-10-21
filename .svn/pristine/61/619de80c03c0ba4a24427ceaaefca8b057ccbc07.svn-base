M139.namespace("M2012.Mailbox.View", {
    ListView: Backbone.View.extend({
        template:"",
        events: {
            "click tr[mid]": "onLetterRowClick",
            "click a.daytableTitle": "onLetterGroupClick",
            "click a[name=tagMenu]": "onTagMenuClick",
            "click input#chk_mailist_all": "onSelectAllClick",
            "mouseover table.dayAreaTable span[name=from]": "onReceiverAddrMouseOver",
            "click #th_subject,#th_from,#th_size,#th_date": "onTableHeaderClick",
            "click #cancelchoice": "cancelChoice",
            "mouseover table.dayAreaTable tr": "changeMailStyle"
        },
        createInstance: function (options) {
            if (!$App.getView("maillist")) {
                $App.registerView("maillist", new M2012.Mailbox.View.ListView(options));
            }
            var view = $App.getView("maillist");
            if (options.el) {
                view.setElement(options.el);
                //view.el = options.el;
            }
            return view;
        },
        initialize: function (options) {
            //alert("hello");
            var self = this;
            this.firstLoaded = true;//首次加载
            this.repeater = null;//repeater控件引用
            this.model = options.model;
            this.Folder = appView.getView("folder"); //文件夹接口层
            this.remindMailView = appView.getView("remind");
            if (options.el) {
                this.setElement(options.el);
                //view.el = options.el;
            }
            this.model.view = this;
            //this.ToolbarView=new MailboxToolbarView({model:this.model});//添加工具栏视图
            this.model.on("change:fid", function (model, val) { //切换邮件列表事件
                var fid = val;
                //alert(fid);

                //appView.showPage({name:"mailbox_"+fid,view:self,group:"mailbox"})
                //self.render();

            })

            $App.on("refreshSplitView", function (args) {
                //console.warn("refreshSplitView");
                setTimeout(function () {
                    self.refreshSplitView(args);//刷新分栏
                }, 500);

            });

            $App.on("showTab", function (tab) {
                if (tab.group == "mailbox") {
                    self.restorePosition();
                }
                closeMySubscribeListTab();
            });
	   
			function closeMySubscribeListTab(){
				var currTab = $App.getCurrentTab();
				var mySubscribeTabId = 'mailbox_9' ;
				if(/subscribe|myCloudSubscribe/i.test(currTab.group)){
					try{
					//	$App.closeTab(mySubscribeTabId);      打开云邮局的时候，我的订阅不要关闭          
					}catch(e){}
				}
			}

            // 处理视图变化
            this.model.on('mailSelectedChange', function (args) {
                var count = args.count;
                var superSelectResult = self.model.superSelectResult || {};

                // 显示当前已选择邮件数量
                if (count){
                    var html = '<span>已选：<strong class="c_ff6600">'+count+'</strong>封 <a class="c_ff6600" id="cancelchoice" href="javascript:void(0)">取消</a></span>';
                    var cell1=$(self.el).find('#list_header td:eq(1)');
                    if ($App.getLayout() != 'left'){
                          cell1.addClass('td6');
                    }
                    cell1.removeClass('td2').html(html);
                }else {
                    $(self.el).find('#list_header td:eq(1)').removeClass('td6').addClass('td2').html(self.getFromHtmlInListHeader());
                }

                if ($App.getLayout() == 'left' || $App.getLayout() == 'top') {
                    self.changeReadMailArea(count);
                }

                // mid清空 ？
                if (count == 0) {
                    self.model.set({ mid: null });
                }

                // 记录跨页选择日志（仅当存在跨页点击行为，且为选择时才判定为跨页选择）
                var flag = args.flag;
                if (flag && !self.model.get('crossPageSelect')) {
                    for (var n in superSelectResult) {
                        if (superSelectResult.hasOwnProperty(n)){                            
                            var mid = superSelectResult[n].mid;
                            var item = self.model.getMailById(mid);
                            if (item == null) {
                                self.model.set('crossPageSelect', true);
                                BH('cross_page_select');
                                break;
                            }
                        }
                    }
                }
            });

            this.model.on("checkboxChange", function (element) {
                self.checkboxChange(element);
            })

            //分栏模式删除邮件时读取下一封
            $App.on("splitReadNextMail", function (e) {
                if (e.mid) {
                    setTimeout(function () {
                        var dataSource = M139.PageApplication.getTopApp().print[e.mid];
                        if (dataSource && dataSource.next && dataSource.next.mid) {
                            self.readMailSplitView(dataSource.next.mid, self.model.get('fid'));
                        }
                    }, 200);
                }
            });
			
			//刷新邮件列表样式,注意搜索和其他文件夹html结构不一样
			//this.mailboxContainer =  this.mailboxContainer || $('#div_maillist').parent();
		    top.$App.on('pageStyleChange',function(data){
				if(data && data.pageStyle){
					data.pageStyle == "2" && BH('left_pagebigstyle');
					data.pageStyle == "3" && BH('left_pagesmallstyle');
					$('#toolbar_div').parent().attr("class",$User.getPageStyleByKey(data.pageStyle));
				}
			});
            $App.on("ContactsDataChange",function (e){
                if($App.isMailbox()){
                    $App.trigger("showMailbox");
                }
            })
   
            this.setScrollWidth();
        },
        onLetterRowClick: function (evt) {
            var self = this;
            var tr = evt.currentTarget;
            var jRow = $(tr);
            var clickEl = evt.target;
            var jClickEl = $(clickEl);
            var name = jClickEl.attr("name");//这里是点击<A>
            var mid = jRow.attr("mid");
            if ((name == "subject" || name == "from" || name == "summary") && !evt.shiftKey) { //点击标题和发件人，执行读信(须排除shift键按下的情况)
                var currFid = self.model.get('fid'); //当前文件夹
                if (currFid == 2) { //点击草稿箱到写信
                    $App.restoreDraft(mid);
                    evt.preventDefault();
                    return false;
                }
                
                if (currFid != 7)self.readMailInner(mid, tr);
            } else if (name == "tag_span") { //点击了标签
                return false;
            }
            else { //点击了空白处或复选框，选中行。
                var checkbox = jRow.find("input[type=checkbox]");
                var shiftCheckArr = [];
                var shiftKey = false;
                function selectRowRange(startRow, endRow) {
                    var findIndex = -1;
                    var inRange = false;//在范围内
                    self.$el.find("tr[mid]").each(function (i, n) { //循环所有的tr,选中起始到结束范围内的行
                        if (n == endRow) {  //结束条件必须要写在前面
                            inRange = false;
                            $(n).find("input[type=checkbox]").attr("checked", true);
                            shiftCheckArr.push($(n).attr('mid'));
                            return;
                        } else if (n == startRow || inRange) {
                            shiftCheckArr.push($(n).attr('mid'));
                            inRange = true;
                            $(n).find("input[type=checkbox]").attr("checked", true);
                        }
                    });
                    return findIndex;
                }
                if (evt.shiftKey) { //如果shift被按下
                    shiftKey = true;
                    console.log('shiftKey');
                    var startEl = self.previousRow;
                    var endEl = tr;
                    //console('nextRow:'+$(endEl).attr('mid'));
                    if ($(startEl).offset().top > $(endEl).offset().top) {
                        selectRowRange(endEl, startEl); //从下往上选择
                    } else {
                        selectRowRange(startEl, endEl);
                    }
                } else {
                    if (clickEl.tagName != "INPUT") { //点击空白处选中行
                        var td = jClickEl.closest("td").get(0);
                        if (!td) { return }
                        var cellIndex = td.cellIndex;
                        if (cellIndex == 0 && self.model.get("layout")!="left") { //点击第一列选中
                            var orignCheck = checkbox.attr("checked") ? true : false;
                            checkbox.attr("checked", !orignCheck);
                        } else {
                            var c = jClickEl.attr("class");
                            var _n = jClickEl.attr("name");
                            var c2 = td.className;
                            if (c == "i_cl_w" || c == "i_close_min" || c == "i_starM" || _n === 'cl_tag' || c === 'i_tx' || c === 'i_tagfor_n' || c === 'i_starM_y') { //删除标签叉号不要触发读信
                                return;
                            }
                            if ($(td).attr("name") == "td_sub" || c2 == "td2" || c2 == "td3" || c2 == "td4" || c2 == "td6") { //点击标题和发件人列的空白处
                                if (self.model.get('fid') != 7)self.readMailInner(mid, tr);
                                return; //必须return ,避免执行后面的复选框操作
                            } else if (c2 == "td5") { //点击最后一列菜单列，不做选中操作
                                return;
                            }
                        }

                    }

                }

                var chkList = this.$el.find(".dayAreaTable input[type=checkbox]:checked");
                self.checkboxChange(shiftKey ? shiftCheckArr : checkbox, shiftKey);
                /*if (self.model.get("superSelectResult") && !checkbox.attr("checked")) { //超级全选时取消复选框，需要同步更新超级全选结果数组
                    _.without(self.model.get("superSelectResult"), mid);//从超级全选结果中删除当前mid
                    //alert("without you:" + mid);
                }*/
                self.previousRow = tr;
            }
        },

        /**
         *@inner
         */
        readMailInner: function (mid, tr) {
            var self = this;
            var listMailMode = self.model.get("layout");
            var searchMode = self.model.get('isSearchMode');
            var currFid = self.model.get('fid'); //当前文件夹
            var mail = self.model.getMailById(mid);
            var sendId = mail && mail.sendId;
            var jRow = $(tr);

            // 打开聚合邮件
            if (this.model.isClusterMail(mid)) {
                // 在栏目列表
                if (self.model.isClusterColumn()) {
                    $App.showSubscribe(sendId, mail.from);
                    BH("click_cluster_columnlist");
                // 在收件箱入口
                } else {
                    $App.showSubscribe();
                    BH("click_cluster_mailbox");
                }
                return;
            // 阅读订阅邮件
            } else if (sendId > 0) {
                $App.clearTabCache("mailsub_");
                BH("click_cluster_maillist");
                BH("read_cluster_mail");
            }     
            
            //未读邮件
            if (mail && mail.flags && mail.flags.read == 1) { 
                mail.flags.read = 0; //置为已读
                jRow.find("h3").removeClass();
                jRow.find("[name=from]").removeClass("fw_b");
                jRow.find(".i_m_n").removeClass().addClass("i_m_o");
                var isStar = (mail.flags && mail.flags.starFlag) ? true : false;
                var isVip = self.model.isVipMail(mail.from);
                if (!$App.isSessionMid(mid)) {
                    $App.trigger("reduceFolderMail", { fid: mail.fid, isStar: isStar, isVip: isVip });//文件夹未读邮件减少    
                }                
                if (mail.label && mail.label.length > 0) {//有标签，标签未读邮件减少
                    $App.trigger("reduceTagMail", { label: mail.label });
                }
            }
            if (mail && mail.fid == 2) { //草稿箱邮件到写信
                $App.restoreDraft(mid);
                return false;
            }
            //普通读信
            if (listMailMode == "list" || listMailMode == undefined) {
                self.model.set("mid", mid);
                $App.readMail(mid, false, currFid, { searchMode: searchMode }); //触发读邮件事件
                BH("mailbox_readmail");
            //分栏读信
            } else { 
                self.readMailSplitView(mid, currFid);
                BH("mailbox_readmail");
                self.restorePosition();
                self.rememberPosition();
            }
        },
        //点击日期分组折叠
        onLetterGroupClick:function(e){
            $(e.currentTarget).find("i").toggleClass("i_minus");
            $(e.currentTarget).next().toggle();
            // 根据是否出现滚动条微调邮件列表样式
            this.setMailListPadding();
        },

        onTagMenuClick:function(e){
            /*var tagItems = [
            {
                html: "<i class='i_star_y'></i><span class='tagText'>星标</span>",
                command: "mark", args: { type: "starFlag", value: 1 }
            },
            { isLine: true }]*/

            tagItems = this.model.getTagMenuItems();
            if(tagItems.length<4){ //变态需求，无标签时只显示新建标签，有标签时去掉新建和管理
                tagItems.pop();tagItems.shift();
            }else{
                tagItems.splice(tagItems.length-3);
            }
            M2012.UI.PopMenu.create({
                dockElement: e.target,
                direction: "auto",
                items: tagItems,
                onItemClick: function (item) {
                    var args = item.args || {};
                    if (item.command) {
                        args.command = item.command;
                        args.mids = [$(e.target).parents("tr[mid]").attr("mid")];
                        var sessionId;
                        sessionId = $(e.target).parents("tr[sessionid]").attr("sessionid");
                        args.sessionIds = [Number(sessionId)];
                        console.log("mid=" + args.mids);
                        $App.trigger("mailCommand", args);
                        M139.Event.stopEvent();
                    }
                }
            });
        },

        onSelectAllClick: function (e) { //普通全选
            var flag = $(e.currentTarget).attr("checked") ? true : false; //未选中状态是undefined
            this.$el.find(".dayAreaTable input[type=checkbox]").attr("checked", flag);
            /*if (flag == false) {
               this.model.clearSuperSelect()//清空超级全选结果
            }*/
            this.getSelectedRow();
            this.checkboxChange(e.currentTarget);
        },

        /***生成邮件列表，及单元格中元素的事件
         * 所有列表中的事件必须要定义在此函数中，因为异步渲染需要调用此函数重新生成事件
         */
        initListEvents: function () {
            var self = this;
            $(window).resize(function () {
                self.onResize();
                self.setScrollWidth();
            });

            $App.on("showTab", function (m) {
                if (m.group == 'mailbox') {
                    self.onResize();
                }
            });

            this.initTableHeaderEvent();

            this.remindMailView.addEvent(self.$el); //待办任务

            this.setScrollWidth();

        },

        setScrollWidth:function(){
            var self = this;
            self.$body = self.$body || $('body');
            self.$mailboxList = $("#div_maillist");

            /*clearTimeout(self._setScrollWidth);
            if(self.$body.width() < 1024){
                self._setScrollWidth = setTimeout(function(){
                    self.$mailboxList.addClass("scrollWidth");
                },100);
            }else{
                self._setScrollWidth = setTimeout(function(){
                    self.$mailboxList.removeClass("scrollWidth");
                },100);
            }*/
            
        },

        readMailSplitView: function (mid, currFid) { //分栏读信
            var self = this;
            if (mid) { //修复未读信时无mid
                if (this._readmailView) {
                    this._readmailView.disposeView(); //避免重复绑定
                }
                var readmailView = this._readmailView = new M2012.ReadMail.View();
                self.model.set("mid", mid);
                self.model.set("lastReadmailFid", currFid);//记住最后一封读信的fid
                var readmailWrap = this.$el.find("#readWrap");
                readmailWrap.attr("rel", "isRead");
                readmailView.model.set({ mid: mid, win: false, currFid: currFid, showToolBar: false, el: readmailWrap });
                var returnObj = readmailView.render();
                $App.trigger('readmail', { mid: mid, type: 'split', el: readmailWrap });
                returnObj.view.render();
                $(".inboxfl").css("padding", "0px");
            }

        },
        refreshSplitView: function (args) { //刷新分栏
            var listMailMode = this.model.get("layout");
            if (listMailMode == "top" || listMailMode == "left") {
                //if ($.inArray(mailboxModel.get("mid") , mids)>=0) {
                //if ($("#readWrap").attr("rel")=="isRead") { //分栏内容不为空，表示有读过信
                this.readMailSplitView(this.model.get("mid"), this.model.get("lastReadmailFid"));
                //}  
                //}

            }

        },
        restorePosition: function () { //还原滚动条，高亮显示上次读信位置
            var div = this.$el.find("#div_maillist");
            if (!div[0]) { return; }
            if (this.model.get("listPosition") != null) { //还原
                div[0].scrollTop = this.model.get("listPosition");
            }
            var lastMid = this.model.get("mid");
            if (lastMid) {
                div.find("tr[style]").css("background-color", "");//清除上一次的背景
                div.find(".curmail").remove();
                var row = div.find("tr[mid=" + lastMid + "]");
                if (row.length > 0) {
                    row.css("background-color", "#fffdd7");
                    // row.find(".td1 div").prepend("<i class=\"curmail\"></i>"); 
                }
            }
        },
        rememberPosition: function () { //记住上次读信位置
            var self = this;
            self.model.set("listPosition", null);//清除
            $(this.$el).scroll(function () { //监听
                self.model.set("listPosition", $(this)[0].scrollTop);
            });


        },
        highlightSelected: function () { //给已选择的行添加高亮背景
            $(".dayAreaTable tr").each(function () {
                var checked = $(this).find("input[type=checkbox]").attr("checked");
                if (checked) {
                    $(this).addClass("on");
                } else {
                    $(this).removeClass("on");
                }
            });

        },

        // 整理当前选中的数据，写入superSelectResult，触发"mailSelectedChange"
        checkboxChange: function (element, shiftKey) {
            var self = this;
            var shiftKey = shiftKey ? true : false;
            var shiftKeyArr = element || [];
            var superSelectResult = self.model.superSelectResult || {};

            // 全选
            if (element && $(element).attr("id") == "chk_mailist_all"){
                var flag = $(element).attr("checked") ? true : false;
                var $trs = self.$el.find(".dayAreaTable tr");
            // 普通选择 or 右键单选
            } else if (!shiftKey) {
                var $trs = $(element).closest("tr");
                var flag = $trs.find("input[type=checkbox]").attr("checked");
            }

            // shift选择直接传入处理好的mid数组（数组用each遍历存在问题）
            if (shiftKey) {
                for (var i = 0, len = shiftKeyArr.length; i < len; i++) {
                    var mid = shiftKeyArr[i];
                    var mail = self.model.getMailById(mid);
                    if (mail && !superSelectResult[mid]) {
                        superSelectResult[mid] = mail;
                    } 
                }
            // 普通选择 or 右键单选
            } else {
                $trs.each(function() {
                    var mid = $(this).attr("mid");
                    var mail = self.model.getMailById(mid);
                    if (flag) {
                        mail && !superSelectResult[mid] && (superSelectResult[mid] = mail);
                    } else {
                        delete superSelectResult[mid];
                    }
                });
            }

            // 用处理好的数据重写跨页选择对象superSelectResult
            self.model.superSelectResult = superSelectResult;

            var count = 0;
            for (var m in superSelectResult) {
                if (superSelectResult.hasOwnProperty(m)){
                    count++;
                }
            }

            this.model.trigger("mailSelectedChange", { count: count, flag: flag});
            //邮件备份不需要添加高亮背景
            if(self.model.get("fid") != 7){
                this.highlightSelected();
            }
        },
        //显示通讯录card
        onReceiverAddrMouseOver:function(e){
            var t = e.currentTarget;
            var mid = $(t).parents("tr").attr("mid");
            var row = this.model.getMailById(mid);
            if (mid && row) { //避免取不到值时浮层在顶部层出
                var email = (row["fid"] == 2 || row["fid"] == 3) ? row["to"] : row["from"];//草稿箱和已发送显示收件人
                M2012.UI.Widget.ContactsCard.show({
                    dockElement: t,
                    margin: 5,
                    email: email.split(',')[0]  //草稿箱和已发送会有多个收件人，选第一个
                });
            }
        },
        createSuperSelectMenu: function () {
            var self = this;
            var folderInfo = this.model.getFolderInfo();
            M2012.UI.PopMenu.createWhenClick({
                target: self.$el.find("#btn_checkMenu"),
                items: [
                    { text: $T.Utils.format("全部({0})封邮件", [folderInfo.stats.messageCount]), type: "all" },
                    { text: $T.Utils.format("未读({0})封邮件", [folderInfo.stats.unreadMessageCount]), type: "unread" },
                    { text: $T.Utils.format("已读({0})封邮件", [folderInfo.stats.messageCount - folderInfo.stats.unreadMessageCount]), type: "read" },
                    { isLine: true },
                    { text: "shift+鼠标左键", type: "shift", items: [{ html: "<b>shift</b>" }] },
                    { isLine: true },
                    { text: "取消选择所有的邮件", type: "none" }
                ], onItemClick: function (item) {
                    self.superSelectAll(item.type);
                }
            }, function (menu) {
                menu.on("subItemCreate", function (item) { //二级菜单render前触发
                    //bindAutoHide(item.menu.el);
                    if (item.type == "shift") { //读信预览
                        $(item.menu.el).removeClass();//清除原有菜单样式
                        $(item.menu.el).css({ position: "absolute" }); //修改宽度
                        $(item.menu.el).html("<img src='../images/global/shift.gif?rnd=" + Math.random() + "'>");
                    }
                    //console.log(item);
                });
            });

        },
        onTableHeaderClick: function (e) {//点击标题栏排序
            var fid = this.model.get("fid");
            // 代办列表不允许点击标题排序
            if (this.model.isTaskMode()) {
                return;
            }
            var args = {
                command: "sort",
                order: $(e.currentTarget).attr("field"),
                desc: this.model.get("desc") ^ 1  //取反（按位非）
            }
            $App.trigger("mailCommand", args); //发送排序命令
        },
        initTableHeaderEvent: function () { //为列表表头添加事件
            var self = this;
            var orderText = self.model.get("orderText");
			var fid = self.model.get('fid');
			var isSearchMode = self.model.get('isSearchMode');
            if (orderText) { $("#btn_sortMenu span").html(orderText); }
            this.createSuperSelectMenu();

			//会话邮件不显示超级全选
			if(($App.isSessionMode() && !isSearchMode && $App.isSessionFid(fid)) || (fid == 7)){
				self.$el.find('#btn_checkMenu').hide();
			}
		
			
            M2012.UI.PopMenu.createWhenClick({
                target: self.$el.find("#btn_sortMenu"),
                items: [  //desc 0:升序  1:降序
                    { text: "时间由新到旧", order: "receiveDate", desc: 1, bh: "mailbox_sortDate" },
                    { text: "时间由旧到新", order: "receiveDate", desc: 0, bh: "mailbox_sortDate" },
                    { text: "发件人升序", order: "from", desc: 0, bh: "mailbox_sortFrom" },
                    { text: "发件人降序", order: "from", desc: 1, bh: "mailbox_sortFrom" },
                    { text: "主题升序", order: "subject", desc: 0, bh: "mailbox_sortSubject" },
                    { text: "主题降序", order: "subject", desc: 1, bh: "mailbox_sortSubject" },
                    { text: "邮件大小升序", order: "size", desc: 0, bh: "mailbox_sortSize" },
                    { text: "邮件大小降序", order: "size", desc: 1, bh: "mailbox_sortSize" }
                ], onItemClick: function (item) {
                    self.model.set("orderText", item.text);
                    $App.trigger("mailCommand", {
                        command: "sort",
                        order: item.order,
                        desc: item.desc
                    }); //发送排序命令

                    BH(item.bh);
                    //alert(item);
                }
            });
            var fid = this.model.get("fid");
            if (fid == 2 || fid == 3) {
                $(self.el).find("#th_from span").html("收件人");
            } else if (this.model.isApproachMode() && !this.model.get("IamFromLaiwang")) {
                var op = this.model.get("searchOptions");
                if (op && op["condictions"] && op["condictions"].length>0 && op["condictions"][0].field == "from") {
                    $(self.el).find("#th_from span").html("发件人");
                } else {
                    $(self.el).find("#th_from span").html("收件人/发件人");
                }
            }

            if (self.$el.find('#th_from').length) {
                self.listHeader = self.$el.find('#th_from').parent('td').html();
            }
			
			//添加控制备注样式
			var mailListCon = $(this.$el);
			if(this.model.get("showSummary")){
				mailListCon.addClass('havetext');
			}else{
				mailListCon.removeClass('havetext');				
			}
			
        },
        //超级全选 type取值范围 ：all全部 read 已读 unread未读
        superSelectAll: function (type) {
            if (type == 'shift') return;
            var self = this;
            var mids = this.model.superSelectAll(type, function (result) {                
                // 为了兼容跨页选择，当superSelectResult中有保存了mail信息的mid时不覆盖
                var superSelectResult = type == "all" ? self.model.superSelectResult : {};
                $.each(result.mid, function(k, v) {
                    !superSelectResult[v] && (superSelectResult[v] = null);
                });
                self.model.superSelectResult = superSelectResult;//保存超级全选结果
                if (type == "all") { //全选
                    self.$el.find("#chk_mailist_all").attr("checked", true);
                    self.$el.find(".dayAreaTable input[type=checkbox]").attr("checked", true);
                } else if (type == "none") { //取消
                    self.$el.find(".dayAreaTable input[type=checkbox]").attr("checked", false); //先清空选择
                    self.model.clearSuperSelect();
                    self.$el.find("#chk_mailist_all").attr("checked", false);
                } else if (type == "read" || type == "unread") { //已读或未读
                    self.$el.find(".dayAreaTable input[type=checkbox]").attr("checked", false); //先清空选择
                    self.$el.find(".dayAreaTable h3").each(function () {
                        if (($(this).hasClass("fw_b") && type == "unread") || (!$(this).hasClass("fw_b") && type == "read")) {
                            $(this).parents("tr").find("input[type=checkbox]").attr("checked", true);
                        }
                    })
                }
                self.checkboxChange();
            });
        },

        //超级全选，跨页选中复选框
        crossPageCheckbox: function () {
            var midList = this.model.getSelectedRow().mids;
            var self = this;
            if (midList && midList.length > 0) {
                $(self.model.get("mailListData")).each(function (i, n) {
                    if ($.inArray(n.mid, midList) >= 0) {
                        self.$el.find("tr[mid=" + n.mid + "]").find("input").attr("checked", true);
                    }
                });
                this.checkboxChange();
            }
        },
        renderContainer: function () {
            //this.toolbarEl = $("<div></div>");
            //this.$el.append(this.toolbarEl);
            //this.$el.html("");
            //this.$el.append(this.template["header1"]);
            //this.contentEl = $("<div></div>");
            //this.$el.append(this.contentEl);
            this.listEl=this.$el.find("#div_maillist");
        },
        render: function (isFlipPage) {
            var self = this;
            
           
            
            this.renderContainer();
            if (!isFlipPage) { //是加载第一页，重置页码为第一页

                if (self.model.get("isSearchMode")) {
                    self.model.set("isNewSearch", true);//是重新搜索
                    BH("searchResult_load");
                } else {
                    BH("mailbox_load");

                }
                this.model.addLoadBehavior();
            } else { //是翻页
                /*if (self.model.get("isSearchMode")) {
                    self.model.set("isNewSearch", false);//是重新搜索
                }*/
            }
            var tagView = M2012.Mailbox.View.MailTag.prototype.createInstance(); //tagview的单例
            M139.UI.TipMessage.show("正在加载中...");
            this.model.getDataSource(function (dataSource, stats) {
                //var pm=appView.tabpageView.model; //父view的model，即模块管理类
                //this.el=pm.getModule(pm.get("currentModule")).element;//显示容器
                M139.UI.TipMessage.hide();

                
                //self.$el.show();
                
                if (!isFlipPage || (isFlipPage && self.model.get("flipType") == "common")) { //加载第一页，或是普通方式翻页
                    var templateStr;
                    if (self.model.get("layout") == "left") { //左右布局
                        templateStr = $("#template_maillist_left").val();
                    } else { //列表部局、上下布局
                        templateStr = $("#template_maillist").val();
                    }

                    // 如果不显示邮件大小列，则剔除掉模板中相应的td
                    // 代办任务列表页不显示
                    if (self.model.get("showSize") == false ||　self.model.isTaskMode()) {
                        templateStr = templateStr.replace(/<td class="td4"><a id="th_size".+?<\/td>/ig, "")
                        .replace(/<td class="td4">@getSize.+?<\/td>/ig, "");
                        self.$el.find("#th_size").parents("td").addClass("maillist-tdhide");//.hide();
                    }

                    var rp = new Repeater(templateStr);
                    self.repeater = rp;
                    rp.model = self.model;
                    rp.view = self;
                    rp.Functions = createMailboxRenderFunctions(self.model, self);
                    rp.Functions.getTagList = tagView.render;//标签的view
                    rp.ItemDataBound = null;//避免第一页执行itemdatabound
                    self.model.set("mailListData", dataSource);//保存数据源
                    self.model.checkUnreadChange();//检查第一页新邮件数是否增加了
                    var html = rp.DataBind(dataSource); //数据源绑定后即直接生成dom
                    if (dataSource.length == 0) { //无数据的提示
                        self.$el.find("#list_header").remove();

                        // 【账单模式&&非左右分栏】需要追加样式来保证右侧正常
                        if (self.model.isBillMode() && self.model.get("layout") != "left") {
                            self.$el.find('.billright').addClass('bill-serve-right');
                        }
                        if (!self.model.isApproachMode() || self.model.get("layout") == "left" || self.model.get('billtype')) {
                            $('#myAccountList2').css('margin-top', '188px');
                        }
						//如果是搜索模式，且搜索的是发件人，且结果为0的时候，手动调一次搜索主题
						var from_setting = top.$App.getMailboxView().model.get("setting");
						var from_searchIsComeformDefault = top.$App.getMailboxView().model.get("searchIsComeformDefault");
						if(self.model.get("isSearchMode") && from_setting == "from" && from_searchIsComeformDefault == "from"){
							var searchContent = self.model.get("searchContent");
							self.model.set("setting","subject");
							$App.searchMail({condictions : [{field:"subject",operator:"contains",value:searchContent}]});
							setTimeout(function(){
								self.model.set("searchContent","");
								self.model.set("setting","");
							},1000);
							
							return;
						}
                        html = self.getEmptyTemplate();
                    } else {
                        self.$el.find('.billright').removeClass('bill-serve-right');
                    }
                    $(self.el).find("#div_maillist")[0].innerHTML=html;

                    if (self.model.isTaskMode() && self.model.get("layout") == "left") {

                        // 代办列表在左右分栏模式下，移除排序列
                        self.$el.find('#list_header .td6').remove()
                    }
                    self.onResize();
                    if (self.model.isBillMode()) { //非分栏模式显示账单菜单
                        self.addBillCenter();
                    }

                    self.initListEvents();


                    dataSource.length > 0 && self.changeReadMailArea(0); //未选择提示

                    tagView.attachHintForTag();
                    self.firstLoaded = false;

                    self.prevSectionName = rp.prevSectionName;//暂存当前页的最后一个分组名称，用于驱动生成下一页的分组。
                    if (self.model.get("order").indexOf("Date") == -1) { //非日期排序时隐藏日期分组
                        self.$el.find(".daytableTitle").hide();
                    }
                } else { //滚动条方式自动翻页
                    console.log("滚动条方式自动翻页");
                    self.repeater.ItemDataBound = self.repeaterItemDataBound;//调用ItemDataBound事件，在翻页时异步添加tr数据
                    self.model.set("mailListData", self.model.get("mailListData").concat(dataSource));//保存合并的数据源

                    self.repeater.DataBind(dataSource); //用下一页的数据源重新生成html，但不生成dom,dom生成交由ItemDataBound完成
                    self.initListEvents();//重新生成列表事件

                }

                self.crossPageCheckbox();//跨页超级全选

                if (self.model.isApproachMode() && !isFlipPage) {
                    self.model.set("searchStats", stats);//搜索结果分类统计
                    $App.getView("mailbox_other").searchClassify.render();
                }

                //排序图标
                $(self.$el).find("#list_header a").each(function () {
                    var field = $(this).attr("field");
                    if (self.model.get("fid") == 3 && field == "from") { field = "to" }
                    if (field == self.model.get("order")) {
                        var desc = Number(self.model.get("desc")) ^ 1;
                        $(this).find("i")[0] && ($(this).find("i")[0].className = "i_th" + desc); //ui给的样式名做反了，所以要取反操作
                    }
                    //var currentOrder=self.model.get("order");
                    //var currentDesc=self.model.get("desc");
                });
                self.model.trigger("mabilbox_render", { isFlipPage: this.isFlipPage, data: dataSource }); //通知邮件列表已显示完成
                self.onResize();
                self.restorePosition();
                self.rememberPosition();
                //$(this.el).find("tr[mid]").mousedown(function () {
                var dragView = M2012.Mailbox.View.Drag.prototype.createInstance({ el: self.el }); //创建拖拽邮件view的单例
                dragView.render();
                //});
                // 根据是否出现滚动条微调邮件列表样式
                self.setMailListPadding();

                if (!(dataSource.length > 0 && dataSource[0].flags && dataSource[0].flags.top==1)) { 
                    self.listEl.find("#period_today").parents("a").hide();
                    self.listEl.find("#period_top").parents("a").hide();
                }
                if (self.model.isSubscribeMode()) { //订阅邮件隐藏标记菜单
                    self.$el.find(".td5").hide();
                }
                if(self.model.get("fid") == 7){//邮件备份隐藏大小，待办，标记
                     self.$el.find(".tdtitle").find(".maillist-starwarp").hide();
                     self.$el.find(".td4").hide();
                     self.$el.find(".td5").hide();
                }
            });
            $App.getCurrentTab().element.className = $User.getPageStyleByKey(self.model.get("pageStyle"));
            /*        
            if (!window.RefreshSetting) {
                $App.getCurrentTab().element.className = $User.getPageStyle();
            } else {
                window.RefreshSetting = null;
            }*/

            
        },

        setMailListPadding: function() {
            // 根据是否出现滚动条微调邮件列表样式
            var $maillist = this.$el.find("#div_maillist");
            if (!$maillist[0]) return;
            if ($maillist[0].scrollHeight > $maillist.height()) {
                $maillist.removeClass('bgPadding').addClass('bgPadding_left');
            } else {
                $maillist.removeClass('bgPadding_left').addClass('bgPadding');
            }
        },

        //账单中心
        addBillCenter: function () {
            var self = this;
            var myBillId = self.model.get('specialFolderId').myBill;
            var isSearchMode = self.model.get('isSearchMode');
            var fid = self.model.get('fid');
            var billtype = self.model.get('billtype');
            var parentContainer = this.$el.parent().parent().parent();
            var billContainer = parentContainer.find('#mybillitem');
            var inboxHeader = parentContainer.find('#inboxHeader');
            var toolBar = parentContainer.find('.toolBar');
            //   inboxHeader.hide(); //loadbilltype再判断是否显示
            //   toolBar.hide();

            //当前是我的账单文件夹非搜索模式
            if (fid == myBillId && !isSearchMode) {
                //修改账单类型
                try {
                    self.model.updateBillType(function (result) {
                        //日志
                    });
                } catch (e) { }

                billContainer.find('li:eq(0) a').addClass('current');

            }

            //点击改变背景色[由于暂时没有定义皮肤，所以看不到底色，先实现功能]
            //if(self.model.isBillMode()){
            billContainer.find('a[data-billtype=' + billtype + ']').addClass('current');
            //}

            /*
            //或当前是账单内搜索（区分其他搜索）
            if(fid == myBillId || ($App.getCurrentTab().title == '账单中心' && isSearchMode)){
                var display = "";
                if ($User.getProvCode() == 1 && $User.getCardType() == "1") { //广东全球通用户
                    display = "";
                } 
                if (display !== ""){
                    return;
                }
            }
            */

            //定义账单中心事件
            $App.on('showBillManager', function (e) {
                $App.show('billManager');
                try {
                    $App.closeTab('mailbox_' + myBillId);
                    $App.closeTab('mailbox_1'); //搜索
                } catch (e) { }
            });

            //账单中心点击
            parentContainer.find('#showbillmanager').click(function () {
                $App.trigger('showBillManager', {});
            });

            /**
             * @2014-7-3
             * modified by wn
             */
            //账单子项点击
            // parentContainer.find("#mybillitem a").click(function () {
            //     var billtype = $(this).attr('data-billtype');
            //     if (billtype) {
            //         var options = {
            //             billType: billtype,
            //             title: '账单中心',
            //             fid: 1,
            //             flags: { billFlag: 1 }
            //         };
            //         $App.searchMail(options);
            //     } else {
            //         $App.showMailbox(myBillId);
            //     }
            // });
            // add by zhangsixue for Account Center
            parentContainer.find("#myAccountList2 a").click(function () {
                $Msg.showHTML("<iframe src='http://bill.mail.10086.cn/handler/bill/goto.ashx?lc=line&sid=" + sid + "' frameborder=\"0\" allowTransparency=\"false\" style='border:0px;width:780px;height:355px'/>", {
                    width: 800,
                    height: 355,
                    buttons: ["关闭"],
                    dialogTitle: "账单消费概况"
                });
            });
            
            self.loadBillType();
        },

        //加载账单类型
        loadBillType: function () {
            var self = this;
            var data = {};
            var parentContainer = self.$el;
            var billEmptyHtml = [
            '<div class="billleftDiv bill_list_null"><h2>你暂时没有账单邮件</h2>',
            '<p>您可以在账单管理<a href="javascript:;" onclick="$App.trigger(\'showBillManager\',{})" title="开通账单服务">开通账单服务</a>，让您每月收到账单信息，时刻掌握自己的消费状况！',
            '</p><img src="http://image0.139cm.com/rm/richmail/images/billCenter/bill_null.png">',
            '</div>'].join(""); //未开通
            var billEmptyTips = ['<div class="noindexbody">',
            '<div class="empty_btn">本文件夹下暂无邮件</div>',
            '</div>'].join(""); //已开通

            var billContainer = parentContainer.find('.billright');
            var inboxHeader = parentContainer.find('#inboxHeader,.toolBar');
            var mailListBox = this.$el.find('#div_maillist');

            function controlBillCenter(isOpen) { //账单中心业务处理
                var isEmptyCount;
                if (parentContainer.find('#emptyBillContainer')[0]) {
                    isEmptyCount = true;
                }
                if (isEmptyCount) {
                        /**
                         * @2014-7-3 modified by wn 
                         * 下线账单管理
                         */
                        // mailListBox.html(billEmptyTips);
                    mailListBox.html(billEmptyTips);
                    inboxHeader.hide();
                } else {
                    //    inboxHeader.show();
                    self.onResize();
                }
            }

            self.model.getBillTypeList(function (result) {
                if (result["var"] && result["var"].length > 0) {
                    var varLen = result["var"].length;
                    var arrStatus = [];
                    for (var i = 0; i < varLen; i++) {
                        var status = result["var"][i].status; // 1为开通 ,2为关闭
                        arrStatus.push(status);
                    }
                    arrStatus.sort();
                    for (var o = 0; o < arrStatus.length; o++) {//去除重复
                        if (arrStatus[o] == arrStatus[o + 1]) {
                            arrStatus.splice(o + 1, 1);
                            o = o - 1;
                        }
                    }
                    if (arrStatus.length > 1) {//至少开通了一个账单
                        controlBillCenter(true);
                        billContainer.find(".aside-bd .bill_box").eq(0).hide(); //右侧logo
                        billContainer.find(".ads_bill").removeClass("ads_bill1").addClass("ads_bill2"); //
                    } else {
                        if (arrStatus[0] == 1) {//全部开通
                            billContainer.find(".aside-bd .bill_box").eq(0).hide();
                            controlBillCenter(true);
                        }
                        if (arrStatus[0] == 2) {//全部未开通
                            billContainer.find(".aside-bd .bill_box").eq(0).show();
                            billContainer.find(".ads_bill").removeClass("ads_bill2").addClass("ads_bill1");
                            controlBillCenter();
                        }
                        if (arrStatus[0] == 0) {
                            billContainer.find(".aside-bd .bill_box").eq(0).hide();
                            controlBillCenter();
                        }
                    }
                } else {
                    controlBillCenter();
                }
            });
        },

        getEmptyCluster: function(clusterFlag) {
            var template = [ '<div class="noindexbody noindexbodyS"><div class="empty_btn">',
                            '<div class="boxIframeText" style="margin:0 auto; width:300px;text-align:left">',
                                 '<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                                     '<dl class="norTipsContent">',
                                         '<dt class="norTipsTitle">没有找到邮件，可能：</dt>',
                                         '<dd class="norTipsLine">1.您的订阅邮件被转移至其他文件夹</dd>',
                                        '<dd class="norTipsLine">2.您没有{0}，请到 <a href="javascript:$App.show(\'googSubscription\');">云邮局</a> 订阅</dd>',
                                     '</dl>',
                                 '</div>',
                             '</div></div></div>'].join("");

            return $T.Utils.format(template, [
                    clusterFlag ? '订阅杂志' : '订阅服务', 
                    clusterFlag ? 'http://fun.mail.10086.cn/ymail/1403/morentupian/p11.html' : 'http://fun.mail.10086.cn/ymail/1403/morentupian/p12.html']);
        },

        getEmptySearch: function () {
            $("#btn_emptySearch").die("click");//移除事件，避免dom销毁后的幽灵事件
            $("#btn_emptySearch").live("click", search);

            function search(sender) {
                var keyword = $("#tb_emptyKeyword").val().trim();
                if (keyword != "") {
                    if (keyword.length > 100) {
                        top.FF.alert('仅支持对100个字符的关键词搜索，100个字符外的字词将被忽略');
                        keyword = keyword.substring(0, 100);
                    }
                    $App.searchMail(keyword);
                    $("#tb_mailSearch").val(keyword); //搜索输入框需同步为最近一次搜索的关键词。
                    $("#btn_emptySearch").die("click", search);//移除事件
                } else {
                    $Msg.alert("请输入关键字");
                }


            }
            var text = '请输入发件人、收件人或邮件主题的关键字进行搜索。';
            if (this.model.get('isFullSearch')) {
                text = '请输入发件人、收件人、邮件主题、正文、附件名或附件内容的关键字进行搜索。';
            }
            return ['<div class="noindexbody noindexbodyS"><div class="empty_btn">',
                    '<div>没有找到邮件</div>',
                    '<p>' + text + '</p>',
                    '<div><input type="text" id="tb_emptyKeyword" class="iText" value="">',
                    '<a href="javascript:void(0);" id="btn_emptySearch" class="btnNormal ml_5"><span>搜 索</span></a>',
                    '</div></div></div>'].join("");

        },
        getEmptyStar: function () {
            return ['<div class="bgMargin_top">',
                '<h2 class="" style="font-weight:bold;">您暂时没有"星标"邮件</h2>',
                '<p class="tipTxt">您可以在邮件列表中将邮件设为星标,方便查找重要邮件。</p>',
                '<img src="../images/global/nostar.png" alt="您可以在邮件列表中将邮件设为星标,方便查找重要邮件。" style="margin-top:5px;">',
                '</div>'].join("");
        },
        getEmptyTask: function () {
            return ['<div class="bgMargin_top">',
                '<h2 class="" style="font-weight:bold;">您暂时没有"待办任务"邮件</h2>',
                '<p class="tipTxt">您可以将邮件设为待办任务,方便查找重要邮件。</p>',
                '<img src="../images/global/norenwu.jpg" alt="您可以将邮件设为待办任务,方便查找重要邮件。" style="margin-top:5px;">',
                '</div>'].join("");
        },
        getEmptyTaskdone: function () {
            return ['<div class="bgMargin_top">',
                '<h2 class="" style="font-weight:bold;">您暂时没有"已完成"邮件</h2>',
                '<p class="tipTxt">您可以将您的待办任务邮件设为已完成。</p>',
                '<img src="../images/global/norenwudone.jpg" alt="您可以将您的待办任务邮件设为已完成。" style="margin-top:5px;">',
                '</div>'].join("");
        },
        getEmptyUnread:function(){
            return ['<div class="noindexbody">',
                   '<div class="empty_btn">没有找到未读邮件</div>',
                   '<p></p>',
               '</div>'].join("");
        },
        getEmptyVoiceMail:function(){
            return ['<div class="voicemail">',
 		'<img src="/m2012/images/global/voicemail_01.png" alt="" title="">	',
 		'<p>您暂时还未收到语音来电留言哦！o(∩_∩)o <br><a href="javascript:$App.show(\'voiceSetting\')" id="voice_setting">查看设置 &gt;&gt;</a></p>',
 	'</div>'].join("");
        },
        //无数据时的模板
        getEmptyTemplate: function () {
            //$(".toolBar").remove();
            
            this.toolbarView.$el.find('.toolBar').remove();
            
            var self = this;
            var fid = Number(this.model.get("fid"));
            var folder = this.model.getFolderInfo(fid);
            var mainText = folder["name"] + "没有邮件";
            var emptyBillContainer = '<div style="display:none" id="emptyBillContainer"></div>';

            if (self.model.isBillMode()) {
                if (self.model.get("billTab") == 3) {
                    return this.getEmptyVoiceMail();
                }
                return emptyBillContainer;
            } else if (self.model.get("isSearchMode")) {
                if (self.model.isClusterColumn()) {
                    return self.getEmptyCluster(true);
                } else if (self.model.isClusterList()) {
                    return ["<div style='height: 40px;padding-top: 35px;text-align: center;color: #666;font-weight: bold;'>此栏目下无邮件，&nbsp;",
                            "<a href='javascript:$App.closeTab();'>关闭</a>",
                            "&nbsp;此页面</div>",
                            "<iframe width='100%' frameborder='no' src='http://fun.mail.10086.cn/ymail/1403/morentupian/p11.html'/>"].join("");
                } else if (self.model.isStarMode()) { //星标邮件
                    return self.getEmptyStar();

                } else if (self.model.get('isTaskbacklogMode')) {
                    return self.getEmptyTask();

                } else if (self.model.get('isTaskdoneMode')) {
                    return self.getEmptyTaskdone();

                } else if (self.model.isUnreadMode()) {
                    return self.getEmptyUnread();
                } else {
                    return self.getEmptySearch();
                }
            } else {
                function getFolderDesc() {
                    var type = $App.getFolderType(fid)
                    if (type == 3) { //custom
                        return '创建收信规则，将指定发件人或指定条件的邮件收取到此文件夹。<a href="javascript:$App.show(\'createType\')">去创建</a>'
                    } else if (type == -3) { //pop
                        return '代收邮件可帮助您收取、管理其他邮箱的邮件。<a href="javascript:$App.show(\'popmail\')">了解更多</a>'
                    }

                }
                var html = ['<div class="noindexbody">',
                    '<div class="empty_btn">', mainText, '</div>',
                    '<p>', getFolderDesc(), '</p>',
                '</div>'].join("");
                return html;
            }
        },
        loadNextPage: function () {	//加载下一页
            this.model.nextPage();
            this.render(true);
        },
        //行绑定事件，生成每一行时都会触发，用于滑动翻页时生成每一行的html片断，逐行插入邮件列表底部
        repeaterItemDataBound: function (args) {
            if (this.view.prevSectionName != args.sectionName) { //和前一页的分组名称相比改变了，生成新的分组
                this.view.prevSectionName = args.sectionName;
                var start = this.sectionStart.replace("@getSectionName", args.sectionName)
                this.view.el.find("table:last").after(start + this.sectionEnd);
            }
            var html = args.html;
            this.view.el.find("table:last")
                .children("tbody").append(html);


        },
        getSelectedRow: function () { //获取选中行
            return this.model.getSelectedRow(this.$el);
        },

        //读信区域变化
        changeReadMailArea: function (selectedCount) {
            var temp = ['<div class="noindexbody"><div class="empty_btn">{0}</div></div>'].join("");
            var text = '您尚未选择邮件。';
            if (selectedCount > 0) {
                this.model.set("mid", null);//清空读信选择
                text = '您当前选中了' + selectedCount + '封邮件，<strong>shift+鼠标左键</strong>可选择多封邮件。';
            }
            var moreMemuBtn = this.$el.find('.toolBarArray #btn_more');
            moreMemuBtn.hide();
            var container = this.$el.find('#readWrap');
            container.html($T.Utils.format(temp, [text]));
        },
        getViewOffsetTop: function () {
            var height;
            var layout = this.model.get("layout");
            if (layout == "top" || layout == "left" || this.model.get("fid") != "1") {
                height = this.listEl.offset().top;
            } else {
                //height = 152;//收件箱写死高度
                height = this.listEl.offset().top;
            }
            return height;
        },
        onResize: function () {
            if (this.el) {
                try {
                    if (!this.$el.is(":visible")) { return;} //多实例运行，避免不可见的列表触发resize
                    var div_mail = $('#div_mail:eq(0)');
                    var bottomPosition = $App.getBodyHeight();
                    if (this.model.get("layout") == "top") { //上下布局
                        bottomPosition = this.$el.find("#mailbox_split").offset().top + 4;
                        var readmailHeight = $App.getBodyHeight() - bottomPosition - this.$el.find("#mailbox_split").outerHeight(true) + 6;
                        var readWrap = this.$el.find("#readWrap:eq(0)");
                        readWrap.height(readmailHeight);
                        readWrap.find(".inboxfl").height(readmailHeight);//读信还有一级子容器的高度也要改
                        var covCon = readWrap.find("div.cov-list");
                        if(covCon[0]){
                            var tipsH = readWrap.find("div.inboxTips").height() || 0,
                                titH = readWrap.find("div.cov-title-bg").height() || 0;
                            covCon.height(readmailHeight - tipsH - titH - 6); //会话邮件
                        }
                        if (this.model.isApproachMode()) {
                        //    $("#div_searchclassify").height($("#div_main").height() - $('#toolbar_div').height() - 4);
                        //上下模式+搜索模式。
                            $("#div_searchclassify").css("height","auto");
                            setTimeout(function(){
                                var div_mail_height = $("#div_mail").height();
                                
                                var div_searchclassify = $("#div_searchclassify").height();
                                if(div_searchclassify > div_mail_height){
                                    
                                    $("#div_mail").css({"overflow-y":"auto", "height": div_mail_height + "px"});
                                }else{
                                    $("#div_mail").attr("style","").css("height", div_mail_height + "px");
                                }
                            },1000);
                        }
                    } else if (this.model.get("layout") == "left") { //左右布局时，resize改变右侧大小
                        var listEl = this.$el.find("#div_maillist"); //第一次resize执行太早，要直接取maillist
                        var splitBar = this.$el.find("#mailbox_split");
                        var height = $App.getBodyHeight() - listEl.offset().top - 4;
                        var mailListWidth = (listEl[0].scrollHeight > listEl.height()) ? splitBar.position().left -14 : splitBar.position().left-28;
                        splitBar.height(height);
                        listEl.width(mailListWidth);// 因为多出了24外边距
                        var readmailWidth = $("#div_main").width() - splitBar.position().left - 6; //计算读信容器的宽度
                        if (this.model.isApproachMode()) {
                            div_mail.width(readmailWidth);
                            div_mail.height(height);

                        } else {
                            this.$el.find("#readWrap").width(readmailWidth-1);
                            this.$el.find("#readWrap").height(height);
                           
                            
                        }
                    }
                    //邮件列表的高度=邮件列表底部坐标-邮件列表顶部坐标
                    var height;
                    if (this.model.isApproachMode() && this.model.get("layout") == "list") {
                        div_mail.height(bottomPosition - div_mail.offset().top - 4);
                    } else {
                        if (this.model.isClusterColumn() || this.model.isClusterList()) {
                            height = bottomPosition - this.listEl.offset().top - 6;
                            this.listEl.height(height);
                            this.listEl.find('iframe').height(height - 114 - 5);
                        } else {
                            height = bottomPosition - this.getViewOffsetTop() - 6;
                            this.listEl.height(height);
                        }
                    }
                } catch (e) { }
            }
        },
        cancelChoice: function() {
            this.model.superSelectResult = {};
            $(this.el).find('#list_header td:eq(1)').removeClass('td6').addClass('td2').html(this.getFromHtmlInListHeader());
            $(this.el).find('#chk_mailist_all').attr("checked", false);
            this.$el.find(".dayAreaTable input[type=checkbox]").attr("checked", false);
            // 更新分栏情况下，读信区域的内容
            this.changeReadMailArea(0);
            // 记录行为日志
            // 取消跨页选择判定标识
            if (this.model.get('crossPageSelect')) {
                BH('cross_page_select_cancel');
                this.model.set('crossPageSelect', false);
            } 
        },

        getFromHtmlInListHeader: function() {
            // 左右分栏直接不存在对应的结构，所以直接移除
            var layout = this.model.get('layout');
            if (layout == 'left') return '';

            var order = this.model.get('order');
            var desc = this.model.get('desc');            
            var $listHeader = $(this.listHeader);
            if (order == 'from') {
                $listHeader.find('i').removeClass('i_th0, i_th1').addClass('i_th'+(1-desc));
            }
            return $listHeader[0];
        },
         changeMailStyle: function(e){
            if(this.model.get("fid") != 7){return};
            var t = e.currentTarget;
            $(t).find("td").css("cursor","default");
            $(t).find("a").attr('href', 'javascript:;').css('cursor', 'default');
            $(t).find("p").css('cursor', 'default');
            $(t).find("td").css("background","#ffffff");
        }
    })
});