;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Maybeknown";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            list: [], //存放数据的容器
            pageIndex: 0, //当前页数, 后台需要
            pageSize: 0, //每页请求个数, 后台需要
            pageCount: 1, //总页数            
            currentIndex: 0 //当前加载的联系人

        },       
        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);
        },
        getWhoAddMePageData: function(options) {
            top.M2012.Contacts.API.getWhoAddMePageData(options.info, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        }
    }));

})(jQuery, _, M139);

;(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Maybeknown";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",
        
        TIP: {},
        
        ELEMENT: {
            WIDTH: 270,
            HEIGHT: 100
        },

        //后台限制每页最多6条记录, 所以前端要处理否则大屏显示器不会出现滚动条
        MAX_COUNT: 60,

        MIN_COUNT: 12,

        SELECTOR: 'Maybeknown-{0}',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {            
            this.model = options.model;
            this.master = options.master;
            this.isLoading = true;

            this.initUI();
            this.initEvents();
            this.render();
            superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function() {

            this.ui = {};
            this.ui.head = $('#head');
            this.ui.wrap = $('#main-warp');
            this.ui.btnBack = $('#btn-back');
            this.ui.item = $('#temp-item');
            this.ui.load = $('#loading');
        },
        initEvents: function () {
            var _this = this;

            this.model.on('change:pageIndex', function(){
                var pageIndex = this.get('pageIndex');
                _this.getData(pageIndex);
            });

            this.model.on('change:list', function(){
                var list = this.get('list');
                _this.append(list);
            });

            this.master.on(this.master.EVENTS.LOAD_WHO_ADD_ME, function(info) {
                var selector = '.' + _this.SELECTOR.format(info.UserNumber);
                var item = _this.ui.wrap.find(selector);
                

                var callback = function() {
                    item.remove();
                    var list = _this.ui.wrap.find('.box-item');
                    
                    if(list.length <= 0){
                        _this.back();                        
                    }else{
                        _this.scroll();
                    }
                };

                if(item){
                    item.fadeOut(callback);
                }
            });

            this.ui.wrap.delegate('.btn-add', 'click', function(){
                _this.setDialog($(this));
                top.BH('addr_whoAddMe_add');
            });

            this.ui.wrap.delegate('.btn-photo', 'click', function(){
                _this.setDialog($(this));
                top.BH('addr_whoAddMe_photo');
            });
           
            this.ui.btnBack.click(function() {
                _this.back();
            });

            $(window).resize(function () {
                var marginTop = 50;
                var headHeight = _this.ui.head.height();
                var winHeight = $(window).height() - headHeight - marginTop;
                
                _this.ui.wrap.css({ height: winHeight });
                _this.scroll();
            });

            this.ui.wrap.scroll(function(){
                _this.scroll();
            });

            $(window).resize();
        },
        render: function () {
            //每页显示多少个需要根据屏幕的大小进行设置,
            //第一页必须出现滚动条, 才会触发滚动事件
            var width = $(window).width();
            var height = $(window).height();
            var cloumn = Math.floor(width / this.ELEMENT.WIDTH);
            var rows = Math.ceil(height / this.ELEMENT.HEIGHT);            
            var pageSize = rows * cloumn;
                pageSize = pageSize < this.MIN_COUNT ? this.MIN_COUNT : pageSize;
                pageSize = pageSize > this.MAX_COUNT ? this.MAX_COUNT : pageSize;
                        
            this.model.set({pageSize: pageSize});
            this.model.set({pageIndex: 1});           
        },
        setDialog: function(dom){
            var _this = this;
            var index = dom.data('index') || 0;
            var list = this.model.get('list');

            var dialog = new M2012.Addr.View.MaybeknownDialog({data: list[index]});
                dialog.onSuccess = function(info) {
                    _this.master.trigger(_this.master.EVENTS.LOAD_WHO_ADD_ME, info);                    
                };
        },
        getData: function(pageIndex){
            var _this = this;
            var options = {
                info: {
                    relation: 0,
                    pageIndex: pageIndex,
                    pageSize: this.model.get('pageSize')
                }
            };

            options.success = function(result) {
                var list = _this.model.get('list');                
                var pageSize = _this.model.get('pageSize');
                var pageCount = Math.ceil(result.total / pageSize);
                
                for(var i = 0; i < result.list.length; i++){
                    var item = result.list[i];
                    item.url = _this.setContactImage(item.ImageUrl);
                    item.showName = _this.setNameStar(item.Name);
                    item.showName = top.$TextUtils.htmlEncode(item.showName);
                    item.selector = _this.SELECTOR.format(item.UserNumber);

                    list.push(item);
                }

                _this.model.set({pageCount: pageCount});
                _this.model.set({list: list}, {silent: true});
                _this.model.trigger('change:list');
            };

            options.error = function() {

            };

            this.model.getWhoAddMePageData(options);
        },
        scroll: function(){

            if(this.isLoading){
                return;
            }

            var pageIndex = this.model.get('pageIndex');
            var pageCount = this.model.get('pageCount');
            var box = this.ui.wrap.find('.box-item').eq(-1);
            var documentH = $(document).scrollTop() + $(window).height();
            var lastPinHeight = box.offset().top + Math.floor(box.height() / 2) + box.height();
            
            if(documentH > lastPinHeight && pageIndex <= pageCount){
                this.showLoad();
                this.model.set({pageIndex: pageIndex + 1});
            }
        },
        append: function(list) {
            var pageIndex = this.model.get('pageIndex');
            var pageSize = this.model.get('pageSize');
            var showSize = this.model.get('showSize'); 
            var statr = (pageIndex - 1) * pageSize;
            var end = pageIndex * pageSize;
            var data = list.slice(statr, end);
            
            for(var i = 0; i < data.length; i++){
                data[i].index = statr + i;
                var html = this.ui.item.html();
                var template = $(_.template(html, data[i]));

                this.ui.wrap.append(template);
                template.fadeIn();
            }
            
            this.hideLoad();
            this.scroll();
        },
        setContactImage: function(imgurl){
            var sysImgPath = ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"];

            if(imgurl && imgurl.toLowerCase() != sysImgPath[0] && imgurl.toLowerCase() != sysImgPath[1]){
                imgurl = imgurl.replace('upload', 'Upload');
                imgurl = imgurl.replace('photo', 'Photo');
                return (new top.M2012.Contacts.ContactsInfo({ImageUrl: imgurl})).ImageUrl;
            }else{
                return top.$App.getResourcePath() + "/images/face.png";
            }
        },
        setNameStar: function(name){
            var showName = name;
            if (name.length == 11 && /^\d+$/.test(name)){
                showName = name.replace(/(?:^86)?(\d{3})\d{4}/,"$1****");
            }
            return showName;
        },
        showLoad: function() {
            this.ui.load.show();
            this.isLoading = true;
        },
        hideLoad: function() {
            this.ui.load.hide();
            this.isLoading = false;            
        },
        back: function() {
            this.master.trigger(this.master.EVENTS.LOAD_MAIN);
        }
    }));
    
    $(function(){
        //var kit = new M2012.Addr.View.Kit();
        var model = new M2012.Addr.Model.Maybeknown();
        var view = new M2012.Addr.View.Maybeknown({model: model, master: top.$Addr, kit: null});

        top.BH('addr_whoAddMe_load');
    });

})(jQuery, _, M139);
