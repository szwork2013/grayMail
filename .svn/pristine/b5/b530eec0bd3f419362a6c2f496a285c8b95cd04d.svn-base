function createMailboxRenderFunctions(model,view) { 
    if(model && view){
        var fid = view.model.get("fid");
        var isShowFolderName = model.get("isSearchMode") && model.get("fid") > -1 && !model.isBillMode();
        var isSessionMailMode = $App.isSessionMode();
        var isSubscribeMode = model.isSubscribeMode();
        var isShowSummary = model.get("fid") == 7 ? true : model.get("showSummary");  //邮件备份页面要求显示摘要，这里判断下
        var contactsModel = M2012.Contacts.getModel();
        var isIE6 = $.browser.msie && $.browser.version == 6;
        var nameCache = {};
        var isVipCache = {};
        var emailCache = {};
        var vipEmails = model.getVipEmails();
        var vipEmailMap = {};
        var allAccounts = $User.getAccountListArray();
        var isShowMe = isSessionMailMode && $App.isSessionFid(fid) && !model.get("isSearchMode");
        if (vipEmails) {
            for (var i = 0, len = vipEmails.length; i < len; i++) {
                vipEmailMap[vipEmails[i]] = 1;
            }
        }
    }
    var colorMap = {
        0: { color: "#000000", title: "黑色" },
        1: { color: "#FF9800", title: "橙色" },
        2: { color: "#339A67", title: "绿色" },
        3: { color: "#2D5AE2", title: "蓝色" },
        4: { color: "#7F0081", title: "紫色" },
        5: { color: "red", title: "红色" }
    }
    var now = new Date();
    if (M139._ClientDiffTime_) {
        now = new Date(new Date() - M139._ClientDiffTime_);//根据客户端时间与服务端日期的差值，计算真实服务器时间
    }
    var nowObj = {
        times: now.getTime(),
        years: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
        hour: now.getHours(),
        minutes: now.getMinutes()
    };

    var remindIcoTemplate = [''
    , '<a href="javascript:;" class="{2}" name="mailtask">'
    , '<span mid="{0}" status="{1}" taskDate="{3}"></span>'
    , '</a>'
    , ''].join('');

    var startIconTemplate = '<div class="maillist-starwarp"><i class="i_starM" name="list_starmail"></i></div>';

    return {//渲染邮件列表的自定义函数
        getStatus: function () {

            var flags = this.DataRow["flags"];
            var logoType = this.DataRow["logoType"];
            var unread = flags["read"] == 1;
            if (this.DataRow["billFlag"] && logoType) {
                if (logoType == 2) {
                    return "<i class=\"i_m_rss\" title='服务邮件'></i>";
                } else if (logoType <= 1) {
                    return "<i class=\"" + (unread ? "i_m_money" : "i_m_moneyg") + "\"  title='账单邮件'></i>";
                } else if (logoType == "4") {
                    return "<i class=\"i_m_yo\" title='语音信箱'></i>";
                } else {
                    return "<i class='m139' title='系统邮件'></i>"
                }
                
            } else if (this.DataRow["subscriptionFlag"]) {
                return "<i class=\"" + (unread ? "i_m_rss" : "i_m_rssg") + "\" title='订阅邮件'></i>";
            } else if (logoType == 1) {
                return "<i class='m139' title='系统邮件'></i>"
            } else if (flags["top"]) {
                return "<i class='i_m_d' title='置顶'></i>"
            } else if (flags["fixedtime"] == 1) {
                return "<i class='i_m_sd' title='定时邮件'></i>";
            } else if (flags["read"] == 1) {
                return "<i class='i_m_n' title='未读邮件'></i>";
            } else if (flags["replied"] && flags["forwarded"]) {
                return "<i class='i_m_o2h' title='已回复已转发'></i>";
            } else if (flags["replied"]) {
                return "<i class='i_m_yhf' title='已回复'></i>";
            } else if (flags["forwarded"]) {
                return "<i class='i_m_o2h' title='已转发'></i>"
            } else if (flags["recallok"] == 1) {
                return "<i class='i_m_chui' title='已撤回'></i>"
            }
            return "<i class='i_m_o' title='普通'></i>";

        },
        getFolder: function () {
            if (isShowFolderName) {
                var fid = this.DataRow["fid"];
                var folderInfo = $App.getFolderById(fid);
                if (folderInfo && !model.isSubscribeMode()) {
                    var folderName = folderInfo["name"].trim();
                    return "[" + folderName + "]";
                } else {
                    return "";
                }

            } else {
                return "";
            }
        },
        getSubjectColor: function (number) {
            if (number == 0) return "";
            var result = "";
            if (colorMap[number]) {
                result = "color:" + colorMap[number].color + ";";
            }
            return result;
        },
        getSubjectPadding: function () {
            if (isSessionMailMode) {
                var mailnum = this.DataRow.mailNum;
                if (mailnum == 0) {
                    return "padding-right:0px"
                };
            } else {
                if(model.get('layout') != 'left') {
                    return "padding-right:0px"
                }                
            }
        },
        getRowStyle: function (status) {
            if (this.DataRow["flags"] && this.DataRow["flags"]["read"] == 1) {
                this.newMailCount++;
                return "fw_b";
            } else {
                return '';
            }
        },
        getAttach: function () {
            var dr = this.DataRow;
            if (this.DataRow["flags"]["attached"]) {
                return "i_atta";
            } else {
                return "";
            }
        },
        getPriority: function (priority) {
            if (priority == 1) {
                return "i_exc i_excOn";
            } else {
                return "i_exc";
            }
        },
        getFrom: function (from) {//获取发件人邮件地址
            if (this.DataRow["fid"] == 2 || this.DataRow["fid"] == 3) {		//草稿箱，发件箱时显示接收人
                from = this.DataRow["to"];
                if (from.indexOf(",") > 0) {
                    from = from.split(",")[0];
                }
                if (this.DataRow["to"].trim() == "") {
                    this.DataRow["to"] = "(无)";
                }
            }
            return $T.Html.encode(from);
        },
        //获取发件人姓名
        getName: function (from) { 

            if (this.DataRow["fid"] == 2 || this.DataRow["fid"] == 3) {
                //草稿箱，发件箱时显示接收人
                if(!isShowMe){ //非会话模式
                    from = this.DataRow["to"];
                    if (from.indexOf(",") > 0) {
                        from = from.split(",")[0];
                    }
                }
            }
            if (!nameCache[from]) {
                var name = $T.Html.encode(contactsModel.getAddrNameByEmail(from) || "(无)");

                if (this.view.model.get("order") == "from" || this.view.model.get("order") == "to") {
                    name = $T.Html.encode(from);
                }

                //产品新需求，会话模式下，邮件地址是自己时显示“我”
                if(isShowMe){
                    var email = $Email.getEmail(from);
                    if( $.inArray(email, allAccounts) > -1){
                        name = "我";
                    }                    
                }

                // 如果是收件箱订阅邮件入口，返回“订阅邮件”
                var mid = this.DataRow.mid;
                if (model.isClusterMail(mid) && !model.isClusterColumn()) {
                    name = "订阅邮件";
                }

                nameCache[from] = name;
            }
            if (isIE6) {
                nameCache[from] = $T.Utils.getTextOverFlow2(nameCache[from], 14,"...")
            }
            return nameCache[from];
        },

        /**
        * 会话邮件/聚合邮件数量
        * afterSubject 用于满足聚合邮件和会话邮件在不同位置显示邮件数量 "true":主题后输出数量 undefined:发件人后输出数量
        */
        getMailNum: function (afterSubject) {
            var numStr = '';
            // 当sessionEnable=2  普通列表＋聚合模式， 这是全新的模式，将用来替换原来的 0 普通列表模式。
            // 因为该模式下只有 普通邮件 和 订阅聚合邮件 （无会话），所以此种模式下mailSession和mailNum字段无效
            // sendTotalNum   仅在2 普通列表＋聚合模式下才有意义， 该字段表示 聚合邮件里邮件总数
            // sendNewNum   仅在2 普通列表＋ 聚合模式下才有意义， 该字段表示 聚合邮件里未读邮件总数
            var mailnum = this.model.getMailNum(this.DataRow);
            var sendId = this.DataRow.sendId;

            if ( this.DataRow.clusterCount > 0) {
                return '<span name="cluster_num">&nbsp;(' + this.DataRow.clusterCount + ')</span>';
            }

            if (mailnum > 1) { //订阅聚合
                if (sendId > 0 && this.model.underClusterFolder()) {
                    return '<span>&nbsp;(' + mailnum + ')</span>';
                }
                if (sendId == 0 && isSessionMailMode && $App.isSessionFid($App.getCurrentFid())) {
                    return '<span>&nbsp;(' + mailnum + ')</span>';
                }
                return '';
            } else {
                return '';
            }
            /*
            if (isSessionMailMode) {
                var mailnum = this.DataRow.mailNum;
                if (mailnum > 1) {
                    return afterSubject ? '<span>(' + mailnum + ')</span>' : '<span[' + mailnum + ']</span>';
                }
                numStr = mailnum > 1 ? '<span>(' + mailnum + ')</span>' : '';
            } else {
                if (this.DataRow.clusterCount > 0) {
                    var unreadSub = $App.getView("folder").model.get("newSubscriptionCount");
                    if (unreadSub > 0) {
                        numStr =  '<span name="cluster_num">(' + unreadSub + ')</span>';
                    } else {
                        numStr =  "";
                    }
                } else {
                    numStr =  '';
                }                
            }
            // 聚合邮件数量显示在发件人后，而主题后
            if (this.DataRow.sendId > 0) {
                return !type ? numStr : '';
            } else {
                return type ? numStr : '';
            }*/
        },

        /**
        * 会话邮件sessionId
        */
        getSessionId: function () {
            if (isSessionMailMode) {
                var sessionId = this.DataRow.mailSession;
                return " sessionId = '" + sessionId + "'";
            } else {
                return "";
            }

        },

        //星标属性样式
        getStarAttribute: function () {
            if (this.DataRow.flags) {
                var isHasStar = this.DataRow["flags"].starFlag == 1 ? 1 : 0;
                var temp = 'name="list_starmail" class = "i_starM {0}" val = "{1}" title="{2}" ';
                var val = isHasStar;
                var starClass = isHasStar ? 'i_starM_y' : '';
                var title = isHasStar ? '取消星标' : '标记星标';
                return $T.Utils.format(temp, [starClass, val, title]);
                //return temp.format(starClass,val,title);
            }
        },

        //任务邮件标记
        getRemindIco: function () {
                        
            if(isSessionMailMode && $App.getLayout() != 'list'){
                return '';
            }
            
            var mid = this.DataRow.mid;
            var taskFlag = this.DataRow.flags.taskFlag || 0;
            var taskDate = this.DataRow.taskDate || 0;

            var status = ['add', 'update', 'finish'][taskFlag]; //任务状态
            //status = ['add','update','finish'][Math.floor(Math.random()*(3-0)+0)]; //测试数据
            var map = {
                'add' : 'i_tx_n',
                'update' : 'i_tx_nb',
                'finish' : 'i_tx_ng'
            };
            return $T.Utils.format(remindIcoTemplate, [mid, status, map[status], taskDate]);
        },

        getStarIcon: function () {
            if (isSubscribeMode) { return "";}
            if (this.DataRow.flags) {
                var hasStar = this.DataRow["flags"].starFlag == 1 ? 1 : 0;
                if (hasStar) {
                    return startIconTemplate.replace("i_starM", "i_starM_y");
                } else {
                    return startIconTemplate;
                }
            }
        },

        //备注样式
        //<a href="javascript:;" mid="$mid" @getRemarkAttr()></a>
        getRemarkIco: function () {
            if (this.DataRow.flags && this.DataRow.flags.memoFlag) {
                var mid = this.DataRow.mid;
                return $T.Utils.format('<a href="javascript:;" mid="{0}" class="i_note_y"></a>', [mid]);
            } else {
                return '';
            }
        },
        getVipIcon: function () {
            var email = this.DataRow["from"];
            if (isVipCache[email] == undefined) {
                email = $Email.getEmailQuick(email);
                isVipCache[email] = Boolean(vipEmailMap[email]);
            }
            if (isVipCache[email]) {
                return "<a class=\"user_vip\"></a>";
            }
            return "";
        },
        getSubject: function (subject, isTitle) {
            var subject = $T.Html.encode(subject) || "(无)";
            if (isTitle) { //标题
                subject = subject.replace(/&amp;&lt;{(.+?)}&gt;&amp;/ig, "$1");
            } else {
                subject = subject.replace(/&amp;&lt;{(.+?)}&gt;&amp;/ig, "<b style='padding:2px;background-color:#F7D600'>$1</b>");
            }
            return subject;
        },
        getSize: function (size) {//获取邮件大小
            return $T.Utils.getFileSizeText(size, {
                byteChar: "字节"
            });
        },
        getDate: function (d, rec, taskDate) {
            var now = nowObj;

            // 待办任务列表显示待办任务的时间
            if ($App.getMailboxView().model.isTaskMode() && taskDate) {
                var formattedTaskDate;
                var expired = false;
                var today = new Date(nowObj.years, nowObj.month, nowObj.date);
                taskDate = new Date(Number(taskDate) * 1000);
                expired = taskDate < today;

                if (taskDate.getFullYear() == now.years) {
                    formattedTaskDate = taskDate.format("M月dd日");
                } else {
                    formattedTaskDate = taskDate.format("yyyy-M-dd(w)");
                }

                return "<span" + (expired ? " class='red'" : "") + " title='" + $Date.format("yyyy年M月dd日 hh:mm", taskDate) + "'>" + formattedTaskDate + "</span>";
            }

            if (fid == 1) {//收件箱使用收信日期字段
                if (rec) {
                    d = rec;
                }
            }
            var date = new Date(Number(d) * 1000);
            var result;
            //今天的邮件
            var t = now.times - date.getTime(); 	//相差毫秒
            if (t < 0) {
                if (t > -60000) {
                    result = "刚刚";
                } else {
                    result = $Date.format("yyyy-M-dd(w) hh:mm", date);
                }
            }else if (date.getFullYear() == now.years && date.getMonth() == now.month && date.getDate() == now.date) {
                var minutes = Math.round(t / 1000 / 60);
                if (minutes < 1) {
                    //minutes = 0;
                    result = "刚刚";
                }else if (minutes >= 1 && minutes < 60) {
                    result = minutes + "分钟前";
                } else {
                    result = Math.floor(minutes / 60) + "小时前";
                }
            } else if (date.getFullYear() == now.years) {
                result = date.format("M-dd(w) hh:mm");
            } else {
                result = date.format("yyyy-M-dd(w)");
            }
            return "<span title='" + $Date.format("yyyy年M月dd日 hh:mm", date) + "'>" + result + "</span>";
        },

        getSummary: function () {
            var summary = this.DataRow["summary"];
            if (isShowSummary == false) { //如果不显示摘要，返回空字符
                return "";
            }
            summary = summary.replace(/\s+/g, " ");       //过滤半角空格
            summary = summary.replace(/[\u3000]+/g, " "); //过滤全角空格
            summary = $T.Html.encode(summary);
            summary = summary.replace(/&amp;&lt;{(.+?)}&gt;&amp;/ig, "<b style='padding:2px;background-color:#F7D600'>$1</b>");
            if (summary) {
                return '<p class="gray" name="summary">' + summary.replace(/\$/ig, "") + "</p>";
            } else {
                return '<p class="gray" name="summary">&nbsp;</p>';
            }
        },
        getSectionName: function () {
            var orderField = this.model.get("order");
            var isTaskMode = this.model.get('isTaskMode');
            orderField = isTaskMode ? 'taskDate' : orderField;
            /*if (MB.moduleData && MB.moduleData["orderField"]) {
                orderField = MB.moduleData["orderField"];
            }*/
            var rp = this;
            function getPeriod(date1, date2) {
                if (rp.DataRow.flags["top"]) {
                    return "<b id=\"period_top\">置顶</b>"
                }
                date1.setHours(23, 59, 59);
                date2.setHours(23, 59, 59);
                var t = date2.getTime() - date1.getTime(); 	//相差毫秒
                var day = Math.round(t / 1000 / 60 / 60 / 24);
                var week_c = "星期" + ['日', '一', '二', '三', '四', '五', '六'][date1.getDay()]
                var w1 = date1.getDay(); w1 = w1 == 0 ? 7 : w1;
                var w2 = date2.getDay(); w2 = w2 == 0 ? 7 : w2;
                if (rp.model.get("fid") == 8) { //账单中心，按月份显示
                    if (date1.getYear() == date2.getYear()) {
                        return getPeriodForMonth(date1, date2);//同年显示月份
                    } else {
                        return getPeriodForYear(date1, date2);//不同年显示年份
                    }
                }
                if (day <= 1) {
                    if (date2.getDate() == date1.getDate()) {
                        return "<b id=\"period_today\">今天</b>";
                    } else if (day < 0) {
                        return "今天"; //未来的邮件
                    } else {
                        return "昨天";
                    }
                } else if (day == 2) {
                    if ((w2 - w1 == 2 || w2 - w1 == -5)) {
                        return "前天";
                    } else if ((w2 - w1 == 1 || w2 - w1 == -6)) {
                        return "昨天";
                    } else {
                        return "上周";
                    }


                } else if (day < 7) {
                    if (w1 < w2) {
                        return week_c;
                    } else {
                        return "上周";
                    }
                } else if (day < 7 + w2) {
                    return "上周";
                } else {
                    return "更早";
                }
            }
            function getPeriodForMonth(date1, date2) {
                if (date1.getMonth() == date2.getMonth()) {
                    return "本月";
                } else {

                    return (date1.getMonth() + 1).toString() + "月";
                }
            }
            function getPeriodForYear(date1, date2) {//年份
                if (date1.getYear() !== date2.getYear()) {
                    return (date1.getFullYear()).toString() + "年" + (date1.getMonth() + 1).toString() + "月";
                }
            }

            function getTaskPeriod(taskDate) {
                var today = new Date(nowObj.years, nowObj.month, nowObj.date);
                var tomorrow = new Date(nowObj.years, nowObj.month, +nowObj.date + 1);

                if (taskDate < today) {
                    return "<b>已过期</b>";
                } else if (taskDate > today && taskDate < tomorrow) {
                    return "<b>进行中</b>";
                } else {
                    return "<b>尚未开始</b>";
                }
            }

            if (orderField == "receiveDate" || orderField == "sendDate") {	//按日期排序
                date = new Date(Number(this.DataRow["sendDate"]) * 1000);
                if (this.model.get("fid") == 1) {
                    if (this.DataRow["receiveDate"]) {
                        date = new Date(Number(this.DataRow["receiveDate"]) * 1000);
                    }

                }
                var now = new Date();
                var diff = $Date.getDaysPass(date, now);
                var period = getPeriod(new Date(date), now);
                return period;

            } else if (orderField == "taskDate") {
                var taskDate = new Date(Number(this.DataRow["taskDate"]) * 1000);
                return getTaskPeriod(taskDate);
            } else {
                return orderField;
            }
        }
    }
}