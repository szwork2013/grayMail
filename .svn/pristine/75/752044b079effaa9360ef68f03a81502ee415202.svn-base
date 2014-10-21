


;(function(MiniQuery)
{


/***********************************************************************************************************
*   函数工具
*/

MiniQuery.Function = function(fn)
{
    return new MiniQuery.Function.prototype.init(fn);
};

MiniQuery.Object.extend( MiniQuery.Function,
{
    /**
    * 定义一个通用的空函数。
    * 实际使用中应该把它当成只读的，而不应该对它进行赋值。
    */
    empty: function()
    {
    },
    
    /**
    * 把函数绑定到指定的对象上，从而该函数内部的 this 指向该对象。
    * 返回一个新函数。
    */
    bind: function(obj, fn)
    {
        var args = Array.prototype.slice.call(arguments, 2);
        return function()
        {
            var args = args.concat( Array.prototype.slice.call(arguments, 0) );
            fn.apply(obj, args);
        }
    },
    
    /**
    * 间隔执行函数。
    * 该方法用 setTimeout 的方式实现间隔执行，可以指定要执行的次数。
    * 在回调函数中，会接收到当次执行次数。
    */
    setInterval: function(fn, delay, count)
    {
        var next = arguments.callee;
        next['count'] = (next['count'] || 0) + 1;
        
        return setTimeout(function()
        {
            fn(next['count']);
            
            if(count === undefined || next['count'] < count) //未传入 count 或 未达到指定次数
            {
                next(fn, delay, count);
            }
            
        }, delay);

    },
    
    /**
    * 执行函数。
    * 该方法用一个对象和一些键作为参数来执行指定的函数。
    * 当对同一个对象传递多个成员时作为参数时，该方法比较简洁。
    * 比如：
    *   MiniQuery.Function.exec(fn, obj, ['a', 'b', 'c', 'd']) 
    * 等价于：
    *   fn(obj.a, obj.b, obj.c, obj.d)       
    */
    exec: function(fn, obj, keys)
    {
        if(!obj)
        {
            throw new Error('参数 obj 非法');
        }
        
        if( !MiniQuery.Object.isArray(keys) )
        {
            throw new Error('参数 keys 必须是一个数组');
        }
        
        var args = MiniQuery.Array.map(keys, function(key, index)
        {
            return obj[key];
        });
        
        fn.apply(null, args);
    }
    
    
});


MiniQuery.Function.prototype = 
{
    constructor: MiniQuery.Function,
    value: null,
    
    init: function(fn)
    {
        if(typeof fn != 'function')
        {
            throw new Error('参数 fn 不是一个函数');
        }
        
        this.value = fn;
    },
    
    valueOf: function()
    {
        return this.value;
    },
    
    bind: function(obj)
    {
        this.value = MiniQuery.Function.bind(obj, this.value);
        return this;
    },
    
    setInterval: function(delay, count)
    {
        return MiniQuery.Function.setInterval(this.value, delay, count);
    },
    
    exec: function(obj, keys)
    {
        MiniQuery.Function.exec(this.value, obj, keys);
        return this;
    }
    
};

MiniQuery.Function.prototype.init.prototype = MiniQuery.Function.prototype;


 
})(window.M139);