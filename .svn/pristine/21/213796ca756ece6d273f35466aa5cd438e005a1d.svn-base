/*
界面展示相关逻辑
*/
/* 初始化发件人列表 */
function initAddrList() {
     Utils.UI.selectSender("selFrom",true,document);
}
function getReplyLetterStartHtml(mid) {
    var letter = top.ReadMailInfoTable[mid].response;
    var htmlCode = '<div style="padding-right: 0px; padding-left: 0px; font-size: 12px; padding-bottom: 2px; padding-top: 2px; font-family: arial narrow">';
    htmlCode += '------------------&nbsp;原始邮件&nbsp;------------------\n</div>';
    htmlCode += '<div style="font-size: 12px">';
    htmlCode += '<div><b>发件人:</b>&nbsp;{from};\n</div>';
    htmlCode += '<div><b>发送时间:</b>&nbsp;{sentDate}\n</div>';
    htmlCode += '<div><b>收件人:</b>&nbsp;{to}; \n</div>';
    htmlCode += '<div><b>抄送:</b>&nbsp;{cc}; \n</div>';
    htmlCode += '<div>\n</div>';
    htmlCode += '<div><b>主题:</b>&nbsp;{subject}</div></div><div>&nbsp;\n</div>';
    var formatObj = {
        subject: letter.subject.encode(),
        from: (letter.account||"").toString().encode(),
        to: (letter.to || "(无)").encode(),
        cc: (letter.cc || "(无)").encode(),
        sentDate: (letter.sendDate && (new Date(letter.sendDate*1000)).format("yyyy年MM月dd日 hh点mm分") || "")
    };
    htmlCode = String.format(htmlCode, formatObj);
    return htmlCode;
}


//编辑器重设大小
function setEditorSize() {
}
$(window).resize(resizeAll);
function resizeAll() {
}
//修复IE6页面宽度
function setIframeSize() {
    try {
        jQuery("body").width(jQuery(window.frameElement).width());
    } catch (e) { }
}
ICONS_CLASS = {
    "access.gif": ["ade", "snp", "mda", "mdb", "adp"],
    "msword.gif": ["wiz", "rtf", "dot", "doc", "wbk"],
    "excel.gif": ["xlw", "xlv", "xlt", "slk", "xls", "xld", "xll", "xlb", "xla", "xlk", "dif", "csv", "xlc", "xlm"],
    "ppt.gif": ["ppa", "pps", "ppt", "pwz", "pot"],
    "ii_WAR.GIF": ["rar", "zip", "iso", "7z"],
    "MUSIC.GIF": ["aifc", "aiff", "aif", "snd", "au", "midi", "mid", "rmi", "mp3", "wav", "m3u", "wax", "wma"],
    "JPG.GIF": ["bmp", "dib", "gif", "jpe", "jpg", "jpeg", "jfif", "png", "mdi", "ico", "xbm"],
    "WORD.GIF": ["css", "323", "html", "htm", "sol", "txt", "sor", "wsc", "sct", "htt", "htc", "xml", "xsl", "odc", "rqy", "vcf"],
    "Movie.GIF": ["mpa", "mpg", "m1v", "mpeg", "mp2", "mpe", "mp2v", "mpv2", "mov", "qt", "IVF", "asx", "asf", "avi", "wm", "wmv", "wmx", "wvx", "rm"]
};
function getLinkImgPath(ext) {
    ext = ext.toLowerCase();
    for (var p in ICONS_CLASS) {
        if ($.inArray(ext, ICONS_CLASS[p])!=-1) return p;
    }
    return "默认.GIF";
}
/*
function disableLink(link) {
    link.style.color = "silver";
    link._onclick = link.onclick;
    link.style.cursor = "none";
    link.onclick = null;
}
function ableLink(link) {
    link.style.color = "";
    if (link._onclick) link.onclick = link._onclick;
    link.style.cursor = "pointer";
}*/

function showCC() {
    if (document.getElementById("trCc").style.display == "none") {
	    aAddCcOnClick($("#aShowCc")[0],true);
    }
}
function showBCC() {
    if (document.getElementById("trBcc").style.display == "none") {
	    aAddBccOnClick($("#aShowBcc")[0]);
    }
}
$(function() {
    //button标签点击失去焦点
    $("button,input:button").click(function() {
        $(this).blur();
    });
    //导航按钮样式切换
    $(".navgation button").mouseover(function() {
        $(this).addClass("on");
    });
    $(".navgation button").mouseout(function() {
        $(".navgation button").removeClass("on");
    });
    //通讯录与信纸切换
    /*
    $("#thContactFrame").click(function() {
        showContactFrame();
    });
    $("#thLetterPaperFrame").click(function() {
        showPaperFrame();
    });*/
    $("#btnContactsSelectMenu").click(function(e) {
        if (!window.gotoAddressMenu) {
            gotoAddressMenu = new PopMenu();
            gotoAddressMenu.addItem("新建联系人", function() { top.Links.show("addrContacts"); top.addBehavior("写信页新建联系人"); });
            gotoAddressMenu.addItem("管理通讯录", function() { top.Links.show("addr"); top.addBehavior("写信页通讯录"); });
        }
        gotoAddressMenu.show(this);
        top.$Event.stopEvent(e);
    });
    //标签页onShow的时候
    try {
        window.frameElement.module.onShow.addEventListener(function() {
                //setTimeout(resizeAll, 0);
            }
        );
    } catch (e) { }

    //修复浏览器的bug引起的小问题,与业务无关
    //if (document.all) {
        //var frm = document.getElementById("HtmlEditor");
        //var frm = htmlEditorView.editorView.editorWindow;
        //frm.onfocus = function() {
            //if (frm.click) frm.click();
       // }
        //frameElement.onblur = function() {
            //if (frm.click) frm.click();
        //}
    //}
    /*
    AddressBook.onload = function() {
        resizeAll();
    }
    //创建通讯录
    AddressBook.createMailStyle(
        document.getElementById("divAddressList"),
        function(addrInfo) {
            RichInputManager.addMailTofocus(addrInfo);
        }
    );*/
});
//右侧切到通讯录
/*
function showContactFrame() {
	$("#divLetterPaper").hide();
	$("#divAddressList").show();
	$("#thLetterPaperFrame").removeClass("active");
	$("#thContactFrame").addClass("active");
}
//右侧切到信纸
function showPaperFrame(letterPaperUrl) {
	$("#divAddressList").hide();
	$("#divLetterPaper").show();
	$("#thContactFrame").removeClass("active");
	$("#thLetterPaperFrame").addClass("active");
    var div = document.getElementById("divLetterPaper");
    if(div.innerHTML.trim()==""){
        div.innerHTML = '<iframe frameborder="0" scrolling="auto" style="width:100%;border:0;height:374px;" src="letterpaper/letterpaper.htm" id="frmLetterPaper"></iframe>';
    }
    var frame = document.getElementById("frmLetterPaper");
    //加载特定信纸
    //letterPaperUrl="jieri_xinzhi05.html";
    if (letterPaperUrl) {
        frame.onload = function() {
            this.onload = null;
            this.contentWindow.setPaper(letterPaperUrl);
        }
    }
}*/
