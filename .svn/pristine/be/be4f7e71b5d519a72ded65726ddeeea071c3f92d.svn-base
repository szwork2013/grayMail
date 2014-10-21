;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.View.Tool";

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);
        },
        alert: function () {
            return top.$Msg.alert.apply(top.$Msg, arguments);
        },
        confirm: function () {
            return top.$Msg.confirm.apply(top.$Msg, arguments);
        },

        showHTML: function (){
            return top.$Msg.showHTML.apply(top.$Msg, arguments);
        },

        getSid: function () {
            return top.$App.getSid();
        },
        
        getMaxSend: function () {
            return top.$User.getMaxSend();
        },
        
        getServiceItem: function () {
            return top.$User.getServiceItem();
        },

        updateVipMail:function(){
            if(top.Main.searchVipEmailCount){
                top.Main.searchVipEmailCount();
            }
        },

        checkAvaibleForMobile: function(receiver, params, scontent){            
            // 检测对应功能是否对互联网用户开放
            return !(top.$User && !top.$User.checkAvaibleForMobile());            
        },

        getEmail: function (contacts) {
            var tmp, map, len, receiver;

            map = {};
            receiver = [];
            len = contacts.length;
            tmp = len > 20 ? '{0}' : '{1}<{0}>';

            $(contacts).each(function() {                
                var email = this.getFirstEmail();
                if (email && !map[email]){
                    map[email] = true;                    
                    receiver.push(tmp.format(email, this.name.replace(/"/g, "")));                    
                }
            });

            return receiver.join(';');
        },
        getMoblie: function(contacts){
            var map, receiver;

            map = {};
            receiver = [];

            $(contacts).each(function() {
                var mobile = this.getFirstMobile().replace(/\D/g, "");
                if (mobile && !map[mobile]){
                    map[mobile] = true;
                    receiver.push(mobile);
                }
            });

            return receiver.join(',');
        },
        getNextHtml: function(name){
            return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="txtValue" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="txtMessage" name="divError"  style="color:Red;padding-left:113px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:void(0)"  id="btnNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
            </div>'.format(name);
        }
    }));

})(jQuery, _, M139);
