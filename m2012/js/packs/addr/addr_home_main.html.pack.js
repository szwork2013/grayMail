(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        idAttribute : "SerialId",

        defaults : {
            selected : false
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
            this.set(contact);
            this.set("id", contact.SerialId);
        },

        getId : function() {
            return this.get("SerialId");
        },

        select : function() {
            this.set("selected", true);
        },

        isSelected : function() {
            return this.get("selected");
        },

        unselect : function() {
            this.set("selected", false);
        },

        hasInitialLetter : function(initialLetter) {
            var mInitialLetter = this.get("FirstNameword");
            return mInitialLetter && (mInitialLetter == initialLetter);
        },

        firstEmail : function() {
            var emails = this.get("emails");
            return emails && emails[0] ? emails[0] : "";
        },

        firstMobile : function() {
            var mobiles = this.get("mobiles");
            return mobiles && mobiles[0] ? mobiles[0] : "";
        },

        search : function(keyword) {
            var _this = this;
            var searchFields = ["name", "emails", "mobiles", "faxes", "Quanpin", "Jianpin", "UserJob", "CPName"];
            var arraySearchText = [];
            _.each(searchFields, function(field) {
                var value = _this.get(field);
                if (value) {
                    arraySearchText.push(value);
                }
            });

            var searchText = arraySearchText.join(",");
            return searchText.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        },

        destroy : function() {
            _Log("contacts item model destroy " + this.get("name") + this.get("SerialId"));
            this.trigger("destroy", this);
            // 注销所有监听的事件
            this.off();
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.Addr.Collection.Contacts.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.Addr.Model.Contacts.Item,

        selectedMap : {},

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        listenBroadcastEvents : function() {
            EventsAggr.Contacts.keyOn("DELETE_CONTACTS", this.deleteContacts, this);
        },

        addSelectedContacts : function(contactsId) {
            var _this = this;
            _.each(contactsId, function(contactId) {
                _this.selectedMap[contactId] = true;
            });
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        removeSelectedContacts : function(contactsId) {
            var _this = this;
            _.each(contactsId, function(contactId) {
                delete _this.selectedMap[contactId];
            });
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        cleanSelectedContacts : function() {
            this.selectedMap = {};
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        getSelectedContactsNum : function() {
            return _.keys(this.selectedMap).length;
        },

        deleteContacts : function(data, options) {
            _Log("delete Contacts");
            var _this = this;

            var contactsId = data.contactsId;
            _.each(contactsId, function(contactId) {
                var contact = _this.get(contactId);
                if (contact) {
                    if (contact.isSelected()) {
                        EventsAggr.Contacts.keyTrigger("CONTACT_TOGGLED", false);
                    }
                    contact.destroy();
                    _this.remove(contact);
                }
            });

            EventsAggr.Contacts.keyTrigger("CONTACTS_DELETED", data, options);
        },

        selected : function() {
            var contactsCache = this.getContactsCache();
            var selectedIds = this.selectedIds();
            return contactsCache.getContacts(selectedIds);
        },

        selectedIds : function() {
            return _.keys(this.selectedMap);
        },

        getSelectedMap : function() {
            return this.selectedMap;
        },

        isSelected : function(contactId) {
            return this.selectedMap[contactId] || false;
        },

        selectAll : function() {
            this.each(function(model) {
                model.select();
            });
        },

        unselectAll : function() {
            this.cleanSelectedContacts();
        },

        /**
         * 按照名称排序联系人
         *
         * @param {Object} order 1 : asc, -1: desc
         */
        sortByName : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == -1) {
                return contacts.reverse();
            } else {
                return contacts;
            }
        },

        /**
         * 按照邮件排序联系人
         *
         * @param {Object} order
         */
        sortByEmail : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == 0) {
                return contacts;
            }

            contacts.sort(function(a, b) {
                if (!a.getFirstEmail() && b.getFirstEmail()) {
                    return 1;
                }
                if (a.getFirstEmail() && !b.getFirstEmail()) {
                    return -1;
                }
                if (!a.getFirstEmail() && !b.getFirstEmail()) {
                    return 0;
                }
                return a.getFirstEmail().localeCompare(b.getFirstEmail()) * order;
            });

            var breakIndex = -1;
            for (var i = contacts.length - 1; i >= 0; i--) {
                if (contacts[i].getFirstEmail() != "") {
                    break;
                } else {
                    breakIndex = i;
                }
            }
            if (breakIndex > -1) {//邮件为空的部分-按姓名排序
                var sortByEmail = contacts.slice(0, breakIndex);
                var sortByName = contacts.slice(breakIndex, contacts.length);
                sortByName.sort(function(a, b) {
                    return b.name.localeCompare(a.name);
                });
                contacts = [];
                contacts = sortByEmail.concat(sortByName);
            }

            return contacts;
        },

        /**
         *  按照手机排序联系人
         *
         * @param {Object} order
         */
        sortByMobile : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == 0) {
                return contacts;
            }

            contacts.sort(function(a, b) {
                if (!a.getFirstMobile() && b.getFirstMobile()) {
                    return 1;
                }
                if (a.getFirstMobile() && !b.getFirstMobile()) {
                    return -1;
                }
                if (!a.getFirstMobile() && !b.getFirstMobile()) {
                    return 0;
                }
                return a.getFirstMobile().localeCompare(b.getFirstMobile()) * order;
            });

            var breakIndex = -1;
            for (var i = contacts.length - 1; i >= 0; i--) {
                if (contacts[i].getFirstMobile() != "") {
                    break;
                } else {
                    breakIndex = i;
                }
            }
            if (breakIndex > -1) {//手机为空的部分-按姓名排序
                var sortByMobile = contacts.slice(0, breakIndex);
                var sortByName = contacts.slice(breakIndex, contacts.length);
                sortByName.sort(function(a, b) {
                    return b.name.localeCompare(a.name);
                });
                contacts = [];
                contacts = sortByMobile.concat(sortByName);
            }

            return contacts;
        },

        /**
         * 按照首字母过滤联系人
         *
         * @param {Object} initialLetter
         */
        filterByInitialLetter : function(srcContacts, initialLetter) {
            var _this = this;
            var contacts = _.clone(srcContacts);
            var result = null;
            if (initialLetter === "all") {
                result = contacts;
            } else {
                result = _.filter(contacts, function(contact) {
                    var contactInitLetter = contact.FirstNameword;
                    return contactInitLetter && contactInitLetter.toLowerCase() == initialLetter;
                });
            }
            return result;
        },

        /**
         * 按照组过滤联系人
         *
         * @param {Object} groupId
         */
        filterByGroup : function(groupId) {
            var result = null;
            var contactsCache = this.getContactsCache();
            var group = _Groups.get(groupId);
            if (group.isAllContactsGroup()) {
                result = contactsCache.getAllContacts();
            } else if (group.isNoGroup()) {
                result = contactsCache.getNoGroupContacts();
            } else {
                result = _GCMapCache.getGroupContacts(groupId);
            }
            return result;
        },

        search : function(srcContacts, keyword) {
            var _this = this;
            return _.filter(srcContacts, function(contact) {
                return _this.searchContact(contact, keyword);
            });
        },

        searchContact : function(contact, keyword) {
            var searchFields = ["name", "emails", "mobiles", "faxes", "Quanpin", "Jianpin", "UserJob", "CPName"];
            var arraySearchText = [];
            _.each(searchFields, function(field) {
                var value = contact[field];
                if (value) {
                    arraySearchText.push(value);
                }
            });

            var searchText = arraySearchText.join(",");
            return searchText.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        },

        /**
         * 联系人分页
         *
         * @param {Object} pageIndex
         * @param {Object} pageSize
         */
        page : function(srcContacts, pageIndex, pageSize) {
            var intPageIndex = parseInt(pageIndex);
            var intPageSize = parseInt(pageSize);
            var iStart = (intPageIndex - 1) * intPageSize;
            var iEnd = iStart + intPageSize;
            var max = srcContacts.length;
            iEnd = iEnd > max ? max : iEnd;
            // return this.slice(iStart, iEnd); // not supported by this backbone version

            return srcContacts.slice(iStart, iEnd);
        },

        getContactsCache : function() {
            //return _DataBuilder.buildAllContacts2();
            return _ContactsCache;
        }
    }));

})(jQuery, _, M139);

