(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.CustomTab.View', superClass.extend(
    {
        el: "body",
        template: ['<div class="boxIframeText" style="position:relative;">',
             '<ul class="diywelcome clearfix" id="ul_customTab">',
                 '<li class="gray"><input type="checkbox" checked="checked" rel="recommand" disabled="disabled"><label for="">邮箱推荐(默认)</label></li>',
                 '<li><input id="userCenterItem" type="checkbox" rel="userCenter"><label for="userCenterItem">用户中心</label></li>',
                 '<li><input id="laboratoryItem" type="checkbox" rel="uecLab"><label for="laboratoryItem">实验室</label></li>',
                 '<li><input type="checkbox" checked="checked" rel="business" id="business"><label for="business">精品业务</label></li>',
                 '<li><input id="mmarket" type="checkbox" rel="mmarket"><label for="mmarket">应用商城</label></li>',
                 '<li class="gray" style="display:none"><input id="billCharge" type="checkbox" rel="billCharge" disabled="disabled"><label for="billCharge">邮箱营业厅</label></li>',
             '</ul>',
             '<p id="tipTabSet" style="position:absolute; left:16px;bottom:-29px;color:#333;">{0}</p>',
         '</div>'].join(""),
        msg: {
            MAXADD: "最多可添加4项，添加满时，需取消一项再添加另一项",
            MINADD: "最少需添加2项推荐内容"
        },
        events: {
            "click input": "changeSetting"
        },
        initialize: function (options) {
            this.model = options.model;
        },
        changeSetting:function(){
            var ableInput = this.$("#ul_customTab input");
            var noCheckedInput = ableInput.not(":checked");
            var checkedInputLen = ableInput.filter(":checked").length;
            var tipTabSet = this.$("#tipTabSet");
            var color = {
                mark: "red",
                normal: "#333"
            };
            var tipHtml = "";
            var colorValue = "";
            var isDisabled = false;

            if (checkedInputLen < 2) {
                colorValue = color["mark"];
                tipHtml = this.msg.MINADD;
            } else if (checkedInputLen > 4) {
                colorValue = color["mark"];
                tipHtml = this.msg.MAXADD;
                isDisabled = true;
            } else {
                colorValue = color["normal"];
                tipHtml = this.msg.MAXADD;
            }
            tipTabSet.html(tipHtml).css({"color": colorValue});
            $.each(noCheckedInput, function(){
                this.disabled = isDisabled;
            });
        },
        render: function () {
            var self = this;

            this.dialog = top.$Msg.showHTML(this.template.format(this.msg.MAXADD), function (e) {
                self.okHandler(e);
            }, function (e) {
                //self.cancelHandler();
            }, {
                dialogTitle: "定制推荐的内容",
                width: 540,
                buttons: ["确定", "取消"]
            });

            if (top.SiteConfig.billAllowProvince[top.$User.getProvCode()]) {
                top.$('input#billCharge').parent().show();
            }
            this.setElement(this.dialog.el);
            this.initTabOptions();
            return superClass.prototype.render.apply(this, arguments);
        },
        initTabOptions: function () {
            var self = this;
            this.$("#ul_customTab input").each(function (i,n) {
                var tabName = $(this).attr("rel");
                $(this).attr("checked",self.model.getTabVisible(tabName));
               
            })
            
        },
        okHandler: function (e) {
            var self = this;
            var result = "";
            
            var ableInput = this.$("#ul_customTab input");
            var ableInputLen = ableInput.filter(":checked").length;

            if (ableInputLen < 2 || ableInputLen > 4) {//除了默认项 添加少于1项,多于3项提示
                e.cancel = true;
                this.flickerAnimate();
                return;
            }
            
            ableInput.each(function (i, n) {
                var tabName = $(this).attr("rel");
                if ($(this).attr("checked")) {
                    result += tabName + ",";
                }
            });
            if (result != "") {
                this.model.setTabData(result);
            }
            
            BH("welcome_tabSet_okBtn");
        },
        
        flickerAnimate: function(){
            var self = this;
            var i = 3;//闪烁3次

            var toggleTip = function(){
                self.$("#tipTabSet").toggle();
            };
            var timer = setInterval(function(){
                if (!i--) {
                    clearInterval(timer);
                    return;
                }

                toggleTip();
                setTimeout(function(){
                    toggleTip();
                }, 50);
            }, 150);
        }
        
       
    })); 
})(jQuery, _, M139);

