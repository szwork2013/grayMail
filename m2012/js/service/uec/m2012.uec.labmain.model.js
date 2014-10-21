
  
;(function(M139, Backbone)
{


var API = 
{
    call: function(url, data, fnSuccess, fnFail, fnError)
    {
        M139.RichMail.API.call(url, data, function(res)
        {
            var json = res.responseData;
            
            if(json)
            {
                var code = json['code'];
                
                if(code == 'S_OK') //成功
                {
                    fnSuccess && fnSuccess(json);
                }
                else //失败
                {
                    fnFail && fnFail( code, json );
                }
            }
            else //错误
            {
                fnError && fnError();
            }
           
        });
    }
};

//只读变量列表
var ReadOnly = M139.Core.namespace('M2012.Uec.LabMain.ReadOnly',
{
    sid: top.UserData.ssoSid,       // ssi，或 top.sid 也可以获取到
    domain: top.getDomain('uec')    // 以 / 结束
});


//统计用户的"我要体验"操作
var Statistic = M139.Core.namespace('M2012.Uec.LabMain.Statistic', (function()
{
    function send(id, fnSuccess, fnFail, fnError)
    {
        
		$.ajax(
		{
		    url: ReadOnly.domain + 'FuncUsed.do?sid=' + ReadOnly.sid,
		    data: 
		    {
		        id: id
		    },
		    
		    type: 'post', 
		    dataType: 'json',
		    
		    //当请求完成之后调用这个函数，无论成功或失败。
		    //传入XMLHttpRequest对象，以及一个包含成功或错误代码的字符串。 
		    complete: function(xhr, msg)
		    {
		        if(xhr && xhr.status == 200)
		        {
		            //这里返回的字符串为非标准格式，要用 tryEval 来解析
		            var json = M139.JSON.tryEval(xhr.responseText);
		            
		            if( json && json.falg ) //注意，后台返回的 falg 拼错了，应该是 flag 的，这里历史原因，适应后台
		            {
		                fnSuccess && fnSuccess();
		            }
		            else //失败
		            {
		                fnFail && fnFail();
		            }
		        }
		        else
		        {
		            fnError && fnError();
		        }
		    }
		    
		}); //结束 $.ajax()
    }
    
    return {
        send: send
    };
    
})() ); //结束 Statistic 模块


//开通|关闭器，主要用于"会话模式" 和 "全文检索" 的开通和关闭
var Switcher = M139.Core.namespace('M2012.Uec.LabMain.Switcher', (function()
{
    function getParam(item)
    {
        return {
            funcId: item.id,
            status: item.openStatus == 0 ? 1 : 0
        };
    }
    
    
    //全文检索
    function toggleFullTextSearch(item, fnSuccess, fnFail, fnError)
    {
        API.call("user:setAttrs", 
        {
            attrs: 
            {
                fts_flag: item['openStatus'] == 0 ? 1 : 0
            }
            
        }, function(json) //成功
        {
           //再调用体验室的接口 
            API.call('uec:status', getParam(item), fnSuccess, fnFail, fnError);
            
        }, fnFail, fnError);
    }
    
    //会话模式
    function toggleSessionMode(item, fnSuccess, fnFail, fnError)
    {
        //先调用邮箱的接口
        API.call('mbox:setSessionMode', 
        {
            flag: item['releasedStatus'] //要把发布状态传过去
            
        }, function(json) //成功
        {
            var param = getParam(item);
            
            //再调用体验室的接口 
            API.call('uec:status', param, function() //成功
            {
                //调用邮件列表中的会话模式来更新
                top.$App.setReadMailMode(param.status, fnSuccess, fnFail);
                
            }, fnFail, fnError);
            
        }, fnFail, fnError);
    }
    
    
    return {
        toggleFullTextSearch: toggleFullTextSearch,
        toggleSessionMode: toggleSessionMode
    };
    
})() ); //结束 Switcher 模块




M139.namespace('M2012.Uec.LabMain.Model', Backbone.Model.extend(
{
    initialize: function(data)
    {
        this.list = []; //分配一个数组
    },
    
    getList: function(fn)
    {
        var self = this;
        
        if(self.list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( self.list );
            return;
        }
        var data = {};
        if(this.get("funcId")){
            data={ "funcid": this.get("funcId") }
        }
        
        API.call("uec:list", data, function (json) //成功
        {
            var data = json['var'] || [];
            
            self.list = $.map(data, function(item, index)
            {
                return {
                    index: index,
                    code: item['funccode'],
                    id: item['funcid'],
                    
                    name: item['funcname'],         //名称
                    imgUrl: item['funcimageurl'],   //图片 Url
                    summary: item['funcsummary'],   //简介
                    
                    detailUrl: item['funccontenturl'],          //详情 Url
                    experienceUrl: $.trim( item['funcbtnurl'] ),//体验 Url
                    experienceText: item['funcbtnname'],//我要体验
                    openText: item['funcbtnenable'],    //马上开通
                    openStatus: item['funccode'] == 's_fts' ? (top.$App.getConfig("UserAttrs") && top.$App.getConfig("UserAttrs").fts_flag == 1) : item['status'],         //开通状态：0:未开通; 1:已开通
                    
                    isOpenType: item['funcbtnurl'] == '', //指示是否为开通类型，只有少数是开通类型的，其他的为体验类型
                    isFullTextSearch: item['funccode'] == 's_fts' ,  //指示是否为全文检索，特殊类型
                    isSessionMode: item['funccode'] == 's_sessionmode', //指示是否为会话模式，特殊类型
                    
                    releasedStatus: item['funcstatus']  //发布状态：0:未发布; 1:已发布

                };
            });
            
            fn && fn(self.list);
            
        }, function(code, json) //错误
        {
            
        }, function() //失败
        {
        });
    }
    
    
    
    
}));    
    
    
    
    
    
    
    
    
})(M139, Backbone);