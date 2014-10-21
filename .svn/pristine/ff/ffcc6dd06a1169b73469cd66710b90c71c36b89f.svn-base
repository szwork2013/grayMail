function no(){
    Utils.stopEvent();
}

function Mailbox(){
    var thisObj = this;
    this.run = function(){
        this.container = document.getElementById("mailList");
        this.getMainList();
        MailOperating.refreshMailsCount(function(total, news){
            $("#s_new").text(news);
            $("#s_total").text(total);
            
        });
		Behavior(18014, 0);
    }
    /*下面函数是和数据源相关，如果修改了JSON结构，则下面函数需要做相应调整 begin*/
    //根据数据源对分页信息进行赋值
    this.setPageInfo = function(data){
        this.pageCount = Math.ceil(data.mainInfo.mailcount / data.mainInfo.limit);
    }
    this.showNoGroup = function(){
        $(".toolbar").hide();
        $(".mailList").empty().append("<div class=\"noMail main-bg\">\
		<h3 class=\"green\">群邮件</h3>\
            <p>您可以在创建或加入某群后，通过发送群邮件发起对某一话题的讨论。群成员的回复以帖子的形式\
呈现在同一邮件中，全体群成员可见。</p>\
			<P>\
            	<a class=\"btnStrong\" href=\"javascript:void(0)\">创建群</a>您也可以<a class=\"green\" href=\"javascript:void(0)\">查找加入群</a>\
            </P>\
          <h3 class=\"green\">群邮件亮点功能</h3>\
          <i class=\"qun-tg1\"></i> \
          <h3 class=\"green\">群邮件七大妙用</h3>\
           <i class=\"qun-tg2\"></i>\
        </div>");
        $(".mailList").height("100%");
        //$(".mailList").empty().append("<div class=\"no-note\">您当前没有群，可<a href=\"javascript:void(0)\">创建群</a>或<a href=\"javascript:void(0)\">查找加入群</a></div>");
        $(".mailList>.noMail").find("a").eq(0).click(function(e){
            window.location.href = "/GroupMail/GroupOper/CreateGroup.aspx?sid=" + top.UserData.ssoSid;
            return false;
        });
        $(".mailList>.noMail").find("a").eq(1).click(function(e){
            window.location.href = "/GroupMail/GroupOper/FindGroup.aspx?sid=" + top.UserData.ssoSid;
            return false;
        });
    }
    
    this.getMainList = function(){
        MS.context = this;
        var showEmpty = function(){
			MB.pageCount=0;
            $("div.norecord").remove();
            $(".mailList").empty().append("<div class='tipMail2'></div>").append("<div class=\"norecord\">暂无任何群邮件记录</div>");
        }
        var showDelete = function(){
            $("p.delete").remove();
            $("div.tipMail2").prepend("<p class=\"mail-tips delete\">（系统将自动清理超过 7 天的垃圾邮件）</p>");
        };
        var showExit = function(){
            $("p.exit").remove();
            $("div.tipMail2").prepend("<p class=\"mail-tips exit\">（系统将自动清理超过90天的已退出群的群邮件）</p>");
        };
        var showLogoff = function(){
            $("p.logoff").remove();
            $("div.tipMail2").prepend("<p class=\"mail-tips logoff\">（系统将自动清理超过90天的已注销群的群邮件）</p>");
        };
        var showApplyInfo = function(applyinfo){
            $("p.applyinfo").remove();
            $("div.tipMail2").prepend("<p class=\"mail-tips applyinfo \" id='applyinfo'>您有<a href=\"javascript:void(0)\">" + applyinfo.Invite + "</a>条未处理的邀请，<a href=\"javascript:void(0)\">" + applyinfo.Apply + "</a>条未处理的申请</p>");
            $("#applyinfo").find("a").eq(0).click(function(e){
                window.location.href = "/GroupMail/GroupOper/InviteUserList.aspx?sid=" + top.UserData.ssoSid;
                return false;
            });
            $("#applyinfo").find("a").eq(1).click(function(e){
                window.location.href = "/GroupMail/GroupOper/GroupManager.aspx?sid=" + top.UserData.ssoSid;
                return false;
            });
            
        };
        MS.getMailList(this.pageIndex, this.pageSize, this.isSearch, this.sortName, this.sortIsDesc, this.mailType, this.mailFolder, function(resultData, pageIndex){
            if (typeof(resultData) != "undefined" && resultData != null && resultData.code == "S_OK") {
                Tool.execWithoutException(function(){
                    if (resultData.list.length == 0) {
                        showEmpty();
						MB.createPager();
                    }
                    else {
                        MB.dataBind(resultData, pageIndex);
                        thisObj.setPageInfo(resultData);
                        MB.createPager();
                        if (thisObj.mailFolder == 'delete') {
                            showDelete();
                        }
                    }
                    if (resultData.ApplyInfo.Apply != 0 || resultData.ApplyInfo.Invite != 0) {
                        showApplyInfo(resultData.ApplyInfo);
                    }
                    //MB.onResize();
                    resultData = null;
                });
            }
            else {
                showEmpty();
                if (typeof(resultData) != "undefined" && resultData != null && resultData.ApplyInfo.Apply != 0 || resultData.ApplyInfo.Invite != 0) {
                    showApplyInfo(resultData.ApplyInfo);
                }
				MB.createPager();
            }
        });
        
        
        
        
    }
    /*end*/
    //数据绑定
    this.dataBind = function(data, pageIndex){
        this.mailList = data.list; //获取邮件列表引用
        //this.mailBody = data["maillistbody"][0]; 
        var rp = new Repeater(this.container);
        rp.HeaderTemplate = this.HeaderTemplate;
        rp.HtmlTemplate = this.HtmlTemplate;
        rp.FooterTemplate = this.FooterTemplate;
        rp.DataSource = data.list;
        rp.Functions = {
            getStatus: function(status){
                //0:草稿,1:定时,5:新邮件,6:无状态};
                var statusList = {
                    0: "<i class='status0' title='普通'></i>",
                    1: "<i class='status1' title='定时邮件'></i>",
                    2: "<i class='status2' title='已回复已转发'></i>",
                    3: "<i class='status3' title='已回复'></i>",
                    4: "<i class='status4' title='已转发'></i>",
                    5: "<i class='status5' title='新邮件'></i>",
                    6: "<i class='status6' title='普通'></i>"
                }
                var result = statusList[status];
                if (this.DataRow["from"] == "mail139@139.com") {
                    //className="icosystem";
                }
                return result;
            },
            getFolder: function(){
                if (MB.isSearch && MB.folderId == 0) {
                    var m = this.DataRow["url"].match(/fid=(\d+)/);
                    var fid = m[1];
                    var folderName = FM.getFolderInfo(fid)["foldername"];
                    return "<span>[" + folderName + "]</span>";
                }
                else {
                    return "";
                }
            },
            getRowStyle: function(){
                if (this.DataRow["flags"]["read"]) {
                    return "";
                }
                else {
                    return "class='new5'";
                }
            },
            getAttach: function(){
                var dr = this.DataRow;
                if (this.DataRow["flags"]["attached"]) {
                    return "attach1";
                }
                else {
                    return "attach0";
                }
                
            },
            getPriority: function(priority){
                return MB.getPriority(priority);
            },
            getDate: function(d, rec){
                if (MB.folderId == 1) {//收件箱使用收信日期字段
                    if (rec) {
                        d = rec;
                    }
                }
                var date = d;//Utils.parseDate(d);
                var now = new Date();
                var result;
                //今天的邮件
                if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                    var t = now.getTime() - date.getTime(); //相差毫秒
                    var minutes = Math.round(t / 1000 / 60);
                    if (minutes < 60) {
                        result = minutes + "分钟前";
                    }
                    else {
                        result = Math.floor(minutes / 60) + "小时前";
                    }
                }
                else 
                    if (date.getYear() == new Date().getYear()) {
                        result = date.format("M-dd(Week) hh:mm");
                    }
                    else {
                        result = date.format("yyyy-M-dd(Week) hh:mm");
                    }
                result = result.replace(/Week/, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
                return String.format("<span title='{0}'>{1}</span>", [date.format("yyyy年M月dd日 hh:mm"), result]);
                //return date.format("yyyy年MM月dd日");
            },
            getName: function(from){
                return from;
            },
			getFromTitle:function(from)
			{
				return from.replace(/\"/, "&quot");
			},
			getSubjectTitle:function(subject)
			{
				return subject.replace(/\"/, "&quot");
			}
        };
        rp.ItemDataBound = function(args){
            var orderField = 0;
            if (MB.moduleData && MB.moduleData["orderField"]) {
                orderField = MB.moduleData["orderField"];
            }
            function getPeriod(date1, date2){
                var t = date2.getTime() - date1.getTime(); //相差毫秒
                var day = Math.round(t / 1000 / 60 / 60 / 24);
                var week_c = "星期" + ['日', '一', '二', '三', '四', '五', '六'][date1.getDay()]
                var w1 = date1.getDay();
                w1 = w1 == 0 ? 7 : w1;
                var w2 = date2.getDay();
                w2 = w2 == 0 ? 7 : w2;
                if (day <= 1) {
                    if (date2.getDate() == date1.getDate()) {
                        return "今天";
                    }
                    else 
                        if (day < 0) {
                            return "今天"; //未来的邮件
                        }
                        else {
                            return "昨天";
                        }
                }
                else 
                    if (day == 2) {
                        if ((w2 - w1 == 2 || w2 - w1 == -5)) {
                            return "前天";
                        }
                        else {
                            return "昨天";
                        }
                    }
                    else 
                        if (day < 7) {
                            if (w1 < w2) {
                                return week_c;
                            }
                            else {
                                return "上周";
                            }
                        }
                        else 
                            if (day < 7 + w2) {
                                return "上周";
                            }
                            else {
                                return "更早";
                            }
            }
            if (MB.sortName == MB.defaultSortName) { //按日期排序            	       
                date = (args.data["receivedDate"]);
                if (this.folderId == 1) {
                    if (args.data["receivedDate"]) {
                        date = (args.data["receivedDate"]);
                    }
                }
                var now = new Date();
                var diff = Utils.dayDiff(date, now);
                var period = getPeriod(date, now);
                /*
                 if(diff<=0){
                 period="今天";
                 }else if(diff==1){
                 period="昨天";
                 }else if(diff==2){
                 period="前天";
                 }else{
                 period="更早";
                 }*/
                if (period != this.lastPeriod) {
                    this.lastPeriod = period;
                    var html = "";
                    if (args.index > 0) {
                        html += "</table>";
                    }
                    html += "<table cellpadding='0'><caption id='div_period'><b class='icoOpen' onclick='MB.togglePeriod(this)' status=1\
					 >-&nbsp;</b>" + period +
                    "</caption>" +
                    args.html;
                    return html;
                }
            }
            else {
                if (args.index == 0) {
                    return "<table cellpadding='0'>" + args.html;
                }
            }
        }
        rp.DataBind();
        $(MB.container).find(".listBody").children().each(function(){
            var period = $(this).find("#div_period");
            if (period.length > 0) {
                //var count=period.parent().find("tr").length;
                var count = period.parent()[0].rows.length;
                if (count > 0 && period.parent().find("tfoot").length > 0) {
                    count--;
                }
                period.append("<a href='javascript:' status=0 onclick='MB.selectPeriod(this)'>(" + count + "封)</a>");
            }
        })
        var sortFlied = MB.sortName == 'receivedDate' ? "date" : MB.sortName;
        var sortClass = MB.sortIsDesc ? "th001" : "th330";
        $(this.getListHeader).find("." + sortFlied + ">i").addClass(sortClass);
    }
    this.init = function(){
        setInterval(function(){
            MB.receiveMail(true)
        }, 120000); //2分钟自动收取邮件
    }
    this.getPageSize = function(){
        return top.UserAttrs["defaultPageSize"];
    }
    this.folderId = 1;
    this.container = null;
    this.folderInfo = null;
    this.boxList = new Object();//所有文件夹的邮件列表
    this.boxView = new Object();
    this.mailList = []; //当前文件夹,当前分页下的邮件列表数据
    this.pageCount = 0;
    this.pageSize = this.getPageSize() || 20;
    this.pageIndex = 1;
    this.pageBar = null; //分页栏 
    this.newMailCount = 0; //新邮件数,用于邮件到达提醒
    this.isSearch = false; //是否是搜索模式
    this.isNewSearch = false;//是否是新的搜索
    this.searchParam = null;//搜索参数
    this.defaultSortName = "receivedDate";//默认排序字段
    this.defaultSortIsDesc = true;//默认采用降序排序方式
    this.sortName = this.defaultSortName;//当前排序方式
    this.sortIsDesc = this.defaultSortIsDesc;//是否用降序排列
    this.mailType = "";//列表数据类型，默认全部，new 新邮件 old 已读邮件 important 重要邮件
    this.mailFolder = top.Utils.queryString("mf", window.location.href) == null ? "" : top.Utils.queryString("mf", window.location.href);//群邮件邮件夹默认收件箱，delete 已删邮件 reject 已拒收邮件
    this.behaviorid = (this.mailFolder == "delete") ? 10702 : 10701;
    this.HeaderTemplate = "<div class='tipMail2'></div><table cellpadding='0'>\
	<thead><tr><th class='check'><a hideFocus='1' href='javascript:void(0)' onclick='MB.selectAll(this)'>全选</a>\
	</th><th class='status'><i class='statusTh'></i></th><th class='attach'><i class='attachTh'></i></th>\
	<th class='priority'><i class='priorityTh'></i></th>\
	<th class='from' id='from' onclick='MB.sortMail(\"from\",this)'><span>发件人</span><i class='th401'></i></th>\
	<th class='subject' onclick='MB.sortMail(\"subject\",this)'>主题<i class='th401'></i></th>\
	<th class='date' onclick='MB.sortMail(\"receivedDate\",this)'>日期<i class='th401'></i></th>\
	<th class='size' onclick='MB.sortMail(\"size\",this)'>大小<i class='th401'></i></th></tr></thead></table><div class='listBody'>";
    this.HtmlTemplate = "<!--item start-->\
	<tr idx='$index' @getRowStyle() onmousedown='MB.rowMouseDown(this)'>\
	<td class='check'><input type='checkbox' onclick='no();' name='chk_topicid' value='$id'></td>\
	<td class='status'>@getStatus(status)</td>\
	<td class='attach'><i class='@getAttach()'></i>\
	<td class='priority'><i class='@getPriority(priority)'></i></td>\
	<td class='from'><a onmousedown='return MB.subjectDown()' onclick='MB.readMail($index,this);return false;' href='javascript:void(0)' title=\"@getFromTitle(to)\">@getName(to)</a></td>\
	<td class='subject'><a onmousedown='return MB.subjectDown()' onclick='MB.readMail($index,this);return false;' href='javascript:void(0)' title=\"@getSubjectTitle(subject)\">@getFolder()$subject</a></td>\
	<td class='date'>@getDate(sentDate,receivedDate)</td>\
	<td class='size'>$size</td>\
	</tr><!--item end-->";
    this.FooterTemplate = "<tfoot><tr><td colspan='8'></td></tr></tfoot></table></div>";
    this.subjectDown = function(){
        Utils.stopEvent();
        return false;
    }
    this.getHtml = function(){
        var html = "<div class='mailList list'></div>";
        return html;
    }
    
    this.sortMail = function(ord, sender){
        this.sortName = ord || this.defaultSortName;//当前排序方式
        this.sortIsDesc = !this.sortIsDesc;
        
        this.getMainList();
        //        MS.context = this;
        //		MS.getMailList(1,10,1,"subject","desc",function(data,pageIndex){
        //			MB.dataBind(data,pageIndex);
        //			MB.createPager();
        //		});
    }
    this.getListHeader = function(){
        if (typeof(this.container) != 'undefined') 
            return this.container.childNodes[1];
    }
    this.getListBody = function(){
        return $(".listBody").get()[0];
    }
    this.getPriority = function(priority){
        //0.普通 1.紧急		
        if (priority == 1) {
            return "priority1";
        }
        else {
            return "priority2";
        }
    }
    //全选
    this.selectAll = function(sender){
        var flag = true;
        if (sender.innerHTML == "全选") {
            sender.innerHTML = "不选";
            flag = true;
        }
        else {
            sender.innerHTML = "全选";
            flag = false;
        }
        var chk = this.getListBody().getElementsByTagName("input");
        for (var i = 0; i < chk.length; i++) {
            chk[i].checked = flag;
            var obj = chk[i].parentNode.parentNode;
            if (flag) {
                $(obj).addClass("on");
            }
            else {
                $(obj).removeClass("on");
            }
        }
    }
    //得到已选中邮件的mid列表,type=0时返回tr列表,type=1时返回checkbox的value列表
    this.getSelectRows = function(type){
        var table = this.getListBody();
        if (!table) {
            return;
        }
        var trs = table.getElementsByTagName("tr");
        var results = new Array();
        for (var i = 0; i < trs.length; i++) {
            var td = trs[i].cells[0];
            if (td.childNodes.length > 0 && td.childNodes[0].checked && td.childNodes[0].checked == true) {
                if (type == 0) {
                    results[i] = td.childNodes[0].value;
                }
                else 
                    if (type == 1) {
                        var idx = trs[i].getAttribute("idx");
                        results[idx] = trs[i];
                    }
                    else 
                        if (type == 2) {
                        }
            }
        }
        return results;
    }
    this.getSelectCount = function(){
        var newCount = 0;
        var totalCount = 0;
        var rows = this.getSelectRows(1);
        for (elem in rows) {
            if (this.mailList[elem].status == 5) {
                newCount++;
            }
            totalCount++;
        }
        return {
            totalCount: totalCount,
            newCount: newCount
        };
    }
    //折叠日期分组
    this.togglePeriod = function(sender){
        var display = "";
        //sender=sender.firstChild;
        if (sender.getAttribute("status") == 1) {
            sender.setAttribute("status", 0);
            sender.innerHTML = "+&nbsp;";
            sender.className = "icoOpen";
            display = "none";
        }
        else {
            sender.setAttribute("status", 1);
            display = "";
            sender.innerHTML = "-&nbsp;";
            sender.className = "icoClose";
        }
        var table = sender.parentNode.parentNode;
        for (var i = 0; i < table.rows.length; i++) {
            table.rows[i].style.display = display;
        }
    }
    this.selectPeriod = function(sender){
        var table = sender.parentNode.parentNode;
        var status = sender.getAttribute("status");
        if (status == 0) {
            sender.setAttribute("status", 1);
        }
        else {
            sender.setAttribute("status", 0);
        }
        for (var i = 0; i < table.rows.length; i++) {
            //table.rows[i].className = status == 0 ? "on" : "";
            var chk = table.rows[i].cells[0].firstChild;
            if (chk) {
                chk.checked = status == 0 ? true : false;
            }
        }
    }
    this.updateFolderInfo = function(){ //更新文件夹统计信息,暂时屏闭,勿删
        /*
         var str_info="<span style='font-size:18px;font-weight:bold;'>{foldername}</span>[新邮件{foldernew}封/共{foldermail}封]";
         var folder=FM.getFolderInfo(this.folderId);
         this.folderInfo.innerHTML=String.format(str_info,
         {
         foldername:folder.foldername,
         foldermail:folder.foldermail,
         foldernew:folder.foldernew
         });*/
        try {
            var count = FM.folderStat["totalnew"];
            if (count < 0) {
                count = 0
            };
            document.getElementById("welcome").contentWindow.document.getElementById("unread").innerHTML = count;
        } 
        catch (ex) {
        }
    }
    //工具栏菜单
    this.getToolbar = function(obj, index){
        var div = $(obj);
        div.attr("id", "toolbar_" + index);
        if (this.mailFolder != "delete") {
            /*div.append(Menu.createButton("删除", function(){
                MB.deleteMail(false);
            }));*/

			obj.appendChild(SimpleMenuButton.create({
		    	text:"删 除",
				rightSpace:true,
		    	click:function(){
					MB.deleteMail(false);
		    	}
		    }));
        }
        /*div.append(Menu.createButton("彻底删除", function(){
            MB.deleteMail(true);
        }));*/

		obj.appendChild(SimpleMenuButton.create({
			text:"彻底删除",
			rightSpace:true,
			click:function(){
				MB.deleteMail(true);
			}
		}));

        if (this.mailFolder == "delete") {
            /*div.append(Menu.createButton("还原", function(){
                MB.cancelDelete();
            }));*/

			obj.appendChild(SimpleMenuButton.create({
				text:"还原",
				rightSpace:true,
				click:function(){
					MB.cancelDelete();
				}
			}));
        }
        /*Menu.createMenu({
            container: div,
            text: "标记为",
            id: "meun_mark" + index,
            items: [{
                text: "已读",
                click: function(){
                    MB.markMail(2);
                    // add by tkh 刷新左侧未读邮件数
                    top.$App.trigger("userAttrChange", {
		                callback: function () {
		                    top.$App.trigger("reduceGroupMail", {});
		                }
		            });
                }
            }, {
                text: "未读",
                click: function(){
                    MB.markMail(1);
                    // add by tkh 刷新左侧未读邮件数
                    top.$App.trigger("userAttrChange", {
		                callback: function () {
		                    top.$App.trigger("reduceGroupMail", {});
		                }
		            });
                }
            }, {
                text: "重要",
                click: function(){
                    MB.markMail(3);
                }
            }, {
                text: "取消重要",
                click: function(){
                    MB.markMail(4);
                }
            }]
        });*/

		obj.appendChild(SimpleMenuButton.create({
			text:"标记为",
			rightSpace:true,
			menu:[{
					text: "已读",
					click: function(){
						MB.markMail(2);
						// add by tkh 刷新左侧未读邮件数
						top.$App.trigger("userAttrChange", {
							callback: function () {
								top.$App.trigger("reduceGroupMail", {});
							}
						});
					}
				}, {
					text: "未读",
					click: function(){
						MB.markMail(1);
						// add by tkh 刷新左侧未读邮件数
						top.$App.trigger("userAttrChange", {
							callback: function () {
								top.$App.trigger("reduceGroupMail", {});
							}
						});
					}
				}, {
					text: "重要",
					click: function(){
						MB.markMail(3);
					}
				}, {
					text: "取消重要",
					click: function(){
						MB.markMail(4);
					}
				}]
		}));

        /*Menu.createMenu({
            container: div,
            text: "查看",
            id: "view" + index,
            items: [{
                text: "全部",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "已读邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "old";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "未读邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "new";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "重要邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "important";
					MB.pageIndex=1;
                    MB.run();
                }
            }]
        });*/

		obj.appendChild(SimpleMenuButton.create({
			text:"查看",
			menu:[{
                text: "全部",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "已读邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "old";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "未读邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "new";
					MB.pageIndex=1;
                    MB.run();
                }
            }, {
                text: "重要邮件",
                click: function(){
                    Behavior(MB.behaviorid, 4);
                    MB.mailType = "important";
					MB.pageIndex=1;
                    MB.run();
                }
            }]
		}));
        //添加分页容器
        this.pageBar = document.createElement("div");
        this.pageBar.className = "pagebar";
        this.pageBar.id = "pagebar_" + index;
        div.append(this.pageBar);
    }
    this.getMoveMenu = function(){
        var items = new Array();
        var currentFid = this.folderId;
        for (var i = 0; i < FM.folderList.length; i++) {
            (function(fid, name){
                if (fid != currentFid) {
                    var obj = {
                        text: name,
                        click: function(){
                            MB.moveMail(fid)
                        }
                    };
                    items.push(obj);
                }
            })(FM.folderList[i].fid, FM.folderList[i].foldername)
        }
        var menu = {
            name: "menu_move",
            text: "移动到",
            items: items
        };
        return Menu.createMenu(menu, {
            button: "tlBtn-139",
            menu: "dMenu",
            icon: "tlBtn3-139"
        })
    }
    //重新生成移动到菜单
    this.rebuildMoveMenu = function(){
        $("#menu_move").html(this.getMoveMenu().innerHTML);
    }
    //重新加载收件箱,用于收信,邮件排序
    this.reloadInbox = function(fid, isReceive){
        if (!fid) {
            fid = 1;
        }
        var orderStr = "";
        if (isReceive) { //按时间排序才能收新邮件
            orderStr = "&ord=0&desc=1";
        }
        else 
            if (this.moduleData && this.moduleData["orderStr"]) { //如果在其它模块触发收信,moduleData里没有值
                orderStr = this.moduleData["orderStr"];
            }
        MS.context = this;
        MS.getMailList(fid, 1, this.pageSize, 0, orderStr, function(data, pageIndex){
            var c = MM.currentModule;
            if (true || MM.currentModule.type == "mailbox") { //当前模块是收件箱，自动收信时可能其它模块正处于激活状态，无法重新绑定界面
                var key = fid + "_1";
                MB.boxList[key] = data;//更新邮件列表数组
                if (MB.folderId == fid) { //当前正处于的文件夹需要更新
                    MB.mailList = data.list;
                    MB.mailBody = data["maillistbody"][0];
                    if (MM.exist("mailbox_" + fid.toString())) { //判断该文件夹是否已加载
                        MB.dataBind(data, pageIndex);
                    }
                    else {
                        MB.easeCache(fid); //未加载过则清除数据
                    }
                }
                else { //当前处于其它文件夹内
                    MB.easeCache(fid);
                }
            }
            else {
                //this.easeCache(1);
            }
            if (this.newMailCount > 0) { //有新邮件到达
                //2009-3-19
                var theNewMail = data.list[0];
                var newIndex = 0;
                var date;
                var diff;
                for (newIndex = 0; newIndex < data.list.length; newIndex++) {
                    theNewMail = data.list[newIndex];
                    date = (theNewMail["date"]);
                    diff = Utils.dayDiff(date, new Date());
                    if (theNewMail.status == "5" && diff >= 0) {
                        break;
                    }
                }
                if (!theNewMail || theNewMail.status != "5") {
                    theNewMail = data.list[0];
                }
                var subject = theNewMail["subject"];//最新一封邮件标题
                var mid = theNewMail["chkvalue"];
                if (top.UserData["MailPrompt"] == 1) {
                    PopTip.show("您有" + this.newMailCount + "封新邮件", String.format("<a  hideFocus='1' href='javascript:void(0)' onclick='MB.readNewMail(\"{0}\",\"{2}\",{1});return false;'>{2}</a><a href=\"javascript:Links.show('mailprompt');\" class=\"ntSet fcI\">设置</a> ", [mid, fid, subject]));
                }
                MB.newMailCount = 0;//记得关门
            }
            MB.updateFolderInfo();
        });
    }
    //判断该页数据是否已加载
    this.isLoad = function(fid, pageIndex){
        if (this.boxList[fid + "_" + pageIndex]) {
            return true;
        }
        else {
            return false;
        }
    }
    this.receiveMail = function(silence){
        //FM.checkNewMail(silence);
    }
    //从缓存数组中获取邮件列表数据
    this.getData = function(){
        var key = this.folderId + "_" + this.pageIndex.toString();
        if (this.isSearch) {
            key = "searchmail";
        }
        if (this.boxList[key]) {
            return this.boxList[key];
        }
        else {
            return null;
        }
    }
    //将当前邮件列表数据添加到缓存数组中,重要
    this.setData = function(data, pageIndex){
        var key = this.folderId + "_" + pageIndex.toString();//缓存中的键值为fid和页码的组合
        var fid = this.folderId;
        if (this.isSearch) {
            key = "searchmail";
            fid = -1;
        }
        this.boxList[key] = data;
        this.boxView[fid] = {
            pageIndex: pageIndex
        };
    }
    //切换当前邮件列表的数据源,极为重要.
    this.setCurrent = function(fid, pageIndex){
        this.pageIndex = pageIndex;
        var key = fid + "_" + pageIndex.toString();//缓存中的键值为fid和页码的组合
        if (this.isSearch) {
            key = "searchmail";
        }
        if (this.boxList[key] && !this.boxList[key].error) {
            this.mailList = this.boxList[key]["maillist"]; //获取邮件列表引用
            this.mailBody = this.boxList[key]["maillistbody"][0];
        }
        else { //没有数据
            this.mailList = new Array();
            this.mailBody = new Object();
        }
    }
    
    
    
    this.createPager = function(){
        this.pageBar = $(".pagebar");
        this.pageBar.html("");
        
        var html_pageSize = $("<span><span>每页显示</span><select class='pagesize'>" +
        "<option value='10'>10</option>" +
        "<option value='20'>20</option>" +
        "<option value='50'>50</option>" +
        "<option value='100'>100</option>" +
        "</select></span>");
        
        html_pageSize.find("select").change(function(){
            var pageSize = parseInt($(this).val());
            var data = {
                attrs: {
                    maxlist: pageSize
                }
            };
            MB.pageIndex = 1;
            MB.pageSize = pageSize;
            MB.run();
			top.M139.RichMail.API.call("user:setAttrs", data, function(){
                top.UserAttrs.defaultPageSize = pageSize;
                top.GlobalEvent.broadcast("option_pagesize");
            });
			/*
            top.RequestBuilder.call("user:setAttrs", data, function(){
                top.UserAttrs.defaultPageSize = pageSize;
                top.GlobalEvent.broadcast("option_pagesize");
            });*/
        });
        
        this.pageBar.append(html_pageSize);
        
        
        if (this.pageCount > 0) {
            $.each(this.pageBar, function(){
                PageTurnner.createStyle(MB.pageCount, MB.pageIndex, this, function(index){
                    MB.gotoPage.call(MB, index)
                });
            });
            
        }
        
        $("select.pagesize>option[value='" + this.pageSize + "']").attr("selected", "true");
        
        
    }
    //更新页码
    this.updatePager = function(){
        this.pageBar.innerHTML = "";
        this.createPager();
    }
    //翻页
    this.gotoPage = function(pageIndex, repage){
        this.pageIndex = pageIndex;
        this.getMainList();
    }
    this.onResize = function(){
        var obj = this.getListBody();
        if (obj) {
            var top = $(this.getListBody()).offset().top;
            var height = $(window).height() - top;
            if (height < 0) {
                height = 1;
            };
            $(obj).height(height);
        }
    }
    this.beforeShow = function(){
        var fid = this.module.moduleData["fid"];
        this.folderId = fid;
    }
    this.onShow = function(){
        if (!this.isSearch) {
            var fid = this.module.moduleData["fid"];
            this.folderId = fid;
            var pageIndex = 1;
            if (this.boxView[fid]) {
                this.pageIndex = this.boxView[fid]["pageIndex"];
            }
            if (this.getData()) { //缓存中是否有数据
                this.setCurrent(fid, this.pageIndex);
                this.createPager();
            }
            else { //第一次加载或数据过期,重新读取
                MS.context = this;
                MS.getMailList(fid, 1, -1, this.isSearch, this.moduleData["orderStr"], function(data, pageIndex){
                    MB.dataBind(data, pageIndex);
                    MB.createPager();
                });
            }
        }
        else {
            if (this.isNewSearch) { //是重新搜索来的
                this.isNewSearch = false;
                MS.context = this;
                MS.searchMail(this.searchParam, function(data, pageIndex){
                    this.dataBind(data, 1);
                    this.createPager();
                });
            }
            else {
                this.setCurrent(this.folderId, this.boxView[-1]["pageIndex"]);
                this.createPager();
            }
        }
    }
    //不同文件夹，显示不同的页面。
    this.show = function(mf){
        switch (mf) {
            case "delete":
                break;
            case "reject":
                break;
            default:
                break;
        }
    }
    this.easeAll = function(){ //一下子删除所有的缓存，多快好省^_^
        this.mailList = null;
        for (elem in this.boxList) {
            delete this.boxList[elem];
        }
    }
    
    this.refuseMail = function(){
    
    }
    
    //删除邮件
    this.deleteMail = function(isReal){
        var mid = this.getSelectRows(0);
        var count = Utils.getLength(mid);
        if (count > 0) {
            var param = {
                pi: this.pageIndex,
                isReal: false
            };
            MS.context = this;
            if (isReal) {
                param.isReal = true;
                //彻底删除此邮件后将无法取回，您确定要彻底删除吗？				
                FloatingFrame.confirm(frameworkMessage.truncateMail, function(){
                    Behavior(MB.behaviorid, 2);
                    MS.deleteMail(mid, param, MB.deleteComplete);
                })
            }
            else {
                Behavior(MB.behaviorid, 1);
                MS.deleteMail(mid, param, this.deleteComplete);
            }
        }
        else {
            //请选择邮件
            FloatingFrame.alert(frameworkMessage.selectMail)
        }
    }
    //还原邮件
    this.cancelDelete = function(){
        var mid = this.getSelectRows(0);
        var count = Utils.getLength(mid);
        if (count > 0) {
            var param = {
                pi: this.pageIndex
            };
            MS.context = this;
            Behavior(MB.behaviorid, 1);
            MS.cancelDelete(mid, param, this.cancelDeleteComplete);
            
        }
        else {
            //请选择邮件
            FloatingFrame.alert(frameworkMessage.selectMail)
        }
    }
    this.updateMailCount = function(fid, count){
        var info = FM.getFolderInfo(fid);
        this.mailBody.mailcount = info["foldermail"];
        this.mailBody.newmailcount = info["foldernew"];
        for (elem in this.boxList) {
            var idx = elem.indexOf("_");
            var fid_box = elem.substring(0, idx);
            if (fid_box == fid) {
                this.boxList[elem]["maillistbody"][0]["mailcount"] = info["foldermail"];
                this.boxList[elem]["maillistbody"][0]["newmailcount"] = info["foldernew"];
            }
        }
    }
    //删除成功回调
    this.deleteComplete = function(obj, isReal){
        MB.run();
        renderGroupList.reset();
        
        // add by tkh 渲染左侧未读邮件数
        top.$App.trigger("userAttrChange", {
            callback: function () {
                top.$App.trigger("reduceGroupMail", {});
            }
        });
    }
    //还原成功回调
    this.cancelDeleteComplete = function(obj){
        MB.run();
        renderGroupList.reset();
    }
    //标记邮件
    this.markMail = function(flag){
        //status 1=标记为未读,2=标记为已读,3=标记为重要,4=标记为不重要
        
        mid = this.getSelectRows(0);
        if (!mid) {
            //请选择邮件
            FloatingFrame.alert(frameworkMessage.selectMail)
            return;
        }
        
        if (Utils.getLength(mid) > 0) {
            MS.context = this;
            MS.markMail(mid, flag, this.markComplete);
        }
        else {
            //请选择邮件
            FloatingFrame.alert(frameworkMessage.selectMail)
        }
    }
    this.markComplete = function(flag){
        Behavior(MB.behaviorid, 3);
        var rows = this.getSelectRows(1);
        for (elem in rows) {
            switch (flag) {
                case 1: //标记为未读
                    //rows[elem].style.fontWeight="bold";
                    $(rows[elem]).addClass("new5");
                    rows[elem].cells[1].firstChild.className = "status5";
                    this.mailList[elem].status = 5;
                    break;
                case 2: //标记为已读
                    //rows[elem].style.fontWeight="";
                    $(rows[elem]).removeClass("new5");
                    rows[elem].cells[1].firstChild.className = "status6";
                    this.mailList[elem].status = 6;
                    break;
                case 4://不重要
                    rows[elem].cells[3].firstChild.className = "priority2";
                    this.mailList[elem].priority = 2;
                    break;
                case 3://重要
                    rows[elem].cells[3].firstChild.className = "priority1";
                    this.mailList[elem].priority = 1;
                    break;
            }
        }
        renderGroupList.reset();
    }
    this.forwardMail = function(){
        var mid = this.getSelectRows(0);
        selectCount = Utils.getLength(mid);
        if (selectCount == 0) {
            //请选择邮件
            FloatingFrame.alert(frameworkMessage.selectMail)
            return;
        }
        var arr = [];
        for (elem in mid) {
            arr.push(mid[elem]);
        }
        MS.forwardMail(this.folderId, arr);
    }
    
    this.readNewMail = function(mid, title, fid){
        PopTip.close();
        this.markNewMail(mid, fid);
        mid = mid.replace(/%0A/ig, "%250A");
        var url = "/coremail/fcg/ldmsapp?funcid=readlett&sid=" + sid +
        "&mid=" +
        mid +
        "&fid=" +
        fid +
        "&ord=0&desc=1&start=0";
        RM.show(url, title);
    }
    this.markNewMail = function(mid, fid){
        if (MM.exist("mailbox_" + fid.toString())) {
            var obj = $("input[@value=" + mid + "]");
            if (obj.length > 0) {
                var tr = obj.parent().parent()[0];
                if (tr.cells[1].firstChild.className == "status5") {
                    $(tr).removeClass("new5");
                    tr.cells[1].firstChild.className = "status6";
                    FM.setMailCount(fid, 0, -1);
                }
            }
        }
        else {
            FM.setMailCount(fid, 0, -1);
        }
        this.updateFolderInfo();
    }
    //读邮件
    this.readMail = function(index, element){
        Behavior(MB.behaviorid, 5);
        var data = this.mailList[index];
        if ($(element).parent().parent().hasClass("new5")) {
            renderGroupList.readMail(data.gn);
        }
        $(element).parent().parent().removeClass("new5");
        $(element).parent().parent().find("td.status>i").removeClass("status5");
        gType = window["getGroupType"]() == "fetionGroup" ? 1 : 0;
        var sid = top.UserData.ssoSid;
        var ot = this.sortIsDesc ? "desc" : "asc";
        var gn = window["cacheGN"];
        var url = Tool.getHost() + "/GroupMail/GroupMail/GroupmailDetail.aspx?id={0}&sid={1}&amp;gt={2}&mt={3}&order={4}&mf={5}&ot={6}&gn={7}".format(data.id, sid, gType, this.mailType, this.sortName, this.mailFolder, ot, gn);
        
        top.RGM.show({
            id: data.id,//群邮件id
            url: url,//该iframe的地址
            title: data.subject
        });
        //MailOperating.refreshMailsCount();
        //window.location.href = url;
        Utils.stopEvent();
        
        // add by tkh 刷新右侧未读邮件数量
        var mail = data;
        if (mail.flags && mail.flags.read == false) { //未读邮件
	        mail.flags.read = true; //置为已读
	        top.$App.trigger("userAttrChange", {
                callback: function () {
                    top.$App.trigger("reduceGroupMail", {});
                }
            });
	    }
	    top.$App.on('reflushGroupMailList', function(){
	    	renderGroupList.reset();
	    	top.$App.off('reflushGroupMailList');
	    });
	    
        return;
    }
    this.getTrByIndex = function(idx){
        trs = this.getListBody().getElementsByTagName("tr");
        for (var i = 0; i < trs.length; i++) {
            var j = trs[i].getAttribute("idx");
            if (j && j == idx) {
                return trs[i];
            }
        }
        return null;
    }
    this.statusSearch = function(status, priority, fid){
        var param = new Object;
        if (fid) {
            param["fid"] = fid;
        }
        else {
            param["fid"] = this.folderId;
        }
        param["stateflag"] = status;
        param["priority"] = priority;
        //param["word"] ="word";
        param["funcid"] = "srchhand2";
        this.search("word", param);
    }
    
    this.getSelectText = function(){
        var result = "拖动邮件";
        var rows = this.getSelectRows(1);
        var count = Utils.getLength(rows);
        if (count == 1) {
            for (elem in rows) {
                var idx = Number(elem);
                result = this.mailList[idx]["subject"];
                break;
            }
        }
        else {
            result = "<span>您选中了" + count.toString() + "封邮件</span>";
        }
        return result;
    }
    //行点击事件,用于处理拖放邮件
    this.rowMouseDown = function(tr){
        var chk = tr.cells[0].firstChild;
        chk.checked = !chk.checked;
        if (chk.checked) {
            $(tr).addClass("on");
        }
        else {
            $(tr).removeClass("on");
        }
        //禁用拖放
        return false;
    }
}
