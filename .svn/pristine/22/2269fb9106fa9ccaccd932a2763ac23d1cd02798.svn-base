
function addFriends() {
    var inputs = document.getElementsByTagName("input");
    var relationIds = [];
    for (var i = 0, len = inputs.length; i < len; i++) {
        var dom = inputs[i];
        if (dom.checked) {
            var id = dom.getAttribute('relationid');
            id && relationIds.push(id.toString());
        }
    }

    if (relationIds.length > 0) {
        top.Links && top.Links.show && top.Links.show("addrWhoAddMe", "&rids=" + relationIds.join("|"));
        top.tmpMailBody = document.getElementById("mailbody").outerHTML;
    }
    else {
        top.FF && top.FF.alert("对不起，你还没有选择任何联系人，请先选择！");
    }
}

function addListener(element, e, fn) {
    if (element.addEventListener) {
        element.addEventListener(e, fn, false);
    } else {
        element.attachEvent("on" + e, fn);
    }
}

function removeListener(element, e, fn) {
    if (element.removeEventListener) {
        element.removeEventListener(e, fn, false);
    } else {
        element.detachEvent("on" + e, fn);
    }
}

function addFriendsNew(e) {
    top.addBehaviorExt({ actionId: 105148 });
    var node = e.target || e.srcElement;
    var isneedreply = node.getAttribute('isneedreply'); //0 需要验证,1 不需要验证, 2 忽略
    if(isneedreply == "0"){
        var option = { 
            relationId: node.getAttribute('rel'),
            dealStatus: "2", 
            groupId: "", 
            reqMsg: "加我为好友吧，保持联系哦",
            replyMsg: "", 
            operUserType: "1" 
        }
        isneedreply = false;
    }else{
        var option = {
            relationId: node.getAttribute('rel'),
            dealStatus: "1", 
            groupId: "", 
            reqMsg: "", 
            replyMsg: "", 
            operUserType: "2", 
            Name: node.getAttribute('name')
        }
        isneedreply = true;
    }
    grayNode(node);
    top.Contacts.modDealStatus(option, function (res) {
        removeListener(node, 'click', addFriendsNew);
        if (res && res.info && res.info.ResultCode == "0") {
            if (isneedreply) {//不需要验证，直接添加成功
                if (node.innerText) {
                    node.innerText = "添加成功";
                } else {
                    node.textContent = "添加成功";
                }
                sendMail(node.getAttribute('email'))
            } else {
                var data = {
                    agreeStatus: "0",
                    message: "加我为好友吧，保持联系哦",
                    receiverEmail: node.getAttribute('email'),
                    receiverName: node.getAttribute('name'),
                    refuseStatus: "0",
                    relationId: node.getAttribute('rel'),
                    userName: top.UserData.userName || top.UserData.UID || ''
                }
                top.$RM.call("mail:askAddFriendToMayKnow", data, function () {});
                //doNothing
            }

        } else {
            //error(node);
        }
    });
}

function filter() {
    var links = document.links,
        email = "";
    var length = links.length;
    var more = document.getElementById('more');
    if (more) {
        length--;
        more.href = "javascript:top.addBehaviorExt({actionid:105149});top.Links.show('addrWhoAddMe');";
        more.target = "";
    }
    for (var i = 0; i < length; i++) {
        var a = links[i];
        a.href = "javascript:";
        a.target = '';
        email = a.getAttribute('email');
        if (top.Contacts.getContactsByEmail(email).length) {
            grayNode(a,true);
        } else {
            addListener(a, "click", addFriendsNew);
        }
    }
}

function grayNode(node,isAdded) {
    node.style.cssText = "background-color:#aaa; border:1px solid #E4E4E4; height:26px; line-height:26px; display:inline-block; color:#fff;text-decoration:none; width:128px;cursor:default;"
    if (node.innerText) {
        node.innerText = isAdded ? "已添加" : "等待验证";
    } else {
        node.textContent = isAdded ? "已添加" : "等待验证";
    }
}

function error(node) {
    node.style.cssText = "height:26px; line-height:26px; display:inline-block; color:#49428d;text-decoration:underline;"
    node.innerText = "添加失败啦！重新试试吧";
}


function sendMail(email) {
    var name = document.getElementById('myName');
    if (name.innerText) {
        name = name.innerText;
    } else {
        name = name.textContent;
    }
    var mailInfo = {
        email: email,
        content: document.getElementById('mailContent').innerHTML,
        subject: '来自' + name +'好友的问候',
        showOneRcpt: 0
    }
    if (top.$PUtils && top.$PUtils.sendMail) {
        top.$PUtils.sendMail(mailInfo);
    } else {
        mailInfo.to = [mailInfo.email];
        top.CM.sendMail(mailInfo);
    }
}


window.onload = function () {
    top.addBehaviorExt({ actionId: 105147 });
    if (document.getElementById("submit")) {
        addListener(document.getElementById("submit"), "click", addFriends)
    } else {
        filter();
    }
}