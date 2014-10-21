M139.namespace("M2012.Mailbox.Model", { 
Mailbox : Backbone.Model.extend({
    defaults:{  //默认数据
		fid: 1, //当前文件夹，改变时触发显示收件箱
		layout:"list",//list:列表布局（默认），top:上下布局，left:左右布局
		pageIndex:1,//当前页
		pageSize: 20,//每页显示邮件数
		pageStyle: 1, //显示密度
		flipType: "common", //分页方式，scroll为滚动条下拉自动分页，common为普通上下箭头分页
		showSummary:true,//是否显示摘要
		showSize:true,//是否显示邮件大小
		isSearchMode:false,//是否是搜索模式
		isNewSearch: true,//是否是重新搜索
        isFullSearch:false,//是否全文检索
		order:"receiveDate", //排序字段
		desc: "1", //排序类型
        firstPageUnreadCount:null,//第一页的未读数
        mid:null,//上下左右分栏读信时当前的邮件
        billtype:null,
        specialFolderId:{adFolder:11,myBill:8,mySubscription:9}, //广告文件夹，我的账单，我的订阅
		//start:1,
        //total:20,
        preloadData:null,
		mailListData:[]　//邮件列表数据
 
    },
    isFirstLoad:true,
    getLayoutStr:function(layoutId){
        var map = {
            0: "list", 1: "top", 2: "left"
        }
        return map[layoutId];
    },
    initialize: function (options) {
        var self = this;
        $App.on("userAttrsLoad", function (attrs) {

            if (attrs["list_layout"]!=null) { //确保加载到了数据项
                self.set("layout", self.getLayoutStr(attrs["list_layout"]));//布局
            }
            //todo 
            var attrs2=$App.getConfig("UserAttrs");
            self.set("pageSize", attrs2.defaultPageSize || 20);//每页显示封数
			self.set("pageStyle",$App.getCustomAttrs('pageStyle') || 1);//样式
            self.set("showSize", attrs2.isShowSize == 1 ? true : false); //显示大小
            self.set("showSummary", attrs2.isShowContent == 1 ? true : false);//显示摘要
            self.set("isFullSearch", attrs2.fts_flag == 1 ? true : false);
            self.set("needReload", true); //禁用缓存（切换标签时立即刷新）

        })
    },
	nextPage:function(){
		this.set("pageIndex",this.get("pageIndex")+1);
	},
    //获取当前列表下的邮件总数量，自动判断普通邮件列表、会话邮件、搜索列表
	getPageCount: function (data) {
	    var messageCount = 0;
	    if (!this.get("isSearchMode")) { //正常列表
	        var fid = this.get("fid");
	        if ($App.isSessionMode() && $App.isSessionFid(fid)) { //(1)已删除文件夹不聚合，(2)标签文件夹不聚合
	            messageCount = this.get("sessionCount");//会话集的个数
            // 聚合二期处理
	        } else if (this.underClusterFolder()) {
	            messageCount = this.get("sessionCount");//会话集的个数
	        } else {
	            var folderInfo = this.getFolderInfo(fid);
	            if (!folderInfo) { return 1;}//容错
	            messageCount = folderInfo.stats.messageCount
	        }
	        

	    } else { //搜索列表
	        var stats = this.get("searchStats");
	        var sessionEnable = this.get("searchOptions") && this.get("searchOptions").sessionEnable;
	        messageCount = (sessionEnable == 2 && this.underClusterFolder()) ? stats.sessionCount : stats.messageCount;
	        
	    }
	    var result = Math.ceil(messageCount / this.get("pageSize"));
	    if(result<=0){result=1};//最小页数为1
	    return result;
	},
	getFolderInfo:function(){
	    //return  $App.getFolderById(this.get("fid"));
	    var folderInfo = {};
	    var fid = this.get("fid");
	    if (this.get("isSearchMode")) { //搜索模式
	        var searchStats = this.get("searchStats");//搜索时，邮件数在邮件列表返回的报文中
	        folderInfo = {
	            name: this.isUnreadMode() ? "未读邮件" : (this.isSubscribeMode() || this.isClusterColumn() || this.isClusterList() ? "订阅邮件" : "搜索结果"),
	            stats: {
	                messageCount: searchStats.messageCount,
	                unreadMessageCount: searchStats.unreadMessageCount //用搜索返回的数据填充。
	            }
	        }
			if(this.get("isContactsMail")){
				folderInfo["name"] = "与"+ top.$App.getAddrNameByEmail(this.get("isContactsMailAndTheEmailIs"))+"的往来邮件";
			}
	    } else {
	        folderInfo = $App.getFolderById(fid);
	        if (!folderInfo) { //数据容错，重新加载接口时如果数量为0不再输出以下数据
	            if (fid == 7) {
                    folderInfo = { fid: 7, type: 1, name: "邮件备份", stats: { messageCount: 0, unreadMessageCount: 0 } }
                }else if (fid == 8) {
	                folderInfo = { fid: 8,type:1, name: "账单中心", stats: {messageCount:0,unreadMessageCount:0}}
	            }else if (fid == 9) {
	                folderInfo = { fid: 9, type: 1, name: "精品订阅", stats: { messageCount: 0, unreadMessageCount: 0 } }
	            }else if (fid == 11) {
					folderInfo = { fid: 11, type: 1, name: "广告文件", stats: { messageCount: 0, unreadMessageCount: 0 } }
				}else if (fid == 12) {
					folderInfo = { fid: 12, type: 1, name: "商讯生活", stats: { messageCount: 0, unreadMessageCount: 0 } }
				}
	        }
	        else{
	        	if (fid == 7) {folderInfo.name = "邮件备份"}
	        }
	    }
	    return folderInfo;
	},
	callApi: M139.RichMail.API.call,
	getDataSource: function (callback) {//获取邮件列表
	    

	    if (this.get("showSize") == false && this.get("order") == "size") {//不显示邮件大小时，不能使用邮件大小排序
	        this.set("order", "receiveDate");
	        this.set("desc", 1);
	    }
	    if (this.get("fid") == 3 && this.get("order") == "from") { //发件箱纠正为使用收件人排序
	        this.set("order", "to");
	    }
		if(this.get("isContactsMail")){//如果是往来邮件
			this.searchContactsMail(callback);
		} else if(this.get("isSearchMode")){
			this.searchMail(callback);//如果是搜索模式
		} else {
            //预加载
		    if (this.isFirstLoad && this.get("fid") == 1 && this.get("preloadData")) {
		        this.isFirstLoad = false;
		        callback(this.get("preloadData"));
		    } else {
		        this.getMailList(callback);//普通模式
		    }
		}
	},
	clearPreloadData: function () { this.set("preloadData", null); },
	fillPreloadData: function () {
	    var self = this;
	    if (this.isPreload()) {
	        this.getMailList(function (data) {
	            self.set("preloadData", data);
	        });
	    }
	},
	isPreload: function () {//预加载邮件列表开关
	    return window.isPreloadUser && isPreloadUser();
	},
	getMailList: function (callback) {
	    var self = this;
	    var maxPageIndex = this.getPageCount();
	    if (this.get("pageIndex") > maxPageIndex) {//防止分页溢出(删除邮件后或其它操作引起当前页邮件减少不足一页)
	        this.set("pageIndex", maxPageIndex);
	    }
	    var start = (this.get("pageIndex") - 1) * this.get("pageSize") + 1;
		var options={
			fid:this.get("fid"),
			order:this.get("order"),
			desc:this.get("desc"),
			start:start,
			total:this.get("pageSize"),
			topFlag:"top"
		}
		/*if (this.get("folderPass") && this.get("folderPass")!="@ok") {
		    options.folderPass = this.get("folderPass");
		}*/
		if ($App.isSessionMode()) {
		    options.sessionEnable = 1; //要传参数会话邮件才生效
		} else {
		    options.sessionEnable = 2; //实现订阅邮件的聚合
		}
		
		$RM.getMailList(options, function (result) {
		    if ($App.isSessionMode() || self.underClusterFolder()) {
		        self.set("sessionCount", result.sessionCount);
		    }

		    if (self.get("fid") == 1) {
		        self.clusterSubscription(result["var"]);
		    }
		    if (result && result["code"] == "S_OK") {
		        callback(result["var"]);
		    } else {
		        M139.UI.TipMessage.hide();
		        if (result && result["errorCode"] == "2351011") {
		            $App.showUnlock(self.get("fid"));
		            $App.close();

		        } else {
		            //$Msg.alert("加载失败");
		        }
		    }
	    });
	},
	clusterSubscription: function (mailList) {
	    var subIndex = 0;
	    var firstSubscription;
	    var subjectArr = [];
	    for (var i = 0; i < mailList.length; i++) {
	        var mail = mailList[i];
	        if ( mail.subscriptionFlag == 1) {
	            if (subIndex == 0) { //第一封订阅
	                firstSubscription = mail;
	            } else {
	                if (mail.flags.read == 1) {
	                    //firstSubscription.flags.read = 1;
	                    
	                }
	                mailList.splice(i, 1); //删除此封邮件
	                i--;
	            }
	            subjectArr.push((subIndex+1)+"."+mail.subject);
	            subIndex++;
	        }
	    }
	    if (subIndex > 1) {
	        firstSubscription.clusterCount = subIndex;
	        firstSubscription.summary = subjectArr.join("");
	    }
	},
	//城市账单帐号列表
	billCityList:{
        "1": "10086@gd.chinamobile.com",
        "2": "10086@yn.chinamobile.com",
        "3": "10086@gx.chinamobile.com",
        "4": "account@139.com",
        "5": "10086@sd.chinamobile.com",
        "6": "beijing10086@bj.chinamobile.com",
        "7": "10086@ln.chinamobile.com",
        "8": "fj10086@139.com",
        "9": "10086@hl.chinamobile.com",
        "10": "10086@gz.chinamobile.com",
        "11": "ydkf@10086.ah.chinamobile.com",
        "12": "10086@gs.chinamobile.com",
        "13": "chinamobile@hi.chinamobile.com",
        "14": "hebei10086@139.com",
        "15": "10086@ha.chinamobile.com",
        "16": "hbmc10086@139.com",
        "17": "hnmcc.com@139.com",
        "18": "10086@jl.chinamobile.com",
        "19": "10086@js.chinamobile.com",
        "20": "10086@jx.chinamobile.com",
        "21": "10086@nm.chinamobile.com",
        "22": "10086@nx.chinamobile.com",
        "23": "10086@qh.chinamobile.com",
        "24": "10086@sx.chinamobile.com",
        "25": "10086@sn.chinamobile.com",
        "26": "10086@sc.chinamobile.com",
        "27": "10086@tj.chinamobile.com",
        "28": "10086@xz.chinamobile.com",
        "29": "10086@xj.chinamobile.com",
        "30": "10086@zj.chinamobile.com",
        "31": "10086@cq.chinamobile.com"
    },

    getBillTypeName: function(billtype){
    	var nameObj = {
    		'10':'移动账单',
    		'11':'生活账单',
    		'12':'金融账单',
    		'13':'其他账单'
    	};
    	return nameObj[billtype];
    },

	//修改账单类型
	updateBillType: function(callback) {
	    //RequestBuilder.needEncoding = false;

	    /*
	    RequestBuilder.call("mbox:updateBillType", param, function (result) {
	        RequestBuilder.needEncoding = true;
	        callback.call(RM, result["var"], result["stats"]);
	    }); */
		var self = this;
		var options = {
                fid: 0,
                recursive: 0,
                isSearch: 1,
                ignoreCase: 0,
                condictions: [
					{
						field: "from",
						operator: "contains",
						value: self.billCityList[$User.getProvCode()]
					}
				]
            };

		M139.RichMail.API.call("mbox:updateBillType", options, function(response) {
			if(response.responseData.code && response.responseData.code == "S_OK") {
				callback && callback({
					'var':response.responseData["var"],
					'stats':response.responseData["stats"] 
				});
			} else {
				//self.logger.error("positioncontent returndata error", "[unified:getUnifiedPositionContent]", response)
			}
		});

	    //修改为序列化接口，增加标记手机支付账单类型
	    var options2 =  {
	        fid: 0,
	        recursive: 0,
	        isSearch: 1,
	        ignoreCase: 0,
	        condictions: [
				{
				    field: "from",
				    operator: "contains",
				    value: "cmpay_bill@139.com" //全国手机支付的发件人统一是这个
				}
			]
	    };

		//RequestBuilder.call("mbox:updateBillType", param2, function (result) { });
		M139.RichMail.API.call("mbox:updateBillType", options2, function(response) { }); //暂时没有callback
	},

	//获取账单类型
	getBillTypeList: function(callback){
		var self = this;
		if(M139.HttpRouter.serverList['bill'].path != SiteConfig.billPath){
			M139.HttpRouter.serverList['bill'].path = SiteConfig.billPath;
		}
		M139.RichMail.API.call("bill:getTypeList", {}, function(response) {
			callback && callback(response.responseData);				
		}); 
	},

	//设置账单类型
	setBill: function(api,options,callback){
		var self = this;
		M139.RichMail.API.call(api, options, function(response) {
			callback && callback(response.responseData);	
		}); 
	},

	checkUnreadChange: function () { //检测第一页未读邮件是否变化,如果有变化则刷新文件夹
	    if(!this.get("isSearchMode")){ 
	        var isChange = false;
	        var data = this.get("mailListData");
	        var result=$.grep(data, function (n, i) {
	            if (n.flags && n.flags["read"] == 1) {
	                return true;
	            } else {
	                return false;
	            }
	        
	        });
	        var oldCount = this.get("firstPageUnreadCount");
	        if (oldCount!=null && (oldCount < result.length)) {
	            isChange = true;
	            $App.trigger("reloadFolder", {
	                callback: function () {
	                    $App.trigger("refreshCount"); //刷新工具栏
	                }
	            });
	        
	        }
	        this.set("firstPageUnreadCount", result.length);
	        return isChange;
	    }

	},
	getFreshUnread: function (callback) {
	    this.callApi("mbox:searchMessages",
            { fid: 0, isSearch: 1, start: 1, total: 5, order: "receiveDate", desc: 1, flags: { read: 1 } }, function (res) {
                if (res.responseData["var"] && res.responseData["var"].length > 0) {
                    var mid = res.responseData["var"][0].mid;
                    console.log(res.responseData["var"][0].subject);
                    console.log(mid);
                    callback(mid);
                }

            });
	    this.invalidateSearch();
	},
	//账单提醒tips用
	getFreshUnreadBill: function(callback){
		this.callApi("mbox:searchMessages",
            { fid: 0, isSearch: 1, start: 1, total: 5, order: "receiveDate", desc: 1, flags: { read: 1, billFlag:1} }, function (res) {
                if (res.responseData["var"] && res.responseData["var"].length > 0) {
                    var mail = res.responseData["var"][0]                    
                //    console.log(mail);
                    callback && callback(mail);
			}
            });
		this.invalidateSearch();
	},
    //获取收件箱最近的N封邮件
	getFreshMail: function (count,callback,options_add) {
	    var options={
	        fid:1,
	        order: "receiveDate",
	        desc:"1",
	        start:1,
	        total: count
	    }
	    if (options_add) {
	        for (elem in options_add) {
	            options[elem] = options_add[elem];
	        }
	    }
	    $RM.getMailList(options, function (result) {
	        if (callback) { callback(result["var"]); }
	    });

	},
	addLoadBehavior:function(){
	    var fid = this.get("fid");
	    var data = {
	        1: "mailbox_inbox_load", 2: "mailbox_draft_load", 3: "mailbox_sent_load", 4: "mailbox_deleted_load",
	        5: "mailbox_junk_load", 6: "mailbox_virus_load", 7:"mailbox_7_load", 8: "mailbox_bill_load",
	        9: "mailbox_subscribe_load", 11: "mailbox_ad_load"
	    }
	    if (this.isStarMode()) {//星标
	        BH("mailbox_star_load");
	    }else if (data[fid]) { //系统文件夹
	        BH(data[fid]);
	    } else {
	        var type = $App.getFolderType(fid);
	        if(type == 3) {
	            BH("mailbox_custom_load");
	        } else if (type == 5) { //tag
	            BH("mailbox_tag_load");
	        } else if (type == -3) { //pop
	            BH("mailbox_pop_load");
	        }
	    }
	},
    isApproachMode:function(){
        if (this.get("isSearchMode")) {
            if (this.isStarMode() || this.isVipMode() || this.isBillMode() || this.isSubscribeMode() || this.isTaskMode() || this.isUnreadMode()) {
                return false;
            }
            return true;
        }
        return false;
    },
	isStarMode: function () {//是否是星标邮件
	    if (this.get("isSearchMode")) {
	        options = this.get("searchOptions");
	        if (options && options.flags && options.flags.starFlag == 1) {
	            return true;
	        }
	    }
	    return false;
	},
	isVipMode:function(){ //是否是搜索vip邮件
	    if (this.get("isVipMode")) {
	        return true;
	    }
	    return false;
	},
	isBillMode: function () { //是否显示账单中心
	    if (this.get("isSearchMode")) {
	        options = this.get("searchOptions");
	        if (options && options.flags && options.flags.billFlag == 1) {
	            return true;
	        }
	    }
	    return false;
	},
	isSubscribeMode: function () { //是否显示账单中心
	    if (this.get("isSearchMode")) {
	        options = this.get("searchOptions");
	        if (options && options.flags && options.flags.subscriptionFlag == 1) {
	            return true;
	        }
	    }
	    return false;
	},
	isClusterList: function () {
	    var self = $App.getCurrentTab().view.model;
	    if (!self.get("isSearchMode")) {
	        return false;
	    }
	    var options = self.get("searchOptions");
	    var carr = options && options.condictions || [];
	    for (var i = 0, len = carr.length; i < len; i++) {
	        var item = carr[i];
	        if (item.field == "sendId" && item.value && item.operator == "EQ") {
	            return true;
	        }
	    }
	    return false;
	},
	isClusterColumn: function () {
	    var self = $App.getCurrentTab().view.model;
	    if (!self.get("isSearchMode")) {
	        return false;
	    }
	    var options = self.get("searchOptions");
	    var carr = options && options.condictions || [];
	    for (var i = 0, len = carr.length; i < len; i++) {
	        var item = carr[i];
	        if (item.field == "sendId" && item.value == 0 && item.operator == "GT") {
	            return true;
	        }
	    }
	    return false;
	},
	isUnreadMode: function () {
	    var op = this.get("searchOptions");
	    return this.get("isSearchMode") && op && op.flags && op.flags.read;
	},
    isTaskMode:function(){ //是否是搜索任务邮件
	    if (this.get("isSearchMode") && this.get("isTaskMode")) {
            return true;
	    }
	    return false;
	},
	isVipMail: function (email) {
	    var vipList = this.getVipEmails();
	    email = $Email.getEmailQuick(email);
	    if (vipList) {
	        return $.inArray(email,vipList)>=0;
	    }
	    return false;
	},
    //获取vip分组的邮件地址列表
	getVipEmails: function () {
	    var info;
        if(top.Contacts.getVipInfo){
            info = top.Contacts.getVipInfo();
        }
	    if (info) {
	        if (info.vipEmails && info.vipEmails.length > 0) {
	            return info.vipEmails;
	        }
	    }
	    return null;
	},
	getVipMailCount:function(callback){ //获取vip邮件数
	    var email = this.getVipEmails();
	    if (email) {
	        var options = {
	            fid: 0,
	            recursive: 0,
	            ignoreCase: 0,
	            isSearch: 1,
	            start: 1,
	            total: 20,
	            limit: 1000,
	            isFullSearch: 2,
	            "exceptFids": [4],
	            condictions: [{
	                "field": "from",
	                "operator": "contains",
	                "value": email.join(";")
	            }]
	        };
	        //var options = this.getVipSearchOptions(emails);

	        this.callApi("mbox:searchMessages", options, function (res) {


	            callback(res.responseData["stats"]);

	        });
	        this.invalidateSearch();

	    } else { callback({unreadMessageCount :0})}//无vip联系人，置空
	    
	},
    //添加vip联系人
	addVipContact: function (contactlist) {

	    
	    var vipC = top.Contacts.getVipInfo();
	    var groupId = vipC.vipGroupId;
	    /*if (!vipC.hasContact && vipList.length == 0) {
	        return;
	    }*/
	    var vipList = [];
	    for (var i = 0; i < contactlist.length; i++) {
	        vipList.push(contactlist[i].serialId);
	    }
	    var serialIds = vipList.join(',');
	    var options = { GroupId: groupId, GroupType: 1, SerialId: serialIds };
	    var contactModel = M2012.Contacts.getModel();
	    contactModel.modifyGroup(options, function () {
	        $Msg.alert("所选联系人已加为VIP联系人，其邮件已自动标记为“VIP邮件”。");
	        $App.trigger("vipContactsOnChange", { data: contactlist });
	    });
	},

    //搜索vip联系人邮件
	searchVip: function () {
	    var email = this.getVipEmails();
	    if (email) {
	        var options = {
	            "isVip": true,
	            "isFullSearch": 2,
	            "exceptFids":[4],
	            "condictions": [{
	                "field": "from",
	                "operator": "contains",
	                "value": email.join(";")
	            }]
	        };
	        $App.searchMail(options);
	    } else {
	        $App.show("vipEmpty");
	        $App.close("mailsub_0");//关闭已打开的vip标签（如果有）
	    }
	},
	clearVipCache: function () {
	    var folderModel = $App.getView("folder").model;
	    folderModel.set("vipMailStats", null);//清空vip邮件数，在渲染的时候会重新获取
	},
    //搜索任务邮件
	searchTaskmail: function (options) {
        var defaults = {
        	'order': 'taskDate',
        	'desc': 0,
            "isTaskmail": true,
            "flags":{taskFlag:1}
        };
        options = $.extend(defaults,options);
        $App.searchMail(options);
	},
	searchMail:function(callback){//搜索邮件
	    //var options=this.searchOptions;
	    var self=this;
		var start=(this.get("pageIndex")-1)*this.get("pageSize")+1;
		var options={
				fid: 0,
				recursive: 0,
				ignoreCase:0,
				isSearch:this.get("isNewSearch")?1:0,//是否重新搜索
				isFullSearch:this.get("isFullSearch")?1:2, //是否全文检索
				start:start,
				total:this.get("pageSize"),
				limit: 1000,
				order: this.get("order"),
				desc: this.get("desc")
			};
			
		var optionsAdd = this.get("searchOptions");
		options = $.extend(options, optionsAdd);
		
		//账单搜索特殊处理
		if(options.billType){
			options.billType = parseInt(options.billType);
			options.isFullSearch = false;
        	delete options.ignoreCase;
        	delete options.statType;
        	delete options.title;
		}

		this.set("lastSearchOptions", options);

		this.callApi("mbox:searchMessages", options, function (res) {
            /*if(res.responseData["code"] == 'FA_BAD_PASSWORD'){
                top.FF.alert('密码错误');
                return;
            }*/
            self.set("searchStats",res.responseData["stats"]);
            callback(res.responseData["var"], res.responseData["stats"]);
            BH("global_search_ok");
		});
		this.set("isNewSearch", 0);
		/**
		 * @2014-7-4 add by wn
		 * set bill_type 控制补投字段
		 */
		this.set("bill_type" , "0");
	}, 
	searchContactsMail:function(callback){//往来邮件
	    //var options=this.searchOptions;
	    var self=this;
		var start=(this.get("pageIndex")-1)*this.get("pageSize")+1;
	//	console.log(this.get('pageIndex'));

	/*	var options={
				fid: 0,
				recursive: 0,
				ignoreCase:0,
				isSearch:this.get("isNewSearch")?1:0,//是否重新搜索
				isFullSearch:this.get("isFullSearch")?1:2, //是否全文检索
				start:start,
				total:this.get("pageSize"),
				limit: 1000,
				order: this.get("order"),
				desc: this.get("desc")
			};*/
		var options = {
				start : start,
				total : this.get("pageSize")
			};	
		var optionsAdd = this.get("searchOptions");
		if(optionsAdd && optionsAdd.total){
			delete optionsAdd.total;
		}
		for(elem in optionsAdd){
			if(elem && elem != "start"){
				options[elem]=optionsAdd[elem];
			}
		}
		//往来邮件的时候，不需要搜索的那些参数
		if(options.isContactsMail || options.statType){
			delete options.isContactsMail;
			delete options.statType;
		}
		this.callApi("mbox:queryContactMessages", options, function (res) {
            /*if(res.responseData["code"] == 'FA_BAD_PASSWORD'){
                top.FF.alert('密码错误');
                return;
            }*/
            self.set("searchStats",res.responseData["stats"]);
            callback(res.responseData["var"], res.responseData["stats"]);
        });
	}, 
	getMailById: function (mid) {
	    var listData = this.get("mailListData");
	    var freshList = this.get("freshMailList"); //新邮件tips接收到的新邮件数组
	    if (listData && freshList && freshList.length > 0) {
	        listData = listData.concat(freshList);
	    }
	    if (listData) {
	        var result = $.grep(listData, function (item, i) {
	            return item["mid"] == mid;
	        });
	        if (result.length > 0) {
	            return result[0];
	        } else {
	            return null;
	        }
	    } else {
	        return null;
	    }
		
	},
    //全部标记为已读
	markAllRead: function (fid, type, callback) {
	    var self = this;
	    var unreadCount = 0;
	    this.clearVipCache();
	    if (!type) { //普通的单个文件夹
	        var data = {
	            fid: fid,
	            flags: { read: 2 },
	            type: "read",
	            value: "0"

	        }
	        var info = $App.getFolderById(fid); 
	        if (info && info.stats) {
	            unreadCount = info.stats.unreadMessageCount;
	        }
	        if (unreadCount>0) { //未读数>0
	            this.updateMessageAll(data, callback);
	        } else {
	            return false;
	        }
	    } else if (type == "star") { //星标邮件
	        unreadCount = $App.getView("folder").model.get("unreadStarCount");
	        if (unreadCount > 0) {
	            var searchOptions = {
	                "fid": 0,
	                "recursive": 0,
	                "ignoreCase": 0,
	                "isSearch": 1,
	                "start": 1,
	                "total": 20,
	                "flags": { "starFlag": 1 }
	            }
	            this.callApi("global:sequential", {
	                items: [
                            { func: "mbox:searchMessages", "var": searchOptions },
                            { func: "mbox:getSearchResult", "var": {} }
	                ]
	            }, function (res) {
	                var mids = res.responseData["var"].mid;
	                var attrs = {
	                    "type": "read",
	                    "value": 0
	                }
	                self.markMail(mids, attrs, function (response) {//标记所有的搜索结果为已读
	                    callback(response.responseData["var"]);
	                    self.clearVipCache();
	                });
	            });
	            this.invalidateSearch();
	        } else {
	            return false;
	        } 
	    } else if (type == "custom" || type == "pop" || type == "tag") { //所有的自定义文件夹和收件箱
	        var folders = $App.getFolders(type);
	        if (type == "custom") { //标记收件箱及自定义文件夹
	            folders.push($App.getFolderById(1));//加入收件箱
	        }
	        var postItems = [];
	        $(folders).each(function (i, n) {
	            if (n.stats) {
	                unreadCount = unreadCount + n.stats.unreadMessageCount;
	            }
	            
	            postItems.push({
	                func: "mbox:updateMessagesAll",
	                "var": {
	                    fid: n.fid,
	                    flags: { read: 2 },
	                    type: "read",
	                    value: "0"
	                }

	            });
	        });
	        if (unreadCount) {
	            this.callApi("global:sequential", {
	                items: postItems
	            }, function (res) {
	                var result = res.responseData["var"];
	                callback(1);
	                self.clearVipCache();
	            });
	        } else {
	            return false;
	        }
	    } else if (type == "search") {
	        this.callApi("mbox:getSearchResult", {}, function (res) {
	            var mids = res.responseData["var"].mid;
	            var attrs = {
	                "type": "read",
	                "value": 0
	            }
	            self.markMail(mids, attrs, function (response) {//标记所有的搜索结果为已读
	                callback(response.responseData["var"]);
	                self.clearVipCache();
	            });
	        });
	    }
	    //self.get("isSearchMode")
	    return true;

	},
    //全部删除未读
	deleteAllUnread: function (fid, callback) {
	    var data = {
	        fid: fid,
	        flags: { read: 2 },
	        type: "move",
	        newFid:4
	    }
	    this.updateMessageAll(data, callback);

	},
    //搜索结果全部删除（普通删除，移到已删除文件夹）
    deleteAllOrdinary: function (){
        var self = this;
        /*重新搜索，避免中途有其它搜索接口调用，覆盖搜索结果
        填坑：这里调用两个接口而不能使用sequential序列调用，因为搜索是通过中间件取了通讯录联系人的，sequential不支持通讯录，造成和前次结果不一致
        */
        this.callApi("mbox:searchMessages", this.get("lastSearchOptions"), function (res2) {
            self.callApi("mbox:getSearchResult",{}, function (res) {
                var result = res.responseData["var"];
                var superSelectResult = {};
                $.each(result.mid, function (k, v) {
                    superSelectResult[v] = null;
                });
                self.superSelectResult = superSelectResult;//保存超级全选结果
                $App.trigger("mailCommand", { command: "move", mids: result.mid, fid: 4 });

                M139.Logger.getDefaultLogger().info("Delete search result,count=" + result.mid.length, true);

            });
        });
    },

	updateMessageAll:function(data,callback){
	
	    this.callApi("mbox:updateMessagesAll", data, function (res) {
	        callback(res.responseData["var"]);
	    });

	},
    //超级全选
	superSelectAll: function (type,callback) {
	    var fid = this.get("fid");
	    var options = {
	        recursive: 0,
	        ignoreCase: 0,
	        isSearch: 1,
	        isFullSearch: 0,
	        start: 1,
	        total: 1,
	        limit: 10000
	    };
	    var folderInfo = this.getFolderInfo(fid);
	    if (folderInfo.type == 5) { //是标签文件夹，搜索参数为labelId
	        options.labelId = fid;
	    } else {
	        options.fid = fid;
	    }
	    if (type == "unread") { //未读
	        options.flags = { read: 1 };
	    }else if (type == "read") { //已读
	        options.flags = { read: 0 };
	    }
	    if (this.get("isSearchMode")) { //搜索模式
	        this.callApi("mbox:getSearchResult", {}, function (res) {
	            callback(res.responseData["var"]);
	        })
	    } else {
	        this.callApi("global:sequential", {
	            items: [
                        { func: "mbox:searchMessages", "var": options },
                        { func: "mbox:getSearchResult", "var": {} }
	            ]
	        }, function (res) {
	            callback(res.responseData["var"]);
	        });
	        this.invalidateSearch();
	    }

	},
	setAll: function (key,val) { //循环设置多实例的model值
	    var arr = ["mailbox", "mailbox_other"];
	    for(var i=0;i<arr.length;i++){
	        var view = $App.getView(arr[i]);
	        if (view && view.model) {
	            view.model.set(key, val);
	        }
	    }
	    
	},
	invalidateSearch:function(){
	    this.setAll("isNewSearch",true);
	},
	clearSuperSelect: function () { //清空超级全选
	    this.superSelectResult = {};
	},

	// 获取选中邮件的mid和sessionId数组对象
	// {mids:mid,sids:sessionId}
	getSelectedRow: function (el) {		
        var superSelectResult = $App.getMailboxView().model.superSelectResult;
		var mid=[];
		var sessionId=[];
	    for (var m in superSelectResult) {
	    	if (superSelectResult.hasOwnProperty(m)) {	    		
		    	var mail = superSelectResult[m];
		    	if (mail) {// 普通选择 + 跨页选择存储了mail信息
		    		mid.push(mail.mid);
		    		sessionId.push(mail.mailSession);
		    	} else {// 超级全选只存储了mid
		    		mid.push(m);
		    	}
	    	}
	    }

	    // 为了兼容拖拽转移邮件
	    if (el && mid.length == 0) {
	    	$(el).find(".dayAreaTable input[type=checkbox]:checked").each(function(idx){
				var sessionid = $(this).parents("tr").attr("sessionid") || '';
				mid.push($(this).parents("tr").attr("mid"));
				sessionid && sessionId.push(+sessionid);
			});
	    }
		
        return {mids:mid,sids:sessionId};
     },
    getPOPAccounts: function (options, callback) {
        var self = this;
        $RM.getPOPAccounts(options, function (result) {
            callback(result);
        });
    },
    syncPOPAccount: function (options, callback) {//收取代收邮件
        var self = this;
        if (options && options.id) {
            $RM.syncPOPAccount(options, function (res) {
                callback(res);
            });
        } else { //收取全部
            this.callApi("user:syncPOPAccountAll",{}, function (res) {
                callback(res);
            });
        }
    },
    //将email地址加入黑名单
    refuseMail:function(email,callback){
        /*$RM.getWhiteBlackList({type:0}, function (result) {
            if (result && result["var"]) {
                callback(result["var"]);
            }
        });*/
        var options = {
            opType: "add",
            type: 0,
            member:email
        }
        
        $RM.getWhiteBlackList({type:1}, function (result) { //获取白名单
            if (result && result["var"]) {
                var list = result["var"];
                var exists = $.grep(list, function (n, i) {
                    return n == email;
                });
                if (exists.length > 0) { //如果白名单中存在，则删除之
                    $RM.setWhiteBlackList({ opType: "delete", type: 1, member: email }, function () {
                        addBlack();
                    });
                } else {
                    addBlack();
                }
            }
        });
       
        function addBlack() {
            $RM.setWhiteBlackList(options, function (result) {
                if (result.errorCode == "2029") { //该地址在黑名单中已存在
                    callback(false); //
                } else {
                    callback(true);
                }

            });
        }

    },
    /*删除或转移最后一页的邮件后，分页数会减少，导致当前页数溢出（大于总页数），
    因为做了聚合邮件之后，sessionCount在文件夹的接口取不到了，只有在listMessages接口才能取到，如果不在客户端计算的话就要请求两次邮件列表。
    */
    reduceSessionCount: function (res) {
        var count = this.get("sessionCount");
        if (count && res.responseData && !isNaN(res.responseData["var"])) {
            this.set("sessionCount", count - Number(res.responseData["var"]))
        }
    },
    moveMail: function (mids, newFid, callback) {//转移邮件
        var self = this;
        // 因为增加了聚合邮件类型，为了兼容以前的接口
        // 只有普通邮件的时候，mids依然为数组
        // 包含聚合邮件的时候，mids为对象，包含一个普通邮件id数组和一个聚合邮件id数组
        var ids;
        var sendIds = [];
        var sendFlag = "";
        if (typeof mids == "object") {
            ids = mids.mids;
            sendIds = mids.sendIds;
            sendFlag = mids.sendFlag;
        } else {
            ids = mids;
        }
        this.callApi("mbox:moveMessages", { ids: ids, sendIds: sendIds, newFid: newFid, sendFlag: sendFlag }, function (res) {
	        callback(res);
	        self.clearVipCache();
	        if (newFid == 4) { //删除邮件时标记为已读
	            self.callApi("mbox:updateMessagesStatus", { ids: ids, type: "read", value: 0 }, null);
	        }
	        self.reduceSessionCount(res);
	       
        });
	},
	
	moveSessionMail:function(sessionIds,newFid,callback){//转移会话邮件
	    this.callApi("mbox:moveMessages", {sessionIds:sessionIds,newFid: newFid}, function (res) {
              callback(res);
        });
	},  
	
	backupMail: function (mids,backupType,callback) {  //备份到网盘
		var backupType = backupType || '';
	    M139.UI.TipMessage.show("邮件备份中...");
	    this.callApi("disk:backupMail", { mailIds: mids.join(","),backupType:backupType }, function (res) {
	        M139.UI.TipMessage.hide();
	        callback(res);
	    })
	    
	},

	savetoNote: function (mids, callback) {  //备份到网盘
	    M139.UI.TipMessage.show("邮件备份中...");
	    this.callApi("mnote:mailsToNote", { mids: mids.join(",") }, function (res) {
	        M139.UI.TipMessage.hide();
	        callback(res);
	    })	    
	},

	deleteMail: function (mids, callback) {//删除邮件
	    var self = this;
	    // 因为增加了聚合邮件类型，为了兼容以前的接口
	    // 只有普通邮件的时候，mids依然为数组
	    // 包含聚合邮件的时候，mids为对象，包含一个普通邮件id数组和一个聚合邮件id数组
	    var ids;
	    var sendIds = [];
	    var sendFlag = "";
	    if (typeof mids == "object") {
	        ids = mids.mids;
	        sendIds = mids.sendIds;
	        sendFlag = mids.sendFlag;
	    } else {
	        ids = mids;
	    }
	    this.callApi("mbox:deleteMessages", { ids: ids, sendIds: sendIds, sendFlag: sendFlag }, function (res) {
    	    callback(res);
    	    self.clearVipCache();
    	    self.reduceSessionCount(res);
        });
    }, 
    
	deleteSessionMail: function (sessionIds, callback) { //删除会话邮件
	    var self = this;
	    this.callApi("mbox:deleteMessages", { sessionIds: sessionIds}, function (res) {
    	    callback(res);
    	    self.clearVipCache();
        });
    },
        
    markMail: function (mids, attrs, callback) { //标记邮件
        var self = this;
		this.callApi("mbox:updateMessagesStatus", {ids:mids,type:attrs.type,value:attrs.value}, function (res) {
		    callback(res);
		    self.clearVipCache();
        });		
    },

    markSessionMail: function (sessionIds, attrs, callback) { //标记会话邮件
        var self = this;
        // 因为增加了聚合邮件类型，为了兼容以前的接口
        // 只有普通邮件的时候，mids依然为数组
        // 包含聚合邮件的时候，mids为对象，包含一个普通邮件id数组和一个聚合邮件id数组
        var ids;
        var sendIds = [];
        if (typeof sessionIds == "object") {
            mids = sessionIds.mids;
            sessionIds = sessionIds.sessionIds;
        } else {
            sessionIds = sessionIds;
        }
        this.callApi("mbox:updateMessagesStatus", { ids: mids, sessionIds: sessionIds, type: attrs.type, value: attrs.value }, function (res) {
            callback(res);
            //attrs.callback && attrs.callback();
            self.clearVipCache();
        });
    },

    addSpecialTagBehavior:function(tagId,key){
        var tagName = $App.getTagsById([tagId])
        if (tagName == "重要任务" || tagName == "紧急任务") {
            BH(key);
        }
    },
    addTagForMail: function (mids, labelId, callback) { //为邮件添加标签
        var self = this;
        var tagOverflow = false;
        $.each(mids,function(i,n){
            var mailInfo = self.getMailById(n);
            if (mailInfo && mailInfo.label && mailInfo.label.length >= 10) {
                tagOverflow = true;
            }
        })
        if (tagOverflow) {
            $Msg.alert("单封邮件的标签数量已超出系统上限，不能继续添加标签");
            M139.UI.TipMessage.hide();
            return;
        }
        
		this.callApi("mbox:updateMessagesLabel", {type:"add",ids:mids,labelId:labelId}, function (res) {
              callback(res);
        });
	},
	removeTagForMail: function (mids, labelId, callback) {//为邮件移除标签
	    var self = this;
		this.callApi("mbox:updateMessagesLabel", {type:"delete",ids:mids,labelId:labelId}, function (res) {
		    $(mids).each(function (i, n) { //修改数据源
		        var mailInfo = self.getMailById(n);
		        if (mailInfo && mailInfo.label) {
		            mailInfo.label = _.without(mailInfo.label, Number(labelId));
		        }
		    });
		    callback(res);
        });
	},
	getTagMenuItems: function () {
	    var tagList = $App.getFolders("tag");
	    var itemsTag = [];
	    $(tagList).each(function (idx, folderItem) {
	        var color = $App.getTagColor(folderItem["folderColor"]);
	        var isSpecial =  (folderItem["name"] == "重要任务");
	        
	        var tagItemHtml = ['<span class="text"><span class="tagMin', isSpecial?" tagJJ":"", '" style="border-color:', color, '"><span class="tagBody" style="background-color:',
	      	color,';border-color:',color,
	      	, '">', isSpecial ? ' <i class="i_jj"></i>' : "", '</span></span><span class="tagText">',
	      	folderItem["name"], '</span></span>'].join("");
	        //tagItemHtml="<b>"+folderItem["name"]+"</b>"
	        itemsTag.push({
	            html: tagItemHtml, command: "tag",
	            args: $App.isReadSessionMail() ? { labelId: folderItem["fid"], bh: 'cMail_toolbar_mark_label'} : { labelId: folderItem["fid"]}
	        });
	    });
	    itemsTag.push({ isLine: true });
	    itemsTag.push({ html: "新建标签", command: "tag", args: { labelId: -1,  bh: ($App.isReadSessionMail() ? 'cMail_tab_createTag' : '')} });
	    itemsTag.push({ html: "管理标签", command: "show", args: { key: "tags",  bh: ($App.isReadSessionMail() ? 'cMail_tab_manageTag' : '')} });
	    return itemsTag;
	},
	getMarkMenuItems: function (includeTag,fid) {
	    var items = [//($App.isReadSessionMail() ? 'cMail_toolbar_mark_starCancel' : 'toolbar_unstar')
                { text: "已读", command: "mark", args: { type: "read", value: 0, bh: ($App.isReadSessionMail() ? 'cMail_toolbar_mark_read' : 'toolbar_markread')} },
                { text: "未读", command: "mark", args: { type: "read", value: 1, bh:($App.isReadSessionMail() ? 'cMail_toolbar_mark_unread' : 'toolbar_markunread') } }
	    ];

	    // 订阅邮件只显示标记已读/未读
	    if (this.isSubscriptionMail() || this.isSubscribeMode()) return items;

	    items.push(
                { isLine: true },
                { text: "星标", command: "mark", args: { type: "starFlag", value: 1, bh:'toolbar_star' } },
                { text: "取消星标", command: "mark", args: { type: "starFlag", value: 0, bh:'toolbar_unstar' } }
        );

        if (!this.isTaskMode()) {
        	items.push(
                { isLine: true },
                { text: "置顶", command: "mark", args: { type: "top", value: 1, bh:'toolbar_sticky' } },
                { text: "取消置顶", command: "mark", args: { type: "top", value: 0, bh:'toolbar_unsticky' } }
        	);
        }

	    if (this.isStarMode()) { //在星标列表，只显示取消星标的菜单
	        items.splice(3, 1);
	    }
	      var searchFolder =$App.getMailboxView().model.get("searchOptions") ;
          if(fid === 2 || (searchFolder && searchFolder.fid === 2) || fid === 7){//在草稿箱里不显示未读和已读以及分割线
	    	items.shift();
	    	items.shift();
	    	items.shift();
	    }
	    if (includeTag) { //是否包含标签
	        items.push({ isLine: true });
	        items = items.concat(this.getTagMenuItems());
	        //items.push({ text: "我的标签", items: this.getTagMenuItems() });
	    }
	    return items;
	},
    //获取文件下拉菜单items
	getFolderMenuItems: function (key, options) {
	    var self = this;
	    if(!options){options={}}
      	var folderList=$App.getFolders(key);
      	var itemsFolder=[];
      	var command=options.command || "move";
        var fid = '';
        var curFid = $App.getCurrentView().model.get('fid');// 受收件箱多实例影响，此处使用$App.getCurrentFid()获取不准确
        if (options && options.fid) {
            curFid = options.fid;
        }
        $(folderList).each(function (idx, folderItem) {
            //排除当前文件夹，搜索模式下fid=1需要特殊处理
            fid = folderItem["fid"];
            if (self.get("isSearchMode") || !(command == "move" && curFid == fid)) {
                if(!self.isNotAllowMove(fid) || key!="system"){
                	var item = {
                        text: folderItem["name"], command: command,
                        args: { fid: fid }
                    };
                    if ($App.isReadSessionMail()) {
                    	if (fid == 3) {item.args.bh = 'cMail_toolbar_move_send';}
                    	else if (key == "custom") {item.args.bh = 'cMail_toolbar_move_custom';}
                    	else if (fid == 11) {item.args.bh = 'cMail_toolbar_move_add';}
                    }
                    itemsFolder.push(item);
                }
            }

        });
        if (!key || key == "custom") { //移动到，全部和自定义时出现新建文件夹菜单
            if (command == "move" && options.showCreate != false) {
                if (itemsFolder.length > 0) {
                    itemsFolder.push({ isLine: true });//cMail_toolbar_move_custom
                }
                itemsFolder.push({ html: "新建并移入…", command:"move",args: { fid: -1, bh: ($App.isReadSessionMail() ? 'cMail_toolbar_createFolder': '')} });
            }
        }
        return itemsFolder;
	},
    
    isNotAllowMove:function(fid){
        var notAllowFids = [2,4,5,7,6,8,9,11]; //不允许移动到 草稿箱、已删除、垃圾邮件、病毒文件夹
        return $.inArray(fid,notAllowFids) > -1;
    },

    // 当前是否处于可聚合文件夹
    underClusterFolder: function () {
        var curFid = $App.getCurrentFid();
        return curFid == 1 || $App.getFolderType(curFid) == 3;
    },

    getMailNum: function (mail) {
        var self = $App.getCurrentTab().view.model;
        var num = "";
        if (!mail) return num;
        if ($App.isSessionMode()) {
            num = self.get("isSearchMode") ? mail.sendTotalNum : mail.mailNum;
        } else {
            num = mail.sendTotalNum;
        }
        return num;
    },

    // 判断聚合邮件：是订阅邮件，且包含多封
    isClusterMail: function (mid) {
        var mail = this.getMailById(mid);
        var mailnum;
        var sendId;
        if (!mail) return false;

        sendId = mail.sendId;
        mailnum = this.getMailNum(mail);
        if (sendId > 0 && mailnum > 1 && this.underClusterFolder() && !this.isClusterList() && $App.getCurrentTab().name.indexOf('readmail_') == -1) {
            return true;
        } else {
            return false;
        }
    },

    // 判断订阅邮件
    isSubscriptionMail: function(mail) {
         if ($App.getCurrentTab().name.indexOf('readmail_') > -1) {
            var readingMail = M139.PageApplication.getTopApp().print[$App.getCurrMailMid()];
            if (readingMail && readingMail.headers && readingMail.headers.subscriptionFlag == 1) {
               return true;
            }
         }

         if (mail && mail.subscriptionFlag == 1) {
            return true;
         }

         return false;
    }
})
});
