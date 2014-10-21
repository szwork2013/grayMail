//导入主类:1.从我的手机导入2.从我的电脑导入3.从移动业务导入4.从其他邮箱导入
//1.从我的手机导入:Iphone,Adroid,Winmobile,Symbain
//2.从我的电脑导入:2fm:Foxmail,2mo:MicrosoftOutlook
if (ADDR_I18N) {
    var PageMsg2 = ADDR_I18N[ADDR_I18N.LocalName].clone;
}

//尽可能聚合顶层的对象;
var Pt = {

    getSid: function() {
        return top.$App.getSid();
    },

    ucDomain: function(path) {
        return top.getDomain("webmail") + "/addr/matrix/input" + path;
    },

    makeUrl: function(path, param) {
        return top.$Url.makeUrl(path, param);
    }
};

function intoIptDetail(iptType,iptName)
{
    var url="";
    switch(iptType)
    {

        case 1:
            url="../sync/Default.htm";
            window.location.href=url+"?iptSys="+iptName;
            break;
        case 2:
            if(iptName)
            {
                var url = Pt.makeUrl(Pt.ucDomain("/default.aspx"), { sid: Pt.getSid(), showtype: iptName, isweb2: 1 }); 
                window.location.href = url;
                return;
            }
            var cmd="<param><command>common_getversion</command></param>";
            var vn="",returnValue="";
            var iptVerstion=16777221;
            try{
                if(document.all)//IE
                {
                    returnValue=uploader.Command(cmd);
                    if(returnValue)
                    {
                        vn=getVersion(returnValue);
                    }
                }
                else
                {
                    if($("#embed1") && $("#embed1")[0])
                    {
                        returnValue=$("#embed1")[0].Command(cmd);
                    }
                    if(returnValue)
                    {
                        vn=getVersion(returnValue);
                    }
                }
            }catch(err)
            {
            }
            if(vn && parseInt(vn)>iptVerstion)
            {
                url="addr_importclient.html";
                window.location.href=url;
            }
            else if(vn && parseInt(vn)<=iptVerstion)//已安装须升级
            {
                var toolsMes="您已安装139邮箱小工具，需升级才能从电脑导入通讯录。确定要现在升级吗？";
                if(PageMsg2['ipt139ToolsUpdate'])
                {
                    toolsMes=PageMsg2['ipt139ToolsUpdate'];
                }
                showSetup(toolsMes);
            }
            else{//未安装<return><error>1</error></return>
                var toolsMes="您需要安装139邮箱小工具，才能从电脑导入通讯录。确定要现在安装吗？";
                if(PageMsg2['iptClt139Tools'])
                {
                    toolsMes=PageMsg2['iptClt139Tools'];
                }
                showSetup(toolsMes);
            }
        break;
        case 3:
            var url = Pt.makeUrl(Pt.ucDomain("/default.aspx"), { sid: Pt.getSid(), showtype: iptName, isweb2: 1 } );
            window.location.href = url;
        break;
        case 4:
            var url = Pt.makeUrl(Pt.ucDomain("/default.aspx"), { sid: Pt.getSid(), showtype: "clone", domain: iptName, isweb2: 1 } );
            window.location.href = url;
            break;

    }
    function getVersion(str)
    {
        var rv="";
        var strVn="<version>";
        var index=str.indexOf(strVn)+strVn.length;
        if(index>0)
        {
            var endIndex=str.indexOf("</version>");
            if(endIndex>index)
            {
                var numVn=str.substr(index,endIndex-index);
                if(numVn)
                {
                    rv=numVn;
                }
            }
        }
        return rv;
    };
    function showSetup(mes)//安装或更新小139工具
    {
        top.FloatingFrame.confirm(mes, function() {
            top.addBehaviorExt({actionId:30190,thingId:0,moduleId:14});
            var url=top.ucDomain+"/LargeAttachments/html/control139.htm";
            window.open(url);
         });
    };
}
$(function() {
    top.addBehavior("加载导入主页面");
    $(".mail-bd i").hover(function(){
        $(this).addClass("ipt-current");
    },function(){
        $(this).removeClass("ipt-current");
    });
    var control='<embed id="embed1" type="application/x-richinfo-mail139activex" hiden="true" height="0"></embed>';
    if(document.all)//IE
    {
      control='<OBJECT ID="uploader" name="uploader" CLASSID="CLSID:63A691E7-E028-4254-8BD5-BDFDB8EF6E66" height="0"></OBJECT>';
    }
    $(".ml3P-contacts").prepend(control);

    if ($.browser.mozilla) {
        //TOFIX: 控件不支持火狐的话，就隐藏掉两个控件导入图标。
    }

    if (top.SiteConfig['disableIcontact']){
        $("a:has('i.mobileImportImg')").hide();
    }


     if(top.$User.isChinaMobileUser && !top.$User.isChinaMobileUser()){
            $("#importWay").find(".chinaMobile").hide();//互联网帐号屏蔽“和通讯录”
    }
       
});