﻿(function($, _, M) {

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

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-list",

        logger : new M139.Logger({
            name : _class
        }),

        renderFrozen : false, // 绘制页面render的开关 true:冻结render,false:解冻render

        // emptyGroupContactsTemplate : _.template($('#tpl-group-no-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            // 无联系人时的消息显示区
            _this.$msgPanel = $("#contacts-list-msg");
            // 联系人显示区
            _this.$listContainer = $("#contacts-list-container");

            // 首字母过滤
            _this.mInitialLetterFilter = options.mInitialLetterFilter;
            _this.mInitialLetterFilter.on("change:initialLetter", _this.onFilterInitialLetterChanged, _this);

            // 跨页选择
            _this.mSelector = options.mSelector;
            _this.collection.on("change:selected", _this.onToggleContactSelect, _this);
            // 取消选择
            EventsAggr.Contacts.keyOn("UNSELECT_ALL", _this.onAllContactsUnselected, _this);
            // 当页全选择
            EventsAggr.Contacts.keyOn("SELECT_PAGE", _this.onSelectPageContacts, _this);
            // 当页取消选择
            EventsAggr.Contacts.keyOn("UNSELECT_PAGE", _this.onUnselectPageContacts, _this);

            // 排序
            _this.mSort = options.mSort;
            _this.mSort.on("change", _this.onContactsSort, _this);

            // 搜索
            _this.mSearch = options.mSearch;
            _this.mSearch.on("change:keyword", _this.onContactsSearch, _this);

            // 分页
            _this.mPaging = options.mPaging;
            _this.mPaging.on("change:pageIndex change:pageSize", _this.onPaged, _this);

            // 拖拽
            _this.mDragdrop = options.mDragdrop;
            _this.dragdropView = new M2012.Addr.View.Dragdrop({
                model : _this.mDragdrop,
                dragStartView : _this
            });
            _this.dragdropView.makeDragable();

            _this.itemModels = {};

            // 选择组时，刷新联系人列表
            EventsAggr.Groups.keyOn("GROUP_SELECTED", _this.onGroupSelected, _this);

            // 联系人C/(R)/U/D
            _EA_C.keyOn("CONTACT_ADDED", _this.onContactAdded, _this);
            _EA_C.keyOn("CONTACT_EDITED", _this.onContactEdited, _this);
            _EA_C.keyOn("CONTACTS_DELETED", _this.onContactsDeleted, _this);

            _EA_C.keyOn("GROUP_MOVED_TO", _this.onContactsMovedToGroup, _this);
            _EA_C.keyOn("GROUP_COPIED_TO", _this.onContactsCopiedToGroup, _this);

            // 导入联系人
            _EA_C.keyOn("CONTACTS_IMPORTED", _this.onContactsImported, _this);
            // 合并联系人
            _EA_C.keyOn("CONTACTS_MERGED", _this.onContactsMerged, _this);
            // 更新联系人
            _EA_C.keyOn("CONTACTS_SYNED", _this.onContactsSyned, _this);

            // 重设列表区高度
            _EA_C.keyOn("RESET_CONTACTS_LIST_HEIGHT", _this.setContactsListHeight, _this);
            
            // 刷新联系人列表
            _EA_C.keyOn("RENDER_CONTACTS", _this.renderContacts, _this);

            // 页面窗口大小调整时，重设列表区高度
            $(window).resize(function() {
                _this.setContactsListHeight();
            });
        },
        
        /**
         *  移动联系人到组后，刷新列表
         */
        onContactsMovedToGroup : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("MC2G")) {
                // TODO move groups-operating to groups-view
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }

        },

        /**
         *  复制联系人到组后，刷新列表
         */
        onContactsCopiedToGroup : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CC2G")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }
        },

        /**
         * 保持现有的分页，重绘联系人列表 
         */
        keepPageRender : function() {
            var forceFrozen = this.isRenderFrozen();
            this.renderFrozen = true;

            this.setGroupedContacts();

            var totalRecords = this.filteredContacts.length;

            this.mPaging.set("totalRecords", this.filteredContacts.length);
            var maxIndex = this.mPaging.get("maxIndex");
            var pageIndex = this.mPaging.get("pageIndex");
            if (pageIndex > maxIndex) {
                this.mPaging.set("pageIndex", maxIndex);
            }

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 重绘联系人列表。
         */
        renderContacts : function(data, options) {
            var rgc = options && options.renderGC;
            var keepPageRender = [_CFG.getRenderGC("DC"), _CFG.getRenderGC("CC2G"), _CFG.getRenderGC("MC2G")];
            if (rgc && _.contains(keepPageRender, rgc)) {
                this.keepPageRender();
            } else {
                this.render();
            }
        },

        /**
         * 添加联系人后，刷新联系人列表。 
         */
        onContactAdded : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CC")) {
                var groupId = _Groups.selectedGroupId();
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            } else if (rgc == _CFG.getRenderGC("CC_Silent")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
            }
        },
        
       /**
         * 编辑联系人后，刷新联系人列表。 
         */
        onContactEdited : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("UC")) {
                var groupId = _Groups.selectedGroupId();
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            }
        },

       /**
         * 删除联系人后，刷新联系人列表。 
         */
        onContactsDeleted : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("DC")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                // 初始化搜索状态
                if (this.mSearch.isSearchCompleted()) {
                    this.mSearch.resetSearchStatus();
                    if (data && data.contactsId && data.contactsId.length > 0) {
                        this.mSearch.set("totalRecords", this.mSearch.get("totalRecords") - data.contactsId.length);
                    }
                }
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }
            this.collection.removeSelectedContacts(data.contactsId);
        },

        /**
         * 计算并设置联系人列表高度 
         */
        setContactsListHeight : function() {
            // 动态计算列表区的高度
            var $rootPanel = $("#m139-contacts-list");
            var $target = $rootPanel.find(".addr-list");

            // 搜索头部区高度
            var $searchTitle = $rootPanel.find("#contacts-search-title");
            var searchTitleHeight = $searchTitle.is(":visible") ? $searchTitle.height() : 0;
            // 工具栏区高度
            var toolbarHeight = $rootPanel.find("div.addr-btngroup").height();
            // 首字母过滤区高度
            var initLetterHeight = $rootPanel.find("#initial-letter-filter").height();
            // 联系人列表头高度
            var contactsHeaderHeight = $rootPanel.find("#contacts-header").height();

            // 页面固定占用的高度
            var fixedHeight = searchTitleHeight + toolbarHeight + initLetterHeight + contactsHeaderHeight + 30;

            var windowHeight = $(window).height();
            $target.height(windowHeight - fixedHeight);

            // 判断是否有滚动条。如果有，调整联系人列表样式
            var lastScrollTop = $target.scrollTop();
            if (lastScrollTop == 0) {
                $target.scrollTop(1);
            }
            if ($target.scrollTop() > 0) {
                $target.removeClass().addClass("addr-list bgPadding_left");
                $target.scrollTop(lastScrollTop);
            } else if ($target.scrollTop() == 0) {
                $target.removeClass().addClass("addr-list bgPadding");
            }
        },

        render : function() {
            var _this = this;

            var allow = _this.isRenderFrozen() ? "X" : "O";
            _Log(allow + " --- render contacts list");

            if (_this.isRenderFrozen()) {
                return _this;
            }

            _this.$el.empty();

            var listToRender = _this.listToRender();
            if (listToRender.length == 0) {// 列表区没有联系人的情况
                var selectedGroup = _Groups.selectedGroup();
                var noContactsView = null;
                if (_this.mInitialLetterFilter.isFiltering()) {
                    noContactsView = new M2012.Addr.View.Contacts.NoFilterContacts().render();
                } else {
                    if (selectedGroup.isAllContactsGroup()) {// 所有联系人
                        if (_this.mSearch.isSearching()) {
                            noContactsView = new M2012.Addr.View.Contacts.NoSearchContacts().render();
                        } else {
                            noContactsView = new M2012.Addr.View.Contacts.NoContacts().render();
                        }
                    } else if (selectedGroup.isVipGroup()) {// vip联系人
                        noContactsView = new M2012.Addr.View.Contacts.NoVipContacts().render();
                    } else {// 自定义联系人
                        noContactsView = new M2012.Addr.View.Contacts.NoGroupContacts().render();
                    }
                    EventsAggr.Contacts.keyTrigger("NO_CONTACTS_RENDER");
                }
                _this.$msgPanel.html(noContactsView.el);

                _this.$msgPanel.show();
                _this.$listContainer.hide();
            } else {// 列表区有联系人
                EventsAggr.Contacts.keyTrigger("CONTACTS_RENDERED");

                _this.checkPageSelected();

                var itemModels = _this.itemModels = {};
                _.each(listToRender, function(contact) {
                    var contactId = contact.SerialId;
                    var model = new M2012.Addr.Model.Contacts.Item(contact);
                    var selected = _this.collection.isSelected(model.get("SerialId"));
                    model.set("selected", selected, {
                        silent : true
                    });
                    itemModels[contactId] = model;
                    var itemView = new M2012.Addr.View.Contacts.Item({
                        model : model,
                        collection : _this.collection,
                        id : "contact-" + contactId,
                        mSearch : _this.mSearch,
                        dragdropView : _this.dragdropView,
                        parentView : _this
                    });
                    _this.$el.append(itemView.render().el);
                });

                _this.$msgPanel.hide();
                _this.$msgPanel.empty();
                _this.$listContainer.show();

                _this.setContactsListHeight();
            }

            return _this;
        },

        /**
         * 选择/取消联系人切换
         */
        onToggleContactSelect : function() {
            this.checkPageSelected();
        },

        /**
         *  检查当页联系人是否已经全部选中
         */
        checkPageSelected : function() {
            var cdm = this.collectionDataManager();
            var pageSelected = _.every(this.pagedContacts, function(contact) {
                return cdm.isSelected(contact.SerialId);
            });

            this.mSelector.set("pageSelected", pageSelected);
        },

        onContactsImported : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        onContactsMerged : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        onContactsSyned : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        /**
         * 取消选择全部选中的联系人
         */
        onAllContactsUnselected : function() {
            var _this = this;
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (_this.collection.isSelected(contactId)) {
                    _this.itemModels[contactId].set("selected", false);
                }
            });

            this.collection.cleanSelectedContacts();
            this.mSelector.set({
                selectedNum : 0,
                pageSelected : false
            });
        },

        /**
         * 选择整页联系人
         */
        onSelectPageContacts : function() {
            var _this = this;
            var contactsToSelect = [];
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (!_this.collection.isSelected(contactId)) {
                    contactsToSelect.push(contactId);
                    _this.itemModels[contactId].set("selected", true);
                }
            });
            this.mSelector.set({
                pageSelected : true
            });
        },

        /**
         * 取消选择整页联系人
         */
        onUnselectPageContacts : function() {
            var _this = this;
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (_this.collection.isSelected(contactId)) {
                    _this.itemModels[contactId].set("selected", false);
                }
            });
            this.mSelector.set({
                pageSelected : false
            });
        },

        /**
         * 显示组联系人
         *
         * @param {Object} groupId
         */
        onGroupSelected : function(data, options) {
            this.renderFrozen = true;

            // 显示主列表区
            var showMain = (options && options.showMain) || false;
            if (showMain && window.$Addr) {
                var master = window.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }

            // 取消选择联系人
            this.collection.unselectAll();
            // 初始化搜索状态
            if (this.mSearch.isSearchCompleted()) {
                this.mSearch.resetSearchStatus();
            }
            // 首字母初始化
            this.mInitialLetterFilter.set("initialLetter", "all");
            // 分页初始化
            this.mPaging.set("pageIndex", 1);
            // 排序初始化
            this.mSort.resetAll();
            this.mSort.set("name", 1);
            // 设置组联系人
            this.setGroupedContacts();
            // 设置组联系人数量
            var totalRecords = this.groupedContacts.length;
            this.mPaging.set("totalRecords", totalRecords);

            this.mSelector.set({
                selectedNum : 0,
                pageSelected : false,
                totalRecords : totalRecords
            });

            this.renderFrozen = false;
            this.render();
        },

        /**
         * 搜索联系人
         */
        onContactsSearch : function() {
            if (window.$Addr) {
                var master = window.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);

                //强制回到通讯录联系人首页
                master.GomModel.set({mainState: 'contacts'});
            }

            var keyword = this.mSearch.get("keyword");
            // _Log("searching " + keyword); // This code won't work when debugging in Browser console mode.

            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mSearch.setSearchingStatus();
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _CFG.getAllContactsGid()
            });
            // setSearchedContacts();

            // 设置搜索的联系人数量
            var totalRecords = this.searchedContacts.length;
            this.mPaging.set("totalRecords", totalRecords);
            // 设置联系人选择区
            this.mSelector.set("totalRecords", totalRecords);
            this.mSearch.set("totalRecords", totalRecords);

            this.renderFrozen = forceFrozen;
            this.render();
            this.mSearch.setSearchCompleted();

            top.BH("addr_contacts_searchSucceed");
        },

        /**
         * 按照首字母过滤联系人
         *
         * @param {Object} model
         */
        onFilterInitialLetterChanged : function(model) {
            // forzen by parent caller.
            // if forceFrozen = true, means the parent handler wanna render the list by itself.
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mPaging.set("pageIndex", 1);
            this.setFilteredContacts();
            this.mPaging.set("totalRecords", this.filteredContacts.length);

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 联系人排序
         *
         * @param {Object} model
         */
        onContactsSort : function(model) {
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mPaging.set("pageIndex", 1);
            this.setSortedContacts();

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 是否冻结页面render操作
         */
        isRenderFrozen : function() {
            return this.renderFrozen || false;
        },

        /**
         * 联系人分页。
         *
         * @param {Object} pageIndex
         * @param {Object} pageSize
         */
        onPaged : function(pageIndex, pageSize) {
            _Log("paging..." + _.keys(this.mPaging.toJSON()) + "/" + _.values(this.mPaging.toJSON()));
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.setPagedContacts();
            // this.checkPageSelected();

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 获取联系人列表区需要显示的联系人
         */
        listToRender : function() {
            return this.pagedContacts;
        },

        collectionDataManager : function() {
            return this.collection;
        },

        /**
         * 联系人按组过滤
         */
        setGroupedContacts : function() {
            var cdm = this.collectionDataManager();

            var groupId = _Groups.selectedGroupId();
            this.groupedContacts = cdm.filterByGroup(groupId);

            this.setSearchedContacts();
        },

        setSearchedContacts : function() {
            var cdm = this.collectionDataManager();
            if (this.mSearch.isSearching()) {
                var listToSearch = this.groupedContacts;
                var keyword = this.mSearch.get("keyword");
                this.searchedContacts = cdm.search(listToSearch, keyword);
            } else {
                this.searchedContacts = _.clone(this.groupedContacts);
            }

            this.setFilteredContacts();
        },

        /**
         * 联系人按照首字母过滤
         */
        setFilteredContacts : function() {
            var cdm = this.collectionDataManager();
            var listToFilter = this.searchedContacts;

            var initialLetter = this.mInitialLetterFilter.get("initialLetter");
            this.filteredContacts = cdm.filterByInitialLetter(listToFilter, initialLetter);

            this.setSortedContacts();
        },

        /**
         *  联系人排序
         */
        setSortedContacts : function() {
            var cdm = this.collectionDataManager();
            var listToSort = this.filteredContacts;

            if (!listToSort) {
                return;
            }

            var sortedContacts = listToSort;
            var nameSort = this.mSort.get("name");
            if (nameSort != 0) {
                sortedContacts = cdm.sortByName(listToSort, nameSort);
            }
            var emailSort = this.mSort.get("email");
            if (emailSort != 0) {
                sortedContacts = cdm.sortByEmail(listToSort, emailSort);
            }
            var mobileSort = this.mSort.get("mobile");
            if (mobileSort != 0) {
                sortedContacts = cdm.sortByMobile(listToSort, mobileSort);
            }

            this.sortedContacts = sortedContacts;

            this.setPagedContacts();
        },

        /**
         * 联系人分页
         */
        setPagedContacts : function() {
            var cdm = this.collectionDataManager();
            var listToPage = this.sortedContacts;

            var pageIndex = this.mPaging.get("pageIndex");
            var pageSize = this.mPaging.get("pageSize");
            this.pagedContacts = cdm.page(listToPage, pageIndex, pageSize);
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Filter.InitialLetter";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            initialLetter : "all"
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        isFiltering : function() {
            return this.get("initialLetter") != "all";
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            pageIndex : 0,
            totalRecords : 0,
            pageSize : 20
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);
            if (options) {
                this.set(options);
            }
            this.buildData();

//            _this.on("change", function(model, attr) {
//                _this.synData();
//            });
            this.on("change:totalRecords change:pageSize", this.setMaxIndex, this);
            this.on("change:pageIndex", this.setFirstPage, this);
            this.on("change:pageIndex change:maxIndex", this.setLastPage, this);
        },

        /**
         * 同步model的数据
         */
        buildData : function() {
            this.setMaxIndex();
            this.setFirstPage();
            this.setLastPage();
        },

        hasContacts : function() {
            return this.get("totalRecords") > 0;
        },

        setMaxIndex : function() {
            this.set("maxIndex", Math.ceil(this.get("totalRecords") / this.get("pageSize")));
        },

        setFirstPage : function() {
            this.set("firstPage", this.get("pageIndex") == 1);
        },

        setLastPage : function() {
            this.set("lastPage", this.get("pageIndex") == this.get("maxIndex"));
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Selector";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            selectedNum : 0,
            totalRecords : -1,
            pageSelected : false // 当前页是否全选择
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            // this.on("change:selectedNum", this.onSelectedNumChanged, this);
        },

        allSelected : function() {
            var selectedNum = this.get("selectedNum");
            return selectedNum > 0 && selectedNum == this.get("totalRecords");
        },

        noneSelected : function() {
            return this.get("selectedNum") == 0;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Sort";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            name : 1,
            email : 0,
            mobile : 0
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        resetAll : function() {
            this.set({
                name : 0,
                email : 0,
                mobile : 0
            }, {
                silent : true
            });
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Search";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            keyword : "", // 搜索关键字
            totalRecords : 0, // 搜索结果的联系人数量
            searchStatus : 0 // 0 初始化 1 搜索中 2 搜索完成
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        openSearchMode : function(keyword) {
            this.set({
                keyword : keyword,
                searchStatus : 1
            });
            // 强制触发change事件，用户可以重复检索同一关键字
            this.trigger("change:keyword");
        },

        resetSearchStatus : function() {
            this.set("searchStatus", 0);
            this.set({
                keyword : "",
                totalRecords : 0
            }, {
                silent : true
            });
        },

        setSearchingStatus : function() {
            this.set("searchStatus", 1);
        },

        setSearchCompleted : function() {
            this.set("searchStatus", 2);
        },

        isStatusReset : function() {
            return this.get("searchStatus") == 0;
        },

        isSearching : function() {
            return this.get("searchStatus") == 1;
        },

        isSearchCompleted : function() {
            return this.get("searchStatus") == 2;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Filter.InitialLetter";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #initial-letter-filter",

        events : {
            "click a" : "doFilter"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            EventsAggr.Contacts.keyOn("NO_CONTACTS_RENDER", _this.onNoContactsRender, _this);
            EventsAggr.Contacts.keyOn("CONTACTS_RENDERED", _this.onContactsRedered, _this);

            _this.model.on("change:initialLetter", _this.changeLetter, _this);
        },

        onNoContactsRender : function() {
            this.$el.toggle(false);
        },

        onContactsRedered : function() {
            this.$el.toggle(true);
        },

        doFilter : function(ev) {
            top.BH("addr_contacts_initialLetterFilter");

            var $el = $(ev.target);
            var newInitialLetter = $el.text().trim().toLowerCase();
            this.model.set("initialLetter", newInitialLetter);
        },

        changeLetter : function(model) {
            // var eventsAggr = EventsAggr.Contacts;
            // eventsAggr.keyTrigger("FILTER_INITIAL_LETTER", model.get("initialLetter"));
            this.render();
        },

        render : function() {
            var initialLetter = this.model.get("initialLetter");
            this.$("a").each(function(i, el) {
                var $el = $(el);
                var isMatch = $el.text().trim().toLowerCase() == initialLetter;
                $el.toggleClass("on", isMatch);
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contactsPagingBar",

        events : {
            "click a.next" : "nextPage",
            "click a.prev" : "prevPage",
            "click #page-size-caller" : "togglePageSizeConfig",
            "click #page-index-caller" : "assignPageIndex",
            "click a.Page-size" : "configPageSize",
            "mouseleave #page-size-container" : "closePageSizeConfig"
            // TODO
            // "mouseleave #page-size-caller":"closePageSizeConfig"
        },

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#contacts-paging').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            this.model.on("change", this.render, this);
        },

        initEvents : function() {
            var _this = this;

        },

        nextPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex < maxIndex) {
                this.model.set("pageIndex", pageIndex + 1);
            }
        },

        prevPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex > 1) {
                this.model.set("pageIndex", pageIndex - 1);
            }
        },

        togglePageSizeConfig : function(ev) {
            ev.preventDefault();
            $("#page-size-container").toggle();
        },

        assignPageIndex : function(ev) {
            ev.preventDefault();

            var _this = this;
            var This = this;
            //显示下拉菜单
            var popup = M139.UI.Popup.create({
                target : this.$("#page-index-caller"),
                width : 135,
                buttons : [{
                    text : "确定",
                    cssClass : "btnNormal",
                    click : function() {
                        var $inputIndex = popup.contentElement.find("input:text");
                        var index = new Number($inputIndex.val());
                        var maxIndex = new Number(_this.model.get("maxIndex"));
                        if (index > maxIndex) {
                            index = maxIndex;
                        } else if (index < 1) {
                            index = 1;
                        }
                        $inputIndex.val(index);
                        _this.model.set("pageIndex", index);

                        popup.close();
                    }
                }],
                content : '<div style="padding-top:15px;">跳转到第 <input type="text" style="width:30px;"/> 页</div>'
            });
            popup.render();
            popup.contentElement.find("input:text").keyup(function(e) {
                this.value = this.value.replace(/\D/g, "");
            }).focus();
            M139.Dom.bindAutoHide({
                element : popup.contentElement[0],
                stopEvent : true,
                callback : function() {
                    popup.contentElement.remove();
                }
            });
        },

        configPageSize : function(ev) {
            ev.preventDefault();

            var newPageSize = $(ev.currentTarget).find("span").text().trim();
            var pageSize = this.model.get("pageSize");
            if (newPageSize == pageSize) {
                $("#page-size-container").hide();
            } else {
                this.model.set({
                    pageSize : newPageSize,
                    pageIndex : 1
                });
            }
        },

        closePageSizeConfig : function(ev) {
            ev.preventDefault();
            $("#page-size-container").hide();
        },

        render : function() {
            this.logger.debug("rendering...");
            if (this.model.get("totalRecords") === 0) {
                this.$el.empty();
            } else {
                this.$el.html(this.template(this.model.toJSON()));
            }
            return this;
        },

        dispose : function() {

        }
    }));

    // $(function() {
    // var model = new M2012.Addr.Model.Contacts.Paging();
    // new M2012.Addr.View.Contacts.Paging({
    // model : model
    // }).render();
    // });

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Selector";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-header",

        events : {
            "click #toggle-all-contacts" : "toggleAllContacts",
            "click #toggle-page-contacts" : "togglePageContacts",
            "click #clean-selected-contacts" : "cleanSelectedContacts",
            "click .sort" : "sortContacts"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.mSelector = options.mSelector;
            _this.mSort = options.mSort;

            _this.listenEvents();
        },

        listenEvents : function() {
            EventsAggr.Contacts.keyOn("CONTACT_TOGGLED", this.onContactToggled, this);
            _EA_C.keyOn("CHANGE_SELECTED_CONTACTS", this.onChangeSelectedContacts, this);

            this.mSelector.on("change", this.onSelectorChanged, this);
            this.mSort.on("change", this.onSortChanged, this);
        },

        sortContacts : function(ev) {
            top.BH("addr_contacts_sort");

            var idPrefix = "title-";
            var $el = $(ev.target).closest("div.sort-container");
            var sortKey = $el.attr("id").slice(idPrefix.length);
            var currentOrder = this.mSort.get(sortKey);
            this.mSort.resetAll();
            this.mSort.set(sortKey, this.switchSortOrder(currentOrder));

            // EventsAggr.Contacts.keyTrigger("SORT_CONTACTS", this.mSort);
        },

        switchSortOrder : function(order) {
            var result = -order;
            if (result == 0) {
                result = 1;
            }
            return result;
        },

        onSelectorChanged : function(model) {
            if (model.noneSelected()) {
                this.$("#title-name").removeClass("hide");
                this.$("#title-selected").addClass("hide");
            } else {
                this.$("#title-name").addClass("hide");
                this.$("#title-selected").removeClass("hide");
            }

            if (model.get("pageSelected")) {
                this.$("#toggle-page-contacts").prop("checked", true);
            } else {
                this.$("#toggle-page-contacts").prop("checked", false);
            }

            this.$("#selected-num").text(model.get("selectedNum"));
        },

        onSortChanged : function(model) {
            this.setSortHeaderStyle(this.$("#title-name"), model.get("name"));
            this.setSortHeaderStyle(this.$("#title-email"), model.get("email"));
            this.setSortHeaderStyle(this.$("#title-mobile"), model.get("mobile"));
        },

        setSortHeaderStyle : function($target, order) {
            var $el = $target.find("span.order");
            $el.removeClass("i-d-up i-d-down");
            if (order == 1) {
                $el.addClass("i-d-up");
            } else if (order == -1) {
                $el.addClass("i-d-down");
            }
        },

        render : function() {
            // this.$el.html(this.template(this.mSelector.toJSON()));
            return this;
        },

        toggleAllContacts : function(ev) {
            // do not add this code, or you cannot toggle the checkbox as you want.
            // ev.preventDefault();

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_ALL" : "UNSELECT_ALL";
            EventsAggr.Contacts.keyTrigger(key);
        },

        togglePageContacts : function(ev) {
            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_PAGE" : "UNSELECT_PAGE";
            EventsAggr.Contacts.keyTrigger(key);
        },

        cleanSelectedContacts : function(ev) {
            ev.preventDefault();

            top.BH("addr_contacts_multiPageUnselect");

            EventsAggr.Contacts.keyTrigger("UNSELECT_ALL");
        },

        // { Inner events handlers }

        // { Outer events handlers }
        onContactToggled : function(select) {
            var selectedNum = this.mSelector.get("selectedNum");
            if (select) {
                selectedNum += 1;
            } else {
                selectedNum -= 1;
            }

            this.mSelector.set("selectedNum", selectedNum);
        },

        onChangeSelectedContacts : function() {
            this.mSelector.set("selectedNum", _Contacts.getSelectedContactsNum());
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Search";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-search-title",

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.model.on("change:totalRecords", _this.changeContactsNum, _this);
            _this.model.on("change:searchStatus", _this.changeSearchingMode, _this);

            top.$App.off("searchkeywordChange");
            // top.$App.trigger("searchkeywordChange", {type:"addr",keyword:"hello,world"});
            top.$App.on("searchkeywordChange", function(params) {
                // 如果通讯录页面未加载完成，则不处理搜索。
                if (!window || !window._LoadStatus || window._LoadStatus != 1) {
                    return;
                }
                var type = params.type;
                var keyword = params.keyword;
                if ("addr" == type) {
                    _this.model.openSearchMode(keyword);
                }
            });
        },

        changeContactsNum : function() {
            var $contactsNum = this.$("#searched-contacts-num");
            $contactsNum.text(this.model.get("totalRecords"));
        },

        changeSearchingMode : function() {
            if (this.model.isStatusReset()) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        },

        render : function() {

        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());

            this.ui = {};
            this.ui.btnImport = this.$('#btnImport');
            this.ui.btnCreateContact = this.$('#btnCreateContact');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;

            this.ui.btnImport.click(function(){
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_allNone_import'});                    
                }
            });

            this.ui.btnCreateContact.click(function(){
                if( window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_allNone_create'});                    
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoGroupContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-group-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());

            this.ui = {};
            this.ui.btnCopyContact = this.$('#btnCopyContact');
            this.ui.btnCreateContact = this.$('#btnCreateContact');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;
            this.ui.btnCopyContact.click(function(){                
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_editGroup', groupId: _Groups.selected()[0].get('id')});
                    top.BH('addr_groupNone_copyToGroup');
                }               
            });

            this.ui.btnCreateContact.click(function(){
                if(window.$Addr){ 
                    var group = _Groups.selected()[0];
                    var groupId = group.get("id");               
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_groupNone_create', groupId: groupId});                    
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoSearchContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-search-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());
            return this;
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoFilterContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-filter-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());
            return this;
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoVipContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-vip-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());           

            this.ui = {};
            this.ui.btnAddVip = this.$('#btnAddVip');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;

            this.ui.btnAddVip.click(function(){
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'contact:addVip',
                        type: 'model',
                        action: 'addr_vipNone_addVip'
                    });
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Groups.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            id : 0, // 组id
            members : 0, // 组成员数
            name : '', // 组名称
            selected : false, // 是否被选中
            dropable : true // 是否允许拖拽联系人到改组
        },

        initialize : function(group) {
            superClass.prototype.initialize.apply(this, arguments);
            this.set(group);
        },

        /**
         * 是否是VIP组
         */
        isVipGroup : function() {
            return this.get("id") == _DataBuilder.vipGroupId();
        },

        /**
         * 是否是所有联系人组
         */
        isAllContactsGroup : function() {
            return this.get("id") == _CFG.getAllContactsGid();
        },

        isReadMailContacts : function() {
            return this.get("name") == "读信联系人";
        },

        isNoGroup : function() {
            return this.get("id") == _CFG.getNoGroupGid();
        },

        /**
         * 添加组成员数
         * 【注意】：这里需要先转换成数字再加，防止出现3+"5"=35的情况。
         *
         * @param {Object} step 添加的组成员数
         */
        addMembersNum : function(step) {
            this.set("members", new Number(this.get("members")) + new Number(step));
        },

        minusMembersNum : function(step) {
            this.set("members", new Number(this.get("members")) - new Number(step));
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.Addr.Collection.Groups.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.Addr.Model.Groups.Item,

        initialize : function() {
            // tips: Bind gloal events here will hanlder n(= instance numbers) times.
            //         so gloal events register in listenBroadcastEvents()
            superClass.prototype.initialize.apply(this, arguments);
            this.selectedId = null;
        },

        /**
         * 监听全局事件。 
         */
        listenBroadcastEvents : function() {
            EventsAggr.Groups.keyOn("SELECT_GROUP", this.selectGroup, this);
        },

        /**
         * 选择组操作。 
         */
        selectGroup : function(data, options) {
            this.unselectAll();
            var groupId = data.groupId;
            this.selectedId = groupId;
            this.get(groupId).set("selected", true);
            EventsAggr.Groups.keyTrigger("GROUP_SELECTED", data, options);
        },

        /**
         * 合并组。 
         */
        mergeGroups : function(mergeGroups) {
            var _this = this;
            $.each(mergeGroups, function(index, mergeGroup) {
                var gid = mergeGroup.get("id");
                if (_this.selectedId == gid) {
                    mergeGroup.set("selected", true, {
                        silent : true
                    });
                }
                var group = _Groups.get(gid);
                if (group) {
                    group.set(mergeGroup.toJSON());
                } else {
                    _Groups.add(mergeGroup, {
                        at : index
                    });
                }
            });
            var groupIds = this.getModelsId(_Groups.models);
            var mergeIds = this.getModelsId(mergeGroups);
            var deleteIds = _.difference(groupIds, mergeIds);
            $.each(deleteIds, function (index, delId) {
                _Groups.remove(_Groups.get(delId));
            });
        },

        getModelsId : function(models) {
            return _.map(models, function (model) {
                return model.get("id");
            });
        },

        /**
         * 获取所有选择的组 
         */
        selected : function() {
            return this.where({
                selected : true
            });
        },

        /**
         * 获取当前选中的组 
         */
        selectedGroup : function() {
            return this.get(this.selectedId);
        },

        /**
         * 获取选中组的下标，从0开始 
         */
        selectedGroupIndex : function() {
            return this.indexOf(this.selectedGroup());
        },

        /**
         * 获取选中组的id 
         */
        selectedGroupId : function() {
            return this.selectedId;
        },

        /**
         * 取消所有选择的组 
         */
        unselectAll : function() {
            _.each(this.selected(), function(model) {
                model.set("selected", false);
            });
            this.selectedId = null;
        },

        /**
         * 获取所有组id 
         */
        getGroupsId : function() {
            var ids = [];
            this.each(function(model) {
                ids.push(model.get("id"));
            });
            return ids;
        },

        /**
         * 获取所有联系人组id 
         */
        allContactsGroup : function() {
            return this.get(_DataBuilder.allContactsGroupId());
        },

        /**
         * 获取vip联系人组id 
         */
        vipGroup : function() {
            return this.get(_DataBuilder.vipGroupId());
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Groups.Nav.Item";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        tagName : "li",

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-groups-nav-item').html()),

        events : {
            "click" : "selectGroup",
            "mouseenter" : "enterGroup",
            "mouseleave" : "leaveGroup"
            //"click .Edit" : "editGroup",
            //"click .Del" : "deleteGroup"
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.mDragdrop = options.mDragdrop;

            this.model.on("change:selected", this.onSelectionToggled, this);
            this.model.on("change", this.render, this);
        },

        /**
         * 选择组 
         */
        selectGroup : function(ev) {
            ev.preventDefault();

            if (this.model.isAllContactsGroup()) {
                top.BH("addr_group_allContacts");
            } else if (this.model.isVipGroup()) {
                top.BH('addr_vip_load');
                top.BH("addr_group_vipContacts");
            } else if (this.model.isReadMailContacts()) {
                top.BH("addr_group_readMailContacts");
            } else {
                top.BH("addr_group_customize");
            }

            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : this.model.get("id")
            }, {
                showMain : true
            });
        },

        /**
         * 组选中状态改变时，进行样式处理 
         */
        onSelectionToggled : function(model) {
            // TODO UI样式太多，命名太挫，需要在注释中表明每种样式名称对应的状态
            // 因为鼠标移上的样式hoverNo和选中的样式on放在一起有冲突，选中组时，需要移除hoverNo的样式
            if (model.get("selected")) {
                this.$el.removeClass("hoverNo");
            }
        },

        /**
         * 鼠标移入组
         */
        enterGroup : function(ev) {
            // 拖拽中，直接返回
            if (!this.mDragdrop.isInitStatus()) {
                return;
            }

            if (!this.model.get("selected")) {
                this.$el.toggleClass("hoverNo", true);
            }
            //else {
            //    this.$el.removeClass("onNo");
            //}
        },

        /**
         * 鼠标移出组
         */
        leaveGroup : function(ev) {
            this.$el.toggleClass("hoverNo", false);
            if (this.model.get("selected")) {
                this.$el.addClass("onNo");
            }
        },

        /**
         * 渲染组 
         */
        render : function() {
            var renderParams = {
                members : this.model.get("members"), // 组成员数
                name : this.model.get("name")// 组名称
            };
            // renderParams.members = window._ContactGroupMap.getGroupContactsNum(this.model.get("id"));
            this.$el.html(this.template(renderParams));

            var selected = this.model.get("selected");
            this.$el.toggleClass("on onNo", selected);
            var isSysGroup = this.model.isVipGroup() || this.model.isAllContactsGroup() || this.model.isNoGroup();
            if (!isSysGroup) {
                this.$el.addClass("Dropable");
            } else {
                this.$el.addClass("No-edit");
                this.$el.addClass("No-del");
            }

//            if(this.model.isNoGroup()) {
//                this.$el.addClass("addr-ul-line");
//            }

            return this;
        },

        /**
         * 编辑组 
         */
        editGroup : function() {
            //ev.stopPropagation();

            top.BH("addr_group_edit");

            $Addr.trigger('redirect', {
                key : 'addr_editGroup',
                groupId : this.model.get("id")
            });

            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : this.model.get("id")
            }, {
                showMain : false
            });
        },

        /**
         * 删除组 
         */
        deleteGroup : function() {
            //ev.stopPropagation();

            top.BH("addr_group_delete");

            var _this = this;

            var groupId = this.model.get("id");

            if (top.Utils.PageisTimeOut(true)) {
                return;
            }

            var contactsId = top.Contacts.getContactsByGroupId(groupId);
            var deleteGroupContacts = false;
            
            // 组内无联系人
            if (contactsId.length == 0) {
                top.FloatingFrame.confirm(PageMsg.warn_delgrouponly, deleteTeam);
                return;
            }

            // 是否删除组联系人确认框
            var content = PageMsg.warn_delgroup.replace("$checkbox$", "<br><label for='deleteGroupContacts'><input id='deleteGroupContacts' type='checkbox' />") + "</label>";
            var dialog = top.$Msg.confirm(content, function() {
                deleteGroupContacts = !!dialog.jContainer.find("#deleteGroupContacts").attr("checked");
                if (deleteGroupContacts) {
                    top.BH("addr_group_deleteWithContacts");
                }
                deleteTeam();
            }, "", "", {
                isHtml : true
            });

            /**
             * 删除组 
             */
            function deleteTeam() {
                window.top.Contacts.deleteGroup(groupId, function(result) {
                    if (result.success) {
                        top.BH("addr_group_deleteSucceed");
                        top.M139.UI.TipMessage.show(PageMsg.info_success_del, {
                            delay : 2000
                        });
                        if (deleteGroupContacts) {//彻底删除本组联系人--更新vip联系人信息
                            var delContactsId = [];
                            for (var i = 0; i < contactsId.length; i++) {
                                if (contactsId[i]) {
                                    delContactsId.push(contactsId[i].SerialId);
                                }
                            }
                            var vipList = top.Contacts.FilterVip(delContactsId);
                            if (vipList.length > 0) {
                                vipLIst = vipList.join(",");
                                top.Contacts.updateCache("delVipContacts", vipLIst);
                                _this.updateVipMail();
                            }
                        }

                        _EA_G.keyTrigger("DELETE_GROUP", {
                            groupId : _this.model.get("id")
                        }, {
                            deleteGroupContacts : deleteGroupContacts,
                            renderGC : _CFG.getRenderGC("DG")
                        });
                    } else {
                        _AlertMsg(result.msg);
                    }
                }, deleteGroupContacts);
            }

        },

        updateVipMail : function() {
            if (top.Main.searchVipEmailCount) {
                top.Main.searchVipEmailCount();
            }
        },

        destroy : function() {

        },

        /**
         * 销毁视图
         */
        remove: function () {
            _Log("remove groups item view");
            superClass.prototype.remove.apply(this, arguments);
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Groups.Nav.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#groups-nav-list",

        logger : new M139.Logger({
            name : _class
        }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.mDragdrop = options.mDragdrop;
            _this.mGroupsManager = options.mGroupsManager;
            _this.childrenView = {};
            // TODO 统一切换成-->EventsAggr.Groups.keyOn("GROUPS_RESET", _this.onGroupsCreated, _this);
            // _this.collection.on("reset", _this.onGroupsReset, _this);

            EventsAggr.Groups.keyOn("GROUPS_CREATED", _this.onGroupsCreated, _this);
            EventsAggr.Groups.keyOn("GROUPS_UPDATED", _this.onGroupsUpdated, _this);
            EventsAggr.Groups.keyOn("GROUPS_DELETED", _this.onGroupsDeleted, _this);

            _EA_G.keyOn("GROUP_ADDED", _this.onGroupAdded, _this);
            _EA_G.keyOn("GROUP_EDITED", _this.onGroupEdited, _this);
            _EA_G.keyOn("GROUP_DELETED", _this.onGroupDeleted, _this);

            _EA_G.keyOn("RENDER_GROUPS", _this.renderGroups, _this);

            _EA_G.keyOn("GROUP_SELECTED", _this.onGroupSelected, _this);

            _EA_G.keyOn("LOCATE_SELECTED_GROUP", _this.locateSelectedGroup, _this);
            _EA_G.keyOn("EDIT_SEL_GROUP", _this.editSelectedGroup, _this);
            _EA_G.keyOn("DELETE_SEL_GROUP", _this.deleteSelectedGroup, _this);
        },

        editSelectedGroup: function () {
            var selGid = _Groups.selectedGroupId();
            this.childrenView[selGid].editGroup();
        },

        deleteSelectedGroup: function () {
            var selGid = _Groups.selectedGroupId();
            this.childrenView[selGid].deleteGroup();
        },

        onGroupSelected : function(data, options) {
            this.mGroupsManager.activeM139Addr();
            if (this.mGroupsManager.get("showAndAddr")) {
                this.mGroupsManager.set("showAndAddr", false);
            } else {
                this.locateSelectedGroup();
            }
        },

        locateSelectedGroup : function() {
            var $p = $("#groups-nav-list").parent();
            var itemHeight = this.$el.find("li:first").outerHeight(true);

            var scrollTop = $p.scrollTop();
            var minShowIndex = Math.ceil(scrollTop / itemHeight);
            var maxShowIndex = Math.floor((scrollTop + $p.height()) / itemHeight);

            var selectedGroupIndex = _Groups.selectedGroupIndex();
            if (selectedGroupIndex < 0) {
                selectedGroupIndex = 0;
            }
            if (selectedGroupIndex < minShowIndex || selectedGroupIndex >= maxShowIndex) {
                $p.scrollTop(selectedGroupIndex * itemHeight);
            }
        },

        onGroupAdded : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CG")) {
                var groupId = data.groupId;
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                });
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            } else if (rgc == _CFG.getRenderGC("CG_Silent")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
            }
        },

        onGroupEdited : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("UG")) {
                var groupId = data.groupId;
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : [groupId]
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            }
        },

        onGroupDeleted : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("DG")) {
                var groupId = data.groupId;      
                if (groupId == _Groups.selectedGroupId()) {
                    $Addr.trigger($Addr.EVENTS.LOAD_MAIN);
                }

                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : [groupId]
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : _DataBuilder.allContactsGroupId()
                }, options);
            }
        },

        /**
         * 数据源重置时，重绘页面。
         */
        onGroupsReset : function() {
            this.render();
        },

        renderGroups : function(data, options) {
            _Groups.mergeGroups(_DataBuilder.buildAllGroups().toArray());
            if (options && options.renderGC) {
                var rgc = options.renderGC;
                var groupsId = data && data.groupsId;
                if (rgc == _CFG.getRenderGC("DG")) {
                    if (groupsId) {
                        this.removeChildren(groupsId);
                        return;
                    }
                }
                var rgcReset = [_CFG.getRenderGC("IC"), _CFG.getRenderGC("MC"), _CFG.getRenderGC("SC")];
                var isReset = _.contains(rgcReset, rgc);
                if (!isReset) {
                    if (groupsId) {
                        this.renderChildren(groupsId);
                        return;
                    }
                }
            }
            this.render();
        },

        removeChildren : function(groupsId) {
            var _this = this;
            _.each(groupsId, function(groupId) {
                _this.childrenView[groupId].remove();
                delete _this.childrenView[groupId];
            });
        },

        renderChildren : function(groupsId) {
            var _this = this;
            _.each(groupsId, function(gid) {
                var groupView = _this.childrenView[gid];
                var groupModel = _Groups.get(gid);
                if (!groupView) {
                    var childView = _this.childrenView[gid] = new M2012.Addr.View.Groups.Nav.Item({
                        model : groupModel,
                        id : "group-" + gid,
                        mDragdrop : _this.mDragdrop
                    });
                    var index = _Groups.indexOf(groupModel);
                    if (index > 0) {
                        _this.childrenView[_Groups.at(index - 1).get("id")].$el.after(childView.render().el);
                    } else {
                        _this.$el.prepend(childView.render().el);
                    }
                } else {
                    groupView.model = groupModel;
                    groupView.render();
                }
            });
        },

        /**
         * 有新组创建后，页面重绘
         *
         * @param {Object} data 数据
         * @param {Object} options 控制项
         */
        onGroupsCreated : function(data, options) {
            // TODO optimize: 局部刷新，无需重绘整个列表区.
            var groupId = _.last(data.groupsId) || this.collection.getSelectedGroupId();
            // EventsAggr.Groups.keyTrigger("SELECT_GROUP", _Promise.GRP_ID_ALL);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            });
            this.render();
        },

        onGroupsUpdated : function(data, options) {
            var groupId = _.last(data.groupsId) || this.collection.getSelectedGroupId();
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            });
            this.render();
        },

        onGroupsDeleted : function(data, options) {
            if (this.collection.selected().length == 0) {
                EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                    groupId : _CFG.getAllContactsGid()
                });
            }

            this.render();
        },

        render : function() {
            var _this = this;
            _this.$el.empty();

            _this.childrenView = {};
            _this.collection.each(_this.addGroup, _this);

            if (_this.collection.length > 2) {
                var $noGroup = this.$("#group--2");
                var $separation = $('<li class="addr-ul-line"></li>');
                $separation.insertAfter($noGroup);
            }

            _EA_G.keyTrigger("AUTO_LOCATE_NAV");

            return _this;
        },

        addGroup : function(model) {
            var gid = model.get("id");
            var childView = this.childrenView[gid] = new M2012.Addr.View.Groups.Nav.Item({
                model : model,
                id : "group-" + gid,
                mDragdrop : this.mDragdrop
            });
            this.$el.append(childView.render().el);
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.GroupsManager";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            activeGroupType : 10, // 当前激活的联系人。10：139联系人 20：和通讯录联系人
            showAndAddr : false // 和通讯录组的显示状态。
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.on("change:showAndAddr", this.onChangeShowAndAddr, this);
        },

        /**
         * 设置为139联系人组
         */
        activeM139Addr : function() {
            this.set("activeGroupType", 10);
        },

        isM139Addr : function() {
            return this.get("activeGroupType") == 10;
        },

        onChangeShowAndAddr : function() {
            if (!this.get("showAndAddr")) {
                this.activeM139Addr();
            }
        },

        /**
         * 设置为和通讯录联系人组
         */
        activeAndAddr : function() {
            this.set("activeGroupType", 20);
        },

        isAndAddr : function() {
            return this.get("activeGroupType") == 20;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.GroupsManager";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "div.addr-p-list",

        logger : new M139.Logger({ name: _class }),

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.model.on("change:activeGroupType", this.changeActive, this);
            // 因为页面是动态滑动，导航高度需要等滑动完成之后再计算。
//            this.model.on("change:showAndAddr", this.changeShowAndAddr, this);
            _EA_G.keyOn("AUTO_LOCATE_NAV", this.changeShowAndAddr, this);

            var _this = this;
            $(window).resize(function() {
                _this.changeShowAndAddr();
            });
        },

        changeShowAndAddr : function() {
            var slideDown = this.model.get("showAndAddr");
            var $rootPanel = this.$el;
            var $innerPanel = this.$("div.addr-ul-list");
            if (slideDown) {
				// 兼容360
                //var navHeight = $("#addr-groups-nav").height();
                $rootPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                $innerPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                this.autoAdaptRootHeight($rootPanel);
            } else {
                $rootPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                $innerPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                this.autoAdaptInnerHeight($innerPanel);
            }
        },

        autoAdaptRootHeight : function($target) {
            var $parent = $target;
            //$parent.css("height", "");

            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").height() + 20;
            }
            var navHeight = $("#addr-groups-nav").height();
            var totalHeight = $("#addr-left-btns").height() + navHeight + maybeKnownHeight + 30;
            // 兼容全网、灰度群组的代码，群组全网后，删除判断
            if ($(".addr-p-tab").length > 0) {
                totalHeight += $(".addr-p-tab").height();
            }
            var windowHeight = $(window).height();
            if (totalHeight > windowHeight) {
                // var parentHeight = $parent.height();
				var parentHeight = navHeight;
                var newHeight = parentHeight - (totalHeight - windowHeight);
                $parent.height(newHeight);
                $parent.css({
                    "overflow-y": "auto"
                });
//                var itemHeight = $("#groups-nav-list").find("li:first").height();
                var footHeight = $(".addr-ul-list").height() + $("#btn-create-group").height()
                    + ($("#andAddr-title").height() + 20) + $("#andAddrGroups-nav-list").find("li:first").height()*3;
                $parent.animate({scrollTop: footHeight - newHeight + 8}, 300);
            }
        },

        autoAdaptInnerHeight : function($target) {
            var $parent = $target;
            //$parent.css("height", "");

            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").height();// + 20;
            }
            var totalHeight = $("#addr-left-btns").height() + $("#addr-groups-nav").height() + maybeKnownHeight + 38;
            var windowHeight = $(window).height();
            if (totalHeight > windowHeight) {
                var parentHeight = $parent.height();
                $parent.height(parentHeight - (totalHeight - windowHeight));
                $parent.css({
                    "overflow-y": "auto"
                });

                _EA_G.keyTrigger("LOCATE_SELECTED_GROUP");
            } else {
                $parent.css({
                    "overflow-y": "visible"
                });
            }
        },

        changeActive : function() {
            if (this.model.isM139Addr()) {
                $("#m139-contacts-list").show();
                $("#and-contacts-list").hide();

                _AndGroups.unselectAll();
            } else {
                $("#m139-contacts-list").hide();
                $("#and-contacts-list").show();

                _Groups.unselectAll();
            }
        }
    }));

})(jQuery, _, M139);

