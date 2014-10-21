
(function ($, _, M) {

var superClass = M.Model.ModelBase;
var _class = "M2012.Addr.Model.Clean";

M.namespace(_class, M.Model.ModelBase.extend({

    name: _class,

    initialize: function() {
        return superClass.prototype.initialize.apply(this, arguments);
    },

    fetch: function(options) {
        var _this = this;

        var requestData = {
            QueryInfoWaitForCleaning: {
                UserNumber: _this.getUid()
            }
        };

        top.M2012.Contacts.API.call("QueryInfoWaitForCleaning", requestData, function (result) {
            if (result && result.responseData && result.responseData.ResultCode == "0") {
                var info = result.responseData;

                window.console && console.log(result);

                var chs = {
                    y : "常用邮箱",
                    z : "商务邮箱",
                    p : "常用手机",
                    q : "商务手机",
                    s : "常用固话",
                    r : "公司固话",
                    u : "常用传真",
                    t : "公司传真",
                    a2: "公司邮编",
                    c8: "飞信号"
                };

                info.chs = chs;

                var validmap = {};
                
                for (var i = 0; i < info.ContactsInfo.length; i++) {
                    var arr = info.ContactsInfo[i].ia.split(',');
                    validmap[info.ContactsInfo[i].sd] = arr;
                    info.ContactsInfo[i].ia = arr;
                }

                _this.set({"data": info, "map": validmap})

                options.success(info);

            } else {
                var errCode = (result.responseData ? result.responseData.ResultCode : 0) || "999";
                options.error(errCode);
            }
        });
    },

    clear: function(options) {
    
        this.logger.debug("clearing", options);
    
        var map = this.get("map");
        var serialids = options.contacts;
        
        var cis = [];
        for (var i = 0; i < serialids.length; i++) {
            cis.push({
                SerialId: serialids[i],
                InvalidField: map[serialids[i]].join(",")
            });
        }

        var requestData = {
            OneKeyClean: {
                UserNumber: this.getUid(),
                ContactsInfo: cis
            }
        };

        top.M2012.Contacts.API.call("OneKeyClean", requestData, function (result) {
            if (result && result.responseData && result.responseData.ResultCode == "0") {
                var info = result.responseData;
                options.success(info);
            } else {
                var errCode = (result.responseData ? result.responseData.ResultCode : 0) || "999";
                options.error(errCode);
            }
        });
    },

    getUid: function() {
        if (top.$User) {
            return top.$User.getUid();
        }

        return top.UserData.userNumber;
    }

}));

})(jQuery, _, M139);


