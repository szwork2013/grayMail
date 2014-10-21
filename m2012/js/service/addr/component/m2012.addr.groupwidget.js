/******************************* **************************************************************
 通讯录联系人详情页, 组控件
 2014.07.22
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.GroupWidget", function (options) {
       
       var _this = this;


       this.group = options.group || [];
       this.groupMap = this.group.join(',');
       this.container = options.container || $('body');
       this.isShowNewGroup = options.isShowNewGroup || true;

       this.selectList = {};
       this.newGroupName = '';
       this.isNewGroup = false;

       this.contactsModel = top.M2012.Contacts.getModel();
       this.members = this.contactsModel.getGroupList();

       this.template = {
            list: '<li><label><input class="addr-group-list" type="checkbox" value="<%=id%>"><%=name%></label></li>',
            container: '<ul style="margin-left:0;" class="GroupsContainer">{0}</ul>{1}',
            newGroup: '<p>\
                        <input type="checkbox" id="chk-new-group">\
                        <input type="text" maxlength="16" data-defvalue="新建分组" id="txt-group-name" class="iText" value="新建分组">\
                    </p>'
        };

       this.formatHtml = function() {
            var list = [];
            var newGroup = '';            
            var template = _.template(this.template.list);

            for(var i = 0, len = this.members.length; i < len; i++){
                list.push(template(this.members[i]));
            }

            if(this.isShowNewGroup){
                newGroup = this.template.newGroup;
            }

            this.html = $(this.template.container.format(list.join('\n'), newGroup));

            return this.html;
       };

       this.setDefault = function(){
            this.html.find('input.addr-group-list').each(function(){
                if(_this.groupMap.indexOf(this.value) > -1){
                    this.click();
                }
            });
       };

       this.regEvent = function() {
            this.html.find('input.addr-group-list').click(function(){
                if(this.checked){
                    _this.selectList[this.value] = this.value;
                }else{
                    delete _this.selectList[this.value];
                }

                _this.onClick(this.checked);
            });

            this.html.find('#chk-new-group').click(function(){
                _this.isNewGroup = this.checked;
            });

            this.html.find('#txt-group-name').focus(function(){
                if($(this).val().trim() == $(this).data('defvalue').trim()){
                    $(this).val('');
                }
            });

            this.html.find('#txt-group-name').blur(function(){
                _this.newGroupName = $(this).val();

                if($(this).val().trim().length <= 0){
                    $(this).val($(this).data('defvalue'));
                }
            });
       };

       this.getData = function(){
          var obj = {};

          obj.groups = [];
          obj.isNewGroup = this.isNewGroup;
          obj.newGroupName = this.newGroupName;

          for(var s in this.selectList){
            obj.groups.push(s);
          }

          return obj;
       };

       this.onClick = function(){
            //空函数,需要覆盖, 为扩展需要
       };

       this.init = function(){
            this.formatHtml();
            this.regEvent();
            this.setDefault();

            this.container.html('').append(this.html);
       };

       this.init();
    });

})(jQuery, _, M139);
