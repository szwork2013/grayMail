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
