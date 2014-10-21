/**
* @fileOverview 定义我的应用-无线音乐的文件.
*/
/**
*@namespace 
*我的应用-无线音乐
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Service.Music.View', superClass.extend(
    /**
    *@lends SpamView.prototype
    */
        {
        el: "body",
        initialize: function () {
            this.model = new M2012.Service.Music.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var self = this;
            this.model.getAdvData(function (data) {
                if (data["web_040"] != null) {
                    $("#hotList").html(data["web_040"][0].content);
                }              
                if (data["web_041"] != null) {
                    $("#newList").html(data["web_041"][0].content);
                }
                if (data["web_042"] != null) {
                    $("#downloadList").html(data["web_042"][0].content);
                }
                if (data["web_042"] != null) {
                    $("#recommendList").html(data["web_043"][0].content);
                }
                self.initEvents();
            });
            return superClass.prototype.render.apply(this, arguments);
        },
        setBehavior: function () {

        },
        initEvents: function () {
            $("#newList,#downloadList,#recommendList").find("li").hover(function () {
                $(this).addClass("on");
            }, function () {
                $(this).removeClass("on");
            });
        }
    })
    );
    musicView = new M2012.Service.Music.View();
    musicView.render();
})(jQuery, _, M139);


