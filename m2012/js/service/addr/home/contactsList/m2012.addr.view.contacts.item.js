(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Item";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        tagName : "tr",

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#contact-item').html()),

        events : {
            "click div.Edit-link" : "editContactDetail", // 编辑联系人详情
            "mouseenter" : "enterView", // 鼠标移入联系人
            "mouseleave" : "leaveView", // 鼠标移出联系人
            "click input[:checkbox].toggle-contact" : "toggleContact" // 切换联系人选中状态
            // "click a.Send-email" : "quickSendEmail", // 快速发邮件
            // "click a.Send-SM" : "quickSendSM", // 快速发短信
            // "click a.Quick-edit" : "quickEditContact", // 快速编辑
            // "click a.Quick-del" : "quickDeleteContact", // 快速删除
            // "click a.Commit-edit" : "commitQuickEdit", // 提交快速编辑
            // "click a.Cancel-edit" : "cancelQuickEdit", // 取消快速编辑
            // "click input.ipt-edit" : "clickEditInput",
            // "blur input.ipt-edit" : "blurEditInput",
            // "focus input.ipt-edit" : "focusEditInput"
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.mSearch = options.mSearch;
            this.parentView = options.parentView;

            this.autoCommit = null;
            this.autoCommitted = null;

            this.model.on("change:selected", this.onSelectionToggled, this);
            this.model.on("change", this.render, this);
            this.model.on("render", this.render, this);
            this.model.on("destroy", this.remove, this);
        },

        /**
         * 切换联系人选中状态。
         *        当联系人选中时，退出编辑状态
         *
         * @param {Object} model
         */
        onSelectionToggled : function(model) {
            this.$el.toggleClass("Editing", false);

            var selected = this.model.get("selected");
            this.$el.toggleClass("on", selected);

            if (selected) {
                this.collection.addSelectedContacts([this.model.get("SerialId")]);
            } else {
                this.collection.removeSelectedContacts([this.model.get("SerialId")]);
            }

            this.parentView.checkPageSelected();

            // EventsAggr.Contacts.keyTrigger("CONTACT_TOGGLED", selected);
        },

        /**
         * 选择联系人checkbox元素的jQuery对象 
         */
        toggleContactElement : function() {
            return this.$("input[:checkbox].toggle-contact");
        },

        /**
         * 设置鼠标移上时样式
         *
         * @param {Object} ev
         */
        enterView : function(ev) {
            ev.preventDefault();
            this.$el.addClass("hover");
        },

        /**
         * 设置鼠标移出时样式
         *
         * @param {Object} ev
         */
        leaveView : function(ev) {
            ev.preventDefault();
            this.$el.removeClass("hover");
        },

        /**
         * 编辑联系人。
         *
         * @param {Object} ev
         */
        editContactDetail : function(ev) {
            ev.stopPropagation();

            top.BH("addr_contact_editDetail");

            $Addr.trigger('redirect', {
                key : 'addr_editContact',
                contactId : this.model.getId()
            });
        },

        /**
         * 切换联系人选择状态。
         *
         * @param {Object} ev
         */
        toggleContact : function(ev) {
            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            this.model.set("selected", checked);
        },

        /**
         * 渲染页面视图
         */
        render : function() {
            var _this = this;

            // 视图渲染参数
            var name = _this.model.get("name") || " ";
            // name = "<script>alert(1)</script>";
            var displayName = _this.htmlEncode(name);
            var displayEmail = _this.htmlEncode(_this.model.firstEmail() || " ");
            var displayMobile = _this.htmlEncode(_this.model.firstMobile() || " ");
            var tName = displayName;
            var tEmail = displayEmail;
             var tMobile = displayMobile;
            if (this.mSearch.isSearching()) {
                displayName = this.highlightKeyword(displayName);
                displayEmail = this.highlightKeyword(displayEmail);
                displayMobile = this.highlightKeyword(displayMobile);
            }
            var renderParams = {
                groups : [],
                tGroups : "",
                isVip : false,
                selected : _this.model.get("selected"),
                tName : tName,
                tEmail : tEmail,
                tMobile : tMobile,
                displayName : displayName,
                displayEmail : displayEmail,
                displayMobile : displayMobile
            };

            // 获取联系人分组和vip标识
            var contactId = this.model.getId();
            var contactGroups = _GCMapCache.getContactGroups(contactId);
            if (contactGroups) {
                _.each(contactGroups, function(group) {
                    if (group.GroupId == _DataBuilder.vipGroupId()) {
                        renderParams.isVip = true;
                    } else {
                        // 不在分组中显示vip组名
                        renderParams.groups.push(top.$T.Utils.htmlEncode(group.GroupName));
                    }
                });
                renderParams.tGroups = renderParams.groups.join("、");
            }

            this.$el.html(this.template(renderParams));

            // 设置联系人的选中样式
            this.$el.toggleClass("on", this.model.get("selected"));

            return this;
        },

        /**
         * 高亮显示搜索关键字 
         */
        highlightKeyword : function(text) {
            var hightText = "<mark>$1</mark>";
            var keyword = this.htmlEncode(this.mSearch.get("keyword"));
            keyword = keyword.replace(/([\!\\\~\$\^\&\*\(\)\-\+\?\[\]\.])/g, "[\\$1]");
            var regExp = new RegExp("(" + keyword + ")", "ig");
            return text.replace(regExp, hightText);
        },

        /**
         * 对文本html编码 
         */
        htmlEncode : function(text) {
            return top.M139.Text.Html.encode(text);
        },

        /**
         * 快速发邮件
         *
         * @param {Object} ev
         */
        quickSendEmail : function(ev) {
            top.BH("addr_contact_sendMail");

            var contactId = this.model.getId();

            $Addr.trigger('loadmodule', {
                key : 'contact:sendMail',
                data : {
                    sids : [contactId]
                }
            });
        },

        /**
         * 快速发短信。
         *
         * @param {Object} ev
         */
        quickSendSM : function(ev) {
            top.BH("addr_contact_sendSM");

            var contactId = this.model.getId();
            $Addr.trigger('loadmodule', {
                key : 'contact:sendSMS',
                data : {
                    sids : [contactId]
                }
            });
            // EventsAggr.Contacts.keyTrigger("SEND_SM", [contactId]);
        },

        /**
         * 快速编辑联系人
         *
         * @param {Object} ev
         */
        quickEditContact : function(ev) {
            ev.preventDefault();

            top.BH("addr_contact_quickDelete");

            this.startEditMode();
            var $row = this.$el;
            $row.find("input.Name").val(this.model.get("name")).focus();
            $row.find("input.Email").val(this.model.firstEmail());
            $row.find("input.Mobile").val(this.model.firstMobile());
        },

        /**
         * 进入编辑模式 
         */
        startEditMode : function(selectable) {
            this.$el.addClass("Editing");
            this.toggleContactElement().prop("disabled", true);
            // $("#toggle-page-contacts").prop("disabled", true);
            this.autoCommitted = false;
        },

        /**
         * 退出编辑模式 
         */
        quitEditMode : function(selectable) {
            this.$el.removeClass("Editing");
            this.toggleContactElement().prop("disabled", false);
            // $("#toggle-page-contacts").prop("disabled", false);
        },

        /**
         * 取消快速编辑
         *
         * @param {Object} ev
         */
        cancelQuickEdit : function(ev) {
            ev.preventDefault();

            this.autoCommit = false;
            this.quitEditMode();
        },

        /**
         * 提交快速编辑
         *
         *  @param {Object} ev
         */
        commitQuickEdit : function(ev) {
            _Log("[debug] - disable autoCommit");
            this.autoCommit = false;
            if (ev) {
                ev.preventDefault();
            }

            var $row = this.$el;
            var inputName = $.trim($row.find("input.Name").val());
            var name = this.model.get("name");
            var inputEmail = $.trim($row.find("input.Email").val());
            var email = this.model.firstEmail();
            var inputMobile = $.trim($row.find("input.Mobile").val());
            var mobile = this.model.firstMobile();
            if (inputName == name && inputEmail == email && inputMobile == mobile) {
                // no change
                this.quitEditMode();
                return;
            }

            var checkInputMsg = this.checkQuickEditInput(inputName, inputEmail, inputMobile);
            if (checkInputMsg) {
                top.$Msg.alert(checkInputMsg);
                this.quitEditMode();
                return;
            }

            _ShowTipMsg('联系人更新中...');
            this.updateContact({
                'contactId' : this.model.getId(),
                'name' : inputName,
                'email' : inputEmail,
                'mobile' : inputMobile
            });
        },

        /**
         * 更新联系人信息。
         *
         * @param {Object} param
         */
        updateContact : function(param) {
            var _this = this;
            //contactId, name, email, mobile
            var contactId = param.contactId;
            top.Contacts.getContactsInfoById(contactId, function(result) {
                if (!result.success) {
                    _HideTipMsg();
                    _AlertMsg(result.msg);
                    return;
                }

                var contactInfo = new top.ContactsInfo(result.contactsInfo);
                doUpdate(contactInfo);
            });

            function isEmpty(s) {
                return !s || s.length == 0 || $.trim(s).length == 0;
            }

            function buildContact(contact) {
                contact.AddrFirstName = param.name;

                //由于列表上优先显示FamilyEmail，所以可以先判商业邮箱为空
                //来确定用户需要修改FamilyEmail，否则FamilyEmail也空时就
                //更新BusinessEmail，都不是则更新FamilyEmail，置空OtherEmail
                // TODO note by yuanhb: email3 and mobile3 should be removed.
                var email1 = contact.FamilyEmail, email2 = contact.BusinessEmail, email3 = contact.OtherEmail, mobile1 = contact.MobilePhone, mobile2 = contact.BusinessMobile, mobile3 = contact.OtherMobile;

                if (isEmpty(email2)) {
                    email1 = param.email;
                } else if (isEmpty(email1)) {
                    email2 = param.email;
                } else {
                    email1 = param.email;
                }

                contact.FamilyEmail = email1;
                contact.BusinessEmail = email2;
                contact.OtherEmail = email3;

                if (isEmpty(mobile2)) {
                    mobile1 = param.mobile;
                } else if (isEmpty(mobile1)) {
                    mobile2 = param.mobile;
                } else {
                    mobile1 = param.mobile;
                }

                contact.MobilePhone = mobile1;
                contact.BusinessMobile = mobile2;
                contact.OtherMobile = mobile3;

                return contact;
            }

            function updateVipMail() {
                // TODO no top.Main.searchVipEmailCount, may I remove this code?
                if (top.Main.searchVipEmailCount) {
                    top.Main.searchVipEmailCount();
                }
            }

            function quickEditSuccess() {
                _ShowTipMsg('保存成功', {
                    delay : 1000
                });

                var $row = _this.$el;
                _this.quitEditMode();

                // update model data and render view.
                _this.model.set(top.Contacts.data.ContactsMap[contactId], {
                    silent : true
                });
                _this.model.trigger("render");

                if (top.Contacts.IsVipUser(contactId)) {//更新VIP邮件
                    top.Contacts.updateCache("editVipContacts", param.contactId);
                    updateVipMail();
                }
            }

            function doUpdate(contactInfo) {
                _Log("do update");
                var contact = buildContact(contactInfo);

                top.Contacts.ModContactsField(contactId, contact, false, function(result) {
                    if (result.resultCode == '0') {
                        quickEditSuccess();
                        return true;
                    } else if (result.resultCode == "226" || result.resultCode == "224") {//重复
                        // TODO test
                        var DetailMsg = ADDR_I18N[ADDR_I18N.LocalName]["detail"];
                        var msg = result.resultCode == "226" ? DetailMsg.warn_emailRepeat : DetailMsg.warn_mobileRepeat;
                        _Log("repeat");
                        var popup = top.$Msg.confirm(msg, function() {
                            popup.close();
                            top.Contacts.ModContactsField(contactId, contact, true, function(result) {
                                if (result.resultCode == '0') {
                                    var master = window.$Addr;
                                    if (master) {
                                        master.trigger(master.EVENTS.LOAD_MODULE, {
                                            key : 'remind:getMergeData'
                                        });
                                    }
                                    quickEditSuccess();
                                    return true;
                                } else {
                                    _HideTipMsg();
                                    _AlertMsg(result.msg);
                                    _this.quitEditMode();
                                }
                            });
                        }, function() {
                            popup.close();
                            _HideTipMsg();
                            _this.quitEditMode();
                        });
                    } else {
                        _HideTipMsg();
                        _AlertMsg(result.msg);
                        _this.quitEditMode();
                    }
                });
            }

        },

        /**
         * 验证快速编辑联系人信息
         *
         * @param {Object} name
         * @param {Object} email
         * @param {Object} mobile
         */
        checkQuickEditInput : function(name, email, mobile) {
            var errMsg = "";
            if (!name) {
                errMsg = "请输入姓名";
                return errMsg;
            } else if (name.getByteCount() > 100) {
                errMsg = top.frameworkMessage['warn_contactNameToolong'];
                return errMsg;
            }

            if (email) {
                var lenEmail = email.length;
                if (lenEmail < 6 || lenEmail > 90) {
                    errMsg = "邮件地址长度不正确(6-90位)";
                    return errMsg;
                } else if (!top.Validate.test("email", email)) {
                    errMsg = "邮件地址格式不正确";
                    return errMsg;
                }
            }

            if (mobile) {
                if (mobile.getByteCount() > 100) {
                    errMsg = top.frameworkMessage['warn_contactMobileToolong'];
                    return errMsg;
                } else if (!top.Validate.test("mobile", mobile)) {
                    errMsg = "手机号格式不正确";
                    return errMsg;
                }
            }

            if (!email && !mobile) {
                errMsg = "手机号码和邮件地址请至少填写一项!";
                return errMsg;
            }

            return errMsg;
        },

        /**
         * 快速删除联系人
         *
         * @param {Object} ev
         */
        quickDeleteContact : function(ev) {
            var contactId = this.model.getId();
            $Addr.trigger('loadmodule', {
                key : 'contact:remove',
                data : {
                    sids : [contactId]
                }
            });
        },

        /**
         * 设置焦点，兼容chrome不自动设置焦点的问题 
         */
        clickEditInput : function(ev) {
            ev.stopPropagation();
            $(ev.target).focus();
        },

        /**
         * form编辑元素失去焦点 
         */
        blurEditInput : function(ev) {
            _Log("[debug] - blur " + $(ev.currentTarget).html());
            this.autoCommit = true;
            this.delayCommitQuickEdit(100);
        },

        /**
         * form编辑元素获取焦点 
         */
        focusEditInput : function(ev) {
            _Log("foucs");
            this.autoCommit = false;
        },

        /**
         * 延迟提交编辑联系人。如果用户下一次点击该联系人的表单编辑元素，则中断提交。
         */
        delayCommitQuickEdit : function(delayTime) {
            var _this = this;
            setTimeout(function() {
                _Log("[debug] - autoCommit:" + _this.autoCommit + "/Committed:" + _this.autoCommitted);
                if (_this.autoCommit && !_this.autoCommitted) {
                    _this.commitQuickEdit();
                    _this.autoCommitted = true;
                }
            }, delayTime);
        },

        /**
         * 销毁视图
         */
        remove : function() {
            _Log("remove contacts item view");
            superClass.prototype.remove.apply(this, arguments);
        }
    }));

})(jQuery, _, M139);
