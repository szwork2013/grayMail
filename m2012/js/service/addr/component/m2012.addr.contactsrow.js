/******************************* **************************************************************
 通讯录联系人详情页, 联系人行组件
 2014.07.29
 AeroJin 
 ***********************************************************************************************/
 ;
 (function ($, _, M139) {
    M139.namespace("M2012.Addr.ContactsRow", function (options) {
        var _this = this;

        this.options = options;
        this.items = options.items;
        this.options.type = options.type || 'defaults';
        this.options.operate = options.operate || 'defaults';

        this.init = function(){

            this.ui = {};
            this.ui.li = $('<li class="clearfix"></li>');
            this.ui.label = $('<label class="label"></label>');
            this.ui.element = $('<div class="element"></div>');
            this.operate = this._operate[this.options.operate];
            var rows = this.rows[this.options.type].getRows(this.options); 

            this.ui.label.append(rows.text);
            this.ui.element.append(rows.element);
            this.ui.element.append(rows.operate);

            this.ui.li.append(this.ui.label);
            this.ui.li.append(this.ui.element);

            this.regEvent();
            //this.container.append(this.ui.li);
        };  

        this.regEvent = function(){
            this._operate.add.click(function(){
                var $this = $(this);
                var rows = new M2012.Addr.ContactsRow(_this.items);
                    rows.onRemove = function(){
                        $this.show();
                    };

                _this.ui.li.after(rows.ui.li);
                $this.hide();

            });

            this._operate.remove.click(function(){
                _this.remove();
            });
        };

        this.remove = function(){
            this.ui.li.remove();
            this.onRemove();
        }

        this.onRemove = function(){

        };

        /*operate
          1.添加
          2.删除*/
        this._operate = {
            defaults: '',
            add: $('<a href="javascript:void(0);" class="i-c-add ml_5"></a>'),
            remove: $('<a href="javascript:void(0);" class="i-c-minus ml_5"></a>')
        };



        /*type
          0.普通, 
          1.头像,
          2.日期
          3.分组
          4.性别
          5.地址
          6.多行文本*/

        this.rows = {
            defaults: {
                getRows: function(options){
                    var text = "{0}:";
                    var element = '<input type="text" style="width:268px;" maxlength="{2}" name="{1}" class="iText" value="{0}">';

                    text = text.format(options.text);
                    element = element.format(options.value, options.name, options.maxlength);

                    return {
                        text: text,
                        element: element,
                        operate: _this.operate
                   }
                }
            },
            image: {
                getRows: function(options){
                   var text = '<img src="{0}"/><input type="file" name="">';
                   var element = '<input type="text" style="width:138px;" value="{0}" name="{1}" maxlength="{2}" class="iText">';

                   text = text.format(options.text);
                   element = element.format(options.value, options.name, options.maxlength);

                   return {
                        text: text,
                        element: element,
                        operate: _this.operate
                   }                   
                }
            },
            date: {
                getRows: function(options){
                    var text = "{0}:";
                    var element = '<input type="text" style="width:128px;" value="{0}" name="{1}" maxlength="{2}" class="iText"><a href="javascript:void(0);" id="{3}" class="i-create"></a>';

                    text = text.format(options.text);
                    element = element.format(options.value, options.name, options.maxlength, options.id);

                    return {
                        text: text,
                        element: element,
                        operate: _this.operate
                    }
                }
            },
            group: {
                getRows: function(options){
                    var text = "{0}:";
                    var element = '<div style="float:left;overflow:hidden;_zoom:1;" name={0} class="groupingContacts"></div>';

                    text = text.format(options.text);
                    element = element.format(options.name, options.value,  options.maxlength);

                    return {
                        text: text,
                        element: element,
                        operate: _this.operate
                    }
                }
            },
            sex: {
                getRows: function(options){
                    var text = "{0}:";
                    var element = '<input type="radio" name="{0}" class="radio" /><label for="" class="radioInfo">男</label>\
                            <input type="radio" name="{0}" class="radio" /><label for="" class="radioInfo">女</label>\
                            <input type="radio" name="{0}" class="radio" /><label for="" class="radioInfo">保密</label>';

                    text = text.format(options.text);
                    element = element.format(options.name);

                    return {
                        text: text,
                        element: element,
                        operate: _this.operate
                    }
                }
            },
            address: {
                getRows: function(options){
                    var address;
                    var text = "{0}:";
                    var element = $('<div class="clearfix addAddrBox"></div>');

                    text = text.format(options.text);
                    address = new M2012.Addr.Address({container: element});
                    address.container.append(_this.operate);

                    return {
                        text: text,
                        element: address.container,
                        operate: ''
                    }
                }
            },
            textarea: {
                getRows: function(options){
                    var text = "{0}:";
                    var element = '<textarea class="iText tagarea" name="{1}" style="display: inline; height:70px; width:268px;">{0}</textarea>';

                    text = text.format(options.text);
                    element = element.format(options.value, options.name);

                    return {
                        text: text,
                        element: element,
                        operate: _this.operate
                    }
                }
            }
        };

        this.init();
    });
})(jQuery, _, M139);

;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.ContactsRow", function (options) {
        var _this = this;

        this.label = options.label;
        this.element = options.element;

        this.init = function(){
            this.ui = {};
            this.ui.li = $('<li class="clearfix"></li>');
            this.ui.label = $('<label class="label"></label>');
            this.ui.element = $('<div class="element"></div>');

            this.ui.label.append(this.label);
            this.ui.element.append()
        };

    });
})(jQuery, _, M139);