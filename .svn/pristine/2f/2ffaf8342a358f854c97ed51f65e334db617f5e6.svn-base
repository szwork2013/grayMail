
;(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.ContactsSingle";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        defaults: {
            contacts: null, //联系人信息, 格式化后的数据体
            AddGroupName: '', //新增组名
            AddrFirstName : "", //用户姓名            
            UserSex : '', //用户性别
            BirDay : "", //出生日期(YYYY-MM-DD)
            GroupId: '', //分组
            FamilyEmail : '', //邮箱
            HomeAddress : '', //家庭地址
            MobilePhone : '', //手机
            FamilyPhone : '', //电话
            ProvCode: '', //省份
            CityCode: '', //城市            
            OtherIm : '', //飞信号
            SerialId: '', //联系人ID
            CPName : '', //公司名称                        
            UserJob : '', //职务
            BusinessEmail : '', //商务邮箱
            BusinessMobile : '', //商务手机
            BusinessPhone : '', //公司固话
            BusinessFax: '', //公司传真
            CPProvCode: '', //省份
            CPCityCode: '', //城市
            CPAddress : '', //公司地址
            CPZipCode : '', //公司邮编
            Memo: '', //备注
            ImageUrl: '', //头像
            ImagePath: '', //头像
            name: '' //姓名   
        },
        TIPS: {
            DATE_GT_CURRENT: '生日不能大于当前日期',
            INPUT_NAME: '请输入姓名',
            MOBILE_AND_EMAIL: '电子邮箱和手机号码，请至少填写一项',
            MOBILE_ERROR: '手机号码格式不正确，请输入3-20位数字',
            EMAIL_ERROR: '电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            MAX_TIP: '保存失败，联系人数量已达上限',
            PHONE_ERROR: '常用固话格式不正确，请输入3-30位数字、-',
            FEIXIN_ERROR: '飞信号格式不正确，请输入6-9位数字',
            BUSSINESS_EMAIL_ERROR: '商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            BUSSINESS_MOBLIE_ERROR: '商务手机格式不正确，请输入3-20位数字',
            CP_PHONE_ERROR: '公司固话格式不正确，请输入3-30位数字、-',
            FAX_ERROR: '传真号码话格式不正确，请输入3-30位数字、-',
            CP_ZIPCODE_ERROR: '公司邮编格式不正确，请输入3-10位字母、数字、-或空格',
            PHOTO_FAIL: '头像上传失败，请上传gif、jpg、jpeg、bmp、png格式的图片',
            PHOTO_MAX: '头像上传失败，请上传大小在10MB以内的图片',
            CREATE_SUCCESS: '新建成功',
            SAVE_SUCCESS: '保存成功'            
        },

        SEX: {
           MALE: '男',
           WOMAN: '女',
           PRIVARY: '保密'
        },

        isMobile: /^[\d]{3,20}$/,
        isPhone: /^[\d-]{3,30}$/,
        isZipCode:  /^[\d]{3,10}$/,
        isFeixin:  /^[\d]{6,9}$/,

        initialize: function (options) {
            this.contactsModel = top.M2012.Contacts.getModel();
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

            //验证姓名内容有效性
            var key = 'AddrFirstName';
            if (_.has(data, key)) {
                if (data.AddrFirstName.length == 0) {
                    return getResult(key, self.TIPS.INPUT_NAME);
                }
            }
            
            key = 'FamilyEmail';
            if (_.has(data, key)) {
                if (data.FamilyEmail.length > 0 && !M139.Text.Email.isEmail(data.FamilyEmail)) {
                    return getResult(key, self.TIPS.EMAIL_ERROR);
                }else if(data.FamilyEmail.length == 0 && this.get('MobilePhone').length == 0){
                    return getResult(key, self.TIPS.MOBILE_AND_EMAIL);
                }
            }

            key = 'BusinessEmail';
            if (_.has(data, key)) {
                if (data.BusinessEmail.length > 0 && !M139.Text.Email.isEmail(data.BusinessEmail)) {
                    return getResult(key, self.TIPS.BUSSINESS_EMAIL_ERROR);
                }
            }

            key = 'MobilePhone';
            if (_.has(data, key)) {
                if (data.MobilePhone.length > 0 && !self.isMobile.test(data.MobilePhone)) {
                    return getResult(key, self.TIPS.MOBILE_ERROR);
                }else if(this.get('FamilyEmail').length == 0 && data.MobilePhone.length == 0){
                    return getResult(key, self.TIPS.MOBILE_AND_EMAIL);
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
        },
        getContactsInfoById: function(options){
            top.M2012.Contacts.API.getContactsInfoById(options.serialId, function(result){
                if(result.success){
                    options.success(result.contactsInfo)
                }else{
                    options.error(result);
                }
            }, options);
        },
        getContacts: function(args){
            var _this = this;

            var contacts = {
                firstInfo: {
                    Name: '',
                    ImageUrl: '',
                    ImagePath: ''
                },
                baseInfo: {
                    FamilyEmail: {key: '电子邮箱', value: ''},
                    BusinessEmail: {key: '商务邮箱', value: ''},
                    MobilePhone: {key: '手机号码', value: ''},
                    BusinessMobile: {key: '商务手机', value: ''}, 
                    BirDay: {key: '生日', value:''},
                    GroupName: {key: '分组',value:''}
                },
                otherInfo: {
                    AddGroupName: {key: '新组', value: ''},
                    SexText: {key: '性别', value:''},
                    FamilyPhone: {key: '常用固话', value: ''} ,
                    BusinessPhone: {key: '公司固话', value: ''},
                    BusinessFax: {key: '传真号码', value: ''},
                    FamilyAddress: {key: '家庭地址', value: ''},
                    CompanyAddress: {key: '公司地址', value: ''},
                    CPName: {key: '公司名称', value: ''},
                    UserJob: {key: '职务', value: ''},
                    CPZipCode: {key: '公司邮编', value: ''},
                    OtherIm: {key: '飞信号', value: ''},
                    Memo: {key: '备注', value: ''}
                },
                moreInfo: {
                   ProvCode: {key: '省份', value: ''},
                   CityCode: {key: '城市', value: ''},
                   HomeAddress: {key: '家庭地址', value: ''},
                   CPProvCode: {key: '省份', value: ''},
                   CPCityCode: {key: '城市', value: ''},
                   CPAddress: {key: '公司地址', value: ''},
                   UserSex: {key: '性别', value: ''},
                   GroupId: {key: '分组', value: ''},
                   SerialId: {key: 'ID', value: ''}
                }
            };

            var success = function(e){
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

                firstInfo.Name = data.Name;
                firstInfo.ImageUrl = data.ImageUrl;
                firstInfo.ImagePath = data.ImagePath;
                

                contacts.firstInfo = firstInfo;
                contacts.baseInfo = baseInfo;
                contacts.moreInfo = moreInfo;
                contacts.otherInfo = otherInfo;
                _this.set({contacts: contacts});

                if(args.callback){
                    args.callback(contacts);
                }
            };           

            if(args.contacts){
                success(args.contacts);
            }else if(args.callback){
                _this.set({contacts: contacts});
                args.callback(contacts);
            }          
        },
        getContactsById: function(args){
            var _this = this;
            var options = {
                serialId: args.serialId
            };

            options.success = function(e){
                if(e){
                    args.contacts = e;
                    _this.getContacts(args);
                }
            };

            options.error = function(e){
                
            };

            this.set({serialId: options.serialId});
            this.getContactsInfoById(options);
        },
        format: function(data){
            var GroupName = [];
            var FamilyAddress = [];
            var CompanyAddress = [];
            var sex = data.UserSex ? data.UserSex : '';
            var gMap = data.GroupId ? data.GroupId.split(',') : [];
            var fMap = ['ProvCode', 'CityCode', 'HomeAddress'];
            var cMap = ['CPProvCode', 'CPCityCode', 'CPAddress'];

            for(var i = 0; i < fMap.length; i++){
                var fk = fMap[i];
                if(data[fk] && data[fk].length){
                    FamilyAddress.push(data[fk]);
                }
            }

            for(var j = 0; j < cMap.length; j++){
                var ck = cMap[j];
                if(data[ck] && data[ck].length){
                    CompanyAddress.push(data[ck]);
                }
            }

            for(var k = 0; k < gMap.length; k++){
                var group = this.contactsModel.getGroupById(gMap[k]);

                if(group){//防止分组被删除引发错误
                    GroupName.push(group.name || group.GroupName);
                }
            }

            switch(sex){
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
                    break;
            }

            
            data.Name = data.name;
            data.GroupName = GroupName;
            data.FamilyAddress = FamilyAddress.join(' ');
            data.CompanyAddress = CompanyAddress.join(' ');

            return data;
        },
        getInfo: function(isNew) {
            var obj = {};
            var info = this.get('contacts');

            obj.name = info.firstInfo.Name;
            obj.AddrFirstName = info.firstInfo.Name;
            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;

            for(var key in info.baseInfo){
                obj[key] = info.baseInfo[key].value;
            }
            
            for(var key in info.otherInfo){
                obj[key] = info.otherInfo[key].value;
            }

            for(var key in info.moreInfo){
                obj[key] = info.moreInfo[key].value;
            }

            if(isNew){
                for(var key in obj){
                    var value = this.get(key) || '';
                    obj[key] = value;
                }
            }

            return obj;
        },
        onReady: function(isReadySuccess) {

        }
    }));

})(jQuery, _, M139);