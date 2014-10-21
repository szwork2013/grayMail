AddressBookType = {
    Mail: "email",
    Fax: "fax",
    Tel: "mobile"
};
function AddressBook(containerTag, selectCallback, type, useAllEmailText, hideAddGroup) {
    var This = this;
    if(typeof useAllEmailText == "undefined"){
        if(type==AddressBookType.Mail){
            useAllEmailText=true;
        }else{
            useAllEmailText=false;
        }
    }

    var model = new top.M2012.UI.Widget.Contacts.Model({
        filter: type
    });

    model.dataReady(function () {


        var groupList = model.getGroupList();
        var lastContacts = model.getLastestContacts();
        var closeContacts = model.getCloseContacts();

        var allContacts = model.getContacts();
        var ungroupContacts = model.getUngroupContacts();

        /* 输出html */
        var htmlCode = "";
        htmlCode += "<p class='search'><input type='text' id='txtAddrSearch' />"
        htmlCode += "<button type='button' onfocus='this.blur()' behavior='19_26015_2'></button></p>";
        htmlCode += "<dl id='divSearch' style='display:none;border:0;'>";
        //htmlCode+=     "<p style='margin:10px 0'><a href='javascript:void(0)' onclick='AddressBook.current.backToAddrView();return false;'>取消搜索</a></p>";
        htmlCode += "<div id='divSearchResult'></div>";
        htmlCode += "</dl>"
        htmlCode += "<dl id='dlAddress'>";
        if (type == AddressBookType.Tel) {
            var selfTitle = top.$User.getUid().replace(/^86/, "");
            if (useAllEmailText) {
                var trueName = top.$User.getTrueName();
                if (trueName) {
                    selfTitle = '"' + trueName + '"<' + selfTitle + '>';
                }
            }
            htmlCode += '<dd class="send-to-me"><a href="javascript:;" title="'
            + selfTitle.encode()
            + '" rel="addrInfo" behavior="19_26017_1发给自己"><i class="i-vcard"></i>发给自己</a></dd>';
        }

        htmlCode += "<dt rel='addrGroup'><i></i>最近联系人(" + lastContacts.length + ")</dt>";
        htmlCode += "<dd gid='-2'>";
        htmlCode += "</dd>";

        htmlCode += "<dt rel='addrGroup'><i></i>紧密联系人(" + closeContacts.length + ")</dt>";
        htmlCode += "<dd gid='-3'>";
        htmlCode += "</dd>";


        htmlCode += "<dt rel='addrGroup'><i></i>所有联系人(" + allContacts.length + ")</dt>";
        htmlCode += "<dd gid='-1'>";
        htmlCode += "</dd>";
        if (ungroupContacts.length > 0) {
            htmlCode += "<dt rel='addrGroup'><i></i>未分组(" + ungroupContacts.length + ")</dt>";
            htmlCode += "<dd gid='-4'>";
            htmlCode += "</dd>";
        }
        for (var i = 0, j = groupList.length; i < j; i++) {
            var g = groupList[i];
            //htmlCode+="<dt rel='addrGroup'><i></i>"+g.name+"("+g.arrLinkManId.length+")</dt>";
            htmlCode += "<dt rel='addrGroup'><i></i>" + Utils.htmlEncode(g.name) + "(" + model.getGroupMembers(g.id).length + ")</dt>";
            htmlCode += "<dd gid='" + g.id + "'>";
            htmlCode += "</dd>";
        }
        htmlCode += "</dl>";
        containerTag.innerHTML = htmlCode;
        $(containerTag).find("dl dt").each(function () { this.title = $(this).text() });
        /* 绑定点击事件 */
        AddressBook.current = This;
        var divSearch = document.getElementById("divSearch");
        var dlAddress = document.getElementById("dlAddress");
        var txtAddrSearch = document.getElementById("txtAddrSearch");
        var divSearchResult = document.getElementById("divSearchResult");
        containerTag.onclick = function (e) {
            var target = e && e.target || event.srcElement;
            if (target.tagName == "I") target = target.parentNode;
            var rel = target.getAttribute("rel");
            if (rel == "addrGroup") return addrGroupOnClick(target);
            if (rel == "addrInfo") return addrInfoOnClick(target);
            function addrGroupOnClick(obj) {
                if (obj.className == "on") {
                    obj.className = "";
                    var dd = obj.nextSibling;
                    dd.style.display = "none";
                } else {
                    obj.className = "on";
                    var dd = obj.nextSibling;
                    if (dd.innerHTML.trim() == "") addrGroupFill(dd);
                    dd.style.display = "block";
                }
            }
            function addrInfoOnClick(obj) {
                if (selectCallback) {
                    if (obj.title == "添加整组到接收人") {
                        //添加整组
                        $("a", obj.parentNode).not(obj).each(function () {
                            selectCallback(this.title);
                        });
                    } else {
                        selectCallback(obj.title);
                    }
                    //fixed ie6 bug
                    if ($.browser.msie && $.browser.version == 6 && location.href.indexOf("addrwin.htm") > -1) {
                        frameElement.style.display = "none";
                        setTimeout(function () {
                            frameElement.style.display = "";
                        }, 0);
                    }
                }
                return false;
            }
            function addrGroupFill(container) {
                var gid = container.getAttribute("gid");
                var tag = $("<a href='javascript:void(0)' title='title' onclick='return false;' rel='addrInfo'></a>")[0];
                var list;
                if (gid == -1) {
                    list = allContacts;
                } else if (gid == -2 || gid == -3) {
                    list = gid == -2 ? lastContacts : closeContacts;
                } else if (gid == -4) {
                    list = ungroupContacts;
                } else {
                    list = model.getGroupMembers(gid);
                }
                for (var i = 0, j = list.length; i < j; i++) {
                    var info = list[i];
                    var _addr = info.addr || getAddr(info);;
                    if (type == AddressBookType.Tel) _addr = _addr.replace(/\D/g, "");
                    var title = '"' + info.name + '"<' + _addr + ">";
                    if (!useAllEmailText) title = _addr;
                    var a = tag.cloneNode(false);
                    a.title = title;
                    a.innerHTML = info.name.encode();
                    container.appendChild(a);
                }
                if (!hideAddGroup && list.length > 1) {
                    var a = tag.cloneNode(false);
                    a.title = "添加整组到接收人";
                    a.appendChild(document.createTextNode("添加整组"));
                    a.style.color = "#3cb1e6";
                    $(container).prepend(a);
                }
                return false;
            }
            return false;
        }
        var btnSearch = containerTag.getElementsByTagName("button")[0];
        btnSearch.onclick = function () {
            if (this.className == "close") {
                txtAddrSearch.value = "";
                doSearch();
            } else {
                doSearch();
            }
        }
        txtAddrSearch.onkeyup = function (e) {
            doSearch();
        }
        var searchTimer;
        function doSearch() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(_search, 100);
            function _search() {
                //获取搜索关键词
                var txt = txtAddrSearch.value;
                if (txt == "") {
                    btnSearch.className = "";
                    btnSearch.title = "搜索";
                    backToAddrView();
                    Utils.focusTextBox(txtAddrSearch);
                    return;
                }
                btnSearch.className = "close";
                btnSearch.title = "取消搜索";
                //筛选
                model.set("keyword", txt);
                var result = model.getSearchContacts();
                //生成html
                var html = "";
                var hashMap = {};
                $(result).each(function () {
                    this.addr = this.addr || getAddr(this);
                    if (type == AddressBookType.Tel) {
                        this.addr = this.addr.replace(/\D/g, "");
                        if (this.addr == "") return;
                    }
                    if (hashMap[this.addr]) return;
                    hashMap[this.addr] = true;
                    var title = '"' + this.name + '"<' + this.addr + ">";
                    if (!useAllEmailText) title = this.addr;
                    html +=
                    '<dd style="display:block">\
                <h1 style="font-weight:bolder;">{0}</h1>\
                <a href="javascript:void(0)" rel="addrInfo" title="{1}">{2}</a>\
                </dd>'
                    .format(this.name.encode(), title.encode(), this.addr);
                })
                if (html == "") html = "没有符合的结果。";
                showResult(html);
            }
        }
        function showResult(html) {
            AddressBook.current.showSearchView();
            divSearchResult.innerHTML = html;
        }
        This.showSearchView = function () {
            divSearch.style.display = "";
            dlAddress.style.display = "none";
        }
        var backToAddrView = This.backToAddrView = function () {
            divSearch.style.display = "none";
            dlAddress.style.display = "";
        }
        function isRepeat(arr, item) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (item.id && item.id == arr[i].id) return true;
            }
            return false;
        }
        function getAddr(c) {
            var addr = "";
            if (type == "email") {
                addr = c.getFirstEmail();
            } else if (type == "mobile") {
                addr = c.getFirstMobile();
            } else if (type == "fax") {
                addr = c.getFirstFax();
            }
            return addr;
        }
        $([dlAddress, divSearch]).click(function (e) {
            var src = e.srcElement;
            if (src && src.tagName == 'A') {
                top.addBehaviorExt({ actionId: 26015, thingId: 1, moduleId: 19 });
            }
        });
    });
}
function tryReloadAddr(link){
    var _onclick = link.onclick;
    link.style.display = "none";
    if (top.Contacts.reload) top.Contacts.reload();
    setTimeout(function() {
        try {
            link.style.display = "";
        } catch (e) { }
    }, 5000);//重试频率为5秒
}
AddressBook.createMailStyleExt2 = function(tagContainer, objTextBox, withAddrName) {
    AddressBook.createMailStyle(tagContainer, function(addr) {
        var text = objTextBox.value;
        if (text.indexOf(addr) >= 0) return;
        if (objTextBox.value.trim() == "") {
            objTextBox.value = addr;
        } else {
            objTextBox.value = objTextBox.value.replace(/[,;，；]*$/, ";" + addr);
        }
        Utils.focusTextBox(objTextBox);
    }, false, withAddrName);
}
AddressBook.createMailStyle = function(tagContainer, callback, filter, useAllEmailText,hideAddGroup) {
    if (!top.Contacts.isReady) {
        tagContainer.innerHTML = '<div style="margin-top:150px;" align="center"><span>通讯录加载中...</span><br/><a href="javascript:;" onclick="tryReloadAddr(this);return false;">重新加载</a></div>';
    }
    top.M2012.Contacts.getModel().requireData(create);
    function create() {
        new AddressBook(
            tagContainer,
            callback,
            AddressBookType.Mail,
            useAllEmailText,
            hideAddGroup
        );
        if (AddressBook.onload) AddressBook.onload();
    }
}

