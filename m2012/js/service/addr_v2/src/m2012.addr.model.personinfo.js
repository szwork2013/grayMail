;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.PersonInfo";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            state: '', //当前页面状态,
            isShowMore: false, //控制非基础字段显示
            contacts: {}, //联系人信息, 格式化后的数据体
            ImageUrl: '', //头像
            ImagePath: '',//头像显示路径
            AddrFirstName : "", //用户姓名
            AddrNickName : "", //用户昵称
            UserSex : 0, //用户性别
            BirDay : "", //出生日期(YYYY-MM-DD)
            StartCode : '', //星座
            BloodCode : "", //血型
            Marriage : 0, //婚姻状况 0是不填，未婚为2
            StreetCode : '', //居住地

            FamilyEmail : '', //邮箱
            HomeAddress : '', //通讯地址
            ZipCode : '', //邮编
            MobilePhone : '', //手机
            FamilyPhone : '', //电话
            //  GetPrivacySettings:'',//飞信号码 GetPrivacySettings接口
            OtherIm : '', //飞信号
            OICQ : '', //QQ
            MSN : '', //MSN
            PersonalWeb : '', //个人主页

            CPName : '', //公司名称
            UserJob : '', //职务
            BusinessEmail : '', //商务邮箱
            BusinessMobile : '', //商务手机
            BusinessPhone : '', //公司固话
            CPAddress : '', //公司地址
            CPZipCode : '', //公司邮编
            CompanyWeb : '', //公司主页

            Character : '', //我的性格
            FavoPeople : '', //欣赏的人
            MakeFriend : '', //我想结交
            Brief : '', //我的简介
            FavoBook : '', //喜欢的书
            FavoMusic : '', //喜欢的音乐
            FavoMovie : '', //喜欢的电影
            FavoTv : '', //喜欢的电视
            FavoSport : '', //喜欢的运动
            FavoGame : '' //喜欢的游戏
        },
        TIPS: {
            DATE_GT_CURRENT: '生日不能大于当前日期',
            MOBILE_ERROR: '手机号码格式不正确，请输入3-20位数字',
            EMAIL_ERROR: '电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            MAX_TIP: '保存失败，联系人数量已达上限',
            PHONE_ERROR: '常用固话格式不正确，请输入3-30位数字、-',
            FEIXIN_ERROR: '飞信号格式不正确，请输入6-9位数字',
            BUSSINESS_EMAIL_ERROR: '商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            BUSSINESS_MOBLIE_ERROR: '商务手机格式不正确，请输入3-20位数字',
            CP_PHONE_ERROR: '公司固话格式不正确，请输入3-30位数字、-',
            FAX_ERROR: '传真号码话格式不正确，请输入3-30位数字、-',
            ZIPCODE_ERROR: '邮编格式不正确，请输入3-10位字母、数字、-或空格',
            CP_ZIPCODE_ERROR: '公司邮编格式不正确，请输入3-10位字母、数字、-或空格',
            QQ_ERROR: 'QQ格式不正确，请输入5-11位数字',
            PHOTO_FAIL: '头像上传失败，请上传gif、jpg、jpeg、bmp、png格式的图片',
            PHOTO_MAX: '头像上传失败，请上传大小在10MB以内的图片',
            SAVE_SUCCESS: '保存成功'            
        },
        SEX: {
           MALE: '男',
           WOMAN: '女',
           PRIVARY: '保密'
        },
        MARRIAGE: {
            EMPTY: '',
            MARRIED: '已婚',
            DISCOVERTURE: '未婚'
        },
        isMobile: /^[\d]{3,20}$/,
        isPhone: /^[\d-]{3,30}$/,
        isZipCode:  /^[a-zA-Z0-9-\s]{3,10}$/,
        isFeixin:  /^[\d]{6,9}$/,
        isQQ:  /^[\d]{5,11}$/,
        isEmail:  /^[0-9a-zA-Z_][_.0-9a-zA-Z-]{0,31}@([0-9a-zA-Z][0-9a-zA-Z-]{0,30}\.){1,4}[a-zA-Z]{2,4}$/,
        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);
        },
        validate: function(attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate) {
                return;
            }

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                
                var value = {};
                value[target] = message;
                return value;
            }           
            
            key = 'FamilyEmail';
            if (_.has(data, key)) {
                if (data.FamilyEmail.length > 0 && !self.isEmail.test(data.FamilyEmail)) {
                    return getResult(key, self.TIPS.EMAIL_ERROR);
                }
            }

            key = 'BusinessEmail';
            if (_.has(data, key)) {
                if (data.BusinessEmail.length > 0 && !self.isEmail.test(data.BusinessEmail)) {
                    return getResult(key, self.TIPS.BUSSINESS_EMAIL_ERROR);
                }
            }

            key = 'MobilePhone';
            if (_.has(data, key)) {
                if (data.MobilePhone.length > 0 && !self.isMobile.test(data.MobilePhone)) {
                    return getResult(key, self.TIPS.MOBILE_ERROR);
                }
            }

            key = 'BusinessMobile';
            if (_.has(data, key)) {
                if (data.BusinessMobile.length > 0 && !self.isMobile.test(data.BusinessMobile)) {
                    return getResult(key, self.TIPS.BUSSINESS_MOBLIE_ERROR);
                }
            }

            key = 'BirDay';
            if (_.has(data, key)) {
                if (data.BirDay.length > 0 && top.M139.Date.getDaysPass(M139.Date.getServerTime(), new Date(data.BirDay)) > 0) {
                    return getResult(key, self.TIPS.DATE_GT_CURRENT);
                }
            }

            key = 'FamilyPhone';
            if (_.has(data, key)) {
                if (data.FamilyPhone.length > 0 && !self.isPhone.test(data.FamilyPhone)) {
                    return getResult(key, self.TIPS.PHONE_ERROR);
                }
            }

            key = 'BusinessPhone';
            if (_.has(data, key)) {
                if (data.BusinessPhone.length > 0 && !self.isPhone.test(data.BusinessPhone)) {
                    return getResult(key, self.TIPS.CP_PHONE_ERROR);
                }
            }

            key = 'BusinessFax';
            if (_.has(data, key)) {
                if (data.BusinessFax.length > 0 && !self.isPhone.test(data.BusinessFax)) {
                    return getResult(key, self.TIPS.FAX_ERROR);
                }
            }            

            key = 'ZipCode';
            if (_.has(data, key)) {
                if (data.ZipCode.length > 0 && !self.isZipCode.test(data.ZipCode)) {
                    return getResult(key, self.TIPS.ZIPCODE_ERROR);
                }
            }

            key = 'CPZipCode';
            if (_.has(data, key)) {
                if (data.CPZipCode.length > 0 && !self.isZipCode.test(data.CPZipCode)) {
                    return getResult(key, self.TIPS.CP_ZIPCODE_ERROR);
                }
            }


            key = 'OtherIm';
            if (_.has(data, key)) {
                if (data.OtherIm.length > 0 && !self.isFeixin.test(data.OtherIm)) {
                    return getResult(key, self.TIPS.FEIXIN_ERROR);
                }
            }

            key = 'OICQ';
            if (_.has(data, key)) {
                if (data.OICQ.length > 0 && !self.isQQ.test(data.OICQ)) {
                    return getResult(key, self.TIPS.QQ_ERROR);
                }
            }
        },
        modifyUserInfo : function (options) {
            var This = this;
            top.M2012.Contacts.getModel().modifyUserInfo(options.data, function (result) {
                if(result.ResultCode == "0"){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        getDataSource : function (options) {
            top.M2012.Contacts.getModel().getUserInfo({refresh: true}, function (result) {
                var userInfo = {};
                if (result.code === 'S_OK') {
                    userInfo = result['var'];
                    options.success(userInfo);
                } else {
                    options.error(result);
                    top.console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:" + result.code);
                }
            });

        },
        getContacts: function(callback){
            var _this = this;
            var options = {};
            var contacts = {
                firstInfo: {
                    ImageUrl: '',
                    ImagePath: '',
                    AddrFirstName: ''
                },
                baseInfo: {
                    FamilyEmail: {key: '电子邮箱', value: ''},
                    BusinessEmail: {key: '商务邮箱', value: ''},
                    MobilePhone: {key: '手机号码', value: ''},
                    BusinessMobile: {key: '商务手机', value: ''}, 
                    BirDay: {key: '生日', value:''}                    
                },
                otherInfo: {
                    AddrNickName: {key: '昵称', value: ''},
                    SexText: {key: '性别', value:''},
                    FamilyPhone: {key: '常用固话', value: ''} ,
                    BusinessPhone: {key: '公司固话', value: ''},
                    BusinessFax: {key: '传真号码', value: ''},
                    HomeAddress: {key: '家庭地址', value: ''},
                    CPAddress: {key: '公司地址', value: ''},
                    CPName: {key: '公司名称', value: ''},
                    UserJob: {key: '职务', value: ''},
                    ZipCode: {key: '家庭邮编', value: ''},
                    CPZipCode: {key: '公司邮编', value: ''},
                    OtherIm: {key: '飞信号', value: ''},
                    OICQ : {key: 'QQ', value: ''},
                    MSN : {key: 'MSN', value: ''},
                    PersonalWeb : {key: '个人主页', value: ''},
                    CompanyWeb : {key: '公司主页', value: ''},
                    StartCode : {key: '星座', value: ''}, 
                    BloodCode : {key: '血型', value: ''}, 
                    MarriageText : {key: '婚姻状况', value: ''},
                    StreetCode : {key: '居住地', value: ''},
                    Character : {key: '我的性格', value: ''},
                    FavoPeople : {key: '欣赏的人', value: ''},
                    MakeFriend : {key: '我想结交', value: ''},
                    Brief : {key: '我的简介', value: ''},
                    FavoBook : {key: '喜欢的书', value: ''},
                    FavoMusic : {key: '喜欢的音乐', value: ''},
                    FavoMovie : {key: '喜欢的电影', value: ''},
                    FavoTv : {key: '喜欢的电视', value: ''},
                    FavoSport : {key: '喜欢的运动', value: ''},
                    FavoGame : {key: '喜欢的游戏', value: ''}
                },
                moreInfo: {
                   UserSex: {key: '性别', value: ''},
                   Marriage: {key: '婚姻状况', value: ''}
                }
            };

            options.success = function(e){
                var data = _this.format(e);

                var firstInfo = contacts.firstInfo;
                var baseInfo = contacts.baseInfo;
                var moreInfo = contacts.moreInfo;
                var otherInfo = contacts.otherInfo;

                for(var key in otherInfo){
                    if(data[key] && data[key].length){
                       otherInfo[key].value =  data[key];
                    }                    
                }

                for(var key in moreInfo){
                    if(data[key] && data[key].length){
                       moreInfo[key].value =  data[key];
                    } 
                }

                for(var key in baseInfo){
                    if(data[key] && data[key].length){
                       baseInfo[key].value =  data[key];
                    } 
                }

                for(var key in firstInfo){
                    if(data[key] && data[key].length){
                       firstInfo[key] =  data[key];
                    } 
                }

                contacts.firstInfo = firstInfo;
                contacts.baseInfo = baseInfo;
                contacts.moreInfo = moreInfo;
                contacts.otherInfo = otherInfo;
                _this.set({contacts: contacts});
                _this.set(_this.getInfo(), {silent: true});

                if(callback){
                    callback(contacts);
                }
            };

            options.error = function(result) {
                switch(result.ResultCode){
                    case '214':
                    case '215':
                    case '216':
                    case '217':
                    case '218':{
                        top.$App.showSessionOutDialog();
                        break;
                    }
                    default: {
                        top.M139.UI.TipMessage.show(e.msg, {delay: 1000, className: 'msgRed'});
                    }
                }

                _this.set({contacts: contacts});
                callback(contacts);
            };
            
            this.getDataSource(options);            
        },
        format: function(data){
            switch(data.UserSex){
                case "0":
                    data.SexText = this.SEX.MALE;
                    break;
                case "1": 
                    data.SexText = this.SEX.WOMAN;
                    break;
                case "2": 
                    data.SexText = this.SEX.PRIVARY;
                    break;
                default:
                    data.SexText = '';
                    data.UserSex = '';
                    break;
            }

            switch(data.Marriage){
                case '1':
                    data.MarriageText = this.MARRIAGE.MARRIED;
                    break;
                case '2':
                    data.MarriageText = this.MARRIAGE.DISCOVERTURE;
                    break;
                default:
                    data.Marriage = '0';
                    data.MarriageText = this.MARRIAGE.EMPTY;                    
                    break;
            }

            return this.fixPhoto(data);
        },
        getInfo: function() {
            var obj = {};
            var info = this.get('contacts');

            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;
            obj.AddrFirstName = info.firstInfo.AddrFirstName;

            for(var key in info.baseInfo){
                obj[key] = info.baseInfo[key].value;
            }
            
            for(var key in info.otherInfo){
                obj[key] = info.otherInfo[key].value;
            }

            for(var key in info.moreInfo){
                obj[key] = info.moreInfo[key].value;
            }

            return obj;
        },
        getInfoByReady: function() { 
            var obj = {};
            var info = this.get('contacts');

            obj.name = M139.Text.Html.encode(info.firstInfo.Name);
            obj.AddrFirstName = M139.Text.Html.encode(info.firstInfo.Name);
            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;

            for(var key in info.baseInfo){
                obj[key] = M139.Text.Html.encode(info.baseInfo[key].value);
            }
            
            for(var key in info.otherInfo){
                obj[key] = M139.Text.Html.encode(info.otherInfo[key].value);
            }

            for(var key in info.moreInfo){
                obj[key] = M139.Text.Html.encode(info.moreInfo[key].value);
            }           

            return obj;
        },
        getInfoByWrite: function() {
            var info = this.getInfo();

            //是否取model里面的新值,编辑时会用到    
            for(var key in info){
                var value = this.get(key) || '';
                info[key] = $.trim(value);
            }

            info.ImageUrl = info.ImagePath || info.ImageUrl;
            
            return info;
        },
        fixPhoto: function (data) {
            var baseUrl = this.getPhotoUploadedAddr();
            var defPhoto = top.$App.getResourcePath() + "/images/face.png";
            var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];

            if (data.ImageUrl && data.ImageUrl.length > 0) {
                if (data.ImageUrl.indexOf("http://") == 0) {
                    return data;
                }
                data.ImagePath = data.ImageUrl;
                //  var path = this.ImagePath.toLowerCase(); 不能转大小写
                var path = data.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    data.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
                    data.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                data.ImageUrl = defPhoto;
                data.ImagePath = "/upload/photo/nopic.jpg";
            }

            return data;
        },
        getPhotoUploadedAddr: function() {
                var tmpurl = location.host;
                var url2 = "";
                if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
                    url2 = "http://image0.139cm.com";
                } else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
                    url2 = "http://images.139cm.com";
                } else if (tmpurl.indexOf("10086ts") > -1) {
                    url2 = "http://g2.mail.10086ts.cn";
                }else if(tmpurl.indexOf("10086rd") > -1){
                    url2 = "http://static.rd139cm.com";
                }
                return url2 ;
        }
    }));

})(jQuery, _, M139);
