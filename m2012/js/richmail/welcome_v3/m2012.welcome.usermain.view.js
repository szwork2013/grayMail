(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.UserMain.View', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
            this.model = options.model;
            this.initEvents();
        },
        initEvents : function(){
            var self = this;
            //G3通话链接跳转
            $("#g3Btn").click(function (e) {
                var json = getCkey();
                json.a = "g3";
                top.$App.show("G3Phone", json);
                e.preventDefault();
            });

            $("#shequLink").click(function(){
                top.$App.show("shequ", getCkey());
            });

            $("#linkFetion").click(function(){
                self.showFetion();
            });
            
            top.$App.on('showFetion',function(){
                self.showFetion();
            });

            function getCkey(){
                var g3PhoneModel = new top.M2012.G3.Model();
                g3PhoneModel.getParam();
                return g3PhoneModel.get("param");
            }
        },
        renderFetion: function(){
            var fetionElemInTop = top.$("#fetionElemTop");
            var fetionElemOffsetInWelcome = $("#fetionElem").show().offset();
            $("#fetionElem").hide();
            var fetionElemOffsetInWelcomeTopValue = fetionElemOffsetInWelcome.top;
            var fetionElemTopValueInTop = fetionElemOffsetInWelcomeTopValue + 28;

            if (fetionElemInTop.length == 0) return;
            //重新定位顶层飞信元素的位置
            fetionElemInTop.css({
                left: fetionElemOffsetInWelcome.left - 6 ,
                top: fetionElemTopValueInTop - 31
            });

            //如果当前标签页为欢迎页，显示飞信，否则隐藏
            top.$App.getCurrentTab().name == "welcome" ? fetionElemInTop.show() : fetionElemInTop.hide();

            $(window).scroll(function(){
                //飞信图标随滚动条的滚动而移动
                var scrollHeight = $(document).scrollTop();

                fetionElemInTop.css({top: fetionElemTopValueInTop - scrollHeight - 31});
                scrollHeight > fetionElemOffsetInWelcomeTopValue ? fetionElemInTop.hide() : fetionElemInTop.show();
            });

            $(window).bind("resize", function(){
                fetionElemOffsetInWelcome = $("#fetionElem").show().offset();
                $("#fetionElem").hide();
                fetionElemOffsetInWelcomeTopValue = fetionElemOffsetInWelcome.top;
                fetionElemTopValueInTop = fetionElemOffsetInWelcomeTopValue + 28;

                //重新定位顶层飞信元素的位置
                fetionElemInTop.css({
                    left: fetionElemOffsetInWelcome.left - 6,
                    top: fetionElemTopValueInTop - 31
                });
            })
        },
        //打开飞信窗口
        showFetion: function () {
            var self = this;
            if(top.$App.getConfig('ckey')){
                top.$App.show("fetion", { c: top.$App.getConfig('ckey') });
            }else{
                self.model.getFetionC(function (result) {
                    var ckey = "";
                    if (result && result["ckey"] && result["ckey"]["c"]) {
                        ckey = result["ckey"]["c"];
                    }
                    top.$App.registerConfig('ckey',ckey);
                    top.$App.show("fetion", { c: ckey });
                    self.changeLinkConfig('fetion',{ c: ckey });
                });
            }
        },

        changeLinkConfig:function(linkkey,obj){
            var url = top.LinkConfig[linkkey].url;
            url = top.$T.Url.makeUrl(url,obj);
            top.LinkConfig[linkkey].url = url;
        },

        render: function () {
            this.renderFetion();
		},
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);