AddressBook.createMailStyleExt=function(tagContainer,func,filter,useAllEmailText,callback){
    AddressBook.createMailStyle(tagContainer,function(addrInfo){
        if(func.constructor==Function){
            textbox=func();
        }else{
            textbox=func;
        }
        if(textbox.value==textbox.title){
            textbox.value="";
        }
        var text=textbox.value;
        if(text.indexOf(addrInfo)>=0)return;
            textbox.value+=((text==""||/[,;]$/.test(text))?"":";")+addrInfo+";";
        try{
            Utils.focusTextBox(textbox);
        }catch(e){}
        if(callback)callback();
    },filter,useAllEmailText);
}

AddressBook.createFaxStyle=function(){

}
AddressBook.createTelStyle = function(tagContainer, objTextBox, withAddrName,hideAddGroup,isFax) {
    tagContainer.innerHTML = '<div style="margin: 150px 0pt 0pt 35px; float: left;"><span>通讯录加载中...</span><br/>&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="tryReloadAddr(this);return false;">重新加载</a></div>';
    top.M2012.Contacts.getModel().requireData(create);
    function create() {
        new AddressBook(
            tagContainer,
            objTextBox.tagName ?
            function(args) {
                args = args || "";
                if (!withAddrName) {
                    args = args.replace(/\D/g, "");
                }
                if (args == "") return;
                if (objTextBox.value == objTextBox.title) objTextBox.value = "";
                if (objTextBox.value.indexOf(args) == -1) {
                    try {
                        $(objTextBox).focus();
                    } catch (e) { }
                    objTextBox.value += (/^\s*$/.test(objTextBox.value) ? "" : ",") + args + ",";
                    objTextBox.value = objTextBox.value.replace(/,,/g, ",");
                }
                //光标定位
                try {
                    //IE
                    var r = objTextBox.createTextRange();
                    r.moveStart("character", objTextBox.value.length);
                    r.collapse(true);
                    r.select();
                }
                catch (e) {
                    try {
                        //FireFox
                        objTextBox.setSelectionRange(objTextBox.value.length, objTextBox.value.length);
                        objTextBox.focus();
                    }
                    catch (e) { }
                }

            } : objTextBox,
            isFax ? AddressBookType.Fax : AddressBookType.Tel,
            withAddrName,
            hideAddGroup
        );
        $(window).resize();
    }
}
AddressBook.reloadData=function(){
    Contacts.loadMainData();
}