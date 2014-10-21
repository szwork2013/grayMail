
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Contact";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //当前控件的父容器jQuery对象
        container: null,

        model: null,

        //联系人集合
        contacts: null,

        //联系人最大选择数
        maxCount: 20,
        //控件宽度
        width: 458,
        /**
	     * 联系人选择控件
		 * @param {Object}  args.master //日历视图主控 (可选)
		 * @param {jQuery Object}  args.container  //控件所在容器
		 * @param {Number} args.width   //控件宽度 (可选)
         * @param {Number} args.maxCount  //可选联系人个数(可选)         
         * @param {Number} args.showFreeInfo  //是否显示短信套餐信息(可选)，默认为true
         * @param {Number} args.showTitle  //是否显示添加联系人标头(可选)， 默认为true
         * @param {Number} args.isOnly139  //是否仅能输入139邮箱地址(可选)，默认为false      
         * @param {Number} args.placeHolder  //输入框默认提示语(可选)    
		**/
        initialize: function (args) {
            var self = this;
            superClass.prototype.initialize.apply(self, arguments);

            args = args || {};
            self.container = args.container || $(document.body);
            self.master = args.master || window.$Cal;

            if (_.isNumber(args.width))
                self.width = args.width;

            if (_.isNumber(args.maxCount))
                self.maxCount = args.maxCount;

            if (args.placeHolder) {
                self.TIPS.PLACEHOLDER = args.placeHolder;
            }

            //给视图绑定数据模型
            self.model = new M2012.Calendar.Model.Contact({
                master: self.master
            });
            //给视图指定一个数据集合
            self.contacts = new M2012.Calendar.Collection.Contact();

            self.render();
            self.initEvents();
            self.initControls(args);
        },

        TIPS: {
            PLACEHOLDER: '请输入邮箱地址，多个地址以逗号“，”隔开',
            MSG_INVITE_MAX: '邀请人数已达到上限{count}人',
            EMAIL_EXIST: '该好友已被邀请过',
            EMAILS_EXIST: '以下好友已被邀请过:<br />{emails}',
            NOT_ALLOW_ADD_MYSELF: "暂不支持添加自己",
            SMS_ONLY_CHINA_MOBILE: "暂只支持向移动手机号及移动手机邮箱发送短信通知",
            ONLY_139_DOMAIN: "输入的邮箱地址必须是139邮箱地址"
        },

        initControls: function (args) {
            var self = this;
            //是否显示标题   
            if (_.isBoolean(args.showTitle)) {
                self.model.set({ showTitle: args.showTitle });
                //如果不显示标题则需要展示联系人添加区域
                if (!args.showTitle)
                    self.model.set({ canInvite: true });
            }
            //是否仅显示139邮箱联系人
            if (_.isBoolean(args.isOnly139)) {
                self.model.set({
                    isOnly139: args.isOnly139
                });
            }        
            //是否显示短信资费提示信息,默认显示
            var showFreeInfo = true;
            if (_.isBoolean(args.showFreeInfo))
                showFreeInfo = args.showFreeInfo;

            self.model.set({ showFreeInfo: showFreeInfo });
        },

        /**
		 *  初始化页面的监听事件
		**/
        initEvents: function () {
            var self = this;

            //监控Model数据变化
            self.model.on("change", function () {
                //是否展示联系人输入区域
                if (self.model.hasChanged("showTitle")) {
                    if (self.model.get("showTitle")) {
                        self.getElement("toggle").removeClass("hide");
                        self.getElement("inviteArea").addClass("tips").addClass("boxContact");
                        return;
                    }
                    self.getElement("toggle").addClass("hide");
                    self.getElement("inviteArea").removeClass("tips").removeClass("boxContact");
                    self.getElement("sms_freeInfo").find("p").css("padding-top", "10px");
                }
                    //是否显示联系人控件区域
                else if (self.model.hasChanged("canInvite")) {
                    if (self.model.get("canInvite")) {
                        self.getElement("toggle").find("span").text("-");
                        self.getElement("inviteArea").removeClass("hide");
                        return;
                    }
                    self.getElement("toggle").find("span").text("+");
                    self.getElement("inviteArea").addClass("hide");
                }
                    //是否显示联系人列表
                else if (self.model.hasChanged("hasContact")) {

                    if (self.model.get("hasContact")) {
                        self.getElement("list_container").removeClass("hide");
                        return;
                    }
                    self.getElement("list_container").addClass("hide");
                }
                    //短信套餐信息
                else if (self.model.hasChanged("freeInfo")) {

                    var value = self.model.get("freeInfo");
                    value = $T.Html.encode(value);
                    self.getElement("msg_info").html(value);
                }
                    //是否显示短信资费信息
                else if (self.model.hasChanged("showFreeInfo")) {

                    if (self.model.get("showFreeInfo")) {
                        self.getElement("sms_freeInfo").removeClass("hide");
                        return;
                    }
                    self.getElement("sms_freeInfo").addClass("hide");
                }
                    //是否显示邀请状态列信息
                else if (self.model.hasChanged("showStatus")) {

                    var container = self.getElement("list_container");
                    if (self.model.get("showStatus")) {
                        container.find("th.td6").removeClass("hide");
                        container.find("td.td6").removeClass("hide");
                        return;
                    }
                    container.find("th.td6").addClass("hide");
                    container.find("td.td6").addClass("hide");
                }
            });

            //监听新增联系人信息
            self.contacts.on("add", function (model, collection, args) {

                self.renderRow(model);
                //显示联系人列表
                self.model.set({ hasContact: true });

                //是否通知调用方
                var notify = true;
                if (args && _.isBoolean(args.notify))
                    notify = args.notify;

                if (notify)
                    self.notifyChanged();

                //监听删除联系人信息
            }).on("remove", function (model) {
                var express = "tr[mid='{0}']";
                express = $T.format(express, [model.cid]);
                self.getElement("tbody").find(express).remove();

                //如果联系人为空需要隐藏联系人列表
                if (self.contacts.length === 0)
                    self.model.set({ hasContact: false });

                self.notifyChanged();

                //监听更新联系人信息
            }).on("reset", function (model) {
                self.notifyChanged();
            });
        },

        /**
         *  数据变化后通知调用方        
         **/
        notifyChanged: function () {
            var self = this;
            var data = self.contacts.toArray();
            self.trigger("change", data);
        },

        /**
         *  呈现联系人信息数据行
         * @param {Object} model //联系人信息
         **/
        renderRow: function (model) {
            var self = this;
            var value = model.toJSON();

            if (!value)
                return;

            var data = {
                mid: model.cid,
                email: value.recEmail,
                name: $T.Html.encode(value.name) || value.recEmail,
                showStatus: self.model.get("showStatus") ? "" : "hide",
                statusDesc: self.model.getStatusDesc(value.status),
                checkEmail: (value.emailNotify == 1) ? "checked" : "",
                checkSms: (value.smsNotify == 1) ? "checked" : "",
                showReason: value.refuseResion ? "" : "hide",
                refuseResion: $T.Html.encode(value.refuseResion),
                smsDesc: value.recMobile ? "" : self.TIPS.SMS_ONLY_CHINA_MOBILE,
                smsEnable: value.recMobile ? "" : "disabled"
            };

            var row = $($T.format(self.template.item, data));
            self.getElement("tbody").append(row);
        },

        /**
		 *  呈现视图内容
		**/
        render: function () {
            var self = this;
            var html = $T.format(self.template.main, {
                cid: self.cid,
                width: self.width
            });
            self.$el.remove();
            self.container.append(html);

            //选择联系人按钮定位
            self.container.find("div.addPeople > a").css({
                left: self.width - 30
            });

            //自动联想邀请人,在m2012.ui.richinput.view.js中调用
            self.addrInputEl = M2012.UI.RichInput.create({
                container: self.getElement("input").get(0),
                preventAssociate: true,
                placeHolder: self.TIPS.PLACEHOLDER,
                type: "email",
                maxSend: function () {
                    return self.maxCount - self.contacts.length;
                },
                //联系人超过最大限制时弹出提示信息
                onMaxSend: function () {
                    var html = self.TIPS.MSG_INVITE_MAX;
                    html = $T.format(html, { count: self.maxCount });
                    self.addrInputEl.showAddressTips({
                        html: html
                    });
                },
                errorfun: function (obj, text) {
                    var email = $T.Email.getEmail(text);
                    if (!$Email.isEmailAddr(email))
                        return;

                    //邮箱地址转小写
                    email = email.toLowerCase();

                    //已经存在
                    if (self.contacts.isExist(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.EMAIL_EXIST;
                        return;
                    }

                    if (!self.model.checkIs139Mail(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.ONLY_139_DOMAIN;
                        return;
                    }
                    //是否是本人
                    if (self.model.isDefaultSender(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.NOT_ALLOW_ADD_MYSELF;
                        return;
                    }
                    //自动添加,setTimeout是因为清除email时，richinput还没执行完,
                    setTimeout(function () {
                        self.addContact(email);
                        self.addrInputEl.clear();
                    }, 100);
                }
            }).render();

            //显示/隐藏联系人区域
            self.getElement("toggle").click(function () {
                self.model.set({
                    canInvite: !self.model.get("canInvite")
                });
            });

            //弹出通讯录联系人选择框
            self.getElement("add_contact").click(function () {
                top.M2012.UI.Dialog.AddressBook.create({
                    filter: "email",
                    showSelfAddr: false,
                    maxCount: self.maxCount

                }).on("select", function (e) {
                    if (e && e.value && e.value.length > 0) {
                        $.each(e.value, function (i, n) {
                            var email = $T.Email.getEmail(n);
                            if (!$Email.isEmailAddr(email))
                                return true;

                            //邮箱地址转小写
                            email = email.toLowerCase();

                            //判断已经存在
                            if (self.contacts.isExist(email))
                                return true;

                            if (!self.model.checkIs139Mail(email))
                                return true;

                            if (self.model.isDefaultSender(email))
                                return true;

                            if (!self.addContact(email))
                                return false;

                            return true;
                        });
                    }

                }).on("additemmax", function () {
                    top.$Msg.alert($T.format(self.TIPS.MSG_INVITE_MAX, {
                        count: self.maxCount
                    }));

                });
            });

            //点击表格区域时的处理
            self.getElement("list_container").click(function (e) {
                var targetEl = $(e.target);
                var tagName = targetEl[0].tagName.toLowerCase();

                //点击了删除链接
                if (tagName === "a") {
                    var mid = targetEl.attr("mid");
                    if (mid) {
                        var model = self.contacts.get(mid);
                        model && self.contacts.remove(model);
                        return;
                    }
                    //邀请拒绝状态按钮点击
                    //如果有拒绝理由则显示相应提示
                    if (targetEl.attr("refuseResion")) {
                        self.showRefuseInfo(targetEl);
                    }
                }
                    //点击了提醒方式设置
                else if (tagName === "input") {
                    var mid = targetEl.attr("mid");
                    if (mid) {
                        var model = self.contacts.get(mid);
                        if (!model)
                            return;

                        var key = targetEl.attr("id").split("_")[1];
                        var data = {};
                        data[key] = targetEl[0].checked ? 1 : 0;
                        model.set(data);
                        self.contacts.reset(self.contacts.models);
                    }
                }
            });
        },

        /**
        *  添加联系人信息到集合
        *  @param {String}  email //是否显示联系人状态信息
        *  @param {Object}  options //新增设置选项, options.notify标示数据改变后是否通知调用方        
       **/
        addContact: function (email, options) {
            var self = this;
            if (self.contacts.length == self.maxCount) {
                top.$Msg.alert($T.format(self.TIPS.MSG_INVITE_MAX, {
                    count: self.maxCount
                }));
                return false;
            }
            var data = self.model.getContact(email);
            self.contacts.add(data, options);
            return true;
        },

        /**
         *  设置控件信息
         *  @param {Boolean}  args.showStatus //是否显示联系人状态信息
         *  @param {Array}  args.inviteInfo //联系人信息列表
        **/
        setData: function (args) {
            var self = this;
            if (!args)
                return;

            //显示邀请状态列表
            if (_.isBoolean(args.showStatus)) {
                self.model.set({ showStatus: args.showStatus });
            }

            //邀请信息
            if (_.isArray(args.contacts)) {
                $.each(args.contacts, function (i, n) {
                    self.addContact(n, {
                        notify: false
                    });
                });
                //设置是否有联系人
                if (self.contacts.length > 0) {
                    self.model.set({ canInvite: true });
                }
            }
        },

        /**
         * 获取已选择的联系人信息
        **/
        getData: function () {
            var self = this;
            return self.contacts.toArray();
        },

        /**
         * 点击查看拒绝详情图标,则弹出详情提示信息框
         * @param {jQuery Object}  el //目标元素
         **/
        showRefuseInfo: function (el) {
            var self = this;
            if (self.popTip) {
                self.popTip.close();
                self.popTip = null;
            }
            self.popTip = M139.UI.Popup.create({
                name: "tips_reject_reason",
                target: el,
                width: 150,
                closeClick: function () {
                    self.popTip = null;
                },
                direction: "up",
                content: $T.format(self.template.refuseResion, {
                    reason: el.attr("refuseResion")
                }) //这里可能存在二次转码
            });
            self.popTip.render();
        },

        /**
		 *  获取id以{cid}开头的html元素
		 *  @return {jQuery Object}   
		**/
        getElement: function (id) {
            var self = this;
            return $($T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            }));
        },

        /**
		 * HTML模版
		**/
        template: {
            main: ['<a href="javascript:void(0);" id="{cid}_toggle"><span class="widtac10">+</span> 添加其他参与人</a>',
					'<div id="{cid}_inviteArea" class="tips boxContact hide" style="position:relative;width:{width}px;">',
						//添加联系人
						'<div class="tips-text">',
							'<div class="tips-text-div">',
								'<fieldset>',
									'<ul style="border:0px;">',
										'<li>',
											'<div class="clearfix">',
												'<div class="addPeople" style="width:{width}px;">',
													'<div id="{cid}_input"></div>',
													'<a id="{cid}_add_contact" href="javascript:void(0);" style="z-index: 4;"></a>',
												'</div>',
											'</div>',
											 // 展开的联系人列表
											'<div id="{cid}_list_container" class="addPeopleMain hide">',
												'<table class="meetformtab" style="width:{width}px;">',
													'<thead>',
														'<tr>',
															'<th>参与人</th>',
															'<th class="td4">通知方式</th>',
															'<th class="td6 hide">状态</th>',
															'<th class="td5">操作</th>',
														'</tr>',
													'</thead>',
													'<tbody id="{cid}_tbody">',
													'</tbody>',
												'</table>',
											'</div>',
										'</li>',
										'<li id="{cid}_sms_freeInfo"  class="hide" >',
											'<p style="color: #999;">使用短信通知参与人，会产生短信费用。</p>',
											'<span id="{cid}_msg_info" style="color: #999;">本月赠30条，余30条，超出按0.1元/条计费。每天限发250条，每月限发2500条</span>',
										'</li>',
									'</ul>',
								'</fieldset>',
							'</div>',
						'</div>',
						'<div class="tipsTop diamond" style="left:35px;"></div>',
					'</div>'].join(""),

            item: ['<tr mid="{mid}">',
                        '<td style="word-break:break-all;" title="{email}">{name}</td>',
                        '<td class="td4">',
                            '<input id="{mid}_emailNotify" type="checkbox" mid="{mid}" {checkEmail} /><label for="{mid}_emailNotify" class="mr_10 ml_5">邮件</label>',
                            '<input id="{mid}_smsNotify" type="checkbox" mid="{mid}"   {checkSms} {smsEnable} title="{smsDesc}" /><label for="{mid}_smsNotify" title="{smsDesc}" class="ml_5">短信</label>',
                        '</td>',
                        '<td class="td6 {showStatus}">',
							'{statusDesc}<a href="javascript:void(0);" class="i_warn_min warnTips {showReason}" refuseResion="{refuseResion}"></a>',
						'</td>',
                        '<td class="td5"><a href="javascript:void(0);" mid="{mid}">删除</a></td>',
                    '</tr>'].join(""),
            refuseResion: '<p class="mr_5 mt_10" style="word-wrap:break-word; word-break:break-all;">{reason}</p>'
        }

    }));

}(jQuery, _, M139, window._top || window.top));