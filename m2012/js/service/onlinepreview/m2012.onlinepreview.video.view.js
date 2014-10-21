



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Video.View', superClass.extend({

        /**
        *@lends M2012.Service.OnlinePreview.Video.View.prototype
        */
        initialize: function () {
            this.initEvents();
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            this.mainView.appendHeaderHtml(obj);
            this.getData();
        },
        initEvents: function () {
            var self = this;
            this.resize();
        },
        createiframe: function () {
			var frame_url = "video.html?sid=" + sid + "&embed=1";
			var jFrame = $('<iframe allowfullscreen mozallowfullscreen webkitallowfullscreen id="videoIframe" name="previewIframe" width="100%" frameborder="no"></iframe>')
			
	        frame_url += "&presentURL=" + urlParams.dl + "&mediaType=" + urlParams.mediaType;

            jFrame.load(function () {
                $("#loadingStatus").remove();
                $(".footerBar").hide();
            }).attr("src", frame_url).appendTo("#attrIframe");
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height()-100;
            $(".contentHeight").height(height);
            $("#videoIframe").height(height);
            $("#previewContent").css({ background: "none", height: "auto",marginTop:"60px" })
        },
        getData: function (options, obj) {
            this.template();
            this.createiframe();
            this.setHeight();
        },
        template: function () {
            var tableArr = [{}];
            var str = $("#txtTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);

        }
    }));

})(jQuery, _, M139);
