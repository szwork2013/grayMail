/******************************* **************************************************************
 通讯录联系人详情页, 组控件
 2014.07.22
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.GroupWidget", function (options) {
       
       var _this = this;
       this.width = options.width;
       this.group = options.group || [];
       this.isTopMenu = options.isTopMenu;
       this.groupMap = this.group.join(',');
       this.container = options.container || $('body');
       this.callback = options.callback || function(){};
       this.onChange = options.onChange || function(){};
       this.onRemove = options.onRemove || function(){};

       this.template = {
            list: '<li class="clearfix" data-value="<%=value%>">\
                    <span><%=html%></span>\
                    <a href="javascript:void(0)" class="closeMin btn-close"></a>\
                </li>',
            listBox: '<ul class="boxIframeAddr_list clearfix  pb_0" style="display:none;"></ul>'
        };

        this.init = function(){

            this.ui = {};
            this.ui.container = this.container;            
            this.ui.listBox = $(this.template.listBox);

            //存放选中组数据
            this.items = {};
            this.menuItems = [];

            //注册组件,绑定事件, 设置默认值
            this.regMenu();
            this.regEvent();
            this.setDefault();

            //填充UI
            this.ui.container.append(this.ui.listBox);
        };

        this.regMenu = function() {
            var model = top.M2012.Contacts.getModel();
            var data = model.getGroupList();
            var DropMenu = this.isTopMenu ? top.M2012.UI.DropMenu : M2012.UI.DropMenu;

            this.menuItems = [{
                value: '',
                html: '选择分组'
            }];

            for(var i = 0; i < data.length; i++){
                var item = {
                    value: data[i].id,
                    html: M139.Text.Html.encode(data[i].name)
                };

                this.menuItems.push(item);
            }

            this.dropMenu = DropMenu.create({
                selectedIndex: 0,
                menuItems : this.menuItems,
                container : this.ui.container
            });

            if(this.width){
                this.dropMenu.$el.width(this.width);
            }
        };

        this.regEvent = function() {
            this.dropMenu.on("change", function (e) {
                _this.add(e);
            });

            this.ui.listBox.delegate('a.btn-close', 'click', function() {
                var li = $(this).parent();
                var value = li.data('value');

                _this.remove(value, li);                
            });
        };

        this.setDefault = function() {
            if(this.groupMap.length > 0){
                for(var i = 1; i < this.menuItems.length; i++){
                    var items = this.menuItems[i];
                    if(this.groupMap.indexOf(items.value) > -1 && items.value.length > 0){
                        this.add(items);
                    }
                }
            }
        };

        this.add = function(e) {
            if(e.value.length > 0 && !this.items[e.value]){
                var template = _.template(this.template.list, e);

                this.items[e.value] = e;
                this.ui.listBox.append(template); 

                if(this.callback){
                    this.callback(this.getData().groups, e);
                }

                this.ui.listBox.show();
            }

            this.onChange(e);
            this.dropMenu.setSelectedIndex(0);
        };

        this.remove = function(id, li) {
            var item = this.items[id];

            if(item){
                li.remove();                
                delete this.items[id];

                if(this.callback){
                    this.callback(this.getData().groups, item);
                }
            }

            if(this.getData().groups.length <= 0){
                this.ui.listBox.hide();
            }

            this.onRemove(item || {});
        };

        this.getData = function(){
            var data = {
                groups: []
            };

            for(var key in this.items){
                data.groups.push(this.items[key].value);
            }

            return data;
        };       
       
       this.init();
    });

})(jQuery, _, M139);
