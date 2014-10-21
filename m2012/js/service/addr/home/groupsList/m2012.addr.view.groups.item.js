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
