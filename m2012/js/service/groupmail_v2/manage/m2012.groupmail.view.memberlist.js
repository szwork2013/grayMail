(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.MemberList', superClass.extend(
    {
        el: "#group-contact-list",
        template: '<tr><td class="td1">\
                    <input class="memberItem" type="checkbox" id=<%=cid%> />\
                    <i class="<%=cls%>" title="群组创建人"></i>\
                </td>\
                <td class="td2">\
                    <em class="editings_em">\
                        <span class="editings_span" title=<%=name %>>\
                            <%=name %>\
                        </span>\
                    </em>\
                </td>\
                <td class="td3" title=<%=email %>><%=email %></td>\
                <td class="td4" title=<%=mobile %>><%=mobile %></td>\
                <td class="td5" title=<%=tGroups%>><% for (var i in groups) { if(groups[i]) { %> <span class="addr-s-t"><%= groups[i] %></span> <% } } %></span></td>\
                <td class="td6">\
                </td></tr>',
        events: {
        },
        initialize: function (options) {
            top.BH("gom_load_list_success");
            var self = this;
            this.model = options.model;

            this.collection = new Backbone.Collection;
            this.toolbar = new M2012.GroupMail.View.toolbar({ model: options.model });

            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var self = this;

            this.collection.on('add', function (e) {
                var cls = e.get('owner') != 1 ? '' : 'i-addrPeople';
                var groups = M139.Text.Html.encode(e.get('gomName')).split(",");
                var template = _.template(self.template);
                var item = template({
                    cid: e.cid,
                    cls: cls,
                    name: M139.Text.Html.encode(e.get('name')),
                    email: M139.Text.Html.encode(e.get('email')),
                    mobile: e.get('mobile'),
                    groups: groups,
                    tGroups: groups.join("、")
                });

                $(self.el).append(item);
            });

            this.collection.on('reset', function (e) {
                $(self.el).html('');
            });

            $("#toggle-team-contacts").click(function () {
                var check = this.checked;
                $("input.memberItem").each(function () { this.checked = check; });

                var checkedLength = $("input.memberItem:checked").length;
                //改变样式，获取选取长度
                self.changeNameField(checkedLength);
            });

            $(self.el).delegate("input.memberItem", "click", function () {
                var checkedLength = $("input.memberItem:checked").length;
                self.changeNameField(checkedLength);
                if (checkedLength == self.collection.length) {
                    $("#toggle-team-contacts").attr("checked", true);
                }
                if (checkedLength == 0) {
                    $("#toggle-team-contacts").attr("checked", false);
                }
                
            });

            $("#nameTd").delegate("#cancelSelect", "click", function () {
                $("#toggle-team-contacts").prop("checked", false);
                $(".memberItem").each(function () {
                    if (this.checked) {
                        this.checked = false;
                    }
                });
                $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
            });

            this.model.on("change:groupNumber", function (e) {
                self.model.getGroupMemberList(function (result) {
                    if (result && result["users"].length > 0) {
                        //清空集合
                        self.collection.reset();

                        //初始化群成员的checkbox和表头
                        self.initMemberHeader();

                        _.each(result["users"], function (u) {
                            self.collection.add(u);
                        });
                    }
                });
            });
            
            this.model.on('addContact', function (arr) {
                $(self.el).find("input.memberItem").each(function () {
                    if (this.checked) {
                        var item = self.collection.get(this.id);
                        arr.push(item.toJSON());
                    }
                });
            });
        },
        render: function () {
            var self = this;
            $(self.el).html(_.template(self.template));
        },
		changeNameField: function (checkedLength) {
		    if (checkedLength != 0) {
		        $("#nameTd")[0].innerHTML = "<span class='hide'>姓名 <a href='javascript:;' class='i-d-up'></a></span>" +
                    "<span>已选择：<strong class='c_ff6600'>" + checkedLength + "</strong>个联系人 <a href='javascript:;' class='c_ff6600' id='cancelSelect'>取消选择</a></span>";
		    } else {
		        $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
		    }
		},
        initMemberHeader: function() {
            if ($("#toggle-team-contacts").length != 0 && $("#nameTd").length != 0) {
                if ($("#toggle-team-contacts").prop("checked"))
                    $("#toggle-team-contacts").prop("checked", false);
                $("#nameTd")[0].innerHTML = "<span>姓名 <a href='javascript:;'></a></span>";
            }
        }
    }));
})(jQuery, _, M139);

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.toolbar', superClass.extend(
    {
        el: "#group_toolbar",
        DEFAULT_TIP: {
            EXIT_SUCCESS: '您已退出群组',
            EXIT_FAIL: '暂时无法处理该请求，请稍后再试',
            SELECTED: '请选择联系人',
            ALL_EXIST: '联系人已在通讯录中',
            EXIT_AFFIRM: '退出后，将接收不到此群组的邮件。确定退出？'
        },
        events: {
            "click #goBack": "back",
            "click #group_exit": "groupExit",
            "click #grourp_edit": "groupEdit",
            "click #grourp_send_mail": "groupSendMail",
            "click #group_add_contacts": "groupAddContacts"
        },
        initialize: function (options) {
            this.model = options.model;
            var self = this;

            this.contactsModel = new top.M2012.Contacts.getModel();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
           

        },
        render: function () {
          

        },
        groupExit: function () {
            var _this = this;            

            top.$Msg.confirm(_this.DEFAULT_TIP.EXIT_AFFIRM, function () {
                var options = {
                    groupNumber:  _this.model.get('groupNumber')
                };

                options.success = function (result) {
                    _this.model.set({ refreshMain: _this.model.REFRESH_STATE.DEFAULT});
                    _this.model.set({ refreshNotice: new Date() });
                    top.BH('gom_exit_success');                    
                    top.M139.UI.TipMessage.show(_this.DEFAULT_TIP.EXIT_SUCCESS, { delay: 3000});
                };

                options.error = function (result) {
                    top.$Msg.alert(_this.DEFAULT_TIP.EXIT_FAIL);
                };

                _this.model.exitGroup(options);
            });

            top.BH('gom_exit_group');
        },
        groupEdit: function () {
            var groupNumer = this.model.get('groupNumber');
            top.BH('gom_edit_group');
            $Addr.trigger('redirect', { key: 'addr_team_edit', groupNumner: groupNumer });
        },
        groupSendMail: function () {
            var groupName = this.model.get('groupName');
            var groupNumber = this.model.get('groupNumber');

            top.BH('gom_send_mail');
            top.$App.show('writeGroupMail', { groupNumber: groupNumber, groupName: groupName });
        },
        groupAddContacts: function () {
            var editor;
            var _this = this;
            var list = [];
            var addList = [];
            var contacts = top.Contacts;

            this.model.trigger('addContact', list);

            _.each(list, function(e){
                if(!contacts.isExistEmail(e.email) && !contacts.isExistMobile(e.mobile)){
                    addList.push(e);
                }
            });

            if (addList && addList.length > 0) {                
                editor = new top.M2012.UI.Dialog.ContactsEditor({ addContacts: addList });
                editor.batchrender();
                editor.on('success', function (result) {
                    if(result.success){
                        _this.addContacts(result.contacts);
                    }
                    editor.dialog.close();
                    top.BH('gom_add_contacts_success');
                });

                editor.on('cancel', function () {
                    editor.dialog.close();
                });                
            } else {                
                var tip = list.length ? this.DEFAULT_TIP.ALL_EXIST : this.DEFAULT_TIP.SELECTED;
                top.M139.UI.TipMessage.show(tip, { delay: 3000, className: "msgYellow" });                
            }

            top.BH('gom_add_contacts');
        },
        addContacts: function(result){
            var options = {};
            var master = top.$Addr;
            var data = result ? result[0] : false;
            if(master){                
                if(data){
                    options = {
                        actionKey: '110',
                        key: 'events:contacts',                        
                        contactId: data.SerialId,
                        groupId: data.GroupId.split(',')
                    };

                    master.trigger(master.EVENTS.LOAD_MODULE, options);
                }else{
                    options = {
                        actionKey: '310',
                        key: 'events:contacts'
                    };

                    setTimeout(function(){
                        master.trigger(master.EVENTS.LOAD_MODULE, options);                        
                    }, 5000);
                }                
            }
        },
        back: function () {
            if (top.$Addr) {
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }
        }
    }));
})(jQuery, _, M139);