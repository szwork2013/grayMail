(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.GroupPanel', superClass.extend(
    {
        el: "#div_teamlist",
        template: $("#tpl-team-groups-item").html(),
        events: {
            "click li[gn]": "groupClick",
            "mouseover [gn]": "mouseoverHandler",
            "mouseleave [gn]": "mouseleaveHandler"
        },        
        initialize: function (options) {
            var self = this;
            this.model = options.model;

            this.initUI();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function() {
            this.container = $("#div_teamlist");
        },
        initEvents: function () {
            var self = this;
            $(window).resize(function () {
                self.setGroupsListHeightNew();
                self.setGroupMemberListHeight();
            });

            this.model.unbind(self.model.dataEvent["QUERY_GROUP"]);
            this.model.on(self.model.dataEvent["QUERY_GROUP"], function (result) {
                self.render(result);
            });

            this.model.unbind("change:refreshMain");
            this.model.on("change:refreshMain", function (e, o, args) {
                if (self[o]) {
                    self[o].render.call(self, args);
                    this.set({refreshMain: null}, {silent: true});
                }
            });

            this.model.unbind("change:refreshNotice");
            this.model.on("change:refreshNotice", function () {
                self.model.getNoticeCount(self.renderNoticeCount);
            });

            this.model.on("change:groups", function () {
                this.trigger("change:groupNumber");
            });
        },
        groupClick: function (e) {
            var cur = e.target || e.srcElement;
            while(!cur.getAttribute("gn")){
                cur = cur.parentNode;
            }
            top.BH("gom_group_rows");
            $Addr.trigger($Addr.EVENTS.LOAD_MAIN);
            var groupNumber = $(cur).attr("gn"), num = 0;
            // 进入群组页面, 直接点击"发群邮件"按钮, groupName为空, 保存操作在render方法里面处理
            //var groupName = $($(cur).find(".numN")[0]).prop("title");
            this.model.set("groupNumber", groupNumber);
            //this.model.set("groupName", groupName);

            var target = this.model.get("groups");
            _.find(target, function (group, order) {
                num = order;
                return parseInt(group["groupNumber"], 10) === parseInt(groupNumber, 10);
            });
            this.model.set("groups", target);
            this.render();
		},
		mouseoverHandler: function (e) {
		    e = e || window.event;
		    var cur = e.target || e.srcElement;
		    while (cur.tagName !== "LI") {
		        cur = cur.parentNode;
		    }
		    if (cur.className === "on") {
		        return;
		    }
		    cur.className = " hover";
		},
		mouseleaveHandler: function (e) {
		    e = e || window.event;
		    var cur = e.target || e.srcElement;
		    while (cur.tagName !== "LI") {
		        cur = cur.parentNode;
		    }
		    cur.className = cur.className.replace(" hover", "");
		},
		render: function (data) {
		    var self = this,
                result;

		        if (!data) {
		            data = this.model.get("groups");
		        } else {
                    data = data.responseData["var"];
                }

		        result = data;

		        _.each(result, function (obj, order) {
		            if (parseInt(obj["groupNumber"], 10) === parseInt(self.model.get("groupNumber"), 10)) {
                        self.model.set("groupName", obj['groupName']); // 保存群组名称
		                obj.current = true;
		            } else {
		                obj.current = false;
		            }
		        });

		        if (result && result.length > 0) {
                    self.hasGroupHandlers(result);
                } else {
                    self.noGroupHandlers();
                }
        },
        setGroupsListHeightNew: function() {
            $("#div_teamlist").css("height", "");
            var _this = this;
            var $parent = _this.$el.parent();
            var windowHeight = $(window).height();
            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").outerHeight();
            }
            var totalHeight = $("#addr-left-btns").outerHeight() + $("#addr-tab").height() + maybeKnownHeight + $("#div_teamlist").height() + 65;
            if (totalHeight > windowHeight) {
                var parentHeight = $parent.height();
                $("#div_teamlist").height(parentHeight - (totalHeight - windowHeight));
            }
        },
        //设置群成员列表高度
        setGroupMemberListHeight :function () {
            var $rootPanel = $("#group-contacts-list");
            var $target = $rootPanel.find(".addr-list");
            var toolbarHeight = $("#group_toolbar").height();
            var contactsHeaderHeight = $("#teamTable").height();

            // 页面固定占用的高度
            var fixedHeight = toolbarHeight + contactsHeaderHeight + 20;

            var windowHeight = $(window).height();
            $target.height(windowHeight - fixedHeight);
        },
        //渲染铃铛信息数
        renderNoticeCount: function (result) {
            var count = parseInt(result.responseData["totalRecord"]);
            if (count > 99) {
                $("#span_notify")[0].innerHTML = "<span>99</span>";
            } else if (count == 0) {
                $("#span_notify")[0].innerHTML = "";
            } else {
                $("#span_notify")[0].innerHTML = "<span>" + count + "</span>";
            }
        },
        defaults: {
            render: function(args){
                //默认
                // 1.刷新群组和列表区
                // 2.选中第一个群组
                var self = this;
                args.callback = function(result) {
                    var data = result.responseData["var"];
                    if (data && data.length > 0) {
                        self.model.set({"groupNumber": data[0].groupNumber});
                    }
                };
                this.refresh.render.call(this, args);
            }
        },
        newGroup: {
            render: function(args){
                //新建群组
                // 1.刷新群组和列表区
                // 2.选中创建的组
                //args = {groupNumber: 1111}]
                var self = this;
                this.refresh.render.call(this, args);
                self.model.set({"groupNumber": args.groupNumber});
            }
        },
        notify: {
            render: function(args){
                //点击消息区
                // 1.刷新群组和列表区
                var self = this;
                args.callback = function() {
                    self.model.set({"groupNumber": null});
                };
                this.refresh.render.call(this, args);
            }
        },
        refresh: {
            render: function(args){
                //常用, 只刷新不做额外的操作
                // 1.刷新群组和列表区
                var _this = this;
                var options = {};
                options.success = function(result) {
                    _this.model.set({groups: result.responseData["var"]});
                    if(args.callback) {
                        args.callback(result);
                    }
                    _this.model.trigger(_this.model.dataEvent["QUERY_GROUP"], result);
                };

                options.error = function(result) {
                    if (result.responseData["summary"] == "服务端校验不通过") {
                        top.$App.setSessionOut();
                    }
                };

                this.model.getGroupList(options);
            }
        },
        hasGroupHandlers: function(result) {
            var self = this;
            $("#div_teamlist").show();
            //$("#group-contacts-list").show();
            $("#group-contacts-list-new").show();
            $("#member-no-group-container").hide();
            $("#div_leftBarNoGroup").hide();
            $("#downCreate").show();
            $(this.el).html(_.template($("#tpl-team-groups-item").html(), {data: result}));
            self.setGroupsListHeightNew();
        },
        noGroupHandlers: function() {
            $("#div_teamlist").hide();
            //$("#group-contacts-list").hide();
            $("#group-contacts-list-new").hide();
            new M2012.GroupMail.View.LeftBarNoGroup().render();
            $("#div_leftBarNoGroup").show();
            // TODO
            $("#div_leftBarNoGroup").height(352);
            new M2012.GroupMail.View.NoGroup().render();
            $("#member-no-group-container").show();
            $("#downCreate").hide();
        }
    }));
})(jQuery, _, M139);


(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.LeftBarNoGroup', superClass.extend(
        {
            el: "#div_leftBarNoGroup",
            template: '<div style="padding-left:46px; position: absolute; top:50%; left:0; margin-top:-32px;"> \
    <p class="gray mb_10">将联系人存为群组<br>轻松发送群邮件</p> \
    <p><a id="leftbarCreate" href="javascript:;" style="width:auto; height:auto; margin:0; float:none; display: inline;">新建群组</a></p></div>',
            events: {
                "click #leftbarCreate" : "createGroup"
            },
            initialize: function() {
                return superClass.prototype.initialize.apply(this, arguments);
            },
            render: function() {
                var self = this;
                $(self.el).html(_.template(self.template));
            },
            createGroup: function() {
                top.BH("gom_null_create_leftgroup");
                $Addr.trigger('redirect', { key: 'addr_team_create' });
            }
        }));
})(jQuery, _, M139);

