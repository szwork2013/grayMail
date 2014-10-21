;
(function ($, _, M139, top) {

    var superClass = M139.View.ViewBase,
        _class = "M2012.Calendar.View.SubscActivity";
    var commonAPI = new M2012.Calendar.CommonAPI();
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var Constant = M2012.Calendar.Constant;

    M139.namespace(_class, superClass.extend({
        template: {
            main: [
                '<div id="{cid}_outer">',
                    '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2>查看活动<a class="back" href="javascript:;" id="{cid}_back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl">',
                        '<form>',
                            '<fieldset class="boxIframeText">',
                                '<legend class="hide">查看活动</legend>',
                                '<ul class="form">',
                                    '<li class="formLine">',
                                        '<label class="label">主题：</label>',
                                        '<div class="element">{title}</div>',
                                    '</li>',
                                    '<li class="formLine">',
                                        '<label class="label">时间：</label>',
                                        '<div class="element">{timeDescription}</div>',
                                    '</li>',
                                '</ul>',
                                '<ul class="form">',
                                    '<li class="formLine">',
                                        '<label class="label">地点：</label>',
                                        '<div class="element">{site}</div>',
                                    '</li>',
                                    '<li class="formLine">',
                                        '<label class="label">内容：</label>',
                                        '<div class="element">{remark}</div>',
                                    '</li>',
                /**
                                       '<li class="formLine" style="display:none;">',
                                            '<div class="repeattips-bottom clearfix"><span class="numFour">验证码：</span><div class="fl"><input type="text" name="" class="iText "></div>',
                                                '<div class="verificationBox" style="display:none;">',
                                                    '<p class="verificationBoxImg"><img src="../../images/module/schedule/img_01.jpg" alt="" title=""></p>',
                                                        '<p class="verificationBoxInfo">图中显示的图案是什么?将你认为正确答案前的<span>字母或数字</span>填入框中（不分大小写）</p>',
                                                        '<a href="javascript:void(0)" class="verificationBoxBtn">看不清，换一张</a>',
                                                    '</div>',
                                                '</div>',
                                            '</li>',*/
                                       '<li class="formLine">',
                                            '<div class="pt_10" id="indentityComponent"></div>',
                                       '</li>',
                                       '</ul>',
                                            '<div class="mt_20 p_relative">',
                                                '<a role="button" hidefocus="" class="btnSetG" href="javascript:;" id="{cid}_copyCalBtn"><span>添加到"我的日历"</span></a>',
                                                '<a role="button" id="{cid}_share" hidefocus="" class="btnSet ml_5" href="javascript:void(0);"><span>分 享</span></a>',
                                                '<div role="tooltip" style="left:0px;top:-32px;display:none;" id="{cid}_tips" class="tips">',
                                                    '<div class="tips-text"><i class="i-ok mr_5"></i>添加成功，默认提前15分钟提醒</div>',
                                                    '<div class="tipsBottom  diamond" style="left:10px;"></div>',
                                                '</div>',
                                            '</div>',
                                            //'<div class="mt_20" style="display:none;">',
                                               // '<a role="button" hidefocus="" class="btnSet btnTbGray" href="javascript:void(0)"><span>添加到“我的日历”</span></a>',
                                            //'</div>',
                                        '</fieldset>',
                                    '</form>',
                        '</div>',
                    '</div>'
            ].join('')
        },
        logger: new M139.Logger({ name: _class }),
        //当前视图名称
        viewName: "subsc_act",

        /**
         *  订阅活动详情查看
         */
        initialize: function (options) {
            var that = this;
            this.master = options.master;
            var EVENTS = that.master.EVENTS;

            function oncreated(args) {
                // 第一次进入页面的时候调用
                if (args.name === that.viewName) {
                    that.master.unbind(that.master.EVENTS.VIEW_CREATED, oncreated);
                    that.model = new M2012.Calendar.Model.SubscActivity(options); //用来保存数据
                    that.container = args.container; // 第一次保存container的值
                   // that.renderData(args, that.initTemplate);

                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                }
            }

            // todo 暂时先这样
            that.master.bind(EVENTS.VIEW_SHOW, function (params) {
                // 如果params中存在name并且args,就认为它是第二次触发
                if (params && params.name === that.viewName && params.args) {

                    that.renderData({ container: that.container }, that.initTemplate);
                }
            });

            that.master.bind(that.master.EVENTS.VIEW_CREATED, oncreated);
        },
        /**
         * 调用getCalendar接口获取初始化数据
         * 参数包括:comeFrom,seqNo,type
         */
        renderData: function (args, fn) {
            var that = this;
            var data = that.master.get("edit_detail_data");
            //清空提交过来的数据
            that.master.set({ edit_detail_data: null });
            var param = { // todo 构造的假数据
                data: {
                    comeFrom: 0,
                    seqNo: data ? data.seqNo : 0,
                    type: 3 // 表示订阅活动
                }
            };


            that.model.getCalendar(param, function (detail, text) {
                fn && typeof fn === 'function' && fn.call(that, args.container, detail);
            }, function (detail) {
                console.error(detail);
            });
        },
        initIdentifyComponent: function () {
            this.identifyComponent = new M2012.Calendar.View.Identify({
                wrap: 'indentityComponent',
                name: 'indentity',
                titleName: '验证码'
            });
        },
        adjustIdentifyComponent: function () {
            var self = this;
            //self.identifyComponent.inputEl.parent().css({position:'absolute', top:0, left:'48px'});
        },
        handlerError: function (detail) {
            var self = this;
            self.adjustIdentifyComponent();
            self.indentityEl.show();
            if ($CUtils.getObjValue(detail.errorCode, Constant.IDENTIFY_CODES)) {
                self.identifyComponent.handerError(detail.errorCode);
            }
        },
        /**
         * 做了三件事情
         * 1.使用初始化时调用接口返回的数据进行模板渲染 2.保存calendarId 3.保存dom节点 4.初始化事件
         * @param container
         * @param obj
         */
        initTemplate: function (container, obj) {
            var data = obj["var"],
                html = "";
            if (data) {
                html = $T.format(this.template.main, {
                    cid: this.cid,
                    title: $.trim(data.title) || '(无)',
                    timeDescription: $.trim(data.dateDescript) || '(无)',
                    site: $.trim(data.site) || '(无)',
                    remark: $.trim(data.content) || '(无)'
                });

                this.model.set("calendarId", data.seqNo); // 保存活动ID,调用复制活动接口的时候需要用到此参数
            }
            container.empty().html(html); // 回显数据
            this.initIdentifyComponent(); // 初始化验证码
            this.defineElements(); // 渲染完成之后调用
            this.initEvents();
        },
        initEvents: function () {
            var that = this;
            this.copy_BtnEl.click(function () {
                that.copyCalendar(); // 点击"添加"按钮时所做的处理
            });

            this.backLinkEl.click(function () {
                that.master.trigger(that.master.EVENTS.NAVIGATE, {
                    path: "view/back"
                });// 点击"返回"链接时所做的处理
            });

            that.shareEl.off("click").on("click", function () {
                top.BH("calendar_subscribe_clickshare"); //点击查看订阅日历活动页面的“分享”人数、次数
                var data = that.model.get("data");
                if (!!data) { //保险点,校验下
                    that.master.trigger(that.master.EVENTS.SHARE_ACTIVITY, data);
                }
            });
        },
        defineElements: function () {
            this.outerEl = $("#" + this.cid + "_outer");
            this.copy_BtnEl = $("#" + this.cid + "_copyCalBtn");
            this.tipsEl = $("#" + this.cid + "_tips");
            this.backLinkEl = $("#" + this.cid + "_back");
            this.indentityEl = $("#indentityComponent");
            this.shareEl = $("#" + this.cid + "_share");
        },
        /**
         * 点击"添加按钮"时的处理
         */
        copyCalendar: function () {
            var param = {
                data: {
                    comeFrom: 0,
                    calendarId: this.model.get("calendarId"),
                    validImg: this.identifyComponent.getData()
                }
            },
            that = this;

            this.model.copyCalendar(param, function (detail, text) {
                // 添加成功后,按钮置灰,显示提示信息,并且提示气泡四秒后消失
                if (detail["code"] == "S_OK") {
                    that.tipsEl.show();
                    that.copy_BtnEl.addClass("btnTbGray").unbind("click");
                    setTimeout(function () {
                        that.tipsEl.hide()
                    }, 4000);
                } else {
                    var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                    info ? $Msg.alert(info) : that.handlerError(detail);
                }
            }, function (detail) {
                console.log('error detail');
            });
        }
    }));

    $(function () {
        new M2012.Calendar.View.SubscActivity({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);
