
//发布事件：
//this._AddEvent('ReduceSelectContact'); //带参数{ rname: 'zhangliang' }
//this._AddEvent('SelectContact');
//this._AddEvent('SelectGroupContact');

//对外的接口：
//GetAllAddrData() //获取全部通讯录数据
//GetSelectedData()  //获取当前选择的数据
//UseShotcutModel(
(function () {
    var addrFloatController = function () {
        //添加一个view和model记得在dispose方法中释放
        var model = {}; this.GetModel = function () { return model; }; this.SetModel = function (value) { model = value; };
        var view = {}; this.GetView = function () { return view; }; this.SetView = function (value) { view = value; };
        var searchModel = {}; this.GetSearchModel = function () { return searchModel; }; this.SetSearchModel = function (value) { searchModel = value; };
        var searchView = {}; this.GetSearchView = function () { return searchView; }; this.SetSearchView = function (value) { searchView = value; };
        var selectedModel = {}; this.GetSelectedModel = function () { return selectedModel; }; this.SetSelectedModel = function (value) { selectedModel = value; };
        var selectedView = {}; this.GetSelectedView = function () { return selectedView; }; this.SetSelectedView = function (value) { selectedView = value; };
        var contactItemIdPrefix = 'add_'; this.GetContactItemIdPrefix = function () { return contactItemIdPrefix; }; this.SetContactItemIdPrefix = function (value) { contactItemIdPrefix = value; };
        var contactGroupIdPrefix = 'gadd_'; this.GetContactGroupIdPrefix = function () { return contactGroupIdPrefix; }; this.SetContactGroupIdPrefix = function (value) { contactGroupIdPrefix = value; };
        var logger = new M139.Logger({ name: "addr_float" }); this.Logger = function () { return logger; };
        var isSimpleModel = false; this.IsSimpleModel = function () { return isSimpleModel; }; this.SetSimpleModel = function (value) { isSimpleModel = value; };

        //下面是都要的，最好是建立一个基类
        var publicEvents = {};
        this._AddEvent = function (eventName) {
            if (!hasOwnProperty.call(publicEvents, eventName)) {
                publicEvents[eventName] = [];
            }
        };
        this.AddListener = function (eventName, delegate) {
            //先检查publicEvents中的发布事件是否存在
            if (!hasOwnProperty.call(publicEvents, eventName)) {
                this.Logger().error('添加的事件在事件发布者中不存在：' + eventName + ':' + delegate);
                return;
            }
            //检查委托是否已经存在当前的发布事件中
            if (publicEvents[eventName].indexOf(delegate) != -1) return;
            publicEvents[eventName].push(delegate);
        };
        this.GetEventListener = function (eventName) {
            if (!hasOwnProperty.call(publicEvents, eventName)) {
                this.Logger().error('获取事件监听者时候没有找到监听事件：' + eventName);
                return null;
            }
            return publicEvents[eventName];
        };
        //发布事件：
        this._AddEvent('ReduceSelectContact'); //带参数{ rduceserId: userId }
        this._AddEvent('SelectContact');
        this._AddEvent('SelectGroupContact');
    };
    //------------------------------------------------------------------------------------------
    //初始化试图模型 入口,注意原型的问题（model和view中的变量均为原型范本，事件会触发2此）
    addrFloatController.prototype.Index = function (args) {
        var self = this;
        var model = new M139.Dom.AddrFloatModel.AddrFloatModel();
        //model的东西初始化
        this.SetModel(model);
        model.Groups = this.GetAllAddrData()['var'].Groups;
        model.SearchResult = [];
        model.SearchKey = "";
        model.Controller = this;

        //视图
        var view = new M139.Dom.AddrFloatView.AddrFloatView();
        model.Controller = view.Controller = this;
        this.SetView(view);
        view.model = this.GetModel();
        //助于这里的原型问题
        view.setElement(args.el);
        view.render();

        //搜索部分
        //显示收索结果
        var smodel = new M139.Dom.AddrFloatModel.AddrFloatSerachResultModel();
        this.SetSearchModel(smodel);
        smodel.SearchResult = [];
        smodel.Controller = this;
        //视图
        var sview = new M139.Dom.AddrFloatView.AddrFloatSerachResultView();
        smodel.Controller = sview.Controller = this;
        this.SetSearchView(sview);
        sview.model = this.GetSearchModel();
        sview.render();
        $(this.GetView().el).find('#addrSerachFloat').hide();

        //选择的联系人部分
        var stmodel = new M139.Dom.AddrFloatModel.AddrSelectedModel();
        this.SetSelectedModel(stmodel);
        stmodel.Selected = [];
        stmodel.Controller = this;
        //视图
        var stview = new M139.Dom.AddrFloatView.AddrFloatSelectedView();
        stmodel.Controller = stview.Controller = this;
        this.SetSelectedView(stview);
        stview.model = this.GetSelectedModel();
        stview.render();

  

        //
        if (this.IsSimpleModel()) {
            if (!(args.dataWapper
                && args.holder
                && args.oper
                && args.subOper
                && args.eventName)) {
                this.Logger().error('傻瓜模式下请传递完整的参数！');
            }
            $(args.subOper).html('<a id="okSelect" href="javascript:void(0)">确定</a> <a id="cancelSelect" href="javascript:void(0)">取消</a>');
            //傻瓜模式：
            $('#okSelect').live('click', function () {
                $(args.dataWapper).hide();
                $(args.subOper).hide();
                var box = $(args.holder);
                box.val('');
                $.each(self.GetSelectedData(), function (index, data) {
                    if (index === 0) {
                        box.val('<' + data['UserName'] + '>' + data['Email']);
                    } else {
                        box.val(box.val() + ',' + '<' + data['UserName'] + '>' + data['Email']);
                    }
                });
            });
            $('#cancelSelect').live('click', function () {
                $(args.subOper).hide();
                $(args.dataWapper).hide();
            });


            $(args.oper).show();
            $(args.oper).live(args.eventName, function () {
                $(args.dataWapper).show(50, function () {
                    $(args.subOper).show();
                });
            });
        }
    };

    //------------------------------------------------------------------------------------------
    //Action 部分
    // 搜索结果
    addrFloatController.prototype.SearchDataByKeyAction = function (searchKey) {
        var res = [];
        var groups = this.GetModel().Groups;
        if (searchKey) {
            for (var i = groups.length; i; i--) {
                var current = _.filter(groups[i - 1].Contacts, function (item) {
                    return item['UserNumber'].indexOf(searchKey) != -1
                        || item['UserName'].indexOf(searchKey) != -1
                        || item['Email'].indexOf(searchKey) != -1;
                });
                if (current && current.length !== 0) res = _.union(res, current);
            }
        }

        if (res.length !== 0) {
            $(this.GetView().el).find('#groupItem').hide();
            $(this.GetView().el).find('#addrSerachFloat').show();
            this.GetSearchModel().SearchResult = res;
            this.GetSearchView().render();
        } else if (searchKey) {
            $(this.GetView().el).find('#groupItem').hide();
            $(this.GetView().el).find('#addrSerachFloat').show();
            $(this.GetView().el).find('#addrSerachFloat').html('<div>无数据</div>');
        } else {
            $(this.GetView().el).find('#addrSerachFloat').hide();
            $(this.GetView().el).find('#groupItem').show();
        }
    };
    //添加单个的联系人：
    addrFloatController.prototype.AddSingalContactAction = function (userId) {
        var self = this;
        if (!userId) return;
        var groups = self.GetModel().Groups;
        for (var i = groups.length; i; i--) {
            var current = _.find(groups[i - 1].Contacts, function (item) {
                return self.GetContactItemIdPrefix() + item['UserId'] === userId;
            });
            if (current) {
                var findResult = _.find(self.GetSelectedModel().Selected,
                    function (item) {
                        return item['UserId'] === current['UserId'];
                    });
                if (findResult) {
                    this.Invoke('ReduceSelectContact', { rname: findResult.UserName });
                    break;
                }
                self.GetSelectedModel().Selected.push(current);
                this.Invoke('SelectContact');
                break;
            }
        }
        self.GetSelectedView().render();
    };
    //移除单个的联系人：
    addrFloatController.prototype.RemoveSingalContactAction = function (userId) {
        var self = this;
        if (!userId) return;
        self.GetSelectedModel().Selected = _.reject(self.GetSelectedModel().Selected,
            function (item) {
                return self.GetContactItemIdPrefix() + item.UserId === userId;
            });
        self.GetSelectedView().render();
    };
    //添加一个组的联系人：
    addrFloatController.prototype.AddGroupContactAction = function (groupId) {
        var self = this;
        if (!groupId) return;
        var groups = self.GetModel().Groups;
        var currentGroup = _.find(groups, function (item) {
            return self.GetContactGroupIdPrefix() + item.GroupId === groupId;
        });
        var reduceName = [];
        _.each(currentGroup.Contacts, function (item) {
            var findResult = _.find(self.GetSelectedModel().Selected,
                function (sitem) {
                    return sitem['UserId'] === item['UserId'];
                });
            if (!findResult) {
                self.GetSelectedModel().Selected.push(item);
            } else {
                reduceName.push(findResult['UserName']);
            }
        });
        if (reduceName.length !== 0) {
            self.Invoke('ReduceSelectContact', { rname: reduceName.join(',') });
        }
        self.Invoke('SelectGroupContact');
        self.GetSelectedView().render();
    };
    //------------------------------------------------------------------------------------------
    //公共函数
    addrFloatController.prototype.Dispose = function () {
        //        this.SetModel(null);
        //        this.SetSearchModel(null);
        //        this.SetSelectedModel(null);

        //        this.SetView(null);
        //        this.SetSearchView(null);
        //        this.SetSelectedView(null);
        //        delete(this);
    };

    addrFloatController.prototype.GetSelectedData = function () {
        return this.GetSelectedModel().Selected;
    };
    addrFloatController.prototype.UseShotcutModel = function (args) {
        this.SetSimpleModel(args);
    };
    addrFloatController.prototype.GetAllAddrData = function () {
        //测试数据
        return {
            'code': 'S_OK',
            'var': {
                Msg: '操作成功',
                Groups: [
                    {
                        GroupName: '亲人',
                        GroupId: '10001',
                        Contacts: [
                            { UserId: '100', UserNumber: '18664155985', UserName: '张亮', Email: 'zhanlgang2198@gmail.com' },
                            { UserId: '101', UserNumber: '13621524515', UserName: '白小刚', Email: '13621524515@rd139.com' },
                            { UserId: '102', UserNumber: '13902284255', UserName: '白雪天', Email: 'baixt@richinfo.cn' },
                            { UserId: '103', UserNumber: '13825710575', UserName: '毕焌忠', Email: 'bijunzhong@richinfo.cn' },
                            { UserId: '104', UserNumber: '13911826678', UserName: '蔡浩', Email: 'caih@richinfo.cn' },
                            { UserId: '105', UserNumber: '13713373749', UserName: '蔡琳', Email: 'cail@richinfo.cn' }
                        ]
                    },
                    {
                        GroupName: '朋友',
                        GroupId: 10002,
                        Contacts: [
                            { UserId: '106', UserNumber: '15920101177', UserName: '蔡强声', Email: 'caiqs@richinfo.cn' },
                            { UserId: '107', UserNumber: '13828457979', UserName: '蔡章毅', Email: 'caizy@richinfo.cn' },
                            { UserId: '108', UserNumber: '13826586465', UserName: '蔡治国', Email: 'caizg@richinfo.cn' },
                            { UserId: '109', UserNumber: '13925026695', UserName: '曹铉', Email: 'caox@richinfo.cn' },
                            { UserId: '110', UserNumber: '13926495372', UserName: '岑妙连', Email: 'cenml@richinfo.cn' },
                            { UserId: '111', UserNumber: '13822259615', UserName: '岑彦邦', Email: 'cenyb@richinfo.cn'}]
                    },
                    {
                        GroupName: '同学',
                        GroupId: 10003,
                        Contacts: [
                            { UserId: '112', UserNumber: '13430878413', UserName: '陈海霞', Email: 'chenhx@richinfo.cn' },
                            { UserId: '113', UserNumber: '13580401502', UserName: '陈丽娟', Email: 'chenlj@richinfo.cn' },
                            { UserId: '114', UserNumber: '15902012833', UserName: '邓金盛', Email: 'dengjs@richinfo.cn' },
                            { UserId: '115', UserNumber: '13632864540', UserName: '范甲博', Email: 'fanjb@richinfo.cn' },
                            { UserId: '116', UserNumber: '13769197324', UserName: '关喜', Email: 'guanx@richinfo.cn'}]
                    }]
            }
        };
    };
    //------------------------------------------------------------------------------------------
    //基类方法 用于事件处理 自行处理delegate 中的this指针
    addrFloatController.prototype.Invoke = function (eventName, args) {
        var self = this;
        var listeners = this.GetEventListener(eventName);
        if (!listeners || listeners.length == 0) return;
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](self, args);
        }
    };
    addrFloatController.prototype.RegistListener = function (eventName, delegate) {
        this.AddListener(eventName, delegate);
    };
    addrFloatController.prototype.GetContactById = function () {
    };

    //添加到命名空间中
    M139.namespace("M139.Dom.AddrFloatController", new addrFloatController());
})();
