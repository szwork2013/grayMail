/******************************* **************************************************************
 通讯录联系人详情页, 工具栏
 2014.08.06
 AeroJin 
 ***********************************************************************************************/
 ;
 (function ($, _, M139) {
    M139.namespace("M2012.Addr.ToolBar", function (options) {

        var _this = this;
        this.config = options.config;
        this.command = options.command;
        this.callback = options.callback;
        this.serialId = options.serialId;
        this.contactsModel = top.M2012.Contacts.getModel();

        this.TYPE = {
            moblie: '手机号码',
            email: '邮箱'
        }

        this.init = function(){
            this.createTool();
        };

        this.createTool = function(){
            var len = this.config.length;

            for(var i = 0; i < len; i++){                
                var options = this.setOptions(this.config[i]);
                M2012.UI.MenuButton.create(options);
            }
        };

        this.setOptions = function(item){
            var _this, options;

            _this = this;
            options = $.extend({}, item);
            options.eftSibling = false;
            options.rightSibling = false;
            options.container = this.byID(item.id);

            if(item.html){
                options.html = item.html;
            }
            
            if(item.menuItems){
                options.onItemClick = function(obj){                    
                    _this.command[item.command](obj);
                };

                if(item.click){
                    options.onClick = function(obj){                        
                        _this.command[item.click](options);                        
                    };

                    options.onClickBefore = function(e){                        
                        if(item.key && item.key.length){
                            top.BH(item.key);
                        }

                        $('body').click();                        
                        return false;
                    };
                }else{
                    options.onClickShow = function(e){                        
                        if(options.action && options.action.length){
                            top.BH(options.action);
                        }                      
                    };
                }
            }

            if(!item.menuItems){
                options.onClick = function(obj){                    
                    _this.command[item.command](options);
                };
            }            

            return options;
        };

        this.byID = function(id){
            return document.getElementById(id);
        };

        this.next = function(type, callback) {
            var name = this.TYPE[type];
            var msg = {
                lang_01: '联系人资料没有{0}'.format(name)
            };

            this.dialog =  top.$Msg.showHTML(this.getHtml(name), msg.lang_01);            

            this.ui = {};
            this.ui.el = this.dialog.$el;
            this.ui.btnNext = this.ui.el.find("#btn-next");
            this.ui.txtValue = this.ui.el.find("#txt-value");
            this.ui.message = this.ui.el.find("#txt-message");

            this.ui.btnNext.click(function () {
                var value = _this.ui.txtValue.val().trim();
                if(_this.check(value, type)){
                    _this.save(value, type, callback);
                }
            });
        };

        this.save = function(value, type, callback){
            var options = {};
            var master = top.$Addr;
            var key = type == 'email' ? 'FamilyEmail' : 'MobilePhone';

            options.data = _this.contactsModel.getContactsById(this.serialId);
            options.data[key] = value;
            
            options.success = function(){
                _this.dialog.close();
                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: _this.serialId
                });

                callback && callback(value);
            };

            options.error = function(result){
                _this.ui.message.text(result.msg);
            };

            top.Contacts.execContactDetails(options.data, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });                                
        };

        this.check = function(value, type) {
            var name = this.TYPE[type];

            if(value.length == 0){
                this.ui.message.text('{0}不能为空'.format(name));
                return false;
            }

            if(type == 'moblie' && !top.Validate.test("mobile", value)){
                this.ui.message.text('手机号码格式不正确，请输入3-20位数字');
                return false;
            }

            if(type == 'email' && !top.Validate.test("email", value)){
                this.ui.message.text('邮箱地址格式不正确。应如zhangsan@139.com，长度6-90位');
                return false;
            }

            return true;
        };

        this.getHtml = function(name){
            return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="txt-value" maxlength="90" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="txt-message" name="divError" style="width:240xp;color:Red;padding-left:111px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn">\
                        <span class="bibBtn">\
                            <a href="javascript:void(0)"  id="btn-next"  class="btnSure"><span>下一步</span></a>\
                        </span>\
                    </div>\
                </div>\
            </div>'.format(name);        
        };

        this.init();
    });
})(jQuery, _, M139);