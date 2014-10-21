/**
 * @fileOverview 定义DOM操作相关的常用方法的静态类
 */

(function (jQuery, M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.JSON
    */
    M139.JSON = {
        /**
        *解析JSON字符串为对象，如果字符串为非标准JSON，则会抛异常
        */
        parse: function (text) {
            try {
                return jQuery.parseJSON(text);
            } catch (e) {
                throw "M139.JSON.parse Error";
            }
        },
        /**
        *解析一段非标准JSON字符串，返回一个对象，如果解析出错，则返回null
        */
        tryEval: function (text) {
            var obj = null;
            try {
                if (/^\s*\{/.test(text)) {
                    text = "(" + text + ")";
                }
                obj = eval(text);
            } catch (e) {

            }
            return obj;
        },
        /**
        *将对象序列为JSON字符串
        *@example
        M139.JSON.stringify({name:"Lily"});
        */
        stringify: function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else {
                if (typeof space === "string") {
                    indent = space;
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw "M139.JSON.stringify Error";
            }
            return str("", { "": value });
        }
    }
    //JSON库
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        /**@inner*/
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        /**@inner*/
        function tojson(key) {
            return this.valueOf();
        }
        /**@inner*/
        Boolean.prototype.toJSON = tojson;
        /**@inner*/
        String.prototype.toJSON = tojson;
        /**@inner*/
        Number.prototype.toJSON = tojson;
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" }, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
        return v;
    }


    if(!window.JSON){
        JSON = {
            parse:function(text){
                return M139.JSON.parse(text);
            },
            stringify:function(obj){
                return M139.JSON.stringify(obj);
            }
        }
    }

})(jQuery, M139);