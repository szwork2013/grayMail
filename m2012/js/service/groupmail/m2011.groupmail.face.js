$(document).ready(function(){
    FaceBox.init();
    $(document).click(function(){
        if (FaceBox.isShow) {
            FaceBox.hide();
        }
    });
    
});
var FaceBox = {
    callBack: function(e){
    
    },
    pagesize: 21,
    currIndex: 1,
    pagecount: 0,
    init: function(){
        //加载样式		
        var sobj = document.createElement('link');
        sobj.type = "text/css";
        this.resourcePath = window.top.resourcePath.replace("coremail", "groupmail");
        sobj.href = this.resourcePath + "/css/face-box.css";
        sobj.rel = "stylesheet";
        var headobj = document.getElementsByTagName('head')[0];
        headobj.appendChild(sobj);
        templet = "<dl id=\"face-box\" class=\"face-box\" style=\"z-index:99\">\
	<dt>表情</dt>\
	<dd>\
	<div class=\"face-table\">\
		<ul class=\"face-thead\">\
		</ul>\
		<div id=\"face-tbody\" class=\"face-tbody\">\
		</div>\
		<div class=\"face-tfoot\">\
		</div>\
	</div>\
	</dd>\
	<dt style=\"display:none\">艺术签名</dt>\
	<dd>\
	<div class=\"face-qm\">\
		<p><span>您想拥有艺术签名吗？<br />\
		您想写信时带上它吗？</span></p>\
		<p>请将自己的姓名发送至<span class=\"num\">10669988343</span> <br>我们帮您设计出最完美的艺术签名\
		</p>\
		<p>资费：2元/条</p>\
	</div>\
	</dd>\
	<dt style=\"display:none\">大头贴</dt>\
	<dd>\
	<div class=\"face-tt\">\
		<p><span>你想拥有大头贴吗？<br />\
		你想写信时带上自己的大头贴吗？</span> </p>\
		<p>请用彩信发送自己的照片获取！<br />\
		男士发送到<span class=\"num\">1066335521</span><br />\
		女士发送到<span class=\"num\">1066335520</span>（资费2元/条）</p>\
	</div>\
	</dd>\
</dl>";
        $("body").append(templet);
        this.box = $("#face-box");
        this.box.hide();
        this.isShow = false;
        this.loadTitle();
    },
    faces: [{
        "name": "默认",
        "faces": [{
            "title": "",
            "simg": "ico_0.gif",
            "bimg": "ico_0.gif"
        }, {
            "title": "",
            "simg": "ico_1.gif",
            "bimg": "ico_1.gif"
        }, {
            "title": "",
            "simg": "ico_2.gif",
            "bimg": "ico_2.gif"
        }, {
            "title": "",
            "simg": "ico_3.gif",
            "bimg": "ico_3.gif"
        }, {
            "title": "",
            "simg": "ico_4.gif",
            "bimg": "ico_4.gif"
        }, {
            "title": "",
            "simg": "ico_5.gif",
            "bimg": "ico_5.gif"
        }, {
            "title": "",
            "simg": "ico_6.gif",
            "bimg": "ico_6.gif"
        }, {
            "title": "",
            "simg": "ico_7.gif",
            "bimg": "ico_7.gif"
        }, {
            "title": "",
            "simg": "ico_8.gif",
            "bimg": "ico_8.gif"
        }, {
            "title": "",
            "simg": "ico_9.gif",
            "bimg": "ico_9.gif"
        }, {
            "title": "",
            "simg": "ico_10.gif",
            "bimg": "ico_10.gif"
        }, {
            "title": "",
            "simg": "ico_11.gif",
            "bimg": "ico_11.gif"
        }, {
            "title": "",
            "simg": "ico_12.gif",
            "bimg": "ico_12.gif"
        }, {
            "title": "",
            "simg": "ico_13.gif",
            "bimg": "ico_13.gif"
        }, {
            "title": "",
            "simg": "ico_14.gif",
            "bimg": "ico_14.gif"
        }, {
            "title": "",
            "simg": "ico_15.gif",
            "bimg": "ico_15.gif"
        }, {
            "title": "",
            "simg": "ico_16.gif",
            "bimg": "ico_16.gif"
        }, {
            "title": "",
            "simg": "ico_17.gif",
            "bimg": "ico_17.gif"
        }, {
            "title": "",
            "simg": "ico_18.gif",
            "bimg": "ico_18.gif"
        }, {
            "title": "",
            "simg": "ico_19.gif",
            "bimg": "ico_19.gif"
        }, {
            "title": "",
            "simg": "ico_20.gif",
            "bimg": "ico_20.gif"
        }, {
            "title": "",
            "simg": "ico_21.gif",
            "bimg": "ico_21.gif"
        }, {
            "title": "",
            "simg": "ico_22.gif",
            "bimg": "ico_22.gif"
        }, {
            "title": "",
            "simg": "ico_23.gif",
            "bimg": "ico_23.gif"
        }, {
            "title": "",
            "simg": "ico_24.gif",
            "bimg": "ico_24.gif"
        }, {
            "title": "",
            "simg": "ico_25.gif",
            "bimg": "ico_25.gif"
        }, {
            "title": "",
            "simg": "ico_26.gif",
            "bimg": "ico_26.gif"
        }, {
            "title": "",
            "simg": "ico_27.gif",
            "bimg": "ico_27.gif"
        }, {
            "title": "",
            "simg": "ico_28.gif",
            "bimg": "ico_28.gif"
        }, {
            "title": "",
            "simg": "ico_29.gif",
            "bimg": "ico_29.gif"
        }, {
            "title": "",
            "simg": "ico_30.gif",
            "bimg": "ico_30.gif"
        }, {
            "title": "",
            "simg": "ico_31.gif",
            "bimg": "ico_31.gif"
        }, {
            "title": "",
            "simg": "ico_32.gif",
            "bimg": "ico_32.gif"
        }, {
            "title": "",
            "simg": "ico_33.gif",
            "bimg": "ico_33.gif"
        }, {
            "title": "",
            "simg": "ico_34.gif",
            "bimg": "ico_34.gif"
        }, {
            "title": "",
            "simg": "ico_35.gif",
            "bimg": "ico_35.gif"
        }, {
            "title": "",
            "simg": "ico_36.gif",
            "bimg": "ico_36.gif"
        }, {
            "title": "",
            "simg": "ico_37.gif",
            "bimg": "ico_37.gif"
        }, {
            "title": "",
            "simg": "ico_38.gif",
            "bimg": "ico_38.gif"
        }, {
            "title": "",
            "simg": "ico_39.gif",
            "bimg": "ico_39.gif"
        }, {
            "title": "",
            "simg": "ico_40.gif",
            "bimg": "ico_40.gif"
        }, {
            "title": "",
            "simg": "ico_41.gif",
            "bimg": "ico_41.gif"
        }, {
            "title": "",
            "simg": "ico_42.gif",
            "bimg": "ico_42.gif"
        }, {
            "title": "",
            "simg": "ico_43.gif",
            "bimg": "ico_43.gif"
        }, {
            "title": "",
            "simg": "ico_44.gif",
            "bimg": "ico_44.gif"
        }, {
            "title": "",
            "simg": "ico_45.gif",
            "bimg": "ico_45.gif"
        }, {
            "title": "",
            "simg": "ico_46.gif",
            "bimg": "ico_46.gif"
        }, {
            "title": "",
            "simg": "ico_47.gif",
            "bimg": "ico_47.gif"
        }, {
            "title": "",
            "simg": "ico_48.gif",
            "bimg": "ico_48.gif"
        }, {
            "title": "",
            "simg": "ico_49.gif",
            "bimg": "ico_49.gif"
        }, {
            "title": "",
            "simg": "ico_50.gif",
            "bimg": "ico_50.gif"
        }, {
            "title": "",
            "simg": "ico_51.gif",
            "bimg": "ico_51.gif"
        }, {
            "title": "",
            "simg": "ico_52.gif",
            "bimg": "ico_52.gif"
        }, {
            "title": "",
            "simg": "ico_53.gif",
            "bimg": "ico_53.gif"
        }, {
            "title": "",
            "simg": "ico_54.gif",
            "bimg": "ico_54.gif"
        }, {
            "title": "",
            "simg": "ico_55.gif",
            "bimg": "ico_55.gif"
        }, {
            "title": "",
            "simg": "ico_56.gif",
            "bimg": "ico_56.gif"
        }, {
            "title": "",
            "simg": "ico_57.gif",
            "bimg": "ico_57.gif"
        }, {
            "title": "",
            "simg": "ico_58.gif",
            "bimg": "ico_58.gif"
        }, {
            "title": "",
            "simg": "ico_59.gif",
            "bimg": "ico_59.gif"
        }, {
            "title": "",
            "simg": "ico_60.gif",
            "bimg": "ico_60.gif"
        }, {
            "title": "",
            "simg": "ico_61.gif",
            "bimg": "ico_61.gif"
        }, {
            "title": "",
            "simg": "ico_62.gif",
            "bimg": "ico_62.gif"
        }, {
            "title": "",
            "simg": "ico_63.gif",
            "bimg": "ico_63.gif"
        }, {
            "title": "",
            "simg": "ico_64.gif",
            "bimg": "ico_64.gif"
        }, {
            "title": "",
            "simg": "ico_65.gif",
            "bimg": "ico_65.gif"
        }, {
            "title": "",
            "simg": "ico_66.gif",
            "bimg": "ico_66.gif"
        }, {
            "title": "",
            "simg": "ico_67.gif",
            "bimg": "ico_67.gif"
        }, {
            "title": "",
            "simg": "ico_68.gif",
            "bimg": "ico_68.gif"
        }, {
            "title": "",
            "simg": "ico_69.gif",
            "bimg": "ico_69.gif"
        }, {
            "title": "",
            "simg": "ico_70.gif",
            "bimg": "ico_70.gif"
        }, {
            "title": "",
            "simg": "ico_71.gif",
            "bimg": "ico_71.gif"
        }, {
            "title": "",
            "simg": "ico_72.gif",
            "bimg": "ico_72.gif"
        }, {
            "title": "",
            "simg": "ico_73.gif",
            "bimg": "ico_73.gif"
        }, {
            "title": "",
            "simg": "ico_74.gif",
            "bimg": "ico_74.gif"
        }, {
            "title": "",
            "simg": "ico_75.gif",
            "bimg": "ico_75.gif"
        }, {
            "title": "",
            "simg": "ico_76.gif",
            "bimg": "ico_76.gif"
        }, {
            "title": "",
            "simg": "ico_77.gif",
            "bimg": "ico_77.gif"
        }, {
            "title": "",
            "simg": "ico_78.gif",
            "bimg": "ico_78.gif"
        }, {
            "title": "",
            "simg": "ico_79.gif",
            "bimg": "ico_79.gif"
        }, {
            "title": "",
            "simg": "ico_80.gif",
            "bimg": "ico_80.gif"
        }]
    }, {
        "name": "飞信",
        "faces": [{
            "title": "",
            "simg": "smile_angle.png",
            "bimg": "smile_angle.gif"
        }, {
            "title": "",
            "simg": "smile_angry.png",
            "bimg": "smile_angry.gif"
        }, {
            "title": "",
            "simg": "smile_baringteeth.png",
            "bimg": "smile_baringteeth.gif"
        }, {
            "title": "",
            "simg": "smile_confused.png",
            "bimg": "smile_confused.gif"
        }, {
            "title": "",
            "simg": "smile_cool.png",
            "bimg": "smile_cool.gif"
        }, {
            "title": "",
            "simg": "smile_cry.png",
            "bimg": "smile_cry.gif"
        }, {
            "title": "",
            "simg": "smile_embaressed.png",
            "bimg": "smile_embaressed.gif"
        }, {
            "title": "",
            "simg": "smile_eyeroll.png",
            "bimg": "smile_eyeroll.gif"
        }, {
            "title": "",
            "simg": "smile_fool.png",
            "bimg": "smile_fool.gif"
        }, {
            "title": "",
            "simg": "smile_great.png",
            "bimg": "smile_great.gif"
        }, {
            "title": "",
            "simg": "smile_idea.png",
            "bimg": "smile_idea.gif"
        }, {
            "title": "",
            "simg": "smile_naughty.png",
            "bimg": "smile_naughty.gif"
        }, {
            "title": "",
            "simg": "smile_omg.png",
            "bimg": "smile_omg.gif"
        }, {
            "title": "",
            "simg": "smile_regular.png",
            "bimg": "smile_regular.gif"
        }, {
            "title": "",
            "simg": "smile_sad.png",
            "bimg": "smile_sad.gif"
        }, {
            "title": "",
            "simg": "smile_sarcastic.png",
            "bimg": "smile_sarcastic.gif"
        }, {
            "title": "",
            "simg": "smile_shades.png",
            "bimg": "smile_shades.gif"
        }, {
            "title": "",
            "simg": "smile_sick.png",
            "bimg": "smile_sick.gif"
        }, {
            "title": "",
            "simg": "smile_teeth.png",
            "bimg": "smile_teeth.gif"
        }, {
            "title": "",
            "simg": "smile_thinking.png",
            "bimg": "smile_thinking.gif"
        }, {
            "title": "",
            "simg": "smile_tongue.png",
            "bimg": "smile_tongue.gif"
        }, {
            "title": "",
            "simg": "smile_whatchutalkingabout.png",
            "bimg": "smile_whatchutalkingabout.gif"
        }, {
            "title": "",
            "simg": "smile_wink.png",
            "bimg": "smile_wink.gif"
        }, {
            "title": "",
            "simg": "smile_worried.png",
            "bimg": "smile_worried.gif"
        }, {
            "title": "",
            "simg": "smile_yawn.png",
            "bimg": "smile_yawn.gif"
        }, {
            "title": "",
            "simg": "smile_zipit.png",
            "bimg": "smile_zipit.gif"
        }, {
            "title": "",
            "simg": "smile_drink.png",
            "bimg": "smile_drink.gif"
        }, {
            "title": "",
            "simg": "cake.png",
            "bimg": "cake.gif"
        }, {
            "title": "",
            "simg": "cat.png",
            "bimg": "cat.gif"
        }, {
            "title": "",
            "simg": "clock.png",
            "bimg": "clock.gif"
        }, {
            "title": "",
            "simg": "cloud_rain.png",
            "bimg": "cloud_rain.gif"
        }, {
            "title": "",
            "simg": "coffee.png",
            "bimg": "coffee.gif"
        }, {
            "title": "",
            "simg": "computer.png",
            "bimg": "computer.gif"
        }, {
            "title": "",
            "simg": "dog.png",
            "bimg": "dog.gif"
        }, {
            "title": "",
            "simg": "heart.png",
            "bimg": "heart.gif"
        }, {
            "title": "",
            "simg": "heart_broken.png",
            "bimg": "heart_broken.gif"
        }, {
            "title": "",
            "simg": "hug_dude.png",
            "bimg": "hug_dude.gif"
        }, {
            "title": "",
            "simg": "hug_girl.png",
            "bimg": "hug_girl.gif"
        }, {
            "title": "",
            "simg": "kiss.png",
            "bimg": "kiss.gif"
        }, {
            "title": "",
            "simg": "lightbulb.png",
            "bimg": "lightbulb.gif"
        }, {
            "title": "",
            "simg": "martini.png",
            "bimg": "martini.gif"
        }, {
            "title": "",
            "simg": "mobile.png",
            "bimg": "mobile.gif"
        }, {
            "title": "",
            "simg": "moon.png",
            "bimg": "moon.gif"
        }, {
            "title": "",
            "simg": "music_note.png",
            "bimg": "music_note.gif"
        }, {
            "title": "",
            "simg": "present.png",
            "bimg": "present.gif"
        }, {
            "title": "",
            "simg": "rainbow.png",
            "bimg": "rainbow.gif"
        }, {
            "title": "",
            "simg": "rose.png",
            "bimg": "rose.gif"
        }, {
            "title": "",
            "simg": "rose_wilted.png",
            "bimg": "rose_wilted.gif"
        }, {
            "title": "",
            "simg": "snail.png",
            "bimg": "snail.gif"
        }, {
            "title": "",
            "simg": "star.png",
            "bimg": "star.gif"
        }, {
            "title": "",
            "simg": "sun.png",
            "bimg": "sun.gif"
        }, {
            "title": "",
            "simg": "umbrella.png",
            "bimg": "umbrella.gif"
        }]
    }],
    loadTitle: function(A){
        if (document.all) 
            document.execCommand("BackgroundImageCache", false, true);
        $("ul.face-thead").empty();
        $("#face-box>dt").removeClass('cur');
        $("#face-box>dd").removeClass('cur');
        $("#face-box>dt").eq(0).addClass('cur');
        $("#face-box>dd").eq(0).addClass('cur');
        $("#face-box>dt").click(function(){
            $("#face-box>dt").removeClass('cur');
            $("#face-box>dd").removeClass('cur');
            $(this).addClass('cur');
            $(this).next().addClass('cur');
            var evt = A || window.event;
            top.$Event.stopEvent(evt);
        })
        
        $.each(this.faces, function(i, v){
            var templetTitle = $('<li id=' + i + '>' + v.name + '</li>');
            if (i == 0) {
                templetTitle.addClass('cur')
            }
            templetTitle.click(function(){
                $("ul.face-thead>li").removeClass('cur');
                $(this).toggleClass('cur');
                FaceBox.currIndex = 1;
                FaceBox.loadFace()
                var evt = A || window.event;
                top.$Event.stopEvent(evt);
            });
            $("ul.face-thead").append(templetTitle)
            
        });
        
    },
    loadFace: function(A){
        this.loadPage()
        $("div.face-tbody").empty();
        var idx = $("ul.face-thead>li[class*='cur']").attr('id');
        $("div.face-tbody").empty();
        for (var i = (this.currIndex - 1) * this.pagesize; i < this.currIndex * this.pagesize; i++) {
            if (this.faces[idx].faces[i]) {
                v = this.faces[idx].faces[i];
                var simgPath = FaceBox.resourcePath + "/images-face/" + idx + "/" + v.simg;
                var bimgPath = FaceBox.resourcePath + "/images-face/" + idx + "/" + v.bimg;
                var templetFace = $("<span lang=\"" + bimgPath + "\"></span>");
                /*templetFace.hover(function(){
                 $(this).addClass('hover');
                 }, function(){
                 var a = $(this).find('a').get()[0];
                 $(this).removeClass('hover');
                 a.style.backgroundImage = 'none';
                 });*/
                var a = $(templetFace);
                a.css('backgroundImage', "url(" + simgPath + ")");
                a.bind('click', function(){
                    if (FaceBox.callBack) {
                        FaceBox.callBack($(this).attr('lang'));
                        FaceBox.hide();
                    }
                    var evt = A || window.event;
                    top.$Event.stopEvent(evt);
                })
                
                
                $("div.face-tbody").append(templetFace);
            }
            else {
                $("div.face-tbody").append('<span></span>');
            }
        }
        
    },
    loadPage: function(A){
        $("div.face-tfoot").empty();
        var idx = $("ul.face-thead>li[class*='cur']").attr('id');
        this.totalcount = this.faces[idx].faces.length;
        
        if (this.totalcount % this.pagesize > 0) 
            this.pagecount = parseInt(this.totalcount / this.pagesize) + 1
        else 
            this.pagecount = this.totalcount / this.pagesize;
        if (this.pagecount > 1) {
            var templetPage = $('<span>' + this.currIndex + '/' + this.pagecount + '</span>');
            if (this.currIndex > 1) {
                templetPrev = $('<a href="javascript:void(0)">上一页</a>');
                templetPrev.click(function(){
                    FaceBox.prevPage();
                    var evt = A || window.event;
                    top.$Event.stopEvent(evt);
                });
                templetPage.append(templetPrev);
            }
            if (this.currIndex < this.pagecount) {
                templetNext = $('<a href="javascript:void(0)">下一页</a>');
                templetNext.click(function(){
                    FaceBox.nextPage();
                    var evt = A || window.event;
                    top.$Event.stopEvent(evt);
                });
                templetPage.append(templetNext);
            }
            $("div.face-tfoot").append(templetPage);
        }
    },
    nextPage: function(){
        if (this.currIndex < this.pagecount) 
            this.currIndex++;
        this.loadFace()
    },
    prevPage: function(){
        if (this.currIndex > 1) 
            this.currIndex--;
        this.loadFace()
    },
    show: function(top, left, obj){
        this.loadFace();
        this.isShow = true;
        var offset = $(obj).offset();
        this.box.css('top', offset.top + top);
        this.box.css('left', offset.left + left);
        this.box.show();
    },
    hide: function(){
        this.currIndex = 1;
        this.loadTitle();
        this.loadFace();
        this.isShow = false;
        this.box.hide();
    }
};

