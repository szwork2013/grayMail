


;(function(MiniQuery)
{



/***********************************************************************************************************
*  Boolean 工具
*/

MiniQuery.Boolean = function(b)
{
    return new MiniQuery.Boolean.prototype.init(b);
};



MiniQuery.Object.extend( MiniQuery.Boolean,
{
    /**
    * 解析指定的参数为 boolean 值。
    * null、undefined、0、NaN、false、'' 及其相应的字符串形式会转成 false；
    * 其它的转成 true
    */
    parse: function(arg)
    {
        if(!arg) // null、undefined、0、NaN、false、''
        {
            return false;
        }
        
        if(typeof arg == 'string' || arg instanceof String)
        {
            var reg = /^(false|null|undefined|0|NaN)$/g;
            
            return !reg.test(arg);
        }

        
        return true;
    },
    
    /**
    * 解析指定的参数为 int 值：0 或 1。
    * null、undefined、0、NaN、false、'' 及其相应的字符串形式会转成 0；
    * 其它的转成 1
    */
    toInt: function(arg)
    {
        return MiniQuery.Boolean.parse(arg) ? 1 : 0;
    },
    
    /**
    * 反转一个 boolean 值，即 true 变成 false；false 变成 true
    */
    reverse: function(arg)
    {
        return !MiniQuery.Boolean.parse(arg);
    }
});


//----------------------------------------------------------------------------------------------------------------
//包装类的实例方法

MiniQuery.Boolean.prototype = 
{
    constructor: MiniQuery.Boolean,
    value: false,
    
    init: function(b)
    {
        this.value = MiniQuery.Boolean.parse(b);
    },
    
    valueOf: function()
    {
        return this.value;
    },
    
    toString: function()
    {
        return this.value.toString();
    },
    
    toInt: function()
    {
        return this.value ? 1 : 0;
    },
    
    reverse: function()
    {
        this.value = !this.value;
        return this;
    }
};


MiniQuery.Boolean.prototype.init.prototype = MiniQuery.Boolean.prototype;

 
})(window.M139);