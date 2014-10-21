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
﻿/**
*@param dateWarpId 日期控件 一dateWrapDomId元素为父元素，
**                 内嵌三个<slecet>作为年月日选择下拉框，
**                 class分别对应dateForYear、dateForMonth、dateForDay
**var date = new DateControl(DomId) init this dateControl
**    date.setDate("2011-01-03");set date
**    date.getDateString(); 
*/
function DateControl(dateWrapDomId){
	var _this =this;
    var _yearObj = $("#" +dateWrapDomId).find(".dateForYear")[0];
    var _monthObj = $("#" +dateWrapDomId).find(".dateForMonth")[0];
    var _dayObj = $("#" +dateWrapDomId).find(".dateForDay")[0];
    var Options = "<option value>--</option>";
    
    //绑定控件事件选择了年才能选择月 选择了月才能选择日期
    $(_yearObj).change(function(){
         _this.clickYear();
     });
        
     $(_monthObj).change(function(){
         _this.clickMonth();
     });
	 $(_dayObj).change(function(){
         _this.clickDay();
     });
	this.currentTime = new Date();
 
    this.year = _yearObj.value|| "";
    this.month = _monthObj.value || "";
    this.day = _dayObj.value || "";
    
    //this.MinYear = this.currentTime.getFullYear() - 100;  
    this.MinYear = 1900;  //设置最小年份1900年
    this.MaxYear = this.currentTime.getFullYear();       //获取今年年份
    
    this.yearObj = _yearObj; 
    this.monthObj = _monthObj;
    this.dayObj = _dayObj;
    
	//初始化日期控件
    this.init = function() {
        this.drawYear();
        this.drawMonth();
        this.drawDay();
	};
	
	//draw year select
    this.drawYear = function() {
		$(this.yearObj).empty();
		Options = "<option value>--</option>";
		$(Options).appendTo($(this.yearObj));
        for (var i = this.MaxYear; i >= this.MinYear; i--){
			if($.trim(this.year) == $.trim(i)){
				Options = "<option value=" + i + " selected> " + i +"</option>";
			}else{
				Options = "<option value=" + i + " > " + i +"</option>";
			}
			$(Options).appendTo($(this.yearObj));
        }
		//用户填写的时间不在本控件时间范围内1900~201+++内，则单独生产一个选项
		if(this.year>0 & this.year < this.MinYear){
			Options = "<option value=" + this.year + " selected> " + this.year +"</option>";
			$(Options).appendTo($(this.yearObj));
		}
    };
	//draw month select
    this.drawMonth = function() { 
		$(this.monthObj).empty();
		Options = "<option value>--</option>";
		$(Options).appendTo($(this.monthObj));
        for (var i = 1; i <= 12; i++){
		   if($.trim(this.month) == i){
				Options = "<option value=" + i + " selected> " + i +"</option>";
		   }else{
				Options = "<option value=" + i + "> " + i +"</option>";
		   }
		  $(Options).appendTo($(this.monthObj));
        }
    };
	//draw day  select 日期根据年和月来控制，瑞年2月29天
    this.drawDay = function() {
		$(this.dayObj).empty();
		 Options = "<option value>--</option>";
		$(Options).appendTo($(this.dayObj)); 
        if($.trim(this.year) ==""  || $.trim(this.month) == ""){ return;}
		for (var i = 1; i <= new Date(this.year,this.month,0).getDate(); i++){
			if($.trim(this.day) == i ){
			   Options = "<option value=" + i + " selected > " + i +"</option>";
			}else{ 
			  Options = "<option value=" + i + "> " + i +"</option>";
			}
			$(Options).appendTo($(this.dayObj));
		}
    };
    this.clickYear = function() {//this.yearObj.value 选中的值;
        this.year = this.yearObj.value;
		this.month = this.monthObj.value;
		this.day = this.dayObj.value; //改变年份，记住日期值
        this.drawMonth();
        this.drawDay();
    };
    
    this.clickMonth = function() {
        this.year = this.yearObj.value;
        this.month = this.monthObj.value;
		this.day = this.dayObj.value; //改变年份，记住日期值
        this.drawDay();
    };
	
	this.clickDay = function(){
	};
	
	
	this.setYear = function(Y){
	 if(this.IsEmpty(Y)){
		this.year = "";
		return;
	 }
	 this.year = Y;
	 this.yearObj.value = Y;
	 this.drawYear();
	};
	
	this.setMonth = function(M){
	 if(this.IsEmpty(M)){
		this.month = "";
		return;
	 }
	 this.month = M;
	 this.drawMonth();
	};
	
	this.setDay = function(D){
	 if(this.IsEmpty(D)){
	    this.day = "";
		return;
	}
	 this.day = D;
	 this.drawDay();
	};
	
	
	this.setDate = function(date){
	 if(this.IsEmpty(date)){return;}
	
	 var birArray = date.split("-");
	 if(birArray[0] && !_this.IsEmpty(birArray[0])){
	  this.setYear(birArray[0]);
	 }
	 if(birArray[1] && !_this.IsEmpty(birArray[1])){
	  this.setMonth(birArray[1]);
	 }
	
	 if(birArray[2] && !_this.IsEmpty(birArray[2])){
	  this.setDay(birArray[2]);
	 }
	};
	
	
	this.getYear = function(){
		return this.yearObj.value;
	}
	this.getMonth = function(){
		var m = this.monthObj.value;
		if(m && $.trim(m).length==1){
			m = "0" + m;
		}
		return m;
	}
	this.getDay = function(){
		var d = this.dayObj.value;
		if(d && $.trim(d).length==1){
			d = "0" + d;
		}
		return d;
	}
	this.getDateString = function(){
	  var y = this.getYear();
	  var m = this.getMonth();
	  var d = this.getDay();
	  var date;
	  if(!this.IsEmpty(y) && !this.IsEmpty (m) && !this.IsEmpty(d)){
		date = y + "-" + m + "-" + d;
	  }else{
		date = "";
	  }
	  return date;
	};
	
	this.IsEmpty = function(str){
	 if($.trim(str).length != 0 && str != null && str != "undefined" && str !=NaN && str != "--"){
		return false;
	  }
	  return true;
	};
	
	//初始化日期控件
	this.init(); 
}
﻿/**
 @更新联系人
 @2012.05.31
 */