(function ($, _, M) {

var superClass = M.View.ViewBase;
var _class = "M2012.Addr.View.Clean";

M.namespace(_class, M.View.ViewBase.extend({

    name: _class,

    el: "body",

    template: _.template([''
        ,'<div style="margin-left:10px">'
        ,'<% for(var i=column; i--;) { %>'
            ,'<div class="coll-one"></div>'
        ,'<% } %>'
        ,'<div id="lastCheck" class="coll-one"></div>'
        ,'</div>'].join('')),

    template_info: _.template([''
            ,'<dl class="address-card">'
                ,'<dt><input type="checkbox" class="address_checkbox" value="<%= info.sd %>" checked="checked" /></dt>'
                ,'<dd><h2><%= _.escape(info.c) %></h2></dd>'
                ,'<% for (var prop in chs ) { %>'
                    ,'<% if (info[prop]) { %>'
                    ,'<dd><span><%= chs[prop] %>：</span>'
                    ,'<% if ( _.indexOf(info.ia, prop) > -1 ) { %>'
                        ,'<em class="c_cc0" title="<%= _.escape(info[prop]) %>"><em class="del_phone nowap" title="<%= _.escape(info[prop]) %>"><%= _.escape(info[prop]) %></em>&nbsp;<em style="display:inline-block;">(可清理)</em></em>'
                    ,'<% } else { %>'
                        ,'<em class="w250 nowap"><em title="<%= _.escape(info[prop]) %>"><%= _.escape(info[prop]) %></em></em>'
                    ,'<% } %>'
                    ,'</dd>'
                    ,'<% } %>'
                ,'<% } %>'
            ,'</dl>'].join('')),
            
    logger: new M139.Logger({ name: _class }),

    initialize: function() {
        this.model = new M2012.Addr.Model.Clean();
        this.initEvents();
        this.render();
        return superClass.prototype.initialize.apply(this, arguments);
    },

    initEvents: function() {
        var _this = this;

        _this.on("loaded", function(){
            _this.$("dl.address-card").click(function(e){
                if (e.target.nodeName === "INPUT") {
                    return true;
                }

                var target = this.getElementsByTagName("INPUT")[0];
                if (target) target.checked = !target.checked;
            });
        });
        
        _this.$("a.j_btn_back").click(function(){
            return _this.back();
        });
        
        _this.$("a.j_btn_clean").click(function(){
            _this.logger.debug("cleaning...");
            
            var arrSid = $.map($.makeArray(_this.$(":checked")), function(i){ return i.value });
            if (arrSid.length < 1) {
                top.FF.alert("请选择联系人");
                return;
            }

            top.FF.confirm("一键清理后，以下资料将会被清理：<br>1、格式不正确的字段<br>2、仅有姓名的联系人<br><b>确定清理？</b>"
                ,function(){

                _this.model.clear({ contacts: arrSid, success:function(msg){
                    if (msg.ResultCode == "0") {
                        top.FF.alert("操作成功，共清理了" + msg.CleanNum + "个联系人的垃圾数据", function() {
                            top.$App.trigger("change:contact_maindata")
                            var total = _this.model.get("data").ContactsInfo.length;
                            if (Number(msg.CleanNum) < total) {
                                _this.trigger("print");
                            } else {
                                _this.back();
                            }
                        });
                        top.addBehavior("成功清理联系人", msg.CleanNum);
                    } else {
                        top.FF.alert("系统繁忙，请稍候再试");
                    }
                }, error: function(errCode){
                    top.FF.alert("系统繁忙，请稍候再试");
                }});
            });

            return true;
        });

        window.lastColumn = _this.getcolumn();

        _this.on("print", function(){
            _this.logger.debug("printing..." + _this.getcolumn());

            _this.model.fetch({success:function(info){
            
                var count = info.ContactsInfo.length;
                
                if (count === 0) {
                    top.$Msg.alert("没有待清理联系人", { onclose: function() {
                        _this.back();
                    }});
                    return;
                }

                info.column = _this.getcolumn();
                var html = _this.template(info);
                _this.$(".contacts-main").next().remove();
                _this.$("#j_container").append(html);
                _this.$("#j_labelCount").text(count);
                window.lastColumn = _this.getcolumn();
                _this.attachTail(info);

            }, error: function(errCode){
                if (errCode == "12865") { //没有待清理联系人
                    top.$Msg.alert("没有待清理联系人", { onclose: function() {
                        _this.back();
                    }});
                }
            }});
        });
        
        window.onresize = function() {
            if (window.lastColumn != _this.getcolumn()) {
                _this.refresh();
                window.lastColumn = _this.getcolumn();
            }
        }
    },

    back: function() {        
        setTimeout(function() {
            if(top.$Addr){ 
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);
        return false;
    },

    attachTail: function(data) {
        var _this = this;

        var columnCount = data.column;
        var columns = _this.$(".coll-one");
        var node = document.createElement("div");

        _.each(data.ContactsInfo, function(info) {
            var index = 0;
            var minHeight = Number.MAX_VALUE;
            for (var i = 0; i < columnCount; i++) {
                if (columns[i].clientHeight < minHeight) {
                    minHeight = columns[i].clientHeight;
                    index = i;
                }
            }

            var html = _this.template_info({"info":info, "chs":data.chs});
            var _node = node.cloneNode();
            _node.innerHTML = html;
            columns[index].appendChild(_node.firstChild);
        });

        _this.trigger("loaded");
    },
    
    getcolumn: function() {
        return Math.floor(document.body.clientWidth / 400);
    },
    
    refresh: function() {
        var _this = this;
        _this.$(".contacts-main").next().remove();

        var info = _this.model.get("data");
        info.column = _this.getcolumn();
        var html = _this.template(info);
        
        _this.$("#j_container").append(html);
        setTimeout(function(){
            _this.attachTail(info);
        }, 64);
    }

}));

$(function(){ new M2012.Addr.View.Clean() });

})(jQuery, _, M139);
