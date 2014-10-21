(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var interval;
    M139.namespace('M2012.GroupMail.View.Session.MemberList', superClass.extend(
    {
        el: "#groupAlbumContacts",
        events: {
            "click [data-action=expand]" : "clickHandler"
        },
        EVENT : {
            SHOW_CONTACT_CARD : "showContactCard"
        },
        Constant : {
            Screen_Width_Limit : 1024 // 屏幕宽度设置值
        },
        template : [
            '<li class="" isSelf="{isSelf}" title="{userEmail}">',
                '<a class="clearfix" href="javascript:;">',
                    '{img}',
                    '<div class="groupAlbumContacts_list_con">',
                        '<p>{userName}</p>',
                        '<span>{userEmail}</span>',
                    '</div>',
                '</a>',
            '</li>'].join(" "),
        iconTemplate : [
            "<i class='{groupIcon}'></i>{groupName}"
        ].join(""),
        initialize: function (options) {
            var that = this;
            this.model = options.model;
            this.selfModel = new M2012.GroupMail.Model.Session.MemberList();

            this.model.on("change:groupNumber",function(e){
                that.model.getGroupMemberList(function(response) {
                    // 调用接口成功时的处理
                    // success handle
                    response && that.render(response);
                    that.initEvents();
                    //that.model.trigger("adjustHeight", "groupAlbumContacts_list");
                }, function () {
                    // 调用接口失败时的处理
                    // error handle
                });
            });

            // 伸缩按钮绑定事件
            $("#switchOn").click(function() {
                var groupAlbumBoxCon = $("#groupAlbumBoxCon");
                $(that.el).toggle();
                if (groupAlbumBoxCon.hasClass("mr_0")) {
                    // 伸缩
                    top.BH && top.BH("group_mail_session_expandList");
                }else{
                    // 展开
                    top.BH && top.BH("group_mail_session_unExpandList");
                }
                groupAlbumBoxCon.toggleClass("mr_0");
                $("#msg_status_wrapper").toggleClass("writeMainOff");
            });

            // 根据屏幕宽度判断是否需要隐藏群成员列表
            // 屏幕宽度超过1024时, 群组列表始终出现, 反之, 群组列表默认收起
            that.on("hideMemberList", function() {
                var screenWidth = window.screen.width;
                if (screenWidth <= that.Constant.Screen_Width_Limit) {
                    // 小于等于1024, 群组列表收起, 展示收缩按钮
                    $("#switchOn").removeClass("hide");
                    $(that.el).hide();
                    $("#groupAlbumBoxCon").addClass("mr_0");
                }
                // 默认伸缩按钮是隐藏的(大于1024时)
            });

            // 默认触发
            that.trigger("hideMemberList");
        },
        getElement : function (tag) {
            return $(this.el).find(tag);
        },
        initEvents : function(){
            var that = this;
            // 初始化时先设置群成员列表的高度
            that.model.trigger("adjustHeight", "groupAlbumContacts_list");
            // 改变窗口大小时,也应该实时调整页面的高度
            $(window).resize(function() {
                that.model.trigger("adjustHeight", "groupAlbumContacts_list");
            });

            // 鼠标左键点击时改变颜色
            that.getElement("li").click(function() {
                $(this).addClass("groupOn").siblings().removeClass("groupOn");
            });

            // 给群成员列表绑定鼠标右键点击事件
            that.getElement("li").contextmenu(function(e){
                var isSelf = Number($(this).attr("isSelf")),
                    email = $(this).attr("title");

                if (!!isSelf) {
                    // 如果是自己, 暂时不显示右键菜单
                    return false;
                }

                that.popMenu(e, email);
                return false; //屏蔽浏览器右键默认行为
            });
        },
        /**
         * 根据后台返回的路径构建图片路径
         * @param result
         */
        getImgPath : function (result) {
            var path = '';
            if (!result) {
                console.warn && console.warn("imgurl error");
                return path;
            }

            if (result.imageUrl) {
                path = "<img title='' alt='' src='" + new top.M2012.Contacts.ContactsInfo({ ImageUrl: result.imageUrl }).ImageUrl + "'>";
            }else if ($App.regularName(result.name)) {
                path = '<i class="groupAlbumContacts_list_con_tou"><span style="font-size:24px;display: block;height:32px;line-height:32px;">' + $App.regularName(result.name, 32) + '</span></i>';
            }else {
                path = "<img title='' alt='' src='/m2012/images/global/avatar/avatar_s_01.png'>";
            }

            return path;
        },
		render : function(result) {
            var that = this,
                elementArr = [],
                element = result["users"];

            for (var i = 0,len = element.length; i < len; i++) {
                elementArr.push($T.Utils.format(that.template, {
                    userName : $T.Html.encode(element[i].name) || 'default',
                    userEmail : $T.Html.encode(element[i].email) || 'default@139.com',
                    isSelf : Number(element[i].userId) == Number(that.model.get("currentUserId")) ? 1 : 0,
                    img : that.getImgPath(element[i])
                }));
            }

            // 填充群成员总数
            $(that.el).find("#memberAccount").html("（" + (element.length || 0) + "人）");

            // 填充群成员列表
            $(that.el).find("ul").html(elementArr.join(""));
		},
        /**
         * 实时设置页面的高度
         * 页面初始化,以及调整窗口(resize)时会调用该方法
         **/
        adjustHeight: function () {

        },
        /**
         * 如果该成员在通讯录列表中存在, 则不展示"添加到通讯录"
         * 如果该成员在通讯录列表中不存在, 则需要展示"添加到通讯录"
         * @param isExist 邮件地址是否在通讯录中存在 boolean
         * @returns {*[]}
         */
        getMenuList : function (isExist) {
            var arr = [
                { text: '发邮件', command: "sendEmail", bh:"group_mail_session_email_rightClick" },
                { text: '发短信', command: "sendSms", bh: "group_mail_session_message_rightClick" },
                { text: '添加到通讯录', command: "toAddress", bh: "group_mail_session_address_rightClick"}
                //{ isLine: true } 显示分割线, 这里不需要显示
            ];

            !!isExist && arr.pop();
            return arr;
        },
        //获取鼠标的绝对坐标
        getMousePos:function(event){
            var e = event || window.event;
            return {
                x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        },
        /**
         * 弹出右键菜单
         * @param e
         * @param email
         */
        popMenu : function (e, email) {
            var that = this,menu,
                position = that.getMousePos(e);

            menu = M2012.UI.PopMenu.create({
                width2: 180,
                items: that.getMenuList(that.isExist(email)),
                top: position.y + "px",
                left: position.x + "px",
                onItemClick: function (item) {
                    // 操作日志
                    item.bh && top.BH && top.BH(item.bh);
                    // 不同的操作处理
                    that.command(item.command);
                }
            });

            // 绑定自动隐藏事件
            bindHideEvent(menu.el);

            // 先保存起来, 或许会有用
            this.selfModel.set("currentMenu", menu);

            // 右键菜单自动消失
            function bindHideEvent(el) {
                var timerId = -1;
                $(el).mouseenter(function () {
                    clearTimeout(timerId);
                }).mouseleave(function () {
                    disappearInFuture();
                });
                function disappearInFuture() {
                    timerId = setTimeout(function () {
                        menu.remove();
                    }, 500);
                }
            }
        },
        command : function (command) {
            var that = this,
                contactInfo = that.selfModel.get("contactInfo");

            var msg = {
                phone_msg : '手机号码',
                phone_msg_tip: '电话号码不能为空'
            };

            switch (command) {
                case 'sendEmail':
                    top.$Evocation.create({
                        'to':'4',
                        'type': '1',
                        'specify': '"{0}"<{1}>'.format(contactInfo.name, contactInfo.email)
                    });
                    break;
                case 'sendSms':
                    sendSms(that.isExist(contactInfo.email));
                    break;
                case 'toAddress':
                    //添加联系人
                    new top.M2012.UI.Dialog.ContactsEditor({
                            name: contactInfo.name,
                            email: contactInfo.email,
                            mobile: contactInfo.mobile
                    }).render();
                    break;
                default:
                    break;
            }

            /**
             * 发送邮件前先判断是否在通讯录中
             * 1. 不在通讯中, 直接弹窗输手机号码
             * 2. 在通讯录中, 分两种情况 :
             *    (1) : 使用的手机号码作为邮箱号码
             *    (2) : 使用通行证号或别名作为邮箱号码
             * @param isExist 为true时代表该邮件地址在通讯录中
             */
            function sendSms (isExist) {
               if (isExist) {
                   if ((!contactInfo.MobilePhone || $.trim(contactInfo.MobilePhone) == "") &&
                       (!contactInfo.BusinessMobile || $.trim(contactInfo.BusinessMobile) == "")) {
                       // 表示使用通行证号或别名作为邮箱号码(这个是借用通讯录的逻辑m2012.addr.view.check.js)
                       operate(true, msg.phone_msg, handleSms);
                       return;
                   }

                   // 表示使用的手机号码作为邮箱号码, 为正常的流程处理, 直接弹出写短信窗口
                   top.$Evocation.create({
                       'to':'4',
                       'type': '2',
                       'specify': _.isFunction(contactInfo.getFirstMobile) && contactInfo.getFirstMobile().replace(/\D/g, "")
                   });
                   return;
               }

                // 不在通讯录中的处理方式
                operate(false, msg.phone_msg, handleSms);

                /**
                 * 发送信息时的详细处理步骤
                 * @param info 操作中需要用到的用户信息
                 */
                function handleSms(info) {
                    var isExist = info.isExist,
                        phoneNumber = info.txtValue;
                    if (!isCorrectPhoneNumber(phoneNumber)) {
                        // 输入的手机号不正确时系统给予提示
                        return;
                    }

                    if (isExist) {
                        // 在通讯录中, 但不以手机号作为邮箱地址时的处理, 需要调用接口更新通讯录中对应的那条记录
                        that.selfModel.updateAddress(getContactParam(phoneNumber), function (response) {
                            // success handle
                            fnSuccess(phoneNumber);
                        }, function (response) {
                            // error handle
                            fnError(response);
                        });
                    } else {
                        // 不在通讯录中时的处理, 需要调用接口向通讯录中添加一条数据
                        that.selfModel.addAddress(getContactParam(phoneNumber), function (response) {
                            var SerialId = response.contacts && response.contacts.SerialId;
                            console.log && console.log("add Address success, SerialId: " + SerialId);
                            fnSuccess(phoneNumber);
                        }, function (response) {
                            // error handle
                            fnError(response);
                        });
                    }
                }

                /**
                 * 操作失败时的提示信息
                 * @param result
                 */
                function fnError (result) {
                    // isHtml为true表示要显示样式
                    top.$Msg.alert(result.msg, {isHtml : true});
                }

                /**
                 * 操作成功时
                 */
                function fnSuccess(phoneNumber) {
                    // 检测对应功能是否对互联网用户开放
                    if (!(top.$User && !top.$User.checkAvaibleForMobile())) {
                        // 弹出短信窗口
                        top.$Evocation.create({
                            'to':'4',
                            'type': '2',
                            'specify': phoneNumber.replace(/\D/g, "")
                        });
                        console.warn && console.warn("checkAvaibleForMobile error");
                    }
                    // 关闭输入手机号码的弹窗
                    that.inputDialog.close();

                    // may be need do some other...

                }


                /**
                 * 验证输入的手机号码是否正确
                 * @param phoneNumber 用户输入的手机号码
                 */
                function isCorrectPhoneNumber(phoneNumber) {
                    if (!phoneNumber) {
                        // 如果手机号码为空
                        getElement("txtMessage").text(msg.phone_msg_tip);
                        return false;
                    }

                    if (!top.Validate.test("mobile", phoneNumber)) {
                        // 不满足手机号码格式
                        getElement("txtMessage").text(top.Validate.error);
                        return false;
                    }

                    if (phoneNumber.length > 100) {
                        // 超过长度限制
                        getElement("txtMessage").text(top.frameworkMessage['warn_contactMobileToolong']);
                        return false;
                    }

                    return true;
                }

                /**
                 * 获取调用接口时所需的参数
                 * @param phoneNumber 用户输入的电话号码
                 */
                function getContactParam(phoneNumber) {
                    var param = {};
                    // contactInfo的值会根据这个联系人是否在通讯内中而不相同
                    $.extend(param, contactInfo);
                    // 将电话号码替换成用户从弹窗中输入的电话号码
                    param["MobilePhone"] = top.encodeXML(phoneNumber);
                    return param;
                }
            }

            /**
             * 不同的操作(发短信或发邮件)有不同的处理方式, 这个在该方法中进行分配
             * @param isExist 表示该联系人是否在通讯录中存在,isExist表示存在
             * @param msg 要提示的信息
             * @param fn  该操作需要调用的函数
             */
            function operate(isExist, msg, fn) {
                // 处理非手机号码作为邮件地址的情况, 需弹出窗让用户输入手机号
                that.inputDialog = top.$Msg.showHTML(getNextHtml(msg, that.cid));
                getElement("btnNext").click(function(){
                    var textValue = $.trim(getElement("txtValue").val());
                    _.isFunction(fn) && fn({
                       isExist : isExist,
                       txtValue : textValue
                    });
                });
            }

            /**
             * 获取弹窗中的模板
             * @param name
             * @param id
             * @returns {*}
             */
            function getNextHtml(name, id) {
                return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="{1}_txtValue" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="{1}_txtMessage" name="divError"  style="color:Red;padding-left:113px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:;"  id="{1}_btnNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
                </div>'.format(name, id);
            }

            /**
             * 根据ID查找弹出窗中相应的元素
             * @param id
             * @returns {*}
             */
            function getElement(id) {
                return that.inputDialog.$el.find("#" + that.cid + "_" + id);
            }

        },
        /**
         * @param email : 邮件地址
         * 此方法用途:
         *  1.根据邮件地址判断是否在通讯录中存在, 存在返回true, 否则返回false
         *  2.将对应的通讯信息保存在model当中
         */
        isExist : function (email) {
            var that = this;
            var address = M139.Text.Email.getEmail(email);
            if (!address) {
                console.warn && console.warn("address: " + address);
                return false;
            }

            var contactInfo = top.M2012.Contacts.getModel().getContactsByEmail(address),
                contact = contactInfo && contactInfo[0],
                info = {};

            if (contact && contact.SerialId) {
                // 存在SerialId, 表示在通讯录中存在(好像有contact的话一定会有SerialId??)
                info.id = contact.SerialId;
                info.email = address;
                // 保存通讯录信息
                that.selfModel.set("contactInfo", $.extend(contact, info));
                return true;
            }

            // 通讯录中不存在时, 保存name和email
            info.name = M139.Text.Email.getName(email);
            info.email = address;
            // 保存通讯录信息
            that.selfModel.set("contactInfo", info);

            console.warn && console.warn("contact: " + contact);
            return false;
        }
    }));
})(jQuery, _, M139);

