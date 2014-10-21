
/**
 * 下拉列表类
 */
Utils.waitForReady("jQuery", function(){

/**
 * 给选择出来的元素加上空白文本。
 * @param {String} text 设置的空白文本，如果为空则取消空白文本逻辑
 * @return {Void}
 */
(function($){
    $.fn.blankText = function() {
        if (this.length <1) return this;
        var text = arguments[0];

        if (text === "") {
            $(this).unbind("focus").unbind("blur");
        } else {
            $(this).focus(function(){
                if (this.value == text) {
                    this.value = "";
                    this.style.color = "";
                }
            }).blur(function(){
                if (this.value.length == 0){
                    this.value = text;
                    this.style.color = "#AAA";
                }
            });

            if(this.val() == "") {
                this.val(text).css("color", "#AAA");
            }
        }
    };
})(jQuery);

/**
 * 兼容html5的 custom data attributes 新特性
 * 注意：当针对单个元素取值时，直接返回value，不需要[0]
 */
(function($){  
    $.fn.dataset = function() {
        if (this.length <1) return "";

        var key = arguments[0];
        var value = arguments[1];

        var _support = !!window.DOMStringMap;
        var _item = null;
        var _prefix = "data-";

        if (value !== undefined){
            if (_support) {
                for (var i = 0; i < this.length; i++) {
                    this[i].dataset[key] = String(value);
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].setAttribute(_prefix + key, String(value));
                }
            }
            value = this;
        } else {
            value = [];

            for(var i=0; i<this.length; i++){
                _item = this[i];

                if (_support){
                    value.push(_item.dataset[key]);
                    continue;
                }

                value.push(_item.getAttribute(_prefix + key));
            }

            if (value.length == 1){
                value = value[0];
            }
        }
        return value;
    };
})(jQuery);

});

(function(UI){

    /**
     * 下拉列表类
     */
    var selectlist = function(param) {
        this.expandButton = param.expandButton;
        this.listContainer = param.listContainer;
        this.textField = param.textField;
        this.data = param.data;
        this.onItemCreate = param.onItemCreate;
        this.onItemClick = param.onItemClick;

        var _ = this;

        //点展开按钮时，计算完边界后，显示菜单
        $(_.expandButton).click(function(e){
            var listHeight = $(_.listContainer).height();
            var _this = $(this);
            var menuBottom = listHeight + _this.offset().top + _this.height();

            var _top = menuBottom > $(document).height() ?
                0-listHeight-7 : _this.height()

            $(_.listContainer).css("top", _top).show();
            e.stopPropagation();
        });

        $(document).click(function(e){
            $(_.listContainer).hide();
        });

        if (!$.isFunction(_.onItemCreate)){
            _.onItemCreate = function(){};
        }

        var buff = [];
        for(var i=0, m=_.data.length; i<m; i++){
            buff.push(_.onItemCreate(_.data[i], i, m));
        }
        _.listContainer.innerHTML = buff.join("");
        $(_.listContainer).hide();
        buff = null;

        buff = [].concat(_.data);
        $(_.listContainer.childNodes).each(function(i){
            $(this).dataset("value", buff.shift());
        });

        if (typeof(param.defaultValue) != "undefined") {
            _.textField.innerHTML = param.defaultValue;
        }

        $(_.listContainer.childNodes).click(function(e){
            _.textField.innerHTML = this.textContent || this.innerText;
            _.onItemClick(this, e);
            e.stopPropagation();
            $(_.listContainer).hide();
        });

        this.length = function(){
            return _.listContainer.childNodes.length;
        };

        this.value = function(value){
            if (typeof(value) == "undefined"){
                var _value = _.textField.innerHTML;
                $(_.listContainer.childNodes).each(function(i){
                    var itemValue = this.textContent || this.innerText;
                    if (_value == itemValue) {
                        return _.data[i];
                    }
                });
            } else {
                $(_.listContainer.childNodes).each(function(i){
                    if ($(this).dataset("value") == value){
                        _.textField.innerHTML = value;
                    }
                });
            }
        };
    };

    UI.selectlist = selectlist;

})(Utils.UI);
