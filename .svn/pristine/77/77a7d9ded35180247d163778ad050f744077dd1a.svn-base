;

(function ($, _, M) {

/**
 * 给选择出来的元素加上空白文本。
 * @param {String} text 设置的空白文本，如果为空则取消空白文本逻辑
 * @return {Void}
 */
$.extend($.fn, {
    blankText: function() {
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
    }
});

M.namespace("M2012.UI.ListMenu",

    /**
     * 下拉列表类
     */
    function(param) {
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
            $(this).data("value", buff.shift());
        });

        if (typeof(param.defaultValue) != "undefined") {
            _.textField.innerHTML = param.defaultValue;
        }

        $(_.listContainer.childNodes).click(function(e){
            _.textField.innerHTML = this.textContent || this.innerText;
            var value = $(this).data("value");

            _.onItemClick({ "value": value, sender: this, event: e});

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
                    if ($(this).data("value") == value){
                        _.textField.innerHTML = value;
                    }
                });
            }
        };
    }
);

})(jQuery, _, M139);

