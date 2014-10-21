
///////////////////////////////
//     联系人，双列，选择控件
//     主要用于：写信页、通讯录组编辑页、导出联系人页。
///////////////////////////////
function DualAddrList(param){
    this.id = Math.floor(Math.random()*0xefffffff + 0x10000000).toString(16);

    var _default = DualAddrList.DEFAULT_CFG;
    var _param = {};
    _param.height = param.height || _default.height;
    _param.width = param.width || _default.width;
    _param.height = param.height || _default.height;
    _param.model = param.model || _default.model;
    _param.limit = param.limit || _default.limit;

    this.param = _param;
}

//组件的呈现模式：
DualAddrList.MODELS_CONTACT = 0;
DualAddrList.MODELS_EMAIL = 1;
DualAddrList.MODELS_FAX = 2;
DualAddrList.MODELS_MOBILE = 3;

//组件的默认参数
DualAddrList.DEFAULT_CFG = {

    height: "100%",
    width: "100%",

    model: DualAddrList.MODELS_EMAIL,

    //可选择到右侧的最大联系人数。
    limit: Number.MAX_VALUE 
};

(function(_){
    var _location = top.location;
    var TEMPLATE_URL = _location.protocol + "//" + _location.host + (_location.port ? ":" + _location.port : "");

    if (top.rmResourcePath) {
        TEMPLATE_URL = TEMPLATE_URL + "/dualAddrList.htm";
    } else {
        TEMPLATE_URL = TEMPLATE_URL + top.stylePath + "/dualAddrList.htm";
    }

    _.create = function(container){
        var _param = this.param;
        
        var _url = TEMPLATE_URL + "?a=a"
            + "&model=" + _param.model;

        if (_param.limit < Number.MAX_VALUE) {
            _url += "&limit=" + _param.limit;
        }

        var htmlCode = [
            "<iframe name=\"dualAddrList_",
            this.id,
            "\" id=\"dualAddrList_",
            this.id,
            "\" style=\"border:none;width:",
            _param.width,
            ";height:",
            _param.height,
            "\" frameBorder=\"0\" scrolling=\"no\" src=\"",
            _url,
            "&sid=",
            top.UserData.ssoSid ? top.UserData.ssoSid : "",
            "\"></iframe>"
        ].join("");

        container.innerHTML = htmlCode;
        _param.container = container;
    }

    _.getCurrent = function(){
        var domEle = document.getElementById("dualAddrList_" + this.id);
        return domEle;
	}

    _.ready = function(callback){
        var domEle = this.getCurrent();
        var timer = setInterval(function(){
            try {
                callback.call(domEle.contentWindow.AddressBook);
                clearInterval(timer);
            } catch(ex){
                //重试
            }
        }, 250);
    }

    _.getSelection = function(callback){
        this.ready(function(){
            if($.isFunction(callback)){
                callback(this.GetSelection());
            }
        });
    }

    //给通讯录编辑组用的，一次选择整组
    _.groupby = function(groupid){
        this.ready(function(){
            this.GroupBy(groupid);
        });
    }

    /**
     * 给通讯录编辑组用的，取已选择的sid串
     * @param {Function} callback(sids)
     * @return {String} sid1,sid2,sid3样的sid串。
     */
    _.getSelectionString = function(callback){
        this.getSelection(function(list){
            var buff = [];
            for(var i=0, m=list.length; i<m; i++){
                buff.push(list[i].SerialId);
            }

            if($.isFunction(callback)){
                callback(buff.join(","));
            }
        });
    }

    /**
     * 清空已选择的联系人。
     */
    _.empty = function(){
        this.ready(function(){
            this.Empty();
        });
    }

    /**
     * 一次选择所有的联系人到右侧。
     */
    _.selectAll = function(){
        this.ready(function(){
            this.SelectAll();
        });
    }

})(DualAddrList.prototype);
