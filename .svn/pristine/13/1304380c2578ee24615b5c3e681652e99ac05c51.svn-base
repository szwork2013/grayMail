
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Remind";

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        module: 'remind',

        addMeData: [], //缓存可能认识的人

        WHO_TYPE: {
            ONCE: 'once',
            BIS: 'bis'
        },

        template:'<li class="clearfix">\
                    <a href="javascript:void(0);" data-index="<%=index%>" class="btn-photo"><img src="<%=url%>" width="36px" height="36px"></a>\
                    <span><%=showName%></span>\
                    <a href="javascript:void(0);" data-index="<%=index%>" class="btn-add add-btns">添加</a>\
                </li>',

        REMIND_MAX: 2,

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.model = new M2012.Addr.Model.Common();
            _this.initUI();
            _this.initEvents();            
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        initEvents: function () {
            var _this = this;
            var master = this.master;

            _this.on("print", function () {
                
            }); 

            master.bind(_this.module, function(data){
                _this[data.fun](data);
            });

            master.on(master.EVENTS.LOAD_WHO_ADD_ME, function(data) {
                _this.append(data);
            });
           
			_this.getWhoAddMe();
			_this.getMergeData();
			_this.getImportData();
			_this.getUpdateData();                    
        },
        initUI: function(){
            this.ui = {};
            this.ui.wamNum = $('#wam_num');
            this.ui.wamBox = $('#wam_box');
            this.ui.toolMove = $('#tool_move');
            this.ui.wamContainer = $('#wam_container');            
        },
        getWhoAddMe: function(info){
            var _this, options;

            _this = this;
            var options = {
                    info: {
                        isRand: 1,
                        pageSize: 2,
                        pageIndex: 1
                    }
                };            

            options.success = function(result){
                top.BH('addr_whoAddMe_loadRemind');
                _this.setWhoAddMeUI(result.list);
            };

            options.error = function(result){
                _this.ui.wamContainer.hide();
            };

            this.model.getWhoAddMePageData(options);
        },
        append: function(info){
            var _this = this;
            var user = null;
            var type = '';
            var isAppend = false;

            //查找被添加的人在不在当前存量里面,如果在,剔除,重新弄请求一条数据
            if(info && this.addMeData){
                for(var i = 0; i < this.addMeData.length; i++){
                    var list = this.addMeData[i];
                    if(list.UserNumber == info.UserNumber){
                        isAppend = true;
                        type = list.RelationId.length == 0 ? this.WHO_TYPE.BIS : this.WHO_TYPE.ONCE;
                        this.addMeData.splice(i, 1);                        
                        break
                    }
                }
            }

            if(isAppend){
                var options = {
                        info: {
                            isRand: 1,
                            pageSize: 2,
                            pageIndex: 1
                        }
                    };

                var fun = {
                   bis: function (len) {
                        return len == 0; 
                   },
                   once: function (len) {
                        return len > 0;
                   } 
                };

                options.success = function(result) {
                    var list = [];
                    var current = _.pluck(_this.addMeData, 'UserNumber');
                    var map = info.UserNumber + ',' + current.join(',');

                    //首先去重
                    for(var i = 0; i < result.list.length; i++){
                        var item = result.list[i];
                        if(map.indexOf(item.UserNumber) < 0){
                            list.push(item);
                        }
                    }

                    if(list.length > 0){

                        //根据被剔除的数据类型,获取相应的数据类型
                        for(var i = 0; i < list.length; i++){
                            var len = list[i].RelationId.length;

                            if(fun[type](len)){
                                user = list[i];
                                break;
                            }
                            
                            user = list[0];
                        }

                        if(user){
                            _this.addMeData.push(user);
                        }                        
                    }

                    _this.setWhoAddMeUI(_this.addMeData);
                };

                options.error = function() {

                };  

                this.model.getWhoAddMePageData(options);   
            }
            
        },
        setWhoAddMeUI: function(list){
            var buff = [];
            var _this = this;
            var len = list.length > _this.REMIND_MAX ? _this.REMIND_MAX : list.length;

           for(var i = 0; i < len; i++){
                var item = list[i];
                if(item.DealStatus == "0"){
                    item.index = i;
                    item.url = (new top.M2012.Contacts.ContactsInfo(item)).ImageUrl;
                    item.showName = M139.Text.Html.encode(_this.replaceStar(item.Name));
                    buff.push(_.template(_this.template, item));
                }

                list[i] = item;
            }

            if(buff.length){
                _this.ui.wamBox.html(buff.join('\n'));
                _this.ui.wamContainer.show();

                _this.ui.wamBox.find('.btn-add').click(function(){
                    _this.setDailog($(this));
                    top.BH('addr_remind_add');
                });

                _this.ui.wamBox.find('.btn-photo').click(function(){
                    _this.setDailog($(this));
                    top.BH('addr_remind_photo');
                });
            }else{
                this.ui.wamContainer.hide();
            }

            _this.addMeData = list;
            _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                key: 'events:resetLeftbar'
            });
        },
        setDailog: function(dom){
            var _this = this;
            var list = _this.addMeData;
            var index = parseInt(dom.data('index'));
            var dialog = new M2012.Addr.View.MaybeknownDialog({data: list[index]});
                dialog.onSuccess = function(info) {
                    _this.master.trigger(_this.master.EVENTS.LOAD_WHO_ADD_ME, info);
                };
        },
        getImportData: function(){
            var _this, options, master, obj;

            _this = this;
            options = {};            
            master = this.master;

            options.success = function(result){
                obj = new Object(result);                      
                obj.sum = parseInt(result.Update);
                master.set({pimData: obj});
            };

            options.error = function(result){

            };

            this.model.getImportStatus(options);
        },
        getMergeData: function(){
            var _this, options, info, master, obj;
            
            _this = this;
            master = this.master;

            options = {};
            options.success = function(result){
                obj = new Object(result);                
                obj.InfoNum = parseInt(obj.InfoNum);
                obj.NameNum = parseInt(obj.NameNum);
                obj.sum = obj.InfoNum + obj.NameNum;

                master.set({repeatData: obj});
            };

            options.error = function () {
                
            };

            this.model.GetRepeatContactsNew(options);
        },
        getUpdateData: function(){
            var _this, options, info, master, obj;

            _this = this;            
            master = this.master;

            options = {
                data: {
                    GetUpdatedContactsNum: {}
                },
                name: 'GetUpdatedContactsNum'
            };

            options.success = function(result){                
                info = result.GetUpdatedContactsNumResp;                
                if(info){
                    obj = new Object(info);
                    obj.sum = parseInt(info.UpdatedContactsNum);

                    master.set({updateData: obj});   
                }               
            };

            options.error = function(result){

            };

            this.model.fetch(options);
        },
        replaceStar: function (name) {
            //手机号变星星。
            var showName = name;
            if (name.length == 11 && /^\d+$/.test(name)) {
                showName = name.replace(/(?:^86)?(\d{3})\d{5}/, "$1*****");
            }
            return showName;
        }
    }));

})(jQuery, _, M139);
