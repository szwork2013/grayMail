M139.namespace("M2012.Mailbox.View", {
    Main: Backbone.View.extend({
        template: {
            listHeader:'<div class="bgPadding"><table id="list_header" class="tableTitle">\
		<tbody>\
			<tr>\
				<td class="td1"><input type="checkbox" id="chk_mailist_all"/><i bh="mailbox_selectAllDrop" class="i_triangle_d" id="btn_checkMenu"></i></td>\
				<td class="td2"><a id="th_from" field="from" href="javascript:" hidefocus="true"><span>发件人</span><i class=""></i></a></td>\
				<td class="tdtitle"><a id="th_subject"  field="subject" href="javascript:" hidefocus="true"><span>主题</span><i class=""></i></a></td>\
				<td class="td3"><a id="th_date" field="receiveDate"  href="javascript:" hidefocus="true"><span>日期</span><i class=""></i></a></td>\
				<td class="td4"><a id="th_size" field="size"  href="javascript:" hidefocus="true"><span>大小</span><i class=""></i></a></td>\
				<td class="td5"></td>\
			</tr>\
		</tbody>\
	</table></div>',
            listHeaderLeft: '<div class="bgPadding"><table class="tableTitle" id="list_header">\
    <tbody>\
      <tr>\
        <td class="td1"><div class="tdsel"><!-- 选中时加上 class="tdselOn" --><input type="checkbox" id="chk_mailist_all"/><i bh="mailbox_selectAllDrop" class="i_triangle_d" id="btn_checkMenu"></i> </div></td>\
        <td class="tdtitle"></td>\
        <td class="td6"><div class="tdsel"><!-- 选中时加上 class="tdselOn" --> \
          <a href="javascript:" id="btn_sortMenu"><span>时间由新到旧</span><i class="i_triangle_d" ></i></a> </div></td>\
      </tr>\
    </tbody>\
  </table></div>'
        },
        initialize: function (options) {
            var self = this;
            
            if (options && options.multiInstance) { //多实例不再执行后面的 on监听，否则会重复监听
                this.model = $App.getView("mailbox").model.clone();
                this.model.set("multiInstance", true);
                this.model.set("searchIsComeformDefault", false);
                this.model.set("isTaskMode", false);
                //this.model.set("isTaskbacklogMode", false);
                this.model.set("subscribeName", options.subscribeName);
                options.isSearch && this.model.set("isSearchMode", true);
                return;
            } else { //单实例
                this.model = new M2012.Mailbox.Model.Mailbox();
            }

            function clearMailboxCache() {
                //清掉所有多实例的缓存
                var view = $App.getCurrentView();
                view.model.set("needReload", true);
                view = $App.getView("mailbox");
                view.model.set("needReload", true);
                view = $App.getView("mailbox_other");
                view.model.set("needReload", true);
            }
            appView.on("showMailbox", function (e) { //显示邮件列表事件,由appview分发mailbox的model 改变事件
                if (e && !isNaN(e.fid)) {
                    var currentModel = self.model;
                    function markCallBack(){
                            $App.trigger("reloadFolder", { reload: true });//数据已改变，通知文件夹列表刷新
                            //$App.on("folderRendered", onFolderLoaded);
                        }
                     if(e.fid === 2){//草稿箱刷新时全部标记为已读
                        currentModel.markAllRead(e.fid,false,markCallBack);
                    }


                    if (e.view) {
                        currentModel = e.view.model;//非收件箱的其它文件夹共用一个实例
                    }
                    currentModel.clearSuperSelect()//清空超级全选结果
                    if (e.fid != currentModel.get("fid")) { //切换文件夹时重置为第一页
                        currentModel.set("pageIndex", 1);
                        currentModel.set("firstPageUnreadCount", null);

                    }
                    if (!(e && e.comefrom == "commandCallback")) {
                        currentModel.set("mid", null);//清空mid选择项
                    }


                    currentModel.set("fid", e.fid);
                   
                    currentModel.set("needReload", true);
                    if (e.fid > 1 || e.isSearch) { //非收件箱的列表共用一个实例
                        $App.showPage({ name: "mailsub_0", view: $App.getView("mailbox_other") })
                    } else {
                        $App.showPage({ name: "mailbox_" + e.fid, view: self, group: "mailbox" })
                    }

                } else { //不传fid时，仅用于刷新
                    //self.render();
                    if ($App.getCurrentTab().group == "mailbox") {
                        self.render();
                    } else {
                        if (e && e.comefrom == "commandCallback") { //不如不在邮件列表操作，只清缓存，不切到收件箱
                            clearMailboxCache();

                            if ($App.getCurrentTab().name.indexOf("mailsub_") >= 0) {//订阅邮件多实例特殊处理
                                var v = $App.getMailboxView();
                                v.model.set("needReload", true);
                                v.render(true);
                            }
                            return;
                        }
                        
                        if ($App.getCurrentView().model.get("fid") > 1 || $App.getCurrentView().model.get("isSearchMode")) { //非收件箱的列表共用一个实例
                            $App.showPage({ name: "mailsub_0", view: $App.getView("mailbox_other") })
                        } else {
                            $App.showPage({ name: "mailbox_" + self.model.get("fid"), view: self, group: "mailbox" })
                        }
                        //$App.showPage({ name: "mailbox_" + self.model.get("fid"), view: self, group: "mailbox" });
                    }
                }

            });

            

            appView.on("mailboxDataChange", function (options) { //通知邮件列表数据发生改变，切换标签时需要刷新
                clearMailboxCache();
                var view = $App.getCurrentView();
                if (options && options.render) {
                    if ($App.isMailbox()) {
                        view.render();
                    }
                }
            });

            appView.on("reloadFolder", function () { //文件夹数据改变（添加、删除文件夹和标签时需要重新生成工具栏）
                var view = $App.getCurrentView();
                var model = view.model;
                clearMailboxCache();
                if (view.toolbarView) { //避免没打开收件箱时收到消息
                    view.toolbarView.render();
                    model.trigger("mabilbox_render", self.model.get("mailList"));
                }
            });

            appView.on("changeStar", function () { //标记星标时，如果是在星标搜索视图，同步刷新
                var model = $App.getCurrentView().model;
                if (model.isStarMode()) {
                    $App.trigger("showMailbox");
                }
            });



            appView.on("reduceFolderMail", function (e) {
                // setTimeout(function () {
                var view = $App.getCurrentView();
                if (view.toolbarView) {
                    view.toolbarView.refreshCount();//刷新未读数
                    view.listView.createSuperSelectMenu();//刷新未读数
                }
                // }, 100);
            });

        },

        //获取邮件列表容器，主要是区分账单中心特殊结构
        getMailListWrap: function (type) {
            var self = this;
            var fid = self.model.get('fid');
            var billType = self.model.get('billtype');
            var html = '';

            //我的账单列表结构
            var divMaillistWrap = {
                '0': "<div id='div_maillist' class='p_relative bgPadding' style='overflow-y:auto'></div>",
                '1': "<div id='div_maillist' class='p_relative bgPadding' ></div>"
            };

            //@2014-7-3 modify by wn 隐藏账单提示
            //
            // var myBillWrapHtml = ['<div class="billleft">',
            //     '<div class="billleftDiv">',
            //          '{0}',
            //     '</div>',
            //     '</div>',
            //     '<div class="billright">',
            //     '<div class="aside-bd aside-bd1" style="margin-left: 6px;">',
            //     '<div class="bill_box" style="display:none"><h3>温馨提示</h3><span class="ads_bill ads_bill1"><a href="javascript:;" id="showbillmanager" title="账单管理"></a></span></div>',
            //     '<div class="bill_box"><h3>我的账单：</h3>',
            //         '<ul id="mybillitem">',
            //              '<li><a href="javascript:;"  ><i class="i_bill"></i>全部账单</a></li>',
            //              '<li><a href="javascript:;"  data-billtype="10" ><i class="i_bill"></i>移动账单</a></li>',
            //              '<li><a href="javascript:;"  data-billtype="11" ><i class="i_bill"></i>生活账单</a></li>',
            //              '<li><a href="javascript:;"  data-billtype="12" ><i class="i_bill"></i>金融账单</a></li>',
            //              '<li><a href="javascript:;"  data-billtype="13" ><i class="i_bill"></i>其他账单</a></li>',
            //         '</ul>',
            //     '</div>',
            //     '</div>',
            //     '</div>',
            //     '<div id="myAccountList2" style="float:left; background: #fff; width: 214px;margin-left: -226px;border: 6px solid #fff;margin-top: 150px;"><a href="javascript:;"><i class="i_bill"></i><img src="/m2012/images/module/bill/bg_title.jpg" /></a></div>',
            //     '<div style="clear:both;"></div>'].join(""); 
                //清除浮动
            var myBillWrapHtml = ['<div class="billleft" >',
                '<div class=\"billleftDiv\"  style=\"margin:0px;\" >',
                     '{0}',
                '</div>',
                '</div>'].join("");
            //账单中心或账单搜索且不是分栏模式才显示
            if (self.model.isBillMode() && self.model.get("layout") != "left" && self.model.get("billTab")==0) {
                html = $T.Utils.format(myBillWrapHtml, [divMaillistWrap[type]]);
            } else {
                html = divMaillistWrap[type];
            }
            return html;
        },
        getListHeader: function () {
            if (this.model.get("layout") == "left") {
                return "";
                //return this.template["listHeaderLeft"];
            } else {
                var result = this.template["listHeader"];
                if (this.model.isBillMode() && this.model.get("billTab") == 0) {
                    result = "<div class=\"billleftDiv\" style='margin:0px;'>" + result + "</div>";
                }

                // 代办列表，表头不显示大小栏
                if (this.model.isTaskMode()) {
                    result = result.replace(/<td class="td4"><a id="th_size".+?<\/td>/ig, "")
                                   .replace(/日期/, '计划时间').replace(/<i class=""><\/i>/ig, '');
                }
                //邮件备份，不显示大小 
                var fid = this.model.get("fid");
                if(fid == 7){
                     result = result.replace(/<td class="td4"><a id="th_size".+?<\/td>/ig, "");
                }
                return result;
            }
        },

        render: function (isRendered) {
            var self = this;
            var el = $D.getHTMLElement(this.el);
            var $el = $(this.el);
            if (!isRendered || this.model.get("needReload")) { //第一次加载，或需要强制刷新时才重新显示
                this.model.set("needReload", false);
                if (!this.model.isApproachMode() || this.model.get("layout") == "left" || this.model.get('billtype')) {
                    el.innerHTML = "<div id='toolbar_div' class='bgPadding'></div>" + this.getListHeader()+ self.getMailListWrap(0);
                } else {
                    el.innerHTML = "<div id='toolbar_div' class='bgPadding'></div>"
                                + "<div id='div_mail' class='p_relative' style='overflow-y:auto'><!--[if lt ie 8]><div class='p_relative' style='+zoom:1;'><![endif]-->"
                                + "<div class='searchList'><div class='searchListdiv p_relative'>" //searchList fl=>searchList
                                + this.getListHeader()
                                + "<div id='div_maillist' class='p_relative bgPadding'></div>"
                                + "</div></div>"
                            //    + "<div id='div_searchclassify' class='searchFilter fl p_relative'></div><!--[if lt ie 8]></div><![endif]-->"
								+ "<div id='div_searchclassify' class='searchFilter'></div><!--[if lt ie 8]></div><![endif]-->"
                                + "</div>";
                }
                this.initSplitView(); //先初始化分栏

                var el1 = $el.find("#toolbar_div");//工具栏容器
                var el2 = $el.find("#div_maillist");//邮件列表容器

                if (!this.toolbarView) { //确保工具栏只创建一次
                    this.toolbarView = new M2012.Mailbox.View.Toolbar({ model: this.model, el: el1 });
                } else {
                    this.toolbarView.setElement(el1);
                }
                if (this.options.multiInstance) {//多实例
                    if (this.listView) {
                        $(this.listView.el).off();
                    }
                    this.listView = new M2012.Mailbox.View.ListView({ model: this.model, el: this.el });
                } else { //单例
                    this.listView = new M2012.Mailbox.View.ListView.prototype.createInstance({ model: this.model, el: this.el });
                }
                try {
                    if (this.model.isApproachMode()) {
                        var el3 = $el.find("#div_searchclassify");//逼近式搜索分类容器
                        this.searchClassify = new M2012.Mailbox.View.SearchClassify.prototype.createInstance({ model: this.model, el: el3 });
                    }
                } catch (e) { }
                
				if(top.$App.getView("mailbox").model.get("IamFromLaiwang")){
					$("#div_searchclassify").hide();
					$("#div_mail").addClass("searchListoff");
				}
                if (!top.$App.getView("mailbox_other").model.get("showSearchclassify")) {
                    $("#div_searchclassify").hide();
                    $("#div_mail").addClass("searchListoff");
                } else {
                    top.$App.getView("mailbox_other").model.set("showSearchclassify",false);
                }
				//$(this.el).hide();//先隐藏，等列表listview.js加载后再一次性显示，避免局部闪动。
                this.toolbarView.parentView = this;//设置父view引用
                this.toolbarView.render();
                this.listView.toolbarView = this.toolbarView;//设置按钮工具栏view引用
                this.listView.render();
            }

        },
        initSplitView: function () {
            var self = this;
            var listEl = $(this.el).find("#div_maillist");//注：div_maillist要从当前el中找，因为多标签页多个文件夹中的dom元素id相同
            var layout = this.model.get("layout");
            /*if ($App.getCurrentTab().name.indexOf("mailsub_") >= 0) {
                layout = "list";//订阅多实例强制列表模式
                this.model.set("layout", "list");
            }*/
            if (layout == "top") { //上下布局
                listEl.addClass("inboxWrap")
                .after(["<div id='mailbox_split' style='z-index:9;position:absolute;top:400px;left:0px;right:0px;' class='wrapMiddle'>",
                    "<span class='i_updown'></span></div>",
                    "<div id='readWrap' style='overflow:hidden' class='readWrap p_relative'></div>"].join(''));
                var splitBar = $(this.el).find("#mailbox_split");
                //splitBar.width($(self.el).width());
                var classEl = $(this.el).find('#div_searchclassify');
                var div_mail = $(this.el).find('#div_mail');
                //classEl.height($('#div_main').height()-$('#toolbar_div').height());
                classEl.height(1000);
                div_mail.css({ 'overflow-y': 'hidden' });

                //分栏的初始位置
                //splitBar.css("top",($("#div_maillist").offset().top + $("#div_maillist").height())+"px");
                var offset = { x: 0, y: -51 };//父容器的初始偏移量
                if (self.model.isApproachMode()) {
                    offset = { x: 0, y: -151 };//在逼近式搜索模式，增加了一个div，增加初始的偏移量
                }
                var b = [$("#div_main").offset().left, $("#div_main").offset().top + 100,
                    $D.getWinWidth(), $D.getWinHeight() - 100];
                $D.setDragAble(splitBar[0], {
                    //handleElement:"#tishen",
                    bounds: b,
                    orignOffset: offset,
                    lockX: true,
                    onDragStart: function (e) { },
                    onDragMove: function (e) {
                        self.listView.onResize();
                    },
                    onDragEnd: function (e) { }
                });
            } else if (layout == "left") { //左右布局
                var html = ['<div class="wrapMiddleMiddle" id="mailbox_split" style="z-index:9;height:700px;position:absolute;left:400px">',
                            '<div class="slHvalign">',
                            '<div class="slHvalignCnt">',
                            '<div class="slHvalignCntInner"> <span class="i_leftr"></span> </div>',
                            '</div></div></div>',
                            '<div class="readWrapRight" id="readWrap"></div>'];
                if (this.model.isApproachMode()) {
                    html = ['<div class="wrapMiddleMiddle" id="mailbox_split" style="z-index:9;height:700px;position:absolute;left:400px">',
                            '<div class="slHvalign"><div class="slHvalignCnt">',
                            '<div class="slHvalignCntInner"> <span class="i_leftr"></span> </div>',
                            '</div></div></div>',
                            '<div id="div_mail" class="p_relative" style="overflow-y:auto;margin-left:6px;float:left;_display:inline;">',
							'<!--[if lt ie 8]><div style="+zoom:1;position: relative;"><![endif]-->',
                            '<div class="searchList"><div class="searchListdiv" style="overflow:hidden;">',
                            '<div class="readWrapRight" id="readWrap" style="width:100%;margin-left:0;height:auto;position:relative;"></div>',
                            '</div></div>',
                        //    '<div id="div_searchclassify" class="searchFilter fl p_relative"></div>',改版后相对定位和fl不要了
							'<div id="div_searchclassify" class="searchFilter"></div>',
							'<!--[if lt ie 8]></div><![endif]-->',
                            '</div>'];
                }
                listEl.addClass("inboxWrapLeft").addClass("p_relative")
                .css({ 'overflow-y': 'auto' }).width(376)
                .after(html.join(""));

                var splitBar = $(this.el).find("#mailbox_split");
                splitBar.css({ left: listEl.width() + "px", position: "absolute" });// 24为外边距
                var b = [$("#div_main").offset().left + 100, $("#div_main").offset().top,
                    $D.getWinWidth() - 100, $D.getWinHeight() - 50];
                $D.setDragAble(splitBar[0], {
                    //handleElement:"#tishen",
                    bounds: b,
                    lockY: true,
                    onDragStart: function (e) { },
                    onDragMove: function (e) {
                        self.listView.onResize();
                    },
                    onDragEnd: function (e) { }
                });
            }
        },
        prepareSearch: function (options) {
            var isFullSearch = this.model.get("isFullSearch");
            if (typeof (options) == "string") {//关键字搜索
                var keyword = options;
                options = {
                    condictions: [{
                        field: "subject",
                        operator: "contains",
                        value: keyword
                    }, {
                        field: "from",
                        operator: "contains",
                        value: keyword
                    }, {
                        field: "to",
                        operator: "contains",
                        value: keyword
                    }]
                }
                if (isFullSearch) {
                    options.condictions.push({
                        field: "content",
                        operator: "contains",
                        value: keyword
                    }, {
                        field: "attachName",
                        operator: "contains",
                        value: keyword
                    });
                }
            }
            options.statType = 1;  //逼近式搜索

            var billtype = null; //账单搜索
            if (options.fid == this.model.get('specialFolderId').myBill) { //我的账单
                billtype = options.billType;
            }
            this.model.set({ billtype: billtype });
            this.model.set("pageIndex", 1);//重置页码为第一页
            this.model.set("isSearchMode", true);
            this.model.set("searchOptions", options);
            if (!options.approachSearch) {
                this.model.set("selected", null);
            }
        },

        onResize: function () {

        },

        getListHeaderHtml: function() {
            
        }

    }) //end of class
}); //end of namespace