;
(function($, _, M) {

    var superClass = M.Model.ModelBase;

    /**
     * 通讯录-拖拽 的模型
     * @type {string}
     * @private
     */
    var _class = "M2012.Addr.Model.Dragdrop";
    M.namespace(_class, M.Model.ModelBase.extend({

        name : _class,

        defaults : {
            message : "", // 拖拽显示的消息
            status : 0 // 0 初始化 1 拖动目标已命中 2 拖动目标已未命中 3 拖动中
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        initStatus : function() {
            this.set("status", 0);
        },

        isInitStatus : function() {
            return this.get("status") == 0;
        },

        setTargetHit : function() {
            this.set("status", 1);
        },

        isTargetHit : function() {
            return this.get("status") == 1;
        },

        setTargetMiss : function() {
            this.set("status", 2);
        },

        isTargetMiss : function() {
            return this.get("status") == 2;
        },

        setMoving : function() {
            this.set("status", 3);
        },

        isMoving : function() {
            return this.get("status") == 3;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Dragdrop";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#drag-drop-container",

        template : _.template($('#tpl-drag-msg').html()),

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.dragStartView = options.dragStartView;
            // _this.model = new M2012.Addr.Model.Dragdrop();
            _this.model.on("change:status", _this.changeStatus, _this);
            _this.model.on("change:message", _this.render, _this);
            _this.render();
        },

        changeStatus : function() {
            if (this.model.isTargetHit()) {
                this.$(".msg").removeClass("msgYellow");
                this.$("i")[0].className = "i_t_right";
            } else if (this.model.isMoving()) {
                this.$(".msg").addClass("msgYellow");
                this.$("i")[0].className = "i_t_move";
            }
        },

        render : function() {
            _Log("render drag-drop-container");
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        makeDragable : function() {
            var _this = this;

            var $hotspot = _this.dragStartView.$el;

            // 当前选择的联系人数
            // var selectedContactsNum = _Contacts.selected().length;
            // 拖拽到组上时，组的样式
            var dropOverClass = "hoverNo";
            // 鼠标悬停时，组的样式（和拖拽样式会冲突）
            // var hoverClass = "hover";
            // 拖拽到的目标组
            var $targetGroup = null;
            // 鼠标拖拽的距离
            var dx = 0;
            // 当前选择的组
            // var selectedGroup = null;
            // 当前选择的联系人列表
            var contactsId = null;
            // 是否已经设置了拖拽消息
            var msgSet = false;
            // 开始拖拽的元素
            var $dragStart = null;
            $D.setDragAble(_this.el, {
                handleElement : $hotspot,
                onDragStart : function(e) {
                    _Log("drag start...");
                    // 初始化
                    var startElement = e.target || e.srcElement;
                    $dragStart = $(startElement);
                    if ($dragStart.closest("tr").hasClass("Editing")) {
                        return false;
                    }
                    $targetGroup = null;
                    msgSet = false;
                    dx = 0;
                },
                onDragMove : function(e) {
                    _Log("drag move...");

                    var addrListHeight = $("div.addr-ul-list").height();
					var addrListTop = $("div.addr-ul-list").offset().top;
					var canDragHeight = addrListTop + addrListHeight;

                    // 设置拖拽消息
                    if (!msgSet && ++dx > 10) {
                        var dragContactId = _this.getContactIdByElement($dragStart.closest("tr"));
                        var dragContact = _this.dragStartView.itemModels[dragContactId];
                        if (!dragContact.get("selected")) {
                            dragContact.set("selected", true);
                            // EventsAggr.Contacts.keyTrigger("CONTACT_TOGGLED", true);
                        }

                        contactsId = _Contacts.selectedIds();
                        var selectedContactsNum = contactsId.length;

                        _this.model.set("message", "复制" + selectedContactsNum + "个联系人");
                        _this.$el.show();

                        msgSet = true;
                    }

                    // 判断拖拽消息
                    var targetHit = false;
                    $("#groups-nav-list").find("li." + dropOverClass).removeClass(dropOverClass);
                    // $("#groups-nav-list").find("li.on").addClass("onNo");
                    // 隐藏选中组的编辑，删除图标
                    $("#groups-nav-list").find("li.Dropable:not(.on)").each(function(i, group) {

                        if ($D.hitTest(group, _this.el) && e.y <= canDragHeight) {
                            targetHit = true;
                            $targetGroup = $(group);
                            // $(group).toggleClass(hoverClass, false);
                            $(group).toggleClass(dropOverClass, true);
                            // break;
                            return false;
                        }
                    });
                    if (targetHit) {
                        _this.model.setTargetHit();
                    } else {
                        $targetGroup = null;
                        _this.model.setMoving();
                    }
                },
                onDragEnd : function(e) {
                    _Log("drag end...");
                    _this.model.initStatus();
                    _this.$el.hide();
                    _this.model.set("message", "");
                    if ($targetGroup) {
                        // $targetGroup.removeClass(dropOverClass);
                        top.BH("addr_contacts_dragToGroup");
                        $targetGroup.removeClass(dropOverClass);
                        var dstGroupId = _this.getGroupIdByElement($targetGroup);
                        _this.copyContactsToGroup(contactsId, dstGroupId);
                    }
                }
            });
        },

        //复制到
        copyContactsToGroup : function(contactsId, dstGroupId) {
            _Log("copyContactsToGroup");

            window.top.Contacts.copyContactsToGroup(dstGroupId, contactsId, function(result) {
                if (result.success) {
                    _AlertMsg(PageMsg['info_success_copy']);

                    _EA_C.keyTrigger("COPY_TO_GROUP", {
                        contactsId : contactsId,
                        dstGroupId : dstGroupId
                    }, {
                        renderGC : _CFG.getRenderGC("CC2G")
                    });
                    
                    _EA_C.keyTrigger("UNSELECT_ALL");
                } else {
                    _AlertMsg(result.msg);
                }
            });
        },

        /**
         * 根据组元素，获取组id。
         *
         * @param {Object} $group
         */
        getGroupIdByElement : function($group) {
            var prefix = "group-";
            var groupId = $group.attr("id").slice(prefix.length);
            return groupId;
        },

        /**
         * 根据组元素，获取联系人id。
         *
         * @param {Object} $group
         */
        getContactIdByElement : function($contact) {
            var prefix = "contact-";
            var contactId = $contact.attr("id").slice(prefix.length);
            return contactId;
        }
    }));

})(jQuery, _, M139);

