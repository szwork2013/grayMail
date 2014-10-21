

;(function( MiniQuery )
{



/***********************************************************************************************************
* 对象工具
*/

MiniQuery.Object = function(obj)
{
    return new MiniQuery.Object.prototype.init(obj);
    
    
    
};


/**
* 用一个或多个其他对象来扩展一个对象，返回被扩展的对象。
* 
* 如果参数为空，则返回 null；
* 如果只有一个参数，则直接返回该参数；
* 否则：把第二个参数到最后一个参数的成员拷贝到第一个参数对应中去，并返回第一个参数。
* 如果被拷贝的对象是一个数组，则直接拷贝其中的元素。
*/
MiniQuery.Object.extend = function()
{
    var len = arguments.length;
    if(len == 0)
    {
        return null;
    }
    
    var target = arguments[0];
    if(len == 1)
    {
        return target;
    }
    
    for(var i=1; i<len; i++)
    {
        var obj = arguments[i];
        
        //这里不要用 MiniQuery.Object.isArray(obj)，因为该接口还没定义
        if( obj instanceof Array || Object.prototype.toString.call(obj) == '[object Array]' ) //数组
        {
            for(var index=0, size=obj.length; index < size; index++)
            {
                target[index] = obj[index];
            }
        }
        else
        {
            for(var name in obj)
            {
                target[name] = obj[name];
            }
        }

        
    }

    return target;
};


/**
* 把一个对象的名称-值对转成用指定分隔符连起来的字符串。
* 当不指定内部分隔符时，则默认为 "=" 号；
* 当不指定键值对的分隔符时，则默认为 "&" 号；
* 这里不要弄到下面的 extend 中，因为它使用的是 for in，而在 IE6/IE8 中，是枚举不到重写的内置成员的
*/
MiniQuery.Object.toString = function(nameValues, innerSeparator, pairSeparator)
{
    innerSeparator = innerSeparator || '=';
    pairSeparator = pairSeparator || '&';
    
    var pairs = [];
    for(var name in nameValues)
    {
        pairs.push(name + innerSeparator + nameValues[name]);
    }
    
    return pairs.join(pairSeparator);
    
};



MiniQuery.Object.extend( MiniQuery.Object, 
{
    /**
    * 递归地删除对象的成员中值为 null 或 undefined 的成员。
    * 当指定 isShallow 为 true 时，则不进行递归。
    */
    trim: function(obj, isShallow)
    {
        var idDeep = !isShallow; //换个名称更好理解
        
        for(var name in obj)
        {
            var value = obj[name];
            if(value == null) //null 或 undefined
            {
                delete obj[name]; //注意，这里不能用 delete value
            }
            
            if(typeof value == 'object' && idDeep) //递归
            {
                arguments.callee(value);
            }
        }
        
        return obj;
    },
    
    /**
    * 删除对象中指定的成员，返回一个新对象。
    * 指定的成员可以以单个的方式指定，也可以以数组的方式指定(批量)。
    */
    remove: function(obj, keys)
    {
        var target = MiniQuery.Object.extend({}, obj); //浅拷贝一份
        
        if( typeof keys == 'string' )
        {
            delete target[keys];
        }
        else
        {
            for(var i=0, len=keys.length; i<len; i++)
            {
                delete target[ keys[i] ];
            }
        }
        
        return target;
    },
    
    
    /**
    * 对象迭代器。
    * 只有在回调函数中明确返回 false 才停止循环
    */
    each: function(obj, fn)
    {       
        for(var name in obj)
        {
            if(fn(name, obj[name]) === false) // 只有在 fn 中明确返回 false 才停止循环
            {
               break;
            }
        }
    },
    
    /**
    * 对象映射转换器。返回一个新的对象
    */
    map: function(obj, fn)
    {
        var target = {};
        
        for(var key in obj)
        {
            target[key] = fn(obj[key], key);
        }
        
        return target;
    },
    
    
    
    
    
    /**
    * 用一组指定的名称-值对中的值去替换指定名称对应的值。
    * 当指定第三个参数为 true 时，将进行第一层次的搜索与替换，否则替换所有同名的成员为指定的值
    */
    replaceValues: function(target, nameValues, isShallow)
    {
        for(var key in target)
        {
            var val = target[key];
            switch(typeof val)
            {
                case 'string':
                case 'number':
                case 'boolean':
                    for(var name in nameValues)
                    {
                        if(key == name)
                        {
                            target[key] = nameValues[name];
                            break;
                        }
                    }
                    break;
                case 'object':
                    !isShallow && arguments.callee(val, nameValues);
                    break;
            }
        }
        return target;
    },
    
    /*
    * 把一个 Object 对象转成一个数组。
    *   当未指定参数 names 时，则使用 for in 迭代收集 obj 中的值，返回一个一维的值数组；
    *   当指定参数 names 为一个数组时，则按 names 中的顺序迭代收集 obj 中的值，返回一个一维的值的数组；
    *   当指定参数 names 为 true 时，则使用 for in 迭代收集 obj 中的名称和值，返回一个[key, value] 的二维数组，
    *       即该数组中的每一项的第0个元素为名称，第1个元素为值。
    * 
    */
    toArray: function(obj, names)
    {
        if(names === undefined) //未指定 names
        {
            var a = [];
            
            for(var i in obj)
            {
                a.push( obj[i] );
            }
            
            return a;
        }
        
        //否则，指定了 names 列表。
        
        if( names instanceof Array ) // []
        {
            //注意，这里不要用 MiniQuery.Array.map 来过滤，
            //因为 map 会忽略掉 null 和 undefined 的值，这是不合适的
            
            var a = [];
            
            for(var i=0, len=names.length; i<len; i++)
            {
                a.push( obj[ names[i] ] ); // names[i] -> key -> value
            }
            
            return a;
        }
        
        if(names === true) //指定了保留 key，则返回一个二维数组
        {
            var a = [];
            for(var i in obj)
            {
                var pair = [];      //[key, value]
                pair[0] = i;        //key
                pair[1] = obj[i];   //value
                
                a.push( pair );
            }
            
            return a; //此时为 [ [key, value], [key, value], ... ]
        }
    },
    
 
    
    /**
    * 把一个对象编码成等价结构的 Url 查询字符串。
    * 当指定第二个参数为 true 时，将使用 escape 来编码；否则使用 encodeURIComponent。
    */
    toQueryString: function(obj, isCompatible)
    {
        if(obj == null)     // null 或 undefined
        {
            return String(obj);
        }

        
        switch(typeof obj)
        {
            case 'string':
            case 'number':
            case 'boolean':
                return obj;
        }
        
        if(obj instanceof String || obj instanceof Number || obj instanceof Boolean || obj instanceof Date)
        {
            return obj.valueOf();
        }
        
        if( MiniQuery.Object.isArray(obj) )
        {
            return '[' + obj.join(', ') + ']';
        }
        
        var fn = arguments.callee;
        var encode = isCompatible ? escape : encodeURIComponent;
        
        var pairs = [];
        for(var name in obj)
        {
            pairs.push(  encode(name) + '=' + encode( fn(obj[name]) )  ); 
        }
        
        return pairs.join('&');
    },
    
    /*
    * 把 Url 中的查询字符串解析为等价结构的对象。
    * 当显式指定 isShallow 参数为 true 时，则使用浅层次来解析(只解析一层，不进行递归解析)。
    * 当指定 isCompatible 参数为 true 时，将使用 unescape 来编码；否则使用 decodeURIComponent。
    * 当参数 url 非法时，返回空对象 {}。
    * a=100&b=200&c=A%3D111%26B%3D222
    */
    parseQueryString: function(url, isShallow, isCompatible)
    {
        if(!url || typeof url != 'string')
        {
            return {}; //这里不要返回 null，免得外部调用出错
        }
        
        var fn = arguments.callee;
        var decode = isCompatible ? unescape : decodeURIComponent;  //解码方法，默认用后者
        var isDeep = !isShallow;    //深层次解析，为了语义上更好理解，换个名称
        var toValue = MiniQuery.String.toValue; //缓存一下方法，以提高循环中的性能
        
        
        var obj = {};
        
        var pairs = url.split('&');
        
        for(var i=0, len=pairs.length; i<len; i++)
        {
            var name_value = pairs[i].split('=');
            
            if(name_value.length > 1)
            {
                var name = decode( name_value[0] );
                var value = decode( name_value[1] );
                
                //深层次解析
                if(isDeep && value.indexOf('=') > 0) //还出现=号，说明还需要进一层次解码
                {
                    value = fn( value ); //递归调用
                }
                else //处理一下字符串类型的 0|1|true|false|null|undefined|NaN
                {
                    value = toValue( value ); //还原常用的数据类型
                }
                
                
                obj[name] = value;
            }
        }
        
        
        return obj;
    },
 
    
    
    /*
    * 给指定的对象快速创建多层次的命名空间，返回创建后的最内层的命名空间所指的对象。
    * 命名空间层次以 "." 分隔。当不指定要关联的值时，则默认为空对象{}
    */
    namespace: function(container, path, value)
    {
        var fn = arguments.callee;
        
        //此时为
        /*
            MiniQuery.Object.namespace(window.M139,
            {
                'Object': '$.Object',
                'Array': '$.Array',
                'String': '$.String'
            });
        */
        if( MiniQuery.Object.isPlain(path) && value === undefined )
        {
            //换个名称更容易理解
            var source = container; //此时第一个参数 container 为要被遍历拷贝的对象 source
            var maps = path;        //此时第二个参数 path 为键值对映射表 maps
            var container = window; //此时目标容器为当前的 window
            
            //遍历映射表
            MiniQuery.Object.each(maps, function(key, path)
            {
                if(typeof path != 'string')
                {
                    throw new Error('当指定第二个参数为键值对映射表时，值必须为 string 类型');
                }
                
                var value = source[key];
                fn( container, path, value );
            });
            
            return container;
        }
        
        //此时为 
        //MiniQuery.Object.namespace(window.$, window.M139, ['Object', 'Array', 'String']);
        if(typeof path == 'object' && MiniQuery.Object.isArray(value) )
        {
            //换个名称更容易理解
            var source = path;  //此时第二个参数 path 为要被遍历拷贝的对象 source
            var keys = value;   //此时第三个参数 value 是要拷贝的键列表
            
            //遍历键列表
            MiniQuery.Array.each(keys, function(key, index)
            {
                container[key] = source[key];
            });
            
            return container;
        }
        
        
        //此时为最原始的形式
        //MiniQuery.Object.namespace(window.$, 'A.B.C', {...});
        if(typeof path == 'string')
        {
            var list = path.split('.'); //路径
            var obj = container;
            
            var len = list.length;      //路径长度
            var lastIndex = len - 1;    //路径中最后一项的索引
            
            for(var i=0; i<len; i++) //迭代路径
            {
                var key = list[i];
                
                if(i < lastIndex)
                {
                    obj[key] = obj[key] || {};
                    obj = obj[key]; //为下一轮做准备
                }
                else //最后一项
                {
                    if(value === undefined) //不指定值时，则为空对象 {}
                    {
                        value = {};
                    }
                    
                    if( obj[key] ) //已经存在，则扩展
                    {
                        MiniQuery.Object.extend( obj[key], value );
                        value = obj[key]; //引用一下，在最后的 return 时用到。
                    }
                    else //否则，全量赋值
                    {
                        obj[key] = value;
                    }
                }
            }
            
            return value;
        }
    

        
    },
    
    

    /*
    * 检测对象是否是空对象(不包含任何属性)。
    * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使用hasOwnProperty)。
    */
    isEmpty: function(obj)
    {
        for (var name in obj) 
        {
            return false;
        }
        
        return true;
    },
    
    /**
    * 一个简单的方法来判断一个对象是否为 window 窗口。
    * 该实现为 jQuery 的版本。
    */
    isWindow: function(obj)
    {
        return obj && 
            typeof obj == 'object' && 
            'setInterval' in obj;
    },
    
    
    /**
    * 判断一个对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）。
    * 该实现为 jQuery 的版本。
    */
    isPlain: function(obj)
    {
        if(!obj || typeof obj != 'object' || obj.nodeType || MiniQuery.Object.isWindow(obj))
        {
            return false;
        }
        
        try 
	    {
		    // Not own constructor property must be Object
		    if (obj.constructor && 
		        !Object.prototype.hasOwnProperty.call(obj, "constructor") && 
		        !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) 
			{
			    return false;
		    }
	    } 
	    catch ( e ) 
	    {
		    // IE8,9 Will throw exceptions on certain host objects #9897
		    return false;
	    }

	    // Own properties are enumerated firstly, so to speed up,
	    // if last one is own, then all properties are own.
	    var key;
	    for ( key in obj ) 
	    {
	    }

	    return key === undefined || Object.prototype.hasOwnProperty.call(obj, key);
    },
    
    /**
    * 判断一个对象是否为值类型。
    * 即 typeof 的结果是否为 string、number、boolean 中的一个。
    */
    isValueType: function(obj)
    {
        return (/^(string|number|boolean)$/g).test(typeof obj);
    },
    
    /**
    * 判断一个对象是否为包装类型
    */
    isWrappedType: function(obj)
    {
        var types = [String, Number, Boolean];
        for(var i=0, len=types.length; i<len; i++)
        {
            if(obj instanceof types[i])
            {
                return true;
            }
        }
        
        return false;
    },
    
    /**
    * 判断一个对象是否为内置类型
    */
    isBuiltinType: function(obj)
    {
        var types = [String, Number, Boolean, Array, Date, RegExp, Function];
        
        for(var i=0, len=types.length; i<len; i++)
        {
            if(obj instanceof types[i])
            {
                return true;
            }
        }
        
        return false;
    },
    
    /**
    * 获取一个对象的类型。
    * 当参数为 null、undefined 时，返回 null、undefined；
    * 当参数为 string、number、boolean 的值类型时，返回 string、number、boolean；
    * 否则返回参数的实际类型的字符串描述(构造函数的名称)：
    * 如 Array、String、Number、Boolean、Object、Function、RegExp、Date 等
    */
    getType: function(obj)
    {
        return obj === null ? 'null' :
            obj === undefined ? 'undefined' : 
            
            //处理值类型
            typeof obj == 'string' ? 'string' : 
            typeof obj == 'number' ? 'number' : 
            typeof obj == 'boolean' ? 'boolean' : 
            
            //处理对象类型、包装类型
            Object.prototype.toString.call(obj).slice(8, -1); //去掉 "[object" 和 "]"
    },
    
    /**
    * 判断一个对象是否为数组类型
    */
    isArray: function(obj, isStrict)
    {
        if(isStrict === true) //指定了要严格判断
        {
            return obj instanceof Array;
        }
        
        
        //加上 obj instanceof Array 并且优先检测，是为了优化，也是为了安全起见。
        return (obj instanceof Array) || (MiniQuery.Object.getType(obj) == 'Array');
    }
    
    
    
    
    
});



//----------------------------------------------------------------------------------------------------------------
//包装类的实例方法

MiniQuery.Object.prototype = 
{
    constructor: MiniQuery.Object,
    value: {},
    
    init: function(obj)
    {
        this.value = Object(obj);
    },
    
    valueOf: function()
    {
        return this.value;
    },
    
    extend: function()
    {
        //其实是想执行 MiniQuery.Object.extend(this.value, arguments[0], arguments[1], …);
        var args = [this.value];
        args = args.concat( Array.prototype.slice.call(arguments, 0) );
        this.value = MiniQuery.Object.extend.apply(null, args);
        return this;
    },
    
    trim: function(isShallow)
    {
        this.value = MiniQuery.Object.trim(this.value, isShallow);
        return this;
    },
    
    remove: function(keys)
    {
        this.value = MiniQuery.Object.remove(this.value, keys);
        return this;
    },
    
    each: function(fn)
    {
        MiniQuery.Object.each(this.value, fn);
        return this;
    },
    
    map: function(fn)
    {
        this.value = MiniQuery.Object.map(this.value, fn);
        return this;
    },
    
    
    replaceValues: function(nameValues, isShallow)
    {
        this.value = MiniQuery.Object.replaceValues(this.value, nameValues, isShallow);
        return this;
    },
    
    toArray: function(names)
    {
        return MiniQuery.Object.toArray(this.value, names);
    },
    
    toString: function(innerSeparator, pairSeparator)
    {
        return MiniQuery.Object.toString(this.value, innerSeparator, pairSeparator);
    },
    
    toQueryString: function(isCompatible)
    {
        return MiniQuery.Object.toQueryString(this.value, isCompatible);
    },
    
    parseQueryString: function(url, isShallow, isCompatible)
    {
        this.value = MiniQuery.Object.parseQueryString(url, isShallow, isCompatible);
        return this;
    },
    
    namespace: function(path, value)
    {
        this.value = MiniQuery.Object.namespace(this.value, path, value);
        return this;
    },
    
    isEmpty: function()
    {
        return MiniQuery.Object.isEmpty(this.value);
    },
    
    isWindow: function()
    {
        return MiniQuery.Object.isWindow(this.value);
    },
    
    isPlain: function()
    {
        return MiniQuery.Object.isPlain(this.value);
    },
    
    isValueType: function()
    {
        return MiniQuery.Object.isValueType(this.value);
    },
    
    isWrappedType: function()
    {
        return MiniQuery.Object.isWrappedType(this.value);
    },
    
    isBuiltinType: function()
    {
        return MiniQuery.Object.isBuiltinType(this.value);
    },
    
    getType: function()
    {
        return MiniQuery.Object.getType(this.value);
    },
    
    isArray: function(isStrict)
    {
        return MiniQuery.Object.isArray(this.value, isStrict);
    }
};

MiniQuery.Object.prototype.init.prototype = MiniQuery.Object.prototype;
  
})( window.M139 );