











(function(PageNs)
{


//映射成新的命名空间
M139.Object.namespace(M139,
{
    'Object': '$.Object',   //M139.Object -> $.Object
    'Array': '$.Array',     //M139.Array -> $.Array
    'Boolean': '$.Boolean',
    'Function': '$.Function',
    'Math': '$.Math',
    'String': '$.String'
});
//M139.Object.namespace( $, M139, ['Object', 'Array', 'Boolean', 'Function', 'Math', 'String'] );



//只读变量列表
var ReadOnly = 
{
    sid: top.UserData.ssoSid,       // ssi，或 top.sid 也可以获取到
    domain: top.getDomain('uec')    // 以 / 结束
};



//统计用户的"我要体验"操作
var Statistic = (function()
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
		    async: false, //采用同步方式，发送请求时锁住浏览器
		    dataType: 'json',
		    
		    //统计成功
		    success: function(json)
		    {
		        if( json )
		        {
		            if(json.falg) //注意，后台返回的 falg 拼错了，应该是 flag 的，这里历史原因，适应后台
		            {
		                fnSuccess && fnSuccess();
		            }
		            else
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
    
})(); //结束 Statistic 模块

//------------------------------------------------------------------------------------------------
//超链接模块
var Links = PageNs.Links = 
{
    reload: function()
    {
        top.location.reload();
    },
    
    toUEC: function()
    {
	    var url = M139.Text.Url.makeUrl( ReadOnly.domain + 'indexLoadRedirect.do', 
	    {
	        isdirect: 1,
	        isfirst: 1,
	        nav: 0,
	        sid: ReadOnly.sid
	    });

	    
	    window.open(url);
    }
}; //结束 Links 模块

//------------------------------------------------------------------------------------------------
//请后台 CGI 的封装
var CGI = (function()
{
    function get(url, data, fnSuccess, fnFail, fnError)
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
    
    return {
        get: get
    };
    
})(); //结束 CGI 模块


//------------------------------------------------------------------------------------------------

//开通|关闭器，主要用于"会话模式" 和 "全文检索" 的开通和关闭
var Switcher = (function()
{
    function getParam(item)
    {
        return {
            funcId: item.id,
            status: item.openStatus == 0 ? 1 : 0
        };
    }
    
    function update(item)
    {
        top.$Msg.alert('设置成功');
        
        var id = item['id'];
        var isToOpen = item['openStatus'] == 0; //当前是关闭的，则要开通
        
        item['openStatus'] = isToOpen ? 1 : 0; //已开通，更新本地数据项的状态
        
        $('#ddOpenStatus0_' + id).toggle( !isToOpen );  //已开通，则隐藏
        $('#ddOpenStatus1_' + id).toggle( isToOpen );   //已开通，则显示
        $('#spanRefresh_' + id).toggle( item.isFullTextSearch ); //只针对全文检索
    }
    
    //全文检索
    function toggleFullTextSearch(item)
    {
        CGI.get("user:setAttrs", 
        {
            attrs: 
            {
                fts_flag: item['openStatus'] == 0 ? 1 : 0
            }
            
        }, function(json) //成功
        {
           //再调用体验室的接口 
            CGI.get('uec:status', getParam(item), function(json) //设置成功
            {
                update(item);
                
            }, function(code, json)
            {
                top.$Msg.alert('很抱歉，设置失败');
                
            }, function()
            {
                top.$Msg.alert('很抱歉，设置发生错误');
            });
            
            
        }, function() //失败
        {
            top.FF.alert('全文检索设置失败');
        });
    }
    
    //会话模式
    function toggleSessionMode(item)
    {
        //先调用邮箱的接口
        CGI.get('mbox:setSessionMode', 
        {
            flag: item['releasedStatus'] //要把发布状态传过去
            
        }, function(json) //成功
        {
            //再调用体验室的接口 
            CGI.get('uec:status', getParam(item), function(json) //设置成功
            {
                update(item);
                
            }, function(code, json)
            {
                top.$Msg.alert('很抱歉，设置失败');
                
            }, function()
            {
                top.$Msg.alert('很抱歉，设置发生错误');
            });
            
        }, function() //失败
        {
            top.$Msg.alert('很抱歉，设置发生错误');
        });
    }
    
    
    return {
        toggleFullTextSearch: toggleFullTextSearch,
        toggleSessionMode: toggleSessionMode
    };
    
})(); //结束 Switcher 模块


//------------------------------------------------------------------------------------------------

//功能列表模块
var List = PageNs.List = (function()
{
    var ul = document.getElementById('ulList');
    var sample = $.String.between(ul.innerHTML, '<!--', '-->');
    
    var list = [];
    
    //初始化数据，成功后执行一个回调
    function init(fn)
    {
        if(list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( list );
            return;
        }
        
        CGI.get( M139.Text.Url.makeUrl('/uec/s?func=uec:list',
        {
            requestType: 1,
            sid: ReadOnly.sid
            
        }), {}, function(json) //成功
        {
            var data = json['var'] || [];
            
            list = $.Array.map(data, function(item, index)
            {
                return {
                    index: index,
                    code: item['funccode'],
                    id: item['funcid'],
                    
                    name: item['funcname'],         //名称
                    imgUrl: item['funcimageurl'],   //图片 Url
                    summary: item['funcsummary'],   //简介
                    
                    detailUrl: item['funccontenturl'],                  //详情 Url
                    experienceUrl: $.String.trim( item['funcbtnurl'] ), //体验 Url
                    experienceText: item['funcbtnname'],//我要体验
                    openText: item['funcbtnenable'],    //马上开通
                    openStatus: item['status'],         //开通状态：0:未开通; 1:已开通
                    
                    isOpenType: item['funcbtnurl'] == '', //指示是否为开通类型，只有少数是开通类型的，其他的为体验类型
                    isFullTextSearch: item['funccode'] == 's_fts',  //指示是否为全文检索，特殊类型
                    isSessionMode: item['funccode'] == 's_sessionmode', //指示是否为会话械，特殊类型
                    
                    releasedStatus: item['funcstatus']  //发布状态：0:未发布; 1:已发布

                };
            });
            
            fn && fn(list);
            
        }, function(summary)
        {
            
        }, function()
        {
        });
    }
    
    //填充页面
    function fill()
    {
        init(function()
        {
            ul.innerHTML = $.Array.map(list, function(item, index)
            {
                var hasOpen = //指示是否已开通，只针对开通类开，如会话模式、全文检索
                        item['isOpenType'] && 
                        item['openStatus'] == 1;
                
                return $.String.format(sample, $.Object.extend(
                {
                    img: ReadOnly.domain + 'Uploads' + item['imgUrl'],
                    detailDisplay: item['detailUrl'] ? '' : 'display:none;',
                    
                    buttonText: item['isOpenType'] ? item['openText'] : item['experienceText'],
                    buttonFunction: item['isOpenType'] ? 'doOpen' : 'doExperience',
                    
                    openStatusDisplay0: hasOpen ? 'display:none;' : '',
                    openStatusDisplay1: hasOpen ? '' : 'display:none;'
                    
                    
                }, item) );
                
            }).join('');
            
        });
    }
    
    
    //意见反馈
    function feedback(index)
    {
        var item = list[index];
        
        var url = M139.Text.Url.makeUrl( ReadOnly.domain + 'jumpLabFeedback.do', 
        {
            sid: ReadOnly.sid,
            id: item.id
        });

        
        top.FF.open('用户反馈', url, 550, 520, true, false, false, false);
    }
    

    
    //我要体验
    function doExperience(index)
    {
        var item = list[index];
        
        //先统计用户的"我要体验"操作，成功后再真正进入体验页面
        Statistic.send(item.id, function()
        {
            var url = item.experienceUrl;
            
	        var reg = /((^http)|(^https)|(^ftp)):\/\/(\\w)+\.(\\w)+/;
	        
	        if( reg.test(url) )
	        {
	            window.open(url)
	        }
	        else
	        {
	            location.href = url;
	        }
        });
        
    }
    
    
    //我要开通|关闭
    function doOpen(index)
    {
        var item = list[index];

        if( item.isFullTextSearch ) //全文检索
        {
            Switcher.toggleFullTextSearch(item);
        }
        else if( item.isSessionMode ) //会话模式
        {
            Switcher.toggleSessionMode(item);
        }
        else //其他的
        {
        }
    }
    
    
    return {
        fill: fill,
        feedback: feedback,
        doExperience: doExperience,
        doOpen: doOpen
    };
    
    
})(); //结束 List 模块




//开始
(function()
{
    List.fill();
    
})();
    
    
    
    
})( M139.core.namespace('M2012.Uec.LabMain') );