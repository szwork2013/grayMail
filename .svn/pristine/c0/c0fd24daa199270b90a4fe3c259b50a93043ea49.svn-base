//
//供更新联系人的前段接口调用的接口
//此接口内容基本上是对后台接口调用的请求
//
//为区分函数定义和类定义，函数定义统一用 var method = function(){} 的方式
//类定义统一为：function(){}
//

//闭包内，防止冲突
(function (nameSpaceName) {
    //todo:debug 功能开启，上线时候记得关掉
    var debug = false;
    //todo: 高性能模式会简化很多严格验证，特别是要做多重循环的验证。上线时记得开启
    var hightPerformanceModel = false;
    //名称空间 
    if (!window[nameSpaceName]) {
        window[nameSpaceName] = {};
    }
    //----------------------- 一些公共方法 ------------------------------------
    //数组中是否包含某个值
    Array.prototype.Contain = function (input) {
        if (!input || typeof input !== 'string') throw new Error('Contain 方法中参数必须是字符');
        return this.join(',').indexOf(input) !== -1;
    };

    //在数组中检测是否有重复项
    Array.prototype.CheckRepeat = function () {
        var hash = {};
        for (var i in this) {
            if (hash[this[i]])
                return this[i];
            hash[this[i]] = true;
        }
        return false;
    };
    //参数验证
    var ValidateParam = function (functionName, paramName, param, typeParam) {
        var t = typeof typeParam;
        if (!typeParam || t !== 'string') throw new Error('验证函数中接受的验证对象类型，必须以字符串方式传入；实际是：' + t);
        if (!param || typeof param !== typeParam) throw new Error(functionName + '中验证函数中' + paramName + '接受的类型必须是' + typeParam + '；实际是：' + (typeof param));
    };
    var ThrowParamNeedExceiption = function (objectName, paramName) {
        if (!objectName || typeof objectName !== 'string' || !paramName || typeof paramName !== 'string') throw new Error('ThrowParamNeedExceiption 中2个参数必须为字符串');
        throw new Error(objectName + ' 中，必填的字段 ' + paramName + ' 没有给值');
    };

    //------------------------ 简单继承的实现方法------------------------
    var Extend = function (base, subclass) {
        ValidateParam('Extend', 'base', base, 'function');
        ValidateParam('Extend', 'subclass', base, 'function');
        var f = function () {
        };
        f.prototype = base.prototype;
        subclass.prototype = new f();
        subclass.prototype.constructor = subclass;

        subclass.supper = base.prototype;
        if (base.prototype.constructor == Object.prototype.constructor) {
            base.prototype.constructor = base;
        }
    };

    //------------------------ 简单继承的实现方法 end------------------------

    //------------------------ 接口声明--------------------------
    var UCinterface = function (name, methods) {
        var length = arguments.length;
        if (length != 2) throw new Error('接口只接受2个参数，实际有参数' + length);
        this.Name = name;
        this.Methods = [];

        for (var i = methods.length; i; i--) {
            var methodType = typeof methods[i - 1];
            if (methodType !== 'string') throw new Error('接口函数中只接受字符类型的 成员,实际的成员类型为：' + methodType);
            this.Methods.push(methods[i - 1]);
        }
    };

    UCinterface.EnsureImplements = function (object) {
        //添加这个字段，在高性能要求下将不检查接口实现
        if (hightPerformanceModel) return;
        var len = arguments.length;
        if (len < 2) throw new Error("EnsureImplements 方法调用需要至少2个参数");
        for (var i = len; i - 1; i--) {
            var currentInterface = arguments[i - 1];
            if (currentInterface.constructor != UCinterface) throw new Error("EnsureImplements 第2个参数开始的时候应该是Interface对象，检查第" + i + "个参数的构造函数");

            for (var j = currentInterface.Methods.length; j; j--) {
                var method = currentInterface.Methods[j - 1];
                if (!object[method] || typeof object[method] !== 'function') throw new Error("此对象未实现指定接口,接口为：" + currentInterface.Name + "，缺少方法：" + currentInterface.Methods[j - 1]);
            }
        }
    };
    //接口定义
    var IAjaxRequestable = new UCinterface('IAjaxRequestable', ['DoAjaxRequest', 'SuccessHandler', 'GetResponseData', 'SetRequestData', 'ComposeRequestData', 'SetApiURL']);
    var IValidatable = new UCinterface('IValidatable', ['Validate']);
    //------------------------ 接口声明 end--------------------------
    //------------------------ 通用验证 -----------------------------
    //验证枚举项中是否有重复值，确保枚举类型的正确性
    var ValidateEnum = function (enumInput, name) {
        if (hightPerformanceModel) return;
        ValidateParam('ValidateEnum', 'enumInput', enumInput, 'object');
        ValidateParam('ValidateEnum', 'name', name, 'string');
        var enumArray = [];
        for (var item in enumInput) {
            if (enumInput.hasOwnProperty(item)) {
                enumArray.push(enumInput[item]);
            }
        }
        if (enumArray.CheckRepeat()) throw new Error(name + '中存在重复的项:' + enumArray.CheckRepeat());
    };
    //------------------------ 通用验证 end -------------------------

    //------------------------ 常量字段 -------------------------
    var INT_DEFAULT = -1;
    var STR_DEFAULT = '';
    var CheckDefault = function (input) { return input === INT_DEFAULT || input === STR_DEFAULT; };
    //------------------------ 常量字段 end--------------------------

    //------------------------ 类枚举字段 ------------------------
    //查询请求的类型
    var APIType = {
        Default: 0,
        NeedUpdateContact: 1,
        NeedUpdateContactDetail: 2,
        AllUpdateResult: 3,
        SaveAllUpdatedInfoResp: 4,
        SaveIncrementalUpdatedInfo: 5,
        SkipCurrent: 6,
        ReportImg:7,
        NoRromptInfo:8
    };
    ValidateEnum(APIType, 'APIType');
    //------------------------ 类枚举字段 end ------------------------

    //------------------------ 参数对象 具体参数意义请参考文档-----------------------------

    function ParamBase(object) {
        this.UserNumber = object ? object['UserNumber'] : INT_DEFAULT;
    }
    ParamBase.prototype.Validate = function () {
        if (this.UserNumber == INT_DEFAULT) return false;
        return true;
    };
    //用来传递给查询逻辑的参数对象
    function UpdateContactsParams(object) {
        UpdateContactsParams.supper.constructor.call(this, object);
    }
    Extend(ParamBase, UpdateContactsParams);

    //用来传递给查询逻辑的参数对象
    function UpdateContactsDetailParams(object) {
        this.Page = object ? object['Page'] : STR_DEFAULT;
        this.Record = object ? object['Record'] : STR_DEFAULT;
        var _this = this;
        this.Validate = function () {
           // if (_this.Page == INT_DEFAULT) return false;
            //if (_this.Record == INT_DEFAULT) return false;
            return UpdateContactsDetailParams.supper.Validate.call(_this, object);
        };
    }
    Extend(ParamBase, UpdateContactsDetailParams);

    //用来传递给更新逻辑的查询参数 ContactInfoItem 为子项类型
    function ParamsForSaveIncremental(object) {
        ParamsForSaveIncremental.supper.constructor.call(this, object);
        this.ContactInfos = [];
        var _this = this;
        this.Validate = function () {
            var cis = _this.ContactInfos;
            if (cis.length === 0) return false;
            for (var i = cis.length; i; i--) {
                var curr = cis[i - 1];
                if (curr.constructor !== ContactInfoItem) return false;
                if (curr.SerialId == INT_DEFAULT) return false;
                if (curr.AddrFirstName == STR_DEFAULT) return false;
                //if (curr.ImageUrl == STR_DEFAULT) return false;
                //if (curr.FamilyEmail == STR_DEFAULT) return false;//手机跟邮箱不能限死
                //if (curr.MobilePhone == STR_DEFAULT) return false;
            }
            return ParamsForSaveIncremental.supper.Validate.call(_this);
        };
    }
    Extend(ParamBase, ParamsForSaveIncremental);

    function ContactInfoItem(object) {
        //必填字段
        this.SerialId = object ? object['SerialId'] : INT_DEFAULT;
        this.AddrFirstName = object ? object['AddrFirstName'] : STR_DEFAULT;
        this.ImageUrl = object ? object['ImageUrl'] : STR_DEFAULT;
        this.FamilyEmail = object ? object['FamilyEmail'] : STR_DEFAULT;
        this.MobilePhone = object ? object['MobilePhone'] : STR_DEFAULT;

        //选填字段
        this.FamilyEmail = object ? object['FamilyPhone'] : STR_DEFAULT;
        this.UserSex = object ? object['UserSex'] : STR_DEFAULT;
        this.Birday = object ? object['Birday'] : STR_DEFAULT;
        this.OtherIm = object ? object['OtherIm'] : STR_DEFAULT;
        this.HomeAddress = object ? object['HomeAddress'] : STR_DEFAULT;
        this.CPName = object ? object['CPName'] : STR_DEFAULT;
        this.UserJob = object ? object['UserJob'] : STR_DEFAULT;
        this.BusinessEmail = object ? object['BusinessEmail'] : STR_DEFAULT;
        this.BusinessMobile = object ? object['BusinessMobile'] : STR_DEFAULT;
        this.BusinessPhone = object ? object['BusinessPhone'] : STR_DEFAULT;
        this.CPAddress = object ? object['CPAddress'] : STR_DEFAULT;
        this.CPZipCode = object ? object['CPZipCode'] : STR_DEFAULT;
    }

    //保存所有的参数对象
    function ParamsForSaveAll(object) {
        ParamsForSaveAll.supper.constructor.call(this, object);
    }
    Extend(ParamBase, ParamsForSaveAll);

    function ParamsForQueryResult(object) {
        ParamsForQueryResult.supper.constructor.call(this, object);
    }
    Extend(ParamBase, ParamsForQueryResult);

    function ParamsForSkip(object) {
        ParamsForSkip.supper.constructor.call(this, object);
        this.SerialId = object ? object['SerialId'] : STR_DEFAULT;
        var _this = this;
        this.Validate = function () {
            if (_this.SerialId == STR_DEFAULT) return false;
            return ParamsForSkip.supper.Validate.call(_this);
        };
    }
    Extend(ParamBase, ParamsForSkip);

   //举报头像参数定义
   function ParamsForReportImg(object){
        ParamsForReportImg.supper.constructor.call(this,object);
        this.ReportedNumber = object ? object['ReportedNumber'] : STR_DEFAULT;
        this.ReportType = object ? object['ReportType'] : STR_DEFAULT;
        this.ImageUrl = object ? object['ImageUrl'] : STR_DEFAULT;
        this.ReportInfo = object ? object['ReportInfo'] : STR_DEFAULT;
        this.ReportedSid = object ? object['ReportedSid'] : STR_DEFAULT;
        var _this = this;
        this.Validate = function(){
          if(_this.ReportedNumber == STR_DEFAULT) return false;
          if(_this.ImageUrl == STR_DEFAULT) return false;
          if(_this.ReportType == STR_DEFAULT) return false;  
          if(_this.ReportedSid == STR_DEFAULT) return false;       
          return ParamsForReportImg.supper.Validate.call(_this);
         }       
    }
   Extend(ParamBase, ParamsForReportImg);
   
   function ParamsForNeverPrompt(object){
       ParamsForNeverPrompt.supper.constructor.call(this,object);
      this.SerialId = object ? object['SerialId'] : INT_DEFAULT;
      var _this = this;
      this.Validate = function(){
          if (_this.SerialId == INT_DEFAULT) return false;
           return ParamsForNeverPrompt.supper.Validate.call(_this);
      }
   } 
   Extend(ParamBase, ParamsForNeverPrompt);
   
    //------------------------ 参数对象 end -----------------------------
    //查询对象的基类
    function QueryBase() {
        //几个属性定义
        var requestData; 
        this.SetRequestData = function (input) { requestData = input; };
        this.GetRequestData = function () { return requestData; };
        var callBack; 
        this.SetCallBack = function (input) { callBack = input; };
        this.DoCallBack = function (param) { callBack(param); };
        var apiUrl; 
        this.SetApiURL = function (input) { apiUrl = input; }; 
        this.GetApiURL = function () { return apiUrl; };
    };

    QueryBase.prototype.SuccessHandler = function (doc) {//top.AddrCrossAjax回调这个函数时，this无法指向Querybase
        this.responeData = this.GetResponseData(doc);
        this.DoCallBack(this.responeData);
    };

    QueryBase.prototype.DoAjaxRequest = function (params, callback) {
        this.ComposeRequestData(params);
        this.SetCallBack(callback);
        if (!debug) {
            var _this = this;
            var ErrorHandler = function (xhr) {
                        throw new Error('ajax请求失败' + xhr.toString());
                 };
           var succHandler = function (doc) {
               var responeData = _this.GetResponseData(doc);
               _this.DoCallBack(responeData);
             };
           top.$RM.call(_this.GetApiURL(), _this.GetRequestData(), function(a){
				succHandler(a);
			}, { error: function(){ alert("连接失败"); } });
			
			//top.AddrCrossAjax(_this.GetApiURL(),_this.GetRequestData(),succHandler,ErrorHandler);

        } else {
            this.SuccessHandler(needUpdateContactsQueryFake);
        }
    };

    //查询需要更新所有联系人
    function NeedUpdateContactsQuery() {
        //继承父类属性复制
        NeedUpdateContactsQuery.supper.constructor.call(this);

        if (!debug) this.SetApiURL("GetUpdatedContactsNum");
        this.ComposeRequestData = function (params) {
            this.SetRequestData('<GetUpdatedContactsNum><UserNumber>' + params.UserNumber + '</UserNumber></GetUpdatedContactsNum>');
        };

        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
				if(!doc.responseData && doc.responseText){
					console.log("responseText");
					console.log(doc.responseText);
					console.log(top.$T.Xml.xml2object(doc.responseText));
					return top.$T.Xml.xml2object(doc.responseText);
				}else{
					return doc.responseData;
				}
				
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { GetUpdatedContactsNumResp: { type: "simple"} });
        };
    }
    Extend(QueryBase, NeedUpdateContactsQuery);

    //需要更新的联系人的详细信息
    function NeedUpdateContactsDetailQuery() {
        //继承父类属性复制
        NeedUpdateContactsDetailQuery.supper.constructor.call(this);
        if (!debug) this.SetApiURL("GetUpdatedContactsDetailInfo");
        this.ComposeRequestData = function (params) {
            this.SetRequestData('<GetUpdatedContactsDetailInfo Page="' + params.Page + '" Record="' + params.Record + '"><UserNumber>' + params.UserNumber + '</UserNumber></GetUpdatedContactsDetailInfo>');
        };
        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
			console.log(doc);
            return doc.responseData;
            /*
			var rsObj = top.xml2json(top.getXmlDoc(doc).documentElement,
                {
                    GetUpdatedContactsDetailInfoResp: { type: "rich" },
                    ContactsInfo: {
                        type: 'rich'
                        },
                     NewInfo: {
                            type: 'simple'
                        },
                     OldInfo: {
                            type: 'simple'
                        }
                 });      
            return rsObj;*/
        };
    }
    Extend(QueryBase, NeedUpdateContactsDetailQuery);

    //查询所有更新的接口
    function AllUpdatedResultQuery() {
        //继承父类属性复制
        AllUpdatedResultQuery.supper.constructor.call(this);
        if (!debug) this.SetApiURL("QuerySaveAllUpdatedResult");
        this.ComposeRequestData = function (params) {
            this.SetRequestData('<QuerySaveAllUpdatedResult><UserNumber>' + params.UserNumber + '</UserNumber></QuerySaveAllUpdatedResult>');
        };
        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { QuerySaveAllUpdatedResultResp: { type: "simple"} });
        };
    }
    Extend(QueryBase, AllUpdatedResultQuery);

    //增量更新的处理
    function SaveIncrementalUpdatedInfo() {
        //继承父类属性复制
        SaveIncrementalUpdatedInfo.supper.constructor.call(this);

        if (!debug) this.SetApiURL("SaveIncrementalUpdatedInfo");
        this.ComposeRequestData = function (params) {
            //组装报文
            var requestData = [];
            requestData.push('<SaveIncrementalUpdatedInfo>');
            requestData.push('<UserNumber>');
            requestData.push(params.UserNumber);
            requestData.push('</UserNumber>');
            for (var i = params.ContactInfos.length; i; i--) {
                requestData.push('<ContactsInfo>');
                var curr = params.ContactInfos[i - 1];
                if (!CheckDefault(curr.SerialId)) requestData.push('<SerialId>' + curr.SerialId + '</SerialId>');
                if (!CheckDefault(curr.AddrFirstName)) requestData.push('<AddrFirstName>' + curr.AddrFirstName + '</AddrFirstName>');
                if (!CheckDefault(curr.ImageUrl)) requestData.push('<ImageUrl>' + curr.ImageUrl + '</ImageUrl>');
                if (!CheckDefault(curr.FamilyEmail)) requestData.push('<FamilyEmail>' + curr.FamilyEmail + '</FamilyEmail>');
                if (!CheckDefault(curr.MobilePhone)) requestData.push('<MobilePhone>' + curr.MobilePhone + '</MobilePhone>');
                if (!CheckDefault(curr.FamilyPhone)) requestData.push('<FamilyPhone>' + curr.FamilyPhone + '</FamilyPhone>');
                if (!CheckDefault(curr.UserSex)) requestData.push('<UserSex>' + curr.UserSex + '</UserSex>');
                if (!CheckDefault(curr.Birday)) requestData.push('<Birday>' + curr.Birday + '</Birday>');
                if (!CheckDefault(curr.OtherIm)) requestData.push('<OtherIm>' + curr.OtherIm + '</OtherIm>');
                if (!CheckDefault(curr.HomeAddress)) requestData.push('<HomeAddress>' + curr.HomeAddress + '</HomeAddress>');
                if (!CheckDefault(curr.CPName)) requestData.push('<CPName>' + curr.CPName + '</CPName>');
                if (!CheckDefault(curr.UserJob)) requestData.push('<UserJob>' + curr.UserJob + '</UserJob>');
                if (!CheckDefault(curr.BusinessEmail)) requestData.push('<BusinessEmail>' + curr.BusinessEmail + '</BusinessEmail>');
                if (!CheckDefault(curr.BusinessMobile)) requestData.push('<BusinessMobile>' + curr.BusinessMobile + '</BusinessMobile>');
                if (!CheckDefault(curr.BusinessPhone)) requestData.push('<BusinessPhone>' + curr.BusinessPhone + '</BusinessPhone>');
                if (!CheckDefault(curr.CPAddress)) requestData.push('<CPAddress>' + curr.CPAddress + '</CPAddress>');
                if (!CheckDefault(curr.CPZipCode)) requestData.push('<CPZipCode>' + curr.CPZipCode + '</CPZipCode>');
                requestData.push('</ContactsInfo>');
            }
            requestData.push('</SaveIncrementalUpdatedInfo>');

            //设置组装好的报文
            this.SetRequestData(requestData.join(''));
        };

        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { SaveIncrementalUpdatedInfoResp: { type: "simple"} });
        };
    }
    Extend(QueryBase, SaveIncrementalUpdatedInfo);

    //全部更新的处理
    function SaveAllUpdatedInfo() {
        //继承父类属性复制
        SaveAllUpdatedInfo.supper.constructor.call(this);
        if (!debug) this.SetApiURL("SaveAllUpdatedInfo");
        this.ComposeRequestData = function (params) {
            this.SetRequestData('<SaveAllUpdatedInfo><UserNumber>' + params.UserNumber + '</UserNumber></SaveAllUpdatedInfo>');
        };
        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { SaveAllUpdatedInfoResp: { type: "simple"} });
        };
    }
    Extend(QueryBase, SaveAllUpdatedInfo);

   function ReportImg(){
       ReportImg.supper.constructor.call(this);
       if (!debug){
            this.SetApiURL("AddImageReport");
       } 
     this.ComposeRequestData = function (params) {
     var str = '<AddImageReport><UserNumber>' 
               + params.UserNumber 
               + '</UserNumber>'
               + '<ReportedSid>'
               + params.ReportedSid
               + '</ReportedSid>'
               + '<ReportedNumber>'
               + params.ReportedNumber
               + '</ReportedNumber>'
               + '<ReportType>'
               + params.ReportType
               + '</ReportType>'
               + '<ImageUrl>'
               + params.ImageUrl
               + '</ImageUrl>'
               + '<ReportInfo>'
               + params.ReportInfo
               + '</ReportInfo></AddImageReport>';
   
        this.SetRequestData(str);
        };
       this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { AddImageReportResp: { type: "simple"} });
       };
   }
   Extend(QueryBase,ReportImg)
    //不在提示
    function NoPromptUpdate(){
        NoPromptUpdate.supper.constructor.call(this);
        if (!debug){
            this.SetApiURL("NoPromptUpdate");
        } 
        this.ComposeRequestData = function (params) {
            var str = '<NoPromptUpdate><UserNumber>' 
                       + params.UserNumber 
                       + '</UserNumber>'
                       + '<SerialId>'
                       + params.SerialId
                       + '</SerialId></NoPromptUpdate>';
           
            this.SetRequestData(str);
        };
       this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { NoPromptUpdateResp: { type: "simple"} });
       };
    }
    Extend(QueryBase, NoPromptUpdate);
    
    
    //跳过当前
    function SkipCurrentInfo() {
        //继承父类属性复制
        SkipCurrentInfo.supper.constructor.call(this);
        if (!debug) this.SetApiURL("SkipCurrent");
        this.ComposeRequestData = function (params) {
            this.SetRequestData('<SkipCurrent><UserNumber>' + params.UserNumber + '</UserNumber></SkipCurrent>');
        };
        this.GetResponseData = function (doc) {
            if (!doc) throw new Error("getResponseData 中参数为空！");
            return doc.responseData;
			//return top.xml2json(top.getXmlDoc(doc).documentElement, { SkipCurrentInfo: { type: "simple"} });
        };
    }
    Extend(QueryBase, SkipCurrentInfo);
    //------------------------ 容器 --------------------------------
    //简单的依赖注入容器,单列 并且减少类创建的开销
    function ObjectContainer() {
        var container = {};
        this.AddRegist = function (name, regObject) {
            container[name] = regObject;
        };
        this.GetRegist = function (name) {
            return container[name];
        };
    }

    ObjectContainer.prototype.RegistType = function (name, object) {
        this.AddRegist(name, object);
    };
    ObjectContainer.prototype.Resolve = function (name) {
        return this.GetRegist(name);
    };

    //程序初始化时候初始化容器
    var Container = new ObjectContainer();
    Container.RegistType(APIType.NeedUpdateContact, new NeedUpdateContactsQuery());
    Container.RegistType(APIType.NeedUpdateContactDetail, new NeedUpdateContactsDetailQuery());
    Container.RegistType(APIType.AllUpdateResult, new AllUpdatedResultQuery());
    Container.RegistType(APIType.SaveAllUpdatedInfoResp, new SaveAllUpdatedInfo());
    Container.RegistType(APIType.SaveIncrementalUpdatedInfo, new SaveIncrementalUpdatedInfo());
    Container.RegistType(APIType.SkipCurrent, new SkipCurrentInfo());
    Container.RegistType(APIType.ReportImg, new ReportImg());
    Container.RegistType(APIType.NoRromptInfo, new NoPromptUpdate());

    //------------------------ 容器 end--------------------------------

    //提供给外部的接口
    var ContactsUpdateServices = {
        ProcessData: function (getDataPcarams, requestType, callback) {
            ValidateParam('ProcessData', 'requestType', requestType, 'number');
            
            if (!getDataPcarams) throw new Error("ContactsUpdateServices 中 GetData 函数参数不能为空");
            UCinterface.EnsureImplements(getDataPcarams, IValidatable);
            if (!getDataPcarams.Validate()) {
                throw new Error('传入ProcessData 中的参数不合法');
            }
            var requestQuery = Container.Resolve(requestType);

            UCinterface.EnsureImplements(requestQuery, IAjaxRequestable);
            return requestQuery.DoAjaxRequest(getDataPcarams, callback);
        }
    };

    //用来测试的数据：
    if (debug) {
        var needUpdateContactsQueryFake = '<GetUpdatedContactsNumResp><ResultCode>0</ResultCode><ResultMsg>success</ResultMsg><UpdatedContactsNum>5</UpdatedContactsNum></GetUpdatedContactsNumResp>';
        var needUpdateContactsDetailQueryFake = '<GetUpdatedContactsDetailInfoResp> \
                                                    <ResultCode>0</ResultCode>\
                                                    <ResultMsg>success</ResultMsg>\
                                                    <UpdatedInfo>\
                                                    <SerialId>12</SerialId>\
                                                    <OldContactsInfo>\
                                                    <AddrirstName>张亮</AddrirstName>\
                                                    <Imagerl>/uuiei</Imagerl>\
                                                    <Mobilehone>123123123</Mobilehone>\
                                                    <BusinesMobile>22222</BusinesMobile>\
                                                    <OtherMoblePhone>31231</OtherMoblePhone>\
                                                    <FamilyEmal>1123@MD.COM</FamilyEmal>\
                                                    <BusinessEmil></BusinessEmil>\
                                                    <OtherEmail>/OtherEmail>\
                                                    <UserSex></UserSex>\
                                                    </OldContactsInfo>\
                                                    <NewContactsInfo>\
                                                    <AddrFirstName>张123</AddrFirstName>\
                                                    <ImageUrl>/uuiei<ImageUrl>\
                                                    <MobilePhone>9999999</MobilePhone>\
                                                    <BusinessMobile>999/BusinessMobile>\
                                                    <OtherMobilePhone>3131</OtherMobilePhone>\
                                                    <FamilyEmail>1123@M1DCOM</FamilyEmail>\
                                                    <BusinessEmail></BusinessEmail>\
                                                    <OtherEmail></OtherEmail>\
                                                    <UserSex></UserSex>\
                                                    </NewContactsInfo>\
                                                    </UpdatedInfo>    \
                                                 </GetUpdatedContactsDetailInfoResp>';
        var AllUpdatedResultQueryFake = '<QuerySaveAllUpdatedResultResp>\
                                    <ResultCode>0</ResultCode>\
                                    <ResultMsg>success</ResultMsg>\
                                    <SuccessNum>12</SuccessNum>\
                                  </QuerySaveAllUpdatedResultResp>';
        var SaveIncrementalUpdatedInfoFake = '<SaveIncrementalUpdatedInfoResp>\
                                                <ResultCode>0</ResultCode>\
                                                <ResultMsg>sucess</ResultMsg>\
                                             </SaveIncrementalUpdatedInfoResp>';
        var SaveAllUpdatedInfoFake = '<SaveAllUpdatedInfoResp>\
                                                <ResultCode>0</ResultCode>\
                                                <ResultMsg>sucess</ResultMsg>\
                                             </SaveAllUpdatedInfoResp>';
     

    }

    //
    //注册接口方法
    window[nameSpaceName]['Service'] = ContactsUpdateServices;
    window[nameSpaceName]['ApiType'] = APIType;

    //几个参数类型给外面使用
    window[nameSpaceName]['QueryAllParams'] = UpdateContactsParams;
    window[nameSpaceName]['QueryDetailParams'] = UpdateContactsDetailParams;
    window[nameSpaceName]['SaveAllParams'] = ParamsForSaveAll;
    window[nameSpaceName]['SaveIncrimentParams'] = ParamsForSaveIncremental;
    window[nameSpaceName]['SaveIncrimentParamsItem'] = ContactInfoItem;
    window[nameSpaceName]['QueryAllResultParams'] = ParamsForQueryResult;
    window[nameSpaceName]['SkipCurrentParams'] = ParamsForSkip;
    window[nameSpaceName]['ReportImgParams'] = ParamsForReportImg;
    window[nameSpaceName]['NeverPromptParams'] = ParamsForNeverPrompt;
    
})('UpdateContactInterface');