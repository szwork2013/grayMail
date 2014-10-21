


//开始 model.js
;(function(M139, Backbone, _)
{

MiniQuery.use('$'); 


//对 M139.RichMail.API 的进一步封装，以调用方式更加友好方便
var CGI = 
{
    call: function(url, data, fnSuccess, fnFail, fnError)
    {
        //此时调用方式为 CGI.call(url, fnSuccess, fnFail, fnError)
        if(typeof data == 'function') 
        {
            //依次从后面修正参数引用关系
            fnError = fnFail;
            fnFail = fnSuccess;
            fnSuccess = data;
            data = {};    
        }
        
        
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
    
};//结束 CGI 的定义


//建立起以邮箱地址索引用户姓名的映射表
var Contacts = (function()
{
    //建立起以邮箱地址索引用户姓名的映射表
    var email_usernames = 
    {
        // 'email': 'username'
    };
    
    $.Array.each( top.Contacts.data.contacts, function(item, index)
    {
        $.Array.each( item.emails, function( email, i)
        {
            email_usernames[ email ] = item.name;
        });
    });
    
    //for test
//    email_usernames['wuyanzi@hmg1.rd139.com'] = '张三';
//    email_usernames['15989437324@hmg1.rd139.com'] = '李四';
//    email_usernames['guangdong20yuan@hmg1.rd139.com'] = '王五';
    
    
    return email_usernames;
    
})(); //结束 Contacts 模块的定义


//登录历史模块
var LoginHistoryModel = M139.Core.namespace('M2012.Set.SelfSearch.LoginHistoryModel', (function()
{
    var list = [];
    
    var types = 
    {
        1: '网页登录',
        2: '手机登录'
    };
    
    //对数据进行转换：以日期进行聚合，并添加填充所需要的字段
    function transform( list )
    {
        //转成以日期进行分组的 key:value 形式，即 {日期: []}
        var obj = $.Array.aggregate( list, function(item, index)
        {
            return $.Date( item['loginDate'] ).toString('yyyy-MM-dd');
            
        }, function(item, index)
        {
            return $.Object.extend(
            {
                time: $.Date( item['loginDate'] ).toString('HH:mm:ss'),
                typeName: types[ item.type ] || types[1]
                
            }, item);
        } );
        
        //转成数组：[ [日期, [记录]], ... ]
        return $.Object.toArray( obj, true );
    }
    
    
    function getList(fn)
    {
        if(list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( list );
            return;
        }
        
        //从 CGI 加载
        CGI.call('user:loginHistory', function(json) //成功
        {
            var data = json['var'] || [];
            list = transform( data );
            fn && fn(list);
            
        }, function(code, json) //错误
        {
            
        }, function() //失败
        {
            
        });
    }
    
    return {
        getList: getList
    };
    
})() ); //结束 LoginHistoryModel 模块的定义


//删除邮件历史模块
var MailDeleteHistoryModel = M139.Core.namespace('M2012.Set.SelfSearch.MailDeleteHistoryModel', (function()
{
    var list = [];
    
    var types = 
    {
        1: '系统邮件自销毁',
        2: '客户端软件删信',
        3: '手动删信'
    };
    
    //页面中的按钮所对应的 type 值
    var index_types = 
    {
        0: 0,   //全部
        1: 3,   //手动删除
        2: 2,   //客户端软件删信
        3: 1    //系统邮件自销毁
    };
    
    
    //对数据进行转换：以日期进行聚合，并添加填充所需要的字段
    function transform( list )
    {
        //转成以日期进行分组的 key:value 形式，即 {日期: []}
        var obj = $.Array.aggregate( list, function(item, index)
        {
            return $.Date( item['deleteTime'] ).toString('yyyy-MM-dd');
            
        }, function(item, index)
        {
            item["sender"] = $TextUtils.htmlEncode(item["sender"]);
            item["subject"] = $TextUtils.htmlEncode(item["subject"]);
            return $.Object.extend( {}, item,
            {
                time: $.Date( item['deleteTime'] ).toString('HH:mm:ss'),
                typeName: types[ item.type ] || types[1],
                shortSender: $TextUtils.htmlEncode(Contacts[item.sender]) || item.sender.split('@')[0],
                shortSubject: getSubject(item.subject, item.deleteCount)
            });
        } );
        
        //转成数组：[ [日期, [记录]], ... ]
        return $.Object.toArray( obj, true );
    }
    
    //处理主题显示
    function getSubject(subject, count)
    {
        var max = 26;
        if(subject.length > max)
        {
            subject = subject.slice(0, max) + '…';
        }
        
        if(count > 1)
        {
            subject = $.String.format('{0} 等{1}封', subject, count);
        }
        
        return subject;
    }
    
    function getList(index, fn)
    {
        var type = index_types[index];
        
        if(list.length > 0)
        {
            fn && fn( filter(type) );
            return;
        }
        
        CGI.call('user:mailDeleteHistory', function(json)
        {
            var data = json['var'] || [];
            list = transform( data );
            fn && fn( filter(type) );
        });
    }
    
    //过滤出指定的删信类型：
    //当类型指定为 0 时，表示不过滤
    function filter(type)
    {
        return type == 0 ? list : $.Array.map(list, function(item, index)
        {
            // list 中的每一项都是一个以日期进行聚合了的数组，
            // 即第 0 个元素表示日期，第 1 个元素表示该日期所关联的记录：
            // item = [ '日期', [记录0, 记录1, ...] ]
            
            var date = item[0];     //日期
            var records = item[1];  //列表
            
            records = $.Array.grep(records, function(item, index)
            {
                return item.type == type;
            });
            
            //过滤后如果有记录，则按之前的格式返回；否则删除该项
            return records.length > 0 ? [ date, records ] : null;
            
        });
    }
    

    
    return {
        getList: getList
    };
    
})()); //结束 MailDeleteHistoryModel 的定义


//代收邮件历史
var MailAgentHistoryModel = M139.Core.namespace('M2012.Set.SelfSearch.MailAgentHistoryModel', (function()
{
    var list = [];
    
    var types = 
    {
        0: '手动收取',
        1: '自动收取'
    };
    
    
    //对数据进行转换：以日期进行聚合，并添加填充所需要的字段
    function transform( list )
    {
        //转成以日期进行分组的 key:value 形式，即 {日期: []}
        var obj = $.Array.aggregate( list, function(item, index)
        {
            return $.Date( item['popDate'] ).toString('yyyy-MM-dd');
            
        }, function(item, index)
        {
            return $.Object.extend(
            {
                time: $.Date( item['popDate'] ).toString('HH:mm:ss'),
                typeName: types[ item.type ] || types[1],
                
                //代收结果的文本显示
                resultDescription: 
                    Number(item.count) > 0 ? 
                        $.String.format('{count}封', item) : 
                    item.result == 0 ? 
                        '没有可收取的邮件' : 
                        '代收失败'
                
            }, item);
        } );
        
        //转成数组：[ [日期, [记录]], ... ]
        return $.Object.toArray( obj, true );
    }
    
    
    function getList(fn)
    {
        if(list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( list );
            return;
        }
        
        //从 CGI 加载
        CGI.call('user:popAgentHistory', function(json) //成功
        {
            var data = json['var'] || [];
            list = transform( data );
            fn && fn(list);
            
        }, function(code, json) //错误
        {
            
        }, function() //失败
        {
            
        });
    }
    
    return {
        getList: getList
    };
    
    
})() ); //结束 MailAgentHistoryModel 模块的定义


//密码修改历史模块
var PasswordModifyHistoryModel = M139.Core.namespace('M2012.Set.SelfSearch.PasswordModifyHistoryModel', (function()
{
    var list = [];
    
    //对数据进行转换：以日期进行聚合，并添加填充所需要的字段
    function transform( list )
    {
        //转成以日期进行分组的 key:value 形式，即 {日期: []}
        var obj = $.Array.aggregate( list, function(item, index)
        {
            return $.Date( item['modifyTime'] ).toString('yyyy-MM-dd');
            
        }, function(item, index)
        {
            return $.Object.extend(
            {
                time: $.Date( item['modifyTime'] ).toString('HH:mm:ss')
                
            }, item);
        } );
        
        //转成数组：[ [日期, [记录]], ... ]
        return $.Object.toArray( obj, true );
    }
    
    
    function getList(fn)
    {
        if(list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( list );
            return;
        }
        
        //从 CGI 加载  
        CGI.call('user:passwordModifyHistory', function(json) //成功
        {
            var data = json['var'] || [];
            list = transform( data );
            fn && fn(list);
            
        }, function(code, json) //错误
        {
            
        }, function() //失败
        {
            
        });
    }
    
    return {
        getList: getList
    };
    
    
})() ); //结束 PasswordModifyHistoryModel 模块的定义

//用户容量翻倍查询模块
var VolumeDoubleHistoryModel = M139.Core.namespace('M2012.Set.SelfSearch.VolumeDoubleHistoryModel', (function()
{
    var list = [];
    
    //对数据进行转换：以日期进行聚合，并添加填充所需要的字段
    function transform( list )
    {        
        return list;
    }
    
    
    function getList(fn)
    {
        if(list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( list );
            return;
        }
        
        //从 CGI 加载  
        CGI.call('user:getCapModHist', function(json){         
            var data = json['var'] || [];
            list = transform( data );
            fn && fn(list);            
        });
    }
    
    return {
        getList: getList
    };
    
    
})() ); //结束 VolumeDoubleHistoryView 模块的定义




})(M139, Backbone, _); 
//结束 model.js