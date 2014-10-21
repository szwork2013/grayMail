/**
 * 格式化文件框组件，必须引用jquery1.2以上版本
 * <pre>示例：<br>
 * <br>FormatTextarea(<'input':文本框对象,'splitStr':',','maxHeight':188>);
 * </pre>
 * @author sunsc
 * @param {Object} param 参数对象
 * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
 * @param {string} param.splitStr 可选参数 格式化分割符
 * @param {int} param.maxHeight 可选参数 文本框最大高度
 * @param {int} param.whichCode 可选参数 键盘ascii码
 */
var FormatTextarea = window.FormatTextarea = function(param){
    return param ? new FormatTextarea.fn.mainInit(param) : null;
};
FormatTextarea.fn = FormatTextarea.prototype = {
    /**
     * 构造方法
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    mainInit: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var inputHeight = param.input[0].scrollHeight;//输入框内行高度
        inputHeight = $.browser.msie ? inputHeight : inputHeight - 1;//初始化、调整高度
        //inputHeight = inputHeight >= 18 ? 18 : inputHeight;
        this.inputHeight = inputHeight;//默认输入框高度
        this.formatHanlder = null;
        this.whichCode = param.whichCode ? parseInt(param.whichCode, 10) : (param.input.attr("which").trim() == "" ? 188 : parseInt(param.input.attr("which").trim(), 10));//ascii码
        this.whichCode = isNaN(this.whichCode) ? 188 : this.whichCode;
        this.maxHeight = param.maxHeight ? parseInt(param.maxHeight, 10) : (param.input.attr("maxHeight").trim() == "" ? 188 : parseInt(param.input.attr("maxHeight").trim(), 10));//最大高度
        this.maxHeight = isNaN(this.maxHeight) ? 188 : this.maxHeight;
        this.splitStr = param.splitStr ? param.splitStr : param.input.attr("whichChr").trim() == "" ? "," : param.input.attr("whichChr").trim();//分割符
        this.regEvent(param);//事件绑定
        return this;
    },
    /**
     * 注册事件
     * <pre>示例：<br>
     * <br/>var ft=FormatTextarea(<'input':文本框对象>);
     * <br/>ft.regEvent(<'input':文本框对象>);
     * </pre>
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    regEvent: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var theThis = this;
        var shiftDown = false;//shift键是否按下
        param.input.keyup(function(e){//输入框键按起
            if (e.which == 13) {//回车事件
                if (param.input.val().replace(/\n/g, "") == "") {//输入框没有值
                    param.input.val("");
                    return false;
                }
                param.onlyEnter = true;
                theThis.calcTheHeigth(param);//计算输入框高度
                return false;
            }
            if (e.which != 16) {//shift事件
                if (e.which == theThis.whichCode && !shiftDown) {
                    theThis.foramtContents({
                        "input": $(this),
                        "errList": [],
                        "eventCode": e.which
                    });
                }
                shiftDown = false;
            }
            else {
                shiftDown = true;
            }
        });
        /**
         * 粘贴事件
         */
        param.input[0].onpaste = function(){
            theThis.foramtContents({
                "input": $(this),
                "errList": []
            });
        }
        return this;
    },
    /**
     * 格式化内容
     * <pre>示例：<br>
     * <br/>var ft=FormatTextarea(<'input':文本框对象>);
     * <br/>ft.foramtContents(<"input":文本框对象>);
     * </pre>
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    foramtContents: function formatLine(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var theThis = this;
        if (this.formatHanlder) {
            clearTimeout(formatHanlder);
        }
        formatHanlder = setTimeout(function(){
            var oldValue = param.input.val().trim();//得到输入框值
            if (param.errList && param.errList.length > 0) {
                oldValue = param.errList.join(theThis.splitStr);//错误的格式内容
            }
            if (oldValue != "") {
                var arrValue = oldValue.replace(/\n/gi, "").split(theThis.splitStr);//转换成数组
                var l = arrValue.length;//长度
                var arrTemp = [];//临时数组，保存格式化后的值
                $.each(arrValue, function(i, data){
                    if (i == (l - 1))//最后一个值不加逗号和回车
                        arrTemp.push($.trim(data));
                    else 
                        arrTemp.push($.trim(data) + theThis.splitStr + "\n");
                });
                param.input.val(arrTemp.join(""));//赋值到输入框
                param.count = l;//格式化后行数
                param.onlyEnter = false;//内容是否只有回车
                theThis.calcTheHeigth(param);//计算高度
                arrValue = arrTemp = null;
            }
            if (param.callback) {
                callback.call(theThis);
            }
        }, 800);
        return this;
    },
    /**
     * 计算高度
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     * @param {int} param.count 可选属性 格式化后的行数
     * @param {Boolean} param.onlyEnter 可选属性 内容是否只有回车字符
     */
    calcTheHeigth: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var currHeight = this.maxHeight;
        try {
            if (param.onlyEnter) {
                currHeight = param.input[0].scrollHeight;
                var currVal = param.input.val().replace(/\n\n/g, "\n");
                param.input.val(currVal);
            }
            else {//计算行高
                if (param.count) 
                    currHeight = parseInt(param.count > 1 ? $.browser.msie ? this.inputHeight * param.count - (param.count * 3) : this.inputHeight * param.count : this.inputHeight, 10);
            }
            if (currHeight >= this.maxHeight) {
                param.input.css({//超过最大高度，显示滚动条
                    "overflow": "scroll",
                    "overflow-y": "scroll",
                    "overflow-x": "hidden"
                }).height(this.maxHeight);
            }
            else {
                param.input.height(currHeight);//只调高度
            }
        } 
        catch (e) {
            return this;
        }
        return this;
    }
};
FormatTextarea.fn.mainInit.prototype = FormatTextarea.fn;
