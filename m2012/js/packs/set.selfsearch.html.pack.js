


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
﻿
//开始 view.js
;(function(M139, Backbone, _, MiniQuery)
{

//链接模块，提供跳转
var Links = M139.Core.namespace('M2012.Set.SelfSearch.Links',
{
    //城市显示有错误反馈
    feedback: function()
    {
        var url = top.getDomain('uec') + '/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=' + top.sid;
        window.open(url);
        return false;
    }
});


//登录历史模块
var LoginHistoryView = (function()
{
    var div = document.getElementById('divLoginHistory');
    var samples = 
    {
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.LoginHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(div.innerHTML, '<!--table', 'table-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
        
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
    
})(); //结束 LoginHistoryView 模块的定义

//邮件删除历史模块
var MailDeleteHistoryView = (function()
{
    var div = document.getElementById('divMailDeleteHistory');
    var samples = 
    {
        original: div.innerHTML,
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.MailDeleteHistoryModel;
    
    function render(index)
    {
        index = index || 0;
        

        
        Model.getList(index, function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(samples.original, '<!--table', 'table-->', html);
            
            $(div).find('p>a').each(function(i)
            {
                var a = this;
                $(a).click(function()
                {
                    render(i);
                }).toggleClass('current', i==index);
            });
            
            show();
            
        });
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
    
})(); //结束 MailDeleteHistoryView 模块的定义

//邮件代收历史模块
var MailAgentHistoryView = (function()
{
    var div = document.getElementById('divMailAgentHistory');
    var samples = 
    {
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.MailAgentHistoryModel;
    var hasRendered = false ; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                        
                    }).join('')
                });
                
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(div.innerHTML, '<!--table', 'table-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
})(); //结束 MailAgentHistoryView 模块的定义

//密码修改历史模块
var PasswordModifyHistoryView = (function()
{
    var div = document.getElementById('divPasswordModifyHistory');
    var samples = 
    {
        original: div.innerHTML,
        table: $.String.between(div.innerHTML, '<!--table.data', 'table.data-->'),
        nodata: $.String.between(div.innerHTML, '<!--table.nodata', 'table.nodata-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.PasswordModifyHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            if( !list || !list.length )
            {
                nodata();
                return;
            }
            
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(samples.original, '<!--table.data', 'table.data-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function nodata()
    {
        div.innerHTML = $.String.replaceBetween
        (
            samples.original, 
            '<!--table.nodata', 
            'table.nodata-->', 
            samples.nodata
        );
                
        hasRendered = true; //指示已经呈现过
        show();
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
})(); //结束 PasswordModifyHistoryView 模块的定义

var VolumeDoubleHistoryView = (function(){
    var div = document.getElementById('divVolumeDoubleHistoryView');
    var base = 25;
    function getVL(key){
        var key = 0 | key.slice(0,-1);
        key = 0 | (key>1?key:1);
        var len = base * key;
        if(len < 600){
            return base * key + 'px';
        }else{
            return 600 + 'px'
        }
        


    }
    var templateItem = ['<li class="userdouble">',
            '<div class="time"><span>{time}</span></div>',
            '<div class="datewarp" style="width:{length};"></div>',
            '<span class="datenum">{volume}</span>',
        '</li>'].join("");
    
    var Model = M2012.Set.SelfSearch.VolumeDoubleHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            if( !list || !list.length ){
                nodata();return;
            }   
            var max = 0    
            for(var i=0; i<list.length; i++){
                var now = list[i].totalCapacity.slice(0,-1);
                now = 0| now;
                if(now>max) max = now;
            }
            if(max>16){
                base = 0 | (25/(max/16));
                base = base?base:1;
            }

            var html = _.map(list, function(item){
                return $.String.format(templateItem, {
                    time: item.updateTime,
                    volume: item.totalCapacity,
                    length: getVL(item.totalCapacity)
                });
            }).join("");
            $(div).find('ul').html(html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function nodata()
    {
        var noDataTips = '<p class="userdoublenodate-text">您目前还没有翻倍记录</p>';
        $(div).find('ul').replaceWith(noDataTips).end();           
        $('#thVolumeDouble').hide();     
        hasRendered = true; //指示已经呈现过
        show();
    }
    
    function hide(){
        $(div).addClass('hide');
    }
    
    function show(){
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };

})();//结束 VolumeDoubleHistoryView 模块的定义


//分类 tab 模块，主视图
var Tabs = M139.Core.namespace('M2012.Set.SelfSearch.Tabs', (function()
{
    var ul = document.getElementById('ulTabs');
    var sample = $.String.between(ul.innerHTML, '<!--', '-->');
    var currentIndex = -1;
    
    var list = 
    [
        { name: '登录查询', view: LoginHistoryView },
        { name: '删信查询', view: MailDeleteHistoryView },
        { name: '代收邮件查询', view: MailAgentHistoryView },
        { name: '用户密码修改', view: PasswordModifyHistoryView},
        { name: '用户容量翻倍查询', view: VolumeDoubleHistoryView}
    ];
    
    
    function render()
    {
        ul.innerHTML = $.Array.map(list, function(item, index)
        {
            return $.String.format(sample, $.Object.extend(
            {
                index: index
            }, item) );
            
        }).join('');
    }
    
    //切换 tab
    function click(index, a)
    {   
        if(index == currentIndex) //避免重复点击
        {
            return;
        }
        
        //高亮当前 tab
        var anchors = $.Array.parse( ul.getElementsByTagName('a') );
        a = a || anchors[index];
        
        $( anchors[currentIndex] ).removeClass('current'); //把之前高亮的项去掉
        currentIndex = index;
        $(a).addClass('current');
        
        
        //呈现对应模块的数据视图
        $.Array.each(list, function(item, i)
        {
            var v = item.view;
            if( !v ) //安全起见
            {
                return;
            }
            
            if(i == index)
            {
                v.render();
            }
            else
            {
                v.hide();
            }
        });
        
    }
    
    return {
        render: render,
        click: click
    };
    
})() ); //结束 Tabs 模块的定义



//开始
(function()
{
    Tabs.render();
    var indexDaiShou = M139.Text.Url.queryString("type");
    if(indexDaiShou !=null){
        Tabs.click(indexDaiShou);
        return;
    }
    Tabs.click(0);
    
})();




})(M139, Backbone, _, MiniQuery);
//结束 view.js
