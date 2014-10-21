ContactsSelectList = {
    container: null,
    fill: function(container, title) {
        if (typeof container == "string") container = document.getElementById(container);
        container.innerHTML = '<fieldset>\
        <legend><span id="labelTitle">选择要共享的联系人</span></legend>\
        <dl class="checkContact">\
            <dt>您的139邮箱中，共有<strong class="numberStrong" id="labelCount"> - </strong>个联系人</dt>\
            <p class="search"><input id="txtKeyword2" type="text" title="查找联系人..." class="text"><button id="btnSearch2" type="button"></button></p>\
            <dd id="listContainer">\
            </dd>\
        </dl>\
        <p class="checkAction">选择：<a href="javascript:;" id="aSelectAll">全选</a> | <a href="javascript:;" id="aCancelAll">清空</a> |\
        <a href="javascript:;" id="aSelectOthers">反选</a></p>\
        </fieldset>';
        container = $("#listContainer")[0];
        this.container = container;
        var contacts = window.top.Contacts.data.contacts;
        var groups = window.top.Contacts.data.groups;
        container.innerHTML = "<dl class='current'><dt><label for='chkAll'><input type='checkbox' id='chkAll' />全部联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";
        $(container).hide();
        var dlAll = $(container).find("dl:eq(0)")[0];
        var ulAll = $(container).find("ul:eq(0)")[0];
        var tempRow = $("<li><label><input type='checkbox' /></label></li>")[0];
        for (var i = 0, len = contacts.length; i < len; i++) {
            var item = contacts[i];
            var row = tempRow.cloneNode(true);
            row.setAttribute("SerialId", item.SerialId);
            var email = item.getFirstEmail();
            email = email ? " <" + email + ">" : "";
            row.firstChild.appendChild(document.createTextNode(item.name + email));
            ulAll.appendChild(row);
        }

        document.getElementById("txtKeyword2").onkeypress = function(e){
            e = e || window.event;
            if(e.keyCode==13){
                ContactsSelectList.search();
            }
        };
        document.getElementById("btnSearch2").onclick = function(){
            ContactsSelectList.search();
        };
        
        //未分组
        var notInGroups = getContactsNotInGroup();
        if (notInGroups.count > 0) {
            var htmlCode = "<dl><dt><label for='chkNotInGroup'><input type='checkbox' id='chkNotInGroup' />未分组联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";
            var ulGroup = $(htmlCode).appendTo(container).find("ul:eq(0)")[0];
            var contactsMap = top.Contacts.data.ContactsMap;
            for (var sid in notInGroups.contactsMap) {
                var item = contactsMap[sid];
                if (!item) continue;
                var row = tempRow.cloneNode(true);
                row.setAttribute("SerialId", item.SerialId);
                var email = item.getFirstEmail();
                email = email ? " <" + email + ">" : "";
                row.firstChild.appendChild(document.createTextNode(item.name + email));
                ulGroup.appendChild(row);
            }
        }

        for (var i = 0, len = groups.length; i < len; i++) {
            var group = groups[i];
            var list = window.top.Contacts.getContactsByGroupId(group.GroupId);
            var htmlCode = "<dl><dt><label for='chkGroup{0}'><input type='checkbox' id='chkGroup{0}' />{1} </label><i class='switchButton' style='display:{2}'></i></dt><dd><ul></ul></dd></dl>".format(Utils.htmlEncode(group.GroupId), Utils.htmlEncode(group.GroupName), list.length == 0 ? "none" : "");
            var ulGroup = $(htmlCode).appendTo(container).find("ul:eq(0)")[0];

            for (var j = 0, jlen = list.length; j < jlen; j++) {
                var item = list[j];
                var row = tempRow.cloneNode(true);
                row.setAttribute("SerialId", item.SerialId);
                var email = item.getFirstEmail();
                email = email ? " <" + email + ">" : "";
                row.firstChild.appendChild(document.createTextNode(item.name + email));
                ulGroup.appendChild(row);
            }
        }
        $("#labelCount").text(top.Contacts.getContactsCount());
        if (title) $("#labelTitle").text(title);
        $(container).click(function(e) {
            var target = e.target;
            if (target.tagName == "LABEL") {
                if (target.firstChild.tagName == "INPUT" && !target.firstChild.id) {
                    target.firstChild.checked = !target.firstChild.checked;
                    return false;
                }
            }
        });
        $(container).show();
        this.bindEvent();
    },

    search: function() {
        var txt = document.getElementById("txtKeyword2");
        var keyword = txt.value.trim();
        if (keyword.length <1){
            this.fill(document.getElementById("ContactGroups"));
            return;
        }
        var arr=[];
        $(window.top.Contacts.data.contacts).each(function(){
            if(this.search(keyword)){
                arr.push(this);
            }
        });
        var container = $("#listContainer")[0];
        container.innerHTML = "<dl class='current'><dt><label for='chkAll'><input type='checkbox' id='chkAll' />全部联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";

        var dlAll = $(container).find("dl:eq(0)")[0];
        var ulAll = $(container).find("ul:eq(0)")[0];
        var tempRow = $("<li><label><input type='checkbox' /></label></li>")[0];

        var enableHigh = keyword.length > 0;
        var kw2 = "<b>"+keyword+"</b>";
        var reg = new RegExp(keyword, "ig");

        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            var row = tempRow.cloneNode(true);
            row.setAttribute("SerialId", item.SerialId);
            var email = item.getFirstEmail();
            email = email ? " &lt;" + email + "&gt;" : "";
            var name = item.name;

            if (enableHigh){
                name = name.replace(reg, kw2)
                email = email.replace(reg, kw2);
            }
            
            var con = document.createElement("span");
            con.innerHTML = name + email;
            row.firstChild.appendChild(con);
            ulAll.appendChild(row);
        }
        this.bindEvent();
    },

    bindEvent: function() {
        $("i.switchButton").click(
            function() {
                var dl = $(this.parentNode.parentNode);
                if (dl.hasClass("current")) {
                    dl.removeClass("current");
                } else {
                    dl.addClass("current");
                }
            }
        );
        $("dt input:checkbox").click(
            function() {
                var value = this.checked ? true : null;
                $(this.parentNode.parentNode).next("dd").find("input:checkbox").attr("checked", value);
            }
        );
        $("#aSelectAll").click(function() {
            ContactsSelectList.selectAll();
        });
        $("#aSelectOthers").click(function() {
            ContactsSelectList.selectOthers();
        });
        $("#aCancelAll").click(function() {
            ContactsSelectList.cancelAll();
        });
    },
    selectAll: function() {
        $(this.container).find("dl input:checkbox").attr("checked", true);
    },
    selectOthers: function() {
        $(this.container).find("dl dd input:checkbox").each(function() {
            this.checked = !this.checked;
        });
    },
    cancelAll: function() {
        $(this.container).find("dl input:checkbox").attr("checked", null);
    },
    getSelectedContacts: function() {
        var hashTable = {};
        $(this.container).find("input:checked").each(function() {
            var serialId = this.parentNode.parentNode.getAttribute("SerialId");
            if (serialId) hashTable[serialId] = true;
        });
        var result = [];
        for (var p in hashTable) {
            result.push(p);
        }
        return result;
    }
}

function getContactsNotInGroup() {
    var map = top.Contacts.data.map;
    var contactsMap = top.Contacts.data.ContactsMap;
    var addrsInGroup = {};
    var addrsNotInGroup = {};
    var addrsNotInGroupCount = 0;
    for (var i = 0, len = map.length; i < len; i++) {
        addrsInGroup[map[i].SerialId] = true;
    }
    for (var serialId in contactsMap) {
        if (!addrsInGroup[serialId]) {
            addrsNotInGroup[serialId] = true;
            addrsNotInGroupCount++;
        }
    }
    return {
        contactsMap: addrsNotInGroup,
        count: addrsNotInGroupCount
    }
}