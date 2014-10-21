
; (function ($, _, M139, top) {

    var superclass = M2012.Calendar.View.Popup.Direction;
    var _class = "M2012.Calendar.View.ActivityDetailPopup";
    var CommonAPI = M2012.Calendar.CommonAPI;

    M139.namespace(_class, superclass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),

        stopEvent: true,

        master: null,

        //显示内容子容器对象
        subContainer: null,

        templates: {
            SHARE: '<a title="通过邮件分享该活动" href="javascript:void(0);">分享</a>',
            DeleteConfirm: [
               '<div class="norTips">',
                   '<span class="norTipsIco"><i class="i_warn"></i></span>',
                   '<dl class="norTipsContent">',
                       '<dt class="norTipsLine">确定删除活动？</dt>',
                       '<dd class="norTipsLine mt_10 hide">',
                           '<input type="checkbox" name="isNotify">&nbsp;发送通知，告知参与人您删除了活动',
                       '</dd>',
                   '</dl>',
               '</div>'].join("")
        },

        /**
         *args = {
         *          target: $(dom),  //目标元素，参照元素
         *          event: event,      // 事件对象
         *          rect: {left:0,top:0,height:0,width:0} //目标元素坐标(可选)
         *          master: self.master,   // 视图主控
         *          data: data,            // 详情数据
         *          callback: Function     //刷新父页面
         *      };
         *
        */
        initialize: function (args) {

            var self = this;
            args = args || {};

            var data = args.data || null;
            self.master = args.master || null;

            self.callback = function () {
                args.callback && args.callback();
            };

            self.model = new M2012.Calendar.Model.ActivityDetailPopup({
                data: data,
                master: self.master
            });
            self.initData();
            superclass.prototype.initialize.apply(self, arguments);

        },


        initData: function () {

            var self = this;
            var data = self.model.get("data");

            if (data) {
                var args = {
                    cid: self.cid,
                    container: self,
                    master: self.master
                };
                //邀请未处理
                if (data.isInvitedCalendar) {
                    self.subContainer = data.status ?
                        //已处理
                        new M2012.Calendar.Detail.Popup.InviteAccepted(args)
                        //未处理
                       : new M2012.Calendar.Detail.Popup.InviteUnAccepted(args);
                    data.type = self.master.CONST.activityType.invited;
                }
                    //群活动
                else if (data.isGroup) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Group(args);
                    //是自己创建的活动
                    data.type = data.isOwner ? self.master.CONST.activityType.group
                        : self.master.CONST.activityType.shared;
                }
                    //订阅
                else if (data.isSubCalendar) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Subscribed(args);
                    data.type = self.master.CONST.activityType.subscribed;
                }
                    // 共享
                else if (data.isSharedCalendar) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Shared(args);
                    data.type = self.master.CONST.activityType.shared;
                }
                    //普通日历活动
                else {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Myself(args);
                    data.type = self.master.CONST.activityType.myself;
                }
            }
        },

        //添加弹出正文内容
        setContent: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setContent(el);
        },

        //操作按钮
        setOptions: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setOptions(el);
        },

        setLink: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setLink(el);
        },

        setShare: function (el) {
            // 分享,因为继承,所以在公共里面搞
            var _this = this;
            var data = _this.model.get("data");
            var UN_ACCEPT = 0; //邀请,未接受态
            var templates = _this.templates;

            //除生日外,其他都需要显示分享
            _this.lastshare = undefined;
            if (data.specialType !== M2012.Calendar.Constant.specialType.birth) {
                if (data.status == UN_ACCEPT) return; //未接受的不处理
                var share = el.append(templates.SHARE || '');
                share.bind("click", function (e) {
                    top.BH("calendar_view_clickshare");
                    var clickTime = new Date(),
                        lastTime = !!_this.lastshare ? _this.lastshare : new Date(1900); //第一次,允许点击.否则打开就立马点击分享.时间差会很小
                    if (clickTime - lastTime > 1000) { //点击之后1s内点击无效,主要防止第一次的loadjs延迟
                        _this.lastshare = clickTime;
                        _this.master.trigger(_this.master.EVENTS.SHARE_ACTIVITY, data);
                    }
                    e.stopPropagation();
                });
            }
        }

    }));

    //活动信息基类
    (function () {

        var base = M139.View.ViewBase;
        var current = "M2012.Calendar.Detail.Popup.Base";
        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                cid: 0,
                data: null
            },

            //父容器
            container: null,

            //主控
            master: null,

            Events: {
                CONFIRM_INVITED_UPDATE: "您希望向现有邀请对象发送更新吗?",
                OPERATE_ERROR: "操作失败，请稍后再试！"
            },

            initialize: function (args) {
                var self = this;

                self.cid = args.cid;
                //detail页面view对象实例
                self.container = args.container;
                self.master = args.master;
                self.data = self.container.model.get("data") || {};

                base.prototype.initialize.apply(self, arguments);
            },

            setTableContent: function () {

                var self = this;
                var el = self.getElement("table");

                var ownerInviter = self.getOwnerInviter();
                var hashTab = {

                    //主题
                    title: (function () {
                        var value = $.trim(self.data.title);
                        value = self.data.title || "(无)";
                        return self.master.capi.substrAsByte(value, 40, true);

                    })(),

                    //内容
                    content: (function () {
                        var value = $.trim(self.data.content);
                        return self.master.capi.substrAsByte(value, 36, true);
                    })(),

                    //地址
                    site: (function () {
                        var value = $.trim(self.data.site);
                        return self.master.capi.substrAsByte(value, 36, true);
                    })(),

                    //时间描述
                    dateDescript: $.trim(self.data.dateDescript),

                    //提醒
                    remind: self.getRemind(),

                    //发起人
                    sponsor: ownerInviter['invited'].length > 0 ? ownerInviter['owner'].join(",") : "",

                    //邀请状态
                    invitedstatus: ownerInviter['invitedstatus'],

                    //邀请人
                    invited: ownerInviter['invited'].join(","),

                    //日历所有人
                    owner: self.data.owner || "",

                    //共享人
                    share: self.data.share || "",

                    //导入通讯录设置好友生日的好友邮箱
                    friendEmail: self.data.extInfo ? self.data.extInfo.email : "",

                    //导入通讯录设置好友生日的手机号
                    friendMobile: self.data.extInfo ? self.data.extInfo.mobile : ""
                }

                //生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    $.extend(hashTab, {
                        //生日主题
                        birthTitle: self.data.title ? self.data.title + "生日" : "",
                        //生日时间
                        birthday: self.data.dateDescript || "",
                        //生日备注
                        birthRemark: self.data.content || "",
                        //提醒类型
                        birthRemind: self.getRemind()
                    });
                }

                for (var key in hashTab) {
                    var el = self.getElement(key);
                    var value;

                    value = $T.Html.encode(hashTab[key]);
                    if (self.data.specialType == M2012.Calendar.Constant.specialType.countDown) {
                        if (key == 'remind') {
                            // 倒计时的提醒方式,当过期时,提示"已经过期",self.getElement('remind').html()返回值为"（该提醒已过期）",否则返回""
                            value = value + self.getElement('remind').html();
                        }
                    }

                    if (value) {
                        el.html(value);
                    } else {
                        el.parent().hide();
                    }
                }

                if (self.data['sponsor'] || self.data['owner']
                    || self.data['inviter'] || self.data['share']) {

                    el.addClass('tips-shcdule-detail');
                } else {

                    el.removeClass('tips-shcdule-detail');
                }
            },

            //设置详情标题信息
            setTitle: function () {

                var self = this;
                var value = "";
                if (self.data.color) {
                    value = $TextUtils.htmlEncode(self.data.color);
                    self.getElement("tagClass").css('background-color', value);
                }

                if (self.data.title) {
                    //value = $TextUtils.htmlEncode(self.data.title);
                    //self.getElement("title").attr('title', value);

                    var title = self.data.title.replace(/\'/i, "\\\'").replace(/\"/i, '\\\"');
                    self.getElement("title").attr('title', self.data.title);
                }

                if (self.data.dateDescript) {
                    value = $TextUtils.htmlEncode(self.data.dateDescript);
                    self.getElement("dateDescript").attr('title', value);
                }
            },

            //获取邀请信息
            getOwnerInviter: function () {
                var self = this;
                var result = { owner: [], invited: [], invitedstatus: '' };
                var data = self.data;

                var inviteInfos = data['inviteInfo'];

                if (inviteInfos) {

                    var accepted = 0, rejected = 0, unhandler = 0;
                    var allstatus = [0, 0, 0];//对应顺序:未处理,已接受,已拒绝
                    for (var i = 0; i < inviteInfos.length; i++) {

                        if (inviteInfos[i].inviteAuth === -1) {

                            result.owner.push(data.trueName);
                        } else {
                            var status = inviteInfos[i].status; //0:未处理，1:已处理，2:已拒绝
                            allstatus[status] += 1; //累计
                            if (inviteInfos[i].status != 2) {//拒绝的过滤掉

                                result.invited.push(inviteInfos[i].inviterTrueName);
                            }
                        }
                    }
                    if (parseInt(allstatus.join(""), 10) > 0) { //未邀请别人时，内容为空，默认不显示
                        result.invitedstatus = $T.format("{accept}人已接受，{reject}人已谢绝，{unhandler}人未处理", {
                            accept: allstatus[1],
                            reject: allstatus[2],
                            unhandler: allstatus[0]
                        });
                    }
                }

                return result;
            },

            /**
             * 获取提醒信息描述
             * 如："提前15分钟,邮件提醒"
             */
            getRemind: function () {

                var self = this;
                var data = self.data;
                var value = "";

                if (!data.enable)
                    return value;

                var master = self.container.master;
                var constant = master.CONST;
                var before = data.beforeTime + constant.remindBeforeType[data.beforeType];

                var type = "" + data.recMySms + data.recMyEmail;
                type = (type == "01" || type == "11") ? "1" : type;

                var remindType = constant.remindSmsEmailType[type];
                var smsmobile = remindType ? "," + remindType : "";

                //是否已经取消
                if (data.beforeTime == 0 && data.enable) //任务邮件         
                    value = '准点提醒' + smsmobile;
                else
                    value = data.enable ? ("提前" + before + smsmobile) : "";

                return value;

            },

            /**
             * 获取Dom元素
             */
            getElement: function (id) {
                var self = this;
                id = $T.format("#{cid}_{id}", {
                    cid: self.cid,
                    id: id
                });
                return $(id);
            },

            /**
             * 设置内容
             */
            setContent: function (el) {
                this.setTitle();
                this.setTableContent();
            },

            /**
             * 设置操作
             */
            setOptions: function el() { },

            setLink: function (el) { },

            /**
            * 编辑
            */
            onEdit: function () {
                var self = this;
                var args = {
                    seqNo: self.data.seqNo,
                    type: self.data.type
                };

                //触发事件编辑
                self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, args);
                // 隐藏弹出框
                self.container.hide({ silent: true, ignore: true });
            },

            /**
             * 取消
             */
            onCancel: function () {
                this.container.hide({ silent: true, ignore: true });
            },

            /**
             * 发贺卡
             */
            sendCard: function (data) {
                var self = this;
                var email, domain = "139.com";
                //添加行为日志
                self.master.capi.addBehavior("calendar_sendcard_click");

                var postcardId = top.SiteConfig.calendarPostcard;
                var friendAddr = " ";  //从通讯录导入生日提醒获取的邮件地址
                if (data.emailAddress) {
                    email = data.emailAddress;
                    if (!$Email.isEmailAddr(email)) { //不是邮箱给加上后缀
                        email = email + "@" + top.SiteConfig.mailDomain; //已经判断过window.isCaiyun 了
                    }
                    friendAddr = email;
                }
                top.$App.show("greetingcard", "&email=" + friendAddr + "&materialId=" + postcardId);     //materialId是跳转到指定的某一张生日贺卡
            },

            /**
             *  操作失败后的统一处理  
             */
            onFail: function () {
                var self = this;
                top.M139.UI.TipMessage.show(self.Events.OPERATE_ERROR, {
                    delay: 3000,
                    className: "msgRed"
                });
                //隐藏操作按钮遮罩层
                self.container.hideMask();
            },

            /**
             * 是否应该向用户发送通知
            **/
            shouldNotify: function () {
                var self = this;
                var inviteInfo = self.data.inviteInfo;
                var value = false;

                if (inviteInfo && inviteInfo.length > 0) {
                    var filter = $.grep(inviteInfo, function (n, i) {
                        return n.inviteAuth !== -1;
                    });
                    if (filter.length > 0)
                        value = true;
                }

                if (!value) {
                    var labelId = self.data.labelId;
                    value = self.master.isShareLabel(labelId);
                }
                return value;
            },

            //删除
            onDelete: function (el) {
                var self = this;
                var checkboxEl = null;
                var dialogEl = top.$Msg.showHTML(self.container.templates.DeleteConfirm, function () {
                    //显示操作按钮遮罩层
                    self.container.showMask();
                    //查看日程类型
                    //邀请类日程
                    if (self.data.isInvitedCalendar) {
                        self.container.model.cancelInvited(self.data.seqNo, function () {
                            top.M139.UI.TipMessage.show('删除成功', { delay: 3000 });
                            self.onRemove({ seqNo: self.data.seqNo });
                        }, function () {
                            self.onFail();
                        });
                        return;
                    }
                    var isNotify = checkboxEl.attr("checked") ? 1 : 0;
                    var data = {
                        seqNos: self.data.seqNo,
                        isNotify: isNotify
                    };
                    self.container.model.delCalendar(data, function () {
                        top.M139.UI.TipMessage.show('操作成功', { delay: 3000 });
                        self.onRemove({ seqNo: self.data.seqNo });
                    }, function () {
                        self.onFail();
                    });

                }, function () {
                    self.container.hideMask();
                }, {
                    dialogTitle: "删除活动",
                    buttons: ["确定", "取消"]
                });
                checkboxEl = dialogEl.$el.find("input[name='isNotify']");
                if (self.shouldNotify()) {
                    checkboxEl.parent().removeClass("hide");
                }
            },

            //接受
            onAccept: function (el) {

                var self = this;
                //显示操作按钮遮罩层
                self.container.showMask();

                self.container.model.updateInviteStatus({
                    seqNos: self.data.seqNo,
                    actionType: 0

                }, function () {
                    top.M139.UI.TipMessage.show('已接受', { delay: 3000 });
                    self.onRemove({ seqNo: self.data.seqNo });

                }, function () {
                    self.onFail();
                });
            },

            //谢绝
            onConfuse: function (el) {
                var self = this;
                $Msg.confirm('确定谢绝该活动吗?', function () { // 提示窗口,防止误操作
                    self.container.model.updateInviteStatus({
                        seqNos: self.data.seqNo,
                        actionType: 1

                    }, function () {
                        top.M139.UI.TipMessage.show('已谢绝', { delay: 3000 });
                        self.onRemove({ seqNo: self.data.seqNo });

                    }, function () {
                        self.onFail();
                    });
                });
            },

            /**
             * 当有活动被移除时的处理
             */
            onRemove: function (args) {
                var self = this;
                self.container.hide({ silent: true, ignore: true });
                self.container.callback(args);
            }

        }));
    })();

    //邀请的未处理活动
    (function () {

        // 邀请的未处理活动
        // args: { container: Object, cid : String}
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.InviteUnAccepted";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //初始化页面元素事件
            initEvents: function () {

            },

            //设置内容
            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, {
                    cid: self.cid,
                    title: $TextUtils.htmlEncode(self.data.title || ""),
                    date: $TextUtils.htmlEncode(self.data.dateDescript || ""),
                    subject: self.data.trueName ? ($TextUtils.htmlEncode(self.data.trueName + "给您发来活动邀请")) : ""
                }));
            },

            //设置操作
            setOptions: function (el) {
                var self = this;

                el.append($T.format(self.template.buttons, { cid: self.cid }));
                //接受
                self.getElement("btn_accept").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onAccept($(this));
                });
                // 拒绝
                self.getElement("btn_confuse").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onConfuse($(this));
                });

                self.container.showCloseBtn();
            },

            template: {

                content: [
                    '<div class="divtext">',
                        '<span id="{cid}_invitedsubject" >{subject}</span>',
                    '</div>',
                    '<table class="tips-shcdule-table">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1 td1_w gray">活动主题：</td>',
                                '<td>{title}</td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1 td1_w gray">活动时间：</td>',
                                '<td>{date}</td>',
                            '</tr>',
                            '</tbody>',
                    '</table>'
                ].join(""),

                buttons: [
                    '<a href="javascript:;" class="btnG" hidefocus role="button" id="{cid}_btn_accept">',
                        '<span>接 受</span>',
                    '</a> ',
                    '<a href="javascript:;" class="btnTb" hidefocus role="button" id="{cid}_btn_confuse">',
                        '<span>谢 绝</span>',
                    '</a>'
                ].join("")

            }
        }

       ));


    })();

    //邀请的已处理活动
    (function () {

        // 邀请的已处理活动
        // args: { container: Object, cid : String}
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.InviteAccepted";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, { cid: self.cid }));
                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }

                //填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            setOptions: function (el) {
                var self = this;
                el.append($T.format(self.template.buttons, { cid: self.cid }));

                //编辑
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: self.data.seqNo || 0,
                        type: 1
                    });
                });

                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete($(this));
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel($(this));
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                        '<span id="{cid}_invitedsubject" ></span>',
                    '</div>',
                     '<div class="divtext" id="{cid}_birthScheTit" style="display:none;">',
                        '<i class="birthIcon mr_10" style="top:0; *top:-2px"></i>',
                        '<span id="{cid}_birthTitle"></span>',
                    '</div>',
                     //生日活动弹框内容start
                    '<table class="tips-shcdule-table" id="{cid}_birthTable" style="display:none;">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">生日：</td>',
                                '<td id="{cid}_birthday"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_birthRemark"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_birthRemind"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                sendCard: '<a href="javascript:void(0)" id="{cid}_sendCard">发祝福</a>',

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb">',
                            '<span>编 辑</span>',
                        '</a> ',
                        '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb">',
                            '<span>删 除</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

    //共享的活动
    (function () {

        // 共享的活动
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.Shared";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //设置内容
            setContent: function (el) {
                var self = this;
                el.append($T.format(self.template.content, { cid: self.cid }));

                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }
                //订阅者不显示邀请信息
                self.getElement("invitedstatus").parent().hide();

                //调用基类方法填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            //设置操作
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo || 0;
                el.append($T.format(self.template.buttons, { cid: self.cid }));
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: seqNo,
                        type: 2
                    });
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                    '</div>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_view" class="btnTb">',
                            '<span>查 看</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

    //订阅类型活动
    (function () {

        //订阅
        var base = M2012.Calendar.Detail.Popup.Shared;
        var current = "M2012.Calendar.Detail.Popup.Subscribed";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },
            setContent: function (el) {
                var self = this;

                //调用基类方法呈现内容
                base.prototype.setContent.apply(self, arguments);
                //订阅的日历不显示提醒信息
                self.getElement("remind").parent().hide();
            },
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo;

                el.append($T.format(self.template.buttons, { cid: self.cid }));

                // 查看已经订阅的活动,覆盖父类的setOptions方法
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: seqNo,
                        type: 3
                    });
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            }

        }));

    })();

    //订阅类型活动
    (function () {

        //订阅
        var base = M2012.Calendar.Detail.Popup.Shared;
        var current = "M2012.Calendar.Detail.Popup.Group";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },
            setContent: function (el) {
                var self = this;
                //调用基类方法呈现内容
                base.prototype.setContent.apply(self, arguments);
            },
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo;

                el.append($T.format(self.OperateHtml, { cid: self.cid }));

                //是自己创建的群活动需要重新设置下类型，走编辑群活动流程
                if (self.data.isOwner) {
                    self.getElement("edit").removeClass("hide");
                    self.getElement("del").removeClass("hide");
                    self.getElement("view").addClass("hide");
                }

                //删除
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });
                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete();
                });

                // 查看已经订阅的活动,覆盖父类的setOptions方法
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },
            OperateHtml: [
              '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb hide">',
                  '<span>编 辑</span>',
              '</a> ',
              '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb hide">',
                  '<span>删 除</span>',
              '</a> ',
              '<a href="javascript:void(0)" id="{cid}_view" class="btnTb">',
                  '<span>查 看</span>',
              '</a> ',
              '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                  '<span>取 消</span>',
              '</a>'
            ].join("")
        }));

    })();

    (function () {

        // 我的日历下活动
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.Myself";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //设置内容
            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, { cid: self.cid }));
                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }
                if (self.data.specialType == M2012.Calendar.Constant.specialType.countDown) {
                    // 倒计时
                    var srcData = self.data,
                        startDate = srcData.startDate,
                        startTime = srcData.startTime,
                        beginTime = (startTime.length < 4) ? "0" + startTime : startTime, // "800"转换成"0800"的情况
                        datetime = new Date(startDate.replace(/-/g, "/") + " " + beginTime.substring(0, 2) + ":" + beginTime.substring(2)),
                        remindContent = self.getElement("remind").html();

                    // 提醒默认不显示
                    //self.contentEl.parent().hide();
                    // TODO 编辑功能未完成,暂时先屏蔽
                    //self.editEl.hide();
                    M2012.Calendar.CommonAPI.calculateCountdown(datetime, function (param) {
                        if (param.expired) {
                            // 过期显示"该提醒已过期"
                            self.getElement("remind").html("<span style='color: #DE0202;'>（该提醒已过期）</span>");
                        } else {
                            // 未过期时正常显示倒计时
                            var html = "";
                            html = html + "<em>距今还有</em>"
                                + "<i>" + param.days + "</i>"
                                + "<span>天</span>"
                                + "<i>" + param.hours + "</i>"
                                + "<span>时</span>"
                                + "<i>" + param.minutes + "</i>"
                                + "<span class='last'>分</span>";
                            //self.getElement("remind").html(remindContent);
                            self.getElement("countdowntable").find("div").html(html);
                            self.getElement("countdowntable").show();
                        }
                    });
                }

                //调用基类方法填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            //设置操作
            setOptions: function (el) {
                var self = this;

                el.append($T.format(self.template.buttons, {
                    cid: self.cid
                }));
                //编辑
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });
                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete($(this));
                });
                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                        '<span id="{cid}_invitedsubject" ></span>',
                    '</div>',
                     '<div class="divtext" id="{cid}_birthScheTit" style="display:none;">',
                        '<i class="birthIcon mr_10" style="top:0; *top:-2px"></i>',
                        '<span id="{cid}_birthTitle"></span>',
                    '</div>',
                     //生日活动弹框内容start
                    '<table class="tips-shcdule-table" id="{cid}_birthTable" style="display:none;">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">生日：</td>',
                                '<td id="{cid}_birthday"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_birthRemark"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_birthRemind"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    /* 倒计时活动的显示视图,默认隐藏 */
                    '<table style="width:320px;display:none;" id="{cid}_countdowntable">',
                        '<tbody>',
                            '<tr><td>',
                                '<div class="norTipsTime clearfix"></div>',
                            '</td></tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                sendCard: '<a href="javascript:void(0)" id="{cid}_sendCard">发祝福</a>',

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb">',
                            '<span>编 辑</span>',
                        '</a> ',
                        '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb">',
                            '<span>删 除</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

})(jQuery, _, M139, window._top || window.top);
