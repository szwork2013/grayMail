
(function ($, _, M) {

var superClass = M.View.ViewBase;
var _class = "M2012.Addr.View.Import.Pim";

M.namespace(_class, M.View.ViewBase.extend({

    name: _class,

    el: "body",
    batchnumber: "",
    batchId: 0,
    sourceType: 0,
    importType: 0,
    type: {
        UN_REGISTER:"unRegister",
        ADDR_IS_EMPTY:"addrIsEmpty",
        DEFAULT_TIP:"defaultTip"
    },
    caiyunUrl:{
        baseUrl:"http://pim.10086.cn/login.php",
        page:{
            channel:"139mail",
            sso: ""
        }
    },
    template: {
        unRegister: ['<div class="imgInfo pim_info">',
                    '<img class="imgLink" src="../../images/module/addr/he.png" widt="59" height="59" />',
                    '<dl>',
                        '<dt>您还未开通"和通讯录"</dt>',
                        '<dd class="gray">开通后，一键上传手机电话簿，手机联系人迅速变成收件人！</dd>',
                        '<dd><a href="javascript:void(0)" id="goto_pim">去和通讯录看看&gt;&gt;</a></dd>',
                    '</dl>',
                '</div>'].join(''),
        addrIsEmpty: ['<div class="imgInfo pim_info">',
                    '<img class="imgLink" src="../../images/module/addr/he.png" widt="59" height="59" />',
                    '<dl>',
                        '<dt>您的"和通讯录"空空如也</dt>',
                        '<dd class="gray">使用"和通讯录"一键上传手机电话簿，手机联系人迅速变成收件人！</dd>',
                        '<dd><a href="javascript:void(0)" id="goto_pim">去和通讯录看看&gt;&gt;</a></dd>',
                    '</dl>',
                '</div>'].join(''),
        defaultTip: ['<div class="imgInfo pim_info">',
                    '<img class="imgLink" src="../../images/module/addr/he.png" widt="59" height="59" />',
                    '<dl>',
                        '<dt class="mt_10">您的"和通讯录"有 <span class="red" id="import_people_count">0</span> 个联系人数据</dt>',
                        '<dd class="gray">上次导入：<span id="last_import_date">(未导入过)</span></dd>',
                        '<dd class="mt_20 pt_15">',
                            '<p class="pt_5 pb_5">如遇姓名相同，且邮箱或手机号相同的，则</p>',
                           '<div><input type="radio" id="import_type_1" name="import_type" class="mr_5" value="1" /><label for="import_type_1">跳过</label><span class="gray">（保留邮箱联系人资料）</span></div>',
                           '<div><input type="radio" id="import_type_2" name="import_type" checked="checked"  value="0" class="mr_5" /><label for="import_type_2">合并</label><span class="gray">（以"和通讯录"资料为标准补全）</span></div>',
                           '<div class="pt_20"><a href="javascript:void(0)" id="btn_import" class="btnG mr_10"><span>导入和通讯录</span></a></div>',
                        '</dd>',
                    '</dl>',
                '</div>'].join(''),
        htmLoading: ['<div class="ta_c pt_20 pb_20">',
                        '<img src="../../images/global/load.gif" width="16" height="16" /> 正在导入...',
                        '<p class="gray pt_10">若联系人较多可能需要花费30-60秒时间，请您耐心等待...</p>',
                    '</div>'].join(''),
        pageLoading: ['<div class="ta_c pt_20 pb_20">',
                        '<img src="../../images/global/load.gif" width="16" height="16" /> 加载中,请稍后...',                        
                    '</div>'].join(''),
        pageFail: ['<div class="ta_c pt_20 pb_20">',
                    '<i class="i_fail_min mr_5"></i>加载失败',
                    '[<a id="retryPage" href="javascript:void(0);">重试</a>]',
                '</div>'].join(''),
        htmlFail: ['<div class="ta_c pt_20 pb_20">',
                    '<i class="i_fail_min mr_5"></i>{0}',
                '</div>'].join('')
    },
    defaultTip: [],
    logger: new M139.Logger({ name: _class }),

    initialize: function() {
        this.model = new M2012.Addr.Model.Import.Pim(); 
        this.initEvents();       
        this.render();
        return superClass.prototype.initialize.apply(this, arguments);
    },

    initEvents: function(){
        var _this = this;

        $('#goBack').click(function(){
            _this.back();
        });
    },

    render: function() {       

        this.ui = {};
        this.ui.body = $('body');        
        this.ui.container = $('#import_container');
        
        this.pageMsg = ADDR_I18N[ADDR_I18N.LocalName].clone;
        this.defaultTip.push(this.pageMsg['iptIFailMes']);
        this.defaultTip.push(this.pageMsg['iptIFailRetry']);        
        this.getImportStatus();           
    },
    getImportStatus: function(){
        var _this, options;

        _this = this; 
        options = {};

        this.showPageLoading();

        options.success = function(result){
            _this.show(result);
        };

        options.error = function(result){
            //调用接口错误时触发
            _this.showLoadFail();
            //_this.show(); //显示默认：保持导入按钮，无最近时间，可导入，不显示“和通讯录”数量
            _this.logger.error("抓取'和通讯录'初始化数据失败", result);
        };

        this.model.getImportStatus(options);             
    },
    show: function(options){
        var _this, status, type, templates;

        _this = this;
        status = _this.getStatus(options);
        type=_this.type;
        templates = _this.template;

        switch (status.showType) {
            case type.UN_REGISTER:
                _this.showGoTo({
                    template: templates[status.showType],
                    isSso: false
                });
                break;
            case type.ADDR_IS_EMPTY:
                _this.showGoTo({
                    template: templates[status.showType],
                    isSso:true
                });
                break;
            case type.DEFAULT_TIP:
                _this.showImportCY({
                    showCount: status.showCount,
                    lastupdate: status.lastupdate
                });
                break;
            default:
                _this.showImportCY();
                break;
        }
    },    
    getStatus: function(options){
        var _this, type, status, key, allRegStatus, regStatus, isRegistered, count;

        _this = this;
        type = _this.type;
        status = {
            showType: type.DEFAULT_TIP,
            showCount: 0,
            lastupdate: ""
        };

        //接口返回KEY，未知如何，先做映射,方便统一修改
        key = {
            registered: "Registered",
            count: "Count",
            update: "Update",
            lastupdate: "LastUpdate"
        };

        if (options) {
            allRegStatus = { //状态列表
                "yes": true, //已开通
                "no": false, //未注册
                "noEnable": false //统一认证后,未激活“和通讯录”
            };

            regStatus = options[key.registered];
            isRegistered = allRegStatus[regStatus];

            if (isRegistered) {

                count = parseInt(options[key.count]);
                status.lastupdate = options[key.lastupdate];

                if (count > 0) {
                    status.showCount = count;
                } else {
                    //已开通，通讯录数量为0，通过SSO跳转到“和通讯录”首页
                    status.showType = type.ADDR_IS_EMPTY;
                }
            } else {
                status.showType = type.UN_REGISTER;
            }
        }

        return status;
    },
    showGoTo: function(options){
        var _this, template, isSso;

        if (options) { 
            _this = this;
            template = options.template;
            isSso = options.isSso;

            //this.ui.container.find('.pim_info').css({display: 'none'});
            this.ui.container.html(template).find("#goto_pim").click(function () {
                top.BH({ actionId: 104449 });
                _this.redirectTo(options);
            });
        }
    },
    showImportCY: function(options){
        var _this, ui;

        _this = this;
        ui = this.ui;

        ui.container.html(this.template[this.type.DEFAULT_TIP]);
        ui.btnImport = $('#btn_import');
        ui.importDate = $('#last_import_date');        
        ui.importPeopleCount = $('#import_people_count');
        ui.importType = this.ui.container.find('input[name="import_type"]');

        if (options && options.lastupdate) {
            //最后导入的时间显示
            ui.importDate.text(options.lastupdate);
        }

        if(options && options.showCount){
            ui.importPeopleCount.text(options.showCount)
        }

        ui.btnImport.unbind('click');
        ui.btnImport.click(function(){
            _this.importType = ui.importType.filter(':checked').val();
            _this.importData();
            top.BH('addr_importPim_pim');
        });

        ui.importType.click(function(){
            if($(this).val() == "0"){
                top.BH('addr_importPim_merge');
            }else{
                top.BH('addr_importPim_ignore');
            }
        });
    },
    importData: function(){
        var _this, ui, options, data, errInfo, num;

        _this = this;
        ui = this.ui;

        options = {
            'sourceType': this.sourceType,
            'importType': this.importType
        };

        options.success = function(result){
            if(result && result.code == 0 || result.code == 1){
                _this.batchnumber = result.summary;
                _this.batchId = result.batch; //新增，导入单号
                num = Math.floor(Math.random() * 3000) + 2000; //2-5秒随机

                //使用setTimeout是为了做到第一个请求回来后，才延时下一个请求，而且每次请求的间隔都是随机的
                _this.intervalID = window.setTimeout(function(){
                    _this.getSyncStatus();
                }, num);

            }else{
                errInfo = _this.GetIptErrInfo(result.code, _this.pageMsg['iptSend']);
                
                if (errInfo){                    
                    ui.container.html(_this.template.htmlFail.format(errInfo + _this.pageMsg['iptIFailRetry']));
                    _this.registerFail();
                    return;
                }

                ui.container.html(_this.template.htmlFail.format(_this.defaultTip.join('')));
                _this.registerFail();

                _this.logger.error("'和通讯录'导入失败", result);
            }           
        };

        options.error = function(data){
            ui.container.html(_this.template.htmlFail.format(_this.defaultTip.join('')));
            _this.registerFail();
            _this.logger.error("'和通讯录'导入失败", data);
        };
        
        ui.container.html(this.template.htmLoading);
        this.model.fetch(options);           
    },
    redirectTo: function(){
        var url, api, params;

        api = this.caiyunUrl.baseUrl;
        params = this.caiyunUrl.page; 
        url = top.$Url.makeUrl(api, params);         
        window.open(url);
    },
    registerFail: function(){
        var _this = this;

        $('#retryI').click(function(){
            _this.importData();
            top.BH('addr_importPim_retry');
        });
    },
    showPageLoading: function(){        
        this.ui.container.html(this.template.pageLoading);
    },
    showLoadFail: function(){
        var _this = this;

        this.ui.container.html(this.template.pageFail);
        this.ui.container.find('#retryPage').click(function(){
            _this.getImportStatus();
        });
    },
    GetIptErrInfo: function(resCode, mes){
        var arr, errInfo, i, j, errHead, codes, tmpCode;

        if (!resCode || !mes) {
            return "";
        }

        errInfo = "";
        arr = mes.split("|");       

        for (i = 0; i < arr.length; i++) {
            errHead = arr[i].split(":")[0]; //多code
            codes = errHead.split(",");

            for (j = 0, m = codes.length; j < m; j++) {
                tmpCode = codes[j];
                if (tmpCode == resCode) {
                    errInfo = arr[i].split(":")[1];
                    try {
                        this.logger.error(top.uid + "|addr|inputweibo|ec=" + resCode + "|", errInfo);                        
                    } catch (ex) { }

                    return errInfo;
                }
            }
        }

        return errInfo;
    },
    getSyncStatus: function(){
        var _this, options, ui, config, url, num, errInfo, template, api, params;

        url = [];
        _this = this;
        ui = this.ui;
        template = _this.template;

        options = {            
            batchid: this.batchId
        };

        options.success = function(){                                   
            top.BH('addr_import_pim');
            config = top.SiteConfig;
            if (config && config['showImportResult'] == true) {
               
                api = 'http://' + top.location.host + '/m2012/html/addr/addr_importresult.html';
                params = {
                    sid: top.$App.getSid(),
                    bid: _this.batchId,
                    from: 'importPim'
                };
                url = top.$Url.makeUrl(api, params);                
                if(top.$Addr){
                    var master = top.$Addr;
                    setTimeout(function(){
                        master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getImportData'});
                        window.location.href = url;
                    }, 1000);					
                }else{
                    window.location.href = url;    
                }                
            }
        }

        options.error = function(result){
            if(result.ResultCode == "0"){                
                 errInfo = _this.GetIptErrInfo(result.LoadStatus, _this.pageMsg['iptIStatusR']); 
                 /*_this.pageMsg['iptIStatusR'] = "001,005,999,220,221,222,224,225,226,227,228,229,230,231,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265:系统繁忙，请稍后再试" */               
                if (errInfo) {                    
                    ui.container.html(template.htmlFail.format(errInfo + _this.pageMsg['iptIFailRetry']));
                    _this.registerFail();
                    return;
                }

                errInfo = _this.GetIptErrInfo(result.LoadStatus, _this.pageMsg['iptIStatus']);
                /*_this.pageMsg['iptIStatus'] = "003:联系人数量已达上限，无法导入|004:导入已完成，其中部分联系人因资料不完善未能导入。|223:操作频繁，请稍后重试|232:你还不是移动微博用户，免费激活玩微博>>|233:你的移动微博账户已冻结，无法导入和通讯录，详询10086。|234:你的移动微博账户已注销，无法导入和通讯录，详询10086。"*/
                if (errInfo) {
                    ui.container.html(template.htmlFail.format(errInfo));                   
                    return;
                }

                ui.container.html(template.htmlFail.format(_this.defaultTip.join('')));                
                _this.registerFail();
            }else{
                errInfo = _this.GetIptErrInfo(999, _this.pageMsg['iptIStatus']);
                /*_this.pageMsg['iptIStatus'] = "003:联系人数量已达上限，无法导入|004:导入已完成，其中部分联系人因资料不完善未能导入。|223:操作频繁，请稍后重试|232:你还不是移动微博用户，免费激活玩微博>>|233:你的移动微博账户已冻结，无法导入和通讯录，详询10086。|234:你的移动微博账户已注销，无法导入和通讯录，详询10086。"*/
                if(errInfo){
                    ui.container.html(template.htmlFail.format(errInfo));
                }else{
                    ui.container.html(template.htmlFail.format(_this.defaultTip.join('')));  
                }

                _this.registerFail();
            }

            _this.logger.error("'和通讯录'导入状态查询失败", result);
        }

        this.model.querySyncStatus(options);
    },
    back: function() {
        //返回
        setTimeout(function() {
            if(top.$Addr){                
				var master = top.$Addr;
				master.trigger(master.EVENTS.LOAD_MAIN);
			}else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);
        return false;
    }

}));

$(function(){ new M2012.Addr.View.Import.Pim() });

})(jQuery, _, M139);
