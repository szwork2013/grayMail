/**
* @fileOverview 邮件备注视图
  * #listtips 列表页提示层 body结束前
  * #listremark 列表页编辑层 body结束前
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 邮件备注,列表页备注,读信页备注
    */

    M139.namespace('M2012.Remark.View', superClass.extend({
        /** 过滤空白 */
        filterNull: function (v) {
            return v.replace(/\s+/g, "").replace(/[\u3000]+/g, "").replace(/\$/ig, "");//过滤半角空格
        },

        initEvents: function () {

            //计算字数
            var self = this;
            var mid = self.model.get("mid");
            var el = $(self.el);

            var countText = function () {
                var nulltips = el.find(".nulltips");
                var This = this;
                var value = $(This).val();
                value = self.filterNull(value);
                value = value.replace(/\s+/g, " ");       //过滤半角空格
                value = value.replace(/[\u3000]+/g, " "); //过滤全角空格
                value = value.replace(/\$/ig, "");

                var thisval = value.length > self.max ? value.substr(0, self.max) : value;
                var inputlen = self.max - thisval.length;
                thisval.length > 0 ? nulltips.hide() : nulltips.show();
                $(this).val(thisval);
                el.find(".bibText .yel").html(inputlen);
            };

            el.find('a[name=remark_edit],a[name=remark_editlist]').live('click', function () {
                self.editRemark();
            });
            el.find('a[name=remark_delete]').live('click', function () {
                self.deleteConfirm();
            });
            el.find('a[name=remark_edit_cancel]').live('click', function () {
                self.editCancel();
            });
            el.find('a[name=remark_edit_save]').live('click', function () {
                self.editSave();
            });
            el.find('a[name=remark_add]').live('click', function () {
                self.addRemark();
            });

            el.find("textarea.remarkcontent")
               .live('keyup', countText)
               .live('focus', countText);

            //console.log(self.model.get('showtype'));
            if (self.model.get('showtype') == 'list') {
                //处理列表情况
                //鼠标在备注小图标上
                $('.dayAreaTable a.i_note_y').live('mouseover', function () {
                    var mid = $(this).attr("mid");
                    self.model.set({ mid: mid, showtype: 'list' });
                    self.showTips();
                    $('#listremark').remove();
                }).live('mouseleave', function () {
                    self.hideTips();
                });

                //鼠标在tips上   
                $('#listtips').live('mouseover', function () {
                    self.onTips();
                }).live('mouseleave', function () {
                    console.log('leave');
                    self.hideTips();
                });

                //消失编辑框
                var canceltimer;
                $('#listremark').live('mouseleave', function () {
                    canceltimer = setTimeout(function () {
                        $('#listremark').remove();
                    }, 500);
                }).live('mouseover', function () {
                    clearTimeout(canceltimer);
                });
            }


        },

        template: {

            //邮件列表备注提示层 td5加一个div
            tips: ['<div  class="remarkTips shadow" style="position:absolute;width:310px;{1}" id="{2}">',
                    '<div class="remarkTips-title clearfix">',
                        '<span class="fl fw_b">备注:</span>',
                        '<span class="fr"><a href="javascript:;" name="remark_editlist">编辑</a> <a href="javascript:;" name="remark_delete">删除</a></span>',
                    '</div>',
                    '<p style="text-align:left">{0}</p>',
                  '</div>'],

            //读信页备注显示
            show: ["<span class='rMl'>备&#12288;注：</span>",
                    "<div class='rMr'>",
                         "<div class='remarkTips shadow'>",
                             "<p>{0}</p>",
                             "<div class='remarkTips-title clearfix p_relative'>",
                                 "<span class='fr'>",
                                     "<a href='javascript:;' name='remark_edit' >编辑</a>&nbsp;&nbsp;",
                                     "<a href='javascript:;' name='remark_delete'>删除</a>",
                                 "</span>",
                             "</div>",
                         "</div>",
                    "</div>"],

            //备注编辑模版      
            edit: ['<div class="sTips shadow sTipsRemind" style="{2}" id="{3}">',
                    '<fieldset class="p_relative" >',
                        '<label class="nulltips" style="display:none;position:absolute;top:5px;left:5px;color:gray">请输入备注内容</label>',
                        '<legend class="hide"></legend>',
                        '<textarea class="remidText inShadow remarkcontent" name="remarktext" >{0}</textarea>',
                        '<div class="sTipsBtn">',
                            '<span class="bibText">还可输入<strong class="yel"></strong> 字</span>',
                            '<span class="bibBtn">',
                                '<a class="btnSure" href="javascript:void(0)" name="remark_edit_save" rel="{1}"><span>确 定</span></a>&nbsp;',
                                '<a class="btnNormal" href="javascript:void(0)" name="remark_edit_cancel" ><span>取 消</span></a>',
                            '</span>',
                        '</div>',
                    '</fieldset>',
                 '</div>']



        },

        initialize: function () {
            var self = this;
            this.model = new M2012.Remark.Model();
            this.showtemp = self.template.show.join('');
            this.edittemp = self.template.edit.join('');
            this.tipstemp = self.template.tips.join('');
            this.max = this.model.get("max");
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /** 获取列表备注显示位置 */
        getPosition: function () {
            var self = this;
            var mid = self.model.get('mid');
            if (self.model.get("showtype") == 'list') {
                //var offset = $('#list_ico_'+mid).find('.i_note_y').offset();
                var offset = $($App.getMailboxView().el).find('#div_maillist tr[mid=' + mid + ']').find('.i_note_y').offset();
                var leftpx = offset.left + 11;
                var toppx = offset.top - 62;
                return $T.Utils.format('left:{0}px;top:{1}px;z-index:999', [leftpx, toppx]);
            } else {
                return '';
            }
        },

        /**
        *列表页备注提示
        */
        showTips: function () {
            var self = this;
            if ($('#listtips').length == 0) {
                var mid = self.model.get("mid");
                self.model.set({ opType: 'get' });
                self.model.remarkDataSource(function (dataSource) {
                    if (dataSource.memo != null) {
                        var html = $T.Utils.format(self.tipstemp, [$T.Utils.htmlEncode(dataSource.memo), self.getPosition(), 'listtips']);
                        $('#remarkContainer').append(html);
                    }
                });
            }
            clearTimeout(self.timer);
            $(".dayAreaTable").find(".sTips").remove(); //删除编辑框
        },

        /**
        * 鼠标在备注提示层上时不消失
        */
        onTips: function (e) {
            var self = this;
            clearTimeout(self.timer);
            $('#listtips').show();
        },

        /**
        * 鼠标移开时备注提示层消失
        */
        hideTips: function (e) {
            var self = this;
            self.timer = setTimeout(function () {
                $('#listtips').remove();
            }, 500);
        },

        /** 确认删除 */
        deleteConfirm: function () {
            var self = this;
            $Msg.confirm(
                '你确定要删除该邮件的备注吗？',
                function () {
                    self.deleteRemark();
                },
                {
                    icon: "warn"
                }
            );
        },

        /**
        * 删除备注
        */
        deleteRemark: function () {
            var self = this;
            var mid = self.model.get("mid");
            var remark = $(self.el).find(".remarkTips p").html();
            self.model.set({ opType: 'delete', mid: mid, memo: remark });
            self.model.remarkDataSource(function (dataSource) {
                self.editCancel();
                M139.UI.TipMessage.show("备注删除成功", { delay: 3000 });
                //列表页删除
                if (self.model.get("showtype") == 'list') {
                    $(self.el).find(".remarkTips").remove();
                    $App.trigger("showMailbox", { comefrom: "commandCallback" });
                    $App.validateTab("readmail_" + mid);
                }
                else {
                    $(self.el).find("#readremark_" + mid).html('').hide();
                    appView.trigger("mailboxDataChange");
                }
                $(self.el).find(".i_note_y").removeClass("i_note_y");
                self.refreshSplit();//分栏刷新
            });

        },

        /**
        * 读信页增加备注
        */
        addRemark: function () {
            var self = this;
            if ($(".sTipsRemind").length > 0) {
                self.repeatTips();
                return;
            }
            if (!$(self.el).find("i.i_note").hasClass("i_note_y") && $(self.el).find(".remarkcontent").length == 0) {
                var mid = self.model.get("mid");
                var style = "position:absolute;top:5px;right:100px";
                $(self.el).find(".readmialTool").after($T.Utils.format(self.edittemp, ['', 'add', style]));
                $(self.el).find(".remarkcontent").focus();
            }
        },

        /** 重复编辑框判断 */
        repeatTips: function () {
            M139.UI.TipMessage.show("如须编辑其他备注，请关闭正在编辑的备注 ", { delay: 3000 });
            $(".sTipsRemind")[0].focus();
        },

        /**
        *备注编辑
        */
        editRemark: function () {
            var self = this;
            if ($(".sTipsRemind").length > 0) {
                self.repeatTips();
                return;
            }
            var mid = self.model.get("mid");
            if (self.model.get("showtype") == 'list') { //列表
                var remark = $("#listtips p").html();
                var style = 'position:absolute;' + self.getPosition();
                $('#listremark').length == 0 && $('#remarkContainer').append($T.Utils.format(self.edittemp, [remark, 'update', style, 'listremark']));
                $('body').find("#listtips").remove();
            } else { //读信
                var remark = $(self.el).find("#readremark_" + mid + " .remarkTips p").html();
                var style = "position:absolute;top:-100px;right:0px";
                $(self.el).find("#readremark_" + mid + " .remarkTips-title").append($T.Utils.format(self.edittemp, [remark, 'update', style, 'rmremark']));
            }
            //$(self.el).find(".remarkcontent").focus();
            $T.Utils.textFocusEnd($(self.el).find(".remarkcontent")[0]);
        },

        showTopTips: function (optype) {
            if (optype == 'add') {
                M139.UI.TipMessage.show("备注添加成功", { delay: 3000 });
            } else {
                M139.UI.TipMessage.show("备注修改成功", { delay: 3000 });
            }
        },

        /**
        *取消编辑
        */
        editCancel: function () {
            var self = this;
            $(self.el).find(".sTips").remove();
        },

        /**
        * 保存备注
        */
        editSave: function (e) {

            var self = this;
            var resRemark = '';
            var mid = self.model.get("mid");
            var text = $(self.el).find(".remarkcontent");
            var remark = self.filterNull(text.val());
            var optype = $(self.el).find('a[name=remark_edit_save]').attr("rel"); //新增or编辑
            if (remark.length == 0) { return; }
            if (remark.length > this.max) {
                $Msg.alert("备注最多输入" + this.max + "字");
                return;
            }
            //remark = M139.Text.Utils.htmlEncode(remark);
            resRemark = $T.Utils.htmlEncode(remark); //encode处理
            self.model.set({ opType: optype, mid: mid, memo: remark });
            self.model.remarkDataSource(function (dataSource) {
                self.editCancel();
                self.showTopTips(optype); //顶部提示
                if (optype == 'add') {
                    BH('readmail_addremarkok');
                }
                if (self.model.get("showtype") == 'list') {
                    //列表页打开
                    if (optype == 'add') {
                        var html = $T.Utils.format(self.tipstemp, [$T.Utils.htmlEncode(dataSource.memo)], 'tipstemp');
                        $(self.el).append(html);
                    } else {
                        $(self.el).find(".remarkTips p").html(resRemark);
                    }
                    $App.validateTab("readmail_" + mid);
                    //会话邮件打开
                } else if (self.model.get("showtype") == 'sessionmail') {

                    $(self.el).find("#readremark_" + mid).html($T.Utils.format(self.showtemp, [resRemark])).show();
                    $(self.el).find("#readremark_" + mid + " .remarkTips p").html(resRemark);
                    //刷新列表
                    appView.trigger("mailboxDataChange");
                }
                else {

                    //读信页打开
                    $(self.el).find("#readremark_" + mid).html($T.Utils.format(self.showtemp, [resRemark])).show();
                    $(self.el).find("#readremark_" + mid + " .remarkTips p").html(resRemark);
                    appView.trigger("mailboxDataChange");
                }

                $(self.el).find(".i_note").addClass("i_note_y");
                self.refreshSplit();//分栏刷新
            });


        },

        //分栏读信同步刷新
        refreshSplit: function () {
            if (!/mailbox_|mailsub_/i.test($App.getCurrentTab().name)) { return }
            if ($App.getLayout() == 'left' || $App.getLayout() == 'top') {
                $App.trigger("showMailbox");
                $App.trigger("refreshSplitView");
            }
        },

        render: function () {
            var self = this;
            var mid = self.model.get("mid");
            self.model.remarkDataSource(function (dataSource) {
                if (dataSource.memo != null) {
                    var content = $T.Utils.format(self.showtemp, [$T.Utils.htmlEncode(dataSource.memo)]);
                    $(self.el).find("#readremark_" + mid).html(content).show();
                    //新窗口读信
                    if (location.search.indexOf("t=newwin") > -1) { $(".remarkTips-title .fr").v }
                }
            });
        }

    }));


    $D.appendHTML(document.body,'<div id="remarkContainer"></div>');
    var listremarkview = new M2012.Remark.View({ el: '#remarkContainer', showtype: 'list' });
    listremarkview.model.set({ mid: null, showtype: 'list' });
    listremarkview.initEvents();

})(jQuery, _, M139);


