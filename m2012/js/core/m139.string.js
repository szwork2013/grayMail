


;(function(MiniQuery)
{





/***********************************************************************************************************
*   字符串工具
*/

MiniQuery.String = function(string)
{
    if(arguments.length > 1) // 此时当作 $.String('{0}{1}..', arg1, arg2); 这样的调用
    {
        var args = Array.prototype.slice.call(arguments, 1);
        return MiniQuery.String.format(string, args);
    }
    
    return new MiniQuery.String.prototype.init(string);
};



MiniQuery.Object.extend( MiniQuery.String, 
{
    /**
    * 用指定的值去填充一个字符串。
    * 当不指定字符串的填充标记时，则默认为 {}。
    * 用法：
        $.String.format('<%0%><%1%>',     ['<%', '%>'], ['a', 'b']           ); //#1 
        $.String.format('<%id%><%type%>', ['<%', '%>'], {id: 1, type: 'app'} ); //#2 
        $.String.format('{0}{1}',         ['a',   'b']                       ); //#3 
        $.String.format('<%0%><%1%>',     ['<%', '%>'], 'a', 'b'             ); //#4 
        
        $.String.format('{id}{type}',     {id: 1, type: 'app'}               ); //#5 
        $.String.format('{2}{0}{1}',      'a', 'b', 'c'                      ); //#6 
    */
    format: function(string, arg1, arg2)
    {
        var fn = arguments.callee;

        if( MiniQuery.Array.hasItem(arg1) ) //#1 到 #4
        {
            if( MiniQuery.Array.hasItem(arg2) ) //#1
            {
                var tags = arg1;
                var list = arg2;
                
                var s = string;
                
                for(var i=0, len=list.length; i<len; i++)
                {
                    var sample = tags[0] + '' + i + tags[1]; // <%i%> 或 {i}
                    s = MiniQuery.String.replaceAll(s, sample, list[i]); // <%i%>  -->  list[i]
                }
                
                return s;
            }

            if(typeof arg2 == 'object')//#2
            {
                var tags = arg1;
                var nameValues = arg2;
                
                var s = string;
                for(var name in nameValues)
                {
                    var sample = tags[0] + name + tags[1];
                    s = MiniQuery.String.replaceAll(s, sample,  nameValues[name]);
                }
                
                return s;
            }
            
            if(arg2 === undefined) //#3
            {
                var tags = ['{', '}'];
                var list = arg1;
                return MiniQuery.String.format(string, tags, list);
            }
            
            //#4
            var args = Array.prototype.slice.call(arguments, 2);
            return fn(string, arg1, args);  //转到 #1
            
        } 
        else // #5 到 #6
        {
            if(typeof arg1 == 'object') //#5
            {
                return fn(string, ['{', '}'], arg1); //转到 #2
            }
            
            //#6
            var args = Array.prototype.slice.call(arguments, 1);
            return fn(string, ['{', '}'], args); //转到 #1
        }
        
    },
    
    /**
    * 对 Url 中的查询字符串进行合并，返回一个 Url 字符串。
    * 当在 queryStrings 参数的成员中指定 null 或 undefined 值，则删除原有的查询字符串中的对应项。
    * 当指定 isCompatible 参数为 true 时，将使用 escape 来编码；否则使用 encodeURIComponent。
    */
    formatQueryString: function(url, queryStrings, isCompatible)
    {
        if(!queryStrings)
        {
            return url;
        }
        
        
        if(url.indexOf('?') < 0) //不包含 '?'
        {
            queryStrings = MiniQuery.Object.trim(queryStrings); //删除空白项
            return url + '?' + MiniQuery.Object.toQueryString(queryStrings);
        }
        
        var parts = url.split('?');
        var uri = parts[0];
        var search = parts[1];
        
        var olds = MiniQuery.Object.parseQueryString(search); //旧的参数
        
        var merged = MiniQuery.Object.extend(olds, queryStrings); //合并后的参数
        var news = MiniQuery.Object.trim(merged); //删除空白项
        
        return uri + '?' + MiniQuery.Object.toQueryString(merged, isCompatible);
    },

    /**
    * 对字符串进行全局替换
    */
    replaceAll: function(target, src, dest)
    {
        return target.split(src).join(dest);
    },
    
    /**
    * 移除指定的字符子串
    */
    removeAll: function(target, src)
    {
        return MiniQuery.String.replaceAll(target, src, '');
    },
    
    /**
    * 从当前 String 对象移除所有前导空白字符和尾部空白字符。
    */
    trim: function(string)
    {
        return string.replace(/(^\s*)|(\s*$)/g, '');
    },
    
    /**
    * 从当前 String 对象移除所有前导空白字符。
    */
    trimStart: function(string)
    {
	    return string.replace(/(^\s*)/g, '');
    },

    /**
    * 从当前 String 对象移除所有尾部空白字符。
    */
    trimEnd: function(string)
    {
	    return string.replace(/(\s*$)/g, '');
    },
    
    /**
    * 对一个字符串进行多层次分裂，返回一个多维数组。
    * 返回的数组的维数，跟指定的分隔符 separators 的长度一致
    */
    split: function(string, separators)
    {
        var list = String(string).split( separators[0] );
        
        for(var i=1, len=separators.length; i<len; i++)
        {
            list = fn(list, separators[i], i);
        }
        
        return list;
        
        
        //一个内部方法
        function fn(list, separator, dimension)
        {
            dimension--;
            
            return MiniQuery.Array.map(list, function(item, index)
            {
                return dimension == 0 ? 
                
                    String(item).split( separator ) :
                    
                    fn(item, separator, dimension); //递归
            });
        }
        
        
    },
    
    /**
    * 把字符串按指定分隔符进行分裂，返回一个已移除的空白项的数组。
    * 当不指定分隔符时，默认为一个空格。
    */
    splitTrim: function(target, separator)
    {
        separator = separator || ' ';
        return MiniQuery.Array.map(target.split(separator), function(item, index)
        {
            return item == '' ? null : item;
        });
    },
    
    
    /**
    *  确定一个字符串的开头是否与指定的字符串匹配。
    */
    startsWith: function(str, dest, ignoreCase)
    {
        if(ignoreCase)
        {
            var src = str.substring(0, dest.length);
            return src.toUpperCase() === dest.toString().toUpperCase();
        }
        
        return str.indexOf(dest) == 0;
    },


    /**
    *  确定一个字符串的末尾是否与指定的字符串匹配。
    */
    endsWith: function(str, dest, ignoreCase)
    {
        var len0 = str.length;
        var len1 = dest.length;
        var delta = len0 - len1;
        
        
        if(ignoreCase)
        {
            var src = str.substring(delta, len0);
            return src.toUpperCase() === dest.toString().toUpperCase();
        }
        
        return str.lastIndexOf(dest) == delta;
    },
    
    /**
    * 确定一个字符串是否包含指定的子字符串。
    */
    contains: function(string, target)
    {
        return string.indexOf(target) > -1;    
    },
    
    
    /**
     * 右对齐此实例中的字符，在左边用指定的 Unicode 字符填充以达到指定的总长度。
     * 当指定的总长度小实际长度时，将从右边开始算起，做截断处理，以达到指定的总长度。
     */
    padLeft: function(string, totalWidth, paddingChar)
    {
        string = String(string); //转成字符串
        
        var len = string.length;
        if(totalWidth <= len) //需要的长度短于实际长度，做截断处理
        {
            return string.substr(-totalWidth); //从后面算起
        }
        
        paddingChar = paddingChar || ' ';
        
        var arr = [];
        arr.length = totalWidth - len + 1;
        

        return arr.join(paddingChar) + string;
    },

    /**
    * 左对齐此字符串中的字符，在右边用指定的 Unicode 字符填充以达到指定的总长度。
    * 当指定的总长度小实际长度时，将从左边开始算起，做截断处理，以达到指定的总长度。
    */
    padRight: function(string, totalWidth, paddingChar)
    {
        string = String(string); //转成字符串
        
        var len = string.length;
        if(len >= totalWidth)
        {
            return string.substring(0, totalWidth);
        }
        
        paddingChar = paddingChar || ' ';
        
        var arr = [];
        arr.length = totalWidth - len + 1;
        

        return string + arr.join(paddingChar);
    },
    
    
    /**
    * 转成骆驼命名法。
    * 如 font-size 转成 fontSize
    */
    toCamelCase: function(string) 
    {
        var rmsPrefix = /^-ms-/;
        var rdashAlpha = /-([a-z]|[0-9])/ig;
        
        return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, function(all, letter) 
        {          
		    return letter.toString().toUpperCase();
	    });
	    
	    /* 下面的是 mootool 的实现
	    return string.replace(/-\D/g, function(match)
	    {
			return match.charAt(1).toUpperCase();
		});
		*/
    },
    
    /**
    * 转成短线连接法。
    * 如 fontSize 转成 font-size
    */
    toHyphenate: function(string)
    {
		return string.replace(/[A-Z]/g, function(match)
		{
			return ('-' + match.charAt(0).toLowerCase());
		});
	},
	
	/**
    * 获取位于两个标记子串之间的子字符串。
    * 当获取不能结果时，统一返回空字符串。
    */
	between: function(string, tag0, tag1)
	{
	    var startIndex = string.indexOf(tag0);
	    if (startIndex < 0)
	    {
		    return '';
	    }
    	
	    startIndex += tag0.length;
    	
	    var endIndex = string.indexOf(tag1, startIndex);
	    if (endIndex < 0)
	    {
		    return '';
	    }
    	
	    return string.substr(startIndex,  endIndex - startIndex);
	},
	
	/**
    * 把一个字符串转成 UTF8 编码，返回一个编码码的新的字符串。
    */
	toUtf8: function(string)
    {
	    var encodes = [];
    	
	    MiniQuery.Array.each( string.split(''), function(ch, index)
	    {
		    var code = ch.charCodeAt(0);
            if (code < 0x80) 
            {
                encodes.push(code);
            }
            else if (code < 0x800) 
            {
                encodes.push(((code & 0x7C0) >> 6) | 0xC0);
                encodes.push((code & 0x3F) | 0x80);
            }
            else 
            {
                encodes.push(((code & 0xF000) >> 12) | 0xE0);
                encodes.push(((code & 0x0FC0) >> 6) | 0x80);
                encodes.push(((code & 0x3F)) | 0x80);
            }
	    });
    	
	    return '%' + MiniQuery.Array.map(encodes, function(item, index)
	    {
		    return item.toString(16);
	    }).join('%');
    },
    
    /**
    * 把一个字符串转成等价的值。
    * 主要是把字符串形式的 0|1|true|false|null|undefined|NaN 转成原来的数据值。
    * 当参数不是字符串或不是上述值之一时，则直接返回该参数，不作转换。
    */ 
    toValue: function(value)
    {
        if(typeof value != 'string') //拦截非字符串类型的参数
        {
            return value;
        }
        
        
        var maps = 
        {
            '0': 0,
            '1': 1,
            'true': true,
            'false': false,
            'null': null,
            'undefined': undefined,
            'NaN': NaN
        };
        
        return value in maps ? maps[value] : value;
      
    }

});


//----------------------------------------------------------------------------------------------------------------
//包装类的实例方法

MiniQuery.String.prototype = 
{
    constructor: MiniQuery.String,
    value: '',
    
    init: function(string)
    {
        this.value = String(string);

    },
    
    toString: function()
    {
        return this.value;
    },
    
    valueOf: function()
    {
        return this.value;
    },
    
    format: function(arg1, arg2)
    {
        this.value = MiniQuery.String.format(this.value, arg1, arg2);
        return this;
    },
    
    formatQueryString: function(queryStrings, isCompatible)
    {
        this.value = MiniQuery.String.formatQueryString(this.value, queryStrings, isCompatible);
        return this;
    },
    
    replaceAll: function(src, dest)
    {
        this.value = MiniQuery.String.replaceAll(this.value, src, dest);
        return this;
    },
    
    removeAll: function(src)
    {
        this.value = MiniQuery.String.replaceAll(this.value, src, '');
        return this;
    },
    
    trim: function()
    {
        this.value = MiniQuery.String.trim(this.value);
        return this;
    },
    
    trimStart: function()
    {
        this.value = MiniQuery.String.trimStart(this.value);
        return this;
    },
    
    trimEnd: function()
    {
        this.value = MiniQuery.String.trimEnd(this.value);
        return this;
    },
    
    split: function(separators)
    {
        return MiniQuery.String.split(this.value, separators);
    },
    
    splitTrim: function(separator)
    {
        return MiniQuery.String.splitTrim(this.value, separator);
    },
    
    startsWith: function(dest, ignoreCase)
    {
        return MiniQuery.String.startsWith(this.value, dest, ignoreCase);
    },
    
    endsWith: function(dest, ignoreCase)
    {
        return MiniQuery.String.endsWith(this.value, dest, ignoreCase);
    },
    
    contains: function(target)
    {
        return MiniQuery.String.contains(this.value, target);
    },
    
    padLeft: function(totalWidth, paddingChar)
    {
        this.value = MiniQuery.String.padLeft(this.value, totalWidth, paddingChar);
        return this;
    },
    
    padRight: function(totalWidth, paddingChar)
    {
        this.value = MiniQuery.String.padRight(this.value, totalWidth, paddingChar);
        return this;
    },
    
    toCamelCase: function() 
    {
        this.value = MiniQuery.String.toCamelCase(this.value);
        return this;
    },
    
    toHyphenate: function()
    {
        this.value = MiniQuery.String.toHyphenate(this.value);
        return this;
    },
    
    between: function(tag0, tag1)
    {
        this.value = MiniQuery.String.between(this.value, tag0, tag1);
        return this;
    },
    
    toUtf8: function()
    {
        this.value = MiniQuery.String.toUtf8(this.value);
        return this;
    },
    
    toValue: function(value)
    {
        return MiniQuery.String.toValue( this.value );
    }
};

MiniQuery.String.prototype.init.prototype = MiniQuery.String.prototype;

 
})(window.M139);