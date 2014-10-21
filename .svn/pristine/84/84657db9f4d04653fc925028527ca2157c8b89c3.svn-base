var warn_msgtolong = "要发送的验证信息太长了。（20字以内）";
//尽可能聚合顶层的对象;
var Pt = {

    sid: top.$App.getSid(),

    error: function(title, msg) {
        top.M139.Logger.getDefaultLogger().error("[" + title + "]" + msg);
    },

    alert: function() {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },

    confirm: function(){
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },

    open: function(){
        top.$Msg.open.apply(top.$Msg, arguments);
    },
	
	show:function(){
		 top.$Msg.showHTML.apply(top.$Msg, arguments);
	},
    
	modStatus: function() {
        top.Contacts.modDealStatus.apply(top.Contacts, arguments);
    },
    
    getPage: function() {
        top.Contacts.getWhoAddMePageData.apply(top.Contacts, arguments);
    },

    addContacts: function() {
        top.Contacts.OneKeyAddWAM.apply(top.Contacts, arguments);
    },
    
    param: function(key) {
        return top.$Url.queryString(key, location.href);
    },

    htmlEncode: function(str) {
        return top.$TextUtils.htmlEncode(str);
    },

    UcDomain: function(path) {
        return top.ucDomain + path;
    },

    callOldApi: function(option) {
        var api = "/g2/addr/apiserver/" + option.action;

        var data = option.data || {};

        var params = option.param || {};
        params.sid = this.sid;

        var _url = this.$Url.makeUrl(api, params);

        this.$RM.call(_url, {}, function(json) {
            json = json.responseData;

            if (json.ResultCode == 0) {
                $.isFunction(option.success) && option.success(json);
            } else {
                $.isFunction(option.error) && option.error(json);
            }

            $.isFunction(option.done) && option.done(json);
        });
    }
};
function GroupSelectbox(parent, context){
    if (!parent) return;
    context = context || document;
    parent.style.visibility="hidden";
    parent.innerHTML = '<select class="group"></select><a href="javascript:;" bh="addr_remind_newGroup"><i class="plus"></i>新建分组</a>';
    var list = parent.firstChild;
    var item = new Option("", "");
    list.options.add(item);
    var groups = top.Contacts.data.groups;
    for (var i = groups.length - 1, k=groups[i]; i >= 0; k=groups[--i]){
        item=new Option(k.GroupName, k.GroupId);        
        list.options.add(item);
    }
    parent.style.visibility = "visible";

    var btnAdd = parent.lastChild;
    btnAdd.onclick = function() {
        var Contacts = top.Contacts;
        var frameworkMessage = top.frameworkMessage;
        var FF = top.FF;
        var txtGName = context.createElement('INPUT');
        var btnOk = context.createElement('A');
        var btnCanel = context.createElement('A');
        var tip = frameworkMessage.addGroupTitle;

        btnAdd.style.display = "none";
        txtGName.value = tip;
        txtGName.maxLength = 16;
        txtGName.className = "text gp def";

        btnOk.href = "javascript:void(0)";
        btnCanel.href = "javascript:void(0)";
        btnCanel.style.marginLeft = ".5em";
        btnOk.innerHTML = "添加";
        btnCanel.innerHTML = "取消";

        txtGName.onfocus = function() {
            if (this.value == tip) {
                this.value = "";
                this.className = "text gp";
            } else {
                this.select();
            }
        };
        txtGName.onblur = function() {
            if (this.value.length == 0) {
                this.value = tip;
                this.className = "text def gp";
            }
        };

        btnOk.onclick = function() {
            var gpName = txtGName.value;
            if (gpName.length > 0 && gpName != tip) {
                var _this = this;
                Contacts.addGroup(gpName, function(result) {
                    if (result.success) {
                        var p = _this.parentNode;
                        var lst = p.getElementsByTagName('select')[0];
                        btnCanel.onclick();
                        item = new Option(gpName, result.groupId);
                        lst.options.add(item);
                        for (var i = 0; i < lst.options.length; i++) {
                            lst.options[i].selected = false;
                        }
                        item.selected = true;
                        lst.focus();
                    } else {
                        var isIE6 = navigator.userAgent.indexOf('MSIE 6.') > -1;
                        if (isIE6) {
                            alert(result.msg);
                        } else {
                            FF.alert(result.msg);
                        }
                    }
                });
            }
        };

        btnCanel.onclick = function() {
            parent.removeChild(txtGName);
            parent.removeChild(btnOk);
            parent.removeChild(btnCanel);
            btnAdd.style.display = "inline";
        };

        parent.appendChild(txtGName);
        parent.appendChild(btnOk);
        parent.appendChild(btnCanel);
    }

    this.list = list;
    this.select = function(val){
        var ops = this.list.options;
        if (val) {
            each(ops, function(i){
                if (i.value == val) i.selected = true;
            });

        } else {
            var buff = "";
            each(ops, function(i){
                if (i.selected) {
                    buff = i.value;
                }
            });
            return buff;
        }
        function each(arr, callback){
            for (var j = arr.length - 1, k = arr[j]; j >= 0; k = arr[j--]) {
                callback(k);
            }
        }
        function contain(v){
            for (var i = ops.length - 1, k = ops[i]; i >= 0; k = ops[--i]) {
                if (k==v) return true;
            }
            return false;
        }
    }
};

function queryString(param){
    var url=location.search;
    var svalue = url.match(new RegExp("[?&]" + param + "=([^&]*)","i"));
    return svalue ? unescape(svalue[1]) : null;
};

function sendRequest(onSend){
    var groups = chkGroup.select();
    var msg = $('#txtMessage').val();
    msg = new top.String(msg);
	//top.jslog("dealstatus",dealstatus);
    var byteLength = msg.getByteCount();
    if ( byteLength >60 || msg.length > 20){
        if ($.browser.msie && $.browser.version<7 ) {
            alert(warn_msgtolong);
        } else {
            top.FF.alert(warn_msgtolong);
        }
        return;
    }
    msg = msg.toString() || "无";
    onSend(relation, {groupId: groups, reqMsg:msg,dealstatus:dealstatus});
};

var chkGroup, relation, name;
$(function(){
    relation = queryString("relation");
    name = queryString("name");
    dealstatus = queryString("dealstatus");

	var img = queryString("img")
    if(name){
	$("#lblName").html(Pt.htmlEncode(name));
    }
    //$("#lblName").html(name);
    $("#imgContact").attr("src", img);
    $("#btnCancel").click(function(){top.FF.close()});

    chkGroup = new GroupSelectbox($('#chkGroup')[0], document);
});

