var faceMenuHtml =
'<div id="expTip">\
  <div class="expTipBox">\
    <ul>\
	  <li class="expTipOn" rel="_face1">信封脸</li>\
      <li rel="_face2" onclick="FaceMenu.loadFace(2);this.onclick=null">YOYO</li>\
      <li rel="_face3" onclick="FaceMenu.loadFace(3);this.onclick=null">豆豆</li>\
	  <li rel="_fetionFace" onclick="FaceMenu.loadFetionFace(0);this.onclick=null">飞信</li>\
    </ul>\
  </div>\
  <div class="expTipContent">\
  	<div id="_face1" style="width:100%;height:170px;"></div>\
	<div id="_face2" style="width:100%;height:170px;display:none"></div>\
	<div id="_face3" style="width:100%;height:170px;display:none"></div>\
    <div id="_fetionFace" style="width:100%;height:170px;display:none"></div>\
  </div>\
</div>\
<div id="_fetionFaceBar" class="expPAge"></div>\
<div id="_faceBar" class="expPAge"></div>';

var isShowHeadList =  "none";

FaceMenu = {
    init: function(element) {
        FaceMenu.container = element;
        element.innerHTML = faceMenuHtml;
        var tabs = $(".expTipBox li", element);
        var contents = $("#_fetionFace,#_face1,#_face2,#_face3,#_artSign,#_purikura", element);
        var bars = $("#_fetionFaceBar,#_faceBar,#_artSignBar,#_purikuraBar", element);
        //切换标签
        tabs.click(function() {
            tabs.removeClass("expTipOn");
            $(this).addClass("expTipOn");
            contents.hide();
            bars.hide();
            var rel = $(this).attr("rel")
            $("#" + rel + ",#" + rel + "Bar", element).show();
        })

		this.loadFace(1);
    },

    loadFetionFace: function() {
        var container = $("#_fetionFace");
        var pageBar = $("#_fetionFaceBar");
		this.currFaceIndex=null;
        with (FaceMenu.fetionFaceConfig) {
            if (pageIndex >= pageCount) {
                pageIndex = pageCount - 1;
            } else if (pageIndex < 0) {
                pageIndex = 0;
            }
            var htmlCode = "";
            for (var i = pageIndex * pageSize,
                len = (pageIndex + 1) * pageSize,
                count = data.length;
                i < len && i < count;
                i++) {
                htmlCode += data[i];
            }
            container.html(htmlCode);
            htmlCode = pageIndex + 1 + "/" + pageCount + "<a href='javascript:;' onclick='FaceMenu.fetionFaceConfig.pageIndex--;FaceMenu.loadFetionFace();'>&lt;&lt;上一页</a><a href='javascript:;' onclick='FaceMenu.fetionFaceConfig.pageIndex++;FaceMenu.loadFetionFace();'>下一页&gt;&gt;</a>";
            pageBar.html(htmlCode);
        }
    },
	/**
	 * 加载表情
	 * @param {int} 必选参数 faceIndex 表情序号：1=信封脸，YOYO=2，豆豆=3，对应ourFaceConfig中的config数组下标
	 */
    loadFace: function(faceIndex) {
		//表情容器
        var container = $("#_face"+faceIndex),
		//分页容器
		pageBar = $("#_faceBar"),
		//所有表情html
		htmlCode = "",
		//当前页下标
		pageIndex=FaceMenu.ourFaceConfig.pageIndex||0,
		//总页数
		pageCount=FaceMenu.ourFaceConfig.pageCount||0,
		//分页显示数量
		pageSize=FaceMenu.ourFaceConfig.pageSize||0,
		//得到表情数据
		data=FaceMenu.ourFaceConfig.getData(faceIndex)||null;
		//当前表情序号
		this.currFaceIndex=faceIndex;
        if (data) {
			//计算页下标
            if (pageIndex >= pageCount) {
                pageIndex = pageCount - 1;
            }
            else if (pageIndex < 0) {
                    pageIndex = 0;
                }
			//遍历数据集合，累加成html字符串
            for (var i = pageIndex * pageSize, len = (pageIndex + 1) * pageSize, count = data.length; i < len && i < count; i++) {
                htmlCode += data[i];
            }
			//加入到表情容器中
            container.html(htmlCode);
        }
		container=pageBar=data=null;
    },
    imgClick: function(url) {
		top.addBehavior("插入表情");
        editorAgent.insertImage(url);
    },
    fetionFaceConfig: {
        data: getFetionFaceConfigData(),
        pageSize: 40,
        pageIndex: 0,
        pageCount: 2
    },
    faceConfig: {
        data: get139OldFaceConfigData(),
        pageSize: 40,
        pageIndex: 0,
        pageCount: 1
    },
	//139表情配置
    ourFaceConfig: {
		config:[null,//占位对象
		{folder:"mailer",title:"信封脸",dataCount:18,itemTitles:["害羞", "色", "可爱", "鄙视", "哭", "闭嘴", "冷汗", "抓狂", "衰", "晕", "憨笑", "大骂", "鼓掌", "飞吻", "馋", "偷笑", "可怜", "流泪"]},
		{folder:"YoYo",title:"YOYO",dataCount:24,itemTitles:["撒娇", "惊奇", "眨眼", "无精打采", "乖乖", "俏皮", "淘气", "卡哇伊", "跳舞", "流汗", "打哈欠", "兴奋", "发呆", "帅气", "爱美", "大哭", "悟空", "色咪咪", "西瓜太郎", "兔女郎", "藐视", "疑问", "同情", "牛郎"]},
		{folder:"DouDou",title:"豆豆",dataCount:19,itemTitles:["假笑", "开心", "坏笑", "晴转阴", "愁", "窘", "微笑", "傻笑", "抛媚眼", "装酷", "哭了", "爱慕", "调皮", "见钱眼开", "耍帅", "哈哈笑", "鼠眉鼠眼", "打盹", "生病了"]}],
		/**
		 * 得到数据
		 * @param {int} 必选参数 faceIndex 表情序号：1=信封脸，YOYO=2，豆豆=3，对应ourFaceConfig中的config数组下标
		 */
        getData: function(faceIndex){
			//表情html模板
            var template = "<a href='javascript:;'\
			title='{title}' \
			style='float:left;margin:5px;display:block;width:20px;height:20px;background-position:-{x}px 0px;background-repeat:no-repeat;background-image:url({resourcePath}/images/face/{folder}/thumb{pngIndex}.png)' \
            tag='{resourcePath}/images/face/{folder}/{index}.gif' \
            rel='{index}' \
            onclick='FaceMenu.imgClick(this.getAttribute(\"tag\"));return false;' onmouseout='hideRealImage()' onmouseover='showRealImage(this,this.getAttribute(\"tag\"))'></a>",
			//以数据形式存放每个表情的html字符串
			result = [],
			//表情所在的文件夹
			folder=this.config[faceIndex].folder||"",
			//表情总数
			dataCount=this.config[faceIndex].dataCount||0,
			//表情title数组
			arrTitle=this.config[faceIndex].itemTitles;
			//按模板组合数据，放到result中
            for (var i = 0; i < dataCount; i++) {
                var item = String.format(template, {
					title:arrTitle[i],
					pngIndex:faceIndex,//表情序号
					folder:folder,//文件夹
                    index: i,//当前表情下标
                    x: i * 30,//png图片x轴值
                    resourcePath: top.resourcePath//站点路径前缀
                });
				//放到数组中
                result.push(item);
            }
            return result;
		},
        pageSize: 40,//每页显示数量
        pageIndex: 0,//当前分页下标
        pageCount: 2//总页数
    }
}
function showRealImage(host,url){
    var realImageLayout = $("#realImageLayout");
    if(realImageLayout.length==0){
        realImageLayout = $("<div id='realImageLayout' style='position:absolute;z-index:100;border:1px solid silver;background:white;padding:15px'><img style='border:0;' width='48' height='48' /></div>").appendTo(FaceMenu.container);
    }
    var jHost = $(host);
    var offset = jHost.offset();
    var index = host.getAttribute("rel");
    var left = 160;
    if(index){
        index = parseInt(index);
        if(index%9>4){
            left = 30;
        }
    }
    realImageLayout.css({
        top: 100,
        left: left,
        display: ""
    });
    realImageLayout.find("img").attr("src", url);
}
function hideRealImage(){
    $("#realImageLayout").hide();
}
function getFetionFaceConfigData(){
    var list = ["smile_angle.gif", "smile_angry.gif", "smile_baringteeth.gif", "smile_confused.gif", "smile_cool.gif", "smile_cry.gif",  "smile_embaressed.gif", "smile_eyeroll.gif", "smile_fool.gif", "smile_great.gif", "smile_idea.gif", "smile_naughty.gif", "smile_omg.gif", "smile_regular.gif", "smile_sad.gif", "smile_sarcastic.gif", "smile_shades.gif", "smile_sick.gif", "smile_teeth.gif", "smile_thinking.gif", "smile_tongue.gif", "smile_whatchutalkingabout.gif", "smile_wink.gif", "smile_worried.gif", "smile_yawn.gif", "smile_zipit.gif","smile_drink.gif","cake.gif", "cat.gif", "clock.gif", "cloud_rain.gif", "coffee.gif", "computer.gif", "dog.gif", "heart.gif", "heart_broken.gif", "hug_dude.gif", "hug_girl.gif", "kiss.gif", "lightbulb.gif", "martini.gif", "mobile.gif", "moon.gif", "music_note.gif", "present.gif", "rainbow.gif", "rose.gif", "rose_wilted.gif", "star.gif", "sun.gif", "umbrella.gif",  "snail.gif"];
    var titleList = ["天使","生气","咬牙切齿","困惑","酷","大哭","尴尬","思考","惊呆","拳头","好主意","偷笑","惊讶","睡着了","悲伤","鄙视","微笑","生病了","大笑","沉思","眨眼","失望","天真","担心","困","吓到","饮料","生日蛋糕","猫脸","闹钟","下雨","咖啡","计算机","狗脸","红心","心碎","女生抱抱","男生抱抱","香吻","灯泡","酒杯","手机","月亮","音乐","礼物","彩虹","玫瑰","凋谢","星星","太阳","雨伞","蜗牛"];
    var template = "<a title='{title}' href='javascript:;'\
     style='float:left;margin:5px;display:block;width:20px;height:20px;background-position:-{x}px 0px;background-repeat:no-repeat;background-image:url({rmResourcePath}/images/face/fetion/thumb.png)' \
        tag='{rmResourcePath}/images/face/fetion/{filename}' \
        rel='{index}' \
        onclick='FaceMenu.imgClick(this.getAttribute(\"tag\"));return false;' onmouseout='hideRealImage()' onmouseover='showRealImage(this,this.getAttribute(\"tag\"))'>\
        </a>";
    var result = [];
    for(var i=0;i<list.length;i++){
        var item = String.format(template, {
            filename: list[i],
            title: titleList[i],
            index: i,
            x: i * 30,
            rmResourcePath: top.rmResourcePath
        });
        result.push(item);
    }
    return result;
}
function get139OldFaceConfigData(){
    var list = [];
    var titleList = ["微笑", "礼物", "白眼", "调皮", "发呆", "眨眼", "流汗", "惊呆", "大哭", "脸红", "迷倒", "酷", "发怒", "睡着了", "撇嘴", "打电话", "听歌", "思考", "滴汗", "嘘", "捂嘴", "打哈欠", "圣诞", "天使", "咖啡", "炸弹", "信封", "礼物", "太阳", "月亮", "男人", "女性", "穿心", "心碎", "玫瑰", "凋谢", "强", "弱", "差劲", "胜利"];
    var template = "<a title='{title}' href='javascript:;'\
     style='float:left;margin:5px;display:block;width:20px;height:20px;background-position:-{x}px 0px;background-repeat:no-repeat;background-image:url({rmResourcePath}/images/face/139old/thumb.png)' \
        tag='{rmResourcePath}/images/face/139old/ico_{index}.gif' \
        rel='{index}' \
        onclick='FaceMenu.imgClick(this.getAttribute(\"tag\"));return false;' onmouseout='hideRealImage()' onmouseover='showRealImage(this,this.getAttribute(\"tag\"))'>\
        </a>";
    var result = [];
    for(var i=0;i<titleList.length;i++){
        var item = String.format(template, {
            title: titleList[i],
            index: i,
            x: i * 30,
            rmResourcePath: top.rmResourcePath
        });
        result.push(item);
    }
    return result;
}