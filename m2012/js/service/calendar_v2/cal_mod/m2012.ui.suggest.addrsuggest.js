/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M2012.UI.Suggest.InputSuggest;
    /***/
    M139.namespace("M2012.UI.Suggest.AddrSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.AddrSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.AddrSuggest
        *@extends M139.UI.Suggest.InputSuggest
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 要筛选的通讯录数据类型
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Boolean} options.onlyAddr 返回的值是否不包含署名，默认是flase
        *@example
        */
        initialize:function(options){
            this.contactModel = M2012.Contacts.getModel();
            this.filter = options.filter;
            this.onlyAddr = options.onlyAddr;
            superClass.prototype.initialize.apply(this,arguments);
        },
        /**
         *返回输入匹配的联系人，为基类提供数据
         *@inner
         */
        onInput:function(value){
            var result = [];
            if (value != "") {
                value = value.toLowerCase();
                var items = this.contactModel.getInputMatch({
                    keyword: value,
                    filter: this.filter
                });

                var inputLength = value.length;
                for (var i = 0; i < items.length; i++) {
                    var matchInfo = items[i];
                    var obj = matchInfo.info;
                    var addrText = "";
                    if (matchInfo.matchAttr == "addr") {
                        matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else if (matchInfo.matchAttr == "name") {
                        matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else {
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText);
                    }
                    var value = obj.addr;
                    if(!this.onlyAddr){
                        if(this.filter == "email"){
                            value = M139.Text.Email.getSendText(obj.name,obj.addr);
                        }else{
                            value = M139.Text.Mobile.getSendText(obj.name,obj.addr);
                        }
                    }
                    result.push({text:addrText,value:value,name:obj.name});
                }
            }
            return result;
        }
    }));

    jQuery.extend(M2012.UI.Suggest.AddrSuggest,
    /**@lends M2012.UI.AddrSuggest*/
    {
        /**
         *创建自动输入提示组件实例
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.textbox 要捕获的文本框
         *@param {String} options.filter 要筛选的通讯录数据类型
         *@param {Number} options.maxItem 可选参数，一次最多显示几个，默认50个
         */
        create:function(options){
            var ui = new M2012.UI.Suggest.AddrSuggest(options);
            return ui;
        }
    });
})(jQuery,Backbone,_,M139);