//更新联系人接口
if (window.ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].detail;
    var UpdateMsg = ADDR_I18N[ADDR_I18N.LocalName].updatecontacts;
    var ErrorMsg = ADDR_I18N[ADDR_I18N.LocalName].whoaddme;
}
function encodeXML(str){
	return top.$Xml.encode(str);
}
function htmlEncode(str) {
    return top.$T.Html.encode(str);
}

var anchorLocal = (function(d){
    return (function(url){
        var b = d.createElement("a");
        if (b.click) {
            b.href = url;
            d.body.appendChild(b);
            b.click();
        } else {
            b = d.createElement("META");
            b.httpEquiv="refresh";
            b.content="0;url=" + url; 
            d.getElementsByTagName("head")[0].appendChild(b);
        }
    });
})(document);
var wu = window.UpdateContactInterface;
var imgLoadurl = "/addr/apiserver/httpimgload.ashx";//imgLoadurl
var UpdateContacts = {
    count:0,//当前显示第几个
    deal:0,//已处理
    sum:0,//总人数
    deletNum:0,//不再提示的人数
    contactsInfoFiled:{ ImageUrl:"头像：", name:"姓名：",AddrFirstName :"姓名：",FamilyEmail:"电子邮箱：" ,BusinessEmail:"商务邮箱：",MobilePhone:"手机号码：", 
                        BusinessMobile:"商务手机：",FamilyPhone:"常用固话：",BusinessPhone:"公司固话：", UserSex:"性别：", CPName:"公司名称：", UserJob:"职务：",
                        HomeAddress:"家庭地址：",CPAddress:"公司地址：",CPZipCode:"公司邮编：" ,  Birday:"生日：", OtherIm:"飞信号 ："},
    gContactsDetails : new top.ContactsInfo(this.contactsInfoFiled),
    ContactMethod:"", //联系人账号 举报用
    RelatedAccount:"",//被举报联系人的电话
    ReportedSid:"",
    reportImage:"",//举报头像
    birthDay : null,
	logger: new M139.Logger("updatecontacts.js"),
	getUid:function(){
		return top.$User.getUid();
	},
	getUrlPrama:function(key,url){
		 var url = url || location.href;
		 return top.$Url.queryString(key,url );
	},
    initPage: function(){
        var _this =this;
		$("#nowupdateCount").text(this.count);
        this.bindEvents();
        this.birthDay = new DateControl("dateWrap"); //日期控件 dateWarp
        this.queryUpdateCount();//更新联系人总数
        top.addBehaviorExt({actionId:101245,thingId:0,moduleId:14});    
    },
    
	/**
	@绑定页面元素事件
	*/
	bindEvents: function(){

        //全部合并
        $("#aMergeAll_Up,#aMergeAll_Down").click(function(){
	    top.BH("addr_updateContact_updateAll");
            UpdateContacts.mergeAll();
            if (top.dyinfoNeedUpdateLength) {
                top.$App.dyinfoChanged1 = true;
                top.dyinfoNeedUpdateLength = 0; //用于欢迎页动态消息局部更新;
            }
            top.addBehaviorExt({actionId:101246,thingId:0,moduleId:14});
        });
    
        //更新，下一个
        $("#aMergeAndGoToNext").click(function(){
	    top.BH("addr_updateContact_updateNext");
            UpdateContacts.mergeAndGoToNext();
            if (top.dyinfoNeedUpdateLength) {
                top.$App.dyinfoChanged1 = true;
                top.dyinfoNeedUpdateLength-- //用于欢迎页动态消息局部更新;
            }
            top.addBehaviorExt({actionId:101246,thingId:0,moduleId:14});
        });
    
        //跳过
        $("#aGoToNext").click(function(){
            UpdateContacts.goToNextEvent();
            top.addBehaviorExt({actionId:101244,thingId:0,moduleId:14});
        });
        $("#aBack_Down,#aBack_Up,#aBack1,#aBack0").click(function(){
            UpdateContacts.goHomePage();
            return false;//ie6兼容
        });
        
        //不再提示
        $("#neverPrompt").click(function(){
            UpdateContacts.neverPrompt();
            top.addBehaviorExt({actionId:101574,thingId:0,moduleId:14});
        });
        
        //头像举报
        $("#reportImg").click(function(){
            if($(this).hasClass("IsReported")){return false;}
            UpdateContacts.reportImg();            
        });
		//手机号过滤
		 $("#MobilePhone").blur(function(e){//手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
			var mobile = e.target.value.replace(/\D/g, "");
			$(this).val(mobile);
		 });
         
		 $("#BusinessMobile").blur(function(e){//手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
			var mobile = e.target.value.replace(/\D/g, "");
			$(this).val(mobile);
		 });
	},
	
	/**
	@查询待更新联系人总数
	@param:
	@reutrn:
	*/
	queryUpdateCount: function(){
        var _this = this;
	    var param = new wu.QueryAllParams();
            param.UserNumber = _this.getUid();
            try{
              wu.Service.ProcessData(
                param,
                wu.ApiType.NeedUpdateContact,
                function(res){
					if(!res){return false;}//总数获取失败不需要提示 会在获取待更新详细信息里提示
                    if(res.UpdatedContactsNum > 0){
                        _this.sum = res.UpdatedContactsNum;
                        $("#updateCount").text(_this.sum);
                        $("#updateCountOnBtn").text('(' + _this.sum + ')');
                        _this.queryUpContactInfo(1,_this);//解决不同步问题。
						$("#UpdateContacts").show();
                    }
					
					if(res.UpdatedContactsNum<=0){
						$("#noUpdateContacts").show();
					}
                });
            }catch(e){
				 _this.logger.error("待更新联系人总数queryUpdateCount异常" + e );
            }   
	},
    /**
     * 设置更新前信息
     * @parma {}oldinfo
     * */
	setOldInfo:function(oldInfo){
       var sexSelect =["男","女","保密"];//0-男，1--女-2--保密
       var trStr = "";
           $.each(oldInfo,function(k,v){
             switch(k){
                 case "AddrFirstName":
                         $("#oldName").html(v).show();
                         $("#updataUserName").html(v);
                         break;
                 case "ImageUrl":
                         setImg("oldUserImg",v);
                         $("#oldUserImg").show();
                         break;
                 default:
                         if(v && UpdateContacts.contactsInfoFiled[k]){
                             if (k == "FamilyEmail" || k == "BusinessEmail" || k == "MobilePhone" || k == "BusinessMobile") {
                                 trStr = '<tr><td class="td1">' + UpdateContacts.contactsInfoFiled[k] + '</td><td>' + htmlEncode(v) + '</td></tr>';
                                 $(trStr).appendTo($("#oldInfoTable"));
                             }
                         }
                         break;
             }     
     });
                     
    },
    /**
     *设置更新后信息
     *param{}newInfo 
     */
    setNewInfo:function(oldInfo,newInfo){
        $.each(newInfo,function(i,n){
            switch(i){
                case "AddrFirstName":
                          $("#AddrFirstName").val($T.Html.decode(oldInfo[i])).show();
                         break;
                 case "ImageUrl":
                          setImg("newUserImg",oldInfo[i]);
                          $("#newUserImg").show();
                          if(n){
                              $("#newImgVal").val(oldInfo[i]);
                          }
                         break;
                 default:
					 var el = "#" + i;
					 var ppel = $(el).parent().parent();
					 if (n && UpdateContacts.contactsInfoFiled[i] && (i == "FamilyEmail" || i == "BusinessEmail" || i == "MobilePhone" || i == "BusinessMobile")) {
					     $(el).val($T.Html.decode(n));
						 ppel.show();
					 } else {
						 ppel.hide();
					 } 
					 break;
            }         
     });
    },
	/**
	@查询待更新联系人信息接口
	@param:
	@reutrn:
	*/
	queryUpContactInfo: function(page,context){
        var _this = context || this; //在queryContent回调里调用时设置回调作用域
	    var param = new wu.QueryDetailParams();
            param.UserNumber = _this.getUid();
            param.Page = page || 1; //翻页
            param.Record = 1; 
            try{
                wu.Service.ProcessData(
                param,
                wu.ApiType.NeedUpdateContactDetail,
                function (result) {  
                    if(!result || result.ResultCode!=0 ||!result.ContactsInfo){
                        top.FF.alert(UpdateMsg["getInfo_erro"]);//提示获取更新资料失败
                        return false;
                    }
                    var data = result.ContactsInfo;
                    _this.count++;
                    $("#nowupdateCount").text(_this.count);
                  
                    var textstr = _this.sum == _this.count ? "更新" : "更新，下一个";
                    $("#labelMergeAndGoToNext").text(textstr);
                    $("#updateIgnoreBtn").css("display","");
                 
                    $("#SerialId").val(data.SerialId);
                 
                    //显示更新前联系人信息
                    var oldInfo = data.OldInfo;
                    if(!oldInfo){return false;}
                    _this.setOldInfo(oldInfo);
                     
                    //显示更新后联系人信息
                    var newInfo = data.NewInfo;
                    if(!newInfo){return false;}
                    _this.setNewInfo(oldInfo,newInfo);
                     
                    //变更显示蓝色
                    var requeriedFiled =["FamilyEmail","MobilePhone","BusinessEmail","BusinessMobile"];
                    for(var j=0; j < requeriedFiled.length; j++){
                        var iblueEl = $("#"+requeriedFiled[j]);
                        if($.trim(oldInfo[requeriedFiled[j]]) == $.trim(newInfo[requeriedFiled[j]])){
                            iblueEl.removeClass("iblue");  
                        }else{
                            iblueEl.addClass("iblue");  
                         }
                     }
                     
                    //举报设置
                    _this.ReportedSid = data.SerialId;
                    _this.ContactMethod = data.ContactMethod;
                    _this.RelatedAccount = data.RelatedAccount;
               
                    _this.reportImage = newInfo.ImageUrl;
                    var reported = data.ReportOrNot;
                    
                    //默认图片不举报
                   
					/*if(!hasImg(_this.reportImage)){
                        $("#reportImg").hide().next().hide();
                    }else{
                        //判断是否已举报
                        if(reported == 1){
                            $("#reportImg").hide().next().show();
                        }else{
                            $("#reportImg").show().next().hide();
                        }
                    }*/
                    
                }
            );    
           }catch(e){
               _this.logger.error("待更新联系人queryUpContactInfo异常" + e );
            } 
	},
	
	/**
	@更新单个联系人接口 点击左下角的“更新，处理下一个”时
	@param:
	@reutrn:
	*/
	mergeAndGoToNext: function(){
        var _this = this;
            _this.updateEditData(); //获取提交数据
      
        //手机和邮箱两个必须有一个并非两个都必填，所以不能限死，只能判断两个都为空的时候给提示 7.17
        if(IsEmpty(UpdateContacts.gContactsDetails.AddrFirstName) && IsEmpty(UpdateContacts.gContactsDetails.MobilePhone)){
            top.FF.alert(PageMsg.error_mainAddrEmpty);
        }
        if(!ValidateData(UpdateContacts.gContactsDetails)){ return false;}
      
        var param = new wu.SaveIncrimentParams();
            param.UserNumber = _this.getUid();
          
        //SaveIncrimentParams的嵌套对象（xml中的集合）
        var item = new wu.SaveIncrimentParamsItem();
            //必填字段
            item.SerialId = UpdateContacts.gContactsDetails.SerialId;
            item.AddrFirstName = encodeXML(UpdateContacts.gContactsDetails.AddrFirstName);
          
            //选填字段 对输入字段进行专业XML内容不能对空格进行转义，所以要使用encodeXML不能用htmlEncode
            item.FamilyEmail = encodeXML(UpdateContacts.gContactsDetails.FamilyEmail) || '';
            item.MobilePhone = encodeXML(UpdateContacts.gContactsDetails.MobilePhone) || '';
            item.ImageUrl = UpdateContacts.gContactsDetails.ImageUrl|| '';
            item.FamilyEmail =  encodeXML(UpdateContacts.gContactsDetails.FamilyEmail) || '';
            item.FamilyPhone =  encodeXML(UpdateContacts.gContactsDetails.FamilyPhone) || '';
            item.UserSex = UpdateContacts.gContactsDetails.UserSex || '';
            item.Birday =  UpdateContacts.gContactsDetails.Birday || '';
            item.OtherIm =  encodeXML(UpdateContacts.gContactsDetails.OtherIm) || '';
            item.HomeAddress =  encodeXML(UpdateContacts.gContactsDetails.HomeAddress) || '';
            item.CPName =  encodeXML(UpdateContacts.gContactsDetails.CPName) || '';
            item.UserJob =  encodeXML(UpdateContacts.gContactsDetails.UserJob) || '';
            item.BusinessEmail =  encodeXML(UpdateContacts.gContactsDetails.BusinessEmail) || '';
            item.BusinessMobile =  encodeXML(UpdateContacts.gContactsDetails.BusinessMobile) || '';
            item.BusinessPhone =  encodeXML(UpdateContacts.gContactsDetails.BusinessPhone) || '';
            item.CPAddress =  encodeXML(UpdateContacts.gContactsDetails.CPAddress) || '';
            item.CPZipCode =  encodeXML(UpdateContacts.gContactsDetails.CPZipCode) || '';
            param.ContactInfos.push(item);
            try{
                wu.Service.ProcessData(
                param,
                wu.ApiType.SaveIncrementalUpdatedInfo,
                function(res){

                    if(!res || res.ResultCode != 0) {
                        var msg = {
                            "21":  "更新失败，联系人数量已达上限",

                            "85": "生日格式不正确或是未来时间",

                            "224": "手机号码已存在",
                            "225": "商务手机已存在",
                            "226": "电子邮箱已存在",
                            "227": "商务邮箱已存在",

                            "12820": "手机号码格式不正确，请输入3-20位数字",
                            "12821": "商务手机格式不正确，请输入3-20位数字",

                            "12823": "电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
                            "12824": "商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位",

                            "12826": "常用固话格式不正确，请输入3-30位数字、-",
                            "12827": "公司固话格式不正确，请输入3-30位数字、-",

                            "12830": "传真号码话格式不正确，请输入3-30位数字、-",
                            "12833": "飞信号格式不正确，请输入3-30位数字、-",
                            "12834": "公司邮编格式不正确，请输入3-10位字母、数字、-或空格"
                        }[res.ResultCode];

                        top.FF.alert(msg || ErrorMsg["fail_update"]);//提示更新失败
                        return false;
                    }

                    _this.deal++;
                    
                    //更新缓存
                    var updataParam = {
                        info:UpdateContacts.gContactsDetails
                    }
                    top.Contacts.updateCache("EditContactsDetails",updataParam);
                    
                    $("#divOtherMessage").text(UpdateMsg["count_tip"].replace("$count$",_this.count)).show();
                    
                    if(_this.sum > _this.count){
                        _this.updateContatsInfo(); //合并完成一个的时候更新页面信息 
                        
                    }else{
                        top.FF.alert(UpdateMsg["deal_succ"].replace("$deal$",_this.deal),_this.goHomePage);
                    }

                    if(top.$Addr){
                        var master = top.$Addr;
                        master.trigger(master.EVENTS.LOAD_MODULE, {
                            key: 'events:contacts',
							actionKey: '320'
                        }); 
						
						setTimeout(function(){
							master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getUpdateData'});
						}, 1000);						
                    }

                });
            }catch(e){
               _this.logger.error("待更新联系人总数mergeAndGoToNext异常" + e );
          }
	     
	},
	
	/**
	@更新全部联系人接口
	@param:
	@reutrn:
	*/
	mergeAll: function(){
        var _this = this;
        function merge(){
            top.M139.UI.TipMessage.show("正在更新...");
            var param = new wu.SaveAllParams();
                param.UserNumber = _this.getUid();
            try{
                wu.Service.ProcessData(
                    param,
                    wu.ApiType.SaveAllUpdatedInfoResp,
                    function(res){
                        if(!res || res.ResultCode!=0){
                            top.FF.alert(ErrorMsg["fail_update"]);//提示更新失败
                            return false;
                         }
                        //top.Contacts.reload()//刷新联系人
                        top.$App.trigger("change:contact_maindata")
						top.M139.UI.TipMessage.hide();
                         
                        var dealNum = Number(_this.sum)-Number(_this.deletNum);
                        top.FF.alert(UpdateMsg["deal_succ"].replace("$deal$",dealNum),_this.goHomePage);

                        if(top.$Addr){
                            var master = top.$Addr;
                            master.trigger(master.EVENTS.LOAD_MODULE, {
                                key: 'events:contacts',
								actionKey: '321'
                            });
							
							setTimeout(function(){
								master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getUpdateData'});
							}, 1000);                           
                        }
                    });
                    
            }catch(e){
                 _this.logger.error("待更新联系人总数mergeAll异常" + e );
            }
     }
    
     top.FF.confirm(UpdateMsg["update_all"],merge);  
	},
	/**
	@返回通讯录
	@param:
	@reutrn:
	*/
	
   goHomePage:function(){ 
        setTimeout(function() {
            if(top.$Addr){                
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);		
	},
	
	/**
	@跳过更新此联系人接口
	@param:
	@reutrn:
	*/
	goToNextEvent: function(){
        var _this = this;
        $("#divOtherMessage").text(UpdateMsg["ignore_tip"].replace("$count$" ,_this.count )).show();
      
        if(_this.count == _this.sum){
            if(_this.deal>0){
                 top.FF.alert(UpdateMsg["ignore_deal_tip"].replace("$deal$" , _this.deal),_this.goHomePage);
            }else{
                top.FF.alert(UpdateMsg["ignore_gohomepage"],_this.goHomePage);
            }
        }else{
            _this.updateContatsInfo();
        }
	  
	},
	/**
	 * 当用户手动编辑了信息时更新已修改信息
	 */
	updateEditData:function(){
        //必须通过去input的值来给gContactsDetails赋值，因为联系人信息是可编辑的
        //必须取所以字段 否则隐藏字段的值会继续传到下个联系人信息里.filter(":visible");
        var inputAareEl = $("#newArea").children().find(":input");
		var inputId="";
		$.each(inputAareEl,function(){
			inputId =$(this).attr("id"); 
			UpdateContacts.gContactsDetails[inputId] = $("#"+inputId).val();
		});
        
        //name字段用于验证
        UpdateContacts.gContactsDetails["name"] = UpdateContacts.gContactsDetails["AddrFirstName"];
        UpdateContacts.gContactsDetails["ImageUrl"] = $("#newImgVal").val();
        UpdateContacts.gContactsDetails["SerialId"] = $("#SerialId").val();
        if($("#birthDay").parent().parent().is(":visible")){
            UpdateContacts.gContactsDetails["Birday"] = UpdateContacts.birthDay.getDateString();
        }
        
        if($("#UserSex").parent().parent().is(":visible")){
            UpdateContacts.gContactsDetails["UserSex"] = GetSex();
        }
    },
    
    //清空上一个待更新联系人信息
    updateContatsInfo:function(){
        var _this =this;
        
        //先清空上个联系人更新前信息
        if ($("#oldInfoTable").children()) {
            $("#oldInfoTable").children().remove();
        }
  
        //重置更新后联系人信息 hidden字段没法用reset必须手动清空
        document.getElementById("newInfoForm").reset();
		$("#newImgVal").val("");
		$("#SerialId").val("");
        
        //生日 和性别是组装字段 所以也必须手动清空 没必要delete
        UpdateContacts.gContactsDetails["UserSex"] = '';
        UpdateContacts.gContactsDetails["Birday"] = '';
        
        //records：分页参数 当有联系人被更新或者不再提示时 查询总数在变化 所以分页总数需随查询总数进行变化 当前人数加1还要减去已更新的人数（已更新+不在提示）
        var records = Number(_this.count) + 1 - Number(_this.deal) - Number(_this.deletNum);
        var page =  records? records : 1;       
        _this.queryUpContactInfo(page);
    },
    //不再提示
   neverPrompt: function(){
        var _this = this;
        function noprompt(){
            top.addBehaviorExt({actionId:101610,thingId:0,moduleId:14});
            var param = new wu.NeverPromptParams();
                param.UserNumber = _this.getUid();
                param.SerialId = $("#SerialId").val();
            try{
                wu.Service.ProcessData(
                    param,
                    wu.ApiType.NoRromptInfo,
                    function(res){
                        if(!res || res.ResultCode!=0){
                            top.FF.alert(UpdateMsg["sys_busy"]);//提示系统繁忙
                            return false;
                        }
                        _this.deletNum++ ;
                        if(_this.sum > _this.count){
                            _this.updateContatsInfo();
                            return false; 
                        }
                         
                        if(_this.deal>0){
                             top.FF.alert(UpdateMsg["ignore_deal_tip"].replace("$deal$" , _this.deal),_this.goHomePage);
                        }else{
                             _this.goHomePage();
                        }
                         
                    });
                    
                }catch(e){
					_this.logger.error("待更新联系人总数neverPrompt异常" + e );
                }
     }
     top.FF.confirm(UpdateMsg["no_prompt_update"],noprompt);  
    }, 
    //头像举报
    reportImg: function(){
        //行为日志
        if(!this.ContactMethod){return;}
        var param = "account=" + encodeURIComponent(this.ContactMethod) + "&mobile=" 
                    + this.RelatedAccount + "&reportImg=" + encodeURIComponent(UpdateContacts.reportImage)
                    + "&ReportedSid=" +  encodeURIComponent(UpdateContacts.ReportedSid);
        var url = "addr/addr_report.html?" + param;
            top.FloatingFrame.open("举报", url, 440, 250, true);
    },
    initReportPage: function(){
        this.bindReportEvent();
        //获取传递参数 账号 手机 图片地址  
        this.ContactMethod = decodeURIComponent(this.getUrlPrama("account",window.location.href));
        this.RelatedAccount = this.getUrlPrama("mobile",window.location.href);
        this.reportImage = decodeURIComponent(this.getUrlPrama("reportImg",window.location.href));
        this.ReportedSid = decodeURIComponent(this.getUrlPrama("ReportedSid",window.location.href));
        $("#reportUser").text(this.ContactMethod);
      
    },
    //举报提交
    reportSubmit:function(){
		var _this =this;
        var reportTypeEl = $("#reportType").find(":checkbox");
        var checkboxlen = reportTypeEl.length;
        var checkedValues =[];
        for(var i=0; i<checkboxlen; i++){
            checkedValues[i] = reportTypeEl[i].checked? reportTypeEl[i].value : "0";
        }
        var ReportType =checkedValues.join(""); 
        if(ReportType ==UpdateMsg["no_report_type"]){
            $("#chooseReportType").show();
            return false;
        }
        
        var reportInfo = $("#describeReport").val();
            reportInfo =  reportInfo !=UpdateMsg["report_default_des"]? reportInfo :"" ;

        var param = new wu.SaveAllParams();
            param.UserNumber = _this.getUid();
            param.ReportedNumber = _this.RelatedAccount;
            param.ReportedSid = _this.ReportedSid;
            param.ImageUrl = _this.reportImage; //图片地址不在这里转义
            param.ReportType = ReportType;
            param.ReportInfo =top.$Xml.encode(reportInfo);
         
        try{
          wu.Service.ProcessData(
            param,
            wu.ApiType.ReportImg,
            function(res){
                if(!res || res.ResultCode!=0){
                   top.FF.alert(UpdateMsg["report_erro"],function(){top.FF.close();});//提示更新失败 
                    return false;
                }
                top.FloatingFrame.setWidth(420,"px");
                top.FloatingFrame.setHeight(130,"px")
                location.href = top.location.protocol + '//' + top.location.host + '/m2012/html/addr/addr_reportsuccess.html';
                var el = top.$('#addr').contents().find('#addr_main').contents().find('#reportImg');
                el.hide().next().show();
            });
            
        }catch(e){
          _this.logger.error("待更新联系人总数reportSubmit异常" + e );
        }
    },
    bindReportEvent:function(){
        //输入框获取焦点 失去焦点时默认值显示控制
        $("#describeReport").focus(function(){
           if ($(this).val() == UpdateMsg["report_default_des"]) {
               $(this).val("");
           }
        });
        $("#describeReport").blur(function(){
          if(IsEmpty($(this).val()) ){
             $(this).val(UpdateMsg["report_default_des"]);
          }
        });
        
        //取消举报
        $("#cancelReport").click(function(){
			top.FF.close();//关闭弹出窗口
         });
         
         //举报
         $("#reportSubmit").click(function(){
            top.addBehaviorExt({actionId:101617,thingId:0,moduleId:14});
            UpdateContacts.reportSubmit();
         });
         //举报类型选择框事件
         $("#reportType").find(" :checkbox").click(function(){
            $("#chooseReportType").hide();
         });
	
    }
    
}; 

//验证数据合法性
function ValidateData(gContactsDetails){
    var c = new top.ContactsInfo();   
    for(var i in gContactsDetails){
        if (typeof(gContactsDetails[i]) =='string') c[i] = gContactsDetails[i];
    }
    var r = c.validateDetails();
    if(r.success){
        return true;
    }else{
        r.errorProperty = IsEmpty(r.errorProperty) ? "" : r.errorProperty;
        switch($.trim(r.errorProperty.toLowerCase())){
            case "name":
                top.FF.alert(r.msg,function(){
                    $("#AddrFirstName").focus();
                });
                break;
            case "familyemail":
               top.FF.alert(r.msg,function(){
                    $("#FamilyEmail").focus();
                });
                break;
            case "businessemail":
                 top.FF.alert(r.msg,function(){
                    $("#BusinessEmail").focus();
                });
                break;
			case "familyphone":
                   top.FF.alert(PageMsg['warn_fieldFamilyPhone'],function(){//此处r.msg="电话号码格式不正确"要替换为"常用固话格式不正确“
                    $("#FamilyPhone").focus();
                });
                break;
            case "zipcode":
                gContactsDetails.ZipCode = "";return true;
                break;
            case "cpzipcode":
               top.FF.alert(r.msg,function(){
                      $("#CPZipCode").focus();
                });
                break;
            default:
                    top.FF.alert(r.msg);
                    break;
        }
        return false;
    }
}

function IsEmpty(code) {
    if(typeof(code) == "undefined" || code == null || code.length == 0) return true;
    return false;
}

function GId(id){
    return document.getElementById(id);
}


function setImg(imgEl,imgUrl){
	GId(imgEl).src =getContactImage(imgUrl);
}
function hasImg(imgurl){
	
     //var sysImgPath = ["/system/nopic.jpg","/photo/nopic.jpg","/images/face.png","/addr/apiserver/"];
     var sysImgPath = ["/system/nopic.jpg","/photo/nopic.jpg","/images/face.png"];
	 var lowerImgUrl = imgurl.toLowerCase();
    // if (!IsEmpty(imgurl) && lowerImgUrl.indexOf(sysImgPath[1])<0 && lowerImgUrl.indexOf(sysImgPath[0])< 0 && lowerImgUrl.indexOf(sysImgPath[2])<0&& lowerImgUrl.indexOf(sysImgPath[3])<0 ) {
     if (!IsEmpty(imgurl) && lowerImgUrl.indexOf(sysImgPath[1])<0 && lowerImgUrl.indexOf(sysImgPath[0])< 0 && lowerImgUrl.indexOf(sysImgPath[2])<0) {
         return true;
     }else{
         return false;
     }
}
function getContactImage(imgurl){
       var result='';
       if(hasImg(imgurl)){
            imgurl = imgurl.replace('upload', 'Upload');
            imgurl = imgurl.replace('photo', 'Photo');
           result= (new top.M2012.Contacts.ContactsInfo({ImageUrl: imgurl})).ImageUrl;
       }else{
           result= top.resourcePath + "/images/face.png";
       }
	   return result;
    }
//获取性别
function GetSex(){ 
    if(GId("UserSex"+"0").checked) return GId("UserSex"+"0").value;
    if(GId("UserSex"+"1").checked) return GId("UserSex"+"1").value;
    if(GId("UserSex"+"2").checked) return GId("UserSex"+"2").value;
}

//设置联系人性别 0- 男 1- 女 2- 保密
function SetContactSex(sex){
    switch(parseInt(sex,10)){
    case 0:
        GId("UserSex0").checked = true;
        break;
    case 1:
        GId("UserSex1").checked = true;
        break;
    default:
        GId("UserSex2").checked = true;
        break;
    }
}

